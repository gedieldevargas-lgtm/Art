// Cadastro aberto por universo (cadastro.html?u=eom): serve pro link que o Gediel manda no grupo do WhatsApp.
// Cria a conta já confirmada, marcada com origem (eom/culture) pra plataforma abrir a interface certa.
// Não libera nenhum produto: quem assina depois ganha acesso pela compra (Kiwify), como sempre.
const URL_MEMBROS = process.env.MEMBROS_URL || 'https://jzdxcefnlwjgimymgsux.supabase.co';
const resp = (status, obj) => ({ statusCode: status, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(obj) });
const corta = (v, n) => { v = String(v == null ? '' : v).trim(); return v ? v.slice(0, n) : ''; };
const UNIVERSOS = ['eom', 'culture'];

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return resp(405, { erro: 'use POST' });
  const KEY = process.env.MEMBROS_SERVICE_KEY;
  if (!KEY) return resp(500, { erro: 'Cadastro indisponível no momento. Avise o Gediel.' });
  const sk = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' };
  let p; try { p = JSON.parse(event.body || '{}'); } catch (e) { return resp(400, { erro: 'pedido inválido' }); }
  const u = corta(p.u, 20).toLowerCase();
  if (!UNIVERSOS.includes(u)) return resp(400, { erro: 'Link inválido.' });
  if (p.site) return resp(200, { ok: true });           // isca de robô
  const email = corta(p.email, 160).toLowerCase(), nome = corta(p.nome, 120), senha = String(p.senha || '');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return resp(400, { erro: 'Confira o e-mail.' });
  if (nome.length < 2) return resp(400, { erro: 'Escreva o seu nome.' });
  if (senha.length < 6) return resp(400, { erro: 'A senha precisa ter pelo menos 6 caracteres.' });
  const whatsapp = corta(p.whatsapp, 40);
  const meta = { full_name: nome, name: nome, origem: u, ...(whatsapp ? { whatsapp } : {}) };
  const c = await fetch(`${URL_MEMBROS}/auth/v1/admin/users`, { method: 'POST', headers: sk, body: JSON.stringify({ email, password: senha, email_confirm: true, user_metadata: meta }) });
  if (c.ok) return resp(200, { ok: true, u });
  const txt = await c.text();
  if (/already|registered|exists/i.test(txt)) return resp(200, { ok: true, existia: true, u });   // não mexe na conta existente
  return resp(502, { erro: 'Não consegui criar a conta agora. Tente de novo em 1 minuto.' });
};
