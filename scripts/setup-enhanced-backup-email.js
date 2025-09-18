#!/usr/bin/env node

/**
 * Enhanced Backup Email System Setup Script
 * This script helps configure the three-tier email fallback system:
 * SendGrid -> Resend -> Supabase Backup
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function log(message, color = 'white') {
  const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    reset: '\x1b[0m'
  };
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function setupEnhancedBackupEmail() {
  log('🚀 Enhanced Backup Email System Setup', 'cyan');
  log('=====================================\n', 'cyan');
  
  log('This script will help you configure a robust three-tier email system:');
  log('1️⃣ SendGrid (Primary email service)');
  log('2️⃣ Resend (Secondary email service)');
  log('3️⃣ Supabase (Backup storage)\n');
  
  const envPath = path.join(process.cwd(), '.env.local');
  let envContent = '';
  
  // Read existing .env.local if it exists
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
    log('✅ Found existing .env.local file', 'green');
  } else {
    log('📝 Creating new .env.local file', 'yellow');
  }
  
  log('\n📧 EMAIL SERVICE CONFIGURATION', 'magenta');
  log('==============================\n');
  
  // SendGrid Configuration
  log('🔧 SendGrid Configuration (Primary Email Service)', 'blue');
  log('Get your API key from: https://app.sendgrid.com/settings/api_keys\n');
  
  const sendgridKey = await question('Enter your SendGrid API key (or press Enter to skip): ');
  const sendgridEmail = sendgridKey ? await question('Enter your verified sender email: ') : '';
  
  // Resend Configuration
  log('\n🔧 Resend Configuration (Secondary Email Service)', 'blue');
  log('Get your API key from: https://resend.com/api-keys\n');
  
  const resendKey = await question('Enter your Resend API key (or press Enter to skip): ');
  
  // Supabase Configuration
  log('\n🔧 Supabase Configuration (Backup Storage)', 'blue');
  log('Get your credentials from: https://supabase.com/dashboard\n');
  
  const supabaseUrl = await question('Enter your Supabase URL (or press Enter to skip): ');
  const supabaseKey = supabaseUrl ? await question('Enter your Supabase service role key: ') : '';
  
  // Update environment variables
  function updateEnvVar(content, key, value, comment = '') {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    const newLine = `${key}=${value}`;
    
    if (regex.test(content)) {
      return content.replace(regex, newLine);
    } else {
      const section = comment ? `\n# ${comment}\n${newLine}` : `\n${newLine}`;
      return content + section;
    }
  }
  
  // Update SendGrid variables
  if (sendgridKey) {
    envContent = updateEnvVar(envContent, 'SENDGRID_API_KEY', sendgridKey, 'SendGrid Configuration');
    envContent = updateEnvVar(envContent, 'SENDGRID_FROM_EMAIL', sendgridEmail);
  }
  
  // Update Resend variables
  if (resendKey) {
    envContent = updateEnvVar(envContent, 'RESEND_API_KEY', resendKey, 'Resend Configuration (Alternative to SendGrid)');
  }
  
  // Update Supabase variables
  if (supabaseUrl) {
    envContent = updateEnvVar(envContent, 'NEXT_PUBLIC_SUPABASE_URL', supabaseUrl, 'Supabase Configuration');
    envContent = updateEnvVar(envContent, 'SUPABASE_SERVICE_ROLE_KEY', supabaseKey);
  }
  
  // Write updated .env.local
  fs.writeFileSync(envPath, envContent);
  
  log('\n📊 CONFIGURATION SUMMARY', 'magenta');
  log('========================\n');
  
  const hasEmailService = sendgridKey || resendKey;
  const hasBackup = supabaseUrl && supabaseKey;
  
  log(`SendGrid: ${sendgridKey ? '✅ Configured' : '❌ Not configured'}`, sendgridKey ? 'green' : 'red');
  log(`Resend: ${resendKey ? '✅ Configured' : '❌ Not configured'}`, resendKey ? 'green' : 'red');
  log(`Supabase: ${hasBackup ? '✅ Configured' : '❌ Not configured'}`, hasBackup ? 'green' : 'red');
  
  log('\n🎯 SYSTEM STATUS', 'magenta');
  log('===============\n');
  
  if (sendgridKey && resendKey && hasBackup) {
    log('🎯 EXCELLENT: Full redundancy configured!', 'green');
    log('   • Primary: SendGrid');
    log('   • Secondary: Resend');
    log('   • Backup: Supabase storage');
  } else if (hasEmailService && hasBackup) {
    log('✅ GOOD: Email service + backup configured', 'green');
    log('   • Email delivery available');
    log('   • Backup system ready');
  } else if (hasEmailService) {
    log('⚠️ PARTIAL: Email service only', 'yellow');
    log('   • Emails will be sent');
    log('   • No backup if service fails');
  } else if (hasBackup) {
    log('🔄 BACKUP ONLY: No email services', 'yellow');
    log('   • Emails will be stored only');
    log('   • Configure email service for delivery');
  } else {
    log('❌ CRITICAL: No services configured', 'red');
    log('   • Email functionality will not work');
  }
  
  log('\n📋 NEXT STEPS', 'magenta');
  log('=============\n');
  
  if (hasBackup) {
    log('1. Set up Supabase database tables:', 'blue');
    log('   Run: psql -f scripts/setup-backup-email-system.sql');
    log('   Or copy the SQL from scripts/setup-backup-email-system.sql to Supabase SQL editor\n');
  }
  
  log('2. Test your configuration:', 'blue');
  log('   Run: node test-backup-email-system.js\n');
  
  log('3. Test with a real form submission:', 'blue');
  log('   Submit a contact form on your website\n');
  
  if (!hasEmailService) {
    log('4. Configure at least one email service:', 'yellow');
    log('   • SendGrid: https://app.sendgrid.com/');
    log('   • Resend: https://resend.com/\n');
  }
  
  log('📚 Documentation:', 'blue');
  log('   • Read: ENHANCED_BACKUP_EMAIL_SYSTEM.md');
  log('   • API docs: BACKUP_EMAIL_SYSTEM.md\n');
  
  log('🎉 Setup completed! Your .env.local has been updated.', 'green');
  
  rl.close();
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  log('\n\n👋 Setup cancelled by user', 'yellow');
  rl.close();
  process.exit(0);
});

// Run setup
if (require.main === module) {
  setupEnhancedBackupEmail().catch((error) => {
    log(`\n❌ Setup failed: ${error.message}`, 'red');
    rl.close();
    process.exit(1);
  });
}

module.exports = { setupEnhancedBackupEmail };