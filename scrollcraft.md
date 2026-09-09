# ScrollCraft Architecture & Engineering Specification

ScrollCraft is a high-performance, game-dev optimized scroll animation and micro-interaction library built specifically for **React and Next.js (App Router)**. It provides buttery smooth 120 FPS performance via a zero-allocation ticker and direct GPU compositor writes, paired with Framer Motion-style declarative DX.

---

## 1. Complete Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Monorepo Engine** | **Turborepo + pnpm Workspaces** | Blazing fast parallel builds, linting, and dependency caching across packages |
| **Framework** | **Next.js 15 (App Router) + React 19** | Modern Server-Side Rendering (SSR) with isolated `'use client'` interactive boundaries |
| **Styling & Tokens** | **Tailwind CSS v4 (CSS-first `@theme`)** | Zero-config CSS build with unified design tokens (colors, radiuses, elevations, fonts) |
| **Language** | **TypeScript 5.5+ (Strict Mode)** | End-to-end type safety, strict null checks, and self-documenting APIs |
| **Icons** | **Lucide React & Custom SVG Micro-Craft** | Minimalist, sharp iconography matching high-end UI design |
| **Animation Engine** | **ScrollCraft Core (`packages/core`)** | 100% In-House: Zero-allocation rAF ticker, subpixel inertia physics, compositor pipeline |
| **Micro-Interactions**| **ScrollCraft React (`packages/react`)** | 100% In-House: `useSpring`, `useMagnetic`, `scroll.button` physics |
| **UI Component Layer**| **100% Bespoke In-House UI** | Zero Shadcn or external UI kits. Every button, badge, modal, and mockup is hand-crafted |
| **Commercial Layer**  | **ScrollCraft Pro & CLI (`packages/cli`)**| Monetization via Pro Awwwards components ($129-$299) via `npx scrollcraft add` |

---

## 2. Universal Design Token System (Tailwind CSS v4)

Defined in `apps/web/src/styles/theme.css` and mirrored in `apps/web/src/tokens/design-tokens.ts`:
- **Surfaces**: `--color-canvas-bg`, `--color-canvas-subtle`, `--color-canvas-editor`, `--color-canvas-card`
- **Brand Accents**: `--color-brand-blue` (`#2563eb`), `--color-brand-cyan`, `--color-brand-emerald`, `--color-brand-purple`, `--color-brand-amber`
- **Typography**: `--color-text-primary`, `--color-text-secondary`, `--color-text-muted`, `--color-text-dim`
- **Specular Borders**: `--color-border-subtle`, `--color-border-card`, `--color-border-bright`
- **Radii**: `--radius-xs` (4px) to `--radius-full` (9999px)
- **Elevations & Glows**: `--shadow-glow-blue`, `--shadow-glow-emerald`, `--shadow-window`

---

## 3. Strict Engineering Rules

1. **Strict File Size Cap (< 650 LOC)**:
   - Absolutely no file may exceed 650 lines of code (current maximum file size in repo is ~245 LOC).
2. **Maximum Reusability & Decoupled Data**:
   - Content and configuration live in `src/data/*.data.ts`.
   - UI primitives in `src/components/ui/` accept composable slots and props.
3. **Zero External UI Kit Rule**:
   - No Shadcn, Radix, Chakra, or MUI. All UI elements are crafted bespoke in-house.
4. **Zero External Animation Library Rule**:
   - No Framer Motion, GSAP, or Lenis. All motion is driven by ScrollCraft core & React hooks.
5. **Next.js SSR & App Router Safety**:
   - Interactivity cleanly isolated with `'use client'`. Guarded against SSR window evaluation.

---

## 4. Entire Repository Folder Structure

```
scrollcraft/
├── package.json                         # Monorepo root definition & scripts
├── pnpm-workspace.yaml                  # pnpm workspaces config
├── turbo.json                           # Turborepo task pipeline configuration
├── tsconfig.base.json                   # Shared strict TypeScript configuration
├── scrollcraft.md                       # Architectural specification & standards
│
├── packages/
│   ├── core/                            # Headless Game-Dev Physics & Ticker Engine
│   │   ├── src/
│   │   │   ├── index.ts                 # Public API exports
│   │   │   ├── types.ts                 # Engine interfaces (Ticker, Bounds, Physics)
│   │   │   ├── math.ts                  # Subpixel lerp, damp, mapRange, springStep
│   │   │   ├── ticker.ts                # Zero-allocation rAF loop with delta-time
│   │   │   ├── inertia.ts               # Virtual scroll inertia & momentum solver
│   │   │   ├── dom.ts                   # Direct GPU transform compositor (translate3d)
│   │   │   ├── pinning.ts               # Zero-spacer pinning solver
│   │   │   └── timeline.ts              # Multi-track property keyframe timeline solver
│   │
│   ├── react/                           # React 19 & Next.js 15 Declarative Bindings
│   │   ├── src/
│   │   │   ├── index.ts                 # React public API exports
│   │   │   ├── types.ts                 # Props, contexts, and timeline types
│   │   │   ├── context.tsx              # <ScrollProvider> & useScrollCraft context
│   │   │   ├── factory.tsx              # <scroll.div>, <scroll.button>, <scroll.section>
│   │   │   └── hooks/
│   │   │       ├── useScrollProgress.ts # Zero-rerender scroll progress hook
│   │   │       ├── useScrollTransform.ts# Value interpolation mapping
│   │   │       ├── useSpring.ts         # In-house harmonic spring physics hook
│   │   │       ├── useMagnetic.ts       # Magnetic attraction micro-interaction hook
│   │   │       ├── usePin.ts            # Declarative scroll pinning hook
│   │   │       └── useScrollTimeline.ts # Multi-track timeline choreography hook
│   │
│   └── cli/                             # Pro Distribution CLI Package
│       ├── src/
│       │   ├── index.ts                 # Executable CLI (scrollcraft add, list)
│       │   └── registry.ts              # Component registry definitions
│
└── apps/
    └── web/                             # Next.js 15 Showcase & Pro Portal
        ├── src/
        │   ├── styles/
        │   │   ├── globals.css          # Tailwind CSS v4 import & resets
        │   │   └── theme.css            # Tailwind v4 @theme universal design tokens
        │   ├── tokens/
        │   │   └── design-tokens.ts     # TypeScript mirrored constants
        │   ├── data/
        │   │   ├── hero.data.ts         # Headline copy, badges, stats, avatars data
        │   │   ├── features.data.ts     # Bottom 5 features strip data & icons
        │   │   ├── mockup.data.ts       # Interactive preview document mock data
        │   │   ├── catalog.data.ts      # Pro components catalog data & categories
        │   │   └── pricing.data.ts      # Commercial licensing tiers and perks
        │   ├── components/
        │   │   ├── ui/                  # 100% Bespoke In-House UI Primitives
        │   │   │   ├── button.tsx       # Custom magnetic button with specular border
        │   │   │   ├── badge.tsx        # Glassmorphic pill badge with glow icon
        │   │   │   ├── avatar-group.tsx # Overlapping social proof avatar stack
        │   │   │   ├── traffic-lights.tsx # Mac-style window controls
        │   │   │   ├── pointer-card.tsx # Floating annotation card with curved arrow
        │   │   │   ├── divider.tsx      # Specular gradient horizontal rule
        │   │   │   ├── fps-hud.tsx      # Live 120 FPS performance telemetry HUD
        │   │   │   ├── navbar.tsx       # Floating frosted glass navbar
        │   │   │   └── footer.tsx       # Dark minimalist brand footer
        │   │   ├── home/                # Home Section View Modules
        │   │   │   ├── hero-section.tsx # Main Home section container & layout
        │   │   │   ├── hero-content.tsx # Left column: badge, headline, CTA, avatars
        │   │   │   ├── hero-mockup.tsx  # Right column: interactive macOS editor window
        │   │   │   ├── features-strip.tsx # Bottom: 5-column feature highlight row
        │   │   │   └── pinned-showcase.tsx# Sprint 2 Zero-spacer pinned showcase
        │   │   └── pro/                 # Sprint 3 & 4 Pro Components
        │   │       ├── pro-tilt-card.tsx# 3D interactive spring tilt card
        │   │       ├── pro-horizontal-rail.tsx # Pinned horizontal rail
        │   │       ├── pro-text-reveal.tsx # Kinetic word-by-word reveal
        │   │       ├── pro-magnetic-dock.tsx # macOS magnetic fluid dock
        │   │       ├── pro-card-stack.tsx # Layered sticky card stack
        │   │       ├── pro-showcase.tsx # Live demo container of 5 Pro components
        │   │       ├── pro-catalog.tsx  # Searchable/filterable Pro component catalog
        │   │       ├── code-export-modal.tsx # Code inspection & CLI copy modal
        │   │       └── pro-pricing.tsx  # Commercial pricing & licensing section
        │   └── app/
        │       ├── layout.tsx           # Root layout with Navbar, Footer & ScrollProvider
        │       └── page.tsx             # Main page composing Sprints 1, 2, 3, and 4
```
