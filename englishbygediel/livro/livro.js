/* Livro da aula — o "livro interativo" que fica ao lado (PC) ou abaixo (celular) do vídeo.
   Uso: Livro.abrir(elemento, 'unit-01')  → carrega livro/aulas/unit-01.js e desenha.
   O progresso fica salvo no aparelho do aluno (localStorage "livro:<id>"). */
(function () {
  'use strict';
  var BASE = (function () {
    var s = document.currentScript && document.currentScript.src;
    return s ? s.replace(/livro\.js(\?.*)?$/, '') : 'livro/';
  })();
  var AULAS = window.LIVRO_AULAS = window.LIVRO_AULAS || {};

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // ---------- correção ----------
  var CONTR = { "i'm": 'i am', "you're": 'you are', "he's": 'he is', "she's": 'she is', "it's": 'it is',
    "we're": 'we are', "they're": 'they are', "how's": 'how is', "what's": 'what is', "that's": 'that is',
    "isn't": 'is not', "aren't": 'are not', "don't": 'do not' };
  function norm(s) {
    s = String(s || '').toLowerCase().replace(/[’‘`´]/g, "'");
    s = s.replace(/[a-z]+'[a-z]+/g, function (w) { return CONTR[w] || w; });
    return s.replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function dist(a, b) {
    var m = a.length, n = b.length, d = [], i, j;
    for (i = 0; i <= m; i++) d[i] = [i];
    for (j = 0; j <= n; j++) d[0][j] = j;
    for (i = 1; i <= m; i++) for (j = 1; j <= n; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[m][n];
  }
  // 'ok' | 'quase' | 'erro'
  function conferir(txt, aceitas) {
    var t = norm(txt); if (!t) return 'erro';
    var melhor = 1e9;
    for (var i = 0; i < aceitas.length; i++) {
      var a = norm(aceitas[i]);
      if (a === t) return 'ok';
      melhor = Math.min(melhor, dist(a, t) / Math.max(a.length, 1));
    }
    return melhor <= 0.1 ? 'quase' : 'erro';
  }

  // ---------- áudio (voz do navegador, em inglês) ----------
  var voz = null;
  function acharVoz() {
    if (!('speechSynthesis' in window)) return;
    var vs = speechSynthesis.getVoices();
    if (window.EBG_VOZ && EBG_VOZ.voice()) { voz = EBG_VOZ.voice(); return; }
    voz = vs.filter(function (v) { return /^en[-_]US/i.test(v.lang) && /google|samantha|natural|aria|jenny/i.test(v.name); })[0]
      || vs.filter(function (v) { return /^en[-_]US/i.test(v.lang); })[0]
      || vs.filter(function (v) { return /^en/i.test(v.lang); })[0] || null;
  }
  if ('speechSynthesis' in window) { acharVoz(); speechSynthesis.onvoiceschanged = acharVoz; }
  var AUDIOS = {}, tocando = null, vozPT = null;
  function ehPortugues(t) {
    t = ' ' + String(t || '').toLowerCase() + ' ';
    if (/[ãõçáéíóúâêôà]/.test(t)) return true;
    var pt = (t.match(/ (o|os|as|um|uma|de|do|da|dos|das|que|qual|não|você|para|com|em|no|na|é|ele|ela|eu|isso|mais|como|quando|onde|por|resposta|pergunta|frase|palavra|certa|certo|escolha|significa|temas|aula|seguros)(?= )/g) || []).length * 2;
    var en = (t.match(/ (the|a|an|is|are|i|you|he|she|it|we|they|to|of|and|do|does|what|how|my|your|in|on|at|this|that)(?= )/g) || []).length;
    return pt > en;
  }
  function chave(t) { return String(t || '').toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim(); }
  function falar(txt, devagar) {
    // 1º: áudio gravado (ex.: os áudios do Canva), se a aula tiver
    var url = AUDIOS[chave(txt)];
    if (url) {
      if (tocando) { tocando.pause(); }
      tocando = new Audio(url); tocando.playbackRate = devagar ? 0.75 : 1;
      tocando.play().catch(function () { vozNavegador(txt, devagar); });
      return;
    }
    vozNavegador(txt, devagar);
  }
  function vozNavegador(txt, devagar) {
    if (!('speechSynthesis' in window)) { vozOnline(txt, devagar, ehPortugues(txt)); return; }
    if (!voz) acharVoz();
    var emPT = ehPortugues(txt);
    if (emPT && !vozPT) vozPT = speechSynthesis.getVoices().filter(function (v) { return /^pt[-_]BR/i.test(v.lang); })[0] || null;
    // iPhone: precisa falar NO MESMO instante do toque (sem setTimeout) e só cancelar se algo já está tocando
    if (speechSynthesis.speaking || speechSynthesis.pending) speechSynthesis.cancel();
    if (speechSynthesis.paused) speechSynthesis.resume();
    var u = new SpeechSynthesisUtterance(txt);
    // no iPhone/iPad escolher a voz à mão às vezes deixa mudo: lá basta o idioma
    var ios = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent) && 'ontouchend' in document;
    if (emPT) { u.lang = 'pt-BR'; if (vozPT && !ios) u.voice = vozPT; } else { u.lang = 'en-US'; if (voz && !ios) u.voice = voz; }
    window._lvFala = u; // o iOS "esquece" a fala se ninguém guardar a referência
    u.rate = devagar ? 0.6 : 0.92; u.volume = 1;
    u.onerror = function (e) { if (e.error === 'not-allowed' || e.error === 'audio-hardware') aviso('Não consegui tocar o áudio. Confira se o celular não está no silencioso.'); };
    speechSynthesis.speak(u);
    // se em 1,5 s nada começou a tocar, avisa (celular no silencioso, voz bloqueada...)
    var comecou = false; u.onstart = function () { comecou = true; };
    setTimeout(function () { if (!comecou) vozOnline(txt, devagar, emPT); }, 900);
  }
  // plano B: se a voz do aparelho ficar muda (acontece em alguns iPhones), toca uma voz online pelo mesmo tocador "destravado"
  var AU = null, SILENCIO = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
  function tocador() { if (!AU) { AU = new Audio(); AU.preload = 'auto'; AU.setAttribute('playsinline', ''); } return AU; }
  function vozOnline(txt, devagar, emPT) {
    if (!navigator.onLine) { aviso('Sem internet pra tocar o áudio. Frase: ' + txt); return; }
    try { speechSynthesis.cancel(); } catch (e) {}
    var a = tocador(); a.pause();
    a.src = 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=' + (emPT ? 'pt-BR' : 'en') + '&q=' + encodeURIComponent(String(txt).slice(0, 190));
    a.playbackRate = devagar ? 0.75 : 1;
    var pr = a.play(); if (pr && pr.catch) pr.catch(function () { aviso('O áudio não saiu. Confira o volume do celular e toque de novo.'); });
  }
  // o 1º toque também destrava o tocador (o iOS só deixa tocar áudio depois de um toque)
  document.addEventListener('touchstart', function () { var a = tocador(); if (a._ok) return; a._ok = true; a.src = SILENCIO; var p = a.play(); if (p && p.catch) p.catch(function () { a._ok = false; }); }, { capture: true, passive: true });

  // destrava a voz no 1º toque na tela (o iOS só libera o áudio depois de um toque do usuário)
  (function () {
    if (!('speechSynthesis' in window)) return;
    var liberou = false;
    function destravar(e) {
      // se o toque já é num botão de áudio, a própria fala destrava (não atrapalhar com a fala muda)
      if (e && e.target && e.target.closest && e.target.closest('[data-falar],.lv-som,.lv-card,.lv-tile,.lv-fc,.lv-mic')) { liberou = true; }
      if (liberou) return; liberou = true;
      try { var u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); } catch (e) {}
      ['touchstart', 'click'].forEach(function (ev) { document.removeEventListener(ev, destravar, true); });
    }
    ['touchstart', 'click'].forEach(function (ev) { document.addEventListener(ev, destravar, true); });
  })();
  function aviso(t) {
    var d = document.querySelector('.lv-aviso'); if (!d) { d = document.createElement('div'); d.className = 'lv-aviso'; document.body.appendChild(d); }
    d.textContent = t; d.classList.add('on'); clearTimeout(d._t); d._t = setTimeout(function () { d.classList.remove('on'); }, 3500);
  }

  // ---------- progresso ----------
  function ler(id) { try { return JSON.parse(localStorage.getItem('livro:' + id)) || {}; } catch (e) { return {}; } }
  function gravar(id, st) { try { localStorage.setItem('livro:' + id, JSON.stringify(st)); } catch (e) {} }

  function totalItens(a) {
    return a.exercicios.reduce(function (s, ex) { return s + (ex.itens || ex.linhas).length; }, 0);
  }
  function acertos(a, st) {
    var n = 0, f = st.feito || {};
    Object.keys(f).forEach(function (k) { if (f[k] === 'ok' || f[k] === 'quase') n++; });
    return Math.min(n, totalItens(a));
  }

  function embaralhar(arr, semente) {
    var a = arr.slice(), s = semente || 7;
    for (var i = a.length - 1; i > 0; i--) { s = (s * 9301 + 49297) % 233280; var j = Math.floor(s / 233280 * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    if (a.join('|') === arr.join('|') && a.length > 1) a.push(a.shift());
    return a;
  }

  // ---------- desenho ----------
  // envolve cada palavra em inglês para o aluno tocar e ver a tradução
  function palavras(txt) {
    return String(txt || '').split(/(\s+)/).map(function (w) {
      if (!/[A-Za-z]/.test(w)) return esc(w);
      var m = w.match(/^([^A-Za-z']*)([A-Za-z'’-]+)(.*)$/); if (!m) return esc(w);
      return esc(m[1]) + '<span class="lv-w" data-w="' + esc(m[2]) + '">' + esc(m[2]) + '</span>' + esc(m[3]);
    }).join('');
  }
  function chaveG(t) { return String(t || '').toLowerCase().replace(/’/g, "'").replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim(); }
  function traduzir(w, frase) {
    var G = window.LIVRO_GLOSSARIO || {}, k = chaveG(w), r = { palavra: w, pt: G[k] || null, expr: null };
    if (!r.pt && /s$/.test(k)) r.pt = G[k.replace(/(ies)$/, 'y').replace(/(es|s)$/, '')] || null;
    if (!r.pt && /ed$/.test(k)) r.pt = G[k.replace(/ed$/, '')] || G[k.replace(/d$/, '')] || null;
    if (!r.pt && /ing$/.test(k)) r.pt = G[k.replace(/ing$/, '')] || G[k.replace(/ing$/, 'e')] || null;
    var ws = chaveG(frase).split(' '), i = ws.indexOf(k);
    if (i >= 0) for (var n = 6; n >= 2 && !r.expr; n--) for (var a = Math.max(0, i - n + 1); a <= i && a + n <= ws.length; a++) {
      var e = ws.slice(a, a + n).join(' '); if (G[e]) { r.expr = [e, G[e]]; break; }
    }
    return r;
  }
  function mostrarTraducao(span) {
    fecharBalao();
    var frase = (span.closest('[data-frase]') || span.parentNode).textContent, r = traduzir(span.dataset.w, frase);
    var b = document.createElement('div'); b.className = 'lv-balao';
    b.innerHTML = '<div class="lv-b1"><b>' + esc(r.palavra) + '</b> ' + btnSom(r.palavra) + '</div>' +
      (r.pt ? '<div class="lv-b2">' + esc(r.pt) + '</div>' : '<div class="lv-b2 mut">Essa palavra não está no vocabulário do curso.</div>') +
      (r.expr ? '<div class="lv-b3">Nesta frase: <b>' + esc(r.expr[0]) + '</b> = ' + esc(r.expr[1]) + '</div>' : '') +
      '<a class="lv-b4" target="_blank" rel="noopener" href="https://translate.google.com/?sl=en&tl=pt&text=' + encodeURIComponent(r.expr ? r.expr[0] : r.palavra) + '">Ver no Google Tradutor ↗</a>';
    document.body.appendChild(b);
    var rc = span.getBoundingClientRect(), bw = b.offsetWidth;
    b.style.left = Math.max(8, Math.min(window.innerWidth - bw - 8, rc.left + rc.width / 2 - bw / 2)) + 'px';
    b.style.top = (window.scrollY + rc.bottom + 8) + 'px';
    span.classList.add('on'); fecharBalao.alvo = span;
  }
  function fecharBalao() { var b = document.querySelector('.lv-balao'); if (b) b.remove(); if (fecharBalao.alvo) fecharBalao.alvo.classList.remove('on'); }
  document.addEventListener('click', function (e) {
    var w = e.target.closest && e.target.closest('.lv-w');
    if (w) { e.stopPropagation(); return mostrarTraducao(w); }
    var bl = e.target.closest && e.target.closest('.lv-balao');
    if (bl) { var bs = e.target.closest('[data-falar]'); if (bs) falar(bs.dataset.falar); return; }
    fecharBalao();
  }, true);
  window.addEventListener('scroll', function (e) { if (!(e.target.closest && e.target.closest('.lv-balao'))) fecharBalao(); }, true);

  function btnSom(txt, devagar) {
    return '<button type="button" class="lv-som' + (devagar ? ' lento' : '') + '" data-falar="' + esc(txt) + '"' + (devagar ? ' data-lento="1"' : '') +
      ' aria-label="' + (devagar ? 'Ouvir devagar' : 'Ouvir') + '">' + (devagar ? '🐢' : '▶') + '</button>';
  }

  function htmlRevisar(a) {
    var h = '';
    a.revisar.forEach(function (b) {
      if (b.tipo === 'vocab') {
        h += '<div class="lv-bloco"><div class="lv-bt">' + esc(b.titulo) + '</div><div class="lv-vocab' + (b.emoji ? ' emo' : '') + '">';
        b.itens.forEach(function (it) {
          h += '<button type="button" class="lv-card" data-falar="' + esc(it[0].split(' / ')[0]) + '">' + (imgDe(it[0]) || (it[2] ? '<span class="lv-emo">' + it[2] + '</span>' : '')) +
            '<span class="en">' + esc(it[0]) + '</span><span class="pt">' + esc(it[1]) + '</span></button>';
        });
        h += '</div></div>';
      } else if (b.tipo === 'dialogo') {
        h += '<div class="lv-bloco"><div class="lv-bt">' + esc(b.titulo) + ' <button type="button" class="lv-mini" data-falar="' + esc(b.falas.map(function (f) { return f[1]; }).join(' ... ')) + '">▶ ouvir tudo</button></div><div class="lv-dial">';
        b.falas.forEach(function (f, i) {
          h += '<div class="lv-fala ' + (i % 2 ? 'b' : 'a') + '"><b>' + esc(f[0]) + '</b><div><span class="en" data-frase>' + palavras(f[1]) + '</span> ' + btnSom(f[1]) + '<span class="pt">' + esc(f[2]) + '</span></div></div>';
        });
        h += '</div></div>';
      } else if (b.tipo === 'midia') {
        h += '<div class="lv-bloco"><div class="lv-bt">' + esc(b.titulo) + '</div><div class="lv-midias' + (b.itens.length === 1 ? ' um' : '') + '">';
        b.itens.forEach(function (it) {
          h += '<figure class="lv-midia' + (it.gif ? ' gif' : '') + '"' + (it.gif ? ' data-falar="' + esc(it.t) + '" role="button"' : '') + '>' + tagMidia(it.v, it.gif) +
            (it.t ? '<figcaption>' + (it.gif ? '<span class="lv-falar">▶</span> ' : '') + esc(it.t) + '</figcaption>' : '') + '</figure>';
        });
        h += '</div></div>';
      } else if (b.tipo === 'dica') {
        h += '<div class="lv-dica">💡 ' + esc(b.texto) + '</div>';
      }
    });
    return h;
  }

  function htmlEx(a, ex, st) {
    var f = st.feito || {}, h = '';
    var marca = function (k) { var v = f[k]; return v ? ' ' + v : ''; };
    if (ex.tipo === 'ditado') {
      ex.itens.forEach(function (it, i) {
        var k = ex.id + '.' + i;
        h += '<div class="lv-item' + marca(k) + '" data-k="' + k + '"><span class="lv-letra">' + 'abcdefghij'[i] + '</span>' +
          btnSom(it.resp[0]) + btnSom(it.resp[0], true) +
          '<input class="lv-inp" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Escreva o que ouviu" value="' + esc((st.txt || {})[k] || '') + '">' +
          '<div class="lv-fb"></div></div>';
      });
    } else if (ex.tipo === 'escolha') {
      ex.itens.forEach(function (it, i) {
        var k = ex.id + '.' + i, sel = (st.txt || {})[k];
        h += '<div class="lv-item col' + marca(k) + '" data-k="' + k + '"><div class="lv-perg"><span class="lv-letra">' + 'abcdefghij'[i] + '</span><span class="lv-bigemo">' + it.emoji + '</span>' +
          '<span data-frase>' + (ehPortugues(it.p) ? esc(it.p) : palavras(it.p)) + '</span>' + (it.p && !ehPortugues(it.p) ? btnSom(it.p) : '') + '</div><div class="lv-ops">';
        it.ops.forEach(function (o, j) {
          h += '<button type="button" class="lv-op' + (String(sel) === String(j) ? ' sel' : '') + '" data-op="' + j + '">' + esc(o) + '</button>';
        });
        h += '</div><div class="lv-fb"></div></div>';
      });
    } else if (ex.tipo === 'montar') {
      ex.itens.forEach(function (it, i) {
        var k = ex.id + '.' + i;
        var pecas = it.resp.split(' ');
        var usadas = ((st.txt || {})[k] || '').split('|').filter(Boolean).map(Number);
        var ordem = embaralhar(pecas.map(function (_, j) { return j; }), i + 3);
        h += '<div class="lv-item col' + marca(k) + '" data-k="' + k + '"><div class="lv-perg"><span class="lv-letra">' + 'abcdefghij'[i] + '</span>' + btnSom(it.ouvir) +
          '<span class="lv-oculto" data-ver="' + esc(it.ouvir) + '">Ouça a pergunta (toque aqui para ler)</span></div>' +
          '<div class="lv-linha" aria-label="Sua resposta">' + usadas.map(function (j) { return '<button type="button" class="lv-peca on" data-p="' + j + '">' + esc(pecas[j]) + '</button>'; }).join('') + '</div>' +
          '<div class="lv-banco">' + ordem.map(function (j) { return '<button type="button" class="lv-peca' + (usadas.indexOf(j) >= 0 ? ' usada' : '') + '" data-p="' + j + '">' + esc(pecas[j]) + '</button>'; }).join('') + '</div>' +
          '<div class="lv-fb"></div></div>';
      });
    } else if (ex.tipo === 'pares') {
      var lados = [], semente = ex.itens.length + 5;
      ex.itens.forEach(function (it, i) { lados.push(['en', i, it.en]); });
      var pts = ex.itens.map(function (it, i) { return ['pt', i, it.pt]; });
      h += '<div class="lv-jogo" data-jogo="' + ex.id + '"><div class="lv-placar"><span>⏱ <b class="lv-tempo">0s</b></span><span>❌ <b class="lv-erros">0</b></span></div><div class="lv-pares">' +
        '<div class="lv-col">' + embaralhar(lados, semente).map(function (x) { var k = ex.id + '.' + x[1]; return '<button type="button" class="lv-tile' + (f[k] === 'ok' ? ' feito' : '') + '" data-par="' + x[1] + '" data-lado="en" data-k="' + k + '">' + imgDe(x[2], 'lv-img-p') + esc(x[2]) + '</button>'; }).join('') + '</div>' +
        '<div class="lv-col">' + embaralhar(pts, semente + 2).map(function (x) { var k = ex.id + '.' + x[1]; return '<button type="button" class="lv-tile pt' + (f[k] === 'ok' ? ' feito' : '') + '" data-par="' + x[1] + '" data-lado="pt" data-k="' + k + '">' + esc(x[2]) + '</button>'; }).join('') + '</div></div>' +
        '<div class="lv-fb lv-fim"></div></div>';
    } else if (ex.tipo === 'conversa') {
      ex.linhas.forEach(function (ln, i) {
        var k = ex.id + '.' + i;
        h += '<div class="lv-item col' + marca(k) + '" data-k="' + k + '">' + (ln.midia ? '<div class="lv-cena">' + tagMidia(ln.midia) + '</div>' : '') + '<div class="lv-perg"><b>' + esc(ln.quem) + ':</b> <span class="pt">' + (ln.midia ? '🎬 ' : '🇧🇷 ') + (ln.midia ? '<span data-frase>' + palavras(ln.pt) + '</span>' : esc(ln.pt)) + '</span></div>' +
          '<input class="lv-inp" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="' + (ln.midia ? 'A palavra que falta…' : '🇺🇸 Em inglês…') + '" value="' + esc((st.txt || {})[k] || '') + '"><div class="lv-fb"></div></div>';
      });
    }
    return h;
  }

  function tagMidia(v, gif) {
    var src = BASE + 'midia/' + v + '.mp4', poster = BASE + 'midia/' + v + '.jpg';
    return gif ? '<video src="' + src + '" autoplay loop muted playsinline preload="metadata"></video>'
               : '<video src="' + src + '" poster="' + poster + '" controls playsinline preload="none"></video>';
  }
  function imgDe(en, cls) {
    var M = window.LIVRO_IMAGENS || {}, k = chaveG(en);
    var src = M[k] || M[chaveG(String(en).split(' / ')[0])];
    return src ? '<img class="' + (cls || 'lv-img') + '" src="' + BASE + src + '" alt="" loading="lazy">' : '';
  }
  // deixa a aula enxuta: jogo, cenas, 1 quiz e "monte a frase" (sem ditado, sem tradução escrita, sem redação longa)
  function enxugar(a) {
    if (a._enxuto) return; a._enxuto = true;
    var ex = a.exercicios.filter(function (e) { return e.tipo === 'pares' || e.tipo === 'escolha' || e.tipo === 'montar' || e.id === 'cenas'; });
    var vistos = {}; ex = ex.filter(function (e) { var t = e.id === 'cenas' ? 'cenas' : e.tipo; if (vistos[t]) return false; vistos[t] = 1; return true; });
    if (!vistos.pares) {
      var cs = cartoes(a).filter(function (c) { return c.en.split(' ').length <= 4 && c.pt.length <= 28; }).slice(0, 6);
      if (cs.length >= 4) ex.unshift({ id: 'jogo', tipo: 'pares', titulo: 'Jogo: ligue os pares', instrucao: 'Toque numa palavra em inglês e depois na tradução. Seja rápido!', itens: cs.map(function (c) { return { en: c.en.split(' / ')[0], pt: c.pt }; }) });
    }
    ex.forEach(function (e) { if (e.tipo === 'pares') e.itens = e.itens.slice(0, 6); if (e.tipo === 'escolha') e.itens = e.itens.slice(0, 4); if (e.tipo === 'montar') e.itens = e.itens.slice(0, 3); });
    a.exercicios = ex;
  }
  function juntarMidia(a) {
    if (a._midia || !window.LIVRO_MIDIA) return; a._midia = true;
    var M = window.LIVRO_MIDIA[a.id]; if (!M) return;
    if (M.galeria && M.galeria.length) a.revisar.unshift({ tipo: 'midia', titulo: M.galeria[0].gif ? '😂 Veja e repita' : '😂 Para descontrair', itens: M.galeria });
    if (M.cenas && M.cenas.length) a.exercicios.splice(1, 0, { id: 'cenas', tipo: 'conversa', titulo: '🎬 Assista e complete', instrucao: 'Dê play na cena, ouça e escreva a palavra que falta.',
      linhas: M.cenas.map(function (c) { return { quem: 'Cena', pt: c.frase, resp: c.resp, midia: c.v }; }) });
  }

  function desenhar(el, a) {
    juntarMidia(a); enxugar(a);
    var st = ler(a.id), tot = totalItens(a), ok = acertos(a, st);
    var aberto = st.aberto || 'revisar';
    var h = '<div class="lv" data-aula="' + esc(a.id) + '">' +
      '<div class="lv-head"><div><div class="lv-kick">📘 LIVRO DA AULA · ' + esc(a.rotulo || (a.nivel + ' · UNIT ' + a.unidade)).toUpperCase() + '</div>' +
      '<div class="lv-tit">' + esc(a.titulo) + ' <small>' + esc(a.subtitulo || '') + '</small></div></div>' +
      '<a class="lv-baixar" href="' + esc(a.pdf ? a.pdf : BASE + 'ebook.html?u=' + a.id) + '" target="_blank" rel="noopener"' + (a.pdf ? ' download' : '') + '>⬇ Baixar e-book</a></div>' +
      '<div class="lv-prog"><div class="lv-bar"><i style="width:' + Math.round(ok / tot * 100) + '%"></i></div><span>' + ok + '/' + tot + ' acertos</span></div>';

    h += '<details class="lv-sec" data-sec="revisar"' + (aberto === 'revisar' ? ' open' : '') + '><summary>🔁 Revisar a aula <em>toque para ouvir</em></summary><div class="lv-corpo">' + htmlRevisar(a) + '</div></details>';
    var cards = cartoes(a), frasesPron = frasesPronuncia(a);
    if (cards.length >= 3) h += '<details class="lv-sec" data-sec="cards"' + (aberto === 'cards' ? ' open' : '') + '><summary>🃏 Flashcards <em class="lv-cont">' + cards.length + ' cartões</em></summary><div class="lv-corpo" data-cards></div></details>';
    if (frasesPron.length) h += '<details class="lv-sec" data-sec="pron"' + (aberto === 'pron' ? ' open' : '') + '><summary>🎤 Avalie sua pronúncia</summary><div class="lv-corpo">' + htmlPronuncia(frasesPron) + '</div></details>';
    a.exercicios.forEach(function (ex, n) {
      var itens = (ex.itens || ex.linhas), feitos = itens.filter(function (_, i) { var v = (st.feito || {})[ex.id + '.' + i]; return v === 'ok' || v === 'quase'; }).length;
      h += '<details class="lv-sec" data-sec="' + ex.id + '" data-ex="' + ex.id + '"' + (aberto === ex.id ? ' open' : '') + '><summary>' +
        '<span class="lv-num">' + (n + 1) + '</span>' + esc(ex.titulo) + ' <em class="lv-cont' + (feitos === itens.length ? ' tudo' : '') + '">' + feitos + '/' + itens.length + '</em></summary>' +
        '<div class="lv-corpo"><p class="lv-inst">' + esc(ex.instrucao) + '</p>' + htmlEx(a, ex, st) +
        '<div class="lv-acoes"><button type="button" class="lv-btn" data-corrigir="' + ex.id + '">✔ Corrigir</button>' +
        '<button type="button" class="lv-btn sec" data-gabarito="' + ex.id + '">Ver respostas</button>' +
        '<button type="button" class="lv-btn sec" data-limpar="' + ex.id + '">Refazer</button></div></div></details>';
    });
    if (a.missao && (a.missao.tarefa || a.missao.falar)) {
      h += '<div class="lv-dica lv-missao">🎯 <b>Missão:</b> ' + esc((a.missao.tarefa || '').replace(/^Pratique:\s*/, '')) +
        (a.missao.falar ? '<br>🗣️ Fale 2 vezes: <b>' + esc(a.missao.falar) + '</b> ' + btnSom(a.missao.falar) : '') + '</div>';
    }
    h += '<div class="lv-credito">Ilustrações: <a href="https://openmoji.org" target="_blank" rel="noopener">OpenMoji</a> (CC BY-SA 4.0)</div>';
    h += '</div>';
    el.innerHTML = h;
    var bc = el.querySelector('[data-cards]'); if (bc) desenharCards(bc, a);
    ligar(el, a);
    avisarAltura();
  }

  function corrigir(el, a, exId, mostrar) {
    var ex = a.exercicios.filter(function (e) { return e.id === exId; })[0];
    var st = ler(a.id); st.feito = st.feito || {}; st.txt = st.txt || {};
    var sec = el.querySelector('[data-ex="' + exId + '"]');
    var certos = 0, total = (ex.itens || ex.linhas).length;
    if (ex.tipo === 'pares') {
      ex.itens.forEach(function (it, i) { var k = exId + '.' + i; if (mostrar) st.feito[k] = st.feito[k] || 'mostrado'; if (st.feito[k] === 'ok') certos++; });
      if (mostrar) sec.querySelectorAll('.lv-tile').forEach(function (b) { b.classList.add('feito'); var it = ex.itens[+b.dataset.par]; if (b.dataset.lado === 'en') b.textContent = it.en + ' = ' + it.pt; });
      gravar(a.id, st); if (!mostrar) atualizarProg(el, a, sec, certos, total); return;
    }
    (ex.itens || ex.linhas).forEach(function (it, i) {
      var k = exId + '.' + i, box = sec.querySelector('[data-k="' + k + '"]'), fb = box.querySelector('.lv-fb');
      var r, certa;
      if (ex.tipo === 'ditado' || ex.tipo === 'conversa') {
        var inp = box.querySelector('.lv-inp'); st.txt[k] = inp.value;
        r = conferir(inp.value, it.resp); certa = it.resp[0];
      } else if (ex.tipo === 'escolha') {
        var s = st.txt[k]; r = s == null ? 'erro' : (Number(s) === it.c ? 'ok' : 'erro'); certa = it.ops[it.c];
      } else if (ex.tipo === 'montar') {
        var pecas = it.resp.split(' ');
        var txt = Array.prototype.map.call(box.querySelectorAll('.lv-linha .lv-peca'), function (b) { return pecas[+b.dataset.p]; }).join(' ');
        r = conferir(txt, [it.resp]); if (r === 'quase') r = 'erro'; certa = it.resp;
      }
      if (mostrar) { box.classList.add('mostra'); fb.innerHTML = '<span class="lv-resp">✅ ' + esc(certa) + '</span>'; return; }
      st.feito[k] = r; box.classList.remove('ok', 'quase', 'erro'); box.classList.add(r);
      if (r === 'ok') { certos++; fb.innerHTML = '<span class="lv-bom">Certo!</span>'; }
      else if (r === 'quase') { certos++; fb.innerHTML = '<span class="lv-quase">Quase! Confira a escrita: ' + esc(certa) + '</span>'; }
      else fb.innerHTML = '<span class="lv-erro">Ainda não. Tente de novo ou toque em "Ver respostas".</span>';
    });
    gravar(a.id, st);
    if (!mostrar) atualizarProg(el, a, sec, certos, total);
    avisarAltura();
  }

  function atualizarProg(el, a, sec, certos, total) {
    var st = ler(a.id), tot = totalItens(a), ok = acertos(a, st);
    el.querySelector('.lv-bar i').style.width = Math.round(ok / tot * 100) + '%';
    el.querySelector('.lv-prog span').textContent = ok + '/' + tot + ' acertos';
    var c = sec.querySelector('.lv-cont'); c.textContent = certos + '/' + total; c.classList.toggle('tudo', certos === total);
    if (ok === tot) festa(el);
    if (certos === total) {
      var prox = sec.nextElementSibling;
      setTimeout(function () { if (prox && prox.tagName === 'DETAILS') { sec.open = false; prox.open = true; } }, 900);
    }
    try { window.parent !== window && window.parent.postMessage({ livro: a.id, acertos: ok, total: tot }, '*'); } catch (e) {}
  }

  var JOGO = {};
  function clicarPar(el, a, t) {
    if (t.classList.contains('feito')) return;
    var jogo = t.closest('.lv-jogo'), id = jogo.dataset.jogo, J = JOGO[id] = JOGO[id] || { erros: 0, ini: Date.now() };
    if (!J.timer) J.timer = setInterval(function () { var e = jogo.querySelector('.lv-tempo'); if (!document.body.contains(jogo)) return clearInterval(J.timer); e.textContent = Math.round((Date.now() - J.ini) / 1000) + 's'; }, 500);
    if (t.dataset.lado === 'en') falar(t.textContent);
    var sel = jogo.querySelector('.lv-tile.sel');
    if (!sel || sel === t) { t.classList.toggle('sel'); return; }
    if (sel.dataset.lado === t.dataset.lado) { sel.classList.remove('sel'); t.classList.add('sel'); return; }
    sel.classList.remove('sel');
    if (sel.dataset.par === t.dataset.par) {
      sel.classList.add('feito'); t.classList.add('feito');
      var st = ler(a.id); st.feito = st.feito || {}; st.feito[t.dataset.k] = 'ok'; gravar(a.id, st);
      var ex = a.exercicios.filter(function (e) { return e.id === id; })[0], sec = jogo.closest('[data-ex]');
      var feitos = ex.itens.filter(function (_, i) { return st.feito[id + '.' + i] === 'ok'; }).length;
      atualizarProg(el, a, sec, feitos, ex.itens.length);
      if (feitos === ex.itens.length) { clearInterval(J.timer); jogo.querySelector('.lv-fim').innerHTML = '<span class="lv-bom">🏆 Completo em ' + Math.round((Date.now() - J.ini) / 1000) + 's com ' + J.erros + ' erro(s)! Toque em "Refazer" e tente bater seu tempo.</span>'; }
    } else {
      J.erros++; jogo.querySelector('.lv-erros').textContent = J.erros;
      [sel, t].forEach(function (b) { b.classList.add('errou'); setTimeout(function () { b.classList.remove('errou'); }, 450); });
    }
  }

  function festa(el) {
    if (el.querySelector('.lv-festa')) return;
    var d = document.createElement('div'); d.className = 'lv-festa';
    d.innerHTML = (window.LIVRO_MIDIA_FESTA ? '<video src="' + BASE + 'midia/' + window.LIVRO_MIDIA_FESTA + '.mp4" autoplay loop muted playsinline></video>' : '') + '<div>🏆 <b>Livro da aula completo!</b> Agora baixe o e-book e faça a missão no caderno.</div>';
    el.querySelector('.lv').insertBefore(d, el.querySelector('.lv-sec'));
  }

  // ---------- flashcards ----------
  function cartoes(a) {
    var out = [], vistos = {};
    a.revisar.forEach(function (b) {
      if (b.tipo !== 'vocab') return;
      b.itens.forEach(function (it) { var en = it[0], pt = it[1]; if (!pt || vistos[en]) return; vistos[en] = 1; out.push({ en: en, pt: pt, e: it[2] || '' }); });
    });
    return out.slice(0, 24);
  }
  function estadoCards(a) {
    var C = cartoes(a), st = ler(a.id), F = st.fc;
    if (!F || !F.ordem) F = { ordem: C.map(function (_, k) { return k; }), i: 0, sei: [], nao: [] };
    return { C: C, st: st, F: F };
  }
  function desenharCards(box, a) {
    var E = estadoCards(a), C = E.C, F = E.F, total = F.ordem.length;
    if (F.i >= total) {
      box.innerHTML = '<div class="lv-fc-fim"><div class="lv-fc-placar">✅ ' + F.sei.length + ' já sei · 😕 ' + F.nao.length + ' para revisar</div>' +
        (F.nao.length ? '<button type="button" class="lv-btn" data-fc="revisar">Revisar os ' + F.nao.length + ' que errei</button> ' : '<p>🏆 Você sabe todas as palavras desta rodada!</p>') +
        '<button type="button" class="lv-btn sec" data-fc="zerar">Começar de novo</button></div>';
      return;
    }
    var c = C[F.ordem[F.i]];
    box.innerHTML = '<div class="lv-fc-prog"><div class="lv-bar"><i style="width:' + Math.round(F.i / total * 100) + '%"></i></div><span>' + (F.i + 1) + '/' + total + '</span></div>' +
      '<button type="button" class="lv-fc" data-fc="virar" aria-label="Virar o cartão"><div class="lv-fc-in"><div class="lv-fc-f">' + (imgDe(c.en, 'lv-fc-img') || (c.e ? '<span class="lv-fc-e">' + c.e + '</span>' : '')) + '<b>' + esc(c.en) + '</b><small>Toque para ver a tradução</small></div>' +
      '<div class="lv-fc-v"><b>' + esc(c.pt) + '</b><small>' + esc(c.en) + '</small></div></div></button>' +
      '<div class="lv-fc-acoes">' + btnSom(c.en.split(' / ')[0]) + '<button type="button" class="lv-btn sec" data-fc="nao">😕 Ainda não</button><button type="button" class="lv-btn" data-fc="sei">✅ Já sei</button></div>';
  }
  function acaoCards(box, a, acao) {
    if (acao === 'virar') { box.querySelector('.lv-fc').classList.toggle('virado'); return; }
    var E = estadoCards(a), F = E.F, atual = F.ordem[F.i];
    if (acao === 'sei') { F.sei.push(atual); F.i++; }
    else if (acao === 'nao') { F.nao.push(atual); F.i++; }
    else if (acao === 'zerar') F = null;
    else if (acao === 'revisar') F = { ordem: F.nao.slice(), i: 0, sei: [], nao: [] };
    E.st.fc = F; gravar(a.id, E.st); desenharCards(box, a);
  }

  // ---------- avaliador de pronúncia ----------
  var Reconhecer = window.SpeechRecognition || window.webkitSpeechRecognition;
  function frasesPronuncia(a) {
    var fr = [];
    a.revisar.forEach(function (b) {
      if (b.tipo === 'vocab') b.itens.forEach(function (it) { var n = it[0].split(' ').length; if (n >= 2 && n <= 10 && !/[→\/(]/.test(it[0])) fr.push(it[0]); });
      if (b.tipo === 'dialogo') b.falas.forEach(function (f) { if (f[1].split(' ').length <= 10) fr.push(f[1]); });
    });
    fr = fr.filter(function (x, i) { return fr.indexOf(x) === i; });
    return fr.slice(-6);
  }
  function htmlPronuncia(fr) {
    if (!Reconhecer) return '<div class="lv-dica">🎤 Para avaliar sua pronúncia, abra esta aula no <b>Chrome</b> (Android/computador) ou no <b>Safari</b> (iPhone). Este navegador não tem reconhecimento de voz.</div>';
    return '<p class="lv-inst">Toque em ▶ para ouvir, depois em 🎤 e fale a frase. O livro mostra o que entendeu e dá uma nota.</p>' +
      fr.map(function (f, i) {
        return '<div class="lv-item col lv-pron" data-pron="' + i + '"><div class="lv-perg"><span class="lv-letra">' + (i + 1) + '</span><b data-frase>' + palavras(f) + '</b></div>' +
          '<div class="lv-pron-acoes">' + btnSom(f) + btnSom(f, true) + '<button type="button" class="lv-mic" data-alvo="' + esc(f) + '">🎤 Falar</button></div><div class="lv-fb"></div></div>';
      }).join('');
  }
  function notaPronuncia(alvo, ditos) {
    var A = chaveG(alvo).split(' '), melhor = { nota: 0, dito: '', marca: [] };
    ditos.forEach(function (d) {
      var D = chaveG(d).split(' '), usados = {}, marca = A.map(function (w) {
        for (var j = 0; j < D.length; j++) if (!usados[j] && (D[j] === w || dist(D[j], w) <= (w.length > 4 ? 1 : 0))) { usados[j] = 1; return true; }
        return false;
      });
      var ok = marca.filter(Boolean).length, extra = Math.max(0, D.length - A.length);
      var nota = Math.max(0, Math.round((ok - extra * 0.5) / A.length * 100));
      if (nota > melhor.nota || !melhor.dito) melhor = { nota: nota, dito: d, marca: marca };
    });
    return melhor;
  }
  function ouvirPronuncia(btn) {
    var box = btn.closest('.lv-pron'), fb = box.querySelector('.lv-fb'), alvo = btn.dataset.alvo;
    if (ouvirPronuncia.rec) { try { ouvirPronuncia.rec.abort(); } catch (e) {} }
    var r = new Reconhecer(); ouvirPronuncia.rec = r;
    r.lang = 'en-US'; r.interimResults = false; r.maxAlternatives = 5;
    btn.classList.add('ouvindo'); btn.textContent = '🔴 Ouvindo…'; fb.innerHTML = '<span class="lv-quase">Fale agora: ' + esc(alvo) + '</span>';
    var fim = function () { btn.classList.remove('ouvindo'); btn.textContent = '🎤 Falar de novo'; };
    r.onresult = function (ev) {
      var alts = []; for (var i = 0; i < ev.results[0].length; i++) alts.push(ev.results[0][i].transcript);
      var m = notaPronuncia(alvo, alts), ws = alvo.split(' ');
      var cor = m.nota >= 90 ? 'lv-bom' : m.nota >= 70 ? 'lv-quase' : 'lv-erro';
      var msg = m.nota >= 90 ? '🏆 Excelente!' : m.nota >= 70 ? '👍 Muito bom! Repare nas palavras em vermelho.' : '💪 Tente de novo, ouvindo antes com 🐢.';
      fb.innerHTML = '<div class="lv-nota ' + cor + '">' + m.nota + '%</div><div class="' + cor + '">' + msg + '</div>' +
        '<div class="lv-pron-alvo">' + ws.map(function (w, k) { return '<span class="' + (m.marca[k] ? 'pw-ok' : 'pw-erro') + '">' + esc(w) + '</span>'; }).join(' ') + '</div>' +
        '<div class="lv-mini-info">Entendi: "' + esc(m.dito) + '"</div>';
      box.classList.remove('ok', 'quase', 'erro'); box.classList.add(m.nota >= 90 ? 'ok' : m.nota >= 70 ? 'quase' : 'erro');
    };
    r.onerror = function (ev) {
      fim();
      fb.innerHTML = '<span class="lv-erro">' + (ev.error === 'not-allowed' || ev.error === 'service-not-allowed' ? 'Libere o microfone para esta página (no aviso do navegador) e tente de novo.' :
        ev.error === 'no-speech' ? 'Não ouvi nada. Toque em 🎤 e fale logo em seguida.' : 'Não consegui ouvir (' + esc(ev.error) + '). Tente de novo.') + '</span>';
    };
    r.onend = fim;
    try { r.start(); } catch (e) { fim(); fb.innerHTML = '<span class="lv-erro">Não consegui ligar o microfone.</span>'; }
  }

  function ligar(el, a) {
    var raiz = el.querySelector('.lv');
    raiz.addEventListener('click', function (e) {
      var t = e.target.closest('button,[data-ver],figure[data-falar]'); if (!t) return;
      if (t.dataset.falar) { falar(t.dataset.falar, !!t.dataset.lento); return; }
      if (t.dataset.ver) { t.textContent = '🇺🇸 ' + t.dataset.ver; return; }
      if (t.dataset.corrigir) return corrigir(el, a, t.dataset.corrigir, false);
      if (t.dataset.gabarito) return corrigir(el, a, t.dataset.gabarito, true);
      if (t.dataset.limpar) {
        var st = ler(a.id); Object.keys(st.feito || {}).concat(Object.keys(st.txt || {})).forEach(function (k) {
          if (k.indexOf(t.dataset.limpar + '.') === 0) { delete (st.feito || {})[k]; delete (st.txt || {})[k]; }
        });
        if (JOGO[t.dataset.limpar]) { clearInterval(JOGO[t.dataset.limpar].timer); delete JOGO[t.dataset.limpar]; }
        st.aberto = t.dataset.limpar; gravar(a.id, st); desenhar(el, a); return;
      }
      if (t.classList.contains('lv-tile')) return clicarPar(el, a, t);
      if (t.dataset.fc) return acaoCards(t.closest('[data-cards]'), a, t.dataset.fc);
      if (t.classList.contains('lv-mic')) return ouvirPronuncia(t);
      var box = t.closest('.lv-item'); if (!box) return;
      var k = box.dataset.k, st2 = ler(a.id); st2.txt = st2.txt || {};
      if (t.classList.contains('lv-op')) {
        box.querySelectorAll('.lv-op').forEach(function (b) { b.classList.remove('sel'); }); t.classList.add('sel');
        st2.txt[k] = t.dataset.op; gravar(a.id, st2); return;
      }
      if (t.classList.contains('lv-peca')) {
        var linha = box.querySelector('.lv-linha'), banco = box.querySelector('.lv-banco'), p = t.dataset.p;
        if (t.parentNode === linha) { t.remove(); banco.querySelector('[data-p="' + p + '"]').classList.remove('usada'); }
        else if (!t.classList.contains('usada')) {
          t.classList.add('usada'); var c = document.createElement('button'); c.type = 'button'; c.className = 'lv-peca on'; c.dataset.p = p; c.textContent = t.textContent; linha.appendChild(c);
        }
        st2.txt[k] = Array.prototype.map.call(linha.querySelectorAll('.lv-peca'), function (b) { return b.dataset.p; }).join('|');
        box.classList.remove('ok', 'erro', 'quase', 'mostra'); gravar(a.id, st2); return;
      }
    });
    raiz.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target.classList.contains('lv-inp')) {
        var sec = e.target.closest('[data-ex]'); corrigir(el, a, sec.dataset.ex, false);
      }
    });
    raiz.addEventListener('input', function (e) {
      if (e.target.classList.contains('lv-inp')) {
        var st = ler(a.id); st.txt = st.txt || {}; st.txt[e.target.closest('.lv-item').dataset.k] = e.target.value; gravar(a.id, st);
      } else if (e.target.classList.contains('lv-frases')) {
        var s2 = ler(a.id); s2.frases = e.target.value; gravar(a.id, s2);
        var n = e.target.value.split('\n').filter(function (x) { return x.trim(); }).length, c = e.target.closest('details').querySelector('.lv-cont');
        c.textContent = Math.min(n, a.missao.frases) + '/' + a.missao.frases; c.classList.toggle('tudo', n >= a.missao.frases);
      }
    });
    raiz.querySelectorAll('details.lv-sec').forEach(function (d) {
      d.addEventListener('toggle', function () { if (d.open) { var st = ler(a.id); st.aberto = d.dataset.sec; gravar(a.id, st); } avisarAltura(); });
    });
  }

  // quando o livro roda dentro de um iframe, avisa a altura pro pai
  function avisarAltura() {
    if (window.parent === window) return;
    setTimeout(function () { try { window.parent.postMessage({ livroAltura: document.documentElement.scrollHeight }, '*'); } catch (e) {} }, 30);
  }

  function carregar(id, cb) {
    if (!window.LIVRO_IMAGENS && !carregar._i) { carregar._i = 1; var ii = document.createElement('script'); ii.src = BASE + 'imagens.js?v=1'; ii.onload = ii.onerror = function () { carregar(id, cb); }; document.head.appendChild(ii); return; }
    if (!window.LIVRO_GLOSSARIO && !carregar._g) { carregar._g = 1; var gg = document.createElement('script'); gg.src = BASE + 'glossario.js?v=1'; gg.onload = gg.onerror = function () { carregar(id, cb); }; document.head.appendChild(gg); return; }
    if (!window.LIVRO_MIDIA && !carregar._m) { carregar._m = 1; var m = document.createElement('script'); m.src = BASE + 'midia.js?v=1'; m.onload = m.onerror = function () { carregar(id, cb); }; document.head.appendChild(m); return; }
    if (AULAS[id]) return cb(AULAS[id]);
    var s = document.createElement('script');
    s.src = BASE + 'aulas/' + encodeURIComponent(id) + '.js';
    s.onload = function () { cb(AULAS[id] || null); };
    s.onerror = function () { cb(null); };
    document.head.appendChild(s);
  }

  window.Livro = {
    abrir: function (el, id, semLivro) {
      if (!el) return;
      el.innerHTML = '<div class="lv lv-carregando">Abrindo o livro da aula…</div>';
      carregar(id, function (a) {
        if (!a) { if (semLivro) { el.innerHTML = ''; semLivro(); } else el.innerHTML = '<div class="lv lv-carregando">Livro da aula ainda não disponível.</div>'; return; }
        if (a.pdf && !/^(https?:|\/)/.test(a.pdf)) a.pdf = BASE.replace(/livro\/$/, '') + a.pdf;
        AUDIOS = {}; Object.keys(a.audios || {}).forEach(function (k) { var u = a.audios[k]; AUDIOS[chave(k)] = /^(https?:|\/)/.test(u) ? u : BASE + u; });
        desenhar(el, a);
      });
    },
    carregar: carregar,
    conferir: conferir,
    falar: falar,
    base: BASE
  };
})();
