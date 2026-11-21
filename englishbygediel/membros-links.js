/* Central de Links (admin): copiar / mandar no WhatsApp */
(function(){
  var E=function(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});};
  var base=function(){return location.origin+location.pathname.replace(/[^\/]*$/,'');};
  function grupos(){
    var cf=(window.EBG_ACESSO&&EBG_ACESSO.estado&&EBG_ACESSO.estado.cfg)||{},b=base();
    var g=[
     {t:'📝 Cadastro direto (a pessoa cria o próprio login)',d:'Cada link já leva ao tutorial certo no 1º acesso.',l:[
       ['Grátis · plataforma completa (só o que é livre)',b+'cadastro.html?u=gratis'],
       ['English on Mission (entra só no menu EOM)',b+'cadastro.html?u=eom'],
       ['Culture English (entra só no Culture)',b+'cadastro.html?u=culture']]},
     {t:'🔑 Entrar (quem já tem login)',d:'Depois da compra na Kiwify, mande/cadastre este link: o tutorial muda sozinho conforme o que a pessoa comprou.',l:[['Login da plataforma',b+'membros.html']]},
     {t:'🧲 Captadores (geram lead)',d:'Páginas que pegam nome/e-mail e levam pro cadastro.',l:[
       ['Início / Hub',b+'index.html'],['Catálogo',b+'catalogo.html'],['Bússola (teste de nível)',b+'bussola.html'],['Prisma de Talentos',b+'prisma.html'],
       ['Maratonas',b+'maratonas.html'],['Entrar na Maratona',b+'maratona-entrar.html'],['Jogos',b+'jogos.html'],['Central de Prompts',b+'central-prompts.html']]}
    ];
    var ck=[];
    if(cf.checkout)ck.push(['Checkout · Programa',cf.checkout]);
    if(cf.checkoutEom)ck.push(['Checkout · English on Mission',cf.checkoutEom]);
    ((cf.planos)||[]).forEach(function(p){if(p&&p.checkout&&p.nome)ck.push(['Checkout · '+p.nome,p.checkout]);});
    if(ck.length)g.push({t:'🛒 Checkouts (Kiwify)',d:'Configure em Planos. Na Kiwify, a "página de obrigado" deve apontar pro login (membros.html).',l:ck});
    return g;
  }
  function linha(n,u){
    return '<div class="lk-r"><div class="lk-n">'+E(n)+'</div><input class="admin-inp lk-u" readonly value="'+E(u)+'">'
     +'<button class="admin-btn" data-lk="c" data-u="'+E(u)+'">Copiar</button>'
     +'<a class="admin-btn" target="_blank" rel="noopener" href="https://wa.me/?text='+encodeURIComponent(u)+'">WhatsApp</a></div>';
  }
  function css(){
    if(document.getElementById('lk-css'))return;
    var s=document.createElement('style');s.id='lk-css';
    s.textContent='.lk-g{margin:0 0 22px}.lk-g h4{margin:0 0 2px;font-size:15px}.lk-g p{margin:0 0 10px;font-size:12px;opacity:.7;line-height:1.5}'
    +'.lk-r{display:grid;grid-template-columns:minmax(120px,1.1fr) minmax(0,2fr) auto auto;gap:8px;align-items:center;margin-bottom:8px}'
    +'.lk-n{font-size:13px;font-weight:600}.lk-u{font-size:12px;min-width:0}.lk-r .admin-btn{text-decoration:none;white-space:nowrap;text-align:center}'
    +'@media(max-width:700px){.lk-r{grid-template-columns:1fr 1fr}.lk-n,.lk-u{grid-column:1/-1}}';
    document.head.appendChild(s);
  }
  function convites(){
    var pl=(window.EBG_CV&&EBG_CV.planos())||[];
    return '<div class="lk-g"><h4>🎟️ Link de uso único com plano liberado</h4><p>A pessoa cria o login e já entra com o acesso do plano escolhido. O link vale uma vez só.</p>'
      +'<div class="lk-r" style="grid-template-columns:1fr 1fr auto"><select class="admin-inp" id="lk-pl">'+pl.map(function(p){return '<option value="'+E(p.k)+'">'+E(p.nome||p.k)+'</option>';}).join('')+'</select>'
      +'<input class="admin-inp" id="lk-nm" placeholder="Pra quem? (opcional)"><button class="admin-btn" data-lk="g">Gerar link</button></div>'
      +'<div id="lk-out"></div></div>';
  }
  function montar(){
    var h=document.getElementById('adm-links');if(!h)return;css();
    h.innerHTML='<div class="admin-form"><h3 style="margin:0 0 4px">🔗 Central de Links</h3><p style="margin:0 0 16px;font-size:12.5px;opacity:.75;line-height:1.5">Tudo que você precisa mandar pra alguém, num lugar só. Quer criar o login você mesmo? Use a aba <b>➕ Criar Acesso</b>.</p>'
      +convites()+grupos().map(function(g){return '<div class="lk-g"><h4>'+g.t+'</h4><p>'+g.d+'</p>'+g.l.map(function(x){return linha(x[0],x[1]);}).join('')+'</div>';}).join('')+'</div>';
  }
  document.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest('[data-lk]');if(!b)return;
    if(b.dataset.lk==='c'){var u=b.dataset.u;var ok=function(){b.textContent='✓ Copiado';setTimeout(function(){b.textContent='Copiar';},1500);};
      if(navigator.clipboard)navigator.clipboard.writeText(u).then(ok,function(){var i=b.parentNode.querySelector('.lk-u');i.select();document.execCommand('copy');ok();});else{var i=b.parentNode.querySelector('.lk-u');i.select();document.execCommand('copy');ok();}}
    if(b.dataset.lk==='g'){var out=document.getElementById('lk-out');out.innerHTML='<div style="font-size:12px">Gerando…</div>';
      EBG_CV.gerar(document.getElementById('lk-pl').value,document.getElementById('lk-nm').value.trim()).then(function(u){out.innerHTML=linha('Convite novo',u);}).catch(function(){out.innerHTML='<div style="color:#e66;font-size:12px">Não consegui gerar. Tenta de novo.</div>';});}
  });
  window.EBG_LINKS={montar:montar};
})();
