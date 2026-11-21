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
  +'.eom-q button{flex:none;display:flex;flex-direction:column;align-items:center;gap:4px;width:72px;background:none;border:0;color:#f3e2a8;font:inherit;font-size:11px;font-weight:700;cursor:pointer;padding:0}'
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
  css.textContent+=''
  +'body.theme-eom{--bg:#08160f;--sidebar:#0d261b;--surface:#143a2b;--surface2:#1a4634;--border:rgba(212,178,92,.22);--fg:#fbf5e4;--fg2:rgba(245,239,224,.78);--fg3:rgba(245,239,224,.5);--accent:#d4b25c;--accent2:#f3e2a8;--shadow:0 6px 18px rgba(0,0,0,.35);--shadow-md:0 8px 28px rgba(0,0,0,.45);color-scheme:dark}'
  +'body.theme-eom,body.theme-eom .main,body.theme-eom .content{background:#08160f!important}body.theme-eom .topbar,body.theme-eom .sidebar{background:#0d261b!important;border-color:rgba(212,178,92,.2)!important}'
  +'body.theme-eom #pane-eom{background:transparent!important;border:0!important;box-shadow:none!important;border-radius:0!important;padding:4px 0 30px!important}'
  +'body.theme-eom .back-btn,body.theme-eom .topbar .back-btn{background:#d4b25c!important;color:#14261c!important;border-color:#d4b25c!important}'
  +'.eom-sem{display:grid;grid-template-columns:minmax(150px,230px) minmax(0,1fr);gap:14px;align-items:center;background:linear-gradient(180deg,#143a2b,#0f2c21);border:1px solid rgba(212,178,92,.28);border-radius:18px;padding:12px;margin-bottom:14px;cursor:pointer;text-align:left;color:inherit;font:inherit;width:100%}'
  +'.eom-sem:hover{border-color:#d4b25c;box-shadow:0 12px 28px -12px rgba(0,0,0,.6)}'
  +'.eom-sem .vt{position:relative;aspect-ratio:16/9;border-radius:12px;overflow:hidden;background:#0b2018}.eom-sem .vt img{width:100%;height:100%;object-fit:cover;display:block}'
  +'.eom-sem .pl{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}.eom-sem .pl i{width:44px;height:44px;border-radius:50%;background:rgba(0,0,0,.6);border:2px solid #f3e2a8;display:flex;align-items:center;justify-content:center}.eom-sem .pl svg{width:18px;height:18px;margin-left:3px}'
  +'.eom-sem small{font-size:10.5px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#d4b25c}.eom-sem b{display:block;font-family:"Cormorant Garamond",Georgia,serif;font-size:21px;color:#fbf5e4;line-height:1.2;margin:4px 0 6px}.eom-sem span{font-size:12.5px;color:rgba(245,239,224,.7)}'
  +'.th-vid .th{position:relative}.th-vid .th .pl{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.22)}.th-vid .th .pl i{width:30px;height:30px;border-radius:50%;background:rgba(0,0,0,.6);border:2px solid #f3e2a8;display:flex;align-items:center;justify-content:center}.th-vid .th .pl svg{width:12px;height:12px;margin-left:2px}'
  +'@media(max-width:620px){.eom-sem{grid-template-columns:1fr}}';
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
    q.innerHTML=[['lives','lives','Lives'],['materiais','materiais','Materiais'],['devocionais','youtube','Devocionais'],['mural','eom','Mural'],['cristaos','culture','Filmes cristãos'],['spotify','sp-real','Spotify'],['grupo','wa-real','Grupo'],['planos','planos','Planos']]
      .map(function(x){return '<button data-eq="'+x[0]+'">'+IC(x[1])+x[2]+'</button>';}).join('');
    [].forEach.call(p.querySelectorAll('.uni-hero'),function(h){if(/devocional|ao vivo/i.test(h.textContent))h.remove();});
    var grid=document.createElement('div');grid.className='eom-grid';
    var main=document.createElement('div');main.className='eom-main';var side=document.createElement('div');side.className='eom-side';
    var resto=[].filter.call(p.children,function(c){return c!==hero&&c.id!=='eom-mural';});
    main.innerHTML=lives();resto.forEach(function(c){main.appendChild(c);});
    grid.appendChild(main);grid.appendChild(side);
    if(hero){hero.insertAdjacentElement('afterend',q);q.insertAdjacentElement('afterend',grid);}else{p.insertBefore(q,p.firstChild);p.appendChild(grid);}
    if(window.EBG_MURAL)window.EBG_MURAL.montar(side);
    pregacao(main);capaVideo(main);
    if(window.tickCd)window.tickCd();
    clearInterval(compor._t);compor._t=setInterval(function(){var el=document.getElementById('eom-lv');if(!el){clearInterval(compor._t);return;}
      var n=document.createElement('div');n.innerHTML=lives();el.replaceWith(n.firstChild);if(window.tickCd)window.tickCd();},30000);
  }
  document.addEventListener('click',function(e){
    var b=e.target.closest('.eom-q [data-eq],.eom-lv [data-eq]');if(!b)return;var a=b.dataset.eq;
    if(a==='mural'){var m=document.getElementById('eom-mural');if(m)m.scrollIntoView({behavior:'smooth',block:'start'});}
    else if(a==='grupo'&&window.miGrupoEom)miGrupoEom();
    else if(a==='cristaos'){if(window.EBG_FILMES_UI)EBG_FILMES_UI.setTab('CR');if(window.go2)go2('filmes');}
    else if(a==='spotify')spotify();
    else if(window.go2)go2(a);
  });
  var PLAY='<svg viewBox="0 0 24 24" fill="#f3e2a8"><path d="M7 4.5v15l13-7.5z"/></svg>';
  var cards=function(){return window._CARDS||[];};
  var lid=function(v){return window.EBG_PLAYLIST_ID?EBG_PLAYLIST_ID(v):'';};
  var ytid=function(u){var m=String(u||'').match(/(?:youtu\.be\/|v=|embed\/|live\/)([\w-]{11})/);return m?m[1]:'';};
  function spotify(){
    var c=cards().filter(function(x){return x.universo==='eom'&&/spotify/i.test((x.titulo||'')+' '+(x.valor||''))&&/^https?:/.test(x.valor||'');})[0];
    var el=c&&document.querySelector('#pane-eom [data-unicard="'+c.id+'"]');
    if(el)el.click();else if(c)window.open(c.valor,'_blank','noopener');else if(window.toast)toast('O link da playlist do Spotify ainda não foi cadastrado.');
  }
  async function videos(id){
    var k='eom_pl_'+id;try{var c=JSON.parse(sessionStorage.getItem(k)||'null');if(c&&Date.now()-c.t<6e5)return c.v;}catch(e){}
    var r=await fetch('/.netlify/functions/playlist-videos?list='+encodeURIComponent(id)),j=await r.json();if(!r.ok)throw new Error(j.erro||'erro');
    try{sessionStorage.setItem(k,JSON.stringify({t:Date.now(),v:j.videos}));}catch(e){}return j.videos;
  }
  /* pregação da semana: uma da playlist de pregações, troca sozinha toda semana */
  async function pregacao(main){
    var c=cards().filter(function(x){return x.universo==='eom'&&/prega/i.test(x.titulo||'')&&lid(x.valor);})[0];if(!c)return;
    try{
      var v=await videos(lid(c.valor));if(!v||!v.length)return;
      var sem=Math.floor((Date.now()-Date.UTC(2026,0,4))/(7*864e5)),it=v[((sem%v.length)+v.length)%v.length];
      var b=document.createElement('button');b.className='eom-sem';b.type='button';
      b.innerHTML='<div class="vt"><img alt="" src="https://i.ytimg.com/vi/'+it.id+'/hqdefault.jpg"><div class="pl"><i>'+PLAY+'</i></div></div><div><small>Pregação da semana</small><b>'+E(it.titulo)+'</b><span>Assistir agora'+(it.dur?' · '+E(it.dur):'')+'</span></div>';
      var ce=main.querySelector('[data-unicard="'+c.id+'"]'),trv=ce&&ce.classList.contains('lock');
      if(trv)b.querySelector('span').textContent='Exclusivo para assinantes · toque pra assinar';
      b.onclick=function(){var el=main.querySelector('[data-unicard="'+c.id+'"]');window._plVid=it.id;if(el)el.click();else if(window.EBG_PLAYLIST){window._plVid=null;EBG_PLAYLIST.abrir(c,it.id);}};
      var lv=main.querySelector('#eom-lv');if(lv)lv.insertAdjacentElement('afterend',b);else main.insertBefore(b,main.firstChild);
    }catch(e){}
  }
  /* "Inglês bíblico na prática": a capa vira o primeiro vídeo, com botão de play */
  async function capaVideo(main){
    var c=cards().filter(function(x){return x.universo==='eom'&&/ingl[eê]s b[ií]blico na pr[aá]tica/i.test(x.titulo||'');})[0];if(!c)return;
    try{
      var id='';
      if(c.acao==='curso'&&c.valor){var r=await window._sb.from('mi_lessons').select('youtube_url,ord').eq('module_id',c.valor).order('ord').limit(1);id=ytid(((r.data||[])[0]||{}).youtube_url);}
      else if(lid(c.valor)){var v=await videos(lid(c.valor));id=v&&v[0]?v[0].id:'';}
      else id=ytid(c.valor);
      if(!id)return;
      var el=main.querySelector('[data-unicard="'+c.id+'"]');if(!el)return;var th=el.querySelector('.th');if(!th)return;
      el.classList.add('th-vid');th.innerHTML='<img alt="" src="https://i.ytimg.com/vi/'+id+'/hqdefault.jpg"><div class="pl"><i>'+PLAY+'</i></div>';
    }catch(e){}
  }
  var g0=window.goTo;
  if(g0)window.goTo=function(p,el){var r=g0.call(this,p,el);document.body.classList.toggle('theme-eom',p==='eom');return r;};
  window.EBG_EOM={compor:compor};
})();
