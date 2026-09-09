'use client';

/**
 * Docs Section: Core Primitives (Parallax, Reveal, Pin, ScrollProgress)
 * Strictly under 650 LOC.
 */

import React from 'react';
import { CodeViewer } from '@/components/ui/code-viewer';
import { DocsTable } from '../docs-table';
import { DocsCallout } from '../docs-callout';
import {
  PARALLAX_PROPS,
  REVEAL_PROPS,
  PIN_PROPS,
  SCROLL_PROGRESS_PROPS,
} from '../docs-data';

interface DocPrimitivesProps {
  primitiveId: string;
}

const PARALLAX_SNIPPET = `import { Parallax } from '@scrollcraft/react';

export function ParallaxExample() {
  return (
    <div className="container">
      {/* Background card lagging behind naturally */}
      <Parallax asChild speed={0.25} direction="vertical">
        <div className="bg-card">
          <h4>Subtle Floating Background</h4>
        </div>
      </Parallax>

      {/* Foreground card accelerating ahead */}
      <Parallax asChild speed={-0.15}>
        <div className="accent-card">
          <h3>Faster Foreground Focus</h3>
        </div>
      </Parallax>
    </div>
  );
}`;

const REVEAL_SNIPPET = `import { Reveal } from '@scrollcraft/react';

export function RevealExample() {
  return (
    <div className="grid">
      <Reveal variant="slide-up" duration={0.6} delay={0.1}>
        <div className="feature-card">
          <h3>Slide Up Transition</h3>
        </div>
      </Reveal>

      <Reveal variant="scale" duration={0.5} delay={0.2}>
        <div className="feature-card">
          <h3>Scale In Transition</h3>
        </div>
      </Reveal>
    </div>
  );
}`;

const PIN_SNIPPET = `import { Pin, PinContainer } from '@scrollcraft/react';

export function PinExample() {
  return (
    <PinContainer className="h-[250vh]">
      <Pin asChild pinSpacing={true} start="top top" end="+=100%">
        <div className="sticky-card">
          <h2>Sticky Showcase Experience</h2>
          <p>Pinned during the 100% scroll distance budget</p>
        </div>
      </Pin>
    </PinContainer>
  );
}`;

const SCROLL_PROGRESS_SNIPPET = `import { ScrollProgress } from '@scrollcraft/react';

export function ReadingProgressBar() {
  return (
    <div className="fixed top-0 inset-x-0 h-1 z-50 bg-zinc-100">
      <ScrollProgress asChild axis="y">
        <div className="h-full bg-blue-600 origin-left" />
      </ScrollProgress>
    </div>
  );
}`;

export const DocPrimitives: React.FC<DocPrimitivesProps> = ({
  primitiveId,
}) => {
  // Parallax section
  if (primitiveId === 'parallax') {
    return (
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <div className="text-xs font-mono font-semibold text-blue-600 uppercase tracking-wider">
            Core Primitive
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-950 font-mono">
            &lt;Parallax /&gt;
          </h1>
          <p className="text-lg text-zinc-600 leading-relaxed max-w-3xl">
            Smooth subpixel depth and multi-plane motion with zero React re-renders.
            Displaces elements using direct GPU transform matrix calculations.
          </p>
        </header>

        {/* Live Interactive Sandbox Preview */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-bold tracking-tight text-zinc-900">
            Interactive Preview
          </h2>
          <div className="p-8 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden">
            <div className="text-xs font-mono text-zinc-400 mb-4">
              [Scroll down on this page to observe real-time displacement]
            </div>
            <div className="p-6 rounded-xl bg-white border border-zinc-200 shadow-sm max-w-sm text-center">
              <span className="text-xs font-mono font-semibold text-blue-600">speed=0.2</span>
              <h3 className="text-base font-bold text-zinc-900 mt-1">Multi-Plane Subpixel Parallax</h3>
              <p className="text-xs text-zinc-500 mt-1">
                Zero wrapper div. Ref-based direct CSS transform translation.
              </p>
            </div>
          </div>
        </section>

        {/* Code Snippet */}
        <section id="parallax-code" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            Usage
          </h2>
          <CodeViewer code={PARALLAX_SNIPPET} fileName="parallax-demo.tsx" />
        </section>

        <DocsCallout type="tip" title="Radix-style Slot Composition">
          Always use <code className="font-mono text-xs text-blue-700 bg-blue-50 px-1 py-0.5 rounded">asChild</code> whenever you want to apply parallax directly to your custom semantic tags (<code className="font-mono text-xs text-zinc-800">&lt;article&gt;</code>, <code className="font-mono text-xs text-zinc-800">&lt;section&gt;</code>, or styled component). This preserves DOM purity and avoids wrapper nesting.
        </DocsCallout>

        {/* Props Reference */}
        <section id="parallax-props" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            Props Reference
          </h2>
          <DocsTable props={PARALLAX_PROPS} />
        </section>
      </div>
    );
  }

  // Reveal section
  if (primitiveId === 'reveal') {
    return (
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <div className="text-xs font-mono font-semibold text-blue-600 uppercase tracking-wider">
            Core Primitive
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-950 font-mono">
            &lt;Reveal /&gt;
          </h1>
          <p className="text-lg text-zinc-600 leading-relaxed max-w-3xl">
            Viewport intersection reveals with zero layout shifts. Supports entry animations like slide-up, scale, fade, and blur.
          </p>
        </header>

        <section id="reveal-code" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            Usage
          </h2>
          <CodeViewer code={REVEAL_SNIPPET} fileName="reveal-demo.tsx" />
        </section>

        <DocsCallout type="note" title="Zero Layout Shift (CLS = 0)">
          <code className="font-mono text-xs text-blue-700">&lt;Reveal&gt;</code> animates solely via <code className="font-mono text-xs text-zinc-800">transform</code> and <code className="font-mono text-xs text-zinc-800">opacity</code>. It never alters layout properties like height or padding, guaranteeing a 0 Cumulative Layout Shift score in Core Web Vitals.
        </DocsCallout>

        <section id="reveal-props" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            Props Reference
          </h2>
          <DocsTable props={REVEAL_PROPS} />
        </section>
      </div>
    );
  }

  // Pin section
  if (primitiveId === 'pin') {
    return (
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <div className="text-xs font-mono font-semibold text-blue-600 uppercase tracking-wider">
            Core Primitive
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-950 font-mono">
            &lt;Pin /&gt; &amp; &lt;PinContainer /&gt;
          </h1>
          <p className="text-lg text-zinc-600 leading-relaxed max-w-3xl">
            Pin elements cleanly during scroll sequences without breaking native page layout or stacking contexts.
          </p>
        </header>

        <section id="pin-code" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            Usage
          </h2>
          <CodeViewer code={PIN_SNIPPET} fileName="pin-showcase.tsx" />
        </section>

        <DocsCallout type="warning" title="Parent Container Height Contract">
          Sticky pinning requires a parent with defined scroll space (such as <code className="font-mono text-xs text-zinc-800">&lt;PinContainer className="h-[200vh]"&gt;</code>). ScrollCraft checks this in development mode and provides console hints if an ancestor has <code className="font-mono text-xs text-zinc-800">overflow: hidden</code>.
        </DocsCallout>

        <section id="pin-props" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            Props Reference
          </h2>
          <DocsTable props={PIN_PROPS} />
        </section>
      </div>
    );
  }

  // ScrollProgress section
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <div className="text-xs font-mono font-semibold text-blue-600 uppercase tracking-wider">
          Core Primitive
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-950 font-mono">
          &lt;ScrollProgress /&gt;
        </h1>
        <p className="text-lg text-zinc-600 leading-relaxed max-w-3xl">
          Visual scroll indicators for reading bars, telemetry dials, or progress rings. Updates directly via subpixel CSS transforms.
        </p>
      </header>

      <section id="progress-code" className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
          Usage
        </h2>
        <CodeViewer code={SCROLL_PROGRESS_SNIPPET} fileName="progress-bar.tsx" />
      </section>

      <DocsCallout type="tip" title="CSS Transform vs Width">
        Using <code className="font-mono text-xs text-zinc-800">scaleX</code> with <code className="font-mono text-xs text-zinc-800">origin-left</code> is 10x faster than animating <code className="font-mono text-xs text-zinc-800">width: X%</code> because <code className="font-mono text-xs text-zinc-800">scaleX</code> runs entirely on the GPU compositor thread without triggering layout reflows!
      </DocsCallout>

      <section id="progress-props" className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
          Props Reference
        </h2>
        <DocsTable props={SCROLL_PROGRESS_PROPS} />
      </section>
    </div>
  );
};
