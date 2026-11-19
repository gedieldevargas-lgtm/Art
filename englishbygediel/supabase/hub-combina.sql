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
