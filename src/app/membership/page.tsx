import React from 'react';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import MembershipDashboard from '@/components/membership/MembershipDashboard';
import { createClientWithRetry } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'Membership - VentaroAI',
  description: 'Choose your VentaroAI membership tier and unlock powerful AI tools, exclusive content, and premium support.',
  keywords: 'VentaroAI membership, AI tools subscription, business automation, AI training',
};

export default async function MembershipPage() {
  const supabase = await createClientWithRetry();
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/auth/signin?redirect=/membership');
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 via-blue-900/30 to-purple-900/30 text-white border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Get First Access to Our AI Toolbox
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
              Subscribe for exclusive first access to 30+ curated AI tools, premium prompts, and expert guidance.
              Be among the first to unlock the full potential of AI for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center text-gray-300">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Cancel anytime
              </div>
              <div className="flex items-center text-gray-300">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Premium support included
              </div>
              <div className="flex items-center text-gray-300">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Instant access
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <MembershipDashboard className="mb-12" />
        
        {/* Features Comparison */}
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg shadow-sm border border-gray-700 p-8 mb-12">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            What's Included in Each Tier
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left py-4 px-4 font-semibold text-white">Features</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-400">Free</th>
                  <th className="text-center py-4 px-4 font-semibold text-emerald-400">Starter</th>
                  <th className="text-center py-4 px-4 font-semibold text-blue-400">Pro</th>
                  <th className="text-center py-4 px-4 font-semibold text-purple-400">Mastermind</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-600">
                <tr>
                  <td className="py-4 px-4 font-medium text-white">AI Tools Access</td>
                  <td className="py-4 px-4 text-center text-gray-400">Basic (5 tools)</td>
                  <td className="py-4 px-4 text-center text-emerald-400">Extended (20+ tools)</td>
                  <td className="py-4 px-4 text-center text-blue-400">Premium (50+ tools)</td>
                  <td className="py-4 px-4 text-center text-purple-400">All Tools (100+)</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium text-white">Prompt Library</td>
                  <td className="py-4 px-4 text-center text-gray-400">10 prompts</td>
                  <td className="py-4 px-4 text-center text-emerald-400">100+ prompts</td>
                  <td className="py-4 px-4 text-center text-blue-400">500+ prompts</td>
                  <td className="py-4 px-4 text-center text-purple-400">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium text-white">Community Access</td>
                  <td className="py-4 px-4 text-center">✅</td>
                  <td className="py-4 px-4 text-center">✅</td>
                  <td className="py-4 px-4 text-center">✅</td>
                  <td className="py-4 px-4 text-center">✅</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium text-white">Live Workshops</td>
                  <td className="py-4 px-4 text-center text-gray-400">❌</td>
                  <td className="py-4 px-4 text-center text-gray-400">❌</td>
                  <td className="py-4 px-4 text-center text-blue-400">✅</td>
                  <td className="py-4 px-4 text-center text-purple-400">✅</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium text-white">1-on-1 Coaching</td>
                  <td className="py-4 px-4 text-center text-gray-400">❌</td>
                  <td className="py-4 px-4 text-center text-gray-400">❌</td>
                  <td className="py-4 px-4 text-center text-gray-400">❌</td>
                  <td className="py-4 px-4 text-center text-purple-400">✅</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium text-white">Affiliate Program</td>
                  <td className="py-4 px-4 text-center text-gray-400">❌</td>
                  <td className="py-4 px-4 text-center text-gray-400">❌</td>
                  <td className="py-4 px-4 text-center text-blue-400">✅</td>
                  <td className="py-4 px-4 text-center text-purple-400">✅</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium text-white">Priority Support</td>
                  <td className="py-4 px-4 text-center text-gray-400">❌</td>
                  <td className="py-4 px-4 text-center text-emerald-400">Email</td>
                  <td className="py-4 px-4 text-center text-blue-400">Priority Email</td>
                  <td className="py-4 px-4 text-center text-purple-400">Direct Access</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Success Stories */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            What Our Members Are Saying
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "The AI toolbox alone has saved me 10+ hours per week. The Pro tier is worth every penny!"
              </p>
              <div className="font-semibold text-gray-900">Sarah M.</div>
              <div className="text-sm text-gray-500">Digital Marketing Agency Owner</div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "The Mastermind coaching sessions transformed my business. I've 3x'd my revenue in 6 months."
              </p>
              <div className="font-semibold text-gray-900">Mike R.</div>
              <div className="text-sm text-gray-500">E-commerce Entrepreneur</div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Started with the free tier, now I'm a Pro member. The progression path is perfect for growth."
              </p>
              <div className="font-semibold text-gray-900">Lisa K.</div>
              <div className="text-sm text-gray-500">Freelance Consultant</div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I change my plan anytime?</h3>
              <p className="text-gray-600 text-sm">
                Yes! You can upgrade or downgrade your membership at any time. Changes take effect immediately for upgrades, or at the next billing cycle for downgrades.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
              <p className="text-gray-600 text-sm">
                Our Free tier gives you access to basic features forever. For paid tiers, you get premium support and advanced features.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600 text-sm">
                We accept all major credit cards, PayPal, and bank transfers through our secure Stripe integration.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How does the affiliate program work?</h3>
              <p className="text-gray-600 text-sm">
                Pro and Mastermind members get access to our affiliate program with competitive commissions on tool referrals and membership sales.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}