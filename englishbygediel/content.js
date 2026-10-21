// Todo o texto do catálogo. Para mudar um card, mude aqui; o layout se ajusta sozinho.
// peso: quanto cada item combina com cada perfil (0 a 10). Vira a % "pra você" e a ordem da fileira "Escolhido pra você".

window.EBG = {
  // Entrada: os modos que giram em volta do Gediel. perfil = o foco que o catálogo usa;
  // ir = pra onde o catálogo leva logo depois (#fileira ou id de item). recorte = foto sem fundo saindo da moldura (h = altura).
  modos: [
    // o Prisma é a porta do método: vem primeiro e ganha a marca "Comece aqui"
    { id: 'prisma',      nome: 'Modo Prisma',      perfil: 'fala',     img: 'img/modo-prisma.webp',   ir: 'prisma', marca: 'Comece aqui' },
    { id: 'fala',        nome: 'Modo Fala',        perfil: 'fala',     img: 'img/modo-meet.webp' },
    { id: 'carreira',    nome: 'Modo Carreira',    perfil: 'trabalho', img: 'img/modo-trabalho.webp', recorte: 122, verde: true },
    { id: 'viagem',      nome: 'Modo Viagem',      perfil: 'viagem',   img: 'img/modo-viagem.webp',   recorte: 86 },
    { id: 'fe',          nome: 'Modo Fé',          perfil: 'fe',       img: 'img/modo-fe.webp',       recorte: 104, verde: true },
    { id: 'zero',        nome: 'Modo Zero',        perfil: 'zero',     img: 'img/modo-zero.webp',     recorte: 112 },
    { id: 'cultura',     nome: 'Modo Cultura',     perfil: 'fala',     img: 'img/modo-cultura.webp',  verde: true, ir: '#culture' },
    { id: 'nivel',       nome: 'Modo Nível',       perfil: 'zero',     img: 'img/modo-nivel.webp',    ir: 'teste' },
    { id: 'intercambio', nome: 'Modo Intercâmbio', perfil: 'viagem',   img: 'img/modo-toronto.webp',  verde: true, ir: '#intercambio' }
  ],

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
    { img: 'img/gediel-brooklyn.webp',
      titulo: 'Você não é ruim em inglês. Foi mal ensinado.',
      texto: 'Eu sou o Gediel. Onze anos de sala de aula e mais de 700 alunos me mostraram: o problema nunca foi você, foi o método.' },
    { img: 'img/aula-grupo.webp',
      titulo: 'Cada pessoa aprende de um jeito.',
      texto: 'O Método Inteligente começa descobrindo como você aprende. Depois junta aula ao vivo, um cronograma pra cada dia e acompanhamento de perto.' },
    { img: 'img/gediel-liberty-tall.webp',
      titulo: '{nome}, separei um caminho pra você.',
      texto: null, // vem do perfil: perfilTexto
      botao: 'Abrir meu catálogo' }
  ],

  // De onde a pessoa veio (?de= no link da bio de cada perfil).
  // perfil: já escolhe o foco e pula a pergunta. procura: atalhos que aparecem primeiro. ola: frase de boas-vindas.
  origens: {
    ebg:     { ola: '' },
    eom:     { perfil: 'fe', procura: ['eom', 'grupos', 'mentoria'], ola: 'Que bom te ver por aqui, família English On Mission.' },
    metodo:  { procura: ['prisma', 'teste', 'mentoria'], ola: 'Veio do Método Inglês Inteligente? Comece descobrindo como você aprende.' },
    escola:  { procura: ['escola', 'teste', 'mentoria'], ola: 'Aluno ou amigo da Escola Infly? Aqui está tudo do ecossistema.' },
    viagens: { perfil: 'viagem', procura: ['toronto', 'vlogs', 'mentoria'], ola: 'Veio da Infly Viagens? As inscrições pra Toronto 2027 estão abertas.' }
  },

  // Barra "O que você procura?" logo abaixo da vitrine. abrir = ficha do item; rolar = leva até a fileira.
  procura: [
    { id: 'mentoria',   rotulo: 'Mentoria',              abrir: 'mentoria' },
    { id: 'teste',      rotulo: 'Teste de nível grátis', abrir: 'teste' },
    { id: 'prisma',     rotulo: 'Como você aprende',     abrir: 'prisma' },
    { id: 'toronto',    rotulo: 'Intercâmbio Toronto',   abrir: 'toronto' },
    { id: 'eom',        rotulo: 'Inglês com a Bíblia',   rolar: 'eom' },
    { id: 'grupos',     rotulo: 'Grupos grátis',         rolar: 'gratis' },
    { id: 'particular', rotulo: 'Aulas particulares',    abrir: 'particular' },
    { id: 'vlogs',      rotulo: 'Vlogs de viagem',       abrir: 'vlogeuropa' },
    { id: 'escola',     rotulo: 'Escola Infly',          abrir: 'escola' }
  ],
  // atalhos que sobem conforme o foco escolhido
  procuraPorPerfil: { fala: ['mentoria', 'teste'], trabalho: ['mentoria', 'particular'], viagem: ['toronto', 'vlogs'], fe: ['eom', 'grupos'], zero: ['teste', 'prisma'] },
  // fileira que sobe pra logo depois do Programa Inteligente, conforme o foco
  ordemPorPerfil: { fala: 'alunos', trabalho: 'alunos', viagem: 'intercambio', fe: 'eom', zero: 'gratis' },

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
      tipo: 'pago', selo: 'Comece esta semana',
      img: 'img/gediel-brooklyn.webp', imgLarga: 'img/gediel-liberty.webp',
      video: 'eXfovCYxdZw',
      meta: ['6 meses', 'A1 → B2', 'Ao vivo', 'Garantia de 7 dias'],
      sinopse: 'Não é mais um curso com vídeo parado. É um cronograma de tarefas pra cada dia, aula ao vivo com o Gediel toda semana no seu nível e acompanhamento real, pra quem trava na hora de falar.',
      inclui: [
        'Aula ao vivo com o Gediel toda semana, no seu nível (A1/A2 e B1/B2)',
        'Cronograma de tarefas diárias, com missões semanais dentro dele',
        'Plataforma com mais de 80 videoaulas e 100 exercícios',
        'Diagnóstico de Múltiplas Inteligências no começo',
        'Certificado de conclusão',
        'Acesso às trilhas English On Mission, Culture English e Intercâmbio e Viagens',
        'Opção de pacotes de aula individuais, em casal ou com amigos, contratados por dentro'
      ],
      paraQuem: [
        'Você entende inglês, mas trava na hora de falar',
        'Já começou curso ou aplicativo e parou no meio',
        'Precisa do inglês no trabalho, em viagens ou no ministério',
        'Quer aprender com gente de verdade, ao vivo, e não só com vídeo gravado'
      ],
      naoE: ['Não é pra quem procura fórmula mágica sem praticar', 'nem pra quem quer só um certificado na parede'],
      objecoes: [
        ['Não tenho tempo.', 'O cronograma diário foi feito pra caber na rotina: você segue no seu ritmo. E se perder a aula ao vivo, ela fica gravada.'],
        ['Já tentei e travei.', 'Por isso o centro é a conversa ao vivo no seu nível, com correção na hora. Quem trava precisa falar, não assistir mais vídeo.'],
        ['Meu nível é muito baixo.', 'A mentoria recebe do zero. O diagnóstico no começo te coloca na turma certa desde o primeiro dia.'],
        ['E se não for pra mim?', 'São 7 dias de garantia. Participou, sentiu que não é pra você, o valor volta inteiro.']
      ],
      depois: [
        'Você recebe o acesso à plataforma no seu e-mail',
        'Faz o diagnóstico e descobre como você aprende melhor',
        'Entra na turma ao vivo do seu nível e já participa da aula desta semana'
      ],
      preco: { separado: 'De 6x de R$ 500', parcelas: 'por 6x de R$ 297', nota: 'Assinatura de 6 meses no cartão. Consulte boleto parcelado.' },
      cta: { rotulo: 'Quero minha vaga', acao: 'checkout' },
      cta2: { rotulo: 'Tirar uma dúvida', acao: 'whatsapp', texto: 'Oi Gediel! Vim pelo catálogo e quero entender a mentoria.' },
      etapas: ['diagnostico', 'aovivo', 'pratica', 'certificado', 'pacotes'],
      peso: { fala: 10, trabalho: 10, viagem: 10, fe: 9, zero: 10 }
    },

    // Como funciona a mentoria, etapa por etapa (aparece na ficha da mentoria)
    diagnostico: { titulo: 'Diagnóstico de Múltiplas Inteligências', tipo: 'etapa', img: 'img/etapa-diagnostico.webp', duracao: 'No começo',
      sinopse: 'Antes de qualquer aula, a gente descobre como você aprende melhor. O método se adapta a você, não o contrário.' },
    aovivo: { titulo: 'Aula ao vivo com o Gediel, toda semana', tipo: 'etapa', img: 'img/etapa-aovivo.webp', duracao: 'Toda semana',
      sinopse: 'Turmas por nível, A1/A2 e B1/B2, com o Gediel ao vivo. Você conversa com quem está no seu momento e é corrigido na hora, sem vergonha.' },
    pratica: { titulo: 'Cronograma de tarefas diárias', tipo: 'etapa', img: 'img/etapa-cronograma.webp', duracao: 'Todo dia, no seu ritmo',
      sinopse: 'Um cronograma com o que fazer em cada dia, que você segue por conta própria. As missões da semana ficam dentro dele, pra usar o inglês na vida real.' },
    certificado: { titulo: 'Certificado', tipo: 'etapa', img: 'img/etapa-certificado.webp', duracao: 'Ao concluir',
      sinopse: 'Concluiu o programa, recebe o certificado.' },
    pacotes: { titulo: 'Aulas individuais, em casal ou com amigos', tipo: 'etapa', img: 'img/etapa-pacotes.webp', duracao: 'Opcional',
      sinopse: 'Quem já está no programa pode contratar, lá dentro, pacotes de aulas individuais, em casal ou com amigos.' },

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
    // liberado: é a porta do Programa Inteligente, com os dois testes grátis
    diagtestes: { titulo: 'Diagnósticos e Testes', trilha: 'Programa Inteligente', tipo: 'gratis', pulsa: true, img: 'img/card-diagnostico.webp',
      meta: ['Teste Prisma', 'Teste Bússola', 'Liberado'],
      sinopse: 'O ponto de partida do Método Inteligente, liberado pra você fazer agora. Primeiro o Prisma, que mostra como você aprende pelas múltiplas inteligências. Depois a Bússola, que mostra o seu nível de inglês, do A1 ao C2.',
      cta: { rotulo: 'Fazer o teste Prisma', acao: 'prisma' },
      cta2: { rotulo: 'Fazer o teste Bússola (nível)', acao: 'teste' },
      peso: { fala: 9, trabalho: 9, viagem: 8, fe: 8, zero: 10 } },
    cronograma: { titulo: 'Cronograma', trilha: 'Programa Inteligente', bloqueado: true, img: 'img/card-cronograma.webp',
      sinopse: 'Seu plano de estudo semana a semana, montado a partir do diagnóstico.' },
    salas: { titulo: 'Salas de Interação', trilha: 'Programa Inteligente', bloqueado: true, img: 'img/card-salas.webp',
      sinopse: 'Conversa ao vivo em turma, por nível, com correção na hora.' },
    aulas: { titulo: 'Aulas', trilha: 'Programa Inteligente', bloqueado: true, img: 'img/card-aulas.webp',
      sinopse: 'As aulas da plataforma, pra estudar no seu ritmo e rever quantas vezes quiser.' },

    grupoeom: { titulo: 'Grupo do WhatsApp', grupo: 'whatsapp', trilha: 'English On Mission', tipo: 'gratis', img: 'img/logo-eom.webp', contem: true,
      meta: ['Gratuito', 'WhatsApp'],
      sinopse: 'O grupo gratuito do English On Mission, pra praticar e caminhar junto durante a semana.',
      cta: { rotulo: 'Entrar no grupo', acao: 'whatsapp', texto: 'Oi Gediel! Quero entrar no grupo gratuito do English On Mission.' },
      peso: { fala: 4, trabalho: 2, viagem: 2, fe: 9, zero: 5 } },
    devocionais: { titulo: 'Devocionais EOM', trilha: 'English On Mission', bloqueado: true, img: 'img/card-devocionais.webp',
      sinopse: 'Devocionais em inglês: um versículo e um ponto da língua de cada vez.' },
    cristao: { titulo: 'Curso de Inglês Cristão', trilha: 'English On Mission', bloqueado: true, capa: 'texto', cor: '#15281f',
      sinopse: 'Inglês estudando as cartas da Bíblia, do verb to be às cartas de João.',
      peso: { fala: 4, trabalho: 2, viagem: 2, fe: 10, zero: 5 } },
    biblia: { titulo: 'Inglês com a Bíblia', trilha: 'English On Mission', bloqueado: true, capa: 'texto', cor: '#15281f', meta: ['Extra'],
      sinopse: 'Conteúdo extra pra ler e entender a Palavra em inglês.' },

    grupoculture: { titulo: 'Grupo do WhatsApp', grupo: 'whatsapp', trilha: 'Culture English', tipo: 'gratis', capa: 'texto', cor: '#1b2a6b',
      meta: ['Gratuito', 'WhatsApp'],
      sinopse: 'O grupo gratuito do Culture English: dicas de séries, filmes e músicas pra praticar o inglês de verdade.',
      cta: { rotulo: 'Entrar no grupo', acao: 'whatsapp', texto: 'Oi Gediel! Quero entrar no grupo gratuito do Culture English.' },
      peso: { fala: 6, trabalho: 3, viagem: 5, fe: 3, zero: 5 } },
    seriesingles: { titulo: 'Inglês com Séries', trilha: 'Culture English', bloqueado: true, img: 'img/card-series.webp',
      sinopse: 'Aprender com o que você já gosta de assistir, entendendo como as pessoas falam de verdade.',
      peso: { fala: 7, trabalho: 4, viagem: 6, fe: 3, zero: 4 } },
    filmes: { titulo: 'Inglês com Filmes', trilha: 'Culture English', bloqueado: true, img: 'img/card-filmes.webp',
      sinopse: 'Cenas de filme como aula: expressões, sotaques e o inglês que não está no livro.' },
    musica: { titulo: 'Inglês com Música', trilha: 'Culture English', bloqueado: true, img: 'img/card-musica.webp',
      sinopse: 'Letra, pronúncia e ritmo: o ouvido treina enquanto você canta.' },

    inglesviagem: { titulo: 'Inglês para Viagens', trilha: 'Intercâmbio e Viagens', bloqueado: true, img: 'img/card-viagem-ingles.webp',
      sinopse: 'Aeroporto, hotel, restaurante e imprevisto: as situações que toda viagem traz.',
      peso: { fala: 5, trabalho: 3, viagem: 10, fe: 3, zero: 5 } },
    toronto: { titulo: 'Toronto 2027', trilha: 'Intercâmbio e Viagens', aberto: true, pulsa: true, selo: 'Inscrições abertas', img: 'img/card-toronto.webp',
      meta: ['Intercâmbio', '2027'],
      sinopse: 'O próximo intercâmbio da Infly. As inscrições já estão abertas: garanta seu lugar no formulário.',
      cta: { rotulo: 'Quero me inscrever', acao: 'link', href: 'toronto' },
      peso: { fala: 5, trabalho: 4, viagem: 10, fe: 3, zero: 3 } },
    vlogny: { titulo: 'Vlogs New York 2025', trilha: 'Intercâmbio e Viagens', breve: 'Em breve', indisponivel: true, img: 'img/card-vlog-ny.webp',
      meta: ['Em breve'],
      sinopse: 'Os bastidores da viagem a Nova York, com o inglês de rua acontecendo ao vivo. Em breve no YouTube.' },
    vlogeuropa: { titulo: 'Vlogs Londres, Paris e Bruxelas', trilha: 'Intercâmbio e Viagens', tipo: 'gratis', img: 'img/card-europa.webp',
      meta: ['2024', 'YouTube'],
      sinopse: 'Três cidades, três sotaques e o caderno de viagem de 2024. Os vlogs estão abertos no YouTube da Infly.',
      cta: { rotulo: 'Assistir no YouTube', acao: 'link', href: 'vlogs' },
      peso: { fala: 4, trabalho: 2, viagem: 9, fe: 2, zero: 3 } },

    // Bônus gratuitos
    // Bússola: teste de nível adaptativo (CEFR). Com o link em config.js, o botão abre o Bússola;
    // sem link, roda o teste rápido de 5 perguntas desta página.
    teste: { titulo: 'Qual é o seu nível?', tipo: 'gratis', img: 'img/card-teste.webp',
      meta: ['Teste Bússola', 'A1 → C2'],
      sinopse: 'O Bússola é o teste de nível do Método Inteligente: as perguntas se ajustam às suas respostas e mostram onde você está no quadro europeu, do A1 ao C2. Começar pelo ponto certo poupa tempo e motivação.',
      cta: { rotulo: 'Fazer o teste Bússola', acao: 'teste' },
      peso: { fala: 8, trabalho: 7, viagem: 7, fe: 7, zero: 10 } },
    // Prisma: teste de múltiplas inteligências
    prisma: { titulo: 'Teste Prisma: como você aprende?', tipo: 'gratis', pulsa: true, img: 'img/card-diagnostico.webp',
      meta: ['Múltiplas inteligências', 'Base do Método Inteligente'],
      sinopse: 'Tudo no Método Inteligente começa aqui. O Prisma mostra quais das suas inteligências mais aparecem quando você aprende, e a partir disso o caminho se adapta a você, não o contrário. É o primeiro passo de quem entra na mentoria, e você pode fazer agora, de graça.',
      cta: { rotulo: 'Fazer o teste Prisma', acao: 'prisma' },
      peso: { fala: 7, trabalho: 7, viagem: 6, fe: 6, zero: 9 } },
    liveterca: { titulo: 'Culture English Lives', tipo: 'gratis', img: 'img/card-culture-lives.webp',
      meta: ['Ao vivo', 'Gratuito'],
      sinopse: 'Lives abertas do Culture English com o Gediel: inglês de verdade a partir de séries, filmes e música, ao vivo.',
      cta: { rotulo: 'Quero o lembrete das lives', acao: 'whatsapp', texto: 'Oi Gediel! Quero receber o link das lives do Culture English.' },
      peso: { fala: 8, trabalho: 7, viagem: 7, fe: 6, zero: 8 } },
    eom: { titulo: 'English On Mission · Devocionais ao vivo', tipo: 'gratis', img: 'img/card-eom-lives.webp',
      meta: ['Devocionais ao vivo', 'Sábado, 9h', 'YouTube'],
      sinopse: 'Devocionais ao vivo em inglês, com alunos do Brasil inteiro juntos na tela. Cada encontro une um versículo da Bíblia a um ponto de gramática: do verb to be às cartas de João.',
      cta: { rotulo: 'Acompanhar o English On Mission', acao: 'link', href: 'eom' },
      peso: { fala: 5, trabalho: 2, viagem: 2, fe: 10, zero: 6 } },
    esposa: { titulo: 'Encorajando minha esposa', tipo: 'gratis', breve: 'Em breve', indisponivel: true, img: 'img/card-esposa.webp',
      meta: ['Série', 'Gediel e Mayandra', 'Indisponível'],
      sinopse: 'A Mayandra tenta primeiro, do jeito dela, sem ajuda. Depois vem a versão natural. Errar faz parte: quem tenta, aprende.',
      cta: { rotulo: 'Me avise quando lançar', acao: 'whatsapp', texto: 'Oi Gediel! Quero ser avisado quando a série Encorajando minha esposa lançar.' },
      peso: { fala: 9, trabalho: 4, viagem: 6, fe: 5, zero: 9 } },

    // Extras
    ingi: { titulo: 'Inglês Inteligente', tipo: 'gratis', img: 'img/logo-ingi.webp', contem: true,
      meta: ['@metodoinglesinteligente', 'Método'],
      sinopse: 'O método por trás de tudo: as múltiplas inteligências aplicadas ao inglês. Uma pessoa aprende ouvindo, outra fazendo, outra precisa ver escrito.',
      cta: { rotulo: 'Conhecer o método', acao: 'link', href: 'ingi' },
      peso: { fala: 6, trabalho: 6, viagem: 5, fe: 5, zero: 7 } },
    escola: { titulo: 'Escola Infly', tipo: 'extra', aberto: true, img: 'img/logo-escola-infly.webp', contem: true,
      meta: ['Presencial', 'Tupanciretã'],
      sinopse: 'A escola de inglês presencial do ecossistema, pra quem é da região e quer sala de aula de verdade.',
      cta: { rotulo: 'Ver no Instagram', acao: 'link', href: 'escola' },
      peso: { fala: 5, trabalho: 5, viagem: 4, fe: 4, zero: 7 } },
    viagens: { titulo: 'Infly Viagens', tipo: 'extra', aberto: true, img: 'img/card-infly-viagens.webp',
      meta: ['Intercâmbio', 'Viagens'],
      sinopse: 'Viagens e intercâmbio pra colocar o inglês em uso. Foi assim que alunos como o Bruno descobriram que nada mais travava.',
      cta: { rotulo: 'Ver no Instagram', acao: 'link', href: 'viagens' },
      peso: { fala: 4, trabalho: 4, viagem: 10, fe: 4, zero: 3 } },
    particular: { titulo: 'Aulas particulares', tipo: 'exclusivo', img: 'img/card-particular.webp',
      meta: ['Só para alunos'],
      sinopse: 'Pacotes de aulas individuais, em casal ou com amigos, com o Gediel. Contratados por dentro do programa, pra quem já é aluno.',
      cta: { rotulo: 'Já sou aluno, quero agendar', acao: 'whatsapp', texto: 'Oi Gediel! Já sou aluno do programa e quero agendar aulas particulares.' },
      peso: { fala: 5, trabalho: 6, viagem: 4, fe: 4, zero: 3 } }
  },

  fileiras: [
    { id: 'pra-voce', titulo: 'Escolhido pra você', dinamica: true, formato: 'poster' },
    // destaque: a fileira inteira pulsa e o título ganha a etiqueta
    { id: 'programa', titulo: 'Programa Inteligente', sub: 'Só na mentoria', etiqueta: 'Ideal pra você', destaque: true, formato: 'poster',
      itens: ['diagtestes', 'cronograma', 'salas', 'aulas'] },
    { id: 'alunos', titulo: 'Resultados de alunos', formato: 'poster',
      itens: ['levi', 'laura', 'luiz', 'alycia', 'bruno'],
      // botões embaixo da fileira (href = chave de config.instagram)
      acoes: [{ rotulo: 'Mais depoimentos no Instagram', href: 'depoimentos' },
              { rotulo: 'Veja as aulas por dentro', href: 'bastidores' }] },
    // depoimentos do EOM ficam misturados com os cards da trilha
    { id: 'eom', titulo: 'English On Mission', sub: 'Inglês com a Bíblia', formato: 'poster',
      itens: ['grupoeom', 'eomgabriel', 'devocionais', 'eomalycia', 'cristao', 'eomguilherme', 'biblia'] },
    { id: 'culture', titulo: 'Culture English', formato: 'poster',
      itens: ['grupoculture', 'seriesingles', 'filmes', 'musica'] },
    { id: 'intercambio', titulo: 'Intercâmbio e Viagens', formato: 'poster',
      itens: ['toronto', 'vlogeuropa', 'inglesviagem', 'vlogny'] },
    { id: 'gratis', titulo: 'Bônus gratuitos', formato: 'largo',
      itens: ['teste', 'prisma', 'liveterca', 'grupoculture', 'eom', 'grupoeom', 'esposa'] },
    { id: 'mais', titulo: 'Extras', formato: 'largo',
      itens: ['escola', 'viagens', 'vlogeuropa', 'ingi', 'particular'] }
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
