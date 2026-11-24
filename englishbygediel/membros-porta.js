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
    '#mi-porta{position:fixed;inset:0;z-index:9700;display:none;align-items:center;justify-content:center;padding:max(20px,env(safe-area-inset-top,0px)) max(16px,env(safe-area-inset-right,0px)) max(20px,env(safe-area-inset-bottom,0px)) max(16px,env(safe-area-inset-left,0px));background:radial-gradient(ellipse at 20% 0%,#2d3a8c 0%,#161a3d 48%,#090b18 100%);color:#fff;overflow:auto}' +
    '#mi-porta.on{display:flex}' +
    '#mi-porta .pt-box{width:100%;max-width:1040px;margin:auto}' +
    '#mi-porta .pt-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}' +
    '#mi-porta .pt-btn{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;min-height:min(62vh,440px);border:0;border-radius:32px;padding:28px 20px;color:#fff;font:inherit;cursor:pointer;text-align:center;box-shadow:0 18px 44px rgba(0,0,0,.4),inset 0 0 0 1.5px rgba(255,255,255,.16);transition:transform .2s,box-shadow .2s}' +
    '#mi-porta .pt-btn:hover{transform:translateY(-4px) scale(1.015);box-shadow:0 26px 56px rgba(0,0,0,.5),inset 0 0 0 1.5px rgba(255,255,255,.28)}' +
    '#mi-porta .pt-btn:focus-visible{outline:3px solid #fff;outline-offset:3px}' +
    '#mi-porta .pt-a{background:linear-gradient(150deg,#4f6ef7 0%,#7c4fe0 100%)}' +
    '#mi-porta .pt-b{background:linear-gradient(150deg,#b8791d 0%,#7a3f12 100%)}' +
    '#mi-porta .pt-ic{width:clamp(96px,16vw,150px);height:clamp(96px,16vw,150px);display:block}' +
    '#mi-porta .pt-ic img,#mi-porta .pt-ic svg{width:100%;height:100%;object-fit:contain;display:block;filter:drop-shadow(0 10px 18px rgba(0,0,0,.35))}' +
    '#mi-porta .pt-t{font-size:clamp(26px,4.6vw,40px);font-weight:800;letter-spacing:.5px;line-height:1.1;text-transform:uppercase;text-wrap:balance}' +
    '@media(max-width:720px){#mi-porta .pt-grid{grid-template-columns:1fr;gap:14px}#mi-porta .pt-btn{min-height:0;flex-direction:row;justify-content:flex-start;gap:18px;padding:26px 22px;border-radius:26px;text-align:left}#mi-porta .pt-ic{width:84px;height:84px;flex:none}#mi-porta .pt-t{font-size:24px}}' +
    '#mi-porta-volta{display:none;align-items:center;gap:6px;border:1px solid var(--border);background:var(--surface2);color:var(--fg);border-radius:10px;padding:7px 12px;font:inherit;font-size:13px;font-weight:700;cursor:pointer;flex:none}body.modo-eom #mi-porta-volta{display:inline-flex}#mi-porta-volta:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,.18)}';
  document.head.appendChild(css);

  var BOOK = '<svg viewBox="0 0 120 120" aria-hidden="true"><path d="M60 30c-9-6-22-8-38-6v64c16-2 29 0 38 6 9-6 22-8 38-6V24c-16-2-29 0-38 6z" fill="#fff8e6"/><path d="M60 30v64" stroke="#b8791d" stroke-width="3"/><path d="M30 38c8-1 17 0 24 3M30 50c8-1 17 0 24 3M30 62c8-1 17 0 24 3M90 38c-8-1-17 0-24 3M90 50c-8-1-17 0-24 3M90 62c-8-1-17 0-24 3" stroke="#d9b47a" stroke-width="2.6" stroke-linecap="round" fill="none"/><path d="M60 8v18M51 15h18" stroke="#fff" stroke-width="5" stroke-linecap="round"/></svg>';

  var ov = document.createElement('div');
  ov.id = 'mi-porta';
  ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-label', 'Escolha onde entrar');
  ov.innerHTML = '<div class="pt-box"><div class="pt-grid">' +
    '<button class="pt-btn pt-a" id="pt-area"><span class="pt-ic"><img src="img/icons/modulos.webp" alt="" draggable="false"></span><span class="pt-t">Área de membros</span></button>' +
    '<button class="pt-btn pt-b" id="pt-bib"><span class="pt-ic">' + BOOK + '</span><span class="pt-t">Linear Bible</span></button>' +
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

  window.EBG_PORTA = { abrir: abrir, fechar: fechar };
})();
