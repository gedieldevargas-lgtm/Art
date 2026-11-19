/* Livro da aula · Unit 1 · Greetings
   Conteúdo tirado do e-book "Inglês Inteligente" (Level 1, páginas 4 e 5) e do gabarito (página 54).
   Para criar a próxima aula: copie este arquivo, troque o id e o conteúdo. Veja livro/README.md. */
(window.LIVRO_AULAS = window.LIVRO_AULAS || {})['unit-01'] = {
  id: 'unit-01',
  nivel: 'Level 1',
  unidade: 1,
  titulo: 'Greetings',
  subtitulo: 'Cumprimentos e sentimentos',
  pdf: 'livro/pdf/unit-01-greetings.pdf',

  // ---------- REVISAR (cards rápidos com áudio) ----------
  revisar: [
    { tipo: 'vocab', titulo: 'Saudações', itens: [
      ['Hello', 'Olá'], ['Hi', 'Oi'], ['Hey', 'Ei / E aí'], ["What's up?", 'E aí?']
    ]},
    { tipo: 'vocab', titulo: 'Durante o dia', itens: [
      ['Good morning', 'Bom dia'], ['Good afternoon', 'Boa tarde'], ['Good evening', 'Boa noite']
    ]},
    { tipo: 'vocab', titulo: 'Perguntas comuns', itens: [
      ['How are you?', 'Como vai?'], ["How's it going?", 'Como vai?'], ['How are you doing?', 'Como vai?']
    ]},
    { tipo: 'vocab', titulo: 'Respostas comuns', itens: [
      ["I'm fine, thanks.", 'Bem, obrigado.'], ["I'm very well, thank you.", 'Muito bem, obrigado.'], ["I'm good, thanks.", 'Estou bem, obrigado.']
    ]},
    { tipo: 'dialogo', titulo: 'Diálogo informal', falas: [
      ['John', "What's up Ana, how's it going?", 'E aí Ana, tudo bem?'],
      ['Ana', 'Good, thanks, and you?', 'Bem, valeu, e tu?'],
      ['John', 'Good too.', 'Bem, também.']
    ]},
    { tipo: 'dialogo', titulo: 'Diálogo formal', falas: [
      ['John', 'Hello Ana, how are you?', 'Olá Ana, como vai você?'],
      ['Ana', "I'm very well, thank you, and how about you?", 'Muito bem, obrigada, e você?'],
      ['John', "I'm fine, thank you.", 'Eu estou bem, obrigado.']
    ]},
    { tipo: 'vocab', titulo: 'Feelings', emoji: true, itens: [
      ['Fine / OK / Good', 'Bem', '🙂'], ['Very well', 'Muito bem', '😄'], ['Happy', 'Feliz', '😊'],
      ['Terrific / Excited', 'Maravilhoso / Incrível', '🤩'], ['Sad / Bad', 'Triste / Mal', '😢'],
      ['Stressed', 'Estressado', '😣'], ['Bored', 'Entediado', '😑'], ['Furious', 'Furioso', '🤬'],
      ['Angry / Mad', 'Bravo / Irritado', '😠'], ['Scared / Shocked', 'Assustado / Chocado', '😱'],
      ['Cold / Freezing', 'Com frio / Congelando', '🥶'], ['Sleepy', 'Com sono', '😪'],
      ['Sick / Ill', 'Doente', '🤒'], ['Tired', 'Cansado', '🥱']
    ]},
    { tipo: 'dica', texto: 'Use "very" antes do adjetivo para dizer "muito". Ex: I\'m very happy (Eu estou muito feliz).' }
  ],

  // ---------- PRATICAR (exercícios com correção na hora) ----------
  exercicios: [
    { id: 'ex1', tipo: 'ditado', titulo: 'Escreva o que você ouve',
      instrucao: 'Toque em ▶ para ouvir. Use 🐢 para ouvir devagar. Escreva a frase em inglês.',
      itens: [
        { resp: ['Good morning, how are you doing?'] },
        { resp: ["Good evening, how's it going?"] },
        { resp: ['Hi there, good afternoon, how are you?'] },
        { resp: ["What's up, how's it going?"] },
        { resp: ['Hello my friend, how are you doing?'] },
        { resp: ["Hi, I'm very happy and excited."] },
        { resp: ["I'm very angry."] }
      ]},
    { id: 'ex2', tipo: 'escolha', titulo: 'Responda conforme o emoji',
      instrucao: 'Olhe o emoji e escolha a resposta certa.',
      itens: [
        { p: 'Hey!! How are you feeling?', emoji: '🥶', ops: ['I am happy.', 'I am cold.', 'I am sleepy.'], c: 1 },
        { p: 'Hello! How are you?', emoji: '😄', ops: ['I am very well, thank you.', 'I am sick.', 'I am bored.'], c: 0 },
        { p: 'Hi!! How are you feeling today?', emoji: '😣', ops: ['I am excited.', 'I am cold.', 'I am stressed.'], c: 2 },
        { p: "What's up, how are you?", emoji: '🥱', ops: ['I am tired.', 'I am furious.', 'I am happy.'], c: 0 }
      ]},
    { id: 'ex3', tipo: 'montar', titulo: 'Ouça e responda',
      instrucao: 'Ouça a pergunta e monte a resposta tocando nas palavras na ordem certa.',
      itens: [
        { ouvir: 'Hello! How are you?', resp: "I'm very well, thanks, how about you?" },
        { ouvir: "How's it going?", resp: "I'm good, thanks." },
        { ouvir: 'How are you doing?', resp: "I'm very well, thank you." }
      ]},
    { id: 'ex4', tipo: 'conversa', titulo: 'Reescreva a mesma conversa em inglês',
      instrucao: 'Passe cada fala para o inglês. Existe mais de um jeito certo.',
      linhas: [
        { quem: 'Pessoa A', pt: 'E aí, tudo bem?',
          resp: ['Hey, how are you?', "Hey, how's it going?", "What's up, how's it going?", "What's up, how are you?", 'Hi, how are you?', 'Hey, how are you doing?'] },
        { quem: 'Pessoa B', pt: 'Oi, eu tô bem, valeu, e tu?',
          resp: ["Hi, I'm fine, thanks, and you?", "Hi, I'm good, thanks, and you?", "Hi, I'm fine, thanks, how about you?", "Hi, I'm good, thanks, how about you?", "Hi, I'm OK, thanks, and you?"] },
        { quem: 'Pessoa A', pt: 'Eu também.',
          resp: ['Me too.', 'Good too.', "I'm fine too.", "I'm good too."] }
      ]}
  ],

  // ---------- MISSÃO (método do e-book: falar em voz alta + 15 frases) ----------
  missao: {
    falar: 'How are you feeling today?',
    frases: 15,
    exemplo: "I'm very happy today. / Good evening, how are you doing?"
  },

  // ---------- E-BOOK PARA BAIXAR ----------
  ebook: {
    resumo: [
      'Cumprimentar: Hello, Hi, Hey e What\'s up?',
      'Cumprimentar conforme a hora: Good morning, Good afternoon, Good evening.',
      'Perguntar como a pessoa está: How are you? / How\'s it going? / How are you doing?',
      'Responder: I\'m fine, thanks. / I\'m very well, thank you. / I\'m good, thanks.',
      'Dizer como você se sente com os Feelings, e usar very para dizer "muito".',
      'Perceber a diferença entre uma conversa formal e uma informal.'
    ],
    mapa: {
      centro: 'Greetings',
      ramos: [
        { t: 'Saudações', itens: ['Hello', 'Hi', 'Hey', "What's up?"] },
        { t: 'Durante o dia', itens: ['Good morning', 'Good afternoon', 'Good evening'] },
        { t: 'Perguntar', itens: ['How are you?', "How's it going?", 'How are you doing?'] },
        { t: 'Responder', itens: ["I'm fine, thanks", "I'm very well, thank you", "I'm good, thanks"] },
        { t: 'Feelings', itens: ['happy · sad · bored', 'tired · sleepy · sick', 'very + sentimento'] },
        { t: 'Formal x Informal', itens: ['Hello, how are you?', "What's up, how's it going?"] }
      ]
    },
    escala: {
      titulo: 'Do mais formal ao mais informal',
      itens: [
        ['Good morning', 6], ['Hello, how are you?', 24], ['How are you doing?', 44],
        ['Hi', 58], ["How's it going?", 70], ['Hey', 84], ["What's up?", 96]
      ]
    },
    dia: {
      titulo: 'Qual cumprimento usar em cada hora',
      itens: [
        ['Good morning', 'Bom dia', 5, 12, '☀️'],
        ['Good afternoon', 'Boa tarde', 12, 18, '🌤️'],
        ['Good evening', 'Boa noite (chegando)', 18, 24, '🌙']
      ],
      nota: '"Good night" é para se despedir ou ir dormir. Ao chegar à noite, use "Good evening".'
    },
    imprimir: [
      { tipo: 'ligar', titulo: 'Ligue o sentimento à tradução',
        pares: [['Happy', 'Feliz'], ['Tired', 'Cansado'], ['Bored', 'Entediado'], ['Sleepy', 'Com sono'], ['Sick', 'Doente'], ['Scared', 'Assustado'], ['Angry', 'Bravo']] },
      { tipo: 'emoji', titulo: 'Responda conforme o emoji', ref: 'ex2' },
      { tipo: 'lacunas', titulo: 'Complete o diálogo formal',
        linhas: [
          ['John', 'Hello Ana, ___ are you?', ['how']],
          ['Ana', "I'm ___ well, thank you, and how ___ you?", ['very', 'about']],
          ['John', "I'm ___, thank you.", ['fine']]
        ]},
      { tipo: 'conversa', titulo: 'Reescreva a conversa em inglês', ref: 'ex4' },
      { tipo: 'linhas', titulo: 'Missão: escreva 15 frases e perguntas com o que aprendeu', n: 15 }
    ]
  }
};
