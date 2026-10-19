(() => {
  'use strict';

  const CFG = window.EBG_CONFIG;
  const C = window.EBG;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  document.documentElement.classList.add('js');

  const ICONES = {
    fala: '<path d="M4 3h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H10l-6 4.5V17a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/>',
    trabalho: '<path d="M9 2.5h6a2 2 0 0 1 2 2V7h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3V4.5a2 2 0 0 1 2-2zM9 7h6V4.5H9z"/>',
    viagem: '<path d="M21.5 16v-2l-8.5-5.2V3.5a1.5 1.5 0 0 0-3 0v5.3L1.5 14v2l8.5-2.6V19l-2.2 1.6V22l3.7-1 3.7 1v-1.4L13 19v-5.6z"/>',
    fe: '<path d="M10 1.5h4v6h6v4h-6V22.5h-4V11.5H4v-4h6z"/>',
    zero: '<path d="M11 22v-6.2C6.4 15.3 3.5 12 3.5 7V5.5H5c3.3 0 5.9 1.5 7 4 1.3-3 4.2-5 8-5h1.5V6c0 5.1-3.1 8.6-7.5 9.6V22z"/>'
  };
  const PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12.5-7.5z"/></svg>';
  const CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 12.5l5 5 10-11"/></svg>';
  const MAIS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7z"/></svg>';
  const CADEADO = '<svg class="card-cadeado" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10V7a5 5 0 0 1 10 0v3h1.5a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 20.5v-9A1.5 1.5 0 0 1 5.5 10zm2 0h6V7a3 3 0 0 0-6 0z"/></svg>';
  const SETA = d => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d === 'esq' ? 'M15.5 4l-8 8 8 8 1.5-1.5L10.5 12 17 5.5z' : 'M8.5 4l8 8-8 8L7 18.5 13.5 12 7 5.5z'}"/></svg>`;

  /* ---------------- armazenamento local ---------------- */
  const guarda = {
    ler(k, padrao = null) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : padrao; } catch (e) { return padrao; } },
    gravar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* modo privado: segue sem salvar */ } }
  };

  const estado = {
    lead: guarda.ler('ebg:lead'),
    perfil: (guarda.ler('ebg:lead') || {}).objetivo || null
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
    if (!estado.lead) return;
    enfileirar('events', { lead_id: estado.lead.id, tipo, item, detalhe });
  }

  window.addEventListener('online', descarregar);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') descarregar(); });

  /* ---------------- utilidades ---------------- */
  const uuid = () => (crypto.randomUUID ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16); }));
  const perfilDe = id => C.perfis.find(p => p.id === id) || C.perfis[0];
  const primeiroNome = () => ((estado.lead && estado.lead.nome) || '').trim().split(/\s+/)[0] || '';
  const combina = item => Math.round(60 + ((item.peso && item.peso[estado.perfil]) || 7) * 3.8);
  const icone = id => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONES[id]}</svg>`;

  function pintarPerfil(el, p) {
    el.style.setProperty('--cor', p.cor);
    if (p.tinta) el.style.setProperty('--tinta', p.tinta); else el.style.removeProperty('--tinta');
    el.innerHTML = icone(p.id);
  }

  function linkWhats(texto) {
    const nome = primeiroNome();
    const t = nome ? `${texto} (Sou ${nome}.)` : texto;
    return `https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent(t)}`;
  }

  function abrirFora(url) {
    const w = window.open(url, '_blank', 'noopener');
    if (!w) location.href = url;
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
  }

  /* =========================================================
     1 · ENTRADA
     ========================================================= */
  function montarParede() {
    const fotos = ['aluno-levi', 'aula-grupo', 'aluno-laura', 'gediel-brooklyn', 'aula-trio', 'aluno-luiz',
      'aula-turma', 'aluno-alycia', 'gediel-liberty-tall', 'aula-tela', 'aluno-bruno', 'gediel-london'];
    const html = Array.from({ length: 36 }, (_, i) => `<img src="img/${fotos[(i * 5) % fotos.length]}.webp" alt="" loading="${i < 18 ? 'eager' : 'lazy'}" decoding="async">`).join('');
    $('.parede').innerHTML = html;
  }

  function montarPerfis() {
    $('#perfis').innerHTML = C.perfis.map(p => `
      <li><button class="perfil" type="button" data-perfil="${p.id}">
        <span class="perfil-quadro" style="--cor:${p.cor};${p.tinta ? `--tinta:${p.tinta}` : ''}">${icone(p.id)}</span>
        <span class="perfil-nome">${esc(p.nome)}</span>
      </button></li>`).join('');
  }

  function mostrarPasso(id) {
    $$('.passo').forEach(p => p.classList.toggle('ativo', p.id === id));
  }

  function escolherPerfil(id) {
    estado.perfil = id;
    if (estado.lead) {
      // quem já entrou só troca de perfil e volta pro catálogo
      estado.lead.objetivo = id;
      guarda.gravar('ebg:lead', estado.lead);
      registrar('perfil', id);
      abrirCatalogo();
      return;
    }
    pintarPerfil($('#perfilEscolhido'), perfilDe(id));
    mostrarPasso('passoDados');
    setTimeout(() => $('#passoDados [name=nome]').focus({ preventScroll: true }), 350);
  }

  function mascaraTelefone(v) {
    const d = v.replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '').slice(0, 11);
    if (d.length <= 2) return d.length ? `(${d}` : '';
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  }

  function origem() {
    const q = new URLSearchParams(location.search);
    const partes = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].map(k => q.get(k) && `${k.slice(4)}=${q.get(k)}`).filter(Boolean);
    if (document.referrer && !document.referrer.startsWith(location.origin)) partes.push(`ref=${document.referrer}`);
    return partes.join(' · ').slice(0, 300) || null;
  }

  function enviarDados(ev) {
    ev.preventDefault();
    const f = ev.currentTarget;
    const nome = f.nome.value.trim();
    const tel = f.whatsapp.value.replace(/\D/g, '');
    const email = f.email.value.trim();
    const erro = $('#erroDados');
    $$('input', f).forEach(i => i.removeAttribute('aria-invalid'));

    let problema = null;
    if (nome.length < 2) problema = [f.nome, 'Me diz seu nome pra eu te chamar direitinho.'];
    else if (tel.length < 10 || tel.length > 13) problema = [f.whatsapp, 'Confere o WhatsApp com DDD, por favor.'];
    else if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) problema = [f.email, 'Esse e-mail parece incompleto. Pode deixar em branco, se preferir.'];
    if (problema) {
      problema[0].setAttribute('aria-invalid', 'true');
      problema[0].focus();
      erro.textContent = problema[1];
      return;
    }
    erro.textContent = '';

    const lead = {
      id: uuid(),
      nome: nome.slice(0, 120),
      whatsapp: (tel.length <= 11 ? '55' + tel : tel),
      email: email || null,
      objetivo: estado.perfil,
      origem: origem(),
      dispositivo: navigator.userAgent.slice(0, 300)
    };
    estado.lead = lead;
    guarda.gravar('ebg:lead', { id: lead.id, nome: lead.nome, objetivo: lead.objetivo });
    enfileirar('leads', lead);
    abrirHistoria();
  }

  /* =========================================================
     2 · HISTÓRIA
     ========================================================= */
  const historia = { i: 0, tempo: null, inicio: 0, restante: 0, dur: 7000 };

  function abrirHistoria() {
    const slides = C.historia;
    $('#barras').innerHTML = slides.map(() => '<span class="barra"><i></i></span>').join('');
    $('#slides').innerHTML = slides.map((s, i) => {
      const titulo = esc(s.titulo.replace('{nome}', primeiroNome() || 'Você'));
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
    irPara('catalogo');
    const p = perfilDe(estado.perfil);
    pintarPerfil($('#avatar'), p);
    $('#avatar').setAttribute('aria-label', `Perfil: ${p.nome}. Trocar`);
    const m = C.itens.mentoria;
    $('#vitrineMeta').innerHTML = `<span class="combina">${combina(m)}% pra você</span>` + m.meta.map(t => `<span>${esc(t)}</span>`).join('');
    $('#vitrineSinopse').textContent = C.perfilTexto[estado.perfil] || m.sinopse;
    montarFileiras();
    if (!catalogoMontado) {
      catalogoMontado = true;
      montarPerguntas();
      observar();
      girarVitrine();
    }
    descarregar();
  }

  function cardHTML(id, formato, i, comCombina) {
    const it = C.itens[id];
    const texto = it.capa === 'texto';
    let selo = '';
    if (it.tipo === 'gratis') selo = '<span class="card-selo gratis">Grátis</span>';
    else if (id === 'mentoria') selo = '<span class="card-selo pago">Mentoria</span>';

    const linha = [];
    if (comCombina && it.peso) linha.push(`<span class="combina">${combina(it)}%</span>`);
    if (it.tipo === 'aluno') linha.push(esc(it.nome));
    else if (it.tipo === 'etapa') linha.push(esc(it.duracao));
    else if (it.meta) linha.push(esc(it.meta[0]));

    const midia = texto ? '' : `<img src="${it.img}" alt="" loading="lazy" decoding="async">`;
    const play = it.video && !texto ? `<span class="card-play">${PLAY}</span>` : '';
    const tituloCard = it.tipo === 'aluno' ? `“${esc(it.titulo)}”` : esc(it.titulo);

    return `<button class="card card-${formato}${texto ? ' capa-texto' : ''}${it.contem ? ' contem' : ''}" type="button"
        data-abrir="${id}" style="--i:${i};${texto ? `--cor:${it.cor}` : ''}" aria-label="${esc(it.titulo)}">
      ${midia}${texto ? '' : selo}${play}
      <span class="card-texto">
        ${texto ? (it.tipo === 'exclusivo' ? CADEADO : selo) : ''}
        <span>
          <span class="card-titulo">${tituloCard}</span>
          <span class="card-linha">${linha.join('')}</span>
        </span>
      </span>
    </button>`;
  }

  function montarFileiras() {
    $('#fileiras').innerHTML = C.fileiras.map(f => {
      let itens = f.itens;
      let sub = '';
      if (f.dinamica) {
        itens = Object.keys(C.itens)
          .filter(k => C.itens[k].peso && C.itens[k].tipo !== 'exclusivo')
          .sort((a, b) => (a === 'mentoria' ? -1 : b === 'mentoria' ? 1 : 0) || C.itens[b].peso[estado.perfil] - C.itens[a].peso[estado.perfil])
          .slice(0, 8);
        sub = perfilDe(estado.perfil).nome;
      }
      return `<section class="fileira" id="fileira-${f.id}" aria-labelledby="t-${f.id}">
        <div class="fileira-cabeca"><h2 id="t-${f.id}">${esc(f.titulo)}</h2>${sub ? `<span class="fileira-sub">${esc(sub)}</span>` : ''}</div>
        <div class="trilho-wrap">
          <button class="seta seta-esq" type="button" aria-label="Voltar" data-seta="-1">${SETA('esq')}</button>
          <div class="trilho" role="list">${itens.map((id, i) => cardHTML(id, f.formato, i, f.dinamica)).join('')}</div>
          <button class="seta seta-dir" type="button" aria-label="Avançar" data-seta="1">${SETA('dir')}</button>
        </div>
      </section>`;
    }).join('');
    $$('.trilho').forEach(t => observador && observador.observe(t));
  }

  function montarPerguntas() {
    $('#listaPerguntas').innerHTML = C.perguntas.map(([q, r]) => `
      <details class="pergunta"><summary>${esc(q)}${MAIS}</summary><p>${esc(r)}</p></details>`).join('');
    $('#listaPerguntas').addEventListener('toggle', e => {
      if (e.target.open) $$('.pergunta[open]').forEach(d => { if (d !== e.target) d.open = false; });
    }, true);
  }

  let observador;
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

    const topo = $('#topo');
    let ultimoY = 0;
    addEventListener('scroll', () => {
      const y = scrollY;
      topo.classList.toggle('solido', y > 40);
      ultimoY = y;
    }, { passive: true });
  }

  function girarVitrine() {
    if (reduz) return;
    const fotos = $$('.vitrine-fotos img');
    let i = 0;
    setInterval(() => {
      if (document.hidden || document.body.dataset.tela !== 'catalogo') return;
      fotos[i].classList.remove('ativa');
      i = (i + 1) % fotos.length;
      fotos[i].classList.add('ativa');
    }, 6500);
  }

  /* =========================================================
     Ficha
     ========================================================= */
  let fichaAberta = null;
  let focoAntes = null;

  function botaoCta(cta, id, classe) {
    return `<button class="botao ${classe}" type="button" data-cta="${id}" data-acao-cta='${esc(JSON.stringify(cta))}'>
      ${cta.acao === 'video' ? PLAY : ''}${esc(cta.rotulo)}</button>`;
  }

  function fichaHTML(id) {
    const it = C.itens[id];
    const texto = it.capa === 'texto';
    const midia = texto
      ? `<div class="ficha-midia capa-texto" style="--cor:${it.cor}"><span>${esc(it.titulo)}</span></div>`
      : `<div class="ficha-midia"><img src="${it.imgLarga || it.img}" alt="${it.tipo === 'aluno' ? esc(it.nome) : ''}">
          ${it.video ? `<button class="ficha-play" type="button" data-video="${it.video}" data-item="${id}" ${it.tipo === 'aluno' ? 'data-vertical="1"' : ''} aria-label="Assistir">${PLAY}</button>` : ''}</div>`;

    const meta = [];
    if (it.peso) meta.push(`<span class="combina">${combina(it)}% pra você</span>`);
    if (it.tipo === 'aluno') meta.push(`<span>${esc(it.nome)}</span>`, `<span>${esc(it.arroba)}</span>`);
    if (it.tipo === 'etapa') meta.push(`<span>${esc(it.duracao)}</span>`, '<span>Parte da Mentoria</span>');
    if (it.tipo === 'gratis') meta.push('<span>Grátis</span>');
    (it.meta || []).forEach(t => meta.push(`<span>${esc(t)}</span>`));

    let acoes = '';
    if (it.tipo === 'aluno') {
      acoes = botaoCta({ rotulo: 'Ver depoimento', acao: 'video', video: it.video, vertical: true }, id, 'botao-claro')
            + botaoCta({ rotulo: 'Quero esse caminho também', acao: 'ficha', alvo: 'mentoria' }, id, 'botao-cinza');
    } else if (it.tipo === 'etapa') {
      acoes = botaoCta({ rotulo: 'Ver a mentoria completa', acao: 'ficha', alvo: 'mentoria' }, id, 'botao-cheio');
    } else {
      if (it.cta) acoes += botaoCta(it.cta, id, (it.cta.acao === 'checkout' || it.cta.acao === 'teste') ? 'botao-cheio' : 'botao-claro');
      if (it.cta2) acoes += botaoCta(it.cta2, id, 'botao-cinza');
    }

    let extra = '';
    if (it.inclui) {
      extra += `<h3>O que está incluído</h3><ul class="inclui" role="list">${it.inclui.map(t => `<li>${CHECK}<span>${esc(t)}</span></li>`).join('')}</ul>`;
    }
    if (it.preco) {
      extra += `<div class="preco">
        <p class="preco-de">${esc(it.preco.separado)}</p>
        <p class="preco-por">${esc(it.preco.parcelas)}</p>
        <p class="preco-nota">${esc(it.preco.nota)}</p>
        <p class="preco-garantia"><b>Garantia de 7 dias.</b> Participou da primeira semana e sentiu que não é pra você? O valor volta inteiro.</p>
      </div>`;
    }
    if (it.episodios) {
      const eps = C.fileiras.find(f => f.id === it.episodios).itens;
      extra += `<h3>Como funciona, etapa por etapa</h3><ol class="episodios">${eps.map(e => {
        const ep = C.itens[e];
        return `<li class="episodio"><img src="${ep.img}" alt="" loading="lazy"><div><strong>${esc(ep.titulo)}</strong><span>${esc(ep.duracao)}</span></div><p>${esc(ep.sinopse)}</p></li>`;
      }).join('')}</ol>`;
      extra += `<h3>Quem já passou por aqui</h3><div class="alunos-mini">${['levi', 'laura', 'luiz', 'alycia', 'bruno'].map(a => {
        const al = C.itens[a];
        return `<button type="button" data-video="${al.video}" data-item="${a}" data-vertical="1"><img src="${al.img}" alt="${esc(al.nome)}" loading="lazy"><span>${esc(al.nome)}</span></button>`;
      }).join('')}</div>`;
    }

    return `${midia}<div class="ficha-corpo">
      <h2 id="fichaTitulo">${it.tipo === 'aluno' ? `“${esc(it.titulo)}”` : esc(it.titulo)}</h2>
      <p class="ficha-meta">${meta.join('')}</p>
      <p class="ficha-sinopse">${it.tipo === 'aluno' ? `“${esc(it.sinopse)}”` : esc(it.sinopse)}</p>
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
        <div class="teste-progresso" aria-label="Pergunta ${k + 1} de ${T.perguntas.length}">${T.perguntas.map((_, j) => `<i class="${j < k ? 'feito' : ''}"></i>`).join('')}</div>
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
        <p class="ficha-meta">Seu ponto de partida</p>
        <p class="resultado-nivel">${esc(r.nivel)}</p>
        <h2 id="fichaTitulo" style="margin-top:18px">${esc(r.frase)}</h2>
        <p class="ficha-sinopse">${esc(r.texto)}</p>
        <div class="ficha-acoes">
          ${botaoCta({ rotulo: 'Ver a mentoria pro meu nível', acao: 'ficha', alvo: 'mentoria' }, 'teste', 'botao-cheio')}
          ${botaoCta({ rotulo: 'Mandar meu resultado pro Gediel', acao: 'whatsapp', texto: `Oi Gediel! Fiz o teste do catálogo e deu ${r.nivel}. Por onde eu começo?` }, 'teste', 'botao-cinza')}
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
      title="Vídeo" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
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
        abrirFora(CFG.instagram[cta.href] || cta.href);
        break;
      case 'teste':
        registrar('clicou', id, { acao: 'teste' });
        abrirTeste();
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
    const t = e.target;
    const perfil = t.closest('[data-perfil]');
    if (perfil) return escolherPerfil(perfil.dataset.perfil);

    const video = t.closest('[data-video]');
    if (video) return abrirVideo(video.dataset.video, video.dataset.item, video.dataset.vertical);

    const cta = t.closest('[data-acao-cta]');
    if (cta) return executar(JSON.parse(cta.dataset.acaoCta), cta.dataset.cta);

    const abrir = t.closest('[data-abrir]');
    if (abrir) return abrirFicha(abrir.dataset.abrir);

    const whats = t.closest('[data-whats]');
    if (whats) { e.preventDefault(); registrar('clicou', 'whatsapp', { de: 'pagina' }); return abrirFora(linkWhats(whats.dataset.whats)); }

    const seta = t.closest('[data-seta]');
    if (seta) {
      const trilho = seta.parentElement.querySelector('.trilho');
      return trilho.scrollBy({ left: +seta.dataset.seta * trilho.clientWidth * 0.82, behavior: reduz ? 'auto' : 'smooth' });
    }

    const acao = t.closest('[data-acao]');
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

  $('#avatar').addEventListener('click', () => {
    $('#boasVindas').textContent = `${primeiroNome() ? primeiroNome() + ', q' : 'Q'}ual é o foco de hoje? O catálogo se reorganiza na hora.`;
    $('.entrada-titulo').textContent = 'Quem está aprendendo hoje?';
    mostrarPasso('passoPerfil');
    irPara('entrada');
  });

  $('#passoDados').addEventListener('submit', enviarDados);
  $('#voltarPerfil').addEventListener('click', () => mostrarPasso('passoPerfil'));
  $('#passoDados [name=whatsapp]').addEventListener('input', e => {
    const el = e.target, fim = el.selectionStart === el.value.length;
    el.value = mascaraTelefone(el.value);
    if (fim) el.setSelectionRange(el.value.length, el.value.length);
  });

  /* ---------------- início ---------------- */
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

  if (estado.lead) {
    $('#boasVindas').textContent = `Que bom te ver de novo, ${primeiroNome()}. Qual é o foco de hoje?`;
  }

  // atalho pra testar direto o catálogo: ?catalogo
  if (new URLSearchParams(location.search).has('catalogo')) {
    estado.perfil = estado.perfil || 'fala';
    abrirCatalogo();
  }
})();
