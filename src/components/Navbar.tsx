import React, { useState, useEffect } from 'react';
import { sound } from '../utils/audio';
import { Volume2, VolumeX, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onStartProject: () => void;
  currentStageName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onStartProject, currentStageName }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Gently reveal navigation only after visitor has read the hero statement
      const threshold = window.innerHeight * 1.2;
      setScrolled(scrollY > threshold);
      setIsScrolling(true);

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsScrolling(false);
      }, 900);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    sound.playClick(600);
  };

  const scrollToSection = (id: string) => {
    sound.playClick(900);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Nav fades slightly during rapid scrolling to let cinematic views shine, and re-appears on pause
  const opacityClass = !scrolled
    ? 'opacity-0 -translate-y-4 pointer-events-none'
    : isScrolling
    ? 'opacity-40 hover:opacity-100 translate-y-0'
    : 'opacity-100 translate-y-0';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-out px-6 md:px-12 py-5 ${opacityClass}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between backdrop-blur-md bg-[#0B0B0B]/40 border border-[#F1EEE7]/10 px-6 py-3.5 rounded-full shadow-2xl">
        {/* Brand Left */}
        <button
          onClick={() => {
            sound.playClick(800);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 text-left group"
        >
          <span className="font-display font-black text-sm tracking-wider text-[#F1EEE7] group-hover:text-[#E89D42] transition-colors">
            M/Y
          </span>
          <span className="text-[#AAA7A0] text-xs font-mono-tech">—</span>
          <span className="font-display font-bold text-xs tracking-[0.2em] text-[#F1EEE7] group-hover:text-[#E89D42] transition-colors">
            MODHAUS
          </span>
        </button>

        {/* Center Links */}
        <nav className="hidden md:flex items-center gap-8 font-mono-tech text-[11px] tracking-widest text-[#AAA7A0]">
          <button
            onClick={() => scrollToSection('section-journey')}
            className="hover:text-[#F1EEE7] transition-colors tracking-widest"
          >
            JOURNEY
          </button>
          <button
            onClick={() => scrollToSection('section-services')}
            className="hover:text-[#F1EEE7] transition-colors tracking-widest"
          >
            SERVICES
          </button>
          <button
            onClick={() => scrollToSection('section-management')}
            className="hover:text-[#F1EEE7] transition-colors tracking-widest"
          >
            MANAGEMENT
          </button>
          <button
            onClick={() => scrollToSection('section-portfolio')}
            className="hover:text-[#F1EEE7] transition-colors tracking-widest"
          >
            PORTFOLIO
          </button>
          <button
            onClick={() => scrollToSection('section-about')}
            className="hover:text-[#F1EEE7] transition-colors tracking-widest"
          >
            ABOUT
          </button>
        </nav>

        {/* Right CTA & Controls */}
        <div className="flex items-center gap-4">
          {/* Current Stage Indicator on desktop */}
          {currentStageName && (
            <div className="hidden lg:flex items-center gap-2 border-r border-[#F1EEE7]/10 pr-4 text-[10px] font-mono-tech text-[#E89D42]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E89D42] animate-pulse" />
              <span>{currentStageName}</span>
            </div>
          )}

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label="Toggle Sound"
            className="p-2 rounded-full text-[#AAA7A0] hover:text-[#F1EEE7] hover:bg-white/5 transition-all"
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          {/* Start Project CTA */}
          <button
            onClick={() => {
              sound.playClick(1000);
              onStartProject();
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#F1EEE7] text-[#0B0B0B] font-mono-tech text-[11px] font-medium tracking-wider hover:bg-[#E89D42] transition-all hover:scale-105 active:scale-95 shadow-md"
          >
            <span>START A PROJECT</span>
            <ArrowUpRight size={13} />
          </button>
        </div>
      </div>
    </header>
  );
};
