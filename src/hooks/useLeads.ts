import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Lead, LeadNote, LeadWithNotes } from '../types';

export function useLeads() {
  const [loading, setLoading] = useState(false);

  const getLeads = useCallback(async (options?: {
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) => {
    setLoading(true);
    try {
      let query = supabase.from('leads').select('*', { count: 'exact' });

      if (options?.search) {
        query = query.or(`name.ilike.%${options.search}%,email.ilike.%${options.search}%`);
      }
      if (options?.status) {
        query = query.eq('status', options.status);
      }

      const sortBy = options?.sortBy || 'created_at';
      const sortOrder = options?.sortOrder || 'desc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      const page = options?.page || 1;
      const limit = options?.limit || 10;
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;
      return { data: data as Lead[], count: count || 0 };
    } finally {
      setLoading(false);
    }
  }, []);

  const getLead = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*, lead_notes(*)')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as LeadWithNotes;
    } finally {
      setLoading(false);
    }
  }, []);

  const createLead = useCallback(async (lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('leads').insert([lead]).select().single();
      if (error) throw error;
      return data as Lead;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateLead = useCallback(async (id: string, updates: Partial<Lead>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Lead;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteLead = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.from('leads').delete().eq('id', id);
      if (error) throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const addNote = useCallback(async (leadId: string, content: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('lead_notes')
        .insert([{ lead_id: leadId, content }])
        .select()
        .single();
      if (error) throw error;
      return data as LeadNote;
    } finally {
      setLoading(false);
    }
  }, []);

  const getStats = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('leads').select('status');
      if (error) throw error;
      const leads = data as { status: string }[];
      const total = leads.length;
      const newLeads = leads.filter((l) => l.status === 'New').length;
      const contacted = leads.filter((l) => l.status === 'Contacted').length;
      const converted = leads.filter((l) => l.status === 'Converted').length;
      const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0;
      return { total, newLeads, contacted, converted, conversionRate };
    } finally {
      setLoading(false);
    }
  }, []);

  const getRecentLeads = useCallback(async (limit = 5) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data as Lead[];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    getLeads,
    getLead,
    createLead,
    updateLead,
    deleteLead,
    addNote,
    getStats,
    getRecentLeads,
  };
}
