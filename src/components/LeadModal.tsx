import React, { useState, useEffect } from 'react';
import { X, Briefcase, DollarSign, UserCheck } from 'lucide-react';
import { 
  Lead, 
  LeadSource, 
  LeadStatus, 
  ServiceType, 
  ProposalStatus, 
  LEAD_COLUMNS, 
  SERVICE_OPTIONS, 
  PROPOSAL_STATUS_CONFIG, 
  SOURCE_LABELS 
} from '../types';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
  initialLead?: Lead | null;
}

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialLead,
}) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<LeadStatus>('novo');
  const [source, setSource] = useState<LeadSource>('instagram');
  const [service, setService] = useState<ServiceType>('trafego_pago');
  const [serviceNameCustom, setServiceNameCustom] = useState('');
  const [proposalStatus, setProposalStatus] = useState<ProposalStatus>('esperando_aprovacao');
  const [responsible, setResponsible] = useState('Você');
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialLead) {
      setName(initialLead.name);
      setCompany(initialLead.company || '');
      setEmail(initialLead.email || '');
      setPhone(initialLead.phone || '');
      setStatus(initialLead.status);
      setSource(initialLead.source);
      setService(initialLead.service || 'trafego_pago');
      setServiceNameCustom(initialLead.serviceNameCustom || '');
      setProposalStatus(initialLead.proposalStatus || 'esperando_aprovacao');
      setResponsible(initialLead.responsible || 'Você');
      setValue(initialLead.value ? initialLead.value.toString() : '');
      setNotes(initialLead.notes || '');
    } else {
      setName('');
      setCompany('');
      setEmail('');
      setPhone('');
      setStatus('novo');
      setSource('instagram');
      setService('trafego_pago');
      setServiceNameCustom('');
      setProposalStatus('esperando_aprovacao');
      setResponsible('Você');
      setValue('');
      setNotes('');
    }
    setError('');
  }, [initialLead, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, informe o nome do cliente / lead.');
      return;
    }

    const numericValue = value ? parseFloat(value.replace(/[^0-9.-]+/g, '')) : 0;

    onSave({
      id: initialLead ? initialLead.id : undefined,
      name: name.trim(),
      company: company.trim(),
      email: email.trim(),
      phone: phone.trim(),
      status,
      source,
      service,
      serviceNameCustom: service === 'outro' ? serviceNameCustom.trim() : undefined,
      proposalStatus,
      responsible: responsible.trim(),
      value: isNaN(numericValue) ? 0 : numericValue,
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        className="bg-[#0F172A] rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-blue-500/30 text-white transform transition-all animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {initialLead ? 'Editar Oportunidade' : 'Novo Lead / Oportunidade'}
              </h2>
              <p className="text-xs text-slate-400">DF DIGITAL CRM</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 p-3 bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Cliente e Empresa */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nome do Cliente / Contato *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Carlos Eduardo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Empresa / Negócio
              </label>
              <input
                type="text"
                placeholder="Ex: Prime Odontologia"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Qual é o Serviço e Valor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-blue-400 mb-1 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Qual é o Serviço em Questão? *</span>
              </label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value as ServiceType)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 cursor-pointer"
              >
                {(Object.keys(SERVICE_OPTIONS) as ServiceType[]).map((srv) => (
                  <option key={srv} value={srv} className="bg-slate-900 text-white">
                    {SERVICE_OPTIONS[srv]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-cyan-400 mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Valor do Serviço (R$) *</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                  R$
                </span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {service === 'outro' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nome do Serviço Personalizado
              </label>
              <input
                type="text"
                placeholder="Especifique o serviço"
                value={serviceNameCustom}
                onChange={(e) => setServiceNameCustom(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              />
            </div>
          )}

          {/* Situação em que se encontra & Responsável */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-amber-400 mb-1">
                Situação da Proposta / Lead *
              </label>
              <select
                value={proposalStatus}
                onChange={(e) => setProposalStatus(e.target.value as ProposalStatus)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 cursor-pointer"
              >
                {(Object.keys(PROPOSAL_STATUS_CONFIG) as ProposalStatus[]).map((st) => (
                  <option key={st} value={st} className="bg-slate-900 text-white">
                    {PROPOSAL_STATUS_CONFIG[st].label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Responsável na Agência</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Você / Sócio / Ambos"
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Etapa no Funil & Origem */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Etapa no Pipeline
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as LeadStatus)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 cursor-pointer"
              >
                {LEAD_COLUMNS.map((col) => (
                  <option key={col.id} value={col.id} className="bg-slate-900 text-white">
                    {col.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Canal de Origem
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as LeadSource)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 cursor-pointer"
              >
                {(Object.keys(SOURCE_LABELS) as LeadSource[]).map((src) => (
                  <option key={src} value={src} className="bg-slate-900 text-white">
                    {SOURCE_LABELS[src].label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Telefone e Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Telefone / WhatsApp
              </label>
              <input
                type="text"
                placeholder="(11) 99999-9999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                E-mail
              </label>
              <input
                type="email"
                placeholder="cliente@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Observações e Alinhamento
            </label>
            <textarea
              rows={3}
              placeholder="Detalhes da proposta, escopo do contrato, data de reunião, feedback do cliente..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 resize-none placeholder:text-slate-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold transition-all shadow-lg shadow-blue-500/25"
            >
              {initialLead ? 'Salvar Alterações' : 'Cadastrar Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
