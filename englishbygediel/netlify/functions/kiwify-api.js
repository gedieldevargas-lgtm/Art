// Painel → Kiwify: lista os produtos e traz as vendas pra tabela "vendas" do Supabase.
// Só responde ao admin do painel (confere o login no Supabase e a tabela admins).
// No Netlify (Site configuration → Environment variables), além das do kiwify.js:
//   KIWIFY_CLIENT_ID, KIWIFY_CLIENT_SECRET, KIWIFY_ACCOUNT_ID
//   (Kiwify → Apps → API → Criar API key: mostra os três)
const API = 'https://public-api.kiwify.com/v1';
const json = (statusCode, body) => ({ statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
const pega = (o, ...cs) => { for (const c of cs) { const v = c.split('.').reduce((a, k) => (a && a[k] !== undefined ? a[k] : undefined), o); if (v !== undefined && v !== null && v !== '') return v; } return null; };

async function ehAdmin(token) {
  const url = (process.env.SUPABASE_URL || '').replace(/\/$/, ''), chave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !chave || !token) return false;
  const u = await fetch(`${url}/auth/v1/user`, { headers: { apikey: chave, Authorization: `Bearer ${token}` } });
  if (!u.ok) return false;
  const email = ((await u.json()).email || '').toLowerCase();
  if (!email) return false;
  const r = await fetch(`${url}/rest/v1/admins?select=email&email=ilike.${encodeURIComponent(email)}`, { headers: { apikey: chave, Authorization: `Bearer ${chave}` } });
  return r.ok && (await r.json()).length > 0;
}

async function tokenKiwify() {
  const corpo = new URLSearchParams({ client_id: process.env.KIWIFY_CLIENT_ID || '', client_secret: process.env.KIWIFY_CLIENT_SECRET || '' });
  const r = await fetch(`${API}/oauth/token`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: corpo });
  if (!r.ok) throw new Error('kiwify token ' + r.status + ': ' + (await r.text()).slice(0, 200));
  return (await r.json()).access_token;
}
async function kiwify(token, caminho) {
  const r = await fetch(`${API}${caminho}`, { headers: { Authorization: `Bearer ${token}`, 'x-kiwify-account-id': process.env.KIWIFY_ACCOUNT_ID || '' } });
  if (!r.ok) throw new Error('kiwify ' + caminho.split('?')[0] + ' ' + r.status + ': ' + (await r.text()).slice(0, 200));
  return r.json();
}
const lista = d => (Array.isArray(d) ? d : d.data || d.items || d.products || d.sales || []);

// procura, em qualquer lugar do produto, um link de checkout da Kiwify (pay.kiwify.com.br/...)
function acharLink(o) {
  let achou = '';
  (function ande(v) {
    if (achou || v == null) return;
    if (typeof v === 'string') { const m = v.match(/https:\/\/pay\.kiwify\.com\.br\/[\w-]+/); if (m) achou = m[0]; return; }
    if (Array.isArray(v)) return v.forEach(ande);
    if (typeof v === 'object') Object.values(v).forEach(ande);
  })(o);
  return achou;
}

async function produtos(t) {
  const out = [];
  for (let p = 1; p <= 20; p++) {
    const d = await kiwify(t, `/products?page_size=100&page_number=${p}`);
    const l = lista(d); out.push(...l);
    if (l.length < 100) break;
  }
  // quem veio sem link na lista: tenta o detalhe do produto
  for (const p of out) {
    if (acharLink(p) || pega(p, 'checkout_url')) continue;
    try { const d = await kiwify(t, `/products/${encodeURIComponent(pega(p, 'id', 'product_id'))}`); p.__detalhe = d; } catch (e) {}
  }
  return out.map(p => ({
    id: String(pega(p, 'id', 'product_id') || ''), nome: pega(p, 'name', 'product_name') || '',
    preco: pega(p, 'price', 'offers.0.price', 'payment_options.0.price'), status: pega(p, 'status') || '',
    tipo: pega(p, 'type', 'product_type') || '', criado: pega(p, 'created_at') || '',
    link: pega(p, 'checkout_url') || acharLink(p) || '', capa: pega(p, 'cover_image', 'image', 'thumbnail') || ''
  }));
}

async function vendas(t, dias) {
  // a API deixa buscar no máximo 90 dias por vez: vai de 90 em 90
  const fim = new Date(), out = [];
  for (let ini = new Date(Date.now() - dias * 864e5); ini < fim; ini = new Date(ini.getTime() + 90 * 864e5)) {
    const ate = new Date(Math.min(fim.getTime(), ini.getTime() + 89 * 864e5));
    const f = d => d.toISOString().slice(0, 10);
    for (let p = 1; p <= 50; p++) {
      const d = await kiwify(t, `/sales?start_date=${f(ini)}&end_date=${f(ate)}&page_size=100&page_number=${p}`);
      const l = lista(d); out.push(...l);
      if (l.length < 100) break;
    }
  }
  return out;
}

async function gravarVendas(lista) {
  const url = process.env.SUPABASE_URL.replace(/\/$/, ''), chave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const linhas = lista.map(v => {
    const cent = pega(v, 'net_amount', 'payment.charge_amount', 'charge_amount', 'Commissions.charge_amount', 'amount');
    const pago = pega(v, 'approved_date', 'paid_at');
    return {
      pedido: String(pega(v, 'id', 'order_id', 'reference') || ''), status: pega(v, 'status', 'order_status'),
      evento: 'importado', produto: pega(v, 'product.name', 'Product.product_name', 'product_name'), produto_id: pega(v, 'product.id', 'Product.product_id'),
      valor: cent != null ? Number(cent) / 100 : null, moeda: pega(v, 'currency', 'payment.currency') || 'BRL', metodo: pega(v, 'payment_method', 'payment.method'),
      nome: pega(v, 'customer.name', 'Customer.full_name', 'customer.full_name'), email: pega(v, 'customer.email', 'Customer.email'),
      whatsapp: pega(v, 'customer.mobile', 'customer.phone', 'Customer.mobile'), instagram: pega(v, 'customer.instagram', 'Customer.instagram'),
      utm_source: pega(v, 'tracking.utm_source', 'TrackingParameters.utm_source'), utm_campaign: pega(v, 'tracking.utm_campaign', 'TrackingParameters.utm_campaign'),
      pago_em: pago ? new Date(pago).toISOString() : null, created_at: pega(v, 'created_at') ? new Date(pega(v, 'created_at')).toISOString() : undefined,
      atualizado: new Date().toISOString(), bruto: v
    };
  }).filter(l => l.pedido);
  for (let i = 0; i < linhas.length; i += 200) {
    const r = await fetch(`${url}/rest/v1/vendas?on_conflict=pedido`, {
      method: 'POST', body: JSON.stringify(linhas.slice(i, i + 200)),
      headers: { apikey: chave, Authorization: `Bearer ${chave}`, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' }
    });
    if (!r.ok) throw new Error('supabase ' + (await r.text()).slice(0, 200));
  }
  return linhas.length;
}

exports.handler = async event => {
  if (event.httpMethod !== 'POST') return json(405, { erro: 'use POST' });
  const token = (event.headers.authorization || event.headers.Authorization || '').replace(/^Bearer\s+/i, '');
  try {
    if (!(await ehAdmin(token))) return json(401, { erro: 'Só o admin do painel pode usar isto.' });
    if (!process.env.KIWIFY_CLIENT_ID || !process.env.KIWIFY_CLIENT_SECRET || !process.env.KIWIFY_ACCOUNT_ID)
      return json(400, { erro: 'Faltam KIWIFY_CLIENT_ID, KIWIFY_CLIENT_SECRET e KIWIFY_ACCOUNT_ID no Netlify.' });
    const pedido = JSON.parse(event.body || '{}');
    const t = await tokenKiwify();
    if (pedido.acao === 'produtos') return json(200, { produtos: await produtos(t) });
    if (pedido.acao === 'sincronizar') {
      const v = await vendas(t, Math.min(Number(pedido.dias) || 365, 1095));
      return json(200, { importadas: await gravarVendas(v) });
    }
    return json(400, { erro: 'ação desconhecida' });
  } catch (e) { return json(502, { erro: String(e.message || e).slice(0, 300) }); }
};
