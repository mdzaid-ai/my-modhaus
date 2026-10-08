import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { X, ArrowUpRight, CheckCircle, Calendar, Layers, MapPin } from 'lucide-react';

interface Project {
  id: string;
  number: string;
  title: string;
  category: string;
  location: string;
  year: string;
  area: string;
  image: string;
  blueprint: string;
  description: string;
  materials: string[];
  specs: { label: string; value: string }[];
}

const PROJECTS: Project[] = [
  {
    id: 'oak-residence',
    number: 'PROJECT 01',
    title: 'THE OAK RESIDENCE',
    category: 'PRIVATE RESIDENCE',
    location: 'BANGALORE EAST',
    year: '2026',
    area: '5,800 SQ FT',
    image: '/assets/images/villa_final_exterior.jpg',
    blueprint: '/assets/images/blueprint_drafting.jpg',
    description:
      'A monolithic cast-concrete sanctuary built on a contoured hillside. Anchored by a 20-meter cantilevered living pavilion and an internal glass atrium reflecting the morning mist.',
    materials: ['BOARD-FORMED CONCRETE', 'FLUTED TEAK LOUVERS', 'ITALIAN TRAVERTINE', 'LOW-E DGU GLASS'],
    specs: [
      { label: 'FLOORS', value: 'GROUND + 2' },
      { label: 'BEDROOMS', value: '4 EN-SUITE + MAID SUITE' },
      { label: 'COMPLETION', value: 'DAY 487 HANDOVER' },
      { label: 'ENERGY', value: '12KW SOLAR + NET ZERO STORAGE' },
    ],
  },
  {
    id: 'vespera-pavilion',
    number: 'PROJECT 02',
    title: 'VESPERA PAVILION',
    category: 'CONTEMPORARY VILLA',
    location: 'WHITEFIELD ENCLAVE',
    year: '2025',
    area: '7,200 SQ FT',
    image: '/assets/images/villa_finished_interior.jpg',
    blueprint: '/assets/images/blueprint_drafting.jpg',
    description:
      'A seamless celebration of indoor-outdoor flow featuring double-height travertine fireplace walls and an infinity-edge swimming pool extending toward natural foliage.',
    materials: ['SMOKED OAK MILLWORK', 'ARMANI GREY MARBLE', 'BLACKENED BRONZE', 'SLATE STONE'],
    specs: [
      { label: 'FLOORS', value: 'GROUND + 1' },
      { label: 'BEDROOMS', value: '5 BESPOKE SUITES' },
      { label: 'SPECIALTY', value: 'HEATED LAP POOL' },
      { label: 'AUTOMATION', value: 'FULL KNX BUS INTEGRATION' },
    ],
  },
  {
    id: 'brutalist-sanctuary',
    number: 'PROJECT 03',
    title: 'THE BRUTALIST MONOLITH',
    category: 'URBAN COMPOUND',
    location: 'SADASHIVANAGAR',
    year: '2025',
    area: '4,400 SQ FT',
    image: '/assets/images/construction_structure.jpg',
    blueprint: '/assets/images/blueprint_drafting.jpg',
    description:
      'Raw exposed geometric concrete volumes that filter harsh tropical sun into delicate shafts of ambient raking light. Designed for multi-generational seclusion within the city center.',
    materials: ['EXPOSED AGGREGATE', 'RECYCLED STEEL CONDUITS', 'RAW BRASS HARDWARE', 'CHARCOAL PLASTER'],
    specs: [
      { label: 'FLOORS', value: 'GROUND + 3' },
      { label: 'BEDROOMS', value: '4 BEDROOMS + ART GALLERY' },
      { label: 'COURTYARD', value: 'CENTRAL RAINWELL' },
      { label: 'ORIENTATION', value: 'NORTH FACING OPTIMIZED' },
    ],
  },
  {
    id: 'nandi-horizon',
    number: 'PROJECT 04',
    title: 'HORIZON ESTATE',
    category: 'HILLSIDE RETREAT',
    location: 'NANDI HILLS FOOTHILLS',
    year: '2024',
    area: '8,900 SQ FT',
    image: '/assets/images/hero_empty_land.jpg',
    blueprint: '/assets/images/blueprint_drafting.jpg',
    description:
      'Spanning 3 cascading stone terraces, Horizon Estate features private fruit groves, rainwater percolation reservoirs, and an expansive 360-degree sunset observation deck.',
    materials: ['LOCAL GRANITE ASHLAR', 'RECLAIMED ROSEWOOD', 'CORTEN STEEL', 'RAMMED EARTH'],
    specs: [
      { label: 'LAND PARCEL', value: '1.8 ACRES PRIVATE' },
      { label: 'STRUCTURE', value: 'HYBRID RAMMED EARTH & STEEL' },
      { label: 'WATER', value: '100% INDEPENDENT HARVEST' },
      { label: 'MANAGEMENT', value: 'MANAGED UNDER MODHAUS CARE' },
    ],
  },
];

export const PortfolioSection: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const openProject = (p: Project) => {
    sound.playClick(900);
    setSelectedProject(p);
  };

  const closeProject = () => {
    sound.playClick(600);
    setSelectedProject(null);
  };

  return (
    <section
      id="section-portfolio"
      className="relative w-full py-28 md:py-36 bg-[#0B0B0B] text-[#F1EEE7] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Editorial Heading */}
        <div className="mb-20">
          <div className="font-mono-tech text-xs tracking-[0.3em] text-[#E89D42] uppercase mb-2">
            SELECTED ARCHITECTURAL WORKS
          </div>
          <h2 className="font-display font-black text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[0.9] text-[#F1EEE7] uppercase">
            WHAT WE'VE
            <br />
            ALREADY BUILT.
          </h2>
          <p className="mt-4 font-mono-tech text-xs md:text-sm text-[#AAA7A0] max-w-lg">
            Hover any work to inspect framing. Click to seamlessly enter the detailed architectural case dossier.
          </p>
        </div>

        {/* Giant Architectural Frames List */}
        <div className="space-y-16">
          {PROJECTS.map((project, idx) => (
            <div
              key={project.id}
              onClick={() => openProject(project)}
              className="group relative w-full rounded-3xl overflow-hidden border border-white/10 bg-[#121212] cursor-pointer transition-all duration-700 hover:border-[#E89D42] hover:shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
              style={{
                perspective: '1200px',
              }}
            >
              {/* Image with subtle 3D tilt & zoom on hover */}
              <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter brightness-80 group-hover:brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/40 to-transparent" />

                {/* View Badge on Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-20 h-20 rounded-full bg-[#E89D42] text-[#0B0B0B] font-display font-bold text-xs tracking-widest flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                    VIEW
                  </div>
                </div>
              </div>

              {/* Project Metadata Overlay */}
              <div className="p-8 md:p-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-t border-white/10 bg-[#0E0E0E]">
                <div>
                  <div className="flex items-center gap-3 font-mono-tech text-xs text-[#E89D42] mb-2 uppercase">
                    <span>{project.number}</span>
                    <span>//</span>
                    <span>{project.location}</span>
                    <span>//</span>
                    <span>{project.year}</span>
                  </div>
                  <h3 className="font-display font-black text-3xl md:text-5xl text-[#F1EEE7] uppercase tracking-tight">
                    {project.title}
                  </h3>
                </div>

                <div className="flex items-center gap-8 font-mono-tech text-xs text-[#AAA7A0]">
                  <div>
                    <div className="text-[10px] text-[#777]">SCALE</div>
                    <div className="text-base font-bold text-[#F1EEE7]">{project.area}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#777]">TYPOLOGY</div>
                    <div className="text-base font-bold text-[#F1EEE7]">{project.category}</div>
                  </div>
                  <div className="p-3 rounded-full bg-white/5 border border-white/10 group-hover:bg-[#E89D42] group-hover:text-[#0B0B0B] transition-colors">
                    <ArrowUpRight size={18} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seamless Project Detail Modal / Dossier */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-[1000] bg-[#0B0B0B]/95 backdrop-blur-2xl overflow-y-auto flex items-center justify-center p-4 md:p-10 animate-in fade-in zoom-in-95 duration-300"
          onClick={closeProject}
        >
          <div
            className="relative w-full max-w-5xl bg-[#121212] border border-white/15 rounded-3xl overflow-hidden shadow-2xl text-[#F1EEE7]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 md:p-8 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3 font-mono-tech text-xs text-[#E89D42]">
                <span>{selectedProject.number}</span>
                <span>//</span>
                <span>ARCHITECTURAL DOSSIER</span>
              </div>
              <button
                onClick={closeProject}
                aria-label="Close Project Modal"
                className="p-2.5 rounded-full border border-white/20 hover:border-[#E89D42] hover:bg-[#E89D42]/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Media Showcase */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 md:p-8">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-black/80 px-3 py-1 rounded font-mono-tech text-[10px] text-white">
                  RENDER // COMPLETED VILLA
                </div>
              </div>

              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-[#08121E]">
                <img
                  src={selectedProject.blueprint}
                  alt="Architectural Blueprint"
                  className="w-full h-full object-contain filter invert opacity-80"
                />
                <div className="absolute bottom-3 left-3 bg-black/80 px-3 py-1 rounded font-mono-tech text-[10px] text-[#00E5FF]">
                  DRAWING // APPROVED CAD
                </div>
              </div>
            </div>

            {/* Modal Description & Specs */}
            <div className="p-6 md:p-8 space-y-6 border-t border-white/10">
              <div>
                <h3 className="font-display font-black text-4xl text-[#F1EEE7] uppercase mb-2">
                  {selectedProject.title}
                </h3>
                <p className="font-sans text-sm md:text-base text-[#D6CAB9] leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-black/50 border border-white/10 font-mono-tech text-xs">
                {selectedProject.specs.map((s) => (
                  <div key={s.label}>
                    <div className="text-[10px] text-[#AAA7A0] mb-0.5">{s.label}</div>
                    <div className="text-white font-bold">{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Materials */}
              <div>
                <div className="font-mono-tech text-xs text-[#E89D42] mb-2 uppercase">
                  MATERIAL PALETTE
                </div>
                <div className="flex flex-wrap gap-2 font-mono-tech text-xs">
                  {selectedProject.materials.map((m) => (
                    <span key={m} className="px-3 py-1 rounded-full bg-white/5 border border-white/15 text-[#AAA7A0]">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer CTA */}
            <div className="p-6 md:p-8 bg-[#0B0B0B] border-t border-white/10 flex items-center justify-between">
              <span className="font-mono-tech text-xs text-[#AAA7A0]">
                SCHEDULE A PRIVATE SITE APPOINTMENT
              </span>
              <button
                onClick={() => {
                  sound.playClick(1000);
                  closeProject();
                  const formEl = document.getElementById('section-contact');
                  if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-2.5 rounded-full bg-[#E89D42] text-[#0B0B0B] font-mono-tech text-xs font-bold hover:scale-105 active:scale-95 transition-transform"
              >
                ENQUIRE ABOUT THIS TYPOLOGY →
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
