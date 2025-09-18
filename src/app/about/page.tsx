'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Star background CSS
const starStyles = `
  .stars {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="0.5" fill="white" opacity="0.8"/><circle cx="80" cy="40" r="0.3" fill="white" opacity="0.6"/><circle cx="40" cy="60" r="0.4" fill="white" opacity="0.7"/><circle cx="90" cy="80" r="0.2" fill="white" opacity="0.5"/><circle cx="10" cy="90" r="0.6" fill="white" opacity="0.9"/><circle cx="70" cy="10" r="0.3" fill="white" opacity="0.6"/><circle cx="30" cy="30" r="0.4" fill="white" opacity="0.8"/><circle cx="60" cy="70" r="0.2" fill="white" opacity="0.5"/><circle cx="85" cy="15" r="0.5" fill="white" opacity="0.7"/><circle cx="15" cy="50" r="0.3" fill="white" opacity="0.6"/></svg>') repeat;
    animation: sparkle 20s linear infinite;
  }
  
  .twinkling {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="25" cy="25" r="0.3" fill="white" opacity="0.4"/><circle cx="75" cy="75" r="0.2" fill="white" opacity="0.6"/><circle cx="50" cy="10" r="0.4" fill="white" opacity="0.3"/><circle cx="10" cy="60" r="0.2" fill="white" opacity="0.5"/><circle cx="90" cy="30" r="0.3" fill="white" opacity="0.4"/></svg>') repeat;
    animation: sparkle 30s linear infinite reverse;
  }
  
  @keyframes sparkle {
    0% { transform: translateX(0px); }
    100% { transform: translateX(-100px); }
  }
`

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: starStyles }} />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-dark">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <Image 
                src="/images/ventaro-logo.svg" 
                alt="V-Ventaro" 
                width={300} 
                height={80} 
                className="mx-auto mb-6"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight glow-text">
              About <span className="text-gradient">Ventaro AI</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Your bridge to the AI revolution. We offer VAI Coaching, VAI Masterclass, comprehensive toolkits, and web generation services to help you adapt and thrive in the rapidly evolving digital landscape.
            </p>
            <div className="flex justify-center">
              <Link href="/products" className="neon-button btn-lg">
                Learn Our Methods
              </Link>
            </div>
          </div>
          
          {/* Cheat Sheets Section */}
          <div className="mt-16">
            <h3 className="text-3xl font-bold text-white text-center mb-8">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                Premium Cheat Sheets - $50 Each
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <div className="glass-panel text-center p-6 border border-amber-500/20 hover:border-amber-400/30 transition-all duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-white mb-3">Business AI Implementation</h4>
                <p className="text-gray-300 text-sm mb-4">Complete step-by-step guide for implementing AI in your business operations and workflows.</p>
                <div className="text-amber-400 font-bold text-xl">$50</div>
              </div>
              
              <div className="glass-panel text-center p-6 border border-purple-500/20 hover:border-purple-400/30 transition-all duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-white mb-3">Beginners AI Systems Guide</h4>
                <p className="text-gray-300 text-sm mb-4">Essential cheat sheet for understanding and using all AI systems from beginner to advanced level.</p>
                <div className="text-amber-400 font-bold text-xl">$50</div>
              </div>
              
              <div className="glass-panel text-center p-6 border border-emerald-500/20 hover:border-emerald-400/30 transition-all duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-white mb-3">AI Business Build Guide</h4>
                <p className="text-gray-300 text-sm mb-4">Step-by-step layman's guide to building a complete online business with AI agents from start to finish.</p>
                <div className="text-amber-400 font-bold text-xl">$50</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-black relative">
        <div className="stars"></div>
        <div className="twinkling"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 glow-text">
              Our <span className="text-gradient">Mission</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Founded in Melbourne, Australia in March 2025, Ventaro AI emerged from recognizing the urgent need to help individuals and businesses adapt quickly to the AI revolution. We serve as the bridge between traditional business practices and cutting-edge AI technology, empowering you to not just survive but thrive in these rapidly changing times.
            </p>
          </div>
        </div>
      </div>

      {/* What We Offer Section */}
      <div className="py-16 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 glow-text">
              <span className="text-gradient">VAI TOOLKIT</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <div className="glass-panel text-center p-8 relative">
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-3 py-1 rounded-full font-bold border border-blue-400/30">#1 OFFER</div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">VAI Coaching</h3>
              <p className="text-gray-300">
                Personalized one-on-one coaching sessions to accelerate your AI journey and business transformation.
              </p>
            </div>
            
            <div className="glass-panel text-center p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">AI Masterclass</h3>
              <div className="bg-gray-800/50 text-gray-300 text-sm px-3 py-1 rounded-full inline-block mb-3 border border-gray-600/30">COMING SOON</div>
              <p className="text-gray-300">
                Comprehensive masterclass covering advanced AI strategies and implementation techniques.
              </p>
            </div>
            
            <div className="glass-panel text-center p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">VAI Toolkit</h3>
              <p className="text-gray-300">
                Complete toolkit with AI tools, prompts, templates, and resources for immediate implementation.
              </p>
            </div>
            
            <div className="glass-panel text-center p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Web Generation</h3>
              <div className="bg-gray-800/50 text-gray-300 text-sm px-3 py-1 rounded-full inline-block mb-3 border border-gray-600/30">COMING SOON</div>
              <p className="text-gray-300">
                AI-powered web development and design services to create stunning, functional websites.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-16 bg-black relative">
        <div className="stars"></div>
        <div className="twinkling"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 glow-text">
                Why Choose <span className="text-gradient">Ventaro AI</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-panel p-6">
                <h3 className="text-xl font-bold text-white mb-4">Proven Results</h3>
                <p className="text-gray-300">
                  Our methods have helped hundreds of entrepreneurs build successful AI-powered businesses from scratch.
                </p>
              </div>
              
              <div className="glass-panel p-6">
                <h3 className="text-xl font-bold text-white mb-4">Expert Guidance</h3>
                <p className="text-gray-300">
                  Learn from AI experts who have built and scaled multiple successful online businesses.
                </p>
              </div>
              
              <div className="glass-panel p-6">
                <h3 className="text-xl font-bold text-white mb-4">Continuous Updates</h3>
                <p className="text-gray-300">
                  Stay ahead with regular updates as AI technology evolves and new opportunities emerge.
                </p>
              </div>
              
              <div className="glass-panel p-6">
                <h3 className="text-xl font-bold text-white mb-4">Community Support</h3>
                <p className="text-gray-300">
                  Join a community of like-minded entrepreneurs sharing insights and supporting each other.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900 relative">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 glow-text">
              Ready to Start Your AI Journey?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join the AI revolution and learn the exact methods we use to create high-quality digital products with artificial intelligence.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/products" className="btn-primary btn-lg">
                Explore Products
              </Link>
              <Link href="/contact" className="btn-outline btn-lg">
                Get in Touch
              </Link>
            </div>
            <div className="mt-8 text-gray-500 text-sm">
              100% AI-Designed • Professional Quality • Expert Teaching
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}