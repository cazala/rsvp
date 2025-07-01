-- Make email and whatsapp optional when user is a minor
ALTER TABLE rsvp_responses 
ALTER COLUMN email DROP NOT NULL;

-- Add a comment to document the change
COMMENT ON COLUMN rsvp_responses.email IS 'Optional for minors, required for adults';
COMMENT ON COLUMN rsvp_responses.whatsapp IS 'Optional field';
