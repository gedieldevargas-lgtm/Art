/* Painel do Gediel: números da landing, contatos pra chamar e produtos do catálogo.
   Tudo passa pelo Supabase com login. As regras do banco (supabase/admin.sql) garantem que só
   o e-mail da tabela admins lê contatos e edita produtos; este arquivo só desenha a tela. */
(() => {
  const CFG = window.EBG_CONFIG || {};
  const C = window.EBG || {};
  const sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey);
  window.EBG_ADMIN = { sb, aviso: t => aviso(t) }; // a aba Hub (hub-editor.js) usa o mesmo login

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const urlSegura = u => (/^https:\/\//i.test(u || '') ? u : '');
  const dataCurta = d => new Date(d).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  const nomeModo = id => ((C.modos || []).find(m => m.id === id) || {}).nome || '';
  const NOMES_FOCO = Object.fromEntries((C.perfis || []).map(p => [p.id, p.nome]));

  const ICONES = {
    whats: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm4.5 12.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg>',
    email: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18v14H3zm2 2v.5l7 4.5 7-4.5V7zm14 2.9-7 4.5-7-4.5V17h14z"/></svg>',
    insta: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm5 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM17.5 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>'
  };

  let avisoTempo;
  function aviso(txt) {
    const el = $('#aviso');
    el.textContent = txt;
    el.classList.add('mostra');
    clearTimeout(avisoTempo);
    avisoTempo = setTimeout(() => el.classList.remove('mostra'), 3000);
  }

  /* ---------------- entrar ---------------- */
  async function entrar(e) {
    e.preventDefault();
    const email = $('#email').value.trim(), senha = $('#senha').value;
    const erro = $('#erroEntrar');
    if (!email || !senha) { erro.textContent = 'Preencha o e-mail e a senha.'; return; }
    $('#botaoEntrar').disabled = true;
    const { error } = await sb.auth.signInWithPassword({ email, password: senha });
    $('#botaoEntrar').disabled = false;
    if (error) { erro.textContent = 'E-mail ou senha não conferem. Confira e tente de novo.'; return; }
    erro.textContent = '';
    abrirPainel();
  }

  async function esqueci() {
    const email = $('#email').value.trim();
    if (!email) { $('#erroEntrar').textContent = 'Escreva seu e-mail acima e clique de novo.'; return; }
    const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: location.href.split('#')[0] });
    $('#erroEntrar').textContent = error ? 'Não deu pra enviar agora. Tente de novo em alguns minutos.' : 'Enviamos um link de nova senha pro seu e-mail.';
  }

  async function abrirPainel() {
    // só entra quem está na lista de admins (a regra do banco também barra, isto só explica)
    const { data, error } = await sb.from('admins').select('email').limit(1);
    if (error || !data || !data.length) {
      await sb.auth.signOut();
      $('#erroEntrar').textContent = 'Esse e-mail não tem acesso ao painel. Confira se o admin.sql foi rodado no Supabase.';
      return;
    }
    $('#telaEntrar').hidden = true;
    $('#telaPainel').hidden = false;
    mostrarAba('numeros');
  }

  /* ---------------- abas ---------------- */
  const carregadas = {};
  function mostrarAba(aba) {
    $$('.abas button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.aba === aba)));
    $$('.aba').forEach(s => { s.hidden = s.id !== 'aba-' + aba; });
    if (aba === 'numeros') carregarNumeros();
    if (aba === 'contatos' && !carregadas.contatos) carregarContatos();
    if (aba === 'produtos' && !carregadas.produtos) carregarProdutos();
    if (aba === 'produtos' && window.EBG_KIWIFY) window.EBG_KIWIFY.abrir();
    if (aba === 'agenda') carregarAgenda();
    if (aba === 'hub' && window.EBG_HUBED) window.EBG_HUBED.abrir();
    if (aba === 'dados' && window.EBG_HUBNUM) window.EBG_HUBNUM.abrir();
    if (aba === 'pessoas' && window.EBG_PESSOAS) window.EBG_PESSOAS.abrir();
  }

  /* ---------------- números ---------------- */
  let dias = 7;
  const desde = () => (dias ? new Date(Date.now() - dias * 864e5).toISOString() : '1970-01-01');

  async function contar(tabela, filtro = q => q) {
    const { count } = await filtro(sb.from(tabela).select('*', { count: 'exact', head: true }).gte('created_at', desde()));
    return count || 0;
  }

  async function carregarNumeros() {
    const [visitas, cadastros, modos, cliques] = await Promise.all([
      contar('acessos', q => q.eq('tipo', 'entrou')),
      contar('leads'),
      sb.from('acessos').select('item').eq('tipo', 'modo').gte('created_at', desde()).limit(10000),
      sb.from('events').select('lead_id').eq('tipo', 'clicou').eq('item', 'mentoria').gte('created_at', desde()).limit(10000)
    ]);
    const quiseram = new Set((cliques.data || []).map(x => x.lead_id)).size;
    const taxa = visitas ? Math.round(cadastros / visitas * 100) : 0;
    const periodo = { 1: 'hoje', 7: 'nos últimos 7 dias', 30: 'nos últimos 30 dias', 0: 'desde o início' }[dias];
    $('#kpis').innerHTML = [
      ['Pessoas que entraram', visitas, periodo],
      ['Cadastros', cadastros, `${taxa}% de quem entrou`],
      ['Clicaram na mentoria', quiseram, 'entre os cadastrados'],
      ['Modos ligados', (modos.data || []).length, periodo]
    ].map(([r, n, s]) => `<div class="kpi"><span>${r}</span><strong>${n.toLocaleString('pt-BR')}</strong><small>${s}</small></div>`).join('');

    barras('#barrasModos', (modos.data || []).map(x => nomeModo(x.item) || x.item), 'Nenhum modo ligado nesse período.');

    const { data: origens } = await sb.from('acessos').select('origem').eq('tipo', 'entrou').gte('created_at', desde()).limit(10000);
    barras('#barrasOrigem', (origens || []).map(x => origemLegivel(x.origem)), 'Nenhuma visita nesse período.');

    const { data: ult } = await sb.from('leads').select('*').order('created_at', { ascending: false }).limit(6);
    $('#ultimos').innerHTML = (ult || []).length
      ? ult.map(l => `<li><span>${esc(l.nome)} <small>· ${esc(nomeModo(l.modo) || NOMES_FOCO[l.objetivo] || '')}</small></span><small>${dataCurta(l.created_at)}</small></li>`).join('')
      : '<li><small>Nenhum cadastro ainda.</small></li>';
  }

  // "de=eom · ref=https://l.instagram.com/" vira "Bio @englishonmission" ou "instagram.com"
  const BIOS = { ebg: 'Bio @englishbygediel', eom: 'Bio @englishonmission', metodo: 'Bio @metodoinglesinteligente', escola: 'Bio @escolainfly', viagens: 'Bio @inflyviagens' };
  function origemLegivel(o) {
    if (!o) return 'Direto (link sem origem)';
    const de = /(?:^|· )de=([^ ·]+)/.exec(o);
    if (de) return BIOS[de[1]] || 'de=' + de[1];
    const src = /source=([^ ·]+)/.exec(o);
    if (src) return 'Campanha: ' + src[1];
    const ref = /ref=https?:\/\/([^/ ·]+)/.exec(o);
    if (ref) return ref[1].replace(/^(www|l|lm)\./, '');
    return 'Outro';
  }

  function barras(alvo, valores, vazio) {
    const cont = {};
    valores.forEach(v => { cont[v] = (cont[v] || 0) + 1; });
    const lista = Object.entries(cont).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const max = lista.length ? lista[0][1] : 1;
    $(alvo).innerHTML = lista.length
      ? lista.map(([k, n]) => `<li><span title="${esc(k)}">${esc(k)}</span><span class="barra"><i style="width:${Math.max(4, n / max * 100)}%"></i></span><b>${n}</b></li>`).join('')
      : `<li><small>${vazio}</small></li>`;
  }

  /* ---------------- contatos ---------------- */
  let contatos = [], interesses = {};
  let marcas = {};

  async function carregarContatos() {
    const [{ data: leads, error }, { data: ev }, { data: mc }] = await Promise.all([
      sb.from('leads').select('*').order('created_at', { ascending: false }).limit(5000),
      sb.from('events').select('lead_id,tipo,item').in('tipo', ['clicou', 'abriu']).limit(20000),
      sb.from('crm_marcas').select('chave,chamado,chamado_em').like('chave', 'lead:%').limit(20000)
    ]);
    marcas = Object.fromEntries((mc || []).map(m => [m.chave, m]));
    if (error) { aviso('Não deu pra carregar os contatos.'); return; }
    carregadas.contatos = true;
    contatos = leads || [];
    interesses = {};
    (ev || []).forEach(e => {
      const i = interesses[e.lead_id] || (interesses[e.lead_id] = { mentoria: false, itens: new Set() });
      if (e.item === 'mentoria' && e.tipo === 'clicou') i.mentoria = true;
      if (e.item && !e.item.startsWith('procura:')) i.itens.add(e.item);
    });
    const modos = [...new Set(contatos.map(l => l.modo).filter(Boolean))];
    $('#filtroModo').innerHTML = '<option value="">Todos os modos</option>' + modos.map(m => `<option value="${esc(m)}">${esc(nomeModo(m) || m)}</option>`).join('');
    desenharContatos();
  }

  function filtrados() {
    const q = $('#busca').value.trim().toLowerCase();
    const modo = $('#filtroModo').value;
    const soMentoria = $('#filtroMentoria').checked;
    return contatos.filter(l =>
      (!q || [l.nome, l.instagram, l.email, l.whatsapp].some(v => String(v || '').toLowerCase().includes(q)))
      && (!modo || l.modo === modo)
      && (!soMentoria || (interesses[l.id] || {}).mentoria)
      && (!$('#filtroNaoChamei').checked || !(marcas['lead:' + l.id] || {}).chamado));
  }

  function msgWhats(l) {
    const nome = String(l.nome || '').trim().split(/\s+/)[0];
    const modo = nomeModo(l.modo);
    return `Oi ${nome}! Aqui é o Gediel, do englishbygediel. Vi que você passou pelo meu catálogo${modo ? ` e ligou o ${modo}` : ''}. Posso te ajudar com alguma coisa?`;
  }

  function desenharContatos() {
    const lista = filtrados();
    $('#contaContatos').textContent = `${lista.length} de ${contatos.length}`;
    $('#vazioContatos').hidden = contatos.length > 0;
    $('#linhasContatos').innerHTML = lista.map(l => {
      const i = interesses[l.id] || { mentoria: false, itens: new Set() };
      const outros = [...i.itens].filter(x => x !== 'mentoria').slice(0, 3);
      const ig = String(l.instagram || '').replace(/^@/, '');
      const mk = marcas['lead:' + l.id] || {};
      return `<tr class="${mk.chamado ? 'chamado' : ''}">
        <td><label class="chamei" title="${mk.chamado ? 'Chamado em ' + dataCurta(mk.chamado_em) : 'Marcar como chamado'}"><input type="checkbox" data-chamei="lead:${esc(l.id)}" ${mk.chamado ? 'checked' : ''}><span>${mk.chamado ? dataCurta(mk.chamado_em) : ''}</span></label></td>
        <td><small>${dataCurta(l.created_at)}</small></td>
        <td><strong>${esc(l.nome)}</strong>${ig ? `<small>@${esc(ig)}</small>` : ''}</td>
        <td>${esc(nomeModo(l.modo) || NOMES_FOCO[l.objetivo] || '')}</td>
        <td><div class="contato-acoes">
          <a class="whats" data-marca-whats="lead:${esc(l.id)}" href="https://wa.me/${esc(String(l.whatsapp || '').replace(/\D/g, ''))}?text=${encodeURIComponent(msgWhats(l))}" target="_blank" rel="noopener">${ICONES.whats}WhatsApp</a>
          ${l.email ? `<a href="mailto:${esc(l.email)}?subject=${encodeURIComponent('Oi, aqui é o Gediel')}">${ICONES.email}E-mail</a>` : ''}
          ${ig ? `<a href="https://ig.me/m/${esc(encodeURIComponent(ig))}" target="_blank" rel="noopener">${ICONES.insta}Direct</a>` : ''}
        </div></td>
        <td>${i.mentoria ? '<span class="selo quente">Clicou na mentoria</span> ' : ''}${outros.map(x => `<span class="selo">${esc(x)}</span>`).join(' ')}</td>
      </tr>`;
    }).join('');
  }

  function exportar() {
    const linhas = [['Data', 'Nome', 'WhatsApp', 'Instagram', 'E-mail', 'Modo', 'Clicou na mentoria', 'Origem']]
      .concat(filtrados().map(l => [new Date(l.created_at).toLocaleString('pt-BR'), l.nome, l.whatsapp, l.instagram || '', l.email || '',
        nomeModo(l.modo) || NOMES_FOCO[l.objetivo] || '', (interesses[l.id] || {}).mentoria ? 'sim' : 'não', l.origem || '']));
    const csv = linhas.map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(';')).join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
    a.download = `contatos-englishbygediel-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }

  /* ---------------- produtos ---------------- */
  let produtos = [], editando = null;
  const TIPOS = { gratis: 'Grátis', pago: 'Pago', mentoria: 'Só na mentoria', breve: 'Em breve' };

  async function carregarProdutos() {
    const { data, error } = await sb.from('produtos').select('*').order('segmento').order('ordem').order('created_at');
    if (error) { aviso('Não deu pra carregar os produtos. Confira se o admin.sql foi rodado.'); return; }
    carregadas.produtos = true;
    produtos = data || [];
    const segs = [...new Set([...(C.fileiras || []).filter(f => !f.dinamica && f.id !== 'alunos').map(f => f.titulo), 'Jogos', 'Prompts', 'E-books', 'Guias', ...produtos.map(p => p.segmento)])];
    $('#segmentos').innerHTML = segs.map(s => `<option value="${esc(s)}">`).join('');
    desenharProdutos();
  }

  function desenharProdutos() {
    $('#vazioProdutos').hidden = produtos.length > 0;
    let grupo = null;
    $('#gradeProdutos').innerHTML = produtos.map(p => {
      const cab = p.segmento !== grupo ? `<p class="grupo-titulo">${esc(grupo = p.segmento)}</p>` : '';
      const capa = urlSegura(p.capa_url);
      return `${cab}<button class="produto${p.ativo ? '' : ' inativo'}" type="button" data-produto="${p.id}">
        <span class="produto-capa">${capa ? `<img src="${esc(capa)}" alt="" loading="lazy">` : esc(p.titulo)}</span>
        <span class="produto-info"><strong>${esc(p.titulo)}</strong><small>${TIPOS[p.tipo] || ''}${p.preco ? ' · ' + esc(p.preco) : ''}${p.ativo ? '' : ' · escondido'}</small>
          <small>${(p.modos || []).length ? (p.modos || []).map(id => esc(nomeModo(id).replace(/^Modo /, '') || id)).join(', ') : 'Só no Menu'}</small></span>
      </button>`;
    }).join('');
  }

  function abrirProduto(p) {
    editando = p || null;
    $('#tituloModal').textContent = p ? 'Editar produto' : 'Novo produto';
    $('#p_titulo').value = p ? p.titulo : '';
    $('#p_segmento').value = p ? p.segmento : '';
    $('#p_tipo').value = p ? p.tipo : 'gratis';
    $('#p_preco').value = p ? p.preco || '' : '';
    $('#p_link').value = p ? p.link || '' : '';
    $('#p_botao').value = p ? p.botao || '' : '';
    $('#p_descricao').value = p ? p.descricao || '' : '';
    $('#p_ordem').value = p ? p.ordem : 100;
    $('#p_ativo').checked = p ? p.ativo : true;
    const marcados = p ? p.modos || [] : [];
    $('#p_modos').innerHTML = (C.modos || []).map(m =>
      `<label class="check"><input type="checkbox" value="${esc(m.id)}"${marcados.includes(m.id) ? ' checked' : ''}> ${esc(m.nome.replace(/^Modo /, ''))}</label>`).join('');
    $('#p_capa').value = p ? p.capa_url || '' : '';
    $('#p_arquivo').value = '';
    $('#erroProduto').textContent = '';
    $('#apagarProduto').hidden = !p;
    previaCapa();
    $('#modalProduto').showModal();
  }

  function previaCapa() {
    const u = urlSegura($('#p_capa').value.trim());
    $('#capaPrevia').innerHTML = u ? `<img src="${esc(u)}" alt="">` : '<span>Sem capa</span>';
  }

  // reduz a imagem no próprio navegador antes de enviar: capa leve, página rápida
  function reduzir(arquivo) {
    return new Promise((ok, falha) => {
      const img = new Image();
      img.onload = () => {
        const escala = Math.min(1, 1000 / img.height, 750 / img.width);
        const cv = document.createElement('canvas');
        cv.width = Math.round(img.width * escala); cv.height = Math.round(img.height * escala);
        cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
        cv.toBlob(b => (b ? ok(b) : falha(new Error('imagem'))), 'image/webp', 0.85);
        URL.revokeObjectURL(img.src);
      };
      img.onerror = () => falha(new Error('imagem'));
      img.src = URL.createObjectURL(arquivo);
    });
  }

  async function enviarCapa() {
    const arq = $('#p_arquivo').files[0];
    if (!arq) return;
    $('#capaPrevia').innerHTML = '<span>Enviando…</span>';
    try {
      const blob = await reduzir(arq);
      const caminho = `${crypto.randomUUID()}.webp`;
      const { error } = await sb.storage.from('capas').upload(caminho, blob, { contentType: 'image/webp', upsert: false });
      if (error) throw error;
      $('#p_capa').value = sb.storage.from('capas').getPublicUrl(caminho).data.publicUrl;
    } catch (e) {
      $('#erroProduto').textContent = 'Não deu pra enviar a imagem. Tente outra, ou cole o link de uma imagem.';
    }
    previaCapa();
  }

  async function salvarProduto(e) {
    e.preventDefault();
    const dado = {
      titulo: $('#p_titulo').value.trim(),
      segmento: $('#p_segmento').value.trim(),
      tipo: $('#p_tipo').value,
      preco: $('#p_preco').value.trim() || null,
      link: $('#p_link').value.trim() || null,
      botao: $('#p_botao').value.trim() || null,
      descricao: $('#p_descricao').value.trim() || null,
      ordem: parseInt($('#p_ordem').value, 10) || 100,
      ativo: $('#p_ativo').checked,
      modos: $$('#p_modos input:checked').map(i => i.value),
      capa_url: $('#p_capa').value.trim() || null
    };
    const erro = $('#erroProduto');
    if (!dado.titulo) { erro.textContent = 'Dê um título ao produto.'; return; }
    if (!dado.segmento) { erro.textContent = 'Escolha ou escreva o segmento (a fileira onde ele aparece).'; return; }
    if (dado.link && !/^https:\/\//i.test(dado.link)) { erro.textContent = 'O link precisa começar com https://'; return; }
    if (dado.capa_url && !/^https:\/\//i.test(dado.capa_url)) { erro.textContent = 'O link da capa precisa começar com https://'; return; }
    if (dado.tipo !== 'mentoria' && dado.tipo !== 'breve' && !dado.link) { erro.textContent = 'Coloque o link pra onde o botão leva.'; return; }
    $('#salvarProduto').disabled = true;
    const { error } = editando
      ? await sb.from('produtos').update(dado).eq('id', editando.id)
      : await sb.from('produtos').insert(dado);
    $('#salvarProduto').disabled = false;
    if (error) { erro.textContent = 'Não deu pra salvar. Tente de novo.'; return; }
    $('#modalProduto').close();
    aviso(editando ? 'Produto atualizado. Já aparece na landing.' : 'Produto adicionado. Já aparece na landing.');
    carregarProdutos();
  }

  async function apagarProduto() {
    if (!editando) return;
    const botao = $('#apagarProduto');
    // confirmação em dois cliques, sem caixa do navegador
    if (botao.dataset.confirma !== '1') { botao.dataset.confirma = '1'; botao.textContent = 'Clique de novo pra apagar'; return; }
    botao.dataset.confirma = ''; botao.textContent = 'Apagar produto';
    const { error } = await sb.from('produtos').delete().eq('id', editando.id);
    if (error) { $('#erroProduto').textContent = 'Não deu pra apagar. Tente de novo.'; return; }
    $('#modalProduto').close();
    aviso('Produto apagado.');
    carregarProdutos();
  }

  /* ---------------- agenda ---------------- */
  const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  $('#diasSemana').innerHTML = DIAS.map((d, i) => `<label class="dia"><input type="checkbox" value="${i}"${i >= 1 && i <= 5 ? ' checked' : ''}><span>${d}</span></label>`).join('');
  $('#h_inicio').value = new Date(Date.now() - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 10);

  async function criarHorarios(e) {
    e.preventDefault();
    const erro = $('#erroHorarios');
    const dias = $$('#diasSemana input:checked').map(i => Number(i.value));
    const horas = $('#h_horas').value.split(/[,;\s]+/).map(x => x.trim()).filter(Boolean);
    const ruins = horas.filter(h => !/^([01]?\d|2[0-3])[:h]?([0-5]\d)?$/.test(h));
    if (!dias.length) { erro.textContent = 'Marque pelo menos um dia da semana.'; return; }
    if (!horas.length || ruins.length) { erro.textContent = ruins.length ? `Horário que não entendi: ${ruins.join(', ')}. Use 09:00 ou 14:30.` : 'Escreva os horários, ex.: 09:00, 14:30.'; return; }
    const [a, m, d] = $('#h_inicio').value.split('-').map(Number);
    const semanas = Number($('#h_semanas').value), duracao = Number($('#h_duracao').value);
    const linhas = [];
    for (let i = 0; i < semanas * 7; i++) {
      const dia = new Date(a, m - 1, d + i);
      if (!dias.includes(dia.getDay())) continue;
      horas.forEach(h => {
        const [hh, mm] = h.replace('h', ':').split(':').map(Number);
        const inicio = new Date(dia.getFullYear(), dia.getMonth(), dia.getDate(), hh, mm || 0);
        if (inicio > new Date()) linhas.push({ inicio: inicio.toISOString(), duracao_min: duracao });
      });
    }
    if (!linhas.length) { erro.textContent = 'Nenhum horário futuro nesse período.'; return; }
    erro.textContent = '';
    $('#criarHorarios').disabled = true;
    // horário que já existe é ignorado: dá pra rodar de novo sem duplicar
    const { error } = await sb.from('horarios').upsert(linhas, { onConflict: 'inicio', ignoreDuplicates: true });
    $('#criarHorarios').disabled = false;
    if (error) { erro.textContent = 'Não deu pra criar. Confira se o agenda.sql foi rodado no Supabase.'; return; }
    aviso(`${linhas.length} horário(s) abertos.`);
    carregarAgenda();
  }

  let horarios = [], reservas = {};
  async function carregarAgenda() {
    const desde = new Date(Date.now() - 2 * 36e5).toISOString();
    const [h, r] = await Promise.all([
      sb.from('horarios').select('*').gte('inicio', desde).order('inicio').limit(500),
      sb.from('agendamentos').select('*').limit(1000)
    ]);
    if (h.error) { $('#agendaLista').innerHTML = '<p class="vazio">Não deu pra carregar a agenda. Confira se o agenda.sql foi rodado.</p>'; return; }
    horarios = h.data || [];
    reservas = Object.fromEntries((r.data || []).map(x => [x.horario_id, x]));
    desenharAgendaAdmin();
  }

  function desenharAgendaAdmin() {
    if (!horarios.length) { $('#agendaLista').innerHTML = '<p class="vazio">Nenhum horário aberto. Use o formulário acima.</p>'; return; }
    const porDia = {};
    horarios.forEach(h => { const k = new Date(h.inicio).toDateString(); (porDia[k] = porDia[k] || []).push(h); });
    $('#agendaLista').innerHTML = Object.values(porDia).map(lista => {
      const d = new Date(lista[0].inicio);
      const titulo = d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
      return `<div class="agenda-dia-admin"><h4>${titulo.charAt(0).toUpperCase() + titulo.slice(1)}</h4><div class="slots">${lista.map(h => {
        const hora = new Date(h.inicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        const r = reservas[h.id];
        if (!r) return `<span class="slot livre">${hora}<button type="button" data-tirar="${h.id}" aria-label="Fechar o horário das ${hora}">×</button></span>`;
        const nome = String(r.nome || '').split(/\s+/)[0];
        const msg = `Oi ${nome}! Aqui é o Gediel. Confirmando nossa consultoria gratuita ${d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}, às ${hora}. Te mando o link da chamada por aqui, combinado?`;
        return `<span class="slot reservado"><b>${hora}</b> ${esc(r.nome)}${r.modo ? ` <small>· ${esc(nomeModo(r.modo))}</small>` : ''}
          <a class="whats" href="https://wa.me/${esc(String(r.whatsapp).replace(/\D/g, ''))}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">${ICONES.whats}Confirmar</a>
          <button type="button" data-cancelar="${r.id}">Cancelar</button></span>`;
      }).join('')}</div></div>`;
    }).join('');
  }

  async function cliqueAgenda(e) {
    const tirar = e.target.closest('[data-tirar]');
    const cancelar = e.target.closest('[data-cancelar]');
    const b = tirar || cancelar;
    if (!b) return;
    // confirmação em dois cliques, sem caixa do navegador
    if (b.dataset.confirma !== '1') { b.dataset.confirma = '1'; b.textContent = tirar ? 'Fechar?' : 'Clique de novo'; return; }
    const { error } = tirar
      ? await sb.from('horarios').delete().eq('id', b.dataset.tirar)
      : await sb.from('agendamentos').delete().eq('id', b.dataset.cancelar);
    if (error) { aviso('Não deu pra fazer isso agora.'); return; }
    aviso(tirar ? 'Horário fechado.' : 'Reserva cancelada. O horário voltou a ficar livre.');
    carregarAgenda();
  }

  /* ---------------- ligações ---------------- */
  $('#formEntrar').addEventListener('submit', entrar);
  $('#esqueci').addEventListener('click', esqueci);
  $('#sair').addEventListener('click', async () => { await sb.auth.signOut(); location.reload(); });
  $$('.abas button').forEach(b => b.addEventListener('click', () => mostrarAba(b.dataset.aba)));
  $$('.periodo button').forEach(b => b.addEventListener('click', () => {
    dias = Number(b.dataset.dias);
    $$('.periodo button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    carregarNumeros();
  }));
  ['#busca', '#filtroModo', '#filtroMentoria', '#filtroNaoChamei'].forEach(s => $(s).addEventListener('input', desenharContatos));
  // checklist "já chamei no WhatsApp": marca na mão ou sozinho quando você clica em WhatsApp
  async function marcar(chave, chamado) {
    const linha = { chave, chamado, chamado_em: chamado ? new Date().toISOString() : null, updated_at: new Date().toISOString() };
    marcas[chave] = linha;
    const { error } = await sb.from('crm_marcas').upsert(linha);
    if (error) aviso('Não deu pra salvar a marcação. Rode o supabase/crm.sql no Supabase.');
    desenharContatos();
    if (window.EBG_PESSOAS && window.EBG_PESSOAS.marcou) window.EBG_PESSOAS.marcou(linha);
  }
  window.EBG_MARCAR = marcar;
  document.addEventListener('change', e => { const c = e.target.closest && e.target.closest('[data-chamei]'); if (c) marcar(c.dataset.chamei, c.checked); });
  document.addEventListener('click', e => { const w = e.target.closest && e.target.closest('[data-marca-whats]'); if (w && !(marcas[w.dataset.marcaWhats] || {}).chamado) marcar(w.dataset.marcaWhats, true); });
  $('#exportar').addEventListener('click', exportar);
  $('#novoProduto').addEventListener('click', () => abrirProduto(null));
  $('#gradeProdutos').addEventListener('click', e => {
    const b = e.target.closest('[data-produto]');
    if (b) abrirProduto(produtos.find(p => p.id === b.dataset.produto));
  });
  $('#p_arquivo').addEventListener('change', enviarCapa);
  $('#p_capa').addEventListener('input', previaCapa);
  $('#formProduto').addEventListener('submit', salvarProduto);
  $('#cancelarProduto').addEventListener('click', () => $('#modalProduto').close());
  $('#apagarProduto').addEventListener('click', apagarProduto);
  $('#formHorarios').addEventListener('submit', criarHorarios);
  $('#agendaLista').addEventListener('click', cliqueAgenda);

  // quem já entrou antes (ou voltou do link de nova senha) cai direto no painel
  sb.auth.onAuthStateChange(async (evento) => {
    if (evento !== 'PASSWORD_RECOVERY') return;
    // veio do link "esqueci a senha": troca o formulário de entrar pelo de nova senha
    $('#telaEntrar').hidden = false;
    $('#telaPainel').hidden = true;
    const form = document.createElement('form');
    form.className = 'cartao entrar-form';
    form.noValidate = true;
    form.innerHTML = `<p class="marca">english<b>by</b>gediel</p><h1>Nova senha</h1>
      <label class="campo"><span>Nova senha (mínimo 8 caracteres)</span><input id="novaSenha" type="password" autocomplete="new-password" minlength="8" required></label>
      <p class="erro" id="erroNova" role="alert"></p><button class="botao cheio" type="submit">Salvar senha</button>`;
    $('#formEntrar').replaceWith(form);
    form.addEventListener('submit', async ev => {
      ev.preventDefault();
      const senha = $('#novaSenha').value;
      if (senha.length < 8) { $('#erroNova').textContent = 'Use pelo menos 8 caracteres.'; return; }
      const { error } = await sb.auth.updateUser({ password: senha });
      if (error) { $('#erroNova').textContent = 'Não deu pra salvar. Peça um novo link.'; return; }
      location.replace(location.pathname);
    });
  });
  sb.auth.getSession().then(({ data }) => { if (data.session && !location.hash.includes('type=recovery')) abrirPainel(); });
})();
