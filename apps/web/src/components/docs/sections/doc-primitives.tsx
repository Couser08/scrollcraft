'use client';

import React from 'react';
import { CodeViewer } from '@/components/ui/code-viewer';
import { DocsTable } from '../docs-table';
import { DocsCallout } from '../docs-callout';
import {
  PARALLAX_PROPS,
  REVEAL_PROPS,
  PIN_PROPS,
  SCROLL_PROGRESS_PROPS,
  VELOCITY_MARQUEE_PROPS,
  HORIZONTAL_SCROLL_PROPS,
  SCROLL_SEQUENCE_PROPS,
} from '../docs-data';
import { ParallaxPlayground } from '../interactive/parallax-playground';
import { RevealPlayground } from '../interactive/reveal-playground';
import { MarqueePlayground } from '../interactive/marquee-playground';
import { HorizontalPlayground } from '../interactive/horizontal-playground';
import { PinPlayground } from '../interactive/pin-playground';
import { ScrollProgressPlayground } from '../interactive/scroll-progress-playground';
import { ScrollSequencePlayground } from '../interactive/scroll-sequence-playground';
import { Pin as PinIcon } from 'lucide-react';

interface DocPrimitivesProps {
  primitiveId: string;
}

// Parallax Snippets
const PARALLAX_REACT = `import { Parallax } from '@scrollcraft/react';

export function ParallaxHero() {
  return (
    <div className="relative min-h-[150vh] p-8">
      {/* Background layer lagging behind naturally (+0.25) */}
      <Parallax asChild speed={0.25} direction="vertical">
        <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800">
          <h4 className="text-xl font-bold text-white">Subtle Floating Background</h4>
          <p className="text-sm text-zinc-400">Translates at 25% scroll speed lag</p>
        </div>
      </Parallax>

      {/* Foreground card accelerating ahead (-0.15) */}
      <Parallax asChild speed={-0.15}>
        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-700 shadow-2xl mt-8">
          <h3 className="text-2xl font-bold text-blue-400">Faster Foreground Focus</h3>
        </div>
      </Parallax>
    </div>
  );
}`;

const PARALLAX_NEXT = `'use client';

import { Parallax } from '@scrollcraft/react';

export function ParallaxHero() {
  return (
    <div className="relative min-h-[150vh] p-8">
      <Parallax asChild speed={0.25} direction="vertical">
        <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800">
          <h4 className="text-xl font-bold text-white">Subtle Floating Background</h4>
          <p className="text-sm text-zinc-400">Translates at 25% scroll speed lag</p>
        </div>
      </Parallax>

      <Parallax asChild speed={-0.15}>
        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-700 shadow-2xl mt-8">
          <h3 className="text-2xl font-bold text-blue-400">Faster Foreground Focus</h3>
        </div>
      </Parallax>
    </div>
  );
}`;

// Reveal Snippets
const REVEAL_REACT = `import { Reveal } from '@scrollcraft/react';

export function RevealGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Slide-up transition triggered on viewport entrance */}
      <Reveal direction="up" distance={32} duration={0.6} delay={0.1}>
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
          <h3 className="text-lg font-bold text-white">Slide Up Transition</h3>
          <p className="text-xs text-zinc-400">Smooth cubic-bezier hardware acceleration</p>
        </div>
      </Reveal>

      {/* Slide-left transition with sequence stagger */}
      <Reveal direction="left" distance={32} duration={0.6} delay={0.2}>
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
          <h3 className="text-lg font-bold text-white">Slide Left Transition</h3>
          <p className="text-xs text-zinc-400">Zero React re-renders during viewport trigger</p>
        </div>
      </Reveal>
    </div>
  );
}`;

const REVEAL_NEXT = `'use client';

import { Reveal } from '@scrollcraft/react';

export function RevealGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Reveal direction="up" distance={32} duration={0.6} delay={0.1}>
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
          <h3 className="text-lg font-bold text-white">Slide Up Transition</h3>
          <p className="text-xs text-zinc-400">Smooth cubic-bezier hardware acceleration</p>
        </div>
      </Reveal>

      <Reveal direction="left" distance={32} duration={0.6} delay={0.2}>
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
          <h3 className="text-lg font-bold text-white">Slide Left Transition</h3>
          <p className="text-xs text-zinc-400">Zero React re-renders during viewport trigger</p>
        </div>
      </Reveal>
    </div>
  );
}`;

// Pin Snippets
const PIN_REACT = `import { Pin, PinContainer } from '@scrollcraft/react';

export function PinStory() {
  return (
    <PinContainer className="h-[250vh]">
      {/* Locks in place at top of viewport for 100% scroll travel */}
      <Pin asChild pinSpacing={true} start="top top" end="+=100%">
        <div className="h-screen w-full flex flex-col justify-center items-center bg-[#070709]">
          <h2 className="text-4xl font-extrabold text-white">Sticky Narrative Showcase</h2>
          <p className="text-zinc-400 mt-2">Zero DOM spacers. Pure CSS position: sticky.</p>
        </div>
      </Pin>
    </PinContainer>
  );
}`;

const PIN_NEXT = `'use client';

import { Pin, PinContainer } from '@scrollcraft/react';

export function PinStory() {
  return (
    <PinContainer className="h-[250vh]">
      <Pin asChild pinSpacing={true} start="top top" end="+=100%">
        <div className="h-screen w-full flex flex-col justify-center items-center bg-[#070709]">
          <h2 className="text-4xl font-extrabold text-white">Sticky Narrative Showcase</h2>
          <p className="text-zinc-400 mt-2">Zero DOM spacers. Pure CSS position: sticky.</p>
        </div>
      </Pin>
    </PinContainer>
  );
}`;

// ScrollProgress Snippets
const PROGRESS_REACT = `import { ScrollProgress } from '@scrollcraft/react';

export function ReadingProgressBar() {
  return (
    <div className="fixed top-0 inset-x-0 h-1 z-50 bg-zinc-900">
      {/* Writes scaleX directly to DOM ref during Phase 3 Render */}
      <ScrollProgress asChild axis="y">
        <div className="h-full bg-blue-500 origin-left" />
      </ScrollProgress>
    </div>
  );
}`;

const PROGRESS_NEXT = `'use client';

import { ScrollProgress } from '@scrollcraft/react';

export function ReadingProgressBar() {
  return (
    <div className="fixed top-0 inset-x-0 h-1 z-50 bg-zinc-900">
      <ScrollProgress asChild axis="y">
        <div className="h-full bg-blue-500 origin-left" />
      </ScrollProgress>
    </div>
  );
}`;

// Marquee Snippets
const MARQUEE_REACT = `import { VelocityMarquee } from '@scrollcraft/react';

export function KineticTicker() {
  return (
    <div className="w-full overflow-hidden bg-black text-white py-4 border-y border-zinc-800">
      {/* Accelerates dynamically based on user scroll velocity */}
      <VelocityMarquee
        baseSpeed={1.5}
        velocityMultiplier={0.08}
        direction="left"
        maxSpeed={40}
      >
        <div className="flex items-center gap-8 font-mono text-xl font-bold">
          <span>SCROLLCRAFT</span>
          <span className="text-blue-500">•</span>
          <span>120 FPS SUBPIXEL</span>
          <span className="text-blue-500">•</span>
          <span>ZERO JANK MOTION</span>
          <span className="text-blue-500">•</span>
        </div>
      </VelocityMarquee>
    </div>
  );
}`;

const MARQUEE_NEXT = `'use client';

import { VelocityMarquee } from '@scrollcraft/react';

export function KineticTicker() {
  return (
    <div className="w-full overflow-hidden bg-black text-white py-4 border-y border-zinc-800">
      <VelocityMarquee
        baseSpeed={1.5}
        velocityMultiplier={0.08}
        direction="left"
        maxSpeed={40}
      >
        <div className="flex items-center gap-8 font-mono text-xl font-bold">
          <span>SCROLLCRAFT</span>
          <span className="text-blue-500">•</span>
          <span>120 FPS SUBPIXEL</span>
          <span className="text-blue-500">•</span>
          <span>ZERO JANK MOTION</span>
          <span className="text-blue-500">•</span>
        </div>
      </VelocityMarquee>
    </div>
  );
}`;

// Horizontal Scroll Snippets
const HORIZONTAL_REACT = `import { HorizontalScroll } from '@scrollcraft/react';

export function ProjectGallery() {
  return (
    // speed={2.5} provides a 250vh scroll distance budget
    <HorizontalScroll speed={2.5} className="bg-[#070709]">
      <div className="flex gap-8 pl-12 pr-48 items-center h-screen">
        <div className="w-96 h-64 rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shrink-0 shadow-2xl">
          <h3 className="text-white text-xl font-bold">Slide 01</h3>
          <p className="text-zinc-400 mt-2 text-sm">Hardware accelerated horizontal translation</p>
        </div>
        <div className="w-96 h-64 rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shrink-0 shadow-2xl">
          <h3 className="text-white text-xl font-bold">Slide 02</h3>
          <p className="text-zinc-400 mt-2 text-sm">Zero layout shifts on parent document</p>
        </div>
      </div>
    </HorizontalScroll>
  );
}`;

const HORIZONTAL_NEXT = `'use client';

import { HorizontalScroll } from '@scrollcraft/react';

export function ProjectGallery() {
  return (
    <HorizontalScroll speed={2.5} className="bg-[#070709]">
      <div className="flex gap-8 pl-12 pr-48 items-center h-screen">
        <div className="w-96 h-64 rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shrink-0 shadow-2xl">
          <h3 className="text-white text-xl font-bold">Slide 01</h3>
          <p className="text-zinc-400 mt-2 text-sm">Hardware accelerated horizontal translation</p>
        </div>
        <div className="w-96 h-64 rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shrink-0 shadow-2xl">
          <h3 className="text-white text-xl font-bold">Slide 02</h3>
          <p className="text-zinc-400 mt-2 text-sm">Zero layout shifts on parent document</p>
        </div>
      </div>
    </HorizontalScroll>
  );
}`;

// Sequence Snippets
const SEQUENCE_REACT = `import { ScrollSequence } from '@scrollcraft/react';

const FRAMES = [
  '/sequence/frame_001.webp',
  '/sequence/frame_002.webp',
  // ... 120 image frames
  '/sequence/frame_120.webp',
];

export function ProductExplosion() {
  return (
    <ScrollSequence
      frames={FRAMES}
      height="350vh"
      speed={1.5}
      className="bg-black"
    />
  );
}`;

const SEQUENCE_NEXT = `'use client';

import { ScrollSequence } from '@scrollcraft/react';

const FRAMES = [
  '/sequence/frame_001.webp',
  '/sequence/frame_002.webp',
  // ... 120 image frames
  '/sequence/frame_120.webp',
];

export function ProductExplosion() {
  return (
    <ScrollSequence
      frames={FRAMES}
      height="350vh"
      speed={1.5}
      className="bg-black"
    />
  );
}`;

export const DocPrimitives: React.FC<DocPrimitivesProps> = ({
  primitiveId,
}) => {
  if (primitiveId === 'parallax') {
    return (
      <div className="flex flex-col gap-12">
        <header className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-[11px] font-mono font-semibold text-blue-400 uppercase tracking-widest w-fit">
            CORE PRIMITIVES
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tighter text-white leading-[1.08] font-mono">
            &lt;Parallax /&gt;
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-3xl">
            Smooth subpixel parallax motion. Writes directly to the browser GPU compositor via the 3-phase ticker with zero React re-renders.
          </p>
        </header>

        {/* Embedded Live Playground */}
        <ParallaxPlayground />

        <section id="parallax-code" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Usage & Syntax
          </h2>
          <CodeViewer
            tabs={[
              { label: 'React', code: PARALLAX_REACT, fileName: 'src/ParallaxHero.tsx' },
              { label: 'Next.js', code: PARALLAX_NEXT, fileName: 'app/components/ParallaxHero.tsx' },
            ]}
          />
        </section>

        <section id="parallax-props" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Props Reference
          </h2>
          <DocsTable title="<Parallax /> Props" props={PARALLAX_PROPS} />
        </section>

        <DocsCallout type="tip" title="Headless asChild Slot Composition">
          Pass <code className="font-mono text-xs text-blue-400">asChild</code> whenever you wrap custom components, Tailwind flex children, or CSS grid elements. ScrollCraft delegates inline transforms and refs directly to your child element without disturbing the DOM cascade.
        </DocsCallout>
      </div>
    );
  }

  if (primitiveId === 'reveal') {
    return (
      <div className="flex flex-col gap-12">
        <header className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-[11px] font-mono font-semibold text-blue-400 uppercase tracking-widest w-fit">
            CORE PRIMITIVES
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tighter text-white leading-[1.08] font-mono">
            &lt;Reveal /&gt;
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-3xl">
            Intersection-based viewport entrance triggers with hardware-accelerated transitions and zero layout recalculations.
          </p>
        </header>

        {/* Embedded Live Sandbox */}
        <RevealPlayground />

        <section id="reveal-code" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Usage & Syntax
          </h2>
          <CodeViewer
            tabs={[
              { label: 'React', code: REVEAL_REACT, fileName: 'src/RevealGrid.tsx' },
              { label: 'Next.js', code: REVEAL_NEXT, fileName: 'app/components/RevealGrid.tsx' },
            ]}
          />
        </section>

        <section id="reveal-props" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Props Reference
          </h2>
          <DocsTable title="<Reveal /> Props" props={REVEAL_PROPS} />
        </section>

        <DocsCallout type="note" title="Intersection Observer Optimization">
          Under the hood, <code className="font-mono text-xs text-blue-400">&lt;Reveal /&gt;</code> utilizes a single shared <code className="font-mono text-xs text-white">IntersectionObserver</code> instance across all elements, decoupling view detection from the scroll event loop.
        </DocsCallout>
      </div>
    );
  }

  if (primitiveId === 'pin') {
    return (
      <div className="flex flex-col gap-12">
        <header className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-[11px] font-mono font-semibold text-blue-400 uppercase tracking-widest w-fit">
            CORE PRIMITIVES
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tighter text-white leading-[1.08] font-mono">
            &lt;Pin /&gt;
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-3xl">
            Native sticky storytelling primitive. Locks elements in place during a scroll distance budget using pure CSS sticky positioning.
          </p>
        </header>

        {/* Live Interactive Pin Playground */}
        <PinPlayground />

        {/* Visual Architecture Diagram for Pin */}
        <div className="p-6 rounded-xl border border-zinc-800/80 bg-[#09090b] space-y-3 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
            <PinIcon className="w-4 h-4 text-blue-400" />
            <span>Pinning Contract: Native Sticky vs Injected Spacers</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Other libraries inject dummy <code className="font-mono text-[10px] text-rose-400 bg-rose-950/40 px-1.5 py-0.5 rounded border border-rose-900/40">&lt;div style=&quot;height: 2000px&quot;&gt;</code> spacer nodes that break Flexbox and CSS Grid layouts. ScrollCraft relies on standard <code className="font-mono text-[10px] text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-900/40">position: sticky</code> paired with automated ancestor overflow diagnostics.
          </p>
        </div>

        <section id="pin-code" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Usage & Syntax
          </h2>
          <CodeViewer
            tabs={[
              { label: 'React', code: PIN_REACT, fileName: 'src/PinStory.tsx' },
              { label: 'Next.js', code: PIN_NEXT, fileName: 'app/components/PinStory.tsx' },
            ]}
          />
        </section>

        <section id="pin-props" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Props Reference
          </h2>
          <DocsTable title="<Pin /> Props" props={PIN_PROPS} />
        </section>

        <DocsCallout type="warning" title="Dev Diagnostics">
          In development mode (<code className="font-mono text-xs text-amber-400">process.env.NODE_ENV !== &apos;production&apos;</code>), <code className="font-mono text-xs text-white">&lt;Pin /&gt;</code> scans its ancestor DOM tree. If an ancestor has <code className="font-mono text-xs text-white">overflow: hidden/auto/scroll</code> that would break sticky positioning, it alerts you with the exact node selector in the console.
        </DocsCallout>
      </div>
    );
  }

  if (primitiveId === 'scroll-progress') {
    return (
      <div className="flex flex-col gap-12">
        <header className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-[11px] font-mono font-semibold text-blue-400 uppercase tracking-widest w-fit">
            CORE PRIMITIVES
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tighter text-white leading-[1.08] font-mono">
            &lt;ScrollProgress /&gt;
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-3xl">
            Zero-overhead scroll progress indicator. Maps normalized 0.0–1.0 completion to GPU scale transforms without triggering parent component re-renders.
          </p>
        </header>

        {/* Real Engine Live Sandbox */}
        <ScrollProgressPlayground />

        <section id="progress-code" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Usage & Syntax
          </h2>
          <CodeViewer
            tabs={[
              { label: 'React', code: PROGRESS_REACT, fileName: 'src/ReadingProgressBar.tsx' },
              { label: 'Next.js', code: PROGRESS_NEXT, fileName: 'app/components/ReadingProgressBar.tsx' },
            ]}
          />
        </section>

        <section id="progress-props" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Props Reference
          </h2>
          <DocsTable title="<ScrollProgress /> Props" props={SCROLL_PROGRESS_PROPS} />
        </section>

        <DocsCallout type="tip" title="Target Element Tracking">
          By default, <code className="font-mono text-xs text-blue-400">&lt;ScrollProgress /&gt;</code> tracks the full document. To track an isolated article or modal container, pass <code className="font-mono text-xs text-white">targetRef=&#123;articleRef&#125;</code>.
        </DocsCallout>
      </div>
    );
  }

  if (primitiveId === 'velocity-marquee') {
    return (
      <div className="flex flex-col gap-12">
        <header className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-[11px] font-mono font-semibold text-blue-400 uppercase tracking-widest w-fit">
            KINETIC PRIMITIVES
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tighter text-white leading-[1.08] font-mono">
            &lt;VelocityMarquee /&gt;
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-3xl">
            Continuous kinetic marquee that dynamically accelerates with user scroll velocity. Features infinite seamless modulo looping and exponential decay settling.
          </p>
        </header>

        {/* Real Engine Live Sandbox */}
        <MarqueePlayground />

        <section id="marquee-code" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Usage & Syntax
          </h2>
          <CodeViewer
            tabs={[
              { label: 'React', code: MARQUEE_REACT, fileName: 'src/KineticTicker.tsx' },
              { label: 'Next.js', code: MARQUEE_NEXT, fileName: 'app/components/KineticTicker.tsx' },
            ]}
          />
        </section>

        <section id="marquee-props" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Props Reference
          </h2>
          <DocsTable title="<VelocityMarquee /> Props" props={VELOCITY_MARQUEE_PROPS} />
        </section>

        <DocsCallout type="note" title="Modulo Wrap Optimization">
          The marquee reads child geometry once on mount via <code className="font-mono text-xs text-white">ResizeObserver</code> and wraps seamlessly via modulo arithmetic. Zero duplicate DOM cloning loops.
        </DocsCallout>
      </div>
    );
  }

  if (primitiveId === 'horizontal-scroll') {
    return (
      <div className="flex flex-col gap-12">
        <header className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-[11px] font-mono font-semibold text-blue-400 uppercase tracking-widest w-fit">
            LAYOUT PRIMITIVES
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tighter text-white leading-[1.08] font-mono">
            &lt;HorizontalScroll /&gt;
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-3xl">
            Sticky section scroll-jacking primitive. Maps vertical page travel into horizontal card translation without disrupting parent flexbox or CSS grid flows.
          </p>
        </header>

        {/* Real Engine Live Sandbox */}
        <HorizontalPlayground />

        <section id="horizontal-code" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Usage & Syntax
          </h2>
          <CodeViewer
            tabs={[
              { label: 'React', code: HORIZONTAL_REACT, fileName: 'src/ProjectGallery.tsx' },
              { label: 'Next.js', code: HORIZONTAL_NEXT, fileName: 'app/components/ProjectGallery.tsx' },
            ]}
          />
        </section>

        <section id="horizontal-props" className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Props Reference
          </h2>
          <DocsTable title="<HorizontalScroll /> Props" props={HORIZONTAL_SCROLL_PROPS} />
        </section>

        <DocsCallout type="tip" title="Sticky Container Sizing">
          Set <code className="font-mono text-xs text-blue-400">speed=&#123;2.5&#125;</code> to grant 250vh of vertical scroll travel budget to scrub comfortably across wide horizontal galleries.
        </DocsCallout>
      </div>
    );
  }

  // scroll-sequence
  return (
    <div className="flex flex-col gap-12">
      <header className="flex flex-col gap-4">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-[11px] font-mono font-semibold text-blue-400 uppercase tracking-widest w-fit">
          MEDIA PRIMITIVES
        </div>
        <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tighter text-white leading-[1.08] font-mono">
          &lt;ScrollSequence /&gt;
        </h1>
        <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-3xl">
          Apple-style canvas image sequence scrubber. Preloads image frame sequences and paints directly to an HTML5 &lt;canvas&gt; with device pixel ratio scaling.
        </p>
      </header>

      {/* Real Engine Live Sandbox */}
      <ScrollSequencePlayground />

      <section id="sequence-code" className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Usage & Syntax
        </h2>
        <CodeViewer
          tabs={[
            { label: 'React', code: SEQUENCE_REACT, fileName: 'src/ProductExplosion.tsx' },
            { label: 'Next.js', code: SEQUENCE_NEXT, fileName: 'app/components/ProductExplosion.tsx' },
          ]}
        />
      </section>

      <section id="sequence-props" className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Props Reference
        </h2>
        <DocsTable title="<ScrollSequence /> Props" props={SCROLL_SEQUENCE_PROPS} />
      </section>

      <DocsCallout type="tip" title="High-DPI Retina Displays">
        <code className="font-mono text-xs text-blue-400">&lt;ScrollSequence /&gt;</code> automatically multiplies canvas pixel buffer size by <code className="font-mono text-xs text-white">window.devicePixelRatio</code> to guarantee razor-sharp image scrubbing on Retina displays.
      </DocsCallout>
    </div>
  );
};
