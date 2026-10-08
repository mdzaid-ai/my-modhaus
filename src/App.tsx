import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { Preloader } from './components/Preloader';
import { Navbar } from './components/Navbar';
import { CustomCursor } from './components/CustomCursor';
import { LifecycleTracker, STAGES } from './components/LifecycleTracker';
import { ConstructionTimeline } from './components/ConstructionTimeline';
import { HandoverTransition } from './components/HandoverTransition';
import { PropertyManagement } from './components/PropertyManagement';
import { ServicesSection } from './components/ServicesSection';
import { PropertyTypesSection } from './components/PropertyTypesSection';
import { PortfolioSection } from './components/PortfolioSection';
import { CompanyPhilosophy } from './components/CompanyPhilosophy';
import { ProjectIntakeFooter } from './components/ProjectIntakeFooter';
import { usePerformanceTier } from './utils/performance';
import { sound } from './utils/audio';

export function App() {
  const [isPreloaderDone, setIsPreloaderDone] = useState(false);
  const [timelineProgress, setTimelineProgress] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);

  // Dynamic cross-device 3-tier performance monitor
  const perfConfig = usePerformanceTier();

  // Initialize Lenis smooth scroll: Only active on non-touch desktop to ensure 100% natural touch momentum on mobile
  useEffect(() => {
    const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

    if (!isTouch && !perfConfig.prefersReducedMotion) {
      const lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.0,
      });
      lenisRef.current = lenis;

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      const rafId = requestAnimationFrame(raf);

      return () => {
        cancelAnimationFrame(rafId);
        lenis.destroy();
        lenisRef.current = null;
      };
    }
  }, [perfConfig.prefersReducedMotion]);

  // Determine current active stage name for nav badge
  const activeStage = STAGES.find(
    (s) => timelineProgress >= s.progressRange[0] && timelineProgress <= s.progressRange[1]
  );
  const stageDisplayName = activeStage ? `${activeStage.number} ${activeStage.name}` : undefined;

  // Jump to specific timeline progress
  const handleSelectStage = (targetProgress: number) => {
    const journeyEl = document.getElementById('section-journey');
    if (!journeyEl) return;
    const top = journeyEl.offsetTop;
    const height = journeyEl.offsetHeight - window.innerHeight;
    const targetScroll = top + height * targetProgress;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(targetScroll, { duration: 1.5 });
    } else {
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  // Back to the Land: Rapidly scrubs backwards through the entire building to 0!
  const handleRewindToTop = () => {
    sound.playStructuralRumble();
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, {
        duration: 3.0,
        easing: (t) => t * t, // Accelerates backward
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStartProject = () => {
    sound.playClick(1000);
    const formEl = document.getElementById('section-contact');
    if (formEl) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(formEl, { duration: 1.6 });
      } else {
        formEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#0B0B0B] text-[#F1EEE7] selection:bg-[#E89D42] selection:text-[#0B0B0B]">
      {/* 1. Architectural Preloader */}
      {!isPreloaderDone && (
        <Preloader onComplete={() => setIsPreloaderDone(true)} />
      )}

      {/* 2. Custom Cursor (only on non-touch desktop) */}
      {!perfConfig.isTouch && <CustomCursor mode="default" />}

      {/* 3. Global Film Grain Texture (disabled in lightweight mode for GPU efficiency) */}
      {perfConfig.tier !== 'lightweight' && <div className="film-grain" />}

      {/* 4. Minimal Architectural Navbar */}
      <Navbar
        onStartProject={handleStartProject}
        currentStageName={stageDisplayName}
      />

      {/* 5. Right-Hand Project Lifecycle Stage Tracker (hidden on mobile, visible on tablet/desktop) */}
      <LifecycleTracker
        currentProgress={timelineProgress}
        onSelectStage={handleSelectStage}
        isVisible={timelineProgress > 0.01 && timelineProgress < 0.99 && !perfConfig.isMobile}
      />

      {/* 6. Act 1: The Core Construction Journey */}
      <main>
        <ConstructionTimeline
          onProgressUpdate={(p) => setTimelineProgress(p)}
          onTimelineComplete={() => {}}
          perfConfig={perfConfig}
        />

        {/* 7. Bridge: The Handover & Laser Divider */}
        <HandoverTransition />

        {/* 8. Act 2: Property Management (Building as Interface, Warm Off-White) */}
        <PropertyManagement />

        {/* 9. Act 2: Services Section (Morphing Architectural Model) */}
        <ServicesSection />

        {/* 10. Act 2: Property Types (Full-Viewport Architectural Displays) */}
        <PropertyTypesSection />

        {/* 11. Act 2: Selected Projects & Seamless Architectural Dossier Modal */}
        <PortfolioSection />

        {/* 12. Act 2: Volume Scale Stats, Philosophy Blackout & Editorial Team */}
        <CompanyPhilosophy />

        {/* 13. Act 2: Return to Land, Conversational Intake, Final CTA & Footer */}
        <ProjectIntakeFooter onRewindToTop={handleRewindToTop} />
      </main>
    </div>
  );
}

export default App;
