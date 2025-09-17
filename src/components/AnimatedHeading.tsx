'use client';

import { useEffect, useRef } from 'react';

interface AnimatedHeadingProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade' | 'slide-up' | 'slide-left' | 'slide-right' | 'scale' | 'shimmer' | 'glow' | 'float';
  theme?: 'default' | 'gold' | 'silver' | 'blue' | 'purple' | 'emerald';
  delay?: number;
  is3D?: boolean;
  deep3D?: boolean;
}

export default function AnimatedHeading({
  children,
  className = '',
  animation = 'slide-up',
  theme = 'default',
  delay = 0,
  is3D = false,
  deep3D = false,
}: AnimatedHeadingProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (headingRef.current) {
      observer.observe(headingRef.current);
    }

    return () => {
      if (headingRef.current) {
        observer.unobserve(headingRef.current);
      }
    };
  }, []);

  // Animation classes
  const animationClasses = {
    'fade': 'premium-fade-in',
    'slide-up': 'premium-slide-up',
    'slide-left': 'premium-slide-left',
    'slide-right': 'premium-slide-right',
    'scale': 'premium-scale-in',
    'shimmer': 'premium-shimmer',
    'glow': 'premium-glow',
    'float': 'premium-float'
  };

  // Enhanced theme classes with sophisticated effects
  const themeClasses = {
    'default': 'text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-white drop-shadow-2xl',
    'gold': 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-300 drop-shadow-[0_0_30px_rgba(255,215,0,0.5)]',
    'silver': 'text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300 drop-shadow-[0_0_25px_rgba(192,192,192,0.4)]',
    'blue': 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 drop-shadow-[0_0_25px_rgba(59,130,246,0.5)]',
    'purple': 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 drop-shadow-[0_0_25px_rgba(147,51,234,0.5)]',
    'emerald': 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-400 drop-shadow-[0_0_25px_rgba(16,185,129,0.5)]'
  };

  // Enhanced 3D effect classes
  const effect3D = is3D ? 'transform-gpu perspective-1000 rotate-x-12 hover:rotate-x-0 transition-transform duration-700' : '';
  const effectDeep3D = deep3D ? 'text-shadow-[0_1px_0_#ccc,0_2px_0_#c9c9c9,0_3px_0_#bbb,0_4px_0_#b9b9b9,0_5px_0_#aaa,0_6px_1px_rgba(0,0,0,.1),0_0_5px_rgba(0,0,0,.1),0_1px_3px_rgba(0,0,0,.3),0_3px_5px_rgba(0,0,0,.2),0_5px_10px_rgba(0,0,0,.25)]' : '';

  return (
    <div className="relative group">
      {/* Background glow effect */}
      <div className="absolute -inset-2 bg-gradient-to-r from-transparent via-current to-transparent opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-700 rounded-lg"></div>
      
      {/* Animated border */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-emerald-600/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
      
      <h2
        ref={headingRef}
        className={`
          premium-heading relative z-10 font-black tracking-tight
          ${animationClasses[animation]}
          ${themeClasses[theme]}
          ${effect3D}
          ${effectDeep3D}
          hover:scale-105 transition-all duration-500
          ${className}
        `}
        style={{ 
          animationDelay: `${delay}ms`,
          textShadow: is3D ? '2px 2px 4px rgba(0,0,0,0.5), 4px 4px 8px rgba(0,0,0,0.3)' : undefined
        }}
      >
        {children}
      </h2>
    </div>
  );
}