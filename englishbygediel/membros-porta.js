/* Porta de entrada de quem assina o English on Mission (Kiwify): depois do login, só dois botões grandes.
   · ÁREA DE MEMBROS  → segue o fluxo normal (tutorial, cadastro, EOM)
   · LINEAR BIBLE     → abre direto o app "Bíblia Bilíngue EOM"
   Dá pra voltar: botão "← Início" no topo da área de membros reabre a porta; no app da Bíblia, o voltar do navegador cai aqui.
   Admin testa com ?modo=eom (ou ?porta=1). O link do app pode ser trocado em cfg.linkBiblia (tabela acesso). */
(function () {
  var BIBLIA = 'https://claude.ai/artifact/GfuWjsev8fY2PWcj8MXMAk';
  var KEY = 'mi_porta_ok';
  var ss = function (k, v) { try { if (v === undefined) return sessionStorage.getItem(k); if (v === null) sessionStorage.removeItem(k); else sessionStorage.setItem(k, v); } catch (e) {} return null; };
  var S = function () { return (window.EBG_ACESSO || {}).estado || {}; };
  var forca = new URLSearchParams(location.search).get('porta');
  if (forca) ss('mi_porta_forca', '1');

  var css = document.createElement('style');
  css.textContent =
    '#mi-porta{position:fixed;inset:0;z-index:9700;display:none;align-items:center;justify-content:center;padding:max(20px,env(safe-area-inset-top,0px)) max(16px,env(safe-area-inset-right,0px)) max(20px,env(safe-area-inset-bottom,0px)) max(16px,env(safe-area-inset-left,0px));background:radial-gradient(ellipse at 50% 0%,#1d5a41 0%,#0f2c21 55%,#07140e 100%);color:#fbf5e4;overflow:auto}' +
    '#mi-porta.on{display:flex}' +
    '#mi-porta .pt-box{width:100%;max-width:1040px;margin:auto}' +
    '#mi-porta .pt-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}' +
    '#mi-porta .pt-btn{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;min-height:min(62vh,440px);border:0;border-radius:32px;padding:28px 20px;color:#fbf5e4;font:inherit;cursor:pointer;text-align:center;background:linear-gradient(180deg,#1b4d38,#123626);box-shadow:0 18px 44px rgba(0,0,0,.45),inset 0 0 0 1.5px rgba(212,178,92,.55);transition:transform .2s,box-shadow .2s}' +
    '#mi-porta .pt-btn:hover{transform:translateY(-4px) scale(1.015);box-shadow:0 26px 56px rgba(0,0,0,.55),inset 0 0 0 2px #d4b25c}' +
    '#mi-porta .pt-btn:focus-visible{outline:3px solid #d4b25c;outline-offset:3px}' +
    
    '#mi-porta .pt-ic{width:clamp(96px,16vw,150px);height:clamp(96px,16vw,150px);display:block}' +
    '#mi-porta .pt-ic img,#mi-porta .pt-ic svg{width:100%;height:100%;object-fit:contain;display:block;filter:drop-shadow(0 10px 18px rgba(0,0,0,.35))}' +
    '#mi-porta .pt-t{font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(34px,5.6vw,56px);font-weight:700;letter-spacing:.04em;line-height:1.05;text-transform:uppercase;color:#f3e2a8;text-wrap:balance;min-height:2.1em;display:flex;align-items:center;justify-content:center}' +
    '@media(max-width:720px){#mi-porta .pt-grid{grid-template-columns:1fr;gap:14px}#mi-porta .pt-btn{min-height:0;flex-direction:row;justify-content:flex-start;gap:18px;padding:26px 22px;border-radius:26px;text-align:left}#mi-porta .pt-ic{width:84px;height:84px;flex:none}#mi-porta .pt-t{font-size:32px;min-height:0;justify-content:flex-start}}' +
    '#mi-porta-volta{display:none;align-items:center;gap:6px;border:1px solid var(--border);background:var(--surface2);color:var(--fg);border-radius:10px;padding:7px 12px;font:inherit;font-size:13px;font-weight:700;cursor:pointer;flex:none}body.modo-eom #mi-porta-volta{display:inline-flex}#mi-porta-volta:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,.18)}';
  document.head.appendChild(css);

  var BOOK = '<svg viewBox="0 0 120 120" aria-hidden="true"><path d="M60 34c-9-6-22-8-38-6v62c16-2 29 0 38 6 9-6 22-8 38-6V28c-16-2-29 0-38 6z" fill="none" stroke="#d4b25c" stroke-width="4" stroke-linejoin="round"/><path d="M60 34v62" stroke="#d4b25c" stroke-width="4"/><path d="M32 46c7-1 14 0 21 3M32 58c7-1 14 0 21 3M32 70c7-1 14 0 21 3M88 46c-7-1-14 0-21 3M88 58c-7-1-14 0-21 3M88 70c-7-1-14 0-21 3" stroke="#f3e2a8" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M60 6v20M50 14h20" stroke="#f3e2a8" stroke-width="5" stroke-linecap="round"/></svg>';
  var AREA = '<svg viewBox="0 0 120 120" aria-hidden="true"><g transform="translate(0,-11)"><rect x="22" y="78" width="76" height="20" rx="4" fill="none" stroke="#d4b25c" stroke-width="4"/><rect x="28" y="52" width="70" height="20" rx="4" fill="none" stroke="#d4b25c" stroke-width="4" transform="rotate(-4 63 62)"/><rect x="24" y="26" width="72" height="20" rx="4" fill="none" stroke="#f3e2a8" stroke-width="4" transform="rotate(3 60 36)"/><path d="M40 88h40M44 62h38M42 36h38" stroke="#f3e2a8" stroke-width="3" stroke-linecap="round"/></g></svg>';

  var ov = document.createElement('div');
  ov.id = 'mi-porta';
  ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-label', 'Escolha onde entrar');
  ov.innerHTML = '<div class="pt-box"><div class="pt-grid">' +
    '<button class="pt-btn" id="pt-area"><span class="pt-ic">' + AREA + '</span><span class="pt-t">Área de membros</span></button>' +
    '<button class="pt-btn" id="pt-bib"><span class="pt-ic">' + BOOK + '</span><span class="pt-t">Linear Bible</span></button>' +
    '</div></div>';
  document.body.appendChild(ov);

  function fechar() { ov.classList.remove('on'); }
  function abrir() { ov.classList.add('on'); }
  document.getElementById('pt-area').onclick = function () { ss(KEY, '1'); fechar(); };
  document.getElementById('pt-bib').onclick = function () {
    ss(KEY, null);                                   // ao voltar do app da Bíblia, a porta aparece de novo
    var u = (S().cfg || {}).linkBiblia || BIBLIA;
    location.href = u;
  };
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && ov.classList.contains('on') && ss(KEY)) fechar(); });

  // botão "← Início" no topo da área de membros (só no modo EOM)
  function botaoVolta() {
    if (document.getElementById('mi-porta-volta')) return;
    var tb = document.querySelector('.topbar'), t = document.getElementById('topbar-title');
    if (!tb || !t) return;
    var b = document.createElement('button');
    b.id = 'mi-porta-volta'; b.type = 'button'; b.innerHTML = '← Início';
    b.onclick = function () { ss(KEY, null); abrir(); };
    tb.insertBefore(b, t);
  }

  function ehEom() { try { return window.EBG_MODO && EBG_MODO.modo() === 'eom'; } catch (e) { return false; } }
  var decidido = false;
  setInterval(function () {
    botaoVolta();
    if (decidido) return;
    var s = S();
    if (!s.pronto) return;
    decidido = true;
    if ((ehEom() || ss('mi_porta_forca')) && !ss(KEY)) abrir();
  }, 400);


  // botão grande da Bíblia dentro do menu lateral (quem não é do modo EOM). Sem acesso → leva pra assinatura do EOM.
  var CHECK_EOM = 'https://pay.kiwify.com.br/oIjfTK8';
  css.textContent += '.mi-bib{margin:0 0 14px;position:relative;display:flex;align-items:center;gap:18px;width:100%;min-height:96px;padding:14px 16px;border:0;border-radius:20px;cursor:pointer;font:inherit;text-align:left;color:#fbf5e4;background:linear-gradient(180deg,#1b4d38,#123626);box-shadow:0 10px 26px rgba(0,0,0,.28),inset 0 0 0 1.5px rgba(212,178,92,.55);transition:transform .2s,box-shadow .2s}' +
    '.mi-bib:hover{transform:translateY(-2px) scale(1.015);box-shadow:0 16px 34px rgba(0,0,0,.34),inset 0 0 0 2px #d4b25c}' +
    '.mi-bib .bi{width:60px;height:60px;flex:none}.mi-bib .bi svg{width:100%;height:100%;display:block}' +
    '.mi-bib .bt{font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(26px,3.4vw,34px);font-weight:700;letter-spacing:.04em;line-height:1.05;text-transform:uppercase;color:#f3e2a8;padding-right:26px}' +
    '.mi-bib .bl{position:absolute;top:50%;right:12px;transform:translateY(-50%);font-size:14px;opacity:.9}';
  function temBiblia() {
    var s = S();
    if (!s.ok || s.admin || window._isAdmin || s.programa || s.tudo) return true;
    return (s.compras || []).some(function (c) { return /english on mission|mission|eom/i.test(c.produto || ''); });
  }
  function botaoMenu() {
    var pane = document.getElementById('pane-eom');
    if (!pane) return;
    var b = document.getElementById('mi-bib');
    if (!b) {
    var b = document.createElement('button');
    b.id = 'mi-bib'; b.type = 'button'; b.className = 'mi-bib';
    b.innerHTML = '<span class="bi">' + BOOK + '</span><span class="bt">Linear Bible</span><span class="bl"></span>';
    b.onclick = function () {
      var s = S();
      if (temBiblia()) { ss(KEY, null); location.href = (s.cfg || {}).linkBiblia || BIBLIA; }
      else window.open((s.cfg || {}).checkoutEom || CHECK_EOM, '_blank', 'noopener');
    };
    }
    var hero = pane.querySelector('.th-hero');
    if (hero) { if (hero.nextElementSibling !== b) hero.insertAdjacentElement('afterend', b); }
    else if (pane.firstElementChild !== b) pane.insertBefore(b, pane.firstChild);
  }
  setInterval(function () {
    botaoMenu();
    var b = document.getElementById('mi-bib'); if (!b) return;
    var l = b.querySelector('.bl'); if (l) l.textContent = temBiblia() ? '' : '🔒';
  }, 600);

  window.EBG_PORTA = { abrir: abrir, fechar: fechar };
})();
