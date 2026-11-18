/* Central de Prompts dentro da área de membros: resumida, com explicação e cópia em 1 toque. */
(function () {
  'use strict';
  var D = window.EBG_PROMPTS || { cats: [], lista: [] };
  var ST = { cat: 'rapido', aberto: null, nivel: null, pers: true };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var CSS = '.pp{max-width:1000px}.pp-h{font-size:22px;font-weight:800;letter-spacing:-.3px}.pp-s{font-size:13.5px;color:var(--fg2);margin:4px 0 16px;line-height:1.5}'
    + '.pp-como{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;margin:6px 0 14px;counter-reset:pp}'
    + '.pp-pas{--c:#4f6ef7;position:relative;border-radius:22px;padding:18px 16px 16px;display:flex;flex-direction:column;gap:6px;color:var(--fg);background:linear-gradient(160deg,color-mix(in srgb,var(--c) 22%,var(--surface)),color-mix(in srgb,var(--c) 7%,var(--surface)));border:2px solid color-mix(in srgb,var(--c) 55%,transparent);box-shadow:0 10px 26px -14px var(--c)}'
    + '.pp-pas.p2{--c:#10b981}.pp-pas.p3{--c:#f59e0b}'
    + '.pp-pas:not(:last-child):after{content:"➜";position:absolute;right:-17px;top:50%;transform:translateY(-50%);z-index:2;width:26px;height:26px;border-radius:50%;background:var(--c);color:#fff;display:grid;place-items:center;font-size:13px;box-shadow:0 4px 10px rgba(0,0,0,.25)}'
    + '.pp-top{display:flex;align-items:center;gap:10px}.pp-n{flex:none;width:36px;height:36px;border-radius:12px;background:var(--c);color:#fff;font-weight:900;display:grid;place-items:center;font-size:18px;box-shadow:0 6px 14px -4px var(--c)}.pp-e{font-size:30px;line-height:1;margin-left:auto}'
    + '.pp-pas b{display:block;font-size:16px;font-weight:800;color:var(--c);filter:brightness(.85)}.pp-pas span.tx{font-size:13.5px;color:var(--fg);line-height:1.5}.pp-pas small{font-size:12px;color:var(--fg2);line-height:1.4}'
    + '.pp-pas .pp-ias{margin:6px 0 0}'
    + '@media(max-width:720px){.pp-como{grid-template-columns:1fr;gap:22px}.pp-pas:not(:last-child):after{right:auto;left:50%;top:auto;bottom:-20px;transform:translateX(-50%) rotate(90deg)}}'
    + '.pp-ias{display:flex;gap:10px;flex-wrap:wrap;margin:0 0 16px}.pp-ias a{display:inline-flex;align-items:center;min-height:42px;padding:0 14px;border-radius:12px;background:#f59e0b;color:#1a1200;font-weight:800;font-size:13px;text-decoration:none;box-shadow:0 6px 14px -6px #f59e0b}.pp-ias a+a{background:transparent;color:var(--fg);border:1.5px solid #f59e0b;box-shadow:none}.pp-ias a:hover{filter:brightness(1.08)}'
    + '.pp-pers{display:flex;align-items:center;gap:10px;font-size:13px;color:var(--fg2);margin:0 0 14px;cursor:pointer}.pp-pers input{width:18px;height:18px;accent-color:var(--accent)}'
    + '.pp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:14px}'
    + '.pp-c{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:18px;display:flex;flex-direction:column;gap:10px;box-shadow:var(--shadow)}.pp-c.on{grid-column:1/-1;border-color:var(--accent)}'
    + '.pp-c h3{font-size:16.5px;line-height:1.25;margin:0;font-weight:800}.pp-c p{margin:0;font-size:13.5px;color:var(--fg2);line-height:1.5}'
    + '.pp-m{display:flex;gap:6px;flex-wrap:wrap}.pp-m span{font-size:11.5px;font-weight:800;padding:4px 10px;border-radius:99px;background:color-mix(in srgb,var(--accent) 12%,transparent);color:var(--accent)}'
    + '.pp-b{display:flex;gap:8px;margin-top:auto;padding-top:4px}.pp-b button{flex:1;min-height:46px;border-radius:14px;border:1.5px solid var(--border);background:var(--surface);color:var(--fg);font:inherit;font-weight:800;font-size:13.5px;cursor:pointer}'
    + '.pp-b button.go{background:linear-gradient(135deg,var(--accent),#8b5cf6);color:#fff;border-color:transparent}'
    + '.pp-txt{white-space:pre-wrap;font-size:13px;line-height:1.55;background:var(--bg2,rgba(127,127,127,.08));border-radius:14px;padding:14px;color:var(--fg);max-height:260px;overflow:auto}'
    + '.pp-res{font-size:13px;color:var(--fg2)}.pp-res b{color:var(--fg)}';
  function prompt(p) {
    var pre = ST.pers && ST.nivel ? 'Meu nível de inglês é ' + ST.nivel + '. Ajuste a dificuldade a esse nível e, se eu travar, explique em português.\n\n' : '';
    return pre + p.prompt;
  }
  function copiar(txt) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(txt);
    return new Promise(function (ok, no) { try { var t = document.createElement('textarea'); t.value = txt; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); ok(); } catch (e) { no(e); } });
  }
  function card(p) {
    var on = ST.aberto === p.id;
    return '<div class="pp-c' + (on ? ' on' : '') + '" data-id="' + p.id + '"><div class="pp-m"><span>⏱ ' + p.minutes + ' min</span><span>' + esc(p.kind) + '</span></div>'
      + '<h3>' + esc(p.title) + '</h3><p>' + esc(p.subtitle) + '</p>'
      + (on ? '<div class="pp-txt">' + esc(prompt(p)) + '</div><div class="pp-res"><b>Você termina com:</b> ' + esc(p.result) + '</div>' : '')
      + '<div class="pp-b"><button data-pp="ver">' + (on ? 'Fechar' : '👀 Ver') + '</button><button class="go" data-pp="copiar">📋 Copiar</button></div></div>';
  }
  function render(el, nivel) {
    if (!el) return;
    ST.nivel = nivel || ST.nivel;
    var lista = D.lista.filter(function (p) { return p.cat === ST.cat; });
    el.innerHTML = '<style>' + CSS + '</style><div class="pp">'
      + '<div class="pp-h">Prompts</div><div class="pp-s">Um prompt é uma instrução pronta que você cola no ChatGPT ou no Claude. Ele vira seu professor particular e você responde às perguntas dele, em inglês.</div>'
      + '<div class="pp-como">'
      + '<div class="pp-pas p1"><div class="pp-top"><div class="pp-n">1</div><div class="pp-e">⏱️</div></div><b>Escolha pelo tempo</b><span class="tx">Veja as abas logo abaixo e pegue um prompt do seu tamanho.</span><small>Só tem 5 minutos? Use a aba "5 min".</small></div>'
      + '<div class="pp-pas p2"><div class="pp-top"><div class="pp-n">2</div><div class="pp-e">📋</div></div><b>Copie o prompt</b><span class="tx">Toque em <u>Copiar</u> no card que você escolheu.</span><small>O texto vai direto pro seu celular ou computador.</small></div>'
      + '<div class="pp-pas p3"><div class="pp-top"><div class="pp-n">3</div><div class="pp-e">💬</div></div><b>Cole e responda</b><span class="tx">Abra a IA, cole e responda às perguntas dela, em inglês.</span><small>Vale falar, no modo de voz.</small>'
      + '<div class="pp-ias"><a href="https://chatgpt.com/" target="_blank" rel="noopener">Abrir o ChatGPT ↗</a><a href="https://claude.ai/" target="_blank" rel="noopener">Abrir o Claude ↗</a></div></div></div>'
      + (ST.nivel ? '<label class="pp-pers"><input type="checkbox" data-pp="pers"' + (ST.pers ? ' checked' : '') + '> Avisar meu nível (' + esc(ST.nivel) + ') no prompt, pra ele ajustar a dificuldade</label>' : '')
      + '<div class="mi-dock" id="pp-abas">' + D.cats.map(function (c) { return '<button data-cat="' + c.id + '"' + (c.id === ST.cat ? ' class="on"' : '') + '>' + esc(c.short) + '</button>'; }).join('') + '</div>'
      + '<div class="pp-grid">' + lista.map(card).join('') + '</div></div>';
  }
  document.addEventListener('click', function (e) {
    var pane = document.getElementById('pane-prompts'); if (!pane || !pane.contains(e.target)) return;
    var cat = e.target.closest('[data-cat]'), b = e.target.closest('[data-pp]');
    if (cat) { ST.cat = cat.dataset.cat; ST.aberto = null; render(pane); return; }
    if (!b) return;
    var c = b.closest('.pp-c'), id = c && c.dataset.id, p = D.lista.filter(function (x) { return x.id === id; })[0];
    if (b.dataset.pp === 'ver') { ST.aberto = ST.aberto === id ? null : id; render(pane); }
    if (b.dataset.pp === 'copiar' && p) copiar(prompt(p)).then(function () { if (window.toast) toast('✅ Copiado! Agora cole no ChatGPT', '#10b981'); }, function () { if (window.toast) toast('Não deu pra copiar. Toque em Ver e copie o texto.'); });
  });
  document.addEventListener('change', function (e) { var b = e.target.closest && e.target.closest('[data-pp="pers"]'); if (!b) return; ST.pers = b.checked; render(document.getElementById('pane-prompts')); });
  window.EBG_PROMPTS_UI = { render: render, abrir: function (cat) { if (cat) ST.cat = cat; } };
})();
