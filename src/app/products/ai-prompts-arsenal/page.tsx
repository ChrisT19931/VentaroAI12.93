'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Download, Zap, Star, CheckCircle, ArrowRight, Copy, ExternalLink } from 'lucide-react';

export default function AIPromptsArsenalPage() {
  const { data: session } = useSession();
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

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
          setHasAccess(ownedProducts.includes('2') || ownedProducts.includes('prompts'));
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

  const copyToClipboard = async (text: string, promptId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPrompt(promptId);
      setTimeout(() => setCopiedPrompt(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const samplePrompts = [
    {
      id: 'business-plan',
      title: 'AI Business Plan Generator',
      category: 'Business Strategy',
      prompt: 'Create a comprehensive business plan for [BUSINESS IDEA] targeting [TARGET MARKET]. Include executive summary, market analysis, competitive landscape, revenue model, marketing strategy, operational plan, financial projections for 3 years, and risk assessment. Make it investor-ready with specific metrics and actionable steps.',
      description: 'Generate complete business plans with financial projections'
    },
    {
      id: 'content-strategy',
      title: 'Content Marketing Strategy',
      category: 'Marketing',
      prompt: 'Develop a 90-day content marketing strategy for [BUSINESS/PRODUCT] in the [INDUSTRY] space. Include content pillars, posting schedule, platform-specific content ideas, engagement tactics, hashtag strategies, and KPIs to track. Focus on building authority and driving conversions.',
      description: 'Create comprehensive content strategies that convert'
    },
    {
      id: 'sales-funnel',
      title: 'Sales Funnel Optimizer',
      category: 'Sales',
      prompt: 'Design a high-converting sales funnel for [PRODUCT/SERVICE] with price point of [PRICE]. Include awareness stage content, lead magnets, email sequences, objection handling, urgency tactics, and conversion optimization strategies. Provide specific copy examples for each stage.',
      description: 'Build sales funnels that maximize conversions'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-6 border border-gray-700">
            <div className="w-8 h-8 bg-gray-600 rounded"></div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Sign In Required</h1>
          <p className="text-gray-300 mb-8">Please sign in to access your AI Prompts Arsenal.</p>
          <Link 
            href="/signin?callbackUrl=/products/ai-prompts-arsenal" 
            className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors border border-gray-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-6 border border-gray-700">
            <div className="w-8 h-8 bg-gray-600 rounded"></div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Purchase Required</h1>
          <p className="text-gray-300 mb-8">You need to purchase the AI Prompts Arsenal to access this content.</p>
          <div className="space-x-4">
            <Link 
              href="/products" 
              className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors border border-gray-700"
            >
              View Products
            </Link>
            <Link 
              href="/my-account" 
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors border border-gray-600"
            >
              My Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-6 border border-gray-700">
            <div className="w-8 h-8 bg-gray-600 rounded"></div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">AI Prompts Arsenal 2025</h1>
          <p className="text-xl text-gray-300 mb-4">
            500+ battle-tested AI prompts for building profitable online businesses
          </p>
          <div className="flex items-center justify-center gap-4 text-gray-300">
            <CheckCircle className="w-6 h-6" />
            <span className="text-lg font-semibold">Access Granted</span>
          </div>
        </div>

        {/* Quick Access */}
        <div className="bg-gray-900 rounded-lg p-8 mb-12 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Complete Prompts Collection</h2>
              <p className="text-gray-300">Download all 500+ prompts organized by category</p>
            </div>
            <a
              href="/downloads/ai-prompts-arsenal-2025.pdf"
              download
              className="inline-flex items-center px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold text-lg rounded-lg transition-all duration-300 border border-gray-700"
            >
              <Download className="w-6 h-6 mr-3" />
              Download All Prompts
            </a>
          </div>
        </div>

        {/* Sample Prompts */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-white mb-8 text-center">Sample Prompts</h3>
          <div className="grid gap-6">
            {samplePrompts.map((prompt) => (
              <div key={prompt.id} className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-xl font-bold text-white">{prompt.title}</h4>
                      <span className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full border border-gray-700">
                        {prompt.category}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">{prompt.description}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(prompt.prompt, prompt.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors border border-gray-600"
                  >
                    {copiedPrompt === prompt.id ? (
                      <CheckCircle className="w-4 h-4 text-gray-300" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {copiedPrompt === prompt.id ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <p className="text-gray-200 text-sm leading-relaxed">{prompt.prompt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Overview */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-900 rounded border border-gray-400 p-8">
            <div className="flex items-center mb-6">
              <Zap className="w-8 h-8 text-gray-400 mr-3" />
              <h3 className="text-2xl font-bold text-white">Prompt Categories</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white">Business Strategy</span>
                <span className="text-gray-300 font-semibold">75+ prompts</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Marketing & Sales</span>
                <span className="text-gray-300 font-semibold">120+ prompts</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Content Creation</span>
                <span className="text-gray-300 font-semibold">100+ prompts</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Customer Service</span>
                <span className="text-gray-300 font-semibold">60+ prompts</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Product Development</span>
                <span className="text-gray-300 font-semibold">50+ prompts</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Financial Planning</span>
                <span className="text-gray-300 font-semibold">40+ prompts</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Operations & Automation</span>
                <span className="text-gray-300 font-semibold">55+ prompts</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded border border-gray-400 p-8">
            <div className="flex items-center mb-6">
              <Star className="w-8 h-8 text-gray-400 mr-3" />
              <h3 className="text-2xl font-bold text-white">What You Get</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-5 h-5 bg-gray-500 rounded-full mr-3 mt-1 flex-shrink-0"></div>
                <div>
                  <h4 className="text-white font-semibold">500+ Professional Prompts</h4>
                  <p className="text-gray-300 text-sm">Carefully crafted and tested for maximum results</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-5 h-5 bg-gray-500 rounded-full mr-3 mt-1 flex-shrink-0"></div>
                <div>
                  <h4 className="text-white font-semibold">Organized by Category</h4>
                  <p className="text-gray-300 text-sm">Easy to find exactly what you need</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-5 h-5 bg-gray-500 rounded-full mr-3 mt-1 flex-shrink-0"></div>
                <div>
                  <h4 className="text-white font-semibold">Copy-Paste Ready</h4>
                  <p className="text-gray-300 text-sm">No editing required - use immediately</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-5 h-5 bg-gray-500 rounded-full mr-3 mt-1 flex-shrink-0"></div>
                <div>
                  <h4 className="text-white font-semibold">Regular Updates</h4>
                  <p className="text-gray-300 text-sm">New prompts added monthly</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-5 h-5 bg-gray-500 rounded-full mr-3 mt-1 flex-shrink-0"></div>
                <div>
                  <h4 className="text-white font-semibold">Multi-Platform Compatible</h4>
                  <p className="text-gray-300 text-sm">Works with ChatGPT, Claude, Gemini, and more</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Tips */}
        <div className="bg-gray-900 rounded border border-gray-400 p-8 mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">Pro Tips for Maximum Results</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <ArrowRight className="w-5 h-5 text-gray-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold">Customize Variables</h4>
                  <p className="text-gray-300 text-sm">Replace [BRACKETS] with your specific details for best results</p>
                </div>
              </div>
              <div className="flex items-start">
                <ArrowRight className="w-5 h-5 text-gray-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold">Chain Prompts</h4>
                  <p className="text-gray-300 text-sm">Use multiple prompts in sequence for complex tasks</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <ArrowRight className="w-5 h-5 text-gray-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold">Test & Iterate</h4>
                  <p className="text-gray-300 text-sm">Try different variations to find what works best</p>
                </div>
              </div>
              <div className="flex items-start">
                <ArrowRight className="w-5 h-5 text-gray-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold">Save Favorites</h4>
                  <p className="text-gray-300 text-sm">Keep a personal collection of your most effective prompts</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <div className="space-x-4">
            <Link 
              href="/my-account" 
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded border border-gray-500 transition-colors"
            >
              Back to My Account
            </Link>
            <Link 
              href="/products/ai-tools-mastery-guide" 
              className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded border border-gray-400 transition-colors"
            >
              View AI Tools Guide
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}