-- Add new columns to the rsvp_responses table
ALTER TABLE rsvp_responses 
ADD COLUMN is_minor BOOLEAN DEFAULT FALSE,
ADD COLUMN comment TEXT;

-- Update the existing records to have default values
UPDATE rsvp_responses 
SET is_minor = FALSE 
WHERE is_minor IS NULL;

UPDATE rsvp_responses 
SET comment = NULL 
WHERE comment IS NULL;
