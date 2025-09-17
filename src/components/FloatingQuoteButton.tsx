'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface FloatingQuoteButtonProps {
  onClick?: () => void
}

export default function FloatingQuoteButton({ onClick }: FloatingQuoteButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const router = useRouter()

  const handleSubscribeClick = () => {
    if (onClick) {
      onClick()
    } else {
      router.push('/vai-coaching')
    }
  }

  return (
    <button
      onClick={handleSubscribeClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-8 right-8 z-50 group"
      aria-label="VAI Coaching"
    >
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
        
        {/* Main button */}
        <div className="relative bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 text-white font-bold py-4 px-6 rounded-full shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-gray-500/50 border border-gray-600">
          <div className="flex items-center space-x-2">
            <svg 
              className="w-5 h-5 transform group-hover:rotate-12 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 0 0-15 0v5h5" 
              />
            </svg>
            <span className="text-sm font-black tracking-wide">
              {isHovered ? 'LEARN MORE' : 'VAI COACHING'}
            </span>
          </div>
        </div>
        
        {/* Ripple effect */}
        <div className="absolute inset-0 rounded-full border-2 border-gray-400 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500"></div>
      </div>
    </button>
  )
}