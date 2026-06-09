import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTicket, updateTicket } from '../services/api';
import PriorityBadge from '../components/PriorityBadge';
import StatusBadge from '../components/StatusBadge';
import toast from 'react-hot-toast';

function TicketDetailPage() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingPriority, setUpdatingPriority] = useState(false);

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const data = await getTicket(ticketId);
      setTicket(data);
      setError(null);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Ticket not found');
      } else {
        setError('Failed to load ticket');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      setUpdatingStatus(true);
      const updated = await updateTicket(ticketId, { status: newStatus });
      setTicket(updated);
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handlePriorityChange = async (e) => {
    const newPriority = parseInt(e.target.value);
    try {
      setUpdatingPriority(true);
      const updated = await updateTicket(ticketId, { priority: newPriority });
      setTicket(updated);
      toast.success('Priority updated');
    } catch (err) {
      toast.error('Failed to update priority');
    } finally {
      setUpdatingPriority(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    try {
      setAddingNote(true);
      const updated = await updateTicket(ticketId, { note_text: noteText.trim() });
      setTicket(updated);
      setNoteText('');
      toast.success('Note added');
    } catch (err) {
      toast.error('Failed to add note');
    } finally {
      setAddingNote(false);
    }
  };

  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const selectClass = "w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/40 transition-all duration-200 cursor-pointer";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 border-2 border-brand-200 dark:border-brand-500/30 border-t-brand-600 dark:border-t-brand-400 rounded-full animate-spin" />
          <span className="text-slate-400 dark:text-slate-500 text-sm">Loading ticket...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center mb-4">
          <svg className="w-7 h-7 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-1">{error}</h3>
        <p className="text-slate-400 dark:text-slate-500 text-sm mb-5">The ticket ID "{ticketId}" could not be found.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-xl transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Tickets
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 dark:text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Tickets
      </Link>

      {/* Header Card */}
      <div className="bg-white dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/[0.06] rounded-2xl p-6 mb-6 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-3 flex-wrap">
              <span className="text-sm font-mono text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 px-2.5 py-1 rounded-lg font-medium">
                {ticket.ticket_id}
              </span>
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">{ticket.subject}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-slate-600 dark:text-slate-400">{ticket.customer_name}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-slate-600 dark:text-slate-400">{ticket.customer_email}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatDateTime(ticket.created_at)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/[0.06] rounded-2xl p-6 transition-colors duration-300">
            <h2 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Description</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
          </div>

          {/* Notes */}
          <div className="bg-white dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/[0.06] rounded-2xl p-6 transition-colors duration-300">
            <h2 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
              Notes ({ticket.notes?.length || 0})
            </h2>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="mb-6" id="add-note-form">
              <textarea
                id="note-input"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a note to this ticket..."
                rows={3}
                className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/40 transition-all duration-200 resize-none mb-3"
              />
              <button
                type="submit"
                disabled={addingNote || !noteText.trim()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl shadow-sm transition-all duration-200"
                id="add-note-btn"
              >
                {addingNote ? 'Adding...' : 'Add Note'}
              </button>
            </form>

            {/* Notes List */}
            {ticket.notes?.length > 0 ? (
              <div className="space-y-3">
                {ticket.notes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-slate-50 dark:bg-white/[0.03] rounded-xl p-4 border border-slate-100 dark:border-white/[0.04] animate-slide-up"
                  >
                    <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{note.note_text}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-600 mt-2">{formatDateTime(note.created_at)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 dark:text-slate-600 text-center py-4">No notes yet</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status */}
          <div className="bg-white dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/[0.06] rounded-2xl p-5 transition-colors duration-300">
            <h2 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Status</h2>
            <select
              id="status-dropdown"
              value={ticket.status}
              onChange={handleStatusChange}
              disabled={updatingStatus}
              className={selectClass}
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Priority */}
          <div className="bg-white dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/[0.06] rounded-2xl p-5 transition-colors duration-300">
            <h2 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Priority</h2>
            <select
              id="priority-dropdown"
              value={ticket.priority}
              onChange={handlePriorityChange}
              disabled={updatingPriority}
              className={selectClass}
            >
              <option value={1}>P1 — Very Low</option>
              <option value={2}>P2 — Low</option>
              <option value={3}>P3 — Medium</option>
              <option value={4}>P4 — High</option>
              <option value={5}>P5 — Critical</option>
            </select>
          </div>

          {/* Details */}
          <div className="bg-white dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/[0.06] rounded-2xl p-5 transition-colors duration-300">
            <h2 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Details</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-slate-400 dark:text-slate-500 text-xs">Created</dt>
                <dd className="text-slate-700 dark:text-slate-300 mt-0.5">{formatDateTime(ticket.created_at)}</dd>
              </div>
              <div>
                <dt className="text-slate-400 dark:text-slate-500 text-xs">Updated</dt>
                <dd className="text-slate-700 dark:text-slate-300 mt-0.5">{formatDateTime(ticket.updated_at)}</dd>
              </div>
              <div>
                <dt className="text-slate-400 dark:text-slate-500 text-xs">Ticket ID</dt>
                <dd className="text-slate-700 dark:text-slate-300 font-mono mt-0.5">{ticket.ticket_id}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketDetailPage;
