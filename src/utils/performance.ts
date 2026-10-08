import { useState, useEffect } from 'react';

export type PerformanceTier = 'high' | 'standard' | 'lightweight';

export interface PerformanceConfig {
  tier: PerformanceTier;
  dpr: number;
  particleCount: number;
  isMobile: boolean;
  isTouch: boolean;
  prefersReducedMotion: boolean;
  scrollTrackVh: number; // Adaptive scroll distance: shorter on mobile
  enableShadows: boolean;
  enableComplex3D: boolean;
}

// Detect hardware and browser capabilities
export function detectInitialTier(): PerformanceConfig {
  const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Check hardware hints
  const nav = typeof navigator !== 'undefined' ? (navigator as unknown as { deviceMemory?: number; hardwareConcurrency?: number }) : {};
  const lowCores = (nav.hardwareConcurrency || 8) <= 4;
  const lowMemory = (nav.deviceMemory || 8) <= 4;
  const isWeakDevice = isMobile && (lowCores || lowMemory);

  let tier: PerformanceTier = 'standard'; // DEFAULT standard for mid-range Android & normal laptops
  if (prefersReducedMotion || isWeakDevice) {
    tier = 'lightweight';
  } else if (!isMobile && (nav.hardwareConcurrency || 8) >= 8 && (nav.deviceMemory || 8) >= 8) {
    tier = 'high';
  }

  // Strict DPR caps to prevent GPU melt on 3x-4x mobile OLED displays
  const rawDpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  const dpr = isMobile ? Math.min(rawDpr, 1.2) : tier === 'high' ? Math.min(rawDpr, 1.75) : Math.min(rawDpr, 1.25);

  const particleCount = tier === 'high' ? 1000 : tier === 'standard' ? 320 : 60;
  // Shorter, natural swipe distance on mobile (1100vh vs 2100vh on desktop)
  const scrollTrackVh = isMobile ? 1100 : 2100;

  return {
    tier,
    dpr,
    particleCount,
    isMobile,
    isTouch,
    prefersReducedMotion,
    scrollTrackVh,
    enableShadows: tier === 'high',
    enableComplex3D: tier !== 'lightweight',
  };
}

// Global reactive performance monitor hook with silent auto-degradation
export function usePerformanceTier(): PerformanceConfig {
  const [config, setConfig] = useState<PerformanceConfig>(detectInitialTier);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let lowFpsCount = 0;
    let rafId: number;

    const checkFps = (time: number) => {
      frameCount++;
      const elapsed = time - lastTime;

      // Sample every 1.5 seconds
      if (elapsed >= 1500) {
        const fps = (frameCount * 1000) / elapsed;
        frameCount = 0;
        lastTime = time;

        // If FPS drops below 32 consistently, silently step down performance tier
        if (fps < 32) {
          lowFpsCount++;
          if (lowFpsCount >= 2) {
            setConfig((prev) => {
              if (prev.tier === 'high') {
                return {
                  ...prev,
                  tier: 'standard',
                  dpr: Math.min(prev.dpr, 1.25),
                  particleCount: 280,
                  enableShadows: false,
                };
              } else if (prev.tier === 'standard') {
                return {
                  ...prev,
                  tier: 'lightweight',
                  dpr: 1.0,
                  particleCount: 50,
                  enableShadows: false,
                  enableComplex3D: false,
                };
              }
              return prev;
            });
            lowFpsCount = 0; // reset
          }
        } else {
          lowFpsCount = Math.max(0, lowFpsCount - 1);
        }
      }

      rafId = requestAnimationFrame(checkFps);
    };

    rafId = requestAnimationFrame(checkFps);

    // Resize listener to re-evaluate mobile breakpoint
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setConfig((prev) => ({
        ...prev,
        isMobile,
        scrollTrackVh: isMobile ? 1100 : 2100,
        dpr: isMobile ? Math.min(window.devicePixelRatio, 1.2) : prev.dpr,
      }));
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return config;
}
