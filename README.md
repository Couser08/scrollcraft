# ScrollCraft

[![@scrollcraft/core Status](https://img.shields.io/badge/@scrollcraft/core-beta-orange.svg)](https://www.npmjs.com/package/@scrollcraft/core)
[![@scrollcraft/react Status](https://img.shields.io/badge/@scrollcraft/react-beta-orange.svg)](https://www.npmjs.com/package/@scrollcraft/react)
[![@scrollcraft/r3f Status](https://img.shields.io/badge/@scrollcraft/r3f-alpha-red.svg)](https://www.npmjs.com/package/@scrollcraft/r3f)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**The scroll engine React never had.**

Composable primitives and hooks for parallax, reveals, pins, and scroll-progress — powered by Lenis, safe in RSC, and fully tree-shakeable.

> **Stability & Versioning Note:**  
> **Beta means the API surface may still shift before 1.0 — it does not mean unstable.** ScrollCraft is engineered for production web applications, featuring direct GPU compositor writes and zero React re-render overhead during active scrolling.

---

## Packages in This Monorepo

| Package | Status | Badge | Description |
|---|---|---|---|
| [`@scrollcraft/core`](./packages/core) | **Beta** | `stability-beta-orange` | Headless 3-phase ticker, inertia physics, timeline solver & pin solver. |
| [`@scrollcraft/react`](./packages/react) | **Beta** | `stability-beta-orange` | Declarative React primitives (`<Parallax>`, `<Reveal>`, `<Pin>`, `<ScrollProgress>`) & hooks. |
| [`@scrollcraft/r3f`](./packages/r3f) | **Alpha** | `stability-alpha-red` | Pull-based Three.js / React Three Fiber scroll bridge with zero RAF double-pumping. |

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
    <ScrollProgress className="fixed top-0 left-0 right-0 h-1 bg-blue-500 origin-left" />
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
