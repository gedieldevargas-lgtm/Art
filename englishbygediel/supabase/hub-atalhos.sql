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
