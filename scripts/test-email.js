#!/usr/bin/env node

/**
 * Email System Test Script
 * 
 * This script tests the email functionality with Resend
 * Run with: node scripts/test-email.js
 */

require('dotenv').config({ path: '.env.local' });

async function testEmailSystem() {
  console.log('🔧 VAI35 SendGrid Email System Test');
console.log('===================================');
console.log('Testing: SendGrid → Supabase Backup');
console.log('');
  
  // Check environment variables
const sendgridConfigured = process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== 'your_sendgrid_api_key';
const supabaseConfigured = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;
const openaiConfigured = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key';

console.log('📋 Configuration Status:');
console.log(`   SendGrid: ${sendgridConfigured ? '✅ Configured' : '❌ Missing/Default'}`);
console.log(`   Supabase: ${supabaseConfigured ? '✅ Configured' : '❌ Missing/Default'}`);
console.log(`   OpenAI: ${openaiConfigured ? '✅ Configured' : '❌ Missing/Default'}`);
console.log('');

console.log('🎯 Fallback Order:');
console.log('   1. SendGrid (Primary - Production grade)');
console.log('   2. Supabase Backup (Fallback - Store for manual processing)');
console.log('');
  
  if (!sendgridConfigured) {
    console.log('❌ SENDGRID_API_KEY not configured!');
    console.log('Please update your .env.local file with a real SendGrid API key.');
    console.log('Get one at: https://sendgrid.com/solutions/email-api/');
    return;
  }
  
  try {
    // Import the email system
    const { sendEmailWithBackup } = await import('../src/lib/backup-email.js');
    
    console.log('📧 Sending test email...');
    
    const result = await sendEmailWithBackup({
      to: 'test@example.com', // Change this to your email for real testing
      subject: 'VAI35 SendGrid Email System Test',
      type: 'contact',
      text: 'This is a test email from the VAI35 SendGrid email system with Supabase backup. If you receive this, the email system is working correctly!',
      html: `
        <h2>🎉 VAI35 SendGrid Email System Test</h2>
        <p>Congratulations! Your SendGrid email system with Supabase backup is working correctly.</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <h3>📧 System Overview:</h3>
          <ul>
            <li><strong>Primary:</strong> SendGrid (Production-grade delivery)</li>
            <li><strong>Backup:</strong> Supabase (Manual processing queue)</li>
          </ul>
        </div>
        <p><em>This email was sent on ${new Date().toISOString()}</em></p>
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
      console.log('✅ SUCCESS: SendGrid email system test completed successfully!');
      console.log('Contact forms will now send emails properly.');
    } else {
      console.log('');
      console.log('❌ FAILED! Check the error above.');
      console.log('Make sure your SendGrid API key is correct.');
    }
    
  } catch (error) {
    console.log('❌ ERROR: SendGrid email system test failed:', error.message);
    console.log('');
    console.log('\n📚 Common Issues:');
    console.log('   • SendGrid: Check API key and verified sender email');
    console.log('   • Supabase: Check URL and service role key');
    console.log('   • Make sure .env.local is properly configured');
  }
}

// Run the test
testEmailSystem().catch(console.error);