import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Lead } from '../types';
import { INITIAL_LEADS } from '../data/mockLeads';

const STORAGE_KEYS = {
  LEADS_LOCAL: 'df_digital_leads_local_v2',
  SUPABASE_URL: 'df_digital_supabase_url',
  SUPABASE_KEY: 'df_digital_supabase_key',
};

export interface CloudConfig {
  url: string;
  key: string;
}

export function getStoredCloudConfig(): CloudConfig {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';
  
  const localUrl = localStorage.getItem(STORAGE_KEYS.SUPABASE_URL) || '';
  const localKey = localStorage.getItem(STORAGE_KEYS.SUPABASE_KEY) || '';

  return {
    url: localUrl || envUrl,
    key: localKey || envKey,
  };
}

export function saveCloudConfig(url: string, key: string): void {
  localStorage.setItem(STORAGE_KEYS.SUPABASE_URL, url.trim());
  localStorage.setItem(STORAGE_KEYS.SUPABASE_KEY, key.trim());
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const { url, key } = getStoredCloudConfig();
  if (!url || !key) {
    supabaseInstance = null;
    return null;
  }
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, key);
    } catch (e) {
      console.error('Erro ao inicializar Supabase:', e);
      return null;
    }
  }
  return supabaseInstance;
}

export function isCloudConnected(): boolean {
  return !!getSupabase();
}

// Local Storage Fallback
export function loadLocalLeads(): Lead[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LEADS_LOCAL);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.LEADS_LOCAL, JSON.stringify(INITIAL_LEADS));
      return INITIAL_LEADS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_LEADS;
  } catch {
    return INITIAL_LEADS;
  }
}

export function saveLocalLeads(leads: Lead[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LEADS_LOCAL, JSON.stringify(leads));
  } catch (err) {
    console.error('Erro ao salvar localmente:', err);
  }
}

// Cloud API
export async function fetchRemoteLeads(): Promise<Lead[]> {
  const supabase = getSupabase();
  if (!supabase) return loadLocalLeads();

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Erro ao buscar do Supabase, usando local:', error.message);
    return loadLocalLeads();
  }

  if (!data || data.length === 0) {
    // If remote table is empty, seed it with initial leads
    for (const lead of INITIAL_LEADS) {
      await upsertRemoteLead(lead);
    }
    return INITIAL_LEADS;
  }

  return data.map((item: any) => ({
    id: item.id,
    name: item.name || '',
    company: item.company || '',
    email: item.email || '',
    phone: item.phone || '',
    status: item.status || 'novo',
    source: item.source || 'outro',
    service: item.service || 'trafego_pago',
    serviceNameCustom: item.service_name_custom,
    value: Number(item.value) || 0,
    proposalStatus: item.proposal_status || 'esperando_aprovacao',
    responsible: item.responsible || 'Geral',
    notes: item.notes || '',
    createdAt: item.created_at || new Date().toISOString(),
    updatedAt: item.updated_at || new Date().toISOString(),
  }));
}

export async function upsertRemoteLead(lead: Lead): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;

  const payload = {
    id: lead.id,
    name: lead.name,
    company: lead.company,
    email: lead.email,
    phone: lead.phone,
    status: lead.status,
    source: lead.source,
    service: lead.service,
    service_name_custom: lead.serviceNameCustom || null,
    value: lead.value,
    proposal_status: lead.proposalStatus,
    responsible: lead.responsible || null,
    notes: lead.notes,
    created_at: lead.createdAt,
    updated_at: lead.updatedAt,
  };

  const { error } = await supabase.from('leads').upsert(payload);
  if (error) {
    console.error('Erro ao salvar lead no Supabase:', error.message);
  }
}

export async function deleteRemoteLead(leadId: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;

  const { error } = await supabase.from('leads').delete().eq('id', leadId);
  if (error) {
    console.error('Erro ao deletar lead no Supabase:', error.message);
  }
}

// SQL Script for user
export const SUPABASE_SETUP_SQL = `-- Script SQL para criar a tabela de leads no Supabase (DF DIGITAL)
-- Copie e cole no SQL Editor do seu projeto Supabase:

create table if not exists public.leads (
  id text primary key,
  name text not null,
  company text default '',
  email text default '',
  phone text default '',
  status text not null default 'novo',
  source text not null default 'site',
  service text not null default 'trafego_pago',
  service_name_custom text,
  value numeric default 0,
  proposal_status text not null default 'esperando_aprovacao',
  responsible text default '',
  notes text default '',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Habilitar leitura e escrita publica (ou configure auth conforme preferir)
alter table public.leads enable row level security;

create policy "Permitir acesso completo a leads"
  on public.leads
  for all
  using (true)
  with check (true);

-- Habilitar Realtime para atualizacao instantanea entre os socios
alter publication supabase_realtime add table public.leads;
`;
