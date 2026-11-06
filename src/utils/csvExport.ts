import { Lead, LEAD_COLUMNS, SERVICE_OPTIONS, PROPOSAL_STATUS_CONFIG, SOURCE_LABELS } from '../types';

export function exportLeadsToCSV(leads: Lead[]): void {
  const headers = [
    'ID',
    'Cliente / Nome',
    'Empresa',
    'Servico',
    'Valor do Servico (R$)',
    'Situacao da Proposta',
    'Etapa no Funil',
    'Responsavel',
    'Email',
    'Telefone',
    'Origem',
    'Observacoes',
    'Criado em',
  ];

  const rows = leads.map((l) => {
    const col = LEAD_COLUMNS.find((c) => c.id === l.status);
    const src = SOURCE_LABELS[l.source] || SOURCE_LABELS.outro;
    const srv = l.service === 'outro' && l.serviceNameCustom ? l.serviceNameCustom : (SERVICE_OPTIONS[l.service] || l.service);
    const propStatus = PROPOSAL_STATUS_CONFIG[l.proposalStatus]?.label || l.proposalStatus;
    
    return [
      `"${l.id}"`,
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.company || '').replace(/"/g, '""')}"`,
      `"${srv.replace(/"/g, '""')}"`,
      l.value || 0,
      `"${propStatus.replace(/"/g, '""')}"`,
      `"${col ? col.title : l.status}"`,
      `"${(l.responsible || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${src ? src.label : l.source}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
      `"${new Date(l.createdAt).toLocaleDateString('pt-BR')}"`,
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `df_digital_leads_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
