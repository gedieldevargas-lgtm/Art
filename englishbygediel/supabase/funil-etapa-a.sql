-- FUNIL · ETAPA (a): abertura com a promessa, nome único "Programa Inteligente", etiqueta de acesso nos modos, tabela de contatos.
-- Projeto do HUB (iwivldvubmsqyzkkdxoy). Cole no SQL Editor e clique Run. Pode rodar mais de uma vez.
-- (O site já faz essas trocas sozinho ao carregar; rodar aqui deixa gravado e evita o trabalho a cada visita.)

-- 1) abertura: a promessa no lugar de "Qual modo você quer ligar hoje?"
update site_config set dados = jsonb_set(dados, '{entrada}', coalesce(dados->'entrada', '{}'::jsonb) || '{"rotulo":"11 anos de sala de aula · +700 alunos","titulo":"Anos de inglês e você","palavra":"ainda trava","tituloFim":"?","dica":"Gire e escolha o seu universo. Os com cadeado abrem no Programa.","nota":"Pra liberar todos os modos: Programa Inteligente","giraSozinho":false,"pedirContato":true,"contatoTitulo":"Antes de ligar","contatoTexto":"Me diz quem é você e eu libero o modo e o seu primeiro material grátis.","contatoBotao":"Ligar e receber o material"}'::jsonb)
where id = 'hub' and coalesce(dados->'entrada'->>'titulo', 'Qual modo você quer') = 'Qual modo você quer';

-- 2) um nome só: Programa Inteligente
update site_config set dados = jsonb_set(dados, '{mentoria}', coalesce(dados->'mentoria', '{}'::jsonb) || '{"titulo":"Programa Inteligente","botaoAplicar":"Quero entrar no Programa"}'::jsonb) where id = 'hub';
update site_config set dados = jsonb_set(dados, '{destaque,titulo}', '"Programa Inteligente"'::jsonb) where id = 'hub' and dados ? 'destaque';
update site_config set dados = jsonb_set(dados, '{secoes}', coalesce(dados->'secoes', '{}'::jsonb) || '{"membros":"Dentro do Programa Inteligente","botaoPagos":"Ver planos →","membrosTexto":"O que abre com o Programa Inteligente: aulas, lives, salas de prática e acompanhamento.","extras":"Outros projetos","alunos":"Mais histórias de alunos"}'::jsonb) where id = 'hub';
update site_config set dados = jsonb_set(dados, '{topo,bio}', to_jsonb(regexp_replace(dados->'topo'->>'bio', 'a porta pr[ao] (mentoria|programa de acompanhamento)', 'a porta pro Programa Inteligente')))
where id = 'hub' and dados->'topo' ? 'bio';
update site_config set dados = jsonb_set(dados, '{cards}', (
  select jsonb_agg(case when c->>'titulo' ~* '^(Método Inteligente|Mentoria Inglês Inteligente|Programa de Acompanhamento)' then c || '{"titulo":"Programa Inteligente"}'::jsonb else c end order by ord)
  from jsonb_array_elements(dados->'cards') with ordinality as t(c, ord)))
where id = 'hub' and jsonb_typeof(dados->'cards') = 'array';

-- 3) etiqueta de acesso em cada modo do anel (Grátis / abre com o Programa / abre com o Mission)
update site_config set dados = jsonb_set(dados, '{modos}', (
  select jsonb_agg(case when m ? 'acesso' then m
    when m->>'id' in ('teste','zero','jogos','prompts','materiais') then m || '{"acesso":"gratis"}'::jsonb
    when m->>'id' = 'fe' then m || '{"acesso":"mission"}'::jsonb
    else m || '{"acesso":"programa"}'::jsonb end order by ord)
  from jsonb_array_elements(dados->'modos') with ordinality as t(m, ord)))
where id = 'hub' and jsonb_typeof(dados->'modos') = 'array';

-- 4) contatos da abertura e dos materiais grátis (nome + WhatsApp). O site grava; só o admin lê.
create table if not exists public.hub_leads (
  id           bigint generated always as identity primary key,
  created_at   timestamptz not null default now(),
  visitante    uuid,
  sessao       uuid,
  modo         text check (char_length(modo) <= 40),
  nome         text check (char_length(nome) <= 160),
  whatsapp     text check (char_length(whatsapp) <= 40),
  origem       text check (char_length(origem) <= 60),
  pagina       text check (char_length(pagina) <= 300),
  utm_source   text check (char_length(utm_source) <= 120),
  utm_campaign text check (char_length(utm_campaign) <= 160)
);
create index if not exists hub_leads_data_idx on public.hub_leads (created_at);
alter table public.hub_leads enable row level security;
drop policy if exists "site grava hub_leads" on public.hub_leads;
create policy "site grava hub_leads" on public.hub_leads for insert to anon, authenticated with check (true);
drop policy if exists "admin le hub_leads" on public.hub_leads;
create policy "admin le hub_leads" on public.hub_leads for select to authenticated using (public.is_admin());
drop policy if exists "admin apaga hub_leads" on public.hub_leads;
create policy "admin apaga hub_leads" on public.hub_leads for delete to authenticated using (public.is_admin());
