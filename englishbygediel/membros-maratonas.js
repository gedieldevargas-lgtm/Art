/* Área de membros · MARATONAS
   1) "Maratona 10 meses": menu exclusivo de quem o Gediel escolheu à mão (tabela maratona_membros). Mostra os 5 ciclos.
   2) "Maratonas": todo aluno vê as maratonas, com status e inscrição (a mesma página pública, maratonas.html).
   3) Painel Admin → aba "Maratona 10m": escolher quem participa, entre todos os cadastrados, e ver o progresso.
   Precisa do supabase/maratona-membros.sql rodado no projeto dos membros. Sem ele, só o admin vê o menu (com aviso). */
(function () {
  var sb = window._sb, MR = window.EBG_MARATONAS;
  if (!sb || !MR) return;
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var M10 = MR.m10, CIC = M10.ciclos;
  var d0 = function (s) { return new Date(s + 'T00:00'); };
  var br = function (s) { var d = d0(s); return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear(); };
  var hojeS = MR.hoje();
  var SEM_TABELA = function (e) { return e && (/does not exist|schema cache|42P01|PGRST205/i.test((e.message || '') + (e.code || ''))); };
  var EU = { email: '', nome: '', admin: false, dentro: false, feitos: {}, semTabela: false };

  /* ---------- estilos ---------- */
  var css = document.createElement('style');
  css.textContent = ''
    + '.mt-hero{position:relative;border-radius:22px;overflow:hidden;padding:22px 20px;color:#fff;background:linear-gradient(135deg,#2b180e,#5a3418 55%,#d6965a);margin-bottom:16px}'
    + '.mt-hero small{font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:800;opacity:.85}'
    + '.mt-hero h2{font-size:26px;font-weight:800;line-height:1.1;margin:6px 0 4px}.mt-hero p{font-size:13px;opacity:.9}'
    + '.mt-nums{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:16px}.mt-nums div{background:rgba(255,255,255,.14);border-radius:14px;padding:10px 8px;text-align:center}'
    + '.mt-nums b{display:block;font-size:22px;font-weight:800;font-variant-numeric:tabular-nums}.mt-nums span{font-size:10.5px;opacity:.85}'
    + '.mt-barra{height:8px;border-radius:99px;background:rgba(255,255,255,.2);margin-top:14px;overflow:hidden}.mt-barra i{display:block;height:100%;background:#fff;border-radius:inherit}'
    + '.mt-aviso{font-size:12.5px;padding:10px 12px;border-radius:12px;background:rgba(245,158,11,.12);color:var(--fg);margin-bottom:14px}'
    + '.mt-ciclos{display:grid;gap:12px}'
    + '.mt-c{background:var(--surface);border:1px solid var(--border);border-radius:18px;overflow:hidden}'
    + '.mt-c>summary{list-style:none;display:flex;align-items:center;gap:12px;padding:14px 16px;cursor:pointer}.mt-c>summary::-webkit-details-marker{display:none}'
    + '.mt-c .ic{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;font-size:22px;background:var(--surface2);flex:none}'
    + '.mt-c .tt{flex:1;min-width:0}.mt-c .tt b{display:block;font-size:15px}.mt-c .tt span{font-size:12px;color:var(--fg2)}'
    + '.mt-st{font-size:10.5px;font-weight:800;padding:4px 9px;border-radius:99px;white-space:nowrap}'
    + '.mt-st.atual{background:rgba(79,110,247,.14);color:var(--accent)}.mt-st.feito{background:rgba(16,185,129,.14);color:var(--green)}.mt-st.trancado{background:var(--surface2);color:var(--fg3)}'
    + '.mt-c.atual{border-color:var(--accent);box-shadow:0 8px 30px rgba(79,110,247,.12)}'
    + '.mt-c.trancado summary{cursor:default}.mt-c.trancado .ic{filter:grayscale(1);opacity:.6}'
    + '.mt-in{padding:0 16px 16px}.mt-in .foco{font-size:13px;color:var(--fg2);margin-bottom:10px}'
    + '.mt-in .pb{height:6px;border-radius:99px;background:var(--surface2);overflow:hidden;margin-bottom:12px}.mt-in .pb i{display:block;height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2))}'
    + '.mt-item{display:flex;gap:10px;align-items:flex-start;padding:10px 12px;border-radius:12px;background:var(--surface2);margin-bottom:6px;cursor:pointer;font-size:13.5px}'
    + '.mt-item input{margin-top:2px;width:18px;height:18px;accent-color:var(--green);flex:none}.mt-item.ok span{text-decoration:line-through;color:var(--fg2)}'
    + '.mt-item.entrega{background:linear-gradient(135deg,rgba(214,150,90,.14),rgba(139,92,246,.08));font-weight:600}'
    + '.mt-adm-top{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px}.mt-adm-top input{flex:1;min-width:180px;padding:9px 12px;border-radius:10px;border:1px solid var(--border);background:var(--surface2);color:var(--fg)}'
    + '.mt-conta{font-size:13px;font-weight:800;padding:6px 12px;border-radius:99px;background:rgba(214,150,90,.14);color:#b8763a}'
    + '.mt-tg{border:0;border-radius:99px;padding:7px 13px;font-size:12px;font-weight:800;cursor:pointer}.mt-tg.on{background:var(--green);color:#fff}.mt-tg.off{background:var(--surface2);color:var(--fg)}'
    + '.mt-mini{display:inline-block;width:70px;height:6px;border-radius:99px;background:var(--surface2);overflow:hidden;vertical-align:middle;margin-right:6px}.mt-mini i{display:block;height:100%;background:var(--green)}'
    + '.mt-box{background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:16px;margin-bottom:14px}.mt-box h3{font-size:16px;font-weight:800;margin-bottom:4px}.mt-box .s{font-size:12.5px;color:var(--fg2);margin-bottom:12px}'
    + '.mt-box.trava{border-color:var(--gold);background:linear-gradient(135deg,rgba(245,158,11,.08),transparent)}'
    + '.mt-ad{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;background:var(--surface2);margin-bottom:6px;font-size:13.5px}.mt-ad .ck{width:22px;height:22px;border-radius:50%;display:grid;place-items:center;font-size:12px;background:var(--border);flex:none}.mt-ad.ok .ck{background:var(--green);color:#fff}.mt-ad.ok .t{color:var(--fg2);text-decoration:line-through}.mt-ad button{margin-left:auto;border:0;border-radius:99px;padding:6px 12px;font-size:11.5px;font-weight:800;background:var(--accent);color:#fff;cursor:pointer}'
    + '.mt-rk{display:grid;gap:6px}.mt-rk .l{display:grid;grid-template-columns:34px 1fr auto;align-items:center;gap:10px;padding:9px 12px;border-radius:12px;background:var(--surface2);font-size:13.5px}.mt-rk .l.eu{outline:2px solid var(--accent)}.mt-rk .pos{font-weight:800;text-align:center}.mt-rk .pts{font-weight:800;font-variant-numeric:tabular-nums}'
    + '.mt-tabs{display:flex;gap:6px;overflow-x:auto;margin-bottom:10px}.mt-tabs button{border:1px solid var(--border);background:var(--surface2);color:var(--fg);border-radius:99px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap}.mt-tabs button.on{background:var(--accent);color:#fff;border-color:var(--accent)}'
    + '.mt-pt{display:grid;grid-template-columns:28px 1fr auto;gap:8px;align-items:center;font-size:13px;padding:7px 0;border-top:1px solid var(--border)}.mt-pt b{font-variant-numeric:tabular-nums}.mt-pt small{display:block;color:var(--fg3);font-size:11px}'
    + '.mt-premio{display:grid;gap:8px;margin-top:12px}.mt-premio div{padding:12px;border-radius:14px;font-size:13px;font-weight:600;background:linear-gradient(135deg,rgba(214,150,90,.16),rgba(139,92,246,.1))}'
    + '.mt-post{display:flex;gap:8px;flex-wrap:wrap}.mt-post input{flex:1;min-width:200px;padding:10px 12px;border-radius:10px;border:1px solid var(--border);background:var(--surface2);color:var(--fg)}.mt-post button{border:0;border-radius:10px;padding:10px 14px;font-weight:800;background:var(--accent);color:#fff;cursor:pointer}'
    + '.mt-outras{display:flex;gap:8px;overflow-x:auto}.mt-outras div{flex:0 0 170px;padding:12px;border-radius:14px;background:var(--surface2);font-size:12px;color:var(--fg2)}.mt-outras b{display:block;color:var(--fg);font-size:13px;margin:4px 0}'
    + '.mr-h{font-size:22px;font-weight:800;letter-spacing:-.3px}.mr-s{font-size:13.5px;color:var(--fg2);margin:4px 0 14px;line-height:1.5}'
    + '.mr-leg{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px}'
    + '.mr-pill{display:inline-flex;align-items:center;gap:6px;font-size:11.5px;font-weight:800;padding:5px 11px;border-radius:99px;background:var(--surface2);color:var(--fg2);white-space:nowrap}.mr-pill i{width:7px;height:7px;border-radius:50%;background:currentColor}'
    + '.mr-pill.abertas{background:rgba(16,185,129,.14);color:#0f9d6b}.mr-pill.andamento{background:rgba(245,158,11,.16);color:#c27a05}.mr-pill.dias{background:color-mix(in srgb,var(--accent) 12%,transparent);color:var(--accent)}'
    + '.mr-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:16px}'
    + '.mr-c{--cor:#4f6ef7;display:flex;flex-direction:column;background:var(--surface);border:1px solid var(--border);border-radius:22px;overflow:hidden;box-shadow:var(--shadow);transition:transform .2s,box-shadow .2s}.mr-c:hover{transform:translateY(-3px);box-shadow:0 18px 36px -18px var(--cor)}'
    + '.mr-art{position:relative;aspect-ratio:16/9;background-size:cover;background-position:center;background-color:var(--surface2)}.mr-art:after{content:"";position:absolute;inset:0;background:linear-gradient(to top,var(--surface) 0%,transparent 45%),linear-gradient(135deg,color-mix(in srgb,var(--cor) 28%,transparent),transparent 60%)}'
    + '.mr-c.fechada .mr-art{filter:saturate(.7)}'
    + '.mr-bd{display:flex;flex-direction:column;gap:6px;padding:0 18px 18px;margin-top:-18px;position:relative;z-index:1;flex:1}'
    + '.mr-bd h3{font-size:19px;line-height:1.2;font-weight:800;margin:4px 0 0}.mr-ed{font-size:12.5px;color:var(--fg2);font-weight:700}.mr-q{font-size:13px;font-weight:800;color:var(--cor)}'
    + '.mr-bd p{font-size:13.5px;line-height:1.5;color:var(--fg2);margin:2px 0 0}.mr-bd p b{color:var(--fg)}'
    + '.mr-av{font-size:12.5px;line-height:1.45;padding:10px 12px;border-radius:12px;background:var(--surface2);color:var(--fg2);margin-top:4px}'
    + '.mr-ac{margin-top:auto;padding-top:12px;display:flex;gap:8px}'
    + '.mr-b1,.mr-b2{flex:1;min-height:46px;border-radius:14px;border:0;font:inherit;font-weight:800;font-size:13.5px;cursor:pointer}.mr-b1{background:var(--cor);color:#fff;box-shadow:0 8px 18px -8px var(--cor)}.mr-b2{background:var(--surface2);color:var(--fg);border:1.5px solid var(--border)}'
    + '.mr-ov{position:fixed;inset:0;z-index:9000;background:rgba(8,12,28,.6);backdrop-filter:blur(4px);display:none;align-items:flex-end;justify-content:center}.mr-ov.on{display:flex}@media(min-width:700px){.mr-ov{align-items:center}}'
    + '.mr-fo{width:100%;max-width:620px;max-height:92vh;overflow:auto;background:var(--surface);color:var(--fg);border-radius:24px 24px 0 0;padding:20px 20px 26px}@media(min-width:700px){.mr-fo{border-radius:24px}}'
    + '.mr-fo h3{font-size:21px;font-weight:800;margin:8px 0 2px}.mr-fo .sub{font-size:13px;color:var(--fg2);margin-bottom:12px}.mr-x{float:right;border:0;background:var(--surface2);color:var(--fg);width:38px;height:38px;border-radius:50%;font-size:16px;cursor:pointer}'
    + '.mr-gr{font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:800;color:var(--accent);margin:16px 0 8px}'
    + '.mr-cp{display:flex;flex-direction:column;gap:5px;margin-bottom:12px;font-size:13px;font-weight:700}.mr-cp em{font-weight:500;color:var(--fg3);font-style:normal}'
    + '.mr-cp input[type=text],.mr-cp input[type=tel],.mr-cp input[type=email],.mr-cp textarea{font:inherit;font-size:14px;padding:12px;border-radius:12px;border:1.5px solid var(--border);background:var(--surface2);color:var(--fg)}.mr-cp textarea{min-height:76px}'
    + '.mr-dois{display:grid;grid-template-columns:1fr 1fr;gap:10px}@media(max-width:520px){.mr-dois{grid-template-columns:1fr}}'
    + '.mr-ops{display:flex;flex-wrap:wrap;gap:8px}.mr-ops label{cursor:pointer}.mr-ops input{position:absolute;opacity:0;pointer-events:none}.mr-ops span{display:inline-block;padding:9px 13px;border-radius:99px;border:1.5px solid var(--border);background:var(--surface2);font-size:13px;font-weight:700}.mr-ops input:checked+span{background:var(--accent);border-color:var(--accent);color:#fff}'
    + '.mr-er{color:#e11d48;font-size:13px;font-weight:700;min-height:18px;margin:6px 0}.mr-ok{text-align:center;padding:20px 6px}.mr-ok .ck{width:70px;height:70px;border-radius:50%;background:#10b981;color:#fff;display:grid;place-items:center;font-size:34px;margin:0 auto 10px}'
    + '.mr-ok a{text-decoration:none;display:flex;align-items:center;justify-content:center}';
  document.head.appendChild(css);

  /* ---------- menu e telas ---------- */
  function montar() {
    if ($('pane-mt10')) return true;
    var perfil = [].filter.call(document.querySelectorAll('.sidebar .nav-section'), function (s) { return /perfil/i.test(s.textContent); })[0];
    var base = $('pane-maratona');
    if (!perfil || !base) return false;
    var sec = document.createElement('div'); sec.className = 'nav-section'; sec.textContent = 'Maratonas';
    var p1 = document.createElement('div'); p1.className = 'nav-pill'; p1.id = 'mt10-nav'; p1.style.display = 'none';
    p1.setAttribute('onclick', "goTo('mt10',this)"); p1.innerHTML = '<span class="nav-icon"><img class="ic3d" src="img/icons/bandeira.svg" alt="" draggable="false"></span><span>Maratona 10 meses</span><span class="nav-badge">Turma</span>';
    var p2 = document.createElement('div'); p2.className = 'nav-pill'; p2.setAttribute('onclick', "goTo('maratonas',this)");
    p2.innerHTML = '<span class="nav-icon"><img class="ic3d" src="img/icons/calendario.svg" alt="" draggable="false"></span><span>Maratonas</span>';
    perfil.insertAdjacentElement('beforebegin', sec); sec.insertAdjacentElement('afterend', p1); p1.insertAdjacentElement('afterend', p2);
    var a = document.createElement('div'); a.className = 'pane'; a.id = 'pane-mt10';
    var b = document.createElement('div'); b.className = 'pane'; b.id = 'pane-maratonas';
    b.innerHTML = '';
    base.insertAdjacentElement('afterend', a); a.insertAdjacentElement('afterend', b);
    if (window.TITLES) { TITLES.mt10 = 'Maratona 10 meses'; TITLES.maratonas = 'Maratonas'; }

    // aba no Painel Admin
    var tabs = document.querySelector('#pane-admin .admin-tabs'), pnl = $('adm-usuarios');
    if (tabs && pnl && !$('adm-mt10')) {
      var bt = document.createElement('button'); bt.className = 'admin-tab'; bt.textContent = '🏁 Maratona 10m';
      bt.setAttribute('onclick', "adminTab('mt10',this)"); tabs.appendChild(bt);
      var pa = document.createElement('div'); pa.className = 'admin-panel'; pa.id = 'adm-mt10'; pnl.parentNode.appendChild(pa);
    }
    return true;
  }


  /* ---------- Maratonas (todas, nativo) ---------- */
  var CFG = window.EBG_CONFIG || {}, ATUAL = null;
  var zapM = function (t) { return 'https://wa.me/' + (CFG.whatsapp || '5555999895429') + '?text=' + encodeURIComponent(t || ''); };
  function cardM(m) {
    var st = MR.status(m), d = MR.diasAte(m), inscrito = false;
    try { inscrito = !!localStorage.getItem('ebg:maratona:' + m.id); } catch (e) {}
    var bt = '';
    if (st === 'abertas') bt = inscrito ? '<span class="mr-pill abertas"><i></i>Você já está inscrito(a)</span>' : '<button class="mr-b1" data-mr="' + m.id + '">Quero me inscrever</button>';
    else if (st === 'em-breve') bt = '<button class="mr-b2" data-mr="' + m.id + '">Me avise quando abrir</button>';
    else if (st === 'andamento' && m.proxima) bt = '<button class="mr-b2" data-mr="' + m.proxima + '">Entrar na lista da ' + esc((MR.porId(m.proxima) || {}).edicao || 'próxima turma') + '</button>';
    return '<article class="mr-c' + (st === 'abertas' ? '' : ' fechada') + '" style="--cor:' + esc(m.cor) + '"><div class="mr-art" style="background-image:url(\'' + esc(m.img) + '\');background-position:' + esc(m.pos || 'center') + '"></div><div class="mr-bd">'
      + '<div style="display:flex;gap:6px;flex-wrap:wrap"><span class="mr-pill ' + st + '"><i></i>' + MR.rotulo[st] + '</span>' + (st === 'abertas' && d > 0 ? '<span class="mr-pill dias">faltam ' + d + ' dias</span>' : '') + (m.vagas ? '<span class="mr-pill dias">' + m.vagas + ' vagas</span>' : '') + '</div>'
      + '<h3>' + esc(m.nome) + '</h3><div class="mr-ed">' + esc(m.edicao) + (m.duracao ? ' · ' + esc(m.duracao) : '') + '</div><div class="mr-q">' + esc(m.quando) + '</div>'
      + '<p>' + esc(m.promessa) + '</p><p><b>Pra quem:</b> ' + esc(m.pra) + '</p>'
      + (st === 'andamento' && m.aviso ? '<div class="mr-av">' + esc(m.aviso) + '</div>' : '')
      + '<div class="mr-ac">' + bt + '</div></div></article>';
  }
  function renderMaratonas() {
    var p = $('pane-maratonas'); if (!p) return;
    var ab = MR.lista.filter(function (m) { return MR.status(m) === 'abertas'; }).length, an = MR.lista.filter(function (m) { return MR.status(m) === 'andamento'; }).length;
    p.innerHTML = '<div class="mr-h">Maratonas</div><div class="mr-s">Todas as maratonas do Gediel, com status. Se inscreva na próxima.</div>'
      + '<div class="mr-leg">' + (ab ? '<span class="mr-pill abertas"><i></i>' + ab + ' com inscrições abertas</span>' : '') + (an ? '<span class="mr-pill andamento"><i></i>' + an + ' em andamento</span>' : '') + '</div>'
      + '<div class="mr-grid">' + MR.lista.map(cardM).join('') + '</div><div class="mr-ov" id="mr-ov"><div class="mr-fo" id="mr-fo"></div></div>';
  }
  var cp = function (nome, lista, tipo) { return '<div class="mr-ops">' + lista.map(function (o) { return '<label><input type="' + (tipo || 'radio') + '" name="' + nome + '" value="' + esc(o) + '"><span>' + esc(o) + '</span></label>'; }).join('') + '</div>'; };
  function abrirForm(id) {
    var m = MR.porId(id); if (!m) return; ATUAL = m;
    var C = MR.comuns, extra = (m.pergunta || []).map(function (q) { return '<div class="mr-cp"><span>' + esc(q.r) + '</span>' + (q.tipo === 'opcoes' ? cp('x_' + q.k, q.op) : '<input type="text" name="x_' + q.k + '" maxlength="120" placeholder="' + esc(q.ph || '') + '">') + '</div>'; }).join('');
    $('mr-fo').innerHTML = '<button class="mr-x" type="button" data-mrx aria-label="Fechar">✕</button><span class="mr-pill ' + MR.status(m) + '"><i></i>' + esc(m.quando) + '</span><h3>' + esc(m.nome) + '</h3>'
      + '<div class="sub">' + esc(m.edicao) + '. Leva 1 minuto. O Gediel lê cada inscrição e te chama no WhatsApp.</div>'
      + '<form id="mr-form" novalidate><div class="mr-gr">Seu contato</div>'
      + '<label class="mr-cp"><span>Nome completo</span><input type="text" name="nome" maxlength="120" value="' + esc(EU.nome || '') + '"></label>'
      + '<div class="mr-dois"><label class="mr-cp"><span>WhatsApp com DDD</span><input type="tel" name="whatsapp" maxlength="30" placeholder="(55) 99999-9999"></label><label class="mr-cp"><span>E-mail <em>(opcional)</em></span><input type="email" name="email" maxlength="160" value="' + esc(EU.email || '') + '"></label></div>'
      + '<div class="mr-dois"><label class="mr-cp"><span>Instagram <em>(opcional)</em></span><input type="text" name="instagram" maxlength="80" placeholder="@seuperfil"></label><label class="mr-cp"><span>Cidade</span><input type="text" name="cidade" maxlength="120"></label></div>'
      + '<label class="mr-cp"><span>País onde você mora</span><input type="text" name="pais" maxlength="80" value="Brasil"></label>'
      + '<div class="mr-gr">Seu inglês</div><div class="mr-cp"><span>Seu nível hoje</span>' + cp('nivel', C.nivel) + '</div>'
      + '<div class="mr-cp"><span>Pra que você quer o inglês? <em>(pode marcar mais de um)</em></span>' + cp('objetivo', C.objetivo, 'checkbox') + '</div>' + extra
      + '<div class="mr-gr">Sua rotina</div><div class="mr-cp"><span>Que horário você consegue participar? <em>(mais de um)</em></span>' + cp('turno', C.turno, 'checkbox') + '</div>'
      + '<div class="mr-cp"><span>Qual é o seu momento?</span>' + cp('momento', C.momento) + '</div>'
      + '<label class="mr-cp"><span>Quer contar algo? <em>(opcional)</em></span><textarea name="mensagem" maxlength="1000" placeholder="Seu sonho, sua dificuldade, sua data de viagem…"></textarea></label>'
      + '<div class="mr-er" id="mr-er" role="alert"></div><button class="mr-b1" type="submit" style="width:100%;--cor:var(--accent)">Enviar inscrição</button></form>';
    $('mr-ov').classList.add('on');
  }
  var lerU = function (f, n) { var e = f.querySelector('[name="' + n + '"]:checked'); return e ? e.value : ''; };
  var lerV = function (f, n) { return [].map.call(f.querySelectorAll('[name="' + n + '"]:checked'), function (x) { return x.value; }).join(', '); };
  var cor = function (v, n) { v = String(v || '').trim(); return v ? v.slice(0, n) : null; };
  function gravarM(l) {
    if (!CFG.supabaseUrl || !CFG.supabaseAnonKey) return Promise.reject(new Error('sem config'));
    return fetch(CFG.supabaseUrl.replace(/\/$/, '') + '/rest/v1/maratonas_inscricoes', { method: 'POST', keepalive: true, headers: { apikey: CFG.supabaseAnonKey, Authorization: 'Bearer ' + CFG.supabaseAnonKey, 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: JSON.stringify([l]) }).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-mr]'); if (b) { abrirForm(b.dataset.mr); return; }
    if (e.target.closest && e.target.closest('[data-mrx]') || e.target.id === 'mr-ov') { var o = $('mr-ov'); if (o) o.classList.remove('on'); }
  });
  document.addEventListener('submit', function (e) {
    if (e.target.id !== 'mr-form') return; e.preventDefault();
    var f = e.target, m = ATUAL, er = $('mr-er'), nome = f.nome.value.trim(), tel = f.whatsapp.value.replace(/\D/g, '');
    if (nome.length < 2) { er.textContent = 'Escreva o seu nome.'; return; }
    if (tel.length < 10) { er.textContent = 'Confira o WhatsApp com DDD.'; return; }
    if (f.email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim())) { er.textContent = 'Confira o e-mail.'; return; }
    var momento = lerU(f, 'momento'); if (!momento) { er.textContent = 'Marque qual é o seu momento.'; return; }
    er.textContent = '';
    var resp = {}; (m.pergunta || []).forEach(function (q) { var v = q.tipo === 'opcoes' ? lerU(f, 'x_' + q.k) : (f['x_' + q.k] || {}).value; if (v) resp[q.k] = String(v).slice(0, 200); });
    var linha = { maratona: m.id, nome: cor(nome, 120), whatsapp: cor(tel, 30), email: cor(f.email.value.toLowerCase(), 160), instagram: cor(f.instagram.value.replace(/^@/, ''), 80), cidade: cor(f.cidade.value, 120), pais: cor(f.pais.value, 80),
      nivel: cor(lerU(f, 'nivel'), 60), objetivo: cor(lerV(f, 'objetivo'), 200), turno: cor(lerV(f, 'turno'), 120), momento: cor(momento, 80), temperatura: MR.temperatura(momento), conheceu: 'Já sou aluno(a)',
      respostas: resp, mensagem: cor(f.mensagem.value, 1000), veio_de: 'membros', ja_aluno: true, aceita_contato: true, visitante: null, origem: 'de=membros' };
    var bt = f.querySelector('[type=submit]'); bt.disabled = true; bt.textContent = 'Enviando…';
    var msg = 'Oi Gediel! Acabei de me inscrever na maratona *' + m.nome + '* (' + m.edicao + ', ' + m.quando.toLowerCase() + ').\nNome: ' + nome + (linha.nivel ? '\nNível: ' + linha.nivel : '') + '\nMomento: ' + momento;
    var fim = function (ok) {
      if (ok) { try { localStorage.setItem('ebg:maratona:' + m.id, new Date().toISOString()); } catch (x) {} }
      $('mr-fo').innerHTML = '<div class="mr-ok"><div class="ck">✓</div><h3>' + (ok ? 'Inscrição feita!' : 'Quase lá') + '</h3><div class="sub">' + (ok ? 'Você está na lista da ' + esc(m.nome) + '. O Gediel vai te chamar no WhatsApp.' : 'Não consegui enviar agora. Avise o Gediel pelo WhatsApp pra garantir seu lugar.') + '</div>'
        + '<div class="mr-ac" style="flex-direction:column"><a class="mr-b1" style="--cor:#16a34a" target="_blank" rel="noopener" href="' + esc(zapM(msg)) + '">Avisar o Gediel no WhatsApp</a><button class="mr-b2" type="button" data-mrx>Ver as outras maratonas</button></div></div>';
      renderMaratonasKeep();
    };
    gravarM(linha).then(function () { fim(true); }, function () { fim(false); });
  });
  function renderMaratonasKeep() { var g = document.querySelector('#pane-maratonas .mr-grid'); if (g) g.innerHTML = MR.lista.map(cardM).join(''); }

  var goAnt = window.goTo;
  window.goTo = function (page, el) {
    if (page === 'mt10') {
      if (!EU.dentro && !EU.admin) return;
      sb.auth.getUser().then(function (r) { if (r.data && r.data.user) { lerPlataforma(r.data.user); if (EU.dentro) registrar(); desenhar(); } });
      RK.ciclo = null; desenhar();
    }
    if (page === 'maratonas') renderMaratonas();
    return goAnt.apply(this, arguments);
  };
  var tabAnt = window.adminTab;
  if (tabAnt) window.adminTab = function (tab, btn) {
    if (tab === 'mt10') {
      document.querySelectorAll('.admin-tab').forEach(function (x) { x.classList.remove('active'); });
      document.querySelectorAll('.admin-panel').forEach(function (x) { x.classList.remove('active'); });
      btn.classList.add('active'); $('adm-mt10').classList.add('active'); admCarregar(); return;
    }
    return tabAnt.apply(this, arguments);
  };

  /* ---------- quem sou eu, e se estou na maratona ---------- */
  async function carregar() {
    if (!montar()) return;
    var s = (await sb.auth.getSession()).data.session; if (!s) return;
    var u = s.user, meta = u.user_metadata || {};
    EU.email = String(u.email || '').toLowerCase(); EU.nome = meta.full_name || meta.name || EU.email.split('@')[0];
    var ad = await sb.rpc('sou_admin'); EU.admin = ad.data === true || !!window._isAdmin;
    var r = await sb.from('maratona_membros').select('email').eq('email', EU.email).maybeSingle();
    EU.semTabela = SEM_TABELA(r.error);
    EU.dentro = !!(r.data);
    if (EU.dentro || EU.admin) {
      var pg = await sb.from('maratona_progresso').select('feitos').eq('email', EU.email).maybeSingle();
      var local = {}; try { local = JSON.parse(localStorage.getItem('mt10:' + EU.email) || '{}'); } catch (e) {}
      EU.feitos = Object.assign({}, local, (pg.data && pg.data.feitos) || {});
    }
    $('mt10-nav').style.display = (EU.dentro || EU.admin) ? 'flex' : 'none';
    EU.uid = u.id;
    lerPlataforma(u);
    if (EU.dentro) registrar();
    if (EU.dentro) talvezLargada();
  }

  /* ---------- tela do participante ---------- */
  var chave = function (c, i) { return c.n + '-' + i; };
  function estado(c) { return hojeS > c.ate ? 'feito' : hojeS >= c.de ? 'atual' : 'trancado'; }
  function progresso(feitos, c) {
    var lista = c ? [c] : CIC, tot = 0, ok = 0;
    lista.forEach(function (x) { x.marcos.concat(['entrega']).forEach(function (_, i) { tot++; if (feitos[chave(x, i === x.marcos.length ? 'entrega' : i)]) ok++; }); });
    return tot ? Math.round(ok / tot * 100) : 0;
  }
  /* o que a pessoa já fez na plataforma (mesmo estado que o app guarda: aulas vistas, dias, testes, tutorial) */
  function lerPlataforma(u) {
    var m = ((u && u.user_metadata) || {}).mi || {}, l = {};
    try { l = JSON.parse(localStorage.getItem('mi_estado_' + u.id) || '{}'); } catch (e) {}
    var uni = function (a, b) { var o = {}; (a || []).concat(b || []).forEach(function (x) { o[x] = 1; }); return Object.keys(o); };
    var nv = null; try { nv = localStorage.getItem('userLevel'); } catch (e) {}
    EU.pl = { vistas: uni(m.vistas, l.vistas), dias: uni(m.dias, l.dias), tour: uni(m.tour, l.tour), nivel: m.nivel || l.nivel || nv, prisma: m.prisma || l.prisma, onb: m.onb || l.onb };
  }
  function adaptacao() {
    var P = EU.pl || { vistas: [], tour: [] }, n = M10.adapt.aulas, va = Math.min(n, P.vistas.length);
    var it = [
      { t: 'Fazer um teste: Prisma ou Bússola (você escolhe)', ok: !!(P.prisma || P.nivel), ir: 'prisma' },
      { t: 'Responder as perguntas do seu perfil', ok: !!(P.onb && !P.onb.pulou), ir: 'config' },
      { t: 'Ver o tutorial dos menus', ok: P.tour.length > 0, ir: 'tour' },
      { t: 'Assistir ' + n + ' aulas (' + va + '/' + n + ')', ok: va >= n, ir: 'modulos' }
    ];
    return { itens: it, ok: it.every(function (x) { return x.ok; }) };
  }
  // registra pontos que o app já sabe: dia de hoje e aulas novas
  async function registrar() {
    var ins = function (linhas) { return linhas.length ? sb.from('maratona_eventos').upsert(linhas, { onConflict: 'email,tipo,ref,dia', ignoreDuplicates: true }) : null; };
    await ins([{ email: EU.email, tipo: 'acesso', ref: '' }]);
    var r = await sb.from('maratona_eventos').select('ref').eq('email', EU.email).eq('tipo', 'aula');
    if (r.error) return;
    var ja = {}; (r.data || []).forEach(function (x) { ja[x.ref] = 1; });
    await ins(((EU.pl || {}).vistas || []).filter(function (v) { return !ja[v]; }).slice(0, 200).map(function (v) { return { email: EU.email, tipo: 'aula', ref: String(v) }; }));
  }
  // minutos de jogo: conta enquanto a tela de jogos está aberta e visível
  setInterval(function () {
    var j = $('pane-jogos'); if (!EU.dentro || !j || !j.classList.contains('active') || document.hidden) return;
    var d = new Date(); sb.from('maratona_eventos').upsert({ email: EU.email, tipo: 'jogo', ref: String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') }, { onConflict: 'email,tipo,ref,dia', ignoreDuplicates: true }).then(function () {});
  }, 60000);

  var RK = { ciclo: null, dados: null, erro: '' };
  async function ranking(n) {
    var c = CIC.filter(function (x) { return x.n === n; })[0]; if (!c) return;
    RK.ciclo = n; RK.dados = null; RK.erro = ''; desenhar();
    var r = await sb.rpc('maratona_ranking', { p_ciclo: n, p_de: c.de, p_ate: c.ate });
    if (r.error) RK.erro = SEM_TABELA(r.error) || /function/i.test(r.error.message) ? 'O ranking liga assim que o Gediel rodar o SQL novo no Supabase.' : r.error.message;
    RK.dados = r.data || []; desenhar();
  }
  function htmlRanking() {
    var h = '<div class="mt-tabs">' + CIC.filter(function (c) { return hojeS >= c.de; }).map(function (c) { return '<button data-mt-rk="' + c.n + '"' + (RK.ciclo === c.n ? ' class="on"' : '') + '>Ciclo ' + c.n + '</button>'; }).join('') + '</div>';
    if (RK.erro) return h + '<div class="s">' + esc(RK.erro) + '</div>';
    if (!RK.dados) return h + '<div class="s">Carregando o ranking…</div>';
    if (!RK.dados.length) return h + '<div class="s">Ninguém pontuou ainda neste ciclo. Seja o primeiro!</div>';
    var meuI = -1; RK.dados.forEach(function (x, i) { if (x.email === EU.email) meuI = i; });
    var md = ['🥇', '🥈', '🥉'], linha = function (x, i) { return '<div class="l' + (i === meuI ? ' eu' : '') + '"><span class="pos">' + (md[i] || (i + 1) + 'º') + '</span><span>' + esc(x.nome) + (i === meuI ? ' <b>(você)</b>' : '') + '</span><span class="pts">' + x.pontos + ' pts</span></div>'; };
    h += '<div class="mt-rk">' + RK.dados.slice(0, 15).map(linha).join('') + '</div>';
    if (meuI >= 15) h += '<div class="mt-rk" style="margin-top:8px">' + linha(RK.dados[meuI], meuI) + '</div>';
    if (meuI >= 0) {
      var eu = RK.dados[meuI], frente = meuI > 0 ? RK.dados[meuI - 1].pontos - eu.pontos + 1 : 0;
      h += '<div class="s" style="margin:10px 0 0">' + (meuI === 0 ? '👑 Você está em 1º. Segura!' : 'Faltam <b>' + frente + ' pts</b> pra passar o ' + meuI + 'º lugar. Dá com ' + Math.ceil(frente / 10) + ' aula' + (Math.ceil(frente / 10) > 1 ? 's' : '') + ' assistida' + (Math.ceil(frente / 10) > 1 ? 's' : '') + '.') + '<br>Seus pontos: ' + eu.dias + ' dias · ' + eu.aulas + ' aulas · ' + eu.marcos + ' marcos · ' + eu.entregas + ' entrega · ' + eu.comentarios + ' comentários · ' + eu.quiz + ' acertos · ' + eu.jogos + ' min de jogo · ' + eu.posts + ' posts</div>';
    }
    return h;
  }

  function desenhar() {
    var p = $('pane-mt10'); if (!p) return;
    var ini = d0(M10.inicio), fim = d0(M10.fim), agora = new Date();
    var totalDias = Math.round((fim - ini) / 864e5) + 1, dia = Math.max(0, Math.min(totalDias, Math.floor((agora - ini) / 864e5) + 1));
    var atual = CIC.filter(function (c) { return estado(c) === 'atual'; })[0];
    var falta = atual ? Math.max(0, Math.ceil((d0(atual.ate) - agora) / 864e5)) : 0;
    var AD = adaptacao(), liberado = AD.ok || EU.admin;
    if (RK.ciclo === null && atual) setTimeout(function () { ranking(atual.n); }, 0), RK.ciclo = atual.n;
    var h = '<div class="mt-hero"><small>Turma Fundadora · O Inglês de Cada Dia</small><h2>Maratona 10 meses</h2>'
      + '<p>' + br(M10.inicio) + ' a ' + br(M10.fim) + ' · 5 ciclos de 2 meses. Um passo por dia, com o Gediel e a Mayandra.</p>'
      + '<div class="mt-nums"><div><b>' + dia + '</b><span>dia de ' + totalDias + '</span></div><div><b>' + (atual ? atual.n : 1) + '/5</b><span>ciclo</span></div><div><b>' + progresso(EU.feitos) + '%</b><span>seu progresso</span></div></div>'
      + '<div class="mt-barra" title="Tempo da maratona"><i style="width:' + Math.round(dia / totalDias * 100) + '%"></i></div></div>';
    if (EU.admin && !EU.dentro) h += '<div class="mt-aviso">🛡️ Você está vendo como admin. O aluno entra pelo link de cadastro ou quando você marca em <b>Painel Admin → 🏁 Maratona 10m</b>.' + (EU.semTabela ? ' <b>Falta rodar o SQL da maratona no Supabase dos membros.</b>' : '') + '</div>';

    h += '<div style="text-align:right;margin:-6px 0 12px"><button class="admin-btn admin-btn-ghost admin-btn-sm" onclick="mtLargada()" style="border:0;background:none;color:var(--accent);font-weight:800;cursor:pointer">🏁 Rever a largada</button></div>';
    // como funciona
    h += '<details class="mt-box"' + (AD.ok ? '' : ' open') + '><summary style="cursor:pointer;font-weight:800">📖 Como funciona a maratona</summary><div style="margin-top:10px;font-size:13px;line-height:1.6;color:var(--fg2)">'
      + '<p><b style="color:var(--fg)">1. Adaptação.</b> Primeiro você conhece a plataforma: testes, perfil, tutorial e as primeiras aulas. Isso libera o checklist dos ciclos.</p>'
      + '<p style="margin-top:6px"><b style="color:var(--fg)">2. Ciclos de 2 meses.</b> São 5 ciclos (Casa, Rua, Trabalho, Pessoas e fé, Mundo). Cada um tem 4 marcos e uma entrega. O próximo abre sozinho na data.</p>'
      + '<p style="margin-top:6px"><b style="color:var(--fg)">3. Pontos.</b> Tudo o que você faz aqui vira ponto. No fim de cada ciclo sai o <b style="color:var(--fg)">Top 15</b> e o placar zera: todo ciclo é uma corrida nova.</p>'
      + '<div style="margin-top:10px">' + M10.pontos.map(function (x) { return '<div class="mt-pt"><span>' + x[0] + '</span><span>' + esc(x[1]) + (x[3] ? '<small>' + esc(x[3]) + '</small>' : '') + '</span><b>+' + x[2] + '</b></div>'; }).join('') + '</div>'
      + '<div class="s" style="margin-top:8px">Os tetos por dia existem pra ninguém disparar sozinho: com constância, qualquer um alcança o 1º lugar.</div>'
      + '<div class="mt-premio"><div>🏆 ' + esc(M10.premios.concluir) + '</div><div>❓ ' + esc(M10.premios.primeiro) + '</div></div></div></details>';

    // adaptação
    h += '<div class="mt-box' + (AD.ok ? '' : ' trava') + '"><h3>' + (AD.ok ? '✅ Adaptação concluída' : '🔓 Adaptação: libere o seu checklist') + '</h3><div class="s">' + (AD.ok ? 'Seu checklist dos ciclos está liberado.' : 'Faça os 4 passos. Assim que terminar, os marcos do ciclo abrem.') + '</div>'
      + AD.itens.map(function (x) { return '<div class="mt-ad' + (x.ok ? ' ok' : '') + '"><span class="ck">' + (x.ok ? '✓' : '') + '</span><span class="t">' + esc(x.t) + '</span>' + (x.ok ? '' : '<button data-mt-ir="' + x.ir + '">Fazer</button>') + '</div>'; }).join('') + '</div>';

    if (atual) h += '<div style="font-size:13px;color:var(--fg2);margin:0 2px 10px">Agora: <b style="color:var(--fg)">Ciclo ' + atual.n + ' · ' + esc(atual.nome) + '</b> · faltam ' + falta + ' dias pra fechar o ciclo e sair o Top 15.</div>';
    h += '<div class="mt-ciclos">' + CIC.map(function (c) {
      var st = estado(c), pc = progresso(EU.feitos, c);
      var rot = st === 'atual' ? 'Agora' : st === 'feito' ? (pc === 100 ? 'Concluído' : 'Encerrado · ' + pc + '%') : '🔒 Abre ' + br(c.de).slice(0, 5);
      var cab = '<summary><span class="ic">' + c.icone + '</span><span class="tt"><b>Ciclo ' + c.n + ' · ' + esc(c.nome) + '</b><span>' + br(c.de).slice(0, 5) + ' a ' + br(c.ate) + '</span></span><span class="mt-st ' + st + '">' + rot + '</span></summary>';
      if (st === 'trancado') return '<details class="mt-c trancado" data-tranca>' + cab + '</details>';
      var corpo = !liberado ? '<div class="mt-aviso">🔒 Termine a adaptação pra liberar os marcos deste ciclo.</div>'
        : c.marcos.map(function (m, i) { var k = chave(c, i), ok = !!EU.feitos[k]; return '<label class="mt-item' + (ok ? ' ok' : '') + '"><input type="checkbox" data-mt="' + k + '"' + (ok ? ' checked' : '') + '><span>' + esc(m) + '</span></label>'; }).join('')
          + (function () { var k = chave(c, 'entrega'), ok = !!EU.feitos[k]; return '<label class="mt-item entrega' + (ok ? ' ok' : '') + '"><input type="checkbox" data-mt="' + k + '"' + (ok ? ' checked' : '') + '><span>🎯 Entrega do ciclo: ' + esc(c.entrega) + '</span></label>'; })();
      return '<details class="mt-c ' + st + '"' + (st === 'atual' ? ' open' : '') + '>' + cab + '<div class="mt-in"><div class="foco">' + esc(c.foco) + '</div><div class="pb"><i style="width:' + pc + '%"></i></div>' + corpo + '</div></details>';
    }).join('') + '</div>';

    // ranking + post
    h += '<div class="mt-box" style="margin-top:14px"><h3>🏆 Top 15 do ciclo</h3><div class="s">Atualiza na hora. No fim do ciclo o placar fecha e o próximo começa do zero.</div>' + htmlRanking() + '</div>';
    h += '<div class="mt-box"><h3>📲 Postei sobre a maratona</h3><div class="s">Cole o link do post, reels ou story (Instagram, TikTok…). Vale +20 pts, 1 por dia.</div><div class="mt-post"><input id="mt-link" type="url" placeholder="https://instagram.com/p/…"><button data-mt-post>Ganhar pontos</button></div></div>';

    // outras maratonas: trancadas
    var minha = 'icd-1';
    h += '<div class="mt-box"><h3>Outras maratonas</h3><div class="s">Liberadas só pra quem entra em cada uma.</div><div class="mt-outras">' + MR.lista.filter(function (m) { return m.id !== minha; }).map(function (m) {
      return '<div>🔒 ' + esc(m.icone) + '<b>' + esc(m.nome) + '</b>' + esc(m.edicao) + ' · ' + esc(m.quando) + '</div>'; }).join('') + '</div></div>';
    p.innerHTML = h;
  }
  document.addEventListener('click', async function (e) {
    var t = e.target.closest && e.target.closest('[data-mt-rk],[data-mt-ir],[data-mt-post]'); if (!t) return;
    if (t.dataset.mtRk) return ranking(+t.dataset.mtRk);
    if (t.dataset.mtIr) {
      var ir = t.dataset.mtIr;
      if (ir === 'config') { if (window.miConhecer) window.miConhecer(function () {}); else if (window.openSettings) openSettings(); return; }
      if (ir === 'tour') { if (window.miTour) { goTo('home', document.querySelector('.sidebar .nav-pill')); setTimeout(function () { window.miTour('todos'); }, 500); } return; }
      var pill = document.querySelector('.sidebar .nav-pill[onclick*="\'' + ir + '\'"]'); goTo(ir, pill); return;
    }
    if (t.hasAttribute('data-mt-post')) {
      var v = ($('mt-link').value || '').trim();
      if (!/^https:\/\/[^\s]+\.[^\s]+/.test(v)) { alert('Cole o link do post (começa com https://).'); return; }
      var r = await sb.from('maratona_eventos').insert({ email: EU.email, tipo: 'post', ref: v.slice(0, 300) });
      if (window.toast) toast(r.error ? (/duplicate/i.test(r.error.message) ? 'Esse post já foi contado' : 'Não salvou: ' + r.error.message) : '📲 +20 pts! Post registrado', r.error ? '#ef4444' : '#10b981');
      if (!r.error && RK.ciclo) ranking(RK.ciclo);
    }
  });
  var salvando = null;
  document.addEventListener('change', function (e) {
    var k = e.target.getAttribute && e.target.getAttribute('data-mt'); if (!k) return;
    if (e.target.checked) EU.feitos[k] = true; else delete EU.feitos[k];
    try { localStorage.setItem('mt10:' + EU.email, JSON.stringify(EU.feitos)); } catch (x) {}
    clearTimeout(salvando);
    salvando = setTimeout(function () { sb.from('maratona_progresso').upsert({ email: EU.email, feitos: EU.feitos, updated_at: new Date().toISOString() }).then(function () {}); }, 600);
    desenhar();
  });
  document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('details[data-tranca] > summary')) e.preventDefault(); });

  /* ---------- LARGADA: card de boas-vindas do maratonista (1ª vez) e guia dos primeiros passos ---------- */
  var lgCss = document.createElement('style');
  lgCss.textContent = ''
    + '#mt-lg{position:fixed;inset:0;z-index:9500;background:radial-gradient(ellipse at 20% 0%,#3b4fd8 0%,#1b1f4b 45%,#0b0d1c 100%);color:#fff;display:flex;align-items:center;justify-content:center;padding:20px 20px 100px;overflow-y:auto;opacity:0;transition:opacity .4s}'
    + '#mt-lg.vis{opacity:1}#mt-lg .bx{width:100%;max-width:560px;margin:auto}'
    + '#mt-lg .sl{animation:lgIn .55s cubic-bezier(.22,1,.36,1) both}@keyframes lgIn{from{opacity:0;transform:translateX(40px)}}'
    + '#mt-lg .k{font-size:11px;font-weight:800;letter-spacing:1.6px;text-transform:uppercase;opacity:.65;text-align:center}'
    + '#mt-lg .q{font-size:clamp(24px,5vw,32px);font-weight:800;text-align:center;line-height:1.15;margin:10px 0 8px}'
    + '#mt-lg .q em{font-style:normal;background:linear-gradient(90deg,#fff,#f2c69c);-webkit-background-clip:text;background-clip:text;color:transparent}'
    + '#mt-lg .s{font-size:14px;opacity:.78;text-align:center;line-height:1.55;max-width:440px;margin:0 auto 20px}'
    + '#mt-lg .peito{position:relative;margin:0 auto 22px;width:min(300px,88%);aspect-ratio:1.5;border-radius:22px;background:#fff;color:#1b1f4b;padding:18px;box-shadow:0 30px 80px rgba(0,0,0,.5);transform:rotate(-3deg);animation:lgPeito .9s cubic-bezier(.2,1.4,.4,1) both;display:flex;flex-direction:column;justify-content:center;text-align:center}'
    + '#mt-lg .peito small{font-size:10px;font-weight:800;letter-spacing:2px;color:#8b5cf6}#mt-lg .peito strong{font-size:44px;line-height:1;margin:6px 0;background:linear-gradient(135deg,#4f6ef7,#8b5cf6,#d6965a);-webkit-background-clip:text;background-clip:text;color:transparent}#mt-lg .peito span{font-size:13px;font-weight:800}'
    + '@keyframes lgPeito{from{opacity:0;transform:rotate(-14deg) scale(.6) translateY(60px)}}'
    + '#mt-lg .li{display:grid;gap:8px}#mt-lg .li div{display:flex;gap:12px;align-items:center;background:rgba(255,255,255,.08);border-radius:14px;padding:12px 14px;font-size:13.5px;line-height:1.4;opacity:0;animation:lgUp .5s cubic-bezier(.22,1,.36,1) forwards}'
    + '#mt-lg .li b{width:32px;height:32px;border-radius:10px;background:rgba(255,255,255,.16);display:grid;place-items:center;flex:none;font-size:16px}#mt-lg .li .ok{opacity:.55;text-decoration:line-through}#mt-lg .li i{margin-left:auto;font-style:normal;font-size:11px;font-weight:800;opacity:.7}'
    + '@keyframes lgUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}'
    + '#mt-lg .cic{display:flex;gap:6px;justify-content:center;margin:4px 0 16px}#mt-lg .cic span{flex:1;max-width:92px;text-align:center;padding:10px 4px;border-radius:14px;background:rgba(255,255,255,.08);font-size:11px;font-weight:700;opacity:0;animation:lgUp .5s forwards}#mt-lg .cic span b{display:block;font-size:22px;margin-bottom:4px}'
    + '#mt-lg .pr{display:grid;gap:8px;margin-top:12px}#mt-lg .pr div{padding:12px 14px;border-radius:14px;font-size:13px;font-weight:700;background:linear-gradient(135deg,rgba(214,150,90,.25),rgba(139,92,246,.2))}'
    + '#mt-lg .dots{display:flex;gap:6px;justify-content:center;margin-top:18px}#mt-lg .dots i{width:7px;height:7px;border-radius:99px;background:rgba(255,255,255,.3);transition:width .3s}#mt-lg .dots i.on{width:22px;background:#fff}'
    + '#mt-lg .cta{position:fixed;left:50%;transform:translateX(-50%);bottom:max(18px,env(safe-area-inset-bottom));width:calc(100% - 40px);max-width:520px;background:#fff;color:#1b1f4b;border:0;border-radius:18px;padding:17px;font-size:16px;font-weight:800;cursor:pointer;box-shadow:0 14px 40px rgba(0,0,0,.4)}'
    + '#mt-lg .dep{position:fixed;top:14px;right:16px;background:rgba(255,255,255,.1);border:0;color:#fff;border-radius:99px;padding:8px 14px;font-size:12px;font-weight:700;cursor:pointer}'
    + '.mt-guia{position:fixed;left:50%;transform:translateX(-50%);bottom:84px;z-index:800;background:linear-gradient(135deg,#1b1f4b,#4f6ef7);color:#fff;border-radius:18px;padding:12px 14px;display:flex;align-items:center;gap:12px;box-shadow:0 14px 40px rgba(27,31,75,.4);width:calc(100% - 28px);max-width:520px;animation:lgUp .5s both}'
    + '.mt-guia b{font-size:13px;display:block}.mt-guia small{font-size:11.5px;opacity:.8}.mt-guia button{margin-left:auto;border:0;border-radius:99px;padding:9px 14px;font-weight:800;font-size:12.5px;background:#fff;color:#1b1f4b;cursor:pointer;white-space:nowrap}.mt-guia .x{background:none;color:#fff;padding:4px;margin-left:0;opacity:.6}';
  document.head.appendChild(lgCss);
  var PASSOS = [
    { k: 'perfil', ic: '📝', t: 'Perguntas do seu perfil', ok: function (P) { return !!(P.onb && !P.onb.pulou); } },
    { k: 'tour', ic: '🗺️', t: 'Tour pelos menus da plataforma', ok: function (P) { return P.tour.length > 0; } },
    { k: 'prisma', ic: '🔷', t: 'Um teste: Prisma (talentos) ou Bússola (nível)', ok: function (P) { return !!(P.prisma || P.nivel); } },
    { k: 'modulos', ic: '🎬', t: 'Assistir as 5 primeiras aulas', ok: function (P) { return P.vistas.length >= M10.adapt.aulas; } }
  ];
  var vistaK = function () { return 'mt10:largada-vista:' + EU.email; };
  function ocupado() { return ['mi-entry', 'mi-onb', 'mi-tour', 'login-screen'].some(function (id) { var e = $(id); return e && (e.classList.contains('on') || (id === 'login-screen' && getComputedStyle(e).display !== 'none')); }); }
  function talvezLargada() {
    var vista = false; try { vista = !!localStorage.getItem(vistaK()); } catch (e) {}
    if (!vista) { var t = setInterval(function () { if (!ocupado()) { clearInterval(t); setTimeout(function () { if (!ocupado()) largada(0); else talvezLargada(); }, 700); } }, 800); }
    else guiaBarra();
  }
  function largada(n) {
    var el = $('mt-lg'); if (!el) { el = document.createElement('div'); el.id = 'mt-lg'; document.body.appendChild(el); requestAnimationFrame(function () { el.classList.add('vis'); }); }
    var P = EU.pl || { vistas: [], tour: [] }, nome = (EU.nome || '').split(' ')[0], h = '', bt = '';
    if (n === 0) {
      h = '<div class="peito"><small>MARATONA 10 MESES</small><strong>🏁</strong><span>' + esc(EU.nome) + '</span><span style="font-size:11px;opacity:.6;font-weight:600">Turma Fundadora</span></div>'
        + '<div class="k">Largada</div><h1 class="q">Bem-vindo(a) à <em>maratona</em>, ' + esc(nome) + '!</h1>'
        + '<p class="s">São 10 meses com o Gediel e a Mayandra, com o inglês dentro da sua rotina. Esta área é exclusiva de quem está na maratona.</p>'
        + '<div class="pr"><div>🏆 ' + esc(M10.premios.concluir) + '</div><div>❓ ' + esc(M10.premios.primeiro) + '</div></div>';
      bt = 'Como funciona →';
    } else if (n === 1) {
      h = '<div class="k">Como funciona</div><h1 class="q">5 ciclos, <em>um passo por dia</em></h1><p class="s">Cada ciclo dura 2 meses, tem 4 marcos e uma entrega. No fim de cada um sai o Top 15 e o placar zera.</p>'
        + '<div class="cic">' + CIC.map(function (c, j) { return '<span style="animation-delay:' + (j * .08) + 's"><b>' + c.icone + '</b>' + esc(c.nome) + '</span>'; }).join('') + '</div>'
        + '<div class="li">' + M10.pontos.slice(0, 5).map(function (x, j) { return '<div style="animation-delay:' + (.3 + j * .06) + 's"><b>' + x[0] + '</b>' + esc(x[1]) + '<i>+' + x[2] + '</i></div>'; }).join('') + '</div>'
        + '<p class="s" style="margin-top:12px">Tem teto por dia: com constância, qualquer um alcança o 1º lugar.</p>';
      bt = 'Meu roteiro de largada →';
    } else {
      h = '<div class="k">Seu roteiro</div><h1 class="q">Antes de correr, <em>conheça a pista</em></h1><p class="s">4 passos, na ordem. Eu te levo em cada um. Quando terminar, o checklist dos ciclos abre.</p>'
        + '<div class="li">' + PASSOS.map(function (x, j) { var ok = x.ok(P); return '<div style="animation-delay:' + (j * .08) + 's"><b>' + (ok ? '✓' : x.ic) + '</b><span class="' + (ok ? 'ok' : '') + '">' + (j + 1) + '. ' + esc(x.t) + '</span>' + (x.k === 'modulos' ? '<i>' + Math.min(P.vistas.length, M10.adapt.aulas) + '/' + M10.adapt.aulas + '</i>' : '') + '</div>'; }).join('') + '</div>';
      bt = 'Começar o passo 1 🚀';
    }
    el.innerHTML = '<button class="dep" data-lg="depois">Depois</button><div class="bx"><div class="sl">' + h + '</div><div class="dots">' + [0, 1, 2].map(function (j) { return '<i class="' + (j === n ? 'on' : '') + '"></i>'; }).join('') + '</div></div><button class="cta" data-lg="' + (n < 2 ? 'prox:' + (n + 1) : 'ir') + '">' + bt + '</button>';
    el.scrollTop = 0;
    if (n === 0) confeteLg();
  }
  function fecharLg() { var el = $('mt-lg'); if (!el) return; el.classList.remove('vis'); setTimeout(function () { el.remove(); }, 400); try { localStorage.setItem(vistaK(), '1'); } catch (e) {} }
  function confeteLg() { var cores = ['#fff', '#f2c69c', '#8b5cf6', '#4f6ef7', '#10b981']; for (var j = 0; j < 60; j++) { var x = document.createElement('i'); x.style.cssText = 'position:fixed;top:-20px;z-index:9600;width:9px;height:14px;border-radius:2px;pointer-events:none;left:' + Math.random() * 100 + '%;background:' + cores[j % 5] + ';transition:transform ' + (2 + Math.random() * 2) + 's linear;'; document.body.appendChild(x); (function (x) { requestAnimationFrame(function () { requestAnimationFrame(function () { x.style.transform = 'translateY(110vh) rotate(720deg)'; }); }); setTimeout(function () { x.remove(); }, 4500); })(x); } }
  // guia: leva a pessoa no próximo passo que falta
  function proximo() { var P = EU.pl || { vistas: [], tour: [] }; return PASSOS.filter(function (x) { return !x.ok(P); })[0]; }
  function guiar() {
    sb.auth.getUser().then(function (r) {
      if (r.data && r.data.user) lerPlataforma(r.data.user);
      var p = proximo(); guiaBarra();
      if (!p) { goTo('mt10', $('mt10-nav')); if (window.toast) toast('🎉 Adaptação concluída! Seu checklist abriu.', '#10b981'); return; }
      if (p.k === 'perfil' && window.miConhecer) return window.miConhecer(function () { setTimeout(guiar, 600); });
      if (p.k === 'tour' && window.miTour) { goTo('home', document.querySelector('.sidebar .nav-pill')); return setTimeout(function () { window.miTour('todos'); }, 500); }
      var pill = document.querySelector('.sidebar .nav-pill[onclick*="\'' + p.k + '\'"]'); goTo(p.k, pill);
    });
  }
  function guiaBarra() {
    var g = $('mt-guia'); if (g) g.remove();
    return; // barra flutuante desligada: atrapalhava a navegação (o roteiro fica no menu 🏁 Maratona)
    var p = proximo(); if (!p || !EU.dentro) return;
    try { if (sessionStorage.getItem('mt-guia-x')) return; } catch (e) {}
    var feitos = PASSOS.length - PASSOS.filter(function (x) { return !x.ok(EU.pl); }).length;
    g = document.createElement('div'); g.className = 'mt-guia'; g.id = 'mt-guia';
    g.innerHTML = '<span style="font-size:24px">' + p.ic + '</span><span><b>Largada · passo ' + (feitos + 1) + ' de ' + PASSOS.length + '</b><small>' + esc(p.t) + '</small></span><button data-lg="guiar">Fazer agora</button><button class="x" data-lg="xguia" aria-label="Esconder">✕</button>';
    document.body.appendChild(g);
  }
  window.mtLargada = function () { largada(0); };
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-lg]'); if (!b) return;
    var a = b.getAttribute('data-lg');
    if (a.indexOf('prox:') === 0) return largada(+a.split(':')[1]);
    if (a === 'depois') { fecharLg(); guiaBarra(); return; }
    if (a === 'ir') { fecharLg(); return guiar(); }
    if (a === 'guiar') return guiar();
    if (a === 'xguia') { try { sessionStorage.setItem('mt-guia-x', '1'); } catch (x) {} var g = $('mt-guia'); if (g) g.remove(); }
  });

  /* ---------- Painel Admin: escolher quem entra ---------- */
  var ADM = { users: [], dentro: {}, prog: {}, busca: '' };
  async function admCarregar() {
    var el = $('adm-mt10'); el.innerHTML = '<div class="admin-loading">Carregando alunos...</div>';
    try {
      var res = await admFetch('/auth/v1/admin/users?page=1&per_page=1000', {});
      var data = await res.json();
      ADM.users = (data.users || []).sort(function (a, b) { return (a.email || '').localeCompare(b.email || ''); });
      var r = await sb.from('maratona_membros').select('email,nome,created_at');
      if (SEM_TABELA(r.error)) { el.innerHTML = '<div class="admin-loading" style="color:var(--red)">Falta criar a lista da maratona: rode <b>supabase/maratona-membros.sql</b> (ou o PENDENTE-RODAR.sql) no SQL Editor do Supabase dos membros e volte aqui.</div>'; return; }
      ADM.dentro = {}; (r.data || []).forEach(function (x) { ADM.dentro[x.email.toLowerCase()] = x; });
      var pg = await sb.from('maratona_progresso').select('email,feitos');
      ADM.prog = {}; (pg.data || []).forEach(function (x) { ADM.prog[x.email.toLowerCase()] = x.feitos || {}; });
      var cv = await sb.from('maratona_convites').select('codigo,ativo').eq('turma', 'icd-1').eq('ativo', true).limit(1);
      ADM.convite = cv.data && cv.data[0] ? cv.data[0].codigo : '';
      admDesenhar();
    } catch (e) { el.innerHTML = '<div class="admin-loading" style="color:var(--red)">Erro ao carregar: ' + esc(e.message) + '</div>'; }
  }
  function admDesenhar() {
    var el = $('adm-mt10'), n = Object.keys(ADM.dentro).length, vagas = (MR.porId('icd-1') || {}).vagas || 15;
    var b = ADM.busca.toLowerCase();
    var lista = ADM.users.filter(function (u) { var m = u.user_metadata || {}; return !b || ((u.email || '') + ' ' + (m.full_name || m.name || '')).toLowerCase().indexOf(b) >= 0; });
    lista.sort(function (x, y) { return (ADM.dentro[(y.email || '').toLowerCase()] ? 1 : 0) - (ADM.dentro[(x.email || '').toLowerCase()] ? 1 : 0); });
    var link = ADM.convite ? location.origin + '/maratona-entrar.html?c=' + ADM.convite : '';
    var caixaLink = '<div style="background:var(--surface2);border-radius:14px;padding:14px;margin-bottom:16px"><div style="font-size:13px;font-weight:800;margin-bottom:4px">🔗 Link de cadastro automático (mande no grupo dos maratonistas)</div>'
      + '<div style="font-size:12px;color:var(--fg2);margin-bottom:10px">Quem abrir cria a própria conta já no Plano Inteligente e já dentro da Maratona 10 meses. Quem já tem conta só ganha a maratona (a senha continua a mesma).</div>'
      + (link ? '<div style="display:flex;gap:8px;flex-wrap:wrap"><input readonly value="' + esc(link) + '" style="flex:1;min-width:220px;padding:9px 12px;border-radius:10px;border:1px solid var(--border);background:var(--surface);color:var(--fg)"><button class="admin-btn admin-btn-primary admin-btn-sm" data-mt-copiar="' + esc(link) + '">Copiar</button><button class="admin-btn admin-btn-ghost admin-btn-sm" data-mt-novo>Trocar link</button><button class="admin-btn admin-btn-ghost admin-btn-sm" data-mt-off>Desligar</button></div>'
        : '<button class="admin-btn admin-btn-primary admin-btn-sm" data-mt-novo>Gerar link</button>') + '</div>';
    el.innerHTML = caixaLink + '<div style="font-size:13px;color:var(--fg2);margin-bottom:12px">Escolha à mão quem está na <b style="color:var(--fg)">Maratona 10 meses · Turma Fundadora</b>. Só quem estiver marcado vê o menu 🏁 com os 5 ciclos.</div>'
      + '<div class="mt-adm-top"><span class="mt-conta">' + n + ' de ' + vagas + ' vagas</span><input id="mt-busca" type="search" placeholder="Buscar aluno por nome ou e-mail" value="' + esc(ADM.busca) + '"><button class="admin-btn admin-btn-ghost admin-btn-sm" id="mt-recarregar">🔄 Atualizar</button></div>'
      + '<div style="overflow-x:auto"><table class="admin-table"><thead><tr><th>Aluno</th><th>Progresso</th><th>Na maratona</th></tr></thead><tbody>'
      + lista.map(function (u) {
        var m = u.user_metadata || {}, em = (u.email || '').toLowerCase(), on = !!ADM.dentro[em];
        var pc = on ? progresso(ADM.prog[em] || {}) : 0;
        return '<tr><td><div class="admin-user-name">' + esc(m.full_name || m.name || em.split('@')[0]) + '</div><div class="admin-user-email">' + esc(em) + '</div></td>'
          + '<td style="font-size:12px;color:var(--fg2)">' + (on ? '<span class="mt-mini"><i style="width:' + pc + '%"></i></span>' + pc + '%' : '—') + '</td>'
          + '<td><button class="mt-tg ' + (on ? 'on' : 'off') + '" data-mt-tg="' + esc(em) + '" data-mt-nome="' + esc(m.full_name || m.name || '') + '">' + (on ? '✓ Participando' : '+ Incluir') + '</button></td></tr>';
      }).join('') + '</tbody></table></div>'
      + (lista.length ? '' : '<div class="admin-loading">Ninguém com essa busca.</div>');
  }
  document.addEventListener('input', function (e) { if (e.target.id === 'mt-busca') { ADM.busca = e.target.value; var pos = e.target.selectionStart; admDesenhar(); var i = $('mt-busca'); i.focus(); try { i.setSelectionRange(pos, pos); } catch (x) {} } });
  document.addEventListener('click', async function (e) {
    if (e.target.id === 'mt-recarregar') { admCarregar(); return; }
    var cp = e.target.closest && e.target.closest('[data-mt-copiar]');
    if (cp) { try { await navigator.clipboard.writeText(cp.dataset.mtCopiar); if (typeof toast === 'function') toast('🔗 Link copiado', '#10b981'); } catch (x) { prompt('Copie o link:', cp.dataset.mtCopiar); } return; }
    if (e.target.closest && e.target.closest('[data-mt-off]')) { if (!confirm('Desligar o link? Quem tentar usar vai ver "link inativo".')) return; await sb.from('maratona_convites').update({ ativo: false }).eq('turma', 'icd-1'); ADM.convite = ''; admDesenhar(); return; }
    if (e.target.closest && e.target.closest('[data-mt-novo]')) {
      var cod = 'mt-' + Array.from(crypto.getRandomValues(new Uint8Array(9))).map(function (b) { return 'abcdefghjkmnpqrstuvwxyz23456789'[b % 31]; }).join('');
      await sb.from('maratona_convites').update({ ativo: false }).eq('turma', 'icd-1');
      var rr = await sb.from('maratona_convites').insert({ codigo: cod, turma: 'icd-1', plano: 'Plano Inteligente' });
      if (rr.error) { alert('Não consegui gerar: ' + rr.error.message + (SEM_TABELA(rr.error) ? ' (rode o SQL da maratona no Supabase dos membros)' : '')); return; }
      ADM.convite = cod; admDesenhar(); return;
    }
    var t = e.target.closest && e.target.closest('[data-mt-tg]'); if (!t) return;
    var em = t.getAttribute('data-mt-tg'), on = !!ADM.dentro[em], r;
    t.disabled = true;
    if (on) {
      if (!confirm('Tirar ' + em + ' da Maratona 10 meses? O menu some pra essa pessoa (o progresso fica guardado).')) { t.disabled = false; return; }
      r = await sb.from('maratona_membros').delete().eq('email', em);
      if (!r.error) delete ADM.dentro[em];
    } else {
      r = await sb.from('maratona_membros').upsert({ email: em, nome: t.getAttribute('data-mt-nome') || null, turma: 'icd-1' });
      if (!r.error) ADM.dentro[em] = { email: em };
      // incluir na maratona também libera o Programa (1º produto da lista do Programa)
      if (!r.error) { var cfg = ((window.EBG_ACESSO || {}).estado || {}).cfg || {}; await sb.from('compras').upsert({ pedido: 'maratona-programa-' + em, email: em, produto: (cfg.programa || [])[0] || 'Inglês de Cada Dia' }); }
    }
    if (r.error) { alert('Não consegui salvar: ' + r.error.message); t.disabled = false; return; }
    if (typeof toast === 'function') toast(on ? 'Saiu da maratona' : '🏁 Entrou na Maratona 10 meses', on ? '#6b7280' : '#10b981');
    if (em === EU.email) { EU.dentro = !on; carregar(); }
    admDesenhar();
  });

  sb.auth.onAuthStateChange(function (ev, s) {
    if (s && (ev === 'SIGNED_IN' || ev === 'INITIAL_SESSION')) setTimeout(carregar, 300);
    if (ev === 'SIGNED_OUT') { EU.dentro = false; EU.admin = false; var n = $('mt10-nav'); if (n) n.style.display = 'none'; }
  });
  /* resumo pro painel lateral do app: posição no ciclo atual (null se a pessoa não está na maratona) */
  window.EBG_MARATONA = {
    async resumo() {
      try {
        if (!EU.dentro) return null;
        var c = CIC.filter(function (x) { return estado(x) === 'atual'; })[0] || CIC.filter(function (x) { return estado(x) === 'feito'; }).pop();
        if (!c) return null;
        var r = await sb.rpc('maratona_ranking', { p_ciclo: c.n, p_de: c.de, p_ate: c.ate });
        if (r.error || !r.data) return { ciclo: c.n, pos: 0, total: 0, pts: 0, prog: progresso(EU.feitos || {}, null) };
        var meu = -1; r.data.forEach(function (x, k) { if (x.email === EU.email) meu = k; });
        return { ciclo: c.n, pos: meu + 1, total: r.data.length, pts: meu >= 0 ? r.data[meu].pontos : 0,
                 falta: meu > 0 ? r.data[meu - 1].pontos - r.data[meu].pontos + 1 : 0, prog: progresso(EU.feitos || {}, null) };
      } catch (e) { return null; }
    }
  };
  montar();
})();
