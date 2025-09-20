const fetch = require('node-fetch');

// Direct email test to check configuration and send actual emails
async function testEmailConfiguration() {
  console.log('🔧 TESTING EMAIL CONFIGURATION');
  console.log('=' .repeat(50));
  
  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log('BREVO_API_KEY:', process.env.BREVO_API_KEY ? (process.env.BREVO_API_KEY.startsWith('xkeysib-') ? '❌ PLACEHOLDER' : '✅ SET') : '❌ MISSING');
  console.log('BREVO_FROM_EMAIL:', process.env.BREVO_FROM_EMAIL || '❌ MISSING');
  console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? (process.env.SENDGRID_API_KEY.startsWith('SG.placeholder') ? '❌ PLACEHOLDER' : '✅ SET') : '❌ MISSING');
  console.log('EMAIL_FROM:', process.env.EMAIL_FROM || '❌ MISSING');
  
  console.log('\n🧪 TESTING CONTACT FORM WITH ACTUAL EMAIL SENDING');
  console.log('-' .repeat(50));
  
  const testData = {
    name: 'Test User - Email Configuration Check',
    email: 'christroiano1993@gmail.com',
    subject: 'URGENT: Email System Test - Please Confirm Receipt',
    message: `This is a test email to verify the Brevo email integration is working correctly.
    
    Test Details:
    - Timestamp: ${new Date().toISOString()}
    - Purpose: Verify email templates and delivery
    - Expected: You should receive this email at christroiano1993@gmail.com
    - Admin should also receive a notification
    
    If you receive this email, the system is working!
    
    Please reply to confirm receipt so we can proceed with git updates.`
  };
  
  try {
    console.log('📤 Sending test email via contact form...');
    console.log('📧 To:', testData.email);
    console.log('📝 Subject:', testData.subject);
    
    const response = await fetch('http://localhost:3003/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.text();
    let parsedResult;
    
    try {
      parsedResult = JSON.parse(result);
    } catch (e) {
      parsedResult = { raw: result };
    }

    console.log('\n📊 RESPONSE:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(parsedResult, null, 2));
    
    if (response.ok) {
      console.log('\n✅ CONTACT FORM SUBMISSION - SUCCESS!');
      
      if (parsedResult.emailStatus) {
        console.log('\n📧 EMAIL STATUS:');
        console.log('Admin Email Sent:', parsedResult.emailStatus.adminEmailSent ? '✅ YES' : '❌ NO');
        console.log('User Email Sent:', parsedResult.emailStatus.customerEmailSent ? '✅ YES' : '❌ NO');
        
        if (parsedResult.emailStatus.adminEmailSent && parsedResult.emailStatus.customerEmailSent) {
          console.log('\n🎉 BOTH EMAILS SENT SUCCESSFULLY!');
          console.log('📥 CHECK YOUR INBOX: christroiano1993@gmail.com');
          console.log('📥 CHECK ADMIN INBOX: chris.t@ventarosales.com');
        } else {
          console.log('\n⚠️  PARTIAL EMAIL SUCCESS - Some emails may not have been sent');
          console.log('💡 This could be due to API key configuration issues');
        }
      } else {
        console.log('\n⚠️  NO EMAIL STATUS IN RESPONSE');
        console.log('💡 The form submitted but email status is unclear');
      }
      
      return { success: true, data: parsedResult };
    } else {
      console.log('\n❌ CONTACT FORM SUBMISSION - FAILED');
      console.log('Error:', parsedResult);
      return { success: false, error: parsedResult };
    }
  } catch (error) {
    console.log('\n❌ CONTACT FORM TEST - ERROR');
    console.log('Error:', error.message);
    return { success: false, error: error.message };
  }
}

// Test newsletter subscription as well
async function testNewsletterEmail() {
  console.log('\n📰 TESTING NEWSLETTER SUBSCRIPTION EMAIL');
  console.log('-' .repeat(50));
  
  const newsletterData = {
    email: 'christroiano1993@gmail.com',
    name: 'Test User - Newsletter Email Check'
  };
  
  try {
    const response = await fetch('http://localhost:3003/api/newsletter/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newsletterData)
    });

    const result = await response.text();
    let parsedResult;
    
    try {
      parsedResult = JSON.parse(result);
    } catch (e) {
      parsedResult = { raw: result };
    }

    console.log('📊 Newsletter Response:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(parsedResult, null, 2));
    
    if (response.ok) {
      console.log('✅ Newsletter subscription - SUCCESS!');
      return { success: true, data: parsedResult };
    } else {
      console.log('❌ Newsletter subscription - FAILED');
      return { success: false, error: parsedResult };
    }
  } catch (error) {
    console.log('❌ Newsletter test - ERROR:', error.message);
    return { success: false, error: error.message };
  }
}

async function runEmailConfigurationTest() {
  console.log('🚀 COMPREHENSIVE EMAIL CONFIGURATION TEST');
  console.log('=' .repeat(60));
  console.log('🎯 Goal: Send actual emails to christroiano1993@gmail.com');
  console.log('📧 This will test both user and admin email delivery');
  console.log('🔧 We will identify any configuration issues');
  console.log('=' .repeat(60));
  
  // Test 1: Contact Form Email
  const contactResult = await testEmailConfiguration();
  
  // Wait between tests
  console.log('\n⏳ Waiting 3 seconds before newsletter test...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Test 2: Newsletter Email
  const newsletterResult = await testNewsletterEmail();
  
  // Summary
  console.log('\n' + '=' .repeat(60));
  console.log('📊 EMAIL CONFIGURATION TEST SUMMARY');
  console.log('=' .repeat(60));
  
  console.log('1. Contact Form Email:', contactResult.success ? '✅ SUCCESS' : '❌ FAILED');
  console.log('2. Newsletter Email:', newsletterResult.success ? '✅ SUCCESS' : '❌ FAILED');
  
  if (contactResult.success && newsletterResult.success) {
    console.log('\n🎉 ALL EMAIL TESTS PASSED!');
    console.log('\n📧 WHAT TO CHECK NOW:');
    console.log('1. 📥 Check christroiano1993@gmail.com inbox');
    console.log('2. 📥 Check chris.t@ventarosales.com inbox (admin notifications)');
    console.log('3. 🎨 Verify email templates look good');
    console.log('4. 📝 Reply to confirm you received the emails');
    console.log('\n✅ If emails arrived, we can proceed with git updates!');
  } else {
    console.log('\n⚠️  SOME EMAIL TESTS FAILED');
    console.log('\n🔧 TROUBLESHOOTING STEPS:');
    console.log('1. Check if BREVO_API_KEY is set to a real API key (not placeholder)');
    console.log('2. Verify SENDGRID_API_KEY as backup (not placeholder)');
    console.log('3. Check server logs for detailed error messages');
    console.log('4. Ensure email addresses are verified in your email service');
    
    if (!contactResult.success) {
      console.log('\n❌ Contact Form Issues:');
      console.log('   Error:', JSON.stringify(contactResult.error));
    }
    
    if (!newsletterResult.success) {
      console.log('\n❌ Newsletter Issues:');
      console.log('   Error:', JSON.stringify(newsletterResult.error));
    }
  }
  
  console.log('\n🔍 NEXT STEPS:');
  console.log('1. If emails work: Confirm receipt and we\'ll push to git');
  console.log('2. If emails fail: Fix API keys and test again');
  console.log('3. Check email templates and formatting');
  console.log('4. Verify all form integrations are working');
}

// Run the test
if (require.main === module) {
  runEmailConfigurationTest().catch(console.error);
}

module.exports = { testEmailConfiguration, testNewsletterEmail, runEmailConfigurationTest };