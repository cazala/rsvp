-- Database Verification Script
-- Run this after init-database.sql to verify everything is set up correctly

-- =============================================================================
-- BASIC STRUCTURE VERIFICATION
-- =============================================================================

\echo 'Checking database structure...'

-- Check if tables exist
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('invitation_links', 'rsvp_responses')
ORDER BY table_name;

-- Check table columns
\echo 'Checking table columns...'

SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name IN ('invitation_links', 'rsvp_responses')
ORDER BY table_name, ordinal_position;

-- =============================================================================
-- ROW LEVEL SECURITY VERIFICATION
-- =============================================================================

\echo 'Checking Row Level Security status...'

-- Check RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('invitation_links', 'rsvp_responses')
ORDER BY tablename;

-- List all RLS policies
\echo 'Checking RLS policies...'

SELECT 
  schemaname,
  tablename,
  policyname,
  roles,
  cmd as operation,
  permissive,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies 
WHERE tablename IN ('invitation_links', 'rsvp_responses')
ORDER BY tablename, policyname;

-- =============================================================================
-- ROLES AND PERMISSIONS VERIFICATION
-- =============================================================================

\echo 'Checking database roles...'

-- Check if required roles exist
SELECT 
  rolname,
  rolcanlogin,
  rolsuper
FROM pg_roles 
WHERE rolname IN ('anon', 'authenticated', 'service_role')
ORDER BY rolname;

-- Check table permissions
\echo 'Checking table permissions...'

SELECT 
  grantee,
  table_name,
  privilege_type
FROM information_schema.table_privileges 
WHERE table_schema = 'public' 
  AND table_name IN ('invitation_links', 'rsvp_responses')
  AND grantee IN ('anon', 'authenticated', 'service_role')
ORDER BY table_name, grantee, privilege_type;

-- =============================================================================
-- FOREIGN KEY CONSTRAINTS VERIFICATION
-- =============================================================================

\echo 'Checking foreign key constraints...'

SELECT 
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name IN ('invitation_links', 'rsvp_responses');

-- =============================================================================
-- INDEXES VERIFICATION
-- =============================================================================

\echo 'Checking indexes...'

SELECT 
  t.relname as table_name,
  i.relname as index_name,
  a.attname as column_name
FROM pg_class t,
     pg_class i,
     pg_index ix,
     pg_attribute a
WHERE t.oid = ix.indrelid
  AND i.oid = ix.indexrelid
  AND a.attrelid = t.oid
  AND a.attnum = ANY(ix.indkey)
  AND t.relkind = 'r'
  AND t.relname IN ('invitation_links', 'rsvp_responses')
ORDER BY t.relname, i.relname;

-- =============================================================================
-- DATA VERIFICATION
-- =============================================================================

\echo 'Checking existing data...'

-- Count records in each table
SELECT 
  'invitation_links' as table_name,
  COUNT(*) as record_count
FROM invitation_links
UNION ALL
SELECT 
  'rsvp_responses' as table_name,
  COUNT(*) as record_count
FROM rsvp_responses;

-- Sample data from each table (first 3 records)
\echo 'Sample invitation_links data:'
SELECT id, label, created_at, created_by 
FROM invitation_links 
ORDER BY created_at DESC 
LIMIT 3;

\echo 'Sample rsvp_responses data:'
SELECT id, name, email, needs_transfer, is_minor, link_id, created_at 
FROM rsvp_responses 
ORDER BY created_at DESC 
LIMIT 3;

-- =============================================================================
-- CONNECTION TEST QUERIES
-- =============================================================================

\echo 'Testing typical application queries...'

-- Test JOIN query (like admin page)
\echo 'Testing JOIN query...'
SELECT 
  r.*,
  il.label as invitation_label
FROM rsvp_responses r
LEFT JOIN invitation_links il ON r.link_id = il.id
LIMIT 1;

-- Test aggregation query (like invitation links with count)
\echo 'Testing aggregation query...'
SELECT 
  il.*,
  COUNT(r.id) as rsvp_count
FROM invitation_links il
LEFT JOIN rsvp_responses r ON il.id = r.link_id
GROUP BY il.id, il.label, il.created_at, il.created_by
LIMIT 1;

-- =============================================================================
-- PERMISSION TESTS (if you want to test with different roles)
-- =============================================================================

\echo 'Database verification complete!'
\echo ''
\echo 'Summary:'
\echo '- Check that all tables have rls_enabled = true'
\echo '- Verify that required policies exist for each table'
\echo '- Confirm that anon, authenticated, and service_role exist'
\echo '- Ensure foreign key constraints are in place'
\echo '- Review that indexes are created for performance'
\echo ''
\echo 'If everything looks good, your database is ready for the application!'

-- =============================================================================
-- TROUBLESHOOTING QUERIES
-- =============================================================================

/*
If you encounter issues, try these queries:

1. Check current user and role:
   SELECT current_user, current_role;

2. Test RLS policies manually:
   SET ROLE anon;
   SELECT * FROM invitation_links; -- Should work
   INSERT INTO rsvp_responses (name) VALUES ('Test'); -- Should work
   SET ROLE authenticated;
   SELECT * FROM rsvp_responses; -- Should work
   RESET ROLE;

3. Check if extensions are installed:
   SELECT * FROM pg_extension WHERE extname = 'uuid-ossp';

4. View detailed policy information:
   \d+ invitation_links
   \d+ rsvp_responses

5. Check for any errors in the log:
   SELECT * FROM pg_stat_activity WHERE state = 'active';
*/