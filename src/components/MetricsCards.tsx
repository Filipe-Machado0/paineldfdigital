import React from 'react';
import { Users, Send, CheckCircle2, XCircle } from 'lucide-react';
import { Lead } from '../types';
import { formatCurrency } from '../utils/formatters';

interface MetricsCardsProps {
  leads: Lead[];
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ leads }) => {
  const totalLeads = leads.length;
  
  // Propostas Enviadas (em negociação)
  const sentProposals = leads.filter(l => l.status === 'proposta');
  const sentProposalsValue = sentProposals.reduce((acc, curr) => acc + (curr.value || 0), 0);

  // Aprovados
  const approvedLeads = leads.filter(l => l.status === 'aprovado');
  const approvedValue = approvedLeads.reduce((acc, curr) => acc + (curr.value || 0), 0);

  // Perdidos
  const lostLeads = leads.filter(l => l.status === 'perdido');
  const lostValue = lostLeads.reduce((acc, curr) => acc + (curr.value || 0), 0);

  // Taxa de conversão
  const conversionRate = totalLeads > 0 
    ? Math.round((approvedLeads.length / totalLeads) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-4 sm:mb-6">
      {/* Total Leads */}
      <div className="relative group bg-[#0F172A]/90 p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-800 shadow-lg overflow-hidden hover:border-blue-500/40 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
            Total Leads
          </span>
          <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="mt-2 sm:mt-3 flex items-baseline gap-1.5">
          <span className="text-xl sm:text-2xl font-black text-white">{totalLeads}</span>
          <span className="text-[10px] sm:text-xs text-slate-400 truncate">
            ({conversionRate}% conv.)
          </span>
        </div>
      </div>

      {/* Propostas Enviadas */}
      <div className="relative group bg-[#0F172A]/90 p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-800 shadow-lg overflow-hidden hover:border-blue-500/40 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-[11px] font-bold text-blue-400 uppercase tracking-wider truncate">
            Proposta Enviada
          </span>
          <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
            <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="mt-2 sm:mt-3">
          <span className="text-base sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 block truncate">
            {formatCurrency(sentProposalsValue)}
          </span>
          <span className="text-[10px] text-slate-400 hidden sm:block mt-0.5">
            {sentProposals.length} propostas em análise
          </span>
        </div>
      </div>

      {/* Aprovados */}
      <div className="relative group bg-[#0F172A]/90 p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-800 shadow-lg overflow-hidden hover:border-emerald-500/40 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-[11px] font-bold text-emerald-400 uppercase tracking-wider truncate">
            Aprovado
          </span>
          <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="mt-2 sm:mt-3">
          <span className="text-base sm:text-2xl font-black text-emerald-400 block truncate">
            {formatCurrency(approvedValue)}
          </span>
          <span className="text-[10px] text-emerald-400/80 hidden sm:block mt-0.5">
            {approvedLeads.length} contratos fechados
          </span>
        </div>
      </div>

      {/* Perdidos */}
      <div className="relative group bg-[#0F172A]/90 p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-800 shadow-lg overflow-hidden hover:border-rose-500/40 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-[11px] font-bold text-rose-400 uppercase tracking-wider truncate">
            Perdido
          </span>
          <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0">
            <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="mt-2 sm:mt-3">
          <span className="text-base sm:text-2xl font-black text-rose-400 block truncate">
            {formatCurrency(lostValue)}
          </span>
          <span className="text-[10px] text-slate-400 hidden sm:block mt-0.5">
            {lostLeads.length} não aprovados
          </span>
        </div>
      </div>
    </div>
  );
};
