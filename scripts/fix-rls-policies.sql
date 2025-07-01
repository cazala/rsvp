-- Drop existing policies
DROP POLICY IF EXISTS "Allow public inserts" ON rsvp_responses;
DROP POLICY IF EXISTS "Allow authenticated reads" ON rsvp_responses;

-- Create a policy that allows anyone to insert RSVPs
CREATE POLICY "Enable insert for all users" ON rsvp_responses
FOR INSERT 
WITH CHECK (true);

-- Create a policy that allows anyone to read RSVPs (for admin page)
CREATE POLICY "Enable read for all users" ON rsvp_responses
FOR SELECT 
USING (true);
