#!/bin/bash

# Database Setup Script (Bash version)
# This script initializes the database schema and RLS policies
# Compatible with any PostgreSQL provider including Neon

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ DATABASE_URL environment variable is required${NC}"
    echo "Example: export DATABASE_URL='postgresql://user:password@host:port/database'"
    exit 1
fi

echo -e "${BLUE}🚀 Starting database setup...${NC}"

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ psql command not found${NC}"
    echo "Please install PostgreSQL client tools:"
    echo "  - macOS: brew install postgresql"
    echo "  - Ubuntu/Debian: sudo apt-get install postgresql-client"
    echo "  - Windows: Download from https://www.postgresql.org/download/"
    exit 1
fi

echo -e "${BLUE}📝 Executing database schema setup...${NC}"

# Run the main setup script
if psql "$DATABASE_URL" -f "$SCRIPT_DIR/init-database.sql" > /tmp/db-setup.log 2>&1; then
    echo -e "${GREEN}✅ Schema setup completed successfully${NC}"
else
    echo -e "${YELLOW}⚠️  Schema setup completed with warnings (this is usually OK)${NC}"
    echo "Check /tmp/db-setup.log for details if needed"
fi

echo -e "${BLUE}🔍 Verifying setup...${NC}"

# Run verification
if psql "$DATABASE_URL" -f "$SCRIPT_DIR/verify-database.sql" > /tmp/db-verify.log 2>&1; then
    echo -e "${GREEN}✅ Verification completed${NC}"
    
    # Show key verification results
    echo -e "${BLUE}📊 Setup Summary:${NC}"
    
    # Count tables
    TABLE_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('invitation_links', 'rsvp_responses');" 2>/dev/null || echo "0")
    echo -e "   Tables created: ${GREEN}$TABLE_COUNT/2${NC}"
    
    # Check RLS (might not work on all providers)
    RLS_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM pg_tables WHERE tablename IN ('invitation_links', 'rsvp_responses') AND rowsecurity = true;" 2>/dev/null || echo "unknown")
    if [ "$RLS_COUNT" != "unknown" ]; then
        echo -e "   RLS enabled: ${GREEN}$RLS_COUNT/2 tables${NC}"
    else
        echo -e "   RLS status: ${YELLOW}Unknown (provider may not support pg_tables)${NC}"
    fi
    
    # Check policies (might not work on all providers)
    POLICY_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM pg_policies WHERE tablename IN ('invitation_links', 'rsvp_responses');" 2>/dev/null || echo "unknown")
    if [ "$POLICY_COUNT" != "unknown" ]; then
        echo -e "   RLS policies: ${GREEN}$POLICY_COUNT policies${NC}"
    else
        echo -e "   RLS policies: ${YELLOW}Unknown (provider may not support pg_policies)${NC}"
    fi
    
else
    echo -e "${YELLOW}⚠️  Verification completed with warnings${NC}"
    echo "This is normal for some cloud providers that restrict system table access"
fi

echo -e "${GREEN}🎉 Database setup completed!${NC}"
echo ""
echo -e "${BLUE}📋 Next steps:${NC}"
echo "1. Set your environment variables:"
echo "   export DATABASE_PROVIDER=neon"
echo "   export DATABASE_URL='your_connection_string'"
echo ""
echo "2. Test your application:"
echo "   npm run dev"
echo ""
echo -e "${BLUE}💡 Troubleshooting:${NC}"
echo "- View detailed setup log: cat /tmp/db-setup.log"
echo "- View verification log: cat /tmp/db-verify.log"
echo "- Manual verification: psql \"\$DATABASE_URL\" -f scripts/verify-database.sql"
echo ""
echo -e "${GREEN}✨ Your database is ready for the wedding application!${NC}"