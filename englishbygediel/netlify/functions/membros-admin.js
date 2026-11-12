// Painel Admin da área de membros: listar/criar/apagar alunos e trocar senha.
// A chave secreta do Supabase dos membros fica SÓ aqui (variável MEMBROS_SERVICE_KEY no Netlify), nunca na página.
const URL_MEMBROS = process.env.MEMBROS_URL || 'https://jzdxcefnlwjgimymgsux.supabase.co';
const resp = (status, obj) => ({ statusCode: status, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(obj) });

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return resp(405, { erro: 'use POST' });
  const KEY = process.env.MEMBROS_SERVICE_KEY;
  if (!KEY) return resp(500, { erro: 'Falta a variável MEMBROS_SERVICE_KEY no Netlify.' });
  const token = (event.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) return resp(401, { erro: 'Entre na área de membros primeiro.' });
  const sk = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' };

  // quem está chamando?
  const u = await fetch(`${URL_MEMBROS}/auth/v1/user`, { headers: { apikey: KEY, Authorization: `Bearer ${token}` } });
  if (!u.ok) return resp(401, { erro: 'Sessão expirada. Entre de novo.' });
  const email = String((await u.json()).email || '').toLowerCase();
  const a = await fetch(`${URL_MEMBROS}/rest/v1/admins?select=email&email=ilike.${encodeURIComponent(email)}`, { headers: sk });
  const lista = a.ok ? await a.json() : [];
  if (!email || !lista.length) return resp(403, { erro: 'Só o admin pode usar isto.' });

  let p; try { p = JSON.parse(event.body || '{}'); } catch (e) { return resp(400, { erro: 'pedido inválido' }); }
  const path = String(p.path || ''), method = String(p.method || 'GET').toUpperCase();
  if (!/^\/auth\/v1\/admin\/users(\/[0-9a-f-]{36})?(\?[\w=&]*)?$/.test(path) || !['GET', 'POST', 'PUT', 'DELETE'].includes(method)) return resp(400, { erro: 'ação não permitida' });
  if (method === 'DELETE') {
    // apagar aluno: só um por vez, e nunca uma conta de admin
    if (!/^\/auth\/v1\/admin\/users\/[0-9a-f-]{36}$/.test(path)) return resp(400, { erro: 'ação não permitida' });
    const alvo = await fetch(URL_MEMBROS + path, { headers: sk });
    if (!alvo.ok) return resp(404, { erro: 'Aluno não encontrado.' });
    const alvoEmail = String((await alvo.json()).email || '').toLowerCase();
    const ad = await fetch(`${URL_MEMBROS}/rest/v1/admins?select=email&email=ilike.${encodeURIComponent(alvoEmail)}`, { headers: sk });
    if (ad.ok && (await ad.json()).length) return resp(400, { erro: 'Essa é uma conta de admin, não dá pra apagar por aqui.' });
  }
  const r = await fetch(URL_MEMBROS + path, { method, headers: sk, body: method === 'GET' ? undefined : JSON.stringify(p.body || {}) });
  return { statusCode: r.status, headers: { 'Content-Type': 'application/json' }, body: await r.text() };
};
