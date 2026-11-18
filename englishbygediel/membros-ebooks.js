/* Catálogo dos e-books/PDFs: nome, como reconhecer o arquivo, o que combina (upsell) e a página de "Obrigado". */
(function () {
  'use strict';
  var C = [
    { k: 'destrave', nome: 'Destrave Seu Inglês', arq: /destrave/i, nome_re: /destrave|pron[uú]nc/i, tipo: 'produto', img: 'img/ebooks/destrave.webp', url: 'https://pay.kiwify.com.br/ODOhEzc', desc: 'Pronúncia pra brasileiro, escrita do jeito que a gente lê.', leve: ['kit', 'guia'], por: 'Agora que sua pronúncia está no caminho, é hora de ter frases prontas pra usar.' },
    { k: 'kit', nome: 'Kit de Frases: Situações Reais', arq: /kit.?de.?frases/i, nome_re: /kit.?(de )?frases/i, tipo: 'produto', img: 'img/ebooks/kit.webp', desc: 'Frases do dia a dia prontas pra falar em voz alta.', leve: ['destrave', 'passaporte'], por: 'Frases prontas pedem boa pronúncia. Esses dois fecham a fala.' },
    { k: 'guia', nome: 'Guia de Inglês por Nível A1 a B2', arq: /guia.?de.?ingl[eê]s.?a1/i, nome_re: /guia.*(a1|n[ií]vel)/i, tipo: 'produto', img: 'img/ebooks/guia.webp', url: 'https://guia-a1-b2.netlify.app/', desc: 'Seu mapa do A1 ao B2, com planejadores.', leve: ['planejadores', 'dias360'], bonus: ['planejadores'], por: 'Com o mapa na mão, falta a rotina diária pra andar por ele.' },
    { k: 'planejadores', nome: 'Planejadores English by Gediel (imprimir)', arq: /planejadores_english/i, nome_re: /planejadores/i, tipo: 'produto', desc: 'Caderno pra imprimir: ponto de partida, semana e metas.', leve: ['dias360', 'guia'], bonusDe: 'guia', por: 'Planejador é melhor ainda com um plano de estudo completo.' },
    { k: 'dias360', nome: 'Do Zero ao Inglês em 360 Dias', arq: /360/i, nome_re: /360|do zero/i, img: 'img/ebooks/dias360.webp', tipo: 'produto', desc: 'Um plano de 360 dias: 30 a 60 minutos por dia.', leve: ['destrave', 'programa'], por: 'Pra ter alguém corrigindo e acompanhando o seu plano, conheça o Programa.' },
    { k: 'jogos', nome: '10 Jogos para Aprender Inglês', arq: /10_jogos|jogos.?para/i, nome_re: /10 jogos|jogos para/i, tipo: 'gratis', img: 'img/ebooks/jogos.webp', desc: 'Seus jogos favoritos viram aula de inglês.', leve: ['destrave', 'kit'], por: 'Gostou de aprender jogando? Agora destrave a fala.' },
    { k: 'visto', nome: 'Guia do Visto Americano', arq: /visto/i, nome_re: /visto/i, img: 'img/ebooks/visto.webp', tipo: 'produto', desc: 'Prepare a entrevista de visto B1/B2 em inglês.', leve: ['kit', 'passaporte'], por: 'Para a viagem inteira, não só a entrevista.' },
    { k: 'passaporte', nome: 'Passaporte do Inglês', nome_re: /passaporte|viagens/i, tipo: 'produto', img: 'img/capa-viagens.webp', url: 'https://ebookviagens.netlify.app/', desc: 'Inglês para viagens, do aeroporto ao hotel.', leve: ['visto', 'kit'], por: '' },
    { k: 'series', nome: 'Inglês com Séries', arq: /ebook_ingles_com_series|ingles_com_series/i, nome_re: /ingl[eê]s com s[eé]ries/i, img: 'img/ebooks/series.webp', tipo: 'produto', desc: 'Estude uma temporada inteira, episódio por episódio.', leve: ['caderno', 'filmes'], bonus: ['caderno'], por: 'O guia rende mais com o caderno e uma boa lista de filmes.' },
    { k: 'caderno', nome: 'Caderno de Séries (imprimir)', arq: /caderno_series/i, nome_re: /caderno.*s[eé]ries/i, tipo: 'produto', desc: '24 fichas de episódio pra imprimir.', leve: ['series'], bonusDe: 'series', por: '' },
    { k: 'filmes', nome: 'Inglês com Filmes e Séries', arq: /filmes_e_s[eé]ries|culture_english_edicao/i, nome_re: /filmes e s[eé]ries/i, img: 'img/ebooks/filmes.webp', tipo: 'gratis', desc: 'Culture English: comece a aprender com o que você já assiste.', leve: ['series', 'dias360'], por: 'Quer ir fundo? Estude uma temporada inteira com método.' },
    { k: 'dois', nome: 'Inglês a Dois: 15 Meses', arq: /ingles_a_dois/i, nome_re: /ingl[eê]s a dois/i, img: 'img/ebooks/dois.webp', tipo: 'produto', desc: 'Jornada de 15 meses pra casais aprenderem juntos.', leve: ['templates'], bonus: ['templates'], por: 'Combina com os templates pra imprimir de cada mês.' },
    { k: 'templates', nome: 'Templates Casais 15 Meses (imprimir)', arq: /templates_casais/i, nome_re: /templates.*casais/i, tipo: 'produto', desc: 'Fichas mensais pra imprimir, uma por mês.', leve: ['dois'], bonusDe: 'dois', por: '' },
    { k: 'programa', nome: 'Programa Método Inteligente', virtual: true, img: '', url: '', desc: 'Aulas, lives com replay e acompanhamento.', leve: [], por: '' }
  ];
  var por = function (k) { return C.filter(function (x) { return x.k === k; })[0]; };
  var E = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  function deMaterial(m) { var n = (m.nome || '') + ' ' + (m.produto || ''); return C.filter(function (x) { return !x.virtual && x.nome_re && x.nome_re.test(n); })[0] || null; }
  function deArquivo(nome) { return C.filter(function (x) { return x.arq && x.arq.test(nome); })[0] || null; }
  /* página de obrigado: abre depois que o aluno acessa um PDF dele */
  function obrigado(m, ler, baixar, ctx) {
    var c = deMaterial(m), leve = c ? c.leve.map(por).filter(Boolean) : [];
    leve = leve.filter(function (x) { return !(ctx && ctx.tem && ctx.tem(x)) && !(c && ((c.bonus || []).indexOf(x.k) >= 0 || x.bonusDe === c.k || c.bonusDe === x.k)); }).slice(0, 3);
    var ex = (ctx && ctx.extras) || [];
    var h = '<div class="pw ob"><div class="ob-ic">🎉</div><h3>Obrigado! ' + (ex.length ? 'Seus ' + (ex.length + 1) + ' arquivos estão liberados' : 'Seu e-book está liberado') + '</h3>';
    var arq = function (nome, l, b, tag) { return '<div class="ob-arq"><div class="ob-an">' + tag + ' ' + E(nome) + '</div><div class="ob-ab"><a class="sim" href="' + E(l) + '" target="_blank" rel="noopener">👀 Ler</a><a class="nao" href="' + E(b || l) + '">⬇️ Baixar</a></div></div>'; };
    h += arq(m.nome, ler, baixar, '📘') + ex.map(function (x) { return arq(x.nome, x.ler, x.baixar, '📄'); }).join('');
    if (leve.length) h += '<div class="ob-sec">' + E(c.por || 'Pra ir mais longe, leve junto') + '</div><div class="ob-up">' + leve.map(function (x) {
      return '<button class="ob-card" data-ob-up="' + E(x.k) + '">' + (x.img ? '<img alt="" src="' + E(x.img) + '">' : '<div class="ob-ph">' + E(x.nome) + '</div>') + '<b>' + E(x.nome) + '</b><span>' + E(x.virtual ? 'Conhecer ›' : (x.tipo === 'gratis' ? 'Baixar grátis ›' : 'Quero esse ›')) + '</span></button>'; }).join('') + '</div>';
    return h + '<button class="nao" data-fechar style="display:block;width:100%;margin-top:6px">Fechar</button></div>';
  }
  var css = document.createElement('style');
  css.textContent = '.ob{max-width:480px;max-height:92vh;overflow:auto}.ob-ic{font-size:44px;text-align:center}.ob h3{text-align:center}.ob-n{text-align:center;color:var(--fg2);font-weight:700;margin:0 0 12px}'
    + '.ob .sim,.ob .nao{display:block;text-decoration:none;text-align:center;min-height:48px;line-height:48px;border-radius:14px}.ob .sim{background:linear-gradient(135deg,#4f6ef7,#8b5cf6)!important;color:#fff!important;font-weight:800;margin-top:6px}.ob .nao{background:transparent!important;border:1.5px solid var(--border)!important;color:var(--fg)!important}.ob-dl{margin-top:8px;font-weight:800}'
    + '.ob-arq{border:1.5px solid var(--border);border-radius:14px;padding:12px;margin-bottom:10px}.ob-an{font-weight:800;font-size:14px;margin-bottom:8px}.ob-ab{display:grid;grid-template-columns:1fr 1fr;gap:8px}.ob-ab a{min-height:44px!important;line-height:44px!important;margin:0!important}.ob-sec{font-size:13px;font-weight:800;margin:18px 0 8px}.ob-it{all:unset;box-sizing:border-box;display:block;width:100%;padding:12px 14px;border:1.5px solid var(--border);border-radius:14px;cursor:pointer;margin-bottom:8px}.ob-it b{display:block;font-size:14px}.ob-it span{font-size:12.5px;color:var(--fg2)}'
    + '.ob-up{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px}.ob-card{all:unset;box-sizing:border-box;cursor:pointer;display:flex;flex-direction:column;gap:5px;padding:8px;border:1.5px solid var(--border);border-radius:14px}.ob-card:hover{border-color:var(--accent)}'
    + '.ob-card img,.ob-ph{width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:9px}.ob-ph{background:linear-gradient(160deg,#4f6ef7,#1b2440);color:#fff;display:flex;align-items:center;justify-content:center;text-align:center;padding:8px;font:800 14px/1.15 Georgia,serif}.ob-card b{font-size:12.5px;line-height:1.25}.ob-card span{font-size:12px;font-weight:800;color:var(--accent)}';
  document.head.appendChild(css);
  C.forEach(function (x) { if (x.bonusDe && !x.img) x.img = por(x.bonusDe).img; });
  window.EBG_EBOOKS = { lista: C, por: por, deMaterial: deMaterial, deArquivo: deArquivo, obrigado: obrigado };
})();
