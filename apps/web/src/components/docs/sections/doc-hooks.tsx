'use client';

/**
 * Docs Section: Reactive Hooks (useScrollState, useScrollCraft, useParallax, useReveal)
 * Strictly under 650 LOC.
 */

import React from 'react';
import { CodeViewer } from '@/components/ui/code-viewer';
import { DocsTable } from '../docs-table';
import { DocsCallout } from '../docs-callout';

interface DocHooksProps {
  hookId: string;
}

const USE_SCROLL_STATE_CODE = `import { useScrollState } from '@scrollcraft/react';

export function ScrollHUD() {
  // Selectively subscribe to only the metrics needed.
  // Uses useSyncExternalStore with shallow-memoization.
  // Will NEVER trigger re-renders in parent components!
  const { velocity, progress } = useScrollState((m) => ({
    velocity: Math.abs(Math.round(m.velocity)),
    progress: Math.round(m.progress * 100),
  }));

  return (
    <div className="hud-badge">
      <span>Progress: {progress}%</span>
      <span>Speed: {velocity}px/s</span>
    </div>
  );
}`;

const USE_SCROLLCRAFT_CODE = `import { useScrollCraft } from '@scrollcraft/react';

export function BackToTopButton() {
  const { scrollTo, resize, isReady } = useScrollCraft();

  const handleScrollToTop = () => {
    // Programmatic smooth scroll to top
    scrollTo(0, {
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  };

  return (
    <button onClick={handleScrollToTop} disabled={!isReady}>
      Scroll to Top
    </button>
  );
}`;

const USE_PARALLAX_CODE = `import { useRef } from 'react';
import { useParallax } from '@scrollcraft/react';

export function CustomParallaxElement() {
  const cardRef = useRef<HTMLDivElement>(null);

  // Headless hook: attaches direct DOM transform writes
  useParallax(cardRef, {
    speed: 0.25,
    direction: 'vertical',
  });

  return (
    <div ref={cardRef} className="my-custom-card">
      <h3>Headless Parallax Element</h3>
    </div>
  );
}`;

export const DocHooks: React.FC<DocHooksProps> = ({ hookId }) => {
  if (hookId === 'use-scroll-state') {
    return (
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <div className="text-xs font-mono font-semibold text-blue-600 uppercase tracking-wider">
            Reactive Hooks
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-950 font-mono">
            useScrollState
          </h1>
          <p className="text-lg text-zinc-600 leading-relaxed max-w-3xl">
            Selective reactive state subscriber built on <code className="font-mono text-zinc-900 text-sm">useSyncExternalStore</code>.
            Subscribe to real-time scroll velocity, direction, or progress without forcing root re-renders.
          </p>
        </header>

        <section id="usage" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            Usage
          </h2>
          <CodeViewer code={USE_SCROLL_STATE_CODE} fileName="scroll-hud.tsx" />
        </section>

        <DocsCallout type="tip" title="Zero Root Re-renders">
          By isolating <code className="font-mono text-xs text-blue-700">useScrollState</code> inside leaf display components (like a HUD badge or percentage counter), the rest of your React component tree stays completely idle while numbers update seamlessly at 120 FPS.
        </DocsCallout>

        <section id="metrics-reference" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            ScrollMetrics Interface
          </h2>
          <DocsTable
            props={[
              {
                name: 'scroll',
                type: 'number',
                description: 'Current vertical or horizontal scroll offset in pixels.',
              },
              {
                name: 'limit',
                type: 'number',
                description: 'Maximum scrollable boundary (scrollHeight - clientHeight).',
              },
              {
                name: 'velocity',
                type: 'number',
                description: 'Current scroll inertia velocity in pixels per frame.',
              },
              {
                name: 'direction',
                type: '1 | -1 | 0',
                description: '1 for downward scroll, -1 for upward scroll, 0 when settled.',
              },
              {
                name: 'progress',
                type: 'number',
                description: 'Normalized scroll progress between 0.0 and 1.0.',
              },
            ]}
          />
        </section>
      </div>
    );
  }

  if (hookId === 'use-scrollcraft') {
    return (
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <div className="text-xs font-mono font-semibold text-blue-600 uppercase tracking-wider">
            Context Access
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-950 font-mono">
            useScrollCraft
          </h1>
          <p className="text-lg text-zinc-600 leading-relaxed max-w-3xl">
            Access the underlying inertia scroll engine context for programmatic scrolling, manual boundary resizing, and lifecycle control.
          </p>
        </header>

        <section id="usage" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            Usage
          </h2>
          <CodeViewer code={USE_SCROLLCRAFT_CODE} fileName="back-to-top.tsx" />
        </section>

        <section id="methods-reference" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            Context Methods
          </h2>
          <DocsTable
            props={[
              {
                name: 'scrollTo',
                type: '(target: number | string | HTMLElement, options?) => void',
                description: 'Programmatically scroll to a pixel offset, CSS selector, or DOM node with custom easing and duration.',
              },
              {
                name: 'resize',
                type: '() => void',
                description: 'Manually recalculate scroll limits and layout dimensions if DOM structure mutated.',
              },
              {
                name: 'isReady',
                type: 'boolean',
                description: 'True once the engine has mounted and calibrated client dimensions.',
              },
              {
                name: 'reducedMotion',
                type: 'boolean',
                description: 'True if user has prefers-reduced-motion active in OS settings.',
              },
            ]}
          />
        </section>
      </div>
    );
  }

  // Headless hook (useParallax or useReveal)
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <div className="text-xs font-mono font-semibold text-blue-600 uppercase tracking-wider">
          Headless Hooks
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-950 font-mono">
          useParallax &amp; useReveal
        </h1>
        <p className="text-lg text-zinc-600 leading-relaxed max-w-3xl">
          Low-level ref-based hooks for attaching high-performance scroll effects to custom DOM elements without wrapping components.
        </p>
      </header>

      <section id="usage" className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
          Headless Integration Example
        </h2>
        <CodeViewer code={USE_PARALLAX_CODE} fileName="custom-card.tsx" />
      </section>

      <DocsCallout type="note" title="When to use Headless Hooks vs Primitives">
        Use the <code className="font-mono text-xs text-blue-700">&lt;Parallax asChild&gt;</code> primitive for standard JSX template trees. Use <code className="font-mono text-xs text-blue-700">useParallax(ref)</code> when building custom design system components or third-party canvas / WebGL overlays where direct ref access is already present.
      </DocsCallout>
    </div>
  );
};
