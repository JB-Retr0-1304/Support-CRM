/**
 * Status Badge Component
 *
 * Clean, minimalist status indicators with subtle dot animation.
 */

const statusConfig = {
  'Open': {
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    text: 'text-emerald-700 dark:text-emerald-400',
    dot: 'bg-emerald-500',
    pulse: true,
  },
  'In Progress': {
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    text: 'text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-500',
    pulse: true,
  },
  'Closed': {
    bg: 'bg-slate-100 dark:bg-slate-500/10',
    text: 'text-slate-500 dark:text-slate-400',
    dot: 'bg-slate-400',
    pulse: false,
  },
};

function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig['Open'];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${config.pulse ? 'pulse-dot' : ''}`} />
      {status}
    </span>
  );
}

export default StatusBadge;
