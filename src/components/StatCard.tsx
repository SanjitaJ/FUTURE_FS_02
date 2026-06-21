import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  color: 'indigo' | 'emerald' | 'amber' | 'sky';
}

const colorMap = {
  indigo: {
    bg: 'bg-[#4F46E5]/10',
    border: 'border-[#4F46E5]/20',
    icon: 'text-[#818CF8]',
    glow: 'shadow-[#4F46E5]/5',
  },
  emerald: {
    bg: 'bg-[#10B981]/10',
    border: 'border-[#10B981]/20',
    icon: 'text-[#34D399]',
    glow: 'shadow-[#10B981]/5',
  },
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    icon: 'text-amber-400',
    glow: 'shadow-amber-500/5',
  },
  sky: {
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
    icon: 'text-sky-400',
    glow: 'shadow-sky-500/5',
  },
};

export function StatCard({ title, value, icon: Icon, trend, color }: StatCardProps) {
  const colors = colorMap[color];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${colors.border} bg-[#0F172A]/80 backdrop-blur-sm p-6 shadow-lg ${colors.glow} hover:shadow-xl transition-all duration-300 group`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
          {trend && (
            <p className="text-xs text-emerald-400 mt-2 font-medium">{trend}</p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>
      </div>
      <div
        className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full ${colors.bg} opacity-30 blur-2xl`}
      />
    </div>
  );
}
