'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CoachingCalendar from '@/components/CoachingCalendar';
import { toast } from 'react-hot-toast';

export default function VAIBeginnersMasteryPage() {
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
      router.push('/signin?callbackUrl=/coaching/vai-beginners-mastery');
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
            setHasAccess(ownedProducts.includes('vai-beginners-mastery'));
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
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">VAI Beginners Mastery</h1>
              <div className="w-16 h-0.5 bg-gray-600 mx-auto mb-6"></div>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Professional AI coaching for foundational skill development.
              </p>
            </div>
            
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
              <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4 border border-gray-600">
                <div className="w-6 h-6 border-2 border-gray-300 rounded-full relative">
                  <div className="absolute top-1.5 left-1.5 w-1 h-1 bg-gray-300 rounded-full"></div>
                </div>
              </div>
              <p className="text-gray-300 font-semibold mb-2">Access Required</p>
              <p className="text-gray-400 text-sm leading-relaxed">Premium coaching session access required for booking consultation</p>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Link 
                href="/vai-coaching" 
                className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 border border-gray-700"
              >
                Purchase Coaching
              </Link>
              <Link 
                href="/my-account" 
                className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 border border-gray-600"
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
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-white mb-4">VAI Beginners Mastery</h1>
            <div className="w-20 h-0.5 bg-gray-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-400 mb-8 leading-relaxed max-w-3xl mx-auto">
              Schedule your personalized 1-on-1 AI coaching session to master the fundamentals
            </p>
          </div>

          {/* Learning Objectives */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4 border border-gray-700">
                <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">AI Tools Fundamentals</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Master ChatGPT, Claude, and other essential AI tools
              </p>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4 border border-gray-700">
                <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Practical Workflows</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Learn proven workflows for real-world applications
              </p>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4 border border-gray-700">
                <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Personalized Strategy</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Get a custom AI implementation plan for your goals
              </p>
            </div>
          </div>

          {/* Session Details */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4 border border-gray-700">
                <div className="w-4 h-4 bg-gray-600 rounded"></div>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Duration</h4>
              <p className="text-gray-400">60 minutes</p>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4 border border-gray-700">
                <div className="w-4 h-4 bg-gray-600 rounded"></div>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Format</h4>
              <p className="text-gray-400">Google Meet</p>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4 border border-gray-700">
                <div className="w-4 h-4 bg-gray-600 rounded"></div>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Follow-up</h4>
              <p className="text-gray-400">Resources & Action Plan</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Session Details */}
          <div className="bg-gradient-to-br from-slate-900/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/30">
            <h2 className="text-3xl font-bold text-white mb-8">Learning Objectives</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4 group hover:bg-slate-800/30 p-4 rounded-xl transition-all duration-300">
                <div className="bg-gradient-to-br from-slate-600 to-gray-700 text-white rounded-lg w-10 h-10 flex items-center justify-center text-sm font-bold border border-slate-500/30">1</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">AI Platform Mastery</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Master ChatGPT, Claude, and essential AI platforms for professional productivity</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group hover:bg-slate-800/30 p-4 rounded-xl transition-all duration-300">
                <div className="bg-gradient-to-br from-slate-600 to-gray-700 text-white rounded-lg w-10 h-10 flex items-center justify-center text-sm font-bold border border-slate-500/30">2</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Workflow Optimization</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Implement proven AI workflows to accelerate daily professional tasks</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group hover:bg-slate-800/30 p-4 rounded-xl transition-all duration-300">
                <div className="bg-gradient-to-br from-slate-600 to-gray-700 text-white rounded-lg w-10 h-10 flex items-center justify-center text-sm font-bold border border-slate-500/30">3</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Strategic Implementation</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Develop a personalized AI adoption roadmap aligned with your career objectives</p>
                </div>
              </div>
            </div>

            {/* Session Info */}
            <div className="mt-10 grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-gradient-to-br from-slate-700 to-gray-800 text-white rounded-xl w-16 h-16 flex items-center justify-center mx-auto mb-4 border border-slate-600/30">
                  <div className="w-6 h-6 border-2 border-gray-300 rounded-full relative">
                    <div className="absolute top-1 left-2 w-0.5 h-2 bg-gray-300 rounded-full"></div>
                    <div className="absolute top-1 left-3 w-0.5 h-1.5 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
                <h3 className="text-white font-semibold mb-2">Duration</h3>
                <p className="text-gray-400">60 minutes</p>
              </div>
              
              <div className="text-center">
                <div className="bg-gradient-to-br from-slate-700 to-gray-800 text-white rounded-xl w-16 h-16 flex items-center justify-center mx-auto mb-4 border border-slate-600/30">
                  <div className="w-6 h-4 bg-gray-300 rounded-sm relative">
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
                    <div className="absolute top-2 left-0.5 right-0.5 h-0.5 bg-gray-300 rounded-full"></div>
                    <div className="absolute top-3 left-0.5 right-0.5 h-0.5 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
                <h3 className="text-white font-semibold mb-2">Follow-up</h3>
                <p className="text-gray-400">Action plan</p>
              </div>
            </div>
          </div>

          {/* Booking Calendar */}
          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4 border border-gray-700">
                <div className="w-8 h-8 bg-gray-600 rounded"></div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Schedule Your Coaching Session</h2>
              <p className="text-gray-400 leading-relaxed">
                Select your preferred date and time for your personalized AI coaching session
              </p>
            </div>
            
            <CoachingCalendar 
              onBookingComplete={handleBookingComplete}
            />
          </div>
        </div>

        {/* Session Preparation */}
        <div className="mt-16 bg-gray-900 rounded-lg p-8 border border-gray-800">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4 border border-gray-700">
              <div className="w-8 h-8 bg-gray-600 rounded"></div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Session Preparation</h2>
            <p className="text-gray-400 leading-relaxed">
              Get the most out of your coaching session with these preparation steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4 border border-gray-600">
                <div className="w-6 h-6 bg-gray-500 rounded"></div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Define Goals</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Write down 2-3 specific AI goals you want to achieve
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4 border border-gray-600">
                <div className="w-6 h-6 bg-gray-500 rounded"></div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Business Context</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Prepare details about your industry and current challenges
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4 border border-gray-600">
                <div className="w-6 h-6 bg-gray-500 rounded"></div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Questions Ready</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                List specific questions about AI tools and workflows
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4 border border-gray-600">
                <div className="w-6 h-6 bg-gray-500 rounded"></div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Tech Setup</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Ensure stable internet and Google Meet access
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}