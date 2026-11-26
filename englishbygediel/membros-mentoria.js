/* MENTORIA — aba no menu (no lugar de "Marcar aula") pra quem tem mentoria individual e pro admin.
   Aluno: entra na sala (a sala própria do Gediel, da Central, embutida aqui), vê "Gediel está na sala", seus encontros e quantos faltam, e marca mais.
   Admin: central com todos os mentorandos (individual, casais, turma): quem está na sala, encontros feitos/combinados, entrar na sala de cada um.
   Dados: as mentorias vêm de mi_mentorias (cadastradas em Admin → 🎥 Mentorias, supabase/mentorias-salas.sql); aqui entram só os encontros
   (supabase/mentoria-encontros.sql) · presença: netlify/functions/sala-ping.js · sala: gedielcentral.netlify.app/sala.html (LiveKit). */
(function () {
  var SALA = 'https://gedielcentral.netlify.app/sala.html';
  var linkDe = function (a) { return a && a.k ? SALA + '?sala=' + encodeURIComponent(a.sala) + '&k=' + encodeURIComponent(a.k) : ''; };
  var sb = function () { return window._sb; };
  var S = function () { return (window.EBG_ACESSO || {}).estado || {}; };
  var $ = function (id) { return document.getElementById(id); };
  var M = { ok: false, erro: '', alunos: [], enc: [], pres: {}, email: '', edit: null, encOk: false };
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
  function encDe(a) { return M.enc.filter(function (e) { return e.mentoria_id === a.id; }); }
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
    var q = sb().from('mi_mentorias').select('*'); if (!admin()) q = q.eq('ativo', true);
    var a = await q.order('nome');
    if (a.error) { M.ok = false; M.erro = a.error.message; return; }
    var e = await sb().from('mi_mentoria_encontros').select('*').order('inicio');
    M.ok = true; M.alunos = a.data || []; M.encOk = !e.error; M.enc = e.data || [];
    await pingar();
  }
  async function pingar() {
    var ids = M.alunos.filter(function (a) { return a.ativo !== false; }).map(function (a) { return a.sala; }).filter(Boolean);
    if (!ids.length) return;
    var antes = Object.assign({}, M.pres);
    try { var r = await fetch('/.netlify/functions/sala-ping?salas=' + encodeURIComponent(ids.join(',')), { cache: 'no-store' }); M.pres = r.ok ? await r.json() : {}; } catch (e) { M.pres = {}; }
    if (!admin()) { M.alunos.forEach(function (a) { if (a.sala && !antes[a.sala] && M.pres[a.sala]) tx('🟢 Gediel entrou na sala de mentoria', '#10b981'); }); }
    desenhar();
  }
  var on = function (a) { return !!(a && a.sala && M.pres[a.sala] > 0); };

  // ───── admin: entra na sala com o próprio login (sem senha) e gera o link do aluno
  var API = SALA.replace(/\/sala\.html$/, '');
  async function tokenAdmin() { try { var r = await sb().auth.getSession(); return (r.data && r.data.session && r.data.session.access_token) || ''; } catch (e) { return ''; } }
  async function urlProf(q) { var t = await tokenAdmin(); return SALA + q + (t ? '#t=' + t : ''); }
  async function garantirK(al) {
    if (al.k) return;
    var t = await tokenAdmin(); if (!t) return;
    try {
      var r = await fetch(API + '/api/sala?action=link&sala=' + encodeURIComponent(al.sala), { headers: { Authorization: 'Bearer ' + t } });
      var d = await r.json();
      if (r.ok && d.k) { var u = await sb().from('mi_mentorias').update({ k: d.k }).eq('id', al.id); if (!u.error) al.k = d.k; }
    } catch (e) {}
  }

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
  function blocoAluno(a, varias) {
    var pronto = !!a.k, h = '';
    h += '<button type="button" class="mt-sala" data-mt="entrar" data-id="' + a.id + '"' + (pronto ? '' : ' disabled') + '><span class="ic">' + CAM + '</span><span class="tt"><span class="t">' + (varias ? esc(a.nome) : 'Sala do Gediel') + '</span><span class="s">' +
      (pronto ? '<span class="mt-dot' + (on(a) ? ' on' : '') + '"></span>' + (on(a) ? 'Gediel está na sala agora' : 'Sala aberta sempre que você quiser · Gediel offline') : 'Sua sala está sendo preparada.') + '</span></span>' +
      (pronto ? '<span class="go">' + (on(a) ? 'Entrar agora' : 'Entrar na sala') + '</span>' : '') + '</button>';
    var enc = encDe(a).filter(function (e) { return e.status !== 'cancelado'; }), tot = a.encontros_total, f = feitos(a);
    h += '<div class="mt-box"><h3>Seus encontros' + (tot ? ' · ' + f + ' de ' + tot : '') + '</h3>';
    if (tot) { var bolas = ''; for (var i = 0; i < tot; i++) bolas += '<i class="' + (i < f ? 'f' : (i < enc.length ? 'p' : '')) + '"></i>'; h += '<div class="mt-prog" title="' + f + ' feitos de ' + tot + '">' + bolas + '</div><div class="mt-sub" style="margin:-4px 0 8px">' + (tot - f > 0 ? 'Faltam ' + (tot - f) + ' encontro' + (tot - f > 1 ? 's' : '') + '.' : 'Todos os encontros foram feitos 🎉') + '</div>'; }
    h += enc.length ? enc.map(function (e) { var s = ST[e.status] || ST.pedido; return '<div class="mt-enc"><b>' + esc(dt(e.inicio)) + '</b><span class="mt-chip" style="background:' + s[1] + '">' + s[0] + '</span></div>'; }).join('') : '<div class="mt-sub">Nenhum encontro marcado ainda.</div>';
    return h + '<div style="margin-top:12px"><button type="button" class="mt-btn" data-mt="marcar">+ Marcar encontro</button></div></div>';
  }
  function htmlAluno() {
    var h = '<div class="mt-wrap"><div class="mt-h1">Mentoria</div>';
    h += M.alunos.length ? M.alunos.map(function (a) { return blocoAluno(a, M.alunos.length > 1); }).join('') : '<div class="mt-box">Sua mentoria está sendo preparada. Fale com o Gediel 🙏</div>';
    return h + '</div>';
  }

  // ───── central do admin
  function cartao(a) {
    var enc = encDe(a), ped = enc.filter(function (e) { return e.status === 'pedido'; }).length;
    var prox = enc.filter(function (e) { return (e.status === 'confirmado' || e.status === 'pedido') && new Date(e.inicio) > new Date(); }).sort(function (x, y) { return new Date(x.inicio) - new Date(y.inicio); })[0];
    var h = '<div class="mt-box mt-al" data-id="' + a.id + '"><div class="top"><span class="mt-dot' + (on(a) ? ' on' : '') + '" title="' + (on(a) ? 'Tem gente na sala' : 'Sala vazia') + '"></span><span class="nm">' + esc(a.nome) + (a.ativo === false ? ' <span class="mt-chip" style="background:#8a93a0">inativo</span>' : '') + '</span>' +
      '<span class="meta">' + feitos(a) + (a.encontros_total ? ' / ' + a.encontros_total : '') + ' encontros' + (ped ? ' · <b style="color:#d99a2b">🕓 ' + ped + ' pedido' + (ped > 1 ? 's' : '') + '</b>' : '') + '</span></div>' +
      '<div class="meta">' + (prox ? 'Próximo: ' + esc(dt(prox.inicio)) : 'Sem encontro marcado') + (on(a) ? ' · <b style="color:#1b8f6b">🟢 ' + M.pres[a.sala] + ' na sala</b>' : '') + '</div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="mt-btn s" data-mt="prof">▶ Entrar na sala</button>' +
      '<button type="button" class="mt-btn s g" data-mt="copiar">🔗 Link do aluno</button><button type="button" class="mt-btn s g" data-mt="editar">' + (M.edit === a.id ? 'Fechar' : '📅 Encontros') + '</button>' +
      '<button type="button" class="mt-btn s g" data-mt="edit-m">✎ Editar</button><button type="button" class="mt-btn s g" data-mt="status">' + (a.ativo === false ? '▶ Reativar' : '⏸ Pausar') + '</button></div>' +
      ((a.emails || []).length ? '' : '<div class="meta" style="color:#d99a2b">⚠ Sem e-mail de aluno: ele ainda não vê a sala no app. Toque em ✎ Editar.</div>');
    if (M.edit === a.id) {
      h += '<div class="mt-ed"><label>Encontros combinados<input data-k="encontros_total" type="number" min="0" value="' + (a.encontros_total == null ? '' : a.encontros_total) + '"></label><div style="align-self:end"><button type="button" class="mt-btn s" data-mt="salvar">Salvar</button></div>' +
        '<div class="full" style="border-top:1px solid var(--border);padding-top:10px">' +
        (enc.map(function (e) { return '<div class="mt-enc" data-e="' + e.id + '"><span>' + esc(dt(e.inicio)) + (e.tipo ? ' · ' + esc(e.tipo) : '') + (e.email ? ' <small style="color:var(--fg2)">' + esc(e.email) + '</small>' : '') + '</span><span><select data-ens>' + Object.keys(ST).map(function (k) { return '<option value="' + k + '"' + (e.status === k ? ' selected' : '') + '>' + ST[k][0] + '</option>'; }).join('') + '</select> <button type="button" class="mt-btn s g" data-mt="apagar-enc">🗑</button></span></div>'; }).join('') || '<div class="meta">Nenhum encontro.</div>') +
        '<div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap"><input type="datetime-local" id="mt-novo-dt"><button type="button" class="mt-btn s" data-mt="add-enc">+ Encontro</button></div></div></div>';
    }
    return h + '</div>';
  }
  var TIPOG = { particular: 'Individual', casal: 'Casais', turma: 'Turma' };
  function htmlAdmin() {
    var ativos = M.alunos.filter(function (a) { return a.ativo !== false; }), inativos = M.alunos.filter(function (a) { return a.ativo === false; });
    var online = ativos.filter(on).length;
    var h = '<div class="mt-wrap"><div class="mt-h1">Central das Mentorias</div><div class="mt-sub"><b>' + ativos.length + '</b> ativos · ' + inativos.length + ' inativos · <span style="color:#1b8f6b;font-weight:700">🟢 ' + online + ' com gente na sala agora</span></div>' +
      '<button type="button" class="mt-sala" data-mt="minha"><span class="ic">' + CAM + '</span><span class="tt"><span class="t">Minha sala</span><span class="s">Abre a sala da Central aqui dentro, já logado (sem senha)</span></span><span class="go">Abrir</span></button>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="mt-btn s" data-mt="novo">＋ Novo mentorando</button><button type="button" class="mt-btn s g" data-mt="importar">⬇ Importar da Central</button></div>';
    Object.keys(TIPOG).forEach(function (g) {
      var l = ativos.filter(function (a) { return a.tipo === g; });
      if (l.length) h += '<div class="mt-grp">' + TIPOG[g] + '</div>' + l.map(cartao).join('');
    });
    if (inativos.length) h += '<div class="mt-grp">Inativos</div>' + inativos.map(cartao).join('');
    if (!M.alunos.length) h += '<div class="mt-box">Nenhuma mentoria cadastrada ainda. Toque em <b>＋ Novo mentorando</b> ou em <b>⬇ Importar da Central</b>.</div>';
    if (M.alunos.length && !M.encOk) h += '<div class="mt-box">Os encontros ligam assim que você rodar o SQL <b>supabase/mentoria-encontros.sql</b>.</div>';
    h += '<div class="mt-sub">Dica: o aluno só vê a sala dele depois que o e-mail dele estiver cadastrado em ✎ Editar.</div></div>';
    return h;
  }

  function desenhar(force) {
    var p = $('pane-mentoria'); if (!p) return;
    if (!force && p.contains(document.activeElement) && /INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) return;   // não atropela quem está digitando
    p.innerHTML = !M.ok ? '<div class="mt-wrap"><div class="mt-h1">Mentoria</div><div class="mt-box">' + (admin() ? 'A aba liga assim que você rodar o SQL <b>supabase/mentorias-salas.sql</b> no Supabase.' : 'Sua mentoria está sendo preparada. Fale com o Gediel 🙏') + '</div></div>' : (admin() ? htmlAdmin() : htmlAluno());
  }

  // ───── ações
  async function salvarTotal(id) {
    var inp = document.querySelector('.mt-al[data-id="' + id + '"] [data-k="encontros_total"]'); if (!inp) return;
    var v = inp.value.trim() === '' ? null : parseInt(inp.value, 10);
    var r = await sb().from('mi_mentorias').update({ encontros_total: v }).eq('id', id);
    if (r.error) return tx('Não salvou 😕 (rodou o SQL dos encontros?)', '#ef4444');
    M.alunos = M.alunos.map(function (a) { return a.id === id ? Object.assign(a, { encontros_total: v }) : a; }); tx('✅ Salvo', '#10b981'); desenhar(true);
  }
  document.addEventListener('click', async function (e) {
    var t = e.target.closest('[data-mt]'); if (!t) return;
    var a = t.dataset.mt, card = t.closest('.mt-al') || t, id = card.dataset && card.dataset.id, al = id && M.alunos.filter(function (x) { return x.id === id; })[0];
    if (a === 'fechar') return fecharSala();
    if (a === 'fora') return;
    if (a === 'abrir-home') return window.goTo && goTo('mentoria', document.getElementById('mi-nav-mentoria'));
    if (a === 'entrar' && al && al.k) abrirSala(linkDe(al), 'Sala do Gediel');
    if (a === 'marcar') { window._mentVoltar = true; window.goTo && goTo('agendar'); }
    if (a === 'minha') abrirSala(await urlProf('?prof'), 'Minha sala');
    if (a === 'prof' && al) abrirSala(await urlProf('?sala=' + encodeURIComponent(al.sala) + '&prof'), 'Sala · ' + al.nome);
    if (a === 'copiar' && al) {
      await garantirK(al);
      if (!linkDe(al)) return tx('Não consegui gerar o link agora. Tente de novo em instantes.', '#ef4444');
      try { await navigator.clipboard.writeText(linkDe(al)); tx('🔗 Link de ' + al.nome + ' copiado', '#10b981'); } catch (x) { tx(linkDe(al)); }
    }
    if (a === 'novo' || a === 'importar' || (a === 'edit-m' && al)) {
      var F = window.EBG_MENTORIAS_FORM;
      if (!F) return tx('O formulário ainda não carregou. Recarregue a página (Cmd+Shift+R).', '#ef4444');
      if (a === 'novo') F.novo(); else if (a === 'importar') F.importar(); else F.editar(al.id);
    }
    if (a === 'status' && al) {
      var nv = al.ativo === false;
      var rs = await sb().from('mi_mentorias').update({ ativo: nv }).eq('id', al.id);
      if (rs.error) return tx('Não salvou 😕', '#ef4444');
      al.ativo = nv; tx(nv ? '▶ ' + al.nome + ' reativado' : '⏸ ' + al.nome + ' pausado', '#10b981'); desenhar(true); pingar();
    }
    if (a === 'editar') { M.edit = M.edit === id ? null : id; desenhar(true); }
    if (a === 'salvar') await salvarTotal(id);
    if (a === 'add-enc' && al) {
      var v = $('mt-novo-dt').value; if (!v) return tx('Escolha data e hora', '#ef4444');
      var r = await sb().from('mi_mentoria_encontros').insert({ mentoria_id: id, inicio: new Date(v).toISOString(), status: 'confirmado' }).select().single();
      if (r.data) { M.enc.push(r.data); desenhar(true); } else tx('Não salvou 😕 (rodou o SQL dos encontros?)', '#ef4444');
    }
    if (a === 'apagar-enc') { var eid = t.closest('[data-e]').dataset.e; await sb().from('mi_mentoria_encontros').delete().eq('id', eid); M.enc = M.enc.filter(function (x) { return x.id !== eid; }); desenhar(true); }
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
      var a = meu(); if (!a) return; var r = await sb().from('mi_mentoria_encontros').insert({ mentoria_id: a.id, email: M.email, inicio: inicio, status: 'pedido', tipo: tipo || null }).select().single();
      if (r.data) { M.enc.push(r.data); desenhar(); }
    } catch (e) {}
  }

  // ───── menu: "Marcar aula" vira "Mentoria" pra quem tem mentoria (e pro admin)
  function montar() {
    var pg = $('pane-agendar'); if (!pg) return;
    if (!$('pane-mentoria')) { var p = document.createElement('div'); p.className = 'pane'; p.id = 'pane-mentoria'; pg.insertAdjacentElement('afterend', p); if (window.TITLES) TITLES.mentoria = 'Mentoria'; }
    var ok = tem();
    [].forEach.call(document.querySelectorAll('.nav-pill'), function (n) {
      var oc = n.getAttribute('onclick') || '';
      if (ok && /goTo\('agendar'/.test(oc)) { n.setAttribute('onclick', "goTo('mentoria',this)"); n.id = 'mi-nav-mentoria'; var sp = n.querySelectorAll('span'); if (sp[1]) sp[1].textContent = 'Mentoria'; n.title = 'Mentoria'; n.dataset.mtOn = '1'; }
      else if (!ok && n.dataset.mtOn) { n.setAttribute('onclick', "goTo('agendar',this)"); n.removeAttribute('id'); var s2 = n.querySelectorAll('span'); if (s2[1]) s2[1].textContent = 'Marcar aula'; delete n.dataset.mtOn; }
    });
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
