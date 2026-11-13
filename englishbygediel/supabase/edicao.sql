-- Modo edição dentro da plataforma (rodar depois do COLE-NO-SUPABASE.sql e do membros.sql)
-- 1) cards de qualquer menu (não só eom/culture/viagens) e regra de acesso por card
alter table public.mi_uni_cards drop constraint if exists mi_uni_cards_universo_check;
alter table public.mi_uni_cards add constraint mi_uni_cards_universo_check check (universo ~ '^[a-z0-9_-]{1,30}$');
alter table public.mi_uni_cards add column if not exists acesso text not null default 'todos';
alter table public.mi_uni_cards drop constraint if exists mi_uni_cards_acesso_check;
alter table public.mi_uni_cards add constraint mi_uni_cards_acesso_check check (acesso in ('todos','programa','produto'));
alter table public.mi_uni_cards add column if not exists produto text;
alter table public.mi_uni_cards add column if not exists checkout text;

-- 2) materiais com capa, seção, preço e visível/oculto
alter table public.materiais add column if not exists capa_url text;
alter table public.materiais add column if not exists secao text default '';
alter table public.materiais add column if not exists preco text default '';
alter table public.materiais add column if not exists ativo boolean not null default true;
