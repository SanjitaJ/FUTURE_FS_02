import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useLeads } from '../hooks/useLeads';
import { LEAD_SOURCES, LEAD_STATUSES } from '../types';
import type { Lead } from '../types';
import { toast } from 'sonner';

export function LeadForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { getLead, createLead, updateLead, loading } = useLeads();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    source: 'Website',
    status: 'New' as const,
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      getLead(id).then((lead) => {
        setForm({
          name: lead.name,
          email: lead.email,
          phone: lead.phone || '',
          source: lead.source,
          status: lead.status,
          notes: lead.notes || '',
        });
      }).catch(() => {
        toast.error('Failed to load lead');
        navigate('/leads');
      });
    }
  }, [id, getLead, navigate]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Name and email are required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error('Please enter a valid email');
      return;
    }

    setSubmitting(true);
    try {
      if (isEdit && id) {
        await updateLead(id, form);
        toast.success('Lead updated');
        navigate(`/leads/${id}`);
      } else {
        const lead = await createLead(form);
        toast.success('Lead created');
        navigate(`/leads/${lead.id}`);
      }
    } catch {
      toast.error(isEdit ? 'Failed to update lead' : 'Failed to create lead');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl border border-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {isEdit ? 'Edit Lead' : 'Add Lead'}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {isEdit ? 'Update lead information' : 'Create a new lead'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-[#0F172A]/80 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-6 lg:p-8 shadow-lg space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Name */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 focus:border-[#4F46E5]/50 transition-all"
              placeholder="John Doe"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 focus:border-[#4F46E5]/50 transition-all"
              placeholder="john@example.com"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 focus:border-[#4F46E5]/50 transition-all"
              placeholder="+1 555-123-4567"
            />
          </div>

          {/* Source */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Lead Source</label>
            <select
              value={form.source}
              onChange={(e) => handleChange('source', e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 focus:border-[#4F46E5]/50 transition-all appearance-none cursor-pointer"
            >
              {LEAD_SOURCES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Status</label>
            <select
              value={form.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 focus:border-[#4F46E5]/50 transition-all appearance-none cursor-pointer"
            >
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 focus:border-[#4F46E5]/50 transition-all resize-none"
              placeholder="Additional information about this lead..."
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#4F46E5] to-[#6366F1] hover:from-[#4338CA] hover:to-[#4F46E5] text-white text-sm font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#4F46E5]/20"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isEdit ? 'Update Lead' : 'Create Lead'}
          </button>
        </div>
      </form>
    </div>
  );
}
