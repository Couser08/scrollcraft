# ScrollCraft v0.1.1 (Beta) — The Definitive Pro Guide & Architecture Spec

> **For AI Assistants & Developers:** This document is the single source of truth for `@scrollcraft/react` and `@scrollcraft/core` version `0.1.1`.  
> ScrollCraft is a **headless, zero-rerender, compositor-thread-native scroll engine** for React 18/19 and Next.js 14/15 App Router.  
> It does **NOT** work like Framer Motion (no continuous React state updates) and does **NOT** work like GSAP (no heavy DOM wrappers or global window polluters).

---

## 🤖 AI Prompt Preambles (Copy-Paste for LLMs / Cursor / Copilot)

When prompting an AI to generate components using ScrollCraft, prefix your prompt with:

```markdown
You are building with ScrollCraft v0.1.1 (@scrollcraft/react and @scrollcraft/core).
Strict Rules:
1. Always use declarative primitives (<Parallax>, <Reveal>, <Pin>, <HorizontalScroll>, <ScrollSequence>, <VelocityMarquee>).
2. Never create extra wrapping <div> elements if layout preservation is needed — use the `asChild` prop.
3. Zero-Rerender rule: Do NOT use reactive useState on scroll ticks unless strictly necessary. `usePin` defaults to `trackState: false`.
4. Import strictly from `@scrollcraft/react` for components/hooks, and `@scrollcraft/core` for low-level math/solvers.
5. Wrap the root layout in `<ScrollCraftProvider smooth>` (or `<ScrollProvider>`).
```

---

## 1. Architectural Comparison: ScrollCraft vs GSAP + Lenis vs Framer Motion

| Feature / Metric | ⚡ **ScrollCraft v0.1.1** | 🐢 **GSAP ScrollTrigger + Lenis** | 📦 **Framer Motion (`useScroll`)** |
|---|---|---|---|
| **Core Architecture** | 3-Phase Microtask Kernel (Measure → Mutate → Render) | Imperative ticker + manual DOM style injection | React Reconciliation hook loop |
| **React Re-Renders on Scroll** | **0 (Zero)** — direct hardware transforms via refs | 0 (Manual DOM writes bypass React entirely) | **60–120 re-renders/sec** unless wrapped in `useTransform` motion values |
| **Native CSS Scroll Timeline** | **Yes (`opts.driver = 'auto'`)** — offloads to GPU compositor thread on Chromium | No — requires JS RAF ticking for everything | No — JS animation loop driven |
| **Next.js Server Components (RSC)** | **100% RSC-Safe** (all client primitives cleanly marked `'use client'`) | Requires client `useEffect` wrappers & manual `ScrollTrigger.refresh()` | Requires client components |
| **Element Wrapping (`asChild`)** | **Yes** — Radix-grade Slot composition (zero extra DOM nodes) | No — requires explicit wrapper elements or selector strings | No — requires `<motion.div>` tags |
| **Bundle Size (Brotli)** | **< 4.9 KB** tree-shaken (`Parallax`), **15.9 KB** full core engine | **~32 KB** (GSAP) + **~3.8 KB** (Lenis) = **~36 KB** | **~35 KB** (`framer-motion`) |
| **Subpixel Momentum Physics** | **Built-in** (Lenis-grade inertial physics kernel) | Requires installing separate `lenis` package | Spring physics only (no scroll inertia normalization) |
| **Reduced-Motion Handling** | **Automatic** — respects `@media (prefers-reduced-motion: reduce)` repo-wide | Manual check via `window.matchMedia` required | Semi-automatic (`useReducedMotion`) |
| **Open Source License** | **MIT (100% Free for commercial use)** | Commercial license required for SaaS / paid products | MIT |

---

### Code Comparison: Parallax Card

#### ❌ GSAP + Lenis (Imperative, Heavy Boilerplate, Memory Leak Prone)
```tsx
'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export function GSAPCard() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis();
    const raf = (time: number) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);

    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        y: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          scrub: true,
          start: 'top bottom',
          end: 'bottom top',
        },
      });
    });

    return () => {
      ctx.revert();
      lenis.destroy();
    };
  }, []);

  return <div ref={ref} className="card">Heavy GSAP Setup</div>;
}
```

#### ❌ Framer Motion (Triggers React Component Re-renders or Heavy Motion Proxies)
```tsx
'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function MotionCard() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // Forces <motion.div> wrapper, breaking semantic tags or complex child slotting
  return <motion.div ref={ref} style={{ y }} className="card">Framer Motion</motion.div>;
}
```

#### ✅ ScrollCraft 0.1.1 (Zero-Rerender, Slot-Based, Direct GPU Mutation)
```tsx
'use client';
import { Parallax } from '@scrollcraft/react';

export function ScrollCraftCard() {
  return (
    // Directly mutates transform: translate3d on the compositor thread with zero layout shift
    <Parallax speed={0.3} min={-100} max={100} asChild>
      <div className="card">Declarative, Clean, Zero-Rerender</div>
    </Parallax>
  );
}
```

---

## 2. Root Setup: `<ScrollCraftProvider>`

Wrap your layout (e.g. `app/layout.tsx` in Next.js) with `<ScrollCraftProvider>`.

```tsx
// app/providers.tsx
'use client';

import { ScrollCraftProvider } from '@scrollcraft/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ScrollCraftProvider
      smooth={{
        damping: 0.1,    // Inertial resistance (0.05 to 0.2)
        lerp: 0.08,       // Subpixel interpolation factor
        wheelMultiplier: 1.0,
      }}
      respectReducedMotion={true} // Auto-bypasses transforms for users with motion sensitivity
      debug={process.env.NODE_ENV === 'development'} // Mounts HUD inspector in development
    >
      {children}
    </ScrollCraftProvider>
  );
}
```

---

## 3. The `asChild` Slot Composition Pattern

### Why `asChild` Matters
By default, most libraries force you to wrap elements in a `<div>`:
```tsx
<Parallax><button>Click me</button></Parallax> // ❌ Produces <div><button>...</button></div>
```
This **breaks CSS Grid, Flexbox layouts, button styling, and Next.js `<Image>` containers**.

ScrollCraft provides **Radix-grade Slot Composition** via `asChild`:
```tsx
<Parallax speed={0.2} asChild>
  <button className="bg-violet-600 px-6 py-3 rounded-lg text-white">
    Direct Mutation
  </button>
</Parallax>
```
**Result in DOM:** Exactly `<button class="...">` — **NO wrapper `<div>` created!**  
ScrollCraft merges refs (`composeRefs`), merges `className`, and merges `style` directly onto your child element.

---

## 4. Complete Primitives Reference & Production Recipes

### 1. `<Parallax>` & `useParallax` (Hardware Parallax)

#### Props Interface:
```typescript
interface ParallaxProps extends React.HTMLAttributes<HTMLElement> {
  speed?: number;                   // > 0 moves slower (depth), < 0 moves faster. Default: 0.2
  direction?: 'vertical' | 'horizontal'; // Default: 'vertical'
  min?: number;                     // Minimum displacement clamp (px)
  max?: number;                     // Maximum displacement clamp (px)
  origin?: 'auto' | 'center' | 'top' | number; // 'auto' = anti-jump for hero sections (displacement is strictly 0 at scrollY=0)
  bleed?: boolean | number;         // Auto-scales image to prevent unpainted gaps
  scale?: number;                   // Scale multiplier during travel
  rotate?: number;                  // Rotation degrees during travel
  driver?: 'auto' | 'native' | 'js';// 'auto' picks native CSS scroll timeline on Chrome, falls back to JS
  respectReducedMotion?: boolean;   // Default: true
  asChild?: boolean;
}
```

#### Production Recipe: Hero Section Anti-Jump Image Parallax
```tsx
import { Parallax } from '@scrollcraft/react';
import Image from 'next/image';

export function HeroParallax() {
  return (
    <section className="relative h-[90vh] overflow-hidden">
      {/* origin="auto" guarantees image starts at exactly 0px displacement on top of page */}
      <Parallax speed={0.35} origin="auto" bleed={20} asChild>
        <Image
          src="/hero.webp"
          alt="Hero background"
          fill
          priority
          className="object-cover"
        />
      </Parallax>

      <div className="relative z-10 flex h-full items-center justify-center">
        <Parallax speed={-0.15} asChild>
          <h1 className="text-6xl font-bold tracking-tight text-white">
            Future-Proof Physics
          </h1>
        </Parallax>
      </div>
    </section>
  );
}
```

---

### 2. `<Reveal>` & `useReveal` (Intersection Slide & Blur)

#### Props Interface:
```typescript
interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'; // Default: 'up'
  distance?: number;        // Slide distance in pixels. Default: 32
  duration?: number;        // Duration in seconds. Default: 0.6
  delay?: number;           // Delay in seconds. Default: 0
  threshold?: number;       // Intersection threshold (0 to 1). Default: 0.15
  once?: boolean;           // Fire only once or toggle on scroll. Default: true
  blur?: boolean | number;  // Atmospheric blur in px (e.g. 8). Default: false
  scale?: number;           // Scale start factor (e.g. 0.95). Default: 1
  rotateX?: number;         // 3D tilt X in degrees. Default: 0
  rotateY?: number;         // 3D tilt Y in degrees. Default: 0
  stagger?: number;         // Stagger increment in seconds. Default: 0.05
  index?: number;           // Sibling index for auto-stagger
  onReveal?: () => void;    // Fired on reveal (0 re-renders)
  asChild?: boolean;
}
```

#### Production Recipe: Staggered Feature Cards with 3D Tilt
```tsx
import { Reveal } from '@scrollcraft/react';

const FEATURES = [
  { title: 'Subpixel RAF', desc: 'Normalized trackpad and mousewheel physics.' },
  { title: 'Slot Composition', desc: 'Zero wrapper elements injected into the DOM.' },
  { title: 'Zero Re-Renders', desc: 'Direct GPU style mutation via ref mutators.' },
];

export function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto py-24">
      {FEATURES.map((f, i) => (
        <Reveal
          key={f.title}
          direction="up"
          distance={40}
          blur={10}
          duration={0.7}
          delay={i * 0.1}
          rotateX={8}
          asChild
        >
          <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
            <h3 className="text-xl font-semibold text-white">{f.title}</h3>
            <p className="mt-2 text-zinc-400">{f.desc}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
```

---

### 3. `<HorizontalScroll>` (Pinned Horizontal Track)

Pins the screen using CSS `position: sticky` and translates horizontal items with GPU subpixel interpolation.

#### Props Interface:
```typescript
interface HorizontalScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;           // Scroll travel speed multiplier. Default: 1
  driver?: 'auto' | 'js' | 'native';
  className?: string;       // Outer container class (controls track scroll height)
  stickyClassName?: string; // Sticky window class (default: 'sticky top-0 h-screen w-full overflow-hidden flex items-center')
  innerClassName?: string;  // Track class holding the sliding flex child cards
  children: React.ReactNode;
}
```

#### Production Recipe: Horizontal Showcase Cards
```tsx
import { HorizontalScroll } from '@scrollcraft/react';

export function HorizontalGallery() {
  return (
    <HorizontalScroll className="bg-zinc-950">
      <div className="flex gap-8 px-16">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="w-[80vw] sm:w-[450px] h-[550px] shrink-0 rounded-3xl bg-zinc-900 border border-zinc-800 p-8 flex flex-col justify-between"
          >
            <span className="text-zinc-600 font-mono text-sm">CARD // 0{i + 1}</span>
            <h2 className="text-3xl font-bold text-white">Full Compositor Pinning</h2>
          </div>
        ))}
      </div>
    </HorizontalScroll>
  );
}
```

---

### 4. `<ScrollSequence>` (Apple-Style Frame-by-Frame Canvas Scrubbing)

Smoothly draws sequential image frames onto an HTML5 Canvas synced to scroll distance.

#### Props Interface:
```typescript
interface ScrollSequenceProps extends React.HTMLAttributes<HTMLDivElement> {
  frames: string[];         // Array of frame image URLs (e.g. ['/frames/001.webp', ...])
  height?: string | number; // Total scroll space budget (e.g. '300vh')
  fit?: 'contain' | 'cover';// Canvas scaling mode. Default: 'cover'
  fps?: number;             // Virtual framerate. Default: 30
  poster?: string;          // Static image while loading frames
  className?: string;
}
```

#### Production Recipe: Hardware Canvas Scrubber
```tsx
import { ScrollSequence } from '@scrollcraft/react';

const FRAMES = Array.from({ length: 90 }, (_, i) => 
  `/sequence/airpods-${String(i + 1).padStart(3, '0')}.webp`
);

export function ProductScrubber() {
  return (
    <section className="relative">
      <ScrollSequence
        frames={FRAMES}
        height="350vh"
        fit="contain"
        poster="/sequence/airpods-001.webp"
        className="w-full bg-black"
      />
    </section>
  );
}
```

---

### 5. `<Pin>` & `usePin` (Sticky Viewport Locking & Scrubbing)

> ⚠️ **CRITICAL ARCHITECTURAL RULE FOR 0.1.1:**  
> `usePin` defaults to `trackState: false` to enforce **Zero React Re-renders** during scroll.  
> If you render progress or pinned flags directly in JSX (e.g. `<span>{isPinned ? 'PINNED' : 'FREE'}</span>`), you MUST pass `trackState: true`.

#### Props Interface:
```typescript
interface PinProps extends React.HTMLAttributes<HTMLElement> {
  start?: string | number;  // Trigger start (e.g. 'top top'). Default: 'top top'
  end?: string | number;    // Pin travel range (e.g. '+=100%'). Default: '+=100%'
  top?: number;             // Top offset (px). Default: 0
  pinSpacing?: boolean | number; // Automatically push subsequent DOM flow down. Default: false
  trackState?: boolean;     // Opt-in to React state re-renders (default: false)
  onEnter?: () => void;     // Forward enter lifecycle callback
  onLeave?: () => void;     // Forward exit lifecycle callback
  onProgress?: (p: number) => void; // Normalized scrub progress (0.0 to 1.0)
  asChild?: boolean;
}
```

#### Production Recipe: Pinned Scrubbing Card
```tsx
import { Pin } from '@scrollcraft/react';

export function PinnedShowcase() {
  return (
    <div className="py-24 bg-zinc-950">
      <Pin
        start="top top"
        end="+=150%"
        pinSpacing={true}
        top={80}
        asChild
      >
        <div className="max-w-4xl mx-auto h-[70vh] rounded-3xl bg-zinc-900 border border-zinc-800 p-12 flex flex-col justify-center items-center shadow-2xl">
          <h2 className="text-4xl font-extrabold text-white text-center">
            Locked in Viewport
          </h2>
          <p className="mt-4 text-zinc-400 text-center max-w-md">
            The page scrolls for 150% viewport height while this card stays locked in place.
          </p>
        </div>
      </Pin>
    </div>
  );
}
```

---

### 6. `<VelocityMarquee>` (Velocity-Accelerated Ticker)

Auto-scrolls text or logos at a base speed, and dynamically accelerates proportionally to user scroll velocity.

#### Props Interface:
```typescript
interface VelocityMarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  baseSpeed?: number;           // Idle speed in px/frame. Default: 1.5
  velocityMultiplier?: number;  // Scroll momentum boost multiplier. Default: 0.2
  direction?: 'left' | 'right'; // Travel direction. Default: 'left'
  maxSpeed?: number;            // Velocity cap in px/frame. Default: 15
  className?: string;
  children: React.ReactNode;
}
```

#### Production Recipe: Dynamic Logo Marquee
```tsx
import { VelocityMarquee } from '@scrollcraft/react';

export function BrandMarquee() {
  return (
    <div className="py-12 border-y border-zinc-800 bg-zinc-950 overflow-hidden">
      <VelocityMarquee baseSpeed={2} velocityMultiplier={0.3} maxSpeed={12}>
        <div className="flex gap-16 items-center whitespace-nowrap text-3xl font-black uppercase text-zinc-500">
          <span>HIGH-THROUGHPUT ARCHITECTURE</span>
          <span>•</span>
          <span>SUBPIXEL LENIS DAMPING</span>
          <span>•</span>
          <span>ZERO LAYOUT SHIFT</span>
          <span>•</span>
          <span>NATIVE CSS VIEW TIMELINE</span>
          <span>•</span>
        </div>
      </VelocityMarquee>
    </div>
  );
}
```

---

### 7. `<Magnetic>` & `useMagnetic` (Dual-Layer 3D Button Attraction)

Spring-physics cursor attraction with optional inner target parallax.

```tsx
import { Magnetic } from '@scrollcraft/react';
import { useRef } from 'react';

export function MagneticCTA() {
  const labelRef = useRef<HTMLSpanElement>(null);

  return (
    <Magnetic
      strength={0.4}
      radius={150}
      innerTargetRef={labelRef}
      innerStrength={0.6}
      asChild
    >
      <button className="relative px-8 py-4 rounded-full bg-violet-600 text-white font-semibold text-lg shadow-lg hover:shadow-violet-500/25 transition-shadow">
        <span ref={labelRef} className="inline-block">
          Explore Showcase
        </span>
      </button>
    </Magnetic>
  );
}
```

---

### 8. Headless Telemetry: `useScrollProgress` & `useScrollCraft`

For custom canvas, WebGL, or SVG animations, use headless hooks:

```tsx
import { useRef } from 'react';
import { useScrollProgress, useScrollCraft } from '@scrollcraft/react';

export function ProgressHud() {
  const { scrollTo } = useScrollCraft();
  const containerRef = useRef<HTMLDivElement>(null);

  // reactive: false guarantees 0 React re-renders!
  const { progress } = useScrollProgress({
    target: containerRef,
    reactive: true, // Only if you must render progress in JSX
  });

  return (
    <div ref={containerRef} className="h-[200vh] relative p-8">
      <div className="fixed top-24 right-8 bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-white">
        Progress: {(progress * 100).toFixed(1)}%
        <button
          onClick={() => scrollTo(0, { duration: 1.0 })}
          className="block mt-2 text-xs text-violet-400 underline"
        >
          Scroll to Top
        </button>
      </div>
    </div>
  );
}
```

---

## 5. Pro Tips for High-End Motion Design

1. **Multi-Layer 3D Parallax Staging:**
   - Background elements: `speed={0.4}` to `0.6` (moves slower, feels far away).
   - Midground elements: `speed={0.2}` (natural depth).
   - Foreground overlays: `speed={-0.2}` (moves faster than scroll, passes camera).
2. **Hero Section Anti-Jump:**
   Always add `origin="auto"` to hero parallax elements located at `scrollY = 0`. Without it, elements positioned relative to viewport center will jump when the page loads.
3. **Preventing GPU Layer Thrashing:**
   Do not add `will-change: transform` to everything. ScrollCraft's internal compositor dynamically manages GPU layers. Only apply `will-change: transform` to continuously animated high-resolution images.
4. **Mobile Responsiveness:**
   On mobile viewports, touch inertia is handled natively by iOS/Android momentum scrolling. ScrollCraft automatically adapts touch inputs without fighting native browser gesture curves.
5. **Reduced-Motion Fallback:**
   Always leave `respectReducedMotion={true}` (default). When active, elements instantly snap to visible without slide transitions, and transforms are frozen.

---

## 6. Library Import Cheat-Sheet

```typescript
// Components & Primitives
import {
  ScrollCraftProvider,
  ScrollProvider,
  Parallax,
  Reveal,
  Pin,
  HorizontalScroll,
  ScrollSequence,
  VelocityMarquee,
  Magnetic,
  TextReveal,
  StackedCards,
  ScrollInspector,
  Slot,
} from '@scrollcraft/react';

// Hooks
import {
  useScrollCraft,
  useParallax,
  useReveal,
  usePin,
  useScrollProgress,
  useScrollTransform,
  useScrollDraw,
  useMagnetic,
  useScrollDirection,
  useTicker,
} from '@scrollcraft/react';

// Core Low-Level Solvers & Ticker
import {
  Ticker,
  ticker,
  GlobalResizeManager,
  ParallaxSolver,
  HorizontalScrollSolver,
  VelocityMarqueeSolver,
  clamp,
  damp,
  springStep,
  mapRange,
} from '@scrollcraft/core';
```
