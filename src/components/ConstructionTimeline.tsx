import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArchitecturalCanvas } from './ArchitecturalCanvas';
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
}

export const ConstructionTimeline: React.FC<ConstructionTimelineProps> = ({
  onProgressUpdate,
  onTimelineComplete,
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

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      pin: pin,
      scrub: 0.5, // Crisp, responsive scrubbing with 0 lag
      onUpdate: (self) => {
        const p = self.progress;
        setScrollProgress(p);
        onProgressUpdate(p);

        // Sound triggers for key milestones
        if (Math.abs(p - 0.68) < 0.004) sound.playDraftingScratch();
        if (Math.abs(p - 0.81) < 0.004) sound.playStructuralRumble();
        if (Math.abs(p - 0.94) < 0.004) sound.playWarmChime();

        if (p >= 0.99 && onTimelineComplete) {
          onTimelineComplete();
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, [onProgressUpdate, onTimelineComplete]);

  // Derived progress values for specific scenes (each mapped 0 to 1 inside its sub-range)
  const calcSubProgress = (start: number, end: number) => {
    if (scrollProgress < start) return 0;
    if (scrollProgress > end) return 1;
    return (scrollProgress - start) / (end - start);
  };

  // Pacing calibration: 0 to ~0.60 dedicated to calm, confident introduction and planning
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

  // Handle Before / After mouse drag
  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDraggingSlider.current && e.type !== 'click') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPos(percent);
  };

  // Helper: Reading zone opacity & stability calculation
  // Returns { opacity: 0-1, isStationary: boolean }
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
      style={{ height: '2200vh' }} // Expansive 2200vh scroll runway for calm, deliberate pacing
    >
      {/* Pinned Viewport Stage */}
      <div
        ref={pinRef}
        className="w-full h-screen overflow-hidden relative select-none bg-[#0B0B0B]"
      >
        {/* Layer 0: Backdrop Image Stack (Deterministic Opacities) */}
        <div className="absolute inset-0 w-full h-full">
          {/* 1. Hero Empty Land (Extremely slow, dignified push-in) */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
            style={{
              backgroundImage: `url('/assets/images/hero_empty_land.jpg')`,
              opacity: landOpacity,
              transform: `scale(${1 + scrollProgress * 0.08})`,
            }}
          />

          {/* 2. Construction Excavation */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-300"
            style={{
              backgroundImage: `url('/assets/images/construction_excavation.jpg')`,
              opacity: excavationOpacity,
              transform: `scale(${1 + pExcavation * 0.06})`,
            }}
          />

          {/* 3. Reinforced Concrete Structure */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-300"
            style={{
              backgroundImage: `url('/assets/images/construction_structure.jpg')`,
              opacity: structureOpacity,
              transform: `scale(${1 + pStructureFloors * 0.05})`,
            }}
          />

          {/* 4. Raw Unfinished Interior */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-300"
            style={{
              backgroundImage: `url('/assets/images/villa_raw_interior.jpg')`,
              opacity: rawInteriorOpacity,
              transform: `scale(${1 + pRawInterior * 0.04})`,
            }}
          />

          {/* 5. Finished Luxury Interior */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-300"
            style={{
              backgroundImage: `url('/assets/images/villa_finished_interior.jpg')`,
              opacity: finishedInteriorOpacity,
              transform: `scale(${1.04 - pFurnishing * 0.04})`,
            }}
          />

          {/* 6. Completed Golden Hour Exterior Villa */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-300"
            style={{
              backgroundImage: `url('/assets/images/villa_final_exterior.jpg')`,
              opacity: finalExteriorOpacity,
              transform: `scale(${1 + (scrollProgress - 0.97) * 0.08})`,
            }}
          />

          {/* Deep Architectural Readability Gradient Shield */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-500"
            style={{
              background: 'radial-gradient(circle at 35% 50%, rgba(11,11,11,0.72) 0%, rgba(11,11,11,0.4) 60%, rgba(11,11,11,0.85) 100%)',
              opacity: heroReadingZoneActive ? 0.92 : 0.65,
            }}
          />
        </div>

        {/* Layer 1: Three.js Interactive 3D Canvas */}
        <ArchitecturalCanvas progress={scrollProgress} phaseIndex={0} />

        {/* Layer 2: Spatial Blueprint Transformation Overlay (0.65 - 0.74) */}
        {scrollProgress >= 0.64 && scrollProgress <= 0.76 && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500"
            style={{
              opacity: Math.sin(calcSubProgress(0.64, 0.76) * Math.PI),
              backgroundColor: 'rgba(10, 25, 38, 0.88)',
            }}
          >
            <div className="relative w-11/12 max-w-5xl aspect-[16/9] border border-[#00E5FF]/40 rounded-lg p-6 drafting-grid-blueprint shadow-2xl backdrop-blur-md">
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
            className="absolute inset-0 pointer-events-none transition-opacity duration-150 flex items-center justify-center"
            style={{
              backgroundColor: `rgba(214, 202, 185, ${Math.sin(pDustTransition * Math.PI) * 0.75})`,
              backdropFilter: `blur(${Math.sin(pDustTransition * Math.PI) * 10}px)`,
            }}
          >
            <div
              className="text-center font-mono-tech text-xs tracking-[0.3em] uppercase text-[#0B0B0B] bg-[#F1EEE7]/95 px-6 py-2 rounded-full shadow-2xl transition-all duration-300"
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
            LAYER 4: ARCHITECTURAL STATEMENTS WITH DEDICATED READING ZONES
            ========================================================================= */}

        {/* SCENE 01: Hero / Empty Land (0.00 – 0.22, with Reading Zone 0.10 – 0.17) */}
        {scrollProgress < 0.22 && (
          <div
            className="absolute inset-0 flex flex-col justify-between p-8 md:p-16 transition-all duration-300 pointer-events-none"
            style={{ opacity: heroExit }}
          >
            <div className="flex justify-between items-start pt-6">
              <div className="font-mono-tech text-[11px] tracking-widest text-[#AAA7A0]">
                <div>BANGALORE EAST // 12.9716° N, 77.5946° E</div>
                <div className="text-[#E89D42]">ELEVATION: 920M // VIRGIN TOPOGRAPHY</div>
              </div>
              <div className="font-mono-tech text-[10px] tracking-[0.25em] text-[#AAA7A0]/70 uppercase">
                SCENE 01 — THE CANVAS
              </div>
            </div>

            {/* Sequential word reveal + stationary reading zone */}
            <div className="max-w-5xl my-auto">
              <div className="font-mono-tech text-xs tracking-[0.3em] text-[#E89D42] mb-4">
                M/Y MODHAUS — ARCHITECTURAL ARCHIVE
              </div>

              <h1 className="font-display font-black text-6xl md:text-8xl lg:text-9xl tracking-tight leading-[0.88] text-[#F1EEE7] uppercase drop-shadow-2xl">
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
                <div className="mt-6 flex items-center gap-2 font-mono-tech text-xs text-[#AAA7A0] tracking-widest animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E89D42]" />
                  <span>READING ZONE // SCROLL AT YOUR OWN PACE TO EXPLORE</span>
                </div>
              )}
            </div>

            {/* Bottom prompt */}
            <div className="flex items-center justify-between pb-4">
              <div className="flex items-center gap-3 font-mono-tech text-xs tracking-widest text-[#AAA7A0]">
                <div className="w-2 h-2 rounded-full bg-[#E89D42] animate-ping" />
                <span>SCROLL TO PHYSICALLY BUILD THIS HOME</span>
              </div>
              <div className="font-mono-tech text-[11px] tracking-widest text-[#AAA7A0]">
                [ CONTROLLED & UNHURRIED PACING ]
              </div>
            </div>
          </div>
        )}

        {/* SCENE 02: Land Analysis & Decision (0.22 – 0.35, Reading Zone 0.27 – 0.32) */}
        {scrollProgress >= 0.21 && scrollProgress <= 0.36 && (
          <div
            className="absolute inset-0 flex flex-col justify-between p-8 md:p-16 transition-all duration-300"
            style={getReadingZoneStyle(0.22, 0.27, 0.32, 0.35)}
          >
            <div className="flex justify-between items-start pt-6">
              <div className="inline-flex items-center gap-2 bg-[#0B0B0B]/85 border border-[#00E5FF]/40 px-4 py-2 rounded-full backdrop-blur-md">
                <Compass size={14} className="text-[#00E5FF] animate-spin" />
                <span className="font-mono-tech text-xs tracking-wider text-[#00E5FF]">
                  NORTH-EAST ORIENTATION — OPTIMAL SOLAR RECEPTIVITY
                </span>
              </div>
              <div className="font-mono-tech text-[11px] text-[#AAA7A0]">
                PLOT 42A // CAD SURVEY 2026
              </div>
            </div>

            <div className="max-w-2xl bg-[#0B0B0B]/85 p-8 md:p-10 rounded-2xl border border-white/15 backdrop-blur-xl shadow-2xl">
              <div className="font-mono-tech text-xs tracking-widest text-[#E89D42] mb-3 uppercase">
                SITE METRICS
              </div>
              <h2 className="font-display font-bold text-4xl md:text-5xl text-[#F1EEE7] leading-tight mb-4">
                BEFORE A HOME EXISTS,
                <br />
                THERE'S A DECISION.
              </h2>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 font-mono-tech text-xs">
                <div>
                  <div className="text-[#AAA7A0]">BOUNDARIES</div>
                  <div className="text-base font-bold text-[#F1EEE7]">60 FT × 40 FT</div>
                </div>
                <div>
                  <div className="text-[#AAA7A0]">PLOT AREA</div>
                  <div className="text-base font-bold text-[#00E5FF]">2,400 SQ.FT</div>
                </div>
                <div>
                  <div className="text-[#AAA7A0]">ACCESS ROAD</div>
                  <div className="text-base font-bold text-[#E89D42]">30 FT WIDE</div>
                </div>
              </div>
            </div>

            <div className="font-mono-tech text-[11px] text-[#AAA7A0]">
              RESIDENTIAL ZONE R2 // APPROVED FOR G+2 STRUCTURE
            </div>
          </div>
        )}

        {/* SCENE 03: Client Enquiry & Brief Gathering (0.35 – 0.47, Reading Zone 0.38 – 0.44) */}
        {scrollProgress >= 0.34 && scrollProgress <= 0.48 && (
          <div
            className="absolute inset-0 flex items-center justify-center p-6 transition-all duration-300"
            style={getReadingZoneStyle(0.35, 0.38, 0.44, 0.47)}
          >
            <div className="w-full max-w-xl bg-[#0B0B0B]/95 border border-[#E89D42]/40 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl">
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#E89D42] animate-pulse" />
                  <span className="font-mono-tech text-xs tracking-widest text-[#F1EEE7]">
                    PROJECT INTAKE & BRIEF
                  </span>
                </div>
                <span className="font-mono-tech text-[10px] text-[#AAA7A0]">MODHAUS OFFICE // BLR</span>
              </div>

              <div className="py-6 space-y-4 font-mono-tech text-xs">
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-[#AAA7A0]">CLIENT ASPIRATION</span>
                  <span className="text-[#F1EEE7] font-semibold">BESPOKE MULTI-GEN FAMILY VILLA</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-[#AAA7A0]">TARGET LOCATION</span>
                  <span className="text-[#E89D42] font-semibold">BANGALORE EAST PRIME</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-[#AAA7A0]">BUDGET ENVELOPE</span>
                  <span className="text-[#F1EEE7] font-semibold">₹2.8 — ₹3.5 CRORES</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-[#AAA7A0]">SCALE</span>
                  <span className="text-[#F1EEE7] font-semibold">4 BEDROOMS + DOUBLE-HEIGHT LIVING</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-[#AAA7A0]">AMENITIES</span>
                  <span className="text-[#00E5FF] font-semibold">PRIVATE COURTYARD & LAP POOL</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono-tech text-[#AAA7A0]">
                <span>ARCHITECTURAL BRIEF CONSOLIDATED</span>
                <span className="text-[#E89D42]">DISCOVERING SITES →</span>
              </div>
            </div>
          </div>
        )}

        {/* SCENE 04: Property Discovery (0.47 – 0.58, Reading Zone 0.50 – 0.56) */}
        {scrollProgress >= 0.46 && scrollProgress <= 0.59 && (
          <div
            className="absolute inset-0 flex flex-col justify-between p-8 md:p-16 transition-all duration-300"
            style={getReadingZoneStyle(0.47, 0.50, 0.55, 0.58)}
          >
            <div className="font-mono-tech text-xs tracking-widest text-[#E89D42]">
              02 / LOCATION CURATION
            </div>

            <div className="max-w-3xl">
              <h2 className="font-display font-black text-5xl md:text-7xl text-[#F1EEE7] uppercase leading-[0.95] mb-4">
                WE DON'T SHOW
                <br />
                YOU EVERYTHING.
              </h2>
              <p className="font-display font-medium text-2xl md:text-3xl text-[#AAA7A0]">
                WE SHOW YOU WHAT MAKES SENSE.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono-tech text-xs">
              <div className="p-3 rounded-lg bg-black/70 border border-white/10">
                <div className="text-[10px] text-[#AAA7A0]">01 // INDIRANAGAR</div>
                <div className="text-[#F1EEE7] font-bold">LIMITED FAR</div>
              </div>
              <div className="p-3 rounded-lg bg-black/70 border border-white/10">
                <div className="text-[10px] text-[#AAA7A0]">02 // HSR LAYOUT</div>
                <div className="text-[#F1EEE7] font-bold">COMMERCIAL SPILL</div>
              </div>
              <div className="p-3 rounded-lg bg-black/70 border border-white/10">
                <div className="text-[10px] text-[#AAA7A0]">03 // WHITEFIELD</div>
                <div className="text-[#F1EEE7] font-bold">TRANSIT FRICTION</div>
              </div>
              <div className="p-3 rounded-lg bg-[#E89D42]/15 border border-[#E89D42] text-[#E89D42]">
                <div className="text-[10px]">04 // SELECTED SITE</div>
                <div className="font-bold text-[#F1EEE7]">PRIME GREEN ENCLAVE ✓</div>
              </div>
            </div>
          </div>
        )}

        {/* SCENE 05: Site Visit & Ghost Model (0.58 – 0.66) */}
        {scrollProgress >= 0.57 && scrollProgress <= 0.67 && (
          <div
            className="absolute inset-0 flex flex-col justify-between p-8 md:p-16 transition-all duration-300"
            style={getReadingZoneStyle(0.58, 0.60, 0.64, 0.66)}
          >
            <div className="flex justify-between items-start">
              <div className="bg-black/80 border border-[#00E5FF]/40 px-4 py-2 rounded-full font-mono-tech text-xs text-[#00E5FF]">
                SITE VISIT: ARCHITECTURAL SILHOUETTES ON LOCATION
              </div>
              <div className="font-mono-tech text-[11px] text-[#AAA7A0]">
                GHOST WIREFRAME OVERLAY ACTIVE
              </div>
            </div>

            <div className="max-w-xl">
              <div className="font-mono-tech text-xs tracking-widest text-[#E89D42] mb-2 uppercase">
                SPATIAL PROJECTION
              </div>
              <h2 className="font-display font-black text-5xl md:text-6xl text-[#F1EEE7] uppercase leading-none">
                THE FUTURE
                <br />
                HOME GHOSTS
                <br />
                INTO REALITY.
              </h2>
            </div>

            <div className="flex flex-wrap gap-3 font-mono-tech text-xs">
              {['ENTRY FOYER', 'PARKING (2 CARS)', 'COURTYARD GARDEN', 'DOUBLE-HEIGHT LIVING', 'MASTER TERRACE'].map((zone) => (
                <div
                  key={zone}
                  className="px-3 py-1.5 rounded-full bg-black/70 border border-white/20 text-[#F1EEE7] flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
                  <span>{zone}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SCENE 06: Land to Blueprint & 3D Extrusion ("AN IDEA BECOMES A PLAN.") (0.66 – 0.74, Reading Zone 0.68 – 0.72) */}
        {scrollProgress >= 0.65 && scrollProgress <= 0.75 && (
          <div
            className="absolute top-12 left-8 md:left-16 transition-all duration-300 max-w-xl"
            style={getReadingZoneStyle(0.66, 0.68, 0.72, 0.74)}
          >
            <div className="font-mono-tech text-xs tracking-[0.25em] text-[#00E5FF] mb-2">
              03 / TECHNICAL REASONING
            </div>
            <h2 className="font-display font-black text-6xl md:text-7xl text-[#F1EEE7] uppercase leading-[0.9]">
              AN IDEA
              <br />
              BECOMES
              <br />
              A PLAN.
            </h2>
            <div className="mt-4 flex items-center gap-2 text-xs font-mono-tech text-[#00E5FF] bg-black/70 px-4 py-2 rounded-lg border border-[#00E5FF]/30 w-fit">
              <CheckCircle2 size={14} />
              <span>DESIGN APPROVED ✓ // READY FOR EXCAVATION</span>
            </div>
          </div>
        )}

        {/* SCENE 07: Excavation & Substructure (0.74 – 0.81) */}
        {scrollProgress >= 0.73 && scrollProgress <= 0.82 && (
          <div
            className="absolute inset-0 flex flex-col justify-between p-8 md:p-16 transition-all duration-300 pointer-events-none"
            style={getReadingZoneStyle(0.74, 0.76, 0.79, 0.81)}
          >
            <div className="flex justify-between items-center">
              <div className="font-mono-tech text-xs tracking-widest text-[#E89D42] uppercase">
                PHASE 01 — EARTHWORKS & FOUNDATION
              </div>
              <div className="bg-black/70 border border-white/20 px-4 py-1.5 rounded-full font-mono-tech text-xs text-[#F1EEE7]">
                EXCAVATION DEPTH: -3.2 METERS
              </div>
            </div>

            <div className="max-w-2xl bg-black/80 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
              <h2 className="font-display font-black text-5xl md:text-6xl text-[#F1EEE7] uppercase leading-none mb-3">
                BREAKING GROUND.
              </h2>
              <p className="font-mono-tech text-xs text-[#AAA7A0]">
                Every scroll moves the soil. Footings carved, rebar cages locked, and concrete foundation cured.
              </p>
            </div>

            <div className="font-mono-tech text-xs text-[#00E5FF]">
              ✓ FOUNDATION CURED // ANCHOR BOLTS VERIFIED
            </div>
          </div>
        )}

        {/* SCENE 08: Superstructure ("THE STRUCTURE STANDS.") (0.81 – 0.87, Reading Zone 0.83 – 0.86) */}
        {scrollProgress >= 0.80 && scrollProgress <= 0.88 && (
          <div
            className="absolute inset-0 flex flex-col justify-between p-8 md:p-16 transition-all duration-300 pointer-events-none"
            style={getReadingZoneStyle(0.81, 0.83, 0.86, 0.87)}
          >
            <div className="flex justify-between items-center">
              <div className="font-mono-tech text-xs tracking-widest text-[#E89D42]">
                PHASE 03 // SUPERSTRUCTURE
              </div>
              <div className="bg-black/80 border border-white/20 px-4 py-1.5 rounded-full font-mono-tech text-xs text-[#F1EEE7]">
                HEIGHT ELEVATION: +11.4M
              </div>
            </div>

            <div className="max-w-3xl">
              <h2 className="font-display font-black text-6xl md:text-8xl text-[#F1EEE7] uppercase leading-[0.9] mb-4">
                THE STRUCTURE
                <br />
                STANDS.
              </h2>
              <p className="font-mono-tech text-xs text-[#AAA7A0] max-w-lg">
                Columns, post-tensioned slabs, and cantilevered balconies physically rise with scroll.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-md font-mono-tech text-xs bg-black/70 p-4 rounded-xl border border-white/10">
              <div><div className="text-[#AAA7A0]">LEVEL 00</div><div className="text-[#F1EEE7] font-bold">GROUND SLAB</div></div>
              <div><div className="text-[#AAA7A0]">LEVEL 01</div><div className="text-[#F1EEE7] font-bold">LIVING SUITE</div></div>
              <div><div className="text-[#AAA7A0]">LEVEL 02</div><div className="text-[#E89D42] font-bold">ROOF TERRACE</div></div>
            </div>
          </div>
        )}

        {/* SCENE 09: Exterior Facade & Materials ("DETAIL CHANGES EVERYTHING.") (0.87 – 0.92, Reading Zone 0.88 – 0.91) */}
        {scrollProgress >= 0.86 && scrollProgress <= 0.93 && (
          <div
            className="absolute inset-0 flex flex-col justify-between p-8 md:p-16 transition-all duration-300 pointer-events-none"
            style={getReadingZoneStyle(0.87, 0.88, 0.91, 0.92)}
          >
            <div className="font-mono-tech text-xs tracking-widest text-[#E89D42]">
              PHASE 04 // BUILDING ENVELOPE
            </div>

            <div className="max-w-2xl">
              <h2 className="font-display font-black text-6xl md:text-7xl text-[#F1EEE7] uppercase leading-none mb-3">
                DETAIL
                <br />
                CHANGES
                <br />
                EVERYTHING.
              </h2>
              <p className="font-mono-tech text-xs text-[#AAA7A0]">
                Travertine cladding attaches. Low-E acoustic glass panels slide into bronze frames. Vertical timber louvers install.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 font-mono-tech text-xs text-[#F1EEE7]">
              {['BOARD-FORMED CONCRETE', 'NATURAL TEAK LOUVERS', 'FLOOR-TO-CEILING DGU GLASS', 'SLATE INFINITY POOL'].map((mat) => (
                <div key={mat} className="px-3 py-1 bg-black/70 border border-white/15 rounded">
                  {mat}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SCENE 10 & 11: Finished Interior & Furnishing ("THE STRUCTURE BECOMES A HOME.") (0.94 – 0.98, Reading Zone 0.95 – 0.97) */}
        {scrollProgress >= 0.93 && scrollProgress <= 0.98 && (
          <div
            className="absolute inset-0 flex flex-col justify-between p-8 md:p-16 transition-all duration-300 pointer-events-auto"
            style={getReadingZoneStyle(0.94, 0.95, 0.97, 0.98)}
          >
            <div className="flex justify-between items-center">
              <div className="inline-flex items-center gap-2 bg-black/85 border border-[#E89D42]/60 px-4 py-1.5 rounded-full font-mono-tech text-xs text-[#E89D42] backdrop-blur-md">
                <Sparkles size={14} />
                <span>INTERIOR COMPLETION // 3000K WARM ARCHITECTURAL LIGHTING</span>
              </div>

              <div className="hidden sm:flex items-center gap-2 bg-black/70 p-1 rounded-full border border-white/10 backdrop-blur-md font-mono-tech text-xs">
                {(['living', 'kitchen', 'master', 'terrace'] as const).map((room) => (
                  <button
                    key={room}
                    onClick={() => {
                      sound.playClick(900);
                      setActiveRoom(room);
                    }}
                    className={`px-4 py-1 rounded-full transition-all uppercase tracking-wider ${
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

            <div className="max-w-2xl bg-[#0B0B0B]/85 p-8 rounded-2xl border border-white/15 backdrop-blur-xl">
              <div className="font-mono-tech text-xs text-[#E89D42] mb-2 uppercase">
                SCENE 18 // FURNISHING
              </div>
              <h2 className="font-display font-black text-5xl md:text-6xl text-[#F1EEE7] uppercase leading-none mb-3">
                THE STRUCTURE
                <br />
                BECOMES A HOME.
              </h2>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 font-mono-tech text-xs text-[#AAA7A0]">
                <div>FLOOR: <span className="text-[#F1EEE7]">ITALIAN MARBLE</span></div>
                <div>JOINERY: <span className="text-[#F1EEE7]">FLUTED OAK</span></div>
                <div>LIGHTING: <span className="text-[#E89D42]">3000K AMBIENT COVE</span></div>
                <div>FIREPLACE: <span className="text-[#F1EEE7]">LINEAR ETHANOL</span></div>
              </div>
            </div>

            <div className="font-mono-tech text-xs text-[#AAA7A0]">
              SCROLL TO EXIT TOWARD SUNSET TERRACE →
            </div>
          </div>
        )}

        {/* SCENE 12: Final Home Reveal & Before / After ("FROM LAND TO LIVING.") (0.97 – 1.00) */}
        {scrollProgress >= 0.96 && (
          <div
            className="absolute inset-0 flex flex-col justify-between p-8 md:p-16 transition-opacity duration-500 pointer-events-auto"
            style={{
              opacity: Math.min((scrollProgress - 0.96) / 0.02, 1),
            }}
          >
            <div className="flex justify-between items-start">
              <div className="font-mono-tech text-xs tracking-widest text-[#E89D42]">
                FINAL REVEAL // DAY 487 COMPLETE
              </div>
              <div className="bg-[#E89D42]/10 border border-[#E89D42] text-[#E89D42] px-4 py-1.5 rounded-full font-mono-tech text-xs">
                HANDOVER COMPLETE ✓
              </div>
            </div>

            {/* Middle: Interactive Before / After Slider Box */}
            <div className="self-center w-full max-w-3xl my-auto">
              <div className="text-center mb-4">
                <div className="font-mono-tech text-[10px] tracking-[0.3em] text-[#E89D42] uppercase mb-1">
                  INTERACTIVE COMPARISON
                </div>
                <h3 className="font-display font-bold text-3xl md:text-4xl text-[#F1EEE7] tracking-tight">
                  FROM LAND TO LIVING.
                </h3>
              </div>

              <div
                className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl cursor-ew-resize select-none"
                onMouseDown={() => (isDraggingSlider.current = true)}
                onMouseUp={() => (isDraggingSlider.current = false)}
                onMouseLeave={() => (isDraggingSlider.current = false)}
                onMouseMove={handleSliderMove}
                onTouchMove={handleSliderMove}
                onClick={handleSliderMove}
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
                  <div className="absolute top-4 left-4 bg-black/80 px-3 py-1 rounded font-mono-tech text-[10px] text-[#AAA7A0] uppercase border border-white/10">
                    DAY 01 — EMPTY LAND
                  </div>
                </div>

                <div className="absolute top-4 right-4 bg-black/80 px-3 py-1 rounded font-mono-tech text-[10px] text-[#E89D42] uppercase border border-white/10">
                  DAY 487 — FINISHED VILLA
                </div>

                <div
                  className="absolute top-0 bottom-0 w-[2px] bg-[#E89D42] shadow-[0_0_12px_#E89D42]"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#0B0B0B] border-2 border-[#E89D42] flex items-center justify-center text-[#E89D42] text-xs shadow-xl">
                    ‹ ›
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10 font-mono-tech text-xs text-[#AAA7A0]">
              <div>ONE PARTNER. FROM THE FIRST DECISION TO THE FINAL DETAIL.</div>
              <div className="flex items-center gap-2 text-[#F1EEE7] font-semibold">
                <span>EXPLORE MODHAUS SERVICES & MANAGEMENT</span>
                <ArrowRight size={14} className="text-[#E89D42]" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
