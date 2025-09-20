'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import Slick slider with no SSR to avoid hydration issues
const Slider = dynamic(() => import('react-slick').then(mod => mod.default), { ssr: false });

// Import CSS for slick carousel
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Custom CSS for the slider
const sliderStyles = `
  .pricing-slider-container .slick-slide {
    padding: 10px;
    opacity: 0.7;
    transition: all 0.3s ease;
  }
  
  .pricing-slider-container .slick-center .slick-slide {
    opacity: 1;
  }
  
  .pricing-slider-container .slick-dots {
    bottom: -30px;
  }
  
  .pricing-slider-container .slick-dots li button:before {
    color: #6b7280;
    font-size: 10px;
  }
  
  .pricing-slider-container .slick-dots li.slick-active button:before {
    color: #8b5cf6;
    font-size: 12px;
  }
  
  .pricing-slider-container .slick-track {
    display: flex;
    align-items: stretch;
    padding-bottom: 20px;
  }
  
  .pricing-slider-container .slick-slide > div {
    height: 100%;
  }
  
  .pricing-slider-container .slick-prev,
  .pricing-slider-container .slick-next {
    z-index: 10;
  }
  
  .pricing-slider-container .slick-prev {
    left: 5px;
  }
  
  .pricing-slider-container .slick-next {
    right: 5px;
  }
  
  .pricing-slider-container .slick-prev:before,
  .pricing-slider-container .slick-next:before {
    color: #8b5cf6;
    opacity: 0.8;
  }
`;

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [isMobile, setIsMobile] = useState(false);

  const plans = {
    vaiToolkit: {
      name: 'VAI Toolkit All-in-One',
      description: 'Complete VAI masterclass, coaching, and prompts bundle',
      price: { monthly: 197, yearly: 197 },
      originalPrice: { monthly: 497, yearly: 497 },
      badge: 'ULTIMATE',
      popular: true,
      features: [
        'Complete VAI Masterclass',
        'Professional VAI Coaching',
        '30+ AI Prompts Arsenal',
        'AI Tools Mastery Guide',
        'Strategic AI Planning',
        'Hands-On AI Tools Mastery',
        'Executive Coaching & Community',
        'Weekly group coaching calls',
        'Private community access'
      ],
      cta: 'Get Toolkit Now',
      link: '/products/vai-toolkit-all-in-one'
    },
    blueprint: {
      name: 'AI Business Blueprint 2025',
      description: 'Complete AI business launch system',
      price: { monthly: 97, yearly: 97 },
      originalPrice: { monthly: 297, yearly: 297 },
      badge: 'FLAGSHIP',
      popular: false,
      features: [
        '1-Hour Business Launch System',
        'Step-by-step AI workflow framework',
        'Empire building strategies',
        'AI automation systems',
        '50+ AI prompt templates',
        'Landing page templates',
        'Email sequence templates',
        'Video training modules',
        'Private community access',
        'Weekly group coaching calls'
      ],
      cta: 'Get Blueprint Now',
      link: '/products/ai-business-blueprint-2025'
    },
    support: {
      name: 'Weekly Support Contract',
      description: 'Ongoing support and guidance for your business',
      price: { monthly: 197, yearly: 1970 },
      originalPrice: { monthly: 297, yearly: 2970 },
      badge: 'PREMIUM',
      popular: false,
      features: [
        'Weekly 1-on-1 strategy calls',
        'Personalized business guidance',
        'Priority email support',
        'Custom AI prompt creation',
        'Business optimization reviews',
        'Growth roadmap creation',
        'Follow-up email summary'
      ],
      cta: 'Get Support',
      link: '/products/weekly-support-contract'
    },
    enterprise: {
      name: 'Enterprise Solutions',
      description: 'Custom AI solutions for large organizations',
      price: { monthly: 'Custom', yearly: 'Custom' },
      originalPrice: { monthly: null, yearly: null },
      badge: 'ENTERPRISE',
      popular: false,
      features: [
        'Custom AI solution development',
        'Dedicated development team',
        'Full-stack implementation',
        'Advanced AI integrations',
        'Custom training & onboarding',
        'Ongoing maintenance & updates',
        'Priority technical support',
        'White-label solutions',
        'Enterprise-grade security'
      ],
      cta: 'Get Quote',
      link: '/contact'
    }
  };

  const addOns = [
    {
      name: 'AI Jumpstart Pack',
      description: 'Premium fixed-price package for rapid AI implementation',
      price: 350,
      originalPrice: null,
      features: [
        '2-hour strategy session',
        '1 quick-win automation built in 30 days',
        'Custom implementation roadmap',
        'Priority support during build',
        'Follow-up optimization call'
      ]
    },
    {
      name: 'AI Tools Mastery Guide',
      description: 'Complete guide to mastering AI tools for business',
      price: 47,
      originalPrice: 97,
      features: [
        'ChatGPT advanced techniques',
        'Claude optimization strategies',
        'Midjourney business applications',
        'AI tool comparison matrix',
        'Workflow automation guides'
      ]
    },
    {
      name: 'AI Prompts Arsenal',
      description: '500+ proven AI prompts for every business need',
      price: 67,
      originalPrice: 147,
      features: [
        'Marketing & sales prompts',
        'Content creation prompts',
        'Product development prompts',
        'Customer service prompts',
        'Business strategy prompts'
      ]
    },
    {
      name: 'VAI Implementation Package',
      description: 'Done-for-you AI implementation service',
      price: 997,
      originalPrice: 1997,
      features: [
        'Custom AI workflow setup',
        'System integration',
        'Staff training',
        'Process documentation',
        '30-day support'
      ]
    }
  ];

  // Slider settings for mobile carousel
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    centerMode: true,
    adaptiveHeight: false,
    className: "center",
    centerPadding: "30px",
    swipeToSlide: true,
    touchThreshold: 5, // More sensitive touch
    autoplay: false,
    cssEase: "ease-out",
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: "20px",
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: "20px",
        }
      }
    ]
  };

  // Effect to check window size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint in Tailwind
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-800 text-white">
      {/* Add custom styles */}
      <style dangerouslySetInnerHTML={{__html: sliderStyles}} />
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 glow-text">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              Choose Your Path
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Select the perfect plan to accelerate your AI-powered business journey
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              <span
                className={`${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </button>
            <span className={`text-sm ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-400'}`}>Yearly <span className="text-purple-400 font-medium">Save 15%</span></span>
          </div>
        </div>
        
        {/* Pricing Plans */}
        {isMobile ? (
          // Mobile view - Slider
          <div className="pricing-slider-container mb-16">
            <Slider {...sliderSettings}>
              {Object.entries(plans).map(([key, plan], index) => {
                // Define color schemes for different plans
                const colorSchemes = {
                  0: {
                    badge: 'bg-gradient-to-r from-emerald-400/20 to-emerald-600/20 text-emerald-400',
                    border: 'border-emerald-500/20',
                    popularBorder: 'border-emerald-500/40 shadow-lg shadow-emerald-500/10',
                    button: 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white'
                  },
                  1: {
                    badge: 'bg-gradient-to-r from-blue-400/20 to-blue-600/20 text-blue-400',
                    border: 'border-blue-500/20',
                    popularBorder: 'border-blue-500/40 shadow-lg shadow-blue-500/10',
                    button: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white'
                  },
                  2: {
                    badge: 'bg-gradient-to-r from-purple-400/20 to-purple-600/20 text-purple-400',
                    border: 'border-purple-500/20',
                    popularBorder: 'border-purple-500/40 shadow-lg shadow-purple-500/10',
                    button: 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white'
                  },
                  3: {
                    badge: 'bg-gradient-to-r from-pink-400/20 to-pink-600/20 text-pink-400',
                    border: 'border-pink-500/20',
                    popularBorder: 'border-pink-500/40 shadow-lg shadow-pink-500/10',
                    button: 'bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white'
                  }
                };
                const colors = colorSchemes[index as keyof typeof colorSchemes] || colorSchemes[0];
                
                return (
                  <div
                    key={key}
                    className={`relative glass-panel rounded-2xl p-8 border transition-all duration-300 hover:scale-105 ${
                      plan.popular
                        ? colors.popularBorder
                        : colors.border
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-0 right-0 flex justify-center">
                        <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                          MOST POPULAR
                        </span>
                      </div>
                    )}
                    
                    <div className="text-center mb-8">
                      <div className={`inline-flex items-center px-3 py-1 ${colors.badge} rounded-full text-sm font-semibold mb-4`}>
                        {plan.badge}
                      </div>
                      <h3 className="text-2xl font-bold mb-2">
                        {key === 'vaiToolkit' ? (
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 hover:from-emerald-300 hover:via-green-300 hover:to-teal-300 transition-all duration-500">
                            {plan.name}
                          </span>
                        ) : (
                          <span className="text-white">{plan.name}</span>
                        )}
                      </h3>
                      <p className="text-gray-300 mb-6">{plan.description}</p>
                      
                      <div className="mb-6">
                        {typeof plan.price[billingCycle as keyof typeof plan.price] === 'string' ? (
                          <div className="text-4xl font-bold text-white">
                            {plan.price[billingCycle as keyof typeof plan.price]}
                          </div>
                        ) : (
                          <div>
                            <div className="text-4xl font-bold text-white">
                              ${plan.price[billingCycle as keyof typeof plan.price]}
                              {billingCycle === 'monthly' && <span className="text-lg text-gray-400">/mo</span>}
                              {billingCycle === 'yearly' && <span className="text-lg text-gray-400">/year</span>}
                            </div>
                            {plan.originalPrice[billingCycle as keyof typeof plan.originalPrice] && (
                              <div className="text-lg text-gray-400 line-through">
                                ${plan.originalPrice[billingCycle as keyof typeof plan.originalPrice]}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => {
                        const checkColors = {
                          0: 'text-emerald-400',  // First plan
                          1: 'text-blue-400',    // Second plan
                          2: 'text-purple-400'   // Third plan
                        };
                        const checkColor = checkColors[index as keyof typeof checkColors] || 'text-gray-400';
                        
                        return (
                          <li key={featureIndex} className="flex items-start space-x-3">
                            <svg className={`w-5 h-5 ${checkColor} mt-0.5 flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-300">{feature}</span>
                          </li>
                        );
                      })}
                    </ul>
                    
                    <div className="text-center">
                      <Link
                        href={plan.link}
                        className={`inline-flex items-center justify-center w-full px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${colors.button}`}
                      >
                        {plan.cta}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </Slider>
          </div>
        ) : (
          // Desktop view - Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {Object.entries(plans).map(([key, plan], index) => {
              // Define color schemes for different plans
              const colorSchemes = {
                0: {
                  badge: 'bg-gradient-to-r from-emerald-400/20 to-emerald-600/20 text-emerald-400',
                  border: 'border-emerald-500/20',
                  popularBorder: 'border-emerald-500/40 shadow-lg shadow-emerald-500/10',
                  button: 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white'
                },
                1: {
                  badge: 'bg-gradient-to-r from-blue-400/20 to-blue-600/20 text-blue-400',
                  border: 'border-blue-500/20',
                  popularBorder: 'border-blue-500/40 shadow-lg shadow-blue-500/10',
                  button: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white'
                },
                2: {
                  badge: 'bg-gradient-to-r from-purple-400/20 to-purple-600/20 text-purple-400',
                  border: 'border-purple-500/20',
                  popularBorder: 'border-purple-500/40 shadow-lg shadow-purple-500/10',
                  button: 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white'
                },
                3: {
                  badge: 'bg-gradient-to-r from-pink-400/20 to-pink-600/20 text-pink-400',
                  border: 'border-pink-500/20',
                  popularBorder: 'border-pink-500/40 shadow-lg shadow-pink-500/10',
                  button: 'bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white'
                }
              };
              const colors = colorSchemes[index as keyof typeof colorSchemes] || colorSchemes[0];
              
              return (
                <div
                  key={key}
                  className={`relative glass-panel rounded-2xl p-8 border transition-all duration-300 hover:scale-105 ${
                    plan.popular
                      ? colors.popularBorder
                      : colors.border
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-0 right-0 flex justify-center">
                      <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <div className={`inline-flex items-center px-3 py-1 ${colors.badge} rounded-full text-sm font-semibold mb-4`}>
                      {plan.badge}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">
                      {key === 'vaiToolkit' ? (
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 hover:from-emerald-300 hover:via-green-300 hover:to-teal-300 transition-all duration-500">
                          {plan.name}
                        </span>
                      ) : (
                        <span className="text-white">{plan.name}</span>
                      )}
                    </h3>
                    <p className="text-gray-300 mb-6">{plan.description}</p>
                    
                    <div className="mb-6">
                      {typeof plan.price[billingCycle as keyof typeof plan.price] === 'string' ? (
                        <div className="text-4xl font-bold text-white">
                          {plan.price[billingCycle as keyof typeof plan.price]}
                        </div>
                      ) : (
                        <div>
                          <div className="text-4xl font-bold text-white">
                            ${plan.price[billingCycle as keyof typeof plan.price]}
                            {billingCycle === 'monthly' && <span className="text-lg text-gray-400">/mo</span>}
                            {billingCycle === 'yearly' && <span className="text-lg text-gray-400">/year</span>}
                          </div>
                          {plan.originalPrice[billingCycle as keyof typeof plan.originalPrice] && (
                            <div className="text-lg text-gray-400 line-through">
                              ${plan.originalPrice[billingCycle as keyof typeof plan.originalPrice]}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => {
                      const checkColors = {
                        0: 'text-emerald-400',  // First plan
                        1: 'text-blue-400',    // Second plan
                        2: 'text-purple-400'   // Third plan
                      };
                      const checkColor = checkColors[index as keyof typeof checkColors] || 'text-gray-400';
                      
                      return (
                        <li key={featureIndex} className="flex items-start space-x-3">
                          <svg className={`w-5 h-5 ${checkColor} mt-0.5 flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      );
                    })}
                  </ul>
                  
                  <div className="text-center">
                    <Link
                      href={plan.link}
                      className={`inline-flex items-center justify-center w-full px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${colors.button}`}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Add-ons Section */}
        <div className="mt-24 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              Enhance Your Experience
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {addOns.map((addon, index) => {
              const addonColors = {
                0: {
                  border: 'border-emerald-500/20 hover:border-emerald-400/40',
                  button: 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white'
                },
                1: {
                  border: 'border-blue-500/20 hover:border-blue-400/40',
                  button: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white'
                },
                2: {
                  border: 'border-purple-500/20 hover:border-purple-400/40',
                  button: 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white'
                },
                3: {
                  border: 'border-pink-500/20 hover:border-pink-400/40',
                  button: 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-purple-600/20 hover:to-pink-600/20 border border-purple-500/20 hover:border-purple-400/40 text-white hover:text-purple-300'
                }
              };
              const colors = addonColors[index as keyof typeof addonColors] || addonColors[0];
              
              return (
                <div key={index} className={`glass-panel rounded-xl p-6 border ${colors.border} transition-all duration-300`}>
                  <h3 className="text-xl font-bold text-white mb-2">{addon.name}</h3>
                  <p className="text-gray-300 mb-4">{addon.description}</p>
                  
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-white">
                      ${addon.price}
                    </div>
                    {addon.originalPrice && (
                      <div className="text-sm text-gray-400 line-through">
                        ${addon.originalPrice}
                      </div>
                    )}
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    {addon.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-2 text-sm">
                        <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link
                    href="/products"
                    className={`inline-flex items-center justify-center w-full px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${colors.button}`}
                  >
                    Add to Your Plan
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="mt-24 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              Frequently Asked Questions
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-panel rounded-xl p-6 border border-blue-500/20 hover:border-blue-400/30 transition-all duration-300">
              <h3 className="text-xl font-bold mb-3">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                  What's included in the VAI Toolkit?
                </span>
              </h3>
              <p className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                The VAI Toolkit includes our complete masterclass, professional coaching sessions, 30+ AI prompts arsenal, AI tools mastery guide, strategic planning resources, and access to our exclusive community and weekly group coaching calls.
              </p>
            </div>
            
            <div className="glass-panel rounded-xl p-6 border border-purple-500/20 hover:border-purple-400/30 transition-all duration-300">
              <h3 className="text-xl font-bold text-white mb-3">Can I upgrade my plan later?</h3>
              <p className="text-gray-300">
                Absolutely! You can upgrade your plan at any time. We'll prorate the cost based on the remaining time in your current subscription period, ensuring a seamless transition to your new plan.
              </p>
            </div>
            
            <div className="glass-panel rounded-xl p-6 border border-pink-500/20 hover:border-pink-400/30 transition-all duration-300">
              <h3 className="text-xl font-bold text-white mb-3">Do you offer refunds?</h3>
              <p className="text-gray-300">
                Yes, we offer a 14-day money-back guarantee on all our digital products. If you're not completely satisfied with your purchase, simply contact our support team within 14 days for a full refund.
              </p>
            </div>
            
            <div className="glass-panel rounded-xl p-6 border border-blue-500/20 hover:border-blue-400/30 transition-all duration-300">
              <h3 className="text-xl font-bold text-white mb-3">How do the coaching calls work?</h3>
              <p className="text-gray-300">
                Coaching calls are conducted via Zoom. Weekly group coaching calls are included in most plans, while 1-on-1 coaching sessions are available in our premium plans. You'll receive calendar invites and reminders for all scheduled calls.
              </p>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="mt-24">
          <div className="glass-panel rounded-2xl p-8 md:p-12 border border-purple-500/30 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                  Need a Custom Solution?
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Our team of AI experts can create a tailored solution for your specific business needs. Let's discuss how we can help you leverage AI to achieve your goals.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-lg transition-all duration-300"
              >
                Talk to an Expert
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;