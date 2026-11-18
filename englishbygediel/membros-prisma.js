/* Prisma de Talentos · perfil completo das inteligências (área de membros).
   Usa EBG_PERFIS (prisma-perfis.js). É chamado por membros-app.js depois de desenhar o Prisma. */
(function () {
  var P = window.EBG_PERFIS; if (!P) return;
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var ico = function (k) { return '<img class="ic3d" src="img/icons/i-' + k + '.svg" alt="" draggable="false">'; };
  var norm = function (k) { return P.alias[k] || k; };
  var css = document.createElement('style');
  css.textContent = ''
    + '.pf{margin:6px 0 18px}.pf-h{font-size:17px;font-weight:800;margin:0 0 4px}.pf-s{font-size:13px;color:var(--fg2);margin:0 0 12px;line-height:1.5}'
    + '.pf-tabs{display:flex;gap:6px;overflow-x:auto;padding:6px;margin-bottom:14px;background:var(--surface);border:1px solid var(--border);border-radius:20px;box-shadow:var(--shadow)}'
    + '.pf-tabs button{--c:#8b5cf6;flex:none;display:flex;align-items:center;gap:7px;border:0;background:transparent;color:var(--fg2);font:inherit;font-size:13px;font-weight:800;padding:9px 13px;border-radius:14px;cursor:pointer;white-space:nowrap}'
    + '.pf-tabs button .ic3d{width:24px;height:24px}.pf-tabs button small{font-size:11px;font-weight:800;opacity:.9;background:color-mix(in srgb,var(--c) 18%,transparent);color:var(--c);padding:2px 7px;border-radius:99px}'
    + '.pf-tabs button.on{background:var(--c);color:#fff;box-shadow:0 8px 18px -8px var(--c)}.pf-tabs button.on small{background:rgba(255,255,255,.25);color:#fff}'
    + '.pf-hero{--c:#8b5cf6;display:flex;align-items:center;gap:14px;padding:16px;border-radius:22px;background:linear-gradient(135deg,color-mix(in srgb,var(--c) 24%,var(--surface)),color-mix(in srgb,var(--c) 6%,var(--surface)));border:1.5px solid color-mix(in srgb,var(--c) 50%,transparent);margin-bottom:12px}'
    + '.pf-hero .ic3d{width:64px;height:64px;flex:none}.pf-hero b{display:block;font-size:20px}.pf-hero span{font-size:13.5px;color:var(--fg2);line-height:1.5}.pf-hero .pc{margin-left:auto;font-size:30px;font-weight:900;color:var(--c);flex:none}'
    + '.pf-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px}'
    + '.pf-b{--c:#8b5cf6;background:var(--surface);border:1px solid var(--border);border-top:4px solid var(--c);border-radius:18px;padding:14px 16px;box-shadow:var(--shadow)}.pf-b.wide{grid-column:1/-1}'
    + '.pf-b h4{font-size:13px;letter-spacing:.04em;text-transform:uppercase;font-weight:800;color:var(--c);margin:0 0 8px;filter:brightness(.9)}'
    + '.pf-b ul{margin:0;padding-left:18px;font-size:13.5px;line-height:1.65;color:var(--fg)}.pf-b p{margin:0;font-size:13.5px;line-height:1.6;color:var(--fg)}.pf-b p+p{margin-top:6px}.pf-b em{font-style:normal;font-weight:800;color:var(--c)}'
    + '.pf-b.ok{--c:#16a34a}.pf-b.no{--c:#e11d48}.pf-b.tr{--c:#f59e0b}'
    + '.pf-car{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px}.pf-car div{padding:10px 12px;border-radius:12px;background:var(--surface2);font-size:13.5px;font-weight:800}.pf-car small{display:block;font-weight:500;color:var(--fg2);font-size:12.5px;margin-top:2px}'
    + '.pf-fm{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}.pf-fm div{padding:10px 12px;border-radius:12px;background:var(--surface2)}.pf-fm i{display:block;font-style:normal;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--c);margin-bottom:4px}.pf-fm span{font-size:13.5px;line-height:1.5;display:block}'
    + '.pf-bib{display:grid;gap:8px}.pf-bib div{padding:11px 13px;border-radius:12px;background:linear-gradient(135deg,color-mix(in srgb,var(--c) 14%,var(--surface)),var(--surface2));font-size:13.5px;line-height:1.55}.pf-bib b{color:var(--c);filter:brightness(.9)}'
    + '.pf-foco{display:flex;gap:12px;align-items:flex-start;padding:13px 15px;border-radius:16px;margin-bottom:12px;background:rgba(245,158,11,.1);border:1px solid rgba(245,158,11,.35);font-size:13.5px;line-height:1.55}.pf-foco .ic3d{width:34px;height:34px;flex:none}'
    + '.pf-note{font-size:11.5px;color:var(--fg3);line-height:1.5;margin-top:14px}';
  document.head.appendChild(css);

  function lista(a) { return '<ul>' + a.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>'; }
  function perfil(k, pct) {
    var d = P.k[k]; if (!d) return '';
    var f = d.famosos;
    return '<div class="pf-hero" style="--c:' + d.cor + '">' + ico(k) + '<div><b>Inteligência ' + esc(d.nome) + '</b><span>' + esc(d.resumo) + '</span></div>' + (pct != null ? '<div class="pc">' + pct + '%</div>' : '') + '</div>'
      + '<div class="pf-grid" style="--c:' + d.cor + '">'
      + '<div class="pf-b" style="--c:' + d.cor + '"><h4>Como você aprende melhor</h4>' + lista(d.aprende) + '</div>'
      + '<div class="pf-b" style="--c:' + d.cor + '"><h4>Ambientes bons pra estudar</h4>' + lista(d.ambiente) + '</div>'
      + '<div class="pf-b" style="--c:' + d.cor + '"><h4>Melhor período pra assistir aula</h4><p><em>' + esc(d.periodo.quando) + '.</em></p><p>' + esc(d.periodo.porque) + '</p></div>'
      + '<div class="pf-b" style="--c:' + d.cor + '"><h4>Lugares bons pra se concentrar</h4>' + lista(d.lugares) + '</div>'
      + '<div class="pf-b ok"><h4>Seus pontos fortes</h4>' + lista(d.fortes) + '</div>'
      + '<div class="pf-b no"><h4>Pontos pra ficar de olho</h4>' + lista(d.fracos) + '</div>'
      + '<div class="pf-b tr wide"><h4>Um treino pra fortalecer</h4><p>' + esc(d.treinar) + '</p></div>'
      + '<div class="pf-b wide" style="--c:' + d.cor + '"><h4>Possíveis profissões e áreas de atuação</h4><div class="pf-car">' + d.carreiras.map(function (c) { return '<div>' + esc(c[0]) + '<small>' + esc(c[1]) + '</small></div>'; }).join('') + '</div></div>'
      + '<div class="pf-b wide" style="--c:' + d.cor + '"><h4>Quem se destaca com essa inteligência</h4><div class="pf-fm" style="--c:' + d.cor + '"><div><i>Celebridades</i>' + f.celebridades.map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '</div><div><i>Cientistas</i>' + f.cientistas.map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '</div><div><i>Empresários</i>' + f.empresarios.map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '</div></div></div>'
      + '<div class="pf-b wide" style="--c:' + d.cor + '"><h4>Na Bíblia, quem se parece com você</h4><div class="pf-bib" style="--c:' + d.cor + '">' + d.biblia.map(function (b) { return '<div><b>' + esc(b[0]) + '</b>: ' + esc(b[1]) + '</div>'; }).join('') + '</div></div>'
      + '<div class="pf-b wide" style="--c:' + d.cor + '"><h4>No seu inglês</h4>' + lista(d.ingles) + '</div></div>';
  }

  /* pane: #pane-prisma · ST: estado do app · antes: elemento antes do qual inserir */
  function render(pane, ST) {
    if (!pane) return;
    var old = pane.querySelector('.pf'); if (old) old.remove();
    var R = ST.prismaRes, pcs = {}, tem = !!(R && R.todas && R.todas.length);
    if (tem) R.todas.forEach(function (x) { pcs[norm(x.k)] = x.v; });
    var ativo = norm(ST.prisma || (R && R.k) || 'musical');
    if (!P.k[ativo]) ativo = 'musical';
    var box = document.createElement('div'); box.className = 'pf'; box.dataset.ativo = ativo;
    var ordem = P.ordem.slice();
    if (tem) ordem.sort(function (a, b) { return (pcs[b] || 0) - (pcs[a] || 0); });
    var menor = null;
    if (tem) { var arr = ordem.filter(function (k) { return pcs[k] != null; }); menor = arr[arr.length - 1]; }
    box.innerHTML = '<div class="pf-h">Conheça cada inteligência</div><div class="pf-s">' + (tem ? 'As porcentagens vêm do seu teste. Toque numa aba pra ver o perfil completo. Ninguém é só uma: seu jeito é a mistura de todas.' : 'Toque numa aba pra explorar o perfil de cada inteligência. Faça o Prisma pra ver quanto você tem de cada uma, em porcentagem.') + '</div>'
      + (menor && P.k[menor] ? '<div class="pf-foco">' + ico(menor) + '<div><b>Seu ponto a desenvolver: ' + esc(P.k[menor].nome) + (pcs[menor] != null ? ' (' + pcs[menor] + '%)' : '') + '</b><br>Não é defeito. É o próximo treino. ' + esc(P.k[menor].treinar) + '</div></div>' : '')
      + '<div class="pf-tabs">' + ordem.map(function (k) { return '<button data-pf="' + k + '" style="--c:' + P.k[k].cor + '" class="' + (k === ativo ? 'on' : '') + '">' + ico(k) + esc(P.k[k].nome.split('-')[0]) + (pcs[k] != null ? ' <small>' + pcs[k] + '%</small>' : '') + '</button>'; }).join('') + '</div>'
      + '<div class="pf-corpo">' + perfil(ativo, pcs[ativo]) + '</div>'
      + '<div class="pf-note">Os perfis são tendências baseadas na teoria das Inteligências Múltiplas, de Howard Gardner. São inspiração pra você estudar do seu jeito, não rótulos. Horários e lugares são sugestões: teste e fique com o que funciona pra você.</div>';
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-pf]'); if (!b) return;
      var k = b.dataset.pf;
      [].forEach.call(box.querySelectorAll('[data-pf]'), function (x) { x.classList.toggle('on', x === b); });
      box.querySelector('.pf-corpo').innerHTML = perfil(k, pcs[k]);
    });
    var cards = pane.querySelectorAll('.card'), ultimo = cards[cards.length - 1];
    if (ultimo) ultimo.insertAdjacentElement('beforebegin', box); else pane.appendChild(box);
  }
  window.EBG_PRISMA = { render: render, icone: ico };
})();
