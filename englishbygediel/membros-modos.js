/* Entrada do professor: depois do login, quem é admin escolhe entre dois botões grandes.
   · MODO EDITOR    → a plataforma como o aluno vê, com o modo edição ligado (editar tudo) e atalhos de administração.
   · MODO PROFESSOR → painel com os mentorandos, pedidos, sala e os setores da operação.
   Só aparece pra admin (tabela admins). Um professor novo no futuro = entrar na tabela admins.
   Pra testar o modo aluno/EOM sem a porta: ?modo=… ou ?porta=… */
(function () {
  var S = function () { return (window.EBG_ACESSO || {}).estado || {}; };
  var $ = function (id) { return document.getElementById(id); };
  var ss = function (k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) {} return null; };
  var ls = function (k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; };
  var esc = function (x) { return String(x == null ? '' : x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var admin = function () { var s = S(); return !!(s.admin || window._isAdmin); };
  var QS = new URLSearchParams(location.search);
  var PULA = QS.has('modo') || QS.has('porta');

  var css = document.createElement('style');
  css.textContent =
    '#mm-porta,#mm-prof{position:fixed;inset:0;z-index:9650;display:none;overflow:auto;background:var(--bg);color:var(--fg);padding:max(20px,env(safe-area-inset-top,0px)) max(16px,env(safe-area-inset-right,0px)) max(24px,env(safe-area-inset-bottom,0px)) max(16px,env(safe-area-inset-left,0px))}' +
    '#mm-porta.on,#mm-prof.on{display:block}#mm-porta .box{max-width:900px;margin:0 auto;min-height:100%;display:flex;flex-direction:column;justify-content:center;gap:22px}' +
    '#mm-porta h1{font-size:clamp(22px,4vw,30px);margin:0;text-align:center;font-weight:800}#mm-porta .oi{text-align:center;font-size:14px;color:var(--fg2);margin-bottom:-14px}' +
    '#mm-porta .grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}' +
    '.mm-big{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;min-height:min(52vh,360px);border:1px solid var(--border);border-radius:28px;padding:28px 20px;background:var(--surface);color:var(--fg);font:inherit;text-align:center;cursor:pointer;box-shadow:var(--shadow,0 6px 20px rgba(0,0,0,.12));transition:transform .2s,box-shadow .2s}' +
    '.mm-big div{display:flex;flex-direction:column;align-items:center;gap:6px}.mm-big:hover{transform:translateY(-4px) scale(1.012);box-shadow:0 18px 40px rgba(0,0,0,.28)}.mm-big:focus-visible{outline:3px solid var(--accent);outline-offset:3px}.mm-big.ult{border-color:var(--accent)}' +
    '.mm-big svg{width:clamp(72px,12vw,110px);height:clamp(72px,12vw,110px);color:var(--accent)}.mm-big b{font-size:clamp(26px,4.4vw,38px);font-weight:800;letter-spacing:-.5px}.mm-big span{font-size:14px;color:var(--fg2);max-width:290px;line-height:1.5}' +
    '@media(max-width:720px){#mm-porta .grid{grid-template-columns:1fr}.mm-big{min-height:0;flex-direction:row;text-align:left;gap:16px;padding:22px}.mm-big svg{width:64px;height:64px;flex:none}.mm-big div{align-items:flex-start;gap:4px}}' +
    '#mm-faixa{position:fixed;left:0;right:0;top:0;z-index:9000;display:none;align-items:center;gap:8px;flex-wrap:wrap;padding:8px max(12px,env(safe-area-inset-right,0px)) 8px max(12px,env(safe-area-inset-left,0px));padding-top:max(8px,env(safe-area-inset-top,0px));background:var(--accent);color:#fff;font-size:13px;font-weight:700}' +
    'body.mm-ed #mm-faixa{display:flex}body.mm-ed .app,body.mm-ed .layout,body.mm-ed .sidebar,body.mm-ed .main{margin-top:0}body.mm-ed{padding-top:46px}' +
    '#mm-faixa button{border:0;border-radius:10px;padding:6px 12px;font:inherit;font-weight:800;font-size:12.5px;cursor:pointer;background:rgba(255,255,255,.22);color:#fff}#mm-faixa button:hover{background:rgba(255,255,255,.36)}#mm-faixa .t{flex:1;min-width:120px}' +
    '#mm-prof .wrap{max-width:980px;margin:0 auto;display:flex;flex-direction:column;gap:16px}#mm-prof .hd{display:flex;align-items:center;gap:10px;flex-wrap:wrap}#mm-prof .hd h2{margin:0;flex:1;font-size:22px;font-weight:800}' +
    '.mm-b{border:1px solid var(--border);background:var(--surface2);color:var(--fg);border-radius:12px;padding:9px 14px;font:inherit;font-weight:700;font-size:13.5px;cursor:pointer}.mm-b.p{background:var(--accent);color:#fff;border-color:transparent}.mm-b.s{padding:6px 11px;font-size:12.5px}' +
    '#mm-prof .mets{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px}#mm-prof .met{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:14px}#mm-prof .met small{display:block;font-size:12px;color:var(--fg2)}#mm-prof .met b{font-size:28px;font-weight:800}' +
    '#mm-prof .cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px}#mm-prof .cx{background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:14px 16px}#mm-prof .cx h3{margin:0 0 6px;font-size:15px;font-weight:800}' +
    '#mm-prof .li{display:flex;align-items:center;gap:10px;padding:9px 0;border-top:1px solid var(--border);font-size:13.5px}#mm-prof .li:first-of-type{border-top:0}#mm-prof .li .tx{flex:1;min-width:0}#mm-prof .li small{display:block;color:var(--fg2);font-size:12px}' +
    '#mm-prof .chip{font-size:11.5px;font-weight:700;padding:3px 9px;border-radius:99px;white-space:nowrap}#mm-prof .ok{background:rgba(27,143,107,.16);color:#1b8f6b}#mm-prof .wa{background:rgba(217,154,43,.2);color:#b87a12}#mm-prof .mu{background:var(--surface2);color:var(--fg2)}' +
    '#mm-prof .secs{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px}#mm-prof .sec{display:flex;align-items:center;gap:10px;border:1px solid var(--border);background:var(--surface);color:var(--fg);border-radius:14px;padding:14px;font:inherit;font-weight:700;font-size:14px;cursor:pointer;text-align:left;transition:transform .15s,box-shadow .15s}#mm-prof .sec:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(0,0,0,.18)}' +
    '#mm-prof .vz{color:var(--fg2);font-size:13px;padding:6px 0}';
  document.head.appendChild(css);

  var PEN = '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 52l4-14L42 12a5 5 0 017 7L23 45z"/><path d="M38 16l8 8M12 52l14-4"/></svg>';
  var DASH = '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="10" width="20" height="26" rx="4"/><rect x="36" y="10" width="20" height="14" rx="4"/><rect x="36" y="32" width="20" height="22" rx="4"/><rect x="8" y="44" width="20" height="10" rx="4"/></svg>';

  var porta = document.createElement('div');
  porta.id = 'mm-porta'; porta.setAttribute('role', 'dialog'); porta.setAttribute('aria-label', 'Escolha o modo');
  porta.innerHTML = '<div class="box"><div class="oi" id="mm-oi"></div><h1>Por onde você quer entrar?</h1><div class="grid">' +
    '<button type="button" class="mm-big" data-mm="editor">' + PEN + '<div><b>Modo editor</b><span>A plataforma como o aluno vê, mas você edita tudo e controla os acessos</span></div></button>' +
    '<button type="button" class="mm-big" data-mm="professor">' + DASH + '<div><b>Modo professor</b><span>Seu painel: mentorandos, pedidos, sala e a operação</span></div></button></div></div>';
  document.body.appendChild(porta);

  var faixa = document.createElement('div');
  faixa.id = 'mm-faixa';
  faixa.innerHTML = '<button type="button" data-mm="inicio">← Início</button><span class="t">✏️ Modo editor · salva sozinho</span><button type="button" data-mm="acessos">Acessos e materiais</button><button type="button" data-mm="admin">Painel admin</button>';
  document.body.appendChild(faixa);

  var prof = document.createElement('div'); prof.id = 'mm-prof'; document.body.appendChild(prof);

  function abrirPorta() {
    var u = ls('mi_modo_adm'); $('mm-oi').textContent = 'Olá, Gediel' + (u ? ' · último: ' + (u === 'editor' ? 'Modo editor' : 'Modo professor') : '');
    porta.classList.add('on'); prof.classList.remove('on'); document.body.classList.remove('mm-ed');
    if (window.MI_EDIT) MI_EDIT.ligar(false);
  }
  function entrarEditor() {
    ls('mi_modo_adm', 'editor'); ss('mm_ok', '1'); porta.classList.remove('on'); prof.classList.remove('on');
    document.body.classList.add('mm-ed'); if (window.MI_EDIT) MI_EDIT.ligar(true);
  }
  function entrarProfessor() {
    ls('mi_modo_adm', 'professor'); ss('mm_ok', '1'); porta.classList.remove('on'); document.body.classList.remove('mm-ed');
    if (window.MI_EDIT) MI_EDIT.ligar(false);
    prof.classList.add('on'); pintarProf(); if (window.EBG_MENTORIA) EBG_MENTORIA.recarregar().then(pintarProf);
  }
  function ir(pagina) {          // setor: fecha o painel e abre a página da plataforma
    prof.classList.remove('on');
    var el = [].filter.call(document.querySelectorAll('.nav-pill'), function (n) { return (n.getAttribute('onclick') || '').indexOf("'" + pagina + "'") >= 0; })[0];
    if (window.goTo) goTo(pagina, el || null);
  }

  function pintarProf() {
    if (!prof.classList.contains('on')) return;
    var D = window.EBG_MENTORIA ? EBG_MENTORIA.dados() : { alunos: [], enc: [], pres: {}, ok: false }, E = window.EBG_MENTORIA;
    var ped = D.enc.filter(function (e) { return e.status === 'pedido'; }).sort(function (a, b) { return new Date(a.inicio) - new Date(b.inicio); });
    var naSala = D.alunos.filter(function (a) { return a.sala && D.pres[a.sala] > 0; }).length;
    var hoje = new Date().toDateString(), nHoje = 0;
    D.alunos.forEach(function (a) {
      nHoje += D.enc.filter(function (e) { return e.mentoria_id === a.id && e.status === 'confirmado' && new Date(e.inicio).toDateString() === hoje; }).length;
      var fx = E ? E.fixos(a, 1)[0] : null; if (fx && fx.toDateString() === hoje) nHoje++;
    });
    var h = '<div class="wrap"><div class="hd"><button type="button" class="mm-b" data-mm="inicio">← Início</button><h2>Modo professor</h2><button type="button" class="mm-b p" data-mm="minhasala">Minha sala</button></div>' +
      '<div class="mets"><div class="met"><small>Pedidos esperando</small><b>' + ped.length + '</b></div><div class="met"><small>Na sala agora</small><b>' + naSala + '</b></div><div class="met"><small>Encontros hoje</small><b>' + nHoje + '</b></div><div class="met"><small>Mentorandos</small><b>' + D.alunos.length + '</b></div></div>';
    if (!D.ok) h += '<div class="cx">Os dados das mentorias ligam depois que você rodar o SQL das mentorias no Supabase.</div>';
    h += '<div class="cols"><div class="cx"><h3>Pedidos de mentoria</h3>' + (ped.length ? ped.slice(0, 6).map(function (e) {
      var a = D.alunos.filter(function (x) { return x.id === e.mentoria_id; })[0] || { nome: e.email || '?' };
      return '<div class="li" data-e="' + e.id + '">' + (E ? E.avatar(a) : '') + '<span class="tx"><b>' + esc(a.nome) + '</b><small>' + esc(E ? E.dt(e.inicio) : e.inicio) + (e.tipo ? ' · ' + esc(e.tipo) : '') + '</small></span><button type="button" class="mm-b s p" data-mm="confirmar">Confirmar</button></div>';
    }).join('') : '<div class="vz">Nenhum pedido esperando.</div>') + '</div>' +
      '<div class="cx"><h3>Mentorandos</h3>' + (D.alunos.length ? D.alunos.slice(0, 8).map(function (a) {
        var on = a.sala && D.pres[a.sala] > 0, pd = D.enc.filter(function (e) { return e.mentoria_id === a.id && e.status === 'pedido'; }).length;
        return '<div class="li">' + (E ? E.avatar(a) : '') + '<span class="tx"><b>' + esc(a.nome) + '</b><small>' + (E ? E.feitos(a) : 0) + (a.encontros_total ? ' de ' + a.encontros_total : '') + ' encontros</small></span><span class="chip ' + (on ? 'ok' : pd ? 'wa' : 'mu') + '">' + (on ? 'na sala' : pd ? 'pedido' : 'offline') + '</span></div>';
      }).join('') + (D.alunos.length > 8 ? '<div class="vz">+ ' + (D.alunos.length - 8) + ' em Mentorias</div>' : '') : '<div class="vz">Nenhum mentorando ainda. Em Alunos e acessos, use “Tornar mentorando”.</div>') + '</div></div>' +
      '<div class="vz" style="padding:0">Setores</div><div class="secs">' +
      [['mentoria', '🎓', 'Mentorias'], ['mt10', '🏁', 'Maratona'], ['admin', '👥', 'Alunos e acessos'], ['admin', '🛒', 'Vendas'], ['eom', '💬', 'Mural e EOM'], ['lives', '📅', 'Agenda e lives']].map(function (s) {
        return '<button type="button" class="sec" data-mm="ir" data-p="' + s[0] + '"><span style="font-size:22px">' + s[1] + '</span>' + s[2] + '</button>';
      }).join('') + '</div></div>';
    if (prof.dataset.h !== h) { prof.dataset.h = h; prof.innerHTML = h; }
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-mm]'); if (!t) return;
    var a = t.dataset.mm;
    if (a === 'editor') entrarEditor();
    else if (a === 'professor') entrarProfessor();
    else if (a === 'inicio') { ss('mm_ok', null); abrirPorta(); }
    else if (a === 'ir') ir(t.dataset.p);
    else if (a === 'minhasala') { if (window.EBG_MENTORIA) EBG_MENTORIA.minhaSala(); }
    else if (a === 'confirmar') { var el = t.closest('[data-e]'); if (el && window.EBG_MENTORIA) EBG_MENTORIA.decidir(el.dataset.e, 'confirmado').then(pintarProf); }
    else if (a === 'acessos') { var b = $('btn-gerenciar'); if (b) b.click(); }
    else if (a === 'admin') { var n = $('admin-nav'); if (n) n.click(); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && prof.classList.contains('on')) { ss('mm_ok', null); abrirPorta(); } });

  var decidido = false;
  setInterval(function () {
    if (!decidido && S().pronto) { decidido = true; if (admin() && !PULA && !ss('mm_ok')) abrirPorta(); }
    if (prof.classList.contains('on')) pintarProf();
  }, 1000);
  window.EBG_MODOS = { abrir: abrirPorta, editor: entrarEditor, professor: entrarProfessor };
})();
