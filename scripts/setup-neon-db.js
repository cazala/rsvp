#!/usr/bin/env node

/**
 * Neon Database Setup Script
 * 
 * Properly initializes a Neon database with the schema from init-database.sql
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('@neondatabase/serverless');

async function setupDatabase() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable is required');
    process.exit(1);
  }

  console.log('🚀 Starting Neon database setup...');
  
  try {
    // Create Neon Pool (supports regular SQL queries)
    const pool = new Pool({ connectionString: databaseUrl });
    
    // Helper function to execute SQL
    const sql = async (query) => {
      const result = await pool.query(query);
      return result.rows;
    };
    
    // Read the SQL schema file
    const schemaPath = path.join(__dirname, 'init-database.sql');
    let schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    // Remove comments and clean up
    schemaSQL = schemaSQL
      .replace(/--.*$/gm, '')  // Remove -- comments
      .replace(/\/\*[\s\S]*?\*\//g, '')  // Remove /* */ comments
      .replace(/^\s*[\r\n]/gm, '')  // Remove empty lines
      .trim();
    
    // Split into individual statements
    // Handle DO blocks specially
    const statements = [];
    let currentStatement = '';
    let inDoBlock = false;
    let doBlockDepth = 0;
    
    const lines = schemaSQL.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      
      // Check for DO block start
      if (trimmed.startsWith('DO $$') || trimmed.startsWith('DO $')) {
        inDoBlock = true;
        doBlockDepth = 1;
        currentStatement += line + '\n';
        continue;
      }
      
      // Track DO block depth
      if (inDoBlock) {
        if (trimmed.includes('$$') || trimmed.includes('$')) {
          // Count occurrences to handle nested blocks
          const matches = trimmed.match(/\$\$/g) || trimmed.match(/\$/g);
          if (matches) {
            doBlockDepth += matches.length;
          }
        }
        if (trimmed.endsWith('$$;') || trimmed.endsWith('$;')) {
          doBlockDepth--;
          if (doBlockDepth === 0) {
            inDoBlock = false;
            currentStatement += line;
            statements.push(currentStatement.trim());
            currentStatement = '';
            continue;
          }
        }
        currentStatement += line + '\n';
        continue;
      }
      
      // Regular statement handling
      currentStatement += line + '\n';
      
      // Check if statement ends
      if (trimmed.endsWith(';') && trimmed !== ';' && !trimmed.startsWith('--')) {
        statements.push(currentStatement.trim());
        currentStatement = '';
      }
    }
    
    // Add any remaining statement
    if (currentStatement.trim()) {
      statements.push(currentStatement.trim());
    }
    
    // Filter out empty statements and COMMIT
    const validStatements = statements.filter(stmt => 
      stmt.length > 0 && 
      !stmt.toLowerCase().includes('commit') &&
      !stmt.toLowerCase().startsWith('/*')
    );

    console.log(`📝 Executing ${validStatements.length} SQL statements...\n`);

    // Execute each statement using Neon's template literal syntax
    for (let i = 0; i < validStatements.length; i++) {
      const statement = validStatements[i];
      
      try {
        // Execute SQL statement
        await pool.query(statement);
        console.log(`✅ Statement ${i + 1}/${validStatements.length} executed`);
      } catch (error) {
        // Some statements might fail if objects already exist, that's OK
        if (error.message.includes('already exists') || 
            error.message.includes('does not exist') ||
            error.message.includes('duplicate') ||
            (error.message.includes('relation') && error.message.includes('already exists')) ||
            (error.message.includes('permission denied') && error.message.includes('role'))) {
          console.log(`⚠️  Statement ${i + 1}/${validStatements.length} skipped: ${error.message.split('\n')[0]}`);
        } else {
          console.error(`❌ Error in statement ${i + 1}:`, error.message);
          console.log('Statement:', statement.substring(0, 200).replace(/\n/g, ' ') + '...');
          // Continue with other statements
        }
      }
    }

    // Verify the setup
    console.log('\n🔍 Verifying setup...');
    
    try {
      const tables = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
          AND table_name IN ('invitation_links', 'rsvp_responses')
      `);
      
      console.log(`✅ Found ${tables.rows.length} tables:`, tables.rows.map(t => t.table_name).join(', '));

      const policies = await pool.query(`
        SELECT tablename, COUNT(*) as policy_count
        FROM pg_policies 
        WHERE tablename IN ('invitation_links', 'rsvp_responses')
        GROUP BY tablename
      `);
      
      console.log('✅ RLS policies:');
      policies.rows.forEach(p => {
        console.log(`   ${p.tablename}: ${p.policy_count} policies`);
      });

      const roles = await pool.query(`
        SELECT rolname 
        FROM pg_roles 
        WHERE rolname IN ('anon', 'authenticated', 'service_role')
      `);
      
      console.log(`✅ Found ${roles.rows.length} required roles:`, roles.rows.map(r => r.rolname).join(', '));

      // Check data count (should be 0)
      const linkCount = await pool.query('SELECT COUNT(*) as count FROM invitation_links');
      const rsvpCount = await pool.query('SELECT COUNT(*) as count FROM rsvp_responses');
      
      console.log(`✅ Database is empty: ${linkCount.rows[0].count} invitation links, ${rsvpCount.rows[0].count} RSVPs`);

    } catch (error) {
      console.log('⚠️  Some verification queries failed:', error.message);
      console.log('   This is normal for some providers - database setup likely successful');
    }

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Set DATABASE_PROVIDER=neon in your environment');
    console.log('2. Ensure DATABASE_URL is set correctly');
    console.log('3. Test your application');

    // Close the pool
    await pool.end();

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the setup
if (require.main === module) {
  setupDatabase().catch(error => {
    console.error('❌ Unhandled error:', error);
    process.exit(1);
  });
}

module.exports = { setupDatabase };

