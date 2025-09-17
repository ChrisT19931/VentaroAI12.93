# 🔐 Supabase Authentication Data Management Guide

## Understanding Supabase Authentication Storage

Supabase stores authentication data in several tables within the `auth` schema. **This data persists across deployments and Git updates** because it's stored in your Supabase database, not in your application code.

### What Data Does Supabase Store?

#### 1. **auth.users** - User Accounts
- User IDs, emails, passwords (hashed)
- Account creation dates
- Last sign-in timestamps
- Email confirmation status
- User metadata

#### 2. **auth.sessions** - Active Sessions
- Session tokens
- User agents
- IP addresses
- Session creation/update times

#### 3. **auth.refresh_tokens** - Token Management
- Refresh tokens for maintaining sessions
- Token expiration dates
- Revocation status

#### 4. **auth.audit_log_entries** - Login History
- **This is where all login attempts are logged!**
- Login/logout events
- User signup events
- Token refresh events
- IP addresses and timestamps
- User agents

## Why Login Data Persists

🔍 **The Issue**: Even after multiple Git updates and deployments, Supabase continues to store:
- Every login attempt
- User session data
- Authentication audit trails
- User account information

🎯 **The Reason**: This data is stored in your Supabase database, which is **completely separate** from your application code. Git only manages your code, not your database.

## Solutions for Managing Authentication Data

### Option 1: Regular Cleanup (Recommended)

Use the provided cleanup script to regularly remove old authentication data:

```sql
-- Run this monthly to clean up old data
SELECT * FROM cleanup_auth_data(
    30,  -- Keep audit logs for 30 days
    7,   -- Keep sessions for 7 days  
    7    -- Keep refresh tokens for 7 days
);
```

### Option 2: Automated Cleanup

Set up automatic cleanup using the provided functions:

```sql
-- Schedule daily cleanup at 2 AM (if pg_cron is available)
SELECT cron.schedule('auth-cleanup', '0 2 * * *', 'SELECT cleanup_auth_data(30, 7, 7);');
```

### Option 3: Manual Data Removal

For immediate cleanup of specific data:

```sql
-- Remove audit logs older than 7 days
DELETE FROM auth.audit_log_entries 
WHERE created_at < NOW() - INTERVAL '7 days';

-- Remove old sessions
DELETE FROM auth.sessions 
WHERE created_at < NOW() - INTERVAL '7 days';

-- Remove revoked refresh tokens
DELETE FROM auth.refresh_tokens 
WHERE revoked = true;
```

### Option 4: Complete User Removal (GDPR Compliance)

To completely remove a user's data:

```sql
-- Remove all data for a specific user
SELECT delete_user_completely('user@example.com');
```

## Implementation Steps

### Step 1: Run the Cleanup Script

1. Open Supabase Dashboard
2. Go to **SQL Editor**
3. Copy and paste the contents of `supabase-auth-cleanup.sql`
4. Execute the script

### Step 2: Check Current Data

```sql
-- See current authentication statistics
SELECT * FROM get_auth_stats();

-- View recent login activity
SELECT 
    payload->>'user_email' as email,
    payload->>'action' as action,
    created_at,
    ip_address
FROM auth.audit_log_entries
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

### Step 3: Implement Regular Cleanup

Choose one of these approaches:

**Option A: Manual Monthly Cleanup**
- Set a calendar reminder
- Run the cleanup function monthly
- Monitor data growth

**Option B: Application-Level Cleanup**
- Add cleanup to your application's cron jobs
- Use Vercel cron or similar service
- Automate the process

**Option C: Database-Level Automation**
- Use pg_cron if available
- Set up automatic scheduled cleanup
- Monitor execution logs

## Data Retention Policies

### Recommended Retention Periods

| Data Type | Recommended Retention | Reason |
|-----------|----------------------|--------|
| Audit Logs | 30-90 days | Security compliance |
| Sessions | 7 days | Active user sessions |
| Refresh Tokens | 7 days | Token rotation |
| User Accounts | Indefinite | Core business data |

### Compliance Considerations

- **GDPR**: Users have the right to data deletion
- **Security**: Audit logs may be required for security analysis
- **Business**: Consider your specific retention requirements
- **Legal**: Check local data protection laws

## Monitoring and Alerts

### Set Up Monitoring

```sql
-- Create a view for monitoring data growth
CREATE VIEW auth_data_summary AS
SELECT 
    'users' as table_name,
    COUNT(*) as record_count,
    MIN(created_at) as oldest_record,
    MAX(created_at) as newest_record
FROM auth.users
UNION ALL
SELECT 
    'audit_log_entries',
    COUNT(*),
    MIN(created_at),
    MAX(created_at)
FROM auth.audit_log_entries
UNION ALL
SELECT 
    'sessions',
    COUNT(*),
    MIN(created_at),
    MAX(created_at)
FROM auth.sessions;
```

### Alert Thresholds

- **Audit logs > 10,000 entries**: Consider cleanup
- **Sessions > 1,000 active**: Check for issues
- **Data older than 90 days**: Review retention policy

## Security Best Practices

### 1. Access Control
- Limit who can access authentication data
- Use service role keys carefully
- Monitor admin access

### 2. Data Minimization
- Only store necessary authentication data
- Regular cleanup of old data
- Consider anonymization for analytics

### 3. Audit Trail
- Keep some audit data for security
- Monitor for suspicious login patterns
- Log cleanup operations

## Troubleshooting

### Common Issues

**Issue**: "Cannot delete from auth tables"
**Solution**: Use service role key, not anon key

**Issue**: "Foreign key constraint violations"
**Solution**: Delete from custom tables first, then auth tables

**Issue**: "Permission denied"
**Solution**: Ensure you have admin access to Supabase project

### Verification Queries

```sql
-- Check if cleanup worked
SELECT 
    COUNT(*) as total_audit_entries,
    MIN(created_at) as oldest_entry,
    MAX(created_at) as newest_entry
FROM auth.audit_log_entries;

-- Check active sessions
SELECT COUNT(*) as active_sessions
FROM auth.sessions
WHERE updated_at > NOW() - INTERVAL '24 hours';
```

## Next Steps

1. **Immediate**: Run the cleanup script to remove old data
2. **Short-term**: Set up regular cleanup schedule
3. **Long-term**: Implement monitoring and alerting
4. **Ongoing**: Review and adjust retention policies

## Files Created

- `supabase-auth-cleanup.sql` - Complete cleanup script
- `SUPABASE_AUTH_DATA_MANAGEMENT.md` - This guide

## Support

If you need help implementing these solutions:
1. Test all operations in development first
2. Backup your database before major cleanup operations
3. Monitor the effects of cleanup on your application
4. Adjust retention periods based on your specific needs

---

**Remember**: Supabase authentication data persistence is by design for security and user experience. The key is managing it properly rather than trying to prevent it entirely.