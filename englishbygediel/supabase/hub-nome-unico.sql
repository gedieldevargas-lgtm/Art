-- UM NOME SÓ PARA O PROGRAMA: "Programa Inteligente" (projeto do HUB, iwivldvubmsqyzkkdxoy). Cole no SQL Editor e clique Run.
-- OPCIONAL. Hoje o mesmo produto aparece como Mentoria, Programa, Plano Inteligente, Programa em Grupo e Método Inteligente.
-- Isto troca só os textos do Hub (títulos, botão e card). Se preferir outro nome, troque "Programa Inteligente" abaixo antes de rodar.
update site_config set dados =
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(dados,
    '{secoes,membros}', '"Dentro do Programa Inteligente"'::jsonb),
    '{destaque,titulo}', '"Programa Inteligente"'::jsonb),
    '{mentoria,titulo}', '"Programa Inteligente"'::jsonb),
    '{mentoria,botaoAplicar}', '"Aplicar pro Programa"'::jsonb),
    '{topo,bio}', to_jsonb(replace(coalesce(dados->'topo'->>'bio', ''), 'a porta pra mentoria', 'a porta pro Programa Inteligente'))),
    '{atalhos}', (select jsonb_agg(case when a->>'titulo' = 'Mentoria' then a || '{"titulo":"Programa"}'::jsonb else a end order by o)
                  from jsonb_array_elements(dados->'atalhos') with ordinality as t(a, o)))
where id = 'hub';
-- o card do produto na Kiwify
update site_config set dados = jsonb_set(dados, '{cards}', (
  select jsonb_agg(case when c->>'titulo' = 'Método Inteligente — Programa em Grupo' then c || '{"titulo":"Programa Inteligente (em grupo)"}'::jsonb else c end order by o)
  from jsonb_array_elements(dados->'cards') with ordinality as t(c, o)))
where id = 'hub';
