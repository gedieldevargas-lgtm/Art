-- englishbygediel · conteúdo editável do Hub (rode DEPOIS do admin.sql)
-- Cole tudo no Supabase: SQL Editor → New query → Run.
-- Cria a tabela site_config: uma linha com id 'hub' guarda todo o conteúdo do Hub (cores, modos, cards, textos).
-- Todo mundo lê (o Hub precisa ler), só o admin salva. As imagens enviadas vão pra pasta 'capas', que já existe.

create table if not exists public.site_config (
  id          text primary key check (char_length(id) between 1 and 40),
  dados       jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);
alter table public.site_config enable row level security;

drop policy if exists "todos leem site_config" on public.site_config;
create policy "todos leem site_config" on public.site_config for select to anon, authenticated using (true);
drop policy if exists "admin cria site_config" on public.site_config;
create policy "admin cria site_config" on public.site_config for insert to authenticated with check (public.is_admin());
drop policy if exists "admin edita site_config" on public.site_config;
create policy "admin edita site_config" on public.site_config for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin apaga site_config" on public.site_config;
create policy "admin apaga site_config" on public.site_config for delete to authenticated using (public.is_admin());
