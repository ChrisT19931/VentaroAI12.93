'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import AnimatedHeading from '@/components/AnimatedHeading';

export default function VAICoaching() {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleDirectCheckout = async (productId: string, productName: string) => {
    setIsLoading(productId);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [{
            id: productId,
            name: productName,
            price: 250, // September 2025 special price
            quantity: 1,
            image: '/images/products/coaching-session.svg',
            productType: 'coaching'
          }]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to start checkout. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">


      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-b from-black via-gray-950 to-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/5 via-transparent to-gray-900/5"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-900/40 to-gray-800/40 backdrop-blur-sm border border-gray-600/30 rounded-full px-6 py-3 mb-6">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <span className="text-gray-300 font-semibold text-sm uppercase tracking-wider">Personalized AI Coaching</span>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
              </div>
              
              <div className="relative">
                <div className="absolute -inset-1 bg-emerald-500/10 rounded-lg blur-md z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <AnimatedHeading 
                  className="text-5xl md:text-7xl mb-6 leading-tight" 
                  animation="slide-up" 
                  theme="silver" 
                  is3D={true}
                >
                  <span className="text-white drop-shadow-2xl border-l-4 border-gray-500/40 pl-4">VAI COACHING</span>
                </AnimatedHeading>
              </div>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto">
                Get personalized one-on-one guidance directly from the founder & director of VAI. All coaching sessions now available at <span className="line-through text-gray-500">$300</span> <span className="text-white font-semibold">$250</span> each for September 2025 only.
              </p>
            </motion.div>
          </div>

          {/* Coaching Offers Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 perspective-1000">
            {/* AI for Beginners */}
            <motion.div 
              className="group relative bg-gradient-to-br from-gray-900/60 via-gray-800/50 to-black/95 backdrop-blur-2xl rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.9)] hover:shadow-[0_35px_60px_-12px_rgba(255,255,255,0.1)] transition-all duration-700 transform hover:-translate-y-8 hover:scale-110 hover:rotate-y-12 overflow-hidden border-2 border-gray-700/60 hover:border-gray-500/80"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-gray-600/20 via-transparent to-gray-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-700"></div>
              
              <div className="absolute top-4 left-4 z-20">
                <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-[0_8px_25px_-8px_rgba(16,185,129,0.6)] hover:shadow-[0_12px_35px_-8px_rgba(16,185,129,0.8)] transform hover:scale-110 transition-all duration-500 border border-emerald-400/30">
                  BEGINNER FRIENDLY
                </div>
              </div>
              
              <div className="h-40 bg-gradient-to-br from-gray-900 to-black relative overflow-hidden flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-gray-800 group-hover:to-gray-900 transition-all duration-700 shadow-inner">
                <div className="relative transform group-hover:scale-150 group-hover:rotate-12 transition-all duration-700 hover:rotate-y-180">
                  <svg className="w-20 h-20 text-gray-400 opacity-80 group-hover:opacity-100 group-hover:text-gray-300 transition-all duration-700 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <div className="absolute inset-0 bg-gray-400/30 rounded-full blur-3xl group-hover:bg-gray-300/50 transition-all duration-700 animate-pulse"></div>
                  <div className="absolute -inset-4 bg-gradient-to-r from-gray-500/15 to-gray-400/15 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-700"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent group-hover:from-black/60 transition-all duration-700"></div>
              </div>
              
              <div className="p-6">
                <AnimatedHeading 
                  className="text-2xl mb-3" 
                  animation="slide-right" 
                  theme="emerald" 
                  is3D={true}
                  delay={200}
                >
                  AI for Beginners
                </AnimatedHeading>
                <p className="text-gray-300 mb-6 text-sm leading-relaxed group-hover:text-white transition-colors duration-300">Comprehensive AI guidance for sales professionals and entrepreneurs. Get up to date with the full range of AI tools, learn how to use them effectively for your goals, and master practical applications for business growth.</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2 transform group-hover:translate-x-2 transition-all duration-300">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-lg group-hover:shadow-emerald-400/50 transition-all duration-300"></div>
                    <span className="text-xs text-gray-400 group-hover:text-emerald-200 transition-colors duration-300">60-minute consultation call</span>
                  </div>
                  <div className="flex items-center space-x-2 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.1s'}}>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-lg group-hover:shadow-emerald-400/50 transition-all duration-300"></div>
                    <span className="text-xs text-gray-400 group-hover:text-emerald-200 transition-colors duration-300">Unlimited email support (1 month)</span>
                  </div>
                  <div className="flex items-center space-x-2 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.2s'}}>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-lg group-hover:shadow-emerald-400/50 transition-all duration-300"></div>
                    <span className="text-xs text-gray-400 group-hover:text-emerald-200 transition-colors duration-300">Complete AI beginner cheat sheet</span>
                  </div>
                </div>
                
                <div className="text-center mb-6">
                  <div className="text-4xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-200 group-hover:to-white transition-all duration-700 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] group-hover:drop-shadow-[0_8px_16px_rgba(255,255,255,0.2)]}"><span className="line-through text-gray-500 text-3xl">A$300</span> <span>A$250</span></div>
                  <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-500">September 2025 special offer</div>
                </div>
                
                <button 
                  onClick={() => handleDirectCheckout('vai-beginners-mastery', 'VAI Beginners Mastery')}
                  disabled={isLoading === 'vai-beginners-mastery'}
                  className="w-full block text-center py-4 rounded-xl font-bold transition-all duration-700 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-sm transform group-hover:scale-110 group-hover:shadow-[0_15px_35px_-5px_rgba(16,185,129,0.6)] hover:shadow-[0_20px_45px_-5px_rgba(16,185,129,0.8)] border border-emerald-500/30 hover:border-emerald-400/60 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading === 'vai-beginners-mastery' ? 'Processing...' : 'Secure Your Spot'}
                </button>
              </div>
            </motion.div>
            
            {/* AI Web Development */}
            <motion.div 
              className="group relative bg-gradient-to-br from-gray-800/60 via-gray-900/50 to-black/95 backdrop-blur-2xl rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.9)] hover:shadow-[0_35px_60px_-12px_rgba(255,255,255,0.08)] transition-all duration-700 transform hover:-translate-y-8 hover:scale-110 hover:rotate-y-12 overflow-hidden border-2 border-gray-600/60 hover:border-gray-400/80"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-gray-500/20 via-transparent to-gray-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-gray-500 via-gray-600 to-gray-500 rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-700"></div>
              
              <div className="absolute top-4 left-4 z-20">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-[0_8px_25px_-8px_rgba(59,130,246,0.6)] hover:shadow-[0_12px_35px_-8px_rgba(59,130,246,0.8)] transform hover:scale-110 transition-all duration-500 border border-blue-400/30">
                  PROFESSIONAL
                </div>
              </div>
              
              <div className="h-40 bg-gradient-to-br from-gray-800 to-black relative overflow-hidden flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-gray-700 group-hover:to-gray-900 transition-all duration-700 shadow-inner">
                <div className="relative transform group-hover:scale-150 group-hover:rotate-12 transition-all duration-700 hover:rotate-y-180">
                  <svg className="w-20 h-20 text-gray-300 opacity-80 group-hover:opacity-100 group-hover:text-gray-200 transition-all duration-700 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <div className="absolute inset-0 bg-gray-300/30 rounded-full blur-3xl group-hover:bg-gray-200/50 transition-all duration-700 animate-pulse"></div>
                  <div className="absolute -inset-4 bg-gradient-to-r from-gray-400/15 to-gray-500/15 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-700"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:from-black/50 transition-all duration-500"></div>
              </div>
              
              <div className="p-6">
                <AnimatedHeading 
                  className="text-2xl mb-3" 
                  animation="slide-left" 
                  theme="blue" 
                  is3D={true}
                  delay={300}
                >
                  AI for Web Developers
                </AnimatedHeading>
                <p className="text-gray-300 mb-6 text-sm leading-relaxed group-hover:text-white transition-colors duration-300">Learn how to leverage AI tools to create online platforms, tools, and SaaS applications. Master AI-powered development workflows, automation strategies, and cutting-edge implementation techniques for modern web development.</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2 transform group-hover:translate-x-2 transition-all duration-300">
                    <div className="w-2 h-2 bg-blue-400 rounded-full shadow-lg group-hover:shadow-blue-400/50 transition-all duration-300"></div>
                    <span className="text-xs text-gray-400 group-hover:text-blue-200 transition-colors duration-300">60-minute consultation call</span>
                  </div>
                  <div className="flex items-center space-x-2 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.1s'}}>
                    <div className="w-2 h-2 bg-blue-400 rounded-full shadow-lg group-hover:shadow-blue-400/50 transition-all duration-300"></div>
                    <span className="text-xs text-gray-400 group-hover:text-blue-200 transition-colors duration-300">Unlimited email support (1 month)</span>
                  </div>
                  <div className="flex items-center space-x-2 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.2s'}}>
                    <div className="w-2 h-2 bg-blue-400 rounded-full shadow-lg group-hover:shadow-blue-400/50 transition-all duration-300"></div>
                    <span className="text-xs text-gray-400 group-hover:text-blue-200 transition-colors duration-300">Technical implementation guide</span>
                  </div>
                </div>
                
                <div className="text-center mb-6">
                  <div className="text-4xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-100 group-hover:to-white transition-all duration-700 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] group-hover:drop-shadow-[0_8px_16px_rgba(255,255,255,0.2)]}"><span className="line-through text-gray-500 text-3xl">A$300</span> <span>A$250</span></div>
                  <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-500">September 2025 special offer</div>
                </div>
                
                <button 
                  onClick={() => handleDirectCheckout('vai-web-dev-elite', 'VAI Web Development Elite')}
                  disabled={isLoading === 'vai-web-dev-elite'}
                  className="w-full block text-center py-4 rounded-xl font-bold transition-all duration-700 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-sm transform group-hover:scale-110 group-hover:shadow-[0_15px_35px_-5px_rgba(59,130,246,0.6)] hover:shadow-[0_20px_45px_-5px_rgba(59,130,246,0.8)] border border-blue-500/30 hover:border-blue-400/60 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading === 'vai-web-dev-elite' ? 'Processing...' : 'Claim Your Edge'}
                </button>
              </div>
            </motion.div>
            
            {/* AI Business Strategy */}
            <motion.div 
              className="group relative bg-gradient-to-br from-gray-700/60 via-gray-800/50 to-black/95 backdrop-blur-2xl rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.9)] hover:shadow-[0_35px_60px_-12px_rgba(255,255,255,0.06)] transition-all duration-700 transform hover:-translate-y-8 hover:scale-110 hover:rotate-y-12 overflow-hidden border-2 border-gray-500/60 hover:border-gray-300/80"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-gray-400/20 via-transparent to-gray-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-gray-400 via-gray-600 to-gray-400 rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-700"></div>
              
              <div className="absolute top-4 left-4 z-20">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-[0_8px_25px_-8px_rgba(168,85,247,0.6)] hover:shadow-[0_12px_35px_-8px_rgba(168,85,247,0.8)] transform hover:scale-110 transition-all duration-500 border border-purple-400/30">
                  EXECUTIVE
                </div>
              </div>
              
              <div className="h-40 bg-gradient-to-br from-gray-700 to-black relative overflow-hidden flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-gray-600 group-hover:to-gray-800 transition-all duration-700 shadow-inner">
                <div className="relative transform group-hover:scale-150 group-hover:rotate-12 transition-all duration-700 hover:rotate-y-180">
                  <svg className="w-20 h-20 text-gray-200 opacity-80 group-hover:opacity-100 group-hover:text-gray-100 transition-all duration-700 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <div className="absolute inset-0 bg-gray-200/30 rounded-full blur-3xl group-hover:bg-gray-100/50 transition-all duration-700 animate-pulse"></div>
                  <div className="absolute -inset-4 bg-gradient-to-r from-gray-300/15 to-gray-400/15 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-700"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent group-hover:from-black/60 transition-all duration-700"></div>
              </div>
              
              <div className="p-6">
                <AnimatedHeading 
                  className="text-2xl mb-3" 
                  animation="slide-up" 
                  theme="purple" 
                  is3D={true}
                  delay={400}
                >
                  AI for Business
                </AnimatedHeading>
                <p className="text-gray-300 mb-6 text-sm leading-relaxed group-hover:text-white transition-colors duration-300">Strategic AI guidance for employers and business leaders. Understand AI capabilities, implementation strategies, and how to effectively integrate AI solutions into your organization for competitive advantage and operational efficiency.</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2 transform group-hover:translate-x-2 transition-all duration-300">
                    <div className="w-2 h-2 bg-purple-400 rounded-full shadow-lg group-hover:shadow-purple-400/50 transition-all duration-300"></div>
                    <span className="text-xs text-gray-400 group-hover:text-purple-200 transition-colors duration-300">90-minute strategy session</span>
                  </div>
                  <div className="flex items-center space-x-2 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.1s'}}>
                    <div className="w-2 h-2 bg-purple-400 rounded-full shadow-lg group-hover:shadow-purple-400/50 transition-all duration-300"></div>
                    <span className="text-xs text-gray-400 group-hover:text-purple-200 transition-colors duration-300">Unlimited email support (1 month)</span>
                  </div>
                  <div className="flex items-center space-x-2 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.2s'}}>
                    <div className="w-2 h-2 bg-purple-400 rounded-full shadow-lg group-hover:shadow-purple-400/50 transition-all duration-300"></div>
                    <span className="text-xs text-gray-400 group-hover:text-purple-200 transition-colors duration-300">Custom AI strategy roadmap</span>
                  </div>
                </div>
                
                <div className="text-center mb-6">
                  <div className="text-4xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-50 group-hover:to-white transition-all duration-700 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] group-hover:drop-shadow-[0_8px_16px_rgba(255,255,255,0.2)]"><span className="line-through text-gray-500 text-3xl">A$300</span> <span>A$250</span></div>
                  <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-500">September 2025 special offer</div>
                </div>
                
                <button 
                  onClick={() => handleDirectCheckout('ai-business-strategy', 'AI Business Strategy Session')}
                  disabled={isLoading === 'ai-business-strategy'}
                  className="w-full block text-center py-4 rounded-xl font-bold transition-all duration-700 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-sm transform group-hover:scale-110 group-hover:shadow-[0_15px_35px_-5px_rgba(168,85,247,0.6)] hover:shadow-[0_20px_45px_-5px_rgba(168,85,247,0.8)] border border-purple-500/30 hover:border-purple-400/60 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading === 'ai-business-strategy' ? 'Processing...' : 'Book Strategy Session'}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Benefits Section */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <AnimatedHeading 
              className="text-3xl md:text-4xl mb-8" 
              animation="fade" 
              theme="gold" 
              is3D={true}
              delay={500}
            >
              Why Choose VAI Coaching?
            </AnimatedHeading>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <motion.div 
                className="text-center group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative w-full h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-2xl">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <AnimatedHeading 
                  className="text-xl mb-3" 
                  animation="slide-up" 
                  theme="emerald" 
                  is3D={true}
                  delay={600}
                >
                  Proven Results
                </AnimatedHeading>
                <p className="text-gray-300 group-hover:text-white transition-colors duration-300 leading-relaxed">Direct mentorship from the founder & director of VAI with a track record of successful AI implementations across industries</p>
              </motion.div>
              
              <motion.div 
                className="text-center group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-2xl">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <AnimatedHeading 
                  className="text-xl mb-3" 
                  animation="slide-up" 
                  theme="blue" 
                  is3D={true}
                  delay={700}
                >
                  Cutting-Edge Expertise
                </AnimatedHeading>
                <p className="text-gray-300 group-hover:text-white transition-colors duration-300 leading-relaxed">Learn the latest AI technologies and implementation strategies directly from VAI's founder</p>
              </motion.div>
              
              <motion.div 
                className="text-center group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-2xl">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <AnimatedHeading 
                  className="text-xl mb-3" 
                  animation="slide-up" 
                  theme="purple" 
                  is3D={true}
                  delay={800}
                >
                  Personal Mentorship
                </AnimatedHeading>
                <p className="text-gray-300 group-hover:text-white transition-colors duration-300 leading-relaxed">One-on-one guidance tailored specifically to your business needs and goals</p>
              </motion.div>
            </div>
          </motion.div>

          {/* September 2025 Special Offer */}
          <motion.div 
            className="mt-24 mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-orange-500/20 rounded-3xl blur-3xl animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-16 border border-amber-500/30 shadow-2xl">
                <div className="text-center">
                  <span className="inline-block px-6 py-2 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full text-sm font-bold text-white mb-6 border border-amber-400/40 shadow-xl shadow-amber-500/20">
                    SEPTEMBER 2025 SPECIAL OFFER
                  </span>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <AnimatedHeading 
                      className="text-4xl md:text-6xl mb-8" 
                      animation="scale" 
                      theme="gold" 
                      is3D={true}
                      deep3D={true}
                      delay={900}
                    >
                      Limited Time Discount
                    </AnimatedHeading>
                  </motion.div>
                  <motion.p 
                    className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    Book your personalized AI coaching session now and save $50 on all coaching packages for September 2025 only.
                  </motion.p>
                  <motion.div
                    className="flex flex-col sm:flex-row gap-8 justify-center items-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <motion.button
                      className="group relative px-12 py-6 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-white font-bold text-lg rounded-2xl overflow-hidden shadow-2xl hover:shadow-amber-500/25 transition-all duration-500"
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                      <span className="relative flex items-center gap-3">
                        Schedule Your Session
                        <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </motion.button>
                    <div className="text-center">
                      <p className="text-lg font-bold text-white mb-1"><span className="line-through text-gray-400">$300</span> <span className="text-amber-400">$250</span> per session</p>
                      <p className="text-sm text-gray-400">Limited time offer for September 2025</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
         </div>
       </section>
    </div>
  );
}