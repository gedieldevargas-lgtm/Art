-- QUIZ DO MODO FÉ no Hub (projeto do HUB, iwivldvubmsqyzkkdxoy). Cole no SQL Editor e clique Run. Pode rodar mais de uma vez.
-- Põe o card "Entrar no Modo Fé" (quiz grátis) como PRIMEIRO card dos materiais grátis. Ele aparece pra quem liga o Modo Fé.
update site_config set dados = jsonb_set(dados, '{cards}',
  '[{"id":"quizfe","tipo":"gratis","ativo":true,"titulo":"Entrar no Modo Fé","linha":"Quiz grátis: descubra seu caminho no inglês com a Bíblia","nome":"","setor":"Testes","img":"img/modo-fe.webp","preco":"","link":"https://claude.ai/artifact/QQ5ATUBNT2uAo97TnJcdCS","botao":"Descobrir meu caminho no Modo Fé","link2":"","botao2":"","video":"","sinopse":"Responda algumas perguntas sobre sua jornada de fé e inglês. O quiz entende onde você está e mostra o caminho certo no English On Mission.","meta":"Quiz gratuito, Inglês com a Bíblia","modos":["fe"]}]'::jsonb
  || (dados->'cards'))
where id = 'hub' and not ((dados->'cards') @> '[{"id":"quizfe"}]'::jsonb);
