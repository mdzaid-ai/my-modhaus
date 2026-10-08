import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface PropertyType {
  id: string;
  name: string;
  subtitle: string;
  areaRange: string;
  image: string;
  location: string;
  details: string;
}

const PROPERTY_TYPES: PropertyType[] = [
  {
    id: 'villas',
    name: 'PRIVATE VILLAS',
    subtitle: 'Brutalist sanctuaries carved into dramatic terrain with private reflection pools.',
    areaRange: '4,500 — 12,000 SQ FT',
    image: '/assets/images/villa_final_exterior.jpg',
    location: 'BANGALORE EAST & NANDI HILLS',
    details: 'Full concrete cast walls, cantilevers, solar energy integration, and landscaped private courtyards.',
  },
  {
    id: 'apartments',
    name: 'CURATED RESIDENCES',
    subtitle: 'Single-floor boutique luxury penthouses with 360-degree skyline vistas.',
    areaRange: '3,200 — 6,800 SQ FT',
    image: '/assets/images/construction_structure.jpg',
    location: 'INDIRANAGAR & SADASHIVANAGAR',
    details: 'Acoustic glass facades, private elevator entry, wrap-around terraces, and multi-car underground berths.',
  },
  {
    id: 'private-homes',
    name: 'MULTI-GEN COMPOUNDS',
    subtitle: 'Intimate family estates designed around ancestral trees and internal central courtyards.',
    areaRange: '6,000 — 15,000 SQ FT',
    image: '/assets/images/hero_empty_land.jpg',
    location: 'HSR LAYOUT & WHITEFIELD',
    details: 'Dual kitchen wings, prayer chambers, independent guest annexes, and integrated wellness suites.',
  },
  {
    id: 'commercial',
    name: 'ARCHITECTURAL HEADQUARTERS',
    subtitle: 'Sculptural commercial pavilions and flagship creative studio spaces.',
    areaRange: '15,000 — 50,000 SQ FT',
    image: '/assets/images/blueprint_drafting.jpg',
    location: 'CBD & OUTER RING ROAD',
    details: 'Post-tensioned column-free floorplates, green building LEED Platinum certification, and exposed concrete.',
  },
  {
    id: 'interiors',
    name: 'INTERIOR ARCHITECTURE',
    subtitle: 'Turnkey interior architecture, bespoke joinery, and haute-design installations.',
    areaRange: 'FULL RESIDENCES',
    image: '/assets/images/villa_finished_interior.jpg',
    location: 'GLOBAL CLIENTELE',
    details: 'Bookmatched Italian travertine, brushed bronze metalwork, and circadian lighting systems.',
  },
  {
    id: 'land',
    name: 'LAND MASTERPLANNING',
    subtitle: 'Strategic parcel acquisition and infrastructure-ready development enclaves.',
    areaRange: '5 — 50 ACRES',
    image: '/assets/images/construction_excavation.jpg',
    location: 'EMERGING CORRIDORS',
    details: 'Subdivided titled plots, underground utility conduits, wide tree-lined boulevards, and clubhouse design.',
  },
];

export const PropertyTypesSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    sound.playClick(600);
    setCurrentIndex((c) => (c === 0 ? PROPERTY_TYPES.length - 1 : c - 1));
  };

  const next = () => {
    sound.playClick(750);
    setCurrentIndex((c) => (c === PROPERTY_TYPES.length - 1 ? 0 : c + 1));
  };

  const current = PROPERTY_TYPES[currentIndex];

  return (
    <section className="relative w-full min-h-screen py-24 md:py-32 bg-[#0B0B0B] text-[#F1EEE7] overflow-hidden flex flex-col justify-between">
      {/* Background Architectural Canvas */}
      <div className="absolute inset-0">
        <img
          src={current.image}
          alt={current.name}
          className="w-full h-full object-cover transition-all duration-1000 filter brightness-45 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/60 to-[#0B0B0B]/80" />
      </div>

      {/* Top Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full pt-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="font-mono-tech text-xs tracking-[0.3em] text-[#E89D42] uppercase mb-2">
              TYPOLOGY PORTFOLIO
            </div>
            <h2 className="font-display font-black text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[0.88] text-[#F1EEE7] uppercase">
              WE DON'T BUILD
              <br />
              ONE TYPE OF LIFE.
            </h2>
          </div>

          <div className="font-mono-tech text-xs text-[#AAA7A0] flex items-center gap-3">
            <span>{String(currentIndex + 1).padStart(2, '0')}</span>
            <div className="w-16 h-[1px] bg-white/20">
              <div
                className="h-full bg-[#E89D42] transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / PROPERTY_TYPES.length) * 100}%` }}
              />
            </div>
            <span>{String(PROPERTY_TYPES.length).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* Center Typology Hero Feature */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full my-auto py-12">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-black/60 border border-[#E89D42]/40 px-4 py-1.5 rounded-full font-mono-tech text-xs text-[#E89D42] mb-4">
            <span>{current.location}</span>
            <span>•</span>
            <span>{current.areaRange}</span>
          </div>

          <h3 className="font-display font-black text-5xl md:text-7xl lg:text-8xl text-[#F1EEE7] uppercase leading-none tracking-tight mb-6">
            {current.name}
          </h3>

          <p className="font-sans text-base md:text-xl text-[#D6CAB9] leading-relaxed mb-6 max-w-2xl">
            {current.subtitle}
          </p>

          <p className="font-mono-tech text-xs text-[#AAA7A0] max-w-xl pb-6">
            {current.details}
          </p>
        </div>
      </div>

      {/* Bottom Typology Carousel Navigation */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full pb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-white/10">
          {/* Quick pills */}
          <div className="flex flex-wrap gap-2">
            {PROPERTY_TYPES.map((pt, idx) => (
              <button
                key={pt.id}
                onClick={() => {
                  sound.playClick(800);
                  setCurrentIndex(idx);
                }}
                className={`font-mono-tech text-[11px] px-3 py-1.5 rounded-full transition-all border ${
                  idx === currentIndex
                    ? 'bg-[#F1EEE7] text-[#0B0B0B] border-[#F1EEE7] font-bold'
                    : 'bg-black/40 text-[#AAA7A0] border-white/10 hover:border-white/30'
                }`}
              >
                {pt.name}
              </button>
            ))}
          </div>

          {/* Prev / Next Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              aria-label="Previous Property Type"
              className="p-3 rounded-full border border-white/20 hover:border-[#E89D42] hover:bg-[#E89D42]/10 transition-all text-[#F1EEE7]"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              onClick={next}
              aria-label="Next Property Type"
              className="p-3 rounded-full border border-white/20 hover:border-[#E89D42] hover:bg-[#E89D42]/10 transition-all text-[#F1EEE7]"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
