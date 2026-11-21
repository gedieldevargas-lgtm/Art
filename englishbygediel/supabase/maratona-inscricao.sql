-- MARATONA ABERTA · inscrição grátis pra quem está no Programa; o Gediel escolhe quem entra
-- Rode no SQL Editor do Supabase dos MEMBROS (depois do maratona-membros.sql). Pode rodar mais de uma vez.
-- Quem já estava na maratona continua 'aprovado' (valor padrão). Quem se inscreve entra como 'inscrito'.
alter table public.maratona_membros add column if not exists status text not null default 'aprovado';
alter table public.maratona_membros drop constraint if exists maratona_membros_status_chk;
alter table public.maratona_membros add constraint maratona_membros_status_chk check (status in ('inscrito','aprovado','recusado'));
alter table public.maratona_membros add column if not exists inscrito_em timestamptz;
alter table public.maratona_membros add column if not exists motivo text check (char_length(motivo) <= 300);

-- o aluno se inscreve sozinho (só como 'inscrito') e pode cancelar a própria inscrição enquanto não for escolhido
drop policy if exists maratona_inscrever on public.maratona_membros;
create policy maratona_inscrever on public.maratona_membros for insert to authenticated
  with check (lower(email) = public.meu_email() and status = 'inscrito');
drop policy if exists maratona_cancelar on public.maratona_membros;
create policy maratona_cancelar on public.maratona_membros for delete to authenticated
  using (lower(email) = public.meu_email() and status = 'inscrito');

-- só quem foi escolhido ('aprovado') pontua e aparece no ranking
drop policy if exists eventos_grava on public.maratona_eventos;
create policy eventos_grava on public.maratona_eventos for insert to authenticated
  with check (lower(email) = public.meu_email() and exists (select 1 from public.maratona_membros m where lower(m.email) = public.meu_email() and m.status = 'aprovado'));

create or replace function public.maratona_ranking(p_ciclo int, p_de date, p_ate date)
returns table (email text, nome text, pontos int, dias int, aulas int, marcos int, entregas int, comentarios int, quiz int, jogos int, posts int)
language sql stable security definer set search_path = public as $$
  with m as (select lower(mm.email) email, coalesce(nullif(mm.nome,''), split_part(mm.email,'@',1)) nome from maratona_membros mm where mm.status = 'aprovado'),
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
