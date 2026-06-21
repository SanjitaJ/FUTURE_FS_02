import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  UserPlus,
} from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { useLeads } from '../hooks/useLeads';
import type { Lead } from '../types';
import { formatDateShort } from '../lib/utils';

export function Dashboard() {
  const { getStats, getRecentLeads, loading } = useLeads();
  const [stats, setStats] = useState({
    total: 0,
    newLeads: 0,
    contacted: 0,
    converted: 0,
    conversionRate: 0,
  });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const load = async () => {
      const [s, r] = await Promise.all([getStats(), getRecentLeads(5)]);
      setStats(s);
      setRecentLeads(r);
    };
    load();
  }, [getStats, getRecentLeads]);

  if (loading && stats.total === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Overview of your lead pipeline</p>
        </div>
        <Link
          to="/leads/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#4F46E5] to-[#6366F1] hover:from-[#4338CA] hover:to-[#4F46E5] text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-lg shadow-[#4F46E5]/20"
        >
          <UserPlus className="w-4 h-4" />
          Add Lead
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard
          title="Total Leads"
          value={stats.total}
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="New Leads"
          value={stats.newLeads}
          icon={Sparkles}
          color="sky"
        />
        <StatCard
          title="Contacted"
          value={stats.contacted}
          icon={PhoneCall}
          color="amber"
        />
        <StatCard
          title="Converted"
          value={stats.converted}
          icon={CheckCircle2}
          color="emerald"
        />
      </div>

      {/* Conversion Rate + Recent Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Conversion Rate Card */}
        <div className="lg:col-span-1">
          <div className="bg-[#0F172A]/80 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-6 shadow-lg h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-300">Conversion Rate</p>
                <p className="text-2xl font-bold text-white">{stats.conversionRate}%</p>
              </div>
            </div>
            <div className="w-full bg-slate-800/50 rounded-full h-2.5 mb-3">
              <div
                className="bg-gradient-to-r from-emerald-500 to-[#10B981] h-2.5 rounded-full transition-all duration-1000"
                style={{ width: `${stats.conversionRate}%` }}
              />
            </div>
            <p className="text-xs text-slate-500">
              {stats.converted} out of {stats.total} leads converted
            </p>
          </div>
        </div>

        {/* Recent Leads */}
        <div className="lg:col-span-2">
          <div className="bg-[#0F172A]/80 backdrop-blur-sm border border-slate-800/60 rounded-2xl shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60">
              <h2 className="text-sm font-semibold text-slate-200">Recent Leads</h2>
              <Link
                to="/leads"
                className="text-xs text-[#818CF8] hover:text-[#A5B4FC] flex items-center gap-1 transition-colors"
              >
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {recentLeads.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No leads yet"
                description="Start by adding your first lead to see it here."
                action={
                  <Link
                    to="/leads/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#4F46E5]/15 text-[#818CF8] text-sm font-medium rounded-xl border border-[#4F46E5]/20 hover:bg-[#4F46E5]/25 transition-all"
                  >
                    <UserPlus className="w-4 h-4" />
                    Add Lead
                  </Link>
                }
              />
            ) : (
              <div className="divide-y divide-slate-800/40">
                {recentLeads.map((lead) => (
                  <Link
                    key={lead.id}
                    to={`/leads/${lead.id}`}
                    className="flex items-center justify-between px-6 py-4 hover:bg-slate-800/30 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4F46E5]/20 to-[#10B981]/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-[#818CF8]">
                          {lead.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate">{lead.name}</p>
                        <p className="text-xs text-slate-500 truncate">{lead.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <StatusBadge status={lead.status} />
                      <span className="text-xs text-slate-500 hidden sm:block">
                        {formatDateShort(lead.created_at)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
