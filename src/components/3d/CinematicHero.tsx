'use client';

import React, { useRef, useMemo, useEffect, useState, Suspense, lazy } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Float, Sparkles, OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import * as THREE from 'three';
import '@/styles/cinematic.css';

// Performance optimization: Use React.memo for components that don't need frequent re-renders
const MemoizedFloat = React.memo(Float);
// Enhanced MemoizedSparkles with custom comparison function for better performance
const MemoizedSparkles = React.memo(Sparkles, (prevProps, nextProps) => {
  // Only re-render if essential props change
  return prevProps.count === nextProps.count && 
         prevProps.size === nextProps.size && 
         prevProps.color === nextProps.color;
});

// Enhanced CSS animations for cinematic effects
const tvEffectStyles = `
  @keyframes tvStatic {
    0% { transform: translateX(0) translateY(0); }
    10% { transform: translateX(-1px) translateY(1px); }
    20% { transform: translateX(1px) translateY(-1px); }
    30% { transform: translateX(-1px) translateY(-1px); }
    40% { transform: translateX(1px) translateY(1px); }
    50% { transform: translateX(-1px) translateY(0); }
    60% { transform: translateX(1px) translateY(-1px); }
    70% { transform: translateX(-1px) translateY(1px); }
    80% { transform: translateX(1px) translateY(0); }
    90% { transform: translateX(-1px) translateY(-1px); }
    100% { transform: translateX(0) translateY(0); }
  }

  @keyframes epicGlow {
    0% { 
      filter: brightness(1.4) contrast(1.3) saturate(1.2) drop-shadow(0 0 30px rgba(96, 165, 250, 0.8)) drop-shadow(0 0 60px rgba(139, 92, 246, 0.6));
      text-shadow: 0 0 20px rgba(255, 255, 255, 0.9), 0 0 40px rgba(96, 165, 250, 0.7), 0 0 80px rgba(139, 92, 246, 0.5);
    }
    50% { 
      filter: brightness(1.8) contrast(1.5) saturate(1.4) drop-shadow(0 0 50px rgba(96, 165, 250, 1)) drop-shadow(0 0 100px rgba(139, 92, 246, 0.8));
      text-shadow: 0 0 30px rgba(255, 255, 255, 1), 0 0 60px rgba(96, 165, 250, 0.9), 0 0 120px rgba(139, 92, 246, 0.7);
    }
    100% { 
      filter: brightness(1.4) contrast(1.3) saturate(1.2) drop-shadow(0 0 30px rgba(96, 165, 250, 0.8)) drop-shadow(0 0 60px rgba(139, 92, 246, 0.6));
      text-shadow: 0 0 20px rgba(255, 255, 255, 0.9), 0 0 40px rgba(96, 165, 250, 0.7), 0 0 80px rgba(139, 92, 246, 0.5);
    }
  }

  @keyframes holographicShift {
    0% { 
      background: linear-gradient(45deg, #60a5fa, #a855f7, #ec4899, #f59e0b, #10b981, #60a5fa);
      background-size: 400% 400%;
      background-position: 0% 50%;
    }
    25% { background-position: 100% 50%; }
    50% { background-position: 100% 100%; }
    75% { background-position: 0% 100%; }
  }

  @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes purple-streak {
          0% {
            background-position: -100% 0, 0 0;
          }
          25% {
            background-position: -50% 0, 0 0;
          }
          50% {
            background-position: 50% 0, 0 0;
          }
          75% {
            background-position: 150% 0, 0 0;
          }
          100% {
            background-position: 200% 0, 0 0;
          }
        }
  }

  @keyframes matrixRain {
    0% { transform: translateY(-100vh); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(100vh); opacity: 0; }
  }

  @keyframes pulseWave {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.7; }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes energyField {
    0% { 
      box-shadow: 0 0 20px rgba(96, 165, 250, 0.5), inset 0 0 20px rgba(139, 92, 246, 0.3);
      border-color: rgba(96, 165, 250, 0.5);
    }
    50% { 
      box-shadow: 0 0 40px rgba(139, 92, 246, 0.8), inset 0 0 40px rgba(96, 165, 250, 0.5);
      border-color: rgba(139, 92, 246, 0.8);
    }
    100% { 
      box-shadow: 0 0 20px rgba(96, 165, 250, 0.5), inset 0 0 20px rgba(139, 92, 246, 0.3);
      border-color: rgba(96, 165, 250, 0.5);
    }
  }

  @keyframes quantumFloat {
    0% { transform: translateY(0px) translateX(0px); }
    25% { transform: translateY(-10px) translateX(5px); }
    50% { transform: translateY(-5px) translateX(-3px); }
    75% { transform: translateY(-15px) translateX(2px); }
    100% { transform: translateY(0px) translateX(0px); }
  }

  @keyframes dimensionalShift {
    0% { 
      transform: scale(1);
      filter: hue-rotate(0deg);
    }
    25% { 
      transform: scale(1.05);
      filter: hue-rotate(90deg);
    }
    50% { 
      transform: scale(1.1);
      filter: hue-rotate(180deg);
    }
    75% { 
      transform: scale(1.05);
      filter: hue-rotate(270deg);
    }
    100% { 
      transform: scale(1);
      filter: hue-rotate(360deg);
    }
  }

  @keyframes cosmicBreathing {
    0% { 
      transform: scale(1);
      opacity: 0.8;
      filter: brightness(1.2) contrast(1.1);
    }
    50% { 
      transform: scale(1.15);
      opacity: 1;
      filter: brightness(1.5) contrast(1.3);
    }
    100% { 
      transform: scale(1);
      opacity: 0.8;
      filter: brightness(1.2) contrast(1.1);
    }
  }

  @keyframes goldShimmer {
    0% { 
      background-position: -200% 0;
      filter: brightness(1) saturate(1);
    }
    50% { 
      background-position: 200% 0;
      filter: brightness(1.3) saturate(1.2);
    }
    100% { 
      background-position: -200% 0;
      filter: brightness(1) saturate(1);
    }
  }

  @keyframes eliteGlow {
    0% { 
      box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1);
      border-color: rgba(255, 215, 0, 0.3);
    }
    50% { 
      box-shadow: 0 0 40px rgba(255, 215, 0, 0.6), inset 0 0 40px rgba(255, 215, 0, 0.3);
      border-color: rgba(255, 215, 0, 0.6);
    }
    100% { 
      box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1);
      border-color: rgba(255, 215, 0, 0.3);
    }
  }

  @keyframes premiumFloat {
    0% { transform: translateY(0px) rotate(0deg); }
    25% { transform: translateY(-8px) rotate(1deg); }
    50% { transform: translateY(-4px) rotate(0deg); }
    75% { transform: translateY(-12px) rotate(-1deg); }
    100% { transform: translateY(0px) rotate(0deg); }
  }

  .particle-field {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(2px 2px at 20px 30px, rgba(96, 165, 250, 0.8), transparent),
      radial-gradient(2px 2px at 40px 70px, rgba(139, 92, 246, 0.6), transparent),
      radial-gradient(1px 1px at 90px 40px, rgba(236, 72, 153, 0.7), transparent),
      radial-gradient(1px 1px at 130px 80px, rgba(245, 158, 11, 0.5), transparent),
      radial-gradient(2px 2px at 160px 30px, rgba(16, 185, 129, 0.6), transparent);
    background-repeat: repeat;
    background-size: 200px 100px;
    animation: matrixRain 8s linear infinite;
  }

`;

// Removed three-nebula import to fix runtime errors

// Floating particles component - optimized with fewer particles and frame skipping
const FloatingParticles = React.memo(function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const frameCount = useRef(0);
  
  const particles = useMemo(() => {
    // Reduced from 1000 to 400 particles for better performance
    const positions = new Float32Array(400 * 3);
    for (let i = 0; i < 400; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, []);

  useFrame((state) => {
    // Performance optimization: Only update every 2 frames
    frameCount.current += 1;
    if (frameCount.current % 2 !== 0) return;
    
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.03; // Reduced rotation speed
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.01; // Reduced rotation speed
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#60a5fa"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
})

// Removed BlackHole component as requested

// Animated 3D logo with smooth entrance effect
const AnimatedLogo = () => {
  const logoRef = useRef<THREE.Group>(null);
  const [introPhase, setIntroPhase] = useState(true);
  
  useFrame((state) => {
    if (logoRef.current) {
      const time = state.clock.elapsedTime;
      
      if (time < 1) { // During the 1-second intro animation (reduced from 2 seconds)
        // Calculate progress through the intro
        const progress = time / 1; // Faster progress calculation
        
        // Smooth entrance from distance without shaking
        logoRef.current.position.z = THREE.MathUtils.lerp(30, 0, Math.min(1, progress * 2.0)); // Faster approach
        
        // Very subtle movement for elegance, not shaking
        logoRef.current.position.x = Math.sin(time * 0.8) * 0.2;
        logoRef.current.position.y = Math.cos(time * 0.6) * 0.15;
        
        // Gentle rotation for professional appearance
        logoRef.current.rotation.y = Math.sin(time * 0.5) * 0.2;
        
        // Smooth scaling without variation
        const scaleBase = THREE.MathUtils.lerp(0.5, 1.0, Math.min(1, progress * 3.0)); // Faster scaling
        logoRef.current.scale.setScalar(scaleBase);
      } else {
        // After 1 second, stabilize logo
        if (introPhase) {
          setIntroPhase(false);
        }
        
        // Gentle floating and rotation after stabilization
        logoRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
        logoRef.current.position.y = Math.sin(time * 0.8) * 0.1;
        logoRef.current.scale.setScalar(1 + Math.sin(time * 0.6) * 0.05); // Breathing effect
      }
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={logoRef}>
        {/* Ring removed as requested */}
      </group>
    </Float>
  );
};

// Simplified particle system to replace three-nebula - optimized with frame skipping
const SimpleParticleSystem = React.memo(function SimpleParticleSystem() {
  const particlesRef = useRef<THREE.Points>(null);
  const frameCount = useRef(0);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(350 * 3); // Reduced from 500 to 350 particles
    const colors = new Float32Array(350 * 3);
    
    for (let i = 0; i < 350; i++) {
      // Random spherical distribution
      const radius = 20 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Subtle white particles only
      colors[i * 3] = 0.8;
      colors[i * 3 + 1] = 0.8;
      colors[i * 3 + 2] = 0.9;
    }
    
    return { positions, colors };
  }, []);

  useFrame((state) => {
    // Performance optimization: Only update every 3 frames
    frameCount.current += 1;
    if (frameCount.current % 3 !== 0) return;
    
    if (particlesRef.current) {
      const time = state.clock.elapsedTime;
      particlesRef.current.rotation.y = time * 0.01; // Reduced rotation speed
      particlesRef.current.rotation.x = Math.sin(time * 0.05) * 0.05; // Reduced movement
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[particles.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        transparent
        opacity={0.8}
        sizeAttenuation
        vertexColors
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
})

// Optimized background stars with better performance
const BackgroundStars = React.memo(function BackgroundStars() {
  const starsRef = useRef<THREE.Points>(null);
  const frameCount = useRef(0);
  const starData = useRef<{
    originalPositions: Float32Array;
    phases: Float32Array;
  } | null>(null);
  
  const starField = useMemo(() => {
    // Reduced number of stars for better performance
    const starCount = 2000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const phases = new Float32Array(starCount);
    
    for (let i = 0; i < starCount; i++) {
      // Random spherical distribution
      const r = Math.random() * 400 + 100;
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = Math.random() * Math.PI * 2;
      
      positions[i * 3] = r * Math.sin(theta) * Math.cos(phi);
      positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = r * Math.cos(theta);
      
      // Random phase for twinkling
      phases[i] = Math.random() * Math.PI * 2;
      
      // Varied star colors
      const temp = Math.random();
      const brightness = 0.5 + Math.random() * 0.5;
      
      if (temp < 0.7) {
        // White stars
        colors[i * 3] = brightness;
        colors[i * 3 + 1] = brightness;
        colors[i * 3 + 2] = brightness;
      } else if (temp < 0.85) {
        // Slightly blue stars
        colors[i * 3] = brightness * 0.8;
        colors[i * 3 + 1] = brightness * 0.9;
        colors[i * 3 + 2] = brightness;
      } else {
        // Slightly yellow stars
        colors[i * 3] = brightness;
        colors[i * 3 + 1] = brightness * 0.9;
        colors[i * 3 + 2] = brightness * 0.7;
      }
    }
    
    starData.current = {
      originalPositions: positions.slice(),
      phases
    };
     
    return { positions, colors };
  }, []);
  
  useFrame((state) => {
    if (starsRef.current && starData.current) {
      const time = state.clock.elapsedTime;
      
      // Performance optimization: Only update positions every 2 frames
      frameCount.current += 1;
      if (frameCount.current % 2 === 0) {
        const positions = starsRef.current.geometry.attributes.position.array as Float32Array;
        const { originalPositions, phases } = starData.current;
        
        // Only update a subset of stars each frame for better performance
        const updateCount = 500; // Update 500 stars per frame
        const startIndex = (Math.floor(time) % 4) * updateCount;
        const endIndex = Math.min(startIndex + updateCount, originalPositions.length / 3);
        
        for (let i = startIndex; i < endIndex; i++) {
          const i3 = i * 3;
          const baseX = originalPositions[i3];
          const baseY = originalPositions[i3 + 1];
          const baseZ = originalPositions[i3 + 2];
          
          // Only twinkling movement - stars stay in place
          const twinkleX = Math.sin(time * 0.5 + phases[i]) * 0.3;
          const twinkleY = Math.cos(time * 0.7 + phases[i]) * 0.3;
          const twinkleZ = Math.sin(time * 0.3 + phases[i]) * 0.15;
          
          positions[i3] = baseX + twinkleX;
          positions[i3 + 1] = baseY + twinkleY;
          positions[i3 + 2] = baseZ + twinkleZ;
        }
        
        starsRef.current.geometry.attributes.position.needsUpdate = true;
      }
      
      // Gentle overall rotation - simplified
      starsRef.current.rotation.y = time * 0.001;
      if (frameCount.current % 3 === 0) {
        starsRef.current.rotation.z = Math.sin(time * 0.02) * 0.01;
      }
    }
  });
  
  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[starField.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[starField.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.8}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
})
  


// Main 3D scene with space atmosphere - optimized for performance
const Scene = React.memo(function Scene() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const frameCount = useRef(0);
  
  useFrame((state) => {
    // Performance optimization: Increment frame counter
    frameCount.current += 1;
    
    // Smooth camera movement for professional cinematic effect
    if (state.camera) {
      const time = state.clock.elapsedTime;
      
      if (time < 2) { // During intro phase: reduced from 5 seconds to 2 seconds
        // During intro phase: smooth camera movement without shaking
        const progress = time / 2;
        
        // Subtle, professional camera movement
        const smoothX = Math.sin(time * 0.3) * 0.2;
        const smoothY = Math.cos(time * 0.2) * 0.1;
        
        // Gentle forward motion - camera starts back and moves forward
        const zPosition = THREE.MathUtils.lerp(20, 15, Math.min(1, progress * 1.5)); // Faster approach
        
        // Apply camera movement
        state.camera.position.x = smoothX;
        state.camera.position.y = smoothY;
        state.camera.position.z = zPosition;
      } else {
        // Performance optimization: Only update camera position every other frame after intro
        if (frameCount.current % 2 === 0) {
          // After intro phase: gentle orbital movement
          state.camera.position.x = Math.sin(time * 0.1) * 2;
          state.camera.position.y = Math.cos(time * 0.15) * 1;
          state.camera.position.z = 12 + Math.sin(time * 0.2) * 0.5;
          state.camera.rotation.z = 0; // Reset rotation
          
          state.camera.lookAt(0, 0, 0);
        }
      }
    }
  });

  return (
    <>
      {/* Deep space background */}
      <color attach="background" args={['#000011']} />
      
      {/* Space lighting - optimized */}
      <ambientLight intensity={0.1} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.5}
        color="#60a5fa"
        castShadow={false} // Disable shadow casting for performance
      />
      <pointLight position={[-10, -10, -10]} color="#8b5cf6" intensity={0.8} />
      <pointLight position={[15, 5, 10]} color="#ec4899" intensity={0.6} />
      
      {/* Space elements - using memoized components */}
      <BackgroundStars />
      <AnimatedLogo />
      <FloatingParticles />
      <MemoizedSparkles count={150} scale={15} size={3} speed={0.6} color="#60a5fa" />
      <MemoizedSparkles count={100} scale={20} size={2} speed={0.3} color="#8b5cf6" />
    </>
  );
})

// Elite Glassmorphism UI overlay with professional typography - AI Masterclass Focus
function GlassmorphismOverlay() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
      style={{ pointerEvents: 'none' }}
    >
      <div className="text-center z-10 pointer-events-auto">
        <div
            className="backdrop-blur-xl bg-black/30 border border-amber-500/20 rounded-3xl p-8 mb-6 max-w-4xl mx-auto w-[90%] md:w-auto shadow-2xl"
            style={{ 
              opacity: 0.98,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 215, 0, 0.1), 0 0 40px rgba(255, 215, 0, 0.2)'
            }}
          >
          {/* Enhanced Star Rating System */}
          <div className="flex justify-center items-center mb-4">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="relative">
                  <svg className="w-8 h-8 text-amber-400 drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20"
                       style={{
                         filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.8))',
                         animation: `pulseWave ${2 + i * 0.2}s ease-in-out infinite`
                       }}>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-600 to-amber-300 opacity-30 rounded-full blur-sm"></div>
                </div>
              ))}
            </div>
            <span className="ml-3 text-amber-300 font-bold text-lg">5.0 Elite Rating</span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight tracking-tight"
                style={{
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, Inter, system-ui, sans-serif',
                  fontWeight: '700',
                  position: 'relative',
                  zIndex: 10,
                  background: 'linear-gradient(90deg, transparent 0%, transparent 47%, rgba(255, 215, 0, 0.3) 48%, rgba(255, 215, 0, 0.8) 49%, rgba(255, 215, 0, 1) 50%, rgba(255, 215, 0, 0.8) 51%, rgba(255, 215, 0, 0.3) 52%, transparent 53%, transparent 100%), linear-gradient(90deg, #d4af37 0%, #d4af37 50%, #ffffff 50%, #ffffff 100%)',
                  backgroundSize: '300% 100%, 100% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'purple-streak 10s ease-in-out infinite',
                  letterSpacing: '-0.025em'
                }}>
                Build Your Own Online Business with AI – From Zero to Launch
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto font-medium opacity-90">
            <span className="text-white font-semibold"
                  style={{
                    textShadow: '0 0 15px rgba(255, 215, 0, 0.6), 0 0 30px rgba(255, 215, 0, 0.4)',
                    WebkitTextStroke: '0.3px rgba(255, 215, 0, 0.2)'
                  }}>Master the complete blueprint for launching a profitable online business using AI. From concept to cash flow in record time.</span>
          </p>
          
          <div className="space-y-6">
            <Link 
              href="/ai-masterclass"
              className="group relative inline-flex items-center justify-center px-12 py-5 text-lg font-black text-black bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 rounded-2xl transition-all duration-500 transform hover:scale-110 shadow-2xl overflow-hidden"
              style={{ 
                minWidth: '320px',
                boxShadow: '0 20px 40px rgba(255, 215, 0, 0.4), 0 0 0 1px rgba(255, 215, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                fontFamily: 'Inter, system-ui, sans-serif',
                letterSpacing: '-0.02em'
              }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
              <span className="relative z-10 flex items-center">
                COMING SOON - SUBSCRIBE
                <svg className="ml-4 w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </Link>
            
            <div className="flex flex-col items-center space-y-4">
              <a href="#contact-form" className="text-amber-400 hover:text-amber-300 transition-colors duration-300 text-lg font-semibold">
                Get Free Quote Instead
              </a>

            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400 mt-8">
              <span className="flex items-center bg-black/60 backdrop-blur-sm px-5 py-3 rounded-full border border-amber-500/20 shadow-lg">
                <div className="w-3 h-3 bg-amber-400 rounded-full mr-3 animate-pulse shadow-lg"></div>
                <span className="font-semibold text-amber-200">Elite AI Training</span>
              </span>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main cinematic hero component - optimized for performance
const CinematicHero = React.memo(function CinematicHero() {
  const [canvasError, setCanvasError] = useState(false);

  // Inject TV effect animation styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = tvEffectStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  // Performance optimization: Memoize Canvas configuration
  const canvasConfig = useMemo(() => ({
    camera: { position: [0, 0, 12] as [number, number, number], fov: 60 },
    className: "absolute inset-0",
    gl: { 
      antialias: true, 
      alpha: true, 
      powerPreference: "high-performance",
      preserveDrawingBuffer: false,
      // Disable depth testing for transparent objects when not needed
      depth: true,
      // Disable stencil buffer for performance
      stencil: false
    },
    dpr: [1, 2] as [number, number],
    performance: { min: 0.5 },
    onError: () => setCanvasError(true)
  }), []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black cinematic-hero">
      {/* Enhanced fallback background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/20 to-black opacity-90"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/10 via-transparent to-pink-900/10"></div>

      
      {/* 3D Canvas Background with error handling and Suspense for code splitting */}
      {!canvasError && (
        <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950 to-black"></div>}>
          <Canvas {...canvasConfig}>
            <Scene />
          </Canvas>
        </Suspense>
      )}
      
      {/* Glassmorphism UI Overlay */}
      <GlassmorphismOverlay />
      

      
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60 pointer-events-none"></div>
    </div>
  );
});

export default CinematicHero;