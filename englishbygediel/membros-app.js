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
  var IC_BASE='home maratona lives modulos jogos materiais prompts agendar check fogo eom culture viagens bussola prisma youtube instagram indicar sino suporte'.split(' ');
  function IC(n,cls){if(!n)return '';return '<img class="ic3d'+(cls?' '+cls:'')+'" src="img/icons/'+n+'.'+(IC_BASE.indexOf(n)>=0?'webp':'svg')+'" alt="" draggable="false">';}
  window.IC=IC;
  var IC_MENU={home:'home',maratona:'maratona',lives:'lives',modulos:'modulos',jogos:'jogos',materiais:'materiais',prompts:'prompts',agendar:'agendar',eom:'eom',culture:'culture',viagens:'viagens',bussola:'bussola',prisma:'prisma',admin:'admin'};
  var IC_CTX={'Em Casa':'home','Acabei de acordar':'ctx-acordar','Vou pro banho':'ctx-banho','Prestes a dormir':'ctx-dormir','No carro':'ctx-carro','No Transporte':'ctx-transporte','No Trabalho':'ctx-trabalho','Intervalo do almoço':'ctx-almoco','Lavando a louça':'ctx-louca','Limpando a casa':'ctx-limpeza','Cozinhando':'ctx-cozinha','Caminhando':'ctx-caminhada','Na Academia':'ctx-academia','Na fila':'ctx-fila','No sofá':'ctx-sofa','Só 5 minutos':'ctx-5min','Focado pra estudar':'ctx-foco','Viajando':'viagens','No mercado':'ctx-mercado','Na igreja':'ctx-igreja','Com a família':'ctx-familia'};
  function icCtx(c,cls){return IC_CTX[c.k]?IC(IC_CTX[c.k],cls):c.ic;}
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
    jogo:{why:'Jogar fixa vocabulário sem parecer estudo. Perfeito pra quando a energia está baixa.',
      steps:['Abra o menu Jogos','Escolha 1 jogo do seu nível','Jogue 1 rodada inteira'],
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
  '.uni-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:14px}',
  '.uni-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;overflow:hidden;cursor:pointer;display:flex;flex-direction:column;transition:transform .15s,border-color .15s;box-shadow:var(--shadow)}',
  '.uni-card:hover{transform:translateY(-3px);border-color:var(--accent)}',
  '.uni-card .th{aspect-ratio:16/9;background:var(--surface2);position:relative;display:flex;align-items:center;justify-content:center;font-size:38px;overflow:hidden}',
  '.uni-card .th img{width:100%;height:100%;object-fit:cover;display:block}',
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
  '#pane-home{position:relative}#pane-home>.mi-lg-marca{position:absolute;top:-6px;right:4px;font-size:118px;color:var(--fg);opacity:.06!important;animation:none!important;pointer-events:none;transform:rotate(-12deg);z-index:0}',
  '.mi-lg-rail{display:flex;align-items:center;justify-content:center;gap:7px;margin-top:22px;font-size:11px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;color:var(--fg3);opacity:.55}.mi-lg-rail .mi-logo{font-size:16px}',
  '.mi-lg-festa{position:absolute;right:-26px;bottom:-30px;font-size:150px;color:#fff;opacity:.09;pointer-events:none}#mi-festa .fb{overflow:hidden}',
  '@media(max-width:680px){.mi-lg-badge{font-size:20px}#pane-home>.mi-lg-marca{font-size:84px;right:-6px;top:-4px}}',
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
  '#mi-onb .teste .ic .ic3d{width:48px;height:48px}.mi-gate-it>span .ic3d{width:34px;height:34px}.ag-btn .ic3d,.ag-btn2 .ic3d,.set-btn .ic3d{width:22px;height:22px;vertical-align:-5px}',
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
  '}'
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
    var um=m.ultima,ul=l.ultima;ST.ultima=(um&&ul)?((um.ts||0)>=(ul.ts||0)?um:ul):(um||ul||null);
    ST.bv=!!(m.bv||l.bv);
    ST.tour=uni(m.tour,l.tour);
    var lvLocal=null;try{lvLocal=localStorage.getItem('userLevel');}catch(e){}
    ST.nivel=m.nivel||l.nivel||lvLocal||null;
    ST.prisma=m.prisma||l.prisma||null;
    ST.onb=m.onb||l.onb||null;
  }
  function salvar(){
    LS.set(chave(),ST);
    clearTimeout(salvarT);
    salvarT=setTimeout(function(){
      if(!U)return;
      window._sb.auth.updateUser({data:{mi:{dias:ST.dias.slice(-150),vistas:ST.vistas.slice(-400),ultima:ST.ultima,bv:ST.bv,tour:ST.tour,nivel:ST.nivel,prisma:ST.prisma,onb:ST.onb}}}).catch(function(){});
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
  function salvarChecks(){LS.set(chkKey(),window._ctxChecked||{});}
  function restaurarChecks(){var c=LS.get(chkKey(),{});Object.keys(c).forEach(function(k){window._ctxChecked[k]=c[k];});}
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
      +'<button class="hm-big hm-live'+(lv&&lv.aoVivo?'':' off')+'" data-hm="lives" aria-label="Lives">'+(lv&&lv.aoVivo?'<span class="dot">● AO VIVO</span>':'')+'<div class="ic">'+IC('lives')+'</div><div class="lb">Lives</div><div class="pg">'+(lv?E(lv.lv.title)+'<br>'+E(quando(lv)):'Ver agenda')+'</div></button>'
      +'</div>';
    h+='<div class="sec-hd">Sua aula</div><div class="hm-aula" id="hm-aula"><div class="cv"><div class="lock">Carregando…</div></div><div class="bd"><div class="st">&nbsp;</div></div></div>';
    h+='<div class="hm-quick">'
      +'<button data-hm="duvida"><span>'+IC('suporte')+'</span>Dúvida</button>'
      +'<button data-hm="jogos"><span>'+IC('jogos')+'</span>Jogos</button>'
      +'<button data-hm="prompts"><span>'+IC('prompts')+'</span>Prompts</button>'
      +'<button data-hm="video"><span>'+IC('youtube')+'</span>Como usar</button>'
      +'</div>';
    h+='<div class="sec-hd">Universos</div><div class="hm-unis">'
      +'<button class="hm-uni" style="background:linear-gradient(135deg,#15281f,#2f6b4f)" data-hm="eom"><span>'+IC('eom')+'</span><b>English On Mission</b></button>'
      +'<button class="hm-uni" style="background:linear-gradient(135deg,#1b2a6b,#4f6ef7)" data-hm="culture"><span>'+IC('culture')+'</span><b>Culture English</b></button>'
      +'<button class="hm-uni" style="background:linear-gradient(135deg,#0c4a6e,#0ea5e9)" data-hm="viagens"><span>'+IC('viagens')+'</span><b>Viagens</b></button>'
      +'</div>';
    h+='<div class="hm-ref"><div>'+IC('indicar','xl')+'</div><div><div class="t">Conhece alguém que trava no inglês?</div><div class="s">Manda o convite: a pessoa faz o teste de nível grátis e descobre por onde começar. Leva 10 segundos.</div></div>'
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
  function linkIndicacao(){return SITE+'?ir=teste'+(nomeCurto()?'&ref='+encodeURIComponent(nomeCurto().toLowerCase()):'');}
  function msgIndicacao(){return 'Tô estudando inglês com o Gediel no Método Inteligente e tá fazendo diferença 🙌 Faz o teste de nível grátis e vê por onde você começaria: '+linkIndicacao();}
  document.addEventListener('click',async function(e){
    var b=e.target.closest('[data-hm]');if(!b)return;
    var a=b.dataset.hm;
    if(a==='check'){go('maratona');var k=ctxAtual();if(k)setTimeout(function(){escolherCtxNaMaratona(k);},200);}
    else if(a==='lives')go('lives');
    else if(a==='modulos')go('modulos');
    else if(a==='abrir'){var it=FLAT&&FLAT[hmIdx];if(it)abrirAula(it.m.id,it.l.id);}
    else if(a==='ant'){if(hmIdx>0){hmIdx--;pintarAula();}}
    else if(a==='prox'){if(FLAT&&hmIdx<FLAT.length-1){hmIdx++;pintarAula();}}
    else if(a==='duvida'){if(window.aiToggle)aiToggle();}
    else if(a==='jogos'||a==='prompts'||a==='eom'||a==='culture'||a==='viagens')go(a);
    else if(a==='video')mostrarBoasVindas(true);
    else if(a==='indicar')wa(msgIndicacao(),false);
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
      +'<div><div class="rail-hd">Próximas lives</div>'+lv.map(function(x){
        return '<div class="upcoming-item" style="cursor:pointer" data-hm="lives"><div class="upc-date"><span class="day">'+x.st.getDate()+'</span>'+x.st.toLocaleDateString('pt-BR',{month:'short'}).replace('.','').toUpperCase()+'</div><div><div class="upc-title">'+E(x.lv.title)+(x.aoVivo?' <span style="color:#ef4444;font-weight:800">● AO VIVO</span>':'')+'</div><div class="upc-time">'+E(quando(x))+'</div></div></div>';}).join('')+'</div>'
      +'<div><div class="rail-hd">Atalhos</div><div style="display:flex;flex-direction:column;gap:7px">'
      +'<a href="https://www.youtube.com/@teachergediel" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:8px;background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.15);border-radius:11px;padding:9px 12px;text-decoration:none;font-size:12px;font-weight:700;color:#ef4444">'+IC('yt-real')+' Canal no YouTube</a>'
      +'<a href="https://instagram.com/englishbygediel" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:8px;background:rgba(139,92,246,.07);border:1px solid rgba(139,92,246,.18);border-radius:11px;padding:9px 12px;text-decoration:none;font-size:12px;font-weight:700;color:#8b5cf6">'+IC('ig-real')+' @englishbygediel</a>'
      +'<button data-hm="indicar" style="display:flex;align-items:center;gap:8px;background:rgba(37,211,102,.08);border:1px solid rgba(37,211,102,.25);border-radius:11px;padding:9px 12px;font-size:12px;font-weight:700;color:#16a34a;cursor:pointer;text-align:left">'+IC('indicar')+' Indicar um amigo</button>'
      +'</div><div class="mi-lg-rail"><span class="mi-logo"></span>Método Inteligente</div></div>';
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
  function perguntarContexto(){
    abrirEntrada('<span class="mi-logo mi-lg-ent"></span><div class="mi-ent-kicker">'+E(saudacao())+(nomeCurto()?', '+E(nomeCurto()):'')+'</div>'
      +'<div class="mi-ent-q">Onde você está agora?</div>'
      +'<div class="mi-ent-s">Escolha o mais parecido com onde você está ou o que está fazendo. Eu monto o checklist de hoje pra esse momento.</div>'
      +'<div class="mi-ctx">'+CTX.map(function(c,i){return '<button data-ent="ctx" data-k="'+E(c.k)+'" style="animation-delay:'+(0.08+i*0.07)+'s"><span class="ic">'+icCtx(c)+'</span><span class="lb">'+E(c.lb)+'</span><span class="ht">'+E(c.hint)+'</span></button>';}).join('')+'</div>'
      +'<button class="mi-ctx-skip" data-ent="ctx" data-k="">Só vim dar uma olhada</button>');
    ent.onclick=function(e){
      var b=e.target.closest('[data-ent="ctx"]');if(!b)return;
      var k=b.dataset.k;
      if(k){LS.set('mi_ctx',{d:dia(),k:k});escolherCtxNaMaratona(k);}
      fecharEntrada(function(){go('home');renderHome();pintarRail();setTimeout(tourAuto,700);if(k)toast('✅ Checklist pronto: '+(CTX.filter(function(x){return x.k===k;})[0].lb),'#10b981');});
    };
  }
  var entrou=false;
  function entrar(user){
    if(entrou||!user)return;entrou=true;
    carregarEstado(user);restaurarChecks();pintarPerfil();iniciarEdicao();
    pintarRail();renderHome();
    var seguir=function(){if(!ST.bv)mostrarBoasVindas(false);else perguntarContexto();};
    if(!ST.onb)setTimeout(function(){conhecer(seguir);},60);else seguir();
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
    CARDS=r.error?[]:(r.data||[]);CARDS._erro=r.error;
    return CARDS;
  }
  async function carregarModsAll(force){
    if(MODS_ALL&&!force)return MODS_ALL;
    var r=await window._sb.from('mi_modules').select('*').order('ord');MODS_ALL=r.data||[];return MODS_ALL;
  }
  function temProduto(trecho){
    var S=(window.EBG_ACESSO||{}).estado||{};trecho=(trecho||'').toLowerCase().trim();if(!trecho)return false;
    return (S.compras||[]).some(function(c){return (c.produto||'').toLowerCase().indexOf(trecho)>=0;})||String(S.meta||'').toLowerCase().indexOf(trecho)>=0;
  }
  function souAdmin(){var S=(window.EBG_ACESSO||{}).estado||{};return !!(window._isAdmin||S.admin);}
  function cardSoon(c){return c.em_breve||((c.acao==='link'||c.acao==='curso')&&!c.valor);}
  function cardLock(c){if(c.acao!=='curso'||!c.valor)return false;var m=(MODS_ALL||[]).filter(function(x){return x.id===c.valor;})[0];return !!(m&&!souAdmin()&&!temProduto(m.produto));}
  function acaoTxt(c){
    if(cardSoon(c))return 'Me avise quando sair ›';
    if(c.acao==='curso')return cardLock(c)?'Quero esse mini curso ›':'Abrir mini curso ›';
    if(c.acao==='area')return 'Abrir ›';
    if(c.acao==='whatsapp')return 'Chamar no WhatsApp ›';
    return /^R\$/.test(c.tag||'')?'Comprar ›':'Acessar ↗';
  }
  function cardHtml(c,i){
    var buy=/^R\$/.test(c.tag||'');
    return '<div class="uni-card'+(cardSoon(c)?' soon':'')+(buy?' buy':'')+(cardLock(c)?' lock':'')+(c.ativo===false?' mi-off':'')+'" data-unicard="'+c.id+'">'+edCtl('card',c.id)
      +'<div class="th">'+(c.capa_url?'<img loading="lazy" alt="" src="'+E(c.capa_url)+'">':(window.capaAuto?capaAuto(c.titulo,i):E(c.emoji||'✨')))+(c.tag?'<span class="tg">'+E(c.tag)+'</span>':'')+'</div>'
      +'<div class="bd"><div class="tt">'+E(c.titulo)+'</div><div class="ss">'+E(c.descricao||'')+'</div><div class="ac">'+acaoTxt(c)+'</div></div></div>';
  }
  async function desenharUni(k){
    var u=UNIV[k],p=$('pane-'+k);if(!u||!p)return;
    p.innerHTML='<div style="font-size:21px;font-weight:800;margin-bottom:4px">'+E(u.title)+'</div><div style="font-size:13px;color:var(--fg2);margin-bottom:18px">'+E(u.sub)+'</div><div class="admin-loading">Carregando…</div>';
    await Promise.all([carregarCards(),carregarModsAll()]);
    var lista=CARDS.filter(function(c){return c.universo===k&&(c.ativo!==false||EDIT);});
    var h='<div style="font-size:21px;font-weight:800;margin-bottom:4px">'+E(u.title)+'</div><div style="font-size:13px;color:var(--fg2);margin-bottom:18px">'+E(u.sub)+'</div>';
    if(CARDS._erro){p.innerHTML=h+'<div class="admin-loading">'+(souAdmin()?'Rode o arquivo COLE-NO-SUPABASE.sql no Supabase pra ativar os Universos.':'Em instantes tem conteúdo novo aqui 🙂')+'</div>';return;}
    lista.filter(function(c){return c.destaque;}).forEach(function(c){
      h+='<div class="uni-hero'+(c.ativo===false?' mi-off':'')+'" style="background:'+u.cor+';position:relative" data-unicard="'+c.id+'">'+edCtl('card',c.id)+(c.capa_url?'<img alt="" src="'+E(c.capa_url)+'">':'')+'<div><div class="ht">'+E(c.emoji?c.emoji+' ':'')+E(c.titulo)+'</div><div class="hs">'+E(c.descricao||'')+'</div></div><button>'+E(acaoTxt(c).replace(/ [›↗]$/,''))+'</button></div>';
    });
    var resto=lista.filter(function(c){return !c.destaque;}),secs=[],por={};
    resto.forEach(function(c){var s=c.secao||'';if(!por[s]){por[s]=[];secs.push(s);}por[s].push(c);});
    var n=0;secs.forEach(function(s){h+=(s?'<div class="uni-sec">'+E(s)+'</div>':'')+'<div class="uni-grid">'+por[s].map(function(c){return cardHtml(c,n++);}).join('')+(EDIT?'<button class="mi-novo" data-ed="card-novo" data-uni="'+k+'" data-sec="'+E(s)+'">＋ Novo card'+(s?' em '+E(s):'')+'</button>':'')+'</div>';});
    if(EDIT){h=h.replace('<div style="font-size:21px;font-weight:800;margin-bottom:4px">'+E(u.title)+'</div>','<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:4px"><div style="font-size:21px;font-weight:800">'+E(u.title)+'</div><button class="admin-btn admin-btn-ghost admin-btn-sm" data-ed="menu-ed" data-k="'+k+'">✏️ Nome, frase e acesso</button></div>');if(!secs.length)h+='<div class="uni-grid"><button class="mi-novo" data-ed="card-novo" data-uni="'+k+'">＋ Novo card</button></div>';}
    if(!lista.length&&!EDIT)h+='<div class="admin-loading">Nenhum card ainda.'+(souAdmin()?' Toque em ✏️ Editar, lá em cima, pra criar.':'')+'</div>';
    if(lista.some(function(c){return /indica/i.test(c.tag||'');}))h+='<div style="font-size:10.5px;color:var(--fg3);margin-top:16px">Indicação = link de afiliado. Você paga o mesmo preço e eu posso receber uma comissão.</div>';
    p.innerHTML=h;
  }
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
    if(c.acao==='area'){go(c.valor);return;}
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
    var pa=document.createElement('div');pa.className='nav-pill';pa.setAttribute('onclick',"goTo('agendar',this)");pa.innerHTML='<span class="nav-icon">📅</span><span>Marcar aula</span>';
    pp.insertAdjacentElement('afterend',pa);
    var pag=document.createElement('div');pag.className='pane';pag.id='pane-agendar';pr.insertAdjacentElement('afterend',pag);
    var sec=document.createElement('div');sec.className='nav-section';sec.textContent='Universos';
    perfil.insertAdjacentElement('beforebegin',sec);
    var ant=sec,antPane=pr;
    Object.keys(UNIV).forEach(function(k){
      var u=UNIV[k],p=document.createElement('div');p.className='nav-pill';p.setAttribute('onclick',"goTo('"+k+"',this)");
      p.innerHTML='<span class="nav-icon">'+u.icon+'</span><span>'+E(u.nav)+'</span>';ant.insertAdjacentElement('afterend',p);ant=p;
      var pane=document.createElement('div');pane.className='pane';pane.id='pane-'+k;antPane.insertAdjacentElement('afterend',pane);antPane=pane;
    });
    if(window.TITLES){TITLES.prompts='Prompts';TITLES.agendar='Marcar aula';Object.keys(UNIV).forEach(function(k){TITLES[k]=UNIV[k].title;});TITLES.home='Início';}
  }
  montarMenu();iconesMenu();iconesTopo();

  /* ───────────────────────── MARCAR AULA ─────────────────────────
     Os horários vêm da mesma agenda que o Gediel abre no painel do site (Supabase do hub, tabela horarios).
     Reservar usa a função reservar_horario: o horário some pra todo mundo e aparece no painel como "🎓 Aluno · tipo". */
  var HUB_URL='https://iwivldvubmsqyzkkdxoy.supabase.co',HUB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3aXZsZHZ1Ym1zcXl6a2tkeG95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1OTE1MDgsImV4cCI6MjEwODE2NzUwOH0.eyoyRBBp4NAfLhG-ops6cj2-xck61Oalsj3d7h3h360';
  var TIPOS=[
    {k:'conversa',ic:'💬',icn:'aula-conversa',nm:'Conversação',d:'Você e eu, 1 a 1, pra soltar o inglês falando.'},
    {k:'grupo',ic:'👥',icn:'aula-grupo',nm:'Grupo',d:'Você + amigos, família ou colegas de trabalho.'},
    {k:'casal',ic:'💑',icn:'jogo-couple',nm:'Casal',d:'Os dois juntos, no mesmo ritmo.'},
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
  function pintarAgendar(){
    var p=$('pane-agendar');if(!p)return;
    var meta=(U&&U.user_metadata)||{},nome=meta.full_name||meta.name||meta.nome||'',whats=LS.get('mi_whats_'+(U&&U.id||'x'),meta.whatsapp||'');
    var ped=meusPedidos();
    var h='<div class="ag-wrap"><div class="ag-h1">Marcar aula</div><div class="ag-sub">Escolha o tipo, o dia e o horário. Eu recebo na hora e te confirmo valor e link pelo WhatsApp.</div>';
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
  window.goTo=function(page,el){
    gaveta(false);
    window._miniBack=null;
    if(UNIV[page])desenharUni(page);
    if(page==='prompts'){var f=document.querySelector('#pane-prompts iframe');if(f&&!f.src)f.src=f.dataset.src;}
    if(page==='home')setTimeout(renderHome,160);
    if(page==='agendar')renderAgendar();
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
  var JOGOS={'Flashcards':'flash','Monta Frase':'ordem','Complete':'complete','Quiz Phrasal':'phrasal'};
  var G=null,cur=null;
  var gv=document.createElement('div');gv.id='mi-game';document.body.appendChild(gv);
  var shuf=function(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;};
  function gTela(corpo){
    var pct=G.total?Math.round(G.i*100/G.total):0;
    gv.innerHTML='<div class="mg-top"><button class="x" data-g="sair" aria-label="Fechar">✕</button><div class="nm">'+E(G.nome)+'</div><div class="sc">'+G.pts+' pts</div></div><div class="mg-prog"><i style="width:'+pct+'%"></i></div><div class="mg-body"><div class="mg-in">'+corpo+'</div></div>';
  }
  function jogar(nome){
    var t=JOGOS[nome];if(!t)return false;
    var itens=t==='flash'?shuf(DATA.flash).slice(0,12).map(function(a){return {w:a[0],p:a[1],x:a[2],errou:false};}):shuf(DATA[t]).slice(0,t==='ordem'?8:10);
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
    gTela('<div class="mg-q">'+E(G.t==='phrasal'?'O que significa:':'Complete:')+'<br><span style="color:var(--accent)">'+E(q)+'</span></div>'+ops.map(function(o,i){return '<button class="mg-opt" data-g="op" data-i="'+i+'">'+E(o)+'</button>';}).join('')+'<div class="mg-fb"></div>');
  }
  function desenharOrdem(){
    gTela('<div class="mg-q">Monte a frase na ordem certa</div><div class="mg-line" id="mg-line">'+G.resp.map(function(b,k){return '<button class="mg-chip" data-g="tira" data-k="'+k+'">'+E(b.w)+'</button>';}).join('')+'</div>'
      +'<div class="mg-bank">'+G.bank.map(function(b,k){var u=G.resp.indexOf(b)>=0;return '<button class="mg-chip'+(u?' used':'')+'" data-g="poe" data-k="'+k+'">'+E(b.w)+'</button>';}).join('')+'</div>'
      +'<div class="mg-fb" id="mg-fb"></div>'+(G.resp.length<G.itens[G.i].length?'<button class="mg-btn" style="width:100%;opacity:.45;background:var(--surface2);color:var(--fg2)" disabled>Toque nas palavras</button>':'<button class="mg-btn" style="width:100%;background:linear-gradient(135deg,#4f6ef7,#8b5cf6);color:#fff" data-g="conferir">Conferir</button>'));
  }
  function fim(){
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
    if(a==='share'){wa('Fiz '+G.acertos+'/'+G.total+' no jogo '+G.nome+' do Método Inteligente 🎮 Duvido você bater! Faz o teste de nível grátis: '+linkIndicacao(),false);return;}
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
      gv.querySelector('.mg-fb').innerHTML=(i===certo?'✅ Isso!':'Resposta: <b>'+E(item[1][certo])+'</b>')+'<br><button class="mg-btn" style="margin-top:12px;width:100%;background:linear-gradient(135deg,#4f6ef7,#8b5cf6);color:#fff" data-g="prox">Continuar →</button>';
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
    +'<div class="adm-section">O que acontece ao clicar</div><select class="admin-inp" id="uc-acao"><option value="link">🔗 Abrir um link (YouTube, playlist, checkout, site)</option><option value="whatsapp">💬 Abrir meu WhatsApp com mensagem pronta</option><option value="area">📱 Abrir uma área do app</option><option value="curso">🛒 Abrir um mini curso (com cadeado pra quem não comprou)</option></select>'
    +'<div id="uc-valor-box" style="margin-top:8px"></div>'
    +'<div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:14px;font-size:12.5px"><label style="display:flex;gap:6px;align-items:center"><input type="checkbox" id="uc-destaque"> Banner do topo</label><label style="display:flex;gap:6px;align-items:center"><input type="checkbox" id="uc-breve"> Em breve (vira "me avise")</label><label style="display:flex;gap:6px;align-items:center"><input type="checkbox" id="uc-ativo" checked> Visível pros alunos</label></div>'
    +'<div id="uc-st" style="font-size:12px;min-height:18px;margin-top:12px"></div>'
    +'<div style="display:flex;gap:8px;justify-content:space-between;margin-top:6px"><button class="admin-btn admin-btn-danger admin-btn-sm" data-ua="apagar">🗑️ Apagar</button><div style="display:flex;gap:8px"><button class="admin-btn admin-btn-ghost" data-ua="fechar">Cancelar</button><button class="admin-btn admin-btn-primary" data-ua="salvar">💾 Salvar</button></div></div>'
    +'</div></div>';
  document.body.appendChild(um);
  function valorBox(acao,valor){
    var b=$('uc-valor-box');
    if(acao==='area')b.innerHTML='<select class="admin-inp" id="uc-valor">'+Object.keys(AREAS).map(function(k){return '<option value="'+k+'"'+(valor===k?' selected':'')+'>'+AREAS[k]+'</option>';}).join('')+'</select>';
    else if(acao==='curso'){var minis=(MODS_ALL||[]).filter(function(m){return m.trilha==='mini';});
      b.innerHTML='<select class="admin-inp" id="uc-valor"><option value="">— ainda não tem módulo (fica "em breve") —</option>'+minis.map(function(m){return '<option value="'+m.id+'"'+(valor===m.id?' selected':'')+'>'+E(m.name)+(m.produto?' · libera com "'+E(m.produto)+'"':' · ⚠ sem produto')+'</option>';}).join('')+'</select>'+(minis.length?'':'<div style="font-size:11px;color:var(--gold);margin-top:6px">Nenhum mini curso criado ainda. Vá em Módulos → Novo módulo → "Mini curso avulso".</div>');}
    else if(acao==='whatsapp')b.innerHTML='<textarea class="admin-inp" id="uc-valor" rows="2" placeholder="Mensagem que o aluno manda pra você">'+E(valor||'')+'</textarea>';
    else b.innerHTML='<input class="admin-inp" id="uc-valor" placeholder="https://... (vazio = aparece como Em breve)" value="'+E(valor||'')+'">';
  }
  function abrirModalCard(c){
    ADM.edit=c||{universo:ADM.uni,acao:'link',ativo:true};ADM.capa=null;c=ADM.edit;
    $('uc-h').textContent=(c.id?'Editar card':'Novo card')+' · '+UNIV[c.universo].nav;
    $('uc-titulo').value=c.titulo||'';$('uc-desc').value=c.descricao||'';$('uc-secao').value=c.secao||'';$('uc-tag').value=c.tag||'';$('uc-emoji').value=c.emoji||'';
    $('uc-acao').value=c.acao||'link';valorBox(c.acao||'link',c.valor||'');
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
  var URL_BUSSOLA='https://nivelamentogediel.netlify.app/',URL_PRISMA='https://testedeinteligencia1.netlify.app/';
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
  function renderBussola(){
    var p=$('pane-bussola');if(!p)return;var lv=ST.nivel,info=lv&&window.LEVEL_INFO?LEVEL_INFO[lv]:null;
    p.innerHTML='<div style="font-size:21px;font-weight:800;margin-bottom:16px">Bússola CEFR</div>'
      +'<div class="intel-banner"><div style="display:flex;align-items:center;gap:12px;margin-bottom:12px"><div style="width:56px;height:56px;border-radius:16px;background:'+(info?info.bg:'var(--surface2)')+';display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;color:'+(info?'#fff':'var(--fg3)')+';flex-shrink:0">'+(lv||'?')+'</div>'
      +'<div><div style="font-size:16px;font-weight:800">'+(info?E(info.title):'Você ainda não fez o teste de nível')+'</div><div style="font-size:12px;color:var(--fg2);margin-top:2px">Bússola CEFR · do A1 ao C2</div></div></div>'
      +'<div style="font-size:12.5px;color:var(--fg2);line-height:1.7;margin-bottom:14px">'+(info?E(info.desc):'O teste se adapta às suas respostas e mostra onde você está. Leva uns 10 minutos. No fim, é só marcar aqui o nível que apareceu.')+'</div>'
      +'<button class="set-btn set-btn-primary" style="margin:0" data-dg="bussola">'+(lv?'🔁 Refazer o teste de nível':IC('bussola')+' Fazer o teste de nível')+'</button></div>'
      +'<div class="card" style="margin:16px 0"><div class="sec-hd" style="margin-bottom:10px">🎯 '+(lv?'Seu nível':'Já sabe seu nível? Marque aqui')+'</div><div style="display:flex;flex-wrap:wrap;gap:8px">'
      +NIVEIS.map(function(n){return '<button class="gf-btn'+(n===lv?' active':'')+'" onclick="setManualLevel(\''+n+'\')">'+n+'</button>';}).join('')+'</div></div>'
      +'<div class="sec-hd">O que cada nível consegue fazer</div><div class="card">'+NIVEIS.map(function(n){return '<div style="display:flex;gap:12px;align-items:flex-start;padding:9px 0;border-bottom:1px solid var(--border)'+(n===lv?';font-weight:700':'')+'"><span class="level-tag" style="flex-shrink:0;'+(n===lv?'':'background:var(--surface2);color:var(--fg2)')+'">'+n+'</span><span style="font-size:12.5px;line-height:1.5;color:'+(n===lv?'var(--fg)':'var(--fg2)')+'">'+E(NIVEL_CAN[n])+'</span></div>';}).join('')+'</div>';
  }
  function renderPrisma(){
    var p=$('pane-prisma');if(!p)return;var k=ST.prisma,it=k&&INTEL[k];
    p.innerHTML='<div style="font-size:21px;font-weight:800;margin-bottom:16px">Prisma de Talentos</div>'
      +'<div class="intel-banner"><div style="display:flex;align-items:center;gap:12px;margin-bottom:12px"><div style="width:56px;height:56px;border-radius:16px;background:'+(it?'linear-gradient(135deg,#8b5cf6,#ec4899)':'var(--surface2)')+';display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0">'+(it?it.ic:'🔷')+'</div>'
      +'<div><div style="font-size:16px;font-weight:800">'+(it?'Inteligência '+E(it.nome):'Descubra como você aprende melhor')+'</div><div style="font-size:12px;color:var(--fg2);margin-top:2px">'+(it?'Sua inteligência mais forte · Howard Gardner':'Teste das Inteligências Múltiplas · Howard Gardner')+'</div></div></div>'
      +'<div style="font-size:12.5px;color:var(--fg2);line-height:1.7;margin-bottom:14px">'+(it?E(it.desc):'O teste mostra quais das suas inteligências mais aparecem quando você aprende. Com isso, o seu estudo fica do seu jeito. No fim, é só marcar aqui a que deu mais forte.')+'</div>'
      +'<button class="set-btn set-btn-primary" style="margin:0" data-dg="prisma">'+(it?'🔁 Refazer o Prisma':IC('prisma')+' Fazer o Prisma')+'</button></div>'
      +(it?'<div class="card" style="margin-top:16px"><div style="font-size:12px;font-weight:800;margin-bottom:10px">Estratégias pra você</div><div style="font-size:12.5px;color:var(--fg2);line-height:1.9">'+it.est.map(function(x){return '• '+E(x);}).join('<br>')+'</div></div>':'')
      +'<div class="card" style="margin:16px 0"><div class="sec-hd" style="margin-bottom:10px">'+(it?'Mudou o resultado? Marque a sua':'Qual deu como sua inteligência mais forte?')+'</div><div style="display:flex;flex-wrap:wrap;gap:8px">'
      +Object.keys(INTEL).map(function(x){return '<button class="gf-btn'+(x===k?' active':'')+'" data-dg-int="'+x+'">'+INTEL[x].ic+' '+E(INTEL[x].nome)+'</button>';}).join('')+'</div></div>';
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
      +'<iframe src="'+(b?URL_BUSSOLA:URL_PRISMA)+'" title="'+(b?'Teste de nível':'Prisma de Talentos')+'" allow="autoplay; microphone"></iframe>'
      +'<div class="fim"><div class="q">Terminou? Toque no resultado que apareceu:</div><div class="ch">'
      +(b?NIVEIS.map(function(n){return '<button class="gf-btn" data-dg-fim="'+n+'">'+n+'</button>';}).join(''):Object.keys(INTEL).map(function(x){return '<button class="gf-btn" data-dg-fim="'+x+'">'+INTEL[x].ic+' '+E(INTEL[x].nome)+'</button>';}).join(''))
      +'</div></div>';
    tq.dataset.qual=qual;tq.classList.add('on');document.body.style.overflow='hidden';
  }
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
        +'<div class="card" style="text-align:center"><div class="portas">'+Object.keys(INTEL).map(function(k,i){return '<span style="animation-delay:'+(i*0.06)+'s">'+INTEL[k].ic+'</span>';}).join('')+'</div>'
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
        +obBtn('Fazer os 2 testes agora →','data-ob="t-agora"')
        +'<button class="cta2" data-ob="t-manual">Já sei meu nível e meu jeito: escolher manualmente</button>'
        +'<button class="cta2" data-ob="t-depois">Deixar pra depois</button>';
    }else if(passo==='manual'){
      h='<div class="k">Escolha manual</div><h2>Me conta onde você está</h2><p class="s">Se depois quiser confirmar, os testes ficam no menu Perfil.</p>'
        +'<label class="lb">Seu nível</label><div class="chips" style="margin-bottom:18px">'+NIVEIS.map(function(n){return '<button class="chip'+(r.mNivel===n?' on':'')+'" data-ob-mn="'+n+'">'+n+'</button>';}).join('')+'</div>'
        +'<label class="lb">Seu jeito de aprender</label><div class="chips">'+Object.keys(INTEL).map(function(k){return '<button class="chip'+(r.mIntel===k?' on':'')+'" data-ob-mi="'+k+'">'+INTEL[k].ic+' '+E(INTEL[k].nome)+'</button>';}).join('')+'</div>'
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
      var fila=testes==='agora'?['prisma','bussola']:[],fim=obFim;
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
  function faltaDiagnostico(){return !souAdmin()&&ehPrograma()&&!(ST.nivel&&ST.prisma);}
  function portao(oque){
    var ov=$('pw-ov');if(!ov)return;
    var feitoN=!!ST.nivel,feitoP=!!ST.prisma;
    ov.innerHTML='<div class="pw" style="text-align:left"><div style="text-align:center">'+IC('bussola','xl')+'</div><h3 style="text-align:center">Falta pouco pra liberar '+E(oque)+'</h3>'
      +'<p style="text-align:center">O checklist e as aulas são montados a partir do seu nível e do seu jeito de aprender.</p>'
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
  cardLock=function(c){return cardLockOrig(c)||!temAcesso(c);};
  var abrirCardOrig=abrirCard;
  abrirCard=async function(id,uni){
    var c=(CARDS||[]).filter(function(x){return x.id===id;})[0];if(!c)return;
    if(!temAcesso(c)){irCheckout(checkoutDe(c),'"'+c.titulo+'"');return;}
    return abrirCardOrig(id,uni);
  };

  /* ── materiais: grade com capa, seção, preço e cadeado ── */
  function matLivre(m){var S=AS();return !S.ok||souAdmin()||!!S.programa||m.tipo==='gratis'||(m.tipo==='produto'&&temProduto(m.produto));}
  var renderMatOrig=window.renderMat;
  window.renderMat=function(){
    var g=$('mat-grid'),S=AS();if(!g)return;
    var tabs=document.querySelector('#pane-materiais .mat-tabs');if(tabs)tabs.style.display='none';
    g.className='';
    if(!S.pronto){g.innerHTML='<div class="admin-loading">Carregando…</div>';return;}
    var lista=(S.mats||[]).filter(function(m){return m.ativo!==false||EDIT;});
    var secs=[],por={};lista.forEach(function(m){var s=m.secao||'Materiais';if(!por[s]){por[s]=[];secs.push(s);}por[s].push(m);});
    var n=0,h='';
    secs.forEach(function(s){h+='<div class="uni-sec">'+E(s)+'</div><div class="uni-grid">'+por[s].map(function(m){
      var ok=matLivre(m),tag=m.tipo==='gratis'?'Grátis':ok?'✓ Seu':m.tipo==='programa'?'🔒 Programa':(m.preco||'🔒');
      return '<div class="uni-card'+(ok?'':' lock')+(m.ativo===false?' mi-off':'')+'" data-mat="'+m.id+'">'+edCtl('mat',m.id)
        +'<div class="th">'+(m.capa_url?'<img loading="lazy" alt="" src="'+E(m.capa_url)+'">':capaAuto(m.nome,n))+'<span class="tg">'+E(tag)+'</span></div>'
        +'<div class="bd"><div class="tt">'+E((m.icone?m.icone+' ':'')+m.nome)+'</div><div class="ss">'+E(m.descricao||'')+'</div><div class="ac">'+(ok?'Acessar ›':'Quero esse ›')+'</div></div></div>';n++;}).join('')
      +(EDIT?'<button class="mi-novo" data-ed="mat-novo" data-sec="'+E(s)+'">＋ Novo material</button>':'')+'</div>';});
    if(!lista.length)h='<div class="admin-loading">Nenhum material ainda.</div>'+(EDIT?'<div class="uni-grid"><button class="mi-novo" data-ed="mat-novo">＋ Novo material</button></div>':'');
    g.innerHTML=h;
  };
  document.addEventListener('click',async function(e){
    var el=e.target.closest('[data-mat]');if(!el||e.target.closest('[data-ed]'))return;
    var m=(AS().mats||[]).filter(function(x){return x.id===el.dataset.mat;})[0];if(!m)return;
    if(EDIT){abrirMat(m);return;}
    if(!matLivre(m)){irCheckout(m.tipo==='programa'?(AS().cfg||{}).checkout:(m.checkout||(AS().cfg||{}).checkout),'"'+m.nome+'"');return;}
    var r=await window._sb.from('material_links').select('link').eq('material_id',m.id).maybeSingle();
    if(r.data&&r.data.link)window.open(r.data.link,'_blank','noopener');else toast('Esse material ainda está sem link. Avise o Gediel 🙏');
  },true);

  /* modal de material */
  var mm=document.createElement('div');mm.className='modal-overlay';mm.id='mi-mat-modal';
  mm.innerHTML='<div class="modal-box adm-modal-box" style="width:620px"><div class="modal-header"><h2 id="mm-h">Material</h2><button class="modal-close" data-ed="mm-fechar">✕</button></div><div class="modal-body">'
    +'<div class="adm-section">Capa · 1280 × 720 px</div><div class="adm-cover-drop" data-ed="mm-capa"><div class="adm-cover-prev" id="mm-prev">🖼️</div><div style="font-size:12px;color:var(--fg2);line-height:1.6"><strong>Clique pra enviar</strong><br>JPG/PNG · 16:9 · até 2 MB<br><button class="admin-btn admin-btn-ghost admin-btn-sm" style="margin-top:6px" data-ed="mm-sem-capa">Tirar capa</button></div><input type="file" id="mm-file" accept="image/*" style="display:none"></div>'
    +'<div class="adm-section">Nome</div><input class="admin-inp" id="mm-nome" maxlength="120">'
    +'<div class="adm-section">Descrição</div><textarea class="admin-inp" id="mm-desc" rows="2" maxlength="600"></textarea>'
    +'<div style="display:grid;grid-template-columns:1fr 1fr 80px;gap:10px" class="grid-2"><div><div class="adm-section">Seção</div><input class="admin-inp" id="mm-secao" list="mm-secoes" placeholder="Ex.: E-books"><datalist id="mm-secoes"></datalist></div><div><div class="adm-section">Preço (aparece no card)</div><input class="admin-inp" id="mm-preco" placeholder="R$ 27" maxlength="40"></div><div><div class="adm-section">Emoji</div><input class="admin-inp" id="mm-icone" maxlength="8" style="text-align:center"></div></div>'
    +'<div class="adm-section">Link do conteúdo (só quem tem acesso vê)</div><input class="admin-inp" id="mm-link" placeholder="https://... (PDF, Drive, site do e-book)">'
    +'<div id="mm-acesso-wrap"></div>'
    +'<label style="display:flex;gap:6px;align-items:center;font-size:12.5px;margin-top:14px"><input type="checkbox" id="mm-ativo"> Visível pros alunos</label>'
    +'<div id="mm-st" style="font-size:12px;min-height:18px;margin-top:12px"></div>'
    +'<div style="display:flex;gap:8px;justify-content:space-between;margin-top:6px"><button class="admin-btn admin-btn-danger admin-btn-sm" data-ed="mm-apagar">🗑️ Apagar</button><div style="display:flex;gap:8px"><button class="admin-btn admin-btn-ghost" data-ed="mm-fechar">Cancelar</button><button class="admin-btn admin-btn-primary" data-ed="mm-salvar">💾 Salvar</button></div></div>'
    +'</div></div>';
  document.body.appendChild(mm);
  var MM={m:null,capa:null};
  async function abrirMat(m,secao){
    MM.m=m||{tipo:'produto',ativo:true,secao:secao||''};MM.capa=null;m=MM.m;encherProdutos();
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
  }
  function modoEdicao(on){
    EDIT=!!on&&souAdmin();document.body.classList.toggle('mi-edit',EDIT);
    var t=$('mi-ed-btn');if(t){t.innerHTML=EDIT?IC('check')+' Concluir':IC('editar')+' Editar';t.classList.toggle('on',EDIT);}
    pintarEdicaoMenu();pintarEdModulos();
    var pg=window.currentPage;if(UNIV[pg]){CARDS=null;desenharUni(pg);}if(pg==='materiais')renderMat();
    if(EDIT)toast('✏️ Modo edição: toque em qualquer card, material ou menu pra editar','#4f6ef7');
  }
  function botaoEdicao(){
    if($('mi-ed-btn')||!souAdmin())return;
    var tb=document.querySelector('.topbar'),th=$('theme-toggle');if(!tb)return;
    var b=document.createElement('button');b.id='mi-ed-btn';b.className='tb-btn';b.dataset.ed='toggle';b.innerHTML=IC('editar')+' Editar';
    tb.insertBefore(b,th||null);
  }
  async function iniciarEdicao(){
    await lerCfg();aplicarMenus();
    var t=0;(function esp(){var S=AS();if(S.pronto){botaoEdicao();aplicarMenus();if(window.currentPage==='materiais')renderMat();}else if(t++<240)setTimeout(esp,500);})();
  }
  window.MI_EDIT={ligar:modoEdicao,aplicarMenus:aplicarMenus};
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
  var stc=document.createElement('style');stc.textContent='#mi-story .sb{background:var(--surface);border-radius:22px;padding:14px 16px 16px;width:min(420px,calc(100vw - 32px));max-height:calc(100dvh - 32px);overflow-y:auto;display:flex;flex-direction:column;gap:12px;box-shadow:0 24px 60px rgba(0,0,0,.45)}#mi-story .hd{display:flex;align-items:center;justify-content:space-between;font-weight:800;font-size:15px}#mi-story .hd button{width:36px;height:36px;padding:0;border-radius:50%;background:var(--bg2,rgba(127,127,127,.12));color:var(--fg)}#mi-story .rd{display:grid;grid-template-columns:1fr 1fr;gap:8px}#mi-story .rd button{display:flex;align-items:center;justify-content:center;gap:8px;color:#fff;padding:14px 8px;font-size:14px}#mi-story .ig{background:linear-gradient(45deg,#f9a825,#e1306c 45%,#833ab4)}#mi-story .wa{background:#25d366}#mi-story .ic4{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}#mi-story .ic4 button{display:flex;flex-direction:column;align-items:center;gap:3px;padding:10px 4px;font-size:11px;font-weight:700}#mi-story .ic4 b{font-size:20px;line-height:1}#mi-story img{width:100%;max-height:52dvh;object-fit:contain;border-radius:14px;background:#0b0d1c}#mi-story img.tr{background:repeating-conic-gradient(#9aa0b4 0 25%,#d7dbe6 0 50%) 0 0/24px 24px}#mi-story .bt{display:grid;grid-template-columns:1fr 1fr;gap:8px}#mi-story button{border:none;border-radius:14px;padding:13px;font:inherit;font-size:14px;font-weight:800;cursor:pointer}#mi-story .p{background:linear-gradient(135deg,#4f6ef7,#8b5cf6);color:#fff;grid-column:1/-1}#mi-story .g{background:var(--bg2,rgba(127,127,127,.12));color:var(--fg)}#mi-story .t{font-size:13px;color:var(--fg2);text-align:center;line-height:1.5}';document.head.appendChild(stc);
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
    if(e.target===stEl){stEl.classList.remove('open');return;}
    var b=e.target.closest('[data-st]');if(!b)return;var a=b.dataset.st;
    if(a==='fechar')return stEl.classList.remove('open');
    if(a==='frase'){STY.i++;return pintarStory();}
    if(a==='cor'){if(STY.transp)STY.transp=false;else STY.cor++;return pintarStory();}
    if(a==='transp'){if(STY.transp){STY.transp=false;STY.cor++;}else STY.transp=true;return pintarStory();}
    var f=new File([stBlob],'minha-conquista-ingles.png',{type:'image/png'});
    var social=a==='ig'||a==='wa';
    if(social&&navigator.canShare&&navigator.canShare({files:[f]})){
      toast(a==='ig'?'Escolha Instagram → Story 📸':'Escolha WhatsApp → Meu status 💬',a==='ig'?'#e1306c':'#25d366');
      try{await navigator.share(a==='wa'?{files:[f],text:'Hoje eu treinei meu inglês 🔥'}:{files:[f]});}catch(err){}
      return;
    }
    var u=URL.createObjectURL(stBlob),l=document.createElement('a');l.href=u;l.download='minha-conquista-ingles.png';document.body.appendChild(l);l.click();l.remove();
    toast(social?'Imagem baixada. Pra postar direto, abra a plataforma no celular 📲':'Imagem baixada ✅');
  });
  function compartilharConquista(sc,tot){STY.quiz=sc!=null?{sc:sc,tot:tot,t:(window._stCurLes&&_stCurLes.title)||'aula'}:null;STY.i++;pintarStory();}
  /* ───────────────────────── FESTA: checklist do dia concluído ───────────────────────── */
  var IRONIA={
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
  setTimeout(montarAbasLives,0);
  window.MI_APP={conhecer:conhecer,tour:tour,aulaAberta:aulaAberta,marcarDia:marcarDia,abrirAula:abrirAula,renderHome:renderHome,
    compartilharQuiz:compartilharConquista,compartilharDia:function(){compartilharConquista(null);},festa:festa};
})();
