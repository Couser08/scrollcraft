# @scrollcraft/core

[![Status](https://img.shields.io/badge/status-beta-7C3AED.svg)](https://www.npmjs.com/package/@scrollcraft/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-zinc.svg)](LICENSE)

Headless, high-performance game-dev scroll & physics engine for the web.

> **Beta Notice:**  
> **Beta means the public API contracts are finalizing before 1.0 — it does not mean unstable.** `@scrollcraft/core` is battle-tested for 60/120 FPS high-precision scroll animation with subpixel inertia smoothing and zero memory thrashing.

---

## Installation

```bash
npm install @scrollcraft/core
# or
pnpm add @scrollcraft/core
```

---

## Features

- **3-Phase Ticker**: Deterministic `Measure -> Update -> Render` execution loop prevents layout thrashing.
- **Inertia Normalizer**: Virtual inertia physics inspired by Lenis, normalizing trackpad and wheel inputs into ScrollCraft's multi-phase ticker.
- **Timeline Solver**: High-precision progress mapping across arbitrary viewport and element intersections.
- **Pin Solver**: Sticky-pinning calculations and pin-spacing geometry.
- **DOM Compositor**: Direct ref-based hardware-accelerated style mutations (`transform`, `opacity`) bypassing framework re-renders.

---

## Architecture Overview

```
Window Scroll Event / Touch Event
          │
          ▼
    ┌────────────┐
    │Lenis Engine│  (Inertia & Wheel Normalization)
    └─────┬──────┘
          │
          ▼
   ┌─────────────┐
   │3-Phase Ticker│ (Game-dev RAF Loop: Measure ➔ Update ➔ Render)
   └──────┬──────┘
          │
    ┌─────┴──────────────────┐
    ▼                        ▼
┌──────────────┐     ┌──────────────┐
│TimelineSolver│     │  PinSolver   │
└──────┬───────┘     └───────┬──────┘
       │                     │
       └──────────┬──────────┘
                  ▼
          ┌───────────────┐
          │ DOM Compositor│  (Direct GPU Transforms: Zero React Re-renders)
          └───────────────┘
```

---

## Architecture & Attributions

- **ScrollCraft Motion Engine**: The core multi-phase ticker, zero-rerender DOM compositor, native CSS Scroll-Timeline drivers, and kinetic solvers (`TimelineSolver`, `PinSolver`, `ParallaxSolver`) are custom in-house systems built from scratch.
- **Smooth Inertia Normalization**: Our virtual inertia physics take mathematical inspiration from the pioneering work of Studio Freight's Lenis. We utilize these normalization principles to provide buttery trackpad and wheel interpolation across browsers.

---

## License

MIT &copy; ScrollCraft Team
