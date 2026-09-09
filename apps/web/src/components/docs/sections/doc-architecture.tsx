'use client';

/**
 * Docs Section: Architecture, 3-Phase Ticker & Accessibility
 * Strictly under 650 LOC.
 */

import React from 'react';
import { DocsCallout } from '../docs-callout';

interface DocArchitectureProps {
  sectionId: string;
}

export const DocArchitecture: React.FC<DocArchitectureProps> = ({
  sectionId,
}) => {
  if (sectionId === 'three-phase-ticker') {
    return (
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <div className="text-xs font-mono font-semibold text-blue-600 uppercase tracking-wider">
            Engine Architecture
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-950">
            3-Phase Ticker Pipeline
          </h1>
          <p className="text-lg text-zinc-600 leading-relaxed max-w-3xl">
            How ScrollCraft eliminates layout thrashing, avoids forced reflows, and maintains 120 FPS frame consistency.
          </p>
        </header>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            Layout Thrashing: The Hidden Performance Killer
          </h2>
          <p className="text-sm text-zinc-600 leading-relaxed">
            In standard JavaScript animation libraries, reading layout properties (like <code className="font-mono text-xs text-rose-800 bg-rose-50 px-1 py-0.5 rounded">getBoundingClientRect()</code>, <code className="font-mono text-xs text-rose-800 bg-rose-50 px-1 py-0.5 rounded">offsetTop</code>, or <code className="font-mono text-xs text-rose-800 bg-rose-50 px-1 py-0.5 rounded">scrollTop</code>) in the middle of writing styles (<code className="font-mono text-xs text-zinc-800 bg-zinc-100 px-1 py-0.5 rounded">el.style.transform = ...</code>) forces the browser engine to halt execution and synchronously recalculate the entire page layout.
          </p>

          {/* Pipeline Visual Diagram */}
          <div className="my-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl border border-blue-200 bg-blue-50/50 flex flex-col gap-2">
              <span className="font-mono font-bold text-xs text-blue-700 uppercase tracking-wider">
                Phase 1: Measure
              </span>
              <p className="text-xs text-zinc-600 leading-relaxed">
                All read operations (window dimensions, element bounds, scroll offsets) occur in a single unified batch. Zero writes allowed.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-purple-200 bg-purple-50/50 flex flex-col gap-2">
              <span className="font-mono font-bold text-xs text-purple-700 uppercase tracking-wider">
                Phase 2: Update
              </span>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Kinetic calculations, lerp smoothing, spring physics, and interpolations occur purely in memory without touching the DOM.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex flex-col gap-2">
              <span className="font-mono font-bold text-xs text-emerald-700 uppercase tracking-wider">
                Phase 3: Render
              </span>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Batched GPU compositor writes. Applies direct <code className="font-mono text-xs text-emerald-800">transform</code> and <code className="font-mono text-xs text-emerald-800">opacity</code> inline styles to registered refs.
              </p>
            </div>
          </div>
        </section>

        <DocsCallout type="tip" title="Result: Zero Dropped Frames">
          By segregating reads and writes into distinct micro-phases, browser layout engines (Blink, WebKit, Gecko) never experience forced reflows, maintaining smooth 120Hz display refresh rates on ProMotion displays.
        </DocsCallout>
      </div>
    );
  }

  if (sectionId === 'reduced-motion') {
    return (
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <div className="text-xs font-mono font-semibold text-blue-600 uppercase tracking-wider">
            Accessibility (a11y)
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-950">
            Dual-Layer Reduced Motion
          </h1>
          <p className="text-lg text-zinc-600 leading-relaxed max-w-3xl">
            Built-in OS-level vestibular disorder protection. ScrollCraft automatically respects user accessibility preferences out of the box.
          </p>
        </header>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            How Dual-Layer Protection Operates
          </h2>
          <div className="space-y-3 text-sm text-zinc-600 leading-relaxed">
            <p>
              When a user has enabled &ldquo;Reduce Motion&rdquo; in macOS, Windows, iOS, or Android settings, ScrollCraft responds at two distinct layers:
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong className="text-zinc-900">Engine Layer (Inertia Zeroing):</strong> Smooth inertia interpolation is immediately bypassed. The page reverts to standard native 1:1 hardware wheel and touch scrolling.
              </li>
              <li>
                <strong className="text-zinc-900">Primitive Layer (Transform Collapse):</strong> <code className="font-mono text-xs text-blue-700">&lt;Parallax&gt;</code> immediately collapses its displacement to 0px, and <code className="font-mono text-xs text-blue-700">&lt;Reveal&gt;</code> snaps directly to full opacity without animating motion.
              </li>
            </ol>
          </div>
        </section>

        <DocsCallout type="note" title="Opt-out for specific elements">
          While <code className="font-mono text-xs text-zinc-800">respectReducedMotion=true</code> is enabled by default in <code className="font-mono text-xs text-zinc-800">&lt;ScrollProvider&gt;</code>, individual components can override it when non-disruptive opacity transitions are needed.
        </DocsCallout>
      </div>
    );
  }

  // Engine benchmark comparison
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <div className="text-xs font-mono font-semibold text-blue-600 uppercase tracking-wider">
          Architecture &amp; Benchmark
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-950">
          Scroll Architecture Comparison
        </h1>
        <p className="text-lg text-zinc-600 leading-relaxed max-w-3xl">
          A side-by-side technical evaluation of the three modern web scroll paradigms.
        </p>
      </header>

      <section className="overflow-x-auto">
        <table className="w-full text-left text-xs border border-zinc-200 rounded-xl overflow-hidden bg-white">
          <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-700 font-semibold">
            <tr>
              <th className="p-4">Feature / Metric</th>
              <th className="p-4 text-blue-700 font-bold bg-blue-50/50">ScrollCraft (Native Wrap)</th>
              <th className="p-4 text-zinc-500">Virtual Hijack (Old Locomotive)</th>
              <th className="p-4 text-zinc-500">CSS Scroll-Timeline</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-zinc-600">
            <tr>
              <td className="p-4 font-semibold text-zinc-900">A11y &amp; Keyboard Scroll</td>
              <td className="p-4 font-medium text-emerald-700 bg-blue-50/20">&check; 100% Native</td>
              <td className="p-4 text-rose-600">&cross; Broken by default</td>
              <td className="p-4 text-emerald-700">&check; Native</td>
            </tr>
            <tr>
              <td className="p-4 font-semibold text-zinc-900">CSS position: sticky</td>
              <td className="p-4 font-medium text-emerald-700 bg-blue-50/20">&check; Zero hacks</td>
              <td className="p-4 text-rose-600">&cross; Broken (wrapper overflows)</td>
              <td className="p-4 text-emerald-700">&check; Native</td>
            </tr>
            <tr>
              <td className="p-4 font-semibold text-zinc-900">Cross-Browser Support</td>
              <td className="p-4 font-medium text-emerald-700 bg-blue-50/20">&check; Chrome, Safari, Firefox, iOS</td>
              <td className="p-4 text-amber-600">&sim; Buggy on iOS rubberband</td>
              <td className="p-4 text-rose-600">&cross; Safari polyfill required</td>
            </tr>
            <tr>
              <td className="p-4 font-semibold text-zinc-900">React Virtual DOM Load</td>
              <td className="p-4 font-medium text-emerald-700 bg-blue-50/20">0 re-renders (direct ref)</td>
              <td className="p-4 text-amber-600">High CPU overhead</td>
              <td className="p-4 text-emerald-700">0 re-renders</td>
            </tr>
            <tr>
              <td className="p-4 font-semibold text-zinc-900">Slot Composition (asChild)</td>
              <td className="p-4 font-medium text-emerald-700 bg-blue-50/20">&check; Built-in Slot</td>
              <td className="p-4 text-rose-600">&cross; Forces wrapper divs</td>
              <td className="p-4 text-zinc-400">N/A (CSS only)</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
};
