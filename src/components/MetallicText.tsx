'use client';

import { useRef, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

interface MetallicTextProps {
  text: string;
  className?: string;
  theme?: 'gold' | 'silver' | 'blue' | 'purple' | 'emerald';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  withGlow?: boolean;
}

export default function MetallicText({
  text,
  className = '',
  theme = 'silver',
  size = 'lg',
  withGlow = true,
}: MetallicTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const controls = useAnimation();
  
  // Enhanced theme configurations with sophisticated metallic effects
  const themeStyles = {
    gold: {
      gradient: 'from-yellow-600 via-yellow-300 to-yellow-600',
      shadow: 'shadow-amber-500/40 drop-shadow-[0_4px_12px_rgba(255,215,0,0.6)]',
      stroke: 'text-amber-900/30',
      highlight: 'from-white via-yellow-200 to-yellow-300',
      glow: 'shadow-[0_0_30px_rgba(255,215,0,0.5)]',
    },
    silver: {
      gradient: 'from-gray-500 via-gray-200 to-gray-500',
      shadow: 'shadow-gray-500/40 drop-shadow-[0_4px_10px_rgba(192,192,192,0.5)]',
      stroke: 'text-gray-900/30',
      highlight: 'from-white via-gray-100 to-gray-300',
      glow: 'shadow-[0_0_25px_rgba(192,192,192,0.4)]',
    },
    blue: {
      gradient: 'from-blue-600 via-blue-300 to-blue-600',
      shadow: 'shadow-blue-500/40 drop-shadow-[0_4px_12px_rgba(59,130,246,0.6)]',
      stroke: 'text-blue-900/30',
      highlight: 'from-white via-blue-200 to-blue-300',
      glow: 'shadow-[0_0_30px_rgba(59,130,246,0.5)]',
    },
    purple: {
      gradient: 'from-purple-600 via-purple-300 to-purple-600',
      shadow: 'shadow-purple-500/40 drop-shadow-[0_4px_12px_rgba(147,51,234,0.6)]',
      stroke: 'text-purple-900/30',
      highlight: 'from-white via-purple-200 to-purple-300',
      glow: 'shadow-[0_0_30px_rgba(147,51,234,0.5)]',
    },
    emerald: {
      gradient: 'from-emerald-600 via-emerald-300 to-emerald-600',
      shadow: 'shadow-emerald-500/40 drop-shadow-[0_4px_12px_rgba(16,185,129,0.6)]',
      stroke: 'text-emerald-900/30',
      highlight: 'from-white via-emerald-200 to-emerald-300',
      glow: 'shadow-[0_0_30px_rgba(16,185,129,0.5)]',
    },
  };
  
  // Size configurations
  const sizeStyles = {
    sm: 'text-lg md:text-xl',
    md: 'text-xl md:text-2xl',
    lg: 'text-2xl md:text-3xl',
    xl: 'text-3xl md:text-4xl',
    '2xl': 'text-4xl md:text-5xl lg:text-6xl',
  };

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <div className="relative group inline-block">
        {/* Background glow effect */}
        {withGlow && (
          <div className={`absolute -inset-2 bg-gradient-to-r ${themeStyles[theme].gradient} opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-700 rounded-lg ${themeStyles[theme].glow}`}></div>
        )}
        
        {/* Animated border frame */}
        <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-10 group-hover:opacity-30 transition-opacity duration-500 rounded-lg border border-current/20"></div>
        
        <motion.span
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { 
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1]
              }
            }
          }}
          whileHover={{ scale: 1.05, y: -2 }}
          className={`
            relative inline-block font-black tracking-tight z-10
            text-transparent bg-clip-text bg-gradient-to-r ${themeStyles[theme].gradient}
            ${themeStyles[theme].shadow}
            ${withGlow ? 'filter brightness-110' : ''}
            ${sizeStyles[size]}
            hover:brightness-125 transition-all duration-500
            select-none
          `}
          style={{
            WebkitTextStroke: '2px',
            WebkitTextStrokeColor: 'rgba(0,0,0,0.2)',
            textShadow: withGlow 
              ? '0 0 30px rgba(255,255,255,0.4), 2px 2px 8px rgba(0,0,0,0.5), 4px 4px 12px rgba(0,0,0,0.3)' 
              : '2px 2px 6px rgba(0,0,0,0.4), 4px 4px 10px rgba(0,0,0,0.2)'
          }}
        >
          {/* Enhanced shimmer effect overlay */}
          <motion.span
            className={`
              absolute inset-0 bg-gradient-to-r ${themeStyles[theme].highlight}
              opacity-0 mix-blend-overlay rounded-lg
            `}
            animate={{
              opacity: [0, 0.5, 0],
              x: ['-150%', '150%'],
              scaleX: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              repeatDelay: 4,
              ease: "easeInOut"
            }}
          />
          
          {/* Metallic reflection effect */}
          <motion.span
            className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)'
            }}
          />
          
          {text}
        </motion.span>
      </div>
    </div>
  );
}