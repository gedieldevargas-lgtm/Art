-- DEVOCIONAIS / ENGLISH ON MISSION — rode no projeto dos MEMBROS (jzdxcefnlwjgimymgsux), SQL Editor.
-- Precisa do membros.sql já rodado. Pode rodar mais de uma vez.

create table if not exists public.devocionais (
  video_id text primary key,
  titulo text not null,
  capa text default '',
  ordem int default 0,          -- posição na playlist do YouTube (1 = mais novo)
  created_at timestamptz default now());

create or replace function public.tenho_eom() returns boolean language sql stable security definer set search_path=public as
$$ select exists(select 1 from acesso a, jsonb_array_elements_text(coalesce(a.dados->'eom','[]'::jsonb)) t
                 where a.id='cfg' and public.comprei(t)) $$;

alter table public.devocionais enable row level security;
drop policy if exists dev_ler on public.devocionais;
create policy dev_ler on public.devocionais for select to authenticated
  using (public.sou_admin() or public.tenho_programa() or public.tenho_eom());
drop policy if exists dev_admin on public.devocionais;
create policy dev_admin on public.devocionais for all to authenticated
  using (public.sou_admin()) with check (public.sou_admin());

-- produto da Kiwify que libera (trecho do nome) e o link de assinatura
update public.acesso set dados = dados || '{"eom":["English on Mission"],"checkoutEom":"https://pay.kiwify.com.br/oIjfTK8"}'::jsonb where id='cfg';
