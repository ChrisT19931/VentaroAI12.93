'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ToolboxPage() {
  const router = useRouter();

  // Redirect to products page (VAI Toolkit)
  useEffect(() => {
    router.replace('/products');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white">Redirecting to VAI Toolkit...</p>
      </div>
    </div>
  );
}