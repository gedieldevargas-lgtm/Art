// Todo o texto do catálogo. Para mudar um card, mude aqui; o layout se ajusta sozinho.
// peso: quanto cada item combina com cada perfil (0 a 10). Vira a % "pra você" e a ordem da fileira "Escolhido pra você".

window.EBG = {
  perfis: [
    // img: capa do perfil (quadrada, sem texto, já com o tratamento preto e branco quente).
    { id: 'fala',     nome: 'Destravar a fala',   img: 'img/perfil-fala.webp' },
    { id: 'trabalho', nome: 'Inglês no trabalho', img: 'img/perfil-trabalho.webp' },
    { id: 'viagem',   nome: 'Viajar sem travar',  img: 'img/perfil-viagem.webp' },
    { id: 'fe',       nome: 'Inglês cristão',     img: 'img/perfil-cristao.webp' },
    { id: 'zero',     nome: 'Começar do zero',    img: 'img/perfil-zero.webp' }
  ],

  // Abertura em formato stories. {nome} vira o primeiro nome da pessoa.
  historia: [
    { img: null,
      titulo: 'Você não é ruim em inglês. Foi mal ensinado.',
      texto: 'App, escola, curso online. Anos de esforço e a fala ainda trava na hora H. O problema nunca foi você, foi o método.' },
    { img: 'img/gediel-brooklyn.webp',
      titulo: 'Prazer, eu sou o Gediel.',
      texto: 'Onze anos de sala de aula, mais de 500 alunos e um intercâmbio na Inglaterra que me mostrou: inglês de aula e inglês de rua são parentes, não gêmeos.' },
    { img: 'img/aula-grupo.webp',
      titulo: 'Cada pessoa aprende de um jeito.',
      texto: 'O Método Inteligente começa descobrindo como você aprende. Depois junta conversa ao vivo, aulas gravadas no seu ritmo e acompanhamento de perto.' },
    { img: 'img/gediel-liberty-tall.webp',
      titulo: '{nome}, separei um caminho pra você.',
      texto: null, // vem do perfil: perfilTexto
      botao: 'Abrir meu catálogo' }
  ],

  perfilTexto: {
    fala: 'Você entende, mas trava na hora de falar. A mentoria foi feita pra isso: conversar toda semana, errar em voz alta e ser corrigido na hora.',
    trabalho: 'Reunião, cliente, promoção. Na mentoria você conversa ao vivo com gente do seu nível, pra participar da reunião em vez de ficar em silêncio.',
    viagem: 'Aeroporto, hotel, restaurante. Inglês de rua, não de prova, praticado ao vivo antes da sua próxima viagem.',
    fe: 'Orar, servir e conversar em inglês. A mentoria cuida da conversa, e o English On Mission entra como bônus pra estudar a Palavra em inglês.',
    zero: 'Começar do zero é ponto de partida, não problema. O diagnóstico mostra por onde ir, e a turma A1 anda no seu ritmo.'
  },

  destaque: 'mentoria',

  itens: {
    mentoria: {
      titulo: 'Mentoria Inglês Inteligente',
      tipo: 'pago', selo: 'Inscrições abertas',
      img: 'img/gediel-brooklyn.webp', imgLarga: 'img/gediel-liberty.webp',
      video: 'eXfovCYxdZw',
      meta: ['6 meses', 'A1 → B2', 'Ao vivo', 'Garantia de 7 dias'],
      sinopse: 'Não é mais um curso com vídeo parado. É prática diária guiada, aulas ao vivo por nível e acompanhamento real, pra quem trava na hora de falar.',
      inclui: [
        'Aulas ao vivo por nível, turmas A1/A2 e B1/B2',
        'Plataforma com mais de 80 videoaulas e 100 exercícios',
        'Diagnóstico de Múltiplas Inteligências no começo',
        'Prática diária no WhatsApp',
        'Missões semanais pra usar o inglês na vida',
        'Encontro ao vivo com o Gediel a cada 15 dias',
        'Comunidade de quem está no mesmo caminho',
        'Acesso às trilhas English On Mission, Culture English e Intercâmbio e Viagens'
      ],
      preco: { separado: 'R$ 1.100 no 1º mês, se comprado separado', parcelas: '6x de R$ 297', nota: 'Assinatura de 6 meses no cartão. Consulte boleto parcelado.' },
      cta: { rotulo: 'Quero minha vaga', acao: 'checkout' },
      cta2: { rotulo: 'Tirar uma dúvida', acao: 'whatsapp', texto: 'Oi Gediel! Vim pelo catálogo e quero entender a mentoria.' },
      etapas: ['diagnostico', 'aovivo', 'pratica', 'missoes', 'conversacao', 'encontro', 'comunidade'],
      peso: { fala: 10, trabalho: 10, viagem: 10, fe: 9, zero: 10 }
    },

    // A série: as 7 etapas da mentoria
    diagnostico: { titulo: 'Diagnóstico de Múltiplas Inteligências', tipo: 'etapa', img: 'img/gediel-reading.webp', duracao: 'Semana 1',
      sinopse: 'Antes de qualquer aula, a gente descobre como você aprende melhor. O método se adapta a você, não o contrário.' },
    aovivo: { titulo: 'Aula ao vivo toda semana, por nível', tipo: 'etapa', img: 'img/aula-grupo.webp', duracao: 'Toda semana',
      sinopse: 'Turmas A1/A2 e B1/B2 em horários próprios. Você pratica com quem está no seu momento, sem vergonha.' },
    pratica: { titulo: 'Prática diária guiada', tipo: 'etapa', img: 'img/aula-dupla.webp', duracao: 'Todo dia',
      sinopse: 'Áudio, vídeo curto e provocação de conversa no WhatsApp. Nunca mais um vídeo parado esperando você lembrar de assistir.' },
    missoes: { titulo: 'Missões semanais aplicadas', tipo: 'etapa', img: 'img/aula-jogo.webp', duracao: 'Toda semana',
      sinopse: 'Cada semana, uma missão real pra usar o inglês na sua vida, não só na tela.' },
    conversacao: { titulo: 'Conversação com professor auxiliar', tipo: 'etapa', img: 'img/aula-trio.webp', duracao: 'Toda semana',
      sinopse: 'Sessões de conversa focadas no seu nível, pra destravar a fala de verdade.' },
    encontro: { titulo: 'Encontro ao vivo com o Gediel', tipo: 'etapa', img: 'img/aula-tela.webp', duracao: 'A cada 15 dias',
      sinopse: 'Acesso direto: tira dúvida, aprofunda e sente que não está sozinho nessa.' },
    comunidade: { titulo: 'Comunidade que não te deixa desistir', tipo: 'etapa', img: 'img/aula-turma.webp', duracao: 'Sempre',
      sinopse: 'Ninguém termina sozinho o que começa em grupo.' },

    // Alunos: depoimentos em vídeo
    levi: { titulo: 'Não tenho mais vergonha de falar inglês', tipo: 'aluno', nome: 'Levi Moreira', arroba: '@levimoreira__',
      img: 'img/aluno-levi.webp', video: '3PC0cr5dtfY',
      sinopse: 'Eu não acreditava que conseguiria falar alguma coisa bem. Na primeira aula eu já consegui me apresentar e até abrir uma apresentação falando da minha vida, com muita leveza.',
      peso: { fala: 9, trabalho: 6, viagem: 4, fe: 4, zero: 8 } },
    laura: { titulo: 'Hoje viajo o mundo com confiança', tipo: 'aluno', nome: 'Laura Zanella Gomes', arroba: '@laurazgomes',
      img: 'img/aluno-laura.webp', video: 'EzE_i_n9amM',
      sinopse: 'Eu amo viajar sozinha, mas me sentia muito travada, enferrujada com o inglês de escola. Toda viagem internacional que faço agora, percebo a diferença que fez praticar com o método.',
      peso: { fala: 6, trabalho: 3, viagem: 10, fe: 3, zero: 5 } },
    luiz: { titulo: 'Tudo que faço hoje é em inglês', tipo: 'aluno', nome: 'Luiz Felipe Maia', arroba: '@lfelipe_maia',
      img: 'img/aluno-luiz.webp', video: 'bR-p2DkqwWA',
      sinopse: 'Eu sabia inglês de jogos, séries e músicas, mas conversar de verdade aprendi com o Gediel. Hoje trabalho, faço reuniões e uso minhas ferramentas em inglês.',
      peso: { fala: 7, trabalho: 10, viagem: 4, fe: 3, zero: 4 } },
    alycia: { titulo: 'Foi orar em inglês que mudou tudo', tipo: 'aluno', nome: 'Alycia Marafiga', arroba: '@alyciamarafiga',
      img: 'img/aluno-alycia.webp', video: 'vKLy9VLaHgA',
      sinopse: 'Nem fluente eu era, e o Gediel já conseguiu me fazer orar em inglês pela primeira vez. Sinto que saí do chão muito rápido.',
      peso: { fala: 6, trabalho: 3, viagem: 4, fe: 10, zero: 6 } },
    bruno: { titulo: 'Agora falo inglês de verdade', tipo: 'aluno', nome: 'Bruno Gastaldo', arroba: '@brunogastaldo',
      img: 'img/aluno-bruno.webp', video: 'OaEF46zSVYs',
      sinopse: 'Depois de alguns meses me desafiei a fazer um intercâmbio internacional com ele, e percebi que nada mais me travava. Eu conseguia muito mais do que só me virar.',
      peso: { fala: 8, trabalho: 5, viagem: 9, fe: 4, zero: 5 } },

    // Depoimentos do English On Mission (citacao: false = título sem aspas; linha: o que aparece no card embaixo do título)
    eomgabriel: { titulo: 'Gabriel', linha: 'English On Mission', citacao: false, tipo: 'aluno', nome: 'Gabriel Braga', arroba: '@gabriel_braga_oficial',
      img: 'img/aluno-eom-gabriel.webp', video: 'Zos-hQ7jvYo',
      sinopse: 'O Gabriel conta, em vídeo, como foi a experiência dele no English On Mission.',
      peso: { fala: 5, trabalho: 3, viagem: 3, fe: 10, zero: 5 } },
    eomalycia: { titulo: 'Alycia', linha: 'English On Mission', citacao: false, tipo: 'aluno', nome: 'Alycia Marafiga', arroba: '@alyciamarafiga',
      img: 'img/aluno-eom-alycia.webp', video: 'NMBt8t9GY8w',
      sinopse: 'A Alycia conta, em vídeo, como foi a experiência dela no English On Mission.',
      peso: { fala: 5, trabalho: 3, viagem: 3, fe: 9, zero: 5 } },
    eomguilherme: { titulo: 'Guilherme', linha: 'English On Mission', citacao: false, tipo: 'aluno', nome: 'Guilherme', arroba: '@guirahts.oficial',
      img: 'img/aluno-eom-guilherme.webp', video: 'RDrb0sCn-mc',
      sinopse: 'O Guilherme conta, em vídeo, como foi a experiência dele no English On Mission.',
      peso: { fala: 5, trabalho: 3, viagem: 3, fe: 9, zero: 5 } },

    // Área de membros (Cakto). bloqueado: aparece no catálogo, mas só abre pra quem entra na mentoria.
    // Quando chegar a capa original do Cakto, troque capa: 'texto' por img: 'img/arquivo.webp'.
    diagtestes: { titulo: 'Diagnósticos e Testes', trilha: 'Programa Inteligente', bloqueado: true, img: 'img/card-diagnostico.webp',
      sinopse: 'O ponto de partida: teste de nível e diagnóstico de múltiplas inteligências, pra saber como você aprende antes da primeira aula.' },
    cronograma: { titulo: 'Cronograma', trilha: 'Programa Inteligente', bloqueado: true, img: 'img/card-cronograma.webp',
      sinopse: 'Seu plano de estudo semana a semana, montado a partir do diagnóstico.' },
    salas: { titulo: 'Salas de Interação', trilha: 'Programa Inteligente', bloqueado: true, img: 'img/card-salas.webp',
      sinopse: 'Conversa ao vivo em turma, por nível, com correção na hora.' },
    aulas: { titulo: 'Aulas', trilha: 'Programa Inteligente', bloqueado: true, img: 'img/card-aulas.webp',
      sinopse: 'As aulas da plataforma, pra estudar no seu ritmo e rever quantas vezes quiser.' },

    grupoeom: { titulo: 'Grupo do WhatsApp', trilha: 'English On Mission', bloqueado: true, img: 'img/logo-eom.webp',
      sinopse: 'O grupo do English On Mission, pra praticar e caminhar junto durante a semana.' },
    devocionais: { titulo: 'Devocionais EOM', trilha: 'English On Mission', bloqueado: true, img: 'img/card-devocionais.webp',
      sinopse: 'Devocionais em inglês: um versículo e um ponto da língua de cada vez.' },
    cristao: { titulo: 'Curso de Inglês Cristão', trilha: 'English On Mission', bloqueado: true, capa: 'texto', cor: '#15281f',
      sinopse: 'Inglês estudando as cartas da Bíblia, do verb to be às cartas de João.',
      peso: { fala: 4, trabalho: 2, viagem: 2, fe: 10, zero: 5 } },
    biblia: { titulo: 'Inglês com a Bíblia', trilha: 'English On Mission', bloqueado: true, capa: 'texto', cor: '#15281f', meta: ['Extra'],
      sinopse: 'Conteúdo extra pra ler e entender a Palavra em inglês.' },

    seriesingles: { titulo: 'Inglês com Séries', trilha: 'Culture English', bloqueado: true, capa: 'texto', cor: '#1b1c30',
      sinopse: 'Aprender com o que você já gosta de assistir, entendendo como as pessoas falam de verdade.',
      peso: { fala: 7, trabalho: 4, viagem: 6, fe: 3, zero: 4 } },
    filmes: { titulo: 'Inglês com Filmes', trilha: 'Culture English', bloqueado: true, capa: 'texto', cor: '#1b1c30',
      sinopse: 'Cenas de filme como aula: expressões, sotaques e o inglês que não está no livro.' },
    musica: { titulo: 'Inglês com Música', trilha: 'Culture English', bloqueado: true, capa: 'texto', cor: '#1b1c30',
      sinopse: 'Letra, pronúncia e ritmo: o ouvido treina enquanto você canta.' },

    inglesviagem: { titulo: 'Inglês para Viagens', trilha: 'Intercâmbio e Viagens', bloqueado: true, img: 'img/card-viagem-ingles.webp',
      sinopse: 'Aeroporto, hotel, restaurante e imprevisto: as situações que toda viagem traz.',
      peso: { fala: 5, trabalho: 3, viagem: 10, fe: 3, zero: 5 } },
    toronto: { titulo: 'Toronto 2027', trilha: 'Intercâmbio e Viagens', bloqueado: true, breve: 'Lista de espera', img: 'img/card-toronto.webp',
      sinopse: 'O próximo intercâmbio. Quem está na mentoria entra primeiro na lista de espera.' },
    vlogny: { titulo: 'Vlogs New York 2025', trilha: 'Intercâmbio e Viagens', bloqueado: true, img: 'img/gediel-liberty.webp',
      sinopse: 'Os bastidores da viagem a Nova York, com o inglês de rua acontecendo ao vivo.' },
    vlogeuropa: { titulo: 'Vlogs Londres, Paris e Bruxelas', trilha: 'Intercâmbio e Viagens', bloqueado: true, img: 'img/card-europa.webp', meta: ['2024'],
      sinopse: 'Três cidades, três sotaques e o caderno de viagem de 2024.' },

    // Bônus gratuitos
    teste: { titulo: 'Qual é o seu nível?', tipo: 'gratis', img: 'img/card-teste.webp',
      meta: ['5 perguntas', '1 minuto'],
      sinopse: 'Cinco perguntas rápidas pra descobrir seu ponto de partida. Começar pelo ponto certo poupa tempo e motivação.',
      cta: { rotulo: 'Fazer o teste agora', acao: 'teste' },
      peso: { fala: 8, trabalho: 7, viagem: 7, fe: 7, zero: 10 } },
    liveterca: { titulo: 'Culture English Lives', tipo: 'gratis', img: 'img/card-culture-lives.webp',
      meta: ['Ao vivo', 'Gratuito'],
      sinopse: 'Lives abertas do Culture English com o Gediel: inglês de verdade a partir de séries, filmes e música, ao vivo.',
      cta: { rotulo: 'Quero o lembrete das lives', acao: 'whatsapp', texto: 'Oi Gediel! Quero receber o link das lives do Culture English.' },
      peso: { fala: 8, trabalho: 7, viagem: 7, fe: 6, zero: 8 } },
    eom: { titulo: 'English On Mission', tipo: 'gratis', img: 'img/logo-eom.webp', contem: true,
      meta: ['Sábado, 9h', 'Ao vivo no YouTube'],
      sinopse: 'Inglês estudando as cartas da Bíblia: cada aula une um versículo a um ponto de gramática. Do verb to be às cartas de João.',
      cta: { rotulo: 'Acompanhar o English On Mission', acao: 'link', href: 'eom' },
      peso: { fala: 5, trabalho: 2, viagem: 2, fe: 10, zero: 6 } },
    instagram: { titulo: 'Inglês de verdade, todo dia', tipo: 'gratis', img: 'img/gediel-liberty-tall.webp',
      meta: ['@englishbygediel', 'Diário'],
      sinopse: 'Frase de escola contra frase natural, os erros que todo brasileiro comete e o inglês de rua, em vídeos curtos.',
      cta: { rotulo: 'Seguir no Instagram', acao: 'link', href: 'ebg' },
      peso: { fala: 7, trabalho: 6, viagem: 7, fe: 5, zero: 7 } },
    esposa: { titulo: 'Encorajando minha esposa', tipo: 'gratis', breve: 'Em breve', indisponivel: true, img: 'img/card-esposa.webp',
      meta: ['Série', 'Gediel e Mayandra', 'Indisponível'],
      sinopse: 'A Mayandra tenta primeiro, do jeito dela, sem ajuda. Depois vem a versão natural. Errar faz parte: quem tenta, aprende.',
      cta: { rotulo: 'Me avise quando lançar', acao: 'whatsapp', texto: 'Oi Gediel! Quero ser avisado quando a série Encorajando minha esposa lançar.' },
      peso: { fala: 9, trabalho: 4, viagem: 6, fe: 5, zero: 9 } },

    // Também do Gediel
    ingi: { titulo: 'Inglês Inteligente', tipo: 'gratis', img: 'img/logo-ingi.webp', contem: true,
      meta: ['@inglesinteligente', 'Método'],
      sinopse: 'O método por trás de tudo: as múltiplas inteligências aplicadas ao inglês. Uma pessoa aprende ouvindo, outra fazendo, outra precisa ver escrito.',
      cta: { rotulo: 'Conhecer o método', acao: 'link', href: 'ingi' },
      peso: { fala: 6, trabalho: 6, viagem: 5, fe: 5, zero: 7 } },
    escola: { titulo: 'Escola Infly', tipo: 'pago', img: 'img/logo-infly.webp', contem: true,
      meta: ['Presencial', 'Tupanciretã'],
      sinopse: 'A escola de inglês presencial do ecossistema, pra quem é da região e quer sala de aula de verdade.',
      cta: { rotulo: 'Ver a escola', acao: 'link', href: 'escola' },
      peso: { fala: 5, trabalho: 5, viagem: 4, fe: 4, zero: 7 } },
    viagens: { titulo: 'Infly Viagens', tipo: 'pago', img: 'img/gediel-liberty.webp',
      meta: ['Intercâmbio', 'Viagens'],
      sinopse: 'Viagens e intercâmbio pra colocar o inglês em uso. Foi assim que alunos como o Bruno descobriram que nada mais travava.',
      cta: { rotulo: 'Ver as viagens', acao: 'link', href: 'viagens' },
      peso: { fala: 4, trabalho: 4, viagem: 10, fe: 4, zero: 3 } },
    particular: { titulo: 'Aulas particulares', tipo: 'exclusivo', img: 'img/card-particular.webp',
      meta: ['Só para alunos'],
      sinopse: 'Atenção individual com o Gediel, disponível apenas por dentro da mentoria, pra quem já é assinante.',
      cta: { rotulo: 'Já sou aluno, quero agendar', acao: 'whatsapp', texto: 'Oi Gediel! Já sou aluno do programa e quero agendar aulas particulares.' },
      peso: { fala: 5, trabalho: 6, viagem: 4, fe: 4, zero: 3 } }
  },

  fileiras: [
    { id: 'pra-voce', titulo: 'Escolhido pra você', dinamica: true, formato: 'poster' },
    { id: 'programa', titulo: 'Programa Inteligente', sub: 'Só na mentoria', formato: 'poster',
      itens: ['diagtestes', 'cronograma', 'salas', 'aulas'] },
    { id: 'alunos', titulo: 'Resultados de alunos', formato: 'poster',
      itens: ['levi', 'laura', 'luiz', 'alycia', 'bruno', 'eomgabriel', 'eomalycia', 'eomguilherme'] },
    { id: 'eom', titulo: 'English On Mission', sub: 'Só na mentoria', formato: 'poster',
      itens: ['eomgabriel', 'eomalycia', 'eomguilherme', 'grupoeom', 'devocionais', 'cristao', 'biblia'] },
    { id: 'culture', titulo: 'Culture English', sub: 'Só na mentoria', formato: 'poster',
      itens: ['seriesingles', 'filmes', 'musica'] },
    { id: 'intercambio', titulo: 'Intercâmbio e Viagens', sub: 'Só na mentoria', formato: 'poster',
      itens: ['inglesviagem', 'toronto', 'vlogny', 'vlogeuropa'] },
    { id: 'gratis', titulo: 'Bônus gratuitos', formato: 'largo',
      itens: ['teste', 'liveterca', 'eom', 'instagram', 'esposa'] },
    { id: 'mais', titulo: 'Também do Gediel', formato: 'largo',
      itens: ['ingi', 'escola', 'viagens', 'particular'] }
  ],

  perguntas: [
    ['Preciso saber inglês pra entrar?', 'Não. A mentoria recebe do zero ao avançado. O diagnóstico no início te coloca no trilho certo desde o primeiro dia.'],
    ['E se eu perder uma aula ao vivo?', 'Todas as aulas ficam gravadas na plataforma. Você assiste quando quiser, quantas vezes precisar.'],
    ['Quanto tempo preciso por semana?', 'De 3 a 4 horas, contando aula ao vivo e prática diária. Cabe na rotina de quem tem agenda cheia.'],
    ['A garantia é de verdade?', 'Sim. Sete dias completos. Se não sentir que é pra você, o valor volta inteiro, sem burocracia.'],
    ['Tem fidelidade?', 'É uma assinatura de 6 meses, 6x de R$ 297 no cartão. Sem taxa de entrada.'],
    ['Funciona pra quem tem mais de 50 anos?', 'Funciona. Já passaram por aqui alunos de 40, 50 e 60 anos aprendendo pela primeira vez, no ritmo deles.']
  ],

  teste: {
    perguntas: [
      ['Você consegue se apresentar em inglês sem travar?', ['Nunca tentei', 'Consigo o básico', 'Sim, com dificuldade', 'Sim, com confiança']],
      ['Como você se sai quando alguém fala com você em inglês?', ['Não entendo nada', 'Entendo palavras soltas', 'Entendo, mas demoro', 'Entendo e respondo bem']],
      ['Você consegue escrever um e-mail simples em inglês?', ['Não consigo', 'Com muita ajuda', 'Sim, com dificuldade', 'Sim, sem problema']],
      ['Quanto tempo você já estudou inglês?', ['Nunca sério', 'Menos de 1 ano', '1 a 5 anos', 'Mais de 5 anos']],
      ['Numa reunião em inglês, você conseguiria participar?', ['Jamais', 'Ficaria em silêncio', 'Um pouco', 'Normalmente']]
    ],
    resultados: [
      { ate: 1,   nivel: 'Iniciante',     frase: 'Que coragem dar o primeiro passo.', texto: 'Você está no começo, sem vícios e sem bloqueio de método antigo. A turma A1 é o seu lugar.' },
      { ate: 2,   nivel: 'Básico',        frase: 'Você já sabe mais do que imagina.', texto: 'A base existe. O que falta é estrutura e prática real, toda semana.' },
      { ate: 3,   nivel: 'Intermediário', frase: 'Você está mais perto do que pensa.', texto: 'Você entende, mas trava. Isso se chama bloqueio de fala, e se resolve conversando com correção na hora.' },
      { ate: 9,   nivel: 'Avançado',      frase: 'Agora é hora de dominar.', texto: 'Seu caminho é conversa de alto nível, reunião e apresentação, com acompanhamento de perto.' }
    ]
  }
};
