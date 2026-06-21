import { LeadStatus } from '../types';

interface StatusBadgeProps {
  status: LeadStatus;
}

const statusStyles: Record<LeadStatus, string> = {
  New: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  Contacted: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Converted: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status === 'New' ? 'bg-sky-400' : status === 'Contacted' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
      {status}
    </span>
  );
}
