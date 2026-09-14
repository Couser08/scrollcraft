'use client';

/**
 * ScrollCraft Section 4: Engine & Architecture
 * - Headline: "Not a wrapper. An engine."
 * - Static architecture diagram (Core Engine → React Bindings → Primitives/Hooks).
 * - Deliberately not scroll-animated for engineering authority and scannability.
 */

import React from 'react';
import { Reveal } from '@scrollcraft/react';
import { Layers, Cpu, ShieldCheck, Zap, ArrowDown, GitBranch } from 'lucide-react';

export function EngineArchitectureSection() {
  return (
    <section id="architecture" className="relative w-full bg-[#050505] py-24 sm:py-32 px-6 border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <Reveal direction="down" distance={15}>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400 mb-3 block">
              Engine Architecture &bull; Engineering Authority
            </span>
          </Reveal>
          <Reveal direction="up" distance={20} delay={0.1}>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight mb-4">
              Not a wrapper. <br />
              <span className="text-zinc-400">An engine.</span>
            </h2>
          </Reveal>
          <Reveal direction="up" distance={15} delay={0.2}>
            <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto font-sans">
              A 3-phase deterministic microtask pipeline executing between hardware vSync ticks and React component reconciliation.
            </p>
          </Reveal>
        </div>

        {/* Static Architecture Diagram */}
        <div className="w-full max-w-5xl mx-auto mb-16">
          <div className="rounded-2xl border border-zinc-800 bg-[#09090b] p-6 sm:p-10 shadow-2xl space-y-8">
            
            {/* Layer 1: Core Engine */}
            <div className="p-6 rounded-xl bg-zinc-950 border border-blue-500/30 relative shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-zinc-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                    <Cpu className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-mono">@scrollcraft/core</h3>
                    <span className="text-[11px] text-zinc-400 font-sans">Zero-dependency hardware-timed math &amp; physics kernel</span>
                  </div>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 self-start sm:self-auto font-semibold">
                  &lt; 4.2 KB brotli
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800/80">
                  <span className="text-blue-400 font-semibold block mb-1">3-Phase Ticker</span>
                  <span className="text-zinc-400 text-[11px] font-sans">Measure &rarr; Mutate &rarr; Render loop eliminates layout thrashing.</span>
                </div>
                <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800/80">
                  <span className="text-blue-400 font-semibold block mb-1">Inertia Physics</span>
                  <span className="text-zinc-400 text-[11px] font-sans">Lenis subpixel momentum normalization across trackpads &amp; wheels.</span>
                </div>
                <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800/80">
                  <span className="text-blue-400 font-semibold block mb-1">ScrollValue Mutators</span>
                  <span className="text-zinc-400 text-[11px] font-sans">Direct GPU style writes bypassing React virtual DOM diffing.</span>
                </div>
              </div>
            </div>

            {/* Connecting Flow Arrow */}
            <div className="flex items-center justify-center text-zinc-600 gap-2 font-mono text-xs">
              <ArrowDown className="w-4 h-4 text-blue-400 animate-bounce" />
              <span>Reactive Context &amp; Headless Bindings Bridge</span>
              <ArrowDown className="w-4 h-4 text-blue-400 animate-bounce" />
            </div>

            {/* Layer 2: React Bindings */}
            <div className="p-6 rounded-xl bg-zinc-950 border border-indigo-500/30 relative shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-zinc-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                    <GitBranch className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-mono">@scrollcraft/react</h3>
                    <span className="text-[11px] text-zinc-400 font-sans">React 18/19 &amp; Next.js 15 App Router bindings</span>
                  </div>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 self-start sm:self-auto font-semibold">
                  RSC Compatible
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Primitives */}
                <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-xs font-mono font-bold text-white uppercase">Declarative Primitives</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-sans">
                    Radix-style Slot composition with zero wrapper div pollution.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['<Parallax />', '<Reveal />', '<Pin />', '<ScrollProgress />'].map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hooks */}
                <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs font-mono font-bold text-white uppercase">Headless Reactive Hooks</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-sans">
                    Precision telemetry hooks with opt-in reactive re-renders or 0 re-render ref binding.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['useScrollProgress', 'useParallax', 'useReveal', 'usePin', 'useTicker'].map((h) => (
                      <span key={h} className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300">
                        {h}()
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Engineering Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="p-6 rounded-2xl border border-zinc-800 bg-[#09090b] space-y-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-base font-bold text-white font-mono">0 React Re-renders</h4>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Scroll physics write directly to ref element transform matrices at hardware monitor refresh rates (60Hz / 120Hz / 144Hz). React virtual DOM is never queried during scroll frames.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-800 bg-[#09090b] space-y-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Cpu className="w-4 h-4" />
            </div>
            <h4 className="text-base font-bold text-white font-mono">Lenis Physics Native</h4>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Built-in subpixel inertia interpolation creates frictionless, butter-smooth scroll feel without wheel hijacking or breaking native accessibility keyboard shortcuts.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-800 bg-[#09090b] space-y-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Layers className="w-4 h-4" />
            </div>
            <h4 className="text-base font-bold text-white font-mono">Next.js 15 RSC Safe</h4>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Designed specifically for React Server Components. Wrap your layout once with &lt;ScrollProvider /&gt; and pass Server Components as children with zero hydration mismatches.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
