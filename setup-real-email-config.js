#!/usr/bin/env node

/**
 * Email Configuration Setup Script
 * This script helps set up real email API keys and test email delivery
 */

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

console.log('🔧 EMAIL CONFIGURATION SETUP');
console.log('=' .repeat(50));

// Check current configuration
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found!');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
console.log('\n📋 CURRENT EMAIL CONFIGURATION STATUS:');
console.log('-'.repeat(40));

// Check Brevo API Key
if (envContent.includes('BREVO_API_KEY=xkeysib-a0348dc3')) {
  console.log('❌ BREVO_API_KEY: PLACEHOLDER (needs real API key)');
  console.log('   📝 To fix: Get real API key from https://app.brevo.com/settings/keys/api');
} else if (envContent.includes('BREVO_API_KEY=') && !envContent.includes('xkeysib-a0348dc3')) {
  console.log('✅ BREVO_API_KEY: SET (appears to be real key)');
} else {
  console.log('❌ BREVO_API_KEY: MISSING');
}

// Check SendGrid API Key
if (envContent.includes('SENDGRID_API_KEY=SG.placeholder')) {
  console.log('❌ SENDGRID_API_KEY: PLACEHOLDER (needs real API key)');
  console.log('   📝 To fix: Get real API key from https://app.sendgrid.com/settings/api_keys');
} else if (envContent.includes('SENDGRID_API_KEY=SG.')) {
  console.log('✅ SENDGRID_API_KEY: SET (appears to be real key)');
} else {
  console.log('❌ SENDGRID_API_KEY: MISSING or INVALID');
}

console.log('\n🚨 CRITICAL ISSUE IDENTIFIED:');
console.log('The email system is not sending emails because API keys are placeholders.');
console.log('\n📋 TO FIX THIS ISSUE:');
console.log('\n1️⃣  GET BREVO API KEY (Recommended - Primary Email Service):');
console.log('   • Go to: https://app.brevo.com/settings/keys/api');
console.log('   • Create new API key with "Send emails" permission');
console.log('   • Copy the key (starts with "xkeysib-")');
console.log('   • Replace BREVO_API_KEY in .env.local');

console.log('\n2️⃣  OR GET SENDGRID API KEY (Alternative - Backup Service):');
console.log('   • Go to: https://app.sendgrid.com/settings/api_keys');
console.log('   • Create new API key with "Mail Send" permission');
console.log('   • Copy the key (starts with "SG.")');
console.log('   • Replace SENDGRID_API_KEY in .env.local');

console.log('\n3️⃣  VERIFY EMAIL ADDRESSES:');
console.log('   • Ensure chris.t@ventarosales.com is verified in your email service');
console.log('   • Add christroiano1993@gmail.com to verified recipients if needed');

// Create a test function for when API keys are set
async function testWithRealApiKey() {
  console.log('\n🧪 TESTING WITH CURRENT CONFIGURATION...');
  
  // Test Brevo directly if key looks real
  const brevoKey = process.env.BREVO_API_KEY;
  if (brevoKey && !brevoKey.includes('xkeysib-a0348dc3') && brevoKey.startsWith('xkeysib-')) {
    console.log('\n🔍 Testing Brevo API directly...');
    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': brevoKey
        },
        body: JSON.stringify({
          sender: {
            name: 'Ventaro AI Test',
            email: 'chris.t@ventarosales.com'
          },
          to: [{
            email: 'christroiano1993@gmail.com',
            name: 'Test Recipient'
          }],
          subject: 'BREVO TEST: Email System Configuration Verification',
          htmlContent: `
            <h2>🎉 Brevo Email Integration Test</h2>
            <p>This email confirms that your Brevo email integration is working correctly!</p>
            <p><strong>Test Details:</strong></p>
            <ul>
              <li>Timestamp: ${new Date().toISOString()}</li>
              <li>Service: Brevo (Primary)</li>
              <li>From: chris.t@ventarosales.com</li>
              <li>To: christroiano1993@gmail.com</li>
            </ul>
            <p>✅ If you receive this email, the Brevo integration is working perfectly!</p>
            <p>You can now proceed with testing all form integrations and pushing updates to git.</p>
            <hr>
            <p><small>This is an automated test email from your Ventaro AI email system.</small></p>
          `,
          textContent: `
BREVO EMAIL INTEGRATION TEST

This email confirms that your Brevo email integration is working correctly!

Test Details:
- Timestamp: ${new Date().toISOString()}
- Service: Brevo (Primary)
- From: chris.t@ventarosales.com
- To: christroiano1993@gmail.com

If you receive this email, the Brevo integration is working perfectly!
You can now proceed with testing all form integrations and pushing updates to git.

This is an automated test email from your Ventaro AI email system.
          `
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ BREVO TEST EMAIL SENT SUCCESSFULLY!');
        console.log('📧 Message ID:', result.messageId);
        console.log('📥 Check christroiano1993@gmail.com inbox');
        console.log('\n🎉 BREVO INTEGRATION IS WORKING!');
        return true;
      } else {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.log('❌ BREVO TEST FAILED:', error.message);
        return false;
      }
    } catch (error) {
      console.log('❌ BREVO TEST ERROR:', error.message);
      return false;
    }
  } else {
    console.log('⚠️  BREVO API KEY NOT SET OR INVALID');
  }
  
  // Test SendGrid if available
  const sendgridKey = process.env.SENDGRID_API_KEY;
  if (sendgridKey && !sendgridKey.includes('placeholder') && sendgridKey.startsWith('SG.')) {
    console.log('\n🔍 Testing SendGrid API directly...');
    try {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(sendgridKey);

      const msg = {
        to: 'christroiano1993@gmail.com',
        from: 'chris.t@ventarosales.com',
        subject: 'SENDGRID TEST: Email System Configuration Verification',
        html: `
          <h2>🎉 SendGrid Email Integration Test</h2>
          <p>This email confirms that your SendGrid email integration is working correctly!</p>
          <p><strong>Test Details:</strong></p>
          <ul>
            <li>Timestamp: ${new Date().toISOString()}</li>
            <li>Service: SendGrid (Backup)</li>
            <li>From: chris.t@ventarosales.com</li>
            <li>To: christroiano1993@gmail.com</li>
          </ul>
          <p>✅ If you receive this email, the SendGrid integration is working perfectly!</p>
          <p>You can now proceed with testing all form integrations and pushing updates to git.</p>
          <hr>
          <p><small>This is an automated test email from your Ventaro AI email system.</small></p>
        `,
        text: `
SENDGRID EMAIL INTEGRATION TEST

This email confirms that your SendGrid email integration is working correctly!

Test Details:
- Timestamp: ${new Date().toISOString()}
- Service: SendGrid (Backup)
- From: chris.t@ventarosales.com
- To: christroiano1993@gmail.com

If you receive this email, the SendGrid integration is working perfectly!
You can now proceed with testing all form integrations and pushing updates to git.

This is an automated test email from your Ventaro AI email system.
        `
      };

      const result = await sgMail.send(msg);
      console.log('✅ SENDGRID TEST EMAIL SENT SUCCESSFULLY!');
      console.log('📧 Message ID:', result[0].headers['x-message-id']);
      console.log('📥 Check christroiano1993@gmail.com inbox');
      console.log('\n🎉 SENDGRID INTEGRATION IS WORKING!');
      return true;
    } catch (error) {
      console.log('❌ SENDGRID TEST ERROR:', error.message);
      return false;
    }
  } else {
    console.log('⚠️  SENDGRID API KEY NOT SET OR INVALID');
  }
  
  return false;
}

// Main execution
async function main() {
  const emailWorking = await testWithRealApiKey();
  
  console.log('\n' + '=' .repeat(60));
  console.log('📊 EMAIL CONFIGURATION SUMMARY');
  console.log('=' .repeat(60));
  
  if (emailWorking) {
    console.log('🎉 EMAIL SYSTEM IS WORKING!');
    console.log('\n📧 NEXT STEPS:');
    console.log('1. ✅ Check christroiano1993@gmail.com for test email');
    console.log('2. 🧪 Run comprehensive form tests');
    console.log('3. 🎨 Verify email templates look good');
    console.log('4. 📝 Confirm email receipt');
    console.log('5. 🚀 Push all updates to git');
  } else {
    console.log('❌ EMAIL SYSTEM NEEDS CONFIGURATION');
    console.log('\n🔧 REQUIRED ACTIONS:');
    console.log('1. 🔑 Set up real API keys (Brevo or SendGrid)');
    console.log('2. ✉️  Verify sender email addresses');
    console.log('3. 🧪 Run this script again to test');
    console.log('4. 📧 Check for test emails in inbox');
    
    console.log('\n📝 QUICK SETUP COMMANDS:');
    console.log('# For Brevo (Recommended):');
    console.log('# 1. Get API key from https://app.brevo.com/settings/keys/api');
    console.log('# 2. Edit .env.local and replace BREVO_API_KEY=xkeysib-a0348dc3... with your real key');
    console.log('# 3. Run: node setup-real-email-config.js');
    
    console.log('\n# For SendGrid (Alternative):');
    console.log('# 1. Get API key from https://app.sendgrid.com/settings/api_keys');
    console.log('# 2. Edit .env.local and replace SENDGRID_API_KEY=SG.placeholder... with your real key');
    console.log('# 3. Run: node setup-real-email-config.js');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testWithRealApiKey };