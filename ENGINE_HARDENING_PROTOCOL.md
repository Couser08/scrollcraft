# ScrollCraft Engine Hardening Protocol (8-Layer Resilience Standard)

> **Mandatory Pre-Publish & CI Verification Standard for `@scrollcraft/core`, `@scrollcraft/react`, and `@scrollcraft/r3f`**  
> **Target Release**: v0.1.1+  
> **Philosophy**: Zero-regression guarantee through multi-tiered verification gates — from static linting to physical hardware verification.

---

## Overview: The 8 Hardening Layers

| Layer | Focus Area | Execution Target | Typical Runtime | Failure Class Caught |
|---|---|---|---|---|
| **Layer 0** | Static & Bundle Gate | Pre-commit / CI PR | < 15s | Type errors, oversized bundles, dead exports |
| **Layer 1** | Math & Solver Fuzzing | CI PR (`vitest`) | < 2s | Floating-point overflow, `NaN`, `Infinity`, `dt` spikes |
| **Layer 2** | Chaos & Lifecycle Resilience | CI PR (`vitest`) | < 2s | Rapid unmounts, missing DOM nodes, duplicate IDs |
| **Layer 3** | E2E Cross-Browser Parity | CI Release / Headless | ~ 30s | ViewTimeline ancestor bugs, CSS timeline binding |
| **Layer 4** | Tab Backgrounding & Clock | CI PR (`vitest`) | < 1s | RAF drift, battery drain, runaway velocity jumps |
| **Layer 5** | Memory Soak (Zero-Leak) | CI Nightly / Pre-Release | < 3s | Task leaks, orphaned markers, monotonic heap growth |
| **Layer 6** | Real-Device Smoke Protocol | Pre-Release Manual Checklist | ~ 10m | iOS momentum jitter, Android thermal throttling |
| **Layer 7** | Screen Reader & A11y Gate | Pre-Release Manual Checklist | ~ 5m | Keyboard focus traps, missing reduced-motion fallbacks |

---

## Layer 0: Static Gate & Bundle Sanity

*Target: Immediate blocker on every PR or push.*

```bash
# 1. Typecheck across all workspace packages
pnpm lint

# 2. Production build verification across core, react, r3f, and docs app
pnpm build
```

**Pass Criteria**:
- `tsc --noEmit` exits with `0` across `@scrollcraft/core`, `@scrollcraft/react`, `@scrollcraft/r3f`, `@scrollcraft/web`.
- Turborepo build emits clean bundles without circular dependency warnings.
- Core and React bundle sizes remain strictly within budgets.

---

## Layer 1: Math & Solver Adversarial Fuzzing

*Target: `packages/core/src/__tests__/fuzzing.test.ts`*

Adversarial inputs tested against all interpolation, dampening, clamping, and harmonic spring physics:
- Vector set: `[0, -0, 1, -1, NaN, Infinity, -Infinity, 1e-15, 1e15, 0.999999999999, -0.000000000001, Number.MAX_VALUE, -Number.MAX_VALUE, Number.MIN_VALUE, Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]`
- DeltaTime set: `[0, -16, -0.016, 0.0000001, 0.016, 0.033, 0.5, 1.0, 10.0, 1000.0, 100000.0, NaN, Infinity, -Infinity]`

**Invariants**:
- `lerp(a, b, t)` never throws and always returns a finite number when arguments are finite.
- `clamp(v, min, max)` recovers gracefully even with inverted bounds (`min > max`).
- `damp(curr, target, lambda, dt)` never diverges or produces `NaN`.
- `springStep(...)` never diverges, throws, or outputs `NaN` across adversarial velocity impulses.

---

## Layer 2: Chaos & Component Lifecycle Resilience

*Target: `packages/react/src/__tests__/chaos-resilience.test.tsx`*

Validates rapid React unmounting, dynamic DOM detachment, and concurrent task re-entry:
- Rapid mount/unmount loops in succession (50ms window).
- Sudden unmounting of DOM nodes while active physics are in-flight.
- Registering multiple primitives with conflicting or duplicate IDs.
- React 19 `ref` cleanup callbacks executing without memory leakage.

---

## Layer 3: E2E Parity & Cross-Browser Verification

*Target: `e2e/parity-cross-browser.spec.ts` via Playwright*

- **Named Timeline Anchor**: Verifies that `.sc-parallax-target` binds to `--sc-doc-scroll` and functions correctly inside `overflow: hidden` ancestors.
- **Deterministic Instant Scroll**: `window.scrollTo({ top: 1000, behavior: 'instant' })` updates scroll state and compositor transforms within 1 frame.
- **Cross-Browser Verification**: Clean execution across Chromium, WebKit (Safari), and Firefox without console errors.

---

## Layer 4: Tab Backgrounding & Clock Recovery

*Target: `packages/core/src/__tests__/engine-stress.test.ts` (STRESS TEST 6)*

- **Visibility Change**: When `document.hidden = true` fires, RAF loop is immediately suspended (`cancelAnimationFrame` called, `isRunning = false`).
- **Foreground Wake**: When `document.hidden = false` fires, 60-frame history buffer is cleared, clock delta is reset (`lastTime = performance.now()`), and active tasks resume smoothly without velocity shock.

---

## Layer 5: Memory Soak & Zero-Leak Invariant

*Target: `packages/core/src/__tests__/memory-soak.test.ts`*

- **20-Cycle Soak Loop**: Runs 20 consecutive cycles of creating 50 `ParallaxSolver` and 50 `PinSolver` instances, updating scroll metrics, and destroying all instances.
- **Zero-Residual Task Invariant**: `ticker.hasActiveTasks()` is strictly `false` after each teardown cycle.
- **Zero Orphaned Markers**: `TriggerRegistry.getAll()` returns an empty array with 0 retained entries or event listeners.
- **Bounded Heap**: V8 heap growth remains strictly bounded (< 15MB delta across 20 cycles).

---

## Layer 6: Physical Hardware Smoke Checklist (Pre-Publish)

*Target: Physical devices tested before publishing any `v*` release.*

### 1. iOS Safari (Physical iPhone)
- [ ] **Momentum Fling**: Perform rapid flick up and down. Does parallax or pinning bounce smoothly at elastic boundaries without rubber-band stutter?
- [ ] **Address Bar Resize**: Scroll slowly so Safari's bottom toolbar collapses and expands. Do element offsets shift or flash?
- [ ] **App Switcher Soak**: Scroll to 50% page progress, swipe to home screen for 10 seconds, reopen Safari. Does the scroll position remain stable without erratic jumps?

### 2. Android Low-End (Chrome, Battery Saver Active)
- [ ] **Hysteresis Auto-Degrade**: Enable Battery Saver or CPU throttling. Confirm engine self-heals by downgrading `high` -> `balanced` -> `low` tier.
- [ ] **Thermal Stability**: Continuous scrolling for 2 minutes sustains clean interaction without tab crash or unresponsive script alerts.

### 3. Desktop Safari (WebKit)
- [ ] **JS Fallback Verification**: Confirm that without native `animation-timeline`, the engine cleanly activates `JSParallaxDriver` with zero runtime warnings.
- [ ] **Hardware Compositing**: Ensure no white backdrop flashes occur during fast wheel scrolling.

---

## Layer 7: Screen Reader & Accessibility Gate

*Target: WCAG 2.1 AA Compliance for Scroll-Driven Web Experiences.*

### 1. Reduced-Motion Integrity
- [ ] Enable **Reduce Motion** in macOS (`System Settings > Accessibility > Display > Reduce motion`) or Windows (`Settings > Accessibility > Visual effects > Animation effects: Off`).
- [ ] Verify:
  - All parallax translations freeze (`transform: none` or identity matrix).
  - Reveal elements appear immediately with full opacity and `transform: translate3d(0, 0, 0)`.
  - Horizontal scroll containers render in accessible linear reading order.
  - Three.js / WebGL canvas disables aggressive inertia panning.

### 2. Keyboard & Screen Reader Traversal
- [ ] **Keyboard Tab Flow**: Tab through pinned and animated sections. The focus indicator must remain visible and follow natural DOM sequence without getting trapped or jumping off-screen.
- [ ] **Aria Attributes**: Visual-only decorative scroll targets must have `aria-hidden="true"` so screen readers are not burdened with redundant animation elements.

---

## Pre-Publish Release Gate Sequence

Before tagging or releasing any new version:

```bash
# 1. Run all unit, fuzzing, and stress tests
pnpm test

# 2. Run code quality checks
pnpm lint

# 3. Verify production compilation
pnpm build

# 4. Run E2E cross-browser test suite
pnpm test:e2e
```
