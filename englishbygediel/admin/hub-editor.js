/* Aba "Hub" do painel: edita tudo do hub.html (cores, abertura, modos, cards, textos, links, fotos).
   Salva uma linha na tabela site_config (id 'hub'), que o Hub lê ao abrir. Rode supabase/hub.sql antes. */
(() => {
  const A = window.EBG_ADMIN;
  if (!A) return;
  const { sb, aviso } = A;
  const C = window.EBG || {}, CFG = window.EBG_CONFIG || {};
  const $ = (s, el = document) => el.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const verImg = u => (!u ? '' : /^(https?:|data:|blob:)/.test(u) ? u : '../' + u);
  const copia = o => JSON.parse(JSON.stringify(o));

  // o que cada seção tem. [chave, rótulo, tipo, ajuda]
  const OPC = {
    tipoCard: [['gratis', 'Grátis'], ['pago', 'À venda'], ['membros', 'Dentro da mentoria (trancado)'], ['extra', 'Ecossistema'], ['aluno', 'Depoimento de aluno']],
    rede: [['youtube', 'YouTube'], ['tiktok', 'TikTok'], ['instagram', 'Instagram'], ['whatsapp', 'WhatsApp'], ['link', 'Outro link']],
    ir: [['gratis', 'Materiais grátis'], ['pagos', 'À venda'], ['membros', 'Dentro da mentoria'], ['extras', 'Ecossistema'], ['alunos', 'Alunos'], ['aplicar', 'Chat da mentoria'], ['login', 'Entrar (área de membros)']],
    icone: [['estrela', 'Estrela'], ['livro', 'Livro'], ['pessoas', 'Pessoas'], ['chat', 'Balão'], ['play', 'Play'], ['coracao', 'Coração'], ['cadeado', 'Cadeado']]
  };
  const SECOES = [
    { k: 'tema', t: 'Cores e fundo', d: 'As cores do Hub inteiro e a imagem de gradiente usada nos fundos e nos cards sem foto.', campos: [
      ['fundo', 'Fundo da página', 'cor'], ['card', 'Fundo dos cards', 'cor'], ['destaque', 'Destaque (selos, chat)', 'cor'],
      ['destaqueClaro', 'Destaque claro (palavras em destaque, preço)', 'cor'], ['texto', 'Texto principal', 'cor'], ['suave', 'Texto secundário', 'cor'],
      ['gradiente', 'Imagem de gradiente', 'img']] },
    { k: 'entrada', t: 'Abertura (escolher o modo)', d: 'A primeira tela, com os modos girando em volta de você.', campos: [
      ['marca', 'Marca no topo'], ['rotulo', 'Linha pequena'], ['titulo', 'Título, antes da palavra destacada'], ['palavra', 'Palavra destacada'],
      ['tituloFim', 'Final do título'], ['dica', 'Dica embaixo do título'], ['botao', 'Botão (vem antes do nome do modo)'],
      ['foto', 'Sua foto no centro (de preferência sem fundo)', 'img'], ['fundo', 'Fundo da abertura', 'img']] },
    { k: 'modos', t: 'Modos', d: 'Os cards do anel. A ordem aqui é a ordem no anel. O texto aparece no topo quando a pessoa liga o modo.', lista: true,
      titulo: 'nome', foto: 'img', novo: () => ({ id: 'modo' + Date.now().toString(36), nome: 'Modo Novo', img: '', marca: '', texto: '', recorte: false, tamanho: 100, verde: false, ativo: true }),
      campos: [['nome', 'Nome'], ['img', 'Foto do card', 'img'], ['marca', 'Selo (ex.: Comece aqui)'], ['texto', 'Texto quando o modo liga', 'area'],
        ['recorte', 'A foto é sem fundo (ganha gradiente e efeito 3D)', 'bool'], ['tamanho', 'Tamanho da pessoa no card (%)', 'num'],
        ['verde', 'Card verde', 'bool'], ['ativo', 'Aparece no anel', 'bool'], ['id', 'Código do modo (sem espaço; os cards usam ele)', 'codigo']] },
    { k: 'topo', t: 'Topo do Hub', d: 'O que aparece depois que a pessoa liga um modo.', campos: [
      ['nome', 'Seu nome'], ['verificado', 'Mostrar selo azul', 'bool'], ['cargo', 'Linha embaixo do nome'], ['bio', 'Texto (quando o modo não tem texto)', 'area'],
      ['avatar', 'Foto redonda', 'img'], ['fundo', 'Fundo do topo', 'img']] },
    { k: 'redes', t: 'Redes sociais', d: 'Os botões redondos do topo.', lista: true, titulo: 'tipo', novo: () => ({ tipo: 'link', url: 'https://' }),
      campos: [['tipo', 'Rede', 'sel', OPC.rede], ['url', 'Link', 'url']] },
    { k: 'atalhos', t: 'Atalhos', d: 'Os 4 quadrados com ícone que giram, logo abaixo do topo.', lista: true, titulo: 'titulo', foto: 'img',
      novo: () => ({ titulo: 'Novo', sub: '', img: '', ir: 'gratis', icone: 'estrela' }),
      campos: [['titulo', 'Título'], ['sub', 'Subtítulo'], ['img', 'Foto', 'img'], ['ir', 'Leva até', 'sel', OPC.ir], ['icone', 'Ícone', 'sel', OPC.icone]] },
    { k: 'destaque', t: 'Vídeo em destaque', d: 'O cartão grande. Ao tocar, abre a ficha da mentoria.', campos: [
      ['rotulo', 'Etiqueta'], ['titulo', 'Título'], ['texto', 'Texto', 'area'], ['botao', 'Botão'], ['img', 'Imagem', 'img']] },
    { k: 'mentoria', t: 'Ficha da mentoria', d: 'O que aparece ao tocar no vídeo em destaque.', campos: [
      ['titulo', 'Título'], ['sinopse', 'Descrição', 'area'], ['inclui', 'O que inclui (um item por linha)', 'area'], ['meta', 'Etiquetas (separe por vírgula)'],
      ['precoDe', 'Preço "de"'], ['precoPor', 'Preço "por"'], ['nota', 'Observação do preço'], ['video', 'Vídeo do YouTube (link ou código)', 'video'],
      ['img', 'Imagem (se não tiver vídeo)', 'img'], ['checkout', 'Link de compra', 'url'], ['botaoAplicar', 'Botão que leva ao chat'], ['botaoComprar', 'Botão de compra']] },
    { k: 'secoes', t: 'Títulos das fileiras', campos: [
      ['gratis', 'Fileira grátis'], ['pagos', 'Fileira à venda'], ['botaoPagos', 'Link ao lado do título à venda'], ['membros', 'Fileira dentro da mentoria'], ['membrosSub', 'Link ao lado (abre o login)'], ['extras', 'Fileira ecossistema'], ['alunos', 'Fileira de alunos'], ['botaoAluno', 'Botão na ficha do aluno']] },
    { k: 'cards', t: 'Cards (materiais e depoimentos)', d: 'Tudo o que aparece nas fileiras. Grátis vão pra fileira grátis, à venda pra "Pra ir mais fundo", trancados pra "Dentro da mentoria", ecossistema pra fileira própria e depoimentos pra fileira de alunos. Marque os modos onde o card aparece primeiro (sem nenhum marcado, aparece em todos).',
      lista: true, filtro: true, titulo: 'titulo', foto: 'img',
      novo: () => ({ id: 'c' + Date.now().toString(36), tipo: 'gratis', ativo: true, titulo: 'Novo material', linha: '', nome: '', setor: '', img: '', preco: '', link: '', botao: '', link2: '', botao2: '', video: '', sinopse: '', meta: '', modos: [] }),
      campos: [['tipo', 'Tipo', 'sel', OPC.tipoCard], ['ativo', 'Visível', 'bool'], ['titulo', 'Título (no depoimento, a frase)'], ['linha', 'Linha embaixo do título'],
        ['nome', 'Nome do aluno (só depoimento)'], ['setor', 'Setor (vira filtro na fileira grátis: Prompts, E-books, Guias…)'], ['img', 'Capa', 'img'],
        ['preco', 'Preço (à venda)'], ['link', 'Link do botão (landing, checkout, PDF…)', 'url'], ['botao', 'Texto do botão'],
        ['link2', 'Segundo link (opcional)', 'url'], ['botao2', 'Texto do segundo botão'], ['video', 'Vídeo do YouTube (link ou código)', 'video'],
        ['sinopse', 'Descrição (aparece ao tocar)', 'area'], ['meta', 'Etiquetas (separe por vírgula)'], ['modos', 'Aparece primeiro nos modos', 'modos']] },
    { k: 'membros', t: 'Entrar (área de membros)', d: 'O botão Entrar no topo e a janela de login. Cole o link da sua área de membros (Cakto, plataforma etc.). Sem link, o botão abre seu WhatsApp.', campos: [
      ['url', 'Link da área de membros', 'url'], ['botaoTopo', 'Texto do botão no topo'], ['titulo', 'Título da janela'], ['texto', 'Texto da janela', 'area'],
      ['botao', 'Botão que abre a área de membros'], ['semConta', 'Botão pra quem ainda não é aluno'], ['cardBotao', 'Botão nos cards "dentro da mentoria"']] },
    { k: 'aplicacao', t: 'Chat de aplicação', d: 'A seção final, com o chat que manda as respostas pro seu WhatsApp.', campos: [
      ['rotulo', 'Etiqueta'], ['titulo', 'Título'], ['destaque', 'Final do título (em destaque)'], ['texto', 'Texto', 'area'], ['foto', 'Foto no chat', 'img'],
      ['whatsapp', 'WhatsApp que recebe (55 + DDD + número)']] },
    { k: 'rodape', t: 'Rodapé', campos: [['nome', 'Nome'], ['linha', 'Linha de baixo']] }
  ];

  let H = null, base = null, sujo = false, filtroTipo = '', filtroModo = '';
  const abertos = new Set();

  function marcar() { sujo = true; $('#hubEstado').textContent = 'Alterações não salvas'; $('#hubEstado').className = 'hub-estado sujo'; }

  function videoId(v) { const m = String(v || '').match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{6,})/); return m ? m[1] : String(v || '').trim(); }

  function campoHTML(sec, f, obj, caminho) {
    const [k, rot, tipo = 'txt', ops] = f;
    const v = obj[k];
    const nome = `${caminho}.${k}`;
    if (tipo === 'bool') return `<label class="check grande hub-bool"><input type="checkbox" data-c="${nome}" ${v !== false && v ? 'checked' : ''}> ${esc(rot)}</label>`;
    let entrada;
    if (tipo === 'area') entrada = `<textarea data-c="${nome}" rows="3">${esc(v)}</textarea>`;
    else if (tipo === 'cor') entrada = `<span class="hub-cor"><input type="color" data-c="${nome}" value="${esc(/^#[0-9a-f]{6}$/i.test(v || '') ? v : '#000000')}"><input data-c="${nome}" value="${esc(v)}" maxlength="9"></span>`;
    else if (tipo === 'num') entrada = `<input type="number" data-c="${nome}" value="${esc(v)}" min="20" max="130">`;
    else if (tipo === 'sel') entrada = `<select data-c="${nome}">${ops.map(([a, b]) => `<option value="${a}" ${a === v ? 'selected' : ''}>${esc(b)}</option>`).join('')}</select>`;
    else if (tipo === 'modos') return `<fieldset class="modos-check"><legend>${esc(rot)}</legend><div class="hub-modos">${(H.modos || []).map(m =>
      `<label class="check"><input type="checkbox" data-modo="${nome}" value="${esc(m.id)}" ${(v || []).includes(m.id) ? 'checked' : ''}> ${esc(m.nome)}</label>`).join('')}</div></fieldset>`;
    else if (tipo === 'img') return `<div class="campo hub-img"><span>${esc(rot)}</span><div class="hub-img-linha">
        <div class="hub-mini">${v ? `<img src="${esc(verImg(v))}" alt="">` : '<i>sem foto</i>'}</div>
        <div class="hub-img-acoes"><label class="botao arquivo">Enviar foto<input type="file" accept="image/*" data-up="${nome}"></label>
        <input data-c="${nome}" value="${esc(v)}" placeholder="ou cole o link da imagem">${v ? `<button class="link perigo" type="button" data-limpa="${nome}">Tirar foto</button>` : ''}</div></div></div>`;
    else entrada = `<input data-c="${nome}" value="${esc(v)}" ${tipo === 'url' ? 'type="url" placeholder="https://"' : ''} ${tipo === 'video' ? 'placeholder="https://youtu.be/…"' : ''}>`;
    return `<label class="campo"><span>${esc(rot)}</span>${entrada}</label>`;
  }

  function itemHTML(sec, it, i) {
    const caminho = `${sec.k}.${i}`;
    const aberto = abertos.has(caminho);
    const tit = sec.k === 'redes' ? (OPC.rede.find(x => x[0] === it.tipo) || [, it.tipo])[1] : it[sec.titulo] || '(sem título)';
    const tag = sec.k === 'cards' ? `<span class="hub-tag ${it.tipo}">${esc((OPC.tipoCard.find(x => x[0] === it.tipo) || [, ''])[1])}</span>` : '';
    const off = it.ativo === false ? '<span class="hub-tag off">Escondido</span>' : '';
    return `<details class="hub-item" data-item="${caminho}" ${aberto ? 'open' : ''}>
      <summary>${sec.foto ? `<span class="hub-mini p">${it[sec.foto] ? `<img src="${esc(verImg(it[sec.foto]))}" alt="">` : ''}</span>` : ''}
        <strong>${esc(tit)}</strong>${tag}${off}
        <span class="hub-ordem"><button type="button" data-sobe="${caminho}" aria-label="Subir">↑</button><button type="button" data-desce="${caminho}" aria-label="Descer">↓</button></span></summary>
      <div class="hub-campos">${sec.campos.map(f => campoHTML(sec, f, it, caminho)).join('')}
        <div class="hub-item-acoes"><button class="botao" type="button" data-dup="${caminho}">Duplicar</button><button class="link perigo" type="button" data-apaga="${caminho}">Apagar</button></div>
      </div></details>`;
  }

  function desenhar() {
    $('#hubEditor').innerHTML = SECOES.map(sec => {
      let corpo;
      if (sec.lista) {
        const lista = H[sec.k] || [];
        const visiveis = lista.map((it, i) => [it, i]).filter(([it]) => !sec.filtro
          || ((!filtroTipo || it.tipo === filtroTipo) && (!filtroModo || (it.modos || []).includes(filtroModo) || !(it.modos || []).length)));
        const filtros = sec.filtro ? `<div class="hub-filtros"><select id="hubFTipo"><option value="">Todos os tipos</option>${OPC.tipoCard.map(([a, b]) => `<option value="${a}" ${a === filtroTipo ? 'selected' : ''}>${b}</option>`).join('')}</select>
          <select id="hubFModo"><option value="">Todos os modos</option>${(H.modos || []).map(m => `<option value="${esc(m.id)}" ${m.id === filtroModo ? 'selected' : ''}>${esc(m.nome)}</option>`).join('')}</select>
          <span class="conta">${visiveis.length} de ${lista.length}</span></div>` : '';
        corpo = filtros + `<div class="hub-lista">${visiveis.map(([it, i]) => itemHTML(sec, it, i)).join('')}</div>
          <button class="botao cheio" type="button" data-novo="${sec.k}">Adicionar ${sec.k === 'cards' ? 'card' : sec.k === 'modos' ? 'modo' : sec.k === 'redes' ? 'rede' : 'atalho'}</button>`;
      } else corpo = `<div class="hub-campos">${sec.campos.map(f => campoHTML(sec, f, H[sec.k] || {}, sec.k)).join('')}</div>`;
      return `<details class="cartao hub-sec" data-sec="${sec.k}" ${abertos.has(sec.k) ? 'open' : ''}><summary><h3>${esc(sec.t)}</h3></summary>${sec.d ? `<p class="sub">${esc(sec.d)}</p>` : ''}${corpo}</details>`;
    }).join('');
  }

  const pegar = caminho => { const ps = caminho.split('.'); const k = ps.pop(); let o = H; ps.forEach(p => { o = o[p]; }); return [o, k]; };
  function valor(caminho, v) { const [o, k] = pegar(caminho); o[k] = v; marcar(); }

  function reduzir(arquivo) {
    return new Promise((ok, falha) => {
      const img = new Image();
      img.onload = () => {
        const escala = Math.min(1, 1600 / Math.max(img.width, img.height));
        const cv = document.createElement('canvas');
        cv.width = Math.round(img.width * escala); cv.height = Math.round(img.height * escala);
        cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
        cv.toBlob(b => (b ? ok(b) : falha(new Error('imagem'))), 'image/webp', 0.88); // webp mantém a transparência das fotos sem fundo
        URL.revokeObjectURL(img.src);
      };
      img.onerror = () => falha(new Error('imagem'));
      img.src = URL.createObjectURL(arquivo);
    });
  }

  async function enviar(input) {
    const arq = input.files[0]; if (!arq) return;
    const caminho = input.dataset.up;
    const box = input.closest('.hub-img').querySelector('.hub-mini');
    box.innerHTML = '<i>enviando…</i>';
    try {
      const blob = await reduzir(arq);
      const nome = `hub/${crypto.randomUUID()}.webp`;
      const { error } = await sb.storage.from('capas').upload(nome, blob, { contentType: 'image/webp', upsert: false });
      if (error) throw error;
      valor(caminho, sb.storage.from('capas').getPublicUrl(nome).data.publicUrl);
      desenhar();
    } catch (e) { aviso('Não deu pra enviar a foto. Tente outra, ou cole o link.'); box.innerHTML = '<i>erro</i>'; }
  }

  async function carregar() {
    base = window.HUB_DADOS.padrao(C, CFG);
    const { data, error } = await sb.from('site_config').select('dados, updated_at').eq('id', 'hub').maybeSingle();
    if (error) { $('#hubEstado').textContent = 'Rode o supabase/hub.sql no Supabase pra poder salvar.'; $('#hubEstado').className = 'hub-estado sujo'; }
    H = window.HUB_DADOS.juntar(copia(base), data && data.dados);
    if (!error) { $('#hubEstado').textContent = data ? 'Salvo em ' + new Date(data.updated_at).toLocaleString('pt-BR') : 'Usando o conteúdo padrão'; $('#hubEstado').className = 'hub-estado'; }
    sujo = false;
    desenhar();
  }

  async function salvar() {
    const ids = (H.cards || []).map(c => c.id).concat((H.modos || []).map(m => 'm:' + m.id));
    if (new Set(ids).size !== ids.length) { aviso('Dois cards ou dois modos estão com o mesmo código. Troque um deles.'); return; }
    $('#hubSalvar').disabled = true;
    const { error } = await sb.from('site_config').upsert({ id: 'hub', dados: H, updated_at: new Date().toISOString() });
    $('#hubSalvar').disabled = false;
    if (error) { aviso('Não deu pra salvar. Rode o supabase/hub.sql no Supabase e tente de novo.'); return; }
    sujo = false; $('#hubEstado').textContent = 'Salvo agora. O Hub já mostra a versão nova.'; $('#hubEstado').className = 'hub-estado ok';
    aviso('Hub salvo.');
  }

  function previa() {
    try { localStorage.setItem('ebg:hubrascunho', JSON.stringify(H)); } catch (e) { aviso('O navegador não deixou guardar a prévia.'); return; }
    window.open('../?rascunho=1', '_blank', 'noopener');
  }

  async function restaurar() {
    if (!confirm('Voltar o Hub inteiro pro conteúdo padrão? O que você salvou aqui será apagado.')) return;
    const { error } = await sb.from('site_config').delete().eq('id', 'hub');
    if (error) { aviso('Não deu pra restaurar agora.'); return; }
    aviso('Hub voltou pro padrão.'); carregar();
  }

  function mover(caminho, d) {
    const [lista, i] = pegar(caminho); const a = Number(i), b = a + d;
    if (b < 0 || b >= lista.length) return;
    [lista[a], lista[b]] = [lista[b], lista[a]]; marcar(); desenhar();
  }

  // eventos
  const ed = () => $('#hubEditor');
  document.addEventListener('input', e => {
    const el = e.target;
    if (!ed() || !ed().contains(el)) return;
    if (el.id === 'hubFTipo' || el.id === 'hubFModo') { filtroTipo = $('#hubFTipo').value; filtroModo = $('#hubFModo').value; desenhar(); return; }
    if (el.dataset.c) {
      const [, k] = pegar(el.dataset.c);
      let v = el.type === 'checkbox' ? el.checked : el.value;
      if (el.type === 'number') v = Number(v) || 100;
      if (/video/.test(k)) v = videoId(v);
      if (k === 'id') v = String(v).toLowerCase().replace(/[^a-z0-9-]/g, '');
      valor(el.dataset.c, v);
      if (el.type === 'color') { const t = el.parentElement.querySelector('input:not([type=color])'); if (t) t.value = el.value; }
      else if (el.parentElement.classList.contains('hub-cor')) { const c = el.parentElement.querySelector('input[type=color]'); if (c && /^#[0-9a-f]{6}$/i.test(v)) c.value = v; }
      if (el.type === 'checkbox' || el.tagName === 'SELECT') desenhar();
    }
    if (el.dataset.modo) {
      const lista = [...ed().querySelectorAll(`[data-modo="${el.dataset.modo}"]:checked`)].map(x => x.value);
      valor(el.dataset.modo, lista);
    }
  });
  document.addEventListener('change', e => { if (e.target.dataset && e.target.dataset.up && ed() && ed().contains(e.target)) enviar(e.target); });
  document.addEventListener('toggle', e => {
    const d = e.target; if (!d.matches || !ed() || !ed().contains(d)) return;
    const id = d.dataset.item || d.dataset.sec; if (!id) return;
    d.open ? abertos.add(id) : abertos.delete(id);
  }, true);
  document.addEventListener('click', e => {
    if (!ed() || !ed().contains(e.target)) return;
    const b = e.target.closest('button'); if (!b) return;
    const d = b.dataset;
    if (d.sobe || d.desce) { e.preventDefault(); mover(d.sobe || d.desce, d.sobe ? -1 : 1); }
    else if (d.novo) { const sec = SECOES.find(s => s.k === d.novo); H[d.novo] = H[d.novo] || []; H[d.novo].push(sec.novo()); abertos.add(`${d.novo}.${H[d.novo].length - 1}`); marcar(); desenhar(); }
    else if (d.apaga) { const [lista, i] = pegar(d.apaga); if (confirm('Apagar este item?')) { lista.splice(Number(i), 1); marcar(); desenhar(); } }
    else if (d.dup) { const [lista, i] = pegar(d.dup); const n = copia(lista[i]); if ('id' in n) n.id = (n.id || 'c') + '-' + Date.now().toString(36).slice(-4); if (n.titulo) n.titulo += ' (cópia)'; if (n.nome && !n.titulo) n.nome += ' (cópia)'; lista.splice(Number(i) + 1, 0, n); marcar(); desenhar(); }
    else if (d.limpa) { valor(d.limpa, ''); desenhar(); }
  });
  addEventListener('beforeunload', e => { if (sujo) { e.preventDefault(); e.returnValue = ''; } });

  window.EBG_HUBED = {
    abrir() {
      if (!$('#hubSalvar').dataset.l) {
        $('#hubSalvar').dataset.l = 1;
        $('#hubSalvar').addEventListener('click', salvar);
        $('#hubPrevia').addEventListener('click', previa);
        $('#hubRestaurar').addEventListener('click', restaurar);
        $('#hubDesfazer').addEventListener('click', () => { if (!sujo || confirm('Descartar o que você mudou desde o último salvar?')) carregar(); });
      }
      if (!H) carregar();
    }
  };
})();
