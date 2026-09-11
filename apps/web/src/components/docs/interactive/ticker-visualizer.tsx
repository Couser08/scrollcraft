'use client';

/**
 * 3-Phase Ticker Visual Pipeline Simulator
 * Demonstrates batching: Measure -> Update -> Render vs Forced Synchronous Reflow.
 * Strictly under 650 LOC.
 */

import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Cpu } from 'lucide-react';

export const TickerVisualizer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'comparison'>('pipeline');
  const [selectedPhase, setSelectedPhase] = useState<number>(1);

  const PHASES = [
    {
      step: 1,
      name: 'Phase 1: Measure',
      subtitle: 'Batch DOM Reads',
      badge: 'DOM Reads Only',
      color: 'border-blue-500 bg-blue-50/50 text-blue-700',
      tagBg: 'bg-blue-100 text-blue-800',
      description:
        'All layout reads (window.scrollY, element.getBoundingClientRect(), viewport heights) are executed in a single synchronized micro-batch. Writes are strictly forbidden.',
      codeSnippet: `// Phase 1: Pure Reads
const scrollY = window.scrollY;
const rect = target.getBoundingClientRect();
const viewportHeight = window.innerHeight;`,
    },
    {
      step: 2,
      name: 'Phase 2: Update',
      subtitle: 'Pure Memory Math',
      badge: 'Zero DOM Touch',
      color: 'border-blue-500 bg-blue-500/10/50 text-blue-500',
      tagBg: 'bg-blue-500/10 text-blue-500 border border-[#FFEDD5]',
      description:
        'Subpixel lerp calculations, spring physics, velocity derivation, and timeline normalization occur purely in V8 memory without accessing any DOM properties.',
      codeSnippet: `// Phase 2: Memory Calculations
const delta = targetScroll - currentScroll;
currentScroll += delta * lerpFactor;
const progress = clamp(currentScroll / maxScroll, 0, 1);`,
    },
    {
      step: 3,
      name: 'Phase 3: Render',
      subtitle: 'GPU Compositor Writes',
      badge: 'Direct GPU Writes',
      color: 'border-emerald-500 bg-emerald-50/50 text-emerald-700',
      tagBg: 'bg-emerald-100 text-emerald-800',
      description:
        'Direct hardware-accelerated writes to element style properties (translate3d, opacity) in one batched flush. Bypasses React reconciliation and prevents reflows.',
      codeSnippet: `// Phase 3: Direct GPU Flush (0 React re-renders)
node.style.transform = \`translate3d(0px, \${offset}px, 0px)\`;
node.style.opacity = progress.toFixed(3);`,
    },
  ];

  return (
    <div className="my-6 rounded-2xl border border-white/10 bg-[#080808] overflow-hidden shadow-xs">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-blue-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-100">
            Architecture Pipeline Visualizer
          </span>
        </div>
        <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === 'pipeline'
                ? 'bg-white/5 text-zinc-100 shadow-xs font-semibold'
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            3-Phase Flow
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === 'comparison'
                ? 'bg-white/5 text-zinc-100 shadow-xs font-semibold'
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            Reflow vs 120 FPS
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {activeTab === 'pipeline' ? (
          <div className="flex flex-col gap-6">
            {/* 3 Step Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {PHASES.map((p) => {
                const isSelected = selectedPhase === p.step;
                return (
                  <button
                    key={p.step}
                    onClick={() => setSelectedPhase(p.step)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-white/5 shadow-md ring-1 ring-blue-500/20'
                        : 'border-white/10 bg-white/5 hover:border-[#D1D5DB]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-zinc-400">
                        STEP 0{p.step}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${p.tagBg}`}>
                        {p.badge}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-zinc-100">{p.name}</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">{p.subtitle}</p>
                  </button>
                );
              })}
            </div>

            {/* Selected Phase Detail & Code Preview */}
            <div className="p-5 rounded-xl border border-white/10 bg-white/5 shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <span className="p-1 rounded-md bg-blue-500/10 text-blue-500">
                  <Cpu className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-zinc-100">
                  {PHASES[selectedPhase - 1].name}: {PHASES[selectedPhase - 1].subtitle}
                </h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                {PHASES[selectedPhase - 1].description}
              </p>
              <div className="rounded-lg bg-[#000] border border-white/10/90 p-3.5 text-xs font-mono text-zinc-100 overflow-x-auto">
                <pre className="text-[12px] leading-relaxed text-zinc-300 font-mono">
                  {PHASES[selectedPhase - 1].codeSnippet}
                </pre>
              </div>
            </div>
          </div>
        ) : (
          /* Comparison: Layout Thrashing vs ScrollCraft */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* The Naive Way */}
            <div className="p-5 rounded-xl border border-rose-200 bg-rose-50/40 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Naive Way (Forced Reflow)</span>
                </div>
                <div className="space-y-2 text-xs text-zinc-700 leading-relaxed">
                  <p>
                    <code className="font-mono text-[11px] bg-rose-100 text-rose-900 px-1 py-0.5 rounded">window.addEventListener(&apos;scroll&apos;)</code>
                  </p>
                  <p className="text-zinc-400">
                    Interleaving <code className="font-mono text-[10px] text-rose-800">element.offsetTop</code> (Read) with <code className="font-mono text-[10px] text-rose-800">element.style.top</code> (Write) causes browser layout thrashing. The main JS thread stalls repeatedly to recalculate geometry.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-rose-200 flex items-center justify-between text-xs font-mono text-rose-800 font-semibold">
                <span>Display Metric:</span>
                <span>Drops to 20–45 FPS</span>
              </div>
            </div>

            {/* The ScrollCraft Way */}
            <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/40 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>ScrollCraft 3-Phase Ticker</span>
                </div>
                <div className="space-y-2 text-xs text-zinc-700 leading-relaxed">
                  <p>
                    <code className="font-mono text-[11px] bg-emerald-100 text-emerald-900 px-1 py-0.5 rounded">Zero-Allocation Compositor Writes</code>
                  </p>
                  <p className="text-zinc-400">
                    Strict separation: All Reads executed first, calculations computed in memory, and all GPU writes flushed in a single render pass. Zero React component re-renders per frame.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-emerald-200 flex items-center justify-between text-xs font-mono text-emerald-800 font-semibold">
                <span>Display Metric:</span>
                <span className="text-emerald-700 font-bold">Locked 120 FPS</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

