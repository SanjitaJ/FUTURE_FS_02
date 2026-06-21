import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Pencil,
  Trash2,
  Eye,
  Users,
  UserPlus,
  X,
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { useLeads } from '../hooks/useLeads';
import type { Lead, LeadStatus } from '../types';
import { LEAD_STATUSES } from '../types';
import { formatDateShort } from '../lib/utils';
import { toast } from 'sonner';

export function Leads() {
  const { getLeads, deleteLead, loading } = useLeads();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | ''>('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const limit = 10;

  const loadLeads = useCallback(async () => {
    const result = await getLeads({
      search: search || undefined,
      status: statusFilter || undefined,
      sortBy,
      sortOrder,
      page,
      limit,
    });
    setLeads(result.data);
    setCount(result.count);
  }, [getLeads, search, statusFilter, sortBy, sortOrder, page]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const totalPages = Math.ceil(count / limit);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLead(id);
      toast.success('Lead deleted');
      setDeleteId(null);
      loadLeads();
    } catch {
      toast.error('Failed to delete lead');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Leads</h1>
          <p className="text-sm text-slate-400 mt-1">Manage and track all your leads</p>
        </div>
        <Link
          to="/leads/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#4F46E5] to-[#6366F1] hover:from-[#4338CA] hover:to-[#4F46E5] text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-lg shadow-[#4F46E5]/20"
        >
          <UserPlus className="w-4 h-4" />
          Add Lead
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#0F172A]/80 border border-slate-800/60 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 focus:border-[#4F46E5]/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value as LeadStatus); setPage(1); }}
              className="pl-10 pr-8 py-2.5 bg-[#0F172A]/80 border border-slate-800/60 rounded-xl text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 focus:border-[#4F46E5]/50 transition-all appearance-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          {(search || statusFilter) && (
            <button
              onClick={clearFilters}
              className="p-2.5 rounded-xl border border-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0F172A]/80 backdrop-blur-sm border border-slate-800/60 rounded-2xl shadow-lg overflow-hidden">
        {loading && leads.length === 0 ? (
          <div className="py-16">
            <LoadingSpinner size={32} />
          </div>
        ) : leads.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No leads found"
            description={search || statusFilter ? 'Try adjusting your search or filters.' : 'Get started by adding your first lead.'}
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
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800/60">
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Lead</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Source</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('status')}
                        className="flex items-center gap-1 hover:text-slate-200 transition-colors"
                      >
                        Status <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('created_at')}
                        className="flex items-center gap-1 hover:text-slate-200 transition-colors"
                      >
                        Date <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="text-right px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-800/20 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4F46E5]/20 to-[#10B981]/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-[#818CF8]">
                              {lead.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-slate-200">{lead.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-300">{lead.email}</div>
                        {lead.phone && <div className="text-xs text-slate-500">{lead.phone}</div>}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-300">{lead.source}</span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={lead.status} />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-500">{formatDateShort(lead.created_at)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/leads/${lead.id}`}
                            className="p-2 rounded-lg text-slate-400 hover:text-[#818CF8] hover:bg-[#4F46E5]/10 transition-all"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/leads/${lead.id}/edit`}
                            className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-all"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setDeleteId(lead.id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800/60">
                <p className="text-sm text-slate-500">
                  Showing {(page - 1) * limit + 1}-{Math.min(page * limit, count)} of {count}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-slate-400 px-2">
                    {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg border border-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0F172A] border border-slate-800/60 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-2">Delete Lead</h3>
            <p className="text-sm text-slate-400 mb-6">
              Are you sure you want to delete this lead? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 bg-red-500/15 text-red-400 hover:bg-red-500/25 text-sm font-medium rounded-xl border border-red-500/20 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
