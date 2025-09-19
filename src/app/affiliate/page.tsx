'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AnimatedHeading from '@/components/AnimatedHeading';

export default function AffiliatePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-gray-950 via-black to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-gray-600/5 to-gray-800/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-gray-500/5 to-gray-700/5 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                Ventaro AI <span className="bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">Affiliate Program</span>
              </h1>
            </div>
            <div className="bg-gradient-to-br from-gray-900/60 to-gray-950/60 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8 mb-12">
              <p className="text-2xl text-gray-300 mb-6 leading-relaxed">
                We deliver the transformation, create the value, and accelerate your speed to market. Whether you need us to teach your team or build the solution ourselves, we adapt to your needs and timeline.
              </p>
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-full border border-gray-600/30">
                <span className="text-gray-400 font-medium">Program Status:</span>
                <span className="ml-2 text-gray-300 font-semibold">Coming Soon</span>
              </div>
            </div>
            <p className="text-xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed">
              Join our affiliate network and earn rewards by sharing the power of AI business solutions with your network
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                href="/contact" 
                className="px-10 py-4 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-semibold rounded-xl transition-all duration-300 hover:from-gray-600 hover:to-gray-700 border border-gray-600/50 hover:border-gray-500/50"
              >
                Register Interest
              </Link>
              <Link 
                href="/" 
                className="px-10 py-4 border border-gray-600 text-gray-300 font-semibold rounded-xl transition-all duration-300 hover:bg-gray-800/50 hover:text-white hover:border-gray-500"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-20 bg-gradient-to-br from-black via-gray-950 to-black relative">
        <div className="absolute inset-0">
          <div className="absolute top-16 left-16 w-80 h-80 bg-gradient-to-r from-gray-600/5 to-gray-800/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-16 right-16 w-72 h-72 bg-gradient-to-r from-gray-500/5 to-gray-700/5 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-12">
              Program <span className="bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">Launching Soon</span>
            </h2>
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center mx-auto mb-4 border border-gray-600/30">
                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Competitive Rewards</h3>
                  <p className="text-gray-400">Earn attractive commissions for successful referrals</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center mx-auto mb-4 border border-gray-600/30">
                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Marketing Support</h3>
                  <p className="text-gray-400">Access professional marketing materials and resources</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center mx-auto mb-4 border border-gray-600/30">
                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Real-Time Tracking</h3>
                  <p className="text-gray-400">Monitor your performance with detailed analytics</p>
                </div>
              </div>
              <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                We're currently developing our affiliate program to help partners earn rewards while sharing valuable AI business solutions with their network.
              </p>
              <p className="text-lg text-gray-400 mb-10 leading-relaxed">
                Register your interest now to be the first to know when our affiliate program launches and secure early access benefits.
              </p>
              <div className="flex justify-center">
                <Link 
                  href="/contact" 
                  className="px-10 py-4 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-semibold rounded-xl transition-all duration-300 hover:from-gray-600 hover:to-gray-700 border border-gray-600/50 hover:border-gray-500/50"
                >
                  Register Interest
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}