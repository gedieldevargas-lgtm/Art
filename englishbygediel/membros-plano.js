/* MEU PLANO — plano de autodisciplina que cada aluno monta sozinho.
   1) escolhe o resultado (20 opções)  2) ajusta horas, minutos por dia, dias da semana e início
   3) recebe o cronograma: sessões com data, etapas e um intensivo por semana
   4) marca os dias na plataforma (conta na sequência) ou imprime a folha e risca na parede.
   Estado: ST.plano (salvo no aparelho e na conta, junto com o resto do progresso do aluno). */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (x) { return String(x == null ? '' : x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var S = function () { return (window.EBG_ACESSO || {}).estado || {}; };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var iso = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
  var deIso = function (s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); };
  var DSEM = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'], ORDEM = [1, 2, 3, 4, 5, 6, 0];
  var fmt = function (d) { return pad(d.getDate()) + '/' + pad(d.getMonth() + 1); };
  var fmtL = function (d) { return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' }); };

  /* ───────── os 20 resultados ─────────
     h = horas totais sugeridas · e = 4 etapas [título, o que fazer, área da plataforma, trecho do nome do módulo]
     r = 3 atividades que se alternam nas sessões · i = o intensivo da semana */
  var G = [
    { id: 'falar', ic: '🗣️', n: 'Perder o medo de falar', h: 60, e: [['Quebrar o silêncio', 'Falar sozinho em voz alta, sem se corrigir', 'prompts', ''], ['Frases que destravam', '30 frases prontas pra qualquer conversa', '', 'Conversação A1'], ['Conversar com a IA', 'Conversa de 10 minutos e gravar o áudio', 'prompts', ''], ['Conversa de verdade', 'Falar com gente: live, amigo ou mentoria', 'lives', '']], r: ['Aquecer: repita 5 frases em voz alta', 'Fale 3 minutos gravando o áudio, sem parar', 'Ouça sua gravação e anote 1 coisa pra melhorar'], i: 'Grave um áudio de 3 minutos se apresentando e mande pra alguém.' },
    { id: 'viagem', ic: '✈️', n: 'Me virar em viagem', h: 40, e: [['Sobrevivência', 'Aeroporto, hotel e transporte', '', 'Vocabulário'], ['Comer e comprar', 'Restaurante, loja e preços', '', 'Vocabulário'], ['Pedir ajuda e direções', 'Se perder sem entrar em pânico', '', 'Conversação A1'], ['Simulação da viagem', 'Ensaiar a viagem inteira com a IA', 'prompts', '']], r: ['Aprenda 8 palavras do cenário da etapa', 'Ensaie 3 diálogos em voz alta', 'Simule a situação com a IA'], i: 'Ensaie um dia inteiro de viagem em inglês, do aeroporto ao jantar.' },
    { id: 'entrevista', ic: '💼', n: 'Passar em entrevista de emprego', h: 50, e: [['Apresentação pessoal', 'Quem sou eu em 60 segundos', '', 'Conversação A1'], ['Experiência e conquistas', 'Contar o que você já fez', '', 'Business'], ['Perguntas difíceis', 'Pontos fracos, salário, por que você', '', 'Conversação B1'], ['Simulado de entrevista', 'Entrevista completa com a IA', 'prompts', '']], r: ['Escreva e leia em voz alta 1 resposta', 'Treine a resposta sem olhar o texto', 'Refine com a IA e repita'], i: 'Faça uma entrevista completa de 20 minutos com a IA e grave.' },
    { id: 'trabalho', ic: '🏢', n: 'Reuniões e e-mails do trabalho', h: 80, e: [['Vocabulário do trabalho', 'As palavras da sua área', '', 'Business'], ['E-mails', 'Escrever claro e profissional', '', 'Escrita'], ['Reuniões', 'Participar, discordar, pedir esclarecimento', '', 'Business'], ['Apresentações', 'Apresentar e convencer', '', 'Business']], r: ['Aprenda 6 termos e use em frases', 'Escreva um e-mail ou resposta real', 'Treine falando como se fosse a reunião'], i: 'Simule uma reunião de 15 minutos sobre o seu trabalho.' },
    { id: 'series', ic: '🎬', n: 'Entender séries e filmes sem legenda', h: 120, e: [['Ouvido treinado', 'Cenas curtas com legenda em inglês', '', 'Séries'], ['Repetir a cena', 'Imitar falas e ritmo', '', 'Séries'], ['Menos legenda', 'Primeiro com legenda, depois sem', 'culture', ''], ['Sem legenda', 'Episódio inteiro e anotar o que entendeu', 'culture', '']], r: ['Assista 1 cena de 3 minutos com legenda em inglês', 'Reveja a mesma cena sem legenda', 'Anote 5 expressões e use em frases'], i: 'Assista a 1 episódio inteiro e conte em inglês o que entendeu.' },
    { id: 'musicas', ic: '🎵', n: 'Entender músicas e letras', h: 30, e: [['Ouvir com atenção', 'Letra na tela e ouvir 3 vezes', '', 'Música'], ['Entender a letra', 'Significado e gramática escondida', '', 'Música'], ['Pronúncia pela música', 'Cantar junto sem atropelar', '', 'Música'], ['Worship e favoritas', 'Músicas que você ama', '', 'Música']], r: ['Ouça 1 música lendo a letra', 'Anote 5 palavras novas e o sentido', 'Cante junto, devagar e depois no ritmo'], i: 'Aprenda 1 música inteira e cante sem olhar a letra.' },
    { id: 'pronuncia', ic: '🔊', n: 'Pronúncia clara', h: 50, e: [['Sons novos', 'Os sons que a boca brasileira não faz', '', 'Sons'], ['Ritmo e sílaba forte', 'Falar com ritmo, não palavra por palavra', '', 'Sons'], ['Conexões', 'Como o nativo junta as palavras', '', 'Sons'], ['Método do espelho', 'Imitar até virar', '', 'Sons']], r: ['Aquecimento: 5 pares de sons parecidos', 'Imite uma frase de nativo 10 vezes', 'Grave, compare com o original e ajuste'], i: 'Grave 1 minuto lendo um texto e compare com a versão de um nativo.' },
    { id: 'podcasts', ic: '🎧', n: 'Entender podcasts e nativos em velocidade real', h: 80, e: [['Por que não entendo', 'Entender o problema e mudar o jeito de ouvir', '', 'Listening'], ['Velocidade real', 'Áudios curtos, sem pausa', '', 'Listening'], ['Sotaques', 'Americano, britânico e outros', '', 'Listening'], ['Episódio completo', 'Um podcast inteiro e resumir', '', 'Listening']], r: ['Ouça 5 minutos sem pausar', 'Ouça de novo lendo a transcrição', 'Resuma em 3 frases o que entendeu'], i: 'Ouça um episódio inteiro e escreva um resumo de 5 linhas.' },
    { id: 'leitura', ic: '📖', n: 'Ler livros e artigos', h: 70, e: [['Vocabulário de leitura', 'As palavras que mais aparecem', '', 'Vocabulário'], ['Textos curtos', 'Notícias e posts', 'materiais', ''], ['Artigos', 'Textos de 1 a 2 páginas', 'materiais', ''], ['Livro', 'Um livro inteiro, um pouco por dia', 'materiais', '']], r: ['Leia 1 página sem parar pra traduzir', 'Releia marcando 5 palavras novas', 'Escreva 2 frases sobre o que leu'], i: 'Leia um capítulo inteiro e conte a história em inglês.' },
    { id: 'escrita', ic: '✍️', n: 'Escrever com confiança', h: 50, e: [['Frases certas', 'Escrever frases simples sem erro', '', 'Escrita'], ['E-mails e mensagens', 'Escrever com clareza', '', 'Escrita'], ['Redes sociais', 'Postar sem medo', '', 'Escrita'], ['Textos maiores', 'Parágrafos e textos conectados', 'prompts', '']], r: ['Escreva 5 frases sobre o seu dia', 'Escreva um texto curto e peça correção à IA', 'Reescreva o texto aplicando as correções'], i: 'Escreva um texto de 1 página e passe pela correção da IA.' },
    { id: 'palavras', ic: '🔤', n: 'As 1.000 palavras mais usadas', h: 40, e: [['Primeiras 250', 'As palavras que resolvem metade das conversas', '', 'Vocabulário'], ['250 a 500', 'Ações, coisas e lugares', 'jogos', ''], ['500 a 750', 'Sentimentos, tempo e rotina', 'jogos', ''], ['750 a 1.000', 'Fechar e revisar tudo', '', 'Vocabulário']], r: ['Aprenda 10 palavras novas em frases', 'Jogue pra fixar o que aprendeu', 'Revise as palavras dos dias anteriores'], i: 'Revisão geral: use 30 palavras da etapa em frases e fale em voz alta.' },
    { id: 'a1a2', ic: '🌱', n: 'Base do zero (A1 para A2)', h: 90, e: [['Ser e estar', 'Verbo to be e primeiras frases', '', 'Gramática A1'], ['Rotina e presente', 'Falar do seu dia a dia', '', 'Gramática A1'], ['Perguntas e palavras úteis', 'Fazer e responder perguntas', '', 'Gramática A1'], ['Conversar o básico', 'Pôr tudo em prática', '', 'Conversação A1']], r: ['Assista à aula ou revise a anterior', 'Faça os exercícios e fale as frases em voz alta', 'Jogue ou escreva 5 frases com o que aprendeu'], i: 'Apresente-se por 2 minutos: nome, rotina, família e gostos.' },
    { id: 'a2b1', ic: '🌿', n: 'A2 para B1', h: 120, e: [['Passado', 'Contar o que aconteceu', '', 'Gramática A2'], ['Futuro e já fez?', 'Planos e experiências', '', 'Gramática A2'], ['Phrasal verbs', 'Os mais usados no dia a dia', '', 'Phrasal'], ['Conversação e listening', 'Entender e responder em tempo real', '', 'Conversação B1']], r: ['Estude o conteúdo da etapa (aula ou revisão)', 'Pratique falando ou escrevendo 8 frases', 'Ouça 5 minutos de áudio e resuma'], i: 'Conte uma história do seu passado em 3 minutos, sem parar.' },
    { id: 'b1b2', ic: '🌳', n: 'B1 para B2', h: 180, e: [['Expressões e idioms', 'Falar de forma mais natural', '', 'Idioms'], ['Phrasal verbs avançados', 'Separáveis e inseparáveis', '', 'Phrasal'], ['Argumentar', 'Concordar, discordar, convencer', '', 'Conversação B1'], ['Fluência', 'Falar e escrever sobre temas abstratos', '', 'Escrita']], r: ['Estude 5 expressões novas com exemplos', 'Fale 5 minutos sobre um tema e grave', 'Escreva um parágrafo opinando e peça correção'], i: 'Debate de 15 minutos com a IA ou com uma pessoa sobre um tema polêmico.' },
    { id: 'visto', ic: '🛂', n: 'Preparar intercâmbio ou visto', h: 40, e: [['Documentos e formulários', 'Vocabulário de burocracia e viagem', 'viagens', ''], ['Entrevista do visto', 'Perguntas e respostas curtas e honestas', '', 'Conversação A1'], ['Chegada e vida no país', 'Moradia, banco, transporte', '', 'Vocabulário'], ['Simulação completa', 'Entrevista e chegada com a IA', 'prompts', '']], r: ['Aprenda 8 palavras do cenário', 'Treine 3 perguntas e respostas em voz alta', 'Simule o diálogo com a IA'], i: 'Simule a entrevista do visto do começo ao fim, em inglês, sem olhar as respostas.' },
    { id: 'igreja', ic: '🙏', n: 'Ensinar ou orar em inglês (igreja e missões)', h: 60, e: [['Vocabulário de fé', 'Palavras da igreja e da oração', 'eom', ''], ['Orar em inglês', 'Orações simples e naturais', 'eom', ''], ['Worship em inglês', 'Cantar e conduzir', '', 'Música'], ['Ensinar e ministrar', 'Compartilhar uma mensagem curta', 'eom', '']], r: ['Aprenda 6 palavras ou frases de fé', 'Escreva e leia em voz alta uma oração', 'Pratique em voz alta o que vai dizer'], i: 'Prepare e grave uma mensagem de 3 minutos em inglês.' },
    { id: 'biblia', ic: '📜', n: 'Ler a Bíblia em inglês', h: 50, e: [['Primeiros versículos', 'Ler com a Bíblia linear', 'eom', ''], ['Palavras-chave', 'O vocabulário que mais se repete', 'eom', ''], ['Capítulos curtos', 'Provérbios e Salmos', 'eom', ''], ['Leitura contínua', 'Um livro inteiro', 'eom', '']], r: ['Leia 1 trecho na Bíblia linear', 'Releia sem olhar a tradução', 'Escreva em inglês o que o texto diz'], i: 'Leia um capítulo inteiro e explique em inglês a ideia principal.' },
    { id: 'prova', ic: '🎓', n: 'Preparar prova (TOEFL, IELTS, Cambridge)', h: 150, e: [['Diagnóstico', 'Descobrir seu nível e seus pontos fracos', 'bussola', ''], ['Gramática e vocabulário', 'Fechar as lacunas', '', 'Gramática A2'], ['Listening e leitura', 'Treinar no formato da prova', '', 'Listening'], ['Simulados', 'Provas completas com tempo', '', 'Escrita']], r: ['Estude o ponto fraco da etapa', 'Faça exercícios no formato da prova', 'Revise os erros e anote as regras'], i: 'Faça um simulado completo, com tempo, e corrija todos os erros.' },
    { id: 'familia', ic: '👨‍👩‍👧', n: 'Inglês em casa com os filhos', h: 30, e: [['Palavras da casa', 'Objetos, cores e comidas', 'jogos', ''], ['Rotina em inglês', 'Bom dia, boa noite, hora de comer', '', 'Vocabulário'], ['Brincar em inglês', 'Jogos e músicas', 'jogos', ''], ['Histórias', 'Ler e contar pequenas histórias', 'materiais', '']], r: ['Ensine 5 palavras do dia pra família', 'Jogue ou cante junto', 'Use 3 frases em inglês durante o dia'], i: 'Faça um dia da família só com frases em inglês (as que vocês já sabem).' },
    { id: 'retomar', ic: '🔄', n: 'Retomar o inglês que esqueci', h: 40, e: [['Descobrir onde parou', 'Saber seu nível de verdade', 'bussola', ''], ['Reativar a base', 'Os tempos verbais que mais usamos', '', 'Gramática A1'], ['Vocabulário vivo', 'As palavras que voltam rápido', '', 'Vocabulário'], ['Voltar a conversar', 'Falar sem vergonha de errar', '', 'Conversação A1']], r: ['Revise 1 ponto da etapa', 'Fale ou escreva 8 frases com ele', 'Ouça 5 minutos de algo que você gosta'], i: 'Converse 10 minutos (com a IA ou com alguém) sobre o seu dia, sem parar.' }
  ];
  var porId = function (id) { return G.filter(function (g) { return g.id === id; })[0]; };

  /* ───────── cálculo do cronograma ───────── */
  function sessoes(p) {
    var g = porId(p.g) || G[0], N = p.N, ante = p.antes || 0, rest = Math.max(0, N - ante), out = [], d = deIso(p.ini), guard = 0;
    while (out.length < rest && guard++ < 1500) {
      if (p.dias.indexOf(d.getDay()) >= 0) out.push({ n: ante + out.length + 1, d: new Date(d), iso: iso(d) });
      d.setDate(d.getDate() + 1);
    }
    var semana = function (dt) { var x = new Date(dt); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return iso(x); }, grupos = {};
    out.forEach(function (s) { (grupos[semana(s.d)] = grupos[semana(s.d)] || []).push(s); });
    Object.keys(grupos).forEach(function (k, wi) { var l = grupos[k]; l.forEach(function (s) { s.sem = k; }); if (l.length >= 2) l[l.length - 1].intensivo = true; });
    out.forEach(function (s) {
      var f = Math.min(3, Math.floor((s.n - 1) * 4 / N)); s.fase = f; s.et = g.e[f]; s.ativ = g.r[(s.n - 1) % 3];
      s.feito = !!(p.marc && p.marc[s.iso]); if (s.n === N) { s.final = true; s.intensivo = true; }
    });
    return out;
  }
  function stats(p) {
    var l = sessoes(p), feitas = l.filter(function (s) { return s.feito; }).length, tot = (p.antes || 0) + feitas, hoje = iso(new Date());
    var prox = l.filter(function (s) { return !s.feito; })[0] || null;
    var atras = l.filter(function (s) { return !s.feito && s.iso < hoje; }).length;
    return { l: l, feitas: feitas, total: tot, pct: Math.min(100, Math.round(tot * 100 / p.N)), prox: prox, atras: atras, fim: l.length ? l[l.length - 1].d : null, hoje: l.filter(function (s) { return s.iso === hoje; })[0] || null };
  }
  function calcular(g, h, min, dias, ini) {
    var N = Math.max(1, Math.ceil(h * 60 / min)); var p = { g: g, h: h, min: min, dias: dias, ini: ini, N: N, antes: 0, marc: {}, upd: Date.now() };
    return p;
  }

  /* ───────── estado e armazenamento ───────── */
  var V = { tela: 'inicio', g: null, h: 60, min: 30, dias: [1, 2, 3, 4, 5], ini: iso(new Date()), novo: false, aviso: '' };
  var A = function () { return window.MI_APP; };
  var plano = function () { return A() && A().plano ? A().plano() : null; };
  function guardar(p) { p.upd = Date.now(); if (A() && A().salvarPlano) A().salvarPlano(p); }

  /* ───────── interface ───────── */
  var css = document.createElement('style');
  css.textContent =
    '#pane-plano .pl{max-width:920px;margin:0 auto;display:flex;flex-direction:column;gap:16px}' +
    '#pane-plano h2{margin:0;font-size:24px;font-weight:800}#pane-plano .sub{color:var(--fg2);font-size:14px;line-height:1.5;margin-top:4px}' +
    '.pl-b{border:1px solid var(--border);background:var(--surface2);color:var(--fg);border-radius:12px;padding:10px 16px;font:inherit;font-weight:700;font-size:14px;cursor:pointer;transition:transform .15s,box-shadow .15s}' +
    '.pl-b:hover{transform:translateY(-1px);box-shadow:0 6px 16px rgba(0,0,0,.18)}.pl-b.p{background:var(--accent);color:#fff;border-color:transparent}.pl-b.s{padding:7px 12px;font-size:13px}.pl-b[disabled]{opacity:.45;cursor:default;transform:none;box-shadow:none}' +
    '.pl-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px}' +
    '.pl-card{display:flex;flex-direction:column;align-items:flex-start;gap:8px;text-align:left;border:1px solid var(--border);background:var(--surface);color:var(--fg);border-radius:18px;padding:16px;font:inherit;cursor:pointer;transition:transform .18s,box-shadow .18s}' +
    '.pl-card:hover{transform:translateY(-3px) scale(1.01);box-shadow:0 12px 28px rgba(0,0,0,.2)}.pl-card .ic{font-size:30px;line-height:1}.pl-card b{font-size:14.5px;line-height:1.3}.pl-card span{font-size:12.5px;color:var(--fg2)}' +
    '.pl-box{background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:18px}.pl-box h3{margin:0 0 10px;font-size:15px;font-weight:800}' +
    '.pl-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.pl-chip{border:1px solid var(--border);background:var(--surface2);color:var(--fg);border-radius:99px;padding:9px 16px;font:inherit;font-weight:700;font-size:14px;cursor:pointer}.pl-chip.on{background:var(--accent);color:#fff;border-color:transparent}' +
    '.pl-inp{border:1px solid var(--border);background:var(--surface2);color:var(--fg);border-radius:12px;padding:10px 12px;font:inherit;font-size:15px;width:110px;box-sizing:border-box}' +
    '.pl-prev{background:linear-gradient(135deg,var(--accent),#7c5cf7);color:#fff;border-radius:18px;padding:18px;font-size:15px;line-height:1.5}.pl-prev b{font-size:20px}' +
    '.pl-bar{height:12px;border-radius:99px;background:var(--surface2);overflow:hidden}.pl-bar i{display:block;height:100%;background:var(--green,#1b8f6b);border-radius:99px}' +
    '.pl-hoje{border:2px solid var(--accent)}.pl-hoje .t{font-size:18px;font-weight:800;margin:2px 0 4px}.pl-hoje .f{color:var(--fg2);font-size:14px;line-height:1.5}' +
    '.pl-sem{display:flex;flex-direction:column;gap:8px}.pl-sem .wl{font-size:12px;font-weight:800;color:var(--fg2);text-transform:uppercase;letter-spacing:.5px}' +
    '.pl-dias{display:grid;grid-template-columns:repeat(auto-fill,minmax(88px,1fr));gap:8px}' +
    '.pl-d{display:flex;flex-direction:column;align-items:center;gap:2px;border:1px solid var(--border);background:var(--surface);color:var(--fg);border-radius:14px;padding:10px 6px;font:inherit;cursor:pointer;position:relative}' +
    '.pl-d small{font-size:11px;color:var(--fg2)}.pl-d b{font-size:15px}.pl-d .k{font-size:18px;height:22px}.pl-d.ok{background:rgba(27,143,107,.16);border-color:rgba(27,143,107,.5)}.pl-d.atr{border-color:rgba(239,68,68,.55);background:rgba(239,68,68,.07)}.pl-d.hj{border:2px solid var(--accent)}.pl-d.fut{opacity:.6;cursor:default}.pl-d .int{position:absolute;top:4px;right:6px;font-size:12px}' +
    '.pl-et{display:flex;gap:10px;align-items:flex-start;padding:10px 0;border-top:1px solid var(--border)}.pl-et:first-of-type{border-top:0}.pl-et .nn{flex:none;width:28px;height:28px;border-radius:99px;background:var(--surface2);display:grid;place-items:center;font-weight:800;font-size:13px}.pl-et.on .nn{background:var(--accent);color:#fff}.pl-et .tx{flex:1;min-width:0}.pl-et small{display:block;color:var(--fg2);font-size:12.5px;line-height:1.4}' +
    '#pl-print{display:none}' +
    '@media print{body.pl-printing>*:not(#pl-print){display:none!important}body.pl-printing{padding:0!important;background:#fff!important}#pl-print{display:block!important;color:#000;background:#fff;font-family:Arial,Helvetica,sans-serif;padding:0}' +
    '#pl-print h1{font-size:22px;margin:0 0 2px}#pl-print .m{font-size:12px;color:#444;margin-bottom:8px}#pl-print .cm{border:1.5px solid #000;border-radius:8px;padding:8px 12px;font-size:12.5px;margin:8px 0 12px}#pl-print .wk{page-break-inside:avoid;margin-bottom:10px}#pl-print .wk .l{font-size:11px;font-weight:700;margin-bottom:4px;text-transform:uppercase}' +
    '#pl-print .row{display:flex;gap:6px;flex-wrap:wrap}#pl-print .b{width:84px;border:1.5px solid #000;border-radius:8px;padding:5px;text-align:center;font-size:11px;position:relative}#pl-print .b .q{display:block;width:26px;height:26px;border:2px solid #000;border-radius:5px;margin:4px auto 2px}#pl-print .b .z{position:absolute;top:2px;right:4px;font-size:11px}#pl-print .et{font-size:11.5px;margin-top:4px}#pl-print .ft{font-size:10.5px;color:#444;margin-top:10px;border-top:1px solid #999;padding-top:6px}@page{size:A4;margin:12mm}}';
  document.head.appendChild(css);

  function montar() {
    if ($('pane-plano')) return true;
    var home = $('pane-home'); if (!home || !home.parentNode) return false;
    var p = document.createElement('div'); p.className = 'pane'; p.id = 'pane-plano'; home.parentNode.appendChild(p);
    var pr = document.createElement('div'); pr.id = 'pl-print'; document.body.appendChild(pr);
    if (window.TITLES) TITLES.plano = 'Meu plano';
    var base = [].filter.call(document.querySelectorAll('.nav-pill'), function (n) { return /goTo\('maratona'/.test(n.getAttribute('onclick') || ''); })[0];
    if (base && !$('nav-plano')) {
      var n = document.createElement('div'); n.className = 'nav-pill'; n.id = 'nav-plano'; n.setAttribute('onclick', "goTo('plano',this)");
      n.innerHTML = '<span class="nav-icon">🎯</span><span>Meu plano</span><span class="nav-badge">Novo</span>'; base.insertAdjacentElement('afterend', n);
    }
    return true;
  }

  var back = function (alvo, txt) { return '<div><button type="button" class="pl-b s" data-pl="' + alvo + '">← ' + txt + '</button></div>'; };

  function telaInicio() {
    return '<div class="pl"><div><h2>🎯 Meu plano de autodisciplina</h2><div class="sub">Você escolhe o resultado que quer, diz quanto tempo tem, e eu monto o seu cronograma. Marque aqui ou imprima e risque na parede.</div></div>' +
      '<div class="pl-box" style="border-color:var(--accent)"><h3>Quer começar rápido?</h3><div class="sub" style="margin:0 0 12px">Plano recomendado do Gediel: <b>perder o medo de falar</b>, 30 minutos por dia, de segunda a sexta.</div><button type="button" class="pl-b p" data-pl="pronto">Usar o plano recomendado</button></div>' +
      '<div><h3 style="margin:0 0 4px;font-size:16px">Ou escolha o seu resultado</h3><div class="sub" style="margin:0 0 12px">Qual resultado você quer ter?</div></div>' +
      '<div class="pl-grid">' + G.map(function (g) { return '<button type="button" class="pl-card" data-pl="g" data-id="' + g.id + '"><span class="ic">' + g.ic + '</span><b>' + esc(g.n) + '</b><span>≈ ' + g.h + ' horas</span></button>'; }).join('') + '</div></div>';
  }
  function resumoAjuste() {
    var g = porId(V.g), N = Math.max(1, Math.ceil(V.h * 60 / V.min)), tmp = { g: V.g, N: N, ini: V.ini, dias: V.dias, antes: 0, marc: {} };
    if (!V.dias.length) return '<div class="pl-prev">Escolha pelo menos 1 dia da semana.</div>';
    var l = sessoes(tmp), fim = l[l.length - 1], sem = Math.ceil(N / V.dias.length);
    return '<div class="pl-prev"><b>' + N + ' sessões</b> de ' + V.min + ' min · ' + V.dias.length + ' dia' + (V.dias.length > 1 ? 's' : '') + ' por semana ≈ <b>' + sem + ' semanas</b><br>Você termina em <b>' + (fim ? fmtL(fim.d) : '—') + '</b>. Um intensivo por semana. 🔥</div>';
  }
  function telaAjuste() {
    var g = porId(V.g);
    return '<div class="pl">' + back('inicio', 'Escolher outro resultado') +
      '<div><h2>' + g.ic + ' ' + esc(g.n) + '</h2><div class="sub">Ajuste ao seu jeito. A sugestão é de ' + g.h + ' horas de estudo no total.</div></div>' +
      '<div class="pl-box"><h3>Quantas horas no total?</h3><div class="pl-row"><input class="pl-inp" id="pl-h" type="number" min="5" max="400" value="' + V.h + '"><span class="sub" style="margin:0">horas (' + g.h + ' é a sugestão)</span></div></div>' +
      '<div class="pl-box"><h3>Quanto tempo por dia?</h3><div class="pl-row">' + [15, 20, 30, 45, 60, 90].map(function (m) { return '<button type="button" class="pl-chip' + (V.min === m ? ' on' : '') + '" data-pl="min" data-v="' + m + '">' + m + ' min</button>'; }).join('') + '</div></div>' +
      '<div class="pl-box"><h3>Em quais dias da semana?</h3><div class="pl-row">' + ORDEM.map(function (d) { return '<button type="button" class="pl-chip' + (V.dias.indexOf(d) >= 0 ? ' on' : '') + '" data-pl="dia" data-v="' + d + '">' + DSEM[d] + '</button>'; }).join('') + '</div></div>' +
      '<div class="pl-box"><h3>Quando você começa?</h3><div class="pl-row"><input class="pl-inp" id="pl-ini" type="date" value="' + V.ini + '" style="width:170px"></div></div>' +
      '<div id="pl-resumo">' + resumoAjuste() + '</div>' +
      '<div><button type="button" class="pl-b p" data-pl="criar"' + (V.dias.length ? '' : ' disabled') + '>' + (V.novo ? 'Criar o novo plano' : 'Criar meu plano') + '</button></div></div>';
  }

  function chipDia(s, hj) {
    var cls = s.feito ? 'ok' : s.iso === hj ? 'hj' : s.iso < hj ? 'atr' : 'fut', ic = s.feito ? '✅' : s.iso > hj ? '⬜' : '⭕';
    return '<button type="button" class="pl-d ' + cls + '" data-pl="marcar" data-iso="' + s.iso + '" title="Sessão ' + s.n + '">' + (s.intensivo ? '<span class="int">' + (s.final ? '🏁' : '🔥') + '</span>' : '') + '<small>' + DSEM[s.d.getDay()] + '</small><b>' + fmt(s.d) + '</b><span class="k">' + ic + '</span></button>';
  }
  function abrirBt(et) { return et[3] ? '<button type="button" class="pl-b s" data-pl="abrir" data-mod="' + esc(et[3]) + '" data-ir="' + esc(et[2]) + '">Abrir na plataforma</button>' : et[2] ? '<button type="button" class="pl-b s" data-pl="abrir" data-mod="" data-ir="' + esc(et[2]) + '">Abrir na plataforma</button>' : ''; }
  function telaPlano(p) {
    var g = porId(p.g) || G[0], st = stats(p), hj = iso(new Date()), prox = st.hoje && !st.hoje.feito ? st.hoje : st.prox;
    var h = '<div class="pl">' + '<div style="display:flex;gap:10px;align-items:flex-start;flex-wrap:wrap"><div style="flex:1;min-width:220px"><h2>' + g.ic + ' ' + esc(g.n) + '</h2><div class="sub">' + p.min + ' min por dia · ' + p.dias.slice().sort(function (a, b) { return ORDEM.indexOf(a) - ORDEM.indexOf(b); }).map(function (d) { return DSEM[d]; }).join(', ') + (st.fim ? ' · termina em ' + fmtL(st.fim) : '') + '</div></div>' +
      '<button type="button" class="pl-b p" data-pl="imprimir">🖨️ Imprimir</button></div>' +
      '<div class="pl-box"><div class="pl-row" style="justify-content:space-between;margin-bottom:8px"><b style="font-size:15px">' + st.total + ' de ' + p.N + ' sessões</b><b style="font-size:15px">' + st.pct + '%</b></div><div class="pl-bar"><i style="width:' + st.pct + '%"></i></div></div>';
    if (st.pct >= 100) h += '<div class="pl-prev"><b>🏁 Plano concluído!</b><br>Você cumpriu o que combinou. Que tal montar o próximo resultado?</div>';
    else if (prox) {
      var ehHoje = prox.iso === hj, et = prox.et;
      h += '<div class="pl-box pl-hoje"><div class="sub" style="margin:0">' + (ehHoje ? 'HOJE' : prox.iso < hj ? 'ATRASADA · ' + fmtL(prox.d).toUpperCase() : 'PRÓXIMA · ' + fmtL(prox.d).toUpperCase()) + ' · sessão ' + prox.n + ' de ' + p.N + (prox.intensivo ? (prox.final ? ' · 🏁 FINAL' : ' · 🔥 INTENSIVO') : '') + '</div>' +
        '<div class="t">' + esc(et[0]) + '</div><div class="f">' + esc(et[1]) + '<br><b>' + (prox.intensivo ? 'Intensivo: ' : 'Hoje: ') + '</b>' + esc(prox.intensivo ? g.i : prox.ativ) + '</div>' +
        '<div class="pl-row" style="margin-top:12px">' + (prox.iso <= hj ? '<button type="button" class="pl-b p" data-pl="marcar" data-iso="' + prox.iso + '">✓ Fiz essa sessão</button>' : '') + abrirBt(et) + '</div></div>';
    }
    if (st.atras >= 3) h += '<div class="pl-box"><b>Você tem ' + st.atras + ' sessões atrasadas.</b><div class="sub">Sem culpa. Dá pra marcar as que fez ou recalcular o plano a partir de hoje.</div><div style="margin-top:10px"><button type="button" class="pl-b" data-pl="recalcular">Recalcular a partir de hoje</button></div></div>';
    var sem = {}, ordem = []; st.l.forEach(function (s) { if (!sem[s.sem]) { sem[s.sem] = []; ordem.push(s.sem); } sem[s.sem].push(s); });
    h += '<div class="pl-box"><h3>Seu cronograma</h3><div style="display:flex;flex-direction:column;gap:14px">' + ordem.map(function (k, i) { return '<div class="pl-sem"><div class="wl">Semana ' + (i + 1) + '</div><div class="pl-dias">' + sem[k].map(function (s) { return chipDia(s, hj); }).join('') + '</div></div>'; }).join('') + '</div><div class="sub" style="margin-top:10px">🔥 = intensivo da semana · 🏁 = sessão final · toque num dia pra marcar ou desmarcar</div></div>';
    var faseAtual = prox ? prox.fase : 3;
    h += '<div class="pl-box"><h3>As 4 etapas do seu plano</h3>' + g.e.map(function (e, i) { return '<div class="pl-et' + (i === faseAtual ? ' on' : '') + '"><span class="nn">' + (i + 1) + '</span><span class="tx"><b>' + esc(e[0]) + '</b><small>' + esc(e[1]) + '</small></span>' + abrirBt(e) + '</div>'; }).join('') + '</div>';
    h += '<div class="pl-row"><button type="button" class="pl-b s" data-pl="ajustar">Mudar resultado ou ritmo</button></div></div>';
    return h;
  }

  function desenhar() {
    var pane = $('pane-plano'); if (!pane) return;
    var p = plano(), h;
    if (V.tela === 'plano' && p) h = telaPlano(p);
    else if (V.tela === 'ajuste') h = telaAjuste();
    else h = (p ? back('plano', 'Voltar ao meu plano') : '') + telaInicio();
    pane.innerHTML = '<div style="padding:4px 0 40px">' + h + '</div>';
  }

  function criar(g, h, min, dias, ini) {
    var p = calcular(g, h, min, dias, ini); guardar(p); V.tela = 'plano'; V.novo = false; desenhar();
    if (window.toast) toast('🎯 Plano criado! Boa jornada.');
  }
  async function abrir(mod, ir) {
    var A0 = window.goTo, pill = function (pg) { return [].filter.call(document.querySelectorAll('.nav-pill'), function (n) { return (n.getAttribute('onclick') || '').indexOf("'" + pg + "'") >= 0; })[0] || null; };
    if (mod) {
      try {
        if (window.loadStudentModules) await window.loadStudentModules(true);
        var norm = function (s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); };
        var m = (window._stMods || []).filter(function (x) { return norm(x.name).indexOf(norm(mod)) >= 0; })[0];
        if (A0) A0('modulos', pill('modulos'));
        if (m && window.openModule) { setTimeout(function () { window.openModule(m.id); }, 250); }
        return;
      } catch (e) {}
    }
    if (ir && A0) A0(ir, pill(ir));
  }

  /* ───────── folha pra imprimir ───────── */
  async function imprimir() {
    var p = plano(); if (!p) return; var g = porId(p.g) || G[0], st = stats(p), nome = '';
    try { var u = await window._sb.auth.getUser(); var m = (u.data.user || {}).user_metadata || {}; nome = m.nome || m.name || m.full_name || ''; } catch (e) {}
    var sem = {}, ordem = []; st.l.forEach(function (s) { if (!sem[s.sem]) { sem[s.sem] = []; ordem.push(s.sem); } sem[s.sem].push(s); });
    var h = '<h1>' + g.ic + ' Meu plano: ' + esc(g.n) + '</h1><div class="m">' + (nome ? esc(nome) + ' · ' : '') + p.min + ' min por dia · ' + p.dias.slice().sort(function (a, b) { return ORDEM.indexOf(a) - ORDEM.indexOf(b); }).map(function (d) { return DSEM[d]; }).join(', ') + (st.l[0] ? ' · de ' + fmt(st.l[0].d) + ' até ' + fmt(st.fim) : '') + ' · ' + p.N + ' sessões</div>' +
      '<div class="cm"><b>Meu compromisso:</b> eu me comprometo a estudar ' + p.min + ' minutos nos dias combinados, mesmo nos dias difíceis. Quem cumpre o combinado, chega. ✍️ Assinatura: ______________________</div>';
    ordem.forEach(function (k, i) {
      h += '<div class="wk"><div class="l">Semana ' + (i + 1) + '</div><div class="row">' + sem[k].map(function (s) { return '<div class="b">' + (s.intensivo ? '<span class="z">' + (s.final ? '🏁' : '🔥') + '</span>' : '') + DSEM[s.d.getDay()] + ' ' + fmt(s.d) + '<span class="q"></span>' + (s.feito ? '✓' : '') + '</div>'; }).join('') + '</div></div>';
    });
    h += '<div class="ft"><b>Etapas:</b> ' + g.e.map(function (e, i) { return (i + 1) + '. ' + esc(e[0]); }).join('  ·  ') + '<br>🔥 intensivo da semana · 🏁 sessão final · Plano gerado na Plataforma Inteligente — English by Gediel</div>';
    $('pl-print').innerHTML = h; document.body.classList.add('pl-printing');
    var fim = function () { document.body.classList.remove('pl-printing'); window.removeEventListener('afterprint', fim); };
    window.addEventListener('afterprint', fim); setTimeout(function () { window.print(); }, 80); setTimeout(fim, 60000);
  }

  /* ───────── cliques ───────── */
  document.addEventListener('click', function (e) {
    var pane = $('pane-plano'); if (!pane) return;
    var t = e.target.closest('[data-pl]'); if (!t || !pane.contains(t)) return;
    var a = t.dataset.pl, p = plano();
    if (a === 'pronto') { var g = porId('falar'); return criar('falar', g.h, 30, [1, 2, 3, 4, 5], iso(new Date())); }
    if (a === 'g') { var gg = porId(t.dataset.id); V.g = gg.id; V.h = gg.h; V.novo = !!p; V.tela = 'ajuste'; return desenhar(); }
    if (a === 'inicio') { V.tela = 'inicio'; return desenhar(); }
    if (a === 'plano') { V.tela = 'plano'; V.novo = false; return desenhar(); }
    if (a === 'ajustar') { V.tela = 'inicio'; return desenhar(); }
    if (a === 'min') { V.min = +t.dataset.v; return desenhar(); }
    if (a === 'dia') { var d = +t.dataset.v, i = V.dias.indexOf(d); if (i >= 0) V.dias.splice(i, 1); else V.dias.push(d); return desenhar(); }
    if (a === 'criar') { var h = Math.max(5, Math.min(400, +($('pl-h') || {}).value || V.h)); if (!V.dias.length) return; return criar(V.g, h, V.min, V.dias.slice(), ($('pl-ini') || {}).value || V.ini); }
    if (a === 'marcar' && p) {
      var k = t.dataset.iso, hj = iso(new Date()); if (k > hj) return;
      p.marc = p.marc || {}; if (p.marc[k]) delete p.marc[k]; else { p.marc[k] = 1; if (k === hj && A() && A().marcarDia) A().marcarDia(); }
      guardar(p); desenhar(); var s = stats(p); if (s.pct >= 100 && window.toast) toast('🏁 Plano concluído! Parabéns!'); return;
    }
    if (a === 'recalcular' && p) { var st = stats(p); p.antes = st.total; p.marc = {}; p.ini = iso(new Date()); guardar(p); return desenhar(); }
    if (a === 'imprimir') return imprimir();
    if (a === 'abrir') return abrir(t.dataset.mod, t.dataset.ir);
  });
  document.addEventListener('input', function (e) {
    if (e.target.id === 'pl-h') { V.h = Math.max(5, Math.min(400, +e.target.value || 5)); var r = $('pl-resumo'); if (r) r.innerHTML = resumoAjuste(); }
    if (e.target.id === 'pl-ini' && e.target.value) { V.ini = e.target.value; var r2 = $('pl-resumo'); if (r2) r2.innerHTML = resumoAjuste(); }
  });

  /* ───────── ligação com a navegação ───────── */
  var env = false;
  function envolver() {
    if (env || !window.goTo) return; env = true; var g0 = window.goTo;
    window.goTo = function (page) { var r = g0.apply(this, arguments); if (page === 'plano') { V.tela = plano() ? 'plano' : 'inicio'; V.novo = false; desenhar(); } return r; };
  }
  setInterval(function () { if (!S().pronto) return; if (montar()) envolver(); }, 600);
  window.EBG_PLANO = { hoje: function () { var p = plano(); if (!p) return null; var s = stats(p); return s.hoje && !s.hoje.feito ? { n: s.hoje.n, de: p.N, g: porId(p.g) } : null; }, metas: G };
})();
