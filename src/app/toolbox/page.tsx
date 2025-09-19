'use client';

import React from 'react';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import Link from 'next/link';
import SubscriptionForm from '@/components/SubscriptionForm';
import { getSupabaseClient, createClientWithRetry } from '@/lib/supabase';
import AnimatedHeading from '@/components/AnimatedHeading';

// Metadata moved to layout.tsx since this is now a client component

export default function ToolboxPage() {
  const [user, setUser] = React.useState<any>(null);
  
  React.useEffect(() => {
    async function getUser() {
      try {
        // Use the centralized client with retry logic
        const supabase = await createClientWithRetry();
        // Get current user (optional for toolbox viewing)
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
      } catch (error) {
        console.error('Failed to initialize Supabase client:', error);
        // Continue without user authentication
      }
    }
    
    getUser();
  }, []);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-950 via-black to-gray-900 text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-gray-500/10 to-gray-700/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-gray-600/10 to-gray-800/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
              VAI <span className="bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">Web Gen</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
              Revolutionary AI-powered website generator that creates stunning, professional websites in minutes.
              Build ecommerce stores, portfolios, and business sites with zero coding required.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-gradient-to-br from-gray-900/60 to-gray-950/60 rounded-xl p-6 border border-gray-800/50">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4 border border-gray-600/30">
                  <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                  </svg>
                </div>
                <h4 className="text-white font-bold mb-3 text-lg">Design Freedom</h4>
                <p className="text-gray-400 leading-relaxed">Choose from hundreds of professional templates or let AI create custom designs</p>
              </div>
              <div className="bg-gradient-to-br from-gray-900/60 to-gray-950/60 rounded-xl p-6 border border-gray-800/50">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4 border border-gray-600/30">
                  <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-white font-bold mb-3 text-lg">AI-Powered</h4>
                <p className="text-gray-400 leading-relaxed">Advanced AI handles content creation, SEO optimization, and responsive design</p>
              </div>
              <div className="bg-gradient-to-br from-gray-900/60 to-gray-950/60 rounded-xl p-6 border border-gray-800/50">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4 border border-gray-600/30">
                  <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h4 className="text-white font-bold mb-3 text-lg">Marketplace Ready</h4>
                <p className="text-gray-400 leading-relaxed">Built-in ecommerce features, payment processing, and inventory management</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900/60 to-gray-950/60 rounded-xl p-8 border border-gray-800/50 mb-8">
              <h3 className="text-white font-bold mb-4 text-2xl">Be First to Access VAI Web Gen</h3>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">Join our early access list and be among the first to experience the future of web creation.</p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-6 py-4 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 backdrop-blur-sm"
                />
                <button className="px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-semibold rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 border border-gray-600/50">
                  Notify Me
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>



      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Coming Soon Section */}
        <div className="bg-gradient-to-br from-gray-950/80 to-black/90 rounded-2xl shadow-2xl border border-gray-800 p-12 mb-12 text-center backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-gray-600/30">
              <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
              </svg>
            </div>
            <AnimatedHeading
              className="text-3xl font-bold text-white mb-4"
              animation="slide-up"
              theme="silver"
              is3D={true}
              delay={0.2}
            >
              VAI Web gen - Revolutionizing Web Development
            </AnimatedHeading>
            <p className="text-lg text-gray-300 mb-8">
              VAI Web gen is a groundbreaking AI web development platform that combines the best elements of Shopify's ecommerce power, 
              Wix's design flexibility, Amazon's marketplace capabilities, and eBay's auction features into one revolutionary solution. 
              Build complete online businesses with AI-powered automation that handles everything from design to deployment.
            </p>
            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-6 mb-8 border border-gray-700">
              <AnimatedHeading
                className="text-xl font-semibold text-white mb-3"
                animation="fade"
                theme="silver"
                delay={0.3}
              >
                Revolutionary All-in-One Platform:
              </AnimatedHeading>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center border border-gray-600/30">
                    <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <span className="text-gray-300"><strong className="text-white">Ecommerce Power:</strong> Shopify-level selling capabilities</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center border border-gray-600/30">
                    <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                    </svg>
                  </div>
                  <span className="text-gray-300"><strong className="text-white">Design Freedom:</strong> Wix-style visual customization</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center border border-gray-600/30">
                    <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <span className="text-gray-300"><strong className="text-white">Marketplace Features:</strong> Amazon-style product listings</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center border border-gray-600/30">
                    <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-gray-300"><strong className="text-white">Auction System:</strong> eBay-inspired bidding functionality</span>
                </div>
              </div>
            </div>
            
            <div className="max-w-md mx-auto">
              <SubscriptionForm 
                source="ai-web-gen"
                title="Coming Soon - Subscribe for First Access"
                description="Be the first to access our automated web platform for building complete online sites"
                buttonText="Subscribe for First Access →"
              />
            </div>
          </div>
        </div>
        
        {/* Platform Features */}
        <div className="bg-gradient-to-br from-gray-950/80 to-black/90 rounded-lg shadow-2xl border border-gray-800 p-8 mb-12 backdrop-blur-sm">
          <AnimatedHeading
            className="text-2xl font-bold text-white text-center mb-8"
            animation="slide-up"
            theme="silver"
            delay={0.2}
          >
            Platform Capabilities
          </AnimatedHeading>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/50 transition-colors">
              <div className="text-3xl mb-2">🛒</div>
              <h3 className="font-semibold text-white">Ecommerce</h3>
              <p className="text-sm text-gray-400">Full online store functionality</p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/50 transition-colors">
              <div className="text-3xl mb-2">🎨</div>
              <h3 className="font-semibold text-white">Design Studio</h3>
              <p className="text-sm text-gray-400">Visual website customization</p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/50 transition-colors">
              <div className="text-3xl mb-2">🏪</div>
              <h3 className="font-semibold text-white">Marketplace</h3>
              <p className="text-sm text-gray-400">Multi-vendor platform support</p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/50 transition-colors">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-semibold text-white">Auctions</h3>
              <p className="text-sm text-gray-400">Bidding and auction features</p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/50 transition-colors">
              <div className="text-3xl mb-2">💳</div>
              <h3 className="font-semibold text-white">Payments</h3>
              <p className="text-sm text-gray-400">Integrated payment processing</p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/50 transition-colors">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-semibold text-white">Analytics</h3>
              <p className="text-sm text-gray-400">Advanced business insights</p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/50 transition-colors">
              <div className="text-3xl mb-2">💰</div>
              <h3 className="font-semibold text-white">Hosting</h3>
              <p className="text-sm text-gray-400">Global CDN and hosting</p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/50 transition-colors">
              <div className="text-3xl mb-2">🔧</div>
              <h3 className="font-semibold text-white">Automation</h3>
              <p className="text-sm text-gray-400">AI-powered workflows</p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-r from-gray-950/80 to-gray-900/90 rounded-lg p-8 mb-12 border border-gray-800 backdrop-blur-sm">
          <AnimatedHeading
            className="text-2xl font-bold text-white text-center mb-8"
            animation="slide-up"
            theme="silver"
            delay={0.2}
          >
            How VAI Web gen Works
          </AnimatedHeading>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-gray-700/50 to-gray-800/50 border border-gray-600/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-gray-300">1</span>
              </div>
              <h3 className="font-semibold text-white mb-2">Describe Your Vision</h3>
              <p className="text-gray-400 text-sm">
                Tell our AI what kind of website or online business you want to create.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-gray-700/50 to-gray-800/50 border border-gray-600/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-gray-300">2</span>
              </div>
              <h3 className="font-semibold text-white mb-2">AI Builds Everything</h3>
              <p className="text-gray-400 text-sm">
                Our AI automatically creates your complete website with all necessary features and functionality.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-gray-700/50 to-gray-800/50 border border-gray-600/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-gray-300">3</span>
              </div>
              <h3 className="font-semibold text-white mb-2">Launch & Scale</h3>
              <p className="text-gray-400 text-sm">
                Go live instantly with built-in hosting, payments, and all the tools you need to grow.
              </p>
            </div>
          </div>
        </div>

        {/* Coming Soon Tabs */}
        <div className="bg-gradient-to-br from-gray-950/80 to-black/90 rounded-lg shadow-2xl border border-gray-800 p-8 backdrop-blur-sm mb-12">
          <AnimatedHeading
            className="text-2xl font-bold text-white text-center mb-8"
            animation="slide-up"
            theme="silver"
            delay={0.2}
          >
            Coming Soon Features
          </AnimatedHeading>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* VAI Web Gen */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8 hover:border-gray-700/50 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center mb-6 border border-gray-600/30">
                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
              </div>
              <h3 className="font-bold text-white mb-4 text-2xl">VAI Web Gen</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Revolutionary AI-powered website generator that creates stunning, professional websites in minutes. Build ecommerce stores, portfolios, and business sites with zero coding required.
              </p>
              <div className="flex items-center text-gray-300 text-sm font-medium">
                <span className="w-2 h-2 bg-gray-500 rounded-full mr-2 animate-pulse"></span>
                In Development
              </div>
            </div>
            
            {/* Affiliate Program */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8 hover:border-gray-700/50 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center mb-6 border border-gray-600/30">
                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-white mb-4 text-2xl">Affiliate Program</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Join our affiliate network and earn rewards by sharing the power of AI business solutions. Earn commissions on referrals and help others discover cutting-edge AI tools.
              </p>
              <div className="flex items-center text-gray-300 text-sm font-medium mb-4">
                <span className="w-2 h-2 bg-gray-500 rounded-full mr-2 animate-pulse"></span>
                Launching Soon
              </div>
              <Link 
                href="/contact" 
                className="inline-block px-4 py-2 bg-gradient-to-r from-gray-600/20 to-gray-700/20 border border-gray-500/30 text-gray-300 text-sm font-medium rounded-lg transition-all duration-300 hover:bg-gray-500/30 hover:text-gray-200"
              >
                Register Interest →
              </Link>
            </div>
          </div>
        </div>

        {/* Platform Vision */}
        <div className="bg-gradient-to-br from-gray-950/80 to-black/90 rounded-lg shadow-2xl border border-gray-800 p-8 backdrop-blur-sm">
          <div className="text-center">
            <AnimatedHeading
              className="text-2xl font-bold text-white mb-4"
              animation="slide-up"
              theme="silver"
              delay={0.2}
            >
              The Future of Web Development
            </AnimatedHeading>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              VAI Web gen represents the next evolution in web development - a single platform that eliminates the need for multiple tools and services. 
              Build everything from simple landing pages to complex ecommerce marketplaces with AI-powered automation.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-lg p-6 hover:bg-gray-700/50 transition-all duration-300">
                <div className="text-2xl mb-2">💰</div>
                <h3 className="font-semibold text-white mb-2">Launch Faster</h3>
                <p className="text-sm text-gray-400">
                  Go from idea to live website in minutes, not weeks. AI handles the complex technical setup.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-lg p-6 hover:bg-gray-700/50 transition-all duration-300">
                <div className="text-2xl mb-2">💰</div>
                <h3 className="font-semibold text-white mb-2">Monetize Everything</h3>
                <p className="text-sm text-gray-400">
                  Built-in payment processing, subscription management, and marketplace functionality.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-lg p-6 hover:bg-gray-700/50 transition-all duration-300">
                <div className="text-2xl mb-2">🌐</div>
                <h3 className="font-semibold text-white mb-2">Scale Globally</h3>
                <p className="text-sm text-gray-400">
                  Enterprise-grade infrastructure that grows with your business, from startup to global marketplace.
                </p>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}