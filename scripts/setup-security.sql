-- Enable Row Level Security
ALTER TABLE rsvp_responses ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (for RSVP form)
CREATE POLICY "Allow public inserts" ON rsvp_responses
FOR INSERT TO anon
WITH CHECK (true);

-- Allow authenticated reads (for admin panel)
CREATE POLICY "Allow authenticated reads" ON rsvp_responses
FOR SELECT TO authenticated
USING (true);
