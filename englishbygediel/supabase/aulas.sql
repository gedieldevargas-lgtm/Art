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
