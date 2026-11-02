-- englishbygediel · painel do Gediel (rode DEPOIS do schema.sql)
-- Cole tudo no Supabase: SQL Editor → New query → Run.
-- Cria: produtos (o que aparece no catálogo), acessos (quantas pessoas entraram),
-- a pasta de capas e a regra de que só o e-mail da tabela admins vê contatos e edita produtos.

-- 1. Quem é admin -------------------------------------------------------------
create table if not exists public.admins (email text primary key);
insert into public.admins (email) values ('gedieldevargas@gmail.com') on conflict do nothing;
alter table public.admins enable row level security;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where lower(email) = lower(auth.jwt() ->> 'email'));
$$;

drop policy if exists "admin le admins" on public.admins;
create policy "admin le admins" on public.admins for select to authenticated using (public.is_admin());

-- 2. Contatos: o modo escolhido e leitura só pro admin ------------------------
alter table public.leads add column if not exists modo text check (modo is null or char_length(modo) <= 40);

drop policy if exists "admin le leads" on public.leads;
create policy "admin le leads" on public.leads for select to authenticated using (public.is_admin());
drop policy if exists "admin apaga leads" on public.leads;
create policy "admin apaga leads" on public.leads for delete to authenticated using (public.is_admin());
drop policy if exists "admin le events" on public.events;
create policy "admin le events" on public.events for select to authenticated using (public.is_admin());

-- 3. Acessos: cada visita conta, mesmo sem cadastro ---------------------------
create table if not exists public.acessos (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  sessao      uuid not null,
  tipo        text not null check (tipo in ('entrou','modo')),
  item        text check (item is null or char_length(item) <= 60),
  origem      text check (origem is null or char_length(origem) <= 300),
  dispositivo text check (dispositivo is null or char_length(dispositivo) <= 300)
);
create index if not exists acessos_data_idx on public.acessos (created_at);
alter table public.acessos enable row level security;
drop policy if exists "site insere acessos" on public.acessos;
create policy "site insere acessos" on public.acessos for insert to anon with check (true);
drop policy if exists "admin le acessos" on public.acessos;
create policy "admin le acessos" on public.acessos for select to authenticated using (public.is_admin());

-- 4. Produtos: o que você cadastra no painel aparece no catálogo --------------
create table if not exists public.produtos (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  titulo      text not null check (char_length(titulo) between 1 and 120),
  segmento    text not null check (char_length(segmento) between 1 and 60),
  descricao   text check (descricao is null or char_length(descricao) <= 1200),
  link        text check (link is null or char_length(link) <= 500),
  capa_url    text check (capa_url is null or char_length(capa_url) <= 500),
  tipo        text not null default 'gratis' check (tipo in ('gratis','pago','mentoria','breve')),
  preco       text check (preco is null or char_length(preco) <= 40),
  botao       text check (botao is null or char_length(botao) <= 60),
  ordem       int  not null default 100,
  ativo       boolean not null default true
);
alter table public.produtos enable row level security;
drop policy if exists "todos veem produtos ativos" on public.produtos;
create policy "todos veem produtos ativos" on public.produtos for select to anon, authenticated using (ativo or public.is_admin());
drop policy if exists "admin cria produtos" on public.produtos;
create policy "admin cria produtos" on public.produtos for insert to authenticated with check (public.is_admin());
drop policy if exists "admin edita produtos" on public.produtos;
create policy "admin edita produtos" on public.produtos for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin apaga produtos" on public.produtos;
create policy "admin apaga produtos" on public.produtos for delete to authenticated using (public.is_admin());

-- 5. Pasta de capas (imagens públicas, só o admin envia) ----------------------
insert into storage.buckets (id, name, public) values ('capas', 'capas', true) on conflict (id) do nothing;
drop policy if exists "capas publicas" on storage.objects;
create policy "capas publicas" on storage.objects for select to anon, authenticated using (bucket_id = 'capas');
drop policy if exists "admin envia capas" on storage.objects;
create policy "admin envia capas" on storage.objects for insert to authenticated with check (bucket_id = 'capas' and public.is_admin());
drop policy if exists "admin troca capas" on storage.objects;
create policy "admin troca capas" on storage.objects for update to authenticated using (bucket_id = 'capas' and public.is_admin());
drop policy if exists "admin apaga capas" on storage.objects;
create policy "admin apaga capas" on storage.objects for delete to authenticated using (bucket_id = 'capas' and public.is_admin());
