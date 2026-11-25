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

-- Mural do English on Mission (recados, só assinantes)
-- MURAL do English on Mission (recados: testemunhos, pedidos de oração, avisos). Só assinantes leem e escrevem. Pode rodar mais de uma vez.
create or replace function public.mural_acesso() returns boolean language sql stable security definer set search_path=public as
$$ select public.sou_admin() or public.tenho_tudo() or exists(
     select 1 from acesso a, jsonb_array_elements_text(coalesce(a.dados->'programa','[]'::jsonb)) t
     where a.id='cfg' and public.comprei(t)) or exists(
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


-- ═══════════ MARATONA ABERTA (inscrição + seleção) ═══════════
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

-- ===== Conteúdo das aulas M2–M15 (23/11/2026) =====
-- Conteúdo das aulas M2–M15 (documento 'Conteúdo das Aulas — Método Inteligente', 23/11/2026).
-- Atualiza título, descrição e ordem das aulas existentes (mantém vídeo, quiz e capa) e cria as aulas NOVAS ➕ sem publicar.
-- Cada aula renomeada guarda uma linha 'livro: slug' (o aluno não vê) pra continuar abrindo o livro interativo antigo.
-- Pode rodar mais de uma vez.

do $mod$ declare m uuid; l uuid; begin
  select id into m from public.mi_modules where name = $t$Diagnóstico & Personalização$t$ order by created_at limit 1;
  if m is null then raise notice 'Módulo não encontrado: Diagnóstico & Personalização'; return; end if;
  update public.mi_modules set sub=$t$2 aulas · Prisma + plano$t$ where id=m;
  update public.mi_lessons set ord=1, title=$t$Você Aprende Diferente — E Isso É Um Dom$t$, description=$t$🎯 Prisma das Inteligências Múltiplas (8 tipos) + diagnóstico de perfil de aprendizagem. Como o perfil de cada aluno muda a estratégia de estudo.

💡 Ex: "Se você é musical, use músicas. Se é cinestésico, escreva enquanto fala."

✅ Prática: Quiz de perfil (Prisma) · vídeo youtube

livro: entendendo-o-seu-prisma-de-talentos$t$ where module_id=m and title in ($t$Entendendo o seu Prisma de Talentos$t$,$t$Você Aprende Diferente — E Isso É Um Dom$t$);
  update public.mi_lessons set ord=2, title=$t$Seu Plano, Sua Velocidade$t$, description=$t$🎯 Como montar rotina de estudo personalizada: frequência semanal, micro-metas diárias, apps recomendados por perfil. Aluno sai com plano escrito.

💡 Ex: "3x por semana, 20 min — segunda vocabulário, quarta gramática, sexta revisão."

✅ Prática: Checklist do plano · vídeo youtube

livro: montando-o-seu-plano-personalizado$t$ where module_id=m and title in ($t$Montando o seu plano personalizado$t$,$t$Seu Plano, Sua Velocidade$t$);
  -- fora do novo plano: mantida, mas despublicada (reative se quiser)
  update public.mi_lessons set published=false, ord=3 where module_id=m and title=$t$Seu nível CEFR e o que ele significa$t$;
end $mod$;

do $mod$ declare m uuid; l uuid; begin
  select id into m from public.mi_modules where name = $t$Sons & Pronúncia$t$ order by created_at limit 1;
  if m is null then raise notice 'Módulo não encontrado: Sons & Pronúncia'; return; end if;
  update public.mi_lessons set ord=1, title=$t$Sons Que Sua Boca Nunca Fez$t$, description=$t$🎯 Sons inexistentes no português: /θ/ (think), /ð/ (the), /æ/ (cat), /ɪ/ (sit vs seat). Posição de língua e lábios para cada um.

⚠️ Exceção: /θ/ e /ð/ causam mais confusão — enfatizar diferença entre "think" e "sink"

✅ Prática: Repetição guiada · espelho

livro: os-sons-do-ingles-que-nao-existem-em-portugues$t$ where module_id=m and title in ($t$Os sons do inglês que não existem em português$t$,$t$Sons Que Sua Boca Nunca Fez$t$);
  update public.mi_lessons set ord=2, title=$t$Os Três Sons Que Mais Envergonham Brasileiros$t$, description=$t$🎯 /h/ aspirado (not silent like PT), /r/ americano (retroflexo), /l/ final (dark L em "ball", "call"). Exercícios de diferenciação e correção.

💡 Ex: "He" ≠ "E", "right" ≠ "light"

✅ Prática: Pares mínimos · repetição

livro: th-r-e-l-os-tres-viloes$t$ where module_id=m and title in ($t$TH, R e L — os três vilões$t$,$t$Os Três Sons Que Mais Envergonham Brasileiros$t$);
  update public.mi_lessons set ord=3, title=$t$A, E, I — Mas Não Do Jeito Que Você Pensa$t$, description=$t$🎯 Vogais longas vs curtas: /iː/ (beat) vs /ɪ/ (bit), /uː/ (food) vs /ʊ/ (book). Schwa /ə/ — o som mais comum do inglês (about, the, a).

⚠️ Schwa: aparece em silabas átonas, não na escrita — alunos precisam "ouvir" não "ler"

✅ Prática: Ditado de pares · quiz de som

livro: vogais-curtas-longas-e-ditongos$t$ where module_id=m and title in ($t$Vogais curtas, longas e ditongos$t$,$t$A, E, I — Mas Não Do Jeito Que Você Pensa$t$);
  update public.mi_lessons set ord=4, title=$t$Errou a Sílaba? A Frase Virou Outra$t$, description=$t$🎯 Word stress: sílaba tônica em palavras comuns. Pares com tonicidade diferente mudam significado/classe gramatical: REcord (noun) vs reCORD (verb).

💡 Ex: PREsent vs preSENT · OBject vs obJECT

✅ Prática: Marcar stress em palavras · repetição

livro: word-stress-a-silaba-forte-muda-tudo$t$ where module_id=m and title in ($t$Word stress — a sílaba forte muda tudo$t$,$t$Errou a Sílaba? A Frase Virou Outra$t$);
  update public.mi_lessons set ord=5, title=$t$Fala Com Ritmo, Não Com Palavras$t$, description=$t$🎯 Sentence stress e ritmo: palavras de conteúdo (forte) vs palavras de função (fraco/schwa). Inglês é stress-timed, não syllable-timed como PT.

💡 Ex: "I want to go" → "I WANNA go" na fala rápida

✅ Prática: Batida de ritmo · shadowing

livro: ritmo-da-frase-sentence-stress$t$ where module_id=m and title in ($t$Ritmo da frase (sentence stress)$t$,$t$Fala Com Ritmo, Não Com Palavras$t$);
  update public.mi_lessons set ord=6, title=$t$O Nativo Não Come Palavras — Ele Conecta$t$, description=$t$🎯 Linking: consoante + vogal ("an apple" → "anapple"). Assimilation, elision. Reduced forms: gonna, wanna, kinda, hafta.

⚠️ Reduced forms são fala informal — não usar em escrita formal

✅ Prática: Transcrição de fala real · shadowing

livro: connected-speech-por-que-o-nativo-come-palavras$t$ where module_id=m and title in ($t$Connected speech — por que o nativo "come" palavras$t$,$t$O Nativo Não Come Palavras — Ele Conecta$t$);
  update public.mi_lessons set ord=7, title=$t$Mesmo Frase, Tom Diferente — Significado Diferente$t$, description=$t$🎯 Intonação: rising (perguntas yes/no, listas), falling (afirmações, wh-questions). Tom muda emoção: surpresa, dúvida, ironia.

💡 Ex: "Really?" (rising=pergunta) vs "Really." (falling=ironia)

✅ Prática: Repetição com emoção · gravação

livro: entonacao-perguntas-emocao-e-intencao$t$ where module_id=m and title in ($t$Entonação — perguntas, emoção e intenção$t$,$t$Mesmo Frase, Tom Diferente — Significado Diferente$t$);
  update public.mi_lessons set ord=8, title=$t$Imite Até Virar: O Método do Espelho$t$, description=$t$🎯 Técnica de shadowing completa: ouvir → repetir em tempo real → gravar → comparar. Como escolher áudios por nível. Rotina de 10 min/dia.

💡 Apps: Elsa Speak, YouGlish, BBC Learning English

✅ Prática: Prática de shadowing · gravação pessoal

livro: shadowing-a-tecnica-completa$t$ where module_id=m and title in ($t$Shadowing — a técnica completa$t$,$t$Imite Até Virar: O Método do Espelho$t$);
end $mod$;

do $mod$ declare m uuid; l uuid; begin
  select id into m from public.mi_modules where name = $t$Vocabulário Essencial$t$ order by created_at limit 1;
  if m is null then raise notice 'Módulo não encontrado: Vocabulário Essencial'; return; end if;
  update public.mi_lessons set ord=1, title=$t$100 Palavras Que Resolvem Metade das Conversas$t$, description=$t$🎯 Oxford 3000: as 100 palavras de maior frequência em inglês. Como usá-las em frases do cotidiano. Estratégia de vocabulário por frequência.

💡 Ex: get, make, go, come, know, think, take, give, want, need

✅ Prática: Flashcards · frases no contexto

livro: as-100-palavras-que-resolvem-metade-das-conversas$t$ where module_id=m and title in ($t$As 100 palavras que resolvem metade das conversas$t$,$t$100 Palavras Que Resolvem Metade das Conversas$t$);
  update public.mi_lessons set ord=2, title=$t$Olá, Nice to Meet You — Sem Travar$t$, description=$t$🎯 Greetings formais e informais. Introduções: nome, origem, profissão, família. Small talk openers e respostas naturais. Como encerrar uma conversa.

💡 Ex: "What do you do?" / "I work in..." / "Nice to meet you, too!"

✅ Prática: Role-play de apresentação

livro: cumprimentos-apresentacoes-e-small-talk$t$ where module_id=m and title in ($t$Cumprimentos, apresentações e small talk$t$,$t$Olá, Nice to Meet You — Sem Travar$t$);
  update public.mi_lessons set ord=3, title=$t$Quanto Custa? Que Horas São? Sem Hesitar$t$, description=$t$🎯 Números (1–1.000.000+), preços, porcentagens. Horas: "It's half past three", "quarter to five". Datas, meses, dias da semana.

⚠️ Datas: American (June 5th) vs British (5th June) — diferença importante

✅ Prática: Quiz de números · prática oral de horas

livro: numeros-datas-horas-e-precos$t$ where module_id=m and title in ($t$Números, datas, horas e preços$t$,$t$Quanto Custa? Que Horas São? Sem Hesitar$t$);
  update public.mi_lessons set ord=4, title=$t$My Family, My Home, My Day — O Inglês de Dentro$t$, description=$t$🎯 Família: spouse, sibling, nephew, in-laws. Cômodos e objetos da casa. Rotina diária: verbos de ação (wake up, have breakfast, commute).

💡 Ex: "My brother-in-law lives next door to us."

✅ Prática: Descrever rotina em voz alta

livro: familia-casa-e-rotina-diaria$t$ where module_id=m and title in ($t$Família, casa e rotina diária$t$,$t$My Family, My Home, My Day — O Inglês de Dentro$t$);
  update public.mi_lessons set ord=5, title=$t$Can I Have the Menu? — Peça, Escolha, Pague$t$, description=$t$🎯 Restaurante: pedir prato/bebida, perguntar ingredientes, intolerâncias alimentares, pedir a conta. Vocabulário de cardápio e modos de preparo.

⚠️ "I am vegetarian" vs "I don't eat meat" — distinção prática para alérgicos

✅ Prática: Role-play em restaurante

livro: comida-restaurante-e-mercado$t$ where module_id=m and title in ($t$Comida, restaurante e mercado$t$,$t$Can I Have the Menu? — Peça, Escolha, Pague$t$);
  update public.mi_lessons set ord=6, title=$t$Where Is It? Como Chegar em Qualquer Lugar$t$, description=$t$🎯 Dar e pedir direções: turn left/right, go straight, it's on the corner of. Preposições de lugar: next to, across from, behind. Transporte: by bus, subway, on foot.

💡 Ex: "Go straight for two blocks, then turn left at the traffic light."

✅ Prática: Mapa + direções · quiz

livro: cidade-transporte-e-direcoes$t$ where module_id=m and title in ($t$Cidade, transporte e direções$t$,$t$Where Is It? Como Chegar em Qualquer Lugar$t$);
  update public.mi_lessons set ord=7, title=$t$What Do You Do? — O Inglês Que Paga as Contas$t$, description=$t$🎯 Profissões e áreas de trabalho. Descrever responsabilidades: I'm responsible for, I manage, I work with. Habilidades: I'm good at, I specialize in.

💡 Ex: "I'm an agronomist. I work with crop protection products."

✅ Prática: Apresentação profissional gravada

livro: trabalho-estudo-e-profissoes$t$ where module_id=m and title in ($t$Trabalho, estudo e profissões$t$,$t$What Do You Do? — O Inglês Que Paga as Contas$t$);
  update public.mi_lessons set ord=8, title=$t$How Do You Feel? — Sentimentos Sem Rodeio$t$, description=$t$🎯 Emotions: excited, nervous, overwhelmed, grateful, frustrated. Estados físicos: exhausted, under the weather. Expressar saúde: "I have a headache", "I'm coming down with something".

💡 Ex: "I'm a bit overwhelmed with work right now."

✅ Prática: Expressão de sentimentos · diário

livro: sentimentos-opinioes-e-reacoes$t$ where module_id=m and title in ($t$Sentimentos, opiniões e reações$t$,$t$How Do You Feel? — Sentimentos Sem Rodeio$t$);
end $mod$;

do $mod$ declare m uuid; l uuid; begin
  select id into m from public.mi_modules where name = $t$Gramática A1$t$ order by created_at limit 1;
  if m is null then raise notice 'Módulo não encontrado: Gramática A1'; return; end if;
  update public.mi_modules set sub=$t$9 aulas · A1$t$ where id=m;
  update public.mi_lessons set ord=1, title=$t$SER BOM E ESTAR BEM — Afirmar e Negar$t$, description=$t$🎯 Verb to Be — afirmativa e negativa: I am/am not, you are/are not, he/she/it is/is not, we/they are/are not. Contrações (I'm, isn't, aren't). Uso para identidade, estado, profissão.

💡 Ex: "I'm a teacher." / "She isn't from here." / "They're not ready."

✅ Prática: Completar frases · oral

livro: verb-to-be-a-base-de-tudo$t$ where module_id=m and title in ($t$Verb to be — a base de tudo$t$,$t$SER BOM E ESTAR BEM — Afirmar e Negar$t$);
  if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$SER BOM E ESTAR BEM — Perguntar, Responder e Praticar$t$) then
    insert into public.mi_lessons (module_id,ord,title,description,quiz,published) values (m,2,$t$SER BOM E ESTAR BEM — Perguntar, Responder e Praticar$t$,$t$🎯 Verb to Be — interrogativa e short answers: Are you...? Is she...? Am I...? → Yes, I am / No, she isn't. Prática com diálogos reais e situações do cotidiano.

⚠️ Short answers obrigatórias — "Yes, he is" (nunca só "Yes" formal)

✅ Prática: Diálogo guiado · quiz$t$,'[]'::jsonb,false);
  end if;
  update public.mi_lessons set ord=3, title=$t$Todo Dia Aprendo Inglês$t$, description=$t$🎯 Simple Present: rotinas, fatos e hábitos. I study, she studies (3ª pessoa -s/-es/-ies), negativa don't/doesn't. Advérbios: always, usually, sometimes, never.

⚠️ 3ª pessoa: he goes / she watches / it has — irregular mais usados

✅ Prática: Descrever rotina · completar frases

livro: present-simple-rotinas-e-verdades$t$ where module_id=m and title in ($t$Present Simple — rotinas e verdades$t$,$t$Todo Dia Aprendo Inglês$t$);
  update public.mi_lessons set ord=4, title=$t$Estou Fazendo, Estou Falando — O Que Acontece Agora$t$, description=$t$🎯 Present Continuous: be + verb-ing. Afirmativa (I am studying), negativa (I'm not working), interrogativa (Are you listening?). Spelling rules: -ing (run→running, write→writing).

⚠️ Stative verbs não usam -ing: know, love, understand, believe

✅ Prática: Descrever imagem · oral

livro: present-continuous-o-agora$t$ where module_id=m and title in ($t$Present Continuous — o agora$t$,$t$Estou Fazendo, Estou Falando — O Que Acontece Agora$t$);
  update public.mi_lessons set ord=5, title=$t$O, A, Um, Uma — Em Inglês Também Tem Isso$t$, description=$t$🎯 Articles: a/an (indefinido — primeira menção, profissões), the (definido — segunda menção, único, superlativos). Quando omitir (países, línguas, refeições).

⚠️ a/an = antes de som, não letra: "an hour" (silent h) / "a university" (j-sound)

✅ Prática: Completar com article correto · quiz

livro: artigos-a-an-the$t$ where module_id=m and title in ($t$Artigos: a, an, the$t$,$t$O, A, Um, Uma — Em Inglês Também Tem Isso$t$);
  update public.mi_lessons set ord=6, title=$t$Um, Dois, Vários — O Plural Que Muda Tudo$t$, description=$t$🎯 Plural regular: -s, -es (dishes), -ies (babies). Plural irregular: man/men, woman/women, child/children, tooth/teeth, foot/feet. Uncountable nouns (water, advice, information).

⚠️ "Advices" e "informations" não existem — erros clássicos de brasileiro

✅ Prática: Lista de erros comuns · quiz

livro: plural-this-that-there-is-are$t$ where module_id=m and title in ($t$Plural, this/that, there is/are$t$,$t$Um, Dois, Vários — O Plural Que Muda Tudo$t$);
  update public.mi_lessons set ord=7, title=$t$Consigo, Não Consigo, Pode Fazer?$t$, description=$t$🎯 Modal can/can't: habilidade (I can swim) e permissão (Can I leave?). Could para passado de habilidade e pedido mais formal. Can you...? vs Could you...?

💡 Ex: "Can you help me?" / "Could I use your phone?" (mais polido)

✅ Prática: Role-play de pedidos · oral

livro: can-can-t-e-pedidos-educados$t$ where module_id=m and title in ($t$Can, can't e pedidos educados$t$,$t$Consigo, Não Consigo, Pode Fazer?$t$);
  update public.mi_lessons set ord=8, title=$t$Meu, Seu, Dele — Sem Confusão$t$, description=$t$🎯 Possessive adjectives: my, your, his, her, its, our, their. Possessive 's (apostrophe-s): "John's book", "the teacher's class". De quê vs de quem.

⚠️ "Its" (possessivo) vs "it's" (it is) — confusão frequente

✅ Prática: Completar frases · quiz

livro: possessivos-e-pronomes-objeto$t$ where module_id=m and title in ($t$Possessivos e pronomes objeto$t$,$t$Meu, Seu, Dele — Sem Confusão$t$);
  update public.mi_lessons set ord=9, title=$t$O Quê? Onde? Por Quê? — Perguntas de Verdade$t$, description=$t$🎯 Wh-questions: what (coisa), where (lugar), when (tempo), why (razão), who (pessoa), how (modo). Estrutura: Wh + auxiliar + sujeito + verbo. How much/many, how long, how often.

⚠️ "Why you don't like it?" ✗ → "Why don't you like it?" ✓ — inversão obrigatória

✅ Prática: Formular perguntas · quiz

livro: perguntas-com-wh-what-where-when-who-why-how$t$ where module_id=m and title in ($t$Perguntas com WH (what, where, when, who, why, how)$t$,$t$O Quê? Onde? Por Quê? — Perguntas de Verdade$t$);
end $mod$;

do $mod$ declare m uuid; l uuid; begin
  select id into m from public.mi_modules where name = $t$Gramática A2–B1$t$ order by created_at limit 1;
  if m is null then raise notice 'Módulo não encontrado: Gramática A2–B1'; return; end if;
  update public.mi_modules set sub=$t$10 aulas · A2–B1$t$ where id=m;
  update public.mi_lessons set ord=1, title=$t$Aconteceu — Verbos Que Seguem as Regras$t$, description=$t$🎯 Simple Past regular: infinitivo + -ed. Spelling rules (-ed, -ied, dobra consoante). Negativa: didn't + infinitivo. Interrogativa: Did + sujeito + infinitivo?

⚠️ Pronúncia do -ed: /t/ (worked), /d/ (played), /ɪd/ (wanted) — 3 sons diferentes

✅ Prática: Contar história passada · quiz

livro: past-simple-regulares-e-irregulares$t$ where module_id=m and title in ($t$Past Simple — regulares e irregulares$t$,$t$Aconteceu — Verbos Que Seguem as Regras$t$);
  if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$Aconteceu — Mas Não Seguiu as Regras (Verbos Irregulares)$t$) then
    insert into public.mi_lessons (module_id,ord,title,description,quiz,published) values (m,2,$t$Aconteceu — Mas Não Seguiu as Regras (Verbos Irregulares)$t$,$t$🎯 Simple Past irregular: 60 verbos mais usados agrupados por padrão sonoro (go/went, have/had, see/saw, buy/bought, come/came). Estratégia de memorização por grupos.

💡 Grupos: same form (cut/cut), vowel change (ride/rode), totally different (go/went)

⚠️ Lista completa dos 60 irregulares mais frequentes para o aluno salvar

✅ Prática: Jogo de memória · completar história$t$,'[]'::jsonb,false);
  end if;
  update public.mi_lessons set ord=3, title=$t$Estava Acontecendo — O Passado Em Movimento$t$, description=$t$🎯 Past Continuous: was/were + -ing. Ação em progresso no passado (I was reading at 8pm). Combinado com Simple Past: interrupção de ação contínua.

💡 Ex: "I was cooking when he called." — was cooking (contínuo) + called (interrompeu)

✅ Prática: Descrever cena com duas ações · quiz

livro: past-continuous-e-interrupcoes$t$ where module_id=m and title in ($t$Past Continuous e interrupções$t$,$t$Estava Acontecendo — O Passado Em Movimento$t$);
  update public.mi_lessons set ord=4, title=$t$Vai Ser Assim? Vai Acontecer? — Sim ou Não$t$, description=$t$🎯 Futuro: will (decisão espontânea, previsão), going to (plano já decidido), Present Continuous (agenda marcada). Quando usar cada um.

💡 Ex: "I'll help you!" (espontâneo) / "I'm going to study tonight" (plano) / "She's meeting the doctor on Monday" (agenda)

✅ Prática: Escolher o futuro correto · oral

livro: futuro-will-x-going-to$t$ where module_id=m and title in ($t$Futuro: will x going to$t$,$t$Vai Ser Assim? Vai Acontecer? — Sim ou Não$t$);
  update public.mi_lessons set ord=5, title=$t$Já Fez Isso? Já Foi Lá? — Parte 1: Forma e Uso$t$, description=$t$🎯 Present Perfect: have/has + past participle. Uso para experiências de vida (já/nunca), ações com resultado presente. Already, yet, ever, never, just.

⚠️ "Have you ever been to London?" — uso típico de experiência de vida (sem tempo específico)

✅ Prática: Perguntas de experiência · quiz

livro: present-perfect-sem-medo$t$ where module_id=m and title in ($t$Present Perfect sem medo$t$,$t$Já Fez Isso? Já Foi Lá? — Parte 1: Forma e Uso$t$);
  if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$Já Fez Isso? Já Foi Lá? — Parte 2: For, Since e Quando Usar$t$) then
    insert into public.mi_lessons (module_id,ord,title,description,quiz,published) values (m,6,$t$Já Fez Isso? Já Foi Lá? — Parte 2: For, Since e Quando Usar$t$,$t$🎯 Present Perfect: for (duração — for 3 years) vs since (ponto de início — since 2020). Contraste com Simple Past: quando usar cada um. "I've lived here for 5 years" vs "I lived there in 2018".

⚠️ Com tempo específico no passado → Simple Past obrigatório: "I saw her yesterday" (nunca "I've seen her yesterday")

✅ Prática: For vs since quiz · completar frases$t$,'[]'::jsonb,false);
  end if;
  update public.mi_lessons set ord=7, title=$t$Maior, Menor, O Melhor De Todos$t$, description=$t$🎯 Comparatives: adj + -er / more + adj (sílabas). Superlatives: the + adj + -est / the most + adj. Irregular: good/better/best, bad/worse/worst, far/further/furthest.

⚠️ 1-2 sílabas: -er/-est. 3+ sílabas: more/most. Exceção: fun → funner ou more fun (ambas aceitas)

✅ Prática: Comparar objetos/pessoas · quiz

livro: comparativos-e-superlativos$t$ where module_id=m and title in ($t$Comparativos e superlativos$t$,$t$Maior, Menor, O Melhor De Todos$t$);
  update public.mi_lessons set ord=8, title=$t$Precisa? Deve? Talvez? Pode Ser...$t$, description=$t$🎯 Modais: must/have to (obrigação), should/ought to (conselho), might/may (possibilidade), mustn't (proibição) vs don't have to (não é necessário).

⚠️ "mustn't" ≠ "don't have to" — mustn't = proibição; don't have to = não é obrigado

✅ Prática: Situações modais · quiz de conselho

livro: modais-should-must-have-to-might$t$ where module_id=m and title in ($t$Modais: should, must, have to, might$t$,$t$Precisa? Deve? Talvez? Pode Ser...$t$);
  update public.mi_lessons set ord=9, title=$t$E Se Acontecer? — Planos e Condições Em Inglês$t$, description=$t$🎯 Conditionals: Zero (If you heat water to 100°C, it boils — verdade universal), First (If I study, I'll pass — real e possível). Estrutura e uso prático.

⚠️ First Conditional: If + Present Simple, will + infinitivo (nunca "If I will go")

✅ Prática: Completar condicionais · criar frases

livro: condicionais-0-e-1-if$t$ where module_id=m and title in ($t$Condicionais 0 e 1 (if...)$t$,$t$E Se Acontecer? — Planos e Condições Em Inglês$t$);
  update public.mi_lessons set ord=10, title=$t$Mas, Por Isso, Mesmo Assim — O Inglês Que Flui$t$, description=$t$🎯 Conjunctions: and, but, or, so, because. Discourse markers: however, therefore, although, nevertheless, in addition, as a result. Como conectar ideias para um inglês mais fluente e natural.

💡 Ex: "I was tired. However, I finished the project." — mais sofisticado que "but"

✅ Prática: Reescrever frases com conectores · quiz

livro: conectores-because-so-although-however$t$ where module_id=m and title in ($t$Conectores: because, so, although, however$t$,$t$Mas, Por Isso, Mesmo Assim — O Inglês Que Flui$t$);
end $mod$;

do $mod$ declare m uuid; l uuid; begin
  select id into m from public.mi_modules where name = $t$Conversação A1–A2$t$ order by created_at limit 1;
  if m is null then raise notice 'Módulo não encontrado: Conversação A1–A2'; return; end if;
  update public.mi_lessons set ord=1, title=$t$30 Frases Que Destravam Qualquer Conversa$t$, description=$t$🎯 30 high-frequency conversation phrases: Can you repeat that? / What do you mean? / How do you say...? / I didn't catch that. / Let me think... / That makes sense.

💡 Organizadas em 6 categorias: pedir repetição, clarificação, ganhar tempo, concordar, discordar, encerrar

✅ Prática: Prática oral com parceiro fictício · gravação

livro: sobrevivencia-as-30-frases-que-destravam$t$ where module_id=m and title in ($t$Sobrevivência: as 30 frases que destravam$t$,$t$30 Frases Que Destravam Qualquer Conversa$t$);
  update public.mi_lessons set ord=2, title=$t$Perdido? Como Pedir Ajuda Em Inglês$t$, description=$t$🎯 Situações de não-compreensão: pedir pra falar mais devagar (Could you speak slowly, please?), repetir, explicar de outro jeito. Estratégias de sobrevivência conversacional.

💡 Ex: "I'm sorry, I didn't understand. Could you say that again more slowly?"

✅ Prática: Role-play de mal-entendido

livro: pedindo-informacao-e-ajuda$t$ where module_id=m and title in ($t$Pedindo informação e ajuda$t$,$t$Perdido? Como Pedir Ajuda Em Inglês$t$);
  update public.mi_lessons set ord=3, title=$t$Fale Sobre Você Sem Travar$t$, description=$t$🎯 Self-introduction estruturada: nome → origem → profissão/estudo → hobbie/interesse → algo pessoal (opcional). Como ser interessante e fazer a conversa fluir de volta.

💡 Ex: "Hi, I'm Gediel. I'm from Brazil and I teach English. In my free time I play the flute and paint."

✅ Prática: Gravar apresentação pessoal · feedback

livro: falando-de-voce-vida-gostos-e-planos$t$ where module_id=m and title in ($t$Falando de você: vida, gostos e planos$t$,$t$Fale Sobre Você Sem Travar$t$);
  update public.mi_lessons set ord=4, title=$t$Ring Ring — Inglês Por Telefone e Vídeo$t$, description=$t$🎯 Ligações: cumprimentar (Hello, this is...), pedir alguém (Could I speak to...?), deixar recado, problemas técnicos (I can't hear you / You're breaking up). Email + call opening/closing.

⚠️ Nunca "Hello, I am..." no telefone formal → "Hello, this is..." ou "My name is..."

✅ Prática: Role-play de ligação · quiz de frases

livro: ao-telefone-e-em-video-chamada$t$ where module_id=m and title in ($t$Ao telefone e em vídeo chamada$t$,$t$Ring Ring — Inglês Por Telefone e Vídeo$t$);
  update public.mi_lessons set ord=5, title=$t$Um Dia Viajando Só Em Inglês$t$, description=$t$🎯 Jornada completa: aeroporto (check-in, boarding, immigration), hotel (check-in, amenities, problems), restaurante (order, pay), transporte (taxi, subway, Uber). Frases essenciais em cada situação.

💡 Ex: "I'd like to check in. I have a reservation under..." / "Can I have the bill, please?"

✅ Prática: Simulação de viagem · role-play completo

livro: simulacao-completa-um-dia-em-viagem$t$ where module_id=m and title in ($t$Simulação completa: um dia em viagem$t$,$t$Um Dia Viajando Só Em Inglês$t$);
end $mod$;

do $mod$ declare m uuid; l uuid; begin
  select id into m from public.mi_modules where name = $t$Conversação B1$t$ order by created_at limit 1;
  if m is null then raise notice 'Módulo não encontrado: Conversação B1'; return; end if;
  update public.mi_lessons set ord=1, title=$t$Conta Bem — Como Prender Atenção Em Inglês$t$, description=$t$🎯 Storytelling: estrutura (situação → complicação → resolução), connecting words (first, then, suddenly, finally), como usar pausa e entonação para criar suspense.

💡 Ex: contar experiência marcante usando a estrutura narrativa em inglês

✅ Prática: Contar história real em inglês · gravação

livro: contando-historias-storytelling-pessoal$t$ where module_id=m and title in ($t$Contando histórias (storytelling pessoal)$t$,$t$Conta Bem — Como Prender Atenção Em Inglês$t$);
  update public.mi_lessons set ord=2, title=$t$Discordo, Mas Com Elegância$t$, description=$t$🎯 Expressar opinião: I think/believe/feel that. Concordar parcialmente: That's true, but... / I see your point, however... Discordar com educação: I'm afraid I disagree / With all due respect...

⚠️ Cultura: inglês tende a ser mais indireto no desacordo — softeners são essenciais

✅ Prática: Debate estruturado · quiz de frases

livro: dando-opiniao-e-discordando-com-educacao$t$ where module_id=m and title in ($t$Dando opinião e discordando com educação$t$,$t$Discordo, Mas Com Elegância$t$);
  update public.mi_lessons set ord=3, title=$t$Fé, Propósito e Valores — Em Inglês$t$, description=$t$🎯 Vocabulário cristão e de propósito: faith, prayer, worship, blessing, testimony, grace, calling, mission, surrender. Como falar sobre crenças, valores e propósito de vida em inglês.

💡 Ex: "I believe my calling is to serve others through music and teaching."

✅ Prática: Depoimento pessoal em inglês · gravação

livro: conversas-profundas-fe-proposito-e-valores$t$ where module_id=m and title in ($t$Conversas profundas: fé, propósito e valores$t$,$t$Fé, Propósito e Valores — Em Inglês$t$);
  update public.mi_lessons set ord=4, title=$t$Sem Travar Sob Pressão — Entrevistas e Imprevistos$t$, description=$t$🎯 Lidar com perguntas difíceis: ganhar tempo (That's a great question... / Let me think about that...), reformular quando não sabe a palavra, pedir esclarecimento sem parecer despreparado.

⚠️ Filler words naturais vs "ã" e "é" em português — substituição consciente

✅ Prática: Simulação de entrevista · role-play

livro: fluencia-sob-pressao-entrevistas-e-imprevistos$t$ where module_id=m and title in ($t$Fluência sob pressão: entrevistas e imprevistos$t$,$t$Sem Travar Sob Pressão — Entrevistas e Imprevistos$t$);
end $mod$;

do $mod$ declare m uuid; l uuid; begin
  select id into m from public.mi_modules where name = $t$Listening & Compreensão$t$ order by created_at limit 1;
  if m is null then raise notice 'Módulo não encontrado: Listening & Compreensão'; return; end if;
  update public.mi_lessons set ord=1, title=$t$Por Que Você Não Entende — E Como Mudar$t$, description=$t$🎯 Por que o cérebro falha no listening: fonologia vs ortografia, fala conectada vs fala isolada. Estratégias: top-down (contexto) + bottom-up (sons). Como treinar ouvido ativamente.

⚠️ Estudar inglês "pela escrita" dificulta o listening — reeducação necessária

✅ Prática: Exercício de predição · quiz de compreensão

livro: por-que-voce-nao-entende-o-que-ouve-e-como-mudar$t$ where module_id=m and title in ($t$Por que você não entende o que ouve (e como mudar)$t$,$t$Por Que Você Não Entende — E Como Mudar$t$);
  update public.mi_lessons set ord=2, title=$t$Aprenda Ouvindo Música — Do Jeito Certo$t$, description=$t$🎯 Método ativo em 4 etapas: (1) ouvir sem letra → (2) com letra em inglês → (3) cantarolar → (4) analisar gramática/vocabulário. Como escolher músicas por nível.

💡 Apps: Genius (letras), LyricsTraining (quiz de completar)

✅ Prática: Exercício com música escolhida · quiz

livro: treino-com-musicas$t$ where module_id=m and title in ($t$Treino com músicas$t$,$t$Aprenda Ouvindo Música — Do Jeito Certo$t$);
  update public.mi_lessons set ord=3, title=$t$Séries e Filmes Como Sala de Aula$t$, description=$t$🎯 Progressão de legenda: PT → EN → sem legenda. Técnica de repetição de cena (assistir 3x a mesma cena). Como fazer caderno de série. Recomendações por nível A2–B2.

💡 Iniciantes: Peppa Pig (A1), Friends ep. curtos (A2–B1), Grey's Anatomy (B2)

✅ Prática: Relatório de episódio · quiz de vocabulário

livro: treino-com-series-e-filmes$t$ where module_id=m and title in ($t$Treino com séries e filmes$t$,$t$Séries e Filmes Como Sala de Aula$t$);
  update public.mi_lessons set ord=4, title=$t$Podcasts Na Velocidade Real$t$, description=$t$🎯 Escolher podcasts por nível. Escuta ativa vs passiva: diferença e quando usar cada. Técnica de transcrição de 1 minuto. Podcasts recomendados por nível.

💡 BBC Learning English (A2–B1), 6 Minute English, TED (B2), Stuff You Should Know (C1)

✅ Prática: Resumo de episódio · quiz de listening

livro: treino-com-podcasts-e-velocidade-real$t$ where module_id=m and title in ($t$Treino com podcasts e velocidade real$t$,$t$Podcasts Na Velocidade Real$t$);
  update public.mi_lessons set ord=5, title=$t$Inglês Britânico, Americano e Mais — Qual Dá Pra Entender?$t$, description=$t$🎯 Diferenças entre accents: American (rhotic, flat a), British RP (non-rhotic, broad a), Australian, Singaporean. Vocabulário: elevator/lift, apartment/flat, subway/underground.

⚠️ Nenhum sotaque é "certo" — objetivo é compreensão, não perfeição fonética

✅ Prática: Quiz de vocabulário US vs UK · exercício de listening

livro: sotaques-americano-britanico-e-outros$t$ where module_id=m and title in ($t$Sotaques: americano, britânico e outros$t$,$t$Inglês Britânico, Americano e Mais — Qual Dá Pra Entender?$t$);
end $mod$;

do $mod$ declare m uuid; l uuid; begin
  select id into m from public.mi_modules where name = $t$Phrasal Verbs$t$ order by created_at limit 1;
  if m is null then raise notice 'Módulo não encontrado: Phrasal Verbs'; return; end if;
  update public.mi_lessons set ord=1, title=$t$Por Que Phrasal Verbs Parecem Impossíveis — E Como Parar De Sofrer$t$, description=$t$🎯 O que são phrasal verbs: verbo + partícula muda significado. Por que são difíceis (mesmo verbo, partículas diferentes = sentidos diferentes). Estratégia: aprender por tema, não por lista.

💡 Ex: "give up" (desistir) ≠ "give in" (ceder) ≠ "give away" (doar) — mesmo verbo, 3 sentidos

✅ Prática: Classificar por significado · quiz

livro: o-que-sao-phrasal-verbs-e-como-aprender-sem-decorar$t$ where module_id=m and title in ($t$O que são phrasal verbs e como aprender sem decorar$t$,$t$Por Que Phrasal Verbs Parecem Impossíveis — E Como Parar De Sofrer$t$);
  update public.mi_lessons set ord=2, title=$t$Get Up, Wake Up, Work Out — O Inglês Da Sua Manhã$t$, description=$t$🎯 Phrasal verbs de rotina: wake up, get up, work out, go out, come back, run out of, pick up, drop off, turn on/off, log in/out.

💡 Contexto: descrever manhã inteira usando só phrasal verbs

✅ Prática: Descrever rotina com phrasal verbs · quiz

livro: rotina-get-up-wake-up-work-out$t$ where module_id=m and title in ($t$Rotina: get up, wake up, work out...$t$,$t$Get Up, Wake Up, Work Out — O Inglês Da Sua Manhã$t$);
  update public.mi_lessons set ord=3, title=$t$Get Along, Break Up, Hang Out — Inglês Dos Relacionamentos$t$, description=$t$🎯 Phrasal verbs de relacionamento: fall for (se apaixonar), break up (terminar), make up (reconciliar), hang out (sair), get along with (se dar bem), look after (cuidar), bring up (criar filhos).

💡 Ex: "We broke up last year but we still get along well."

✅ Prática: Story com phrasal verbs · quiz

livro: relacionamentos-get-along-break-up-hang-out$t$ where module_id=m and title in ($t$Relacionamentos: get along, break up, hang out...$t$,$t$Get Along, Break Up, Hang Out — Inglês Dos Relacionamentos$t$);
  update public.mi_lessons set ord=4, title=$t$Set Up, Carry Out, Put Off — O Inglês Do Trabalho$t$, description=$t$🎯 Phrasal verbs profissionais: set up (configurar/fundar), carry out (executar), put off (adiar), follow up (dar retorno), hand in (entregar), deal with (lidar), take on (assumir), back up (fazer backup).

💡 Ex: "I need to follow up with the client. Can you set up a meeting?"

✅ Prática: Email profissional com phrasal verbs

livro: trabalho-set-up-carry-out-put-off$t$ where module_id=m and title in ($t$Trabalho: set up, carry out, put off...$t$,$t$Set Up, Carry Out, Put Off — O Inglês Do Trabalho$t$);
  update public.mi_lessons set ord=5, title=$t$Separa ou Não? A Regra Que Ninguém Conta$t$, description=$t$🎯 Separable vs inseparable: separable = pronome vai no meio ("turn it off" ✓). Inseparable = pronome após partícula ("look after him" ✓). Como identificar qual é qual.

⚠️ Separable com pronome: SEMPRE no meio — "turn off it" ✗ / "turn it off" ✓

✅ Prática: Colocar pronome na posição certa · quiz

livro: separaveis-x-inseparaveis$t$ where module_id=m and title in ($t$Separáveis x inseparáveis$t$,$t$Separa ou Não? A Regra Que Ninguém Conta$t$);
  update public.mi_lessons set ord=6, title=$t$Os 25 Que Todo Mundo Usa — Revisão Final$t$, description=$t$🎯 Top 25 phrasal verbs mais frequentes em inglês real (corpus de frequência). Revisão com frases em contexto. Jogo de associação e fixação.

💡 Lista: get up, find out, go on, come up with, turn out, look forward to, give up, put on...

✅ Prática: Quiz gamificado · associação · revisão final

livro: os-25-phrasal-verbs-mais-usados-revisao-geral$t$ where module_id=m and title in ($t$Os 25 phrasal verbs mais usados — revisão geral$t$,$t$Os 25 Que Todo Mundo Usa — Revisão Final$t$);
end $mod$;

do $mod$ declare m uuid; l uuid; begin
  select id into m from public.mi_modules where name = $t$Idioms & Expressões$t$ order by created_at limit 1;
  if m is null then raise notice 'Módulo não encontrado: Idioms & Expressões'; return; end if;
  update public.mi_lessons set ord=1, title=$t$Fala Como Nativo — Expressões Do Dia a Dia$t$, description=$t$🎯 15 idioms cotidianos: piece of cake, under the weather, spill the beans, hang in there, break a leg, hit the sack, bite the bullet, the tip of the iceberg, once in a blue moon.

💡 Foco: significado, origem rápida, como usar em frase real

✅ Prática: Associar idiom à situação · quiz

livro: expressoes-do-dia-a-dia-que-todo-nativo-usa$t$ where module_id=m and title in ($t$Expressões do dia a dia que todo nativo usa$t$,$t$Fala Como Nativo — Expressões Do Dia a Dia$t$);
  update public.mi_lessons set ord=2, title=$t$Money Talks — Idioms De Negócios E Dinheiro$t$, description=$t$🎯 Business idioms: break even (empatar), in the red/black (no prejuízo/lucro), ballpark figure (estimativa), hit the ground running, touch base, think outside the box, back to square one.

⚠️ Cuidado: "think outside the box" já é clichê — alternativas mais naturais existem

✅ Prática: Uso em contexto empresarial · role-play

livro: idioms-de-trabalho-e-dinheiro$t$ where module_id=m and title in ($t$Idioms de trabalho e dinheiro$t$,$t$Money Talks — Idioms De Negócios E Dinheiro$t$);
  update public.mi_lessons set ord=3, title=$t$Coração Cheio, Coração Partido — Idioms De Sentimento$t$, description=$t$🎯 Emotion idioms: on cloud nine (feliz demais), feel blue (triste), butterflies in my stomach (nervoso), over the moon (eufórico), down in the dumps, wear your heart on your sleeve, a broken heart.

💡 Ex: "I was on cloud nine when I got the job offer!"

✅ Prática: Associar idiom ao sentimento · quiz

livro: idioms-de-sentimentos-e-relacionamentos$t$ where module_id=m and title in ($t$Idioms de sentimentos e relacionamentos$t$,$t$Coração Cheio, Coração Partido — Idioms De Sentimento$t$);
  update public.mi_lessons set ord=4, title=$t$Que É Isso? As Gírias Que Você Precisa Conhecer$t$, description=$t$🎯 Gírias modernas: awesome, binge-watch, ghosting, FOMO, lowkey, no cap, vibe, slay, throw shade, it hits different. Quando e onde usar (informal, redes sociais, chat). O que nunca usar em contexto formal.

⚠️ Slang envelhece rápido — verificar relevância por geração/plataforma

✅ Prática: Quiz de contexto · quando usar ou não

livro: girias-atuais-e-as-que-voce-deve-evitar$t$ where module_id=m and title in ($t$Gírias atuais (e as que você deve evitar)$t$,$t$Que É Isso? As Gírias Que Você Precisa Conhecer$t$);
  update public.mi_lessons set ord=5, title=$t$A Bíblia Em Inglês — Provérbios Que Sobreviveram$t$, description=$t$🎯 Biblical idioms que entraram no inglês cotidiano: salt of the earth, see eye to eye, bite the dust, the writing on the wall, by the skin of your teeth, go the extra mile, a thorn in my side. Origem bíblica + uso moderno.

💡 Ex: "He went the extra mile for his team." (Mt 5:41) — hoje = esforço além do esperado

✅ Prática: Origem bíblica + uso moderno · quiz

livro: proverbios-e-expressoes-biblicas-no-ingles$t$ where module_id=m and title in ($t$Provérbios e expressões bíblicas no inglês$t$,$t$A Bíblia Em Inglês — Provérbios Que Sobreviveram$t$);
end $mod$;

do $mod$ declare m uuid; l uuid; begin
  select id into m from public.mi_modules where name = $t$Inglês pela Música$t$ order by created_at limit 1;
  if m is null then raise notice 'Módulo não encontrado: Inglês pela Música'; return; end if;
  update public.mi_lessons set ord=1, title=$t$Música Não É Karaokê — O Método Que Funciona$t$, description=$t$🎯 Por que só cantar não aprende inglês. Método ativo com música em 4 etapas: ouvir com intenção → texto → shadowing → análise linguística. Como criar rotina musical de aprendizagem.

💡 Apps: Genius (letras com anotações), LyricsTraining, Spotify

✅ Prática: Exercício com música escolhida pelo aluno

livro: o-metodo-de-estudar-com-musica-sem-so-cantar-junto$t$ where module_id=m and title in ($t$O método de estudar com música (sem só cantar junto)$t$,$t$Música Não É Karaokê — O Método Que Funciona$t$);
  update public.mi_lessons set ord=2, title=$t$Canta, Mas Presta Atenção — Pronúncia Pela Música$t$, description=$t$🎯 Como músicas ajudam com: linking sounds, ritmo, weak forms, contractions naturais. Técnica de slow-down para perceber os sons reais. Comparar versão cantada vs fala normal.

⚠️ Poetic license na música altera pronúncia às vezes — verificar fala real depois

✅ Prática: Transcrição de trecho · comparação

livro: treino-de-pronuncia-com-musica$t$ where module_id=m and title in ($t$Treino de pronúncia com música$t$,$t$Canta, Mas Presta Atenção — Pronúncia Pela Música$t$);
  update public.mi_lessons set ord=3, title=$t$O Que a Letra Esconde — Gramática Na Música$t$, description=$t$🎯 Encontrar e analisar estruturas gramaticais em letras reais: conditionals, past tenses, modals, phrasal verbs. Como criar exercício de gramática a partir de qualquer música.

💡 Ex: analisar gramática de uma música de worship ou pop em inglês

✅ Prática: Análise gramatical de letra real

livro: gramatica-escondida-nas-letras$t$ where module_id=m and title in ($t$Gramática escondida nas letras$t$,$t$O Que a Letra Esconde — Gramática Na Música$t$);
  update public.mi_lessons set ord=4, title=$t$Worship Em Inglês — Adorar Sem Barreira de Idioma$t$, description=$t$🎯 Vocabulário do louvor cristão em inglês: holy, glory, praise, worthy, declare, surrender, throne, grace, mercy, mighty. Como entender e cantar worship em inglês com significado, não só fonética.

💡 Músicas trabalhadas: What a Beautiful Name (Hillsong) + Goodness of God (Bethel)

✅ Prática: Análise de letra de worship · vocabulário bíblico

livro: worship-em-ingles-vocabulario-de-adoracao$t$ where module_id=m and title in ($t$Worship em inglês: vocabulário de adoração$t$,$t$Worship Em Inglês — Adorar Sem Barreira de Idioma$t$);
end $mod$;

do $mod$ declare m uuid; l uuid; begin
  select id into m from public.mi_modules where name = $t$Inglês por Séries$t$ order by created_at limit 1;
  if m is null then raise notice 'Módulo não encontrado: Inglês por Séries'; return; end if;
  update public.mi_lessons set ord=1, title=$t$Legenda Sim ou Não? A Estratégia Certa$t$, description=$t$🎯 Progressão de legendas por nível: PT → EN → sem legenda. Quando avançar (critério de compreensão). Qual tipo de série funciona por nível. Como configurar Netflix/Prime para aprendizagem.

💡 A2: legenda PT; B1: legenda EN; B2+: sem legenda

✅ Prática: Teste de nível com cena · plano de progressão

livro: o-metodo-de-estudar-com-series-legendas-do-jeito-certo$t$ where module_id=m and title in ($t$O método de estudar com séries (legendas do jeito certo)$t$,$t$Legenda Sim ou Não? A Estratégia Certa$t$);
  update public.mi_lessons set ord=2, title=$t$Repete a Cena — A Técnica Que Muda Tudo$t$, description=$t$🎯 Scene repetition: assistir mesma cena 3x — 1ª sem parar (compreensão global), 2ª com pausas (vocabulário), 3ª shadowing (pronúncia e ritmo). Critério para escolher cenas úteis.

⚠️ Cenas ideais: diálogo natural, sem muita gíria extrema, 2–4 minutos

✅ Prática: Praticar com cena enviada · gravação

livro: tecnica-da-cena-repetida$t$ where module_id=m and title in ($t$Técnica da cena repetida$t$,$t$Repete a Cena — A Técnica Que Muda Tudo$t$);
  update public.mi_lessons set ord=3, title=$t$Anota Sem Parar o Episódio$t$, description=$t$🎯 Active watching: assistir episódio sem parar, anotar marcadores de tempo (ex: "11:22 — expressão estranha"). Depois voltar nos marcadores. Caderno de série: palavra + contexto + frase.

💡 Método: 1 episódio = 10–15 anotações → 1 revisão → 5 frases escritas

✅ Prática: Relatório de episódio · caderno de série

livro: anotando-vocabulario-sem-travar-o-episodio$t$ where module_id=m and title in ($t$Anotando vocabulário sem travar o episódio$t$,$t$Anota Sem Parar o Episódio$t$);
  update public.mi_lessons set ord=4, title=$t$Do Ouvido Pra Boca — Ativar O Que Você Já Entende$t$, description=$t$🎯 Como converter compreensão passiva em produção oral: repetir frases de personagens, dramatizar cenas, fazer "commentary" falado sobre o que está vendo.

💡 Técnica: "pause and talk" — pausar, descrever o que aconteceu em inglês

✅ Prática: Gravação de commentary · shadowing de cena

livro: do-entendimento-passivo-a-fala-ativa$t$ where module_id=m and title in ($t$Do entendimento passivo à fala ativa$t$,$t$Do Ouvido Pra Boca — Ativar O Que Você Já Entende$t$);
end $mod$;

do $mod$ declare m uuid; l uuid; begin
  select id into m from public.mi_modules where name = $t$Business English$t$ order by created_at limit 1;
  if m is null then raise notice 'Módulo não encontrado: Business English'; return; end if;
  update public.mi_lessons set ord=1, title=$t$Tô Na Reunião E Agora? Como Participar Em Inglês$t$, description=$t$🎯 Meeting phrases: opening (Shall we get started?), agreeing/disagreeing, suggesting (What if we...?), clarifying (Could you elaborate?), wrapping up (To summarize...). Vocabulary para reunião virtual.

⚠️ Virtual meetings: "You're on mute" / "Can you share your screen?" — frases essenciais

✅ Prática: Role-play de reunião · quiz de frases

livro: reunioes-participar-opinar-e-conduzir$t$ where module_id=m and title in ($t$Reuniões: participar, opinar e conduzir$t$,$t$Tô Na Reunião E Agora? Como Participar Em Inglês$t$);
  update public.mi_lessons set ord=2, title=$t$Manda Bem No E-mail — Profissional, Claro, Sem Erro$t$, description=$t$🎯 Email structure: subject line (clara e objetiva), greeting (Dear/Hi), body (contexto → pedido/info → próximo passo), sign-off (Best regards / Kind regards). Formal vs informal tone.

⚠️ "Dear Sir/Madam" (muito formal/frio) vs "Hi [name]" (casual) — saber onde usar

✅ Prática: Escrever email a partir de briefing · correção

livro: e-mails-profissionais-que-funcionam$t$ where module_id=m and title in ($t$E-mails profissionais que funcionam$t$,$t$Manda Bem No E-mail — Profissional, Claro, Sem Erro$t$);
  update public.mi_lessons set ord=3, title=$t$Vende, Apresenta, Convence — Em Inglês$t$, description=$t$🎯 Presentations: hook opening, estrutura (problem → solution → benefits → CTA), transitions (Moving on to... / As you can see... / To conclude...). Handling questions: "Great question. Let me address that..."

💡 Prática: pitch de 2 minutos sobre seu trabalho/produto

✅ Prática: Apresentação gravada · feedback estruturado

livro: apresentacoes-e-pitch-em-ingles$t$ where module_id=m and title in ($t$Apresentações e pitch em inglês$t$,$t$Vende, Apresenta, Convence — Em Inglês$t$);
  update public.mi_lessons set ord=4, title=$t$Me Contrata — A Entrevista Em Inglês$t$, description=$t$🎯 Job interview: Tell me about yourself (estrutura past→present→future), strengths/weaknesses, competency questions (Tell me about a time when...), salary negotiation (I was hoping for...), perguntas para fazer ao entrevistador.

⚠️ STAR method para competency questions: Situation, Task, Action, Result

✅ Prática: Simulação de entrevista completa

livro: entrevista-de-emprego-em-ingles$t$ where module_id=m and title in ($t$Entrevista de emprego em inglês$t$,$t$Me Contrata — A Entrevista Em Inglês$t$);
  update public.mi_lessons set ord=5, title=$t$Fecha o Negócio — Negociação e Networking$t$, description=$t$🎯 Negociação: fazer proposta (I'd like to propose...), contra-proposta (That's a bit high for us. What about...?), fechar (We have a deal!). Networking: quebrar gelo em eventos, LinkedIn messages, follow-up emails após conhecer alguém.

💡 Ex: "It was great meeting you at the conference. I'd love to connect on LinkedIn."

✅ Prática: Role-play de negociação · email de follow-up

livro: negociacao-e-networking$t$ where module_id=m and title in ($t$Negociação e networking$t$,$t$Fecha o Negócio — Negociação e Networking$t$);
end $mod$;

do $mod$ declare m uuid; l uuid; begin
  select id into m from public.mi_modules where name = $t$Escrita em Inglês$t$ order by created_at limit 1;
  if m is null then raise notice 'Módulo não encontrado: Escrita em Inglês'; return; end if;
  update public.mi_lessons set ord=1, title=$t$Posta Sem Medo — Inglês Nas Redes Sociais$t$, description=$t$🎯 Social media writing: captions (hook + body + CTA), how to sound natural not translated, hashtags em inglês, como responder comentários e DMs profissionalmente.

💡 Comparar: "Today I went to the park" (PT traduzido) vs "Nothing like a Sunday morning in nature 🌿" (nativo)

✅ Prática: Reescrever caption traduzida para nativa · quiz

livro: mensagens-e-redes-sociais-sem-vergonha$t$ where module_id=m and title in ($t$Mensagens e redes sociais sem vergonha$t$,$t$Posta Sem Medo — Inglês Nas Redes Sociais$t$);
  update public.mi_lessons set ord=2, title=$t$Escreve Claro — Do Parágrafo Ao Texto$t$, description=$t$🎯 Writing structure: topic sentence + supporting ideas + concluding sentence. Paragraphing. Transition words para coesão. Diferença entre escrever e falar em inglês. Como revisar o próprio texto.

💡 Prática: escrever parágrafo sobre tema pessoal (trabalho, fé, música)

✅ Prática: Escrever parágrafo · revisão em par

livro: textos-claros-paragrafos-conectores-e-revisao$t$ where module_id=m and title in ($t$Textos claros: parágrafos, conectores e revisão$t$,$t$Escreve Claro — Do Parágrafo Ao Texto$t$);
  update public.mi_lessons set ord=3, title=$t$IA Corrige, Mas Você Decide$t$, description=$t$🎯 Como usar IA (ChatGPT, Grammarly, DeepL) inteligentemente: prompts para correção com explicação, como entender o feedback, quando aceitar ou recusar a sugestão. Manter sua voz e não virar "robô".

⚠️ IA pode corrigir gramática mas não sabe seu estilo e intenção — revisão crítica sempre necessária

✅ Prática: Corrigir texto com IA + análise crítica

livro: usando-ia-pra-revisar-sem-depender-dela$t$ where module_id=m and title in ($t$Usando IA pra revisar (sem depender dela)$t$,$t$IA Corrige, Mas Você Decide$t$);
end $mod$;

-- ===== mentoria-sala.sql =====
-- SALA DE MENTORIA INDIVIDUAL (Google Meet fixo + aviso "Gediel online").
-- Só quem tem o Plano Gênio (ou o que estiver em acesso.dados.mentoria) lê o link da sala; só o admin escreve. Pode rodar mais de uma vez.
create or replace function public.mentoria_acesso() returns boolean language sql stable security definer set search_path=public as
$$ select public.sou_admin() or exists(
     select 1 from acesso a, jsonb_array_elements_text(coalesce(a.dados->'mentoria','["Plano Gênio"]'::jsonb)) t
     where a.id='cfg' and public.comprei(t)) or public.comprei('Plano Gênio') $$;

create table if not exists public.mi_mentoria (
  id text primary key default 'sala',
  link text,                         -- link fixo do Google Meet
  online boolean not null default false,
  online_at timestamptz,             -- batimento: o site do Gediel renova a cada 1 min enquanto ele está na sala
  nome text default 'Gediel'
);
insert into public.mi_mentoria(id) values('sala') on conflict do nothing;

alter table public.mi_mentoria enable row level security;
drop policy if exists mentoria_ler on public.mi_mentoria;
create policy mentoria_ler on public.mi_mentoria for select using (public.mentoria_acesso());
drop policy if exists mentoria_escrever on public.mi_mentoria;
create policy mentoria_escrever on public.mi_mentoria for all using (public.sou_admin()) with check (public.sou_admin());
