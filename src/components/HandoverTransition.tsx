import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sound } from '../utils/audio';

gsap.registerPlugin(ScrollTrigger);

export const HandoverTransition: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const keyLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const keyLine = keyLineRef.current;
    if (!section || !keyLine) return;

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      scrub: 0.5,
      onEnter: () => {
        sound.playWarmChime();
      },
      onUpdate: (self) => {
        // Line expands horizontally across the viewport
        const scaleX = Math.min(self.progress * 1.5, 1);
        if (keyLine) {
          keyLine.style.transform = `scaleX(${scaleX})`;
        }
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-28 md:py-36 bg-[#0B0B0B] text-[#F1EEE7] overflow-hidden flex flex-col items-center justify-center"
    >
      {/* Background key photography asset */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <img
          src="/assets/images/handover_key.jpg"
          alt="Architectural Key Handover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0B] via-transparent to-[#0B0B0B]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6">
        <div className="inline-flex items-center gap-2 font-mono-tech text-xs tracking-[0.3em] text-[#E89D42] uppercase bg-[#E89D42]/10 border border-[#E89D42]/30 px-4 py-1.5 rounded-full">
          <span>PROJECT COMPLETED</span>
          <span>//</span>
          <span>DAY 487</span>
        </div>

        <h2 className="font-display font-black text-6xl md:text-8xl tracking-tight text-[#F1EEE7] uppercase leading-none">
          WELCOME
          <br />
          HOME.
        </h2>

        <p className="font-mono-tech text-xs md:text-sm text-[#AAA7A0] max-w-md mx-auto pt-2">
          From the virgin soil to the turning of the key. One vision, executed without compromise.
        </p>

        {/* The rotating key silhouette & horizontal transforming razor edge */}
        <div className="pt-16 pb-4 w-full flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border border-[#E89D42] flex items-center justify-center text-[#E89D42] mb-6 animate-pulse">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
            </svg>
          </div>

          {/* Laser-crisp dividing line that expands from the key edge to divide into Act 2 */}
          <div
            ref={keyLineRef}
            className="w-full max-w-5xl h-[1px] bg-gradient-to-r from-transparent via-[#E89D42] to-transparent origin-center transition-transform duration-75"
            style={{ transform: 'scaleX(0.2)' }}
          />
        </div>
      </div>
    </section>
  );
};
