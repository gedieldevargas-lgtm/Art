/* Plataforma Inteligente — camada do app do aluno.
   - Entrada: vídeo de boas-vindas no 1º acesso + "onde você está agora?" toda vez que abre
   - Home: checklist de hoje, lives, a aula da vez (anterior/próxima), sequência real, indicação
   - Universos (English On Mission, Culture, Viagens): cards vindos do Supabase (tabela mi_uni_cards), editáveis no admin
   - Mini cursos avulsos (módulo com trilha 'mini'), liberados por produto
   - Jogos jogáveis (Flashcards, Monta Frase, Complete, Quiz Phrasal)
   - Menu Prompts, navegação de baixo no celular e instalação como app */
(function(){
  'use strict';
  var WA='5555999895429', SITE='https://englishbygediel.netlify.app/';
  var E=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});};
  var $=function(id){return document.getElementById(id);};
  var pad=function(n){return String(n).padStart(2,'0');};
  var dia=function(d){d=d||new Date();return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());};
  var LS={get:function(k,d){try{var v=localStorage.getItem(k);return v==null?d:JSON.parse(v);}catch(e){return d;}},set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}};
  var wa=function(txt,num){window.open('https://wa.me/'+(num===false?'':WA)+'?text='+encodeURIComponent(txt),'_blank','noopener');};
  var pill=function(p){return [].filter.call(document.querySelectorAll('.nav-pill'),function(n){return (n.getAttribute('onclick')||'').indexOf("'"+p+"'")>=0;})[0]||null;};
  var go=function(p){window.goTo(p,pill(p));};
  var CTX=[
    {k:'Em Casa',ic:'🏠',lb:'Em casa',hint:'Tempo pra estudar com calma'},
    {k:'No Transporte',ic:'🚌',lb:'No transporte',hint:'Fone no ouvido, mãos ocupadas'},
    {k:'No Trabalho',ic:'💼',lb:'No trabalho',hint:'Pausas curtas entre tarefas'},
    {k:'Na Academia',ic:'🏋️',lb:'Na academia',hint:'Treino com inglês no fone'}
  ];

  /* ───────────────────────── estilo ───────────────────────── */
  var css=document.createElement('style');
  css.textContent=[
  '.nav-pill[onclick*="\'devocionais\'"]{display:none!important}',
  /* entrada */
  '#mi-entry{position:fixed;inset:0;z-index:9000;background:radial-gradient(ellipse at 20% 0%,#3b4fd8 0%,#1b1f4b 45%,#0b0d1c 100%);color:#fff;display:none;align-items:center;justify-content:center;padding:20px;overflow-y:auto;opacity:0;transition:opacity .35s}',
  '#mi-entry.on{display:flex}#mi-entry.vis{opacity:1}',
  '.mi-ent-box{width:100%;max-width:640px;margin:auto}',
  '.mi-ent-kicker{font-size:11px;font-weight:800;letter-spacing:1.6px;text-transform:uppercase;opacity:.65;text-align:center}',
  '.mi-ent-q{font-size:clamp(22px,4.6vw,30px);font-weight:800;text-align:center;line-height:1.2;margin:8px 0 6px;text-wrap:balance}',
  '.mi-ent-s{font-size:13.5px;opacity:.75;text-align:center;line-height:1.55;max-width:460px;margin:0 auto 22px}',
  '.mi-ctx{display:grid;grid-template-columns:1fr 1fr;gap:12px}',
  '.mi-ctx button{background:rgba(255,255,255,.08);border:1.5px solid rgba(255,255,255,.14);border-radius:20px;color:#fff;padding:20px 14px;cursor:pointer;text-align:left;display:flex;flex-direction:column;gap:6px;opacity:0;transform:translateY(14px);animation:miUp .45s cubic-bezier(.22,1,.36,1) forwards;transition:background .15s,border-color .15s,transform .12s}',
  '.mi-ctx button:hover{background:rgba(255,255,255,.14);border-color:rgba(255,255,255,.4)}.mi-ctx button:active{transform:scale(.96)}',
  '.mi-ctx .ic{font-size:34px;line-height:1}.mi-ctx .lb{font-size:16px;font-weight:800}.mi-ctx .ht{font-size:11.5px;opacity:.7;line-height:1.4}',
  '.mi-ctx-skip{display:block;margin:18px auto 0;background:none;border:none;color:rgba(255,255,255,.6);font-size:12.5px;cursor:pointer;text-decoration:underline;text-underline-offset:3px}',
  '@keyframes miUp{to{opacity:1;transform:none}}',
  '.mi-video{position:relative;width:100%;aspect-ratio:16/9;border-radius:18px;overflow:hidden;background:#000;box-shadow:0 20px 60px rgba(0,0,0,.45);margin-bottom:18px}',
  '.mi-video iframe{position:absolute;inset:0;width:100%;height:100%;border:0}',
  '.mi-video .ph{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;background:linear-gradient(135deg,#4f6ef7,#8b5cf6);font-weight:800;text-align:center;padding:20px}',
  '.mi-steps{display:grid;gap:8px;margin-bottom:20px}',
  '.mi-steps div{display:flex;gap:12px;align-items:center;background:rgba(255,255,255,.07);border-radius:14px;padding:11px 14px;font-size:13px;line-height:1.45}',
  '.mi-steps b{width:28px;height:28px;border-radius:9px;background:rgba(255,255,255,.16);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:15px}',
  '.mi-cta{position:sticky;bottom:max(12px,env(safe-area-inset-bottom));box-shadow:0 10px 30px rgba(0,0,0,.35);display:block;width:100%;background:#fff;color:#1b1f4b;border:none;border-radius:16px;padding:16px;font-size:15px;font-weight:800;cursor:pointer}',
  '.mi-cta:active{transform:scale(.98)}',
  /* home */
  '.hm-greet{font-size:22px;font-weight:800;line-height:1.2}',
  '.hm-sub{font-size:13px;color:var(--fg2);margin:4px 0 18px}',
  '.hm-row{display:grid;grid-template-columns:1.25fr 1fr;gap:12px;margin-bottom:22px}',
  '.hm-big{border:none;border-radius:22px;padding:18px;cursor:pointer;color:#fff;text-align:left;display:flex;flex-direction:column;gap:6px;min-height:150px;position:relative;overflow:hidden;box-shadow:var(--shadow);transition:transform .12s}',
  '.hm-big:active{transform:scale(.97)}',
  '.hm-big .ic{font-size:46px;line-height:1;margin-bottom:auto}',
  '.hm-big .lb{font-size:15px;font-weight:800}',
  '.hm-big .pg{font-size:11.5px;opacity:.85}',
  '.hm-big .bar{height:6px;border-radius:99px;background:rgba(255,255,255,.25);overflow:hidden;margin-top:4px}.hm-big .bar i{display:block;height:100%;background:#fff;border-radius:99px;transition:width .4s}',
  '.hm-check{background:linear-gradient(135deg,#10b981,#059669)}',
  '.hm-live{background:linear-gradient(135deg,#ef4444,#b91c1c)}',
  '.hm-live.off{background:linear-gradient(135deg,#334155,#1e293b)}',
  '.hm-live .dot{position:absolute;top:16px;right:16px;font-size:10px;font-weight:800;letter-spacing:.6px;background:#fff;color:#ef4444;padding:3px 8px;border-radius:99px;animation:miPulse 1.4s infinite}',
  '@keyframes miPulse{50%{opacity:.55}}',
  '.hm-aula{background:var(--surface);border:1px solid var(--border);border-radius:22px;overflow:hidden;box-shadow:var(--shadow);margin-bottom:22px}',
  '.hm-aula{container-type:inline-size}.hm-aula .cv{position:relative;width:100%;height:min(52vh,56.25cqw);background:radial-gradient(ellipse at 18% 22%,#d2e6ff 0%,#6fa5ff 22%,#3060d0 46%,#0c1a60 70%,#040b28 100%);display:flex;align-items:center;justify-content:center;font-size:54px;cursor:pointer;overflow:hidden}',
  '.hm-aula .cv img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}',
  '.hm-aula .cv .play{position:relative;width:74px;height:74px;border-radius:50%;background:rgba(255,255,255,.95);color:#4f6ef7;display:flex;align-items:center;justify-content:center;font-size:28px;box-shadow:0 10px 30px rgba(0,0,0,.35);padding-left:5px}',
  '.hm-aula .cv .lock{position:relative;background:rgba(10,14,30,.75);color:#fff;font-size:13px;font-weight:800;padding:9px 16px;border-radius:99px;backdrop-filter:blur(4px)}',
  '.hm-aula .cv .kick{position:absolute;top:14px;left:14px;background:rgba(10,14,30,.75);color:#fff;font-size:10px;font-weight:800;letter-spacing:.6px;padding:4px 10px;border-radius:8px;backdrop-filter:blur(4px)}',
  '.hm-aula .bd{padding:14px 16px 16px}',
  '.hm-aula .md{font-size:11px;font-weight:800;color:var(--accent);letter-spacing:.3px}',
  '.hm-aula .tt{font-size:18px;font-weight:800;line-height:1.25;margin:4px 0 6px;text-wrap:balance}',
  '.hm-aula .st{font-size:12px;color:var(--fg2)}',
  '.hm-nav{display:grid;grid-template-columns:auto 1fr auto;gap:8px;margin-top:14px}',
  '.hm-nav button{border:1.5px solid var(--border);background:var(--surface2);color:var(--fg);border-radius:12px;padding:11px 14px;font-size:13px;font-weight:800;cursor:pointer}',
  '.hm-nav button.main{background:linear-gradient(135deg,#4f6ef7,#8b5cf6);color:#fff;border-color:transparent}',
  '.hm-nav button:disabled{opacity:.35;cursor:default}',
  '.hm-quick{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:22px}',
  '.hm-quick button{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:12px 6px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px;font-size:11px;font-weight:700;color:var(--fg2);box-shadow:var(--shadow)}',
  '.hm-quick button span{font-size:24px}',
  '.hm-unis{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:22px}',
  '.hm-uni{border-radius:16px;padding:14px;color:#fff;cursor:pointer;min-height:88px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:var(--shadow);border:none;text-align:left}',
  '.hm-uni b{font-size:13px;line-height:1.25}.hm-uni span{font-size:22px}',
  '.hm-ref{background:linear-gradient(135deg,rgba(245,158,11,.12),rgba(239,68,68,.08));border:1px solid rgba(245,158,11,.25);border-radius:20px;padding:18px;display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin-bottom:22px}',
  '.hm-ref .t{font-size:15px;font-weight:800}.hm-ref .s{font-size:12px;color:var(--fg2);line-height:1.5;margin-top:3px;max-width:440px}',
  '.hm-ref .bts{display:flex;gap:8px;margin-left:auto;flex-wrap:wrap}',
  '.hm-ref button{border:none;border-radius:12px;padding:10px 14px;font-size:12.5px;font-weight:800;cursor:pointer}',
  '.hm-install{background:var(--surface);border:1.5px dashed var(--accent);border-radius:16px;padding:14px;display:flex;gap:12px;align-items:center;margin-bottom:18px;font-size:12.5px;line-height:1.5}',
  '.hm-install button{margin-left:auto;background:var(--accent);color:#fff;border:none;border-radius:10px;padding:9px 12px;font-weight:800;font-size:12px;cursor:pointer;white-space:nowrap}',
  '@media(max-width:560px){.hm-row{grid-template-columns:1fr 1fr}.hm-big{min-height:132px;padding:15px}.hm-big .ic{font-size:40px}.hm-unis{grid-template-columns:1fr 1fr 1fr;gap:8px}.hm-uni{padding:11px;min-height:80px}.hm-uni b{font-size:11.5px}.hm-ref .bts{margin-left:0;width:100%}.hm-ref .bts button{flex:1}}',
  /* universos */
  '.uni-hero{border-radius:20px;padding:22px;color:#fff;margin-bottom:20px;display:flex;gap:16px;align-items:center;flex-wrap:wrap;box-shadow:var(--shadow);cursor:pointer;position:relative;overflow:hidden}',
  '.uni-hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.35}',
  '.uni-hero>div,.uni-hero>button{position:relative}',
  '.uni-hero .ht{font-size:18px;font-weight:800;line-height:1.25}.uni-hero .hs{font-size:12.5px;opacity:.9;margin-top:4px;line-height:1.5;max-width:520px}',
  '.uni-hero button{margin-left:auto;background:#fff;color:#111;border:none;border-radius:12px;padding:11px 18px;font-size:13px;font-weight:800;cursor:pointer;white-space:nowrap}',
  '.uni-sec{font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--fg2);margin:22px 0 10px}',
  '.uni-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:14px}',
  '.uni-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;overflow:hidden;cursor:pointer;display:flex;flex-direction:column;transition:transform .15s,border-color .15s;box-shadow:var(--shadow)}',
  '.uni-card:hover{transform:translateY(-3px);border-color:var(--accent)}',
  '.uni-card .th{aspect-ratio:16/9;background:var(--surface2);position:relative;display:flex;align-items:center;justify-content:center;font-size:38px;overflow:hidden}',
  '.uni-card .th img{width:100%;height:100%;object-fit:cover;display:block}',
  '.uni-card .tg{position:absolute;top:8px;left:8px;background:rgba(10,14,30,.78);color:#fff;font-size:9.5px;font-weight:800;letter-spacing:.3px;padding:3px 8px;border-radius:7px}',
  '.uni-card.buy .tg{background:#10b981}.uni-card.soon{opacity:.85}.uni-card.soon .tg{background:#f59e0b;color:#1a1200}.uni-card.lock .th:after{content:"🔒";position:absolute;top:8px;right:10px;font-size:16px}',
  '.uni-card .bd{padding:11px 12px 13px;display:flex;flex-direction:column;gap:4px;flex:1}',
  '.uni-card .tt{font-size:13px;font-weight:800;line-height:1.3}.uni-card .ss{font-size:11px;color:var(--fg2);line-height:1.5;flex:1}',
  '.uni-card .ac{font-size:11px;font-weight:800;color:var(--accent);margin-top:6px}',
  '@media(max-width:560px){.uni-grid{grid-template-columns:repeat(2,1fr);gap:10px}.uni-hero button{margin-left:0;width:100%}.uni-card .ss{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}}',
  /* jogos */
  '.game-app-icon{position:relative}.mi-soon{position:absolute;top:-4px;left:50%;transform:translateX(-50%);background:#f59e0b;color:#1a1200;font-size:8px;font-weight:800;padding:2px 6px;border-radius:6px;white-space:nowrap}',
  '.mi-play{position:absolute;top:-4px;left:50%;transform:translateX(-50%);background:#10b981;color:#fff;font-size:8px;font-weight:800;padding:2px 6px;border-radius:6px;white-space:nowrap}',
  '#mi-game{position:fixed;inset:0;z-index:8000;background:var(--bg);display:none;flex-direction:column}',
  '#mi-game.on{display:flex}',
  '.mg-top{display:flex;align-items:center;gap:12px;padding:14px 18px;border-bottom:1px solid var(--border);padding-top:max(14px,env(safe-area-inset-top))}',
  '.mg-top .x{background:var(--surface2);border:1px solid var(--border);border-radius:10px;width:36px;height:36px;font-size:16px;cursor:pointer;color:var(--fg)}',
  '.mg-top .nm{font-weight:800;font-size:15px;flex:1}.mg-top .sc{font-size:12px;font-weight:800;color:var(--fg2)}',
  '.mg-prog{height:5px;background:var(--surface2)}.mg-prog i{display:block;height:100%;background:linear-gradient(90deg,#4f6ef7,#8b5cf6);transition:width .3s}',
  '.mg-body{flex:1;overflow-y:auto;padding:22px 18px 40px;display:flex;flex-direction:column;align-items:center}',
  '.mg-in{width:100%;max-width:520px}',
  '.mg-card{background:var(--surface);border:1px solid var(--border);border-radius:22px;padding:28px 20px;text-align:center;box-shadow:var(--shadow);min-height:220px;display:flex;flex-direction:column;justify-content:center;gap:10px;cursor:pointer}',
  '.mg-card .w{font-size:28px;font-weight:800;line-height:1.2}.mg-card .h{font-size:12px;color:var(--fg3)}.mg-card .pt{font-size:20px;font-weight:800;color:var(--accent)}.mg-card .ex{font-size:13px;color:var(--fg2);font-style:italic;line-height:1.5}',
  '.mg-bts{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px}',
  '.mg-bts button,.mg-btn{border:none;border-radius:14px;padding:14px;font-size:14px;font-weight:800;cursor:pointer}',
  '.mg-q{font-size:18px;font-weight:800;line-height:1.4;text-align:center;margin:6px 0 18px}',
  '.mg-opt{display:block;width:100%;text-align:left;background:var(--surface);border:1.5px solid var(--border);border-radius:14px;padding:13px 14px;font-size:14px;font-weight:600;color:var(--fg);cursor:pointer;margin-bottom:9px}',
  '.mg-opt.ok{border-color:var(--green);background:rgba(16,185,129,.12)}.mg-opt.bad{border-color:var(--red);background:rgba(239,68,68,.1)}',
  '.mg-fb{font-size:13px;line-height:1.55;color:var(--fg2);text-align:center;margin:6px 0 12px;min-height:20px}',
  '.mg-line{min-height:60px;border:2px dashed var(--border);border-radius:16px;padding:10px;display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:14px}',
  '.mg-line.ok{border-color:var(--green);border-style:solid}.mg-line.bad{border-color:var(--red);border-style:solid}',
  '.mg-bank{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:16px}',
  '.mg-chip{background:var(--surface);border:1.5px solid var(--border);border-radius:12px;padding:9px 13px;font-size:15px;font-weight:700;color:var(--fg);cursor:pointer}',
  '.mg-chip.used{visibility:hidden}',
  '.mg-end{text-align:center}.mg-end .big{font-size:60px}.mg-end .t{font-size:24px;font-weight:800;margin:6px 0}.mg-end .s{font-size:14px;color:var(--fg2);margin-bottom:20px}',
  /* menu prompts */
  '.mi-frame{width:100%;height:calc(100vh - 170px);min-height:480px;border:1px solid var(--border);border-radius:18px;background:var(--surface)}',
  /* respiro e áreas seguras (iPad, app instalado, telas com borda arredondada) */
  '.sidebar{padding-top:env(safe-area-inset-top);padding-left:env(safe-area-inset-left)}',
  '.topbar{padding-top:env(safe-area-inset-top)!important;height:calc(52px + env(safe-area-inset-top))!important;padding-right:max(22px,env(safe-area-inset-right))!important}',
  '.right-rail{padding-right:max(14px,env(safe-area-inset-right))!important;padding-bottom:max(18px,env(safe-area-inset-bottom))!important}',
  '.sidebar-footer{padding-bottom:max(10px,env(safe-area-inset-bottom))!important}',
  '@media(min-width:681px){.content{padding:28px clamp(22px,3.2vw,44px) max(40px,env(safe-area-inset-bottom))!important}.content>.pane{max-width:1000px;margin-left:auto;margin-right:auto}}',
  '@media(min-width:681px) and (max-width:1100px){.hm-row{gap:14px}.uni-grid{grid-template-columns:repeat(auto-fill,minmax(190px,1fr))}}',
  '.hm-aula .cv .capa-auto{align-items:flex-end;padding-bottom:7%}.hm-aula .cv .capa-auto span{font-size:clamp(14px,6.2cqw,52px)}',
  /* marcar aula */
  '.ag-wrap{max-width:760px}.ag-h1{font-size:24px;font-weight:800;letter-spacing:-.4px}.ag-sub{font-size:14px;color:var(--fg2);margin:4px 0 18px;line-height:1.5}',
  '.ag-box{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:18px;margin-bottom:14px;box-shadow:var(--shadow)}',
  '.ag-t{display:flex;align-items:center;gap:10px;font-size:16px;font-weight:800;margin-bottom:14px}.ag-n{width:26px;height:26px;border-radius:50%;background:var(--accent);color:#fff;font-size:13px;display:grid;place-items:center;flex:none}',
  '.ag-tipos{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px}',
  '.ag-tipo{display:flex;flex-direction:column;align-items:flex-start;gap:4px;text-align:left;background:var(--bg2,rgba(127,127,127,.06));border:2px solid transparent;border-radius:16px;padding:14px;cursor:pointer;color:var(--fg);font:inherit}',
  '.ag-tipo .ic{font-size:26px}.ag-tipo b{font-size:15px}.ag-tipo small{font-size:12px;color:var(--fg2);line-height:1.4}.ag-tipo.on{border-color:var(--accent);background:color-mix(in srgb,var(--accent) 10%,transparent)}',
  '.ag-lb{font-size:13px;font-weight:700;margin:14px 0 8px}.ag-chips,.ag-dias,.ag-horas{display:flex;flex-wrap:wrap;gap:8px}',
  '.ag-chip,.ag-dia,.ag-hora{border:1.5px solid var(--border);background:var(--surface);color:var(--fg);border-radius:999px;padding:9px 14px;font:inherit;font-size:13px;font-weight:700;cursor:pointer}',
  '.ag-chip.on,.ag-dia.on,.ag-hora.on{background:var(--accent);border-color:var(--accent);color:#fff}.ag-dias{overflow-x:auto;flex-wrap:nowrap;padding-bottom:4px;margin-bottom:12px}.ag-dia{flex:none}.ag-hora{min-width:72px}',
  '.ag-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.ag-box label{display:flex;flex-direction:column;gap:6px;font-size:13px;font-weight:700}.ag-box label span{font-weight:500;color:var(--fg3)}.ag-full{margin-top:14px}',
  '.ag-box input,.ag-box textarea{border:1.5px solid var(--border);background:var(--surface);color:var(--fg);border-radius:12px;padding:11px 12px;font:inherit;font-size:16px;font-weight:500;width:100%;box-sizing:border-box;resize:vertical}',
  '.ag-nota{font-size:12px;color:var(--fg3);margin-top:12px}.ag-vazio{font-size:14px;color:var(--fg2);margin-bottom:12px;line-height:1.5}',
  '.ag-btn{width:100%;border:none;border-radius:16px;padding:16px;font:inherit;font-size:15px;font-weight:800;color:#fff;background:linear-gradient(135deg,#4f6ef7,#8b5cf6);cursor:pointer;margin-top:4px}.ag-btn:disabled{opacity:.5;cursor:default}',
  '.ag-btn2{border:1.5px solid var(--border);background:var(--surface);color:var(--fg);border-radius:14px;padding:12px 16px;font:inherit;font-size:14px;font-weight:700;cursor:pointer;margin-top:10px}',
  '.ag-ped-l{display:flex;gap:8px;flex-wrap:wrap;font-size:14px;padding:6px 0;border-top:1px solid var(--border)}.ag-ped-l span{color:var(--fg2)}',
  '.ag-feito{text-align:center;padding:30px 20px}.ag-feito .ag-btn2{width:100%}.ag-ok-ic{font-size:44px}',
  '@media(max-width:560px){.ag-grid{grid-template-columns:1fr}.ag-tipos{grid-template-columns:1fr 1fr}}',
  /* celular: menu de baixo + gaveta */
  '#mi-bnav,#mi-shade{display:none}',
  '@media(max-width:680px){',
  ' .sidebar{position:fixed!important;top:0;bottom:0;left:-280px;width:262px!important;min-width:262px!important;z-index:960;transition:left .25s cubic-bezier(.22,1,.36,1);box-shadow:0 0 40px rgba(0,0,0,.35)}',
  ' .sidebar.mi-open{left:0}',
  ' .sidebar .logo-text,.sidebar .logo-sub,.sidebar .user-name,.sidebar .user-sub{display:block!important}',
  ' .sidebar .nav-section{display:block!important}.sidebar .sidebar-level{display:block!important}',
  ' .sidebar .nav-pill span:not(.nav-icon){display:inline!important}.sidebar .nav-badge{display:inline-block!important}',
  ' .sidebar .nav-pill{justify-content:flex-start!important;padding:11px 12px!important;margin:1px 10px!important}',
  ' .sidebar .user-chip{justify-content:flex-start!important}',
  ' #mi-shade{display:block;position:fixed;inset:0;background:rgba(5,8,20,.5);z-index:950;opacity:0;pointer-events:none;transition:opacity .25s}',
  ' #mi-shade.on{opacity:1;pointer-events:auto}',
  ' #mi-bnav{display:grid;grid-template-columns:repeat(5,1fr);position:fixed;left:0;right:0;bottom:0;z-index:150;background:var(--sidebar);border-top:1px solid var(--border);padding:6px 4px calc(6px + env(safe-area-inset-bottom))}',
  ' #mi-bnav button{background:none;border:none;color:var(--fg3);display:flex;flex-direction:column;align-items:center;gap:2px;font-size:10px;font-weight:700;padding:4px 0;cursor:pointer}',
  ' #mi-bnav button span{font-size:21px;line-height:1.1}',
  ' #mi-bnav button.on{color:var(--accent)}',
  ' .content{padding:16px max(16px,env(safe-area-inset-right)) calc(96px + env(safe-area-inset-bottom)) max(16px,env(safe-area-inset-left))!important}',
  ' .topbar{padding-left:max(16px,env(safe-area-inset-left))!important;padding-right:max(16px,env(safe-area-inset-right))!important}',
  ' body:has(.modal-overlay.open) .ai-fab,body:has(.sheet-overlay.open) .ai-fab,body:has(#mi-game.on) .ai-fab,body:has(#mi-entry.on) .ai-fab,body:has(.modal-overlay.open) #mi-bnav,body:has(.sheet-overlay.open) #mi-bnav,body:has(#mi-game.on) #mi-bnav,body:has(.pw-ov.open) #mi-bnav,body:has(.ai-panel.open) .ai-fab{display:none}',
  ' .ai-fab{bottom:calc(78px + env(safe-area-inset-bottom))!important;right:14px!important;width:50px!important;height:50px!important}',
  ' .ai-panel{bottom:calc(136px + env(safe-area-inset-bottom))!important;right:12px!important}',
  ' #toast-global{bottom:calc(84px + env(safe-area-inset-bottom))!important}',
  '}'
  ].join('');
  document.head.appendChild(css);

  /* ───────────────────────── estado do aluno (sequência, aulas vistas, última aula) ───────────────────────── */
  var U=null, ST={dias:[],vistas:[],ultima:null,bv:false,tour:[],nivel:null,prisma:null}, CFG={}, salvarT=null;
  function chave(){return 'mi_estado_'+(U?U.id:'anon');}
  function carregarEstado(user){
    U=user;
    var m=((user&&user.user_metadata)||{}).mi||{}, l=LS.get(chave(),{});
    var uni=function(a,b){var o={};(a||[]).concat(b||[]).forEach(function(x){o[x]=1;});return Object.keys(o).sort();};
    ST.dias=uni(m.dias,l.dias);
    ST.vistas=uni(m.vistas,l.vistas);
    var um=m.ultima,ul=l.ultima;ST.ultima=(um&&ul)?((um.ts||0)>=(ul.ts||0)?um:ul):(um||ul||null);
    ST.bv=!!(m.bv||l.bv);
    ST.tour=uni(m.tour,l.tour);
    var lvLocal=null;try{lvLocal=localStorage.getItem('userLevel');}catch(e){}
    ST.nivel=m.nivel||l.nivel||lvLocal||null;
    ST.prisma=m.prisma||l.prisma||null;
  }
  function salvar(){
    LS.set(chave(),ST);
    clearTimeout(salvarT);
    salvarT=setTimeout(function(){
      if(!U)return;
      window._sb.auth.updateUser({data:{mi:{dias:ST.dias.slice(-150),vistas:ST.vistas.slice(-400),ultima:ST.ultima,bv:ST.bv,tour:ST.tour,nivel:ST.nivel,prisma:ST.prisma}}}).catch(function(){});
    },1500);
  }
  function marcarDia(){
    var h=dia();if(ST.dias.indexOf(h)<0){ST.dias.push(h);ST.dias.sort();salvar();}
    pintarRail();if(window.currentPage==='home')renderHome();
  }
  function sequencia(){
    var set={};ST.dias.forEach(function(d){set[d]=1;});
    var d=new Date(),n=0;
    if(!set[dia(d)])d.setDate(d.getDate()-1);
    while(set[dia(d)]){n++;d.setDate(d.getDate()-1);}
    return {n:n,hoje:!!set[dia()]};
  }

  /* checklist de hoje: guarda as tarefas marcadas no aparelho, por dia */
  function chkKey(){return 'mi_checks_'+dia();}
  function salvarChecks(){LS.set(chkKey(),window._ctxChecked||{});}
  function restaurarChecks(){var c=LS.get(chkKey(),{});Object.keys(c).forEach(function(k){window._ctxChecked[k]=c[k];});}
  function ctxAtual(){var c=LS.get('mi_ctx',{});return c.d===dia()?c.k:null;}
  function progCtx(k){
    k=k||ctxAtual()||'Em Casa';
    var tot=(window.CTX_TASKS&&CTX_TASKS[k]||[]).length,feitos=((window._ctxChecked||{})[k]||[]).filter(Boolean).length;
    return {k:k,tot:tot,feitos:feitos,pct:tot?Math.round(feitos*100/tot):0};
  }
  var chkOrig=window.chkMarTask;
  window.chkMarTask=function(el,key,i){chkOrig(el,key,i);salvarChecks();if(((_ctxChecked[key]||[])[i]))marcarDia();else pintarRail();};
  var doneOrig=window.taskDone;
  if(doneOrig)window.taskDone=function(){doneOrig();salvarChecks();marcarDia();};
  function escolherCtxNaMaratona(k){
    var chip=[].filter.call(document.querySelectorAll('#pane-maratona .ctx-chip'),function(c){return c.textContent.replace(/[^A-Za-zÀ-ÿ ]/g,'').trim()===k;})[0];
    if(chip&&window.selCtx)selCtx(chip);
  }

  /* ───────────────────────── lives ───────────────────────── */
  function proxLives(){
    var now=new Date();
    return (window.LIVES||[]).map(function(lv){
      var st=nextOccurrence(lv),en=new Date(st);en.setHours(lv.endH,lv.endM,0,0);
      if(lv.startDate&&st<lv.startDate){st=new Date(lv.startDate);st.setHours(lv.startH,lv.startM,0,0);en=new Date(st);en.setHours(lv.endH,lv.endM,0,0);}
      return {lv:lv,st:st,en:en,aoVivo:now>=st&&now<=en};
    }).sort(function(a,b){return a.st-b.st;});
  }
  var DS=['dom','seg','ter','qua','qui','sex','sáb'];
  function quando(x){
    var now=new Date(),h=x.st.getHours()+'h'+(x.st.getMinutes()?pad(x.st.getMinutes()):'');
    if(x.aoVivo)return 'AO VIVO agora';
    var d0=new Date(now);d0.setHours(0,0,0,0);var d1=new Date(x.st);d1.setHours(0,0,0,0);
    var dd=Math.round((d1-d0)/86400000);
    return (dd===0?'hoje':dd===1?'amanhã':DS[x.st.getDay()]+' '+x.st.getDate()+'/'+(x.st.getMonth()+1))+' às '+h;
  }

  /* ───────────────────────── aulas do Programa (pra home) ───────────────────────── */
  var FLAT=null,hmIdx=-1;
  async function carregarFlat(force){
    if(FLAT&&!force)return FLAT;
    try{
      var r=await Promise.all([window._sb.from('mi_modules').select('id,name,ord,trilha,emoji,cover_url,created_at').order('ord').order('created_at'),
        window._sb.from('mi_lessons').select('id,module_id,ord,title,youtube_url,cover_url,published,release_at,created_at').order('ord').order('created_at')]);
      var mods=(r[0].data||[]).filter(function(m){return (m.trilha||'programa')==='programa';});
      var porMod={};(r[1].data||[]).forEach(function(l){(porMod[l.module_id]=porMod[l.module_id]||[]).push(l);});
      FLAT=[];mods.forEach(function(m){(porMod[m.id]||[]).forEach(function(l,i,arr){FLAT.push({m:m,l:l,n:i+1,de:arr.length});});});
    }catch(e){FLAT=[];}
    return FLAT;
  }
  function idxInicial(){
    if(!FLAT||!FLAT.length)return -1;
    if(ST.ultima){for(var i=0;i<FLAT.length;i++)if(FLAT[i].l.id===ST.ultima.les)return i;}
    for(var j=0;j<FLAT.length;j++)if(ST.vistas.indexOf(FLAT[j].l.id)<0)return j;
    return 0;
  }
  async function abrirAula(modId,lesId,mini){
    await window.loadStudentModules(true);
    go('modulos');
    window._miniBack=mini||null;
    await window.openModule(modId);
    if(lesId)await window.openLesson(lesId);
  }
  function aulaAberta(mod,l){
    if(window.isOpen&&isOpen(l)){if(ST.vistas.indexOf(l.id)<0)ST.vistas.push(l.id);marcarDia();}
    if(!mod||(mod.trilha||'programa')!=='programa')return;
    ST.ultima={mod:mod.id,les:l.id,ts:Date.now()};salvar();hmIdx=-1;
  }

  /* ───────────────────────── HOME ───────────────────────── */
  var deferredInstall=null;
  window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();deferredInstall=e;if(window.currentPage==='home')renderHome();});
  function nomeCurto(){var m=(U&&U.user_metadata)||{},n=(window.profile&&profile.name&&profile.name!=='Ana Lima'?profile.name:'')||m.full_name||m.name||(U&&U.email?U.email.split('@')[0]:'');return String(n).split(' ')[0]||'';}
  function saudacao(){var h=new Date().getHours();return h<12?'Bom dia':h<18?'Boa tarde':'Boa noite';}
  function dataHoje(){var s=new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'});return s.charAt(0).toUpperCase()+s.slice(1);}
  function renderHome(){
    var p=$('pane-home');if(!p||!U)return;
    var sq=sequencia(),pc=progCtx(),c=CTX.filter(function(x){return x.k===pc.k;})[0]||CTX[0],lv=proxLives()[0];
    var standalone=window.matchMedia&&matchMedia('(display-mode: standalone)').matches||navigator.standalone;
    var mobile=/iphone|ipad|android/i.test(navigator.userAgent);
    var ios=/iphone|ipad/i.test(navigator.userAgent);
    var h='<div class="hm-greet">'+saudacao()+(nomeCurto()?', '+E(nomeCurto()):'')+' 👋</div>'
      +'<div class="hm-sub">'+E(dataHoje())+' · '+(sq.n?'<strong style="color:var(--gold)">🔥 '+sq.n+' dia'+(sq.n>1?'s':'')+' seguido'+(sq.n>1?'s':'')+'</strong>'+(sq.hoje?'':' · estude hoje pra manter'):'Comece sua sequência hoje 🔥')+'</div>';
    if(mobile&&!standalone&&!LS.get('mi_install_x',false)){
      h+='<div class="hm-install"><span style="font-size:24px">📲</span><div><b>Instale o app no celular</b><br>'
        +(deferredInstall?'Um toque e ele fica na sua tela inicial.':ios?'No Safari: toque em <b>Compartilhar</b> → <b>Adicionar à Tela de Início</b>.':'No menu do navegador (⋮): <b>Adicionar à tela inicial</b>.')+'</div>'
        +(deferredInstall?'<button data-hm="instalar">Instalar</button>':'<button data-hm="instalar-x" style="background:var(--surface2);color:var(--fg2)">Ok</button>')+'</div>';
    }
    h+='<div class="hm-row">'
      +'<button class="hm-big hm-check" data-hm="check" aria-label="Checklist de hoje"><div class="ic">✅</div><div class="lb">Checklist de hoje</div><div class="pg">'+c.ic+' '+E(c.lb)+' · '+pc.feitos+' de '+pc.tot+' feitas</div><div class="bar"><i style="width:'+pc.pct+'%"></i></div></button>'
      +'<button class="hm-big hm-live'+(lv&&lv.aoVivo?'':' off')+'" data-hm="lives" aria-label="Lives">'+(lv&&lv.aoVivo?'<span class="dot">● AO VIVO</span>':'')+'<div class="ic">📺</div><div class="lb">Lives</div><div class="pg">'+(lv?E(lv.lv.title)+'<br>'+E(quando(lv)):'Ver agenda')+'</div></button>'
      +'</div>';
    h+='<div class="sec-hd">Sua aula</div><div class="hm-aula" id="hm-aula"><div class="cv"><div class="lock">Carregando…</div></div><div class="bd"><div class="st">&nbsp;</div></div></div>';
    h+='<div class="hm-quick">'
      +'<button data-hm="duvida"><span>🙋</span>Dúvida</button>'
      +'<button data-hm="jogos"><span>🎮</span>Jogos</button>'
      +'<button data-hm="prompts"><span>🤖</span>Prompts</button>'
      +'<button data-hm="video"><span>▶️</span>Como usar</button>'
      +'</div>';
    h+='<div class="sec-hd">Universos</div><div class="hm-unis">'
      +'<button class="hm-uni" style="background:linear-gradient(135deg,#15281f,#2f6b4f)" data-hm="eom"><span>🙏</span><b>English On Mission</b></button>'
      +'<button class="hm-uni" style="background:linear-gradient(135deg,#1b2a6b,#4f6ef7)" data-hm="culture"><span>🎬</span><b>Culture English</b></button>'
      +'<button class="hm-uni" style="background:linear-gradient(135deg,#0c4a6e,#0ea5e9)" data-hm="viagens"><span>✈️</span><b>Viagens</b></button>'
      +'</div>';
    h+='<div class="hm-ref"><div style="font-size:30px">🎁</div><div><div class="t">Conhece alguém que trava no inglês?</div><div class="s">Manda o convite: a pessoa faz o teste de nível grátis e descobre por onde começar. Leva 10 segundos.</div></div>'
      +'<div class="bts"><button data-hm="indicar" style="background:#25d366;color:#fff">Convidar no WhatsApp</button><button data-hm="copiar" style="background:var(--surface2);color:var(--fg)">Copiar link</button></div></div>';
    p.innerHTML=h;
    pintarAula();
  }
  async function pintarAula(){
    var box=$('hm-aula');if(!box)return;
    await carregarFlat();
    box=$('hm-aula');if(!box)return;
    if(!FLAT.length){box.innerHTML='<div class="cv" data-hm="modulos"><div class="lock">📚 As aulas aparecem aqui</div></div><div class="bd"><div class="st">Assim que a primeira aula for liberada, ela fica nesse espaço.</div></div>';return;}
    if(hmIdx<0)hmIdx=idxInicial();
    var it=FLAT[hmIdx],l=it.l,cov=window.lessonCover?lessonCover(l):null,op=window.isOpen?isOpen(l):false,fut=window.relFuture?relFuture(l):false;
    var cont=ST.ultima&&ST.ultima.les===l.id;
    var kick=cont?'CONTINUE DE ONDE PAROU':(hmIdx===0&&!ST.vistas.length?'COMECE POR AQUI':ST.vistas.indexOf(l.id)>=0?'JÁ ASSISTIDA':'PRÓXIMA AULA');
    var status=op?'▶ Disponível'+(ST.vistas.indexOf(l.id)>=0?' · ✓ você já viu':''):fut?'📅 Libera '+relDate(l).toLocaleDateString('pt-BR',{day:'numeric',month:'long'}):'⏳ Em gravação';
    box.innerHTML='<div class="cv" data-hm="abrir">'+(cov?'<img src="'+E(cov)+'" alt="" data-capa-t="'+E(l.title)+'" data-capa-i="'+hmIdx+'">':(window.capaAuto?capaAuto(l.title,hmIdx):''))
      +'<span class="kick">'+kick+'</span>'+(op?'<span class="play">▶</span>':'<span class="lock">'+(fut?'📅 Em breve':'⏳ Em gravação')+'</span>')+'</div>'
      +'<div class="bd"><div class="md">'+E(it.m.name)+' · AULA '+it.n+' DE '+it.de+'</div><div class="tt">'+E(l.title)+'</div><div class="st">'+status+'</div>'
      +'<div class="hm-nav"><button data-hm="ant" '+(hmIdx<=0?'disabled':'')+' aria-label="Aula anterior">◀</button>'
      +'<button class="main" data-hm="abrir">'+(op?(cont?'▶ Continuar':'▶ Assistir'):'Ver aula')+'</button>'
      +'<button data-hm="prox" '+(hmIdx>=FLAT.length-1?'disabled':'')+' aria-label="Próxima aula">▶</button></div></div>';
  }
  function linkIndicacao(){return SITE+'?ir=teste'+(nomeCurto()?'&ref='+encodeURIComponent(nomeCurto().toLowerCase()):'');}
  function msgIndicacao(){return 'Tô estudando inglês com o Gediel no Método Inteligente e tá fazendo diferença 🙌 Faz o teste de nível grátis e vê por onde você começaria: '+linkIndicacao();}
  document.addEventListener('click',async function(e){
    var b=e.target.closest('[data-hm]');if(!b)return;
    var a=b.dataset.hm;
    if(a==='check'){go('maratona');var k=ctxAtual();if(k)setTimeout(function(){escolherCtxNaMaratona(k);},200);}
    else if(a==='lives')go('lives');
    else if(a==='modulos')go('modulos');
    else if(a==='abrir'){var it=FLAT&&FLAT[hmIdx];if(it)abrirAula(it.m.id,it.l.id);}
    else if(a==='ant'){if(hmIdx>0){hmIdx--;pintarAula();}}
    else if(a==='prox'){if(FLAT&&hmIdx<FLAT.length-1){hmIdx++;pintarAula();}}
    else if(a==='duvida'){if(window.aiToggle)aiToggle();}
    else if(a==='jogos'||a==='prompts'||a==='eom'||a==='culture'||a==='viagens')go(a);
    else if(a==='video')mostrarBoasVindas(true);
    else if(a==='indicar')wa(msgIndicacao(),false);
    else if(a==='copiar'){try{await navigator.clipboard.writeText(linkIndicacao());toast('🔗 Link copiado!','#10b981');}catch(err){prompt('Copie o link:',linkIndicacao());}}
    else if(a==='instalar'){if(deferredInstall){deferredInstall.prompt();deferredInstall=null;}renderHome();}
    else if(a==='instalar-x'){LS.set('mi_install_x',true);renderHome();}
  });

  /* barra da direita (computador): só dado real */
  function pintarRail(){
    var r=document.querySelector('.right-rail');if(!r||!U)return;
    var sq=sequencia(),pc=progCtx(),off=138.2*(1-pc.pct/100);
    var lv=proxLives().slice(0,3);
    r.innerHTML='<div><div class="rail-hd">Progresso</div>'
      +'<div class="streak-card" style="margin-bottom:12px"><div class="streak-val">'+sq.n+'🔥</div><div><div style="font-size:13px;font-weight:700;margin-bottom:2px">'+(sq.n===1?'Dia seguido':'Dias seguidos')+'</div><div style="font-size:11px;color:var(--fg2)">'+(sq.hoje?'Hoje já conta. Volte amanhã!':'Faça 1 tarefa hoje pra '+(sq.n?'manter':'começar'))+'</div></div></div>'
      +'<div class="card-sm" style="cursor:pointer" data-hm="check"><div style="display:flex;align-items:center;gap:12px"><svg width="52" height="52" viewBox="0 0 52 52"><circle cx="26" cy="26" r="22" fill="none" stroke="var(--border)" stroke-width="5"/><circle cx="26" cy="26" r="22" fill="none" stroke="#10b981" stroke-width="5" stroke-dasharray="138.2" stroke-dashoffset="'+off.toFixed(1)+'" stroke-linecap="round" transform="rotate(-90 26 26)"/><text x="26" y="31" text-anchor="middle" font-size="11" font-weight="800" fill="var(--fg)" font-family="inherit">'+pc.pct+'%</text></svg>'
      +'<div><div style="font-size:13px;font-weight:700;margin-bottom:3px">Checklist de hoje</div><div style="font-size:11px;color:var(--fg2)">'+pc.feitos+' de '+pc.tot+' · '+E((CTX.filter(function(x){return x.k===pc.k;})[0]||CTX[0]).lb)+'</div></div></div></div></div>'
      +'<div><div class="rail-hd">Próximas lives</div>'+lv.map(function(x){
        return '<div class="upcoming-item" style="cursor:pointer" data-hm="lives"><div class="upc-date"><span class="day">'+x.st.getDate()+'</span>'+x.st.toLocaleDateString('pt-BR',{month:'short'}).replace('.','').toUpperCase()+'</div><div><div class="upc-title">'+E(x.lv.title)+(x.aoVivo?' <span style="color:#ef4444;font-weight:800">● AO VIVO</span>':'')+'</div><div class="upc-time">'+E(quando(x))+'</div></div></div>';}).join('')+'</div>'
      +'<div><div class="rail-hd">Atalhos</div><div style="display:flex;flex-direction:column;gap:7px">'
      +'<a href="https://www.youtube.com/@teachergediel" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:8px;background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.15);border-radius:11px;padding:9px 12px;text-decoration:none;font-size:12px;font-weight:700;color:#ef4444">▶ Canal no YouTube</a>'
      +'<a href="https://instagram.com/englishbygediel" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:8px;background:rgba(139,92,246,.07);border:1px solid rgba(139,92,246,.18);border-radius:11px;padding:9px 12px;text-decoration:none;font-size:12px;font-weight:700;color:#8b5cf6">📸 @englishbygediel</a>'
      +'<button data-hm="indicar" style="display:flex;align-items:center;gap:8px;background:rgba(37,211,102,.08);border:1px solid rgba(37,211,102,.25);border-radius:11px;padding:9px 12px;font-size:12px;font-weight:700;color:#16a34a;cursor:pointer;text-align:left">🎁 Indicar um amigo</button>'
      +'</div></div>';
  }

  /* ───────────────────────── ENTRADA: boas-vindas + onde você está ───────────────────────── */
  var ent=document.createElement('div');ent.id='mi-entry';document.body.appendChild(ent);
  function abrirEntrada(html){ent.innerHTML='<div class="mi-ent-box">'+html+'</div>';ent.classList.add('on');ent.scrollTop=0;requestAnimationFrame(function(){ent.classList.add('vis');});}
  function fecharEntrada(cb){ent.classList.remove('vis');setTimeout(function(){ent.classList.remove('on');ent.innerHTML='';if(cb)cb();},330);}
  async function lerCfg(){
    try{var r=await window._sb.from('acesso').select('dados').eq('id','cfg').maybeSingle();CFG=(r.data&&r.data.dados)||{};}catch(e){CFG={};}
    return CFG;
  }
  async function mostrarBoasVindas(rever){
    await lerCfg();
    var id=window.ytId?ytId(CFG.videoBoasVindas||''):null;
    abrirEntrada('<div class="mi-ent-kicker">'+(rever?'Como usar o app':'Primeiro acesso')+'</div>'
      +'<div class="mi-ent-q">'+(rever?'Seu inglês, todo dia, em 4 passos':'Bem-vindo(a)'+(nomeCurto()?', '+E(nomeCurto()):'')+'! 🎉')+'</div>'
      +'<div class="mi-ent-s">Assista esse vídeo rapidinho: ele mostra tudo o que tem aqui dentro e como usar o app no seu dia.</div>'
      +'<div class="mi-video">'+(id?'<iframe src="https://www.youtube-nocookie.com/embed/'+id+'?rel=0&modestbranding=1" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>':'<div class="ph"><div style="font-size:40px">🎬</div>O vídeo de boas-vindas do Gediel entra aqui<div style="font-size:12px;font-weight:600;opacity:.85">Enquanto isso, o resumo está logo abaixo 👇</div></div>')+'</div>'
      +'<div class="mi-steps">'
      +'<div><b>📍</b><span><strong>Ao abrir o app</strong>, diga onde você está. Eu monto o checklist pro seu momento.</span></div>'
      +'<div><b>✅</b><span><strong>Checklist de hoje</strong>: o botão verde na tela inicial. Cada tarefa tem o passo a passo, o conteúdo e uma provinha.</span></div>'
      +'<div><b>🎬</b><span><strong>Sua aula</strong>: 2 aulas novas por semana. Use ◀ ▶ pra voltar ou avançar. Toda aula tem quiz e comentários.</span></div>'
      +'<div><b>📺</b><span><strong>Lives e dúvidas</strong>: entre ao vivo na sua turma e mande dúvidas no botão 🙋 a qualquer hora.</span></div>'
      +'</div>'
      +(rever?'<button class="mi-cta" data-ent="tour" style="margin-bottom:10px;background:linear-gradient(135deg,#4f6ef7,#8b5cf6);color:#fff">🧭 Fazer o tour pelos menus</button>':'')
      +'<button class="mi-cta" data-ent="bv-ok"'+(rever?' style="position:static;box-shadow:none;background:rgba(255,255,255,.12);color:#fff"':'')+'>'+(rever?'Fechar':'Entendi, bora começar →')+'</button>');
    ent.onclick=function(e){
      if(e.target.closest('[data-ent="tour"]')){fecharEntrada(function(){go('home');setTimeout(function(){tour('todos');},500);});return;}
      if(!e.target.closest('[data-ent="bv-ok"]'))return;
      if(rever){fecharEntrada();return;}
      ST.bv=true;salvar();perguntarContexto();
    };
  }
  function perguntarContexto(){
    abrirEntrada('<div class="mi-ent-kicker">'+E(saudacao())+(nomeCurto()?', '+E(nomeCurto()):'')+'</div>'
      +'<div class="mi-ent-q">Onde você está agora?</div>'
      +'<div class="mi-ent-s">Escolha o mais parecido com onde você está ou o que está fazendo. Eu monto o checklist de hoje pra esse momento.</div>'
      +'<div class="mi-ctx">'+CTX.map(function(c,i){return '<button data-ent="ctx" data-k="'+E(c.k)+'" style="animation-delay:'+(0.08+i*0.07)+'s"><span class="ic">'+c.ic+'</span><span class="lb">'+E(c.lb)+'</span><span class="ht">'+E(c.hint)+'</span></button>';}).join('')+'</div>'
      +'<button class="mi-ctx-skip" data-ent="ctx" data-k="">Só vim dar uma olhada</button>');
    ent.onclick=function(e){
      var b=e.target.closest('[data-ent="ctx"]');if(!b)return;
      var k=b.dataset.k;
      if(k){LS.set('mi_ctx',{d:dia(),k:k});escolherCtxNaMaratona(k);}
      fecharEntrada(function(){go('home');renderHome();pintarRail();setTimeout(tourAuto,700);if(k)toast('✅ Checklist pronto: '+(CTX.filter(function(x){return x.k===k;})[0].lb),'#10b981');});
    };
  }
  var entrou=false;
  function entrar(user){
    if(entrou||!user)return;entrou=true;
    carregarEstado(user);restaurarChecks();pintarPerfil();
    pintarRail();renderHome();
    if(!ST.bv)mostrarBoasVindas(false);else perguntarContexto();
  }
  var setUIOrig=window.setUserUI,pend=null;
  window.setUserUI=function(user){setUIOrig(user);pend=user;};
  var hideOrig=window.hideLogin;
  window.hideLogin=function(){hideOrig();if(pend)entrar(pend);};
  var showOrig=window.showLogin;
  if(showOrig)window.showLogin=function(){entrou=false;U=null;showOrig();};
  // sessão que já tinha sido restaurada antes deste arquivo carregar
  window._sb.auth.getSession().then(function(r){
    var s=r.data&&r.data.session;
    if(s)entrar(s.user);
  });

  /* ───────────────────────── UNIVERSOS ───────────────────────── */
  var UNIV={
    eom:{icon:'🙏',nav:'English On Mission',title:'English On Mission',sub:'Inglês com a Bíblia: devocionais, aulas, materiais e comunidade',cor:'linear-gradient(135deg,#15281f,#2f6b4f)'},
    culture:{icon:'🎬',nav:'Culture English',title:'Culture English',sub:'Inglês de verdade com séries, filmes e música',cor:'linear-gradient(135deg,#1b2a6b,#4f6ef7)'},
    viagens:{icon:'✈️',nav:'Viagens',title:'Viagens e Intercâmbio',sub:'Tudo pra você viajar sem travar: do planejamento ao inglês da rua',cor:'linear-gradient(135deg,#0c4a6e,#0ea5e9)'}
  };
  var AREAS={jogos:'🎮 Jogos',materiais:'📦 Materiais',devocionais:'🙏 Devocionais (lista do YouTube)',modulos:'📚 Módulos',lives:'📺 Lives',maratona:'✅ Checklist de hoje',prompts:'🤖 Prompts',bussola:'🧭 Bússola CEFR',prisma:'🔷 Prisma de Talentos'};
  var CARDS=null,MODS_ALL=null;
  async function carregarCards(force){
    if(CARDS&&!force)return CARDS;
    var r=await window._sb.from('mi_uni_cards').select('*').order('ord').order('created_at');
    CARDS=r.error?[]:(r.data||[]);CARDS._erro=r.error;
    return CARDS;
  }
  async function carregarModsAll(force){
    if(MODS_ALL&&!force)return MODS_ALL;
    var r=await window._sb.from('mi_modules').select('*').order('ord');MODS_ALL=r.data||[];return MODS_ALL;
  }
  function temProduto(trecho){
    var S=(window.EBG_ACESSO||{}).estado||{};trecho=(trecho||'').toLowerCase().trim();if(!trecho)return false;
    return (S.compras||[]).some(function(c){return (c.produto||'').toLowerCase().indexOf(trecho)>=0;})||String(S.meta||'').toLowerCase().indexOf(trecho)>=0;
  }
  function souAdmin(){var S=(window.EBG_ACESSO||{}).estado||{};return !!(window._isAdmin||S.admin);}
  function cardSoon(c){return c.em_breve||((c.acao==='link'||c.acao==='curso')&&!c.valor);}
  function cardLock(c){if(c.acao!=='curso'||!c.valor)return false;var m=(MODS_ALL||[]).filter(function(x){return x.id===c.valor;})[0];return !!(m&&!souAdmin()&&!temProduto(m.produto));}
  function acaoTxt(c){
    if(cardSoon(c))return 'Me avise quando sair ›';
    if(c.acao==='curso')return cardLock(c)?'Quero esse mini curso ›':'Abrir mini curso ›';
    if(c.acao==='area')return 'Abrir ›';
    if(c.acao==='whatsapp')return 'Chamar no WhatsApp ›';
    return /^R\$/.test(c.tag||'')?'Comprar ›':'Acessar ↗';
  }
  function cardHtml(c,i){
    var buy=/^R\$/.test(c.tag||'');
    return '<div class="uni-card'+(cardSoon(c)?' soon':'')+(buy?' buy':'')+(cardLock(c)?' lock':'')+'" data-unicard="'+c.id+'">'
      +'<div class="th">'+(c.capa_url?'<img loading="lazy" alt="" src="'+E(c.capa_url)+'">':(window.capaAuto?capaAuto(c.titulo,i):E(c.emoji||'✨')))+(c.tag?'<span class="tg">'+E(c.tag)+'</span>':'')+'</div>'
      +'<div class="bd"><div class="tt">'+E(c.titulo)+'</div><div class="ss">'+E(c.descricao||'')+'</div><div class="ac">'+acaoTxt(c)+'</div></div></div>';
  }
  async function desenharUni(k){
    var u=UNIV[k],p=$('pane-'+k);if(!u||!p)return;
    p.innerHTML='<div style="font-size:21px;font-weight:800;margin-bottom:4px">'+E(u.title)+'</div><div style="font-size:13px;color:var(--fg2);margin-bottom:18px">'+E(u.sub)+'</div><div class="admin-loading">Carregando…</div>';
    await Promise.all([carregarCards(),carregarModsAll()]);
    var lista=CARDS.filter(function(c){return c.universo===k&&c.ativo!==false;});
    var h='<div style="font-size:21px;font-weight:800;margin-bottom:4px">'+E(u.title)+'</div><div style="font-size:13px;color:var(--fg2);margin-bottom:18px">'+E(u.sub)+'</div>';
    if(CARDS._erro){p.innerHTML=h+'<div class="admin-loading">'+(souAdmin()?'Rode o arquivo COLE-NO-SUPABASE.sql no Supabase pra ativar os Universos.':'Em instantes tem conteúdo novo aqui 🙂')+'</div>';return;}
    lista.filter(function(c){return c.destaque;}).forEach(function(c){
      h+='<div class="uni-hero" style="background:'+u.cor+'" data-unicard="'+c.id+'">'+(c.capa_url?'<img alt="" src="'+E(c.capa_url)+'">':'')+'<div><div class="ht">'+E(c.emoji?c.emoji+' ':'')+E(c.titulo)+'</div><div class="hs">'+E(c.descricao||'')+'</div></div><button>'+E(acaoTxt(c).replace(/ [›↗]$/,''))+'</button></div>';
    });
    var resto=lista.filter(function(c){return !c.destaque;}),secs=[],por={};
    resto.forEach(function(c){var s=c.secao||'';if(!por[s]){por[s]=[];secs.push(s);}por[s].push(c);});
    var n=0;secs.forEach(function(s){h+=(s?'<div class="uni-sec">'+E(s)+'</div>':'')+'<div class="uni-grid">'+por[s].map(function(c){return cardHtml(c,n++);}).join('')+'</div>';});
    if(!lista.length)h+='<div class="admin-loading">Nenhum card ainda.'+(souAdmin()?' Crie no Painel Admin → Universos.':'')+'</div>';
    if(lista.some(function(c){return /indica/i.test(c.tag||'');}))h+='<div style="font-size:10.5px;color:var(--fg3);margin-top:16px">Indicação = link de afiliado. Você paga o mesmo preço e eu posso receber uma comissão.</div>';
    p.innerHTML=h;
  }
  function ofertaMini(m,c){
    var ov=$('pw-ov');if(!ov){if(m.checkout)window.open(m.checkout,'_blank','noopener');return;}
    ov.innerHTML='<div class="pw"><div style="font-size:40px">'+E(c.emoji||'🎬')+'</div><h3>'+E(c.titulo)+'</h3><p>'+E(c.descricao||'')+'</p>'
      +(m.checkout?'<a class="ir" target="_blank" rel="noopener" href="'+E(m.checkout)+'">Quero esse mini curso</a>':'<a class="ir" target="_blank" rel="noopener" href="https://wa.me/'+WA+'?text='+encodeURIComponent('Oi Gediel! Quero ser avisado quando o mini curso '+c.titulo+' abrir.')+'">Me avise quando abrir</a>')
      +'<p style="font-size:11.5px;margin:12px 0 0">Já comprou? Ele libera sozinho com o mesmo e-mail da compra. Se não aparecer, me chama no 🙋.</p><button class="nao" data-fechar>Agora não</button></div>';
    ov.classList.add('open');
  }
  async function abrirCard(id,uni){
    var c=(CARDS||[]).filter(function(x){return x.id===id;})[0];if(!c)return;
    if(cardSoon(c)){wa('Oi Gediel! Quero ser avisado quando sair: '+c.titulo+'.');return;}
    if(c.acao==='whatsapp'){wa(c.valor||('Oi Gediel! Vim pelo app: '+c.titulo));return;}
    if(c.acao==='area'){go(c.valor);return;}
    if(c.acao==='curso'){
      await carregarModsAll();var m=MODS_ALL.filter(function(x){return x.id===c.valor;})[0];
      if(!m){toast('Esse mini curso ainda está sendo preparado 🙏');return;}
      if(!souAdmin()&&!temProduto(m.produto)){ofertaMini(m,c);return;}
      abrirAula(m.id,null,{uni:uni,nome:UNIV[uni].title,pill:pill(uni)});return;
    }
    if(c.valor)window.open(c.valor,'_blank','noopener');
  }
  document.addEventListener('click',function(e){
    var el=e.target.closest('[data-unicard]');if(!el)return;
    var pane=el.closest('.pane');abrirCard(el.dataset.unicard,pane?pane.id.replace('pane-',''):'eom');
  });

  /* menu lateral: Prompts + seção Universos */
  function montarMenu(){
    if($('pane-eom'))return;
    var perfil=[].filter.call(document.querySelectorAll('.nav-section'),function(s){return /perfil/i.test(s.textContent);})[0];
    var mat=pill('materiais'),matPane=$('pane-materiais');
    if(!perfil||!mat||!matPane)return;
    var pp=document.createElement('div');pp.className='nav-pill';pp.setAttribute('onclick',"goTo('prompts',this)");pp.innerHTML='<span class="nav-icon">🤖</span><span>Prompts</span>';
    mat.insertAdjacentElement('afterend',pp);
    var pr=document.createElement('div');pr.className='pane';pr.id='pane-prompts';
    pr.innerHTML='<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:14px"><div><div style="font-size:21px;font-weight:800">Central de Prompts</div><div style="font-size:13px;color:var(--fg2)">Escolha, personalize, copie e cole no ChatGPT ou no Claude.</div></div><a class="back-btn" style="margin:0;text-decoration:none" href="central-prompts.html" target="_blank" rel="noopener">Abrir em tela cheia ↗</a></div><iframe class="mi-frame" title="Central de Prompts" loading="lazy" data-src="central-prompts.html"></iframe>';
    matPane.insertAdjacentElement('afterend',pr);
    var pa=document.createElement('div');pa.className='nav-pill';pa.setAttribute('onclick',"goTo('agendar',this)");pa.innerHTML='<span class="nav-icon">📅</span><span>Marcar aula</span>';
    pp.insertAdjacentElement('afterend',pa);
    var pag=document.createElement('div');pag.className='pane';pag.id='pane-agendar';pr.insertAdjacentElement('afterend',pag);
    var sec=document.createElement('div');sec.className='nav-section';sec.textContent='Universos';
    perfil.insertAdjacentElement('beforebegin',sec);
    var ant=sec,antPane=pr;
    Object.keys(UNIV).forEach(function(k){
      var u=UNIV[k],p=document.createElement('div');p.className='nav-pill';p.setAttribute('onclick',"goTo('"+k+"',this)");
      p.innerHTML='<span class="nav-icon">'+u.icon+'</span><span>'+E(u.nav)+'</span>';ant.insertAdjacentElement('afterend',p);ant=p;
      var pane=document.createElement('div');pane.className='pane';pane.id='pane-'+k;antPane.insertAdjacentElement('afterend',pane);antPane=pane;
    });
    if(window.TITLES){TITLES.prompts='Prompts';TITLES.agendar='Marcar aula';Object.keys(UNIV).forEach(function(k){TITLES[k]=UNIV[k].title;});TITLES.home='Início';}
  }
  montarMenu();

  /* ───────────────────────── MARCAR AULA ─────────────────────────
     Os horários vêm da mesma agenda que o Gediel abre no painel do site (Supabase do hub, tabela horarios).
     Reservar usa a função reservar_horario: o horário some pra todo mundo e aparece no painel como "🎓 Aluno · tipo". */
  var HUB_URL='https://iwivldvubmsqyzkkdxoy.supabase.co',HUB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3aXZsZHZ1Ym1zcXl6a2tkeG95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1OTE1MDgsImV4cCI6MjEwODE2NzUwOH0.eyoyRBBp4NAfLhG-ops6cj2-xck61Oalsj3d7h3h360';
  var TIPOS=[
    {k:'conversa',ic:'💬',nm:'Conversação',d:'Você e eu, 1 a 1, pra soltar o inglês falando.'},
    {k:'grupo',ic:'👥',nm:'Grupo',d:'Você + amigos, família ou colegas de trabalho.'},
    {k:'casal',ic:'💑',nm:'Casal',d:'Os dois juntos, no mesmo ritmo.'},
    {k:'intensivo',ic:'🔥',nm:'Intensivo',d:'Imersão de vários dias seguidos, com prazo.'},
    {k:'prep',ic:'🎯',nm:'Preparação',d:'Pra um momento específico que está chegando.'}
  ];
  var PREPS=['Entrevista de emprego','Viagem','Intercâmbio','Prova ou certificado','Apresentação ou reunião','Casamento ou evento','Outro'];
  var AG={tipo:null,prep:null,formato:'Online',pessoas:'2',horarios:[],dia:null,h:null,carregou:false,enviando:false};
  var fmtD=function(d){var x=d.toLocaleDateString('pt-BR',{weekday:'short',day:'numeric',month:'short'}).replace(/\./g,'');return x.charAt(0).toUpperCase()+x.slice(1);};
  var fmtH=function(d){return d.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});};
  var kD=function(d){return d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate();};
  function meusPedidos(){return LS.get('mi_pedidos_'+(U&&U.id||'x'),[]).filter(function(p){return new Date(p.inicio)>new Date(Date.now()-864e5);});}
  async function carregarHorariosHub(){
    try{
      var desde=new Date(Date.now()+3*36e5).toISOString();
      var r=await fetch(HUB_URL+'/rest/v1/horarios?select=id,inicio,duracao_min&reservado=eq.false&inicio=gt.'+encodeURIComponent(desde)+'&order=inicio.asc&limit=300',{headers:{apikey:HUB_KEY,Authorization:'Bearer '+HUB_KEY}});
      AG.horarios=r.ok?(await r.json()).map(function(h){h.data=new Date(h.inicio);return h;}):[];
      AG.erro=!r.ok;
    }catch(e){AG.horarios=[];AG.erro=true;}
    AG.carregou=true;
  }
  function tipoNome(){var t=TIPOS.filter(function(x){return x.k===AG.tipo;})[0];if(!t)return '';return t.k==='prep'?('Preparação'+(AG.prep?' · '+AG.prep:'')):t.nm;}
  async function renderAgendar(recarregar){
    var p=$('pane-agendar');if(!p)return;
    if(!AG.carregou||recarregar){p.innerHTML='<div class="ag-wrap"><div class="ag-h1">Marcar aula</div><div class="ag-sub">Carregando meus horários livres…</div></div>';await carregarHorariosHub();}
    pintarAgendar();
  }
  function pintarAgendar(){
    var p=$('pane-agendar');if(!p)return;
    var meta=(U&&U.user_metadata)||{},nome=meta.full_name||meta.name||meta.nome||'',whats=LS.get('mi_whats_'+(U&&U.id||'x'),meta.whatsapp||'');
    var ped=meusPedidos();
    var h='<div class="ag-wrap"><div class="ag-h1">Marcar aula</div><div class="ag-sub">Escolha o tipo, o dia e o horário. Eu recebo na hora e te confirmo valor e link pelo WhatsApp.</div>';
    if(ped.length)h+='<div class="ag-box ag-ped"><div class="ag-t">📌 Seus pedidos</div>'+ped.map(function(x){var d=new Date(x.inicio);return '<div class="ag-ped-l"><b>'+E(fmtD(d))+' · '+E(fmtH(d))+'</b> <span>'+E(x.tipo)+'</span></div>';}).join('')+'</div>';
    // 1. tipo
    h+='<div class="ag-box"><div class="ag-t"><span class="ag-n">1</span>Que aula você quer?</div><div class="ag-tipos">'
      +TIPOS.map(function(t){return '<button type="button" class="ag-tipo'+(AG.tipo===t.k?' on':'')+'" data-ag-tipo="'+t.k+'"><span class="ic">'+t.ic+'</span><b>'+t.nm+'</b><small>'+t.d+'</small></button>';}).join('')+'</div>';
    if(AG.tipo==='prep')h+='<div class="ag-lb">Preparação pra quê?</div><div class="ag-chips">'+PREPS.map(function(x){return '<button type="button" class="ag-chip'+(AG.prep===x?' on':'')+'" data-ag-prep="'+E(x)+'">'+E(x)+'</button>';}).join('')+'</div>';
    if(AG.tipo==='grupo')h+='<div class="ag-lb">Quantas pessoas, contando você?</div><div class="ag-chips">'+['2','3','4','5','6+'].map(function(x){return '<button type="button" class="ag-chip'+(AG.pessoas===x?' on':'')+'" data-ag-pes="'+x+'">'+x+'</button>';}).join('')+'</div>';
    h+='</div>';
    // 2. detalhes
    h+='<div class="ag-box"><div class="ag-t"><span class="ag-n">2</span>Seus dados</div>'
      +'<div class="ag-grid"><label>Nome<input id="ag-nome" value="'+E(nome)+'" maxlength="120" placeholder="Seu nome"></label>'
      +'<label>WhatsApp<input id="ag-whats" value="'+E(whats)+'" inputmode="tel" maxlength="25" placeholder="(11) 99999-9999"></label></div>'
      +'<div class="ag-lb">Formato</div><div class="ag-chips">'+['Online','Presencial (Vinhedo/SP)'].map(function(x){return '<button type="button" class="ag-chip'+(AG.formato===x?' on':'')+'" data-ag-fmt="'+E(x)+'">'+E(x)+'</button>';}).join('')+'</div>'
      +'<label class="ag-full">O que você quer trabalhar? <span>(opcional)</span><textarea id="ag-obj" rows="3" maxlength="600" placeholder="Ex.: tenho entrevista em inglês dia 30, quero treinar perguntas de RH">'+E(AG.obj||'')+'</textarea></label></div>';
    // 3. horário
    h+='<div class="ag-box"><div class="ag-t"><span class="ag-n">3</span>Dia e horário</div>';
    if(!AG.horarios.length){
      h+='<div class="ag-vazio">'+(AG.erro?'Não consegui carregar a agenda agora.':'Estou sem horários abertos no momento.')+' Me chama no WhatsApp que a gente encaixa.</div>'
        +'<button type="button" class="ag-btn2" data-ag-zap>💬 Combinar pelo WhatsApp</button>'+(AG.erro?' <button type="button" class="ag-btn2" data-ag-reload>↻ Tentar de novo</button>':'');
    }else{
      var dias=[];AG.horarios.forEach(function(x){var k=kD(x.data);if(!dias.some(function(d){return d.k===k;}))dias.push({k:k,data:x.data});});
      if(!dias.some(function(d){return d.k===AG.dia;})){AG.dia=dias[0].k;AG.h=null;}
      h+='<div class="ag-dias">'+dias.map(function(d){return '<button type="button" class="ag-dia'+(d.k===AG.dia?' on':'')+'" data-ag-dia="'+d.k+'">'+E(fmtD(d.data))+'</button>';}).join('')+'</div>'
        +'<div class="ag-horas">'+AG.horarios.filter(function(x){return kD(x.data)===AG.dia;}).map(function(x){return '<button type="button" class="ag-hora'+(x.id===AG.h?' on':'')+'" data-ag-h="'+x.id+'">'+E(fmtH(x.data))+'</button>';}).join('')+'</div>'
        +'<div class="ag-nota">O horário marca o começo da aula. Duração e valor eu confirmo com você no WhatsApp.</div>';
    }
    h+='</div>';
    if(AG.horarios.length){
      var hs=AG.horarios.filter(function(x){return x.id===AG.h;})[0];
      var falta=!AG.tipo?'Escolha o tipo de aula':(AG.tipo==='prep'&&!AG.prep)?'Escolha a preparação':!hs?'Escolha um horário':'';
      h+='<button type="button" class="ag-btn" data-ag-ok'+(falta||AG.enviando?' disabled':'')+'>'+(AG.enviando?'Reservando…':falta||('📅 Pedir aula · '+fmtD(hs.data)+' às '+fmtH(hs.data)))+'</button>';
    }
    h+='</div>';
    p.innerHTML=h;
  }
  function msgZap(hs){
    var nome=($('ag-nome')||{}).value||'';
    return 'Oi Gediel! Sou '+(nome||'aluno(a) da Plataforma')+' e '+(hs?'acabei de pedir uma aula pela plataforma.':'quero marcar uma aula.')
      +'\n\n• Tipo: '+(tipoNome()||'a definir')+(AG.tipo==='grupo'?' ('+AG.pessoas+' pessoas)':'')
      +'\n• Formato: '+AG.formato
      +(hs?'\n• Quando: '+fmtD(hs.data)+' às '+fmtH(hs.data):'')
      +(AG.obj?'\n• Objetivo: '+AG.obj:'');
  }
  async function pedirAula(){
    var hs=AG.horarios.filter(function(x){return x.id===AG.h;})[0];if(!hs||AG.enviando)return;
    var nome=$('ag-nome').value.trim(),whats=$('ag-whats').value.trim();
    AG.obj=$('ag-obj').value.trim();
    if(!nome){toast('Coloca seu nome','#ef4444');$('ag-nome').focus();return;}
    if(whats.replace(/\D/g,'').length<10){toast('Coloca seu WhatsApp com DDD','#ef4444');$('ag-whats').focus();return;}
    LS.set('mi_whats_'+(U&&U.id||'x'),whats);
    var modo=('Aluno · '+(AG.tipo==='prep'?'Prep. '+(AG.prep||''):tipoNome())+(AG.tipo==='grupo'?' ('+AG.pessoas+')':'')+(/Presencial/.test(AG.formato)?' · pres.':'')).slice(0,40);
    AG.enviando=true;pintarAgendar();
    var ok=false;
    try{
      var r=await fetch(HUB_URL+'/rest/v1/rpc/reservar_horario',{method:'POST',headers:{apikey:HUB_KEY,Authorization:'Bearer '+HUB_KEY,'Content-Type':'application/json'},
        body:JSON.stringify({p_horario:hs.id,p_nome:nome.slice(0,120),p_whatsapp:whats.slice(0,25),p_email:(U&&U.email)||null,p_instagram:null,p_modo:modo,p_lead:null})});
      ok=r.ok&&(await r.json())===true;
    }catch(e){ok=false;}
    AG.enviando=false;
    if(!ok){toast('Esse horário acabou de ser pego. Escolha outro 🙏','#ef4444');AG.h=null;return renderAgendar(true);}
    var ped=LS.get('mi_pedidos_'+(U&&U.id||'x'),[]);ped.push({inicio:hs.inicio,tipo:tipoNome()});LS.set('mi_pedidos_'+(U&&U.id||'x'),ped);
    var zap=msgZap(hs);
    $('pane-agendar').innerHTML='<div class="ag-wrap"><div class="ag-box ag-feito"><div class="ag-ok-ic">✅</div><div class="ag-h1">Pedido enviado!</div>'
      +'<p><b>'+E(tipoNome())+'</b> · '+E(fmtD(hs.data))+' às '+E(fmtH(hs.data))+' · '+E(AG.formato)+'</p>'
      +'<p class="ag-sub">O horário já ficou guardado pra você. Me manda a mensagem abaixo pra eu te confirmar valor e o link.</p>'
      +'<button type="button" class="ag-btn" data-ag-zapok>💬 Mandar no WhatsApp</button><button type="button" class="ag-btn2" data-ag-novo>Marcar outra aula</button></div></div>';
    $('pane-agendar').querySelector('[data-ag-zapok]').onclick=function(){wa(zap);};
    AG.h=null;
  }
  document.addEventListener('click',function(e){
    var p=$('pane-agendar');if(!p||!p.contains(e.target))return;
    var b=e.target.closest('button');if(!b)return;
    var ob=$('ag-obj');if(ob)AG.obj=ob.value;
    if(b.dataset.agTipo){AG.tipo=b.dataset.agTipo;if(AG.tipo!=='prep')AG.prep=null;}
    else if(b.dataset.agPrep)AG.prep=b.dataset.agPrep;
    else if(b.dataset.agPes)AG.pessoas=b.dataset.agPes;
    else if(b.dataset.agFmt)AG.formato=b.dataset.agFmt;
    else if(b.dataset.agDia){AG.dia=b.dataset.agDia;AG.h=null;}
    else if(b.dataset.agH)AG.h=b.dataset.agH;
    else if(b.hasAttribute('data-ag-ok'))return pedirAula();
    else if(b.hasAttribute('data-ag-zap'))return wa(msgZap(null));
    else if(b.hasAttribute('data-ag-reload'))return renderAgendar(true);
    else if(b.hasAttribute('data-ag-novo'))return renderAgendar(true);
    else return;
    // guarda o que já foi digitado antes de redesenhar
    var n=$('ag-nome'),w=$('ag-whats'),nv=n&&n.value,wv=w&&w.value;
    pintarAgendar();
    if(nv!=null)$('ag-nome').value=nv;if(wv!=null)$('ag-whats').value=wv;
  });

  /* ───────────────────────── celular: menu de baixo + gaveta ───────────────────────── */
  var sb=document.querySelector('.sidebar'),shade=document.createElement('div');shade.id='mi-shade';document.body.appendChild(shade);
  var bnav=document.createElement('nav');bnav.id='mi-bnav';bnav.setAttribute('aria-label','Navegação');
  bnav.innerHTML=[['home','🏠','Início'],['maratona','✅','Checklist'],['modulos','📚','Aulas'],['lives','📺','Lives'],['menu','☰','Menu']].map(function(x){return '<button data-bn="'+x[0]+'"><span>'+x[1]+'</span>'+x[2]+'</button>';}).join('');
  document.body.appendChild(bnav);
  function gaveta(on){if(!sb)return;sb.classList.toggle('mi-open',on);shade.classList.toggle('on',on);}
  bnav.addEventListener('click',function(e){var b=e.target.closest('[data-bn]');if(!b)return;var k=b.dataset.bn;if(k==='menu'){gaveta(!sb.classList.contains('mi-open'));return;}gaveta(false);go(k);});
  shade.addEventListener('click',function(){gaveta(false);});
  function marcarBnav(p){[].forEach.call(bnav.querySelectorAll('button'),function(b){b.classList.toggle('on',b.dataset.bn===p);});}

  /* navegação: desenha o que cada área precisa */
  var goAnt=window.goTo;
  window.goTo=function(page,el){
    gaveta(false);
    window._miniBack=null;
    if(UNIV[page])desenharUni(page);
    if(page==='prompts'){var f=document.querySelector('#pane-prompts iframe');if(f&&!f.src)f.src=f.dataset.src;}
    if(page==='home')setTimeout(renderHome,160);
    if(page==='agendar')renderAgendar();
    if(page==='bussola')renderBussola();
    if(page==='prisma')renderPrisma();
    var r=goAnt(page,el);
    marcarBnav(page);
    return r;
  };
  marcarBnav('home');

  /* ───────────────────────── JOGOS ───────────────────────── */
  var DATA={
    flash:[['I\'m running late','Estou atrasado(a)','Sorry, I\'m running late!'],['to get along with','Se dar bem com','I get along with my boss.'],['grateful','Grato(a)','I\'m grateful for my family.'],['by the way','A propósito','By the way, I loved your post.'],['to figure out','Descobrir / resolver','I need to figure out the problem.'],['deadline','Prazo final','The deadline is Friday.'],['tired','Cansado(a)','I\'m too tired to go out.'],['to look forward to','Estar ansioso(a) por (positivo)','I look forward to seeing you.'],['actually','Na verdade','Actually, I don\'t agree.'],['to hang out','Passar tempo junto, sair','Let\'s hang out this weekend.'],['overwhelmed','Sobrecarregado(a)','I feel overwhelmed at work.'],['to give up','Desistir','Never give up on your English!'],['worth it','Vale a pena','The trip was worth it.'],['to make sense','Fazer sentido','That makes sense.'],['meanwhile','Enquanto isso','Meanwhile, she was cooking.'],['to wake up','Acordar','I wake up at 6.'],['to be about to','Estar prestes a','I\'m about to leave.'],['instead of','Em vez de','Tea instead of coffee.'],['to catch up','Pôr o papo em dia / alcançar','Let\'s catch up soon!'],['blessed','Abençoado(a)','I feel blessed.'],['layover','Escala (viagem)','We have a 3-hour layover.'],['to be into something','Curtir algo','I\'m into jazz.'],['nevertheless','Mesmo assim','It was hard; nevertheless, we did it.'],['to look after','Cuidar de','She looks after her mom.']],
    ordem:[['I','am','learning','English','every','day'],['She','doesn\'t','like','coffee'],['Where','do','you','live'],['We','are','going','to','travel','next','year'],['I','have','never','been','to','London'],['Could','you','speak','more','slowly'],['He','was','sleeping','when','I','called'],['If','it','rains','I','will','stay','home'],['What','are','you','doing','right','now'],['I','usually','wake','up','at','seven']],
    complete:[['I ___ a teacher.',['am','is','are','be'],0],['She ___ in São Paulo.',['live','lives','living','is live'],1],['___ you like pizza?',['Does','Are','Do','Is'],2],['There ___ two cats in the house.',['is','are','be','am'],1],['I\'m ___ engineer.',['a','an','the','—'],1],['Yesterday I ___ to the beach.',['go','goes','went','gone'],2],['He can ___ English very well.',['speaks','speaking','to speak','speak'],3],['This book is ___. (meu)',['my','mine','me','I'],1],['How ___ water do you drink?',['many','much','more','long'],1],['I have lived here ___ 2019.',['for','since','from','at'],1],['If you study, you ___ pass.',['would','will','are','did'],1],['She is ___ than her brother.',['taller','more tall','tallest','tall'],0]],
    phrasal:[['"I gave up smoking."',['Comecei a fumar','Parei de fumar','Fumei muito','Odeio fumar'],1],['"Can you pick me up at 8?"',['Me buscar','Me ligar','Me levantar','Me esperar'],0],['"Let\'s put off the meeting."',['Começar','Adiar','Cancelar pra sempre','Gravar'],1],['"I ran into an old friend."',['Briguei com','Encontrei por acaso','Corri com','Liguei pra'],1],['"She looks after her grandma."',['Procura','Cuida de','Olha pra trás','Visita'],1],['"Turn off the lights."',['Acenda','Apague/desligue','Troque','Olhe'],1],['"I need to figure it out."',['Desenhar','Descobrir/resolver','Esquecer','Apagar'],1],['"We broke up last year."',['Terminamos','Viajamos','Casamos','Brigamos e voltamos'],0],['"Hold on a second."',['Desliga','Espera um pouco','Segura isso','Vai embora'],1],['"I get along with my coworkers."',['Brigo com','Me dou bem com','Trabalho para','Saio com'],1],['"Let\'s catch up tomorrow."',['Pegar algo','Pôr o papo em dia','Correr atrás','Cancelar'],1],['"Find out the answer."',['Esconder','Descobrir','Esquecer','Perguntar'],1]]
  };
  var JOGOS={'Flashcards':'flash','Monta Frase':'ordem','Complete':'complete','Quiz Phrasal':'phrasal'};
  var G=null,cur=null;
  var gv=document.createElement('div');gv.id='mi-game';document.body.appendChild(gv);
  var shuf=function(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;};
  function gTela(corpo){
    var pct=G.total?Math.round(G.i*100/G.total):0;
    gv.innerHTML='<div class="mg-top"><button class="x" data-g="sair" aria-label="Fechar">✕</button><div class="nm">'+E(G.nome)+'</div><div class="sc">'+G.pts+' pts</div></div><div class="mg-prog"><i style="width:'+pct+'%"></i></div><div class="mg-body"><div class="mg-in">'+corpo+'</div></div>';
  }
  function jogar(nome){
    var t=JOGOS[nome];if(!t)return false;
    var itens=t==='flash'?shuf(DATA.flash).slice(0,12).map(function(a){return {w:a[0],p:a[1],x:a[2],errou:false};}):shuf(DATA[t]).slice(0,t==='ordem'?8:10);
    G={nome:nome,t:t,itens:itens,i:0,total:itens.length,pts:0,fila:itens.slice(),acertos:0};
    gv.classList.add('on');document.body.style.overflow='hidden';passo();return true;
  }
  function passo(){
    if(G.t==='flash'){
      if(!G.fila.length)return fim();
      var c=G.fila[0];G.virou=false;
      gTela('<div class="mg-card" data-g="virar"><div class="h">Toque pra ver a tradução</div><div class="w">'+E(c.w)+'</div></div><div class="mg-fb">Pense na resposta antes de virar 🤔</div>');
      return;
    }
    if(G.i>=G.total)return fim();
    var it=G.itens[G.i];
    if(G.t==='ordem'){
      G.resp=[];G.bank=shuf(it.map(function(w,i){return {w:w,i:i};}));
      desenharOrdem();return;
    }
    var q=it[0],ops=it[1];
    gTela('<div class="mg-q">'+E(G.t==='phrasal'?'O que significa:':'Complete:')+'<br><span style="color:var(--accent)">'+E(q)+'</span></div>'+ops.map(function(o,i){return '<button class="mg-opt" data-g="op" data-i="'+i+'">'+E(o)+'</button>';}).join('')+'<div class="mg-fb"></div>');
  }
  function desenharOrdem(){
    gTela('<div class="mg-q">Monte a frase na ordem certa</div><div class="mg-line" id="mg-line">'+G.resp.map(function(b,k){return '<button class="mg-chip" data-g="tira" data-k="'+k+'">'+E(b.w)+'</button>';}).join('')+'</div>'
      +'<div class="mg-bank">'+G.bank.map(function(b,k){var u=G.resp.indexOf(b)>=0;return '<button class="mg-chip'+(u?' used':'')+'" data-g="poe" data-k="'+k+'">'+E(b.w)+'</button>';}).join('')+'</div>'
      +'<div class="mg-fb" id="mg-fb"></div>'+(G.resp.length<G.itens[G.i].length?'<button class="mg-btn" style="width:100%;opacity:.45;background:var(--surface2);color:var(--fg2)" disabled>Toque nas palavras</button>':'<button class="mg-btn" style="width:100%;background:linear-gradient(135deg,#4f6ef7,#8b5cf6);color:#fff" data-g="conferir">Conferir</button>'));
  }
  function fim(){
    var tot=G.t==='flash'?G.total:G.total,ac=G.acertos,pct=Math.round(ac*100/tot);
    marcarDia();
    var emo=pct>=90?'🏆':pct>=60?'🔥':'💪';
    gTela('<div class="mg-end"><div class="big">'+emo+'</div><div class="t">'+ac+' de '+tot+(G.t==='flash'?' de primeira':' certas')+'</div><div class="s">'+(pct>=90?'Mandou muito! Volta amanhã pra manter a sequência.':pct>=60?'Bom demais. Mais uma rodada e fixa de vez.':'Errar faz parte. Joga de novo que o cérebro fixa.')+'</div>'
      +'<button class="mg-btn" style="width:100%;background:linear-gradient(135deg,#4f6ef7,#8b5cf6);color:#fff;margin-bottom:10px" data-g="denovo">🔁 Jogar de novo</button>'
      +'<button class="mg-btn" style="width:100%;background:#25d366;color:#fff;margin-bottom:10px" data-g="share">📤 Desafiar um amigo</button>'
      +'<button class="mg-btn" style="width:100%;background:var(--surface2);color:var(--fg)" data-g="sair">Fechar</button></div>');
    G.i=G.total;
  }
  gv.addEventListener('click',function(e){
    var b=e.target.closest('[data-g]');if(!b||!G)return;var a=b.dataset.g;
    if(a==='sair'){gv.classList.remove('on');gv.innerHTML='';document.body.style.overflow='';G=null;return;}
    if(a==='denovo'){jogar(G.nome);return;}
    if(a==='share'){wa('Fiz '+G.acertos+'/'+G.total+' no jogo '+G.nome+' do Método Inteligente 🎮 Duvido você bater! Faz o teste de nível grátis: '+linkIndicacao(),false);return;}
    if(G.t==='flash'){
      var c=G.fila[0];
      if(a==='virar'&&!G.virou){G.virou=true;
        gTela('<div class="mg-card"><div class="w">'+E(c.w)+'</div><div class="pt">'+E(c.p)+'</div><div class="ex">"'+E(c.x)+'"</div></div><div class="mg-bts"><button data-g="errei" style="background:rgba(239,68,68,.12);color:#ef4444">✗ Errei</button><button data-g="acertei" style="background:rgba(16,185,129,.14);color:#10b981">✓ Acertei</button></div>');return;}
      if(a==='acertei'){if(!c.errou){G.acertos++;G.pts+=10;}G.fila.shift();G.i=G.total-G.fila.length;passo();return;}
      if(a==='errei'){c.errou=true;G.fila.push(G.fila.shift());passo();return;}
      return;
    }
    if(G.t==='ordem'){
      var it=G.itens[G.i];
      if(a==='poe'){var bb=G.bank[+b.dataset.k];if(G.resp.indexOf(bb)<0)G.resp.push(bb);desenharOrdem();return;}
      if(a==='tira'){G.resp.splice(+b.dataset.k,1);desenharOrdem();return;}
      if(a==='conferir'){
        var ok=G.resp.map(function(x){return x.w;}).join(' ')===it.join(' ');
        var line=$('mg-line');line.classList.add(ok?'ok':'bad');
        if(ok){G.acertos++;G.pts+=10;}
        $('mg-fb').innerHTML=ok?'✅ Perfeito!':'Quase! O certo é: <b>'+E(it.join(' '))+'</b>';
        b.outerHTML='<button class="mg-btn" style="width:100%;background:linear-gradient(135deg,#4f6ef7,#8b5cf6);color:#fff" data-g="seguir">Continuar →</button>';
        return;
      }
      if(a==='seguir'){G.i++;passo();return;}
    }
    if(a==='op'&&!G.resp){
      var item=G.itens[G.i],i=+b.dataset.i,certo=item[2];G.resp=true;
      var ops=gv.querySelectorAll('.mg-opt');ops[certo].classList.add('ok');if(i!==certo)b.classList.add('bad');else{G.acertos++;G.pts+=10;}
      gv.querySelector('.mg-fb').innerHTML=(i===certo?'✅ Isso!':'Resposta: <b>'+E(item[1][certo])+'</b>')+'<br><button class="mg-btn" style="margin-top:12px;width:100%;background:linear-gradient(135deg,#4f6ef7,#8b5cf6);color:#fff" data-g="prox">Continuar →</button>';
      gv.querySelector('.sc').textContent=G.pts+' pts';
      return;
    }
    if(a==='prox'){G.resp=null;G.i++;passo();}
  });
  // a ficha do jogo agora joga de verdade
  var sheetGm=null,openSheetOrig=window.openSheet;
  window.openSheet=function(gm){sheetGm=gm;openSheetOrig(gm);var bt=document.querySelector('.sheet-play-btn');if(bt)bt.textContent=JOGOS[gm.name]?'▶ Jogar agora':'⏳ Em breve';};
  var sbt=document.querySelector('.sheet-play-btn');
  if(sbt){sbt.removeAttribute('onclick');sbt.addEventListener('click',function(){
    var n=sheetGm&&sheetGm.name;if(window.closeSheet)closeSheet();
    if(!n||!jogar(n))wa('Oi Gediel! Quero ser avisado quando o jogo '+(n||'')+' sair.');
  });}
  var rgOrig=window.renderGames;
  window.renderGames=function(){
    rgOrig();
    [].forEach.call(document.querySelectorAll('#game-grid .game-app-icon'),function(ic){
      var n=(ic.querySelector('.game-app-name')||{}).textContent;if(!n||ic.querySelector('.mi-soon,.mi-play'))return;
      var s=document.createElement('span');s.className=JOGOS[n]?'mi-play':'mi-soon';s.textContent=JOGOS[n]?'JOGAR':'EM BREVE';ic.appendChild(s);
    });
  };
  // jogáveis primeiro
  if(window.GAMES)GAMES.sort(function(a,b){return (JOGOS[b.name]?1:0)-(JOGOS[a.name]?1:0);});
  window.renderGames();

  /* ───────────────────────── ADMIN: Universos + vídeo de boas-vindas ───────────────────────── */
  var ADM={uni:'eom',edit:null,capa:null};
  function montarAdmin(){
    var tabs=document.querySelector('.admin-tabs'),modPanel=$('adm-modulos');if(!tabs||!modPanel||$('adm-universos'))return;
    var t=document.createElement('button');t.className='admin-tab';t.textContent='🌐 Universos';t.setAttribute('onclick',"adminTab('universos',this)");tabs.appendChild(t);
    var p=document.createElement('div');p.className='admin-panel';p.id='adm-universos';
    p.innerHTML='<div class="admin-form">'
      +'<div class="admin-form-title">🎬 Vídeo de boas-vindas (1º acesso)</div>'
      +'<div style="font-size:12px;color:var(--fg2);margin-bottom:10px">Aparece sozinho na primeira vez que o aluno entra. Grave mostrando o app, o botão de checklist, a aula da vez, as lives e como usar todo dia. Pode ser vídeo não listado do YouTube.</div>'
      +'<div style="display:flex;gap:8px;flex-wrap:wrap"><input class="admin-inp" id="adm-bv-url" placeholder="https://youtu.be/..." style="flex:1;min-width:220px"><button class="admin-btn admin-btn-primary" data-ua="bv-salvar">Salvar</button><button class="admin-btn admin-btn-ghost" data-ua="bv-ver">Pré-visualizar</button></div>'
      +'</div><div class="admin-form">'
      +'<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:6px"><div class="admin-form-title" style="margin:0">🌐 Cards dos Universos</div><button class="admin-btn admin-btn-primary admin-btn-sm" data-ua="novo">➕ Novo card</button></div>'
      +'<div style="font-size:12px;color:var(--fg2);margin-bottom:12px;line-height:1.7">Clique no card pra editar. Arraste pela alça ⠿ pra mudar a ordem. <strong>Capa:</strong> 1280 × 720 px (16:9).<br>Mini curso: crie o módulo em Módulos (marque "Mini curso avulso"), depois aponte o card pra ele.</div>'
      +'<div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap" id="adm-uni-tabs"></div>'
      +'<div id="adm-uni-list"><div class="admin-loading">Carregando…</div></div></div>';
    modPanel.insertAdjacentElement('afterend',p);
    var tabOrig=window.adminTab;
    window.adminTab=function(tab,btn){tabOrig(tab,btn);if(tab==='universos')loadAdminUni();};
  }
  async function loadAdminUni(){
    await lerCfg();$('adm-bv-url').value=CFG.videoBoasVindas||'';
    $('adm-uni-tabs').innerHTML=Object.keys(UNIV).map(function(k){return '<button class="admin-btn admin-btn-sm '+(ADM.uni===k?'admin-btn-primary':'admin-btn-ghost')+'" data-ua="uni" data-k="'+k+'">'+UNIV[k].icon+' '+E(UNIV[k].nav)+'</button>';}).join('');
    await Promise.all([carregarCards(true),carregarModsAll(true)]);
    var el=$('adm-uni-list');
    if(CARDS._erro){el.innerHTML='<div class="admin-loading" style="color:var(--red)">Erro: '+E(CARDS._erro.message)+'<br><span style="font-size:11px;color:var(--fg2)">Rode o COLE-NO-SUPABASE.sql atualizado no SQL Editor do Supabase.</span></div>';return;}
    var lista=CARDS.filter(function(c){return c.universo===ADM.uni;});
    el.innerHTML=lista.length?lista.map(function(c,i){
      return '<div class="adm-lesson-row" draggable="true" data-uidx="'+i+'" data-ua="editar" data-id="'+c.id+'" style="background:var(--surface);border:1px solid var(--border);margin-bottom:6px">'
        +'<div class="drag-handle">⠿</div><div class="adm-cover-sm">'+(c.capa_url?'<img src="'+E(c.capa_url)+'">':E(c.emoji||'✨'))+'</div>'
        +'<div style="flex:1;min-width:0"><div style="font-weight:700">'+E(c.titulo)+'</div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:3px">'
        +(c.destaque?'<span class="adm-pill adm-pill-on">BANNER</span>':'')+(c.ativo===false?'<span class="adm-pill adm-pill-off">OCULTO</span>':'')+(cardSoon(c)?'<span class="adm-pill adm-pill-off">EM BREVE</span>':'')
        +'<span class="adm-stat">'+E(c.secao||'sem seção')+'</span><span class="adm-stat">'+E({link:'🔗 link',whatsapp:'💬 WhatsApp',area:'📱 área do app',curso:'🛒 mini curso'}[c.acao]||c.acao)+'</span>'+(c.tag?'<span class="adm-stat">🏷 '+E(c.tag)+'</span>':'')
        +'</div></div></div>';}).join(''):'<div class="admin-loading">Nenhum card neste universo.</div>';
  }
  // reordenar cards arrastando
  var drag=null;
  document.addEventListener('dragstart',function(e){var r=e.target.closest&&e.target.closest('#adm-uni-list [data-uidx]');if(!r)return;drag=+r.dataset.uidx;r.classList.add('dragging');try{e.dataTransfer.setData('text/plain','x');}catch(x){}});
  document.addEventListener('dragover',function(e){if(drag===null)return;var r=e.target.closest('#adm-uni-list [data-uidx]');if(!r)return;e.preventDefault();[].forEach.call(document.querySelectorAll('#adm-uni-list .drop-before,#adm-uni-list .drop-after'),function(x){x.classList.remove('drop-before','drop-after');});var b=r.getBoundingClientRect();r.classList.add(e.clientY-b.top<b.height/2?'drop-before':'drop-after');});
  document.addEventListener('drop',async function(e){
    if(drag===null)return;var r=e.target.closest('#adm-uni-list [data-uidx]');var from=drag;drag=null;
    if(!r){loadAdminUni();return;}e.preventDefault();
    var b=r.getBoundingClientRect(),to=+r.dataset.uidx+((e.clientY-b.top)>=b.height/2?1:0);if(from<to)to--;
    var lista=CARDS.filter(function(c){return c.universo===ADM.uni;});var it=lista.splice(from,1)[0];lista.splice(to,0,it);
    for(var k=0;k<lista.length;k++)if(lista[k].ord!==k+1){lista[k].ord=k+1;await window._sb.from('mi_uni_cards').update({ord:k+1}).eq('id',lista[k].id);}
    toast('↕️ Ordem salva','#10b981');CARDS=null;loadAdminUni();
  });
  document.addEventListener('dragend',function(){drag=null;[].forEach.call(document.querySelectorAll('#adm-uni-list .dragging,#adm-uni-list .drop-before,#adm-uni-list .drop-after'),function(x){x.classList.remove('dragging','drop-before','drop-after');});});

  // modal de edição do card
  var um=document.createElement('div');um.className='modal-overlay';um.id='adm-uni-modal';
  um.innerHTML='<div class="modal-box adm-modal-box" style="width:620px"><div class="modal-header"><h2 id="uc-h">Card</h2><button class="modal-close" data-ua="fechar">✕</button></div><div class="modal-body">'
    +'<div class="adm-section">Capa · 1280 × 720 px</div><div class="adm-cover-drop" data-ua="capa"><div class="adm-cover-prev" id="uc-prev">🖼️</div><div style="font-size:12px;color:var(--fg2);line-height:1.6"><strong>Clique pra enviar</strong><br>JPG/PNG · 16:9 · até 2 MB<div id="uc-info" style="font-size:11px;margin-top:4px"></div><button class="admin-btn admin-btn-ghost admin-btn-sm" style="margin-top:6px" data-ua="sem-capa">Tirar capa</button></div><input type="file" id="uc-file" accept="image/*" style="display:none"></div>'
    +'<div class="adm-section">Título</div><input class="admin-inp" id="uc-titulo" maxlength="120">'
    +'<div class="adm-section">Descrição curta</div><textarea class="admin-inp" id="uc-desc" rows="2" maxlength="400"></textarea>'
    +'<div style="display:grid;grid-template-columns:1fr 1fr 90px;gap:10px" class="grid-2"><div><div class="adm-section">Seção (agrupa os cards)</div><input class="admin-inp" id="uc-secao" list="uc-secoes" placeholder="Ex.: Assistir"><datalist id="uc-secoes"></datalist></div><div><div class="adm-section">Etiqueta</div><input class="admin-inp" id="uc-tag" placeholder="Ex.: R$ 27 · Grátis · Em breve" maxlength="40"></div><div><div class="adm-section">Emoji</div><input class="admin-inp" id="uc-emoji" maxlength="8" style="text-align:center;font-size:18px"></div></div>'
    +'<div class="adm-section">O que acontece ao clicar</div><select class="admin-inp" id="uc-acao"><option value="link">🔗 Abrir um link (YouTube, playlist, checkout, site)</option><option value="whatsapp">💬 Abrir meu WhatsApp com mensagem pronta</option><option value="area">📱 Abrir uma área do app</option><option value="curso">🛒 Abrir um mini curso (com cadeado pra quem não comprou)</option></select>'
    +'<div id="uc-valor-box" style="margin-top:8px"></div>'
    +'<div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:14px;font-size:12.5px"><label style="display:flex;gap:6px;align-items:center"><input type="checkbox" id="uc-destaque"> Banner do topo</label><label style="display:flex;gap:6px;align-items:center"><input type="checkbox" id="uc-breve"> Em breve (vira "me avise")</label><label style="display:flex;gap:6px;align-items:center"><input type="checkbox" id="uc-ativo" checked> Visível pros alunos</label></div>'
    +'<div id="uc-st" style="font-size:12px;min-height:18px;margin-top:12px"></div>'
    +'<div style="display:flex;gap:8px;justify-content:space-between;margin-top:6px"><button class="admin-btn admin-btn-danger admin-btn-sm" data-ua="apagar">🗑️ Apagar</button><div style="display:flex;gap:8px"><button class="admin-btn admin-btn-ghost" data-ua="fechar">Cancelar</button><button class="admin-btn admin-btn-primary" data-ua="salvar">💾 Salvar</button></div></div>'
    +'</div></div>';
  document.body.appendChild(um);
  function valorBox(acao,valor){
    var b=$('uc-valor-box');
    if(acao==='area')b.innerHTML='<select class="admin-inp" id="uc-valor">'+Object.keys(AREAS).map(function(k){return '<option value="'+k+'"'+(valor===k?' selected':'')+'>'+AREAS[k]+'</option>';}).join('')+'</select>';
    else if(acao==='curso'){var minis=(MODS_ALL||[]).filter(function(m){return m.trilha==='mini';});
      b.innerHTML='<select class="admin-inp" id="uc-valor"><option value="">— ainda não tem módulo (fica "em breve") —</option>'+minis.map(function(m){return '<option value="'+m.id+'"'+(valor===m.id?' selected':'')+'>'+E(m.name)+(m.produto?' · libera com "'+E(m.produto)+'"':' · ⚠ sem produto')+'</option>';}).join('')+'</select>'+(minis.length?'':'<div style="font-size:11px;color:var(--gold);margin-top:6px">Nenhum mini curso criado ainda. Vá em Módulos → Novo módulo → "Mini curso avulso".</div>');}
    else if(acao==='whatsapp')b.innerHTML='<textarea class="admin-inp" id="uc-valor" rows="2" placeholder="Mensagem que o aluno manda pra você">'+E(valor||'')+'</textarea>';
    else b.innerHTML='<input class="admin-inp" id="uc-valor" placeholder="https://... (vazio = aparece como Em breve)" value="'+E(valor||'')+'">';
  }
  function abrirModalCard(c){
    ADM.edit=c||{universo:ADM.uni,acao:'link',ativo:true};ADM.capa=null;c=ADM.edit;
    $('uc-h').textContent=(c.id?'Editar card':'Novo card')+' · '+UNIV[c.universo].nav;
    $('uc-titulo').value=c.titulo||'';$('uc-desc').value=c.descricao||'';$('uc-secao').value=c.secao||'';$('uc-tag').value=c.tag||'';$('uc-emoji').value=c.emoji||'';
    $('uc-acao').value=c.acao||'link';valorBox(c.acao||'link',c.valor||'');
    $('uc-destaque').checked=!!c.destaque;$('uc-breve').checked=!!c.em_breve;$('uc-ativo').checked=c.ativo!==false;
    $('uc-prev').innerHTML=c.capa_url?'<img src="'+E(c.capa_url)+'">':'🖼️';$('uc-info').innerHTML='';$('uc-st').innerHTML='';$('uc-st').dataset.confirm='';
    var secs={};(CARDS||[]).filter(function(x){return x.universo===c.universo&&x.secao;}).forEach(function(x){secs[x.secao]=1;});
    $('uc-secoes').innerHTML=Object.keys(secs).map(function(s){return '<option value="'+E(s)+'">';}).join('');
    um.classList.add('open');
  }
  $('uc-acao')&&$('uc-acao').addEventListener('change',function(){valorBox(this.value,'');});
  $('uc-file')&&$('uc-file').addEventListener('change',function(){
    var f=this.files&&this.files[0];if(!f)return;var info=$('uc-info');
    if(f.size>2*1024*1024){info.innerHTML='<span style="color:var(--red)">'+(f.size/1048576).toFixed(1)+' MB — máximo 2 MB.</span>';this.value='';return;}
    var url=URL.createObjectURL(f),img=new Image();
    img.onload=function(){var r=img.naturalWidth/img.naturalHeight,ok=Math.abs(r-16/9)<0.06;
      info.innerHTML='<strong>'+img.naturalWidth+' × '+img.naturalHeight+' px</strong> '+(ok&&img.naturalWidth>=1280?'<span style="color:var(--green)">✓ perfeita</span>':ok?'<span style="color:var(--gold)">⚠ pequena</span>':'<span style="color:var(--gold)">⚠ não é 16:9, corto o centro</span>');
      $('uc-prev').innerHTML='<img src="'+url+'">';ADM.capa=f;};
    img.src=url;
  });
  async function salvarCard(){
    var st=$('uc-st'),c=ADM.edit,titulo=$('uc-titulo').value.trim();
    if(!titulo){st.innerHTML='<span style="color:var(--red)">Dá um título pro card.</span>';return;}
    st.innerHTML='⏳ Salvando...';
    var row={universo:c.universo,titulo:titulo,descricao:$('uc-desc').value.trim()||null,secao:$('uc-secao').value.trim()||null,tag:$('uc-tag').value.trim()||null,emoji:$('uc-emoji').value.trim()||null,
      acao:$('uc-acao').value,valor:($('uc-valor').value||'').trim()||null,destaque:$('uc-destaque').checked,em_breve:$('uc-breve').checked,ativo:$('uc-ativo').checked};
    if(c.capa_url===null)row.capa_url=null;
    try{
      var id=c.id;
      if(!id){row.ord=(CARDS||[]).filter(function(x){return x.universo===c.universo;}).length+1;var ins=await window._sb.from('mi_uni_cards').insert(row).select().single();if(ins.error)throw ins.error;id=ins.data.id;}
      if(ADM.capa){
        var ext=(ADM.capa.name.split('.').pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'')||'jpg',path='universos/'+id+'-'+Date.now()+'.'+ext;
        var up=await window._sb.storage.from('capas').upload(path,ADM.capa,{upsert:true,contentType:ADM.capa.type||'image/jpeg'});if(up.error)throw new Error('Capa: '+up.error.message);
        row.capa_url=window._sb.storage.from('capas').getPublicUrl(path).data.publicUrl;
      }
      var u=await window._sb.from('mi_uni_cards').update(row).eq('id',id);if(u.error)throw u.error;
      um.classList.remove('open');toast('✅ Card salvo!','#10b981');CARDS=null;loadAdminUni();
    }catch(err){st.innerHTML='<span style="color:var(--red)">Erro: '+E(err.message)+'</span>';}
  }
  document.addEventListener('click',async function(e){
    var b=e.target.closest('[data-ua]');if(!b)return;var a=b.dataset.ua;
    if(a==='uni'){ADM.uni=b.dataset.k;loadAdminUni();}
    else if(a==='novo')abrirModalCard(null);
    else if(a==='editar'){if(e.target.closest('.drag-handle'))return;abrirModalCard((CARDS||[]).filter(function(c){return c.id===b.dataset.id;})[0]);}
    else if(a==='fechar')um.classList.remove('open');
    else if(a==='capa'){if(e.target.closest('[data-ua="sem-capa"]'))return;$('uc-file').click();}
    else if(a==='sem-capa'){e.stopPropagation();ADM.capa=null;ADM.edit.capa_url=null;$('uc-prev').innerHTML='🖼️';$('uc-info').innerHTML='Sem capa (usa o emoji).';}
    else if(a==='salvar')salvarCard();
    else if(a==='apagar'){
      var st=$('uc-st');if(!ADM.edit.id){um.classList.remove('open');return;}
      if(st.dataset.confirm!=='1'){st.dataset.confirm='1';st.innerHTML='<span style="color:var(--red)">Clique em Apagar de novo pra confirmar.</span>';return;}
      var r=await window._sb.from('mi_uni_cards').delete().eq('id',ADM.edit.id);if(r.error){st.innerHTML='<span style="color:var(--red)">'+E(r.error.message)+'</span>';return;}
      um.classList.remove('open');toast('🗑️ Card apagado','#6b7280');CARDS=null;loadAdminUni();
    }
    else if(a==='bv-salvar'){
      var url=$('adm-bv-url').value.trim();
      if(url&&window.ytId&&!ytId(url)){toast('Não reconheci esse link do YouTube','#ef4444');return;}
      var cur=await window._sb.from('acesso').select('dados').eq('id','cfg').maybeSingle();
      var dados=Object.assign({},(cur.data&&cur.data.dados)||{},{videoBoasVindas:url});
      var r2=await window._sb.from('acesso').upsert({id:'cfg',dados:dados});
      toast(r2.error?'Não salvou: '+r2.error.message:'✅ Vídeo de boas-vindas salvo',r2.error?'#ef4444':'#10b981');
      var S=(window.EBG_ACESSO||{}).estado;if(S&&S.cfg)S.cfg.videoBoasVindas=url;
    }
    else if(a==='bv-ver')mostrarBoasVindas(true);
  });
  um.addEventListener('click',function(e){if(e.target===um)um.classList.remove('open');});
  montarAdmin();

  /* configurações: rever boas-vindas */
  (function(){var s=document.querySelector('#settings-overlay .modal-body');if(!s)return;
    var b=document.createElement('button');b.className='set-btn set-btn-ghost';b.textContent='▶ Rever o vídeo de como usar o app';var b2=document.createElement('button');b2.className='set-btn set-btn-ghost';b2.textContent='🧭 Fazer o tour pelos menus';b2.onclick=function(){if(window.closeSettings)closeSettings();go('home');setTimeout(function(){tour('todos');},500);};s.appendChild(b2);b.onclick=function(){if(window.closeSettings)closeSettings();mostrarBoasVindas(true);};s.appendChild(b);})();

  /* instalar como app */
  if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('sw.js').catch(function(){});



  /* ───────────────────────── BÚSSOLA (nível) e PRISMA (inteligências) ─────────────────────────
     Os testes são os sites de verdade; o aluno faz dentro do app e marca o resultado que apareceu. */
  var URL_BUSSOLA='https://nivelamentogediel.netlify.app/',URL_PRISMA='https://testedeinteligencia1.netlify.app/';
  var NIVEIS=['A1','A2','B1','B2','C1','C2'];
  var NIVEL_CAN={A1:'Se apresentar, perguntar e responder o básico do dia a dia.',A2:'Se virar em situações simples: compras, rotina, direções, família.',B1:'Conversar sobre o dia a dia e o trabalho, viajar sem travar.',B2:'Discutir ideias com fluência e entender séries e reuniões.',C1:'Usar o inglês com flexibilidade no trabalho e nos estudos.',C2:'Dominar o idioma com precisão, como um nativo culto.'};
  var INTEL={
    musical:{ic:'🎵',nome:'Auditivo-Musical',desc:'Você aprende melhor com ritmo, melodia e sons.',est:['Estude com músicas: leia a letra, cante, imite','Shadowing todo dia (10 min)','Podcasts no transporte','Imite sotaques de séries e cantores']},
    linguistica:{ic:'📝',nome:'Linguístico-Verbal',desc:'Você aprende melhor com palavras: lendo, escrevendo e explicando.',est:['Leia em voz alta todo dia','Escreva 3 frases no diário em inglês','Anote frases inteiras, não palavras soltas','Explique pra alguém o que aprendeu']},
    logica:{ic:'🧮',nome:'Lógico-Matemático',desc:'Você aprende melhor entendendo regras, padrões e o porquê.',est:['Entenda a regra e teste com exemplos seus','Monte tabelas de verbos e padrões','Faça os quizzes até gabaritar','Acompanhe seu progresso em números']},
    corporal:{ic:'🏃',nome:'Corporal-Cinestésico',desc:'Você aprende melhor em movimento, fazendo e praticando.',est:['Faça shadowing andando','Use gestos enquanto fala','Encene diálogos das aulas','Estude no transporte e na academia']},
    visual:{ic:'🎨',nome:'Visual-Espacial',desc:'Você aprende melhor com imagens, cores e o que consegue ver.',est:['Séries com legenda em inglês','Mapas mentais de vocabulário','Flashcards com imagem','Cores diferentes pra cada tempo verbal']},
    interpessoal:{ic:'🤝',nome:'Interpessoal',desc:'Você aprende melhor com outras pessoas, conversando e trocando.',est:['Entre nas lives e fale','Estude em dupla','Comente nas aulas e responda colegas','Ensine o que aprendeu pra alguém']},
    intrapessoal:{ic:'🧘',nome:'Intrapessoal',desc:'Você aprende melhor refletindo, no seu ritmo e com objetivos claros.',est:['Diário de metas em inglês','Autoavaliação toda semana','Estude sozinho no seu horário fixo','Ligue cada aula ao seu objetivo de vida']},
    naturalista:{ic:'🌿',nome:'Naturalista',desc:'Você aprende melhor observando, classificando e organizando.',est:['Organize o vocabulário por categorias','Estude ao ar livre','Descreva em inglês o que você vê','Assista documentários em inglês']}
  };
  function pintarPerfil(){
    var t=document.querySelector('.sidebar .level-tag'),l=document.querySelectorAll('.sidebar .level-row .level-lbl')[0],box=document.querySelector('.sidebar-level');
    if(t)t.textContent=ST.nivel||'?';
    if(l)l.textContent=ST.prisma&&INTEL[ST.prisma]?INTEL[ST.prisma].nome:(ST.nivel?'Faça o Prisma':'Faça seu diagnóstico');
    if(box&&!box.dataset.mi){box.dataset.mi='1';box.style.cursor='pointer';box.addEventListener('click',function(){go(ST.nivel?'prisma':'bussola');});}
    var sub=document.querySelector('#pane-maratona > div:nth-child(2)');if(sub)sub.textContent=(ST.nivel?'Sessão do nível '+ST.nivel+' · ':'')+'Escolha onde você está';
  }
  window.setManualLevel=function(lvl){if(NIVEIS.indexOf(lvl)<0)return;ST.nivel=lvl;try{localStorage.setItem('userLevel',lvl);}catch(e){}salvar();pintarPerfil();renderBussola();toast('✅ Seu nível agora é '+lvl,'#4f6ef7');};
  function setPrisma(k){if(!INTEL[k])return;ST.prisma=k;salvar();pintarPerfil();renderPrisma();toast('✅ '+INTEL[k].nome+' salvo no seu perfil','#8b5cf6');}
  function renderBussola(){
    var p=$('pane-bussola');if(!p)return;var lv=ST.nivel,info=lv&&window.LEVEL_INFO?LEVEL_INFO[lv]:null;
    p.innerHTML='<div style="font-size:21px;font-weight:800;margin-bottom:16px">Bússola CEFR</div>'
      +'<div class="intel-banner"><div style="display:flex;align-items:center;gap:12px;margin-bottom:12px"><div style="width:56px;height:56px;border-radius:16px;background:'+(info?info.bg:'var(--surface2)')+';display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;color:'+(info?'#fff':'var(--fg3)')+';flex-shrink:0">'+(lv||'?')+'</div>'
      +'<div><div style="font-size:16px;font-weight:800">'+(info?E(info.title):'Você ainda não fez o teste de nível')+'</div><div style="font-size:12px;color:var(--fg2);margin-top:2px">Bússola CEFR · do A1 ao C2</div></div></div>'
      +'<div style="font-size:12.5px;color:var(--fg2);line-height:1.7;margin-bottom:14px">'+(info?E(info.desc):'O teste se adapta às suas respostas e mostra onde você está. Leva uns 10 minutos. No fim, é só marcar aqui o nível que apareceu.')+'</div>'
      +'<button class="set-btn set-btn-primary" style="margin:0" data-dg="bussola">'+(lv?'🔁 Refazer o teste de nível':'🧭 Fazer o teste de nível')+'</button></div>'
      +'<div class="card" style="margin:16px 0"><div class="sec-hd" style="margin-bottom:10px">🎯 '+(lv?'Seu nível':'Já sabe seu nível? Marque aqui')+'</div><div style="display:flex;flex-wrap:wrap;gap:8px">'
      +NIVEIS.map(function(n){return '<button class="gf-btn'+(n===lv?' active':'')+'" onclick="setManualLevel(\''+n+'\')">'+n+'</button>';}).join('')+'</div></div>'
      +'<div class="sec-hd">O que cada nível consegue fazer</div><div class="card">'+NIVEIS.map(function(n){return '<div style="display:flex;gap:12px;align-items:flex-start;padding:9px 0;border-bottom:1px solid var(--border)'+(n===lv?';font-weight:700':'')+'"><span class="level-tag" style="flex-shrink:0;'+(n===lv?'':'background:var(--surface2);color:var(--fg2)')+'">'+n+'</span><span style="font-size:12.5px;line-height:1.5;color:'+(n===lv?'var(--fg)':'var(--fg2)')+'">'+E(NIVEL_CAN[n])+'</span></div>';}).join('')+'</div>';
  }
  function renderPrisma(){
    var p=$('pane-prisma');if(!p)return;var k=ST.prisma,it=k&&INTEL[k];
    p.innerHTML='<div style="font-size:21px;font-weight:800;margin-bottom:16px">Prisma de Talentos</div>'
      +'<div class="intel-banner"><div style="display:flex;align-items:center;gap:12px;margin-bottom:12px"><div style="width:56px;height:56px;border-radius:16px;background:'+(it?'linear-gradient(135deg,#8b5cf6,#ec4899)':'var(--surface2)')+';display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0">'+(it?it.ic:'🔷')+'</div>'
      +'<div><div style="font-size:16px;font-weight:800">'+(it?'Inteligência '+E(it.nome):'Descubra como você aprende melhor')+'</div><div style="font-size:12px;color:var(--fg2);margin-top:2px">'+(it?'Sua inteligência mais forte · Howard Gardner':'Teste das Inteligências Múltiplas · Howard Gardner')+'</div></div></div>'
      +'<div style="font-size:12.5px;color:var(--fg2);line-height:1.7;margin-bottom:14px">'+(it?E(it.desc):'O teste mostra quais das suas inteligências mais aparecem quando você aprende. Com isso, o seu estudo fica do seu jeito. No fim, é só marcar aqui a que deu mais forte.')+'</div>'
      +'<button class="set-btn set-btn-primary" style="margin:0" data-dg="prisma">'+(it?'🔁 Refazer o Prisma':'🔷 Fazer o Prisma')+'</button></div>'
      +(it?'<div class="card" style="margin-top:16px"><div style="font-size:12px;font-weight:800;margin-bottom:10px">Estratégias pra você</div><div style="font-size:12.5px;color:var(--fg2);line-height:1.9">'+it.est.map(function(x){return '• '+E(x);}).join('<br>')+'</div></div>':'')
      +'<div class="card" style="margin:16px 0"><div class="sec-hd" style="margin-bottom:10px">'+(it?'Mudou o resultado? Marque a sua':'Qual deu como sua inteligência mais forte?')+'</div><div style="display:flex;flex-wrap:wrap;gap:8px">'
      +Object.keys(INTEL).map(function(x){return '<button class="gf-btn'+(x===k?' active':'')+'" data-dg-int="'+x+'">'+INTEL[x].ic+' '+E(INTEL[x].nome)+'</button>';}).join('')+'</div></div>';
  }
  // o teste roda dentro do app
  var tq=document.createElement('div');tq.id='mi-teste';document.body.appendChild(tq);
  var tqc=document.createElement('style');
  tqc.textContent='#mi-teste{position:fixed;inset:0;z-index:8500;background:var(--bg);display:none;flex-direction:column}#mi-teste.on{display:flex}'
    +'#mi-teste .tt{display:flex;align-items:center;gap:10px;padding:12px max(16px,env(safe-area-inset-right)) 12px max(16px,env(safe-area-inset-left));padding-top:max(12px,env(safe-area-inset-top));border-bottom:1px solid var(--border);background:var(--sidebar)}'
    +'#mi-teste .tt b{flex:1;font-size:14px}#mi-teste iframe{flex:1;width:100%;border:0;background:#fff}'
    +'#mi-teste .fim{border-top:1px solid var(--border);background:var(--sidebar);padding:12px max(16px,env(safe-area-inset-right)) calc(12px + env(safe-area-inset-bottom)) max(16px,env(safe-area-inset-left))}'
    +'#mi-teste .fim .q{font-size:12px;font-weight:800;margin-bottom:8px}#mi-teste .fim .ch{display:flex;gap:6px;overflow-x:auto;padding-bottom:2px}#mi-teste .fim .ch button{flex-shrink:0}';
  document.head.appendChild(tqc);
  function abrirTeste(qual){
    var b=qual==='bussola';
    tq.innerHTML='<div class="tt"><button class="tb-btn" data-dg="fechar">✕</button><b>'+(b?'🧭 Teste de nível':'🔷 Prisma de Talentos')+'</b><a class="tb-btn" style="text-decoration:none" href="'+(b?URL_BUSSOLA:URL_PRISMA)+'" target="_blank" rel="noopener">Abrir fora ↗</a></div>'
      +'<iframe src="'+(b?URL_BUSSOLA:URL_PRISMA)+'" title="'+(b?'Teste de nível':'Prisma de Talentos')+'" allow="autoplay; microphone"></iframe>'
      +'<div class="fim"><div class="q">Terminou? Toque no resultado que apareceu:</div><div class="ch">'
      +(b?NIVEIS.map(function(n){return '<button class="gf-btn" data-dg-fim="'+n+'">'+n+'</button>';}).join(''):Object.keys(INTEL).map(function(x){return '<button class="gf-btn" data-dg-fim="'+x+'">'+INTEL[x].ic+' '+E(INTEL[x].nome)+'</button>';}).join(''))
      +'</div></div>';
    tq.dataset.qual=qual;tq.classList.add('on');document.body.style.overflow='hidden';
  }
  function fecharTeste(){tq.classList.remove('on');tq.innerHTML='';document.body.style.overflow='';}
  document.addEventListener('click',function(e){
    var b=e.target.closest('[data-dg]');
    if(b){var a=b.dataset.dg;if(a==='fechar')fecharTeste();else abrirTeste(a);return;}
    var f=e.target.closest('[data-dg-fim]');
    if(f){var v=f.dataset.dgFim;if(tq.dataset.qual==='bussola')window.setManualLevel(v);else setPrisma(v);fecharTeste();return;}
    var i=e.target.closest('[data-dg-int]');if(i)setPrisma(i.dataset.dgInt);
  });

  /* ───────────────────────── TOUR DOS MENUS ─────────────────────────
     Lê os menus que existem na lateral NA HORA. Menu novo entra sozinho no tour,
     e quem já fez o tour vê só a novidade. Os textos são editáveis no admin (Universos → Tutorial dos menus). */
  var TOUR_TXT={
    home:'Sua tela do dia: o checklist, as lives e a aula da vez. Comece sempre por aqui.',
    maratona:'O checklist de hoje, montado pro lugar onde você está. Toque em cada tarefa: tem o passo a passo, o conteúdo pra usar e uma provinha rápida.',
    lives:'A agenda das aulas ao vivo. Quando uma estiver no ar, aparece "AO VIVO" e é só tocar pra entrar.',
    modulos:'As aulas gravadas do Programa, liberadas 2 por semana. Cada aula tem quiz e comentários. Nas que ainda vão sair, vote em "estou esperando".',
    jogos:'Treine vocabulário e frases jogando. Os que têm o selo JOGAR já funcionam; os outros estão chegando.',
    materiais:'Seus PDFs e e-books: o que é gratuito e o que você já comprou ficam aqui.',
    agendar:'Marque aula comigo: conversação, grupo, casal, intensivo ou preparação pra entrevista, viagem, prova. Escolha o tipo, o dia e o horário que eu deixei livre.',
    prompts:'Prompts prontos pra praticar inglês com ChatGPT ou Claude. Personalize, copie e cole.',
    devocionais:'Os devocionais gravados do English On Mission.',
    eom:'English On Mission: inglês com a Bíblia. Devocionais, a playlist de inglês bíblico, materiais e o grupo.',
    culture:'Culture English: inglês com séries, filmes e música. Mini cursos, e-books e o grupo.',
    viagens:'Viagens e intercâmbio: Toronto, e-book de viagem, seguro, vlogs e um botão pra eu te ajudar a planejar sua viagem.',
    bussola:'Descubra seu nível de inglês, do A1 ao C2.',
    prisma:'Descubra como você aprende melhor. Isso deixa seu estudo do seu jeito.',
    config:'Seu nome e foto. Aqui também dá pra rever o vídeo de boas-vindas e este tour.',
    '#check':'O seu checklist de hoje. A barra mostra quanto falta pra fechar o dia.',
    '#lives':'A próxima live. Quando estiver acontecendo, fica vermelho com AO VIVO.',
    '#aula':'A sua aula da vez. Use ◀ ▶ pra voltar ou avançar entre as aulas.',
    '#duvida':'Ficou com dúvida? Toque aqui e mande pro professor a qualquer hora. A resposta chega aqui mesmo.',
    '#bnav':'Os atalhos do dia a dia ficam aqui embaixo. Em "Menu" estão todas as outras áreas.'
  };
  function tourTexto(k,lb){var t=(CFG.tour||{})[k];return t||TOUR_TXT[k]||('Uma área nova do app: '+lb+'. Toque pra conhecer.');}
  function menusAtuais(){
    var out=[];
    [].forEach.call(document.querySelectorAll('.sidebar .nav-pill'),function(n){
      if(n.id==='admin-nav'||getComputedStyle(n).display==='none')return;
      var oc=n.getAttribute('onclick')||'',m=oc.match(/goTo\('(\w+)'/),k=m?m[1]:(/openSettings/.test(oc)?'config':null);if(!k)return;
      var sp=n.querySelectorAll('span'),lb=(sp[1]||sp[0]||n).textContent.trim();
      out.push({k:k,lb:lb,el:n});
    });
    return out;
  }
  var tv=document.createElement('div');tv.id='mi-tour';document.body.appendChild(tv);
  var tcss=document.createElement('style');
  tcss.textContent='#mi-tour{position:fixed;inset:0;z-index:9500;display:none}#mi-tour.on{display:block}'
    +'#mi-tour .spot{position:fixed;border-radius:14px;box-shadow:0 0 0 9999px rgba(6,9,22,.72);transition:all .3s cubic-bezier(.22,1,.36,1);pointer-events:none;outline:3px solid #fff;outline-offset:2px}'
    +'#mi-tour .tip{position:fixed;width:310px;max-width:calc(100vw - 24px);background:var(--surface);color:var(--fg);border-radius:18px;padding:16px;box-shadow:0 24px 60px rgba(0,0,0,.4);transition:top .3s,left .3s}'
    +'#mi-tour .tip .k{font-size:10px;font-weight:800;letter-spacing:1.2px;color:var(--accent);text-transform:uppercase}'
    +'#mi-tour .tip .t{font-size:17px;font-weight:800;margin:4px 0 6px}#mi-tour .tip .d{font-size:13px;line-height:1.55;color:var(--fg2)}'
    +'#mi-tour .tip .b{display:flex;gap:8px;align-items:center;margin-top:14px}#mi-tour .tip .b button{border:none;border-radius:11px;padding:10px 14px;font-size:13px;font-weight:800;cursor:pointer}'
    +'#mi-tour .tip .pular{background:none!important;color:var(--fg3);padding:10px 4px!important;margin-right:auto}'
    +'#mi-tour .tip .vol{background:var(--surface2);color:var(--fg)}#mi-tour .tip .prx{background:linear-gradient(135deg,#4f6ef7,#8b5cf6);color:#fff}'
    +'#mi-tour .dots{display:flex;gap:4px;margin-top:12px;flex-wrap:wrap}#mi-tour .dots i{width:6px;height:6px;border-radius:50%;background:var(--border)}#mi-tour .dots i.on{background:var(--accent);width:16px;border-radius:4px}';
  document.head.appendChild(tcss);
  var T=null;
  function celular(){return window.matchMedia('(max-width:680px)').matches;}
  function passosTour(modo){
    var menus=menusAtuais(),p=[];
    if(modo==='novos'){
      menus.filter(function(m){return ST.tour.indexOf(m.k)<0;}).forEach(function(m){p.push({k:m.k,t:m.lb,d:tourTexto(m.k,m.lb),el:m.el,menu:true,kick:'Novidade no app ✨'});});
      return p;
    }
    var home=[['#check','.hm-check','Checklist de hoje'],['#lives','.hm-live','Lives'],['#aula','#hm-aula','Sua aula'],['#duvida','#ai-fab','Dúvidas com o professor']];
    home.forEach(function(h){var el=document.querySelector(h[1]);if(el&&el.offsetParent!==null||(el&&h[0]==='#duvida'))p.push({k:h[0],t:h[2],d:tourTexto(h[0],h[2]),el:el,kick:'Tela inicial'});});
    if(celular()&&$('mi-bnav'))p.push({k:'#bnav',t:'Barra de atalhos',d:tourTexto('#bnav','Barra de atalhos'),el:$('mi-bnav'),kick:'Navegação'});
    menus.forEach(function(m){p.push({k:m.k,t:m.lb,d:tourTexto(m.k,m.lb),el:m.el,menu:true,kick:'Menu'});});
    return p;
  }
  function tour(modo){
    var p=passosTour(modo);if(!p.length)return;
    T={p:p,i:0,modo:modo};tv.classList.add('on');
    tv.innerHTML='<div class="spot"></div><div class="tip"></div>';
    tourPasso();
  }
  function tourPasso(){
    var s=T.p[T.i],el=s.el;
    gaveta(!!(s.menu&&celular()));
    setTimeout(function(){
      if(!T)return;
      if(el&&el.scrollIntoView)el.scrollIntoView({block:'nearest',behavior:'smooth'});
      setTimeout(function(){if(T)tourPos();},s.menu&&celular()?260:180);
    },s.menu&&celular()?120:0);
    var tip=tv.querySelector('.tip'),fim=T.i===T.p.length-1;
    tip.innerHTML='<div class="k">'+E(s.kick)+' · '+(T.i+1)+' de '+T.p.length+'</div><div class="t">'+E(s.t)+'</div><div class="d">'+E(s.d)+'</div>'
      +'<div class="b"><button class="pular" data-tr="pular">'+(fim?'':'Pular tour')+'</button>'+(T.i?'<button class="vol" data-tr="vol">Voltar</button>':'')+'<button class="prx" data-tr="prx">'+(fim?'Bora! 🚀':'Próximo →')+'</button></div>'
      +(T.p.length>1&&T.p.length<=20?'<div class="dots">'+T.p.map(function(x,i){return '<i class="'+(i===T.i?'on':'')+'"></i>';}).join('')+'</div>':'');
  }
  function tourPos(){
    var s=T.p[T.i],el=s.el,spot=tv.querySelector('.spot'),tip=tv.querySelector('.tip');
    var W=innerWidth,H=innerHeight,tw=Math.min(310,W-24),th=tip.offsetHeight||170;
    if(!el){spot.style.cssText='left:50%;top:50%;width:0;height:0';tip.style.left=(W-tw)/2+'px';tip.style.top=(H-th)/2+'px';return;}
    var r=el.getBoundingClientRect(),pd=6;
    spot.style.left=(r.left-pd)+'px';spot.style.top=(r.top-pd)+'px';spot.style.width=(r.width+pd*2)+'px';spot.style.height=(r.height+pd*2)+'px';
    var x,y;
    if(s.menu&&!celular()){x=r.right+18;y=Math.max(12,Math.min(H-th-12,r.top+r.height/2-th/2));}
    else if(s.menu&&celular()){x=Math.min(W-tw-12,Math.max(12,r.right-tw*0.35));y=r.bottom+14+th>H-12?r.top-th-14:r.bottom+14;if(x<r.right-40&&x+tw>r.left&&y<r.bottom&&y+th>r.top)y=r.bottom+14;}
    else{x=Math.max(12,Math.min(W-tw-12,r.left+r.width/2-tw/2));y=r.bottom+14+th<=H-12?r.bottom+14:Math.max(12,r.top-th-14);}
    if(x+tw>W-12)x=W-tw-12;
    tip.style.left=x+'px';tip.style.top=Math.max(12,Math.min(H-th-12,y))+'px';
  }
  function tourFim(){
    if(!T)return;
    menusAtuais().forEach(function(m){if(ST.tour.indexOf(m.k)<0)ST.tour.push(m.k);});salvar();
    T=null;tv.classList.remove('on');tv.innerHTML='';gaveta(false);
  }
  tv.addEventListener('click',function(e){
    var b=e.target.closest('[data-tr]');if(!b||!T)return;
    if(b.dataset.tr==='pular')return tourFim();
    if(b.dataset.tr==='vol'&&T.i>0){T.i--;return tourPasso();}
    if(b.dataset.tr==='prx'){if(T.i>=T.p.length-1)return tourFim();T.i++;tourPasso();}
  });
  window.addEventListener('resize',function(){if(T)tourPos();});
  document.addEventListener('keydown',function(e){if(!T)return;if(e.key==='Escape')tourFim();if(e.key==='ArrowRight'){if(T.i>=T.p.length-1)tourFim();else{T.i++;tourPasso();}}if(e.key==='ArrowLeft'&&T.i>0){T.i--;tourPasso();}});
  async function tourAuto(){
    if(T||!U)return;
    await lerCfg();
    if(!ST.tour.length){tour('todos');return;}
    var novos=menusAtuais().filter(function(m){return ST.tour.indexOf(m.k)<0;});
    if(novos.length)tour('novos');
  }

  /* admin: textos do tour */
  function montarAdminTour(){
    var p=$('adm-universos');if(!p||$('adm-tour-box'))return;
    var box=document.createElement('div');box.className='admin-form';box.id='adm-tour-box';
    box.innerHTML='<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:6px"><div class="admin-form-title" style="margin:0">🧭 Tutorial dos menus</div><div style="display:flex;gap:8px"><button class="admin-btn admin-btn-ghost admin-btn-sm" data-ua="tour-testar">▶ Testar tour</button><button class="admin-btn admin-btn-primary admin-btn-sm" data-ua="tour-salvar">💾 Salvar textos</button></div></div>'
      +'<div style="font-size:12px;color:var(--fg2);margin-bottom:12px;line-height:1.6">O tour aparece sozinho na primeira entrada do aluno. Quando você cria um menu novo, quem já fez o tour vê só a novidade. Deixe em branco pra usar o texto padrão.</div><div id="adm-tour-list"></div>';
    p.insertBefore(box,p.children[1]||null);
  }
  function pintarAdminTour(){
    var l=$('adm-tour-list');if(!l)return;
    var itens=menusAtuais().map(function(m){return {k:m.k,lb:m.lb};}).concat([{k:'#check',lb:'Início · botão Checklist'},{k:'#lives',lb:'Início · botão Lives'},{k:'#aula',lb:'Início · Sua aula'},{k:'#duvida',lb:'Botão de dúvidas 🙋'},{k:'#bnav',lb:'Celular · barra de baixo'}]);
    l.innerHTML=itens.map(function(m){return '<div style="margin-bottom:10px"><div class="adm-section" style="margin:0 0 4px">'+E(m.lb)+'</div><textarea class="admin-inp" rows="2" data-tourk="'+E(m.k)+'" placeholder="'+E(TOUR_TXT[m.k]||'Uma área nova do app: '+m.lb+'.')+'">'+E((CFG.tour||{})[m.k]||'')+'</textarea></div>';}).join('');
  }
  var luAnt=loadAdminUni;
  loadAdminUni=async function(){await luAnt();montarAdminTour();pintarAdminTour();};
  document.addEventListener('click',async function(e){
    var b=e.target.closest('[data-ua="tour-salvar"],[data-ua="tour-testar"]');if(!b)return;
    if(b.dataset.ua==='tour-testar'){go('home');setTimeout(function(){tour('todos');},500);return;}
    var t={};[].forEach.call(document.querySelectorAll('[data-tourk]'),function(x){var v=x.value.trim();if(v)t[x.dataset.tourk]=v;});
    var cur=await window._sb.from('acesso').select('dados').eq('id','cfg').maybeSingle();
    var dados=Object.assign({},(cur.data&&cur.data.dados)||{},{tour:t});
    var r=await window._sb.from('acesso').upsert({id:'cfg',dados:dados});
    if(!r.error)CFG.tour=t;
    toast(r.error?'Não salvou: '+r.error.message:'✅ Textos do tour salvos',r.error?'#ef4444':'#10b981');
  });

  document.addEventListener('error',function(e){var im=e.target;if(!im||im.tagName!=='IMG'||!im.hasAttribute('data-capa-t')||!window.capaAuto)return;var d=document.createElement('div');d.innerHTML=capaAuto(im.getAttribute('data-capa-t'),+im.getAttribute('data-capa-i')||0);im.replaceWith(d.firstChild);},true);
  window.MI_APP={tour:tour,aulaAberta:aulaAberta,marcarDia:marcarDia,abrirAula:abrirAula,renderHome:renderHome,
    compartilharQuiz:function(sc,tot){var t=(window._stCurLes&&_stCurLes.title)||'aula';wa('Acertei '+sc+'/'+tot+' no quiz da aula "'+t+'" do Método Inteligente 🔥 Bora treinar comigo? Faz o teste de nível grátis: '+linkIndicacao(),false);}};
})();
