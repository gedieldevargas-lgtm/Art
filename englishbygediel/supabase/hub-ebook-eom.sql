-- (o e-book NÃO vem incluso na assinatura do English on Mission: decisão do Gediel, 15/11)
-- CARD do e-book "Bíblia Linear — 1, 2 e 3 João" no Hub (aparece em "Pra ir mais fundo" e na lojinha).
-- Rode no projeto do HUB (iwivldvubmsqyzkkdxoy), SQL Editor. Pode rodar mais de uma vez.
update site_config set dados = jsonb_set(dados, '{cards}', (dados->'cards') || '[{"id":"ebook-biblia-linear","tipo":"pago","ativo":true,"titulo":"Bíblia Linear: 1, 2 e 3 João","linha":"Inglês e português lado a lado","nome":"","setor":"E-books","img":"","preco":"R$ 37,00","link":"https://pay.kiwify.com.br/M3SRe7s","botao":"Adquirir o e-book","link2":"","botao2":"","video":"","sinopse":"Leia as cartas de João em inglês e português, versículo por versículo, e aprenda inglês com a Bíblia.","meta":"E-book","modos":[]}]'::jsonb)
where id = 'hub' and not ((dados->'cards') @> '[{"id":"ebook-biblia-linear"}]'::jsonb);

-- se o card já existia (rodou antes), atualiza o preço e o botão
update site_config set dados = jsonb_set(dados, '{cards}', (
  select jsonb_agg(case when c->>'id' = 'ebook-biblia-linear' then c || '{"preco":"R$ 37,00","botao":"Adquirir o e-book","meta":"E-book","sinopse":"Leia as cartas de João em inglês e português, versículo por versículo, e aprenda inglês com a Bíblia."}'::jsonb else c end)
  from jsonb_array_elements(dados->'cards') c))
where id = 'hub' and (dados->'cards') @> '[{"id":"ebook-biblia-linear"}]'::jsonb;
