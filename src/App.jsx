import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import DashboardStats from './components/DashboardStats';
import AnalyticsCharts from './components/AnalyticsCharts';
import TicketFilters from './components/TicketFilters';
import TicketCard from './components/TicketCard';
import TicketTableView from './components/TicketTableView';
import TicketDetailModal from './components/TicketDetailModal';
import NewTicketModal from './components/NewTicketModal';
import SystemInfoModal from './components/SystemInfoModal';
import Toast from './components/Toast';
import {
  fetchTickets,
  fetchStats,
  createTicket,
  updateTicket,
  addReply,
  deleteTicket,
  resetDemoTickets,
} from './services/api';
import { Plus, RotateCcw, AlertCircle, Sparkles, Inbox, BarChart2 } from 'lucide-react';

export default function App() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState(null);

  // Filters & View state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [priority, setPriority] = useState('All');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modals state
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [isSystemInfoOpen, setIsSystemInfoOpen] = useState(false);

  // Toast state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Load tickets and dashboard metrics with local storage cache fallback
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [ticketsData, statsData] = await Promise.all([
        fetchTickets({ search, status, priority, category, sortBy }),
        fetchStats(),
      ]);
      setTickets(ticketsData);
      setStats(statsData);

      // Save backup snapshot to localStorage for offline / quick reload resilience
      try {
        localStorage.setItem('supportflow_backup_cache', JSON.stringify({ tickets: ticketsData, stats: statsData, ts: Date.now() }));
      } catch {
        // Ignore quota errors if storage full
      }
    } catch (err) {
      console.error('Error loading data:', err);
      // Attempt to load from localStorage cache if server is temporarily unreachable
      try {
        const cached = localStorage.getItem('supportflow_backup_cache');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed.tickets)) {
            setTickets(parsed.tickets);
            setStats(parsed.stats);
          }
        }
      } catch {
        // ignore
      }
      setError('Could not connect to SupportFlow backend. Please ensure the server is running on port 5000.');
    } finally {
      setIsLoading(false);
    }
  }, [search, status, priority, category, sortBy]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle resetting demo tickets
  const handleResetDemo = async () => {
    if (!window.confirm('Reset all tickets back to the original demonstration dataset? Any custom created tickets will be replaced.')) {
      return;
    }
    try {
      setIsResetting(true);
      await resetDemoTickets();
      showToast('Demo data reset to initial default state!', 'success');
      await loadData();
    } catch {
      showToast('Failed to reset demo data', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  // Handle creating ticket
  const handleCreateTicket = async (formData) => {
    const newTicket = await createTicket(formData);
    await loadData();
    // Select newly created ticket so user can view it immediately
    setSelectedTicket(newTicket);
  };

  // Handle updating ticket
  const handleUpdateTicket = async (id, updates) => {
    const updated = await updateTicket(id, updates);
    // Update local list
    setTickets((prev) => prev.map((t) => (t.id === id ? updated : t)));
    // Update selected ticket
    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket(updated);
    }
    // Refresh stats
    const updatedStats = await fetchStats();
    setStats(updatedStats);
    return updated;
  };

  // Handle adding reply
  const handleAddReply = async (id, replyData) => {
    const res = await addReply(id, replyData);
    if (res && res.updatedTicket) {
      setTickets((prev) => prev.map((t) => (t.id === id ? res.updatedTicket : t)));
      if (selectedTicket && selectedTicket.id === id) {
        setSelectedTicket(res.updatedTicket);
      }
    }
    const updatedStats = await fetchStats();
    setStats(updatedStats);
  };

  // Handle deleting ticket
  const handleDeleteTicket = async (id) => {
    try {
      await deleteTicket(id);
      showToast('Ticket deleted successfully', 'success');
      await loadData();
      if (selectedTicket && selectedTicket.id === id) {
        setSelectedTicket(null);
      }
    } catch {
      showToast('Failed to delete ticket', 'error');
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatus('All');
    setPriority('All');
    setCategory('All');
    setSortBy('createdAt');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navigation Bar */}
      <Navbar
        onOpenNewTicket={() => setIsNewTicketOpen(true)}
        onResetDemo={handleResetDemo}
        onOpenSystemInfo={() => setIsSystemInfoOpen(true)}
        isResetting={isResetting}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Error banner if backend disconnects */}
        {error && (
          <div className="mb-6 bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between text-rose-900 shadow-2xs">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold">{error}</p>
                <p className="text-xs text-rose-700">Ensure <code>node server/server.js</code> is running.</p>
              </div>
            </div>
            <button
              onClick={loadData}
              className="text-xs font-semibold px-3 py-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Dashboard Metrics Overview */}
        <DashboardStats
          stats={stats}
          selectedStatus={status}
          onSelectStatus={(st) => setStatus(st)}
        />

        {/* Live Charts & Analytics Section */}
        <AnalyticsCharts tickets={tickets} />

        {/* Search, Filter & Controls */}
        <TicketFilters
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          priority={priority}
          setPriority={setPriority}
          category={category}
          setCategory={setCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          viewMode={viewMode}
          setViewMode={setViewMode}
          totalResults={tickets.length}
          onResetFilters={handleResetFilters}
        />

        {/* Tickets View (Grid Cards or Data Table) */}
        {isLoading && tickets.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-2xs">
            <div className="inline-block animate-spin text-indigo-600 mb-3">
              <RotateCcw className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-700">Loading support tickets...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center shadow-2xs">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl mx-auto flex items-center justify-center mb-3">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No support tickets found</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 mb-5">
              No tickets matched your search query or active filter settings. Try adjusting criteria or clear your filters.
            </p>
            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Clear Filters
              </button>
              <button
                onClick={handleResetDemo}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-indigo-700 shadow-2xs transition-colors"
              >
                Restore Demo Data
              </button>
            </div>
          </div>
        ) : viewMode === 'table' ? (
          <TicketTableView
            tickets={tickets}
            onSelectTicket={(t) => setSelectedTicket(t)}
            onEditTicket={(t) => setSelectedTicket(t)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onSelectTicket={(t) => setSelectedTicket(t)}
              />
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-semibold text-slate-800">SupportFlow</span> — Customer Support Ticketing System
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSystemInfoOpen(true)}
              className="text-indigo-600 hover:underline font-medium"
            >
              Storage Limitations & Architecture
            </button>
            <span className="text-slate-300">|</span>
            <span>Local Atomic JSON Store</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onUpdateTicket={handleUpdateTicket}
          onAddReply={handleAddReply}
          onDeleteTicket={handleDeleteTicket}
          showToast={showToast}
        />
      )}

      {isNewTicketOpen && (
        <NewTicketModal
          onClose={() => setIsNewTicketOpen(false)}
          onCreateTicket={handleCreateTicket}
          showToast={showToast}
        />
      )}

      {isSystemInfoOpen && (
        <SystemInfoModal onClose={() => setIsSystemInfoOpen(false)} />
      )}

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
