# ScrollCraft

[![@scrollcraft/core](https://img.shields.io/badge/@scrollcraft/core-beta-7C3AED.svg)](https://www.npmjs.com/package/@scrollcraft/core)
[![@scrollcraft/react](https://img.shields.io/badge/@scrollcraft/react-beta-7C3AED.svg)](https://www.npmjs.com/package/@scrollcraft/react)
[![@scrollcraft/r3f](https://img.shields.io/badge/@scrollcraft/r3f-alpha-amber.svg)](https://www.npmjs.com/package/@scrollcraft/r3f)
[![Bundle Size](https://img.shields.io/badge/bundle%20size-%3C%205%20KB%20brotli-7C3AED.svg)](#packages-in-this-monorepo)
[![License: MIT](https://img.shields.io/badge/License-MIT-zinc.svg)](LICENSE)

**The scroll engine React never had.**

Composable primitives and hooks for parallax, reveals, pins, and scroll-progress — powered by Lenis, safe in RSC, and fully tree-shakeable.

> **Beta Notice:**  
> ScrollCraft is actively entering its public Beta. "Beta" signifies that public API contracts are finalizing toward 1.0 — the engine underneath is rock-solid and battle-tested for production web applications. All kinetic primitives bypass React's reconciliation cycle, writing subpixel transform matrices directly to the GPU compositor for guaranteed 120 FPS performance with zero re-render overhead.

---

## Packages in This Monorepo

| Package | Status | Size (Brotli) | Description |
|---|---|---|---|
| [`@scrollcraft/core`](./packages/core) | **Beta** | `~1.4 - 2.2 KB (per solver)` | Headless 3-phase ticker, inertia physics, timeline solver & pin solver. |
| [`@scrollcraft/react`](./packages/react) | **Beta** | `~2.8 - 5.0 KB (per primitive)` | Declarative React primitives (`<Parallax>`, `<Reveal>`, `<Pin>`, `<ScrollProgress>`) & hooks. |
| [`@scrollcraft/r3f`](./packages/r3f) | **Alpha (Experimental)** | `~1.7 KB` | Experimental pull-based Three.js / React Three Fiber scroll bridge with zero RAF conflicts. |

---

## Quick Start

Install the React package:

```bash
npm install @scrollcraft/react
# or
pnpm add @scrollcraft/react
# or
yarn add @scrollcraft/react
```

Wrap your root layout in Next.js App Router:

```tsx
// app/layout.tsx
import { ScrollProvider } from '@scrollcraft/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ScrollProvider smooth={true}>
          {children}
        </ScrollProvider>
      </body>
    </html>
  );
}
```

### 1. Parallax
Layer elements with fluid physical depth offsets:

```tsx
import { Parallax } from '@scrollcraft/react';

export function HeroScene() {
  return (
    <div className="relative min-h-screen">
      <Parallax speed={-0.2}>
        <div className="background-layer" />
      </Parallax>
      <Parallax speed={0.15}>
        <div className="foreground-card" />
      </Parallax>
    </div>
  );
}
```

### 2. Reveal
Fade and slide elements in as they intersect the viewport:

```tsx
import { Reveal } from '@scrollcraft/react';

export function FeatureList() {
  return (
    <Reveal direction="up" distance={30} delay={0.1}>
      <div className="card">Production Grade Physics</div>
    </Reveal>
  );
}
```

### 3. Pin
Sticky-lock sections while subordinate steps or content scrub through:

```tsx
import { Pin } from '@scrollcraft/react';

export function StorySection() {
  return (
    <Pin start="top top" end="+=150%">
      <div className="pinned-display">Locked in viewport</div>
    </Pin>
  );
}
```

### 4. ScrollProgress
Track progress across a section or entire document:

```tsx
import { ScrollProgress } from '@scrollcraft/react';

export function ReadingBar() {
  return (
    <ScrollProgress className="fixed top-0 left-0 right-0 h-1 bg-violet-600 origin-left" />
  );
}
```

---

## Reactive Hooks

Prefer headless access to scroll data? Use reactive hooks that write directly to element refs without triggering React component re-renders:

```tsx
import { useScrollProgress, useParallax, useReveal, usePin } from '@scrollcraft/react';

function CustomComponent() {
  // Read real-time scroll velocity and progress
  const { progress, velocity, direction } = useScrollProgress();
  
  // Headless parallax displacement
  const { ref: parallaxRef } = useParallax<HTMLDivElement>({ speed: 0.3 });
  
  return <div ref={parallaxRef}>Progress: {progress.toFixed(2)}</div>;
}
```

---

## 3D WebGL (React Three Fiber) — Alpha

For React Three Fiber projects, `@scrollcraft/r3f` provides a pull-based bridge that synchronizes Three.js camera/object transforms directly inside `useFrame`:

```tsx
import { Canvas, useFrame } from '@react-three/fiber';
import { useScroll3D } from '@scrollcraft/r3f';

function Scene({ target }: { target: HTMLElement | null }) {
  const { tick } = useScroll3D(target);
  
  useFrame((state) => {
    const { progress } = tick();
    // Rotate 3D mesh based on scroll progress
    meshRef.current.rotation.y = progress * Math.PI * 2;
  });

  return <mesh ref={meshRef}><boxGeometry /></mesh>;
}
```

---

## Core Engineering Principles

1. **Zero React Re-Renders**: Updates bypass the React reconciliation tree, writing directly to DOM node styles via refs.
2. **3-Phase Game Ticker**: Measure, Update, Render separation eliminates layout thrashing.
3. **Lenis Integration**: Industry-standard smooth scroll momentum normalized across Chromium, Safari, and Firefox.
4. **RSC Safe**: 100% compatible with React 19 and Next.js 15 Server Components.
5. **Free & Open Source**: MIT License with no commercial tier locks.

---

## License

MIT &copy; ScrollCraft Team
