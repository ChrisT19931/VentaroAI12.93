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
            <AnimatedHeading
              className="text-4xl md:text-5xl font-bold mb-6"
              animation="slide-up"
              theme="silver"
              is3D={true}
            >
              VAI Web Gen
            </AnimatedHeading>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
              Coming Soon: Revolutionary AI-powered website generator that creates stunning, professional websites in minutes.
              Build ecommerce stores, portfolios, and business sites with zero coding required.
            </p>
            

          </div>
        </div>
      </div>



      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Coming Soon Section */}
        <div className="bg-gradient-to-br from-gray-950/80 to-black/90 rounded-lg shadow-2xl border border-gray-800 p-12 mb-12 text-center backdrop-blur-sm">
          <div className="max-w-2xl mx-auto">
            <div className="text-6xl mb-6">🌐</div>
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
                  <div className="text-gray-400 text-xl">🛒</div>
                  <span className="text-gray-300"><strong className="text-white">Ecommerce Power:</strong> Shopify-level selling capabilities</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-gray-400 text-xl">🎨</div>
                  <span className="text-gray-300"><strong className="text-white">Design Freedom:</strong> Wix-style visual customization</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-gray-400 text-xl">🏪</div>
                  <span className="text-gray-300"><strong className="text-white">Marketplace Features:</strong> Amazon-style product listings</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-gray-400 text-xl">⚡</div>
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