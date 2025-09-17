'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface LoadingContextType {
  isInitialLoading: boolean;
  isPageTransition: boolean;
  setPageTransition: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isPageTransition, setIsPageTransition] = useState(false);
  const pathname = usePathname();
  const [previousPathname, setPreviousPathname] = useState(pathname);

  // Handle initial loading (only on first visit)
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('ventaro-visited');
    
    if (!hasVisited) {
      // First visit - show full loading screen
      const timer = setTimeout(() => {
        setIsInitialLoading(false);
        sessionStorage.setItem('ventaro-visited', 'true');
      }, 2000);
      
      return () => clearTimeout(timer);
    } else {
      // Already visited - skip initial loading
      setIsInitialLoading(false);
    }
  }, []);

  // Handle page transitions
  useEffect(() => {
    if (previousPathname !== pathname && !isInitialLoading) {
      setIsPageTransition(true);
      
      // Minimum 1 second transition for all pages for professional feel
      const transitionDuration = 1000;
      
      const timer = setTimeout(() => {
        setIsPageTransition(false);
      }, transitionDuration);
      
      setPreviousPathname(pathname);
      return () => clearTimeout(timer);
    }
  }, [pathname, previousPathname, isInitialLoading]);

  const setPageTransitionManual = (loading: boolean) => {
    setIsPageTransition(loading);
  };

  return (
    <LoadingContext.Provider
      value={{
        isInitialLoading,
        isPageTransition,
        setPageTransition: setPageTransitionManual,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}