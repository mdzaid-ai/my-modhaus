import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArchitecturalCanvas } from './ArchitecturalCanvas';
import { PerformanceConfig } from '../utils/performance';
import { sound } from '../utils/audio';
import {
  Compass,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ConstructionTimelineProps {
  onProgressUpdate: (progress: number) => void;
  onTimelineComplete?: () => void;
  perfConfig: PerformanceConfig;
}

export const ConstructionTimeline: React.FC<ConstructionTimelineProps> = ({
  onProgressUpdate,
  onTimelineComplete,
  perfConfig,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  // Scroll scrub state (0 to 1)
  const [scrollProgress, setScrollProgress] = useState(0);

  // Before / After interactive slider state
  const [sliderPos, setSliderPos] = useState(50);
  const isDraggingSlider = useRef(false);

  // Active room tab for interior walkthrough
  const [activeRoom, setActiveRoom] = useState<'living' | 'kitchen' | 'master' | 'terrace'>('living');

  useEffect(() => {
    const container = containerRef.current;
    const pin = pinRef.current;
    if (!container || !pin) return;

    // Prevent mobile Safari/Chrome address bar height changes from tearing ScrollTrigger
    ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
    });

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      pin: pin,
      scrub: perfConfig.isMobile ? 0.1 : 0.4, // Instant 1:1 response on mobile for zero swipe lag
      anticipatePin: 1,
      fastScrollEnd: true,
      preventOverlaps: true,
      onUpdate: (self) => {
        const p = self.progress;
        setScrollProgress(p);
        onProgressUpdate(p);

        // Sound triggers for key milestones
        if (Math.abs(p - 0.68) < 0.005) sound.playDraftingScratch();
        if (Math.abs(p - 0.81) < 0.005) sound.playStructuralRumble();
        if (Math.abs(p - 0.94) < 0.005) sound.playWarmChime();

        if (p >= 0.99 && onTimelineComplete) {
          onTimelineComplete();
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, [onProgressUpdate, onTimelineComplete, perfConfig.isMobile, perfConfig.scrollTrackVh]);

  // Derived progress values for specific scenes (each mapped 0 to 1 inside its sub-range)
  const calcSubProgress = (start: number, end: number) => {
    if (scrollProgress < start) return 0;
    if (scrollProgress > end) return 1;
    return (scrollProgress - start) / (end - start);
  };

  const pExcavation = calcSubProgress(0.74, 0.79);
  const pFoundation = calcSubProgress(0.77, 0.82);
  const pStructureFloors = calcSubProgress(0.81, 0.87);
  const pExterior = calcSubProgress(0.87, 0.92);
  const pRawInterior = calcSubProgress(0.91, 0.94);
  const pDustTransition = calcSubProgress(0.93, 0.96);
  const pFurnishing = calcSubProgress(0.95, 0.98);

  // Background image opacities based on calibrated progression
  const landOpacity = Math.max(0, 1 - scrollProgress * 1.55);
  const excavationOpacity =
    scrollProgress >= 0.73 && scrollProgress < 0.82
      ? Math.sin(((scrollProgress - 0.73) / 0.09) * Math.PI)
      : 0;
  const structureOpacity =
    scrollProgress >= 0.81 && scrollProgress < 0.91
      ? Math.sin(((scrollProgress - 0.81) / 0.10) * Math.PI)
      : 0;
  const rawInteriorOpacity =
    scrollProgress >= 0.90 && scrollProgress < 0.95
      ? 1 - pDustTransition
      : 0;
  const finishedInteriorOpacity =
    scrollProgress >= 0.94 && scrollProgress < 0.98
      ? pDustTransition
      : 0;
  const finalExteriorOpacity =
    scrollProgress >= 0.97
      ? Math.min((scrollProgress - 0.97) / 0.02, 1)
      : 0;

  // Touch and mouse handling for Before / After comparison slider
  const handleSliderMove = (clientX: number, target: HTMLElement) => {
    const rect = target.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPos(percent);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingSlider.current && e.type !== 'click') return;
    handleSliderMove(e.clientX, e.currentTarget);
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      handleSliderMove(e.touches[0].clientX, e.currentTarget);
    }
  };

  // Helper: Reading zone opacity & stability calculation
  const getReadingZoneStyle = (enterStart: number, holdStart: number, holdEnd: number, exitEnd: number) => {
    if (scrollProgress < enterStart) return { opacity: 0, pointerEvents: 'none' as const, transform: 'translateY(12px)' };
    if (scrollProgress >= enterStart && scrollProgress < holdStart) {
      const p = (scrollProgress - enterStart) / (holdStart - enterStart);
      return { opacity: p, pointerEvents: 'none' as const, transform: `translateY(${(1 - p) * 12}px)` };
    }
    if (scrollProgress >= holdStart && scrollProgress <= holdEnd) {
      // PURE STATIONARY READING ZONE
      return { opacity: 1, pointerEvents: 'auto' as const, transform: 'translateY(0px)' };
    }
    if (scrollProgress > holdEnd && scrollProgress <= exitEnd) {
      const p = 1 - (scrollProgress - holdEnd) / (exitEnd - holdEnd);
      return { opacity: p, pointerEvents: 'none' as const, transform: `translateY(${(1 - p) * -8}px)` };
    }
    return { opacity: 0, pointerEvents: 'none' as const, transform: 'translateY(-12px)' };
  };

  // Hero sequential word reveal helpers
  const heroWord1 = Math.min(Math.max((scrollProgress - 0.015) / 0.035, 0), 1);
  const heroWord2 = Math.min(Math.max((scrollProgress - 0.045) / 0.035, 0), 1);
  const heroWord3 = Math.min(Math.max((scrollProgress - 0.075) / 0.035, 0), 1);
  const heroExit = scrollProgress > 0.17 ? Math.max(1 - (scrollProgress - 0.17) / 0.05, 0) : 1;
  const heroReadingZoneActive = scrollProgress >= 0.10 && scrollProgress <= 0.17;

  return (
    <div
      ref={containerRef}
      id="section-journey"
      className="relative w-full bg-[#0B0B0B]"
      style={{ height: `${perfConfig.scrollTrackVh}vh` }} // Adaptive: 1100vh on phone/tablet vs 2100vh on desktop
    >
      {/* Pinned Viewport Stage with 100dvh for iOS Safari address bar */}
      <div
        ref={pinRef}
        className="w-full h-screen h-[100dvh] overflow-hidden relative select-none bg-[#0B0B0B]"
      >
        {/* Layer 0: Backdrop Image Stack (Deterministic Opacities) */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          {/* 1. Hero Empty Land */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-300 will-change-transform"
            style={{
              backgroundImage: `url('/assets/images/hero_empty_land.jpg')`,
              opacity: landOpacity,
              visibility: landOpacity > 0.005 ? 'visible' : 'hidden',
              transform: `scale(${1 + scrollProgress * 0.08}) translate3d(0,0,0)`,
            }}
          />

          {/* 2. Construction Excavation */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-300 will-change-transform"
            style={{
              backgroundImage: `url('/assets/images/construction_excavation.jpg')`,
              opacity: excavationOpacity,
              visibility: excavationOpacity > 0.005 ? 'visible' : 'hidden',
              transform: `scale(${1 + pExcavation * 0.06}) translate3d(0,0,0)`,
            }}
          />

          {/* 3. Reinforced Concrete Structure */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-300 will-change-transform"
            style={{
              backgroundImage: `url('/assets/images/construction_structure.jpg')`,
              opacity: structureOpacity,
              visibility: structureOpacity > 0.005 ? 'visible' : 'hidden',
              transform: `scale(${1 + pStructureFloors * 0.05}) translate3d(0,0,0)`,
            }}
          />

          {/* 4. Raw Unfinished Interior */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-300 will-change-transform"
            style={{
              backgroundImage: `url('/assets/images/villa_raw_interior.jpg')`,
              opacity: rawInteriorOpacity,
              visibility: rawInteriorOpacity > 0.005 ? 'visible' : 'hidden',
              transform: `scale(${1 + pRawInterior * 0.04}) translate3d(0,0,0)`,
            }}
          />

          {/* 5. Finished Luxury Interior */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-300 will-change-transform"
            style={{
              backgroundImage: `url('/assets/images/villa_finished_interior.jpg')`,
              opacity: finishedInteriorOpacity,
              visibility: finishedInteriorOpacity > 0.005 ? 'visible' : 'hidden',
              transform: `scale(${1.04 - pFurnishing * 0.04}) translate3d(0,0,0)`,
            }}
          />

          {/* 6. Completed Golden Hour Exterior Villa */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-300 will-change-transform"
            style={{
              backgroundImage: `url('/assets/images/villa_final_exterior.jpg')`,
              opacity: finalExteriorOpacity,
              visibility: finalExteriorOpacity > 0.005 ? 'visible' : 'hidden',
              transform: `scale(${1 + (scrollProgress - 0.97) * 0.08}) translate3d(0,0,0)`,
            }}
          />

          {/* Deep Architectural Readability Gradient Shield */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-500"
            style={{
              background: 'radial-gradient(circle at 35% 50%, rgba(11,11,11,0.78) 0%, rgba(11,11,11,0.45) 60%, rgba(11,11,11,0.88) 100%)',
              opacity: heroReadingZoneActive ? 0.94 : 0.70,
            }}
          />
        </div>

        {/* Layer 1: Three.js Interactive 3D Canvas */}
        <ArchitecturalCanvas progress={scrollProgress} phaseIndex={0} perfConfig={perfConfig} />

        {/* Layer 2: Spatial Blueprint Transformation Overlay (0.65 - 0.74) */}
        {scrollProgress >= 0.64 && scrollProgress <= 0.76 && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500 px-4"
            style={{
              opacity: Math.sin(calcSubProgress(0.64, 0.76) * Math.PI),
              backgroundColor: 'rgba(10, 25, 38, 0.90)',
            }}
          >
            <div className="relative w-full max-w-5xl aspect-[16/9] border border-[#00E5FF]/40 rounded-lg p-3 sm:p-6 drafting-grid-blueprint shadow-2xl bg-[#0A1926]/95 md:backdrop-blur-md">
              <svg className="w-full h-full" viewBox="0 0 1000 560" fill="none">
                <rect x="740" y="420" width="240" height="120" stroke="#00E5FF" strokeWidth="1" />
                <text x="755" y="445" fill="#00E5FF" fontSize="12" fontFamily="monospace">
                  M/Y MODHAUS ARCHITECTS
                </text>
                <text x="755" y="470" fill="#F1EEE7" fontSize="14" fontFamily="sans-serif" fontWeight="bold">
                  RESIDENCE VILLA A-01
                </text>
                <text x="755" y="495" fill="#AAA7A0" fontSize="10" fontFamily="monospace">
                  GROUND FLOOR PLAN // 1:100
                </text>
                <text x="755" y="520" fill="#E89D42" fontSize="11" fontFamily="monospace">
                  STATUS: APPROVED FOR BUILD ✓
                </text>

                <path
                  d="M 120 120 L 700 120 L 700 480 L 120 480 Z"
                  stroke="#00E5FF"
                  strokeWidth="2.5"
                  strokeDasharray="2320"
                  strokeDashoffset={2320 - calcSubProgress(0.65, 0.72) * 2320}
                />
                <path
                  d="M 120 280 L 520 280 M 520 120 L 520 480"
                  stroke="#48CAE4"
                  strokeWidth="1.5"
                  strokeDasharray="800"
                  strokeDashoffset={800 - calcSubProgress(0.66, 0.73) * 800}
                />

                <text x="260" y="205" fill="#F1EEE7" fontSize="15" fontFamily="sans-serif" fontWeight="600" opacity={scrollProgress > 0.68 ? 1 : 0}>
                  LIVING & DINING (14.2m x 7.5m)
                </text>
                <text x="545" y="205" fill="#F1EEE7" fontSize="14" fontFamily="sans-serif" fontWeight="600" opacity={scrollProgress > 0.69 ? 1 : 0}>
                  MASTER SUITE (7.5m x 8.2m)
                </text>
                <rect x="140" y="320" width="360" height="130" stroke="#00E5FF" strokeWidth="1.2" fill="rgba(0, 229, 255, 0.08)" opacity={scrollProgress > 0.70 ? 1 : 0} />
                <text x="270" y="390" fill="#00E5FF" fontSize="13" fontFamily="monospace" opacity={scrollProgress > 0.70 ? 1 : 0}>
                  INFINITY POOL (18.0m x 4.0m)
                </text>
              </svg>
            </div>
          </div>
        )}

        {/* Layer 3: Volumetric Dust Storm Overlay (0.93 - 0.97) */}
        {scrollProgress >= 0.92 && scrollProgress <= 0.97 && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-150 flex items-center justify-center p-4"
            style={{
              backgroundColor: `rgba(214, 202, 185, ${Math.sin(pDustTransition * Math.PI) * (perfConfig.isMobile ? 0.6 : 0.75)})`,
              backdropFilter: perfConfig.tier === 'lightweight' ? 'none' : `blur(${Math.sin(pDustTransition * Math.PI) * 8}px)`,
            }}
          >
            <div
              className="text-center font-mono-tech text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#0B0B0B] bg-[#F1EEE7]/95 px-5 py-2 rounded-full shadow-2xl transition-all duration-300"
              style={{
                opacity: Math.sin(pDustTransition * Math.PI),
                transform: `scale(${0.92 + Math.sin(pDustTransition * Math.PI) * 0.08})`,
              }}
            >
              TRANSITIONING — RAW CONCRETE → FINISHED LIVING
            </div>
          </div>
        )}

        {/* =========================================================================
            LAYER 4: ARCHITECTURAL STATEMENTS WITH RESPONSIVE READING ZONES
            ========================================================================= */}

        {/* SCENE 01: Hero / Empty Land */}
        {scrollProgress < 0.22 && (
          <div
            className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 md:p-16 transition-all duration-300 pointer-events-none"
            style={{ opacity: heroExit }}
          >
            <div className="flex justify-between items-start pt-2 sm:pt-6">
              <div className="font-mono-tech text-[10px] sm:text-[11px] tracking-widest text-[#AAA7A0]">
                <div>BANGALORE EAST // 12.9716° N, 77.5946° E</div>
                <div className="text-[#E89D42]">ELEVATION: 920M // VIRGIN TOPOGRAPHY</div>
              </div>
              <div className="font-mono-tech text-[9px] sm:text-[10px] tracking-[0.25em] text-[#AAA7A0]/70 uppercase hidden sm:block">
                SCENE 01 — THE CANVAS
              </div>
            </div>

            {/* Sequential word reveal + stationary reading zone */}
            <div className="max-w-5xl my-auto">
              <div className="font-mono-tech text-[10px] sm:text-xs tracking-[0.3em] text-[#E89D42] mb-3">
                M/Y MODHAUS — ARCHITECTURAL ARCHIVE
              </div>

              <h1 className="font-display font-black text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight leading-[0.88] text-[#F1EEE7] uppercase drop-shadow-2xl">
                <span
                  className="block transition-all duration-500 overflow-hidden"
                  style={{
                    opacity: heroWord1,
                    transform: `translateY(${(1 - heroWord1) * 16}px)`,
                  }}
                >
                  EVERYTHING
                </span>
                <span
                  className="block transition-all duration-500 overflow-hidden"
                  style={{
                    opacity: heroWord2,
                    transform: `translateY(${(1 - heroWord2) * 16}px)`,
                  }}
                >
                  STARTS
                </span>
                <span
                  className="block transition-all duration-500 overflow-hidden"
                  style={{
                    opacity: heroWord3,
                    transform: `translateY(${(1 - heroWord3) * 16}px)`,
                  }}
                >
                  WITH LAND.
                </span>
              </h1>

              {heroReadingZoneActive && (
                <div className="mt-4 sm:mt-6 flex items-center gap-2 font-mono-tech text-[10px] sm:text-xs text-[#AAA7A0] tracking-widest animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E89D42]" />
                  <span>READING ZONE // SWIPE OR SCROLL AT YOUR PACE</span>
                </div>
              )}
            </div>

            {/* Bottom prompt */}
            <div className="flex items-center justify-between pb-2 sm:pb-4">
              <div className="flex items-center gap-2 sm:gap-3 font-mono-tech text-[10px] sm:text-xs tracking-widest text-[#AAA7A0]">
                <div className="w-2 h-2 rounded-full bg-[#E89D42] animate-ping" />
                <span>SCROLL TO PHYSICALLY BUILD THIS HOME</span>
              </div>
              <div className="font-mono-tech text-[10px] sm:text-[11px] tracking-widest text-[#AAA7A0] hidden sm:block">
                [ RESPONSIVE TIMELINE ]
              </div>
            </div>
          </div>
        )}

        {/* SCENE 02: Land Analysis & Decision */}
        {scrollProgress >= 0.21 && scrollProgress <= 0.36 && (
          <div
            className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 md:p-16 transition-all duration-300"
            style={getReadingZoneStyle(0.22, 0.27, 0.32, 0.35)}
          >
            <div className="flex justify-between items-start pt-2 sm:pt-6">
              <div className="inline-flex items-center gap-2 bg-[#0B0B0B]/95 border border-[#00E5FF]/40 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full md:backdrop-blur-md">
                <Compass size={13} className="text-[#00E5FF] animate-spin" />
                <span className="font-mono-tech text-[10px] sm:text-xs tracking-wider text-[#00E5FF]">
                  NORTH-EAST ORIENTATION — SOLAR RECEPTIVE
                </span>
              </div>
              <div className="font-mono-tech text-[10px] sm:text-[11px] text-[#AAA7A0] hidden sm:block">
                PLOT 42A // CAD SURVEY 2026
              </div>
            </div>

            <div className="max-w-2xl bg-[#0B0B0B]/95 p-5 sm:p-8 md:p-10 rounded-2xl border border-white/15 md:backdrop-blur-xl shadow-2xl">
              <div className="font-mono-tech text-[10px] sm:text-xs tracking-widest text-[#E89D42] mb-2 uppercase">
                SITE METRICS
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#F1EEE7] leading-tight mb-4">
                BEFORE A HOME EXISTS,
                <br />
                THERE'S A DECISION.
              </h2>
              <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-white/10 font-mono-tech text-[10px] sm:text-xs">
                <div>
                  <div className="text-[#AAA7A0]">BOUNDARIES</div>
                  <div className="text-sm sm:text-base font-bold text-[#F1EEE7]">60 × 40 FT</div>
                </div>
                <div>
                  <div className="text-[#AAA7A0]">PLOT AREA</div>
                  <div className="text-sm sm:text-base font-bold text-[#00E5FF]">2,400 SQ.FT</div>
                </div>
                <div>
                  <div className="text-[#AAA7A0]">ACCESS ROAD</div>
                  <div className="text-sm sm:text-base font-bold text-[#E89D42]">30 FT WIDE</div>
                </div>
              </div>
            </div>

            <div className="font-mono-tech text-[10px] sm:text-[11px] text-[#AAA7A0]">
              RESIDENTIAL ZONE R2 // APPROVED FOR G+2 STRUCTURE
            </div>
          </div>
        )}

        {/* SCENE 03: Client Enquiry & Brief Gathering */}
        {scrollProgress >= 0.34 && scrollProgress <= 0.48 && (
          <div
            className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 transition-all duration-300"
            style={getReadingZoneStyle(0.35, 0.38, 0.44, 0.47)}
          >
            <div className="w-full max-w-xl bg-[#0B0B0B]/95 border border-[#E89D42]/40 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:backdrop-blur-2xl shadow-2xl">
              <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-white/10">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E89D42] animate-pulse" />
                  <span className="font-mono-tech text-[11px] sm:text-xs tracking-widest text-[#F1EEE7]">
                    PROJECT INTAKE & BRIEF
                  </span>
                </div>
                <span className="font-mono-tech text-[9px] sm:text-[10px] text-[#AAA7A0]">MODHAUS // BLR</span>
              </div>

              <div className="py-4 sm:py-6 space-y-3 sm:space-y-4 font-mono-tech text-[11px] sm:text-xs">
                <div className="flex justify-between items-center py-1 sm:py-2 border-b border-white/5">
                  <span className="text-[#AAA7A0]">ASPIRATION</span>
                  <span className="text-[#F1EEE7] font-semibold text-right">MULTI-GEN FAMILY VILLA</span>
                </div>
                <div className="flex justify-between items-center py-1 sm:py-2 border-b border-white/5">
                  <span className="text-[#AAA7A0]">LOCATION</span>
                  <span className="text-[#E89D42] font-semibold">BANGALORE EAST PRIME</span>
                </div>
                <div className="flex justify-between items-center py-1 sm:py-2 border-b border-white/5">
                  <span className="text-[#AAA7A0]">BUDGET</span>
                  <span className="text-[#F1EEE7] font-semibold">₹2.8 — ₹3.5 CR</span>
                </div>
                <div className="flex justify-between items-center py-1 sm:py-2 border-b border-white/5">
                  <span className="text-[#AAA7A0]">SCALE</span>
                  <span className="text-[#F1EEE7] font-semibold">4 BEDROOMS + DOUBLE LIVING</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-[#AAA7A0]">AMENITIES</span>
                  <span className="text-[#00E5FF] font-semibold">COURTYARD & LAP POOL</span>
                </div>
              </div>

              <div className="pt-3 sm:pt-4 border-t border-white/10 flex items-center justify-between text-[10px] sm:text-[11px] font-mono-tech text-[#AAA7A0]">
                <span>BRIEF CONSOLIDATED</span>
                <span className="text-[#E89D42]">DISCOVERING SITES →</span>
              </div>
            </div>
          </div>
        )}

        {/* SCENE 04: Property Discovery */}
        {scrollProgress >= 0.46 && scrollProgress <= 0.59 && (
          <div
            className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 md:p-16 transition-all duration-300"
            style={getReadingZoneStyle(0.47, 0.50, 0.55, 0.58)}
          >
            <div className="font-mono-tech text-[10px] sm:text-xs tracking-widest text-[#E89D42]">
              02 / LOCATION CURATION
            </div>

            <div className="max-w-3xl">
              <h2 className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-[#F1EEE7] uppercase leading-[0.95] mb-2 sm:mb-4">
                WE DON'T SHOW
                <br />
                YOU EVERYTHING.
              </h2>
              <p className="font-display font-medium text-xl sm:text-2xl md:text-3xl text-[#AAA7A0]">
                WE SHOW YOU WHAT MAKES SENSE.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 font-mono-tech text-[10px] sm:text-xs">
              <div className="p-2 sm:p-3 rounded-lg bg-black/80 border border-white/10">
                <div className="text-[9px] text-[#AAA7A0]">01 // INDIRANAGAR</div>
                <div className="text-[#F1EEE7] font-bold">LIMITED FAR</div>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-black/80 border border-white/10">
                <div className="text-[9px] text-[#AAA7A0]">02 // HSR LAYOUT</div>
                <div className="text-[#F1EEE7] font-bold">COMMERCIAL SPILL</div>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-black/80 border border-white/10">
                <div className="text-[9px] text-[#AAA7A0]">03 // WHITEFIELD</div>
                <div className="text-[#F1EEE7] font-bold">TRANSIT FRICTION</div>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-[#E89D42]/20 border border-[#E89D42] text-[#E89D42]">
                <div className="text-[9px]">04 // SELECTED SITE</div>
                <div className="font-bold text-[#F1EEE7]">PRIME GREEN ENCLAVE ✓</div>
              </div>
            </div>
          </div>
        )}

        {/* SCENE 05: Site Visit & Ghost Model */}
        {scrollProgress >= 0.57 && scrollProgress <= 0.67 && (
          <div
            className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 md:p-16 transition-all duration-300"
            style={getReadingZoneStyle(0.58, 0.60, 0.64, 0.66)}
          >
            <div className="flex justify-between items-start">
              <div className="bg-black/90 border border-[#00E5FF]/40 px-3 sm:px-4 py-1.5 rounded-full font-mono-tech text-[10px] sm:text-xs text-[#00E5FF]">
                SITE VISIT: SILHOUETTES ON LOCATION
              </div>
              <div className="font-mono-tech text-[10px] sm:text-[11px] text-[#AAA7A0] hidden sm:block">
                GHOST WIREFRAME ACTIVE
              </div>
            </div>

            <div className="max-w-xl">
              <div className="font-mono-tech text-[10px] sm:text-xs tracking-widest text-[#E89D42] mb-1 sm:mb-2 uppercase">
                SPATIAL PROJECTION
              </div>
              <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-[#F1EEE7] uppercase leading-none">
                THE FUTURE
                <br />
                HOME GHOSTS
                <br />
                INTO REALITY.
              </h2>
            </div>

            <div className="flex flex-wrap gap-2 font-mono-tech text-[10px] sm:text-xs">
              {['ENTRY FOYER', 'PARKING', 'COURTYARD', 'DOUBLE LIVING', 'MASTER TERRACE'].map((zone) => (
                <div
                  key={zone}
                  className="px-2.5 py-1 rounded-full bg-black/80 border border-white/20 text-[#F1EEE7] flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
                  <span>{zone}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SCENE 06: Land to Blueprint ("AN IDEA BECOMES A PLAN.") */}
        {scrollProgress >= 0.65 && scrollProgress <= 0.75 && (
          <div
            className="absolute top-8 sm:top-12 left-6 sm:left-12 md:left-16 transition-all duration-300 max-w-xl"
            style={getReadingZoneStyle(0.66, 0.68, 0.72, 0.74)}
          >
            <div className="font-mono-tech text-[10px] sm:text-xs tracking-[0.25em] text-[#00E5FF] mb-2">
              03 / TECHNICAL REASONING
            </div>
            <h2 className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-[#F1EEE7] uppercase leading-[0.9]">
              AN IDEA
              <br />
              BECOMES
              <br />
              A PLAN.
            </h2>
            <div className="mt-3 sm:mt-4 flex items-center gap-2 text-[10px] sm:text-xs font-mono-tech text-[#00E5FF] bg-black/80 px-3 sm:px-4 py-1.5 rounded-lg border border-[#00E5FF]/30 w-fit">
              <CheckCircle2 size={13} />
              <span>DESIGN APPROVED ✓ // READY FOR EXCAVATION</span>
            </div>
          </div>
        )}

        {/* SCENE 07: Excavation & Substructure */}
        {scrollProgress >= 0.73 && scrollProgress <= 0.82 && (
          <div
            className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 md:p-16 transition-all duration-300 pointer-events-none"
            style={getReadingZoneStyle(0.74, 0.76, 0.79, 0.81)}
          >
            <div className="flex justify-between items-center">
              <div className="font-mono-tech text-[10px] sm:text-xs tracking-widest text-[#E89D42] uppercase">
                PHASE 01 — EARTHWORKS
              </div>
              <div className="bg-black/80 border border-white/20 px-3 sm:px-4 py-1 rounded-full font-mono-tech text-[10px] sm:text-xs text-[#F1EEE7]">
                DEPTH: -3.2M
              </div>
            </div>

            <div className="max-w-2xl bg-black/92 p-5 sm:p-6 rounded-2xl border border-white/10 md:backdrop-blur-md">
              <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-[#F1EEE7] uppercase leading-none mb-2 sm:mb-3">
                BREAKING GROUND.
              </h2>
              <p className="font-mono-tech text-[10px] sm:text-xs text-[#AAA7A0]">
                Every scroll moves the soil. Footings carved, rebar cages locked, and concrete foundation cured.
              </p>
            </div>

            <div className="font-mono-tech text-[10px] sm:text-xs text-[#00E5FF]">
              ✓ FOUNDATION CURED // ANCHOR BOLTS VERIFIED
            </div>
          </div>
        )}

        {/* SCENE 08: Superstructure ("THE STRUCTURE STANDS.") */}
        {scrollProgress >= 0.80 && scrollProgress <= 0.88 && (
          <div
            className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 md:p-16 transition-all duration-300 pointer-events-none"
            style={getReadingZoneStyle(0.81, 0.83, 0.86, 0.87)}
          >
            <div className="flex justify-between items-center">
              <div className="font-mono-tech text-[10px] sm:text-xs tracking-widest text-[#E89D42]">
                PHASE 03 // SUPERSTRUCTURE
              </div>
              <div className="bg-black/80 border border-white/20 px-3 sm:px-4 py-1 rounded-full font-mono-tech text-[10px] sm:text-xs text-[#F1EEE7]">
                ELEVATION: +11.4M
              </div>
            </div>

            <div className="max-w-3xl">
              <h2 className="font-display font-black text-4xl sm:text-6xl md:text-8xl text-[#F1EEE7] uppercase leading-[0.9] mb-3 sm:mb-4">
                THE STRUCTURE
                <br />
                STANDS.
              </h2>
              <p className="font-mono-tech text-[10px] sm:text-xs text-[#AAA7A0] max-w-lg">
                Columns, post-tensioned slabs, and cantilevered balconies physically rise with scroll.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-md font-mono-tech text-[10px] sm:text-xs bg-black/80 p-3 sm:p-4 rounded-xl border border-white/10">
              <div><div className="text-[#AAA7A0]">LEVEL 00</div><div className="text-[#F1EEE7] font-bold">GROUND SLAB</div></div>
              <div><div className="text-[#AAA7A0]">LEVEL 01</div><div className="text-[#F1EEE7] font-bold">LIVING SUITE</div></div>
              <div><div className="text-[#AAA7A0]">LEVEL 02</div><div className="text-[#E89D42] font-bold">ROOF TERRACE</div></div>
            </div>
          </div>
        )}

        {/* SCENE 09: Exterior Facade & Materials ("DETAIL CHANGES EVERYTHING.") */}
        {scrollProgress >= 0.86 && scrollProgress <= 0.93 && (
          <div
            className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 md:p-16 transition-all duration-300 pointer-events-none"
            style={getReadingZoneStyle(0.87, 0.88, 0.91, 0.92)}
          >
            <div className="font-mono-tech text-[10px] sm:text-xs tracking-widest text-[#E89D42]">
              PHASE 04 // ENVELOPE
            </div>

            <div className="max-w-2xl">
              <h2 className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-[#F1EEE7] uppercase leading-none mb-2 sm:mb-3">
                DETAIL
                <br />
                CHANGES
                <br />
                EVERYTHING.
              </h2>
              <p className="font-mono-tech text-[10px] sm:text-xs text-[#AAA7A0]">
                Travertine cladding attaches. Low-E acoustic glass panels slide into bronze frames. Vertical timber louvers install.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 sm:gap-2 font-mono-tech text-[9px] sm:text-xs text-[#F1EEE7]">
              {['BOARD-FORMED CONCRETE', 'NATURAL TEAK LOUVERS', 'DGU GLASS', 'INFINITY POOL'].map((mat) => (
                <div key={mat} className="px-2.5 py-1 bg-black/80 border border-white/15 rounded">
                  {mat}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SCENE 10 & 11: Finished Interior & Furnishing ("THE STRUCTURE BECOMES A HOME.") */}
        {scrollProgress >= 0.93 && scrollProgress <= 0.98 && (
          <div
            className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 md:p-16 transition-all duration-300 pointer-events-auto"
            style={getReadingZoneStyle(0.94, 0.95, 0.97, 0.98)}
          >
            <div className="flex justify-between items-center">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-black/95 border border-[#E89D42]/60 px-3 sm:px-4 py-1.5 rounded-full font-mono-tech text-[10px] sm:text-xs text-[#E89D42] md:backdrop-blur-md">
                <Sparkles size={13} />
                <span>INTERIOR // 3000K WARM LIGHTING</span>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 bg-black/90 p-1 rounded-full border border-white/10 md:backdrop-blur-md font-mono-tech text-xs">
                {(['living', 'kitchen', 'master', 'terrace'] as const).map((room) => (
                  <button
                    key={room}
                    onClick={() => {
                      sound.playClick(900);
                      setActiveRoom(room);
                    }}
                    className={`px-3 py-1 rounded-full transition-all uppercase tracking-wider ${
                      activeRoom === room
                        ? 'bg-[#E89D42] text-[#0B0B0B] font-bold'
                        : 'text-[#AAA7A0] hover:text-[#F1EEE7]'
                    }`}
                  >
                    {room}
                  </button>
                ))}
              </div>
            </div>

            <div className="max-w-2xl bg-[#0B0B0B]/95 p-5 sm:p-8 rounded-2xl border border-white/15 md:backdrop-blur-xl">
              <div className="font-mono-tech text-[10px] sm:text-xs text-[#E89D42] mb-1 sm:mb-2 uppercase">
                SCENE 18 // FURNISHING
              </div>
              <h2 className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-[#F1EEE7] uppercase leading-none mb-2 sm:mb-3">
                THE STRUCTURE
                <br />
                BECOMES A HOME.
              </h2>
              <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-3 border-t border-white/10 font-mono-tech text-[10px] sm:text-xs text-[#AAA7A0]">
                <div>FLOOR: <span className="text-[#F1EEE7]">ITALIAN MARBLE</span></div>
                <div>JOINERY: <span className="text-[#F1EEE7]">FLUTED OAK</span></div>
                <div>LIGHTING: <span className="text-[#E89D42]">3000K COVE</span></div>
                <div>FIREPLACE: <span className="text-[#F1EEE7]">LINEAR ETHANOL</span></div>
              </div>
            </div>

            <div className="font-mono-tech text-[10px] sm:text-xs text-[#AAA7A0]">
              SCROLL TO EXIT TOWARD SUNSET TERRACE →
            </div>
          </div>
        )}

        {/* SCENE 12: Final Home Reveal & Before / After ("FROM LAND TO LIVING.") */}
        {scrollProgress >= 0.96 && (
          <div
            className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 md:p-16 transition-opacity duration-500 pointer-events-auto"
            style={{
              opacity: Math.min((scrollProgress - 0.96) / 0.02, 1),
            }}
          >
            <div className="flex justify-between items-start">
              <div className="font-mono-tech text-[10px] sm:text-xs tracking-widest text-[#E89D42]">
                FINAL REVEAL // DAY 487 COMPLETE
              </div>
              <div className="bg-[#E89D42]/15 border border-[#E89D42] text-[#E89D42] px-3 sm:px-4 py-1 rounded-full font-mono-tech text-[10px] sm:text-xs">
                HANDOVER COMPLETE ✓
              </div>
            </div>

            {/* Middle: Interactive Before / After Slider Box */}
            <div className="self-center w-full max-w-3xl my-auto">
              <div className="text-center mb-3 sm:mb-4">
                <div className="font-mono-tech text-[9px] sm:text-[10px] tracking-[0.3em] text-[#E89D42] uppercase mb-1">
                  INTERACTIVE COMPARISON
                </div>
                <h3 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-[#F1EEE7] tracking-tight">
                  FROM LAND TO LIVING.
                </h3>
              </div>

              <div
                className="relative aspect-[16/9] w-full rounded-xl sm:rounded-2xl overflow-hidden border border-white/20 shadow-2xl cursor-ew-resize select-none touch-none"
                onMouseDown={() => (isDraggingSlider.current = true)}
                onMouseUp={() => (isDraggingSlider.current = false)}
                onMouseLeave={() => (isDraggingSlider.current = false)}
                onMouseMove={onMouseMove}
                onTouchMove={onTouchMove}
                onClick={onMouseMove}
              >
                <img
                  src="/assets/images/villa_final_exterior.jpg"
                  alt="Finished Luxury Villa"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${sliderPos}%` }}
                >
                  <img
                    src="/assets/images/hero_empty_land.jpg"
                    alt="Empty Land"
                    className="absolute inset-0 w-full h-full object-cover max-w-none"
                    style={{ width: '100%', height: '100%' }}
                  />
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-black/85 px-2.5 py-1 rounded font-mono-tech text-[9px] sm:text-[10px] text-[#AAA7A0] uppercase border border-white/10">
                    DAY 01 — EMPTY LAND
                  </div>
                </div>

                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black/85 px-2.5 py-1 rounded font-mono-tech text-[9px] sm:text-[10px] text-[#E89D42] uppercase border border-white/10">
                  DAY 487 — FINISHED VILLA
                </div>

                <div
                  className="absolute top-0 bottom-0 w-[2px] bg-[#E89D42] shadow-[0_0_12px_#E89D42]"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0B0B0B] border-2 border-[#E89D42] flex items-center justify-center text-[#E89D42] text-[10px] sm:text-xs shadow-xl">
                    ‹ ›
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10 font-mono-tech text-[10px] sm:text-xs text-[#AAA7A0]">
              <div>ONE PARTNER. FROM THE FIRST DECISION TO THE FINAL DETAIL.</div>
              <div className="flex items-center gap-1.5 text-[#F1EEE7] font-semibold">
                <span>EXPLORE MODHAUS SERVICES & MANAGEMENT</span>
                <ArrowRight size={13} className="text-[#E89D42]" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
