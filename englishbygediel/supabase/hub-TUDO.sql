-- HUB: TUDO EM UM. Cole no SQL Editor do projeto do HUB (iwivldvubmsqyzkkdxoy) e clique Run. Pode rodar mais de uma vez.

-- ===== hub-limpeza =====
-- LIMPEZA E TEXTOS DO HUB (projeto do HUB, iwivldvubmsqyzkkdxoy). Cole no SQL Editor e clique Run. Pode rodar mais de uma vez.
-- O que faz, só nos cards (nada mais do site muda):
--  1) tira os repetidos (o "Programa em Grupo" que estava 2x), o card vazio "Materiais", o "Novo material" e as versões antigas
--     do Passaporte, do Guia A1-B2 e do Kit de Frases (a versão com link direto da Kiwify fica, com o texto das antigas);
--  2) separa os dois "Grupo do WhatsApp" (English On Mission x Culture English);
--  3) arruma a categoria do "Diagnósticos e Testes" (virava um filtro enorme) e escreve uma frase clara em cada card grátis e nos produtos, e troca os botões de compra por "Adquirir";
--  4) atualiza o Passaporte do Inglês (agora são 10 situações, do aeroporto à emergência);
--  5) liga o card do Programa ao checkout (pay.kiwify.com.br/CohRPDI), que estava sem link.
with p as (select '{"grupoeom": {"titulo": "Grupo do WhatsApp · English On Mission", "linha": "Pratique e caminhe junto durante a semana"}, "grupoculture": {"titulo": "Grupo do WhatsApp · Culture English", "linha": "Dicas de séries, filmes e músicas pra praticar"}, "diagtestes": {"setor": "Testes", "linha": "Descubra como você aprende e qual é o seu nível, do A1 ao C2"}, "vlogeuropa": {"linha": "Londres, Paris e Bruxelas, abertos no YouTube"}, "teste": {"linha": "Teste grátis: do A1 ao C2"}, "prisma": {"linha": "Teste grátis: descubra como você aprende melhor"}, "liveterca": {"linha": "Lives abertas: inglês com séries, filmes e música"}, "eom": {"linha": "Devocionais ao vivo em inglês, sábado às 9h"}, "ingi": {"linha": "O método das múltiplas inteligências aplicado ao inglês"}, "k-6e5c54d0-d6dc-11f1-b2c8-cd52a501feab": {"linha": "Inglês para Viagens", "setor": "E-books", "botao": "Adquirir", "meta": "E-book, 10 situações, Pagamento único", "modos": ["viagem", "intercambio", "zero"], "sinopse": "O manual pra quem tem viagem marcada e não quer depender de ninguém lá fora. O que falar e o que você vai ouvir em 10 situações, do aeroporto à emergência, com vocabulário com imagem, frases e diálogos reais."}, "k-98700bf0-d53c-11f1-bd40-b570d8dc84fc": {"titulo": "Guia de Inglês A1 a B2", "linha": "O que estudar em cada etapa", "setor": "Guias", "botao": "Adquirir", "meta": "Guia digital, 20 páginas em PDF, A1 → B2", "modos": ["teste", "zero", "carreira"], "sinopse": "Um mapa claro do A1 ao B2, sem ficar pulando de vídeo em vídeo. Descubra o que estudar em cada fase, organize sua rotina com planos semanais de 30 a 60 minutos e transforme conteúdo em prática real com missões e checklists."}, "k-2148e660-d4b9-11f1-b0a4-6fbb7dc27ca9": {"titulo": "Kit de Frases para Situações Reais", "linha": "Inglês prático, frases prontas pra usar", "setor": "E-books", "botao": "Adquirir", "meta": "Kit, Frases prontas", "modos": ["viagem", "carreira", "zero"], "sinopse": "As frases que você precisa nas situações essenciais do dia a dia, prontas pra usar."}, "k-c5edeb30-d30f-11f1-9322-452f895bcd20": {"linha": "Os 3 segredos pra destravar seu inglês", "setor": "Aulas", "botao": "Adquirir"}, "k-c8de4710-dc54-11f1-9324-39aa1bf06607": {"linha": "O Programa completo, com acompanhamento", "setor": "Programa", "botao": "Adquirir", "meta": "Programa, Em grupo", "link": "https://pay.kiwify.com.br/CohRPDI", "sinopse": "O Programa completo: todas as aulas, todos os materiais e lives com replay. Quem é aluno também pode pedir aula particular com o Gediel (paga à parte)."}}'::jsonb as patches),
base as (select dados from site_config where id = 'hub'),
cards as (
  select c, ord, row_number() over (partition by c->>'id' order by ord) as rn
  from base, jsonb_array_elements(base.dados->'cards') with ordinality as t(c, ord))
update site_config set dados = jsonb_set(dados, '{cards}', (
  select jsonb_agg(c || coalesce((select patches -> (c->>'id') from p), '{}'::jsonb) order by ord)
  from cards
  where rn = 1 and c->>'id' not in ('cmw5dsm4n', 'cmw5er4sj', 'passaporte', 'guiaa1b2', 'kitfrases')))
where id = 'hub';

-- 6) o botão da fileira "Pra ir mais fundo" dizia "Mentoria →" mas leva pros planos: agora diz o que ele faz
update site_config set dados = jsonb_set(dados, '{secoes,botaoPagos}', '"Ver planos →"'::jsonb)
where id = 'hub' and dados ? 'secoes';

-- ===== hub-ebook-pronuncia =====
-- E-BOOK "Destrave Seu Inglês: pronúncia pra brasileiro" (R$ 14,90) no Hub (projeto do HUB, iwivldvubmsqyzkkdxoy). Cole no SQL Editor e clique Run.
-- Pode rodar mais de uma vez. Aparece em "Pra ir mais fundo" e na lojinha. Botão "Adquirir" vai direto ao checkout da Kiwify;
-- "Ver a página do e-book" abre a página de vendas dele.
update site_config set dados = jsonb_set(dados, '{cards}',
  '[{"id": "ebook-pronuncia", "tipo": "pago", "ativo": true, "titulo": "Destrave Seu Inglês: pronúncia pra brasileiro", "linha": "E-book visual de 15 páginas pra destravar a fala", "nome": "", "setor": "E-books", "img": "img/capa-ebook-pronuncia.webp", "preco": "R$ 14,90", "link": "https://pay.kiwify.com.br/ODOhEzc", "botao": "Adquirir", "link2": "https://intelligentpronounciation.netlify.app/", "botao2": "Ver a página do e-book", "video": "", "sinopse": "O guia visual pra quem trava na hora de falar. A pronúncia vem escrita do jeito que brasileiro lê, sem símbolo estranho de dicionário: chocolate vira TCHÓK-let, vegetable vira VÉDJ-tâ-bol. Do fácil ao chefão, são 4 níveis, cada um com explicação, exercício e canais do YouTube pra praticar. 15 páginas, acesso imediato.", "meta": "E-book, 15 páginas, Acesso imediato", "modos": ["zero", "teste", "carreira"]}]'::jsonb || (dados->'cards'))
where id = 'hub' and not ((dados->'cards') @> '[{"id":"ebook-pronuncia"}]'::jsonb);

-- ===== hub-combina =====
-- "COMBINA COM" nos e-books do Hub (projeto do HUB, iwivldvubmsqyzkkdxoy). Cole no SQL Editor e clique Run. Pode rodar mais de uma vez.
-- Na ficha de cada e-book aparece uma fileira "Combina com", com os outros e-books que levam junto (venda cruzada).
-- Mesma lógica da área de membros. Rode DEPOIS do hub-limpeza.sql e do hub-ebook-pronuncia.sql.
with p as (select '{
  "ebook-pronuncia": {"combina": "k-2148e660-d4b9-11f1-b0a4-6fbb7dc27ca9,k-98700bf0-d53c-11f1-bd40-b570d8dc84fc"},
  "k-2148e660-d4b9-11f1-b0a4-6fbb7dc27ca9": {"combina": "ebook-pronuncia,k-6e5c54d0-d6dc-11f1-b2c8-cd52a501feab"},
  "k-98700bf0-d53c-11f1-bd40-b570d8dc84fc": {"combina": "ebook-pronuncia,k-2148e660-d4b9-11f1-b0a4-6fbb7dc27ca9"},
  "k-6e5c54d0-d6dc-11f1-b2c8-cd52a501feab": {"combina": "k-2148e660-d4b9-11f1-b0a4-6fbb7dc27ca9,ebook-pronuncia"}
}'::jsonb as patches),
cards as (select c, ord from site_config, jsonb_array_elements(dados->'cards') with ordinality as t(c, ord) where id = 'hub')
update site_config set dados = jsonb_set(dados, '{cards}', (
  select jsonb_agg(c || coalesce((select patches -> (c->>'id') from p), '{}'::jsonb) order by ord) from cards))
where id = 'hub';

-- ===== hub-atalhos =====
-- Atalhos do topo do Hub: ganham frase + preço (sem mexer nas capas). Seguro rodar mais de uma vez.
update site_config set dados = jsonb_set(dados, '{atalhos}', coalesce((
  select jsonb_agg(
    case a->>'ir'
      when 'gratis' then a || '{"titulo":"Grátis","texto":"Jogos, testes, lives e e-books pra começar hoje.","preco":"R$ 0"}'::jsonb
      when 'pagos'  then a || '{"titulo":"E-books","texto":"Guias práticos pra estudar no seu ritmo.","auto":"ebooks"}'::jsonb
      when 'alunos' then a || '{"titulo":"Alunos","texto":"Veja quem já destravou o inglês."}'::jsonb
      when 'aplicar' then a || '{"titulo":"Programa","texto":"Aula ao vivo, plano pra cada dia e acompanhamento.","plano":"Inteligente"}'::jsonb
      when 'login'  then a || '{"titulo":"Já é aluno?","texto":"Entre e continue de onde parou."}'::jsonb
      else a end order by ord)
  from jsonb_array_elements(dados->'atalhos') with ordinality as t(a, ord)), '[]'::jsonb))
where id = 'hub' and jsonb_typeof(dados->'atalhos') = 'array';
-- desliga a seção "Por onde começar" (agora a informação fica nos atalhos)
update site_config set dados = jsonb_set(dados, '{escada}', '[]'::jsonb) where id = 'hub';
