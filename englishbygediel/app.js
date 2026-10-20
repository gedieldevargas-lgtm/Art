(() => {
  'use strict';

  const CFG = window.EBG_CONFIG;
  const PT = window.EBG;
  const UI = window.EBG_UI;
  let C = PT;
  let idioma = 'pt';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  document.documentElement.classList.add('js');

  const PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12.5-7.5z"/></svg>';
  const CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 12.5l5 5 10-11"/></svg>';
  const MAIS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7z"/></svg>';
  const CADEADO = '<svg class="card-cadeado" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10V7a5 5 0 0 1 10 0v3h1.5a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 20.5v-9A1.5 1.5 0 0 1 5.5 10zm2 0h6V7a3 3 0 0 0-6 0z"/></svg>';
  const WHATS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg>';
  const INSTA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm6-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM12 3.6c2.7 0 3 0 4.1.1 2.8.1 4.1 1.4 4.2 4.2.1 1.1.1 1.4.1 4.1s0 3-.1 4.1c-.1 2.8-1.4 4.1-4.2 4.2-1.1.1-1.4.1-4.1.1s-3 0-4.1-.1c-2.8-.1-4.1-1.4-4.2-4.2C3.6 15 3.6 14.7 3.6 12s0-3 .1-4.1C3.8 5.1 5.1 3.8 7.9 3.7 9 3.6 9.3 3.6 12 3.6zM12 2C9.3 2 8.9 2 7.8 2.1 4.2 2.2 2.2 4.2 2.1 7.8 2 8.9 2 9.3 2 12s0 3.1.1 4.2c.2 3.6 2.1 5.6 5.7 5.7 1.1.1 1.5.1 4.2.1s3.1 0 4.2-.1c3.6-.2 5.6-2.1 5.7-5.7.1-1.1.1-1.5.1-4.2s0-3.1-.1-4.2c-.2-3.6-2.1-5.6-5.7-5.7C15.1 2 14.7 2 12 2z"/></svg>';
  const SETA = d => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d === 'esq' ? 'M15.5 4l-8 8 8 8 1.5-1.5L10.5 12 17 5.5z' : 'M8.5 4l8 8-8 8L7 18.5 13.5 12 7 5.5z'}"/></svg>`;

  /* ---------------- armazenamento local ---------------- */
  const guarda = {
    ler(k, padrao = null) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : padrao; } catch (e) { return padrao; } },
    gravar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* modo privado: segue sem salvar */ } }
  };

  /* ---------------- idioma ---------------- */
  // arrays de objetos (perfis, stories, fileiras) mesclam item a item; listas de texto trocam inteiras
  function mesclar(base, extra) {
    if (extra === undefined) return base;
    if (Array.isArray(extra)) {
      if (Array.isArray(base) && extra.every(x => x && typeof x === 'object' && !Array.isArray(x))) return base.map((b, i) => mesclar(b, extra[i]));
      return extra;
    }
    if (extra && typeof extra === 'object' && base && typeof base === 'object') {
      const out = { ...base };
      Object.keys(extra).forEach(k => { out[k] = mesclar(base[k], extra[k]); });
      return out;
    }
    return extra;
  }
  const CONTEUDO = { pt: PT, en: mesclar(PT, window.EBG_EN) };
  const t = (k, vars = {}) => (UI[idioma][k] || UI.pt[k] || k).replace(/\{(\w+)\}/g, (_, v) => vars[v] ?? '');

  function aplicarTextos(raiz = document) {
    document.documentElement.lang = idioma === 'en' ? 'en' : 'pt-BR';
    $$('[data-i18n]', raiz).forEach(el => { el.textContent = t(el.dataset.i18n); });
    $$('[data-i18n-ph]', raiz).forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
    $$('[data-i18n-aria]', raiz).forEach(el => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
  }

  function definirIdioma(novo) {
    idioma = novo === 'en' ? 'en' : 'pt';
    C = CONTEUDO[idioma];
    aplicarTextos();
  }

  /* ---------------- de onde veio e pra onde quer ir ----------------
     ?de=eom|metodo|escola|viagens|ebg  -> o perfil do Instagram de onde a pessoa veio (link da bio)
     ?ir=toronto|prisma|teste|mentoria|eom|grupos|...  -> abre direto o que ela veio buscar, sem stories */
  const PARAMS = new URLSearchParams(location.search);
  const DE = (PARAMS.get('de') || '').toLowerCase();
  const IR = (PARAMS.get('ir') || '').toLowerCase();
  const ATALHOS_IR = { bussola: 'teste', nivel: 'teste', vlogs: 'vlogeuropa', londres: 'vlogeuropa', grupos: '#gratis', gratis: '#gratis',
    eom: '#eom', biblia: '#eom', intercambio: '#intercambio', viagem: '#intercambio', alunos: '#alunos', programa: '#programa', culture: '#culture', extras: '#mais' };
  let irFeito = false;
  const origemCfg = () => ((C.origens || {})[DE]) || {};

  const estado = {
    lead: guarda.ler('ebg:lead'),
    perfil: (guarda.ler('ebg:lead') || {}).objetivo || guarda.ler('ebg:perfil') || null,
    antes: [],        // o que a pessoa fez antes de deixar os dados; vai junto quando o lead nasce
    pendente: null    // o bônus que ela pediu e que abre logo depois do cadastro
  };

  /* ---------------- Supabase (fila que sobrevive a queda de rede) ---------------- */
  const fila = guarda.ler('ebg:fila', []);
  let enviando = false;
  const supabaseAtivo = Boolean(CFG.supabaseUrl && CFG.supabaseAnonKey);

  function enfileirar(tabela, linha) {
    fila.push({ tabela, linha });
    guarda.gravar('ebg:fila', fila);
    descarregar();
  }

  async function descarregar() {
    if (enviando || !supabaseAtivo || !fila.length) {
      if (!supabaseAtivo && fila.length) console.info('[englishbygediel] Supabase sem configuração; guardado localmente:', fila.length, 'registro(s).');
      return;
    }
    enviando = true;
    while (fila.length) {
      const { tabela, linha } = fila[0];
      try {
        const r = await fetch(`${CFG.supabaseUrl.replace(/\/$/, '')}/rest/v1/${tabela}`, {
          method: 'POST',
          keepalive: true,
          headers: {
            apikey: CFG.supabaseAnonKey,
            Authorization: `Bearer ${CFG.supabaseAnonKey}`,
            'Content-Type': 'application/json',
            Prefer: 'return=minimal'
          },
          body: JSON.stringify(linha)
        });
        // 409 = já existe (reenvio do mesmo lead): pode descartar.
        if (!r.ok && r.status !== 409) {
          if (r.status >= 400 && r.status < 500) console.warn('[englishbygediel] Supabase recusou', tabela, r.status, await r.text());
          else break;
        }
        fila.shift();
        guarda.gravar('ebg:fila', fila);
      } catch (e) {
        break; // sem rede: tenta de novo na próxima ação ou visita
      }
    }
    enviando = false;
  }

  function registrar(tipo, item = null, detalhe = null) {
    if (!estado.lead) { if (estado.antes.length < 60) estado.antes.push({ tipo, item, detalhe }); return; }
    enfileirar('events', { lead_id: estado.lead.id, tipo, item, detalhe });
  }

  window.addEventListener('online', descarregar);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') descarregar(); });

  /* ---------------- utilidades ---------------- */
  const uuid = () => (crypto.randomUUID ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16); }));
  const perfilDe = id => C.perfis.find(p => p.id === id) || C.perfis[0];
  const primeiroNome = () => ((estado.lead || estado.dados || {}).nome || '').trim().split(/\s+/)[0] || '';
  const combina = item => Math.round(60 + ((item.peso && item.peso[estado.perfil]) || 7) * 3.8);

  function pintarPerfil(el, p) {
    el.innerHTML = `<img src="${p.img}" alt="">`;
  }

  function linkWhats(texto) {
    const nome = primeiroNome();
    const foco = estado.perfil ? perfilDe(estado.perfil).nome : '';
    const msg = nome ? `${texto} ${t(foco ? 'souNomeFoco' : 'souNome', { nome, foco })}` : texto;
    return `https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent(msg)}`;
  }

  function abrirFora(url) {
    // sem 'noopener' na lista de recursos: com ele o navegador sempre devolve null,
    // e a página achava que o pop-up tinha sido bloqueado e saía da landing.
    const w = window.open(url, '_blank');
    if (w) w.opener = null;
    else location.href = url; // pop-up bloqueado de verdade: abre na mesma aba
  }

  let avisoTempo;
  function aviso(txt) {
    const el = $('#aviso');
    el.textContent = txt;
    el.classList.add('mostra');
    clearTimeout(avisoTempo);
    avisoTempo = setTimeout(() => el.classList.remove('mostra'), 3200);
  }

  function irPara(tela) {
    document.body.dataset.tela = tela;
    window.scrollTo(0, 0);
    atualizarBarra();
  }

  /* =========================================================
     1 · ENTRADA
     ========================================================= */
  function montarParede() {
    const fotos = ['parede-londres', 'parede-gediel-cafe', 'parede-ny', 'parede-escola', 'parede-brooklyn'];
    // 6 colunas e 5 fotos: nenhuma foto encosta nela mesma, nem do lado nem embaixo
    const html = Array.from({ length: 36 }, (_, i) => `<img src="img/${fotos[i % fotos.length]}.webp" alt="" loading="${i < 18 ? 'eager' : 'lazy'}" decoding="async">`).join('');
    $('.parede').innerHTML = html;
  }

  function montarPerfis() {
    $('#perfis').innerHTML = C.perfis.map(p => `
      <li><button class="perfil" type="button" data-perfil="${p.id}">
        <span class="perfil-quadro"><img src="${p.img}" alt="" decoding="async"></span>
        <span class="perfil-nome">${esc(p.nome)}</span>
      </button></li>`).join('');
  }

  function mostrarPasso(id) {
    $$('.passo').forEach(p => p.classList.toggle('ativo', p.id === id));
  }

  function escolherPerfil(id) {
    estado.perfil = id;
    registrar('perfil', id);
    if (estado.lead) {
      // quem já deixou os dados só troca de perfil
      estado.lead.objetivo = id;
      guarda.gravar('ebg:lead', estado.lead);
    } else guarda.gravar('ebg:perfil', id);
    // um toque e já está no catálogo: os dados só são pedidos quando a pessoa quer um bônus
    abrirCatalogo();
    seguirDestino();
  }

  // bônus grátis pedem nome e contato antes. Compra e conversa no WhatsApp nunca são travadas.
  function pedeCadastro(cta, id) {
    if (estado.lead) return false;
    const it = C.itens[id] || {};
    return cta.acao === 'teste' || cta.acao === 'prisma' || (cta.acao === 'whatsapp' && it.grupo);
  }

  function pedirDados(cta, id) {
    estado.pendente = { cta, id };
    const tpl = $('#tplCadastro').content.cloneNode(true);
    const titulo = (C.itens[id] || {}).titulo || '';
    abrirFicha('cadastro', '<div class="ficha-corpo"></div>');
    const corpo = $('#fichaConteudo .ficha-corpo');
    corpo.appendChild(tpl);
    aplicarTextos(corpo);
    $('#cadastroTitulo').textContent = t('cadastroTitulo');
    $('#cadastroSub').textContent = t('cadastroSub', { item: titulo });
    if (!matchMedia('(pointer: coarse)').matches) $('#passoDados [name=nome]').focus({ preventScroll: true });
  }

  // o lead nasce aqui: já com o foco escolhido, nome e contato
  function criarLead() {
    const lead = { ...estado.dados, objetivo: estado.perfil || 'fala' };
    estado.lead = lead;
    guarda.gravar('ebg:lead', { id: lead.id, nome: lead.nome, objetivo: lead.objetivo });
    enfileirar('leads', lead);
    estado.antes.splice(0).forEach(e => enfileirar('events', { lead_id: lead.id, ...e }));
    const p = estado.pendente;
    estado.pendente = null;
    if (p) { executar(p.cta, p.id); if (fichaAberta === 'cadastro') fecharFicha(); }
    descarregar();
  }

  // foco que já dá pra saber sem perguntar: o do perfil de origem ou o que mais combina com o destino
  function perfilPreDefinido() {
    if (origemCfg().perfil) return origemCfg().perfil;
    if (!IR) return null;
    const alvo = ATALHOS_IR[IR] || IR;
    const it = C.itens[alvo];
    if (it && it.peso) return Object.keys(it.peso).sort((a, b) => it.peso[b] - it.peso[a])[0];
    if (alvo === '#eom') return 'fe';
    if (alvo === '#intercambio') return 'viagem';
    return 'fala';
  }

  // abre o que a pessoa veio buscar (uma vez por visita)
  function seguirDestino() {
    if (!IR || irFeito) return;
    irFeito = true;
    const alvo = ATALHOS_IR[IR] || IR;
    setTimeout(() => {
      if (alvo.startsWith('#')) rolarAte(alvo.slice(1));
      else if (C.itens[alvo]) abrirFicha(alvo);
    }, 450);
  }

  function rolarAte(fileira) {
    const el = $('#fileira-' + fileira);
    if (el) el.scrollIntoView({ behavior: reduz ? 'auto' : 'smooth', block: 'start' });
  }

  function mostrarOla() {
    const ola = origemCfg().ola;
    $$('.ola-origem').forEach(el => { el.hidden = !ola; el.textContent = ola || ''; });
  }

  function perguntarFoco() {
    const nome = primeiroNome();
    $('#tituloFoco').textContent = nome ? t('focoNome', { nome }) : t('foco');
    mostrarPasso('passoPerfil');
  }

  function mascaraTelefone(v) {
    const d = v.replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '').slice(0, 11);
    if (d.length <= 2) return d.length ? `(${d}` : '';
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  }

  function origem() {
    const q = PARAMS;
    const partes = ['de', 'ir', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].map(k => q.get(k) && `${k.replace('utm_', '')}=${q.get(k)}`).filter(Boolean);
    if (document.referrer && !document.referrer.startsWith(location.origin)) partes.push(`ref=${document.referrer}`);
    return partes.join(' · ').slice(0, 300) || null;
  }

  function enviarDados(ev) {
    ev.preventDefault();
    const f = ev.target;
    const nome = f.nome.value.trim();
    const tel = f.whatsapp.value.replace(/\D/g, '');
    const insta = f.instagram.value.trim().replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/^@+/, '').replace(/[/?].*$/, '');
    const email = f.email.value.trim();
    const erro = $('#erroDados', f);
    $$('input', f).forEach(i => i.removeAttribute('aria-invalid'));

    let problema = null;
    if (nome.length < 2) problema = [f.nome, t('erroNome')];
    else if (tel.length < 10 || tel.length > 13) problema = [f.whatsapp, t('erroWhats')];
    else if (insta && !/^[A-Za-z0-9._]{1,30}$/.test(insta)) problema = [f.instagram, t('erroInsta')];
    else if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) problema = [f.email, t('erroEmail')];
    if (problema) {
      problema[0].setAttribute('aria-invalid', 'true');
      problema[0].focus();
      erro.textContent = problema[1];
      return;
    }
    erro.textContent = '';

    estado.dados = {
      id: uuid(),
      nome: nome.slice(0, 120),
      whatsapp: (tel.length <= 11 ? '55' + tel : tel),
      instagram: insta ? insta.toLowerCase() : null,
      email: email || null,
      origem: origem(),
      dispositivo: navigator.userAgent.slice(0, 300)
    };
    criarLead();
  }

  /* =========================================================
     2 · HISTÓRIA
     ========================================================= */
  const historia = { i: 0, tempo: null, inicio: 0, restante: 0, dur: 7000 };

  function abrirHistoria() {
    const slides = C.historia;
    $('#barras').innerHTML = slides.map(() => '<span class="barra"><i></i></span>').join('');
    $('#slides').innerHTML = slides.map((s, i) => {
      const titulo = esc(s.titulo.replace('{nome}', primeiroNome() || t('voce')));
      const texto = esc(s.texto || C.perfilTexto[estado.perfil]);
      return `<article class="slide ${s.img ? 'tem-foto' : 'campo-cor'}" aria-hidden="true">
        ${s.img ? `<img src="${s.img}" alt="" ${i ? 'loading="lazy"' : ''} decoding="async">` : ''}
        <div class="slide-texto">
          <h2>${titulo}</h2>
          <p>${texto}</p>
          ${s.botao ? `<button class="botao botao-cheio" data-acao="fimHistoria">${esc(s.botao)}</button>` : ''}
        </div>
      </article>`;
    }).join('');
    irPara('historia');
    mostrarSlide(0);
  }

  function mostrarSlide(i) {
    const slides = $$('.slide');
    const barras = $$('.barra');
    historia.i = Math.max(0, Math.min(i, slides.length - 1));
    slides.forEach((s, k) => { s.classList.toggle('ativo', k === historia.i); s.setAttribute('aria-hidden', k !== historia.i); });
    barras.forEach((b, k) => {
      b.classList.remove('andando');
      b.classList.toggle('cheia', k < historia.i);
      void b.offsetWidth;
      if (k === historia.i) { b.style.setProperty('--dur', historia.dur + 'ms'); b.classList.add('andando'); }
    });
    const ultimo = historia.i === slides.length - 1;
    $('#historia').classList.toggle('ultimo', ultimo);
    $('#toqueAvancar').hidden = ultimo;
    clearTimeout(historia.tempo);
    historia.restante = historia.dur;
    historia.inicio = Date.now();
    if (!ultimo) historia.tempo = setTimeout(() => mostrarSlide(historia.i + 1), historia.dur);
    else setTimeout(() => { const b = $('.slide.ativo .botao'); if (b) b.focus({ preventScroll: true }); }, 600);
  }

  function pausarHistoria(p) {
    const h = $('#historia');
    if (p) {
      clearTimeout(historia.tempo);
      historia.restante -= Date.now() - historia.inicio;
      h.classList.add('pausada');
    } else if (h.classList.contains('pausada')) {
      h.classList.remove('pausada');
      historia.inicio = Date.now();
      if (historia.i < $$('.slide').length - 1) historia.tempo = setTimeout(() => mostrarSlide(historia.i + 1), Math.max(historia.restante, 300));
    }
  }

  function fimHistoria(pulou) {
    clearTimeout(historia.tempo);
    registrar('story_fim', null, { slide: historia.i + 1, pulou: Boolean(pulou) });
    abrirCatalogo();
  }

  function ligarHistoria() {
    let segurou = false, timerSegura;
    const zona = $('#historia');
    zona.addEventListener('pointerdown', e => {
      if (e.target.closest('.botao, .pular')) return;
      timerSegura = setTimeout(() => { segurou = true; pausarHistoria(true); }, 220);
    });
    const soltar = () => { clearTimeout(timerSegura); if (segurou) { pausarHistoria(false); setTimeout(() => { segurou = false; }, 0); } };
    zona.addEventListener('pointerup', soltar);
    zona.addEventListener('pointercancel', soltar);
    $('#toqueAvancar').addEventListener('click', () => { if (!segurou) mostrarSlide(historia.i + 1); });
    $('#toqueVoltar').addEventListener('click', () => { if (!segurou) mostrarSlide(historia.i - 1); });
    $('#pular').addEventListener('click', () => fimHistoria(true));
    document.addEventListener('keydown', e => {
      if (document.body.dataset.tela !== 'historia') return;
      if (e.key === 'ArrowRight') mostrarSlide(historia.i + 1);
      if (e.key === 'ArrowLeft') mostrarSlide(historia.i - 1);
      if (e.key === 'Escape') fimHistoria(true);
    });
    document.addEventListener('visibilitychange', () => {
      if (document.body.dataset.tela === 'historia') pausarHistoria(document.hidden);
    });
  }

  /* =========================================================
     3 · CATÁLOGO
     ========================================================= */
  let catalogoMontado = false;

  function abrirCatalogo() {
    if (document.body.dataset.tela !== 'catalogo') irPara('catalogo');
    const p = perfilDe(estado.perfil);
    pintarPerfil($('#avatar'), p);
    $('#avatar').setAttribute('aria-label', t('perfilAria', { nome: p.nome }));
    const m = C.itens.mentoria;
    $('#vitrineMeta').innerHTML = `<span class="combina">${combina(m)}${t('pctVoce')}</span>` + m.meta.map(t => `<span>${esc(t)}</span>`).join('');
    $('#vitrineSinopse').textContent = C.perfilTexto[estado.perfil] || m.sinopse;
    montarProcura();
    montarFileiras();
    montarPerguntas();
    if (!catalogoMontado) {
      catalogoMontado = true;
      observar();
    }
    descarregar();
  }

  function cardHTML(id, formato, i, comCombina) {
    const it = C.itens[id];
    const texto = it.capa === 'texto';
    let selo = '';
    if (it.breve && !it.bloqueado) selo = `<span class="card-selo trancado">${t('emBreve')}</span>`;
    else if (it.tipo === 'gratis') selo = `<span class="card-selo gratis">${t('gratis')}</span>`;
    else if (id === 'mentoria') selo = `<span class="card-selo pago">${t('seloMentoria')}</span>`;
    else if (it.tipo === 'aluno') selo = `<span class="card-selo aluno">${t('resultadoAluno')}</span>`;
    else if (it.bloqueado) selo = `<span class="card-selo trancado">${CADEADO}${it.breve ? t('emBreve') : t('exclusivo')}</span>`;
    else if (it.aberto) selo = `<span class="card-selo gratis">${esc(it.selo || t('disponivel'))}</span>`;

    const linha = [];
    if (comCombina && it.peso) linha.push(`<span class="combina">${combina(it)}%</span>`);
    if (it.tipo === 'aluno') linha.push(esc(it.linha || it.nome));
    else if (it.tipo === 'etapa') linha.push(esc(it.duracao));
    else if (it.meta) linha.push(esc(it.meta[0]));

    const midia = texto ? '' : `<img src="${it.img}" alt="" loading="lazy" decoding="async">`;
    const play = it.video && !texto ? `<span class="card-play">${PLAY}</span>`
      : it.grupo === 'whatsapp' ? `<span class="card-whats" title="Grupo do WhatsApp">${WHATS}</span>` : '';
    const aspas = it.tipo === 'aluno' && it.citacao !== false;
    const tituloCard = aspas ? `“${esc(it.titulo)}”` : esc(it.titulo);

    return `<button class="card card-${formato}${texto ? ' capa-texto' : ''}${it.contem ? ' contem' : ''}${it.bloqueado || it.indisponivel ? ' bloqueado' : ''}${id === 'mentoria' || it.pulsa ? ' neon' : ''}" type="button"
        data-abrir="${id}" style="--i:${i};${texto ? `--cor:${it.cor}` : ''}" aria-label="${esc(it.titulo)}">
      ${midia}${texto || it.tipo === 'aluno' ? '' : selo}${play}
      <span class="card-texto">
        ${texto ? (it.tipo === 'exclusivo' ? CADEADO : selo) : (it.tipo === 'aluno' ? selo : '')}
        <span>
          <span class="card-titulo">${tituloCard}</span>
          <span class="card-linha">${linha.join('')}</span>
        </span>
      </span>
    </button>`;
  }

  function montarFileiras() {
    $('#fileiras').innerHTML = ordenarFileiras(C.fileiras).map(f => {
      let itens = f.itens;
      let sub = f.sub || '';
      if (f.dinamica) {
        itens = Object.keys(C.itens)
          .filter(k => C.itens[k].peso && C.itens[k].tipo !== 'exclusivo' && !C.itens[k].indisponivel)
          .sort((a, b) => (a === 'mentoria' ? -1 : b === 'mentoria' ? 1 : 0) || C.itens[b].peso[estado.perfil] - C.itens[a].peso[estado.perfil])
          .slice(0, 8);
        sub = perfilDe(estado.perfil).nome;
      }
      return `<section class="fileira${f.destaque ? ' fileira-destaque' : ''}" id="fileira-${f.id}" aria-labelledby="t-${f.id}">
        <div class="fileira-cabeca"><h2 id="t-${f.id}">${esc(f.titulo)}${f.etiqueta ? ` <span class="etiqueta">${esc(f.etiqueta)}</span>` : ''}</h2>${sub ? `<span class="fileira-sub">${esc(sub)}</span>` : ''}</div>
        <div class="trilho-wrap">
          <button class="seta seta-esq" type="button" aria-label="${t('voltar')}" data-seta="-1">${SETA('esq')}</button>
          <div class="trilho" role="list">${itens.map((id, i) => cardHTML(id, f.formato, i, f.dinamica)).join('')}</div>
          <button class="seta seta-dir" type="button" aria-label="${t('avancar')}" data-seta="1">${SETA('dir')}</button>
        </div>
        ${f.acoes ? `<div class="fileira-acoes">${f.acoes.map(x => `<button class="pilula" type="button" data-cta="fileira-${f.id}" data-acao-cta='${esc(JSON.stringify({ acao: 'link', href: x.href }))}'>${INSTA}${esc(x.rotulo)}</button>`).join('')}</div>` : ''}
      </section>`;
    }).join('');
    $$('.trilho').forEach(t => observador && observador.observe(t));
    $$('.trilho').forEach(ligarTrilho);
  }

  /* ---------------- fileiras que andam sozinhas ----------------
     Cada fileira visível desliza devagar e vai e volta. Encostou o dedo (ou o mouse) num card:
     a fileira para, o card ganha destaque e os outros apagam. Solta: volta a andar depois de um tempo. */
  const VELOCIDADE = 16;   // px por segundo
  const RETOMA = 2600;     // ms parado depois que a pessoa solta
  const trilhos = new Set();

  function ligarTrilho(tr) {
    if (reduz || tr.dataset.anda) return;
    tr.dataset.anda = '1';
    const st = { dir: 1, pos: 0, ate: performance.now() + 1500, visivel: false, preso: false };
    tr._anda = st;
    tr.classList.add('anda');
    trilhos.add(tr);
    const parar = (card) => {
      st.preso = true;
      tr.classList.toggle('focado', Boolean(card));
      $$('.card.em-foco', tr).forEach(c => { if (c !== card) c.classList.remove('em-foco'); });
      if (card) card.classList.add('em-foco');
    };
    const soltar = () => { st.preso = false; st.ate = performance.now() + RETOMA; };
    tr.addEventListener('pointerdown', e => parar(e.target.closest('.card')));
    tr.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') parar(null); });
    tr.addEventListener('pointerover', e => { if (e.pointerType === 'mouse') parar(e.target.closest('.card')); });
    tr.addEventListener('pointerup', soltar);
    tr.addEventListener('pointercancel', soltar);
    tr.addEventListener('pointerleave', () => { soltar(); tr.classList.remove('focado'); $$('.card.em-foco', tr).forEach(c => c.classList.remove('em-foco')); });
    tr.addEventListener('wheel', () => { st.ate = performance.now() + RETOMA; }, { passive: true });
    tr.addEventListener('focusin', e => parar(e.target.closest('.card')));
    tr.addEventListener('focusout', () => { soltar(); tr.classList.remove('focado'); });
    visTrilhos.observe(tr);
  }

  const visTrilhos = new IntersectionObserver(es => es.forEach(e => { if (e.target._anda) e.target._anda.visivel = e.isIntersecting; }));

  let ultimoQuadro = 0;
  function andar(agora) {
    const dt = Math.min(0.05, (agora - (ultimoQuadro || agora)) / 1000);
    ultimoQuadro = agora;
    const livre = document.body.dataset.tela === 'catalogo' && !fichaAberta && !document.hidden;
    trilhos.forEach(tr => {
      if (!tr.isConnected) return trilhos.delete(tr);
      const st = tr._anda;
      if (!livre || !st.visivel || st.preso) return;
      if (agora < st.ate) { st.pos = tr.scrollLeft; return; }   // a pessoa mexeu: parte de onde ela deixou
      const max = tr.scrollWidth - tr.clientWidth;
      if (max <= 2) return;
      // depois que a fileira foi tocada, o destaque some quando ela volta a andar
      if (tr.classList.contains('focado')) { tr.classList.remove('focado'); $$('.card.em-foco', tr).forEach(c => c.classList.remove('em-foco')); }
      st.pos += st.dir * VELOCIDADE * dt;
      if (st.pos >= max) { st.pos = max; st.dir = -1; st.ate = agora + 1800; }
      if (st.pos <= 0) { st.pos = 0; st.dir = 1; st.ate = agora + 1800; }
      tr.scrollLeft = st.pos;
    });
    requestAnimationFrame(andar);
  }
  if (!reduz) requestAnimationFrame(andar);

  function montarProcura() {
    const ordem = [...(origemCfg().procura || []), ...((C.procuraPorPerfil || {})[estado.perfil] || [])];
    const lista = [...C.procura].sort((a, b) => {
      const ia = ordem.indexOf(a.id), ib = ordem.indexOf(b.id);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });
    $('#procuraChips').innerHTML = lista.map(x => `<button class="chip-procura" type="button" data-procura="${x.id}">${esc(x.rotulo)}</button>`).join('');
  }

  // fileira que mais combina com o foco sobe pra logo depois do Programa Inteligente
  function ordenarFileiras(fileiras) {
    const sobe = (C.ordemPorPerfil || {})[estado.perfil];
    const lista = fileiras.filter(f => f.id !== sobe);
    const alvo = fileiras.find(f => f.id === sobe);
    if (alvo) lista.splice(lista.findIndex(f => f.id === 'programa') + 1, 0, alvo);
    return lista;
  }

  function montarPerguntas() {
    $('#listaPerguntas').innerHTML = C.perguntas.map(([q, r]) => `
      <details class="pergunta"><summary>${esc(q)}${MAIS}</summary><p>${esc(r)}</p></details>`).join('');
  }
  $('#listaPerguntas').addEventListener('toggle', e => {
    if (e.target.open) $$('.pergunta[open]').forEach(d => { if (d !== e.target) d.open = false; });
  }, true);

  let observador;
  let atualizarBarra = () => {};
  function observar() {
    if (!('IntersectionObserver' in window)) return;
    observador = new IntersectionObserver(entradas => {
      entradas.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add(e.target.classList.contains('trilho') ? 'entra' : 'visivel');
        observador.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });
    $$('.trilho, .proximo, .perguntas, .rodape').forEach(el => {
      if (!el.classList.contains('trilho') && !el.classList.contains('proximo')) el.classList.add('revela');
      if (el.classList.contains('proximo')) el.querySelector('.proximo-texto').classList.add('revela');
      observador.observe(el);
    });
    // .proximo-texto também precisa ficar visível
    const prox = $('.proximo');
    new IntersectionObserver((es, o) => es.forEach(e => {
      if (e.isIntersecting) { prox.querySelector('.proximo-texto').classList.add('visivel'); o.disconnect(); }
    }), { threshold: 0.2 }).observe(prox);

    // barra da mentoria: aparece quando a vitrine e o "próximo episódio" saem da tela
    const vis = { vitrine: true, proximo: false, rodape: false };
    const obsBarra = new IntersectionObserver(es => {
      es.forEach(e => { vis[e.target.dataset.barra] = e.isIntersecting; });
      atualizarBarra();
    });
    [['.vitrine', 'vitrine'], ['.proximo', 'proximo'], ['.rodape', 'rodape']].forEach(([sel, nome]) => {
      const el = $(sel); el.dataset.barra = nome; obsBarra.observe(el);
    });
    atualizarBarra = () => {
      $('#barraVaga').hidden = document.body.dataset.tela !== 'catalogo' || Boolean(fichaAberta) || vis.vitrine || vis.proximo || vis.rodape;
    };

    const topo = $('#topo');
    let ultimoY = 0;
    addEventListener('scroll', () => {
      const y = scrollY;
      topo.classList.toggle('solido', y > 40);
      ultimoY = y;
    }, { passive: true });
  }


  /* =========================================================
     Ficha
     ========================================================= */
  let fichaAberta = null;
  let focoAntes = null;

  function botaoCta(cta, id, classe) {
    return `<button class="botao ${classe}" type="button" data-cta="${id}" data-acao-cta='${esc(JSON.stringify(cta))}'>
      ${cta.acao === 'video' ? PLAY : cta.acao === 'whatsapp' ? WHATS : ''}${esc(cta.rotulo)}</button>`;
  }

  function fichaHTML(id) {
    const it = C.itens[id];
    const texto = it.capa === 'texto';
    const midia = texto
      ? `<div class="ficha-midia capa-texto" style="--cor:${it.cor}"><span>${esc(it.bloqueado ? it.trilha : it.titulo)}</span></div>`
      : `<div class="ficha-midia"><img src="${it.imgLarga || it.img}" alt="${it.tipo === 'aluno' ? esc(it.nome) : ''}">
          ${it.video ? `<button class="ficha-play" type="button" data-video="${it.video}" data-item="${id}" ${it.tipo === 'aluno' ? 'data-vertical="1"' : ''} aria-label="${t('assistir')}">${PLAY}</button>` : ''}</div>`;

    const meta = [];
    if (it.tipo === 'aluno') meta.push(`<span class="resultado-aluno">${t('resultadoAluno')}</span>`);
    if (it.peso) meta.push(`<span class="combina">${combina(it)}${t('pctVoce')}</span>`);
    if (it.tipo === 'aluno') meta.push(`<span>${esc(it.nome)}</span>`, `<span>${esc(it.arroba)}</span>`);
    if (it.tipo === 'etapa') meta.push(`<span>${esc(it.duracao)}</span>`, `<span>${t('parteMentoria')}</span>`);
    if (it.breve && !it.bloqueado) meta.push(`<span class="trancado-meta">${esc(it.breve)}</span>`);
    else if (it.tipo === 'gratis') meta.push(`<span class="combina">${t('gratis')}</span>`);
    else if (it.aberto) meta.push(`<span class="combina">${esc(it.selo || t('disponivel'))}</span>`);
    if (it.bloqueado) meta.push(`<span>${esc(it.trilha)}</span>`, `<span class="trancado-meta">${esc(it.breve || t('exclusivoMentoria'))}</span>`);
    (it.meta || []).forEach(t => meta.push(`<span>${esc(t)}</span>`));

    let acoes = '';
    if (it.tipo === 'aluno') {
      acoes = botaoCta({ rotulo: t('verDepoimento'), acao: 'video', video: it.video, vertical: true }, id, 'botao-claro')
            + (it.arroba ? botaoCta({ rotulo: t('verInstagram'), acao: 'link', href: `https://instagram.com/${it.arroba.replace(/^@/, '')}` }, id, 'botao-cinza') : '')
            + botaoCta({ rotulo: t('mesmoCaminho'), acao: 'ficha', alvo: 'mentoria' }, id, 'botao-cinza');
    } else if (it.bloqueado) {
      acoes = botaoCta({ rotulo: t('entrarMentoria'), acao: 'ficha', alvo: 'mentoria' }, id, 'botao-cheio');
    } else if (it.tipo === 'etapa') {
      acoes = botaoCta({ rotulo: t('verMentoria'), acao: 'ficha', alvo: 'mentoria' }, id, 'botao-cheio');
    } else {
      if (it.cta) acoes += botaoCta(it.cta, id, (it.cta.acao === 'checkout' || it.cta.acao === 'teste') ? 'botao-cheio' : 'botao-claro');
      if (it.cta2) acoes += botaoCta(it.cta2, id, 'botao-cinza');
    }

    let extra = '';
    if (it.paraQuem) {
      extra += `<h3>${t('paraQuem')}</h3><ul class="inclui" role="list">${it.paraQuem.map(x => `<li>${CHECK}<span>${esc(x)}</span></li>`).join('')}</ul>`;
    }
    if (it.naoE) {
      extra += `<p class="nao-e"><b>${t('naoE')}</b> ${it.naoE.map(esc).join('. ')}.</p>`;
    }
    if (it.inclui) {
      extra += `<h3>${t('incluido')}</h3><ul class="inclui" role="list">${it.inclui.map(t => `<li>${CHECK}<span>${esc(t)}</span></li>`).join('')}</ul>`;
    }
    if (it.bloqueado) {
      extra += `<p class="ficha-trava">${CADEADO}<span>${esc(t('trava', { trilha: it.trilha }))}</span></p>`;
    }
    if (it.etapas) {
      const eps = it.etapas;
      extra += `<h3>${t('etapas')}</h3><ol class="episodios">${eps.map(e => {
        const ep = C.itens[e];
        return `<li class="episodio"><img src="${ep.img}" alt="" loading="lazy"><div><strong>${esc(ep.titulo)}</strong><span>${esc(ep.duracao)}</span></div><p>${esc(ep.sinopse)}</p></li>`;
      }).join('')}</ol>`;
      extra += `<h3>${t('alunos')}</h3><div class="alunos-mini">${Object.keys(C.itens).filter(k => C.itens[k].tipo === 'aluno').map(a => {
        const al = C.itens[a];
        return `<button type="button" data-video="${al.video}" data-item="${a}" data-vertical="1"><img src="${al.img}" alt="${esc(al.nome)}" loading="lazy"><span>${esc(al.nome)}</span></button>`;
      }).join('')}</div>`;
    }
    if (it.objecoes) {
      extra += `<h3>${t('objecoes')}</h3><dl class="objecoes">${it.objecoes.map(([q, r]) => `<dt>${esc(q)}</dt><dd>${esc(r)}</dd>`).join('')}</dl>`;
    }
    if (it.depois) {
      extra += `<h3>${t('depois')}</h3><ol class="depois">${it.depois.map(x => `<li>${esc(x)}</li>`).join('')}</ol>`;
    }
    if (it.preco) {
      // fecha a ficha como uma página de venda: preço, garantia e os mesmos botões do topo
      extra += `<div class="preco">
        <p class="preco-agora">${t('comeceSemana')}</p>
        <p class="preco-de">${esc(it.preco.separado)}</p>
        <p class="preco-por">${esc(it.preco.parcelas)}</p>
        <p class="preco-nota">${esc(it.preco.nota)}</p>
        <p class="preco-garantia"><b>${t('garantia')}</b> ${t('garantiaTexto')}</p>
      </div>
      <div class="ficha-acoes">${acoes}</div>`;
    }

    return `${midia}<div class="ficha-corpo">
      <h2 id="fichaTitulo">${it.tipo === 'aluno' && it.citacao !== false ? `“${esc(it.titulo)}”` : esc(it.titulo)}</h2>
      <p class="ficha-meta">${meta.join('')}</p>
      <p class="ficha-sinopse">${it.tipo === 'aluno' && it.citacao !== false ? `“${esc(it.sinopse)}”` : esc(it.sinopse)}</p>
      <div class="ficha-acoes">${acoes}</div>
      ${extra}
    </div>`;
  }

  function abrirFicha(id, html) {
    const ficha = $('#ficha'), fundo = $('#fichaFundo');
    if (!fichaAberta) { focoAntes = document.activeElement; history.pushState({ ficha: 1 }, ''); }
    fichaAberta = id;
    $('#fichaConteudo').innerHTML = html || fichaHTML(id);
    $('#fichaConteudo').scrollTop = 0;
    ficha.classList.remove('saindo'); fundo.classList.remove('saindo');
    ficha.hidden = false; fundo.hidden = false;
    document.body.style.overflow = 'hidden';
    $('#fecharFicha').focus({ preventScroll: true });
    if (!html) registrar('abriu', id);
    atualizarBarra();
  }

  function fecharFicha(doHistorico) {
    if (!fichaAberta) return;
    fichaAberta = null;
    const ficha = $('#ficha'), fundo = $('#fichaFundo');
    ficha.classList.add('saindo'); fundo.classList.add('saindo');
    setTimeout(() => { ficha.hidden = true; fundo.hidden = true; ficha.style.transform = ''; }, reduz ? 0 : 280);
    document.body.style.overflow = '';
    if (!doHistorico && history.state && history.state.ficha) history.back();
    if (focoAntes) focoAntes.focus({ preventScroll: true });
    setTimeout(atualizarBarra, 300);
  }

  function arrastarFicha() {
    const ficha = $('#ficha'), conteudo = $('#fichaConteudo');
    let y0 = null, dy = 0;
    ficha.addEventListener('touchstart', e => {
      if (conteudo.scrollTop > 0 || innerWidth >= 760) return;
      y0 = e.touches[0].clientY; dy = 0;
    }, { passive: true });
    ficha.addEventListener('touchmove', e => {
      if (y0 === null) return;
      dy = Math.max(0, e.touches[0].clientY - y0);
      if (dy > 0) ficha.style.transform = `translateY(${dy}px)`;
    }, { passive: true });
    ficha.addEventListener('touchend', () => {
      if (y0 === null) return;
      y0 = null;
      if (dy > 110) fecharFicha();
      else ficha.style.transform = '';
    });
  }

  /* ---------------- teste de nível ---------------- */
  function abrirTeste() {
    const respostas = [];
    const T = C.teste;
    const desenhar = () => {
      const k = respostas.length;
      if (k === T.perguntas.length) return resultado();
      const [q, ops] = T.perguntas[k];
      const html = `<div class="teste">
        <div class="teste-progresso" aria-label="${t('perguntaDe', { n: k + 1, t: T.perguntas.length })}">${T.perguntas.map((_, j) => `<i class="${j < k ? 'feito' : ''}"></i>`).join('')}</div>
        <div class="ficha-corpo" style="padding:0">
          <h2 id="fichaTitulo">${esc(q)}</h2>
          <div class="opcoes">${ops.map((o, j) => `<button class="opcao" type="button" data-resposta="${j}">${esc(o)}</button>`).join('')}</div>
        </div></div>`;
      abrirFicha('teste', html);
      $$('.opcao').forEach(b => b.addEventListener('click', () => { respostas.push(+b.dataset.resposta); setTimeout(desenhar, reduz ? 0 : 160); }));
    };
    const resultado = () => {
      const media = respostas.reduce((a, b) => a + b, 0) / respostas.length;
      const r = T.resultados.find(x => media < x.ate) || T.resultados[T.resultados.length - 1];
      registrar('teste_nivel', 'teste', { nivel: r.nivel, media: +media.toFixed(2), respostas });
      const html = `<div class="teste"><div class="ficha-corpo" style="padding:0">
        <p class="ficha-meta">${t('pontoPartida')}</p>
        <p class="resultado-nivel">${esc(r.nivel)}</p>
        <h2 id="fichaTitulo" style="margin-top:18px">${esc(r.frase)}</h2>
        <p class="ficha-sinopse">${esc(r.texto)}</p>
        <div class="ficha-acoes">
          ${botaoCta({ rotulo: t('mentoriaNivel'), acao: 'ficha', alvo: 'mentoria' }, 'teste', 'botao-cheio')}
          ${botaoCta({ rotulo: t('mandarResultado'), acao: 'whatsapp', texto: t('whatsResultado', { nivel: r.nivel }) }, 'teste', 'botao-cinza')}
        </div></div></div>`;
      abrirFicha('teste', html);
    };
    desenhar();
  }

  /* ---------------- vídeo ---------------- */
  function abrirVideo(idVideo, item, vertical) {
    const quadro = $('#videoQuadro');
    quadro.classList.toggle('vertical', Boolean(vertical));
    quadro.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(idVideo)}?autoplay=1&rel=0&playsinline=1&modestbranding=1"
      title="${t('video')}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    $('#video').hidden = false;
    $('#fecharVideo').focus({ preventScroll: true });
    registrar('video', item || idVideo);
  }
  function fecharVideo() {
    $('#video').hidden = true;
    $('#videoQuadro').innerHTML = '';
  }

  /* ---------------- ações ---------------- */
  function executar(cta, id) {
    if (pedeCadastro(cta, id)) return pedirDados(cta, id);
    switch (cta.acao) {
      case 'checkout': {
        registrar('clicou', id, { acao: 'checkout' });
        const u = new URL(CFG.checkoutMentoria);
        u.searchParams.set('sck', `catalogo_${estado.perfil || 'geral'}`);
        descarregar();
        abrirFora(u.toString());
        break;
      }
      case 'whatsapp':
        registrar('clicou', id, { acao: 'whatsapp' });
        abrirFora(linkWhats(cta.texto));
        break;
      case 'link':
        registrar('clicou', id, { acao: 'link' });
        abrirFora(CFG.instagram[cta.href] || CFG[cta.href] || cta.href);
        break;
      case 'teste':
        registrar('clicou', id, { acao: 'teste' });
        if (CFG.bussola) abrirFora(CFG.bussola);
        else abrirTeste();
        break;
      case 'prisma':
        registrar('clicou', id, { acao: 'prisma' });
        abrirFora(CFG.prisma || linkWhats(t('whatsPrisma')));
        break;
      case 'video':
        abrirVideo(cta.video, id, cta.vertical);
        break;
      case 'ficha':
        abrirFicha(cta.alvo);
        break;
    }
  }

  document.addEventListener('click', e => {
    const alvo = e.target;
    const perfil = alvo.closest('[data-perfil]');
    if (perfil) return escolherPerfil(perfil.dataset.perfil);

    const video = alvo.closest('[data-video]');
    if (video) return abrirVideo(video.dataset.video, video.dataset.item, video.dataset.vertical);

    const cta = alvo.closest('[data-acao-cta]');
    if (cta) return executar(JSON.parse(cta.dataset.acaoCta), cta.dataset.cta);

    const abrir = alvo.closest('[data-abrir]');
    if (abrir) return abrirFicha(abrir.dataset.abrir);

    const whats = alvo.closest('[data-whats]');
    if (whats) { e.preventDefault(); registrar('clicou', 'whatsapp', { de: 'pagina' }); return abrirFora(linkWhats(t(whats.dataset.whats))); }

    if (alvo.closest('[data-idioma]')) return trocarIdioma();

    const chip = alvo.closest('[data-procura]');
    if (chip) {
      const x = C.procura.find(p => p.id === chip.dataset.procura);
      registrar('clicou', 'procura:' + x.id);
      if (x.abrir) return abrirFicha(x.abrir);
      return rolarAte(x.rolar);
    }

    const seta = alvo.closest('[data-seta]');
    if (seta) {
      const trilho = seta.parentElement.querySelector('.trilho');
      return trilho.scrollBy({ left: +seta.dataset.seta * trilho.clientWidth * 0.82, behavior: reduz ? 'auto' : 'smooth' });
    }

    const acao = alvo.closest('[data-acao]');
    if (acao && acao.dataset.acao === 'fimHistoria') return fimHistoria(false);
  });

  $('#fecharFicha').addEventListener('click', () => fecharFicha());
  $('#fichaFundo').addEventListener('click', () => fecharFicha());
  $('#fecharVideo').addEventListener('click', fecharVideo);
  $('#video').addEventListener('click', e => { if (e.target.id === 'video') fecharVideo(); });
  addEventListener('popstate', () => { if (!$('#video').hidden) fecharVideo(); if (fichaAberta) fecharFicha(true); });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!$('#video').hidden) return fecharVideo();
    if (fichaAberta) fecharFicha();
  });

  function trocarIdioma() {
    definirIdioma(idioma === 'pt' ? 'en' : 'pt');
    guarda.gravar('ebg:idioma', idioma);
    mostrarOla();
    montarPerfis();
    const tela = document.body.dataset.tela;
    if (tela === 'entrada') {
      if ($('#passoPerfil').classList.contains('ativo')) perguntarFoco();
    } else if (tela === 'historia') {
      const i = historia.i;
      abrirHistoria();
      mostrarSlide(i);
    } else {
      if (fichaAberta) fecharFicha();
      const y = scrollY;
      abrirCatalogo();
      scrollTo(0, y);
    }
  }

  $('#avatar').addEventListener('click', () => {
    perguntarFoco();
    irPara('entrada');
  });

  document.addEventListener('submit', e => { if (e.target.id === 'passoDados') enviarDados(e); });
  document.addEventListener('input', e => {
    if (e.target.name !== 'whatsapp' || !e.target.closest('#passoDados')) return;
    const el = e.target, fim = el.selectionStart === el.value.length;
    el.value = mascaraTelefone(el.value);
    if (fim) el.setSelectionRange(el.value.length, el.value.length);
  });

  /* ---------------- redes no topo ---------------- */
  const REDES = {
    youtube: '<path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3z"/>',
    tiktok: '<path d="M16.6 3c.4 2.2 1.8 3.7 4 3.9v3.2c-1.5 0-2.9-.5-4-1.2v6.3c0 3.6-2.8 5.8-5.8 5.8A5.8 5.8 0 0 1 5 15.2c0-3.4 2.9-6 6.4-5.7v3.3c-1.6-.4-3.1.8-3.1 2.4 0 1.4 1.1 2.5 2.5 2.5s2.6-1 2.6-2.6V3z"/>',
    metodo: '<path d="M12 2c.6 4.8 2.2 6.6 7 7.4-4.8.8-6.4 2.6-7 7.4-.6-4.8-2.2-6.6-7-7.4 4.8-.8 6.4-2.6 7-7.4zm6 12c.3 2.2 1 3 3 3.3-2 .4-2.7 1.1-3 3.3-.3-2.2-1-2.9-3-3.3 2-.3 2.7-1.1 3-3.3z"/>'
  };
  const NOMES_REDES = { youtube: 'YouTube', tiktok: 'TikTok', metodo: 'Inglês Inteligente' };
  function montarRedes() {
    const html = Object.keys(REDES).filter(k => CFG.redes && CFG.redes[k]).map(k =>
      `<a href="${CFG.redes[k]}" target="_blank" rel="noopener" aria-label="${NOMES_REDES[k]}" title="${NOMES_REDES[k]}"><svg viewBox="0 0 24 24" aria-hidden="true">${REDES[k]}</svg></a>`).join('');
    $$('.redes').forEach(el => { el.innerHTML = html; });
  }

  /* ---------------- início ---------------- */
  montarRedes();
  const pedido = new URLSearchParams(location.search).get('lang');
  definirIdioma(pedido || guarda.ler('ebg:idioma') || 'pt');
  montarParede();
  montarPerfis();
  ligarHistoria();
  arrastarFicha();
  descarregar();

  const abertura = $('#abertura');
  let jaViu = false;
  try { jaViu = sessionStorage.getItem('ebg:abertura') === '1'; sessionStorage.setItem('ebg:abertura', '1'); } catch (e) { /* sem storage */ }
  if (jaViu || reduz) abertura.classList.add('feita');
  else {
    abertura.classList.add('toca');
    setTimeout(() => abertura.classList.add('feita'), 1900);
  }

  mostrarOla();

  // quem já escolheu o foco, chega por um perfil de origem ou por um link direto vai direto ao catálogo
  const pre = perfilPreDefinido();
  if (pre || IR || estado.perfil) {
    estado.perfil = pre || estado.perfil || 'fala';
    abrirCatalogo();
    seguirDestino();
    if (origemCfg().ola) setTimeout(() => aviso(origemCfg().ola), 900);
  }

  // atalho pra testar direto o catálogo: ?catalogo
  if (new URLSearchParams(location.search).has('catalogo')) {
    estado.perfil = estado.perfil || 'fala';
    abrirCatalogo();
  }
})();
