-- ATALHO "Planos" no Hub (leva pra aba de preços). Rode no projeto do HUB (iwivldvubmsqyzkkdxoy), SQL Editor.
-- Pode rodar mais de uma vez. Depois, em /admin → Hub → Atalhos, você muda a ordem e a foto como quiser.
-- (os cartões de planos em si já vêm no site; edite em /admin → Hub → Planos)
update site_config set dados = jsonb_set(dados, '{atalhos}', (dados->'atalhos') || '[{"titulo":"Planos","sub":"Escolha o seu","img":"img/card-aulas.webp","ir":"planos","icone":"estrela"}]'::jsonb)
where id = 'hub' and not ((dados->'atalhos') @> '[{"ir":"planos"}]'::jsonb);
