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
