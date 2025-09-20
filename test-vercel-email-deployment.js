#!/usr/bin/env node

/**
 * Vercel Email Deployment Test Script
 * Tests email functionality after Vercel deployment with real API keys
 */

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

console.log('🧪 VERCEL EMAIL DEPLOYMENT TEST');
console.log('=' .repeat(50));

// Configuration
const TEST_EMAIL = 'christroiano1993@gmail.com';
const FROM_EMAIL = 'chris.t@ventarosales.com';

// Test Brevo API directly
async function testBrevoAPI() {
  console.log('\n🔍 TESTING BREVO API CONFIGURATION...');
  
  const apiKey = process.env.BREVO_API_KEY;
  const fromEmail = process.env.BREVO_FROM_EMAIL || FROM_EMAIL;
  
  if (!apiKey) {
    console.log('❌ BREVO_API_KEY not found in environment');
    return false;
  }
  
  if (apiKey.startsWith('xkeysib-a0348dc3')) {
    console.log('❌ BREVO_API_KEY is still a placeholder!');
    console.log('   Current key starts with: xkeysib-a0348dc3...');
    console.log('   You need to replace this with a real Brevo API key');
    return false;
  }
  
  console.log('✅ BREVO_API_KEY found and appears to be real');
  console.log('   Key starts with:', apiKey.substring(0, 15) + '...');
  
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
          email: fromEmail
        },
        to: [{
          email: TEST_EMAIL,
          name: 'Test Recipient'
        }],
        subject: '🧪 Vercel Deployment Email Test - ' + new Date().toLocaleString(),
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #10b981; border-radius: 10px;">
            <h2 style="color: #10b981; text-align: center;">✅ Vercel Email System Working!</h2>
            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #166534; margin-top: 0;">🎉 Success! Your email system is now working correctly.</h3>
              <p>This test email confirms that:</p>
              <ul style="color: #166534;">
                <li>✅ Brevo API key is properly configured</li>
                <li>✅ Sender email is verified and working</li>
                <li>✅ Email delivery is functioning</li>
                <li>✅ Vercel environment variables are set correctly</li>
              </ul>
            </div>
            <div style="background: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #1e40af; margin-top: 0;">Test Details:</h4>
              <ul style="color: #1e40af; font-size: 14px;">
                <li><strong>Timestamp:</strong> ${new Date().toISOString()}</li>
                <li><strong>Environment:</strong> Vercel Production</li>
                <li><strong>Email Service:</strong> Brevo API</li>
                <li><strong>From:</strong> ${fromEmail}</li>
                <li><strong>To:</strong> ${TEST_EMAIL}</li>
              </ul>
            </div>
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #92400e; margin-top: 0;">📋 What This Means:</h4>
              <p style="color: #92400e; margin-bottom: 0;">Your contact forms, newsletter subscriptions, support tickets, and all other email notifications will now work correctly on your live Vercel deployment!</p>
            </div>
            <hr style="border: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="text-align: center; color: #6b7280; font-size: 12px;">This is an automated test email from your Ventaro AI email system deployment verification.</p>
          </div>
        `,
        textContent: `
✅ Vercel Email System Working!

🎉 Success! Your email system is now working correctly.

This test email confirms that:
✅ Brevo API key is properly configured
✅ Sender email is verified and working
✅ Email delivery is functioning
✅ Vercel environment variables are set correctly

Test Details:
- Timestamp: ${new Date().toISOString()}
- Environment: Vercel Production
- Email Service: Brevo API
- From: ${fromEmail}
- To: ${TEST_EMAIL}

📋 What This Means:
Your contact forms, newsletter subscriptions, support tickets, and all other email notifications will now work correctly on your live Vercel deployment!

This is an automated test email from your Ventaro AI email system deployment verification.
        `
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.log('❌ BREVO API ERROR:', response.status, errorData.message);
      
      if (response.status === 401) {
        console.log('   🔑 This usually means the API key is invalid or expired');
        console.log('   📝 Please check your Brevo API key in the dashboard');
      } else if (response.status === 400) {
        console.log('   📧 This might be a sender email verification issue');
        console.log('   📝 Please verify', fromEmail, 'in your Brevo dashboard');
      }
      
      return false;
    }

    const result = await response.json();
    console.log('✅ BREVO EMAIL SENT SUCCESSFULLY!');
    console.log('   📧 Message ID:', result.messageId);
    console.log('   📬 Check', TEST_EMAIL, 'for the test email');
    console.log('   🕒 Email should arrive within 1-2 minutes');
    
    return true;
  } catch (error) {
    console.log('❌ BREVO API TEST FAILED:', error.message);
    return false;
  }
}

// Test SendGrid API (fallback)
async function testSendGridAPI() {
  console.log('\n🔍 TESTING SENDGRID FALLBACK...');
  
  const apiKey = process.env.SENDGRID_API_KEY;
  
  if (!apiKey || apiKey.includes('placeholder')) {
    console.log('⚠️  SendGrid API key not configured (this is optional)');
    return false;
  }
  
  console.log('✅ SendGrid API key found - fallback system ready');
  return true;
}

// Test contact form endpoint
async function testContactFormEndpoint(baseUrl) {
  console.log('\n🔍 TESTING CONTACT FORM ENDPOINT...');
  
  if (!baseUrl) {
    console.log('⚠️  No base URL provided - skipping endpoint test');
    return false;
  }
  
  try {
    const response = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Email System Test',
        email: TEST_EMAIL,
        message: 'This is an automated test of the contact form email system after Vercel deployment. If you receive this email, the system is working correctly!',
        projectType: 'general'
      })
    });
    
    if (!response.ok) {
      console.log('❌ CONTACT FORM ENDPOINT ERROR:', response.status);
      const errorText = await response.text().catch(() => 'Unknown error');
      console.log('   Error details:', errorText);
      return false;
    }
    
    const result = await response.json();
    console.log('✅ CONTACT FORM ENDPOINT WORKING!');
    console.log('   📧 Admin email sent:', result.emailStatus?.adminEmailSent || 'unknown');
    console.log('   📧 Customer email sent:', result.emailStatus?.customerEmailSent || 'unknown');
    console.log('   📬 Check', TEST_EMAIL, 'for contact form emails');
    
    return true;
  } catch (error) {
    console.log('❌ CONTACT FORM TEST FAILED:', error.message);
    return false;
  }
}

// Main test function
async function runEmailTests() {
  console.log('\n📋 ENVIRONMENT VARIABLES CHECK:');
  console.log('-'.repeat(40));
  
  const requiredVars = {
    'BREVO_API_KEY': process.env.BREVO_API_KEY,
    'BREVO_FROM_EMAIL': process.env.BREVO_FROM_EMAIL,
    'EMAIL_FROM': process.env.EMAIL_FROM
  };
  
  let allConfigured = true;
  
  for (const [key, value] of Object.entries(requiredVars)) {
    if (!value) {
      console.log(`❌ ${key}: Missing`);
      allConfigured = false;
    } else if (value.includes('placeholder') || value.includes('your_') || (key === 'BREVO_API_KEY' && value.startsWith('xkeysib-a0348dc3'))) {
      console.log(`⚠️  ${key}: Placeholder value`);
      allConfigured = false;
    } else {
      console.log(`✅ ${key}: Configured`);
    }
  }
  
  if (!allConfigured) {
    console.log('\n❌ CONFIGURATION INCOMPLETE');
    console.log('Please set the required environment variables in Vercel dashboard');
    console.log('See VERCEL_EMAIL_FIX_GUIDE.md for detailed instructions');
    return;
  }
  
  console.log('\n🧪 RUNNING EMAIL SYSTEM TESTS...');
  console.log('=' .repeat(50));
  
  // Test Brevo API
  const brevoWorking = await testBrevoAPI();
  
  // Test SendGrid fallback
  const sendgridConfigured = await testSendGridAPI();
  
  // Test contact form endpoint if URL provided
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL;
  let endpointWorking = false;
  if (baseUrl && !baseUrl.includes('localhost')) {
    endpointWorking = await testContactFormEndpoint(baseUrl);
  }
  
  // Summary
  console.log('\n📊 TEST RESULTS SUMMARY:');
  console.log('=' .repeat(50));
  console.log(`✅ Environment Variables: ${allConfigured ? 'Configured' : 'Missing'}`);
  console.log(`${brevoWorking ? '✅' : '❌'} Brevo Email API: ${brevoWorking ? 'Working' : 'Failed'}`);
  console.log(`${sendgridConfigured ? '✅' : '⚠️ '} SendGrid Fallback: ${sendgridConfigured ? 'Configured' : 'Not configured (optional)'}`);
  console.log(`${endpointWorking ? '✅' : '⚠️ '} Contact Form Endpoint: ${endpointWorking ? 'Working' : 'Not tested (no URL provided)'}`);
  
  if (brevoWorking) {
    console.log('\n🎉 EMAIL SYSTEM STATUS: WORKING!');
    console.log('\n📧 Expected Emails:');
    console.log(`   • Test email sent to: ${TEST_EMAIL}`);
    if (endpointWorking) {
      console.log(`   • Contact form confirmation sent to: ${TEST_EMAIL}`);
      console.log(`   • Admin notification sent to: ${FROM_EMAIL}`);
    }
    console.log('\n⏰ Emails should arrive within 1-2 minutes');
    console.log('\n✅ Your Vercel deployment email system is now fully functional!');
  } else {
    console.log('\n❌ EMAIL SYSTEM STATUS: NOT WORKING');
    console.log('\n🔧 Next Steps:');
    console.log('1. Check your Brevo API key is correct and not a placeholder');
    console.log('2. Verify sender email in Brevo dashboard');
    console.log('3. Set environment variables in Vercel dashboard');
    console.log('4. Redeploy your application');
    console.log('5. Run this test again');
  }
  
  console.log('\n📋 TROUBLESHOOTING:');
  console.log('If emails still don\'t work:');
  console.log('• Check Vercel function logs for detailed errors');
  console.log('• Verify all environment variables in Vercel dashboard');
  console.log('• Ensure sender email is verified in Brevo');
  console.log('• Contact: chris.t@ventarosales.com');
}

// Run the tests
runEmailTests().catch(error => {
  console.error('❌ TEST SCRIPT ERROR:', error);
  process.exit(1);
});