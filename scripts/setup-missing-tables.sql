-- =====================================================
-- SETUP MISSING TABLES FOR EMAIL SYSTEM
-- =====================================================
-- Run this in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. NEWSLETTER SUBSCRIPTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    source VARCHAR(100) DEFAULT 'website',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON public.newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_active ON public.newsletter_subscriptions(is_active);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribed ON public.newsletter_subscriptions(subscribed_at);

-- Enable Row Level Security
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Service role can manage newsletter subscriptions" ON public.newsletter_subscriptions
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admin can view newsletter subscriptions" ON public.newsletter_subscriptions
    FOR SELECT USING (auth.jwt() ->> 'email' = 'chris.t@ventarosales.com');

-- =====================================================
-- 2. UPDATE CONTACT SUBMISSIONS TABLE
-- =====================================================
-- Add missing columns to contact_submissions table if they don't exist
ALTER TABLE public.contact_submissions 
ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS company VARCHAR(255),
ADD COLUMN IF NOT EXISTS project_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS services TEXT,
ADD COLUMN IF NOT EXISTS timeline VARCHAR(100),
ADD COLUMN IF NOT EXISTS budget VARCHAR(100),
ADD COLUMN IF NOT EXISTS business_stage VARCHAR(100),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_contact_project_type ON public.contact_submissions(project_type);
CREATE INDEX IF NOT EXISTS idx_contact_timeline ON public.contact_submissions(timeline);
CREATE INDEX IF NOT EXISTS idx_contact_phone ON public.contact_submissions(phone);
CREATE INDEX IF NOT EXISTS idx_contact_company ON public.contact_submissions(company);

-- =====================================================
-- 3. CREATE TRIGGERS FOR UPDATED_AT
-- =====================================================
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at trigger for newsletter_subscriptions
DROP TRIGGER IF EXISTS update_newsletter_updated_at ON public.newsletter_subscriptions;
CREATE TRIGGER update_newsletter_updated_at 
    BEFORE UPDATE ON public.newsletter_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add updated_at trigger for contact_submissions
DROP TRIGGER IF EXISTS update_contact_updated_at ON public.contact_submissions;
CREATE TRIGGER update_contact_updated_at 
    BEFORE UPDATE ON public.contact_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 4. VERIFY TABLES EXIST
-- =====================================================
-- Check if tables were created successfully
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('newsletter_subscriptions', 'contact_submissions')
ORDER BY tablename;

-- Show column information for verification
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('newsletter_subscriptions', 'contact_submissions')
ORDER BY table_name, ordinal_position;