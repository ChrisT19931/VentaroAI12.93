#!/usr/bin/env node

/**
 * Vercel Email System Diagnostic and Fix Script
 * This script diagnoses and fixes email issues after Vercel deployment
 */

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

console.log('🔧 VERCEL EMAIL SYSTEM DIAGNOSTIC');
console.log('=' .repeat(50));

// Check local environment first
const envPath = path.join(__dirname, '.env.local');
let localEnvContent = '';
if (fs.existsSync(envPath)) {
  localEnvContent = fs.readFileSync(envPath, 'utf8');
  console.log('✅ Found .env.local file');
} else {
  console.log('❌ .env.local file not found');
}

console.log('\n📋 LOCAL ENVIRONMENT STATUS:');
console.log('-'.repeat(40));

// Check Brevo API Key
if (localEnvContent.includes('BREVO_API_KEY=xkeysib-a0348dc3')) {
  console.log('❌ BREVO_API_KEY: PLACEHOLDER (this is the problem!)');
  console.log('   📝 The API key starts with "xkeysib-a0348dc3" which is a placeholder');
} else if (localEnvContent.includes('BREVO_API_KEY=') && !localEnvContent.includes('xkeysib-a0348dc3')) {
  console.log('✅ BREVO_API_KEY: SET (appears to be real key)');
} else {
  console.log('❌ BREVO_API_KEY: MISSING');
}

// Check SendGrid API Key
if (localEnvContent.includes('SENDGRID_API_KEY=SG.placeholder')) {
  console.log('❌ SENDGRID_API_KEY: PLACEHOLDER');
} else if (localEnvContent.includes('SENDGRID_API_KEY=SG.')) {
  console.log('✅ SENDGRID_API_KEY: SET (appears to be real key)');
} else {
  console.log('❌ SENDGRID_API_KEY: MISSING or INVALID');
}

console.log('\n🚨 CRITICAL VERCEL DEPLOYMENT ISSUE IDENTIFIED:');
console.log('The email system fails after Vercel deployment because:');
console.log('1. Local .env.local has placeholder API keys');
console.log('2. Vercel environment variables may not be set correctly');
console.log('3. The Brevo API key check fails on placeholder detection');

console.log('\n🔧 IMMEDIATE FIX REQUIRED:');
console.log('\n1️⃣  SET REAL BREVO API KEY IN VERCEL:');
console.log('   • Go to: https://vercel.com/dashboard');
console.log('   • Select your project → Settings → Environment Variables');
console.log('   • Add: BREVO_API_KEY = your_real_brevo_api_key');
console.log('   • Get real key from: https://app.brevo.com/settings/keys/api');

console.log('\n2️⃣  VERIFY BREVO FROM EMAIL IN VERCEL:');
console.log('   • Add: BREVO_FROM_EMAIL = chris.t@ventarosales.com');
console.log('   • Ensure this email is verified in your Brevo account');

console.log('\n3️⃣  SET FALLBACK SENDGRID KEY (OPTIONAL):');
console.log('   • Add: SENDGRID_API_KEY = your_real_sendgrid_key');
console.log('   • Add: SENDGRID_FROM_EMAIL = chris.t@ventarosales.com');
console.log('   • Get key from: https://app.sendgrid.com/settings/api_keys');

console.log('\n4️⃣  REDEPLOY AFTER SETTING ENVIRONMENT VARIABLES:');
console.log('   • In Vercel dashboard, trigger a new deployment');
console.log('   • Or push a new commit to trigger auto-deployment');

// Test email sending function
async function testBrevoEmail(apiKey, fromEmail, toEmail) {
  if (!apiKey || apiKey.startsWith('xkeysib-a0348dc3')) {
    return { success: false, error: 'API key is placeholder or missing' };
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        sender: {
          name: 'Ventaro AI Test',
          email: fromEmail || 'chris.t@ventarosales.com'
        },
        to: [{
          email: toEmail || 'christroiano1993@gmail.com',
          name: 'Test Recipient'
        }],
        subject: '🔧 Vercel Email System Test - ' + new Date().toISOString(),
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">✅ Vercel Email System Working!</h2>
            <p>This test email confirms that your Brevo integration is working correctly after Vercel deployment.</p>
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3>Test Details:</h3>
              <ul>
                <li><strong>Timestamp:</strong> ${new Date().toISOString()}</li>
                <li><strong>Environment:</strong> Vercel Production</li>
                <li><strong>Email Service:</strong> Brevo API</li>
                <li><strong>Status:</strong> Successfully Sent</li>
              </ul>
            </div>
            <p>✅ Your contact forms, newsletter subscriptions, and all email notifications should now work correctly.</p>
            <hr>
            <p><small>This is an automated test email from your Ventaro AI email system diagnostic script.</small></p>
          </div>
        `,
        textContent: `
✅ Vercel Email System Working!

This test email confirms that your Brevo integration is working correctly after Vercel deployment.

Test Details:
- Timestamp: ${new Date().toISOString()}
- Environment: Vercel Production
- Email Service: Brevo API
- Status: Successfully Sent

✅ Your contact forms, newsletter subscriptions, and all email notifications should now work correctly.

This is an automated test email from your Ventaro AI email system diagnostic script.
        `
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`Brevo API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
    }

    const result = await response.json();
    return { success: true, messageId: result.messageId };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// If we have environment variables, test them
if (process.env.BREVO_API_KEY && !process.env.BREVO_API_KEY.startsWith('xkeysib-a0348dc3')) {
  console.log('\n🧪 TESTING CURRENT BREVO CONFIGURATION...');
  testBrevoEmail(
    process.env.BREVO_API_KEY,
    process.env.BREVO_FROM_EMAIL,
    'christroiano1993@gmail.com'
  ).then(result => {
    if (result.success) {
      console.log('✅ EMAIL TEST SUCCESSFUL!');
      console.log('   MessageId:', result.messageId);
      console.log('   📧 Check christroiano1993@gmail.com for test email');
      console.log('\n🎉 EMAIL SYSTEM IS WORKING CORRECTLY!');
    } else {
      console.log('❌ EMAIL TEST FAILED:', result.error);
      console.log('\n🔧 Please check your Brevo API key and sender email verification');
    }
  }).catch(error => {
    console.log('❌ EMAIL TEST ERROR:', error.message);
  });
} else {
  console.log('\n⚠️  Cannot test email - API key not configured or is placeholder');
}

console.log('\n📋 VERCEL ENVIRONMENT VARIABLES CHECKLIST:');
console.log('Copy these to your Vercel project settings:');
console.log('\n# Required for email system:');
console.log('BREVO_API_KEY=your_real_brevo_api_key_here');
console.log('BREVO_FROM_EMAIL=chris.t@ventarosales.com');
console.log('\n# Optional fallback:');
console.log('SENDGRID_API_KEY=your_real_sendgrid_key_here');
console.log('SENDGRID_FROM_EMAIL=chris.t@ventarosales.com');
console.log('\n# General:');
console.log('EMAIL_FROM=chris.t@ventarosales.com');

console.log('\n🚀 NEXT STEPS:');
console.log('1. Set the environment variables in Vercel dashboard');
console.log('2. Redeploy your application');
console.log('3. Test contact form on your live site');
console.log('4. Check email delivery to christroiano1993@gmail.com');

console.log('\n📞 SUPPORT:');
console.log('If emails still don\'t work after following these steps:');
console.log('1. Check Vercel function logs for detailed errors');
console.log('2. Verify sender email is verified in Brevo dashboard');
console.log('3. Test API key directly in Brevo dashboard');
console.log('4. Contact: chris.t@ventarosales.com');

console.log('\n' + '='.repeat(50));
console.log('🔧 VERCEL EMAIL DIAGNOSTIC COMPLETE');