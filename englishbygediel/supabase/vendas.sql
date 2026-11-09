-- englishbygediel · vendas (Kiwify) — rode DEPOIS do admin.sql
-- Cole no Supabase: SQL Editor → New query → Run.
-- A Kiwify avisa cada venda no endereço /.netlify/functions/kiwify do site, que grava aqui.
-- Só o servidor (função do Netlify, com a chave service_role) grava; só o admin lê.

create table if not exists public.vendas (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  atualizado  timestamptz not null default now(),
  pedido      text unique not null,
  status      text,            -- paid, refunded, waiting_payment, refused, chargedback...
  evento      text,            -- order_approved, order_refunded...
  produto     text,
  produto_id  text,
  valor       numeric(12,2),   -- em reais
  moeda       text,
  metodo      text,            -- pix, credit_card, boleto
  nome        text,
  email       text,
  whatsapp    text,
  instagram   text,
  utm_source  text,
  utm_campaign text,
  pago_em     timestamptz,
  bruto       jsonb            -- o aviso completo da Kiwify
);
create index if not exists vendas_data_idx on public.vendas (created_at);
create index if not exists vendas_email_idx on public.vendas (lower(email));
alter table public.vendas enable row level security;
drop policy if exists "admin le vendas" on public.vendas;
create policy "admin le vendas" on public.vendas for select to authenticated using (public.is_admin());
drop policy if exists "admin apaga vendas" on public.vendas;
create policy "admin apaga vendas" on public.vendas for delete to authenticated using (public.is_admin());
-- leitura das tabelas antigas pelo painel (cadastros do catálogo antigo)
drop policy if exists "admin le leads" on public.leads;
create policy "admin le leads" on public.leads for select to authenticated using (public.is_admin());
