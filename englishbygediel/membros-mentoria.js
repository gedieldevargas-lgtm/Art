/* Sala de Mentoria Individual — botão na home só pra quem tem o Plano Gênio (cfg.mentoria) e pro admin.
   · O Google Meet NÃO pode ser embutido em iframe (o Google bloqueia), então o botão abre a sala fixa em nova aba.
   · "Gediel online": o admin liga o interruptor no próprio card; o site dele renova um batimento (online_at) a cada 1 min.
     Se ele fechar a aba ou esquecer ligado, depois de ~2,5 min some sozinho. Os alunos veem o status mudar em até 20 s e recebem um aviso.
   · Tabela: supabase/mentoria-sala.sql (o link só é legível por quem tem acesso). */
(function () {
  var sb = function () { return window._sb; };
  var S = function () { return (window.EBG_ACESSO || {}).estado || {}; };
  var M = { row: null, on: null, ok: false, hb: null };
  var VALE = 150000;   // ms: batimento mais velho que isso = offline

  var css = document.createElement('style');
  css.textContent =
    '#mi-ment{margin:0 0 22px;border-radius:22px;color:#fff;background:linear-gradient(135deg,#0b5d46,#1b8f6b);box-shadow:var(--shadow,0 8px 24px rgba(0,0,0,.18));overflow:hidden;transition:transform .2s,box-shadow .2s}' +
    '#mi-ment:hover{transform:translateY(-2px);box-shadow:0 14px 32px rgba(0,0,0,.26)}' +
    '#mi-ment .mt-main{display:flex;align-items:center;gap:16px;width:100%;border:0;background:none;color:inherit;font:inherit;text-align:left;padding:18px 20px;cursor:pointer}' +
    '#mi-ment .mt-main:focus-visible{outline:3px solid #fff;outline-offset:-3px}' +
    '#mi-ment .mt-ic{width:64px;height:64px;flex:none;display:block}#mi-ment .mt-ic svg{width:100%;height:100%;display:block}' +
    '#mi-ment .mt-tx{min-width:0;flex:1}' +
    '#mi-ment .mt-t{font-size:22px;font-weight:800;letter-spacing:-.3px;line-height:1.1}' +
    '#mi-ment .mt-s{font-size:13px;margin-top:6px;opacity:.95;display:flex;align-items:center;gap:7px;flex-wrap:wrap}' +
    '#mi-ment .mt-dot{width:10px;height:10px;border-radius:50%;background:#b8c9c2;flex:none}#mi-ment.on .mt-dot{background:#5dff9b;box-shadow:0 0 0 3px rgba(93,255,155,.3)}' +
    '#mi-ment .mt-go{box-sizing:border-box;flex:none;background:#fff;color:#0b5d46;font-weight:800;font-size:14px;border-radius:12px;padding:10px 16px;white-space:nowrap}' +
    '#mi-ment .mt-adm{border-top:1px solid rgba(255,255,255,.22);padding:12px 20px 16px;display:flex;flex-direction:column;gap:10px;font-size:13px;background:rgba(0,0,0,.14)}' +
    '#mi-ment .mt-adm label{display:flex;align-items:center;gap:10px;font-weight:700;cursor:pointer}' +
    '#mi-ment .mt-adm .row{display:flex;gap:8px;flex-wrap:wrap}#mi-ment .mt-adm input[type=url]{flex:1;min-width:180px;border:0;border-radius:10px;padding:9px 12px;font:inherit;font-size:13px;color:#111}' +
    '#mi-ment .mt-adm button{border:0;border-radius:10px;padding:9px 14px;font:inherit;font-weight:700;font-size:13px;cursor:pointer;background:#fff;color:#0b5d46}' +
    '@media(max-width:560px){#mi-ment .mt-main{flex-wrap:wrap;padding:16px}#mi-ment .mt-ic{width:52px;height:52px}#mi-ment .mt-t{font-size:19px}#mi-ment .mt-go{width:100%;text-align:center}}';
  document.head.appendChild(css);

  var CAM = '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="5" y="14" width="39" height="36" rx="9" fill="#fff"/><path d="M48 27l11-8c1.4-1 3 0 3 1.6v22.8c0 1.6-1.6 2.6-3 1.6l-11-8z" fill="#fff"/><circle cx="24.5" cy="32" r="7" fill="#1b8f6b"/></svg>';
  var esc = function (x) { return String(x == null ? '' : x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var norm = function (x) { return String(x || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); };

  function admin() { var s = S(); return !!(s.admin || window._isAdmin); }
  function tem() {
    var s = S();
    if (admin()) return true;
    if (!s.ok) return false;                                     // sem as tabelas de acesso: nada de sala
    var lista = (s.cfg && s.cfg.mentoria) || ['Plano Gênio'];
    return (s.compras || []).some(function (c) { return lista.some(function (t) { return norm(c.produto).indexOf(norm(t)) >= 0; }); });
  }
  function online() { var r = M.row; return !!(r && r.online && r.online_at && Date.now() - new Date(r.online_at).getTime() < VALE); }

  async function buscar() {
    if (!sb() || !tem()) return;
    var r = await sb().from('mi_mentoria').select('*').eq('id', 'sala').maybeSingle();
    if (r.error) { M.ok = false; return; }
    M.ok = true; M.row = r.data || { id: 'sala' };
    var agora = online();
    if (M.on === false && agora && !admin()) avisar();
    M.on = agora;
    desenhar();
  }
  function avisar() {
    if (window.toast) toast('🟢 ' + ((M.row && M.row.nome) || 'Gediel') + ' entrou na sala de mentoria', '#10b981');
    try { if (window.Notification && Notification.permission === 'granted') new Notification('Mentoria Individual', { body: ((M.row && M.row.nome) || 'Gediel') + ' está online na sala. Pode entrar!' }); } catch (e) {}
  }

  function html() {
    var r = M.row || {}, on = online(), adm = admin(), tl = !!r.link;
    var sub = !tl ? (adm ? 'Cole o link do seu Meet aqui embaixo ↓' : 'A sala ainda está sendo preparada.')
      : on ? '<span class="mt-dot"></span>' + esc(r.nome || 'Gediel') + ' está na sala agora' : '<span class="mt-dot"></span>Sala aberta sempre que quiser · ' + esc(r.nome || 'Gediel') + ' offline';
    var h = '<button type="button" class="mt-main" data-mt="abrir" aria-label="Entrar na sala de mentoria">' +
      '<span class="mt-ic">' + CAM + '</span><span class="mt-tx"><span class="mt-t" style="display:block">Mentoria Individual</span><span class="mt-s">' + sub + '</span></span>' +
      (tl ? '<span class="mt-go">' + (on ? 'Entrar agora' : 'Entrar na sala') + '</span>' : '') + '</button>';
    if (adm) h += '<div class="mt-adm"><label><input type="checkbox" data-mt="liga"' + (on ? ' checked' : '') + '> Estou na sala (avisar os alunos)</label>' +
      '<div class="row"><input type="url" id="mt-link" placeholder="https://meet.google.com/xxx-xxxx-xxx" value="' + esc(r.link || '') + '"><button type="button" data-mt="salvar">Salvar link</button></div></div>';
    return h;
  }
  function desenhar() {
    var c = document.getElementById('mi-ment'); if (!c) return;
    var on = online(), key = JSON.stringify([M.row && M.row.link, on, M.row && M.row.nome, admin()]);
    c.classList.toggle('on', on);
    if (c.dataset.k === key && c.firstChild) return;
    var foco = document.activeElement && document.activeElement.id === 'mt-link';
    if (foco) return;                                             // não atropela o admin digitando
    c.dataset.k = key; c.innerHTML = html();
  }

  function montar() {
    var home = document.getElementById('pane-home');
    if (!home || !tem() || !M.ok) { var x = document.getElementById('mi-ment'); if (x && !tem()) x.remove(); return; }
    var c = document.getElementById('mi-ment');
    if (!c) { c = document.createElement('div'); c.id = 'mi-ment'; }
    var row = home.querySelector('.hm-row');
    if (row) { if (row.nextElementSibling !== c) row.insertAdjacentElement('afterend', c); }
    else if (c.parentNode !== home) home.appendChild(c);
    if (!c.firstChild) desenhar();
  }

  async function marcar(on) {
    var agora = new Date().toISOString();
    var r = await sb().from('mi_mentoria').upsert({ id: 'sala', online: on, online_at: agora });
    if (r.error) { if (window.toast) toast('Não salvou 😕 (rodou o SQL da mentoria?)', '#ef4444'); return false; }
    M.row = Object.assign({}, M.row, { online: on, online_at: agora });
    batimento(on); M.on = on; desenhar(); return true;
  }
  function batimento(on) {
    clearInterval(M.hb);
    if (on) M.hb = setInterval(function () { sb().from('mi_mentoria').update({ online: true, online_at: new Date().toISOString() }).eq('id', 'sala').then(function () {}); }, 60000);
  }

  document.addEventListener('click', async function (e) {
    var t = e.target.closest('#mi-ment [data-mt]'); if (!t) return;
    var a = t.dataset.mt, r = M.row || {};
    if (a === 'abrir') { if (r.link) window.open(r.link, '_blank', 'noopener'); else if (window.toast) toast(admin() ? 'Cole o link do Meet abaixo e salve 👇' : 'A sala ainda não foi aberta. Fale com o Gediel 🙏'); }
    if (a === 'salvar') {
      var v = (document.getElementById('mt-link').value || '').trim();
      if (v && !/^https:\/\/meet\.google\.com\//i.test(v)) { if (window.toast) toast('Cole o link do Google Meet (meet.google.com/…)', '#ef4444'); return; }
      var s = await sb().from('mi_mentoria').upsert({ id: 'sala', link: v });
      if (s.error) { if (window.toast) toast('Não salvou 😕 (rodou o SQL da mentoria?)', '#ef4444'); return; }
      M.row = Object.assign({}, M.row, { link: v }); if (window.toast) toast('✅ Link salvo', '#10b981'); document.getElementById('mi-ment').dataset.k = ''; desenhar();
    }
  });
  document.addEventListener('change', async function (e) {
    var t = e.target.closest('#mi-ment [data-mt="liga"]'); if (!t) return;
    var ok = await marcar(t.checked);
    if (ok && t.checked && M.row && M.row.link) window.open(M.row.link, '_blank', 'noopener');
    if (!ok) t.checked = !t.checked;
  });

  var ini = false;
  setInterval(function () {
    if (!S().pronto) return;
    if (!ini && tem()) { ini = true; buscar().then(function () { if (admin() && online()) batimento(true); }); }
    if (ini) montar();
  }, 600);
  setInterval(function () { if (ini && !document.hidden) buscar(); }, 20000);
  document.addEventListener('visibilitychange', function () { if (ini && !document.hidden) buscar(); });
})();
