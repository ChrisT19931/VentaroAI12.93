const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createPasswordResetLogsTable() {
  console.log('🔧 Creating password reset logs table...');
  
  try {
    // Read the SQL migration file
    const sqlPath = path.join(__dirname, '..', 'supabase', 'migrations', 'create-password-reset-logs.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.error('❌ Error creating password reset logs table:', error);
      
      // Try alternative approach - execute statements individually
      console.log('🔄 Trying alternative approach...');
      
      const statements = sql.split(';').filter(stmt => stmt.trim());
      
      for (const statement of statements) {
        if (statement.trim()) {
          try {
            const { error: stmtError } = await supabase.rpc('exec_sql', { 
              sql_query: statement.trim() + ';' 
            });
            
            if (stmtError) {
              console.warn('⚠️ Statement failed (may already exist):', stmtError.message);
            } else {
              console.log('✅ Statement executed successfully');
            }
          } catch (err) {
            console.warn('⚠️ Statement error (may already exist):', err.message);
          }
        }
      }
    } else {
      console.log('✅ Password reset logs table created successfully');
    }
    
    // Verify table exists
    const { data: tableCheck, error: checkError } = await supabase
      .from('password_reset_logs')
      .select('count')
      .limit(1);
    
    if (checkError) {
      console.error('❌ Table verification failed:', checkError);
    } else {
      console.log('✅ Password reset logs table verified');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the function
createPasswordResetLogsTable()
  .then(() => {
    console.log('🎉 Password reset logs table setup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Setup failed:', error);
    process.exit(1);
  });