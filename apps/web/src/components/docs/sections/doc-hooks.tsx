'use client';

import React from 'react';
import { CodeViewer } from '@/components/ui/code-viewer';
import { DocsTable, PropRow } from '../docs-table';
import { DocsCallout } from '../docs-callout';

interface DocHooksProps {
  hookId: string;
}

const USE_SCROLL_STATE_REACT = `import { useScrollState } from '@scrollcraft/react';

export function ScrollTelemetryHUD() {
  // Selectively subscribe to only the metrics needed.
  // Backed by useSyncExternalStore with shallow comparison.
  // Will NEVER trigger re-renders in parent components!
  const { velocity, progress } = useScrollState((m) => ({
    velocity: Math.abs(Math.round(m.velocity)),
    progress: Math.round(m.progress * 100),
  }));

  return (
    <div className="flex items-center gap-4 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl font-mono text-xs">
      <span className="text-zinc-400">
        Progress: <strong className="text-white">{progress}%</strong>
      </span>
      <span className="text-zinc-400">
        Speed: <strong className="text-blue-400">{velocity}px/s</strong>
      </span>
    </div>
  );
}`;

const USE_SCROLL_STATE_NEXT = `'use client';

import { useScrollState } from '@scrollcraft/react';

export function ScrollTelemetryHUD() {
  const { velocity, progress } = useScrollState((m) => ({
    velocity: Math.abs(Math.round(m.velocity)),
    progress: Math.round(m.progress * 100),
  }));

  return (
    <div className="flex items-center gap-4 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl font-mono text-xs">
      <span className="text-zinc-400">
        Progress: <strong className="text-white">{progress}%</strong>
      </span>
      <span className="text-zinc-400">
        Speed: <strong className="text-blue-400">{velocity}px/s</strong>
      </span>
    </div>
  );
}`;

const USE_SCROLLCRAFT_REACT = `import { useScrollCraft } from '@scrollcraft/react';

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
      className="px-4 py-2 rounded-xl bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-colors shadow-lg cursor-pointer"
    >
      Scroll to Top
    </button>
  );
}`;

const USE_SCROLLCRAFT_NEXT = `'use client';

import { useScrollCraft } from '@scrollcraft/react';

export function NavigationControls() {
  const { scrollTo, isReady } = useScrollCraft();

  const handleScrollToTop = () => {
    scrollTo(0, {
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  };

  return (
    <button
      onClick={handleScrollToTop}
      disabled={!isReady}
      className="px-4 py-2 rounded-xl bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-colors shadow-lg cursor-pointer"
    >
      Scroll to Top
    </button>
  );
}`;

const USE_PARALLAX_REACT = `import { useRef } from 'react';
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
    <div ref={cardRef} className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
      <h3 className="text-xl font-bold text-white">Headless Parallax</h3>
      <p className="text-xs text-zinc-400 mt-1">Direct GPU writes without Slot wrappers.</p>
    </div>
  );
}`;

const USE_PARALLAX_NEXT = `'use client';

import { useRef } from 'react';
import { useParallax } from '@scrollcraft/react';

export function HeadlessCard() {
  const cardRef = useRef<HTMLDivElement>(null);

  useParallax(cardRef, {
    speed: 0.25,
    direction: 'vertical',
    clamp: [-150, 150],
  });

  return (
    <div ref={cardRef} className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
      <h3 className="text-xl font-bold text-white">Headless Parallax</h3>
      <p className="text-xs text-zinc-400 mt-1">Direct GPU writes without Slot wrappers.</p>
    </div>
  );
}`;

const USE_REVEAL_REACT = `import { useRef } from 'react';
import { useReveal } from '@scrollcraft/react';

export function HeadlessRevealItem() {
  const itemRef = useRef<HTMLDivElement>(null);

  useReveal(itemRef, {
    direction: 'up',
    distance: 32,
    duration: 0.6,
  });

  return (
    <div ref={itemRef} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
      <h4 className="font-bold text-white">Headless Intersection Trigger</h4>
    </div>
  );
}`;

const USE_REVEAL_NEXT = `'use client';

import { useRef } from 'react';
import { useReveal } from '@scrollcraft/react';

export function HeadlessRevealItem() {
  const itemRef = useRef<HTMLDivElement>(null);

  useReveal(itemRef, {
    direction: 'up',
    distance: 32,
    duration: 0.6,
  });

  return (
    <div ref={itemRef} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
      <h4 className="font-bold text-white">Headless Intersection Trigger</h4>
    </div>
  );
}`;

const USE_PIN_REACT = `import { useRef } from 'react';
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
      <div ref={pinRef} className="h-screen w-full flex items-center justify-center bg-[#070709]">
        <h2 className="text-3xl font-extrabold text-white">Sticky Section via usePin</h2>
      </div>
    </div>
  );
}`;

const USE_PIN_NEXT = `'use client';

import { useRef } from 'react';
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
      <div ref={pinRef} className="h-screen w-full flex items-center justify-center bg-[#070709]">
        <h2 className="text-3xl font-extrabold text-white">Sticky Section via usePin</h2>
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
      <div className="flex flex-col gap-12">
        <header className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-[11px] font-mono font-semibold text-purple-400 uppercase tracking-widest w-fit">
            REACTIVE HOOKS
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tighter text-white leading-[1.08] font-mono">
            useScrollState
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-3xl">
            Selective reactive state subscriber built on <code className="font-mono text-zinc-200 text-sm">useSyncExternalStore</code>. Subscribe to real-time velocity, direction, or progress without forcing root re-renders.
          </p>
        </header>

        <section id="usage" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Usage & Selective Subscription
          </h2>
          <CodeViewer
            tabs={[
              { label: 'React', code: USE_SCROLL_STATE_REACT, fileName: 'src/ScrollTelemetryHUD.tsx' },
              { label: 'Next.js', code: USE_SCROLL_STATE_NEXT, fileName: 'app/components/ScrollTelemetryHUD.tsx' },
            ]}
          />
        </section>

        <DocsTable title="ScrollMetrics Reference" props={SCROLL_METRICS_ROWS} />

        <DocsCallout type="tip" title="Zero Root Re-renders">
          By isolating <code className="font-mono text-xs text-purple-400">useScrollState</code> inside leaf display components (such as a HUD badge or scroll percentage indicator), the rest of your React component tree stays completely idle while numbers update seamlessly at 120 FPS.
        </DocsCallout>
      </div>
    );
  }

  if (hookId === 'use-scrollcraft') {
    return (
      <div className="flex flex-col gap-12">
        <header className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-[11px] font-mono font-semibold text-purple-400 uppercase tracking-widest w-fit">
            REACTIVE HOOKS
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tighter text-white leading-[1.08] font-mono">
            useScrollCraft
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-3xl">
            Imperative controller providing programmatic access to the underlying ScrollCraft engine, metrics, and inertial solvers.
          </p>
        </header>

        <section id="usage" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Usage & Programmatic Scrolling
          </h2>
          <CodeViewer
            tabs={[
              { label: 'React', code: USE_SCROLLCRAFT_REACT, fileName: 'src/NavigationControls.tsx' },
              { label: 'Next.js', code: USE_SCROLLCRAFT_NEXT, fileName: 'app/components/NavigationControls.tsx' },
            ]}
          />
        </section>

        <div className="p-5 rounded-xl border border-zinc-800/80 bg-[#09090b] font-mono text-xs space-y-2.5 shadow-xl">
          <div className="text-white font-bold pb-2 border-b border-zinc-800/60">
            Exposed Engine Controller API:
          </div>
          <div className="text-zinc-400">
            <span className="text-white font-semibold">scrollTo(target, options?)</span>: Smoothly animate to coordinate, pixel offset, or DOM element selector.
          </div>
          <div className="text-zinc-400">
            <span className="text-white font-semibold">resize()</span>: Recalculate container limits and bounding geometries after dynamic content insertion.
          </div>
          <div className="text-zinc-400">
            <span className="text-white font-semibold">getMetrics()</span>: Read cached snapshot of scroll, velocity, progress, and maxScroll with 0 DOM reads.
          </div>
        </div>
      </div>
    );
  }

  if (hookId === 'use-parallax') {
    return (
      <div className="flex flex-col gap-12">
        <header className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-[11px] font-mono font-semibold text-purple-400 uppercase tracking-widest w-fit">
            REACTIVE HOOKS
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tighter text-white leading-[1.08] font-mono">
            useParallax
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-3xl">
            Headless direct DOM parallax hook. Attaches directly to any HTML element ref and updates inline transform matrix during Phase 3 render.
          </p>
        </header>

        <section id="usage" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Usage & Syntax
          </h2>
          <CodeViewer
            tabs={[
              { label: 'React', code: USE_PARALLAX_REACT, fileName: 'src/HeadlessCard.tsx' },
              { label: 'Next.js', code: USE_PARALLAX_NEXT, fileName: 'app/components/HeadlessCard.tsx' },
            ]}
          />
        </section>
      </div>
    );
  }

  if (hookId === 'use-reveal') {
    return (
      <div className="flex flex-col gap-12">
        <header className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-[11px] font-mono font-semibold text-purple-400 uppercase tracking-widest w-fit">
            REACTIVE HOOKS
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tighter text-white leading-[1.08] font-mono">
            useReveal
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-3xl">
            Headless reveal-on-enter hook. Connects any element ref to the global shared IntersectionObserver with zero re-renders.
          </p>
        </header>

        <section id="usage" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Usage & Syntax
          </h2>
          <CodeViewer
            tabs={[
              { label: 'React', code: USE_REVEAL_REACT, fileName: 'src/HeadlessRevealItem.tsx' },
              { label: 'Next.js', code: USE_REVEAL_NEXT, fileName: 'app/components/HeadlessRevealItem.tsx' },
            ]}
          />
        </section>
      </div>
    );
  }

  // use-pin
  return (
    <div className="flex flex-col gap-12">
      <header className="flex flex-col gap-4">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-[11px] font-mono font-semibold text-purple-400 uppercase tracking-widest w-fit">
          REACTIVE HOOKS
        </div>
        <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tighter text-white leading-[1.08] font-mono">
          usePin
        </h1>
        <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-3xl">
          Headless pinning hook. Pins target ref inside container ref with automated ancestor overflow diagnostics.
        </p>
      </header>

      <section id="usage" className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Usage & Syntax
        </h2>
        <CodeViewer
          tabs={[
            { label: 'React', code: USE_PIN_REACT, fileName: 'src/HeadlessPinnedBlock.tsx' },
            { label: 'Next.js', code: USE_PIN_NEXT, fileName: 'app/components/HeadlessPinnedBlock.tsx' },
          ]}
        />
      </section>
    </div>
  );
};
