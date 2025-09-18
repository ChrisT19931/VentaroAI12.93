'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CoachingCalendar from '@/components/CoachingCalendar';
import { toast } from 'react-hot-toast';

export default function AIBusinessStrategySessionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mockUser, setMockUser] = useState<{email: string, isAdmin: boolean} | null>(null);

  // Check URL for email parameter (for demo purposes)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    
    if (emailParam) {
      const isAdmin = emailParam === 'chris.t@ventarosales.com';
      setMockUser({
        email: emailParam,
        isAdmin
      });
    }
  }, []);

  // Get user from session or mock user
  const user = session?.user || mockUser || null;
  const isAuthenticated = status === 'authenticated' || !!mockUser;

  useEffect(() => {
    if (status === 'loading' && !mockUser) {
      return;
    }
    
    if (!isAuthenticated) {
      router.push('/signin?callbackUrl=/coaching/ai-business-strategy-session');
      return;
    }

    const checkAccess = async () => {
      try {
        // Check if user is admin
        const isAdmin = user?.email === 'chris.t@ventarosales.com' || (mockUser?.isAdmin === true);
        
        if (isAdmin) {
          setHasAccess(true);
        } else {
          // Check if user owns this coaching product
          const response = await fetch('/api/user/products');
          if (response.ok) {
            const data = await response.json();
            const ownedProducts = data.products || [];
            setHasAccess(ownedProducts.includes('ai-business-strategy-session'));
          } else {
            setHasAccess(false);
          }
        }
      } catch (error) {
        console.error('Error checking access:', error);
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [isAuthenticated, user, router, mockUser]);

  const handleBookingComplete = (bookingId: string) => {
    toast.success('Booking request submitted successfully!');
  };

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

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-950 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-gray-900 rounded-lg p-8 text-center border border-gray-800">
            <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center mb-6 mx-auto border border-gray-700">
              <div className="w-8 h-8 bg-gray-600 rounded"></div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">AI Business Strategy Session</h1>
            <p className="text-gray-300 mb-8">
              Get strategic AI implementation coaching for business growth and competitive advantage.
            </p>
            
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-gray-700 text-white rounded-lg w-8 h-8 flex items-center justify-center text-sm font-bold border border-gray-600">
                  <div className="w-3 h-3 border-2 border-gray-400 rounded-sm relative">
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
                <p className="text-gray-300 font-semibold">Access Required</p>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">You need to purchase this coaching session to access booking</p>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Link 
                href="/vai-coaching" 
                className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors border border-gray-700"
              >
                Purchase Coaching
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-6 border border-gray-700">
            <div className="w-10 h-10 bg-gray-600 rounded"></div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            AI Business Strategy Session
          </h1>
          <div className="w-24 h-1 bg-gray-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Elite strategic consultation for business leaders seeking competitive advantage through AI implementation
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Session Details */}
          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-8">Strategic Focus Areas</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4 group hover:bg-gray-800 p-4 rounded-lg transition-all duration-300">
                <div className="bg-gray-800 text-white rounded-lg w-10 h-10 flex items-center justify-center text-sm font-bold border border-gray-700">1</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">AI Implementation Strategy</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">Develop a comprehensive roadmap for integrating AI into your business operations</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group hover:bg-gray-800 p-4 rounded-lg transition-all duration-300">
                <div className="bg-gray-800 text-white rounded-lg w-10 h-10 flex items-center justify-center text-sm font-bold border border-gray-700">2</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Competitive Advantage</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">Identify strategic AI opportunities to outpace competitors and dominate your market</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group hover:bg-gray-800 p-4 rounded-lg transition-all duration-300">
                <div className="bg-gray-800 text-white rounded-lg w-10 h-10 flex items-center justify-center text-sm font-bold border border-gray-700">3</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Revenue Optimization</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">Leverage AI to maximize efficiency, reduce costs, and accelerate profitability</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group hover:bg-gray-800 p-4 rounded-lg transition-all duration-300">
                <div className="bg-gray-800 text-white rounded-lg w-10 h-10 flex items-center justify-center text-sm font-bold border border-gray-700">4</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Automation Workflows</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">Design intelligent AI-powered processes to scale operations seamlessly</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group hover:bg-gray-800 p-4 rounded-lg transition-all duration-300">
                <div className="bg-gray-800 text-white rounded-lg w-10 h-10 flex items-center justify-center text-sm font-bold border border-gray-700">5</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Risk Management</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">Navigate AI implementation challenges with proven risk mitigation strategies</p>
                </div>
              </div>
            </div>

            {/* Session Info */}
            <div className="mt-10 grid grid-cols-3 gap-6">
              <div className="text-center group">
                <div className="bg-gray-800 border border-gray-700 rounded-lg w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-300">
                  <div className="w-6 h-6 border-2 border-gray-400 rounded-full relative">
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-2 bg-gray-400 rounded-full"></div>
                    <div className="absolute top-1.5 left-1/2 transform -translate-x-1/2 w-1 h-0.5 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
                <h3 className="text-white font-semibold mb-2">Duration</h3>
                <p className="text-gray-400">90 minutes</p>
              </div>
              
              <div className="text-center group">
                <div className="bg-gradient-to-br from-slate-700 to-gray-800 border border-slate-600/30 rounded-xl w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-300">
                  <div className="w-6 h-4 border-2 border-gray-400 rounded-sm relative">
                    <div className="absolute inset-1 bg-gray-400/30 rounded-sm"></div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-0.5 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
                <h3 className="text-white font-semibold mb-2">Format</h3>
                <p className="text-gray-400">Video Call</p>
              </div>
              
              <div className="text-center group">
                <div className="bg-gradient-to-br from-slate-700 to-gray-800 border border-slate-600/30 rounded-xl w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-300">
                  <div className="w-5 h-6 bg-gradient-to-b from-gray-400 to-gray-500 rounded-sm relative">
                    <div className="absolute top-1 left-0.5 right-0.5 h-0.5 bg-gray-300 rounded-full"></div>
                    <div className="absolute top-2 left-0.5 right-0.5 h-0.5 bg-gray-300 rounded-full"></div>
                    <div className="absolute top-3 left-0.5 right-0.5 h-0.5 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
                <h3 className="text-white font-semibold mb-2">Deliverable</h3>
                <p className="text-gray-400">Strategy Report</p>
              </div>
            </div>
          </div>

          {/* Booking Calendar */}
          <CoachingCalendar 
            onBookingComplete={handleBookingComplete}
          />
        </div>

        {/* Preparation Tips */}
        <div className="mt-12 bg-gradient-to-br from-slate-900/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/30">
          <h2 className="text-2xl font-bold text-white mb-8">Session Preparation</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4 group hover:bg-slate-800/30 p-4 rounded-xl transition-all duration-300">
                <div className="bg-gradient-to-br from-slate-600 to-gray-700 text-white rounded-lg w-10 h-10 flex items-center justify-center text-sm font-bold border border-slate-500/30">1</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Business Overview</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Prepare a comprehensive overview of your business model, current operations, and strategic objectives</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group hover:bg-slate-800/30 p-4 rounded-xl transition-all duration-300">
                <div className="bg-gradient-to-br from-slate-600 to-gray-700 text-white rounded-lg w-10 h-10 flex items-center justify-center text-sm font-bold border border-slate-500/30">2</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Current Challenges</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Identify specific operational pain points and inefficiencies you want to address with AI</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group hover:bg-slate-800/30 p-4 rounded-xl transition-all duration-300">
                <div className="bg-gradient-to-br from-slate-600 to-gray-700 text-white rounded-lg w-10 h-10 flex items-center justify-center text-sm font-bold border border-slate-500/30">3</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Investment Parameters</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Define your AI implementation budget, timeline expectations, and ROI requirements</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-4 group hover:bg-slate-800/30 p-4 rounded-xl transition-all duration-300">
                <div className="bg-gradient-to-br from-slate-600 to-gray-700 text-white rounded-lg w-10 h-10 flex items-center justify-center text-sm font-bold border border-slate-500/30">4</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Success Metrics</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Define measurable KPIs and success criteria for your AI transformation initiatives</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group hover:bg-slate-800/30 p-4 rounded-xl transition-all duration-300">
                <div className="bg-gradient-to-br from-slate-600 to-gray-700 text-white rounded-lg w-10 h-10 flex items-center justify-center text-sm font-bold border border-slate-500/30">5</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Organizational Readiness</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Assess your team's technical capabilities and change management requirements</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group hover:bg-slate-800/30 p-4 rounded-xl transition-all duration-300">
                <div className="bg-gradient-to-br from-slate-600 to-gray-700 text-white rounded-lg w-10 h-10 flex items-center justify-center text-sm font-bold border border-slate-500/30">6</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Market Intelligence</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Research competitor AI adoption and industry transformation trends in your sector</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What You'll Receive */}
        <div className="mt-12 bg-gradient-to-br from-slate-900/90 to-gray-900/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-600/40">
          <h2 className="text-2xl font-bold text-white mb-8">Strategic Deliverables</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div className="flex items-start gap-4 group hover:bg-slate-800/20 p-3 rounded-lg transition-all duration-300">
                <div className="w-3 h-3 bg-gradient-to-br from-slate-400 to-gray-500 rounded-full mt-1 flex-shrink-0"></div>
                <span className="text-gray-200 leading-relaxed">Comprehensive AI implementation roadmap with phased deployment strategy</span>
              </div>
              <div className="flex items-start gap-4 group hover:bg-slate-800/20 p-3 rounded-lg transition-all duration-300">
                <div className="w-3 h-3 bg-gradient-to-br from-slate-400 to-gray-500 rounded-full mt-1 flex-shrink-0"></div>
                <span className="text-gray-200 leading-relaxed">Competitive intelligence analysis with market positioning opportunities</span>
              </div>
              <div className="flex items-start gap-4 group hover:bg-slate-800/20 p-3 rounded-lg transition-all duration-300">
                <div className="w-3 h-3 bg-gradient-to-br from-slate-400 to-gray-500 rounded-full mt-1 flex-shrink-0"></div>
                <span className="text-gray-200 leading-relaxed">ROI projections with detailed cost-benefit analysis and budget framework</span>
              </div>
            </div>
            <div className="space-y-5">
              <div className="flex items-start gap-4 group hover:bg-slate-800/20 p-3 rounded-lg transition-all duration-300">
                <div className="w-3 h-3 bg-gradient-to-br from-slate-400 to-gray-500 rounded-full mt-1 flex-shrink-0"></div>
                <span className="text-gray-200 leading-relaxed">Risk assessment matrix with proven mitigation strategies and contingency plans</span>
              </div>
              <div className="flex items-start gap-4 group hover:bg-slate-800/20 p-3 rounded-lg transition-all duration-300">
                <div className="w-3 h-3 bg-gradient-to-br from-slate-400 to-gray-500 rounded-full mt-1 flex-shrink-0"></div>
                <span className="text-gray-200 leading-relaxed">Prioritized action plan with 30-60-90 day implementation milestones</span>
              </div>
              <div className="flex items-start gap-4 group hover:bg-slate-800/20 p-3 rounded-lg transition-all duration-300">
                <div className="w-3 h-3 bg-gradient-to-br from-slate-400 to-gray-500 rounded-full mt-1 flex-shrink-0"></div>
                <span className="text-gray-200 leading-relaxed">Curated resource library with vendor recommendations and implementation guides</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}