-- englishbygediel · modos nos produtos e agenda da consultoria gratuita (rode DEPOIS do admin.sql)
-- Cole tudo no Supabase: SQL Editor → New query → Run.

-- 1. Em quais modos cada produto aparece -------------------------------------
alter table public.produtos add column if not exists modos text[] not null default '{}';

-- 2. Horários que o Gediel abre no painel ------------------------------------
create table if not exists public.horarios (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  inicio       timestamptz not null unique,
  duracao_min  int not null default 30 check (duracao_min between 10 and 180),
  reservado    boolean not null default false
);
alter table public.horarios enable row level security;
-- o site só enxerga horários livres e futuros
drop policy if exists "site ve horarios livres" on public.horarios;
create policy "site ve horarios livres" on public.horarios for select to anon, authenticated
  using ((not reservado and inicio > now()) or public.is_admin());
drop policy if exists "admin cria horarios" on public.horarios;
create policy "admin cria horarios" on public.horarios for insert to authenticated with check (public.is_admin());
drop policy if exists "admin edita horarios" on public.horarios;
create policy "admin edita horarios" on public.horarios for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin apaga horarios" on public.horarios;
create policy "admin apaga horarios" on public.horarios for delete to authenticated using (public.is_admin());

-- 3. Reservas -----------------------------------------------------------------
create table if not exists public.agendamentos (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  horario_id  uuid not null unique references public.horarios(id) on delete cascade,
  lead_id     uuid,
  nome        text not null check (char_length(nome) between 1 and 120),
  whatsapp    text not null check (char_length(whatsapp) between 8 and 25),
  email       text check (email is null or char_length(email) <= 200),
  instagram   text check (instagram is null or char_length(instagram) <= 60),
  modo        text check (modo is null or char_length(modo) <= 40)
);
alter table public.agendamentos enable row level security;
drop policy if exists "admin le agendamentos" on public.agendamentos;
create policy "admin le agendamentos" on public.agendamentos for select to authenticated using (public.is_admin());
drop policy if exists "admin apaga agendamentos" on public.agendamentos;
create policy "admin apaga agendamentos" on public.agendamentos for delete to authenticated using (public.is_admin());

-- 4. Reservar: o site chama esta função. Ela só reserva se o horário ainda estiver livre,
--    então duas pessoas nunca ficam com o mesmo horário.
create or replace function public.reservar_horario(
  p_horario uuid, p_nome text, p_whatsapp text,
  p_email text default null, p_instagram text default null, p_modo text default null, p_lead uuid default null
) returns boolean
language plpgsql security definer set search_path = public as $$
begin
  if char_length(coalesce(p_nome, '')) not between 1 and 120 or char_length(coalesce(p_whatsapp, '')) not between 8 and 25 then
    return false;
  end if;
  update public.horarios set reservado = true
    where id = p_horario and not reservado and inicio > now();
  if not found then return false; end if;
  insert into public.agendamentos (horario_id, lead_id, nome, whatsapp, email, instagram, modo)
    values (p_horario, p_lead, p_nome, p_whatsapp, nullif(p_email, ''), nullif(p_instagram, ''), nullif(p_modo, ''));
  return true;
end;
$$;
revoke all on function public.reservar_horario(uuid, text, text, text, text, text, uuid) from public;
grant execute on function public.reservar_horario(uuid, text, text, text, text, text, uuid) to anon, authenticated;

-- 5. Se o Gediel apagar uma reserva no painel, o horário volta a ficar livre
create or replace function public.liberar_horario() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update public.horarios set reservado = false where id = old.horario_id;
  return old;
end;
$$;
drop trigger if exists agendamento_apagado on public.agendamentos;
create trigger agendamento_apagado after delete on public.agendamentos for each row execute function public.liberar_horario();
