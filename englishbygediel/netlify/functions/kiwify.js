// Recebe os avisos de venda da Kiwify e grava na tabela "vendas" do Supabase.
// Na Kiwify: Apps → Webhooks → URL: https://englishbygediel.netlify.app/.netlify/functions/kiwify
// No Netlify (Site configuration → Environment variables):
//   SUPABASE_URL                 https://iwivldvubmsqyzkkdxoy.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY    Supabase → Project Settings → API → service_role (secreta: só aqui, nunca no site)
//   KIWIFY_TOKEN                 o token que a Kiwify mostra ao criar o webhook
const crypto = require('crypto');

const pega = (o, ...caminhos) => {
  for (const c of caminhos) {
    const v = c.split('.').reduce((a, k) => (a && a[k] !== undefined ? a[k] : undefined), o);
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return null;
};

exports.handler = async event => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'use POST' };
  const corpo = event.isBase64Encoded ? Buffer.from(event.body || '', 'base64').toString('utf8') : (event.body || '');
  const token = process.env.KIWIFY_TOKEN;
  if (token) {
    const assinatura = (event.queryStringParameters || {}).signature || '';
    const certa = crypto.createHmac('sha1', token).update(corpo).digest('hex');
    if (!assinatura || assinatura.length !== certa.length || !crypto.timingSafeEqual(Buffer.from(assinatura), Buffer.from(certa)))
      return { statusCode: 401, body: 'assinatura inválida' };
  }
  let d;
  try { d = JSON.parse(corpo); } catch (e) { return { statusCode: 400, body: 'json inválido' }; }
  const pedido = pega(d, 'order_id', 'order_ref', 'id');
  if (!pedido) return { statusCode: 400, body: 'sem order_id' };
  const centavos = pega(d, 'Commissions.charge_amount', 'Commissions.product_base_price', 'charge_amount');
  const linha = {
    pedido: String(pedido),
    status: pega(d, 'order_status', 'status'),
    evento: pega(d, 'webhook_event_type', 'event'),
    produto: pega(d, 'Product.product_name', 'product.name', 'product_name'),
    produto_id: pega(d, 'Product.product_id', 'product.id'),
    valor: centavos != null ? Number(centavos) / 100 : null,
    moeda: pega(d, 'Commissions.currency', 'currency') || 'BRL',
    metodo: pega(d, 'payment_method'),
    nome: pega(d, 'Customer.full_name', 'Customer.first_name', 'customer.name'),
    email: pega(d, 'Customer.email', 'customer.email'),
    whatsapp: pega(d, 'Customer.mobile', 'Customer.phone', 'customer.mobile'),
    instagram: pega(d, 'Customer.instagram', 'customer.instagram'),
    utm_source: pega(d, 'TrackingParameters.utm_source', 'tracking.utm_source'),
    utm_campaign: pega(d, 'TrackingParameters.utm_campaign', 'tracking.utm_campaign'),
    pago_em: pega(d, 'approved_date', 'paid_at') ? new Date(pega(d, 'approved_date', 'paid_at')).toISOString() : null,
    atualizado: new Date().toISOString(),
    bruto: d
  };
  const url = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
  const chave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !chave) return { statusCode: 500, body: 'faltam SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no Netlify' };
  const r = await fetch(`${url}/rest/v1/vendas?on_conflict=pedido`, {
    method: 'POST',
    headers: { apikey: chave, Authorization: `Bearer ${chave}`, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(linha)
  });
  if (!r.ok) return { statusCode: 502, body: 'supabase: ' + (await r.text()).slice(0, 300) };
  return { statusCode: 200, body: 'ok' };
};
