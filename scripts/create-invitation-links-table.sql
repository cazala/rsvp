-- Create invitation_links table for managing invitation links
CREATE TABLE invitation_links (
  id TEXT PRIMARY KEY,              -- Non-incremental short ID (8-char random)
  label TEXT NOT NULL,              -- User-friendly label (e.g., "Familia García")
  created_at TIMESTAMP DEFAULT NOW(),
  created_by TEXT,                  -- Admin who created it
  is_active BOOLEAN DEFAULT true    -- Whether the link is active
);

-- Add link_id column to rsvp_responses table
ALTER TABLE rsvp_responses 
ADD COLUMN link_id TEXT REFERENCES invitation_links(id);

-- Add index for better performance
CREATE INDEX idx_rsvp_responses_link_id ON rsvp_responses(link_id);
CREATE INDEX idx_invitation_links_active ON invitation_links(is_active);

-- Add comments for documentation
COMMENT ON TABLE invitation_links IS 'Stores invitation links for RSVP access control';
COMMENT ON COLUMN invitation_links.id IS 'Non-guessable 8-character identifier for the invitation link';
COMMENT ON COLUMN invitation_links.label IS 'Human-readable label to identify the invitation (e.g., family name)';
COMMENT ON COLUMN rsvp_responses.link_id IS 'Reference to the invitation link used to submit this RSVP';