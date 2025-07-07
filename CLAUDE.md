# Database Configuration

## Environment Variables

### Supabase (Default)
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Neon (Alternative)
```bash
DATABASE_PROVIDER=neon
DATABASE_URL=your_neon_connection_string
```

## Provider Selection

The application defaults to Supabase. To use Neon, set:
```bash
DATABASE_PROVIDER=neon
```

Both providers are production-ready and feature-complete.

## Neon Provider Features

The Neon provider includes:
- **Parameterized queries** - SQL injection protection
- **JOIN support** - Handles complex queries with related data
- **Row-Level Security** - Respects database-level RLS policies
- **WebSocket configuration** - Optimized for Node.js environments
- **Query logging** - Debug-friendly SQL execution logs
- **Supabase API compatibility** - Drop-in replacement

## Migration from Supabase to Neon

### Option 1: Bash Script (Recommended)
```bash
# Set your Neon database URL
export DATABASE_URL="postgresql://username:password@host:port/database"

# Run the bash setup script (requires psql)
npm run setup-db-bash

# Update your environment
export DATABASE_PROVIDER=neon
```

### Option 1b: Node.js Script (Alternative)
```bash
# Set your Neon database URL
export DATABASE_URL="postgresql://username:password@host:port/database"

# Run the Node.js setup script
npm run setup-db

# Update your environment
export DATABASE_PROVIDER=neon
```

### Option 2: Manual Setup
```bash
# 1. Run the schema script
psql "your_neon_connection_string" -f scripts/init-database.sql

# 2. Verify the setup
psql "your_neon_connection_string" -f scripts/verify-database.sql

# 3. Update environment variables
export DATABASE_PROVIDER=neon
export DATABASE_URL=your_neon_connection_string
```

### Option 3: Copy from Existing Database
If you have existing data in Supabase:
```bash
# Export from Supabase
pg_dump "supabase_connection_string" --data-only --table=invitation_links --table=rsvp_responses > data.sql

# Set up schema in Neon
npm run setup-db

# Import data to Neon
psql "neon_connection_string" -f data.sql
```

## Database Schema

The migration script creates:
- **Tables**: `invitation_links`, `rsvp_responses`
- **RLS Policies**: Public insert, authenticated read, service role full access
- **Roles**: `anon`, `authenticated`, `service_role`
- **Indexes**: Performance optimization on frequently queried columns
- **Foreign Keys**: Proper relational constraints

## Quick Migration

For the fastest setup with Neon:

```bash
# 1. Set your Neon database URL
export DATABASE_URL="postgresql://user:pass@host:port/db"

# 2. Run automated setup (bash version - most reliable)
npm run setup-db-bash

# 3. Switch to Neon provider
export DATABASE_PROVIDER=neon

# 4. Test your app
npm run dev
```

## Commands

- `npm run build` - Build the project
- `npm run lint` - Run linting checks
- `npm run setup-db-bash` - Initialize database (bash/psql - recommended)
- `npm run setup-db` - Initialize database (Node.js - alternative)
- `npm run dev` - Start development server

## Scripts

- `scripts/init-database.sql` - Complete schema and RLS setup
- `scripts/verify-database.sql` - Verification and troubleshooting
- `scripts/setup-database.js` - Automated Node.js setup
- `scripts/README.md` - Detailed migration guide