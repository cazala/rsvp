-- Show all RSVP responses
SELECT 
    id,
    name,
    email,
    whatsapp,
    dietary_requirements,
    needs_transfer,
    created_at
FROM rsvp_responses
ORDER BY created_at DESC;
