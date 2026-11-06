import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { 
  LEAD_COLUMNS, 
  SERVICE_OPTIONS, 
  PROPOSAL_STATUS_CONFIG, 
  ServiceType, 
  ProposalStatus 
} from '../types';

export type SortOption = 'newest' | 'oldest' | 'value_desc' | 'value_asc' | 'name';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  serviceFilter: string;
  onServiceChange: (service: string) => void;
  proposalStatusFilter: string;
  onProposalStatusChange: (status: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalFiltered: number;
  totalLeads: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  serviceFilter,
  onServiceChange,
  proposalStatusFilter,
  onProposalStatusChange,
  sortBy,
  onSortChange,
  totalFiltered,
  totalLeads,
}) => {
  const hasActiveFilters = 
    searchQuery !== '' || 
    statusFilter !== 'all' || 
    serviceFilter !== 'all' || 
    proposalStatusFilter !== 'all';

  const clearFilters = () => {
    onSearchChange('');
    onStatusChange('all');
    onServiceChange('all');
    onProposalStatusChange('all');
  };

  return (
    <div className="bg-[#0F172A]/90 rounded-2xl border border-slate-800 p-4 mb-6 shadow-xl">
      <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por cliente, empresa, serviço..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-9 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter dropdowns */}
        <div className="flex items-center flex-wrap gap-2 w-full lg:w-auto">
          
          {/* Proposal Status (Situação: esperando aprovação, aprovado, etc.) */}
          <div className="flex-1 sm:flex-initial">
            <select
              value={proposalStatusFilter}
              onChange={(e) => onProposalStatusChange(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 cursor-pointer"
            >
              <option value="all">Todas as Situações</option>
              {(Object.keys(PROPOSAL_STATUS_CONFIG) as ProposalStatus[]).map((st) => (
                <option key={st} value={st}>
                  {PROPOSAL_STATUS_CONFIG[st].label}
                </option>
              ))}
            </select>
          </div>

          {/* Service Filter */}
          <div className="flex-1 sm:flex-initial">
            <select
              value={serviceFilter}
              onChange={(e) => onServiceChange(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 cursor-pointer"
            >
              <option value="all">Todos os Serviços</option>
              {(Object.keys(SERVICE_OPTIONS) as ServiceType[]).map((srv) => (
                <option key={srv} value={srv}>
                  {SERVICE_OPTIONS[srv]}
                </option>
              ))}
            </select>
          </div>

          {/* Pipeline Stage */}
          <div className="flex-1 sm:flex-initial">
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 cursor-pointer"
            >
              <option value="all">Todas as Etapas</option>
              {LEAD_COLUMNS.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.title}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="flex-1 sm:flex-initial">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="w-full sm:w-auto px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 cursor-pointer"
            >
              <option value="newest">Mais recentes</option>
              <option value="oldest">Mais antigos</option>
              <option value="value_desc">Maior valor (R$)</option>
              <option value="value_asc">Menor valor (R$)</option>
              <option value="name">Cliente (A - Z)</option>
            </select>
          </div>

          {/* Clear button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpar</span>
            </button>
          )}
        </div>
      </div>

      {/* Footer bar */}
      <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
          <span>
            Exibindo <strong className="text-white">{totalFiltered}</strong> de <strong className="text-white">{totalLeads}</strong> leads
          </span>
        </div>
        {hasActiveFilters && (
          <span className="text-[11px] text-blue-400 font-medium">
            Filtros ativos
          </span>
        )}
      </div>
    </div>
  );
};
