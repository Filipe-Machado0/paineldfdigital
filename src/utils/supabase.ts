import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Lead, LeadStatus } from '../types';

const env = (typeof import.meta !== 'undefined' && (import.meta as any).env) || {};
const SUPABASE_URL = env.VITE_SUPABASE_URL || 'https://hctgtcljfuutpxnumwih.supabase.co';
const SUPABASE_KEY = env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_jPdHVVqGSi03dyGQxnDgKw_Ntqj3wx0';

export const supabase: SupabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

export function getSupabase(): SupabaseClient {
  return supabase;
}

export function isCloudConnected(): boolean {
  return true;
}

// Mapeador de compatibilidade para os novos 3 status
function normalizeStatus(rawStatus: string): LeadStatus {
  if (rawStatus === 'aprovado' || rawStatus === 'ganho') return 'aprovado';
  if (rawStatus === 'perdido' || rawStatus === 'recusado') return 'perdido';
  return 'proposta'; // padrão para proposta enviada / em andamento
}

// Buscar leads diretamente da nuvem
export async function fetchRemoteLeads(): Promise<Lead[]> {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar do Supabase:', error.message);
      return [];
    }

    if (!data) return [];

    return data.map((item: any) => ({
      id: item.id,
      name: item.name || '',
      company: item.company || '',
      email: item.email || '',
      phone: item.phone || '',
      status: normalizeStatus(item.status || item.proposal_status),
      source: item.source || 'outro',
      service: item.service || 'trafego_pago',
      serviceNameCustom: item.service_name_custom,
      value: Number(item.value) || 0,
      responsible: item.responsible || 'Geral',
      notes: item.notes || '',
      createdAt: item.created_at || new Date().toISOString(),
      updatedAt: item.updated_at || new Date().toISOString(),
    }));
  } catch (err) {
    console.error('Falha de conexão com a nuvem:', err);
    return [];
  }
}

// Salvar ou atualizar lead na nuvem
export async function upsertRemoteLead(lead: Lead): Promise<void> {
  try {
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
      proposal_status: lead.status, // sincroniza com a coluna original
      responsible: lead.responsible || null,
      notes: lead.notes,
      created_at: lead.createdAt,
      updated_at: lead.updatedAt,
    };

    const { error } = await supabase.from('leads').upsert(payload);
    if (error) {
      console.error('Erro ao salvar lead no Supabase:', error.message);
    }
  } catch (err) {
    console.error('Erro ao salvar no Supabase:', err);
  }
}

// Deletar lead na nuvem
export async function deleteRemoteLead(leadId: string): Promise<void> {
  try {
    const { error } = await supabase.from('leads').delete().eq('id', leadId);
    if (error) {
      console.error('Erro ao deletar lead no Supabase:', error.message);
    }
  } catch (err) {
    console.error('Erro ao deletar no Supabase:', err);
  }
}
