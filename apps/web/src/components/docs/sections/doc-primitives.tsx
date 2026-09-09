'use client';

/**
 * Docs Section: Core Primitives (Parallax, Reveal, Pin, ScrollProgress)
 * Embedded with live interactive visualizers and ScrollCraft design tokens.
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
import { ParallaxPlayground } from '../interactive/parallax-playground';
import { RevealPlayground } from '../interactive/reveal-playground';
import { Pin as PinIcon } from 'lucide-react';

interface DocPrimitivesProps {
  primitiveId: string;
}

const PARALLAX_SNIPPET = `import { Parallax } from '@scrollcraft/react';

export function ParallaxExample() {
  return (
    <div className="relative min-h-[150vh] p-8">
      {/* Background card lagging behind naturally (+0.25) */}
      <Parallax asChild speed={0.25} direction="vertical">
        <div className="p-8 rounded-2xl bg-[#FAFAF9] border border-[#E5E7EB]">
          <h4 className="text-xl font-bold text-[#0A0A0A]">Subtle Floating Background</h4>
          <p className="text-sm text-[#6B7280]">Translates at 25% scroll speed lag</p>
        </div>
      </Parallax>

      {/* Foreground card accelerating ahead (-0.15) */}
      <Parallax asChild speed={-0.15}>
        <div className="p-6 rounded-2xl bg-white border border-[#FFEDD5] shadow-lg mt-8">
          <h3 className="text-2xl font-bold text-[#FF5A1F]">Faster Foreground Focus</h3>
        </div>
      </Parallax>
    </div>
  );
}`;

const REVEAL_SNIPPET = `import { Reveal } from '@scrollcraft/react';

export function RevealExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Slide-up transition triggered at 15% viewport intersection */}
      <Reveal variant="slide-up" duration={0.6} delay={0.1}>
        <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
          <h3 className="text-lg font-bold text-[#0A0A0A]">Slide Up Transition</h3>
          <p className="text-xs text-[#6B7280]">Smooth cubic-bezier hardware acceleration</p>
        </div>
      </Reveal>

      {/* Scale-in transition with sequence stagger */}
      <Reveal variant="scale" duration={0.5} delay={0.2}>
        <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
          <h3 className="text-lg font-bold text-[#0A0A0A]">Scale In Transition</h3>
          <p className="text-xs text-[#6B7280]">Transforms scale from 0.88 to 1.0</p>
        </div>
      </Reveal>
    </div>
  );
}`;

const PIN_SNIPPET = `import { Pin, PinContainer } from '@scrollcraft/react';

export function PinExample() {
  return (
    <PinContainer className="h-[250vh]">
      {/* Locks in place at top of viewport for 100% scroll travel */}
      <Pin asChild pinSpacing={true} start="top top" end="+=100%">
        <div className="h-screen w-full flex flex-col justify-center items-center bg-[#FAFAF9]">
          <h2 className="text-4xl font-extrabold text-[#0A0A0A]">Sticky Narrative Showcase</h2>
          <p className="text-[#6B7280] mt-2">Zero DOM spacers. Pure CSS position: sticky.</p>
        </div>
      </Pin>
    </PinContainer>
  );
}`;

const SCROLL_PROGRESS_SNIPPET = `import { ScrollProgress } from '@scrollcraft/react';

export function ReadingProgressBar() {
  return (
    <div className="fixed top-0 inset-x-0 h-1 z-50 bg-[#FAFAF9]">
      {/* Writes scaleX directly to DOM ref during Phase 3 Render */}
      <ScrollProgress asChild axis="y">
        <div className="h-full bg-[#FF5A1F] origin-left" />
      </ScrollProgress>
    </div>
  );
}`;

export const DocPrimitives: React.FC<DocPrimitivesProps> = ({
  primitiveId,
}) => {
  if (primitiveId === 'parallax') {
    return (
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <div className="text-xs font-mono font-semibold text-[#FF5A1F] uppercase tracking-wider">
            Core Primitives
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#0A0A0A] font-mono">
            &lt;Parallax /&gt;
          </h1>
          <p className="text-lg text-[#6B7280] leading-relaxed max-w-3xl">
            Smooth subpixel parallax motion. Writes directly to the browser GPU compositor via the 3-phase ticker with zero React re-renders.
          </p>
        </header>

        {/* Embedded Live Playground */}
        <ParallaxPlayground />

        <section id="parallax-code" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-[#0A0A0A]">
            Usage & Syntax
          </h2>
          <CodeViewer code={PARALLAX_SNIPPET} fileName="parallax-demo.tsx" />
        </section>

        <section id="parallax-props" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-[#0A0A0A]">
            Props Reference
          </h2>
          <DocsTable title="<Parallax /> Props" props={PARALLAX_PROPS} />
        </section>

        <DocsCallout type="tip" title="No Wrapper Divs (asChild)">
          Pass <code className="font-mono text-xs text-[#FF5A1F]">asChild</code> whenever you wrap custom components, Tailwind flex children, or CSS grid elements. ScrollCraft delegates inline transforms and refs directly to your child element without disturbing the layout cascade.
        </DocsCallout>
      </div>
    );
  }

  if (primitiveId === 'reveal') {
    return (
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <div className="text-xs font-mono font-semibold text-[#FF5A1F] uppercase tracking-wider">
            Core Primitives
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#0A0A0A] font-mono">
            &lt;Reveal /&gt;
          </h1>
          <p className="text-lg text-[#6B7280] leading-relaxed max-w-3xl">
            Intersection-based viewport entrance triggers with hardware-accelerated transitions and zero layout recalculations.
          </p>
        </header>

        {/* Embedded Live Sandbox */}
        <RevealPlayground />

        <section id="reveal-code" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-[#0A0A0A]">
            Usage & Syntax
          </h2>
          <CodeViewer code={REVEAL_SNIPPET} fileName="reveal-demo.tsx" />
        </section>

        <section id="reveal-props" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-[#0A0A0A]">
            Props Reference
          </h2>
          <DocsTable title="<Reveal /> Props" props={REVEAL_PROPS} />
        </section>

        <DocsCallout type="note" title="Intersection Observer Optimization">
          Under the hood, <code className="font-mono text-xs text-[#FF5A1F]">&lt;Reveal /&gt;</code> utilizes a single shared <code className="font-mono text-xs text-[#0A0A0A]">IntersectionObserver</code> instance across all elements, decoupling view detection from the scroll event loop.
        </DocsCallout>
      </div>
    );
  }

  if (primitiveId === 'pin') {
    return (
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <div className="text-xs font-mono font-semibold text-[#FF5A1F] uppercase tracking-wider">
            Core Primitives
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#0A0A0A] font-mono">
            &lt;Pin /&gt;
          </h1>
          <p className="text-lg text-[#6B7280] leading-relaxed max-w-3xl">
            Native sticky storytelling primitive. Locks elements in place during a scroll distance budget using pure CSS sticky positioning.
          </p>
        </header>

        {/* Visual Architecture Diagram for Pin */}
        <div className="p-6 rounded-2xl border border-[#E5E7EB] bg-[#FAFAF9] space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0A0A0A] uppercase tracking-wider">
            <PinIcon className="w-4 h-4 text-[#FF5A1F]" />
            <span>Pinning Contract: Native vs Injected Spacers</span>
          </div>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            Other libraries inject dummy <code className="font-mono text-[10px] text-rose-700 bg-rose-50 px-1 py-0.5 rounded">&lt;div style=&quot;height: 2000px&quot;&gt;</code> spacer nodes into the DOM that break Flexbox and CSS Grid. ScrollCraft relies on standard <code className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">position: sticky</code> paired with automated ancestor overflow diagnostics.
          </p>
        </div>

        <section id="pin-code" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-[#0A0A0A]">
            Usage & Syntax
          </h2>
          <CodeViewer code={PIN_SNIPPET} fileName="pin-demo.tsx" />
        </section>

        <section id="pin-props" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-[#0A0A0A]">
            Props Reference
          </h2>
          <DocsTable title="<Pin /> Props" props={PIN_PROPS} />
        </section>

        <DocsCallout type="warning" title="Dev Diagnostics">
          In development mode (<code className="font-mono text-xs text-[#FF5A1F]">process.env.NODE_ENV !== &apos;production&apos;</code>), <code className="font-mono text-xs text-[#0A0A0A]">&lt;Pin /&gt;</code> scans its ancestor DOM tree. If an ancestor has <code className="font-mono text-xs text-[#0A0A0A]">overflow: hidden/auto/scroll</code> that would break sticky positioning, it alerts you with the exact node selector in the console!
        </DocsCallout>
      </div>
    );
  }

  // scroll-progress
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <div className="text-xs font-mono font-semibold text-[#FF5A1F] uppercase tracking-wider">
          Core Primitives
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#0A0A0A] font-mono">
          &lt;ScrollProgress /&gt;
        </h1>
        <p className="text-lg text-[#6B7280] leading-relaxed max-w-3xl">
          Zero-overhead scroll progress bar. Maps normalized 0.0–1.0 completion to GPU scale transforms without triggering parent component re-renders.
        </p>
      </header>

      <section id="progress-code" className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-[#0A0A0A]">
          Usage & Syntax
        </h2>
        <CodeViewer code={SCROLL_PROGRESS_SNIPPET} fileName="reading-progress.tsx" />
      </section>

      <section id="progress-props" className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-[#0A0A0A]">
          Props Reference
        </h2>
        <DocsTable title="<ScrollProgress /> Props" props={SCROLL_PROGRESS_PROPS} />
      </section>

      <DocsCallout type="tip" title="Target Element Tracking">
        By default, <code className="font-mono text-xs text-[#FF5A1F]">&lt;ScrollProgress /&gt;</code> tracks the full document. To track an isolated article or modal container, pass <code className="font-mono text-xs text-[#0A0A0A]">targetRef=&#123;articleRef&#125;</code>.
      </DocsCallout>
    </div>
  );
};
