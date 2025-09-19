'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function VAIAgentsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<'single' | 'all' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async (planType: 'single' | 'all') => {
    if (!session) {
      router.push('/signin?redirect=/vai-agents');
      return;
    }

    setIsLoading(true);
    setSelectedPlan(planType);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: planType === 'single' ? 'price_vai_agent_single' : 'price_vai_agents_all',
          productType: 'vai-agents',
          planType,
        }),
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setIsLoading(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-cyan-900/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6">
              VAI AGENTS
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Unlock the power of specialized AI agents designed to revolutionize your business operations. 
              Choose from our elite collection of intelligent assistants.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 px-6 py-3 rounded-full border border-purple-500/30">
                <span className="text-purple-300 font-semibold">🤖 Advanced AI Technology</span>
              </div>
              <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 px-6 py-3 rounded-full border border-blue-500/30">
                <span className="text-blue-300 font-semibold">⚡ Instant Access</span>
              </div>
              <div className="bg-gradient-to-r from-cyan-600/20 to-purple-600/20 px-6 py-3 rounded-full border border-cyan-500/30">
                <span className="text-cyan-300 font-semibold">🚀 Business Growth</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Agents Preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">Meet Your AI Agents</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Three powerful AI agents, each specialized for different aspects of your business success.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {/* Agent 1 */}
          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-2xl p-8 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-105">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🧠</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Strategy Agent</h3>
              <p className="text-gray-300 mb-6">
                Advanced business strategy and market analysis AI that helps you make data-driven decisions and identify growth opportunities.
              </p>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center justify-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                  Market Analysis
                </div>
                <div className="flex items-center justify-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                  Strategic Planning
                </div>
                <div className="flex items-center justify-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                  Competitive Intelligence
                </div>
              </div>
            </div>
          </div>

          {/* Agent 2 */}
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-2xl p-8 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:transform hover:scale-105">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📈</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Growth Agent</h3>
              <p className="text-gray-300 mb-6">
                Specialized in scaling operations, optimizing processes, and identifying revenue opportunities to accelerate your business growth.
              </p>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center justify-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  Revenue Optimization
                </div>
                <div className="flex items-center justify-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  Process Automation
                </div>
                <div className="flex items-center justify-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  Scaling Strategies
                </div>
              </div>
            </div>
          </div>

          {/* Agent 3 */}
          <div className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/20 rounded-2xl p-8 border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300 hover:transform hover:scale-105">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Marketing Agent</h3>
              <p className="text-gray-300 mb-6">
                Expert marketing AI that creates campaigns, analyzes customer behavior, and optimizes your marketing ROI across all channels.
              </p>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center justify-center">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
                  Campaign Creation
                </div>
                <div className="flex items-center justify-center">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
                  Customer Analytics
                </div>
                <div className="flex items-center justify-center">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
                  ROI Optimization
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">Choose Your Plan</h2>
          <p className="text-xl text-gray-400">
            Select the perfect plan for your business needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Single Agent Plan */}
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-2xl p-8 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 relative">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Single Agent</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-purple-400">$10</span>
                <span className="text-gray-400 text-lg">/month</span>
              </div>
              <p className="text-gray-300 mb-8">
                Perfect for getting started with AI automation. Choose any one of our three specialized agents.
              </p>
              
              <div className="space-y-4 mb-8 text-left">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-purple-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Access to 1 AI Agent</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-purple-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Unlimited Usage</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-purple-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">24/7 Support</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-purple-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Regular Updates</span>
                </div>
              </div>

              <button
                onClick={() => handlePurchase('single')}
                disabled={isLoading && selectedPlan === 'single'}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading && selectedPlan === 'single' ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Get Single Agent'
                )}
              </button>
            </div>
          </div>

          {/* All Agents Plan */}
          <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/30 rounded-2xl p-8 border border-blue-500/50 hover:border-blue-400/70 transition-all duration-300 relative transform hover:scale-105">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                BEST VALUE
              </span>
            </div>
            
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">All Agents</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-blue-400">$20</span>
                <span className="text-gray-400 text-lg">/month</span>
              </div>
              <p className="text-gray-300 mb-8">
                Complete AI automation suite. Get access to all three specialized agents for maximum business impact.
              </p>
              
              <div className="space-y-4 mb-8 text-left">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Access to All 3 AI Agents</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Unlimited Usage</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Priority Support</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Early Access to New Agents</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Advanced Analytics</span>
                </div>
              </div>

              <button
                onClick={() => handlePurchase('all')}
                disabled={isLoading && selectedPlan === 'all'}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading && selectedPlan === 'all' ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Get All Agents'
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">
            Not sure which plan is right for you?
          </p>
          <Link 
            href="/contact" 
            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
          >
            Contact our team for personalized recommendations
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-r from-gray-900/50 to-black/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Why Choose VAI Agents?</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience the future of business automation with our cutting-edge AI technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Lightning Fast</h3>
              <p className="text-gray-400">
                Get instant responses and real-time insights to accelerate your decision-making process.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Proven Results</h3>
              <p className="text-gray-400">
                Our AI agents are trained on successful business strategies and deliver measurable outcomes.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Easy to Use</h3>
              <p className="text-gray-400">
                Intuitive interface designed for business professionals, no technical expertise required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}