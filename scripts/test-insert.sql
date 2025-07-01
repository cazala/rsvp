-- Test inserting a sample RSVP (you can delete this later)
INSERT INTO rsvp_responses (name, email, whatsapp, dietary_requirements, needs_transfer)
VALUES ('Test User', 'test@example.com', '+54911234567', 'Sin restricciones', false);

-- Show the inserted record
SELECT * FROM rsvp_responses WHERE email = 'test@example.com';
