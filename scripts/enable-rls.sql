-- Enable Row Level Security for both tables
-- This script fixes the security issues where RLS is disabled

-- Enable RLS on rsvp_responses table (re-enable existing policies)
ALTER TABLE rsvp_responses ENABLE ROW LEVEL SECURITY;

-- Enable RLS on invitation_links table and create policies
ALTER TABLE invitation_links ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for invitation_links (admin-only access)
-- Allow service role (admin) full access
CREATE POLICY "Allow service role full access" ON invitation_links
FOR ALL TO service_role
USING (true)
WITH CHECK (true);

-- Allow authenticated users to read active invitation links (for validation)
CREATE POLICY "Allow authenticated reads of active links" ON invitation_links
FOR SELECT TO authenticated
USING (is_active = true);

-- Verify RLS is now enabled on both tables
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('rsvp_responses', 'invitation_links')
ORDER BY tablename;

-- Show all policies to confirm they're in place
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('rsvp_responses', 'invitation_links')
ORDER BY tablename, policyname;