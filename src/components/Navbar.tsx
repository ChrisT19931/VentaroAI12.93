'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const { items } = useCart();
  const { data: session, status } = useSession();
  const user = session?.user || null;

  return (
    <nav className="bg-black/90 backdrop-blur-md z-50 sticky top-0 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center group">
              <Image 
                src="/images/ventaro-logo-premium.svg" 
                alt="Ventaro" 
                width={180} 
                height={50} 
                className="transition-transform duration-300 group-hover:scale-105 drop-shadow-lg"
                priority
                onError={(e) => {
                  // Fallback to original logo if premium logo fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/ventaro-logo.svg";
                }}
              />
            </Link>
            <div className="hidden md:ml-8 md:flex md:space-x-1">
              <Link href="/" className="px-5 py-3 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-900/80 transition-all duration-300 border border-transparent hover:border-gray-700">
                Home
              </Link>
              <Link href="/custom-solutions" className="px-5 py-3 rounded-lg text-sm font-semibold text-gray-300 hover:text-white bg-gradient-to-r from-slate-900/50 to-blue-900/50 hover:from-slate-800/60 hover:to-blue-800/60 transition-all duration-300 border border-slate-700/50 hover:border-slate-600/60 border-l-2 border-l-slate-500/50 hover:border-l-slate-400/70">
                <span className="tracking-wide">CUSTOM SOLUTIONS</span>
              </Link>
              <Link href="/vai-coaching" className="px-5 py-3 rounded-lg text-sm font-semibold text-gray-300 hover:text-white bg-gray-900 hover:bg-gray-800 transition-all duration-300 border border-gray-700/50 hover:border-gray-600/60 border-l-2 border-l-blue-500/30 hover:border-l-blue-500/60">
                <span className="tracking-wide">VAI COACHING</span>
              </Link>
              <Link href="/products" className="px-5 py-3 rounded-lg text-sm font-medium text-gray-300 hover:text-white bg-gray-900/80 hover:bg-gray-800 transition-all duration-300 border border-gray-700/50 hover:border-gray-600/60 border-l-2 border-l-emerald-500/30 hover:border-l-emerald-500/60">
                <span>VAI Toolkit</span>
              </Link>
              
              {/* More Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsMoreOpen(!isMoreOpen)}
                  className="px-5 py-3 rounded-lg text-sm font-medium text-gray-300 hover:text-white bg-gray-900/80 hover:bg-gray-800 transition-all duration-300 border border-gray-700/50 hover:border-gray-600/60 border-l-2 border-l-amber-500/30 hover:border-l-amber-500/60 flex items-center space-x-2"
                >
                  <span>More</span>
                  <svg className={`w-4 h-4 transition-transform duration-200 ${isMoreOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isMoreOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-black/95 border border-gray-700 rounded-lg shadow-2xl z-50">
                    <div className="py-2">
                      <Link href="/about" className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors border-l-2 border-l-blue-500/30 hover:border-l-blue-500/60">
                        <span>About Us</span>
                      </Link>
                      <Link href="/contact" className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors border-l-2 border-l-green-500/30 hover:border-l-green-500/60">
                        <span>Contact</span>
                      </Link>
                      <div className="border-t border-gray-600 my-2"></div>
                      <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Coming Soon
                      </div>
                      <Link href="/vai-agents" className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors border-l-2 border-l-purple-500/30 hover:border-l-purple-500/60">
                        <div className="flex items-center justify-between">
                          <span>VAI Agents</span>
                          <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-full font-medium border border-gray-600/30">SOON</span>
                        </div>
                      </Link>
                      <Link href="/ai-masterclass" className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors border-l-2 border-l-purple-500/30 hover:border-l-purple-500/60">
                        <div className="flex items-center justify-between">
                          <span>VAI Masterclass</span>
                          <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-full font-medium border border-gray-600/30">SOON</span>
                        </div>
                      </Link>
                      <Link href="/web-gen" className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors border-l-2 border-l-emerald-500/30 hover:border-l-emerald-500/60">
                        <div className="flex items-center justify-between">
                          <span>VAI Web Gen</span>
                          <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-full font-medium border border-gray-600/30">SOON</span>
                        </div>
                      </Link>
                      <Link href="/affiliate" className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors border-l-2 border-l-cyan-500/30 hover:border-l-cyan-500/60">
                        <span>Affiliate Program</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <Link href="/my-account" className="flex items-center px-4 py-2 text-amber-300 bg-gray-900 hover:bg-black rounded-lg transition-all duration-300 border border-amber-900/50 hover:border-amber-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm font-medium">My Account</span>
              </Link>
            )}
            <Link href="/cart" className="relative p-3 text-gray-300 hover:text-amber-300 hover:bg-gray-900 rounded-lg transition-colors duration-200 border border-transparent hover:border-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-medium leading-none text-amber-300 bg-gray-900 rounded-full border border-amber-900/30">
                  {items.length}
                </span>
              )}
            </Link>
            {!user && (
              <Link href="/signin" className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-900 text-amber-300 hover:bg-black transition-all duration-300 border border-amber-900/50 hover:border-amber-700">
                Sign In
              </Link>
            )}
          </div>
          <div className="flex items-center md:hidden space-x-3">
            {user && (
              <Link href="/my-account" className="p-2 text-gray-300 hover:text-amber-300 hover:bg-gray-900 rounded-lg transition-colors duration-200 border border-transparent hover:border-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}
            <Link href="/cart" className="relative p-2 text-gray-300 hover:text-amber-300 hover:bg-gray-900 rounded-lg transition-colors duration-200 border border-transparent hover:border-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-medium leading-none text-amber-300 bg-gray-900 rounded-full border border-amber-900/30">
                  {items.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-300 hover:text-amber-300 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-900/50 transition-colors duration-200 border border-transparent hover:border-gray-800"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6 transition-transform duration-200`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6 transition-transform duration-200`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden fixed inset-x-0 top-16 z-50`}>
        <div className="px-4 pt-4 pb-4 space-y-2 bg-black/95 mt-2 rounded-lg mx-4 mb-4 shadow-2xl border border-gray-800">
          <Link href="/" className="block px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-gray-900 transition-all duration-300 border border-transparent hover:border-gray-800">
            Home
          </Link>
          <Link href="/custom-solutions" className="block px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-gray-900 transition-all duration-300 border border-transparent hover:border-gray-800 border-l-2 border-l-slate-500/30 hover:border-l-slate-500/60">
            Custom Solutions
          </Link>
          <Link href="/vai-coaching" className="block px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-gray-900 transition-all duration-300 border border-transparent hover:border-gray-800 border-l-2 border-l-blue-500/30 hover:border-l-blue-500/60">
            VAI Coaching
          </Link>
          <Link href="/products" className="block px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-gray-900 transition-all duration-300 border border-transparent hover:border-gray-800 border-l-2 border-l-emerald-500/30 hover:border-l-emerald-500/60">
            VAI Toolkit
          </Link>
          
          <div className="border-t border-gray-700 pt-2 mt-2">
            <Link href="/about" className="block px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-gray-900 transition-all duration-300 border border-transparent hover:border-gray-800">
              About Us
            </Link>
            <Link href="/contact" className="block px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-gray-900 transition-all duration-300 border border-transparent hover:border-gray-800">
              Contact
            </Link>
          </div>
          
          {/* Coming Soon Section */}
          <div className="border-t border-gray-700 pt-2 mt-2">
            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Coming Soon
            </div>
            <Link href="/vai-agents" className="block px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-gray-900 transition-all duration-300 border border-transparent hover:border-gray-800 border-l-2 border-l-purple-500/30 hover:border-l-purple-500/60 relative">
              VAI Agents
              <span className="absolute -top-1 -right-1 bg-gray-800 text-gray-300 text-xs px-1 py-0.5 rounded text-[10px] font-medium border border-gray-600/30">SOON</span>
            </Link>
            <Link href="/ai-masterclass" className="block px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-gray-900 transition-all duration-300 border border-transparent hover:border-gray-800 border-l-2 border-l-purple-500/30 hover:border-l-purple-500/60 relative">
              VAI Masterclass
              <span className="absolute -top-1 -right-1 bg-gray-800 text-gray-300 text-xs px-1 py-0.5 rounded text-[10px] font-medium border border-gray-600/30">SOON</span>
            </Link>
            <Link href="/web-gen" className="block px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-gray-900 transition-all duration-300 border border-transparent hover:border-gray-800 border-l-2 border-l-emerald-500/30 hover:border-l-emerald-500/60 relative">
              VAI Web Gen
              <span className="absolute -top-1 -right-1 bg-gray-800 text-gray-300 text-xs px-1 py-0.5 rounded text-[10px] font-medium border border-gray-600/30">SOON</span>
            </Link>
            <Link href="/affiliate" className="block px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-gray-900 transition-all duration-300 border border-transparent hover:border-gray-800 border-l-2 border-l-cyan-500/30 hover:border-l-cyan-500/60">
              Affiliate Program
            </Link>
          </div>

          {user && (
            <Link href="/my-account" className="flex items-center px-4 py-3 rounded-lg text-base font-medium bg-gray-900 text-amber-300 hover:bg-black transition-all duration-300 border border-amber-900/50 hover:border-amber-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              My Account
            </Link>
          )}
          {!user && (
            <Link href="/signin" className="block px-4 py-3 rounded-lg text-base font-medium bg-gray-900 text-amber-300 hover:bg-black transition-all duration-300 border border-amber-900/50 hover:border-amber-700 text-center">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}