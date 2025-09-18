-- Create password reset logs table for security tracking
CREATE TABLE IF NOT EXISTS password_reset_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  reset_requested_at TIMESTAMPTZ DEFAULT NOW(),
  reset_completed_at TIMESTAMPTZ,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_password_reset_logs_email ON password_reset_logs(email);
CREATE INDEX IF NOT EXISTS idx_password_reset_logs_created_at ON password_reset_logs(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE password_reset_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access only
CREATE POLICY "Admin can view all password reset logs" ON password_reset_logs
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Create policy for service role access
CREATE POLICY "Service role can manage password reset logs" ON password_reset_logs
  FOR ALL USING (auth.role() = 'service_role');

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_password_reset_logs_updated_at BEFORE UPDATE ON password_reset_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comment for documentation
COMMENT ON TABLE password_reset_logs IS 'Tracks password reset requests and completions for security monitoring';
COMMENT ON COLUMN password_reset_logs.email IS 'Email address of the user requesting password reset';
COMMENT ON COLUMN password_reset_logs.reset_requested_at IS 'Timestamp when password reset was requested';
COMMENT ON COLUMN password_reset_logs.reset_completed_at IS 'Timestamp when password reset was completed';
COMMENT ON COLUMN password_reset_logs.ip_address IS 'IP address of the request';
COMMENT ON COLUMN password_reset_logs.user_agent IS 'User agent string of the request';