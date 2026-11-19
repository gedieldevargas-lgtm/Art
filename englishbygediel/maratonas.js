/* MARATONAS: a lista única usada no Hub (maratonas.html), na área de membros e no painel.
   Pra mudar data, texto ou abrir/fechar inscrição, mexa só aqui.
   status: 'andamento' = turma rodando, não entra ninguém | 'abertas' = formulário de inscrição ligado
           'em-breve' = aparece, mas só com lista de espera | 'encerrada' = acabou */
(function () {
  var L = [
    { id: 'icd-1', nome: 'O Inglês de Cada Dia', edicao: 'Turma Fundadora', icone: '☕',
      inicio: '2026-11-16', quando: 'Começou 16/11/2026', duracao: '10 meses', vagas: 15, status: 'andamento',
      cor: '#d6965a', img: 'img/maratona-casal.webp', pos: 'center 30%',
      promessa: 'Inglês dentro da rotina de verdade, com o Gediel e a esposa.',
      pra: 'Quem quer parar de “estudar inglês” e começar a viver o inglês no dia a dia.',
      aviso: 'Turma fechada com 15 pessoas. Quer a próxima? Entre na lista da Edição 2 (novembro).', proxima: 'icd-2' },
    { id: 'morar-fora', nome: 'Inglês pra morar fora do Brasil', edicao: '1ª edição', icone: '✈️',
      inicio: '2027-02-01', quando: 'Começa em fevereiro/2027', status: 'abertas',
      cor: '#3b82f6', img: 'img/maratona-ny-liberdade.webp', pos: 'center 38%',
      promessa: 'Chegar no outro país já resolvendo a vida em inglês: aeroporto, aluguel, banco, mercado, escola dos filhos.',
      pra: 'Quem tem data (ou sonho) de se mudar e quer chegar falando.',
      pergunta: [{ k: 'pais_destino', r: 'Pra qual país você quer ir?', tipo: 'texto', ph: 'Ex.: Canadá, EUA, Irlanda' },
                 { k: 'quando_vai', r: 'Quando você pretende ir?', tipo: 'opcoes', op: ['Já tenho data marcada', 'Em até 6 meses', 'Em até 1 ano', 'Mais de 1 ano', 'Ainda é um sonho'] }] },
    { id: 'mora-fora', nome: 'Inglês pra quem mora fora do Brasil', edicao: '1ª edição', icone: '🌎',
      inicio: '2027-05-03', quando: 'Começa em maio/2027', status: 'abertas',
      cor: '#10b981', img: 'img/maratona-ny-metro.webp', pos: 'center 40%',
      promessa: 'Parar de depender dos outros: trabalho, médico, vizinho, escola, igreja. Falar sem travar onde você já mora.',
      pra: 'Brasileiros que já vivem fora e ainda travam no inglês.',
      pergunta: [{ k: 'pais_atual', r: 'Em qual país você mora?', tipo: 'texto', ph: 'Ex.: EUA (Flórida)' },
                 { k: 'tempo_fora', r: 'Há quanto tempo mora fora?', tipo: 'opcoes', op: ['Menos de 1 ano', '1 a 3 anos', '3 a 5 anos', 'Mais de 5 anos'] }] },
    { id: 'carreira', nome: 'Inglês para carreira', edicao: '1ª edição', icone: '💼',
      inicio: '2027-08-02', quando: 'Começa em agosto/2027', status: 'abertas',
      cor: '#8b5cf6', img: 'img/maratona-ny-retrato.webp', pos: 'center 30%',
      promessa: 'Entrevista, reunião, apresentação e e-mail em inglês. O inglês que abre vaga e aumenta salário.',
      pra: 'Profissionais que precisam do inglês pra crescer, trocar de emprego ou trabalhar pra fora.',
      pergunta: [{ k: 'area', r: 'Qual é a sua área de trabalho?', tipo: 'texto', ph: 'Ex.: TI, saúde, vendas, educação' },
                 { k: 'uso_trabalho', r: 'Pra que você precisa do inglês no trabalho?', tipo: 'opcoes', op: ['Entrevista de emprego', 'Reuniões e calls', 'Promoção / cargo novo', 'Trabalhar pra empresa de fora', 'Ainda não sei'] }] },
    { id: 'icd-2', nome: 'O Inglês de Cada Dia', edicao: 'Edição 2', icone: '☕',
      inicio: '2027-11-08', quando: 'Começa em novembro/2027', duracao: '10 meses', status: 'abertas',
      cor: '#d6965a', img: 'img/maratona-ny-parque.webp', pos: 'center 40%',
      promessa: 'A maratona de 10 meses com o Gediel e a esposa, agora na segunda turma. Inglês dentro da sua rotina.',
      pra: 'Quem perdeu a Turma Fundadora e quer viver o inglês no dia a dia.',
      pergunta: [{ k: 'rotina', r: 'Qual parte do seu dia é mais livre?', tipo: 'opcoes', op: ['Manhã', 'Hora do almoço', 'Tarde', 'Noite', 'Fim de semana'] }] }
  ];

  // perguntas iguais pra todas (o que o comercial precisa pra chamar depois)
  var COMUNS = {
    nivel: ['Do zero', 'Básico (entendo pouco)', 'Intermediário (entendo, mas travo)', 'Avançado', 'Não sei'],
    objetivo: ['Viagem', 'Morar fora', 'Trabalho / carreira', 'Fé / missões', 'Estudos / intercâmbio', 'Falar com família ou amigos', 'Realização pessoal'],
    turno: ['Manhã', 'Tarde', 'Noite', 'Fim de semana'],
    momento: ['Quero garantir minha vaga', 'Quero saber valores e formato', 'Só quero ser avisado(a)'],
    origem: ['Instagram', 'YouTube', 'TikTok', 'Indicação de amigo', 'Igreja', 'Já sou aluno(a)', 'Outro']
  };
  // temperatura pro comercial: quem quer garantir vaga é quente
  function temperatura(momento) { return /garantir/i.test(momento || '') ? 'quente' : /valores/i.test(momento || '') ? 'morno' : 'frio'; }

  function hoje() { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  // status real: a data manda (quando chega o dia, a inscrição fecha sozinha)
  function status(m) {
    if (m.status === 'encerrada') return 'encerrada';
    if (m.status === 'andamento' || hoje() >= m.inicio) return 'andamento';
    return m.status || 'abertas';
  }
  var ROTULO = { andamento: 'Em andamento', abertas: 'Inscrições abertas', 'em-breve': 'Em breve', encerrada: 'Encerrada' };
  function diasAte(m) { return Math.ceil((new Date(m.inicio + 'T00:00') - new Date()) / 864e5); }

  /* MARATONA 10 MESES (Turma Fundadora): 5 ciclos de 2 meses. Só quem foi escolhido vê. */
  var CICLOS = [
    { n: 1, nome: 'Casa', icone: '🏠', de: '2026-11-16', ate: '2027-01-15',
      foco: 'Fundação: o inglês da sua casa e da sua manhã.',
      marcos: ['Rotina da manhã em inglês (acordar, café, sair)', 'Nomear tudo da casa e da cozinha', 'Falar da família e de quem mora com você', 'Contar o seu dia em 2 minutos (gravado)'],
      entrega: 'Áudio de 2 minutos contando o seu dia, do acordar ao dormir.' },
    { n: 2, nome: 'Rua', icone: '🛒', de: '2027-01-16', ate: '2027-03-15',
      foco: 'Sair de casa em inglês: mercado, café, transporte, pedir ajuda.',
      marcos: ['Pedir comida e bebida sem travar', 'Mercado, preços e pagamento', 'Direções, transporte e horários', 'Resolver um problema (troca, erro, reclamação)'],
      entrega: 'Simulação gravada: pedido completo num café, do “hi” ao “thank you”.' },
    { n: 3, nome: 'Trabalho e estudo', icone: '💼', de: '2027-03-16', ate: '2027-05-15',
      foco: 'Explicar o que você faz e se virar no mundo profissional.',
      marcos: ['Se apresentar profissionalmente', 'Explicar o seu trabalho ou o seu estudo', 'Mensagens e e-mails curtos', 'Participar de uma conversa em grupo'],
      entrega: 'Pitch de 1 minuto: quem você é, o que faz e o que quer.' },
    { n: 4, nome: 'Pessoas e fé', icone: '🙏', de: '2027-05-16', ate: '2027-07-15',
      foco: 'Conversa de verdade: opinião, histórias, sentimentos, testemunho.',
      marcos: ['Dar opinião e concordar / discordar', 'Contar uma história no passado', 'Falar de sentimentos e planos', 'Compartilhar um testemunho ou uma lição de vida'],
      entrega: 'História de 3 minutos (pode ser o seu testemunho).' },
    { n: 5, nome: 'Mundo', icone: '🌍', de: '2027-07-16', ate: '2027-09-15',
      foco: 'Fluência espontânea: viagem, imprevisto, conversa livre.',
      marcos: ['Viagem do check-in ao check-out', 'Lidar com imprevistos', 'Conversa livre sem roteiro', 'Apresentação final da maratona'],
      entrega: 'Conversa livre de 10 minutos com o Gediel e a Mayandra + certificado.' }
  ];
  // adaptação: antes de liberar o checklist dos ciclos, a pessoa conhece a plataforma
  var ADAPT = { aulas: 5 };
  // pontos (os mesmos da função maratona_ranking no Supabase). Tetos por dia deixam qualquer um alcançar o 1º.
  var PONTOS = [
    ['📅', 'Cada dia que você usa a plataforma', 10, ''],
    ['🎬', 'Cada aula assistida', 10, ''],
    ['✅', 'Cada marco do checklist do ciclo', 15, ''],
    ['🎯', 'Entrega do ciclo', 60, ''],
    ['💬', 'Comentário numa aula', 5, 'até 3 por dia'],
    ['🧠', 'Cada acerto no quiz das aulas', 2, ''],
    ['🎮', 'Cada minuto de jogo', 1, 'até 30 por dia'],
    ['📲', 'Post nas redes sobre a maratona (com link)', 20, '1 por dia']
  ];
  var PREMIOS = { concluir: 'Quem concluir a maratona ganha acesso vitalício ao Plano Gênio.', primeiro: 'O 1º lugar geral leva um prêmio surpresa. É mistério. 🤫' };
  var M10 = { id: 'icd-1', inicio: '2026-11-16', fim: '2027-09-15', ciclos: CICLOS, adapt: ADAPT, pontos: PONTOS, premios: PREMIOS };

  window.EBG_MARATONAS = { lista: L, comuns: COMUNS, status: status, rotulo: ROTULO, diasAte: diasAte, temperatura: temperatura, hoje: hoje, m10: M10,
    porId: function (id) { return L.filter(function (m) { return m.id === id; })[0]; },
    abertas: function () { return L.filter(function (m) { return status(m) === 'abertas'; }); } };
})();
