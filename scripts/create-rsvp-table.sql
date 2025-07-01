-- Create the RSVP responses table
CREATE TABLE IF NOT EXISTS rsvp_responses (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  dietary_requirements TEXT,
  needs_transfer BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_rsvp_email ON rsvp_responses(email);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_rsvp_created_at ON rsvp_responses(created_at);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE rsvp_responses ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public inserts (for the RSVP form)
CREATE POLICY IF NOT EXISTS "Allow public inserts" ON rsvp_responses
FOR INSERT TO anon
WITH CHECK (true);

-- Create a policy to allow authenticated reads (for the admin panel)
CREATE POLICY IF NOT EXISTS "Allow authenticated reads" ON rsvp_responses
FOR SELECT TO authenticated
USING (true);
