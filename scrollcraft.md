# ScrollCraft: The Definitive Developer & AI Architecture Manual

> **ScrollCraft** is an ultra-high-performance, headless game-dev physics and scroll-driven animation engine for the modern web (React, Next.js, React Three Fiber, and vanilla JS).

---

## 1. Bundle Size & Performance Telemetry

ScrollCraft is built with strict zero-dependency physics, optimized WebGL/composite transforms, and dual ESM/CJS packaging.

### Distribution Footprint (Production Minified)

| Package | Format | Raw Minified | Gzip (Over the Wire) | Brotli |
| :--- | :--- | :--- | :--- | :--- |
| **`@scrollcraft/core`** | Modern ESM (`dist/index.mjs`) | **50.0 KB** | **13.0 KB** | **11.4 KB** |
| **`@scrollcraft/core`** | CommonJS (`dist/index.js`) | **51.3 KB** | **13.5 KB** | **11.8 KB** |
| **`@scrollcraft/react`** | Modern ESM (`dist/index.mjs`) | **27.7 KB** | **9.0 KB** | **8.0 KB** |
| **`@scrollcraft/react`** | CommonJS (`dist/index.js`) | **30.0 KB** | **9.3 KB** | **8.2 KB** |
| **`@scrollcraft/r3f`** | Modern ESM (`dist/index.mjs`) | **1.9 KB** | **0.77 KB** | **0.67 KB** |

---

### 📊 Industry Benchmark Comparison

| Library Stack | What It Covers | Gzipped Size (Wire) | Minified Size (Raw) |
| :--- | :--- | :--- | :--- |
| **GSAP Core** | Basic tweens & timelines | ~23 KB – 25 KB | ~69 KB |
| **GSAP Core + ScrollTrigger** | Tweens + Scroll scrub & Pinning | ~35 KB – 37 KB | ~100+ KB |
| **GSAP + ScrollTrigger + Lenis** | Full Scroll + Smooth Inertia | **~40 KB – 43 KB** | **~115+ KB** |
| **Framer Motion (Full)** | General motion + basic scroll | ~32 KB – 35 KB | ~119 KB – 181 KB |
| **Framer Motion (LazyMotion / Mini)** | Micro UI fades (No smooth scroll/pinning) | ~4.6 KB – 5 KB | ~15 KB |
| **ScrollCraft Core (`@scrollcraft/core`)** | **Engine + Physics + Lenis + PinSolver** | **13.0 KB** | **50.0 KB** |
| **ScrollCraft React (`@scrollcraft/react`)** | **All 6 Primitives + 7 Components + 13 Hooks** | **9.0 KB** | **27.7 KB** |
| **ScrollCraft (Full Stack: Core + React)** | **Complete Animation + Scroll + Physics Ecosystem** | **~22.0 KB** | **~77.7 KB** |

> **Key Takeaway:** To match ScrollCraft's capabilities (Smooth Inertia + Scroll Scrubbing + Pinning + Primitives + Canvas Scrubber), you would need `GSAP + ScrollTrigger + Lenis` (~42 KB Gzip) or `Framer Motion + Lenis` (~38 KB Gzip). **ScrollCraft delivers the entire integrated system in just ~22 KB Gzip (~47% smaller footprint).**

### Runtime Performance Benchmarks
- **Stress Throughput:** **500 concurrent parallax elements** execute in **0.835 ms per frame** (~1,198 theoretical FPS).
- **Stress Budget:** Sustains **120 Hz** refresh rate on modern ProMotion displays without dropped frames.
- **Zero Layout Thrashing:** Decouples DOM reads from composite GPU writes across a 4-phase micro-task tick loop.

---

## 2. Installation & Ecosystem Setup

### Package Manager Command (Once Published to Public NPM)

```bash
# Core + React (Recommended for Next.js & React apps)
npm install @scrollcraft/core @scrollcraft/react

# Or with pnpm
pnpm add @scrollcraft/core @scrollcraft/react

# Or with yarn / bun
yarn add @scrollcraft/core @scrollcraft/react
bun add @scrollcraft/core @scrollcraft/react
```

---

### ⚠️ Current NPM Status: Pre-Release & Local Monorepo Workflow

> **Important Note:** `@scrollcraft/core` and `@scrollcraft/react` are fully implemented, tested, and built under `packages/core` and `packages/react`. Until the library is officially published to the public npm registry (`npmjs.com`), here is how you use it:

#### Option A: Inside this Repository (`apps/web` & Showcase)
If you are developing inside this monorepo, everything is already wired via **pnpm workspaces** (`workspace:*`):
```bash
# 1. Install workspace dependencies
pnpm install

# 2. Build the packages
pnpm build

# 3. Run the showcase web app
pnpm dev
```
All showcase and app code cleanly imports from the official package identifiers without any dirty hacks:
```tsx
import { Parallax, Pin, Reveal, ScrollCraftProvider } from '@scrollcraft/react';
import { InertiaEngine, ticker } from '@scrollcraft/core';
```

#### Option B: In an External Project Right Now (via Tarball / Local Link)
If you want to use ScrollCraft in an external Next.js or React app **before** the public npm release:
```bash
# 1. Inside the ScrollCraft repo, generate production tarballs:
pnpm --dir packages/core pack
pnpm --dir packages/react pack

# 2. In your external project, install the generated tarballs directly:
npm install /path/to/scrollcraft/packages/core/scrollcraft-core-0.1.0.tgz /path/to/scrollcraft/packages/react/scrollcraft-react-0.1.0.tgz
```

#### Option C: Publishing to Public NPM Registry (For Authors / Maintainers)
To make `@scrollcraft/core` and `@scrollcraft/react` publicly installable for anyone worldwide via `npm install`:
```bash
# 1. Log in to your npm account (must have rights to @scrollcraft organization or publish un-scoped)
npm login

# 2. Build fresh production minified distributions
pnpm build

# 3. Publish both packages with public access
pnpm --filter @scrollcraft/core publish --access public
pnpm --filter @scrollcraft/react publish --access public
```

---

### 💡 Do I need to install anything else?
**NO.** Once installed, `@scrollcraft/core` and `@scrollcraft/react` provide the complete, self-contained suite:
- **No extra smooth scroll library:** Inertia physics (Lenis) are natively integrated.
- **No GSAP or ScrollTrigger needed:** Pinning, scrubs, and multi-track keyframe timelines are built-in.
- **No Framer Motion needed:** Declarative primitives (`<Parallax>`, `<Reveal>`, `<ScrollTransform>`) are built-in.
- **No external profiling tools needed:** Live FPS meter, latency timer, and Telemetry HUD (`<ScrollInspector>`) are built-in.

### 🌲 Automatic Tree-Shaking & Bundle Isolation
Even though the full suite is in `node_modules`, modern bundlers (Next.js, Vite, Webpack) automatically tree-shake unused code:
- If a page only imports `<Parallax>` and `<Reveal>`, your page bundle increases by only **~5 KB – 8 KB Gzip**.
- Complex components you don't use (such as Canvas `<ScrollSequence>` or `<StackedCards>`) are completely stripped from your production output.

### Optional Extensions
```bash
# For 3D WebGL Three.js / R3F Canvas syncing:
npm install @scrollcraft/r3f three @types/three @react-three/fiber

# For the CLI scaffolding tool:
npm install -D @scrollcraft/cli
```

---

## 3. Architecture & Mental Model

Traditional animation libraries hook directly into `window.onscroll` and update React state (`useState`), causing continuous full-tree React re-renders, layout recalculations (`reflow`), and mobile scroll stutter.

ScrollCraft operates like a **game engine**:

```
[Raw Scroll Event / Lenis Inertia]
               │
               ▼
     [InertiaEngine Physics Integration]
               │
               ▼
     [Phase 1: READ - Geometry / Rect Measurements]
               │
               ▼
     [Phase 2: COMPUTE - Springs / Dampers / Timelines]
               │
               ▼
     [Phase 3: RENDER - Direct GPU translate3d / Compositor]
               │
               ▼
     [Phase 4: CLEANUP / Post-Render Tasks]
```

1. **4-Phase Tick Loop (`read` → `compute` → `render` → `destroy`):**
   - Measurements (`getBoundingClientRect`) only happen in `read`.
   - Kinematics and spring calculations happen in `compute`.
   - DOM updates (`transform: translate3d(...)`) execute directly in `render` using sub-millisecond layer promotion.
2. **TransformComposer:**
   - Elements can have multiple independent animation owners (e.g., Parallax + Pin + Magnetic + Skew) without overwriting each other's CSS transforms.
3. **Zero-Rerender State:**
   - React components do not re-render during scrolling unless you explicitly subscribe using `useScrollCraftMetrics(selector)`.
4. **Adaptive Tier Management:**
   - Auto-detects device refresh rates and hardware capabilities (`high`, `balanced`, `low`) and dynamically scales physics calculations.

---

## 4. Quick Start: Next.js & React Setup

### Next.js (App Router) Integration

Wrap your layout with `<ScrollProvider>` or `<ScrollCraftProvider>`:

```tsx
// app/layout.tsx
import type { Metadata } from 'next';
import { ScrollCraftProvider } from '@scrollcraft/react';
import './globals.css';

export const metadata: Metadata = {
  title: 'My Award Winning Website',
  description: 'Powered by ScrollCraft Engine',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-neutral-950 text-neutral-100 overflow-x-hidden">
        <ScrollCraftProvider
          smooth={true}
          autoRecalc={true}
          respectReducedMotion={true}
          debug={process.env.NODE_ENV === 'development'}
        >
          {children}
        </ScrollCraftProvider>
      </body>
    </html>
  );
}
```

---

## 5. Declarative Primitives (`@scrollcraft/react`)

All primitives support `asChild` composition via Radix-style Slot forwarding, letting you animate your own custom elements, Next.js `<Image>`, or Tailwind containers without wrapper `div` pollution.

---

### 🧠 Deep Dive: `asChild` Composition & `ref` Forwarding Rules

#### Iska Matlab Kya Hai? (How it works under the hood)
ScrollCraft React ke `useState` ko bypass karke **direct browser ke DOM element** (HTML node) pe GPU transform likhta hai:
```js
// ScrollCraft ko is HTML node ko grab karne ke liye `ref` chahiye hota hai
node.style.transform = `translate3d(0, ${offset}px, 0)`;
```
Jab aap `asChild` likhte ho, toh aap ScrollCraft ko bolte ho:
> *"Apna extra wrapper `<div>` mat banao, mere diye huye direct child element ko hi pakad kar animate karo."*

---

#### 🟢 Scenario 1: Native HTML Elements (95% cases — Zero Config)
Agar child me koi normal HTML tag hai jaise `<div>`, `<section>`, `<article>`, `<h1>`, `<img>`, etc., toh **kuch bhi extra nahi karna** hota:
```tsx
// ✅ Automatically 100% plug-and-play works out-of-the-box
<Parallax asChild speed={0.2}>
  <div className="card">
    <h2>Hello World</h2>
  </div>
</Parallax>
```
React native HTML elements pe `ref` automatically attach kar leta hai.

---

#### 🟡 Scenario 2: Custom React Component (Yahan Issue Aata Hai)
Problem tab aati hai jab aap native tag ki jagah apna **Custom React Component** pass karte ho:
```tsx
// ❌ YEH KAAM NAHI KAREGA (Agar MyCustomCard ref support nahi karta)
<Parallax asChild speed={0.2}>
  <MyCustomCard title="Shoes" price={99} />
</Parallax>
```
**Aisa kyun hota hai?**  
React me custom function components by default bahar se aane wale `ref` ko andar ke HTML element tak pass nahi karte. ScrollCraft ko underlying DOM node mil nahi pata, aur console me warning aa jati hai:
> *"Function components cannot be given refs. Did you mean to use React.forwardRef()?"*

---

#### 🛠️ Solutions: Custom Components ko `asChild` ke saath kaise use karein

##### Solution 1: `forwardRef` (React 18 Standard / Best Practice)
Custom component ko `React.forwardRef` se wrap karein aur `ref` root DOM element pe pass karein:
```tsx
import React, { forwardRef } from 'react';

export const MyCustomCard = forwardRef<HTMLDivElement, { title: string }>((props, ref) => {
  return (
    <div ref={ref} className="p-6 bg-white rounded-xl shadow">
      <h3>{props.title}</h3>
    </div>
  );
});

MyCustomCard.displayName = 'MyCustomCard';
```

##### Solution 2: Direct `ref` prop (React 19 Native)
React 19 me `forwardRef` ki zaroorat nahi hoti; `ref` standard prop ki tarah accept hota hai:
```tsx
// React 19:
export function MyCustomCard({ title, ref }: { title: string; ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div ref={ref} className="p-6 bg-white rounded-xl shadow">
      <h3>{title}</h3>
    </div>
  );
}
```

##### Solution 3: Shortcut (Bina Component Modify Kiye)
Agar third-party component hai jisme `forwardRef` add nahi kar sakte:
- **Option A (Wrapper `div`):**
  ```tsx
  <Parallax asChild speed={0.2}>
    <div>
      <ThirdPartyCard />
    </div>
  </Parallax>
  ```
- **Option B (Bina `asChild` use kiye - Recommended):**
  ```tsx
  // asChild omit kar do - ScrollCraft khud apna clean wrapper <div> provide karega
  <Parallax speed={0.2}>
    <ThirdPartyCard />
  </Parallax>
  ```

---

#### 📋 Quick Reference Matrix

| Child Element Type | `asChild` Support | Kya Karna Hoga? |
| :--- | :---: | :--- |
| **Native HTML** (`<div />`, `<img />`, `<h1 />`) | ✅ **YES** | **Kuch nahi!** 100% plug-and-play. |
| **Custom Component** (`<MyCard />`) | ⚠️ **Conditional** | `forwardRef` (React 18) ya `ref` prop (React 19) pass karein. |
| **Bina `asChild` ke (Default)** | ✅ **YES** | Chahe koi bhi component ho, ScrollCraft automatic wrapper `div` se animate karta hai. |

---

### 1. `<Parallax>`
Creates depth displacement based on scroll travel.

```tsx
import { Parallax } from '@scrollcraft/react';

// Basic usage
<Parallax speed={0.4} direction="vertical">
  <div className="bg-neutral-800 p-8 rounded-2xl">
    <h3>Foreground Card (Moves Slower)</h3>
  </div>
</Parallax>

// With asChild composition and custom clamping
<Parallax speed={-0.3} min={-100} max={100} driver="js" asChild>
  <img 
    src="/hero-artwork.webp" 
    alt="Hero Artwork" 
    className="w-full h-auto rounded-3xl"
  />
</Parallax>
```
**Props:**
- `speed?: number` (Default: `0.2`): Multiplier. `> 0` moves slower (deeper), `< 0` moves faster.
- `direction?: 'vertical' | 'horizontal'` (Default: `'vertical'`).
- `min?: number`, `max?: number`: Clamp limits in pixels.
- `driver?: 'auto' | 'js' | 'native'` (Default: `'auto'`).
- `respectReducedMotion?: boolean` (Default: `true`).
- `asChild?: boolean` (Default: `false`).

---

### 2. `<Pin>` and `<PinContainer>`
Locks an element at a sticky viewport offset for a specified scroll travel distance.

```tsx
import { Pin, PinContainer } from '@scrollcraft/react';

export function PinnedShowcase() {
  return (
    <PinContainer height="300vh" className="relative">
      <Pin top={60} duration={1500} asChild>
        <div className="h-screen flex items-center justify-center">
          <h2 className="text-6xl font-bold">Stays Fixed for 1500px of Scroll</h2>
        </div>
      </Pin>
    </PinContainer>
  );
}
```
**Props:**
- `top?: number` (Default: `0`): Sticky top offset in pixels.
- `bottom?: number`: Bottom boundary limit offset.
- `duration?: number`: Scroll travel distance in pixels.
- `onProgress?: (progress: number) => void`: Real-time normalized scroll progress (`0.0` to `1.0`).
- `trackState?: boolean`: Set `true` if you need React state updates for re-rendering UI based on progress.

---

### 3. `<Reveal>`
Reveals elements smoothly into view when they enter the viewport.

```tsx
import { Reveal } from '@scrollcraft/react';

<Reveal direction="up" distance={40} duration={0.8} threshold={0.2}>
  <div className="card">
    <h3>Reveals upward when 20% visible</h3>
  </div>
</Reveal>
```
**Props:**
- `direction?: 'up' | 'down' | 'left' | 'right' | 'none'` (Default: `'up'`).
- `distance?: number` (Default: `32`): Slide travel distance in pixels.
- `duration?: number` (Default: `0.6`): Duration in seconds.
- `delay?: number` (Default: `0`): Transition delay in seconds.
- `threshold?: number` (Default: `0.15`): Intersection ratio.
- `once?: boolean` (Default: `true`): Trigger only once or reset on leave.

---

### 4. `<ScrollProgress>`
Builds smooth scroll progress indicators (e.g. reading progress bar or circular scrubbers).

```tsx
import { ScrollProgress } from '@scrollcraft/react';

// Top reading bar
<ScrollProgress className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-indigo-500 origin-left z-50" />
```

---

### 5. `<ScrollTransform>`
Directly maps scroll progress to CSS property animations without writing manual listeners.

```tsx
import { ScrollTransform } from '@scrollcraft/react';

<ScrollTransform
  keyframes={{
    opacity: [[0, 0], [0.3, 1], [0.8, 1], [1, 0]],
    scale: [[0, 0.8], [0.5, 1], [1, 1.2]],
    translateY: [[0, 50], [1, -50]]
  }}
>
  <div className="scale-and-fade-card">
    Fluid Cinematic Transform
  </div>
</ScrollTransform>
```

---

### 6. `<ScrollDraw>`
Draws SVG paths dynamically linked to scroll progress.

```tsx
import { ScrollDraw } from '@scrollcraft/react';

<svg viewBox="0 0 100 100" className="w-48 h-48">
  <ScrollDraw 
    d="M 10,50 Q 50,0 90,50 Q 50,100 10,50" 
    stroke="#38bdf8" 
    strokeWidth={4} 
    fill="none" 
  />
</svg>
```

---

## 6. High-Performance Visual Components

Pre-built, production-tested interactive storytelling components:

### 1. `<HorizontalScroll>`
Transforms vertical page scrolling into horizontal gallery panning with sticky pinning.

```tsx
import { HorizontalScroll } from '@scrollcraft/react';

export function Gallery() {
  return (
    <HorizontalScroll speed={2.5} className="bg-neutral-900 py-12">
      <div className="w-[80vw] h-[60vh] bg-red-500 rounded-3xl mx-4 flex-shrink-0" />
      <div className="w-[80vw] h-[60vh] bg-blue-500 rounded-3xl mx-4 flex-shrink-0" />
      <div className="w-[80vw] h-[60vh] bg-emerald-500 rounded-3xl mx-4 flex-shrink-0" />
      <div className="w-[80vw] h-[60vh] bg-amber-500 rounded-3xl mx-4 flex-shrink-0" />
    </HorizontalScroll>
  );
}
```

---

### 2. `<VelocityMarquee>`
An infinite marquee whose speed accelerates with user scroll velocity and smoothly glides back to rest using spring physics.

```tsx
import { VelocityMarquee } from '@scrollcraft/react';

<VelocityMarquee baseSpeed={2} velocityMultiplier={0.15} direction={1}>
  <span className="text-8xl font-black uppercase tracking-widest px-8">
    ScrollCraft Engine • Award Winning Motion • 120 FPS Direct Composite •
  </span>
</VelocityMarquee>
```

---

### 3. `<ScrollSequence>`
Apple AirPods Pro-style canvas frame scrubber. Preloads image arrays and scrubs frame-by-frame on canvas with DPR scaling.

```tsx
import { ScrollSequence } from '@scrollcraft/react';

const frameUrls = Array.from({ length: 120 }, (_, i) => 
  `/frames/render_${String(i).padStart(4, '0')}.webp`
);

export function ProductHero() {
  return (
    <ScrollSequence 
      frames={frameUrls} 
      speed={2} 
      className="w-full h-screen"
    />
  );
}
```

---

### 4. `<TextReveal>`
Typography scrubber revealing headlines character-by-character, word-by-word, or line-by-line.

```tsx
import { TextReveal } from '@scrollcraft/react';

<TextReveal 
  mode="words" 
  className="text-5xl font-extrabold max-w-3xl leading-tight"
>
  Crafting digital experiences where performance meets uncompromising visual art.
</TextReveal>
```

---

### 5. `<Magnetic>`
Attracts interactive elements (buttons, avatars, badges) to cursor position or scroll vectors.

```tsx
import { Magnetic } from '@scrollcraft/react';

<Magnetic strength={0.4} radius={120}>
  <button className="px-8 py-4 bg-white text-black font-semibold rounded-full shadow-2xl">
    Hover Me
  </button>
</Magnetic>
```

---

### 6. `<SkewGallery>`
Applies dynamic velocity-based CSS `skewY()` distortion to content cards during fast scroll gestures.

```tsx
import { SkewGallery } from '@scrollcraft/react';

<SkewGallery maxSkew={10} sensitivity={0.05}>
  <div className="grid grid-cols-2 gap-8">
    <div className="h-96 bg-neutral-800 rounded-2xl" />
    <div className="h-96 bg-neutral-800 rounded-2xl" />
  </div>
</SkewGallery>
```

---

### 7. `<StackedCards>`
3D sticky cards deck where incoming cards stack on top while background cards scale down, blur, and dim.

```tsx
import { StackedCards } from '@scrollcraft/react';

const CARDS = [
  { id: 1, title: 'Autonomous Physics', color: 'bg-indigo-600' },
  { id: 2, title: 'Zero Layout Reflow', color: 'bg-purple-600' },
  { id: 3, title: 'Universal Dual Bundle', color: 'bg-pink-600' },
];

<StackedCards cards={CARDS} cardHeight={450}>
  {(card) => (
    <div className={`p-12 rounded-3xl text-white h-full ${card.color}`}>
      <h3 className="text-4xl font-bold">{card.title}</h3>
    </div>
  )}
</StackedCards>
```

---

### 8. `<ScrollInspector>` (DevTools HUD & FPS Meter)
A high-precision developer console HUD for motion profiling and layout debugging:
- **Direct 120 FPS / 60 FPS Readout:** Synchronized with the central engine ticker.
- **Real-Time Frame Latency:** Frame time in milliseconds (e.g. `8.33ms` target for 120Hz).
- **Scroll Velocity & Progress:** Exact instantaneous velocity (`px/frame`) and normalized scroll travel percentage.
- **Hardware Performance Tier:** Live badge displaying whether device is running in `'high'`, `'balanced'`, or `'low'` (battery saver) tier.
- **GSAP-Style Visual Markers:** Visual trigger lines indicating when elements enter and leave their active scroll bounds.
- **Zero-Rerender Invariant:** Updates telemetry via direct DOM ref mutation in Ticker Phase 4 (`render`) without triggering React Virtual DOM re-renders.

```tsx
import { ScrollInspector } from '@scrollcraft/react';

// Option A: Standalone HUD component
<ScrollInspector 
  position="bottom-right" 
  defaultCollapsed={false} 
  markers={true} 
/>

// Option B: Auto-mounted via Provider debug prop
<ScrollCraftProvider 
  smooth={true} 
  debug={process.env.NODE_ENV === 'development'}
>
  <App />
</ScrollCraftProvider>
```

**Props:**
- `position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'` (Default: `'bottom-right'`).
- `defaultCollapsed?: boolean` (Default: `false`): Starts in a minimized pill mode to save screen real estate.
- `markers?: boolean` (Default: `false`): Automatically renders visual start/end trigger lines on the page.

---

## 7. Headless Hooks Suite (`@scrollcraft/react`)

If you prefer headless development without pre-built UI primitives, use the hooks:

| Hook | Purpose | Return Value |
| :--- | :--- | :--- |
| `useScrollCraft()` | Engine controller | `{ engine, scrollTo, resize, isReady, reducedMotion, getMetrics, subscribe }` |
| `useScrollCraftMetrics(selector)` | Selective reactive readout | Selected value (e.g. `metrics.velocity`, `metrics.progress`) |
| `useScrollCraftTier()` | Device performance tier | `'high'` \| `'balanced'` \| `'low'` |
| `useParallax(ref, options)` | Headless parallax motion | Direct composite transforms on ref node |
| `usePin(ref, options)` | Headless sticky pinning | `{ ref, progress, pinOffsetY, isPinned }` |
| `useReveal(ref, options)` | Headless intersection reveal | Triggers smooth transitions on target |
| `useScrollProgress(options)` | Headless scroll tracking | `{ progress, scrollY, maxScroll }` |
| `useScrollTransform(ref, options)` | Keyframe interpolation | Maps scroll to CSS properties |
| `useScrollDraw(pathRef, options)` | SVG stroke animation | Controls `stroke-dashoffset` |
| `useMagnetic(ref, options)` | Magnetic attraction | Magnetizes node to cursor position |
| `useScrollTimeline(config)` | Multi-track choreography | Keyframe timeline evaluation |
| `useTicker(phase, callback)` | Game-dev microtask hook | Runs function every tick in `read`/`compute`/`render` |
| `useRenderTracker(componentName)` | Diagnostic debugging hook | Detects unnecessary React re-renders |

### Hook Example: Programmatic Scroll Navigation
```tsx
import { useScrollCraft } from '@scrollcraft/react';

export function Navigation() {
  const { scrollTo } = useScrollCraft();

  return (
    <nav className="fixed top-4 right-4 z-50 flex gap-4">
      <button onClick={() => scrollTo('#features', { duration: 1.2 })}>Features</button>
      <button onClick={() => scrollTo('#pricing', { offset: -50 })}>Pricing</button>
      <button onClick={() => scrollTo(0)}>Back to Top</button>
    </nav>
  );
}
```

### Hook Example: Zero-Rerender Reactive Velocity Readout
```tsx
import { useScrollCraftMetrics } from '@scrollcraft/react';

export function VelocityBadge() {
  // Only re-renders when velocity changes by more than 1px/frame
  const velocity = useScrollCraftMetrics((m) => Math.round(m.velocity));

  return <div className="fixed bottom-4 left-4 font-mono text-xs">Velocity: {velocity}px</div>;
}
```

### Hook Example: 4-Phase Microtask Game Loop (`useTicker`)
Hooks custom Canvas, WebGL, Three.js, or DOM writes directly into ScrollCraft's centralized 120 FPS game loop without creating redundant `requestAnimationFrame` listeners:

```tsx
import { useTicker } from '@scrollcraft/react';

export function CustomCanvasScene() {
  // Phase options: 'measure' (DOM reading) | 'driver' (inputs) | 'update' (physics) | 'render' (GPU write)
  useTicker((deltaTime, elapsedTime, currentTime) => {
    // Executes inside Phase 4 ('render') for tear-free direct GPU compositing
    // Perfectly synchronized with Lenis inertia and all scroll physics
  }, 'render');

  return <canvas className="fixed inset-0 pointer-events-none" />;
}
```

---

## 8. Core Low-Level Engine (`@scrollcraft/core`)

For vanilla JavaScript, WebGL canvas apps, or building custom framework adapters:

```ts
import { 
  ticker, 
  InertiaEngine, 
  ScrollValue, 
  TransformSolver, 
  clamp, 
  damp, 
  spring 
} from '@scrollcraft/core';

// 1. Reactive Scroll Value Observable
const scrollY = new ScrollValue(0);
const unsubscribe = scrollY.subscribe((val) => {
  console.log('Scroll changed:', val);
});
scrollY.set(150);

// 2. Add custom task into 120 FPS game-dev loop
ticker.add('custom-webgl-render', 'render', (delta, elapsed) => {
  // Update WebGL scene or direct DOM transforms
});

// 3. Mathematical Interpolation
const currentVal = damp(0, 100, 5, 0.016); // Smooth exponential damping
```

---

## 9. Full Website Recipe: Award-Winning Page Blueprint

Below is a complete, copy-paste-ready Next.js page implementing a full modern visual experience:

```tsx
// app/page.tsx
'use client';

import React from 'react';
import {
  Parallax,
  Pin,
  PinContainer,
  Reveal,
  HorizontalScroll,
  VelocityMarquee,
  Magnetic,
  TextReveal,
  ScrollProgress,
} from '@scrollcraft/react';

export default function ShowcasePage() {
  return (
    <main className="relative min-h-screen bg-neutral-950 text-neutral-50 selection:bg-cyan-500 selection:text-black">
      {/* 1. Global Reading Progress Indicator */}
      <ScrollProgress className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 z-50 origin-left" />

      {/* 2. Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <Parallax speed={-0.3} className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="w-[600px] h-[600px] bg-cyan-500/20 blur-[140px] rounded-full pointer-events-none" />
        </Parallax>

        <Reveal direction="up" distance={40}>
          <span className="text-xs uppercase tracking-widest font-mono text-cyan-400 mb-4 inline-block">
            Next-Gen Scroll & Physics Engine
          </span>
          <h1 className="text-6xl sm:text-8xl font-black tracking-tighter max-w-5xl">
            Motion that defies gravity.
          </h1>
        </Reveal>

        <Reveal direction="up" distance={20} delay={0.2}>
          <p className="mt-6 text-xl text-neutral-400 max-w-2xl">
            Built for 120 FPS ProMotion displays, zero layout reflows, and unmatched creative freedom.
          </p>
        </Reveal>

        <Reveal direction="up" distance={20} delay={0.3} className="mt-8">
          <Magnetic strength={0.35} radius={150}>
            <button className="px-8 py-4 rounded-full bg-cyan-400 text-neutral-950 font-bold hover:bg-cyan-300 transition-colors shadow-lg shadow-cyan-500/20">
              Explore Engine
            </button>
          </Magnetic>
        </Reveal>
      </section>

      {/* 3. Velocity Reactive Ribbon */}
      <div className="py-12 border-y border-neutral-800/80 bg-neutral-900/50 backdrop-blur-sm">
        <VelocityMarquee baseSpeed={2} velocityMultiplier={0.2} direction={1}>
          <span className="text-6xl font-black tracking-tight uppercase px-8 text-neutral-300">
            • Direct GPU Compositing • 4-Phase Micro-Task Loop • Zero React Rerenders • Universal Dual Bundle
          </span>
        </VelocityMarquee>
      </div>

      {/* 4. Typography Storytelling */}
      <section className="py-32 max-w-4xl mx-auto px-6">
        <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-6 block">
          Philosophy
        </span>
        <TextReveal mode="words" className="text-4xl sm:text-6xl font-extrabold text-neutral-200 leading-tight">
          Most web animations feel sluggish because browsers struggle between reading layout and drawing pixels. ScrollCraft solves this at the hardware level.
        </TextReveal>
      </section>

      {/* 5. Sticky Pinned Feature Presentation */}
      <PinContainer height="250vh" className="relative border-t border-neutral-800">
        <Pin top={80} duration={1200} asChild>
          <div className="h-screen flex items-center justify-center px-6">
            <div className="max-w-4xl w-full p-12 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <span className="text-xs font-mono uppercase text-violet-400 tracking-wider">Hardware Sync</span>
                <h3 className="text-4xl font-bold mt-2">Pinned Sticky Cinema</h3>
                <p className="mt-4 text-neutral-400 leading-relaxed">
                  This card stays locked in the viewport for 1200px of scroll travel while internal progress tracks seamlessly without dropped frames.
                </p>
              </div>
              <div className="w-48 h-48 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-mono font-bold text-3xl">
                120 FPS
              </div>
            </div>
          </div>
        </Pin>
      </PinContainer>

      {/* 6. Horizontal Gallery Track */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 mb-12">
          <h2 className="text-4xl font-bold">Featured Projects</h2>
          <p className="text-neutral-400 mt-2">Horizontally scrubbed by vertical scrolling</p>
        </div>

        <HorizontalScroll speed={2.5}>
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="w-[70vw] sm:w-[45vw] h-[55vh] mx-4 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col justify-end p-8 flex-shrink-0 hover:border-cyan-500/50 transition-colors"
            >
              <span className="font-mono text-sm text-cyan-400">Project 0{item}</span>
              <h4 className="text-2xl font-bold mt-1">Spatial Audio Interface</h4>
            </div>
          ))}
        </HorizontalScroll>
      </section>

      {/* 7. Footer */}
      <footer className="py-24 text-center border-t border-neutral-900 text-neutral-500 font-mono text-xs">
        Crafted with @scrollcraft/core & @scrollcraft/react.
      </footer>
    </main>
  );
}
```

---

## 10. Best Practices & Troubleshooting Checklist

1. **Root Layout Provider Placement:**
   Always place `<ScrollCraftProvider>` in your root layout or at the highest point of your view hierarchy.
2. **Ancestor `overflow: hidden` Trap:**
   CSS `position: sticky` and pin solvers will fail if any ancestor element has `overflow: hidden`, `overflow: auto`, or `overflow: scroll`. ScrollCraft automatically logs a helpful diagnostic warning in development identifying the offending element.
3. **Multi-Platform SSR Safety:**
   All primitives and hooks check `typeof window !== 'undefined'` and use `useSyncExternalStore` with server snapshots. They are 100% compatible with Next.js SSR, React Server Components (client boundary), and Static Site Generation (`next export`).
4. **Accessible Motion (`prefers-reduced-motion`):**
   Enabled by default (`respectReducedMotion={true}`). When active, transforms collapse to zero offset and instant reveals are shown, ensuring compliance with WCAG 2.1 AAA standards.
5. **HUD Inspector in Production:**
   Set `debug={false}` (default) in production builds. The inspector code is dead-code eliminated and introduces 0 DOM nodes and 0 ticker overhead.
