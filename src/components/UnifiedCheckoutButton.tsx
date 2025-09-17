'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { analytics } from '@/lib/analytics';

type Product = {
  id: string;
  name: string;
  price: number;
  image_url?: string | null;
  productType?: 'digital' | 'physical';
  isPreOrder?: boolean;
  comingSoon?: boolean;
};

interface UnifiedCheckoutButtonProps {
  product: Product;
  className?: string;
  buttonText?: string;
  children?: React.ReactNode;
  variant?: 'buy-now' | 'direct' | 'add-to-cart';
  onPreOrderSuccess?: () => void;
}

export default function UnifiedCheckoutButton({ 
  product, 
  className = '', 
  buttonText,
  children,
  variant = 'buy-now',
  onPreOrderSuccess
}: UnifiedCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();
  const user = session?.user;
  const isAuthenticated = status === 'authenticated';
  const router = useRouter();

  const handleCheckout = async () => {
    // Track purchase intent
    analytics.trackPurchaseIntent(product.id, product.name, product.price);
    
    // Handle pre-order products differently
    if (product.isPreOrder) {
      setIsLoading(true);
      try {
        // For pre-orders, we need email to track interest
        const email = user?.email;
        if (!email) {
          toast.error('Email required for pre-order');
          return;
        }

        const response = await fetch('/api/preorder-count', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          if (data.error === 'Maximum pre-orders reached') {
            toast.error('Sorry, all 300 spots have been filled! Join our waitlist for updates.');
          } else if (data.error === 'Email already registered') {
            toast.error('You\'ve already secured your spot!');
          } else {
            throw new Error(data.error || 'Failed to register pre-order');
          }
          return;
        }

        toast.success(`Success! You\'re #${data.count} of 300. We\'ll notify you when it\'s ready!`);
        
        // Call the success callback to update the UI
        if (onPreOrderSuccess) {
          onPreOrderSuccess();
        }
        
        // Track pre-order success
        analytics.track('preorder_success', {
          product_id: product.id,
          product_name: product.name,
          count: data.count,
          email: email
        });
        
      } catch (error: any) {
        console.error('Pre-order error:', error);
        toast.error(error.message || 'Failed to register pre-order. Please try again.');
      } finally {
        setIsLoading(false);
      }
      return;
    }
    
    // Single authentication check for regular purchases
    if (!isAuthenticated || !user) {
      // Store the current product info in sessionStorage for after sign-up
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('pendingCheckout', JSON.stringify({
          productId: product.id,
          productName: product.name,
          price: product.price
        }));
      }
      toast.error('Please sign up to make a purchase');
      // Redirect to sign-up page (which will redirect back to checkout after authentication)
      router.push('/signup');
      return;
    }

    // Track checkout start
    analytics.trackCheckoutStart(product.id, product.name, product.price);
    setIsLoading(true);
    
    try {
      // Single unified checkout API call
      console.log('Initiating checkout for product:', product);
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [{
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image_url,
            productType: product.productType || 'digital'
          }]
        }),
      });

      const data = await response.json();
      console.log('Checkout response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        // Track successful checkout redirect
        analytics.track('checkout_redirect', {
          product_id: product.id,
          product_name: product.name,
          price: product.price,
          checkout_url: data.url
        });
        
        // Direct redirect to Stripe Checkout - single flow
        console.log('Redirecting to checkout URL:', data.url);
        window.location.href = data.url;
      } else {
        console.error('No checkout URL in response:', data);
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to start checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (children) return children;
    if (buttonText) return buttonText;
    
    switch (variant) {
      case 'buy-now':
        return 'Buy Now';
      case 'direct':
        return 'Purchase';
      case 'add-to-cart':
        return 'Buy Now'; // Simplified - no cart, direct purchase
      default:
        return 'Buy Now';
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={isLoading}
      className={`${className} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </div>
      ) : (
        getButtonText()
      )}
    </button>
  );
}