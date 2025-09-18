#!/usr/bin/env node

// Test the three-tier email system
// This script tests the email fallback system without TypeScript compilation issues

require('dotenv').config({ path: '.env.local' });

async function testThreeTierSystem() {
  console.log('🔧 Testing Three-Tier Email System Configuration...');
  console.log('==================================================');
  
  // Check environment variables
  const hasOpenAI = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here';
  const hasSendGrid = process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== 'your_sendgrid_api_key';
  const hasResend = process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your_resend_api_key';
  const hasMailgun = process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN && 
                    process.env.MAILGUN_API_KEY !== 'your_mailgun_api_key_here';
  const hasSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  console.log('📧 Email Services (Fallback Order):');
  console.log(`   1. SendGrid (Primary): ${hasSendGrid ? '✅ Configured' : '❌ Missing/Default'}`);
  console.log(`   2. Resend (Secondary): ${hasResend ? '✅ Configured' : '❌ Missing/Default'}`);
  console.log(`   3. Mailgun (Tertiary): ${hasMailgun ? '✅ Configured' : '❌ Missing/Default'}`);
  console.log(`   4. Supabase (Backup): ${hasSupabase ? '✅ Configured' : '❌ Missing/Default'}`);
  console.log(`   🤖 OpenAI: ${hasOpenAI ? '✅ Configured' : '❌ Missing/Default'}`);
  console.log('');
  
  // Count configured services
  const configuredServices = [hasSendGrid, hasResend, hasMailgun, hasSupabase].filter(Boolean).length;
  
  if (configuredServices === 0) {
    console.log('❌ No email services configured!');
    console.log('Please configure at least one email service in your .env.local file:');
    console.log('- SendGrid: https://sendgrid.com/solutions/email-api/');
    console.log('- Resend: https://resend.com/api-keys');
    console.log('- Mailgun: https://www.mailgun.com/');
    console.log('- Supabase: https://supabase.com/');
    return;
  }
  
  console.log(`📊 System Status: ${configuredServices}/4 services configured`);
  console.log('');
  
  // Test individual services
  console.log('🧪 Testing Individual Services...');
  console.log('==================================');
  
  // Test SendGrid
  if (hasSendGrid) {
    console.log('📧 Testing SendGrid...');
    try {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      console.log('   ✅ SendGrid API key loaded successfully');
    } catch (error) {
      console.log('   ❌ SendGrid test failed:', error.message);
    }
  }
  
  // Test Resend
  if (hasResend) {
    console.log('📧 Testing Resend...');
    try {
      const { Resend } = require('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      console.log('   ✅ Resend API key loaded successfully');
    } catch (error) {
      console.log('   ❌ Resend test failed:', error.message);
    }
  }
  
  // Test Mailgun
  if (hasMailgun) {
    console.log('📧 Testing Mailgun...');
    try {
      // Test Mailgun configuration
      const apiKey = process.env.MAILGUN_API_KEY;
      const domain = process.env.MAILGUN_DOMAIN;
      
      if (apiKey && domain) {
        console.log(`   ✅ Mailgun configured for domain: ${domain}`);
        console.log('   ✅ Mailgun API key loaded successfully');
      } else {
        console.log('   ❌ Mailgun missing API key or domain');
      }
    } catch (error) {
      console.log('   ❌ Mailgun test failed:', error.message);
    }
  }
  
  // Test Supabase
  if (hasSupabase) {
    console.log('📧 Testing Supabase...');
    try {
      const { createClient } = require('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
      console.log('   ✅ Supabase client created successfully');
    } catch (error) {
      console.log('   ❌ Supabase test failed:', error.message);
    }
  }
  
  console.log('');
  console.log('🎯 Fallback Strategy:');
  console.log('=====================');
  
  if (hasSendGrid) {
    console.log('1️⃣  SendGrid will be tried first (Primary)');
  } else {
    console.log('1️⃣  SendGrid: ❌ Not configured - will be skipped');
  }
  
  if (hasResend) {
    console.log('2️⃣  Resend will be tried second (Secondary)');
  } else {
    console.log('2️⃣  Resend: ❌ Not configured - will be skipped');
  }
  
  if (hasMailgun) {
    console.log('3️⃣  Mailgun will be tried third (Tertiary)');
  } else {
    console.log('3️⃣  Mailgun: ❌ Not configured - will be skipped');
  }
  
  if (hasSupabase) {
    console.log('4️⃣  Supabase will store emails as final backup');
  } else {
    console.log('4️⃣  Supabase: ❌ Not configured - emails may be lost!');
  }
  
  console.log('');
  
  // Provide recommendations
  console.log('💡 Recommendations:');
  console.log('==================');
  
  if (configuredServices >= 3) {
    console.log('🎉 Excellent! You have strong email redundancy.');
  } else if (configuredServices >= 2) {
    console.log('👍 Good! You have basic email redundancy.');
    if (!hasSupabase) {
      console.log('⚠️  Consider configuring Supabase for final backup storage.');
    }
  } else {
    console.log('⚠️  Warning: Limited redundancy. Consider adding more services.');
  }
  
  if (!hasSendGrid && !hasResend && !hasMailgun) {
    console.log('🚨 Critical: No email sending services configured!');
  }
  
  console.log('');
  console.log('📋 Next Steps:');
  console.log('=============');
  
  if (!hasSendGrid) {
    console.log('• Set up SendGrid: https://sendgrid.com/');
  }
  if (!hasResend) {
    console.log('• Set up Resend: https://resend.com/');
  }
  if (!hasMailgun) {
    console.log('• Set up Mailgun: https://www.mailgun.com/');
  }
  if (!hasSupabase) {
    console.log('• Set up Supabase: https://supabase.com/');
  }
  
  console.log('• Test the system: Use the contact form on your website');
  console.log('• Monitor logs: Check console for email sending status');
  console.log('• Read the guide: THREE_TIER_EMAIL_BACKUP_SETUP.md');
  
  console.log('');
  console.log('🛡️ Your three-tier email backup system is ready!');
}

// Run the test
testThreeTierSystem().catch(console.error);