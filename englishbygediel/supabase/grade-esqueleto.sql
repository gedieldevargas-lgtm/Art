-- englishbygediel · GRADE INICIAL — módulos e aulas (títulos), com cronograma
-- Rode DEPOIS do aulas.sql. Pode rodar mais de uma vez (não duplica: só insere se a tabela estiver vazia).
-- Cronograma: 2 aulas/semana (segunda e quinta, 9h), começando em 16/11/2026, na ordem abaixo.

do $$
declare
  m uuid; base date := date '2026-11-16';
begin
  if exists (select 1 from public.mi_modules) then
    raise notice 'mi_modules já tem dados — nada foi inserido.';
    return;
  end if;

  -- helper inline: cada aula recebe release = base + (n/2)*7 + (n%2)*3 dias, às 9h (UTC-3 = 12h UTC)
  -- Módulo 1 · Orientação
  insert into public.mi_modules (ord,name,sub,emoji) values (1,'Orientação','3 aulas · Comece aqui','🌟') returning id into m;
  insert into public.mi_lessons (module_id,ord,title,release_at) values
    (m,1,'Bem-vindo ao Método Inteligente', (base + (0/2)*7 + (0%2)*3)::timestamp + interval '12 hours'),
    (m,2,'Como usar a plataforma',          (base + (1/2)*7 + (1%2)*3)::timestamp + interval '12 hours'),
    (m,3,'Sua rotina de estudo que funciona',(base + (2/2)*7 + (2%2)*3)::timestamp + interval '12 hours');

  -- Módulo 2 · Diagnóstico & Personalização
  insert into public.mi_modules (ord,name,sub,emoji) values (2,'Diagnóstico & Personalização','3 aulas · Prisma + Bússola','🎯') returning id into m;
  insert into public.mi_lessons (module_id,ord,title,release_at) values
    (m,1,'Entendendo o seu Prisma de Talentos',(base + (3/2)*7 + (3%2)*3)::timestamp + interval '12 hours'),
    (m,2,'Seu nível CEFR e o que ele significa',(base + (4/2)*7 + (4%2)*3)::timestamp + interval '12 hours'),
    (m,3,'Montando o seu plano personalizado', (base + (5/2)*7 + (5%2)*3)::timestamp + interval '12 hours');

  -- Módulo 3 · Sons & Pronúncia
  insert into public.mi_modules (ord,name,sub,emoji) values (3,'Sons & Pronúncia','8 aulas · A1–B1','🔊') returning id into m;
  insert into public.mi_lessons (module_id,ord,title,release_at) values
    (m,1,'Os sons do inglês que não existem em português',(base + (6/2)*7 + (6%2)*3)::timestamp + interval '12 hours'),
    (m,2,'TH, R e L — os três vilões',                    (base + (7/2)*7 + (7%2)*3)::timestamp + interval '12 hours'),
    (m,3,'Vogais curtas, longas e ditongos',              (base + (8/2)*7 + (8%2)*3)::timestamp + interval '12 hours'),
    (m,4,'Word stress — a sílaba forte muda tudo',        (base + (9/2)*7 + (9%2)*3)::timestamp + interval '12 hours'),
    (m,5,'Ritmo da frase (sentence stress)',              (base + (10/2)*7 + (10%2)*3)::timestamp + interval '12 hours'),
    (m,6,'Connected speech — por que o nativo "come" palavras',(base + (11/2)*7 + (11%2)*3)::timestamp + interval '12 hours'),
    (m,7,'Entonação — perguntas, emoção e intenção',      (base + (12/2)*7 + (12%2)*3)::timestamp + interval '12 hours'),
    (m,8,'Shadowing — a técnica completa',                (base + (13/2)*7 + (13%2)*3)::timestamp + interval '12 hours');

  -- Módulo 4 · Vocabulário Essencial
  insert into public.mi_modules (ord,name,sub,emoji) values (4,'Vocabulário Essencial','8 aulas · A1–A2','📗') returning id into m;
  insert into public.mi_lessons (module_id,ord,title,release_at) values
    (m,1,'As 100 palavras que resolvem metade das conversas',(base + (14/2)*7 + (14%2)*3)::timestamp + interval '12 hours'),
    (m,2,'Cumprimentos, apresentações e small talk',      (base + (15/2)*7 + (15%2)*3)::timestamp + interval '12 hours'),
    (m,3,'Números, datas, horas e preços',                (base + (16/2)*7 + (16%2)*3)::timestamp + interval '12 hours'),
    (m,4,'Família, casa e rotina diária',                 (base + (17/2)*7 + (17%2)*3)::timestamp + interval '12 hours'),
    (m,5,'Comida, restaurante e mercado',                 (base + (18/2)*7 + (18%2)*3)::timestamp + interval '12 hours'),
    (m,6,'Cidade, transporte e direções',                 (base + (19/2)*7 + (19%2)*3)::timestamp + interval '12 hours'),
    (m,7,'Trabalho, estudo e profissões',                 (base + (20/2)*7 + (20%2)*3)::timestamp + interval '12 hours'),
    (m,8,'Sentimentos, opiniões e reações',               (base + (21/2)*7 + (21%2)*3)::timestamp + interval '12 hours');

  -- Módulo 5 · Gramática A1
  insert into public.mi_modules (ord,name,sub,emoji) values (5,'Gramática A1','8 aulas · A1','📘') returning id into m;
  insert into public.mi_lessons (module_id,ord,title,release_at) values
    (m,1,'Verb to be — a base de tudo',                   (base + (22/2)*7 + (22%2)*3)::timestamp + interval '12 hours'),
    (m,2,'Present Simple — rotinas e verdades',           (base + (23/2)*7 + (23%2)*3)::timestamp + interval '12 hours'),
    (m,3,'Present Continuous — o agora',                  (base + (24/2)*7 + (24%2)*3)::timestamp + interval '12 hours'),
    (m,4,'Artigos: a, an, the',                           (base + (25/2)*7 + (25%2)*3)::timestamp + interval '12 hours'),
    (m,5,'Plural, this/that, there is/are',               (base + (26/2)*7 + (26%2)*3)::timestamp + interval '12 hours'),
    (m,6,'Can, can''t e pedidos educados',                (base + (27/2)*7 + (27%2)*3)::timestamp + interval '12 hours'),
    (m,7,'Possessivos e pronomes objeto',                 (base + (28/2)*7 + (28%2)*3)::timestamp + interval '12 hours'),
    (m,8,'Perguntas com WH (what, where, when, who, why, how)',(base + (29/2)*7 + (29%2)*3)::timestamp + interval '12 hours');

  -- Módulo 6 · Gramática A2–B1
  insert into public.mi_modules (ord,name,sub,emoji) values (6,'Gramática A2–B1','8 aulas · A2–B1','📙') returning id into m;
  insert into public.mi_lessons (module_id,ord,title,release_at) values
    (m,1,'Past Simple — regulares e irregulares',         (base + (30/2)*7 + (30%2)*3)::timestamp + interval '12 hours'),
    (m,2,'Past Continuous e interrupções',                (base + (31/2)*7 + (31%2)*3)::timestamp + interval '12 hours'),
    (m,3,'Futuro: will x going to',                       (base + (32/2)*7 + (32%2)*3)::timestamp + interval '12 hours'),
    (m,4,'Present Perfect sem medo',                      (base + (33/2)*7 + (33%2)*3)::timestamp + interval '12 hours'),
    (m,5,'Comparativos e superlativos',                   (base + (34/2)*7 + (34%2)*3)::timestamp + interval '12 hours'),
    (m,6,'Modais: should, must, have to, might',          (base + (35/2)*7 + (35%2)*3)::timestamp + interval '12 hours'),
    (m,7,'Condicionais 0 e 1 (if...)',                    (base + (36/2)*7 + (36%2)*3)::timestamp + interval '12 hours'),
    (m,8,'Conectores: because, so, although, however',    (base + (37/2)*7 + (37%2)*3)::timestamp + interval '12 hours');

  -- Módulo 7 · Conversação A1–A2
  insert into public.mi_modules (ord,name,sub,emoji) values (7,'Conversação A1–A2','5 aulas','🗣️') returning id into m;
  insert into public.mi_lessons (module_id,ord,title,release_at) values
    (m,1,'Sobrevivência: as 30 frases que destravam',     (base + (38/2)*7 + (38%2)*3)::timestamp + interval '12 hours'),
    (m,2,'Pedindo informação e ajuda',                    (base + (39/2)*7 + (39%2)*3)::timestamp + interval '12 hours'),
    (m,3,'Falando de você: vida, gostos e planos',        (base + (40/2)*7 + (40%2)*3)::timestamp + interval '12 hours'),
    (m,4,'Ao telefone e em vídeo chamada',                (base + (41/2)*7 + (41%2)*3)::timestamp + interval '12 hours'),
    (m,5,'Simulação completa: um dia em viagem',          (base + (42/2)*7 + (42%2)*3)::timestamp + interval '12 hours');

  -- Módulo 8 · Conversação B1
  insert into public.mi_modules (ord,name,sub,emoji) values (8,'Conversação B1','4 aulas · B1','💬') returning id into m;
  insert into public.mi_lessons (module_id,ord,title,release_at) values
    (m,1,'Contando histórias (storytelling pessoal)',     (base + (43/2)*7 + (43%2)*3)::timestamp + interval '12 hours'),
    (m,2,'Dando opinião e discordando com educação',      (base + (44/2)*7 + (44%2)*3)::timestamp + interval '12 hours'),
    (m,3,'Conversas profundas: fé, propósito e valores',  (base + (45/2)*7 + (45%2)*3)::timestamp + interval '12 hours'),
    (m,4,'Fluência sob pressão: entrevistas e imprevistos',(base + (46/2)*7 + (46%2)*3)::timestamp + interval '12 hours');

  -- Módulo 9 · Listening & Compreensão
  insert into public.mi_modules (ord,name,sub,emoji) values (9,'Listening & Compreensão','5 aulas · A2–B1','🎧') returning id into m;
  insert into public.mi_lessons (module_id,ord,title,release_at) values
    (m,1,'Por que você não entende o que ouve (e como mudar)',(base + (47/2)*7 + (47%2)*3)::timestamp + interval '12 hours'),
    (m,2,'Treino com músicas',                            (base + (48/2)*7 + (48%2)*3)::timestamp + interval '12 hours'),
    (m,3,'Treino com séries e filmes',                    (base + (49/2)*7 + (49%2)*3)::timestamp + interval '12 hours'),
    (m,4,'Treino com podcasts e velocidade real',         (base + (50/2)*7 + (50%2)*3)::timestamp + interval '12 hours'),
    (m,5,'Sotaques: americano, britânico e outros',       (base + (51/2)*7 + (51%2)*3)::timestamp + interval '12 hours');

  -- Módulo 10 · Phrasal Verbs
  insert into public.mi_modules (ord,name,sub,emoji) values (10,'Phrasal Verbs','6 aulas · B1','🧩') returning id into m;
  insert into public.mi_lessons (module_id,ord,title,release_at) values
    (m,1,'O que são phrasal verbs e como aprender sem decorar',(base + (52/2)*7 + (52%2)*3)::timestamp + interval '12 hours'),
    (m,2,'Rotina: get up, wake up, work out...',          (base + (53/2)*7 + (53%2)*3)::timestamp + interval '12 hours'),
    (m,3,'Relacionamentos: get along, break up, hang out...',(base + (54/2)*7 + (54%2)*3)::timestamp + interval '12 hours'),
    (m,4,'Trabalho: set up, carry out, put off...',       (base + (55/2)*7 + (55%2)*3)::timestamp + interval '12 hours'),
    (m,5,'Separáveis x inseparáveis',                     (base + (56/2)*7 + (56%2)*3)::timestamp + interval '12 hours'),
    (m,6,'Os 25 phrasal verbs mais usados — revisão geral',(base + (57/2)*7 + (57%2)*3)::timestamp + interval '12 hours');

  -- Módulo 11 · Idioms & Expressões
  insert into public.mi_modules (ord,name,sub,emoji) values (11,'Idioms & Expressões','5 aulas · B1–B2','💡') returning id into m;
  insert into public.mi_lessons (module_id,ord,title,release_at) values
    (m,1,'Expressões do dia a dia que todo nativo usa',   (base + (58/2)*7 + (58%2)*3)::timestamp + interval '12 hours'),
    (m,2,'Idioms de trabalho e dinheiro',                 (base + (59/2)*7 + (59%2)*3)::timestamp + interval '12 hours'),
    (m,3,'Idioms de sentimentos e relacionamentos',       (base + (60/2)*7 + (60%2)*3)::timestamp + interval '12 hours'),
    (m,4,'Gírias atuais (e as que você deve evitar)',     (base + (61/2)*7 + (61%2)*3)::timestamp + interval '12 hours'),
    (m,5,'Provérbios e expressões bíblicas no inglês',    (base + (62/2)*7 + (62%2)*3)::timestamp + interval '12 hours');

  -- Módulo 12 · Inglês pela Música
  insert into public.mi_modules (ord,name,sub,emoji) values (12,'Inglês pela Música','4 aulas · Todos os níveis','🎵') returning id into m;
  insert into public.mi_lessons (module_id,ord,title,release_at) values
    (m,1,'O método de estudar com música (sem só cantar junto)',(base + (63/2)*7 + (63%2)*3)::timestamp + interval '12 hours'),
    (m,2,'Treino de pronúncia com música',                (base + (64/2)*7 + (64%2)*3)::timestamp + interval '12 hours'),
    (m,3,'Gramática escondida nas letras',                (base + (65/2)*7 + (65%2)*3)::timestamp + interval '12 hours'),
    (m,4,'Worship em inglês: vocabulário de adoração',    (base + (66/2)*7 + (66%2)*3)::timestamp + interval '12 hours');

  -- Módulo 13 · Inglês por Séries
  insert into public.mi_modules (ord,name,sub,emoji) values (13,'Inglês por Séries','4 aulas · A2–B2','🎬') returning id into m;
  insert into public.mi_lessons (module_id,ord,title,release_at) values
    (m,1,'O método de estudar com séries (legendas do jeito certo)',(base + (67/2)*7 + (67%2)*3)::timestamp + interval '12 hours'),
    (m,2,'Técnica da cena repetida',                      (base + (68/2)*7 + (68%2)*3)::timestamp + interval '12 hours'),
    (m,3,'Anotando vocabulário sem travar o episódio',    (base + (69/2)*7 + (69%2)*3)::timestamp + interval '12 hours'),
    (m,4,'Do entendimento passivo à fala ativa',          (base + (70/2)*7 + (70%2)*3)::timestamp + interval '12 hours');

  -- Módulo 14 · Business English
  insert into public.mi_modules (ord,name,sub,emoji) values (14,'Business English','5 aulas · B1–B2','💼') returning id into m;
  insert into public.mi_lessons (module_id,ord,title,release_at) values
    (m,1,'Reuniões: participar, opinar e conduzir',       (base + (71/2)*7 + (71%2)*3)::timestamp + interval '12 hours'),
    (m,2,'E-mails profissionais que funcionam',           (base + (72/2)*7 + (72%2)*3)::timestamp + interval '12 hours'),
    (m,3,'Apresentações e pitch em inglês',               (base + (73/2)*7 + (73%2)*3)::timestamp + interval '12 hours'),
    (m,4,'Entrevista de emprego em inglês',               (base + (74/2)*7 + (74%2)*3)::timestamp + interval '12 hours'),
    (m,5,'Negociação e networking',                       (base + (75/2)*7 + (75%2)*3)::timestamp + interval '12 hours');

  -- Módulo 15 · Escrita em Inglês
  insert into public.mi_modules (ord,name,sub,emoji) values (15,'Escrita em Inglês','3 aulas · A2–B2','✏️') returning id into m;
  insert into public.mi_lessons (module_id,ord,title,release_at) values
    (m,1,'Mensagens e redes sociais sem vergonha',        (base + (76/2)*7 + (76%2)*3)::timestamp + interval '12 hours'),
    (m,2,'Textos claros: parágrafos, conectores e revisão',(base + (77/2)*7 + (77%2)*3)::timestamp + interval '12 hours'),
    (m,3,'Usando IA pra revisar (sem depender dela)',     (base + (78/2)*7 + (78%2)*3)::timestamp + interval '12 hours');

  raise notice 'Grade criada: 15 módulos, 79 aulas, liberação 2x/semana a partir de 16/11/2026.';
end $$;
