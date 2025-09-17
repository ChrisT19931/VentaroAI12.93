'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

// Set dynamic params
export const dynamicParams = true;

const CoachingContentComponent = dynamic(() => import('@/components/downloads/CoachingContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-white">Loading...</p>
      </div>
    </div>
  )
});

export default function CoachingDownloadPage() {
  const { data: session } = useSession();
  const user = session?.user;
  
  // Check if user is admin
  const isAdmin = user?.email === 'chris.t@ventarosales.com';
  
  // Initialize hasAccess to false
  const [hasAccess, setHasAccess] = useState(false);
  
  // Fetch user's purchases to determine access to this specific product
  useEffect(() => {
    const fetchUserPurchases = async () => {
      if (!user?.id) {
        setHasAccess(false);
        return;
      }
      
      // Admin always has access
      if (isAdmin) {
        setHasAccess(true);
        return;
      }
      
      try {
        const response = await fetch(`/api/purchases/confirm?userId=${user.id}`);
        
        if (response.ok) {
          const data = await response.json();
          const userPurchases = data.purchases || [];
          
          // Check if user has purchased this specific product (coaching)
          // Note: The purchases table doesn't have a status field, so we just check for the product_id
          const hasProductAccess = userPurchases.some(
            (purchase: any) => purchase.product_id === 'coaching'
          );
          
          setHasAccess(hasProductAccess);
        } else {
          console.error('Failed to fetch user purchases');
          setHasAccess(false);
        }
      } catch (error) {
        console.error('Error fetching user purchases:', error);
        setHasAccess(false);
      }
    };
    
    fetchUserPurchases();
  }, [user?.id, isAdmin]);
  
  return <CoachingContentComponent hasAccess={hasAccess} isAdmin={isAdmin} />;
}