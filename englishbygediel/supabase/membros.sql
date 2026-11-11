-- ÁREA DE MEMBROS — rode no projeto dos MEMBROS (jzdxcefnlwjgimymgsux), SQL Editor.
-- Pode rodar mais de uma vez. Troque SEU_EMAIL_DE_LOGIN no final pelo e-mail que você usa pra entrar na área de membros.

create table if not exists public.admins (email text primary key);
create table if not exists public.compras (
  pedido text primary key, email text not null, produto_id text, produto text, created_at timestamptz default now());
create index if not exists compras_email on public.compras (lower(email));
create table if not exists public.acesso (id text primary key, dados jsonb not null default '{}');
create table if not exists public.materiais (
  id uuid primary key default gen_random_uuid(), nome text not null, descricao text default '', icone text default '📘',
  tipo text not null default 'gratis' check (tipo in ('gratis','produto','programa')),
  produto text default '', checkout text default '', ordem int default 0, created_at timestamptz default now());
create table if not exists public.material_links (
  material_id uuid primary key references public.materiais(id) on delete cascade, link text not null default '');

create or replace function public.meu_email() returns text language sql stable as
$$ select lower(coalesce(auth.jwt()->>'email','')) $$;
create or replace function public.sou_admin() returns boolean language sql stable security definer set search_path=public as
$$ select exists(select 1 from admins where lower(email)=public.meu_email()) $$;
-- comprou algum produto cujo nome contém o trecho?
create or replace function public.comprei(trecho text) returns boolean language sql stable security definer set search_path=public as
$$ select coalesce(trecho,'')<>'' and (
     exists(select 1 from compras where lower(email)=public.meu_email() and produto ilike '%'||trecho||'%')
     or coalesce(auth.jwt()->'user_metadata'->>'produto','') ilike '%'||trecho||'%') $$;
create or replace function public.tenho_programa() returns boolean language sql stable security definer set search_path=public as
$$ select exists(select 1 from acesso a, jsonb_array_elements_text(coalesce(a.dados->'programa','[]'::jsonb)) t
                 where a.id='cfg' and public.comprei(t)) $$;

alter table public.admins enable row level security;
alter table public.compras enable row level security;
alter table public.acesso enable row level security;
alter table public.materiais enable row level security;
alter table public.material_links enable row level security;

drop policy if exists admins_ler on public.admins;
create policy admins_ler on public.admins for select to authenticated using (public.sou_admin());
drop policy if exists compras_ler on public.compras;
create policy compras_ler on public.compras for select to authenticated using (lower(email)=public.meu_email() or public.sou_admin());
drop policy if exists compras_admin on public.compras;
create policy compras_admin on public.compras for all to authenticated using (public.sou_admin()) with check (public.sou_admin());
drop policy if exists acesso_ler on public.acesso;
create policy acesso_ler on public.acesso for select to authenticated using (true);
drop policy if exists acesso_admin on public.acesso;
create policy acesso_admin on public.acesso for all to authenticated using (public.sou_admin()) with check (public.sou_admin());
drop policy if exists materiais_ler on public.materiais;
create policy materiais_ler on public.materiais for select to authenticated using (true);
drop policy if exists materiais_admin on public.materiais;
create policy materiais_admin on public.materiais for all to authenticated using (public.sou_admin()) with check (public.sou_admin());
-- o link de download só sai pra quem tem direito
drop policy if exists links_ler on public.material_links;
create policy links_ler on public.material_links for select to authenticated using (
  public.sou_admin() or exists(select 1 from public.materiais m where m.id=material_id and (
    m.tipo='gratis' or public.tenho_programa() or (m.tipo='produto' and public.comprei(m.produto)))));
drop policy if exists links_admin on public.material_links;
create policy links_admin on public.material_links for all to authenticated using (public.sou_admin()) with check (public.sou_admin());

insert into public.acesso (id, dados) values ('cfg', '{"programa":["Programa em Grupo","Inglês de Cada Dia"],"jogosGratis":[],"checkout":"https://pay.kiwify.com.br/CohRPDI"}')
on conflict (id) do nothing;

insert into public.admins (email) values ('SEU_EMAIL_DE_LOGIN') on conflict do nothing;
