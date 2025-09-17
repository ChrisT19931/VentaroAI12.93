'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import UnifiedCheckoutButton from '@/components/UnifiedCheckoutButton';
import SupportPackageForm from '@/components/SupportPackageForm';

// Helper function to check if user owns a product
function checkOwnership(userProducts: string[], productId: string): boolean {
  return userProducts.includes(productId);
}

interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  view_url: string;
  price: number;
  productType: 'digital' | 'physical';
  featured?: boolean;
  isPreOrder?: boolean;
  comingSoon?: boolean;
  category?: string;
}

const AVAILABLE_PRODUCTS: Product[] = [
  {
    id: 'vai-beginners-mastery',
    name: 'AI for Beginners',
    description: 'Comprehensive AI guidance for sales professionals and entrepreneurs. Get up to date with the full range of AI tools, learn how to use them effectively for your goals, and master practical applications for business growth. Includes: • 60-minute consultation call • Unlimited email support (1 month) • Complete AI beginner cheat sheet. September 2025 special: $250 (was $300).',
    image_url: '/images/products/vai-beginners-coaching.svg',
    view_url: '/coaching/vai-beginners-mastery',
    price: 250.00,
    productType: 'digital',
    featured: true,
    category: 'Coaching Session'
  },
  {
    id: 'vai-web-development-elite',
    name: 'AI for Web Developers',
    description: 'Learn how to leverage AI tools to create online platforms, tools, and SaaS applications. Master AI-powered development workflows, automation strategies, and cutting-edge implementation techniques for modern web development. Includes: • 60-minute consultation call • Unlimited email support (1 month) • Technical implementation guide. September 2025 special: $250 (was $300).',
    image_url: '/images/products/vai-web-dev-coaching.svg',
    view_url: '/coaching/vai-web-development-elite',
    price: 250.00,
    productType: 'digital',
    featured: true,
    category: 'Coaching Session'
  },
  {
    id: 'ai-business-strategy-session',
    name: 'AI for Business',
    description: 'Strategic AI guidance for employers and business leaders. Understand AI capabilities, implementation strategies, and how to effectively integrate AI solutions into your organization for competitive advantage and operational efficiency. Includes: • 90-minute strategy session • Unlimited email support (1 month) • Custom AI strategy roadmap. September 2025 special: $250 (was $300).',
    image_url: '/images/products/ai-business-coaching.svg',
    view_url: '/coaching/ai-business-strategy-session',
    price: 250.00,
    productType: 'digital',
    featured: true,
    category: 'Coaching Session'
  }
];

export default function MyAccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [ownedProducts, setOwnedProducts] = useState<string[]>([]);
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
      console.log('Using mock user from URL:', emailParam, 'isAdmin:', isAdmin);
    }
  }, []);

  // Get user from session or mock user
  const user = session?.user || mockUser || null;
  const isAuthenticated = status === 'authenticated' || !!mockUser;

  // Handle pending checkout after authentication
  useEffect(() => {
    if (isAuthenticated && typeof window !== 'undefined') {
      const pendingCheckout = sessionStorage.getItem('pendingCheckout');
      if (pendingCheckout) {
        try {
          const checkoutData = JSON.parse(pendingCheckout);
          console.log('Processing pending checkout:', checkoutData);
          
          // Clear the pending checkout
          sessionStorage.removeItem('pendingCheckout');
          
          // Automatically initiate checkout
          const processCheckout = async () => {
            try {
              const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  items: [{
                    id: checkoutData.productId,
                    quantity: 1
                  }]
                }),
              });
              
              const data = await response.json();
              
              if (data.url) {
                // Redirect to Stripe checkout
                window.location.href = data.url;
              } else {
                console.error('Failed to create checkout session:', data.error);
              }
            } catch (error) {
              console.error('Error processing pending checkout:', error);
            }
          };
          
          // Small delay to ensure page is fully loaded
          setTimeout(processCheckout, 1000);
        } catch (error) {
          console.error('Error parsing pending checkout:', error);
          sessionStorage.removeItem('pendingCheckout');
        }
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    console.log('MyAccountPage - Session status:', status);
    console.log('MyAccountPage - User data:', user);
    
    // If still loading and no mock user, wait
    if (status === 'loading' && !mockUser) {
      console.log('MyAccountPage - Session loading, waiting...');
      return;
    }
    
    // If not authenticated and no mock user, redirect to signin
    if (!isAuthenticated) {
      console.log('MyAccountPage - Not authenticated, redirecting to signin');
      router.push(`/signin?callbackUrl=/my-account&t=${Date.now()}`);
      return;
    }
    
    console.log('MyAccountPage - User authenticated successfully');

    const fetchOwnedProducts = async () => {
      try {
        // Check if user is admin (chris.t@ventarosales.com)
        const isAdmin = user?.email === 'chris.t@ventarosales.com' || (mockUser?.isAdmin === true);
        
        if (isAdmin) {
          // Admin gets access to all products
          setOwnedProducts(AVAILABLE_PRODUCTS.map(p => p.id));
        } else {
          // For regular users, fetch from API
          try {
            const response = await fetch('/api/user/products');
            if (response.ok) {
              const data = await response.json();
              setOwnedProducts(data.products || []);
            } else {
              console.error('Failed to fetch owned products');
              // No products for regular users unless purchased
              setOwnedProducts([]);
            }
          } catch (error) {
            console.error('Error fetching user products:', error);
            // No products for regular users unless purchased
            setOwnedProducts([]);
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error in product fetching flow:', error);
        // No products for regular users unless purchased
        setOwnedProducts([]);
        setIsLoading(false);
      }
    };

    fetchOwnedProducts();
  }, [isAuthenticated, user, router]);

  const isProductOwned = (productId: string) => ownedProducts.includes(productId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black bg-opacity-75 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-8 mb-8 border border-gray-700 shadow-lg">
          <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white">VAI Coaching Sessions</h1>
                </div>
              </div>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">Professional AI coaching to accelerate your success. Choose your path and unlock your potential.</p>
            
            {user && (
              <div className="mt-6 inline-flex items-center gap-2 bg-gray-800/50 rounded-full px-4 py-2 border border-gray-700">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300 text-sm">Signed in as</span>
                <span className="text-white font-medium">{user.email}</span>
                {user?.email === 'chris.t@ventarosales.com' && (
                  <span className="ml-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                    Admin Access
                  </span>
                )}
              </div>
            )}
          </div>
          
          <div className="flex justify-center">
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl transition-colors font-semibold"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Support Package Quick Form - Only show if user owns support package */}
        {(isProductOwned('weekly-support-contract-2025') || user?.email === 'chris.t@ventarosales.com') && (
          <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-8 mb-8 border border-gray-700 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Premium Support</h2>
                <p className="text-gray-300 text-sm">Get personalized help with your AI projects</p>
              </div>
            </div>
            <SupportPackageForm userEmail={user?.email || ''} userName={(user && 'name' in user ? user.name : user?.email) || ''} />
          </div>
        )}

        {/* Products Grid */}
        <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-8 border border-gray-700 shadow-lg">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">My Digital Products</h2>
              <p className="text-gray-300">Access your purchased content and discover new AI-powered resources</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Total Products</div>
              <div className="text-2xl font-bold text-purple-400">{AVAILABLE_PRODUCTS.length}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
            {AVAILABLE_PRODUCTS.map((product) => {
              const owned = isProductOwned(product.id);
              const isAdmin = user?.email === 'chris.t@ventarosales.com';
              const isFeatured = product.featured;
              
              return (
                <div key={product.id} className="group relative bg-gradient-to-br from-black/80 via-gray-900/60 to-black/95 backdrop-blur-2xl rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] hover:shadow-[0_35px_60px_-12px_rgba(147,51,234,0.4)] transition-all duration-700 transform hover:-translate-y-2 hover:scale-105 overflow-hidden border-2 border-gray-700/30 hover:border-purple-500/50">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 via-blue-600/30 to-purple-600/30 rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-700"></div>
                  
                  {/* Status Badges */}
                  <div className="absolute top-4 right-4 z-20 flex gap-2">
                    {(owned || isAdmin) && (
                      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-[0_8px_25px_-8px_rgba(34,197,94,0.6)] flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {isAdmin ? 'Admin' : 'Owned'}
                      </div>
                    )}
                    {product.isPreOrder && (
                      <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-[0_8px_25px_-8px_rgba(251,146,60,0.6)]">
                        PRE-ORDER
                      </div>
                    )}
                    {product.featured && (
                      <div className="bg-gradient-to-r from-purple-500 to-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-[0_8px_25px_-8px_rgba(147,51,234,0.6)]">
                        ⭐ Featured
                      </div>
                    )}
                  </div>
                  
                  {/* Category Badge */}
                  {product.category && (
                    <div className="absolute top-4 left-4 z-20">
                      <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full border border-gray-600/50">
                        {product.category}
                      </div>
                    </div>
                  )}
                  
                  {/* Icon Section */}
                  <div className="h-40 bg-gradient-to-br from-black to-gray-900 relative overflow-hidden flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-gray-900 group-hover:to-black transition-all duration-700 shadow-inner">
                    <div className="relative transform group-hover:scale-150 group-hover:rotate-12 transition-all duration-700">
                      {product.category === 'Coaching Session' ? (
                        <svg className="w-20 h-20 text-purple-400 opacity-80 group-hover:opacity-100 group-hover:text-purple-300 transition-all duration-700 drop-shadow-[0_10px_20px_rgba(147,51,234,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      ) : product.category === 'Video Course' ? (
                        <svg className="w-20 h-20 text-blue-400 opacity-80 group-hover:opacity-100 group-hover:text-blue-300 transition-all duration-700 drop-shadow-[0_10px_20px_rgba(59,130,246,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      ) : product.category === 'E-book' ? (
                        <svg className="w-20 h-20 text-emerald-400 opacity-80 group-hover:opacity-100 group-hover:text-emerald-300 transition-all duration-700 drop-shadow-[0_10px_20px_rgba(16,185,129,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      ) : (
                        <svg className="w-20 h-20 text-yellow-400 opacity-80 group-hover:opacity-100 group-hover:text-yellow-300 transition-all duration-700 drop-shadow-[0_10px_20px_rgba(251,191,36,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      )}
                      <div className="absolute inset-0 bg-purple-400/40 rounded-full blur-3xl group-hover:bg-purple-400/70 transition-all duration-700 animate-pulse"></div>
                      <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-700"></div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent group-hover:from-black/60 transition-all duration-700"></div>
                  </div>
                  
                  <div className="relative z-10 p-6 space-y-4">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent group-hover:from-purple-200 group-hover:via-white group-hover:to-purple-200 transition-all duration-700">
                      {product.name}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed group-hover:text-gray-200 transition-colors duration-500">
                      {product.description}
                    </p>
                    
                    <div className="pt-6 border-t border-gray-700/30 group-hover:border-purple-500/30 transition-colors duration-500">
                      {(owned || isAdmin) ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 text-emerald-400 text-sm font-semibold">
                            <div className="w-5 h-5 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            Content Unlocked
                          </div>
                          <Link 
                             href={product.view_url}
                             className="group/btn relative w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 hover:from-purple-500 hover:via-purple-600 hover:to-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-500 hover:shadow-[0_20px_40px_-12px_rgba(147,51,234,0.6)] transform hover:-translate-y-1 hover:scale-105 overflow-hidden"
                           >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                            <span className="relative z-10">Access Content</span>
                            <svg className="relative z-10 w-5 h-5 transition-transform duration-500 group-hover/btn:translate-x-2 group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                             </svg>
                           </Link>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-white to-purple-400 bg-clip-text text-transparent">
                              ${product.price}
                            </div>
                            <div className="text-gray-400 text-sm font-medium">
                              One-time purchase
                            </div>
                          </div>
                          <UnifiedCheckoutButton
                             product={{
                               id: product.id,
                               name: product.name,
                               price: product.price,
                               image_url: product.image_url,
                               productType: product.productType
                             }}
                             className="group/btn relative w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 hover:from-purple-500 hover:via-purple-600 hover:to-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-500 hover:shadow-[0_20px_40px_-12px_rgba(147,51,234,0.6)] transform hover:-translate-y-1 hover:scale-105 overflow-hidden"
                           />
                          <Link 
                            href={`/products/${product.id}`}
                            className="w-full bg-gray-700 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg transition-colors font-semibold text-center block"
                          >
                            View Details
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}