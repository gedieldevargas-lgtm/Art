// Link de cadastro automático da Maratona (maratona-entrar.html?c=CODIGO).
// A pessoa preenche nome, e-mail, senha e o perfil; aqui a conta é criada já confirmada,
// com o plano da turma (ex.: Plano Inteligente) e já dentro da maratona (menu exclusivo liberado).
// Se o e-mail já tem conta, só junta os dados novos e libera a maratona (a senha antiga continua).
// Usa a mesma MEMBROS_SERVICE_KEY do Painel Admin. O código do link fica na tabela maratona_convites.
const URL_MEMBROS = process.env.MEMBROS_URL || 'https://jzdxcefnlwjgimymgsux.supabase.co';
const resp = (status, obj) => ({ statusCode: status, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(obj) });
const corta = (v, n) => { v = String(v == null ? '' : v).trim(); return v ? v.slice(0, n) : ''; };

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return resp(405, { erro: 'use POST' });
  const KEY = process.env.MEMBROS_SERVICE_KEY;
  if (!KEY) return resp(500, { erro: 'Falta a variável MEMBROS_SERVICE_KEY no Netlify.' });
  const sk = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' };
  let p; try { p = JSON.parse(event.body || '{}'); } catch (e) { return resp(400, { erro: 'pedido inválido' }); }

  // 1) o código do link vale?
  const codigo = corta(p.codigo, 60);
  if (!/^[\w-]{6,60}$/.test(codigo)) return resp(403, { erro: 'Link inválido. Peça o link certo no grupo da maratona.' });
  const cv = await fetch(`${URL_MEMBROS}/rest/v1/maratona_convites?select=turma,plano,ativo&codigo=eq.${encodeURIComponent(codigo)}`, { headers: sk });
  const conv = cv.ok ? (await cv.json())[0] : null;
  if (!conv || !conv.ativo) return resp(403, { erro: 'Este link não está mais ativo. Fale com o Gediel.' });
  if (p.so_checar) return resp(200, { ok: true, turma: conv.turma });

  // 2) dados da pessoa
  const email = corta(p.email, 160).toLowerCase(), nome = corta(p.nome, 120), senha = String(p.senha || '');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return resp(400, { erro: 'Confira o e-mail.' });
  if (nome.length < 2) return resp(400, { erro: 'Escreva o seu nome.' });
  const perfil = {};
  ['whatsapp', 'instagram', 'cidade', 'pais', 'nivel', 'objetivo', 'turno', 'profissao', 'nascimento', 'igreja'].forEach(k => { const v = corta(p[k], 200); if (v) perfil[k] = v; });
  const meta = { full_name: nome, name: nome, produto: conv.plano, maratona: conv.turma, ...perfil,
    cadastro_maratona: { ...perfil, turma: conv.turma, em: new Date().toISOString() } };

  // 3) cria a conta (ou junta na que já existe)
  let existia = false;
  if (senha.length < 6) return resp(400, { erro: 'A senha precisa ter pelo menos 6 caracteres.' });
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
    if (alvo) await fetch(`${URL_MEMBROS}/auth/v1/admin/users/${alvo.id}`, { method: 'PUT', headers: sk, body: JSON.stringify({ user_metadata: { ...(alvo.user_metadata || {}), ...meta, produto: (alvo.user_metadata || {}).produto || conv.plano } }) });
  }

  // 4) acesso ao plano + entrada na maratona
  const up = (tabela, linha, conflito) => fetch(`${URL_MEMBROS}/rest/v1/${tabela}?on_conflict=${conflito}`, { method: 'POST', headers: { ...sk, Prefer: 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify(linha) });
  await up('compras', { pedido: `maratona-${conv.turma}-${email}`.slice(0, 200), email, produto: conv.plano }, 'pedido');
  const mm = await up('maratona_membros', { email, nome, turma: conv.turma }, 'email');
  if (!mm.ok) return resp(502, { erro: 'Conta criada, mas não consegui liberar a maratona. Avise o Gediel.' });
  return resp(200, { ok: true, existia, turma: conv.turma });
};
