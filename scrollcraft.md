# ScrollCraft Architecture & Engineering Specification

ScrollCraft is a high-performance **React and Next.js (App Router)-native scroll toolkit**. It provides buttery smooth 120 FPS performance via a 3-phase zero-allocation Ticker, direct GPU compositor writes without React re-renders, and Lenis-powered cross-browser input normalization, paired with Radix-grade `asChild` composition.

---

## 1. Complete Tech Stack & Architecture

| Layer | Technology | Purpose |
|---|---|---|
| **Monorepo Engine** | **Turborepo + pnpm Workspaces** | Parallel builds, typechecking, and dependency caching across packages |
| **Framework** | **Next.js 15 (App Router) + React 19** | Modern SSR with isolated `'use client'` interactive boundaries |
| **Styling & Tokens** | **Tailwind CSS v4 (CSS-first `@theme`)** | Zero-config CSS build with unified design tokens |
| **Language** | **TypeScript 5.5+ (Strict Mode)** | Strict null checks, complete type definitions |
| **Scroll Normalization**| **Lenis (`v1.3.26`)** | Peer normalization for wheel, trackpad, touch momentum, and native sticky/a11y |
| **Core Motion Engine** | **ScrollCraft Core (`@scrollcraft/core`)** | 3-phase Ticker (Measure -> Update -> Render), subpixel lerp, `ScrollValue` observable |
| **React Toolkit** | **ScrollCraft React (`@scrollcraft/react`)**| Zero-rerender dual store, bespoke `Slot` (`asChild`), `<Parallax>`, `<Reveal>`, `<Pin>`, `<ScrollProgress>` |
| **UI Component Layer**| **100% Bespoke In-House UI** | Zero external UI kits. Bespoke magnetic buttons, traffic lights, HUDs |
| **Commercial Layer**  | **ScrollCraft Pro & CLI (`@scrollcraft/cli`)**| Monetization via Pro Awwwards components via `npx @scrollcraft/cli add` |

---

## 2. Core Architectural Pillars

### 1. Dual-Layer State Management
- **Direct-to-DOM writes (0 re-renders)**: `<Parallax>`, `<Reveal>`, and `useParallax` write directly to `node.style.transform = translate3d(...)` during the Ticker's `render` phase.
- **Selective Reactive Store**: Exposes `useScrollState(selector)` backed by React 18/19's `useSyncExternalStore`. Components like telemetry HUDs or percentage indicators only re-render when specifically subscribed.

### 2. Next.js App Router Native Integration
- **Non-interfering route restoration**: `autoResetOnRouteChange: false` by default, strictly respecting Next.js native back/forward history restoration and `<Link scroll={false}>`.
- **Non-destructive resize**: Route transitions trigger a debounced `engine.resize()` to recalibrate scroll limits to newly mounted DOM without hijacking scroll coordinates.
- **Dynamic layout recalculation**: Automated `ResizeObserver` on `document.body` and `document.fonts.ready` listeners.

### 3. Native Sticky Pinning Contract & Dev Diagnostics
- **Native `position: sticky` foundation**: Zero DOM-spacer injections that break grid or flex layouts.
- **Dev Diagnostics**: In `process.env.NODE_ENV !== 'production'`, `usePin` scans ancestors and alerts developers if an ancestor has `overflow: hidden/auto/scroll`.
- **`<PinContainer height="200vh">`**: Companion helper establishing explicit scroll travel track.

### 4. Zero-Dependency `Slot` (`asChild`) Composition
- Custom ~60 LOC `Slot` primitive supporting `asChild` composition.
- Implements `composeRefs` (callback & object ref merging) and non-destructive style & className merging.

### 5. Dual-Layer Reduced Motion
- **Base scroll**: Lenis disables smoothing and tracks 1:1 with native scroll.
- **Element transforms**: `<Parallax>` zeroes out displacement (`translate3d(0, 0, 0)`), while `<Reveal>` immediately sets `opacity: 1` and `transform: none`.

---

## 3. Strict Engineering Rules

1. **Strict File Size Cap (< 650 LOC)**:
   - Absolutely no file may exceed 650 lines of code.
2. **Maximum Reusability & Decoupled Data**:
   - Content and configuration live in `src/data/*.data.ts`.
3. **Zero External UI Kit Rule**:
   - All UI components are crafted bespoke in-house.
4. **Tree-Shaking & Exports**:
   - `"sideEffects": false` and explicit `exports` maps across all packages.
5. **Next.js SSR & RSC Safety**:
   - Strict `'use client'` directive on line 1 of every client-facing file. Guarded against SSR window evaluation.
