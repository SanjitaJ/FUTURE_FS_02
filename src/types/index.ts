export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  source: string;
  status: 'New' | 'Contacted' | 'Converted';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadNote {
  id: string;
  lead_id: string;
  content: string;
  created_at: string;
}

export interface LeadWithNotes extends Lead {
  lead_notes: LeadNote[];
}

export type LeadSource = 'Website' | 'Referral' | 'Social Media' | 'Google Ads' | 'Facebook Ads' | 'LinkedIn' | 'Other';
export type LeadStatus = 'New' | 'Contacted' | 'Converted';

export const LEAD_SOURCES: LeadSource[] = [
  'Website',
  'Referral',
  'Social Media',
  'Google Ads',
  'Facebook Ads',
  'LinkedIn',
  'Other',
];

export const LEAD_STATUSES: LeadStatus[] = ['New', 'Contacted', 'Converted'];
