#!/usr/bin/env node

/**
 * Email System Fix Script
 * This script helps diagnose and fix email system issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 EMAIL SYSTEM FIX SCRIPT');
console.log('=' .repeat(50));

// Check .env.local file
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found!');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');

console.log('\n📋 CURRENT EMAIL CONFIGURATION:');
console.log('-'.repeat(40));

// Check SendGrid API Key
const sendgridKeyLine = lines.find(line => line.startsWith('SENDGRID_API_KEY='));
if (sendgridKeyLine) {
  const apiKey = sendgridKeyLine.split('=')[1];
  if (apiKey === 'your_sendgrid_api_key' || apiKey === 'SG.placeholder_get_real_key_from_sendgrid') {
    console.log('❌ SENDGRID_API_KEY: PLACEHOLDER (needs real API key)');
    console.log('   Current value:', apiKey);
  } else if (apiKey.startsWith('SG.')) {
    console.log('✅ SENDGRID_API_KEY: SET (starts with SG.)');
  } else {
    console.log('⚠️  SENDGRID_API_KEY: INVALID FORMAT (should start with SG.)');
    console.log('   Current value:', apiKey);
  }
} else {
  console.log('❌ SENDGRID_API_KEY: MISSING');
}

// Check Email From addresses
const emailFromLine = lines.find(line => line.startsWith('EMAIL_FROM='));
const sendgridFromLine = lines.find(line => line.startsWith('SENDGRID_FROM_EMAIL='));

if (emailFromLine) {
  console.log('✅ EMAIL_FROM:', emailFromLine.split('=')[1]);
} else {
  console.log('❌ EMAIL_FROM: MISSING');
}

if (sendgridFromLine) {
  console.log('✅ SENDGRID_FROM_EMAIL:', sendgridFromLine.split('=')[1]);
} else {
  console.log('❌ SENDGRID_FROM_EMAIL: MISSING');
}

console.log('\n🚀 SOLUTION STEPS:');
console.log('-'.repeat(40));

if (sendgridKeyLine && sendgridKeyLine.includes('placeholder')) {
  console.log('\n1. GET A REAL SENDGRID API KEY:');
  console.log('   • Go to https://sendgrid.com');
  console.log('   • Sign up for free account (100 emails/day)');
  console.log('   • Go to Settings → API Keys');
  console.log('   • Create new API key with Mail Send permissions');
  console.log('   • Copy the key (starts with SG.)');
  
  console.log('\n2. UPDATE YOUR .env.local FILE:');
  console.log('   Replace this line:');
  console.log('   SENDGRID_API_KEY=SG.placeholder_get_real_key_from_sendgrid');
  console.log('   ');
  console.log('   With your real API key:');
  console.log('   SENDGRID_API_KEY=SG.your_actual_api_key_here');
}

console.log('\n3. RESTART YOUR DEVELOPMENT SERVER:');
console.log('   • Stop the current server (Ctrl+C)');
console.log('   • Run: npm run dev -- --port 3006');

console.log('\n4. TEST THE EMAIL SYSTEM:');
console.log('   • Run: node test-support-form.js');
console.log('   • Or submit a contact form on your website');

console.log('\n📧 BACKUP EMAIL SYSTEM:');
console.log('-'.repeat(40));
console.log('✅ Your forms will still work even without SendGrid!');
console.log('✅ All form submissions are stored in Supabase database');
console.log('✅ Failed emails are stored in backup_emails table');
console.log('✅ You can process backup emails later when SendGrid is configured');

console.log('\n🆘 NEED HELP?');
console.log('-'.repeat(40));
console.log('• Check SENDGRID_EMAIL_SETUP.md for detailed instructions');
console.log('• Run this script again after making changes');
console.log('• Check server console logs when submitting forms');

console.log('\n' + '='.repeat(50));
console.log('🎯 QUICK FIX: Get a SendGrid API key and update .env.local');
console.log('='.repeat(50));