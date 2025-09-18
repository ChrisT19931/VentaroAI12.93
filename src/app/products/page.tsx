'use client';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

import { supabase } from '@/lib/supabase';
import UnifiedCheckoutButton from '@/components/UnifiedCheckoutButton';
import { analytics } from '@/lib/analytics';

import dynamic from 'next/dynamic';

// Performance optimization: Use React.memo for components that don't need frequent re-renders
const MemoizedUnifiedCheckoutButton = React.memo(UnifiedCheckoutButton);

function getProducts() {
  // Fallback to mock data - Updated business model
  return [
    {
      id: 'ai-business-video-guide-2025',
      name: 'AI Web Creation Masterclass',
      description: '2 Hours from Zero to Live • Watch me create a complete platform from scratch, in real time. No Experience Needed • You just follow along. Keep Your Code Forever • Build it yourself, own it completely, change anything you want. No SaaS Lock-In • Unlike Shopify or Wix, you build and own your platform. AI-Powered Changes • Tell AI agents what to modify and watch your platform transform instantly.',
      price: 50.00,
      image_url: '/images/products/ai-business-video-guide.svg',
      category: 'video',
      is_active: true,
      featured: false,
      productType: 'digital',
      created_at: new Date().toISOString(),
      highlight: false,
      badge: 'PRE-ORDER',
      isPreOrder: true,
      comingSoon: true
    },
    {
      id: 'ai-for-beginners-support',
      name: 'AI for Beginners Support',
      description: '60-minute consultation + unlimited email support + complete AI beginner cheat sheet. Perfect for anyone starting their AI journey.',
      price: 300.00,
      recurring: false,
      image_url: '/images/products/ai-beginners-support.svg',
      category: 'support',
      is_active: true,
      featured: true,
      productType: 'digital',
      created_at: new Date().toISOString(),
      badge: 'BEGINNER FRIENDLY'
    },
    {
      id: 'ai-web-development-support',
      name: 'AI for Web Development Support',
      description: '60-minute consultation + unlimited email support + complete web development deployment cheat sheet. Master AI-powered web development.',
      price: 400.00,
      recurring: false,
      image_url: '/images/products/ai-web-dev-support.svg',
      category: 'support',
      is_active: true,
      featured: true,
      productType: 'digital',
      created_at: new Date().toISOString(),
      badge: 'DEVELOPER FOCUSED'
    },
    {
      id: 'ai-business-support',
      name: 'AI for Business Support',
      description: '60-minute consultation + unlimited email support + complete business AI strategy cheat sheet. Transform your business with AI.',
      price: 500.00,
      recurring: false,
      image_url: '/images/products/ai-business-support.svg',
      category: 'support',
      is_active: true,
      featured: false,
      productType: 'digital',
      created_at: new Date().toISOString(),
      badge: 'COMING SOON',
      comingSoon: true
    },
    {
      id: 'ai-prompts-arsenal-2025',
      name: '30x AI Prompts Arsenal',
      description: '30 proven AI prompts for building online businesses.',
      price: 10.00,
      image_url: '/images/products/ai-prompts.svg',
      category: 'prompts',
      is_active: true,
      featured: false,
      productType: 'digital',
      created_at: new Date().toISOString()
    },
    {
      id: 'ai-tools-mastery-guide-2025',
      name: 'AI Tools Mastery Guide',
      description: '30 detailed lessons on ChatGPT, Claude, Cursor, and more AI tools for business building.',
      price: 25.00,
      image_url: '/images/products/ai-tools-guide.svg',
      category: 'ebook',
      is_active: true,
      featured: false,

      productType: 'digital',
      created_at: new Date().toISOString()
    }
  ];
}

// Performance optimization: Memoize the ProductsPage component
const ProductsPage = React.memo(function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    services: [] as string[],
    timeline: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactFormSuccess, setContactFormSuccess] = useState(false);
  
  // Performance optimization: Use useCallback for the fetch function
  const fetchProducts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (!error && data && data.length > 0) {
        setProducts(data);
      } else {
        // Performance optimization: Use memoized mock products
        setProducts(getProducts());
      }
    } catch (e) {
      console.error('Error connecting to Supabase:', e);
      setProducts(getProducts());
    }
  }, []);
  
  useEffect(() => {
    fetchProducts();
    
    // Performance optimization: Add cleanup function
    return () => {
      // Cleanup any potential memory leaks
      setProducts([]);
    };
  }, [fetchProducts]);

  // Contact form handlers
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceToggle = (service: string) => {
    setContactForm(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);

    try {
      // Track form submission start
      analytics.trackFormSubmit('website_quote_request', {
        project_type: contactForm.projectType,
        services: contactForm.services,
        timeline: contactForm.timeline,
        has_phone: !!contactForm.phone,
        has_company: !!contactForm.company
      });

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          subject: `New Project Quote Request - ${contactForm.projectType}`,
          message: `Phone: ${contactForm.phone}\nCompany: ${contactForm.company}\nProject Type: ${contactForm.projectType}\nServices Needed: ${contactForm.services.join(', ')}\nTimeline: ${contactForm.timeline}\n\nProject Details: ${contactForm.message}`,
          recipient: 'chris.t@ventarosales.com'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Track successful lead generation for Google Ads
      analytics.track('lead_generated', {
        lead_type: 'website_quote',
        project_type: contactForm.projectType,
        services: contactForm.services,
        timeline: contactForm.timeline,
        source: 'products_page'
      });

      // Google Ads conversion tracking
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'conversion', {
          'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL', // Replace with actual conversion ID
          'value': 1.0,
          'currency': 'AUD'
        });
        
        window.gtag('event', 'generate_lead', {
          'currency': 'AUD',
          'value': 1.0
        });
      }

      toast.success('Quote request sent! We\'ll get back to you within 24 hours.');
      
      // Set success state
      setContactFormSuccess(true);
      
      // Reset form
      setContactForm({
        name: '',
        email: '',
        phone: '',
        company: '',
        projectType: '',
        services: [],
        timeline: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending quote request:', error);
      toast.error('Failed to send quote request. Please try again.');
      
      // Track form submission error
      analytics.track('form_submission_error', {
        form_type: 'website_quote',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = [
    'Website Design', 'E-commerce Store', 'SEO Optimization', 'Content Management',
    'Mobile Optimization', 'Performance Optimization', 'Security Setup', 'Analytics Integration',
    'Social Media Integration', 'Email Marketing Setup', 'Payment Processing', 'Custom Features'
  ];
  
  // Performance optimization: Minimal background effects
  const BackgroundEffects = useMemo(() => (
    <div className="absolute inset-0">
      <div className="absolute top-20 left-10 w-72 h-72 bg-gray-500/5 rounded-full blur-xl opacity-30"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-600/5 rounded-full blur-xl opacity-30"></div>
    </div>
  ), []);
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      {BackgroundEffects}
      
      <div className="container mx-auto px-6 py-20 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 drop-shadow-2xl">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500">Products</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Professional AI tools and resources to build your online business empire.
          </p>
        </div>



        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <style jsx>{`
            .glass-panel {
              background: rgba(15, 23, 42, 0.6);
              backdrop-filter: blur(8px);
              -webkit-backdrop-filter: blur(8px);
              box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
            }
            
            .premium-button-glow {
              position: relative;
            }
            
            .premium-button-glow:hover {
              box-shadow: 0 4px 20px rgba(147, 51, 234, 0.3);
            }
          `}</style>

          {/* 30x AI Prompts Arsenal */}
          {products.filter(p => p.id === 'ai-prompts-arsenal-2025').map((product) => (
            <div key={product.id} className="group relative bg-gradient-to-br from-slate-900/95 via-gray-800/30 to-gray-900/95 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-gray-500/20 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border-2 border-gray-500/40 hover:border-gray-400/60">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-gray-500/20 via-transparent to-gray-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="absolute top-4 left-4 z-20">
                <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transition-all duration-300">
                  STARTER
                </div>
              </div>
              
              <div className="h-32 bg-gradient-to-br from-slate-900 to-gray-900 relative overflow-hidden flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-slate-800 group-hover:to-gray-800 transition-all duration-500">
                <div className="relative transform group-hover:scale-110 transition-all duration-500">
                  <svg className="w-16 h-16 text-gray-400 opacity-60 group-hover:opacity-100 group-hover:text-gray-300 transition-all duration-500 group-hover:drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                  <div className="absolute inset-0 bg-gray-400/20 rounded-full blur-xl group-hover:bg-gray-400/40 transition-all duration-300"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:from-black/50 transition-all duration-500"></div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-black mb-3 text-white drop-shadow-lg">{product.name}</h3>
                <p className="text-gray-200 mb-4 text-sm leading-relaxed group-hover:text-white transition-colors duration-500">{product.description}</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className="text-xs text-gray-300">Revenue-generating prompts</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className="text-xs text-gray-300">Business-focused only</span>
                  </div>
                </div>
                
                <div className="text-center mb-4">
                  <div className="text-3xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-300 group-hover:to-gray-400 transition-all duration-500">A${product.price}</div>
                  <div className="text-xs text-gray-300">one-time</div>
                </div>
                <UnifiedCheckoutButton 
                  product={product}
                  className="w-full block text-center py-3 rounded-xl font-bold transition-all duration-500 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white text-sm transform group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-gray-500/30"
                  variant="direct"
                >
                  Get Prompts
                </UnifiedCheckoutButton>
              </div>
            </div>
          ))}

          {/* AI Tools Mastery Guide */}
          {products.filter(p => p.id === 'ai-tools-mastery-guide-2025').map((product) => (
            <div key={product.id} className="group relative bg-gradient-to-br from-slate-900/95 via-gray-800/30 to-gray-900/95 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-gray-500/20 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border-2 border-gray-500/40 hover:border-gray-400/60">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-gray-500/20 via-transparent to-gray-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="absolute top-4 left-4 z-20">
                <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transition-all duration-300">
                  EDUCATION
                </div>
              </div>
              
              <div className="h-32 bg-gradient-to-br from-slate-900 to-gray-900 relative overflow-hidden flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-slate-800 group-hover:to-gray-800 transition-all duration-500">
                <div className="relative transform group-hover:scale-110 transition-all duration-500">
                  <svg className="w-16 h-16 text-gray-400 opacity-60 group-hover:opacity-100 group-hover:text-gray-300 transition-all duration-500 group-hover:drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <div className="absolute inset-0 bg-gray-400/20 rounded-full blur-xl group-hover:bg-gray-400/40 transition-all duration-300"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:from-black/50 transition-all duration-500"></div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-black mb-3 text-white drop-shadow-lg">{product.name}</h3>
                <p className="text-gray-200 mb-4 text-sm leading-relaxed group-hover:text-white transition-colors duration-500">{product.description}</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className="text-xs text-gray-300">30 detailed lessons</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className="text-xs text-gray-300">Business applications</span>
                  </div>
                </div>
                
                <div className="text-center mb-4">
                  <div className="text-3xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-300 group-hover:to-gray-400 transition-all duration-500">A${product.price}</div>
                  <div className="text-xs text-gray-300">one-time</div>
                </div>
                <UnifiedCheckoutButton 
                  product={product}
                  className="w-full block text-center py-3 rounded-xl font-bold transition-all duration-500 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white text-sm transform group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-gray-500/30"
                  variant="direct"
                >
                  Get Ebook
                </UnifiedCheckoutButton>
              </div>
            </div>
          ))}

          {/* AI Web Creation Masterclass - Featured */}
          {products.filter(p => p.id === 'ai-business-video-guide-2025').map((product) => (
            <div key={product.id} className="md:col-span-2 lg:col-span-4">
              <Link href="/ai-masterclass" className="block">
              <div className="group relative bg-gradient-to-br from-slate-900/95 via-gray-800/40 to-gray-900/95 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-gray-500/20 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border-2 border-gray-500/40 hover:border-gray-400/60">
                {/* Enhanced glow effects */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-gray-500/20 via-transparent to-gray-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="absolute top-4 left-4 z-20">
                  <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transition-all duration-300">
                    PRE-ORDER
                  </div>
                </div>
                
                <div className="p-8 md:p-12">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl md:text-4xl font-black mb-4 text-white drop-shadow-lg">AI Business Launch Blueprint</h3>
                    <p className="text-gray-200 mb-6 text-lg leading-relaxed group-hover:text-white transition-colors duration-500">The complete system to build, launch, and scale your premium digital online business - with step-by-step video lessons, full reports, and all tools required.</p>
                    
                    {/* What You Get Section */}
                    <div className="bg-gray-800/40 rounded-2xl p-8 mb-8 border border-gray-500/30">
                      <h4 className="text-2xl font-bold text-white mb-6 text-center">Complete Business Blueprint</h4>
                      <div className="grid md:grid-cols-2 gap-6 text-left">
                        <ul className="space-y-4 text-gray-300">
                          <li className="flex items-start">
                            <svg className="w-6 h-6 text-gray-400 mr-4 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <div>
                              <strong className="text-gray-300">Step-by-Step Video Lessons</strong><br/>
                              <span className="text-sm">Complete business building process</span>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <svg className="w-6 h-6 text-gray-400 mr-4 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <div>
                              <strong className="text-gray-300">Full Reports & Resources</strong><br/>
                              <span className="text-sm">Comprehensive guides and templates</span>
                            </div>
                          </li>
                        </ul>
                        <ul className="space-y-4 text-gray-300">
                          <li className="flex items-start">
                            <svg className="w-6 h-6 text-gray-400 mr-4 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <div>
                              <strong className="text-gray-300">AI Tools & Techniques</strong><br/>
                              <span className="text-sm">All tools required for implementation</span>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <svg className="w-6 h-6 text-gray-400 mr-4 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <div>
                              <strong className="text-gray-300">Launch Strategy</strong><br/>
                              <span className="text-sm">From concept to cash flow in record time</span>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Value Proposition */}
                    <div className="bg-gradient-to-r from-gray-800/30 to-gray-700/30 rounded-2xl p-6 mb-10 border border-gray-500/30">
                      <h4 className="text-xl font-bold text-white mb-4 text-center">Why This Blueprint Works</h4>
                      <div className="space-y-2 text-center">
                        <div className="text-gray-300">Traditional business launch? <span className="font-bold text-gray-200">Months of work & thousands in costs</span></div>
                        <div className="text-gray-300">AI-powered approach? <span className="font-bold text-gray-200">Launch in days</span> • scale faster • lower costs</div>
                      </div>
                    </div>

                    <div className="text-center mb-6">
                      <div className="text-5xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-300 group-hover:to-gray-400 transition-all duration-500">Limited Time</div>
                      <div className="text-sm text-gray-300">Complete AI Business Blueprint</div>
                    </div>
                    
                    <button
                      className="premium-button-glow w-full bg-gradient-to-r from-gray-700 to-gray-800 text-white font-black py-6 px-12 rounded-2xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 shadow-2xl inline-block text-center text-lg"
                    >
                      🏆 Explore VAI Masterclass • Build Your Online Business
                    </button>
                    
                    <p className="text-sm text-gray-400 mt-4">💯 Latest VAI Masterclass • Complete Business Blueprint</p>
                  </div>
                </div>
              </div>
              </Link>
            </div>
          ))}

          {/* Support Packages - Removed coaching plans as they are already advertised elsewhere */}
        </div>

        {/* Quote Form Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-slate-900/80 rounded-3xl border border-slate-800 shadow-xl mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Request a Custom Quote</h2>
            <p className="text-gray-300 max-w-3xl mx-auto">Need a tailored solution for your business? Fill out the form below and we'll create a custom proposal based on your specific requirements.</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleContactSubmit} className="space-y-7">
              {/* Name and Email Row */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-200 font-medium mb-2 text-sm tracking-wide">
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    value={contactForm.name}
                    onChange={handleContactChange}
                    placeholder="John Smith"
                    className="w-full p-3.5 bg-slate-800/80 border border-slate-600 rounded-lg text-white focus:border-gray-500 focus:ring-1 focus:ring-gray-500/30 focus:outline-none transition-all duration-200 text-base"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-200 font-medium mb-2 text-sm tracking-wide">
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    name="email"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    placeholder="your.email@example.com"
                    className="w-full p-3.5 bg-slate-800/80 border border-slate-600 rounded-lg text-white focus:border-gray-500 focus:ring-1 focus:ring-gray-500/30 focus:outline-none transition-all duration-200 text-base"
                  />
                </div>
              </div>

              {/* Phone and Company Row */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-200 font-medium mb-2 text-sm tracking-wide">
                    Phone Number
                  </label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={contactForm.phone}
                    onChange={handleContactChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full p-3.5 bg-slate-800/80 border border-slate-600 rounded-lg text-white focus:border-gray-500 focus:ring-1 focus:ring-gray-500/30 focus:outline-none transition-all duration-200 text-base"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-200 font-medium mb-2 text-sm tracking-wide">
                    Company/Organization
                  </label>
                  <input 
                    type="text" 
                    name="company"
                    value={contactForm.company}
                    onChange={handleContactChange}
                    placeholder="Your Company Ltd."
                    className="w-full p-3.5 bg-slate-800/80 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 focus:outline-none transition-all duration-200 text-base"
                  />
                </div>
              </div>

              {/* Project Type and Timeline Row */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-200 font-medium mb-2 text-sm tracking-wide">
                    Project Type
                  </label>
                  <select 
                    name="projectType"
                    value={contactForm.projectType}
                    onChange={handleContactChange}
                    className="w-full p-3.5 bg-slate-800/80 border border-slate-600 rounded-lg text-white focus:border-gray-500 focus:ring-1 focus:ring-gray-500/30 focus:outline-none transition-all duration-200 text-base appearance-none">
                    <option value="">Select project type</option>
                    <option value="business-website">Professional Business Website</option>
                    <option value="e-commerce">E-commerce Platform</option>
                    <option value="portfolio">Portfolio/Personal</option>
                    <option value="blog">Blog/Content Site</option>
                    <option value="web-app">Web Application</option>
                    <option value="saas">SaaS Platform</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-200 font-medium mb-2 text-sm tracking-wide">
                    Project Timeline
                  </label>
                  <select 
                    name="timeline"
                    value={contactForm.timeline}
                    onChange={handleContactChange}
                    className="w-full p-3.5 bg-slate-800/80 border border-slate-600 rounded-lg text-white focus:border-gray-500 focus:ring-1 focus:ring-gray-500/30 focus:outline-none transition-all duration-200 text-base appearance-none">
                    <option value="">Select timeline</option>
                    <option value="asap">ASAP (Rush)</option>
                    <option value="1-2-weeks">1-2 weeks</option>
                    <option value="1-month">1 month</option>
                    <option value="2-3-months">2-3 months</option>
                    <option value="3-6-months">3-6 months</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
              </div>
              
              {/* Services Needed */}
              <div>
                <label className="block text-gray-200 font-medium mb-3 text-sm tracking-wide">
                  Services Needed <span className="text-gray-400">(Optional)</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {services.map((service) => (
                    <label key={service} className="group flex items-center space-x-3 p-3 bg-slate-800/60 rounded-lg border border-slate-700 hover:border-gray-500/40 hover:bg-slate-700/60 transition-all duration-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={contactForm.services.includes(service)}
                        onChange={() => handleServiceToggle(service)}
                        className="w-4 h-4 text-gray-500 bg-slate-700 border-slate-600 rounded focus:ring-gray-500/30 focus:ring-1"
                      />
                      <span className="text-gray-300 text-sm group-hover:text-white transition-colors">{service}</span>
                    </label>
                  ))}
                </div>
                <p className="text-gray-400 text-sm mt-2">Select any services you're interested in, or leave blank for a general quote</p>
              </div>
              
              {/* Project Description */}
              <div>
                <label className="block text-gray-200 font-medium mb-2 text-sm tracking-wide">
                  Project Details
                </label>
                <textarea 
                  name="message"
                  value={contactForm.message}
                  onChange={handleContactChange}
                  rows={4}
                  placeholder="Describe your project goals, target audience, and specific requirements..."
                  className="w-full p-3.5 bg-slate-800/80 border border-slate-600 rounded-lg text-white focus:border-gray-500 focus:ring-1 focus:ring-gray-500/30 focus:outline-none transition-all duration-200 text-base resize-vertical"
                />
              </div>
              
              {/* Submit Button */}
              <div className="text-center pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3.5 px-10 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-lg shadow-gray-900/20 hover:shadow-gray-800/30"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing Request...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Request Custom Quote
                      <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  )}
                </button>
                <p className="text-gray-400 text-sm mt-3">Professional consultation • 24-hour response • No obligation</p>
              </div>
            </form>
            
            {contactFormSuccess && (
              <div className="mt-8 p-6 bg-gray-800/30 border border-gray-500/30 rounded-xl text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Quote Request Received!</h3>
                <p className="text-gray-300">
                  Thank you for your interest! We'll review your project details and get back to you within 24 hours with a custom quote.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-16">
          <Link href="/" className="text-gray-400 hover:text-gray-300 transition-colors text-lg">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
});

export default ProductsPage;