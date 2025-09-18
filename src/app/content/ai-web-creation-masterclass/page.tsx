'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Play, Download, BookOpen, CheckCircle, Lock } from 'lucide-react';
import Link from 'next/link';

export default function AIWebCreationMasterclassContent() {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const checkAccess = async () => {
      if (status === 'loading') return;

      if (status === 'unauthenticated') {
        router.push('/signin?callbackUrl=/content/ai-web-creation-masterclass');
        return;
      }

      if (!session?.user) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      try {
        // Check if user is admin
        if (session.user.roles?.includes('admin') || session.user.email === 'chris.t@ventarosales.com') {
          setHasAccess(true);
          setLoading(false);
          return;
        }

        // Check if user has purchased the product
        const userProducts = session.user.entitlements || [];
        const hasProduct = userProducts.includes('ai-web-creation-masterclass') ||
                          userProducts.includes('video') ||
                          userProducts.includes('masterclass');

        setHasAccess(hasProduct);
        
      } catch (error) {
        console.error('Error checking access:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [session, status, router]);

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading content...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md mx-auto text-center">
          <Lock className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">🔒 Access Restricted</h1>
          <p className="text-gray-300 mb-6">
            You need to purchase the AI Web Creation Masterclass to access this content.
          </p>
          <div className="space-y-4">
            <Link
              href="/products"
              className="w-full block text-center py-3 rounded-xl font-bold transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-base"
            >
              Purchase Access - A$50
            </Link>
            <Link
              href="/my-account"
              className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors w-full block text-center"
            >
              Back to My Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              AI Web Creation Masterclass
            </h1>
            <p className="text-xl text-gray-300">
              Complete step-by-step guide to building AI-powered websites
            </p>
          </div>

          {/* Main Video Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
            <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center mb-6">
              <div className="text-center">
                <Play className="w-20 h-20 text-blue-400 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-white mb-2">Masterclass Video</h3>
                <p className="text-gray-400 mb-4">
                  Video content to be added
                </p>
              </div>
            </div>
          </div>

          {/* Cheat Sheet Link */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center mb-8">
            <BookOpen className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">AI Web Creation Cheat Sheet</h3>
            <p className="text-gray-300 mb-4">Access the comprehensive cheat sheet for this masterclass</p>
            <Link
              href="https://ventaroai.com/products/ai-web-creation-masterclass"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors inline-block"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Cheat Sheet
            </Link>
          </div>

          {/* Navigation */}
          <div className="text-center">
            <Link
              href="/my-account"
              className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-lg transition-colors mr-4"
            >
              ← Back to My Account
            </Link>
            <Link
              href="/content"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              View All Content
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}