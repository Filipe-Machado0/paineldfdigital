import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Lead } from '../types';

// Credenciais integradas nativamente para DF DIGITAL
// Sincroniza automaticamente entre você e seu sócio em qualquer dispositivo!
const DEFAULT_SUPABASE_URL = 'https://uplasakanepwxtmtlvzk.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_r8tuSSViYTu5EBErzVh-Ng_NeEf4hZn';

export const supabase: SupabaseClient = createClient(
  DEFAULT_SUPABASE_URL,
  DEFAULT_SUPABASE_KEY
);

export function getSupabase(): SupabaseClient {
  return supabase;
}

export function isCloudConnected(): boolean {
  return true;
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
