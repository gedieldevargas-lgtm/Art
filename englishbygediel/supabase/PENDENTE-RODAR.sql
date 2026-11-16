-- TUDO QUE FALTA RODAR (projeto dos MEMBROS, jzdxcefnlwjgimymgsux). Cole inteiro no SQL Editor e clique Run. Pode rodar mais de uma vez.

-- Planos: quem comprou um produto listado em cfg.planos.tudo (Gênio, Instituição) acessa tudo
create or replace function public.tenho_tudo() returns boolean language sql stable security definer set search_path=public as
$$ select exists(select 1 from acesso a, jsonb_array_elements_text(coalesce(a.dados->'planos'->'tudo','["Plano Gênio","Plano Instituição"]'::jsonb)) t
                 where a.id='cfg' and public.comprei(t)) $$;
drop policy if exists links_ler on public.material_links;
create policy links_ler on public.material_links for select to authenticated using (
  public.sou_admin() or public.tenho_tudo() or exists(select 1 from public.materiais m where m.id=material_id and (
    m.tipo='gratis' or public.tenho_programa() or (m.tipo='produto' and public.comprei(m.produto)))));

-- Plano Gênio / Instituição também contam como Programa (aulas, materiais, tudo)
create or replace function public.tenho_programa() returns boolean language sql stable security definer set search_path=public as
$$ select exists(select 1 from acesso a, jsonb_array_elements_text(coalesce(a.dados->'programa','[]'::jsonb)||coalesce(a.dados->'planos'->'tudo','["Plano Gênio","Plano Instituição"]'::jsonb)) t
                 where a.id='cfg' and public.comprei(t)) $$;

-- E-books em PDF guardados no Supabase (bucket privado). Só baixa quem tem acesso ao material.
alter table public.materiais add column if not exists arquivo text;
insert into storage.buckets (id,name,public) values ('ebooks','ebooks',false) on conflict (id) do update set public=false;
drop policy if exists ebooks_ler on storage.objects;
create policy ebooks_ler on storage.objects for select to authenticated using (
  bucket_id='ebooks' and (public.sou_admin() or public.tenho_tudo() or exists (
    select 1 from public.materiais m where m.arquivo=storage.objects.name
      and (m.tipo='gratis' or public.tenho_programa() or (m.tipo='produto' and public.comprei(m.produto)))
  ))
);
drop policy if exists ebooks_admin on storage.objects;
create policy ebooks_admin on storage.objects for all to authenticated using (bucket_id='ebooks' and public.sou_admin()) with check (bucket_id='ebooks' and public.sou_admin());

-- cards podem abrir um material/e-book
alter table public.mi_uni_cards drop constraint if exists mi_uni_cards_acao_check;
alter table public.mi_uni_cards add constraint mi_uni_cards_acao_check check (acao in ('link','whatsapp','area','curso','material'));
-- liga o card do e-book da Bíblia Linear ao material (só neste projeto)
update public.mi_uni_cards set acao='material', valor='514cb44a-7920-4848-a0ef-3bd8707da723', acesso='todos'
 where universo='eom' and titulo ilike '%bíblia linear%';


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
