'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AnimatedHeading from '@/components/AnimatedHeading';

export default function AffiliatePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedHeading
              className="text-4xl md:text-6xl font-bold text-white mb-6"
              animation="slide-up"
              theme="gold"
              is3D={true}
            >
              Ventaro AI <span className="text-gradient">Affiliate Program</span>
            </AnimatedHeading>
            <p className="text-xl text-gray-300 mb-10">
              Coming Soon - Join our affiliate network and earn rewards by sharing the power of AI business solutions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 hover:scale-105"
              >
                Register Interest
              </Link>
              <Link 
                href="/" 
                className="px-8 py-4 bg-gray-800 text-gray-300 font-semibold rounded-xl transition-all duration-300 hover:bg-gray-700 hover:text-white"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedHeading
              className="text-3xl md:text-5xl font-bold text-white mb-8"
              animation="slide-up"
              theme="gold"
              is3D={true}
              delay={0.2}
            >
              Program <span className="text-amber-500">Launching Soon</span>
            </AnimatedHeading>
            <div className="glass-panel p-8 rounded-2xl border border-amber-500/30">
              <p className="text-xl text-gray-300 mb-6">
                We're currently developing our affiliate program to help partners earn rewards while sharing valuable AI business solutions with their network.
              </p>
              <p className="text-lg text-gray-400 mb-8">
                Register your interest now to be the first to know when our affiliate program launches and secure early access benefits.
              </p>
              <div className="flex justify-center">
                <Link 
                  href="/contact" 
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 hover:scale-105"
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