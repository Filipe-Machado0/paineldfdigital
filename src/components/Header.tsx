import React from 'react';
import { Kanban, List, Plus, Download, RefreshCw, Cloud } from 'lucide-react';

interface HeaderProps {
  viewMode: 'kanban' | 'table';
  onViewModeChange: (mode: 'kanban' | 'table') => void;
  onNewLead: () => void;
  onExportCSV: () => void;
  onResetData: () => void;
  onOpenCloudSync: () => void;
  isCloudConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onViewModeChange,
  onNewLead,
  onExportCSV,
  onResetData,
  onOpenCloudSync,
  isCloudConnected,
}) => {
  return (
    <header className="bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-30 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-4">
          
          {/* Logo DF DIGITAL */}
          <div className="flex items-center gap-3.5">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-300" />
              <div className="relative h-11 w-11 rounded-xl bg-black border border-blue-500/40 overflow-hidden flex items-center justify-center p-0.5 shadow-lg">
                <img
                  src="/df-digital-logo.jpg"
                  alt="DF Digital Logo"
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    // Fallback to text if image fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-white tracking-wider font-['Plus_Jakarta_Sans']">
                  DF <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">DIGITAL</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 uppercase tracking-widest">
                  CRM Pro
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Painel Comercial &amp; Gestão de Oportunidades
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Cloud Sync Status Indicator */}
            <button
              onClick={onOpenCloudSync}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
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
              <span>{isCloudConnected ? 'Nuvem Conectada' : 'Conectar Nuvem (Sócio)'}</span>
            </button>

            {/* View Switcher */}
            <div className="bg-slate-900/90 p-1 rounded-xl flex items-center border border-slate-800">
              <button
                onClick={() => onViewModeChange('kanban')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'kanban'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Funil Kanban"
              >
                <Kanban className="w-3.5 h-3.5" />
                <span>Funil</span>
              </button>
              <button
                onClick={() => onViewModeChange('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'table'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Lista e Tabela"
              >
                <List className="w-3.5 h-3.5" />
                <span>Tabela</span>
              </button>
            </div>

            {/* Export CSV */}
            <button
              onClick={onExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-800 bg-slate-900/80 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-700 transition-colors"
              title="Baixar lista em CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Exportar</span>
            </button>

            {/* Reset data */}
            <button
              onClick={onResetData}
              className="inline-flex items-center p-2 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Restaurar dados de exemplo"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* New Lead */}
            <button
              onClick={onNewLead}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Lead</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
