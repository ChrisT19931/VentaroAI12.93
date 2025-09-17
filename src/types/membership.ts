/**
 * VentaroAI Membership System Types
 * 
 * TypeScript interfaces and types for the tiered membership system
 */

export interface MembershipTier {
  id: string;
  name: string;
  description: string;
  price_monthly: number; // in cents
  price_yearly: number | null; // in cents
  features: string[];
  tier_level: number;
  stripe_price_id_monthly?: string;
  stripe_price_id_yearly?: string;
  is_active: boolean;
  is_popular: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserMembership {
  id: string;
  user_id: string;
  tier_id: string;
  status: 'active' | 'cancelled' | 'expired' | 'paused';
  billing_cycle: 'monthly' | 'yearly';
  stripe_subscription_id?: string;
  stripe_customer_id?: string;
  current_period_start?: string;
  current_period_end?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  tier?: MembershipTier;
}

export interface ToolboxTool {
  id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  icon: string;
  required_tier_level: number;
  is_active: boolean;
  is_featured: boolean;
  affiliate_url?: string;
  created_at: string;
  updated_at: string;
  // Computed fields
  has_access?: boolean;
}

export interface PromptLibraryItem {
  id: string;
  title: string;
  description: string;
  prompt_text: string;
  category: string;
  tags: string[];
  required_tier_level: number;
  is_featured: boolean;
  use_count: number;
  created_at: string;
  updated_at: string;
  // Computed fields
  has_access?: boolean;
}

export interface AffiliateClick {
  id: string;
  user_id?: string;
  tool_id: string;
  clicked_url: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// API Response types
export interface MembershipApiResponse {
  tiers: MembershipTier[];
  user_membership?: UserMembership;
  current_tier?: MembershipTier;
}

export interface ToolboxApiResponse {
  tools: ToolboxTool[];
  categories: string[];
  user_tier_level: number;
}

export interface PromptLibraryApiResponse {
  prompts: PromptLibraryItem[];
  categories: string[];
  user_tier_level: number;
  total_count: number;
}

// Component Props types
export interface MembershipCardProps {
  tier: MembershipTier;
  currentTier?: MembershipTier;
  isLoading?: boolean;
  onSelectTier: (tier: MembershipTier, billingCycle: 'monthly' | 'yearly') => void;
}

export interface ToolboxToolCardProps {
  tool: ToolboxTool;
  onToolClick: (tool: ToolboxTool) => void;
  userTierLevel: number;
}

export interface PromptCardProps {
  prompt: PromptLibraryItem;
  onUsePrompt: (prompt: PromptLibraryItem) => void;
  userTierLevel: number;
}

// Utility types
export type TierLevel = 0 | 1 | 2 | 3; // Free, Starter, Pro, Mastermind
export type BillingCycle = 'monthly' | 'yearly';
export type MembershipStatus = 'active' | 'cancelled' | 'expired' | 'paused';

// Constants
export const TIER_LEVELS = {
  FREE: 0,
  STARTER: 1,
  PRO: 2,
  MASTERMIND: 3
} as const;

export const TIER_NAMES = {
  [TIER_LEVELS.FREE]: 'Free',
  [TIER_LEVELS.STARTER]: 'Starter',
  [TIER_LEVELS.PRO]: 'Pro',
  [TIER_LEVELS.MASTERMIND]: 'Mastermind'
} as const;

export const TIER_COLORS = {
  [TIER_LEVELS.FREE]: 'gray',
  [TIER_LEVELS.STARTER]: 'blue',
  [TIER_LEVELS.PRO]: 'purple',
  [TIER_LEVELS.MASTERMIND]: 'gold'
} as const;

// Helper functions
export const formatPrice = (priceInCents: number): string => {
  return `$${(priceInCents / 100).toFixed(0)}`;
};

export const calculateYearlySavings = (monthlyPrice: number, yearlyPrice: number): number => {
  const monthlyTotal = monthlyPrice * 12;
  return monthlyTotal - yearlyPrice;
};

export const getTierBadgeColor = (tierLevel: number): string => {
  switch (tierLevel) {
    case TIER_LEVELS.FREE:
      return 'bg-gray-100 text-gray-800';
    case TIER_LEVELS.STARTER:
      return 'bg-blue-100 text-blue-800';
    case TIER_LEVELS.PRO:
      return 'bg-purple-100 text-purple-800';
    case TIER_LEVELS.MASTERMIND:
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const canAccessFeature = (userTierLevel: number, requiredTierLevel: number): boolean => {
  return userTierLevel >= requiredTierLevel;
};

// Stripe integration types
export interface StripeCheckoutSession {
  sessionId: string;
  url: string;
}

export interface StripeSubscription {
  id: string;
  status: string;
  current_period_start: number;
  current_period_end: number;
  customer: string;
  items: {
    data: Array<{
      price: {
        id: string;
        recurring: {
          interval: 'month' | 'year';
        };
      };
    }>;
  };
}

// Database function return types
export interface UserMembershipTier {
  tier_id: string;
  tier_name: string;
  tier_level: number;
  status: string;
}

export interface UserAccessibleTool {
  tool_id: string;
  tool_name: string;
  description: string;
  category: string;
  url: string;
  icon: string;
  has_access: boolean;
}

// Form types
export interface MembershipUpgradeForm {
  tier_id: string;
  billing_cycle: BillingCycle;
  payment_method?: string;
}

export interface PromptSearchForm {
  query: string;
  category: string;
  tier_level: number;
}

export interface ToolboxSearchForm {
  query: string;
  category: string;
  featured_only: boolean;
}

// Analytics types
export interface MembershipAnalytics {
  total_members: number;
  members_by_tier: Record<string, number>;
  monthly_revenue: number;
  churn_rate: number;
  upgrade_rate: number;
  most_popular_tools: ToolboxTool[];
  most_used_prompts: PromptLibraryItem[];
}

export interface AffiliateAnalytics {
  total_clicks: number;
  clicks_by_tool: Record<string, number>;
  conversion_rate: number;
  estimated_revenue: number;
}

// Error types
export interface MembershipError {
  code: string;
  message: string;
  details?: any;
}

// Success response types
export interface MembershipActionResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: MembershipError;
}

// Webhook types for Stripe
export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
  created: number;
}

export interface SubscriptionWebhookData {
  subscription: StripeSubscription;
  customer_email: string;
  tier_id: string;
}

// All types are already exported above, no need to re-export