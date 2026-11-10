-- ===================================================
-- SCHEMA SUPABASE: PAINEL DE LEADS (DF DIGITAL)
-- ===================================================

-- 1. Criar tabela de Leads
create table if not exists public.leads (
  id text primary key,
  name text not null default '',
  company text default '',
  email text default '',
  phone text default '',
  status text not null default 'proposta',
  proposal_status text default 'proposta',
  source text default 'outro',
  service text default 'trafego_pago',
  service_name_custom text,
  value numeric default 0,
  responsible text,
  notes text default '',
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 2. Habilitar Row Level Security (RLS)
alter table public.leads enable row level security;

-- 3. Criar Políticas de Acesso (RLS) para permitir que o painel web funcione sem login
drop policy if exists "Permitir leitura de leads" on public.leads;
create policy "Permitir leitura de leads"
  on public.leads for select
  using (true);

drop policy if exists "Permitir criacao de leads" on public.leads;
create policy "Permitir criacao de leads"
  on public.leads for insert
  with check (true);

drop policy if exists "Permitir atualizacao de leads" on public.leads;
create policy "Permitir atualizacao de leads"
  on public.leads for update
  using (true);

drop policy if exists "Permitir delecao de leads" on public.leads;
create policy "Permitir delecao de leads"
  on public.leads for delete
  using (true);

-- 4. Habilitar sincronização em tempo real (Supabase Realtime)
alter publication supabase_realtime add table public.leads;
