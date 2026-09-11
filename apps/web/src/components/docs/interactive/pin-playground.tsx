'use client';

import React, { useState, useRef } from 'react';
import { Pin, PinContainer } from '@scrollcraft/react';
import { PlaygroundShell } from './playground-shell';
import { Pin as PinIcon, ShieldCheck, Zap } from 'lucide-react';

export const PinPlayground: React.FC = () => {
  const [pinDuration, setPinDuration] = useState<number>(140); // vh
  const containerRef = useRef<HTMLDivElement>(null);

  // Telemetry DOM refs for zero React re-renders on scroll
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const statusBadgeRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const handleScrollToProgress = (fraction: number) => {
    const el = containerRef.current;
    if (!el || typeof window === 'undefined') return;

    const rect = el.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    const elTop = rect.top + scrollTop;
    const totalDistance = rect.height - window.innerHeight;
    const targetScrollY = elTop + fraction * totalDistance;

    window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
  };

  const codeSnippet = `<PinContainer height="${pinDuration}vh" className="relative w-full">
  {/* Locks seamlessly in place without fake dummy spacers */}
  <Pin top={90} onProgress={(p) => updateHud(p)}>
    <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl">
      <h3 className="text-xl font-bold text-white">Sticky Narrative Focus</h3>
      <p className="text-xs text-zinc-400">Locked for ${pinDuration}vh of scroll travel</p>
    </div>
  </Pin>
</PinContainer>`;

  return (
    <PlaygroundShell
      title="<Pin /> Sticky Contract Sandbox"
      badge="@scrollcraft/react"
      driverType="sticky"
      onReset={() => setPinDuration(140)}
      codeSnippet={codeSnippet}
      codeFileName="PinNarrative.tsx"
      controls={
        <div className="flex flex-col gap-3.5">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
              <span className="text-zinc-300 font-medium">Pin Duration Budget</span>
              <span className="text-blue-400 font-semibold">{pinDuration}vh</span>
            </div>
            <input
              type="range"
              min="100"
              max="220"
              step="20"
              value={pinDuration}
              onChange={(e) => setPinDuration(Number(e.target.value))}
              className="w-full accent-blue-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 mt-1 font-mono">
              <span>100vh (Compact)</span>
              <span>140vh (Balanced)</span>
              <span>220vh (Extended)</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-zinc-400 block mb-1.5">
              Jump through Sticky Zone
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleScrollToProgress(0)}
                className="py-1.5 px-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                Entry (0%)
              </button>
              <button
                onClick={() => handleScrollToProgress(0.5)}
                className="py-1.5 px-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                Locked (50%)
              </button>
              <button
                onClick={() => handleScrollToProgress(1.0)}
                className="py-1.5 px-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                Release (100%)
              </button>
            </div>
          </div>
        </div>
      }
      telemetry={
        <>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Sticky Pin State:</span>
            <span ref={statusBadgeRef} className="text-zinc-400 font-mono">
              UNPINNED (FLOW)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Pin Budget Progress:</span>
            <span ref={progressTextRef} className="text-blue-400 font-bold font-mono">
              0.0%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">DOM Spacers Injected:</span>
            <span className="text-emerald-400 font-semibold font-mono">
              0 dummy divs (Pure CSS)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Layout Hierarchy:</span>
            <span className="text-white font-mono">Grid & Flex Safe</span>
          </div>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <div className="text-[11px] font-mono text-zinc-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <PinIcon className="w-3.5 h-3.5 text-blue-400" />
            <span>Real &lt;Pin /&gt; Narrative Container ({pinDuration}vh)</span>
          </span>
          <span className="text-zinc-500">Scroll down to lock card in place</span>
        </div>

        {/* Real <PinContainer> and <Pin> from @scrollcraft/react */}
        <div
          ref={containerRef}
          className="rounded-2xl border border-zinc-800/80 bg-[#060608] overflow-hidden shadow-inner relative p-4"
        >
          <PinContainer height={`${pinDuration}vh`} className="w-full">
            <Pin
              top={90}
              onProgress={(p) => {
                const norm = Math.max(0, Math.min(1, p));
                if (progressTextRef.current) {
                  progressTextRef.current.textContent = `${(norm * 100).toFixed(1)}%`;
                }
                if (statusBadgeRef.current) {
                  if (norm > 0.02 && norm < 0.98) {
                    statusBadgeRef.current.textContent = 'PINNED (LOCKED) 📌';
                    statusBadgeRef.current.className = 'text-emerald-400 font-bold font-mono';
                  } else {
                    statusBadgeRef.current.textContent = 'UNPINNED (FLOW)';
                    statusBadgeRef.current.className = 'text-zinc-400 font-mono';
                  }
                }
                if (progressBarRef.current) {
                  progressBarRef.current.style.transform = `scaleX(${norm})`;
                }
              }}
            >
              <div className="p-6 rounded-2xl bg-zinc-900/95 border border-zinc-700/80 shadow-2xl flex flex-col justify-between max-w-md mx-auto backdrop-blur-md">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                      STICKY STORYTELLING
                    </span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h4 className="text-base font-extrabold text-white mb-1.5">
                    Zero Spacer Injection
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    This element sticks natively via CSS <code className="text-zinc-200">position: sticky</code> while you scroll through the {pinDuration}vh container. It never injects dummy height spacers.
                  </p>
                </div>

                {/* Progress bar inside the pinned card */}
                <div className="mt-5 pt-3 border-t border-zinc-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                    <span>PIN BUDGET METRIC</span>
                    <Zap className="w-3 h-3 text-blue-400" />
                  </div>
                  <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                    <div
                      ref={progressBarRef}
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 origin-left transition-transform duration-75 will-change-transform"
                      style={{ transform: 'scaleX(0)' }}
                    />
                  </div>
                </div>
              </div>
            </Pin>
          </PinContainer>
        </div>
      </div>
    </PlaygroundShell>
  );
};
