import React from 'react';
import { Users, TrendingUp, CheckCircle2, DollarSign } from 'lucide-react';
import { Lead } from '../types';
import { formatCurrency } from '../utils/formatters';

interface MetricsCardsProps {
  leads: Lead[];
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ leads }) => {
  const totalLeads = leads.length;
  
  // Pipeline ativo (novo, contato, qualificado, proposta)
  const activeLeads = leads.filter(l => !['ganho', 'perdido'].includes(l.status));
  const pipelineValue = activeLeads.reduce((acc, curr) => acc + (curr.value || 0), 0);

  // Ganhos
  const wonLeads = leads.filter(l => l.status === 'ganho');
  const wonValue = wonLeads.reduce((acc, curr) => acc + (curr.value || 0), 0);

  // Aguardando aprovação
  const waitingApproval = leads.filter(l => l.proposalStatus === 'esperando_aprovacao');
  const waitingApprovalValue = waitingApproval.reduce((acc, curr) => acc + (curr.value || 0), 0);

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
            ({activeLeads.length} ativas)
          </span>
        </div>
      </div>

      {/* Pipeline Aberto */}
      <div className="relative group bg-[#0F172A]/90 p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-800 shadow-lg overflow-hidden hover:border-cyan-500/40 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
            Pipeline Aberto
          </span>
          <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="mt-2 sm:mt-3">
          <span className="text-base sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 block truncate">
            {formatCurrency(pipelineValue)}
          </span>
          <span className="text-[10px] text-slate-400 hidden sm:block mt-0.5">
            {activeLeads.length} propostas em jogo
          </span>
        </div>
      </div>

      {/* Esperando Aprovação */}
      <div className="relative group bg-[#0F172A]/90 p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-800 shadow-lg overflow-hidden hover:border-amber-500/40 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
            Aguardando Aceite
          </span>
          <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
            <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="mt-2 sm:mt-3">
          <span className="text-base sm:text-2xl font-black text-amber-400 block truncate">
            {formatCurrency(waitingApprovalValue)}
          </span>
          <span className="text-[10px] text-amber-400/80 hidden sm:block mt-0.5">
            {waitingApproval.length} propostas
          </span>
        </div>
      </div>

      {/* Receita Fechada */}
      <div className="relative group bg-[#0F172A]/90 p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-800 shadow-lg overflow-hidden hover:border-emerald-500/40 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
            Contratos Ganhos
          </span>
          <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="mt-2 sm:mt-3">
          <span className="text-base sm:text-2xl font-black text-emerald-400 block truncate">
            {formatCurrency(wonValue)}
          </span>
          <span className="text-[10px] text-emerald-400/80 hidden sm:block mt-0.5">
            {wonLeads.length} contratos fechados
          </span>
        </div>
      </div>
    </div>
  );
};
