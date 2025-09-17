# 🔐 Deployment Authentication Fix Guide

## Problem: Users Forced to Log In Again After Deploy

This guide addresses the common issue where users are forced to log in again after each deployment, even though their accounts still exist.

## Root Causes

### 1. **Domain Instability** 🌐
Supabase auth cookies become invalid when:
- Using ephemeral preview URLs (e.g., `app-abc123.vercel.app`)
- Domain changes between deployments
- Missing stable custom domain configuration

### 2. **Schema Re-initialization** 🗄️
Running migrations that:
- Drop and recreate tables
- Reset user data on every deploy
- Wipe authentication sessions

## ✅ Solution 1: Stable Custom Domain

### Configure Custom Domain in Vercel

1. **Add Custom Domain**
   ```bash
   # In Vercel Dashboard:
   # Project Settings → Domains → Add Domain
   # Example: app.yourdomain.com
   ```

2. **Update Environment Variables**
   ```bash
   # In Vercel Dashboard: Settings → Environment Variables
   NEXT_PUBLIC_SITE_URL=https://app.yourdomain.com
   NEXT_PUBLIC_BASE_URL=https://app.yourdomain.com
   NEXTAUTH_URL=https://app.yourdomain.com
   ```

3. **Configure Supabase Auth URLs**
   ```bash
   # In Supabase Dashboard: Authentication → URL Configuration
   Site URL: https://app.yourdomain.com
   Redirect URLs:
   - https://app.yourdomain.com/auth/callback
   - https://app.yourdomain.com/signin
   - https://app.yourdomain.com/signup
   ```

### Update DNS Configuration

```bash
# Add CNAME record in your DNS provider:
Type: CNAME
Name: app
Value: cname.vercel-dns.com
TTL: 300
```

## ✅ Solution 2: Safe Migration Handling

### Current Issue: Unsafe Migration Scripts

The current setup may be running destructive operations on deploy:

```sql
-- ❌ DANGEROUS: This wipes user data
DROP TABLE IF EXISTS auth.users CASCADE;
CREATE TABLE auth.users (...)

-- ❌ DANGEROUS: This resets sessions
TRUNCATE auth.sessions;
```

### Safe Migration Approach

1. **Create Migration Files** (Don't run on every deploy)
   ```bash
   # Create new migration file
   supabase migration new add_new_feature
   ```

2. **Apply Migrations Once**
   ```sql
   -- ✅ SAFE: Only add new columns/tables
   ALTER TABLE profiles ADD COLUMN IF NOT EXISTS new_field TEXT;
   
   -- ✅ SAFE: Create new tables without affecting existing data
   CREATE TABLE IF NOT EXISTS new_feature (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

3. **Update Package.json Scripts**
   ```json
   {
     "scripts": {
       "dev": "next dev -p 3003",
       "build": "next build",
       "start": "next start",
       "migrate:dev": "supabase migration up",
       "migrate:prod": "supabase migration up --environment production"
     }
   }
   ```

## ✅ Solution 3: Environment Variable Fixes

### Update .env.local.example

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stable Domain Configuration
NEXT_PUBLIC_SITE_URL=https://app.yourdomain.com
NEXT_PUBLIC_BASE_URL=https://app.yourdomain.com
NEXTAUTH_URL=https://app.yourdomain.com
NEXTAUTH_SECRET=your_nextauth_secret_here

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email Configuration
SENDGRID_API_KEY=SG.your_api_key
EMAIL_FROM=support@yourdomain.com
```

## ✅ Solution 4: Deployment Script Updates

### Create Safe Deployment Script

```javascript
// scripts/safe-deploy.js
const { execSync } = require('child_process');

console.log('🚀 Starting Safe Deployment...');

// 1. Verify environment variables
console.log('1. Verifying environment variables...');
execSync('npm run verify-env', { stdio: 'inherit' });

// 2. Build application
console.log('2. Building application...');
execSync('npm run build', { stdio: 'inherit' });

// 3. Check for pending migrations (don't auto-run)
console.log('3. Checking for pending migrations...');
console.log('⚠️  Remember to run migrations manually if needed:');
console.log('   supabase migration up --environment production');

// 4. Deploy to Vercel
console.log('4. Deploying to Vercel...');
execSync('vercel --prod', { stdio: 'inherit' });

console.log('✅ Deployment complete!');
console.log('🔍 Verify authentication works at your custom domain');
```

### Update Package.json

```json
{
  "scripts": {
    "safe-deploy": "node scripts/safe-deploy.js",
    "verify-auth": "node scripts/verify-auth-config.js"
  }
}
```

## ✅ Solution 5: Supabase Auth Configuration

### Verify Auth Settings

```javascript
// scripts/verify-auth-config.js
const { createClient } = require('@supabase/supabase-js');

async function verifyAuthConfig() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  console.log('🔍 Verifying Supabase Auth Configuration...');
  
  // Check auth settings
  const { data: settings, error } = await supabase.auth.admin.getSettings();
  
  if (error) {
    console.error('❌ Failed to get auth settings:', error.message);
    return;
  }

  console.log('✅ Auth Settings:');
  console.log(`   Site URL: ${settings.site_url}`);
  console.log(`   Redirect URLs: ${settings.redirect_urls?.join(', ')}`);
  console.log(`   JWT Expiry: ${settings.jwt_exp} seconds`);
  console.log(`   Refresh Token Expiry: ${settings.refresh_token_rotation_enabled}`);
}

verifyAuthConfig().catch(console.error);
```

## 🔧 Implementation Steps

### Step 1: Set Up Custom Domain
1. Configure custom domain in Vercel
2. Update DNS records
3. Update environment variables
4. Update Supabase auth URLs

### Step 2: Fix Migration Scripts
1. Review existing migration scripts
2. Remove destructive operations
3. Create safe migration files
4. Update deployment process

### Step 3: Update Environment Variables
1. Add stable domain URLs
2. Ensure NEXTAUTH_SECRET is set
3. Verify all auth-related variables

### Step 4: Test Authentication
1. Deploy with new configuration
2. Test user login/logout
3. Verify sessions persist across deployments
4. Test on multiple devices/browsers

## 🚨 Critical Checklist

- [ ] Custom domain configured and DNS updated
- [ ] NEXT_PUBLIC_SITE_URL points to custom domain
- [ ] NEXTAUTH_URL matches custom domain
- [ ] Supabase auth URLs updated to custom domain
- [ ] No destructive migrations in deployment scripts
- [ ] NEXTAUTH_SECRET is set and stable
- [ ] All environment variables use production values
- [ ] Test authentication after deployment

## 🎯 Expected Results

After implementing these fixes:

✅ **Users stay logged in** across deployments
✅ **Sessions persist** with stable domain
✅ **No data loss** from safe migrations
✅ **Consistent auth experience** for all users
✅ **Production-ready** authentication system

## 📞 Troubleshooting

### Issue: Still getting logged out
- Verify custom domain is properly configured
- Check Supabase auth URL configuration
- Ensure NEXTAUTH_SECRET hasn't changed

### Issue: Auth errors after deployment
- Check Vercel function logs
- Verify environment variables are set
- Test Supabase connection

### Issue: Database connection errors
- Verify Supabase credentials
- Check for destructive migrations
- Review RLS policies

---

**🚀 Once implemented, your authentication system will be deployment-proof and provide a seamless user experience!**