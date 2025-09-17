'use client';

import { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

interface PremiumHeadingProps {
  title: string;
  highlightedText?: string;
  subtitle?: string;
  size?: 'small' | 'medium' | 'large';
  alignment?: 'left' | 'center' | 'right';
  theme?: 'default' | 'blue' | 'purple' | 'emerald';
  className?: string;
}

export default function PremiumHeading({
  title,
  highlightedText,
  subtitle,
  size = 'medium',
  alignment = 'center',
  theme = 'default',
  className = '',
}: PremiumHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const controls = useAnimation();
  
  // Theme configurations
  const themeStyles = {
    default: {
      gradient: 'from-gray-300 to-white',
      border: 'border-gray-500/40',
      glow: 'shadow-white/20',
      accent: 'bg-gray-400',
    },
    blue: {
      gradient: 'from-blue-300 to-indigo-200',
      border: 'border-blue-500/40',
      glow: 'shadow-blue-500/20',
      accent: 'bg-blue-400',
    },
    purple: {
      gradient: 'from-purple-300 to-violet-200',
      border: 'border-purple-500/40',
      glow: 'shadow-purple-500/20',
      accent: 'bg-purple-400',
    },
    emerald: {
      gradient: 'from-emerald-300 to-green-200',
      border: 'border-emerald-500/40',
      glow: 'shadow-emerald-500/20',
      accent: 'bg-emerald-400',
    },
  };
  
  // Size configurations
  const sizeStyles = {
    small: {
      title: 'text-2xl md:text-3xl',
      subtitle: 'text-base',
    },
    medium: {
      title: 'text-3xl md:text-5xl',
      subtitle: 'text-lg md:text-xl',
    },
    large: {
      title: 'text-4xl md:text-6xl lg:text-7xl',
      subtitle: 'text-xl md:text-2xl',
    },
  };
  
  // Alignment configurations
  const alignmentStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  return (
    <div 
      ref={ref}
      className={`relative ${alignmentStyles[alignment]} ${className}`}
    >
      {/* Decorative elements */}
      <div className="absolute -inset-1 bg-black/50 rounded-lg blur-md z-0"></div>
      
      <motion.div
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1]
            }
          }
        }}
        className="relative z-10"
      >
        {/* Optional badge/label */}
        {subtitle && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className={`inline-flex items-center gap-2 bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-xl border ${themeStyles[theme].border} rounded-full px-6 py-3 mb-6`}
          >
            <div className={`w-2 h-2 ${themeStyles[theme].accent} rounded-full animate-pulse`}></div>
            <span className="text-gray-300 font-semibold text-sm uppercase tracking-wider">{subtitle}</span>
            <div className={`w-2 h-2 ${themeStyles[theme].accent} rounded-full animate-pulse`}></div>
          </motion.div>
        )}
        
        {/* Main heading with 3D effect */}
        <h2 
          className={`font-black mb-6 leading-tight ${sizeStyles[size].title} perspective-1000 relative`}
        >
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="inline-block text-white drop-shadow-2xl transform transition-all duration-700 hover:scale-105"
          >
            {title}{' '}
          </motion.span>
          
          {highlightedText && (
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className={`inline-block text-transparent bg-clip-text bg-gradient-to-r ${themeStyles[theme].gradient} border-l-4 ${themeStyles[theme].border} pl-4 drop-shadow-2xl transform transition-all duration-700 hover:scale-105 hover:${themeStyles[theme].glow}`}
            >
              {highlightedText}
            </motion.span>
          )}
          
          {/* Subtle glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        </h2>
      </motion.div>
    </div>
  );
}