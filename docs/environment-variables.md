# Environment Variables

This document describes the environment variables used in the wedding invitation application.

## Required Variables

### Database (Supabase)
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (for admin operations)

### Authentication
- `ADMIN_PASSWORD` - Password for accessing the admin panel (default: "wedding2025")
- `ENCRYPTION_KEY` - Key for encrypting session data (default: auto-generated)

## Optional Variables

### Event Configuration
- `WEDDING_DATE` or `NEXT_PUBLIC_WEDDING_DATE` - The date and time of the wedding event in ISO format
  - Format: `YYYY-MM-DDTHH:MM:SS`
  - Example: `2025-11-08T16:00:00`
  - Default: `2025-11-08T16:00:00` (November 8, 2025 at 4:00 PM)

## Example .env.local file

\`\`\`env
# Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Authentication
ADMIN_PASSWORD=your-secure-password
ENCRYPTION_KEY=your-32-character-encryption-key

# Event Configuration
NEXT_PUBLIC_WEDDING_DATE=2025-11-08T16:00:00
\`\`\`

## Notes

- Use `NEXT_PUBLIC_` prefix for variables that need to be accessible on the client side
- The `WEDDING_DATE` can be set as either `WEDDING_DATE` (server-only) or `NEXT_PUBLIC_WEDDING_DATE` (client-accessible)
- If no wedding date is specified, it defaults to November 8, 2025 at 4:00 PM
- All dates should be in ISO format for consistency across timezones
\`\`\`

Finally, let's update the Footer component to use the configuration:
