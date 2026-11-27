/* Modo de aluno: a plataforma se adapta a quem entrou.
   · "full"   = aluno do Programa / Gênio / Instituição / admin (tutorial, checklist, tudo)
   · "eom"    = quem veio pelo English on Mission (cadastro.html?u=eom) ou só assina o EOM: entra direto no EOM, menu enxuto, sem tutorial
   · "culture"= idem para o Culture English
   O universo vem do cadastro (user_metadata.origem) ou da compra. Quem comprar o Programa depois vira "full" sozinho.
   Admin pode testar com membros.html?modo=eom ou ?modo=culture (e ?modo=full pra sair). */
(function(){
  var UNI={eom:'eom',culture:'culture'};
  var BLOQ={
    eom:['home','maratona','modulos','jogos','bussola','prisma','prompts','culture','viagens','indicar','agendar','mt10'],
    culture:['home','maratona','bussola','prisma','prompts','eom','viagens','indicar','agendar','mt10']
  };
  var PERMITE={eom:['eom','lives','materiais','planos','filmes','plano'],culture:['culture','lives','filmes','jogos','materiais','planos','plano']};
  var BNAV={
    eom:[['eom','eom.webp','Início'],['lives','lives.webp','Lives'],['materiais','materiais.webp','Materiais'],['menu','menu.svg','Menu']],
    culture:[['culture','culture.webp','Início'],['lives','lives.webp','Lives'],['jogos','jogos.webp','Jogos'],['menu','menu.svg','Menu']]
  };
  var AS=function(){return (window.EBG_ACESSO||{}).estado||{};};
  var lsGet=function(k){try{return localStorage.getItem(k);}catch(e){return null;}},lsSet=function(k,v){try{v==null?localStorage.removeItem(k):localStorage.setItem(k,v);}catch(e){}};
  var q=new URLSearchParams(location.search).get('modo');if(q){try{sessionStorage.setItem('mi_modo_teste',q);}catch(e){}}
  var teste=function(){try{return sessionStorage.getItem('mi_modo_teste')||'';}catch(e){return '';}};
  var origem=lsGet('mi_origem')||'';
  var EOM_RX=/english on mission|mission|eom/i,PROG_RX=/inteligente|programa|g[eê]nio|institui/i;

  function doMeta(user){
    var m=(user&&user.user_metadata)||{},o=String(m.origem||'').toLowerCase();
    if(UNI[o])return o;
    var p=String(m.produto||'');
    if(EOM_RX.test(p)&&!PROG_RX.test(p))return 'eom';
    return '';
  }
  /* resposta imediata na entrada (antes das compras carregarem) */
  function rapido(user){
    var o=doMeta(user);if(o){origem=o;lsSet('mi_origem',o);}else if(user){origem='';lsSet('mi_origem',null);}
    var t=teste();
    if(t&&t!=='full'&&UNI[t]&&AS().admin)return t;
    return origem||'';
  }
  function modo(){
    var S=AS(),t=teste();
    if(S.admin||window._isAdmin)return UNI[t]?t:'full';
    if(S.programa||S.tudo)return 'full';
    if(UNI[origem])return origem;
    if(S.pronto){
      var cs=S.compras||[],eom=cs.some(function(c){return EOM_RX.test(c.produto||'');}),prog=cs.some(function(c){return PROG_RX.test(c.produto||'')&&!EOM_RX.test(c.produto||'');});
      if(eom&&!prog)return 'eom';
    }
    return 'full';
  }
  function alvoPill(p){return [].filter.call(document.querySelectorAll('.nav-pill'),function(n){return (n.getAttribute('onclick')||'').indexOf("goTo('"+p+"'")>=0;})[0];}

  var css=document.createElement('style');
  css.textContent='body.modo-eom .right-rail,body.modo-culture .right-rail{display:none!important}body.modo-eom .mi-esconde,body.modo-culture .mi-esconde{display:none!important}';
  document.head.appendChild(css);

  var g0=window.goTo;
  if(g0)window.goTo=function(p,el){var m=modo();if(m!=='full'&&BLOQ[m].indexOf(p)>=0){p=UNI[m];el=alvoPill(p)||el;}return g0.call(this,p,el);};

  var bnavOrig=null,ultimo='';
  function aplicar(){
    var m=modo(),sig=m+'|'+!!AS().pronto+'|'+document.querySelectorAll('.nav-pill').length;
    if(sig===ultimo)return;ultimo=sig;
    document.body.classList.toggle('modo-eom',m==='eom');document.body.classList.toggle('modo-culture',m==='culture');
    // menu lateral
    var pills=[].slice.call(document.querySelectorAll('.sidebar .nav-pill'));
    pills.forEach(function(n){
      var oc=n.getAttribute('onclick')||'',mt=oc.match(/goTo\('([^']+)'/),alvo=mt?mt[1]:(/openSettings/.test(oc)?'__cfg':'__x');
      var ok=m==='full'||alvo==='__cfg'||PERMITE[m].indexOf(alvo)>=0||(alvo==='admin');
      n.classList.toggle('mi-esconde',!ok);
    });
    [].forEach.call(document.querySelectorAll('.sidebar .nav-section'),function(s){
      var el=s.nextElementSibling,vis=false;while(el&&!el.classList.contains('nav-section')){if(el.classList.contains('nav-pill')&&!el.classList.contains('mi-esconde')&&el.style.display!=='none')vis=true;el=el.nextElementSibling;}
      s.classList.toggle('mi-esconde',m!=='full'&&!vis);
    });
    // barra do celular
    var bn=document.getElementById('mi-bnav');
    if(bn){
      if(bnavOrig===null)bnavOrig=bn.innerHTML;
      if(m==='full'){bn.innerHTML=bnavOrig;bn.style.gridTemplateColumns='';}
      else{bn.style.gridTemplateColumns='repeat(4,1fr)';bn.innerHTML=BNAV[m].map(function(x){return '<button data-bn="'+x[0]+'"><span><img class="ic3d" src="img/icons/'+x[1]+'" alt="" draggable="false"></span>'+x[2]+'</button>';}).join('');}
    }
    // quem foi reconhecido depois (pela compra) e ainda está na entrada: leva pro universo
    if(m!=='full'){var en=document.getElementById('mi-entry');if(en&&en.classList.contains('on')){en.classList.remove('on','vis');en.innerHTML='';}
      var pg=document.querySelector('.pane.active'),id=pg?pg.id.replace('pane-',''):'';if(!id||BLOQ[m].indexOf(id)>=0)irPara(m);}
  }
  function irPara(m,n){
    n=n||0;var uni=UNI[m];if(!uni)return;
    if(document.getElementById('pane-'+uni)&&alvoPill(uni)){window.goTo(uni,alvoPill(uni));return;}
    if(n<30)setTimeout(function(){irPara(m,n+1);},200);
  }
  setInterval(aplicar,700);
  window.EBG_MODO={rapido:rapido,modo:modo,irPara:irPara,aplicar:function(){ultimo='';aplicar();}};
})();
