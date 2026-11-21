/* Mural do English on Mission · feed de textos (estilo Threads). Só assinantes leem e escrevem; todos eles comentam.
   Selo dourado de verificado ao lado do nome. Tabela: supabase/mural-eom.sql */
(function(){
  var E=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});};
  var css=document.createElement('style');
  css.textContent=''
  +'.mu{margin:26px 0 8px}.mu-h{font-family:"Cormorant Garamond",Georgia,serif;font-size:24px;font-weight:700;color:#f3e2a8;margin:0 0 4px}.mu-s{font-size:13px;color:rgba(245,239,224,.72);margin:0 0 14px}'
  +'.mu-box{background:linear-gradient(180deg,#143a2b,#0f2c21);border:1px solid rgba(212,178,92,.25);border-radius:18px;padding:14px;margin-bottom:12px}'
  +'.mu-box textarea{width:100%;min-height:72px;resize:vertical;background:rgba(0,0,0,.22);border:1px solid rgba(212,178,92,.25);border-radius:12px;color:#fbf5e4;font:inherit;font-size:14px;padding:10px 12px;box-sizing:border-box}'
  +'.mu-box textarea::placeholder{color:rgba(245,239,224,.5)}.mu-row{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:8px}.mu-row small{font-size:11.5px;color:rgba(245,239,224,.55)}'
  +'.mu-btn{border:0;background:#d4b25c;color:#14261c;font:inherit;font-size:13px;font-weight:800;padding:9px 18px;border-radius:99px;cursor:pointer}.mu-btn:disabled{opacity:.5;cursor:default}.mu-btn:hover:not(:disabled){box-shadow:0 6px 16px -6px #d4b25c}'
  +'.mu-p{background:linear-gradient(180deg,#143a2b,#0f2c21);border:1px solid rgba(212,178,92,.18);border-radius:18px;padding:14px 16px;margin-bottom:10px}'
  +'.mu-top{display:flex;align-items:center;gap:10px}.mu-av{width:36px;height:36px;border-radius:50%;background:#d4b25c;color:#14261c;display:flex;align-items:center;justify-content:center;font-weight:800;flex:none}'
  +'.mu-nm{font-weight:800;font-size:14px;color:#fbf5e4;display:flex;align-items:center;gap:5px;min-width:0}.mu-nm span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mu-dt{font-size:11.5px;color:rgba(245,239,224,.55)}'
  +'.mu-v{width:16px;height:16px;flex:none}.mu-tag{font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;background:rgba(212,178,92,.2);color:#f3e2a8;padding:2px 7px;border-radius:99px}'
  +'.mu-tx{font-size:14.5px;line-height:1.6;color:#fbf5e4;margin:10px 0 8px;white-space:pre-wrap;word-break:break-word}'
  +'.mu-ac{display:flex;gap:14px}.mu-ac button{border:0;background:none;color:rgba(245,239,224,.7);font:inherit;font-size:12.5px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:5px;padding:4px 0}.mu-ac button:hover{color:#f3e2a8}'
  +'.mu-ac svg{width:16px;height:16px}.mu-cm{margin:8px 0 0 18px;padding-left:14px;border-left:2px solid rgba(212,178,92,.25)}.mu-c{padding:8px 0}.mu-c .mu-tx{margin:4px 0 0;font-size:13.5px}'
  +'.mu-nw{display:flex;gap:8px;margin-top:8px}.mu-nw input{flex:1;min-width:0;background:rgba(0,0,0,.22);border:1px solid rgba(212,178,92,.25);border-radius:99px;color:#fbf5e4;font:inherit;font-size:13.5px;padding:9px 14px}'
  +'.mu-lock{text-align:center;padding:26px 18px;background:linear-gradient(180deg,#143a2b,#0f2c21);border:1px solid rgba(212,178,92,.3);border-radius:18px}.mu-lock svg{width:34px;height:34px;color:#d4b25c}.mu-lock b{display:block;font-size:17px;color:#fbf5e4;margin:8px 0 4px}.mu-lock p{margin:0 0 14px;font-size:13.5px;color:rgba(245,239,224,.75);line-height:1.5}'
  +'.mu-lock a{display:inline-block;text-decoration:none}.mu-vz{text-align:center;color:rgba(245,239,224,.6);font-size:13px;padding:18px}';
  document.head.appendChild(css);
  var VER='<svg class="mu-v" viewBox="0 0 24 24" aria-label="Assinante verificado"><path d="M12 1.8l2.6 1.9 3.2-.1 1 3.1 2.6 1.9-1 3.1 1 3.1-2.6 1.9-1 3.1-3.2-.1L12 22.2l-2.6-1.9-3.2.1-1-3.1-2.6-1.9 1-3.1-1-3.1 2.6-1.9 1-3.1 3.2.1z" fill="#d4b25c"/><path d="M8 12.2l2.8 2.8L16.2 9.4" fill="none" stroke="#14261c" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ICO_C='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.2A8 8 0 1 1 21 12z"/></svg>';
  var ICO_X='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>';
  var ICO_L='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
  var sb=function(){return window._sb;};
  function ago(t){var s=(Date.now()-new Date(t).getTime())/1000;if(s<60)return 'agora';if(s<3600)return Math.floor(s/60)+' min';if(s<86400)return Math.floor(s/3600)+' h';if(s<604800)return Math.floor(s/86400)+' d';return new Date(t).toLocaleDateString('pt-BR');}
  function selo(x){return x.selo==='prof'?VER+'<span class="mu-tag">Professor</span>':VER;}
  var me=null,box=null,abertos={};

  function post(p,cs,admin){
    var ab=abertos[p.id],mine=me&&p.user_id===me.id;
    return '<div class="mu-p" data-id="'+p.id+'"><div class="mu-top"><div class="mu-av">'+E((p.user_name||'?')[0].toUpperCase())+'</div><div style="min-width:0"><div class="mu-nm"><span>'+E(p.user_name||'Aluno')+'</span>'+selo(p)+'</div><div class="mu-dt">'+ago(p.created_at)+'</div></div></div>'
      +'<div class="mu-tx">'+E(p.body)+'</div>'
      +'<div class="mu-ac"><button data-mu="abrir" aria-label="Comentários">'+ICO_C+(cs.length?cs.length+' comentário'+(cs.length>1?'s':''):'Comentar')+'</button>'+((mine||admin)?'<button data-mu="del" aria-label="Apagar">'+ICO_X+'</button>':'')+'</div>'
      +(ab||cs.length?'<div class="mu-cm">'+(ab?cs.map(function(c){return '<div class="mu-c" data-id="'+c.id+'"><div class="mu-nm"><span>'+E(c.user_name||'Aluno')+'</span>'+selo(c)+'<span class="mu-dt" style="font-weight:500"> · '+ago(c.created_at)+'</span></div><div class="mu-tx">'+E(c.body)+'</div>'+((me&&c.user_id===me.id)||admin?'<div class="mu-ac"><button data-mu="del">'+ICO_X+'</button></div>':'')+'</div>';}).join('')
        +'<div class="mu-nw"><input maxlength="1500" placeholder="Escreva um comentário"><button class="mu-btn" data-mu="com">Enviar</button></div>':'')+'</div>':'')
      +'</div>';
  }
  async function carregar(){
    var r=await sb().from('mi_mural').select('*').order('created_at',{ascending:false}).limit(200);
    if(r.error){return {erro:r.error};}
    return {rows:r.data||[]};
  }
  async function desenhar(){
    if(!box)return;
    var admin=!!(window._isAdmin||((window.EBG_ACESSO||{}).estado||{}).admin);
    var d=await carregar();
    if(d.erro){
      var msg=/relation|does not exist|schema cache/i.test(d.erro.message||'')?(admin?'Rode o arquivo supabase/mural-eom.sql no Supabase pra ligar o mural.':'O mural abre em breve.'):'O mural é só pra quem assina o English on Mission.';
      box.querySelector('.mu-lista').innerHTML='<div class="mu-vz">'+E(msg)+'</div>';return;
    }
    var raiz=d.rows.filter(function(x){return !x.parent_id;}),filhos={};
    d.rows.filter(function(x){return x.parent_id;}).sort(function(a,b){return new Date(a.created_at)-new Date(b.created_at);}).forEach(function(c){(filhos[c.parent_id]=filhos[c.parent_id]||[]).push(c);});
    box.querySelector('.mu-lista').innerHTML=raiz.length?raiz.map(function(p){return post(p,filhos[p.id]||[],admin);}).join(''):'<div class="mu-vz">Ninguém publicou ainda. Seja a primeira pessoa a escrever.</div>';
  }
  async function enviar(body,parent,btn){
    body=(body||'').trim();if(!body)return;
    var meta=(me&&me.user_metadata)||{},nome=meta.full_name||meta.name||((me&&me.email)||'aluno').split('@')[0];
    if(btn)btn.disabled=true;
    var r=await sb().from('mi_mural').insert({body:body,parent_id:parent||null,user_name:nome});
    if(btn)btn.disabled=false;
    if(r.error){if(window.toast)toast('Não consegui publicar agora. Tenta de novo.');return false;}
    if(parent)abertos[parent]=true;
    await desenhar();return true;
  }
  function liberado(){
    var S=(window.EBG_ACESSO||{}).estado||{};
    if(S.admin||S.tudo||window._isAdmin)return true;
    var nomes=((S.cfg&&S.cfg.eom)||[]).concat(['English on Mission']);
    return nomes.some(function(n){n=String(n).toLowerCase();return (S.compras||[]).some(function(c){return (c.produto||'').toLowerCase().indexOf(n)>=0;})||String(S.meta||'').toLowerCase().indexOf(n)>=0;});
  }
  async function montar(pane){
    if(!pane)return;
    var velho=pane.querySelector('#eom-mural');if(velho)velho.remove();
    var S=(window.EBG_ACESSO||{}).estado||{},cf=S.cfg||{};
    box=document.createElement('div');box.id='eom-mural';box.className='mu';
    var hero=pane.querySelector('.th-hero');
    if(hero)hero.insertAdjacentElement('afterend',box);else pane.insertBefore(box,pane.firstChild);
    if(!liberado()){
      box.innerHTML='<div class="mu-h">Mural</div><div class="mu-lock">'+ICO_L+'<b>O mural é só pra quem assina</b><p>Aqui a turma do English on Mission publica, comenta e se ajuda. Assine pra entrar na conversa.</p>'
        +(cf.checkoutEom?'<a class="mu-btn" target="_blank" rel="noopener" href="'+E(cf.checkoutEom)+'">Assinar o English on Mission</a>':'')+'</div>';
      box=null;return;
    }
    try{me=(await sb().auth.getUser()).data.user;}catch(e){me=null;}
    box.innerHTML='<div class="mu-h">Mural</div><div class="mu-s">Escreva pra turma. Todo assinante pode publicar e comentar.</div>'
      +'<div class="mu-box"><textarea maxlength="1500" placeholder="O que você quer compartilhar? Uma frase em inglês, uma dúvida, um versículo…"></textarea><div class="mu-row"><small>Só assinantes veem esta área</small><button class="mu-btn" data-mu="pub">Publicar</button></div></div><div class="mu-lista"><div class="mu-vz">Carregando…</div></div>';
    box.addEventListener('click',async function(e){
      var b=e.target.closest('[data-mu]');if(!b)return;var a=b.dataset.mu,p=b.closest('.mu-p');
      if(a==='pub'){var t=box.querySelector('textarea');if(await enviar(t.value,null,b))t.value='';}
      else if(a==='abrir'){abertos[p.dataset.id]=!abertos[p.dataset.id];desenhar();}
      else if(a==='com'){var inp=b.parentNode.querySelector('input');await enviar(inp.value,p.dataset.id,b);}
      else if(a==='del'){var c=b.closest('.mu-c'),id=(c||p).dataset.id;var r=await sb().from('mi_mural').delete().eq('id',id);if(r.error&&window.toast)toast('Não consegui apagar.');desenhar();}
    });
    box.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.matches('.mu-nw input')){e.preventDefault();e.target.parentNode.querySelector('[data-mu=com]').click();}});
    desenhar();
  }
  window.EBG_MURAL={montar:montar};
})();
