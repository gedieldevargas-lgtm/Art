-- SALA DE MENTORIA INDIVIDUAL (Google Meet fixo + aviso "Gediel online").
-- Só quem tem o Plano Gênio (ou o que estiver em acesso.dados.mentoria) lê o link da sala; só o admin escreve. Pode rodar mais de uma vez.
create or replace function public.mentoria_acesso() returns boolean language sql stable security definer set search_path=public as
$$ select public.sou_admin() or exists(
     select 1 from acesso a, jsonb_array_elements_text(coalesce(a.dados->'mentoria','["Plano Gênio"]'::jsonb)) t
     where a.id='cfg' and public.comprei(t)) or public.comprei('Plano Gênio') $$;

create table if not exists public.mi_mentoria (
  id text primary key default 'sala',
  link text,                         -- link fixo do Google Meet
  online boolean not null default false,
  online_at timestamptz,             -- batimento: o site do Gediel renova a cada 1 min enquanto ele está na sala
  nome text default 'Gediel'
);
insert into public.mi_mentoria(id) values('sala') on conflict do nothing;

alter table public.mi_mentoria enable row level security;
drop policy if exists mentoria_ler on public.mi_mentoria;
create policy mentoria_ler on public.mi_mentoria for select using (public.mentoria_acesso());
drop policy if exists mentoria_escrever on public.mi_mentoria;
create policy mentoria_escrever on public.mi_mentoria for all using (public.sou_admin()) with check (public.sou_admin());
