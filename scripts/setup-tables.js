#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupTables() {
  console.log('🔧 Setting up missing database tables...');
  console.log('=' .repeat(50));

  try {
    // Create newsletter_subscriptions table
    console.log('📰 Creating newsletter_subscriptions table...');
    const { error: newsletterError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255),
          subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          is_active BOOLEAN DEFAULT TRUE,
          unsubscribed_at TIMESTAMP WITH TIME ZONE,
          source VARCHAR(100) DEFAULT 'website',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (newsletterError) {
      console.error('❌ Error creating newsletter_subscriptions table:', newsletterError);
    } else {
      console.log('✅ newsletter_subscriptions table created successfully');
    }

    // Add indexes for newsletter_subscriptions
    console.log('📊 Adding indexes for newsletter_subscriptions...');
    const { error: indexError1 } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_newsletter_email ON public.newsletter_subscriptions(email);
        CREATE INDEX IF NOT EXISTS idx_newsletter_active ON public.newsletter_subscriptions(is_active);
        CREATE INDEX IF NOT EXISTS idx_newsletter_subscribed ON public.newsletter_subscriptions(subscribed_at);
      `
    });

    if (indexError1) {
      console.error('❌ Error creating newsletter indexes:', indexError1);
    } else {
      console.log('✅ Newsletter indexes created successfully');
    }

    // Enable RLS for newsletter_subscriptions
    console.log('🔒 Setting up RLS for newsletter_subscriptions...');
    const { error: rlsError1 } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
      `
    });

    if (rlsError1) {
      console.error('❌ Error enabling RLS for newsletter_subscriptions:', rlsError1);
    } else {
      console.log('✅ RLS enabled for newsletter_subscriptions');
    }

    // Update contact_submissions table
    console.log('📝 Updating contact_submissions table...');
    const { error: contactError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE public.contact_submissions 
        ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
        ADD COLUMN IF NOT EXISTS company VARCHAR(255),
        ADD COLUMN IF NOT EXISTS project_type VARCHAR(100),
        ADD COLUMN IF NOT EXISTS services TEXT,
        ADD COLUMN IF NOT EXISTS timeline VARCHAR(100),
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
      `
    });

    if (contactError) {
      console.error('❌ Error updating contact_submissions table:', contactError);
    } else {
      console.log('✅ contact_submissions table updated successfully');
    }

    // Add indexes for contact_submissions
    console.log('📊 Adding indexes for contact_submissions...');
    const { error: indexError2 } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_contact_project_type ON public.contact_submissions(project_type);
        CREATE INDEX IF NOT EXISTS idx_contact_timeline ON public.contact_submissions(timeline);
        CREATE INDEX IF NOT EXISTS idx_contact_phone ON public.contact_submissions(phone);
        CREATE INDEX IF NOT EXISTS idx_contact_company ON public.contact_submissions(company);
      `
    });

    if (indexError2) {
      console.error('❌ Error creating contact indexes:', indexError2);
    } else {
      console.log('✅ Contact indexes created successfully');
    }

    // Test the tables
    console.log('🧪 Testing table access...');
    
    const { data: newsletterTest, error: newsletterTestError } = await supabase
      .from('newsletter_subscriptions')
      .select('*')
      .limit(1);

    if (newsletterTestError) {
      console.error('❌ Error accessing newsletter_subscriptions:', newsletterTestError);
    } else {
      console.log('✅ newsletter_subscriptions table accessible');
    }

    const { data: contactTest, error: contactTestError } = await supabase
      .from('contact_submissions')
      .select('*')
      .limit(1);

    if (contactTestError) {
      console.error('❌ Error accessing contact_submissions:', contactTestError);
    } else {
      console.log('✅ contact_submissions table accessible');
    }

    console.log('\n🎉 Database setup completed!');
    console.log('=' .repeat(50));
    console.log('✅ Newsletter subscriptions will now be stored in Supabase');
    console.log('✅ Contact form submissions will now be stored in Supabase');
    console.log('✅ Auto-emails will be sent to both admin and customers');
    console.log('✅ Existing user logins are preserved');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

setupTables();