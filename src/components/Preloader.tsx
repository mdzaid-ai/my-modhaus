import React, { useEffect, useState, useRef } from 'react';
import { sound } from '../utils/audio';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'drawing' | 'collapsing' | 'logo' | 'flythrough' | 'done'>('drawing');
  const [stageName, setStageName] = useState('LAND');
  const requestRef = useRef<number>();

  useEffect(() => {
    let current = 0;
    const startTime = performance.now();
    const duration = 2800; // 2.8s smooth architectural sequence

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      // Smooth architectural cubic easing
      current = Math.floor(rawProgress * 100);
      setProgress(current);

      if (current < 25) setStageName('01 / LAND');
      else if (current < 45) setStageName('02 / PLAN');
      else if (current < 65) setStageName('03 / BUILD');
      else if (current < 85) setStageName('04 / DESIGN');
      else setStageName('05 / LIVE');

      if (rawProgress < 1) {
        requestRef.current = requestAnimationFrame(tick);
      } else {
        // Trigger collapse into logo
        setPhase('collapsing');
        sound.playStructuralRumble();
        setTimeout(() => {
          setPhase('logo');
          sound.playWarmChime();
          setTimeout(() => {
            setPhase('flythrough');
            setTimeout(() => {
              setPhase('done');
              onComplete();
            }, 800);
          }, 1100);
        }, 500);
      }
    };

    requestRef.current = requestAnimationFrame(tick);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [onComplete]);

  if (phase === 'done') return null;

  const isFlythrough = phase === 'flythrough';
  const isLogo = phase === 'logo' || phase === 'flythrough';
  const isCollapsing = phase === 'collapsing';

  return (
    <div
      className={`fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-[#0B0B0B] text-[#F1EEE7] transition-all duration-700 select-none ${
        isFlythrough ? 'opacity-0 scale-150 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background drafting grid */}
      <div className="absolute inset-0 drafting-grid opacity-30 pointer-events-none" />

      {/* Main architectural graphic canvas / SVG */}
      <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center">
        {!isLogo && (
          <svg
            className={`w-full h-full transition-all duration-500 ${
              isCollapsing ? 'scale-0 opacity-20' : 'scale-100 opacity-100'
            }`}
            viewBox="0 0 400 400"
            fill="none"
          >
            {/* Center architectural origin crosshair */}
            <line x1="200" y1="180" x2="200" y2="220" stroke="#F1EEE7" strokeWidth="0.75" opacity="0.6" />
            <line x1="180" y1="200" x2="220" y2="200" stroke="#F1EEE7" strokeWidth="0.75" opacity="0.6" />
            <circle cx="200" cy="200" r="2" fill="#E89D42" />

            {/* Stage 1: Perimeter bounds (0 - 25%) */}
            <rect
              x="80"
              y="80"
              width="240"
              height="240"
              stroke="#F1EEE7"
              strokeWidth="1.2"
              strokeDasharray="960"
              strokeDashoffset={960 - (Math.min(progress, 25) / 25) * 960}
              className="transition-all duration-75"
            />

            {/* Stage 2: Inner architectural partition walls (25 - 45%) */}
            {progress >= 25 && (
              <>
                <line
                  x1="80"
                  y1="190"
                  x2="320"
                  y2="190"
                  stroke="#AAA7A0"
                  strokeWidth="1"
                  strokeDasharray="240"
                  strokeDashoffset={240 - (Math.min(Math.max(progress - 25, 0), 20) / 20) * 240}
                />
                <line
                  x1="220"
                  y1="80"
                  x2="220"
                  y2="320"
                  stroke="#AAA7A0"
                  strokeWidth="1"
                  strokeDasharray="240"
                  strokeDashoffset={240 - (Math.min(Math.max(progress - 25, 0), 20) / 20) * 240}
                />
              </>
            )}

            {/* Stage 3: Columns & structural nodes (45 - 65%) */}
            {progress >= 45 && (
              <g className="transition-opacity duration-300">
                <rect x="76" y="76" width="8" height="8" fill="#F1EEE7" />
                <rect x="316" y="76" width="8" height="8" fill="#F1EEE7" />
                <rect x="76" y="316" width="8" height="8" fill="#F1EEE7" />
                <rect x="316" y="316" width="8" height="8" fill="#F1EEE7" />
                <rect x="216" y="186" width="8" height="8" fill="#E89D42" />
                <rect x="216" y="76" width="8" height="8" fill="#F1EEE7" />
                <rect x="76" y="186" width="8" height="8" fill="#F1EEE7" />
              </g>
            )}

            {/* Stage 4: Living zones & door arcs (65 - 85%) */}
            {progress >= 65 && (
              <g className="transition-opacity duration-300" stroke="#00E5FF" strokeWidth="0.8">
                <path d="M 120 190 A 40 40 0 0 1 160 230" fill="none" strokeDasharray="3 3" />
                <path d="M 220 130 A 30 30 0 0 1 250 160" fill="none" strokeDasharray="3 3" />
                <rect x="100" y="220" width="70" height="50" stroke="#E89D42" strokeWidth="0.6" strokeDasharray="2 2" fill="none" />
                <text x="108" y="248" fill="#AAA7A0" fontSize="8" fontFamily="monospace">LIVING</text>
                <text x="240" y="130" fill="#AAA7A0" fontSize="8" fontFamily="monospace">SUITE</text>
              </g>
            )}

            {/* Stage 5: Final technical coordinates (85 - 100%) */}
            {progress >= 85 && (
              <g fill="#F1EEE7" opacity="0.8" fontSize="7" fontFamily="monospace">
                <text x="85" y="72">PLOT 04A // 2400 SQ.FT</text>
                <text x="235" y="335">12.9716° N, 77.5946° E</text>
              </g>
            )}
          </svg>
        )}

        {/* Logo Reveal Phase: M/Y MODHAUS */}
        {isLogo && (
          <div className="flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="font-display font-black text-6xl sm:text-7xl tracking-tighter text-[#F1EEE7] mb-2 flex items-center">
              <span>M</span>
              <span className="text-[#E89D42] mx-1">/</span>
              <span>Y</span>
            </div>
            <div className="font-display font-bold text-2xl sm:text-3xl tracking-[0.3em] text-[#F1EEE7]">
              MODHAUS
            </div>
            <div className="mt-3 text-[10px] sm:text-[11px] font-mono-tech tracking-[0.25em] text-[#AAA7A0] uppercase">
              REAL ESTATE / CONSTRUCTION / INTERIORS / MANAGEMENT
            </div>
          </div>
        )}
      </div>

      {/* Bottom Technical HUD */}
      <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between font-mono-tech text-xs tracking-widest text-[#AAA7A0]">
        <div>
          <div className="text-[10px] text-[#E89D42] mb-1">ARCHITECTURE TIMELINE</div>
          <div className="text-[#F1EEE7] font-semibold">{stageName}</div>
        </div>

        <div className="text-right">
          <div className="text-[10px] text-[#AAA7A0] mb-1">STATUS</div>
          <div className="text-xl font-bold font-display text-[#F1EEE7]">
            {progress} <span className="text-[#E89D42] text-sm">%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
