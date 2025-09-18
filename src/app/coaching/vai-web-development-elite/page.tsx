'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CoachingCalendar from '@/components/CoachingCalendar';
import { toast } from 'react-hot-toast';

export default function VAIWebDevelopmentElitePage() {
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
      router.push('/signin?callbackUrl=/coaching/vai-web-development-elite');
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
            setHasAccess(ownedProducts.includes('vai-web-development-elite'));
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
    toast.success('🔥 Booking request submitted successfully!');
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
            <div className="w-20 h-20 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-6 border border-gray-700">
              <div className="w-10 h-10 bg-gray-600 rounded"></div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">VAI Web Development Elite Coaching</h1>
            <p className="text-gray-300 mb-8">
              Master AI-powered web development with expert guidance and personalized coaching.
            </p>
            
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
              <p className="text-gray-300 text-sm mb-2">Access Required</p>
              <p className="text-gray-400 text-sm">You need to purchase this coaching session to access booking</p>
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
            VAI Web Development Elite
          </h1>
          <div className="w-24 h-1 bg-gray-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Elite technical coaching for developers seeking mastery in AI-powered web development
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Session Details */}
          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
            <h2 className="text-3xl font-bold text-white mb-8">Technical Mastery Focus</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4 group hover:bg-gray-800 p-4 rounded-lg transition-all duration-300">
                <div className="bg-gray-800 text-white rounded-lg w-10 h-10 flex items-center justify-center text-sm font-bold border border-gray-700">1</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">AI-Powered Development</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">Master advanced AI coding assistants and automated development workflows</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group hover:bg-gray-800 p-4 rounded-lg transition-all duration-300">
                <div className="bg-gray-800 text-white rounded-lg w-10 h-10 flex items-center justify-center text-sm font-bold border border-gray-700">2</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Enterprise Deployment</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">Implement scalable cloud infrastructure and CI/CD pipelines</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group hover:bg-gray-800 p-4 rounded-lg transition-all duration-300">
                <div className="bg-gray-800 text-white rounded-lg w-10 h-10 flex items-center justify-center text-sm font-bold border border-gray-700">3</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Full-Stack Architecture</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">Design and build production-ready applications with modern frameworks</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group hover:bg-gray-800 p-4 rounded-lg transition-all duration-300">
                <div className="bg-gray-800 text-white rounded-lg w-10 h-10 flex items-center justify-center text-sm font-bold border border-gray-700">4</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Performance Engineering</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">Optimize applications for enterprise-scale performance and reliability</p>
                </div>
              </div>
            </div>

            {/* Session Info */}
            <div className="mt-10 grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-gray-800 text-white rounded-lg w-16 h-16 flex items-center justify-center mx-auto mb-4 border border-gray-700">
                  <div className="w-6 h-6 border-2 border-gray-400 rounded-full relative">
                    <div className="absolute top-1 left-2 w-0.5 h-2 bg-gray-400 rounded-full"></div>
                    <div className="absolute top-1 left-3 w-0.5 h-1.5 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
                <h3 className="text-white font-semibold mb-2">Duration</h3>
                <p className="text-gray-300">60 minutes</p>
              </div>
              
              <div className="text-center">
                <div className="bg-gray-800 text-white rounded-lg w-16 h-16 flex items-center justify-center mx-auto mb-4 border border-gray-700">
                  <div className="w-6 h-4 bg-gray-400 rounded-sm relative">
                    <div className="absolute top-0.5 left-0.5 right-0.5 h-0.5 bg-gray-700 rounded-full"></div>
                    <div className="absolute top-1.5 left-0.5 right-0.5 h-0.5 bg-gray-700 rounded-full"></div>
                    <div className="absolute top-2.5 left-0.5 right-0.5 h-0.5 bg-gray-700 rounded-full"></div>
                  </div>
                </div>
                <h3 className="text-white font-semibold mb-2">Format</h3>
                <p className="text-gray-400">Google Meet</p>
              </div>
              
              <div className="text-center">
                <div className="bg-gradient-to-br from-slate-700 to-gray-800 text-white rounded-xl w-16 h-16 flex items-center justify-center mx-auto mb-4 border border-slate-600/30">
                  <div className="w-6 h-6 relative">
                    <div className="absolute inset-0 border-2 border-gray-300 rounded-sm"></div>
                    <div className="absolute top-1 left-1 w-1 h-1 bg-gray-300 rounded-full"></div>
                    <div className="absolute top-1 right-1 w-1 h-1 bg-gray-300 rounded-full"></div>
                    <div className="absolute bottom-1 left-1 right-1 h-0.5 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
                <h3 className="text-white font-semibold mb-2">Hands-on</h3>
                <p className="text-gray-400">Live coding</p>
              </div>
            </div>
          </div>

          {/* Booking Calendar */}
          <CoachingCalendar 
            onBookingComplete={handleBookingComplete}
          />
        </div>

        {/* Session Preparation */}
        <div className="mt-16 bg-gradient-to-br from-slate-900/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/30">
          <h2 className="text-3xl font-bold text-white mb-8">Session Preparation</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4 group hover:bg-slate-800/30 p-4 rounded-xl transition-all duration-300">
                <div className="bg-gradient-to-br from-slate-600 to-gray-700 text-white rounded-lg w-10 h-10 flex items-center justify-center text-sm font-bold border border-slate-500/30">1</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Development Environment</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Prepare your IDE, terminal, and development tools for hands-on coding</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group hover:bg-slate-800/30 p-4 rounded-xl transition-all duration-300">
                <div className="bg-gradient-to-br from-slate-600 to-gray-700 text-white rounded-lg w-10 h-10 flex items-center justify-center text-sm font-bold border border-slate-500/30">2</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Project Objectives</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Define specific applications or features you want to develop</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group hover:bg-slate-800/30 p-4 rounded-xl transition-all duration-300">
                <div className="bg-gradient-to-br from-slate-600 to-gray-700 text-white rounded-lg w-10 h-10 flex items-center justify-center text-sm font-bold border border-slate-500/30">3</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Screen Sharing Setup</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Ensure reliable screen sharing capabilities for collaborative development</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-4 group hover:bg-slate-800/30 p-4 rounded-xl transition-all duration-300">
                <div className="bg-gradient-to-br from-slate-600 to-gray-700 text-white rounded-lg w-10 h-10 flex items-center justify-center text-sm font-bold border border-slate-500/30">4</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Technical Challenges</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Document specific development obstacles requiring expert guidance</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group hover:bg-slate-800/30 p-4 rounded-xl transition-all duration-300">
                <div className="bg-gradient-to-br from-slate-600 to-gray-700 text-white rounded-lg w-10 h-10 flex items-center justify-center text-sm font-bold border border-slate-500/30">5</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Technology Stack</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Review your current frameworks and identify learning priorities</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group hover:bg-slate-800/30 p-4 rounded-xl transition-all duration-300">
                <div className="bg-gradient-to-br from-slate-600 to-gray-700 text-white rounded-lg w-10 h-10 flex items-center justify-center text-sm font-bold border border-slate-500/30">6</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Deployment Strategy</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Plan your production deployment and infrastructure requirements</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}