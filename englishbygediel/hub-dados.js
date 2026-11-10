/* Conteúdo do Hub (hub.html) como dados editáveis.
   HUB_PADRAO monta o conteúdo de fábrica a partir do content.js e do config.js.
   O que você salva no painel (/admin → aba Hub) fica na tabela site_config do Supabase
   e substitui o padrão, seção por seção. */
(() => {
  const https = u => (/^https:\/\//i.test(u || '') ? u : '');

  function padrao(C, CFG) {
    const whats = t => `https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent(t || '')}`;
    const destino = cta => {
      if (!cta) return '';
      if (cta.acao === 'whatsapp') return whats(cta.texto);
      if (cta.acao === 'teste') return https(CFG.bussola);
      if (cta.acao === 'prisma') return https(CFG.prisma);
      if (cta.acao === 'checkout') return https(CFG.checkoutMentoria);
      if (cta.acao === 'link') return https(cta.href) || https(CFG[cta.href]) || https((CFG.instagram || {})[cta.href]);
      return '';
    };
    const setor = (k, it) => (/teste|prisma|diag/.test(k) ? 'Testes' : it.grupo ? 'Comunidade' : 'Ao vivo');
    const cards = [];
    (C.materiais || []).filter(x => x.gratis).forEach(x => cards.push(material(x)));
    Object.entries(C.itens || {}).forEach(([k, it]) => {
      if (it.tipo !== 'gratis' || it.indisponivel) return;
      cards.push({ id: k, tipo: 'gratis', ativo: true, titulo: it.titulo, linha: '', nome: '', setor: setor(k, it),
        img: it.img && !/logo-/.test(it.img) ? it.img : '', preco: '',
        link: destino(it.cta), botao: (it.cta || {}).rotulo || '', link2: destino(it.cta2), botao2: (it.cta2 || {}).rotulo || '',
        video: '', sinopse: it.sinopse || '', meta: (it.meta || []).join(', '), modos: it.modos || [] });
    });
    (C.materiais || []).filter(x => !x.gratis).forEach(x => cards.push(material(x)));
    // o que fica dentro da mentoria (trancado) e o resto do ecossistema (escola, viagens, intercâmbio, aulas particulares)
    Object.entries(C.itens || {}).forEach(([k, it]) => {
      if (it.indisponivel || it.tipo === 'etapa' || it.tipo === 'aluno' || it.tipo === 'gratis' || k === 'mentoria') return;
      const membros = !!it.bloqueado;
      cards.push({ id: k, tipo: membros ? 'membros' : 'extra', ativo: true, titulo: it.titulo, linha: it.trilha || (it.meta || [])[0] || '', nome: '',
        setor: it.trilha || 'Ecossistema', img: it.img && !/logo-/.test(it.img) ? it.img : (it.img || ''), preco: it.selo && !membros ? it.selo : '',
        link: membros ? '' : destino(it.cta), botao: membros ? '' : (it.cta || {}).rotulo || '', link2: '', botao2: '', video: '',
        sinopse: it.sinopse || '', meta: (it.meta || []).join(', '), modos: it.modos || [] });
    });
    Object.entries(C.itens || {}).forEach(([k, it]) => {
      if (it.tipo !== 'aluno') return;
      cards.push({ id: k, tipo: 'aluno', ativo: true, titulo: it.titulo, linha: '', nome: it.nome, setor: 'Alunos',
        img: it.img, preco: '', link: '', botao: '', link2: '', botao2: '', video: it.video || '',
        sinopse: it.sinopse || '', meta: [it.nome, it.arroba].filter(Boolean).join(', '), modos: it.modos || [] });
    });
    function material(x) {
      return { id: x.id, tipo: x.gratis ? 'gratis' : 'pago', ativo: true, titulo: x.titulo, linha: x.linha || '', nome: '', setor: x.cat || '',
        img: x.img || '', preco: x.preco || '', link: x.link || '',
        botao: x.link ? (x.gratis ? 'Pegar de graça' : 'Quero o ' + x.titulo) : 'Quero saber quando sai',
        link2: '', botao2: '', video: '', sinopse: x.sinopse || '', meta: (x.meta || []).join(', '), modos: x.modos || [] };
    }
    const M = (C.itens || {}).mentoria || {};
    return {
      tema: { fundo: '#0a1426', card: '#13233f', destaque: '#4a5a35', destaqueClaro: '#8fa66a', texto: '#ffffff', suave: '#a7b3c6', gradiente: 'img/gradiente-azul.webp' },
      entrada: { marca: 'englishbygediel', rotulo: 'Escolha o seu caminho', titulo: 'Qual modo você quer', palavra: 'ligar', tituloFim: 'hoje?',
        dica: 'Toque num card ou arraste pra girar.', foto: 'img/gediel-centro.webp', fundo: 'img/gradiente-azul.webp', botao: 'Ligar' },
      modos: (C.modos || []).map(m => ({ id: m.id, nome: m.nome, img: m.img, marca: m.marca || '', texto: (C.textoModo || {})[m.id] || '',
        recorte: !!m.recorte, tamanho: m.recorte || 100, verde: !!m.verde, ativo: true })),
      topo: { nome: 'Gediel Vargas', verificado: true, cargo: 'Professor · Mentor · Inglês Inteligente',
        bio: 'Onze anos de sala de aula e mais de 700 alunos. Aqui estão meus materiais grátis, os completos e a porta pro programa de acompanhamento.',
        avatar: 'img/gediel-brooklyn.webp', fundo: 'img/gradiente-azul.webp' },
      redes: [
        { tipo: 'youtube', url: (CFG.redes || {}).youtube || '' },
        { tipo: 'tiktok', url: (CFG.redes || {}).tiktok || '' },
        { tipo: 'instagram', url: (CFG.instagram || {}).ebg || '' },
        { tipo: 'whatsapp', url: whats('Oi Gediel! Vim pelo Hub.') }
      ],
      atalhos: [
        { titulo: 'Grátis', sub: 'Pegue e use hoje', img: 'img/card-teste.webp', ir: 'gratis', icone: 'estrela' },
        { titulo: 'Completos', sub: 'Pra ir mais fundo', img: 'img/card-aulas.webp', ir: 'pagos', icone: 'livro' },
        { titulo: 'Alunos', sub: 'Resultados reais', img: 'img/aula-turma.webp', ir: 'alunos', icone: 'pessoas' },
        { titulo: 'Programa', sub: 'Fale comigo', img: 'img/gediel-london.webp', ir: 'aplicar', icone: 'chat' },
        { titulo: 'Mentoria', sub: 'Aulas particulares', img: 'img/card-particular.webp', ir: 'link', url: CFG.mentoriaParticular || '', icone: 'pessoas' },
        { titulo: 'Entrar', sub: 'Área de membros', img: 'img/card-aulas.webp', ir: 'login', icone: 'cadeado' }
      ],
      destaque: { rotulo: 'Vídeo em destaque', titulo: 'Programa de Acompanhamento Inglês Inteligente', img: 'img/apresentacao.webp', botao: '▶ Assistir e ver detalhes',
        texto: 'Aula ao vivo toda semana no seu nível, cronograma pra cada dia e acompanhamento de perto.' },
      mentoria: { titulo: M.titulo || 'Programa de Acompanhamento Inglês Inteligente', sinopse: M.sinopse || '', inclui: (M.inclui || []).join('\n'),
        meta: (M.meta || []).join(', '), precoDe: (M.preco || {}).separado || '', precoPor: (M.preco || {}).parcelas || '', nota: (M.preco || {}).nota || '',
        video: M.video || CFG.videoApresentacao || '', img: M.imgLarga || M.img || '', checkout: CFG.checkoutMentoria || '',
        botaoAplicar: 'Aplicar pro programa', botaoComprar: (M.cta || {}).rotulo || 'Quero minha vaga' },
      secoes: { gratis: 'Materiais grátis', pagos: 'Pra ir mais fundo', botaoPagos: 'Programa →', membros: 'Dentro do programa', membrosSub: 'Só pra alunos',
        extras: 'Ecossistema', alunos: 'Alunos que destravaram', botaoAluno: 'Quero esse resultado' },
      membros: { botaoTopo: 'Entrar', titulo: 'Área de membros', url: 'membros.html',
        texto: 'Já é aluno ou comprou um material? Entre com o e-mail que você usou na compra pra acessar suas aulas, trilhas e materiais.',
        botao: 'Entrar na área de membros', semConta: 'Ainda não sou aluno', cardBotao: 'Já sou aluno, entrar' },
      cards,
      aplicacao: { rotulo: 'Aplicação · menos de 2 minutos', titulo: 'Seu inglês precisa caber', destaque: 'na sua vida.',
        texto: 'Estou selecionando pessoas pra um processo de inglês adaptado à rotina real e aos objetivos de cada uma. Responda aqui no chat; no fim, as respostas vão organizadas pro meu WhatsApp.',
        foto: 'img/gediel-brooklyn.webp', whatsapp: CFG.whatsapp || '' },
      // sites inteiros que aparecem dentro de um modo (ex.: a Central de Prompts no Modo Prompts)
      embutidos: [
        { modo: 'prompts', ativo: true, titulo: 'Central de Prompts', sub: '50 prompts grátis. Escolha, personalize, copie e cole no ChatGPT ou no Claude.',
          url: 'central-prompts.html', altura: 88, botao: 'Abrir em tela cheia' }
      ],
      // destaque flutuante (pisca na abertura e no Hub) com contagem regressiva
      maratona: { ativo: true, rotulo: 'Maratona', titulo: 'O Inglês de Cada Dia', sub: 'Inglês dentro da sua rotina', selo: 'Turma Fundadora',
        detalhe: 'Começa 16/11 · 10 meses · só 15 pessoas selecionadas', foto: 'img/maratona-casal.webp', img: 'img/maratona.webp',
        fim: '2026-11-16T00:00', textoFim: 'Começou! Fale comigo pra saber das vagas',
        texto: 'Uma maratona de 10 meses com o Gediel e a esposa, com o inglês dentro da sua rotina de verdade. É a Turma Fundadora: só 15 pessoas serão selecionadas.',
        link: '', botao: 'Quero minha vaga', mensagem: 'Oi Gediel! Quero uma vaga na Maratona O Inglês de Cada Dia (Turma Fundadora).' },
      rodape: { nome: 'Gediel Vargas', linha: 'English by Gediel · Método Inteligente' }
    };
  }

  // o salvo substitui o padrão: seções com campos se misturam, listas trocam inteiras
  function juntar(base, salvo) {
    if (!salvo || typeof salvo !== 'object') return base;
    const r = { ...base };
    Object.keys(salvo).forEach(k => {
      const v = salvo[k];
      if (Array.isArray(v)) r[k] = v;
      else if (v && typeof v === 'object' && base[k] && typeof base[k] === 'object' && !Array.isArray(base[k])) r[k] = { ...base[k], ...v };
      else if (v !== undefined) r[k] = v;
    });
    return r;
  }

  async function carregar(C, CFG) {
    const base = padrao(C, CFG);
    // pré-visualização do painel: o rascunho fica no navegador de quem edita
    if (/[?&](rascunho|editar)\b/.test(location.search)) {
      try { const r = JSON.parse(localStorage.getItem('ebg:hubrascunho')); if (r) return juntar(base, r); } catch (e) {}
    }
    if (!CFG.supabaseUrl || !CFG.supabaseAnonKey) return base;
    // abre na hora com o último conteúdo salvo neste aparelho e atualiza por trás pra próxima visita
    let guardado = null;
    try { guardado = JSON.parse(localStorage.getItem('ebg:hubcache') || 'null'); } catch (e) {}
    const buscar = buscarSalvo(CFG).then(d => { if (d) try { localStorage.setItem('ebg:hubcache', JSON.stringify(d)); } catch (e) {} return d; });
    if (guardado) return juntar(base, guardado);
    const d = await buscar;
    return juntar(base, d);
  }

  async function buscarSalvo(CFG) {
    try {
      const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 3500);
      const r = await fetch(`${CFG.supabaseUrl.replace(/\/$/, '')}/rest/v1/site_config?id=eq.hub&select=dados`,
        { headers: { apikey: CFG.supabaseAnonKey, Authorization: `Bearer ${CFG.supabaseAnonKey}` }, signal: ctl.signal });
      clearTimeout(t);
      if (!r.ok) return null;
      const linhas = await r.json();
      return (linhas && linhas[0] && linhas[0].dados) || null;
    } catch (e) { return null; }
  }

  // a foto retangular antiga do centro vira a versão recortada (PNG sem fundo)
  async function carregarFinal(C, CFG) {
    const H = await carregar(C, CFG);
    if (H && H.entrada && /0af69522-7693-482b-9cbf-76ce704eab22/.test(H.entrada.foto || '')) H.entrada.foto = 'img/gediel-centro.webp';
    return H;
  }
  window.HUB_DADOS = { padrao, juntar, carregar: carregarFinal };
})();
