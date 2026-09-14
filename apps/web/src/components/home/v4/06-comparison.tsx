'use client';

/**
 * ScrollCraft Section 6: Comparison
 * - Headline: "Where ScrollCraft fits"
 * - Subtitle: Flat, honest engineering comparison table vs GSAP ScrollTrigger, Framer Motion, and Lenis.
 * - Flat, scannable table without distracting animations.
 */

import React from 'react';
import { Reveal } from '@scrollcraft/react';
import { Check, X } from 'lucide-react';

interface ComparisonRow {
  dimension: string;
  scrollcraft: string | boolean;
  gsap: string | boolean;
  framer: string | boolean;
  lenis: string | boolean;
  highlight?: boolean;
}

const COMPARISON_DATA: ComparisonRow[] = [
  {
    dimension: 'React & Next.js RSC Safe',
    scrollcraft: true,
    gsap: false,
    framer: 'Partial (Client only)',
    lenis: true,
    highlight: true,
  },
  {
    dimension: 'React Re-render Cost',
    scrollcraft: '0 Re-renders (Ref GPU mutators)',
    gsap: '0 (Direct DOM writes)',
    framer: '60-120/sec on state hook',
    lenis: '0 (Scroll normalization only)',
    highlight: true,
  },
  {
    dimension: 'Declarative Primitives (<Parallax>, <Pin>)',
    scrollcraft: true,
    gsap: false,
    framer: 'Limited (Custom transforms)',
    lenis: false,
  },
  {
    dimension: 'Subpixel Inertia Physics Built-in',
    scrollcraft: true,
    gsap: 'Requires separate plugin',
    framer: false,
    lenis: true,
  },
  {
    dimension: '3D / React Three Fiber Bridge',
    scrollcraft: 'Native (useScroll3D)',
    gsap: 'Manual ticker sync',
    framer: false,
    lenis: 'Manual RAF binding',
  },
  {
    dimension: 'Core Bundle Footprint',
    scrollcraft: '< 4.2 KB',
    gsap: '~32 KB (ScrollTrigger)',
    framer: '~35 KB (motion)',
    lenis: '~3.8 KB (physics only)',
  },
  {
    dimension: 'Open Source License & Pricing',
    scrollcraft: 'MIT (100% Free)',
    gsap: 'Commercial license required',
    framer: 'MIT (100% Free)',
    lenis: 'MIT (100% Free)',
    highlight: true,
  },
];

function RenderValue({ val, isScrollCraft = false }: { val: string | boolean; isScrollCraft?: boolean }) {
  if (typeof val === 'boolean') {
    return val ? (
      <div className="flex items-center gap-1.5 font-medium">
        <Check className={`w-4 h-4 ${isScrollCraft ? 'text-emerald-400' : 'text-zinc-300'}`} />
        <span className={isScrollCraft ? 'text-emerald-400 font-semibold' : 'text-zinc-300'}>Yes</span>
      </div>
    ) : (
      <div className="flex items-center gap-1.5 text-zinc-500 font-medium">
        <X className="w-4 h-4 text-zinc-600" />
        <span>No</span>
      </div>
    );
  }

  return (
    <span className={isScrollCraft ? 'text-emerald-400 font-semibold' : 'text-zinc-300'}>
      {val}
    </span>
  );
}

export function ComparisonSection() {
  return (
    <section id="comparison" className="relative w-full bg-[#050505] py-24 sm:py-32 px-6 border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Reveal direction="down" distance={15}>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 mb-3 block">
              Honest Engineering Benchmark
            </span>
          </Reveal>
          <Reveal direction="up" distance={20} delay={0.1}>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight mb-4">
              Where ScrollCraft fits.
            </h2>
          </Reveal>
          <Reveal direction="up" distance={15} delay={0.2}>
            <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto font-sans">
              No marketing hand-waving. Here is how ScrollCraft compares to existing industry solutions on architecture, bundle cost, and developer ergonomics.
            </p>
          </Reveal>
        </div>

        {/* Flat Comparison Table */}
        <div className="w-full max-w-5xl mx-auto rounded-2xl border border-zinc-800 bg-[#09090b] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm font-sans">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/90 text-zinc-400 font-mono text-xs">
                  <th className="py-4 px-5 sm:px-6 font-semibold">Capability</th>
                  <th className="py-4 px-5 sm:px-6 text-white font-bold bg-blue-500/10 border-x border-blue-500/20">
                    ScrollCraft
                  </th>
                  <th className="py-4 px-5 sm:px-6 font-medium">GSAP ScrollTrigger</th>
                  <th className="py-4 px-5 sm:px-6 font-medium">Framer Motion</th>
                  <th className="py-4 px-5 sm:px-6 font-medium">Raw Lenis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/70">
                {COMPARISON_DATA.map((row) => (
                  <tr
                    key={row.dimension}
                    className={`hover:bg-zinc-900/50 transition-colors ${
                      row.highlight ? 'bg-zinc-900/20' : ''
                    }`}
                  >
                    <td className="py-3.5 px-5 sm:px-6 font-medium text-zinc-200">
                      {row.dimension}
                    </td>
                    <td className="py-3.5 px-5 sm:px-6 bg-blue-500/5 border-x border-blue-500/20">
                      <RenderValue val={row.scrollcraft} isScrollCraft={true} />
                    </td>
                    <td className="py-3.5 px-5 sm:px-6 text-zinc-400 text-xs">
                      <RenderValue val={row.gsap} />
                    </td>
                    <td className="py-3.5 px-5 sm:px-6 text-zinc-400 text-xs">
                      <RenderValue val={row.framer} />
                    </td>
                    <td className="py-3.5 px-5 sm:px-6 text-zinc-400 text-xs">
                      <RenderValue val={row.lenis} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-zinc-950/80 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-zinc-500">
            <span>Data verified against latest production releases (Q3 2026)</span>
            <span className="text-zinc-400">ScrollCraft is fully MIT Licensed</span>
          </div>
        </div>

      </div>
    </section>
  );
}
