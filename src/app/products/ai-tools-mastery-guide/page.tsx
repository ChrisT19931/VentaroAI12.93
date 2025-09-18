'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Download, BookOpen, Star, CheckCircle, ArrowRight } from 'lucide-react';

export default function AIToolsMasteryGuidePage() {
  const { data: session } = useSession();
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      // Check if user is admin
      const isAdmin = session?.user?.email === 'chris.t@ventarosales.com';
      
      if (isAdmin) {
        setHasAccess(true);
        setIsLoading(false);
        return;
      }

      // Check if user owns this product
      try {
        const response = await fetch('/api/user/products');
        if (response.ok) {
          const data = await response.json();
          const ownedProducts = data.products || [];
          setHasAccess(ownedProducts.includes('1') || ownedProducts.includes('ebook'));
        }
      } catch (error) {
        console.error('Error checking product access:', error);
      }
      
      setIsLoading(false);
    };

    if (session) {
      checkAccess();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">🔐</div>
          <h1 className="text-3xl font-bold text-white mb-4">Sign In Required</h1>
          <p className="text-gray-300 mb-8">Please sign in to access your AI Tools Mastery Guide.</p>
          <Link 
            href="/signin?callbackUrl=/products/ai-tools-mastery-guide" 
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-3xl font-bold text-white mb-4">Purchase Required</h1>
          <p className="text-gray-300 mb-8">You need to purchase the AI Tools Mastery Guide to access this content.</p>
          <div className="space-x-4">
            <Link 
              href="/products" 
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              View Products
            </Link>
            <Link 
              href="/my-account" 
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              My Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">📚</div>
          <h1 className="text-5xl font-bold text-white mb-6">AI Tools Mastery Guide 2025</h1>
          <p className="text-xl text-gray-300 mb-4">
            Complete 30-page guide to building profitable online businesses with AI
          </p>
          <div className="flex items-center justify-center gap-4 text-green-400">
            <CheckCircle className="w-6 h-6" />
            <span className="text-lg font-semibold">Access Granted</span>
          </div>
        </div>

        {/* Quick Access */}
        <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-2xl p-8 mb-12 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Ready to Download</h2>
              <p className="text-gray-300">Get instant access to your complete AI business guide</p>
            </div>
            <a
              href="/downloads/ai-tools-mastery-guide-2025.pdf"
              download
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Download className="w-6 h-6 mr-3" />
              Download PDF Guide
            </a>
          </div>
        </div>

        {/* What's Inside */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-900/60 rounded-2xl p-8 border border-gray-700">
            <div className="flex items-center mb-6">
              <BookOpen className="w-8 h-8 text-emerald-400 mr-3" />
              <h3 className="text-2xl font-bold text-white">What's Inside</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold">AI Tools Mastery</h4>
                  <p className="text-gray-300 text-sm">Master ChatGPT, Claude, Grok, and Gemini for business</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold">Revenue Generation</h4>
                  <p className="text-gray-300 text-sm">Proven strategies for making money with AI</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold">Marketing Automation</h4>
                  <p className="text-gray-300 text-sm">Automate content creation and customer service</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold">Real-World Case Studies</h4>
                  <p className="text-gray-300 text-sm">Learn from successful AI business implementations</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold">Step-by-Step Implementation</h4>
                  <p className="text-gray-300 text-sm">Complete guides for launching your AI business</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/60 rounded-2xl p-8 border border-gray-700">
            <div className="flex items-center mb-6">
              <Star className="w-8 h-8 text-yellow-400 mr-3" />
              <h3 className="text-2xl font-bold text-white">Key Benefits</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <ArrowRight className="w-5 h-5 text-yellow-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold">Launch Your AI Business in 2025</h4>
                  <p className="text-gray-300 text-sm">Complete roadmap from idea to profitable business</p>
                </div>
              </div>
              <div className="flex items-start">
                <ArrowRight className="w-5 h-5 text-yellow-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold">Save 100+ Hours of Research</h4>
                  <p className="text-gray-300 text-sm">Everything you need to know in one comprehensive guide</p>
                </div>
              </div>
              <div className="flex items-start">
                <ArrowRight className="w-5 h-5 text-yellow-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold">Competitive Advantage</h4>
                  <p className="text-gray-300 text-sm">Stay ahead with cutting-edge AI strategies</p>
                </div>
              </div>
              <div className="flex items-start">
                <ArrowRight className="w-5 h-5 text-yellow-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold">Scalable Systems</h4>
                  <p className="text-gray-300 text-sm">Build automated workflows that grow with you</p>
                </div>
              </div>
              <div className="flex items-start">
                <ArrowRight className="w-5 h-5 text-yellow-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold">Future-Proof Skills</h4>
                  <p className="text-gray-300 text-sm">Master AI tools that will dominate 2025 and beyond</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="bg-gray-900/60 rounded-2xl p-8 border border-gray-700 mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">Bonus Resources</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h4 className="text-white font-semibold mb-2">AI Prompts Collection</h4>
              <p className="text-gray-300 text-sm">Ready-to-use prompts for every business scenario</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">📊</div>
              <h4 className="text-white font-semibold mb-2">Business Templates</h4>
              <p className="text-gray-300 text-sm">Proven templates for rapid business development</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🚀</div>
              <h4 className="text-white font-semibold mb-2">Launch Checklist</h4>
              <p className="text-gray-300 text-sm">Step-by-step checklist to launch your AI business</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <div className="space-x-4">
            <Link 
              href="/my-account" 
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Back to My Account
            </Link>
            <Link 
              href="/products/ai-prompts-arsenal" 
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              View AI Prompts Arsenal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}