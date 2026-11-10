/* Aba "Pessoas" do painel: junta numa lista só todo mundo que deixou contato
   (chat do Programa, pedido de Mentoria particular, catálogo antigo e quem comprou na Kiwify),
   com os interesses que a pessoa mostrou no Hub (modos, fichas, cliques). Filtros e planilha. */
(() => {
  const A = window.EBG_ADMIN;
  if (!A) return;
  const { sb } = A;
  const $ = (s, el = document) => el.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const data = d => (d ? new Date(d).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }) : '');
  const real = v => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const soNum = t => String(t || '').replace(/\D/g, '');
  const tel = t => { let n = soNum(t); if (!n) return ''; if (n.length <= 11) n = '55' + n; return n; };
  const insta = t => { const s = String(t || '').trim().replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/[/?].*$/, '').replace(/^@/, ''); return s ? '@' + s.toLowerCase() : ''; };
  const FONTES = { programa: 'Programa (chat)', mentoria: 'Mentoria particular', catalogo: 'Catálogo antigo', compra: 'Comprou' };
  const NOMES_MODO = Object.fromEntries((window.EBG && window.EBG.modos || []).map(m => [m.id, m.nome]));
  let pessoas = [], eventosPorVisitante = new Map(), marcas = {};

  async function ler(tabela, colunas = '*', max = 20000) {
    const out = [];
    for (let de = 0; de < max; de += 1000) {
      const { data: d, error } = await sb.from(tabela).select(colunas).order('created_at', { ascending: false }).range(de, de + 999);
      if (error) return { erro: error, linhas: out };
      out.push(...d); if (d.length < 1000) break;
    }
    return { linhas: out };
  }

  async function carregar() {
    const box = $('#pessoasLista');
    box.innerHTML = '<p class="sub">Carregando…</p>';
    const mc = await sb.from('crm_marcas').select('chave,chamado,chamado_em').like('chave', 'tel:%').limit(20000);
    marcas = Object.fromEntries(((mc && mc.data) || []).map(m => [m.chave, m]));
    const [prog, ment, cat, vend, evs] = await Promise.all([
      ler('leads_programa'), ler('leads_mentoria'), ler('leads', 'id,created_at,nome,whatsapp,instagram,email,objetivo,origem'),
      ler('vendas', 'created_at,pedido,status,produto,valor,nome,email,whatsapp,instagram,utm_source,pago_em'),
      ler('hub_eventos', 'created_at,visitante,tipo,item,rotulo,modo', 50000)
    ]);
    eventosPorVisitante = new Map();
    evs.linhas.forEach(e => { if (!eventosPorVisitante.has(e.visitante)) eventosPorVisitante.set(e.visitante, []); eventosPorVisitante.get(e.visitante).push(e); });

    // junta a mesma pessoa pelo WhatsApp, pelo e-mail ou pelo Instagram
    const mapa = new Map(); const lista = [];
    function achar(r) {
      const chaves = [tel(r.whatsapp) && 't:' + tel(r.whatsapp).slice(-9), r.email && 'e:' + String(r.email).toLowerCase().trim(), insta(r.instagram) && 'i:' + insta(r.instagram)].filter(Boolean);
      let p = chaves.map(k => mapa.get(k)).find(Boolean);
      if (!p) { p = { nome: '', whatsapp: '', email: '', instagram: '', fontes: new Set(), visitantes: new Set(), registros: [], compras: [], primeiro: null, ultimo: null, nivel: '', objetivos: '', modo: '' }; lista.push(p); }
      chaves.forEach(k => mapa.set(k, p));
      return p;
    }
    function somar(fonte, r, extra = {}) {
      const p = achar(r);
      p.fontes.add(fonte);
      p.nome = p.nome || r.nome || ''; p.whatsapp = p.whatsapp || tel(r.whatsapp); p.email = p.email || (r.email || '').toLowerCase();
      p.instagram = p.instagram || insta(r.instagram); if (r.visitante) p.visitantes.add(r.visitante);
      p.nivel = p.nivel || r.nivel || ''; p.objetivos = p.objetivos || r.objetivos || r.objetivo || ''; p.modo = p.modo || r.modo || '';
      p.registros.push({ fonte, quando: r.created_at, ...r, ...extra });
      if (!p.primeiro || r.created_at < p.primeiro) p.primeiro = r.created_at;
      if (!p.ultimo || r.created_at > p.ultimo) p.ultimo = r.created_at;
      return p;
    }
    prog.linhas.forEach(r => somar('programa', r));
    ment.linhas.forEach(r => somar('mentoria', r));
    cat.linhas.forEach(r => somar('catalogo', r, { objetivos: NOMES_MODO[r.objetivo] || r.objetivo }));
    vend.linhas.forEach(r => { const p = somar('compra', r); p.compras.push(r); });

    // interesses: o que a pessoa ligou, abriu e clicou no Hub
    lista.forEach(p => {
      const cont = new Map();
      [...p.visitantes].forEach(v => (eventosPorVisitante.get(v) || []).forEach(e => {
        let k = null;
        if (e.tipo === 'modo') k = e.rotulo || NOMES_MODO[e.item] || e.item;
        else if (e.tipo === 'ficha' || (e.tipo === 'clique' && e.rotulo && e.rotulo.length < 60)) k = e.rotulo;
        if (k) cont.set(k, (cont.get(k) || 0) + (e.tipo === 'modo' ? 3 : e.tipo === 'ficha' ? 2 : 1));
      }));
      if (p.modo) cont.set(NOMES_MODO[p.modo] || p.modo, (cont.get(NOMES_MODO[p.modo] || p.modo) || 0) + 3);
      p.compras.forEach(c => c.produto && cont.set(c.produto, (cont.get(c.produto) || 0) + 5));
      p.interesses = [...cont.entries()].sort((a, b) => b[1] - a[1]).map(x => x[0]).slice(0, 8);
      p.gasto = p.compras.filter(c => c.status === 'paid' || c.status === 'approved').reduce((a, c) => a + Number(c.valor || 0), 0);
    });
    pessoas = lista.sort((a, b) => (b.ultimo || '').localeCompare(a.ultimo || ''));

    const faltam = [prog, ment, vend].filter(x => x.erro).length;
    $('#pessoasAviso').textContent = faltam ? 'Algumas tabelas ainda não existem. Rode supabase/dados.sql e supabase/vendas.sql no Supabase.' : '';
    // opções de interesse
    const todos = new Map(); pessoas.forEach(p => p.interesses.forEach(i => todos.set(i, (todos.get(i) || 0) + 1)));
    $('#pfInteresse').innerHTML = '<option value="">Todos os interesses</option>' + [...todos.entries()].sort((a, b) => b[1] - a[1]).map(([i, n]) => `<option value="${esc(i)}">${esc(i)} (${n})</option>`).join('');
    desenhar();
  }

  function filtradas() {
    const q = $('#pfBusca').value.trim().toLowerCase(), qn = soNum(q);
    const fonte = $('#pfFonte').value, inter = $('#pfInteresse').value, tem = $('#pfTem').value, dias = Number($('#pfPeriodo').value);
    const lim = dias ? new Date(Date.now() - dias * 864e5).toISOString() : '';
    return pessoas.filter(p =>
      (!q || [p.nome, p.email, p.instagram, p.objetivos, p.interesses.join(' ')].join(' ').toLowerCase().includes(q) || (qn.length >= 4 && p.whatsapp.includes(qn)))
      && (!fonte || p.fontes.has(fonte)) && (!inter || p.interesses.includes(inter))
      && (!tem || (tem === 'whatsapp' ? p.whatsapp : tem === 'email' ? p.email : tem === 'instagram' ? p.instagram : tem === 'comprou' ? p.gasto > 0 : !p.gasto))
      && (!lim || (p.ultimo || '') >= lim));
  }

  function desenhar() {
    const f = filtradas();
    const comprou = f.filter(p => p.gasto > 0);
    $('#pessoasResumo').innerHTML = [
      [f.length, 'pessoas'], [f.filter(p => p.whatsapp).length, 'com WhatsApp'], [f.filter(p => p.email).length, 'com e-mail'],
      [f.filter(p => p.instagram).length, 'com Instagram'], [comprou.length, 'compraram'], [real(comprou.reduce((a, p) => a + p.gasto, 0)), 'em vendas']
    ].map(([n, r]) => `<div class="kpi"><b>${n}</b><span>${r}</span></div>`).join('');
    $('#pessoasLista').innerHTML = f.length ? `<div class="tabela-wrap"><table class="tabela pessoas"><thead><tr><th>Chamei</th><th>Pessoa</th><th>Contato</th><th>Veio por</th><th>Interesses</th><th>Comprou</th><th>Último contato</th></tr></thead><tbody>${f.map((p, i) => `
      <tr data-pessoa="${pessoas.indexOf(p)}" class="${(marcas['tel:' + p.whatsapp] || {}).chamado ? 'chamado' : ''}"><td data-sem-abrir>${p.whatsapp ? `<label class="chamei"><input type="checkbox" data-chamei="tel:${esc(p.whatsapp)}" ${(marcas['tel:' + p.whatsapp] || {}).chamado ? 'checked' : ''}><span>${(marcas['tel:' + p.whatsapp] || {}).chamado ? data((marcas['tel:' + p.whatsapp] || {}).chamado_em) : ''}</span></label>` : ''}</td><td><b>${esc(p.nome || '(sem nome)')}</b>${p.nivel ? `<small>${esc(p.nivel)}</small>` : ''}</td>
        <td>${p.whatsapp ? `<a class="link" target="_blank" rel="noopener" href="https://wa.me/${p.whatsapp}" data-sem-abrir data-marca-whats="tel:${esc(p.whatsapp)}">${esc(p.whatsapp)}</a>` : ''}${p.email ? `<small>${esc(p.email)}</small>` : ''}${p.instagram ? `<small><a class="link" target="_blank" rel="noopener" href="https://instagram.com/${esc(p.instagram.slice(1))}" data-sem-abrir>${esc(p.instagram)}</a></small>` : ''}</td>
        <td>${[...p.fontes].map(x => `<span class="hub-tag ${x}">${esc(FONTES[x])}</span>`).join(' ')}</td>
        <td>${p.interesses.slice(0, 4).map(x => `<span class="chip-int">${esc(x)}</span>`).join(' ')}</td>
        <td>${p.gasto ? real(p.gasto) : '—'}</td><td>${data(p.ultimo)}</td></tr>`).join('')}</tbody></table></div>`
      : '<p class="vazio">Ninguém com esses filtros.</p>';
  }

  function detalhe(p) {
    const evs = [...p.visitantes].flatMap(v => eventosPorVisitante.get(v) || []).sort((a, b) => b.created_at.localeCompare(a.created_at));
    const NOMES_EV = { clique: 'Clicou', link: 'Abriu link', ficha: 'Abriu ficha', modo: 'Ligou', visto: 'Viu', chat: 'Chat', login: 'Entrar', secao: 'Viu seção', tempo: 'Tempo' };
    const campos = r => Object.entries(r).filter(([k, v]) => v && !['id', 'visitante', 'sessao', 'bruto', 'fonte', 'quando', 'created_at', 'respostas'].includes(k)).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('');
    $('#pessoaCorpo').innerHTML = `<h2>${esc(p.nome || '(sem nome)')}</h2>
      <p class="sub">${[p.whatsapp && `<a class="link" target="_blank" rel="noopener" href="https://wa.me/${p.whatsapp}">WhatsApp ${esc(p.whatsapp)}</a>`, p.email && `<a class="link" href="mailto:${esc(p.email)}">${esc(p.email)}</a>`, p.instagram && `<a class="link" target="_blank" rel="noopener" href="https://instagram.com/${esc(p.instagram.slice(1))}">${esc(p.instagram)}</a>`].filter(Boolean).join(' · ')}</p>
      <p><b>Interesses:</b> ${p.interesses.map(x => `<span class="chip-int">${esc(x)}</span>`).join(' ') || '—'}</p>
      ${p.compras.length ? `<h3>Compras</h3><ul>${p.compras.map(c => `<li>${esc(c.produto)} · ${real(c.valor)} · ${esc(c.status)} · ${data(c.created_at)}</li>`).join('')}</ul>` : ''}
      <h3>Cadastros</h3>${p.registros.map(r => `<details class="hub-item"><summary><strong>${esc(FONTES[r.fonte])}</strong><span class="hub-tag">${data(r.quando)}</span></summary><dl class="dl">${campos(r)}</dl></details>`).join('')}
      <h3>O que fez no Hub <small>${evs.length} ações</small></h3>
      ${evs.length ? `<ol class="linha-tempo">${evs.filter(e => e.tipo !== 'secao' && e.tipo !== 'tempo').slice(0, 120).map(e => `<li><span>${data(e.created_at)}</span> ${esc(NOMES_EV[e.tipo] || e.tipo)}: <b>${esc(e.rotulo || e.item || '')}</b>${e.modo ? ` <small>(${esc(NOMES_MODO[e.modo] || e.modo)})</small>` : ''}</li>`).join('')}</ol>`
        : '<p class="vazio">Sem histórico de navegação (cadastro feito antes do rastreamento, ou por outro aparelho).</p>'}`;
    $('#modalPessoa').showModal();
  }

  function baixar() {
    const f = filtradas();
    const linhas = f.map(p => ({ nome: p.nome, whatsapp: p.whatsapp, email: p.email, instagram: p.instagram, veio_por: [...p.fontes].map(x => FONTES[x]).join(' + '),
      nivel: p.nivel, objetivos: p.objetivos, interesses: p.interesses.join(', '), comprou: p.compras.map(c => c.produto).join(', '), gasto: p.gasto, primeiro_contato: p.primeiro, ultimo_contato: p.ultimo }));
    if (!linhas.length) return;
    const cols = Object.keys(linhas[0]), cel = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const csv = '﻿' + [cols.join(';'), ...linhas.map(l => cols.map(c => cel(l[c])).join(';'))].join('\n');
    Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })), download: `pessoas-${new Date().toISOString().slice(0, 10)}.csv` }).click();
  }

  document.addEventListener('input', e => { if (e.target.closest && e.target.closest('#pessoasFiltros')) desenhar(); });
  document.addEventListener('click', e => {
    if (e.target.closest('#pessoasBaixar')) baixar();
    if (e.target.closest('#pessoasRecarregar')) carregar();
    if (e.target.closest('#fecharPessoa')) $('#modalPessoa').close();
    const tr = e.target.closest('#pessoasLista tr[data-pessoa]');
    if (tr && !e.target.closest('[data-sem-abrir]')) detalhe(pessoas[Number(tr.dataset.pessoa)]);
  });

  window.EBG_PESSOAS = { abrir: () => { if (!pessoas.length) carregar(); }, marcou: m => { if (m.chave.startsWith('tel:')) { marcas[m.chave] = m; if (pessoas.length) desenhar(); } } };
})();
