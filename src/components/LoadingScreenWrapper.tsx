'use client';

import LoadingScreen from './LoadingScreen';
import { useLoading } from '@/contexts/LoadingContext';

export default function LoadingScreenWrapper() {
  const { isInitialLoading, isPageTransition } = useLoading();

  return (
    <>
      {/* Initial loading screen (full experience) */}
      <LoadingScreen 
        isLoading={isInitialLoading} 
        type="full" 
      />
      
      {/* Page transition loading (quick effect) */}
      <LoadingScreen 
        isLoading={isPageTransition} 
        type="transition" 
      />
    </>
  );
}