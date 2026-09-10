'use client';

/**
 * Docs Section: Architecture, 3-Phase Ticker & Engine Comparison
 * Embeds TickerVisualizer and details reduced motion & benchmarks.
 * Strictly under 650 LOC.
 */

import React from 'react';
import { DocsCallout } from '../docs-callout';
import { TickerVisualizer } from '../interactive/ticker-visualizer';
import { Shield, Sparkles } from 'lucide-react';

interface DocArchitectureProps {
  sectionId: string;
}

const ARCHITECTURE_PARADIGMS = [
  {
    feature: 'Execution Pipeline',
    scrollcraft: 'Compositor Thread Native + 3-Phase Microtask Fallback',
    virtual: 'Window wheel hijacking & transform styles',
    stateDriven: 'React requestAnimationFrame state diffing',
    pureCss: 'Pure CSS animation-timeline: view()',
  },
  {
    feature: 'DOM Hierarchy Impact',
    scrollcraft: 'Headless asChild (Zero wrapper divs injected)',
    virtual: 'Injected wrapper divs & synthetic spacers',
    stateDriven: 'Requires wrapper motion.div nodes',
    pureCss: 'Native styles on existing element',
  },
  {
    feature: 'React Re-render Cost',
    scrollcraft: '0 Re-renders (Direct ref GPU mutations)',
    virtual: '0 to 60 re-renders per second',
    stateDriven: '60 to 120 re-renders per second (CPU heavy)',
    pureCss: '0 Re-renders (Executed outside JS)',
  },
  {
    feature: 'Cross-Browser Consistency',
    scrollcraft: 'Universal (Native on Chrome/Edge, JS on Safari/Firefox)',
    virtual: 'Inconsistent touch & trackpad momentum',
    stateDriven: 'Consistent but high CPU/battery draw',
    pureCss: 'Incomplete (No native Safari/Firefox support)',
  },
  {
    feature: 'App Router & Hydration Safety',
    scrollcraft: 'Hydration-safe Slot composition & boundary observers',
    virtual: 'Severe hydration mismatch & scroll lock bugs',
    stateDriven: 'High client-bundle penalty on server components',
    pureCss: 'Hydration-safe CSS attributes',
  },
  {
    feature: 'A11y & Reduced Motion',
    scrollcraft: 'Dual-Layer (Automated OS detection + manual opt-out)',
    virtual: 'Often ignores OS prefers-reduced-motion',
    stateDriven: 'Requires custom hook guards',
    pureCss: 'Requires manual media queries',
  },
  {
    feature: 'Core Bundle Footprint',
    scrollcraft: '< 4.2 KB (brotli, tree-shakeable)',
    virtual: '18 - 35 KB',
    stateDriven: '28 - 45 KB',
    pureCss: '0 KB JS runtime',
  },
];

export const DocArchitecture: React.FC<DocArchitectureProps> = ({
  sectionId,
}) => {
  if (sectionId === 'three-phase-ticker') {
    return (
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <div className="text-xs font-mono font-semibold text-[#FF5A1F] uppercase tracking-wider">
            Engine Architecture
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-100">
            3-Phase Ticker Pipeline
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed max-w-3xl">
            How ScrollCraft completely eliminates layout thrashing, avoids forced synchronous reflows, and locks in 120 FPS frame consistency.
          </p>
        </header>

        {/* Embedded Interactive Ticker Visualizer */}
        <TickerVisualizer />

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
            The Zero-Allocation Microtask Loop
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            In standard JavaScript animation libraries, reading layout properties (like <code className="font-mono text-xs text-rose-800 bg-rose-50 px-1 py-0.5 rounded">getBoundingClientRect()</code>) in the middle of writing styles (<code className="font-mono text-xs text-zinc-100 bg-white/10 px-1 py-0.5 rounded">el.style.transform = ...</code>) forces the browser to halt execution and recalculate page layout synchronously.
          </p>
          <p className="text-sm text-zinc-400 leading-relaxed">
            ScrollCraft operates a persistent 3-phase Ticker executed via <code className="font-mono text-xs text-zinc-100 bg-white/10 px-1 py-0.5 rounded">requestAnimationFrame</code>:
          </p>
          <div className="space-y-2 text-xs text-zinc-100">
            <div className="p-3 rounded-lg border border-white/10 bg-white/5">
              <strong>Phase 1: Measure</strong> — Reads window scroll, cached client rectangles, and screen dimensions. Absolutely zero DOM style writes permitted.
            </div>
            <div className="p-3 rounded-lg border border-white/10 bg-white/5">
              <strong>Phase 2: Update</strong> — Subpixel lerp math, spring physics, and kinetic damping computed purely in V8 memory without accessing any DOM properties.
            </div>
            <div className="p-3 rounded-lg border border-white/10 bg-white/5">
              <strong>Phase 3: Render</strong> — Batched GPU flush. Applies <code className="font-mono text-[11px] text-[#FF5A1F]">translate3d</code> and <code className="font-mono text-[11px] text-[#FF5A1F]">opacity</code> styles directly to registered element refs.
            </div>
          </div>
        </section>

        <DocsCallout type="tip" title="Result: Zero Dropped Frames">
          By isolating reads and writes into strict micro-phases, browser engines never experience forced reflows, maintaining smooth 120Hz display refresh rates on ProMotion and OLED displays.
        </DocsCallout>
      </div>
    );
  }

  if (sectionId === 'reduced-motion') {
    return (
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <div className="text-xs font-mono font-semibold text-[#FF5A1F] uppercase tracking-wider">
            Accessibility (a11y)
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-100">
            Dual-Layer Reduced Motion
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed max-w-3xl">
            Built-in OS-level vestibular disorder protection. ScrollCraft automatically honors user accessibility preferences out of the box.
          </p>
        </header>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
            How Dual-Layer Protection Operates
          </h2>
          <div className="space-y-3 text-sm text-zinc-400 leading-relaxed">
            <p>
              When a user has enabled &ldquo;Reduce Motion&rdquo; in macOS, Windows, iOS, or Android settings, ScrollCraft responds at two distinct layers:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl border border-white/10 bg-white/5 shadow-xs">
                <div className="flex items-center gap-2 text-[#FF5A1F] font-bold text-xs uppercase mb-2">
                  <Shield className="w-4 h-4" />
                  <span>Layer 1: Base Scroll</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Inertia smoothing is disabled. The page tracks 1:1 with native hardware scroll without lag or momentum damping.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-white/10 bg-white/5 shadow-xs">
                <div className="flex items-center gap-2 text-[#FF5A1F] font-bold text-xs uppercase mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Layer 2: Element Transforms</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  <code className="font-mono text-[10px] text-zinc-100">&lt;Parallax&gt;</code> zeroes out displacement (<code className="font-mono text-[10px]">translate3d(0, 0, 0)</code>), while <code className="font-mono text-[10px] text-zinc-100">&lt;Reveal&gt;</code> immediately reveals content with <code className="font-mono text-[10px]">opacity: 1</code>.
                </p>
              </div>
            </div>
          </div>
        </section>

        <DocsCallout type="note" title="WCAG 2.1 Compliance">
          Meeting WCAG 2.1 Success Criterion 2.3.3 (Animation from Interactions) requires animation to be disabled unless essential. ScrollCraft guarantees full compliance by default without requiring manual media query boilerplate.
        </DocsCallout>
      </div>
    );
  }

  // benchmark
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <div className="text-xs font-mono font-semibold text-[#FF5A1F] uppercase tracking-wider">
          Architecture & Perf
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-100">
          Engine Comparison
        </h1>
        <p className="text-lg text-zinc-400 leading-relaxed max-w-3xl">
          Direct feature-by-feature and architectural comparison with other popular web animation toolkits.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
          Architectural Paradigms Compared
        </h2>
        <p className="text-sm text-zinc-400 leading-relaxed">
          How different scroll engineering paradigms handle thread execution, DOM manipulation, and React rendering:
        </p>

        <div className="w-full rounded-2xl border border-white/10 bg-white/5 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs text-zinc-100 border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-[#080808] text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                <th className="py-3.5 px-4 w-[20%]">Dimension</th>
                <th className="py-3.5 px-4 w-[30%] text-[#FF5A1F] font-extrabold bg-[#FF5A1F]/10/40">
                  ScrollCraft (Hybrid)
                </th>
                <th className="py-3.5 px-4 w-[25%]">Virtual / Hijacked</th>
                <th className="py-3.5 px-4 w-[25%]">Component State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {ARCHITECTURE_PARADIGMS.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#080808]/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-zinc-100 align-top">
                    {row.feature}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-zinc-100 bg-[#FF5A1F]/10/20 align-top break-words">
                    <span className="text-[#FF5A1F] font-bold mr-1">✦</span>
                    {row.scrollcraft}
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400 align-top break-words">
                    {row.virtual}
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400 align-top break-words">
                    {row.stateDriven}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <DocsCallout type="tip" title="Headless Architecture by Principle">
        ScrollCraft is built to be a permanent, unopinionated foundational primitive in your frontend stack. Because it adheres strictly to standard DOM transforms and Radix-style Slot composition, it never locks your codebase into proprietary runtime architectures.
      </DocsCallout>
    </div>
  );
};

