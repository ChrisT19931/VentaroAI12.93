#!/usr/bin/env node

/**
 * Email System Test Script
 * 
 * This script tests the email functionality with Resend
 * Run with: node scripts/test-email.js
 */

require('dotenv').config({ path: '.env.local' });

async function testEmailSystem() {
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
  
  if (!hasSendGrid && !hasResend && !hasMailgun && !hasSupabase) {
    console.log('❌ No email services configured!');
    console.log('Please configure at least one email service in your .env.local file:');
    console.log('- SendGrid: https://sendgrid.com/solutions/email-api/');
    console.log('- Resend: https://resend.com/api-keys');
    console.log('- Mailgun: https://www.mailgun.com/');
    console.log('- Supabase: https://supabase.com/');
    return;
  }
  
  try {
    // Import the three-tier email system
     const { sendEmailWithBackup } = await import('../src/lib/backup-email.ts');
    
    console.log('📧 Sending test email...');
    
    const result = await sendEmailWithBackup({
      to: 'test@example.com', // Change this to your email for real testing
      subject: '🧪 VAI35 Three-Tier Email System Test',
      type: 'contact',
      html: `
        <h2>✅ Email System Test Successful!</h2>
        <p>Your VAI35 three-tier email system is working correctly.</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <p><strong>Method:</strong> Three-Tier Fallback System</p>
        <p><strong>Services:</strong> SendGrid → Resend → Mailgun → Supabase</p>
        <hr>
        <p><em>This is an automated test email from your VAI35 application.</em></p>
      `,
      text: `
✅ Email System Test Successful!

Your VAI35 three-tier email system is working correctly.

Timestamp: ${new Date().toISOString()}
Method: Three-Tier Fallback System
Services: SendGrid → Resend → Mailgun → Supabase

---
This is an automated test email from your VAI35 application.
      `
    });
    
    console.log('📊 Test Result:');
    console.log('- Success:', result.success ? '✅' : '❌');
    console.log('- Method:', result.method);
    if (result.error) {
      console.log('- Error:', result.error);
    }
    if (result.id) {
      console.log('- Backup ID:', result.id);
    }
    
    if (result.success) {
      console.log('');
      console.log('🎉 SUCCESS! Your three-tier email system is working!');
      console.log('Contact forms will now send emails with automatic fallback.');
    } else {
      console.log('');
      console.log('❌ FAILED! Check the error above.');
      console.log('Make sure at least one email service is properly configured.');
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.log('');
    console.log('💡 Common issues:');
    console.log('- Invalid API keys for email services');
    console.log('- Network connectivity issues');
    console.log('- Missing dependencies (run: npm install)');
    console.log('- Incorrect domain configuration for Mailgun');
    console.log('- Missing Supabase configuration');
  }
}

// Run the test
testEmailSystem().catch(console.error);