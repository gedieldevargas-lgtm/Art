-- MARATONAS · inscrições (rode no projeto do HUB, iwivldvubmsqyzkkdxoy, DEPOIS do admin.sql)
-- Cole no Supabase: SQL Editor → New query → Run. Pode rodar mais de uma vez.
-- Quem se inscreve pelo Hub ou pela área de membros cai aqui, já separado por maratona,
-- nível, objetivo, país, turno e "temperatura" (quente/morno/frio) pro comercial chamar depois.
create table if not exists public.maratonas_inscricoes (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  maratona    text not null check (char_length(maratona) between 1 and 40),   -- icd-2, morar-fora, mora-fora, carreira…
  nome        text not null check (char_length(nome) between 1 and 120),
  whatsapp    text not null check (char_length(whatsapp) between 8 and 30),
  email       text check (char_length(email) <= 160),
  instagram   text check (char_length(instagram) <= 80),
  cidade      text check (char_length(cidade) <= 120),
  pais        text check (char_length(pais) <= 80),
  nivel       text check (char_length(nivel) <= 60),
  objetivo    text check (char_length(objetivo) <= 200),
  turno       text check (char_length(turno) <= 120),
  momento     text check (char_length(momento) <= 80),
  temperatura text check (temperatura in ('quente','morno','frio')),
  conheceu    text check (char_length(conheceu) <= 60),
  respostas   jsonb not null default '{}'::jsonb,       -- perguntas próprias de cada maratona
  mensagem    text check (char_length(mensagem) <= 1000),
  veio_de     text check (char_length(veio_de) <= 30),  -- hub | membros
  ja_aluno    boolean not null default false,
  aceita_contato boolean not null default true,
  visitante   text check (char_length(visitante) <= 60),
  origem      text check (char_length(origem) <= 300),  -- ?de= / utm
  -- funil comercial (só o admin mexe)
  fase        text not null default 'novo' check (fase in ('novo','chamado','conversando','matriculado','nao_agora','perdido')),
  nota        text check (char_length(nota) <= 1000),
  chamado_em  timestamptz,
  updated_at  timestamptz not null default now()
);
create index if not exists maratonas_insc_maratona on public.maratonas_inscricoes (maratona, created_at desc);
alter table public.maratonas_inscricoes enable row level security;

-- qualquer pessoa se inscreve (o site só grava); só o admin lê, edita e apaga
drop policy if exists "todos se inscrevem maratona" on public.maratonas_inscricoes;
create policy "todos se inscrevem maratona" on public.maratonas_inscricoes for insert to anon, authenticated
  with check (fase = 'novo' and nota is null and chamado_em is null);
drop policy if exists "admin le maratona" on public.maratonas_inscricoes;
create policy "admin le maratona" on public.maratonas_inscricoes for select to authenticated using (public.is_admin());
drop policy if exists "admin edita maratona" on public.maratonas_inscricoes;
create policy "admin edita maratona" on public.maratonas_inscricoes for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin apaga maratona" on public.maratonas_inscricoes;
create policy "admin apaga maratona" on public.maratonas_inscricoes for delete to authenticated using (public.is_admin());
