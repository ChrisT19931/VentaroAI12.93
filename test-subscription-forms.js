require('dotenv').config({ path: '.env.local' });

async function testSubscriptionForms() {
  console.log('🧪 Testing Subscription Forms and Email System...');
  console.log('=' .repeat(60));

  // Check environment variables
  console.log('📋 Environment Variables Check:');
  console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? 'SET' : 'NOT SET');
  console.log('EMAIL_FROM:', process.env.EMAIL_FROM || 'NOT SET');
  console.log('NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL || 'NOT SET');
  console.log('');

  // Test subscription interest API
  try {
    console.log('📤 Testing subscription interest API...');
    const response = await fetch('http://localhost:3001/api/subscription-interest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'Test User',
        source: 'ai-masterclass',
        timestamp: new Date().toISOString()
      })
    });

    const result = await response.json();
    console.log('API Response Status:', response.status);
    console.log('API Response:', result);

    if (response.ok) {
      console.log('✅ Subscription API working!');
    } else {
      console.log('❌ Subscription API failed:', result);
    }
  } catch (error) {
    console.log('❌ Subscription API error:', error.message);
  }

  console.log('');

  // Test contact form API
  try {
    console.log('📤 Testing contact form API...');
    const contactResponse = await fetch('http://localhost:3001/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Contact',
        message: 'Testing contact form functionality',
        services: ['AI Tools Mastery Guide']
      })
    });

    const contactResult = await contactResponse.json();
    console.log('Contact API Response Status:', contactResponse.status);
    console.log('Contact API Response:', contactResult);

    if (contactResponse.ok) {
      console.log('✅ Contact API working!');
    } else {
      console.log('❌ Contact API failed:', contactResult);
    }
  } catch (error) {
    console.log('❌ Contact API error:', error.message);
  }

  console.log('');
  console.log('🎯 Summary:');
  console.log('- Check if SendGrid API key is properly configured');
  console.log('- Verify EMAIL_FROM is set to chris.t@ventarosales.com');
  console.log('- Ensure server is running on localhost:3001');
  console.log('- Test forms on actual website for full functionality');
}

testSubscriptionForms().catch(console.error);