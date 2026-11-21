-- MURAL do English on Mission (recados: testemunhos, pedidos de oração, avisos). Só assinantes leem e escrevem. Pode rodar mais de uma vez.
create or replace function public.mural_acesso() returns boolean language sql stable security definer set search_path=public as
$$ select public.sou_admin() or public.tenho_tudo() or exists(
     select 1 from acesso a, jsonb_array_elements_text(coalesce(a.dados->'eom','["English on Mission"]'::jsonb)) t
     where a.id='cfg' and public.comprei(t)) or public.comprei('English on Mission') $$;

create table if not exists public.mi_mural (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.mi_mural(id) on delete cascade,   -- null = recado · preenchido = comentário
  user_id uuid not null default auth.uid(),
  user_name text,
  selo text not null default 'assinante',                             -- 'assinante' (verificado dourado) ou 'prof' (Gediel)
  body text not null check (char_length(body) between 1 and 1500),
  created_at timestamptz not null default now()
);
alter table public.mi_mural add column if not exists tipo text not null default 'recado';      -- recado | testemunho | oracao
alter table public.mi_mural add column if not exists imagem text;                              -- foto (data URL reduzida)
alter table public.mi_mural add column if not exists status text not null default 'ok';        -- ok | pendente (foto espera o Gediel aprovar)
create index if not exists mi_mural_ix on public.mi_mural(parent_id, created_at desc);

-- filtro de palavrão e ofensa (português e inglês). Ignora acento, maiúscula, letra repetida e troca de letra por número.
create or replace function public.mural_limpo(t text) returns boolean language sql immutable as $f$
  select not (regexp_replace(translate(lower(coalesce(t,'')),'áàâãäéèêëíìîïóòôõöúùûüçñ@$013457','aaaaaeeeeiiiiooooouuuucnasoieast'),'(.)\1+','\1','g') ~* '\m(arombada|arombado|ashole|babaca|bastard|bicha|bitch|bosta|buceta|cacete|carai|caralho|corna|corno|cretina|cretino|crioulo|cunt|cuzao|desgraca|desgracado|dick|dumbas|energumeno|escrota|escroto|estupida|estupido|fagot|fdp|foda|fodase|foder|fodido|fuck|fucked|fucker|fucking|idiot|idiota|imbecil|inutil|lixo|merda|miseravel|moron|nazista|niga|niger|nojenta|nojento|otaria|otario|piranha|piroca|pora|pqp|prostituta|punheta|pusy|puta|putaria|putinha|puto|retard|retardada|retardado|retarded|safada|safado|sapatao|shit|shity|slut|stfu|stupid|vagabunda|vagabundo|viadinho|viado|vsf|vtmnc|vtnc|whore|wtf|xoxota)(s|es)?\M')
$f$;

-- o selo, o dono e o status vêm do servidor (ninguém se passa por outro; foto só aparece depois de aprovada)
create or replace function public.mural_before() returns trigger language plpgsql security definer set search_path=public as $$
declare adm boolean := public.sou_admin();
begin
  if not public.mural_limpo(new.body) then raise exception 'Esse recado tem palavras que não combinam com a nossa comunidade.' using errcode='P0001'; end if;
  new.user_id:=auth.uid();
  new.selo:=case when adm then 'prof' else 'assinante' end;
  new.status:=case when new.imagem is not null and not adm then 'pendente' else 'ok' end;
  if new.imagem is not null and char_length(new.imagem)>400000 then raise exception 'Foto grande demais.' using errcode='P0001'; end if;
  return new;
end $$;
drop trigger if exists mural_before on public.mi_mural;
create trigger mural_before before insert on public.mi_mural for each row execute function public.mural_before();

alter table public.mi_mural enable row level security;
drop policy if exists mural_ler on public.mi_mural;
create policy mural_ler on public.mi_mural for select to authenticated using (public.mural_acesso() and (status='ok' or user_id=auth.uid() or public.sou_admin()));
drop policy if exists mural_escrever on public.mi_mural;
create policy mural_escrever on public.mi_mural for insert to authenticated with check (public.mural_acesso());
drop policy if exists mural_aprovar on public.mi_mural;
create policy mural_aprovar on public.mi_mural for update to authenticated using (public.sou_admin()) with check (public.sou_admin());
drop policy if exists mural_apagar on public.mi_mural;
create policy mural_apagar on public.mi_mural for delete to authenticated using (user_id=auth.uid() or public.sou_admin());
