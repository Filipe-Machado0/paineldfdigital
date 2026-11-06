import React, { useState } from 'react';
import { X, Cloud, Check, Copy, AlertCircle, Database, ExternalLink } from 'lucide-react';
import { getStoredCloudConfig, saveCloudConfig, SUPABASE_SETUP_SQL } from '../utils/supabase';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: () => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved,
}) => {
  const currentConfig = getStoredCloudConfig();
  const [url, setUrl] = useState(currentConfig.url);
  const [key, setKey] = useState(currentConfig.key);
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveCloudConfig(url, key);
    setStatusMessage('Configuração salva com sucesso! Sincronizando dados...');
    setTimeout(() => {
      onConfigSaved();
      onClose();
    }, 800);
  };

  const handleClear = () => {
    saveCloudConfig('', '');
    setUrl('');
    setKey('');
    setStatusMessage('Voltando para modo local...');
    setTimeout(() => {
      onConfigSaved();
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        className="bg-[#0f172a] rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-blue-500/30 text-slate-100 transform transition-all animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Sincronização em Nuvem (Multi-usuário)
              </h2>
              <p className="text-xs text-slate-400">
                Conecte ao Supabase para que você e seu sócio vejam os mesmos leads em tempo real
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {statusMessage && (
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl font-medium flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Quick Instructions */}
        <div className="mt-4 bg-slate-900/90 rounded-xl p-4 border border-slate-800 text-xs text-slate-300 space-y-2">
          <div className="flex items-center justify-between font-semibold text-white">
            <span>Passo a passo rápido (gratuito):</span>
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 hover:text-blue-300 flex items-center gap-1 hover:underline"
            >
              Criar conta no Supabase <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-400">
            <li>Crie um projeto gratuito no Supabase.</li>
            <li>No menu lateral, abra o <strong>SQL Editor</strong> e rode o script da tabela abaixo.</li>
            <li>Copie a <strong>Project URL</strong> e a <strong>anon key</strong> em <em>Project Settings &gt; API</em>.</li>
          </ol>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleCopySql}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 font-medium transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'SQL Copiado!' : 'Copiar Script SQL da Tabela'}</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Project URL do Supabase
            </label>
            <input
              type="url"
              placeholder="https://xyzcompany.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Anon / Public API Key
            </label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
            />
          </div>

          <div className="p-3 bg-blue-950/40 border border-blue-900/50 rounded-xl text-[11px] text-blue-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <span>
              Ao subir na <strong>Vercel</strong>, você também pode adicionar essas duas variáveis nas <em>Environment Variables</em> do projeto como <code className="text-white font-mono">VITE_SUPABASE_URL</code> e <code className="text-white font-mono">VITE_SUPABASE_ANON_KEY</code>.
            </span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            {currentConfig.url ? (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-rose-400 hover:text-rose-300 hover:underline"
              >
                Desconectar Nuvem (Modo Local)
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all"
              >
                <Cloud className="w-4 h-4" />
                <span>Salvar & Sincronizar</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
