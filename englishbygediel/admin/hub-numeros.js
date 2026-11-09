/* Aba "Dados do Hub" do painel: quem entrou, de onde, o que clicou, o que viu, e os cadastros
   (Programa de Acompanhamento e Mentoria particular). Lê as tabelas de supabase/dados.sql. */
(() => {
  const A = window.EBG_ADMIN;
  if (!A) return;
  const { sb } = A;
  const $ = (s, el = document) => el.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const quando = d => new Date(d).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  let dias = 7, cache = {};

  const desde = () => (dias ? new Date(Date.now() - dias * 864e5).toISOString() : '1970-01-01');
  async function tudo(tabela, colunas) {
    const linhas = [];
    for (let de = 0; de < 50000; de += 1000) {
      const { data, error } = await sb.from(tabela).select(colunas).gte('created_at', desde()).order('created_at', { ascending: false }).range(de, de + 999);
      if (error) throw error;
      linhas.push(...data);
      if (data.length < 1000) break;
    }
    return linhas;
  }
  const contar = (lista, chave) => { const m = new Map(); lista.forEach(x => { const k = chave(x); if (k) m.set(k, (m.get(k) || 0) + 1); }); return [...m.entries()].sort((a, b) => b[1] - a[1]); };
  const ranking = (lista, vazio, max = 12) => {
    if (!lista.length) return `<p class="vazio">${vazio}</p>`;
    const topo = lista[0][1];
    return `<ol class="barras">${lista.slice(0, max).map(([k, v]) => `<li><span class="barra-rot" title="${esc(k)}">${esc(k)}</span><span class="barra"><i style="width:${Math.max(4, v / topo * 100)}%"></i></span><b>${v}</b></li>`).join('')}</ol>`;
  };
  const host = u => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return ''; } };
  const origemDe = v => v.utm_source ? `${v.utm_source}${v.utm_campaign ? ' · ' + v.utm_campaign : ''}` : v.de ? `bio: ${v.de}` : v.origem ? host(v.origem) : 'Direto (link digitado ou app)';

  async function carregar() {
    const box = $('#dadosHub');
    box.innerHTML = '<p class="sub">Carregando…</p>';
    let visitas, eventos, programa, mentoria, vendas = [];
    try {
      [visitas, eventos, programa, mentoria] = await Promise.all([
        tudo('hub_visitas', 'created_at,visitante,nova,origem,utm_source,utm_campaign,de,tipo_aparelho,fuso,idioma'),
        tudo('hub_eventos', 'created_at,visitante,tipo,item,rotulo,secao,modo,valor'),
        tudo('leads_programa', '*'),
        tudo('leads_mentoria', '*')
      ]);
    } catch (e) {
      box.innerHTML = '<p class="vazio">Ainda não há tabelas de dados. Rode o arquivo <b>supabase/dados.sql</b> no Supabase (SQL Editor → New query → Run).</p>';
      return;
    }
    try { vendas = await tudo('vendas', 'created_at,pedido,status,produto,valor,nome,email,metodo,utm_source'); } catch (e) { vendas = null; }
    cache = { programa, mentoria, vendas: vendas || [] };
    const unicos = new Set(visitas.map(v => v.visitante)).size;
    const novos = visitas.filter(v => v.nova).length;
    const cliques = eventos.filter(e => e.tipo === 'clique' || e.tipo === 'link' || e.tipo === 'login');
    const tempos = eventos.filter(e => e.tipo === 'tempo' && e.item === 'pagina' && e.valor > 0 && e.valor < 7200).map(e => e.valor);
    const media = tempos.length ? Math.round(tempos.reduce((a, b) => a + b, 0) / tempos.length) : 0;
    const rol = eventos.filter(e => e.tipo === 'tempo' && e.item === 'rolagem_max').map(e => e.valor || 0);
    const rolMedia = rol.length ? Math.round(rol.reduce((a, b) => a + b, 0) / rol.length) : 0;
    const passos = eventos.filter(e => e.tipo === 'chat' && e.item === 'passo');
    const comecaram = new Set(passos.map(e => e.visitante)).size;
    const kpi = (n, r) => `<div class="kpi"><b>${n}</b><span>${r}</span></div>`;

    box.innerHTML = `
      <div class="kpis">
        ${kpi(visitas.length, 'visitas')}${kpi(unicos, 'pessoas diferentes')}${kpi(novos, 'primeira vez')}
        ${kpi(cliques.length, 'cliques')}${kpi(media >= 60 ? Math.floor(media / 60) + 'min ' + (media % 60) + 's' : media + 's', 'tempo médio na página')}
        ${kpi(rolMedia + '%', 'quanto rolam, em média')}${kpi(comecaram, 'começaram o chat')}${kpi(programa.length, 'cadastros no Programa')}${kpi(mentoria.length, 'pedidos de Mentoria')}
      </div>
      ${vendasHTML(vendas, eventos)}
      <div class="duas">
        <div class="cartao"><h3>Mais clicados</h3>${ranking(contar(cliques, e => e.rotulo || e.item), 'Nenhum clique ainda.')}</div>
        <div class="cartao"><h3>Mais vistos (cards na tela por 1s)</h3>${ranking(contar(eventos.filter(e => e.tipo === 'visto'), e => e.rotulo || e.item), 'Nada visto ainda.')}</div>
      </div>
      <div class="duas">
        <div class="cartao"><h3>Fichas abertas (tocaram no card)</h3>${ranking(contar(eventos.filter(e => e.tipo === 'ficha'), e => e.rotulo || e.item), 'Nenhuma ficha aberta ainda.')}</div>
        <div class="cartao"><h3>Modos ligados</h3>${ranking(contar(eventos.filter(e => e.tipo === 'modo'), e => e.rotulo || e.item), 'Nenhum modo ligado ainda.')}</div>
      </div>
      <div class="duas">
        <div class="cartao"><h3>De onde vieram</h3>${ranking(contar(visitas, origemDe), 'Sem visitas no período.')}</div>
        <div class="cartao"><h3>Aparelho</h3>${ranking(contar(visitas, v => v.tipo_aparelho), '—')}<h3 style="margin-top:18px">Seções que mais aparecem na tela</h3>${ranking(contar(eventos.filter(e => e.tipo === 'secao'), e => e.item), '—', 8)}</div>
      </div>
      <div class="duas">
        <div class="cartao"><h3>Chat de aplicação: até onde vão</h3>${ranking(contar(passos, e => `${String(e.valor).padStart(2, '0')}. ${e.rotulo}`).sort((a, b) => a[0] < b[0] ? -1 : 1), 'Ninguém começou o chat ainda.', 15)}</div>
        <div class="cartao"><h3>Horários com mais visitas</h3>${ranking(contar(visitas, v => new Date(v.created_at).getHours().toString().padStart(2, '0') + 'h'), '—', 24)}</div>
      </div>
      <div class="cartao">
        <div class="cabeca"><h3>Cadastros · Programa de Acompanhamento <span class="conta">${programa.length}</span></h3><button class="botao" type="button" data-baixar="programa">Baixar planilha</button></div>
        ${tabela(programa, [['created_at', 'Quando', quando], ['nome', 'Nome'], ['whatsapp', 'WhatsApp', w => w ? `<a class="link" target="_blank" rel="noopener" href="https://wa.me/${esc(String(w).replace(/\D/g, '').replace(/^(?!55)/, '55'))}">${esc(w)}</a>` : ''], ['nivel', 'Nível'], ['objetivos', 'Objetivos'], ['investimento', 'Investir?'], ['modo', 'Modo']], 'Ninguém preencheu o chat ainda.')}
      </div>
      <div class="cartao">
        <div class="cabeca"><h3>Pedidos · Mentoria particular <span class="conta">${mentoria.length}</span></h3><button class="botao" type="button" data-baixar="mentoria">Baixar planilha</button></div>
        ${tabela(mentoria, [['created_at', 'Quando', quando], ['nome', 'Nome'], ['whatsapp', 'WhatsApp'], ['email', 'E-mail'], ['formato', 'Formato'], ['nivel', 'Nível'], ['objetivo', 'Objetivo']], 'Nenhum pedido ainda. O formulário de mentoria precisa gravar na tabela leads_mentoria (veja a explicação no Claude).')}
      </div>
      <div class="cartao"><h3>Últimas visitas</h3>
        ${tabela(visitas.slice(0, 40), [['created_at', 'Quando', quando], ['tipo_aparelho', 'Aparelho'], ['nova', 'Primeira vez', v => v ? 'sim' : 'não'], ['origem', 'De onde', (v, l) => esc(origemDe(l))], ['fuso', 'Fuso'], ['idioma', 'Idioma']], 'Sem visitas no período.')}
      </div>`;
  }

  function vendasHTML(vendas, eventos) {
    const real = v => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    if (vendas === null) return '<div class="cartao"><h3>Vendas</h3><p class="vazio">Pra ver as vendas, rode <b>supabase/vendas.sql</b> no Supabase e ligue o webhook da Kiwify (passo a passo no Claude).</p></div>';
    const pagas = vendas.filter(v => v.status === 'paid' || v.status === 'approved');
    const receita = pagas.reduce((a, v) => a + Number(v.valor || 0), 0);
    const reemb = vendas.filter(v => /refund|charge/.test(v.status || '')).length;
    const pend = vendas.filter(v => /waiting|pending/.test(v.status || '')).length;
    // intenção de compra: cliques que levam a checkout ou landing de produto
    const compra = eventos.filter(e => (e.tipo === 'link' || e.tipo === 'clique') && /kiwify|hotmart|pay\.|checkout|netlify\.app|quero|comprar|vaga/i.test((e.item || '') + ' ' + (e.rotulo || '')));
    const k = (n, r) => `<div class="kpi"><b>${n}</b><span>${r}</span></div>`;
    return `<div class="cartao"><h3>Vendas (Kiwify)</h3><div class="kpis">${k(real(receita), 'faturado (pagos)')}${k(pagas.length, 'vendas pagas')}${k(pend, 'aguardando pagamento')}${k(reemb, 'reembolsos/estornos')}${k(compra.length, 'cliques pra comprar no Hub')}</div>
      <div class="duas" style="margin-top:14px"><div><h3>Vendas por produto</h3>${ranking(contar(pagas, v => v.produto), 'Nenhuma venda paga no período.')}</div>
      <div><h3>Cliques pra comprar (intenção)</h3>${ranking(contar(compra, e => e.rotulo || e.item), 'Nenhum clique de compra ainda.')}</div></div>
      ${vendas.length ? `<div class="cabeca" style="margin-top:14px"><h3>Últimas vendas</h3><button class="botao" type="button" data-baixar="vendas">Baixar planilha</button></div>${tabela(vendas.slice(0, 30), [['created_at', 'Quando', quando], ['produto', 'Produto'], ['valor', 'Valor', v => real(v)], ['status', 'Status'], ['metodo', 'Pagamento'], ['nome', 'Cliente'], ['email', 'E-mail'], ['utm_source', 'Origem']], '')}` : ''}</div>`;
  }

  function tabela(linhas, cols, vazio) {
    if (!linhas.length) return `<p class="vazio">${esc(vazio)}</p>`;
    return `<div class="tabela-wrap"><table class="tabela"><thead><tr>${cols.map(c => `<th>${esc(c[1])}</th>`).join('')}</tr></thead><tbody>${linhas.map(l =>
      `<tr>${cols.map(([k, , f]) => `<td>${f ? f(l[k], l) : esc(l[k])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }

  function baixar(qual) {
    const linhas = cache[qual] || [];
    if (!linhas.length) return;
    const cols = Object.keys(linhas[0]);
    const cel = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const csv = '﻿' + [cols.join(';'), ...linhas.map(l => cols.map(c => cel(typeof l[c] === 'object' && l[c] ? JSON.stringify(l[c]) : l[c])).join(';'))].join('\n');
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })), download: `${qual}-${new Date().toISOString().slice(0, 10)}.csv` });
    a.click();
  }

  document.addEventListener('click', e => {
    const p = e.target.closest('#aba-dados [data-dias-hub]');
    if (p) { dias = Number(p.dataset.diasHub); document.querySelectorAll('#aba-dados [data-dias-hub]').forEach(b => b.setAttribute('aria-pressed', String(b === p))); carregar(); }
    const b = e.target.closest('#aba-dados [data-baixar]'); if (b) baixar(b.dataset.baixar);
  });

  window.EBG_HUBNUM = { abrir: carregar };
})();
