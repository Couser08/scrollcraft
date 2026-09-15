'use client';

/**
 * ScrollCraft Docs: Core Primitives (Reference-Only)
 * Follows strict 15-second scanning template:
 * - Minimal 5–10 line code block
 * - What it does: one line
 * - Capabilities: bullet list of props/behaviors
 * - Status: Beta
 * Strictly zero prose paragraphs. Zero tutorials.
 */

import React from 'react';
import { CodeViewer } from '@/components/ui/code-viewer';
import { Zap, Play } from 'lucide-react';

import { ParallaxPlayground } from '../interactive/parallax-playground';
import { RevealPlayground } from '../interactive/reveal-playground';
import { PinPlayground } from '../interactive/pin-playground';
import { ScrollProgressPlayground } from '../interactive/scroll-progress-playground';
import { MarqueePlayground } from '../interactive/marquee-playground';
import { HorizontalPlayground } from '../interactive/horizontal-playground';
import { ScrollSequencePlayground } from '../interactive/scroll-sequence-playground';

interface DocPrimitivesProps {
  primitiveId: string;
}

interface PrimitiveReference {
  name: string;
  tag: string;
  status: 'Beta' | 'Alpha';
  code: string;
  whatItDoes: string;
  capabilities: { prop: string; type: string; desc: string; defaultValue?: string }[];
}

const PRIMITIVES_DATA: Record<string, PrimitiveReference> = {
  parallax: {
    name: 'Parallax',
    tag: '<Parallax />',
    status: 'Beta',
    code: `import { Parallax } from '@scrollcraft/react';

export function HeroLayer() {
  return (
    <Parallax speed={-0.2} direction="vertical" clamp={[-120, 120]}>
      <div className="bg-element" />
    </Parallax>
  );
}`,
    whatItDoes: 'Displaces children along vertical or horizontal scroll axes with subpixel physics offsets.',
    capabilities: [
      { prop: 'ref', type: 'React.Ref<HTMLDivElement>', defaultValue: 'undefined', desc: 'Forwarded React ref to the animated DOM container.' },
      { prop: 'speed', type: 'number', defaultValue: '0.2', desc: 'Displacement rate multiplier (+ lags behind scroll, - accelerates ahead).' },
      { prop: 'direction', type: "'vertical' | 'horizontal'", defaultValue: "'vertical'", desc: 'Axis of translation (translates translateY vs translateX).' },
      { prop: 'clamp', type: '[number, number]', defaultValue: 'undefined', desc: 'Displacement boundaries [min, max] in pixels to prevent unbounded drift.' },
      { prop: 'asChild', type: 'boolean', defaultValue: 'false', desc: 'Radix-style Slot composition into immediate child without injecting extra wrapper <div>.' },
      { prop: 'className', type: 'string', defaultValue: "''", desc: 'Merged onto component or child element style attribute.' },
    ],
  },

  reveal: {
    name: 'Reveal',
    tag: '<Reveal />',
    status: 'Beta',
    code: `import { Reveal } from '@scrollcraft/react';

export function CardEntrance() {
  return (
    <Reveal direction="up" distance={32} duration={0.6} delay={0.1}>
      <div className="feature-card">High Performance Animation</div>
    </Reveal>
  );
}`,
    whatItDoes: 'Hardware-accelerated entrance animation triggered upon intersecting viewport visibility thresholds.',
    capabilities: [
      { prop: 'ref', type: 'React.Ref<HTMLDivElement>', defaultValue: 'undefined', desc: 'Forwarded React ref to the animated element.' },
      { prop: 'direction', type: "'up' | 'down' | 'left' | 'right'", defaultValue: "'up'", desc: 'Entrance translation vector.' },
      { prop: 'distance', type: 'number', defaultValue: '24', desc: 'Initial offset distance in pixels before triggering entrance.' },
      { prop: 'threshold', type: 'number', defaultValue: '0.15', desc: 'Intersection ratio threshold (0.0 to 1.0) before transition fires.' },
      { prop: 'duration', type: 'number', defaultValue: '0.6', desc: 'Animation duration in seconds.' },
      { prop: 'delay', type: 'number', defaultValue: '0', desc: 'Sequence or stagger delay in seconds.' },
      { prop: 'once', type: 'boolean', defaultValue: 'true', desc: 'Whether to fire transition only once or replay upon re-intersection.' },
      { prop: 'asChild', type: 'boolean', defaultValue: 'false', desc: 'Applies transitions and ref directly to immediate child element.' },
    ],
  },

  pin: {
    name: 'Pin',
    tag: '<Pin />',
    status: 'Beta',
    code: `import { Pin } from '@scrollcraft/react';

export function StickyDisplay() {
  return (
    <Pin start="top top" end="+=150%" pinSpacing={true}>
      <div className="locked-card">Holds viewport position</div>
    </Pin>
  );
}`,
    whatItDoes: 'Locks elements into sticky viewport coordinates for a designated scroll travel distance budget.',
    capabilities: [
      { prop: 'ref', type: 'React.Ref<HTMLDivElement>', defaultValue: 'undefined', desc: 'Forwarded React ref to the pinned element.' },
      { prop: 'start', type: 'string | number', defaultValue: "'top top'", desc: 'Viewport intersection trigger point where sticky lock initiates.' },
      { prop: 'end', type: 'string | number', defaultValue: "'+=100%'", desc: 'Scroll travel distance through which the element remains locked.' },
      { prop: 'pinSpacing', type: 'boolean', defaultValue: 'true', desc: 'Preserves geometric scroll clearance so surrounding content does not collapse.' },
      { prop: 'top', type: 'number', defaultValue: '0', desc: 'Sticky offset from viewport top edge in pixels.' },
      { prop: 'asChild', type: 'boolean', defaultValue: 'false', desc: 'Renders child directly into pinning track without wrapper overhead.' },
    ],
  },

  'scroll-progress': {
    name: 'ScrollProgress',
    tag: '<ScrollProgress />',
    status: 'Beta',
    code: `import { ScrollProgress } from '@scrollcraft/react';

export function TopProgressBar() {
  return (
    <ScrollProgress className="fixed top-0 left-0 right-0 h-1 bg-violet-500 origin-left" />
  );
}`,
    whatItDoes: 'Tracks and normalizes scroll completion from 0.0 to 1.0 across a container or entire viewport.',
    capabilities: [
      { prop: 'ref', type: 'React.Ref<HTMLDivElement>', defaultValue: 'undefined', desc: 'Forwarded React ref to the progress bar element.' },
      { prop: 'targetRef', type: 'RefObject<HTMLElement>', defaultValue: 'undefined', desc: 'Target element to track (omit to measure full document body scroll).' },
      { prop: 'axis', type: "'y' | 'x'", defaultValue: "'y'", desc: 'Scroll orientation axis to monitor.' },
      { prop: 'asChild', type: 'boolean', defaultValue: 'false', desc: 'Passes normalized ratio (0–1) directly to custom child render function or SVG.' },
      { prop: 'className', type: 'string', defaultValue: "''", desc: 'Styles applied to the progress indicator element.' },
    ],
  },

  'velocity-marquee': {
    name: 'VelocityMarquee',
    tag: '<VelocityMarquee />',
    status: 'Beta',
    code: `import { VelocityMarquee } from '@scrollcraft/react';

export function KineticStrip() {
  return (
    <VelocityMarquee baseSpeed={1.5} velocityMultiplier={0.08} direction="left">
      <span>120 FPS SUBPIXEL &bull; ZERO RE-RENDERS &bull;&nbsp;</span>
    </VelocityMarquee>
  );
}`,
    whatItDoes: 'Continuous horizontal text/image track whose crawl velocity accelerates dynamically with user scroll.',
    capabilities: [
      { prop: 'ref', type: 'React.Ref<HTMLDivElement>', defaultValue: 'undefined', desc: 'Forwarded React ref to the marquee track wrapper.' },
      { prop: 'baseSpeed', type: 'number', defaultValue: '1', desc: 'Stationary crawling speed in pixels per frame.' },
      { prop: 'velocityMultiplier', type: 'number', defaultValue: '0.05', desc: 'Multiplier applied to instantaneous user scroll velocity.' },
      { prop: 'direction', type: "'left' | 'right'", defaultValue: "'left'", desc: 'Horizontal motion direction of the marquee track.' },
      { prop: 'maxSpeed', type: 'number', defaultValue: '50', desc: 'Maximum velocity clamp in pixels per frame to prevent visual tearing.' },
    ],
  },

  'horizontal-scroll': {
    name: 'HorizontalScroll',
    tag: '<HorizontalScroll />',
    status: 'Beta',
    code: `import { HorizontalScroll } from '@scrollcraft/react';

export function HorizontalGallery() {
  return (
    <HorizontalScroll speed={2.5}>
      <div className="flex gap-8 items-center h-screen">
        <div className="w-80 h-96 bg-zinc-900 rounded-2xl" />
        <div className="w-80 h-96 bg-zinc-900 rounded-2xl" />
      </div>
    </HorizontalScroll>
  );
}`,
    whatItDoes: 'Converts vertical document scroll into pinned horizontal sliding track motion.',
    capabilities: [
      { prop: 'ref', type: 'React.Ref<HTMLDivElement>', defaultValue: 'undefined', desc: 'Forwarded React ref to the outer pinned scroll container.' },
      { prop: 'speed', type: 'number', defaultValue: '2', desc: 'Scroll distance multiplier relative to viewport height (e.g. 2 = 200vh total travel).' },
      { prop: 'className', type: 'string', defaultValue: "''", desc: 'Styles applied to outer pinned container.' },
      { prop: 'innerClassName', type: 'string', defaultValue: "''", desc: 'Styles applied to inner horizontal translating track.' },
    ],
  },

  'scroll-sequence': {
    name: 'ScrollSequence',
    tag: '<ScrollSequence />',
    status: 'Beta',
    code: `import { ScrollSequence } from '@scrollcraft/react';

export function CanvasScrub({ frames }: { frames: string[] }) {
  return (
    <ScrollSequence frames={frames} height="300vh" speed={1.5} />
  );
}`,
    whatItDoes: 'Preloads and scrubs sequential image frames on an HTML5 canvas based on pinned scroll progress.',
    capabilities: [
      { prop: 'ref', type: 'React.Ref<HTMLCanvasElement>', defaultValue: 'undefined', desc: 'Forwarded React ref to the HTML5 canvas element.' },
      { prop: 'frames', type: 'string[]', defaultValue: 'required', desc: 'Array of sequential frame image URLs.' },
      { prop: 'height', type: 'string', defaultValue: "'300vh'", desc: 'CSS scroll travel height budget for scrubbing through the sequence.' },
      { prop: 'speed', type: 'number', defaultValue: '1.5', desc: 'Scrubbing sensitivity multiplier across image frames.' },
    ],
  },
};

const PLAYGROUNDS: Record<string, React.ComponentType> = {
  parallax: ParallaxPlayground,
  reveal: RevealPlayground,
  pin: PinPlayground,
  'scroll-progress': ScrollProgressPlayground,
  'velocity-marquee': MarqueePlayground,
  'horizontal-scroll': HorizontalPlayground,
  'scroll-sequence': ScrollSequencePlayground,
};

export const DocPrimitives: React.FC<DocPrimitivesProps> = ({ primitiveId }) => {
  const primitive = PRIMITIVES_DATA[primitiveId] || PRIMITIVES_DATA.parallax;
  const PlaygroundComponent = PLAYGROUNDS[primitiveId];

  return (
    <div className="space-y-10 not-prose">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-extrabold text-white tracking-tight font-mono">
              {primitive.tag}
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30">
              {primitive.status}
            </span>
          </div>
          <p className="text-sm text-zinc-300 font-sans">
            <strong className="text-white">What it does:</strong> {primitive.whatItDoes}
          </p>
        </div>
      </div>

      {/* Live Interactive Playground Sandbox */}
      {PlaygroundComponent && (
        <div id="interactive-demo" className="space-y-3 scroll-mt-24">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-violet-400 font-semibold">
            <Play className="w-3.5 h-3.5 text-violet-400" />
            <span>Interactive Playground &bull; Live Telemetry</span>
          </div>
          <div className="rounded-2xl border border-zinc-800/80 overflow-hidden bg-[#070709] shadow-xl">
            <PlaygroundComponent />
          </div>
        </div>
      )}

      {/* Minimal 5-10 Line Syntax Highlighted Code Snippet */}
      <div id="syntax" className="space-y-3 scroll-mt-24">
        <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
          Syntax &bull; 5–10 Line Reference
        </span>
        <CodeViewer code={primitive.code} fileName={`${primitive.name.toLowerCase()}.tsx`} />
      </div>

      {/* Capabilities Reference */}
      <div id="capabilities" className="space-y-4 pt-4 scroll-mt-24">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
          <Zap className="w-3.5 h-3.5 text-violet-400" />
          <span>Capabilities &amp; Props</span>
        </div>

        <div className="rounded-xl border border-zinc-800 overflow-hidden bg-[#0a0a0c]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-900/80 text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="px-4 py-2.5 font-semibold">Prop</th>
                <th className="px-4 py-2.5 font-semibold">Type</th>
                <th className="px-4 py-2.5 font-semibold">Default</th>
                <th className="px-4 py-2.5 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-sans text-zinc-300">
              {primitive.capabilities.map((c) => (
                <tr key={c.prop} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="px-4 py-3 font-mono text-violet-400 font-semibold">{c.prop}</td>
                  <td className="px-4 py-3 font-mono text-purple-300 text-[11px]">{c.type}</td>
                  <td className="px-4 py-3 font-mono text-zinc-500 text-[11px]">{c.defaultValue ?? '—'}</td>
                  <td className="px-4 py-3 text-zinc-300 text-xs">{c.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Signal */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs font-mono text-zinc-400 flex items-center justify-between">
        <span>Status: <strong className="text-amber-400 uppercase">{primitive.status}</strong></span>
        <span className="text-[11px] text-zinc-500 font-sans">
          API surface may shift before 1.0 &bull; Direct GPU compositor writes
        </span>
      </div>
    </div>
  );
};
