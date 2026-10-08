import React, { useState } from 'react';
import { sound } from '../utils/audio';

interface DisciplineMarker {
  id: string;
  name: string;
  lead: string;
  role: string;
  xPercent: number; // coordinate relative to team photo
  yPercent: number;
}

const DISCIPLINES: DisciplineMarker[] = [
  {
    id: 'arch',
    name: 'ARCHITECTURE & MASTERPLANNING',
    lead: 'Vikramaditya Sengupta',
    role: 'Principal Architectural Director',
    xPercent: 18,
    yPercent: 45,
  },
  {
    id: 'structural',
    name: 'STRUCTURAL ENGINEERING',
    lead: 'Priya Narayanan, M.Eng',
    role: 'Lead Seismic & Concrete Engineer',
    xPercent: 32,
    yPercent: 50,
  },
  {
    id: 'civil',
    name: 'CONSTRUCTION & CIVIL OPS',
    lead: 'Marcus Vance',
    role: 'Managing Partner — Site Execution',
    xPercent: 48,
    yPercent: 42,
  },
  {
    id: 'interiors',
    name: 'INTERIOR ARCHITECTURE',
    lead: 'Ananya Deshmukh',
    role: 'Head of Haute Interior Design',
    xPercent: 62,
    yPercent: 46,
  },
  {
    id: 'management',
    name: 'PROJECT MANAGEMENT & MEP',
    lead: 'Devika Pillai',
    role: 'Director of Operations & Compliance',
    xPercent: 78,
    yPercent: 50,
  },
  {
    id: 'capital',
    name: 'ESTATE ADVISORY & CLIENT CARE',
    lead: 'Armaan Khurana',
    role: 'Partner — Acquisitions & Handover',
    xPercent: 90,
    yPercent: 44,
  },
];

export const CompanyPhilosophy: React.FC = () => {
  const [activeDiscipline, setActiveDiscipline] = useState<DisciplineMarker | null>(null);

  return (
    <section id="section-about" className="relative w-full bg-[#0B0B0B] text-[#F1EEE7] overflow-hidden">
      {/* 1. Architectural Scale & Numbers Section */}
      <div className="relative py-28 md:py-36 px-6 md:px-12 max-w-7xl mx-auto border-b border-white/10">
        <div className="font-mono-tech text-xs tracking-[0.3em] text-[#E89D42] uppercase mb-4">
          CUMULATIVE MAGNITUDE // 2026 AUDIT
        </div>
        <h2 className="font-display font-black text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[0.9] text-[#F1EEE7] uppercase mb-16">
          VOLUME
          <br />
          UNDER MANAGEMENT.
        </h2>

        {/* Spatial Virtual Grid Metric Plane */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="relative p-8 rounded-2xl bg-[#121212] border border-white/10 overflow-hidden group hover:border-[#E89D42] transition-colors">
            <div className="font-display font-black text-7xl md:text-8xl text-[#F1EEE7] leading-none mb-3 group-hover:text-[#E89D42] transition-colors">
              36
            </div>
            <div className="font-mono-tech text-xs font-bold tracking-widest text-[#AAA7A0] uppercase mb-1">
              COMPLETED PROJECTS
            </div>
            <p className="font-mono-tech text-[10px] text-[#666]">
              Zero defect structural sign-offs from foundations to turnkey occupancy.
            </p>
          </div>

          <div className="relative p-8 rounded-2xl bg-[#121212] border border-white/10 overflow-hidden group hover:border-[#E89D42] transition-colors">
            <div className="font-display font-black text-7xl md:text-8xl text-[#F1EEE7] leading-none mb-3 group-hover:text-[#E89D42] transition-colors">
              480<span className="text-4xl text-[#E89D42]">K+</span>
            </div>
            <div className="font-mono-tech text-xs font-bold tracking-widest text-[#AAA7A0] uppercase mb-1">
              SQ FT DEVELOPED
            </div>
            <p className="font-mono-tech text-[10px] text-[#666]">
              Engineered floorplates, residential sanctuaries, and architectural commercial pavilions.
            </p>
          </div>

          <div className="relative p-8 rounded-2xl bg-[#121212] border border-white/10 overflow-hidden group hover:border-[#E89D42] transition-colors">
            <div className="font-display font-black text-7xl md:text-8xl text-[#F1EEE7] leading-none mb-3 group-hover:text-[#E89D42] transition-colors">
              14
            </div>
            <div className="font-mono-tech text-xs font-bold tracking-widest text-[#AAA7A0] uppercase mb-1">
              ACTIVE SITES
            </div>
            <p className="font-mono-tech text-[10px] text-[#666]">
              Live ongoing projects progressing daily across prime Bangalore and surrounding hills.
            </p>
          </div>

          <div className="relative p-8 rounded-2xl bg-[#121212] border border-[#E89D42]/40 overflow-hidden group hover:border-[#E89D42] transition-colors bg-[#E89D42]/5">
            <div className="font-display font-black text-7xl md:text-8xl text-[#E89D42] leading-none mb-3">
              01
            </div>
            <div className="font-mono-tech text-xs font-bold tracking-widest text-[#F1EEE7] uppercase mb-1">
              UNIFIED TEAM
            </div>
            <p className="font-mono-tech text-[10px] text-[#AAA7A0]">
              From the virgin soil survey to concierge living. One singular standard.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Philosophy Blackout Statement */}
      <div className="relative py-40 md:py-56 px-6 md:px-12 max-w-5xl mx-auto text-center flex flex-col items-center justify-center border-b border-white/10">
        <span className="font-mono-tech text-xs md:text-sm tracking-[0.35em] text-[#AAA7A0] uppercase mb-10">
          Why do we do all of this?
        </span>

        <h2 className="font-display font-black text-6xl md:text-8xl lg:text-9xl tracking-tight leading-[0.88] text-[#F1EEE7] uppercase mb-8">
          BECAUSE
          <br />
          A BUILDING
          <br />
          ISN'T THE PROJECT.
        </h2>

        <div className="w-16 h-[1px] bg-[#E89D42] my-8" />

        <h3 className="font-display font-bold text-4xl md:text-6xl text-[#E89D42] uppercase tracking-tight">
          THE LIFE INSIDE IT IS.
        </h3>
      </div>

      {/* 3. Editorial Team Presentation */}
      <div className="relative py-28 md:py-36 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="font-mono-tech text-xs tracking-[0.3em] text-[#E89D42] uppercase mb-2">
              THE COLLECTIVE
            </div>
            <h2 className="font-display font-black text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[0.9] text-[#F1EEE7] uppercase">
              DIFFERENT DISCIPLINES.
              <br />
              ONE STANDARD.
            </h2>
          </div>
          <p className="font-mono-tech text-xs text-[#AAA7A0] max-w-xs">
            Hover team figures to reveal specialized discipline leadership.
          </p>
        </div>

        {/* Editorial Full-Width Team Photography */}
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-[#141414]">
          <img
            src="/assets/images/team_editorial.jpg"
            alt="M/Y MODHAUS Architectural Team"
            className="w-full h-full object-cover filter contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent opacity-80" />

          {/* Interactive Discipline Hotspot Pins */}
          {DISCIPLINES.map((d) => (
            <button
              key={d.id}
              onClick={() => {
                sound.playClick(900);
                setActiveDiscipline(d);
              }}
              onMouseEnter={() => {
                sound.playClick(700);
                setActiveDiscipline(d);
              }}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${d.xPercent}%`, top: `${d.yPercent}%` }}
              aria-label={`Inspect ${d.name}`}
            >
              <div className="w-4 h-4 rounded-full bg-[#E89D42] border-2 border-[#0B0B0B] shadow-[0_0_12px_#E89D42] group-hover:scale-150 transition-transform flex items-center justify-center">
                <span className="w-1 h-1 rounded-full bg-[#0B0B0B]" />
              </div>
            </button>
          ))}

          {/* Floating Discipline Bio Card */}
          {activeDiscipline && (
            <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 bg-[#0B0B0B]/95 border border-[#E89D42] rounded-2xl p-6 backdrop-blur-xl shadow-2xl animate-in fade-in duration-200">
              <div className="font-mono-tech text-[10px] text-[#E89D42] uppercase tracking-wider mb-1">
                {activeDiscipline.name}
              </div>
              <div className="font-display font-bold text-xl text-[#F1EEE7] mb-1">
                {activeDiscipline.lead}
              </div>
              <div className="font-mono-tech text-xs text-[#AAA7A0]">
                {activeDiscipline.role}
              </div>
            </div>
          )}
        </div>

        {/* Discipline Badges Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 font-mono-tech text-xs">
          {DISCIPLINES.map((d) => (
            <button
              key={d.id}
              onClick={() => {
                sound.playClick(800);
                setActiveDiscipline(d);
              }}
              className={`p-3 rounded-xl border text-left transition-all ${
                activeDiscipline?.id === d.id
                  ? 'bg-[#E89D42] text-[#0B0B0B] border-[#E89D42] font-bold'
                  : 'bg-white/5 text-[#AAA7A0] border-white/10 hover:border-white/30'
              }`}
            >
              <div className="text-[10px] opacity-70 mb-1">DISCIPLINE</div>
              <div className="text-[11px] truncate uppercase">{d.name.split(' ')[0]}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
