# Backup Email System Documentation

## Overview

This backup email system provides a robust fallback mechanism for when SendGrid fails or is unavailable. It uses Supabase as the backup storage and notification system, ensuring that no emails are lost and administrators are always notified of form submissions.

## Features

✅ **Automatic Fallback**: Seamlessly switches to backup when SendGrid fails  
✅ **Email Storage**: All emails are stored in Supabase for audit trails  
✅ **Admin Notifications**: Immediate notifications when backup system is used  
✅ **Retry Mechanism**: Automatic retry of failed emails  
✅ **Statistics & Monitoring**: Comprehensive tracking of email success/failure rates  
✅ **API Management**: RESTful API for monitoring and managing backup emails  

## System Architecture

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│   Form Submit   │───▶│  SendGrid    │───▶│   Email Sent    │
│                 │    │   (Primary)  │    │                 │
└─────────────────┘    └──────────────┘    └─────────────────┘
         │                       │
         │                       ▼ (if fails)
         │              ┌──────────────┐
         │              │   Supabase   │
         └──────────────▶│   (Backup)   │
                         └──────────────┘
                                │
                                ▼
                    ┌─────────────────────┐
                    │  Admin Notification │
                    │   + Email Storage   │
                    └─────────────────────┘
```

## Files Created/Modified

### New Files
- `src/lib/backup-email.ts` - Core backup email functionality
- `scripts/setup-backup-email-system.sql` - Database setup
- `src/app/api/backup-emails/route.ts` - API for managing backup emails
- `scripts/test-all-forms-and-emails.js` - Comprehensive testing script
- `BACKUP_EMAIL_SYSTEM.md` - This documentation

### Modified Files
- `src/app/api/contact/route.ts` - Updated to use backup system
- `src/app/api/newsletter/subscribe/route.ts` - Updated to use backup system
- `src/app/api/subscription-interest/route.ts` - Updated to use backup system
- `src/app/api/web-design-inquiry/route.ts` - Updated to use backup system
- `src/app/api/membership/checkout/route.ts` - Updated to use backup system

## Setup Instructions

### 1. Database Setup

Run the SQL setup script to create necessary tables and functions:

```bash
# Connect to your Supabase database and run:
psql -h your-supabase-host -U postgres -d postgres -f scripts/setup-backup-email-system.sql
```

Or copy and paste the contents of `scripts/setup-backup-email-system.sql` into your Supabase SQL editor.

### 2. Environment Variables

Ensure these environment variables are set in your `.env.local`:

```env
# Supabase (required for backup system)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# SendGrid (primary email service)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@ventaroai.com

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3003
```

### 3. Test the System

Run the comprehensive test script:

```bash
# Test all forms and email systems
node scripts/test-all-forms-and-emails.js

# Test specific form
node scripts/test-all-forms-and-emails.js contact
node scripts/test-all-forms-and-emails.js newsletter
node scripts/test-all-forms-and-emails.js subscription
node scripts/test-all-forms-and-emails.js webdesign
node scripts/test-all-forms-and-emails.js backup
```

## API Endpoints

### Backup Email Management API

**Base URL**: `/api/backup-emails`

#### GET Requests

```bash
# Get system statistics
GET /api/backup-emails?action=stats

# Get pending emails (limit 50)
GET /api/backup-emails?action=pending&limit=50

# Get all emails (limit 50)
GET /api/backup-emails?action=all&limit=50

# Get system status
GET /api/backup-emails
```

#### POST Requests

```bash
# Process pending backup emails
POST /api/backup-emails
Content-Type: application/json
{
  "action": "process"
}

# Mark email as processed
POST /api/backup-emails
Content-Type: application/json
{
  "action": "mark-processed",
  "emailId": "uuid",
  "status": "sent",
  "error": "optional error message"
}
```

#### DELETE Requests

```bash
# Clean up emails older than 30 days
DELETE /api/backup-emails?days=30

# Delete specific email
DELETE /api/backup-emails?id=email-uuid
```

## Form Integration

All forms now use the `sendEmailWithBackup` function instead of direct SendGrid calls:

```typescript
import { sendEmailWithBackup } from '@/lib/backup-email';

// Example usage
const result = await sendEmailWithBackup({
  to: 'recipient@example.com',
  from: 'noreply@ventaroai.com',
  subject: 'Your Subject',
  html: '<p>Your HTML content</p>',
  type: 'contact', // Form type for categorization
  formData: {
    // Original form data for backup storage
    name: 'User Name',
    email: 'user@example.com',
    message: 'User message'
  }
});

if (result.success) {
  console.log('Email sent successfully');
} else {
  console.log('Email failed, stored in backup system');
}
```

## Monitoring & Maintenance

### Daily Monitoring

1. **Check Email Statistics**:
   ```bash
   curl "http://localhost:3003/api/backup-emails?action=stats"
   ```

2. **Process Pending Emails**:
   ```bash
   curl -X POST "http://localhost:3003/api/backup-emails" \
        -H "Content-Type: application/json" \
        -d '{"action": "process"}'
   ```

### Weekly Maintenance

1. **Clean Up Old Emails**:
   ```bash
   curl -X DELETE "http://localhost:3003/api/backup-emails?days=30"
   ```

2. **Run Full System Test**:
   ```bash
   node scripts/test-all-forms-and-emails.js
   ```

### Database Queries

```sql
-- Check backup email statistics
SELECT 
  status,
  COUNT(*) as count,
  DATE(created_at) as date
FROM backup_emails 
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY status, DATE(created_at)
ORDER BY date DESC;

-- Get recent failed emails
SELECT *
FROM backup_emails
WHERE status = 'failed'
AND created_at >= NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- Get admin notifications
SELECT *
FROM admin_notifications
WHERE created_at >= NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
```

## Troubleshooting

### Common Issues

1. **SendGrid API Key Issues**:
   - Check if `SENDGRID_API_KEY` is set correctly
   - Verify API key permissions in SendGrid dashboard
   - Check if key is not expired

2. **Supabase Connection Issues**:
   - Verify `SUPABASE_SERVICE_ROLE_KEY` is set
   - Check Supabase project URL and keys
   - Ensure RLS policies allow service role access

3. **Database Table Missing**:
   - Run the setup SQL script: `scripts/setup-backup-email-system.sql`
   - Check if tables exist in Supabase dashboard

4. **Emails Not Being Sent**:
   - Check logs for error messages
   - Verify email addresses are valid
   - Test with the testing script

### Debug Mode

Enable detailed logging by setting:

```env
NODE_ENV=development
```

This will show detailed console logs for email sending attempts.

## Security Considerations

- All email data is stored securely in Supabase
- RLS (Row Level Security) policies protect data access
- Service role key is used for admin operations
- Email content is sanitized before storage
- Admin notifications don't include sensitive data

## Performance

- Backup emails are processed asynchronously
- Database cleanup runs automatically via cron functions
- Email retry logic prevents infinite loops
- Statistics are cached for better performance

## Support

For issues or questions:
1. Check the logs in your application
2. Run the test script to identify problems
3. Check Supabase dashboard for database issues
4. Review SendGrid dashboard for API issues

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Compatibility**: Next.js 14+, Supabase, SendGrid