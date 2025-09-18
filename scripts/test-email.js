#!/usr/bin/env node

/**
 * Email System Test Script
 * 
 * This script tests the email functionality with Resend
 * Run with: node scripts/test-email.js
 */

require('dotenv').config({ path: '.env.local' });

async function testEmailSystem() {
  console.log('🧪 Testing Email System...');
  console.log('================================');
  
  // Check environment variables
  console.log('📋 Environment Check:');
  console.log('- RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Set' : '❌ Missing');
  console.log('- SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? '✅ Set' : '❌ Missing');
  console.log('- FROM_EMAIL:', process.env.SENDGRID_FROM_EMAIL || 'noreply@ventaroai.com');
  console.log('');
  
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_your_actual_resend_api_key_here') {
    console.log('❌ RESEND_API_KEY not configured!');
    console.log('Please update your .env.local file with a real Resend API key.');
    console.log('Get one at: https://resend.com/api-keys');
    return;
  }
  
  try {
    // Import the backup email system
    const { sendEmailWithBackup } = await import('../src/lib/backup-email.js');
    
    console.log('📧 Sending test email...');
    
    const result = await sendEmailWithBackup({
      to: 'test@example.com', // Change this to your email for real testing
      subject: '🧪 VAI35 Email System Test',
      type: 'contact',
      html: `
        <h2>✅ Email System Test Successful!</h2>
        <p>Your VAI35 email system is working correctly with Resend.</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <p><strong>Method:</strong> Resend API</p>
        <hr>
        <p><em>This is an automated test email from your VAI35 application.</em></p>
      `,
      text: `
✅ Email System Test Successful!

Your VAI35 email system is working correctly with Resend.

Timestamp: ${new Date().toISOString()}
Method: Resend API

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
      console.log('🎉 SUCCESS! Your email system is working!');
      console.log('Contact forms will now send emails properly.');
    } else {
      console.log('');
      console.log('❌ FAILED! Check the error above.');
      console.log('Make sure your Resend API key is correct.');
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.log('');
    console.log('💡 Common issues:');
    console.log('- Invalid Resend API key');
    console.log('- Network connectivity issues');
    console.log('- Missing dependencies (run: npm install)');
  }
}

// Run the test
testEmailSystem().catch(console.error);