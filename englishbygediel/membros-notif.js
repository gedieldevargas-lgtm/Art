/* Sininho 🔔 do topo: central de avisos do aluno.
   Mostra: dúvida respondida pelo Gediel, aula nova liberada, live de hoje/amanhã e mentoria confirmada.
   A bolinha vermelha só aparece quando tem aviso novo (desde a última vez que o aluno abriu o sino). */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (x) { return String(x == null ? '' : x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var LS = { g: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, s: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  var uid = null, itens = [], aberto = false;
  var sbOk = function () { return window._sb && window._sb.auth; };
  var chave = function () { return 'mi_notif_seen_' + (uid || 'anon'); };

  var css = document.createElement('style');
  css.textContent = '.topbar .tb-btn .notif-dot{display:none}.topbar .tb-btn.tem-notif .notif-dot{display:block}' +
    '#nt-pop{position:fixed;top:58px;right:max(12px,env(safe-area-inset-right,0px));z-index:9200;width:min(380px,calc(100vw - 24px));max-height:min(70vh,560px);display:none;flex-direction:column;background:var(--surface);color:var(--fg);border:1px solid var(--border);border-radius:18px;box-shadow:0 18px 48px rgba(0,0,0,.35);overflow:hidden}' +
    '#nt-pop.on{display:flex}#nt-pop .h{display:flex;align-items:center;gap:8px;padding:14px 16px;border-bottom:1px solid var(--border);font-weight:800;font-size:15px}#nt-pop .h span{flex:1}' +
    '#nt-pop .x{border:0;background:var(--surface2);color:var(--fg);border-radius:10px;padding:6px 11px;font:inherit;font-weight:700;font-size:13px;cursor:pointer}' +
    '#nt-pop .l{overflow:auto;padding:6px 8px 10px;display:flex;flex-direction:column;gap:2px}#nt-pop .i{display:flex;gap:11px;align-items:flex-start;width:100%;text-align:left;border:0;background:transparent;color:inherit;font:inherit;border-radius:12px;padding:11px 10px;cursor:pointer}' +
    '#nt-pop .i:hover{background:var(--surface2)}#nt-pop .i.novo{background:rgba(79,110,247,.09)}#nt-pop .e{font-size:22px;line-height:1.1;flex:none}#nt-pop .t{font-size:13.5px;font-weight:700;line-height:1.35;overflow-wrap:anywhere}#nt-pop .s{font-size:12.5px;color:var(--fg2);margin-top:2px;line-height:1.4;overflow-wrap:anywhere}#nt-pop .w{font-size:11px;color:var(--fg3);margin-top:3px}#nt-pop .v{padding:26px 16px;text-align:center;color:var(--fg2);font-size:14px}';
  document.head.appendChild(css);

  var pop = document.createElement('div'); pop.id = 'nt-pop'; pop.setAttribute('role', 'dialog'); pop.setAttribute('aria-label', 'Avisos');
  document.body.appendChild(pop);

  var quando = function (ts) {
    var m = Math.round((Date.now() - ts) / 60000);
    if (m < 1) return 'agora'; if (m < 60) return 'há ' + m + ' min'; if (m < 1440) return 'há ' + Math.round(m / 60) + ' h';
    var d = Math.round(m / 1440); return d === 1 ? 'ontem' : 'há ' + d + ' dias';
  };
  function bell() { return [].filter.call(document.querySelectorAll('.topbar .tb-btn'), function (b) { return /🔔/.test(b.textContent) || b.querySelector('.notif-dot'); })[0]; }

  async function coletar() {
    if (!sbOk()) return;
    var out = [];
    try { var u = await window._sb.auth.getUser(); uid = u && u.data && u.data.user ? u.data.user.id : null; } catch (e) {}
    if (!uid) return;
    try {
      var q = await window._sb.from('mi_questions').select('id,body,answer,answered_at').eq('user_id', uid).not('answer', 'is', null).order('answered_at', { ascending: false }).limit(5);
      (q.data || []).forEach(function (x) { out.push({ ts: new Date(x.answered_at || Date.now()).getTime(), e: '💬', t: 'O Gediel respondeu sua dúvida', s: x.answer, w: '“' + String(x.body).slice(0, 60) + '”', a: 'duvida' }); });
    } catch (e) {}
    try {
      var d14 = new Date(Date.now() - 14 * 864e5).toISOString();
      var l = await window._sb.from('mi_lessons').select('id,title,module_id,release_at,published,youtube_url').eq('published', true).gte('release_at', d14).lte('release_at', new Date().toISOString()).order('release_at', { ascending: false }).limit(6);
      (l.data || []).forEach(function (x) { if (!x.youtube_url) return; out.push({ ts: new Date(x.release_at).getTime(), e: '🎬', t: 'Aula nova liberada', s: x.title, a: 'aula', mod: x.module_id, les: x.id }); });
    } catch (e) {}
    try {
      var A = window.MI_APP; if (A && A.proxLives) {
        var hoje0 = new Date(); hoje0.setHours(0, 0, 0, 0);
        A.proxLives().filter(function (x) { return x.aoVivo || (x.st - Date.now() < 36 * 36e5); }).slice(0, 2).forEach(function (x) { out.push({ ts: hoje0.getTime(), e: x.aoVivo ? '🔴' : '📺', t: (x.aoVivo ? 'AO VIVO agora: ' : 'Live: ') + (x.lv.title || x.lv.nome || x.lv.t || 'Live'), s: A.quando(x), a: 'live' }); });
      }
    } catch (e) {}
    try {
      var pl = window.EBG_PLANO && EBG_PLANO.hoje(); if (pl) { var h0 = new Date(); h0.setHours(0, 0, 0, 0); out.push({ ts: h0.getTime(), e: '🎯', t: 'Sessão de hoje do seu plano', s: pl.g.n + ' · sessão ' + pl.n + ' de ' + pl.de, a: 'plano' }); }
    } catch (e) {}
    try {
      var M = window.EBG_MENTORIA && EBG_MENTORIA.dados(), adm = window._isAdmin;
      if (M && !adm) (M.enc || []).filter(function (x) { return x.status === 'confirmado' && new Date(x.inicio) > new Date(); }).slice(0, 3).forEach(function (x) { out.push({ ts: new Date(x.created_at || x.inicio).getTime(), e: '🎓', t: 'Mentoria confirmada', s: new Date(x.inicio).toLocaleString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }), a: 'mentoria' }); });
    } catch (e) {}
    out.sort(function (a, b) { return b.ts - a.ts; }); itens = out;
    marcar();
  }
  function novos() { var seen = +(LS.g(chave()) || 0); return itens.filter(function (i) { return i.ts > seen; }); }
  function marcar() { var b = bell(); if (b) b.classList.toggle('tem-notif', novos().length > 0); }

  function pintar() {
    var seen = +(LS.g(chave()) || 0);
    pop.innerHTML = '<div class="h"><span>🔔 Avisos</span><button type="button" class="x" data-nt="fechar">✕ Fechar</button></div><div class="l">' +
      (itens.length ? itens.map(function (i, n) {
        return '<button type="button" class="i' + (i.ts > seen ? ' novo' : '') + '" data-nt="ir" data-n="' + n + '"><span class="e">' + i.e + '</span><span><div class="t">' + esc(i.t) + '</div>' + (i.s ? '<div class="s">' + esc(String(i.s).slice(0, 220)) + '</div>' : '') + '<div class="w">' + (i.w ? esc(i.w) + ' · ' : '') + esc(quando(i.ts)) + '</div></span></button>';
      }).join('') : '<div class="v">Tudo em dia por aqui ✨<br><span style="font-size:12.5px">Quando sair aula nova, o Gediel responder uma dúvida ou tiver live, avisamos aqui.</span></div>') + '</div>';
  }
  function abrir() { aberto = true; pintar(); pop.classList.add('on'); LS.s(chave(), String(Date.now())); var b = bell(); if (b) b.classList.remove('tem-notif'); }
  function fechar() { aberto = false; pop.classList.remove('on'); }

  document.addEventListener('click', function (e) {
    var b = bell(), t = e.target.closest && e.target.closest('[data-nt]');
    if (b && b.contains(e.target)) { e.preventDefault(); if (aberto) fechar(); else coletar().then(abrir, abrir); return; }
    if (t) {
      if (t.dataset.nt === 'fechar') return fechar();
      var i = itens[+t.dataset.n]; fechar(); if (!i) return;
      if (i.a === 'aula' && window.MI_APP) MI_APP.abrirAula(i.mod, i.les);
      else if (i.a === 'live' && window.goTo) goTo('lives', null);
      else if (i.a === 'mentoria' && window.goTo) goTo('mentoria', null);
      else if (i.a === 'plano' && window.goTo) goTo('plano', null);
      return;
    }
    if (aberto && !pop.contains(e.target)) fechar();
  }, true);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && aberto) fechar(); });

  setTimeout(coletar, 4500); setInterval(coletar, 180000);
  window.EBG_NOTIF = { recarregar: coletar };
})();
