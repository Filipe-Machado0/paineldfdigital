import React, { useState } from 'react';
import { Search, X, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

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
    <div className="bg-[#0F172A]/90 rounded-xl sm:rounded-2xl border border-slate-800 p-3 sm:p-4 mb-4 sm:mb-6 shadow-xl">
      <div className="flex flex-col lg:flex-row gap-2.5 sm:gap-3 items-stretch lg:items-center justify-between">
        
        {/* Search Input & Mobile Filter Toggle */}
        <div className="flex items-center gap-2 w-full lg:w-80">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar cliente, serviço..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className={`lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold shrink-0 transition-colors ${
              isMobileFiltersOpen || hasActiveFilters
                ? 'bg-blue-600 text-white border-blue-500'
                : 'bg-slate-900 text-slate-300 border-slate-700'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filtros</span>
            {isMobileFiltersOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Filter dropdowns (Desktop always visible, Mobile collapsible) */}
        <div className={`${isMobileFiltersOpen ? 'flex' : 'hidden'} lg:flex flex-col sm:flex-row items-stretch sm:items-center flex-wrap gap-2 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800`}>
          
          {/* Proposal Status (Situação) */}
          <div className="flex-1 sm:flex-initial">
            <select
              value={proposalStatusFilter}
              onChange={(e) => onProposalStatusChange(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 cursor-pointer"
            >
              <option value="all">Todas as Situações</option>
              {(Object.keys(PROPOSAL_STATUS_CONFIG) as ProposalStatus[]).map((st) => (
                <option key={st} value={st} className="bg-slate-900 text-white">
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
                <option key={srv} value={srv} className="bg-slate-900 text-white">
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
                <option key={col.id} value={col.id} className="bg-slate-900 text-white">
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
              <option value="name">Nome (A - Z)</option>
            </select>
          </div>

          {/* Clear button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpar Filtros</span>
            </button>
          )}
        </div>
      </div>

      {/* Footer count indicator */}
      <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] sm:text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="w-3 h-3 text-blue-400" />
          <span>
            Exibindo <strong className="text-white">{totalFiltered}</strong> de <strong className="text-white">{totalLeads}</strong> leads
          </span>
        </div>
        {hasActiveFilters && (
          <span className="text-blue-400 font-medium">
            Filtros ativos
          </span>
        )}
      </div>
    </div>
  );
};
