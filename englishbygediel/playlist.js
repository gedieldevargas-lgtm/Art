/* Card "Playlist do YouTube": lista os vídeos sozinha, toca dentro do app, tem quiz e comentários por vídeo. */
(function(){
  var SB=function(){return window._sb;};
  function E(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function admin(){return !!window._isAdmin;}
  function tst(m,c){if(window.toast)window.toast(m,c);}
  /* aceita o link inteiro ou só o ID (PL...) */
  function listId(v){v=String(v||'').trim();var m=v.match(/[?&]list=([\w-]+)/);return m?m[1]:(/^[\w-]{10,60}$/.test(v)?v:'');}
  window.EBG_PLAYLIST_ID=listId;

  var css=document.createElement('style');
  css.textContent='#pl-ov{position:fixed;inset:0;z-index:300;background:var(--bg,#fff);color:var(--fg,#111);overflow:auto;display:none;-webkit-overflow-scrolling:touch}#pl-ov.on{display:block}'
  +'.pl-w{max-width:880px;margin:0 auto;padding:calc(env(safe-area-inset-top,0px) + 12px) max(14px,env(safe-area-inset-left)) 40px max(14px,env(safe-area-inset-right))}'
  +'.pl-top{display:flex;align-items:center;gap:10px;margin-bottom:12px}.pl-back{background:var(--accent,#2563eb);color:#fff;border:0;border-radius:99px;padding:9px 16px;font:inherit;font-size:13px;font-weight:800;cursor:pointer}'
  +'.pl-h{font-size:17px;font-weight:800;margin:0;min-width:0}'
  +'.pl-player{position:relative;width:100%;aspect-ratio:16/9;background:#000;border-radius:14px;overflow:hidden}.pl-player iframe{position:absolute;inset:0;width:100%;height:100%;border:0}'
  +'.pl-vt{font-size:16px;font-weight:800;margin:12px 0 4px}'
  +'.pl-tabs{display:flex;gap:8px;margin:12px 0}.pl-tabs button{flex:1;border:1.5px solid var(--border,#ddd);background:transparent;color:inherit;border-radius:10px;padding:9px;font:inherit;font-size:13px;font-weight:700;cursor:pointer}.pl-tabs button.on{background:var(--accent,#2563eb);border-color:var(--accent,#2563eb);color:#fff}'
  +'.pl-list{display:flex;flex-direction:column;gap:8px;margin-top:8px}.pl-it{display:flex;gap:10px;align-items:center;text-align:left;border:1.5px solid var(--border,#ddd);background:transparent;color:inherit;border-radius:12px;padding:6px;font:inherit;cursor:pointer;width:100%}.pl-it.on{border-color:var(--accent,#2563eb);background:rgba(37,99,235,.08)}'
  +'.pl-it img{width:112px;aspect-ratio:16/9;object-fit:cover;border-radius:8px;flex:none}.pl-it span{font-size:13px;font-weight:700;line-height:1.35;min-width:0}.pl-it small{display:block;font-weight:500;opacity:.65;margin-top:2px}'
  +'.pl-q{margin:0 0 16px}.pl-q .qt{font-weight:800;font-size:14px;margin-bottom:8px}.pl-o{display:flex;gap:8px;align-items:flex-start;border:1.5px solid var(--border,#ddd);border-radius:10px;padding:9px 11px;margin-bottom:6px;font-size:13.5px;cursor:pointer}.pl-o b{flex:none}.pl-o.sel{border-color:var(--accent,#2563eb);background:rgba(37,99,235,.08)}.pl-o.ok{border-color:#10b981;background:rgba(16,185,129,.14)}.pl-o.bad{border-color:#ef4444;background:rgba(239,68,68,.12)}'
  +'.pl-btn{background:var(--accent,#2563eb);color:#fff;border:0;border-radius:10px;padding:10px 16px;font:inherit;font-size:13.5px;font-weight:800;cursor:pointer}.pl-btn.g{background:transparent;color:inherit;border:1.5px solid var(--border,#ddd)}'
  +'.pl-c{display:flex;gap:10px;margin-bottom:12px}.pl-c .av{flex:none;width:32px;height:32px;border-radius:50%;background:var(--accent,#2563eb);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px}.pl-c .nm{font-weight:800;font-size:13px}.pl-c .bd{font-size:13.5px;line-height:1.5;white-space:pre-wrap;word-break:break-word}.pl-c .dl{background:none;border:0;color:#ef4444;font-size:11px;cursor:pointer;padding:0 0 0 6px}'
  +'.pl-ta{width:100%;box-sizing:border-box;border:1.5px solid var(--border,#ddd);background:transparent;color:inherit;border-radius:10px;padding:10px;font:inherit;font-size:14px;resize:vertical}'
  +'.pl-msg{padding:24px;text-align:center;opacity:.75;font-size:14px}';
  document.head.appendChild(css);

  var ov=document.createElement('div');ov.id='pl-ov';document.body.appendChild(ov);
  var S={card:null,videos:[],cur:null,tab:'quiz',sel:{}};

  function fechar(){ov.classList.remove('on');ov.innerHTML='';document.body.style.overflow='';}
  window.EBG_PLAYLIST={abrir:abrir,fechar:fechar};
  ov.addEventListener('click',function(e){
    var t=e.target.closest('[data-pl]');if(!t)return;var a=t.dataset.pl;
    if(a==='voltar')fechar();
    else if(a==='vid'){tocar(t.dataset.id);}
    else if(a==='tab'){S.tab=t.dataset.t;S.sel={};painel();}
    else if(a==='opt'){var q=+t.dataset.q;if(S.fim)return;S.sel[q]=+t.dataset.o;painel();}
    else if(a==='corrigir')corrigir();
    else if(a==='refazer'){S.sel={};S.fim=false;painel();}
    else if(a==='enviar')enviarComent();
    else if(a==='apagar')apagarComent(t.dataset.id);
    else if(a==='editq')editarQuiz();
    else if(a==='salvarq')salvarQuiz();
  });

  async function abrir(card,vid){
    S.card=card;S.videos=[];S.cur=null;S.tab='quiz';S.sel={};S.fim=false;
    var id=listId(card.valor);
    ov.innerHTML='<div class="pl-w"><div class="pl-top"><button class="pl-back" data-pl="voltar">← Voltar</button><h2 class="pl-h">'+E(card.titulo)+'</h2></div><div class="pl-msg">Carregando os vídeos…</div></div>';
    ov.classList.add('on');ov.scrollTop=0;document.body.style.overflow='hidden';
    if(!id){msg('Esse card ainda está sem o link da playlist. Edite o card e cole o link do YouTube.');return;}
    try{
      var r=await fetch('/.netlify/functions/playlist-videos?list='+encodeURIComponent(id));var j=await r.json();
      if(!r.ok)throw new Error(j.erro||'Erro '+r.status);
      S.videos=j.videos;
    }catch(e){msg('Não consegui carregar a playlist: '+E(e.message));return;}
    tocar((vid&&S.videos.some(function(v){return v.id===vid;}))?vid:S.videos[0].id);
  }
  function msg(t){ov.innerHTML='<div class="pl-w"><div class="pl-top"><button class="pl-back" data-pl="voltar">← Voltar</button><h2 class="pl-h">'+E(S.card.titulo)+'</h2></div><div class="pl-msg">'+t+'</div></div>';}

  function tocar(id){
    S.cur=S.videos.filter(function(v){return v.id===id;})[0];S.sel={};S.fim=false;S.quiz=null;S.editando=false;
    var v=S.cur;
    ov.innerHTML='<div class="pl-w"><div class="pl-top"><button class="pl-back" data-pl="voltar">← Voltar</button><h2 class="pl-h">'+E(S.card.titulo)+' · '+S.videos.length+' vídeo'+(S.videos.length>1?'s':'')+'</h2></div>'
      +'<div class="pl-player"><iframe src="https://www.youtube-nocookie.com/embed/'+v.id+'?rel=0&modestbranding=1&playsinline=1" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>'
      +'<div class="pl-vt">'+E(v.titulo)+'</div>'
      +'<div class="pl-tabs"><button data-pl="tab" data-t="quiz" id="plt-quiz">📝 Quiz</button><button data-pl="tab" data-t="com" id="plt-com">💬 Comentários</button></div>'
      +'<div id="pl-painel"></div>'
      +'<div class="pl-vt" style="margin-top:22px">Todos os vídeos</div><div class="pl-list">'
      +S.videos.map(function(x){return '<button class="pl-it'+(x.id===v.id?' on':'')+'" data-pl="vid" data-id="'+x.id+'"><img loading="lazy" src="https://i.ytimg.com/vi/'+x.id+'/mqdefault.jpg" alt=""><span>'+E(x.titulo)+(x.dur?'<small>'+E(x.dur)+'</small>':'')+'</span></button>';}).join('')
      +'</div></div>';
    ov.scrollTop=0;painel();
  }

  function painel(){
    var p=document.getElementById('pl-painel');if(!p)return;
    ['quiz','com'].forEach(function(k){var b=document.getElementById('plt-'+k);if(b)b.classList.toggle('on',S.tab===k);});
    if(S.tab==='quiz')pintaQuiz(p);else pintaComent(p);
  }

  /* ── quiz ── */
  async function pintaQuiz(p){
    if(S.quiz===null||S.quiz===undefined){
      p.innerHTML='<div class="pl-msg">Carregando…</div>';
      var r=await SB().from('video_quiz').select('quiz').eq('video_id',S.cur.id).maybeSingle();
      S.quiz=(r.data&&r.data.quiz)||[];
    }
    var q=S.quiz,h='';
    if(S.editando){return pintaEditor(p);}
    if(!q.length){
      h='<div class="pl-msg">Ainda não tem quiz pra esse vídeo.</div>';
      if(admin())h+='<div style="text-align:center"><button class="pl-btn" data-pl="editq">➕ Criar quiz desse vídeo</button></div>';
      p.innerHTML=h;return;
    }
    q.forEach(function(x,qi){
      h+='<div class="pl-q"><div class="qt">'+(qi+1)+'. '+E(x.q)+'</div>';
      (x.a||[]).forEach(function(alt,ai){if(!alt)return;
        var c='pl-o';if(S.fim){if(ai===x.c)c+=' ok';else if(S.sel[qi]===ai)c+=' bad';}else if(S.sel[qi]===ai)c+=' sel';
        h+='<div class="'+c+'" data-pl="opt" data-q="'+qi+'" data-o="'+ai+'"><b>'+'ABCD'[ai]+'</b><span>'+E(alt)+'</span></div>';});
      h+='</div>';
    });
    if(S.fim){
      var ok=q.filter(function(x,i){return S.sel[i]===x.c;}).length;
      h+='<div class="pl-msg" style="font-weight:800;opacity:1">'+(ok===q.length?'🏆 Perfeito! ':ok>=q.length*.6?'👏 Mandou bem! ':'💪 ')+ok+'/'+q.length+(ok<q.length*.6?' — assiste de novo e tenta outra vez':'')+'</div><div style="text-align:center"><button class="pl-btn g" data-pl="refazer">Refazer</button></div>';
    }else h+='<button class="pl-btn" data-pl="corrigir">✅ Ver resultado</button>';
    if(admin())h+=' <button class="pl-btn g" data-pl="editq">✏️ Editar quiz</button>';
    p.innerHTML=h;
  }
  function corrigir(){
    if(Object.keys(S.sel).length<S.quiz.length){tst('Responde todas as perguntas antes 😉','#f59e0b');return;}
    S.fim=true;painel();
    if(window.MI_APP&&MI_APP.marcarDia)MI_APP.marcarDia();
  }
  /* editor do admin: um bloco por pergunta, separados por linha em branco; a correta começa com * */
  function quizParaTexto(q){return (q||[]).map(function(x){return x.q+'\n'+(x.a||[]).map(function(a,i){return (i===x.c?'*':'')+a;}).join('\n');}).join('\n\n');}
  function textoParaQuiz(t){
    var out=[],err=null;
    t.split(/\n\s*\n/).forEach(function(b,bi){
      var ls=b.split('\n').map(function(l){return l.trim();}).filter(Boolean);if(!ls.length)return;
      var q=ls[0],alts=ls.slice(1),c=-1;
      alts=alts.map(function(a,i){if(a[0]==='*'){c=i;return a.slice(1).trim();}return a;});
      if(alts.length<2||alts.length>4||c<0){err='Pergunta '+(bi+1)+': precisa de 2 a 4 alternativas e uma marcada com * (a correta).';return;}
      out.push({q:q,a:alts,c:c});
    });
    return err?{err:err}:{quiz:out};
  }
  function pintaEditor(p){
    p.innerHTML='<div style="font-size:12.5px;opacity:.8;line-height:1.55;margin-bottom:8px">Uma pergunta por bloco, blocos separados por linha em branco. A 1ª linha é a pergunta, as seguintes são as alternativas (2 a 4). <b>Marque a correta com * na frente.</b> Só pergunte o que o vídeo realmente diz.</div>'
      +'<textarea class="pl-ta" id="pl-qtxt" rows="14" placeholder="O que o pastor disse sobre fé?\n*Fé é confiar mesmo sem ver\nFé é sentir emoção\nFé é uma tradição\n\nOutra pergunta?\nAlternativa A\n*Alternativa B">'+E(quizParaTexto(S.quiz))+'</textarea>'
      +'<div id="pl-qerr" style="color:#ef4444;font-size:12.5px;min-height:18px;margin:6px 0"></div>'
      +'<button class="pl-btn" data-pl="salvarq">💾 Salvar quiz</button> <button class="pl-btn g" data-pl="tab" data-t="quiz">Cancelar</button>';
  }
  function editarQuiz(){S.editando=true;painel();}
  async function salvarQuiz(){
    var r=textoParaQuiz(document.getElementById('pl-qtxt').value);
    if(r.err){document.getElementById('pl-qerr').textContent=r.err;return;}
    var w=r.quiz.length?await SB().from('video_quiz').upsert({video_id:S.cur.id,quiz:r.quiz,updated_at:new Date().toISOString()}):await SB().from('video_quiz').delete().eq('video_id',S.cur.id);
    if(w.error){document.getElementById('pl-qerr').textContent='Erro: '+w.error.message+' (rodou o SQL novo no Supabase?)';return;}
    S.quiz=r.quiz;S.editando=false;S.sel={};S.fim=false;tst('📝 Quiz salvo!','#10b981');painel();
  }

  /* ── comentários ── */
  async function pintaComent(p){
    p.innerHTML='<textarea class="pl-ta" id="pl-ctxt" rows="3" maxlength="1000" placeholder="O que você achou? Comenta em inglês ou português 💬"></textarea><div style="margin:8px 0 16px"><button class="pl-btn" data-pl="enviar">Enviar comentário</button></div><div id="pl-clist"><div class="pl-msg">Carregando…</div></div>';
    var r=await SB().from('video_comentarios').select('*').eq('video_id',S.cur.id).order('created_at',{ascending:false});
    var u=(await SB().auth.getUser()).data.user,uid=u?u.id:null,el=document.getElementById('pl-clist');if(!el)return;
    if(r.error){el.innerHTML='<div class="pl-msg">Comentários indisponíveis agora ('+E(r.error.message)+').</div>';return;}
    if(!r.data.length){el.innerHTML='<div class="pl-msg">Nenhum comentário ainda. Seja o primeiro!</div>';return;}
    el.innerHTML=r.data.map(function(c){
      return '<div class="pl-c"><div class="av">'+(c.is_admin?'👨‍🏫':E((c.user_name||'?')[0].toUpperCase()))+'</div><div style="min-width:0;flex:1"><span class="nm">'+E(c.user_name)+'</span>'+(c.is_admin?' <small style="color:var(--accent,#2563eb);font-weight:800">PROFESSOR</small>':'')
        +((c.user_id===uid||admin())?'<button class="dl" data-pl="apagar" data-id="'+c.id+'">apagar</button>':'')+'<div class="bd">'+E(c.body)+'</div></div></div>';}).join('');
  }
  async function enviarComent(){
    var t=document.getElementById('pl-ctxt'),b=t.value.trim();if(!b)return;
    var u=(await SB().auth.getUser()).data.user;if(!u)return;
    var m=u.user_metadata||{},nome=admin()?'Professor Gediel':(m.full_name||m.name||u.email.split('@')[0]);
    var r=await SB().from('video_comentarios').insert({video_id:S.cur.id,user_id:u.id,user_name:nome,body:b,is_admin:admin()});
    if(r.error){tst('Erro: '+r.error.message,'#ef4444');return;}
    t.value='';tst('💬 Comentário enviado!','#10b981');pintaComent(document.getElementById('pl-painel'));
  }
  async function apagarComent(id){
    var r=await SB().from('video_comentarios').delete().eq('id',id);if(r.error){tst('Erro: '+r.error.message,'#ef4444');return;}
    pintaComent(document.getElementById('pl-painel'));
  }
})();
