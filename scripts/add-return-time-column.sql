-- Add return_time column to rsvp_responses table
-- This stores 'Temprano' (early return at 00:00) or 'Tarde' (late return at 04:30)

ALTER TABLE rsvp_responses 
ADD COLUMN return_time TEXT;

-- Add a comment to document the column
COMMENT ON COLUMN rsvp_responses.return_time IS 'Return time preference for transfer service: Temprano (00:00) or Tarde (04:30)';