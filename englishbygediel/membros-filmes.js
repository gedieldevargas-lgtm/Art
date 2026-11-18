/* Filmes por nível: 15 por nível, status (assisti / quero assistir / não vi), nota e comentário. Salvo no aparelho. */
(function () {
  'use strict';
  var F = window.EBG_FILMES || [], NIV = ['A1', 'A2', 'B1', 'B2', 'C1'];
  var KEY = 'mi_filmes', KIMG = 'mi_fl_img';
  var ST = { n: 'A1', aberto: null, f: 'todos' };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var ld = function (k, d) { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } };
  var sv = function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  var DB = ld(KEY, {}), IMG = ld(KIMG, {});
  var CSS = '.fl{max-width:1100px}.fl-h{font-size:22px;font-weight:800}.fl-s{font-size:13.5px;color:var(--fg2);margin:4px 0 16px;line-height:1.5}'
    + '.fl-prog{display:flex;align-items:center;gap:12px;margin:0 0 14px;font-size:13px;color:var(--fg2)}.fl-bar{flex:1;height:10px;border-radius:99px;background:rgba(127,127,127,.2);overflow:hidden}.fl-bar i{display:block;height:100%;background:linear-gradient(90deg,#22c55e,#16a34a);border-radius:99px}'
    + '.fl-fil{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 16px}.fl-fil button{min-height:40px;padding:0 16px;border-radius:99px;border:1.5px solid var(--border);background:var(--surface);color:var(--fg2);font:inherit;font-weight:800;font-size:13px;cursor:pointer}.fl-fil button.on{background:var(--accent);border-color:var(--accent);color:#fff}'
    + '.fl-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(172px,1fr));gap:18px 14px}'
    + '.fl-c{background:var(--surface);border:1px solid var(--border);border-radius:16px;overflow:hidden;display:flex;flex-direction:column;box-shadow:var(--shadow)}'
    + '.fl-p{position:relative;aspect-ratio:2/3;background:#1b2440;overflow:hidden}.fl-p img{width:100%;height:100%;object-fit:cover;display:block}'
    + '.fl-ph{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;padding:14px;font:800 17px/1.15 Georgia,serif;color:#fff}'
    + '.fl-tag{position:absolute;left:8px;top:8px;font-size:11px;font-weight:800;padding:4px 9px;border-radius:8px;background:rgba(10,14,30,.78);color:#fff}.fl-tag.visto{background:#16a34a}.fl-tag.quero{background:#f59e0b;color:#1b1203}'
    + '.fl-b{padding:11px 12px 12px;display:flex;flex-direction:column;gap:7px;flex:1}.fl-t{font-weight:800;font-size:14px;line-height:1.25}.fl-m{font-size:12px;color:var(--fg2);line-height:1.35}'
    + '.fl-st{display:grid;grid-template-columns:1fr;gap:5px}.fl-st button{min-height:36px;border-radius:10px;border:1.5px solid var(--border);background:var(--surface);color:var(--fg);font:inherit;font-weight:800;font-size:12px;cursor:pointer;text-align:left;padding:0 10px}'
    + '.fl-st button.on{border-color:var(--accent);background:color-mix(in srgb,var(--accent) 12%,transparent);color:var(--accent)}'
    + '.fl-star{display:flex;gap:2px}.fl-star button{border:none;background:none;font-size:22px;line-height:1;padding:2px;cursor:pointer;color:var(--border)}.fl-star button.on{color:#f59e0b}'
    + '.fl-cm{width:100%;box-sizing:border-box;min-height:70px;border:1.5px solid var(--border);border-radius:10px;background:var(--surface);color:var(--fg);font:inherit;font-size:14px;padding:9px;resize:vertical}'
    + '.fl-cb{border:none;background:none;color:var(--accent);font:inherit;font-weight:800;font-size:12.5px;text-align:left;cursor:pointer;padding:2px 0}';
  function cap(f) {
    var h = 0; for (var i = 0; i < f.t.length; i++) h = (h * 31 + f.t.charCodeAt(i)) % 360;
    var ph = '<div class="fl-ph" style="background:linear-gradient(160deg,hsl(' + h + ',55%,32%),hsl(' + ((h + 50) % 360) + ',60%,18%))">' + esc(f.t) + '</div>';
    var u = IMG[f.id];
    if (u === undefined || u) return ph + '<img alt="" loading="lazy" data-fid="' + f.id + '" src="' + esc(u || 'img/filmes/' + f.id + '.jpg') + '">';
    return ph;
  }
  async function wiki(f) {
    var nomes = [f.t + ' (' + f.y + ' film)', f.t + ' (film)', f.t];
    for (var i = 0; i < nomes.length; i++) {
      try {
        var r = await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(nomes[i].replace(/ /g, '_')));
        if (!r.ok) continue; var j = await r.json();
        if (j.thumbnail && j.thumbnail.source && !/disambiguation/i.test(j.type || '')) return j.thumbnail.source.replace(/\/\d+px-/, '/360px-');
      } catch (e) {}
    }
    return '';
  }
  document.addEventListener('error', async function (e) {
    var im = e.target; if (!im || im.tagName !== 'IMG' || !im.dataset || !im.dataset.fid) return;
    var f = F.filter(function (x) { return x.id === im.dataset.fid; })[0]; if (!f) return;
    if (im.dataset.tent) { IMG[f.id] = ''; sv(KIMG, IMG); im.remove(); return; }
    im.dataset.tent = '1';
    var u = await wiki(f);
    if (u) { IMG[f.id] = u; sv(KIMG, IMG); im.src = u; } else { IMG[f.id] = ''; sv(KIMG, IMG); im.remove(); }
  }, true);
  function est(id) { return DB[id] || {}; }
  function card(f) {
    var e = est(f.id), s = e.s || 'nao', on = ST.aberto === f.id;
    return '<div class="fl-c" data-id="' + f.id + '"><div class="fl-p">' + cap(f) + (s !== 'nao' ? '<span class="fl-tag ' + s + '">' + (s === 'visto' ? '✓ Assisti' : '★ Quero assistir') + '</span>' : '') + '</div>'
      + '<div class="fl-b"><div class="fl-t">' + esc(f.t) + '</div><div class="fl-m">' + f.y + ' · ' + esc(f.g) + '<br>' + esc(f.d) + '</div>'
      + '<div class="fl-st"><button data-fl="s:quero" class="' + (s === 'quero' ? 'on' : '') + '">★ Quero assistir</button><button data-fl="s:visto" class="' + (s === 'visto' ? 'on' : '') + '">✓ Assisti</button><button data-fl="s:nao" class="' + (s === 'nao' ? 'on' : '') + '">○ Não vi ainda</button></div>'
      + '<div class="fl-star" aria-label="Nota">' + [1, 2, 3, 4, 5].map(function (n) { return '<button data-fl="r:' + n + '" class="' + ((e.r || 0) >= n ? 'on' : '') + '" aria-label="' + n + ' estrelas">★</button>'; }).join('') + '</div>'
      + '<button class="fl-cb" data-fl="c">' + (on ? 'Fechar comentário' : (e.c ? '💬 Ver meu comentário' : '💬 Comentar')) + '</button>'
      + (on ? '<textarea class="fl-cm" data-cm placeholder="O que você achou? Se der, escreva em inglês: I loved this movie because…">' + esc(e.c || '') + '</textarea>' : '') + '</div></div>';
  }
  function render(el, nivel) {
    if (!el) return;
    if (nivel && !el.dataset.ini) { ST.n = NIV.indexOf(nivel) >= 0 ? nivel : (nivel === 'C2' ? 'C1' : 'A1'); el.dataset.ini = '1'; }
    var lista = F.filter(function (f) { return f.n === ST.n; }), vistos = lista.filter(function (f) { return est(f.id).s === 'visto'; }).length;
    var vis = lista.filter(function (f) { var s = est(f.id).s || 'nao'; return ST.f === 'todos' || s === ST.f; });
    var fil = [['todos', 'Todos'], ['quero', 'Quero assistir'], ['visto', 'Assisti'], ['nao', 'Não vi ainda']];
    el.innerHTML = '<style>' + CSS + '</style><div class="fl"><div class="fl-h">Filmes por nível</div><div class="fl-s">15 filmes pra cada nível, do mais fácil de entender ao mais desafiador. Marque o que viu, dê sua nota e escreva o que achou. Dica: assista com legenda em inglês.</div>'
      + '<div class="mi-dock" id="fl-abas">' + NIV.map(function (n) { return '<button data-nv="' + n + '"' + (n === ST.n ? ' class="on"' : '') + '>' + n + '</button>'; }).join('') + '</div>'
      + '<div class="fl-prog"><b>' + vistos + ' de ' + lista.length + ' assistidos</b><div class="fl-bar"><i style="width:' + Math.round(vistos / lista.length * 100) + '%"></i></div></div>'
      + '<div class="fl-fil">' + fil.map(function (x) { return '<button data-ff="' + x[0] + '"' + (x[0] === ST.f ? ' class="on"' : '') + '>' + x[1] + '</button>'; }).join('') + '</div>'
      + '<div class="fl-grid">' + (vis.map(card).join('') || '<div class="fl-s">Nenhum filme nessa lista ainda.</div>') + '</div></div>';
  }
  document.addEventListener('click', function (e) {
    var pane = document.getElementById('pane-filmes'); if (!pane || !pane.contains(e.target)) return;
    var nv = e.target.closest('[data-nv]'), ff = e.target.closest('[data-ff]'), b = e.target.closest('[data-fl]');
    if (nv) { ST.n = nv.dataset.nv; ST.aberto = null; render(pane); return; }
    if (ff) { ST.f = ff.dataset.ff; render(pane); return; }
    if (!b) return;
    var id = b.closest('.fl-c').dataset.id, k = b.dataset.fl.split(':'), x = DB[id] = DB[id] || {};
    if (k[0] === 's') x.s = k[1];
    else if (k[0] === 'r') x.r = x.r === +k[1] ? 0 : +k[1];
    else if (k[0] === 'c') { ST.aberto = ST.aberto === id ? null : id; }
    sv(KEY, DB); render(pane);
  });
  document.addEventListener('input', function (e) {
    var t = e.target; if (!t.matches || !t.matches('.fl-cm')) return;
    var id = t.closest('.fl-c').dataset.id; (DB[id] = DB[id] || {}).c = t.value; sv(KEY, DB);
  });
  window.EBG_FILMES_UI = { render: render };
})();
