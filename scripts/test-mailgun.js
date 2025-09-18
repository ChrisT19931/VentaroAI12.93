#!/usr/bin/env node

// Test Mailgun email service integration
// This script tests the Mailgun API directly

require('dotenv').config({ path: '.env.local' });

async function testMailgun() {
  console.log('🔧 Testing Mailgun Integration...');
  console.log('=================================');
  
  // Check environment variables
  const hasMailgunKey = process.env.MAILGUN_API_KEY && process.env.MAILGUN_API_KEY !== 'your_mailgun_api_key_here';
  const hasMailgunDomain = process.env.MAILGUN_DOMAIN && process.env.MAILGUN_DOMAIN !== 'your_mailgun_domain.com';
  
  console.log('📋 Mailgun Configuration:');
  console.log(`   API Key: ${hasMailgunKey ? '✅ Set' : '❌ Missing/Default'}`);
  console.log(`   Domain: ${hasMailgunDomain ? '✅ Set (' + process.env.MAILGUN_DOMAIN + ')' : '❌ Missing/Default'}`);
  console.log('');
  
  if (!hasMailgunKey || !hasMailgunDomain) {
    console.log('❌ Mailgun not properly configured!');
    console.log('Please update your .env.local file:');
    console.log('MAILGUN_API_KEY=your_actual_mailgun_api_key');
    console.log('MAILGUN_DOMAIN=your_mailgun_domain.com');
    console.log('');
    console.log('Get your credentials at: https://app.mailgun.com/app/domains');
    return;
  }
  
  try {
    console.log('📧 Sending test email via Mailgun...');
    
    // Prepare form data
    const formData = new FormData();
    formData.append('from', 'VAI35 Test <noreply@' + process.env.MAILGUN_DOMAIN + '>');
    formData.append('to', 'test@example.com'); // Change this to your email for real testing
    formData.append('subject', '🧪 VAI35 Mailgun Test Email');
    formData.append('html', `
      <h2>✅ Mailgun Integration Test Successful!</h2>
      <p>Your VAI35 Mailgun integration is working correctly.</p>
      <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      <p><strong>Domain:</strong> ${process.env.MAILGUN_DOMAIN}</p>
      <p><strong>Service:</strong> Mailgun API</p>
      <hr>
      <p><em>This is an automated test email from your VAI35 application.</em></p>
    `);
    formData.append('text', `
✅ Mailgun Integration Test Successful!

Your VAI35 Mailgun integration is working correctly.

Timestamp: ${new Date().toISOString()}
Domain: ${process.env.MAILGUN_DOMAIN}
Service: Mailgun API

---
This is an automated test email from your VAI35 application.
    `);
    
    // Send email via Mailgun API
    const response = await fetch(
      `https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString('base64')}`
        },
        body: formData
      }
    );
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ MAILGUN: Email sent successfully!');
      console.log('📧 Message ID:', result.id);
      console.log('📬 Message:', result.message);
      
      console.log('');
      console.log('🎉 SUCCESS! Mailgun is working correctly!');
      console.log('Your three-tier email system now has Mailgun as tertiary backup.');
    } else {
      const errorText = await response.text();
      console.log('❌ MAILGUN: Failed to send email');
      console.log('Status:', response.status, response.statusText);
      console.log('Error:', errorText);
      
      console.log('');
      console.log('❌ FAILED! Check the error above.');
      console.log('Common issues:');
      console.log('- Invalid API key');
      console.log('- Incorrect domain name');
      console.log('- Domain not verified in Mailgun');
      console.log('- Sandbox domain restrictions (upgrade to send to external emails)');
    }
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.log('');
    console.log('💡 Common issues:');
    console.log('- Network connectivity problems');
    console.log('- Invalid Mailgun credentials');
    console.log('- Firewall blocking Mailgun API');
    console.log('- Missing fetch polyfill (should be available in Node 18+)');
  }
}

// Run the test
testMailgun().catch(console.error);