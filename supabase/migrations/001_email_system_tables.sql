-- Create email_logs table for tracking all email communications
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  to_email VARCHAR(255) NOT NULL,
  from_email VARCHAR(255) NOT NULL,
  subject TEXT NOT NULL,
  text_content TEXT,
  html_content TEXT,
  email_type VARCHAR(50) NOT NULL CHECK (email_type IN ('contact', 'subscription', 'newsletter', 'web-design', 'support', 'membership', 'quote_request')),
  form_data JSONB DEFAULT '{}',
  status VARCHAR(20) NOT NULL CHECK (status IN ('sent', 'failed', 'pending')) DEFAULT 'pending',
  message_id VARCHAR(255),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact_submissions table for storing form submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  subject TEXT,
  message TEXT,
  product VARCHAR(255),
  project_type VARCHAR(100),
  services TEXT,
  timeline VARCHAR(100),
  budget VARCHAR(100),
  business_stage VARCHAR(100),
  form_data JSONB DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'in_progress', 'completed', 'cancelled')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create backup_emails table for email fallback system (if not exists)
CREATE TABLE IF NOT EXISTS backup_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  to_email VARCHAR(255) NOT NULL,
  from_email VARCHAR(255) NOT NULL,
  subject TEXT NOT NULL,
  text_content TEXT,
  html_content TEXT,
  email_type VARCHAR(50) NOT NULL,
  form_data JSONB DEFAULT '{}',
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'sent', 'failed')) DEFAULT 'pending',
  attempts INTEGER DEFAULT 0,
  last_attempt_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON email_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_email_type ON email_logs(email_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_to_email ON email_logs(to_email);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_project_type ON contact_submissions(project_type);

CREATE INDEX IF NOT EXISTS idx_backup_emails_status ON backup_emails(status);
CREATE INDEX IF NOT EXISTS idx_backup_emails_created_at ON backup_emails(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_email_logs_updated_at ON email_logs;
CREATE TRIGGER update_email_logs_updated_at
    BEFORE UPDATE ON email_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_contact_submissions_updated_at ON contact_submissions;
CREATE TRIGGER update_contact_submissions_updated_at
    BEFORE UPDATE ON contact_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_backup_emails_updated_at ON backup_emails;
CREATE TRIGGER update_backup_emails_updated_at
    BEFORE UPDATE ON backup_emails
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE backup_emails ENABLE ROW LEVEL SECURITY;

-- Create policies for service role access
CREATE POLICY "Service role can manage email_logs" ON email_logs
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage contact_submissions" ON contact_submissions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage backup_emails" ON backup_emails
  FOR ALL USING (auth.role() = 'service_role');

-- Create policies for authenticated users (admin access)
CREATE POLICY "Authenticated users can read email_logs" ON email_logs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read contact_submissions" ON contact_submissions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update contact_submissions" ON contact_submissions
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Insert some sample data for testing (optional)
-- INSERT INTO contact_submissions (name, email, subject, message, project_type, timeline, budget)
-- VALUES 
--   ('Test User', 'test@example.com', 'Test Inquiry', 'This is a test message', 'saas', '1-2weeks', '1k-5k'),
--   ('Jane Doe', 'jane@example.com', 'AI Chatbot Request', 'Need help with customer service automation', 'chatbot', '3-4weeks', '5k-15k');

-- Create a view for easy email analytics
CREATE OR REPLACE VIEW email_analytics AS
SELECT 
  email_type,
  status,
  COUNT(*) as count,
  DATE_TRUNC('day', created_at) as date
FROM email_logs
GROUP BY email_type, status, DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- Create a view for contact submission analytics
CREATE OR REPLACE VIEW contact_analytics AS
SELECT 
  project_type,
  timeline,
  budget,
  status,
  COUNT(*) as count,
  DATE_TRUNC('day', created_at) as date
FROM contact_submissions
WHERE project_type IS NOT NULL
GROUP BY project_type, timeline, budget, status, DATE_TRUNC('day', created_at)
ORDER BY date DESC;

COMMIT;