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

  // Conversão
  const conversionRate = totalLeads > 0 
    ? Math.round((wonLeads.length / totalLeads) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Leads */}
      <div className="relative group bg-[#0F172A]/90 p-5 rounded-2xl border border-slate-800 shadow-xl overflow-hidden hover:border-blue-500/40 transition-all duration-300">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl group-hover:bg-blue-600/20 transition-all" />
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Total de Oportunidades
          </span>
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-black text-white">{totalLeads}</span>
          <span className="text-xs text-slate-400">
            ({activeLeads.length} ativas)
          </span>
        </div>
      </div>

      {/* Pipeline Aberto */}
      <div className="relative group bg-[#0F172A]/90 p-5 rounded-2xl border border-slate-800 shadow-xl overflow-hidden hover:border-cyan-500/40 transition-all duration-300">
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-600/10 rounded-full blur-2xl group-hover:bg-cyan-600/20 transition-all" />
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Pipeline em Negociação
          </span>
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
            {formatCurrency(pipelineValue)}
          </span>
        </div>
        <div className="mt-1 text-[11px] text-slate-400">
          {activeLeads.length} contratos em negociação
        </div>
      </div>

      {/* Esperando Aprovação */}
      <div className="relative group bg-[#0F172A]/90 p-5 rounded-2xl border border-slate-800 shadow-xl overflow-hidden hover:border-amber-500/40 transition-all duration-300">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-600/10 rounded-full blur-2xl group-hover:bg-amber-600/20 transition-all" />
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Esperando Aprovação
          </span>
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-black text-amber-400">
            {formatCurrency(waitingApprovalValue)}
          </span>
        </div>
        <div className="mt-1 text-[11px] text-amber-400/80">
          {waitingApproval.length} propostas aguardando aceite
        </div>
      </div>

      {/* Receita Fechada */}
      <div className="relative group bg-[#0F172A]/90 p-5 rounded-2xl border border-slate-800 shadow-xl overflow-hidden hover:border-emerald-500/40 transition-all duration-300">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-600/10 rounded-full blur-2xl group-hover:bg-emerald-600/20 transition-all" />
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Contratos Ganhos
          </span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-black text-emerald-400">
            {formatCurrency(wonValue)}
          </span>
          <span className="text-xs text-emerald-400/80">
            ({conversionRate}% conv.)
          </span>
        </div>
        <div className="mt-1 text-[11px] text-slate-400">
          {wonLeads.length} contratos assinados
        </div>
      </div>
    </div>
  );
};
