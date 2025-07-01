-- Completely disable Row Level Security for the table
ALTER TABLE rsvp_responses DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'rsvp_responses';
