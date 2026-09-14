# Scrollcraft Engine Audit Report

**Audit date:** 2026-09-13  
**Scope:** `packages/core` engine, `packages/react` hooks/primitives/components, `packages/r3f` bridge, public package configuration, unit/stress/benchmark coverage, and available repository validation commands  
**Review mode:** Source review plus executable validation. No engine behavior was changed during this audit.

## Executive Verdict

**Verdict: Not yet industry-ready for a broad production release.**

The engine has a coherent four-phase runtime, good separation between measurement, computation, and rendering, a useful native/JavaScript fallback architecture, and a meaningful test suite. The current automated baseline is healthy: the full unit suite passed, focused lifecycle tests passed, the core, React, and R3F package checks passed, the workspace lint passed, and the benchmark suite completed.

That green baseline does not establish production readiness. The detailed pass identified seven concrete correctness/API findings:

1. The documented `HorizontalScrollOptions.speed` option has no effect in either horizontal driver.
2. Exceptions from `InertiaEngine` subscribers can abort Lenis scroll-event processing for the current frame and are not isolated per subscriber.
3. `TransformSolver.destroy()` clears inline styles that may belong to the caller or another integration, causing state loss.
4. The React `<Parallax>` primitive drops the documented `driver` option.
5. The React `<Pin>` primitive drops the documented `trackState` and `disableTransform` options, and does not implement its documented `bottom` option.
6. `useScrollTransform` and `useScrollDraw` intentionally omit their options from effect dependencies, so changed options are not applied after mount.
7. The reveal manager bypasses normal cleanup ownership for already-past `once` elements and can leave engine-authored styles behind.

The release process also lacks enough browser-matrix, coverage, package-consumer, accessibility, and real-device performance evidence to support an industry-standard claim.

## Severity Rubric

- **Critical:** Data loss, security issue, or total runtime failure affecting normal use.
- **High:** Common user-visible correctness failure, lifecycle leak, or broken documented API.
- **Medium:** Important correctness or integration risk with a scoped workaround.
- **Low:** Limited edge case, diagnostics problem, or maintainability concern.
- **Release gap:** Not necessarily a runtime bug, but insufficient evidence or packaging discipline for production release.

## Validation Baseline

The following commands were run against the current workspace:

| Check | Result |
|---|---|
| Focused core tests: solver robustness, ticker engine, runtime safety, transform composer | **26 passed** |
| `pnpm test` | **14 files, 66 tests passed** |
| `pnpm test:bench` | **1 file, 7 benchmarks passed** |
| `pnpm --filter @scrollcraft/core lint` | **Passed** |
| `pnpm --filter @scrollcraft/core build` | **Passed** |
| `pnpm --filter @scrollcraft/react lint` and `build` | **Passed** |
| `pnpm --filter @scrollcraft/r3f lint` and `build` | **Passed** |
| `pnpm lint` | **5 workspace packages passed** |
| Workspace diagnostics for `packages/core` | **No errors reported** |
| Git baseline inspection | **Unavailable: `git` is not installed or not on PATH in the audit terminal** |
| Playwright browser suite | **Blocked before launch: Chromium headless executable is not installed** |

The tests use browser-like mocks extensively. They provide useful deterministic coverage but do not replace real Chromium/mobile browser validation, resize behavior, native scroll timelines, accessibility checks, or device performance measurements. The browser suite was attempted for both configured projects and failed before test execution because `C:\Users\Rahul\AppData\Local\ms-playwright\chromium_headless_shell-1243\chrome-headless-shell-win64\chrome-headless-shell.exe` is missing. The repository output recommends `pnpm exec playwright install`.

## Confirmed Findings

### H-01: Horizontal `speed` option is ignored

**Severity:** High  
**Area:** Documented public API and horizontal scrolling behavior  
**Location:** [horizontal.ts](packages/core/src/horizontal.ts#L10-L31), [horizontal.ts](packages/core/src/horizontal.ts#L34-L75), [horizontal.ts](packages/core/src/horizontal.ts#L93-L133)

`HorizontalScrollOptions.speed` is documented as controlling how much taller the track is than the viewport and defaults to `2` in `HorizontalScrollSolver`. However, neither `JSHorizontalDriver` nor `NativeHorizontalDriver` reads `_options.speed`. Both drivers calculate their scroll distance only from the measured outer element height:

- `rect.height - window.innerHeight`
- `scrollY - elementTop` divided by that distance
- horizontal offset based only on `trackWidth`

Changing `speed` therefore cannot change the animation duration or mapping. This violates the public option contract and makes configurations with different speed values behave identically.

**Impact:** Consumers may configure a slower or faster horizontal section and receive no behavioral change. The bug affects both explicitly selected JS/native modes and automatic mode when native support is available.

**Recommended remediation:** Define the intended contract precisely, then apply `speed` consistently to the effective scroll distance in both drivers. Add a regression test that constructs two identical sections with different speeds and asserts different progress/offset values at the same scroll position. Add a native-mode test that verifies the generated timeline/range uses the same effective distance.

### M-02: Inertia subscriber failures are not isolated

**Severity:** Medium  
**Area:** Observable runtime integration  
**Location:** [inertia.ts](packages/core/src/inertia.ts#L157-L205)

`InertiaEngine.onLenisScroll()` updates metrics and then calls `notify()`. `notify()` invokes each subscriber directly without a `try/catch`. If one subscriber throws, later subscribers are skipped and the exception propagates into the Lenis driver callback. The ticker catches errors at the task boundary, so the global loop survives, but the current scroll event is only partially delivered.

This differs from the ticker's explicit per-task error isolation and can create subscriber-order-dependent state updates.

**Impact:** One faulty consumer can prevent other consumers from receiving the latest metrics. The failure is especially difficult to diagnose because the ticker may continue running while some subscribers silently miss frames.

**Recommended remediation:** Isolate subscriber callbacks individually, preferably with an optional error handler consistent with ticker diagnostics. Define whether subscriptions are snapshot-based during notification so subscribe/unsubscribe mutations cannot produce surprising delivery behavior. Add tests for one throwing subscriber followed by a surviving subscriber.

### M-03: `TransformSolver.destroy()` erases caller-owned inline styles

**Severity:** Medium  
**Area:** DOM ownership and cleanup contract  
**Location:** [transform-solver.ts](packages/core/src/transform-solver.ts#L261-L273)

`TransformSolver.destroy()` unconditionally assigns empty strings to `opacity`, `filter`, `borderRadius`, and `willChange`. The solver does preserve the original transform through `TransformComposer`, but it does not snapshot or restore the other inline properties it writes.

If an element already had an inline opacity, filter, border radius, or `will-change`, destroying the solver permanently removes that caller state. The same risk exists when another animation system owns one of these properties.

**Impact:** Unmounting or reconfiguring a solver can visibly change application styling and can interfere with composition with other animation libraries.

**Recommended remediation:** Track ownership and original values per property, or centralize all property composition through an ownership-aware style layer. Restore only values that the solver actually changed and only when the current value still belongs to the solver. Add tests with pre-existing inline values and with a second owner active during destroy.

### M-04: React `<Parallax>` silently drops the documented `driver` option

**Severity:** Medium  
**Area:** React public API to core solver contract  
**Location:** [primitives/parallax.tsx](packages/react/src/primitives/parallax.tsx#L14-L36), [types.ts](packages/react/src/types.ts#L72-L92)

The React type contract exposes `driver?: 'auto' | 'js' | 'native'` through `ParallaxOptions`, but the `<Parallax>` primitive destructures only `speed`, `direction`, `min`, `max`, and `respectReducedMotion`. It calls `useParallax` without passing `driver`. Because `driver` remains inside `domProps`, it can also be forwarded as an invalid DOM attribute rather than controlling the core solver.

**Impact:** A consumer explicitly requesting the native or JS driver through the React primitive does not receive the requested behavior. The type declaration suggests support that the runtime does not provide.

**Recommended remediation:** Destructure `driver` in the primitive, pass it to `useParallax`, and ensure it is excluded from DOM props. Add a React rendering test that spies on the constructed solver options or verifies native style setup for `driver: 'native'`.

### M-05: React `<Pin>` drops options and does not implement `bottom`

**Severity:** Medium  
**Area:** React public API and pin lifecycle  
**Location:** [primitives/pin.tsx](packages/react/src/primitives/pin.tsx#L14-L43), [types.ts](packages/react/src/types.ts#L95-L122), [hooks/usePin.ts](packages/react/src/hooks/usePin.ts#L54-L78)

The React `PinOptions` type documents `bottom`, `trackState`, and `disableTransform`. The `<Pin>` primitive destructures `top`, `bottom`, and `onProgress`, but passes only `top` and `onProgress` into `usePin`. `trackState` and `disableTransform` therefore remain in `domProps` and are not forwarded to the hook. `bottom` is destructured but discarded. The core `PinSolver` only receives `duration`, `topOffset`, and `disableTransform`, so there is no bottom-boundary behavior available through this primitive.

**Impact:** Consumers cannot enable the documented reactive state tracking or disable-transform behavior through `<Pin>`, and a configured bottom boundary has no effect. React may also attempt to render unsupported option names as DOM attributes when they are not removed by the primitive.

**Recommended remediation:** Establish one authoritative pin option contract. Pass all supported options through the primitive and hook, implement bottom-boundary semantics in the core solver if required, and add tests for each public option at the component boundary.

### M-06: Scroll transform and draw hooks have stale option semantics

**Severity:** Medium  
**Area:** React hook lifecycle and dynamic configuration  
**Location:** [hooks/useScrollTransform.ts](packages/react/src/hooks/useScrollTransform.ts#L18-L67), [hooks/useScrollDraw.ts](packages/react/src/hooks/useScrollDraw.ts#L15-L64)

Both hooks store the latest options in a ref, but their effects omit `options` and the individual option fields from the dependency array. The comments explicitly say dynamic options may be needed later. As a result, changing `start`, `end`, `properties`, `scrub`, `snap`, or draw configuration after mount does not update the active solver. The new options are written into `optionsRef.current`, but the solver was already constructed with the previous snapshot.

**Impact:** Controlled React applications can render new configuration while the animation continues using old behavior. This is especially surprising for route-driven timelines, responsive breakpoints, and user-configurable motion settings.

**Recommended remediation:** Either document these hooks as mount-time-only and enforce stable options, or define a deliberate update/recreate policy. Prefer a stable serialized/configuration key for primitive numeric options and an explicit rebuild for structural keyframe changes. Add rerender tests proving the chosen policy.

### M-07: Reveal `once` fast-path leaks observer membership and style ownership

**Severity:** Medium  
**Area:** Global observer lifecycle and reveal cleanup  
**Location:** [reveal.ts](packages/core/src/reveal.ts#L101-L137)

When an element is already above the viewport during `observe()` and `once` is true, the implementation sets its revealed state, deletes it from `entries`, and returns before registering it with an observer. More importantly, it leaves the element's inline opacity and transform state modified, while later `unobserve()` cannot clean it because the entry was deleted. If the DOM node is removed or the hook unmounts after this path, the manager has no ownership record to restore the styles.

**Impact:** Elements mounted after their trigger can retain engine-authored inline styles after unmount, and caller-owned values can be lost. In long-lived applications this makes cleanup behavior dependent on the element's initial scroll position.

**Recommended remediation:** Track ownership and original values even for the fast-path, provide an explicit cleanup record, and restore only engine-owned values on unobserve/destroy. Add tests for already-past elements followed by unmount and remount.

## Detailed Surface Evaluation

### Core primitives and solvers

| Surface | Result | Assessment |
|---|---|---|
| `math.ts` | Good baseline | Handles non-finite values and clamps spring delta time; invalid min/max ordering is not normalized. |
| `ticker.ts` | Good baseline with lifecycle gaps | Phase ordering and task error isolation are tested; event listeners are bound once and there is no public teardown/reset for the singleton. |
| `inertia.ts` | Needs remediation | Lenis integration and metrics are coherent; subscriber exceptions are not isolated and `destroy()` clears subscribers, making accidental re-use surprising. |
| `scroll-value.ts` | Needs remediation | Lightweight observable works for normal use; subscriber exceptions can abort notification and initial subscription callback can throw into the caller. |
| `dom.ts` | Mixed | Transform ownership is composable; direct opacity, `willChange`, filter, and backface writes are not ownership-aware. Resize callbacks are not individually guarded. |
| `parallax.ts` | Mixed | JS path is well separated and visibility-aware; native path is only selected when explicitly requested, and native cleanup does not restore previous inline animation values. |
| `pinning.ts` | Needs edge-case tests | Basic progress behavior is covered; zero or negative duration can produce invalid progress math, and existing sticky/position styles are not owned/restored by the core solver. |
| `transform-solver.ts` | Needs remediation | Trigger and scrub behavior are useful; cleanup and direct non-transform writes are destructive. |
| `draw-solver.ts` | Needs contract clarification | `bidirectional` currently behaves as standard one-dimensional draw despite its name and comment; direct SVG style cleanup is destructive. |
| `reveal.ts` | Needs remediation | Shared observer is efficient, but the already-past `once` path has cleanup/style ownership problems. |
| `magnetic.ts` | Good baseline with ownership gap | Event and ticker teardown exists; resize listener is per instance and `willChange`/existing transform ownership must be tested with other solvers. |
| `marquee.ts` | Mixed | Visibility and compositor lifecycle are present; wrapping and direction semantics need browser visual tests. |
| `sequence.ts` | Mixed | Failed image fallback and image listener teardown are thoughtful; frame preloading can retain substantial memory for long sequences and canvas/context behavior is not browser-tested. |
| `text-reveal.ts` | Needs cleanup contract | Phase separation is good; direct opacity cleanup does not restore pre-existing character styles and the range contract is not validated. |
| `horizontal.ts` | Needs remediation | JS/native strategy is clear, but `speed` is ignored and native CSS behavior is not proven in a real browser. |
| `fallback-reader.ts` | Good baseline | SSR no-op and centralized resize handling are present; geometry contract should be tested for transforms, nested scrollers, and RTL/inline cases. |
| `visibility.ts` | Good baseline with lifecycle gaps | Callback errors are isolated and pending entries are batched; callback delivery during immediate fallback/known-state paths is not guarded consistently. |
| `markers.ts` | Mixed | Registry and marker cleanup are tested; registry listener snapshots and singleton teardown across route transitions need explicit coverage. |

### React hooks, primitives, and components

The React package uses sensible patterns in several places: `useSyncExternalStore` is used for selected metrics, layout effects are guarded for SSR in transform/draw hooks, and ticker callbacks are stored in refs to avoid per-render task rebinding. However, public component contracts are not consistently forwarded to core options, and several hooks choose stale mount-time configuration without declaring that as an API rule.

The highest-risk React integration points are:

- [context.tsx](packages/react/src/context.tsx#L68-L157): provider initialization is performed during render when `window` exists, while cleanup sets the ref back to `null`. This is designed around StrictMode but needs real React 18/19 StrictMode and hydration tests.
- [hooks/useParallax.ts](packages/react/src/hooks/useParallax.ts#L22-L86): dependency tracking is field-based, which is good for scalar options, but the hook receives the full `options` object in the effect and has no explicit policy for unknown/future fields.
- [hooks/useScrollTransform.ts](packages/react/src/hooks/useScrollTransform.ts#L18-L67) and [hooks/useScrollDraw.ts](packages/react/src/hooks/useScrollDraw.ts#L15-L64): options are intentionally stale after mount, as documented only in an implementation comment rather than the public API.
- [hooks/usePin.ts](packages/react/src/hooks/usePin.ts#L45-L119): state tracking is throttled at a hard-coded 0.008 progress delta and callback updates are handled through a ref, but the DOM `position` and `top` styles are cleared unconditionally on cleanup.
- [slot.tsx](packages/react/src/slot.tsx#L53-L105): ref and event composition are thoughtful, but event handler composition only wraps handlers present in `slotProps`; child-only handlers remain intact, which should be covered for React 18 and React 19 ref behavior.
- [components/scroll-sequence.tsx](packages/react/src/components/scroll-sequence.tsx#L21-L58): `frames` is an array dependency, so callers that recreate an equivalent array on each render will repeatedly destroy and preload the entire sequence.
- [components/horizontal-scroll.tsx](packages/react/src/components/horizontal-scroll.tsx#L25-L60): the component's `speed` changes container height, but the core solver ignores it, so the component's visual track length and solver mapping are not governed by one shared contract.

### R3F bridge

[createTimelineReader.ts](packages/r3f/src/createTimelineReader.ts#L1-L57) provides a graceful null fallback and cancels its probe animation on destroy. It relies on draft/partial browser APIs (`ViewTimeline`, `Animation`, `KeyframeEffect`) and uses a dummy `KeyframeEffect(null, null, ...)`; this requires real Chromium compatibility testing and a documented browser support matrix. There are no R3F-specific tests in the listed source tree.

## High-Risk Areas Requiring Follow-Up

### Native and fallback parity is under-tested

The horizontal solver has separate JS and native implementations. Existing tests exercise the JS path and inspect CSS identifiers, but there is no equivalent real-browser test proving that native `view-timeline` behavior matches JS progress, range length, resize handling, or cleanup. Capability detection in [feature-detection.ts](packages/core/src/feature-detection.ts#L143-L167) also uses CSS feature support as the readiness signal, while actual runtime behavior depends on browser implementation details that require browser testing.

**Status:** High-risk verification gap, not a confirmed native runtime bug.

### Browser and mobile behavior is not established

The Playwright configuration defines Chromium and mobile Chrome projects in [playwright.config.ts](playwright.config.ts#L12-L25), but the audit did not run the browser suite. Unit mocks cannot establish native CSS timelines, passive input behavior, visual output, reduced-motion behavior, resize observers, or actual frame timing.

**Status:** Release gap.

### Style ownership is inconsistent across solvers

`TransformComposer` safely composes transform strings by owner, but opacity, filter, border radius, transition, and `will-change` are written directly by individual solvers. This creates a mixed ownership model: transforms are composable while other properties are last-writer-wins and cleanup is destructive.

**Status:** Architectural risk. The confirmed TransformSolver cleanup issue is the concrete manifestation found in this audit.

### Global singleton lifecycle needs explicit application-level tests

The ticker, marker registry, marker manager, reveal observer, resize manager, and compositor use singleton state. Individual tests call cleanup methods, but there is limited evidence for full application teardown followed by a fresh application initialization in the same page. This matters for hot reload, route transitions, micro-frontends, and test isolation.

**Status:** Release gap and lifecycle risk; no leak was proven by the commands run.

## Test Coverage Gaps

The current suite is useful and covers 66 tests, including stress and robustness cases. The following tests should be added before release:

1. Horizontal speed behavior for JS and native drivers.
2. Inertia subscriber exception isolation and delivery order.
3. TransformSolver restoration of pre-existing opacity, filter, border radius, and will-change values.
4. Repeated init, destroy, and re-init for `InertiaEngine` and all singleton managers.
5. Native `view-timeline` and `animation-range` behavior in real Chromium.
6. Resize during active horizontal, transform, pin, and fallback-reader animations.
7. Reduced-motion behavior for every solver that writes animated styles.
8. Invalid, reversed, zero-length, NaN, and Infinity trigger/configuration inputs at the public API boundary.
9. Package-consumer tests importing the built package rather than source TypeScript.
10. Coverage reporting with explicit thresholds for core runtime and solver modules.

## Industry-Standard Assessment

### Correctness and architecture

**Strengths:**

- Explicit measure/driver/update/render phases in [ticker.ts](packages/core/src/ticker.ts#L71-L103).
- Error containment at the ticker task boundary.
- SSR-safe fallback reader behavior.
- Shared resize and visibility managers reduce observer duplication.
- Transform composition supports multiple transform owners.
- Robustness and stress tests cover several non-finite and high-load scenarios.

**Gaps:**

- Public option behavior is not fully contract-tested, demonstrated by H-01.
- Style ownership is incomplete outside transforms.
- Observable error semantics are inconsistent between ticker tasks and subscribers.
- Native and fallback implementations lack parity testing in a real browser.

### Performance

The benchmark suite passes, but the current evidence is synthetic. The benchmark output is not a substitute for measurements on representative low-end mobile devices, long pages, mixed content, reduced-motion settings, and multiple simultaneous solvers.

The ticker clamps update `dt` to 33 ms, while frame sampling records the unclamped raw delta. That is a reasonable stability strategy, but it means reported physics time and measured frame time intentionally represent different quantities. This distinction should be documented for consumers interpreting performance telemetry.

Before release, add repeatable browser performance scenarios with frame budget, long-task, memory, and layout/paint measurements. Define thresholds by device class instead of relying only on a local synthetic benchmark.

### Accessibility and reduced motion

The engine exposes reduced-motion-related solver behavior, but the audit did not find a complete end-to-end policy proving that every animated primitive honors `prefers-reduced-motion`. Visual markers are marked `aria-hidden`, which is appropriate for debugging UI, but application-level focus, keyboard, and motion behavior require browser-level validation.

Add browser tests with `prefers-reduced-motion: reduce` and document the exact behavior expected for each public primitive.

### Packaging and release readiness

The core package has a positive foundation:

- `dist` output is configured in [packages/core/tsconfig.json](packages/core/tsconfig.json#L1-L12).
- Declaration and declaration-map generation are enabled.
- The package has a build and lint script.

However, the package manifest exports source paths in [packages/core/package.json](packages/core/package.json#L5-L16), while the build emits to `dist`. That should be verified with a clean consumer install. A production package normally exports built JavaScript and declarations from the published artifact, not TypeScript source, unless the package explicitly targets source-consuming bundlers and documents that contract.

The package also declares `sideEffects: false`. This should be reviewed against modules that perform singleton initialization or import-time behavior, including exported singleton instances such as `ticker`, `tierStore`, `triggerRegistry`, `markerManager`, and `revealObserver`. Incorrect side-effect metadata can allow consumers' bundlers to remove code that is expected to initialize shared runtime state.

Add a pack-and-install smoke test that runs against the actual tarball and verifies ESM, CommonJS expectations if supported, declarations, browser bundling, and tree-shaking behavior.

## Prioritized Remediation Roadmap

### P0: Before production release

1. Fix and test the unused horizontal `speed` option.
2. Define and enforce DOM property ownership/restoration for solver cleanup.
3. Isolate inertia subscriber failures and add diagnostic semantics.
4. Add real Chromium tests for native and fallback horizontal behavior.
5. Verify the published package from a packed artifact, not the workspace source.

### P1: Release hardening

1. Add repeated singleton teardown/reinitialization tests.
2. Add reduced-motion, resize, mobile, and long-page browser scenarios.
3. Add coverage collection and thresholds for core runtime paths.
4. Establish real-device or device-profile performance gates.
5. Document public option semantics, lifecycle requirements, browser support, and error behavior.

### P2: Long-term maintainability

1. Move non-transform style writes to an ownership-aware compositor layer.
2. Make native and JS drivers share a tested progress contract.
3. Add CI jobs for typecheck, unit tests, browser tests, package consumer tests, and benchmarks.
4. Define a release policy for dependency updates, browser support, and semver changes.

## Recommended Next Validation Commands

```powershell
pnpm test
pnpm --filter @scrollcraft/core lint
pnpm --filter @scrollcraft/core build
pnpm test:bench
pnpm test:browser
pnpm exec playwright install
pnpm pack --filter @scrollcraft/core
```

The focused and full unit checks already passed in this audit. Browser and package-consumer checks remain necessary before a production-readiness sign-off.

## Final Assessment

Scrollcraft has a promising and reasonably disciplined engine foundation. It is not currently defensible to call the engine perfectly working or industry-standard because one documented option is functionally inert, cleanup can damage caller-owned styles, subscriber failures are not isolated, and native/browser/package-consumer evidence is incomplete.

The recommended next step is a focused remediation pass for H-01, M-02, and M-03 followed by browser parity and packed-package validation. After those checks pass, the project can be reassessed for conditional production readiness.
