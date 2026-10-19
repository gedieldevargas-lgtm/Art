-- englishbygediel · catálogo
-- Cole tudo no Supabase: SQL Editor → New query → Run.
-- Cria duas tabelas: quem entrou (leads) e o que cada pessoa abriu e clicou (events).
-- O site só consegue INSERIR. Ninguém de fora consegue ler, editar ou apagar.

create table if not exists public.leads (
  id          uuid primary key,
  created_at  timestamptz not null default now(),
  nome        text not null check (char_length(nome) between 1 and 120),
  whatsapp    text not null check (char_length(whatsapp) between 8 and 25),
  email       text check (email is null or char_length(email) <= 200),
  objetivo    text not null check (objetivo in ('fala','trabalho','viagem','fe','zero')),
  origem      text check (char_length(origem) <= 300),   -- utm_source / utm_campaign / referrer
  dispositivo text check (char_length(dispositivo) <= 300)
);

create table if not exists public.events (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  lead_id    uuid references public.leads(id) on delete cascade,
  tipo       text not null check (tipo in ('story_fim','abriu','clicou','video','teste_nivel','perfil')),
  item       text check (char_length(item) <= 80),
  detalhe    jsonb
);

create index if not exists events_lead_idx on public.events (lead_id);
create index if not exists events_tipo_idx on public.events (tipo, item);

alter table public.leads  enable row level security;
alter table public.events enable row level security;

-- O site (chave anon) só insere.
drop policy if exists "site insere leads" on public.leads;
create policy "site insere leads" on public.leads
  for insert to anon with check (true);

drop policy if exists "site insere events" on public.events;
create policy "site insere events" on public.events
  for insert to anon with check (true);

-- Painel pronto pra consultar no Table Editor / SQL:
-- o que cada pessoa fez, em uma linha.
create or replace view public.painel_leads
with (security_invoker = true) as
select
  l.created_at,
  l.nome,
  l.whatsapp,
  l.email,
  l.objetivo,
  (select e.detalhe->>'nivel' from public.events e
     where e.lead_id = l.id and e.tipo = 'teste_nivel'
     order by e.created_at desc limit 1)                         as nivel_teste,
  (select string_agg(distinct e.item, ', ') from public.events e
     where e.lead_id = l.id and e.tipo = 'abriu')                as abriu,
  (select string_agg(distinct e.item, ', ') from public.events e
     where e.lead_id = l.id and e.tipo = 'clicou')               as clicou,
  exists (select 1 from public.events e
     where e.lead_id = l.id and e.tipo = 'clicou' and e.item = 'mentoria') as quis_mentoria,
  l.origem
from public.leads l
order by l.created_at desc;

revoke all on public.painel_leads from anon;
