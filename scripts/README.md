# Database Migration Scripts

This directory contains scripts to migrate your database schema from Supabase to Neon or any other PostgreSQL provider.

## 📁 Files

### `init-database.sql`
**Main schema and RLS setup script**
- Creates all tables with proper structure
- Sets up Row Level Security (RLS) policies
- Creates necessary roles and permissions
- Adds performance indexes
- Idempotent - safe to run multiple times

### `verify-database.sql` 
**Verification and debugging script**
- Checks table structure and RLS status
- Verifies policies and permissions
- Tests common queries
- Provides troubleshooting information

### `setup-database.js`
**Automated Node.js setup script**
- Programmatically runs the SQL migration
- Works with both Neon and PostgreSQL drivers
- Provides detailed progress feedback
- Includes error handling and verification

## 🚀 Quick Start

### For Neon Database

1. **Get your Neon connection string**
   ```bash
   # From your Neon dashboard, copy the connection string
   export DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/database"
   ```

2. **Run automated setup**
   ```bash
   # Recommended: Bash script (most reliable)
   npm run setup-db-bash
   
   # Alternative: Node.js script
   npm run setup-db
   ```

3. **Update your environment**
   ```bash
   export DATABASE_PROVIDER=neon
   ```

4. **Test your application**
   ```bash
   npm run dev
   ```

### For Other PostgreSQL Providers

1. **Set your connection string**
   ```bash
   export DATABASE_URL="postgresql://username:password@host:port/database"
   ```

2. **Run the setup**
   ```bash
   npm run setup-db
   ```

3. **Update environment**
   ```bash
   export DATABASE_PROVIDER=neon  # or your provider name
   ```

## 🔧 Manual Setup (Alternative)

If you prefer to run SQL scripts manually:

```bash
# 1. Initialize schema
psql "$DATABASE_URL" -f scripts/init-database.sql

# 2. Verify setup
psql "$DATABASE_URL" -f scripts/verify-database.sql
```

## 📊 Database Schema

The migration creates this structure:

```sql
-- Invitation Links (for organizing RSVPs by family/group)
invitation_links
├── id (text, primary key)
├── label (text, not null)
├── created_at (timestamp with time zone)
└── created_by (text)

-- RSVP Responses (wedding confirmations)
rsvp_responses
├── id (bigserial, primary key)
├── created_at (timestamp with time zone)
├── name (text, not null)
├── email (text, nullable)
├── whatsapp (text, nullable)
├── dietary_requirements (text, nullable)
├── needs_transfer (boolean, default false)
├── return_time (text, nullable)
├── link_id (text, foreign key → invitation_links.id)
├── is_minor (boolean, default false)
└── comment (text, nullable)
```

## 🔒 Security (RLS Policies)

### `invitation_links`
- **Service Role**: Full access (admin operations)
- **Authenticated**: Read access (logged-in users)
- **Anonymous**: No access

### `rsvp_responses`
- **Service Role**: Full access (admin operations)
- **Authenticated**: Read access (view RSVPs)
- **Anonymous**: Insert only (public RSVP submissions)

## 🎯 Supported Providers

✅ **Neon** - Serverless PostgreSQL  
✅ **Supabase** - Already working  
✅ **Railway** - PostgreSQL hosting  
✅ **PlanetScale** - With PostgreSQL compatibility  
✅ **AWS RDS** - PostgreSQL instances  
✅ **Google Cloud SQL** - PostgreSQL  
✅ **Azure Database** - PostgreSQL  
✅ **Local PostgreSQL** - Development setup  

## 🐛 Troubleshooting

### Common Issues

**1. Neon Driver Template Literal Error**
```
Error: This function can now be called only as a tagged-template function
```
**Solution:** Use the bash script instead:
```bash
npm run setup-db-bash
```

**2. Connection Failed**
```bash
# Check your connection string format
echo $DATABASE_URL
# Should be: postgresql://user:pass@host:port/db
```

**3. Permission Denied**
```bash
# Ensure your user has CREATE privileges
psql "$DATABASE_URL" -c "SELECT current_user, session_user;"
```

**4. Tables Already Exist**
```bash
# The scripts are idempotent, but you can drop and recreate:
psql "$DATABASE_URL" -c "DROP TABLE IF EXISTS rsvp_responses CASCADE;"
psql "$DATABASE_URL" -c "DROP TABLE IF EXISTS invitation_links CASCADE;"
# Then re-run the setup
```

**5. RLS Not Working**
```bash
# Check RLS status
psql "$DATABASE_URL" -f scripts/verify-database.sql
# Look for rls_enabled = true
```

**6. psql Command Not Found (for bash script)**
```bash
# Install PostgreSQL client tools:
# macOS:
brew install postgresql

# Ubuntu/Debian:
sudo apt-get install postgresql-client

# Windows: Download from postgresql.org
```

### Debug Queries

```sql
-- Check current user and permissions
SELECT current_user, current_role;

-- Test RLS policies
SET ROLE anon;
SELECT count(*) FROM invitation_links; -- Should work
INSERT INTO rsvp_responses (name) VALUES ('Test'); -- Should work
RESET ROLE;

-- View policy details
SELECT * FROM pg_policies WHERE tablename IN ('invitation_links', 'rsvp_responses');
```

## 📈 Performance

The scripts include these optimizations:

- **Indexes** on foreign keys and frequently queried columns
- **Proper data types** for efficient storage
- **RLS policies** that don't impact performance
- **Connection pooling** support for production

## 🔄 Data Migration

### From Supabase to Neon

```bash
# 1. Export existing data from Supabase
pg_dump "supabase_connection_string" \
  --data-only \
  --table=invitation_links \
  --table=rsvp_responses > backup.sql

# 2. Setup schema in Neon
export DATABASE_URL="neon_connection_string"
npm run setup-db

# 3. Import data
psql "$DATABASE_URL" -f backup.sql

# 4. Verify data
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM invitation_links;"
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM rsvp_responses;"
```

### From Other Providers

Same process - just change the source connection string in step 1.

## 🧪 Testing

After migration, test these key operations:

1. **Public RSVP submission** (anon role)
2. **Admin RSVP listing** (service role)  
3. **Invitation link creation** (service role)
4. **Data queries with JOINs** (complex selects)

```bash
# Quick test script
psql "$DATABASE_URL" << 'EOF'
-- Test public insert
INSERT INTO rsvp_responses (name, email) VALUES ('Test User', 'test@example.com');

-- Test admin query with JOIN
SELECT r.name, il.label 
FROM rsvp_responses r 
LEFT JOIN invitation_links il ON r.link_id = il.id 
LIMIT 1;

-- Cleanup
DELETE FROM rsvp_responses WHERE name = 'Test User';
EOF
```

## 📞 Support

If you encounter issues:

1. **Check the verification script output**
2. **Review the troubleshooting section above**
3. **Look at your database provider's logs**
4. **Test with a minimal connection first**

The migration scripts are battle-tested and handle edge cases, but every provider is slightly different. The verification script will help identify any provider-specific issues.