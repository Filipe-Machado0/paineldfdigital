export type LeadStatus = 'proposta' | 'aprovado' | 'perdido';

export type LeadSource = 
  | 'instagram' 
  | 'google' 
  | 'site' 
  | 'linkedin' 
  | 'indicacao' 
  | 'outro';

export type ServiceType = 
  | 'trafego_pago'
  | 'landing_page'
  | 'social_media'
  | 'branding'
  | 'automacao_crm'
  | 'assessoria_completa'
  | 'outro';

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: LeadStatus;
  source: LeadSource;
  
  // Custom fields for DF DIGITAL
  service: ServiceType;
  serviceNameCustom?: string;
  value: number; // Valor do serviço em R$
  responsible?: string; // Responsável (Você ou o Sócio)
  
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ColumnDefinition {
  id: LeadStatus;
  title: string;
  color: string;
  accent: string;
  badgeBg: string;
  badgeText: string;
}

export const LEAD_COLUMNS: ColumnDefinition[] = [
  { 
    id: 'proposta', 
    title: 'Proposta Enviada', 
    color: 'border-blue-500', 
    accent: 'bg-blue-500', 
    badgeBg: 'bg-blue-950/60', 
    badgeText: 'text-blue-400' 
  },
  { 
    id: 'aprovado', 
    title: 'Aprovado', 
    color: 'border-emerald-500', 
    accent: 'bg-emerald-500', 
    badgeBg: 'bg-emerald-950/60', 
    badgeText: 'text-emerald-400' 
  },
  { 
    id: 'perdido', 
    title: 'Perdido', 
    color: 'border-rose-500', 
    accent: 'bg-rose-500', 
    badgeBg: 'bg-rose-950/60', 
    badgeText: 'text-rose-400' 
  },
];

export const SERVICE_OPTIONS: Record<ServiceType, string> = {
  trafego_pago: 'Tráfego Pago (Meta & Google Ads)',
  landing_page: 'Criação de Site / Landing Page',
  social_media: 'Gestão de Redes Sociais',
  branding: 'Identidade Visual & Branding',
  automacao_crm: 'Automação & CRM',
  assessoria_completa: 'Assessoria Digital Completa (360°)',
  outro: 'Outro Serviço',
};

export const STATUS_CONFIG: Record<LeadStatus, { label: string; badgeClass: string; dotClass: string }> = {
  proposta: {
    label: 'Proposta Enviada',
    badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    dotClass: 'bg-blue-400 animate-pulse',
  },
  aprovado: {
    label: 'Aprovado',
    badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    dotClass: 'bg-emerald-400',
  },
  perdido: {
    label: 'Perdido',
    badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    dotClass: 'bg-rose-400',
  },
};

export const SOURCE_LABELS: Record<LeadSource, { label: string; badgeClass: string }> = {
  instagram: { label: 'Instagram Direct / Reels', badgeClass: 'bg-pink-500/15 text-pink-300 border-pink-500/30' },
  google: { label: 'Google Ads', badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
  site: { label: 'Site / Landing Page', badgeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' },
  linkedin: { label: 'LinkedIn', badgeClass: 'bg-sky-500/15 text-sky-300 border-sky-500/30' },
  indicacao: { label: 'Indicação', badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  outro: { label: 'Outro', badgeClass: 'bg-slate-500/15 text-slate-300 border-slate-500/30' },
};
