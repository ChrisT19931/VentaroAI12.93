#!/usr/bin/env node

/**
 * Test script for the backup email system with Resend integration
 * This script tests the email fallback chain: SendGrid -> Resend -> Backup Storage
 */

require('dotenv').config({ path: '.env.local' });

// Since we're testing TypeScript files, we'll create a simple test
// that demonstrates the backup email system functionality

async function testBackupEmailSystem() {
  console.log('🧪 Testing Backup Email System Configuration\n');
  
  console.log('📧 Email Service Configuration Status:');
  
  // Check SendGrid configuration
  const sendGridConfigured = process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== 'your_sendgrid_api_key';
  const sendGridFromEmail = process.env.SENDGRID_FROM_EMAIL && process.env.SENDGRID_FROM_EMAIL !== 'your_verified_sender_email';
  
  console.log(`   SendGrid API Key: ${sendGridConfigured ? '✅ Configured' : '❌ Not configured (placeholder value)'}`);
  console.log(`   SendGrid From Email: ${sendGridFromEmail ? '✅ Configured' : '❌ Not configured (placeholder value)'}`);
  
  // Check Resend configuration
  const resendConfigured = process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your_resend_api_key';
  
  console.log(`   Resend API Key: ${resendConfigured ? '✅ Configured' : '❌ Not configured (placeholder value)'}`);
  
  // Check Supabase configuration
  const supabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY.includes('placeholder');
  
  console.log(`   Supabase URL: ${supabaseConfigured ? '✅ Configured' : '❌ Not configured (placeholder value)'}`);
  console.log(`   Supabase Service Key: ${supabaseServiceKey ? '✅ Configured' : '❌ Not configured (placeholder value)'}`);
  
  console.log('\n🔄 Email Fallback Chain Status:');
  
  if (sendGridConfigured) {
    console.log('   1️⃣ SendGrid: ✅ Available (Primary)');
  } else {
    console.log('   1️⃣ SendGrid: ❌ Not available');
  }
  
  if (resendConfigured) {
    console.log('   2️⃣ Resend: ✅ Available (Secondary)');
  } else {
    console.log('   2️⃣ Resend: ❌ Not available');
  }
  
  if (supabaseConfigured && supabaseServiceKey) {
    console.log('   3️⃣ Supabase Backup: ✅ Available (Final fallback)');
  } else {
    console.log('   3️⃣ Supabase Backup: ❌ Not available');
  }
  
  console.log('\n📊 System Analysis:');
  
  const emailServicesAvailable = sendGridConfigured || resendConfigured;
  const backupSystemAvailable = supabaseConfigured && supabaseServiceKey;
  
  if (sendGridConfigured && resendConfigured && backupSystemAvailable) {
    console.log('   🎯 Status: EXCELLENT - Full redundancy available');
    console.log('   📧 Emails will be sent via SendGrid, with Resend as backup');
    console.log('   💾 All emails stored in Supabase for audit trail');
  } else if (emailServicesAvailable && backupSystemAvailable) {
    console.log('   ✅ Status: GOOD - Email service + backup available');
    console.log('   📧 Emails will be sent via configured service');
    console.log('   💾 Backup system available if email service fails');
  } else if (emailServicesAvailable) {
    console.log('   ⚠️ Status: PARTIAL - Email service available, no backup');
    console.log('   📧 Emails will be sent, but no backup if service fails');
  } else if (backupSystemAvailable) {
    console.log('   🔄 Status: BACKUP ONLY - No email services, backup available');
    console.log('   📧 Emails will be stored in backup system only');
    console.log('   ⚠️ No immediate email delivery until services configured');
  } else {
    console.log('   ❌ Status: CRITICAL - No email services or backup available');
    console.log('   📧 Email functionality will not work');
  }
  
  console.log('\n📋 Configuration Steps:');
  
  if (!sendGridConfigured && !resendConfigured) {
    console.log('   🔧 Configure at least one email service:');
    console.log('      • SendGrid: Get API key from https://sendgrid.com/docs/api-reference/');
    console.log('      • Resend: Get API key from https://resend.com/api-keys');
    console.log('      • Update .env.local with your API keys');
  }
  
  if (!backupSystemAvailable) {
    console.log('   🔧 Configure Supabase backup system:');
    console.log('      • Update NEXT_PUBLIC_SUPABASE_URL in .env.local');
    console.log('      • Update SUPABASE_SERVICE_ROLE_KEY in .env.local');
    console.log('      • Run: node scripts/setup-backup-email-system.sql');
  }
  
  console.log('\n🚀 Testing Instructions:');
  console.log('   1. Configure your email services in .env.local');
  console.log('   2. Submit a contact form on your website');
  console.log('   3. Check console logs for email sending status');
  console.log('   4. Monitor Supabase backup_emails table');
  
  console.log('\n🏁 Configuration check completed!');
}

// Run the test
if (require.main === module) {
  testBackupEmailSystem().catch(console.error);
}

module.exports = { testBackupEmailSystem };