/* Aba Produtos → "Produtos da Kiwify": todos os produtos que você vende na Kiwify,
   com as vendas de cada um (da tabela vendas), e um botão pra colocar o produto no Hub.
   Usa a função /.netlify/functions/kiwify-api (precisa das chaves da API da Kiwify no Netlify). */
(() => {
  const A = window.EBG_ADMIN;
  if (!A) return;
  const { sb, aviso } = A;
  const $ = (s, el = document) => el.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const real = v => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const norm = t => String(t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  let produtos = [], vendas = [], noHub = new Set();

  async function api(acao, extra = {}) {
    const { data } = await sb.auth.getSession();
    const r = await fetch('/.netlify/functions/kiwify-api', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${data.session ? data.session.access_token : ''}` },
      body: JSON.stringify({ acao, ...extra })
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.erro || ('erro ' + r.status));
    return j;
  }

  async function carregarVendas() {
    const out = [];
    for (let de = 0; de < 20000; de += 1000) {
      const { data, error } = await sb.from('vendas').select('produto,produto_id,status,valor,created_at').range(de, de + 999);
      if (error) return out;
      out.push(...data); if (data.length < 1000) break;
    }
    return out;
  }
  async function carregarHub() {
    const { data } = await sb.from('site_config').select('dados').eq('id', 'hub').maybeSingle();
    const cards = (data && data.dados && data.dados.cards) || [];
    noHub = new Set(cards.map(c => c.id).concat(cards.map(c => norm(c.titulo))));
  }

  function desenhar() {
    const box = $('#kiwifyLista');
    // produtos vindos da API; se ainda não buscou, mostra os que já apareceram nas vendas
    let lista = produtos.slice();
    if (!lista.length) {
      const m = new Map(); vendas.forEach(v => { const k = v.produto_id || norm(v.produto); if (k && !m.has(k)) m.set(k, { id: v.produto_id || '', nome: v.produto, preco: null, status: 'com vendas', link: '' }); });
      lista = [...m.values()];
    }
    if (!lista.length) { box.innerHTML = '<p class="vazio">Toque em "Buscar produtos da Kiwify". Se aparecer erro, falta colocar as chaves da API da Kiwify no Netlify (passo a passo no Claude).</p>'; return; }
    const pagos = v => v.status === 'paid' || v.status === 'approved';
    const linhas = lista.map(p => {
      const dele = vendas.filter(v => (p.id && v.produto_id === p.id) || norm(v.produto) === norm(p.nome));
      const ok = dele.filter(pagos);
      return { p, qtd: ok.length, receita: ok.reduce((a, v) => a + Number(v.valor || 0), 0), reemb: dele.filter(v => /refund|charge/.test(v.status || '')).length };
    }).sort((a, b) => b.receita - a.receita);
    const total = linhas.reduce((a, l) => a + l.receita, 0);
    box.innerHTML = `<div class="kpis kiwify-kpis"><div class="kpi"><b>${lista.length}</b><span>produtos</span></div><div class="kpi"><b>${linhas.reduce((a, l) => a + l.qtd, 0)}</b><span>vendas pagas</span></div><div class="kpi"><b>${real(total)}</b><span>faturado</span></div></div>
      <div class="tabela-wrap"><table class="tabela"><thead><tr><th>Produto</th><th>Preço</th><th>Status</th><th>Vendas</th><th>Faturado</th><th>Reemb.</th><th>No Hub</th></tr></thead><tbody>
      ${linhas.map(({ p, qtd, receita, reemb }) => {
        const ja = noHub.has('k-' + p.id) || noHub.has(norm(p.nome));
        return `<tr><td><strong>${esc(p.nome)}</strong>${p.tipo ? `<small>${esc(p.tipo)}</small>` : ''}</td><td>${p.preco != null ? real(p.preco > 1000 ? p.preco / 100 : p.preco) : '—'}</td>
          <td>${esc(p.status || '')}</td><td>${qtd}</td><td>${real(receita)}</td><td>${reemb || ''}</td>
          <td>${ja ? '<span class="selo">já está</span>' : `<button class="botao" type="button" data-por-hub="${esc(p.id || p.nome)}">Colocar no Hub</button>`}</td></tr>`;
      }).join('')}</tbody></table></div>`;
  }

  async function carregar() {
    $('#kiwifyLista').innerHTML = '<p class="sub">Carregando…</p>';
    [vendas] = await Promise.all([carregarVendas(), carregarHub()]);
    desenhar();
  }

  async function buscar() {
    const b = $('#kiwifyBuscar'); b.disabled = true; b.textContent = 'Buscando…';
    try { produtos = (await api('produtos')).produtos || []; aviso(`${produtos.length} produtos da Kiwify.`); }
    catch (e) { aviso('Kiwify: ' + e.message); }
    b.disabled = false; b.textContent = 'Buscar produtos da Kiwify';
    desenhar();
  }

  async function sincronizar() {
    const b = $('#kiwifyVendas'); b.disabled = true; b.textContent = 'Trazendo vendas…';
    try { const r = await api('sincronizar', { dias: 365 }); aviso(`${r.importadas} vendas trazidas da Kiwify.`); vendas = await carregarVendas(); }
    catch (e) { aviso('Kiwify: ' + e.message); }
    b.disabled = false; b.textContent = 'Trazer vendas (último ano)';
    desenhar();
  }

  async function porNoHub(chave) {
    const p = produtos.find(x => x.id === chave) || produtos.find(x => x.nome === chave) || { id: '', nome: chave };
    const { data } = await sb.from('site_config').select('dados').eq('id', 'hub').maybeSingle();
    const base = window.HUB_DADOS.padrao(window.EBG || {}, window.EBG_CONFIG || {});
    const H = window.HUB_DADOS.juntar(base, data && data.dados);
    const preco = p.preco != null ? Number(p.preco > 1000 ? p.preco / 100 : p.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '';
    H.cards.push({ id: 'k-' + (p.id || Date.now().toString(36)), tipo: 'pago', ativo: true, titulo: p.nome, linha: '', nome: '', setor: 'Kiwify',
      img: p.capa || '', preco, link: p.link || '', botao: 'Quero o ' + p.nome, link2: '', botao2: '', video: '', sinopse: '', meta: '', modos: [] });
    const { error } = await sb.from('site_config').upsert({ id: 'hub', dados: H, updated_at: new Date().toISOString() });
    if (error) { aviso('Não deu pra salvar no Hub.'); return; }
    aviso(`"${p.nome}" entrou no Hub. Abra a aba Hub → Cards pra pôr capa, link e descrição.`);
    await carregarHub(); desenhar();
  }

  document.addEventListener('click', e => {
    if (e.target.closest('#kiwifyBuscar')) buscar();
    if (e.target.closest('#kiwifyVendas')) sincronizar();
    const h = e.target.closest('[data-por-hub]'); if (h) porNoHub(h.dataset.porHub);
  });
  window.EBG_KIWIFY = { abrir: carregar };
})();
