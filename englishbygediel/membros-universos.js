/* Área de membros: os três UNIVERSOS (English On Mission, Culture English, Viagens).
   Cada um é um menu na lateral que abre uma página de cards: o que assistir, o que comprar, grupos e jogos.
   Pra editar: mexa só nas listas UNIV e SUBS abaixo. Tipos de ação de um card:
     { go:'jogos' }            abre outra área do app
     { link:'https://...' }    abre um link em nova aba
     { wa:'texto' }            abre o WhatsApp do Gediel com a mensagem pronta
     { sub:'chave' }           abre uma sub-página com mais cards (lista em SUBS)
   soon:true = "Em breve" (o botão vira "Me avise" no WhatsApp). */
(function(){
  var WA='5555999895429';
  var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});};

  var UNIV={
    eom:{icon:'🙏',nav:'English On Mission',title:'English On Mission',sub:'Inglês com a Bíblia: devocionais, aulas, materiais e comunidade',
      hero:{t:'Devocional ao vivo todo sábado, 9h',s:'Um versículo e um ponto do inglês de cada vez, com gente do Brasil inteiro na tela.',btn:'Assistir no YouTube',link:'https://youtube.com/live/QmDQciTioJI?feature=share',cor:'linear-gradient(135deg,#15281f,#2f6b4f)'},
      cards:[
        {t:'Devocionais',s:'Todos os devocionais gravados, pra ver e rever.',img:'img/card-devocionais.webp',tag:'Assinatura',go:'devocionais'},
        {t:'Devocionais · Reforço',s:'Revisão e prática de cada devocional.',emoji:'🔁',tag:'Em breve',soon:true,wa:'Oi Gediel! Quero ser avisado quando sair o Reforço dos Devocionais.'},
        {t:'Aulas · Inglês com a Bíblia',s:'Inglês estudando as cartas da Bíblia, do verb to be às cartas de João.',img:'img/card-aulas.webp',tag:'Em breve',soon:true,wa:'Oi Gediel! Quero ser avisado quando as Aulas de Inglês com a Bíblia entrarem na área de membros.'},
        {t:'Bíblias, livros e materiais',s:'Bíblia bilíngue, diário e o que eu indico pra estudar a Palavra em inglês.',img:'img/achados/2.webp',fit:1,tag:'Lojinha',sub:'eomloja'},
        {t:'Grupo do WhatsApp',s:'O grupo gratuito do English On Mission, pra praticar e caminhar junto.',img:'img/logo-eom.webp',fit:1,tag:'Grátis',wa:'Oi Gediel! Quero entrar no grupo gratuito do English On Mission.'},
        {t:'Jogos',s:'Treine vocabulário e frases jogando.',emoji:'🎮',tag:'No app',go:'jogos'},
        {t:'@englishonmission',s:'Versículos, bastidores e avisos das lives no Instagram.',img:'img/card-eom-lives.webp',tag:'Instagram',link:'https://instagram.com/englishonmission'},
        {t:'Assinar o English On Mission',s:'Devocionais ao vivo, aulas com a Bíblia, e-book e Bíblia linear de 1, 2 e 3 João.',emoji:'✨',tag:'R$ 25/mês',link:'https://pay.kiwify.com.br/oIjfTK8',buy:1}
      ]},
    culture:{icon:'🎬',nav:'Culture English',title:'Culture English',sub:'Inglês de verdade com séries, filmes e música',
      hero:{t:'Lives do Culture English',s:'Inglês real a partir de séries, filmes e música, ao vivo com o Gediel.',btn:'Quero o lembrete das lives',wa:'Oi Gediel! Quero receber o link das lives do Culture English.',cor:'linear-gradient(135deg,#1b2a6b,#4f6ef7)'},
      cards:[
        {t:'Inglês com Séries',s:'Aprender com o que você já gosta de assistir.',img:'img/card-series.webp',tag:'Módulo',go:'modulos'},
        {t:'Inglês com Música',s:'Letra, pronúncia e ritmo: o ouvido treina enquanto você canta.',img:'img/card-musica.webp',tag:'Módulo',go:'modulos'},
        {t:'Inglês com Filmes',s:'Cenas de filme como aula: expressões e sotaques que não estão no livro.',img:'img/card-filmes.webp',tag:'Em breve',soon:true,wa:'Oi Gediel! Quero ser avisado quando sair o Inglês com Filmes.'},
        {t:'E-books e guias',s:'Materiais pra ir mais fundo no seu ritmo.',img:'img/capa-guia.webp',fit:1,tag:'Lojinha',sub:'cultloja'},
        {t:'Templates e prompts',s:'Prompts prontos pra praticar com ChatGPT e Claude.',img:'img/capa-prompts.webp',fit:1,tag:'Grátis',sub:'culttpl'},
        {t:'Achados pra estudar',s:'Livros, cadernos e jogos que eu indico.',img:'img/achados/0.webp',fit:1,tag:'Indicações',sub:'cultachados'},
        {t:'Grupo do WhatsApp',s:'Dicas de séries, filmes e músicas pra praticar o inglês de verdade.',emoji:'💬',tag:'Grátis',wa:'Oi Gediel! Quero entrar no grupo gratuito do Culture English.'},
        {t:'Jogos',s:'Treine vocabulário e frases jogando.',emoji:'🎮',tag:'No app',go:'jogos'}
      ]},
    viagens:{icon:'✈️',nav:'Viagens',title:'Viagens e Intercâmbio',sub:'Tudo pra você viajar sem travar: do planejamento ao inglês da rua',
      hero:{t:'Me ajude a planejar minha viagem',s:'Me conta o destino e a data. Eu te digo por onde começar e o que estudar antes de embarcar.',btn:'Planejar com o Gediel',wa:'Oi Gediel! Quero ajuda pra planejar minha viagem. Destino: ___ · Quando: ___ · Meu nível de inglês: ___',cor:'linear-gradient(135deg,#0c4a6e,#0ea5e9)'},
      cards:[
        {t:'Toronto 2027',s:'O próximo intercâmbio da Infly. Garanta seu lugar no formulário.',img:'img/card-toronto.webp',tag:'Inscrições abertas',link:'https://forms.gle/V2dDVBXotN1XUmS1A'},
        {t:'Grupo de Toronto',s:'O grupo de quem vai (ou quer ir) no intercâmbio de 2027.',emoji:'🍁',tag:'WhatsApp',wa:'Oi Gediel! Quero entrar no grupo de Toronto 2027.'},
        {t:'Mini curso Inglês para Viagens',s:'Aeroporto, hotel, restaurante e imprevisto: as situações que toda viagem traz.',img:'img/card-viagem-ingles.webp',tag:'Em breve',soon:true,wa:'Oi Gediel! Quero ser avisado quando o mini curso Inglês para Viagens lançar.'},
        {t:'E-book Passaporte do Inglês',s:'9 capítulos na ordem da viagem + Kit de Sobrevivência com as 20 frases que salvam.',img:'img/capa-viagens.webp',fit:1,tag:'R$ 27',link:'https://ebookviagens.netlify.app/',buy:1},
        {t:'Seguro viagem',s:'Consulte opções de seguro pras datas e o destino da sua viagem.',img:'img/achados/7.webp',fit:1,tag:'Indicação',link:'https://www.seguroviagem.srv.br/?ag=Us59wEJXEu'},
        {t:'Vlogs Londres, Paris e Bruxelas',s:'Três cidades, três sotaques e o caderno de viagem de 2024.',img:'img/card-europa.webp',tag:'YouTube',link:'https://www.youtube.com/@oficialinfly/videos'},
        {t:'Vlogs New York 2025',s:'Os bastidores da viagem a Nova York, com o inglês de rua ao vivo.',img:'img/card-vlog-ny.webp',tag:'Em breve',soon:true,wa:'Oi Gediel! Quero ser avisado quando os vlogs de New York saírem.'},
        {t:'Achados de viagem',s:'O que eu levo na mala e indico.',img:'img/achados/5.webp',fit:1,tag:'Indicações',sub:'viagachados'},
        {t:'Jogos',s:'Treine o inglês de viagem jogando.',emoji:'🎮',tag:'No app',go:'jogos'},
        {t:'@inflyviagens',s:'Viagens e intercâmbios em grupo pra colocar o inglês em uso.',img:'img/card-infly-viagens.webp',tag:'Instagram',link:'https://instagram.com/inflyviagens'}
      ]}
  };

  var SUBS={
    eomloja:{title:'Bíblias, livros e materiais',cards:[
      {t:'Bíblia bilíngue NVI/NIV',s:'Leia em português e inglês e compare as duas traduções.',img:'img/achados/2.webp',fit:1,tag:'Indicação · Mercado Livre',link:'https://meli.la/28NzfyU'},
      {t:'The Five Minute Journal',s:'Diário guiado pra praticar a escrita em inglês em poucos minutos.',img:'img/achados/1.webp',fit:1,tag:'Indicação · Amazon',link:'https://link.amazon/B0cYbg3Hr'},
      {t:'Meus materiais',s:'Os PDFs e e-books que você já tem liberados.',emoji:'📦',tag:'No app',go:'materiais'}
    ]},
    cultloja:{title:'E-books e guias',cards:[
      {t:'Guia A1 até B2',s:'Um mapa claro do A1 ao B2, com planos semanais de 30 a 60 minutos.',img:'img/capa-guia.webp',fit:1,tag:'R$ 27',link:'https://guia-a1-b2.netlify.app/',buy:1},
      {t:'Passaporte do Inglês',s:'O manual pra quem tem viagem marcada. 9 capítulos + Kit de Sobrevivência.',img:'img/capa-viagens.webp',fit:1,tag:'R$ 27',link:'https://ebookviagens.netlify.app/',buy:1},
      {t:'Kit Frases',s:'As frases das situações essenciais do dia a dia, prontas pra usar.',img:'img/capa-frases.webp',fit:1,tag:'Em breve',soon:true,wa:'Oi Gediel! Quero ser avisado quando o Kit Frases sair.'}
    ]},
    culttpl:{title:'Templates e prompts',cards:[
      {t:'Central de Prompts',s:'50 prompts grátis pra conversar, simular entrevistas e praticar com IA.',img:'img/capa-prompts.webp',fit:1,tag:'Grátis',link:'central-prompts.html'},
      {t:'Seu Professor Particular com IA',s:'Um prompt que transforma o ChatGPT no seu professor de inglês.',emoji:'🤖',tag:'Grátis',link:'https://promptchatgpt1.netlify.app/'}
    ]},
    cultachados:{title:'Achados pra estudar',cards:[
      {t:'English for Everyone: Grammar Guide',s:'Guia visual de gramática pra consultar enquanto estuda.',img:'img/achados/0.webp',fit:1,tag:'Indicação · Amazon',link:'https://amzn.to/4iyoaQO'},
      {t:'The Five Minute Journal',s:'Diário guiado pra escrever em inglês todo dia.',img:'img/achados/1.webp',fit:1,tag:'Indicação · Amazon',link:'https://link.amazon/B0cYbg3Hr'},
      {t:'Dobble Clássico',s:'Jogue com a família nomeando os símbolos em inglês.',img:'img/achados/3.webp',fit:1,tag:'Indicação · Mercado Livre',link:'https://meli.la/2uR3Mz4'},
      {t:'Kit de cadernos A5 e A6',s:'Pra organizar frases, vocabulário e anotações.',img:'img/achados/4.webp',fit:1,tag:'Indicação · Mercado Livre',link:'https://meli.la/1y58Nnf'}
    ]},
    viagachados:{title:'Achados de viagem',cards:[
      {t:'Organizador de mala de 7 peças',s:'Separe roupas e acessórios em bolsas dentro da mala.',img:'img/achados/5.webp',fit:1,tag:'Indicação · Mercado Livre',link:'https://meli.la/1Lai5vf'},
      {t:'Almofada de pescoço',s:'Apoio pro pescoço em avião, ônibus ou carro.',img:'img/achados/6.webp',fit:1,tag:'Indicação · Mercado Livre',link:'https://meli.la/2wNHYEe'},
      {t:'Real Seguro Viagem',s:'Consulte opções de seguro pras datas e o destino.',img:'img/achados/7.webp',fit:1,tag:'Indicação',link:'https://www.seguroviagem.srv.br/?ag=Us59wEJXEu'}
    ]}
  };

  // ───── estilo
  var css=document.createElement('style');
  css.textContent='.nav-pill[onclick*="\'devocionais\'"]{display:none!important}'
   +'.uni-hero{border-radius:20px;padding:22px;color:#fff;margin-bottom:18px;display:flex;gap:16px;align-items:center;flex-wrap:wrap;box-shadow:var(--shadow)}'
   +'.uni-hero .ht{font-size:18px;font-weight:800;line-height:1.25}.uni-hero .hs{font-size:12.5px;opacity:.9;margin-top:4px;line-height:1.5;max-width:520px}'
   +'.uni-hero button{margin-left:auto;background:#fff;color:#111;border:none;border-radius:12px;padding:11px 18px;font-size:13px;font-weight:800;cursor:pointer;white-space:nowrap}'
   +'.uni-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:14px}'
   +'.uni-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;overflow:hidden;cursor:pointer;display:flex;flex-direction:column;transition:transform .15s,border-color .15s,box-shadow .15s;box-shadow:var(--shadow)}'
   +'.uni-card:hover{transform:translateY(-3px);border-color:var(--accent)}'
   +'.uni-card .th{aspect-ratio:16/9;background:var(--surface2);position:relative;display:flex;align-items:center;justify-content:center;font-size:38px;overflow:hidden}'
   +'.uni-card .th img{width:100%;height:100%;object-fit:cover;display:block}.uni-card .th.fit img{object-fit:contain;padding:10px}'
   +'.uni-card .tg{position:absolute;top:8px;left:8px;background:rgba(10,14,30,.78);color:#fff;font-size:9.5px;font-weight:800;letter-spacing:.3px;padding:3px 8px;border-radius:7px;backdrop-filter:blur(4px)}'
   +'.uni-card.buy .tg{background:#10b981}.uni-card.soon{opacity:.82}.uni-card.soon .tg{background:#f59e0b;color:#1a1200}'
   +'.uni-card .bd{padding:11px 12px 13px;display:flex;flex-direction:column;gap:4px;flex:1}'
   +'.uni-card .tt{font-size:13px;font-weight:800;line-height:1.3}.uni-card .ss{font-size:11px;color:var(--fg2);line-height:1.5;flex:1}'
   +'.uni-card .ac{font-size:11px;font-weight:800;color:var(--accent);margin-top:6px}'
   +'@media(max-width:560px){.uni-grid{grid-template-columns:repeat(2,1fr);gap:10px}.uni-hero button{margin-left:0;width:100%}}';
  document.head.appendChild(css);

  // ───── menu lateral + páginas
  var pills={};
  function montar(){
    var secs=document.querySelectorAll('.nav-section'),perfil=null;
    [].forEach.call(secs,function(s){if(/perfil/i.test(s.textContent))perfil=s;});
    var matPane=document.getElementById('pane-materiais');
    if(!perfil||!matPane||document.getElementById('pane-eom'))return;
    var sec=document.createElement('div');sec.className='nav-section';sec.textContent='Universos';
    perfil.insertAdjacentElement('beforebegin',sec);
    var ant=sec,antPane=matPane;
    Object.keys(UNIV).forEach(function(k){
      var u=UNIV[k];
      var pill=document.createElement('div');pill.className='nav-pill';pill.setAttribute('onclick',"goTo('"+k+"',this)");
      pill.innerHTML='<span class="nav-icon">'+u.icon+'</span><span>'+esc(u.nav)+'</span>';
      ant.insertAdjacentElement('afterend',pill);ant=pill;pills[k]=pill;
      var pane=document.createElement('div');pane.className='pane';pane.id='pane-'+k;
      antPane.insertAdjacentElement('afterend',pane);antPane=pane;
      if(window.TITLES)TITLES[k]=u.title;
    });
  }

  function acaoTxt(c){
    if(c.soon)return 'Me avise quando sair ›';
    if(c.buy)return 'Comprar ›';
    if(c.sub)return 'Ver tudo ›';
    if(c.go)return 'Abrir ›';
    if(c.wa)return 'Chamar no WhatsApp ›';
    return 'Acessar ↗';
  }
  function cardHtml(c,ref){
    return '<div class="uni-card'+(c.soon?' soon':'')+(c.buy?' buy':'')+'" data-uni="'+ref+'">'
      +'<div class="th'+(c.fit?' fit':'')+'">'+(c.img?'<img loading="lazy" alt="" src="'+esc(c.img)+'">':esc(c.emoji||'✨'))+(c.tag?'<span class="tg">'+esc(c.tag)+'</span>':'')+'</div>'
      +'<div class="bd"><div class="tt">'+esc(c.t)+'</div><div class="ss">'+esc(c.s||'')+'</div><div class="ac">'+acaoTxt(c)+'</div></div></div>';
  }
  function desenhar(k,subKey){
    var u=UNIV[k],p=document.getElementById('pane-'+k);if(!u||!p)return;
    var h='';
    if(subKey&&SUBS[subKey]){
      var sb=SUBS[subKey];
      h+='<button class="back-btn" data-uni-back="'+k+'">← '+esc(u.title)+'</button>';
      h+='<div style="font-size:21px;font-weight:800;margin-bottom:16px">'+esc(sb.title)+'</div>';
      h+='<div class="uni-grid">'+sb.cards.map(function(c,i){return cardHtml(c,k+'|'+subKey+'|'+i);}).join('')+'</div>';
      if(/Indica/.test(JSON.stringify(sb.cards.map(function(c){return c.tag;}))))h+='<div style="font-size:10.5px;color:var(--fg3);margin-top:14px">Indicação = link de afiliado. Você paga o mesmo preço e eu posso receber uma comissão.</div>';
    }else{
      h+='<div style="font-size:21px;font-weight:800;margin-bottom:4px">'+esc(u.title)+'</div><div style="font-size:13px;color:var(--fg2);margin-bottom:18px">'+esc(u.sub)+'</div>';
      if(u.hero)h+='<div class="uni-hero" style="background:'+u.hero.cor+'"><div><div class="ht">'+esc(u.hero.t)+'</div><div class="hs">'+esc(u.hero.s)+'</div></div><button data-uni="'+k+'|hero">'+esc(u.hero.btn)+'</button></div>';
      h+='<div class="uni-grid">'+u.cards.map(function(c,i){return cardHtml(c,k+'||'+i);}).join('')+'</div>';
    }
    p.innerHTML=h;
    var main=p.closest('.content,.main,main');if(main&&main.scrollTo)main.scrollTo(0,0);
  }
  function abrir(c,k){
    if(c.go){
      var alvo=c.go==='devocionais'?pills.eom:[].filter.call(document.querySelectorAll('.nav-pill'),function(n){return (n.getAttribute('onclick')||'').indexOf("'"+c.go+"'")>=0;})[0];
      window.goTo(c.go,alvo||null);return;
    }
    if(c.sub){desenhar(k,c.sub);return;}
    if(c.wa){window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(c.wa),'_blank','noopener');return;}
    if(c.link){window.open(c.link,'_blank','noopener');}
  }
  document.addEventListener('click',function(e){
    var b=e.target.closest('[data-uni-back]');if(b){desenhar(b.dataset.uniBack);return;}
    var el=e.target.closest('[data-uni]');if(!el)return;
    var pr=el.dataset.uni.split('|'),k=pr[0],u=UNIV[k];if(!u)return;
    if(pr[1]==='hero'){abrir(u.hero,k);return;}
    var c=pr[1]?SUBS[pr[1]].cards[+pr[2]]:u.cards[+pr[2]];
    if(c)abrir(c,k);
  });

  montar();
  var goToAnt=window.goTo;
  window.goTo=function(page,el){
    if(UNIV[page])desenhar(page);
    return goToAnt(page,el);
  };
})();
