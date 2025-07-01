-- Create the RSVP responses table
CREATE TABLE rsvp_responses (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  dietary_requirements TEXT,
  needs_transfer BOOLEAN DEFAULT FALSE
);
