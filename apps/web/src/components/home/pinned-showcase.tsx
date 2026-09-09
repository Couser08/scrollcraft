'use client';

/**
 * Pinned Showcase Section
 * Demonstrates the Zero-Spacer Pinning Engine and Multi-Keyframe Timeline DSL.
 * Strictly under 650 LOC.
 */

import React from 'react';
import { usePin, useScrollTimeline } from '@scrollcraft/react';
import { Cpu, Gauge, Layers, Sparkles } from 'lucide-react';

export const PinnedShowcase: React.FC = () => {
  const pin = usePin<HTMLDivElement>({ duration: 1000 });

  // Timeline choreography values driven by pin progress (0.0 to 1.0)
  const timeline = useScrollTimeline(pin.progress, {
    scale: [
      { from: 0.0, to: 0.5, startValue: 0.9, endValue: 1.05 },
      { from: 0.5, to: 1.0, startValue: 1.05, endValue: 1.0 },
    ],
    rotateX: [
      { from: 0.0, to: 0.5, startValue: 15, endValue: 0 },
      { from: 0.5, to: 1.0, startValue: 0, endValue: -10 },
    ],
    opacity: [
      { from: 0.0, to: 0.2, startValue: 0.6, endValue: 1 },
      { from: 0.8, to: 1.0, startValue: 1, endValue: 0.8 },
    ],
  });

  return (
    <div className="relative w-full min-h-[1200px] flex flex-col items-center justify-start py-20 px-6 sm:px-12">
      <div
        ref={pin.ref}
        className="w-full max-w-5xl flex flex-col items-center text-center gap-8 py-12"
        style={{
          perspective: '1200px',
        }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Sprint 2 Engine: Zero-Spacer Pinning & Timeline DSL</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white max-w-2xl leading-tight">
          Silky Smooth Pinning. <br />
          <span className="text-blue-500">Zero Layout Shift.</span>
        </h2>

        {/* 3D Scrubbed Interactive Card */}
        <div
          className="w-full max-w-3xl rounded-3xl bg-[#111218] border border-white/10 p-8 sm:p-12 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.9)] backdrop-blur-2xl transition-transform duration-75"
          style={{
            transform: `scale(${timeline.scale ?? 1}) rotateX(${timeline.rotateX ?? 0}deg)`,
            opacity: timeline.opacity ?? 1,
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-white font-semibold text-base">Direct Compositor</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Transforms write straight to GPU layers, bypassing 120 React re-renders per second.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-white font-semibold text-base">Zero Spacer Leak</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                No awkward spacer divs injected into DOM. Flexbox & Grid layouts stay completely untouched.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Gauge className="w-5 h-5" />
              </div>
              <h3 className="text-white font-semibold text-base">Scrub Progress</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Current Pin Offset: <span className="text-purple-400 font-mono font-bold">{Math.round(pin.pinOffsetY)}px</span> ({Math.round(pin.progress * 100)}%)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
