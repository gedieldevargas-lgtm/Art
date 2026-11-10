-- englishbygediel · marcações do painel (rode DEPOIS do admin.sql)
-- Cole no Supabase: SQL Editor → New query → Run.
-- Guarda o "já chamei no WhatsApp" de cada contato/pessoa, pra você não chamar duas vezes.
create table if not exists public.crm_marcas (
  chave       text primary key check (char_length(chave) between 1 and 200),  -- ex.: lead:<id>, tel:5555999...
  chamado     boolean not null default false,
  chamado_em  timestamptz,
  nota        text check (char_length(nota) <= 1000),
  updated_at  timestamptz not null default now()
);
alter table public.crm_marcas enable row level security;
drop policy if exists "admin le crm" on public.crm_marcas;
create policy "admin le crm" on public.crm_marcas for select to authenticated using (public.is_admin());
drop policy if exists "admin cria crm" on public.crm_marcas;
create policy "admin cria crm" on public.crm_marcas for insert to authenticated with check (public.is_admin());
drop policy if exists "admin edita crm" on public.crm_marcas;
create policy "admin edita crm" on public.crm_marcas for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin apaga crm" on public.crm_marcas;
create policy "admin apaga crm" on public.crm_marcas for delete to authenticated using (public.is_admin());
