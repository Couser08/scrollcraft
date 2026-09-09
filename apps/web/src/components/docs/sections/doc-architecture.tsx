'use client';

/**
 * Docs Section: Architecture, 3-Phase Ticker & Engine Comparison
 * Embeds TickerVisualizer and details reduced motion & benchmarks.
 * Strictly under 650 LOC.
 */

import React from 'react';
import { DocsCallout } from '../docs-callout';
import { TickerVisualizer } from '../interactive/ticker-visualizer';
import { Check, X, Shield, Sparkles } from 'lucide-react';

interface DocArchitectureProps {
  sectionId: string;
}

const BENCHMARK_DATA = [
  {
    feature: 'Architecture Model',
    scrollcraft: 'Direct GPU (0 re-renders)',
    gsap: 'Imperative Plugin',
    framer: 'Component State (Re-renders)',
    locomotive: 'DOM Virtual Scroll Transform',
  },
  {
    feature: 'React 19 & Next.js 15 Native',
    scrollcraft: true,
    gsap: false,
    framer: true,
    locomotive: false,
  },
  {
    feature: 'Radix asChild Composition',
    scrollcraft: true,
    gsap: false,
    framer: false,
    locomotive: false,
  },
  {
    feature: 'Compositor 3D Bridge (@scrollcraft/r3f)',
    scrollcraft: true,
    gsap: false,
    framer: false,
    locomotive: false,
  },
  {
    feature: 'Dual-Layer Reduced Motion (a11y)',
    scrollcraft: true,
    gsap: false,
    framer: 'Partial',
    locomotive: false,
  },
  {
    feature: 'Core Bundle Footprint',
    scrollcraft: '< 4.2 KB (brotli)',
    gsap: '~ 24 KB',
    framer: '~ 32 KB',
    locomotive: '~ 18 KB',
  },
  {
    feature: 'License / Pricing',
    scrollcraft: 'MIT (100% Free Core)',
    gsap: 'Restricted Commercial (Club GSAP)',
    framer: 'MIT',
    locomotive: 'MIT',
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
          <h1 className="text-4xl font-extrabold tracking-tight text-[#0A0A0A]">
            3-Phase Ticker Pipeline
          </h1>
          <p className="text-lg text-[#6B7280] leading-relaxed max-w-3xl">
            How ScrollCraft completely eliminates layout thrashing, avoids forced synchronous reflows, and locks in 120 FPS frame consistency.
          </p>
        </header>

        {/* Embedded Interactive Ticker Visualizer */}
        <TickerVisualizer />

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-[#0A0A0A]">
            The Zero-Allocation Microtask Loop
          </h2>
          <p className="text-sm text-[#6B7280] leading-relaxed">
            In standard JavaScript animation libraries, reading layout properties (like <code className="font-mono text-xs text-rose-800 bg-rose-50 px-1 py-0.5 rounded">getBoundingClientRect()</code>) in the middle of writing styles (<code className="font-mono text-xs text-[#0A0A0A] bg-[#F3F4F6] px-1 py-0.5 rounded">el.style.transform = ...</code>) forces the browser to halt execution and recalculate page layout synchronously.
          </p>
          <p className="text-sm text-[#6B7280] leading-relaxed">
            ScrollCraft operates a persistent 3-phase Ticker executed via <code className="font-mono text-xs text-[#0A0A0A] bg-[#F3F4F6] px-1 py-0.5 rounded">requestAnimationFrame</code>:
          </p>
          <div className="space-y-2 text-xs text-[#0A0A0A]">
            <div className="p-3 rounded-lg border border-[#E5E7EB] bg-white">
              <strong>Phase 1: Measure</strong> — Reads window scroll, cached client rectangles, and screen dimensions. Absolutely zero DOM style writes permitted.
            </div>
            <div className="p-3 rounded-lg border border-[#E5E7EB] bg-white">
              <strong>Phase 2: Update</strong> — Subpixel lerp math, spring physics, and kinetic damping computed purely in V8 memory without accessing any DOM properties.
            </div>
            <div className="p-3 rounded-lg border border-[#E5E7EB] bg-white">
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
          <h1 className="text-4xl font-extrabold tracking-tight text-[#0A0A0A]">
            Dual-Layer Reduced Motion
          </h1>
          <p className="text-lg text-[#6B7280] leading-relaxed max-w-3xl">
            Built-in OS-level vestibular disorder protection. ScrollCraft automatically honors user accessibility preferences out of the box.
          </p>
        </header>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-[#0A0A0A]">
            How Dual-Layer Protection Operates
          </h2>
          <div className="space-y-3 text-sm text-[#6B7280] leading-relaxed">
            <p>
              When a user has enabled &ldquo;Reduce Motion&rdquo; in macOS, Windows, iOS, or Android settings, ScrollCraft responds at two distinct layers:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl border border-[#E5E7EB] bg-white shadow-xs">
                <div className="flex items-center gap-2 text-[#FF5A1F] font-bold text-xs uppercase mb-2">
                  <Shield className="w-4 h-4" />
                  <span>Layer 1: Base Scroll</span>
                </div>
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  Inertia smoothing is disabled. The page tracks 1:1 with native hardware scroll without lag or momentum damping.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-[#E5E7EB] bg-white shadow-xs">
                <div className="flex items-center gap-2 text-[#FF5A1F] font-bold text-xs uppercase mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Layer 2: Element Transforms</span>
                </div>
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  <code className="font-mono text-[10px] text-[#0A0A0A]">&lt;Parallax&gt;</code> zeroes out displacement (<code className="font-mono text-[10px]">translate3d(0, 0, 0)</code>), while <code className="font-mono text-[10px] text-[#0A0A0A]">&lt;Reveal&gt;</code> immediately reveals content with <code className="font-mono text-[10px]">opacity: 1</code>.
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
        <h1 className="text-4xl font-extrabold tracking-tight text-[#0A0A0A]">
          Engine Comparison
        </h1>
        <p className="text-lg text-[#6B7280] leading-relaxed max-w-3xl">
          Direct feature-by-feature and architectural comparison with other popular web animation toolkits.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-[#0A0A0A]">
          Feature & Performance Matrix
        </h2>

        <div className="overflow-x-auto rounded-2xl border border-[#E5E7EB] bg-white shadow-xs">
          <table className="w-full text-left text-xs text-[#0A0A0A] border-collapse">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#FAFAF9] text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                <th className="py-3.5 px-4">Feature / Metric</th>
                <th className="py-3.5 px-4 text-[#FF5A1F] font-extrabold">ScrollCraft</th>
                <th className="py-3.5 px-4">GSAP ScrollTrigger</th>
                <th className="py-3.5 px-4">Framer Motion</th>
                <th className="py-3.5 px-4">Locomotive</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {BENCHMARK_DATA.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#FAFAF9]/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#0A0A0A]">
                    {row.feature}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#FF5A1F] bg-[#FFF7ED]/30">
                    {typeof row.scrollcraft === 'boolean' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                        <Check className="w-3.5 h-3.5" /> Yes
                      </span>
                    ) : (
                      row.scrollcraft
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-[#6B7280]">
                    {typeof row.gsap === 'boolean' ? (
                      row.gsap ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-rose-500" />
                      )
                    ) : (
                      row.gsap
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-[#6B7280]">
                    {typeof row.framer === 'boolean' ? (
                      row.framer ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-rose-500" />
                      )
                    ) : (
                      row.framer
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-[#6B7280]">
                    {typeof row.locomotive === 'boolean' ? (
                      row.locomotive ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-rose-500" />
                      )
                    ) : (
                      row.locomotive
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <DocsCallout type="tip" title="No Commercial Licensing Hurdles">
        Unlike GSAP&apos;s commercial licensing tiers for paid end products, ScrollCraft Core is 100% MIT-licensed and free to use across unlimited commercial client projects.
      </DocsCallout>
    </div>
  );
};
