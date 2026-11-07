import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { MetricsCards } from './components/MetricsCards';
import { FilterBar, SortOption } from './components/FilterBar';
import { KanbanBoard } from './components/KanbanBoard';
import { TableView } from './components/TableView';
import { LeadModal } from './components/LeadModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { Lead, LeadStatus } from './types';
import { 
  fetchRemoteLeads, 
  upsertRemoteLead, 
  deleteRemoteLead, 
  getSupabase 
} from './utils/supabase';
import { exportLeadsToCSV } from './utils/csvExport';

export const App: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);

  // Sync leads from Supabase Cloud
  const refreshLeads = useCallback(async () => {
    try {
      const remoteData = await fetchRemoteLeads();
      setLeads(remoteData);
    } catch (err) {
      console.error('Erro ao buscar dados da nuvem:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load & Supabase Realtime channel subscription (Auto-sync between partners!)
  useEffect(() => {
    refreshLeads();

    const supabase = getSupabase();
    if (!supabase) return;

    // Listen to real-time changes
    const channel = supabase
      .channel('df-digital-realtime-leads')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leads' },
        () => {
          refreshLeads();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshLeads]);

  // Save Lead (Create or Edit)
  const handleSaveLead = async (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
    const now = new Date().toISOString();
    let targetLead: Lead;

    if (leadData.id) {
      // Edit
      const existing = leads.find((l) => l.id === leadData.id);
      targetLead = {
        ...leadData,
        id: leadData.id,
        createdAt: existing ? existing.createdAt : now,
        updatedAt: now,
      };

      setLeads((prev) => prev.map((l) => (l.id === leadData.id ? targetLead : l)));
    } else {
      // Create
      targetLead = {
        ...leadData,
        id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        createdAt: now,
        updatedAt: now,
      };

      setLeads((prev) => [targetLead, ...prev]);
    }

    await upsertRemoteLead(targetLead);
  };

  // Quick Status change (Proposta Enviada / Aprovado / Perdido)
  const handleUpdateStatus = async (leadId: string, newStatus: LeadStatus) => {
    const targetLead = leads.find((l) => l.id === leadId);
    if (!targetLead) return;

    const updatedLead: Lead = {
      ...targetLead,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    setLeads((prev) => prev.map((l) => (l.id === leadId ? updatedLead : l)));
    await upsertRemoteLead(updatedLead);
  };

  // Delete lead
  const handleConfirmDelete = async () => {
    if (leadToDelete) {
      const id = leadToDelete.id;
      setLeads((prev) => prev.filter((l) => l.id !== id));
      setLeadToDelete(null);
      await deleteRemoteLead(id);
    }
  };

  // Filtered & Sorted Leads
  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        // Search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchesName = lead.name.toLowerCase().includes(query);
          const matchesCompany = (lead.company || '').toLowerCase().includes(query);
          const matchesEmail = (lead.email || '').toLowerCase().includes(query);
          const matchesPhone = (lead.phone || '').includes(query);
          const matchesService = (lead.service || '').toLowerCase().includes(query);
          if (!matchesName && !matchesCompany && !matchesEmail && !matchesPhone && !matchesService) {
            return false;
          }
        }

        // Status Filter
        if (statusFilter !== 'all' && lead.status !== statusFilter) {
          return false;
        }

        // Service Filter
        if (serviceFilter !== 'all' && lead.service !== serviceFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === 'value_desc') {
          return (b.value || 0) - (a.value || 0);
        }
        if (sortBy === 'value_asc') {
          return (a.value || 0) - (b.value || 0);
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [leads, searchQuery, statusFilter, serviceFilter, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-[#070B14] text-slate-100 selection:bg-blue-500 selection:text-white">
      {/* Header DF DIGITAL */}
      <Header
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNewLead={() => {
          setEditingLead(null);
          setIsModalOpen(true);
        }}
        onExportCSV={() => exportLeadsToCSV(filteredLeads)}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* KPI Metrics Summary */}
        <MetricsCards leads={leads} />

        {/* Filter & Search Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          serviceFilter={serviceFilter}
          onServiceChange={setServiceFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalFiltered={filteredLeads.length}
          totalLeads={leads.length}
        />

        {/* View Mode: Kanban vs Table */}
        {isLoading ? (
          <div className="bg-[#0F172A]/90 rounded-2xl border border-slate-800 p-12 text-center shadow-xl">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-400">Carregando dados da DF DIGITAL...</p>
          </div>
        ) : viewMode === 'kanban' ? (
          <KanbanBoard
            leads={filteredLeads}
            onUpdateStatus={handleUpdateStatus}
            onEditLead={(lead) => {
              setEditingLead(lead);
              setIsModalOpen(true);
            }}
            onDeleteLead={(lead) => setLeadToDelete(lead)}
            onNewLead={() => {
              setEditingLead(null);
              setIsModalOpen(true);
            }}
          />
        ) : (
          <TableView
            leads={filteredLeads}
            onUpdateStatus={handleUpdateStatus}
            onEditLead={(lead) => {
              setEditingLead(lead);
              setIsModalOpen(true);
            }}
            onDeleteLead={(lead) => setLeadToDelete(lead)}
          />
        )}
      </main>

      {/* Modals */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingLead(null);
        }}
        onSave={handleSaveLead}
        initialLead={editingLead}
      />

      <DeleteConfirmModal
        isOpen={!!leadToDelete}
        lead={leadToDelete}
        onClose={() => setLeadToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default App;
