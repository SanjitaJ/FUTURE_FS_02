/*
# Create leads and lead_notes tables for CRM

1. New Tables
- `leads`
  - `id` (uuid, primary key)
  - `name` (text, not null) — full name of the lead
  - `email` (text, not null) — email address
  - `phone` (text) — phone number
  - `source` (text, not null) — lead source (Website, Referral, Social Media, Google Ads, Facebook Ads, LinkedIn, Other)
  - `status` (text, not null, default 'New') — lead status (New, Contacted, Converted)
  - `notes` (text) — general notes on the lead
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())
- `lead_notes`
  - `id` (uuid, primary key)
  - `lead_id` (uuid, not null, references leads.id on delete cascade)
  - `content` (text, not null) — note content
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on both tables.
- Allow anon and authenticated users full CRUD access since this is a single-tenant admin dashboard app.
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  source text NOT NULL,
  status text NOT NULL DEFAULT 'New',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lead_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_notes ENABLE ROW LEVEL SECURITY;

-- Leads policies
DROP POLICY IF EXISTS "anon_select_leads" ON leads;
CREATE POLICY "anon_select_leads" ON leads FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_leads" ON leads;
CREATE POLICY "anon_insert_leads" ON leads FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_leads" ON leads;
CREATE POLICY "anon_update_leads" ON leads FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_leads" ON leads;
CREATE POLICY "anon_delete_leads" ON leads FOR DELETE
  TO anon, authenticated USING (true);

-- Lead notes policies
DROP POLICY IF EXISTS "anon_select_lead_notes" ON lead_notes;
CREATE POLICY "anon_select_lead_notes" ON lead_notes FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_lead_notes" ON lead_notes;
CREATE POLICY "anon_insert_lead_notes" ON lead_notes FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_lead_notes" ON lead_notes;
CREATE POLICY "anon_update_lead_notes" ON lead_notes FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_lead_notes" ON lead_notes;
CREATE POLICY "anon_delete_lead_notes" ON lead_notes FOR DELETE
  TO anon, authenticated USING (true);
