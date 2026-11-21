/* Mural do English on Mission · recados da turma (testemunhos, pedidos de oração, avisos). Coluna lateral que rola.
   Só assinantes leem e escrevem. Selo dourado de verificado. Foto passa pela aprovação do Gediel. Tabela: supabase/mural-eom.sql */
(function(){
  var E=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});};
  var css=document.createElement('style');
  css.textContent=''
  +'.mu{display:flex;flex-direction:column;min-width:0}.mu-h{font-family:"Cormorant Garamond",Georgia,serif;font-size:22px;font-weight:700;color:#f3e2a8;margin:0 0 2px}.mu-s{font-size:12px;color:rgba(245,239,224,.68);margin:0 0 10px;line-height:1.4}'
  +'.mu-box{background:linear-gradient(180deg,#143a2b,#0f2c21);border:1px solid rgba(212,178,92,.25);border-radius:16px;padding:10px;margin-bottom:10px}'
  +'.mu-box textarea{width:100%;min-height:58px;resize:vertical;background:rgba(0,0,0,.22);border:1px solid rgba(212,178,92,.25);border-radius:10px;color:#fbf5e4;font:inherit;font-size:13.5px;padding:8px 10px;box-sizing:border-box}'
  +'.mu-box textarea::placeholder{color:rgba(245,239,224,.5)}.mu-tipos{display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap}'
  +'.mu-tipos button{border:1px solid rgba(212,178,92,.3);background:none;color:#f3e2a8;font:inherit;font-size:11.5px;font-weight:700;padding:5px 10px;border-radius:99px;cursor:pointer}.mu-tipos button.on{background:#d4b25c;color:#14261c;border-color:#d4b25c}'
  +'.mu-row{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:8px}.mu-row small{font-size:11px;color:rgba(245,239,224,.55);line-height:1.3}'
  +'.mu-ft{border:1px solid rgba(212,178,92,.3);background:none;color:#f3e2a8;border-radius:10px;width:36px;height:34px;display:flex;align-items:center;justify-content:center;cursor:pointer;flex:none}.mu-ft svg{width:18px;height:18px}'
  +'.mu-btn{border:0;background:#d4b25c;color:#14261c;font:inherit;font-size:12.5px;font-weight:800;padding:8px 16px;border-radius:99px;cursor:pointer}.mu-btn:disabled{opacity:.5;cursor:default}.mu-btn:hover:not(:disabled){box-shadow:0 6px 16px -6px #d4b25c}'
  +'.mu-prev{position:relative;margin-top:8px;display:inline-block}.mu-prev img{max-width:100%;max-height:120px;border-radius:10px;display:block}.mu-prev button{position:absolute;top:4px;right:4px;border:0;background:rgba(0,0,0,.6);color:#fff;width:22px;height:22px;border-radius:50%;cursor:pointer;font-size:12px;line-height:1}'
  +'.mu-lista{max-height:560px;overflow-y:auto;padding-right:4px;scrollbar-width:thin;scrollbar-color:rgba(212,178,92,.4) transparent}'
  +'.mu-p{background:linear-gradient(180deg,#143a2b,#0f2c21);border:1px solid rgba(212,178,92,.18);border-radius:14px;padding:10px 12px;margin-bottom:8px}.mu-p.pend{border-style:dashed;border-color:#d4b25c}'
  +'.mu-top{display:flex;align-items:center;gap:8px}.mu-av{width:30px;height:30px;border-radius:50%;background:#d4b25c;color:#14261c;display:flex;align-items:center;justify-content:center;font-weight:800;flex:none;font-size:13px}'
  +'.mu-nm{font-weight:800;font-size:13px;color:#fbf5e4;display:flex;align-items:center;gap:4px;min-width:0}.mu-nm>span:first-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mu-dt{font-size:11px;color:rgba(245,239,224,.55)}'
  +'.mu-v{width:14px;height:14px;flex:none}.mu-tag{font-size:9.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;background:rgba(212,178,92,.2);color:#f3e2a8;padding:2px 6px;border-radius:99px;white-space:nowrap}.mu-tag.or{background:rgba(120,160,255,.2);color:#cfe0ff}.mu-tag.pe{background:#d4b25c;color:#14261c}'
  +'.mu-tx{font-size:13.5px;line-height:1.55;color:#fbf5e4;margin:7px 0 6px;white-space:pre-wrap;word-break:break-word}.mu-img{max-width:100%;max-height:260px;border-radius:10px;display:block;margin:6px 0}'
  +'.mu-ac{display:flex;gap:12px;align-items:center}.mu-ac button{border:0;background:none;color:rgba(245,239,224,.7);font:inherit;font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:5px;padding:3px 0}.mu-ac button:hover{color:#f3e2a8}'
  +'.mu-ac svg{width:15px;height:15px}.mu-cm{margin:6px 0 0 10px;padding-left:10px;border-left:2px solid rgba(212,178,92,.25)}.mu-c{padding:6px 0}.mu-c .mu-tx{margin:3px 0 0;font-size:12.5px}'
  +'.mu-nw{display:flex;gap:6px;margin-top:6px}.mu-nw input{flex:1;min-width:0;background:rgba(0,0,0,.22);border:1px solid rgba(212,178,92,.25);border-radius:99px;color:#fbf5e4;font:inherit;font-size:12.5px;padding:7px 12px}'
  +'.mu-aprova{display:flex;gap:6px;margin-top:6px}.mu-aprova button{border:0;border-radius:8px;padding:6px 10px;font:inherit;font-size:11.5px;font-weight:800;cursor:pointer}.mu-aprova .ok{background:#16a34a;color:#fff}.mu-aprova .no{background:#e11d48;color:#fff}'
  +'.mu-lock{text-align:center;padding:20px 14px;background:linear-gradient(180deg,#143a2b,#0f2c21);border:1px solid rgba(212,178,92,.3);border-radius:16px}.mu-lock svg{width:30px;height:30px;color:#d4b25c}.mu-lock b{display:block;font-size:15px;color:#fbf5e4;margin:6px 0 4px}.mu-lock p{margin:0 0 12px;font-size:12.5px;color:rgba(245,239,224,.75);line-height:1.5}'
  +'.mu-lock a{display:inline-block;text-decoration:none}.mu-vz{text-align:center;color:rgba(245,239,224,.6);font-size:12.5px;padding:14px}';
  document.head.appendChild(css);
  var VER='<svg class="mu-v" viewBox="0 0 24 24" aria-label="Assinante verificado"><path d="M12 1.8l2.6 1.9 3.2-.1 1 3.1 2.6 1.9-1 3.1 1 3.1-2.6 1.9-1 3.1-3.2-.1L12 22.2l-2.6-1.9-3.2.1-1-3.1-2.6-1.9 1-3.1-1-3.1 2.6-1.9 1-3.1 3.2.1z" fill="#d4b25c"/><path d="M8 12.2l2.8 2.8L16.2 9.4" fill="none" stroke="#14261c" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var S_='fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  var ICO_C='<svg viewBox="0 0 24 24" '+S_+'><path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.2A8 8 0 1 1 21 12z"/></svg>';
  var ICO_X='<svg viewBox="0 0 24 24" '+S_+'><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>';
  var ICO_L='<svg viewBox="0 0 24 24" '+S_+'><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
  var ICO_I='<svg viewBox="0 0 24 24" '+S_+'><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="1.6"/><path d="M21 16l-5-5-8 8"/></svg>';
  var TIPOS=[['recado','Recado'],['testemunho','Testemunho'],['oracao','Pedido de oração']];
  var NOMET={recado:'Recado',testemunho:'Testemunho',oracao:'Oração'};
  /* filtro de palavrão e ofensa (igual ao do servidor): ignora acento, maiúscula, letra repetida e número no lugar de letra */
  var BAD=/\b(arombada|arombado|ashole|babaca|bastard|bicha|bitch|bosta|buceta|cacete|carai|caralho|corna|corno|cretina|cretino|crioulo|cunt|cuzao|desgraca|desgracado|dick|dumbas|energumeno|escrota|escroto|estupida|estupido|fagot|fdp|foda|fodase|foder|fodido|fuck|fucked|fucker|fucking|idiot|idiota|imbecil|inutil|lixo|merda|miseravel|moron|nazista|niga|niger|nojenta|nojento|otaria|otario|piranha|piroca|pora|pqp|prostituta|punheta|pusy|puta|putaria|putinha|puto|retard|retardada|retardado|retarded|safada|safado|sapatao|shit|shity|slut|stfu|stupid|vagabunda|vagabundo|viadinho|viado|vsf|vtmnc|vtnc|whore|wtf|xoxota)(s|es)?\b/i;
  function limpo(t){
    var s=String(t||'').toLowerCase(),de='áàâãäéèêëíìîïóòôõöúùûüçñ@$013457',pa='aaaaaeeeeiiiiooooouuuucnasoieast';
    s=s.replace(/./g,function(c){var i=de.indexOf(c);return i>=0?pa[i]:c;}).replace(/(.)\1+/g,'$1');
    return !BAD.test(s);
  }
  var sb=function(){return window._sb;};
  function ago(t){var s=(Date.now()-new Date(t).getTime())/1000;if(s<60)return 'agora';if(s<3600)return Math.floor(s/60)+' min';if(s<86400)return Math.floor(s/3600)+' h';if(s<604800)return Math.floor(s/86400)+' d';return new Date(t).toLocaleDateString('pt-BR');}
  function selo(x){return x.selo==='prof'?VER+'<span class="mu-tag">Professor</span>':VER;}
  var me=null,box=null,abertos={},tipo='recado',foto=null,adminSel=false;
  function admin(){return !!(window._isAdmin||((window.EBG_ACESSO||{}).estado||{}).admin);}
  function post(p,cs,adm){
    var ab=abertos[p.id],mine=me&&p.user_id===me.id,pend=p.status==='pendente';
    return '<div class="mu-p'+(pend?' pend':'')+'" data-id="'+p.id+'"><div class="mu-top"><div class="mu-av">'+E((p.user_name||'?')[0].toUpperCase())+'</div><div style="min-width:0"><div class="mu-nm"><span>'+E(p.user_name||'Aluno')+'</span>'+selo(p)+(p.tipo&&p.tipo!=='recado'?'<span class="mu-tag'+(p.tipo==='oracao'?' or':'')+'">'+E(NOMET[p.tipo]||'')+'</span>':'')+'</div><div class="mu-dt">'+ago(p.created_at)+(pend?' · <b>em análise</b>':'')+'</div></div></div>'
      +'<div class="mu-tx">'+E(p.body)+'</div>'+(p.imagem?'<img class="mu-img" alt="" src="'+E(p.imagem)+'">':'')
      +(pend&&adm?'<div class="mu-aprova"><button class="ok" data-mu="aprovar">Aprovar</button><button class="no" data-mu="del">Remover</button></div>':'')
      +(pend&&!adm?'<div class="mu-dt">A foto aparece pra turma depois que o Gediel aprovar.</div>':'')
      +'<div class="mu-ac"><button data-mu="abrir" aria-label="Comentários">'+ICO_C+(cs.length?cs.length:'Comentar')+'</button>'+((mine||adm)?'<button data-mu="del" aria-label="Apagar">'+ICO_X+'</button>':'')+'</div>'
      +(ab?'<div class="mu-cm">'+cs.map(function(c){return '<div class="mu-c" data-id="'+c.id+'"><div class="mu-nm"><span>'+E(c.user_name||'Aluno')+'</span>'+selo(c)+'<span class="mu-dt" style="font-weight:500">· '+ago(c.created_at)+'</span></div><div class="mu-tx">'+E(c.body)+'</div>'+((me&&c.user_id===me.id)||adm?'<div class="mu-ac"><button data-mu="del">'+ICO_X+'</button></div>':'')+'</div>';}).join('')
        +'<div class="mu-nw"><input maxlength="600" placeholder="Escreva um comentário"><button class="mu-btn" data-mu="com">Enviar</button></div></div>':'')
      +'</div>';
  }
  async function desenhar(){
    if(!box)return;
    var adm=admin(),lista=box.querySelector('.mu-lista'),rolo=lista.scrollTop;
    var r=await sb().from('mi_mural').select('*').order('created_at',{ascending:false}).limit(200);
    if(r.error){
      var msg=/relation|does not exist|schema cache/i.test(r.error.message||'')?(adm?'Rode o arquivo supabase/mural-eom.sql no Supabase pra ligar o mural.':'O mural abre em breve.'):'O mural é só pra quem assina o English on Mission.';
      lista.innerHTML='<div class="mu-vz">'+E(msg)+'</div>';return;
    }
    var rows=r.data||[],raiz=rows.filter(function(x){return !x.parent_id;}),filhos={};
    rows.filter(function(x){return x.parent_id;}).sort(function(a,b){return new Date(a.created_at)-new Date(b.created_at);}).forEach(function(c){(filhos[c.parent_id]=filhos[c.parent_id]||[]).push(c);});
    var f=box.dataset.filtro||'';if(f)raiz=raiz.filter(function(x){return x.tipo===f;});
    // pendentes primeiro pro admin aprovar
    if(adm)raiz.sort(function(a,b){return (b.status==='pendente')-(a.status==='pendente');});
    lista.innerHTML=raiz.length?raiz.map(function(p){return post(p,filhos[p.id]||[],adm);}).join(''):'<div class="mu-vz">Nada por aqui ainda. Que tal ser a primeira pessoa a escrever?</div>';
    lista.scrollTop=rolo;
  }
  function encolher(file){
    return new Promise(function(ok,no){
      var fr=new FileReader();fr.onerror=no;fr.onload=function(){var im=new Image();im.onerror=no;im.onload=function(){
        var m=900,k=Math.min(1,m/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);
        c.getContext('2d').drawImage(im,0,0,c.width,c.height);ok(c.toDataURL('image/jpeg',.72));};im.src=fr.result;};fr.readAsDataURL(file);
    });
  }
  async function enviar(body,parent,btn){
    body=(body||'').trim();if(!body&&!foto)return false;if(!body)body='📷';
    if(!limpo(body)){if(window.toast)toast('Esse texto tem palavras que não combinam com a nossa comunidade. Reescreve com carinho 🙏');return false;}
    var meta=(me&&me.user_metadata)||{},nome=meta.full_name||meta.name||((me&&me.email)||'aluno').split('@')[0];
    if(btn)btn.disabled=true;
    var linha={body:body,parent_id:parent||null,user_name:nome};
    if(!parent){linha.tipo=tipo;if(foto)linha.imagem=foto;}
    var r=await sb().from('mi_mural').insert(linha);
    if(btn)btn.disabled=false;
    if(r.error){if(window.toast)toast(/comunidade/i.test(r.error.message||'')?'Esse texto tem palavras que não combinam com a nossa comunidade 🙏':'Não consegui publicar agora. Tenta de novo.');return false;}
    if(parent)abertos[parent]=true;else if(foto&&window.toast)toast('Recebido! A foto aparece pra turma depois que o Gediel aprovar 🙏');
    await desenhar();return true;
  }
  function liberado(){
    var S=(window.EBG_ACESSO||{}).estado||{};
    if(S.admin||S.tudo||S.programa||window._isAdmin)return true;
    var nomes=((S.cfg&&S.cfg.eom)||[]).concat(['English on Mission']);
    return nomes.some(function(n){n=String(n).toLowerCase();return (S.compras||[]).some(function(c){return (c.produto||'').toLowerCase().indexOf(n)>=0;})||String(S.meta||'').toLowerCase().indexOf(n)>=0;});
  }
  async function montar(host){
    if(!host)return;
    var velho=document.getElementById('eom-mural');if(velho)velho.remove();
    var S=(window.EBG_ACESSO||{}).estado||{},cf=S.cfg||{};
    var el=document.createElement('div');el.id='eom-mural';el.className='mu';host.appendChild(el);
    if(!liberado()){
      el.innerHTML='<div class="mu-h">Mural</div><div class="mu-lock">'+ICO_L+'<b>O mural é só pra quem assina</b><p>Aqui a turma do English on Mission compartilha testemunhos, pedidos de oração e recados. Assine pra entrar.</p>'
        +(cf.checkoutEom?'<a class="mu-btn" target="_blank" rel="noopener" href="'+E(cf.checkoutEom)+'">Assinar o English on Mission</a>':'')+'</div>';
      return;
    }
    box=el;foto=null;tipo='recado';
    try{me=(await sb().auth.getUser()).data.user;}catch(e){me=null;}
    el.innerHTML='<div class="mu-h">Mural da turma</div><div class="mu-s">Testemunhos, pedidos de oração e recados. Com carinho e respeito: palavrão e ofensa não passam.</div>'
      +'<div class="mu-box"><div class="mu-tipos">'+TIPOS.map(function(t,i){return '<button data-mu="tipo" data-t="'+t[0]+'" class="'+(i===0?'on':'')+'">'+t[1]+'</button>';}).join('')+'</div>'
      +'<textarea maxlength="1500" placeholder="Escreva pra turma…"></textarea><div class="mu-prev" hidden></div>'
      +'<div class="mu-row"><button class="mu-ft" data-mu="foto" aria-label="Adicionar foto">'+ICO_I+'</button><input type="file" accept="image/*" hidden><button class="mu-btn" data-mu="pub">Publicar</button></div></div>'
      +'<div class="mu-tipos" style="margin-bottom:8px"><button data-mu="filtro" data-t="" class="on">Tudo</button>'+TIPOS.map(function(t){return '<button data-mu="filtro" data-t="'+t[0]+'">'+t[1]+'</button>';}).join('')+'</div>'
      +'<div class="mu-lista"><div class="mu-vz">Carregando…</div></div>';
    var fi=el.querySelector('input[type=file]'),pv=el.querySelector('.mu-prev');
    fi.onchange=async function(){var f=fi.files[0];fi.value='';if(!f)return;try{foto=await encolher(f);pv.hidden=false;pv.innerHTML='<img alt="" src="'+foto+'"><button data-mu="semfoto" aria-label="Tirar foto">✕</button>';}catch(e){if(window.toast)toast('Não consegui abrir essa foto.');}};
    el.addEventListener('click',async function(e){
      var b=e.target.closest('[data-mu]');if(!b)return;var a=b.dataset.mu,p=b.closest('.mu-p');
      if(a==='tipo'){tipo=b.dataset.t;[].forEach.call(el.querySelectorAll('[data-mu=tipo]'),function(x){x.classList.toggle('on',x===b);});}
      else if(a==='filtro'){el.dataset.filtro=b.dataset.t;[].forEach.call(el.querySelectorAll('[data-mu=filtro]'),function(x){x.classList.toggle('on',x===b);});desenhar();}
      else if(a==='foto')fi.click();
      else if(a==='semfoto'){foto=null;pv.hidden=true;pv.innerHTML='';}
      else if(a==='pub'){var t=el.querySelector('textarea');if(await enviar(t.value,null,b)){t.value='';foto=null;pv.hidden=true;pv.innerHTML='';}}
      else if(a==='abrir'){abertos[p.dataset.id]=!abertos[p.dataset.id];desenhar();}
      else if(a==='com'){var inp=b.parentNode.querySelector('input');if(await enviar(inp.value,p.dataset.id,b))inp.value='';}
      else if(a==='aprovar'){var r1=await sb().from('mi_mural').update({status:'ok'}).eq('id',p.dataset.id);if(r1.error&&window.toast)toast('Não consegui aprovar.');desenhar();}
      else if(a==='del'){var c=b.closest('.mu-c'),id=(c||p).dataset.id;var r2=await sb().from('mi_mural').delete().eq('id',id);if(r2.error&&window.toast)toast('Não consegui apagar.');desenhar();}
    });
    el.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.matches('.mu-nw input')){e.preventDefault();e.target.parentNode.querySelector('[data-mu=com]').click();}});
    desenhar();
  }
  window.EBG_MURAL={montar:montar,limpo:limpo};
})();
