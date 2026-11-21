/* Tutorial por tipo de acesso. Cada pessoa vê só o que o plano dela tem, e quando o plano muda (upgrade ou assinatura),
   aparece o "o que mudou". Pacotes: gratis · eom · programa · tudo (Gênio/Instituição). O que já foi visto fica no cadastro da pessoa
   (user_metadata.tour) e no aparelho. Reabrir: EBG_TUT.abrir(). Testar (admin): membros.html?tutorial=gratis|eom|programa|tudo */
(function(){
  var AS=function(){return (window.EBG_ACESSO||{}).estado||{};};
  var I=function(n){return '<img src="img/icons/'+n+'" alt="" draggable="false">';};
  var LOCK='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
  var CHK='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  function L(items,lock){return '<ul class="tt-l'+(lock?' lk':'')+'">'+items.map(function(x){return '<li>'+(lock?LOCK:CHK)+'<span>'+x+'</span></li>';}).join('')+'</ul>';}
  var SL={
    gratis:[
      {ic:'home.webp',t:'Bem-vindo(a)!',x:'Seu acesso grátis já está ativo. Em 1 minuto você vê o que já pode usar e o que dá pra destravar.'},
      {ic:'lives.webp',t:'O que já é seu',x:L(['<b>Lives grátis:</b> Devocional (sábado, 9h) e Culture English','<b>Jogos</b> liberados pra praticar','<b>Materiais gratuitos</b>','<b>Bússola</b> (seu nível) e <b>Prisma</b> (seu jeito de aprender)'])},
      {ic:'planos.svg',t:'Tem muito mais pra destravar',x:'Isso aparece com cadeado no seu menu. É o que você ganha com um plano:'+L(['Aulas, módulos e Maratona de Hoje (Programa)','Lives de conversação A1/A2 e B1/B2','Mural, devocionais e pregações (English on Mission)','E-books e mini cursos'],true),btn:['planos','Ver os planos']}
    ],
    eom:[
      {ic:'eom.webp',t:'Bem-vindo(a) ao English on Mission',x:'Inglês com a Bíblia, junto com a turma. Esta é a sua área: tudo gira em volta dela.'},
      {ic:'lives.webp',t:'Lives e conteúdo',x:L(['<b>Devocional ao vivo</b> todo sábado, 9h, só dentro das Lives','<b>Pregação da semana</b> e devocionais gravados','<b>Inglês bíblico na prática</b>, Spotify e filmes cristãos pra praticar'])},
      {ic:'check.webp',t:'Mural da turma',x:'Publique testemunhos, pedidos de oração e recados, e comente nos da turma. Seu nome ganha o <b>selo dourado</b> de assinante. Fotos passam por aprovação e não aceitamos palavrão nem ofensa.'}
    ],
    mudou_eom:[
      {ic:'eom.webp',t:'Assinatura ativada! 🎉',x:'O English on Mission acabou de abrir pra você. Veja o que mudou na sua plataforma:'+L(['<b>Mural da turma:</b> publique e comente, com selo dourado','<b>Devocionais gravados</b> e <b>pregação da semana</b>','<b>Inglês bíblico na prática</b> e materiais do EOM','Grupo do WhatsApp da turma'])}
    ],
    mudou_programa:[
      {ic:'maratona.webp',t:'Você agora é do Programa 🚀',x:'Seu plano liberou o método completo. Novidades no seu menu:'+L(['<b>Maratona de Hoje:</b> o checklist do seu dia, por lugar onde você está','<b>Módulos e aulas</b> com quiz e comentários','<b>Todas as lives</b> (A1/A2 e B1/B2) e replays','<b>Todos os jogos</b> e materiais do Programa'])},
      {ic:'bussola.webp',t:'Por onde começar',x:'1) Faça a <b>Bússola</b> pra saber seu nível. 2) Faça o <b>Prisma</b> pra montar seu plano. 3) Abra a <b>Maratona de Hoje</b> e comece pela tarefa mais curta.',btn:['maratona','Abrir a Maratona']}
    ],
    mudou_tudo:[
      {ic:'planos.svg',t:'Tudo liberado 👑',x:'Seu plano libera a plataforma inteira:'+L(['Programa completo (aulas, maratona, lives)','English on Mission: mural, devocionais e pregações','E-books, mini cursos e tudo que for lançado'])}
    ]
  };
  function pacotes(){
    var S=AS(),cs=S.compras||[],eom=cs.some(function(c){return /english on mission|mission|eom/i.test(c.produto||'');})||/english on mission|mission|eom/i.test(String(S.meta||''));
    var p=['gratis'];if(eom||S.tudo)p.push('eom');if(S.programa||S.tudo)p.push('programa');if(S.tudo)p.push('tudo');return p;
  }
  var css=document.createElement('style');
  css.textContent='#mi-tut{position:fixed;inset:0;z-index:9500;display:none;align-items:center;justify-content:center;padding:18px;background:radial-gradient(ellipse at 20% 0%,#3b4fd8 0%,#1b1f4b 45%,#0b0d1c 100%);color:#fff;overflow:auto}#mi-tut.on{display:flex}'
  +'#mi-tut.eom{background:radial-gradient(ellipse at 80% -10%,rgba(212,178,92,.22),transparent 55%),linear-gradient(180deg,#0e271d,#08160f)}'
  +'.tt-b{width:100%;max-width:520px;text-align:center}.tt-i img{width:96px;height:96px;object-fit:contain;margin-bottom:12px}.tt-t{font-size:clamp(22px,5vw,28px);font-weight:800;margin:0 0 10px;line-height:1.2;text-wrap:balance}'
  +'.tt-x{font-size:15px;line-height:1.6;color:rgba(255,255,255,.85);text-align:left}.tt-x b{color:#fff}.tt-b .tt-x:not(:has(ul)){text-align:center}'
  +'.tt-l{list-style:none;margin:12px 0 0;padding:0;display:grid;gap:8px;text-align:left}.tt-l li{display:flex;gap:10px;align-items:flex-start;background:rgba(255,255,255,.08);border-radius:12px;padding:10px 12px;font-size:14px;line-height:1.4}.tt-l li svg{flex:none;margin-top:2px;color:#7be0a0}.tt-l.lk li svg{color:#f3c76b}'
  +'.tt-d{display:flex;gap:7px;justify-content:center;margin:20px 0 14px}.tt-d i{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.3)}.tt-d i.on{background:#fff;width:22px;border-radius:99px}'
  +'.tt-a{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}.tt-a button{border:0;border-radius:14px;padding:13px 22px;font:inherit;font-size:15px;font-weight:800;cursor:pointer;min-height:46px}'
  +'.tt-p{background:#fff;color:#1b1f4b}#mi-tut.eom .tt-p{background:linear-gradient(135deg,#f3e2a8,#d4b25c);color:#14261c}.tt-s{background:rgba(255,255,255,.12);color:#fff}.tt-k{background:none;border:0;color:rgba(255,255,255,.6);font:inherit;font-size:13px;margin-top:12px;cursor:pointer;text-decoration:underline}';
  document.head.appendChild(css);
  var ov=document.createElement('div');ov.id='mi-tut';document.body.appendChild(ov);

  function mostrar(slides,tema,fim){
    var i=0;ov.className='on'+(tema==='eom'?' eom':'');
    function desenha(){
      var s=slides[i],ult=i===slides.length-1;
      ov.innerHTML='<div class="tt-b"><div class="tt-i">'+I(s.ic)+'</div><h2 class="tt-t">'+s.t+'</h2><div class="tt-x">'+s.x+'</div>'
        +'<div class="tt-d">'+slides.map(function(_,k){return '<i class="'+(k===i?'on':'')+'"></i>';}).join('')+'</div>'
        +'<div class="tt-a">'+(s.btn&&ult?'<button class="tt-s" data-t="ir">'+s.btn[1]+'</button>':'')+'<button class="tt-p" data-t="'+(ult?'fim':'prox')+'">'+(ult?'Começar':'Próximo')+'</button></div>'
        +(ult?'':'<button class="tt-k" data-t="fim">Pular</button>')+'</div>';
    }
    ov.onclick=function(e){var b=e.target.closest('[data-t]');if(!b)return;var a=b.dataset.t;
      if(a==='prox'){i++;desenha();}
      else{ov.className='';ov.innerHTML='';fim();if(a==='ir'){var s=slides[slides.length-1];if(s.btn&&window.go2)go2(s.btn[0]);}}
    };
    desenha();
  }
  var LS={g:function(k){try{return localStorage.getItem(k);}catch(e){return null;}},s:function(k,v){try{localStorage.setItem(k,v);}catch(e){}}};
  async function gravar(user,p){
    var v=p.join(',');LS.s('mi_tour_'+(user&&user.id||''),v);
    try{await window._sb.auth.updateUser({data:{tour:v}});}catch(e){}
  }
  function slidesPara(visto,atual){
    var novos=atual.filter(function(x){return visto.indexOf(x)<0;});
    if(!visto.length){            // primeiro acesso
      if(atual.indexOf('programa')>=0)return {s:[],tema:''};   // aluno do Programa: já tem o fluxo de boas-vindas do método
      return atual.indexOf('eom')>=0?{s:SL.eom,tema:'eom'}:{s:SL.gratis,tema:''};
    }
    var s=[];novos.forEach(function(n){if(n==='tudo')s=s.concat(SL.mudou_tudo);else if(n==='programa')s=s.concat(SL.mudou_programa);else if(n==='eom')s=s.concat(SL.mudou_eom);});
    if(novos.indexOf('tudo')>=0)s=SL.mudou_tudo;   // Gênio já inclui os outros: um slide só
    return {s:s,tema:(novos.length===1&&novos[0]==='eom')?'eom':''};
  }
  async function iniciar(user,depois){
    var t=0;while(!AS().pronto&&t++<20)await new Promise(function(r){setTimeout(r,200);});
    try{
      var S=AS();if(S.admin||window._isAdmin){var q=new URLSearchParams(location.search).get('tutorial');
        if(q&&SL[q]){mostrar(SL[q],q==='eom'?'eom':'',function(){});}return depois&&depois();}
      var atual=pacotes(),m=(user&&user.user_metadata)||{},vs=m.tour!=null?m.tour:LS.g('mi_tour_'+(user&&user.id||''));
      var visto=vs?String(vs).split(',').filter(Boolean):[],r=slidesPara(visto,atual);
      if(visto.join(',')!==atual.join(','))gravar(user,atual);
      if(r.s.length){var feito=false;mostrar(r.s,r.tema,function(){if(!feito){feito=true;depois&&depois();}});return;}
    }catch(e){}
    depois&&depois();
  }
  function abrir(){var p=pacotes(),k=p.indexOf('tudo')>=0?'mudou_tudo':p.indexOf('programa')>=0?'mudou_programa':p.indexOf('eom')>=0?'eom':'gratis';mostrar(SL[k],k==='eom'?'eom':'',function(){});}
  window.EBG_TUT={iniciar:iniciar,abrir:abrir,pacotes:pacotes};
})();
