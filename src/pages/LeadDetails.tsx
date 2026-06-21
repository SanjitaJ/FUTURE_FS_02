import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Mail,
  Phone,
  Globe,
  Calendar,
  Clock,
  Send,
  MessageSquare,
  Loader2,
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useLeads } from '../hooks/useLeads';
import type { LeadWithNotes, LeadNote } from '../types';
import { formatDate } from '../lib/utils';
import { toast } from 'sonner';

export function LeadDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getLead, deleteLead, addNote, loading } = useLeads();
  const [lead, setLead] = useState<LeadWithNotes | null>(null);
  const [noteText, setNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (id) {
      getLead(id).then(setLead).catch(() => {
        toast.error('Failed to load lead');
        navigate('/leads');
      });
    }
  }, [id, getLead, navigate]);

  const handleAddNote = async () => {
    if (!noteText.trim() || !id) return;
    setAddingNote(true);
    try {
      const note = await addNote(id, noteText.trim());
      setLead((prev) =>
        prev
          ? {
              ...prev,
              lead_notes: [...(prev.lead_notes || []), note],
            }
          : prev
      );
      setNoteText('');
      toast.success('Note added');
    } catch {
      toast.error('Failed to add note');
    } finally {
      setAddingNote(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteLead(id);
      toast.success('Lead deleted');
      navigate('/leads');
    } catch {
      toast.error('Failed to delete lead');
    }
  };

  if (loading && !lead) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  if (!lead) return null;

  const notes = (lead.lead_notes || []).sort(
    (a: LeadNote, b: LeadNote) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl border border-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{lead.name}</h1>
            <p className="text-sm text-slate-400 mt-0.5">Lead Details</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/leads/${lead.id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#4F46E5]/15 text-[#818CF8] text-sm font-medium rounded-xl border border-[#4F46E5]/20 hover:bg-[#4F46E5]/25 transition-all"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </Link>
          <button
            onClick={() => setShowDelete(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-500/15 text-red-400 text-sm font-medium rounded-xl border border-red-500/20 hover:bg-red-500/25 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#0F172A]/80 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4F46E5]/20 to-[#10B981]/20 flex items-center justify-center">
                <span className="text-xl font-bold text-[#818CF8]">
                  {lead.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">{lead.name}</h2>
                <StatusBadge status={lead.status} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="text-sm text-slate-200">{lead.email}</p>
                </div>
              </div>

              {lead.phone && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Phone</p>
                    <p className="text-sm text-slate-200">{lead.phone}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Source</p>
                  <p className="text-sm text-slate-200">{lead.source}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Created</p>
                  <p className="text-sm text-slate-200">{formatDate(lead.created_at)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Last Updated</p>
                  <p className="text-sm text-slate-200">{formatDate(lead.updated_at)}</p>
                </div>
              </div>
            </div>
          </div>

          {lead.notes && (
            <div className="bg-[#0F172A]/80 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-6 shadow-lg">
              <h3 className="text-sm font-semibold text-slate-200 mb-3">General Notes</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{lead.notes}</p>
            </div>
          )}
        </div>

        {/* Notes Timeline */}
        <div className="lg:col-span-2">
          <div className="bg-[#0F172A]/80 backdrop-blur-sm border border-slate-800/60 rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800/60">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#818CF8]" />
                <h2 className="text-sm font-semibold text-slate-200">Notes & Follow-ups</h2>
                <span className="ml-auto text-xs text-slate-500">{notes.length} notes</span>
              </div>
            </div>

            {/* Add note */}
            <div className="px-6 py-4 border-b border-slate-800/60">
              <div className="flex gap-3">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add a note or follow-up..."
                  rows={2}
                  className="flex-1 px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 focus:border-[#4F46E5]/50 transition-all resize-none"
                />
                <button
                  onClick={handleAddNote}
                  disabled={!noteText.trim() || addingNote}
                  className="self-end p-2.5 bg-gradient-to-r from-[#4F46E5] to-[#6366F1] hover:from-[#4338CA] hover:to-[#4F46E5] text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[#4F46E5]/20"
                >
                  {addingNote ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Notes list */}
            <div className="divide-y divide-slate-800/40">
              {notes.length === 0 ? (
                <div className="px-6 py-10 text-center">
                  <MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">No notes yet. Add your first note above.</p>
                </div>
              ) : (
                notes.map((note) => (
                  <div key={note.id} className="px-6 py-4 hover:bg-slate-800/20 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4F46E5]/20 to-[#10B981]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MessageSquare className="w-3.5 h-3.5 text-[#818CF8]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-200 leading-relaxed">{note.content}</p>
                        <p className="text-xs text-slate-500 mt-1.5">{formatDate(note.created_at)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0F172A] border border-slate-800/60 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-2">Delete Lead</h3>
            <p className="text-sm text-slate-400 mb-6">
              Are you sure you want to delete <span className="text-slate-200 font-medium">{lead.name}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDelete(false)}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
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
