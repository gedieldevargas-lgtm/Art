/* Área de membros: o que cada aluno comprou, cadeados do Programa e painel "Gerenciar" (só admin).
   Precisa do supabase/membros.sql rodado no projeto dos membros. Sem ele, tudo fica como antes (sem cadeado). */
(function(){
  var sb=window._sb||_sb, PANES_PROGRAMA=['maratona','lives','modulos'];
  var S={pronto:false,ok:false,admin:false,programa:false,cfg:{programa:[],jogosGratis:[],checkout:'',eom:[],checkoutEom:''},mats:[],compras:[],meta:''};
  var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});};
  var tem=function(trecho){trecho=(trecho||'').toLowerCase().trim();if(!trecho)return false;
    return S.compras.some(function(c){return (c.produto||'').toLowerCase().indexOf(trecho)>=0;})||S.meta.toLowerCase().indexOf(trecho)>=0;};
  var livre=function(){return !S.ok||S.programa||S.admin;};           // vê tudo
  var jogoLivre=function(n){return livre()||(S.cfg.jogosGratis||[]).indexOf(n)>=0;};
  var matLivre=function(m){return livre()||m.tipo==='gratis'||(m.tipo==='produto'&&tem(m.produto));};

  var css=document.createElement('style');
  css.textContent='.trava{position:relative}.trava .game-app-sq{filter:grayscale(.7) brightness(.8)}.trava:after{content:"🔒";position:absolute;top:-4px;right:6px;font-size:15px}'
   +'.nav-pill.trancado:after{content:"🔒";margin-left:auto;font-size:11px;opacity:.7}'
   +'.pw-ov{position:fixed;inset:0;z-index:900;background:rgba(8,10,20,.62);backdrop-filter:blur(6px);display:none;align-items:center;justify-content:center;padding:18px}.pw-ov.open{display:flex}'
   +'.pw{background:var(--surface,#fff);color:var(--fg,#111);border-radius:22px;max-width:400px;width:100%;padding:26px 22px;text-align:center;box-shadow:0 30px 80px rgba(0,0,0,.35)}'
   +'.pw h3{font-size:20px;font-weight:800;margin:8px 0 6px}.pw p{font-size:13.5px;line-height:1.5;color:var(--fg2,#667);margin-bottom:14px}.pw ul{text-align:left;font-size:13px;line-height:1.9;margin:0 0 16px 4px;list-style:none}'
   +'.pw a.ir{display:block;background:linear-gradient(135deg,#4f6ef7,#8b5cf6);color:#fff;font-weight:800;padding:14px;border-radius:14px;text-decoration:none;font-size:15px}.pw button.nao{margin-top:10px;background:none;border:none;color:var(--fg2,#667);font-size:12.5px;cursor:pointer}'
   +'.mat-sec{grid-column:1/-1;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--fg2,#667);margin:10px 0 0}'
   +'.ger{background:var(--surface,#fff);color:var(--fg,#111);border-radius:20px;max-width:720px;width:100%;max-height:88vh;overflow:auto;padding:22px;text-align:left}.ger h3{font-size:18px;font-weight:800;margin-bottom:4px}.ger h4{font-size:13px;font-weight:800;margin:20px 0 8px}'
   +'.ger small{color:var(--fg2,#667);font-size:12px;display:block;margin-bottom:8px;line-height:1.45}.ger input,.ger select{border:1.5px solid var(--border,#dde);background:var(--surface2,#f6f7fb);color:inherit;border-radius:10px;padding:9px 10px;font-size:13px;width:100%}'
   +'.ger .chips{display:flex;flex-wrap:wrap;gap:6px}.ger .chip{border:1.5px solid var(--border,#dde);border-radius:99px;padding:6px 12px;font-size:12px;cursor:pointer;user-select:none}.ger .chip.on{background:#10b981;border-color:#10b981;color:#fff;font-weight:700}'
   +'.ger .mrow{border:1.5px solid var(--border,#dde);border-radius:14px;padding:12px;margin-bottom:10px;display:grid;grid-template-columns:1fr 1fr;gap:8px}.ger .mrow .full{grid-column:1/-1}.ger .bt{background:#4f6ef7;color:#fff;border:none;border-radius:10px;padding:10px 14px;font-weight:700;font-size:13px;cursor:pointer}.ger .bt.g{background:var(--surface2,#eef);color:inherit}.ger .bt.r{background:none;color:#ef4444}'
   +'.dev-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px}.dev{cursor:pointer;border-radius:14px;overflow:hidden;background:var(--surface);border:1px solid var(--border);transition:transform .15s}.dev:hover{transform:translateY(-3px)}.dev img{width:100%;aspect-ratio:16/9;object-fit:cover;display:block}.dev b{display:block;padding:10px 12px;font-size:13px;line-height:1.3}'
   +'.eom-of{background:linear-gradient(135deg,#4f6ef7,#8b5cf6);color:#fff;border-radius:20px;padding:24px 22px;max-width:520px}.eom-of h3{font-size:20px;font-weight:800;margin-bottom:6px}.eom-of ul{list-style:none;margin:14px 0 18px;font-size:14px;line-height:1.9}.eom-of a{display:block;text-align:center;background:#fff;color:#4f6ef7;font-weight:800;padding:14px;border-radius:14px;text-decoration:none}'
   +'@media(max-width:560px){.ger .mrow{grid-template-columns:1fr}}';
  document.head.appendChild(css);

  var ov=document.createElement('div');ov.className='pw-ov';ov.id='pw-ov';document.body.appendChild(ov);
  ov.addEventListener('click',function(e){if(e.target===ov||e.target.closest('[data-fechar]')){ov.classList.remove('open');ov.innerHTML='';}});

  window.paywall=function(oque){
    ov.innerHTML='<div class="pw"><div style="font-size:40px">🔒</div><h3>'+esc(oque||'Isso')+' faz parte do Programa</h3>'
      +'<p>Você já tem acesso aos seus materiais e às ferramentas gratuitas. Com o Programa de Acompanhamento você libera o app inteiro:</p>'
      +'<ul><li>✅ Maratona diária com tarefas guiadas</li><li>✅ Lives e módulos completos</li><li>✅ Todos os jogos e materiais</li><li>✅ Acompanhamento de perto</li></ul>'
      +'<a class="ir" target="_blank" rel="noopener" href="'+esc(S.cfg.checkout||'https://pay.kiwify.com.br/CohRPDI')+'">Quero liberar tudo</a>'
      +'<button class="nao" data-fechar>Agora não</button></div>';
    ov.classList.add('open');
  };

  // ───── Devocionais (English On Mission): lista de vídeos só pra quem assina
  var temEom=function(){return livre()||(S.cfg.eom||[]).some(tem);};
  function criarDev(){
    if(document.getElementById('pane-devocionais'))return;
    var ref=[].filter.call(document.querySelectorAll('.nav-pill'),function(n){return (n.getAttribute('onclick')||'').indexOf("'materiais'")>=0;})[0];
    if(!ref)return;
    var pill=document.createElement('div');pill.className='nav-pill';pill.setAttribute('onclick',"goTo('devocionais',this)");
    pill.innerHTML='<span class="nav-icon">🙏</span><span>Devocionais</span>';ref.insertAdjacentElement('afterend',pill);
    var pane=document.createElement('div');pane.className='pane';pane.id='pane-devocionais';
    document.getElementById('pane-materiais').insertAdjacentElement('afterend',pane);
    window.TITLES=window.TITLES||{};window.TITLES.devocionais='Devocionais';
  }
  async function desenharDev(){
    var p=document.getElementById('pane-devocionais');if(!p)return;
    var cab='<div style="font-size:21px;font-weight:800;margin-bottom:4px">English On Mission</div><div style="font-size:13px;color:var(--fg2);margin-bottom:18px">Aulas e devocionais ao vivo, toda semana</div>';
    if(!temEom()){
      p.innerHTML=cab+'<div class="eom-of"><div style="font-size:34px">🙏</div><h3>English on Mission Universo</h3><div style="opacity:.9;font-size:14px">Assinatura de '+esc(S.cfg.precoEom||'R$ 25/mês')+' com tudo incluído:</div>'
        +'<ul><li>✅ Devocionais ao vivo, toda semana</li><li>✅ Aulas de Inglês com a Bíblia</li><li>✅ E-book de devocionais</li><li>✅ Bíblia linear: 1, 2 e 3 João</li><li>✅ Conteúdos novos que vierem</li></ul>'
        +'<a target="_blank" rel="noopener" href="'+esc(S.cfg.checkoutEom||'https://pay.kiwify.com.br/oIjfTK8')+'">Assinar English on Mission</a></div>';
      return;
    }
    p.innerHTML=cab+'<div style="color:var(--fg2);font-size:13px">Carregando…</div>';
    var r=await sb.from('devocionais').select('*').order('ordem');
    var l=r.data||[];
    p.innerHTML=cab+(l.length?'<div class="dev-grid">'+l.map(function(v){return '<div class="dev" data-vid="'+esc(v.video_id)+'"><img loading="lazy" alt="" src="'+esc(v.capa||'https://i.ytimg.com/vi/'+v.video_id+'/hqdefault.jpg')+'"><b>'+esc(v.titulo)+'</b></div>';}).join('')+'</div>'
      :'<div style="color:var(--fg2);font-size:13px">Os vídeos aparecem aqui sozinhos, logo depois de cada live.</div>');
  }
  document.addEventListener('click',function(e){
    var d=e.target.closest('.dev[data-vid]');if(!d)return;
    ov.innerHTML='<div class="pw" style="max-width:780px;padding:14px"><div style="aspect-ratio:16/9;border-radius:12px;overflow:hidden;background:#000"><iframe style="width:100%;height:100%;border:0" allow="autoplay; encrypted-media; fullscreen" allowfullscreen src="https://www.youtube-nocookie.com/embed/'+encodeURIComponent(d.dataset.vid)+'?autoplay=1&rel=0"></iframe></div>'
      +'<h3 style="font-size:15px;margin:12px 0 0">'+esc(d.querySelector('b').textContent)+'</h3><button class="nao" data-fechar>Fechar</button></div>';
    ov.classList.add('open');
  });

  // ───── navegação: abas do Programa trancadas
  var goToOrig=window.goTo;
  window.goTo=function(page,el){
    if(PANES_PROGRAMA.indexOf(page)>=0&&!livre()){paywall((window.TITLES&&TITLES[page])||'Essa área');return;}
    var r=goToOrig(page,el);if(page==='devocionais')desenharDev();return r;
  };
  function marcarNav(){
    document.querySelectorAll('.nav-pill').forEach(function(n){
      var m=(n.getAttribute('onclick')||'').match(/goTo\('(\w+)'/);
      n.classList.toggle('trancado',!!(m&&((PANES_PROGRAMA.indexOf(m[1])>=0&&!livre())||(m[1]==='devocionais'&&!temEom()))));
    });
  }

  // ───── jogos
  window.renderGames=function(){
    var g=document.getElementById('game-grid');g.innerHTML='';
    var vis=GAMES.filter(function(gm){return activeFilter==='all'||gm.tags.indexOf(activeFilter)>=0;});
    if(!vis.length){g.innerHTML='<div style="color:var(--fg2);font-size:13px;grid-column:1/-1;padding:20px 0;text-align:center">Nenhum jogo nesse filtro ainda.</div>';return;}
    vis.sort(function(a,b){return (jogoLivre(b.name)?1:0)-(jogoLivre(a.name)?1:0);});
    vis.forEach(function(gm,i){
      var ok=jogoLivre(gm.name),d=document.createElement('div');
      d.className='game-app-icon'+(ok?'':' trava');d.style.animationDelay=(i*.04)+'s';
      d.onclick=function(){ok?openSheet(gm):paywall('O jogo "'+gm.name+'"');};
      d.innerHTML='<div class="game-app-sq" style="background:'+gm.bg+'">'+gm.emoji+'</div><div class="game-app-name">'+esc(gm.name)+'</div>';
      g.appendChild(d);
    });
  };

  // ───── materiais
  var renderMatAntigo=window.renderMat.__antigo||window.renderMat;
  window.renderMat=function(){
    if(!S.ok||!S.mats.length){return renderMatAntigo();}
    var g=document.getElementById('mat-grid'),tab=window.activeMatTab||'todos',h='';
    var grupo={gratis:[],incluido:[],pago:[]};
    S.mats.forEach(function(m){grupo[m.tipo==='gratis'?'gratis':matLivre(m)?'incluido':'pago'].push(m);});
    var card=function(m){
      var ok=matLivre(m),prog=m.tipo==='programa';
      var selo=m.tipo==='gratis'?'<span class="mat-badge-free">GRATUITO</span>':ok?'<span class="mat-badge-incl">SEU</span>':'<span class="mat-badge-paid">'+(prog?'🔒 PROGRAMA':'PRODUTO')+'</span>';
      var bt=ok?'<button class="mat-btn mat-btn-dl" data-abrir="'+m.id+'">Acessar</button>'
        :'<button class="mat-btn mat-btn-buy" data-comprar="'+m.id+'">'+(prog?'Liberar com o Programa':'Quero esse')+'</button>';
      return '<div class="mat-card"><div class="mat-thumb" style="background:linear-gradient(135deg,#4f6ef7,#8b5cf6);'+(ok?'':'filter:grayscale(.6)')+'"><span style="font-size:28px">'+esc(m.icone||'📘')+'</span></div><div class="mat-body"><div class="mat-name">'+esc(m.nome)+'</div><div class="mat-desc">'+esc(m.descricao)+'</div>'+selo+bt+'</div></div>';
    };
    var sec=function(t,l){return l.length?'<div class="mat-sec">'+t+'</div>'+l.map(card).join(''):'';};
    if(tab==='todos')h=sec('Seus materiais',grupo.incluido)+sec('Gratuitos',grupo.gratis)+sec('Para você adquirir',grupo.pago);
    else h=(grupo[tab]||[]).map(card).join('');
    g.innerHTML=h||'<div style="color:var(--fg2);font-size:13px;grid-column:1/-1;padding:20px 0;text-align:center">Nenhum material nessa categoria.</div>';
  };
  document.addEventListener('click',async function(e){
    var a=e.target.closest('[data-abrir]'),c=e.target.closest('[data-comprar]');
    if(a){
      var r=await sb.from('material_links').select('link').eq('material_id',a.dataset.abrir).maybeSingle();
      if(r.data&&r.data.link)window.open(r.data.link,'_blank','noopener');else toast('Esse material ainda está sem link. Avise o Gediel 🙏');
    }
    if(c){
      var m=S.mats.filter(function(x){return x.id===c.dataset.comprar;})[0];if(!m)return;
      if(m.tipo==='programa'||!m.checkout)paywall('"'+m.nome+'"');else window.open(m.checkout,'_blank','noopener');
    }
  });

  // ───── carregar dados do aluno
  async function carregar(){
    var u=(await sb.auth.getUser()).data.user;if(!u){S.ok=false;return;}
    S.meta=(u.user_metadata&&u.user_metadata.produto)||'';
    var r=await Promise.all([sb.from('acesso').select('dados').eq('id','cfg').maybeSingle(),sb.from('compras').select('produto,produto_id,pedido,email,created_at'),
      sb.from('materiais').select('*').order('ordem').order('created_at'),sb.rpc('sou_admin')]);
    S.ok=!r[0].error&&!!r[0].data;                       // sem as tabelas: nada trancado
    if(S.ok){S.cfg=Object.assign({programa:[],jogosGratis:[],checkout:'',eom:[],checkoutEom:''},r[0].data.dados||{});}
    S.admin=r[3].data===true;
    S.todasCompras=r[1].data||[];
    S.compras=S.todasCompras.filter(function(c){return (c.email||'').toLowerCase()===(u.email||'').toLowerCase();});
    S.mats=r[2].data||[];
    S.programa=(S.cfg.programa||[]).some(tem);
    S.pronto=true;pintar();
  }
  function pintar(){
    criarDev();marcarNav();renderGames();renderMat();
    var b=document.getElementById('btn-gerenciar');
    if(S.admin&&!b){
      var s=document.querySelector('#settings-overlay .modal-body');
      b=document.createElement('button');b.id='btn-gerenciar';b.className='set-btn set-btn-primary';b.textContent='🛠 Gerenciar acessos e materiais';b.onclick=abrirGer;
      s.insertBefore(b,s.firstChild);
    }
    if(!livre()&&PANES_PROGRAMA.indexOf(window.currentPage)>=0)goToOrig('home',document.querySelector('.nav-pill'));
  }

  // ───── painel do admin
  var go=document.createElement('div');go.className='pw-ov';go.id='ger-ov';document.body.appendChild(go);
  go.addEventListener('click',function(e){if(e.target===go)go.classList.remove('open');});
  function abrirGer(){
    if(window.closeSettings)closeSettings();
    var tipos={gratis:'Gratuito (todo mundo com login)',produto:'Produto (só quem comprou)',programa:'Só no Programa'};
    go.innerHTML='<div class="ger"><div style="display:flex;justify-content:space-between;align-items:center"><h3>🛠 Gerenciar</h3><button class="bt g" data-x>Fechar</button></div>'
      +'<h4>Jogos gratuitos</h4><small>Verde = liberado pra qualquer aluno. O resto aparece com cadeado pra quem não tem o Programa.</small><div class="chips">'
      +GAMES.map(function(g){return '<span class="chip'+((S.cfg.jogosGratis||[]).indexOf(g.name)>=0?' on':'')+'" data-jogo="'+esc(g.name)+'">'+g.emoji+' '+esc(g.name)+'</span>';}).join('')+'</div>'
      +'<h4>Produtos que liberam TUDO</h4><small>Um trecho do nome do produto na Kiwify, separados por vírgula.</small><input id="g-prog" value="'+esc((S.cfg.programa||[]).join(', '))+'">'
      +'<h4>Produtos que liberam os Devocionais</h4><small>Um trecho do nome na Kiwify (ex.: English on Mission), separado por vírgula. Quem tem o Programa também vê.</small><input id="g-eom" value="'+esc((S.cfg.eom||[]).join(', '))+'">'
      +'<h4>Link de assinatura dos Devocionais</h4><input id="g-check-eom" value="'+esc(S.cfg.checkoutEom||'')+'">'
      +'<div style="margin-top:10px"><button class="bt g" data-sync-dev>Buscar devocionais do YouTube agora</button></div><small>Isso também acontece sozinho, de hora em hora.</small>'
      +'<h4>Link do botão "Quero liberar tudo"</h4><input id="g-check" value="'+esc(S.cfg.checkout||'')+'">'
      +'<div style="margin-top:10px"><button class="bt" data-salvar-cfg>Salvar acima</button></div>'
      +'<h4>Materiais</h4><small>Cada material tem o link de download (Drive). "Produto" libera pra quem comprou um produto da Kiwify cujo nome contém o trecho informado.</small><div id="g-mats"></div><button class="bt g" data-novo>+ Novo material</button>'
      +'<h4>Liberar acesso na mão</h4><small>Pra aluno antigo ou venda por fora: e-mail + nome do produto.</small><div class="mrow"><input id="g-lib-email" placeholder="email do aluno"><input id="g-lib-prod" placeholder="nome do produto (ex.: Programa em Grupo)"><div class="full"><button class="bt" data-liberar>Liberar</button></div></div>'
      +'<small>'+ (S.todasCompras||[]).length+' compras registradas.</small></div>';
    desenharMats(tipos);go.classList.add('open');
    go.onclick=async function(e){
      var t=e.target;
      if(t===go||t.closest('[data-x]')){go.classList.remove('open');return;}
      var j=t.closest('[data-jogo]');if(j){j.classList.toggle('on');return;}
      if(t.closest('[data-salvar-cfg]')){
        S.cfg.jogosGratis=[].map.call(go.querySelectorAll('.chip.on'),function(c){return c.dataset.jogo;});
        S.cfg.programa=document.getElementById('g-prog').value.split(',').map(function(x){return x.trim();}).filter(Boolean);
        S.cfg.checkout=document.getElementById('g-check').value.trim();
        S.cfg.eom=document.getElementById('g-eom').value.split(',').map(function(x){return x.trim();}).filter(Boolean);
        S.cfg.checkoutEom=document.getElementById('g-check-eom').value.trim();
        var r=await sb.from('acesso').upsert({id:'cfg',dados:S.cfg});toast(r.error?'Não salvou 😕':'✅ Salvo','#10b981');pintar();return;
      }
      if(t.closest('[data-sync-dev]')){
        toast('Buscando no YouTube…');var ses=(await sb.auth.getSession()).data.session;
        var rr=await fetch('/.netlify/functions/devocionais-sync',{method:'POST',headers:{Authorization:'Bearer '+(ses?ses.access_token:'')}});var j=await rr.json().catch(function(){return {};});
        toast(rr.ok?'✅ '+(j.novos||[]).length+' novos (de '+j.naPlaylist+' na playlist)':(j.erro||'Não deu certo 😕'),rr.ok?'#10b981':'#ef4444');return;
      }
      if(t.closest('[data-novo]')){var n=await sb.from('materiais').insert({nome:'Novo material',ordem:S.mats.length}).select().single();if(n.data){S.mats.push(n.data);desenharMats(tipos);}else toast('Não criou 😕');return;}
      var sv=t.closest('[data-salvar-mat]'),ap=t.closest('[data-apagar-mat]');
      if(sv){
        var row=sv.closest('.mrow'),id=row.dataset.id,v=function(k){return row.querySelector('[data-k="'+k+'"]').value.trim();};
        var d={nome:v('nome'),descricao:v('descricao'),icone:v('icone')||'📘',tipo:v('tipo'),produto:v('produto'),checkout:v('checkout'),ordem:parseInt(v('ordem'))||0};
        var r1=await sb.from('materiais').update(d).eq('id',id),r2=await sb.from('material_links').upsert({material_id:id,link:v('link')});
        toast(r1.error||r2.error?'Não salvou 😕':'✅ Material salvo','#10b981');
        S.mats=S.mats.map(function(m){return m.id===id?Object.assign(m,d):m;});renderMat();return;
      }
      if(ap&&confirm('Apagar esse material?')){var idm=ap.closest('.mrow').dataset.id;await sb.from('materiais').delete().eq('id',idm);S.mats=S.mats.filter(function(m){return m.id!==idm;});desenharMats(tipos);renderMat();return;}
      if(t.closest('[data-liberar]')){
        var em=document.getElementById('g-lib-email').value.trim().toLowerCase(),pr=document.getElementById('g-lib-prod').value.trim();
        if(!em||!pr){toast('Preencha e-mail e produto');return;}
        var r3=await sb.from('compras').insert({pedido:'manual-'+Date.now(),email:em,produto:pr});toast(r3.error?'Não liberou 😕':'✅ Liberado pra '+em,'#10b981');
      }
    };
  }
  async function desenharMats(tipos){
    var links={},r=await sb.from('material_links').select('material_id,link');(r.data||[]).forEach(function(l){links[l.material_id]=l.link;});
    var inp=function(k,val,ph){return '<input data-k="'+k+'" value="'+esc(val)+'" placeholder="'+ph+'">';};
    document.getElementById('g-mats').innerHTML=S.mats.map(function(m){
      return '<div class="mrow" data-id="'+m.id+'">'+inp('nome',m.nome,'Nome')+inp('descricao',m.descricao,'Descrição curta')
        +'<select data-k="tipo">'+Object.keys(tipos).map(function(k){return '<option value="'+k+'"'+(m.tipo===k?' selected':'')+'>'+tipos[k]+'</option>';}).join('')+'</select>'
        +inp('produto',m.produto,'Trecho do nome do produto na Kiwify')
        +'<div class="full">'+inp('link',links[m.id]||'','Link de download (Drive)')+'</div>'
        +'<div class="full">'+inp('checkout',m.checkout,'Link de compra (checkout Kiwify) — pra quem ainda não tem')+'</div>'
        +inp('icone',m.icone,'Emoji')+inp('ordem',m.ordem,'Ordem')
        +'<div class="full"><button class="bt" data-salvar-mat>Salvar</button> <button class="bt r" data-apagar-mat>Apagar</button></div></div>';
    }).join('')||'<small>Nenhum material ainda.</small>';
  }

  sb.auth.onAuthStateChange(function(ev,s){if(s&&(ev==='SIGNED_IN'||ev==='INITIAL_SESSION'))setTimeout(carregar,0);if(ev==='SIGNED_OUT'){S.ok=false;S.admin=false;}});
  window.EBG_ACESSO={estado:S,recarregar:carregar};
})();
