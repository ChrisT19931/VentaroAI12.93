'use client'

import { useLoading } from '@/contexts/LoadingContext'

interface PageTransitionLoaderProps {
  children: React.ReactNode
}

export default function PageTransitionLoader({ children }: PageTransitionLoaderProps) {
  const { isInitialLoading, isPageTransition } = useLoading()
  
  // Show content when not loading
  const showContent = !isInitialLoading && !isPageTransition
  
  return (
    <div className={`transition-opacity duration-300 ${
      showContent ? 'opacity-100' : 'opacity-0'
    }`}>
      {children}
    </div>
  )
}