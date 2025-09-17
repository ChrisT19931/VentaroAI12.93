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
    toast.success('🔥 Booking request submitted successfully!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-black py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-gray-900 rounded-lg p-8 text-center">
            <div className="text-6xl mb-6">🎯</div>
            <h1 className="text-3xl font-bold text-white mb-4">VAI Beginners Mastery Coaching</h1>
            <p className="text-gray-300 mb-8">
              Get personalized AI coaching to master the fundamentals and accelerate your learning.
            </p>
            
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-red-300 text-sm mb-2">🔒 Access Required</p>
              <p className="text-gray-300 text-sm">You need to purchase this coaching session to access booking</p>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Link 
                href="/vai-coaching" 
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Purchase Coaching
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-6">🎯</div>
          <h1 className="text-4xl font-bold text-white mb-4">VAI Beginners Mastery Coaching</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Schedule your personalized 1-on-1 AI coaching session to master the fundamentals
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Session Details */}
          <div className="bg-gray-900 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6">What You'll Learn</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <h3 className="text-white font-semibold">AI Tools Fundamentals</h3>
                  <p className="text-gray-300 text-sm">Master ChatGPT, Claude, and other essential AI tools</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <h3 className="text-white font-semibold">Practical Workflows</h3>
                  <p className="text-gray-300 text-sm">Learn proven workflows for everyday AI applications</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <h3 className="text-white font-semibold">Personalized Strategy</h3>
                  <p className="text-gray-300 text-sm">Get a custom AI implementation plan for your goals</p>
                </div>
              </div>
            </div>

            {/* Session Info */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl mx-auto mb-4">⏰</div>
                <h3 className="text-white font-semibold mb-2">Duration</h3>
                <p className="text-gray-300">60 minutes</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl mx-auto mb-4">💻</div>
                <h3 className="text-white font-semibold mb-2">Format</h3>
                <p className="text-gray-300">Google Meet</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl mx-auto mb-4">📋</div>
                <h3 className="text-white font-semibold mb-2">Follow-up</h3>
                <p className="text-gray-300">Action plan</p>
              </div>
            </div>
          </div>

          {/* Booking Calendar */}
          <CoachingCalendar 
            onBookingComplete={handleBookingComplete}
          />
        </div>

        {/* Preparation Tips */}
        <div className="mt-12 bg-gray-900 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6">How to Prepare</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-yellow-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">💡</div>
                <div>
                  <h3 className="text-white font-semibold">Come with Questions</h3>
                  <p className="text-gray-300 text-sm">Prepare specific AI challenges you want to solve</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">🎯</div>
                <div>
                  <h3 className="text-white font-semibold">Define Your Goals</h3>
                  <p className="text-gray-300 text-sm">Think about what you want to achieve with AI</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">🔧</div>
                <div>
                  <h3 className="text-white font-semibold">Test Your Setup</h3>
                  <p className="text-gray-300 text-sm">Ensure your camera and microphone work properly</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">📝</div>
                <div>
                  <h3 className="text-white font-semibold">Take Notes</h3>
                  <p className="text-gray-300 text-sm">Have a notepad ready for key insights and action items</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}