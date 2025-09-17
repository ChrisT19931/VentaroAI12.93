#!/usr/bin/env node

/**
 * Authentication Configuration Verification Script
 * 
 * This script verifies that your authentication configuration is properly
 * set up to prevent users from being logged out after deployments.
 */

const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const http = require('http');

function checkEnvironmentVariables() {
  console.log('🔍 1. Checking Environment Variables...');
  
  const authVars = {
    'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY,
    'NEXTAUTH_SECRET': process.env.NEXTAUTH_SECRET,
    'NEXT_PUBLIC_SITE_URL': process.env.NEXT_PUBLIC_SITE_URL,
    'NEXTAUTH_URL': process.env.NEXTAUTH_URL
  };

  let allGood = true;

  Object.entries(authVars).forEach(([key, value]) => {
    if (!value) {
      console.log(`❌ ${key}: Missing`);
      allGood = false;
    } else if (value.includes('your-') || value.includes('example') || value === 'your_secret_here') {
      console.log(`⚠️  ${key}: Contains placeholder value`);
      allGood = false;
    } else {
      console.log(`✅ ${key}: Configured`);
    }
  });

  // Check domain stability
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    if (siteUrl.includes('vercel.app')) {
      console.log(`⚠️  NEXT_PUBLIC_SITE_URL: Using ephemeral Vercel domain`);
      console.log(`   This may cause users to be logged out after deployments`);
      console.log(`   Consider using a custom domain for stable authentication`);
    } else if (siteUrl.includes('localhost')) {
      console.log(`ℹ️  NEXT_PUBLIC_SITE_URL: Using localhost (development)`);
    } else {
      console.log(`✅ NEXT_PUBLIC_SITE_URL: Using stable custom domain`);
    }
  }

  // Check NEXTAUTH_URL consistency
  const nextAuthUrl = process.env.NEXTAUTH_URL;
  if (nextAuthUrl && siteUrl && nextAuthUrl !== siteUrl) {
    console.log(`⚠️  NEXTAUTH_URL and NEXT_PUBLIC_SITE_URL don't match`);
    console.log(`   NEXTAUTH_URL: ${nextAuthUrl}`);
    console.log(`   NEXT_PUBLIC_SITE_URL: ${siteUrl}`);
    allGood = false;
  }

  return allGood;
}

async function checkSupabaseConnection() {
  console.log('\n🔍 2. Checking Supabase Connection...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Supabase credentials missing');
    return false;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test basic connection
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "relation does not exist" which is OK
      console.log(`❌ Supabase connection failed: ${error.message}`);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    
    // Test service role if available
    if (serviceKey) {
      const adminClient = createClient(supabaseUrl, serviceKey);
      try {
        const { data: settings, error: settingsError } = await adminClient.auth.admin.listUsers({ page: 1, perPage: 1 });
        if (settingsError) {
          console.log(`⚠️  Service role key may be invalid: ${settingsError.message}`);
        } else {
          console.log('✅ Service role key working');
        }
      } catch (err) {
        console.log(`⚠️  Service role test failed: ${err.message}`);
      }
    }
    
    return true;
  } catch (error) {
    console.log(`❌ Supabase connection error: ${error.message}`);
    return false;
  }
}

async function checkSupabaseAuthSettings() {
  console.log('\n🔍 3. Checking Supabase Auth Settings...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey) {
    console.log('⚠️  Service role key not available, skipping auth settings check');
    return true;
  }

  try {
    const supabase = createClient(supabaseUrl, serviceKey);
    
    // Note: Getting auth settings requires admin access and may not be available in all setups
    console.log('ℹ️  Auth settings check requires manual verification in Supabase dashboard:');
    console.log('   1. Go to Authentication → Settings → URL Configuration');
    console.log(`   2. Verify Site URL matches: ${process.env.NEXT_PUBLIC_SITE_URL}`);
    console.log('   3. Check Redirect URLs include:');
    console.log(`      - ${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`);
    console.log(`      - ${process.env.NEXT_PUBLIC_SITE_URL}/signin`);
    console.log(`      - ${process.env.NEXT_PUBLIC_SITE_URL}/signup`);
    
    return true;
  } catch (error) {
    console.log(`⚠️  Could not verify auth settings: ${error.message}`);
    return true; // Don't fail the check for this
  }
}

function checkDomainConfiguration() {
  console.log('\n🔍 4. Checking Domain Configuration...');
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  
  if (!siteUrl) {
    console.log('❌ NEXT_PUBLIC_SITE_URL not set');
    return false;
  }

  try {
    const url = new URL(siteUrl);
    
    console.log(`✅ Site URL: ${siteUrl}`);
    console.log(`   Protocol: ${url.protocol}`);
    console.log(`   Domain: ${url.hostname}`);
    console.log(`   Port: ${url.port || (url.protocol === 'https:' ? '443' : '80')}`);
    
    // Check if it's a stable domain
    if (url.hostname.includes('vercel.app')) {
      console.log('⚠️  Using Vercel ephemeral domain');
      console.log('   Users may be logged out after deployments');
      console.log('   Recommendation: Set up a custom domain');
      return false;
    } else if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
      console.log('ℹ️  Using localhost (development environment)');
      return true;
    } else {
      console.log('✅ Using stable custom domain');
      return true;
    }
  } catch (error) {
    console.log(`❌ Invalid site URL: ${error.message}`);
    return false;
  }
}

function checkNextAuthConfiguration() {
  console.log('\n🔍 5. Checking NextAuth Configuration...');
  
  const nextAuthSecret = process.env.NEXTAUTH_SECRET;
  const nextAuthUrl = process.env.NEXTAUTH_URL;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  
  let allGood = true;
  
  if (!nextAuthSecret) {
    console.log('❌ NEXTAUTH_SECRET not set');
    console.log('   Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
    allGood = false;
  } else if (nextAuthSecret.length < 32) {
    console.log('⚠️  NEXTAUTH_SECRET is too short (should be at least 32 characters)');
    allGood = false;
  } else {
    console.log('✅ NEXTAUTH_SECRET is set and secure');
  }
  
  if (!nextAuthUrl) {
    if (siteUrl) {
      console.log('ℹ️  NEXTAUTH_URL not set, will use NEXT_PUBLIC_SITE_URL');
    } else {
      console.log('⚠️  Neither NEXTAUTH_URL nor NEXT_PUBLIC_SITE_URL is set');
      allGood = false;
    }
  } else {
    console.log('✅ NEXTAUTH_URL is set');
    if (siteUrl && nextAuthUrl !== siteUrl) {
      console.log('⚠️  NEXTAUTH_URL and NEXT_PUBLIC_SITE_URL don\'t match');
      allGood = false;
    }
  }
  
  return allGood;
}

function generateRecommendations(results) {
  console.log('\n📋 RECOMMENDATIONS');
  console.log('==================');
  
  if (!results.envVars) {
    console.log('\n🔧 Environment Variables:');
    console.log('   - Set all required environment variables');
    console.log('   - Replace any placeholder values with actual credentials');
    console.log('   - Ensure NEXTAUTH_SECRET is a secure random string');
  }
  
  if (!results.domain) {
    console.log('\n🌐 Domain Configuration:');
    console.log('   - Set up a custom domain in Vercel');
    console.log('   - Update NEXT_PUBLIC_SITE_URL to use the custom domain');
    console.log('   - Configure DNS CNAME record pointing to Vercel');
    console.log('   - Update Supabase auth URLs to match the custom domain');
  }
  
  if (!results.supabase) {
    console.log('\n🗄️  Supabase Configuration:');
    console.log('   - Verify Supabase credentials are correct');
    console.log('   - Check Supabase project is active and accessible');
    console.log('   - Ensure database tables are created');
  }
  
  if (!results.nextAuth) {
    console.log('\n🔐 NextAuth Configuration:');
    console.log('   - Generate a secure NEXTAUTH_SECRET');
    console.log('   - Ensure NEXTAUTH_URL matches your site URL');
    console.log('   - Verify all auth-related environment variables');
  }
  
  console.log('\n🚀 Deployment Best Practices:');
  console.log('   - Use the safe deployment script: npm run safe-deploy');
  console.log('   - Never run destructive database migrations on deploy');
  console.log('   - Test authentication after each deployment');
  console.log('   - Monitor user session persistence');
}

async function runAuthVerification() {
  console.log('🔐 AUTHENTICATION CONFIGURATION VERIFICATION');
  console.log('============================================\n');
  
  const results = {
    envVars: false,
    supabase: false,
    domain: false,
    nextAuth: false
  };
  
  try {
    results.envVars = checkEnvironmentVariables();
    results.supabase = await checkSupabaseConnection();
    await checkSupabaseAuthSettings();
    results.domain = checkDomainConfiguration();
    results.nextAuth = checkNextAuthConfiguration();
    
    const allPassed = Object.values(results).every(result => result);
    
    console.log('\n📊 VERIFICATION SUMMARY');
    console.log('=======================');
    console.log(`Environment Variables: ${results.envVars ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Supabase Connection: ${results.supabase ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Domain Configuration: ${results.domain ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`NextAuth Configuration: ${results.nextAuth ? '✅ PASS' : '❌ FAIL'}`);
    
    if (allPassed) {
      console.log('\n🎉 ALL CHECKS PASSED!');
      console.log('Your authentication configuration should prevent users');
      console.log('from being logged out after deployments.');
    } else {
      console.log('\n⚠️  SOME CHECKS FAILED');
      console.log('Address the issues above to ensure stable authentication.');
      generateRecommendations(results);
    }
    
  } catch (error) {
    console.error('\n💥 VERIFICATION FAILED:', error.message);
    process.exit(1);
  }
}

// Run the verification
if (require.main === module) {
  runAuthVerification().catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  });
}

module.exports = { runAuthVerification };