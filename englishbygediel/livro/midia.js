/* Vídeos, GIFs e memes do Get By (pasta GETBY do Drive do professor), usados nas aulas.
   galeria: aparece no topo do livro ("Para descontrair" / "Veja em cena").
   cenas:   viram o exercício "Assista e complete" (a frase da cena com uma lacuna). */
(function () {
  var g = function (v, t) { return { v: v, t: t, gif: true }; };
  var m = function (v, t) { return { v: v, t: t }; };
  var c = function (v, frase, resp) { return { v: v, frase: frase, resp: [].concat(resp) }; };
  var OLA = [g('hi-hello', 'Hello!'), g('200w', 'Hello'), g('200w-1', 'Hiiii!'), g('gif-7446', 'Oh, hello there!'), g('giphy', 'Hey there'), g('whats-up-hey', "What's up?")];
  var CUMPR = [c('how-are-you-missed-you', "How are you? I've ___ you so much!", 'missed'), c('hey-dad-hows-it-going', "Hey dad, how's it ___?", 'going'),
    c('how-are-you-doing-terrific', 'How are you doing? ___!', 'Terrific'), c('hi-sacha-im-good-thanks', "Hi Sacha, how are you? I'm ___, thanks.", 'good'),
    c('im-fine-thanks', "I'm ___, thanks.", 'fine'), c('im-very-well-thank-you', "I'm very ___, thank you.", 'well')];
  var PRES = [c('dances-with-darnley', 'She ___ with Darnley.', 'dances'), c('studies-karate', 'She ___ karate.', 'studies'),
    c('he-watches-you', 'He ___ you.', 'watches'), c('has-my-email', 'He ___ my e-mail address.', 'has')];
  var FREQ = [c('guys-dont-usually', "Because guys don't ___ pay attention to details like that.", 'usually'), c('always-the-monster', 'Why am I ___ the monster?', 'always'),
    c('rarely-use', 'Yeah, I have an apartment I ___ use.', 'rarely'), c('sometimes-watches-oliver', 'And he ___ watches Oliver.', 'sometimes'),
    c('hardly-ever-home', "Give me a call here. I'm ___ home.", 'hardly ever'), c('always-testifying', 'He is ___ testifying, he volunteers.', 'always'),
    c('often-very-strong', "They are ___ very strong, you're right about that.", 'often'), c('usually-at-this-time', 'Now, what do you ___ do at this time, Tom?', 'usually')];
  var WH = [c('what-time-nurse', 'What time ___ the nurse come?', 'does'), c('when-does-he-get-back', 'Jesus, when ___ he get back? Tuesday?', 'does'),
    c('how-are-they-doing', 'How ___ they doing?', 'are'), c('where-need-the-bag', 'Where do you ___ the bag?', 'need'),
    c('never-say-my-name', 'Why do you never ___ my name?', 'say'), c('which-car', 'Alex, ___ car do you have?', 'which')];
  var DIR = [c('on-the-corner', "Yeah, it's on the ___ of Lincoln and Seco.", 'corner'), c('elevator-turn-left', 'Take the elevator to the fifth floor, then turn ___.', 'left'),
    c('city-between-the-buildings', 'You see a city ___ the buildings.', 'between'), c('go-past-the-first-station', "You'll go ___ the first station.", 'past')];
  var CONT = [c('studying-business', "He's ___ business.", 'studying'), c('shes-dancing-with-me', "She's ___ with me.", 'dancing')];
  window.LIVRO_MIDIA = {
    'cumprimentos-apresentacoes-e-small-talk': { galeria: OLA, cenas: CUMPR },
    'unit-01': { galeria: OLA, cenas: CUMPR },
    'present-simple-rotinas-e-verdades': { cenas: PRES.concat(FREQ.slice(0, 4)) },
    'unit-13': { cenas: PRES },
    'unit-15': { cenas: FREQ },
    'perguntas-com-wh-what-where-when-who-why-how': { cenas: WH },
    'unit-17': { cenas: WH },
    'cidade-transporte-e-direcoes': { cenas: DIR },
    'unit-21': { cenas: DIR },
    'present-continuous-o-agora': { cenas: CONT },
    'unit-23': { cenas: CONT },
    'sobrevivencia-as-30-frases-que-destravam': { galeria: [m('m-2025-04-28-1803', 'Conversa em inglês que você entende sem falar inglês')] },
    'por-que-voce-nao-entende-o-que-ouve-e-como-mudar': { galeria: [m('m-2025-05-05-1750', '"O teste de listening vai ser fácil"')] },
    'connected-speech-por-que-o-nativo-come-palavras': { galeria: [m('m-2025-08-18-1652', 'Brasileiros com medo de não entender os nativos')] },
    'treino-com-series-e-filmes': { galeria: [m('m-2025-07-28-1425', '"I watch a lot of movies"')] },
    'mensagens-e-redes-sociais-sem-vergonha': { galeria: [m('m-2025-07-28-1426a', 'Quando o inglês é literal demais')] },
    'os-sons-do-ingles-que-nao-existem-em-portugues': { galeria: [m('m-2025-07-28-1426b', 'Quando o professor manda repetir o som')] },
    'bem-vindo-ao-metodo-inteligente': { galeria: [m('m-2025-07-28-1729', '"Irmã, eu queria falar inglês"')] },
    'seu-nivel-cefr-e-o-que-ele-significa': { galeria: [m('m-2025-08-18-1646a', '"Qual é a sua meta do inglês?"')] },
    'expressoes-do-dia-a-dia-que-todo-nativo-usa': { galeria: [m('m-2025-08-18-1646b', 'Se você entendeu a piada, seu inglês está em dia')] },
    'plural-this-that-there-is-are': { galeria: [m('m-2025-09-03-1723', 'POV: ensinando inglês pro meu pai: "What is this?"')] },
    'unit-11': { galeria: [m('m-2025-09-03-1723', 'POV: ensinando inglês pro meu pai: "What is this?"')] },
    'sua-rotina-de-estudo-que-funciona': { galeria: [m('instdown', 'Eu esperando todo mundo chegar pro estudo')] }
  };
  window.LIVRO_MIDIA_FESTA = 'giphy-1';
  // id de cada arquivo no Drive (os slides abrem o vídeo original por aqui)
  window.LIVRO_MIDIA_DRIVE = {"verb-to-be-present-simple": "1oFpMIuZqEmnJ-stJB7OHYTR0VeQG2JqM", "instdown": "17wbcO7r94h0o-knnBAqzMOcKzDeoNnFt", "present-simple-qa-films": "1yRbpeCiijGU8IB0tJS0Ur6i6jEitl7gy", "m-2025-07-28-1729": "1oILFwbemey5cf41N6lC0gF0J7o2e2X62", "giphy": "1QO6Lv-alMVfd4JseCIjQ-ZG5HtAVuthF", "m-2025-08-18-1652": "1y6jQNejI96cN-muow7gG5jQKV0UvTtrP", "m-2025-04-28-1803": "1hgu3iHYavl2PeuVXksG_ZFdt96B6G3TN", "m-2025-08-18-1646a": "1I4-FRZJlu5yRT66Z8rBmGBsf38N-9Ll2", "go-past-the-first-station": "1NdNL-_ldGqjcmQspEgLzoWDGmutEc4C4", "city-between-the-buildings": "1BGBfs8rtweoDaNEXTqrtttAg4FhObzub", "elevator-turn-left": "1HM50Oi2Ws085Y6PXcHu8ze4Kr03EM2ok", "on-the-corner": "1VOtQjzJqDxMwm5-t_wovxuwSa_vV9PQJ", "if-i-didnt-record": "1GaY-EYX6WXQDq_Q39wIDx98CQpf0Qfw3", "always-the-monster": "1DmIYBzf115k6PxAMFFM0VHCGnK0eqrx_", "shes-dancing-with-me": "1hap1jswGSxod414lgYN3gUEzbeRC9Ggz", "never-say-my-name": "1E4yiXJkeEHoHe-vmZMgN0YPmlJMit6Fp", "when-does-he-get-back": "12zl_jUkFzpL6TOvYB7oFhJ5d8NFMuypa", "what-time-nurse": "1hA-zwQ8dqURNObn19K7mriyJTgaiY7wg", "usually-at-this-time": "1gWkifQSo2EJx7LoEUQsoc4wqDZFg0Fw5", "often-very-strong": "1DWdxzzbbr42cW1rFGbA68-5s7ictJE_8", "rarely-use": "1xVdHaTxv4Q6iVGIdyel6ZX1kH29ln-dq", "dances-with-darnley": "1_AFFMRcZE_kTpCLR9lJSnn240lHmEyAz", "studies-karate": "1zlddc7wpcj-tAtjgYDhicsreikG9FFqW", "whats-up-hey": "1bziIqjrhjG2Ds-4xAWQ-4nhFdmg-ID0p", "hi-hello": "1CInRszBq3v2FWZ9y6WuYZqQAJI56wTl-", "m-2025-05-05-1750": "1HjVHTbtzd7z8k8x0RF68piklwPfKtA-p", "m-2025-09-03-1723": "1gdz9VVnliTR1ZcwpQxo5O-My18e4b49S", "where-need-the-bag": "1EeHD5pwA026239SN6VUAyXy9bnH58Adg", "m-2025-07-28-1425": "18TrM8XUzGVbmNcs-bWQ48X9jVqpkq5VP", "m-2025-07-28-1426b": "1M34YQuULxi6vx4HMyqe-_zQ-PlyT1kEl", "studying-business": "10fvLgQ2lB6qoIf91QZMRYg9RStJvSF0D", "which-car": "1RPXHrrfQGLxwWboM0_p8NKqXzOtZMNSq", "hey-dad-hows-it-going": "17zy6bwssIFYgJqYHv0yMELNdOIUgf0nh", "how-are-you-missed-you": "1twYuD-Vv_fG1mHxYA1zduMVTmKkdT1LL", "m-2025-08-18-1646b": "1Ao5mmo6tCpk3YbQuJ36eK0BT9LtIeUXi", "m-2025-07-28-1426a": "1c5OoDmKFiBZ5-9O7yJsMCdAgl0UX0fAf", "im-fine-thanks": "1BzrxEpSdw7ecKDZuYwivfMSZ3rrKNzLz", "he-watches-you": "1vOsUuPXYpT0N_0u0DabeBMRjY0zd8zbL", "im-very-well-thank-you": "1ZyhtFULRa046iiG-BLcxU82u3Uxm5JgB", "how-are-you-doing-terrific": "1jB8OpV_yoSaefwIramioe7_40rJ-16A8", "hi-sacha-im-good-thanks": "1TESYaJgBb2oVzgFEbdoLv2yp1rKqmETg", "gif-7446": "1xD84oLccuiEZWDnsnQrpU89MI0EFEeat", "hardly-ever-home": "17H2hxAte5uHi11dNu21NSVje9ymMNzA4", "guys-dont-usually": "10fb_3wxwgdz0AWW9-xSfXFF6AGE1Ihzm", "how-are-they-doing": "1JxijKXSloc59FWA3saKS-WuJyWzWP8nI", "always-testifying": "1AxEH_7xhKxoeVu5gsvy5gkq9xCJUwR-G", "has-my-email": "1zMNBEXdAB76TOWTSQ2nsd56BSf7ADiWH", "sometimes-watches-oliver": "13TGwMtSRLjNo8bF0k7Z-SekDrDJti-vQ", "giphy-1": "1Rs5gt-DLmrBGak1RQw9VfkyaoHRr7abS", "200w": "1ObnnqQg65ZvLUk1Mn6PmIJlsWmmKmnuH", "200w-1": "1qA0CZIq_pYqHH0qB4-I3jgcknifW9rD4"};
})();
