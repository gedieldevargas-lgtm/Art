-- CENTRAL DAS MENTORIAS (aba "Mentoria" da área de membros). Pode rodar mais de uma vez.
-- mi_mentoria_alunos: quem tem mentoria (individual, casal, turma), a sala dele na Central, o link do aluno e quantos encontros foram combinados.
-- mi_mentoria_encontros: cada encontro (pedido / confirmado / feito / cancelado).
-- Cada aluno só enxerga o que é dele (pelo e-mail); o admin vê e edita tudo.
create table if not exists public.mi_mentoria_alunos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text,                                   -- e-mail do login do aluno na área de membros
  formato text not null default 'individual',   -- individual | casal | turma
  sala text,                                    -- id da sala na Central (ex.: camila)
  link text,                                    -- link do aluno (sala.html?sala=...&k=...) - só o aluno dono e o admin leem
  encontros_total int,                          -- quantos encontros foram combinados
  ativo boolean not null default true,
  ordem int not null default 0
);
create index if not exists mi_mentoria_alunos_email on public.mi_mentoria_alunos (lower(email));
alter table public.mi_mentoria_alunos enable row level security;
drop policy if exists ment_al_ler on public.mi_mentoria_alunos;
create policy ment_al_ler on public.mi_mentoria_alunos for select using (public.sou_admin() or (email is not null and lower(email) = public.meu_email()));
drop policy if exists ment_al_adm on public.mi_mentoria_alunos;
create policy ment_al_adm on public.mi_mentoria_alunos for all using (public.sou_admin()) with check (public.sou_admin());

create table if not exists public.mi_mentoria_encontros (
  id uuid primary key default gen_random_uuid(),
  aluno_id uuid references public.mi_mentoria_alunos(id) on delete cascade,
  email text,
  inicio timestamptz not null,
  status text not null default 'pedido' check (status in ('pedido','confirmado','feito','cancelado')),
  tipo text,
  obs text,
  created_at timestamptz not null default now()
);
create index if not exists mi_mentoria_enc_email on public.mi_mentoria_encontros (lower(email), inicio);
alter table public.mi_mentoria_encontros enable row level security;
drop policy if exists ment_en_ler on public.mi_mentoria_encontros;
create policy ment_en_ler on public.mi_mentoria_encontros for select using (public.sou_admin() or (email is not null and lower(email) = public.meu_email()));
drop policy if exists ment_en_pedir on public.mi_mentoria_encontros;
create policy ment_en_pedir on public.mi_mentoria_encontros for insert with check (public.sou_admin() or (lower(email) = public.meu_email() and status = 'pedido'));
drop policy if exists ment_en_adm on public.mi_mentoria_encontros;
create policy ment_en_adm on public.mi_mentoria_encontros for update using (public.sou_admin()) with check (public.sou_admin());
drop policy if exists ment_en_del on public.mi_mentoria_encontros;
create policy ment_en_del on public.mi_mentoria_encontros for delete using (public.sou_admin());

-- os mentorandos que já estão na sua Central (preencha e-mail, link e total na própria aba Mentoria)
insert into public.mi_mentoria_alunos (nome, formato, sala, ordem)
select v.nome, v.formato, v.sala, v.ordem from (values
  ('Camila','individual','camila',1), ('João Alberto','individual','joao-alberto',2), ('José','individual','jose',3),
  ('Maiza','individual','maiza',4), ('Raul','individual','raul',5),
  ('Evelyn & Rhian','casal','evelyn-rhian',6), ('Gabriel & Roberta','casal','gabriel-roberta',7),
  ('Turma','turma','turma',8)
) as v(nome, formato, sala, ordem)
where not exists (select 1 from public.mi_mentoria_alunos a where a.sala = v.sala);
