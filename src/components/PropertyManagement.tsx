import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { Shield, Wrench, Sparkles, Trees, Users, Activity, CheckSquare, Zap, ArrowRight } from 'lucide-react';

interface ManagementService {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  highlightZone: 'perimeter' | 'garden' | 'interior' | 'roof' | 'mep' | 'structure';
  metric: string;
}

const SERVICES: ManagementService[] = [
  {
    id: 'security',
    name: 'SECURITY & SURVEILLANCE',
    icon: Shield,
    description: 'Biometric access control, 24/7 AI-monitored perimeter thermal boundary, vetted resident concierge.',
    highlightZone: 'perimeter',
    metric: '99.9% UPTIME',
  },
  {
    id: 'landscaping',
    name: 'LANDSCAPE & HORTICULTURE',
    icon: Trees,
    description: 'Bespoke botanical maintenance, automated drip irrigation balancing, seasonal terrace garden curation.',
    highlightZone: 'garden',
    metric: '100% ORGANIC',
  },
  {
    id: 'housekeeping',
    name: 'LUXURY HOUSEKEEPING',
    icon: Sparkles,
    description: 'Five-star hospitality-grade marble restoration, specialized wood conditioning, and turn-down care.',
    highlightZone: 'interior',
    metric: 'DAILY DISPATCH',
  },
  {
    id: 'maintenance',
    name: 'MEP & INFRASTRUCTURE',
    icon: Wrench,
    description: 'Quarterly central HVAC servicing, water softening filtration replenishment, and smart automation diagnostics.',
    highlightZone: 'mep',
    metric: '< 2HR RESPONSE',
  },
  {
    id: 'utilities',
    name: 'ENERGY & SOLAR MANAGEMENT',
    icon: Zap,
    description: 'Rooftop solar generation monitoring, grid load leveling, and EV bidirectional charging optimization.',
    highlightZone: 'roof',
    metric: 'NET ZERO READY',
  },
  {
    id: 'inspections',
    name: 'STRUCTURAL HEALTH AUDITS',
    icon: CheckSquare,
    description: 'Annual acoustic concrete integrity scans, joint sealant waterproofing verification, and seismic dampener audits.',
    highlightZone: 'structure',
    metric: 'ENGINEERING CERTIFIED',
  },
  {
    id: 'repairs',
    name: 'RAPID ON-DEMAND REPAIR',
    icon: Activity,
    description: 'In-house certified technicians on standby for plumbing, electrical, and custom joinery adjustments.',
    highlightZone: 'interior',
    metric: '24/7 HELPLINE',
  },
  {
    id: 'tenants',
    name: 'CONCIERGE & LEASING',
    icon: Users,
    description: 'High-net-worth tenant vetting, seamless lease contract administration, and bespoke property yield management.',
    highlightZone: 'perimeter',
    metric: 'PREMIUM YIELDS',
  },
];

export const PropertyManagement: React.FC = () => {
  const [selectedService, setSelectedService] = useState<ManagementService>(SERVICES[0]);

  const handleSelect = (s: ManagementService) => {
    sound.playClick(750);
    setSelectedService(s);
  };

  return (
    <section
      id="section-management"
      className="relative w-full py-28 md:py-36 bg-[#F1EEE7] text-[#0B0B0B] transition-colors duration-700 overflow-hidden"
    >
      {/* Subtle architectural grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(11, 11, 11, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(11, 11, 11, 0.05) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        {/* Breathing Space Header */}
        <div className="mb-16">
          <div className="font-mono-tech text-xs tracking-[0.25em] text-[#8A4E39] uppercase mb-2">
            ACT II // CONTINUOUS CARE
          </div>
          <div className="font-mono-tech text-sm text-[#55534F] mb-3">
            THAT WAS ONE PROJECT.
          </div>
          <h2 className="font-display font-black text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[0.9] text-[#0B0B0B] uppercase">
            BUT OUR WORK
            <br />
            DOESN'T END
            <br />
            AT HANDOVER.
          </h2>
        </div>

        {/* The House as the Interactive Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Service Selector List (4 cols) */}
          <div className="lg:col-span-5 space-y-2 order-2 lg:order-1">
            <div className="font-mono-tech text-[10px] tracking-widest text-[#55534F] uppercase mb-3">
              SELECT PROTOCOL TO INSPECT CORRESPONDING ZONE:
            </div>

            <div className="space-y-1.5">
              {SERVICES.map((service) => {
                const isCurrent = selectedService.id === service.id;
                const Icon = service.icon;

                return (
                  <button
                    key={service.id}
                    onClick={() => handleSelect(service)}
                    onMouseEnter={() => handleSelect(service)}
                    className={`w-full text-left p-3.5 rounded-xl transition-all flex items-center justify-between border ${
                      isCurrent
                        ? 'bg-[#0B0B0B] text-[#F1EEE7] border-[#0B0B0B] shadow-xl translate-x-2'
                        : 'bg-white/70 hover:bg-white text-[#1A1A1A] border-[#AAA7A0]/30 hover:border-[#0B0B0B]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          isCurrent ? 'bg-[#E89D42] text-[#0B0B0B]' : 'bg-[#AAA7A0]/20 text-[#0B0B0B]'
                        }`}
                      >
                        <Icon size={16} />
                      </div>
                      <div>
                        <div className="font-mono-tech text-xs font-bold tracking-wider">
                          {service.name}
                        </div>
                        <div
                          className={`text-[10px] font-mono-tech ${
                            isCurrent ? 'text-[#AAA7A0]' : 'text-[#777]'
                          }`}
                        >
                          {service.metric}
                        </div>
                      </div>
                    </div>

                    <div className="font-mono-tech text-xs opacity-60">↗</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: The Interactive 3D Villa Cutaway Stage (7 cols) */}
          <div className="lg:col-span-7 relative order-1 lg:order-2 bg-[#E5DFD5] border border-[#0B0B0B]/15 rounded-3xl p-6 md:p-10 shadow-2xl overflow-hidden min-h-[480px] flex flex-col justify-between">
            {/* Architectural Villa Graphic with Dynamic Highlighting */}
            <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-[#D8D0C3] flex items-center justify-center border border-black/10">
              <img
                src="/assets/images/villa_final_exterior.jpg"
                alt="Villa Interactive Zone Model"
                className={`w-full h-full object-cover transition-all duration-700 ${
                  selectedService.highlightZone === 'interior' ? 'contrast-125 saturate-150' : ''
                }`}
              />

              {/* Glowing Interactive Hotspot Overlays */}
              {selectedService.highlightZone === 'perimeter' && (
                <div className="absolute inset-x-4 bottom-4 h-16 border-2 border-[#E89D42] bg-[#E89D42]/20 rounded-xl animate-pulse flex items-center justify-center font-mono-tech text-xs font-bold text-[#0B0B0B] backdrop-blur-xs">
                  ZONE: ACTIVE PERIMETER SECURITY & ENTRY GATEWAY
                </div>
              )}

              {selectedService.highlightZone === 'garden' && (
                <div className="absolute left-6 bottom-6 w-1/2 h-24 border-2 border-emerald-600 bg-emerald-500/25 rounded-xl animate-pulse flex items-center justify-center font-mono-tech text-xs font-bold text-[#0B0B0B] backdrop-blur-xs">
                  ZONE: BOTANICAL COURTYARD & DRIP IRRIGATION
                </div>
              )}

              {selectedService.highlightZone === 'interior' && (
                <div className="absolute right-12 top-16 w-3/5 h-44 border-2 border-[#E89D42] bg-[#E89D42]/30 rounded-xl animate-pulse flex items-center justify-center font-mono-tech text-xs font-bold text-[#0B0B0B] backdrop-blur-xs">
                  ZONE: LIVING SUITES & MARBLE CONDITIONING
                </div>
              )}

              {selectedService.highlightZone === 'roof' && (
                <div className="absolute inset-x-12 top-4 h-16 border-2 border-sky-500 bg-sky-400/25 rounded-xl animate-pulse flex items-center justify-center font-mono-tech text-xs font-bold text-[#0B0B0B] backdrop-blur-xs">
                  ZONE: ROOFTOP SOLAR ARRAY & WATER HEATING
                </div>
              )}

              {selectedService.highlightZone === 'mep' && (
                <div className="absolute inset-10 border-2 border-amber-600 bg-amber-500/20 rounded-xl animate-pulse flex items-center justify-center font-mono-tech text-xs font-bold text-[#0B0B0B] backdrop-blur-xs">
                  ZONE: CENTRAL HVAC, FILTRATION & CONDUITS
                </div>
              )}

              {selectedService.highlightZone === 'structure' && (
                <div className="absolute inset-4 border-2 border-purple-600 bg-purple-500/20 rounded-xl animate-pulse flex items-center justify-center font-mono-tech text-xs font-bold text-[#0B0B0B] backdrop-blur-xs">
                  ZONE: STRUCTURAL CONCRETE PILLARS & FOUNDATION TIES
                </div>
              )}

              {/* Live coordinates watermark */}
              <div className="absolute top-4 left-4 bg-black/80 px-3 py-1 rounded text-white font-mono-tech text-[10px] tracking-wider">
                VILLA ID: MOD-BLR-04 // LIVE TELEMETRY
              </div>
            </div>

            {/* Service Detail Card */}
            <div className="mt-6 pt-6 border-t border-black/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="max-w-md">
                <div className="font-mono-tech text-xs font-bold text-[#8A4E39] mb-1">
                  {selectedService.name}
                </div>
                <p className="text-xs text-[#444] font-sans leading-relaxed">
                  {selectedService.description}
                </p>
              </div>

              <button
                onClick={() => sound.playClick(1000)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0B0B0B] text-[#F1EEE7] font-mono-tech text-xs font-semibold hover:bg-[#8A4E39] transition-all hover:scale-105 active:scale-95 whitespace-nowrap shadow-lg"
              >
                <span>EXPLORE MANAGEMENT</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 pt-8 border-t border-[#0B0B0B]/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-tech text-xs text-[#55534F]">
          <div className="font-bold text-[#0B0B0B] text-sm">
            BUILT BY US. CARED FOR BY US.
          </div>
          <div>ESTATE RETENTION RATE: 98.4% OVER 10 YEARS</div>
        </div>
      </div>
    </section>
  );
};
