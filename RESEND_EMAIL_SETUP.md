# Resend Email Setup Guide (Part of Three-Tier System)

## Overview

This guide helps you set up **Resend** as part of our **three-tier email backup system**. Resend serves as the secondary fallback when SendGrid (primary) is unavailable.

## 🛡️ Three-Tier Email System

```
SendGrid (Primary) → Resend (Secondary) → Mailgun (Tertiary) → Supabase (Backup)
```

> **📋 For complete setup**: See [THREE_TIER_EMAIL_BACKUP_SETUP.md](./THREE_TIER_EMAIL_BACKUP_SETUP.md)

## Why Resend?

- ✅ **Reliable**: 99.9% uptime SLA
- ✅ **Developer-friendly**: Simple, modern API
- ✅ **Free tier**: 100 emails/day, 3,000/month
- ✅ **Fast setup**: Get running in minutes
- ✅ **Great deliverability**: Built by email experts
- ✅ **Perfect backup**: Excellent secondary service

## Quick Setup (5 minutes)

### Step 1: Create Resend Account
1. Go to [resend.com](https://resend.com)
2. Sign up for a free account (100 emails/day free tier)
3. Verify your email address

### Step 2: Get Your API Key
1. In your Resend dashboard, go to **API Keys**
2. Click **Create API Key**
3. Name it "VAI35 Production" or similar
4. Select **Sending access** (recommended for security)
5. Copy the API key (starts with `re_`)

### Step 3: Update Environment Variables
Replace the placeholder in your `.env.local` file:

```bash
# Replace this line:
RESEND_API_KEY=your_resend_api_key

# With your actual API key:
RESEND_API_KEY=re_your_actual_api_key_here
```

### Step 4: Set Up Domain (Optional but Recommended)
1. In Resend dashboard, go to **Domains**
2. Add your domain (e.g., `ventaroai.com`)
3. Add the DNS records they provide
4. Once verified, update your from email:

```bash
# Update this in .env.local:
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

## ✅ That's It!

Your email system will now:
1. ✅ Try Resend first (since SendGrid is offline)
2. ✅ Fall back to backup storage if Resend fails
3. ✅ Store all emails in Supabase for record keeping
4. ✅ Send both admin notifications and customer auto-replies

## 🔧 Current Email Flow

```
Contact Form Submission
        ↓
   Try SendGrid (offline) ❌
        ↓
   Try Resend ✅
        ↓
   Store in Supabase backup ✅
        ↓
   Send to admin & customer ✅
```

## 📊 Free Tier Limits
- **100 emails/day** (more than enough for contact forms)
- **Unlimited domains**
- **Email analytics**
- **99.9% uptime SLA**

## 🆘 Need Help?
If you need more emails or have issues:
1. Check the console logs for detailed error messages
2. Verify your API key is correct
3. Check Resend dashboard for delivery status
4. All failed emails are stored in Supabase `backup_emails` table

## 🔄 Switching Back to SendGrid Later
When SendGrid is back online, just update your `.env.local`:
```bash
SENDGRID_API_KEY=your_working_sendgrid_key
```

The system will automatically prefer SendGrid over Resend when both are available.