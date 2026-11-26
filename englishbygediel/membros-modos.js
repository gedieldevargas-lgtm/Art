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
    '#mm-porta,#mm-prof{position:fixed;inset:0;z-index:9990;display:none;overflow:auto;background:var(--bg);color:var(--fg);padding:max(20px,env(safe-area-inset-top,0px)) max(16px,env(safe-area-inset-right,0px)) max(24px,env(safe-area-inset-bottom,0px)) max(16px,env(safe-area-inset-left,0px))}' +
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

  var prof = document.createElement('div'); prof.id = 'mm-prof';
  var ABAS = [['painel', '🏠 Painel'], ['mentorias', '🎓 Mentorias'], ['duvidas', '🙋 Dúvidas'], ['vendas', '💰 Vendas']];
  prof.innerHTML = '<div class="wrap"><div class="hd"><button type="button" class="mm-b" data-mm="inicio">← Início</button><h2>Modo professor</h2><button type="button" class="mm-b p" data-mm="minhasala">Minha sala</button></div>' +
    '<div class="tabs">' + ABAS.map(function (x, i) { return '<button type="button" class="mm-tab' + (i ? '' : ' on') + '" data-mm="aba" data-t="' + x[0] + '">' + x[1] + '<i class="n" id="mm-n-' + x[0] + '"></i></button>'; }).join('') + '</div>' +
    '<div id="mm-painel"></div><div id="mm-duvidas" style="display:none"></div><div id="mm-vendas" style="display:none"></div><div id="mm-mhost" style="display:none"></div></div>';
  document.body.appendChild(prof);
  var volta = document.createElement('div'); volta.id = 'mm-volta';
  volta.innerHTML = '<button type="button" data-mm="painel-volta">← Painel do professor</button><span class="t" id="mm-volta-t"></span>';
  document.body.appendChild(volta);
  css.textContent += '#mm-prof .tabs{display:flex;gap:8px;flex-wrap:wrap}.mm-tab{position:relative;border:1px solid var(--border);background:var(--surface);color:var(--fg2);border-radius:99px;padding:9px 18px;font:inherit;font-weight:800;font-size:14px;cursor:pointer}.mm-tab.on{background:var(--accent);color:#fff;border-color:transparent}.mm-tab .n{display:none;font-style:normal;margin-left:7px;background:#ef4444;color:#fff;border-radius:99px;font-size:11px;padding:1px 7px}.mm-tab .n.on{display:inline-block}' +
    '#mm-painel{display:flex;flex-direction:column;gap:16px}#mm-prof .li{flex-wrap:wrap}#mm-prof .li .tx{min-width:130px}#mm-prof .vz{margin:0}' +
    '#mm-mhost .pane{display:block;opacity:1}#mm-mhost #pane-mentoria{padding:0}' +
    '#mm-volta{position:fixed;left:0;right:0;top:0;z-index:9100;display:none;align-items:center;gap:10px;padding:8px max(12px,env(safe-area-inset-right,0px)) 8px max(12px,env(safe-area-inset-left,0px));padding-top:max(8px,env(safe-area-inset-top,0px));background:var(--accent);color:#fff;font-size:13px;font-weight:700}body.mm-sec #mm-volta{display:flex}body.mm-sec{padding-top:46px}' +
    '#mm-volta button{border:0;border-radius:10px;padding:7px 14px;font:inherit;font-weight:800;font-size:13px;cursor:pointer;background:rgba(255,255,255,.24);color:#fff}#mm-volta button:hover{background:rgba(255,255,255,.38)}#mm-volta .t{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '#mm-prof textarea{width:100%;box-sizing:border-box;border:1px solid var(--border);background:var(--surface2);color:var(--fg);border-radius:12px;padding:10px 12px;font:inherit;font-size:13.5px;resize:vertical;min-height:64px}' +
    '#mm-prof .q{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:14px;display:flex;flex-direction:column;gap:8px}#mm-prof .q .w{font-size:12px;color:var(--fg2)}#mm-prof .q .b{font-size:14px;line-height:1.55;white-space:pre-wrap;overflow-wrap:anywhere}#mm-prof .q .r{background:var(--surface2);border-radius:12px;padding:10px 12px;font-size:13px;white-space:pre-wrap;overflow-wrap:anywhere}' +
    '#mm-prof .ls{display:flex;flex-direction:column;gap:10px}#mm-prof .bar{display:flex;gap:8px;flex-wrap:wrap;align-items:center}#mm-prof input.bs{flex:1;min-width:180px;box-sizing:border-box;border:1px solid var(--border);background:var(--surface2);color:var(--fg);border-radius:12px;padding:9px 12px;font:inherit;font-size:13.5px}' +
    '#mm-prof table{width:100%;border-collapse:collapse;font-size:13px}#mm-prof td,#mm-prof th{padding:8px 6px;border-top:1px solid var(--border);text-align:left;overflow-wrap:anywhere}#mm-prof th{font-size:11.5px;color:var(--fg2);border-top:0}';

  /* dados extras (dúvidas, vendas) */
  var X = { duv: [], com: [], duvOk: false, comOk: false, em: 0 };
  async function carregarExtra() {
    var sb = window._sb; if (!sb || !admin()) return;
    try { var q = await sb.from('mi_questions').select('*').order('created_at', { ascending: false }).limit(80); X.duvOk = !q.error; X.duv = q.data || []; } catch (e) { X.duvOk = false; }
    try { var c = await sb.from('compras').select('pedido,email,produto,created_at').order('created_at', { ascending: false }).limit(400); X.comOk = !c.error; X.com = c.data || []; } catch (e) { X.comOk = false; }
    marcas();
  }
  var semResp = function () { return X.duv.filter(function (q) { return !q.answer; }); };
  function marcas() {
    var n = $('mm-n-duvidas'), p = $('mm-n-mentorias'), D = window.EBG_MENTORIA ? EBG_MENTORIA.dados() : { enc: [] };
    var np = D.enc.filter(function (e) { return e.status === 'pedido'; }).length, nd = semResp().length;
    if (n) { n.textContent = nd; n.classList.toggle('on', nd > 0); } if (p) { p.textContent = np; p.classList.toggle('on', np > 0); }
  }
  var dia = function (iso) { var d = new Date(iso); return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); };

  var digitando = function () { var a = document.activeElement; return a && prof.contains(a) && /INPUT|TEXTAREA|SELECT/.test(a.tagName); };
  function aba(t) {
    var host = $('mm-mhost'), pn = $('pane-mentoria');
    [].forEach.call(prof.querySelectorAll('.mm-tab'), function (b) { b.classList.toggle('on', b.dataset.t === t); });
    prof.dataset.tab = t;
    $('mm-painel').style.display = t === 'painel' ? '' : 'none'; $('mm-duvidas').style.display = t === 'duvidas' ? '' : 'none';
    $('mm-vendas').style.display = t === 'vendas' ? '' : 'none'; host.style.display = t === 'mentorias' ? '' : 'none';
    if (t === 'mentorias' && pn) { host.appendChild(pn); if (window.EBG_MENTORIA) EBG_MENTORIA.recarregar(); }
    else devolverPane();
    if (t === 'duvidas' || t === 'vendas') carregarExtra().then(function () { if (prof.dataset.tab === t) pintarProf(true); });
    pintarProf(true); prof.scrollTop = 0;
  }
  function devolverPane() {   // a aba Mentorias volta pro lugar de origem (usada fora do Modo professor)
    var pn = $('pane-mentoria'), ag = $('pane-agendar');
    if (pn && ag && pn.parentNode === $('mm-mhost')) ag.insertAdjacentElement('afterend', pn);
  }

  function abrirPorta() {
    var u = ls('mi_modo_adm'); $('mm-oi').textContent = 'Olá, Gediel' + (u ? ' · último: ' + (u === 'editor' ? 'Modo editor' : 'Modo professor') : '');
    porta.classList.add('on'); prof.classList.remove('on'); devolverPane(); document.body.classList.remove('mm-ed', 'mm-sec');
    if (window.MI_EDIT) MI_EDIT.ligar(false);
  }
  function entrarEditor() {
    ls('mi_modo_adm', 'editor'); ss('mm_ok', '1'); porta.classList.remove('on'); prof.classList.remove('on'); document.body.classList.remove('mm-sec');
    document.body.classList.add('mm-ed'); if (window.MI_EDIT) MI_EDIT.ligar(true);
  }
  function entrarProfessor() {
    ls('mi_modo_adm', 'professor'); ss('mm_ok', '1'); porta.classList.remove('on'); document.body.classList.remove('mm-ed', 'mm-sec');
    if (window.MI_EDIT) MI_EDIT.ligar(false);
    prof.classList.add('on'); aba('painel'); carregarExtra().then(function () { pintarProf(true); });
    if (window.EBG_MENTORIA) EBG_MENTORIA.recarregar().then(function () { pintarProf(true); });
  }
  function voltarPainel() { document.body.classList.remove('mm-sec'); prof.classList.add('on'); aba('painel'); }

  /* setores: abrem a página real da plataforma, com a barra "← Painel do professor" sempre no topo pra voltar */
  var SETORES = [
    { ic: '🎓', t: 'Mentorias', a: 'aba', v: 'mentorias' },
    { ic: '🙋', t: 'Dúvidas dos alunos', a: 'aba', v: 'duvidas' },
    { ic: '💰', t: 'Vendas', a: 'aba', v: 'vendas' },
    { ic: '👥', t: 'Alunos e acessos', a: 'admin', v: 'usuarios' },
    { ic: '🏁', t: 'Maratona', a: 'admin', v: 'mt10' },
    { ic: '📚', t: 'Aulas e módulos', a: 'admin', v: 'modulos' },
    { ic: '💬', t: 'Comentários das aulas', a: 'admin', v: 'comentarios' },
    { ic: '🎥', t: 'Links das salas', a: 'admin', v: 'mentorias' },
    { ic: '📅', t: 'Agenda e lives', a: 'pag', v: 'lives' },
    { ic: '🙏', t: 'Mural e EOM', a: 'pag', v: 'eom' }
  ];
  function pillDe(pg) { return [].filter.call(document.querySelectorAll('.nav-pill'), function (n) { return (n.getAttribute('onclick') || '').indexOf("'" + pg + "'") >= 0; })[0] || null; }
  function sair(titulo) { prof.classList.remove('on'); devolverPane(); document.body.classList.add('mm-sec'); $('mm-volta-t').textContent = titulo || ''; }
  function setor(s) {
    if (s.a === 'aba') return aba(s.v);
    sair(s.t);
    if (s.a === 'pag') { if (window.goTo) goTo(s.v, pillDe(s.v)); return; }
    // admin: abre o painel admin e cai direto na aba pedida
    if (window.goTo) goTo('admin', $('admin-nav'));
    var tent = 0;
    (function procurar() {
      var bt = [].filter.call(document.querySelectorAll('#pane-admin .admin-tab'), function (b) { return (b.getAttribute('onclick') || '').indexOf("'" + s.v + "'") >= 0; })[0];
      if (bt) { if (window.adminTab) adminTab(s.v, bt); else bt.click(); return; }
      if (++tent < 14) return setTimeout(procurar, 300);
      if (s.v === 'mt10' && window.goTo) goTo('mt10', pillDe('mt10'));   // a aba do admin não montou: abre a página da Maratona
    })();
  }

  var vendaBusca = '';
  function htmlVendas() {
    if (!X.comOk) return '<div class="cx">Não consegui ler as vendas (tabela compras). Confira se o SQL dos membros foi rodado.</div>';
    var por = {}, lim = Date.now() - 30 * 864e5, n30 = 0;
    X.com.forEach(function (c) { var k = c.produto || '—'; por[k] = (por[k] || 0) + 1; if (new Date(c.created_at).getTime() >= lim) n30++; });
    var tops = Object.keys(por).sort(function (a, b) { return por[b] - por[a]; }).slice(0, 8);
    var q = vendaBusca.toLowerCase();
    var l = X.com.filter(function (c) { return !q || (c.email || '').toLowerCase().indexOf(q) >= 0 || (c.produto || '').toLowerCase().indexOf(q) >= 0; }).slice(0, 40);
    return '<div class="mets"><div class="met"><small>Últimos 30 dias</small><b>' + n30 + '</b></div><div class="met"><small>Total registrado</small><b>' + X.com.length + (X.com.length >= 400 ? '+' : '') + '</b></div></div>' +
      '<div class="cols"><div class="cx"><h3>Mais vendidos</h3>' + (tops.length ? tops.map(function (k) { return '<div class="li"><span class="tx"><b>' + esc(k) + '</b></span><span class="chip mu">' + por[k] + '</span></div>'; }).join('') : '<div class="vz">Nenhuma venda registrada ainda.</div>') + '</div>' +
      '<div class="cx"><h3>Últimas compras</h3><div class="bar" style="margin-bottom:6px"><input class="bs" id="mm-vb" placeholder="Buscar por e-mail ou produto" value="' + esc(vendaBusca) + '"></div>' +
      (l.length ? '<table><tr><th>Quando</th><th>Aluno</th><th>Produto</th></tr>' + l.map(function (c) { return '<tr><td>' + esc(dia(c.created_at)) + '</td><td>' + esc(c.email) + '</td><td>' + esc(c.produto || '—') + '</td></tr>'; }).join('') + '</table>' : '<div class="vz">Nada encontrado.</div>') + '</div></div>';
  }
  function htmlDuvidas() {
    if (!X.duvOk) return '<div class="cx">Não consegui ler as dúvidas (tabela mi_questions). Confira se o aulas.sql foi rodado.</div>';
    var pend = semResp(), resp = X.duv.filter(function (q) { return q.answer; }).slice(0, 10);
    var card = function (q, feita) {
      return '<div class="q" data-q="' + q.id + '"><div class="w"><b style="color:var(--fg)">' + esc(q.user_name) + '</b>' + (q.user_email ? ' · ' + esc(q.user_email) : '') + ' · ' + esc(dia(q.created_at)) + '</div><div class="b">' + esc(q.body) + '</div>' +
        (feita ? '<div class="r"><b>Sua resposta:</b> ' + esc(q.answer) + '</div>' : '<textarea placeholder="Responder pro aluno…"></textarea><div><button type="button" class="mm-b p s" data-mm="responder">Enviar resposta</button></div>') + '</div>';
    };
    return '<div class="ls">' + (pend.length ? '<h3 style="margin:0">Esperando você (' + pend.length + ')</h3>' + pend.map(function (q) { return card(q, false); }).join('') : '<div class="cx">Nenhuma dúvida esperando. 🎉</div>') +
      (resp.length ? '<h3 style="margin:8px 0 0">Respondidas recentemente</h3>' + resp.map(function (q) { return card(q, true); }).join('') : '') + '</div>';
  }

  function pintarProf(forca) {
    if (!prof.classList.contains('on')) return;
    marcas();
    var t = prof.dataset.tab || 'painel';
    if (t === 'mentorias') return;
    if (!forca && digitando()) return;                      // não atropela quem está digitando
    if (t === 'duvidas') { var d = $('mm-duvidas'), hd = htmlDuvidas(); if (d.dataset.h !== hd) { d.dataset.h = hd; d.innerHTML = hd; } return; }
    if (t === 'vendas') { var v = $('mm-vendas'), hv = htmlVendas(); if (v.dataset.h !== hv) { v.dataset.h = hv; v.innerHTML = hv; } return; }
    var D = window.EBG_MENTORIA ? EBG_MENTORIA.dados() : { alunos: [], enc: [], pres: {}, ok: false }, E = window.EBG_MENTORIA;
    var ped = D.enc.filter(function (e) { return e.status === 'pedido'; }).sort(function (a, b) { return new Date(a.inicio) - new Date(b.inicio); });
    var naSala = D.alunos.filter(function (a) { return a.sala && D.pres[a.sala] > 0; }).length;
    var hoje = new Date().toDateString(), nHoje = 0, prox = [], lim = Date.now() + 7 * 864e5;
    D.alunos.forEach(function (a) {
      D.enc.filter(function (e) { return e.mentoria_id === a.id && e.status === 'confirmado' && new Date(e.inicio).getTime() > Date.now() - 90 * 60000 && new Date(e.inicio).getTime() < lim; })
        .forEach(function (e) { prox.push({ a: a, d: new Date(e.inicio), tipo: e.tipo || 'extra' }); });
      (E ? E.fixos(a, 4) : []).forEach(function (f) { if (f.getTime() < lim) prox.push({ a: a, d: f, tipo: 'fixo' }); });
    });
    prox.sort(function (x, y) { return x.d - y.d; }); prox.forEach(function (p) { if (p.d.toDateString() === hoje) nHoje++; });
    var nd = semResp().length;
    var h = '<div class="mets"><div class="met"><small>Pedidos esperando</small><b>' + ped.length + '</b></div><div class="met"><small>Na sala agora</small><b>' + naSala + '</b></div><div class="met"><small>Encontros hoje</small><b>' + nHoje + '</b></div><div class="met"><small>Mentorandos</small><b>' + D.alunos.length + '</b></div><div class="met"><small>Dúvidas esperando</small><b>' + nd + '</b></div></div>';
    if (!D.ok) h += '<div class="cx">Os dados das mentorias ligam depois que você rodar o SQL das mentorias no Supabase.</div>';
    h += '<div class="cols"><div class="cx"><h3>Pedidos de mentoria</h3>' + (ped.length ? ped.slice(0, 6).map(function (e) {
      var a = D.alunos.filter(function (x) { return x.id === e.mentoria_id; })[0] || { nome: e.email || '?' };
      return '<div class="li" data-e="' + e.id + '">' + (E ? E.avatar(a) : '') + '<span class="tx"><b>' + esc(a.nome) + '</b><small>' + esc(E ? E.dt(e.inicio) : e.inicio) + (e.tipo ? ' · ' + esc(e.tipo) : '') + '</small></span><button type="button" class="mm-b s" data-mm="recusar">Recusar</button><button type="button" class="mm-b s p" data-mm="confirmar">Confirmar</button></div>';
    }).join('') : '<div class="vz">Nenhum pedido esperando.</div>') + '</div>' +
      '<div class="cx"><h3>Próximos encontros (7 dias)</h3>' + (prox.length ? prox.slice(0, 7).map(function (p) {
        return '<div class="li">' + (E ? E.avatar(p.a) : '') + '<span class="tx"><b>' + esc(p.a.nome) + '</b><small>' + esc(E ? E.dt(p.d.toISOString()) : p.d) + '</small></span><span class="chip mu">' + esc(p.tipo) + '</span></div>';
      }).join('') : '<div class="vz">Nenhum encontro nos próximos 7 dias.</div>') + '</div>' +
      '<div class="cx"><h3>Mentorandos</h3>' + (D.alunos.length ? D.alunos.slice(0, 8).map(function (a) {
        var on = a.sala && D.pres[a.sala] > 0, pd = D.enc.filter(function (e) { return e.mentoria_id === a.id && e.status === 'pedido'; }).length;
        return '<div class="li">' + (E ? E.avatar(a) : '') + '<span class="tx"><b>' + esc(a.nome) + '</b><small>' + (E ? E.feitos(a) : 0) + (a.encontros_total ? ' de ' + a.encontros_total : '') + ' encontros</small></span><span class="chip ' + (on ? 'ok' : pd ? 'wa' : 'mu') + '">' + (on ? 'na sala' : pd ? 'pedido' : 'offline') + '</span></div>';
      }).join('') + (D.alunos.length > 8 ? '<div class="vz">+ ' + (D.alunos.length - 8) + ' em Mentorias</div>' : '') : '<div class="vz">Nenhum mentorando ainda. Em Alunos e acessos, use “Tornar mentorando”.</div>') + '</div>' +
      '<div class="cx"><h3>Dúvidas esperando</h3>' + (nd ? semResp().slice(0, 3).map(function (q) { return '<div class="li"><span class="tx"><b>' + esc(q.user_name) + '</b><small>' + esc(String(q.body).slice(0, 90)) + '</small></span></div>'; }).join('') + '<div style="margin-top:8px"><button type="button" class="mm-b s p" data-mm="aba" data-t="duvidas">Responder agora</button></div>' : '<div class="vz">' + (X.duvOk ? 'Nenhuma dúvida esperando.' : 'Dúvidas ligam quando o aulas.sql estiver rodado.') + '</div>') + '</div></div>' +
      '<div class="vz" style="padding:0">Setores</div><div class="secs">' +
      SETORES.map(function (s, i) { return '<button type="button" class="sec" data-mm="setor" data-i="' + i + '"><span style="font-size:22px">' + s.ic + '</span>' + s.t + '</button>'; }).join('') + '</div>';
    var pa = $('mm-painel'); if (pa && pa.dataset.h !== h) { pa.dataset.h = h; pa.innerHTML = h; }
  }

  async function responder(id, texto) {
    var r = await window._sb.from('mi_questions').update({ answer: texto, answered_at: new Date().toISOString() }).eq('id', id);
    if (r.error) { if (window.toast) toast('Não salvou a resposta 😕'); return false; }
    X.duv = X.duv.map(function (q) { return String(q.id) === String(id) ? Object.assign(q, { answer: texto }) : q; });
    if (window.toast) toast('✅ Resposta enviada'); pintarProf(true); return true;
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-mm]'); if (!t) return;
    var a = t.dataset.mm;
    if (a === 'editor') entrarEditor();
    else if (a === 'professor') entrarProfessor();
    else if (a === 'aba') aba(t.dataset.t);
    else if (a === 'setor') setor(SETORES[+t.dataset.i]);
    else if (a === 'painel-volta') voltarPainel();
    else if (a === 'inicio') { ss('mm_ok', null); devolverPane(); abrirPorta(); }
    else if (a === 'minhasala') { if (window.EBG_MENTORIA) EBG_MENTORIA.minhaSala(); }
    else if (a === 'confirmar' || a === 'recusar') { var el = t.closest('[data-e]'); if (el && window.EBG_MENTORIA) EBG_MENTORIA.decidir(el.dataset.e, a === 'confirmar' ? 'confirmado' : 'cancelado').then(function () { pintarProf(true); }); }
    else if (a === 'responder') { var qd = t.closest('[data-q]'), ta = qd && qd.querySelector('textarea'), tx = ta && ta.value.trim(); if (!tx) { if (ta) ta.focus(); return; } responder(qd.dataset.q, tx); }
    else if (a === 'acessos') { var b = $('btn-gerenciar'); if (b) b.click(); }
    else if (a === 'admin') { var n = $('admin-nav'); if (n) n.click(); }
  });
  document.addEventListener('input', function (e) { if (e.target.id === 'mm-vb') { vendaBusca = e.target.value; pintarProf(true); var i = $('mm-vb'); if (i) { i.focus(); i.setSelectionRange(vendaBusca.length, vendaBusca.length); } } });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && prof.classList.contains('on') && !digitando()) { ss('mm_ok', null); abrirPorta(); } });

  // já abre a porta no primeiro instante se este aparelho já entrou como admin (sem mostrar a plataforma antes)
  var PRE = ls('mi_adm_ok') === '1' && !PULA && !ss('mm_ok');
  if (PRE) { var u0 = ls('mi_modo_adm'); $('mm-oi').textContent = 'Olá, Gediel'; porta.classList.add('on'); }
  var decidido = false;
  setInterval(function () {
    var s = S();
    if (!decidido && s.pronto) {
      decidido = true;
      if (admin()) { ls('mi_adm_ok', '1'); if (!PULA && !ss('mm_ok') && !porta.classList.contains('on')) abrirPorta(); }
      else { ls('mi_adm_ok', '0'); if (PRE) porta.classList.remove('on'); }
      document.documentElement.classList.remove('mm-pre');
    }
    if (prof.classList.contains('on')) pintarProf();
  }, 200);
  setInterval(function () { if (prof.classList.contains('on') && !digitando()) carregarExtra(); }, 60000);
  window.EBG_MODOS = { abrir: abrirPorta, editor: entrarEditor, professor: entrarProfessor };
})();
