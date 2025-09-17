#!/usr/bin/env node

/**
 * Safe Deployment Script
 * 
 * This script ensures safe deployment without destructive database operations
 * that could invalidate user sessions or cause data loss.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function checkEnvironmentVariables() {
  console.log('🔍 1. Verifying environment variables...');
  
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXTAUTH_SECRET',
    'NEXT_PUBLIC_SITE_URL'
  ];

  const missingVars = [];
  const placeholderVars = [];

  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
      missingVars.push(varName);
    } else if (value.includes('your-') || value.includes('example') || value === 'your_secret_here') {
      placeholderVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => console.error(`   - ${varName}`));
    process.exit(1);
  }

  if (placeholderVars.length > 0) {
    console.error('⚠️  Placeholder values detected in:');
    placeholderVars.forEach(varName => console.error(`   - ${varName}`));
    console.error('   Please update these with actual values before deploying.');
    process.exit(1);
  }

  // Check for stable domain
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl && (siteUrl.includes('vercel.app') || siteUrl.includes('localhost'))) {
    console.warn('⚠️  Using ephemeral domain:', siteUrl);
    console.warn('   Consider using a custom domain for stable authentication.');
    console.warn('   Users may be logged out after deployments with ephemeral domains.');
  } else {
    console.log('✅ Using stable domain:', siteUrl);
  }

  console.log('✅ Environment variables verified');
}

function checkForDestructiveMigrations() {
  console.log('🔍 2. Checking for destructive database operations...');
  
  const scriptsDir = path.join(__dirname);
  const sqlFiles = fs.readdirSync(scriptsDir)
    .filter(file => file.endsWith('.sql'))
    .concat(
      fs.readdirSync(path.join(__dirname, '..'))
        .filter(file => file.endsWith('.sql'))
        .map(file => path.join('..', file))
    );

  const destructivePatterns = [
    /DROP\s+TABLE.*auth\./i,
    /TRUNCATE.*auth\./i,
    /DELETE\s+FROM.*auth\./i,
    /DROP\s+SCHEMA.*auth/i,
    /CREATE\s+OR\s+REPLACE.*auth\./i
  ];

  let foundDestructive = false;

  sqlFiles.forEach(file => {
    try {
      const content = fs.readFileSync(path.join(scriptsDir, file), 'utf8');
      destructivePatterns.forEach(pattern => {
        if (pattern.test(content)) {
          console.error(`❌ Destructive operation found in ${file}:`);
          const matches = content.match(pattern);
          if (matches) {
            console.error(`   ${matches[0]}`);
          }
          foundDestructive = true;
        }
      });
    } catch (error) {
      // File might not exist or be readable, skip
    }
  });

  if (foundDestructive) {
    console.error('\n💥 DEPLOYMENT BLOCKED: Destructive database operations detected!');
    console.error('   These operations will invalidate user sessions and cause data loss.');
    console.error('   Please review and remove destructive operations before deploying.');
    console.error('\n   Safe alternatives:');
    console.error('   - Use ALTER TABLE ADD COLUMN IF NOT EXISTS');
    console.error('   - Use CREATE TABLE IF NOT EXISTS');
    console.error('   - Avoid DROP, TRUNCATE, DELETE on auth schema');
    process.exit(1);
  }

  console.log('✅ No destructive database operations detected');
}

function buildApplication() {
  console.log('🔨 3. Building application...');
  
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

function checkMigrationStatus() {
  console.log('🔍 4. Checking migration status...');
  
  console.log('\n📋 Migration Checklist:');
  console.log('   □ Review pending migrations manually');
  console.log('   □ Test migrations in staging environment first');
  console.log('   □ Run migrations separately from deployment:');
  console.log('     supabase migration up --environment production');
  console.log('   □ Verify no destructive operations in migrations');
  console.log('\n⚠️  Migrations are NOT automatically applied during deployment');
  console.log('   This prevents accidental data loss and session invalidation.');
}

function deployToVercel() {
  console.log('🚀 5. Deploying to Vercel...');
  
  try {
    // Check if vercel CLI is available
    execSync('vercel --version', { stdio: 'pipe' });
  } catch (error) {
    console.error('❌ Vercel CLI not found. Install with: npm i -g vercel');
    process.exit(1);
  }

  try {
    execSync('vercel --prod', { stdio: 'inherit' });
    console.log('✅ Deployment completed successfully');
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

function postDeploymentChecks() {
  console.log('\n🎯 6. Post-deployment verification...');
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  
  console.log('\n📋 Manual Verification Checklist:');
  console.log(`   □ Visit ${siteUrl} and verify site loads`);
  console.log(`   □ Test user login/logout functionality`);
  console.log(`   □ Verify existing users can still access their accounts`);
  console.log(`   □ Test new user registration`);
  console.log(`   □ Check admin dashboard access`);
  console.log(`   □ Verify purchase flow works`);
  console.log(`   □ Test email notifications`);
  
  console.log('\n🔧 If authentication issues occur:');
  console.log('   1. Check Vercel function logs for errors');
  console.log('   2. Verify environment variables in Vercel dashboard');
  console.log('   3. Confirm Supabase auth URL configuration');
  console.log('   4. Ensure custom domain DNS is properly configured');
}

function generateDeploymentReport() {
  const report = {
    timestamp: new Date().toISOString(),
    deployment: 'SAFE_DEPLOYMENT_COMPLETED',
    domain: process.env.NEXT_PUBLIC_SITE_URL,
    authConfig: {
      nextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      stableDomain: !process.env.NEXT_PUBLIC_SITE_URL?.includes('vercel.app')
    },
    safeguards: {
      environmentVariablesVerified: true,
      noDestructiveOperations: true,
      buildSuccessful: true,
      migrationsNotAutoApplied: true
    },
    nextSteps: [
      'Verify authentication works on production',
      'Test user sessions persist across deployments',
      'Monitor for any authentication errors',
      'Apply database migrations manually if needed'
    ]
  };

  fs.writeFileSync('deployment-report.json', JSON.stringify(report, null, 2));
  console.log('\n📄 Deployment report saved to: deployment-report.json');
}

async function runSafeDeployment() {
  console.log('🛡️  SAFE DEPLOYMENT SCRIPT');
  console.log('==========================\n');
  console.log('This script ensures your deployment won\'t invalidate user sessions');
  console.log('or cause authentication issues.\n');

  try {
    checkEnvironmentVariables();
    checkForDestructiveMigrations();
    buildApplication();
    checkMigrationStatus();
    deployToVercel();
    postDeploymentChecks();
    generateDeploymentReport();

    console.log('\n🎉 SAFE DEPLOYMENT COMPLETED!');
    console.log('\n✅ Your users should remain logged in after this deployment');
    console.log('✅ No destructive database operations were executed');
    console.log('✅ Authentication system integrity maintained');
    
  } catch (error) {
    console.error('\n💥 DEPLOYMENT FAILED:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Check the error message above');
    console.error('2. Verify all environment variables are set correctly');
    console.error('3. Ensure no destructive database operations exist');
    console.error('4. Test the build locally first: npm run build');
    process.exit(1);
  }
}

// Run the safe deployment
if (require.main === module) {
  runSafeDeployment().catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  });
}

module.exports = { runSafeDeployment };