/* Modo editor do Hub: abra o site com ?editar (ex.: englishbygediel.netlify.app/?editar).
   Entra com o login de admin e deixa editar tudo direto na página:
   textos (clica e digita), fotos (clica e troca), cards, atalhos, modos e redes (clica e abre a gaveta),
   e a gaveta "Tudo" com cores e todas as seções. As mudanças ficam num rascunho até "Salvar e publicar". */
(async () => {
  if (!/[?&]editar\b/.test(location.search)) return;
  const CFG = window.EBG_CONFIG || {};
  const $ = (s, el = document) => el.querySelector(s), $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const espera = (f, ms = 8000) => new Promise((ok, falha) => { const t0 = Date.now(); (function v() { const r = f(); if (r) ok(r); else if (Date.now() - t0 > ms) falha(new Error('tempo')); else setTimeout(v, 60); })(); });
  const carregarJs = src => new Promise((ok, falha) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = falha; document.head.appendChild(s); });

  const H = await espera(() => window.HUB_ATUAL);
  await carregarJs('admin/hub-editor.js');
  await carregarJs('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js');
  const sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey);

  /* ---------- estilo do editor ---------- */
  const css = document.createElement('style');
  css.textContent = `
  .ed-barra{position:fixed;left:50%;top:10px;transform:translateX(-50%);z-index:60;display:flex;gap:6px;align-items:center;padding:8px;border-radius:999px;background:rgba(12,18,32,.92);border:1px solid rgba(255,255,255,.14);box-shadow:0 20px 50px -10px #000;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);max-width:calc(100% - 20px);overflow-x:auto;font:600 13px/1 -apple-system,BlinkMacSystemFont,Inter,system-ui,sans-serif}
  .ed-barra button{flex:0 0 auto;padding:10px 14px;border-radius:999px;background:rgba(255,255,255,.1);color:#fff;white-space:nowrap}
  .ed-barra button.prim{background:#fff;color:#0a1426}
  .ed-barra .ed-st{color:#a7b3c6;padding:0 8px;white-space:nowrap}.ed-barra .ed-st.sujo{color:#f5c26b}.ed-barra .ed-st.ok{color:#9fd18b}
  .ed-ponto{width:8px;height:8px;border-radius:50%;background:#9fd18b;margin-left:6px;flex:0 0 auto}
  body.ed [data-e]{outline:1px dashed rgba(159,209,139,.0);outline-offset:3px;border-radius:4px;cursor:text;transition:outline-color .2s}
  body.ed [data-e]:hover,body.ed [data-e]:focus{outline-color:rgba(159,209,139,.9)}
  body.ed [data-e]:focus{outline-style:solid;background:rgba(159,209,139,.08)}
  body.ed [data-e-img]{cursor:copy;outline:2px dashed transparent;outline-offset:-2px}
  body.ed [data-e-img]:hover{outline-color:rgba(159,209,139,.9)}
  body.ed .post,body.ed .atalho,body.ed .destaque,body.ed .redes a{outline:2px dashed rgba(159,209,139,.35);outline-offset:2px}
  .ed-lapis{position:absolute;top:6px;left:6px;z-index:9;width:30px;height:30px;border-radius:50%;background:#fff;color:#0a1426;display:grid;place-items:center;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,.4)}
  .ed-mais{flex:0 0 140px;align-self:stretch;border:2px dashed rgba(255,255,255,.25);border-radius:18px;color:#fff;font:600 14px/1.3 -apple-system,Inter,sans-serif;display:grid;place-items:center;text-align:center;padding:10px}
  body.ed .ent-topo{margin-top:58px}
  body.ed .entrar-btn.fixo,body.ed .trocar{top:70px}
  body.ed .hero{padding-top:120px}
  .ed-dica{position:fixed;top:68px;left:50%;transform:translateX(-50%);z-index:61;padding:10px 16px;border-radius:999px;background:#9fd18b;color:#0a1426;font:600 13px/1.2 -apple-system,Inter,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.4);transition:opacity .4s;max-width:calc(100% - 24px);text-align:center}
  .ed-gaveta{position:fixed;top:0;right:0;bottom:0;width:min(460px,100%);z-index:70;background:#111622;color:#f3efe8;border-left:1px solid rgba(255,255,255,.1);box-shadow:-30px 0 60px rgba(0,0,0,.5);transform:translateX(105%);transition:transform .35s cubic-bezier(.2,.8,.2,1);display:flex;flex-direction:column;font:400 15px/1.5 -apple-system,BlinkMacSystemFont,Inter,system-ui,sans-serif;color-scheme:dark}
  .ed-gaveta.aberta{transform:none}
  @media (max-width:640px){.ed-gaveta{top:auto;height:86vh;width:100%;border-left:0;border-top:1px solid rgba(255,255,255,.1);border-radius:22px 22px 0 0;transform:translateY(105%)}}
  .ed-gaveta header{display:flex;align-items:center;gap:10px;padding:16px 18px;border-bottom:1px solid rgba(255,255,255,.08)}
  .ed-gaveta header strong{font-size:17px;flex:1}
  .ed-gaveta header button{padding:9px 14px;border-radius:999px;background:#fff;color:#0a1426;font-weight:600}
  .ed-corpo{overflow-y:auto;padding:14px 16px 40px;flex:1}
  .ed-gaveta button,.ed-gaveta input,.ed-gaveta select,.ed-gaveta textarea{font:inherit;color:inherit}
  .ed-gaveta button{cursor:pointer;border:0;background:none}
  .ed-gaveta h3{margin:0;font-size:16px;font-weight:600}
  .ed-gaveta .sub{color:#b5afa5;margin:6px 0 10px;font-size:14px}
  .ed-gaveta .cartao{background:#16161a;border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:14px;margin-bottom:10px}
  .ed-gaveta .campo{display:flex;flex-direction:column;gap:6px}
  .ed-gaveta .campo>span{font-size:13px;color:#b5afa5}
  .ed-gaveta .check{display:flex;gap:8px;align-items:center;font-size:14px}
  .ed-gaveta .botao{display:inline-flex;align-items:center;justify-content:center;padding:10px 16px;border-radius:999px;background:#2e2e36;color:#fff;font-weight:600;font-size:14px;cursor:pointer}
  .ed-gaveta .botao.cheio{background:#fff;color:#0a1426}
  .ed-gaveta .botao.arquivo input{display:none}
  .ed-gaveta .link{color:#9fb2d6;text-decoration:underline;font-size:14px}.ed-gaveta .link.perigo{color:#e0a07a}
  .ed-gaveta .modos-check{border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:10px 12px}
  .ed-gaveta legend{font-size:13px;color:#b5afa5;padding:0 4px}
  .ed-gaveta .hub-sec>summary,.ed-gaveta .hub-item>summary{cursor:pointer;list-style:none;display:flex;align-items:center;gap:10px}
  .ed-gaveta summary::-webkit-details-marker{display:none}
  .ed-gaveta .hub-sec>summary::after{content:"▾";margin-left:auto;color:#b5afa5}
  .ed-gaveta .hub-campos{display:grid;gap:12px;margin-top:12px}
  .ed-gaveta .hub-campos input,.ed-gaveta .hub-campos select,.ed-gaveta .hub-campos textarea,.ed-gaveta .hub-filtros select{width:100%;background:#232329;border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:11px 12px}
  .ed-gaveta .hub-campos input[type=checkbox],.ed-gaveta .hub-modos input{width:auto;padding:0}
  .ed-gaveta .hub-cor{display:flex;gap:8px}.ed-gaveta .hub-cor input[type=color]{width:48px;height:44px;padding:2px;flex:0 0 auto}
  .ed-gaveta .hub-img-linha{display:flex;gap:12px;align-items:flex-start}.ed-gaveta .hub-img-acoes{display:grid;gap:8px;flex:1}
  .ed-gaveta .hub-mini{width:72px;height:90px;border-radius:10px;overflow:hidden;background:#2e2e36;display:grid;place-items:center;flex:0 0 auto}
  .ed-gaveta .hub-mini.p{width:40px;height:50px}.ed-gaveta .hub-mini img{width:100%;height:100%;object-fit:cover}.ed-gaveta .hub-mini i{font-size:12px;color:#b5afa5;font-style:normal}
  .ed-gaveta .hub-lista{display:grid;gap:8px;margin:10px 0}
  .ed-gaveta .hub-item{background:#232329;border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:10px 12px}
  .ed-gaveta .hub-item>summary strong{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .ed-gaveta .hub-tag{font-size:11px;padding:3px 8px;border-radius:99px;background:#2e2e36;color:#b5afa5;white-space:nowrap}
  .ed-gaveta .hub-tag.off{background:#3a2520;color:#e0a07a}
  .ed-gaveta .hub-ordem{margin-left:auto;display:flex;gap:4px}.ed-gaveta .hub-ordem button{width:32px;height:32px;border-radius:8px;background:#2e2e36}
  .ed-gaveta .hub-item-acoes{display:flex;gap:16px;align-items:center}
  .ed-gaveta .hub-modos{display:flex;flex-wrap:wrap;gap:6px 14px}
  .ed-gaveta .hub-filtros{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:6px}.ed-gaveta .hub-filtros select{width:auto}
  .ed-gaveta .conta{color:#b5afa5;font-size:13px}
  .ed-entrar{display:grid;gap:12px}.ed-entrar input{background:#232329;border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:12px}
  .ed-entrar .erro{color:#e0a07a;font-size:14px;min-height:1em}`;
  document.head.appendChild(css);

  /* ---------- rascunho ---------- */
  const RASC = 'ebg:hubrascunho';
  let sujo = false;
  try { sujo = !!localStorage.getItem(RASC); } catch (e) {}
  const guardar = () => { sujo = true; try { localStorage.setItem(RASC, JSON.stringify(H)); } catch (e) {} estado(); };
  // a página foi carregada com o rascunho? (hub-dados.js usa o rascunho quando há ?editar)
  const pegar = caminho => { const ps = caminho.split('.'); const k = ps.pop(); let o = H; ps.forEach(p => { o = o[p] = o[p] || {}; }); return [o, k]; };
  const pos = () => { try { sessionStorage.setItem('ed:pos', JSON.stringify({ y: scrollY, dentro: $('#entrada').classList.contains('sai') })); } catch (e) {} };
  const recarregar = () => { pos(); location.reload(); };

  /* ---------- barra ---------- */
  const barra = document.createElement('div');
  barra.className = 'ed-barra';
  barra.innerHTML = `<span class="ed-ponto"></span><span class="ed-st" id="edSt">Modo editor</span>
    <button type="button" data-ed="tudo">☰ Tudo</button><button type="button" data-ed="cores">🎨 Cores</button>
    <button type="button" data-ed="abertura">Abertura</button><button type="button" data-ed="desfazer">Desfazer</button>
    <button type="button" class="prim" data-ed="salvar">Salvar e publicar</button><button type="button" data-ed="sair">Sair</button>`;
  document.body.appendChild(barra);
  function estado(txt, cls) { const el = $('#edSt'); el.textContent = txt || (sujo ? 'Não publicado' : 'Modo editor'); el.className = 'ed-st ' + (cls || (sujo ? 'sujo' : '')); }
  estado();

  const dica = document.createElement('div');
  dica.className = 'ed-dica';
  dica.textContent = 'Modo editor: clique num texto pra escrever, numa foto pra trocar, num card pra editar.';
  document.body.appendChild(dica);
  setTimeout(() => { dica.style.opacity = 0; setTimeout(() => dica.remove(), 500); }, 5000);

  /* ---------- gaveta ---------- */
  const gaveta = document.createElement('aside');
  gaveta.className = 'ed-gaveta';
  gaveta.innerHTML = '<header><strong id="edTit"></strong><button type="button" data-ed="fechar">Pronto</button></header><div class="ed-corpo" id="edCorpo"></div>';
  document.body.appendChild(gaveta);
  let mudouNaGaveta = false;
  function abrirGaveta(titulo, so) {
    $('#edTit').textContent = titulo;
    mudouNaGaveta = false;
    const corpo = document.createElement('div'); corpo.className = 'ed-corpo'; corpo.id = 'edCorpo'; $('#edCorpo').replaceWith(corpo); // sem eventos repetidos
    window.HubEditor.criar({ root: corpo, H, sb, aviso: t => estado(t, 'sujo'), imgBase: '', so,
      onChange: () => { mudouNaGaveta = true; guardar(); }, onApagar: () => { fecharGaveta(); } });
    gaveta.classList.add('aberta');
  }
  function fecharGaveta() { gaveta.classList.remove('aberta'); if (mudouNaGaveta) recarregar(); }

  /* ---------- login ---------- */
  async function ehAdmin() {
    const { data } = await sb.auth.getSession();
    if (!data.session) return false;
    const r = await sb.from('admins').select('email').limit(1);
    return !r.error && r.data && r.data.length > 0;
  }
  function pedirLogin() {
    $('#edTit').textContent = 'Entrar pra editar';
    $('#edCorpo').innerHTML = `<form class="ed-entrar"><p class="sub">Use o mesmo e-mail e senha do painel.</p>
      <input type="email" id="edEmail" placeholder="E-mail" autocomplete="username" required><input type="password" id="edSenha" placeholder="Senha" autocomplete="current-password" required>
      <p class="erro" id="edErro"></p><button class="botao cheio" type="submit">Entrar</button></form>`;
    gaveta.classList.add('aberta');
    $('#edCorpo form').onsubmit = async e => {
      e.preventDefault();
      const { error } = await sb.auth.signInWithPassword({ email: $('#edEmail').value.trim(), password: $('#edSenha').value });
      if (error) { $('#edErro').textContent = 'E-mail ou senha não conferem.'; return; }
      if (!(await ehAdmin())) { $('#edErro').textContent = 'Esse e-mail não é admin do painel.'; await sb.auth.signOut(); return; }
      gaveta.classList.remove('aberta'); ligar();
    };
  }

  /* ---------- edição direto na página ---------- */
  const TEXTOS = {
    '#eMarca': 'entrada.marca', '#eRotulo': 'entrada.rotulo', '#eDica': 'entrada.dica', '#tNome': 'topo.nome', '#tCargo': null,
    '#dRotulo': 'destaque.rotulo', '#dTitulo': 'destaque.titulo', '#dTexto': 'destaque.texto', '#dBotao': 'destaque.botao',
    '#sGratis': 'secoes.gratis', '#sPagos': 'secoes.pagos', '#sBotaoPagos': 'secoes.botaoPagos', '#sMembros': 'secoes.membros', '#sMembrosSub': 'secoes.membrosSub',
    '#sExtras': 'secoes.extras', '#sAlunos': 'secoes.alunos', '#aRotulo': 'aplicacao.rotulo', '#aTexto': 'aplicacao.texto', '#rNome': 'rodape.nome', '#rLinha': 'rodape.linha'
  };
  const FOTOS = { '#eFoto': 'entrada.foto', '#tAvatar': 'topo.avatar', '#heroBg': 'topo.fundo', '#dImg': 'destaque.img', '#aFoto': 'aplicacao.foto' };
  const modoAtual = () => { let id = null; try { id = localStorage.getItem('ebg:hubmodo'); } catch (e) {} return (H.modos || []).findIndex(m => m.id === id); };

  function marcarTextos() {
    Object.entries(TEXTOS).forEach(([sel, caminho]) => { const el = $(sel); if (el && caminho) { el.dataset.e = caminho; try { el.contentEditable = 'plaintext-only'; } catch (e) { el.contentEditable = 'true'; } } });
    // o texto do topo é o texto do modo ligado (ou a bio, se o modo não tiver texto)
    const bio = $('#bio'); const i = modoAtual();
    if (bio) { bio.dataset.e = i >= 0 && (H.modos[i].texto || '') ? `modos.${i}.texto` : 'topo.bio'; bio.contentEditable = 'true'; }
    Object.entries(FOTOS).forEach(([sel, caminho]) => { const el = $(sel); if (el) el.dataset.eImg = caminho; });
    $$('#atalhos .atalho img').forEach((im, i) => { im.dataset.eImg = `atalhos.${i}.img`; });
  }
  document.addEventListener('input', e => { const el = e.target.closest && e.target.closest('[data-e]'); if (!el || !document.body.classList.contains('ed')) return; const [o, k] = pegar(el.dataset.e); o[k] = el.innerText.trim(); guardar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.closest && e.target.closest('[data-e]') && !/texto|bio|sinopse/.test(e.target.dataset.e || '')) { e.preventDefault(); e.target.blur(); } });

  // trocar foto: clique na foto
  const seletor = Object.assign(document.createElement('input'), { type: 'file', accept: 'image/*', hidden: true });
  document.body.appendChild(seletor);
  let fotoAlvo = null;
  seletor.onchange = async () => {
    const arq = seletor.files[0]; seletor.value = ''; if (!arq || !fotoAlvo) return;
    estado('Enviando foto…', 'sujo');
    try {
      const url = await window.HubEditor.enviarFoto(sb, arq);
      const [o, k] = pegar(fotoAlvo.dataset.eImg); o[k] = url; fotoAlvo.src = url; guardar();
    } catch (e) { estado('Não deu pra enviar a foto', 'sujo'); }
  };

  // cliques no modo editor: abrem a gaveta certa em vez da ficha
  document.addEventListener('click', e => {
    if (!document.body.classList.contains('ed')) return;
    if (e.target.closest('.ed-barra,.ed-gaveta')) return;
    const t = e.target;
    const foto = t.closest('[data-e-img]');
    if (foto && !t.closest('[data-e]')) { e.preventDefault(); e.stopPropagation(); fotoAlvo = foto; seletor.click(); return; }
    if (t.closest('[data-e]')) { e.stopPropagation(); return; }
    const lap = t.closest('.ed-lapis[data-modo-ed]');
    if (lap) { e.preventDefault(); e.stopPropagation(); const i = H.modos.findIndex(m => m.id === lap.dataset.modoEd); abrirGaveta('Editar modo', { sec: 'modos', item: i }); return; }
    const mais = t.closest('[data-ed-novo]');
    if (mais) { e.preventDefault(); e.stopPropagation(); const novo = window.HubEditor.SECOES.find(s => s.k === 'cards').novo(); novo.tipo = mais.dataset.edNovo; H.cards.push(novo); guardar(); abrirGaveta('Novo card', { sec: 'cards', item: H.cards.length - 1 }); mudouNaGaveta = true; return; }
    const card = t.closest('[data-abrir]');
    if (card) {
      e.preventDefault(); e.stopPropagation();
      const id = card.dataset.abrir;
      if (id === 'mentoria') { abrirGaveta('Vídeo em destaque e mentoria', { sec: 'destaque' }); return; }
      const i = H.cards.findIndex(c => c.id === id);
      if (i >= 0) abrirGaveta('Editar card', { sec: 'cards', item: i });
      else abrirGaveta('Cards', { sec: 'cards' }); // produtos da aba Produtos: edite lá no painel
      return;
    }
    const at = t.closest('.atalho');
    if (at) { e.preventDefault(); e.stopPropagation(); abrirGaveta('Editar atalho', { sec: 'atalhos', item: $$('#atalhos .atalho').indexOf(at) }); return; }
    if (t.closest('.redes')) { e.preventDefault(); e.stopPropagation(); abrirGaveta('Redes sociais', { sec: 'redes' }); return; }
    if (t.closest('#eTitulo')) { e.stopPropagation(); abrirGaveta('Abertura', { sec: 'entrada' }); return; }
    if (t.closest('#aTitulo')) { e.stopPropagation(); abrirGaveta('Chat de aplicação', { sec: 'aplicacao' }); return; }
    if (t.closest('[data-login]') && !t.closest('#atalhos')) { e.preventDefault(); e.stopPropagation(); abrirGaveta('Entrar (área de membros)', { sec: 'membros' }); return; }
    if (t.closest('.hero-info') && !t.closest('a,button')) { /* clique solto no topo: nada */ }
  }, true);

  // botão ✏️ em cada modo do anel e "+ novo" no fim de cada fileira
  function enfeitar() {
    $$('#giro .modo').forEach(m => { if (!m.querySelector('.ed-lapis')) m.insertAdjacentHTML('beforeend', `<span class="ed-lapis" data-modo-ed="${esc(m.dataset.modo)}" title="Editar este modo">✏️</span>`); });
    [['#trilhoGratis', 'gratis'], ['#trilhoPagos', 'pago'], ['#trilhoMembros', 'membros'], ['#trilhoExtras', 'extra'], ['#trilhoAlunos', 'aluno']].forEach(([sel, tipo]) => {
      const tr = $(sel); if (tr && !tr.querySelector('.ed-mais')) tr.insertAdjacentHTML('beforeend', `<button class="ed-mais" type="button" data-ed-novo="${tipo}">＋ Novo card</button>`);
    });
    marcarTextos();
  }
  new MutationObserver(() => { if (document.body.classList.contains('ed')) enfeitar(); }).observe($('main') || document.body, { childList: true, subtree: true });

  /* ---------- barra: ações ---------- */
  async function salvar() {
    const ids = (H.cards || []).map(c => c.id).concat((H.modos || []).map(m => 'm:' + m.id));
    if (new Set(ids).size !== ids.length) { estado('Dois cards ou modos com o mesmo código', 'sujo'); return; }
    estado('Publicando…', 'sujo');
    const { error } = await sb.from('site_config').upsert({ id: 'hub', dados: H, updated_at: new Date().toISOString() });
    if (error) { estado('Não deu pra salvar', 'sujo'); return; }
    try { localStorage.removeItem(RASC); } catch (e) {}
    sujo = false; estado('Publicado ✓', 'ok');
  }
  barra.addEventListener('click', async e => {
    const b = e.target.closest('[data-ed]'); if (!b) return;
    const a = b.dataset.ed;
    if (a === 'tudo') abrirGaveta('Tudo do Hub', null);
    if (a === 'cores') abrirGaveta('Cores e fundo', { sec: 'tema' });
    if (a === 'abertura') { $('#entrada').classList.remove('sai'); document.body.style.overflow = 'hidden'; abrirGaveta('Abertura', { sec: 'entrada' }); }
    if (a === 'salvar') salvar();
    if (a === 'desfazer') { if (confirm('Descartar tudo o que não foi publicado?')) { try { localStorage.removeItem(RASC); } catch (er) {} recarregar(); } }
    if (a === 'sair') { if (!sujo || confirm('Sair sem publicar? O rascunho fica guardado neste navegador.')) location.href = location.pathname; }
  });
  gaveta.addEventListener('click', e => { if (e.target.closest('[data-ed="fechar"]')) fecharGaveta(); });
  addEventListener('beforeunload', pos);

  function ligar() {
    document.body.classList.add('ed');
    enfeitar();
    // volta pro mesmo lugar depois de recarregar
    try {
      const p = JSON.parse(sessionStorage.getItem('ed:pos') || 'null');
      if (p && p.dentro) { $('#ligar').click(); setTimeout(() => scrollTo(0, p.y), 120); }
    } catch (e) {}
  }

  if (await ehAdmin()) ligar(); else pedirLogin();
})();
