import React, { useEffect, useState, useRef } from 'react';

export type CursorMode = 'default' | 'view' | 'drag' | 'link' | 'crosshair';

interface CustomCursorProps {
  mode?: CursorMode;
  customText?: string;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ mode = 'default', customText }) => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const targetPos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const clickable = target.closest('button, a, input, select, textarea, [data-cursor]');
        setIsPointer(!!clickable);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    let animationFrameId: number;
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const render = () => {
      currentPos.current.x = lerp(currentPos.current.x, targetPos.current.x, 0.18);
      currentPos.current.y = lerp(currentPos.current.y, targetPos.current.y, 0.18);
      setPos({ x: currentPos.current.x, y: currentPos.current.y });
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const isView = mode === 'view';
  const isDrag = mode === 'drag';
  const isCrosshair = mode === 'crosshair';

  return (
    <div
      className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 hidden md:block"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
      }}
    >
      {isView ? (
        <div className="w-16 h-16 rounded-full bg-[#E89D42] text-[#0B0B0B] flex items-center justify-center font-display font-bold text-xs tracking-widest shadow-2xl scale-100 transition-all">
          VIEW
        </div>
      ) : isDrag ? (
        <div className="px-4 py-2 rounded-full bg-[#0B0B0B]/90 border border-[#F1EEE7]/40 text-[#F1EEE7] flex items-center gap-2 font-mono-tech text-[10px] uppercase tracking-widest backdrop-blur-md">
          <span>‹</span> DRAG <span>›</span>
        </div>
      ) : isCrosshair ? (
        <div className="relative w-8 h-8 flex items-center justify-center text-[#E89D42]">
          <div className="absolute w-full h-[1px] bg-[#E89D42]/60" />
          <div className="absolute h-full w-[1px] bg-[#E89D42]/60" />
          <div className="w-2 h-2 rounded-full border border-[#E89D42] animate-ping" />
          <span className="absolute left-6 top-3 text-[9px] font-mono-tech tracking-wider whitespace-nowrap text-[#AAA7A0]">
            {customText || 'PT. 12.9716°N'}
          </span>
        </div>
      ) : (
        <div className="relative flex items-center justify-center">
          {/* Inner dot */}
          <div
            className={`w-1.5 h-1.5 rounded-full bg-[#F1EEE7] transition-all duration-200 ${
              isPointer ? 'scale-0' : 'scale-100'
            }`}
          />
          {/* Outer ring */}
          <div
            className={`absolute rounded-full border border-[#F1EEE7]/50 transition-all duration-300 ${
              isPointer
                ? 'w-10 h-10 border-[#E89D42] bg-[#E89D42]/10 scale-100'
                : 'w-7 h-7 scale-75 opacity-70'
            }`}
          />
        </div>
      )}
    </div>
  );
};
