-- Migration Script: Remove Email Column from RSVP Responses
-- This script removes the email column from the rsvp_responses table
-- Safe to run - includes checks to prevent errors if column doesn't exist

-- =============================================================================
-- DROP EMAIL COLUMN
-- =============================================================================

-- Check if email column exists before attempting to drop it
DO $$
BEGIN
    -- Check if the email column exists in rsvp_responses table
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'rsvp_responses' 
        AND column_name = 'email'
        AND table_schema = 'public'
    ) THEN
        -- Drop the email column
        ALTER TABLE rsvp_responses DROP COLUMN email;
        RAISE NOTICE 'Email column successfully removed from rsvp_responses table';
    ELSE
        RAISE NOTICE 'Email column does not exist in rsvp_responses table - no action needed';
    END IF;
END
$$;

-- =============================================================================
-- VERIFICATION
-- =============================================================================

-- Verify the column has been removed
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'rsvp_responses'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- =============================================================================
-- USAGE INSTRUCTIONS
-- =============================================================================

/*
To run this migration:

1. For Neon:
   psql "your_neon_connection_string" -f scripts/remove-email-column.sql

2. For local PostgreSQL:
   psql -U username -d database_name -f scripts/remove-email-column.sql

3. For other cloud providers:
   - Use their SQL console
   - Copy and paste the script content

This script is safe to run multiple times.
*/

COMMIT;