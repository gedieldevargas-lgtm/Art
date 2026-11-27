/* FEED DA COMUNIDADE — mini "twitter" da área de membros: texto, foto e vídeo.
   Tabelas: mi_feed_posts, mi_feed_likes, mi_perfis · Pasta de arquivos: feed (supabase/feed-foto.sql).
   Foto: comprimida no aparelho (máx 1280px). Vídeo: até 30 MB, ou cole um link do YouTube no texto.
   Sem animação automática: vídeo só toca quando a pessoa aperta o play. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (x) { return String(x == null ? '' : x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var S = function () { return (window.EBG_ACESSO || {}).estado || {}; };
  var POR = 20, MAXV = 30 * 1048576;
  var U = null, posts = [], curt = {}, meus = {}, perfis = {}, mais = false, carregando = false, erro = '', anexo = null, enviando = false, confRep = null;

  var css = document.createElement('style');
  css.textContent =
    '#pane-feed .fd{max-width:640px;margin:0 auto;display:flex;flex-direction:column;gap:14px;padding-bottom:90px}' +
    '#pane-feed .fd h2{font-size:21px;font-weight:800}#pane-feed .fd .sub{font-size:13.5px;color:var(--fg2);margin-top:3px}' +
    '.fd-box{background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:14px;transition:box-shadow .15s}' +
    '.fd-box.hv:hover{box-shadow:0 8px 24px rgba(0,0,0,.09)}' +
    '.fd-ava{width:42px;height:42px;border-radius:50%;flex:none;background:var(--accent);color:#fff;font-weight:800;display:flex;align-items:center;justify-content:center;overflow:hidden;font-size:16px}.fd-ava img{width:100%;height:100%;object-fit:cover}' +
    '.fd-comp{display:flex;gap:11px;align-items:flex-start}.fd-comp .col{flex:1;min-width:0;display:flex;flex-direction:column;gap:10px}' +
    '.fd-comp textarea{width:100%;min-height:66px;resize:vertical;border:1px solid var(--border);background:var(--surface2);color:var(--fg);border-radius:14px;padding:11px 13px;font:inherit;font-size:15px;line-height:1.45}' +
    '.fd-comp textarea:focus{outline:2px solid var(--accent);outline-offset:-1px}' +
    '.fd-bar{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.fd-bar .n{margin-left:auto;font-size:12px;color:var(--fg3);font-weight:700}' +
    '.fd-b{border:0;border-radius:12px;padding:9px 14px;font:inherit;font-weight:800;font-size:13.5px;cursor:pointer;background:var(--surface2);color:var(--fg);transition:transform .15s,box-shadow .15s}' +
    '.fd-b:hover{transform:translateY(-1px);box-shadow:0 6px 16px rgba(0,0,0,.12)}.fd-b.p{background:var(--accent);color:#fff}.fd-b:disabled{opacity:.5;cursor:default;transform:none;box-shadow:none}' +
    '.fd-prev{position:relative;border-radius:14px;overflow:hidden;background:var(--surface2)}.fd-prev img,.fd-prev video{display:block;width:100%;max-height:260px;object-fit:contain}' +
    '.fd-prev .x{position:absolute;top:8px;right:8px;border:0;border-radius:99px;width:30px;height:30px;background:rgba(0,0,0,.65);color:#fff;font-size:16px;cursor:pointer}' +
    '.fd-msg{font-size:13px;font-weight:700;color:#ef4444}' +
    '.fd-post{display:flex;gap:11px}.fd-post .col{flex:1;min-width:0;display:flex;flex-direction:column;gap:8px}' +
    '.fd-top{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}.fd-top b{font-size:14.5px}.fd-top small{color:var(--fg3);font-size:12px}' +
    '.fd-tx{font-size:15px;line-height:1.5;white-space:pre-wrap;word-break:break-word}.fd-tx a{color:var(--accent);font-weight:700}' +
    '.fd-med img,.fd-med video{display:block;width:100%;max-height:460px;object-fit:contain;border-radius:14px;background:var(--surface2)}' +
    '.fd-med .yt{position:relative;width:100%;aspect-ratio:16/9;border-radius:14px;overflow:hidden;background:#000}.fd-med .yt iframe{position:absolute;inset:0;width:100%;height:100%;border:0}' +
    '.fd-act{display:flex;gap:8px;align-items:center;flex-wrap:wrap}' +
    '.fd-lk{border:0;background:var(--surface2);color:var(--fg2);border-radius:99px;padding:7px 13px;font:inherit;font-weight:800;font-size:13px;cursor:pointer;transition:transform .15s,box-shadow .15s}.fd-lk:hover{transform:translateY(-1px);box-shadow:0 6px 14px rgba(0,0,0,.1)}' +
    '.fd-lk.on{background:rgba(239,68,68,.13);color:#ef4444}' +
    '.fd-mini{border:0;background:none;color:var(--fg3);font:inherit;font-size:12px;font-weight:700;cursor:pointer;padding:6px 8px;border-radius:8px}.fd-mini:hover{background:var(--surface2);color:var(--fg)}' +
    '.fd-vazio{text-align:center;color:var(--fg2);font-size:14px;padding:30px 10px}';
  document.head.appendChild(css);

  var inicial = function (n) { return esc(String(n || '?').trim().charAt(0).toUpperCase() || '?'); };
  var quando = function (iso) {
    var m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    if (m < 1) return 'agora'; if (m < 60) return m + ' min'; if (m < 1440) return Math.round(m / 60) + ' h';
    var d = Math.round(m / 1440); if (d < 7) return d + ' d'; return new Date(iso).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
  };
  var ehAdmin = function () { return !!(window._isAdmin || S().admin); };
  function ava(uid, nome) {
    var p = perfis[uid]; var f = p && p.status !== 'rejeitada' && p.foto;
    if (!f && U && uid === U.id) f = (U.user_metadata || {}).avatar_url;
    return '<div class="fd-ava">' + (f ? '<img src="' + esc(f) + '" alt="">' : inicial(nome || (p && p.nome))) + '</div>';
  }
  function linkar(t) {
    return esc(t).replace(/(https?:\/\/[^\s<]+)/g, function (u) { return '<a href="' + u + '" target="_blank" rel="noopener noreferrer">' + (u.length > 48 ? u.slice(0, 46) + '…' : u) + '</a>'; });
  }
  function ytId(t) {
    var m = /(?:youtube\.com\/(?:watch\?(?:[^\s]*&)?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/.exec(t || ''); return m ? m[1] : null;
  }

  /* ───────── dados ───────── */
  async function usuario() {
    if (U) return U; try { var s = (await _sb.auth.getSession()).data.session; U = s ? s.user : null; } catch (e) {} return U;
  }
  async function carregar(maisUm) {
    if (carregando || !window._sb) return; carregando = true; erro = ''; desenhar();
    await usuario();
    var de = maisUm ? posts.length : 0;
    var r = await _sb.from('mi_feed_posts').select('*').order('criado', { ascending: false }).range(de, de + POR - 1);
    if (r.error) { erro = /relation|does not exist|schema cache/i.test(r.error.message || '') ? 'O feed ainda não foi ativado. Rode o SQL feed-foto.sql no Supabase.' : 'Não consegui carregar o feed: ' + r.error.message; carregando = false; return desenhar(); }
    var nov = r.data || []; mais = nov.length === POR; posts = maisUm ? posts.concat(nov) : nov;
    var ids = nov.map(function (p) { return p.id; }), us = {}; nov.forEach(function (p) { us[p.user_id] = 1; });
    if (U) us[U.id] = 1;
    var uids = Object.keys(us);
    var res = await Promise.all([
      ids.length ? _sb.from('mi_feed_likes').select('post_id,user_id').in('post_id', ids) : Promise.resolve({ data: [] }),
      uids.length ? _sb.from('mi_perfis').select('user_id,nome,foto,status').in('user_id', uids) : Promise.resolve({ data: [] })
    ]);
    if (!maisUm) { curt = {}; meus = {}; }
    ((res[0] && res[0].data) || []).forEach(function (l) { curt[l.post_id] = (curt[l.post_id] || 0) + 1; if (U && l.user_id === U.id) meus[l.post_id] = 1; });
    ((res[1] && res[1].data) || []).forEach(function (p) { perfis[p.user_id] = p; });
    carregando = false; desenhar();
  }

  /* ───────── tela ───────── */
  function cartao(p) {
    var minha = U && p.user_id === U.id, pode = minha || ehAdmin(), midia = '';
    if (p.midia_tipo === 'imagem') midia = '<a href="' + esc(p.midia_url) + '" target="_blank" rel="noopener"><img src="' + esc(p.midia_url) + '" alt="Foto do post" loading="lazy"></a>';
    else if (p.midia_tipo === 'video') midia = '<video src="' + esc(p.midia_url) + '" controls preload="metadata" playsinline></video>';
    else if (p.midia_tipo === 'youtube') midia = '<div class="yt"><iframe src="https://www.youtube-nocookie.com/embed/' + esc(p.midia_url) + '" loading="lazy" allow="encrypted-media; picture-in-picture" allowfullscreen title="Vídeo"></iframe></div>';
    var n = curt[p.id] || 0, eu = !!meus[p.id];
    return '<div class="fd-box hv fd-post" data-p="' + p.id + '">' + ava(p.user_id, p.nome) + '<div class="col">' +
      '<div class="fd-top"><b>' + esc(p.nome || (perfis[p.user_id] || {}).nome || 'Aluno') + '</b><small>' + quando(p.criado) + '</small></div>' +
      (p.texto ? '<div class="fd-tx">' + linkar(p.texto) + '</div>' : '') +
      (midia ? '<div class="fd-med">' + midia + '</div>' : '') +
      '<div class="fd-act"><button type="button" class="fd-lk' + (eu ? ' on' : '') + '" data-fd="like" data-id="' + p.id + '" aria-pressed="' + eu + '">' + (eu ? '❤️' : '🤍') + ' ' + (n || '') + '</button>' +
      (pode ? '<button type="button" class="fd-mini" data-fd="apagar" data-id="' + p.id + '">' + (confRep === 'del' + p.id ? 'Apagar mesmo?' : '🗑️ Apagar') + '</button>' : '') +
      (ehAdmin() && !minha ? '<button type="button" class="fd-mini" data-fd="reprovar" data-id="' + p.id + '">' + (confRep === 'rep' + p.id ? 'Reprovar a foto desta pessoa?' : '🚫 Foto') + '</button>' : '') +
      '</div></div></div>';
  }
  function desenhar() {
    var el = $('pane-feed'); if (!el) return;
    var foco = document.activeElement && document.activeElement.id === 'fd-tx', val = ($('fd-tx') || {}).value || '', ini = foco ? document.activeElement.selectionStart : 0;
    var nome = U && ((U.user_metadata || {}).full_name || (U.user_metadata || {}).name || (U.email || '').split('@')[0]);
    var prev = '';
    if (anexo) prev = '<div class="fd-prev">' + (anexo.tipo === 'imagem' ? '<img src="' + anexo.url + '" alt="Prévia">' : '<video src="' + anexo.url + '" controls preload="metadata" playsinline></video>') + '<button type="button" class="x" data-fd="tirar" aria-label="Tirar anexo">✕</button></div>';
    el.innerHTML = '<div class="fd"><div><h2>💬 Comunidade</h2><div class="sub">Compartilhe uma vitória, uma dúvida, uma foto ou um vídeo curto com a turma.</div></div>' +
      '<div class="fd-box fd-comp">' + (U ? ava(U.id, nome) : '') + '<div class="col">' +
      '<textarea id="fd-tx" maxlength="600" placeholder="O que você quer compartilhar hoje?" aria-label="Escrever post"></textarea>' + prev +
      '<input type="file" id="fd-foto" accept="image/*" style="display:none"><input type="file" id="fd-video" accept="video/*" style="display:none">' +
      '<div class="fd-bar"><button type="button" class="fd-b" data-fd="foto"' + (enviando ? ' disabled' : '') + '>📷 Foto</button><button type="button" class="fd-b" data-fd="video"' + (enviando ? ' disabled' : '') + '>🎬 Vídeo</button>' +
      '<span class="n" id="fd-n">0/600</span><button type="button" class="fd-b p" data-fd="postar"' + (enviando ? ' disabled' : '') + '>' + (enviando ? 'Enviando…' : 'Publicar') + '</button></div>' +
      '<div class="fd-msg" id="fd-err" aria-live="polite"></div></div></div>' +
      (erro ? '<div class="fd-box"><div class="fd-msg">' + esc(erro) + '</div></div>' : '') +
      posts.map(cartao).join('') +
      (!posts.length && !carregando && !erro ? '<div class="fd-vazio">Ainda não tem posts. Seja o primeiro! 🙌</div>' : '') +
      (carregando ? '<div class="fd-vazio">Carregando…</div>' : '') +
      '<div style="display:flex;gap:8px;justify-content:center">' + (mais && !carregando ? '<button type="button" class="fd-b" data-fd="mais">Ver mais</button>' : '') + '<button type="button" class="fd-b" data-fd="atualizar">↻ Atualizar</button></div></div>';
    var t = $('fd-tx'); if (t) { t.value = val; $('fd-n').textContent = val.length + '/600'; if (foco) { t.focus(); try { t.setSelectionRange(ini, ini); } catch (e) {} } }
  }
  function aviso(t) { var e = $('fd-err'); if (e) e.textContent = t || ''; }

  /* ───────── enviar ───────── */
  function comprimirImagem(file) {
    return new Promise(function (ok, no) {
      var fr = new FileReader(); fr.onerror = no;
      fr.onload = function () {
        var i = new Image(); i.onerror = no;
        i.onload = function () {
          var k = Math.min(1, 1280 / Math.max(i.naturalWidth, i.naturalHeight)), c = document.createElement('canvas');
          c.width = Math.round(i.naturalWidth * k); c.height = Math.round(i.naturalHeight * k); c.getContext('2d').drawImage(i, 0, 0, c.width, c.height);
          c.toBlob(function (b) { b ? ok(b) : no(new Error('blob')); }, 'image/jpeg', 0.8);
        }; i.src = fr.result;
      }; fr.readAsDataURL(file);
    });
  }
  async function pegarAnexo(tipo, file) {
    aviso('');
    if (anexo && anexo.url) URL.revokeObjectURL(anexo.url);
    if (tipo === 'video') {
      if (file.size > MAXV) { anexo = null; desenhar(); return aviso('Esse vídeo tem ' + Math.round(file.size / 1048576) + ' MB. O limite é 30 MB. Corte o vídeo ou cole um link do YouTube no texto.'); }
      anexo = { tipo: 'video', blob: file, url: URL.createObjectURL(file), ext: (/\.(mp4|webm|mov|m4v)$/i.exec(file.name) || [0, 'mp4'])[1].toLowerCase(), ct: file.type || 'video/mp4' };
    } else {
      try { var b = await comprimirImagem(file); anexo = { tipo: 'imagem', blob: b, url: URL.createObjectURL(b), ext: 'jpg', ct: 'image/jpeg' }; }
      catch (e) { anexo = null; desenhar(); return aviso('Não consegui abrir essa foto.'); }
    }
    desenhar();
  }
  async function postar() {
    if (enviando) return; await usuario(); if (!U) return;
    var texto = (($('fd-tx') || {}).value || '').trim(), yt = null, midiaUrl = null, tipo = null, path = null;
    if (!texto && !anexo) return aviso('Escreva algo ou anexe uma foto/vídeo.');
    if (!anexo) { yt = ytId(texto); if (yt) { tipo = 'youtube'; midiaUrl = yt; texto = texto.replace(/https?:\/\/\S*(youtube\.com|youtu\.be)\S*/g, '').trim(); } }
    enviando = true; var guard = texto; desenhar(); $('fd-tx').value = guard; $('fd-n').textContent = guard.length + '/600';
    try {
      if (anexo) {
        path = U.id + '/' + Date.now() + '.' + anexo.ext;
        var up = await _sb.storage.from('feed').upload(path, anexo.blob, { contentType: anexo.ct, upsert: false });
        if (up.error) throw new Error(/bucket|not found/i.test(up.error.message) ? 'A pasta de arquivos do feed ainda não existe (rode o SQL feed-foto.sql).' : up.error.message);
        midiaUrl = _sb.storage.from('feed').getPublicUrl(path).data.publicUrl; tipo = anexo.tipo;
      }
      var nome = (U.user_metadata || {}).full_name || (U.user_metadata || {}).name || (U.email || '').split('@')[0];
      var r = await _sb.from('mi_feed_posts').insert({ user_id: U.id, nome: nome, texto: texto || null, midia_url: midiaUrl, midia_tipo: tipo }).select().single();
      if (r.error) { if (path) _sb.storage.from('feed').remove([path]); throw new Error(r.error.message); }
      if (anexo && anexo.url) URL.revokeObjectURL(anexo.url);
      anexo = null; posts.unshift(r.data); enviando = false; desenhar();
      if (window.toast) toast('✅ Publicado!', '#10b981');
    } catch (e) { enviando = false; desenhar(); $('fd-tx').value = guard; $('fd-n').textContent = guard.length + '/600'; aviso(e.message || 'Não deu para publicar.'); }
  }
  async function curtir(id) {
    await usuario(); if (!U) return; var eu = !!meus[id];
    if (eu) { delete meus[id]; curt[id] = Math.max(0, (curt[id] || 1) - 1); } else { meus[id] = 1; curt[id] = (curt[id] || 0) + 1; }
    desenhar();
    var r = eu ? await _sb.from('mi_feed_likes').delete().eq('post_id', id).eq('user_id', U.id) : await _sb.from('mi_feed_likes').insert({ post_id: id, user_id: U.id });
    if (r.error && !/duplicate/i.test(r.error.message || '')) { if (eu) { meus[id] = 1; curt[id] = (curt[id] || 0) + 1; } else { delete meus[id]; curt[id] = Math.max(0, (curt[id] || 1) - 1); } desenhar(); }
  }
  async function apagar(id) {
    if (confRep !== 'del' + id) { confRep = 'del' + id; desenhar(); setTimeout(function () { if (confRep === 'del' + id) { confRep = null; desenhar(); } }, 4000); return; }
    confRep = null; var p = posts.filter(function (x) { return x.id === id; })[0];
    var r = await _sb.from('mi_feed_posts').delete().eq('id', id);
    if (r.error) { erro = 'Não consegui apagar: ' + r.error.message; return desenhar(); }
    if (p && p.midia_url && /\/object\/public\/feed\//.test(p.midia_url)) { try { await _sb.storage.from('feed').remove([decodeURIComponent(p.midia_url.split('/object/public/feed/')[1].split('?')[0])]); } catch (e) {} }
    posts = posts.filter(function (x) { return x.id !== id; }); desenhar();
  }
  async function reprovarFoto(id) {
    if (confRep !== 'rep' + id) { confRep = 'rep' + id; desenhar(); setTimeout(function () { if (confRep === 'rep' + id) { confRep = null; desenhar(); } }, 4000); return; }
    confRep = null; var p = posts.filter(function (x) { return x.id === id; })[0]; if (!p || !window.EBG_FOTO) return desenhar();
    await EBG_FOTO.reprovar(p.user_id); if (perfis[p.user_id]) perfis[p.user_id].status = 'rejeitada'; desenhar();
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('#pane-feed [data-fd]'); if (!t) return; var a = t.dataset.fd, id = t.dataset.id;
    if (a === 'foto') $('fd-foto').click();
    else if (a === 'video') $('fd-video').click();
    else if (a === 'tirar') { if (anexo && anexo.url) URL.revokeObjectURL(anexo.url); anexo = null; desenhar(); }
    else if (a === 'postar') postar();
    else if (a === 'like') curtir(id);
    else if (a === 'apagar') apagar(id);
    else if (a === 'reprovar') reprovarFoto(id);
    else if (a === 'mais') carregar(true);
    else if (a === 'atualizar') carregar(false);
  });
  document.addEventListener('change', function (e) {
    if (e.target.id !== 'fd-foto' && e.target.id !== 'fd-video') return;
    var f = e.target.files && e.target.files[0]; if (!f) return;
    pegarAnexo(e.target.id === 'fd-video' ? 'video' : 'imagem', f);
  });
  document.addEventListener('input', function (e) { if (e.target.id === 'fd-tx') { var n = $('fd-n'); if (n) n.textContent = e.target.value.length + '/600'; } });

  /* ───────── ligação com a navegação ───────── */
  function montar() {
    if ($('pane-feed')) return true;
    var home = $('pane-home'); if (!home || !home.parentNode) return false;
    var p = document.createElement('div'); p.className = 'pane'; p.id = 'pane-feed'; home.parentNode.appendChild(p);
    if (window.TITLES) TITLES.feed = 'Comunidade';
    var base = $('nav-plano') || [].filter.call(document.querySelectorAll('.nav-pill'), function (n) { return /goTo\('maratona'/.test(n.getAttribute('onclick') || ''); })[0];
    if (base && !$('nav-feed')) {
      var n = document.createElement('div'); n.className = 'nav-pill'; n.id = 'nav-feed'; n.setAttribute('onclick', "goTo('feed',this)");
      n.innerHTML = '<span class="nav-icon">💬</span><span>Comunidade</span><span class="nav-badge">Novo</span>'; base.insertAdjacentElement('afterend', n);
    }
    return true;
  }
  var env = false;
  function envolver() {
    if (env || !window.goTo) return; env = true; var g0 = window.goTo;
    window.goTo = function (page) { var r = g0.apply(this, arguments); if (page === 'feed') { desenhar(); carregar(false); } return r; };
  }
  setInterval(function () { if (!S().pronto) return; if (montar()) envolver(); }, 600);
  window.EBG_FEED = { recarregar: function () { if ($('pane-feed') && $('pane-feed').classList.contains('active')) carregar(false); } };
})();
