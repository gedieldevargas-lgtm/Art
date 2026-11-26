-- MENTORIAS COM SALA FIXA (particular, casal e turma).
-- A sala de vídeo é a do site da Central (gedielcentral.netlify.app/sala.html); aqui ficam só os cadastros.
-- O admin (tabela admins) cria e edita tudo pelo painel /admin, aba "Mentorias".
-- Cada aluno só lê as mentorias em que o e-mail dele está na lista. Pode rodar mais de uma vez.
-- Precisa do supabase/membros.sql já rodado (usa sou_admin() e meu_email()).

create table if not exists public.mi_mentorias (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nome       text not null check (char_length(nome) between 1 and 120),
  tipo       text not null default 'particular' check (tipo in ('particular','casal','turma')),
  emails     text[] not null default '{}',   -- e-mails (minúsculos) dos alunos que entram nessa sala
  dias       int[]  not null default '{}',   -- dias fixos: 0 = domingo ... 6 = sábado
  hora       text check (hora is null or hora ~ '^[0-2][0-9]:[0-5][0-9]$'),
  foto       text check (foto is null or char_length(foto) <= 120000),   -- foto pequena em texto (data URL)
  sala       text not null unique check (sala ~ '^[a-z0-9-]{1,40}$'),    -- nome da sala no endereço
  k          text check (k is null or char_length(k) <= 40),             -- código do link do aluno (gerado pela sala)
  ativo      boolean not null default true
);

alter table public.mi_mentorias enable row level security;

drop policy if exists mentorias_admin on public.mi_mentorias;
create policy mentorias_admin on public.mi_mentorias for all
  using (public.sou_admin()) with check (public.sou_admin());

drop policy if exists mentorias_aluno on public.mi_mentorias;
create policy mentorias_aluno on public.mi_mentorias for select
  using (ativo and public.meu_email() = any(emails));
