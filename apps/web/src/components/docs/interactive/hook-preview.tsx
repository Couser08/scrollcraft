'use client';

import React, { useState, useRef } from 'react';
import { Activity, ArrowUp, ArrowDown, Magnet } from 'lucide-react';

interface HookPreviewProps {
  hookId: string;
}

export const HookPreview: React.FC<HookPreviewProps> = ({ hookId }) => {
  const [scrollDelta, setScrollDelta] = useState(0);
  const [direction, setDirection] = useState<'down' | 'up' | 'idle'>('idle');
  const [isDown, setIsDown] = useState(false);
  const [isUp, setIsUp] = useState(false);
  const [magneticPos, setMagneticPos] = useState({ x: 0, y: 0 });
  const [routePath, setRoutePath] = useState('/docs');
  const [savedScroll, setSavedScroll] = useState<Record<string, number>>({ '/docs': 420 });
  const [currentScroll, setCurrentScroll] = useState(420);
  const [inertiaKilled, setInertiaKilled] = useState(false);
  const magnetRef = useRef<HTMLDivElement>(null);

  // Magnetic button cursor follower simulation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!magnetRef.current) return;
    const rect = magnetRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

    if (dist < 120) {
      const pullX = (e.clientX - centerX) * 0.35;
      const pullY = (e.clientY - centerY) * 0.35;
      setMagneticPos({ x: pullX, y: pullY });
    } else {
      setMagneticPos({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setMagneticPos({ x: 0, y: 0 });
  };

  // Scroll direction simulation
  const triggerDirection = (type: 'down' | 'up') => {
    const delta = type === 'down' ? 24 : -24;
    setScrollDelta((prev) => prev + delta);
    if (type === 'down') {
      setDirection('down');
      setIsDown(true);
      setIsUp(false);
    } else {
      setDirection('up');
      setIsDown(false);
      setIsUp(true);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#0a0a0d] overflow-hidden p-6 shadow-2xl space-y-5 not-prose">
      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300">
            Hook Runtime Simulator
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
            Zero-Rerender DOM Pipeline
          </span>
        </div>

        <div className="text-[11px] font-mono text-zinc-400">
          Engine Status: <span className="text-emerald-400 font-bold">ACTIVE &bull; 120 FPS TICKER</span>
        </div>
      </div>

      {/* Stage */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative min-h-[190px] rounded-xl bg-zinc-950 border border-zinc-850 overflow-hidden flex items-center justify-center p-6 select-none"
      >
        {/* 1. useScrollDirection */}
        {hookId === 'use-scroll-direction' && (
          <div className="w-full max-w-md space-y-4 text-center font-mono">
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => triggerDirection('up')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 border border-zinc-800 transition-colors cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
                <span>Simulate Scroll Up</span>
              </button>
              <button
                onClick={() => triggerDirection('down')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 border border-zinc-800 transition-colors cursor-pointer"
              >
                <ArrowDown className="w-3.5 h-3.5 text-violet-400" />
                <span>Simulate Scroll Down</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 grid grid-cols-4 gap-2 text-xs">
              <div className="p-2 rounded bg-zinc-950 border border-zinc-850">
                <span className="text-zinc-500 text-[10px] block">DELTA</span>
                <strong className="text-zinc-300 text-sm">{scrollDelta}px</strong>
              </div>
              <div className="p-2 rounded bg-zinc-950 border border-zinc-850">
                <span className="text-zinc-500 text-[10px] block">DIRECTION</span>
                <strong className={direction === 'down' ? 'text-violet-400 text-sm' : direction === 'up' ? 'text-cyan-400 text-sm' : 'text-zinc-500'}>
                  {direction.toUpperCase()}
                </strong>
              </div>
              <div className="p-2 rounded bg-zinc-950 border border-zinc-850">
                <span className="text-zinc-500 text-[10px] block">isDown</span>
                <strong className={isDown ? 'text-emerald-400 text-sm' : 'text-zinc-600 text-sm'}>
                  {isDown ? 'TRUE' : 'FALSE'}
                </strong>
              </div>
              <div className="p-2 rounded bg-zinc-950 border border-zinc-850">
                <span className="text-zinc-500 text-[10px] block">isUp</span>
                <strong className={isUp ? 'text-emerald-400 text-sm' : 'text-zinc-600 text-sm'}>
                  {isUp ? 'TRUE' : 'FALSE'}
                </strong>
              </div>
            </div>
            <span className="text-[10px] text-zinc-500 block">
              Hysteresis threshold: 8px &bull; guardTop iOS rubber-band suppression active
            </span>
          </div>
        )}

        {/* 2. useScrollRestoration */}
        {hookId === 'use-scroll-restoration' && (
          <div className="w-full max-w-md space-y-4 text-center font-mono text-xs">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => {
                  setSavedScroll((prev) => ({ ...prev, [routePath]: currentScroll }));
                  const next = routePath === '/docs' ? '/roadmap' : '/docs';
                  setRoutePath(next);
                  setInertiaKilled(true);
                  setCurrentScroll(savedScroll[next] ?? 0);
                  setTimeout(() => setInertiaKilled(false), 800);
                }}
                className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold transition-colors cursor-pointer"
              >
                Navigate to {routePath === '/docs' ? '/roadmap' : '/docs'}
              </button>
              <button
                onClick={() => {
                  setInertiaKilled(true);
                  setCurrentScroll(savedScroll[routePath] ?? 0);
                  setTimeout(() => setInertiaKilled(false), 800);
                }}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors cursor-pointer"
              >
                History Back
              </button>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 grid grid-cols-3 gap-2">
              <div className="p-2 rounded bg-zinc-950 border border-zinc-850">
                <span className="text-zinc-500 text-[10px] block">CURRENT ROUTE</span>
                <strong className="text-cyan-400 text-xs">{routePath}</strong>
              </div>
              <div className="p-2 rounded bg-zinc-950 border border-zinc-850">
                <span className="text-zinc-500 text-[10px] block">RESTORED OFFSET</span>
                <strong className="text-violet-400 text-sm">{currentScroll}px</strong>
              </div>
              <div className="p-2 rounded bg-zinc-950 border border-zinc-850">
                <span className="text-zinc-500 text-[10px] block">INERTIA KILL</span>
                <strong className={inertiaKilled ? 'text-amber-400 text-xs' : 'text-emerald-400 text-xs'}>
                  {inertiaKilled ? 'KILLED' : 'READY'}
                </strong>
              </div>
            </div>
            <span className="text-[10px] text-zinc-500 block">
              SessionStorage LRU backing &bull; 0px jump prevention across RSC streams
            </span>
          </div>
        )}

        {/* 3. useMagnetic */}
        {hookId === 'use-magnetic' && (
          <div className="flex flex-col items-center gap-3">
            <div
              ref={magnetRef}
              style={{
                transform: `translate(${magneticPos.x}px, ${magneticPos.y}px)`,
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-mono text-xs font-bold shadow-lg shadow-violet-500/20 flex items-center gap-2 cursor-pointer transition-transform duration-75"
            >
              <Magnet className="w-4 h-4 text-cyan-300" />
              <span>Hover Near Me (Magnetic Spring)</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-400">
              Offset: dx {magneticPos.x.toFixed(1)}px, dy {magneticPos.y.toFixed(1)}px &bull; Radius: 120px
            </span>
          </div>
        )}

        {/* 4. useScrollTimeline */}
        {hookId === 'use-scroll-timeline' && (
          <div className="w-full max-w-sm space-y-3 font-mono text-xs text-center">
            <div className="flex justify-between items-center text-zinc-400 text-[11px]">
              <span>Keyframe 0.0 (Scale: 0.8)</span>
              <span>0.5 (Scale: 1.0)</span>
              <span>1.0 (Scale: 1.2)</span>
            </div>
            <div className="h-24 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <div className="px-4 py-2 rounded-lg bg-violet-600/30 border border-violet-500 text-white font-bold text-xs">
                Multi-Stage Keyframe Interpolator
              </div>
            </div>
            <span className="text-[10px] text-zinc-500 block">
              Direct GPU compositor keyframe scrubbing &bull; Zero Virtual DOM re-renders
            </span>
          </div>
        )}

        {/* 5. Fallback for other hooks */}
        {![
          'use-scroll-direction',
          'use-scroll-restoration',
          'use-magnetic',
          'use-scroll-timeline',
        ].includes(hookId) && (
          <div className="w-full max-w-md p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center space-y-2 font-mono text-xs">
            <div className="flex items-center justify-center gap-2 text-violet-400 font-bold">
              <Activity className="w-4 h-4" />
              <span>ScrollCraft Hardware Frame Tick</span>
            </div>
            <p className="text-zinc-300 text-xs font-sans">
              Hook operates directly in the central Ticker loop with zero layout shifts and direct DOM ref mutations.
            </p>
            <div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-400 pt-2">
              <span className="p-1.5 rounded bg-zinc-950 border border-zinc-850">PHASE: RENDER / WRITE</span>
              <span className="p-1.5 rounded bg-zinc-950 border border-zinc-850">BUDGET: &lt; 1.5ms</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
