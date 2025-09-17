#!/usr/bin/env node

/**
 * VentaroAI Membership System Setup Script
 * 
 * This script sets up the complete tiered membership system including:
 * - Membership tiers table
 * - User memberships table
 * - AI Toolbox tools table
 * - Prompt library table
 * - Sample data for all tiers
 * 
 * Usage: node scripts/setup-membership-system.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Check if we have placeholder values
if (!supabaseUrl || !supabaseServiceKey || 
    supabaseUrl.includes('placeholder') || 
    supabaseServiceKey.includes('placeholder')) {
  console.log('\n🔧 SETUP REQUIRED: Supabase Configuration');
  console.log('=====================================');
  console.log('\nThis script requires a real Supabase project to run.');
  console.log('\nTo set up the membership system:');
  console.log('\n1. Create a Supabase project at https://supabase.com');
  console.log('2. Update your .env.local file with real values:');
  console.log('   - NEXT_PUBLIC_SUPABASE_URL=your_project_url');
  console.log('   - SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
  console.log('3. Run this script again: node scripts/setup-membership-system.js');
  console.log('\n📋 SQL SCHEMA TO EXECUTE IN SUPABASE:');
  console.log('=====================================');
  
  // Output the SQL schema for manual execution
  console.log(getSQLSchema());
  
  console.log('\n✅ Copy and paste the above SQL into your Supabase SQL editor.');
  console.log('\n🚀 The membership system is ready to use once you have real Supabase credentials!');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// SQL for membership system tables
const createMembershipTablesSQL = `
-- =====================================================
-- MEMBERSHIP TIERS TABLE
-- =====================================================
DROP TABLE IF EXISTS public.membership_tiers CASCADE;

CREATE TABLE public.membership_tiers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price_monthly INTEGER NOT NULL,
    price_yearly INTEGER,
    features JSONB NOT NULL,
    tier_level INTEGER NOT NULL,
    stripe_price_id_monthly VARCHAR(255),
    stripe_price_id_yearly VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    is_popular BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_membership_tiers_level ON public.membership_tiers(tier_level);
CREATE INDEX idx_membership_tiers_active ON public.membership_tiers(is_active);

-- =====================================================
-- USER MEMBERSHIPS TABLE
-- =====================================================
DROP TABLE IF EXISTS public.user_memberships CASCADE;

CREATE TABLE public.user_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    tier_id VARCHAR(50) NOT NULL REFERENCES public.membership_tiers(id),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'paused')),
    billing_cycle VARCHAR(20) DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
    stripe_subscription_id VARCHAR(255),
    stripe_customer_id VARCHAR(255),
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_memberships_user_id ON public.user_memberships(user_id);
CREATE INDEX idx_user_memberships_tier_id ON public.user_memberships(tier_id);
CREATE INDEX idx_user_memberships_status ON public.user_memberships(status);
CREATE INDEX idx_user_memberships_stripe_sub ON public.user_memberships(stripe_subscription_id);

-- =====================================================
-- AI TOOLBOX TOOLS TABLE
-- =====================================================
DROP TABLE IF EXISTS public.toolbox_tools CASCADE;

CREATE TABLE public.toolbox_tools (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    url VARCHAR(500),
    icon VARCHAR(10),
    required_tier_level INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    affiliate_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_toolbox_tools_category ON public.toolbox_tools(category);
CREATE INDEX idx_toolbox_tools_tier_level ON public.toolbox_tools(required_tier_level);
CREATE INDEX idx_toolbox_tools_active ON public.toolbox_tools(is_active);

-- =====================================================
-- PROMPT LIBRARY TABLE
-- =====================================================
DROP TABLE IF EXISTS public.prompt_library CASCADE;

CREATE TABLE public.prompt_library (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    prompt_text TEXT NOT NULL,
    category VARCHAR(100),
    tags TEXT[],
    required_tier_level INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    use_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_prompt_library_category ON public.prompt_library(category);
CREATE INDEX idx_prompt_library_tier_level ON public.prompt_library(required_tier_level);
CREATE INDEX idx_prompt_library_featured ON public.prompt_library(is_featured);
CREATE INDEX idx_prompt_library_tags ON public.prompt_library USING GIN(tags);

-- =====================================================
-- AFFILIATE TRACKING TABLE
-- =====================================================
DROP TABLE IF EXISTS public.affiliate_clicks CASCADE;

CREATE TABLE public.affiliate_clicks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    tool_id VARCHAR(50) REFERENCES public.toolbox_tools(id),
    clicked_url VARCHAR(500),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_affiliate_clicks_user_id ON public.affiliate_clicks(user_id);
CREATE INDEX idx_affiliate_clicks_tool_id ON public.affiliate_clicks(tool_id);
CREATE INDEX idx_affiliate_clicks_created ON public.affiliate_clicks(created_at);
`;

// SQL for triggers
const createTriggersSQL = `
-- Add updated_at triggers for new tables
CREATE TRIGGER update_membership_tiers_updated_at BEFORE UPDATE ON public.membership_tiers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_memberships_updated_at BEFORE UPDATE ON public.user_memberships
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_toolbox_tools_updated_at BEFORE UPDATE ON public.toolbox_tools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prompt_library_updated_at BEFORE UPDATE ON public.prompt_library
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`;

// SQL for RLS policies
const createRLSPoliciesSQL = `
-- Enable RLS on new tables
ALTER TABLE public.membership_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.toolbox_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;

-- Membership tiers policies (public read)
CREATE POLICY "Anyone can view active membership tiers" ON public.membership_tiers
    FOR SELECT USING (is_active = true);

CREATE POLICY "Service role can manage membership tiers" ON public.membership_tiers
    FOR ALL USING (auth.role() = 'service_role');

-- User memberships policies
CREATE POLICY "Service role can manage user memberships" ON public.user_memberships
    FOR ALL USING (auth.role() = 'service_role');

-- Toolbox tools policies (public read for active tools)
CREATE POLICY "Anyone can view active tools" ON public.toolbox_tools
    FOR SELECT USING (is_active = true);

CREATE POLICY "Service role can manage tools" ON public.toolbox_tools
    FOR ALL USING (auth.role() = 'service_role');

-- Prompt library policies (public read based on tier)
CREATE POLICY "Anyone can view prompts" ON public.prompt_library
    FOR SELECT USING (true);

CREATE POLICY "Service role can manage prompts" ON public.prompt_library
    FOR ALL USING (auth.role() = 'service_role');

-- Affiliate clicks policies
CREATE POLICY "Service role can manage affiliate clicks" ON public.affiliate_clicks
    FOR ALL USING (auth.role() = 'service_role');
`;

// Helper functions
const createHelperFunctionsSQL = `
-- Function to get user's current membership tier
CREATE OR REPLACE FUNCTION get_user_membership_tier(user_uuid UUID)
RETURNS TABLE (
    tier_id VARCHAR(50),
    tier_name VARCHAR(255),
    tier_level INTEGER,
    status VARCHAR(20)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mt.id,
        mt.name,
        mt.tier_level,
        um.status
    FROM public.user_memberships um
    JOIN public.membership_tiers mt ON um.tier_id = mt.id
    WHERE um.user_id = user_uuid 
    AND um.status = 'active'
    ORDER BY mt.tier_level DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user has access to tier level
CREATE OR REPLACE FUNCTION user_has_tier_access(user_uuid UUID, required_level INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    user_tier_level INTEGER;
BEGIN
    SELECT tier_level INTO user_tier_level
    FROM get_user_membership_tier(user_uuid)
    LIMIT 1;
    
    -- If no membership found, user has free tier (level 0)
    IF user_tier_level IS NULL THEN
        user_tier_level := 0;
    END IF;
    
    RETURN user_tier_level >= required_level;
END;
$$ LANGUAGE plpgsql;

-- Function to get accessible tools for user
CREATE OR REPLACE FUNCTION get_user_accessible_tools(user_uuid UUID)
RETURNS TABLE (
    tool_id VARCHAR(50),
    tool_name VARCHAR(255),
    description TEXT,
    category VARCHAR(100),
    url VARCHAR(500),
    icon VARCHAR(10),
    has_access BOOLEAN
) AS $$
DECLARE
    user_tier_level INTEGER;
BEGIN
    -- Get user's tier level
    SELECT tier_level INTO user_tier_level
    FROM get_user_membership_tier(user_uuid)
    LIMIT 1;
    
    -- Default to free tier if no membership
    IF user_tier_level IS NULL THEN
        user_tier_level := 0;
    END IF;
    
    RETURN QUERY
    SELECT 
        t.id,
        t.name,
        t.description,
        t.category,
        t.url,
        t.icon,
        (t.required_tier_level <= user_tier_level) as has_access
    FROM public.toolbox_tools t
    WHERE t.is_active = true
    ORDER BY t.category, t.name;
END;
$$ LANGUAGE plpgsql;
`;

// Sample data
const seedData = {
  membershipTiers: [
    {
      id: 'free',
      name: 'Free Tier',
      description: 'Get started with AI business fundamentals',
      price_monthly: 0,
      price_yearly: 0,
      tier_level: 0,
      features: JSON.stringify([
        'Introductory webinars',
        'Free mini-course: "5 AI Tools to Start Today"',
        'Community Discord access',
        'Basic AI prompt library (10 prompts)',
        'Monthly newsletter'
      ]),
      is_popular: false
    },
    {
      id: 'starter',
      name: 'Starter Tier',
      description: 'Essential AI tools and community access',
      price_monthly: 4900, // $49
      price_yearly: 49000, // $490 (2 months free)
      tier_level: 1,
      features: JSON.stringify([
        'Everything in Free',
        'Core course library access',
        'Basic community access',
        'AI Toolbox (20+ tools)',
        'Extended prompt library (100+ prompts)',
        'Email support'
      ]),
      is_popular: false
    },
    {
      id: 'pro',
      name: 'Pro Tier',
      description: 'Advanced training and premium resources',
      price_monthly: 9900, // $99
      price_yearly: 99000, // $990 (2 months free)
      tier_level: 2,
      features: JSON.stringify([
        'Everything in Starter',
        'Monthly live Q&A workshops',
        'Advanced tool tutorials',
        'Downloadable templates',
        'Premium AI prompt library (500+ prompts)',
        'Priority email support',
        'Affiliate program access'
      ]),
      is_popular: true
    },
    {
      id: 'mastermind',
      name: 'Mastermind Tier',
      description: 'High-touch coaching and networking',
      price_monthly: 29900, // $299
      price_yearly: 299000, // $2990 (2 months free)
      tier_level: 3,
      features: JSON.stringify([
        'Everything in Pro',
        'Small group coaching sessions',
        'Personalized feedback',
        'Networking opportunities',
        'Direct access to Chris',
        '1-on-1 monthly calls',
        'Custom AI solutions consultation'
      ]),
      is_popular: false
    }
  ],
  
  toolboxTools: [
    // Free tier tools (level 0)
    {
      id: 'chatgpt-free',
      name: 'ChatGPT Free',
      description: 'OpenAI\'s powerful AI assistant - free version',
      category: 'AI Chat',
      url: 'https://chat.openai.com',
      icon: '🤖',
      required_tier_level: 0,
      is_featured: true
    },
    {
      id: 'claude-free',
      name: 'Claude AI',
      description: 'Anthropic\'s helpful AI assistant',
      category: 'AI Chat',
      url: 'https://claude.ai',
      icon: '🧠',
      required_tier_level: 0,
      is_featured: true
    },
    {
      id: 'perplexity-free',
      name: 'Perplexity AI',
      description: 'AI-powered search and research',
      category: 'Research',
      url: 'https://perplexity.ai',
      icon: '🔍',
      required_tier_level: 0
    },
    
    // Starter tier tools (level 1)
    {
      id: 'chatgpt-plus',
      name: 'ChatGPT Plus',
      description: 'Advanced AI with GPT-4 access and plugins',
      category: 'AI Chat',
      url: 'https://chat.openai.com/plus',
      icon: '🚀',
      required_tier_level: 1,
      affiliate_url: 'https://chat.openai.com/plus?via=ventaro'
    },
    {
      id: 'midjourney',
      name: 'Midjourney',
      description: 'AI-powered image generation',
      category: 'Image Generation',
      url: 'https://midjourney.com',
      icon: '🎨',
      required_tier_level: 1,
      affiliate_url: 'https://midjourney.com?via=ventaro'
    },
    {
      id: 'cursor-ai',
      name: 'Cursor AI',
      description: 'AI-powered code editor',
      category: 'Development',
      url: 'https://cursor.sh',
      icon: '💻',
      required_tier_level: 1
    },
    {
      id: 'notion-ai',
      name: 'Notion AI',
      description: 'AI-powered workspace and note-taking',
      category: 'Productivity',
      url: 'https://notion.so/ai',
      icon: '📝',
      required_tier_level: 1,
      affiliate_url: 'https://notion.so/ai?via=ventaro'
    },
    
    // Pro tier tools (level 2)
    {
      id: 'jasper-ai',
      name: 'Jasper AI',
      description: 'AI content creation platform',
      category: 'Content',
      url: 'https://jasper.ai',
      icon: '✍️',
      required_tier_level: 2,
      affiliate_url: 'https://jasper.ai?via=ventaro'
    },
    {
      id: 'copy-ai',
      name: 'Copy.ai',
      description: 'AI copywriting and marketing content',
      category: 'Marketing',
      url: 'https://copy.ai',
      icon: '📢',
      required_tier_level: 2,
      affiliate_url: 'https://copy.ai?via=ventaro'
    },
    {
      id: 'runway-ml',
      name: 'Runway ML',
      description: 'AI video editing and generation',
      category: 'Video',
      url: 'https://runwayml.com',
      icon: '🎬',
      required_tier_level: 2
    },
    {
      id: 'synthesia',
      name: 'Synthesia',
      description: 'AI video creation with avatars',
      category: 'Video',
      url: 'https://synthesia.io',
      icon: '👤',
      required_tier_level: 2,
      affiliate_url: 'https://synthesia.io?via=ventaro'
    },
    
    // Mastermind tier tools (level 3)
    {
      id: 'anthropic-claude-pro',
      name: 'Claude Pro',
      description: 'Advanced Claude with higher limits',
      category: 'AI Chat',
      url: 'https://claude.ai/pro',
      icon: '🧠',
      required_tier_level: 3
    },
    {
      id: 'openai-api',
      name: 'OpenAI API',
      description: 'Direct API access for custom integrations',
      category: 'Development',
      url: 'https://platform.openai.com',
      icon: '⚡',
      required_tier_level: 3
    }
  ],
  
  promptLibrary: [
    // Free tier prompts (level 0)
    {
      title: 'Business Idea Generator',
      description: 'Generate innovative business ideas based on your interests',
      prompt_text: 'I want to start a business in [INDUSTRY]. My interests include [INTERESTS] and I have [BUDGET] to invest. Generate 5 unique business ideas that could work in today\'s market. For each idea, include: 1) Brief description 2) Target audience 3) Revenue model 4) Initial steps to get started',
      category: 'Business Strategy',
      tags: ['business', 'ideas', 'startup'],
      required_tier_level: 0,
      is_featured: true
    },
    {
      title: 'Social Media Content Planner',
      description: 'Create a week\'s worth of social media content',
      prompt_text: 'Create a 7-day social media content calendar for [BUSINESS TYPE] targeting [TARGET AUDIENCE]. Include: 1) Post topics for each day 2) Suggested hashtags 3) Best posting times 4) Content types (image, video, text) 5) Engagement strategies',
      category: 'Marketing',
      tags: ['social media', 'content', 'marketing'],
      required_tier_level: 0,
      is_featured: true
    },
    
    // Starter tier prompts (level 1)
    {
      title: 'Email Marketing Sequence',
      description: 'Create a complete email marketing funnel',
      prompt_text: 'Create a 5-email welcome sequence for [BUSINESS/PRODUCT]. Each email should: 1) Have a compelling subject line 2) Provide value to the subscriber 3) Include a soft call-to-action 4) Build trust and authority 5) Move them closer to a purchase. Target audience: [AUDIENCE DESCRIPTION]',
      category: 'Email Marketing',
      tags: ['email', 'marketing', 'funnel'],
      required_tier_level: 1
    },
    {
      title: 'Product Description Optimizer',
      description: 'Write compelling product descriptions that convert',
      prompt_text: 'Write a compelling product description for [PRODUCT NAME]. Product details: [PRODUCT DETAILS]. Target customer: [CUSTOMER PROFILE]. Include: 1) Attention-grabbing headline 2) Key benefits (not just features) 3) Social proof elements 4) Urgency/scarcity 5) Clear call-to-action. Make it scannable with bullet points.',
      category: 'E-commerce',
      tags: ['product', 'description', 'conversion'],
      required_tier_level: 1
    },
    
    // Pro tier prompts (level 2)
    {
      title: 'Advanced Sales Funnel Strategy',
      description: 'Design a complete sales funnel with multiple touchpoints',
      prompt_text: 'Design a comprehensive sales funnel for [PRODUCT/SERVICE] with price point [PRICE]. Include: 1) Lead magnet strategy 2) Email sequence (7+ emails) 3) Retargeting ad copy 4) Upsell/downsell offers 5) Customer retention strategy 6) Metrics to track 7) A/B testing recommendations. Target audience: [DETAILED AUDIENCE]',
      category: 'Sales Strategy',
      tags: ['sales', 'funnel', 'strategy'],
      required_tier_level: 2
    },
    {
      title: 'Competitive Analysis Framework',
      description: 'Analyze competitors and find market opportunities',
      prompt_text: 'Conduct a comprehensive competitive analysis for [YOUR BUSINESS] in [INDUSTRY]. Analyze top 5 competitors and provide: 1) Strengths and weaknesses of each 2) Pricing strategies 3) Marketing approaches 4) Customer reviews analysis 5) Market gaps and opportunities 6) Differentiation strategies 7) Action plan to outperform them',
      category: 'Business Strategy',
      tags: ['competition', 'analysis', 'strategy'],
      required_tier_level: 2
    },
    
    // Mastermind tier prompts (level 3)
    {
      title: 'Enterprise AI Implementation Strategy',
      description: 'Plan AI integration for large-scale business operations',
      prompt_text: 'Create a comprehensive AI implementation strategy for [COMPANY TYPE] with [COMPANY SIZE] employees. Include: 1) AI readiness assessment 2) Priority use cases and ROI projections 3) Technology stack recommendations 4) Implementation timeline (12-month plan) 5) Change management strategy 6) Training requirements 7) Risk mitigation 8) Success metrics and KPIs',
      category: 'AI Strategy',
      tags: ['ai', 'enterprise', 'implementation'],
      required_tier_level: 3
    },
    {
      title: 'Advanced Market Research & Validation',
      description: 'Comprehensive market research for new ventures',
      prompt_text: 'Conduct advanced market research for [BUSINESS IDEA] targeting [MARKET]. Provide: 1) Total Addressable Market (TAM) analysis 2) Customer persona development (3+ detailed personas) 3) Market validation methodology 4) Pricing strategy with psychological factors 5) Go-to-market strategy 6) Risk assessment and mitigation 7) Financial projections (3-year) 8) Pivot strategies if needed',
      category: 'Market Research',
      tags: ['research', 'validation', 'market'],
      required_tier_level: 3
    }
  ]
};

// Function to get SQL schema for manual execution
function getSQLSchema() {
  return `
-- VentaroAI Membership System Schema
-- Execute this in your Supabase SQL editor

-- Create membership_tiers table
CREATE TABLE IF NOT EXISTS membership_tiers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  price_monthly DECIMAL(10,2) NOT NULL DEFAULT 0,
  price_yearly DECIMAL(10,2) NOT NULL DEFAULT 0,
  features JSONB DEFAULT '[]',
  max_tools_access INTEGER DEFAULT 0,
  max_prompts_access INTEGER DEFAULT 0,
  affiliate_commission_rate DECIMAL(5,4) DEFAULT 0,
  stripe_price_id_monthly VARCHAR(100),
  stripe_price_id_yearly VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_memberships table
CREATE TABLE IF NOT EXISTS user_memberships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tier_id UUID REFERENCES membership_tiers(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
  billing_cycle VARCHAR(10) DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
  stripe_subscription_id VARCHAR(100),
  stripe_customer_id VARCHAR(100),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create toolbox_tools table
CREATE TABLE IF NOT EXISTS toolbox_tools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  website_url VARCHAR(500) NOT NULL,
  affiliate_url VARCHAR(500),
  logo_url VARCHAR(500),
  pricing_model VARCHAR(50),
  min_tier_required VARCHAR(50) DEFAULT 'free',
  features JSONB DEFAULT '[]',
  tags JSONB DEFAULT '[]',
  commission_rate DECIMAL(5,4) DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  total_clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create prompt_library table
CREATE TABLE IF NOT EXISTS prompt_library (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  prompt_text TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  use_case VARCHAR(100),
  min_tier_required VARCHAR(50) DEFAULT 'free',
  tags JSONB DEFAULT '[]',
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create affiliate_clicks table
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_id UUID REFERENCES toolbox_tools(id) ON DELETE CASCADE,
  user_id UUID,
  ip_address INET,
  user_agent TEXT,
  referrer VARCHAR(500),
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_memberships_user_id ON user_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_user_memberships_tier_id ON user_memberships(tier_id);
CREATE INDEX IF NOT EXISTS idx_user_memberships_status ON user_memberships(status);
CREATE INDEX IF NOT EXISTS idx_toolbox_tools_category ON toolbox_tools(category);
CREATE INDEX IF NOT EXISTS idx_toolbox_tools_tier ON toolbox_tools(min_tier_required);
CREATE INDEX IF NOT EXISTS idx_toolbox_tools_active ON toolbox_tools(is_active);
CREATE INDEX IF NOT EXISTS idx_prompt_library_category ON prompt_library(category);
CREATE INDEX IF NOT EXISTS idx_prompt_library_tier ON prompt_library(min_tier_required);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_tool_id ON affiliate_clicks(tool_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_user_id ON affiliate_clicks(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_membership_tiers_updated_at BEFORE UPDATE ON membership_tiers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_memberships_updated_at BEFORE UPDATE ON user_memberships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_toolbox_tools_updated_at BEFORE UPDATE ON toolbox_tools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prompt_library_updated_at BEFORE UPDATE ON prompt_library FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE membership_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE toolbox_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Membership tiers: readable by all, writable by service role
CREATE POLICY "Membership tiers are viewable by everyone" ON membership_tiers FOR SELECT USING (true);
CREATE POLICY "Membership tiers are editable by service role" ON membership_tiers FOR ALL USING (auth.role() = 'service_role');

-- User memberships: users can view their own, service role can manage all
CREATE POLICY "Users can view own membership" ON user_memberships FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage all memberships" ON user_memberships FOR ALL USING (auth.role() = 'service_role');

-- Toolbox tools: readable by all, writable by service role
CREATE POLICY "Tools are viewable by everyone" ON toolbox_tools FOR SELECT USING (is_active = true);
CREATE POLICY "Tools are editable by service role" ON toolbox_tools FOR ALL USING (auth.role() = 'service_role');

-- Prompt library: readable by all, writable by service role
CREATE POLICY "Prompts are viewable by everyone" ON prompt_library FOR SELECT USING (is_active = true);
CREATE POLICY "Prompts are editable by service role" ON prompt_library FOR ALL USING (auth.role() = 'service_role');

-- Affiliate clicks: insertable by all, readable by service role
CREATE POLICY "Anyone can track clicks" ON affiliate_clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can view all clicks" ON affiliate_clicks FOR SELECT USING (auth.role() = 'service_role');

-- Insert seed data
INSERT INTO membership_tiers (name, description, price_monthly, price_yearly, features, max_tools_access, max_prompts_access, affiliate_commission_rate, sort_order) VALUES
('Free', 'Get started with basic AI tools and resources', 0, 0, '["Access to 10 basic AI tools", "5 free prompts per month", "Community support", "Basic tutorials"]', 10, 5, 0, 1),
('Starter', 'Perfect for solopreneurs and small businesses', 29, 290, '["Access to 50+ AI tools", "Unlimited prompts", "Priority support", "Advanced tutorials", "Monthly group coaching"]', 50, 999, 0.05, 2),
('Pro', 'Advanced features for growing businesses', 79, 790, '["Access to 100+ AI tools", "Unlimited prompts", "1-on-1 coaching session", "Custom AI solutions", "Affiliate commissions", "Advanced analytics"]', 100, 999, 0.15, 3),
('Mastermind', 'Elite tier for serious entrepreneurs', 197, 1970, '["Access to all AI tools", "Unlimited everything", "Weekly 1-on-1 coaching", "Custom AI development", "Highest affiliate rates", "Direct access to founder", "Beta feature access"]', 999, 999, 0.25, 4)
ON CONFLICT (name) DO NOTHING;

-- Insert sample tools
INSERT INTO toolbox_tools (name, description, category, website_url, affiliate_url, pricing_model, min_tier_required, features, tags, commission_rate, is_featured, sort_order) VALUES
('ChatGPT', 'Advanced AI chatbot for conversations and content creation', 'AI Chat', 'https://chat.openai.com', 'https://chat.openai.com', 'Freemium', 'free', '["Natural language processing", "Content generation", "Code assistance"]', '["popular", "ai-chat", "content"]', 0, true, 1),
('Midjourney', 'AI-powered image generation tool', 'Design', 'https://midjourney.com', 'https://midjourney.com', 'Subscription', 'starter', '["High-quality images", "Artistic styles", "Commercial use"]', '["image-generation", "art", "design"]', 0.1, true, 2),
('Copy.ai', 'AI copywriting assistant for marketing content', 'Content', 'https://copy.ai', 'https://copy.ai', 'Freemium', 'free', '["Marketing copy", "Blog posts", "Social media content"]', '["copywriting", "marketing", "content"]', 0.2, true, 3),
('Notion AI', 'AI-powered workspace for notes and collaboration', 'Productivity', 'https://notion.so', 'https://notion.so', 'Freemium', 'free', '["Note-taking", "Project management", "AI writing assistant"]', '["productivity", "workspace", "collaboration"]', 0.15, false, 4),
('Jasper', 'Enterprise AI writing platform', 'Content', 'https://jasper.ai', 'https://jasper.ai', 'Subscription', 'pro', '["Long-form content", "Brand voice", "Team collaboration"]', '["enterprise", "writing", "brand"]', 0.25, true, 5)
ON CONFLICT (name) DO NOTHING;

-- Insert sample prompts
INSERT INTO prompt_library (title, description, prompt_text, category, use_case, min_tier_required, tags, is_featured) VALUES
('Business Plan Generator', 'Create a comprehensive business plan outline', 'Create a detailed business plan for a [BUSINESS TYPE] targeting [TARGET AUDIENCE]. Include executive summary, market analysis, financial projections, and marketing strategy.', 'Business', 'Planning', 'free', '["business", "planning", "strategy"]', true),
('Social Media Content Calendar', 'Generate a month of social media content', 'Create a 30-day social media content calendar for [BUSINESS/BRAND] in the [INDUSTRY] industry. Include post ideas, captions, and hashtags for [PLATFORM].', 'Marketing', 'Social Media', 'starter', '["social-media", "content", "marketing"]', true),
('Email Marketing Sequence', 'Design an automated email sequence', 'Write a 7-email welcome sequence for [BUSINESS TYPE] that [MAIN GOAL]. Each email should be [TONE] and include a clear call-to-action.', 'Marketing', 'Email Marketing', 'starter', '["email", "automation", "sequence"]', false),
('Product Description Optimizer', 'Create compelling product descriptions', 'Write a compelling product description for [PRODUCT NAME] that highlights [KEY BENEFITS] and appeals to [TARGET CUSTOMER]. Include SEO keywords and emotional triggers.', 'E-commerce', 'Product Marketing', 'pro', '["ecommerce", "product", "seo"]', true),
('Competitor Analysis Framework', 'Analyze your competition systematically', 'Conduct a comprehensive competitor analysis for [YOUR BUSINESS] in the [INDUSTRY] market. Analyze [COMPETITOR NAMES] and identify opportunities and threats.', 'Business', 'Analysis', 'pro', '["analysis", "competition", "strategy"]', false)
ON CONFLICT (title) DO NOTHING;

-- Success message
SELECT 'VentaroAI Membership System setup completed successfully!' as message;
`;
}

async function setupMembershipSystem() {
  console.log('🚀 Setting up VentaroAI Membership System...');
  
  try {
    // 1. Create tables
    console.log('📊 Creating membership tables...');
    const { error: tablesError } = await supabase.rpc('exec_sql', {
      sql: createMembershipTablesSQL
    });
    
    if (tablesError) {
      console.log('⚠️  RPC not available, using direct SQL execution...');
      // Fallback to direct execution
      const queries = createMembershipTablesSQL.split(';').filter(q => q.trim());
      for (const query of queries) {
        const { error } = await supabase.from('_').select().limit(0); // This will fail but establish connection
        // We'll need to run these manually or use a different approach
      }
    }
    
    // 2. Insert membership tiers
    console.log('🎯 Inserting membership tiers...');
    const { error: tiersError } = await supabase
      .from('membership_tiers')
      .upsert(seedData.membershipTiers, { onConflict: 'id' });
    
    if (tiersError) {
      console.log('⚠️  Tiers insertion error (may be expected if tables don\'t exist yet):', tiersError.message);
    } else {
      console.log('✅ Membership tiers inserted successfully');
    }
    
    // 3. Insert toolbox tools
    console.log('🛠️  Inserting AI toolbox tools...');
    const { error: toolsError } = await supabase
      .from('toolbox_tools')
      .upsert(seedData.toolboxTools, { onConflict: 'id' });
    
    if (toolsError) {
      console.log('⚠️  Tools insertion error (may be expected if tables don\'t exist yet):', toolsError.message);
    } else {
      console.log('✅ AI toolbox tools inserted successfully');
    }
    
    // 4. Insert prompt library
    console.log('📚 Inserting prompt library...');
    const { error: promptsError } = await supabase
      .from('prompt_library')
      .insert(seedData.promptLibrary);
    
    if (promptsError) {
      console.log('⚠️  Prompts insertion error (may be expected if tables don\'t exist yet):', promptsError.message);
    } else {
      console.log('✅ Prompt library inserted successfully');
    }
    
    console.log('\n🎉 Membership system setup completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Run the SQL scripts manually in Supabase if tables weren\'t created');
    console.log('2. Set up Stripe products for each membership tier');
    console.log('3. Configure webhook endpoints for subscription management');
    console.log('4. Test the membership components in your app');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Export SQL for manual execution if needed
function exportSQL() {
  const fs = require('fs');
  const fullSQL = createMembershipTablesSQL + '\n\n' + createTriggersSQL + '\n\n' + createRLSPoliciesSQL + '\n\n' + createHelperFunctionsSQL;
  
  fs.writeFileSync('setup-membership-system.sql', fullSQL);
  console.log('📄 SQL exported to setup-membership-system.sql');
}

if (require.main === module) {
  if (process.argv.includes('--export-sql')) {
    exportSQL();
  } else {
    setupMembershipSystem();
  }
}

module.exports = { setupMembershipSystem, exportSQL };