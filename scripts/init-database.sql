-- Database Schema and RLS Setup Script
-- This script recreates the complete database structure from Supabase
-- Compatible with Neon, PostgreSQL, and other providers

-- =============================================================================
-- EXTENSIONS
-- =============================================================================

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- TABLES
-- =============================================================================

-- Invitation Links Table
-- Stores unique invitation links for different groups/families
CREATE TABLE IF NOT EXISTS invitation_links (
  id text PRIMARY KEY,
  label text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  created_by text DEFAULT 'admin'
);

-- RSVP Responses Table  
-- Stores all wedding RSVP confirmations
CREATE TABLE IF NOT EXISTS rsvp_responses (
  id bigserial PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  name text NOT NULL,
  whatsapp text,
  dietary_requirements text,
  needs_transfer boolean DEFAULT false NOT NULL,
  return_time text,
  link_id text REFERENCES invitation_links(id),
  is_minor boolean DEFAULT false NOT NULL,
  comment text
);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on both tables
ALTER TABLE invitation_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvp_responses ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- RLS POLICIES
-- =============================================================================

-- Drop existing policies if they exist (for re-running the script)
DROP POLICY IF EXISTS "Allow service role full access to invitation_links" ON invitation_links;
DROP POLICY IF EXISTS "Allow authenticated read access to invitation_links" ON invitation_links;
DROP POLICY IF EXISTS "Allow service role full access to rsvp_responses" ON rsvp_responses;
DROP POLICY IF EXISTS "Allow public insert to rsvp_responses" ON rsvp_responses;
DROP POLICY IF EXISTS "Allow authenticated read access to rsvp_responses" ON rsvp_responses;

-- Invitation Links Policies
-- Allow service role (admin) full access to invitation links
CREATE POLICY "Allow service role full access to invitation_links" 
ON invitation_links FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Allow authenticated users to read invitation links  
CREATE POLICY "Allow authenticated read access to invitation_links" 
ON invitation_links FOR SELECT 
TO authenticated 
USING (true);

-- RSVP Responses Policies
-- Allow service role (admin) full access to RSVP responses
CREATE POLICY "Allow service role full access to rsvp_responses" 
ON rsvp_responses FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Allow public (anon) to insert RSVP responses
CREATE POLICY "Allow public insert to rsvp_responses" 
ON rsvp_responses FOR INSERT 
TO anon 
WITH CHECK (true);

-- Allow authenticated users to read RSVP responses
CREATE POLICY "Allow authenticated read access to rsvp_responses" 
ON rsvp_responses FOR SELECT 
TO authenticated 
USING (true);

-- =============================================================================
-- ROLES (for non-Supabase providers)
-- =============================================================================

-- Note: Supabase automatically creates these roles
-- For other providers, you may need to create them manually:

-- Create anon role if it doesn't exist (for public access)
DO $$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'anon') THEN
      CREATE ROLE anon;
   END IF;
END
$$;

-- Create authenticated role if it doesn't exist (for authenticated users)
DO $$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'authenticated') THEN
      CREATE ROLE authenticated;
   END IF;
END
$$;

-- Create service_role if it doesn't exist (for admin operations)
DO $$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'service_role') THEN
      CREATE ROLE service_role;
   END IF;
END
$$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT SELECT, INSERT ON rsvp_responses TO anon;
GRANT SELECT ON invitation_links TO authenticated;
GRANT SELECT ON rsvp_responses TO authenticated;

-- =============================================================================
-- INDEXES (for performance)
-- =============================================================================

-- Index on link_id for faster JOINs
CREATE INDEX IF NOT EXISTS rsvp_responses_link_id_idx ON rsvp_responses(link_id);

-- Index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS rsvp_responses_created_at_idx ON rsvp_responses(created_at);
CREATE INDEX IF NOT EXISTS invitation_links_created_at_idx ON invitation_links(created_at);

-- =============================================================================
-- SAMPLE DATA (optional - remove if not needed)
-- =============================================================================

-- Insert sample invitation link (uncomment if needed for testing)
-- INSERT INTO invitation_links (id, label) 
-- VALUES ('test123', 'Test Family') 
-- ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================

-- Uncomment these to verify the setup:

-- Check that RLS is enabled
-- SELECT schemaname, tablename, rowsecurity 
-- FROM pg_tables 
-- WHERE tablename IN ('invitation_links', 'rsvp_responses');

-- List all policies
-- SELECT schemaname, tablename, policyname, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE tablename IN ('invitation_links', 'rsvp_responses');

-- Count existing data
-- SELECT 
--   (SELECT COUNT(*) FROM invitation_links) as invitation_links_count,
--   (SELECT COUNT(*) FROM rsvp_responses) as rsvp_responses_count;

COMMIT;

-- =============================================================================
-- USAGE INSTRUCTIONS
-- =============================================================================

/*
To run this script:

1. For Neon:
   - Connect to your Neon database
   - Run: psql "your_neon_connection_string" -f init-database.sql

2. For local PostgreSQL:
   - Run: psql -U username -d database_name -f init-database.sql

3. For other cloud providers:
   - Use their SQL console or connection method
   - Copy and paste the script content

Environment Variables needed after setup:
- DATABASE_PROVIDER=neon (or other provider)
- DATABASE_URL=your_connection_string

Note: This script is idempotent - safe to run multiple times.
*/