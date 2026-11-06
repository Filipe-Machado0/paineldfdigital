import { Lead } from '../types';
import { INITIAL_LEADS } from '../data/mockLeads';

const STORAGE_KEY = 'antigravity_leads_data_v1';

export function loadLeads(): Lead[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LEADS));
      return INITIAL_LEADS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_LEADS;
  } catch (error) {
    console.error('Falha ao carregar leads do localStorage', error);
    return INITIAL_LEADS;
  }
}

export function saveLeads(leads: Lead[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  } catch (error) {
    console.error('Falha ao salvar leads no localStorage', error);
  }
}
