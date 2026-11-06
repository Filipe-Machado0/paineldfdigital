import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Lead } from '../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  lead: Lead | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  lead,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        className="bg-[#0F172A] rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-rose-500/30 text-white transform transition-all animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-base font-bold text-white text-center">
          Excluir Oportunidade?
        </h3>
        <p className="text-xs text-slate-400 text-center mt-1">
          Tem certeza de que deseja remover <strong className="text-white">{lead.name}</strong>?
        </p>

        <div className="flex items-center gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-all shadow-lg shadow-rose-600/30"
          >
            Sim, excluir
          </button>
        </div>
      </div>
    </div>
  );
};
