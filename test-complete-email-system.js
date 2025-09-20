const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:3003',
  testEmail: 'christroiano1993@gmail.com',
  adminEmail: process.env.BREVO_FROM_EMAIL || 'admin@ventaro.ai'
};

// Test data for different forms
const TEST_DATA = {
  questionnaire: {
    name: 'Test User - Questionnaire',
    email: 'christroiano1993@gmail.com',
    company: 'Test Company',
    projectType: 'AI Chatbot Development',
    timeline: '1-3 months',
    budget: '$10,000 - $25,000',
    services: ['AI Development', 'Custom Integration'],
    description: 'This is a test submission from the questionnaire form to verify Brevo email integration is working correctly.',
    phone: '+1234567890'
  },
  contact: {
    name: 'Test User - Contact Form',
    email: 'christroiano1993@gmail.com',
    subject: 'Test Contact Form Submission',
    message: 'This is a test message from the contact form to verify email integration.'
  },
  subscribe: {
    email: 'christroiano1993@gmail.com',
    name: 'Test User - Newsletter'
  }
};

async function testAPI(endpoint, data, description) {
  console.log(`\n🧪 Testing ${description}...`);
  console.log(`📍 Endpoint: ${endpoint}`);
  console.log(`📊 Data:`, JSON.stringify(data, null, 2));
  
  try {
    const response = await fetch(`${TEST_CONFIG.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    const result = await response.text();
    let parsedResult;
    
    try {
      parsedResult = JSON.parse(result);
    } catch (e) {
      parsedResult = result;
    }

    console.log(`✅ Status: ${response.status}`);
    console.log(`📧 Response:`, parsedResult);
    
    if (response.ok) {
      console.log(`✅ ${description} - SUCCESS`);
      return { success: true, data: parsedResult };
    } else {
      console.log(`❌ ${description} - FAILED`);
      return { success: false, error: parsedResult };
    }
  } catch (error) {
    console.log(`❌ ${description} - ERROR:`, error.message);
    return { success: false, error: error.message };
  }
}

async function runEmailSystemTests() {
  console.log('🚀 Starting Complete Email System Test');
  console.log('=' .repeat(60));
  console.log(`📧 Test emails will be sent to: ${TEST_CONFIG.testEmail}`);
  console.log(`👨‍💼 Admin emails will be sent to: ${TEST_CONFIG.adminEmail}`);
  console.log('=' .repeat(60));

  const results = [];

  // Test 1: Questionnaire/Contact Form (Main form)
  console.log('\n📋 TEST 1: QUESTIONNAIRE/CONTACT FORM');
  console.log('-' .repeat(40));
  const questionnaireResult = await testAPI(
    '/api/contact',
    TEST_DATA.questionnaire,
    'Questionnaire Form (Main Contact Form)'
  );
  results.push({ test: 'Questionnaire Form', ...questionnaireResult });

  // Wait between tests
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 2: Simple Contact Form
  console.log('\n📞 TEST 2: SIMPLE CONTACT FORM');
  console.log('-' .repeat(40));
  const contactResult = await testAPI(
    '/api/contact',
    TEST_DATA.contact,
    'Simple Contact Form'
  );
  results.push({ test: 'Contact Form', ...contactResult });

  // Wait between tests
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 3: Newsletter Subscription
  console.log('\n📰 TEST 3: NEWSLETTER SUBSCRIPTION');
  console.log('-' .repeat(40));
  const subscribeResult = await testAPI(
    '/api/newsletter/subscribe',
    TEST_DATA.subscribe,
    'Newsletter Subscription'
  );
  results.push({ test: 'Newsletter Subscription', ...subscribeResult });

  // Test 4: Check for other email endpoints
  console.log('\n🔍 TEST 4: CHECKING FOR OTHER EMAIL ENDPOINTS');
  console.log('-' .repeat(40));
  
  const otherEndpoints = [
    '/api/coaching-booking',
    '/api/subscription-interest',
    '/api/newsletter/test'
  ];

  for (const endpoint of otherEndpoints) {
    console.log(`\n🔍 Checking endpoint: ${endpoint}`);
    try {
      const response = await fetch(`${TEST_CONFIG.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true })
      });
      
      if (response.status !== 404) {
        console.log(`✅ Endpoint ${endpoint} exists (Status: ${response.status})`);
        // Test with appropriate data if endpoint exists
        if (endpoint === '/api/coaching-booking') {
          const coachingResult = await testAPI(
            endpoint,
            {
              name: 'Test User - Coaching',
              email: 'christroiano1993@gmail.com',
              phone: '+1234567890',
              business_stage: 'startup',
              main_challenge: 'AI implementation strategy',
              goals: 'Implement AI solutions to improve business efficiency',
              preferred_date_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              additional_notes: 'Test coaching booking request'
            },
            'Coaching Booking Form'
          );
          results.push({ test: 'Coaching Booking Form', ...coachingResult });
        } else if (endpoint === '/api/subscription-interest') {
          const subscriptionInterestResult = await testAPI(
            endpoint,
            {
              name: 'Test User - Subscription Interest',
              email: 'christroiano1993@gmail.com',
              source: 'ai-masterclass',
              timestamp: new Date().toISOString()
            },
            'Subscription Interest Form'
          );
          results.push({ test: 'Subscription Interest Form', ...subscriptionInterestResult });
        }
      } else {
        console.log(`ℹ️  Endpoint ${endpoint} not found (404)`);
      }
    } catch (error) {
      console.log(`ℹ️  Endpoint ${endpoint} not accessible:`, error.message);
    }
  }

  // Summary
  console.log('\n' + '=' .repeat(60));
  console.log('📊 EMAIL SYSTEM TEST SUMMARY');
  console.log('=' .repeat(60));
  
  let successCount = 0;
  let totalTests = results.length;
  
  results.forEach((result, index) => {
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    console.log(`${index + 1}. ${result.test}: ${status}`);
    if (result.success) successCount++;
    if (!result.success && result.error) {
      console.log(`   Error: ${JSON.stringify(result.error)}`);
    }
  });
  
  console.log('\n' + '-' .repeat(60));
  console.log(`📈 Success Rate: ${successCount}/${totalTests} (${Math.round(successCount/totalTests*100)}%)`);
  
  if (successCount === totalTests) {
    console.log('\n🎉 ALL EMAIL TESTS PASSED!');
    console.log('📧 Check your email inbox for test messages.');
    console.log('👨‍💼 Check admin email for notifications.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.');
  }
  
  console.log('\n📋 WHAT TO CHECK:');
  console.log('1. Check christroiano1993@gmail.com for user confirmation emails');
  console.log('2. Check admin email for notification emails');
  console.log('3. Verify email content and formatting');
  console.log('4. Check Supabase database for stored submissions');
  console.log('\n✅ Email system testing complete!');
}

// Run the tests
if (require.main === module) {
  runEmailSystemTests().catch(console.error);
}

module.exports = { runEmailSystemTests, testAPI, TEST_DATA };