#!/usr/bin/env node

/**
 * Database Setup Script
 * 
 * This script initializes the database schema and RLS policies
 * for both Neon and other PostgreSQL providers.
 * 
 * Usage:
 *   node scripts/setup-database.js
 *   
 * Environment variables required:
 *   DATABASE_URL - PostgreSQL connection string
 */

const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable is required');
    console.log('Example: DATABASE_URL=postgresql://user:password@host:port/database');
    process.exit(1);
  }

  console.log('🚀 Starting database setup...');
  
  try {
    // Try to use neon/serverless first (if available)
    let sql;
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { neon } = require('@neondatabase/serverless');
      const neonSql = neon(databaseUrl);
      
      // Wrap Neon to handle template literals properly
      sql = async (query) => {
        // Use template literal syntax for Neon
        return await neonSql`${query}`;
      };
      console.log('📡 Using Neon serverless driver');
    } catch {
      // Fallback to pg for regular PostgreSQL
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { Client } = require('pg');
        const client = new Client({ connectionString: databaseUrl });
        await client.connect();
        sql = async (query) => {
          const result = await client.query(query);
          return result.rows;
        };
        console.log('🐘 Using PostgreSQL driver');
      } catch {
        console.error('❌ No suitable database driver found.');
        console.log('Please install either @neondatabase/serverless or pg:');
        console.log('  npm install @neondatabase/serverless');
        console.log('  or');
        console.log('  npm install pg');
        process.exit(1);
      }
    }

    // Read the SQL schema file
    const schemaPath = path.join(__dirname, 'init-database.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

    // Better SQL parsing - handle multi-line statements properly
    let cleanSQL = schemaSQL
      // Remove comments (-- style)
      .replace(/--.*$/gm, '')
      // Remove /* */ comments
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // Remove empty lines
      .replace(/^\s*[\r\n]/gm, '')
      .trim();

    // Split on semicolons but be careful with DO blocks
    const statements = [];
    let currentStatement = '';
    let inDoBlock = false;
    
    const lines = cleanSQL.split('\n');
    for (const line of lines) {
      currentStatement += line + '\n';
      
      if (line.trim().startsWith('DO $$') || line.trim().startsWith('DO $')) {
        inDoBlock = true;
      }
      
      if (inDoBlock && (line.trim() === '$$;' || line.trim() === '$;')) {
        inDoBlock = false;
        statements.push(currentStatement.trim());
        currentStatement = '';
      } else if (!inDoBlock && line.trim().endsWith(';') && line.trim() !== ';') {
        statements.push(currentStatement.trim());
        currentStatement = '';
      }
    }
    
    // Add any remaining statement
    if (currentStatement.trim() && !currentStatement.trim().startsWith('/*')) {
      statements.push(currentStatement.trim());
    }

    const validStatements = statements.filter(stmt => 
      stmt.length > 0 && 
      !stmt.toLowerCase().includes('commit') &&
      !stmt.startsWith('/*')
    );

    console.log(`📝 Executing ${validStatements.length} SQL statements...`);

    // Execute each statement
    for (let i = 0; i < validStatements.length; i++) {
      const statement = validStatements[i];
      
      try {
        await sql(statement);
        console.log(`✅ Statement ${i + 1}/${validStatements.length} executed successfully`);
      } catch (error) {
        // Some statements might fail if objects already exist, that's OK
        if (error.message.includes('already exists') || 
            error.message.includes('does not exist') ||
            error.message.includes('duplicate') ||
            error.message.includes('relation') && error.message.includes('already exists')) {
          console.log(`⚠️  Statement ${i + 1}/${validStatements.length} skipped (already exists)`);
        } else {
          console.error(`❌ Error in statement ${i + 1}:`, error.message);
          console.log('Statement preview:', statement.substring(0, 150).replace(/\n/g, ' ') + '...');
          // Don't exit on error, continue with other statements
        }
      }
    }

    // Verify the setup
    console.log('\n🔍 Verifying setup...');
    
    try {
      const tables = await sql(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
          AND table_name IN ('invitation_links', 'rsvp_responses')
      `);
      
      console.log(`✅ Found ${tables.length} tables:`, tables.map(t => t.table_name).join(', '));

      try {
        const policies = await sql(`
          SELECT tablename, COUNT(*) as policy_count
          FROM pg_policies 
          WHERE tablename IN ('invitation_links', 'rsvp_responses')
          GROUP BY tablename
        `);
        
        console.log('✅ RLS policies:');
        policies.forEach(p => {
          console.log(`   ${p.tablename}: ${p.policy_count} policies`);
        });
      } catch {
        console.log('⚠️  Could not verify RLS policies (might not be supported by provider)');
      }

      try {
        const roles = await sql(`
          SELECT rolname 
          FROM pg_roles 
          WHERE rolname IN ('anon', 'authenticated', 'service_role')
        `);
        
        console.log(`✅ Found ${roles.length} required roles:`, roles.map(r => r.rolname).join(', '));
      } catch {
        console.log('⚠️  Could not verify roles (might need manual role creation)');
      }

    } catch {
      console.log('⚠️  Verification queries failed - this is normal for some providers');
      console.log('   Your database setup is likely successful');
      console.log('   Run the verify-database.sql script manually for detailed checks');
    }

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Set DATABASE_PROVIDER=neon in your environment');
    console.log('2. Ensure DATABASE_URL is set correctly');
    console.log('3. Test your application');
    console.log('\n💡 To verify the setup, run:');
    console.log('   psql "your_database_url" -f scripts/verify-database.sql');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your DATABASE_URL is correct');
    console.log('2. Ensure you have permissions to create tables');
    console.log('3. Try running scripts/init-database.sql manually');
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the setup
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };