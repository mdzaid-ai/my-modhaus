import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArchitecturalCanvas } from './ArchitecturalCanvas';
import { sound } from '../utils/audio';
import {
  Compass,
  MapPin,
  CheckCircle2,
  Layers,
  Sparkles,
  Maximize2,
  Eye,
  Sliders,
  Flame,
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
      scrub: 0.6, // Silky smooth scrub
      onUpdate: (self) => {
        const p = self.progress;
        setScrollProgress(p);
        onProgressUpdate(p);

        // Sound triggers for key milestones
        if (Math.abs(p - 0.42) < 0.005) sound.playDraftingScratch();
        if (Math.abs(p - 0.58) < 0.005) sound.playStructuralRumble();
        if (Math.abs(p - 0.88) < 0.005) sound.playWarmChime();

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

  const pLand = calcSubProgress(0.0, 0.08);
  const pAnalysis = calcSubProgress(0.08, 0.16);
  const pEnquiry = calcSubProgress(0.16, 0.24);
  const pDiscovery = calcSubProgress(0.24, 0.32);
  const pSiteVisit = calcSubProgress(0.32, 0.40);
  const pBlueprint = calcSubProgress(0.40, 0.48);
  const pBlueprint3D = calcSubProgress(0.48, 0.54);
  const pExcavation = calcSubProgress(0.54, 0.60);
  const pFoundation = calcSubProgress(0.60, 0.66);
  const pStructureGround = calcSubProgress(0.66, 0.72);
  const pStructureFloors = calcSubProgress(0.72, 0.78);
  const pExterior = calcSubProgress(0.78, 0.84);
  const pRawInterior = calcSubProgress(0.84, 0.88);
  const pDustTransition = calcSubProgress(0.88, 0.92);
  const pFurnishing = calcSubProgress(0.92, 0.96);
  const pFinalReveal = calcSubProgress(0.96, 1.0);

  // Background image opacities based on current progression
  const landOpacity = Math.max(0, 1 - scrollProgress * 2.5);
  const excavationOpacity =
    scrollProgress >= 0.50 && scrollProgress < 0.64
      ? Math.sin(((scrollProgress - 0.50) / 0.14) * Math.PI)
      : 0;
  const structureOpacity =
    scrollProgress >= 0.64 && scrollProgress < 0.82
      ? Math.sin(((scrollProgress - 0.64) / 0.18) * Math.PI)
      : 0;
  const rawInteriorOpacity =
    scrollProgress >= 0.82 && scrollProgress < 0.91
      ? 1 - pDustTransition
      : 0;
  const finishedInteriorOpacity =
    scrollProgress >= 0.89 && scrollProgress < 0.96
      ? pDustTransition
      : 0;
  const finalExteriorOpacity =
    scrollProgress >= 0.95
      ? Math.min((scrollProgress - 0.95) / 0.03, 1)
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

  return (
    <div
      ref={containerRef}
      id="section-journey"
      className="relative w-full bg-[#0B0B0B]"
      style={{ height: '1400vh' }} // Generous 1400vh scroll track for unhurried cinematic control
    >
      {/* Pinned Viewport Stage */}
      <div
        ref={pinRef}
        className="w-full h-screen overflow-hidden relative select-none bg-[#0B0B0B]"
      >
        {/* Layer 0: Backdrop Image Stack (Deterministic Opacities) */}
        <div className="absolute inset-0 w-full h-full">
          {/* 1. Hero Empty Land */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-300"
            style={{
              backgroundImage: `url('/assets/images/hero_empty_land.jpg')`,
              opacity: landOpacity,
              transform: `scale(${1 + scrollProgress * 0.15})`,
            }}
          />

          {/* 2. Construction Excavation */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-300"
            style={{
              backgroundImage: `url('/assets/images/construction_excavation.jpg')`,
              opacity: excavationOpacity,
              transform: `scale(${1 + pExcavation * 0.08})`,
            }}
          />

          {/* 3. Reinforced Concrete Structure */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-300"
            style={{
              backgroundImage: `url('/assets/images/construction_structure.jpg')`,
              opacity: structureOpacity,
              transform: `scale(${1 + pStructureFloors * 0.06})`,
            }}
          />

          {/* 4. Raw Unfinished Interior */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-300"
            style={{
              backgroundImage: `url('/assets/images/villa_raw_interior.jpg')`,
              opacity: rawInteriorOpacity,
              transform: `scale(${1 + pRawInterior * 0.05})`,
            }}
          />

          {/* 5. Finished Luxury Interior */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-300"
            style={{
              backgroundImage: `url('/assets/images/villa_finished_interior.jpg')`,
              opacity: finishedInteriorOpacity,
              transform: `scale(${1.05 - pFurnishing * 0.05})`,
            }}
          />

          {/* 6. Completed Golden Hour Exterior Villa */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-300"
            style={{
              backgroundImage: `url('/assets/images/villa_final_exterior.jpg')`,
              opacity: finalExteriorOpacity,
              transform: `scale(${1 + (scrollProgress - 0.95) * 0.1})`,
            }}
          />

          {/* Cinematic Vignette & Ambient Darkness */}
          <div className="absolute inset-0 cinematic-vignette opacity-80" />
        </div>

        {/* Layer 1: Three.js Interactive 3D Canvas */}
        <ArchitecturalCanvas progress={scrollProgress} phaseIndex={0} />

        {/* Layer 2: Spatial Blueprint Transformation Overlay (0.40 - 0.54) */}
        {scrollProgress >= 0.38 && scrollProgress <= 0.56 && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500"
            style={{
              opacity: pBlueprint * (1 - pBlueprint3D * 0.8),
              backgroundColor: `rgba(10, 25, 38, ${0.85 * pBlueprint})`,
            }}
          >
            <div className="relative w-11/12 max-w-5xl aspect-[16/9] border border-[#00E5FF]/40 rounded-lg p-6 drafting-grid-blueprint shadow-2xl backdrop-blur-md">
              {/* Technical Drawing SVG */}
              <svg className="w-full h-full" viewBox="0 0 1000 560" fill="none">
                {/* Title block */}
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

                {/* Wall outlines drawing tied to scroll */}
                <path
                  d="M 120 120 L 700 120 L 700 480 L 120 480 Z"
                  stroke="#00E5FF"
                  strokeWidth="2.5"
                  strokeDasharray="2320"
                  strokeDashoffset={2320 - pBlueprint * 2320}
                />
                <path
                  d="M 120 280 L 520 280 M 520 120 L 520 480"
                  stroke="#48CAE4"
                  strokeWidth="1.5"
                  strokeDasharray="800"
                  strokeDashoffset={800 - pBlueprint * 800}
                />

                {/* Living Area */}
                <rect
                  x="140"
                  y="140"
                  width="360"
                  height="120"
                  stroke="#F1EEE7"
                  strokeWidth="0.8"
                  strokeDasharray="4 4"
                  opacity={pBlueprint > 0.5 ? 0.8 : 0}
                />
                <text
                  x="260"
                  y="205"
                  fill="#F1EEE7"
                  fontSize="15"
                  fontFamily="sans-serif"
                  fontWeight="600"
                  opacity={pBlueprint > 0.6 ? 1 : 0}
                >
                  LIVING & DINING (14.2m x 7.5m)
                </text>

                {/* Master Suite */}
                <text
                  x="545"
                  y="205"
                  fill="#F1EEE7"
                  fontSize="14"
                  fontFamily="sans-serif"
                  fontWeight="600"
                  opacity={pBlueprint > 0.7 ? 1 : 0}
                >
                  MASTER SUITE (7.5m x 8.2m)
                </text>

                {/* Infinity Pool */}
                <rect
                  x="140"
                  y="320"
                  width="360"
                  height="130"
                  stroke="#00E5FF"
                  strokeWidth="1.2"
                  fill="rgba(0, 229, 255, 0.08)"
                  opacity={pBlueprint > 0.8 ? 1 : 0}
                />
                <text
                  x="270"
                  y="390"
                  fill="#00E5FF"
                  fontSize="13"
                  fontFamily="monospace"
                  opacity={pBlueprint > 0.8 ? 1 : 0}
                >
                  INFINITY POOL (18.0m x 4.0m)
                </text>
              </svg>
            </div>
          </div>
        )}

        {/* Layer 3: Volumetric Dust Storm Overlay (Stage 17) */}
        {scrollProgress >= 0.86 && scrollProgress <= 0.94 && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-150 flex items-center justify-center"
            style={{
              backgroundColor: `rgba(214, 202, 185, ${Math.sin(pDustTransition * Math.PI) * 0.7})`,
              backdropFilter: `blur(${Math.sin(pDustTransition * Math.PI) * 8}px)`,
            }}
          >
            <div
              className="text-center font-mono-tech text-xs tracking-[0.3em] uppercase text-[#0B0B0B] bg-[#F1EEE7]/90 px-6 py-2 rounded-full shadow-2xl transition-all duration-300"
              style={{
                opacity: Math.sin(pDustTransition * Math.PI),
                transform: `scale(${0.9 + Math.sin(pDustTransition * Math.PI) * 0.1})`,
              }}
            >
              TRANSITIONING — RAW CONCRETE → FINISHED LIVING
            </div>
          </div>
        )}

        {/* Layer 4: Interactive HUD Content Driven Deterministically by Scroll */}

        {/* SCENE 01: Hero / Empty Land (0.00 - 0.08) */}
        {scrollProgress < 0.10 && (
          <div
            className="absolute inset-0 flex flex-col justify-between p-8 md:p-16 pointer-events-none transition-opacity duration-300"
            style={{ opacity: 1 - scrollProgress * 10 }}
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

            {/* Huge Statement in Landscape */}
            <div className="max-w-4xl">
              <div className="font-mono-tech text-xs tracking-[0.3em] text-[#E89D42] mb-3">
                M/Y MODHAUS — PHASE 00
              </div>
              <h1 className="font-display font-black text-6xl md:text-8xl lg:text-9xl tracking-tight leading-[0.88] text-[#F1EEE7] uppercase drop-shadow-2xl">
                EVERYTHING
                <br />
                STARTS
                <br />
                WITH LAND.
              </h1>
            </div>

            {/* Bottom prompt */}
            <div className="flex items-center justify-between pb-4">
              <div className="flex items-center gap-3 font-mono-tech text-xs tracking-widest text-[#AAA7A0]">
                <div className="w-2 h-2 rounded-full bg-[#E89D42] animate-ping" />
                <span>SCROLL TO PHYSICALLY BUILD THIS HOME</span>
              </div>
              <div className="font-mono-tech text-[11px] tracking-widest text-[#AAA7A0]">
                [ 20PX SCROLL = REVERSIBLE STRUCTURAL PROGRESS ]
              </div>
            </div>
          </div>
        )}

        {/* SCENE 02: Land Analysis & Decision (0.08 - 0.16) */}
        {scrollProgress >= 0.07 && scrollProgress < 0.17 && (
          <div
            className="absolute inset-0 flex flex-col justify-between p-8 md:p-16 pointer-events-none transition-opacity duration-300"
            style={{
              opacity: pAnalysis < 0.5 ? pAnalysis * 2 : (1 - pAnalysis) * 2,
            }}
          >
            <div className="flex justify-between items-start pt-6">
              <div className="inline-flex items-center gap-2 bg-[#0B0B0B]/80 border border-[#00E5FF]/40 px-4 py-2 rounded-full backdrop-blur-md">
                <Compass size={14} className="text-[#00E5FF] animate-spin" />
                <span className="font-mono-tech text-xs tracking-wider text-[#00E5FF]">
                  NORTH-EAST ORIENTATION — OPTIMAL VASTU & SOLAR EXPOSURE
                </span>
              </div>
              <div className="font-mono-tech text-[11px] text-[#AAA7A0]">
                PLOT 42A // CAD SURVEY 2026
              </div>
            </div>

            <div className="max-w-2xl bg-[#0B0B0B]/70 p-8 rounded-2xl border border-white/10 backdrop-blur-md">
              <div className="font-mono-tech text-xs tracking-widest text-[#E89D42] mb-2 uppercase">
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

        {/* SCENE 03 & 04: Enquiry & Client Brief Gathering (0.16 - 0.24) */}
        {scrollProgress >= 0.16 && scrollProgress < 0.25 && (
          <div
            className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none transition-opacity duration-300"
            style={{
              opacity: pEnquiry < 0.5 ? pEnquiry * 2 : (1 - pEnquiry) * 2,
            }}
          >
            <div className="w-full max-w-xl bg-[#0B0B0B]/90 border border-[#E89D42]/40 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
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

        {/* SCENE 05: Property Discovery City (0.24 - 0.32) */}
        {scrollProgress >= 0.24 && scrollProgress < 0.33 && (
          <div
            className="absolute inset-0 flex flex-col justify-between p-8 md:p-16 pointer-events-none transition-opacity duration-300"
            style={{
              opacity: pDiscovery < 0.5 ? pDiscovery * 2 : (1 - pDiscovery) * 2,
            }}
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

            {/* Candidate hotspots */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono-tech text-xs">
              <div className="p-3 rounded-lg bg-black/60 border border-white/10">
                <div className="text-[10px] text-[#AAA7A0]">01 // INDIRANAGAR</div>
                <div className="text-[#F1EEE7] font-bold">LIMITED FAR</div>
              </div>
              <div className="p-3 rounded-lg bg-black/60 border border-white/10">
                <div className="text-[10px] text-[#AAA7A0]">02 // HSR LAYOUT</div>
                <div className="text-[#F1EEE7] font-bold">COMMERCIAL SPILL</div>
              </div>
              <div className="p-3 rounded-lg bg-black/60 border border-white/10">
                <div className="text-[10px] text-[#AAA7A0]">03 // WHITEFIELD</div>
                <div className="text-[#F1EEE7] font-bold">TRANSIT FRICTION</div>
              </div>
              <div className="p-3 rounded-lg bg-[#E89D42]/10 border border-[#E89D42] text-[#E89D42]">
                <div className="text-[10px]">04 // SELECTED SITE</div>
                <div className="font-bold text-[#F1EEE7]">PRIME GREEN ENCLAVE ✓</div>
              </div>
            </div>
          </div>
        )}

        {/* SCENE 06 & 07: Site Visit & Ghost Model (0.32 - 0.40) */}
        {scrollProgress >= 0.32 && scrollProgress < 0.41 && (
          <div
            className="absolute inset-0 flex flex-col justify-between p-8 md:p-16 pointer-events-none transition-opacity duration-300"
            style={{
              opacity: pSiteVisit < 0.5 ? pSiteVisit * 2 : (1 - pSiteVisit) * 2,
            }}
          >
            <div className="flex justify-between items-start">
              <div className="bg-black/70 border border-[#00E5FF]/40 px-4 py-2 rounded-full font-mono-tech text-xs text-[#00E5FF]">
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

            {/* Spatial Zones tags */}
            <div className="flex flex-wrap gap-3 font-mono-tech text-xs">
              {['ENTRY FOYER', 'PARKING (2 CARS)', 'COURTYARD GARDEN', 'DOUBLE-HEIGHT LIVING', 'MASTER TERRACE'].map((zone) => (
                <div
                  key={zone}
                  className="px-3 py-1.5 rounded-full bg-black/60 border border-white/20 text-[#F1EEE7] flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
                  <span>{zone}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SCENE 08: Land to Blueprint Transition (0.40 - 0.48) */}
        {scrollProgress >= 0.40 && scrollProgress < 0.49 && (
          <div
            className="absolute top-12 left-8 md:left-16 pointer-events-none transition-opacity duration-300 max-w-xl"
            style={{
              opacity: pBlueprint < 0.5 ? pBlueprint * 2 : (1 - pBlueprint) * 2,
            }}
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
          </div>
        )}

        {/* SCENE 09: Blueprint to 3D Model Extrusion (0.48 - 0.54) */}
        {scrollProgress >= 0.48 && scrollProgress < 0.55 && (
          <div
            className="absolute bottom-12 left-8 md:left-16 pointer-events-none transition-opacity duration-300 max-w-lg bg-[#0B0B0B]/85 border border-[#00E5FF]/40 p-6 rounded-2xl backdrop-blur-md"
            style={{
              opacity: pBlueprint3D < 0.5 ? pBlueprint3D * 2 : (1 - pBlueprint3D) * 2,
            }}
          >
            <div className="flex items-center gap-2 text-[#00E5FF] font-mono-tech text-xs mb-3">
              <CheckCircle2 size={16} />
              <span className="font-bold">MUNICIPAL & STRUCTURAL APPROVAL GRANTED</span>
            </div>
            <div className="font-display font-bold text-3xl text-[#F1EEE7] mb-2">
              DESIGN APPROVED ✓
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono-tech text-[#AAA7A0] pt-3 border-t border-white/10">
              <div>BUILT-UP AREA: <span className="text-[#F1EEE7]">4,820 SQ FT</span></div>
              <div>LEVELS: <span className="text-[#F1EEE7]">GROUND + 2</span></div>
              <div>CEILING HEIGHT: <span className="text-[#F1EEE7]">3.4 METERS</span></div>
              <div>ORIENTATION: <span className="text-[#00E5FF]">NORTH FACING</span></div>
            </div>
          </div>
        )}

        {/* SCENE 10: Excavation (0.54 - 0.60) */}
        {scrollProgress >= 0.54 && scrollProgress < 0.61 && (
          <div
            className="absolute inset-0 flex flex-col justify-between p-8 md:p-16 pointer-events-none transition-opacity duration-300"
            style={{
              opacity: pExcavation < 0.5 ? pExcavation * 2 : (1 - pExcavation) * 2,
            }}
          >
            <div className="flex justify-between items-center">
              <div className="font-mono-tech text-xs tracking-widest text-[#E89D42] uppercase">
                PHASE 01 — EARTHWORKS
              </div>
              <div className="bg-black/60 border border-white/15 px-4 py-1.5 rounded-full font-mono-tech text-xs text-[#F1EEE7]">
                EXCAVATION DEPTH: -3.2 METERS
              </div>
            </div>

            <div className="max-w-2xl bg-black/70 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
              <div className="font-mono-tech text-[10px] text-[#AAA7A0] mb-1">
                SOIL DISPLACEMENT // FOUNDATION TRENCHES
              </div>
              <h2 className="font-display font-black text-5xl md:text-6xl text-[#F1EEE7] uppercase leading-none mb-3">
                BREAKING GROUND.
              </h2>
              <p className="font-mono-tech text-xs text-[#AAA7A0]">
                Every scroll meters down the soil. Excavator clears topsoil, carves engineered footings, and exposes bedrock.
              </p>
            </div>

            <div className="flex items-center gap-4 font-mono-tech text-xs text-[#AAA7A0]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E89D42] animate-pulse" />
              <span>EARTH REMOVAL PROGRESS: {Math.floor(pExcavation * 100)}%</span>
            </div>
          </div>
        )}

        {/* SCENE 11: Foundation (0.60 - 0.66) */}
        {scrollProgress >= 0.60 && scrollProgress < 0.67 && (
          <div
            className="absolute inset-0 flex flex-col justify-between p-8 md:p-16 pointer-events-none transition-opacity duration-300"
            style={{
              opacity: pFoundation < 0.5 ? pFoundation * 2 : (1 - pFoundation) * 2,
            }}
          >
            <div className="font-mono-tech text-xs text-[#E89D42]">
              PHASE 02 // SUBSTRUCTURE
            </div>

            <div className="max-w-2xl">
              <h2 className="font-display font-black text-5xl md:text-6xl text-[#F1EEE7] uppercase leading-tight mb-2">
                STEEL & CONCRETE
                <br />
                FOUNDATION.
              </h2>
              <div className="flex flex-wrap gap-2 pt-2 font-mono-tech text-xs text-[#AAA7A0]">
                <span className="bg-black/60 px-3 py-1 rounded border border-white/10">TMT 550D REBAR</span>
                <span className="bg-black/60 px-3 py-1 rounded border border-white/10">M35 GRADE CONCRETE</span>
                <span className="bg-black/60 px-3 py-1 rounded border border-white/10">WATERPROOFING RAFT</span>
              </div>
            </div>

            <div className="font-mono-tech text-xs text-[#00E5FF]">
              ✓ FOUNDATION CURED // ANCHOR BOLTS VERIFIED
            </div>
          </div>
        )}

        {/* SCENE 12 & 13: Structure & Floor by Floor (0.66 - 0.78) */}
        {scrollProgress >= 0.66 && scrollProgress < 0.79 && (
          <div
            className="absolute inset-0 flex flex-col justify-between p-8 md:p-16 pointer-events-none transition-opacity duration-300"
            style={{
              opacity: pStructureFloors < 0.5 ? pStructureFloors * 2 : (1 - pStructureFloors) * 2,
            }}
          >
            <div className="flex justify-between items-center">
              <div className="font-mono-tech text-xs tracking-widest text-[#E89D42]">
                PHASE 03 // SUPERSTRUCTURE
              </div>
              <div className="bg-black/70 border border-white/20 px-4 py-1.5 rounded-full font-mono-tech text-xs text-[#F1EEE7]">
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
                Columns, post-tensioned slabs, and cantilevered balconies physically rise with each increment of scroll.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-md font-mono-tech text-xs bg-black/60 p-4 rounded-xl border border-white/10">
              <div>
                <div className="text-[#AAA7A0]">LEVEL 00</div>
                <div className="text-[#F1EEE7] font-bold">GROUND SLAB</div>
              </div>
              <div>
                <div className="text-[#AAA7A0]">LEVEL 01</div>
                <div className="text-[#F1EEE7] font-bold">LIVING SUITE</div>
              </div>
              <div>
                <div className="text-[#AAA7A0]">LEVEL 02</div>
                <div className="text-[#E89D42] font-bold">ROOF TERRACE</div>
              </div>
            </div>
          </div>
        )}

        {/* SCENE 14: Exterior Materials & Facade (0.78 - 0.84) */}
        {scrollProgress >= 0.78 && scrollProgress < 0.85 && (
          <div
            className="absolute inset-0 flex flex-col justify-between p-8 md:p-16 pointer-events-none transition-opacity duration-300"
            style={{
              opacity: pExterior < 0.5 ? pExterior * 2 : (1 - pExterior) * 2,
            }}
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

        {/* SCENE 15: Enter the Building (0.84 - 0.88) */}
        {scrollProgress >= 0.84 && scrollProgress < 0.89 && (
          <div
            className="absolute inset-0 flex flex-col justify-between p-8 md:p-16 pointer-events-none transition-opacity duration-300"
            style={{
              opacity: pRawInterior < 0.5 ? pRawInterior * 2 : (1 - pRawInterior) * 2,
            }}
          >
            <div className="inline-flex items-center gap-2 bg-[#8A4E39]/30 border border-[#8A4E39] px-4 py-2 rounded-full w-fit">
              <span className="w-2 h-2 rounded-full bg-[#E89D42] animate-ping" />
              <span className="font-mono-tech text-xs text-[#F1EEE7]">
                CROSSING THRESHOLD — ENTERING RAW LIVING SPACE
              </span>
            </div>

            <div className="max-w-xl bg-black/70 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
              <div className="font-mono-tech text-[10px] text-[#E89D42] mb-1">
                INTERIORS — IN PROGRESS
              </div>
              <h3 className="font-display font-bold text-3xl md:text-4xl text-[#F1EEE7] mb-2">
                EXPOSED SOUL OF THE HOME
              </h3>
              <p className="font-mono-tech text-xs text-[#AAA7A0]">
                Wiring conduit, concrete screed, and natural light framing the unfinished sanctuary.
              </p>
            </div>

            <div className="font-mono-tech text-xs text-[#AAA7A0]">
              CONTINUE SCROLLING TO TRIGGER DUST TRANSITION →
            </div>
          </div>
        )}

        {/* SCENE 16: Finished Interior & Walkthrough (0.91 - 0.96) */}
        {scrollProgress >= 0.90 && scrollProgress < 0.96 && (
          <div
            className="absolute inset-0 flex flex-col justify-between p-8 md:p-16 pointer-events-auto transition-opacity duration-300"
            style={{
              opacity: pFurnishing < 0.5 ? pFurnishing * 2 : (1 - pFurnishing) * 2,
            }}
          >
            <div className="flex justify-between items-center">
              <div className="inline-flex items-center gap-2 bg-black/80 border border-[#E89D42]/60 px-4 py-1.5 rounded-full font-mono-tech text-xs text-[#E89D42] backdrop-blur-md">
                <Sparkles size={14} />
                <span>INTERIOR COMPLETION // 3000K WARM ARCHITECTURAL LIGHTING</span>
              </div>

              {/* Interactive Room Tabs */}
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

            <div className="max-w-2xl bg-[#0B0B0B]/80 p-8 rounded-2xl border border-white/15 backdrop-blur-xl">
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

        {/* SCENE 17 & 18: Final Home Reveal & Before/After (0.96 - 1.00) */}
        {scrollProgress >= 0.95 && (
          <div
            className="absolute inset-0 flex flex-col justify-between p-8 md:p-16 pointer-events-auto transition-opacity duration-500"
            style={{
              opacity: Math.min((scrollProgress - 0.95) / 0.02, 1),
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

              {/* Slider Container */}
              <div
                className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl cursor-ew-resize select-none"
                onMouseDown={() => (isDraggingSlider.current = true)}
                onMouseUp={() => (isDraggingSlider.current = false)}
                onMouseLeave={() => (isDraggingSlider.current = false)}
                onMouseMove={handleSliderMove}
                onTouchMove={handleSliderMove}
                onClick={handleSliderMove}
              >
                {/* Background Image: Finished Golden Hour Villa */}
                <img
                  src="/assets/images/villa_final_exterior.jpg"
                  alt="Finished Luxury Villa"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Foreground Image: Empty Land (clipped by slider) */}
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

                {/* Divider Line & Handle */}
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

            {/* Handover Statement */}
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
