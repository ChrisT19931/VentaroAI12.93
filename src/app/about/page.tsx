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
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-black to-gray-900">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-gray-500/10 to-gray-700/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-gray-600/10 to-gray-800/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="text-center max-w-5xl mx-auto">
            <div className="mb-12">
              <Image 
                src="/images/ventaro-logo.svg" 
                alt="Ventaro AI" 
                width={320} 
                height={85} 
                className="mx-auto mb-8 opacity-90"
              />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              About <span className="bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">Ventaro AI</span>
            </h1>
            <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6 leading-relaxed">
                We don't just teach you to implement - we deliver the transformation, create the value, and accelerate your speed to market.
              </h2>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                Whether you need us to train your team or build the solution ourselves, we adapt to your needs and timeline.
              </p>
            </div>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed max-w-4xl mx-auto">
              <span className="text-white font-semibold">Professional AI solutions for every business level.</span> From solo entrepreneurs to multinational enterprises - we deliver comprehensive coaching, advanced toolkits, and custom development services that scale with your ambitions.
            </p>
            <div className="flex justify-center">
              <Link href="/products" className="px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-semibold rounded-xl border border-gray-600/50 transition-all duration-300 hover:from-gray-600 hover:to-gray-700 hover:shadow-lg hover:shadow-gray-500/20">
                Explore Our Solutions
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20 bg-gradient-to-br from-black via-gray-950 to-black relative">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-r from-gray-600/5 to-gray-800/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-r from-gray-500/5 to-gray-700/5 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-12">
              Our <span className="bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">Mission</span>
            </h2>
            <div className="bg-gradient-to-r from-gray-950/80 to-gray-900/80 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-10">
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
                Founded in Melbourne, Australia in March 2025, Ventaro AI emerged from recognizing the urgent need to democratize AI expertise across all business levels. <span className="text-white font-semibold">Whether you're a startup founder or enterprise executive</span>, we serve as your bridge between traditional business practices and cutting-edge AI technology, delivering professional solutions that scale with your business needs and ambitions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* What We Offer Section */}
      <div className="py-20 bg-gradient-to-br from-gray-950 via-gray-900 to-black relative">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-gradient-to-r from-gray-600/5 to-gray-800/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-gradient-to-r from-gray-500/5 to-gray-700/5 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
              <span className="bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">Professional Solutions</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Comprehensive AI services designed to transform your business operations and accelerate growth
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-gray-800/50 rounded-2xl text-center p-8 relative hover:border-gray-700/50 transition-all duration-300">
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xs px-3 py-1 rounded-full font-semibold border border-gray-500/30">FEATURED</div>
              <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center mb-6 mx-auto border border-gray-600/30">
                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">VAI Coaching</h3>
              <p className="text-gray-400 leading-relaxed">
                Personalized one-on-one coaching sessions to accelerate your AI journey and business transformation.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-gray-800/50 rounded-2xl text-center p-8 hover:border-gray-700/50 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center mb-6 mx-auto border border-gray-600/30">
                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">AI Masterclass</h3>
              <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 text-gray-300 text-sm px-4 py-2 rounded-full inline-block mb-4 border border-gray-600/30 font-medium">COMING SOON</div>
              <p className="text-gray-400 leading-relaxed">
                Comprehensive masterclass covering advanced AI strategies and implementation techniques.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-gray-800/50 rounded-2xl text-center p-8 hover:border-gray-700/50 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center mb-6 mx-auto border border-gray-600/30">
                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">VAI Toolkit</h3>
              <p className="text-gray-400 leading-relaxed">
                Complete toolkit with AI tools, prompts, templates, and resources for immediate implementation.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-gray-800/50 rounded-2xl text-center p-8 hover:border-gray-700/50 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center mb-6 mx-auto border border-gray-600/30">
                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Web Generation</h3>
              <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 text-gray-300 text-sm px-4 py-2 rounded-full inline-block mb-4 border border-gray-600/30 font-medium">COMING SOON</div>
              <p className="text-gray-400 leading-relaxed">
                AI-powered web development and design services to create stunning, functional websites.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-20 bg-gradient-to-br from-black via-gray-950 to-black relative">
        <div className="absolute inset-0">
          <div className="absolute top-16 left-16 w-80 h-80 bg-gradient-to-r from-gray-600/5 to-gray-800/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-16 right-16 w-72 h-72 bg-gradient-to-r from-gray-500/5 to-gray-700/5 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
                Why Choose <span className="bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">Ventaro AI</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Trusted by businesses worldwide for delivering measurable AI transformation results
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8 hover:border-gray-700/50 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center mb-6 border border-gray-600/30">
                  <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Proven Results</h3>
                <p className="text-gray-400 leading-relaxed">
                  Our methods have helped hundreds of entrepreneurs build successful AI-powered businesses from scratch.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8 hover:border-gray-700/50 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center mb-6 border border-gray-600/30">
                  <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Expert Guidance</h3>
                <p className="text-gray-400 leading-relaxed">
                  Learn from AI experts who have built and scaled multiple successful online businesses.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8 hover:border-gray-700/50 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center mb-6 border border-gray-600/30">
                  <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Continuous Updates</h3>
                <p className="text-gray-400 leading-relaxed">
                  Stay ahead with regular updates as AI technology evolves and new opportunities emerge.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8 hover:border-gray-700/50 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center mb-6 border border-gray-600/30">
                  <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Community Support</h3>
                <p className="text-gray-400 leading-relaxed">
                  Join a community of like-minded entrepreneurs sharing insights and supporting each other.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-br from-gray-950 via-black to-gray-900 relative">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-gray-600/10 to-gray-800/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-gray-500/10 to-gray-700/10 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
              Ready to Transform Your <span className="bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">Business?</span>
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of entrepreneurs who are already building successful AI-powered businesses with our proven methodologies.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/products" className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-10 py-4 rounded-xl font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-300 border border-gray-600/50 hover:border-gray-500/50">
                Explore Our Products
              </Link>
              <Link href="/contact" className="border border-gray-600 text-gray-300 px-10 py-4 rounded-xl font-semibold hover:bg-gray-800/50 hover:text-white hover:border-gray-500 transition-all duration-300">
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}