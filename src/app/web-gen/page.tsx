'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import SubscriptionForm from '@/components/SubscriptionForm';

export default function WebGenPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get current user (optional for web gen viewing)
  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session]);

  const handleEarlyAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/subscription-interest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          source: 'ai-web-gen',
          interests: ['AI Web Generator']
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      toast.success('Thanks! You\'ll be notified when VAI Web Gen launches.');
      if (!session?.user?.email) {
        setEmail('');
      }
    } catch (error) {
      console.error('Early access signup error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-emerald-600/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-600/5 to-pink-600/5 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full border border-blue-500/30 mb-8">
            <span className="text-blue-300 text-sm font-bold tracking-wide">🚀 COMING SOON</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl">
            VAI <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">Web Gen</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
            🎯 <strong className="text-white">AI-Powered Website Generator</strong> • Create stunning, professional websites in minutes with our advanced AI technology
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-full px-6 py-3">
              <span className="text-emerald-400">✅</span>
              <span className="text-gray-200 font-medium">AI-Generated Designs</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-full px-6 py-3">
              <span className="text-emerald-400">✅</span>
              <span className="text-gray-200 font-medium">Responsive & Modern</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-full px-6 py-3">
              <span className="text-emerald-400">✅</span>
              <span className="text-gray-200 font-medium">SEO Optimized</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-full px-6 py-3">
              <span className="text-emerald-400">✅</span>
              <span className="text-gray-200 font-medium">One-Click Deploy</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Lightning Fast</h3>
            <p className="text-gray-400 leading-relaxed">
              Generate complete websites in under 60 seconds. Our AI understands your business and creates tailored designs instantly.
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Smart Customization</h3>
            <p className="text-gray-400 leading-relaxed">
              AI-powered design suggestions that adapt to your industry, brand colors, and content preferences automatically.
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8 hover:border-emerald-500/30 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Production Ready</h3>
            <p className="text-gray-400 leading-relaxed">
              Every generated website is mobile-responsive, SEO-optimized, and ready for immediate deployment to your domain.
            </p>
          </div>
        </div>

        {/* Early Access Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Get <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Early Access</span>
              </h2>
              <p className="text-gray-400">
                Be the first to experience the future of website creation. Join our exclusive early access list.
              </p>
            </div>
            
            <SubscriptionForm 
              source="ai-web-gen"
              className="w-full"
            />
          </div>
        </div>

        {/* Process Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Works</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Three simple steps to your professional website
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Describe Your Vision</h3>
              <p className="text-gray-400">
                Tell our AI about your business, goals, and design preferences in natural language.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">AI Creates & Refines</h3>
              <p className="text-gray-400">
                Watch as our AI generates multiple design options and refines them based on your feedback.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Launch & Succeed</h3>
              <p className="text-gray-400">
                Deploy your website instantly with built-in SEO, analytics, and performance optimization.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}