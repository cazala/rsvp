-- Create indexes for better performance
CREATE INDEX idx_rsvp_email ON rsvp_responses(email);
CREATE INDEX idx_rsvp_created_at ON rsvp_responses(created_at);
