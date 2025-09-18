-- ============================================================
-- BACKUP EMAIL SYSTEM SETUP
-- ============================================================
-- This script sets up a comprehensive backup email system
-- that stores emails when SendGrid is unavailable
-- ============================================================

-- Create backup_emails table
CREATE TABLE IF NOT EXISTS public.backup_emails (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    to_email TEXT NOT NULL,
    from_email TEXT NOT NULL DEFAULT 'noreply@ventaroai.com',
    subject TEXT NOT NULL,
    text_content TEXT,
    html_content TEXT,
    email_type TEXT NOT NULL CHECK (email_type IN ('contact', 'subscription', 'newsletter', 'web-design', 'support', 'membership')),
    form_data JSONB DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    attempts INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_notifications table
CREATE TABLE IF NOT EXISTS public.admin_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_backup_emails_status ON public.backup_emails(status);
CREATE INDEX IF NOT EXISTS idx_backup_emails_type ON public.backup_emails(email_type);
CREATE INDEX IF NOT EXISTS idx_backup_emails_created_at ON public.backup_emails(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_status ON public.admin_notifications(status);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_type ON public.admin_notifications(type);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_created_at ON public.admin_notifications(created_at);

-- Enable Row Level Security
ALTER TABLE public.backup_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for backup_emails
CREATE POLICY "Service role can manage backup emails" ON public.backup_emails
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Authenticated users can view their backup emails" ON public.backup_emails
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create RLS policies for admin_notifications
CREATE POLICY "Service role can manage admin notifications" ON public.admin_notifications
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Authenticated users can view admin notifications" ON public.admin_notifications
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_backup_emails_updated_at BEFORE UPDATE ON public.backup_emails
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to get backup email statistics
CREATE OR REPLACE FUNCTION get_backup_email_stats(days_back INTEGER DEFAULT 7)
RETURNS TABLE (
    total_emails BIGINT,
    pending_emails BIGINT,
    sent_emails BIGINT,
    failed_emails BIGINT,
    contact_emails BIGINT,
    subscription_emails BIGINT,
    newsletter_emails BIGINT,
    web_design_emails BIGINT,
    support_emails BIGINT,
    membership_emails BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_emails,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_emails,
        COUNT(CASE WHEN status = 'sent' THEN 1 END) as sent_emails,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_emails,
        COUNT(CASE WHEN email_type = 'contact' THEN 1 END) as contact_emails,
        COUNT(CASE WHEN email_type = 'subscription' THEN 1 END) as subscription_emails,
        COUNT(CASE WHEN email_type = 'newsletter' THEN 1 END) as newsletter_emails,
        COUNT(CASE WHEN email_type = 'web-design' THEN 1 END) as web_design_emails,
        COUNT(CASE WHEN email_type = 'support' THEN 1 END) as support_emails,
        COUNT(CASE WHEN email_type = 'membership' THEN 1 END) as membership_emails
    FROM public.backup_emails
    WHERE created_at >= NOW() - (days_back || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cleanup old processed emails
CREATE OR REPLACE FUNCTION cleanup_old_backup_emails(days_old INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
BEGIN
    DELETE FROM public.backup_emails
    WHERE status IN ('sent', 'failed')
    AND processed_at < NOW() - (days_old || ' days')::INTERVAL;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    INSERT INTO public.admin_notifications (type, title, message, data)
    VALUES (
        'system',
        'Backup Email Cleanup',
        'Cleaned up ' || deleted_count || ' old backup emails',
        jsonb_build_object('deleted_count', deleted_count, 'days_old', days_old)
    );
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to retry failed backup emails
CREATE OR REPLACE FUNCTION retry_failed_backup_emails(max_attempts INTEGER DEFAULT 3)
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER := 0;
BEGIN
    UPDATE public.backup_emails
    SET 
        status = 'pending',
        attempts = attempts + 1,
        error_message = NULL,
        updated_at = NOW()
    WHERE status = 'failed'
    AND attempts < max_attempts
    AND created_at >= NOW() - INTERVAL '24 hours'; -- Only retry recent failures
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    
    INSERT INTO public.admin_notifications (type, title, message, data)
    VALUES (
        'system',
        'Backup Email Retry',
        'Retrying ' || updated_count || ' failed backup emails',
        jsonb_build_object('retried_count', updated_count, 'max_attempts', max_attempts)
    );
    
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default admin notification for system setup
INSERT INTO public.admin_notifications (type, title, message, data)
VALUES (
    'system',
    'Backup Email System Initialized',
    'The backup email system has been successfully set up and is ready to handle email fallbacks when SendGrid is unavailable.',
    jsonb_build_object(
        'setup_date', NOW(),
        'features', ARRAY[
            'Email backup storage',
            'Admin notifications',
            'Automatic retry system',
            'Statistics tracking',
            'Cleanup functions'
        ]
    )
);

-- Create a view for easy email monitoring
CREATE OR REPLACE VIEW backup_email_summary AS
SELECT 
    email_type,
    status,
    COUNT(*) as count,
    MIN(created_at) as oldest_email,
    MAX(created_at) as newest_email,
    AVG(attempts) as avg_attempts
FROM public.backup_emails
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY email_type, status
ORDER BY email_type, status;

-- Grant necessary permissions
GRANT SELECT ON backup_email_summary TO authenticated;
GRANT EXECUTE ON FUNCTION get_backup_email_stats(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_old_backup_emails(INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION retry_failed_backup_emails(INTEGER) TO service_role;

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- Check if tables were created successfully
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE tablename IN ('backup_emails', 'admin_notifications')
ORDER BY tablename;

-- Check backup email statistics
SELECT * FROM get_backup_email_stats(30);

-- Check admin notifications
SELECT 
    type,
    title,
    status,
    created_at
FROM public.admin_notifications
ORDER BY created_at DESC
LIMIT 5;

-- Check backup email summary
SELECT * FROM backup_email_summary;

-- ============================================================
-- SUCCESS MESSAGE
-- ============================================================
-- If you see the tables and functions listed above, the backup email system is ready!
--
-- Your backup email system now includes:
-- ✅ backup_emails table for storing failed emails
-- ✅ admin_notifications table for system alerts
-- ✅ Automatic retry mechanisms
-- ✅ Statistics and monitoring functions
-- ✅ Cleanup and maintenance functions
-- ✅ Row Level Security policies
-- ✅ Performance indexes
-- ✅ Monitoring views
--
-- Next steps:
-- 1. Update your API routes to use the backup email system
-- 2. Set up a cron job to process backup emails
-- 3. Monitor the admin_notifications table for alerts
-- 4. Test the system by submitting forms when SendGrid is disabled
-- ============================================================