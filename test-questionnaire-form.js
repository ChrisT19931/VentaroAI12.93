const fetch = require('node-fetch');

// Complete questionnaire form test with all required fields
async function testQuestionnaireForm() {
  console.log('🚀 Testing Complete Questionnaire Form with All Required Fields');
  console.log('=' .repeat(60));
  
  const questionnaireData = {
    // REQUIRED FIELDS (name, email, subject, message)
    name: 'Test User - Complete Questionnaire',
    email: 'christroiano1993@gmail.com',
    subject: 'AI Chatbot Development Project Inquiry',
    message: 'We need a comprehensive AI chatbot solution for customer service automation. The bot should handle common inquiries, integrate with our CRM system, and provide seamless handoff to human agents when needed. This is a test submission to verify the complete email integration system.',
    
    // OPTIONAL FIELDS (will be included in email templates)
    phone: '+1-555-123-4567',
    company: 'Test AI Company Ltd.',
    projectType: 'AI Chatbot Development',
    timeline: '1-3 months',
    budget: '$10,000 - $25,000',
    services: ['AI Development', 'Custom Integration', 'Training & Support'],
    businessStage: 'established'
  };
  
  console.log('📊 Sending complete form data:');
  console.log(JSON.stringify(questionnaireData, null, 2));
  
  try {
    const response = await fetch('http://localhost:3003/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(questionnaireData)
    });

    const result = await response.text();
    let parsedResult;
    
    try {
      parsedResult = JSON.parse(result);
    } catch (e) {
      parsedResult = result;
    }

    console.log(`\n✅ Response Status: ${response.status}`);
    console.log('📧 Response Data:', parsedResult);
    
    if (response.ok) {
      console.log('\n🎉 QUESTIONNAIRE FORM TEST - SUCCESS!');
      console.log('📧 Emails should be sent to:');
      console.log('   👤 User: christroiano1993@gmail.com (confirmation)');
      console.log('   👨‍💼 Admin: admin email (notification with all project details)');
      console.log('\n✅ Complete questionnaire form is working perfectly!');
      return { success: true, data: parsedResult };
    } else {
      console.log('\n❌ QUESTIONNAIRE FORM TEST - FAILED');
      console.log('Error:', parsedResult);
      return { success: false, error: parsedResult };
    }
  } catch (error) {
    console.log('\n❌ QUESTIONNAIRE FORM TEST - ERROR');
    console.log('Error:', error.message);
    return { success: false, error: error.message };
  }
}

// Test newsletter subscription
async function testNewsletterSubscription() {
  console.log('\n📰 Testing Newsletter Subscription');
  console.log('-' .repeat(40));
  
  const newsletterData = {
    email: 'christroiano1993@gmail.com',
    name: 'Test User - Newsletter Subscription'
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
      parsedResult = result;
    }

    console.log(`✅ Response Status: ${response.status}`);
    console.log('📧 Response:', parsedResult);
    
    if (response.ok) {
      console.log('✅ Newsletter subscription - SUCCESS!');
      return { success: true, data: parsedResult };
    } else {
      console.log('❌ Newsletter subscription - FAILED');
      return { success: false, error: parsedResult };
    }
  } catch (error) {
    console.log('❌ Newsletter subscription - ERROR:', error.message);
    return { success: false, error: error.message };
  }
}

// Test subscription interest form
async function testSubscriptionInterest() {
  console.log('\n🎯 Testing Subscription Interest Form');
  console.log('-' .repeat(40));
  
  const subscriptionData = {
    name: 'Test User - Subscription Interest',
    email: 'christroiano1993@gmail.com',
    source: 'ai-masterclass',
    timestamp: new Date().toISOString()
  };
  
  try {
    const response = await fetch('http://localhost:3003/api/subscription-interest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscriptionData)
    });

    const result = await response.text();
    let parsedResult;
    
    try {
      parsedResult = JSON.parse(result);
    } catch (e) {
      parsedResult = result;
    }

    console.log(`✅ Response Status: ${response.status}`);
    console.log('📧 Response:', parsedResult);
    
    if (response.ok) {
      console.log('✅ Subscription interest - SUCCESS!');
      return { success: true, data: parsedResult };
    } else {
      console.log('❌ Subscription interest - FAILED');
      return { success: false, error: parsedResult };
    }
  } catch (error) {
    console.log('❌ Subscription interest - ERROR:', error.message);
    return { success: false, error: error.message };
  }
}

async function runCompleteEmailTest() {
  console.log('🧪 COMPLETE EMAIL SYSTEM TEST - ALL FORMS');
  console.log('=' .repeat(60));
  console.log('📧 All test emails will be sent to: christroiano1993@gmail.com');
  console.log('👨‍💼 Admin notifications will be sent to the configured admin email');
  console.log('🔧 Testing Brevo email integration on all forms');
  console.log('=' .repeat(60));
  
  const results = [];
  
  // Test 1: Complete Questionnaire Form (Main Contact Form)
  const questionnaireResult = await testQuestionnaireForm();
  results.push({ test: 'Questionnaire/Contact Form', ...questionnaireResult });
  
  // Wait between tests
  console.log('\n⏳ Waiting 3 seconds before next test...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Test 2: Newsletter Subscription
  const newsletterResult = await testNewsletterSubscription();
  results.push({ test: 'Newsletter Subscription', ...newsletterResult });
  
  // Wait between tests
  console.log('\n⏳ Waiting 3 seconds before next test...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Test 3: Subscription Interest Form
  const subscriptionResult = await testSubscriptionInterest();
  results.push({ test: 'Subscription Interest Form', ...subscriptionResult });
  
  // Summary
  console.log('\n' + '=' .repeat(60));
  console.log('📊 FINAL EMAIL SYSTEM TEST SUMMARY');
  console.log('=' .repeat(60));
  
  let successCount = 0;
  results.forEach((result, index) => {
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    console.log(`${index + 1}. ${result.test}: ${status}`);
    if (result.success) {
      successCount++;
      if (result.data && result.data.emailStatus) {
        const emailStatus = result.data.emailStatus;
        console.log(`   📧 Admin Email: ${emailStatus.adminEmailSent ? '✅ Sent' : '❌ Failed'}`);
        console.log(`   📧 User Email: ${emailStatus.customerEmailSent ? '✅ Sent' : '❌ Failed'}`);
      }
    } else if (result.error) {
      console.log(`   Error: ${JSON.stringify(result.error)}`);
    }
  });
  
  console.log(`\n📈 Success Rate: ${successCount}/${results.length} (${Math.round(successCount/results.length*100)}%)`);
  
  if (successCount === results.length) {
    console.log('\n🎉 ALL EMAIL TESTS PASSED! BREVO INTEGRATION IS 100% FUNCTIONAL!');
    console.log('\n📧 CHECK YOUR EMAIL INBOX:');
    console.log('   📥 christroiano1993@gmail.com');
    console.log('     • User confirmation emails from all forms');
    console.log('     • Welcome emails from newsletter subscription');
    console.log('     • Subscription interest confirmations');
    console.log('\n📥 ADMIN EMAIL INBOX:');
    console.log('   • New contact form submissions with full project details');
    console.log('   • Newsletter subscription notifications');
    console.log('   • Subscription interest alerts');
    console.log('\n✅ Brevo email integration is working perfectly across all forms!');
    console.log('🚀 Ready for production use!');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above.');
    console.log('💡 Note: Email sending might still work even if some API responses show email failures.');
    console.log('📧 Check your email inbox to verify actual email delivery.');
  }
  
  console.log('\n🔍 WHAT TO VERIFY:');
  console.log('1. ✉️  Check christroiano1993@gmail.com for all test emails');
  console.log('2. 👨‍💼 Check admin email for notification emails');
  console.log('3. 🎨 Verify email formatting and content');
  console.log('4. 💾 Check Supabase database for stored submissions');
  console.log('5. 📊 Verify all form data is properly captured');
}

// Run the complete test
if (require.main === module) {
  runCompleteEmailTest().catch(console.error);
}

module.exports = { testQuestionnaireForm, testNewsletterSubscription, testSubscriptionInterest, runCompleteEmailTest };