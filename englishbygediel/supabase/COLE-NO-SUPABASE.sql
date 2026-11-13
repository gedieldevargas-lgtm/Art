-- ══════════════════════════════════════════════════════════════════
-- ARQUIVO ÚNICO — cole TUDO no Supabase (SQL Editor → New query → Run)
-- Parte 1: estrutura (tabelas, regras, capas, dúvidas)  ·  Parte 2: grade completa das aulas
-- Pode rodar mais de uma vez sem duplicar nada.
-- ══════════════════════════════════════════════════════════════════

-- englishbygediel · ÁREA DE MEMBROS — módulos, aulas, quiz, comentários, reações e votos
-- Projeto Supabase da área de membros (jzdxcefnlwjgimymgsux).
-- Cole tudo no Supabase: SQL Editor → New query → Run. Pode rodar mais de uma vez.

-- 1. Quem é admin -------------------------------------------------------------
create table if not exists public.admins (email text primary key);
insert into public.admins (email) values ('gedieldevargas@gmail.com'), ('vargasgediel@gmail.com') on conflict do nothing;
alter table public.admins enable row level security;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where lower(email) = lower(auth.jwt() ->> 'email'));
$$;

drop policy if exists "admin le admins" on public.admins;
create policy "admin le admins" on public.admins for select to authenticated using (public.is_admin());

-- 2. Módulos ------------------------------------------------------------------
create table if not exists public.mi_modules (
  id         uuid primary key default gen_random_uuid(),
  ord        int  not null default 0,
  name       text not null check (char_length(name) <= 80),
  sub        text check (sub is null or char_length(sub) <= 80),
  emoji      text check (emoji is null or char_length(emoji) <= 8),
  cover_url  text check (cover_url is null or char_length(cover_url) <= 500),
  created_at timestamptz not null default now()
);
alter table public.mi_modules enable row level security;
drop policy if exists "alunos leem modulos" on public.mi_modules;
create policy "alunos leem modulos" on public.mi_modules for select to authenticated using (true);
drop policy if exists "admin edita modulos" on public.mi_modules;
create policy "admin edita modulos" on public.mi_modules for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 3. Aulas --------------------------------------------------------------------
-- quiz: lista de 5 itens {"q":"pergunta","a":["alt1","alt2","alt3","alt4"],"c":0}  (c = índice da correta)
create table if not exists public.mi_lessons (
  id          uuid primary key default gen_random_uuid(),
  module_id   uuid not null references public.mi_modules(id) on delete cascade,
  ord         int  not null default 0,
  title       text not null check (char_length(title) <= 120),
  description text check (description is null or char_length(description) <= 4000),
  youtube_url text check (youtube_url is null or char_length(youtube_url) <= 300),
  cover_url   text check (cover_url is null or char_length(cover_url) <= 500),
  published   boolean not null default false,
  quiz        jsonb not null default '[]'::jsonb,
  created_at  timestamptz not null default now()
);
-- release_at: data em que a aula libera pro aluno (null = libera assim que publicada)
alter table public.mi_lessons add column if not exists release_at timestamptz;
create index if not exists mi_lessons_module_idx on public.mi_lessons (module_id, ord);
alter table public.mi_lessons enable row level security;
drop policy if exists "alunos leem aulas" on public.mi_lessons;
create policy "alunos leem aulas" on public.mi_lessons for select to authenticated using (true);
drop policy if exists "admin edita aulas" on public.mi_lessons;
create policy "admin edita aulas" on public.mi_lessons for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 4. Votos "estou esperando essa aula" ----------------------------------------
create table if not exists public.mi_lesson_votes (
  lesson_id  uuid not null references public.mi_lessons(id) on delete cascade,
  user_id    uuid not null default auth.uid(),
  created_at timestamptz not null default now(),
  primary key (lesson_id, user_id)
);
alter table public.mi_lesson_votes enable row level security;
drop policy if exists "todos leem votos" on public.mi_lesson_votes;
create policy "todos leem votos" on public.mi_lesson_votes for select to authenticated using (true);
drop policy if exists "aluno vota" on public.mi_lesson_votes;
create policy "aluno vota" on public.mi_lesson_votes for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "aluno tira voto" on public.mi_lesson_votes;
create policy "aluno tira voto" on public.mi_lesson_votes for delete to authenticated using (user_id = auth.uid());

-- 5. Reações com emoji (uma por aluno por aula) -------------------------------
create table if not exists public.mi_lesson_reactions (
  lesson_id  uuid not null references public.mi_lessons(id) on delete cascade,
  user_id    uuid not null default auth.uid(),
  emoji      text not null check (char_length(emoji) <= 8),
  created_at timestamptz not null default now(),
  primary key (lesson_id, user_id)
);
alter table public.mi_lesson_reactions enable row level security;
drop policy if exists "todos leem reacoes" on public.mi_lesson_reactions;
create policy "todos leem reacoes" on public.mi_lesson_reactions for select to authenticated using (true);
drop policy if exists "aluno reage" on public.mi_lesson_reactions;
create policy "aluno reage" on public.mi_lesson_reactions for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "aluno troca reacao" on public.mi_lesson_reactions;
create policy "aluno troca reacao" on public.mi_lesson_reactions for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "aluno tira reacao" on public.mi_lesson_reactions;
create policy "aluno tira reacao" on public.mi_lesson_reactions for delete to authenticated using (user_id = auth.uid());

-- 6. Comentários --------------------------------------------------------------
create table if not exists public.mi_lesson_comments (
  id         bigint generated always as identity primary key,
  lesson_id  uuid not null references public.mi_lessons(id) on delete cascade,
  user_id    uuid not null default auth.uid(),
  user_name  text not null check (char_length(user_name) <= 80),
  body       text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index if not exists mi_comments_lesson_idx on public.mi_lesson_comments (lesson_id, created_at);
-- selo de professor: só quem é admin consegue gravar true
alter table public.mi_lesson_comments add column if not exists is_admin boolean not null default false;
alter table public.mi_lesson_comments enable row level security;
drop policy if exists "todos leem comentarios" on public.mi_lesson_comments;
create policy "todos leem comentarios" on public.mi_lesson_comments for select to authenticated using (true);
drop policy if exists "aluno comenta" on public.mi_lesson_comments;
create policy "aluno comenta" on public.mi_lesson_comments for insert to authenticated with check (user_id = auth.uid() and (is_admin = false or public.is_admin()));
drop policy if exists "aluno ou admin apaga comentario" on public.mi_lesson_comments;
create policy "aluno ou admin apaga comentario" on public.mi_lesson_comments for delete to authenticated using (user_id = auth.uid() or public.is_admin());

-- 7. Resultado do quiz (última tentativa de cada aluno) -----------------------
create table if not exists public.mi_quiz_results (
  lesson_id  uuid not null references public.mi_lessons(id) on delete cascade,
  user_id    uuid not null default auth.uid(),
  score      int  not null check (score between 0 and 10),
  total      int  not null check (total between 1 and 10),
  created_at timestamptz not null default now(),
  primary key (lesson_id, user_id)
);
alter table public.mi_quiz_results enable row level security;
drop policy if exists "aluno le proprio resultado" on public.mi_quiz_results;
create policy "aluno le proprio resultado" on public.mi_quiz_results for select to authenticated using (user_id = auth.uid() or public.is_admin());
drop policy if exists "aluno salva resultado" on public.mi_quiz_results;
create policy "aluno salva resultado" on public.mi_quiz_results for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "aluno atualiza resultado" on public.mi_quiz_results;
create policy "aluno atualiza resultado" on public.mi_quiz_results for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- 8b. Dúvidas dos alunos para o professor --------------------------------------
create table if not exists public.mi_questions (
  id          bigint generated always as identity primary key,
  user_id     uuid not null default auth.uid(),
  user_name   text not null check (char_length(user_name) <= 80),
  user_email  text check (user_email is null or char_length(user_email) <= 160),
  body        text not null check (char_length(body) between 1 and 2000),
  answer      text check (answer is null or char_length(answer) <= 4000),
  answered_at timestamptz,
  created_at  timestamptz not null default now()
);
alter table public.mi_questions enable row level security;
drop policy if exists "aluno le proprias duvidas" on public.mi_questions;
create policy "aluno le proprias duvidas" on public.mi_questions for select to authenticated using (user_id = auth.uid() or public.is_admin());
drop policy if exists "aluno envia duvida" on public.mi_questions;
create policy "aluno envia duvida" on public.mi_questions for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "admin responde duvida" on public.mi_questions;
create policy "admin responde duvida" on public.mi_questions for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin apaga duvida" on public.mi_questions;
create policy "admin apaga duvida" on public.mi_questions for delete to authenticated using (public.is_admin());

-- 9. Mini cursos avulsos: módulo fora do Programa, liberado por produto -------
alter table public.mi_modules add column if not exists trilha   text not null default 'programa';
alter table public.mi_modules add column if not exists produto  text;   -- trecho do nome do produto na Kiwify que libera
alter table public.mi_modules add column if not exists checkout text;   -- link de compra pra quem não tem

-- 10. Universos (English On Mission, Culture, Viagens): cards editáveis no admin
-- acao: link | whatsapp | area (abre uma área do app: jogos, materiais, devocionais...) | curso (abre um mini curso = módulo)
create table if not exists public.mi_uni_cards (
  id         uuid primary key default gen_random_uuid(),
  universo   text not null check (universo in ('eom','culture','viagens')),
  ord        int  not null default 0,
  secao      text check (secao is null or char_length(secao) <= 60),
  titulo     text not null check (char_length(titulo) <= 120),
  descricao  text check (descricao is null or char_length(descricao) <= 400),
  tag        text check (tag is null or char_length(tag) <= 40),
  capa_url   text check (capa_url is null or char_length(capa_url) <= 500),
  emoji      text check (emoji is null or char_length(emoji) <= 8),
  acao       text not null default 'link' check (acao in ('link','whatsapp','area','curso')),
  valor      text check (valor is null or char_length(valor) <= 1000),
  destaque   boolean not null default false,  -- vira o banner grande do topo
  em_breve   boolean not null default false,
  ativo      boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists mi_uni_cards_idx on public.mi_uni_cards (universo, ord);
alter table public.mi_uni_cards enable row level security;
drop policy if exists "alunos leem universos" on public.mi_uni_cards;
create policy "alunos leem universos" on public.mi_uni_cards for select to authenticated using (true);
drop policy if exists "admin edita universos" on public.mi_uni_cards;
create policy "admin edita universos" on public.mi_uni_cards for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- cards iniciais (só entram se a tabela estiver vazia; depois disso tudo é pelo admin)
insert into public.mi_uni_cards (universo,ord,secao,titulo,descricao,tag,capa_url,emoji,acao,valor,destaque,em_breve)
select * from (values
 ('eom',1,null,$t$Devocional ao vivo todo sábado, 9h$t$,$t$Um versículo e um ponto do inglês de cada vez, com gente do Brasil inteiro na tela.$t$,null,null,'🙏','link','https://youtube.com/live/QmDQciTioJI?feature=share',true,false),
 ('eom',2,'Assistir',$t$Devocionais$t$,$t$Todos os devocionais gravados, pra ver e rever.$t$,'Assinatura','img/card-devocionais.webp',null,'area','devocionais',false,false),
 ('eom',3,'Assistir',$t$Inglês bíblico na prática$t$,$t$A playlist do YouTube com o inglês da Bíblia aplicado no dia a dia.$t$,'YouTube','img/card-eom-lives.webp',null,'link','',false,false),
 ('eom',4,'Assistir',$t$Aulas · Inglês com a Bíblia$t$,$t$Inglês estudando as cartas da Bíblia, do verb to be às cartas de João.$t$,'Em breve','img/card-aulas.webp',null,'curso','',false,true),
 ('eom',5,'Bíblias, livros e materiais',$t$Bíblia bilíngue NVI/NIV$t$,$t$Leia em português e inglês e compare as duas traduções.$t$,'Indicação','img/achados/2.webp',null,'link','https://meli.la/28NzfyU',false,false),
 ('eom',6,'Bíblias, livros e materiais',$t$The Five Minute Journal$t$,$t$Diário guiado pra praticar a escrita em inglês em poucos minutos.$t$,'Indicação','img/achados/1.webp',null,'link','https://link.amazon/B0cYbg3Hr',false,false),
 ('eom',7,'Bíblias, livros e materiais',$t$Meus materiais$t$,$t$Os PDFs e e-books que você já tem liberados.$t$,'No app',null,'📦','area','materiais',false,false),
 ('eom',8,'Comunidade',$t$Grupo do WhatsApp$t$,$t$O grupo gratuito do English On Mission, pra praticar e caminhar junto.$t$,'Grátis','img/logo-eom.webp',null,'whatsapp',$t$Oi Gediel! Quero entrar no grupo gratuito do English On Mission.$t$,false,false),
 ('eom',9,'Comunidade',$t$Jogos$t$,$t$Treine vocabulário e frases jogando.$t$,'No app',null,'🎮','area','jogos',false,false),
 ('eom',10,'Comunidade',$t$Assinar o English On Mission$t$,$t$Devocionais ao vivo, aulas com a Bíblia, e-book e Bíblia linear de 1, 2 e 3 João.$t$,'R$ 25/mês',null,'✨','link','https://pay.kiwify.com.br/oIjfTK8',false,false),

 ('culture',1,null,$t$Lives do Culture English$t$,$t$Inglês real a partir de séries, filmes e música, ao vivo com o Gediel.$t$,null,null,'🎬','whatsapp',$t$Oi Gediel! Quero receber o link das lives do Culture English.$t$,true,false),
 ('culture',2,'Mini cursos',$t$Inglês com Séries$t$,$t$Aprender com o que você já gosta de assistir, entendendo como as pessoas falam de verdade.$t$,'Mini curso','img/card-series.webp',null,'curso','',false,true),
 ('culture',3,'Mini cursos',$t$Inglês com Filmes$t$,$t$Cenas de filme como aula: expressões, sotaques e o inglês que não está no livro.$t$,'Mini curso','img/card-filmes.webp',null,'curso','',false,true),
 ('culture',4,'Mini cursos',$t$Inglês com Música$t$,$t$Letra, pronúncia e ritmo: o ouvido treina enquanto você canta.$t$,'Mini curso','img/card-musica.webp',null,'curso','',false,true),
 ('culture',5,'E-books e templates',$t$Guia A1 até B2$t$,$t$Um mapa claro do A1 ao B2, com planos semanais de 30 a 60 minutos.$t$,'R$ 27','img/capa-guia.webp',null,'link','https://guia-a1-b2.netlify.app/',false,false),
 ('culture',6,'E-books e templates',$t$Kit Frases$t$,$t$As frases das situações essenciais do dia a dia, prontas pra usar.$t$,'Em breve','img/capa-frases.webp',null,'link','',false,true),
 ('culture',7,'E-books e templates',$t$Central de Prompts$t$,$t$50 prompts grátis pra conversar, simular entrevistas e praticar com IA.$t$,'Grátis','img/capa-prompts.webp',null,'area','prompts',false,false),
 ('culture',8,'Comunidade',$t$Grupo do WhatsApp$t$,$t$Dicas de séries, filmes e músicas pra praticar o inglês de verdade.$t$,'Grátis',null,'💬','whatsapp',$t$Oi Gediel! Quero entrar no grupo gratuito do Culture English.$t$,false,false),
 ('culture',9,'Comunidade',$t$Jogos$t$,$t$Treine vocabulário e frases jogando.$t$,'No app',null,'🎮','area','jogos',false,false),
 ('culture',10,'Comunidade',$t$English for Everyone: Grammar Guide$t$,$t$Guia visual de gramática pra consultar enquanto estuda.$t$,'Indicação','img/achados/0.webp',null,'link','https://amzn.to/4iyoaQO',false,false),

 ('viagens',1,null,$t$Me ajude a planejar minha viagem$t$,$t$Me conta o destino e a data. Eu te digo por onde começar e o que estudar antes de embarcar.$t$,null,null,'✈️','whatsapp',$t$Oi Gediel! Quero ajuda pra planejar minha viagem. Destino: ___ · Quando: ___ · Meu nível de inglês: ___$t$,true,false),
 ('viagens',2,'Intercâmbio',$t$Toronto 2027$t$,$t$O próximo intercâmbio da Infly. Garanta seu lugar no formulário.$t$,'Inscrições abertas','img/card-toronto.webp',null,'link','https://forms.gle/V2dDVBXotN1XUmS1A',false,false),
 ('viagens',3,'Intercâmbio',$t$Grupo de Toronto$t$,$t$O grupo de quem vai (ou quer ir) no intercâmbio de 2027.$t$,'WhatsApp',null,'🍁','whatsapp',$t$Oi Gediel! Quero entrar no grupo de Toronto 2027.$t$,false,false),
 ('viagens',4,'Pra se preparar',$t$Mini curso Inglês para Viagens$t$,$t$Aeroporto, hotel, restaurante e imprevisto: as situações que toda viagem traz.$t$,'Em breve','img/card-viagem-ingles.webp',null,'curso','',false,true),
 ('viagens',5,'Pra se preparar',$t$E-book Passaporte do Inglês$t$,$t$9 capítulos na ordem da viagem + Kit de Sobrevivência com as 20 frases que salvam.$t$,'R$ 27','img/capa-viagens.webp',null,'link','https://ebookviagens.netlify.app/',false,false),
 ('viagens',6,'Pra se preparar',$t$Seguro viagem$t$,$t$Consulte opções de seguro pras datas e o destino da sua viagem.$t$,'Indicação','img/achados/7.webp',null,'link','https://www.seguroviagem.srv.br/?ag=Us59wEJXEu',false,false),
 ('viagens',7,'Pra se preparar',$t$Organizador de mala de 7 peças$t$,$t$Separe roupas e acessórios em bolsas dentro da mala.$t$,'Indicação','img/achados/5.webp',null,'link','https://meli.la/1Lai5vf',false,false),
 ('viagens',8,'Assistir',$t$Vlogs Londres, Paris e Bruxelas$t$,$t$Três cidades, três sotaques e o caderno de viagem de 2024.$t$,'YouTube','img/card-europa.webp',null,'link','https://www.youtube.com/@oficialinfly/videos',false,false),
 ('viagens',9,'Assistir',$t$Vlogs New York 2025$t$,$t$Os bastidores da viagem a Nova York, com o inglês de rua ao vivo.$t$,'Em breve','img/card-vlog-ny.webp',null,'link','',false,true),
 ('viagens',10,'Assistir',$t$Jogos$t$,$t$Treine o inglês de viagem jogando.$t$,'No app',null,'🎮','area','jogos',false,false)
) as v(universo,ord,secao,titulo,descricao,tag,capa_url,emoji,acao,valor,destaque,em_breve)
where not exists (select 1 from public.mi_uni_cards);

-- 8. Pasta de capas (imagens públicas, só o admin envia) ----------------------
insert into storage.buckets (id, name, public) values ('capas', 'capas', true) on conflict (id) do nothing;
drop policy if exists "capas publicas" on storage.objects;
create policy "capas publicas" on storage.objects for select to anon, authenticated using (bucket_id = 'capas');
drop policy if exists "admin envia capas" on storage.objects;
create policy "admin envia capas" on storage.objects for insert to authenticated with check (bucket_id = 'capas' and public.is_admin());
drop policy if exists "admin troca capas" on storage.objects;
create policy "admin troca capas" on storage.objects for update to authenticated using (bucket_id = 'capas' and public.is_admin());
drop policy if exists "admin apaga capas" on storage.objects;
create policy "admin apaga capas" on storage.objects for delete to authenticated using (bucket_id = 'capas' and public.is_admin());


-- GRADE COMPLETA — 15 módulos, aulas com descrição, objetivo e quiz de 5 perguntas.
-- Liberação: 2 aulas por semana (segunda e quinta, 9h) a partir de 16/11/2026.
-- Seguro pra rodar mais de uma vez: só preenche módulo que ainda NÃO tem aula.

do $blk$
declare m uuid;
begin
  select id into m from public.mi_modules where name = $t$Orientação$t$ order by created_at limit 1;
  if m is null then insert into public.mi_modules (ord,name,sub,emoji) values (1,$t$Orientação$t$,$t$3 aulas · Comece aqui$t$,$t$🌟$t$) returning id into m;
  else update public.mi_modules set ord=1, sub=$t$3 aulas · Comece aqui$t$, emoji=$t$🌟$t$ where id=m; end if;
  if not exists (select 1 from public.mi_lessons where module_id = m) then
    insert into public.mi_lessons (module_id,ord,title,description,quiz,release_at,published) values
    (m,1,$t$Bem-vindo ao Método Inteligente$t$,$t$🎯 Objetivo: entender como o método funciona e dar o primeiro passo certo.

Aqui não tem curso engessado: a jornada é diagnóstico → rotina personalizada → prática diária em contexto real. Nessa aula eu te mostro por que decorar regra nunca te deixou fluente e o que a gente vai fazer de diferente.

✅ Depois da aula: faça o Prisma de Talentos e a Bússola CEFR no menu lateral.$t$,$q$[{"q": "Qual é a sequência da jornada aqui dentro?", "a": ["Gramática → prova → certificado", "Diagnóstico → rotina personalizada → prática diária", "Assistir tudo de uma vez", "Só aulas ao vivo"], "c": 1}, {"q": "O que o Prisma de Talentos mostra?", "a": ["Seu nível de inglês", "Seu perfil de inteligências (como você aprende melhor)", "Sua nota", "Seu vocabulário"], "c": 1}, {"q": "O que a Bússola CEFR mede?", "a": ["Sua memória", "Seu nível de inglês de A1 a C2", "Sua pronúncia só", "Sua escrita só"], "c": 1}, {"q": "Pro método, o motor da fluência é:", "a": ["Decorar listas", "Prática diária em contexto real", "Estudar só no fim de semana", "Tradução"], "c": 1}, {"q": "O que fazer logo depois desta aula?", "a": ["Esperar a próxima", "Fazer o Prisma e a Bússola", "Comprar material extra", "Nada"], "c": 1}]$q$::jsonb,'2026-11-16 12:00:00+00',true),
    (m,2,$t$Como usar a plataforma$t$,$t$🎯 Objetivo: dominar cada área da plataforma pra nunca se perder.

Tour completo: Módulos (2 aulas novas por semana), Maratona de Hoje (tarefas pro seu dia), Lives, Jogos, Materiais e seu perfil. Como funcionam os quizzes, os comentários, as reações e o botão de votar numa aula que ainda vai sair.

✅ Depois da aula: entre na Maratona de Hoje e complete 1 tarefa agora.$t$,$q$[{"q": "Quantas aulas novas liberam por semana?", "a": ["1", "2", "7", "Todas de uma vez"], "c": 1}, {"q": "Onde ficam as tarefas diárias?", "a": ["Módulos", "Maratona de Hoje", "Materiais", "Lives"], "c": 1}, {"q": "Numa aula que ainda não saiu você pode:", "a": ["Nada", "Votar 'estou esperando' e ver quantos esperam", "Baixar o vídeo", "Pedir reembolso"], "c": 1}, {"q": "Onde tirar dúvida de uma aula específica?", "a": ["Nos comentários da própria aula", "No Instagram", "Por carta", "Em nenhum lugar"], "c": 0}, {"q": "O quiz no fim da aula serve pra:", "a": ["Reprovar", "Fixar o conteúdo e medir o que ficou", "Dar certificado", "Nada"], "c": 1}]$q$::jsonb,'2026-11-19 12:00:00+00',true),
    (m,3,$t$Sua rotina de estudo que funciona$t$,$t$🎯 Objetivo: sair com um plano diário realista que você consegue manter.

A regra de ouro: 20 minutos por dia vencem 3 horas no domingo. Vou te mostrar como encaixar o inglês no SEU contexto — casa, transporte, trabalho, academia — usando a Maratona de Hoje como guia.

✅ Depois da aula: escolha 1 horário fixo e 1 contexto, e marque no calendário por 7 dias.$t$,$q$[{"q": "Qual rotina o método recomenda?", "a": ["3h no domingo", "20 minutos todo dia", "1h por mês", "Só quando der"], "c": 1}, {"q": "A rotina é montada com base em:", "a": ["No livro", "No seu perfil e no seu contexto de vida", "Na turma", "No professor"], "c": 1}, {"q": "O maior inimigo da fluência é:", "a": ["Idade", "Falta de constância", "Falta de talento", "Sotaque"], "c": 1}, {"q": "Contexto, na Maratona, é:", "a": ["Um tempo verbal", "O lugar/momento do dia em que você pratica", "Um nível", "Um jogo"], "c": 1}, {"q": "O desafio desta aula é:", "a": ["Estudar 3 horas hoje", "Fixar 1 horário e 1 contexto por 7 dias", "Decorar 100 palavras", "Pular pro módulo 5"], "c": 1}]$q$::jsonb,'2026-11-23 12:00:00+00',true);
  end if;
end $blk$;

do $blk$
declare m uuid;
begin
  select id into m from public.mi_modules where name = $t$Diagnóstico & Personalização$t$ order by created_at limit 1;
  if m is null then insert into public.mi_modules (ord,name,sub,emoji) values (2,$t$Diagnóstico & Personalização$t$,$t$3 aulas · Prisma + Bússola$t$,$t$🎯$t$) returning id into m;
  else update public.mi_modules set ord=2, sub=$t$3 aulas · Prisma + Bússola$t$, emoji=$t$🎯$t$ where id=m; end if;
  if not exists (select 1 from public.mi_lessons where module_id = m) then
    insert into public.mi_lessons (module_id,ord,title,description,quiz,release_at,published) values
    (m,1,$t$Entendendo o seu Prisma de Talentos$t$,$t$🎯 Objetivo: descobrir suas 2 inteligências mais fortes e o que isso muda no inglês.

As Inteligências Múltiplas de Gardner aplicadas ao idioma: linguística, lógica, musical, corporal, visual, interpessoal, intrapessoal e naturalista. Quem é musical aprende com shadowing e música; quem é interpessoal destrava conversando.

✅ Depois da aula: abra seu resultado do Prisma e anote suas 2 mais fortes.$t$,$q$[{"q": "Quem criou a teoria das Inteligências Múltiplas?", "a": ["Freud", "Howard Gardner", "Piaget", "Skinner"], "c": 1}, {"q": "Quantas inteligências o Prisma analisa?", "a": ["4", "6", "8", "10"], "c": 2}, {"q": "Perfil musical aprende melhor com:", "a": ["Listas escritas", "Música, ritmo e shadowing", "Provas", "Silêncio"], "c": 1}, {"q": "Inteligência intrapessoal é:", "a": ["Falar em grupo", "Autoconhecimento e reflexão", "Esporte", "Natureza"], "c": 1}, {"q": "O Prisma serve pra:", "a": ["Dar nota", "Orientar COMO você estuda cada habilidade", "Substituir estudo", "Decorar"], "c": 1}]$q$::jsonb,'2026-11-26 12:00:00+00',true),
    (m,2,$t$Seu nível CEFR e o que ele significa$t$,$t$🎯 Objetivo: saber exatamente onde você está (A1–C2) e qual a próxima meta real.

O que você já consegue fazer em cada nível — e por que 'básico/intermediário/avançado' sem critério não diz nada. Como ler seu resultado da Bússola sem se enganar pra mais nem pra menos.

✅ Depois da aula: escreva em 1 frase o que você quer conseguir FAZER no próximo nível.$t$,$q$[{"q": "CEFR significa:", "a": ["Curso Rápido de Fluência", "Quadro Europeu Comum de Referência", "Certificado de Inglês", "Teste Americano"], "c": 1}, {"q": "Quantos níveis tem o CEFR?", "a": ["3", "4", "6", "9"], "c": 2}, {"q": "Um A2 consegue:", "a": ["Palestrar", "Se virar em situações simples e rotineiras", "Escrever artigo científico", "Traduzir livros"], "c": 1}, {"q": "O nível 'independente' começa no:", "a": ["A1", "A2", "B1", "C2"], "c": 2}, {"q": "Meta realista é:", "a": ["A1 pra C1 em 1 mês", "Subir 1 nível com constância", "Nunca medir", "Refazer o teste toda semana"], "c": 1}]$q$::jsonb,'2026-11-30 12:00:00+00',true),
    (m,3,$t$Montando o seu plano personalizado$t$,$t$🎯 Objetivo: cruzar Prisma + Bússola + sua vida real e sair com uma trilha própria.

Mostro 4 planos de exemplo (perfil musical, lógico, interpessoal e corporal) e qual ordem de módulos faz sentido pra cada um. Você não precisa seguir a ordem padrão — precisa seguir a SUA.

✅ Depois da aula: escolha sua trilha e os 3 módulos de foco do seu primeiro ciclo.$t$,$q$[{"q": "O plano cruza:", "a": ["Só o nível", "Prisma + Bússola + seu contexto", "Idade e cidade", "Nada"], "c": 1}, {"q": "Perfil interpessoal prioriza:", "a": ["Escrita", "Conversação e lives", "Gramática pesada", "Leitura"], "c": 1}, {"q": "Precisa seguir a ordem dos módulos?", "a": ["Sempre", "Não — existe trilha por perfil", "Só A1", "Só C1"], "c": 1}, {"q": "Perfil corporal aprende melhor:", "a": ["Imóvel", "Em movimento (shadowing andando, gestos)", "Só lendo", "Só ouvindo"], "c": 1}, {"q": "Primeiro ciclo = quantos módulos de foco?", "a": ["Todos", "3", "1", "10"], "c": 1}]$q$::jsonb,'2026-12-03 12:00:00+00',true);
  end if;
end $blk$;

do $blk$
declare m uuid;
begin
  select id into m from public.mi_modules where name = $t$Sons & Pronúncia$t$ order by created_at limit 1;
  if m is null then insert into public.mi_modules (ord,name,sub,emoji) values (3,$t$Sons & Pronúncia$t$,$t$8 aulas · A1–B1$t$,$t$🔊$t$) returning id into m;
  else update public.mi_modules set ord=3, sub=$t$8 aulas · A1–B1$t$, emoji=$t$🔊$t$ where id=m; end if;
  if not exists (select 1 from public.mi_lessons where module_id = m) then
    insert into public.mi_lessons (module_id,ord,title,description,quiz,release_at,published) values
    (m,1,$t$Os sons do inglês que não existem em português$t$,$t$🎯 Objetivo: conhecer os sons que mais travam brasileiro e destravar os primeiros.

O inglês tem ~44 sons; o português, ~33. Nessa aula: o TH (think/this), o schwa /ə/ (a vogal mais comum do inglês) e as vogais curta x longa (ship x sheep) — com a posição da boca de cada um.

✅ Pratique: 5 min de espelho com think, this, the, that, three.$t$,$q$[{"q": "Quantos sons tem o inglês, aproximadamente?", "a": ["22", "33", "44", "60"], "c": 2}, {"q": "Qual som NÃO existe em português?", "a": ["/m/", "TH (/θ/, /ð/)", "/s/", "/p/"], "c": 1}, {"q": "O schwa /ə/ é:", "a": ["Som raro", "A vogal mais comum do inglês, fraca e neutra", "Uma consoante", "Só britânico"], "c": 1}, {"q": "Ship x sheep diferem:", "a": ["Na consoante", "Na duração/qualidade da vogal", "Na escrita só", "Em nada"], "c": 1}, {"q": "Melhor jeito de treinar som novo:", "a": ["Só ouvir", "Espelho + repetir vendo a posição da boca", "Ler regra", "Copiar 50x"], "c": 1}]$q$::jsonb,'2026-12-07 12:00:00+00',true),
    (m,2,$t$TH, R e L — os três vilões$t$,$t$🎯 Objetivo: pronunciar os três sons que mais entregam o sotaque brasileiro.

TH surdo (think) e sonoro (this); o R americano que não vibra; e o L final (feel, world) que brasileiro transforma em U. Pares mínimos e frases de treino na prática.

✅ Pratique 10x em voz alta: 'Three free trees' · 'I feel the world'.$t$,$q$[{"q": "TH de think x TH de this:", "a": ["Iguais", "Surdo x sonoro", "Um é escrito diferente", "Um não existe"], "c": 1}, {"q": "O R americano:", "a": ["Vibra como em 'carro'", "Não vibra — a língua curva sem tocar o céu da boca", "É mudo", "Vira L"], "c": 1}, {"q": "O erro clássico com feel:", "a": ["Falar fil", "Falar fiu (L final vira U)", "Falar fel", "Não tem erro"], "c": 1}, {"q": "Pares mínimos são:", "a": ["Sinônimos", "Palavras que mudam em 1 som (ship/sheep)", "Antônimos", "Plurais"], "c": 1}, {"q": "'Three free trees' treina:", "a": ["Vogais", "TH x F x TR", "Plural", "Entonação"], "c": 1}]$q$::jsonb,'2026-12-10 12:00:00+00',true),
    (m,3,$t$Vogais curtas, longas e ditongos$t$,$t$🎯 Objetivo: parar de confundir bit/beat, man/men, full/fool.

O mapa das vogais do inglês com os pares que mais confundem brasileiro, e os ditongos de go, day, my, now. Você vai GRAVAR sua voz e comparar com a minha.

✅ Pratique: grave 10 pares no celular e compare com a aula.$t$,$q$[{"q": "Bit x beat diferem:", "a": ["Na consoante", "Na vogal (curta x longa)", "No acento", "Em nada"], "c": 1}, {"q": "A vogal de cat (/æ/) é:", "a": ["Igual ao 'a' de casa", "Um 'é' com a boca bem aberta", "Igual a cut", "Muda"], "c": 1}, {"q": "Man x men:", "a": ["Soam iguais", "Diferem na vogal", "Diferem no M", "É a mesma palavra"], "c": 1}, {"q": "Ditongo é:", "a": ["Consoante dupla", "Duas vogais num som que desliza (day, go)", "Vogal curta", "Acento"], "c": 1}, {"q": "Gravar a própria voz serve pra:", "a": ["Nada", "Perceber o que o ouvido não nota enquanto fala", "Enviar pro professor", "Decorar"], "c": 1}]$q$::jsonb,'2026-12-14 12:00:00+00',true),
    (m,4,$t$Word stress — a sílaba forte muda tudo$t$,$t$🎯 Objetivo: acertar a sílaba tônica — errar ela atrapalha mais que errar um som.

REcord x reCORD, PHOtograph x phoTOgrapher. Padrões práticos pra palavras de 2 e 3 sílabas e o truque de bater palma na sílaba forte.

✅ Pratique: bata palma na sílaba forte de 20 palavras do seu dia.$t$,$q$[{"q": "Errar a sílaba tônica:", "a": ["Não importa", "Pode deixar a palavra irreconhecível", "Só muda a escrita", "É charme"], "c": 1}, {"q": "REcord (substantivo) tem força na:", "a": ["1ª sílaba", "2ª", "3ª", "Nenhuma"], "c": 0}, {"q": "Substantivo de 2 sílabas costuma ter força na:", "a": ["1ª", "2ª", "Última", "Aleatória"], "c": 0}, {"q": "phoTOgrapher tem força na:", "a": ["1ª", "2ª", "3ª", "4ª"], "c": 1}, {"q": "A técnica da aula é:", "a": ["Copiar 100x", "Bater palma na sílaba forte", "Ler em silêncio", "Soletrar"], "c": 1}]$q$::jsonb,'2026-12-17 12:00:00+00',true),
    (m,5,$t$Ritmo da frase (sentence stress)$t$,$t$🎯 Objetivo: entender por que o nativo parece 'comer' palavras — e fazer igual.

Inglês é língua de ritmo: palavras de conteúdo (verbo, substantivo) soam fortes; palavras de função (the, to, of) ficam fracas e rápidas. Isso muda seu listening E sua fala.

✅ Pratique: 'I WANT to GO to the STORE' — marque só as fortes.$t$,$q$[{"q": "O ritmo do inglês é baseado:", "a": ["Em cada sílaba igual", "Nas sílabas fortes (stress-timed)", "Na escrita", "No alfabeto"], "c": 1}, {"q": "Palavras fortes na frase:", "a": ["Artigos", "Verbos e substantivos (conteúdo)", "Preposições", "Pronomes átonos"], "c": 1}, {"q": "O nativo 'come' palavras porque:", "a": ["Fala errado", "As palavras de função ficam fracas e rápidas", "Tem preguiça", "É gíria"], "c": 1}, {"q": "Em 'I want to go to the store', são fracas:", "a": ["want/go/store", "to/the", "I/store", "Todas"], "c": 1}, {"q": "Sentence stress melhora principalmente:", "a": ["Escrita", "Listening e naturalidade", "Ortografia", "Tradução"], "c": 1}]$q$::jsonb,'2026-12-21 12:00:00+00',true),
    (m,6,$t$Connected speech — por que o nativo "come" palavras$t$,$t$🎯 Objetivo: decodificar whatcha, gonna, wanna e as ligações da fala real.

Linking (an_apple), assimilation (don't you → dontcha) e elision (next day → nex'day). É a ponte entre o inglês de escola e o inglês dos filmes.

✅ Pratique: ouça 1 min de série e marque 3 ligações que identificar.$t$,$q$[{"q": "'Whatcha doing?' é exemplo de:", "a": ["Erro", "Connected speech", "Inglês antigo", "Escrita formal"], "c": 1}, {"q": "Linking é:", "a": ["Separar palavras", "Ligar o fim de uma palavra ao início da outra", "Falar devagar", "Soletrar"], "c": 1}, {"q": "Elision é:", "a": ["Adicionar som", "Omitir som (nex'day)", "Trocar vogal", "Alongar"], "c": 1}, {"q": "'Gonna' vem de:", "a": ["want to", "going to", "got to", "can"], "c": 1}, {"q": "Connected speech ajuda principalmente a:", "a": ["Escrever melhor", "Entender fala real", "Decorar regras", "Traduzir"], "c": 1}]$q$::jsonb,'2026-12-24 12:00:00+00',true),
    (m,7,$t$Entonação — perguntas, emoção e intenção$t$,$t$🎯 Objetivo: usar a melodia da frase pra soar educado, interessado — e entender ironia.

Sobe-e-desce da voz: pergunta sim/não sobe no final, pergunta com WH desce. 'Really?' e 'Really.' são mensagens diferentes. Entonação errada soa rude sem querer.

✅ Pratique: diga 'Oh, that's great' feliz, irônico, cansado e surpreso.$t$,$q$[{"q": "Pergunta sim/não termina:", "a": ["Descendo", "Subindo", "Reta", "Gritando"], "c": 1}, {"q": "Pergunta com WH termina:", "a": ["Subindo", "Descendo", "Reta", "Dobrada"], "c": 1}, {"q": "'Really?' x 'Really.':", "a": ["Iguais", "Mudam intenção pela entonação", "Erro de escrita", "Só britânico"], "c": 1}, {"q": "Entonação errada pode soar:", "a": ["Fluente", "Rude ou desinteressado", "Rápido", "Engraçado sempre"], "c": 1}, {"q": "O treino da aula é:", "a": ["Decorar setas", "Dizer a mesma frase com 4 emoções", "Escrever frases", "Ouvir e calar"], "c": 1}]$q$::jsonb,'2026-12-28 12:00:00+00',true),
    (m,8,$t$Shadowing — a técnica completa$t$,$t$🎯 Objetivo: sair fazendo shadowing do jeito certo, 10 min por dia.

O passo a passo: escolher o áudio certo, ouvir, repetir JUNTO sem pausar, gravar e comparar. Faço um shadowing ao vivo com você e aponto os erros que todo iniciante comete.

✅ Pratique: 10 min hoje com o trecho que deixei nos Materiais.$t$,$q$[{"q": "Shadowing é:", "a": ["Traduzir junto", "Repetir junto com o áudio, como sombra", "Ouvir parado", "Ditado"], "c": 1}, {"q": "Tempo diário recomendado:", "a": ["1h", "10 min", "2 min", "3h"], "c": 1}, {"q": "O áudio ideal é:", "a": ["Filme inteiro", "Trecho curto e claro, pouco acima do seu nível", "Rap acelerado", "Jornal de 1h"], "c": 1}, {"q": "Gravar e comparar serve pra:", "a": ["Postar", "Ouvir diferenças que você não nota falando", "Nada", "Cumprir tabela"], "c": 1}, {"q": "Shadowing treina junto:", "a": ["Só pronúncia", "Pronúncia + ritmo + entonação + listening", "Só gramática", "Só leitura"], "c": 1}]$q$::jsonb,'2026-12-31 12:00:00+00',true);
  end if;
end $blk$;

do $blk$
declare m uuid;
begin
  select id into m from public.mi_modules where name = $t$Vocabulário Essencial$t$ order by created_at limit 1;
  if m is null then insert into public.mi_modules (ord,name,sub,emoji) values (4,$t$Vocabulário Essencial$t$,$t$8 aulas · A1–A2$t$,$t$📗$t$) returning id into m;
  else update public.mi_modules set ord=4, sub=$t$8 aulas · A1–A2$t$, emoji=$t$📗$t$ where id=m; end if;
  if not exists (select 1 from public.mi_lessons where module_id = m) then
    insert into public.mi_lessons (module_id,ord,title,description,quiz,release_at,published) values
    (m,1,$t$As 100 palavras que resolvem metade das conversas$t$,$t$🎯 Objetivo: dominar o núcleo de alta frequência do inglês e usar hoje.

~100 palavras cobrem metade do que se fala. Te entrego a lista organizada por função (pronomes, verbos-chave, conectores) e montamos frases reais com elas ao vivo.

✅ Pratique: monte 10 frases suas só com palavras da lista.$t$,$q$[{"q": "Quantas palavras cobrem ~50% das conversas?", "a": ["10", "100", "1000", "5000"], "c": 1}, {"q": "A lista é organizada por:", "a": ["Alfabeto", "Função", "Tamanho", "Rima"], "c": 1}, {"q": "Fixar vocabulário funciona melhor:", "a": ["Lista solta", "Usando em frases próprias", "Só traduzindo", "Lendo dicionário"], "c": 1}, {"q": "Qual destas é de altíssima frequência?", "a": ["umbrella", "the", "photosynthesis", "whale"], "c": 1}, {"q": "Qual verbo está no top do inglês?", "a": ["to be", "to bake", "to surf", "to paint"], "c": 0}]$q$::jsonb,'2027-01-04 12:00:00+00',true),
    (m,2,$t$Cumprimentos, apresentações e small talk$t$,$t$🎯 Objetivo: se apresentar em 3 frases e nunca mais travar no 'How are you?'.

Hi/Hey/Hello e quando usar cada um; respostas naturais (sem robô); e os temas seguros de small talk: clima, trabalho, fim de semana.

✅ Pratique: grave sua apresentação de 20 segundos.$t$,$q$[{"q": "'Hey' combina com:", "a": ["Reunião formal", "Amigos e conhecidos", "Documentos", "Entrevista"], "c": 1}, {"q": "Resposta natural pra 'How are you?':", "a": ["I am fine thank you and you?", "Good, you?", "Yes", "No"], "c": 1}, {"q": "Sua idade em inglês:", "a": ["I have 30 years", "I'm 30", "I am 30 years old man", "Me 30"], "c": 1}, {"q": "Tema seguro de small talk:", "a": ["Salário", "Clima e fim de semana", "Religião com estranhos", "Dívidas"], "c": 1}, {"q": "'Nice to meet you' se usa:", "a": ["Na despedida", "Ao conhecer alguém", "No telefone sempre", "Com a família"], "c": 1}]$q$::jsonb,'2027-01-07 12:00:00+00',true),
    (m,3,$t$Números, datas, horas e preços$t$,$t$🎯 Objetivo: nunca mais confundir 13 com 30 nem errar data americana.

thirTEEN x THIRty; datas no formato dos EUA; half past, a quarter to; preços e porcentagens do jeito que o caixa fala.

✅ Pratique: diga a data de hoje, a hora agora e 3 preços da sua casa.$t$,$q$[{"q": "13 x 30 diferem:", "a": ["Na escrita só", "Na sílaba forte (thirTEEN x THIRty)", "Em nada", "Na vogal inicial"], "c": 1}, {"q": "Half past seven =", "a": ["6:30", "7:30", "7:45", "8:30"], "c": 1}, {"q": "A quarter to five =", "a": ["4:45", "5:15", "4:15", "5:45"], "c": 0}, {"q": "Nos EUA, 03/07 é:", "a": ["3 de julho", "7 de março", "Março de 2007", "7 de maio"], "c": 1}, {"q": "US$ 2.50 se fala:", "a": ["two dollars fifty cents only", "two fifty", "two point five money", "both A and B"], "c": 3}]$q$::jsonb,'2027-01-11 12:00:00+00',true),
    (m,4,$t$Família, casa e rotina diária$t$,$t$🎯 Objetivo: descrever sua família, sua casa e seu dia completo em inglês.

Siblings, in-laws, nephew; cômodos e objetos; e os verbos da rotina: wake up, get up, commute, hang out. Fechamos com você narrando seu dia em 10 frases.

✅ Pratique: descreva seu dia de ontem, do acordar ao dormir.$t$,$q$[{"q": "Siblings =", "a": ["Primos", "Irmãos", "Sogros", "Filhos"], "c": 1}, {"q": "In-laws =", "a": ["Advogados", "Parentes por casamento", "Leis", "Vizinhos"], "c": 1}, {"q": "Wake up x get up:", "a": ["Iguais", "Acordar x levantar da cama", "Dormir x sonhar", "Cedo x tarde"], "c": 1}, {"q": "Commute =", "a": ["Cozinhar", "Trajeto casa–trabalho", "Comprar", "Mudar de casa"], "c": 1}, {"q": "Hang out =", "a": ["Pendurar roupa", "Passar tempo com alguém", "Sair correndo", "Desligar"], "c": 1}]$q$::jsonb,'2027-01-14 12:00:00+00',true),
    (m,5,$t$Comida, restaurante e mercado$t$,$t$🎯 Objetivo: pedir comida, perguntar ingrediente e pagar sem travar.

No restaurante: pedir, alergias, 'for here or to go', a conta e a gorjeta. No mercado: aisle, produce, dairy, checkout. Com simulação completa no fim.

✅ Pratique: simule um pedido inteiro em voz alta.$t$,$q$[{"q": "'For here or to go?' =", "a": ["Agora ou depois?", "Comer aqui ou levar?", "Com ou sem gelo?", "Cartão ou dinheiro?"], "c": 1}, {"q": "Aisle =", "a": ["Caixa", "Corredor do mercado", "Cesta", "Oferta"], "c": 1}, {"q": "'I'm allergic to nuts' =", "a": ["Amo nozes", "Sou alérgico a castanhas", "Sou vegano", "Não como glúten"], "c": 1}, {"q": "Pedir a conta:", "a": ["Money please", "Check, please", "Paper now", "Finish"], "c": 1}, {"q": "Produce (seção) =", "a": ["Limpeza", "Hortifrúti", "Padaria", "Carnes"], "c": 1}]$q$::jsonb,'2027-01-18 12:00:00+00',true),
    (m,6,$t$Cidade, transporte e direções$t$,$t$🎯 Objetivo: pedir e entender direções, e se virar em metrô e aeroporto.

Turn left, go straight, across from, around the corner; e o kit viagem: boarding, gate, layover, aisle/window seat.

✅ Pratique: explique o caminho da sua casa até a padaria.$t$,$q$[{"q": "Across from =", "a": ["Ao lado", "Em frente, do outro lado", "Atrás", "Acima"], "c": 1}, {"q": "Layover =", "a": ["Mala", "Escala/conexão", "Decolagem", "Fila"], "c": 1}, {"q": "Go straight =", "a": ["Vire", "Siga em frente", "Pare", "Suba"], "c": 1}, {"q": "Window seat =", "a": ["Corredor", "Janela", "Meio", "Executiva"], "c": 1}, {"q": "Around the corner =", "a": ["Longe", "Virando a esquina", "No subsolo", "Na rodovia"], "c": 1}]$q$::jsonb,'2027-01-21 12:00:00+00',true),
    (m,7,$t$Trabalho, estudo e profissões$t$,$t$🎯 Objetivo: apresentar sua profissão e entender o inglês básico de escritório.

'What do you do?' x 'What are you doing?'; I'm a / I work as / I work in; vocabulário de reunião, prazo e e-mail.

✅ Pratique: apresente seu trabalho em 5 frases.$t$,$q$[{"q": "'What do you do?' pergunta:", "a": ["O que faz agora", "Sua profissão", "Seus planos", "Seu humor"], "c": 1}, {"q": "Correto:", "a": ["I am engineer", "I'm an engineer", "Me engineer", "I engineer am"], "c": 1}, {"q": "'I work in marketing' indica:", "a": ["Cargo exato", "Área", "Salário", "Cidade"], "c": 1}, {"q": "Deadline =", "a": ["Linha morta", "Prazo final", "Pausa", "Demissão"], "c": 1}, {"q": "'Boss' é:", "a": ["Sempre formal", "Chefe (informal)", "Estagiário", "Cliente"], "c": 1}]$q$::jsonb,'2027-01-25 12:00:00+00',true),
    (m,8,$t$Sentimentos, opiniões e reações$t$,$t$🎯 Objetivo: ir além de happy/sad e reagir como gente de verdade.

Excited, overwhelmed, relieved, grateful; dar opinião com I think / I'd say; e reações: No way! / That's awesome / I'm sorry to hear that.

✅ Pratique: conte seu dia usando 5 sentimentos diferentes.$t$,$q$[{"q": "Overwhelmed =", "a": ["Feliz", "Sobrecarregado", "Calmo", "Faminto"], "c": 1}, {"q": "Relieved =", "a": ["Aliviado", "Bravo", "Triste", "Perdido"], "c": 0}, {"q": "Opinião natural:", "a": ["Me think", "I'd say...", "I am opinion", "Think I"], "c": 1}, {"q": "'I'm sorry to hear that' é pra:", "a": ["Pedir perdão", "Mostrar empatia", "Recusar convite", "Despedir"], "c": 1}, {"q": "'No way!' expressa:", "a": ["Rota errada", "Surpresa", "Tchau", "Fome"], "c": 1}]$q$::jsonb,'2027-01-28 12:00:00+00',true);
  end if;
end $blk$;

do $blk$
declare m uuid;
begin
  select id into m from public.mi_modules where name = $t$Gramática A1$t$ order by created_at limit 1;
  if m is null then insert into public.mi_modules (ord,name,sub,emoji) values (5,$t$Gramática A1$t$,$t$8 aulas · A1$t$,$t$📘$t$) returning id into m;
  else update public.mi_modules set ord=5, sub=$t$8 aulas · A1$t$, emoji=$t$📘$t$ where id=m; end if;
  if not exists (select 1 from public.mi_lessons where module_id = m) then
    insert into public.mi_lessons (module_id,ord,title,description,quiz,release_at,published) values
    (m,1,$t$Verb to be — a base de tudo$t$,$t$🎯 Objetivo: usar am/is/are em afirmação, negação e pergunta sem pensar.

Contrações (I'm, isn't, they're) e os dois erros clássicos do brasileiro: 'I have 30 years' e 'Is cold today'.

✅ Pratique: 10 frases sobre você, sua família e sua cidade.$t$,$q$[{"q": "Correto:", "a": ["I is a teacher", "I am a teacher", "I are teacher", "Me is teacher"], "c": 1}, {"q": "Negativa de 'She is happy':", "a": ["She no is happy", "She isn't happy", "She not happy", "She don't happy"], "c": 1}, {"q": "Pergunta correta:", "a": ["You are tired?", "Are you tired?", "Do you are tired?", "Tired you are?"], "c": 1}, {"q": "'Está frio hoje':", "a": ["Is cold today", "It's cold today", "Today is cold it", "Cold is"], "c": 1}, {"q": "They're =", "a": ["There are", "They are", "Their", "There"], "c": 1}]$q$::jsonb,'2027-02-01 12:00:00+00',true),
    (m,2,$t$Present Simple — rotinas e verdades$t$,$t$🎯 Objetivo: falar de hábitos e fatos com o S da 3ª pessoa no lugar certo.

Do/does em pergunta e negativa, e os advérbios de frequência (always, usually, sometimes, never) na posição certa.

✅ Pratique: descreva a rotina de alguém da sua família.$t$,$q$[{"q": "Correto:", "a": ["She work here", "She works here", "She working here", "She is work"], "c": 1}, {"q": "Negativa de 'He likes coffee':", "a": ["He don't like", "He doesn't like coffee", "He not likes", "He doesn't likes"], "c": 1}, {"q": "Pergunta:", "a": ["Does she live here?", "Do she lives here?", "She live here?", "Does she lives?"], "c": 0}, {"q": "Present Simple usa-se pra:", "a": ["Agora", "Rotina, hábito, fato", "Passado", "Planos de ontem"], "c": 1}, {"q": "O advérbio de frequência vai:", "a": ["No fim", "Antes do verbo principal", "Sempre no início", "Depois do objeto"], "c": 1}]$q$::jsonb,'2027-02-04 12:00:00+00',true),
    (m,3,$t$Present Continuous — o agora$t$,$t$🎯 Objetivo: diferenciar 'I work' de 'I'm working' e nunca mais misturar.

Be + verbo-ING pra ações de agora e situações temporárias; verbos que não vão pro ING (know, want, like).

✅ Pratique: descreva 10 coisas acontecendo ao seu redor.$t$,$q$[{"q": "Correto:", "a": ["I studying", "I'm studying", "I am study", "I studies now"], "c": 1}, {"q": "'I work here' x 'I'm working here':", "a": ["Iguais", "Rotina x temporário/agora", "Passado x futuro", "Formal x gíria"], "c": 1}, {"q": "Qual normalmente NÃO vai no continuous?", "a": ["run", "know", "eat", "play"], "c": 1}, {"q": "Pergunta:", "a": ["What are you doing?", "What you doing?", "What do you doing?", "Doing what?"], "c": 0}, {"q": "'Running' dobra o N porque:", "a": ["É exceção", "Vogal+consoante final curta dobra antes do ING", "Fica bonito", "Regra do U"], "c": 1}]$q$::jsonb,'2027-02-08 12:00:00+00',true),
    (m,4,$t$Artigos: a, an, the$t$,$t$🎯 Objetivo: escolher a/an/the (ou nada) sem chutar.

A x an pelo SOM (an hour, a university); the pra coisa específica; e quando o inglês não usa artigo nenhum ('I love music').

✅ Pratique: 10 frases com a/an/the e 3 sem artigo.$t$,$q$[{"q": "Correto:", "a": ["a hour", "an hour", "the hour sempre", "hour"], "c": 1}, {"q": "'University' leva:", "a": ["an", "a", "the obrigatório", "nada nunca"], "c": 1}, {"q": "A escolha de a x an é pelo:", "a": ["Pela letra escrita", "Pelo SOM inicial", "Pelo tamanho", "Pelo gênero"], "c": 1}, {"q": "'Eu amo música':", "a": ["I love the music", "I love music", "I love a music", "I love musics"], "c": 1}, {"q": "The usa-se quando:", "a": ["Sempre", "A coisa é específica/conhecida", "Nunca", "Só no plural"], "c": 1}]$q$::jsonb,'2027-02-11 12:00:00+00',true),
    (m,5,$t$Plural, this/that, there is/are$t$,$t$🎯 Objetivo: formar plurais (inclusive os irregulares) e apontar o mundo.

Children, people, feet; this/these x that/those; e there is/there are pra dizer o que existe.

✅ Pratique: descreva sua sala com 5 'there is/are'.$t$,$q$[{"q": "Plural de child:", "a": ["childs", "children", "childes", "child"], "c": 1}, {"q": "People é:", "a": ["Singular", "Plural de person", "Verbo", "Adjetivo"], "c": 1}, {"q": "Perto de mim, plural:", "a": ["that", "these", "those", "this"], "c": 1}, {"q": "'Tem dois sofás aqui':", "a": ["There is two sofas", "There are two sofas", "Have two sofas", "Is two sofas"], "c": 1}, {"q": "Plural de foot:", "a": ["foots", "feet", "feets", "footes"], "c": 1}]$q$::jsonb,'2027-02-15 12:00:00+00',true),
    (m,6,$t$Can, can't e pedidos educados$t$,$t$🎯 Objetivo: falar de habilidade, possibilidade e pedir as coisas com educação.

Can/can't (e a diferença de SOM entre eles, que confunde todo mundo), could pra pedido educado, e 'Can I...?' pra permissão.

✅ Pratique: 5 coisas que você can e 3 que você can't.$t$,$q$[{"q": "'Eu sei nadar':", "a": ["I can to swim", "I can swim", "I can swimming", "I swim can"], "c": 1}, {"q": "Depois de can, o verbo vai:", "a": ["Com to", "No infinitivo sem to", "No ING", "No passado"], "c": 1}, {"q": "Pedido mais educado:", "a": ["Give me water", "Could you give me some water?", "Water now", "You give water"], "c": 1}, {"q": "Can x can't na fala diferem:", "a": ["Nada", "No stress e na vogal", "Só na escrita", "No plural"], "c": 1}, {"q": "'Can I come in?' pede:", "a": ["Habilidade", "Permissão", "Passado", "Opinião"], "c": 1}]$q$::jsonb,'2027-02-18 12:00:00+00',true),
    (m,7,$t$Possessivos e pronomes objeto$t$,$t$🎯 Objetivo: parar de confundir my/mine, your/yours, his/her e me/him/us.

Adjetivo possessivo x pronome possessivo; pronomes objeto depois do verbo; e o apóstrofo de posse (Gediel's car).

✅ Pratique: 8 frases misturando my/mine, her/hers, me/her/us.$t$,$q$[{"q": "Correto:", "a": ["This is mine book", "This is my book", "This book is my", "This mine book"], "c": 1}, {"q": "'Esse livro é meu':", "a": ["This book is my", "This book is mine", "This book is me", "This book my"], "c": 1}, {"q": "'Eu vi ELE ontem':", "a": ["I saw he yesterday", "I saw him yesterday", "I saw his yesterday", "I him saw"], "c": 1}, {"q": "'O carro do Gediel':", "a": ["The car of Gediel", "Gediel's car", "Gediel car", "Car's Gediel"], "c": 1}, {"q": "Her x hers:", "a": ["Iguais", "her + substantivo; hers sozinho", "hers + substantivo", "Tanto faz"], "c": 1}]$q$::jsonb,'2027-02-22 12:00:00+00',true),
    (m,8,$t$Perguntas com WH (what, where, when, who, why, how)$t$,$t$🎯 Objetivo: montar qualquer pergunta com WH + do/does/is sem travar.

A fórmula WH + auxiliar + sujeito + verbo, how much x how many, e as perguntas que você vai usar TODO dia.

✅ Pratique: faça 10 perguntas pra alguém da sua casa (ou pro espelho).$t$,$q$[{"q": "'Onde você mora?':", "a": ["Where you live?", "Where do you live?", "Where does you live?", "You live where?"], "c": 1}, {"q": "How many usa-se com:", "a": ["Incontável", "Contável (many friends)", "Verbos", "Passado"], "c": 1}, {"q": "How much usa-se com:", "a": ["Contável", "Incontável (much water) e preço", "Pessoas", "Lugares"], "c": 1}, {"q": "'Por que você estuda inglês?':", "a": ["Why you study English?", "Why do you study English?", "Why studies you?", "For what study?"], "c": 1}, {"q": "Who pergunta sobre:", "a": ["Lugar", "Pessoa", "Tempo", "Motivo"], "c": 1}]$q$::jsonb,'2027-02-25 12:00:00+00',true);
  end if;
end $blk$;

do $blk$
declare m uuid;
begin
  select id into m from public.mi_modules where name = $t$Gramática A2–B1$t$ order by created_at limit 1;
  if m is null then insert into public.mi_modules (ord,name,sub,emoji) values (6,$t$Gramática A2–B1$t$,$t$8 aulas · A2–B1$t$,$t$📙$t$) returning id into m;
  else update public.mi_modules set ord=6, sub=$t$8 aulas · A2–B1$t$, emoji=$t$📙$t$ where id=m; end if;
  if not exists (select 1 from public.mi_lessons where module_id = m) then
    insert into public.mi_lessons (module_id,ord,title,description,quiz,release_at,published) values
    (m,1,$t$Past Simple — regulares e irregulares$t$,$t$🎯 Objetivo: contar o que aconteceu ontem com os 25 irregulares mais usados.

-ED e seus três sons (/t/, /d/, /ɪd/), did em pergunta/negativa, e went, had, said, got, made no automático.

✅ Pratique: conte seu dia de ontem em 8 frases no passado.$t$,$q$[{"q": "Passado de go:", "a": ["goed", "went", "gone did", "going"], "c": 1}, {"q": "Negativa:", "a": ["I didn't went", "I didn't go", "I no went", "I don't went"], "c": 1}, {"q": "O -ED de wanted soa:", "a": ["/t/", "/d/", "/ɪd/", "mudo"], "c": 2}, {"q": "Pergunta:", "a": ["Did you liked?", "Did you like it?", "You liked?", "Does you liked?"], "c": 1}, {"q": "Passado de make:", "a": ["maked", "made", "maden", "making"], "c": 1}]$q$::jsonb,'2027-03-01 12:00:00+00',true),
    (m,2,$t$Past Continuous e interrupções$t$,$t$🎯 Objetivo: descrever cenas do passado e o clássico 'eu estava X quando Y'.

Was/were + ING, e a dupla perfeita com o Past Simple: 'I was taking a shower when the phone rang'.

✅ Pratique: 5 frases 'I was ___ when ___'.$t$,$q$[{"q": "Correto:", "a": ["I was study", "I was studying", "I were studying", "I studying was"], "c": 1}, {"q": "'Eles estavam jantando':", "a": ["They was having dinner", "They were having dinner", "They had dinner now", "They dinner"], "c": 1}, {"q": "Na frase com interrupção:", "a": ["Os dois no continuous", "Cena no continuous + interrupção no simple", "Os dois no simple", "Tanto faz"], "c": 1}, {"q": "'A luz caiu enquanto eu trabalhava':", "a": ["The power went out while I was working", "The power was going out while I worked", "Power out when work", "While power I work"], "c": 0}, {"q": "While combina com:", "a": ["Past Simple só", "Past Continuous", "Futuro", "Imperativo"], "c": 1}]$q$::jsonb,'2027-03-04 12:00:00+00',true),
    (m,3,$t$Futuro: will x going to$t$,$t$🎯 Objetivo: escolher o futuro certo: decisão na hora, plano ou previsão.

Will pra decisão espontânea e promessa; going to pra plano e previsão com evidência; e o present continuous pra combinado marcado.

✅ Pratique: 3 planos (going to) + 3 promessas (will).$t$,$q$[{"q": "Decisão tomada AGORA:", "a": ["going to", "will", "present simple", "did"], "c": 1}, {"q": "Plano já decidido:", "a": ["will", "going to", "would", "was"], "c": 1}, {"q": "Céu preto, vai chover:", "a": ["It will rain maybe", "It's going to rain", "It rains", "It rained"], "c": 1}, {"q": "'Te ajudo!' (na hora):", "a": ["I'm going to help you", "I'll help you!", "I help", "I helped"], "c": 1}, {"q": "Combinado com hora marcada:", "a": ["I'm meeting her at 7", "I will meeting", "I meet tomorrow maybe", "I was meeting"], "c": 0}]$q$::jsonb,'2027-03-08 12:00:00+00',true),
    (m,4,$t$Present Perfect sem medo$t$,$t$🎯 Objetivo: perder o medo do have/has + particípio de uma vez.

Experiência de vida (I've been to...), ação que conecta com agora, e os gatilhos: ever, never, already, yet, just, for, since.

✅ Pratique: 5 experiências suas com 'I have...'.$t$,$q$[{"q": "Correto:", "a": ["I have saw", "I have seen", "I has seen", "I seen have"], "c": 1}, {"q": "'Já estive em SP' (experiência):", "a": ["I went to SP yesterday", "I've been to São Paulo", "I am in SP", "I go SP"], "c": 1}, {"q": "For x since:", "a": ["Iguais", "for + duração; since + ponto de início", "since + duração", "for + data"], "c": 1}, {"q": "Yet aparece em:", "a": ["Afirmativa", "Negativa e pergunta", "Imperativo", "Nunca"], "c": 1}, {"q": "'Acabei de almoçar':", "a": ["I just have lunch", "I've just had lunch", "I had just lunch now", "Just lunch me"], "c": 1}]$q$::jsonb,'2027-03-11 12:00:00+00',true),
    (m,5,$t$Comparativos e superlativos$t$,$t$🎯 Objetivo: comparar tudo: bigger, more expensive, the best.

-ER/-EST pra curtas, more/most pra longas, os irregulares (good/better/best) e o as...as.

✅ Pratique: compare sua cidade com outra em 5 frases.$t$,$q$[{"q": "Comparativo de big:", "a": ["more big", "bigger", "biggest", "as big"], "c": 1}, {"q": "Comparativo de expensive:", "a": ["expensiver", "more expensive", "expensivest", "much expensive"], "c": 1}, {"q": "Superlativo de good:", "a": ["goodest", "the best", "the better", "most good"], "c": 1}, {"q": "'Tão alto quanto':", "a": ["so tall that", "as tall as", "taller as", "tall like"], "c": 1}, {"q": "Comparativo de bad:", "a": ["badder", "worse", "worst", "more bad"], "c": 1}]$q$::jsonb,'2027-03-15 12:00:00+00',true),
    (m,6,$t$Modais: should, must, have to, might$t$,$t$🎯 Objetivo: dar conselho, falar de obrigação e possibilidade com o modal certo.

Should (conselho), must/have to (obrigação), might/may (possibilidade), can't (dedução negativa).

✅ Pratique: 3 conselhos pra um amigo + 3 obrigações suas.$t$,$q$[{"q": "Conselho:", "a": ["You must to sleep", "You should sleep more", "You might sleep", "Sleep you"], "c": 1}, {"q": "Obrigação externa (lei, regra):", "a": ["should", "have to", "might", "could"], "c": 1}, {"q": "Possibilidade:", "a": ["must", "might", "have to", "did"], "c": 1}, {"q": "Depois de modal, o verbo:", "a": ["Leva to", "Vai sem to", "Vai no ING", "Vai no passado"], "c": 1}, {"q": "'Não pode ser ele' (dedução):", "a": ["It mustn't be him", "It can't be him", "It shouldn't him", "No him"], "c": 1}]$q$::jsonb,'2027-03-18 12:00:00+00',true),
    (m,7,$t$Condicionais 0 e 1 (if...)$t$,$t$🎯 Objetivo: montar frases com SE: verdades gerais e futuro real.

Zero conditional (if + present, present) pra fatos; first conditional (if + present, will) pra futuro provável. E por que NÃO vai will depois do if.

✅ Pratique: 5 frases 'If I..., I will...'.$t$,$q$[{"q": "Verdade geral:", "a": ["If you heat ice, it melts", "If you heat ice, it will melted", "Ice melt when hot it", "If ice hots"], "c": 0}, {"q": "Futuro provável:", "a": ["If it rains, I stay home always", "If it rains, I'll stay home", "If it will rain, I stay", "Rain = home"], "c": 1}, {"q": "Depois do IF (1st conditional):", "a": ["will", "present simple", "would", "going to"], "c": 1}, {"q": "'Se você estudar, você passa':", "a": ["If you study, you'll pass", "If you will study, you pass", "You study you pass will", "Study if pass"], "c": 0}, {"q": "Zero conditional usa:", "a": ["if + present, present", "if + will, will", "if + past, would", "if + ING"], "c": 0}]$q$::jsonb,'2027-03-22 12:00:00+00',true),
    (m,8,$t$Conectores: because, so, although, however$t$,$t$🎯 Objetivo: parar de falar frase picada e ligar ideias como gente grande.

Causa (because), consequência (so), contraste (but, although, however) e sequência (first, then, after that).

✅ Pratique: conte uma história sua em 6 frases conectadas.$t$,$q$[{"q": "Causa:", "a": ["so", "because", "although", "then"], "c": 1}, {"q": "Consequência:", "a": ["because", "so", "but", "if"], "c": 1}, {"q": "'Embora estivesse cansado, fui':", "a": ["Because I was tired, I went", "Although I was tired, I went", "So I was tired", "I went however tired so"], "c": 1}, {"q": "However é mais comum:", "a": ["Na gíria", "Na escrita/fala formal", "Em música", "Nunca"], "c": 1}, {"q": "Sequência de passos:", "a": ["first, then, after that", "because, so", "although, but", "if, will"], "c": 0}]$q$::jsonb,'2027-03-25 12:00:00+00',true);
  end if;
end $blk$;

do $blk$
declare m uuid;
begin
  select id into m from public.mi_modules where name = $t$Conversação A1–A2$t$ order by created_at limit 1;
  if m is null then insert into public.mi_modules (ord,name,sub,emoji) values (7,$t$Conversação A1–A2$t$,$t$5 aulas$t$,$t$🗣️$t$) returning id into m;
  else update public.mi_modules set ord=7, sub=$t$5 aulas$t$, emoji=$t$🗣️$t$ where id=m; end if;
  if not exists (select 1 from public.mi_lessons where module_id = m) then
    insert into public.mi_lessons (module_id,ord,title,description,quiz,release_at,published) values
    (m,1,$t$Sobrevivência: as 30 frases que destravam$t$,$t$🎯 Objetivo: sair desta aula com um kit de emergência pra QUALQUER situação.

'Sorry, can you repeat that?', 'How do you say ___ in English?', 'I don't understand'. As 30 frases que mantêm a conversa viva mesmo quando falta vocabulário.

✅ Pratique: fale as 10 primeiras em voz alta, 3x cada.$t$,$q$[{"q": "Não entendeu o que falaram:", "a": ["Ficar quieto", "'Sorry, can you repeat that?'", "Fingir que entendeu", "Sair"], "c": 1}, {"q": "Esqueceu uma palavra:", "a": ["Desistir", "'How do you say ___ in English?'", "Falar em português alto", "Apontar"], "c": 1}, {"q": "Pedir pra falar devagar:", "a": ["Speak slow you", "'Could you speak more slowly?'", "Stop fast", "Slow now"], "c": 1}, {"q": "'What does ___ mean?' pergunta:", "a": ["O preço", "O significado", "A hora", "O caminho"], "c": 1}, {"q": "O kit serve pra:", "a": ["Decorar e nunca usar", "Manter a conversa viva quando falta vocabulário", "Impressionar", "Provas"], "c": 1}]$q$::jsonb,'2027-03-29 12:00:00+00',true),
    (m,2,$t$Pedindo informação e ajuda$t$,$t$🎯 Objetivo: perguntar caminho, preço, horário — e entender a resposta.

'Excuse me' pra abordar, perguntas indiretas educadas ('Do you know where... is?') e o que fazer quando a resposta vem rápida demais.

✅ Pratique: simule 3 pedidos de informação em voz alta.$t$,$q$[{"q": "Abordar um estranho:", "a": ["Hey you", "Excuse me", "Listen", "Attention"], "c": 1}, {"q": "Pergunta indireta educada:", "a": ["Where is the bank?!", "Do you know where the bank is?", "Bank where", "Tell me bank now"], "c": 1}, {"q": "Na indireta, a ordem é:", "a": ["where IS the bank", "where the bank IS", "is where bank", "bank is where"], "c": 1}, {"q": "Resposta veio rápida demais:", "a": ["Sorry?", "Silêncio", "Ok ok", "Bye"], "c": 0}, {"q": "'How much is this?' pergunta:", "a": ["Caminho", "Preço", "Hora", "Nome"], "c": 1}]$q$::jsonb,'2027-04-01 12:00:00+00',true),
    (m,3,$t$Falando de você: vida, gostos e planos$t$,$t$🎯 Objetivo: sustentar 2 minutos de conversa sobre a sua vida.

O roteiro pessoal: quem sou, o que faço, do que gosto (like/love/enjoy + ING), e planos (I'm planning to...). Seu pitch pessoal de 60 segundos.

✅ Pratique: grave seu pitch de 1 minuto.$t$,$q$[{"q": "Correto:", "a": ["I like watch series", "I like watching series", "I like to watching", "I liking watch"], "c": 1}, {"q": "'Curto cozinhar':", "a": ["I enjoy cooking", "I enjoy to cook", "I enjoy cook", "Enjoy cooking me"], "c": 0}, {"q": "Plano:", "a": ["I plan travel", "I'm planning to travel", "I planning travel", "Travel I plan"], "c": 1}, {"q": "O pitch pessoal tem:", "a": ["Só nome", "Quem sou + o que faço + o que curto", "Documentos", "Endereço completo"], "c": 1}, {"q": "Depois de love/like/enjoy, verbo:", "a": ["Com to sempre", "No ING (ou to+inf com like/love)", "No passado", "Sem nada"], "c": 1}]$q$::jsonb,'2027-04-05 12:00:00+00',true),
    (m,4,$t$Ao telefone e em vídeo chamada$t$,$t$🎯 Objetivo: atender, se apresentar e resolver no telefone sem pânico.

'This is Gediel', 'Could you speak up?', 'You're breaking up' (tá cortando), 'Can you hear me?'. E a etiqueta da vídeo chamada em inglês.

✅ Pratique: simule atender uma ligação em inglês.$t$,$q$[{"q": "Se apresentar no telefone:", "a": ["I am Gediel here", "This is Gediel", "Me Gediel", "Gediel talking you"], "c": 1}, {"q": "'You're breaking up' =", "a": ["Você terminou comigo", "Sua voz tá cortando", "Você quebrou algo", "Desliga"], "c": 1}, {"q": "Pedir pra aumentar a voz:", "a": ["Louder you", "Could you speak up?", "Big voice please", "Scream"], "c": 1}, {"q": "'Can you hear me?' =", "a": ["Me vê?", "Me ouve?", "Me entende?", "Me liga?"], "c": 1}, {"q": "'Hold on a second' =", "a": ["Desliga", "Só um instante", "Segura o celular", "Alô"], "c": 1}]$q$::jsonb,'2027-04-08 12:00:00+00',true),
    (m,5,$t$Simulação completa: um dia em viagem$t$,$t$🎯 Objetivo: juntar tudo numa simulação real — aeroporto, hotel, restaurante, rua.

Do check-in ao jantar: eu faço todas as perguntas que você vai ouvir numa viagem e você responde. Teste final do módulo.

✅ Pratique: refaça a simulação pausando antes das minhas respostas.$t$,$q$[{"q": "No check-in do hotel:", "a": ["I have a reservation", "I live here now", "Give room", "Sleep I want"], "c": 0}, {"q": "'Janela ou corredor?' no avião:", "a": ["Window or aisle?", "Door or roof?", "Up or down?", "Left or right?"], "c": 0}, {"q": "Pedir a conta no restaurante:", "a": ["Money end", "Check, please", "Finish food", "Pay you"], "c": 1}, {"q": "'Where is the gate?' pergunta:", "a": ["O portão de embarque", "O banheiro", "A saída da cidade", "O táxi"], "c": 0}, {"q": "O objetivo da simulação é:", "a": ["Decorar script", "Juntar tudo em situação real", "Passar na prova", "Rir"], "c": 1}]$q$::jsonb,'2027-04-12 12:00:00+00',true);
  end if;
end $blk$;

do $blk$
declare m uuid;
begin
  select id into m from public.mi_modules where name = $t$Conversação B1$t$ order by created_at limit 1;
  if m is null then insert into public.mi_modules (ord,name,sub,emoji) values (8,$t$Conversação B1$t$,$t$4 aulas · B1$t$,$t$💬$t$) returning id into m;
  else update public.mi_modules set ord=8, sub=$t$4 aulas · B1$t$, emoji=$t$💬$t$ where id=m; end if;
  if not exists (select 1 from public.mi_lessons where module_id = m) then
    insert into public.mi_lessons (module_id,ord,title,description,quiz,release_at,published) values
    (m,1,$t$Contando histórias (storytelling pessoal)$t$,$t$🎯 Objetivo: contar uma história sua com começo, tensão e final — em inglês.

A estrutura: setting (where/when) → problema → virada → fecho. Conectores de narrativa (suddenly, turns out, in the end) e tempo verbal certo em cada parte.

✅ Pratique: conte uma história real sua em 90 segundos.$t$,$q$[{"q": "Uma boa história tem:", "a": ["Só o final", "Cenário → problema → virada → fecho", "Lista de fatos", "Datas exatas"], "c": 1}, {"q": "'Turns out' introduz:", "a": ["O cenário", "A revelação/virada", "O tchau", "A pergunta"], "c": 1}, {"q": "Cenário e cena em andamento usam:", "a": ["Past Continuous", "Futuro", "Imperativo", "Present Perfect só"], "c": 0}, {"q": "'Suddenly' sinaliza:", "a": ["Calma", "Algo inesperado", "Fim", "Rotina"], "c": 1}, {"q": "'In the end' =", "a": ["No começo", "No final das contas", "Dentro", "Nunca"], "c": 1}]$q$::jsonb,'2027-04-15 12:00:00+00',true),
    (m,2,$t$Dando opinião e discordando com educação$t$,$t$🎯 Objetivo: defender seu ponto sem soar grosso — habilidade B1 de ouro.

In my opinion / I'd say / The way I see it; concordar (That's a good point); discordar suave ('I see what you mean, but...').

✅ Pratique: escolha um tema e defenda os DOIS lados, 1 min cada.$t$,$q$[{"q": "Discordância educada:", "a": ["You're wrong", "I see what you mean, but...", "No", "Shut up"], "c": 1}, {"q": "'That's a good point' =", "a": ["Discordo", "Você tem razão nesse ponto", "Tanto faz", "Fim de papo"], "c": 1}, {"q": "Opinião:", "a": ["The way I see it...", "The way I look it", "For my eyes", "In my look"], "c": 0}, {"q": "Suavizar discordância:", "a": ["Actually you know nothing", "I'm not so sure about that", "Never", "False"], "c": 1}, {"q": "Debater os dois lados treina:", "a": ["Decoreba", "Flexibilidade e vocabulário de argumento", "Gramática só", "Nada"], "c": 1}]$q$::jsonb,'2027-04-19 12:00:00+00',true),
    (m,3,$t$Conversas profundas: fé, propósito e valores$t$,$t$🎯 Objetivo: falar do que realmente importa pra você — com profundidade.

Vocabulário de fé e propósito: faith, purpose, calling, grateful, blessed; frases pra compartilhar testemunho e valores sem travar.

✅ Pratique: conte em inglês o que te move, em 5 frases.$t$,$q$[{"q": "Calling =", "a": ["Ligação telefônica", "Chamado/vocação", "Grito", "Apelido"], "c": 1}, {"q": "'I'm grateful for...' =", "a": ["Sou grande", "Sou grato por", "Estou cheio", "Sou gentil"], "c": 1}, {"q": "Purpose =", "a": ["Proposta", "Propósito", "Presente", "Prova"], "c": 1}, {"q": "'What drives you?' pergunta:", "a": ["Seu carro", "O que te move/motiva", "Pra onde dirige", "Sua rotina"], "c": 1}, {"q": "Blessed =", "a": ["Abençoado", "Cansado", "Ocupado", "Vestido"], "c": 0}]$q$::jsonb,'2027-04-22 12:00:00+00',true),
    (m,4,$t$Fluência sob pressão: entrevistas e imprevistos$t$,$t$🎯 Objetivo: manter a calma e a fluência quando a pergunta vem sem aviso.

Técnicas de ganho de tempo (That's a great question... / Let me think...), reformulação quando falta palavra, e simulação de entrevista.

✅ Pratique: responda 5 perguntas aleatórias gravando, sem pausar o áudio.$t$,$q$[{"q": "Ganhar tempo elegante:", "a": ["Silêncio de 30s", "'That's a great question...'", "Éééé", "Trocar de assunto"], "c": 1}, {"q": "Faltou a palavra exata:", "a": ["Travar", "Explicar com outras palavras", "Falar em português", "Desligar"], "c": 1}, {"q": "'Let me think for a second' é:", "a": ["Erro", "Normal e natural", "Proibido", "Grosseria"], "c": 1}, {"q": "Em entrevista, respostas boas são:", "a": ["Monossílabas", "Estruturadas: situação → ação → resultado", "Decoradas palavra a palavra", "Longuíssimas"], "c": 1}, {"q": "Fluência sob pressão vem de:", "a": ["Dom", "Prática simulada repetida", "Sorte", "Café"], "c": 1}]$q$::jsonb,'2027-04-26 12:00:00+00',true);
  end if;
end $blk$;

do $blk$
declare m uuid;
begin
  select id into m from public.mi_modules where name = $t$Listening & Compreensão$t$ order by created_at limit 1;
  if m is null then insert into public.mi_modules (ord,name,sub,emoji) values (9,$t$Listening & Compreensão$t$,$t$5 aulas · A2–B1$t$,$t$🎧$t$) returning id into m;
  else update public.mi_modules set ord=9, sub=$t$5 aulas · A2–B1$t$, emoji=$t$🎧$t$ where id=m; end if;
  if not exists (select 1 from public.mi_lessons where module_id = m) then
    insert into public.mi_lessons (module_id,ord,title,description,quiz,release_at,published) values
    (m,1,$t$Por que você não entende o que ouve (e como mudar)$t$,$t$🎯 Objetivo: diagnosticar POR QUE seu ouvido trava e aplicar o protocolo certo.

Os 4 vilões: velocidade, connected speech, vocabulário e ansiedade. O protocolo dos 3 passos: ouvir sem texto → ouvir com texto → ouvir sem texto de novo.

✅ Pratique: aplique o protocolo num áudio de 1 minuto.$t$,$q$[{"q": "Os vilões do listening são:", "a": ["Só velocidade", "Velocidade, ligações, vocabulário e ansiedade", "Sotaque só", "Volume"], "c": 1}, {"q": "O protocolo é:", "a": ["Texto sempre", "Sem texto → com texto → sem texto", "Tradução primeiro", "Dormir ouvindo"], "c": 1}, {"q": "Não entender TUDO é:", "a": ["Fracasso", "Normal — o foco é a ideia geral primeiro", "Preguiça", "Fim"], "c": 1}, {"q": "Ansiedade no listening:", "a": ["Ajuda", "Trava a compreensão — respira e segue", "Não existe", "É necessária"], "c": 1}, {"q": "Repetir o mesmo áudio:", "a": ["Perde tempo", "Fixa padrões de som", "É proibido", "Só pra música"], "c": 1}]$q$::jsonb,'2027-04-29 12:00:00+00',true),
    (m,2,$t$Treino com músicas$t$,$t$🎯 Objetivo: transformar sua playlist em professor de listening.

O método: ouvir → ler a letra → ouvir lendo → cantar junto → ouvir sem ler. Por que música gruda na memória e como escolher a música certa pro seu nível.

✅ Pratique: aplique nas suas 2 músicas favoritas.$t$,$q$[{"q": "A sequência certa é:", "a": ["Ler → decorar", "Ouvir → ler → ouvir lendo → cantar → ouvir sem ler", "Cantar primeiro", "Traduzir tudo antes"], "c": 1}, {"q": "Música boa pra treino:", "a": ["A mais rápida", "Uma que você AMA, clara pro seu nível", "Qualquer instrumental", "A mais nova"], "c": 1}, {"q": "Música gruda porque:", "a": ["Mágica", "Ritmo + repetição + emoção fixam memória", "É curta", "Tem clipe"], "c": 1}, {"q": "Rap acelerado pra iniciante:", "a": ["Perfeito", "Frustra — deixa pra depois", "Obrigatório", "Tanto faz"], "c": 1}, {"q": "Cantar junto treina:", "a": ["Só diversão", "Pronúncia, ritmo e connected speech", "Nada", "Memória visual"], "c": 1}]$q$::jsonb,'2027-05-03 12:00:00+00',true),
    (m,3,$t$Treino com séries e filmes$t$,$t$🎯 Objetivo: usar série do jeito CERTO — que treina, não só entretém.

A escada das legendas: PT → EN → sem legenda, e quando subir cada degrau. A técnica da cena repetida e os gêneros mais fáceis de entender.

✅ Pratique: 1 episódio de 20 min com legenda EN hoje.$t$,$q$[{"q": "A escada das legendas:", "a": ["EN → PT → nada", "PT → EN → sem legenda", "Sempre PT", "Nunca legenda"], "c": 1}, {"q": "Série que você JÁ viu dublada:", "a": ["Inútil", "Ótima — você já sabe a história", "Proibida", "Chata"], "c": 1}, {"q": "Gênero mais fácil:", "a": ["Médico/jurídico", "Comédia de situação (cotidiano)", "Ficção técnica", "Época"], "c": 1}, {"q": "A técnica da cena repetida:", "a": ["Ver tudo 2x", "Rever UMA cena até pegar as falas", "Pular cenas", "Mudo"], "c": 1}, {"q": "Quando subir de degrau:", "a": ["Nunca", "Quando entender ~80% do atual", "Dia 1", "Quando mandarem"], "c": 1}]$q$::jsonb,'2027-05-06 12:00:00+00',true),
    (m,4,$t$Treino com podcasts e velocidade real$t$,$t$🎯 Objetivo: evoluir de áudio didático pra conversa em velocidade nativa.

A progressão: podcast pra aprendiz → podcast nativo leve → conversa real. Uso do 0.75x sem vergonha e a escuta em dois passes.

✅ Pratique: mesmo episódio, 1º passe geral + 2º passe caçando detalhe.$t$,$q$[{"q": "A progressão certa:", "a": ["Nativo direto", "Didático → nativo leve → conversa real", "Só didático pra sempre", "Rádio AM"], "c": 1}, {"q": "Reduzir pra 0.75x é:", "a": ["Vergonha", "Ferramenta legítima de treino", "Trapaça", "Inútil"], "c": 1}, {"q": "1º passe serve pra:", "a": ["Detalhes", "Ideia geral", "Gramática", "Sotaque"], "c": 1}, {"q": "2º passe serve pra:", "a": ["Dormir", "Caçar detalhes e expressões", "Música", "Nada"], "c": 1}, {"q": "Pra virar listening de verdade, o podcast precisa:", "a": ["Tocar de fundo pra sempre", "De momentos de escuta ATIVA", "Ser em 2x", "Ter vídeo"], "c": 1}]$q$::jsonb,'2027-05-10 12:00:00+00',true),
    (m,5,$t$Sotaques: americano, britânico e outros$t$,$t$🎯 Objetivo: não travar quando o inglês vem com sotaque diferente do esperado.

Americano x britânico (r, t, vogais: water, can't, schedule), e uma volta pelo inglês global: Índia, Austrália, África. Inglês real é multissotaque.

✅ Pratique: ouça a MESMA frase em 3 sotaques (link nos Materiais).$t$,$q$[{"q": "O T de water no americano soa:", "a": ["T forte", "Quase um D (wader)", "Mudo", "S"], "c": 1}, {"q": "O R final (car) no britânico padrão:", "a": ["Forte", "Quase some", "Vibra", "Vira L"], "c": 1}, {"q": "A maioria dos falantes de inglês no mundo:", "a": ["É nativa", "NÃO é nativa — sotaque variado é o normal", "É britânica", "É americana"], "c": 1}, {"q": "Travou com um sotaque novo:", "a": ["Desistir", "Exposição repetida àquele sotaque", "Reclamar", "Só legendado pra sempre"], "c": 1}, {"q": "Pra seu ouvido ficar flexível:", "a": ["Um sotaque só", "Variar as fontes de áudio", "Nenhum áudio", "Só música"], "c": 1}]$q$::jsonb,'2027-05-13 12:00:00+00',true);
  end if;
end $blk$;

do $blk$
declare m uuid;
begin
  select id into m from public.mi_modules where name = $t$Phrasal Verbs$t$ order by created_at limit 1;
  if m is null then insert into public.mi_modules (ord,name,sub,emoji) values (10,$t$Phrasal Verbs$t$,$t$6 aulas · B1$t$,$t$🧩$t$) returning id into m;
  else update public.mi_modules set ord=10, sub=$t$6 aulas · B1$t$, emoji=$t$🧩$t$ where id=m; end if;
  if not exists (select 1 from public.mi_lessons where module_id = m) then
    insert into public.mi_lessons (module_id,ord,title,description,quiz,release_at,published) values
    (m,1,$t$O que são phrasal verbs e como aprender sem decorar$t$,$t$🎯 Objetivo: entender a lógica das partículas e parar de decorar lista.

Verbo + partícula muda o sentido: up (completar/subir), out (sair/descobrir), off (desligar/sair). Aprender por CONTEXTO e por tema, nunca por ordem alfabética.

✅ Pratique: ache 3 phrasal verbs em qualquer música que você ama.$t$,$q$[{"q": "Phrasal verb é:", "a": ["Verbo irregular", "Verbo + partícula com sentido próprio", "Gíria proibida", "Tempo verbal"], "c": 1}, {"q": "O jeito certo de aprender:", "a": ["Lista alfabética", "Por tema e contexto", "Decorar dicionário", "Ignorar"], "c": 1}, {"q": "A partícula up costuma indicar:", "a": ["Descer", "Completar/subir (wake up, finish up)", "Sair", "Negar"], "c": 1}, {"q": "Out em find out indica:", "a": ["Dentro", "Descobrir (trazer à tona)", "Fechar", "Subir"], "c": 1}, {"q": "Phrasal verbs aparecem:", "a": ["Só em prova", "O tempo todo na fala real", "Só em livro antigo", "Nunca"], "c": 1}]$q$::jsonb,'2027-05-17 12:00:00+00',true),
    (m,2,$t$Rotina: get up, wake up, work out...$t$,$t$🎯 Objetivo: dominar os phrasal verbs do seu dia a dia, do despertador à cama.

Wake up, get up, get dressed, set off, work out, chill out, turn on/off, go to bed... narrando um dia inteiro com eles.

✅ Pratique: narre seu dia de hoje usando 6 phrasal verbs.$t$,$q$[{"q": "Wake up =", "a": ["Levantar", "Acordar", "Dormir", "Correr"], "c": 1}, {"q": "Work out =", "a": ["Trabalhar fora", "Malhar", "Desistir", "Consertar"], "c": 1}, {"q": "Turn off =", "a": ["Ligar", "Desligar", "Virar", "Quebrar"], "c": 1}, {"q": "Chill out =", "a": ["Congelar", "Relaxar", "Gritar", "Sair"], "c": 1}, {"q": "Get dressed =", "a": ["Se vestir", "Se atrasar", "Se sentar", "Se perder"], "c": 0}]$q$::jsonb,'2027-05-20 12:00:00+00',true),
    (m,3,$t$Relacionamentos: get along, break up, hang out...$t$,$t$🎯 Objetivo: falar de amizade, família e relacionamento como nativo.

Get along (se dar bem), hang out, break up, make up (fazer as pazes), grow up, look after, count on (contar com).

✅ Pratique: descreva 3 relações suas usando esses verbos.$t$,$q$[{"q": "Get along with =", "a": ["Andar junto", "Se dar bem com", "Caminhar", "Competir"], "c": 1}, {"q": "Break up =", "a": ["Quebrar objeto", "Terminar relacionamento", "Acordar", "Rir"], "c": 1}, {"q": "Make up (após briga) =", "a": ["Maquiar só", "Fazer as pazes", "Inventar prova", "Arrumar cama"], "c": 1}, {"q": "Count on =", "a": ["Contar números", "Contar com alguém", "Cobrar", "Culpar"], "c": 1}, {"q": "Look after =", "a": ["Procurar depois", "Cuidar de", "Olhar atrás", "Seguir"], "c": 1}]$q$::jsonb,'2027-05-24 12:00:00+00',true),
    (m,4,$t$Trabalho: set up, carry out, put off...$t$,$t$🎯 Objetivo: entender e usar os phrasal verbs de reunião e e-mail corporativo.

Set up (montar/marcar), carry out (executar), put off (adiar), follow up, figure out (descobrir a solução), hand in (entregar).

✅ Pratique: escreva 1 e-mail fictício usando 3 deles.$t$,$q$[{"q": "Set up a meeting =", "a": ["Cancelar", "Marcar/organizar", "Sentar", "Atrasar"], "c": 1}, {"q": "Put off =", "a": ["Vestir", "Adiar", "Apagar", "Publicar"], "c": 1}, {"q": "Figure out =", "a": ["Desenhar", "Descobrir/resolver", "Medir", "Imprimir"], "c": 1}, {"q": "Follow up =", "a": ["Perseguir", "Dar sequência/retomar contato", "Subir escada", "Copiar"], "c": 1}, {"q": "Hand in =", "a": ["Apertar mão", "Entregar (trabalho/documento)", "Ajudar", "Segurar"], "c": 1}]$q$::jsonb,'2027-05-27 12:00:00+00',true),
    (m,5,$t$Separáveis x inseparáveis$t$,$t$🎯 Objetivo: saber quando o objeto pode (ou DEVE) entrar no meio.

Turn the TV on / turn on the TV — mas com pronome só no meio: turn IT on (nunca turn on it). E os inseparáveis: look after her, run into him.

✅ Pratique: 6 frases trocando o objeto por it/him/her.$t$,$q$[{"q": "Com pronome, o separável fica:", "a": ["turn on it", "turn it on", "it turn on", "on turn it"], "c": 1}, {"q": "'Pick up the kids' também pode ser:", "a": ["Pick the kids up", "Pick up kids the", "Kids pick up", "Up pick kids"], "c": 0}, {"q": "Look after é:", "a": ["Separável", "Inseparável", "Os dois", "Não é phrasal"], "c": 1}, {"q": "'Run into him' (encontrar por acaso):", "a": ["Run him into", "Correto assim — inseparável", "Into run him", "Run into he"], "c": 1}, {"q": "A regra do pronome:", "a": ["Sempre no fim", "No meio do separável", "Fora da frase", "Tanto faz"], "c": 1}]$q$::jsonb,'2027-05-31 12:00:00+00',true),
    (m,6,$t$Os 25 phrasal verbs mais usados — revisão geral$t$,$t$🎯 Objetivo: fechar o módulo com os 25 que resolvem 90% das situações.

Revisão ativa: eu falo a situação, você puxa o phrasal verb. Os 25 em frases de verdade + mini-desafio final valendo revisão.

✅ Pratique: refaça o quiz desta aula até gabaritar.$t$,$q$[{"q": "'Descobri a verdade':", "a": ["I found out the truth", "I found the truth out of", "I looked the truth", "I figured truth"], "c": 0}, {"q": "'Desisti':", "a": ["I gave up", "I gave off", "I got up", "I put up"], "c": 0}, {"q": "'Cuido da minha avó':", "a": ["I look at my grandma", "I look after my grandma", "I look for grandma", "I see grandma"], "c": 1}, {"q": "'A reunião foi adiada':", "a": ["The meeting was put off", "The meeting put on", "Meeting off", "Was meeting late"], "c": 0}, {"q": "'Me dou bem com ele':", "a": ["I get along with him", "I go along him", "I get him along", "Along with him I"], "c": 0}]$q$::jsonb,'2027-06-03 12:00:00+00',true);
  end if;
end $blk$;

do $blk$
declare m uuid;
begin
  select id into m from public.mi_modules where name = $t$Idioms & Expressões$t$ order by created_at limit 1;
  if m is null then insert into public.mi_modules (ord,name,sub,emoji) values (11,$t$Idioms & Expressões$t$,$t$5 aulas · B1–B2$t$,$t$💡$t$) returning id into m;
  else update public.mi_modules set ord=11, sub=$t$5 aulas · B1–B2$t$, emoji=$t$💡$t$ where id=m; end if;
  if not exists (select 1 from public.mi_lessons where module_id = m) then
    insert into public.mi_lessons (module_id,ord,title,description,quiz,release_at,published) values
    (m,1,$t$Expressões do dia a dia que todo nativo usa$t$,$t$🎯 Objetivo: entender e usar as expressões que aparecem em toda conversa.

Piece of cake, break the ice, under the weather, it's up to you, no big deal. Cada uma com a situação real em que ela cabe.

✅ Pratique: use 3 delas em frases sobre a sua semana.$t$,$q$[{"q": "Piece of cake =", "a": ["Sobremesa", "Muito fácil", "Caro", "Doce demais"], "c": 1}, {"q": "Under the weather =", "a": ["Na chuva", "Meio doente/indisposto", "Viajando", "Com frio"], "c": 1}, {"q": "It's up to you =", "a": ["Está acima de você", "Você decide", "É sua culpa", "Sobe aí"], "c": 1}, {"q": "Break the ice =", "a": ["Quebrar gelo de verdade", "Quebrar o clima tenso / iniciar conversa", "Brigar", "Esfriar"], "c": 1}, {"q": "No big deal =", "a": ["Grande negócio", "Sem problema, nada demais", "Sem acordo", "Promoção"], "c": 1}]$q$::jsonb,'2027-06-07 12:00:00+00',true),
    (m,2,$t$Idioms de trabalho e dinheiro$t$,$t$🎯 Objetivo: acompanhar reunião e conversa de negócio sem ficar boiando.

On the same page, think outside the box, cut corners, break even, cost an arm and a leg, back to square one.

✅ Pratique: descreva um projeto seu usando 2 dessas.$t$,$q$[{"q": "On the same page =", "a": ["No mesmo livro", "Alinhados", "Atrasados", "Lendo junto"], "c": 1}, {"q": "Cost an arm and a leg =", "a": ["Machucar", "Custar muito caro", "Ser barato", "Ser grátis"], "c": 1}, {"q": "Cut corners =", "a": ["Cortar caminho de carro", "Fazer malfeito pra economizar", "Virar a esquina", "Decorar"], "c": 1}, {"q": "Break even =", "a": ["Quebrar tudo", "Empatar (sem lucro nem prejuízo)", "Falir", "Lucrar muito"], "c": 1}, {"q": "Back to square one =", "a": ["Voltar à estaca zero", "Ir pra praça", "Ganhar", "Avançar"], "c": 0}]$q$::jsonb,'2027-06-10 12:00:00+00',true),
    (m,3,$t$Idioms de sentimentos e relacionamentos$t$,$t$🎯 Objetivo: expressar emoção com a cor que o inglês real tem.

Over the moon, have a crush on, get on my nerves, heart-to-heart, a shoulder to cry on, see eye to eye.

✅ Pratique: conte um momento marcante usando 2 delas.$t$,$q$[{"q": "Over the moon =", "a": ["No espaço", "Felicíssimo", "Com sono", "Perdido"], "c": 1}, {"q": "Get on my nerves =", "a": ["Me acalma", "Me irrita", "Me cura", "Me anima"], "c": 1}, {"q": "See eye to eye =", "a": ["Encarar", "Concordar", "Enxergar bem", "Piscar"], "c": 1}, {"q": "Heart-to-heart =", "a": ["Cirurgia", "Conversa franca e profunda", "Abraço", "Namoro"], "c": 1}, {"q": "Have a crush on =", "a": ["Esmagar", "Ter uma queda por", "Brigar com", "Dever a"], "c": 1}]$q$::jsonb,'2027-06-14 12:00:00+00',true),
    (m,4,$t$Gírias atuais (e as que você deve evitar)$t$,$t$🎯 Objetivo: reconhecer gíria de série e rede social — e saber onde NÃO usar.

Cool, awesome, my bad, no worries, for real, hang on. Registro: o que cabe com amigo e o que nunca vai em e-mail de trabalho.

✅ Pratique: reescreva 3 frases formais em versão casual.$t$,$q$[{"q": "My bad =", "a": ["Meu mal", "Foi mal, erro meu", "Estou doente", "Minha cama"], "c": 1}, {"q": "No worries =", "a": ["Sem problema", "Sem preocupação nenhuma na vida", "Não ligo pra você", "Proibido"], "c": 0}, {"q": "For real? =", "a": ["De graça?", "Sério?", "Pra sempre?", "Real ou dólar?"], "c": 1}, {"q": "Gíria em e-mail de trabalho:", "a": ["Sempre", "Evitar — registro errado", "Obrigatório", "Só no assunto"], "c": 1}, {"q": "Hang on =", "a": ["Pendura", "Espera aí", "Desliga", "Corre"], "c": 1}]$q$::jsonb,'2027-06-17 12:00:00+00',true),
    (m,5,$t$Provérbios e expressões bíblicas no inglês$t$,$t$🎯 Objetivo: reconhecer expressões do dia a dia que vieram da Bíblia.

The blind leading the blind, a drop in the bucket, go the extra mile, by the skin of my teeth, the writing on the wall — a origem e o uso atual.

✅ Pratique: escolha a sua favorita e explique em inglês o que significa.$t$,$q$[{"q": "Go the extra mile =", "a": ["Correr mais", "Fazer além do esperado", "Viajar longe", "Desistir"], "c": 1}, {"q": "A drop in the bucket =", "a": ["Vazamento", "Quantia insignificante perto do necessário", "Chuva", "Balde cheio"], "c": 1}, {"q": "By the skin of my teeth =", "a": ["No dentista", "Por um triz", "Sorrindo", "Com dor"], "c": 1}, {"q": "The writing on the wall =", "a": ["Grafite", "Sinal claro de que algo ruim vem", "Lição escrita", "Quadro"], "c": 1}, {"q": "The blind leading the blind =", "a": ["Guia turístico", "Quem não sabe guiando quem não sabe", "Fila", "Ajuda certa"], "c": 1}]$q$::jsonb,'2027-06-21 12:00:00+00',true);
  end if;
end $blk$;

do $blk$
declare m uuid;
begin
  select id into m from public.mi_modules where name = $t$Inglês pela Música$t$ order by created_at limit 1;
  if m is null then insert into public.mi_modules (ord,name,sub,emoji) values (12,$t$Inglês pela Música$t$,$t$4 aulas · Todos os níveis$t$,$t$🎵$t$) returning id into m;
  else update public.mi_modules set ord=12, sub=$t$4 aulas · Todos os níveis$t$, emoji=$t$🎵$t$ where id=m; end if;
  if not exists (select 1 from public.mi_lessons where module_id = m) then
    insert into public.mi_lessons (module_id,ord,title,description,quiz,release_at,published) values
    (m,1,$t$O método de estudar com música (sem só cantar junto)$t$,$t$🎯 Objetivo: transformar música em aula — com método, não só diversão.

As 5 camadas: sentir → entender → dissecar → imitar → cantar de cor. Como escolher a música pelo seu nível e pelo que você quer treinar.

✅ Pratique: aplique as 5 camadas em 1 música essa semana.$t$,$q$[{"q": "Estudar com música é:", "a": ["Só cantar junto", "Seguir camadas: sentir → entender → dissecar → imitar → cantar", "Decorar tradução", "Ouvir de fundo"], "c": 1}, {"q": "A 1ª camada é:", "a": ["Gramática", "Sentir/curtir a música", "Prova", "Ditado"], "c": 1}, {"q": "Dissecar a letra significa:", "a": ["Rasgar", "Olhar vocabulário, expressões e ligações", "Traduzir no Google", "Trocar a letra"], "c": 1}, {"q": "Escolher música:", "a": ["A mais difícil", "Pelo seu nível e objetivo", "Aleatória", "Só nacional"], "c": 1}, {"q": "O ritmo de estudo ideal:", "a": ["10 músicas por dia", "1 música por semana, a fundo", "1 por ano", "Nenhuma"], "c": 1}]$q$::jsonb,'2027-06-24 12:00:00+00',true),
    (m,2,$t$Treino de pronúncia com música$t$,$t$🎯 Objetivo: usar o canto pra destravar som, ritmo e connected speech.

Por que cantar relaxa a boca e tira o medo; as reduções que só música mostra (gonna, wanna, 'cause, ain't); e o shadowing cantado.

✅ Pratique: 10 min de shadowing cantado com letra na tela.$t$,$q$[{"q": "Cantar ajuda a pronúncia porque:", "a": ["É mágico", "Ritmo e melodia guiam som e ligação", "É alto", "É rápido"], "c": 1}, {"q": "'Cause é redução de:", "a": ["case", "because", "cause mesmo", "course"], "c": 1}, {"q": "Wanna =", "a": ["want a/want to", "wait now", "one day", "went on"], "c": 0}, {"q": "Shadowing cantado é:", "a": ["Cantar por cima imitando o som exato", "Dublar mudo", "Traduzir cantando", "Assobiar"], "c": 0}, {"q": "Ain't é:", "a": ["Formal", "Informal (is not/are not/have not)", "Erro sempre", "Britânico só"], "c": 1}]$q$::jsonb,'2027-06-28 12:00:00+00',true),
    (m,3,$t$Gramática escondida nas letras$t$,$t$🎯 Objetivo: enxergar tempo verbal e estrutura dentro das músicas que você já ama.

Present perfect em 'I still haven't found...', condicional em 'If I were a boy', passado em baladas. Música como exemplo vivo de regra.

✅ Pratique: ache 1 tempo verbal em 3 músicas da sua playlist.$t$,$q$[{"q": "'I still haven't found' usa:", "a": ["Past simple", "Present perfect", "Futuro", "Imperativo"], "c": 1}, {"q": "'If I were a boy' é:", "a": ["Condicional hipotético", "Passado real", "Futuro certo", "Pergunta"], "c": 0}, {"q": "Música ajuda na gramática porque:", "a": ["Substitui estudo", "Dá exemplo real e memorável da regra", "É curta", "Rima"], "c": 1}, {"q": "Letra com 'ain't' e dupla negativa:", "a": ["Use em prova", "É registro informal — reconheça, mas cuidado ao copiar", "É formal", "É erro de impressão"], "c": 1}, {"q": "'Yesterday, all my troubles seemed so far away' está no:", "a": ["Presente", "Passado", "Futuro", "Condicional"], "c": 1}]$q$::jsonb,'2027-07-01 12:00:00+00',true),
    (m,4,$t$Worship em inglês: vocabulário de adoração$t$,$t$🎯 Objetivo: cantar e entender louvor em inglês com consciência do que está dizendo.

Worship, praise, grace, mercy, glory, holy, worthy, surrender; estruturas comuns em worship ('You are...', 'I will...') e pronúncia pra ministrar.

✅ Pratique: escolha um louvor em inglês e explique o refrão com suas palavras.$t$,$q$[{"q": "Worthy =", "a": ["Rico", "Digno", "Forte", "Antigo"], "c": 1}, {"q": "Grace x mercy:", "a": ["Iguais", "Graça (favor imerecido) x misericórdia", "Canto x oração", "Céu x terra"], "c": 1}, {"q": "Surrender =", "a": ["Vencer", "Render-se/entregar-se", "Cantar", "Subir"], "c": 1}, {"q": "Praise =", "a": ["Louvor", "Preço", "Prece silenciosa", "Prêmio"], "c": 0}, {"q": "Holy =", "a": ["Buraco", "Santo", "Feriado", "Inteiro"], "c": 1}]$q$::jsonb,'2027-07-05 12:00:00+00',true);
  end if;
end $blk$;

do $blk$
declare m uuid;
begin
  select id into m from public.mi_modules where name = $t$Inglês por Séries$t$ order by created_at limit 1;
  if m is null then insert into public.mi_modules (ord,name,sub,emoji) values (13,$t$Inglês por Séries$t$,$t$4 aulas · A2–B2$t$,$t$🎬$t$) returning id into m;
  else update public.mi_modules set ord=13, sub=$t$4 aulas · A2–B2$t$, emoji=$t$🎬$t$ where id=m; end if;
  if not exists (select 1 from public.mi_lessons where module_id = m) then
    insert into public.mi_lessons (module_id,ord,title,description,quiz,release_at,published) values
    (m,1,$t$O método de estudar com séries (legendas do jeito certo)$t$,$t$🎯 Objetivo: montar seu plano de séries: qual, como e quanto por dia.

A escada das legendas, sessão de estudo (20 min) x sessão de lazer, e a lista de séries por nível.

✅ Pratique: escolha SUA série de estudo e faça a 1ª sessão de 20 min.$t$,$q$[{"q": "Sessão de estudo dura:", "a": ["3 horas", "~20 min focados", "5 segundos", "O dia todo"], "c": 1}, {"q": "Sessão de estudo x lazer:", "a": ["Iguais", "Estudo: pausa, repete, anota; lazer: só curte", "Lazer é proibido", "Estudo sem áudio"], "c": 1}, {"q": "Pra começar, série boa é:", "a": ["Jurídica densa", "Sitcom do cotidiano", "Documentário técnico", "Shakespeare"], "c": 1}, {"q": "Legenda de estudo:", "a": ["PT", "EN", "Nenhuma no dia 1", "Duas"], "c": 1}, {"q": "Ter UMA série de estudo ajuda porque:", "a": ["Enjoa", "Você acostuma com as vozes e o vocabulário dela", "É mais barato", "Nada"], "c": 1}]$q$::jsonb,'2027-07-08 12:00:00+00',true),
    (m,2,$t$Técnica da cena repetida$t$,$t$🎯 Objetivo: extrair o máximo de UMA cena de 2 minutos.

Passo a passo: assistir → ler legenda → repetir fala por fala → encenar junto. Demonstração completa com uma cena.

✅ Pratique: aplique numa cena e grave você fazendo a fala.$t$,$q$[{"q": "A cena ideal tem:", "a": ["40 min", "1–3 minutos", "10 segundos", "Sem fala"], "c": 1}, {"q": "A ordem é:", "a": ["Encenar → ler", "Assistir → ler → repetir → encenar junto", "Só assistir", "Traduzir → dormir"], "c": 1}, {"q": "Repetir fala por fala treina:", "a": ["Só memória", "Pronúncia, ritmo e expressão", "Nada", "Escrita"], "c": 1}, {"q": "Encenar junto é:", "a": ["Vergonhoso", "Shadowing com emoção — o nível máximo", "Inútil", "Só pra ator"], "c": 1}, {"q": "Quantas cenas por sessão?", "a": ["20", "1 bem feita", "Nenhuma", "Episódio inteiro"], "c": 1}]$q$::jsonb,'2027-07-12 12:00:00+00',true),
    (m,3,$t$Anotando vocabulário sem travar o episódio$t$,$t$🎯 Objetivo: capturar expressão nova sem transformar série em tortura.

A regra das 5: no máximo 5 anotações por episódio, sempre a FRASE inteira (não a palavra solta), e revisão no dia seguinte.

✅ Pratique: 1 episódio, 5 frases anotadas, revisão amanhã.$t$,$q$[{"q": "Máximo de anotações por episódio:", "a": ["50", "5", "0", "Todas as palavras"], "c": 1}, {"q": "Anotar:", "a": ["Palavra solta", "A frase inteira com contexto", "Só tradução", "Só o minuto"], "c": 1}, {"q": "Pausar a cada palavra nova:", "a": ["Ideal", "Mata o prazer e o ritmo — evite", "Obrigatório", "Tanto faz"], "c": 1}, {"q": "A revisão é:", "a": ["Nunca", "No dia seguinte", "Em 1 ano", "Durante a cena"], "c": 1}, {"q": "Frase inteira é melhor porque:", "a": ["Ocupa mais", "Traz uso real e gramática junto", "É mais bonita", "Não é"], "c": 1}]$q$::jsonb,'2027-07-15 12:00:00+00',true),
    (m,4,$t$Do entendimento passivo à fala ativa$t$,$t$🎯 Objetivo: fazer o que você entende na série virar o que você FALA.

A ponte: resumir o episódio em voz alta, roubar 1 frase por dia pra usar na vida real, e comentar a série em inglês.

✅ Pratique: resuma em 1 min o último episódio que você viu.$t$,$q$[{"q": "Entender não vira falar sozinho porque:", "a": ["Preguiça", "Falar exige prática de PRODUÇÃO", "É impossível", "Falta legenda"], "c": 1}, {"q": "A ponte passivo → ativo:", "a": ["Ver mais séries", "Resumir em voz alta e reutilizar frases", "Ler roteiro", "Dublar em PT"], "c": 1}, {"q": "'Roubar' 1 frase por dia é:", "a": ["Plágio", "Reutilizar na sua vida real", "Decorar roteiro", "Inútil"], "c": 1}, {"q": "Resumir o episódio treina:", "a": ["Só memória", "Organização de ideias e vocabulário ativo", "Nada", "Audição só"], "c": 1}, {"q": "Comentar a série em inglês pode ser:", "a": ["Só escrito formal", "Falando sozinho, gravando ou nos comentários da aula", "Proibido", "Só com nativo"], "c": 1}]$q$::jsonb,'2027-07-19 12:00:00+00',true);
  end if;
end $blk$;

do $blk$
declare m uuid;
begin
  select id into m from public.mi_modules where name = $t$Business English$t$ order by created_at limit 1;
  if m is null then insert into public.mi_modules (ord,name,sub,emoji) values (14,$t$Business English$t$,$t$5 aulas · B1–B2$t$,$t$💼$t$) returning id into m;
  else update public.mi_modules set ord=14, sub=$t$5 aulas · B1–B2$t$, emoji=$t$💼$t$ where id=m; end if;
  if not exists (select 1 from public.mi_lessons where module_id = m) then
    insert into public.mi_lessons (module_id,ord,title,description,quiz,release_at,published) values
    (m,1,$t$Reuniões: participar, opinar e conduzir$t$,$t$🎯 Objetivo: entrar numa reunião em inglês e contribuir sem medo.

Abrir (Let's get started), pedir a palavra (Can I jump in?), concordar/discordar, esclarecer (Just to clarify...) e fechar com próximos passos.

✅ Pratique: simule abrir e fechar uma reunião de 1 minuto.$t$,$q$[{"q": "Abrir a reunião:", "a": ["Start now all", "Let's get started", "Begin you", "Go go"], "c": 1}, {"q": "Pedir a palavra:", "a": ["Stop talking", "Can I jump in here?", "Me now", "Silence"], "c": 1}, {"q": "Esclarecer:", "a": ["What?!", "Just to clarify...", "Repeat all", "I no understand nothing"], "c": 1}, {"q": "Fechar com encaminhamento:", "a": ["Bye", "So, the next steps are...", "Finish", "Go home"], "c": 1}, {"q": "'Let's take this offline' =", "a": ["Desligar a internet", "Tratar disso fora da reunião", "Cancelar", "Imprimir"], "c": 1}]$q$::jsonb,'2027-07-22 12:00:00+00',true),
    (m,2,$t$E-mails profissionais que funcionam$t$,$t$🎯 Objetivo: escrever e-mail claro, educado e direto — em 5 minutos.

Assunto que funciona, saudação por nível de formalidade, a estrutura objetivo → detalhe → pedido → fecho, e frases prontas.

✅ Pratique: escreva 1 e-mail pedindo uma informação.$t$,$q$[{"q": "Estrutura do e-mail:", "a": ["Fecho → saudação", "Objetivo → detalhe → pedido → fecho", "Só pedido", "História longa"], "c": 1}, {"q": "Fecho profissional:", "a": ["Kisses", "Best regards", "Bye bye", "See ya babe"], "c": 1}, {"q": "'I'm writing to...' serve pra:", "a": ["Despedir", "Abrir dizendo o objetivo", "Reclamar", "Assinar"], "c": 1}, {"q": "'Please find attached' =", "a": ["Ache o anexo você", "Segue em anexo", "Anexo perdido", "Favor atacar"], "c": 1}, {"q": "Bom assunto de e-mail é:", "a": ["'Hi'", "Específico: 'Meeting reschedule – Friday 2pm'", "Vazio", "TUDO EM MAIÚSCULA!!!"], "c": 1}]$q$::jsonb,'2027-07-26 12:00:00+00',true),
    (m,3,$t$Apresentações e pitch em inglês$t$,$t$🎯 Objetivo: apresentar uma ideia em inglês com estrutura e segurança.

Abertura que prende, sinalizadores (First... Moving on... To sum up), falar de números e gráficos, e o Q&A sem pânico.

✅ Pratique: pitch de 60 segundos de um projeto seu, gravado.$t$,$q$[{"q": "Sinalizador de transição:", "a": ["Hmm", "Moving on to...", "Wait", "Stop"], "c": 1}, {"q": "Fechar a apresentação:", "a": ["That's all folks bye", "To sum up...", "End", "No more"], "c": 1}, {"q": "Não sabe a resposta no Q&A:", "a": ["Inventar", "'Let me get back to you on that'", "Silêncio", "Mudar de sala"], "c": 1}, {"q": "'Sales went up by 20%' =", "a": ["Vendas caíram 20%", "Vendas subiram 20%", "Vendas em 20", "20 vendas"], "c": 1}, {"q": "Boa abertura:", "a": ["Ler o slide", "Pergunta, dado ou história curta", "Pedir desculpa pelo inglês", "Silêncio longo"], "c": 1}]$q$::jsonb,'2027-07-29 12:00:00+00',true),
    (m,4,$t$Entrevista de emprego em inglês$t$,$t$🎯 Objetivo: responder as 6 perguntas clássicas com estrutura e confiança.

'Tell me about yourself', forças e fraquezas, 'Why should we hire you?' — e o método STAR (Situation, Task, Action, Result).

✅ Pratique: grave sua resposta de 'Tell me about yourself' (90s).$t$,$q$[{"q": "STAR significa:", "a": ["Start, Talk, Ask, Rest", "Situation, Task, Action, Result", "Smile, Think, Answer, Run", "Nada"], "c": 1}, {"q": "'Tell me about yourself' pede:", "a": ["Sua vida inteira", "Resumo profissional focado na vaga", "Seu signo", "Seu endereço"], "c": 1}, {"q": "Falando de fraqueza:", "a": ["'I have none'", "Uma real + o que você faz pra melhorar", "Chorar", "Mudar de assunto"], "c": 1}, {"q": "'Why should we hire you?' responde-se com:", "a": ["'I need money'", "Valor que você entrega + evidência", "'Because yes'", "Silêncio"], "c": 1}, {"q": "No fim, 'Do you have any questions?':", "a": ["'No'", "Faça 1–2 perguntas inteligentes", "Vá embora", "Peça aumento"], "c": 1}]$q$::jsonb,'2027-08-02 12:00:00+00',true),
    (m,5,$t$Negociação e networking$t$,$t$🎯 Objetivo: propor, contrapropor e criar conexão profissional em inglês.

Linguagem de negociação suave (What if we... / Would you be open to...), fechar acordo, e small talk de evento: como iniciar e SAIR de uma conversa.

✅ Pratique: simule uma contraproposta em 3 frases.$t$,$q$[{"q": "Proposta suave:", "a": ["You must accept", "Would you be open to...?", "Take it or leave", "Give me discount"], "c": 1}, {"q": "'What if we...' serve pra:", "a": ["Ameaçar", "Sugerir alternativa", "Encerrar", "Reclamar"], "c": 1}, {"q": "Fechar acordo:", "a": ["We have a deal", "We are deal", "Deal is we", "Done you"], "c": 0}, {"q": "Sair de conversa com elegância:", "a": ["Sumir", "'It was great talking to you — let's keep in touch'", "'Bye boring'", "Olhar o celular"], "c": 1}, {"q": "'Let's meet halfway' =", "a": ["Encontro no meio da rua", "Cada lado cede um pouco", "Metade do preço sempre", "Reunião cancelada"], "c": 1}]$q$::jsonb,'2027-08-05 12:00:00+00',true);
  end if;
end $blk$;

do $blk$
declare m uuid;
begin
  select id into m from public.mi_modules where name = $t$Escrita em Inglês$t$ order by created_at limit 1;
  if m is null then insert into public.mi_modules (ord,name,sub,emoji) values (15,$t$Escrita em Inglês$t$,$t$3 aulas · A2–B2$t$,$t$✏️$t$) returning id into m;
  else update public.mi_modules set ord=15, sub=$t$3 aulas · A2–B2$t$, emoji=$t$✏️$t$ where id=m; end if;
  if not exists (select 1 from public.mi_lessons where module_id = m) then
    insert into public.mi_lessons (module_id,ord,title,description,quiz,release_at,published) values
    (m,1,$t$Mensagens e redes sociais sem vergonha$t$,$t$🎯 Objetivo: escrever mensagem, comentário e legenda em inglês natural.

Abreviações reais (btw, tbh, idk, lol), tom casual, e os erros que entregam tradução literal.

✅ Pratique: comente em inglês em 3 posts hoje (pode ser nos comentários das aulas!).$t$,$q$[{"q": "btw =", "a": ["between", "by the way", "but why", "best way"], "c": 1}, {"q": "idk =", "a": ["I don't know", "I did king", "in da kitchen", "I do know"], "c": 0}, {"q": "tbh =", "a": ["to be honest", "the best hour", "to be happy", "thanks by helping"], "c": 0}, {"q": "Tradução literal de 'fazer aniversário':", "a": ["'make birthday' ✗ → o certo é 'have a birthday / turn 30'", "'do birthday' está certo", "'make anniversary'", "'birth make'"], "c": 0}, {"q": "Praticar escrita todo dia pode ser:", "a": ["Só redação longa", "Comentários e mensagens curtas", "Impossível", "Só no caderno"], "c": 1}]$q$::jsonb,'2027-08-09 12:00:00+00',true),
    (m,2,$t$Textos claros: parágrafos, conectores e revisão$t$,$t$🎯 Objetivo: escrever um parágrafo organizado e revisar sozinho.

Uma ideia por parágrafo, frase-tópico, conectores, e o checklist de revisão em 4 passos (sujeito, tempo verbal, artigo, pontuação).

✅ Pratique: 1 parágrafo de 6 linhas sobre seu fim de semana + revisão.$t$,$q$[{"q": "Cada parágrafo tem:", "a": ["Dez ideias", "Uma ideia central", "Só conectores", "Uma palavra"], "c": 1}, {"q": "Frase-tópico é:", "a": ["A última", "A que apresenta a ideia do parágrafo", "Um título", "A mais longa"], "c": 1}, {"q": "O checklist de revisão olha:", "a": ["Só vírgula", "Sujeito, tempo verbal, artigo, pontuação", "Fonte", "Cor"], "c": 1}, {"q": "Em inglês, o sujeito:", "a": ["Pode sumir como no português", "Quase sempre é obrigatório (IT is raining)", "É opcional", "Vem no fim"], "c": 1}, {"q": "Frases em inglês claro tendem a ser:", "a": ["Longas e enroladas", "Curtas e diretas", "Sem verbo", "Só perguntas"], "c": 1}]$q$::jsonb,'2027-08-12 12:00:00+00',true),
    (m,3,$t$Usando IA pra revisar (sem depender dela)$t$,$t$🎯 Objetivo: usar IA como professor de revisão — não como muleta que escreve por você.

O fluxo certo: você escreve → pede correção COM explicação → reescreve sem olhar. Prompts prontos e os riscos de terceirizar o cérebro.

✅ Pratique: escreva 5 frases, peça correção explicada e reescreva.$t$,$q$[{"q": "O fluxo certo é:", "a": ["IA escreve tudo", "Você escreve → IA corrige explicando → você reescreve", "Copiar e colar", "Não usar nunca"], "c": 1}, {"q": "Pedir 'explique cada correção' serve pra:", "a": ["Gastar tempo", "Aprender o porquê do erro", "Nada", "Enfeitar"], "c": 1}, {"q": "O risco de a IA escrever por você:", "a": ["Nenhum", "Você não desenvolve a habilidade", "Fica caro", "Fica lento"], "c": 1}, {"q": "Reescrever sem olhar a correção:", "a": ["Inútil", "Fixa o aprendizado", "Proibido", "Demora demais"], "c": 1}, {"q": "IA como revisor é:", "a": ["Muleta", "Ferramenta — quem escreve é você", "Professor substituto total", "Golpe"], "c": 1}]$q$::jsonb,'2027-08-16 12:00:00+00',true);
  end if;
end $blk$;
-- Modo edição dentro da plataforma (rodar depois do COLE-NO-SUPABASE.sql e do membros.sql)
-- 1) cards de qualquer menu (não só eom/culture/viagens) e regra de acesso por card
alter table public.mi_uni_cards drop constraint if exists mi_uni_cards_universo_check;
alter table public.mi_uni_cards add constraint mi_uni_cards_universo_check check (universo ~ '^[a-z0-9_-]{1,30}$');
alter table public.mi_uni_cards add column if not exists acesso text not null default 'todos';
alter table public.mi_uni_cards drop constraint if exists mi_uni_cards_acesso_check;
alter table public.mi_uni_cards add constraint mi_uni_cards_acesso_check check (acesso in ('todos','programa','produto'));
alter table public.mi_uni_cards add column if not exists produto text;
alter table public.mi_uni_cards add column if not exists checkout text;

-- 2) materiais com capa, seção, preço e visível/oculto
alter table public.materiais add column if not exists capa_url text;
alter table public.materiais add column if not exists secao text default '';
alter table public.materiais add column if not exists preco text default '';
alter table public.materiais add column if not exists ativo boolean not null default true;
