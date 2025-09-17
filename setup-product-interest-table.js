const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupProductInterestTable() {
  console.log('🚀 Setting up product_interest table...');
  
  try {
    // Create the product_interest table
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        -- Create product_interest table if it doesn't exist
        CREATE TABLE IF NOT EXISTS product_interest (
          id SERIAL PRIMARY KEY,
          product_name VARCHAR(255) NOT NULL,
          source VARCHAR(100) DEFAULT 'unknown',
          user_ip VARCHAR(45),
          user_agent TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Create index for faster queries
        CREATE INDEX IF NOT EXISTS idx_product_interest_product_name ON product_interest(product_name);
        CREATE INDEX IF NOT EXISTS idx_product_interest_created_at ON product_interest(created_at);
        CREATE INDEX IF NOT EXISTS idx_product_interest_source ON product_interest(source);
        
        -- Enable RLS (Row Level Security)
        ALTER TABLE product_interest ENABLE ROW LEVEL SECURITY;
        
        -- Create policy to allow service role to manage all data
        DROP POLICY IF EXISTS "Service role can manage product_interest" ON product_interest;
        CREATE POLICY "Service role can manage product_interest" ON product_interest
          FOR ALL USING (auth.role() = 'service_role');
        
        -- Create policy to allow authenticated users to insert their own interest
        DROP POLICY IF EXISTS "Users can insert product_interest" ON product_interest;
        CREATE POLICY "Users can insert product_interest" ON product_interest
          FOR INSERT WITH CHECK (true);
      `
    });

    if (error) {
      console.error('❌ Error creating table:', error);
      return;
    }

    console.log('✅ product_interest table created successfully!');
    
    // Test the table by inserting a sample record
    const { data: testData, error: testError } = await supabase
      .from('product_interest')
      .insert({
        product_name: 'AI Web Creation Masterclass',
        source: 'setup_test',
        user_ip: '127.0.0.1'
      })
      .select();

    if (testError) {
      console.error('❌ Error testing table:', testError);
    } else {
      console.log('✅ Test record inserted successfully:', testData);
      
      // Clean up test record
      await supabase
        .from('product_interest')
        .delete()
        .eq('source', 'setup_test');
      
      console.log('✅ Test record cleaned up');
    }

    console.log('\n🎉 Product interest tracking system is ready!');
    console.log('📊 You can now track user interest in your products.');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

// Run the setup
setupProductInterestTable();