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

-- ═══ MARATONA 10 MESES (projeto dos MEMBROS) — participantes, progresso, pontos, ranking e link de cadastro ═══
create table if not exists public.maratona_membros (
  email       text primary key check (char_length(email) between 3 and 160),
  nome        text check (char_length(nome) <= 120),
  turma       text not null default 'icd-1',
  created_at  timestamptz not null default now()
);
alter table public.maratona_membros enable row level security;
-- cada aluno só enxerga a própria linha (ninguém vê a lista dos outros); o admin vê e mexe em tudo
drop policy if exists maratona_ler on public.maratona_membros;
create policy maratona_ler on public.maratona_membros for select to authenticated using (lower(email) = public.meu_email() or public.sou_admin());
drop policy if exists maratona_admin on public.maratona_membros;
create policy maratona_admin on public.maratona_membros for all to authenticated using (public.sou_admin()) with check (public.sou_admin());

-- progresso de cada um nos ciclos (o aluno grava o próprio; o admin acompanha)
create table if not exists public.maratona_progresso (
  email       text primary key check (char_length(email) between 3 and 160),
  feitos      jsonb not null default '{}'::jsonb,   -- {"1-0":true,"1-entrega":true,...}
  updated_at  timestamptz not null default now()
);
alter table public.maratona_progresso enable row level security;
drop policy if exists progresso_meu on public.maratona_progresso;
create policy progresso_meu on public.maratona_progresso for all to authenticated
  using (lower(email) = public.meu_email() or public.sou_admin()) with check (lower(email) = public.meu_email() or public.sou_admin());

-- ═══ PONTOS E RANKING (Top 15 por ciclo) ═══
-- O app registra sozinho: dia de uso, aula assistida, minuto de jogo e post nas redes (com link).
-- Comentários e quizzes são contados direto das tabelas das aulas. Tetos por dia deixam a disputa acirrada.
create table if not exists public.maratona_eventos (
  id         bigint generated always as identity primary key,
  email      text not null default public.meu_email(),
  tipo       text not null check (tipo in ('acesso','aula','jogo','post')),
  ref        text not null default '' check (char_length(ref) <= 300),
  dia        date not null default (now() at time zone 'America/Sao_Paulo')::date,
  created_at timestamptz not null default now(),
  unique (email, tipo, ref, dia)
);
alter table public.maratona_eventos enable row level security;
drop policy if exists eventos_grava on public.maratona_eventos;
create policy eventos_grava on public.maratona_eventos for insert to authenticated
  with check (lower(email) = public.meu_email() and exists (select 1 from public.maratona_membros m where lower(m.email) = public.meu_email()));
drop policy if exists eventos_ler on public.maratona_eventos;
create policy eventos_ler on public.maratona_eventos for select to authenticated using (lower(email) = public.meu_email() or public.sou_admin());
drop policy if exists eventos_admin on public.maratona_eventos;
create policy eventos_admin on public.maratona_eventos for delete to authenticated using (public.sou_admin());

-- REGRAS DE PONTOS (mude aqui e rode de novo):
--   dia que usou a plataforma 10 · aula assistida 10 · marco do ciclo 15 · entrega do ciclo 60
--   comentário em aula 5 (até 3 por dia) · acerto no quiz 2 · minuto de jogo 1 (até 30 por dia) · post nas redes 20 (1 por dia)
create or replace function public.maratona_ranking(p_ciclo int, p_de date, p_ate date)
returns table (email text, nome text, pontos int, dias int, aulas int, marcos int, entregas int, comentarios int, quiz int, jogos int, posts int)
language sql stable security definer set search_path = public as $$
  with m as (select lower(mm.email) email, coalesce(nullif(mm.nome,''), split_part(mm.email,'@',1)) nome from maratona_membros mm),
  ev as (select lower(e.email) email, e.tipo, e.ref, e.dia from maratona_eventos e where e.dia between p_de and p_ate),
  dd as (select ev.email, count(distinct ev.dia) n from ev where tipo='acesso' group by 1),
  au as (select ev.email, count(distinct ev.ref) n from ev where tipo='aula' group by 1),
  jg as (select x.email, sum(least(x.n,30)) n from (select ev.email, ev.dia, count(*) n from ev where tipo='jogo' group by 1,2) x group by 1),
  po as (select x.email, count(*) n from (select distinct ev.email, ev.dia from ev where tipo='post') x group by 1),
  co as (select lower(u.email) email, sum(least(c.n,3)) n from (select user_id, (created_at at time zone 'America/Sao_Paulo')::date d, count(*) n from mi_lesson_comments
          where (created_at at time zone 'America/Sao_Paulo')::date between p_de and p_ate group by 1,2) c join auth.users u on u.id = c.user_id group by 1),
  qz as (select lower(u.email) email, sum(q.score) n from mi_quiz_results q join auth.users u on u.id = q.user_id
          where (q.created_at at time zone 'America/Sao_Paulo')::date between p_de and p_ate group by 1),
  tf as (select lower(p.email) email,
           count(*) filter (where f.key like p_ciclo||'-%' and f.key <> p_ciclo||'-entrega') mc,
           count(*) filter (where f.key = p_ciclo||'-entrega') en
         from maratona_progresso p, jsonb_each(p.feitos) f where f.value = 'true'::jsonb group by 1)
  select m.email, m.nome,
    (coalesce(dd.n,0)*10 + coalesce(au.n,0)*10 + coalesce(tf.mc,0)*15 + coalesce(tf.en,0)*60 + coalesce(co.n,0)*5 + coalesce(qz.n,0)*2 + coalesce(jg.n,0) + coalesce(po.n,0)*20)::int,
    coalesce(dd.n,0)::int, coalesce(au.n,0)::int, coalesce(tf.mc,0)::int, coalesce(tf.en,0)::int, coalesce(co.n,0)::int, coalesce(qz.n,0)::int, coalesce(jg.n,0)::int, coalesce(po.n,0)::int
  from m left join dd using (email) left join au using (email) left join jg using (email) left join po using (email)
         left join co using (email) left join qz using (email) left join tf using (email)
  where public.sou_admin() or exists (select 1 from maratona_membros x where lower(x.email) = public.meu_email())
  order by 3 desc, 1;
$$;
grant execute on function public.maratona_ranking(int, date, date) to authenticated;

-- ═══ LINK DE CADASTRO AUTOMÁTICO ═══
-- O código do link fica aqui (só o admin vê). Gere/troque no Painel Admin → 🏁 Maratona 10m.
create table if not exists public.maratona_convites (
  codigo     text primary key check (char_length(codigo) between 6 and 60),
  turma      text not null default 'icd-1',
  plano      text not null default 'Plano Inteligente',
  ativo      boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.maratona_convites enable row level security;
drop policy if exists convites_admin on public.maratona_convites;
create policy convites_admin on public.maratona_convites for all to authenticated using (public.sou_admin()) with check (public.sou_admin());


-- ═══ Card "Playlist do YouTube" (vídeos + quiz + comentários) ═══
alter table public.mi_uni_cards drop constraint if exists mi_uni_cards_acao_check;
alter table public.mi_uni_cards add constraint mi_uni_cards_acao_check check (acao in ('link','whatsapp','area','curso','material','playlist'));

create table if not exists public.video_quiz (
  video_id text primary key,
  quiz jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.video_quiz enable row level security;
drop policy if exists "todos leem video_quiz" on public.video_quiz;
create policy "todos leem video_quiz" on public.video_quiz for select to authenticated using (true);
drop policy if exists "admin edita video_quiz" on public.video_quiz;
create policy "admin edita video_quiz" on public.video_quiz for all to authenticated using (public.sou_admin()) with check (public.sou_admin());

create table if not exists public.video_comentarios (
  id bigint generated always as identity primary key,
  video_id text not null,
  user_id uuid not null default auth.uid(),
  user_name text not null,
  body text not null check (length(body) between 1 and 1000),
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists video_coment_idx on public.video_comentarios (video_id, created_at);
alter table public.video_comentarios enable row level security;
drop policy if exists "todos leem video_coment" on public.video_comentarios;
create policy "todos leem video_coment" on public.video_comentarios for select to authenticated using (true);
drop policy if exists "aluno comenta video" on public.video_comentarios;
create policy "aluno comenta video" on public.video_comentarios for insert to authenticated with check (user_id = auth.uid() and (is_admin = false or public.sou_admin()));
drop policy if exists "aluno ou admin apaga video_coment" on public.video_comentarios;
create policy "aluno ou admin apaga video_coment" on public.video_comentarios for delete to authenticated using (user_id = auth.uid() or public.sou_admin());

-- English on Mission: tira os cards "Jogos" e "Assinar o English On Mission" (o botão de assinar já está no topo da página)
delete from public.mi_uni_cards where universo='eom' and titulo in ('Jogos','Assinar o English On Mission');
