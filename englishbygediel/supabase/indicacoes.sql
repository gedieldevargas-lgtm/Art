-- rode no projeto dos MEMBROS (jzdxcefnlwjgimymgsux)
-- Indique e ganhe: o comercial registra quem fechou pelo convite de quem
create table if not exists public.mi_indicacoes (
  id uuid primary key default gen_random_uuid(),
  indicador_email text not null,
  indicado_nome text,
  indicado_email text,
  cupom text,
  created_at timestamptz default now());
alter table public.mi_indicacoes enable row level security;
drop policy if exists ind_ler on public.mi_indicacoes;
create policy ind_ler on public.mi_indicacoes for select to authenticated using (lower(indicador_email)=public.meu_email() or public.sou_admin());
drop policy if exists ind_admin on public.mi_indicacoes;
create policy ind_admin on public.mi_indicacoes for all to authenticated using (public.sou_admin()) with check (public.sou_admin());
