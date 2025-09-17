'use client'
import { useState } from 'react'
import AIChatWidget from './AIChatWidget'
import FloatingQuoteButton from './FloatingQuoteButton'
import Link from 'next/link'

export default function GlobalWidgets() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [showQuoteModal, setShowQuoteModal] = useState(false)

  // Removed handleQuoteClick - let FloatingQuoteButton use its default behavior

  return (
    <>
      {/* AI Chat Toggle Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-8 left-8 z-50 group"
        aria-label="Open AI Chat"
      >
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
          
          {/* Main button */}
          <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-bold p-4 rounded-full shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-blue-500/50">
            <svg 
              className="w-6 h-6 transform group-hover:rotate-12 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
              />
            </svg>
          </div>
          
          {/* Ripple effect */}
          <div className="absolute inset-0 rounded-full border-2 border-blue-400 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500"></div>
        </div>
      </button>

      {/* AI Chat Widget */}
      <div className={`fixed inset-0 z-[60] ${isChatOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <AIChatWidget 
          isOpen={isChatOpen} 
          onToggle={() => setIsChatOpen(!isChatOpen)} 
        />
      </div>

      {/* VAI Masterclass Button */}
      <FloatingQuoteButton />
    </>
  )
}