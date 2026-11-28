/* FOTO DE PERFIL OBRIGATÓRIA
   Todo aluno (já logado ou novo) precisa ter uma foto de rosto humano. Sem ela, uma tela bloqueia a plataforma.
   - O navegador procura rosto na foto (detector tiny face, arquivos em /vendor/face). Sem rosto, ou com várias pessoas, não passa.
   - Se o detector não carregar (internet fraca), a foto entra como "pendente" para o professor conferir.
   - O professor pode reprovar qualquer foto (anime, paisagem, logo...): o aluno é bloqueado de novo até trocar.
   Se a tabela mi_perfis ainda não existe (SQL não rodado), NÃO bloqueia ninguém. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (x) { return String(x == null ? '' : x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var LS = { g: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, s: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  var U = null, perfil = null, aberto = false, obrig = false, cand = null, ultimo = 0, lib = null, ultSrc = null, recusada = false;

  var css = document.createElement('style');
  css.textContent =
    '#fo-gate{position:fixed;inset:0;z-index:10010;display:none;align-items:center;justify-content:center;padding:max(16px,env(safe-area-inset-top,0px)) max(16px,env(safe-area-inset-right,0px)) max(16px,env(safe-area-inset-bottom,0px)) max(16px,env(safe-area-inset-left,0px));background:var(--bg);overflow:auto}' +
    '#fo-gate.on{display:flex}body.fo-trava{overflow:hidden}' +
    '#fo-gate .c{width:min(440px,100%);background:var(--surface);border:1px solid var(--border);border-radius:22px;padding:24px 22px;display:flex;flex-direction:column;gap:14px;box-shadow:0 18px 50px rgba(0,0,0,.14)}' +
    '#fo-gate h2{font-size:21px;font-weight:800;line-height:1.2}#fo-gate p{font-size:14px;color:var(--fg2);line-height:1.5}' +
    '#fo-gate .reg{display:grid;gap:6px;font-size:13.5px}#fo-gate .reg span{display:flex;gap:8px;align-items:flex-start}' +
    '#fo-gate .av{width:168px;height:168px;border-radius:50%;margin:0 auto;background:var(--surface2);border:3px dashed var(--border);display:flex;align-items:center;justify-content:center;font-size:56px;overflow:hidden}' +
    '#fo-gate .av.tem{border-style:solid;border-color:var(--accent)}#fo-gate .av img{width:100%;height:100%;object-fit:cover}' +
    '#fo-gate .msg{min-height:20px;text-align:center;font-size:13.5px;font-weight:700}#fo-gate .msg.er{color:#ef4444}#fo-gate .msg.ok{color:#10b981}#fo-gate .msg.mot{background:rgba(239,68,68,.1);border-radius:12px;padding:10px 12px;color:#ef4444}' +
    '.fo-b{border:0;border-radius:14px;padding:13px 16px;font:inherit;font-weight:800;font-size:14.5px;cursor:pointer;background:var(--accent);color:#fff;transition:transform .15s,box-shadow .15s}.fo-b:hover{transform:translateY(-1px);box-shadow:0 8px 20px rgba(0,0,0,.14)}' +
    '.fo-b.s{background:var(--surface2);color:var(--fg)}.fo-b:disabled{opacity:.5;cursor:default;transform:none;box-shadow:none}' +
    '#fo-gate .sair{background:none;border:0;color:var(--fg2);font:inherit;font-size:12.5px;cursor:pointer;text-decoration:underline;align-self:center}' +
    '#fo-rev{position:fixed;inset:0;z-index:10020;display:none;background:rgba(0,0,0,.45);align-items:flex-start;justify-content:center;padding:20px 12px;overflow:auto}#fo-rev.on{display:flex}' +
    '#fo-rev .c{width:min(760px,100%);background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:18px;display:flex;flex-direction:column;gap:14px}' +
    '#fo-rev .g{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}' +
    '#fo-rev .it{background:var(--surface2);border-radius:16px;padding:12px;display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center;font-size:12.5px;transition:transform .15s,box-shadow .15s}#fo-rev .it:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(0,0,0,.12)}' +
    '#fo-rev .it img{width:92px;height:92px;border-radius:50%;object-fit:cover}#fo-rev .it b{font-size:13px;word-break:break-word}#fo-rev .st{font-weight:800;font-size:11.5px;border-radius:99px;padding:2px 9px}' +
    '#fo-rev .st.ok{background:rgba(16,185,129,.15);color:#10b981}#fo-rev .st.pendente{background:rgba(245,158,11,.18);color:#d97706}#fo-rev .st.rejeitada{background:rgba(239,68,68,.15);color:#ef4444}' +
    '#fo-rev .it .fo-b{padding:7px 12px;font-size:12.5px;border-radius:10px}';
  document.head.appendChild(css);

  var gate = document.createElement('div'); gate.id = 'fo-gate'; gate.setAttribute('role', 'dialog'); gate.setAttribute('aria-modal', 'true'); document.body.appendChild(gate);
  var rev = document.createElement('div'); rev.id = 'fo-rev'; document.body.appendChild(rev);

  /* ───────── detector de rosto ───────── */
  function carregarScript(src) {
    return new Promise(function (ok, no) { var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = function () { no(new Error('script')); }; document.head.appendChild(s); });
  }
  function detector() {
    if (lib) return lib;
    var tempo = new Promise(function (_, no) { setTimeout(function () { no(new Error('tempo')); }, 25000); });
    lib = Promise.race([(async function () {
      if (!window.faceapi) await carregarScript('vendor/face/face-api.js?v=1');
      await faceapi.nets.tinyFaceDetector.loadFromUri('vendor/face');
      return faceapi;
    })(), tempo]).catch(function (e) { lib = null; throw e; });
    return lib;
  }
  /* devolve {ok, caixa} | {ok:false, motivo} | {indisponivel:true} */
  async function procurarRosto(img) {
    var f; try { await detector(); f = window.faceapi; } catch (e) { return { indisponivel: true }; }
    var m = 640, k = Math.min(1, m / Math.max(img.naturalWidth, img.naturalHeight));
    var c = document.createElement('canvas'); c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    var lim = function (p) { return Promise.race([p, new Promise(function (_, no) { setTimeout(function () { no(new Error('tempo')); }, 20000); })]); };
    var r; try {
      r = await lim(f.detectAllFaces(c, new f.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.4 })));
      if (!r.length) r = await lim(f.detectAllFaces(c, new f.TinyFaceDetectorOptions({ inputSize: 608, scoreThreshold: 0.2 })));   // 2ª chance, mais tolerante
    } catch (e) { return { indisponivel: true }; }
    if (!r.length) return { ok: false, motivo: 'Não achei um rosto nessa foto. Use uma foto sua, de frente, com boa luz (nada de desenho, anime, paisagem ou logo).' };
    if (r.length > 1) return { ok: false, motivo: 'Tem mais de uma pessoa na foto. Use uma foto só sua.' };
    var b = r[0].box, lado = Math.min(c.width, c.height);
    if (b.width < lado * 0.1) return { ok: false, motivo: 'O rosto está muito pequeno. Chegue mais perto da câmera.' };
    return { ok: true, caixa: { x: b.x / k, y: b.y / k, w: b.width / k, h: b.height / k } };
  }
  /* recorta em quadrado 320x320 centrado no rosto (ou no meio da foto) e comprime */
  function recortar(img, caixa) {
    var W = img.naturalWidth, H = img.naturalHeight, lado, cx, cy;
    if (caixa) { cx = caixa.x + caixa.w / 2; cy = caixa.y + caixa.h / 2; lado = Math.min(Math.max(caixa.w, caixa.h) * 2.3, Math.min(W, H)); }
    else { cx = W / 2; cy = H / 2; lado = Math.min(W, H); }
    var sx = Math.max(0, Math.min(W - lado, cx - lado / 2)), sy = Math.max(0, Math.min(H - lado, cy - lado / 2));
    var c = document.createElement('canvas'); c.width = c.height = 320;
    c.getContext('2d').drawImage(img, sx, sy, lado, lado, 0, 0, 320, 320);
    return c.toDataURL('image/jpeg', 0.82);
  }
  function lerImagem(src) {
    return new Promise(function (ok, no) { var i = new Image(); i.onload = function () { ok(i); }; i.onerror = function () { no(new Error('img')); }; i.src = src; });
  }
  function lerArquivo(f) {
    return new Promise(function (ok, no) { var r = new FileReader(); r.onload = function () { ok(r.result); }; r.onerror = no; r.readAsDataURL(f); });
  }

  /* ───────── tela ───────── */
  function avatarAtual() {
    var m = (U && U.user_metadata) || {}; return perfil && perfil.foto ? perfil.foto : (m.avatar_url || '');
  }
  function desenhar(msg, cls) {
    var temAtual = avatarAtual();
    var mot = perfil && perfil.status === 'rejeitada' ? '<div class="msg mot">Sua foto anterior foi reprovada' + (perfil.motivo ? ': ' + esc(perfil.motivo) : '') + '. Envie uma foto do seu rosto.</div>' : '';
    gate.innerHTML = '<div class="c">' +
      '<div><h2>' + (obrig ? '📸 Coloque sua foto de perfil' : '📸 Trocar foto de perfil') + '</h2>' +
      '<p>' + (obrig ? 'Para continuar, precisamos ver quem você é. A comunidade e as mentorias ficam mais próximas com rostos de verdade.' : 'Escolha uma nova foto do seu rosto.') + '</p></div>' + mot +
      '<div class="reg"><span>✅ Foto do seu rosto, de frente, com boa luz</span><span>✅ Só você na foto</span><span>🚫 Sem anime, desenho, paisagem, logo ou foto de grupo</span></div>' +
      '<div class="av' + (cand ? ' tem' : '') + '" id="fo-av">' + (cand ? '<img src="' + cand.foto + '" alt="Prévia">' : '🙂') + '</div>' +
      '<div class="msg ' + (cls || '') + '" id="fo-msg" aria-live="polite">' + (msg || '') + '</div>' +
      '<input type="file" id="fo-file" accept="image/*" capture="user" style="display:none">' +
      '<input type="file" id="fo-file2" accept="image/*" style="display:none">' +
      (cand ? '<button type="button" class="fo-b" data-fo="salvar">✅ Usar esta foto</button>' : '') +
      '<button type="button" class="fo-b' + (cand ? ' s' : '') + '" data-fo="selfie">📷 Tirar uma selfie</button>' +
      '<button type="button" class="fo-b s" data-fo="galeria">🖼️ Escolher da galeria</button>' +
      (recusada && !cand && ultSrc ? '<button type="button" class="fo-b s" data-fo="manual">👤 É o meu rosto de verdade: enviar para o professor conferir</button>' : '') +
      (temAtual && !cand ? '<button type="button" class="fo-b s" data-fo="atual">Usar a foto que já tenho</button>' : '') +
      (obrig ? '<button type="button" class="fo-b s" data-fo="pular">⏭️ Pular por agora</button><button type="button" class="sair" data-fo="sair">Sair da conta</button>' : '<button type="button" class="fo-b s" data-fo="fechar">← Voltar</button>') +
      '</div>';
  }
  function abrir(obrigatorio) {
    obrig = !!obrigatorio; cand = null; aberto = true; desenhar();
    gate.classList.add('on'); document.body.classList.add('fo-trava');
  }
  function fechar() { aberto = false; gate.classList.remove('on'); document.body.classList.remove('fo-trava'); }
  function msg(t, c) { var m = $('fo-msg'); if (m) { m.className = 'msg ' + (c || ''); m.textContent = t; } }

  async function analisar(src) {
    ultSrc = src; recusada = false;
    msg('🔎 Conferindo sua foto…');
    var b = gate.querySelectorAll('.fo-b'); [].forEach.call(b, function (x) { x.disabled = true; });
    try {
      var img = await lerImagem(src), r = await procurarRosto(img);
      if (r.ok === false) { cand = null; recusada = true; desenhar(r.motivo, 'er'); return; }
      var foto = recortar(img, r.caixa || null);
      cand = { foto: foto, status: r.indisponivel ? 'pendente' : 'ok' };
      desenhar(r.indisponivel ? 'Não consegui conferir agora. Sua foto vai para o professor aprovar, mas você já pode entrar.' : '✅ Rosto encontrado!', r.indisponivel ? '' : 'ok');
    } catch (e) { cand = null; desenhar('Não consegui abrir essa imagem. Tente outra foto.', 'er'); }
  }

  async function salvar() {
    if (!cand || !U || !window._sb) return;
    var nome = (U.user_metadata && (U.user_metadata.full_name || U.user_metadata.name)) || (U.email || '').split('@')[0];
    var linha = { user_id: U.id, nome: nome, foto: cand.foto, status: cand.status, motivo: null, atualizado: new Date().toISOString() };
    msg('Salvando…');
    var r = await _sb.from('mi_perfis').upsert(linha, { onConflict: 'user_id' });
    if (r.error) { msg('Não deu para salvar: ' + (r.error.message || 'erro') , 'er'); return; }
    perfil = linha; LS.s('mi_foto_' + U.id, '1');
    try { await _sb.auth.updateUser({ data: { avatar_url: cand.foto } }); } catch (e) {}
    if (U.user_metadata) U.user_metadata.avatar_url = cand.foto;
    var av = $('sidebar-ava'); if (av) av.innerHTML = '<img src="' + cand.foto + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%" alt="">';
    if (window.profile) { profile.photoUrl = cand.foto; if (window.updateAva) updateAva(); }
    fechar(); if (window.toast) toast('✅ Foto de perfil salva!', '#10b981');
    if (window.EBG_FEED && EBG_FEED.recarregar) EBG_FEED.recarregar();
  }

  gate.addEventListener('click', function (e) {
    var t = e.target.closest('[data-fo]'); if (!t) return;
    var a = t.dataset.fo;
    if (a === 'selfie') $('fo-file').click();
    else if (a === 'galeria') $('fo-file2').click();
    else if (a === 'atual') analisar(avatarAtual());
    else if (a === 'salvar') salvar();
    else if (a === 'manual') { lerImagem(ultSrc).then(function (img) { cand = { foto: recortar(img, null), status: 'pendente' }; recusada = false; desenhar('Sua foto vai para o professor aprovar. Você já pode entrar.', ''); }); }
    else if (a === 'fechar') fechar();
    else if (a === 'pular') { try { sessionStorage.setItem('mi_foto_pulou', '1'); } catch (e) {} fechar(); }
    else if (a === 'sair') { if (window.confirmLogout) confirmLogout(); else if (window._sb) _sb.auth.signOut(); }
  });
  gate.addEventListener('change', function (e) {
    if (e.target.id !== 'fo-file' && e.target.id !== 'fo-file2') return;
    var f = e.target.files && e.target.files[0]; if (!f) return;
    if (!/^image\//.test(f.type)) return msg('Escolha uma imagem.', 'er');
    lerArquivo(f).then(analisar);
  });

  /* ───────── checagem de quem está logado ───────── */
  async function checar(forca) {
    if (!window._sb || !_sb.auth) return;
    if (!forca && Date.now() - ultimo < 60000) return; ultimo = Date.now();
    var s; try { s = (await _sb.auth.getSession()).data.session; } catch (e) { return; }
    if (!s) { U = null; return; }
    if (!U || U.id !== s.user.id) { U = s.user; perfil = null; }
    else U = s.user;
    var r; try { r = await _sb.from('mi_perfis').select('user_id,nome,foto,status,motivo').eq('user_id', U.id).maybeSingle(); } catch (e) { return; }
    if (r.error) return;                                   // tabela ainda não existe: não bloqueia ninguém
    perfil = r.data || null;
    var ok = perfil && (perfil.status === 'ok' || perfil.status === 'pendente');
    if (ok) {
      if (perfil.foto && !(U.user_metadata || {}).avatar_url) { try { _sb.auth.updateUser({ data: { avatar_url: perfil.foto } }); } catch (e) {} }
      if (aberto && obrig) fechar();
      return;
    }
    var pulou = false; try { pulou = sessionStorage.getItem('mi_foto_pulou') === '1'; } catch (e) {}
    if (pulou) return;                                     // pulou nesta visita: volta a pedir na próxima
    if (!aberto || !obrig) abrir(true);
  }
  setInterval(function () { checar(false); }, 4000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) checar(false); });

  /* o botão da foto em Configurações abre este mesmo fluxo */
  window.pickPhoto = function () { checar(true).then(function () { if (!aberto) abrir(false); }); };

  /* ───────── revisão do professor ───────── */
  function pintarRev(l, erro) {
    rev.innerHTML = '<div class="c"><div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap"><h2 style="font-size:19px;font-weight:800;flex:1">🖼️ Fotos de perfil</h2><button type="button" class="fo-b s" data-rv="x">← Voltar</button></div>' +
      '<p style="font-size:13px;color:var(--fg2)">Reprove foto de anime, paisagem, logo ou que não seja o rosto da pessoa. Ela fica bloqueada até enviar outra.</p>' +
      (erro ? '<p style="color:#ef4444;font-weight:700">' + esc(erro) + '</p>' : '') +
      '<div class="g">' + (l || []).map(function (p) {
        return '<div class="it" data-u="' + p.user_id + '"><img src="' + esc(p.foto || '') + '" alt=""><b>' + esc(p.nome || 'Aluno') + '</b><span class="st ' + p.status + '">' + ({ ok: 'aprovada', pendente: 'a conferir', rejeitada: 'reprovada' }[p.status] || p.status) + '</span>' +
          (p.status === 'rejeitada' ? '<button type="button" class="fo-b s" data-rv="ok" data-u="' + p.user_id + '">Aprovar</button>' : '<button type="button" class="fo-b" style="background:#ef4444" data-rv="rej" data-u="' + p.user_id + '">Reprovar</button>' + (p.status === 'pendente' ? '<button type="button" class="fo-b s" data-rv="ok" data-u="' + p.user_id + '">Aprovar</button>' : '')) + '</div>';
      }).join('') + '</div>' + (l && !l.length ? '<p>Ninguém enviou foto ainda.</p>' : '') + '</div>';
  }
  var listaRev = [];
  async function revisar() {
    rev.classList.add('on'); pintarRev([]);
    var r = await _sb.from('mi_perfis').select('user_id,nome,foto,status,motivo,atualizado').order('atualizado', { ascending: false }).limit(300);
    if (r.error) return pintarRev([], 'Não consegui ler (rode o SQL feed-foto.sql): ' + r.error.message);
    listaRev = r.data || []; listaRev.sort(function (a, b) { var o = { pendente: 0, rejeitada: 2, ok: 1 }; return o[a.status] - o[b.status]; });
    pintarRev(listaRev);
  }
  async function decidir(uid, status, motivo) {
    var r = await _sb.from('mi_perfis').update({ status: status, motivo: motivo || null }).eq('user_id', uid);
    if (r.error) { pintarRev(listaRev, r.error.message); return; }
    listaRev.forEach(function (p) { if (p.user_id === uid) { p.status = status; p.motivo = motivo || null; } });
    pintarRev(listaRev); if (window.toast) toast(status === 'rejeitada' ? 'Foto reprovada. A pessoa precisa trocar.' : 'Foto aprovada.', status === 'rejeitada' ? '#ef4444' : '#10b981');
  }
  rev.addEventListener('click', function (e) {
    if (e.target === rev) { rev.classList.remove('on'); return; }
    var t = e.target.closest('[data-rv]'); if (!t) return; var a = t.dataset.rv, u = t.dataset.u;
    if (a === 'x') rev.classList.remove('on');
    else if (a === 'ok') decidir(u, 'ok', null);
    else if (a === 'rej') {      // pede o motivo dentro do próprio cartão (sem prompt do navegador)
      var it = t.closest('.it'); it.innerHTML = '<b>Motivo (a pessoa vai ler)</b><input type="text" id="fo-mot" maxlength="80" placeholder="ex: precisa ser seu rosto" style="width:100%;padding:8px;border-radius:10px;border:1px solid var(--border);background:var(--surface);color:var(--fg);font:inherit;font-size:12.5px">' +
        '<button type="button" class="fo-b" style="background:#ef4444" data-rv="conf" data-u="' + u + '">Reprovar</button><button type="button" class="fo-b s" data-rv="canc">Cancelar</button>';
    }
    else if (a === 'conf') decidir(u, 'rejeitada', ($('fo-mot') || {}).value || 'precisa ser uma foto do seu rosto');
    else if (a === 'canc') pintarRev(listaRev);
  });

  window.EBG_FOTO = { abrir: abrir, checar: checar, revisar: revisar, perfil: function () { return perfil; }, reprovar: function (uid) { return decidir(uid, 'rejeitada', 'precisa ser uma foto do seu rosto'); } };
})();
