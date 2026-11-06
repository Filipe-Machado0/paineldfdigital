import React from 'react';
import { Kanban, List, Plus, Download, Cloud } from 'lucide-react';

interface HeaderProps {
  viewMode: 'kanban' | 'table';
  onViewModeChange: (mode: 'kanban' | 'table') => void;
  onNewLead: () => void;
  onExportCSV: () => void;
  onOpenCloudSync: () => void;
  isCloudConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onViewModeChange,
  onNewLead,
  onExportCSV,
  onOpenCloudSync,
  isCloudConnected,
}) => {
  return (
    <header className="bg-[#0B0F19]/95 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-40 shadow-2xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2.5 sm:py-3.5 gap-2">
          
          {/* Logo DF DIGITAL */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <div className="relative group shrink-0">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-300" />
              <div className="relative h-9 w-9 sm:h-11 sm:w-11 rounded-xl bg-black border border-blue-500/40 overflow-hidden flex items-center justify-center p-0.5 shadow-lg">
                <img
                  src="/df-digital-logo.jpg"
                  alt="DF Digital Logo"
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
            
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-xl font-black text-white tracking-wider truncate">
                  DF <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">DIGITAL</span>
                </span>
                <span className="hidden xs:inline-block text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 uppercase tracking-wider">
                  CRM
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 truncate hidden sm:block">
                Painel Comercial &amp; Gestão de Oportunidades
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Cloud Sync Status Indicator */}
            <button
              onClick={onOpenCloudSync}
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isCloudConnected
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/30 shadow-sm shadow-emerald-900/30'
                  : 'bg-slate-900/80 text-blue-300 border-blue-500/30 hover:bg-blue-950/40'
              }`}
              title="Configurar compartilhamento com o sócio (Supabase)"
            >
              <span className="relative flex h-2 w-2">
                {isCloudConnected && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isCloudConnected ? 'bg-emerald-500' : 'bg-blue-400'
                  }`}
                />
              </span>
              <Cloud className="w-3.5 h-3.5" />
              <span className="hidden md:inline">
                {isCloudConnected ? 'Nuvem Ativa' : 'Conectar Nuvem'}
              </span>
            </button>

            {/* View Switcher */}
            <div className="bg-slate-900/90 p-0.5 sm:p-1 rounded-xl flex items-center border border-slate-800">
              <button
                onClick={() => onViewModeChange('kanban')}
                className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'kanban'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Funil Kanban"
              >
                <Kanban className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Funil</span>
              </button>
              <button
                onClick={() => onViewModeChange('table')}
                className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'table'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Lista e Tabela"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lista</span>
              </button>
            </div>

            {/* Export CSV (Desktop only) */}
            <button
              onClick={onExportCSV}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-800 bg-slate-900/80 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Baixar lista em CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Exportar</span>
            </button>

            {/* New Lead Button */}
            <button
              onClick={onNewLead}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Novo<span className="hidden sm:inline"> Lead</span></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
