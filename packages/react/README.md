# @scrollcraft/react

[![Status](https://img.shields.io/badge/status-beta-orange.svg)](https://www.npmjs.com/package/@scrollcraft/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

React and Next.js-native scroll toolkit with composable primitives and reactive hooks.

> **Stability & Versioning Note:**  
> **Beta means the API surface may still shift before 1.0 — it does not mean unstable.** `@scrollcraft/react` is engineered for production React 18/19 and Next.js 14/15 applications, safely separating React's rendering lifecycle from high-frequency scroll RAF updates.

---

## Installation

```bash
npm install @scrollcraft/react
# or
pnpm add @scrollcraft/react
# or
yarn add @scrollcraft/react
```

---

## Primitives

### `<Parallax>`
Displaces elements along the scroll axis with customizable speed multipliers and boundary clamping:

```tsx
import { Parallax } from '@scrollcraft/react';

<Parallax speed={-0.2}>
  <img src="/background.webp" alt="Parallax Background" />
</Parallax>
```

### `<Reveal>`
Triggers hardware-accelerated entry animations when intersecting the viewport:

```tsx
import { Reveal } from '@scrollcraft/react';

<Reveal direction="up" distance={40} delay={0.15}>
  <h2>Slide and fade on scroll</h2>
</Reveal>
```

### `<Pin>`
Locks an element in the viewport while adjacent steps or content scroll through:

```tsx
import { Pin } from '@scrollcraft/react';

<Pin start="top top" end="+=100%">
  <div>Sticky presentation section</div>
</Pin>
```

### `<ScrollProgress>`
Renders progress bars, rings, or fills driven by scroll progress:

```tsx
import { ScrollProgress } from '@scrollcraft/react';

<ScrollProgress className="fixed top-0 left-0 right-0 h-1 bg-blue-500 origin-left" />
```

---

## Headless Hooks

For direct ref control with zero component re-renders:

- `useScrollProgress()`: Returns normalized progress (`0–1`), direction (`'up' | 'down'`), and instantaneous scroll velocity.
- `useParallax({ speed })`: Returns element ref and calculated transform offsets.
- `useReveal({ threshold, delay })`: Returns element ref and `inView` status.
- `usePin({ start, end })`: Returns container ref, `isPinned` boolean, and relative pin progression.

---

## License

MIT &copy; ScrollCraft Team
