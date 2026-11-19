/* Efeitos da tela de entrada: som sintetizado (sem arquivos) proporcional ao movimento de cada ícone + transição de zoom ao escolher. */
(function(){
  var LSK='mi_som',ctx=null,mestre=null,dwell=null,ultimo=null;
  function ligado(){try{return localStorage.getItem(LSK)!=='0';}catch(e){return true;}}
  function setLigado(v){try{localStorage.setItem(LSK,v?'1':'0');}catch(e){}pintaBotao();}
  function ac(){
    if(!ctx){var C=window.AudioContext||window.webkitAudioContext;if(!C)return null;try{ctx=new C();}catch(e){return null;}
      mestre=ctx.createGain();mestre.gain.value=.5;var comp=ctx.createDynamicsCompressor();mestre.connect(comp);comp.connect(ctx.destination);}
    if(ctx.state==='suspended')ctx.resume().catch(function(){});
    return ctx;
  }
  /* o navegador só libera áudio depois do 1º toque/clique */
  ['pointerdown','keydown','touchend'].forEach(function(ev){document.addEventListener(ev,function(){if(ligado())ac();},{passive:true,once:false});});
  var busAtual=null;
  function novoBus(){ // um som por vez: o anterior some rápido
    var c=ac();if(!c)return null;
    if(busAtual){try{busAtual.gain.cancelScheduledValues(c.currentTime);busAtual.gain.setTargetAtTime(0,c.currentTime,.03);}catch(e){}}
    var g=c.createGain();g.gain.value=1;g.connect(mestre);busAtual=g;return g;
  }
  function tom(bus,f,t,d,tipo,vol,fim){
    var c=ctx,o=c.createOscillator(),g=c.createGain();o.type=tipo||'sine';o.frequency.setValueAtTime(f,c.currentTime+t);
    if(fim)o.frequency.exponentialRampToValueAtTime(Math.max(20,fim),c.currentTime+t+d);
    g.gain.setValueAtTime(0.0001,c.currentTime+t);g.gain.exponentialRampToValueAtTime(vol||.2,c.currentTime+t+Math.min(.02,d/3));g.gain.exponentialRampToValueAtTime(0.0001,c.currentTime+t+d);
    o.connect(g);g.connect(bus);o.start(c.currentTime+t);o.stop(c.currentTime+t+d+.05);
  }
  var bufRuido=null;
  function ruido(bus,t,d,tipo,f0,f1,vol,q){
    var c=ctx;if(!bufRuido){bufRuido=c.createBuffer(1,c.sampleRate*2,c.sampleRate);var a=bufRuido.getChannelData(0);for(var i=0;i<a.length;i++)a[i]=Math.random()*2-1;}
    var s=c.createBufferSource();s.buffer=bufRuido;s.loop=true;var f=c.createBiquadFilter();f.type=tipo||'bandpass';f.Q.value=q||1;
    f.frequency.setValueAtTime(f0,c.currentTime+t);if(f1)f.frequency.exponentialRampToValueAtTime(f1,c.currentTime+t+d);
    var g=c.createGain();g.gain.setValueAtTime(0.0001,c.currentTime+t);g.gain.exponentialRampToValueAtTime(vol||.2,c.currentTime+t+Math.min(.05,d/3));g.gain.exponentialRampToValueAtTime(0.0001,c.currentTime+t+d);
    s.connect(f);f.connect(g);g.connect(bus);s.start(c.currentTime+t,Math.random());s.stop(c.currentTime+t+d+.05);
  }
  var R={
    casa:function(b){tom(b,196,0,.14,'sine',.3,140);tom(b,196,.2,.14,'sine',.3,140);tom(b,523,.5,.6,'triangle',.12);tom(b,659,.62,.7,'triangle',.1);},
    acordar:function(b){[0,.22,.4].forEach(function(t,i){tom(b,1500+i*300,t,.13,'sine',.1,2400+i*300);});tom(b,392,.7,.7,'triangle',.1);tom(b,523,.8,.7,'triangle',.1);tom(b,659,.9,.6,'triangle',.09);},
    banho:function(b){ruido(b,0,1.4,'bandpass',3200,2500,.22,.6);ruido(b,.1,1.2,'highpass',4500,5000,.08,.5);},
    dormir:function(b){tom(b,392,0,.9,'sine',.16);tom(b,330,.45,1,'sine',.14);tom(b,262,.9,.9,'sine',.12);},
    carro:function(b){tom(b,70,0,1.4,'sawtooth',.14,210);tom(b,72,0,1.4,'square',.05,215);ruido(b,0,1.3,'lowpass',250,900,.08,.7);},
    transporte:function(b){tom(b,311,0,.34,'sawtooth',.09);tom(b,415,0,.34,'sawtooth',.07);tom(b,311,.5,.5,'sawtooth',.09);tom(b,415,.5,.5,'sawtooth',.07);},
    trabalho:function(b){for(var i=0;i<9;i++)ruido(b,i*.13+Math.random()*.03,.04,'bandpass',2800+Math.random()*1500,null,.12,2);tom(b,1100,1.2,.2,'sine',.08);},
    almoco:function(b){tom(b,2637,0,.7,'sine',.12);tom(b,3951,.02,.5,'sine',.06);tom(b,2093,.5,.7,'sine',.1);},
    louca:function(b){for(var i=0;i<7;i++)tom(b,500+Math.random()*500,i*.17,.09,'sine',.1,1100+Math.random()*600);ruido(b,0,1.2,'bandpass',2400,3000,.05,.5);},
    limpeza:function(b){ruido(b,0,.5,'bandpass',600,2400,.2,.8);ruido(b,.55,.5,'bandpass',2400,600,.2,.8);ruido(b,1.05,.4,'bandpass',700,2000,.14,.8);},
    cozinha:function(b){ruido(b,0,1.1,'highpass',5500,6500,.13,.4);tom(b,1568,1.2,.45,'sine',.1);},
    caminhada:function(b){for(var i=0;i<4;i++){tom(b,95,i*.34,.1,'sine',.3,55);ruido(b,i*.34,.07,'lowpass',500,null,.14,.7);}},
    academia:function(b){tom(b,180,0,.2,'square',.1,120);ruido(b,0,.12,'bandpass',3500,null,.18,2);tom(b,150,.55,.25,'square',.1,95);ruido(b,.55,.14,'bandpass',3000,null,.18,2);},
    fila:function(b){for(var i=0;i<4;i++)tom(b,i%2?900:1200,i*.3,.05,'square',.07);tom(b,784,1.25,.5,'sine',.14);tom(b,1047,1.3,.6,'sine',.1);},
    sofa:function(b){tom(b,90,0,.22,'sine',.35,50);ruido(b,.05,.9,'lowpass',700,300,.1,.6);tom(b,110,.1,.9,'sine',.05,80);},
    '5min':function(b){for(var i=0;i<6;i++)tom(b,1800,i*.2,.025,'square',.06);tom(b,1320,1.3,.15,'sine',.12);tom(b,1320,1.45,.15,'sine',.12);},
    foco:function(b){tom(b,880,0,.12,'sine',.12);tom(b,1320,.25,.12,'sine',.12);tom(b,1760,.5,.9,'sine',.16);ruido(b,.5,.05,'bandpass',3000,null,.15,2);},
    viagem:function(b){ruido(b,0,1.2,'bandpass',500,2600,.2,.7);tom(b,660,1.15,.3,'sine',.1);tom(b,523,1.35,.5,'sine',.1);},
    mercado:function(b){ruido(b,0,.6,'bandpass',1800,2500,.12,.4);ruido(b,.1,.5,'bandpass',900,1400,.1,.6);tom(b,2093,.9,.6,'sine',.13);tom(b,2637,.93,.5,'sine',.09);},
    igreja:function(b){[[220,.18],[440,.12],[550,.08],[660,.07],[880,.05]].forEach(function(p){tom(b,p[0],0,1.5,'sine',p[1]);});},
    familia:function(b){[262,330,392].forEach(function(f,i){tom(b,f,i*.12,1.2,'triangle',.11);});tom(b,523,.4,1,'sine',.07);}
  };
  function som(nome){
    if(!ligado()||!R[nome])return;var c=ac();if(!c||c.state!=='running')return;
    var b=novoBus();if(b)try{R[nome](b);}catch(e){}
  }
  function whoosh(){if(!ligado())return;var c=ac();if(!c||c.state!=='running')return;var b=novoBus();if(!b)return;ruido(b,0,.55,'bandpass',300,3200,.22,.8);tom(b,330,0,.5,'sine',.08,880);tom(b,988,.5,.3,'sine',.09);tom(b,1319,.56,.5,'sine',.07);}
  function nomeDe(btn){var f=btn.querySelector('.fg');if(!f)return '';var m=(f.className||'').match(/a-([\w]+)/);return m?m[1]:'';}
  /* som ao passar o mouse (só se ficar parado um instante, pra não virar barulheira) */
  document.addEventListener('mouseover',function(e){
    var b=e.target.closest&&e.target.closest('#mi-entry .mi-ctx button');if(!b||b===ultimo)return;
    ultimo=b;clearTimeout(dwell);dwell=setTimeout(function(){som(nomeDe(b));},140);
  });
  document.addEventListener('mouseout',function(e){var b=e.target.closest&&e.target.closest('#mi-entry .mi-ctx button');if(b&&!b.contains(e.relatedTarget)){if(ultimo===b)ultimo=null;clearTimeout(dwell);}});
  document.addEventListener('touchstart',function(e){var b=e.target.closest&&e.target.closest('#mi-entry .mi-ctx button');if(b)som(nomeDe(b));},{passive:true});
  /* botão liga/desliga */
  function pintaBotao(){var x=document.getElementById('mi-som');if(!x)return;var t=ligado()?'🔊':'🔇';if(x.textContent!==t){x.textContent=t;x.title=ligado()?'Som ligado (toque pra desligar)':'Som desligado';x.setAttribute('aria-pressed',ligado()?'true':'false');}}
  new MutationObserver(pintaBotao).observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('click',function(e){var x=e.target.closest&&e.target.closest('#mi-som');if(!x)return;e.stopPropagation();setLigado(!ligado());if(ligado()){ac();setTimeout(function(){whoosh();},60);}});
  /* transição: o card cresce até cobrir a tela, depois some revelando a plataforma */
  function zoom(btn,meio){
    var reduz=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduz||!btn||!btn.animate){meio();return;}
    var r=btn.getBoundingClientRect(),cor=getComputedStyle(btn).getPropertyValue('--c')||'#1b1f4b';
    var z=document.createElement('div');z.id='mi-zoom';
    z.style.cssText='position:fixed;z-index:9500;left:'+r.left+'px;top:'+r.top+'px;width:'+r.width+'px;height:'+r.height+'px;border-radius:26px;overflow:hidden;background:transparent;pointer-events:none;box-shadow:0 20px 60px rgba(0,0,0,.5)';
    var ly=btn.querySelector('.ly'),cl=null;if(ly){cl=ly.cloneNode(true);cl.style.cssText='position:absolute;inset:0;transform:scale(1.06)';z.appendChild(cl);}
    document.body.appendChild(z);whoosh();
    var vw=window.innerWidth,vh=window.innerHeight,big=Math.max(vw,vh)*1.15;
    var a=z.animate([{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px',borderRadius:'26px'},{left:(vw-big)/2+'px',top:(vh-big)/2+'px',width:big+'px',height:big+'px',borderRadius:'0px'}],{duration:560,easing:'cubic-bezier(.65,0,.35,1)',fill:'forwards'});
    if(cl)cl.animate([{transform:'scale(1.06)'},{transform:'scale(1.45)'}],{duration:560,easing:'cubic-bezier(.65,0,.35,1)',fill:'forwards'});
    a.onfinish=function(){
      meio();
      setTimeout(function(){var f=z.animate([{opacity:1},{opacity:0}],{duration:520,easing:'ease-out',fill:'forwards'});f.onfinish=function(){z.remove();};},420);
    };
  }
  var st=document.createElement('style');st.textContent='#mi-zoom .ly img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}';document.head.appendChild(st);
  window.EBG_FX={som:som,zoom:zoom,whoosh:whoosh,pintaBotao:pintaBotao,ligado:ligado};
})();
