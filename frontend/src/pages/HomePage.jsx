import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTickets } from '../services/api';
import PriorityBadge from '../components/PriorityBadge';
import StatusBadge from '../components/StatusBadge';

function HomePage() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTickets({
        search: search || undefined,
        status: statusFilter || undefined,
        sortBy,
      });
      setTickets(data);
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, sortBy]);

  useEffect(() => {
    const debounce = setTimeout(fetchTickets, 300);
    return () => clearTimeout(debounce);
  }, [fetchTickets]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Support Tickets
          </h1>
          <p className="text-slate-400 dark:text-slate-500 mt-1 text-sm">
            {loading ? 'Loading...' : `${tickets.length} ticket${tickets.length !== 1 ? 's' : ''} found`}
          </p>
        </div>
        <Link
          to="/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-xl shadow-sm hover:shadow-md hover:shadow-brand-500/15 transition-all duration-200 active:scale-[0.98]"
          id="create-ticket-btn"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Ticket
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/[0.06] rounded-2xl p-4 mb-6 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="search-input"
              type="text"
              placeholder="Search by ID, name, email, or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/40 transition-all duration-200"
            />
          </div>

          {/* Status Filter */}
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/40 transition-all duration-200 sm:w-40 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>

          {/* Sort */}
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/40 transition-all duration-200 sm:w-48 cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority_high">Priority: High → Low</option>
            <option value="priority_low">Priority: Low → High</option>
          </select>
        </div>
      </div>

      {/* Ticket Table */}
      <div className="bg-white dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-colors duration-300">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-7 h-7 border-2 border-brand-200 dark:border-brand-500/30 border-t-brand-600 dark:border-t-brand-400 rounded-full animate-spin" />
              <span className="text-slate-400 dark:text-slate-500 text-sm">Loading tickets...</span>
            </div>
          </div>
        ) : tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/[0.05] flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-1">No tickets found</h3>
            <p className="text-slate-400 dark:text-slate-500 text-sm mb-5">
              {search || statusFilter ? 'Try adjusting your filters' : 'Create your first support ticket to get started'}
            </p>
            {!search && !statusFilter && (
              <Link
                to="/create"
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-xl shadow-sm transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Create Ticket
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/[0.04]">
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Ticket ID</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Subject</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Priority</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-white/[0.03]">
                {tickets.map((ticket) => (
                  <tr
                    key={ticket.ticket_id}
                    className="hover:bg-slate-50/70 dark:hover:bg-white/[0.02] transition-colors duration-150 cursor-pointer"
                    id={`ticket-row-${ticket.ticket_id}`}
                    onClick={() => navigate(`/tickets/${ticket.ticket_id}`)}
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono font-medium text-brand-600 dark:text-brand-400">{ticket.ticket_id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{ticket.customer_name}</div>
                        <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{ticket.customer_email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600 dark:text-slate-300 line-clamp-1">{ticket.subject}</span>
                    </td>
                    <td className="px-6 py-4">
                      <PriorityBadge priority={ticket.priority} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-400 dark:text-slate-500">{formatDate(ticket.created_at)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
