-- MURAL do English on Mission (feed de textos + comentários). Só quem pagou lê e escreve. Pode rodar mais de uma vez.
create or replace function public.mural_acesso() returns boolean language sql stable security definer set search_path=public as
$$ select public.sou_admin() or public.tenho_tudo() or exists(
     select 1 from acesso a, jsonb_array_elements_text(coalesce(a.dados->'eom','["English on Mission"]'::jsonb)) t
     where a.id='cfg' and public.comprei(t)) or public.comprei('English on Mission') $$;

create table if not exists public.mi_mural (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.mi_mural(id) on delete cascade,   -- null = publicação · preenchido = comentário
  user_id uuid not null default auth.uid(),
  user_name text,
  selo text not null default 'assinante',                             -- 'assinante' (verificado dourado) ou 'prof' (Gediel)
  body text not null check (char_length(body) between 1 and 1500),
  created_at timestamptz not null default now()
);
create index if not exists mi_mural_ix on public.mi_mural(parent_id, created_at desc);

-- o selo e o dono vêm do servidor (ninguém consegue se passar por outro)
create or replace function public.mural_before() returns trigger language plpgsql security definer set search_path=public as $$
begin new.user_id:=auth.uid(); new.selo:=case when public.sou_admin() then 'prof' else 'assinante' end; return new; end $$;
drop trigger if exists mural_before on public.mi_mural;
create trigger mural_before before insert on public.mi_mural for each row execute function public.mural_before();

alter table public.mi_mural enable row level security;
drop policy if exists mural_ler on public.mi_mural;
create policy mural_ler on public.mi_mural for select to authenticated using (public.mural_acesso());
drop policy if exists mural_escrever on public.mi_mural;
create policy mural_escrever on public.mi_mural for insert to authenticated with check (public.mural_acesso());
drop policy if exists mural_apagar on public.mi_mural;
create policy mural_apagar on public.mi_mural for delete to authenticated using (user_id=auth.uid() or public.sou_admin());
