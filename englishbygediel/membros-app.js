/* Plataforma Inteligente — camada do app do aluno.
   - Entrada: vídeo de boas-vindas no 1º acesso + "onde você está agora?" toda vez que abre
   - Home: checklist de hoje, lives, a aula da vez (anterior/próxima), sequência real, indicação
   - Universos (English On Mission, Culture, Viagens): cards vindos do Supabase (tabela mi_uni_cards), editáveis no admin
   - Mini cursos avulsos (módulo com trilha 'mini'), liberados por produto
   - Jogos jogáveis (Flashcards, Monta Frase, Complete, Quiz Phrasal)
   - Menu Prompts, navegação de baixo no celular e instalação como app */
(function(){
  'use strict';
  var WA='5555999895429', SITE='https://englishbygediel.netlify.app/';
  var E=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});};
  var $=function(id){return document.getElementById(id);};
  var pad=function(n){return String(n).padStart(2,'0');};
  var dia=function(d){d=d||new Date();return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());};
  var LS={get:function(k,d){try{var v=localStorage.getItem(k);return v==null?d:JSON.parse(v);}catch(e){return d;}},set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}};
  var wa=function(txt,num){window.open('https://wa.me/'+(num===false?'':WA)+'?text='+encodeURIComponent(txt),'_blank','noopener');};
  var pill=function(p){return [].filter.call(document.querySelectorAll('.nav-pill'),function(n){return (n.getAttribute('onclick')||'').indexOf("'"+p+"'")>=0;})[0]||null;};
  var go=function(p){window.goTo(p,pill(p));};
  /* ── ícones 3D (img/icons): os 20 do Gediel em .webp e os do mesmo estilo em .svg ── */
  var IC_BASE='jogo-couple home maratona lives modulos jogos materiais prompts agendar check fogo eom culture viagens bussola prisma youtube instagram indicar sino suporte'.split(' ');
  function IC(n,cls){if(!n)return '';return '<img class="ic3d'+(cls?' '+cls:'')+'" src="img/icons/'+n+'.'+(IC_BASE.indexOf(n)>=0?'webp':'svg')+'" alt="" draggable="false">';}
  window.IC=IC;
  var IC_MENU={home:'home',maratona:'maratona',lives:'lives',modulos:'modulos',jogos:'jogos',materiais:'materiais',prompts:'prompts',agendar:'agendar',planos:'planos',indicar:'indicar',eom:'eom',culture:'culture',viagens:'viagens',bussola:'bussola',prisma:'prisma',admin:'admin'};
  var IC_CTX={'Em Casa':'home','Acabei de acordar':'ctx-acordar','Vou pro banho':'ctx-banho','Prestes a dormir':'ctx-dormir','No carro':'ctx-carro','No Transporte':'ctx-transporte','No Trabalho':'ctx-trabalho','Intervalo do almoço':'ctx-almoco','Lavando a louça':'ctx-louca','Limpando a casa':'ctx-limpeza','Cozinhando':'ctx-cozinha','Caminhando':'ctx-caminhada','Na Academia':'ctx-academia','Na fila':'ctx-fila','No sofá':'ctx-sofa','Só 5 minutos':'ctx-5min','Focado pra estudar':'ctx-foco','Viajando':'viagens','No mercado':'ctx-mercado','Na igreja':'ctx-igreja','Com a família':'ctx-familia'};
  function tileBtn(ic,txt,cor){return '<span class="tb-tile" style="--c:'+cor+'">'+IC(ic)+'<b>'+txt+'</b></span>';}
  function icCtx(c,cls){return IC_CTX[c.k]?IC(IC_CTX[c.k],cls):c.ic;}
  var CTX_COR={"5min": "#6e1c2a", "academia": "#6c1f1f", "acordar": "#6e4705", "almoco": "#70340a", "banho": "#03525f", "caminhada": "#09534b", "carro": "#6c1f1f", "cozinha": "#70340a", "dormir": "#2d2e6c", "familia": "#6a2045", "fila": "#4c266f", "foco": "#112d6a", "igreja": "#623603", "limpeza": "#07533a", "louca": "#03525f", "mercado": "#0a4921", "sofa": "#3f296f", "trabalho": "#381a6b", "transporte": "#6e4705", "casa": "#0d3067", "viagem": "#09534b"};
  function ctxNome(c){var n=IC_CTX[c.k];if(!n)return '';n=n.replace(/^ctx-/,'');return n==='home'?'casa':n==='viagens'?'viagem':n;}
  function ctxCor(c){return CTX_COR[ctxNome(c)]||'#1b1f4b';}
  /* cartão da entrada: fundo e desenho em camadas separadas (o desenho anima sozinho) */
  function ctxImg(c){var n=ctxNome(c);if(!CTX_COR[n])return icCtx(c);return '<span class="ly"><img class="bgi" src="img/icons/ctx3d/'+n+'-bg.svg" alt="" draggable="false"><img class="fg a-'+n+'" src="img/icons/ctx3d/'+n+'-fg.svg" alt="" draggable="false"></span>';}
  function iconesMenu(){
    [].forEach.call(document.querySelectorAll('.sidebar .nav-pill'),function(n){var t=n.querySelectorAll('span')[1];if(t&&!n.title)n.title=t.textContent;});
    var lg=document.querySelector('.sidebar-logo');
    if(lg&&!document.getElementById('mi-recolher')){var b=document.createElement('button');b.id='mi-recolher';b.title='Recolher ou abrir o menu';b.setAttribute('aria-label','Recolher ou abrir o menu');b.innerHTML='<span>‹</span>';lg.appendChild(b);
      b.addEventListener('click',function(){var on=!document.body.classList.contains('mi-mini');document.body.classList.toggle('mi-mini',on);LS.set('mi_mini',on);});
      if(LS.get('mi_mini',false))document.body.classList.add('mi-mini');}
    [].forEach.call(document.querySelectorAll('.sidebar .nav-pill'),function(n){
      var sp=n.querySelector('.nav-icon');if(!sp||sp.dataset.ic3d)return;
      var m=(n.getAttribute('onclick')||'').match(/goTo\('([\w-]+)'/),k=m?m[1]:/openSettings/.test(n.getAttribute('onclick')||'')?'config':n.id==='admin-nav'?'admin':null;
      var nome=k&&(IC_MENU[k]||(k==='config'?'config':null));if(!nome)return;
      sp.innerHTML=IC(nome);sp.dataset.ic3d='1';
    });
  }
  function iconesTopo(){
    var th=document.getElementById('theme-toggle');if(th)th.innerHTML=IC(document.documentElement.getAttribute('data-theme')==='light'?'tema-claro':'tema-escuro');
    var bell=[].filter.call(document.querySelectorAll('.topbar .tb-btn'),function(b){return /🔔/.test(b.textContent);})[0];if(bell)bell.innerHTML=IC('sino')+'<span class="notif-dot"></span>';
    var fab=document.getElementById('ai-fab');if(fab)fab.innerHTML=IC('suporte');
  }
  var ttOrig=window.toggleTheme;if(ttOrig)window.toggleTheme=function(){ttOrig();iconesTopo();};
  var CTX_EN={'Em Casa':'At home','Acabei de acordar':'Just woke up','Vou pro banho':'Shower time','Prestes a dormir':'About to sleep','No carro':'In the car','No Transporte':'On the go','No Trabalho':'At work','Intervalo do almoço':'Lunch break','Lavando a louça':'Doing the dishes','Limpando a casa':'Cleaning up','Cozinhando':'Cooking','Caminhando':'Out walking','Na Academia':'At the gym','Na fila':'Waiting in line','No sofá':'Chilling on the couch','Só 5 minutos':'Just 5 minutes','Focado pra estudar':'Ready to study','Viajando':'Traveling','No mercado':'At the store','Na igreja':'At church','Com a família':'With family'};
  function acessos(){try{return parseInt(localStorage.getItem('mi_acessos')||'0',10)||0;}catch(e){return 0;}}
  function contaAcesso(){try{if(sessionStorage.getItem('mi_sess_ok'))return;sessionStorage.setItem('mi_sess_ok','1');localStorage.setItem('mi_acessos',String(acessos()+1));}catch(e){}}
  var CTX=[
    {k:'Em Casa',ic:'🏠',lb:'Em casa',hint:'Tempo pra estudar com calma'},
    {k:'Acabei de acordar',ic:'🥱',lb:'Acabei de acordar',hint:'Olho meio aberto, cérebro ligando'},
    {k:'Vou pro banho',ic:'🚿',lb:'Vou pro banho',hint:'O melhor palco do mundo'},
    {k:'Prestes a dormir',ic:'😴',lb:'Prestes a dormir',hint:'Último gás do dia'},
    {k:'No carro',ic:'🚗',lb:'Tô no carro',hint:'Olho na estrada, inglês no ouvido'},
    {k:'No Transporte',ic:'🚌',lb:'Ônibus, metrô, Uber',hint:'Fone no ouvido, mãos ocupadas'},
    {k:'No Trabalho',ic:'💼',lb:'No trabalho',hint:'Pausas curtas entre tarefas'},
    {k:'Intervalo do almoço',ic:'🍽️',lb:'Intervalo do almoço',hint:'Comendo e aprendendo'},
    {k:'Lavando a louça',ic:'🧽',lb:'Lavando a louça',hint:'Mãos molhadas, ouvido livre'},
    {k:'Limpando a casa',ic:'🧹',lb:'Limpando a casa',hint:'Faxina com trilha sonora'},
    {k:'Cozinhando',ic:'🍳',lb:'Cozinhando',hint:'Chef bilíngue em ação'},
    {k:'Caminhando',ic:'🚶',lb:'Caminhando',hint:'Pernas e inglês em movimento'},
    {k:'Na Academia',ic:'🏋️',lb:'Na academia',hint:'Treino com inglês no fone'},
    {k:'Na fila',ic:'⏳',lb:'Na fila ou esperando',hint:'Aquele tempo morto vira treino'},
    {k:'No sofá',ic:'🛋️',lb:'No sofá de bobeira',hint:'Sem culpa, com inglês'},
    {k:'Só 5 minutos',ic:'⏱️',lb:'Só tenho 5 minutos',hint:'Rapidinho, mas todo dia'},
    {k:'Focado pra estudar',ic:'📚',lb:'Focado pra estudar',hint:'Hoje eu tô com tudo'},
    {k:'Viajando',ic:'✈️',lb:'Viajando',hint:'O mundo é a sala de aula'},
    {k:'No mercado',ic:'🛒',lb:'No mercado',hint:'Lista de compras em inglês'},
    {k:'Na igreja',ic:'🙏',lb:'Na igreja ou devocional',hint:'Fé e inglês juntos'},
    {k:'Com a família',ic:'👨‍👩‍👧',lb:'Com a família',hint:'Todo mundo aprende junto'}
  ];
  /* tarefas novas que os contextos usam (mesmo formato do TASK_INFO: por quê, passos, links, exemplos, provinha) */
  var TI={
    narrar:{why:'Falar sozinho é o treino mais barato que existe: ninguém escuta, ninguém corrige, e sua boca se acostuma com o inglês.',
      steps:['Fale em voz alta o que você está fazendo, em frases curtas','Não sabe uma palavra? Fale em português e siga, depois procure','Use sempre o mesmo começo: "Now I\'m…" (agora eu estou…)'],
      ex:['"Now I\'m washing the dishes." (agora estou lavando a louça)','"I\'m cleaning the table." (estou limpando a mesa)','"Next, I\'m going to…" (depois eu vou…)'],
      quiz:[{q:'Como dizer "agora estou cozinhando"?',a:['Now I cook.','Now I\'m cooking.','Now I cooking.','Now am I cook.'],c:1},{q:'Não lembrou uma palavra. O que fazer?',a:['Parar tudo','Falar em português e seguir','Desistir','Abrir o dicionário na hora'],c:1}]},
    acordar:{why:'Quem planeja o dia em inglês já começa o dia pensando em inglês.',
      steps:['Ainda na cama, fale 3 coisas que você vai fazer hoje','Use "Today I\'m going to…"','Feche com 1 coisa pela qual você é grato: "I\'m grateful for…"'],
      ex:['"Today I\'m going to work and study English."','"I\'m grateful for my family."'],
      quiz:[{q:'"Hoje eu vou trabalhar" em inglês:',a:['Today I go to work.','Today I\'m going to work.','Today I going work.','Today I will to work.'],c:1}]},
    dormir:{why:'O cérebro organiza a memória enquanto você dorme. Revisar antes de dormir ajuda a fixar.',
      steps:['Lembre 5 palavras ou frases que você viu hoje','Fale cada uma numa frase sua, baixinho','Se não lembrar de nada, abra os flashcards e revise 5'],
      ex:['"grateful" → "I\'m grateful for today."','"by the way" → "By the way, I learned a new word."']},
    oracao:{why:'Orar em inglês junta duas coisas que você já faz todo dia: fé e prática. E é uma conversa sem medo de errar.',
      steps:['Agradeça por 3 coisas: "Thank you, Lord, for…"','Peça por 1 pessoa: "Please, bless…"','Termine com "In Jesus\' name, amen."'],
      ex:['"Thank you, Lord, for this day."','"Please, give me wisdom at work."'],
      quiz:[{q:'"Obrigado, Senhor, pela minha família":',a:['Thanks Lord my family.','Thank you, Lord, for my family.','Thank you Lord to my family.','Thank Lord of my family.'],c:1}]},
    placas:{why:'Placas, rótulos e cardápios são inglês de verdade, curto e repetido. É vocabulário de graça em todo lugar.',
      steps:['Ache 5 palavras em inglês ao seu redor (placas, embalagens, cardápio)','Leia em voz alta','Tente adivinhar o sentido antes de traduzir'],
      ex:['"Exit" = saída','"Sale" = promoção','"Gluten free" = sem glúten']},
    nomear:{why:'Dar nome às coisas em inglês cria o hábito de pensar em inglês, sem precisar de livro.',
      steps:['Olhe em volta e nomeie 10 coisas em inglês','As que você não souber, anote e procure depois','Junte 2 numa frase: "The ___ is next to the ___."'],
      ex:['"The cart is next to the milk."','"I need apples and bread."']},
    idioma:{why:'É a tarefa mais preguiçosa e uma das mais poderosas: você passa a ler inglês dezenas de vezes por dia sem abrir livro. Os botões você já sabe onde ficam, então o cérebro liga a palavra ao significado sozinho.',
      steps:['iPhone: Ajustes → Geral → Idioma e Região → Idioma do iPhone → English','Android: Configurações → Sistema → Idiomas → Adicionar idioma → English → arraste pro topo','Faça o mesmo no Instagram, no YouTube e na Netflix (Configurações → Idioma)','Se travar, volta pro português, sem culpa. Mas tente aguentar 7 dias'],
      ex:['Settings = Configurações','Search = Pesquisar','Share = Compartilhar','Save = Salvar']},
    cognatos:{why:'Você já sabe centenas de palavras em inglês e não sabe que sabe. Reconhecer as parecidas com o português dá confiança e treina o ouvido pra achar padrões.',
      steps:['Abra qualquer texto, embalagem ou legenda em inglês','Ache 10 palavras que parecem português','Fale cada uma em voz alta, do jeito inglês','Bônus: repare no padrão -tion = -ção (nation, information, situation)'],
      ex:['hospital, chocolate, internet, music','family = família · important = importante','information = informação · possible = possível']},
    ouvir:{why:'No começo, o objetivo não é entender tudo: é acostumar o ouvido com o som do inglês. Reconhecer 2 ou 3 palavras já é vitória.',
      steps:['Escolha um vídeo bem simples (pra iniciantes)','Assista 3 minutos sem pausar e sem legenda em português','Anote as palavras que você reconheceu, mesmo poucas','Assista de novo com legenda em inglês e veja quantas você pegou'],
      links:[{t:'▶️ Vídeos pra quem está começando',u:'https://www.youtube.com/results?search_query=comprehensible+input+english+absolute+beginner'}]},
    jogo:{why:'Jogar fixa vocabulário sem parecer estudo. Perfeito pra quando a energia está baixa.',
      steps:['Abra o menu Jogos','Escolha 1 destes (todos liberados): Flashcards, Complete, Monta Frase ou Quiz Phrasal','Jogue 1 rodada inteira'],
      links:[{t:'🎮 Abrir os jogos',u:'#jogos'}]},
    aula:{why:'A aula da semana é a espinha do seu plano. O checklist completa, a aula ensina.',
      steps:['Abra a sua aula da vez','Assista inteira, com caderno do lado','Faça o quiz no fim da aula'],
      links:[{t:'📚 Ir pras aulas',u:'#modulos'}]},
    familia:{why:'Ensinar alguém é o jeito mais rápido de aprender. E inglês em família vira brincadeira.',
      steps:['Escolha 3 palavras do dia e ensine pra alguém de casa','Façam uma pergunta e resposta em inglês: "How are you?" / "I\'m good!"','Coloquem 1 música em inglês e cantem juntos'],
      ex:['"Pass me the water, please."','"Good night, sleep well!"']}
  };
  var R=function(k,i){return {ref:[k,i]};};
  var T=function(icon,title,sub,src){var o={icon:icon,title:title,sub:sub};if(typeof src==='string')o.info=TI[src];else if(src)o.ref=src.ref;return o;};
  var CTX_NOVOS={
    'Acabei de acordar':[T('☀️','Planejar o dia em inglês, em voz alta','3 frases antes de levantar','acordar'),T('📖','Ler 1 versículo em inglês','YouVersion — NIV ou NLT',R('Em Casa',5)),T('🎵','Uma música em inglês pra acordar','Cante junto o refrão',R('No Transporte',1)),T('🃏','Revisar 5 flashcards','Ainda de pijama, vale',R('Em Casa',2))],
    'Vou pro banho':[T('🎤','Cantar 1 música em inglês no banho','Shadowing com acústica de estúdio',R('Em Casa',3)),T('🗣️','Narrar o banho em inglês','"Now I\'m washing my hair…"','narrar'),T('🎙️','Deixar um podcast tocando','Celular longe da água, volume alto',R('Em Casa',0))],
    'Prestes a dormir':[T('🧠','Revisar 5 palavras do dia','Baixinho, antes de apagar','dormir'),T('✍️','Escrever 3 frases sobre o seu dia','Diário em inglês, 2 minutos',R('Em Casa',4)),T('🙏','Orar em inglês por 1 minuto','"Thank you, Lord, for…"','oracao'),T('🎙️','Ouvir 5 min de podcast','Com timer pra desligar',R('Em Casa',0))],
    'No carro':[T('🎙️','Podcast no som do carro','Sem tela: só ouvido',R('No Transporte',0)),T('🗣️','Shadowing em voz alta','No carro pode falar alto, ninguém escuta',R('No Transporte',3)),T('🎵','Playlist em inglês + 1 expressão','Repita o refrão no sinal vermelho',R('No Transporte',1)),T('🧠','Ouvir a aula gravada (só áudio)','Revisão sem olhar a tela',R('No Transporte',5))],
    'Intervalo do almoço':[T('📺','1 vídeo curto de inglês','5 minutos enquanto come',R('No Trabalho',5)),T('🃏','Revisar 5 flashcards','Antes do cafezinho',R('No Trabalho',3)),T('✉️','Escrever 1 mensagem em inglês','Pra um amigo ou pra você mesmo',R('No Trabalho',1)),T('🎬','1 cena de série com legenda em inglês','Se sobrar tempo',R('Em Casa',1))],
    'Lavando a louça':[T('🎙️','Podcast enquanto lava','Mãos ocupadas, ouvido livre',R('Em Casa',0)),T('🗣️','Narrar a louça em inglês','"Now I\'m washing the plates…"','narrar'),T('🎵','Cantar 1 música em inglês','Ninguém tá olhando',R('Em Casa',3))],
    'Limpando a casa':[T('🎙️','Podcast na faxina','Um episódio por cômodo',R('Em Casa',0)),T('🎵','Playlist em inglês + 1 expressão','Faxina com trilha sonora',R('No Transporte',1)),T('🗣️','Narrar a faxina em inglês','"I\'m cleaning the living room…"','narrar')],
    'Cozinhando':[T('🗣️','Narrar a receita em inglês','"First, I cut the onions…"','narrar'),T('🎵','Música em inglês na cozinha','Cante o refrão',R('Em Casa',3)),T('📱','1 vídeo curto de receita em inglês','YouTube: "easy recipe"',R('No Transporte',4))],
    'Caminhando':[T('🎙️','Podcast na caminhada','Um episódio inteiro',R('No Transporte',0)),T('🗣️','Shadowing baixinho','Repita o que ouvir',R('No Transporte',3)),T('👀','Nomear 10 coisas que você vê','Árvore, carro, cachorro…','nomear')],
    'Na fila':[T('🃏','Revisar 5 flashcards','A fila nem vai parecer longa',R('No Transporte',2)),T('📱','1 vídeo curto em inglês','Com fone',R('No Transporte',4)),T('✍️','Escrever 3 frases no bloco de notas','Sobre o que você está esperando',R('Em Casa',4))],
    'No sofá':[T('🎬','1 cena de série com legenda em inglês','O sofá agradece',R('Em Casa',1)),T('🎮','Jogar 1 jogo de inglês','Diversão que conta como estudo','jogo'),T('🃏','Revisar 10 flashcards','Entre um episódio e outro',R('Em Casa',2))],
    'Só 5 minutos':[T('🃏','Revisar 5 flashcards','2 minutos',R('No Transporte',2)),T('📱','1 vídeo curtinho em inglês','3 minutos',R('No Transporte',4))],
    'Focado pra estudar':[T('📚','Assistir a aula da vez','Com caderno e quiz no fim','aula'),T('✍️','Escrever 3 frases no diário','Usando o que você aprendeu',R('Em Casa',4)),T('🃏','Revisar 10 flashcards','Em voz alta',R('Em Casa',2)),T('🎬','1 cena de série com legenda em inglês','Pra fechar com chave de ouro',R('Em Casa',1))],
    'Viajando':[T('🪧','Ler 5 placas ou cardápios em inglês','O mundo é a sala de aula','placas'),T('🎵','Playlist em inglês + 1 expressão','Na estrada ou no avião',R('No Transporte',1)),T('📱','Celular em inglês por 1 dia','Configurações → Idioma',R('No Trabalho',0)),T('📱','1 vídeo curto em inglês','Na sala de espera',R('No Transporte',4))],
    'No mercado':[T('🛒','Nomear 10 itens do carrinho em inglês','Apple, bread, milk…','nomear'),T('🪧','Ler 5 rótulos em inglês','Embalagem importada vale ouro','placas'),T('🎵','Música em inglês no fone','Enquanto escolhe as frutas',R('No Transporte',1))],
    'Na igreja':[T('📖','Ler o versículo do dia em inglês','NIV ou NLT',R('Em Casa',5)),T('🙏','Orar em inglês por 1 minuto','"Thank you, Lord, for…"','oracao'),T('🎵','Louvor em inglês','Cante junto e repare na letra',R('Em Casa',3))],
    'Com a família':[T('👨‍👩‍👧','Ensinar 3 palavras pra alguém de casa','Ensinar é aprender 2 vezes','familia'),T('🎵','Música em inglês com todo mundo','Karaokê em casa',R('Em Casa',3)),T('🎮','Jogar 1 jogo de inglês juntos','Quem acertar mais escolhe a sobremesa','jogo')]
  };
  if(window.CTX_TASKS)Object.keys(CTX_NOVOS).forEach(function(k){CTX_TASKS[k]=CTX_NOVOS[k];});
  /* quem está começando do zero recebe um checklist só de base até ver 3 aulas; trocar o idioma é pra todo mundo */
  if(window.CTX_TASKS){
    CTX_TASKS['Primeiros passos']=[T('📚','Assistir a próxima aula do Programa','Comece pela aula 1, com caderno do lado','aula'),T('🔎','Caçar 10 palavras que você já conhece','Inglês parecido com português (cognatos)','cognatos'),T('👂','Ouvir 3 minutos de inglês bem simples','Não é pra entender tudo: é acostumar o ouvido','ouvir'),T('🎮','Jogar 1 jogo fácil','Fixar sem parecer estudo','jogo')];
    CTX_TASKS['_idioma']=[T('📱','Trocar o idioma dos aparelhos pra inglês','Celular, Instagram, YouTube e Netflix','idioma')];
  }

  /* ───────────────────────── estilo ───────────────────────── */
  var css=document.createElement('style');
  css.textContent=[
  '.nav-pill[onclick*="\'devocionais\'"]{display:none!important}',
  /* entrada */
  '#mi-entry{position:fixed;inset:0;z-index:9000;background:radial-gradient(ellipse at 20% 0%,#3b4fd8 0%,#1b1f4b 45%,#0b0d1c 100%);color:#fff;display:none;align-items:center;justify-content:center;padding:20px;overflow-y:auto;opacity:0;transition:opacity .35s}',
  '#mi-entry.on{display:flex}#mi-entry.vis{opacity:1}',
  '.mi-ent-box{width:100%;max-width:640px;margin:auto}',
  '.mi-ent-kicker{font-size:11px;font-weight:800;letter-spacing:1.6px;text-transform:uppercase;opacity:.65;text-align:center}',
  '.mi-ent-q{font-size:clamp(22px,4.6vw,30px);font-weight:800;text-align:center;line-height:1.2;margin:8px 0 6px;text-wrap:balance}',
  '.mi-ent-s{font-size:13.5px;opacity:.75;text-align:center;line-height:1.55;max-width:460px;margin:0 auto 22px}',
  '.mi-ctx{display:grid;grid-template-columns:1fr 1fr;gap:12px}',
  '.mi-ctx button{background:rgba(255,255,255,.08);border:1.5px solid rgba(255,255,255,.14);border-radius:20px;color:#fff;padding:20px 14px;cursor:pointer;text-align:left;display:flex;flex-direction:column;gap:6px;opacity:0;transform:translateY(14px);animation:miUp .45s cubic-bezier(.22,1,.36,1) forwards;transition:background .15s,border-color .15s,transform .12s}',
  '.mi-ctx button:hover{background:rgba(255,255,255,.14);border-color:rgba(255,255,255,.4)}.mi-ctx button:active{transform:scale(.96)}',
  '.mi-ctx .ic{font-size:34px;line-height:1}.mi-ctx .lb{font-size:16px;font-weight:800}.mi-ctx .ht{font-size:11.5px;opacity:.7;line-height:1.4}',
  '.mi-ctx-skip{display:block;margin:18px auto 0;background:none;border:none;color:rgba(255,255,255,.6);font-size:12.5px;cursor:pointer;text-decoration:underline;text-underline-offset:3px}',
  '@keyframes miUp{to{opacity:1;transform:none}}',
  '.mi-video{position:relative;width:100%;aspect-ratio:16/9;border-radius:18px;overflow:hidden;background:#000;box-shadow:0 20px 60px rgba(0,0,0,.45);margin-bottom:18px}',
  '.mi-video iframe{position:absolute;inset:0;width:100%;height:100%;border:0}',
  '.mi-video .ph{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;background:linear-gradient(135deg,#4f6ef7,#8b5cf6);font-weight:800;text-align:center;padding:20px}',
  '.mi-steps{display:grid;gap:8px;margin-bottom:20px}',
  '.mi-steps div{display:flex;gap:12px;align-items:center;background:rgba(255,255,255,.07);border-radius:14px;padding:11px 14px;font-size:13px;line-height:1.45}',
  '.mi-steps b{width:28px;height:28px;border-radius:9px;background:rgba(255,255,255,.16);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:15px}',
  '.mi-cta{position:sticky;bottom:max(12px,env(safe-area-inset-bottom));box-shadow:0 10px 30px rgba(0,0,0,.35);display:block;width:100%;background:#fff;color:#1b1f4b;border:none;border-radius:16px;padding:16px;font-size:15px;font-weight:800;cursor:pointer}',
  '.mi-cta:active{transform:scale(.98)}',
  /* home */
  '.hm-greet{font-size:22px;font-weight:800;line-height:1.2}',
  '.hm-sub{font-size:13px;color:var(--fg2);margin:4px 0 18px}',
  '.hm-row{display:grid;grid-template-columns:1.25fr 1fr;gap:12px;margin-bottom:22px}',
  '.hm-big{border:none;border-radius:22px;padding:18px;cursor:pointer;color:#fff;text-align:left;display:flex;flex-direction:column;gap:6px;min-height:150px;position:relative;overflow:hidden;box-shadow:var(--shadow);transition:transform .12s}',
  '.hm-big:active{transform:scale(.97)}',
  '.hm-big .ic{font-size:46px;line-height:1;margin-bottom:auto}',
  '.hm-big .lb{font-size:15px;font-weight:800}',
  '.hm-big .pg{font-size:11.5px;opacity:.85}',
  '.hm-big .bar{height:6px;border-radius:99px;background:rgba(255,255,255,.25);overflow:hidden;margin-top:4px}.hm-big .bar i{display:block;height:100%;background:#fff;border-radius:99px;transition:width .4s}',
  '.hm-check{background:linear-gradient(135deg,#10b981,#059669)}',
  '.hm-live{background:linear-gradient(135deg,#ef4444,#b91c1c)}',
  '.hm-live.off{background:linear-gradient(135deg,#334155,#1e293b)}',
  '.hm-live .dot{position:absolute;top:16px;right:16px;font-size:10px;font-weight:800;letter-spacing:.6px;background:#fff;color:#ef4444;padding:3px 8px;border-radius:99px;animation:miPulse 1.4s infinite}',
  '@keyframes miPulse{50%{opacity:.55}}',
  '.hm-aula{background:var(--surface);border:1px solid var(--border);border-radius:22px;overflow:hidden;box-shadow:var(--shadow);margin-bottom:22px}',
  '.hm-aula{container-type:inline-size}.hm-aula .cv{position:relative;width:100%;height:min(52vh,56.25cqw);background:radial-gradient(ellipse at 18% 22%,#d2e6ff 0%,#6fa5ff 22%,#3060d0 46%,#0c1a60 70%,#040b28 100%);display:flex;align-items:center;justify-content:center;font-size:54px;cursor:pointer;overflow:hidden}',
  '.hm-aula .cv img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}',
  '.hm-aula .cv .play{position:relative;width:74px;height:74px;border-radius:50%;background:rgba(255,255,255,.95);color:#4f6ef7;display:flex;align-items:center;justify-content:center;font-size:28px;box-shadow:0 10px 30px rgba(0,0,0,.35);padding-left:5px}',
  '.hm-aula .cv .lock{position:relative;background:rgba(10,14,30,.75);color:#fff;font-size:13px;font-weight:800;padding:9px 16px;border-radius:99px;backdrop-filter:blur(4px)}',
  '.hm-aula .cv .kick{position:absolute;top:14px;left:14px;background:rgba(10,14,30,.75);color:#fff;font-size:10px;font-weight:800;letter-spacing:.6px;padding:4px 10px;border-radius:8px;backdrop-filter:blur(4px)}',
  '.hm-aula .bd{padding:14px 16px 16px}',
  '.hm-aula .md{font-size:11px;font-weight:800;color:var(--accent);letter-spacing:.3px}',
  '.hm-aula .tt{font-size:18px;font-weight:800;line-height:1.25;margin:4px 0 6px;text-wrap:balance}',
  '.hm-aula .st{font-size:12px;color:var(--fg2)}',
  '.hm-nav{display:grid;grid-template-columns:auto 1fr auto;gap:8px;margin-top:14px}',
  '.hm-nav button{border:1.5px solid var(--border);background:var(--surface2);color:var(--fg);border-radius:12px;padding:11px 14px;font-size:13px;font-weight:800;cursor:pointer}',
  '.hm-nav button.main{background:linear-gradient(135deg,#4f6ef7,#8b5cf6);color:#fff;border-color:transparent}',
  '.hm-nav button:disabled{opacity:.35;cursor:default}',
  '.hm-quick{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:22px}',
  '.hm-quick button{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:12px 6px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px;font-size:11px;font-weight:700;color:var(--fg2);box-shadow:var(--shadow)}',
  '.hm-quick button span{font-size:24px}',
  '.hm-unis{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:22px}',
  '.hm-uni{border-radius:16px;padding:14px;color:#fff;cursor:pointer;min-height:88px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:var(--shadow);border:none;text-align:left}',
  '.hm-uni b{font-size:13px;line-height:1.25}.hm-uni span{font-size:22px}',
  '.hm-ref{background:linear-gradient(135deg,rgba(245,158,11,.12),rgba(239,68,68,.08));border:1px solid rgba(245,158,11,.25);border-radius:20px;padding:18px;display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin-bottom:22px}',
  '.hm-ref .t{font-size:15px;font-weight:800}.hm-ref .s{font-size:12px;color:var(--fg2);line-height:1.5;margin-top:3px;max-width:440px}',
  '.hm-ref .bts{display:flex;gap:8px;margin-left:auto;flex-wrap:wrap}',
  '.hm-ref button{border:none;border-radius:12px;padding:10px 14px;font-size:12.5px;font-weight:800;cursor:pointer}',
  '.hm-install{background:var(--surface);border:1.5px dashed var(--accent);border-radius:16px;padding:14px;display:flex;gap:12px;align-items:center;margin-bottom:18px;font-size:12.5px;line-height:1.5}',
  '.hm-install button{margin-left:auto;background:var(--accent);color:#fff;border:none;border-radius:10px;padding:9px 12px;font-weight:800;font-size:12px;cursor:pointer;white-space:nowrap}',
  '@media(max-width:560px){.hm-row{grid-template-columns:1fr 1fr}.hm-big{min-height:132px;padding:15px}.hm-big .ic{font-size:40px}.hm-unis{grid-template-columns:1fr 1fr 1fr;gap:8px}.hm-uni{padding:11px;min-height:80px}.hm-uni b{font-size:11.5px}.hm-ref .bts{margin-left:0;width:100%}.hm-ref .bts button{flex:1}}',
  /* universos */
  '.uni-hero{border-radius:20px;padding:22px;color:#fff;margin-bottom:20px;display:flex;gap:16px;align-items:center;flex-wrap:wrap;box-shadow:var(--shadow);cursor:pointer;position:relative;overflow:hidden}',
  '.uni-hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.35}',
  '.uni-hero>div,.uni-hero>button{position:relative}',
  '.uni-hero .ht{font-size:18px;font-weight:800;line-height:1.25}.uni-hero .hs{font-size:12.5px;opacity:.9;margin-top:4px;line-height:1.5;max-width:520px}',
  '.uni-hero button{margin-left:auto;background:#fff;color:#111;border:none;border-radius:12px;padding:11px 18px;font-size:13px;font-weight:800;cursor:pointer;white-space:nowrap}',
  '.uni-sec{font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--fg2);margin:22px 0 10px}',
  '.uni-grid.uni-std{grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px}',
  '.uni-std .uni-card .th{aspect-ratio:16/9}.uni-std .uni-card .bd{flex:1;display:flex;flex-direction:column}.uni-std .uni-card .ss{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:2.6em}.uni-std .uni-card .ac{margin-top:auto;padding-top:8px}',
  '.uni-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:14px}',
  '.uni-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;overflow:hidden;cursor:pointer;display:flex;flex-direction:column;transition:transform .15s,border-color .15s;box-shadow:var(--shadow)}',
  '.uni-card:hover{transform:translateY(-3px);border-color:var(--accent)}',
  '.uni-card .th{aspect-ratio:16/9;background:var(--surface2);position:relative;display:flex;align-items:center;justify-content:center;font-size:38px;overflow:hidden}',
  '.uni-card .th img{width:100%;height:100%;object-fit:cover;display:block}',
  '.uni-grid.mat-v{grid-template-columns:repeat(auto-fill,minmax(148px,1fr));gap:18px 14px}',
  '.mat-v .uni-card{border-radius:6px 14px 14px 6px;background:var(--surface);box-shadow:0 10px 24px -10px rgba(10,20,50,.45),inset 5px 0 0 rgba(255,255,255,.14)}',
  '.mat-v .uni-card .th{aspect-ratio:4/5.4;border-radius:0}',
  '.mat-v .uni-card:hover{transform:translateY(-5px) scale(1.02);box-shadow:0 18px 32px -12px rgba(10,20,50,.55)}',
  '.mat-v .uni-card.lock .th img{filter:saturate(.75) brightness(.92)}',
  '.mat-v .uni-card .bd{padding:10px 11px 12px;gap:4px;display:flex;flex-direction:column}',
  '.mat-v .uni-card .tt{font-size:13px;line-height:1.25;font-weight:800;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}',
  '.mat-v .uni-card .ac{font-size:12px;font-weight:800;color:var(--accent)}',
  '.mat-v .uni-card .tg{top:auto;bottom:8px;left:8px;font-size:11px;padding:4px 9px;border-radius:8px}',
  '.mat-v .uni-card .tg.own{background:#16a34a}',
  '.mat-v .uni-card .mv-lk{position:absolute;top:8px;right:8px;width:28px;height:28px;border-radius:50%;background:rgba(10,14,30,.7);display:flex;align-items:center;justify-content:center;font-size:13px}',
  '.uni-card .tg{position:absolute;top:8px;left:8px;background:rgba(10,14,30,.78);color:#fff;font-size:9.5px;font-weight:800;letter-spacing:.3px;padding:3px 8px;border-radius:7px}',
  '.uni-card.buy .tg{background:#10b981}.uni-card.soon{opacity:.85}.uni-card.soon .tg{background:#f59e0b;color:#1a1200}.uni-card.lock .th:after{content:"🔒";position:absolute;top:8px;right:10px;font-size:16px}',
  '.uni-card .bd{padding:11px 12px 13px;display:flex;flex-direction:column;gap:4px;flex:1}',
  '.uni-card .tt{font-size:13px;font-weight:800;line-height:1.3}.uni-card .ss{font-size:11px;color:var(--fg2);line-height:1.5;flex:1}',
  '.uni-card .ac{font-size:11px;font-weight:800;color:var(--accent);margin-top:6px}',
  '@media(max-width:560px){.uni-grid{grid-template-columns:repeat(2,1fr);gap:10px}.uni-hero button{margin-left:0;width:100%}.uni-card .ss{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}}',
  /* jogos */
  '.game-app-icon{position:relative}.mi-soon{position:absolute;top:-4px;left:50%;transform:translateX(-50%);background:#f59e0b;color:#1a1200;font-size:8px;font-weight:800;padding:2px 6px;border-radius:6px;white-space:nowrap}',
  '.mi-play{position:absolute;top:-4px;left:50%;transform:translateX(-50%);background:#10b981;color:#fff;font-size:8px;font-weight:800;padding:2px 6px;border-radius:6px;white-space:nowrap}',
  '#mi-game{position:fixed;inset:0;z-index:8000;background:var(--bg);display:none;flex-direction:column}',
  '#mi-game.on{display:flex}',
  '.mg-top{display:flex;align-items:center;gap:12px;padding:14px 18px;border-bottom:1px solid var(--border);padding-top:max(14px,env(safe-area-inset-top))}',
  '.mg-top .x{background:var(--surface2);border:1px solid var(--border);border-radius:10px;width:36px;height:36px;font-size:16px;cursor:pointer;color:var(--fg)}',
  '.mg-top .nm{font-weight:800;font-size:15px;flex:1}.mg-top .sc{font-size:12px;font-weight:800;color:var(--fg2)}',
  '.mg-prog{height:5px;background:var(--surface2)}.mg-prog i{display:block;height:100%;background:linear-gradient(90deg,#4f6ef7,#8b5cf6);transition:width .3s}',
  '.mg-body{flex:1;overflow-y:auto;padding:22px 18px 40px;display:flex;flex-direction:column;align-items:center}',
  '.mg-in{width:100%;max-width:520px}',
  '.mg-card{background:var(--surface);border:1px solid var(--border);border-radius:22px;padding:28px 20px;text-align:center;box-shadow:var(--shadow);min-height:220px;display:flex;flex-direction:column;justify-content:center;gap:10px;cursor:pointer}',
  '.mg-card .w{font-size:28px;font-weight:800;line-height:1.2}.mg-card .h{font-size:12px;color:var(--fg3)}.mg-card .pt{font-size:20px;font-weight:800;color:var(--accent)}.mg-card .ex{font-size:13px;color:var(--fg2);font-style:italic;line-height:1.5}',
  '.mg-bts{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px}',
  '.mg-bts button,.mg-btn{border:none;border-radius:14px;padding:14px;font-size:14px;font-weight:800;cursor:pointer}',
  '.mg-q{font-size:18px;font-weight:800;line-height:1.4;text-align:center;margin:6px 0 18px}',
  '.mg-opt{display:block;width:100%;text-align:left;background:var(--surface);border:1.5px solid var(--border);border-radius:14px;padding:13px 14px;font-size:14px;font-weight:600;color:var(--fg);cursor:pointer;margin-bottom:9px}',
  '.mg-opt.ok{border-color:var(--green);background:rgba(16,185,129,.12)}.mg-opt.bad{border-color:var(--red);background:rgba(239,68,68,.1)}',
  '.mg-fb{font-size:13px;line-height:1.55;color:var(--fg2);text-align:center;margin:6px 0 12px;min-height:20px}',
  '.mg-line{min-height:60px;border:2px dashed var(--border);border-radius:16px;padding:10px;display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:14px}',
  '.mg-line.ok{border-color:var(--green);border-style:solid}.mg-line.bad{border-color:var(--red);border-style:solid}',
  '.mg-bank{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:16px}',
  '.mg-chip{background:var(--surface);border:1.5px solid var(--border);border-radius:12px;padding:9px 13px;font-size:15px;font-weight:700;color:var(--fg);cursor:pointer}',
  '.mg-chip.used{visibility:hidden}',
  '.mg-end{text-align:center}.mg-end .big{font-size:60px}.mg-end .t{font-size:24px;font-weight:800;margin:6px 0}.mg-end .s{font-size:14px;color:var(--fg2);margin-bottom:20px}',
  /* menu prompts */
  '.mi-frame{width:100%;height:calc(100vh - 170px);min-height:480px;border:1px solid var(--border);border-radius:18px;background:var(--surface)}',
  /* respiro e áreas seguras (iPad, app instalado, telas com borda arredondada) */
  '.sidebar{padding-top:env(safe-area-inset-top);padding-left:env(safe-area-inset-left)}',
  '.topbar{padding-top:env(safe-area-inset-top)!important;height:calc(52px + env(safe-area-inset-top))!important;padding-right:max(22px,env(safe-area-inset-right))!important}',
  '.right-rail{padding-right:max(14px,env(safe-area-inset-right))!important;padding-bottom:max(18px,env(safe-area-inset-bottom))!important}',
  '.sidebar-footer{padding-bottom:max(10px,env(safe-area-inset-bottom))!important}',
  '@media(min-width:681px){.content{padding:28px clamp(22px,3.2vw,44px) max(40px,env(safe-area-inset-bottom))!important}.content>.pane{max-width:1000px;margin-left:auto;margin-right:auto}}',
  '@media(min-width:681px) and (max-width:1100px){.hm-row{gap:14px}.uni-grid{grid-template-columns:repeat(auto-fill,minmax(190px,1fr))}}',
  '.hm-aula .cv .capa-auto{align-items:flex-end;padding-bottom:7%}.hm-aula .cv .capa-auto span{font-size:clamp(14px,6.2cqw,52px)}',
  /* marcar aula */
  '.ag-wrap{max-width:760px}.ag-h1{font-size:24px;font-weight:800;letter-spacing:-.4px}.ag-sub{font-size:14px;color:var(--fg2);margin:4px 0 18px;line-height:1.5}',
  '.ag-box{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:18px;margin-bottom:14px;box-shadow:var(--shadow)}',
  '.ag-t{display:flex;align-items:center;gap:10px;font-size:16px;font-weight:800;margin-bottom:14px}.ag-n{width:26px;height:26px;border-radius:50%;background:var(--accent);color:#fff;font-size:13px;display:grid;place-items:center;flex:none}',
  '.ag-tipos{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px}',
  '.ag-tipo{display:flex;flex-direction:column;align-items:flex-start;gap:4px;text-align:left;background:var(--bg2,rgba(127,127,127,.06));border:2px solid transparent;border-radius:16px;padding:14px;cursor:pointer;color:var(--fg);font:inherit}',
  '.ag-tipo .ic{font-size:26px}.ag-tipo b{font-size:15px}.ag-tipo small{font-size:12px;color:var(--fg2);line-height:1.4}.ag-tipo.on{border-color:var(--accent);background:color-mix(in srgb,var(--accent) 10%,transparent)}',
  '.ag-lb{font-size:13px;font-weight:700;margin:14px 0 8px}.ag-chips,.ag-dias,.ag-horas{display:flex;flex-wrap:wrap;gap:8px}',
  '.ag-chip,.ag-dia,.ag-hora{border:1.5px solid var(--border);background:var(--surface);color:var(--fg);border-radius:999px;padding:9px 14px;font:inherit;font-size:13px;font-weight:700;cursor:pointer}',
  '.ag-chip.on,.ag-dia.on,.ag-hora.on{background:var(--accent);border-color:var(--accent);color:#fff}.ag-dias{overflow-x:auto;flex-wrap:nowrap;padding-bottom:4px;margin-bottom:12px}.ag-dia{flex:none}.ag-hora{min-width:72px}',
  '.ag-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.ag-box label{display:flex;flex-direction:column;gap:6px;font-size:13px;font-weight:700}.ag-box label span{font-weight:500;color:var(--fg3)}.ag-full{margin-top:14px}',
  '.ag-box input,.ag-box textarea{border:1.5px solid var(--border);background:var(--surface);color:var(--fg);border-radius:12px;padding:11px 12px;font:inherit;font-size:16px;font-weight:500;width:100%;box-sizing:border-box;resize:vertical}',
  '.ag-nota{font-size:12px;color:var(--fg3);margin-top:12px}.ag-vazio{font-size:14px;color:var(--fg2);margin-bottom:12px;line-height:1.5}',
  '.ag-btn{width:100%;border:none;border-radius:16px;padding:16px;font:inherit;font-size:15px;font-weight:800;color:#fff;background:linear-gradient(135deg,#4f6ef7,#8b5cf6);cursor:pointer;margin-top:4px}.ag-btn:disabled{opacity:.5;cursor:default}',
  '.ag-btn2{border:1.5px solid var(--border);background:var(--surface);color:var(--fg);border-radius:14px;padding:12px 16px;font:inherit;font-size:14px;font-weight:700;cursor:pointer;margin-top:10px}',
  '.ag-ped-l{display:flex;gap:8px;flex-wrap:wrap;font-size:14px;padding:6px 0;border-top:1px solid var(--border)}.ag-ped-l span{color:var(--fg2)}',
  '.ag-feito{text-align:center;padding:30px 20px}.ag-feito .ag-btn2{width:100%}.ag-ok-ic{font-size:44px}',
  '@media(max-width:560px){.ag-grid{grid-template-columns:1fr}.ag-tipos{grid-template-columns:1fr 1fr}}',
  /* altura real da tela (Safari do iPad esconde a parte de baixo com 100vh) */
  'html,body{height:100%;height:100dvh}.sidebar{height:100%!important;height:100dvh!important}',
  /* iPad e tablets com toque: cabeçalho mais alto e rodapé com atalhos */
  '@media(min-width:681px) and (max-width:1366px) and (pointer:coarse){'
   +'.topbar{height:calc(64px + env(safe-area-inset-top))!important}.topbar-title{font-size:17px!important}.tb-btn{min-width:44px;min-height:44px}'
   +'.nav-pill{padding:12px 12px!important;font-size:14px!important}'
   +'#mi-bnav{display:grid!important;grid-template-columns:repeat(4,1fr);position:fixed;left:230px;right:0;bottom:0;z-index:150;background:var(--sidebar);border-top:1px solid var(--border);padding:8px max(10px,env(safe-area-inset-right)) calc(8px + env(safe-area-inset-bottom)) 10px;box-shadow:0 -8px 24px rgba(0,0,0,.05)}'
   +'#mi-bnav button{background:none;border:none;color:var(--fg3);display:flex;flex-direction:column;align-items:center;gap:3px;font-size:12px;font-weight:700;padding:6px 0;min-height:48px;cursor:pointer;font-family:inherit}#mi-bnav button span{font-size:24px;line-height:1.1}#mi-bnav button.on{color:var(--accent)}#mi-bnav button[data-bn="menu"]{display:none}'
   +'.content{padding-bottom:calc(120px + env(safe-area-inset-bottom))!important}.right-rail{padding-bottom:calc(100px + env(safe-area-inset-bottom))!important}'
   +'.ai-fab{bottom:calc(92px + env(safe-area-inset-bottom))!important;right:max(18px,env(safe-area-inset-right))!important}.ai-panel{bottom:calc(158px + env(safe-area-inset-bottom))!important;max-height:calc(100dvh - 240px)!important}'
  +'}',
  /* contextos: 21 opções */
  '.mi-ctx{grid-template-columns:repeat(3,1fr)!important;gap:10px!important}.mi-ctx button{padding:14px 10px!important;border-radius:16px!important}.mi-ctx .ic{font-size:28px!important}.mi-ctx .lb{font-size:14px!important}.mi-ctx .ht{font-size:11px!important}',
  '@media(max-width:520px){.mi-ctx{grid-template-columns:1fr 1fr!important}}',
  '#pane-maratona .ctx-grid{display:flex!important;gap:8px;overflow-x:auto;padding-bottom:6px;scroll-snap-type:x proximity;-webkit-overflow-scrolling:touch}#pane-maratona .ctx-chip{flex:none;min-width:96px;max-width:110px;font-size:10.5px;padding:10px 6px;scroll-snap-align:start}',
  /* portão do diagnóstico */
  '.mi-gate-it{display:flex;align-items:center;gap:12px;border:1.5px solid var(--border);border-radius:14px;padding:12px;margin-top:8px}.mi-gate-it>span{font-size:26px}.mi-gate-it>div{flex:1;min-width:0}.mi-gate-it small{display:block;font-size:12px;color:var(--fg2)}',
  '.mi-gate-it button{background:var(--accent);color:#fff;border:none;border-radius:10px;padding:9px 14px;font:inherit;font-size:13px;font-weight:800;cursor:pointer}.mi-gate-it.ok{border-color:var(--green)}.mi-gate-it i{color:var(--green);font-style:normal;font-weight:900;font-size:18px}',
  /* modo edição */
  '.uni-card{position:relative}.mi-ctl{position:absolute;top:8px;right:8px;z-index:4;display:flex;gap:5px}.mi-ctl button{width:36px;height:36px;border-radius:50%;border:none;background:rgba(255,255,255,.95);color:#1b1f4b;font-size:14px;font-weight:800;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.25)}',
  '.mi-novo{border:2px dashed var(--accent);background:color-mix(in srgb,var(--accent) 6%,transparent);color:var(--accent);border-radius:16px;min-height:170px;font:inherit;font-size:14px;font-weight:800;cursor:pointer}',
  '.mi-off{opacity:.45}.nav-pill.mi-oculto{display:none!important}body.mi-edit .nav-pill.mi-oculto{display:flex!important;opacity:.45}.nav-pill.mi-cad:after{content:"🔒";margin-left:auto;font-size:11px;opacity:.7}',
  '.mi-mctl{margin-left:auto;display:flex;gap:2px}.mi-mctl button{width:26px;height:26px;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--fg);font-size:11px;cursor:pointer;padding:0}body.mi-edit .nav-pill .nav-badge{display:none}',
  '.mi-unovo{margin:4px 10px;width:calc(100% - 20px);border:1.5px dashed var(--accent);background:none;color:var(--accent);border-radius:12px;padding:9px;font:inherit;font-size:13px;font-weight:700;cursor:pointer}',
  '#mi-ed-btn{font-weight:800}#mi-ed-btn.on{background:var(--accent);color:#fff;border-color:var(--accent)}body.mi-edit .topbar{box-shadow:inset 0 -3px 0 var(--accent)}',
  /* ícones 3D */
  '.ic3d{width:1.3em;height:1.3em;object-fit:contain;vertical-align:-.3em;display:inline-block;user-select:none;-webkit-user-drag:none}',
  '.nav-icon{width:26px!important;font-size:16px}.nav-icon .ic3d{width:26px;height:26px;vertical-align:middle}',
  '.hm-big .ic .ic3d{width:64px;height:64px;filter:drop-shadow(0 6px 14px rgba(0,0,0,.18))}.hm-quick button span .ic3d{width:34px;height:34px}',
  '.ic3d.xl{width:52px;height:52px}.ic3d.lg{width:.9em;height:.9em;vertical-align:-.05em;margin-left:4px}.ic3d.fe{width:84px;height:84px}',
  '#mi-bnav button span .ic3d{width:28px;height:28px}#ai-fab .ic3d{width:40px;height:40px;vertical-align:middle}',
  '.right-rail a .ic3d,.right-rail button .ic3d{width:24px;height:24px;vertical-align:middle}#theme-toggle .ic3d,.topbar .tb-btn .ic3d{width:24px;height:24px;vertical-align:middle}#mi-ed-btn .ic3d{width:20px;height:20px;vertical-align:-5px}',
  '.mi-ctx .ic .ic3d{width:44px;height:44px}.ctx-chip .ce .ic3d{width:30px;height:30px;display:block;margin:0 auto 4px}#mi-festa .sb .ic3d{width:22px;height:22px}',
  /* lives: sub-abas */
  '.lv-abas{display:inline-flex;gap:4px;background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:4px;margin-bottom:16px;flex-wrap:wrap}',
  '.lv-abas button{border:none;background:none;color:var(--fg2);font:inherit;font-size:13.5px;font-weight:800;padding:9px 14px;border-radius:10px;cursor:pointer;display:flex;align-items:center;gap:7px}.lv-abas button .ic3d{width:22px;height:22px}.lv-abas button.on{background:var(--accent);color:#fff}',
  '.lv-intro{display:flex;gap:14px;align-items:center;background:linear-gradient(135deg,rgba(239,68,68,.1),rgba(139,92,246,.1));border:1px solid var(--border);border-radius:18px;padding:16px;margin-bottom:18px}.lv-intro b{display:block;font-size:15px}.lv-intro span{display:block;font-size:12.5px;color:var(--fg2);line-height:1.5;margin-top:3px}',
  '.lv-mod{font-size:12px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:var(--fg3);margin:18px 0 8px}.lv-lista{display:grid;gap:8px}',
  '.lv-aula{display:flex;align-items:center;gap:12px;background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:12px 14px}.lv-n{width:32px;height:32px;border-radius:10px;background:rgba(239,68,68,.12);color:#ef4444;font-weight:800;display:grid;place-items:center;flex:none}',
  '.lv-tx{flex:1;min-width:0}.lv-tx b{display:block;font-size:14px}.lv-tx span{display:block;font-size:12px;color:var(--fg2);margin-top:2px}',
  '.lv-bt{flex:none;border:1.5px solid var(--border);background:var(--surface);color:var(--fg);border-radius:10px;padding:8px 12px;font:inherit;font-size:12.5px;font-weight:800;cursor:pointer}.lv-bt.on{background:rgba(16,185,129,.12);border-color:#10b981;color:#10b981}',
  '.hm-uni span .ic3d{width:40px;height:40px}',
  '@media(max-width:560px){.lv-aula{flex-wrap:wrap}.lv-bt{width:100%}}',
  /* logo do Método Inteligente */
  '.mi-logo{display:inline-block;width:1em;height:1em;background:currentColor;-webkit-mask:url(img/logo-mi.svg) center/contain no-repeat;mask:url(img/logo-mi.svg) center/contain no-repeat}',
  '.mi-lg-badge{background:#000817!important;color:#fbf7ee;font-size:24px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.08)}',
  '.mi-lg-ent{font-size:34px;color:#fbf7ee;opacity:.9;display:block;margin:0 auto 10px}#mi-onb .mi-lg-ent{margin-left:0}',
  '#pane-home{position:relative}#pane-home>.mi-lg-marca{position:absolute;top:-6px;right:4px;font-size:189px;color:var(--fg);opacity:.06!important;animation:none!important;pointer-events:none;transform:rotate(-12deg);z-index:0}',
  '.mi-lg-rail{display:flex;align-items:center;justify-content:center;gap:7px;margin-top:22px;font-size:11px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;color:var(--fg3);opacity:.55}.mi-lg-rail .mi-logo{font-size:16px}',
  '.mi-lg-festa{position:absolute;right:-26px;bottom:-30px;font-size:150px;color:#fff;opacity:.09;pointer-events:none}#mi-festa .fb{overflow:hidden}',
  '@media(max-width:680px){.mi-lg-badge{font-size:20px}#pane-home>.mi-lg-marca{font-size:134px;right:-6px;top:-4px}}',
  /* cards Checklist e Lives como ícones gigantes */
  '.hm-big{min-height:176px!important;padding:22px!important;justify-content:flex-end}.hm-big .ic{position:absolute;right:-6px;top:50%;transform:translateY(-50%);margin:0!important}',
  '.hm-big .ic .ic3d{width:168px!important;height:168px!important;mix-blend-mode:multiply;filter:none!important}.hm-big .lb{font-size:22px!important;letter-spacing:-.3px;position:relative}.hm-big .pg{font-size:13px!important;opacity:1!important;position:relative;max-width:60%}',
  '.hm-check{background:linear-gradient(160deg,#f2fbf0,#d3f0d0)!important;color:#14532d!important;box-shadow:0 18px 42px rgba(34,197,94,.28),inset 0 0 0 2px rgba(255,255,255,.85)!important}',
  '.hm-check .bar{background:rgba(22,101,52,.15)!important;max-width:58%;position:relative}.hm-check .bar i{background:#16a34a!important}',
  '.hm-live,.hm-live.off{background:linear-gradient(160deg,#eef5ff,#d4e4fb)!important;color:#1e3a8a!important;box-shadow:0 18px 42px rgba(37,99,235,.25),inset 0 0 0 2px rgba(255,255,255,.85)!important}',
  '.hm-live .dot{z-index:2;background:#ef4444!important;color:#fff!important}',
  '.hm-big:hover{transform:translateY(-3px) scale(1.01)}.hm-big:active{transform:scale(.98)}',
  '@media(max-width:560px){.hm-big{min-height:150px!important;padding:16px!important}.hm-big .ic .ic3d{width:112px!important;height:112px!important}.hm-big .lb{font-size:17px!important}.hm-big .pg{max-width:100%;font-size:11.5px!important}.hm-big .ic{top:34%;right:-10px}}',
  /* ícones maiores: atalhos, universos, contextos e redes */
  '.hm-quick button span .ic3d{width:54px!important;height:54px!important}.hm-uni span .ic3d{width:58px!important;height:58px!important}',
  '.ctx-chip .ce .ic3d{width:46px!important;height:46px!important}#pane-maratona .ctx-chip{min-width:112px;max-width:124px}',
  '.right-rail a .ic3d,.right-rail button .ic3d{width:34px!important;height:34px!important}.right-rail a,.right-rail button[data-hm]{padding-top:11px!important;padding-bottom:11px!important;font-size:13px!important}',
  '.mar-task .mt-title,.mar-task-t{font-size:15px}',
  '.hm-ref .bts .ic3d{width:22px;height:22px}#mi-story .rd .ic3d{width:26px;height:26px}',
  /* menu lateral recolhível (computador e iPad) */
  '#mi-recolher{margin-left:auto;width:28px;height:28px;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--fg2);cursor:pointer;display:grid;place-items:center;font-size:18px;font-weight:800;flex:none;transition:transform .2s}',
  '.sidebar{transition:width .22s,min-width .22s}',
  '@media(min-width:681px){body.mi-mini .sidebar{width:84px!important;min-width:84px!important}body.mi-mini .logo-text,body.mi-mini .logo-sub,body.mi-mini .nav-pill>span:not(.nav-icon),body.mi-mini .nav-badge,body.mi-mini .sidebar-level,body.mi-mini .user-name,body.mi-mini .user-sub,body.mi-mini .mi-mctl,body.mi-mini .mi-unovo{display:none!important}'
   +'body.mi-mini .sidebar-logo{flex-direction:column;gap:8px;padding:16px 8px 10px}body.mi-mini #mi-recolher{margin:0}body.mi-mini #mi-recolher span{transform:rotate(180deg)}'
   +'body.mi-mini .nav-section{font-size:0;height:1px;background:var(--border);margin:10px 16px;padding:0}body.mi-mini .nav-pill{justify-content:center;padding:9px 0!important;margin:2px 10px}body.mi-mini .nav-icon,body.mi-mini .nav-icon .ic3d{width:36px!important;height:36px!important}'
   +'body.mi-mini .sidebar-footer{justify-content:center}body.mi-mini #mi-bnav{left:84px!important}}',
  '@media(max-width:680px){#mi-recolher{display:none}}',
  '.ag-tipo .ic .ic3d{width:54px;height:54px}.ag-t .ic3d{width:30px;height:30px}',
  '.th-icbtns{display:flex;gap:18px;flex-wrap:wrap;align-items:flex-start}',
  '.th-ib{all:unset;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;gap:8px;width:104px;cursor:pointer;text-align:center;color:#fff;font:inherit;-webkit-tap-highlight-color:transparent}',
  '.th-ib .ic3d{width:96px!important;height:96px!important;max-width:none!important;border-radius:25.4%;display:block;transition:transform .18s,filter .18s}',
  '.th-ib b{font-size:12.5px;line-height:1.2;font-weight:800;text-shadow:0 1px 3px rgba(0,0,0,.5)}',
  '.th-ib:hover .ic3d,.th-ib:focus-visible .ic3d{transform:scale(1.1);filter:drop-shadow(0 12px 18px rgba(0,0,0,.55))}',
  /* botão de suporte: só a imagem */
  '#ai-fab{background:transparent!important;box-shadow:none!important;width:68px!important;height:68px!important;border-radius:25.4%!important;padding:0!important;overflow:visible}#ai-fab .ic3d{width:68px!important;height:68px!important;border-radius:25.4%;transition:transform .18s,filter .18s}#ai-fab:hover{transform:none!important}#ai-fab:hover .ic3d{transform:scale(1.1);filter:drop-shadow(0 12px 16px rgba(30,40,90,.5))}',
  /* barra direita minimizável */
  '#rail-tg{position:fixed;top:84px;right:270px;z-index:40;width:26px;height:46px;border:1px solid var(--border);border-right:none;border-radius:12px 0 0 12px;background:var(--surface);color:var(--fg2);cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;box-shadow:var(--shadow);padding:0}',
  '#rail-tg:hover{color:var(--accent)}body.rail-off .right-rail{display:none!important}body.rail-off #rail-tg{right:0}',
  '@media(max-width:1000px){#rail-tg{display:none}}',

  /* ── abas em "dock": barra de vidro, rola de lado em tela pequena, aba ativa com degradê (estilo do Hub) ── */
  '.lv-abas,.mat-tabs,.mi-dock{display:flex!important;gap:6px;padding:5px;margin:0 0 18px;width:100%;max-width:100%;box-sizing:border-box;border-radius:22px;background:color-mix(in srgb,var(--surface) 72%,transparent);-webkit-backdrop-filter:blur(14px) saturate(1.4);backdrop-filter:blur(14px) saturate(1.4);border:1px solid var(--border);box-shadow:0 8px 24px -14px rgba(10,20,50,.35);overflow-x:auto;flex-wrap:nowrap!important;scroll-snap-type:x proximity;scrollbar-width:none}',
  '.lv-abas::-webkit-scrollbar,.mat-tabs::-webkit-scrollbar,.mi-dock::-webkit-scrollbar{display:none}',
  '.lv-abas button,.mat-tab,.mi-dock button{flex:1 0 auto;min-height:46px;padding:0 clamp(14px,3vw,24px);border:none!important;border-radius:17px;background:transparent;color:var(--fg2);font:inherit;font-size:clamp(12.5px,1.5vw+9px,14.5px);font-weight:800;display:flex;align-items:center;justify-content:center;gap:8px;white-space:nowrap;cursor:pointer;scroll-snap-align:center;transition:background .18s,color .18s,box-shadow .18s,transform .18s}',
  '.lv-abas button:hover,.mat-tab:hover,.mi-dock button:hover{color:var(--fg);background:color-mix(in srgb,var(--accent) 10%,transparent)}',
  '.lv-abas button.on,.mat-tab.active,.mi-dock button.on{background:linear-gradient(135deg,var(--accent),#8b5cf6)!important;color:#fff!important;box-shadow:0 8px 18px -8px color-mix(in srgb,var(--accent) 80%,transparent),inset 0 1px 0 rgba(255,255,255,.28)}',
  '.lv-abas button:active,.mat-tab:active,.mi-dock button:active{transform:scale(.97)}',
  '.th-nav{overflow-x:auto;flex-wrap:nowrap!important;scrollbar-width:none;padding-bottom:2px}.th-nav::-webkit-scrollbar{display:none}.th-nav button{flex:none;min-height:42px;padding:0 18px!important}',
  /* ── Marcar aula: caixas e alvos de toque maiores ── */
  '.ag-wrap{max-width:980px}',
  '.ag-box{padding:clamp(18px,3vw,28px);border-radius:24px;margin-bottom:18px}.ag-t{font-size:18px;margin-bottom:18px}.ag-n{width:30px;height:30px;font-size:14px}',
  '.ag-tipos{grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:14px}',
  '.ag-tipo{min-height:156px;padding:18px;gap:6px;border-radius:20px;transition:transform .15s,box-shadow .15s,border-color .15s}.ag-tipo:hover{transform:translateY(-3px);box-shadow:0 14px 26px -16px rgba(10,20,50,.55)}.ag-tipo b{font-size:17px}.ag-tipo small{font-size:13px}',
  '.ag-lb{font-size:14px;margin:20px 0 10px}.ag-chips,.ag-dias,.ag-horas{gap:10px}',
  '.ag-chip,.ag-dia,.ag-hora{min-height:46px;padding:0 18px;font-size:14px;display:inline-flex;align-items:center;justify-content:center}',
  '.ag-horas{display:grid;grid-template-columns:repeat(auto-fill,minmax(88px,1fr))}.ag-hora{min-width:0}',
  '.ag-grid{gap:14px}.ag-box input,.ag-box textarea{padding:14px;border-radius:14px}.ag-btn{padding:18px;font-size:16px;margin-top:10px}',
  '@media(min-width:700px){.ag-tipos{grid-template-columns:repeat(6,1fr)}.ag-tipo{grid-column:span 2}.ag-tipo:nth-child(n+4){grid-column:span 3}}',
  '#pane-materiais .mat-tabs{display:none!important}',
  '@media(max-width:560px){.ag-tipos{grid-template-columns:1fr 1fr;gap:10px}.ag-tipo{min-height:140px;padding:14px}.ag-tipos .ag-tipo:last-child:nth-child(odd){grid-column:1/-1;min-height:96px}.ag-grid{grid-template-columns:1fr}}',

  '#mi-onb .teste .ic .ic3d{width:48px;height:48px}.mi-gate-it>span .ic3d{width:34px;height:34px}.ag-btn .ic3d,.ag-btn2 .ic3d,.set-btn .ic3d{width:22px;height:22px;vertical-align:-5px}',
  '.mi-ini-ent{display:flex;flex-direction:column;gap:8px;max-width:460px;margin:0 auto 18px;text-align:left}.mi-ini-ent .it{display:flex;align-items:center;gap:12px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);border-radius:14px;padding:11px 13px}',
  '.mi-ini-ent .it>span{font-size:22px;width:34px;text-align:center;flex:none}.mi-ini-ent .it .ic3d{width:34px;height:34px}.mi-ini-ent b{display:block;font-size:13.5px}.mi-ini-ent small{font-size:12px;opacity:.75}.mi-ini-ent .it.idi{background:rgba(14,165,233,.18);border-color:rgba(14,165,233,.45)}',
  '.mi-ini-ent .pr{height:6px;border-radius:9px;background:rgba(255,255,255,.12);overflow:hidden;margin-top:6px}.mi-ini-ent .pr i{display:block;height:100%;background:#10b981}.mi-ini-ent .prt{font-size:11.5px;opacity:.7;text-align:center}',
  '.tg.free{background:linear-gradient(135deg,#bef264,#22c55e)!important;color:#052e12!important;font-weight:900!important;box-shadow:0 0 0 2px rgba(190,242,100,.45),0 6px 18px rgba(34,197,94,.5);animation:miFree 2.6s ease-in-out infinite}',
  '@keyframes miFree{0%,100%{box-shadow:0 0 0 2px rgba(190,242,100,.45),0 6px 18px rgba(34,197,94,.45)}50%{box-shadow:0 0 0 5px rgba(190,242,100,.2),0 6px 26px rgba(34,197,94,.75)}}',
  '.uni-card.free{border-color:rgba(34,197,94,.6)!important;box-shadow:0 0 0 1px rgba(34,197,94,.35),0 10px 28px rgba(34,197,94,.14)!important}',
  '.uni-card .th{position:relative}.uni-card .selo{position:absolute;left:8px;bottom:8px;width:30px;height:30px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,.3)}.uni-card .selo img{width:22px;height:22px;display:block}',
  '.lv-cd{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap}.lv-cd span{display:flex;flex-direction:column;align-items:center;min-width:46px;padding:6px 4px;border-radius:10px;background:rgba(79,110,247,.1);font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--fg2)}.lv-cd b{font-size:17px;color:var(--fg);letter-spacing:0;font-variant-numeric:tabular-nums}.lv-cd .ag{background:#ef4444;color:#fff;padding:8px 12px;font-size:12px}',
  '.th-prox{position:relative;margin:0 0 16px}.th-prox>span{font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#ff9aa5}.th-cult .lv-cd span{background:rgba(255,255,255,.1);color:rgba(255,255,255,.75)}.th-cult .lv-cd b{color:#fff}',
  '.mg-img{font-size:96px;text-align:center;margin:6px 0 14px;line-height:1.1}.mg-som{display:block;margin:0 auto 14px;border:none;border-radius:99px;padding:10px 18px;font:inherit;font-weight:800;background:rgba(14,165,233,.15);color:#0ea5e9;cursor:pointer}',
  '.mg-emos{display:grid;grid-template-columns:1fr 1fr;gap:10px}.mg-opt.mg-emo{font-size:54px;padding:14px 0;text-align:center;margin:0}',
  '.pl-promo{display:inline-block;align-self:flex-start;background:#111;color:#fde047;font-size:10.5px;font-weight:900;letter-spacing:.06em;text-transform:uppercase;padding:4px 9px;border-radius:7px;margin-top:6px}.pl-de{font-size:12.5px;color:var(--fg3);text-decoration:line-through;margin-top:4px}.pl-promo+.pl-de+.pl-pr{margin-top:0}',
  '.pl-aviso{display:flex;gap:12px;align-items:flex-start;margin:18px 0 0;padding:14px 16px;border-radius:16px;background:rgba(245,158,11,.1);border:1px solid rgba(245,158,11,.35);font-size:13px;line-height:1.55}.pl-aviso .ic3d{width:30px;height:30px;flex:none}',
  '.in-hero{text-align:center;max-width:560px;margin:4px auto 18px}.in-k{font-size:11px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;color:#16a34a}.in-hero h1{font-family:Advercase,"Archivo Black",sans-serif;font-size:clamp(24px,4vw,34px);line-height:1.15;margin:8px 0;text-wrap:balance}.in-hero h1 span{color:#16a34a}.in-hero p{font-size:14px;color:var(--fg2);margin:0}',
  '.in-trilha{display:flex;flex-direction:column;gap:0;max-width:520px;margin:0 auto;position:relative}',
  '.in-passo{display:flex;gap:14px;align-items:flex-start;position:relative;padding-bottom:16px}.in-passo:not(:last-child):before{content:"";position:absolute;left:21px;top:44px;bottom:0;width:3px;border-radius:3px;background:var(--border)}.in-passo.ok:not(:last-child):before{background:#22c55e}',
  '.in-passo .bola{width:44px;height:44px;flex:none;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:16px;background:var(--surface2,rgba(127,127,127,.12));color:var(--fg2);border:2px solid var(--border)}',
  '.in-passo.premio .bola{border-color:#f59e0b;color:#b45309;background:rgba(245,158,11,.12)}.in-passo.ok .bola{background:#22c55e;border-color:#22c55e;color:#fff}.in-passo.prox .bola{box-shadow:0 0 0 6px rgba(34,197,94,.18)}',
  '.in-tx{display:flex;flex-direction:column;gap:2px;padding-top:4px}.in-tx b{font-size:14.5px}.in-tx small{font-size:12.5px;color:var(--fg2)}.in-tx em{font-style:normal;font-size:12px;font-weight:800;color:#16a34a}',
  '.in-status{max-width:520px;margin:6px auto 14px;text-align:center;font-size:13.5px;color:var(--fg2)}',
  '.in-cupom{max-width:520px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;border-radius:16px;border:2px dashed #22c55e;background:rgba(34,197,94,.07)}.in-cupom div{display:flex;flex-direction:column;gap:2px;min-width:0}.in-cupom small{font-size:10.5px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#16a34a}.in-cupom b#in-cod{font-size:22px;letter-spacing:.06em;word-break:break-all}.in-cupom span{font-size:12px;color:var(--fg2)}',
  '.in-cupom button{border:none;border-radius:11px;padding:10px 14px;font:inherit;font-weight:800;background:#16a34a;color:#fff;cursor:pointer;flex:none}',
  '#pane-indicar>.pl-btn{max-width:520px;margin-left:auto;margin-right:auto}.in-como{max-width:520px;margin:16px auto 0;font-size:13px;line-height:1.6;color:var(--fg2)}.in-como b{color:var(--fg)}.in-como ol{margin:6px 0 0;padding-left:20px}',
  '.in-adm{max-width:620px;margin:22px auto 0;padding:14px;border-radius:16px;border:1px solid var(--border);display:flex;flex-direction:column;gap:8px}.in-adm small{font-size:12px;color:var(--fg2)}.in-adm-f{display:grid;grid-template-columns:1fr 1fr;gap:8px}.in-adm-f input{border:1px solid var(--border);border-radius:10px;padding:9px;background:transparent;color:var(--fg);font:inherit;font-size:13px;min-width:0}',
  '.in-adm-f button{border:none;border-radius:10px;background:#16a34a;color:#fff;font:inherit;font-weight:800;cursor:pointer}.in-adm-l{display:flex;flex-direction:column;gap:4px;font-size:12.5px}.in-adm-l div{display:flex;justify-content:space-between;gap:8px;align-items:center;padding:6px 8px;border-radius:8px;background:rgba(127,127,127,.06)}.in-adm-l button{border:none;background:none;color:#ef4444;cursor:pointer;font-weight:800}',
  '@media(max-width:680px){.in-adm-f{grid-template-columns:1fr}.in-adm-f button{padding:11px}}',
  '@media(max-width:680px){#modules-grid.module-grid{grid-template-columns:1fr!important;gap:8px}#modules-grid .module-card{display:flex;align-items:center;gap:0;border-radius:14px}#modules-grid .mod-thumb{width:118px!important;flex:none;height:auto!important;aspect-ratio:16/9}#modules-grid .mod-body{padding:8px 12px;min-width:0}#modules-grid .mod-name{font-size:13.5px;margin-bottom:2px}#modules-grid .mod-sub{font-size:11.5px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}#modules-grid .mod-tag-ok,#modules-grid .mod-lock-tag{margin-top:4px}}',
  '.hm-mes{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:2px 0 14px;padding:9px 12px;border-radius:12px;border:1px solid var(--border);opacity:.85}.hm-mes-t{display:flex;flex-direction:column;gap:1px;min-width:150px;flex:1}.hm-mes-t b{font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--fg3)}.hm-mes-t span{font-size:11.5px;color:var(--fg2)}',
  '.hm-mes-b{display:flex;flex-wrap:wrap;gap:4px;max-width:260px}.hm-mes-b i{width:8px;height:8px;border-radius:50%;display:block}.hm-mes-b .g{background:#22c55e}.hm-mes-b .y{background:#f59e0b}.hm-mes-b .r{background:#ef4444;opacity:.75}.hm-mes-b .n{background:transparent;border:1.5px solid var(--fg3)}.hm-mes-b .hj{outline:2px solid rgba(79,110,247,.45);outline-offset:1px}',
  '.of-box{position:relative;text-align:left;max-width:420px;max-height:88vh;overflow:auto}.of-x{position:absolute;top:10px;right:10px;border:none;background:rgba(127,127,127,.15);width:32px;height:32px;border-radius:50%;cursor:pointer;color:var(--fg)}',
  '.of-img{width:100%;max-height:170px;object-fit:cover;border-radius:14px;margin-bottom:12px}.of-k{font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--pc)}.of-t{font-size:20px;font-weight:800;margin:4px 0 2px}.of-s{font-size:13px;color:var(--fg2)}.of-p{font-size:26px;font-weight:900;color:var(--pc);margin:6px 0 2px}',
  '.of-l{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:var(--fg3);margin:14px 0 8px}.of-box ul{list-style:none;padding:0;margin:0 0 16px;display:flex;flex-direction:column;gap:7px}.of-box li{font-size:13.5px;padding-left:22px;position:relative;line-height:1.4}.of-box li:before{content:"✓";position:absolute;left:0;color:var(--pc);font-weight:900}',
  '.of-alt{display:block;width:100%;margin-top:8px;border:1px solid var(--border);background:transparent;color:var(--fg);border-radius:14px;padding:11px;font:inherit;font-weight:700;cursor:pointer}.of-f{font-size:11.5px;color:var(--fg3);text-align:center;margin-top:10px}',
  '.mi-troca{flex:none;display:flex;flex-direction:column;align-items:center;gap:0;border:1px solid var(--border);background:transparent;color:var(--fg2);border-radius:10px;padding:4px 7px;font-size:15px;cursor:pointer;margin-left:auto;line-height:1.1}.mi-troca small{font-size:9px;font-weight:800;color:var(--fg3)}.mi-troca:active{transform:rotate(-30deg)}',
  '#mi-inicio{display:flex;flex-direction:column;gap:10px;margin:4px 0 14px}.mi-ini{display:flex;align-items:center;gap:14px;flex-wrap:wrap;border-radius:18px;padding:14px 16px;border:1px solid var(--border)}',
  '.mi-ini .tx{flex:1;min-width:200px;display:flex;flex-direction:column;gap:3px}.mi-ini b{font-size:14px}.mi-ini span{font-size:12.5px;color:var(--fg2);line-height:1.5}.mi-ini .ic .ic3d{width:52px;height:52px}',
  '.mi-ini.idi{background:linear-gradient(135deg,rgba(14,165,233,.12),rgba(79,110,247,.08));border-color:rgba(14,165,233,.35)}.mi-ini .bt{display:flex;gap:8px}',
  '.mi-ini .bt button{border:1px solid var(--border);background:var(--bg2,transparent);color:var(--fg);border-radius:12px;padding:9px 13px;font:inherit;font-size:12.5px;font-weight:800;cursor:pointer}.mi-ini .bt .ok{background:#0ea5e9;border-color:#0ea5e9;color:#fff}',
  '.mi-ini.beg{background:rgba(16,185,129,.08);border-color:rgba(16,185,129,.3)}.mi-ini .bar{flex-basis:100%;height:6px;border-radius:9px;background:rgba(16,185,129,.15);overflow:hidden}.mi-ini .bar i{display:block;height:100%;background:#10b981;border-radius:9px}',
  'body.mi-beg #pane-maratona .mar-hero,body.mi-beg #pane-maratona .ctx-grid{display:none!important}',
  '.pl-top{text-align:center;max-width:620px;margin:6px auto 22px}.pl-k{font-size:11px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;color:#d4a017}.pl-top h1{font-family:Advercase,"Archivo Black",sans-serif;font-size:clamp(26px,4vw,38px);margin:8px 0;text-wrap:balance}.pl-top p{font-size:14px;color:var(--fg2);line-height:1.6;margin:0 0 12px}',
  '.pl-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px;align-items:stretch}',
  '.pl-card{position:relative;display:flex;flex-direction:column;gap:6px;border-radius:22px;padding:22px 18px 18px;background:var(--card,var(--bg2));border:1px solid var(--border);border-top:4px solid var(--pc)}',
  '.pl-card.dest{background:linear-gradient(180deg,rgba(212,160,23,.12),transparent 60%),var(--card,var(--bg2));border-color:rgba(212,160,23,.55);box-shadow:0 16px 40px rgba(212,160,23,.18)}.pl-card.atual{outline:2px solid var(--pc);outline-offset:2px}',
  '.pl-rib{position:absolute;top:-11px;right:16px;background:#d4a017;color:#1a1405;font-size:10.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:4px 10px;border-radius:99px}',
  '.pl-nm{font-size:17px;font-weight:800;display:flex;align-items:center;gap:6px}.pl-nm .ic3d{width:26px;height:26px}.pl-sub{font-size:12.5px;color:var(--fg2)}.pl-pr{font-size:24px;font-weight:800;color:var(--pc);margin:6px 0 4px}',
  '.pl-card ul{list-style:none;padding:0;margin:0 0 12px;display:flex;flex-direction:column;gap:7px;flex:1}.pl-card li{font-size:13px;line-height:1.4;padding-left:22px;position:relative}.pl-card li:before{content:"✓";position:absolute;left:0;color:var(--pc);font-weight:800}',
  '.pl-btn{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;border:none;border-radius:14px;padding:12px;font:inherit;font-size:13.5px;font-weight:800;cursor:pointer;background:var(--pc);color:#fff;text-decoration:none}.pl-btn .ic3d{width:20px;height:20px}',
  '.pl-ok{text-align:center;font-weight:800;font-size:13px;color:var(--pc);padding:11px;border-radius:14px;background:rgba(127,127,127,.08)}.pl-ok.sub{color:var(--fg3);font-weight:700}',
  '.pl-inst{display:flex;align-items:center;gap:8px;margin-bottom:8px;font-size:12.5px}.pl-inst input{width:80px;border:1px solid var(--border);border-radius:10px;padding:7px 9px;background:transparent;color:var(--fg);font:inherit}',
  '.pl-pr.vazio{font-size:15px;opacity:.8}.pl-foot{text-align:center;font-size:12px;color:var(--fg3);margin-top:18px}',
  '.pl-ed{border:1px solid var(--border);border-radius:14px;padding:12px;margin-bottom:10px;display:flex;flex-direction:column;gap:7px}.pl-ed label{display:flex;flex-direction:column;gap:3px;font-size:11.5px;color:var(--fg2)}.pl-ed label.ck{flex-direction:row;align-items:center;gap:6px}',
  '.pl-ed input:not([type=checkbox]),.pl-ed textarea{border:1px solid var(--border);border-radius:9px;padding:7px 9px;background:transparent;color:var(--fg);font:inherit;font-size:13px}',
  /* ===== tema English on Mission (verde-escuro e dourado) ===== */
  '.content>#pane-eom{max-width:1560px!important}#pane-eom{--th-g1:#0b2018;--th-g2:#123629;--th-gold:#d4b25c;--th-gold2:#f3e2a8;background:radial-gradient(ellipse at 80% -10%,rgba(212,178,92,.18),transparent 55%),linear-gradient(180deg,#0e271d,#08160f);border:1px solid rgba(212,178,92,.25);border-radius:26px;padding:22px 22px 30px!important;color:#f5efe0}',
  '#pane-eom .uni-sec{font-family:"Cormorant Garamond",Georgia,serif;font-size:22px;font-weight:700;letter-spacing:.02em;text-transform:none;color:var(--th-gold2);margin:30px 0 12px;display:flex;align-items:center;gap:12px;scroll-margin-top:80px}#pane-eom .uni-sec:after{content:"";flex:1;height:1px;background:linear-gradient(90deg,rgba(212,178,92,.6),transparent)}',
  '#pane-eom .uni-card{background:linear-gradient(180deg,#143a2b,#0f2c21);border:1px solid rgba(212,178,92,.22);box-shadow:0 10px 30px rgba(0,0,0,.35)}#pane-eom .uni-card:hover{border-color:var(--th-gold);transform:translateY(-3px)}',
  '#pane-eom .uni-card .tt{color:#fbf5e4;font-size:14px}#pane-eom .uni-card .ss{color:rgba(245,239,224,.7)}#pane-eom .uni-card .ac{color:var(--th-gold)}#pane-eom .uni-card .th{background:#0b2018}',
  '#pane-eom .uni-card .tg{background:var(--th-gold);color:#14261c}#pane-eom .uni-card.soon .tg{background:rgba(212,178,92,.25);color:var(--th-gold2)}#pane-eom .uni-hero{background:linear-gradient(135deg,#1b4a36,#0f2c21)!important;border:1px solid rgba(212,178,92,.35)}#pane-eom .admin-loading,#pane-eom div[style*="color:var(--fg3)"]{color:rgba(245,239,224,.6)!important}',
  '.th-hero{position:relative;overflow:hidden;border-radius:20px;padding:30px 26px 20px;margin-bottom:8px}',
  '.th-eom{background:linear-gradient(160deg,rgba(212,178,92,.12),rgba(0,0,0,0) 60%);border:1px solid rgba(212,178,92,.3)}',
  '.th-eom .th-marca{position:absolute;right:-30px;top:-20px;font-size:230px;color:#d4b25c;opacity:.08;transform:rotate(-14deg);pointer-events:none}',
  '.th-k{font-size:11px;font-weight:800;letter-spacing:.24em;text-transform:uppercase;color:var(--th-gold,#e11d2e);margin-bottom:10px;position:relative}',
  '.th-eom h1{font-family:"Cormorant Garamond",Georgia,serif;font-weight:700;font-size:clamp(30px,4.6vw,46px);line-height:1.05;margin:0 0 12px;color:#fbf5e4;position:relative;max-width:640px}.th-eom h1 em{color:var(--th-gold);font-style:italic}',
  '.th-hero p{font-size:14.5px;line-height:1.6;max-width:560px;margin:0 0 14px;position:relative;opacity:.85}',
  '.th-ver{font-family:"Cormorant Garamond",Georgia,serif;font-style:italic;font-size:18px;color:var(--th-gold2);border-left:2px solid var(--th-gold);padding-left:12px;margin:0 0 18px;max-width:560px;position:relative}.th-ver b{display:block;margin:4px 0 0!important;font-style:normal;font-family:"Plus Jakarta Sans",sans-serif;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--th-gold);margin-left:6px}',
  '.th-cta{display:flex;gap:10px;flex-wrap:wrap;position:relative}.th-cta .ic3d{width:22px;height:22px;vertical-align:-5px}',
  '.th-b1,.th-b2{border:none;border-radius:14px;padding:13px 18px;font:inherit;font-size:14px;font-weight:800;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:8px}',
  '.th-sau{display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px;color:#f3e2a8;font-size:15px}.th-sau b{color:#fff}.th-sau .th-selo{width:20px;height:20px;flex:none}.th-sau small{width:100%;opacity:.75;font-size:12.5px;margin-top:-2px}.th-eom .th-b1{background:linear-gradient(135deg,#f3e2a8,#d4b25c);color:#14261c}.th-eom .th-b2{background:rgba(255,255,255,.08);color:#fbf5e4;border:1px solid rgba(212,178,92,.4)}.th-ok{color:var(--th-gold2);font-weight:800;font-size:14px;padding:12px 0}',
  '.th-nav{display:flex;gap:8px;flex-wrap:wrap;margin-top:20px;position:relative}.th-nav button{border-radius:99px;padding:8px 14px;font:inherit;font-size:12.5px;font-weight:800;cursor:pointer}',
  '.th-eom .th-nav button{background:rgba(212,178,92,.12);color:var(--th-gold2);border:1px solid rgba(212,178,92,.35)}',
  /* ===== tema Culture English (azul e vermelho) ===== */
  '#pane-culture{--th-red:#e3263a;--th-blue:#2f6bff;background:radial-gradient(ellipse at 0% 0%,rgba(47,107,255,.28),transparent 50%),radial-gradient(ellipse at 100% 10%,rgba(227,38,58,.24),transparent 50%),linear-gradient(180deg,#0b1128,#07091a);border:1px solid rgba(47,107,255,.25);border-radius:26px;padding:22px 22px 30px!important;color:#eef2ff}',
  '#pane-culture .uni-sec{font-family:Advercase,"Archivo Black",sans-serif;font-weight:700;font-size:20px;letter-spacing:.04em;color:#fff;margin:30px 0 12px;display:flex;align-items:center;gap:12px;scroll-margin-top:80px}#pane-culture .uni-sec:before{content:"";width:10px;height:22px;border-radius:3px;background:linear-gradient(180deg,var(--th-red),var(--th-blue))}',
  '#pane-culture .uni-card{background:linear-gradient(180deg,#121a3a,#0d1330);border:1px solid rgba(47,107,255,.22);box-shadow:0 10px 30px rgba(0,0,0,.4)}#pane-culture .uni-card:hover{border-color:var(--th-red);transform:translateY(-3px);box-shadow:0 14px 36px rgba(227,38,58,.25)}',
  '#pane-culture .uni-card .tt{color:#fff;font-size:14px}#pane-culture .uni-card .ss{color:rgba(238,242,255,.7)}#pane-culture .uni-card .ac{color:#ff6b7a}#pane-culture .uni-card .tg{background:var(--th-red);color:#fff}#pane-culture .uni-card.soon .tg{background:var(--th-blue)}',
  '#pane-culture .uni-hero{background:linear-gradient(135deg,#1d3fb8,#e3263a)!important}#pane-culture .admin-loading,#pane-culture div[style*="color:var(--fg3)"]{color:rgba(238,242,255,.6)!important}',
  '.th-cult{background:linear-gradient(120deg,rgba(47,107,255,.25),rgba(227,38,58,.22));border:1px solid rgba(255,255,255,.08);padding-top:40px;padding-bottom:40px}',
  '.th-cult .th-k{color:#ff6b7a}.th-cult h1{font-family:Advercase,"Archivo Black",sans-serif;font-weight:700;font-size:clamp(34px,6vw,64px);line-height:.95;margin:0 0 12px;color:#fff;position:relative;letter-spacing:.01em}.th-cult h1 span{color:var(--th-red);text-shadow:0 0 30px rgba(227,38,58,.55)}',
  '.th-cult .th-b1{background:var(--th-red);color:#fff;box-shadow:0 10px 26px rgba(227,38,58,.35)}.th-cult .th-b2{background:var(--th-blue);color:#fff}',
  '.th-cult .th-nav button{background:rgba(255,255,255,.08);color:#fff;border:1px solid rgba(255,255,255,.18)}.th-cult .th-nav button:hover{border-color:var(--th-red)}',
  '.th-film{position:absolute;left:0;right:0;top:0;height:16px;background:repeating-linear-gradient(90deg,transparent 0 10px,rgba(255,255,255,.18) 10px 22px);opacity:.8}.th-film.b{top:auto;bottom:0}',
  '@media(max-width:680px){#pane-eom,#pane-culture{padding:14px 12px 24px!important;border-radius:20px}.th-hero{padding:24px 16px 16px}.th-cult{padding-top:30px;padding-bottom:30px}}',
  /* celular: menu de baixo + gaveta */
  '#mi-bnav,#mi-shade{display:none}',
  '@media(max-width:680px){',
  ' .sidebar{position:fixed!important;top:0;bottom:0;left:-280px;width:262px!important;min-width:262px!important;z-index:960;transition:left .25s cubic-bezier(.22,1,.36,1);box-shadow:0 0 40px rgba(0,0,0,.35)}',
  ' .sidebar.mi-open{left:0}',
  ' .sidebar .logo-text,.sidebar .logo-sub,.sidebar .user-name,.sidebar .user-sub{display:block!important}',
  ' .sidebar .nav-section{display:block!important}.sidebar .sidebar-level{display:block!important}',
  ' .sidebar .nav-pill span:not(.nav-icon){display:inline!important}.sidebar .nav-badge{display:inline-block!important}',
  ' .sidebar .nav-pill{justify-content:flex-start!important;padding:11px 12px!important;margin:1px 10px!important}',
  ' .sidebar .user-chip{justify-content:flex-start!important}',
  ' #mi-shade{display:block;position:fixed;inset:0;background:rgba(5,8,20,.5);z-index:950;opacity:0;pointer-events:none;transition:opacity .25s}',
  ' #mi-shade.on{opacity:1;pointer-events:auto}',
  ' #mi-bnav{display:grid;grid-template-columns:repeat(5,1fr);position:fixed;left:0;right:0;bottom:0;z-index:150;background:var(--sidebar);border-top:1px solid var(--border);padding:6px 4px calc(6px + env(safe-area-inset-bottom))}',
  ' #mi-bnav button{background:none;border:none;color:var(--fg3);display:flex;flex-direction:column;align-items:center;gap:2px;font-size:10px;font-weight:700;padding:4px 0;cursor:pointer}',
  ' #mi-bnav button span{font-size:21px;line-height:1.1}',
  ' #mi-bnav button.on{color:var(--accent)}',
  ' .content{padding:16px max(16px,env(safe-area-inset-right)) calc(96px + env(safe-area-inset-bottom)) max(16px,env(safe-area-inset-left))!important}',
  ' .topbar{padding-left:max(16px,env(safe-area-inset-left))!important;padding-right:max(16px,env(safe-area-inset-right))!important}',
  ' body:has(.modal-overlay.open) .ai-fab,body:has(.sheet-overlay.open) .ai-fab,body:has(#mi-game.on) .ai-fab,body:has(#mi-entry.on) .ai-fab,body:has(.modal-overlay.open) #mi-bnav,body:has(.sheet-overlay.open) #mi-bnav,body:has(#mi-game.on) #mi-bnav,body:has(.pw-ov.open) #mi-bnav,body:has(.ai-panel.open) .ai-fab{display:none}',
  ' .ai-fab{bottom:calc(78px + env(safe-area-inset-bottom))!important;right:14px!important;width:50px!important;height:50px!important}',
  ' .ai-panel{bottom:calc(136px + env(safe-area-inset-bottom))!important;right:12px!important}',
  ' #toast-global{bottom:calc(84px + env(safe-area-inset-bottom))!important}',
  '}',
  /* a imagem do ícone É o botão: sem moldura extra em volta */
  '.topbar .tb-btn,.topbar .tb-theme-btn{background:none!important;border:0!important;padding:0!important;box-shadow:none!important;line-height:0;border-radius:14px;min-width:0!important;min-height:0!important;transition:transform .22s cubic-bezier(.34,1.56,.64,1)}',
  '.topbar .tb-btn:hover,.topbar .tb-theme-btn:hover,.topbar .tb-btn:focus-visible,.topbar .tb-theme-btn:focus-visible{outline:none;transform:scale(1.14);filter:drop-shadow(0 6px 8px rgba(0,0,0,.45))}.topbar .tb-btn:active,.topbar .tb-theme-btn:active{transform:scale(.92)}',
  '.topbar .tb-btn .ic3d,.topbar .tb-theme-btn .ic3d{width:40px!important;height:40px!important;vertical-align:0;filter:drop-shadow(0 4px 8px rgba(0,0,0,.28))}',
  '.tb-tile{position:relative;display:inline-block;width:44px;height:44px;line-height:0}.tb-tile .ic3d{width:100%!important;height:100%!important}',
  '.tb-tile b{position:absolute;left:0;right:0;bottom:0;border-radius:0 0 13px 13px;padding:7px 0 3px;font-size:9px;line-height:1;font-weight:800;color:#fff;text-align:center;background:linear-gradient(to top,var(--c) 0%,var(--c) 40%,rgba(0,0,0,0));background:linear-gradient(to top,color-mix(in srgb,var(--c) 96%,transparent),color-mix(in srgb,var(--c) 80%,transparent) 45%,transparent)}',
  '#mi-ed-btn.on{background:none!important}#mi-ed-btn.on .tb-tile{filter:drop-shadow(0 0 10px var(--accent));border-radius:16px;box-shadow:0 0 0 2px var(--accent)}',
  '.topbar .tb-btn .notif-dot{top:2px;right:2px}',
  '.hm-quick{grid-template-columns:repeat(4,minmax(0,150px))!important;justify-content:start}',
  '.hm-quick button{position:relative;aspect-ratio:1/1;padding:0!important;border:0!important;background:none!important;box-shadow:none!important;border-radius:22px!important;overflow:hidden;transition:transform .25s cubic-bezier(.34,1.56,.64,1)}',
  '.hm-quick button:hover,.hm-quick button:focus-visible{outline:none;transform:scale(1.08);z-index:2;box-shadow:0 20px 40px rgba(0,0,0,.45),0 6px 14px rgba(0,0,0,.3)}.hm-quick button:active{transform:scale(.96)}',
  '.hm-quick button>span{position:absolute;inset:0;display:block;font-size:0!important}.hm-quick button>span .ic3d{width:100%!important;height:100%!important;object-fit:cover;filter:drop-shadow(0 6px 12px rgba(0,0,0,.2))}',
  '.hm-quick button>i,.hm-uni>b{position:absolute;left:0;right:0;bottom:0;padding:22px 6px 9px;font-style:normal;font-size:12.5px;font-weight:800;line-height:1.15;color:#fff;text-align:center;background:linear-gradient(to top,var(--c) 0%,var(--c) 35%,rgba(0,0,0,0));background:linear-gradient(to top,color-mix(in srgb,var(--c) 94%,transparent),color-mix(in srgb,var(--c) 78%,transparent) 50%,transparent)}',
  '.hm-unis{grid-template-columns:repeat(3,minmax(0,170px))!important;justify-content:start}',
  '.hm-uni{position:relative;aspect-ratio:1/1;min-height:0!important;padding:0!important;background:none!important;box-shadow:none!important;border-radius:22px!important;overflow:hidden;transition:transform .25s cubic-bezier(.34,1.56,.64,1)}',
  '.hm-uni:hover,.hm-uni:focus-visible{outline:none;transform:scale(1.08);z-index:2;box-shadow:0 20px 40px rgba(0,0,0,.45),0 6px 14px rgba(0,0,0,.3)}.hm-uni:active{transform:scale(.96)}',
  '.hm-uni>span{position:absolute;inset:0;display:block;font-size:0!important}.hm-uni>span .ic3d{width:100%!important;height:100%!important;object-fit:cover}',
  '.hm-uni[data-hm="eom"]{--c:#15281f}.hm-uni[data-hm="culture"]{--c:#1b2a6b}.hm-uni[data-hm="viagens"]{--c:#0c4a6e}',
  '@media(max-width:560px){.hm-quick{grid-template-columns:repeat(4,1fr)!important}.hm-unis{grid-template-columns:repeat(3,1fr)!important}.hm-quick button>i,.hm-uni>b{font-size:10.5px;padding:16px 3px 6px}}',
  '.nv-ov{position:fixed;inset:0;z-index:9500;background:rgba(8,12,28,.62);backdrop-filter:blur(4px);display:none;align-items:flex-end;justify-content:center}.nv-ov.on{display:flex}@media(min-width:700px){.nv-ov{align-items:center}}',
  '.nv-fo{--c:#4f6ef7;width:100%;max-width:640px;max-height:92vh;overflow:auto;background:var(--surface);color:var(--fg);border-radius:26px 26px 0 0;padding:18px 20px 26px}@media(min-width:700px){.nv-fo{border-radius:26px}}',
  '.nv-x{float:right;border:0;background:var(--surface2);color:var(--fg);width:38px;height:38px;border-radius:50%;font-size:16px;cursor:pointer}.nv-top{font-size:12px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--fg2);padding-top:10px}',
  '.nv-tabs{display:flex;gap:6px;margin:12px 0 14px;overflow-x:auto;padding-bottom:4px;clear:both}.nv-tabs button{--c:#4f6ef7;flex:1;min-width:48px;min-height:42px;border-radius:12px;border:2px solid color-mix(in srgb,var(--c) 40%,transparent);background:color-mix(in srgb,var(--c) 10%,var(--surface));color:var(--fg);font:inherit;font-weight:800;cursor:pointer}.nv-tabs button.on{background:var(--c);border-color:var(--c);color:#fff;box-shadow:0 8px 18px -8px var(--c)}',
  '.nv-hero{display:flex;align-items:center;gap:14px;padding:14px;border-radius:18px;background:linear-gradient(135deg,color-mix(in srgb,var(--c) 22%,var(--surface)),color-mix(in srgb,var(--c) 6%,var(--surface)));border:1.5px solid color-mix(in srgb,var(--c) 50%,transparent)}',
  '.nv-big{width:64px;height:64px;border-radius:18px;background:var(--c);color:#fff;font-size:28px;font-weight:900;display:grid;place-items:center;flex:none}.nv-hero b{display:block;font-size:20px}.nv-hero span{font-size:12.5px;color:var(--fg2)}',
  '.nv-res{font-size:14px;line-height:1.6;color:var(--fg);margin:12px 0}.nv-sec{font-size:12px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--c);margin:18px 0 8px}.nv-no{color:#e11d48}.nv-go{color:#16a34a}',
  '.nv-it{display:flex;gap:12px;align-items:flex-start;padding:11px 12px;border-radius:14px;background:var(--surface2);margin-bottom:7px}.nv-e{flex:none;width:5px;align-self:stretch;border-radius:9px;background:var(--c)}.nv-it b{display:block;font-size:13.5px}.nv-it span{font-size:13px;color:var(--fg2);line-height:1.5}',
  '.nv-ul{margin:0;padding-left:20px;font-size:13.5px;line-height:1.7;color:var(--fg2)}.nv-eu{margin-top:14px;padding:11px;border-radius:12px;background:color-mix(in srgb,var(--c) 14%,transparent);text-align:center;font-weight:800;color:var(--c)}.nv-foot{font-size:11.5px;color:var(--fg3);line-height:1.5;margin:14px 0 0}',
  /* icones dos universos/atalhos: corta a margem transparente e iguala o arredondamento, pra faixa do nome ficar alinhada */
  '.hm-quick button,.hm-uni{border-radius:24%!important}.hm-quick button>span .ic3d,.hm-uni>span .ic3d{transform:scale(1.07);filter:none!important}',
  /* planos: titulo largo e cards numa linha so no PC */
  '#pane-planos .pl-top{display:block!important;max-width:none!important;width:100%;text-align:center}#pane-planos .pl-top h1{display:block;max-width:none!important;width:100%;margin:8px 0!important;white-space:normal}#pane-planos .pl-top .pl-k{display:block;margin-bottom:4px}#pane-planos .pl-top p{max-width:820px;margin-left:auto;margin-right:auto}',
  '@media(min-width:1100px){#pane-planos .pl-grid{grid-template-columns:repeat(5,minmax(0,1fr));gap:12px}#pane-planos .pl-card{padding:20px 14px 16px}#pane-planos .pl-nm{font-size:15.5px}#pane-planos .pl-pr{font-size:21px}#pane-planos .pl-card li{font-size:12.5px}}',
  '@media(min-width:760px) and (max-width:1099px){#pane-planos .pl-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}',
  /* início: checklist com borda verde fina, brilho que pulsa de leve e o tick balançando; selo da live com contagem */
  '.hm-check::after{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:1;box-shadow:inset 0 0 0 1.5px rgba(34,197,94,.95),inset 0 0 26px rgba(34,197,94,.32);animation:miGlowVerde 3.6s ease-in-out infinite}',
  '@keyframes miGlowVerde{0%,100%{opacity:.55}50%{opacity:1}}',
  '.hm-check .ic .ic3d{transform-origin:50% 88%;animation:miTick 3.6s ease-in-out infinite}',
  '@keyframes miTick{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(6deg) translateY(-2%)}}',
  '.hm-live .lv-seal{position:absolute;top:14px;left:22px;z-index:3;display:inline-flex;align-items:center;gap:5px;font-size:11.5px;font-weight:800;letter-spacing:.2px;background:#fff;color:#1e3a8a;padding:5px 11px;border-radius:99px;box-shadow:0 4px 14px rgba(30,58,138,.22),inset 0 0 0 1.5px rgba(37,99,235,.35)}',
  '.hm-live .lv-seal.on{background:#ef4444;color:#fff;box-shadow:0 4px 16px rgba(239,68,68,.5);animation:miPulse 1.4s infinite}',
  '.hm-live.ao{box-shadow:0 18px 42px rgba(239,68,68,.3),inset 0 0 0 1.5px rgba(239,68,68,.9)!important}',
  '@media(prefers-reduced-motion:reduce){.hm-check::after,.hm-check .ic .ic3d,.hm-live .lv-seal.on{animation:none!important}}',
  /* entrada: botão de som */
  '#mi-som{position:fixed;top:calc(env(safe-area-inset-top,0px) + 14px);right:max(14px,env(safe-area-inset-right));z-index:9100;width:42px;height:42px;border-radius:50%;border:1.5px solid rgba(255,255,255,.3);background:rgba(255,255,255,.12);color:#fff;font-size:18px;cursor:pointer;backdrop-filter:blur(6px)}',
  '#mi-som:hover{background:rgba(255,255,255,.22)}',
  /* entrada v2: o card é a própria imagem do ícone (3D, em camadas), a frase centralizada num degradê escuro da cor do card */
  '#mi-entry .mi-ent-box{max-width:1040px}',
  '#mi-entry .mi-ctx{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(168px,1fr))!important;gap:16px!important}',
  '#mi-entry .mi-ctx button{position:relative;aspect-ratio:1/1;padding:0!important;border:0!important;border-radius:25.4%!important;overflow:hidden;background:transparent!important;display:block;box-shadow:0 12px 28px rgba(0,0,0,.38);transition:transform .3s cubic-bezier(.22,1,.36,1),box-shadow .3s}',
  '#mi-entry .mi-ctx .ic{position:absolute;inset:0;display:block;font-size:0!important}',
  '#mi-entry .mi-ctx .ly{position:absolute;inset:0;display:block;transform:scale(1.05)}',
  '#mi-entry .mi-ctx .ly img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;user-select:none;-webkit-user-drag:none}',
  '#mi-entry .mi-ctx .fg{transform-origin:50% 52%}',
  '#mi-entry .mi-ctx .tx{position:absolute;left:0;right:0;bottom:0;display:flex;justify-content:center;text-align:center;padding:26px 10px 11px;background:linear-gradient(to top,var(--c) 0%,var(--c) 30%,rgba(0,0,0,0) 100%);background:linear-gradient(to top,color-mix(in srgb,var(--c) 96%,transparent) 0%,color-mix(in srgb,var(--c) 82%,transparent) 42%,transparent 100%)}',
  '#mi-entry .mi-ctx .lb{font-size:15.5px!important;font-weight:800;line-height:1.15;color:#fff;text-align:center;text-shadow:0 1px 3px rgba(0,0,0,.35)}',
  '#mi-entry .mi-ctx .ht{display:none}',
  '#mi-entry .mi-ctx .tx{flex-direction:column;align-items:center;gap:2px}#mi-entry .mi-ctx .pt{font-size:11px;font-weight:600;color:#fff;opacity:0;max-height:0;overflow:hidden;transition:opacity .2s,max-height .2s;text-shadow:0 1px 3px rgba(0,0,0,.4)}@media(hover:hover){#mi-entry .mi-ctx button:hover .pt{opacity:.92;max-height:20px}}#mi-entry .mi-ctx button:focus-visible .pt{opacity:.92;max-height:20px}',
  '@media(hover:hover){#mi-entry .mi-ctx button:hover{transform:scale(1.08);z-index:2;box-shadow:0 22px 44px rgba(0,0,0,.6),0 8px 16px rgba(0,0,0,.4)}}',
  '.rail-evo{background:var(--card,var(--bg2));border:1px solid var(--border);border-radius:14px;padding:12px}.re-top,.re-st{display:flex;gap:8px}.re-top>div,.re-st>div{flex:1;display:flex;flex-direction:column}.re-top strong{font-size:22px;font-weight:800;line-height:1.1}.re-st strong{font-size:16px;font-weight:800}.re-top span,.re-st span{font-size:10.5px;color:var(--fg3);line-height:1.3}',
  '.re-bars{display:flex;align-items:flex-end;gap:3px;height:56px;margin:10px 0 3px}.re-bars i{flex:1;background:linear-gradient(180deg,#34d399,#10b981);border-radius:3px 3px 1px 1px;min-height:4px}.re-bars i.hj{background:linear-gradient(180deg,#fbbf24,#f59e0b)}.re-lbl{display:flex;gap:3px;margin-bottom:10px}.re-lbl b{flex:1;text-align:center;font-size:8.5px;font-weight:700;color:var(--fg3)}.re-st{border-top:1px solid var(--border);padding-top:9px}',
  '.rail-mt{display:flex;gap:12px;align-items:center;cursor:pointer;background:linear-gradient(135deg,rgba(212,160,23,.14),rgba(245,158,11,.05));border:1px solid rgba(212,160,23,.35);border-radius:14px;padding:12px}.rm-pos{display:flex;flex-direction:column;align-items:center;min-width:54px}.rm-pos strong{font-size:24px;font-weight:800;color:#d4a017;line-height:1}.rm-pos span{font-size:10px;color:var(--fg3);text-align:center}.rm-i{flex:1;min-width:0}.rm-t{font-size:12px;font-weight:800}.rm-s{font-size:11px;color:var(--fg2);margin:2px 0 7px}.rm-b{height:5px;border-radius:5px;background:var(--border);overflow:hidden}.rm-b i{display:block;height:100%;background:#d4a017;border-radius:5px}',
  '.rail-soc{margin-top:auto;display:flex;justify-content:flex-start;gap:6px;padding-top:6px}.right-rail .rail-soc a,.right-rail .rail-soc button{width:26px;height:26px;padding:0!important;display:flex!important;align-items:center;justify-content:center;background:none!important;border:0!important;border-radius:8px;cursor:pointer;opacity:.7;transition:transform .2s,opacity .2s,filter .2s}.right-rail .rail-soc a:hover,.right-rail .rail-soc button:hover{opacity:1;transform:scale(1.25);filter:drop-shadow(0 4px 5px rgba(0,0,0,.35))}.right-rail .rail-soc .ic3d,.right-rail .rail-soc img,.right-rail .rail-soc svg{width:18px!important;height:18px!important}',
  '.mi-tm{display:flex;align-items:center;gap:10px;flex-wrap:wrap;background:var(--card,var(--bg2));border:1px solid var(--border);border-radius:16px;padding:10px 14px}.mi-tm>b{font-size:12.5px;font-weight:800}.mi-tm>div{display:flex;gap:6px;flex-wrap:wrap}.mi-tm button{border:1.5px solid var(--border);background:transparent;color:inherit;border-radius:20px;padding:6px 13px;font-size:12.5px;font-weight:800;cursor:pointer}.mi-tm button.on{background:#4f6ef7;border-color:#4f6ef7;color:#fff}.mi-mn{font-size:10.5px;font-weight:800;color:var(--fg3);background:rgba(79,110,247,.1);border-radius:10px;padding:1px 7px;white-space:nowrap}',
  '.mi-tmg{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;max-width:640px;margin:0 auto}.mi-tmg button{background:rgba(255,255,255,.1);border:1.5px solid rgba(255,255,255,.18);border-radius:22px;color:#fff;padding:18px 6px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px;transition:transform .25s cubic-bezier(.22,1,.36,1),box-shadow .25s,background .25s}.mi-tmg button b{font-size:34px;font-weight:800;line-height:1}.mi-tmg button small{font-size:12px;font-weight:700;margin-left:2px;opacity:.8}.mi-tmg button span{font-size:12px;opacity:.8;font-weight:600}.mi-tmg button.on{background:rgba(79,110,247,.45);border-color:#8da2ff}@media(hover:hover){.mi-tmg button:hover{transform:scale(1.08);background:rgba(255,255,255,.18);box-shadow:0 18px 36px rgba(0,0,0,.45)}}.mi-tmg button:active{transform:scale(.96)}@media(max-width:560px){.mi-tmg{grid-template-columns:repeat(3,1fr)}}',
  '#mi-entry .mi-ctx button:focus-visible{outline:none;transform:scale(1.08);z-index:2;box-shadow:0 22px 44px rgba(0,0,0,.6),0 8px 16px rgba(0,0,0,.4)}#mi-entry .mi-ctx button:active{transform:scale(.96)}',
  /* animação de 1,5 s de cada ícone, proporcional ao que ele é; só roda quando a pessoa passa o mouse, foca ou toca (nada se mexe sozinho) */
  '@media(hover:hover){#mi-entry .mi-ctx button:hover .a-casa{animation:mk-hop 1.5s cubic-bezier(.34,1.3,.5,1) 1}}#mi-entry .mi-ctx button:focus-visible .a-casa,#mi-entry .mi-ctx button:active .a-casa{animation:mk-hop 1.5s cubic-bezier(.34,1.3,.5,1) 1}',
  '@media(hover:hover){#mi-entry .mi-ctx button:hover .a-acordar{animation:mk-rise 1.5s cubic-bezier(.34,1.3,.5,1) 1}}#mi-entry .mi-ctx button:focus-visible .a-acordar,#mi-entry .mi-ctx button:active .a-acordar{animation:mk-rise 1.5s cubic-bezier(.34,1.3,.5,1) 1}',
  '@media(hover:hover){#mi-entry .mi-ctx button:hover .a-banho{animation:mk-shake 1.5s cubic-bezier(.34,1.3,.5,1) 1}}#mi-entry .mi-ctx button:focus-visible .a-banho,#mi-entry .mi-ctx button:active .a-banho{animation:mk-shake 1.5s cubic-bezier(.34,1.3,.5,1) 1}',
  '@media(hover:hover){#mi-entry .mi-ctx button:hover .a-dormir{animation:mk-rock 1.5s cubic-bezier(.34,1.3,.5,1) 1}}#mi-entry .mi-ctx button:focus-visible .a-dormir,#mi-entry .mi-ctx button:active .a-dormir{animation:mk-rock 1.5s cubic-bezier(.34,1.3,.5,1) 1}',
  '@media(hover:hover){#mi-entry .mi-ctx button:hover .a-carro{animation:mk-drive 1.5s cubic-bezier(.34,1.3,.5,1) 1}}#mi-entry .mi-ctx button:focus-visible .a-carro,#mi-entry .mi-ctx button:active .a-carro{animation:mk-drive 1.5s cubic-bezier(.34,1.3,.5,1) 1}',
  '@media(hover:hover){#mi-entry .mi-ctx button:hover .a-transporte{animation:mk-bus 1.5s cubic-bezier(.34,1.3,.5,1) 1}}#mi-entry .mi-ctx button:focus-visible .a-transporte,#mi-entry .mi-ctx button:active .a-transporte{animation:mk-bus 1.5s cubic-bezier(.34,1.3,.5,1) 1}',
  '@media(hover:hover){#mi-entry .mi-ctx button:hover .a-trabalho{animation:mk-lift 1.5s cubic-bezier(.34,1.3,.5,1) 1}}#mi-entry .mi-ctx button:focus-visible .a-trabalho,#mi-entry .mi-ctx button:active .a-trabalho{animation:mk-lift 1.5s cubic-bezier(.34,1.3,.5,1) 1}',
  '@media(hover:hover){#mi-entry .mi-ctx button:hover .a-almoco{animation:mk-clink 1.5s cubic-bezier(.34,1.3,.5,1) 1}}#mi-entry .mi-ctx button:focus-visible .a-almoco,#mi-entry .mi-ctx button:active .a-almoco{animation:mk-clink 1.5s cubic-bezier(.34,1.3,.5,1) 1}',
  '@media(hover:hover){#mi-entry .mi-ctx button:hover .a-louca{animation:mk-wiggle 1.5s cubic-bezier(.34,1.3,.5,1) 1}}#mi-entry .mi-ctx button:focus-visible .a-louca,#mi-entry .mi-ctx button:active .a-louca{animation:mk-wiggle 1.5s cubic-bezier(.34,1.3,.5,1) 1}',
  '@media(hover:hover){#mi-entry .mi-ctx button:hover .a-limpeza{animation:mk-sweep 1.5s cubic-bezier(.34,1.3,.5,1) 1}}#mi-entry .mi-ctx button:focus-visible .a-limpeza,#mi-entry .mi-ctx button:active .a-limpeza{animation:mk-sweep 1.5s cubic-bezier(.34,1.3,.5,1) 1}',
  '@media(hover:hover){#mi-entry .mi-ctx button:hover .a-cozinha{animation:mk-bounce 1.5s cubic-bezier(.34,1.3,.5,1) 1}}#mi-entry .mi-ctx button:focus-visible .a-cozinha,#mi-entry .mi-ctx button:active .a-cozinha{animation:mk-bounce 1.5s cubic-bezier(.34,1.3,.5,1) 1}',
  '@media(hover:hover){#mi-entry .mi-ctx button:hover .a-caminhada{animation:mk-steps 1.5s cubic-bezier(.34,1.3,.5,1) 1}}#mi-entry .mi-ctx button:focus-visible .a-caminhada,#mi-entry .mi-ctx button:active .a-caminhada{animation:mk-steps 1.5s cubic-bezier(.34,1.3,.5,1) 1}',
  '@media(hover:hover){#mi-entry .mi-ctx button:hover .a-academia{animation:mk-pump 1.5s cubic-bezier(.34,1.3,.5,1) 1}}#mi-entry .mi-ctx button:focus-visible .a-academia,#mi-entry .mi-ctx button:active .a-academia{animation:mk-pump 1.5s cubic-bezier(.34,1.3,.5,1) 1}',
  '@media(hover:hover){#mi-entry .mi-ctx button:hover .a-fila{animation:mk-flip 1.5s cubic-bezier(.34,1.3,.5,1) 1}}#mi-entry .mi-ctx button:focus-visible .a-fila,#mi-entry .mi-ctx button:active .a-fila{animation:mk-flip 1.5s cubic-bezier(.34,1.3,.5,1) 1}',
  '@media(hover:hover){#mi-entry .mi-ctx button:hover .a-sofa{animation:mk-squash 1.5s cubic-bezier(.34,1.3,.5,1) 1}}#mi-entry .mi-ctx button:focus-visible .a-sofa,#mi-entry .mi-ctx button:active .a-sofa{animation:mk-squash 1.5s cubic-bezier(.34,1.3,.5,1) 1}',
  '@media(hover:hover){#mi-entry .mi-ctx button:hover .a-5min{animation:mk-swing 1.5s cubic-bezier(.34,1.3,.5,1) 1}}#mi-entry .mi-ctx button:focus-visible .a-5min,#mi-entry .mi-ctx button:active .a-5min{animation:mk-swing 1.5s cubic-bezier(.34,1.3,.5,1) 1}',
  '@media(hover:hover){#mi-entry .mi-ctx button:hover .a-foco{animation:mk-pulse 1.5s cubic-bezier(.34,1.3,.5,1) 1}}#mi-entry .mi-ctx button:focus-visible .a-foco,#mi-entry .mi-ctx button:active .a-foco{animation:mk-pulse 1.5s cubic-bezier(.34,1.3,.5,1) 1}',
  '@media(hover:hover){#mi-entry .mi-ctx button:hover .a-viagem{animation:mk-fly 1.5s cubic-bezier(.34,1.3,.5,1) 1}}#mi-entry .mi-ctx button:focus-visible .a-viagem,#mi-entry .mi-ctx button:active .a-viagem{animation:mk-fly 1.5s cubic-bezier(.34,1.3,.5,1) 1}',
  '@media(hover:hover){#mi-entry .mi-ctx button:hover .a-mercado{animation:mk-roll 1.5s cubic-bezier(.34,1.3,.5,1) 1}}#mi-entry .mi-ctx button:focus-visible .a-mercado,#mi-entry .mi-ctx button:active .a-mercado{animation:mk-roll 1.5s cubic-bezier(.34,1.3,.5,1) 1}',
  '@media(hover:hover){#mi-entry .mi-ctx button:hover .a-igreja{animation:mk-float 1.5s cubic-bezier(.34,1.3,.5,1) 1}}#mi-entry .mi-ctx button:focus-visible .a-igreja,#mi-entry .mi-ctx button:active .a-igreja{animation:mk-float 1.5s cubic-bezier(.34,1.3,.5,1) 1}',
  '@media(hover:hover){#mi-entry .mi-ctx button:hover .a-familia{animation:mk-beat 1.5s cubic-bezier(.34,1.3,.5,1) 1}}#mi-entry .mi-ctx button:focus-visible .a-familia,#mi-entry .mi-ctx button:active .a-familia{animation:mk-beat 1.5s cubic-bezier(.34,1.3,.5,1) 1}',
  '@keyframes mk-hop{0%{transform:none}25%{transform:translateY(-14%) scale(1.04)}50%{transform:translateY(0) scale(1.06,.94)}70%{transform:translateY(-5%)}100%{transform:none}}',
  '@keyframes mk-rise{0%{transform:translateY(14%)}55%{transform:translateY(-9%) scale(1.07)}100%{transform:none}}',
  '@keyframes mk-shake{0%,100%{transform:none}15%{transform:rotate(-8deg)}30%{transform:rotate(8deg)}45%{transform:rotate(-6deg) translateY(3%)}60%{transform:rotate(6deg)}80%{transform:rotate(-2deg)}}',
  '@keyframes mk-rock{0%{transform:rotate(0)}30%{transform:rotate(-12deg) translateY(-3%)}65%{transform:rotate(9deg)}100%{transform:rotate(0)}}',
  '@keyframes mk-drive{0%{transform:translateX(-22%)}55%{transform:translateX(9%)}75%{transform:translateX(-3%)}100%{transform:none}}',
  '@keyframes mk-bus{0%{transform:translateX(24%)}60%{transform:translateX(-7%)}80%{transform:translateX(2%)}100%{transform:none}}',
  '@keyframes mk-lift{0%{transform:none}35%{transform:translateY(-10%) rotate(-4deg)}65%{transform:translateY(-10%) rotate(4deg)}100%{transform:none}}',
  '@keyframes mk-clink{0%,100%{transform:none}25%{transform:rotate(-9deg) translateY(-3%)}50%{transform:rotate(7deg)}75%{transform:rotate(-3deg)}}',
  '@keyframes mk-wiggle{0%,100%{transform:none}12%{transform:rotate(-5deg) translateX(-2%)}28%{transform:rotate(5deg) translateX(2%)}44%{transform:rotate(-4deg)}60%{transform:rotate(4deg)}80%{transform:rotate(-1deg)}}',
  '@keyframes mk-sweep{0%{transform:rotate(0)}25%{transform:rotate(-16deg) translateX(-5%)}60%{transform:rotate(14deg) translateX(5%)}100%{transform:rotate(0)}}',
  '@keyframes mk-bounce{0%,100%{transform:none}22%{transform:translateY(-12%)}42%{transform:translateY(0) scale(1.05,.95)}62%{transform:translateY(-6%)}80%{transform:none}}',
  '@keyframes mk-steps{0%{transform:translateX(-8%) translateY(0)}20%{transform:translateX(-3%) translateY(-5%)}40%{transform:translateX(2%) translateY(0)}60%{transform:translateX(6%) translateY(-5%)}80%{transform:translateX(2%) translateY(0)}100%{transform:none}}',
  '@keyframes mk-pump{0%{transform:none}25%{transform:translateY(-16%) scale(1.08)}45%{transform:translateY(4%)}70%{transform:translateY(-10%) scale(1.05)}100%{transform:none}}',
  '@keyframes mk-flip{0%{transform:rotate(0)}70%{transform:rotate(190deg)}85%{transform:rotate(176deg)}100%{transform:rotate(180deg)}}',
  '@keyframes mk-squash{0%{transform:none}20%{transform:translateY(-12%)}40%{transform:translateY(2%) scale(1.08,.88)}60%{transform:translateY(-4%)}100%{transform:none}}',
  '@keyframes mk-swing{0%,100%{transform:none}20%{transform:rotate(-14deg)}45%{transform:rotate(12deg)}70%{transform:rotate(-6deg)}}',
  '@keyframes mk-pulse{0%,100%{transform:none}30%{transform:scale(1.18)}55%{transform:scale(.94)}75%{transform:scale(1.06)}}',
  '@keyframes mk-fly{0%{transform:translate(-30%,26%) rotate(-8deg);opacity:.2}45%{opacity:1}75%{transform:translate(6%,-6%) rotate(3deg)}100%{transform:none}}',
  '@keyframes mk-roll{0%{transform:translateX(-22%)}55%{transform:translateX(8%)}80%{transform:translateX(-2%)}100%{transform:none}}',
  '@keyframes mk-float{0%,100%{transform:none}45%{transform:translateY(-10%) scale(1.07)}}',
  '@keyframes mk-beat{0%,100%{transform:none}18%{transform:scale(1.15)}34%{transform:scale(.97)}52%{transform:scale(1.12)}70%{transform:none}}',
  '@media(max-width:700px){#mi-entry .mi-ctx{grid-template-columns:repeat(3,1fr)!important;gap:10px!important}#mi-entry .mi-ctx button{border-radius:18px!important}#mi-entry .mi-ctx .tx{padding:18px 5px 7px}#mi-entry .mi-ctx .lb{font-size:12.5px!important}}',
  '@media(max-width:330px){#mi-entry .mi-ctx{grid-template-columns:repeat(2,1fr)!important}}',
  '@media(prefers-reduced-motion:reduce){#mi-entry .mi-ctx button{opacity:1!important;transform:none!important;animation:none!important}#mi-entry .mi-ctx button,#mi-entry .mi-ctx .fg{transition:none!important}#mi-entry .mi-ctx .fg{animation:none!important}}',
  ].join('');
  document.head.appendChild(css);

  /* ───────────────────────── estado do aluno (sequência, aulas vistas, última aula) ───────────────────────── */
  var U=null, ST={dias:[],vistas:[],ultima:null,bv:false,tour:[],nivel:null,prisma:null}, CFG={}, salvarT=null;
  function chave(){return 'mi_estado_'+(U?U.id:'anon');}
  function carregarEstado(user){
    U=user;
    var m=((user&&user.user_metadata)||{}).mi||{}, l=LS.get(chave(),{});
    var uni=function(a,b){var o={};(a||[]).concat(b||[]).forEach(function(x){o[x]=1;});return Object.keys(o).sort();};
    ST.dias=uni(m.dias,l.dias);
    ST.vistas=uni(m.vistas,l.vistas);
    ST.prog=Object.assign({},m.prog||{},l.prog||{});
    var um=m.ultima,ul=l.ultima;ST.ultima=(um&&ul)?((um.ts||0)>=(ul.ts||0)?um:ul):(um||ul||null);
    ST.bv=!!(m.bv||l.bv);
    ST.tour=uni(m.tour,l.tour);
    var lvLocal=null;try{lvLocal=localStorage.getItem('userLevel');}catch(e){}
    ST.nivel=m.nivel||l.nivel||lvLocal||null;
    ST.prisma=m.prisma||l.prisma||null;
    ST.prismaRes=m.prismaRes||l.prismaRes||null;
    ST.onb=m.onb||l.onb||null;
    ST.idioma=!!(m.idioma||l.idioma);
  }
  function salvar(){
    LS.set(chave(),ST);
    clearTimeout(salvarT);
    salvarT=setTimeout(function(){
      if(!U)return;
      window._sb.auth.updateUser({data:{mi:{dias:ST.dias.slice(-150),vistas:ST.vistas.slice(-400),ultima:ST.ultima,bv:ST.bv,tour:ST.tour,nivel:ST.nivel,prisma:ST.prisma,prismaRes:ST.prismaRes,onb:ST.onb,idioma:ST.idioma,prog:podarProg()}}}).catch(function(){});
    },1500);
  }
  function marcarDia(){
    var h=dia();if(ST.dias.indexOf(h)<0){ST.dias.push(h);ST.dias.sort();salvar();}
    pintarRail();if(window.currentPage==='home')renderHome();
  }
  function sequencia(){
    var set={};ST.dias.forEach(function(d){set[d]=1;});
    var d=new Date(),n=0;
    if(!set[dia(d)])d.setDate(d.getDate()-1);
    while(set[dia(d)]){n++;d.setDate(d.getDate()-1);}
    return {n:n,hoje:!!set[dia()]};
  }

  /* checklist de hoje: guarda as tarefas marcadas no aparelho, por dia */
  function chkKey(){return 'mi_checks_'+dia();}
  function podarProg(){var o={},ks=Object.keys(ST.prog||{}).sort().slice(-120);ks.forEach(function(k){o[k]=ST.prog[k];});return o;}
  function registrarProg(){
    var ch=window._ctxChecked||{},best=0;
    Object.keys(ch).forEach(function(k){if(k==='_idioma')return;var tot=(window.CTX_TASKS&&CTX_TASKS[k]||[]).length;if(!tot)return;var f=(ch[k]||[]).filter(Boolean).length;best=Math.max(best,f/tot);});
    ST.prog=ST.prog||{};var h=dia();if((ST.prog[h]||0)!==best){ST.prog[h]=Math.round(best*100)/100;salvar();}
  }
  function salvarChecks(){LS.set(chkKey(),window._ctxChecked||{});try{registrarProg();}catch(e){}}
  function restaurarChecks(){var c=LS.get(chkKey(),{});Object.keys(c).forEach(function(k){window._ctxChecked[k]=c[k];});}

  /* limpeza: apaga caches antigos do navegador e sobras diárias do localStorage (checklists e trocas de dias passados) */
  try{if(window.caches)caches.keys().then(function(ks){ks.forEach(function(k){caches.delete(k);});});}catch(e){}
  try{var hoje=dia();Object.keys(localStorage).forEach(function(k){var m=k.match(/^mi_(checks|troca)_(\d{4}-\d{2}-\d{2})$/);if(m&&m[2]!==hoje)localStorage.removeItem(k);});}catch(e){}
  function ctxAtual(){var c=LS.get('mi_ctx',{});return c.d===dia()?c.k:null;}
  function progCtx(k){
    k=k||ctxAtual()||'Em Casa';
    var tot=(window.CTX_TASKS&&CTX_TASKS[k]||[]).length,feitos=((window._ctxChecked||{})[k]||[]).filter(Boolean).length;
    return {k:k,tot:tot,feitos:feitos,pct:tot?Math.round(feitos*100/tot):0};
  }
  var chkOrig=window.chkMarTask;
  window.chkMarTask=function(el,key,i){chkOrig(el,key,i);salvarChecks();if(((_ctxChecked[key]||[])[i])){marcarDia();verCompleto(key);}else pintarRail();};
  var doneOrig=window.taskDone;
  if(doneOrig)window.taskDone=function(){doneOrig();salvarChecks();marcarDia();verCompleto();};
  function chipsCtx(){
    var g=document.querySelector('#pane-maratona .ctx-grid');if(!g||g.dataset.mi)return;g.dataset.mi='1';g.classList.remove('stagger');
    g.innerHTML=CTX.map(function(c){return '<div class="ctx-chip'+(c.k==='Em Casa'?' active':'')+'" data-k="'+E(c.k)+'" onclick="selCtx(this)"><span class="ce">'+icCtx(c)+'</span>'+E(c.lb)+'</div>';}).join('');
  }
  window.selCtx=function(el){
    var k=el.dataset.k;if(!k)return;
    [].forEach.call(document.querySelectorAll('.ctx-chip'),function(c){c.classList.toggle('active',c===el);});
    var c=CTX.filter(function(x){return x.k===k;})[0];
    $('mar-ctx-title').textContent='Tarefas de hoje · '+(c?c.lb:k);
    window.renderMarTasks(k);LS.set('mi_ctx',{d:dia(),k:k});
  };
  function escolherCtxNaMaratona(k){
    chipsCtx();
    var chip=document.querySelector('#pane-maratona .ctx-chip[data-k="'+k.replace(/"/g,'')+'"]');
    if(chip){window.selCtx(chip);chip.scrollIntoView&&chip.scrollIntoView({block:'nearest',inline:'center'});}
  }
  setTimeout(chipsCtx,0);

  /* ───────────────────────── lives ───────────────────────── */
  (function(){
    var L=window.LIVES||[];
    L.forEach(function(lv){
      if(lv.id==='series'){lv.title='Culture English · Séries e Filmes';lv.sub='Toda 2ª terça-feira do mês · começa 8/12 · 1h';lv.nth=2;lv.day=2;lv.startDate=new Date(2026,11,8);}
      if(lv.id==='devocional'){lv.sub='Todo sábado · grátis · o link abre aqui, só nas Lives';lv.free=true;}
      if(lv.id==='series')lv.free=true;
    });
    function nthDia(y,m,dow,n){var d=new Date(y,m,1);while(d.getDay()!==dow)d.setDate(d.getDate()+1);d.setDate(d.getDate()+7*(n-1));return d;}
    var noOrig=window.nextOccurrence;
    window.nextOccurrence=function(lv){
      if(!lv.nth)return noOrig(lv);
      var now=new Date(),y=now.getFullYear(),m=now.getMonth();
      for(var k=0;k<15;k++){var d=nthDia(y,m+k,lv.day,lv.nth);d.setHours(lv.startH,lv.startM,0,0);var e=new Date(d);e.setHours(lv.endH,lv.endM,0,0);
        if(e>now&&(!lv.startDate||d>=new Date(lv.startDate.getFullYear(),lv.startDate.getMonth(),lv.startDate.getDate())))return d;}
      return noOrig(lv);
    };
    window.isLiveNow=function(lv){var s0=nextOccurrence(lv),e=new Date(s0);e.setHours(lv.endH,lv.endM,0,0);var n=new Date();return n>=s0&&n<=e;};
    var DSN=['SU','MO','TU','WE','TH','FR','SA'];
    function agendaLink(lv,nx){
      var f=function(d){return d.toISOString().replace(/[-:]/g,'').split('.')[0]+'Z';},en=new Date(nx);en.setHours(lv.endH,lv.endM,0,0);
      var rr=lv.nth?'RRULE:FREQ=MONTHLY;BYDAY='+lv.nth+DSN[lv.day]:'RRULE:FREQ=WEEKLY;BYDAY='+DSN[lv.day];
      return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text='+encodeURIComponent(lv.title+' · Gediel')+'&dates='+f(nx)+'/'+f(en)+'&recur='+encodeURIComponent(rr)
        +'&details='+encodeURIComponent(lv.type==='grupo'?'O link é revelado no grupo do WhatsApp do English on Mission.':'Link: '+lv.link);
    }
    function livreLive(lv){var S=AS();if(lv.free||!S.ok||souAdmin()||S.programa||S.tudo)return true;var ex=(S.cfg&&S.cfg.livesPlanos)||[];return ex.some(function(t){return temProduto(t);});}
    window.EBG_LIVRE=livreLive;
    window.go2=function(p){try{go(p);}catch(e){}};
    var _sig='';setInterval(function(){var S=AS(),g=[S.pronto,S.programa,S.tudo,S.admin,window._isAdmin].join();if(g!==_sig){_sig=g;if(window.renderLives)renderLives();try{var pg0=window.currentPage;if(typeof UNIV!=='undefined'&&UNIV[pg0]&&!EDIT){CARDS=null;desenharUni(pg0);}}catch(e){}}},1200);
    window.renderLives=function(){
      var c=document.getElementById('live-cards-container');if(!c)return;
      c.innerHTML=(window.LIVES||[]).map(function(lv){return {lv:lv,nx:nextOccurrence(lv)};}).sort(function(a,b){return a.nx-b.nx;}).map(function(o){
        var lv=o.lv,nx=o.nx,now=isLiveNow(lv),hh=String(lv.startH).padStart(2,'0')+'h'+String(lv.startM).padStart(2,'0');
        var trancada=!livreLive(lv);
        var bt=trancada?'<button class="live-btn live-btn-lock" onclick="go2(\'planos\')"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg> Dentro dos planos · ver planos</button>'
          :now?'<a href="'+lv.link+'" target="_blank" rel="noopener" class="live-btn live-btn-on">'+(lv.type==='youtube'?'▶ Assistir no YouTube':'Entrar no Meet')+'</a>'
          :'<button class="live-btn live-btn-off" disabled>O link abre na hora</button>';
        return '<div class="live-card'+(now?' is-live':'')+'" data-lid="'+E(lv.id)+'"><div class="live-top"><div class="live-icon '+lv.iconClass+'">'+lv.icon+'</div><div class="live-info"><div class="live-title">'+lv.title+'</div><div class="live-sub">'+lv.sub+'</div>'
          +(now?'<span class="live-status-live"><span class="live-dot"></span> AO VIVO AGORA</span>':'<span class="live-status-next">'+dayLabel(nx)+' às '+hh+'</span><div class="lv-cd" data-at="'+nx.getTime()+'"></div>')
          +'</div></div><div class="live-actions">'+bt+'<a href="'+agendaLink(lv,nx)+'" target="_blank" rel="noopener" class="live-btn live-btn-cal">📅 Pôr na agenda</a></div></div>';
      }).join('');
      tickCd();
    };
  })();
  /* contagem regressiva: qualquer elemento .lv-cd[data-at] na tela */
  function tickCd(){
    [].forEach.call(document.querySelectorAll('.lv-cd[data-at]'),function(el){
      var ms=+el.dataset.at-Date.now();
      if(ms<=0){el.innerHTML='<span class="ag">Começando!</span>';return;}
      var s0=Math.floor(ms/1000),d=Math.floor(s0/86400),h=Math.floor(s0%86400/3600),m=Math.floor(s0%3600/60),sg=s0%60;
      el.innerHTML='<span><b>'+d+'</b>dias</span><span><b>'+String(h).padStart(2,'0')+'</b>h</span><span><b>'+String(m).padStart(2,'0')+'</b>min</span><span><b>'+String(sg).padStart(2,'0')+'</b>seg</span>';
    });
  }
  setInterval(tickCd,1000);
  setTimeout(function(){grupoEom().then(function(){if(window.renderLives)renderLives();});},1500);
  function proxLives(){
    var now=new Date();
    return (window.LIVES||[]).map(function(lv){
      var st=nextOccurrence(lv),en=new Date(st);en.setHours(lv.endH,lv.endM,0,0);
      if(lv.startDate&&st<lv.startDate){st=new Date(lv.startDate);st.setHours(lv.startH,lv.startM,0,0);en=new Date(st);en.setHours(lv.endH,lv.endM,0,0);}
      return {lv:lv,st:st,en:en,aoVivo:now>=st&&now<=en};
    }).sort(function(a,b){return a.st-b.st;});
  }
  var DS=['dom','seg','ter','qua','qui','sex','sáb'];
  function quando(x){
    var now=new Date(),h=x.st.getHours()+'h'+(x.st.getMinutes()?pad(x.st.getMinutes()):'');
    if(x.aoVivo)return 'AO VIVO agora';
    var d0=new Date(now);d0.setHours(0,0,0,0);var d1=new Date(x.st);d1.setHours(0,0,0,0);
    var dd=Math.round((d1-d0)/86400000);
    return (dd===0?'hoje':dd===1?'amanhã':DS[x.st.getDay()]+' '+x.st.getDate()+'/'+(x.st.getMonth()+1))+' às '+h;
  }

  /* ───────────────────────── aulas do Programa (pra home) ───────────────────────── */
  var FLAT=null,hmIdx=-1;
  async function carregarFlat(force){
    if(FLAT&&!force)return FLAT;
    try{
      var r=await Promise.all([window._sb.from('mi_modules').select('id,name,ord,trilha,emoji,cover_url,created_at').order('ord').order('created_at'),
        window._sb.from('mi_lessons').select('id,module_id,ord,title,youtube_url,cover_url,published,release_at,created_at').order('ord').order('created_at')]);
      var mods=(r[0].data||[]).filter(function(m){return (m.trilha||'programa')==='programa';});
      var porMod={};(r[1].data||[]).forEach(function(l){(porMod[l.module_id]=porMod[l.module_id]||[]).push(l);});
      FLAT=[];mods.forEach(function(m){(porMod[m.id]||[]).forEach(function(l,i,arr){FLAT.push({m:m,l:l,n:i+1,de:arr.length});});});
    }catch(e){FLAT=[];}
    return FLAT;
  }
  function idxInicial(){
    if(!FLAT||!FLAT.length)return -1;
    if(ST.ultima){for(var i=0;i<FLAT.length;i++)if(FLAT[i].l.id===ST.ultima.les)return i;}
    for(var j=0;j<FLAT.length;j++)if(ST.vistas.indexOf(FLAT[j].l.id)<0)return j;
    return 0;
  }
  async function abrirAula(modId,lesId,mini){
    if(!mini&&faltaDiagnostico()){portao('as aulas');return;}
    await window.loadStudentModules(true);
    go('modulos');
    window._miniBack=mini||null;
    await window.openModule(modId);
    if(lesId)await window.openLesson(lesId);
  }
  function aulaAberta(mod,l){
    if(window.isOpen&&isOpen(l)){if(ST.vistas.indexOf(l.id)<0)ST.vistas.push(l.id);marcarDia();}
    if(!mod||(mod.trilha||'programa')!=='programa')return;
    ST.ultima={mod:mod.id,les:l.id,ts:Date.now()};salvar();hmIdx=-1;
  }

  /* ───────────────────────── HOME ───────────────────────── */
  var deferredInstall=null;
  window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();deferredInstall=e;if(window.currentPage==='home')renderHome();});
  function nomeCurto(){var m=(U&&U.user_metadata)||{},n=(window.profile&&profile.name&&profile.name!=='Ana Lima'?profile.name:'')||m.full_name||m.name||(U&&U.email?U.email.split('@')[0]:'');return String(n).split(' ')[0]||'';}
  function saudacao(){var h=new Date().getHours();return h<12?'Bom dia':h<18?'Boa tarde':'Boa noite';}
  function dataHoje(){var s=new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'});return s.charAt(0).toUpperCase()+s.slice(1);}
  /* resumo discreto: bolinha por dia desde que a pessoa entrou (verde completo, amarelo incompleto, vermelho zerado) */
  function valDia(k){var p=(ST.prog||{})[k];if(p==null)return (ST.dias||[]).indexOf(k)>=0?0.5:0;return p;}
  function mediaPeriodo(a,b){var n=0,t=0,d=new Date(a);while(d<=b){t+=valDia(dia(d));n++;d.setDate(d.getDate()+1);}return n?t/n:0;}
  function resumoMes(){
    var ds=(ST.dias||[]).slice().sort(),hoje=new Date();hoje.setHours(12,0,0,0);
    var ini=ds[0]?new Date(ds[0]+'T12:00:00'):new Date(hoje);
    var m0=new Date(hoje.getFullYear(),hoje.getMonth(),1,12);var de=ini>m0?ini:m0;
    var bol='',d=new Date(de);
    while(d<=hoje){var k=dia(d),v=valDia(k),hj=k===dia();
      var cl=v>=1?'g':v>0?'y':(hj?'n':'r');bol+='<i class="'+cl+(hj?' hj':'')+'" title="'+d.getDate()+'"></i>';d.setDate(d.getDate()+1);}
    // frase: compara com o período anterior do mesmo tamanho (mês, senão semana, senão ontem)
    var frase='',ndias=Math.round((hoje-de)/864e5)+1,iniTot=Math.round((hoje-ini)/864e5)+1;
    function comp(nome,a1,b1,a2,b2){var x=mediaPeriodo(a1,b1),y=mediaPeriodo(a2,b2);if(y<=0&&x<=0)return '';
      if(y<=0)return 'Bom começo: mais tarefas feitas que '+nome+'.';var dif=Math.round((x-y)/y*100);
      return dif>0?'Você está '+dif+'% mais comprometido que '+nome+'.':dif<0?'Você está '+(-dif)+'% menos comprometido que '+nome+'. Bora recuperar?':'Mesmo ritmo que '+nome+'.';}
    function menos(dt,n){var r=new Date(dt);r.setDate(r.getDate()-n);return r;}
    if(iniTot>=ndias+ndias)frase=comp('no mês passado',de,hoje,menos(de,ndias),menos(hoje,ndias));
    if(!frase&&iniTot>=14)frase=comp('na semana passada',menos(hoje,6),hoje,menos(hoje,13),menos(hoje,7));
    if(!frase&&iniTot>=2)frase=comp('ontem',hoje,hoje,menos(hoje,1),menos(hoje,1));
    if(!frase)frase='Cada bolinha é um dia. Verde é checklist completo.';
    var mes=hoje.toLocaleDateString('pt-BR',{month:'long'});
    return '<div class="hm-mes"><div class="hm-mes-t"><b>'+E(mes.charAt(0).toUpperCase()+mes.slice(1))+'</b><span>'+E(frase)+'</span></div><div class="hm-mes-b">'+bol+'</div></div>';
  }
  /* selo do card Lives: contagem pro próximo encontro; se estiver no ar, "Live acontecendo" */
  function seloTxt(x){
    if(!x)return '';if(x.aoVivo)return '● LIVE ACONTECENDO';
    var m=Math.max(0,Math.round((x.st-new Date())/60000));
    if(m<60)return '⏱ começa em '+Math.max(1,m)+' min';
    if(m<1440)return '⏱ em '+Math.floor(m/60)+'h'+(m%60?(' '+pad(m%60)+'min'):'');
    var d=Math.floor(m/1440),h=Math.floor((m%1440)/60);return '⏱ em '+d+'d'+(h?' '+h+'h':'');
  }
  function selo(x){return x?'<span class="lv-seal'+(x.aoVivo?' on':'')+'" id="lv-seal">'+seloTxt(x)+'</span>':'';}
  setInterval(function(){
    var el=$('lv-seal');if(!el)return;var x=proxLives()[0];if(!x)return;
    el.className='lv-seal'+(x.aoVivo?' on':'');el.textContent=seloTxt(x);
    var card=el.closest('.hm-live');if(card)card.classList.toggle('ao',!!x.aoVivo);
  },30000);
  function renderHome(){
    var p=$('pane-home');if(!p||!U)return;
    var sq=sequencia(),pc=progCtx(),c=CTX.filter(function(x){return x.k===pc.k;})[0]||CTX[0],lv=proxLives()[0];
    var standalone=window.matchMedia&&matchMedia('(display-mode: standalone)').matches||navigator.standalone;
    var mobile=/iphone|ipad|android/i.test(navigator.userAgent);
    var ios=/iphone|ipad/i.test(navigator.userAgent);
    var h='<span class="mi-logo mi-lg-marca" aria-hidden="true"></span><div class="hm-greet">'+saudacao()+(nomeCurto()?', '+E(nomeCurto()):'')+' 👋</div>'
      +'<div class="hm-sub">'+E(dataHoje())+' · '+(sq.n?'<strong style="color:var(--gold)">🔥 '+sq.n+' dia'+(sq.n>1?'s':'')+' seguido'+(sq.n>1?'s':'')+'</strong>'+(sq.hoje?'':' · estude hoje pra manter'):'Comece sua sequência hoje 🔥')+'</div>';
    if(mobile&&!standalone&&!LS.get('mi_install_x',false)){
      h+='<div class="hm-install"><span style="font-size:24px">📲</span><div><b>Instale o app no celular</b><br>'
        +(deferredInstall?'Um toque e ele fica na sua tela inicial.':ios?'No Safari: toque em <b>Compartilhar</b> → <b>Adicionar à Tela de Início</b>.':'No menu do navegador (⋮): <b>Adicionar à tela inicial</b>.')+'</div>'
        +(deferredInstall?'<button data-hm="instalar">Instalar</button>':'<button data-hm="instalar-x" style="background:var(--surface2);color:var(--fg2)">Ok</button>')+'</div>';
    }
    h+='<div class="hm-row">'
      +'<button class="hm-big hm-check" data-hm="check" aria-label="Checklist de hoje"><div class="ic">'+IC('check')+'</div><div class="lb">Checklist de hoje</div><div class="pg">'+(faltaDiagnostico()?'🔒 Faça os 2 testes pra liberar':c.ic+' '+E(c.lb)+' · '+pc.feitos+' de '+pc.tot+' feitas')+'</div><div class="bar"><i style="width:'+pc.pct+'%"></i></div></button>'
      +'<button class="hm-big hm-live'+(lv&&lv.aoVivo?' ao':' off')+'" data-hm="lives" aria-label="Lives">'+selo(lv)+'<div class="ic">'+IC('lives')+'</div><div class="lb">Lives</div><div class="pg">'+(lv?E(lv.lv.title)+'<br>'+E(quando(lv)):'Ver agenda')+'</div></button>'
      +'</div>';
    h+=resumoMes();
    h+='<div class="sec-hd">Sua aula</div><div class="hm-aula" id="hm-aula"><div class="cv"><div class="lock">Carregando…</div></div><div class="bd"><div class="st">&nbsp;</div></div></div>';
    h+='<div class="hm-ref"><div>'+IC('indicar','xl')+'</div><div><div class="t">Conhece alguém que trava no inglês?</div><div class="s">Manda o seu link: ele leva a pessoa direto pro pagamento, com desconto aplicado. Leva 10 segundos.</div></div>'
      +'<div class="bts"><button data-hm="indicar" style="background:#25d366;color:#fff;display:inline-flex;align-items:center;gap:8px">'+IC('wa-real')+' Convidar no WhatsApp</button><button data-hm="copiar" style="background:var(--surface2);color:var(--fg)">Copiar link</button></div></div>';
    p.innerHTML=h;
    pintarAula();
  }
  async function pintarAula(){
    var box=$('hm-aula');if(!box)return;
    await carregarFlat();
    box=$('hm-aula');if(!box)return;
    if(!FLAT.length){box.innerHTML='<div class="cv" data-hm="modulos"><div class="lock">📚 As aulas aparecem aqui</div></div><div class="bd"><div class="st">Assim que a primeira aula for liberada, ela fica nesse espaço.</div></div>';return;}
    if(hmIdx<0)hmIdx=idxInicial();
    var it=FLAT[hmIdx],l=it.l,cov=window.lessonCover?lessonCover(l):null,op=window.isOpen?isOpen(l):false,fut=window.relFuture?relFuture(l):false;
    var cont=ST.ultima&&ST.ultima.les===l.id;
    var kick=cont?'CONTINUE DE ONDE PAROU':(hmIdx===0&&!ST.vistas.length?'COMECE POR AQUI':ST.vistas.indexOf(l.id)>=0?'JÁ ASSISTIDA':'PRÓXIMA AULA');
    var status=op?'▶ Disponível'+(ST.vistas.indexOf(l.id)>=0?' · ✓ você já viu':''):fut?'📅 Libera '+relDate(l).toLocaleDateString('pt-BR',{day:'numeric',month:'long'}):'⏳ Em gravação';
    box.innerHTML='<div class="cv" data-hm="abrir">'+(cov?'<img src="'+E(cov)+'" alt="" data-capa-t="'+E(l.title)+'" data-capa-i="'+hmIdx+'">':(window.capaAuto?capaAuto(l.title,hmIdx):''))
      +'<span class="kick">'+kick+'</span>'+(op?'<span class="play">▶</span>':'<span class="lock">'+(fut?'📅 Em breve':'⏳ Em gravação')+'</span>')+'</div>'
      +'<div class="bd"><div class="md">'+E(it.m.name)+' · AULA '+it.n+' DE '+it.de+'</div><div class="tt">'+E(l.title)+'</div><div class="st">'+status+'</div>'
      +'<div class="hm-nav"><button data-hm="ant" '+(hmIdx<=0?'disabled':'')+' aria-label="Aula anterior">◀</button>'
      +'<button class="main" data-hm="abrir">'+(op?(cont?'▶ Continuar':'▶ Assistir'):'Ver aula')+'</button>'
      +'<button data-hm="prox" '+(hmIdx>=FLAT.length-1?'disabled':'')+' aria-label="Próxima aula">▶</button></div></div>';
  }
  /* o convite leva direto pro pagamento da Kiwify (Programa), já com o cupom do amigo e a origem marcada (utm) pra venda cair como indicação */
  function checkoutIndicacao(){var cf=AS().cfg||{},pl=planos().filter(function(x){return x.k==='inteligente';})[0];return (pl&&pl.checkout)||cf.checkout||'https://pay.kiwify.com.br/CohRPDI';}
  function linkIndicacao(){var c=meuCupom(),u=checkoutIndicacao();return u+(u.indexOf('?')>=0?'&':'?')+'coupon='+encodeURIComponent(c.cod)+'&utm_source=indicacao&utm_medium=membros&utm_campaign='+encodeURIComponent(c.cod);}
  function msgIndicacao(){var c=meuCupom();return 'Tô estudando inglês com o Gediel no Método Inteligente e tá fazendo diferença 🙌\n\nEntra pelo meu link que o seu desconto de '+c.pct+'% já vem aplicado (cupom *'+c.cod+'*):\n'+linkIndicacao()
    +'\n\nQuer ver seu nível antes? Faz o teste grátis: '+SITE+'?ir=teste';}
  /* ───────────────────────── INDIQUE E GANHE ─────────────────────────
     Quem fecha pelo convite conta 1 passo. Prêmios: 1 = e-book de viagem · 2 = upgrade pro Gênio · 5 = +3 meses grátis.
     O cupom do amigo: 5% na 1ª indicação, 10% nas próximas. O comercial registra a venda aqui no modo edição. */
  var IND={lista:null,erro:false,todas:null};
  var PREMIOS={1:{t:'E-book de viagem',d:'O Passaporte do Inglês liberado na sua conta',ic:'✈️'},2:{t:'Upgrade pro Plano Gênio',d:'A plataforma inteira liberada',ic:'👑'},5:{t:'+3 meses grátis',d:'Somados ao seu plano do Programa',ic:'🎉'}};
  function semAcento(x){return String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'');}
  function meuCupom(){
    var n=semAcento(nomeCurto()||'ALUNO').toUpperCase().replace(/[^A-Z]/g,'').slice(0,8)||'ALUNO';
    var id=String(U&&U.id||'0000').replace(/[^a-z0-9]/gi,'').slice(-4).toUpperCase();
    var f=(IND.lista||[]).length;return {cod:n+id,pct:f?10:5};
  }
  async function carregarInd(){
    try{
      var r=await window._sb.from('mi_indicacoes').select('*').order('created_at');
      if(r.error)throw r.error;var eu=String(U&&U.email||'').toLowerCase();
      IND.todas=r.data||[];IND.lista=IND.todas.filter(function(x){return String(x.indicador_email||'').toLowerCase()===eu;});IND.erro=false;
    }catch(e){IND.lista=[];IND.todas=[];IND.erro=true;}
  }
  async function renderIndicar(){
    var p=$('pane-indicar');if(!p)return;
    if(IND.lista===null){p.innerHTML='<div class="admin-loading">Carregando…</div>';await carregarInd();}
    var n=Math.min(5,IND.lista.length),c=meuCupom(),prox=[1,2,5].filter(function(k){return k>n;})[0];
    var h='<div class="in-hero"><div class="in-k">Indique e ganhe</div><h1>Traga até 5 amigos.<br><span>Cada um que entrar vale um prêmio.</span></h1>'
      +'<p>Manda o seu link. Ele leva o amigo direto pro pagamento, com o seu cupom. Quando a compra sair, conta aqui.</p></div>';
    h+='<div class="in-trilha">';
    for(var i=1;i<=5;i++){var pr=PREMIOS[i],ok=i<=n,al=IND.lista[i-1];
      h+='<div class="in-passo'+(ok?' ok':'')+(pr?' premio':'')+(i===n+1?' prox':'')+'"><div class="bola">'+(ok?(al&&al.indicado_nome?E(al.indicado_nome.charAt(0).toUpperCase()):'✓'):i)+'</div>'
        +'<div class="in-tx">'+(pr?'<b>'+pr.ic+' '+E(pr.t)+'</b><small>'+E(pr.d)+'</small>':'<b>'+i+'º amigo</b><small>Mais perto dos 3 meses grátis</small>')
        +(ok&&al?'<em>'+E(al.indicado_nome||'Amigo')+' entrou ✓</em>':'')+'</div></div>';}
    h+='</div>';
    h+='<div class="in-status">'+(n>=5?'🏆 Você completou a missão! Fala com o Gediel pra liberar os 3 meses.':n?'Você já trouxe <b>'+n+'</b> '+(n>1?'amigos':'amigo')+'. '+(prox?'Faltam <b>'+(prox-n)+'</b> pro próximo prêmio: '+E(PREMIOS[prox].t)+'.':''):'Nenhum amigo entrou ainda. O primeiro já vale um e-book.')+'</div>';
    h+='<div class="in-cupom"><div><small>Seu cupom</small><b id="in-cod">'+E(c.cod)+'</b><span>Seu amigo ganha <b>'+c.pct+'%</b> de desconto'+(c.pct===5?' (a partir da 2ª indicação fechada, vira 10%)':'')+'</span></div><button data-in="copiar">Copiar</button></div>';
    h+='<button class="pl-btn" style="--pc:#25d366;margin-top:12px" data-in="zap">'+IC('wa-real')+' Mandar meu convite no WhatsApp</button>';
    h+='<div class="in-como"><b>Como funciona</b><ol><li>Você manda o seu link: ele abre direto na página de pagamento, com o desconto já aplicado.</li><li>Seu amigo paga pela Kiwify e recebe o acesso no mesmo e-mail.</li><li>Quando a compra for confirmada, a indicação conta aqui e o prêmio é liberado.</li></ol></div>';
    if(IND.erro&&souAdmin())h+='<div class="pl-aviso">⚠️ A tabela de indicações ainda não existe. Rode o SQL pendente no Supabase.</div>';
    if(souAdmin())h+=painelIndAdmin();
    p.innerHTML=h;
  }
  function painelIndAdmin(){
    var t=IND.todas||[];
    return '<div class="in-adm"><b>Comercial · registrar indicação fechada</b><small>Ao salvar, o prêmio de 1 (e-book) e de 2 (Gênio) é liberado sozinho no e-mail de quem indicou.</small>'
      +'<div class="in-adm-f"><input id="in-ind" placeholder="E-mail de quem indicou" type="email"><input id="in-nome" placeholder="Nome do aluno que fechou"><input id="in-cup" placeholder="Cupom usado (opcional)"><button data-in="add">Registrar</button></div>'
      +(t.length?'<div class="in-adm-l">'+t.slice().reverse().map(function(x){return '<div><span>'+E(x.indicador_email)+' → <b>'+E(x.indicado_nome||'')+'</b>'+(x.cupom?' · '+E(x.cupom):'')+'</span><button data-in="del" data-id="'+x.id+'">✕</button></div>';}).join('')+'</div>':'')+'</div>';
  }
  async function liberar(email,produto,pedido){
    try{var r=await window._sb.from('compras').upsert({pedido:pedido,email:email,produto_id:'indicacao',produto:produto});return !r.error;}catch(e){return false;}
  }
  document.addEventListener('click',async function(e){
    var b=e.target.closest('[data-in]');if(!b)return;var a=b.dataset.in;
    if(a==='zap'){wa(msgIndicacao(),false);return;}
    if(a==='copiar'){var cod=meuCupom().cod;try{await navigator.clipboard.writeText(cod);toast('Cupom copiado: '+cod,'#10b981');}catch(err){toast('Seu cupom: '+cod);}return;}
    if(a==='add'){
      var em=($('in-ind').value||'').trim().toLowerCase(),nm=($('in-nome').value||'').trim(),cp=($('in-cup').value||'').trim().toUpperCase();
      if(!/@/.test(em)||!nm){toast('Preencha o e-mail de quem indicou e o nome do aluno','#ef4444');return;}
      b.disabled=true;
      var r=await window._sb.from('mi_indicacoes').insert({indicador_email:em,indicado_nome:nm,cupom:cp||null});
      if(r.error){b.disabled=false;toast('Não salvou: '+r.error.message,'#ef4444');return;}
      await carregarInd();
      var qt=IND.todas.filter(function(x){return String(x.indicador_email).toLowerCase()===em;}).length,cfgI=(AS().cfg||{}).indicacao||{},msg='✅ Indicação registrada ('+qt+'ª)';
      if(qt===1&&await liberar(em,cfgI.ebook||'Passaporte do Inglês','IND1-'+em))msg+=' · e-book de viagem liberado';
      if(qt===2&&await liberar(em,'Plano Gênio','IND2-'+em))msg+=' · Gênio liberado';
      if(qt===5)msg+=' · lembrete: dar +3 meses grátis';
      toast(msg,'#10b981');renderIndicar();return;
    }
    if(a==='del'){var r2=await window._sb.from('mi_indicacoes').delete().eq('id',b.dataset.id);if(r2.error){toast(r2.error.message,'#ef4444');return;}await carregarInd();renderIndicar();}
  });
  document.addEventListener('click',async function(e){
    var b=e.target.closest('[data-hm]');if(!b)return;
    var a=b.dataset.hm;
    if(a==='check'){go('maratona');var k=ctxAtual();if(k)setTimeout(function(){escolherCtxNaMaratona(k);},200);}
    else if(a==='lives')go('lives');
    else if(a==='maratona-10'){var nv=document.getElementById('mt10-nav');if(nv&&window.goTo)goTo('mt10',nv);}
    else if(a==='modulos')go('modulos');
    else if(a==='abrir'){var it=FLAT&&FLAT[hmIdx];if(it)abrirAula(it.m.id,it.l.id);}
    else if(a==='ant'){if(hmIdx>0){hmIdx--;pintarAula();}}
    else if(a==='prox'){if(FLAT&&hmIdx<FLAT.length-1){hmIdx++;pintarAula();}}
    else if(a==='duvida'){if(window.aiToggle)aiToggle();}
    else if(a==='jogos'||a==='prompts'||a==='eom'||a==='culture'||a==='viagens')go(a);
    else if(a==='video')mostrarBoasVindas(true);
    else if(a==='indicar')go('indicar');
    else if(a==='copiar'){try{await navigator.clipboard.writeText(linkIndicacao());toast('🔗 Link copiado!','#10b981');}catch(err){prompt('Copie o link:',linkIndicacao());}}
    else if(a==='instalar'){if(deferredInstall){deferredInstall.prompt();deferredInstall=null;}renderHome();}
    else if(a==='instalar-x'){LS.set('mi_install_x',true);renderHome();}
  });

  /* barra da direita (computador): só dado real */
  function pintarRail(){
    var r=document.querySelector('.right-rail');if(!r||!U)return;
    var sq=sequencia(),pc=progCtx(),off=138.2*(1-pc.pct/100);
    var lv=proxLives().slice(0,3);
    r.innerHTML='<div><div class="rail-hd">Progresso</div>'
      +'<div class="streak-card" style="margin-bottom:12px"><div class="streak-val">'+sq.n+IC('fogo','lg')+'</div><div><div style="font-size:13px;font-weight:700;margin-bottom:2px">'+(sq.n===1?'Dia seguido':'Dias seguidos')+'</div><div style="font-size:11px;color:var(--fg2)">'+(sq.hoje?'Hoje já conta. Volte amanhã!':'Faça 1 tarefa hoje pra '+(sq.n?'manter':'começar'))+'</div></div></div>'
      +'<div class="card-sm" style="cursor:pointer" data-hm="check"><div style="display:flex;align-items:center;gap:12px"><svg width="52" height="52" viewBox="0 0 52 52"><circle cx="26" cy="26" r="22" fill="none" stroke="var(--border)" stroke-width="5"/><circle cx="26" cy="26" r="22" fill="none" stroke="#10b981" stroke-width="5" stroke-dasharray="138.2" stroke-dashoffset="'+off.toFixed(1)+'" stroke-linecap="round" transform="rotate(-90 26 26)"/><text x="26" y="31" text-anchor="middle" font-size="11" font-weight="800" fill="var(--fg)" font-family="inherit">'+pc.pct+'%</text></svg>'
      +'<div><div style="font-size:13px;font-weight:700;margin-bottom:3px">Checklist de hoje</div><div style="font-size:11px;color:var(--fg2)">'+pc.feitos+' de '+pc.tot+' · '+E((CTX.filter(function(x){return x.k===pc.k;})[0]||CTX[0]).lb)+'</div></div></div></div></div>'
      +evolucaoHTML()
      +'<div id="rail-mt"></div>'
      +'<div class="rail-soc"><a href="https://www.youtube.com/@teachergediel" target="_blank" rel="noopener" title="YouTube" aria-label="YouTube">'+IC('yt-real')+'</a>'
      +'<a href="https://instagram.com/englishbygediel" target="_blank" rel="noopener" title="Instagram" aria-label="Instagram">'+IC('ig-real')+'</a>'
      +'<button data-hm="indicar" title="Indicar um amigo" aria-label="Indicar um amigo">'+IC('indicar')+'</button></div>';
    pintarMaratonaRail();
  }
  function evolucaoHTML(){
    var hoje=new Date();hoje.setHours(12,0,0,0);var bars='',ativos=0,soma=0,N=14,ini=null;
    var sem=['D','S','T','Q','Q','S','S'];
    for(var k=N-1;k>=0;k--){var d=new Date(hoje);d.setDate(d.getDate()-k);var v=valDia(dia(d));if(v>0)ativos++;soma+=v;
      bars+='<i class="'+(k===0?'hj':'')+'" title="'+d.toLocaleDateString('pt-BR',{day:'numeric',month:'short'})+'" style="height:'+Math.max(6,Math.round(v*100))+'%;opacity:'+(v>0?1:.28)+'"></i>';}
    var lbl='';for(var k2=N-1;k2>=0;k2--){var d2=new Date(hoje);d2.setDate(d2.getDate()-k2);lbl+='<b>'+sem[d2.getDay()]+'</b>';}
    var med=Math.round(soma/N*100),vistas=(ST.vistas||[]).length,sq=sequencia();
    return '<div><div class="rail-hd">Sua evolução</div><div class="rail-evo">'
      +'<div class="re-top"><div><strong>'+ativos+'</strong><span>de 14 dias ativos</span></div><div><strong>'+med+'%</strong><span>checklist médio</span></div></div>'
      +'<div class="re-bars">'+bars+'</div><div class="re-lbl">'+lbl+'</div>'
      +'<div class="re-st"><div><strong>'+vistas+'</strong><span>aulas vistas</span></div><div><strong>'+(ST.dias||[]).length+'</strong><span>dias de estudo</span></div></div>'
      +'</div></div>';
  }
  async function pintarMaratonaRail(){
    var box=document.getElementById('rail-mt');if(!box||!window.EBG_MARATONA)return;
    var m=await window.EBG_MARATONA.resumo();box=document.getElementById('rail-mt');if(!box||!m)return;
    var cab='🏁 Maratona · ciclo '+m.ciclo;
    box.innerHTML='<div class="rail-hd">Maratona 10 meses</div><div class="rail-mt" data-hm="maratona-10"><div class="rm-pos">'+(m.pos?'<strong>'+m.pos+'º</strong><span>de '+m.total+'</span>':'<strong>—</strong><span>sem pontos ainda</span>')+'</div>'
      +'<div class="rm-i"><div class="rm-t">'+cab+'</div><div class="rm-s">'+m.pts+' pts'+(m.pos>1&&m.falta?' · faltam '+m.falta+' pra subir':(m.pos===1?' · você lidera 👑':''))+'</div>'
      +'<div class="rm-b"><i style="width:'+Math.min(100,m.prog||0)+'%"></i></div></div></div>';
  }


  /* ───────────────────────── ENTRADA: boas-vindas + onde você está ───────────────────────── */
  var ent=document.createElement('div');ent.id='mi-entry';document.body.appendChild(ent);
  function abrirEntrada(html){ent.innerHTML='<div class="mi-ent-box">'+html+'</div>';ent.classList.add('on');ent.scrollTop=0;requestAnimationFrame(function(){ent.classList.add('vis');});}
  function fecharEntrada(cb){ent.classList.remove('vis');setTimeout(function(){ent.classList.remove('on');ent.innerHTML='';if(cb)cb();},330);}
  async function lerCfg(){
    try{var r=await window._sb.from('acesso').select('dados').eq('id','cfg').maybeSingle();CFG=(r.data&&r.data.dados)||{};}catch(e){CFG={};}
    return CFG;
  }
  async function mostrarBoasVindas(rever){
    await lerCfg();
    var id=window.ytId?ytId(CFG.videoBoasVindas||''):null;
    abrirEntrada('<span class="mi-logo mi-lg-ent"></span><div class="mi-ent-kicker">'+(rever?'Como usar o app':'Primeiro acesso')+'</div>'
      +'<div class="mi-ent-q">'+(rever?'Seu inglês, todo dia, em 4 passos':'Bem-vindo(a)'+(nomeCurto()?', '+E(nomeCurto()):'')+'! 🎉')+'</div>'
      +'<div class="mi-ent-s">Assista esse vídeo rapidinho: ele mostra tudo o que tem aqui dentro e como usar o app no seu dia.</div>'
      +'<div class="mi-video">'+(id?'<iframe src="https://www.youtube-nocookie.com/embed/'+id+'?rel=0&modestbranding=1" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>':'<div class="ph"><div style="font-size:40px">🎬</div>O vídeo de boas-vindas do Gediel entra aqui<div style="font-size:12px;font-weight:600;opacity:.85">Enquanto isso, o resumo está logo abaixo 👇</div></div>')+'</div>'
      +'<div class="mi-steps">'
      +'<div><b>📍</b><span><strong>Ao abrir o app</strong>, diga onde você está. Eu monto o checklist pro seu momento.</span></div>'
      +'<div><b>✅</b><span><strong>Checklist de hoje</strong>: o botão verde na tela inicial. Cada tarefa tem o passo a passo, o conteúdo e uma provinha.</span></div>'
      +'<div><b>🎬</b><span><strong>Sua aula</strong>: 2 aulas novas por semana. Use ◀ ▶ pra voltar ou avançar. Toda aula tem quiz e comentários.</span></div>'
      +'<div><b>📺</b><span><strong>Lives e dúvidas</strong>: entre ao vivo na sua turma e mande dúvidas no botão 🙋 a qualquer hora.</span></div>'
      +'</div>'
      +(rever?'<button class="mi-cta" data-ent="tour" style="margin-bottom:10px;background:linear-gradient(135deg,#4f6ef7,#8b5cf6);color:#fff">🧭 Fazer o tour pelos menus</button>':'')
      +'<button class="mi-cta" data-ent="bv-ok"'+(rever?' style="position:static;box-shadow:none;background:rgba(255,255,255,.12);color:#fff"':'')+'>'+(rever?'Fechar':'Entendi, bora começar →')+'</button>');
    ent.onclick=function(e){
      if(e.target.closest('[data-ent="tour"]')){fecharEntrada(function(){go('home');setTimeout(function(){tour('todos');},500);});return;}
      if(!e.target.closest('[data-ent="bv-ok"]'))return;
      if(rever){fecharEntrada();return;}
      ST.bv=true;salvar();perguntarContexto();
    };
  }
  function entradaIniciante(){
    tarefasDoDia('Primeiros passos');var t=(window.CTX_TASKS&&CTX_TASKS['Primeiros passos'])||[],v=Math.min(3,(ST.vistas||[]).length);
    abrirEntrada('<span class="mi-logo mi-lg-ent"></span><div class="mi-ent-kicker">'+E(saudacao())+(nomeCurto()?', '+E(nomeCurto()):'')+'</div>'
      +'<div class="mi-ent-q">Seus primeiros passos 🌱</div>'
      +'<div class="mi-ent-s">Antes de tudo, o básico bem feito. Até você assistir suas 3 primeiras aulas, o checklist é esse aqui, em qualquer lugar que você estiver. Depois eu libero os checklists por lugar.</div>'
      +'<div class="mi-ini-ent">'+(ST.idioma?'':'<div class="it idi"><span>'+IC('idioma')+'</span><div><b>Missão de início</b><small>Trocar o idioma do celular pra inglês</small></div></div>')
      +t.map(function(x){return '<div class="it"><span>'+x.icon+'</span><div><b>'+E(x.title)+'</b><small>'+E(x.sub)+'</small></div></div>';}).join('')
      +'<div class="pr"><i style="width:'+(v/3*100)+'%"></i></div><div class="prt">'+v+' de 3 aulas assistidas</div></div>'
      +'<button class="mi-cta" data-ent="ini" style="position:static">Bora começar →</button>'
      +'<button class="mi-ctx-skip" data-ent="olhar">Só vim dar uma olhada</button>');
    ent.onclick=function(e){
      var b=e.target.closest('[data-ent]');if(!b)return;var ini=b.dataset.ent==='ini';
      if(ini)LS.set('mi_ctx',{d:dia(),k:'Primeiros passos'});
      fecharEntrada(function(){if(ini){go('maratona');window.renderMarTasks('Primeiros passos');}else{go('home');renderHome();}pintarRail();setTimeout(tourAuto,700);});
    };
  }
  function perguntarContexto(){
    // iniciante: sem tela cheia na frente (atrapalhava a navegação). O checklist 'Primeiros passos' já fica valendo.
    if(iniciante()){LS.set('mi_ctx',{d:dia(),k:'Primeiros passos'});return perguntarTempo(function(){try{window.renderMarTasks('Primeiros passos');}catch(x){}fecharEntrada(function(){go('home');renderHome();pintarRail();setTimeout(tourAuto,700);});});}
    abrirEntrada('<span class="mi-logo mi-lg-ent"></span><div class="mi-ent-kicker">'+E(saudacao())+(nomeCurto()?', '+E(nomeCurto()):'')+'</div>'
      +'<div class="mi-ent-q">Onde você está agora?</div>'
      +'<div class="mi-ent-s">Escolha o mais parecido com onde você está ou o que está fazendo. Eu monto o checklist de hoje pra esse momento.</div>'
      +'<div class="mi-ctx">'+CTX.map(function(c,i){return '<button data-ent="ctx" data-k="'+E(c.k)+'" title="'+E(c.hint)+'" style="--c:'+ctxCor(c)+';animation-delay:'+(0.06+i*0.05)+'s"><span class="ic">'+ctxImg(c)+'</span><span class="tx">'+(acessos()>5&&CTX_EN[c.k]?'<span class="lb">'+E(CTX_EN[c.k])+'</span><span class="pt">'+E(c.lb)+'</span>':'<span class="lb">'+E(c.lb)+'</span>')+'</span></button>';}).join('')+'</div>'
      +'<button class="mi-ctx-skip" data-ent="ctx" data-k="">Só vim dar uma olhada</button>'
      +'<button id="mi-som" type="button" aria-label="Som dos ícones"></button>');
    if(window.EBG_FX)EBG_FX.pintaBotao();
    ent.onclick=function(e){
      var b=e.target.closest('[data-ent="ctx"]');if(!b||ent.dataset.indo)return;
      var k=b.dataset.k;
      if(k)LS.set('mi_ctx',{d:dia(),k:k});if(k==='Na igreja')LS.set('mi_fe',true);
      var ir=function(){ent.dataset.indo='';var ap=function(){var kk=k||ctxAtual();if(kk)escolherCtxNaMaratona(kk);fecharEntrada(function(){go('home');renderHome();pintarRail();setTimeout(tourAuto,700);if(k)toast('✅ Checklist pronto: '+(CTX.filter(function(x){return x.k===k;})[0].lb)+' · '+tempoUso()+' min','#10b981');});};if(k==='Só 5 minutos'){guardarTempo(5);ap();}else perguntarTempo(ap);};
      ent.dataset.indo='1';
      ir();
    };
  }
  var entrou=false;
  function entrar(user){
    if(entrou||!user)return;entrou=true;contaAcesso();
    carregarEstado(user);restaurarChecks();pintarPerfil();iniciarEdicao();
    pintarRail();renderHome();
    var m0=window.EBG_MODO&&EBG_MODO.rapido(user);
    var seguir=function(){if(!ST.bv)mostrarBoasVindas(false);else perguntarContexto();};
    var rodar=function(){
      if(m0){EBG_MODO.aplicar();EBG_MODO.irPara(m0);return;}   // aluno do English on Mission / Culture: entra direto no universo dele
      if(!ST.onb)setTimeout(function(){conhecer(seguir);},60);else seguir();
    };
    // tutorial do plano da pessoa (primeiro acesso ou "o que mudou" depois de um upgrade); quem já tem universo cai nele na hora e vê o tutorial por cima
    if(window.EBG_TUT){if(m0){rodar();EBG_TUT.iniciar(user,function(){});}else EBG_TUT.iniciar(user,rodar);}else rodar();
  }
  var setUIOrig=window.setUserUI,pend=null;
  window.setUserUI=function(user){setUIOrig(user);pend=user;};
  var hideOrig=window.hideLogin;
  window.hideLogin=function(){hideOrig();if(pend)entrar(pend);};
  var showOrig=window.showLogin;
  if(showOrig)window.showLogin=function(){entrou=false;U=null;showOrig();};
  // sessão que já tinha sido restaurada antes deste arquivo carregar
  window._sb.auth.getSession().then(function(r){
    var s=r.data&&r.data.session;
    if(s)entrar(s.user);
  });

  /* ───────────────────────── UNIVERSOS ───────────────────────── */
  var UNIV={
    eom:{icon:'🙏',nav:'English On Mission',title:'English On Mission',sub:'Inglês com a Bíblia: devocionais, aulas, materiais e comunidade',cor:'linear-gradient(135deg,#15281f,#2f6b4f)'},
    culture:{icon:'🎬',nav:'Culture English',title:'Culture English',sub:'Inglês de verdade com séries, filmes e música',cor:'linear-gradient(135deg,#1b2a6b,#4f6ef7)'},
    viagens:{icon:'✈️',nav:'Viagens',title:'Viagens e Intercâmbio',sub:'Tudo pra você viajar sem travar: do planejamento ao inglês da rua',cor:'linear-gradient(135deg,#0c4a6e,#0ea5e9)'}
  };
  var AREAS={jogos:'🎮 Jogos',materiais:'📦 Materiais',devocionais:'🙏 Devocionais (lista do YouTube)',modulos:'📚 Módulos',lives:'📺 Lives',maratona:'✅ Checklist de hoje',prompts:'🤖 Prompts',bussola:'🧭 Bússola CEFR',prisma:'🔷 Prisma de Talentos'};
  var CARDS=null,MODS_ALL=null;
  async function carregarCards(force){
    if(CARDS&&!force)return CARDS;
    var r=await window._sb.from('mi_uni_cards').select('*').order('ord').order('created_at');
    CARDS=r.error?[]:(r.data||[]);CARDS._erro=r.error;window._CARDS=CARDS;
    return CARDS;
  }
  async function carregarModsAll(force){
    if(MODS_ALL&&!force)return MODS_ALL;
    var r=await window._sb.from('mi_modules').select('*').order('ord');MODS_ALL=r.data||[];return MODS_ALL;
  }
  function temProduto(trecho){
    var S=(window.EBG_ACESSO||{}).estado||{};if(S.tudo)return true;
    // vários trechos separados por vírgula (ex.: "Bíblia Linear, English on Mission"): vale qualquer um
    return String(trecho||'').toLowerCase().split(',').map(function(x){return x.trim();}).filter(Boolean).some(function(t){
      return (S.compras||[]).some(function(c){return (c.produto||'').toLowerCase().indexOf(t)>=0;})||String(S.meta||'').toLowerCase().indexOf(t)>=0;});
  }
  function souAdmin(){var S=(window.EBG_ACESSO||{}).estado||{};return !!(window._isAdmin||S.admin);}
  function cardSoon(c){return c.em_breve||((c.acao==='link'||c.acao==='curso')&&!c.valor);}
  function cardLock(c){if(c.acao!=='curso'||!c.valor)return false;var m=(MODS_ALL||[]).filter(function(x){return x.id===c.valor;})[0];return !!(m&&!souAdmin()&&!temProduto(m.produto));}
  function acaoTxt(c){
    if(cardSoon(c))return 'Me avise quando sair ›';
    if(c.acao==='curso')return cardLock(c)?'Quero esse mini curso ›':'Abrir mini curso ›';
    if(c.acao==='area')return 'Abrir ›';
    if(c.acao==='whatsapp')return 'Chamar no WhatsApp ›';
    if(c.acao==='playlist')return 'Assistir os vídeos ›';
    return /^R\$/.test(c.tag||'')?'Comprar ›':'Acessar ↗';
  }
  function seloRede(c){
    var v=String(c.valor||'');
    if(/spotify\.com/i.test(v))return 'sp-real';if(/youtu\.?be/i.test(v))return 'yt-real';if(/instagram\.com/i.test(v))return 'ig-real';
    if(c.acao==='whatsapp'||/chat\.whatsapp|wa\.me/i.test(v))return 'wa-real';return '';
  }
  function cardHtml(c,i){
    var buy=/^R\$/.test(c.tag||''),free=/gr[aá]tis/i.test(c.tag||''),sl=seloRede(c);
    return '<div class="uni-card'+(cardSoon(c)?' soon':'')+(buy?' buy':'')+(free?' free':'')+(cardLock(c)?' lock':'')+(c.ativo===false?' mi-off':'')+'" data-unicard="'+c.id+'">'+edCtl('card',c.id)
      +'<div class="th">'+(c.capa_url?'<img loading="lazy" alt="" src="'+E(c.capa_url)+'">':(window.capaAuto?capaAuto(c.titulo,i):E(c.emoji||'✨')))+(c.tag?'<span class="tg'+(free?' free':'')+'">'+(free?'✓ ':'')+E(c.tag)+'</span>':'')+(sl?'<span class="selo"><img alt="" src="img/icons/'+sl+'.svg"></span>':'')+'</div>'
      +'<div class="bd"><div class="tt">'+E(c.titulo)+'</div><div class="ss">'+E(c.descricao||'')+'</div><div class="ac">'+acaoTxt(c)+'</div></div></div>';
  }
  async function desenharUni(k){
    var u=UNIV[k],p=$('pane-'+k);if(!u||!p)return;
    p.innerHTML='<div style="font-size:21px;font-weight:800;margin-bottom:4px">'+E(u.title)+'</div><div style="font-size:13px;color:var(--fg2);margin-bottom:18px">'+E(u.sub)+'</div><div class="admin-loading">Carregando…</div>';
    await Promise.all([carregarCards(),carregarModsAll()]);
    var lista=CARDS.filter(function(c){return c.universo===k&&(c.ativo!==false||EDIT)&&!(k==='eom'&&!EDIT&&/^(jogos|assinar o english on mission)$/i.test((c.titulo||'').trim()));});
    var h='<div style="font-size:21px;font-weight:800;margin-bottom:4px">'+E(u.title)+'</div><div style="font-size:13px;color:var(--fg2);margin-bottom:18px">'+E(u.sub)+'</div>';
    var HERO=heroUni(k,u,lista);if(HERO)h=HERO;
    if(CARDS._erro){p.innerHTML=h+'<div class="admin-loading">'+(souAdmin()?'Rode o arquivo COLE-NO-SUPABASE.sql no Supabase pra ativar os Universos.':'Em instantes tem conteúdo novo aqui 🙂')+'</div>';return;}
    lista.filter(function(c){return c.destaque;}).forEach(function(c){
      h+='<div class="uni-hero'+(c.ativo===false?' mi-off':'')+'" style="background:'+u.cor+';position:relative" data-unicard="'+c.id+'">'+edCtl('card',c.id)+(c.capa_url?'<img alt="" src="'+E(c.capa_url)+'">':'')+'<div><div class="ht">'+E(c.emoji?c.emoji+' ':'')+E(c.titulo)+'</div><div class="hs">'+E(c.descricao||'')+'</div></div><button>'+E(acaoTxt(c).replace(/ [›↗]$/,''))+'</button></div>';
    });
    var resto=lista.filter(function(c){return !c.destaque;}),secs=[],por={};
    resto.forEach(function(c){var s=c.secao||'';if(!por[s]){por[s]=[];secs.push(s);}por[s].push(c);});
    if(k==='eom'){secs=[''];por={'':resto};}
    var n=0;secs.forEach(function(s,si){h+=(s?'<div class="uni-sec" id="sec-'+k+'-'+si+'">'+E(s)+'</div>':'')+'<div class="uni-grid'+(k==='eom'?' uni-std':'')+'">'+por[s].map(function(c){return cardHtml(c,n++);}).join('')+(EDIT?'<button class="mi-novo" data-ed="card-novo" data-uni="'+k+'" data-sec="'+E(s)+'">＋ Novo card'+(s?' em '+E(s):'')+'</button>':'')+'</div>';});
    if(EDIT){h=h.replace('<div style="font-size:21px;font-weight:800;margin-bottom:4px">'+E(u.title)+'</div>','<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:4px"><div style="font-size:21px;font-weight:800">'+E(u.title)+'</div><button class="admin-btn admin-btn-ghost admin-btn-sm" data-ed="menu-ed" data-k="'+k+'">✏️ Nome, frase e acesso</button></div>');if(!secs.length)h+='<div class="uni-grid"><button class="mi-novo" data-ed="card-novo" data-uni="'+k+'">＋ Novo card</button></div>';}
    if(!lista.length&&!EDIT)h+='<div class="admin-loading">Nenhum card ainda.'+(souAdmin()?' Toque em ✏️ Editar, lá em cima, pra criar.':'')+'</div>';
    if(lista.some(function(c){return /indica/i.test(c.tag||'');}))h+='<div style="font-size:10.5px;color:var(--fg3);margin-top:16px">Indicação = link de afiliado. Você paga o mesmo preço e eu posso receber uma comissão.</div>';
    p.innerHTML=h;
    if(k==='eom'&&window.EBG_EOM)window.EBG_EOM.compor(p);
    if(HERO){tickCd();var nav=p.querySelector('.th-nav');if(nav)nav.innerHTML=(k==='eom'?'<button data-goto="eom-mural">Mural</button>':'')+secs.map(function(s,si){return s?'<button data-goto="sec-'+k+'-'+si+'">'+E(s)+'</button>':'';}).join('');}
  }
  /* universos com cara de site próprio: EOM verde-escuro e dourado, Culture azul e vermelho */
  function heroUni(k,u,lista){
    var cf=(AS().cfg||{});
    if(k==='eom'){
      var membro=temProduto((cf.eom||[]).concat(['English on Mission']).join(','));
      var S0=AS(),ehM=membro||S0.programa||S0.tudo||souAdmin();
      var nm0=((U&&U.user_metadata&&(U.user_metadata.full_name||U.user_metadata.name))||'').trim().split(/\s+/)[0]||'';
      var VERH='<svg class="th-selo" viewBox="0 0 24 24" aria-label="Membro verificado"><path d="M12 1.8l2.6 1.9 3.2-.1 1 3.1 2.6 1.9-1 3.1 1 3.1-2.6 1.9-1 3.1-3.2-.1L12 22.2l-2.6-1.9-3.2.1-1-3.1-2.6-1.9 1-3.1-1-3.1 2.6-1.9 1-3.1 3.2.1z" fill="#d4b25c"/><path d="M8 12.3l2.7 2.7L16.2 9.5" fill="none" stroke="#14261c" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      var sau=ehM?'<div class="th-sau"><span>Graça e paz, <b>'+E(nm0||'amigo(a)')+'</b></span>'+VERH+'<small>Que bom ter você nessa missão. 🙏</small></div>':'';
      membro=ehM;
      return '<div class="th-hero th-eom"><span class="mi-logo th-marca" aria-hidden="true"></span>'+sau+'<div class="th-k" data-tx="eom-k">English on Mission</div>'
        +'<h1 data-tx="eom-h1">Toda língua tem um propósito.<br><em>A sua tem uma missão.</em></h1>'
        +'<p data-tx="eom-p">Inglês com a Bíblia: devocionais ao vivo, aulas, pregações, livros e uma comunidade que aprende junto.</p>'
        +'<div class="th-ver" data-tx="eom-ver">“Ide por todo o mundo e pregai o evangelho a toda criatura.” <b>Marcos 16:15</b></div>'
        +'<div class="th-cta">'+(membro?'':(cf.checkoutEom?'<a class="th-b1" target="_blank" rel="noopener" href="'+E(cf.checkoutEom)+'">Assinar o English on Mission</a>':''))
        +'<button class="th-b2" data-th="grupo">'+IC('wa-real')+' Grupo no WhatsApp</button></div>'
        +(EDIT?'<button class="admin-btn admin-btn-ghost admin-btn-sm" style="margin-top:12px" data-ed="menu-ed" data-k="eom">✏️ Nome, frase e acesso do menu</button>':'')
        +'<div class="th-nav"></div></div>';
    }
    if(k==='culture'){
      return '<div class="th-hero th-cult"><div class="th-film"></div><div class="th-k">Culture English</div>'
        +'<h1>INGLÊS DE <span>VERDADE</span></h1>'
        +'<p>'+E(u.sub||'Séries, filmes e música como sala de aula.')+'</p>'
        +(function(){var lv=(window.LIVES||[]).filter(function(x){return x.id==='series';})[0];if(!lv||!window.nextOccurrence)return '';var nx=nextOccurrence(lv);
          return '<div class="th-prox"><span>Próximo encontro · '+E(dayLabel(nx))+' às '+lv.startH+'h</span><div class="lv-cd" data-at="'+nx.getTime()+'"></div></div>';})()
        +'<div class="th-cta th-icbtns"><button class="th-ib" data-th="live">'+IC('lives')+'<b>Lives</b></button><button class="th-ib" data-th="filmes">'+IC('culture')+'<b>Filmes por nível</b></button><button class="th-ib" data-th="jogos">'+IC('jogos')+'<b>Jogos</b></button></div>'
        +(EDIT?'<button class="admin-btn admin-btn-ghost admin-btn-sm" style="margin-top:12px" data-ed="menu-ed" data-k="culture">✏️ Nome, frase e acesso do menu</button>':'')
        +'<div class="th-nav"></div><div class="th-film b"></div></div>';
    }
    return '';
  }
  document.addEventListener('click',function(e){
    var g=e.target.closest('[data-goto]');if(g){var el=$(g.dataset.goto);if(el)el.scrollIntoView({behavior:'smooth',block:'start'});return;}
    var t=e.target.closest('[data-th]');if(!t)return;var a=t.dataset.th;
    if(a==='grupo')abrirGrupo();
    else if(a==='live')go('lives');else if(a==='jogos')go('jogos');else if(a==='filmes')go('filmes');
  });
  function ofertaMini(m,c){
    var ov=$('pw-ov');if(!ov){if(m.checkout)window.open(m.checkout,'_blank','noopener');return;}
    ov.innerHTML='<div class="pw"><div style="font-size:40px">'+E(c.emoji||'🎬')+'</div><h3>'+E(c.titulo)+'</h3><p>'+E(c.descricao||'')+'</p>'
      +(m.checkout?'<a class="ir" target="_blank" rel="noopener" href="'+E(m.checkout)+'">Quero esse mini curso</a>':'<a class="ir" target="_blank" rel="noopener" href="https://wa.me/'+WA+'?text='+encodeURIComponent('Oi Gediel! Quero ser avisado quando o mini curso '+c.titulo+' abrir.')+'">Me avise quando abrir</a>')
      +'<p style="font-size:11.5px;margin:12px 0 0">Já comprou? Ele libera sozinho com o mesmo e-mail da compra. Se não aparecer, me chama no 🙋.</p><button class="nao" data-fechar>Agora não</button></div>';
    ov.classList.add('open');
  }
  async function abrirCard(id,uni){
    var c=(CARDS||[]).filter(function(x){return x.id===id;})[0];if(!c)return;
    if(cardSoon(c)){wa('Oi Gediel! Quero ser avisado quando sair: '+c.titulo+'.');return;}
    if(c.acao==='whatsapp'){wa(c.valor||('Oi Gediel! Vim pelo app: '+c.titulo));return;}
    if(c.acao==='area'){window._voltaPend={uni:uni,nome:UNIV[uni].title,pill:pill(uni)};go(c.valor);return;}
    if(c.acao==='curso'){
      await carregarModsAll();var m=MODS_ALL.filter(function(x){return x.id===c.valor;})[0];
      if(!m){toast('Esse mini curso ainda está sendo preparado 🙏');return;}
      if(!souAdmin()&&!temProduto(m.produto)){ofertaMini(m,c);return;}
      abrirAula(m.id,null,{uni:uni,nome:UNIV[uni].title,pill:pill(uni)});return;
    }
    if(c.valor)window.open(c.valor,'_blank','noopener');
  }
  document.addEventListener('click',function(e){
    var el=e.target.closest('[data-unicard]');if(!el)return;
    var pane=el.closest('.pane');abrirCard(el.dataset.unicard,pane?pane.id.replace('pane-',''):'eom');
  });

  /* menu lateral: Prompts + seção Universos */
  function montarMenu(){
    if($('pane-eom'))return;
    var perfil=[].filter.call(document.querySelectorAll('.nav-section'),function(s){return /perfil/i.test(s.textContent);})[0];
    var mat=pill('materiais'),matPane=$('pane-materiais');
    if(!perfil||!mat||!matPane)return;
    var pp=document.createElement('div');pp.className='nav-pill';pp.setAttribute('onclick',"goTo('prompts',this)");pp.innerHTML='<span class="nav-icon">🤖</span><span>Prompts</span>';
    mat.insertAdjacentElement('afterend',pp);
    var pr=document.createElement('div');pr.className='pane';pr.id='pane-prompts';
    pr.innerHTML='<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:14px"><div><div style="font-size:21px;font-weight:800">Central de Prompts</div><div style="font-size:13px;color:var(--fg2)">Escolha, personalize, copie e cole no ChatGPT ou no Claude.</div></div><a class="back-btn" style="margin:0;text-decoration:none" href="central-prompts.html" target="_blank" rel="noopener">Abrir em tela cheia ↗</a></div><iframe class="mi-frame" title="Central de Prompts" loading="lazy" data-src="central-prompts.html"></iframe>';
    matPane.insertAdjacentElement('afterend',pr);
    var pfl=document.createElement('div');pfl.className='pane';pfl.id='pane-filmes';pr.insertAdjacentElement('afterend',pfl);
    var pa=document.createElement('div');pa.className='nav-pill';pa.setAttribute('onclick',"goTo('agendar',this)");pa.innerHTML='<span class="nav-icon">📅</span><span>Marcar aula</span>';
    pp.insertAdjacentElement('afterend',pa);
    var pag=document.createElement('div');pag.className='pane';pag.id='pane-agendar';pr.insertAdjacentElement('afterend',pag);
    var pl=document.createElement('div');pl.className='nav-pill';pl.setAttribute('onclick',"goTo('planos',this)");pl.innerHTML='<span class="nav-icon">👑</span><span>Planos</span>';
    pa.insertAdjacentElement('afterend',pl);
    var ppl=document.createElement('div');ppl.className='pane';ppl.id='pane-planos';pag.insertAdjacentElement('afterend',ppl);
    var pin=document.createElement('div');pin.className='nav-pill';pin.setAttribute('onclick',"goTo('indicar',this)");pin.innerHTML='<span class="nav-icon">🎁</span><span>Indique e ganhe</span>';
    pl.insertAdjacentElement('afterend',pin);
    var pind=document.createElement('div');pind.className='pane';pind.id='pane-indicar';ppl.insertAdjacentElement('afterend',pind);
    var sec=document.createElement('div');sec.className='nav-section';sec.textContent='Universos';
    perfil.insertAdjacentElement('beforebegin',sec);
    var ant=sec,antPane=pr;
    Object.keys(UNIV).forEach(function(k){
      var u=UNIV[k],p=document.createElement('div');p.className='nav-pill';p.setAttribute('onclick',"goTo('"+k+"',this)");
      p.innerHTML='<span class="nav-icon">'+u.icon+'</span><span>'+E(u.nav)+'</span>';ant.insertAdjacentElement('afterend',p);ant=p;
      var pane=document.createElement('div');pane.className='pane';pane.id='pane-'+k;antPane.insertAdjacentElement('afterend',pane);antPane=pane;
    });
    if(window.TITLES){TITLES.prompts='Prompts';TITLES.filmes='Filmes por nível';TITLES.agendar='Marcar aula';TITLES.planos='Planos';TITLES.indicar='Indique e ganhe';Object.keys(UNIV).forEach(function(k){TITLES[k]=UNIV[k].title;});TITLES.home='Início';}
  }
  montarMenu();iconesMenu();iconesTopo();

  /* ───────────────────────── MARCAR AULA ─────────────────────────
     Os horários vêm da mesma agenda que o Gediel abre no painel do site (Supabase do hub, tabela horarios).
     Reservar usa a função reservar_horario: o horário some pra todo mundo e aparece no painel como "🎓 Aluno · tipo". */
  var HUB_URL='https://iwivldvubmsqyzkkdxoy.supabase.co',HUB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3aXZsZHZ1Ym1zcXl6a2tkeG95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1OTE1MDgsImV4cCI6MjEwODE2NzUwOH0.eyoyRBBp4NAfLhG-ops6cj2-xck61Oalsj3d7h3h360';
  var TIPOS=[
    {k:'conversa',ic:'💬',icn:'aula-conversa',nm:'Conversação',d:'Você e eu, 1 a 1, pra soltar o inglês falando.'},
    {k:'grupo',ic:'👥',icn:'aula-grupo',nm:'Grupo',d:'Você + amigos, família ou colegas de trabalho.'},
    {k:'casal',ic:'💑',icn:'aula-casal',nm:'Casal',d:'Os dois juntos, no mesmo ritmo.'},
    {k:'intensivo',ic:'🔥',icn:'fogo',nm:'Intensivo',d:'Imersão de vários dias seguidos, com prazo.'},
    {k:'prep',ic:'🎯',icn:'ctx-foco',nm:'Preparação',d:'Pra um momento específico que está chegando.'}
  ];
  var PREPS=['Entrevista de emprego','Viagem','Intercâmbio','Prova ou certificado','Apresentação ou reunião','Casamento ou evento','Outro'];
  var AG={tipo:null,prep:null,formato:'Online',pessoas:'2',horarios:[],dia:null,h:null,carregou:false,enviando:false};
  var fmtD=function(d){var x=d.toLocaleDateString('pt-BR',{weekday:'short',day:'numeric',month:'short'}).replace(/\./g,'');return x.charAt(0).toUpperCase()+x.slice(1);};
  var fmtH=function(d){return d.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});};
  var kD=function(d){return d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate();};
  function meusPedidos(){return LS.get('mi_pedidos_'+(U&&U.id||'x'),[]).filter(function(p){return new Date(p.inicio)>new Date(Date.now()-864e5);});}
  async function carregarHorariosHub(){
    try{
      var desde=new Date(Date.now()+3*36e5).toISOString();
      var r=await fetch(HUB_URL+'/rest/v1/horarios?select=id,inicio,duracao_min&reservado=eq.false&inicio=gt.'+encodeURIComponent(desde)+'&order=inicio.asc&limit=300',{headers:{apikey:HUB_KEY,Authorization:'Bearer '+HUB_KEY}});
      AG.horarios=r.ok?(await r.json()).map(function(h){h.data=new Date(h.inicio);return h;}):[];
      AG.erro=!r.ok;
    }catch(e){AG.horarios=[];AG.erro=true;}
    AG.carregou=true;
  }
  function tipoNome(){var t=TIPOS.filter(function(x){return x.k===AG.tipo;})[0];if(!t)return '';return t.k==='prep'?('Preparação'+(AG.prep?' · '+AG.prep:'')):t.nm;}
  async function renderAgendar(recarregar){
    var p=$('pane-agendar');if(!p)return;
    if(!AG.carregou||recarregar){p.innerHTML='<div class="ag-wrap"><div class="ag-h1">Marcar aula</div><div class="ag-sub">Carregando meus horários livres…</div></div>';await carregarHorariosHub();}
    pintarAgendar();
  }
  function podeMarcar(){var S=AS();return souAdmin()||!S.ok||!!S.programa||!!S.tudo;}
  function pintarAgendar(){
    var p=$('pane-agendar');if(!p)return;
    if(!podeMarcar()){p.innerHTML='<div class="ag-wrap"><div class="ag-h1">Marcar aula</div><div class="ag-box" style="text-align:center;padding:28px 18px">'+IC('agendar','xl')
      +'<div style="font-size:17px;font-weight:800;margin:10px 0 6px">Disponível a partir do Plano Inteligente</div><div style="font-size:13.5px;color:var(--fg2);line-height:1.6;max-width:420px;margin:0 auto 16px">Quem está no Inteligente ou acima pode pedir aula particular com o Gediel. A aula é paga à parte, com valor combinado direto com ele.</div>'
      +'<button class="pl-btn" style="--pc:#4f6ef7;max-width:280px;margin:0 auto" onclick="goTo(\'planos\')">Ver os planos</button></div></div>';return;}
    var meta=(U&&U.user_metadata)||{},nome=meta.full_name||meta.name||meta.nome||'',whats=LS.get('mi_whats_'+(U&&U.id||'x'),meta.whatsapp||'');
    var ped=meusPedidos();
    var h='<div class="ag-wrap"><div class="ag-h1">Marcar aula</div><div class="ag-sub">Escolha o tipo, o dia e o horário. Eu recebo na hora e te confirmo valor e link pelo WhatsApp.</div>'
      +'<div class="pl-aviso" style="margin:0 0 14px">'+IC('agendar')+'<div><b>Aula particular é paga à parte.</b> Ela não faz parte de nenhum plano. Pedir um horário não gera cobrança: eu te mando o valor antes e você decide.</div></div>';
    if(ped.length)h+='<div class="ag-box ag-ped"><div class="ag-t">'+IC('pin')+' Seus pedidos</div>'+ped.map(function(x){var d=new Date(x.inicio);return '<div class="ag-ped-l"><b>'+E(fmtD(d))+' · '+E(fmtH(d))+'</b> <span>'+E(x.tipo)+'</span></div>';}).join('')+'</div>';
    // 1. tipo
    h+='<div class="ag-box"><div class="ag-t"><span class="ag-n">1</span>Que aula você quer?</div><div class="ag-tipos">'
      +TIPOS.map(function(t){return '<button type="button" class="ag-tipo'+(AG.tipo===t.k?' on':'')+'" data-ag-tipo="'+t.k+'"><span class="ic">'+(t.icn?IC(t.icn):t.ic)+'</span><b>'+t.nm+'</b><small>'+t.d+'</small></button>';}).join('')+'</div>';
    if(AG.tipo==='prep')h+='<div class="ag-lb">Preparação pra quê?</div><div class="ag-chips">'+PREPS.map(function(x){return '<button type="button" class="ag-chip'+(AG.prep===x?' on':'')+'" data-ag-prep="'+E(x)+'">'+E(x)+'</button>';}).join('')+'</div>';
    if(AG.tipo==='grupo')h+='<div class="ag-lb">Quantas pessoas, contando você?</div><div class="ag-chips">'+['2','3','4','5','6+'].map(function(x){return '<button type="button" class="ag-chip'+(AG.pessoas===x?' on':'')+'" data-ag-pes="'+x+'">'+x+'</button>';}).join('')+'</div>';
    h+='</div>';
    // 2. detalhes
    h+='<div class="ag-box"><div class="ag-t"><span class="ag-n">2</span>Seus dados</div>'
      +'<div class="ag-grid"><label>Nome<input id="ag-nome" value="'+E(nome)+'" maxlength="120" placeholder="Seu nome"></label>'
      +'<label>WhatsApp<input id="ag-whats" value="'+E(whats)+'" inputmode="tel" maxlength="25" placeholder="(11) 99999-9999"></label></div>'
      +'<div class="ag-lb">Formato</div><div class="ag-chips">'+['Online','Presencial (Vinhedo/SP)'].map(function(x){return '<button type="button" class="ag-chip'+(AG.formato===x?' on':'')+'" data-ag-fmt="'+E(x)+'">'+E(x)+'</button>';}).join('')+'</div>'
      +'<label class="ag-full">O que você quer trabalhar? <span>(opcional)</span><textarea id="ag-obj" rows="3" maxlength="600" placeholder="Ex.: tenho entrevista em inglês dia 30, quero treinar perguntas de RH">'+E(AG.obj||'')+'</textarea></label></div>';
    // 3. horário
    h+='<div class="ag-box"><div class="ag-t"><span class="ag-n">3</span>Dia e horário</div>';
    if(!AG.horarios.length){
      h+='<div class="ag-vazio">'+(AG.erro?'Não consegui carregar a agenda agora.':'Estou sem horários abertos no momento.')+' Me chama no WhatsApp que a gente encaixa.</div>'
        +'<button type="button" class="ag-btn2" data-ag-zap>'+IC('wa-real')+' Combinar pelo WhatsApp</button>'+(AG.erro?' <button type="button" class="ag-btn2" data-ag-reload>↻ Tentar de novo</button>':'');
    }else{
      var dias=[];AG.horarios.forEach(function(x){var k=kD(x.data);if(!dias.some(function(d){return d.k===k;}))dias.push({k:k,data:x.data});});
      if(!dias.some(function(d){return d.k===AG.dia;})){AG.dia=dias[0].k;AG.h=null;}
      h+='<div class="ag-dias">'+dias.map(function(d){return '<button type="button" class="ag-dia'+(d.k===AG.dia?' on':'')+'" data-ag-dia="'+d.k+'">'+E(fmtD(d.data))+'</button>';}).join('')+'</div>'
        +'<div class="ag-horas">'+AG.horarios.filter(function(x){return kD(x.data)===AG.dia;}).map(function(x){return '<button type="button" class="ag-hora'+(x.id===AG.h?' on':'')+'" data-ag-h="'+x.id+'">'+E(fmtH(x.data))+'</button>';}).join('')+'</div>'
        +'<div class="ag-nota">O horário marca o começo da aula. Duração e valor eu confirmo com você no WhatsApp.</div>';
    }
    h+='</div>';
    if(AG.horarios.length){
      var hs=AG.horarios.filter(function(x){return x.id===AG.h;})[0];
      var falta=!AG.tipo?'Escolha o tipo de aula':(AG.tipo==='prep'&&!AG.prep)?'Escolha a preparação':!hs?'Escolha um horário':'';
      h+='<button type="button" class="ag-btn" data-ag-ok'+(falta||AG.enviando?' disabled':'')+'>'+(AG.enviando?'Reservando…':falta||(IC('agendar')+' Pedir aula · '+fmtD(hs.data)+' às '+fmtH(hs.data)))+'</button>';
    }
    h+='</div>';
    p.innerHTML=h;
  }
  function msgZap(hs){
    var nome=($('ag-nome')||{}).value||'';
    return 'Oi Gediel! Sou '+(nome||'aluno(a) da Plataforma')+' e '+(hs?'acabei de pedir uma aula pela plataforma.':'quero marcar uma aula.')
      +'\n\n• Tipo: '+(tipoNome()||'a definir')+(AG.tipo==='grupo'?' ('+AG.pessoas+' pessoas)':'')
      +'\n• Formato: '+AG.formato
      +(hs?'\n• Quando: '+fmtD(hs.data)+' às '+fmtH(hs.data):'')
      +(AG.obj?'\n• Objetivo: '+AG.obj:'');
  }
  async function pedirAula(){
    var hs=AG.horarios.filter(function(x){return x.id===AG.h;})[0];if(!hs||AG.enviando)return;
    var nome=$('ag-nome').value.trim(),whats=$('ag-whats').value.trim();
    AG.obj=$('ag-obj').value.trim();
    if(!nome){toast('Coloca seu nome','#ef4444');$('ag-nome').focus();return;}
    if(whats.replace(/\D/g,'').length<10){toast('Coloca seu WhatsApp com DDD','#ef4444');$('ag-whats').focus();return;}
    LS.set('mi_whats_'+(U&&U.id||'x'),whats);
    var modo=('Aluno · '+(AG.tipo==='prep'?'Prep. '+(AG.prep||''):tipoNome())+(AG.tipo==='grupo'?' ('+AG.pessoas+')':'')+(/Presencial/.test(AG.formato)?' · pres.':'')).slice(0,40);
    AG.enviando=true;pintarAgendar();
    var ok=false;
    try{
      var r=await fetch(HUB_URL+'/rest/v1/rpc/reservar_horario',{method:'POST',headers:{apikey:HUB_KEY,Authorization:'Bearer '+HUB_KEY,'Content-Type':'application/json'},
        body:JSON.stringify({p_horario:hs.id,p_nome:nome.slice(0,120),p_whatsapp:whats.slice(0,25),p_email:(U&&U.email)||null,p_instagram:null,p_modo:modo,p_lead:null})});
      ok=r.ok&&(await r.json())===true;
    }catch(e){ok=false;}
    AG.enviando=false;
    if(!ok){toast('Esse horário acabou de ser pego. Escolha outro 🙏','#ef4444');AG.h=null;return renderAgendar(true);}
    var ped=LS.get('mi_pedidos_'+(U&&U.id||'x'),[]);ped.push({inicio:hs.inicio,tipo:tipoNome()});LS.set('mi_pedidos_'+(U&&U.id||'x'),ped);
    var zap=msgZap(hs);
    $('pane-agendar').innerHTML='<div class="ag-wrap"><div class="ag-box ag-feito"><div class="ag-ok-ic">✅</div><div class="ag-h1">Pedido enviado!</div>'
      +'<p><b>'+E(tipoNome())+'</b> · '+E(fmtD(hs.data))+' às '+E(fmtH(hs.data))+' · '+E(AG.formato)+'</p>'
      +'<p class="ag-sub">O horário já ficou guardado pra você. Me manda a mensagem abaixo pra eu te confirmar valor e o link.</p>'
      +'<button type="button" class="ag-btn" data-ag-zapok>'+IC('wa-real')+' Mandar no WhatsApp</button><button type="button" class="ag-btn2" data-ag-novo>Marcar outra aula</button></div></div>';
    $('pane-agendar').querySelector('[data-ag-zapok]').onclick=function(){wa(zap);};
    AG.h=null;
  }
  document.addEventListener('click',function(e){
    var p=$('pane-agendar');if(!p||!p.contains(e.target))return;
    var b=e.target.closest('button');if(!b)return;
    var ob=$('ag-obj');if(ob)AG.obj=ob.value;
    if(b.dataset.agTipo){AG.tipo=b.dataset.agTipo;if(AG.tipo!=='prep')AG.prep=null;}
    else if(b.dataset.agPrep)AG.prep=b.dataset.agPrep;
    else if(b.dataset.agPes)AG.pessoas=b.dataset.agPes;
    else if(b.dataset.agFmt)AG.formato=b.dataset.agFmt;
    else if(b.dataset.agDia){AG.dia=b.dataset.agDia;AG.h=null;}
    else if(b.dataset.agH)AG.h=b.dataset.agH;
    else if(b.hasAttribute('data-ag-ok'))return pedirAula();
    else if(b.hasAttribute('data-ag-zap'))return wa(msgZap(null));
    else if(b.hasAttribute('data-ag-reload'))return renderAgendar(true);
    else if(b.hasAttribute('data-ag-novo'))return renderAgendar(true);
    else return;
    // guarda o que já foi digitado antes de redesenhar
    var n=$('ag-nome'),w=$('ag-whats'),nv=n&&n.value,wv=w&&w.value;
    pintarAgendar();
    if(nv!=null)$('ag-nome').value=nv;if(wv!=null)$('ag-whats').value=wv;
  });

  /* ───────────────────────── celular: menu de baixo + gaveta ───────────────────────── */
  var sb=document.querySelector('.sidebar'),shade=document.createElement('div');shade.id='mi-shade';document.body.appendChild(shade);
  var bnav=document.createElement('nav');bnav.id='mi-bnav';bnav.setAttribute('aria-label','Navegação');
  bnav.innerHTML=[['home','home','Início'],['maratona','check','Checklist'],['modulos','modulos','Aulas'],['lives','lives','Lives'],['menu','menu','Menu']].map(function(x){return '<button data-bn="'+x[0]+'"><span>'+IC(x[1])+'</span>'+x[2]+'</button>';}).join('');
  document.body.appendChild(bnav);
  function gaveta(on){if(!sb)return;sb.classList.toggle('mi-open',on);shade.classList.toggle('on',on);}
  bnav.addEventListener('click',function(e){var b=e.target.closest('[data-bn]');if(!b)return;var k=b.dataset.bn;if(k==='menu'){gaveta(!sb.classList.contains('mi-open'));return;}gaveta(false);go(k);});
  shade.addEventListener('click',function(){gaveta(false);});
  function marcarBnav(p){[].forEach.call(bnav.querySelectorAll('button'),function(b){b.classList.toggle('on',b.dataset.bn===p);});}

  /* navegação: desenha o que cada área precisa */
  var goAnt=window.goTo;
  /* botão "← voltar" flutuante: quando um card de um universo leva pra outra área do app (jogos, materiais, planos...) */
  function voltaUni(vp,page){
    var x=$('mi-volta-uni');if(x)x.remove();
    if(!vp||vp.uni===page)return;
    x=document.createElement('button');x.id='mi-volta-uni';x.type='button';x.textContent='← '+vp.nome;
    x.style.cssText='position:fixed;left:max(12px,env(safe-area-inset-left));top:calc(env(safe-area-inset-top,0px) + 66px);z-index:60;background:var(--accent);color:#fff;border:0;border-radius:99px;padding:9px 16px;font:inherit;font-size:13px;font-weight:800;box-shadow:0 6px 20px rgba(0,0,0,.3);cursor:pointer';
    x.onclick=function(){window.goTo(vp.uni,vp.pill);};
    document.body.appendChild(x);
  }
  window.goTo=function(page,el){
    gaveta(false);
    window._miniBack=null;
    var vp=window._voltaPend;window._voltaPend=null;voltaUni(vp,page);
    if(UNIV[page])desenharUni(page);
    if(page==='prompts'){if(window.EBG_PROMPTS_UI)EBG_PROMPTS_UI.render($('pane-prompts'),ST.nivel);else{var f=document.querySelector('#pane-prompts iframe');if(f&&!f.src)f.src=f.dataset.src;}}
    if(page==='filmes'&&window.EBG_FILMES_UI)EBG_FILMES_UI.render($('pane-filmes'),ST.nivel);
    if(page==='home')setTimeout(renderHome,160);
    if(page==='agendar')renderAgendar();
    if(page==='planos')renderPlanos();
    if(page==='indicar')renderIndicar();
    if(page==='bussola')renderBussola();
    if(page==='prisma')renderPrisma();
    var r=goAnt(page,el);
    marcarBnav(page);
    return r;
  };
  marcarBnav('home');

  /* ───────────────────────── JOGOS ───────────────────────── */
  var DATA={
    flash:[['I\'m running late','Estou atrasado(a)','Sorry, I\'m running late!'],['to get along with','Se dar bem com','I get along with my boss.'],['grateful','Grato(a)','I\'m grateful for my family.'],['by the way','A propósito','By the way, I loved your post.'],['to figure out','Descobrir / resolver','I need to figure out the problem.'],['deadline','Prazo final','The deadline is Friday.'],['tired','Cansado(a)','I\'m too tired to go out.'],['to look forward to','Estar ansioso(a) por (positivo)','I look forward to seeing you.'],['actually','Na verdade','Actually, I don\'t agree.'],['to hang out','Passar tempo junto, sair','Let\'s hang out this weekend.'],['overwhelmed','Sobrecarregado(a)','I feel overwhelmed at work.'],['to give up','Desistir','Never give up on your English!'],['worth it','Vale a pena','The trip was worth it.'],['to make sense','Fazer sentido','That makes sense.'],['meanwhile','Enquanto isso','Meanwhile, she was cooking.'],['to wake up','Acordar','I wake up at 6.'],['to be about to','Estar prestes a','I\'m about to leave.'],['instead of','Em vez de','Tea instead of coffee.'],['to catch up','Pôr o papo em dia / alcançar','Let\'s catch up soon!'],['blessed','Abençoado(a)','I feel blessed.'],['layover','Escala (viagem)','We have a 3-hour layover.'],['to be into something','Curtir algo','I\'m into jazz.'],['nevertheless','Mesmo assim','It was hard; nevertheless, we did it.'],['to look after','Cuidar de','She looks after her mom.']],
    ordem:[['I','am','learning','English','every','day'],['She','doesn\'t','like','coffee'],['Where','do','you','live'],['We','are','going','to','travel','next','year'],['I','have','never','been','to','London'],['Could','you','speak','more','slowly'],['He','was','sleeping','when','I','called'],['If','it','rains','I','will','stay','home'],['What','are','you','doing','right','now'],['I','usually','wake','up','at','seven']],
    complete:[['I ___ a teacher.',['am','is','are','be'],0],['She ___ in São Paulo.',['live','lives','living','is live'],1],['___ you like pizza?',['Does','Are','Do','Is'],2],['There ___ two cats in the house.',['is','are','be','am'],1],['I\'m ___ engineer.',['a','an','the','—'],1],['Yesterday I ___ to the beach.',['go','goes','went','gone'],2],['He can ___ English very well.',['speaks','speaking','to speak','speak'],3],['This book is ___. (meu)',['my','mine','me','I'],1],['How ___ water do you drink?',['many','much','more','long'],1],['I have lived here ___ 2019.',['for','since','from','at'],1],['If you study, you ___ pass.',['would','will','are','did'],1],['She is ___ than her brother.',['taller','more tall','tallest','tall'],0]],
    phrasal:[['"I gave up smoking."',['Comecei a fumar','Parei de fumar','Fumei muito','Odeio fumar'],1],['"Can you pick me up at 8?"',['Me buscar','Me ligar','Me levantar','Me esperar'],0],['"Let\'s put off the meeting."',['Começar','Adiar','Cancelar pra sempre','Gravar'],1],['"I ran into an old friend."',['Briguei com','Encontrei por acaso','Corri com','Liguei pra'],1],['"She looks after her grandma."',['Procura','Cuida de','Olha pra trás','Visita'],1],['"Turn off the lights."',['Acenda','Apague/desligue','Troque','Olhe'],1],['"I need to figure it out."',['Desenhar','Descobrir/resolver','Esquecer','Apagar'],1],['"We broke up last year."',['Terminamos','Viajamos','Casamos','Brigamos e voltamos'],0],['"Hold on a second."',['Desliga','Espera um pouco','Segura isso','Vai embora'],1],['"I get along with my coworkers."',['Brigo com','Me dou bem com','Trabalho para','Saio com'],1],['"Let\'s catch up tomorrow."',['Pegar algo','Pôr o papo em dia','Correr atrás','Cancelar'],1],['"Find out the answer."',['Esconder','Descobrir','Esquecer','Perguntar'],1]]
  };
  var JOGOS={'O que é isso?':'imagem','Ouça e Toque':'ouvir','Flashcards':'flash','Monta Frase':'ordem','Complete':'complete','Quiz Phrasal':'phrasal'};
  /* primeiras palavras: imagem + inglês + português (pra quem está começando do zero) */
  var VOCAB=[['🍎','apple','maçã'],['🐶','dog','cachorro'],['🐱','cat','gato'],['🏠','house','casa'],['🚗','car','carro'],['📚','book','livro'],['☕','coffee','café'],['🍞','bread','pão'],['💧','water','água'],['👟','shoes','sapatos'],['☀️','sun','sol'],['🌙','moon','lua'],['🍌','banana','banana'],['📱','phone','celular'],['🔑','key','chave'],['🚪','door','porta'],['🪑','chair','cadeira'],['🛏️','bed','cama'],['🥚','egg','ovo'],['🐟','fish','peixe'],['🌳','tree','árvore'],['⭐','star','estrela'],['🎂','cake','bolo'],['✈️','plane','avião'],['🚌','bus','ônibus'],['👶','baby','bebê'],['❤️','heart','coração'],['🍕','pizza','pizza'],['⚽','ball','bola'],['🌧️','rain','chuva'],['🧀','cheese','queijo'],['🥛','milk','leite'],['🍊','orange','laranja'],['🐦','bird','pássaro'],['👕','shirt','camisa'],['🌹','flower','flor'],['🐴','horse','cavalo'],['🌊','sea','mar'],['⛪','church','igreja'],['🍚','rice','arroz'],['🎁','gift','presente'],['🔥','fire','fogo']];
  function itensVocab(t){
    var alvo=shuf(VOCAB).slice(0,10);
    return alvo.map(function(v){
      var ops=shuf([v].concat(shuf(VOCAB.filter(function(x){return x!==v;})).slice(0,3)));
      return t==='imagem'?[v[0],ops.map(function(o){return o[1];}),ops.indexOf(v),v[1],v[2]]:[v[1],ops.map(function(o){return o[0];}),ops.indexOf(v),v[1],v[2]];
    });
  }
  function falar(w){try{var u=new SpeechSynthesisUtterance(w);u.lang='en-US';u.rate=.8;speechSynthesis.cancel();speechSynthesis.speak(u);}catch(e){}}
  window.miFalar=falar;
  var G=null,cur=null;
  var gv=document.createElement('div');gv.id='mi-game';document.body.appendChild(gv);
  var shuf=function(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;};
  function gTela(corpo){
    var pct=G.total?Math.round(G.i*100/G.total):0;
    gv.innerHTML='<div class="mg-top"><button class="x" data-g="sair" aria-label="Fechar">✕</button><div class="nm">'+E(G.nome)+'</div><div class="sc">'+G.pts+' pts</div></div><div class="mg-prog"><i style="width:'+pct+'%"></i></div><div class="mg-body"><div class="mg-in">'+corpo+'</div></div>';
  }
  function jogar(nome){
    var t=JOGOS[nome];if(!t)return false;
    var itens=(t==='imagem'||t==='ouvir')?itensVocab(t):t==='flash'?shuf(DATA.flash).slice(0,12).map(function(a){return {w:a[0],p:a[1],x:a[2],errou:false};}):shuf(DATA[t]).slice(0,t==='ordem'?8:10);
    G={nome:nome,t:t,itens:itens,i:0,total:itens.length,pts:0,fila:itens.slice(),acertos:0};
    gv.classList.add('on');document.body.style.overflow='hidden';passo();return true;
  }
  function passo(){
    if(G.t==='flash'){
      if(!G.fila.length)return fim();
      var c=G.fila[0];G.virou=false;
      gTela('<div class="mg-card" data-g="virar"><div class="h">Toque pra ver a tradução</div><div class="w">'+E(c.w)+'</div></div><div class="mg-fb">Pense na resposta antes de virar 🤔</div>');
      return;
    }
    if(G.i>=G.total)return fim();
    var it=G.itens[G.i];
    if(G.t==='ordem'){
      G.resp=[];G.bank=shuf(it.map(function(w,i){return {w:w,i:i};}));
      desenharOrdem();return;
    }
    var q=it[0],ops=it[1];
    if(G.t==='imagem'){gTela('<div class="mg-q">What is this?<br><span style="font-size:13px;color:var(--fg2);font-weight:600">O que é isso em inglês?</span></div><div class="mg-img">'+q+'</div>'+ops.map(function(o,i){return '<button class="mg-opt" data-g="op" data-i="'+i+'">'+E(o)+'</button>';}).join('')+'<div class="mg-fb"></div>');return;}
    if(G.t==='ouvir'){gTela('<div class="mg-q">Ouça e toque na figura certa</div><button class="mg-som" data-g="som">🔊 Ouvir de novo</button><div class="mg-emos">'+ops.map(function(o,i){return '<button class="mg-opt mg-emo" data-g="op" data-i="'+i+'">'+o+'</button>';}).join('')+'</div><div class="mg-fb"></div>');falar(q);return;}
    gTela('<div class="mg-q">'+E(G.t==='phrasal'?'O que significa:':'Complete:')+'<br><span style="color:var(--accent)">'+E(q)+'</span></div>'+ops.map(function(o,i){return '<button class="mg-opt" data-g="op" data-i="'+i+'">'+E(o)+'</button>';}).join('')+'<div class="mg-fb"></div>');
  }
  function desenharOrdem(){
    gTela('<div class="mg-q">Monte a frase na ordem certa</div><div class="mg-line" id="mg-line">'+G.resp.map(function(b,k){return '<button class="mg-chip" data-g="tira" data-k="'+k+'">'+E(b.w)+'</button>';}).join('')+'</div>'
      +'<div class="mg-bank">'+G.bank.map(function(b,k){var u=G.resp.indexOf(b)>=0;return '<button class="mg-chip'+(u?' used':'')+'" data-g="poe" data-k="'+k+'">'+E(b.w)+'</button>';}).join('')+'</div>'
      +'<div class="mg-fb" id="mg-fb"></div>'+(G.resp.length<G.itens[G.i].length?'<button class="mg-btn" style="width:100%;opacity:.45;background:var(--surface2);color:var(--fg2)" disabled>Toque nas palavras</button>':'<button class="mg-btn" style="width:100%;background:linear-gradient(135deg,#4f6ef7,#8b5cf6);color:#fff" data-g="conferir">Conferir</button>'));
  }
  function fim(){
    if(window.__tarefaJogo){var tj=window.__tarefaJogo;window.__tarefaJogo=null;setTimeout(function(){window._curTask=tj;if(window.taskDone)window.taskDone();},300);}
    var tot=G.t==='flash'?G.total:G.total,ac=G.acertos,pct=Math.round(ac*100/tot);
    marcarDia();
    var emo=pct>=90?'🏆':pct>=60?'🔥':'💪';
    gTela('<div class="mg-end"><div class="big">'+emo+'</div><div class="t">'+ac+' de '+tot+(G.t==='flash'?' de primeira':' certas')+'</div><div class="s">'+(pct>=90?'Mandou muito! Volta amanhã pra manter a sequência.':pct>=60?'Bom demais. Mais uma rodada e fixa de vez.':'Errar faz parte. Joga de novo que o cérebro fixa.')+'</div>'
      +'<button class="mg-btn" style="width:100%;background:linear-gradient(135deg,#4f6ef7,#8b5cf6);color:#fff;margin-bottom:10px" data-g="denovo">🔁 Jogar de novo</button>'
      +'<button class="mg-btn" style="width:100%;background:#25d366;color:#fff;margin-bottom:10px" data-g="share">📤 Desafiar um amigo</button>'
      +'<button class="mg-btn" style="width:100%;background:var(--surface2);color:var(--fg)" data-g="sair">Fechar</button></div>');
    G.i=G.total;
  }
  gv.addEventListener('click',function(e){
    var b=e.target.closest('[data-g]');if(!b||!G)return;var a=b.dataset.g;
    if(a==='sair'){gv.classList.remove('on');gv.innerHTML='';document.body.style.overflow='';G=null;return;}
    if(a==='denovo'){jogar(G.nome);return;}
    if(a==='som'){falar(G.itens[G.i][0]);return;}
    if(a==='share'){wa('Fiz '+G.acertos+'/'+G.total+' no jogo '+G.nome+' do Método Inteligente 🎮 Duvido você bater! Faz o teste de nível grátis: '+SITE+'?ir=teste',false);return;}
    if(G.t==='flash'){
      var c=G.fila[0];
      if(a==='virar'&&!G.virou){G.virou=true;
        gTela('<div class="mg-card"><div class="w">'+E(c.w)+'</div><div class="pt">'+E(c.p)+'</div><div class="ex">"'+E(c.x)+'"</div></div><div class="mg-bts"><button data-g="errei" style="background:rgba(239,68,68,.12);color:#ef4444">✗ Errei</button><button data-g="acertei" style="background:rgba(16,185,129,.14);color:#10b981">✓ Acertei</button></div>');return;}
      if(a==='acertei'){if(!c.errou){G.acertos++;G.pts+=10;}G.fila.shift();G.i=G.total-G.fila.length;passo();return;}
      if(a==='errei'){c.errou=true;G.fila.push(G.fila.shift());passo();return;}
      return;
    }
    if(G.t==='ordem'){
      var it=G.itens[G.i];
      if(a==='poe'){var bb=G.bank[+b.dataset.k];if(G.resp.indexOf(bb)<0)G.resp.push(bb);desenharOrdem();return;}
      if(a==='tira'){G.resp.splice(+b.dataset.k,1);desenharOrdem();return;}
      if(a==='conferir'){
        var ok=G.resp.map(function(x){return x.w;}).join(' ')===it.join(' ');
        var line=$('mg-line');line.classList.add(ok?'ok':'bad');
        if(ok){G.acertos++;G.pts+=10;}
        $('mg-fb').innerHTML=ok?'✅ Perfeito!':'Quase! O certo é: <b>'+E(it.join(' '))+'</b>';
        b.outerHTML='<button class="mg-btn" style="width:100%;background:linear-gradient(135deg,#4f6ef7,#8b5cf6);color:#fff" data-g="seguir">Continuar →</button>';
        return;
      }
      if(a==='seguir'){G.i++;passo();return;}
    }
    if(a==='op'&&!G.resp){
      var item=G.itens[G.i],i=+b.dataset.i,certo=item[2];G.resp=true;
      var ops=gv.querySelectorAll('.mg-opt');ops[certo].classList.add('ok');if(i!==certo)b.classList.add('bad');else{G.acertos++;G.pts+=10;}
      if(G.t==='imagem'||G.t==='ouvir')falar(item[3]);
      gv.querySelector('.mg-fb').innerHTML=(G.t==='imagem'||G.t==='ouvir'?(i===certo?'✅ Isso! ':'Era essa: ')+'<b>'+E(item[3])+'</b> = '+E(item[4]):(i===certo?'✅ Isso!':'Resposta: <b>'+E(item[1][certo])+'</b>'))+'<br><button class="mg-btn" style="margin-top:12px;width:100%;background:linear-gradient(135deg,#4f6ef7,#8b5cf6);color:#fff" data-g="prox">Continuar →</button>';
      gv.querySelector('.sc').textContent=G.pts+' pts';
      return;
    }
    if(a==='prox'){G.resp=null;G.i++;passo();}
  });
  // a ficha do jogo agora joga de verdade
  var sheetGm=null,openSheetOrig=window.openSheet;
  window.openSheet=function(gm){sheetGm=gm;openSheetOrig(gm);var bt=document.querySelector('.sheet-play-btn');if(bt)bt.textContent=JOGOS[gm.name]?'▶ Jogar agora':'⏳ Em breve';};
  var sbt=document.querySelector('.sheet-play-btn');
  if(sbt){sbt.removeAttribute('onclick');sbt.addEventListener('click',function(){
    var n=sheetGm&&sheetGm.name;if(window.closeSheet)closeSheet();
    if(!n||!jogar(n))wa('Oi Gediel! Quero ser avisado quando o jogo '+(n||'')+' sair.');
  });}
  var rgOrig=window.renderGames;
  window.renderGames=function(){
    rgOrig();
    [].forEach.call(document.querySelectorAll('#game-grid .game-app-icon'),function(ic){
      var n=(ic.querySelector('.game-app-name')||{}).textContent;if(!n||ic.querySelector('.mi-soon,.mi-play'))return;
      var s=document.createElement('span');s.className=JOGOS[n]?'mi-play':'mi-soon';s.textContent=JOGOS[n]?'JOGAR':'EM BREVE';ic.appendChild(s);
    });
  };
  // jogáveis primeiro
  if(window.GAMES&&!GAMES.some(function(g){return g.name==='O que é isso?';})){
    GAMES.unshift({name:'Ouça e Toque',emoji:'🔊',bg:'linear-gradient(145deg,#0ea5e9,#2563eb)',tags:['listening','vocab','a1a2'],sub:'Primeiras palavras · do zero',desc:'Você ouve uma palavra em inglês e toca na figura certa. É assim que criança aprende: som + imagem, sem tradução.',instr:'① Ouça a palavra (pode repetir)\n② Toque na figura que combina\n③ Veja a palavra escrita e o significado\n④ 10 rodadas'});
    GAMES.unshift({name:'O que é isso?',emoji:'🖼️',bg:'linear-gradient(145deg,#f97316,#e11d48)',tags:['vocab','a1a2'],sub:'Primeiras palavras · do zero',desc:'Aparece uma figura e você escolhe o nome dela em inglês. Ao responder, você ouve a pronúncia.',instr:'① Olhe a figura\n② Escolha a palavra em inglês\n③ Ouça como fala\n④ 10 rodadas'});
  }
  if(window.GAMES)GAMES.sort(function(a,b){return (JOGOS[b.name]?1:0)-(JOGOS[a.name]?1:0);});
  window.renderGames();

  /* ───────────────────────── ADMIN: Universos + vídeo de boas-vindas ───────────────────────── */
  var ADM={uni:'eom',edit:null,capa:null};
  function montarAdmin(){
    var tabs=document.querySelector('.admin-tabs'),modPanel=$('adm-modulos');if(!tabs||!modPanel||$('adm-universos'))return;
    var t=document.createElement('button');t.className='admin-tab';t.textContent='🌐 Universos';t.setAttribute('onclick',"adminTab('universos',this)");tabs.appendChild(t);
    var p=document.createElement('div');p.className='admin-panel';p.id='adm-universos';
    p.innerHTML='<div class="admin-form">'
      +'<div class="admin-form-title">🎬 Vídeo de boas-vindas (1º acesso)</div>'
      +'<div style="font-size:12px;color:var(--fg2);margin-bottom:10px">Aparece sozinho na primeira vez que o aluno entra. Grave mostrando o app, o botão de checklist, a aula da vez, as lives e como usar todo dia. Pode ser vídeo não listado do YouTube.</div>'
      +'<div style="display:flex;gap:8px;flex-wrap:wrap"><input class="admin-inp" id="adm-bv-url" placeholder="https://youtu.be/..." style="flex:1;min-width:220px"><button class="admin-btn admin-btn-primary" data-ua="bv-salvar">Salvar</button><button class="admin-btn admin-btn-ghost" data-ua="bv-ver">Pré-visualizar</button></div>'
      +'</div><div class="admin-form">'
      +'<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:6px"><div class="admin-form-title" style="margin:0">🌐 Cards dos Universos</div><button class="admin-btn admin-btn-primary admin-btn-sm" data-ua="novo">➕ Novo card</button></div>'
      +'<div style="font-size:12px;color:var(--fg2);margin-bottom:12px;line-height:1.7">Clique no card pra editar. Arraste pela alça ⠿ pra mudar a ordem. <strong>Capa:</strong> 1280 × 720 px (16:9).<br>Mini curso: crie o módulo em Módulos (marque "Mini curso avulso"), depois aponte o card pra ele.</div>'
      +'<div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap" id="adm-uni-tabs"></div>'
      +'<div id="adm-uni-list"><div class="admin-loading">Carregando…</div></div></div>';
    modPanel.insertAdjacentElement('afterend',p);
    var tabOrig=window.adminTab;
    window.adminTab=function(tab,btn){tabOrig(tab,btn);if(tab==='universos')loadAdminUni();};
  }
  async function loadAdminUni(){
    await lerCfg();$('adm-bv-url').value=CFG.videoBoasVindas||'';
    $('adm-uni-tabs').innerHTML=Object.keys(UNIV).map(function(k){return '<button class="admin-btn admin-btn-sm '+(ADM.uni===k?'admin-btn-primary':'admin-btn-ghost')+'" data-ua="uni" data-k="'+k+'">'+UNIV[k].icon+' '+E(UNIV[k].nav)+'</button>';}).join('');
    await Promise.all([carregarCards(true),carregarModsAll(true)]);
    var el=$('adm-uni-list');
    if(CARDS._erro){el.innerHTML='<div class="admin-loading" style="color:var(--red)">Erro: '+E(CARDS._erro.message)+'<br><span style="font-size:11px;color:var(--fg2)">Rode o COLE-NO-SUPABASE.sql atualizado no SQL Editor do Supabase.</span></div>';return;}
    var lista=CARDS.filter(function(c){return c.universo===ADM.uni;});
    el.innerHTML=lista.length?lista.map(function(c,i){
      return '<div class="adm-lesson-row" draggable="true" data-uidx="'+i+'" data-ua="editar" data-id="'+c.id+'" style="background:var(--surface);border:1px solid var(--border);margin-bottom:6px">'
        +'<div class="drag-handle">⠿</div><div class="adm-cover-sm">'+(c.capa_url?'<img src="'+E(c.capa_url)+'">':E(c.emoji||'✨'))+'</div>'
        +'<div style="flex:1;min-width:0"><div style="font-weight:700">'+E(c.titulo)+'</div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:3px">'
        +(c.destaque?'<span class="adm-pill adm-pill-on">BANNER</span>':'')+(c.ativo===false?'<span class="adm-pill adm-pill-off">OCULTO</span>':'')+(cardSoon(c)?'<span class="adm-pill adm-pill-off">EM BREVE</span>':'')
        +'<span class="adm-stat">'+E(c.secao||'sem seção')+'</span><span class="adm-stat">'+E({link:'🔗 link',whatsapp:'💬 WhatsApp',area:'📱 área do app',curso:'🛒 mini curso'}[c.acao]||c.acao)+'</span>'+(c.tag?'<span class="adm-stat">🏷 '+E(c.tag)+'</span>':'')
        +'</div></div></div>';}).join(''):'<div class="admin-loading">Nenhum card neste universo.</div>';
  }
  // reordenar cards arrastando
  var drag=null;
  document.addEventListener('dragstart',function(e){var r=e.target.closest&&e.target.closest('#adm-uni-list [data-uidx]');if(!r)return;drag=+r.dataset.uidx;r.classList.add('dragging');try{e.dataTransfer.setData('text/plain','x');}catch(x){}});
  document.addEventListener('dragover',function(e){if(drag===null)return;var r=e.target.closest('#adm-uni-list [data-uidx]');if(!r)return;e.preventDefault();[].forEach.call(document.querySelectorAll('#adm-uni-list .drop-before,#adm-uni-list .drop-after'),function(x){x.classList.remove('drop-before','drop-after');});var b=r.getBoundingClientRect();r.classList.add(e.clientY-b.top<b.height/2?'drop-before':'drop-after');});
  document.addEventListener('drop',async function(e){
    if(drag===null)return;var r=e.target.closest('#adm-uni-list [data-uidx]');var from=drag;drag=null;
    if(!r){loadAdminUni();return;}e.preventDefault();
    var b=r.getBoundingClientRect(),to=+r.dataset.uidx+((e.clientY-b.top)>=b.height/2?1:0);if(from<to)to--;
    var lista=CARDS.filter(function(c){return c.universo===ADM.uni;});var it=lista.splice(from,1)[0];lista.splice(to,0,it);
    for(var k=0;k<lista.length;k++)if(lista[k].ord!==k+1){lista[k].ord=k+1;await window._sb.from('mi_uni_cards').update({ord:k+1}).eq('id',lista[k].id);}
    toast('↕️ Ordem salva','#10b981');CARDS=null;loadAdminUni();
  });
  document.addEventListener('dragend',function(){drag=null;[].forEach.call(document.querySelectorAll('#adm-uni-list .dragging,#adm-uni-list .drop-before,#adm-uni-list .drop-after'),function(x){x.classList.remove('dragging','drop-before','drop-after');});});

  // modal de edição do card
  var um=document.createElement('div');um.className='modal-overlay';um.id='adm-uni-modal';
  um.innerHTML='<div class="modal-box adm-modal-box" style="width:620px"><div class="modal-header"><h2 id="uc-h">Card</h2><button class="modal-close" data-ua="fechar">✕</button></div><div class="modal-body">'
    +'<div class="adm-section">Capa · 1280 × 720 px</div><div class="adm-cover-drop" data-ua="capa"><div class="adm-cover-prev" id="uc-prev">🖼️</div><div style="font-size:12px;color:var(--fg2);line-height:1.6"><strong>Clique pra enviar</strong><br>JPG/PNG · 16:9 · até 2 MB<div id="uc-info" style="font-size:11px;margin-top:4px"></div><button class="admin-btn admin-btn-ghost admin-btn-sm" style="margin-top:6px" data-ua="sem-capa">Tirar capa</button></div><input type="file" id="uc-file" accept="image/*" style="display:none"></div>'
    +'<div class="adm-section">Título</div><input class="admin-inp" id="uc-titulo" maxlength="120">'
    +'<div class="adm-section">Descrição curta</div><textarea class="admin-inp" id="uc-desc" rows="2" maxlength="400"></textarea>'
    +'<div style="display:grid;grid-template-columns:1fr 1fr 90px;gap:10px" class="grid-2"><div><div class="adm-section">Seção (agrupa os cards)</div><input class="admin-inp" id="uc-secao" list="uc-secoes" placeholder="Ex.: Assistir"><datalist id="uc-secoes"></datalist></div><div><div class="adm-section">Etiqueta</div><input class="admin-inp" id="uc-tag" placeholder="Ex.: R$ 27 · Grátis · Em breve" maxlength="40"></div><div><div class="adm-section">Emoji</div><input class="admin-inp" id="uc-emoji" maxlength="8" style="text-align:center;font-size:18px"></div></div>'
    +'<div class="adm-section">O que acontece ao clicar</div><select class="admin-inp" id="uc-acao"><option value="link">🔗 Abrir um link (YouTube, playlist, checkout, site)</option><option value="whatsapp">💬 Abrir meu WhatsApp com mensagem pronta</option><option value="area">📱 Abrir uma área do app</option><option value="material">📘 Abrir um material / e-book (com cadeado pra quem não comprou)</option><option value="playlist">▶️ Playlist do YouTube (vídeos aparecem sozinhos, com quiz e comentários)</option><option value="curso">🛒 Abrir um mini curso (com cadeado pra quem não comprou)</option></select>'
    +'<div id="uc-valor-box" style="margin-top:8px"></div>'
    +'<div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:14px;font-size:12.5px"><label style="display:flex;gap:6px;align-items:center"><input type="checkbox" id="uc-destaque"> Banner do topo</label><label style="display:flex;gap:6px;align-items:center"><input type="checkbox" id="uc-breve"> Em breve (vira "me avise")</label><label style="display:flex;gap:6px;align-items:center"><input type="checkbox" id="uc-ativo" checked> Visível pros alunos</label></div>'
    +'<div id="uc-st" style="font-size:12px;min-height:18px;margin-top:12px"></div>'
    +'<div style="display:flex;gap:8px;justify-content:space-between;margin-top:6px"><button class="admin-btn admin-btn-danger admin-btn-sm" data-ua="apagar">🗑️ Apagar</button><div style="display:flex;gap:8px"><button class="admin-btn admin-btn-ghost" data-ua="fechar">Cancelar</button><button class="admin-btn admin-btn-primary" data-ua="salvar">💾 Salvar</button></div></div>'
    +'</div></div>';
  document.body.appendChild(um);
  function valorBox(acao,valor){
    var b=$('uc-valor-box');
    if(acao==='area')b.innerHTML='<select class="admin-inp" id="uc-valor">'+Object.keys(AREAS).map(function(k){return '<option value="'+k+'"'+(valor===k?' selected':'')+'>'+AREAS[k]+'</option>';}).join('')+'</select>';
    else if(acao==='material'){var ms=((window.EBG_ACESSO||{}).estado||{}).mats||[];
      b.innerHTML='<select class="admin-inp" id="uc-valor"><option value="">— escolha o material —</option>'+ms.map(function(m){return '<option value="'+m.id+'"'+(valor===m.id?' selected':'')+'>'+E(m.nome)+'</option>';}).join('')+'</select>';}
    else if(acao==='curso'){var minis=(MODS_ALL||[]).filter(function(m){return m.trilha==='mini'||m.id===valor;});
      b.innerHTML='<select class="admin-inp" id="uc-valor"><option value="">— ainda não tem módulo (fica "em breve") —</option>'+minis.map(function(m){return '<option value="'+m.id+'"'+(valor===m.id?' selected':'')+'>'+E(m.name)+(m.produto?' · libera com "'+E(m.produto)+'"':' · ⚠ sem produto')+'</option>';}).join('')+'</select>'+(minis.length?'':'<div style="font-size:11px;color:var(--gold);margin-top:6px">Nenhum mini curso criado ainda. Vá em Módulos → Novo módulo → "Mini curso avulso".</div>');}
    else if(acao==='playlist')b.innerHTML='<input class="admin-inp" id="uc-valor" placeholder="Cole o link da playlist (youtube.com/playlist?list=...)" value="'+E(valor||'')+'"><div style="font-size:11px;color:var(--fg2);margin-top:6px">Todo vídeo novo que você pôr na playlist aparece aqui sozinho. A playlist precisa ser pública ou não listada.</div>';
    else if(acao==='whatsapp')b.innerHTML='<textarea class="admin-inp" id="uc-valor" rows="2" placeholder="Mensagem que o aluno manda pra você">'+E(valor||'')+'</textarea>';
    else b.innerHTML='<input class="admin-inp" id="uc-valor" placeholder="https://... (vazio = aparece como Em breve)" value="'+E(valor||'')+'">';
  }
  function abrirModalCard(c){
    ADM.edit=c||{universo:ADM.uni,acao:'link',ativo:true};ADM.capa=null;c=ADM.edit;
    $('uc-h').textContent=(c.id?'Editar card':'Novo card')+' · '+UNIV[c.universo].nav;
    $('uc-titulo').value=c.titulo||'';$('uc-desc').value=c.descricao||'';$('uc-secao').value=c.secao||'';$('uc-tag').value=c.tag||'';$('uc-emoji').value=c.emoji||'';
    $('uc-acao').value=c.acao||'link';valorBox(c.acao||'link',c.valor||'');
    carregarModsAll(true).then(function(){if($('uc-acao').value===(c.acao||'link')&&(c.acao==='curso'))valorBox('curso',c.valor||'');});
    $('uc-destaque').checked=!!c.destaque;$('uc-breve').checked=!!c.em_breve;$('uc-ativo').checked=c.ativo!==false;
    $('uc-prev').innerHTML=c.capa_url?'<img src="'+E(c.capa_url)+'">':'🖼️';$('uc-info').innerHTML='';$('uc-st').innerHTML='';$('uc-st').dataset.confirm='';
    var secs={};(CARDS||[]).filter(function(x){return x.universo===c.universo&&x.secao;}).forEach(function(x){secs[x.secao]=1;});
    $('uc-secoes').innerHTML=Object.keys(secs).map(function(s){return '<option value="'+E(s)+'">';}).join('');
    um.classList.add('open');
  }
  $('uc-acao')&&$('uc-acao').addEventListener('change',function(){valorBox(this.value,'');});
  $('uc-file')&&$('uc-file').addEventListener('change',function(){
    var f=this.files&&this.files[0];if(!f)return;var info=$('uc-info');
    if(f.size>2*1024*1024){info.innerHTML='<span style="color:var(--red)">'+(f.size/1048576).toFixed(1)+' MB — máximo 2 MB.</span>';this.value='';return;}
    var url=URL.createObjectURL(f),img=new Image();
    img.onload=function(){var r=img.naturalWidth/img.naturalHeight,ok=Math.abs(r-16/9)<0.06;
      info.innerHTML='<strong>'+img.naturalWidth+' × '+img.naturalHeight+' px</strong> '+(ok&&img.naturalWidth>=1280?'<span style="color:var(--green)">✓ perfeita</span>':ok?'<span style="color:var(--gold)">⚠ pequena</span>':'<span style="color:var(--gold)">⚠ não é 16:9, corto o centro</span>');
      $('uc-prev').innerHTML='<img src="'+url+'">';ADM.capa=f;};
    img.src=url;
  });
  async function salvarCard(){
    var st=$('uc-st'),c=ADM.edit,titulo=$('uc-titulo').value.trim();
    if(!titulo){st.innerHTML='<span style="color:var(--red)">Dá um título pro card.</span>';return;}
    st.innerHTML='⏳ Salvando...';
    var row={universo:c.universo,titulo:titulo,descricao:$('uc-desc').value.trim()||null,secao:$('uc-secao').value.trim()||null,tag:$('uc-tag').value.trim()||null,emoji:$('uc-emoji').value.trim()||null,
      acao:$('uc-acao').value,valor:($('uc-valor').value||'').trim()||null,destaque:$('uc-destaque').checked,em_breve:$('uc-breve').checked,ativo:$('uc-ativo').checked};
    if(c.capa_url===null)row.capa_url=null;
    try{
      var id=c.id;
      if(!id){row.ord=(CARDS||[]).filter(function(x){return x.universo===c.universo;}).length+1;var ins=await window._sb.from('mi_uni_cards').insert(row).select().single();if(ins.error)throw ins.error;id=ins.data.id;}
      if(ADM.capa){
        var ext=(ADM.capa.name.split('.').pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'')||'jpg',path='universos/'+id+'-'+Date.now()+'.'+ext;
        var up=await window._sb.storage.from('capas').upload(path,ADM.capa,{upsert:true,contentType:ADM.capa.type||'image/jpeg'});if(up.error)throw new Error('Capa: '+up.error.message);
        row.capa_url=window._sb.storage.from('capas').getPublicUrl(path).data.publicUrl;
      }
      var u=await window._sb.from('mi_uni_cards').update(row).eq('id',id);if(u.error)throw u.error;
      um.classList.remove('open');toast('✅ Card salvo!','#10b981');CARDS=null;loadAdminUni();
    }catch(err){st.innerHTML='<span style="color:var(--red)">Erro: '+E(err.message)+'</span>';}
  }
  document.addEventListener('click',async function(e){
    var b=e.target.closest('[data-ua]');if(!b)return;var a=b.dataset.ua;
    if(a==='uni'){ADM.uni=b.dataset.k;loadAdminUni();}
    else if(a==='novo')abrirModalCard(null);
    else if(a==='editar'){if(e.target.closest('.drag-handle'))return;abrirModalCard((CARDS||[]).filter(function(c){return c.id===b.dataset.id;})[0]);}
    else if(a==='fechar')um.classList.remove('open');
    else if(a==='capa'){if(e.target.closest('[data-ua="sem-capa"]'))return;$('uc-file').click();}
    else if(a==='sem-capa'){e.stopPropagation();ADM.capa=null;ADM.edit.capa_url=null;$('uc-prev').innerHTML='🖼️';$('uc-info').innerHTML='Sem capa (usa o emoji).';}
    else if(a==='salvar')salvarCard();
    else if(a==='apagar'){
      var st=$('uc-st');if(!ADM.edit.id){um.classList.remove('open');return;}
      if(st.dataset.confirm!=='1'){st.dataset.confirm='1';st.innerHTML='<span style="color:var(--red)">Clique em Apagar de novo pra confirmar.</span>';return;}
      var r=await window._sb.from('mi_uni_cards').delete().eq('id',ADM.edit.id);if(r.error){st.innerHTML='<span style="color:var(--red)">'+E(r.error.message)+'</span>';return;}
      um.classList.remove('open');toast('🗑️ Card apagado','#6b7280');CARDS=null;loadAdminUni();
    }
    else if(a==='bv-salvar'){
      var url=$('adm-bv-url').value.trim();
      if(url&&window.ytId&&!ytId(url)){toast('Não reconheci esse link do YouTube','#ef4444');return;}
      var cur=await window._sb.from('acesso').select('dados').eq('id','cfg').maybeSingle();
      var dados=Object.assign({},(cur.data&&cur.data.dados)||{},{videoBoasVindas:url});
      var r2=await window._sb.from('acesso').upsert({id:'cfg',dados:dados});
      toast(r2.error?'Não salvou: '+r2.error.message:'✅ Vídeo de boas-vindas salvo',r2.error?'#ef4444':'#10b981');
      var S=(window.EBG_ACESSO||{}).estado;if(S&&S.cfg)S.cfg.videoBoasVindas=url;
    }
    else if(a==='bv-ver')mostrarBoasVindas(true);
  });
  um.addEventListener('click',function(e){if(e.target===um)um.classList.remove('open');});
  montarAdmin();

  /* configurações: rever boas-vindas */
  (function(){var s=document.querySelector('#settings-overlay .modal-body');if(!s)return;
    var b=document.createElement('button');b.className='set-btn set-btn-ghost';b.textContent='▶ Rever o vídeo de como usar o app';var b2=document.createElement('button');b2.className='set-btn set-btn-ghost';b2.textContent='🧭 Fazer o tour pelos menus';b2.onclick=function(){if(window.closeSettings)closeSettings();go('home');setTimeout(function(){tour('todos');},500);};s.appendChild(b2);b.onclick=function(){if(window.closeSettings)closeSettings();mostrarBoasVindas(true);};s.appendChild(b);})();

  /* instalar como app */
  if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('sw.js').catch(function(){});



  /* ───────────────────────── BÚSSOLA (nível) e PRISMA (inteligências) ─────────────────────────
     Os testes são os sites de verdade; o aluno faz dentro do app e marca o resultado que apareceu. */
  var URL_BUSSOLA='bussola.html?membro=1',URL_PRISMA='prisma.html?membro=1';
  var NIVEIS=['A1','A2','B1','B2','C1','C2'];
  var NIVEL_CAN={A1:'Se apresentar, perguntar e responder o básico do dia a dia.',A2:'Se virar em situações simples: compras, rotina, direções, família.',B1:'Conversar sobre o dia a dia e o trabalho, viajar sem travar.',B2:'Discutir ideias com fluência e entender séries e reuniões.',C1:'Usar o inglês com flexibilidade no trabalho e nos estudos.',C2:'Dominar o idioma com precisão, como um nativo culto.'};
  var INTEL={
    musical:{ic:'🎵',nome:'Auditivo-Musical',desc:'Você aprende melhor com ritmo, melodia e sons.',est:['Estude com músicas: leia a letra, cante, imite','Shadowing todo dia (10 min)','Podcasts no transporte','Imite sotaques de séries e cantores']},
    linguistica:{ic:'📝',nome:'Linguístico-Verbal',desc:'Você aprende melhor com palavras: lendo, escrevendo e explicando.',est:['Leia em voz alta todo dia','Escreva 3 frases no diário em inglês','Anote frases inteiras, não palavras soltas','Explique pra alguém o que aprendeu']},
    logica:{ic:'🧮',nome:'Lógico-Matemático',desc:'Você aprende melhor entendendo regras, padrões e o porquê.',est:['Entenda a regra e teste com exemplos seus','Monte tabelas de verbos e padrões','Faça os quizzes até gabaritar','Acompanhe seu progresso em números']},
    corporal:{ic:'🏃',nome:'Corporal-Cinestésico',desc:'Você aprende melhor em movimento, fazendo e praticando.',est:['Faça shadowing andando','Use gestos enquanto fala','Encene diálogos das aulas','Estude no transporte e na academia']},
    visual:{ic:'🎨',nome:'Visual-Espacial',desc:'Você aprende melhor com imagens, cores e o que consegue ver.',est:['Séries com legenda em inglês','Mapas mentais de vocabulário','Flashcards com imagem','Cores diferentes pra cada tempo verbal']},
    interpessoal:{ic:'🤝',nome:'Interpessoal',desc:'Você aprende melhor com outras pessoas, conversando e trocando.',est:['Entre nas lives e fale','Estude em dupla','Comente nas aulas e responda colegas','Ensine o que aprendeu pra alguém']},
    intrapessoal:{ic:'🧘',nome:'Intrapessoal',desc:'Você aprende melhor refletindo, no seu ritmo e com objetivos claros.',est:['Diário de metas em inglês','Autoavaliação toda semana','Estude sozinho no seu horário fixo','Ligue cada aula ao seu objetivo de vida']},
    naturalista:{ic:'🌿',nome:'Naturalista',desc:'Você aprende melhor observando, classificando e organizando.',est:['Organize o vocabulário por categorias','Estude ao ar livre','Descreva em inglês o que você vê','Assista documentários em inglês']}
  };
  function pintarPerfil(){
    var t=document.querySelector('.sidebar .level-tag'),l=document.querySelectorAll('.sidebar .level-row .level-lbl')[0],box=document.querySelector('.sidebar-level');
    if(t)t.textContent=ST.nivel||'?';
    if(l)l.textContent=ST.prisma&&INTEL[ST.prisma]?INTEL[ST.prisma].nome:(ST.nivel?'Faça o Prisma':'Faça seu diagnóstico');
    if(box&&!box.dataset.mi){box.dataset.mi='1';box.style.cursor='pointer';box.addEventListener('click',function(){go(ST.nivel?'prisma':'bussola');});}
    var sub=document.querySelector('#pane-maratona > div:nth-child(2)');if(sub)sub.textContent=(ST.nivel?'Sessão do nível '+ST.nivel+' · ':'')+'Escolha onde você está';
  }
  window.setManualLevel=function(lvl){if(NIVEIS.indexOf(lvl)<0)return;ST.nivel=lvl;try{localStorage.setItem('userLevel',lvl);}catch(e){}salvar();pintarPerfil();renderBussola();toast('✅ Seu nível agora é '+lvl,'#4f6ef7');};
  function setPrisma(k){if(!INTEL[k])return;ST.prisma=k;salvar();pintarPerfil();renderPrisma();toast('✅ '+INTEL[k].nome+' salvo no seu perfil','#8b5cf6');}
  var NV_DET={
    A1:{nome:'Iniciante',h:'≈ 90 a 100 horas de estudo',cor:'#ef4444',res:'Você entende e usa expressões do dia a dia e frases bem simples, desde que a pessoa fale devagar e ajude.',faz:[['🗣️','Falar','Se apresentar: nome, idade, de onde você é, onde mora. Pedir e dar informações básicas, como "Where is the bathroom?".'],['👂','Ouvir','Entender cumprimentos, números, horas e frases curtas ditas devagar e com pausas.'],['📖','Ler','Ler placas, cardápios, preços e mensagens bem curtas.'],['✍️','Escrever','Preencher um formulário simples e escrever frases soltas sobre você.'],['🌍','Na vida real','Pedir um café, dizer o que quer comprar e se identificar num hotel.']],naoV:['Acompanhar uma conversa em ritmo normal','Contar o que aconteceu ontem','Entender séries ou músicas sem ajuda'],prox:'Aprender o verbo to be, o presente simples, as 500 palavras mais comuns e perguntas básicas. Falar todo dia, mesmo errando.'},
    A2:{nome:'Básico',h:'≈ 180 a 200 horas',cor:'#f97316',res:'Você se vira em situações simples e previsíveis e fala de assuntos do seu dia a dia com frases curtas.',faz:[['🗣️','Falar','Descrever rotina, família, trabalho e gostos. Contar o que fez ontem com frases simples.'],['👂','Ouvir','Entender o essencial de avisos, conversas lentas e instruções curtas.'],['📖','Ler','Ler textos curtos, e-mails simples, anúncios e informações de viagem.'],['✍️','Escrever','Mensagens e bilhetes curtos, como convidar alguém ou agradecer.'],['🌍','Na vida real','Pedir comida, comprar, perguntar direção, fazer check-in, usar transporte e marcar horário.']],naoV:['Manter uma conversa longa sem travar','Dar opinião e explicar por quê','Entender nativos falando rápido ou ao telefone'],prox:'Dominar passado e futuro, ampliar o vocabulário e treinar conversas de 3 a 5 minutos. Aqui o hábito diário pesa mais que a teoria.'},
    B1:{nome:'Intermediário',h:'≈ 350 a 400 horas',cor:'#eab308',res:'Você se vira na maioria das situações, principalmente em viagem, e conversa sobre assuntos que conhece.',faz:[['🗣️','Falar','Manter uma conversa sobre trabalho, viagem e planos. Contar histórias, relatar experiências e dar opinião simples.'],['👂','Ouvir','Entender o ponto principal de vídeos, podcasts e conversas quando o assunto é familiar e o ritmo é claro.'],['📖','Ler','Ler textos do dia a dia, notícias simples, e-mails e instruções.'],['✍️','Escrever','Textos simples e conectados, como e-mail de trabalho, relato de viagem e mensagens mais longas.'],['🌍','Na vida real','Viajar sem travar, resolver problemas (voo atrasado, reserva errada) e participar de conversa informal.']],naoV:['Entender humor, gírias e falas rápidas','Participar de reuniões técnicas','Defender uma ideia com argumentos'],prox:'Treinar opinião e argumentação, entender nativos em ritmo normal, aprender expressões e phrasal verbs, ver séries com legenda em inglês.'},
    B2:{nome:'Intermediário avançado',h:'≈ 500 a 600 horas',cor:'#22c55e',res:'Você conversa com fluência e naturalidade, sem esforço pra você nem pra quem fala com você.',faz:[['🗣️','Falar','Debater assuntos variados, defender seu ponto de vista e explicar vantagens e desvantagens.'],['👂','Ouvir','Entender a maior parte de séries, filmes, palestras e reuniões, mesmo com sotaques diferentes.'],['📖','Ler','Ler artigos, relatórios e livros fáceis sem depender de tradução.'],['✍️','Escrever','Textos claros e detalhados: e-mails profissionais, relatórios e redações.'],['🌍','Na vida real','Fazer entrevista de emprego, participar de reuniões, estudar ou trabalhar em inglês.']],naoV:['Usar expressões idiomáticas raras com segurança','Captar ironia e sutilezas','Ler textos acadêmicos muito densos sem esforço'],prox:'Vocabulário avançado por tema, escrita mais elaborada, nuances e registro formal e informal. Muito inglês real: podcasts, filmes e conversas.'},
    C1:{nome:'Avançado',h:'≈ 700 a 800 horas',cor:'#3b82f6',res:'Você usa o inglês com flexibilidade e eficiência no trabalho, nos estudos e na vida social.',faz:[['🗣️','Falar','Se expressar de forma espontânea, quase sem procurar palavras. Apresentar e negociar com confiança.'],['👂','Ouvir','Entender falas longas, mesmo quando não são bem organizadas, e captar o que está implícito.'],['📖','Ler','Textos longos e exigentes, técnicos ou literários, percebendo estilo e intenção.'],['✍️','Escrever','Textos bem estruturados e detalhados sobre temas complexos, com o tom certo.'],['🌍','Na vida real','Trabalhar, estudar e liderar em inglês. Lidar com humor, gírias e linguagem indireta.']],naoV:['Ter a precisão de um nativo culto em qualquer assunto','Dominar todas as sutilezas culturais'],prox:'Refinar precisão, estilo e naturalidade. Ler e ouvir material sem adaptação e escrever de forma profissional.'},
    C2:{nome:'Proficiente',h:'≈ 1.000 horas ou mais',cor:'#8b5cf6',res:'Você domina o idioma com precisão, como um nativo culto, em qualquer situação.',faz:[['🗣️','Falar','Se expressar com fluidez e precisão, diferenciando nuances finas de significado, mesmo em temas complexos.'],['👂','Ouvir','Entender praticamente tudo, ao vivo ou gravado, em qualquer velocidade.'],['📖','Ler','Ler qualquer texto, inclusive abstrato, técnico ou literário, com facilidade.'],['✍️','Escrever','Escrever textos claros, elegantes e bem argumentados, resumindo fontes diferentes.'],['🌍','Na vida real','Atuar em qualquer contexto profissional ou acadêmico, no mesmo nível de um falante nativo educado.']],naoV:['Nada que impeça: aqui é manter e refinar'],prox:'Manter o contato diário com o idioma, ensinar, escrever e aprofundar áreas específicas.'}
  };
  function nvModal(n){
    n=NV_DET[n]?n:'A1';var o=$('nv-ov');if(!o){o=document.createElement('div');o.id='nv-ov';o.className='nv-ov';document.body.appendChild(o);o.addEventListener('click',function(e){if(e.target===o||e.target.closest('[data-nv-x]'))o.classList.remove('on');var t=e.target.closest('[data-nvt]');if(t)nvModal(t.dataset.nvt);});}
    var d=NV_DET[n],lv=ST.nivel;
    o.innerHTML='<div class="nv-fo" style="--c:'+d.cor+'"><button class="nv-x" data-nv-x aria-label="Fechar">✕</button><div class="nv-top">Os níveis do inglês</div>'
      +'<div class="nv-tabs">'+NIVEIS.map(function(k){return '<button data-nvt="'+k+'" class="'+(k===n?'on':'')+'" style="--c:'+NV_DET[k].cor+'">'+k+(k===lv?' ★':'')+'</button>';}).join('')+'</div>'
      +'<div class="nv-hero"><div class="nv-big">'+n+'</div><div><b>'+E(d.nome)+'</b><span>'+E(d.h)+' (estimativa)</span></div></div><p class="nv-res">'+E(d.res)+'</p>'
      +'<div class="nv-sec">O que você consegue fazer</div>'+d.faz.map(function(x){return '<div class="nv-it"><div class="nv-e"></div><div><b>'+x[1]+'</b><span>'+E(x[2])+'</span></div></div>';}).join('')
      +'<div class="nv-sec nv-no">Ainda é difícil</div><ul class="nv-ul">'+d.naoV.map(function(x){return '<li>'+E(x)+'</li>';}).join('')+'</ul>'
      +'<div class="nv-sec nv-go">Pra chegar no próximo nível</div><p class="nv-res">'+E(d.prox)+'</p>'
      +(lv===n?'<div class="nv-eu">★ Esse é o seu nível hoje</div>':'')+'<p class="nv-foot">As horas são uma média de referência internacional (CEFR). Cada pessoa avança num ritmo. Estudar um pouco todo dia vale mais do que muito de vez em quando.</p></div>';
    o.classList.add('on');
  }
  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-nv]');if(b)nvModal(b.dataset.nv);});
  function renderBussola(){
    var p=$('pane-bussola');if(!p)return;var lv=ST.nivel,info=lv&&window.LEVEL_INFO?LEVEL_INFO[lv]:null;
    p.innerHTML='<div style="font-size:21px;font-weight:800;margin-bottom:16px">Bússola CEFR</div>'
      +'<div class="intel-banner"><div style="display:flex;align-items:center;gap:12px;margin-bottom:12px"><div style="width:56px;height:56px;border-radius:16px;background:'+(info?info.bg:'var(--surface2)')+';display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;color:'+(info?'#fff':'var(--fg3)')+';flex-shrink:0">'+(lv||'?')+'</div>'
      +'<div><div style="font-size:16px;font-weight:800">'+(info?E(info.title):'Você ainda não fez o teste de nível')+'</div><div style="font-size:12px;color:var(--fg2);margin-top:2px">Bússola CEFR · do A1 ao C2</div></div></div>'
      +'<div style="font-size:12.5px;color:var(--fg2);line-height:1.7;margin-bottom:14px">'+(info?E(info.desc):'O teste se adapta às suas respostas e mostra onde você está. Leva uns 10 minutos. No fim, é só marcar aqui o nível que apareceu.')+'</div>'
      +'<button class="set-btn set-btn-primary" style="margin:0" data-dg="bussola">'+(lv?IC('refazer')+' Refazer o teste de nível':IC('bussola')+' Fazer o teste de nível')+'</button> <button class="set-btn set-btn-ghost nv-open" style="margin:8px 0 0" data-nv="'+(lv||'A1')+'">'+IC('materiais')+' Entender cada nível em detalhe</button></div>'
      +'<div class="card" style="margin:16px 0"><div class="sec-hd" style="margin-bottom:10px;display:flex;align-items:center;gap:8px">'+IC('alvo')+' '+(lv?'Seu nível':'Já sabe seu nível? Marque aqui')+'</div><div style="display:flex;flex-wrap:wrap;gap:8px">'
      +NIVEIS.map(function(n){return '<button class="gf-btn'+(n===lv?' active':'')+'" onclick="setManualLevel(\''+n+'\')">'+n+'</button>';}).join('')+'</div></div>'
      +'<div class="sec-hd" style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap">O que cada nível consegue fazer <button class="set-btn set-btn-ghost nv-open" style="margin:0;padding:6px 12px;font-size:12px" data-nv="'+(lv||'A1')+'">Ver explicação completa</button></div><div class="card">'+NIVEIS.map(function(n){return '<div style="display:flex;gap:12px;align-items:flex-start;padding:9px 0;border-bottom:1px solid var(--border)'+(n===lv?';font-weight:700':'')+'"><span class="level-tag" style="flex-shrink:0;'+(n===lv?'':'background:var(--surface2);color:var(--fg2)')+'">'+n+'</span><span style="font-size:12.5px;line-height:1.5;color:'+(n===lv?'var(--fg)':'var(--fg2)')+'">'+E(NIVEL_CAN[n])+'</span></div>';}).join('')+'</div>';
  }
  function renderPrisma(){renderPrisma0();barrasPrisma();if(window.EBG_PRISMA)window.EBG_PRISMA.render($('pane-prisma'),ST);}
  function barrasPrisma(){
    var p=$('pane-prisma'),R=ST.prismaRes;if(!p||!R||!R.todas||!R.todas.length)return;
    var cor={linguistica:'#E6B964',logica:'#5EC5B6',espacial:'#C97BA0',musical:'#7FA6E8',corporal:'#E8875E',interpessoal:'#6FBF73',intrapessoal:'#A98CE0',naturalista:'#8FBF6A',existencial:'#D96C6C'};
    var mx=Math.max.apply(null,R.todas.map(function(x){return x.v;}))||1;
    var box=document.createElement('div');box.className='intel-banner';box.style.marginTop='14px';
    box.innerHTML='<div style="font-size:14px;font-weight:800;margin-bottom:12px">Seu mapa de inteligências</div>'
      +R.todas.map(function(x,n){var c=cor[x.k]||'#8b5cf6';return '<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;font-size:12.5px;font-weight:700;margin-bottom:4px"><span>'+(n<3?'<b style="color:var(--fg3);margin-right:4px">'+(n+1)+'º</b>':'')+E(x.nome)+'</span><span style="color:'+c+'">'+x.v+'%</span></div><div style="height:9px;border-radius:99px;background:var(--surface2);overflow:hidden"><i data-pw="'+x.v+'" style="display:block;height:100%;width:0;background:'+c+';border-radius:99px;transition:width 1.2s cubic-bezier(.22,1,.36,1) '+(n*.08)+'s"></i></div></div>';}).join('')
      +(R.taticas&&R.taticas.length?'<div style="font-size:13px;font-weight:800;margin:14px 0 6px">Faça a partir de hoje</div><ul style="margin:0;padding-left:18px;font-size:12.5px;line-height:1.7;color:var(--fg2)">'+R.taticas.map(function(t){return '<li>'+E(t)+'</li>';}).join('')+'</ul>':'')
      +(R.armadilha?'<div style="font-size:12.5px;margin-top:10px;padding:10px 12px;border-radius:12px;background:rgba(239,68,68,.08)"><b>⚠️ Cuidado:</b> '+E(R.armadilha)+'</div>':'');
    var ban=p.querySelector('.intel-banner');if(ban)ban.insertAdjacentElement('afterend',box);else p.appendChild(box);
    setTimeout(function(){[].forEach.call(box.querySelectorAll('[data-pw]'),function(el){el.style.width=el.dataset.pw+'%';});},60);
  }
  function renderPrisma0(){
    var p=$('pane-prisma');if(!p)return;var k=ST.prisma,it=k&&INTEL[k];
    p.innerHTML='<div style="font-size:21px;font-weight:800;margin-bottom:16px">Prisma de Talentos</div>'
      +'<div class="intel-banner"><div style="display:flex;align-items:center;gap:12px;margin-bottom:12px"><div style="width:56px;height:56px;border-radius:16px;background:'+(it?'linear-gradient(135deg,#8b5cf6,#ec4899)':'var(--surface2)')+';display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0">'+(it?IC('i-'+k):IC('prisma'))+'</div>'
      +'<div><div style="font-size:16px;font-weight:800">'+(it?'Inteligência '+E(it.nome):'Descubra como você aprende melhor')+'</div><div style="font-size:12px;color:var(--fg2);margin-top:2px">'+(it?'Sua inteligência mais forte · Howard Gardner':'Teste das Inteligências Múltiplas · Howard Gardner')+'</div></div></div>'
      +'<div style="font-size:12.5px;color:var(--fg2);line-height:1.7;margin-bottom:14px">'+(it?E(it.desc):'O teste mostra quais das suas inteligências mais aparecem quando você aprende. Com isso, o seu estudo fica do seu jeito. No fim, é só marcar aqui a que deu mais forte.')+'</div>'
      +'<button class="set-btn set-btn-primary" style="margin:0" data-dg="prisma">'+(it?IC('refazer')+' Refazer o Prisma':IC('prisma')+' Fazer o Prisma')+'</button></div>'
      +(it?'<div class="card" style="margin-top:16px"><div style="font-size:12px;font-weight:800;margin-bottom:10px">Estratégias pra você</div><div style="font-size:12.5px;color:var(--fg2);line-height:1.9">'+it.est.map(function(x){return '• '+E(x);}).join('<br>')+'</div></div>':'')
      +'<div class="card" style="margin:16px 0"><div class="sec-hd" style="margin-bottom:10px">'+(it?'Mudou o resultado? Marque a sua':'Qual deu como sua inteligência mais forte?')+'</div><div style="display:flex;flex-wrap:wrap;gap:8px">'
      +Object.keys(INTEL).map(function(x){return '<button class="gf-btn'+(x===k?' active':'')+'" data-dg-int="'+x+'">'+IC('i-'+x)+' '+E(INTEL[x].nome)+'</button>';}).join('')+'</div></div>';
  }
  // o teste roda dentro do app
  var tq=document.createElement('div');tq.id='mi-teste';document.body.appendChild(tq);
  var tqc=document.createElement('style');
  tqc.textContent='#mi-teste{position:fixed;inset:0;z-index:8500;background:var(--bg);display:none;flex-direction:column}#mi-teste.on{display:flex}'
    +'#mi-teste .tt{display:flex;align-items:center;gap:10px;padding:12px max(16px,env(safe-area-inset-right)) 12px max(16px,env(safe-area-inset-left));padding-top:max(12px,env(safe-area-inset-top));border-bottom:1px solid var(--border);background:var(--sidebar)}'
    +'#mi-teste .tt b{flex:1;font-size:14px}#mi-teste iframe{flex:1;width:100%;border:0;background:#fff}'
    +'#mi-teste .fim{border-top:1px solid var(--border);background:var(--sidebar);padding:12px max(16px,env(safe-area-inset-right)) calc(12px + env(safe-area-inset-bottom)) max(16px,env(safe-area-inset-left))}'
    +'#mi-teste .fim .q{font-size:12px;font-weight:800;margin-bottom:8px}#mi-teste .fim .ch{display:flex;gap:6px;overflow-x:auto;padding-bottom:2px}#mi-teste .fim .ch button{flex-shrink:0}';
  document.head.appendChild(tqc);
  function abrirTeste(qual){
    var b=qual==='bussola';
    tq.innerHTML='<div class="tt"><button class="tb-btn" data-dg="fechar">✕</button><b>'+(b?IC('bussola')+' Teste de nível':IC('prisma')+' Prisma de Talentos')+'</b><a class="tb-btn" style="text-decoration:none" href="'+(b?URL_BUSSOLA:URL_PRISMA)+'" target="_blank" rel="noopener">Abrir fora ↗</a></div>'
      +'<iframe src="'+(b?URL_BUSSOLA:URL_PRISMA)+'&nome='+encodeURIComponent(((U&&U.user_metadata)||{}).full_name||'')+'" title="'+(b?'Teste de nível':'Prisma de Talentos')+'" allow="autoplay; microphone"></iframe>'
      +'<div class="fim" hidden><div class="q">Terminou? Toque no resultado que apareceu:</div><div class="ch">'
      +(b?NIVEIS.map(function(n){return '<button class="gf-btn" data-dg-fim="'+n+'">'+n+'</button>';}).join(''):Object.keys(INTEL).map(function(x){return '<button class="gf-btn" data-dg-fim="'+x+'">'+IC('i-'+x)+' '+E(INTEL[x].nome)+'</button>';}).join(''))
      +'</div></div>';
    tq.dataset.qual=qual;tq.classList.add('on');document.body.style.overflow='hidden';
  }
  // o Prisma avisa sozinho o resultado (prisma.html?membro=1): salva e mostra o retorno, sem a pessoa precisar marcar
  window.addEventListener('message',function(e){
    var d=e.data||{};if(e.origin!==location.origin||!tq.classList.contains('on'))return;
    if(d.tipo==='prisma-resultado'&&INTEL[d.k]){
      ST.prismaRes={k:d.k,top:(d.top||[]).slice(0,3),todas:(d.todas||[]).slice(0,9),canal:d.canal||null,taticas:(d.taticas||[]).slice(0,5),aprende:d.aprende||'',armadilha:d.armadilha||'',despertar:d.despertar||'',em:new Date().toISOString()};
      setPrisma(d.k);
      // o checklist do dia se refaz já com a tarefa do seu jeito
      try{var lb=(LS.get('mi_ctx',{})||{}).k;if(lb&&window.renderMarTasks)window.renderMarTasks(lb);}catch(x){}
    }
    if(d.tipo==='bussola-resultado'&&NIVEIS.indexOf(d.nivel)>=0){window.setManualLevel(d.nivel);}
    if(d.tipo==='prisma-fechar'||d.tipo==='bussola-fechar'){fecharTeste();if(d.ir){setTimeout(function(){var pl=document.querySelector('.sidebar .nav-pill[onclick*="\''+d.ir+'\'"]');goTo(d.ir,pl);},350);}}
  });
  function fecharTeste(){tq.classList.remove('on');tq.innerHTML='';document.body.style.overflow='';if(window._aposTeste){var f=window._aposTeste;window._aposTeste=null;setTimeout(f,250);}}
  document.addEventListener('click',function(e){
    var b=e.target.closest('[data-dg]');
    if(b){var a=b.dataset.dg;if(a==='fechar')fecharTeste();else abrirTeste(a);return;}
    var f=e.target.closest('[data-dg-fim]');
    if(f){var v=f.dataset.dgFim;if(tq.dataset.qual==='bussola')window.setManualLevel(v);else setPrisma(v);fecharTeste();return;}
    var i=e.target.closest('[data-dg-int]');if(i)setPrisma(i.dataset.dgInt);
  });

  /* ───────────────────────── TOUR DOS MENUS ─────────────────────────
     Lê os menus que existem na lateral NA HORA. Menu novo entra sozinho no tour,
     e quem já fez o tour vê só a novidade. Os textos são editáveis no admin (Universos → Tutorial dos menus). */
  var TOUR_TXT={
    home:'Sua tela do dia: o checklist, as lives e a aula da vez. Comece sempre por aqui.',
    maratona:'O checklist de hoje, montado pro lugar onde você está. Toque em cada tarefa: tem o passo a passo, o conteúdo pra usar e uma provinha rápida.',
    lives:'A agenda das aulas ao vivo. Quando uma estiver no ar, aparece "AO VIVO" e é só tocar pra entrar.',
    modulos:'As aulas gravadas do Programa, liberadas 2 por semana. Cada aula tem quiz e comentários. Nas que ainda vão sair, vote em "estou esperando".',
    jogos:'Treine vocabulário e frases jogando. Os que têm o selo JOGAR já funcionam; os outros estão chegando.',
    materiais:'Seus PDFs e e-books: o que é gratuito e o que você já comprou ficam aqui.',
    agendar:'Marque aula comigo: conversação, grupo, casal, intensivo ou preparação pra entrevista, viagem, prova. Escolha o tipo, o dia e o horário que eu deixei livre.',
    prompts:'Prompts prontos pra praticar inglês com ChatGPT ou Claude. Personalize, copie e cole.',
    devocionais:'Os devocionais gravados do English On Mission.',
    eom:'English On Mission: inglês com a Bíblia. Devocionais, a playlist de inglês bíblico, materiais e o grupo.',
    culture:'Culture English: inglês com séries, filmes e música. Mini cursos, e-books e o grupo.',
    viagens:'Viagens e intercâmbio: Toronto, e-book de viagem, seguro, vlogs e um botão pra eu te ajudar a planejar sua viagem.',
    bussola:'Descubra seu nível de inglês, do A1 ao C2.',
    prisma:'Descubra como você aprende melhor. Isso deixa seu estudo do seu jeito.',
    config:'Seu nome e foto. Aqui também dá pra rever o vídeo de boas-vindas e este tour.',
    '#check':'O seu checklist de hoje. A barra mostra quanto falta pra fechar o dia.',
    '#lives':'A próxima live. Quando estiver acontecendo, fica vermelho com AO VIVO.',
    '#aula':'A sua aula da vez. Use ◀ ▶ pra voltar ou avançar entre as aulas.',
    '#duvida':'Ficou com dúvida? Toque aqui e mande pro professor a qualquer hora. A resposta chega aqui mesmo.',
    '#bnav':'Os atalhos do dia a dia ficam aqui embaixo. Em "Menu" estão todas as outras áreas.'
  };
  function tourTexto(k,lb){var t=(CFG.tour||{})[k];return t||TOUR_TXT[k]||('Uma área nova do app: '+lb+'. Toque pra conhecer.');}
  function menusAtuais(){
    var out=[];
    [].forEach.call(document.querySelectorAll('.sidebar .nav-pill'),function(n){
      if(n.id==='admin-nav'||getComputedStyle(n).display==='none')return;
      var oc=n.getAttribute('onclick')||'',m=oc.match(/goTo\('(\w+)'/),k=m?m[1]:(/openSettings/.test(oc)?'config':null);if(!k)return;
      var sp=n.querySelectorAll('span'),lb=(sp[1]||sp[0]||n).textContent.trim();
      out.push({k:k,lb:lb,el:n});
    });
    return out;
  }
  var tv=document.createElement('div');tv.id='mi-tour';document.body.appendChild(tv);
  var tcss=document.createElement('style');
  tcss.textContent='#mi-tour{position:fixed;inset:0;z-index:9500;display:none}#mi-tour.on{display:block}'
    +'#mi-tour .spot{position:fixed;border-radius:14px;box-shadow:0 0 0 9999px rgba(6,9,22,.72);transition:all .3s cubic-bezier(.22,1,.36,1);pointer-events:none;outline:3px solid #fff;outline-offset:2px}'
    +'#mi-tour .tip{position:fixed;width:310px;max-width:calc(100vw - 24px);background:var(--surface);color:var(--fg);border-radius:18px;padding:16px;box-shadow:0 24px 60px rgba(0,0,0,.4);transition:top .3s,left .3s}'
    +'#mi-tour .tip .k{font-size:10px;font-weight:800;letter-spacing:1.2px;color:var(--accent);text-transform:uppercase}'
    +'#mi-tour .tip .t{font-size:17px;font-weight:800;margin:4px 0 6px}#mi-tour .tip .d{font-size:13px;line-height:1.55;color:var(--fg2)}'
    +'#mi-tour .tip .b{display:flex;gap:8px;align-items:center;margin-top:14px}#mi-tour .tip .b button{border:none;border-radius:11px;padding:10px 14px;font-size:13px;font-weight:800;cursor:pointer}'
    +'#mi-tour .tip .pular{background:none!important;color:var(--fg3);padding:10px 4px!important;margin-right:auto}'
    +'#mi-tour .tip .vol{background:var(--surface2);color:var(--fg)}#mi-tour .tip .prx{background:linear-gradient(135deg,#4f6ef7,#8b5cf6);color:#fff}'
    +'#mi-tour .dots{display:flex;gap:4px;margin-top:12px;flex-wrap:wrap}#mi-tour .dots i{width:6px;height:6px;border-radius:50%;background:var(--border)}#mi-tour .dots i.on{background:var(--accent);width:16px;border-radius:4px}';
  document.head.appendChild(tcss);
  var T=null;
  function celular(){return window.matchMedia('(max-width:680px)').matches;}
  function passosTour(modo){
    var menus=menusAtuais(),p=[];
    if(modo==='novos'){
      menus.filter(function(m){return ST.tour.indexOf(m.k)<0;}).forEach(function(m){p.push({k:m.k,t:m.lb,d:tourTexto(m.k,m.lb),el:m.el,menu:true,kick:'Novidade no app ✨'});});
      return p;
    }
    var home=[['#check','.hm-check','Checklist de hoje'],['#lives','.hm-live','Lives'],['#aula','#hm-aula','Sua aula'],['#duvida','#ai-fab','Dúvidas com o professor']];
    home.forEach(function(h){var el=document.querySelector(h[1]);if(el&&el.offsetParent!==null||(el&&h[0]==='#duvida'))p.push({k:h[0],t:h[2],d:tourTexto(h[0],h[2]),el:el,kick:'Tela inicial'});});
    if(celular()&&$('mi-bnav'))p.push({k:'#bnav',t:'Barra de atalhos',d:tourTexto('#bnav','Barra de atalhos'),el:$('mi-bnav'),kick:'Navegação'});
    menus.forEach(function(m){p.push({k:m.k,t:m.lb,d:tourTexto(m.k,m.lb),el:m.el,menu:true,kick:'Menu'});});
    return p;
  }
  // usados pela largada da maratona (membros-maratonas.js)
  window.miTour=function(m){tour(m||'todos');};window.miConhecer=function(cb){conhecer(cb);};
  function tour(modo){
    var p=passosTour(modo);if(!p.length)return;
    T={p:p,i:0,modo:modo};tv.classList.add('on');
    tv.innerHTML='<div class="spot"></div><div class="tip"></div>';
    tourPasso();
  }
  function tourPasso(){
    var s=T.p[T.i],el=s.el;
    gaveta(!!(s.menu&&celular()));
    setTimeout(function(){
      if(!T)return;
      if(el&&el.scrollIntoView)el.scrollIntoView({block:'nearest',behavior:'smooth'});
      setTimeout(function(){if(T)tourPos();},s.menu&&celular()?260:180);
    },s.menu&&celular()?120:0);
    var tip=tv.querySelector('.tip'),fim=T.i===T.p.length-1;
    tip.innerHTML='<div class="k">'+E(s.kick)+' · '+(T.i+1)+' de '+T.p.length+'</div><div class="t">'+E(s.t)+'</div><div class="d">'+E(s.d)+'</div>'
      +'<div class="b"><button class="pular" data-tr="pular">'+(fim?'':'Pular tour')+'</button>'+(T.i?'<button class="vol" data-tr="vol">Voltar</button>':'')+'<button class="prx" data-tr="prx">'+(fim?'Bora! 🚀':'Próximo →')+'</button></div>'
      +(T.p.length>1&&T.p.length<=20?'<div class="dots">'+T.p.map(function(x,i){return '<i class="'+(i===T.i?'on':'')+'"></i>';}).join('')+'</div>':'');
  }
  function tourPos(){
    var s=T.p[T.i],el=s.el,spot=tv.querySelector('.spot'),tip=tv.querySelector('.tip');
    var W=innerWidth,H=innerHeight,tw=Math.min(310,W-24),th=tip.offsetHeight||170;
    if(!el){spot.style.cssText='left:50%;top:50%;width:0;height:0';tip.style.left=(W-tw)/2+'px';tip.style.top=(H-th)/2+'px';return;}
    var r=el.getBoundingClientRect(),pd=6;
    spot.style.left=(r.left-pd)+'px';spot.style.top=(r.top-pd)+'px';spot.style.width=(r.width+pd*2)+'px';spot.style.height=(r.height+pd*2)+'px';
    var x,y;
    if(s.menu&&!celular()){x=r.right+18;y=Math.max(12,Math.min(H-th-12,r.top+r.height/2-th/2));}
    else if(s.menu&&celular()){x=Math.min(W-tw-12,Math.max(12,r.right-tw*0.35));y=r.bottom+14+th>H-12?r.top-th-14:r.bottom+14;if(x<r.right-40&&x+tw>r.left&&y<r.bottom&&y+th>r.top)y=r.bottom+14;}
    else{x=Math.max(12,Math.min(W-tw-12,r.left+r.width/2-tw/2));y=r.bottom+14+th<=H-12?r.bottom+14:Math.max(12,r.top-th-14);}
    if(x+tw>W-12)x=W-tw-12;
    tip.style.left=x+'px';tip.style.top=Math.max(12,Math.min(H-th-12,y))+'px';
  }
  function tourFim(){
    if(!T)return;
    menusAtuais().forEach(function(m){if(ST.tour.indexOf(m.k)<0)ST.tour.push(m.k);});salvar();
    T=null;tv.classList.remove('on');tv.innerHTML='';gaveta(false);
  }
  tv.addEventListener('click',function(e){
    var b=e.target.closest('[data-tr]');if(!b||!T)return;
    if(b.dataset.tr==='pular')return tourFim();
    if(b.dataset.tr==='vol'&&T.i>0){T.i--;return tourPasso();}
    if(b.dataset.tr==='prx'){if(T.i>=T.p.length-1)return tourFim();T.i++;tourPasso();}
  });
  window.addEventListener('resize',function(){if(T)tourPos();});
  document.addEventListener('keydown',function(e){if(!T)return;if(e.key==='Escape')tourFim();if(e.key==='ArrowRight'){if(T.i>=T.p.length-1)tourFim();else{T.i++;tourPasso();}}if(e.key==='ArrowLeft'&&T.i>0){T.i--;tourPasso();}});
  async function tourAuto(){
    if(T||!U)return;
    await lerCfg();
    if(!ST.tour.length){tour('todos');return;}
    var novos=menusAtuais().filter(function(m){return ST.tour.indexOf(m.k)<0;});
    if(novos.length)tour('novos');
  }

  /* admin: textos do tour */
  function montarAdminTour(){
    var p=$('adm-universos');if(!p||$('adm-tour-box'))return;
    var box=document.createElement('div');box.className='admin-form';box.id='adm-tour-box';
    box.innerHTML='<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:6px"><div class="admin-form-title" style="margin:0">🧭 Tutorial dos menus</div><div style="display:flex;gap:8px"><button class="admin-btn admin-btn-ghost admin-btn-sm" data-ua="tour-testar">▶ Testar tour</button><button class="admin-btn admin-btn-primary admin-btn-sm" data-ua="tour-salvar">💾 Salvar textos</button></div></div>'
      +'<div style="font-size:12px;color:var(--fg2);margin-bottom:12px;line-height:1.6">O tour aparece sozinho na primeira entrada do aluno. Quando você cria um menu novo, quem já fez o tour vê só a novidade. Deixe em branco pra usar o texto padrão.</div><div id="adm-tour-list"></div>';
    p.insertBefore(box,p.children[1]||null);
  }
  function pintarAdminTour(){
    var l=$('adm-tour-list');if(!l)return;
    var itens=menusAtuais().map(function(m){return {k:m.k,lb:m.lb};}).concat([{k:'#check',lb:'Início · botão Checklist'},{k:'#lives',lb:'Início · botão Lives'},{k:'#aula',lb:'Início · Sua aula'},{k:'#duvida',lb:'Botão de dúvidas 🙋'},{k:'#bnav',lb:'Celular · barra de baixo'}]);
    l.innerHTML=itens.map(function(m){return '<div style="margin-bottom:10px"><div class="adm-section" style="margin:0 0 4px">'+E(m.lb)+'</div><textarea class="admin-inp" rows="2" data-tourk="'+E(m.k)+'" placeholder="'+E(TOUR_TXT[m.k]||'Uma área nova do app: '+m.lb+'.')+'">'+E((CFG.tour||{})[m.k]||'')+'</textarea></div>';}).join('');
  }
  var luAnt=loadAdminUni;
  loadAdminUni=async function(){await luAnt();montarAdminTour();pintarAdminTour();};
  document.addEventListener('click',async function(e){
    var b=e.target.closest('[data-ua="tour-salvar"],[data-ua="tour-testar"]');if(!b)return;
    if(b.dataset.ua==='tour-testar'){go('home');setTimeout(function(){tour('todos');},500);return;}
    var t={};[].forEach.call(document.querySelectorAll('[data-tourk]'),function(x){var v=x.value.trim();if(v)t[x.dataset.tourk]=v;});
    var cur=await window._sb.from('acesso').select('dados').eq('id','cfg').maybeSingle();
    var dados=Object.assign({},(cur.data&&cur.data.dados)||{},{tour:t});
    var r=await window._sb.from('acesso').upsert({id:'cfg',dados:dados});
    if(!r.error)CFG.tour=t;
    toast(r.error?'Não salvou: '+r.error.message:'✅ Textos do tour salvos',r.error?'#ef4444':'#10b981');
  });

  document.addEventListener('error',function(e){var im=e.target;if(!im||im.tagName!=='IMG'||!im.hasAttribute('data-capa-t')||!window.capaAuto)return;var d=document.createElement('div');d.innerHTML=capaAuto(im.getAttribute('data-capa-t'),+im.getAttribute('data-capa-i')||0);im.replaceWith(d.firstChild);},true);

  /* ───────────────────────── PRIMEIRO ACESSO: "ME DEIXA TE CONHECER" ─────────────────────────
     Jornada curta de perguntas: por que nunca funcionou, mini teste de inteligências com resultado,
     objetivo, nível que a pessoa sente que tem, dados extras, tempo por dia e maratona.
     Tudo vai pro perfil do aluno (user_metadata.mi.onb) e aparece no admin em "📋 Perfil". */
  var OB_TRAVAS=[
    {k:'vergonha',ic:'😳',t:'Vergonha de falar',c:'Você nunca teve um lugar seguro pra errar falando.'},
    {k:'tempo',ic:'⏰',t:'Falta de tempo',c:'Os métodos pediam 1 hora que você não tinha.'},
    {k:'gramatica',ic:'📐',t:'Aulas chatas, só gramática',c:'Começaram pela regra, e não pelo uso.'},
    {k:'esqueco',ic:'🫥',t:'Aprendo e esqueço',c:'Faltou revisar na hora certa.'},
    {k:'ouvido',ic:'👂',t:'Não entendo quando falam',c:'Pouco contato com inglês de verdade, falado rápido.'},
    {k:'para',ic:'🔁',t:'Começo e paro',c:'Faltou rotina e alguém acompanhando.'}
  ];
  var OB_GOSTOS=[['🎬','Séries e filmes'],['🎵','Música'],['✈️','Viagens'],['🙏','Fé e Bíblia'],['💼','Carreira e negócios'],['🎮','Games'],['⚽','Esportes'],['🍳','Culinária'],['💻','Tecnologia'],['📚','Leitura'],['👨‍👩‍👧','Família e filhos'],['🎨','Arte e criatividade']];
  var OB_SONHO=[['🗽','Viajar sem depender de ninguém'],['🎤','Entender música e série sem legenda'],['💼','Uma vaga ou promoção em inglês'],['🌍','Servir ou ministrar em outro país'],['🤝','Conversar com gente do mundo todo'],['🏡','Morar fora']];
  var OB_OBJ=[['💼','Trabalho'],['✈️','Viagem'],['🙏','Igreja e missões'],['🌎','Morar fora'],['🎓','Prova ou faculdade'],['💬','Conversar com gente de fora'],['🌱','Por mim mesmo(a)']];
  var OB_NIV=[['🌱','Do zero','Não sei quase nada'],['🙂','Entendo pouca coisa','Palavras e frases soltas'],['🚶','Me viro no básico','Me apresento, peço comida'],['🗣️','Converso com dificuldade','Travo, mas saio do lugar'],['🚀','Converso bem','Quero lapidar e soltar mais']];
  var OB_MIN=[10,15,20,30,45,60];
  var MIN_PRISMA=7,MIN_BUSSOLA=15;
  var obEl=document.createElement('div');obEl.id='mi-onb';document.body.appendChild(obEl);
  var obc=document.createElement('style');
  obc.textContent=[
    '#mi-onb{position:fixed;inset:0;z-index:9100;background:radial-gradient(ellipse at 15% 0%,#3b4fd8 0%,#1b1f4b 42%,#0b0d1c 100%);color:#fff;display:none;flex-direction:column;opacity:0;transition:opacity .35s}',
    '#mi-onb.on{display:flex}#mi-onb.vis{opacity:1}',
    '#mi-onb .ob-top{flex:none;display:flex;align-items:center;gap:12px;padding:calc(14px + env(safe-area-inset-top)) max(20px,env(safe-area-inset-right)) 10px max(20px,env(safe-area-inset-left))}',
    '#mi-onb .ob-bar{flex:1;height:6px;border-radius:9px;background:rgba(255,255,255,.14);overflow:hidden}#mi-onb .ob-bar i{display:block;height:100%;border-radius:9px;background:linear-gradient(90deg,#7dd3fc,#a78bfa);transition:width .5s cubic-bezier(.22,1,.36,1)}',
    '#mi-onb .ob-voltar,#mi-onb .ob-pular{background:none;border:none;color:rgba(255,255,255,.65);font:inherit;font-size:14px;font-weight:700;cursor:pointer;padding:8px 4px;min-width:44px}',
    '#mi-onb .ob-body{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:12px max(20px,env(safe-area-inset-right)) calc(28px + env(safe-area-inset-bottom)) max(20px,env(safe-area-inset-left))}',
    '#mi-onb .ob-in{max-width:620px;margin:0 auto;animation:obIn .45s cubic-bezier(.22,1,.36,1) both}',
    '@keyframes obIn{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}@keyframes obPop{from{opacity:0;transform:translateY(10px) scale(.97)}to{opacity:1;transform:none}}',
    '#mi-onb .k{font-size:11px;font-weight:800;letter-spacing:1.6px;text-transform:uppercase;color:#a5b4fc;margin:10px 0 8px}',
    '#mi-onb h2{font-size:clamp(24px,5.4vw,34px);line-height:1.15;font-weight:800;letter-spacing:-.6px;margin:0 0 10px;text-wrap:balance}',
    '#mi-onb .s{font-size:15px;line-height:1.55;color:rgba(255,255,255,.75);margin:0 0 20px}',
    '#mi-onb .ops{display:grid;gap:10px}#mi-onb .ops.g2{grid-template-columns:1fr 1fr}#mi-onb .ops.g3{grid-template-columns:repeat(3,1fr)}',
    '#mi-onb .op{display:flex;align-items:center;gap:12px;text-align:left;width:100%;background:rgba(255,255,255,.08);border:1.5px solid rgba(255,255,255,.14);color:#fff;border-radius:16px;padding:14px 16px;font:inherit;font-size:15px;font-weight:700;cursor:pointer;animation:obPop .4s cubic-bezier(.22,1,.36,1) both;transition:background .15s,border-color .15s,transform .1s}',
    '#mi-onb .op:active{transform:scale(.98)}#mi-onb .op .e{font-size:24px;flex:none}#mi-onb .op small{display:block;font-size:12px;font-weight:500;color:rgba(255,255,255,.6);margin-top:2px}',
    '#mi-onb .op.on{background:rgba(125,211,252,.18);border-color:#7dd3fc}#mi-onb .op.on::after{content:"✓";margin-left:auto;font-weight:900;color:#7dd3fc}',
    '#mi-onb .ops.g3 .op{flex-direction:column;text-align:center;gap:6px;padding:14px 8px;font-size:13px}#mi-onb .ops.g3 .op.on::after{display:none}',
    '#mi-onb .cta{width:100%;border:none;border-radius:16px;padding:17px;font:inherit;font-size:16px;font-weight:800;background:#fff;color:#1b1f4b;cursor:pointer;margin-top:18px;box-shadow:0 14px 40px rgba(0,0,0,.35)}#mi-onb .cta:disabled{opacity:.35}',
    '#mi-onb .cta2{width:100%;border:1.5px solid rgba(255,255,255,.25);border-radius:16px;padding:14px;font:inherit;font-size:15px;font-weight:700;background:none;color:#fff;cursor:pointer;margin-top:10px}',
    '#mi-onb .card{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:18px;padding:16px;margin-bottom:12px;animation:obPop .45s both}',
    '#mi-onb .causa{display:flex;gap:10px;font-size:14px;line-height:1.45;padding:8px 0;border-top:1px solid rgba(255,255,255,.08)}#mi-onb .causa:first-child{border:none}#mi-onb .causa b{display:block}',
    '#mi-onb .leg{font-size:12px;color:rgba(255,255,255,.55);margin-top:10px;line-height:1.5}',
    '#mi-onb svg{width:100%;height:auto;display:block}',
    '#mi-onb .portas{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:6px 0 2px}#mi-onb .portas span{font-size:26px;width:48px;height:48px;border-radius:14px;background:rgba(255,255,255,.1);display:grid;place-items:center;animation:obPop .5s both}',
    '#mi-onb input{width:100%;box-sizing:border-box;background:rgba(255,255,255,.08);border:1.5px solid rgba(255,255,255,.18);color:#fff;border-radius:14px;padding:14px;font:inherit;font-size:16px;margin-bottom:12px}#mi-onb input::placeholder{color:rgba(255,255,255,.4)}',
    '#mi-onb label.lb{display:block;font-size:13px;font-weight:700;margin-bottom:6px;color:rgba(255,255,255,.8)}',
    '#mi-onb .num{font-size:clamp(34px,8vw,46px);font-weight:800;letter-spacing:-1px;line-height:1}#mi-onb .proj{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;text-align:center}#mi-onb .proj small{display:block;font-size:12px;color:rgba(255,255,255,.6);margin-top:6px}',
    '#mi-onb .teste{display:flex;gap:14px;align-items:center}#mi-onb .teste .ic{font-size:30px;width:56px;height:56px;border-radius:16px;background:rgba(255,255,255,.1);display:grid;place-items:center;flex:none}#mi-onb .teste b{font-size:16px}#mi-onb .teste .min{margin-left:auto;font-size:13px;font-weight:800;background:rgba(125,211,252,.18);color:#7dd3fc;border-radius:99px;padding:5px 10px;white-space:nowrap}',
    '#mi-onb .chips{display:flex;flex-wrap:wrap;gap:8px}#mi-onb .chip{background:rgba(255,255,255,.1);border:1.5px solid transparent;color:#fff;border-radius:99px;padding:9px 14px;font:inherit;font-size:14px;font-weight:700;cursor:pointer}#mi-onb .chip.on{border-color:#7dd3fc;background:rgba(125,211,252,.2)}',
    '#mi-onb .resumo{display:grid;grid-template-columns:1fr 1fr;gap:10px}#mi-onb .resumo .card{margin:0}#mi-onb .resumo .card small{display:block;font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:#a5b4fc;margin-bottom:6px}#mi-onb .resumo .card b{font-size:15px}',
    '@media(max-width:520px){#mi-onb .ops.g2{grid-template-columns:1fr}#mi-onb .resumo{grid-template-columns:1fr}#mi-onb .ops.g3{grid-template-columns:1fr 1fr}}'
  ].join('');
  document.head.appendChild(obc);

  var OB=null,obFim=null;
  var OB_PASSOS=['intro','tempo','travas','porque','gostos','sonho','objetivo','nivel','minutos','dados','maratona','testes','manual','fim'];
  function conhecer(cb){
    obFim=cb||function(){};
    OB={i:0,r:{travas:[],obj:[],gostos:[]},testes:null};
    obEl.classList.add('on');requestAnimationFrame(function(){obEl.classList.add('vis');});
    document.body.style.overflow='hidden';
    obPintar();
  }
  function obHoras(m){return {mes:Math.round(m*30/60),ano:Math.round(m*365/60)};}
  function obBtn(lb,attr,dis){return '<button class="cta" '+attr+(dis?' disabled':'')+'>'+lb+'</button>';}
  function obOp(cls,attr,i,e,t,sub){return '<button class="op'+(cls?' on':'')+'" '+attr+' style="animation-delay:'+(i*0.045)+'s"><span class="e">'+e+'</span><span>'+E(t)+(sub?'<small>'+E(sub)+'</small>':'')+'</span></button>';}
  function obPintar(){
    var passo=OB_PASSOS[OB.i],r=OB.r,h='',nome=nomeCurto();
    var pct=Math.round(OB.i/(OB_PASSOS.length-1)*100);
    if(passo==='intro'){
      h='<span class="mi-logo mi-lg-ent" style="margin:6px 0 4px"></span><div class="k">Primeiro acesso</div><h2>'+(nome?E(nome)+', bem-vindo(a)':'Bem-vindo(a)')+'! Me deixa te conhecer 😊</h2>'
        +'<p class="s">Umas perguntas rápidas, 2 minutinhos. Assim eu monto o app com a sua cara: seus interesses, seu objetivo e o tempo que cabe no seu dia.</p>'
        +'<div class="card" style="font-size:14px;line-height:1.7">💬 Perguntas curtas, só tocar<br>🎯 No fim você vê o seu plano<br>🧭 E eu te mostro o próximo passo pra liberar o checklist e as aulas</div>'
        +obBtn('Bora →','data-ob="prox"');
    }else if(passo==='tempo'){
      h='<div class="k">Sua história</div><h2>Há quanto tempo você tenta aprender inglês?</h2><div class="ops">'
        +[['🐣','Nunca tentei de verdade'],['🌱','Menos de 1 ano'],['📆','De 1 a 3 anos'],['⌛','De 3 a 5 anos'],['🏔️','Mais de 5 anos']].map(function(o,i){return obOp(r.tempo===o[1],'data-ob-one="tempo" data-v="'+E(o[1])+'"',i,o[0],o[1]);}).join('')+'</div>';
    }else if(passo==='travas'){
      h='<div class="k">Sua história</div><h2>O que mais te travou até hoje?</h2><p class="s">Pode marcar mais de uma. Sem vergonha: todo mundo tem.</p><div class="ops g2">'
        +OB_TRAVAS.map(function(o,i){return obOp(r.travas.indexOf(o.k)>=0,'data-ob-multi="travas" data-v="'+o.k+'"',i,o.ic,o.t);}).join('')+'</div>'
        +obBtn('Continuar →','data-ob="prox"',!r.travas.length);
    }else if(passo==='porque'){
      var esc=OB_TRAVAS.filter(function(o){return r.travas.indexOf(o.k)>=0;});
      h='<div class="k">Respira</div><h2>Não é falta de capacidade. É o jeito que te ensinaram.</h2>'
        +'<div class="card">'+esc.map(function(o){return '<div class="causa"><span style="font-size:20px">'+o.ic+'</span><div><b>'+E(o.t)+'</b>'+E(o.c)+'</div></div>';}).join('')+'</div>'
        +'<div class="card" style="text-align:center"><div class="portas">'+Object.keys(INTEL).map(function(k,i){return '<span style="animation-delay:'+(i*0.06)+'s">'+IC('i-'+k)+'</span>';}).join('')+'</div>'
        +'<div style="font-weight:800;margin:10px 0 4px">Cada pessoa aprende por uma porta diferente</div><div class="leg" style="margin:0">Uns pela música, outros pelas imagens, pela conversa, pela lógica… A maioria dos cursos usa uma porta só. Daqui a pouco eu te mostro como descobrir a sua.</div></div>'
        +obBtn('Faz sentido →','data-ob="prox"');
    }else if(passo==='gostos'){
      h='<div class="k">Sobre você</div><h2>O que você mais curte?</h2><p class="s">Escolha quantos quiser. Eu uso isso pra trazer exemplos e conteúdos com a sua cara.</p><div class="ops g3">'
        +OB_GOSTOS.map(function(o,i){return '<button class="op'+(r.gostos.indexOf(o[1])>=0?' on':'')+'" data-ob-multi="gostos" data-v="'+E(o[1])+'" style="animation-delay:'+(i*0.035)+'s"><span class="e">'+o[0]+'</span>'+E(o[1])+'</button>';}).join('')+'</div>'
        +obBtn('Continuar →','data-ob="prox"',!r.gostos.length);
    }else if(passo==='sonho'){
      h='<div class="k">Imagina só</div><h2>Daqui a 6 meses, falando inglês… qual é a primeira coisa que você faz?</h2><div class="ops">'
        +OB_SONHO.map(function(o,i){return obOp(r.sonho===o[1],'data-ob-one="sonho" data-v="'+E(o[1])+'"',i,o[0],o[1]);}).join('')+'</div>';
    }else if(passo==='objetivo'){
      h='<div class="k">Seu objetivo</div><h2>E no dia a dia, pra que você precisa do inglês?</h2><p class="s">Pode marcar mais de uma.</p><div class="ops g2">'
        +OB_OBJ.map(function(o,i){return obOp(r.obj.indexOf(o[1])>=0,'data-ob-multi="obj" data-v="'+E(o[1])+'"',i,o[0],o[1]);}).join('')+'</div>'
        +obBtn('Continuar →','data-ob="prox"',!r.obj.length);
    }else if(passo==='nivel'){
      h='<div class="k">Seu momento</div><h2>Hoje, como você se sente no inglês?</h2><div class="ops">'
        +OB_NIV.map(function(o,i){return obOp(r.nivel===o[1],'data-ob-one="nivel" data-v="'+E(o[1])+'"',i,o[0],o[1],o[2]);}).join('')+'</div>';
    }else if(passo==='minutos'){
      var m=r.minutos||null,hh=m?obHoras(m):null;
      h='<div class="k">Sua rotina</div><h2>Quanto tempo por dia você quer praticar?</h2><p class="s">O que cabe de verdade no seu dia. Pouco todo dia vence muito de vez em quando.</p><div class="ops" style="grid-template-columns:repeat(3,1fr)">'
        +OB_MIN.map(function(x,i){return '<button class="op'+(m===x?' on':'')+'" data-ob-min="'+x+'" style="justify-content:center;animation-delay:'+(i*0.04)+'s">'+x+' min</button>';}).join('')+'</div>'
        +(hh?'<div class="card" style="margin-top:16px"><div style="font-weight:800;margin-bottom:14px">Com '+m+' min por dia, você soma:</div><div class="proj"><div><div class="num" data-cnt="'+hh.mes+'">0</div><small>horas por mês</small></div><div><div class="num" data-cnt="'+hh.ano+'">0</div><small>horas no ano</small></div><div><div class="num" data-cnt="'+Math.round(hh.ano/1.5)+'">0</div><small>aulas de 1h30 no ano</small></div></div></div>':'')
        +obBtn('Continuar →','data-ob="prox"',!m);
    }else if(passo==='dados'){
      var meta=(U&&U.user_metadata)||{};
      h='<div class="k">Pra eu te acompanhar</div><h2>Me conta um pouco de você</h2><p class="s">Só eu vejo isso.</p>'
        +'<label class="lb">Seu WhatsApp</label><input id="ob-whats" inputmode="tel" maxlength="25" placeholder="(11) 99999-9999" value="'+E(r.whats||LS.get('mi_whats_'+(U&&U.id||'x'),meta.whatsapp||''))+'">'
        +'<label class="lb">Profissão ou área</label><input id="ob-prof" maxlength="80" placeholder="Ex.: enfermeira, vendas, estudante" value="'+E(r.prof||'')+'">'
        +'<label class="lb">Cidade</label><input id="ob-cid" maxlength="60" placeholder="Ex.: Campinas/SP" value="'+E(r.cidade||'')+'">'
        +'<label class="lb">Data de nascimento <span style="font-weight:500;color:rgba(255,255,255,.5)">(opcional)</span></label><input id="ob-nasc" type="date" value="'+E(r.nasc||'')+'">'
        +obBtn('Continuar →','data-ob="dados"');
    }else if(passo==='maratona'){
      h='<div class="k">Quase lá</div><h2>Você está entrando por alguma maratona ou desafio?</h2><div class="ops">'
        +[['🏁','Sim, uma maratona do Gediel'],['🎯','Sim, outro desafio'],['🙅','Não, vim pelo programa']].map(function(o,i){return obOp(r.maratona===o[1],'data-ob-mar="'+E(o[1])+'"',i,o[0],o[1]);}).join('')+'</div>'
        +(r.maratona&&/^Sim/.test(r.maratona)?'<div style="margin-top:14px"><label class="lb">Qual?</label><input id="ob-marq" maxlength="80" placeholder="Ex.: O Inglês de Cada Dia" value="'+E(r.maratonaQual||'')+'"></div>':'')
        +obBtn('Continuar →','data-ob="mar"',!r.maratona);
    }else if(passo==='testes'){
      h='<div class="k">O passo mais importante</div><h2>Agora, o seu diagnóstico 🧭</h2>'
        +'<p class="s">O <b>checklist de hoje</b> e as <b>aulas</b> são montados pra você a partir de 2 testes. Por isso eles só liberam depois que você fizer os dois:</p>'
        +'<div class="card teste"><span class="ic">'+IC('prisma')+'</span><div><b>Prisma de Talentos</b><div class="leg" style="margin:2px 0 0">Descobre por qual porta o inglês entra em você.</div></div><span class="min">± '+MIN_PRISMA+' min</span></div>'
        +'<div class="card teste"><span class="ic">'+IC('bussola')+'</span><div><b>Bússola</b><div class="leg" style="margin:2px 0 0">Mostra seu nível real, do A1 ao C2.</div></div><span class="min">± '+MIN_BUSSOLA+' min</span></div>'
        +'<p class="leg">Ao todo, uns '+(MIN_PRISMA+MIN_BUSSOLA)+' minutos. Faça num lugar tranquilo, com fone.</p>'
        +obBtn('Fazer os 2 testes agora →','data-ob="t-agora"')+'<button class="cta2" data-ob="t-prisma">Fazer só o Prisma agora</button>'
        +'<button class="cta2" data-ob="t-manual">Já sei meu nível e meu jeito: escolher manualmente</button>'
        +'<button class="cta2" data-ob="t-depois">Deixar pra depois</button>';
    }else if(passo==='manual'){
      h='<div class="k">Escolha manual</div><h2>Me conta onde você está</h2><p class="s">Se depois quiser confirmar, os testes ficam no menu Perfil.</p>'
        +'<label class="lb">Seu nível</label><div class="chips" style="margin-bottom:18px">'+NIVEIS.map(function(n){return '<button class="chip'+(r.mNivel===n?' on':'')+'" data-ob-mn="'+n+'">'+n+'</button>';}).join('')+'</div>'
        +'<label class="lb">Seu jeito de aprender</label><div class="chips">'+Object.keys(INTEL).map(function(k){return '<button class="chip'+(r.mIntel===k?' on':'')+'" data-ob-mi="'+k+'">'+IC('i-'+k)+' '+E(INTEL[k].nome)+'</button>';}).join('')+'</div>'
        +obBtn('Salvar e continuar →','data-ob="m-ok"',!(r.mNivel&&r.mIntel));
    }else if(passo==='fim'){
      var tAg=OB.testes==='agora',tDep=OB.testes==='depois';
      h='<div class="k">Pronto'+(nome?', '+E(nome):'')+'!</div><h2>Seu plano está montado 🎉</h2>'
        +'<div class="resumo"><div class="card"><small>Meta por dia</small><b>⏱️ '+(r.minutos||'—')+' min</b></div><div class="card"><small>Seu sonho</small><b>'+E(r.sonho||'—')+'</b></div>'
        +'<div class="card"><small>Objetivo</small><b>'+E(r.obj.join(', ')||'—')+'</b></div><div class="card"><small>Você curte</small><b>'+E(r.gostos.slice(0,4).join(', ')||'—')+'</b></div></div>'
        +(tAg?'<div class="card" style="margin-top:12px">🧭 Agora vêm os 2 testes (uns '+(MIN_PRISMA+MIN_BUSSOLA)+' min). Quando terminar cada um, toque no seu resultado. Aí o checklist e as aulas liberam.</div>'
          :tDep?'<div class="card" style="margin-top:12px">🔒 O checklist e as aulas ficam esperando os seus 2 testes. Quando quiser, é só tocar em <b>Checklist</b> ou em <b>Perfil → Bússola / Prisma</b>.</div>'
          :'<div class="card" style="margin-top:12px">✅ Nível e jeito de aprender salvos. Seu checklist e suas aulas já estão liberados.</div>')
        +obBtn(tAg?'Começar pelo Prisma →':'Entrar no app →','data-ob="fim"');
    }
    obEl.innerHTML='<div class="ob-top">'+(OB.i>0?'<button class="ob-voltar" data-ob="voltar" aria-label="Voltar">←</button>':'<span style="min-width:44px"></span>')
      +'<div class="ob-bar"><i style="width:'+pct+'%"></i></div>'+(passo==='intro'?'<button class="ob-pular" data-ob="pular">Pular</button>':'<span style="min-width:44px"></span>')+'</div>'
      +'<div class="ob-body"><div class="ob-in">'+h+'</div></div>';
    obEl.querySelector('.ob-body').scrollTop=0;
    setTimeout(function(){
      [].forEach.call(obEl.querySelectorAll('[data-cnt]'),function(el){var alvo=+el.dataset.cnt,t0=performance.now();(function an(t){var p=Math.min(1,(t-t0)/900);el.textContent=Math.round(alvo*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(an);})(t0);});
    },80);
  }
  function obIr(passo){OB.i=OB_PASSOS.indexOf(passo);obPintar();}
  function obAvancar(ms){setTimeout(function(){if(!OB)return;var n=OB.i+1;if(OB_PASSOS[n]==='manual')n++;OB.i=Math.min(n,OB_PASSOS.length-1);obPintar();},ms||0);}
  function obConcluir(pulou){
    var r=OB?OB.r:{},testes=OB?OB.testes:null;
    ST.onb=pulou?{pulou:true,em:new Date().toISOString()}:{em:new Date().toISOString(),tempo:r.tempo,travas:r.travas,gostos:r.gostos,sonho:r.sonho,obj:r.obj,nivel:r.nivel,prof:r.prof,cidade:r.cidade,nasc:r.nasc,whats:r.whats,minutos:r.minutos,maratona:r.maratona,maratonaQual:r.maratonaQual,testes:testes};
    if(r.whats)LS.set('mi_whats_'+(U&&U.id||'x'),r.whats);
    salvar();
    if(window._sb&&r.whats)window._sb.auth.updateUser({data:{whatsapp:r.whats}}).catch(function(){});
    obEl.classList.remove('vis');
    setTimeout(function(){
      obEl.classList.remove('on');obEl.innerHTML='';document.body.style.overflow='';OB=null;
      var fila=testes==='agora'?['prisma','bussola']:testes==='prisma'?['prisma']:[],fim=obFim;
      (function prox(){if(fila.length){window._aposTeste=prox;abrirTeste(fila.shift());}else fim();})();
    },330);
  }
  obEl.addEventListener('click',function(e){
    if(!OB)return;var r=OB.r,b=e.target.closest('button');if(!b)return;
    var a=b.dataset.ob;
    if(a==='prox')return obAvancar();
    if(a==='voltar'){var p=OB.i-1;if(OB_PASSOS[p]==='manual'&&OB.testes!=='manual')p--;OB.i=Math.max(0,p);return obPintar();}
    if(a==='pular')return obConcluir(true);
    if(a==='dados'){
      var w=$('ob-whats').value.trim();
      if(w&&w.replace(/\D/g,'').length<10){toast('Coloca o WhatsApp com DDD 🙏','#ef4444');return;}
      r.whats=w;r.prof=$('ob-prof').value.trim();r.cidade=$('ob-cid').value.trim();r.nasc=$('ob-nasc').value;return obAvancar();
    }
    if(a==='mar'){var q=$('ob-marq');if(q)r.maratonaQual=q.value.trim();return obAvancar();}
    if(a==='t-agora'){OB.testes='agora';return obIr('fim');}
    if(a==='t-prisma'){OB.testes='prisma';return obIr('fim');}
    if(a==='t-depois'){OB.testes='depois';return obIr('fim');}
    if(a==='t-manual'){OB.testes='manual';return obIr('manual');}
    if(a==='m-ok'){ST.nivel=r.mNivel;ST.prisma=r.mIntel;try{localStorage.setItem('userLevel',r.mNivel);}catch(x){}salvar();pintarPerfil();return obIr('fim');}
    if(a==='fim')return obConcluir(false);
    if(b.dataset.obOne){r[b.dataset.obOne]=b.dataset.v;obPintar();return obAvancar(260);}
    if(b.dataset.obMulti){var arr=r[b.dataset.obMulti],v=b.dataset.v,ix=arr.indexOf(v);if(ix>=0)arr.splice(ix,1);else arr.push(v);return obPintar();}
    if(b.dataset.obMin){r.minutos=+b.dataset.obMin;return obPintar();}
    if(b.dataset.obMar){var q2=$('ob-marq');if(q2)r.maratonaQual=q2.value.trim();r.maratona=b.dataset.obMar;return obPintar();}
    if(b.dataset.obMn){r.mNivel=b.dataset.obMn;return obPintar();}
    if(b.dataset.obMi){r.mIntel=b.dataset.obMi;return obPintar();}
  });

  /* ───────────────────────── PORTÃO: checklist e aulas só depois do diagnóstico ───────────────────────── */
  function faltaDiagnostico(){return !souAdmin()&&ehPrograma()&&!(ST.nivel||ST.prisma);}
  function portao(oque){
    var ov=$('pw-ov');if(!ov)return;
    var feitoN=!!ST.nivel,feitoP=!!ST.prisma;
    ov.innerHTML='<div class="pw" style="text-align:left"><div style="text-align:center">'+IC('bussola','xl')+'</div><h3 style="text-align:center">Falta pouco pra liberar '+E(oque)+'</h3>'
      +'<p style="text-align:center">Faça <b>um dos dois</b> testes (ou os dois): o checklist e as aulas se montam a partir do resultado.</p>'
      +'<div class="mi-gate-it'+(feitoP?' ok':'')+'"><span>'+IC('prisma')+'</span><div><b>Prisma de Talentos</b><small>'+(feitoP?'Feito: '+E(INTEL[ST.prisma].nome):'± '+MIN_PRISMA+' minutos')+'</small></div>'+(feitoP?'<i>✓</i>':'<button data-gate="prisma">Fazer</button>')+'</div>'
      +'<div class="mi-gate-it'+(feitoN?' ok':'')+'"><span>'+IC('bussola')+'</span><div><b>Bússola de nível</b><small>'+(feitoN?'Feito: '+E(ST.nivel):'± '+MIN_BUSSOLA+' minutos')+'</small></div>'+(feitoN?'<i>✓</i>':'<button data-gate="bussola">Fazer</button>')+'</div>'
      +'<button class="nao" data-gate="manual" style="display:block;width:100%;margin-top:14px;font-weight:700;color:var(--accent)">Já sei: escolher manualmente</button>'
      +'<button class="nao" data-fechar style="display:block;width:100%">Deixar pra depois</button></div>';
    ov.classList.add('open');
  }
  document.addEventListener('click',function(e){
    var b=e.target.closest('[data-gate]');if(!b)return;var a=b.dataset.gate,ov=$('pw-ov');
    if(ov){ov.classList.remove('open');ov.innerHTML='';}
    if(a==='manual'){go(ST.nivel?'prisma':'bussola');toast('Escolha nos botões "Escolher manualmente" 👇');return;}
    window._aposTeste=function(){if(faltaDiagnostico())portao('o checklist e as aulas');else toast('🎉 Checklist e aulas liberados!','#10b981');};
    abrirTeste(a);
  });

  /* admin: ver o que o aluno respondeu no primeiro acesso */
  window.admPerfil=function(id){
    var u=(window._admUsers||{})[id];if(!u)return;
    var o=((u.user_metadata||{}).mi||{}).onb,meta=u.user_metadata||{},nm=meta.full_name||meta.name||u.email;
    var linha=function(k,v){return v&&(v.length!==0)?'<div style="display:grid;grid-template-columns:150px 1fr;gap:10px;padding:8px 0;border-top:1px solid var(--border);font-size:13px"><b>'+k+'</b><span>'+E(Array.isArray(v)?v.join(', '):v)+'</span></div>':'';};
    var corpo=!o?'<p style="color:var(--fg2)">Ainda não respondeu o primeiro acesso.</p>':o.pulou?'<p style="color:var(--fg2)">Pulou as perguntas do primeiro acesso.</p>'
      :linha('Respondeu em',new Date(o.em).toLocaleString('pt-BR'))+linha('Tenta inglês há',o.tempo)+linha('O que travou',(o.travas||[]).map(function(k){return (OB_TRAVAS.filter(function(x){return x.k===k;})[0]||{t:k}).t;}))
       +linha('Curte',o.gostos)+linha('Sonho',o.sonho)
       +linha('Objetivo',o.obj)+linha('Como se sente',o.nivel)+linha('WhatsApp',o.whats)+linha('Profissão',o.prof)+linha('Cidade',o.cidade)+linha('Nascimento',o.nasc?o.nasc.split('-').reverse().join('/'):'')
       +linha('Meta por dia',o.minutos?o.minutos+' min':'')+linha('Testes no 1º acesso',{agora:'Fez na hora',manual:'Escolheu manualmente',depois:'Deixou pra depois'}[o.testes]||'')+linha('Maratona',o.maratona?(o.maratona+(o.maratonaQual?' · '+o.maratonaQual:'')):'')
       +linha('Prisma completo',(((u.user_metadata||{}).mi||{}).prisma&&INTEL[u.user_metadata.mi.prisma])?INTEL[u.user_metadata.mi.prisma].nome:'')+linha('Nível (Bússola)',((u.user_metadata||{}).mi||{}).nivel||'');
    var ov=document.createElement('div');ov.className='mi-pf-ov';ov.style.cssText='position:fixed;inset:0;z-index:9600;background:rgba(6,9,22,.6);display:flex;align-items:center;justify-content:center;padding:16px';
    ov.innerHTML='<div style="background:var(--surface);color:var(--fg);border-radius:20px;padding:20px;width:560px;max-width:100%;max-height:calc(100dvh - 40px);overflow:auto;box-shadow:0 24px 60px rgba(0,0,0,.4)"><div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px"><div><div style="font-size:11px;font-weight:800;letter-spacing:1px;color:var(--accent);text-transform:uppercase">Perfil do aluno</div><div style="font-size:18px;font-weight:800">'+E(nm)+'</div></div><button class="admin-btn admin-btn-ghost admin-btn-sm" data-x>Fechar</button></div>'
      +corpo+(o&&o.whats?'<a class="admin-btn admin-btn-sm" style="margin-top:14px;display:inline-block;text-decoration:none" target="_blank" rel="noopener" href="https://wa.me/'+(String(o.whats).replace(/\D/g,'').length<=11?'55':'')+String(o.whats).replace(/\D/g,'')+'">💬 Chamar no WhatsApp</a>':'')+'</div>';
    ov.addEventListener('click',function(e){if(e.target===ov||e.target.closest('[data-x]'))ov.remove();});
    document.body.appendChild(ov);
  };
  /* ───────────────────────── MODO EDIÇÃO (só admin) + REGRAS DE ACESSO ─────────────────────────
     O admin liga "✏️ Editar" no topo e edita a própria plataforma: cards, materiais, menus e universos novos.
     Regras de acesso por card, material e menu: todos / alunos do Programa / quem comprou um produto da Kiwify.
     A compra cai na tabela compras (webhook Kiwify → Make) e libera sozinha pelo nome do produto. */
  var EDIT=false;
  var PRODUTOS_KIWIFY=['Método Inteligente — Programa em Grupo','Inglês de Cada Dia','English on Mission','Passaporte do Inglês','Guia de Inglês por Nível','Kit de Frases','Aula Secreta'];
  function AS(){return (window.EBG_ACESSO||{}).estado||{};}
  function ehPrograma(){var S=AS();return !S.ok||!!S.programa||souAdmin();}
  function temAcesso(r){if(!r||!r.acesso||r.acesso==='todos'||souAdmin())return true;if(r.acesso==='programa')return ehPrograma();if(r.acesso==='produto')return temProduto(r.produto);return true;}
  function checkoutDe(r){return (r&&r.checkout)||(AS().cfg||{}).checkout||'';}
  function produtosConhecidos(){var o={};PRODUTOS_KIWIFY.forEach(function(p){o[p]=1;});(AS().todasCompras||[]).forEach(function(c){if(c.produto&&c.produto!=='teste')o[c.produto]=1;});return Object.keys(o);}
  function camposAcesso(pre,r){r=r||{};
    return '<div class="adm-section">Quem acessa</div><select class="admin-inp" id="'+pre+'-acesso">'
      +[['todos','🌍 Todo aluno logado'],['programa','🎓 Só alunos do Programa'],['produto','🛒 Só quem comprou um produto (Kiwify)']].map(function(o){return '<option value="'+o[0]+'"'+((r.acesso||'todos')===o[0]?' selected':'')+'>'+o[1]+'</option>';}).join('')+'</select>'
      +'<div id="'+pre+'-acbox" style="display:'+((r.acesso==='produto'||r.acesso==='programa')?'grid':'none')+';grid-template-columns:1fr 1fr;gap:10px;margin-top:8px" class="grid-2">'
      +'<div'+(r.acesso==='programa'?' style="display:none"':'')+' data-so-produto><div class="adm-section" style="margin-top:0">Produto que libera</div><input class="admin-inp" id="'+pre+'-produto" list="mi-prods" placeholder="Nome (ou parte) do produto na Kiwify" value="'+E(r.produto||'')+'"></div>'
      +'<div><div class="adm-section" style="margin-top:0">Link do checkout</div><input class="admin-inp" id="'+pre+'-checkout" placeholder="https://pay.kiwify.com.br/..." value="'+E(r.checkout||'')+'"></div></div>'
      +'<div style="font-size:11px;color:var(--fg3);margin-top:6px;line-height:1.5">Quem não tem acesso vê um cadeado 🔒 e vai pro checkout. Quando a compra cai na Kiwify, o acesso libera sozinho pelo nome do produto.</div>';
  }
  function lerAcesso(pre){var a=$(pre+'-acesso').value;return {acesso:a,produto:a==='produto'?($(pre+'-produto').value.trim()||null):null,checkout:a==='todos'?null:($(pre+'-checkout').value.trim()||null)};}
  document.addEventListener('change',function(e){var s=e.target;if(!s.id||!/-acesso$/.test(s.id))return;var pre=s.id.replace(/-acesso$/,''),box=$(pre+'-acbox');if(!box)return;box.style.display=s.value==='todos'?'none':'grid';var p=box.querySelector('[data-so-produto]');if(p)p.style.display=s.value==='produto'?'':'none';});
  var dl=document.createElement('datalist');dl.id='mi-prods';document.body.appendChild(dl);
  function encherProdutos(){dl.innerHTML=produtosConhecidos().map(function(p){return '<option value="'+E(p)+'">';}).join('');}

  /* campos de acesso dentro do modal de card que já existe */
  (function(){
    var box=$('uc-valor-box');if(!box)return;
    var d=document.createElement('div');d.id='uc-acesso-wrap';box.insertAdjacentElement('afterend',d);
  })();
  var abrirModalCardOrig=abrirModalCard;
  abrirModalCard=function(c){abrirModalCardOrig(c);encherProdutos();var w=$('uc-acesso-wrap');if(w)w.innerHTML=camposAcesso('uc',ADM.edit);
    var h=$('uc-h');if(h&&ADM.edit&&!UNIV[ADM.edit.universo])h.textContent=(ADM.edit.id?'Editar card':'Novo card');};

  /* ── config dos menus (nome, ícone, ordem, oculto, acesso) e universos novos, guardados em acesso/cfg ── */
  async function salvarCfg(patch){
    var cur=await window._sb.from('acesso').select('dados').eq('id','cfg').maybeSingle();
    var dados=Object.assign({},(cur.data&&cur.data.dados)||{},patch);
    var r=await window._sb.from('acesso').upsert({id:'cfg',dados:dados});
    if(r.error)throw r.error;CFG=dados;var S=AS();if(S.cfg)Object.assign(S.cfg,patch);return dados;
  }
  function chaveDe(n){var m=(n.getAttribute('onclick')||'').match(/goTo\('([\w-]+)'/);return m?m[1]:null;}
  function criarUniExtra(x){
    if(!x||!x.k||UNIV[x.k])return;
    UNIV[x.k]={icon:x.icone||'✨',nav:x.nome||'Novo',title:x.nome||'Novo',sub:x.sub||'',cor:x.cor||'linear-gradient(135deg,#1b2a6b,#8b5cf6)',extra:true};
    var sec=[].filter.call(document.querySelectorAll('.nav-section'),function(s){return /universos/i.test(s.textContent);})[0];
    var ult=[].filter.call(document.querySelectorAll('.nav-pill'),function(n){var k=chaveDe(n);return k&&UNIV[k]&&!UNIV[k].extra;}).pop();
    var p=document.createElement('div');p.className='nav-pill';p.setAttribute('onclick',"goTo('"+x.k+"',this)");p.innerHTML='<span class="nav-icon">'+E(x.icone||'✨')+'</span><span>'+E(x.nome||'Novo')+'</span>';
    (ult||sec).insertAdjacentElement('afterend',p);
    var pn=document.createElement('div');pn.className='pane';pn.id='pane-'+x.k;var ref=$('pane-viagens')||$('pane-materiais');ref.insertAdjacentElement('afterend',pn);
    if(window.TITLES)TITLES[x.k]=x.nome;
  }
  function aplicarMenus(){
    iconesMenu();
    var M=(CFG&&CFG.menus)||{};
    ((CFG&&CFG.unisExtra)||[]).forEach(criarUniExtra);
    var pais=[];
    [].forEach.call(document.querySelectorAll('.sidebar .nav-pill'),function(n){
      var k=chaveDe(n);if(!k)return;var m=M[k]||{};
      if(!n.dataset.nomeOrig){var sp=n.querySelectorAll('span');n.dataset.nomeOrig=sp[1]?sp[1].textContent:'';n.dataset.icOrig=sp[0]?sp[0].innerHTML:'';}
      var s=n.querySelectorAll('span');if(s[1])s[1].textContent=m.nome||n.dataset.nomeOrig;if(s[0]){if(m.icone)s[0].textContent=m.icone;else s[0].innerHTML=n.dataset.icOrig;}
      if(UNIV[k]){if(m.nome)UNIV[k].nav=UNIV[k].title=m.nome;if(m.sub)UNIV[k].sub=m.sub;if(m.icone)UNIV[k].icon=m.icone;}
      if(m.nome&&window.TITLES)TITLES[k]=m.nome;
      n.classList.toggle('mi-oculto',!!m.oculto);
      n.classList.toggle('mi-cad',!temAcesso(m));
      n.dataset.ord=m.ord!=null?m.ord:'';
      if(pais.indexOf(n.parentNode)<0)pais.push(n.parentNode);
    });
    // ordem: só move pills que têm ordem salva, dentro do mesmo bloco entre títulos de seção
    pais.forEach(function(pai){
      var blocos=[],cur=[];[].forEach.call(pai.children,function(ch){if(ch.classList.contains('nav-section')){blocos.push(cur);cur=[];}else if(ch.classList.contains('nav-pill'))cur.push(ch);});blocos.push(cur);
      blocos.forEach(function(b){if(!b.some(function(n){return n.dataset.ord!=='';}))return;
        var ant=b[0]&&b[0].previousElementSibling;var ord=b.slice().sort(function(a,c){var x=a.dataset.ord===''?b.indexOf(a)*10:+a.dataset.ord,y=c.dataset.ord===''?b.indexOf(c)*10:+c.dataset.ord;return x-y;});
        ord.forEach(function(n){if(ant)ant.insertAdjacentElement('afterend',n);else pai.insertBefore(n,pai.firstChild);ant=n;});});
    });
    pintarEdicaoMenu();
  }
  // trava de menu por regra de acesso
  var goAnt2=window.goTo;
  window.goTo=function(page,el){
    if((page==='maratona'||page==='modulos')&&!EDIT&&faltaDiagnostico()){portao(page==='maratona'?'o checklist':'as aulas');return;}
    var m=((CFG&&CFG.menus)||{})[page];
    if(m&&!EDIT&&!temAcesso(m)){irCheckout(checkoutDe(m),m.nome||(window.TITLES&&TITLES[page])||'Essa área');return;}
    if(UNIV[page]&&UNIV[page].extra)desenharUni(page);
    var r=goAnt2(page,el);
    if(page==='materiais'&&window.renderMat)renderMat();
    if(page==='modulos')pintarEdModulos();
    return r;
  };

  /* ── cards: cadeado pela regra de acesso ── */
  var cardLockOrig=cardLock;
  cardLock=function(c){if(c.acao==='material'){var mt=(AS().mats||[]).filter(function(x){return x.id===c.valor;})[0];if(mt&&!matLivre(mt))return true;}return cardLockOrig(c)||!temAcesso(c);};
  /* o link da live do devocional muda toda semana e é revelado no grupo do WhatsApp */
  var GRUPO_EOM=null;
  async function grupoEom(){
    if(GRUPO_EOM!==null)return GRUPO_EOM;
    try{await carregarCards();var g=(CARDS||[]).filter(function(c){return c.universo==='eom'&&/grupo/i.test(c.titulo||'')&&/chat\.whatsapp|wa\.me|whatsapp\.com/i.test(c.valor||'');})[0];GRUPO_EOM=g?g.valor:'';}catch(e){GRUPO_EOM='';}
    return GRUPO_EOM;
  }
  function abrirGrupo(){
    if(GRUPO_EOM){window.open(GRUPO_EOM,'_blank','noopener');return;}
    wa('Oi Gediel! Quero entrar no grupo do English on Mission pra receber o link do devocional.');
  }
  window.miGrupoEom=abrirGrupo;
  function ehDevocional(c){return c&&c.universo==='eom'&&/youtu/i.test(c.valor||'')&&/devocional|ao vivo/i.test(c.titulo||'');}
  function folhaDevocional(){go('lives');return;
    var lv=(window.LIVES||[]).filter(function(x){return x.id==='devocional';})[0],nx=lv&&window.nextOccurrence?nextOccurrence(lv):null;
    var ov=document.createElement('div');ov.className='pw-ov open';
    ov.innerHTML='<div class="pw" style="text-align:center"><div style="font-size:40px">🙏</div><div style="font-size:18px;font-weight:800;margin:6px 0">O link é revelado no grupo</div>'
      +'<div style="font-size:13.5px;color:var(--fg2);line-height:1.6;margin-bottom:14px">O link da live do devocional muda toda semana e sai no grupo do WhatsApp do English on Mission, um pouco antes de começar. Entra no grupo e você recebe o aviso.</div>'
      +(nx?'<div class="lv-cd" data-at="'+nx.getTime()+'" style="justify-content:center;margin-bottom:14px"></div>':'')
      +'<button class="pl-btn" style="--pc:#25d366" data-dv="grupo">'+IC('wa-real')+' Entrar no grupo do WhatsApp</button>'
      +'<button class="admin-btn admin-btn-ghost" style="width:100%;margin-top:8px" data-dv="fechar">Agora não</button></div>';
    document.body.appendChild(ov);tickCd();
    ov.addEventListener('click',function(e){var b=e.target.closest('[data-dv]');if(e.target===ov||(b&&b.dataset.dv==='fechar')){ov.remove();return;}if(b&&b.dataset.dv==='grupo'){abrirGrupo();ov.remove();}});
  }
  var acaoTxtOrig=acaoTxt;
  acaoTxt=function(c){return ehDevocional(c)?'Ver nas Lives ›':acaoTxtOrig(c);};
  var abrirCardOrig=abrirCard;
  abrirCard=async function(id,uni){
    var c=(CARDS||[]).filter(function(x){return x.id===id;})[0];if(!c)return;
    if(!temAcesso(c)){irCheckout(checkoutDe(c),'"'+c.titulo+'"');return;}
    if(c.acao==='material'){var mt=(AS().mats||[]).filter(function(x){return x.id===c.valor;})[0];if(mt)return abrirMaterial(mt);toast('Material ainda não ligado a esse card');return;}
    if(c.acao==='playlist'){var pv=window._plVid;window._plVid=null;if(window.EBG_PLAYLIST)window.EBG_PLAYLIST.abrir(c,pv);return;}
    if(ehDevocional(c))return folhaDevocional();
    return abrirCardOrig(id,uni);
  };

  /* ── materiais: grade com capa, seção, preço e cadeado ── */
  function matLivre(m){var S=AS();return !S.ok||souAdmin()||!!S.programa||m.tipo==='gratis'||(m.tipo==='produto'&&temProduto(m.produto));}
  /* capas originais (vertical) e página de venda de cada e-book conhecido; vale pelo trecho do nome */
  var EBK=[
    {r:/pron[uú]nc|destrave/i,img:'img/capa-ebook-pronuncia.webp',url:'https://pay.kiwify.com.br/ODOhEzc'},
    {r:/passaporte|viagem|viagens/i,img:'img/capa-viagens.webp',url:'https://ebookviagens.netlify.app/'},
    {r:/guia a1|a1 at[eé] b2/i,img:'img/capa-guia.webp',url:'https://guia-a1-b2.netlify.app/'},
    {r:/kit frases|frases/i,img:'img/capa-frases.webp',url:''},
    {r:/10 jogos|jogos para aprender/i,img:'img/capa-ebook-jogos.webp',url:''},
    {r:/central de prompts|prompts/i,img:'img/capa-prompts.webp',url:''}
  ];
  function ebkDe(m){var n=(m.nome||'')+' '+(m.produto||'');return EBK.filter(function(x){return x.r.test(n);})[0]||null;}
  function capaEbook(m){var e=window.EBG_EBOOKS&&EBG_EBOOKS.deMaterial(m);if(e&&e.img)return e.img;var k=ebkDe(m);return k?k.img:'';}
  var renderMatOrig=window.renderMat;
  (function(){var c=document.createElement('style');c.textContent='.mat-chips{display:flex;gap:8px;flex-wrap:wrap;margin:2px 0 18px}.mat-chips .gf-btn small{opacity:.7;font-weight:800;margin-left:2px}@media(max-width:700px){.mat-chips{flex-wrap:nowrap;overflow-x:auto;margin-right:-16px;padding-right:16px;padding-bottom:4px}.mat-chips .gf-btn{flex:none}}';document.head.appendChild(c);
    document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-mf]');if(!b)return;window._matF=b.dataset.mf;window.renderMat();});})();
  window.renderMat=function(){
    var g=$('mat-grid'),S=AS();if(!g)return;
    var tabs=document.querySelector('#pane-materiais .mat-tabs');if(tabs)tabs.style.display='none';
    g.className='';
    if(!S.pronto){g.innerHTML='<div class="admin-loading">Carregando…</div>';return;}
    var lista=(S.mats||[]).filter(function(m){return m.ativo!==false||EDIT;});
    var EBx=window.EBG_EBOOKS;
    if(EBx&&!EDIT)lista=lista.filter(function(m){var c=EBx.deMaterial(m);if(!c||!c.bonusDe)return true;return !lista.some(function(o){var z=EBx.deMaterial(o);return z&&z.k===c.bonusDe;});});
    var secs=[],por={};lista.forEach(function(m){var s=m.secao||'Materiais';if(!por[s]){por[s]=[];secs.push(s);}por[s].push(m);});
    var n=0,h='';
    var F=window._matF||'todos';if(F!=='todos'&&F!=='gratis'&&F!=='meus'&&secs.indexOf(F)<0)F=window._matF='todos';
    var qtd={todos:lista.length,gratis:lista.filter(function(m){return m.tipo==='gratis';}).length,meus:lista.filter(function(m){return matLivre(m)&&m.tipo!=='gratis';}).length};
    var chips=[['todos','Todos',qtd.todos]];
    secs.forEach(function(x){chips.push([x,x,por[x].length]);});
    if(qtd.gratis)chips.push(['gratis','Grátis',qtd.gratis]);
    if(qtd.meus)chips.push(['meus','Meus',qtd.meus]);
    h+='<div class="mat-chips">'+chips.map(function(c){return '<button class="gf-btn'+(c[0]===F?' active':'')+'" data-mf="'+E(c[0])+'">'+E(c[1])+' <small>'+c[2]+'</small></button>';}).join('')+'</div>';
    var vis=lista.filter(function(m){return F==='todos'||(F==='gratis'?m.tipo==='gratis':F==='meus'?(matLivre(m)&&m.tipo!=='gratis'):(m.secao||'Materiais')===F);});
    h+='<div class="uni-grid mat-v">'+vis.map(function(m){
      var ok=matLivre(m),tag=m.tipo==='gratis'?'Grátis':ok?'✓ Seu':m.tipo==='programa'?'🔒 Programa':(m.preco||'🔒 Pago');
      var fr=m.tipo==='gratis',cv=capaEbook(m);
      return '<div class="uni-card'+(ok?'':' lock')+(fr?' free':'')+(m.ativo===false?' mi-off':'')+'" data-mat="'+m.id+'">'+edCtl('mat',m.id)
        +'<div class="th">'+(cv?'<img loading="lazy" alt="" src="'+E(cv)+'">':(m.capa_url?'<img loading="lazy" alt="" src="'+E(m.capa_url)+'">':capaAuto(m.nome,n)))+'<span class="tg'+(fr?' free':ok?' own':'')+'">'+(fr?'✓ ':'')+E(tag)+'</span>'+(ok?'':'<span class="mv-lk">🔒</span>')+'</div>'
        +'<div class="bd"><div class="tt">'+E(m.nome)+'</div><div class="ss" style="font-size:11.5px">'+(EBx&&(EBx.deMaterial(m)||{}).bonus?'📘 E-book + 📄 caderno pra imprimir':'')+'</div><div class="ac">'+(ok?(fr?'Abrir ›':'Ler agora ›'):(m.tipo==='programa'?'Ver o Programa ›':'Conhecer ›'))+'</div></div></div>';n++;}).join('')
      +(EDIT?'<button class="mi-novo" data-ed="mat-novo" data-sec="'+E(secs.indexOf(F)>=0?F:(secs[0]||'E-books'))+'">＋ Novo material</button>':'')+'</div>';
    if(!lista.length)h='<div class="admin-loading">Nenhum material ainda.</div>'+(EDIT?'<div class="uni-grid"><button class="mi-novo" data-ed="mat-novo">＋ Novo material</button></div>':'');
    if(EDIT)h='<div style="margin-bottom:14px"><label class="admin-btn admin-btn-ghost admin-btn-sm" style="cursor:pointer;display:inline-block">📥 Importar vários PDFs de uma vez<input type="file" id="mm-lote" accept="application/pdf" multiple style="display:none"></label></div>'+h;
    g.innerHTML=h;
  };
  document.addEventListener('click',async function(e){
    var el=e.target.closest('[data-mat]');if(!el||e.target.closest('[data-ed]'))return;
    var m=(AS().mats||[]).filter(function(x){return x.id===el.dataset.mat;})[0];if(!m)return;
    if(EDIT){abrirMat(m);return;}
    abrirMaterial(m);
  },true);
  document.addEventListener('click',function(e){
    var ab=e.target.closest('[data-ob-abrir]'),up=e.target.closest('[data-ob-up]'),EB=window.EBG_EBOOKS;if(!EB||(!ab&&!up))return;
    if(ab){var c=EB.por(ab.dataset.obAbrir),mt=(AS().mats||[]).filter(function(y){var z=EB.deMaterial(y);return z&&c&&z.k===c.k;})[0];var ov=$('pw-ov');if(ov)ov.classList.remove('open');if(mt)abrirMaterial(mt);else toast('Esse arquivo ainda não foi enviado. Avise o Gediel 🙏');return;}
    var x=EB.por(up.dataset.obUp);if(!x)return;
    if(x.virtual){var ov2=$('pw-ov');if(ov2)ov2.classList.remove('open');go('planos');return;}
    var mt2=(AS().mats||[]).filter(function(y){var z=EB.deMaterial(y);return z&&z.k===x.k;})[0];
    if(mt2){var ov3=$('pw-ov');if(ov3)ov3.classList.remove('open');abrirMaterial(mt2);return;}
    if(x.url){window.open(x.url,'_blank','noopener');return;}
    wa('Oi Gediel! Quero saber mais sobre "'+x.nome+'".');
  });
  /* admin: escolhe vários PDFs de uma vez; cada um é reconhecido pelo nome do arquivo, cria o material se não existir e envia o PDF */
  async function importarPdfs(files){
    var EB=window.EBG_EBOOKS,rel=[];if(!EB)return;
    /* nomes de produto que o Kiwify já mandou (tabela compras): o importador usa o nome real quando existe */
    var nomesK=[];try{var rc=await window._sb.from('compras').select('produto');nomesK=Array.from(new Set((rc.data||[]).map(function(x){return x.produto;}).filter(Boolean)));}catch(e){}
    var prodDe=function(c){var base=c.bonusDe?EB.por(c.bonusDe):c;var re=base.nome_re;var real=nomesK.filter(function(n){return re.test(n);})[0];return real||base.nome;};
    for(var i=0;i<files.length;i++){
      var f=files[i],c=EB.deArquivo(f.name);
      if(!c){rel.push('❓ '+f.name+': não reconheci');continue;}
      toast('⏳ '+(i+1)+'/'+files.length+' · '+c.nome);
      try{
        var mt=(AS().mats||[]).filter(function(y){return c.nome_re.test((y.nome||'')+' '+(y.produto||''));})[0],id=mt&&mt.id,pr=c.tipo==='gratis'?'':prodDe(c);
        if(!id){var ins=await window._sb.from('materiais').insert({nome:c.nome,descricao:c.desc,icone:'📘',secao:'E-books',tipo:c.tipo==='gratis'?'gratis':'produto',produto:pr,checkout:c.url||'',ativo:true,ordem:(AS().mats||[]).length+1+i}).select().single();if(ins.error)throw ins.error;id=ins.data.id;}
        else if(pr&&mt.tipo==='produto'&&!mt.produto){await window._sb.from('materiais').update({produto:pr}).eq('id',id);}
        var pth='materiais/'+id+'.pdf',up=await window._sb.storage.from('ebooks').upload(pth,f,{upsert:true,contentType:'application/pdf'});if(up.error)throw up.error;
        var u2=await window._sb.from('materiais').update({arquivo:pth}).eq('id',id);if(u2.error)throw u2.error;
        rel.push('✅ '+c.nome+(pr?' · libera pra quem comprou "'+pr+'"':'')+(c.bonusDe?' (bônus de '+EB.por(c.bonusDe).nome+')':''));
      }catch(err){rel.push('⚠️ '+f.name+': '+(err.message||err));}
    }
    await recarregarAcesso();alert(rel.join('\n'));
  }
  document.addEventListener('change',function(e){if(e.target&&e.target.id==='mm-lote'){importarPdfs([].slice.call(e.target.files));e.target.value='';}});
  /* abre o material: sem acesso → checkout; PDF guardado → ver ou baixar (link temporário); senão → link do conteúdo */
  async function abrirMaterial(m){
    if(!matLivre(m)){
      var kb=ebkDe(m),land=m.tipo==='programa'?'':(m.checkout||(kb&&kb.url)||'');
      if(land&&m.tipo!=='programa'){window.open(land,'_blank','noopener');return;}
      irCheckout(m.tipo==='programa'?(AS().cfg||{}).checkout:(m.checkout||(AS().cfg||{}).checkout),'"'+m.nome+'"');return;}
    if(m.arquivo){
      var v=await window._sb.storage.from('ebooks').createSignedUrl(m.arquivo,3600),d=await window._sb.storage.from('ebooks').createSignedUrl(m.arquivo,3600,{download:(m.nome||'ebook').replace(/[^\wÀ-ÿ -]/g,'').trim()+'.pdf'});
      if(v.error||!v.data){toast('Não consegui abrir o PDF agora. Tenta de novo ou avise o Gediel 🙏','#ef4444');return;}
      var ov=$('pw-ov');if(!ov){window.open(v.data.signedUrl,'_blank','noopener');return;}
      var EB=window.EBG_EBOOKS,extras=[];
      if(EB){var cm=EB.deMaterial(m);if(cm&&cm.bonus){for(var bi=0;bi<cm.bonus.length;bi++){var bm=(AS().mats||[]).filter(function(y){var z=EB.deMaterial(y);return z&&z.k===cm.bonus[bi]&&y.arquivo;})[0];if(!bm)continue;var bv=await window._sb.storage.from('ebooks').createSignedUrl(bm.arquivo,3600),bd=await window._sb.storage.from('ebooks').createSignedUrl(bm.arquivo,3600,{download:(bm.nome||'arquivo').replace(/[^\wÀ-ÿ -]/g,'').trim()+'.pdf'});if(bv.data)extras.push({nome:bm.nome,ler:bv.data.signedUrl,baixar:bd.data?bd.data.signedUrl:bv.data.signedUrl});}}}
      ov.innerHTML=EB?EB.obrigado(m,v.data.signedUrl,d.data?d.data.signedUrl:v.data.signedUrl,{extras:extras,tem:function(x){var mt=(AS().mats||[]).filter(function(y){var c=EB.deMaterial(y);return c&&c.k===x.k;})[0];return !!(mt&&matLivre(mt));}})
        :'<div class="pw"><h3>'+E(m.nome)+'</h3><a class="sim" href="'+E(v.data.signedUrl)+'" target="_blank" rel="noopener" style="display:block;text-decoration:none;text-align:center">👀 Ler agora</a><button class="nao" data-fechar style="display:block;width:100%">Fechar</button></div>';
      ov.classList.add('open');return;
    }
    var r=await window._sb.from('material_links').select('link').eq('material_id',m.id).maybeSingle();
    if(r.data&&r.data.link)window.open(r.data.link,'_blank','noopener');else toast('Esse material ainda está sem link. Avise o Gediel 🙏');
  }

  /* modal de material */
  var mm=document.createElement('div');mm.className='modal-overlay';mm.id='mi-mat-modal';
  mm.innerHTML='<div class="modal-box adm-modal-box" style="width:620px"><div class="modal-header"><h2 id="mm-h">Material</h2><button class="modal-close" data-ed="mm-fechar">✕</button></div><div class="modal-body">'
    +'<div class="adm-section">Capa · 1280 × 720 px</div><div class="adm-cover-drop" data-ed="mm-capa"><div class="adm-cover-prev" id="mm-prev">🖼️</div><div style="font-size:12px;color:var(--fg2);line-height:1.6"><strong>Clique pra enviar</strong><br>JPG/PNG · 16:9 · até 2 MB<br><button class="admin-btn admin-btn-ghost admin-btn-sm" style="margin-top:6px" data-ed="mm-sem-capa">Tirar capa</button></div><input type="file" id="mm-file" accept="image/*" style="display:none"></div>'
    +'<div class="adm-section">Nome</div><input class="admin-inp" id="mm-nome" maxlength="120">'
    +'<div class="adm-section">Descrição</div><textarea class="admin-inp" id="mm-desc" rows="2" maxlength="600"></textarea>'
    +'<div style="display:grid;grid-template-columns:1fr 1fr 80px;gap:10px" class="grid-2"><div><div class="adm-section">Seção</div><input class="admin-inp" id="mm-secao" list="mm-secoes" placeholder="Ex.: E-books"><datalist id="mm-secoes"></datalist></div><div><div class="adm-section">Preço (aparece no card)</div><input class="admin-inp" id="mm-preco" placeholder="R$ 27" maxlength="40"></div><div><div class="adm-section">Emoji</div><input class="admin-inp" id="mm-icone" maxlength="8" style="text-align:center"></div></div>'
    +'<div class="adm-section">Arquivo PDF do e-book (só quem tem acesso lê e baixa)</div><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><button class="admin-btn admin-btn-ghost admin-btn-sm" data-ed="mm-pdf">📄 Escolher PDF</button><span id="mm-pdf-nome" style="font-size:12px;color:var(--fg2)"></span><input type="file" id="mm-pdf" accept="application/pdf" style="display:none"></div>'
    +'<div class="adm-section">Ou link do conteúdo (só quem tem acesso vê)</div><input class="admin-inp" id="mm-link" placeholder="https://... (PDF, Drive, site do e-book)">'
    +'<div id="mm-acesso-wrap"></div>'
    +'<label style="display:flex;gap:6px;align-items:center;font-size:12.5px;margin-top:14px"><input type="checkbox" id="mm-ativo"> Visível pros alunos</label>'
    +'<div id="mm-st" style="font-size:12px;min-height:18px;margin-top:12px"></div>'
    +'<div style="display:flex;gap:8px;justify-content:space-between;margin-top:6px"><button class="admin-btn admin-btn-danger admin-btn-sm" data-ed="mm-apagar">🗑️ Apagar</button><div style="display:flex;gap:8px"><button class="admin-btn admin-btn-ghost" data-ed="mm-fechar">Cancelar</button><button class="admin-btn admin-btn-primary" data-ed="mm-salvar">💾 Salvar</button></div></div>'
    +'</div></div>';
  document.body.appendChild(mm);
  var MM={m:null,capa:null,pdf:null};
  $('mm-pdf').addEventListener('change',function(){var f=this.files&&this.files[0];if(!f)return;if(f.size>50*1048576){toast('PDF acima de 50 MB. Comprima antes 🙏','#ef4444');this.value='';return;}MM.pdf=f;$('mm-pdf-nome').textContent='📄 '+f.name+' ('+Math.round(f.size/1048576)+' MB)';});
  async function abrirMat(m,secao){
    MM.m=m||{tipo:'produto',ativo:true,secao:secao||''};MM.capa=null;MM.pdf=null;m=MM.m;setTimeout(function(){var pn=$('mm-pdf-nome');if(pn)pn.textContent=m.arquivo?'✅ PDF já enviado (escolha outro pra trocar)':'';},0);encherProdutos();
    $('mm-h').textContent=m.id?'Editar material':'Novo material';
    $('mm-nome').value=m.nome||'';$('mm-desc').value=m.descricao||'';$('mm-secao').value=m.secao||'';$('mm-preco').value=m.preco||'';$('mm-icone').value=m.icone||'';$('mm-ativo').checked=m.ativo!==false;
    $('mm-prev').innerHTML=m.capa_url?'<img src="'+E(m.capa_url)+'">':'🖼️';$('mm-st').innerHTML='';$('mm-st').dataset.confirm='';$('mm-link').value='';
    var ac={acesso:m.tipo==='gratis'?'todos':m.tipo==='programa'?'programa':'produto',produto:m.produto,checkout:m.checkout};
    $('mm-acesso-wrap').innerHTML=camposAcesso('mm',ac);
    var secs={};(AS().mats||[]).forEach(function(x){if(x.secao)secs[x.secao]=1;});$('mm-secoes').innerHTML=Object.keys(secs).map(function(s){return '<option value="'+E(s)+'">';}).join('');
    mm.classList.add('open');
    if(m.id){var r=await window._sb.from('material_links').select('link').eq('material_id',m.id).maybeSingle();$('mm-link').value=(r.data&&r.data.link)||'';}
  }
  $('mm-file').addEventListener('change',function(){var f=this.files&&this.files[0];if(!f)return;if(f.size>2*1024*1024){toast('Máximo 2 MB','#ef4444');this.value='';return;}MM.capa=f;$('mm-prev').innerHTML='<img src="'+URL.createObjectURL(f)+'">';});
  async function subirCapa(f,pasta,id){
    var ext=(f.name.split('.').pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'')||'jpg',path=pasta+'/'+id+'-'+Date.now()+'.'+ext;
    var up=await window._sb.storage.from('capas').upload(path,f,{upsert:true,contentType:f.type||'image/jpeg'});if(up.error)throw new Error('Capa: '+up.error.message);
    return window._sb.storage.from('capas').getPublicUrl(path).data.publicUrl;
  }
  async function salvarMat(){
    var st=$('mm-st'),m=MM.m,nome=$('mm-nome').value.trim();if(!nome){st.innerHTML='<span style="color:var(--red)">Dá um nome.</span>';return;}
    var ac=lerAcesso('mm');st.innerHTML='⏳ Salvando...';
    var row={nome:nome,descricao:$('mm-desc').value.trim(),secao:$('mm-secao').value.trim(),preco:$('mm-preco').value.trim(),icone:$('mm-icone').value.trim()||'📘',ativo:$('mm-ativo').checked,
      tipo:ac.acesso==='todos'?'gratis':ac.acesso,produto:ac.produto||'',checkout:ac.checkout||''};
    if(m.capa_url===null)row.capa_url=null;
    try{
      var id=m.id;
      if(!id){row.ordem=(AS().mats||[]).length+1;var ins=await window._sb.from('materiais').insert(row).select().single();if(ins.error)throw ins.error;id=ins.data.id;}
      if(MM.capa)row.capa_url=await subirCapa(MM.capa,'materiais',id);
      var u=await window._sb.from('materiais').update(row).eq('id',id);if(u.error)throw u.error;
      if(MM.pdf){st.innerHTML='⏳ Enviando o PDF ('+Math.round(MM.pdf.size/1048576)+' MB)...';var pth='materiais/'+id+'.pdf';var up=await window._sb.storage.from('ebooks').upload(pth,MM.pdf,{upsert:true,contentType:'application/pdf'});if(up.error)throw new Error('PDF: '+up.error.message+(/bucket/i.test(up.error.message)?' (rode o supabase/ebooks.sql no Supabase)':''));var u2=await window._sb.from('materiais').update({arquivo:pth}).eq('id',id);if(u2.error)throw u2.error;}
      var l=await window._sb.from('material_links').upsert({material_id:id,link:$('mm-link').value.trim()});if(l.error)throw l.error;
      mm.classList.remove('open');toast('✅ Material salvo!','#10b981');await recarregarAcesso();
    }catch(err){st.innerHTML='<span style="color:var(--red)">Erro: '+E(err.message)+'</span>';}
  }
  async function recarregarAcesso(){var A=window.EBG_ACESSO;if(A&&A.recarregar)await A.recarregar();renderMat();}

  /* ── controles de edição nos cards ── */
  function edCtl(tipo,id){return EDIT?'<div class="mi-ctl"><button data-ed="'+tipo+'-esq" data-id="'+id+'" title="Mover pra trás">◀</button><button data-ed="'+tipo+'-dir" data-id="'+id+'" title="Mover pra frente">▶</button><button data-ed="'+tipo+'-ed" data-id="'+id+'" title="Editar">✏️</button></div>':'';}
  async function moverCard(id,dir){
    var c=(CARDS||[]).filter(function(x){return x.id===id;})[0];if(!c)return;
    var l=CARDS.filter(function(x){return x.universo===c.universo;});
    var i=l.indexOf(c),j=i+dir;if(j<0||j>=l.length)return;var t=l[i];l[i]=l[j];l[j]=t;
    for(var k=0;k<l.length;k++)if(l[k].ord!==k+1){l[k].ord=k+1;await window._sb.from('mi_uni_cards').update({ord:k+1}).eq('id',l[k].id);}
    CARDS=null;desenharUni(c.universo);
  }
  async function moverMat(id,dir){
    var l=(AS().mats||[]).slice(),i=l.map(function(x){return x.id;}).indexOf(id),j=i+dir;if(i<0||j<0||j>=l.length)return;var t=l[i];l[i]=l[j];l[j]=t;
    for(var k=0;k<l.length;k++)if(l[k].ordem!==k+1){l[k].ordem=k+1;await window._sb.from('materiais').update({ordem:k+1}).eq('id',l[k].id);}
    AS().mats=l;renderMat();
  }
  document.addEventListener('click',async function(e){
    var b=e.target.closest('[data-ed]');
    if(!b){
      // no modo edição, tocar no card abre a edição
      var cd=EDIT&&e.target.closest('[data-unicard]');
      if(cd){e.stopImmediatePropagation();e.preventDefault();var c=(CARDS||[]).filter(function(x){return x.id===cd.dataset.unicard;})[0];if(c){ADM.uni=c.universo;abrirModalCard(c);}}
      return;
    }
    e.stopPropagation();e.preventDefault();var a=b.dataset.ed,id=b.dataset.id;
    if(a==='toggle')return modoEdicao(!EDIT);
    if(a==='card-esq'||a==='card-dir')return moverCard(id,a==='card-esq'?-1:1);
    if(a==='card-ed'){var c=(CARDS||[]).filter(function(x){return x.id===id;})[0];if(c){ADM.uni=c.universo;abrirModalCard(c);}return;}
    if(a==='card-novo'){ADM.uni=b.dataset.uni;abrirModalCard(null);if(b.dataset.sec)$('uc-secao').value=b.dataset.sec;return;}
    if(a==='mat-esq'||a==='mat-dir')return moverMat(id,a==='mat-esq'?-1:1);
    if(a==='mat-ed')return abrirMat((AS().mats||[]).filter(function(x){return x.id===id;})[0]);
    if(a==='mat-novo')return abrirMat(null,b.dataset.sec);
    if(a==='mm-fechar')return mm.classList.remove('open');
    if(a==='mm-capa'){if(e.target.closest('[data-ed="mm-sem-capa"]'))return;return $('mm-file').click();}
    if(a==='mm-sem-capa'){MM.capa=null;MM.m.capa_url=null;$('mm-prev').innerHTML='🖼️';return;}
    if(a==='mm-salvar')return salvarMat();
    if(a==='mm-pdf')return $('mm-pdf').click();
    if(a==='mm-apagar'){var st=$('mm-st');if(!MM.m.id){mm.classList.remove('open');return;}
      if(st.dataset.confirm!=='1'){st.dataset.confirm='1';st.innerHTML='<span style="color:var(--red)">Toque em Apagar de novo pra confirmar.</span>';return;}
      var r=await window._sb.from('materiais').delete().eq('id',MM.m.id);if(r.error){st.innerHTML='<span style="color:var(--red)">'+E(r.error.message)+'</span>';return;}
      mm.classList.remove('open');toast('🗑️ Material apagado','#6b7280');return recarregarAcesso();}
    if(a==='menu-ed')return abrirMenu(b.dataset.k);
    if(a==='menu-sobe'||a==='menu-desce')return moverMenu(b.dataset.k,a==='menu-sobe'?-1:1);
    if(a==='uni-novo')return abrirMenu(null);
    if(a==='mn-fechar')return mn.classList.remove('open');
    if(a==='mn-salvar')return salvarMenu();
    if(a==='mn-apagar')return apagarUni();
    if(a==='quiz-exp'){exportarQuizzes();return;}
    if(a==='mod-ed'){go('admin');setTimeout(function(){var t=[].filter.call(document.querySelectorAll('.admin-tab'),function(x){return /módulos/i.test(x.textContent);})[0];if(t)t.click();},250);return;}
  },true);
  // depois de salvar ou apagar um card, redesenha o universo aberto
  var salvarCardOrig=salvarCard;
  salvarCard=async function(){
    var ac=lerAcesso('uc');var antes=ADM.edit;
    await salvarCardOrig();
    if(!um.classList.contains('open')){
      var id=antes&&antes.id;
      if(!id){var r=await window._sb.from('mi_uni_cards').select('id').eq('universo',antes.universo).order('created_at',{ascending:false}).limit(1);id=r.data&&r.data[0]&&r.data[0].id;}
      if(id){var u=await window._sb.from('mi_uni_cards').update(ac).eq('id',id);if(u.error)toast('Acesso não salvou: '+u.error.message+' (rode o supabase/edicao.sql)','#ef4444');}
      CARDS=null;if(UNIV[window.currentPage])desenharUni(window.currentPage);
    }
  };
  document.addEventListener('click',function(e){
    var b=e.target.closest('#adm-uni-modal [data-ua="apagar"]');if(!b)return;
    setTimeout(function(){if(!um.classList.contains('open')&&UNIV[window.currentPage]){CARDS=null;desenharUni(window.currentPage);}},900);
  });

  /* ── modal de menu / universo novo ── */
  var mn=document.createElement('div');mn.className='modal-overlay';mn.id='mi-menu-modal';
  mn.innerHTML='<div class="modal-box adm-modal-box" style="width:520px"><div class="modal-header"><h2 id="mn-h">Menu</h2><button class="modal-close" data-ed="mn-fechar">✕</button></div><div class="modal-body">'
    +'<div style="display:grid;grid-template-columns:80px 1fr;gap:10px"><div><div class="adm-section">Ícone</div><input class="admin-inp" id="mn-icone" maxlength="8" style="text-align:center;font-size:18px"></div><div><div class="adm-section">Nome no menu</div><input class="admin-inp" id="mn-nome" maxlength="40"></div></div>'
    +'<div id="mn-sub-box"><div class="adm-section">Frase embaixo do título</div><input class="admin-inp" id="mn-sub" maxlength="140"></div>'
    +'<div id="mn-acesso-wrap"></div>'
    +'<label style="display:flex;gap:6px;align-items:center;font-size:12.5px;margin-top:14px"><input type="checkbox" id="mn-oculto"> Esconder esse menu dos alunos</label>'
    +'<div id="mn-st" style="font-size:12px;min-height:18px;margin-top:12px"></div>'
    +'<div style="display:flex;gap:8px;justify-content:space-between;margin-top:6px"><button class="admin-btn admin-btn-danger admin-btn-sm" data-ed="mn-apagar" id="mn-apagar">🗑️ Apagar universo</button><div style="display:flex;gap:8px;margin-left:auto"><button class="admin-btn admin-btn-ghost" data-ed="mn-fechar">Cancelar</button><button class="admin-btn admin-btn-primary" data-ed="mn-salvar">💾 Salvar</button></div></div>'
    +'</div></div>';
  document.body.appendChild(mn);
  var MN={k:null};
  function abrirMenu(k){
    MN.k=k;encherProdutos();var M=(CFG.menus||{})[k]||{},n=k?pill(k):null,sp=n?n.querySelectorAll('span'):[];
    $('mn-h').textContent=k?'Editar menu':'Novo universo';
    $('mn-nome').value=k?(M.nome||(sp[1]&&sp[1].textContent)||''):'';$('mn-icone').value=k?(M.icone||(sp[0]&&sp[0].textContent)||''):'✨';
    $('mn-sub').value=k&&UNIV[k]?(M.sub||UNIV[k].sub||''):'';$('mn-sub-box').style.display=(!k||UNIV[k])?'':'none';
    $('mn-oculto').checked=!!M.oculto;$('mn-acesso-wrap').innerHTML=camposAcesso('mn',M);
    $('mn-apagar').style.display=k&&UNIV[k]&&UNIV[k].extra?'':'none';$('mn-st').innerHTML='';$('mn-st').dataset.confirm='';
    mn.classList.add('open');
  }
  async function salvarMenu(){
    var st=$('mn-st'),nome=$('mn-nome').value.trim(),icone=$('mn-icone').value.trim()||'✨',sub=$('mn-sub').value.trim(),ac=lerAcesso('mn');
    if(!nome){st.innerHTML='<span style="color:var(--red)">Dá um nome.</span>';return;}
    st.innerHTML='⏳ Salvando...';
    try{
      var menus=Object.assign({},CFG.menus||{}),extras=(CFG.unisExtra||[]).slice(),k=MN.k;
      if(!k){k=nome.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,24)||'universo';
        while(UNIV[k]||pill(k)||$('pane-'+k))k+='-2';
        extras.push({k:k,nome:nome,icone:icone,sub:sub});}
      else extras=extras.map(function(x){return x.k===k?Object.assign({},x,{nome:nome,icone:icone,sub:sub}):x;});
      menus[k]=Object.assign({},menus[k]||{},{nome:nome,icone:icone,sub:sub||undefined,oculto:$('mn-oculto').checked},ac);
      await salvarCfg({menus:menus,unisExtra:extras});
      mn.classList.remove('open');toast('✅ Menu salvo!','#10b981');aplicarMenus();
      if(!MN.k)go(k);else if(UNIV[k]&&window.currentPage===k)desenharUni(k);
    }catch(err){st.innerHTML='<span style="color:var(--red)">Erro: '+E(err.message)+'</span>';}
  }
  async function apagarUni(){
    var st=$('mn-st'),k=MN.k;if(!k)return;
    if(st.dataset.confirm!=='1'){st.dataset.confirm='1';st.innerHTML='<span style="color:var(--red)">Os cards desse universo também somem. Toque em Apagar de novo pra confirmar.</span>';return;}
    try{
      await window._sb.from('mi_uni_cards').delete().eq('universo',k);
      var menus=Object.assign({},CFG.menus||{});delete menus[k];
      await salvarCfg({menus:menus,unisExtra:(CFG.unisExtra||[]).filter(function(x){return x.k!==k;})});
      var p=pill(k);if(p)p.remove();var pn=$('pane-'+k);if(pn)pn.remove();delete UNIV[k];
      mn.classList.remove('open');toast('🗑️ Universo apagado','#6b7280');go('home');
    }catch(err){st.innerHTML='<span style="color:var(--red)">'+E(err.message)+'</span>';}
  }
  async function moverMenu(k,dir){
    var n=pill(k);if(!n)return;
    var irmaos=[],ch=n;while(ch.previousElementSibling&&!ch.previousElementSibling.classList.contains('nav-section'))ch=ch.previousElementSibling;
    while(ch&&!ch.classList.contains('nav-section')){if(ch.classList.contains('nav-pill'))irmaos.push(ch);ch=ch.nextElementSibling;}
    var i=irmaos.indexOf(n),j=i+dir;if(j<0||j>=irmaos.length)return;var t=irmaos[i];irmaos[i]=irmaos[j];irmaos[j]=t;
    var menus=Object.assign({},CFG.menus||{});irmaos.forEach(function(p,ix){var kk=chaveDe(p);if(kk)menus[kk]=Object.assign({},menus[kk]||{},{ord:ix});});
    try{await salvarCfg({menus:menus});aplicarMenus();}catch(err){toast('Não salvou: '+err.message,'#ef4444');}
  }
  function pintarEdicaoMenu(){
    [].forEach.call(document.querySelectorAll('.mi-mctl,.mi-unovo'),function(x){x.remove();});
    if(!EDIT)return;
    [].forEach.call(document.querySelectorAll('.sidebar .nav-pill'),function(n){var k=chaveDe(n);if(!k||k==='admin')return;
      var d=document.createElement('span');d.className='mi-mctl';d.innerHTML='<button data-ed="menu-sobe" data-k="'+k+'" title="Subir">↑</button><button data-ed="menu-desce" data-k="'+k+'" title="Descer">↓</button><button data-ed="menu-ed" data-k="'+k+'" title="Editar">✏️</button>';n.appendChild(d);});
    var ult=[].filter.call(document.querySelectorAll('.sidebar .nav-pill'),function(n){return UNIV[chaveDe(n)];}).pop();
    if(ult){var b=document.createElement('button');b.className='mi-unovo';b.dataset.ed='uni-novo';b.textContent='＋ Novo universo';ult.insertAdjacentElement('afterend',b);}
  }
  function pintarEdModulos(){
    var p=$('pane-modulos');if(!p)return;var x=$('mi-mod-ed');
    if(!EDIT){if(x)x.remove();return;}
    if(!x){x=document.createElement('button');x.id='mi-mod-ed';x.className='mi-novo';x.dataset.ed='mod-ed';x.style.cssText='width:100%;margin-bottom:14px;min-height:0;padding:14px';x.textContent='✏️ Editar módulos, aulas, capas e quizzes';p.insertBefore(x,p.firstChild);}
    var y=$('mi-quiz-exp');if(!y){y=document.createElement('button');y.id='mi-quiz-exp';y.className='mi-novo';y.dataset.ed='quiz-exp';y.style.cssText='width:100%;margin-bottom:14px;min-height:0;padding:12px';y.textContent='📋 Copiar todos os quizzes das aulas (pra revisar)';x.insertAdjacentElement('afterend',y);}
  }
  async function exportarQuizzes(){
    var sb=window._sb;if(!sb)return;toast('Juntando as aulas…','#4f6ef7');
    var m=await sb.from('mi_modules').select('id,name,ord').order('ord'),l=await sb.from('mi_lessons').select('id,module_id,ord,title,description,quiz').order('ord');
    if(m.error||l.error){toast('Erro: '+((m.error||l.error).message),'#ef4444');return;}
    var t='';(m.data||[]).forEach(function(mo){t+='\n=== MÓDULO: '+mo.name+' ===\n';
      (l.data||[]).filter(function(x){return x.module_id===mo.id;}).forEach(function(x,i){
        t+='\n[Aula '+(i+1)+'] '+x.title+'\n';
        if(x.description)t+='Descrição: '+String(x.description).slice(0,500)+'\n';
        (x.quiz||[]).forEach(function(q,qi){t+='  '+(qi+1)+'. '+q.q+'\n'+(q.a||[]).map(function(o,oi){return '     '+'ABCD'[oi]+') '+o+(oi===q.c?'  ✅':'');}).join('\n')+'\n';});
        if(!(x.quiz||[]).length)t+='  (sem quiz)\n';});});
    var ok=false;try{await navigator.clipboard.writeText(t);ok=true;}catch(e){}
    var d=document.createElement('div');d.style.cssText='position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:16px';
    d.innerHTML='<div style="background:var(--surface);border-radius:16px;padding:16px;width:100%;max-width:560px;max-height:85vh;display:flex;flex-direction:column;gap:10px"><b>'+(ok?'✅ Copiado! Cola aqui no chat.':'Segura e copia o texto abaixo, depois cola no chat.')+'</b><textarea readonly style="flex:1;min-height:50vh;font-size:12px;border:1px solid var(--border);border-radius:10px;padding:10px;background:var(--surface2);color:var(--fg)">'+E(t)+'</textarea><button class="admin-btn admin-btn-primary" id="mi-qx-ok">Fechar</button></div>';
    document.body.appendChild(d);d.querySelector('#mi-qx-ok').onclick=function(){d.remove();};d.querySelector('textarea').onfocus=function(){this.select();};
  }
  function modoEdicao(on){
    EDIT=!!on&&souAdmin();document.body.classList.toggle('mi-edit',EDIT);
    var t=$('mi-ed-btn');if(t){t.innerHTML=EDIT?tileBtn('check','Concluir','#0a4921'):tileBtn('editar','Editar','#6e4705');t.classList.toggle('on',EDIT);}
    pintarEdicaoMenu();pintarEdModulos();
    var pg=window.currentPage;if(UNIV[pg]){CARDS=null;desenharUni(pg);}if(pg==='materiais')renderMat();
    document.dispatchEvent(new CustomEvent('ebg-edit',{detail:EDIT}));
    if(EDIT)toast('✏️ Modo edição: toque em card, material, menu, live ou texto sublinhado pra editar. Salva sozinho.','#4f6ef7');
  }
  function botaoEdicao(){
    if($('mi-ed-btn')||!souAdmin())return;
    var tb=document.querySelector('.topbar'),th=$('theme-toggle');if(!tb)return;
    var b=document.createElement('button');b.id='mi-ed-btn';b.className='tb-btn';b.dataset.ed='toggle';b.innerHTML=tileBtn('editar','Editar','#6e4705');
    tb.insertBefore(b,th||null);
  }
  async function iniciarEdicao(){
    await lerCfg();aplicarMenus();
    var t=0;(function esp(){var S=AS();if(S.pronto){botaoEdicao();aplicarMenus();if(window.currentPage==='materiais')renderMat();}else if(t++<240)setTimeout(esp,500);})();
  }
  window.MI_EDIT={ligar:modoEdicao,aplicarMenus:aplicarMenus};
  window.EBG_ED={salvar:salvarCfg,on:function(){return EDIT;},cfg:function(){return AS().cfg||CFG||{};}};
  /* ───────── tela de oferta: todo clique em algo pago mostra o que a pessoa leva antes do checkout ───────── */
  function ofertaDe(url,oque){
    var cf=AS().cfg||{},nome=String(oque||'').replace(/^"|"$/g,''),pl=planos(),u=String(url||'');
    var mt=(AS().mats||[]).filter(function(m){return m.nome===nome||(u&&m.checkout&&u.indexOf(m.checkout)>=0);})[0];
    if(mt)return {t:mt.nome,sub:mt.secao||'Material',img:mt.capa_url,preco:mt.preco,itens:[mt.descricao||'Acesso ao material completo','Ler online e baixar o PDF','Acesso pra sempre na sua conta','Liberado na hora, no mesmo login'].filter(Boolean),url:u};
    var cd=(CARDS||[]).filter(function(c){return c.titulo===nome;})[0];
    var md=(MODS_ALL||[]).filter(function(m){return m.name===nome||(u&&m.checkout&&u.indexOf(m.checkout)>=0);})[0];
    if(md&&md.trilha==='mini')return {t:md.name,sub:'Mini curso',img:md.cover_url||md.capa_url,preco:cd&&/^R\$/.test(cd.tag||'')?cd.tag:'',itens:[md.sub||'Todas as aulas do mini curso','Aulas em vídeo no seu ritmo','Acesso no mesmo login'],url:u};
    var p=pl.filter(function(x){return x.checkout&&u&&(u===x.checkout||u.indexOf(x.checkout)>=0||x.checkout.indexOf(u)>=0);})[0];
    if(!p&&((u&&u===cf.checkoutEom)||/devocion/i.test(nome)))p=pl.filter(function(x){return x.k==='mission';})[0];
    if(!p)p=pl.filter(function(x){return x.k==='inteligente';})[0];
    if(cd&&cd.acesso==='produto'&&!p)return {t:cd.titulo,sub:'',img:cd.capa_url,preco:cd.tag,itens:[cd.descricao],url:u};
    var hoje=new Date().toISOString().slice(0,10),pr=p.promo&&p.promoAte&&hoje<=p.promoAte;
    return {t:'Plano '+p.nome,sub:nome?'Pra liberar '+nome:p.sub,preco:pr?p.promo:p.preco,de:pr?p.preco:'',tag:pr?(p.promoNome||'Promoção'):'',itens:p.beneficios||[],url:u||p.checkout,cor:p.cor,planos:true};
  }
  var irOrig=window.irCheckout;
  window.irCheckout=function(url,oque){
    var o=ofertaDe(url,oque),ov=document.createElement('div');ov.className='pw-ov open of-ov';
    ov.innerHTML='<div class="pw of-box" style="--pc:'+E(o.cor||'#4f6ef7')+'"><button class="of-x" data-of="x">✕</button>'
      +(o.img?'<img class="of-img" alt="" src="'+E(o.img)+'">':'')
      +'<div class="of-k">🔒 Conteúdo pago</div><div class="of-t">'+E(o.t)+'</div>'+(o.sub?'<div class="of-s">'+E(o.sub)+'</div>':'')
      +(o.tag?'<div class="pl-promo">'+E(o.tag)+'</div>':'')+(o.de?'<div class="pl-de">de '+E(o.de)+'</div>':'')+(o.preco?'<div class="of-p">'+E(o.preco)+'</div>':'')
      +'<div class="of-l">O que você leva</div><ul>'+o.itens.filter(Boolean).map(function(i){return '<li>'+E(i)+'</li>';}).join('')+'</ul>'
      +'<button class="pl-btn" data-of="pagar">Quero liberar agora</button>'
      +(o.planos?'<button class="of-alt" data-of="planos">Comparar todos os planos</button>':'')
      +'<div class="of-f">Pagamento seguro pela Kiwify. Liberado no mesmo login logo depois da compra.</div></div>';
    document.body.appendChild(ov);
    ov.addEventListener('click',function(e){var b=e.target.closest('[data-of]');if(e.target===ov||(b&&b.dataset.of==='x')){ov.remove();return;}
      if(!b)return;if(b.dataset.of==='pagar'){ov.remove();window.open(o.url||url||(AS().cfg||{}).checkout,'_blank','noopener');}
      if(b.dataset.of==='planos'){ov.remove();go('planos');}});
  };
  /* ───── link de cadastro privado (Painel Admin → Criar acesso) ───── */
  var CV_PROD={inteligente:'Plano Inteligente',genio:'Plano Gênio',instituicao:'Plano Instituição'};
  function cvProduto(pl){if(CV_PROD[pl.k])return CV_PROD[pl.k];var cf=AS().cfg||{};if(pl.k==='mission')return (cf.eom&&cf.eom[0])||'English on Mission';return (pl.produtos&&pl.produtos[0])||'';}
  function cvPlanos(){return planos().filter(function(x){return x.k!=='gratis'&&cvProduto(x);});}
  function cvCodigo(){var a='abcdefghjkmnpqrstuvwxyz23456789',o='';var r=(window.crypto&&crypto.getRandomValues)?crypto.getRandomValues(new Uint8Array(12)):Array.apply(null,Array(12)).map(function(){return Math.random()*256;});for(var i=0;i<12;i++)o+=a[r[i]%a.length];return o;}
  function cvUrl(c){return location.origin+location.pathname.replace(/[^\/]*$/,'')+'convite.html?c='+c;}
  window.conviteLista=async function(){
    var sel=$('adm-cv-plano'),box=$('adm-cv-lista');if(!sel||!box)return;
    if(!sel.options.length){cvPlanos().forEach(function(x){var o=document.createElement('option');o.value=x.k;o.textContent=x.nome+' · '+x.preco;sel.appendChild(o);});var i=cvPlanos().map(function(x){return x.k;}).indexOf('inteligente');if(i>=0)sel.selectedIndex=i;}
    var r=await window._sb.from('maratona_convites').select('codigo,plano,ativo,created_at').eq('turma','privado').order('created_at',{ascending:false}).limit(30);
    if(r.error){box.innerHTML='<div style="font-size:12px;color:var(--red)">Não consegui listar os links ('+E(r.error.message)+').</div>';return;}
    var nomes=LS.get('mi-cv-nomes',{})||{};
    box.innerHTML=(r.data||[]).length?'<div style="font-size:11px;font-weight:800;letter-spacing:.5px;color:var(--fg3);margin-bottom:6px">LINKS GERADOS</div>'+r.data.map(function(x){
      return '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:8px 0;border-top:1px solid var(--border);font-size:12px"><div style="flex:1;min-width:140px"><b>'+E(nomes[x.codigo]||'Sem nome')+'</b> · '+E(String(x.plano).replace(/^Plano /,''))+'<br><span style="color:'+(x.ativo?'var(--green)':'var(--fg3)')+'">'+(x.ativo?'● aguardando cadastro':'○ usado ou desligado')+'</span></div>'
        +(x.ativo?'<button class="admin-btn admin-btn-ghost admin-btn-sm" data-cv="copiar" data-c="'+x.codigo+'">📋 Copiar</button><button class="admin-btn admin-btn-ghost admin-btn-sm" data-cv="zap" data-c="'+x.codigo+'">'+IC('wa-real')+' WhatsApp</button><button class="admin-btn admin-btn-ghost admin-btn-sm" data-cv="off" data-c="'+x.codigo+'">Desligar</button>':'')+'</div>';}).join(''):'';
  };
  window.conviteGerar=async function(){
    var st=$('adm-cv-status'),k=$('adm-cv-plano').value,pl=cvPlanos().filter(function(x){return x.k===k;})[0];if(!pl)return;
    st.innerHTML='⏳ Gerando…';var c=cvCodigo();
    var r=await window._sb.from('maratona_convites').insert({codigo:c,turma:'privado',plano:cvProduto(pl)});
    if(r.error){st.innerHTML='<span style="color:var(--red)">Erro: '+E(r.error.message)+'</span>';return;}
    var n=($('adm-cv-nome').value||'').trim();if(n){var m=LS.get('mi-cv-nomes',{})||{};m[c]=n;LS.set('mi-cv-nomes',m);}
    $('adm-cv-nome').value='';st.innerHTML='<span style="color:var(--green)">✅ Link pronto: </span><span style="word-break:break-all">'+E(cvUrl(c))+'</span>';
    try{await navigator.clipboard.writeText(cvUrl(c));st.innerHTML+='<br><span style="color:var(--green)">Copiado! É só colar no privado.</span>';}catch(e){}
    conviteLista();
  };
  window.EBG_CV={planos:cvPlanos,url:cvUrl,gerar:async function(k,nome){
    var pl=cvPlanos().filter(function(x){return x.k===k;})[0];if(!pl)throw new Error('plano');var c=cvCodigo();
    var r=await window._sb.from('maratona_convites').insert({codigo:c,turma:'privado',plano:cvProduto(pl)});if(r.error)throw r.error;
    if(nome){var m=LS.get('mi-cv-nomes',{})||{};m[c]=nome;LS.set('mi-cv-nomes',m);}return cvUrl(c);}};
  document.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest('[data-cv]');if(!b)return;var c=b.dataset.c,a=b.dataset.cv;
    if(a==='copiar'){var u=cvUrl(c);(navigator.clipboard?navigator.clipboard.writeText(u):Promise.reject()).then(function(){toast('Link copiado','#10b981');},function(){window.prompt('Copie o link:',u);});}
    if(a==='zap'){var n=(LS.get('mi-cv-nomes',{})||{})[c];window.open('https://wa.me/?text='+encodeURIComponent((n?'Oi, '+n+'! ':'Oi! ')+'Aqui está o seu link pra criar o acesso à plataforma: '+cvUrl(c)),'_blank');}
    if(a==='off'){window._sb.from('maratona_convites').update({ativo:false}).eq('codigo',c).then(function(){toast('Link desligado','#6b7280');conviteLista();});}
  });
  async function migrarDados(){
    var S=AS();if(!souAdmin()||!S.cfg)return;var feitas=(S.cfg.migr||[]).slice(),mudou=false;
    if(feitas.indexOf('spotify-eom-1')<0){
      var ex=await window._sb.from('mi_uni_cards').select('id').ilike('valor','%3hcF84KR80VqykVNeJy4x5%');
      if(!ex.error&&!(ex.data||[]).length){
        var ins=await window._sb.from('mi_uni_cards').insert({universo:'eom',ord:2,secao:'Assistir',titulo:'Playlist do EOM no Spotify',descricao:'Louvores em inglês pra treinar o ouvido enquanto você adora.',tag:'Grátis',emoji:'🎧',capa_url:'',acao:'link',valor:'https://open.spotify.com/playlist/3hcF84KR80VqykVNeJy4x5',destaque:false,em_breve:false,ativo:true,acesso:'todos'});
        if(ins.error)return;
      }
      feitas.push('spotify-eom-1');mudou=true;
    }
    /* revisão dos quizzes das aulas (erros achados na leitura): troca só as perguntas indicadas */
    if(feitas.indexOf('quiz-revisao-1')<0){
      var Q=function(q,a,c){return {q:q,a:a,c:c};};
      var PT=[
        {m:'Orientação',t:'Oque é o EOM',novoTitulo:'O que é o EOM',tudo:[
          Q('Quando acontece a live do Devocional em Inglês?',['Aos sábados, às 9h','Aos domingos','Às segundas, às 14h','Aos sábados, às 21h'],0),
          Q('O English on Mission é só para cristãos?',['Não, é aberto a todos','Sim, só para cristãos','Só para evangélicos','Só para católicos'],0),
          Q('Posso assistir às lives sem ter uma Bíblia?',['Não, a Bíblia é obrigatória','Sim, dá pra usar uma Bíblia no celular','Sim, mas só depois de comprar uma','Nunca'],1)]},
        {m:'Orientação',t:'Oque é o Culture English',novoTitulo:'O que é o Culture English',sePouco:[
          Q('Com que frequência acontece o encontro Culture English?',['Todo mês','Toda semana','Todo ano','Todo dia'],0),
          Q('Em qual dia do mês ele acontece?',['Na segunda terça-feira','No primeiro sábado','No último domingo','Toda quinta'],0),
          Q('Quando será o primeiro encontro?',['8 de dezembro','17 de novembro','5 de novembro','1º de janeiro'],0)]},
        {m:'Diagnóstico',t:'Bússula',novoTitulo:'Descubra seu Nível com a Bússola',troca:{
          0:Q('Pra que serve o resultado da Bússola (CEFR)?',['Pra ficar frustrado','Pra saber seu ponto de partida','Pra receber um certificado oficial','Pra ver como é um teste americano'],1),
          2:Q('Em geral, quem está no nível A2 consegue:',['Dar palestras','Se virar em situações simples e rotineiras','Escrever artigo científico','Traduzir livros'],1)}},
        {m:'Diagnóstico',t:'Prisma de Intelig',troca:{1:Q('Quantas inteligências o Prisma analisa?',['6','8','9','10'],2)}},
        {m:'Vocabulário',t:'Números, datas',troca:{4:Q('US$ 2.50 se fala, naturalmente:',['two fifty','two point five money','dollars two five','fifty two'],0)}},
        {m:'Gramática A1',t:'Artigos',troca:{2:Q('A escolha entre a e an depende:',['Da letra escrita','Do SOM inicial da palavra','Do tamanho da palavra','Do gênero'],1)}},
        {m:'Escrita',t:'Mensagens e redes',troca:{3:Q('Como dizer "faço aniversário hoje"?',['I make birthday today','Today is my birthday','I do birthday today','Today I birth'],1)}},
        {m:'Inglês pela Música',t:'Gramática escondida',troca:{
          0:Q('"I haven\'t finished yet" usa:',['Past simple','Present perfect','Futuro','Imperativo'],1),
          1:Q('"If I were rich, I would travel" é:',['Condicional hipotético','Passado real','Futuro certo','Pergunta'],0),
          4:Q('"Yesterday I walked home" está no:',['Presente','Passado','Futuro','Condicional'],1)}},
        {m:'Listening',t:'séries e filmes',troca:{4:Q('Quando subir de degrau na legenda?',['Nunca','Quando você entende bem o degrau atual','No dia 1','Quando alguém mandar'],1)}}
      ];
      try{
        var mods=await window._sb.from('mi_modules').select('id,name'),less=await window._sb.from('mi_lessons').select('id,module_id,title,quiz');
        if(mods.error||less.error)throw 0;
        for(var i=0;i<PT.length;i++){var pt=PT[i];
          var mo=(mods.data||[]).filter(function(x){return x.name.toLowerCase().indexOf(pt.m.toLowerCase())===0;})[0];if(!mo)continue;
          var le=(less.data||[]).filter(function(x){return x.module_id===mo.id&&x.title.toLowerCase().indexOf(pt.t.toLowerCase())>=0;})[0];if(!le)continue;
          var qz=(le.quiz||[]).slice(),row={};
          if(pt.tudo)row.quiz=pt.tudo;
          else if(pt.sePouco){if(!qz.length)row.quiz=pt.sePouco;}
          else if(pt.troca){Object.keys(pt.troca).forEach(function(k){qz[+k]=pt.troca[k];});row.quiz=qz;}
          if(pt.novoTitulo)row.title=pt.novoTitulo;
          if(Object.keys(row).length){var up=await window._sb.from('mi_lessons').update(row).eq('id',le.id);if(up.error)throw 0;}
        }
        feitas.push('quiz-revisao-1');mudou=true;
      }catch(e){}
    }
    if(feitas.indexOf('quiz-prisma-9')<0){
      try{
        var mp=await window._sb.from('mi_modules').select('id,name'),lp=await window._sb.from('mi_lessons').select('id,module_id,title,quiz');
        if(mp.error||lp.error)throw 0;
        var md=(mp.data||[]).filter(function(x){return x.name.toLowerCase().indexOf('diagnóstico')===0;})[0];
        var ls=md?(lp.data||[]).filter(function(x){return x.module_id===md.id&&x.title.toLowerCase().indexOf('prisma de intelig')>=0;})[0]:null;
        if(ls&&(ls.quiz||[]).length>1){var q2=ls.quiz.slice();q2[1]={q:'Quantas inteligências o Prisma analisa?',a:['6','8','9','10'],c:2};var u2=await window._sb.from('mi_lessons').update({quiz:q2}).eq('id',ls.id);if(u2.error)throw 0;}
        feitas.push('quiz-prisma-9');mudou=true;
      }catch(e){}
    }
    if(feitas.indexOf('ebooks-drive-1')<0){
      /* e-books da pasta do Drive que não têm landing de venda: entram em Materiais, liberados pra quem tem o Programa */
      var D=function(id){return 'https://drive.google.com/file/d/'+id+'/view';};
      var EB=[
        ['10 Jogos para Aprender Inglês','Jogos prontos pra treinar inglês brincando.','E-books','🎮','1-oVACvzU2k7see4kU5-8_jW5gjxV6kMu'],
        ['Inglês com Séries','Aprenda inglês de verdade com as séries que você já assiste.','E-books','📺','1HaM6XZAp7l04yYSJllkQB04lwmxwal3v'],
        ['Caderno de Séries (pra imprimir)','Caderno pra anotar vocabulário e frases enquanto assiste.','E-books','📓','1R49fo0W_a3n2QJd4_ZhCqxZSbBAbP1nc'],
        ['Culture English · Edição Visual','O e-book do Culture English, em edição visual.','E-books','🎬','15LIrNj5jdl9GYH8MTVfLykkNwmfnNBmh'],
        ['Inglês a Dois · 15 meses','Plano pra casais estudarem inglês juntos durante 15 meses.','Casais','💑','1aKbxRMobZFtXMXmozCPMBEgWxxrZQXjd'],
        ['Templates de Casais · 15 meses','Templates pra imprimir e acompanhar o plano a dois.','Casais','💑','1A3QgPZoDjUGgc-aHWsAd7mm_xIvn9b3q'],
        ['Do Zero ao Inglês em 360 Dias','Cronograma de estudo de 1 ano pra quem começa do zero.','Planners','🗓️','1nlahe-iS-FbQjw_QSH_trKnSljBzlW44'],
        ['English on Mission · Planner Anual','Planner anual do English on Mission.','Planners','🗓️','1XOX7L7Xsiqydq7D8t1OsB1-hItwfok7n']
      ];
      try{
        var ja=await window._sb.from('materiais').select('nome,ordem');if(ja.error)throw 0;
        var tem={},ord=0;(ja.data||[]).forEach(function(x){tem[(x.nome||'').toLowerCase()]=1;ord=Math.max(ord,x.ordem||0);});
        for(var k=0;k<EB.length;k++){var e=EB[k];if(tem[e[0].toLowerCase()])continue;
          var ins=await window._sb.from('materiais').insert({nome:e[0],descricao:e[1],secao:e[2],icone:e[3],tipo:'programa',produto:'',checkout:'',preco:'',ativo:true,ordem:++ord}).select().single();if(ins.error)throw 0;
          var lk=await window._sb.from('material_links').upsert({material_id:ins.data.id,link:D(e[4])});if(lk.error)throw 0;}
        feitas.push('ebooks-drive-1');mudou=true;
      }catch(e){}
    }
    if(feitas.indexOf('ebooks-visto-fora')<0){
      /* o Guia do Visto Americano é vendido (tem landing): sai de Materiais se já tinha entrado */
      try{
        var vm=await window._sb.from('materiais').select('id').eq('nome','Guia do Visto Americano').eq('tipo','programa');if(vm.error)throw 0;
        for(var v=0;v<(vm.data||[]).length;v++){await window._sb.from('material_links').delete().eq('material_id',vm.data[v].id);var dv=await window._sb.from('materiais').delete().eq('id',vm.data[v].id);if(dv.error)throw 0;}
        feitas.push('ebooks-visto-fora');mudou=true;
      }catch(e){}
    }
    if(feitas.indexOf('ebook-destrave-1')<0){
      /* Destrave Seu Inglês (R$ 14,90): material pago, com cadeado e botão de compra pra quem não tem */
      try{
        var dj=await window._sb.from('materiais').select('id,ordem');if(dj.error)throw 0;
        var jaTem=await window._sb.from('materiais').select('id').eq('nome','Destrave Seu Inglês');if(jaTem.error)throw 0;
        if(!(jaTem.data||[]).length){
          var mx=0;(dj.data||[]).forEach(function(x){mx=Math.max(mx,x.ordem||0);});
          var di=await window._sb.from('materiais').insert({nome:'Destrave Seu Inglês',descricao:'Pronúncia pra brasileiro: guia visual com a pronúncia escrita do jeito que a gente lê.',secao:'E-books',icone:'🗣️',tipo:'produto',produto:'Destrave Seu Inglês',checkout:'https://pay.kiwify.com.br/ODOhEzc',preco:'R$ 14,90',ativo:true,ordem:mx+1}).select().single();if(di.error)throw 0;
          var dl=await window._sb.from('material_links').upsert({material_id:di.data.id,link:'https://drive.google.com/file/d/1jHMPxGfsiur-3FUCHnwIqNCutywjkEak/view'});if(dl.error)throw 0;
        }
        feitas.push('ebook-destrave-1');mudou=true;
      }catch(e){}
    }
    var extra={};
    if(feitas.indexOf('programa-plano-inteligente')<0){var pg=(S.cfg.programa||[]).slice();if(pg.indexOf('Plano Inteligente')<0)pg.push('Plano Inteligente');extra.programa=pg;feitas.push('programa-plano-inteligente');mudou=true;}
    if(mudou){try{await salvarCfg(Object.assign({migr:feitas},extra));CARDS=null;}catch(e){}}
  }
  (function esperar(n){var S=AS();if(S&&S.pronto&&S.cfg){migrarDados();return;}if(n<40)setTimeout(function(){esperar(n+1);},1000);})(0);
  window.miLink=function(u){
    var t=window._curTask?{key:window._curTask.key,i:window._curTask.i}:null;
    if(u==='#jogos')return go('jogos');if(u==='#prompts'){if(window.EBG_PROMPTS_UI)EBG_PROMPTS_UI.abrir('rapido');return go('prompts');}if(u==='#modulos')return go('modulos');if(u==='#planos')return go('planos');if(u==='#prisma')return go('prisma');
    if(u.indexOf('#aula:')===0){var x=u.split(':');return abrirAula(x[1],x[2]);}
    if(u.indexOf('#jogo:')===0){window.__tarefaJogo=t;if(!jogar(u.slice(6)))go('jogos');return;}
  };

  /* ───────────────────────── CHECKLIST QUE CRESCE COM A PESSOA ─────────────────────────
     Nível A1 (ou "do zero"): a pessoa ainda não aprendeu nada, então não faz sentido pedir pra escrever ou revisar palavras.
     · até 3 aulas assistidas: só tarefas de APRENDER (aula, jogo de figura, jogo de ouvir, música, palavras parecidas)
     · de 3 a 7 aulas: volta o checklist por lugar, mas revisar já pode; escrever/falar/orar ainda viram tarefas de aprender
     · 8 aulas ou mais (ou nível acima de A1): checklist completo */
  var LIB_REVISAR=3,LIB_PRODUZIR=8;
  function nivelBaixo(){
    if(ST.nivel)return /^A1/i.test(ST.nivel);
    var o=ST.onb||{};if(o.nivel)return o.nivel==='Do zero'||o.nivel==='Entendo pouca coisa';
    return true;
  }
  function aulasVistas(){return (ST.vistas||[]).length;}
  function iniciante(){return nivelBaixo()&&aulasVistas()<LIB_REVISAR;}
  function exige(t){
    if(t.ex!=null)return t.ex;
    var x=(t.title||'')+' '+(t.sub||'');
    if(/escrev|frase|diário|diario|fal(e|ar)\b|falar|grav|ora(r|ção|çao)|conversa|pens(e|ar) em inglês|narr|descrev|explic|shadow|cant(e|ar)|imit|ensin|pergunt|apresent|text/i.test(x))return LIB_PRODUZIR;
    if(/revis|lembr|palavras do dia|flashcard|record|vocab/i.test(x))return LIB_REVISAR;
    return 0;
  }
  function proxAula(){
    if(!FLAT)return null;var v=ST.vistas||[];
    return FLAT.filter(function(it){return (!window.isOpen||isOpen(it.l))&&v.indexOf(it.l.id)<0;})[0]||null;
  }
  var SPOTIFY_EOM='https://open.spotify.com/playlist/3hcF84KR80VqykVNeJy4x5';
  var APR={
    aula:function(){var it=proxAula(),q=it&&it.l.quiz&&it.l.quiz.length;
      return {mn:15,icon:'📚',title:q?'Assistir a aula e fazer o quiz':'Assistir a aula da vez',sub:it?it.l.title:'A próxima aula do seu caminho',info:{why:'Tudo começa aqui: a aula ensina, o resto do checklist só pratica o que você viu. Sem aula, não tem o que praticar.',
        steps:['Toque no botão abaixo pra abrir a aula','Assista inteira, com caderno do lado. Pode pausar e voltar','Anote 3 palavras ou frases que você entendeu','No fim da aula, faça o quiz pra ver o que ficou'],
        links:[it?{t:'▶️ Abrir: '+it.l.title,u:'#aula:'+it.m.id+':'+it.l.id}:{t:'📚 Ir pras aulas',u:'#modulos'}]}};},
    imagem:function(){return {mn:3,icon:'🖼️',title:'Jogo: O que é isso?',sub:'Figura + palavra em inglês, 10 rodadas',info:{why:'O jeito mais rápido de aprender as primeiras palavras: ligar a imagem direto ao inglês, sem passar pelo português.',
        steps:['Toque em "Jogar agora"','Olhe a figura e escolha o nome em inglês','Ouça a pronúncia e repita em voz alta','Terminou? A tarefa marca sozinha'],links:[{t:'🎮 Jogar agora',u:'#jogo:O que é isso?'}]}};},
    ouvir:function(){return {mn:3,icon:'🔊',title:'Jogo: Ouça e Toque',sub:'Ouvir a palavra e achar a figura',info:{why:'Antes de falar, o ouvido precisa reconhecer o som. Aqui você treina isso sem precisar ler nada.',
        steps:['Toque em "Jogar agora" (som ligado)','Ouça a palavra e toque na figura certa','Pode ouvir de novo quantas vezes quiser','Terminou? A tarefa marca sozinha'],links:[{t:'🎮 Jogar agora',u:'#jogo:Ouça e Toque'}]}};},
    musica:function(){return {mn:4,icon:'🎵',title:'Ouvir 1 música e caçar 3 palavras',sub:'Sem letra, só o ouvido',info:{why:'Música repete as mesmas palavras várias vezes. É o jeito mais leve de reconhecer padrões do inglês.',
        steps:['Escolha 1 música da playlist','Ouça sem ler a letra','Anote 3 palavras que você reconheceu (vale palavra pequena)','Ouça de novo e veja se aparecem mais vezes'],
        links:[{t:'🟢 Playlist do English on Mission',u:SPOTIFY_EOM},{t:'▶️ Músicas fáceis em inglês',u:'https://www.youtube.com/results?search_query=easy+english+songs+for+beginners+with+lyrics'}],
        ex:['Palavras comuns de aprender (podem ou não aparecer na sua música): <b>love</b> (amor), <b>you</b> (você), <b>heart</b> (coração)']}};},
    cognatos:function(){return {mn:4,icon:'🔎',title:'Caçar 10 palavras que você já conhece',sub:'Inglês parecido com português',info:TI.cognatos};},
    complete:function(){return {mn:3,icon:'🧩',title:'Jogo: Complete',sub:'Frases curtinhas do começo',info:{why:'Agora que você já viu algumas aulas, dá pra brincar com frases simples.',steps:['Toque em "Jogar agora"','Escolha a palavra que completa a frase','Terminou? A tarefa marca sozinha'],links:[{t:'🎮 Jogar agora',u:'#jogo:Complete'}]}};}
  };
  function diaN(){return Math.floor(Date.now()/864e5);}
  var BASE={};

  /* ───────────────────────── TEMPO DISPONÍVEL ─────────────────────────
     Toda vez que a pessoa entra, ela diz quanto tempo tem (1, 5, 10, 30 ou 60 min) e o checklist se ajusta:
     poucas tarefas, curtas e fáceis. Aula só aparece com 30 min ou mais. */
  var TEMPOS=[{m:1,t:'1 min',s:'Só um minutinho'},{m:5,t:'5 min',s:'Rapidinho'},{m:10,t:'10 min',s:'Dá pra um pouco'},{m:30,t:'30 min',s:'Com calma'},{m:60,t:'60 min',s:'Tenho tempo'}];
  var TIER={1:{n:2,max:1,sum:1},5:{n:3,max:4,sum:5},10:{n:3,max:6,sum:10},30:{n:4,max:12,sum:30},60:{n:5,max:20,sum:60}};
  function tempoAtual(){var c=LS.get('mi_tempo',{});return c&&c.d===dia()&&TIER[c.m]?c.m:null;}
  function tempoUso(){return tempoAtual()||LS.get('mi_tempo',{}).m||10;}
  function dur(t){
    if(t.mn!=null)return t.mn;
    var x=((t.title||'')+' '+(t.sub||'')).toLowerCase(),m;
    if(/assistir (a )?(próxima )?aula|aula gravada|a aula da vez/.test(x))return 15;
    if((m=x.match(/(\d+)\s*min/)))return +m[1];
    if(/toda a viagem|todo o treino|durante todo|inteiro|toda a/.test(x))return 20;
    if(/cena|série|filme/.test(x))return 8;
    if((m=x.match(/(\d+)\s*flashcards/)))return Math.ceil(+m[1]/3)+1;
    if(/podcast/.test(x))return 10;
    if(/v[ií]deo/.test(x))return 4;
    if(/jog(o|ar)/.test(x))return 4;
    if(/escrev|di[aá]rio|mensagem|e-mail/.test(x))return 4;
    if(/shadowing|narrar|cantar|ensinar/.test(x))return 4;
    if(/separe 10|do seu jeito/.test(x))return 12;
    if(/m[uú]sica|playlist|louvor/.test(x))return 3;
    return 3;
  }
  function xTarefas(){
    return {dia:diaN(),hora:new Date().getHours(),fe:!!LS.get('mi_fe',false)||temProduto('English on Mission'),baixo:nivelBaixo()&&aulasVistas()<LIB_PRODUZIR,ini:iniciante(),vistas:aulasVistas(),
      aula:function(){return proxAula()?APR.aula():null;}};
  }
  function ajustarTempo(label){
    var m=tempoUso(),T=TIER[m]||TIER[10],jeito=(CTX_TASKS[label]||[]).filter(function(x){return x._jeito;})[0];
    var lista=window.EBG_TAREFAS?EBG_TAREFAS.gerar(label,m,xTarefas()):[];
    if(!lista.length){lista=(CTX_TASKS[label]||[]).slice(0,T.n);}
    if(jeito&&m>=30&&lista.length<T.n){var tot=lista.reduce(function(a,x){return a+(x._mn||dur(x));},0);if(tot+12<=T.sum)lista.push(Object.assign({},jeito,{_mn:12}));}
    CTX_TASKS[label]=lista;
  }
  function fmtMn(x){return x<1?'30 seg':x+' min';}
  function tempoBarra(){
    var m=tempoUso();
    return '<div class="mi-tm"><b>⏱ Quanto tempo você tem agora?</b><div>'+TEMPOS.map(function(t){return '<button type="button" data-tm="'+t.m+'"'+(t.m===m?' class="on"':'')+'>'+t.t+'</button>';}).join('')+'</div></div>';
  }
  function guardarTempo(m){
    var ant=LS.get('mi_tempo',{});LS.set('mi_tempo',{d:dia(),m:m});
    if(ant.m!==m||ant.d!==dia()){var ch=window._ctxChecked||{};Object.keys(ch).forEach(function(k){if(k!=='_idioma')ch[k]=[];});try{salvarChecks();}catch(e){}}
  }
  function perguntarTempo(cb){
    var m=tempoUso();
    abrirEntrada('<span class="mi-logo mi-lg-ent"></span><div class="mi-ent-kicker">Último passo</div>'
      +'<div class="mi-ent-q">Quanto tempo você tem agora?</div>'
      +'<div class="mi-ent-s">Eu ajusto o checklist pra caber no seu tempo. Pouco tempo, tarefa curtinha e leve. Mais tempo, entra a aula.</div>'
      +'<div class="mi-tmg">'+TEMPOS.map(function(t){return '<button type="button" data-tm="'+t.m+'"'+(t.m===m?' class="on"':'')+'><b>'+t.m+'<small>min</small></b><span>'+t.s+'</span></button>';}).join('')+'</div>');
    ent.onclick=function(e){var b=e.target.closest('[data-tm]');if(!b)return;guardarTempo(+b.dataset.tm);cb();};
  }
  document.addEventListener('click',function(e){
    var b=e.target.closest('.mi-tm [data-tm]');if(!b)return;
    guardarTempo(+b.dataset.tm);var k=ctxAtual()||(iniciante()?'Primeiros passos':'Em Casa');
    if(window.renderMarTasks)window.renderMarTasks(k);pintarRail();try{renderHome();}catch(x){}
    toast('⏱ Checklist ajustado pra '+b.dataset.tm+' min','#10b981');
  });
  function tarefasDoDia(label){tarefasDoDia0(label);tarefaDoJeito(label);ajustarTempo(label);}
  function tarefaDoJeito(label){
    if(!window.CTX_TASKS||!CTX_TASKS[label]||!ST.prisma||!INTEL[ST.prisma])return;
    var it=INTEL[ST.prisma],R=ST.prismaRes||{},lista=(R.taticas&&R.taticas.length?R.taticas:[]).concat(it.est||[]);if(!lista.length)return;
    var d=diaN(),dica=lista[d%lista.length];
    var t={_jeito:1,icon:it.ic,title:'Do seu jeito: '+dica.replace(/\.$/,''),sub:'Prisma · '+it.nome,info:{
      why:(R.aprende||it.desc)+' Por isso esta tarefa entra todo dia no seu checklist: é o caminho mais curto pro inglês ficar.',
      steps:['Separe 10 a 15 minutos agora','Faça: '+dica,(R.despertar?'Lembre: '+R.despertar:'Repita amanhã: a constância vale mais que a intensidade'),'Marque como feita'],
      links:[{t:'🔷 Ver meu Prisma',u:'#prisma'}]}};
    CTX_TASKS[label]=CTX_TASKS[label].filter(function(x){return !x._jeito;}).concat([t]);
  }
  function tarefasDoDia0(label){
    if(!window.CTX_TASKS)return;
    if(label!=='Primeiros passos'&&!CTX_TASKS[label]&&!BASE[label])label='Em Casa';
    if(!BASE[label]&&CTX_TASKS[label]&&label!=='Primeiros passos')BASE[label]=CTX_TASKS[label].map(function(t,i){var o=Object.assign({},t);if(!o.info&&!o.ref)o.ref=[label,i];return o;});
    var d=diaN(),v=aulasVistas();
    if(label==='Primeiros passos'){
      var A=[APR.imagem,APR.ouvir],C=[APR.musica,APR.cognatos];
      CTX_TASKS[label]=[APR.aula(),A[d%2](),A[(d+1)%2](),C[d%2]()];return;
    }
    var base=BASE[label];if(!base)return;
    if(!nivelBaixo()||v>=LIB_PRODUZIR){CTX_TASKS[label]=base;return;}
    var pool=['aula','imagem','ouvir','complete','musica','cognatos'],k=d%pool.length,usados={};
    CTX_TASKS[label]=base.map(function(t){
      if(exige(t)<=v)return t;
      for(var n=0;n<pool.length;n++){var nome=pool[(k+n)%pool.length];if(!usados[nome]){usados[nome]=1;k=(k+n+1)%pool.length;return APR[nome]();}}
      return APR.imagem();
    });
  }
  function pintarInicio(){
    var t=$('mar-ctx-title');if(!t)return;var box=$('mi-inicio');
    if(!box){box=document.createElement('div');box.id='mi-inicio';t.insertAdjacentElement('beforebegin',box);}
    var h=tempoBarra(),v=aulasVistas();
    if(tempoUso()<30)h+='<div class="mi-ini beg"><div class="tx"><b>📚 Aula fica pra quando tiver 30 min</b><span>Com '+tempoUso()+' min o checklist traz só tarefas curtas e leves. Tem 30 min ou mais? Escolha acima e a aula da vez entra.</span></div></div>';
    if(!ST.idioma)h+='<div class="mi-ini idi"><div class="ic">'+IC('idioma','xl')+'</div><div class="tx"><b>Missão de início: deixe seus aparelhos em inglês</b><span>Celular, Instagram, YouTube e Netflix. Você vai ler inglês o dia inteiro sem perceber.</span></div>'
      +'<div class="bt"><button data-ini="como">Como fazer</button><button class="ok" data-ini="feito">Já troquei ✓</button></div></div>';
    if(iniciante()){
      h+='<div class="mi-ini beg"><div class="tx"><b>🌱 Primeiros passos · '+v+'/'+LIB_REVISAR+' aulas</b><span>Agora é fase de aprender: aula, jogos de figura e som, música. Nada de escrever ou revisar o que você ainda não viu. Com '+LIB_REVISAR+' aulas, liberam os checklists por lugar.</span></div><div class="bar"><i style="width:'+(v/LIB_REVISAR*100)+'%"></i></div></div>';
    }else if(nivelBaixo()&&v<LIB_PRODUZIR){
      h+='<div class="mi-ini beg"><div class="tx"><b>🌿 Seu checklist cresce com você · '+v+'/'+LIB_PRODUZIR+' aulas</b><span>Revisar palavras já liberou. Escrever, falar e orar em inglês liberam com '+LIB_PRODUZIR+' aulas. Até lá, essas tarefas viram tarefas de aprender.</span></div><div class="bar"><i style="width:'+(v/LIB_PRODUZIR*100)+'%"></i></div></div>';
    }
    box.innerHTML=h;
    var beg=iniciante();document.body.classList.toggle('mi-beg',beg);
    if(beg)t.textContent='Tarefas de hoje · Primeiros passos';
  }
  /* trocar tarefa: cada tarefa tem 2 variações do mesmo nível; o botão gira original → variação 1 → variação 2 → original */
  var ORIG=null;
  function todasTarefas(){
    if(!ORIG){ORIG=[];var vis={};Object.keys(window.CTX_TASKS||{}).forEach(function(k){if(k==='Primeiros passos'||k==='_idioma')return;
      (BASE[k]||CTX_TASKS[k]||[]).forEach(function(t,i){if(vis[t.title])return;vis[t.title]=1;var o=Object.assign({},t);if(!o.info&&!o.ref)o.ref=[k,i];ORIG.push(o);});});}
    return ORIG;
  }
  function hashN(x){var h=0;for(var i=0;i<x.length;i++)h=(h*31+x.charCodeAt(i))|0;return Math.abs(h);}
  function variacoes(label,i,lista){
    var T=TIER[tempoUso()]||TIER[10],atual=lista[i]||{},resto=lista.reduce(function(a,x,k){return k===i?a:a+(x._mn||dur(x));},0);
    var excl=lista.map(function(t){return t.title;});
    var alt=window.EBG_TAREFAS?EBG_TAREFAS.alternativas(label,tempoUso(),xTarefas(),excl).filter(function(t){return resto+t._mn<=T.sum+1e-9;}):[];
    var seed=hashN(dia()+label+i),out=[];
    for(var n=0;n<alt.length&&out.length<2;n++){var t=alt[(seed+n*3)%alt.length];if(out.indexOf(t)<0)out.push(t);}
    return out;
  }
  function trocas(){return LS.get('mi_troca_'+dia(),{});}
  function aplicarTrocas(label){
    var tr=trocas()[label];if(!tr||!CTX_TASKS[label])return;var base=CTX_TASKS[label].slice();
    Object.keys(tr).forEach(function(i){var n=tr[i];if(!n)return;var alt=variacoes(label,+i,base)[n-1];if(alt)CTX_TASKS[label][i]=alt;});
  }
  window.miTrocar=function(ev,label,i){
    ev.stopPropagation();var ch=(window._ctxChecked||{})[label]||[];if(ch[i]){toast('Essa você já fez ✓');return;}
    var all=trocas();all[label]=all[label]||{};all[label][i]=((all[label][i]||0)+1)%3;LS.set('mi_troca_'+dia(),all);
    window.renderMarTasks(label);
  };
  var rmtOrig=window.renderMarTasks;
  if(rmtOrig){window.renderMarTasks=function(label){
    if(label!=='_idioma'){if(iniciante())label='Primeiros passos';if(!CTX_TASKS[label])label='Em Casa';tarefasDoDia(label);aplicarTrocas(label);}
    var r=rmtOrig(label);
    if(label!=='_idioma'){var tr=(trocas()[label])||{},ch=(window._ctxChecked||{})[label]||[];
      [].forEach.call(document.querySelectorAll('#mar-tasks-list .mar-task'),function(el,i){if(ch[i])return;
        var b=document.createElement('button');b.className='mi-troca';b.title='Trocar por outra tarefa';b.innerHTML='🔄<small>'+((tr[i]||0)+1)+'/3</small>';
        b.setAttribute('onclick',"miTrocar(event,'"+label.replace(/'/g,"\\'")+"',"+i+")");var hint=el.querySelector('.open-hint');el.insertBefore(b,hint);});}
    if(label!=='_idioma'){var lt=CTX_TASKS[label]||[];[].forEach.call(document.querySelectorAll('#mar-tasks-list .mar-task-title'),function(el,i){var x=lt[i];if(x&&x._mn!=null&&!el.querySelector('.mi-mn'))el.insertAdjacentHTML('beforeend',' <span class="mi-mn">⏱ '+fmtMn(x._mn)+'</span>');});}
    pintarInicio();return r;};}
  var tdOrig=window.taskDone;
  window.taskDone=function(){
    var c=window._curTask;
    if(c&&c.key==='_idioma'){ST.idioma=true;salvar();if(window.closeTaskModal)closeTaskModal();pintarInicio();toast('📱 Missão cumprida! Agora seu celular fala inglês.','#10b981');return;}
    return tdOrig&&tdOrig.apply(this,arguments);
  };
  document.addEventListener('click',function(e){
    var b=e.target.closest('[data-ini]');if(!b)return;
    if(b.dataset.ini==='como'&&window.openTask)openTask('_idioma',0);
    if(b.dataset.ini==='feito'){ST.idioma=true;salvar();pintarInicio();toast('📱 Boa! Aguenta 7 dias que vira hábito.','#10b981');}
  });
  try{if(window.loadStudentModules)window.loadStudentModules(true);}catch(e){}
  carregarFlat().then(function(){var tt=$('mar-ctx-title');if(iniciante()&&window.renderMarTasks)renderMarTasks('Primeiros passos');});
  setTimeout(function(){try{pintarInicio();if(iniciante()&&window.renderMarTasks)renderMarTasks('Primeiros passos');}catch(e){}},900);

  /* ───────────────────────── PLANOS ─────────────────────────
     Os planos ficam em acesso/cfg.planos. "tudo" = nomes de produto (Kiwify) que liberam a plataforma inteira. */
  function planosPadrao(){
    var cf=AS().cfg||{};
    return [
      {k:'gratis',nome:'Grátis',preco:'R$ 0',sub:'Pra conhecer o método',cor:'#64748b',beneficios:['Checklist diário e maratona','Jogos liberados','Materiais gratuitos','Lives abertas','Bússola de nível'],checkout:'',produtos:[]},
      {k:'mission',nome:'Mission',preco:'R$ 25/mês',sub:'Inglês com a Bíblia',cor:'#1f6b4a',beneficios:['Tudo do Grátis','Devocionais gravados','Inglês bíblico na prática','Comunidade do English on Mission','Materiais do EOM'],checkout:cf.checkoutEom||'',produtos:(cf.eom&&cf.eom.length?cf.eom:['English on Mission'])},
      {k:'inteligente',nome:'Inteligente',preco:'6x R$ 297',promo:'6x R$ 197',promoAte:'2026-11-30',promoNome:'Black Friday',sub:'O Programa completo',cor:'#4f6ef7',beneficios:['Tudo do Grátis','Todas as aulas do Programa','Todos os materiais','Lives com replay','Pode pedir aula particular com o Gediel (paga à parte)'],checkout:cf.checkout||'',produtos:(cf.programa||[]).slice()},
      {k:'genio',nome:'Gênio',preco:'6x R$ 329',sub:'Tudo liberado',cor:'#d4a017',destaque:true,tudo:true,beneficios:['Tudo do Inteligente + Mission','Todos os e-books e mini-cursos','Tudo que for lançado, sem pagar de novo','Pode pedir aula particular com o Gediel (paga à parte)'],checkout:'',produtos:['Plano Gênio']},
      {k:'instituicao',nome:'Instituição',preco:'A combinar',sub:'Igrejas, escolas, empresas e grupos',cor:'#0f172a',tudo:true,beneficios:['Tudo do Gênio pra cada pessoa','Quantidade de colaboradores sob medida','Turmas e lives combinadas com o grupo','Encontros com o Gediel definidos no contrato'],checkout:'',produtos:['Plano Instituição']}
    ];
  }
  function planos(){var cf=AS().cfg||{};var l=cf.planos&&cf.planos.lista;return (l&&l.length)?l:planosPadrao();}
  function comprouMesmo(t){var S=AS();t=(t||'').toLowerCase().trim();return !!t&&((S.compras||[]).some(function(c){return (c.produto||'').toLowerCase().indexOf(t)>=0;})||String(S.meta||'').toLowerCase().indexOf(t)>=0);}
  function meuPlano(){
    var l=planos();if(souAdmin())return 'genio';
    for(var i=l.length-1;i>=0;i--){var p=l[i];if((p.produtos||[]).some(function(x){return x&&comprouMesmo(x);}))return p.k;}
    return 'gratis';
  }
  function renderPlanos(){
    var p=$('pane-planos');if(!p)return;var l=planos(),meu=meuPlano();
    var h='<div class="pl-top"><div class="pl-k">Planos</div><h1>Escolha até onde você quer ir</h1><p>Todo mundo começa no Grátis. Cada plano libera um nível a mais da plataforma. Do Gênio pra cima, está tudo liberado.</p>'
      +(EDIT?'<button class="admin-btn admin-btn-primary admin-btn-sm" data-pl="editar">✏️ Editar planos</button>':'')+'</div><div class="pl-grid">';
    l.forEach(function(x){
      var atual=x.k===meu,inst=x.k==='instituicao';
      h+='<div class="pl-card'+(x.destaque?' dest':'')+(atual?' atual':'')+'" style="--pc:'+E(x.cor||'#4f6ef7')+'">'
        +(x.destaque?'<div class="pl-rib">Mais completo</div>':'')
        +'<div class="pl-nm">'+(x.k==='genio'||x.tudo?IC('planos'):'')+'Plano '+E(x.nome)+'</div><div class="pl-sub">'+E(x.sub||'')+'</div>'
        +(function(){var hoje=new Date().toISOString().slice(0,10),pr=x.promo&&x.promoAte&&hoje<=x.promoAte;
          if(pr)return '<div class="pl-promo">'+E(x.promoNome||'Promoção')+' · até '+x.promoAte.split('-').reverse().slice(0,2).join('/')+'</div><div class="pl-de">de '+E(x.preco)+'</div><div class="pl-pr">'+E(x.promo)+'</div>';
          return '<div class="pl-pr'+(x.preco?'':' vazio')+'">'+E(x.preco||'Valor sob consulta')+'</div>';})()
        +'<ul>'+(x.beneficios||[]).map(function(b){return '<li>'+E(b)+'</li>';}).join('')+'</ul>';
      if(atual)h+='<div class="pl-ok">✓ Seu plano atual</div>';
      else if(inst)h+='<div class="pl-inst"><label>Quantas pessoas?</label><input type="number" min="2" value="10" id="pl-qtd"></div><button class="pl-btn" data-pl="inst">'+IC('wa-real')+' Combinar pelo WhatsApp</button>';
      else if(x.k==='gratis')h+='<div class="pl-ok sub">Incluído no seu login</div>';
      else if(x.checkout)h+='<a class="pl-btn" target="_blank" rel="noopener" href="'+E(x.checkout)+'">Quero o '+E(x.nome)+'</a>';
      else h+='<button class="pl-btn" data-pl="zap" data-n="'+E(x.nome)+'">'+IC('wa-real')+' Quero o '+E(x.nome)+'</button>';
      h+='</div>';
    });
    h+='</div><div class="pl-aviso">'+IC('agendar')+'<div><b>Aula particular com o Gediel não está inclusa em nenhum plano.</b> A partir do Inteligente você pode pedir um horário em "Marcar aula". O valor é à parte e combinado direto com ele.</div></div><div class="pl-foot">Já comprou e não liberou? Saia e entre de novo com o e-mail da compra. Se continuar, chama no suporte.</div>';
    p.innerHTML=h;
  }
  function editarPlanos(){
    var l=planos(),ov=document.createElement('div');ov.className='pw-ov';ov.id='pl-ed';
    var h='<div class="pw" style="max-width:640px;max-height:86vh;overflow:auto;text-align:left"><div style="font-size:18px;font-weight:800;margin-bottom:4px">Editar planos</div><div style="font-size:12px;color:var(--fg3);margin-bottom:12px">Produtos = parte do nome do produto na Kiwify. Quem comprou cai nesse plano. "Libera tudo" abre a plataforma inteira.</div>';
    l.forEach(function(x,i){h+='<div class="pl-ed" data-i="'+i+'"><b>Plano '+E(x.nome)+'</b>'
      +'<label>Preço<input data-f="preco" value="'+E(x.preco||'')+'" placeholder="R$ 47/mês"></label>'
      +'<label>Preço promocional (opcional)<input data-f="promo" value="'+E(x.promo||'')+'" placeholder="6x R$ 197"></label>'
      +'<label>Promoção vale até (AAAA-MM-DD)<input data-f="promoAte" value="'+E(x.promoAte||'')+'" placeholder="2026-11-30"></label>'
      +'<label>Frase<input data-f="sub" value="'+E(x.sub||'')+'"></label>'
      +'<label>Link de checkout<input data-f="checkout" value="'+E(x.checkout||'')+'" placeholder="https://pay.kiwify.com.br/..."></label>'
      +'<label>Produtos da Kiwify (separe por vírgula)<input data-f="produtos" value="'+E((x.produtos||[]).join(', '))+'"></label>'
      +'<label>Benefícios (um por linha)<textarea data-f="beneficios" rows="4">'+E((x.beneficios||[]).join('\n'))+'</textarea></label>'
      +'<label class="ck"><input type="checkbox" data-f="tudo"'+(x.tudo?' checked':'')+'> Libera tudo</label></div>';});
    h+='<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:10px"><button class="admin-btn admin-btn-ghost" data-pl="fechar">Cancelar</button><button class="admin-btn admin-btn-primary" data-pl="salvar">Salvar planos</button></div></div>';
    ov.innerHTML=h;document.body.appendChild(ov);requestAnimationFrame(function(){ov.classList.add('open');});
  }
  document.addEventListener('click',async function(e){
    var b=e.target.closest('[data-pl]');if(!b)return;var a=b.dataset.pl;
    if(a==='editar')return editarPlanos();
    if(a==='fechar'){var o=$('pl-ed');if(o)o.remove();return;}
    if(a==='inst'){var q=($('pl-qtd')||{}).value||'';wa('Oi Gediel! Quero o Plano Instituição da Plataforma Inteligente pra '+q+' pessoas. Como funciona?');return;}
    if(a==='zap'){wa('Oi Gediel! Quero o Plano '+b.dataset.n+' da Plataforma Inteligente.');return;}
    if(a==='salvar'){
      var l=planos().map(function(x){return Object.assign({},x);});
      [].forEach.call(document.querySelectorAll('#pl-ed .pl-ed'),function(d){var x=l[+d.dataset.i];
        [].forEach.call(d.querySelectorAll('[data-f]'),function(f){var k=f.dataset.f;
          if(k==='tudo')x.tudo=f.checked;else if(k==='produtos')x.produtos=f.value.split(',').map(function(s){return s.trim();}).filter(Boolean);
          else if(k==='beneficios')x.beneficios=f.value.split('\n').map(function(s){return s.trim();}).filter(Boolean);else x[k]=f.value.trim();});});
      var tudo=[];l.forEach(function(x){if(x.tudo)(x.produtos||[]).forEach(function(p){if(tudo.indexOf(p)<0)tudo.push(p);});});
      b.disabled=true;b.textContent='Salvando…';
      try{await salvarCfg({planos:{lista:l,tudo:tudo}});var o2=$('pl-ed');if(o2)o2.remove();renderPlanos();toast('✅ Planos salvos','#10b981');}
      catch(err){b.disabled=false;b.textContent='Salvar planos';toast('Não salvou 😕 '+(err.message||''),'#ef4444');}
    }
  });
  /* ───────────────────────── STORY DE CONQUISTA (compartilhar no status / Instagram) ─────────────────────────
     Gera uma imagem 1080×1920 com o resultado do quiz, as tarefas feitas hoje, os dias seguidos e uma frase
     (meta, versículo ou filosofia). Cada toque em "Outra frase" sorteia outra. */
  var FRASES=[
    ['Disciplina é escolher o que você quer mais em vez do que você quer agora.','Meta'],
    ['Pequeno todo dia vence grande de vez em quando.','Meta'],
    ['Você não precisa estar pronto. Precisa estar em movimento.','Meta'],
    ['Fluência não é talento. É repetição com propósito.','Método Inteligente'],
    ['O resultado que você quer está do outro lado da constância.','Performance'],
    ['Hoje eu fiz o que o meu eu de daqui a 6 meses vai agradecer.','Performance'],
    ['Errar falando é melhor do que acertar calado.','Método Inteligente'],
    ['Quem treina no silêncio, fala com confiança no palco.','Performance'],
    ['Consagre ao Senhor tudo o que você faz, e os seus planos serão bem-sucedidos.','Provérbios 16:3'],
    ['Tudo posso naquele que me fortalece.','Filipenses 4:13'],
    ['Não nos cansemos de fazer o bem, pois no tempo próprio colheremos, se não desanimarmos.','Gálatas 6:9'],
    ['Tudo o que fizerem, façam de todo o coração, como para o Senhor.','Colossenses 3:23'],
    ['O que vale a pena fazer, faça com todas as suas forças.','Eclesiastes 9:10'],
    ['Os planos do diligente conduzem à fartura.','Provérbios 21:5'],
    ['Uma jornada de mil quilômetros começa com um único passo.','Lao-Tsé'],
    ['Não importa o quão devagar você vá, desde que não pare.','Atribuída a Confúcio'],
    ['Os limites da minha linguagem são os limites do meu mundo.','Ludwig Wittgenstein'],
    ['Não é porque as coisas são difíceis que não ousamos; é porque não ousamos que elas são difíceis.','Sêneca'],
    ['Primeiro diga a si mesmo o que você quer ser; depois faça o que precisa fazer.','Epicteto'],
    ['A excelência é um hábito, não um ato isolado.','Inspirada em Aristóteles']
  ];
  var STY={i:Math.floor(Math.random()*FRASES.length),cor:0,quiz:null};
  /* maratona de 10 meses (300 dias), contando a partir do primeiro dia em que a pessoa usou o app */
  var MESES=10,TOTAL=MESES*30;
  function jornada(){
    var ds=(ST.dias||[]).slice().sort(),ini=ds[0]?new Date(ds[0]+'T12:00:00'):new Date(),hoje=new Date();hoje.setHours(12,0,0,0);
    var d=Math.max(1,Math.min(TOTAL,Math.round((hoje-ini)/864e5)+1));
    return {dia:d,total:TOTAL,meses:MESES,mes:Math.min(MESES,Math.ceil(d/30)),pct:Math.max(1,Math.round(d*100/TOTAL))};
  }
  function tarefasHoje(){
    var out=[],ch=window._ctxChecked||{};
    Object.keys(ch).forEach(function(k){(ch[k]||[]).forEach(function(v,i){var t=v&&window.CTX_TASKS&&CTX_TASKS[k]&&CTX_TASKS[k][i];if(t&&out.indexOf(t.title)<0)out.push(t.title);});});
    return out;
  }
  function carregarImg(src){return new Promise(function(ok){var i=new Image();i.onload=function(){ok(i);};i.onerror=function(){ok(null);};i.src=src;});}
  function quebrar(ctx,txt,larg){var p=String(txt).split(' '),l=[],a='';p.forEach(function(w){var t=a?a+' '+w:w;if(ctx.measureText(t).width>larg&&a){l.push(a);a=w;}else a=t;});if(a)l.push(a);return l;}
  function rr(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
  async function desenharStory(){
    var W=1080,H=1920,cv=document.createElement('canvas');cv.width=W;cv.height=H;var c=cv.getContext('2d');
    try{await Promise.all([document.fonts.load('700 120px Advercase'),document.fonts.load('800 40px "Plus Jakarta Sans"'),document.fonts.load('500 40px "Plus Jakarta Sans"')]);}catch(e){}
    var cores=['azul','verde','roxo','ciano','ambar','rosa'],bg=await carregarImg('img/capas/base-'+cores[STY.cor%6]+'.webp');
    var TR=!!STY.transp;
    if(TR){c.shadowColor='rgba(0,0,0,.55)';c.shadowBlur=18;c.shadowOffsetY=3;}
    else if(bg){var s=Math.max(W/bg.width,H/bg.height),bw=bg.width*s,bh=bg.height*s;c.drawImage(bg,(W-bw)/2,(H-bh)/2,bw,bh);}else{var g0=c.createLinearGradient(0,0,W,H);g0.addColorStop(0,'#1b2a6b');g0.addColorStop(1,'#4f2ab0');c.fillStyle=g0;c.fillRect(0,0,W,H);}
    if(!TR){var g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'rgba(8,10,28,.55)');g.addColorStop(.45,'rgba(8,10,28,.35)');g.addColorStop(1,'rgba(8,10,28,.85)');c.fillStyle=g;c.fillRect(0,0,W,H);}
    var CX=TR?'rgba(0,0,0,.38)':'rgba(255,255,255,.13)';
    var F='"Plus Jakarta Sans",system-ui,sans-serif',T="Advercase,'Archivo Black','Arial Black',sans-serif",X=90,L=W-180,y=170;
    c.fillStyle='rgba(255,255,255,.75)';c.font='800 30px '+F;c.textBaseline='alphabetic';
    var lg=await carregarImg('img/logo-mi.svg');if(lg){c.save();c.shadowBlur=0;c.globalAlpha=.92;c.drawImage(lg,X-6,y-40,52,52);c.restore();}
    c.fillText('MÉTODO INTELIGENTE  ·  @ENGLISHBYGEDIEL',X+(lg?56:0),y);
    var seq=sequencia(),jd=jornada();
    y+=150;c.fillStyle='#fff';c.font='700 130px '+T;c.fillText('MÊS '+jd.mes+'/'+jd.meses,X,y);
    y+=50;rr(c,X,y,L,34,17);c.fillStyle=TR?'rgba(0,0,0,.4)':'rgba(255,255,255,.18)';c.fill();
    var sh=c.shadowBlur;c.shadowBlur=0;rr(c,X,y,Math.max(34,L*jd.pct/100),34,17);var gb=c.createLinearGradient(X,0,X+L,0);gb.addColorStop(0,'#7ee2a8');gb.addColorStop(1,'#ffd166');c.fillStyle=gb;c.fill();c.shadowBlur=sh;
    y+=84;c.font='800 38px '+F;c.fillStyle='#fff';c.fillText('Dia '+jd.dia+' de '+jd.total+' da maratona · '+jd.pct+'%',X,y);
    y+=60;c.fillStyle='#ffd166';c.fillText('🔥 '+seq.n+(seq.n===1?' dia seguido':' dias seguidos')+' de inglês',X,y);
    // quiz
    if(STY.quiz){
      y+=60;rr(c,X,y,L,190,36);c.fillStyle=CX;c.fill();
      c.fillStyle='#fff';c.font='700 76px '+T;c.fillText('🏆 '+STY.quiz.sc+'/'+STY.quiz.tot,X+40,y+95);
      c.font='600 34px '+F;c.fillStyle='rgba(255,255,255,.85)';var tq=quebrar(c,'no quiz: '+STY.quiz.t,L-80);c.fillText(tq[0]+(tq.length>1?'…':''),X+40,y+150);
      y+=190;
    }
    // tarefas
    var tf=tarefasHoje();
    y+=90;c.fillStyle='#fff';c.font='800 40px '+F;c.fillText('TODAY I PRACTICED ENGLISH ✓',X,y);
    y+=20;var lst=tf.length?tf.slice(0,5):['Abri o app e mantive a sequência 💪'];
    c.font='600 36px '+F;
    lst.forEach(function(t){var ls=quebrar(c,t,L-90).slice(0,2);var h=30+ls.length*46;y+=18;rr(c,X,y,L,h+10,26);c.fillStyle=CX;c.fill();
      c.fillStyle='#7ee2a8';c.font='800 38px '+F;c.fillText('✓',X+30,y+56);c.fillStyle='#fff';c.font='600 36px '+F;ls.forEach(function(l,i){c.fillText(l,X+84,y+56+i*46);});y+=h+10;});
    if(tf.length>5){y+=50;c.fillStyle='rgba(255,255,255,.7)';c.font='600 32px '+F;c.fillText('+ '+(tf.length-5)+' tarefas',X,y);}
    // frase
    var fr=FRASES[STY.i%FRASES.length],fy=Math.max(y+80,H-560);
    c.font='italic 600 46px '+F;var lf=quebrar(c,'“'+fr[0]+'”',L).slice(0,5);
    c.fillStyle='#fff';lf.forEach(function(l,i){c.fillText(l,X,fy+i*62);});
    c.font='800 30px '+F;c.fillStyle='#a5b4fc';c.fillText('— '+fr[1].toUpperCase(),X,fy+lf.length*62+20);
    // rodapé
    if(TR){c.fillStyle='#fff';}else{rr(c,X,H-200,L,110,55);c.fillStyle='#fff';c.fill();c.fillStyle='#1b1f4b';}c.font='800 36px '+F;c.textAlign='center';
    c.fillText('Bora comigo? englishbygediel.netlify.app',W/2,H-133);c.textAlign='left';
    return cv;
  }
  var stEl=document.createElement('div');stEl.id='mi-story';stEl.className='modal-overlay';document.body.appendChild(stEl);
  var stc=document.createElement('style');stc.textContent='#mi-story{z-index:9400}#mi-story:not(.open){display:none!important}#mi-story .sb{background:var(--surface);border-radius:22px;padding:14px 16px 16px;width:min(420px,calc(100vw - 32px));max-height:calc(100dvh - 32px);overflow-y:auto;display:flex;flex-direction:column;gap:12px;box-shadow:0 24px 60px rgba(0,0,0,.45)}#mi-story .hd{display:flex;align-items:center;justify-content:space-between;font-weight:800;font-size:15px}#mi-story .hd button{width:36px;height:36px;padding:0;border-radius:50%;background:var(--bg2,rgba(127,127,127,.12));color:var(--fg)}#mi-story .rd{display:grid;grid-template-columns:1fr 1fr;gap:8px}#mi-story .rd button{display:flex;align-items:center;justify-content:center;gap:8px;color:#fff;padding:14px 8px;font-size:14px}#mi-story .ig{background:linear-gradient(45deg,#f9a825,#e1306c 45%,#833ab4)}#mi-story .wa{background:#25d366}#mi-story .ic4{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}#mi-story .ic4 button{display:flex;flex-direction:column;align-items:center;gap:3px;padding:10px 4px;font-size:11px;font-weight:700}#mi-story .ic4 b{font-size:20px;line-height:1}#mi-story img{width:100%;max-height:52dvh;object-fit:contain;border-radius:14px;background:#0b0d1c}#mi-story img.tr{background:repeating-conic-gradient(#9aa0b4 0 25%,#d7dbe6 0 50%) 0 0/24px 24px}#mi-story .bt{display:grid;grid-template-columns:1fr 1fr;gap:8px}#mi-story button{border:none;border-radius:14px;padding:13px;font:inherit;font-size:14px;font-weight:800;cursor:pointer}#mi-story .p{background:linear-gradient(135deg,#4f6ef7,#8b5cf6);color:#fff;grid-column:1/-1}#mi-story .g{background:var(--bg2,rgba(127,127,127,.12));color:var(--fg)}#mi-story .t{font-size:13px;color:var(--fg2);text-align:center;line-height:1.5}';document.head.appendChild(stc);
  var stBlob=null;
  async function pintarStory(){
    stEl.innerHTML='<div class="sb"><div class="t">Gerando sua imagem…</div></div>';stEl.classList.add('open');
    var cv=await desenharStory();
    stBlob=await new Promise(function(ok){cv.toBlob(ok,'image/png');});
    var url=URL.createObjectURL(stBlob);
    stEl.innerHTML='<div class="sb"><div class="hd"><span>Sua conquista de hoje</span><button data-st="fechar" aria-label="Fechar">✕</button></div><img alt="Sua conquista de hoje" class="'+(STY.transp?'tr':'')+'" src="'+url+'"><div class="t">'+(STY.transp?'PNG sem fundo: tira a foto no story do Instagram e cola essa imagem por cima 📸':'Posta no status do WhatsApp ou no story do Instagram e marca <b>@englishbygediel</b> 🔥')+'</div>'
      +'<div class="rd"><button class="ig" data-st="ig">'+IC('ig-real')+'Story no Instagram</button><button class="wa" data-st="wa">'+IC('wa-real')+'Status do WhatsApp</button></div>'
      +'<div class="ic4"><button class="g" data-st="frase"><b>🎲</b>Outra frase</button><button class="g" data-st="cor"><b>🎨</b>'+(STY.transp?'Com fundo':'Outra cor')+'</button><button class="g" data-st="transp"><b>'+(STY.transp?'🖼️':'🫥')+'</b>'+(STY.transp?'Trocar cor':'Sem fundo')+'</button><button class="g" data-st="baixar"><b>⬇️</b>Baixar</button></div></div>';
  }
  stEl.addEventListener('click',async function(e){
    if(e.target===stEl){stEl.classList.remove('open');stEl.innerHTML='';return;}
    var b=e.target.closest('[data-st]');if(!b)return;var a=b.dataset.st;
    if(a==='fechar'){stEl.classList.remove('open');stEl.innerHTML='';return;}
    if(a==='frase'){STY.i++;return pintarStory();}
    if(a==='cor'){if(STY.transp)STY.transp=false;else STY.cor++;return pintarStory();}
    if(a==='transp'){if(STY.transp){STY.transp=false;STY.cor++;}else STY.transp=true;return pintarStory();}
    var f=new File([stBlob],'minha-conquista-ingles.png',{type:'image/png'});
    var social=a==='ig'||a==='wa';
    if(social&&navigator.canShare&&navigator.canShare({files:[f]})){
      toast(a==='ig'?'Escolha Instagram → Story 📸':'Escolha WhatsApp → Meu status 💬',a==='ig'?'#e1306c':'#25d366');
      try{await navigator.share(a==='wa'?{files:[f],text:'Hoje eu treinei meu inglês 🔥'}:{files:[f]});return;}catch(err){if(err&&err.name==='AbortError')return;}
    }
    var u=URL.createObjectURL(stBlob),l=document.createElement('a');l.href=u;l.download='minha-conquista-ingles.png';document.body.appendChild(l);l.click();l.remove();
    toast(social?'Imagem baixada. Pra postar direto, abra a plataforma no celular 📲':'Imagem baixada ✅');
  });
  function compartilharConquista(sc,tot){STY.quiz=sc!=null?{sc:sc,tot:tot,t:(window._stCurLes&&_stCurLes.title)||'aula'}:null;STY.i++;pintarStory();}
  /* ───────────────────────── FESTA: checklist do dia concluído ───────────────────────── */
  var IRONIA={
    'Primeiros passos':['Primeiro dia de academia também dói. Mas você voltou, né?','Ontem você não sabia. Hoje você já reconhece. Isso tem nome: progresso.','Começar do zero é melhor do que nunca começar. E você começou.'],
    'Em Casa':['Em casa, de pijama, e mesmo assim mais produtivo que muita reunião por aí.','O sofá tentou te segurar. Perdeu.'],
    'Acabei de acordar':['Nem tomou café e já falou mais inglês que muita gente na semana inteira.','O despertador tocou e o inglês atendeu. Lenda.'],
    'Vou pro banho':['O chuveiro agora é bilíngue. Os vizinhos que lutem.','Saiu do banho mais limpo e mais fluente. Combo raro.'],
    'Prestes a dormir':['Vai sonhar em inglês hoje. Se aparecer legenda, é normal.','Dormir cedo? Não. Dormir fluente.'],
    'No carro':['Trânsito parado, inglês andando. Quem diria.','Seu carro agora tem GPS da fluência. Recalculando rota: sucesso.'],
    'No Transporte':['Enquanto uns rolavam o feed, você rolou o vocabulário.','Ônibus lotado, cabeça vazia? Não a sua.'],
    'No Trabalho':['Trabalhou e ainda estudou. O RH precisa saber disso.','Produtividade nível: chefe vai pedir pra você dar treinamento.'],
    'Intervalo do almoço':['Almoço com sobremesa de inglês. Nutricionista aprovaria.','Comeu, estudou e ainda sobrou tempo pro cafezinho. Gestão de tempo de CEO.'],
    'Lavando a louça':['A louça tá limpa e o inglês tá brilhando. Detergente bilíngue.','Quem lava louça falando inglês merece um aumento de mesada.'],
    'Limpando a casa':['Casa limpa, mente afiada. A vassoura agora fala "sweep".','Faxina concluída com trilha sonora internacional. Marie Kondo ficaria orgulhosa.'],
    'Cozinhando':['Masterchef bilíngue. Hoje o tempero foi o vocabulário.','Queimou o arroz? Tudo bem. O inglês saiu no ponto.'],
    'Caminhando':['Passos contados: muitos. Palavras novas: também.','Caminhou pra frente na vida e no inglês. Literalmente.'],
    'Na Academia':['Treino de perna e de pronúncia. Ninguém pula esse dia.','Hipertrofia de vocabulário confirmada.'],
    'Na fila':['A fila andou devagar, você não.','Transformou o tempo mais inútil do dia em aula. Gênio.'],
    'No sofá':['Do sofá pro sucesso sem levantar. Isso é eficiência.','Netflix chorou de ciúmes, mas você escolheu crescer.'],
    'Só 5 minutos':['5 minutos que valeram por 50. Quem disse que não dava?','Pouco tempo, zero desculpa. Respeita.'],
    'Focado pra estudar':['Modo foco ativado e missão cumprida. Que disciplina.','Hoje você estudou como quem tem prova amanhã. Só que é pra vida.'],
    'Viajando':['Turista? Não. Treinando pra ser local.','Mala pronta, inglês também.'],
    'No mercado':['Fez compras e ainda levou vocabulário de brinde.','O carrinho ficou cheio e a cabeça também.'],
    'Na igreja':['Fé e fluência na mesma oração. Amém em dois idiomas.','Deus abençoou e você praticou. Parceria perfeita.'],
    'Com a família':['Agora a família toda sabe dizer "good night". Missionário do inglês.','Ensinou em casa e aprendeu em dobro. Professor nato.']
  };
  var GERAL=['Checklist zerado. Desculpas também.','Hoje você foi a pessoa que você disse que ia ser.','Mais um dia na conta. Constância é o novo talento.'];
  var feEl=document.createElement('div');feEl.id='mi-festa';document.body.appendChild(feEl);
  var fec=document.createElement('style');fec.textContent=[
    '#mi-festa{position:fixed;inset:0;z-index:9300;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(8,10,28,.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}#mi-festa.on{display:flex}',
    '#mi-festa .fb{position:relative;z-index:2;width:min(420px,100%);background:linear-gradient(160deg,#4f6ef7,#8b5cf6 60%,#ec4899);color:#fff;border-radius:28px;padding:30px 24px 22px;text-align:center;box-shadow:0 30px 80px rgba(0,0,0,.45);animation:feIn .6s cubic-bezier(.2,1.4,.4,1) both}',
    '@keyframes feIn{from{opacity:0;transform:scale(.6) rotate(-6deg)}to{opacity:1;transform:none}}',
    '#mi-festa .tr{font-size:76px;line-height:1;animation:feTr 1.2s ease-in-out infinite alternate}@keyframes feTr{from{transform:translateY(0) rotate(-8deg)}to{transform:translateY(-10px) rotate(8deg)}}',
    '#mi-festa h3{font-family:Advercase,"Archivo Black",sans-serif;font-weight:700;font-size:34px;letter-spacing:.5px;margin:14px 0 4px;text-transform:uppercase}',
    '#mi-festa .sb{font-size:14px;opacity:.85;margin-bottom:14px}#mi-festa .fr{font-size:17px;font-weight:700;line-height:1.45;background:rgba(255,255,255,.15);border-radius:18px;padding:14px 16px;margin-bottom:16px}',
    '#mi-festa button{width:100%;border:none;border-radius:16px;padding:15px;font:inherit;font-size:15px;font-weight:800;cursor:pointer;margin-top:8px}#mi-festa .p{background:#fff;color:#4f2ab0}#mi-festa .g{background:rgba(255,255,255,.18);color:#fff}',
    '#mi-festa i.cf{position:absolute;top:-20px;width:10px;height:16px;border-radius:3px;z-index:1;animation:feCai linear forwards}@keyframes feCai{to{transform:translateY(110vh) rotate(720deg)}}'
  ].join('');document.head.appendChild(fec);
  function festa(k){
    var c=CTX.filter(function(x){return x.k===k;})[0]||{ic:'✅',lb:k},lista=(IRONIA[k]||[]).concat(GERAL);
    var pr=(IRONIA[k]&&Math.random()<.8)?IRONIA[k]:lista,fr=pr[Math.floor(Math.random()*pr.length)],seq=sequencia();
    var cores=['#ffd166','#7ee2a8','#7dd3fc','#f472b6','#a78bfa','#fff'],conf='';
    for(var i=0;i<70;i++)conf+='<i class="cf" style="left:'+(Math.random()*100)+'vw;background:'+cores[i%6]+';animation-duration:'+(2.2+Math.random()*2.2)+'s;animation-delay:'+(Math.random()*.8)+'s;transform:rotate('+(Math.random()*360)+'deg)"></i>';
    feEl.innerHTML=conf+'<div class="fb"><span class="mi-logo mi-lg-festa" aria-hidden="true"></span><div class="tr">'+IC('trofeu','fe')+'</div><h3>Checklist concluído!</h3><div class="sb">'+icCtx(c)+' '+E(c.lb)+' · 🔥 '+seq.n+(seq.n===1?' dia seguido':' dias seguidos')+'</div>'
      +'<div class="fr">'+E(fr)+'</div><button class="p" data-fe="share">📤 Compartilhar meu dia</button><button class="g" data-fe="fechar">Fechar</button></div>';
    feEl.classList.add('on');
    try{if(navigator.vibrate)navigator.vibrate([60,40,120]);}catch(e){}
  }
  feEl.addEventListener('click',function(e){
    var b=e.target.closest('[data-fe]');if(!b&&e.target!==feEl)return;
    feEl.classList.remove('on');feEl.innerHTML='';
    if(b&&b.dataset.fe==='share')compartilharConquista(null);
  });
  function verCompleto(k){
    var ks=k?[k]:Object.keys(window._ctxChecked||{});
    for(var i=0;i<ks.length;i++){var pc=progCtx(ks[i]),flag='mi_festa_'+dia()+'_'+ks[i];
      if(pc.tot&&pc.feitos===pc.tot&&!LS.get(flag,false)){LS.set(flag,true);setTimeout(function(kk){return function(){festa(kk);};}(ks[i]),450);return;}}
  }

  /* ───────────────────────── LIVES: sub-aba "Aulas ao vivo" ─────────────────────────
     Toda aula do Programa que ainda não tem vídeo vai ser gravada ao vivo. Aparece aqui sem data;
     o aluno pode pedir pra ser avisado (usa os votos "esperando" de cada aula). */
  var LV_ABA='semana';
  function montarAbasLives(){
    var p=$('pane-lives');if(!p||$('lv-abas'))return;
    var cont=$('live-cards-container');
    var ab=document.createElement('div');ab.id='lv-abas';ab.className='lv-abas';
    ab.innerHTML='<button data-lv="semana" class="on">'+IC('lives')+' Lives da semana</button><button data-lv="aulas">'+IC('culture')+' Aulas ao vivo</button>';
    cont.parentNode.insertBefore(ab,cont);
    var box=document.createElement('div');box.id='lv-aulas';box.hidden=true;cont.parentNode.insertBefore(box,cont.nextSibling);
    ab.addEventListener('click',function(e){var b=e.target.closest('[data-lv]');if(!b)return;LV_ABA=b.dataset.lv;
      [].forEach.call(ab.children,function(x){x.classList.toggle('on',x===b);});
      cont.hidden=LV_ABA!=='semana';box.hidden=LV_ABA!=='aulas';if(LV_ABA==='aulas')pintarAulasAoVivo();});
  }
  async function pintarAulasAoVivo(){
    var box=$('lv-aulas');if(!box)return;box.innerHTML='<div class="admin-loading">Carregando…</div>';
    var fl=await carregarFlat(true);
    var futuras=fl.filter(function(x){return !x.l.youtube_url;});
    var ids=futuras.map(function(x){return x.l.id;}),meus={},tot={};
    if(ids.length){try{var v=await window._sb.from('mi_lesson_votes').select('lesson_id,user_id').in('lesson_id',ids);(v.data||[]).forEach(function(r){tot[r.lesson_id]=(tot[r.lesson_id]||0)+1;if(U&&r.user_id===U.id)meus[r.lesson_id]=1;});}catch(e){}}
    var h='<div class="lv-intro">'+IC('lives','xl')+'<div><b>Todas as aulas novas são gravadas ao vivo</b><span>Você pode assistir na hora, comentar e tirar dúvida com o Gediel. Depois a gravação fica na aula. Toque em 🔔 pra ser avisado quando cada uma for ao ar.</span></div></div>';
    if(!futuras.length)h+='<div class="admin-loading">Todas as aulas já estão gravadas 🎉</div>';
    var ult=null;
    futuras.forEach(function(x,i){
      if(x.m.id!==ult){if(ult)h+='</div>';ult=x.m.id;h+='<div class="lv-mod">'+E((x.m.emoji?x.m.emoji+' ':'')+x.m.name)+'</div><div class="lv-lista">';}
      var on=!!meus[x.l.id],n=tot[x.l.id]||0;
      h+='<div class="lv-aula"><div class="lv-n">'+x.n+'</div><div class="lv-tx"><b>'+E(x.l.title)+'</b><span>🔴 Ao vivo · data a definir'+(n?' · '+n+(n===1?' pessoa esperando':' pessoas esperando'):'')+'</span></div>'
        +'<button class="lv-bt'+(on?' on':'')+'" data-lvv="'+x.l.id+'">'+(on?'✓ Vou ser avisado':'🔔 Me avise')+'</button></div>';
    });
    if(ult)h+='</div>';
    box.innerHTML=h;
  }
  document.addEventListener('click',async function(e){
    var b=e.target.closest('[data-lvv]');if(!b||!U)return;var id=b.dataset.lvv;b.disabled=true;
    if(b.classList.contains('on')){await window._sb.from('mi_lesson_votes').delete().eq('lesson_id',id).eq('user_id',U.id);}
    else{var r=await window._sb.from('mi_lesson_votes').insert({lesson_id:id,user_id:U.id});if(r.error){toast('Não deu: '+r.error.message,'#ef4444');b.disabled=false;return;}toast('🔔 Anotado! Te aviso quando for ao vivo','#10b981');}
    pintarAulasAoVivo();
  });

  /* ───────────────────────── BOTÃO VOLTAR em toda tela (menos o Início) ───────────────────────── */
  (function(){
    var hist=[];
    var st=document.createElement('style');st.textContent='#mi-voltar{display:none;align-items:center;gap:6px;border:0;background:var(--accent,#4f6ef7);color:#fff;font:inherit;font-weight:800;font-size:13px;border-radius:99px;padding:7px 14px 7px 10px;cursor:pointer;margin-right:12px;flex:none;box-shadow:0 4px 12px rgba(79,110,247,.35);transition:transform .2s,box-shadow .2s}#mi-voltar.on{display:inline-flex}#mi-voltar:hover{transform:scale(1.06);box-shadow:0 8px 18px rgba(79,110,247,.45)}#mi-voltar:active{transform:scale(.95)}#mi-volta-uni{display:none!important}';
    document.head.appendChild(st);
    var tb=document.querySelector('.topbar'),tt=document.getElementById('topbar-title');
    var bt=document.createElement('button');bt.id='mi-voltar';bt.type='button';bt.setAttribute('aria-label','Voltar');bt.innerHTML='<span style="font-size:17px;line-height:1">‹</span> Voltar';
    if(tb&&tt)tb.insertBefore(bt,tt);
    function vis(id){var e=document.getElementById(id);return !!e&&e.style.display==='block';}
    function atualizar(){var p=window.currentPage||'home';bt.classList.toggle('on',p!=='home');}
    var g0=window.goTo;
    window.goTo=function(page,el){
      var ant=window.currentPage||'home';
      var r=g0.apply(this,arguments);
      if(page!==ant&&!window.__voltando){hist.push({p:ant,el:null});if(hist.length>30)hist.shift();}
      setTimeout(atualizar,0);return r;
    };
    bt.onclick=function(){
      if((window.currentPage||'')==='modulos'){
        if(vis('mod-view-lesson')&&window._stCurMod&&window.openModule){openModule(_stCurMod.id);return;}
        if(vis('mod-view-lessons')&&window.modShow){modShow('grid');return;}
      }
      var h=hist.pop();while(h&&h.p===window.currentPage)h=hist.pop();
      var dest=h?h.p:'home';
      var pill=[].filter.call(document.querySelectorAll('.nav-pill'),function(n){return (n.getAttribute('onclick')||'').indexOf("'"+dest+"'")>=0;})[0]||document.querySelector('.nav-pill');
      window.__voltando=1;try{window.goTo(dest,pill);}finally{window.__voltando=0;}
      atualizar();
    };
    document.addEventListener('click',function(){setTimeout(atualizar,60);},true);
    atualizar();
  })();
  document.addEventListener('click',function(e){var b=e.target.closest('.lv-abas button,.mat-tab,.mi-dock button,.th-nav button');if(b&&b.scrollIntoView)try{b.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'});}catch(x){}});
  (function(){var b=document.createElement('button');b.id='rail-tg';b.type='button';b.setAttribute('aria-label','Minimizar ou abrir a barra lateral direita');document.body.appendChild(b);
    var pr=function(){var off=document.body.classList.contains('rail-off');b.textContent=off?'‹':'›';b.title=off?'Abrir a barra':'Minimizar a barra';};
    try{if(localStorage.getItem('mi_rail_off')==='1')document.body.classList.add('rail-off');}catch(e){}pr();
    b.addEventListener('click',function(){document.body.classList.toggle('rail-off');try{localStorage.setItem('mi_rail_off',document.body.classList.contains('rail-off')?'1':'0');}catch(e){}pr();});})();
  setTimeout(montarAbasLives,0);
  window.MI_APP={conhecer:conhecer,tour:tour,aulaAberta:aulaAberta,marcarDia:marcarDia,abrirAula:abrirAula,renderHome:renderHome,
    compartilharQuiz:compartilharConquista,compartilharDia:function(){compartilharConquista(null);},festa:festa};
})();
