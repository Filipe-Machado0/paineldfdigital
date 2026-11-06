import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  Edit3, 
  Trash2, 
  ArrowRight, 
  ArrowLeft,
  Calendar,
  MessageSquare,
  FileText,
  Briefcase,
  UserCheck
} from 'lucide-react';
import { 
  Lead, 
  LeadStatus, 
  LEAD_COLUMNS, 
  SERVICE_OPTIONS, 
  PROPOSAL_STATUS_CONFIG, 
  SOURCE_LABELS 
} from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface KanbanBoardProps {
  leads: Lead[];
  onUpdateStatus: (leadId: string, newStatus: LeadStatus) => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (lead: Lead) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  leads,
  onUpdateStatus,
  onEditLead,
  onDeleteLead,
}) => {
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<LeadStatus | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedLeadId(id);
  };

  const handleDragEnd = () => {
    setDraggedLeadId(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, colId: LeadStatus) => {
    e.preventDefault();
    if (dragOverColumn !== colId) {
      setDragOverColumn(colId);
    }
  };

  const handleDrop = (e: React.DragEvent, targetStatus: LeadStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedLeadId;
    if (id) {
      onUpdateStatus(id, targetStatus);
    }
    setDraggedLeadId(null);
    setDragOverColumn(null);
  };

  const getNextStatus = (current: LeadStatus): LeadStatus | null => {
    const idx = LEAD_COLUMNS.findIndex((c) => c.id === current);
    if (idx !== -1 && idx < LEAD_COLUMNS.length - 1) {
      return LEAD_COLUMNS[idx + 1].id;
    }
    return null;
  };

  const getPrevStatus = (current: LeadStatus): LeadStatus | null => {
    const idx = LEAD_COLUMNS.findIndex((c) => c.id === current);
    if (idx > 0) {
      return LEAD_COLUMNS[idx - 1].id;
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 pb-12 overflow-x-auto min-h-[620px]">
      {LEAD_COLUMNS.map((column) => {
        const columnLeads = leads.filter((lead) => lead.status === column.id);
        const columnTotalValue = columnLeads.reduce((sum, l) => sum + (l.value || 0), 0);
        const isHovered = dragOverColumn === column.id;

        return (
          <div
            key={column.id}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={() => setDragOverColumn(null)}
            onDrop={(e) => handleDrop(e, column.id)}
            className={`flex flex-col bg-[#0F172A]/70 rounded-2xl border transition-all p-3 shadow-xl ${
              isHovered
                ? 'border-blue-500 bg-blue-950/30 shadow-blue-500/10'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${column.accent} shadow-sm shadow-${column.accent}`} />
                <h2 className="text-xs font-bold text-slate-200 tracking-wider uppercase">
                  {column.title}
                </h2>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border border-current/20 ${column.badgeBg} ${column.badgeText}`}>
                {columnLeads.length}
              </span>
            </div>

            {/* Column Total */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-3 px-1">
              <span>Previsto:</span>
              <span className="font-bold text-slate-200">
                {formatCurrency(columnTotalValue)}
              </span>
            </div>

            {/* Cards List */}
            <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-320px)] pr-0.5">
              {columnLeads.length === 0 ? (
                <div className="h-28 border border-dashed border-slate-800 rounded-xl flex items-center justify-center text-slate-500 text-xs text-center p-3">
                  Nenhum lead nesta etapa
                </div>
              ) : (
                columnLeads.map((lead) => {
                  const serviceName = lead.service === 'outro' && lead.serviceNameCustom
                    ? lead.serviceNameCustom
                    : SERVICE_OPTIONS[lead.service] || lead.service;

                  const proposalCfg = PROPOSAL_STATUS_CONFIG[lead.proposalStatus] || PROPOSAL_STATUS_CONFIG.esperando_aprovacao;
                  const sourceCfg = SOURCE_LABELS[lead.source] || SOURCE_LABELS.outro;
                  const nextStatus = getNextStatus(lead.status);
                  const prevStatus = getPrevStatus(lead.status);
                  const cleanPhone = lead.phone.replace(/\D/g, '');

                  return (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      onDragEnd={handleDragEnd}
                      className={`group bg-[#131D33] rounded-xl border border-slate-700/70 p-3.5 shadow-lg hover:shadow-2xl hover:border-blue-500/50 transition-all cursor-grab active:cursor-grabbing ${
                        draggedLeadId === lead.id ? 'opacity-40 scale-95' : 'opacity-100'
                      }`}
                    >
                      {/* Top Row: Proposal Situation Badge & Quick Actions */}
                      <div className="flex items-center justify-between gap-1 mb-2.5">
                        {/* Situação da Proposta / Serviço */}
                        <span
                          className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-md border ${proposalCfg.badgeClass}`}
                          title={`Situação do lead: ${proposalCfg.label}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${proposalCfg.dotClass}`} />
                          <span className="truncate">{proposalCfg.label}</span>
                        </span>

                        <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onEditLead(lead)}
                            className="p-1 text-slate-400 hover:text-blue-400 rounded-md hover:bg-slate-800 transition-colors"
                            title="Editar Lead"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteLead(lead)}
                            className="p-1 text-slate-400 hover:text-rose-400 rounded-md hover:bg-slate-800 transition-colors"
                            title="Excluir Lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Lead Name & Company */}
                      <div className="mb-2">
                        <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                          {lead.name}
                        </h3>
                        {lead.company && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                            <Building2 className="w-3 h-3 text-slate-500 shrink-0" />
                            <span className="truncate">{lead.company}</span>
                          </div>
                        )}
                      </div>

                      {/* Qual é o Serviço em questão */}
                      <div className="bg-slate-900/90 rounded-lg p-2 border border-slate-800 mb-2">
                        <div className="flex items-center gap-1.5 text-blue-400 text-xs font-semibold">
                          <Briefcase className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{serviceName}</span>
                        </div>
                        
                        {/* Valor do Serviço em questão */}
                        <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-800/80">
                          <span className="text-[10px] text-slate-400 font-medium">Valor do Serviço:</span>
                          <span className="text-xs font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                            {formatCurrency(lead.value)}
                          </span>
                        </div>
                      </div>

                      {/* Responsible & Source tag */}
                      <div className="flex items-center justify-between text-[10px] mb-2 px-0.5">
                        <span className={`px-2 py-0.5 rounded border ${sourceCfg.badgeClass}`}>
                          {sourceCfg.label}
                        </span>
                        {lead.responsible && (
                          <span className="text-slate-400 flex items-center gap-1 bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700">
                            <UserCheck className="w-3 h-3 text-slate-400" />
                            <span>{lead.responsible}</span>
                          </span>
                        )}
                      </div>

                      {/* Notes snippet */}
                      {lead.notes && (
                        <div className="flex items-start gap-1 text-[11px] text-slate-300 bg-slate-900/60 border border-slate-800 rounded-md p-1.5 mb-2 line-clamp-2">
                          <FileText className="w-3 h-3 text-blue-400 mt-0.5 shrink-0" />
                          <span className="leading-tight">{lead.notes}</span>
                        </div>
                      )}

                      {/* Contacts & Date */}
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-800 text-xs">
                        {lead.phone && (
                          <a
                            href={`https://wa.me/55${cleanPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 hover:underline"
                            title="Chamar no WhatsApp"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>
                        )}
                        {lead.email && (
                          <a
                            href={`mailto:${lead.email}`}
                            className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-blue-400 hover:underline"
                            title={lead.email}
                          >
                            <Mail className="w-3 h-3" />
                            <span>E-mail</span>
                          </a>
                        )}
                        <span className="ml-auto text-[10px] text-slate-500 flex items-center gap-0.5">
                          <Calendar className="w-2.5 h-2.5" />
                          {formatDate(lead.createdAt)}
                        </span>
                      </div>

                      {/* Move Column Step Buttons */}
                      <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-800">
                        {prevStatus ? (
                          <button
                            onClick={() => onUpdateStatus(lead.id, prevStatus)}
                            className="text-[10px] text-slate-400 hover:text-white flex items-center gap-0.5 px-2 py-0.5 rounded hover:bg-slate-800 transition-colors"
                            title="Voltar etapa"
                          >
                            <ArrowLeft className="w-3 h-3" />
                            <span>Voltar</span>
                          </button>
                        ) : <div />}

                        {nextStatus && (
                          <button
                            onClick={() => onUpdateStatus(lead.id, nextStatus)}
                            className="text-[10px] text-blue-400 font-semibold hover:text-blue-300 flex items-center gap-0.5 px-2 py-0.5 rounded hover:bg-blue-950/40 ml-auto transition-colors"
                            title="Avançar etapa"
                          >
                            <span>Avançar</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
