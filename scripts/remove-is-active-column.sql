-- Remove is_active column from invitation_links table
-- This removes the enable/disable feature entirely

-- Drop any policies that reference is_active column
DROP POLICY IF EXISTS "Allow authenticated reads of active links" ON invitation_links;

-- Remove the is_active column
ALTER TABLE invitation_links DROP COLUMN IF EXISTS is_active;

-- The "Allow authenticated reads" policy was already created by enable-rls.sql
-- No need to recreate it

-- Verify the column has been removed
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'invitation_links' 
AND table_schema = 'public'
ORDER BY ordinal_position;