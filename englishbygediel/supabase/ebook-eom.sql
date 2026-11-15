-- E-BOOK "Bíblia Linear — 1, 2 e 3 João" nos materiais do English on Mission.
-- Rode no projeto dos MEMBROS (jzdxcefnlwjgimymgsux), SQL Editor. Pode rodar mais de uma vez.

-- 1) o campo "produto" dos materiais passa a aceitar vários trechos separados por vírgula
create or replace function public.comprei(trecho text) returns boolean language sql stable security definer set search_path=public as
$$ select exists(
     select 1 from unnest(string_to_array(coalesce(trecho,''), ',')) t
     where btrim(t) <> '' and (
       exists(select 1 from compras where lower(email)=public.meu_email() and produto ilike '%'||btrim(t)||'%')
       or coalesce(auth.jwt()->'user_metadata'->>'produto','') ilike '%'||btrim(t)||'%')) $$;

-- 2) o material: abre pra quem comprou o e-book OU assina o English on Mission; os outros caem no checkout do e-book
with m as (
  insert into public.materiais (nome, descricao, icone, tipo, produto, checkout, ordem)
  select 'Bíblia Linear — 1, 2 e 3 João',
         'Inglês e português lado a lado, versículo por versículo. Incluído na assinatura English on Mission.',
         '📖', 'produto', 'Bíblia Linear, English on Mission', 'https://pay.kiwify.com.br/M3SRe7s', 10
  where not exists (select 1 from public.materiais where nome = 'Bíblia Linear — 1, 2 e 3 João')
  returning id)
insert into public.material_links (material_id, link)
select id, 'https://englishonmissionbook1.netlify.app/' from m;
