/* Voz única do site: toda fala em inglês (jogos, lições, exercícios, Prisma, Bússola, livro) usa a mesma voz.
   Padrão: "Google US English". O aluno pode trocar no menu dos jogos; a escolha vale pro site todo. */
(function () {
  if (!('speechSynthesis' in window) || window.EBG_VOZ) return;
  var KEY = 'ebg:voz';
  function en() { try { return speechSynthesis.getVoices().filter(function (v) { return /^en/i.test(v.lang); }); } catch (e) { return []; } }
  function score(v) {
    var n = v.name, s = 0;
    if (/^Google US English$/i.test(n)) s += 20;
    if (/natural|neural|online|premium|enhanced/i.test(n)) s += 6;
    if (/Google (US|UK)|Samantha|Ava|Allison|Zoe|Aria|Jenny|Guy|Daniel|Karen|Moira|Serena/i.test(n)) s += 3;
    if (/en[-_]US/i.test(v.lang)) s += 2;
    if (/compact|espeak|fred|albert|bad |bahh|bells|boing|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|junior|ralph|kathy/i.test(n)) s -= 8;
    return s;
  }
  function saved() { try { return localStorage.getItem(KEY) || ''; } catch (e) { return ''; } }
  function voice() {
    var vs = en(), n = '';
    return (n && vs.filter(function (v) { return v.name === n; })[0]) || vs.slice().sort(function (a, b) { return score(b) - score(a); })[0] || null;
  }
  function set(name) { try { localStorage.setItem(KEY, name); } catch (e) {} }
  window.EBG_VOZ = { voice: voice, set: set, lista: function () { return en().sort(function (a, b) { return score(b) - score(a); }); } };
  var ios = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent) && 'ontouchend' in document; /* no iOS escolher voz à mão pode deixar mudo: lá vale a voz do idioma */
  var orig = speechSynthesis.speak.bind(speechSynthesis);
  speechSynthesis.speak = function (u) {
    try { if (!ios && u && (!u.lang || /^en/i.test(u.lang))) { var v = voice(); if (v) { u.voice = v; u.lang = v.lang; } } } catch (e) {}
    return orig(u);
  };
  try { speechSynthesis.getVoices(); } catch (e) {}
})();
