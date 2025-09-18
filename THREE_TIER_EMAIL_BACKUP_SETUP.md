# Three-Tier Email Backup System Setup Guide

## Overview

This system provides **triple redundancy** for email delivery with automatic fallback:

1. **Primary**: SendGrid (when available)
2. **Secondary**: Resend (when SendGrid fails)
3. **Tertiary**: Mailgun (when both SendGrid and Resend fail)
4. **Final Backup**: Supabase storage (when all services fail)

## Email Service Hierarchy

```
SendGrid → Resend → Mailgun → Supabase Backup
   ↓         ↓        ↓           ↓
 Primary   Secondary Tertiary   Storage
```

## Setup Instructions

### 1. SendGrid Setup (Primary)

1. **Create Account**: Visit [SendGrid](https://sendgrid.com)
2. **Get API Key**: Go to Settings → API Keys → Create API Key
3. **Verify Domain**: Add and verify your sending domain
4. **Update Environment**:
   ```bash
   SENDGRID_API_KEY=SG.your_actual_sendgrid_api_key
   SENDGRID_FROM_EMAIL=noreply@yourdomain.com
   ```

### 2. Resend Setup (Secondary)

1. **Create Account**: Visit [Resend](https://resend.com)
2. **Get API Key**: Go to API Keys → Create API Key
3. **Add Domain** (optional): Add your domain for better deliverability
4. **Update Environment**:
   ```bash
   RESEND_API_KEY=re_your_actual_resend_api_key
   ```

### 3. Mailgun Setup (Tertiary - NEW)

1. **Create Account**: Visit [Mailgun](https://www.mailgun.com)
2. **Get API Key**: Go to Settings → API Keys
3. **Get Domain**: Go to Sending → Domains (use sandbox domain for testing)
4. **Update Environment**:
   ```bash
   MAILGUN_API_KEY=your_mailgun_api_key_here
   MAILGUN_DOMAIN=sandbox123.mailgun.org  # or your verified domain
   ```

### 4. Environment Configuration

Update your `.env.local` file:

```bash
# Email Configuration - Primary
SENDGRID_API_KEY=SG.your_actual_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# Resend Configuration - Secondary
RESEND_API_KEY=re_your_actual_resend_api_key

# Mailgun Configuration - Tertiary
MAILGUN_API_KEY=your_mailgun_api_key_here
MAILGUN_DOMAIN=your_mailgun_domain.com
```

## How It Works

### Automatic Fallback Logic

1. **SendGrid First**: System attempts to send via SendGrid
   - ✅ Success: Email sent, stored in backup for records
   - ❌ Failure: Falls back to Resend

2. **Resend Second**: If SendGrid fails
   - ✅ Success: Email sent via Resend, stored in backup
   - ❌ Failure: Falls back to Mailgun

3. **Mailgun Third**: If both SendGrid and Resend fail
   - ✅ Success: Email sent via Mailgun, stored in backup
   - ❌ Failure: Falls back to Supabase storage

4. **Supabase Backup**: Final fallback
   - Stores email in database for manual processing
   - Sends admin notification about failed delivery
   - Email can be processed later when services recover

### Email Flow Diagram

```
[Contact Form] → [sendEmailWithBackup()]
       ↓
   Try SendGrid
       ↓
   ❌ Failed? → Try Resend
                    ↓
                ❌ Failed? → Try Mailgun
                                ↓
                            ❌ Failed? → Store in Supabase
                                            ↓
                                        Notify Admin
```

## Service Comparison

| Service  | Free Tier | Reliability | Setup Difficulty | API Quality |
|----------|-----------|-------------|------------------|-------------|
| SendGrid | 100/day   | High        | Medium           | Excellent   |
| Resend   | 100/day   | High        | Easy             | Excellent   |
| Mailgun  | 100/day   | High        | Medium           | Good        |
| Supabase | Unlimited | N/A         | Easy             | Storage     |

## Testing the System

### 1. Test Individual Services

```bash
# Test the complete system
node scripts/test-email.js
```

### 2. Test Fallback Behavior

1. **Disable SendGrid**: Set `SENDGRID_API_KEY=disabled`
2. **Test**: Should fall back to Resend
3. **Disable Resend**: Set `RESEND_API_KEY=disabled`
4. **Test**: Should fall back to Mailgun
5. **Disable Mailgun**: Set `MAILGUN_API_KEY=disabled`
6. **Test**: Should store in Supabase backup

### 3. Monitor Logs

Watch for these log messages:
- `✅ SENDGRID: Email sent successfully`
- `✅ RESEND: Email sent successfully`
- `✅ MAILGUN: Email sent successfully`
- `📧 BACKUP EMAIL: Using backup email system`

## Troubleshooting

### Common Issues

1. **SendGrid 403 Error**
   - Check API key permissions
   - Verify sender email is authenticated

2. **Resend Domain Error**
   - Use default domain or verify custom domain
   - Check API key format (starts with 're_')

3. **Mailgun 401 Error**
   - Verify API key is correct
   - Check domain name matches Mailgun dashboard

4. **All Services Failing**
   - Check internet connection
   - Verify environment variables are loaded
   - Check Supabase backup table exists

### Debug Commands

```bash
# Check environment variables
node -e "console.log(process.env.SENDGRID_API_KEY ? 'SendGrid: Set' : 'SendGrid: Missing')"
node -e "console.log(process.env.RESEND_API_KEY ? 'Resend: Set' : 'Resend: Missing')"
node -e "console.log(process.env.MAILGUN_API_KEY ? 'Mailgun: Set' : 'Mailgun: Missing')"

# Test database connection
node scripts/test-db-connection.js
```

## Benefits of Three-Tier System

### 🛡️ **Maximum Reliability**
- 99.9%+ uptime with triple redundancy
- Automatic failover in milliseconds
- No single point of failure

### 📊 **Cost Effective**
- Use free tiers of multiple services
- 300 emails/day total (100 each service)
- Pay only for what you use

### 🔧 **Easy Management**
- Single function handles all fallbacks
- Centralized logging and monitoring
- Automatic backup and recovery

### 📈 **Scalable**
- Add more services easily
- Handle traffic spikes gracefully
- Distribute load across providers

## Monitoring and Analytics

### Email Delivery Stats

```bash
# Check backup email statistics
node -e "require('./src/lib/backup-email').getBackupEmailStats().then(console.log)"
```

### Success Rates by Service

The system automatically tracks:
- SendGrid success/failure rate
- Resend success/failure rate
- Mailgun success/failure rate
- Backup storage usage

## Next Steps

1. **Get API Keys**: Sign up for all three services
2. **Update Environment**: Add all API keys to `.env.local`
3. **Test System**: Run the test script
4. **Monitor Performance**: Check logs and success rates
5. **Scale Up**: Upgrade to paid plans as needed

## Support

If you encounter issues:
1. Check the troubleshooting section
2. Review service-specific documentation
3. Test individual services separately
4. Check Supabase backup table for stored emails

---

**Your email system is now bulletproof with triple redundancy! 🚀**