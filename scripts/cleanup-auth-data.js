#!/usr/bin/env node

/**
 * Supabase Authentication Data Cleanup Script
 * 
 * This script helps clean up old authentication data from your Supabase database.
 * Run this script to remove old login logs, sessions, and refresh tokens.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuration
const RETENTION_DAYS = {
  auditLogs: 30,    // Keep audit logs for 30 days
  sessions: 7,      // Keep sessions for 7 days
  refreshTokens: 7  // Keep refresh tokens for 7 days
};

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // This requires service role key, not anon key
);

async function checkAuthStats() {
  console.log('📊 Checking current authentication data...');
  
  try {
    // Check audit log entries
    const { data: auditData, error: auditError } = await supabase
      .from('audit_log_entries')
      .select('*', { count: 'exact', head: true })
      .lt('created_at', new Date(Date.now() - RETENTION_DAYS.auditLogs * 24 * 60 * 60 * 1000).toISOString());
    
    if (auditError) {
      console.log('⚠️  Cannot access audit_log_entries (this is normal if using auth schema)');
    } else {
      console.log(`📝 Old audit log entries: ${auditData?.length || 0}`);
    }

    // Check users count
    const { count: userCount } = await supabase
      .from('auth.users')
      .select('*', { count: 'exact', head: true });
    
    console.log(`👥 Total users: ${userCount || 'Unable to count'}`);
    
    // Check profiles count (custom table)
    const { count: profileCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    console.log(`📋 Profile records: ${profileCount || 0}`);
    
  } catch (error) {
    console.error('❌ Error checking stats:', error.message);
  }
}

async function cleanupOldData() {
  console.log('🧹 Starting authentication data cleanup...');
  
  const cutoffDate = new Date(Date.now() - RETENTION_DAYS.auditLogs * 24 * 60 * 60 * 1000);
  console.log(`📅 Removing data older than: ${cutoffDate.toISOString()}`);
  
  try {
    // Note: Direct auth schema access requires service role key
    // Most cleanup will need to be done via Supabase Dashboard SQL Editor
    
    console.log('⚠️  Note: This script provides analysis. For actual cleanup, use the SQL script.');
    console.log('📝 Run the following in Supabase SQL Editor:');
    console.log('');
    console.log('-- Clean up old audit logs (if accessible)');
    console.log(`DELETE FROM auth.audit_log_entries WHERE created_at < '${cutoffDate.toISOString()}';`);
    console.log('');
    console.log('-- Clean up old sessions');
    console.log(`DELETE FROM auth.sessions WHERE created_at < '${cutoffDate.toISOString()}';`);
    console.log('');
    console.log('-- Clean up revoked refresh tokens');
    console.log('DELETE FROM auth.refresh_tokens WHERE revoked = true;');
    console.log('');
    console.log('-- Clean up old refresh tokens');
    console.log(`DELETE FROM auth.refresh_tokens WHERE created_at < '${cutoffDate.toISOString()}';`);
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
  }
}

async function showRecentActivity() {
  console.log('\n🔍 Recent authentication activity:');
  
  try {
    // Try to get recent profiles activity
    const { data: recentProfiles } = await supabase
      .from('profiles')
      .select('email, created_at')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (recentProfiles && recentProfiles.length > 0) {
      console.log('\n📋 Recent profile registrations:');
      recentProfiles.forEach((profile, index) => {
        console.log(`${index + 1}. ${profile.email} - ${new Date(profile.created_at).toLocaleString()}`);
      });
    }
    
    // Show system logs if available
    const { data: systemLogs } = await supabase
      .from('system_logs')
      .select('level, message, created_at, user_id')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (systemLogs && systemLogs.length > 0) {
      console.log('\n📊 Recent system logs:');
      systemLogs.forEach((log, index) => {
        console.log(`${index + 1}. [${log.level}] ${log.message} - ${new Date(log.created_at).toLocaleString()}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error fetching recent activity:', error.message);
  }
}

async function main() {
  console.log('🚀 Supabase Authentication Data Cleanup Tool\n');
  
  // Check environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
    process.exit(1);
  }
  
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
    console.log('💡 You need the service role key (not anon key) to clean auth data');
    console.log('📍 Find it in: Supabase Dashboard > Settings > API > service_role key');
    process.exit(1);
  }
  
  console.log('✅ Environment variables found');
  console.log(`🔗 Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);
  console.log(`🔑 Service role key: ${process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 20)}...\n`);
  
  await checkAuthStats();
  await showRecentActivity();
  await cleanupOldData();
  
  console.log('\n✨ Cleanup analysis complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Copy the SQL commands above');
  console.log('2. Go to Supabase Dashboard > SQL Editor');
  console.log('3. Paste and run the commands');
  console.log('4. Run this script again to verify cleanup');
  console.log('\n💡 Consider setting up automated cleanup using the provided SQL functions');
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('Supabase Authentication Data Cleanup Tool');
  console.log('');
  console.log('Usage: node cleanup-auth-data.js [options]');
  console.log('');
  console.log('Options:');
  console.log('  --help, -h     Show this help message');
  console.log('  --stats-only   Only show statistics, no cleanup suggestions');
  console.log('');
  console.log('Environment variables required:');
  console.log('  NEXT_PUBLIC_SUPABASE_URL      Your Supabase project URL');
  console.log('  SUPABASE_SERVICE_ROLE_KEY     Your Supabase service role key');
  console.log('');
  console.log('Note: This script analyzes data and provides SQL commands.');
  console.log('Actual cleanup must be done via Supabase SQL Editor.');
  process.exit(0);
}

if (process.argv.includes('--stats-only')) {
  checkAuthStats().then(() => {
    console.log('\n📊 Statistics check complete');
  });
} else {
  main().catch(console.error);
}