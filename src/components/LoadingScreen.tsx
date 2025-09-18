'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  isLoading: boolean;
  type?: 'full' | 'transition';
  onComplete?: () => void;
}

export default function LoadingScreen({ isLoading, type = 'full', onComplete }: LoadingScreenProps) {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const fullText = 'Ventaro';

  useEffect(() => {
    if (isLoading && type === 'full') {
      // Progress animation
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 2;
        });
      }, 30);

      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setDisplayText(fullText.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          // Keep the full text visible for a moment before completing
          setTimeout(() => {
            onComplete?.();
          }, 1800);
        }
      }, 150); // Faster typing

      // Cursor blinking effect
      const cursorInterval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 400);

      return () => {
        clearInterval(typingInterval);
        clearInterval(cursorInterval);
        clearInterval(progressInterval);
      };
    } else if (type === 'transition') {
      // Quick transition effect
      setTimeout(() => {
        onComplete?.();
      }, 600);
    }
  }, [isLoading, type, onComplete]);

  if (type === 'full') {
    return (
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden"
          >
            {/* Enhanced Background Pattern */}
            <div className="absolute inset-0">
              {/* Animated grid */}
              <div className="absolute inset-0 opacity-[0.02]">
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
              </div>
              
              {/* Floating orbs */}
              <motion.div 
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div 
                className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.6, 0.3, 0.6],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
              />
              <motion.div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/3 rounded-full blur-3xl"
                animate={{
                  rotate: [0, 360],
                  scale: [0.8, 1.1, 0.8],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </div>

            {/* Main Content */}
            <div className="relative z-10 text-center max-w-md mx-auto px-6">
              {/* Enhanced Logo/Brand */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0, rotateY: -180 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-12"
              >
                <div className="relative">
                  <motion.div 
                    className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-3xl flex items-center justify-center shadow-2xl border border-gray-700/50 backdrop-blur-sm"
                    animate={{
                      boxShadow: [
                        "0 0 20px rgba(59, 130, 246, 0.1)",
                        "0 0 40px rgba(147, 51, 234, 0.2)",
                        "0 0 20px rgba(59, 130, 246, 0.1)"
                      ]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <span className="text-3xl font-bold text-white drop-shadow-lg">V</span>
                  </motion.div>
                  
                  {/* Rotating ring */}
                  <motion.div
                    className="absolute inset-0 w-24 h-24 mx-auto border-2 border-transparent border-t-blue-500/30 border-r-purple-500/30 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </div>
              </motion.div>

              {/* Enhanced Typing Animation */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
                className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight"
                style={{
                  textShadow: "0 0 30px rgba(255, 255, 255, 0.1)",
                  fontFamily: "system-ui, -apple-system, sans-serif"
                }}
              >
                {displayText}
                <motion.span 
                  className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200 text-blue-400`}
                  animate={{
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  |
                </motion.span>
              </motion.div>

              {/* Enhanced Subtitle */}
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="text-gray-400 text-xl font-light mb-8 tracking-wide"
              >
                AI-Powered Digital Solutions
              </motion.p>

              {/* Progress Bar */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="w-64 mx-auto mb-8"
              >
                <div className="h-1 bg-gray-800 rounded-full overflow-hidden border border-gray-700/50">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${loadingProgress}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </div>
                <motion.p 
                  className="text-gray-500 text-sm mt-2 font-mono"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {loadingProgress}%
                </motion.p>
              </motion.div>

              {/* Enhanced Loading Animation */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
                className="flex justify-center space-x-3"
              >
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: i % 2 === 0 ? "rgb(59, 130, 246)" : "rgb(147, 51, 234)"
                    }}
                    animate={{
                      scale: [0.8, 1.4, 0.8],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Transition loading (for page changes)
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-md pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-black/95 rounded-3xl p-8 shadow-2xl border border-gray-700/50 backdrop-blur-sm"
          >
            {/* Enhanced V logo */}
            <div className="relative mb-6">
              <motion.div 
                className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl flex items-center justify-center border border-gray-700/50 shadow-xl"
                animate={{
                  boxShadow: [
                    "0 0 15px rgba(59, 130, 246, 0.1)",
                    "0 0 25px rgba(147, 51, 234, 0.15)",
                    "0 0 15px rgba(59, 130, 246, 0.1)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <span className="text-2xl font-bold text-white drop-shadow-lg">V</span>
              </motion.div>
              
              {/* Rotating ring */}
              <motion.div
                className="absolute inset-0 w-20 h-20 mx-auto border-2 border-transparent border-t-blue-500/40 border-r-purple-500/40 rounded-2xl"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </div>
            
            {/* Enhanced spinning loader with gradient */}
            <div className="relative">
              <motion.div
                className="w-10 h-10 mx-auto border-2 border-gray-700 rounded-full relative overflow-hidden"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              >
                <div className="absolute inset-0 border-2 border-transparent border-t-blue-500 border-r-purple-500 rounded-full" />
              </motion.div>
              
              {/* Pulsing dots */}
              <motion.div
                className="flex justify-center space-x-2 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: i === 1 ? "rgb(147, 51, 234)" : "rgb(59, 130, 246)"
                    }}
                    animate={{
                      scale: [0.8, 1.2, 0.8],
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}