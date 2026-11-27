-- FEED DA COMUNIDADE + FOTO DE PERFIL OBRIGATÓRIA
-- Rode UMA vez no Supabase → SQL Editor → New query → cole tudo → Run.
-- (Precisa da função public.is_admin() — já existe se você rodou o COLE-NO-SUPABASE.sql.)

-- 1) PERFIS (foto de cada aluno) ------------------------------------------------
create table if not exists public.mi_perfis (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nome text,
  foto text,                       -- foto 320x320 já comprimida (data URL)
  status text not null default 'ok',  -- ok | pendente (detector indisponível) | rejeitada
  motivo text,
  atualizado timestamptz default now()
);
alter table public.mi_perfis enable row level security;
drop policy if exists "perfis leitura" on public.mi_perfis;
create policy "perfis leitura" on public.mi_perfis for select to authenticated using (true);
drop policy if exists "perfis insere o seu" on public.mi_perfis;
create policy "perfis insere o seu" on public.mi_perfis for insert to authenticated
  with check (user_id = auth.uid() and status in ('ok','pendente'));
drop policy if exists "perfis atualiza o seu" on public.mi_perfis;
create policy "perfis atualiza o seu" on public.mi_perfis for update to authenticated
  using (user_id = auth.uid() and status <> 'rejeitada') with check (user_id = auth.uid() and status in ('ok','pendente'));
-- aluno reprovado: só troca a foto (volta para ok/pendente); a reprovação em si é do admin
drop policy if exists "perfis aluno refaz" on public.mi_perfis;
create policy "perfis aluno refaz" on public.mi_perfis for update to authenticated
  using (user_id = auth.uid() and status = 'rejeitada') with check (user_id = auth.uid() and status in ('ok','pendente'));
drop policy if exists "perfis admin" on public.mi_perfis;
create policy "perfis admin" on public.mi_perfis for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 2) FEED -----------------------------------------------------------------------
create table if not exists public.mi_feed_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nome text,
  texto text check (char_length(texto) <= 600),
  midia_url text,
  midia_tipo text check (midia_tipo in ('imagem','video','youtube')),
  criado timestamptz default now()
);
create index if not exists mi_feed_posts_criado on public.mi_feed_posts (criado desc);
alter table public.mi_feed_posts enable row level security;
drop policy if exists "feed le" on public.mi_feed_posts;
create policy "feed le" on public.mi_feed_posts for select to authenticated using (true);
drop policy if exists "feed posta" on public.mi_feed_posts;
create policy "feed posta" on public.mi_feed_posts for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "feed apaga" on public.mi_feed_posts;
create policy "feed apaga" on public.mi_feed_posts for delete to authenticated using (user_id = auth.uid() or public.is_admin());

create table if not exists public.mi_feed_likes (
  post_id uuid not null references public.mi_feed_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  primary key (post_id, user_id)
);
alter table public.mi_feed_likes enable row level security;
drop policy if exists "likes le" on public.mi_feed_likes;
create policy "likes le" on public.mi_feed_likes for select to authenticated using (true);
drop policy if exists "likes cria" on public.mi_feed_likes;
create policy "likes cria" on public.mi_feed_likes for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "likes tira" on public.mi_feed_likes;
create policy "likes tira" on public.mi_feed_likes for delete to authenticated using (user_id = auth.uid());

-- 3) PASTA DE FOTOS E VÍDEOS DO FEED (pública para ler, cada um envia na sua pasta) ---------
insert into storage.buckets (id, name, public, file_size_limit)
values ('feed', 'feed', true, 31457280)       -- 30 MB por arquivo
on conflict (id) do update set public = true, file_size_limit = 31457280;
drop policy if exists "feed envia" on storage.objects;
create policy "feed envia" on storage.objects for insert to authenticated
  with check (bucket_id = 'feed' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "feed apaga arquivo" on storage.objects;
create policy "feed apaga arquivo" on storage.objects for delete to authenticated
  using (bucket_id = 'feed' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));
