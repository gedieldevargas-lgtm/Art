/* "Suas mentorias" — cartões na home da área de membros, um por mentoria em que o e-mail do aluno foi cadastrado
   no painel (aba Mentorias). Mostra foto, dias e horário fixos e o botão que entra na sala de vídeo.
   · A sala é a do site da Central (SITE/sala.html); o link só existe depois que o Gediel gera o link do aluno no painel.
   · Tabela: supabase/mentorias-salas.sql (o aluno só lê as mentorias dele). Sem a tabela, nada aparece. */
(function () {
  var sb = function () { return window._sb; };
  var S = function () { return (window.EBG_ACESSO || {}).estado || {}; };
  var SITE = 'https://gedielcentral.netlify.app';
  var D3 = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'], ORD = [1, 2, 3, 4, 5, 6, 0];
  var TIPOS = { particular: 'Mentoria particular', casal: 'Mentoria em casal', turma: 'Turma' };
  var M = { rows: [], ok: false };
  var esc = function (x) { return String(x == null ? '' : x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  var css = document.createElement('style');
  css.textContent =
    '#mi-mentorias{display:grid;gap:12px;margin:0 0 22px}' +
    '.mm-card{display:flex;align-items:center;gap:16px;padding:16px 18px;border-radius:22px;color:#fff;background:linear-gradient(135deg,#1e3a8a,#4338ca);box-shadow:var(--shadow,0 8px 24px rgba(0,0,0,.18))}' +
    '.mm-av{width:60px;height:60px;flex:none;border-radius:50%;background:rgba(255,255,255,.18) center/cover;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1.2rem}' +
    '.mm-tx{min-width:0;flex:1}.mm-k{font-size:11px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;opacity:.8}' +
    '.mm-t{font-size:20px;font-weight:800;letter-spacing:-.2px;line-height:1.15;margin-top:2px}' +
    '.mm-s{font-size:13px;margin-top:5px;opacity:.95}.mm-prox{display:inline-block;margin-top:6px;font-size:12px;font-weight:700;background:rgba(255,255,255,.18);border-radius:99px;padding:3px 10px}' +
    '.mm-prox.hoje{background:#34d399;color:#052e1b}' +
    '.mm-go{flex:none;background:#fff;color:#1e3a8a;font-weight:800;font-size:14px;border-radius:12px;padding:10px 16px;white-space:nowrap;text-decoration:none}' +
    '.mm-go.off{opacity:.7}' +
    '@media(max-width:560px){.mm-card{flex-wrap:wrap}.mm-go{width:100%;text-align:center;box-sizing:border-box}}';
  document.head.appendChild(css);

  function proxima(m) {
    var d = m.dias || []; if (!d.length || !m.hora) return null;
    var hp = String(m.hora).split(':'), h = +hp[0], mi = +hp[1], agora = new Date();
    for (var i = 0; i < 8; i++) {
      var t = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + i, h, mi);
      if (d.indexOf(t.getDay()) >= 0 && t.getTime() > agora.getTime() - 90 * 60000) {
        var quando = i === 0 ? 'Hoje' : i === 1 ? 'Amanhã' : D3[t.getDay()];
        return { txt: quando + ' às ' + m.hora, hoje: i === 0 };
      }
    }
    return null;
  }

  function card(m) {
    var dias = ORD.filter(function (d) { return (m.dias || []).indexOf(d) >= 0; }).map(function (d) { return D3[d]; }).join(' · ');
    var av = m.foto ? '<span class="mm-av" style="background-image:url(' + esc(m.foto) + ')"></span>' : '<span class="mm-av">' + esc((m.nome || '?').trim().slice(0, 2).toUpperCase()) + '</span>';
    var p = proxima(m);
    var go = m.k ? '<button type="button" class="mm-go" data-mt="abrir-home" style="border:0;font:inherit;cursor:pointer">Abrir mentoria</button>' : '<span class="mm-go off">Link em breve</span>';
    return '<div class="mm-card">' + av + '<div class="mm-tx"><div class="mm-k">' + esc(TIPOS[m.tipo] || 'Mentoria') + '</div><div class="mm-t">' + esc(m.nome) + '</div>' +
      '<div class="mm-s">' + esc(dias || 'Horário a combinar') + (m.hora ? ' · ' + esc(m.hora) : '') + '</div>' +
      (p ? '<span class="mm-prox' + (p.hoje ? ' hoje' : '') + '">Próxima aula: ' + esc(p.txt) + '</span>' : '') + '</div>' + go + '</div>';
  }

  async function buscar() {
    if (!sb()) return;
    var r = await sb().from('mi_mentorias').select('*').eq('ativo', true).order('nome');
    if (r.error) { M.ok = false; M.rows = []; return; }
    M.ok = true; M.rows = r.data || []; desenhar();
  }
  function desenhar() {
    var home = document.getElementById('pane-home'), c = document.getElementById('mi-mentorias');
    if (!home || !M.rows.length || (S().admin || window._isAdmin)) { if (c) c.remove(); return; }   // admin gerencia pelo painel
    if (!c) { c = document.createElement('div'); c.id = 'mi-mentorias'; }
    var ref = document.getElementById('mi-ment') || home.querySelector('.hm-row');
    if (ref) { if (ref.nextElementSibling !== c) ref.insertAdjacentElement('afterend', c); }
    else if (c.parentNode !== home) home.appendChild(c);
    var html = M.rows.map(card).join('');
    if (c.dataset.h !== html) { c.dataset.h = html; c.innerHTML = html; }
  }

  var ini = false;
  setInterval(function () {
    if (!S().pronto) return;
    if (!ini) { ini = true; buscar(); }
    if (M.ok) desenhar();
  }, 700);
  setInterval(function () { if (ini && !document.hidden) buscar(); }, 60000);
  document.addEventListener('visibilitychange', function () { if (ini && !document.hidden) buscar(); });
})();
