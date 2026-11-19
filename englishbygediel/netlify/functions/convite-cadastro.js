// Link de cadastro privado (convite.html?c=CODIGO): o Gediel gera no Painel Admin → Criar acesso,
// escolhe o plano e manda no privado. A pessoa preenche nome, e-mail e senha; a conta é criada
// já confirmada, com o plano do link liberado. O link vale para UM cadastro e depois se desliga.
// Usa a tabela maratona_convites (turma = 'privado') e a MEMBROS_SERVICE_KEY do Painel Admin.
const URL_MEMBROS = process.env.MEMBROS_URL || 'https://jzdxcefnlwjgimymgsux.supabase.co';
const resp = (status, obj) => ({ statusCode: status, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(obj) });
const corta = (v, n) => { v = String(v == null ? '' : v).trim(); return v ? v.slice(0, n) : ''; };

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return resp(405, { erro: 'use POST' });
  const KEY = process.env.MEMBROS_SERVICE_KEY;
  if (!KEY) return resp(500, { erro: 'Falta a variável MEMBROS_SERVICE_KEY no Netlify.' });
  const sk = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' };
  let p; try { p = JSON.parse(event.body || '{}'); } catch (e) { return resp(400, { erro: 'pedido inválido' }); }

  const codigo = corta(p.codigo, 60);
  if (!/^[\w-]{6,60}$/.test(codigo)) return resp(403, { erro: 'Link inválido. Peça um novo link pro Gediel.' });
  const cv = await fetch(`${URL_MEMBROS}/rest/v1/maratona_convites?select=codigo,turma,plano,ativo&codigo=eq.${encodeURIComponent(codigo)}&turma=eq.privado`, { headers: sk });
  const conv = cv.ok ? (await cv.json())[0] : null;
  if (!conv || !conv.ativo) return resp(403, { erro: 'Este link já foi usado ou foi desligado. Peça um novo pro Gediel.' });
  const plano = conv.plano;
  if (p.so_checar) return resp(200, { ok: true, plano });

  const email = corta(p.email, 160).toLowerCase(), nome = corta(p.nome, 120), senha = String(p.senha || '');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return resp(400, { erro: 'Confira o e-mail.' });
  if (nome.length < 2) return resp(400, { erro: 'Escreva o seu nome.' });
  if (senha.length < 6) return resp(400, { erro: 'A senha precisa ter pelo menos 6 caracteres.' });
  const whatsapp = corta(p.whatsapp, 40);
  const meta = { full_name: nome, name: nome, produto: plano, convite: codigo, ...(whatsapp ? { whatsapp } : {}) };

  let existia = false;
  const c = await fetch(`${URL_MEMBROS}/auth/v1/admin/users`, { method: 'POST', headers: sk, body: JSON.stringify({ email, password: senha, email_confirm: true, user_metadata: meta }) });
  if (!c.ok) {
    const txt = await c.text();
    if (!/already|registered|exists/i.test(txt)) return resp(502, { erro: 'Não consegui criar a conta agora. Tente de novo em 1 minuto.' });
    existia = true;
    let alvo = null;
    for (let pg = 1; pg <= 10 && !alvo; pg++) {
      const l = await fetch(`${URL_MEMBROS}/auth/v1/admin/users?page=${pg}&per_page=200`, { headers: sk });
      const us = l.ok ? ((await l.json()).users || []) : [];
      alvo = us.find(u => String(u.email || '').toLowerCase() === email);
      if (us.length < 200) break;
    }
    if (alvo) await fetch(`${URL_MEMBROS}/auth/v1/admin/users/${alvo.id}`, { method: 'PUT', headers: sk, body: JSON.stringify({ user_metadata: { ...(alvo.user_metadata || {}), ...meta, produto: (alvo.user_metadata || {}).produto || plano } }) });
  }

  const up = (tabela, linha, conflito) => fetch(`${URL_MEMBROS}/rest/v1/${tabela}?on_conflict=${conflito}`, { method: 'POST', headers: { ...sk, Prefer: 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify(linha) });
  const r = await up('compras', { pedido: `convite-${codigo}`.slice(0, 200), email, produto: plano }, 'pedido');
  if (!r.ok) return resp(502, { erro: 'Conta criada, mas não consegui liberar o plano. Avise o Gediel.' });
  // plano Inteligente: grava também o 1º produto da lista do Programa (é o que a plataforma confere pras aulas)
  if (/inteligente/i.test(plano)) {
    try {
      const cf = await fetch(`${URL_MEMBROS}/rest/v1/acesso?select=dados&id=eq.cfg`, { headers: sk });
      const dados = cf.ok ? ((await cf.json())[0] || {}).dados || {} : {};
      const prog = (dados.programa || [])[0];
      if (prog) await up('compras', { pedido: `convite-programa-${codigo}`.slice(0, 200), email, produto: prog }, 'pedido');
    } catch (e) {}
  }
  // link de uso único: desliga
  await fetch(`${URL_MEMBROS}/rest/v1/maratona_convites?codigo=eq.${encodeURIComponent(codigo)}`, { method: 'PATCH', headers: { ...sk, Prefer: 'return=minimal' }, body: JSON.stringify({ ativo: false }) });
  return resp(200, { ok: true, existia, plano });
};
