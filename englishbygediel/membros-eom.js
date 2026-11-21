/* English on Mission · layout compacto "rede social": ícones pequenos, lista de lives e mural em coluna lateral.
   Chamado por membros-app.js depois de desenhar o universo EOM. */
(function(){
  var E=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});};
  var IC=function(n){return '<img src="img/icons/'+n+'.'+('home maratona lives modulos jogos materiais prompts agendar eom culture youtube instagram'.split(' ').indexOf(n)>=0?'webp':'svg')+'" alt="" draggable="false">';};
  var css=document.createElement('style');
  css.textContent=''
  +'#pane-eom .th-hero{padding:16px 18px 14px!important;margin-bottom:12px!important;border-radius:18px}#pane-eom .th-hero .th-marca{font-size:120px!important;top:-14px!important}'
  +'#pane-eom .th-hero .th-k{margin-bottom:4px}#pane-eom .th-hero h1{font-size:clamp(20px,3vw,26px)!important;margin:0 0 8px!important}#pane-eom .th-hero p,#pane-eom .th-hero .th-ver,#pane-eom .th-hero .th-nav{display:none!important}'
  +'#pane-eom .th-hero .th-b1,#pane-eom .th-hero .th-b2{padding:8px 14px;font-size:12.5px;border-radius:12px}'
  +'.eom-q{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;margin:0 0 14px;padding:2px}.eom-q::-webkit-scrollbar{display:none}'
  +'.eom-q button{flex:none;display:flex;flex-direction:column;align-items:center;gap:4px;width:68px;background:none;border:0;color:#f3e2a8;font:inherit;font-size:11px;font-weight:700;cursor:pointer;padding:0}'
  +'.eom-q button img{width:44px;height:44px;border-radius:12px;object-fit:contain;transition:transform .15s,box-shadow .15s}.eom-q button:hover img{transform:scale(1.08);box-shadow:0 8px 18px rgba(0,0,0,.4)}'
  +'.eom-grid{display:grid;grid-template-columns:minmax(0,1fr) 330px;gap:16px;align-items:start}.eom-side{position:sticky;top:8px;min-width:0}'
  +'@media(max-width:980px){.eom-grid{grid-template-columns:1fr}.eom-side{position:static}}'
  +'.eom-lv{background:linear-gradient(180deg,#143a2b,#0f2c21);border:1px solid rgba(212,178,92,.22);border-radius:18px;padding:12px 14px;margin-bottom:14px}'
  +'.eom-lv h3{font-family:"Cormorant Garamond",Georgia,serif;font-size:20px;color:#f3e2a8;margin:0 0 8px}'
  +'.eom-lr{display:grid;grid-template-columns:34px minmax(0,1fr) auto;align-items:center;gap:10px;padding:9px 0;border-top:1px solid rgba(212,178,92,.14)}.eom-lr:first-of-type{border-top:0}'
  +'.eom-lr .ic{width:34px;height:34px;border-radius:10px;background:rgba(212,178,92,.14);display:flex;align-items:center;justify-content:center;font-size:18px}'
  +'.eom-lr b{display:block;font-size:13.5px;color:#fbf5e4;line-height:1.25}.eom-lr small{display:block;font-size:11.5px;color:rgba(245,239,224,.65);margin-top:1px}'
  +'#pane-eom .eom-lr .lv-cd{display:flex!important;flex-wrap:wrap;gap:3px 8px!important;margin-top:3px;padding:0!important;background:none!important;border:0!important}#pane-eom .eom-lr .lv-cd span{display:inline!important;background:none!important;border:0!important;padding:0!important;min-width:0!important;width:auto!important;height:auto!important;font-size:11px!important;color:rgba(245,239,224,.65)!important;text-transform:none!important;letter-spacing:0!important}#pane-eom .eom-lr .lv-cd span:nth-child(4){display:none!important}#pane-eom .eom-lr .lv-cd b{display:inline!important;font-size:12.5px!important;color:#f3e2a8!important;margin-right:2px}'
  +'.eom-lr.first{background:rgba(212,178,92,.08);margin:0 -8px;padding:10px 8px;border-radius:12px;border-top:0}'
  +'.eom-bt{border:0;border-radius:10px;padding:8px 12px;font:inherit;font-size:12px;font-weight:800;cursor:pointer;text-decoration:none;white-space:nowrap;display:inline-flex;align-items:center;gap:6px}'
  +'.eom-bt.on{background:#e11d2e;color:#fff}.eom-bt.on i{width:8px;height:8px;border-radius:50%;background:#fff}.eom-bt.ag{background:rgba(212,178,92,.16);color:#f3e2a8}.eom-bt.lk{background:rgba(255,255,255,.08);color:rgba(245,239,224,.8)}'
  +'#pane-eom .uni-sec{font-size:19px!important;margin:16px 0 8px!important}#pane-eom .uni-grid.uni-std{grid-template-columns:repeat(auto-fill,minmax(250px,1fr))!important;gap:8px!important}'
  +'#pane-eom .uni-std .uni-card{display:grid;grid-template-columns:62px minmax(0,1fr);align-items:center;gap:10px;padding:8px;border-radius:14px}'
  +'#pane-eom .uni-std .uni-card .th{aspect-ratio:1/1!important;width:62px;border-radius:10px;font-size:26px}#pane-eom .uni-std .uni-card .th .tg,#pane-eom .uni-std .uni-card .th .selo{display:none}'
  +'#pane-eom .uni-std .uni-card .bd{padding:0!important;min-width:0}#pane-eom .uni-std .uni-card .tt{font-size:13.5px;line-height:1.25}#pane-eom .uni-std .uni-card .ss{display:none}#pane-eom .uni-std .uni-card .ac{padding-top:2px;font-size:11.5px}'
  +'#pane-eom .uni-hero{padding:14px 16px!important;border-radius:16px}#pane-eom .uni-hero .ht{font-size:16px}#pane-eom .uni-hero .hs{font-size:12.5px}';
  document.head.appendChild(css);

  function lista(){
    var L=(window.LIVES||[]).map(function(lv){return {lv:lv,nx:window.nextOccurrence(lv)};});
    // devocional primeiro; as outras por data
    L.sort(function(a,b){var ad=a.lv.id==='devocional'?0:1,bd=b.lv.id==='devocional'?0:1;return ad-bd||a.nx-b.nx;});
    return L;
  }
  function lives(){
    var livre=window.EBG_LIVRE||function(){return true;};
    return '<div class="eom-lv" id="eom-lv"><h3>Lives</h3>'+lista().map(function(o,i){
      var lv=o.lv,agora=window.isLiveNow(lv),hh=String(lv.startH).padStart(2,'0')+'h'+(lv.startM?String(lv.startM).padStart(2,'0'):'');
      var bt=!livre(lv)?'<button class="eom-bt lk" data-eq="planos">Nos planos</button>'
        :agora?'<a class="eom-bt on" target="_blank" rel="noopener" href="'+E(lv.link)+'"><i></i>Acontecendo agora</a>'
        :'<button class="eom-bt ag" data-eq="lives">Ver Lives</button>';
      return '<div class="eom-lr'+(i===0?' first':'')+'"><span class="ic"><img src="img/icons/lives.webp" alt="" style="width:26px;height:26px"></span><div style="min-width:0"><b>'+E(lv.title)+'</b>'
        +'<small>'+(agora?'Rolando agora':E(window.dayLabel(o.nx))+' às '+hh)+'</small>'+(agora?'':'<div class="lv-cd" data-at="'+o.nx.getTime()+'"></div>')+'</div>'+bt+'</div>';
    }).join('')+'</div>';
  }
  function compor(p){
    if(!p||!window.LIVES)return;
    var hero=p.querySelector('.th-hero');
    var q=document.createElement('div');q.className='eom-q';
    q.innerHTML=[['lives','lives','Lives'],['materiais','materiais','Materiais'],['devocionais','youtube','Devocionais'],['mural','eom','Mural'],['grupo','wa-real','Grupo'],['planos','planos','Planos']]
      .map(function(x){return '<button data-eq="'+x[0]+'">'+IC(x[1])+x[2]+'</button>';}).join('');
    [].forEach.call(p.querySelectorAll('.uni-hero'),function(h){if(/devocional|ao vivo/i.test(h.textContent))h.remove();});
    var grid=document.createElement('div');grid.className='eom-grid';
    var main=document.createElement('div');main.className='eom-main';var side=document.createElement('div');side.className='eom-side';
    var resto=[].filter.call(p.children,function(c){return c!==hero&&c.id!=='eom-mural';});
    main.innerHTML=lives();resto.forEach(function(c){main.appendChild(c);});
    grid.appendChild(main);grid.appendChild(side);
    if(hero){hero.insertAdjacentElement('afterend',q);q.insertAdjacentElement('afterend',grid);}else{p.insertBefore(q,p.firstChild);p.appendChild(grid);}
    if(window.EBG_MURAL)window.EBG_MURAL.montar(side);
    if(window.tickCd)window.tickCd();
    clearInterval(compor._t);compor._t=setInterval(function(){var el=document.getElementById('eom-lv');if(!el){clearInterval(compor._t);return;}
      var n=document.createElement('div');n.innerHTML=lives();el.replaceWith(n.firstChild);if(window.tickCd)window.tickCd();},30000);
  }
  document.addEventListener('click',function(e){
    var b=e.target.closest('.eom-q [data-eq],.eom-lv [data-eq]');if(!b)return;var a=b.dataset.eq;
    if(a==='mural'){var m=document.getElementById('eom-mural');if(m)m.scrollIntoView({behavior:'smooth',block:'start'});}
    else if(a==='grupo'&&window.miGrupoEom)miGrupoEom();
    else if(window.go2)go2(a);
  });
  window.EBG_EOM={compor:compor};
})();
