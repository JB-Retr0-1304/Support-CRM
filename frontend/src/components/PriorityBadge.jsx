/**
 * Priority Badge Component
 *
 * Minimalist priority indicators with clean pill design.
 *  P5 = Critical (red)
 *  P4 = High (orange)
 *  P3 = Medium (yellow)
 *  P2 = Low (blue)
 *  P1 = Very Low (gray)
 */

const priorityConfig = {
  5: { label: 'Critical', bg: 'bg-red-50 dark:bg-red-500/10', text: 'text-red-700 dark:text-red-400' },
  4: { label: 'High', bg: 'bg-orange-50 dark:bg-orange-500/10', text: 'text-orange-700 dark:text-orange-400' },
  3: { label: 'Medium', bg: 'bg-yellow-50 dark:bg-yellow-500/10', text: 'text-yellow-700 dark:text-yellow-500' },
  2: { label: 'Low', bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-700 dark:text-blue-400' },
  1: { label: 'Very Low', bg: 'bg-slate-100 dark:bg-slate-500/10', text: 'text-slate-600 dark:text-slate-400' },
};

function PriorityBadge({ priority }) {
  const config = priorityConfig[priority] || priorityConfig[3];

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <span className="font-semibold">P{priority}</span>
      <span className="opacity-75">{config.label}</span>
    </span>
  );
}

export default PriorityBadge;
