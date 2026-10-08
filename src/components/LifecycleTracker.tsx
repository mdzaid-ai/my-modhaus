import React from 'react';
import { sound } from '../utils/audio';

export interface StageInfo {
  id: string;
  number: string;
  name: string;
  progressRange: [number, number]; // [min, max] in 0-1 range
}

export const STAGES: StageInfo[] = [
  { id: 'land', number: '01', name: 'LAND', progressRange: [0.0, 0.34] },
  { id: 'plan', number: '02', name: 'PLAN', progressRange: [0.34, 0.74] },
  { id: 'foundation', number: '03', name: 'FOUNDATION', progressRange: [0.74, 0.81] },
  { id: 'structure', number: '04', name: 'STRUCTURE', progressRange: [0.81, 0.87] },
  { id: 'exterior', number: '05', name: 'EXTERIOR', progressRange: [0.87, 0.92] },
  { id: 'interiors', number: '06', name: 'INTERIORS', progressRange: [0.92, 0.98] },
  { id: 'handover', number: '07', name: 'HANDOVER', progressRange: [0.98, 1.0] },
];

interface LifecycleTrackerProps {
  currentProgress: number; // 0 to 1
  onSelectStage?: (targetProgress: number) => void;
  isVisible: boolean;
}

export const LifecycleTracker: React.FC<LifecycleTrackerProps> = ({
  currentProgress,
  onSelectStage,
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <aside
      aria-label="Project lifecycle stages"
      className="fixed right-6 md:right-10 top-1/2 -translate-y-1/2 z-50 hidden sm:flex flex-col items-end gap-3 select-none pointer-events-auto"
    >
      <div className="text-[9px] font-mono-tech tracking-[0.25em] text-[#AAA7A0]/60 mb-2 uppercase rotate-90 origin-right translate-x-2">
        PROJECT TIMELINE
      </div>

      <div className="flex flex-col gap-2 relative">
        {/* Background track line */}
        <div className="absolute right-[5px] top-2 bottom-2 w-[1px] bg-white/10" />

        {/* Active progress indicator line */}
        <div
          className="absolute right-[5px] top-2 w-[1px] bg-[#E89D42] transition-all duration-150"
          style={{ height: `${Math.min(Math.max(currentProgress, 0), 1) * 100}%` }}
        />

        {STAGES.map((stage) => {
          const isActive =
            currentProgress >= stage.progressRange[0] &&
            currentProgress <= stage.progressRange[1];
          const isPassed = currentProgress > stage.progressRange[1];

          return (
            <button
              key={stage.id}
              onClick={() => {
                sound.playClick(900);
                if (onSelectStage) {
                  onSelectStage(stage.progressRange[0] + 0.02);
                }
              }}
              className="group flex items-center gap-3 py-1 text-right transition-all outline-none"
            >
              {/* Stage label */}
              <div
                className={`font-mono-tech text-[10px] tracking-widest transition-all duration-300 ${
                  isActive
                    ? 'text-[#F1EEE7] font-bold translate-x-0'
                    : isPassed
                    ? 'text-[#AAA7A0]/70 group-hover:text-[#F1EEE7]'
                    : 'text-[#AAA7A0]/30 group-hover:text-[#AAA7A0]/70'
                }`}
              >
                <span className="text-[#E89D42] text-[9px] mr-1.5 opacity-80">{stage.number}</span>
                <span>{stage.name}</span>
              </div>

              {/* Stage node dot */}
              <div
                className={`relative z-10 w-2.5 h-2.5 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? 'bg-[#E89D42] scale-125 shadow-[0_0_12px_#E89D42]'
                    : isPassed
                    ? 'bg-[#F1EEE7]/80 group-hover:bg-[#E89D42]'
                    : 'bg-[#2A2A2A] group-hover:bg-[#555]'
                }`}
              >
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-[#0B0B0B]" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
