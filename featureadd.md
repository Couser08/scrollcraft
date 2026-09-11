# ScrollCraft Feature Addition Contract

New feature tabhi ship hoga jab existing public APIs semver-safe rahen, SSR import-safe rahe,
and every browser-only API graceful fallback de. Feature implementation ko core solver, React
hook/component, public exports, documentation playground and regression tests ke same PR mein
deliver karna hoga.

## Mandatory gates

- Core work measure -> update -> render follow kare; update phase DOM read/write nahi karega.
- Ticker, observer, event listener, image/video and WAAPI resources unmount/destroy par release honge.
- prefers-reduced-motion, keyboard behavior and no-JavaScript/static fallback documented honge.
- Native CSS timelines enhancement hain; JS fallback correctness path mandatory hai.
- New transforms TransformComposer owner key use karenge, direct style.transform overwrite nahi.
- Unit, React integration, SSR import, and supported-browser E2E coverage required hai.
- Performance result existing stress baseline se materially regress nahi hona chahiye; mobile memory
  impact explicitly measured/documented hoga.

## Deferred feature order

1. Timeline easing curves and CSS animation bridge
2. Scroll snap integration and DevTools/debug overlay
3. Progress color interpolation and video scrubber
4. Virtual/infinite list support
5. Counter ticker and direction lock

Har feature proposal mein public API, fallback behavior, browser support, memory budget, migration
notes and rollback plan include hona mandatory hai.
