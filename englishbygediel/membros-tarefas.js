/* Tarefas do checklist: escolhidas pelo LUGAR (o que dá pra fazer ali), pelo TEMPO (1, 5, 10, 30, 60 min) e pelo NÍVEL.
   Regras que garantem coerência:
   · cada lugar tem "capacidades": tela (s), voz (v), fone de ouvido (e). Tarefa só entra se o lugar permite.
     s: 0 sem tela · 1 olhada rápida no celular · 2 tela à vontade
     v: 0 sem falar (só mental) · 1 baixinho · 2 em voz alta
     e: 0 sem fone · 1 pode ouvir
   · as frases, objetos e narrações vêm de um pacote DO LUGAR (nada de "pizza" no trabalho);
   · iniciante (poucas aulas) nunca recebe tarefa de produção livre: só copiar/repetir um modelo que a própria tarefa traz;
   · aula só entra com 30 min ou mais. */
(function () {
  var L = {
    'Em Casa':            { s: 2, v: 2, e: 1, nome: 'em casa', em: 'em casa' },
    'Acabei de acordar':  { s: 1, v: 1, e: 1, nome: 'ao acordar', em: 'pra acordar' },
    'Vou pro banho':      { s: 0, v: 2, e: 1, nome: 'no banho', em: 'no banho' },
    'Prestes a dormir':   { s: 1, v: 1, e: 1, nome: 'antes de dormir', em: 'antes de dormir (volume baixinho)' },
    'No carro':           { s: 0, v: 2, e: 1, nome: 'no carro', em: 'no carro' },
    'No Transporte':      { s: 2, v: 0, e: 1, nome: 'no transporte', em: 'no caminho' },
    'No Trabalho':        { s: 2, v: 0, e: 1, nome: 'no trabalho', em: 'enquanto trabalha (volume baixo)' },
    'Intervalo do almoço':{ s: 2, v: 1, e: 1, nome: 'no almoço', em: 'no almoço' },
    'Lavando a louça':    { s: 0, v: 2, e: 1, nome: 'lavando a louça', em: 'enquanto lava a louça' },
    'Limpando a casa':    { s: 0, v: 2, e: 1, nome: 'limpando a casa', em: 'na faxina' },
    'Cozinhando':         { s: 1, v: 2, e: 1, nome: 'cozinhando', em: 'enquanto cozinha' },
    'Caminhando':         { s: 0, v: 1, e: 1, nome: 'caminhando', em: 'na caminhada' },
    'Na Academia':        { s: 1, v: 0, e: 1, nome: 'na academia', em: 'no treino' },
    'Na fila':            { s: 2, v: 0, e: 1, nome: 'na fila', em: 'na espera' },
    'No sofá':            { s: 2, v: 2, e: 1, nome: 'no sofá', em: 'no sofá' },
    'Só 5 minutos':       { s: 2, v: 1, e: 1, nome: 'agora', em: '' },
    'Focado pra estudar': { s: 2, v: 2, e: 1, nome: 'estudando', em: '' },
    'Viajando':           { s: 2, v: 1, e: 1, nome: 'viajando', em: 'na viagem' },
    'No mercado':         { s: 1, v: 0, e: 1, nome: 'no mercado', em: 'enquanto faz compras' },
    'Na igreja':          { s: 1, v: 0, e: 0, nome: 'na igreja', em: '' },
    'Com a família':      { s: 1, v: 2, e: 0, nome: 'com a família', em: '' },
    'Primeiros passos':   { s: 2, v: 1, e: 1, nome: 'agora', em: '' }
  };

  /* f: frases úteis do lugar [inglês, português] · o: objetos do lugar · st: frases de story · nar: modelos pra narrar · ag: "agora" */
  var K = {
    'Em Casa': {
      f: [["I'm at home, relaxing.", 'Estou em casa, relaxando.'], ['Can you turn the TV on?', 'Pode ligar a TV?'], ["I'm going to make some coffee.", 'Vou fazer um café.'], ['Make yourself at home.', 'Fique à vontade.']],
      o: [['door', 'porta'], ['window', 'janela'], ['table', 'mesa'], ['chair', 'cadeira'], ['lamp', 'abajur'], ['couch', 'sofá']],
      st: ['Home sweet home.', 'Slow day, good vibes.', 'Coffee and calm.'], ag: "I'm at home.",
      cog: 'nas embalagens e etiquetas da sua casa'
    },
    'Acabei de acordar': {
      f: [['Good morning!', 'Bom dia!'], ["I'm still sleepy.", 'Ainda estou com sono.'], ['Today is going to be a good day.', 'Hoje vai ser um bom dia.'], ['I need coffee.', 'Preciso de café.']],
      o: [['bed', 'cama'], ['pillow', 'travesseiro'], ['blanket', 'cobertor'], ['alarm clock', 'despertador'], ['window', 'janela'], ['slippers', 'chinelos']],
      st: ['Good morning, world.', 'New day, new chance.', 'Coffee first.'], ag: "I'm waking up.", cog: 'no celular'
    },
    'Vou pro banho': {
      f: [['The water is warm.', 'A água está morna.'], ['I need a towel.', 'Preciso de uma toalha.'], ["Where's the shampoo?", 'Cadê o xampu?'], ["I'm going to take a shower.", 'Vou tomar banho.']],
      o: [['towel', 'toalha'], ['soap', 'sabonete'], ['shampoo', 'xampu'], ['water', 'água'], ['mirror', 'espelho'], ['toothbrush', 'escova de dentes']],
      st: ['Fresh start.'], nar: [["I'm washing my hair.", 'Estou lavando o cabelo.'], ["I'm using soap.", 'Estou usando sabonete.'], ['The water is hot.', 'A água está quente.']],
      ag: "I'm taking a shower.", cog: ''
    },
    'Prestes a dormir': {
      f: [['Good night!', 'Boa noite!'], ["I'm so tired.", 'Estou muito cansado(a).'], ['Sleep well.', 'Durma bem.'], ['See you tomorrow.', 'Até amanhã.']],
      o: [['bed', 'cama'], ['pillow', 'travesseiro'], ['blanket', 'cobertor'], ['light', 'luz'], ['phone', 'celular'], ['alarm', 'alarme']],
      st: ['Good night.', 'Grateful for today.', 'Rest well.'], ag: "I'm going to sleep.", cog: ''
    },
    'No carro': {
      f: [['Fasten your seatbelt.', 'Coloque o cinto.'], ['Turn left at the light.', 'Vire à esquerda no semáforo.'], ["We're almost there.", 'Estamos quase chegando.'], ["There's a lot of traffic.", 'Tem muito trânsito.']],
      o: [['steering wheel', 'volante'], ['seatbelt', 'cinto'], ['mirror', 'retrovisor'], ['road', 'estrada'], ['traffic light', 'semáforo'], ['gas', 'gasolina']],
      st: [], nar: [["I'm driving to work.", 'Estou dirigindo pro trabalho.'], ['The traffic is heavy.', 'O trânsito está pesado.'], ["I'm stopping at the red light.", 'Estou parando no sinal vermelho.']],
      ag: "I'm driving.", cog: ''
    },
    'No Transporte': {
      f: [['Excuse me, is this seat taken?', 'Com licença, este lugar está ocupado?'], ['Which stop is this?', 'Que parada é esta?'], ["I'm on my way.", 'Estou a caminho.'], ["I'm running late.", 'Estou atrasado(a).']],
      o: [['bus', 'ônibus'], ['seat', 'assento'], ['window', 'janela'], ['ticket', 'bilhete'], ['bag', 'bolsa/mochila'], ['stop', 'parada']],
      st: ['On my way.', 'Commute playlist on.'], ag: "I'm on the bus.", cog: 'nas placas e avisos do caminho'
    },
    'No Trabalho': {
      f: [["I'll send you the file.", 'Eu te envio o arquivo.'], ["Let's schedule a meeting.", 'Vamos marcar uma reunião.'], ['Could you help me with this?', 'Pode me ajudar com isto?'], ["I'll get back to you soon.", 'Retorno em breve.']],
      o: [['desk', 'mesa de trabalho'], ['computer', 'computador'], ['phone', 'telefone'], ['chair', 'cadeira'], ['coffee', 'café'], ['notebook', 'caderno']],
      st: ['Work mode: on.', 'Coffee and deadlines.'], ag: "I'm at work.", cog: 'na tela do computador e nos e-mails'
    },
    'Intervalo do almoço': {
      f: [["What's for lunch?", 'O que tem pro almoço?'], ['Can I have the check, please?', 'Pode trazer a conta, por favor?'], ['This is delicious.', 'Está delicioso.'], ["I'm starving.", 'Estou morrendo de fome.']],
      o: [['plate', 'prato'], ['fork', 'garfo'], ['knife', 'faca'], ['glass', 'copo'], ['napkin', 'guardanapo'], ['menu', 'cardápio']],
      st: ['Lunch break.', 'Good food, good mood.'], ag: "I'm having lunch.", cog: 'no cardápio e nas embalagens'
    },
    'Lavando a louça': {
      f: [["I'm washing the dishes.", 'Estou lavando a louça.'], ['Pass me the plate, please.', 'Me passe o prato, por favor.'], ['The sink is full.', 'A pia está cheia.'], ["I'm almost done.", 'Estou quase terminando.']],
      o: [['plate', 'prato'], ['glass', 'copo'], ['fork', 'garfo'], ['sponge', 'esponja'], ['sink', 'pia'], ['soap', 'detergente/sabão']],
      st: [], nar: [["I'm washing the plates.", 'Estou lavando os pratos.'], ["I'm washing the glasses.", 'Estou lavando os copos.'], ['The sink is clean.', 'A pia está limpa.']],
      ag: "I'm washing the dishes.", cog: ''
    },
    'Limpando a casa': {
      f: [["I'm cleaning the house.", 'Estou limpando a casa.'], ["Where's the broom?", 'Cadê a vassoura?'], ['The floor is dirty.', 'O chão está sujo.'], ["Let's tidy up.", 'Vamos arrumar.']],
      o: [['broom', 'vassoura'], ['bucket', 'balde'], ['floor', 'chão'], ['window', 'janela'], ['trash', 'lixo'], ['towel', 'pano/toalha']],
      st: [], nar: [["I'm sweeping the floor.", 'Estou varrendo o chão.'], ["I'm cleaning the table.", 'Estou limpando a mesa.'], ['The room is clean.', 'O quarto está limpo.']],
      ag: "I'm cleaning the house.", cog: ''
    },
    'Cozinhando': {
      f: [["I'm cooking dinner.", 'Estou fazendo o jantar.'], ['Add a pinch of salt.', 'Coloque uma pitada de sal.'], ['Cut the onions.', 'Corte as cebolas.'], ['It smells good!', 'Que cheiro bom!']],
      o: [['pan', 'panela/frigideira'], ['knife', 'faca'], ['plate', 'prato'], ['spoon', 'colher'], ['salt', 'sal'], ['oven', 'forno']],
      st: ['Cooking time.', 'Made with love.'], nar: [["I'm cutting the onions.", 'Estou cortando as cebolas.'], ["I'm adding salt.", 'Estou colocando sal.'], ['The food smells good.', 'A comida está cheirosa.']],
      ag: "I'm cooking.", cog: 'nas embalagens dos ingredientes'
    },
    'Caminhando': {
      f: [["I'm going for a walk.", 'Vou dar uma caminhada.'], ["It's a beautiful day.", 'Está um lindo dia.'], ["Let's walk faster.", 'Vamos andar mais rápido.'], ['I need some fresh air.', 'Preciso de ar fresco.']],
      o: [['tree', 'árvore'], ['street', 'rua'], ['dog', 'cachorro'], ['car', 'carro'], ['sun', 'sol'], ['bench', 'banco']],
      st: [], nar: [["I'm walking in the park.", 'Estou caminhando no parque.'], ['I see a tree.', 'Vejo uma árvore.'], ['The sun is out.', 'O sol está aparecendo.']],
      ag: "I'm walking.", cog: ''
    },
    'Na Academia': {
      f: [['One more set.', 'Mais uma série.'], ['I need a break.', 'Preciso de uma pausa.'], ["Let's go! You can do it!", 'Vamos! Você consegue!'], ['Great workout!', 'Ótimo treino!']],
      o: [['weights', 'pesos'], ['bench', 'banco'], ['mirror', 'espelho'], ['towel', 'toalha'], ['water bottle', 'garrafa de água'], ['treadmill', 'esteira']],
      st: ['Leg day.', 'No excuses.', 'Workout done.'], ag: "I'm at the gym.", cog: ''
    },
    'Na fila': {
      f: [['How long is the wait?', 'Quanto tempo vai demorar?'], ['Is this the line for the cashier?', 'Esta é a fila do caixa?'], ["I've been waiting for ten minutes.", 'Estou esperando há dez minutos.'], ["It's my turn.", 'É a minha vez.']],
      o: [['line', 'fila'], ['cashier', 'caixa'], ['ticket', 'senha/bilhete'], ['phone', 'celular'], ['bag', 'bolsa'], ['clock', 'relógio']],
      st: ['Waiting game.', 'Patience level: 100.'], ag: "I'm waiting in line.", cog: 'nas placas e cartazes à sua volta'
    },
    'No sofá': {
      f: [['What are we watching?', 'O que vamos assistir?'], ['Pass me the remote.', 'Me passe o controle.'], ["Let's watch one more episode.", 'Vamos ver mais um episódio.'], ['This show is so good!', 'Esta série é muito boa!']],
      o: [['couch', 'sofá'], ['remote', 'controle remoto'], ['blanket', 'cobertor'], ['pillow', 'almofada'], ['TV', 'TV'], ['snack', 'lanche']],
      st: ['Lazy day.', 'Series time.'], ag: "I'm on the couch.", cog: 'nas legendas e nos títulos'
    },
    'Só 5 minutos': {
      f: [['Practice makes progress.', 'Praticar traz progresso.'], ['One step at a time.', 'Um passo de cada vez.'], ['I can do this.', 'Eu consigo.'], ['A little every day.', 'Um pouquinho todo dia.']],
      o: [['book', 'livro'], ['phone', 'celular'], ['water', 'água'], ['coffee', 'café'], ['table', 'mesa'], ['clock', 'relógio']],
      st: ['A little every day.', 'One step at a time.'], ag: "I'm learning English.", cog: 'no que estiver perto de você'
    },
    'Focado pra estudar': {
      f: [["I'm studying English today.", 'Hoje estou estudando inglês.'], ["Let's practice!", 'Vamos praticar!'], ['Can you repeat that, please?', 'Pode repetir, por favor?'], ["I'm learning a lot.", 'Estou aprendendo muito.']],
      o: [['notebook', 'caderno'], ['pen', 'caneta'], ['desk', 'mesa'], ['lamp', 'luminária'], ['laptop', 'notebook'], ['headphones', 'fones']],
      st: ['Study mode: on.', 'Learning English, one day at a time.'], ag: "I'm studying English.", cog: 'nos materiais da sua mesa'
    },
    'Viajando': {
      f: [['Where is the gate?', 'Onde é o portão de embarque?'], ["I'd like a window seat.", 'Eu gostaria de um assento na janela.'], ['How much is this?', 'Quanto custa isto?'], ['Can you help me, please?', 'Pode me ajudar, por favor?']],
      o: [['suitcase', 'mala'], ['passport', 'passaporte'], ['ticket', 'passagem'], ['plane', 'avião'], ['gate', 'portão de embarque'], ['hotel', 'hotel']],
      st: ['Next stop: adventure.', 'Travel mode: on.'], ag: "I'm traveling.", cog: 'nas placas, mapas e avisos da viagem'
    },
    'No mercado': {
      f: [['Where can I find the milk?', 'Onde acho o leite?'], ['How much is this?', 'Quanto custa isto?'], ["I'll take this one.", 'Vou levar este.'], ['Can I pay by card?', 'Posso pagar no cartão?']],
      o: [['apple', 'maçã'], ['bread', 'pão'], ['milk', 'leite'], ['rice', 'arroz'], ['eggs', 'ovos'], ['cheese', 'queijo']],
      st: ['Grocery run.'], ag: "I'm at the supermarket.", cog: 'nas embalagens e rótulos'
    },
    'Na igreja': {
      f: [['Thank you, Lord.', 'Obrigado, Senhor.'], ['God is good.', 'Deus é bom.'], ['Praise the Lord!', 'Louvado seja o Senhor!'], ['Let us pray.', 'Vamos orar.']],
      o: [['Bible', 'Bíblia'], ['song', 'canção'], ['prayer', 'oração'], ['pastor', 'pastor'], ['church', 'igreja'], ['worship', 'adoração']],
      st: ['Grateful.', 'God is good, all the time.'], ag: "I'm at church.", cog: 'no celular'
    },
    'Com a família': {
      f: [['I love you.', 'Eu te amo.'], ['Dinner is ready!', 'O jantar está pronto!'], ['Come here, please.', 'Venha aqui, por favor.'], ["Let's play together.", 'Vamos brincar juntos.']],
      o: [['mother', 'mãe'], ['father', 'pai'], ['brother', 'irmão'], ['sister', 'irmã'], ['house', 'casa'], ['dinner', 'jantar']],
      st: ['Family time.', 'Family is everything.'], ag: "I'm with my family.", cog: 'no celular'
    },
    'Primeiros passos': {
      f: [['Hello! How are you?', 'Olá! Como vai você?'], ["I'm fine, thank you.", 'Estou bem, obrigado(a).'], ['Nice to meet you.', 'Prazer em conhecer.'], ['See you tomorrow.', 'Até amanhã.']],
      o: [['apple', 'maçã'], ['book', 'livro'], ['house', 'casa'], ['water', 'água'], ['phone', 'celular'], ['car', 'carro']],
      st: ['Learning English.', 'Day one.'], ag: "I'm learning English.", cog: 'em qualquer embalagem ou legenda'
    }
  };

  var VERSOS = [
    ['Psalm 23:1', 'The Lord is my shepherd, I lack nothing.', 'O Senhor é o meu pastor; nada me faltará.', 'PSA.23.1'],
    ['Philippians 4:13', 'I can do all this through him who gives me strength.', 'Tudo posso naquele que me fortalece.', 'PHP.4.13'],
    ['Psalm 118:24', 'This is the day the Lord has made; let us rejoice and be glad in it.', 'Este é o dia que o Senhor fez; vamos nos alegrar nele.', 'PSA.118.24'],
    ['Proverbs 3:5', 'Trust in the Lord with all your heart.', 'Confie no Senhor de todo o seu coração.', 'PRO.3.5'],
    ['Joshua 1:9', 'Be strong and courageous.', 'Seja forte e corajoso.', 'JOS.1.9'],
    ['1 Thessalonians 5:16-17', 'Rejoice always, pray continually.', 'Alegrem-se sempre, orem continuamente.', '1TH.5.16'],
    ['Psalm 46:1', 'God is our refuge and strength, an ever-present help in trouble.', 'Deus é o nosso refúgio e a nossa força, auxílio sempre presente na adversidade.', 'PSA.46.1']
  ];


  /* o que faz mais sentido em cada lugar (nessa ordem de prioridade) */
  var PREF = {
    'Em Casa': ['frases4', 'jogoFlash', 'serie', 'diario', 'comentar', 'versiculo', 'jogoImagem'],
    'Acabei de acordar': ['frase1', 'versiculo', 'orar', 'musica', 'diario', 'frases3'],
    'Vou pro banho': ['cantar', 'narrar', 'frase1', 'frases4', 'musica', 'podcast5'],
    'Prestes a dormir': ['orar', 'versiculo', 'diario', 'frase1', 'frases3'],
    'No carro': ['pod', 'cantar', 'narrar', 'frases4', 'shadow', 'frase1'],
    'No Transporte': ['jogoOuvir', 'pod', 'musica', 'cognatos', 'frases3', 'comentar', 'video4', 'podcast15'],
    'No Trabalho': ['frases3', 'jogoFlash', 'emailTrab', 'objetos6', 'nomear', 'story'],
    'Intervalo do almoço': ['video4', 'noticia', 'jogoImagem', 'frases3', 'grupo', 'story'],
    'Lavando a louça': ['narrar', 'cantar', 'pod', 'frases4', 'musica'],
    'Limpando a casa': ['narrar', 'cantar', 'pod', 'frases4', 'musica'],
    'Cozinhando': ['narrar', 'frases4', 'story', 'cantar', 'pod', 'musica'],
    'Caminhando': ['pod', 'musica', 'narrar', 'shadow', 'frases4', 'frase1'],
    'Na Academia': ['musica', 'pod', 'shadow', 'frases3', 'story', 'nomear'],
    'Na fila': ['jogoOuvir', 'jogoFlash', 'video4', 'cognatos', 'noticia', 'frases3', 'grupo'],
    'No sofá': ['serie', 'video4', 'jogoImagem', 'jogoFlash', 'cantar', 'grupo', 'perguntaFam'],
    'Só 5 minutos': ['jogoImagem', 'jogoFlash', 'frase1', 'grupo', 'comentar', 'musica', 'jogoOuvir'],
    'Focado pra estudar': ['jogoComplete', 'jogoMonta', 'diario5', 'jogoFlash', 'serie', 'comentar', 'diario', 'podcast5'],
    'Viajando': ['frases3', 'cognatos', 'story', 'pod', 'video4', 'musica'],
    'No mercado': ['frases3', 'cognatos', 'objetos6', 'nomear', 'story', 'musica'],
    'Na igreja': ['orar', 'versiculo', 'frase1', 'grupo', 'storyFam'],
    'Com a família': ['ensinar', 'perguntaFam', 'cantar', 'frases4', 'storyFam', 'nomear'],
    'Primeiros passos': ['jogoImagem', 'jogoOuvir', 'cognatos', 'musica', 'nomear', 'frase1']
  };
  function hash(x) { var h = 0; x = String(x); for (var i = 0; i < x.length; i++) h = (h * 31 + x.charCodeAt(i)) | 0; return Math.abs(h); }
  function voz(v) { return v >= 2 ? 'em voz alta' : v === 1 ? 'baixinho' : 'mentalmente'; }
  function pick(a, n) { return a[n % a.length]; }
  function spk(P) { return P.v >= 2 ? 'Diga em voz alta' : P.v === 1 ? 'Diga baixinho' : 'Repita só na cabeça'; }
  function saud(h) {
    if (h < 12) return ['Good morning, everyone! Have a great day!', 'Bom dia, pessoal! Tenham um ótimo dia!'];
    if (h < 18) return ['Good afternoon, everyone! Have a great afternoon!', 'Boa tarde, pessoal! Tenham uma ótima tarde!'];
    if (h < 21) return ['Good evening, everyone! Have a great night!', 'Boa noite, pessoal! Tenham uma ótima noite!'];
    return ['Good night, everyone! Sleep well!', 'Boa noite, pessoal! Durmam bem!'];
  }
  var YT = function (q) { return 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q); };
  var BBC = 'https://www.bbc.co.uk/learningenglish/english/features/6-minute-english';

  /* ---------- catálogo ---------- */
  /* need: s/v/e mínimos do lugar · prod: pede produção livre (só pra quem já viu aulas) · at: lugares onde a tarefa faz mais sentido ·
     only: só nesses lugares · not: nunca nesses · ini: bônus pra quem está começando · aulas: mínimo de aulas vistas */
  var T = [
    /* ===== 30 segundos / 1 minuto ===== */
    { id: 'frase1', kind: 'frase', mn: .5, need: {},
      b: function (c) { var f = pick(c.K.f, c.d), P = c.P;
        return { icon: '💬', title: 'Frase pra usar agora: "' + f[0] + '"', sub: f[1] + ' · ' + spk(P).toLowerCase() + ' 2 vezes',
          info: { why: 'Uma frase pronta, do jeito que você realmente fala ' + P.nome + ', vale mais que dez palavras soltas.', steps: ['Leia: ' + f[0], 'Significa: ' + f[1], spk(P) + ' 2 vezes, sem pressa', 'Pense: em que momento de hoje eu diria isso?'] } }; } },
    { id: 'ouvir30', kind: 'ouvir', mn: .5, need: { e: 1 }, not: ['No Trabalho'],
      b: function (c) { return { icon: '👂', title: 'Ouvir 30 segundos de uma música em inglês', sub: 'Qualquer uma. Só ouvir.',
        info: { why: 'Ouvir inglês é treino, mesmo por meio minuto. O ouvido vai se acostumando com o som.', steps: ['Abra qualquer música em inglês', 'Ouça 30 segundos', 'Repare em 1 palavra que você reconheceu'] } }; } },
    { id: 'nomear', kind: 'objetos', mn: 1, need: {}, ini: 2, not: ['No carro'],
      b: function (c) { var o = c.K.o.slice(c.d % 3, c.d % 3 + 3); if (o.length < 3) o = c.K.o.slice(0, 3);
        return { icon: '👀', title: 'Achar 3 coisas aqui e dizer o nome em inglês', sub: o.map(function (x) { return x[0]; }).join(' · '),
          info: { why: 'Olhar o lugar onde você está e nomear as coisas em inglês é o jeito mais direto de tirar o inglês do papel.',
            steps: ['Olhe em volta ' + c.P.nome, o.map(function (x) { return x[0] + ' (' + x[1] + ')'; }).join(' · '), spk(c.P) + ' cada palavra, apontando pra coisa'] } }; } },
    { id: 'grupo', kind: 'social', mn: 1, need: { s: 1 }, not: ['Prestes a dormir'], at: ['No Trabalho', 'Intervalo do almoço', 'No Transporte', 'Na fila', 'Em Casa', 'No sofá', 'Só 5 minutos', 'Na igreja'],
      b: function (c) { var g = c.ig ? ['Have a blessed day, everyone!', 'Tenham um dia abençoado, pessoal!'] : saud(c.hora);
        return { icon: '💌', title: 'Mandar um recado em inglês no grupo: "' + g[0] + '"', sub: g[1],
          info: { why: 'Usar o inglês com gente de verdade é o que faz ele sair da cabeça. E um recado simples já conta.', steps: ['Abra o grupo de inglês no WhatsApp (ou qualquer conversa)', 'Copie e envie: "' + g[0] + '"', 'Significa: ' + g[1]] } }; } },
    { id: 'story', kind: 'social', mn: 1, need: { s: 1 }, not: ['Prestes a dormir', 'Acabei de acordar', 'Com a família'], at: ['Cozinhando', 'Na Academia', 'Viajando', 'No mercado', 'No Transporte', 'Intervalo do almoço', 'No Trabalho'],
      b: function (c) { var s = pick(c.K.st.length ? c.K.st : ['Learning English, one day at a time.'], c.d);
        return { icon: '📸', title: 'Postar um story com uma frase em inglês', sub: 'Ex.: "' + s + '"',
          info: { why: 'Escrever em inglês onde as pessoas veem faz você tratar a língua como sua. Uma frase curta basta.', steps: ['Tire uma foto do que está à sua frente', 'Escreva no story: "' + s + '"', 'Publique (se não quiser publicar, salve nos rascunhos)'] } }; } },
    { id: 'storyFam', kind: 'social', mn: 1, need: { s: 1 }, only: ['Com a família', 'Na igreja'],
      b: function (c) { var s = pick(c.K.st, c.d);
        return { icon: '📸', title: 'Postar um story com uma frase em inglês', sub: 'Ex.: "' + s + '"',
          info: { why: 'Escrever em inglês onde as pessoas veem faz você tratar a língua como sua.', steps: ['Escolha uma foto', 'Escreva a frase: "' + s + '"', 'Publique (ou salve nos rascunhos)'] } }; } },
    { id: 'comentar', kind: 'social', mn: 2, need: { s: 2 }, not: ['No Trabalho'], at: ['Em Casa', 'No sofá', 'Focado pra estudar', 'Só 5 minutos', 'Intervalo do almoço', 'No Transporte', 'Na fila', 'Viajando'],
      b: function (c) { return { icon: '💬', title: 'Comentar em inglês num vídeo ou aula da plataforma', sub: 'O que você mais gostou, em 1 frase',
        info: { why: 'Escrever um comentário de verdade, pra uma pessoa real, é produção de inglês com propósito. Uma frase já vale.',
          steps: ['Abra uma aula ou um vídeo da playlist', 'Escolha o momento que você mais gostou', 'Comente em inglês. Modelo: "I really liked this part. Thank you!"', 'Quer mais? "I liked this because…" e complete'],
          links: [{ t: '📚 Abrir as aulas', u: '#modulos' }] } }; } },
    { id: 'perguntaFam', kind: 'social', mn: 1, need: { v: 1 }, only: ['Com a família', 'Em Casa', 'No sofá'],
      b: function (c) { return { icon: '🗣️', title: 'Perguntar em inglês pra alguém de casa: "How was your day?"', sub: 'Como foi o seu dia?',
        info: { why: 'Uma pergunta pronta, feita pra uma pessoa real, treina conversa de verdade.', steps: ['Chame alguém da casa', 'Pergunte: "How was your day?"', 'A pessoa pode responder em português, vale! Se responder "Good", você já ganhou o dia'] } }; } },
    { id: 'frase1esc', kind: 'escrever', mn: 1, need: { s: 1 }, not: ['Prestes a dormir'],
      b: function (c) { var a = c.K.ag;
        return { icon: '✍️', title: 'Escrever no bloco de notas: "' + a + '"', sub: 'Copie e troque a parte final pra sua realidade',
          info: { why: 'Escrever uma frase sobre o seu momento transforma o inglês em algo seu.', steps: ['Abra o bloco de notas do celular', 'Copie: "' + a + '"', 'Quer variar? Troque o final. Ex.: "I\'m at home." / "I\'m tired."'] } }; } },
    { id: 'orar', fe: true, kind: 'fe', mn: 1, need: {}, only: ['Na igreja', 'Prestes a dormir', 'Acabei de acordar'],
      b: function (c) { var m = c.hora < 12 ? ['Thank you, Lord, for this new day.', 'Obrigado, Senhor, por este novo dia.'] : ['Thank you, Lord, for this day.', 'Obrigado, Senhor, por este dia.'];
        return { icon: '🙏', title: 'Orar em inglês: "' + m[0] + '"', sub: m[1],
          info: { why: 'Orar é falar de coração. Uma frase simples em inglês já aproxima você da língua e da sua fé.', steps: ['Feche os olhos um instante', 'Diga (' + voz(c.P.v) + '): "' + m[0] + '"', 'Significa: ' + m[1], 'Termine com "Amen."'] } }; } },

    /* ===== 2 a 4 minutos ===== */
    { id: 'frases3', fam: 'frases', kind: 'frase', mn: 2, need: {}, at: ['No Trabalho', 'Intervalo do almoço', 'Viajando', 'No mercado', 'No Transporte', 'Na fila', 'Na Academia'],
      b: function (c) { var f = [0, 1, 2].map(function (i) { return c.K.f[(c.d + i) % 4]; });
        return { icon: '💬', title: '3 frases úteis ' + c.P.nome, sub: f[0][0] + ' · ' + f[1][0] + ' · ' + f[2][0],
          info: { why: 'São frases do dia a dia desse momento. Treine as três e você já sabe dizer o essencial.',
            steps: f.map(function (x) { return x[0] + ' = ' + x[1]; }).concat([spk(c.P) + ' cada uma 2 vezes', 'Escolha a que mais combina com você e guarde']) } }; } },
    { id: 'frases4', fam: 'frases', kind: 'frase', mn: 4, need: {}, at: ['Em Casa', 'Focado pra estudar', 'Cozinhando', 'Com a família', 'Limpando a casa', 'Lavando a louça', 'Caminhando', 'No carro'],
      b: function (c) { var f = c.K.f;
        return { icon: '💬', title: '4 frases úteis ' + c.P.nome + ': ouvir e repetir', sub: f[0][0] + ' · ' + f[1][0] + ' · …',
          info: { why: 'Repetir frases inteiras, em voz própria, treina ritmo e pronúncia ao mesmo tempo.',
            steps: f.map(function (x) { return x[0] + ' = ' + x[1]; }).concat([spk(c.P) + ' cada uma 3 vezes', 'Na última rodada, tente sem olhar']) } }; } },
    { id: 'musica', kind: 'ouvir', mn: 3, need: { e: 1 }, ini: 1,
      b: function (c) { var em = c.P.em ? ' ' + c.P.em : '';
        return { icon: '🎵', title: 'Ouvir 1 música em inglês' + em, sub: 'Uma música inteira, só o ouvido',
          info: { why: 'Música repete as mesmas palavras várias vezes. É o jeito mais leve de reconhecer padrões do inglês.',
            steps: ['Escolha 1 música em inglês' + (c.P.s ? ' (ou use a playlist do English on Mission)' : ''), 'Ouça sem se preocupar em entender tudo', 'Quando ouvir uma palavra que você conhece, repare nela', 'No fim, diga qual palavra reconheceu'],
            links: c.P.s ? [{ t: '🟢 Playlist do English on Mission', u: 'https://open.spotify.com/playlist/3hcF84KR80VqykVNeJy4x5' }] : [],
            ex: ['Palavras comuns que costumam aparecer: <b>love</b> (amor), <b>you</b> (você), <b>heart</b> (coração)'] } }; } },
    { id: 'cantar', kind: 'cantar', mn: 3, need: { v: 2, e: 1 }, at: ['Vou pro banho', 'No carro', 'Lavando a louça', 'Limpando a casa', 'Cozinhando', 'No sofá'],
      b: function (c) { return { icon: '🎤', title: 'Cantar o refrão de 1 música em inglês', sub: 'Pode errar a letra, o que vale é o som',
        info: { why: 'Cantar junto treina ritmo e pronúncia sem você perceber que está estudando.', steps: ['Coloque uma música em inglês que você goste', 'Espere o refrão', 'Cante junto, em voz alta, imitando o som', 'Repita o refrão 2 vezes'] } }; } },
    { id: 'narrar', kind: 'falar', mn: 3, need: { v: 1 }, only: ['Vou pro banho', 'Lavando a louça', 'Limpando a casa', 'Cozinhando', 'Caminhando', 'No carro'],
      b: function (c) { var n = c.K.nar || [];
        return { icon: '🗣️', title: 'Narrar o que você está fazendo, em inglês', sub: n[0] ? n[0][0] + '  (' + n[0][1] + ')' : '',
          info: { why: 'Falar sozinho é o treino mais barato que existe: ninguém corrige, ninguém escuta, e sua boca vai se acostumando com o inglês.',
            steps: n.map(function (x) { return x[0] + ' = ' + x[1]; }).concat([spk(c.P) + ' cada frase, enquanto faz a ação', 'Repita as três 2 vezes']) } }; } },
    { id: 'jogoImagem', kind: 'jogo', mn: 3, need: { s: 2 }, ini: 3, at: ['No sofá', 'Em Casa', 'Na fila', 'No Transporte', 'Só 5 minutos', 'Intervalo do almoço', 'Viajando'], not: ['No Trabalho'],
      b: function (c) { return { icon: '🖼️', title: 'Jogo: O que é isso?', sub: 'Figura + palavra em inglês',
        info: { why: 'O jeito mais rápido de aprender as primeiras palavras: ligar a imagem direto ao inglês, sem passar pelo português.', steps: ['Toque em "Jogar agora"', 'Olhe a figura e escolha o nome em inglês', 'Ouça a pronúncia e repita', 'Terminou? Pode marcar a tarefa'], links: [{ t: '🎮 Jogar agora', u: '#jogo:O que é isso?' }] } }; } },
    { id: 'jogoOuvir', kind: 'jogo', mn: 3, need: { s: 2, e: 1 }, ini: 3, at: ['No sofá', 'Em Casa', 'Na fila', 'No Transporte', 'Só 5 minutos', 'Intervalo do almoço', 'Viajando'], not: ['No Trabalho'],
      b: function (c) { return { icon: '🔊', title: 'Jogo: Ouça e Toque', sub: 'Ouvir a palavra e achar a figura',
        info: { why: 'Antes de falar, o ouvido precisa reconhecer o som. Aqui você treina isso sem precisar ler nada.', steps: ['Toque em "Jogar agora" (som ligado)', 'Ouça a palavra e toque na figura certa', 'Pode ouvir de novo quantas vezes quiser'], links: [{ t: '🎮 Jogar agora', u: '#jogo:Ouça e Toque' }] } }; } },
    { id: 'jogoFlash', kind: 'jogo', mn: 3, need: { s: 2 }, aulas: 3, at: ['No sofá', 'Em Casa', 'Na fila', 'No Transporte', 'Só 5 minutos', 'Intervalo do almoço', 'No Trabalho', 'Focado pra estudar'],
      b: function (c) { return { icon: '🃏', title: 'Jogo: Flashcards', sub: 'Palavras e frases com exemplo',
        info: { why: 'Cartinhas curtas fixam vocabulário sem pesar. Revisar pouco e sempre vale mais que muito de vez em quando.', steps: ['Toque em "Jogar agora"', 'Leia, ouça e vire o card', 'Diga a frase de exemplo ' + voz(c.P.v)], links: [{ t: '🎮 Jogar agora', u: '#jogo:Flashcards' }] } }; } },
    { id: 'jogoComplete', kind: 'jogo', mn: 3, need: { s: 2 }, aulas: 3, at: ['No sofá', 'Em Casa', 'Na fila', 'Focado pra estudar', 'Só 5 minutos'],
      b: function (c) { return { icon: '🧩', title: 'Jogo: Complete', sub: 'Frases curtinhas pra completar',
        info: { why: 'Completar frases treina a gramática sem decorar regra.', steps: ['Toque em "Jogar agora"', 'Escolha a palavra que completa a frase', 'Terminou? Pode marcar a tarefa'], links: [{ t: '🎮 Jogar agora', u: '#jogo:Complete' }] } }; } },
    { id: 'jogoMonta', kind: 'jogo', mn: 3, need: { s: 2 }, aulas: 3, at: ['No sofá', 'Em Casa', 'Focado pra estudar'],
      b: function (c) { return { icon: '🔤', title: 'Jogo: Monta Frase', sub: 'Coloque as palavras na ordem',
        info: { why: 'Montar frases curtas treina a ordem do inglês sem escrever nada.', steps: ['Toque em "Jogar agora"', 'Toque nas palavras na ordem certa'], links: [{ t: '🎮 Jogar agora', u: '#jogo:Monta Frase' }] } }; } },
    { id: 'cognatos', kind: 'ler', mn: 3, need: { s: 1 }, ini: 2, not: ['Prestes a dormir', 'Na igreja'],
      b: function (c) { var onde = c.K.cog ? c.K.cog : 'em qualquer texto em inglês';
        return { icon: '🔎', title: 'Caçar 5 palavras que parecem português', sub: 'Procure ' + onde,
          info: { why: 'Você já sabe centenas de palavras em inglês e não sabe que sabe. Reconhecer as parecidas com o português dá confiança.',
            steps: ['Procure ' + onde + ' (ou em qualquer texto em inglês)', 'Ache 5 palavras que parecem português', 'Diga cada uma do jeito inglês', 'Bônus: repare no padrão -tion = -ção (nation, information)'], ex: ['hospital, chocolate, music, important, family'] } }; } },
    { id: 'versiculo', fe: true, kind: 'versiculo', mn: 2, need: { s: 1 }, only: ['Na igreja', 'Acabei de acordar', 'Prestes a dormir', 'Em Casa'],
      b: function (c) { var v = pick(VERSOS, c.d);
        return { icon: '📖', title: 'Ler 1 versículo em inglês: ' + v[0], sub: '"' + v[1] + '"',
          info: { why: 'Você já conhece o sentido do versículo, então o inglês fica fácil de entender e de lembrar.', steps: ['Leia: "' + v[1] + '"', 'Significa: ' + v[2], 'Repita (' + voz(c.P.v) + ') duas vezes', 'Guarde uma palavra nova'],
            links: [{ t: '📖 Abrir no YouVersion (NIV)', u: 'https://www.bible.com/bible/111/' + v[3] + '.NIV' }] } }; } },
    { id: 'diario', kind: 'escrever', mn: 4, need: { s: 1 }, prod: true, at: ['Prestes a dormir', 'Em Casa', 'Acabei de acordar', 'No sofá', 'Focado pra estudar'],
      b: function (c) { var am = c.place === 'Acabei de acordar' || (c.place !== 'Prestes a dormir' && c.hora < 12); var m = am ? ['Today I will…', 'I want to…', 'I feel…'] : ['Today I…', 'I felt…', 'Tomorrow I will…'];
        return { icon: '✍️', title: am ? 'Escrever 3 planos pro seu dia em inglês' : 'Escrever 3 frases sobre o seu dia', sub: 'Comece com: ' + m.join(' · '),
          info: { why: 'Escrever sobre a sua vida é o jeito de fazer o inglês ficar seu. Frases simples já bastam.', steps: ['Abra o bloco de notas', 'Escreva 3 frases começando assim: ' + m.join(' / '), 'Releia em voz ' + (c.P.v ? voz(c.P.v) : 'baixa'), 'Não precisa ser perfeito, precisa ser seu'] } }; } },
    { id: 'objetos6', kind: 'objetos', mn: 2, need: {}, not: ['No carro'],
      b: function (c) { var o = c.K.o;
        return { icon: '👀', title: 'Aprender 6 palavras que você vê ' + c.P.nome, sub: o.slice(0, 3).map(function (x) { return x[0]; }).join(' · ') + ' …',
          info: { why: 'Seis palavras do lugar onde você está ficam fáceis de lembrar porque você vê as coisas na hora.', steps: o.map(function (x) { return x[0] + ' = ' + x[1]; }).concat([spk(c.P) + ' cada uma olhando pra coisa', 'Feche os olhos e tente lembrar 3']) } }; } },

    /* ===== 5 a 12 minutos ===== */
    { id: 'shadow', kind: 'falar', mn: 4, need: { e: 1 }, not: ['No Trabalho', 'Na igreja'],
      b: function (c) { var P = c.P; return { icon: '🗣️', title: 'Shadowing: repetir o que você ouve', sub: 'Pegue 1 trecho curto e imite o ritmo',
        info: { why: 'Imitar o falante (ritmo, pausas, entonação) treina boca e ouvido ao mesmo tempo.', steps: ['Coloque um áudio simples em inglês (música ou podcast)', 'Ouça uma frase curta', P.v >= 2 ? 'Repita em voz alta, no mesmo ritmo' : P.v === 1 ? 'Repita baixinho, no mesmo ritmo' : 'Repita só na cabeça, no mesmo ritmo', 'Faça isso por 4 minutos'] } }; } },
    { id: 'pod', fam: 'pod', kind: 'ouvir', mn: 5, need: { e: 1 }, not: ['No Trabalho', 'Prestes a dormir', 'No carro'],
      b: function (c) { return podcast(c, 5); } },
    { id: 'podcast5c', fam: 'pod', kind: 'ouvir', mn: 5, need: { e: 1 }, only: ['No carro'],
      b: function (c) { return podcast(c, 5); } },
    { id: 'podcast10', fam: 'pod', kind: 'ouvir', mn: 10, need: { e: 1 }, not: ['No Trabalho', 'Prestes a dormir', 'Vou pro banho'],
      b: function (c) { return podcast(c, 10); } },
    { id: 'podcast15', adv: true, fam: 'pod', kind: 'ouvir', mn: 15, need: { e: 1 }, not: ['No Trabalho', 'Prestes a dormir', 'Vou pro banho'], at: ['No carro', 'Caminhando', 'Na Academia', 'No Transporte', 'Viajando'],
      b: function (c) { return podcast(c, 15); } },
    { id: 'noticia', kind: 'ler', mn: 5, need: { s: 2 }, prod: true, at: ['Intervalo do almoço', 'No Transporte', 'Na fila', 'Em Casa'],
      b: function (c) { return { icon: '📰', title: 'Ler 1 notícia curta em inglês', sub: 'Em um site feito pra quem aprende',
        info: { why: 'Ler algo real, no seu nível, mostra que você já entende mais do que imagina.', steps: ['Abra o site abaixo e escolha o nível 1 ou 2', 'Leia uma notícia curta', 'Sublinhe (ou anote) 3 palavras novas', 'Ouça o áudio da notícia, se tiver'], links: [{ t: '📰 News in Levels', u: 'https://www.newsinlevels.com/' }] } }; } },
    { id: 'emailTrab', kind: 'escrever', mn: 5, need: { s: 2 }, prod: true, only: ['No Trabalho'],
      b: function (c) { return { icon: '✉️', title: 'Escrever 1 e-mail curto em inglês (pode ser de mentira)', sub: 'Modelo: "Hi, I will send the file today. Thanks!"',
        info: { why: 'E-mail curto é o inglês mais útil do trabalho. Três frases bastam.', steps: ['Abra o bloco de notas (não precisa enviar)', 'Escreva: "Hi," + o que você precisa + "Thanks!"', 'Modelo: "Hi, I will send the file today. Thanks!"', 'Releia e corrija 1 detalhe'] } }; } },
    { id: 'video4', kind: 'ver', mn: 4, need: { s: 2, e: 1 }, at: ['Intervalo do almoço', 'Na fila', 'No Transporte', 'Em Casa', 'No sofá', 'Só 5 minutos', 'Viajando'], not: ['No Trabalho'],
      b: function (c) { return { icon: '📺', title: 'Assistir 1 vídeo curto em inglês (até 4 min)', sub: 'Com legenda em inglês',
        info: { why: 'Vídeo curto tem som, imagem e legenda juntos. É o jeito leve de treinar o ouvido.', steps: ['Abra o link abaixo e escolha 1 vídeo curto', 'Ligue a legenda em inglês (não em português)', 'Assista até o fim', 'Anote 1 palavra nova'], links: [{ t: '▶️ Vídeos curtos pra aprender', u: YT('easy english short video with subtitles') }] } }; } },
    { id: 'serie', adv: true, kind: 'ver', mn: 10, need: { s: 2, e: 1 }, at: ['No sofá', 'Em Casa', 'Focado pra estudar'], not: ['No Trabalho', 'Intervalo do almoço'],
      b: function (c) { return { icon: '🎬', title: 'Assistir 1 cena de série com legenda em inglês', sub: 'Até 10 minutos, na Netflix, Disney+ ou YouTube',
        info: { why: 'Série é inglês de verdade, falado do jeito que a gente escuta na rua. Com legenda em inglês você lê e ouve junto.', steps: ['Escolha uma série que você já conhece', 'Ligue áudio e legenda em inglês', 'Assista 1 cena (até 10 min)', 'Anote 2 frases que gostou'] } }; } },
    { id: 'diario5', kind: 'escrever', mn: 6, need: { s: 1 }, prod: true, only: ['Focado pra estudar', 'Em Casa'],
      b: function (c) { return { icon: '✍️', title: 'Escrever 5 frases sobre a sua semana', sub: 'Comece com: This week I… / I want to… / I learned…',
        info: { why: 'Escrever com calma consolida o que você aprendeu.', steps: ['Abra o bloco de notas', 'Escreva 5 frases sobre a sua semana', 'Releia em voz alta', 'Corrija 1 coisa'] } }; } },
    { id: 'ensinar', kind: 'social', mn: 3, need: { v: 1 }, only: ['Com a família'],
      b: function (c) { var o = c.K.o.slice(0, 3);
        return { icon: '👨‍👩‍👧', title: 'Ensinar 3 palavras pra alguém de casa', sub: o.map(function (x) { return x[0]; }).join(' · '),
          info: { why: 'Ensinar é aprender duas vezes. E inglês em família vira brincadeira.', steps: o.map(function (x) { return x[0] + ' = ' + x[1]; }).concat(['Fale cada palavra pra alguém', 'Peça pra pessoa repetir']) } }; } },
    { id: 'aula', kind: 'aula', mn: 15, need: { s: 2 }, aula: true,
      b: function (c) { return c.aula ? c.aula() : null; } }
  ];

  function podcast(c, n) {
    var baixo = c.baixo, P = c.P, em = P.em ? ' ' + P.em : '';
    return { icon: '🎙️', title: 'Ouvir ' + n + ' min de podcast de inglês' + em, sub: baixo ? 'Bem lento e simples' : 'Episódio curto do seu jeito',
      info: { why: 'Escutar inglês feito pra quem aprende, com fala clara, é o treino de ouvido mais eficiente que existe.',
        steps: ['Abra o link e escolha um episódio', 'Ouça ' + n + ' minutos' + (P.v ? '' : ' (sem falar nada)'), 'Se perder o fio, não pare: continue ouvindo', 'No fim, diga 1 coisa que entendeu'],
        links: [baixo ? { t: '🎧 Podcasts lentos pra iniciantes', u: YT('slow english podcast for beginners') } : { t: '🎧 BBC 6 Minute English', u: BBC }] } };
  }

  /* ---------- seleção ---------- */
  var TIER = {
    1:  { n: 2, max: 1,  sum: 1 },
    5:  { n: 3, max: 4,  sum: 5 },
    10: { n: 3, max: 6,  sum: 10 },
    30: { n: 4, max: 12, sum: 30 },
    60: { n: 5, max: 20, sum: 60 }
  };

  function ctx(place, X) {
    var P = L[place] || L['Em Casa'], k = K[place] || K['Em Casa'];
    return { P: P, K: k, d: X.dia || 0, hora: X.hora == null ? 12 : X.hora, baixo: !!X.baixo, ig: place === 'Na igreja', aula: X.aula, place: place };
  }

  function elegiveis(place, tier, X) {
    var c = ctx(place, X), P = c.P, out = [], T0 = TIER[tier] || TIER[10];
    T.forEach(function (t) {
      var nd = t.need || {};
      if ((nd.s || 0) > P.s || (nd.v || 0) > P.v || (nd.e || 0) > P.e) return;
      if (t.only && t.only.indexOf(place) < 0) return;
      if (t.not && t.not.indexOf(place) >= 0) return;
      if (t.prod && X.baixo) return;
      if (t.adv && X.baixo) return;
      if (t.fe && !X.fe && place !== 'Na igreja') return;
      if (t.kind === 'social' && t.id !== 'comentar' && tier > 10) return;
      if (t.fam && false) return;
      if (t.aulas && (X.vistas || 0) < t.aulas) return;
      if (t.aula && (tier < 30 || !X.aula || !X.aula())) return;
      if (!t.aula && t.mn > T0.max) return;
      var o = t.b(c);
      if (!o) return;
      o = Object.assign({ mn: t.mn }, o, { _id: t.id, _kind: t.kind, _mn: t.mn, _fam: t.fam || t.id });
      var pi = (PREF[place] || []).indexOf(t.id); if (pi < 0 && t.fam) pi = (PREF[place] || []).indexOf(t.fam);
      var sc = (pi >= 0 ? 9 - Math.min(pi, 6) : 0) + (t.at && t.at.indexOf(place) >= 0 ? 1 : 0) + (X.ini ? (t.ini || 0) : 0) + (t.aula ? 100 : 0) + (hash(c.d + t.id + place) % 3);
      // tarefa só desse lugar pesa mais que tarefa genérica
      if (t.only) sc += 3;
      // no tempo curto, o mais curto primeiro faz sentido; no longo, os maiores
      sc += tier >= 30 ? t.mn * .6 : tier === 10 ? t.mn * .5 : tier === 5 ? t.mn * .3 : 0;
      o._sc = sc;
      out.push(o);
    });
    out.sort(function (a, b) { return b._sc - a._sc; });
    return out;
  }

  function gerar(place, tier, X) {
    if (place === 'Só 5 minutos') tier = Math.min(tier, 5);
    var T0 = TIER[tier] || TIER[10], el = elegiveis(place, tier, X), out = [], tot = 0, kinds = {}, sociais = 0;
    var cabe = function (o) { return out.length < T0.n && tot + o._mn <= T0.sum + 1e-9 && o._mn <= (o._kind === 'aula' ? 99 : T0.max) && out.every(function (x) { return x.title !== o.title && x._fam !== o._fam; }); };
    var poe = function (o) { out.push(o); tot += o._mn; kinds[o._kind] = (kinds[o._kind] || 0) + 1; if (o._kind === 'social') sociais++; };
    el.forEach(function (o) { if (cabe(o) && !kinds[o._kind] && !(o._kind === 'social' && sociais)) poe(o); });
    if (out.length < T0.n) el.forEach(function (o) { if (cabe(o) && (kinds[o._kind] || 0) < 2 && !(o._kind === 'social' && sociais)) poe(o); });
    if (tier >= 30 && out.length < T0.n + 1) el.forEach(function (o) { if (out.length < T0.n + 1 && tot + o._mn <= T0.sum + 1e-9 && o._mn <= T0.max && out.every(function (x) { return x.title !== o.title && x._fam !== o._fam; }) && o._kind !== 'aula') poe(o); });
    if (!out.length && el.length) { var mn = el.slice().sort(function (a, b) { return a._mn - b._mn; })[0]; poe(mn); }
    // aula sempre primeiro; o resto em ordem do mais curto pro mais longo no tempo curto
    out.sort(function (a, b) { return (b._kind === 'aula' ? 1 : 0) - (a._kind === 'aula' ? 1 : 0); });
    return out;
  }

  /* outras tarefas do mesmo lugar e tempo, pra trocar */
  function alternativas(place, tier, X, excl) {
    if (place === 'Só 5 minutos') tier = Math.min(tier, 5);
    var T0 = TIER[tier] || TIER[10];
    return elegiveis(place, tier, X).filter(function (o) { return o._kind !== 'aula' && excl.indexOf(o.title) < 0 && o._mn <= T0.max; });
  }

  window.EBG_TAREFAS = { gerar: gerar, alternativas: alternativas, TIER: TIER, LUGARES: L, PACOTES: K, CATALOGO: T };
})();
