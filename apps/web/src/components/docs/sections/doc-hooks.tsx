'use client';

/**
 * Docs Section: Reactive Hooks (useScrollState, useScrollCraft, useParallax, useReveal, usePin)
 * Aligned with ScrollCraft design tokens and performance guidelines.
 * Strictly under 650 LOC.
 */

import React from 'react';
import { CodeViewer } from '@/components/ui/code-viewer';
import { DocsTable, PropRow } from '../docs-table';
import { DocsCallout } from '../docs-callout';

interface DocHooksProps {
  hookId: string;
}

const USE_SCROLL_STATE_CODE = `import { useScrollState } from '@scrollcraft/react';

export function ScrollTelemetryHUD() {
  // Selectively subscribe to only the metrics needed.
  // Backed by useSyncExternalStore with shallow comparison.
  // Will NEVER trigger re-renders in parent components!
  const { velocity, progress } = useScrollState((m) => ({
    velocity: Math.abs(Math.round(m.velocity)),
    progress: Math.round(m.progress * 100),
  }));

  return (
    <div className="flex items-center gap-4 px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] shadow-xs font-mono text-xs">
      <span className="text-[#6B7280]">
        Progress: <strong className="text-[#0A0A0A]">{progress}%</strong>
      </span>
      <span className="text-[#6B7280]">
        Speed: <strong className="text-[#FF5A1F]">{velocity}px/s</strong>
      </span>
    </div>
  );
}`;

const USE_SCROLLCRAFT_CODE = `import { useScrollCraft } from '@scrollcraft/react';

export function NavigationControls() {
  const { scrollTo, resize, isReady, getMetrics } = useScrollCraft();

  const handleScrollToTop = () => {
    // Programmatic smooth scroll with cubic easing
    scrollTo(0, {
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  };

  return (
    <button
      onClick={handleScrollToTop}
      disabled={!isReady}
      className="px-4 py-2 rounded-xl bg-[#0A0A0A] text-white text-xs font-semibold hover:bg-[#262626] transition-colors"
    >
      Scroll to Top
    </button>
  );
}`;

const USE_PARALLAX_CODE = `import { useRef } from 'react';
import { useParallax } from '@scrollcraft/react';

export function HeadlessCard() {
  const cardRef = useRef<HTMLDivElement>(null);

  // Headless hook: writes directly to node.style.transform during render phase
  useParallax(cardRef, {
    speed: 0.25,
    direction: 'vertical',
    clamp: [-150, 150],
  });

  return (
    <div ref={cardRef} className="p-8 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm">
      <h3 className="text-xl font-bold text-[#0A0A0A]">Headless Parallax</h3>
      <p className="text-xs text-[#6B7280] mt-1">Direct GPU writes without Slot wrappers.</p>
    </div>
  );
}`;

const USE_REVEAL_CODE = `import { useRef } from 'react';
import { useReveal } from '@scrollcraft/react';

export function HeadlessRevealItem() {
  const itemRef = useRef<HTMLDivElement>(null);

  useReveal(itemRef, {
    variant: 'slide-up',
    threshold: 0.2,
    duration: 0.6,
  });

  return (
    <div ref={itemRef} className="p-6 rounded-2xl bg-white border border-[#E5E7EB]">
      <h4 className="font-bold text-[#0A0A0A]">Headless Intersection Trigger</h4>
    </div>
  );
}`;

const USE_PIN_CODE = `import { useRef } from 'react';
import { usePin } from '@scrollcraft/react';

export function HeadlessPinnedBlock() {
  const pinRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  usePin(pinRef, containerRef, {
    start: 'top top',
    end: '+=150%',
    pinSpacing: true,
  });

  return (
    <div ref={containerRef} className="h-[250vh]">
      <div ref={pinRef} className="h-screen w-full flex items-center justify-center">
        <h2>Sticky Section via usePin</h2>
      </div>
    </div>
  );
}`;

const SCROLL_METRICS_ROWS: PropRow[] = [
  { name: 'scroll', type: 'number', description: 'Current scroll offset in pixels.' },
  { name: 'target', type: 'number', description: 'Target destination scroll offset.' },
  { name: 'velocity', type: 'number', description: 'Current scroll velocity in pixels per frame.' },
  { name: 'progress', type: 'number', description: 'Normalized document scroll progress (0.0 to 1.0).' },
  { name: 'direction', type: '1 | -1 | 0', description: 'Scroll direction (1 = forward, -1 = backward, 0 = stationary).' },
  { name: 'maxScroll', type: 'number', description: 'Total scrollable distance of the active target container.' },
];

export const DocHooks: React.FC<DocHooksProps> = ({ hookId }) => {
  if (hookId === 'use-scroll-state') {
    return (
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <div className="text-xs font-mono font-semibold text-[#FF5A1F] uppercase tracking-wider">
            Reactive Hooks
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#0A0A0A] font-mono">
            useScrollState
          </h1>
          <p className="text-lg text-[#6B7280] leading-relaxed max-w-3xl">
            Selective reactive state subscriber built on <code className="font-mono text-[#0A0A0A] text-sm">useSyncExternalStore</code>. Subscribe to real-time velocity, direction, or progress without forcing root re-renders.
          </p>
        </header>

        <section id="usage" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-[#0A0A0A]">
            Usage & Selective Subscription
          </h2>
          <CodeViewer code={USE_SCROLL_STATE_CODE} fileName="scroll-telemetry-hud.tsx" />
        </section>

        <DocsTable title="ScrollMetrics Reference" props={SCROLL_METRICS_ROWS} />

        <DocsCallout type="tip" title="Zero Root Re-renders">
          By isolating <code className="font-mono text-xs text-[#FF5A1F]">useScrollState</code> inside leaf display components (such as a HUD badge or scroll percentage indicator), the rest of your React component tree stays completely idle while numbers update seamlessly at 120 FPS.
        </DocsCallout>
      </div>
    );
  }

  if (hookId === 'use-scrollcraft') {
    return (
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <div className="text-xs font-mono font-semibold text-[#FF5A1F] uppercase tracking-wider">
            Reactive Hooks
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#0A0A0A] font-mono">
            useScrollCraft
          </h1>
          <p className="text-lg text-[#6B7280] leading-relaxed max-w-3xl">
            Imperative controller providing programmatic access to the underlying ScrollCraft engine.
          </p>
        </header>

        <section id="usage" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-[#0A0A0A]">
            Usage & Programmatic Scrolling
          </h2>
          <CodeViewer code={USE_SCROLLCRAFT_CODE} fileName="navigation-controls.tsx" />
        </section>

        <div className="p-4 rounded-xl border border-[#E5E7EB] bg-white font-mono text-xs space-y-2">
          <div className="text-[#0A0A0A] font-bold pb-2 border-b border-[#E5E7EB]">
            Exposed Engine Methods:
          </div>
          <div className="text-[#6B7280]">
            <span className="text-[#0A0A0A] font-semibold">scrollTo(target, options?)</span>: Smoothly animate to coordinate or selector.
          </div>
          <div className="text-[#6B7280]">
            <span className="text-[#0A0A0A] font-semibold">resize()</span>: Recalculate container limits and bounding geometries.
          </div>
          <div className="text-[#6B7280]">
            <span className="text-[#0A0A0A] font-semibold">getMetrics()</span>: Read immediate snapshot of current scroll metrics.
          </div>
          <div className="text-[#6B7280]">
            <span className="text-[#0A0A0A] font-semibold">subscribe(callback)</span>: Direct microtask subscriber outside React lifecycle.
          </div>
        </div>

        <DocsCallout type="note" title="Route Changes">
          Upon client-side route transitions in Next.js App Router, call <code className="font-mono text-xs text-[#FF5A1F]">resize()</code> to recalibrate bounds for newly rendered content without jumping the scroll position.
        </DocsCallout>
      </div>
    );
  }

  if (hookId === 'use-parallax') {
    return (
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <div className="text-xs font-mono font-semibold text-[#FF5A1F] uppercase tracking-wider">
            Headless Hooks
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#0A0A0A] font-mono">
            useParallax
          </h1>
          <p className="text-lg text-[#6B7280] leading-relaxed max-w-3xl">
            Headless parallax hook that attaches direct GPU transforms to an existing element ref without needing JSX wrapper components.
          </p>
        </header>

        <section id="usage" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-[#0A0A0A]">
            Usage
          </h2>
          <CodeViewer code={USE_PARALLAX_CODE} fileName="headless-card.tsx" />
        </section>
      </div>
    );
  }

  if (hookId === 'use-reveal') {
    return (
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <div className="text-xs font-mono font-semibold text-[#FF5A1F] uppercase tracking-wider">
            Headless Hooks
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#0A0A0A] font-mono">
            useReveal
          </h1>
          <p className="text-lg text-[#6B7280] leading-relaxed max-w-3xl">
            Headless viewport trigger hook attaching hardware-accelerated entry styles directly to any DOM node.
          </p>
        </header>

        <section id="usage" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-[#0A0A0A]">
            Usage
          </h2>
          <CodeViewer code={USE_REVEAL_CODE} fileName="headless-reveal-item.tsx" />
        </section>
      </div>
    );
  }

  // use-pin
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <div className="text-xs font-mono font-semibold text-[#FF5A1F] uppercase tracking-wider">
          Headless Hooks
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#0A0A0A] font-mono">
          usePin
        </h1>
        <p className="text-lg text-[#6B7280] leading-relaxed max-w-3xl">
          Headless sticky locking hook supporting custom travel thresholds and automated ancestor diagnostics.
        </p>
      </header>

      <section id="usage" className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-[#0A0A0A]">
          Usage
        </h2>
        <CodeViewer code={USE_PIN_CODE} fileName="headless-pinned-block.tsx" />
      </section>
    </div>
  );
};
