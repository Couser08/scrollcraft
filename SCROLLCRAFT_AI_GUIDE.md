# ScrollCraft AI Architecture Guide & System Manual
> **Authoritative Technical Blueprint for AI Models & Human Engineers**  
> **Repository**: `ScrollCraft` (`@scrollcraft/core`, `@scrollcraft/react`, `@scrollcraft/r3f`)  
> **Design Philosophy**: Direct GPU Compositor Writes, Zero React Re-Renders, Headless Composition, Honest Dogfooding.

---

## 1. The Golden Directives (Strict Anti-Patterns)

When generating, modifying, or refactoring code in this repository, you **MUST** adhere to the following non-negotiable rules:

### 🚫 Anti-Pattern 1: NEVER Write `window.addEventListener('scroll', ...)`
- **Why**: Raw scroll listeners run on the browser's JavaScript main thread, cause layout thrashing via uncoordinated reads/writes (`scrollY`, `getBoundingClientRect`), and lock the V8 execution context during fast gestures.
- **Rule**: ALWAYS subscribe to the central ScrollCraft ticker or engine:
  ```tsx
  // ❌ FORBIDDEN
  useEffect(() => {
    const onScroll = () => { ... };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ✅ CORRECT
  import { useScrollCraft } from '@scrollcraft/react';
  const { subscribe } = useScrollCraft();
  useEffect(() => {
    return subscribe((metrics) => {
      // Metrics are pre-calculated by InertiaEngine in Phase 2
      const scrollY = metrics.scroll;
    });
  }, [subscribe]);
  ```

### 🚫 Anti-Pattern 2: NEVER Invent Custom React `useState` Animation Loops
- **Why**: Calling `setState` inside a scroll callback forces React to re-render the virtual DOM tree 60 to 120 times every second, causing catastrophic garbage collection spikes and UI stutter.
- **Rule**: Use direct DOM mutations via element refs and CSS transforms (`transform`, `opacity`):
  ```tsx
  // ❌ FORBIDDEN
  const [offset, setOffset] = useState(0);
  // inside scroll listener: setOffset(newOffset);
  return <div style={{ transform: `translateY(${offset}px)` }} />;

  // ✅ CORRECT
  const elementRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    return subscribe((metrics) => {
      if (elementRef.current) {
        elementRef.current.style.transform = `translate3d(0, ${metrics.scroll * 0.2}px, 0)`;
      }
    });
  }, [subscribe]);
  ```

### 🚫 Anti-Pattern 3: NEVER Mock Scroll Animations with `<input type="range">` Sliders
- **Why**: ScrollCraft's thesis is *scroll-native*. Inert previews or artificial sliders contradict the library's foundation and break documentation honesty.
- **Rule**: Demos and playgrounds must be driven by the **page's actual scroll flow** or real container scroll events, verified with honest live telemetry readouts.

### 🚫 Anti-Pattern 4: NEVER Create Multiple Independent `ResizeObserver` Instances
- **Why**: Instantiating dozens of `new ResizeObserver()` objects on a single page triggers repeated recalculations and layout thrashing.
- **Rule**: ALWAYS use the singleton `GlobalResizeManager` from `@scrollcraft/core`:
  ```tsx
  import { GlobalResizeManager } from '@scrollcraft/core';

  useEffect(() => {
    const unobserve = GlobalResizeManager.observe(node, () => {
      solver.measure();
    });
    return () => unobserve();
  }, []);
  ```

### 🚫 Anti-Pattern 5: NEVER Inject Dummy Spacer Divs for Pinning
- **Why**: Other libraries inject dummy `<div style="height: 2000px">` spacer divs that break Flexbox and CSS Grid layouts.
- **Rule**: ScrollCraft relies strictly on native CSS `position: sticky` combined with layout boundary solvers (`<Pin>` & `<PinContainer>`).

---

## 2. Architecture: The 3-Phase Ticker Pipeline

Every visual transformation in `@scrollcraft/core` executes within a strictly segregated frame budget managed by `ticker.ts`:

```
┌─────────────────────────────────────────────────────────────┐
│                       TICKER TICK                           │
├──────────────────────────────┬──────────────────────────────┤
│ Phase 1: MEASURE             │ Read DOM bounding boxes,     │
│                              │ scroll limits & offsets.     │
│                              │ (NO WRITES ALLOWED)          │
├──────────────────────────────┼──────────────────────────────┤
│ Phase 2: UPDATE (COMPUTE)    │ Calculate physics, kinetic   │
│                              │ velocity, lerp & easing.     │
│                              │ (PURE MATHEMATICS)           │
├──────────────────────────────┼──────────────────────────────┤
│ Phase 3: RENDER              │ Commit GPU transforms        │
│                              │ (translate3d, scale, opacity)│
│                              │ (NO READS ALLOWED)           │
└──────────────────────────────┴──────────────────────────────┘
```

This strict separation guarantees **zero layout recalculation thrashing** across all concurrent animations.

---

## 3. ScrollCraft Component & Hook Catalog

### 📦 Root Provider: `<ScrollProvider />`
Wraps the application to provide smooth inertia scrolling (via Lenis), responsive recalculations, and accessibility motion management.
```tsx
import { ScrollProvider } from '@scrollcraft/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ScrollProvider
      smooth={true}
      autoResetOnRouteChange={false}
      respectReducedMotion={true}
    >
      {children}
    </ScrollProvider>
  );
}
```
- `smooth`: Boolean or `Partial<InertiaConfig>` (lerp, duration, easing).
- `respectReducedMotion`: Automatically degrades to instant native scroll if OS prefers reduced motion.

---

### 🏔️ `<Parallax />` Primitive
Moves elements at a relative velocity lag or lead compared to document scroll.
```tsx
import { Parallax } from '@scrollcraft/react';

<Parallax speed={-0.2} direction="vertical" asChild>
  <div className="card">Floating Ahead</div>
</Parallax>
```
- `speed`: Number (e.g. `-0.2` moves faster than scroll, `0.2` lags behind).
- `direction`: `'vertical' | 'horizontal'`.
- `asChild`: Delegates transforms directly to immediate child via Radix-style Slot.

---

### ✨ `<Reveal />` Primitive
Triggers hardware-accelerated entrance transitions when elements enter the viewport using a single shared `IntersectionObserver`.
```tsx
import { Reveal } from '@scrollcraft/react';

<Reveal direction="up" distance={32} duration={0.6} delay={0.15} threshold={0.2}>
  <div className="card">Slide In Card</div>
</Reveal>
```
- `direction`: `'up' | 'down' | 'left' | 'right'`.
- `distance`: Pixel offset for entrance translation.
- `duration`: Transition length in seconds.
- `delay`: Stagger delay in seconds.
- `threshold`: Viewport intersection ratio (0.0 to 1.0).

---

### 📌 `<Pin />` and `<PinContainer />`
Native sticky narrative primitive. Locks elements in place for an explicit scroll budget.
```tsx
import { Pin, PinContainer } from '@scrollcraft/react';

<PinContainer height="200vh" className="relative w-full">
  <Pin top={80} onProgress={(progress) => updateHud(progress)}>
    <div className="h-screen flex items-center justify-center">
      <h2>Locked Narrative Card</h2>
    </div>
  </Pin>
</PinContainer>
```
- `height`: Total scroll track budget (e.g., `'150vh'`, `'200vh'`).
- `top`: Sticky offset from top of viewport in pixels.
- `onProgress`: Zero-rerender progress callback (`0.0` to `1.0`).

---

### 📊 `<ScrollProgress />` Primitive
Zero-overhead progress indicator mapping normalized completion (`0.0`–`1.0`) to GPU `scaleX` transforms.
```tsx
import { ScrollProgress } from '@scrollcraft/react';

<ScrollProgress className="h-1 bg-blue-500 origin-left" />
```

---

### ⚡ `<VelocityMarquee />` Kinetic Primitive
Continuous marquee that automatically flings faster during high-velocity user scroll, smoothly decaying back to cruise speed.
```tsx
import { VelocityMarquee } from '@scrollcraft/react';

<VelocityMarquee
  baseSpeed={1.5}
  velocityMultiplier={0.1}
  direction="left"
>
  <div className="flex gap-8 font-mono font-bold">
    <span>SCROLLCRAFT</span>
    <span>120 FPS SUBPIXEL</span>
  </div>
</VelocityMarquee>
```

---

### ↔️ `<HorizontalScroll />` Layout Primitive
Maps vertical scroll travel to horizontal track displacement using sticky pinning.
```tsx
import { HorizontalScroll } from '@scrollcraft/react';

<HorizontalScroll speed={2.0} className="w-full">
  <div className="flex gap-6 items-center">
    <Card id="01" />
    <Card id="02" />
    <Card id="03" />
  </div>
</HorizontalScroll>
```
- `speed`: Multiplier for vertical scroll height (e.g. `2.0` = `200vh`).
- `stickyClassName`: Optional custom sticky positioning classes.

---

### 🎬 `<ScrollSequence />` Media Primitive
Apple-style canvas image scrubber. Preloads image frame sequences and paints with DPR scaling.
```tsx
import { ScrollSequence } from '@scrollcraft/react';

<ScrollSequence
  frames={frameUrls}
  height="300vh"
  speed={1.5}
  className="w-full bg-black"
/>
```

---

## 4. Step-by-Step Blueprint: Creating a New Primitive

When asked to create a new ScrollCraft primitive (e.g. `<ScaleScroll>`, `<PathDraw>`), follow this exact 4-tier layer pattern:

### Tier 1: Core Solver (`packages/core/src/your-solver.ts`)
1. Implement a class implementing `ScrollDriver` or self-contained solver.
2. Implement `measure()`, `update(scrollY: number)`, `render()`, and `destroy()`.
3. Check `Capabilities.get()` to switch between Native CSS timeline and JS fallback.

### Tier 2: Headless React Hook (`packages/react/src/hooks/useYourHook.ts`)
1. Accepts target `RefObject<T>` and configuration options.
2. Registers tasks to `ticker.add(taskId, 'update', ...)` and `ticker.add(taskId, 'render', ...)`.
3. Cleans up with `ticker.remove(taskId)` and `destroy()`.
4. Uses `GlobalResizeManager.observe(node, measure)` for responsive recalculations.

### Tier 3: Declarative React Component (`packages/react/src/primitives/your-component.tsx`)
1. Use `forwardRef` and `React.memo`.
2. Support `asChild?: boolean` using `Slot` from `../slot`.
3. Support `className`, `style`, and forwarded DOM props.

### Tier 4: Public API Exports
1. Export hook in `packages/react/src/hooks/index.ts`.
2. Export component in `packages/react/src/primitives/index.ts` and `packages/react/src/index.ts`.
3. Add TypeScript props interface to `packages/react/src/types.ts`.

---

## 5. Step-by-Step Blueprint: Building Pages & Sections

1. **Root Layout**: Wrap root in `<ScrollProvider>` with `next/font/google` for zero-render-blocking font delivery.
2. **Image Optimization**:
   - NEVER use CSS `bg-[url('/path.jpg')]`.
   - ALWAYS use Next.js `<Image src="..." fill sizes="..." priority={...} className="object-cover" />`.
   - Wrap inside a `relative overflow-hidden` container.
3. **Composing Primitives**:
   - Nest `<Parallax>` inside `<Pin>` for layered foreground/background storytelling.
   - Combine with `<Reveal>` for entrance choreography on initial viewport arrival.
4. **Responsive Guarding**:
   - Ensure containers have explicit heights (`h-screen`, `h-[120vh]`, `min-h-[80vh]`).
   - Check `process.platform === 'win32'` safe paths in scripts.

---

## 6. AI Pre-Response Checklist

Before providing any code to the user, run through this 5-point verification checklist:

1. [ ] **No `window.addEventListener('scroll')`**: Am I using `useScrollCraft()` or core solvers instead of raw listeners?
2. [ ] **No state re-render loops**: Are my scroll progress, velocity, or offset numbers mutating DOM refs/styles directly rather than calling `setState()` during scroll?
3. [ ] **Dogfooding compliance**: Am I importing from `@scrollcraft/react` or `@scrollcraft/core` rather than generating custom fake slider simulations?
4. [ ] **Modern Image Architecture**: Am I using Next.js `<Image fill sizes="..." />` instead of CSS `background-image`?
5. [ ] **Observer Efficiency**: Am I utilizing `GlobalResizeManager` and shared observers rather than spawning ad-hoc `ResizeObserver` instances?
