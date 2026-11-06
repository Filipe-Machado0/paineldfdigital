import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { MetricsCards } from './components/MetricsCards';
import { FilterBar, SortOption } from './components/FilterBar';
import { KanbanBoard } from './components/KanbanBoard';
import { TableView } from './components/TableView';
import { LeadModal } from './components/LeadModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { CloudSyncModal } from './components/CloudSyncModal';
import { Lead, LeadStatus, ProposalStatus } from './types';
import { 
  loadLocalLeads, 
  saveLocalLeads, 
  fetchRemoteLeads, 
  upsertRemoteLead, 
  deleteRemoteLead, 
  isCloudConnected,
  getSupabase 
} from './utils/supabase';
import { exportLeadsToCSV } from './utils/csvExport';

export const App: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>(() => loadLocalLeads());
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [hasCloud, setHasCloud] = useState<boolean>(() => isCloudConnected());

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [proposalStatusFilter, setProposalStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCloudSyncOpen, setIsCloudSyncOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);

  // Sync leads from Cloud or Local
  const refreshLeads = useCallback(async () => {
    const cloudActive = isCloudConnected();
    setHasCloud(cloudActive);
    if (cloudActive) {
      try {
        const remoteData = await fetchRemoteLeads();
        setLeads(remoteData);
        saveLocalLeads(remoteData);
      } catch (err) {
        console.error('Erro ao buscar dados remotos:', err);
      }
    }
  }, []);

  // Initial load & Supabase Realtime channel subscription
  useEffect(() => {
    refreshLeads();

    const supabase = getSupabase();
    if (!supabase) return;

    // Listen to real-time changes made by the partner
    const channel = supabase
      .channel('df-digital-leads-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leads' },
        () => {
          // Re-fetch when partner updates, inserts, or deletes a lead
          refreshLeads();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshLeads]);

  // Persist local leads whenever state changes
  useEffect(() => {
    saveLocalLeads(leads);
  }, [leads]);

  // Save Lead (Create or Edit)
  const handleSaveLead = async (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
    const now = new Date().toISOString();
    let updatedLead: Lead;

    if (leadData.id) {
      // Edit
      const existing = leads.find((l) => l.id === leadData.id);
      updatedLead = {
        ...leadData,
        id: leadData.id,
        createdAt: existing ? existing.createdAt : now,
        updatedAt: now,
      };

      setLeads((prev) => prev.map((l) => (l.id === leadData.id ? updatedLead : l)));
    } else {
      // Create
      updatedLead = {
        ...leadData,
        id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        createdAt: now,
        updatedAt: now,
      };

      setLeads((prev) => [updatedLead, ...prev]);
    }

    // Push to Supabase if connected
    if (isCloudConnected()) {
      await upsertRemoteLead(updatedLead);
    }
  };

  // Quick Status change (Pipeline Stage)
  const handleUpdateStatus = async (leadId: string, newStatus: LeadStatus) => {
    const targetLead = leads.find((l) => l.id === leadId);
    if (!targetLead) return;

    const updatedLead: Lead = {
      ...targetLead,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    setLeads((prev) => prev.map((l) => (l.id === leadId ? updatedLead : l)));

    if (isCloudConnected()) {
      await upsertRemoteLead(updatedLead);
    }
  };

  // Quick Proposal Status change (Situação: aprovado, esperando aprovação, etc.)
  const handleUpdateProposalStatus = async (leadId: string, newStatus: ProposalStatus) => {
    const targetLead = leads.find((l) => l.id === leadId);
    if (!targetLead) return;

    const updatedLead: Lead = {
      ...targetLead,
      proposalStatus: newStatus,
      // Se aprovado, move opcionalmente para 'ganho'
      status: newStatus === 'aprovado' ? 'ganho' : targetLead.status,
      updatedAt: new Date().toISOString(),
    };

    setLeads((prev) => prev.map((l) => (l.id === leadId ? updatedLead : l)));

    if (isCloudConnected()) {
      await upsertRemoteLead(updatedLead);
    }
  };

  // Delete lead
  const handleConfirmDelete = async () => {
    if (leadToDelete) {
      const id = leadToDelete.id;
      setLeads((prev) => prev.filter((l) => l.id !== id));
      setLeadToDelete(null);

      if (isCloudConnected()) {
        await deleteRemoteLead(id);
      }
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

        // Pipeline Status
        if (statusFilter !== 'all' && lead.status !== statusFilter) {
          return false;
        }

        // Service Filter
        if (serviceFilter !== 'all' && lead.service !== serviceFilter) {
          return false;
        }

        // Proposal Status (Situação)
        if (proposalStatusFilter !== 'all' && lead.proposalStatus !== proposalStatusFilter) {
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
  }, [leads, searchQuery, statusFilter, serviceFilter, proposalStatusFilter, sortBy]);

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
        onOpenCloudSync={() => setIsCloudSyncOpen(true)}
        isCloudConnected={hasCloud}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
          proposalStatusFilter={proposalStatusFilter}
          onProposalStatusChange={setProposalStatusFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalFiltered={filteredLeads.length}
          totalLeads={leads.length}
        />

        {/* View Mode: Kanban vs Table */}
        {viewMode === 'kanban' ? (
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
            onUpdateProposalStatus={handleUpdateProposalStatus}
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

      <CloudSyncModal
        isOpen={isCloudSyncOpen}
        onClose={() => setIsCloudSyncOpen(false)}
        onConfigSaved={refreshLeads}
      />
    </div>
  );
};

export default App;
