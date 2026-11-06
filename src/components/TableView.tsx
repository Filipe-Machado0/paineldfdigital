import React from 'react';
import { 
  Building2, 
  Mail, 
  Edit3, 
  Trash2, 
  MessageSquare, 
  Briefcase, 
  UserCheck,
  Calendar
} from 'lucide-react';
import { 
  Lead, 
  LeadStatus, 
  ProposalStatus, 
  LEAD_COLUMNS, 
  SERVICE_OPTIONS, 
  PROPOSAL_STATUS_CONFIG 
} from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface TableViewProps {
  leads: Lead[];
  onUpdateStatus: (leadId: string, newStatus: LeadStatus) => void;
  onUpdateProposalStatus: (leadId: string, newStatus: ProposalStatus) => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (lead: Lead) => void;
}

export const TableView: React.FC<TableViewProps> = ({
  leads,
  onUpdateStatus,
  onUpdateProposalStatus,
  onEditLead,
  onDeleteLead,
}) => {
  if (leads.length === 0) {
    return (
      <div className="bg-[#0F172A]/90 rounded-2xl border border-slate-800 p-8 sm:p-12 text-center shadow-xl mb-12">
        <p className="text-sm text-slate-400 font-medium">Nenhum lead encontrado com os filtros aplicados.</p>
      </div>
    );
  }

  return (
    <div className="mb-12">
      {/* Mobile Card List View (Visible only on phone screens) */}
      <div className="sm:hidden space-y-3">
        {leads.map((lead) => {
          const serviceName = lead.service === 'outro' && lead.serviceNameCustom
            ? lead.serviceNameCustom
            : SERVICE_OPTIONS[lead.service] || lead.service;

          const proposalCfg = PROPOSAL_STATUS_CONFIG[lead.proposalStatus] || PROPOSAL_STATUS_CONFIG.esperando_aprovacao;
          const currentStatusCol = LEAD_COLUMNS.find((c) => c.id === lead.status);
          const cleanPhone = lead.phone.replace(/\D/g, '');

          return (
            <div
              key={lead.id}
              className="bg-[#0F172A] rounded-2xl border border-slate-800 p-4 shadow-xl space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-white">{lead.name}</h4>
                  {lead.company && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{lead.company}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditLead(lead)}
                    className="p-1.5 text-slate-400 hover:text-blue-400 rounded-lg hover:bg-slate-800"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteLead(lead)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Service & Value */}
              <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400">
                  <Briefcase className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate max-w-[160px]">{serviceName}</span>
                </div>
                <span className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  {formatCurrency(lead.value)}
                </span>
              </div>

              {/* Status and Proposal dropdowns */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Situação:</label>
                  <select
                    value={lead.proposalStatus}
                    onChange={(e) => onUpdateProposalStatus(lead.id, e.target.value as ProposalStatus)}
                    className={`w-full text-xs font-semibold py-1.5 px-2 rounded-lg border cursor-pointer ${proposalCfg.badgeClass} bg-slate-900`}
                  >
                    {(Object.keys(PROPOSAL_STATUS_CONFIG) as ProposalStatus[]).map((key) => (
                      <option key={key} value={key} className="bg-slate-900 text-white">
                        {PROPOSAL_STATUS_CONFIG[key].label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Etapa no Funil:</label>
                  <select
                    value={lead.status}
                    onChange={(e) => onUpdateStatus(lead.id, e.target.value as LeadStatus)}
                    className={`w-full text-xs font-semibold py-1.5 px-2 rounded-lg border border-slate-700 cursor-pointer ${currentStatusCol?.badgeBg} ${currentStatusCol?.badgeText}`}
                  >
                    {LEAD_COLUMNS.map((col) => (
                      <option key={col.id} value={col.id} className="bg-slate-900 text-white">
                        {col.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Mobile WhatsApp Button */}
              {lead.phone && (
                <a
                  href={`https://wa.me/55${cleanPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-colors active:scale-[0.98]"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chamar no WhatsApp</span>
                </a>
              )}

              {/* Responsável e Data */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                {lead.responsible ? (
                  <span className="flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-blue-400" />
                    <span>{lead.responsible}</span>
                  </span>
                ) : <div />}
                <span className="flex items-center gap-1 text-[10px]">
                  <Calendar className="w-3 h-3" />
                  {formatDate(lead.createdAt)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Classic Table View (Hidden on mobile) */}
      <div className="hidden sm:block bg-[#0F172A]/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Cliente &amp; Empresa</th>
                <th className="py-3.5 px-4">Serviço em Questão</th>
                <th className="py-3.5 px-4">Valor</th>
                <th className="py-3.5 px-4">Situação da Proposta</th>
                <th className="py-3.5 px-4">Etapa no Funil</th>
                <th className="py-3.5 px-4">Responsável</th>
                <th className="py-3.5 px-4">Contatos</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-sm">
              {leads.map((lead) => {
                const serviceName = lead.service === 'outro' && lead.serviceNameCustom
                  ? lead.serviceNameCustom
                  : SERVICE_OPTIONS[lead.service] || lead.service;

                const proposalCfg = PROPOSAL_STATUS_CONFIG[lead.proposalStatus] || PROPOSAL_STATUS_CONFIG.esperando_aprovacao;
                const currentStatusCol = LEAD_COLUMNS.find((c) => c.id === lead.status);
                const cleanPhone = lead.phone.replace(/\D/g, '');

                return (
                  <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="font-bold text-white group-hover:text-blue-400 transition-colors">
                        {lead.name}
                      </div>
                      {lead.company ? (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>{lead.company}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 italic">Sem empresa</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-200">
                        <Briefcase className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="truncate max-w-[200px]" title={serviceName}>
                          {serviceName}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 text-sm">
                        {formatCurrency(lead.value)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={lead.proposalStatus}
                        onChange={(e) => onUpdateProposalStatus(lead.id, e.target.value as ProposalStatus)}
                        className={`text-xs font-semibold py-1 px-2.5 rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${proposalCfg.badgeClass} bg-slate-900`}
                      >
                        {(Object.keys(PROPOSAL_STATUS_CONFIG) as ProposalStatus[]).map((key) => (
                          <option key={key} value={key} className="bg-slate-900 text-white">
                            {PROPOSAL_STATUS_CONFIG[key].label}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={lead.status}
                        onChange={(e) => onUpdateStatus(lead.id, e.target.value as LeadStatus)}
                        className={`text-xs font-semibold py-1 px-2.5 rounded-lg border border-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${currentStatusCol?.badgeBg} ${currentStatusCol?.badgeText}`}
                      >
                        {LEAD_COLUMNS.map((col) => (
                          <option key={col.id} value={col.id} className="bg-slate-900 text-white">
                            {col.title}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-xs text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700">
                        <UserCheck className="w-3 h-3 text-blue-400" />
                        <span>{lead.responsible || 'Geral'}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        {lead.phone && (
                          <a
                            href={`https://wa.me/55${cleanPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                            title="WhatsApp"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </a>
                        )}
                        {lead.email && (
                          <a
                            href={`mailto:${lead.email}`}
                            className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                            title={lead.email}
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEditLead(lead)}
                          className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="Editar Lead"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteLead(lead)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                          title="Excluir Lead"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
