-- ENCONTROS DA MENTORIA (aba "Mentoria" da área de membros). Rode DEPOIS do supabase/mentorias-salas.sql. Pode rodar mais de uma vez.
-- Quantos encontros foram combinados com cada mentoria + cada encontro (pedido / confirmado / feito / cancelado).
-- O aluno só lê os encontros do e-mail dele e só consegue criar "pedido"; o admin (tabela admins) vê e edita tudo.
alter table public.mi_mentorias add column if not exists encontros_total int;

create table if not exists public.mi_mentoria_encontros (
  id uuid primary key default gen_random_uuid(),
  mentoria_id uuid not null references public.mi_mentorias(id) on delete cascade,
  email text,                                   -- quem pediu (aluno)
  inicio timestamptz not null,
  status text not null default 'pedido' check (status in ('pedido','confirmado','feito','cancelado')),
  tipo text,
  obs text,
  created_at timestamptz not null default now()
);
create index if not exists mi_mentoria_enc_ix on public.mi_mentoria_encontros (mentoria_id, inicio);
alter table public.mi_mentoria_encontros enable row level security;

drop policy if exists ment_en_adm on public.mi_mentoria_encontros;
create policy ment_en_adm on public.mi_mentoria_encontros for all using (public.is_admin()) with check (public.is_admin());

-- o aluno enxerga os encontros das mentorias em que o e-mail dele está
drop policy if exists ment_en_ler on public.mi_mentoria_encontros;
create policy ment_en_ler on public.mi_mentoria_encontros for select using (
  exists (select 1 from public.mi_mentorias m where m.id = mentoria_id and m.ativo and lower(coalesce(auth.jwt() ->> 'email', '')) = any(m.emails)));
-- e pode pedir um encontro novo (sempre como "pedido")
drop policy if exists ment_en_pedir on public.mi_mentoria_encontros;
create policy ment_en_pedir on public.mi_mentoria_encontros for insert with check (
  status = 'pedido' and lower(coalesce(email, '')) = lower(coalesce(auth.jwt() ->> 'email', ''))
  and exists (select 1 from public.mi_mentorias m where m.id = mentoria_id and m.ativo and lower(coalesce(auth.jwt() ->> 'email', '')) = any(m.emails)));
