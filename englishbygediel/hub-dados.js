/* Conteúdo do Hub (hub.html) como dados editáveis.
   HUB_PADRAO monta o conteúdo de fábrica a partir do content.js e do config.js.
   O que você salva no painel (/admin → aba Hub) fica na tabela site_config do Supabase
   e substitui o padrão, seção por seção. */
(() => {
  const https = u => (/^https:\/\//i.test(u || '') ? u : '');

  // quais modos são grátis e quais abrem com um plano (muda no painel, em Modos → Acesso)
  const ACESSO_PADRAO = { teste: 'gratis', zero: 'gratis', jogos: 'gratis', prompts: 'gratis', materiais: 'gratis', fe: 'mission' };
  // páginas de produto: "o que tem dentro" e "pra quem é" reorganizados a partir da descrição que já existe de cada material.
  // Onde a descrição não diz, fica [PREENCHER]. No painel (Cards → O que tem dentro / Pra quem é) dá pra trocar tudo.
  const PRODUTO_PADRAO = [
    { re: /passaporte do ingl[eê]s/i, praQuem: 'Pra quem tem viagem marcada e não quer depender de ninguém lá fora.',
      inclui: ['10 situações, do aeroporto à emergência', 'O que falar e o que você vai ouvir em cada uma', 'Vocabulário com imagem', 'Frases e diálogos reais', 'Planner de viagem', '[PREENCHER: quantidade de páginas]'] },
    { re: /guia de ingl[eê]s (por n[ií]vel )?a1/i, praQuem: 'Pra quem fica pulando de vídeo em vídeo sem saber o que estudar em cada fase.',
      inclui: ['Um mapa claro do A1 ao B2: o que estudar em cada fase', 'Planos semanais de 30 a 60 minutos', 'Missões e checklists pra transformar conteúdo em prática', '20 páginas em PDF'] },
    { re: /destrave seu ingl[eê]s|pron[uú]ncia pra brasileiro/i, praQuem: 'Pra quem trava na hora de falar e não entende os símbolos de dicionário.',
      inclui: ['Pronúncia escrita do jeito que brasileiro lê: chocolate vira TCHÓK-let', '4 níveis, do fácil ao chefão, cada um com explicação e exercício', 'Canais do YouTube pra praticar cada nível', '15 páginas, acesso imediato'] },
    { re: /kit de frases/i, praQuem: 'Pra quem precisa de frases prontas pras situações essenciais do dia a dia.',
      inclui: ['Frases prontas pras situações essenciais do dia a dia', 'Pra falar em voz alta, sem montar frase na cabeça', '[PREENCHER: quantas frases e quais situações]', '[PREENCHER: formato (PDF? áudio?)]'] },
    { re: /b[ií]blia linear/i, praQuem: 'Pra quem quer aprender inglês com a Bíblia.',
      inclui: ['As cartas de 1, 2 e 3 João', 'Inglês e português lado a lado, versículo por versículo', '[PREENCHER: quantidade de páginas e formato]'] },
    { re: /aula secreta/i, praQuem: '[PREENCHER: pra quem é a Aula Secreta]',
      inclui: ['[PREENCHER: o que a pessoa leva na Aula Secreta (formato, duração, o que aprende)]', '[PREENCHER: item 2]', '[PREENCHER: item 3]'] }
  ];
  function padrao(C, CFG) {
    const whats = t => `https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent(t || '')}`;
    const destino = cta => {
      if (!cta) return '';
      if (cta.acao === 'whatsapp') return whats(cta.texto);
      if (cta.acao === 'teste') return https(CFG.bussola);
      if (cta.acao === 'prisma') return https(CFG.prisma);
      if (cta.acao === 'checkout') return https(CFG.checkoutMentoria);
      if (cta.acao === 'link') return https(cta.href) || https(CFG[cta.href]) || https((CFG.instagram || {})[cta.href]);
      return '';
    };
    const setor = (k, it) => (/teste|prisma|diag/.test(k) ? 'Testes' : it.grupo ? 'Comunidade' : 'Ao vivo');
    const cards = [];
    (C.materiais || []).filter(x => x.gratis).forEach(x => cards.push(material(x)));
    Object.entries(C.itens || {}).forEach(([k, it]) => {
      if (it.tipo !== 'gratis' || it.indisponivel) return;
      cards.push({ id: k, tipo: 'gratis', ativo: true, titulo: it.titulo, linha: '', nome: '', setor: setor(k, it),
        img: it.img && !/logo-/.test(it.img) ? it.img : '', preco: '',
        link: destino(it.cta), botao: (it.cta || {}).rotulo || '', link2: destino(it.cta2), botao2: (it.cta2 || {}).rotulo || '',
        video: '', sinopse: it.sinopse || '', meta: (it.meta || []).join(', '), modos: it.modos || [] });
    });
    (C.materiais || []).filter(x => !x.gratis).forEach(x => cards.push(material(x)));
    // o que fica dentro da mentoria (trancado) e o resto do ecossistema (escola, viagens, intercâmbio, aulas particulares)
    Object.entries(C.itens || {}).forEach(([k, it]) => {
      if (it.indisponivel || it.tipo === 'etapa' || it.tipo === 'aluno' || it.tipo === 'gratis' || k === 'mentoria') return;
      const membros = !!it.bloqueado;
      cards.push({ id: k, tipo: membros ? 'membros' : 'extra', ativo: true, titulo: it.titulo, linha: it.trilha || (it.meta || [])[0] || '', nome: '',
        setor: it.trilha || 'Ecossistema', img: it.img && !/logo-/.test(it.img) ? it.img : (it.img || ''), preco: it.selo && !membros ? it.selo : '',
        link: membros ? '' : destino(it.cta), botao: membros ? '' : (it.cta || {}).rotulo || '', link2: '', botao2: '', video: '',
        sinopse: it.sinopse || '', meta: (it.meta || []).join(', '), modos: it.modos || [] });
    });
    Object.entries(C.itens || {}).forEach(([k, it]) => {
      if (it.tipo !== 'aluno') return;
      cards.push({ id: k, tipo: 'aluno', ativo: true, titulo: it.titulo, linha: '', nome: it.nome, setor: 'Alunos',
        img: it.img, preco: '', link: '', botao: '', link2: '', botao2: '', video: it.video || '',
        sinopse: it.sinopse || '', meta: [it.nome, it.arroba].filter(Boolean).join(', '), modos: it.modos || [] });
    });
    function material(x) {
      return { id: x.id, tipo: x.gratis ? 'gratis' : 'pago', ativo: true, titulo: x.titulo, linha: x.linha || '', nome: '', setor: x.cat || '',
        img: x.img || '', preco: x.preco || '', link: x.link || '',
        botao: x.link ? (x.gratis ? 'Pegar de graça' : 'Quero o ' + x.titulo) : 'Quero saber quando sai',
        link2: '', botao2: '', video: '', sinopse: x.sinopse || '', meta: (x.meta || []).join(', '), modos: x.modos || [] };
    }
    const M = (C.itens || {}).mentoria || {};
    return {
      tema: { fundo: '#0a1426', card: '#13233f', destaque: '#4a5a35', destaqueClaro: '#8fa66a', texto: '#ffffff', suave: '#a7b3c6', gradiente: 'img/gradiente-azul.webp' },
      // abertura: a promessa (a dor de quem estuda há anos e trava) no lugar de "Qual modo você quer ligar hoje?"
      entrada: { marca: 'englishbygediel', rotulo: '11 anos de sala de aula · +700 alunos', titulo: 'Anos de inglês e você', palavra: 'ainda trava', tituloFim: '?',
        dica: 'Gire e escolha o seu universo. Os com cadeado abrem no Programa.', foto: 'img/gediel-centro.webp', fundo: 'img/gradiente-azul.webp', botao: 'Ligar',
        nota: 'Pra liberar todos os modos: Programa Inteligente', giraSozinho: false, pedirContato: true,
        contatoTitulo: 'Antes de ligar', contatoTexto: 'Me diz quem é você e eu libero o modo e o seu primeiro material grátis.', contatoBotao: 'Ligar e receber o material' },
      // acesso de cada modo (etiqueta no card do anel): grátis, abre com o Programa ou com o Mission
      modos: (C.modos || []).map(m => ({ id: m.id, nome: m.nome, img: m.img, marca: m.marca || '', texto: (C.textoModo || {})[m.id] || '',
        recorte: !!m.recorte, tamanho: m.recorte || 100, verde: !!m.verde, ativo: true, acesso: ACESSO_PADRAO[m.id] || 'programa' })),
      topo: { nome: 'Gediel Vargas', verificado: true, cargo: 'Professor · Mentor · Inglês Inteligente',
        bio: 'Onze anos de sala de aula e mais de 700 alunos. Aqui estão meus materiais grátis, os completos e a porta pro Programa Inteligente.',
        avatar: 'img/gediel-brooklyn.webp', fundo: 'img/gradiente-azul.webp' },
      redes: [
        { tipo: 'youtube', url: (CFG.redes || {}).youtube || '' },
        { tipo: 'tiktok', url: (CFG.redes || {}).tiktok || '' },
        { tipo: 'instagram', url: (CFG.instagram || {}).ebg || '' },
        { tipo: 'whatsapp', url: whats('Oi Gediel! Vim pelo Hub.') }
      ],
      atalhos: [
        { titulo: 'Grátis', sub: 'Pegue e use hoje', texto: 'Jogos, testes, lives e e-books pra começar hoje.', preco: 'R$ 0', img: 'img/card-teste.webp', ir: 'gratis', icone: 'estrela' },
        { titulo: 'E-books', sub: 'Pra ir mais fundo', texto: 'Guias práticos pra estudar no seu ritmo.', auto: 'ebooks', img: 'img/card-aulas.webp', ir: 'pagos', icone: 'livro' },
        { titulo: 'Alunos', sub: 'Resultados reais', texto: 'Veja quem já destravou o inglês.', img: 'img/aula-turma.webp', ir: 'alunos', icone: 'pessoas' },
        { titulo: 'Programa', sub: 'Fale comigo', texto: 'Aula ao vivo, plano pra cada dia e acompanhamento.', plano: 'Inteligente', img: 'img/gediel-london.webp', ir: 'aplicar', icone: 'chat' },
        { titulo: 'Já é aluno?', sub: 'Área de membros', texto: 'Entre e continue de onde parou.', img: 'img/card-aulas.webp', ir: 'login', icone: 'cadeado' }
      ],
      destaque: { rotulo: 'Vídeo em destaque', titulo: 'Programa Inteligente', img: 'img/apresentacao.webp', botao: '▶ Assistir e ver detalhes',
        texto: 'Aula ao vivo toda semana no seu nível, cronograma pra cada dia e acompanhamento de perto.' },
      mentoria: { titulo: 'Programa Inteligente', sinopse: M.sinopse || '', inclui: (M.inclui || []).join('\n'),
        meta: (M.meta || []).join(', '), precoDe: (M.preco || {}).separado || '', precoPor: (M.preco || {}).parcelas || '', nota: (M.preco || {}).nota || '',
        video: M.video || CFG.videoApresentacao || '', img: M.imgLarga || M.img || '', checkout: CFG.checkoutMentoria || '',
        botaoAplicar: 'Quero entrar no Programa', botaoComprar: (M.cta || {}).rotulo || 'Quero minha vaga' },
      secoes: { gratis: 'Materiais grátis', pagos: 'Pra ir mais fundo', botaoPagos: 'Ver planos →', membros: 'Dentro do Programa Inteligente', membrosSub: 'Só pra alunos',
        // funil: títulos das seções novas
        depoimentos: 'Eles também travavam.', depoimentosTexto: 'Alunos reais contando, em vídeo, o que mudou.',
        aulaSecretaRotulo: 'Porta de entrada · R$ 47', programaRotulo: 'Acompanhamento de perto', programaBotao: 'Quero entrar no Programa',
        maratonasTitulo: 'Maratonas do Programa', maratonasTexto: 'A que está rodando e a próxima. Maratona incluída no Programa Inteligente.',
        faq: 'Perguntas frequentes',
        // páginas de produto (materiais à venda)
        garantia: 'Garantia de 7 dias', dentroTitulo: 'O que tem dentro', praQuemTitulo: 'Pra quem é', porDentro: 'Por dentro',
        alemTitulo: 'Quer ir além do e-book?', alemTexto: 'Veja a Aula Secreta: os 3 segredos pra destravar a fala.',
        alemPrograma: 'Quer o acompanhamento completo? Conheça o Programa Inteligente.', comprar: 'Comprar agora',
        planosRotulo: 'Planos', planos: 'Escolha até onde você quer ir', planosSub: 'Todo mundo começa no Grátis. Cada plano libera um nível a mais da plataforma.',
        planosAviso: 'Aula particular com o Gediel não está inclusa em nenhum plano: a partir do Programa Inteligente você pode pedir um horário, e o valor é combinado direto com ele.',
        escadaTitulo: 'Por onde começar', escadaTexto: 'Cada degrau leva você um passo adiante. Comece pelo que faz sentido hoje.',
        pagosConfianca: '🔒 Pagamento seguro pela Kiwify. Você finaliza a compra na página deles.',
        gratisTexto: 'Comece por aqui: é tudo de graça, é só tocar no que te interessa.',
        gratisFaixa: 'Os jogos, as lives abertas e os materiais da plataforma ficam na área de membros.',
        pagosTexto: 'Materiais completos pra ir mais fundo, com pagamento único.',
        membrosTexto: 'O que abre com o Programa Inteligente: aulas, lives, salas de prática e acompanhamento.',
        extrasTexto: 'Outros projetos do Gediel: escola, viagens e aulas particulares.', extras: 'Outros projetos',
        alunosTexto: 'Histórias reais de quem aprendeu com o método.',
        jogos: 'Jogos', simuladores: 'Simuladores', alunos: 'Mais histórias de alunos', botaoAluno: 'Quero esse resultado' },
      membros: { botaoTopo: 'Entrar', titulo: 'Área de membros', url: 'membros.html',
        texto: 'Já é aluno ou comprou um material? Entre com o e-mail que você usou na compra pra acessar suas aulas, trilhas e materiais.',
        botao: 'Entrar na área de membros', semConta: 'Ainda não sou aluno', cardBotao: 'Já sou aluno, entrar' },
      cards,
      // escada de valor no topo: grátis → e-book → assinatura → programa. Preço vem dos cards (auto) e dos planos (plano)
      escada: [   // desligada por padrão: as mesmas informações agora ficam nos atalhos do topo
        /* { ativo: true, icone: '🎁', titulo: 'Comece grátis', preco: 'R$ 0', texto: 'Testes, prompts, jogos e e-books gratuitos', ir: 'gratis' },
        { ativo: true, icone: '📘', titulo: 'E-books', auto: 'ebooks', preco: '', texto: 'Guias rápidos, com pagamento único', ir: 'pagos' },
        { ativo: true, icone: '📖', titulo: 'Assinatura Mission', plano: 'Mission', preco: '', texto: 'Devocionais e inglês com a Bíblia', ir: 'planos' },
        { ativo: true, icone: '🧠', titulo: 'Programa Inteligente', plano: 'Inteligente', preco: '', texto: 'Aulas ao vivo e acompanhamento de perto', ir: 'planos' } */
      ],
      // aba de planos (preços): igual à da área de membros, em cartões com brilho. Benefícios: um por linha
      planos: [
        { ativo: true, nome: 'Grátis', sub: 'Pra conhecer o método', icone: '🎁', cor: '#8fa66a', preco: 'R$ 0', promo: '', promoAte: '', promoNome: '', nota: 'pra sempre', selo: '', destaque: false, acao: 'login', botao: 'Entrar na plataforma', link: '', modos: [],
          beneficios: ['Jogos', 'Testes e diagnósticos', 'Lives abertas', 'Prompts', 'E-books gratuitos'].join('\n') },
        { ativo: true, nome: 'Mission', sub: 'Inglês com a Bíblia', icone: '📖', cor: '#3fb27f', preco: 'R$ 25/mês', promo: '', promoAte: '', promoNome: '', nota: 'assinatura mensal', selo: '', destaque: false, acao: 'link', botao: 'Quero o Mission', link: 'https://pay.kiwify.com.br/oIjfTK8', modos: ['fe'],
          beneficios: ['Tudo do Grátis', 'Devocionais gravados', 'Inglês bíblico na prática', 'Comunidade do English on Mission', 'Materiais do EOM'].join('\n') },
        { ativo: true, nome: 'Inteligente', sub: 'O Programa completo', icone: '🧠', cor: '#7a8cff', preco: '6x R$ 297', promo: '6x R$ 197', promoAte: '2026-11-30', promoNome: 'Black Friday', nota: 'em até 6x', selo: '', destaque: true, acao: 'link', botao: 'Quero entrar no Programa', link: 'https://pay.kiwify.com.br/CohRPDI', modos: [],
          beneficios: ['Tudo do Grátis', 'Todas as aulas do Programa', 'Todos os materiais', 'Lives com replay', 'Pode pedir aula particular com o Gediel (paga à parte)'].join('\n') },
        { ativo: true, nome: 'Gênio', sub: 'Tudo liberado', icone: '👑', cor: '#e0b43a', preco: '6x R$ 329', promo: '', promoAte: '', promoNome: '', nota: 'em até 6x', selo: 'Mais completo', destaque: false, acao: 'whatsapp', botao: 'Quero o Gênio', link: '', modos: [],
          beneficios: ['Tudo do Programa Inteligente + Mission', 'Todos os e-books e mini-cursos', 'Tudo que for lançado, sem pagar de novo', 'Pode pedir aula particular com o Gediel (paga à parte)'].join('\n') },
        { ativo: true, nome: 'Instituição', sub: 'Igrejas, escolas, empresas e grupos', icone: '🏫', cor: '#9fb3d9', preco: 'A combinar', promo: '', promoAte: '', promoNome: '', nota: 'sob medida', selo: '', destaque: false, acao: 'whatsapp', botao: 'Combinar pelo WhatsApp', link: '', modos: [],
          beneficios: ['Tudo do Gênio pra cada pessoa', 'Quantidade de colaboradores sob medida', 'Turmas e lives combinadas com o grupo', 'Encontros com o Gediel definidos no contrato'].join('\n') }
      ],
      // lojinha: coluna fina na lateral (passarela vertical) + janela com os achados de afiliado e os seus produtos
      lojinha: { ativo: true, rail: 'Loja', titulo: 'Achados do Gediel', sub: 'Minhas indicações pra estudar, ler e viajar, e os meus materiais.',
        aviso: 'Alguns links são de afiliado: posso receber comissão por compras qualificadas, sem custo a mais pra você. Como associado da Amazon, eu ganho com compras qualificadas. Preços de referência, sujeitos a alteração: confira o valor e a disponibilidade na loja.' },
      achados: [
        { ativo: true, cat: 'Estudo', loja: 'Amazon', titulo: 'English for Everyone: English Grammar Guide', desc: 'Um guia visual de gramática para consultar enquanto você estuda.', preco: '', link: 'https://amzn.to/4iyoaQO', img: 'img/achados/0.webp' },
        { ativo: true, cat: 'Estudo', loja: 'Amazon', titulo: 'The Five Minute Journal', desc: 'Um diário guiado para praticar a escrita em inglês em poucos minutos.', preco: '', link: 'https://link.amazon/B0cYbg3Hr', img: 'img/achados/1.webp' },
        { ativo: true, cat: 'Fé', loja: 'Mercado Livre', titulo: 'Bíblia bilíngue NVI/NIV', desc: 'Leia a Bíblia em português e inglês e compare as duas traduções.', preco: '', link: 'https://meli.la/28NzfyU', img: 'img/achados/2.webp' },
        { ativo: true, cat: 'Estudo', loja: 'Mercado Livre', titulo: 'Dobble Clássico', desc: 'Jogue com a família e experimente nomear os símbolos em inglês.', preco: '', link: 'https://meli.la/2uR3Mz4', img: 'img/achados/3.webp' },
        { ativo: true, cat: 'Estudo', loja: 'Mercado Livre', titulo: 'Kit de cadernos A5 e A6', desc: 'Dois cadernos de discos para organizar frases, vocabulário e anotações.', preco: 'R$ 47,43', link: 'https://meli.la/1y58Nnf', img: 'img/achados/4.webp' },
        { ativo: true, cat: 'Viagem', loja: 'Mercado Livre', titulo: 'Organizador de mala de 7 peças', desc: 'Separe roupas e acessórios em bolsas dentro da mala.', preco: 'R$ 36,00', link: 'https://meli.la/1Lai5vf', img: 'img/achados/5.webp' },
        { ativo: true, cat: 'Viagem', loja: 'Mercado Livre', titulo: 'Almofada de pescoço', desc: 'Apoio para o pescoço em viagens de avião, ônibus ou carro.', preco: 'R$ 43,89', link: 'https://meli.la/2wNHYEe', img: 'img/achados/6.webp' },
        { ativo: true, cat: 'Viagem', loja: 'Real Seguro Viagem', titulo: 'Real Seguro Viagem', desc: 'Consulte opções de seguro para as datas e o destino da sua viagem.', preco: '', link: 'https://www.seguroviagem.srv.br/?ag=Us59wEJXEu', img: 'img/achados/7.webp' }
      ],
      // galerias em loop (ícones pequenos; ao tocar abre a ficha com o botão Jogar)
      jogos: [
        { ativo: true, titulo: 'Flashcards', icone: '🃏', img: '', sub: 'Vocabulário · A1–B1', sinopse: 'Cartas de vocabulário com repetição espaçada: o que você erra volta mais vezes, o que você já sabe espaça.', comoJogar: '', link: '', botao: 'Jogar' },
        { ativo: true, titulo: 'Quiz Phrase', icone: '🧩', img: '', sub: 'Frases · A2–B1', sinopse: 'Monte a frase certa a partir de palavras soltas e pratique estruturas reais.', comoJogar: '', link: '', botao: 'Jogar' },
        { ativo: true, titulo: 'Escuta Rápida', icone: '⏱️', img: '', sub: 'Listening · A2–B2', sinopse: 'Áudios curtos e perguntas rápidas pra treinar o ouvido.', comoJogar: '', link: '', botao: 'Jogar' },
        { ativo: true, titulo: 'Monta Frase', icone: '🔧', img: '', sub: 'Gramática · A1–A2', sinopse: 'Arraste as palavras na ordem certa e fixe a estrutura da frase.', comoJogar: '', link: '', botao: 'Jogar' },
        { ativo: true, titulo: 'Caça Erros', icone: '🔍', img: '', sub: 'Correção · B1', sinopse: 'Um texto com erros sutis: encontre todos e corrija.', comoJogar: '', link: '', botao: 'Jogar' },
        { ativo: true, titulo: 'Imite o Som', icone: '🎙️', img: '', sub: 'Pronúncia · A1–B1', sinopse: 'Ouça um nativo, repita em voz alta e compare a sua pronúncia.', comoJogar: '', link: '', botao: 'Jogar' },
        { ativo: true, titulo: 'Letra & Música', icone: '🎵', img: '', sub: 'Música · todos os níveis', sinopse: 'Preencha as lacunas da letra enquanto a música toca.', comoJogar: '', link: '', botao: 'Jogar' },
        { ativo: true, titulo: 'Complete', icone: '✏️', img: '', sub: 'Vocabulário · A1', sinopse: 'Frases com lacunas: escolha a palavra certa do banco de palavras.', comoJogar: '', link: '', botao: 'Jogar' },
        { ativo: true, titulo: 'Sons do IPA', icone: '🔊', img: '', sub: 'Sons · B1–B2', sinopse: 'Treine os fonemas do inglês e os pares mínimos.', comoJogar: '', link: '', botao: 'Jogar' }
      ],
      simuladores: [
        { ativo: true, titulo: 'Entrevista de emprego', icone: '💼', img: '', sub: 'Carreira · B1–B2', sinopse: 'Simule uma entrevista em inglês, com perguntas reais e respostas pra treinar.', comoJogar: '', link: '', botao: 'Jogar' },
        { ativo: true, titulo: 'Check-in no aeroporto', icone: '✈️', img: '', sub: 'Viagens · A2–B1', sinopse: 'Do balcão ao portão: treine o que falar em cada etapa da viagem.', comoJogar: '', link: '', botao: 'Jogar' },
        { ativo: true, titulo: 'Pedir no restaurante', icone: '🍽️', img: '', sub: 'Dia a dia · A1–A2', sinopse: 'Peça a comida, tire dúvidas do cardápio e feche a conta.', comoJogar: '', link: '', botao: 'Jogar' },
        { ativo: true, titulo: 'Reunião em inglês', icone: '🗣️', img: '', sub: 'Carreira · B1–B2', sinopse: 'Treine opinar, concordar e discordar numa reunião de trabalho.', comoJogar: '', link: '', botao: 'Jogar' }
      ],
      aplicacao: { rotulo: 'Aplicação · menos de 2 minutos', titulo: 'Seu inglês precisa caber', destaque: 'na sua vida.',
        texto: 'Estou selecionando pessoas pra um processo de inglês adaptado à rotina real e aos objetivos de cada uma. Responda aqui no chat; no fim, as respostas vão organizadas pro meu WhatsApp.',
        foto: 'img/gediel-brooklyn.webp', whatsapp: CFG.whatsapp || '' },
      // sites inteiros que aparecem dentro de um modo (ex.: a Central de Prompts no Modo Prompts)
      embutidos: [
        { modo: 'prompts', ativo: true, titulo: 'Central de Prompts', sub: '50 prompts grátis. Escolha, personalize, copie e cole no ChatGPT ou no Claude.',
          url: 'central-prompts.html', altura: 88, botao: 'Abrir em tela cheia' }
      ],
      // destaque flutuante (pisca na abertura e no Hub) com contagem regressiva
      maratona: { ativo: true, rotulo: 'Maratona', titulo: 'O Inglês de Cada Dia', sub: 'Inglês dentro da sua rotina', selo: 'Turma Fundadora',
        detalhe: 'Começa 16/11 · 10 meses · só 15 pessoas selecionadas', foto: 'img/maratona-casal.webp', img: 'img/maratona.webp',
        fim: '2026-11-16T00:00', textoFim: 'Começou! Fale comigo pra saber das vagas',
        texto: 'Uma maratona de 10 meses com o Gediel e a esposa, com o inglês dentro da sua rotina de verdade. É a Turma Fundadora: só 15 pessoas serão selecionadas.',
        link: '', botao: 'Quero minha vaga', mensagem: 'Oi Gediel! Quero uma vaga na Maratona O Inglês de Cada Dia (Turma Fundadora).' },
      rodape: { nome: 'Gediel Vargas', linha: 'English by Gediel · Método Inteligente' }
    };
  }

  // o salvo substitui o padrão: seções com campos se misturam, listas trocam inteiras
  function juntar(base, salvo) {
    if (!salvo || typeof salvo !== 'object') return base;
    const r = { ...base };
    Object.keys(salvo).forEach(k => {
      const v = salvo[k];
      if (Array.isArray(v)) r[k] = v;
      else if (v && typeof v === 'object' && base[k] && typeof base[k] === 'object' && !Array.isArray(base[k])) r[k] = { ...base[k], ...v };
      else if (v !== undefined) r[k] = v;
    });
    return r;
  }

  async function carregar(C, CFG) {
    const base = padrao(C, CFG);
    // pré-visualização do painel: o rascunho fica no navegador de quem edita
    if (/[?&](rascunho|editar)\b/.test(location.search)) {
      try { const r = JSON.parse(localStorage.getItem('ebg:hubrascunho')); if (r) return juntar(base, r); } catch (e) {}
    }
    if (!CFG.supabaseUrl || !CFG.supabaseAnonKey) return base;
    // abre na hora com o último conteúdo salvo neste aparelho e atualiza por trás pra próxima visita
    let guardado = null;
    try { guardado = JSON.parse(localStorage.getItem('ebg:hubcache') || 'null'); } catch (e) {}
    const buscar = buscarSalvo(CFG).then(d => { if (d) try { localStorage.setItem('ebg:hubcache', JSON.stringify(d)); } catch (e) {} return d; });
    // link direto (?abrir=...): o material pode ser novo e faltar na cópia guardada, então espera o conteúdo atualizado
    if (guardado && !/[?&]abrir=/.test(location.search)) return juntar(base, guardado);
    const d = await buscar;
    return juntar(base, d || guardado);
  }

  async function buscarSalvo(CFG) {
    try {
      const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 3500);
      const r = await fetch(`${CFG.supabaseUrl.replace(/\/$/, '')}/rest/v1/site_config?id=eq.hub&select=dados`,
        { headers: { apikey: CFG.supabaseAnonKey, Authorization: `Bearer ${CFG.supabaseAnonKey}` }, signal: ctl.signal });
      clearTimeout(t);
      if (!r.ok) return null;
      const linhas = await r.json();
      return (linhas && linhas[0] && linhas[0].dados) || null;
    } catch (e) { return null; }
  }

  // a foto retangular antiga do centro vira a versão recortada (PNG sem fundo)
  async function carregarFinal(C, CFG) {
    const H = await carregar(C, CFG);
    if (H && H.entrada && /0af69522-7693-482b-9cbf-76ce704eab22/.test(H.entrada.foto || '')) H.entrada.foto = 'img/gediel-centro.webp';
    if (!H) return H;
    // abertura salva ainda com "Qual modo você quer ligar hoje?": entra a promessa (supabase/funil-etapa-a.sql deixa isso gravado)
    const En = H.entrada || {};
    if (En.titulo === 'Qual modo você quer' && En.palavra === 'ligar') Object.assign(En, { rotulo: '11 anos de sala de aula · +700 alunos', titulo: 'Anos de inglês e você', palavra: 'ainda trava', tituloFim: '?', dica: 'Gire e escolha o seu universo. Os com cadeado abrem no Programa.' });
    // um nome só pro produto principal: "Programa Inteligente" (antes: Mentoria Inglês Inteligente, Método Inteligente — Programa em Grupo, Plano Inteligente)
    const NOME = 'Programa Inteligente', reNome = /Mentoria Inglês Inteligente|Método Inteligente\s*[—–-]\s*Programa em Grupo|Programa de Acompanhamento Inglês Inteligente|Plano Inteligente/g;
    const fix = s => typeof s === 'string' ? s.replace(reNome, NOME) : s;
    ['mentoria', 'destaque', 'topo', 'rodape', 'secoes', 'membros', 'aplicacao'].forEach(k => { const o = H[k]; if (o && typeof o === 'object') Object.keys(o).forEach(f => { o[f] = fix(o[f]); }); });
    (H.cards || []).forEach(c => { if (c && typeof c === 'object') ['titulo', 'linha', 'sinopse', 'meta'].forEach(f => { c[f] = fix(c[f]); }); });
    const S = H.secoes || {};
    if (/^Dentro d[ao] (mentoria|programa)$/i.test(S.membros || '')) S.membros = 'Dentro do Programa Inteligente';
    if (/^(Mentoria|Programa) →$/.test(S.botaoPagos || '')) S.botaoPagos = 'Ver planos →';
    if (S.extras === 'Ecossistema') S.extras = 'Outros projetos';
    if (S.alunos === 'Alunos que destravaram') S.alunos = 'Mais histórias de alunos';
    if (H.topo) H.topo.bio = String(H.topo.bio || '').replace(/a porta pr[ao] (mentoria|programa de acompanhamento)/i, 'a porta pro Programa Inteligente');
    if (H.mentoria && /^Aplicar pr/i.test(H.mentoria.botaoAplicar || '')) H.mentoria.botaoAplicar = 'Quero entrar no Programa';
    (H.modos || []).forEach(m => { if (m && typeof m === 'object' && !m.acesso) m.acesso = ACESSO_PADRAO[m.id] || 'programa'; });
    // páginas de produto: preenche o que falta a partir da descrição já existente (ver PRODUTO_PADRAO)
    (H.cards || []).forEach(c => {
      if (!c || c.tipo !== 'pago') return;
      const p = PRODUTO_PADRAO.find(x => x.re.test(c.titulo || '')); if (!p) return;
      if (!String(c.inclui || '').trim()) c.inclui = p.inclui.join('\n');
      if (!String(c.praQuem || '').trim()) c.praQuem = p.praQuem;
    });
    // planos: o nome "Inteligente" fica como chave; nos textos vira Programa Inteligente
    (H.planos || []).forEach(p => { if (!p || typeof p !== 'object') return; if (p.botao === 'Quero o Inteligente') p.botao = 'Quero entrar no Programa'; p.beneficios = String(p.beneficios || '').replace(/Tudo do Inteligente/g, 'Tudo do Programa Inteligente'); });
    if (S.planosAviso) S.planosAviso = S.planosAviso.replace(/a partir do Inteligente/g, 'a partir do Programa Inteligente');
    return H;
  }
  window.HUB_DADOS = { padrao, juntar, carregar: carregarFinal };
})();
