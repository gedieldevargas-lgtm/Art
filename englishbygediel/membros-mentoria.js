/* MENTORIA — aba no menu (no lugar de "Marcar aula") pra quem tem mentoria individual e pro admin.
   Aluno: entra na sala (a sala própria do Gediel, da Central, embutida aqui), vê "Gediel está na sala", seus encontros e quantos faltam, e marca mais.
   Admin: central com todos os mentorandos (individual, casais, turma): quem está na sala, encontros feitos/combinados, entrar na sala de cada um.
   Dados: supabase/mentoria-central.sql · presença: netlify/functions/sala-ping.js · sala: gedielcentral.netlify.app/sala.html (LiveKit). */
(function () {
  var SALA = 'https://gedielcentral.netlify.app/sala.html';
  var sb = function () { return window._sb; };
  var S = function () { return (window.EBG_ACESSO || {}).estado || {}; };
  var $ = function (id) { return document.getElementById(id); };
  var M = { ok: false, erro: '', alunos: [], enc: [], pres: {}, email: '', edit: null, antes: null };
  var esc = function (x) { return String(x == null ? '' : x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var norm = function (x) { return String(x || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); };
  var tx = function (m, c) { if (window.toast) toast(m, c); };

  function admin() { var s = S(); return !!(s.admin || window._isAdmin); }
  function genio() {
    var s = S(), lista = (s.cfg && s.cfg.mentoria) || ['Plano Gênio'];
    return (s.compras || []).some(function (c) { return lista.some(function (t) { return norm(c.produto).indexOf(norm(t)) >= 0; }); });
  }
  function tem() { return admin() || (M.ok && M.alunos.length > 0) || (S().ok && genio()); }
  function meu() { return M.alunos[0] || null; }
  function encDe(a) { return M.enc.filter(function (e) { return e.aluno_id === a.id || (a.email && e.email && e.email.toLowerCase() === a.email.toLowerCase()); }); }
  function feitos(a) { return encDe(a).filter(function (e) { return e.status === 'feito'; }).length; }
  function dt(iso) { var d = new Date(iso); var s = d.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' }).replace(/\./g, ''); return s.charAt(0).toUpperCase() + s.slice(1) + ' · ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); }
  var ST = { pedido: ['🕓 Pedido enviado', '#d99a2b'], confirmado: ['✅ Confirmado', '#1b8f6b'], feito: ['✔ Feito', '#6b7a99'], cancelado: ['✕ Cancelado', '#c0504d'] };

  var css = document.createElement('style');
  css.textContent =
    '#pane-mentoria .mt-wrap{max-width:860px;margin:0 auto;display:flex;flex-direction:column;gap:14px}' +
    '#pane-mentoria .mt-h1{font-size:26px;font-weight:800;letter-spacing:-.4px}#pane-mentoria .mt-sub{font-size:13.5px;color:var(--fg2);margin-top:-8px}' +
    '.mt-sala{display:flex;align-items:center;gap:16px;width:100%;border:0;border-radius:22px;padding:20px;color:#fff;font:inherit;text-align:left;cursor:pointer;background:linear-gradient(135deg,#0b5d46,#1b8f6b);box-shadow:var(--shadow,0 8px 24px rgba(0,0,0,.18));transition:transform .2s,box-shadow .2s}' +
    '.mt-sala:hover{transform:translateY(-2px);box-shadow:0 14px 32px rgba(0,0,0,.26)}.mt-sala:disabled{filter:grayscale(.5);cursor:default;transform:none}' +
    '.mt-sala .ic{width:60px;height:60px;flex:none}.mt-sala .ic svg{width:100%;height:100%;display:block}.mt-sala .tt{min-width:0;flex:1}' +
    '.mt-sala .t{display:block;font-size:22px;font-weight:800;letter-spacing:-.3px}.mt-sala .s{display:flex;align-items:center;gap:7px;font-size:13px;margin-top:5px;flex-wrap:wrap}' +
    '.mt-dot{width:10px;height:10px;border-radius:50%;background:#b8c9c2;flex:none}.mt-dot.on{background:#5dff9b;box-shadow:0 0 0 3px rgba(93,255,155,.3)}' +
    '.mt-sala .go{flex:none;box-sizing:border-box;background:#fff;color:#0b5d46;font-weight:800;font-size:14px;border-radius:12px;padding:10px 16px;white-space:nowrap}' +
    '.mt-box{background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:16px 18px}.mt-box h3{font-size:16px;margin:0 0 10px;font-weight:800}' +
    '.mt-prog{display:flex;gap:6px;flex-wrap:wrap;margin:4px 0 12px}.mt-prog i{width:22px;height:22px;border-radius:50%;border:2px solid var(--border);display:block}.mt-prog i.f{background:#1b8f6b;border-color:#1b8f6b}.mt-prog i.p{border-color:#d99a2b}' +
    '.mt-enc{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:9px 0;border-top:1px solid var(--border);font-size:14px;flex-wrap:wrap}.mt-enc:first-of-type{border-top:0}' +
    '.mt-chip{font-size:12px;font-weight:700;padding:3px 9px;border-radius:99px;color:#fff;white-space:nowrap}' +
    '.mt-btn{border:0;border-radius:12px;padding:10px 16px;font:inherit;font-weight:800;font-size:14px;cursor:pointer;background:var(--accent,#4f6ef7);color:#fff}.mt-btn.g{background:var(--surface2);color:var(--fg);border:1px solid var(--border)}.mt-btn.s{padding:7px 11px;font-size:12.5px;border-radius:10px}' +
    '.mt-grp{font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--fg2);margin:6px 0 -4px}' +
    '.mt-al{display:flex;flex-direction:column;gap:10px}.mt-al .top{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.mt-al .nm{font-weight:800;font-size:16px;flex:1;min-width:130px}.mt-al .meta{font-size:12.5px;color:var(--fg2)}' +
    '.mt-ed{display:grid;grid-template-columns:1fr 1fr;gap:8px;border-top:1px solid var(--border);padding-top:12px}.mt-ed label{display:flex;flex-direction:column;gap:3px;font-size:12px;color:var(--fg2)}.mt-ed .full{grid-column:1/-1}' +
    '.mt-ed input,.mt-ed select,.mt-tb input{border:1px solid var(--border);background:var(--bg);color:var(--fg);border-radius:10px;padding:8px 10px;font:inherit;font-size:13.5px;min-width:0}' +
    '.mt-tb{display:flex;gap:8px;flex-wrap:wrap}.mt-tb input{flex:1;min-width:200px}' +
    '#mt-ov{position:fixed;inset:0;z-index:9800;display:none;flex-direction:column;background:#0b0f14}#mt-ov.on{display:flex}' +
    '#mt-ov .bar{display:flex;align-items:center;gap:10px;padding:10px max(14px,env(safe-area-inset-right,0px)) 10px max(14px,env(safe-area-inset-left,0px));padding-top:max(10px,env(safe-area-inset-top,0px));background:#10161d;color:#fff}' +
    '#mt-ov .bar b{flex:1;font-size:14px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#mt-ov .bar button,#mt-ov .bar a{border:0;border-radius:10px;padding:8px 14px;font:inherit;font-weight:800;font-size:13px;cursor:pointer;background:#fff;color:#0b5d46;text-decoration:none}' +
    '#mt-ov iframe{flex:1;border:0;width:100%;background:#000}' +
    '@media(max-width:560px){.mt-sala{flex-wrap:wrap;padding:16px}.mt-sala .ic{width:50px;height:50px}.mt-sala .t{font-size:19px}.mt-sala .go{width:100%;text-align:center}.mt-ed{grid-template-columns:1fr}}';
  document.head.appendChild(css);

  var CAM = '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="5" y="14" width="39" height="36" rx="9" fill="#fff"/><path d="M48 27l11-8c1.4-1 3 0 3 1.6v22.8c0 1.6-1.6 2.6-3 1.6l-11-8z" fill="#fff"/><circle cx="24.5" cy="32" r="7" fill="#1b8f6b"/></svg>';

  // ───── dados
  async function carregar() {
    var u = (await sb().auth.getUser()).data.user; M.email = ((u && u.email) || '').toLowerCase();
    var a = await sb().from('mi_mentoria_alunos').select('*').eq('ativo', true).order('ordem').order('nome');
    if (a.error) { M.ok = false; M.erro = a.error.message; return; }
    var e = await sb().from('mi_mentoria_encontros').select('*').order('inicio');
    M.ok = true; M.alunos = a.data || []; M.enc = e.data || [];
    await pingar();
  }
  async function pingar() {
    var ids = M.alunos.map(function (a) { return a.sala; }).filter(Boolean);
    if (!ids.length) return;
    var antes = Object.assign({}, M.pres);
    try { var r = await fetch('/.netlify/functions/sala-ping?salas=' + encodeURIComponent(ids.join(',')), { cache: 'no-store' }); M.pres = r.ok ? await r.json() : {}; } catch (e) { M.pres = {}; }
    if (!admin()) { var a = meu(); if (a && a.sala && !antes[a.sala] && M.pres[a.sala]) tx('🟢 Gediel entrou na sala de mentoria', '#10b981'); }
    desenhar();
  }
  var on = function (a) { return !!(a && a.sala && M.pres[a.sala] > 0); };

  // ───── sala embutida (tela cheia, com voltar)
  function abrirSala(url, titulo) {
    var o = $('mt-ov');
    if (!o) {
      o = document.createElement('div'); o.id = 'mt-ov';
      o.innerHTML = '<div class="bar"><button type="button" data-mt="fechar">← Voltar</button><b></b><a target="_blank" rel="noopener" data-mt="fora">Abrir em outra aba ↗</a></div><iframe title="Sala de mentoria" allow="camera *; microphone *; display-capture *; autoplay; fullscreen; clipboard-write"></iframe>';
      document.body.appendChild(o);
    }
    o.querySelector('b').textContent = titulo || 'Sala de mentoria';
    o.querySelector('a').href = url; o.querySelector('iframe').src = url; o.classList.add('on');
  }
  function fecharSala() { var o = $('mt-ov'); if (!o) return; o.classList.remove('on'); o.querySelector('iframe').src = 'about:blank'; pingar(); }

  // ───── tela do aluno
  function htmlAluno() {
    var a = meu(), h = '<div class="mt-wrap"><div class="mt-h1">Mentoria</div>';
    var pronto = a && a.link;
    h += '<button type="button" class="mt-sala" data-mt="entrar"' + (pronto ? '' : ' disabled') + '><span class="ic">' + CAM + '</span><span class="tt"><span class="t">Sala do Gediel</span><span class="s">' +
      (pronto ? '<span class="mt-dot' + (on(a) ? ' on' : '') + '"></span>' + (on(a) ? 'Gediel está na sala agora' : 'Sala aberta sempre que você quiser · Gediel offline') : 'Sua sala está sendo preparada.') + '</span></span>' +
      (pronto ? '<span class="go">' + (on(a) ? 'Entrar agora' : 'Entrar na sala') + '</span>' : '') + '</button>';
    var enc = a ? encDe(a).filter(function (e) { return e.status !== 'cancelado'; }) : [], tot = a && a.encontros_total, f = a ? feitos(a) : 0;
    h += '<div class="mt-box"><h3>Seus encontros' + (tot ? ' · ' + f + ' de ' + tot : '') + '</h3>';
    if (tot) { var bolas = ''; for (var i = 0; i < tot; i++) bolas += '<i class="' + (i < f ? 'f' : (i < enc.length ? 'p' : '')) + '"></i>'; h += '<div class="mt-prog" title="' + f + ' feitos de ' + tot + '">' + bolas + '</div><div class="mt-sub" style="margin:-4px 0 8px">' + (tot - f > 0 ? 'Faltam ' + (tot - f) + ' encontro' + (tot - f > 1 ? 's' : '') + '.' : 'Todos os encontros foram feitos 🎉') + '</div>'; }
    h += enc.length ? enc.map(function (e) { var s = ST[e.status] || ST.pedido; return '<div class="mt-enc"><b>' + esc(dt(e.inicio)) + '</b><span class="mt-chip" style="background:' + s[1] + '">' + s[0] + '</span></div>'; }).join('') : '<div class="mt-sub">Nenhum encontro marcado ainda.</div>';
    h += '<div style="margin-top:12px"><button type="button" class="mt-btn" data-mt="marcar">+ Marcar encontro</button></div></div></div>';
    return h;
  }

  // ───── central do admin
  function cartao(a) {
    var enc = encDe(a), ped = enc.filter(function (e) { return e.status === 'pedido'; }).length;
    var prox = enc.filter(function (e) { return (e.status === 'confirmado' || e.status === 'pedido') && new Date(e.inicio) > new Date(); }).sort(function (x, y) { return new Date(x.inicio) - new Date(y.inicio); })[0];
    var h = '<div class="mt-box mt-al" data-id="' + a.id + '"><div class="top"><span class="mt-dot' + (on(a) ? ' on' : '') + '" title="' + (on(a) ? 'Tem gente na sala' : 'Sala vazia') + '"></span><span class="nm">' + esc(a.nome) + '</span>' +
      '<span class="meta">' + feitos(a) + (a.encontros_total ? ' / ' + a.encontros_total : '') + ' encontros' + (ped ? ' · <b style="color:#d99a2b">🕓 ' + ped + ' pedido' + (ped > 1 ? 's' : '') + '</b>' : '') + '</span></div>' +
      '<div class="meta">' + (prox ? 'Próximo: ' + esc(dt(prox.inicio)) : 'Sem encontro marcado') + (on(a) ? ' · <b style="color:#1b8f6b">🟢 ' + M.pres[a.sala] + ' na sala</b>' : '') + '</div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="mt-btn s" data-mt="prof"' + (a.sala ? '' : ' disabled') + '>▶ Entrar na sala</button>' +
      '<button type="button" class="mt-btn s g" data-mt="copiar"' + (a.link ? '' : ' disabled') + '>🔗 Link do aluno</button><button type="button" class="mt-btn s g" data-mt="editar">' + (M.edit === a.id ? 'Fechar' : '⚙ Editar') + '</button></div>';
    if (M.edit === a.id) {
      h += '<div class="mt-ed"><label>Nome<input data-k="nome" value="' + esc(a.nome) + '"></label><label>E-mail do login do aluno<input data-k="email" value="' + esc(a.email || '') + '" inputmode="email"></label>' +
        '<label>Formato<select data-k="formato">' + ['individual', 'casal', 'turma'].map(function (f) { return '<option' + (a.formato === f ? ' selected' : '') + '>' + f + '</option>'; }).join('') + '</select></label>' +
        '<label>Encontros combinados<input data-k="encontros_total" type="number" min="0" value="' + (a.encontros_total == null ? '' : a.encontros_total) + '"></label>' +
        '<label>Sala na Central (id)<input data-k="sala" value="' + esc(a.sala || '') + '"></label><label>Link do aluno<input data-k="link" value="' + esc(a.link || '') + '"></label>' +
        '<div class="full"><button type="button" class="mt-btn s" data-mt="salvar">Salvar</button> <button type="button" class="mt-btn s g" data-mt="apagar">Remover da mentoria</button></div>' +
        '<div class="full" style="border-top:1px solid var(--border);padding-top:10px"><b style="font-size:13px">Encontros</b>' +
        (enc.map(function (e) { return '<div class="mt-enc" data-e="' + e.id + '"><span>' + esc(dt(e.inicio)) + (e.tipo ? ' · ' + esc(e.tipo) : '') + '</span><span><select data-ens>' + Object.keys(ST).map(function (k) { return '<option value="' + k + '"' + (e.status === k ? ' selected' : '') + '>' + ST[k][0] + '</option>'; }).join('') + '</select> <button type="button" class="mt-btn s g" data-mt="apagar-enc">🗑</button></span></div>'; }).join('') || '<div class="meta">Nenhum encontro.</div>') +
        '<div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap"><input type="datetime-local" id="mt-novo-dt"><button type="button" class="mt-btn s" data-mt="add-enc">+ Encontro</button></div></div></div>';
    }
    return h + '</div>';
  }
  function htmlAdmin() {
    var h = '<div class="mt-wrap"><div class="mt-h1">Central das Mentorias</div><div class="mt-sub">Todos os seus mentorandos e a sua sala. A bolinha verde acende quando alguém está na sala.</div>' +
      '<button type="button" class="mt-sala" data-mt="minha"><span class="ic">' + CAM + '</span><span class="tt"><span class="t">Minha sala</span><span class="s">Abre a sala da Central aqui dentro (entre com a sua senha)</span></span><span class="go">Abrir</span></button>';
    [['individual', 'Individual'], ['casal', 'Casais'], ['turma', 'Turma']].forEach(function (g) {
      var l = M.alunos.filter(function (a) { return a.formato === g[0]; });
      if (l.length) h += '<div class="mt-grp">' + g[1] + '</div>' + l.map(cartao).join('');
    });
    if (!M.alunos.length) h += '<div class="mt-box">Nenhum mentorando ainda. Rode o SQL <b>supabase/mentoria-central.sql</b> pra trazer os da sua Central.</div>';
    h += '<div class="mt-box"><h3>Ajustes</h3><div class="mt-tb"><button type="button" class="mt-btn s" data-mt="novo">+ Novo mentorando</button></div>' +
      '<div class="mt-sub" style="margin:12px 0 6px">Preencher todos os links de uma vez: na sua sala, clique em “Link” de qualquer aluno e cole aqui.</div><div class="mt-tb"><input id="mt-lk" placeholder="https://gedielcentral.netlify.app/sala.html?sala=…&k=…"><button type="button" class="mt-btn s" data-mt="links">Preencher links</button></div></div></div>';
    return h;
  }

  function desenhar(force) {
    var p = $('pane-mentoria'); if (!p) return;
    if (!force && p.contains(document.activeElement) && /INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) return;   // não atropela quem está digitando
    p.innerHTML = !M.ok ? '<div class="mt-wrap"><div class="mt-h1">Mentoria</div><div class="mt-box">' + (admin() ? 'A aba liga assim que você rodar o SQL <b>supabase/mentoria-central.sql</b> no Supabase.' : 'Sua mentoria está sendo preparada. Fale com o Gediel 🙏') + '</div></div>' : (admin() ? htmlAdmin() : htmlAluno());
    var c = $('mi-ment'); if (c) pintarHome(c);
  }

  // ───── ações
  async function salvarLinha(id) {
    var row = document.querySelector('.mt-al[data-id="' + id + '"] .mt-ed'); if (!row) return;
    var v = function (k) { return row.querySelector('[data-k="' + k + '"]').value.trim(); };
    var d = { nome: v('nome') || 'Sem nome', email: v('email').toLowerCase() || null, formato: v('formato'), sala: v('sala').toLowerCase().replace(/[^a-z0-9-]/g, '') || null, link: v('link') || null, encontros_total: v('encontros_total') === '' ? null : parseInt(v('encontros_total'), 10) };
    var r = await sb().from('mi_mentoria_alunos').update(d).eq('id', id);
    if (r.error) return tx('Não salvou 😕', '#ef4444');
    M.alunos = M.alunos.map(function (a) { return a.id === id ? Object.assign(a, d) : a; }); tx('✅ Salvo', '#10b981'); desenhar();
  }
  document.addEventListener('click', async function (e) {
    var t = e.target.closest('[data-mt]'); if (!t) return;
    var a = t.dataset.mt, card = t.closest('.mt-al'), id = card && card.dataset.id, al = id && M.alunos.filter(function (x) { return x.id === id; })[0];
    if (a === 'fechar') return fecharSala();
    if (a === 'fora') return;
    if (a === 'abrir-home') return window.goTo && goTo('mentoria', document.getElementById('mi-nav-mentoria'));
    if (a === 'entrar') { var m = meu(); if (m && m.link) abrirSala(m.link, 'Sala do Gediel'); }
    if (a === 'marcar') { window._mentVoltar = true; window.goTo && goTo('agendar'); }
    if (a === 'minha') abrirSala(SALA + '?prof', 'Minha sala');
    if (a === 'prof' && al) abrirSala(SALA + '?sala=' + al.sala + '&prof', 'Sala · ' + al.nome);
    if (a === 'copiar' && al) { try { await navigator.clipboard.writeText(al.link); tx('🔗 Link de ' + al.nome + ' copiado', '#10b981'); } catch (x) { tx(al.link); } }
    if (a === 'editar') { M.edit = M.edit === id ? null : id; desenhar(true); }
    if (a === 'salvar') await salvarLinha(id);
    if (a === 'apagar' && al) { if (!t.dataset.c) { t.dataset.c = '1'; t.textContent = 'Clique de novo pra remover'; return; } await sb().from('mi_mentoria_alunos').delete().eq('id', id); M.alunos = M.alunos.filter(function (x) { return x.id !== id; }); M.edit = null; desenhar(); }
    if (a === 'novo') { var n = await sb().from('mi_mentoria_alunos').insert({ nome: 'Novo mentorando', ordem: M.alunos.length + 1 }).select().single(); if (n.data) { M.alunos.push(n.data); M.edit = n.data.id; desenhar(true); } else tx('Não criou 😕', '#ef4444'); }
    if (a === 'add-enc' && al) {
      var v = $('mt-novo-dt').value; if (!v) return tx('Escolha data e hora', '#ef4444');
      var r = await sb().from('mi_mentoria_encontros').insert({ aluno_id: id, email: al.email, inicio: new Date(v).toISOString(), status: 'confirmado' }).select().single();
      if (r.data) { M.enc.push(r.data); desenhar(true); } else tx('Não salvou 😕', '#ef4444');
    }
    if (a === 'apagar-enc') { var eid = t.closest('[data-e]').dataset.e; await sb().from('mi_mentoria_encontros').delete().eq('id', eid); M.enc = M.enc.filter(function (x) { return x.id !== eid; }); desenhar(true); }
    if (a === 'links') {
      var m2 = ($('mt-lk').value || '').match(/[?&]k=([^&\s#]+)/); if (!m2) return tx('Cole um link de aluno que tenha o k=…', '#ef4444');
      var ok = 0; for (var i = 0; i < M.alunos.length; i++) { var x = M.alunos[i]; if (!x.sala) continue; var lk = SALA + '?sala=' + x.sala + '&k=' + m2[1]; var rr = await sb().from('mi_mentoria_alunos').update({ link: lk }).eq('id', x.id); if (!rr.error) { x.link = lk; ok++; } }
      tx('✅ ' + ok + ' links preenchidos', '#10b981'); desenhar(true);
    }
  });
  document.addEventListener('change', async function (e) {
    var s = e.target.closest('[data-ens]'); if (!s) return;
    var eid = s.closest('[data-e]').dataset.e; var r = await sb().from('mi_mentoria_encontros').update({ status: s.value }).eq('id', eid);
    if (r.error) return tx('Não salvou 😕', '#ef4444');
    M.enc = M.enc.map(function (x) { return x.id === eid ? Object.assign(x, { status: s.value }) : x; }); desenhar(true);
  });

  // chamado pelo "Marcar aula" quando o aluno pede um horário: o pedido entra na lista de encontros dele
  async function registrar(inicio, tipo) {
    try {
      if (!M.ok || admin()) return;
      var a = meu(), r = await sb().from('mi_mentoria_encontros').insert({ aluno_id: a ? a.id : null, email: M.email, inicio: inicio, status: 'pedido', tipo: tipo || null }).select().single();
      if (r.data) { M.enc.push(r.data); desenhar(); }
    } catch (e) {}
  }

  // ───── menu: "Marcar aula" vira "Mentoria" pra quem tem mentoria (e pro admin)
  function pintarHome(c) {
    var a = meu(), st = admin() ? 'Central com todos os mentorandos' : (a && a.link ? (on(a) ? '<span class="mt-dot on"></span>Gediel está na sala agora' : '<span class="mt-dot"></span>Sala aberta · Gediel offline') : 'Sua sala, seus encontros');
    var k = st + '|' + admin(); if (c.dataset.k === k) return; c.dataset.k = k;
    c.innerHTML = '<button type="button" class="mt-sala" data-mt="abrir-home" style="border-radius:22px"><span class="ic">' + CAM + '</span><span class="tt"><span class="t">Mentoria</span><span class="s">' + st + '</span></span><span class="go">Abrir</span></button>';
  }
  function montar() {
    var pg = $('pane-agendar'); if (!pg) return;
    if (!$('pane-mentoria')) { var p = document.createElement('div'); p.className = 'pane'; p.id = 'pane-mentoria'; pg.insertAdjacentElement('afterend', p); if (window.TITLES) TITLES.mentoria = 'Mentoria'; }
    var ok = tem();
    [].forEach.call(document.querySelectorAll('.nav-pill'), function (n) {
      var oc = n.getAttribute('onclick') || '';
      if (ok && /goTo\('agendar'/.test(oc)) { n.setAttribute('onclick', "goTo('mentoria',this)"); n.id = 'mi-nav-mentoria'; var sp = n.querySelectorAll('span'); if (sp[1]) sp[1].textContent = 'Mentoria'; n.title = 'Mentoria'; n.dataset.mtOn = '1'; }
      else if (!ok && n.dataset.mtOn) { n.setAttribute('onclick', "goTo('agendar',this)"); n.removeAttribute('id'); var s2 = n.querySelectorAll('span'); if (s2[1]) s2[1].textContent = 'Marcar aula'; delete n.dataset.mtOn; }
    });
    var home = $('pane-home'), c = $('mi-ment');
    if (home && ok && M.ok) {
      if (!c) { c = document.createElement('div'); c.id = 'mi-ment'; c.style.margin = '0 0 22px'; }
      var row = home.querySelector('.hm-row');
      if (row) { if (row.nextElementSibling !== c) row.insertAdjacentElement('afterend', c); } else if (c.parentNode !== home) home.appendChild(c);
      pintarHome(c);
    } else if (c && !ok) c.remove();
  }

  // ───── ligação com a navegação
  var wrapped = false;
  function envolverGoTo() {
    if (wrapped || !window.goTo) return; wrapped = true;
    var g = window.goTo;
    window.goTo = function (page, el) {
      var r = g.apply(this, arguments);
      if (page === 'mentoria') { desenhar(); carregar().then(desenhar); }
      if (page === 'agendar' && window._mentVoltar) {
        window._mentVoltar = false;
        setTimeout(function () { var p = $('pane-agendar'); if (p && !p.querySelector('#mt-volta')) { var b = document.createElement('button'); b.id = 'mt-volta'; b.type = 'button'; b.className = 'mt-btn g s'; b.style.margin = '0 0 12px'; b.textContent = '← Mentoria'; b.onclick = function () { goTo('mentoria', $('mi-nav-mentoria')); }; p.insertBefore(b, p.firstChild); } }, 250);
      }
      return r;
    };
  }
  var ini = false;
  setInterval(function () {
    if (!S().pronto) return;
    envolverGoTo();
    if (!ini) { ini = true; carregar().then(desenhar); }
    montar();
  }, 600);
  setInterval(function () { if (ini && !document.hidden && (tem())) pingar(); }, 25000);
  document.addEventListener('visibilitychange', function () { if (ini && !document.hidden) pingar(); });
  window.EBG_MENTORIA = { registrar: registrar, recarregar: function () { return carregar().then(desenhar); } };
})();
