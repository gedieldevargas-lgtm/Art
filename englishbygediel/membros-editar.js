/* Edição direta (admin): Lives e textos. Tudo salva sozinho em acesso/cfg (lives, textos). */
(function(){
  var E=function(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});};
  var $=function(i){return document.getElementById(i);};
  var BASE=null,sig='';
  var DIAS=['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
  function ed(){return window.EBG_ED||{on:function(){return false;},cfg:function(){return {};},salvar:function(){return Promise.reject();}};}
  function cfg(){return ed().cfg()||{};}
  function dt(s){if(!s)return null;var m=String(s).match(/^(\d{4})-(\d\d)-(\d\d)/);return m?new Date(+m[1],+m[2]-1,+m[3]):null;}
  function dts(d){return d?d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'):'';}
  function pad(n){return String(n).padStart(2,'0');}

  /* ───────── lives ───────── */
  function snap(){if(BASE||!window.LIVES||!LIVES.length)return;BASE=LIVES.map(function(l){return Object.assign({},l);});}
  function montar(o,base){
    var l=Object.assign({},base||{},o);
    l.iconClass=l.type==='youtube'?'yt':'meet';
    if(!l.icon)l.icon=l.type==='youtube'?'▶️':'💬';
    if(typeof l.startDate==='string')l.startDate=dt(l.startDate);
    if(!l.startDate)delete l.startDate;
    if(!l.nth)delete l.nth;
    return l;
  }
  function aplicarLives(){
    snap();if(!BASE)return;
    var c=cfg().lives||{},mods=c.mods||{},fora=c.fora||[],novas=c.novas||[];
    var lista=BASE.filter(function(b){return fora.indexOf(b.id)<0;}).map(function(b){return montar(mods[b.id]||{},b);}).concat(novas.map(function(n){return montar(n);}));
    LIVES.splice.apply(LIVES,[0,LIVES.length].concat(lista));
  }
  function repintar(){
    if(window.renderLives)renderLives();
    if(window.EBG_EOM&&EBG_EOM.refresh)EBG_EOM.refresh();
    decorar();
  }
  function achar(id){return (window.LIVES||[]).filter(function(x){return x.id===id;})[0];}
  function ehBase(id){return !!(BASE&&BASE.some(function(b){return b.id===id;}));}

  var css=document.createElement('style');
  css.textContent='.tx-ed{outline:2px dashed #f0c34e;outline-offset:3px;border-radius:4px;cursor:text;min-width:20px}.tx-ed:focus{outline-style:solid;background:rgba(240,195,78,.12)}'
  +'.lv-pen{position:absolute;top:8px;right:8px;z-index:3;border:0;border-radius:99px;background:#4f6ef7;color:#fff;font:700 12px/1 inherit;padding:7px 11px;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.35)}'
  +'.live-card,.eom-lr{position:relative}.eom-lr .lv-pen{top:4px;right:4px;padding:5px 8px}'
  +'.lv-new{display:block;width:100%;margin-top:12px;border:2px dashed #4f6ef7;background:transparent;color:#4f6ef7;border-radius:16px;padding:16px;font:700 14px inherit;cursor:pointer}'
  +'#lv-modal{position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:16px}'
  +'#lv-modal .box{background:var(--surface,#fff);color:var(--fg,#111);width:min(560px,100%);max-height:92vh;overflow:auto;border-radius:18px;padding:20px;box-shadow:0 20px 60px rgba(0,0,0,.5)}'
  +'#lv-modal h3{margin:0 0 14px;font-size:18px}#lv-modal .g{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px}#lv-modal .g>div.f{grid-column:1/-1}'
  +'#lv-modal label{display:block;font-size:11px;font-weight:700;opacity:.7;margin-bottom:3px;text-transform:uppercase;letter-spacing:.05em}#lv-modal .admin-inp{width:100%;box-sizing:border-box}'
  +'#lv-modal .bar{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}';
  document.head.appendChild(css);

  function decorar(){
    if(!ed().on()){[].forEach.call(document.querySelectorAll('.lv-pen,.lv-new'),function(x){x.remove();});return;}
    [].forEach.call(document.querySelectorAll('.live-card[data-lid],.eom-lr[data-lid]'),function(c){
      if(c.querySelector('.lv-pen'))return;var b=document.createElement('button');b.className='lv-pen';b.type='button';b.dataset.lv='ed';b.dataset.id=c.dataset.lid;b.textContent='✏️ Editar';c.appendChild(b);});
    var box=$('live-cards-container');
    if(box&&!$('lv-novo')){var n=document.createElement('button');n.id='lv-novo';n.className='lv-new';n.type='button';n.dataset.lv='novo';n.textContent='＋ Nova live';box.insertAdjacentElement('afterend',n);}
  }

  function abrir(id){
    var lv=id?achar(id):null;
    var v=lv||{title:'',sub:'',icon:'💬',day:4,startH:19,startM:0,endH:20,endM:0,link:'',type:'meet',free:false};
    var m=document.createElement('div');m.id='lv-modal';
    m.innerHTML='<div class="box"><h3>'+(lv?'Editar live':'Nova live')+'</h3><div class="g">'
     +'<div class="f"><label>Título</label><input class="admin-inp" id="lm-t" value="'+E(v.title)+'"></div>'
     +'<div class="f"><label>Subtítulo</label><input class="admin-inp" id="lm-s" value="'+E(v.sub)+'"></div>'
     +'<div><label>Dia da semana</label><select class="admin-inp" id="lm-d">'+DIAS.map(function(d,i){return '<option value="'+i+'"'+(v.day===i?' selected':'')+'>'+d+'</option>';}).join('')+'</select></div>'
     +'<div><label>Repete</label><select class="admin-inp" id="lm-n">'+[['','Toda semana'],['1','1ª do mês'],['2','2ª do mês'],['3','3ª do mês'],['4','4ª do mês']].map(function(o){return '<option value="'+o[0]+'"'+(String(v.nth||'')===o[0]?' selected':'')+'>'+o[1]+'</option>';}).join('')+'</select></div>'
     +'<div><label>Começa às</label><input class="admin-inp" type="time" id="lm-i" value="'+pad(v.startH)+':'+pad(v.startM)+'"></div>'
     +'<div><label>Termina às</label><input class="admin-inp" type="time" id="lm-f" value="'+pad(v.endH)+':'+pad(v.endM)+'"></div>'
     +'<div><label>Tipo</label><select class="admin-inp" id="lm-ty">'+[['meet','Google Meet'],['youtube','YouTube'],['grupo','Link no grupo do WhatsApp']].map(function(o){return '<option value="'+o[0]+'"'+(v.type===o[0]?' selected':'')+'>'+o[1]+'</option>';}).join('')+'</select></div>'
     +'<div><label>Ícone (emoji)</label><input class="admin-inp" id="lm-ic" value="'+E(v.icon)+'" maxlength="4"></div>'
     +'<div class="f"><label>Capa da live (link de imagem, opcional)</label><input class="admin-inp" id="lm-cp" value="'+E(v.capa||'')+'" placeholder="https://... (se vazio, usa a miniatura do YouTube)"></div>'
     +'<div class="f"><label>Link da live</label><input class="admin-inp" id="lm-l" value="'+E(v.link||'')+'" placeholder="https://..."></div>'
     +'<div><label>Quem acessa</label><select class="admin-inp" id="lm-fr"><option value="1"'+(v.free?' selected':'')+'>Grátis pra todos</option><option value="0"'+(!v.free?' selected':'')+'>Só dentro dos planos</option></select></div>'
     +'<div><label>Começa a valer em (opcional)</label><input class="admin-inp" type="date" id="lm-sd" value="'+dts(v.startDate)+'"></div></div>'
     +'<div id="lm-st" style="font-size:12px;min-height:18px"></div>'
     +'<div class="bar"><button class="admin-btn admin-btn-primary" data-lv="salvar" data-id="'+E(id||'')+'">Salvar</button><button class="admin-btn admin-btn-ghost" data-lv="fechar">Cancelar</button>'
     +(lv&&ehBase(id)&&((cfg().lives||{}).mods||{})[id]?'<button class="admin-btn admin-btn-ghost" data-lv="reset" data-id="'+E(id)+'">Voltar ao original</button>':'')
     +(lv?'<button class="admin-btn admin-btn-ghost" style="color:#e55;margin-left:auto" data-lv="apagar" data-id="'+E(id)+'">Apagar</button>':'')+'</div></div>';
    document.body.appendChild(m);
  }
  async function gravar(fn){
    var cur=JSON.parse(JSON.stringify(cfg().lives||{}));cur.mods=cur.mods||{};cur.fora=cur.fora||[];cur.novas=cur.novas||[];
    fn(cur);await ed().salvar({lives:cur});aplicarLives();repintar();
  }
  function ler(){
    var hm=function(s){var p=(s||'0:0').split(':');return [+p[0]||0,+p[1]||0];},i=hm($('lm-i').value),f=hm($('lm-f').value);
    return {title:$('lm-t').value.trim(),sub:$('lm-s').value.trim(),day:+$('lm-d').value,nth:$('lm-n').value?+$('lm-n').value:0,startH:i[0],startM:i[1],endH:f[0],endM:f[1],
      type:$('lm-ty').value,icon:$('lm-ic').value.trim(),link:$('lm-l').value.trim(),capa:$('lm-cp').value.trim(),free:$('lm-fr').value==='1',startDate:$('lm-sd').value||''};
  }
  function toast(t){if(window.toast)window.toast(t,'#10b981');}

  document.addEventListener('click',async function(e){
    var b=e.target.closest&&e.target.closest('[data-lv]');if(!b||!b.dataset.lv||['ed','novo','salvar','fechar','reset','apagar'].indexOf(b.dataset.lv)<0)return;
    e.preventDefault();e.stopPropagation();var a=b.dataset.lv,id=b.dataset.id;
    if(a==='ed')return abrir(id);if(a==='novo')return abrir(null);
    if(a==='fechar'){var m=$('lv-modal');if(m)m.remove();return;}
    try{
      if(a==='salvar'){var o=ler();if(!o.title){$('lm-st').textContent='Põe um título.';return;}
        $('lm-st').textContent='Salvando…';
        await gravar(function(c){if(id){if(ehBase(id))c.mods[id]=o;else{c.novas=c.novas.map(function(n){return n.id===id?Object.assign({},n,o):n;});}}else c.novas.push(Object.assign({id:'x'+Date.now().toString(36)},o));});
        $('lv-modal').remove();toast('✅ Live salva');}
      if(a==='reset'){await gravar(function(c){delete c.mods[id];});$('lv-modal').remove();toast('Voltou ao original');}
      if(a==='apagar'){if(b.dataset.ok!=='1'){b.dataset.ok='1';b.textContent='Toque de novo pra apagar';return;}
        await gravar(function(c){if(ehBase(id)){if(c.fora.indexOf(id)<0)c.fora.push(id);}else c.novas=c.novas.filter(function(n){return n.id!==id;});});$('lv-modal').remove();toast('🗑️ Live apagada');}
    }catch(err){var s=$('lm-st');if(s)s.textContent='Não salvou: '+((err&&err.message)||'tente de novo');}
  },true);

  /* ───────── textos editáveis (data-tx) ───────── */
  var OK={B:1,STRONG:1,I:1,EM:1,BR:1};
  function limpa(h){var d=document.createElement('div');d.innerHTML=h;
    (function w(n){[].slice.call(n.childNodes).forEach(function(c){if(c.nodeType===1){if(!OK[c.tagName]){c.replaceWith.apply(c,[].slice.call(c.childNodes));}else{[].slice.call(c.attributes).forEach(function(at){c.removeAttribute(at.name);});w(c);}}else if(c.nodeType!==3)c.remove();});})(d);
    // o replaceWith pode ter deixado filhos novos sem passar pelo filtro: repete até estabilizar
    var again=true,g=0;while(again&&g++<5){again=false;[].forEach.call(d.querySelectorAll('*'),function(x){if(!OK[x.tagName]){x.replaceWith.apply(x,[].slice.call(x.childNodes));again=true;}else[].slice.call(x.attributes).forEach(function(at){x.removeAttribute(at.name);});});}
    return d.innerHTML;}
  function aplicarTextos(){
    var tx=cfg().textos||{},on=ed().on();
    [].forEach.call(document.querySelectorAll('[data-tx]'),function(el){
      if(el.dataset.def===undefined)el.dataset.def=el.innerHTML;
      var k=el.dataset.tx;
      if(!(el===document.activeElement||el.contains(document.activeElement))){var want=tx[k]!=null?limpa(tx[k]):el.dataset.def;if(el.innerHTML!==want)el.innerHTML=want;}
      if(on){if(el.contentEditable!=='true'){el.contentEditable='true';el.classList.add('tx-ed');el.spellcheck=false;}}
      else if(el.classList.contains('tx-ed')){el.removeAttribute('contenteditable');el.classList.remove('tx-ed');}
    });
  }
  document.addEventListener('keydown',function(e){var t=e.target.closest&&e.target.closest('[data-tx].tx-ed');if(!t)return;
    if(e.key==='Enter'){e.preventDefault();document.execCommand('insertLineBreak');}
    if(e.key==='Escape'){t.blur();}});
  document.addEventListener('click',function(e){if(ed().on()&&e.target.closest&&e.target.closest('[data-tx].tx-ed'))e.stopPropagation();},true);
  document.addEventListener('focusout',async function(e){
    var t=e.target.closest&&e.target.closest('[data-tx].tx-ed');if(!t)return;
    var h=limpa(t.innerHTML).replace(/^(<br>)+|(<br>)+$/g,'').trim(),k=t.dataset.tx,cur=(cfg().textos||{})[k];
    if(h===(cur!=null?cur:t.dataset.def))return;
    var nt=Object.assign({},cfg().textos||{});if(!h||h===t.dataset.def)delete nt[k];else nt[k]=h;
    try{await ed().salvar({textos:nt});toast('✅ Texto salvo');}catch(err){if(window.toast)window.toast('Não salvou o texto','#ef4444');}
    aplicarTextos();
  },true);

  document.addEventListener('ebg-edit',function(){aplicarTextos();decorar();});
  /* acompanha mudanças de config e re-renderizações */
  setInterval(function(){
    var c=cfg(),s=JSON.stringify([c.lives,c.textos]);
    if(s!==sig){sig=s;aplicarLives();repintar();}
    aplicarTextos();decorar();
  },900);
  window.EBG_EDITAR={abrir:abrir,limpa:limpa};
})();
