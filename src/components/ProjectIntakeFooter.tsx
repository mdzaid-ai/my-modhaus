import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { Check, ArrowRight, ArrowUp, Send, Sparkles } from 'lucide-react';

interface ProjectIntakeFooterProps {
  onRewindToTop: () => void;
}

type IntakeType = 'have_property' | 'need_property';

export const ProjectIntakeFooter: React.FC<ProjectIntakeFooterProps> = ({ onRewindToTop }) => {
  const [intakeType, setIntakeType] = useState<IntakeType>('have_property');
  const [step, setStep] = useState(1);
  const [isHoveringCTA, setIsHoveringCTA] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form states
  const [planType, setPlanType] = useState('Villa');
  const [propertyLocation, setPropertyLocation] = useState('Bangalore East');
  const [propertySize, setPropertySize] = useState('2,400 - 4,000 SQ FT');
  const [timeline, setTimeline] = useState('Immediate (1-3 months)');
  const [budget, setBudget] = useState('₹2.5 - ₹4.0 Cr');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
  });

  const nextStep = () => {
    sound.playClick(900);
    setStep((s) => s + 1);
  };

  const prevStep = () => {
    sound.playClick(600);
    setStep((s) => Math.max(1, s - 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playWarmChime();
    setIsSubmitted(true);
  };

  const totalSteps = 4;

  return (
    <footer id="section-contact" className="relative w-full bg-[#0B0B0B] text-[#F1EEE7] overflow-hidden">
      {/* 1. Return to Empty Land Backdrop */}
      <div className="relative min-h-screen py-28 md:py-36 px-6 md:px-12 flex flex-col justify-between border-b border-white/10">
        <div className="absolute inset-0">
          <img
            src="/assets/images/hero_empty_land.jpg"
            alt="Return to virgin land at sunset"
            className="w-full h-full object-cover filter brightness-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0B] via-transparent to-[#0B0B0B]" />

          {/* Wireframe house rising when hovering START A PROJECT CTA */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 pointer-events-none ${
              isHoveringCTA ? 'opacity-80 scale-100' : 'opacity-0 scale-90'
            }`}
          >
            <div className="w-96 h-64 border-2 border-[#00E5FF] border-dashed rounded-lg flex items-center justify-center bg-[#00E5FF]/5 backdrop-blur-xs">
              <span className="font-mono-tech text-xs tracking-widest text-[#00E5FF]">
                [ FUTURE WIREFRAME MANIFESTATION ]
              </span>
            </div>
          </div>
        </div>

        {/* Top prompt */}
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="font-mono-tech text-xs tracking-[0.3em] text-[#E89D42] uppercase mb-2">
            THE CIRCLE COMPLETES // RETURN TO THE LAND
          </div>
          <div className="font-mono-tech text-sm text-[#AAA7A0] mb-3">
            WE'VE SHOWN YOU OUR PROCESS.
          </div>
          <h2 className="font-display font-black text-6xl md:text-8xl lg:text-9xl tracking-tight leading-[0.88] text-[#F1EEE7] uppercase mb-4">
            READY TO
            <br />
            START YOURS?
          </h2>
          <p className="font-sans text-base md:text-lg text-[#D6CAB9] max-w-xl">
            Your project starts with a conversation. Explore your architectural possibilities below.
          </p>
        </div>

        {/* Center: Conversational Architectural Step-by-Step Configurator */}
        <div className="relative z-10 max-w-3xl mx-auto w-full my-12 bg-[#121212]/95 border border-[#E89D42]/40 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-xl">
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-3 mb-8 p-1.5 rounded-full bg-black/60 border border-white/10 font-mono-tech text-xs">
            <button
              onClick={() => {
                sound.playClick(700);
                setIntakeType('have_property');
                setStep(1);
                setIsSubmitted(false);
              }}
              className={`py-3 rounded-full transition-all uppercase tracking-wider font-semibold ${
                intakeType === 'have_property'
                  ? 'bg-[#E89D42] text-[#0B0B0B] shadow-md'
                  : 'text-[#AAA7A0] hover:text-[#F1EEE7]'
              }`}
            >
              I HAVE A PROPERTY
            </button>
            <button
              onClick={() => {
                sound.playClick(700);
                setIntakeType('need_property');
                setStep(1);
                setIsSubmitted(false);
              }}
              className={`py-3 rounded-full transition-all uppercase tracking-wider font-semibold ${
                intakeType === 'need_property'
                  ? 'bg-[#E89D42] text-[#0B0B0B] shadow-md'
                  : 'text-[#AAA7A0] hover:text-[#F1EEE7]'
              }`}
            >
              I'M LOOKING FOR ONE
            </button>
          </div>

          {!isSubmitted ? (
            <div>
              {/* Step Counter & Progress bar */}
              <div className="flex items-center justify-between mb-8 font-mono-tech text-xs text-[#AAA7A0]">
                <span>
                  STEP {step} OF {totalSteps}
                </span>
                <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#E89D42] transition-all duration-300"
                    style={{ width: `${(step / totalSteps) * 100}%` }}
                  />
                </div>
              </div>

              {/* Step 1: Typology */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="font-display font-bold text-2xl text-[#F1EEE7] uppercase">
                    WHAT ARE YOU PLANNING?
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono-tech text-xs">
                    {['Villa', 'Private Home', 'Curated Apartments', 'Commercial', 'Interiors', 'Land Development'].map(
                      (item) => (
                        <button
                          key={item}
                          onClick={() => {
                            sound.playClick(800);
                            setPlanType(item);
                          }}
                          className={`p-4 rounded-xl border text-left transition-all ${
                            planType === item
                              ? 'bg-[#F1EEE7] text-[#0B0B0B] border-[#F1EEE7] font-bold shadow-lg'
                              : 'bg-black/40 text-[#AAA7A0] border-white/10 hover:border-white/30'
                          }`}
                        >
                          <div className="text-[10px] opacity-70 mb-1">TYPE</div>
                          <div>{item}</div>
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Location & Size */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="font-display font-bold text-2xl text-[#F1EEE7] uppercase">
                    {intakeType === 'have_property' ? 'WHERE IS THE PROPERTY?' : 'PREFERRED LOCATION & BUDGET'}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono-tech text-xs">
                    <div>
                      <label className="text-[#AAA7A0] block mb-2">TARGET ENCLAVE</label>
                      <select
                        value={propertyLocation}
                        onChange={(e) => setPropertyLocation(e.target.value)}
                        className="w-full bg-black/60 border border-white/20 rounded-xl p-3.5 text-white focus:border-[#E89D42] outline-none"
                      >
                        <option value="Bangalore East">Bangalore East (Indiranagar / Whitefield)</option>
                        <option value="Bangalore North">Bangalore North (Airport Corridor)</option>
                        <option value="Sadashivanagar / Central">Central (Sadashivanagar / Lavelle)</option>
                        <option value="Nandi Hills Foothills">Nandi Hills Retreat Area</option>
                        <option value="Other Location">Other Prime Corridor</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[#AAA7A0] block mb-2">
                        {intakeType === 'have_property' ? 'APPROXIMATE PLOT SIZE' : 'BUDGET ENVELOPE'}
                      </label>
                      {intakeType === 'have_property' ? (
                        <select
                          value={propertySize}
                          onChange={(e) => setPropertySize(e.target.value)}
                          className="w-full bg-black/60 border border-white/20 rounded-xl p-3.5 text-white focus:border-[#E89D42] outline-none"
                        >
                          <option value="1,200 - 2,400 SQ FT">1,200 — 2,400 SQ FT (30x40 / 30x50)</option>
                          <option value="2,400 - 4,000 SQ FT">2,400 — 4,000 SQ FT (40x60)</option>
                          <option value="4,000 - 10,000 SQ FT">4,000 — 10,000 SQ FT (50x80+)</option>
                          <option value="Quarter Acre+">Quarter Acre+ / Estate Parcel</option>
                        </select>
                      ) : (
                        <select
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          className="w-full bg-black/60 border border-white/20 rounded-xl p-3.5 text-white focus:border-[#E89D42] outline-none"
                        >
                          <option value="₹2.0 - ₹3.5 Cr">₹2.0 — ₹3.5 Crores</option>
                          <option value="₹3.5 - ₹6.0 Cr">₹3.5 — ₹6.0 Crores</option>
                          <option value="₹6.0 - ₹12.0 Cr">₹6.0 — ₹12.0 Crores</option>
                          <option value="₹12.0 Cr+">₹12.0 Crores+ (Ultra Luxury)</option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Timeline */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="font-display font-bold text-2xl text-[#F1EEE7] uppercase">
                    WHEN WOULD YOU LIKE TO BREAK GROUND?
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono-tech text-xs">
                    {['Immediate (1-3 months)', '3-6 months (Planning phase)', 'Future Horizon (6-12 months)'].map(
                      (item) => (
                        <button
                          key={item}
                          onClick={() => {
                            sound.playClick(800);
                            setTimeline(item);
                          }}
                          className={`p-4 rounded-xl border text-left transition-all ${
                            timeline === item
                              ? 'bg-[#E89D42] text-[#0B0B0B] border-[#E89D42] font-bold shadow-lg'
                              : 'bg-black/40 text-[#AAA7A0] border-white/10 hover:border-white/30'
                          }`}
                        >
                          <div className="text-[10px] opacity-70 mb-1">HORIZON</div>
                          <div>{item}</div>
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Contact & Identity */}
              {step === 4 && (
                <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-300 font-mono-tech text-xs">
                  <div className="font-display font-bold text-2xl text-[#F1EEE7] uppercase mb-4">
                    CONFIRM YOUR ARCHITECTURAL DOSSIER
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[#AAA7A0] block mb-1">FULL NAME</label>
                      <input
                        type="text"
                        required
                        placeholder="Vikram Malhotra"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-black/60 border border-white/20 rounded-xl p-3.5 text-white focus:border-[#E89D42] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[#AAA7A0] block mb-1">PHONE NUMBER</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-black/60 border border-white/20 rounded-xl p-3.5 text-white focus:border-[#E89D42] outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[#AAA7A0] block mb-1">EMAIL ADDRESS</label>
                    <input
                      type="email"
                      required
                      placeholder="vikram@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-black/60 border border-white/20 rounded-xl p-3.5 text-white focus:border-[#E89D42] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[#AAA7A0] block mb-1">ADDITIONAL ARCHITECTURAL ASPIRATIONS</label>
                    <textarea
                      rows={2}
                      placeholder="Private lap pool, double height living, biophilic central rain court..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full bg-black/60 border border-white/20 rounded-xl p-3 text-white focus:border-[#E89D42] outline-none"
                    />
                  </div>
                </form>
              )}

              {/* Step Navigation Controls */}
              <div className="flex items-center justify-between pt-8 border-t border-white/10 mt-8 font-mono-tech text-xs">
                {step > 1 ? (
                  <button
                    onClick={prevStep}
                    className="px-5 py-2.5 rounded-full border border-white/20 text-[#AAA7A0] hover:text-white hover:border-white transition-colors"
                  >
                    ← PREVIOUS
                  </button>
                ) : (
                  <div />
                )}

                {step < totalSteps ? (
                  <button
                    onClick={nextStep}
                    onMouseEnter={() => setIsHoveringCTA(true)}
                    onMouseLeave={() => setIsHoveringCTA(false)}
                    className="px-6 py-2.5 rounded-full bg-[#F1EEE7] text-[#0B0B0B] font-bold hover:bg-[#E89D42] transition-all flex items-center gap-2 shadow-lg hover:scale-105"
                  >
                    <span>CONTINUE</span>
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="px-8 py-3 rounded-full bg-[#E89D42] text-[#0B0B0B] font-bold hover:bg-[#F1EEE7] transition-all flex items-center gap-2 shadow-xl hover:scale-105"
                  >
                    <span>SUBMIT INTAKE DOSSIER</span>
                    <Send size={14} />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 space-y-4 animate-in zoom-in-95 duration-500">
              <div className="w-16 h-16 rounded-full bg-[#E89D42]/20 border-2 border-[#E89D42] text-[#E89D42] flex items-center justify-center mx-auto mb-4">
                <Check size={32} />
              </div>
              <h3 className="font-display font-black text-3xl md:text-4xl text-[#F1EEE7] uppercase">
                ARCHITECTURAL BRIEF RECEIVED
              </h3>
              <p className="font-mono-tech text-xs text-[#AAA7A0] max-w-md mx-auto leading-relaxed">
                Thank you, {formData.name || 'Client'}. An architectural partner from M/Y MODHAUS will contact you within 24 hours with an initial site feasibility dossier.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="font-mono-tech text-xs text-[#E89D42] underline uppercase tracking-wider"
                >
                  SUBMIT ANOTHER PROJECT INQUIRY
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom prompt on virgin land */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-tech text-xs text-[#AAA7A0] pt-6 border-t border-white/10 max-w-7xl mx-auto w-full">
          <div>BANGALORE STUDIO // SADASHIVANAGAR 560080</div>
          <div className="text-[#E89D42]">DIRECT DESK: +91 80 4920 1800</div>
        </div>
      </div>

      {/* 2. Global Cinematic Footer */}
      <div className="relative py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand Left (5 cols) */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-4xl tracking-wider text-[#F1EEE7]">M/Y</span>
              <span className="text-[#E89D42] text-2xl font-mono-tech">—</span>
              <span className="font-display font-bold text-3xl tracking-[0.25em] text-[#F1EEE7]">MODHAUS</span>
            </div>
            <p className="font-mono-tech text-xs text-[#AAA7A0] max-w-sm leading-relaxed">
              Real Estate, Civil Architecture, Bespoke Construction, Haute Interiors & Long-term Asset Management.
            </p>
            <div className="font-mono-tech text-xs text-[#F1EEE7] space-y-1">
              <div>HELLO@MODHAUS.COM</div>
              <div>+91 80 4920 1800</div>
              <div>BANGALORE, INDIA // GLOBAL PROJECTS</div>
            </div>
          </div>

          {/* Nav Links (4 cols) */}
          <div className="md:col-span-4 grid grid-cols-2 gap-4 font-mono-tech text-xs text-[#AAA7A0]">
            <div className="space-y-3">
              <div className="text-[10px] text-[#E89D42] uppercase tracking-widest">DISCIPLINES</div>
              <div><a href="#section-services" className="hover:text-white transition-colors">REAL ESTATE</a></div>
              <div><a href="#section-services" className="hover:text-white transition-colors">ARCHITECTURE</a></div>
              <div><a href="#section-services" className="hover:text-white transition-colors">CONSTRUCTION</a></div>
              <div><a href="#section-services" className="hover:text-white transition-colors">INTERIORS</a></div>
            </div>
            <div className="space-y-3">
              <div className="text-[10px] text-[#E89D42] uppercase tracking-widest">ECOSYSTEM</div>
              <div><a href="#section-management" className="hover:text-white transition-colors">MANAGEMENT</a></div>
              <div><a href="#section-portfolio" className="hover:text-white transition-colors">PORTFOLIO</a></div>
              <div><a href="#section-about" className="hover:text-white transition-colors">PHILOSOPHY</a></div>
              <div><a href="#section-about" className="hover:text-white transition-colors">THE TEAM</a></div>
            </div>
          </div>

          {/* Socials & Legal (3 cols) */}
          <div className="md:col-span-3 space-y-3 font-mono-tech text-xs text-[#AAA7A0]">
            <div className="text-[10px] text-[#E89D42] uppercase tracking-widest">CHANNELS</div>
            <div><a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">INSTAGRAM ↗</a></div>
            <div><a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LINKEDIN ↗</a></div>
            <div className="pt-4 text-[10px] text-[#666]">
              ALL DRAWINGS, RENDERS AND CODE SUBJECT TO STRICT ARCHITECTURAL COPYRIGHT.
            </div>
          </div>
        </div>

        {/* Huge Closing Statement */}
        <div className="py-16 text-center">
          <h2 className="font-display font-black text-6xl md:text-9xl tracking-tighter text-[#F1EEE7] uppercase leading-[0.85]">
            LET'S BUILD
            <br />
            WHAT'S NEXT.
          </h2>
        </div>

        {/* Bottom-most line & BACK TO THE LAND rapid rewind button */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-tech text-xs text-[#AAA7A0] border-t border-white/10">
          <div>© 2026 MODHAUS DEVELOPMENTS. ALL RIGHTS RESERVED.</div>

          {/* BACK TO THE LAND ↑ Hyper Rewind Button */}
          <button
            onClick={() => {
              sound.playStructuralRumble();
              onRewindToTop();
            }}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#121212] border border-white/20 text-[#F1EEE7] hover:border-[#E89D42] hover:bg-[#E89D42] hover:text-[#0B0B0B] transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            <span className="font-bold tracking-widest uppercase">BACK TO THE LAND</span>
            <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};
