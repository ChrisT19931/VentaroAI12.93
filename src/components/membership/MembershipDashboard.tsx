'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { getSupabaseClient } from '@/lib/supabase';
import {
  MembershipTier,
  UserMembership,
  MembershipApiResponse,
  BillingCycle,
  formatPrice,
  calculateYearlySavings,
  getTierBadgeColor,
  TIER_LEVELS
} from '@/types/membership';

interface MembershipDashboardProps {
  className?: string;
}

const MembershipDashboard: React.FC<MembershipDashboardProps> = ({ className = '' }) => {
  const [tiers, setTiers] = useState<MembershipTier[]>([]);
  const [userMembership, setUserMembership] = useState<UserMembership | null>(null);
  const [currentTier, setCurrentTier] = useState<MembershipTier | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [selectedBilling, setSelectedBilling] = useState<BillingCycle>('monthly');
  
  const router = useRouter();
  const supabase = getSupabaseClient();

  useEffect(() => {
    loadMembershipData();
  }, []);

  const loadMembershipData = async () => {
    try {
      setIsLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/signin');
        return;
      }

      // Load membership data
      const response = await fetch('/api/membership');
      if (!response.ok) throw new Error('Failed to load membership data');
      
      const data: MembershipApiResponse = await response.json();
      setTiers(data.tiers);
      setUserMembership(data.user_membership || null);
      setCurrentTier(data.current_tier || data.tiers.find(t => t.id === 'free') || null);
      
    } catch (error) {
      console.error('Error loading membership data:', error);
      toast.error('Failed to load membership information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async (tier: MembershipTier, billingCycle: BillingCycle) => {
    try {
      setIsUpgrading(true);
      
      // Don't allow "upgrading" to free tier
      if (tier.id === 'free') {
        toast.error('Cannot downgrade to free tier through this interface');
        return;
      }
      
      // Check if user is already on this tier
      if (currentTier?.id === tier.id) {
        toast.error('You are already on this tier');
        return;
      }

      // Create Stripe checkout session
      const response = await fetch('/api/membership/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier_id: tier.id,
          billing_cycle: billingCycle,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      
      // Redirect to Stripe checkout
      window.location.href = url;
      
    } catch (error) {
      console.error('Error upgrading membership:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upgrade membership');
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const response = await fetch('/api/membership/portal', {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to create portal session');
      
      const { url } = await response.json();
      window.location.href = url;
      
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast.error('Failed to open subscription management');
    }
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-8 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-900/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Membership Dashboard</h2>
            <p className="text-gray-300 mt-1">
              {currentTier ? (
                <>
                  You're currently on the{' '}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTierBadgeColor(currentTier.tier_level)}`}>
                    {currentTier.name}
                  </span>
                  {' '}tier
                </>
              ) : (
                'Choose a membership tier to get started'
              )}
            </p>
          </div>
          
          {userMembership && userMembership.status === 'active' && (
            <button
              onClick={handleManageSubscription}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Manage Subscription
            </button>
          )}
        </div>
      </div>

      {/* Billing Toggle */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-center">
          <div className="bg-gray-800 p-1 rounded-lg">
            <button
              onClick={() => setSelectedBilling('monthly')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                selectedBilling === 'monthly'
                  ? 'bg-gray-700 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setSelectedBilling('yearly')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                selectedBilling === 'yearly'
                  ? 'bg-gray-700 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Yearly
              <span className="ml-1 text-xs text-emerald-400 font-semibold">Save 17%</span>
            </button>
          </div>
        </div>
      </div>

      {/* Membership Tiers */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier, index) => {
            const isCurrentTier = currentTier?.id === tier.id;
            const price = selectedBilling === 'yearly' ? tier.price_yearly : tier.price_monthly;
            const monthlyPrice = tier.price_monthly;
            const yearlyPrice = tier.price_yearly;
            const savings = yearlyPrice && monthlyPrice ? calculateYearlySavings(monthlyPrice, yearlyPrice) : 0;
            
            // Color scheme based on tier index
            const colors = {
              border: index === 0 ? 'border-emerald-500/50' : index === 1 ? 'border-blue-500/50' : 'border-purple-500/50',
              popularBorder: index === 0 ? 'border-emerald-500' : index === 1 ? 'border-blue-500' : 'border-purple-500',
              popularBadge: index === 0 ? 'bg-emerald-500' : index === 1 ? 'bg-blue-500' : 'bg-purple-500',
              currentBadge: index === 0 ? 'bg-emerald-500' : index === 1 ? 'bg-blue-500' : 'bg-purple-500',
              currentBg: index === 0 ? 'bg-emerald-50' : index === 1 ? 'bg-blue-50' : 'bg-purple-50',
              checkmark: index === 0 ? 'text-emerald-500' : index === 1 ? 'text-blue-500' : 'text-purple-500',
              button: index === 0 ? 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500' : index === 1 ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' : 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500'
            };
            
            return (
              <div
                key={tier.id}
                className={`relative rounded-lg border-2 p-6 transition-all duration-200 bg-gray-900/50 backdrop-blur-sm ${
                  tier.is_popular
                    ? `${colors.popularBorder} shadow-lg scale-105`
                    : isCurrentTier
                    ? `${colors.popularBorder} ${colors.currentBg}`
                    : `${colors.border} hover:${colors.popularBorder}`
                }`}
              >
                {/* Popular Badge */}
                {tier.is_popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className={`${colors.popularBadge} text-white px-3 py-1 text-xs font-semibold rounded-full`}>
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Current Tier Badge */}
                {isCurrentTier && (
                  <div className="absolute -top-3 right-4">
                    <span className={`${colors.currentBadge} text-white px-3 py-1 text-xs font-semibold rounded-full`}>
                      Current
                    </span>
                  </div>
                )}

                {/* Tier Header */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                  <p className="text-gray-300 text-sm mt-1">{tier.description}</p>
                  
                  <div className="mt-4">
                    {price === 0 ? (
                      <div className="text-3xl font-bold text-white">Free</div>
                    ) : (
                      <>
                        <div className="text-3xl font-bold text-white">
                          {formatPrice(price || 0)}
                          <span className="text-lg font-normal text-gray-300">
                            /{selectedBilling === 'yearly' ? 'year' : 'month'}
                          </span>
                        </div>
                        {selectedBilling === 'yearly' && savings > 0 && (
                          <div className={`text-sm font-medium ${
                            index === 0 ? 'text-emerald-400' : index === 1 ? 'text-blue-400' : 'text-purple-400'
                          }`}>
                            Save {formatPrice(savings)} per year
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <ul className="space-y-2">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className={`h-5 w-5 ${colors.checkmark} mr-2 mt-0.5 flex-shrink-0`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <div className="mt-auto">
                  {isCurrentTier ? (
                    <button
                      disabled
                      className={`w-full py-2 px-4 border rounded-md text-sm font-medium cursor-not-allowed ${
                        index === 0 ? 'border-emerald-300 text-emerald-700 bg-emerald-50' :
                        index === 1 ? 'border-blue-300 text-blue-700 bg-blue-50' :
                        'border-purple-300 text-purple-700 bg-purple-50'
                      }`}
                    >
                      Current Plan
                    </button>
                  ) : tier.id === 'free' ? (
                    <button
                      disabled
                      className="w-full py-2 px-4 border border-gray-600 rounded-md text-sm font-medium text-gray-400 bg-gray-800 cursor-not-allowed"
                    >
                      Free Tier
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(tier, selectedBilling)}
                      disabled={isUpgrading}
                      className={`w-full py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white transition-colors ${colors.button} focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isUpgrading ? 'Processing...' : `Upgrade to ${tier.name}`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Membership Info */}
      {userMembership && (
        <div className="p-6 border-t border-gray-700 bg-gray-800/40">
          <h3 className="text-lg font-semibold text-white mb-4">Subscription Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-300">Status:</span>
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                userMembership?.status === 'active'
                  ? 'bg-emerald-900/30 text-emerald-400'
                  : userMembership?.status === 'cancelled'
                  ? 'bg-red-900/30 text-red-400'
                  : 'bg-yellow-900/30 text-yellow-400'
              }`}>
                {userMembership?.status?.charAt(0).toUpperCase() + userMembership?.status?.slice(1)}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-300">Billing:</span>
              <span className="ml-2 text-white">
                {userMembership?.billing_cycle?.charAt(0).toUpperCase() + userMembership?.billing_cycle?.slice(1)}
              </span>
            </div>
            {userMembership?.current_period_end && (
              <div>
                <span className="font-medium text-gray-300">Next billing:</span>
                <span className="ml-2 text-white">
                  {new Date(userMembership.current_period_end).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipDashboard;