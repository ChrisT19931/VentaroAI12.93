'use client';

import { useEffect } from 'react';

/**
 * Mobile Optimizer Component
 * Ensures optimal mobile experience with touch-friendly interactions,
 * proper viewport handling, and performance optimizations
 */
export default function MobileOptimizer() {
  useEffect(() => {
    // Prevent zoom on input focus (iOS Safari)
    const preventZoom = () => {
      const viewport = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
      }
    };

    // Add touch-friendly classes to interactive elements
    const optimizeInteractiveElements = () => {
      const buttons = document.querySelectorAll<HTMLElement>('button, a[role="button"], .button');
      const inputs = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('input, textarea, select');
      const links = document.querySelectorAll<HTMLAnchorElement>('a');

      // Optimize buttons
      buttons.forEach(button => {
        button.classList.add('tap-target');
        // Add touch feedback
        button.addEventListener('touchstart', () => {
          button.style.transform = 'scale(0.98)';
        });
        button.addEventListener('touchend', () => {
          button.style.transform = 'scale(1)';
        });
      });

      // Optimize form inputs
      inputs.forEach(input => {
        input.addEventListener('focus', () => {
          // Scroll input into view on mobile
          if (window.innerWidth <= 768) {
            setTimeout(() => {
              input.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
          }
        });
      });

      // Optimize links
      links.forEach(link => {
        if (!link.classList.contains('no-tap-highlight')) {
          (link.style as any).webkitTapHighlightColor = 'rgba(0, 0, 0, 0.1)';
        }
      });
    };

    // Handle orientation changes
    const handleOrientationChange = () => {
      // Force viewport recalculation
      setTimeout(() => {
        window.scrollTo(0, window.scrollY);
      }, 500);
    };

    // Optimize scroll performance
    const optimizeScrolling = () => {
      let ticking = false;
      
      const updateScrollPosition = () => {
        // Add scroll-based optimizations here
        ticking = false;
      };

      const requestTick = () => {
        if (!ticking) {
          requestAnimationFrame(updateScrollPosition);
          ticking = true;
        }
      };

      window.addEventListener('scroll', requestTick, { passive: true });
      
      return () => {
        window.removeEventListener('scroll', requestTick);
      };
    };

    // Detect and handle mobile-specific features
    const handleMobileFeatures = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);

      if (isMobile) {
        document.body.classList.add('mobile-device');
      }
      if (isIOS) {
        document.body.classList.add('ios-device');
        // Handle iOS-specific optimizations
        preventZoom();
      }
      if (isAndroid) {
        document.body.classList.add('android-device');
      }
    };

    // Initialize optimizations
    handleMobileFeatures();
    optimizeInteractiveElements();
    const cleanupScroll = optimizeScrolling();

    // Event listeners
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    // Cleanup
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
      if (cleanupScroll) cleanupScroll();
    };
  }, []);

  return null; // This component doesn't render anything
}

// CSS-in-JS styles for mobile optimization
export const mobileOptimizationStyles = `
  /* Mobile-specific optimizations */
  .mobile-device {
    -webkit-overflow-scrolling: touch;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
  }
  
  .ios-device {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
  }
  
  .android-device {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0.2);
  }
  
  /* Touch-friendly form elements */
  @media (max-width: 768px) {
    input[type="text"],
    input[type="email"],
    input[type="password"],
    input[type="tel"],
    textarea,
    select {
      font-size: 16px !important; /* Prevents zoom on iOS */
      border-radius: 8px;
      border: 2px solid #e5e7eb;
      transition: border-color 0.2s ease;
    }
    
    input:focus,
    textarea:focus,
    select:focus {
      border-color: #3b82f6;
      outline: none;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    /* Touch-friendly buttons */
    button,
    .button,
    a[role="button"] {
      min-height: 48px;
      min-width: 48px;
      border-radius: 8px;
      font-weight: 500;
      transition: all 0.2s ease;
      -webkit-tap-highlight-color: transparent;
    }
    
    button:active,
    .button:active {
      transform: scale(0.98);
    }
    
    /* Modal optimizations for mobile */
    .modal-overlay {
      padding: 16px;
    }
    
    .modal-content {
      max-height: calc(100vh - 32px);
      overflow-y: auto;
      border-radius: 12px;
    }
    
    /* Navigation optimizations */
    .mobile-menu {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.95);
      backdrop-filter: blur(10px);
      z-index: 9999;
    }
    
    /* Form validation messages */
    .error-message {
      font-size: 14px;
      margin-top: 4px;
      color: #ef4444;
    }
    
    /* Loading states */
    .loading-button {
      position: relative;
      color: transparent;
    }
    
    .loading-button::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 20px;
      height: 20px;
      margin: -10px 0 0 -10px;
      border: 2px solid #ffffff;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  }
  
  /* Accessibility improvements */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
  
  /* High contrast mode support */
  @media (prefers-contrast: high) {
    button,
    .button {
      border: 2px solid currentColor;
    }
    
    input,
    textarea,
    select {
      border: 2px solid currentColor;
    }
  }
`;