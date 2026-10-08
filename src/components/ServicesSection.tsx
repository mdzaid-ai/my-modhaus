import React, { useState } from 'react';
import { sound } from '../utils/audio';

interface ServiceStage {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  bgImage: string;
  tag: string;
  specs: string[];
}

const SERVICE_STAGES: ServiceStage[] = [
  {
    id: 'real-estate',
    number: '01',
    title: 'REAL ESTATE ACQUISITION',
    subtitle: 'Off-market parcel sourcing, zoning verification, title due diligence, and legal deed structuring.',
    bgImage: '/assets/images/hero_empty_land.jpg',
    tag: 'STAGE 01 — LAND ASSET',
    specs: ['TITLE DUE DILIGENCE', 'TOPOGRAPHY MAPPING', 'ZONING PERMITTING', 'GROUNDWATER SCAN'],
  },
  {
    id: 'architecture',
    number: '02',
    title: 'ARCHITECTURE & MASTERPLANNING',
    subtitle: 'Biophilic conceptual design, structural calculations, light-path simulation, and municipal drawings.',
    bgImage: '/assets/images/blueprint_drafting.jpg',
    tag: 'STAGE 02 — BLUEPRINT & CAD',
    specs: ['3D SOLAR MODELING', 'SEISMIC STRUCTURAL FEA', 'MEP BLUEPRINTS', 'SUSTAINABLE AUDIT'],
  },
  {
    id: 'construction',
    number: '03',
    title: 'GENERAL CONSTRUCTION',
    subtitle: 'Turnkey civil contracting, post-tensioned reinforced concrete frames, and precision engineering.',
    bgImage: '/assets/images/construction_structure.jpg',
    tag: 'STAGE 03 — SUPERSTRUCTURE',
    specs: ['TMT 550D GRADE REBAR', 'LASER LEVELED SLABS', 'SEISMIC RESISTANT JOINTS', 'RAPID CAST CURING'],
  },
  {
    id: 'interiors',
    number: '04',
    title: 'BESPOKE INTERIOR ARCHITECTURE',
    subtitle: 'Italian marble sourcing, custom millwork, integrated circadian lighting, and couture furnishings.',
    bgImage: '/assets/images/villa_finished_interior.jpg',
    tag: 'STAGE 04 — CURATED INTERIORS',
    specs: ['ITALIAN BOOKMATCHED MARBLE', 'FLUTED NATURAL OAK', 'WARM 3000K COVE LIGHTS', 'ACOUSTIC CEILINGS'],
  },
  {
    id: 'sales',
    number: '05',
    title: 'PROPERTY SALES & CAPITAL',
    subtitle: 'High-end asset valuation, cinematic representation, and direct private acquisitions.',
    bgImage: '/assets/images/villa_final_exterior.jpg',
    tag: 'STAGE 05 — FINISHED RESIDENCE',
    specs: ['EXCLUSIVE PRIVATE BROKERAGE', 'ASSET CAPITAL GAINS', 'ESCROW ADMINISTRATION', 'INVESTOR ADVISORY'],
  },
  {
    id: 'management',
    number: '06',
    title: 'ESTATE & ASSET MANAGEMENT',
    subtitle: 'Perimeter defense, predictive MEP maintenance, botanical horticulture, and concierge living.',
    bgImage: '/assets/images/handover_key.jpg',
    tag: 'STAGE 06 — CONTINUOUS STEWARDSHIP',
    specs: ['24/7 AI-SURVEILLANCE', 'PREDICTIVE MEP REPAIRS', 'HORTICULTURE CARE', 'TENANT MANAGEMENT'],
  },
];

export const ServicesSection: React.FC = () => {
  const [activeStage, setActiveStage] = useState<ServiceStage>(SERVICE_STAGES[0]);

  const handleHover = (s: ServiceStage) => {
    sound.playClick(850);
    setActiveStage(s);
  };

  return (
    <section
      id="section-services"
      className="relative w-full py-28 md:py-36 bg-[#0B0B0B] text-[#F1EEE7] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-16">
          <div className="font-mono-tech text-xs tracking-[0.3em] text-[#E89D42] uppercase mb-2">
            INTEGRATED CAPABILITIES
          </div>
          <h2 className="font-display font-black text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[0.9] text-[#F1EEE7] uppercase">
            ONE PARTNER.
            <br />
            EVERY STAGE.
          </h2>
          <p className="mt-4 font-mono-tech text-xs md:text-sm text-[#AAA7A0] max-w-xl">
            Hover each discipline to observe how our singular architectural continuum evolves the central asset.
          </p>
        </div>

        {/* Central Morphing Model Stage */}
        <div className="relative w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#141414] min-h-[540px] flex flex-col justify-between p-6 md:p-12">
          {/* Background image transforming per service */}
          <div className="absolute inset-0">
            <img
              src={activeStage.bgImage}
              alt={activeStage.title}
              className="w-full h-full object-cover transition-all duration-700 filter brightness-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/50 to-transparent" />
          </div>

          {/* Top telemetry badge */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="bg-black/80 border border-[#E89D42]/60 px-4 py-1.5 rounded-full font-mono-tech text-xs text-[#E89D42] backdrop-blur-md">
              {activeStage.tag}
            </div>
            <div className="font-mono-tech text-xs text-[#AAA7A0]">
              STAGE {activeStage.number} // 06
            </div>
          </div>

          {/* Center Title & Specs */}
          <div className="relative z-10 my-auto py-8 max-w-2xl">
            <h3 className="font-display font-black text-4xl md:text-6xl text-[#F1EEE7] uppercase leading-none mb-4">
              {activeStage.title}
            </h3>
            <p className="text-sm md:text-base text-[#D6CAB9] font-sans leading-relaxed mb-6">
              {activeStage.subtitle}
            </p>
            <div className="flex flex-wrap gap-2 font-mono-tech text-[11px] text-[#F1EEE7]">
              {activeStage.specs.map((spec) => (
                <span key={spec} className="px-3 py-1 rounded bg-black/70 border border-white/20">
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Interactive Discipline Switcher Bar */}
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-6 gap-2 pt-6 border-t border-white/10 font-mono-tech text-xs">
            {SERVICE_STAGES.map((s) => {
              const isCurrent = activeStage.id === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => handleHover(s)}
                  onMouseEnter={() => handleHover(s)}
                  className={`p-3 text-left rounded-xl transition-all border ${
                    isCurrent
                      ? 'bg-[#E89D42] text-[#0B0B0B] border-[#E89D42] font-bold shadow-lg scale-102'
                      : 'bg-black/50 text-[#AAA7A0] border-white/10 hover:border-white/30 hover:text-[#F1EEE7]'
                  }`}
                >
                  <div className="text-[10px] opacity-70 mb-0.5">{s.number}</div>
                  <div className="truncate text-[11px] uppercase tracking-wider">{s.id.replace('-', ' ')}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
