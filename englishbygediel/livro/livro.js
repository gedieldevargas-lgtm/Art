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
    voz = vs.filter(function (v) { return /^en[-_]US/i.test(v.lang) && /google|samantha|natural|aria|jenny/i.test(v.name); })[0]
      || vs.filter(function (v) { return /^en[-_]US/i.test(v.lang); })[0]
      || vs.filter(function (v) { return /^en/i.test(v.lang); })[0] || null;
  }
  if ('speechSynthesis' in window) { acharVoz(); speechSynthesis.onvoiceschanged = acharVoz; }
  function falar(txt, devagar) {
    if (!('speechSynthesis' in window)) { alert('Seu navegador não tem áudio. Frase: ' + txt); return; }
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(txt);
    u.lang = 'en-US'; if (voz) u.voice = voz;
    u.rate = devagar ? 0.6 : 0.92;
    speechSynthesis.speak(u);
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
          h += '<button type="button" class="lv-card" data-falar="' + esc(it[0].split(' / ')[0]) + '">' + (it[2] ? '<span class="lv-emo">' + it[2] + '</span>' : '') +
            '<span class="en">' + esc(it[0]) + '</span><span class="pt">' + esc(it[1]) + '</span></button>';
        });
        h += '</div></div>';
      } else if (b.tipo === 'dialogo') {
        h += '<div class="lv-bloco"><div class="lv-bt">' + esc(b.titulo) + ' <button type="button" class="lv-mini" data-falar="' + esc(b.falas.map(function (f) { return f[1]; }).join(' ... ')) + '">▶ ouvir tudo</button></div><div class="lv-dial">';
        b.falas.forEach(function (f, i) {
          h += '<div class="lv-fala ' + (i % 2 ? 'b' : 'a') + '"><b>' + esc(f[0]) + '</b><div><span class="en">' + esc(f[1]) + '</span> ' + btnSom(f[1]) + '<span class="pt">' + esc(f[2]) + '</span></div></div>';
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
          '<span>' + esc(it.p) + '</span>' + btnSom(it.p) + '</div><div class="lv-ops">';
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
    } else if (ex.tipo === 'conversa') {
      ex.linhas.forEach(function (ln, i) {
        var k = ex.id + '.' + i;
        h += '<div class="lv-item col' + marca(k) + '" data-k="' + k + '"><div class="lv-perg"><b>' + esc(ln.quem) + ':</b> <span class="pt">🇧🇷 ' + esc(ln.pt) + '</span></div>' +
          '<input class="lv-inp" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="🇺🇸 Em inglês…" value="' + esc((st.txt || {})[k] || '') + '"><div class="lv-fb"></div></div>';
      });
    }
    return h;
  }

  function desenhar(el, a) {
    var st = ler(a.id), tot = totalItens(a), ok = acertos(a, st);
    var aberto = st.aberto || 'revisar';
    var h = '<div class="lv" data-aula="' + esc(a.id) + '">' +
      '<div class="lv-head"><div><div class="lv-kick">📘 LIVRO DA AULA · ' + esc(a.nivel).toUpperCase() + ' · UNIT ' + a.unidade + '</div>' +
      '<div class="lv-tit">' + esc(a.titulo) + ' <small>' + esc(a.subtitulo || '') + '</small></div></div>' +
      '<a class="lv-baixar" href="' + esc(a.pdf ? a.pdf : BASE + 'ebook.html?u=' + a.id) + '" target="_blank" rel="noopener"' + (a.pdf ? ' download' : '') + '>⬇ Baixar e-book</a></div>' +
      '<div class="lv-prog"><div class="lv-bar"><i style="width:' + Math.round(ok / tot * 100) + '%"></i></div><span>' + ok + '/' + tot + ' acertos</span></div>';

    h += '<details class="lv-sec" data-sec="revisar"' + (aberto === 'revisar' ? ' open' : '') + '><summary>🔁 Revisar a aula <em>toque para ouvir</em></summary><div class="lv-corpo">' + htmlRevisar(a) + '</div></details>';
    a.exercicios.forEach(function (ex, n) {
      var itens = (ex.itens || ex.linhas), feitos = itens.filter(function (_, i) { var v = (st.feito || {})[ex.id + '.' + i]; return v === 'ok' || v === 'quase'; }).length;
      h += '<details class="lv-sec" data-sec="' + ex.id + '" data-ex="' + ex.id + '"' + (aberto === ex.id ? ' open' : '') + '><summary>' +
        '<span class="lv-num">' + (n + 1) + '</span>' + esc(ex.titulo) + ' <em class="lv-cont' + (feitos === itens.length ? ' tudo' : '') + '">' + feitos + '/' + itens.length + '</em></summary>' +
        '<div class="lv-corpo"><p class="lv-inst">' + esc(ex.instrucao) + '</p>' + htmlEx(a, ex, st) +
        '<div class="lv-acoes"><button type="button" class="lv-btn" data-corrigir="' + ex.id + '">✔ Corrigir</button>' +
        '<button type="button" class="lv-btn sec" data-gabarito="' + ex.id + '">Ver respostas</button>' +
        '<button type="button" class="lv-btn sec" data-limpar="' + ex.id + '">Refazer</button></div></div></details>';
    });
    if (a.missao) {
      var nf = ((st.frases || '').split('\n').filter(function (x) { return x.trim(); })).length;
      h += '<details class="lv-sec" data-sec="missao"' + (aberto === 'missao' ? ' open' : '') + '><summary>🎯 Missão da aula <em class="lv-cont' + (nf >= a.missao.frases ? ' tudo' : '') + '">' + Math.min(nf, a.missao.frases) + '/' + a.missao.frases + '</em></summary><div class="lv-corpo">' +
        '<div class="lv-dica">🗣️ Responda em voz alta, 2 vezes: <b>' + esc(a.missao.falar) + '</b> ' + btnSom(a.missao.falar) + '</div>' +
        '<p class="lv-inst">Escreva ' + a.missao.frases + ' frases e perguntas com o que aprendeu (uma por linha). Ex: ' + esc(a.missao.exemplo) + '</p>' +
        '<textarea class="lv-frases" rows="8" placeholder="1 frase por linha…">' + esc(st.frases || '') + '</textarea>' +
        '<div class="lv-mini-info">Fica salvo neste aparelho.</div></div></details>';
    }
    h += '</div>';
    el.innerHTML = h;
    ligar(el, a);
    avisarAltura();
  }

  function corrigir(el, a, exId, mostrar) {
    var ex = a.exercicios.filter(function (e) { return e.id === exId; })[0];
    var st = ler(a.id); st.feito = st.feito || {}; st.txt = st.txt || {};
    var sec = el.querySelector('[data-ex="' + exId + '"]');
    var certos = 0, total = (ex.itens || ex.linhas).length;
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

  function festa(el) {
    if (el.querySelector('.lv-festa')) return;
    var d = document.createElement('div'); d.className = 'lv-festa';
    d.innerHTML = '🏆 <b>Livro da aula completo!</b> Agora baixe o e-book e faça a missão no caderno.';
    el.querySelector('.lv').insertBefore(d, el.querySelector('.lv-sec'));
  }

  function ligar(el, a) {
    var raiz = el.querySelector('.lv');
    raiz.addEventListener('click', function (e) {
      var t = e.target.closest('button,[data-ver]'); if (!t) return;
      if (t.dataset.falar) { falar(t.dataset.falar, !!t.dataset.lento); return; }
      if (t.dataset.ver) { t.textContent = '🇺🇸 ' + t.dataset.ver; return; }
      if (t.dataset.corrigir) return corrigir(el, a, t.dataset.corrigir, false);
      if (t.dataset.gabarito) return corrigir(el, a, t.dataset.gabarito, true);
      if (t.dataset.limpar) {
        var st = ler(a.id); Object.keys(st.feito || {}).concat(Object.keys(st.txt || {})).forEach(function (k) {
          if (k.indexOf(t.dataset.limpar + '.') === 0) { delete (st.feito || {})[k]; delete (st.txt || {})[k]; }
        });
        st.aberto = t.dataset.limpar; gravar(a.id, st); desenhar(el, a); return;
      }
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
        desenhar(el, a);
      });
    },
    carregar: carregar,
    conferir: conferir,
    falar: falar,
    base: BASE
  };
})();
