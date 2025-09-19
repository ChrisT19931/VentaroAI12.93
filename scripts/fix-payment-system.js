#!/usr/bin/env node

/**
 * CRITICAL PAYMENT SYSTEM FIX
 * This script helps diagnose and fix payment/account storage issues
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

console.log('🚨 CRITICAL PAYMENT SYSTEM DIAGNOSTIC');
console.log('=====================================\n');

// Check environment variables
function checkEnvVars() {
  console.log('📋 CHECKING CONFIGURATION...');
  
  const checks = [
    {
      name: 'Supabase URL',
      key: 'NEXT_PUBLIC_SUPABASE_URL',
      value: process.env.NEXT_PUBLIC_SUPABASE_URL,
      isPlaceholder: (val) => !val || val.includes('placeholder') || val.includes('your-project')
    },
    {
      name: 'Supabase Service Key',
      key: 'SUPABASE_SERVICE_ROLE_KEY',
      value: process.env.SUPABASE_SERVICE_ROLE_KEY,
      isPlaceholder: (val) => !val || val.includes('placeholder') || val.length < 100
    },
    {
      name: 'Stripe Secret Key',
      key: 'STRIPE_SECRET_KEY',
      value: process.env.STRIPE_SECRET_KEY,
      isPlaceholder: (val) => !val || val.includes('your_stripe') || val.includes('sk_test_your')
    },
    {
      name: 'Stripe Webhook Secret',
      key: 'STRIPE_WEBHOOK_SECRET',
      value: process.env.STRIPE_WEBHOOK_SECRET,
      isPlaceholder: (val) => !val || val.includes('whsec_your') || val.includes('your_stripe')
    },
    {
      name: 'SendGrid API Key',
      key: 'SENDGRID_API_KEY',
      value: process.env.SENDGRID_API_KEY,
      isPlaceholder: (val) => !val || val.includes('your_sendgrid') || !val.startsWith('SG.')
    }
  ];

  let criticalIssues = 0;
  let warnings = 0;

  checks.forEach(check => {
    const isPlaceholder = check.isPlaceholder(check.value);
    const status = isPlaceholder ? '❌ PLACEHOLDER' : '✅ CONFIGURED';
    const severity = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'].includes(check.key) ? 'CRITICAL' : 'WARNING';
    
    console.log(`${status} ${check.name} (${check.key})`);
    
    if (isPlaceholder) {
      if (severity === 'CRITICAL') {
        criticalIssues++;
        console.log(`   🚨 ${severity}: This MUST be configured for payments to work`);
      } else {
        warnings++;
        console.log(`   ⚠️  ${severity}: Recommended for full functionality`);
      }
    }
  });

  console.log(`\n📊 SUMMARY:`);
  console.log(`   Critical Issues: ${criticalIssues}`);
  console.log(`   Warnings: ${warnings}`);
  
  return { criticalIssues, warnings };
}

// Test database connection
async function testDatabase() {
  console.log('\n🔧 TESTING DATABASE CONNECTION...');
  
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase
      .from('purchases')
      .select('count')
      .limit(1);

    if (error) {
      console.log('❌ Database connection failed:', error.message);
      return false;
    } else {
      console.log('✅ Database connection successful');
      return true;
    }
  } catch (e) {
    console.log('❌ Database connection error:', e.message);
    return false;
  }
}

// Generate setup instructions
function generateSetupInstructions(issues) {
  console.log('\n📋 SETUP INSTRUCTIONS:');
  console.log('======================');
  
  if (issues.criticalIssues > 0) {
    console.log('\n🚨 CRITICAL FIXES REQUIRED:');
    console.log('\n1. SUPABASE SETUP:');
    console.log('   - Go to https://supabase.com/dashboard');
    console.log('   - Create/select your project');
    console.log('   - Go to Settings → API');
    console.log('   - Copy URL and Service Role Key to .env.local');
    
    console.log('\n2. STRIPE SETUP:');
    console.log('   - Go to https://dashboard.stripe.com');
    console.log('   - Get API keys from Developers → API keys');
    console.log('   - Set up webhook: https://yourdomain.com/api/webhook/stripe');
    console.log('   - Copy webhook secret to .env.local');
    
    console.log('\n3. AFTER FIXING:');
    console.log('   - Run: node scripts/setup-database-tables.js');
    console.log('   - Run: node scripts/fix-payment-system.js');
    console.log('   - Test a purchase');
  } else {
    console.log('✅ All critical components configured!');
  }
  
  if (issues.warnings > 0) {
    console.log('\n⚠️  RECOMMENDED FIXES:');
    console.log('   - Configure SendGrid for email notifications');
    console.log('   - Set up proper domain for production');
  }
}

// Main execution
async function main() {
  const issues = checkEnvVars();
  
  if (issues.criticalIssues === 0) {
    const dbConnected = await testDatabase();
    
    if (dbConnected) {
      console.log('\n🎉 PAYMENT SYSTEM STATUS: READY');
      console.log('   - All critical components configured');
      console.log('   - Database connection successful');
      console.log('   - Ready to process payments securely');
    } else {
      console.log('\n⚠️  PAYMENT SYSTEM STATUS: DATABASE ISSUE');
      console.log('   - Credentials configured but database unreachable');
      console.log('   - Check network connection or run database setup');
    }
  } else {
    console.log('\n❌ PAYMENT SYSTEM STATUS: NOT CONFIGURED');
    console.log('   - Critical API credentials missing');
    console.log('   - Accounts CANNOT be stored');
    console.log('   - Payments will FAIL');
  }
  
  generateSetupInstructions(issues);
  
  console.log('\n📖 For detailed instructions, see:');
  console.log('   CRITICAL_PAYMENT_SECURITY_FIX.md');
}

main().catch(console.error);