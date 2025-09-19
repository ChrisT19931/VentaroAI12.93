/**
 * Comprehensive Form and Email System Test Script
 * Tests all subscription forms, contact forms, and email systems
 * Includes backup email system verification
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3006';

// Test data for forms
const testData = {
  contact: {
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Test Contact Form Submission',
    message: 'This is a test message from the automated form testing script.'
  },
  newsletter: {
    email: 'newsletter-test@example.com'
  },
  subscription: {
    name: 'Subscription Test User',
    email: 'subscription-test@example.com',
    source: 'ai-masterclass',
    timestamp: new Date().toISOString()
  },
  webDesign: {
    name: 'Web Design Test',
    email: 'webdesign-test@example.com',
    phone: '+1-555-123-4567',
    company: 'Test Company',
    projectType: 'New Website',
    budget: '$5,000 - $10,000',
    timeline: '2-3 months',
    description: 'Test web design inquiry from automated testing script.',
    features: ['Responsive Design', 'SEO Optimization'],
    currentWebsite: 'https://test-company.com',
    preferredContact: 'email'
  }
};

// API endpoints to test
const endpoints = {
  contact: '/api/contact',
  newsletter: '/api/newsletter/subscribe',
  subscriptionInterest: '/api/subscription-interest',
  webDesignInquiry: '/api/web-design-inquiry',
  backupEmails: '/api/backup-emails'
};

/**
 * Test helper function to make API requests
 */
async function testEndpoint(endpoint, data, method = 'POST') {
  try {
    console.log(`\n🧪 Testing ${endpoint}...`);
    
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: method === 'POST' ? JSON.stringify(data) : undefined
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log(`✅ ${endpoint}: SUCCESS`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Response:`, result);
      return { success: true, data: result };
    } else {
      console.log(`❌ ${endpoint}: FAILED`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Error:`, result);
      return { success: false, error: result };
    }
  } catch (error) {
    console.log(`💥 ${endpoint}: NETWORK ERROR`);
    console.log(`   Error:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Test contact form
 */
async function testContactForm() {
  console.log('\n📋 TESTING CONTACT FORM');
  console.log('=' .repeat(50));
  
  return await testEndpoint(endpoints.contact, testData.contact);
}

/**
 * Test newsletter subscription
 */
async function testNewsletterForm() {
  console.log('\n📧 TESTING NEWSLETTER SUBSCRIPTION');
  console.log('=' .repeat(50));
  
  return await testEndpoint(endpoints.newsletter, testData.newsletter);
}

/**
 * Test subscription interest form
 */
async function testSubscriptionInterest() {
  console.log('\n🎯 TESTING SUBSCRIPTION INTEREST');
  console.log('=' .repeat(50));
  
  return await testEndpoint(endpoints.subscriptionInterest, testData.subscription);
}

/**
 * Test web design inquiry form
 */
async function testWebDesignInquiry() {
  console.log('\n🎨 TESTING WEB DESIGN INQUIRY');
  console.log('=' .repeat(50));
  
  return await testEndpoint(endpoints.webDesignInquiry, testData.webDesign);
}

/**
 * Test backup email system
 */
async function testBackupEmailSystem() {
  console.log('\n🔄 TESTING BACKUP EMAIL SYSTEM');
  console.log('=' .repeat(50));
  
  // Test getting stats
  const statsResult = await testEndpoint(`${endpoints.backupEmails}?action=stats`, null, 'GET');
  
  // Test getting pending emails
  const pendingResult = await testEndpoint(`${endpoints.backupEmails}?action=pending&limit=10`, null, 'GET');
  
  // Test getting all emails
  const allEmailsResult = await testEndpoint(`${endpoints.backupEmails}?action=all&limit=20`, null, 'GET');
  
  return {
    stats: statsResult,
    pending: pendingResult,
    allEmails: allEmailsResult
  };
}

/**
 * Test email processing
 */
async function testEmailProcessing() {
  console.log('\n⚙️ TESTING EMAIL PROCESSING');
  console.log('=' .repeat(50));
  
  return await testEndpoint(endpoints.backupEmails, { action: 'process' });
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log('🚀 STARTING COMPREHENSIVE FORM AND EMAIL SYSTEM TESTS');
  console.log('=' .repeat(70));
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Test Time: ${new Date().toISOString()}`);
  
  const results = {
    contact: null,
    newsletter: null,
    subscriptionInterest: null,
    webDesignInquiry: null,
    backupEmailSystem: null,
    emailProcessing: null
  };
  
  try {
    // Test all form endpoints
    results.contact = await testContactForm();
    results.newsletter = await testNewsletterForm();
    results.subscriptionInterest = await testSubscriptionInterest();
    results.webDesignInquiry = await testWebDesignInquiry();
    
    // Test backup email system
    results.backupEmailSystem = await testBackupEmailSystem();
    results.emailProcessing = await testEmailProcessing();
    
    // Summary
    console.log('\n📊 TEST SUMMARY');
    console.log('=' .repeat(50));
    
    const successCount = Object.values(results).filter(result => {
      if (result && typeof result === 'object' && 'success' in result) {
        return result.success;
      }
      if (result && typeof result === 'object') {
        // For backup email system results
        return Object.values(result).every(subResult => subResult && subResult.success);
      }
      return false;
    }).length;
    
    const totalTests = Object.keys(results).length;
    
    console.log(`✅ Successful tests: ${successCount}/${totalTests}`);
    console.log(`❌ Failed tests: ${totalTests - successCount}/${totalTests}`);
    
    // Detailed results
    Object.entries(results).forEach(([testName, result]) => {
      if (result && typeof result === 'object' && 'success' in result) {
        console.log(`   ${testName}: ${result.success ? '✅' : '❌'}`);
      } else if (result && typeof result === 'object') {
        const allSuccess = Object.values(result).every(subResult => subResult && subResult.success);
        console.log(`   ${testName}: ${allSuccess ? '✅' : '❌'}`);
      } else {
        console.log(`   ${testName}: ❌`);
      }
    });
    
    console.log('\n🎉 ALL TESTS COMPLETED!');
    
    if (successCount === totalTests) {
      console.log('🌟 All systems are working correctly!');
    } else {
      console.log('⚠️  Some systems need attention. Check the logs above.');
    }
    
  } catch (error) {
    console.error('💥 CRITICAL ERROR during testing:', error);
  }
}

/**
 * Test specific form by name
 */
async function testSpecificForm(formName) {
  console.log(`🎯 TESTING SPECIFIC FORM: ${formName.toUpperCase()}`);
  console.log('=' .repeat(50));
  
  switch (formName.toLowerCase()) {
    case 'contact':
      return await testContactForm();
    case 'newsletter':
      return await testNewsletterForm();
    case 'subscription':
      return await testSubscriptionInterest();
    case 'webdesign':
      return await testWebDesignInquiry();
    case 'backup':
      return await testBackupEmailSystem();
    default:
      console.log(`❌ Unknown form: ${formName}`);
      console.log('Available forms: contact, newsletter, subscription, webdesign, backup');
      return { success: false, error: 'Unknown form' };
  }
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runAllTests,
    testSpecificForm,
    testContactForm,
    testNewsletterForm,
    testSubscriptionInterest,
    testWebDesignInquiry,
    testBackupEmailSystem,
    testEmailProcessing
  };
}

// Run tests if script is executed directly
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length > 0) {
    // Test specific form
    testSpecificForm(args[0]);
  } else {
    // Run all tests
    runAllTests();
  }
}