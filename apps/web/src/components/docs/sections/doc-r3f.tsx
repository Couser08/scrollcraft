'use client';

/**
 * Docs Section: 3D & Canvas (@scrollcraft/r3f Bridge)
 * Covers the WAAPI currentTime polling bridge, useScroll3D, and Three.js integration.
 * Strictly under 650 LOC.
 */

import React from 'react';
import { CodeViewer } from '@/components/ui/code-viewer';
import { DocsTable } from '../docs-table';
import { DocsCallout } from '../docs-callout';
import { USE_SCROLL_3D_PROPS } from '../docs-data';
import { Scroll3DPlayground } from '../interactive/scroll-3d-playground';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

interface DocR3FProps {
  sectionId: string;
}

const R3F_INSTALL_CODE = `# Install the R3F bridge along with peer dependencies
pnpm add @scrollcraft/r3f @scrollcraft/core @react-three/fiber three
pnpm add -D @types/three`;

const R3F_BASIC_USAGE_CODE = `// components/scroll-scene.tsx
'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useScroll3D } from '@scrollcraft/r3f';
import * as THREE from 'three';

// 1. Inner 3D Mesh Component
function RotatingCube({ trackElement }: { trackElement: HTMLElement | null }) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Hook pull pattern: Returns mutable tick() and metrics ref
  // Zero React state invalidations inside useFrame!
  const { tick } = useScroll3D(trackElement, { axis: 'block' });

  useFrame(() => {
    if (!meshRef.current) return;

    // Synchronously pull normalized compositor progress (0.0 to 1.0)
    const { progress, velocity } = tick();

    // Directly mutate Three.js mesh transforms
    meshRef.current.rotation.x = progress * Math.PI * 2;
    meshRef.current.rotation.y = progress * Math.PI * 4;
    meshRef.current.position.y = (progress - 0.5) * 3;
    
    // Add dynamic velocity responsiveness
    meshRef.current.scale.setScalar(1 + Math.abs(velocity) * 2);
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial color="#FF5A1F" roughness={0.2} metalness={0.8} />
    </mesh>
  );
}

// 2. Parent Layout Canvas
export function ScrollScene() {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative min-h-[300vh]">
      {/* Target element establishing the scroll progress bounds */}
      <div ref={trackRef} className="absolute inset-x-0 top-0 h-[200vh] pointer-events-none" />

      {/* Sticky R3F Canvas */}
      <div className="sticky top-0 h-screen w-full">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} />
          <RotatingCube trackElement={trackRef.current} />
        </Canvas>
      </div>
    </div>
  );
}`;

const WAAPI_EXPLAINER_CODE = `// packages/r3f/src/createTimelineReader.ts
export function createTimelineReader(subject: Element, axis = 'block') {
  // 1. Detect native CSS ViewTimeline support (Chrome, Edge 115+)
  if (typeof ViewTimeline === 'undefined' || typeof Animation === 'undefined') {
    return null;
  }

  // 2. Bind a native timeline to the DOM subject
  const timeline = new ViewTimeline({ subject, axis });

  // 3. Attach dummy paused animation probe (Zero CPU/GPU cost)
  const probe = new Animation(
    new KeyframeEffect(null, null, { duration: 1, fill: 'both' }),
    timeline
  );
  probe.play();
  probe.pause();

  return {
    // 4. Synchronously read probe.currentTime on the 3D frame!
    read: (): number => {
      const ct = probe.currentTime;
      if (ct === null) return 0;
      const val = typeof ct === 'number' ? ct : ct.value;
      return Math.min(Math.max(val / 100, 0), 1);
    },
    destroy: () => probe.cancel(), // Prevent memory leaks
  };
}`;

export const DocR3F: React.FC<DocR3FProps> = ({ sectionId }) => {
  if (sectionId === 'r3f-overview') {
    return (
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <div className="text-xs font-mono font-semibold text-[#FF5A1F] uppercase tracking-wider">
            3D & Canvas Integration
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-100">
            3D Scroll Architecture
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed max-w-3xl">
            Why synchronizing 3D WebGL scenes with browser scroll has historically been broken — and how ScrollCraft solved it.
          </p>
        </header>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
            The Double-RAF Dilemma
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            In standard React Three Fiber setups, developers typically listen to scroll via <code className="font-mono text-xs text-zinc-100 bg-white/10 px-1 py-0.5 rounded">window.addEventListener(&apos;scroll&apos;)</code> and write the offset to React state (<code className="font-mono text-xs text-zinc-100 bg-white/10 px-1 py-0.5 rounded">useState</code>).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span>The Naive Push Anti-Pattern</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Scroll events push state updates into React. React initiates a full reconciliation re-render cycle 60 times a second. Meanwhile, R3F&apos;s internal WebGL loop is also requesting frames. Both loops fight for CPU budget, resulting in severe micro-stuttering and dropped frames.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>ScrollCraft Pull Architecture</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                <code className="font-mono font-semibold text-emerald-800">useScroll3D</code> eliminates React state entirely. Instead of pushing scroll into React, the Three.js loop <strong>pulls</strong> compositor metrics on-demand via <code className="font-mono text-emerald-800">tick()</code> strictly inside <code className="font-mono text-emerald-800">useFrame</code>.
              </p>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
            Quick Installation
          </h2>
          <CodeViewer code={R3F_INSTALL_CODE} fileName="terminal" />
        </section>

        <DocsCallout type="tip" title="Compositor Precision">
          Because the bridge reads native browser compositor progress, 3D meshes respond with subpixel smoothness even when scrolling at high velocity on high-refresh 120Hz ProMotion displays.
        </DocsCallout>
      </div>
    );
  }

  if (sectionId === 'r3f-three-tier') {
    return (
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <div className="text-xs font-mono font-semibold text-[#FF5A1F] uppercase tracking-wider">
            3D & Canvas Integration
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-100">
            The WAAPI Bridge Architecture
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed max-w-3xl">
            Synchronous compositor timeline interrogation with zero layout reflows and cross-browser fallback.
          </p>
        </header>

        {/* Embedded Interactive Playground */}
        <Scroll3DPlayground />

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
            How the WAAPI Probe Operates
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Chromium (Chrome, Edge 115+) supports native CSS <code className="font-mono text-xs text-zinc-100 bg-white/10 px-1 py-0.5 rounded">ViewTimeline</code>. Rather than waiting for JavaScript intersection observer callbacks, ScrollCraft binds a dummy Web Animations API (WAAPI) probe directly to the native timeline.
          </p>
          <CodeViewer code={WAAPI_EXPLAINER_CODE} fileName="packages/r3f/src/createTimelineReader.ts" />
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
            Graceful Degradation (Safari & Firefox)
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            In browsers where CSS <code className="font-mono text-xs text-zinc-100 bg-white/10 px-1 py-0.5 rounded">ViewTimeline</code> is not yet implemented (Safari and Firefox), ScrollCraft automatically falls back to <code className="font-mono text-xs text-zinc-100 bg-white/10 px-1 py-0.5 rounded">createFallbackReader</code> from <code className="font-mono text-xs text-[#FF5A1F] bg-[#FF5A1F]/10 px-1 py-0.5 rounded">@scrollcraft/core</code>.
          </p>
          <p className="text-sm text-zinc-400 leading-relaxed">
            The fallback uses a background <code className="font-mono text-xs text-zinc-100">ResizeObserver</code> to measure element dimensions outside the animation loop, guaranteeing that <code className="font-mono text-xs text-zinc-100">tick()</code> never forces a layout reflow.
          </p>
        </section>

        <DocsCallout type="note" title="Memory Leak Protection">
          Unattached Web Animations API instances can leak memory if not properly garbage-collected during Next.js client-side route transitions. <code className="font-mono text-xs text-[#FF5A1F]">useScroll3D</code> guarantees that <code className="font-mono text-xs text-zinc-100">reader.destroy()</code> and <code className="font-mono text-xs text-zinc-100">probe.cancel()</code> are strictly called whenever the canvas unmounts.
        </DocsCallout>
      </div>
    );
  }

  if (sectionId === 'use-scroll-3d') {
    return (
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <div className="text-xs font-mono font-semibold text-[#FF5A1F] uppercase tracking-wider">
            API Reference
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-100 font-mono">
            useScroll3D
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed max-w-3xl">
            Pull-based React Three Fiber hook providing synchronous compositor metrics inside <code className="font-mono text-sm text-zinc-100">useFrame</code>.
          </p>
        </header>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
            Hook Signature
          </h2>
          <div className="p-4 rounded-xl bg-[#0A0A0A] text-zinc-100 font-mono text-xs overflow-x-auto">
            <span className="text-purple-400">function</span> <span className="text-blue-400">useScroll3D</span>(
            <br />
            &nbsp;&nbsp;target: <span className="text-emerald-400">Element | null</span>,
            <br />
            &nbsp;&nbsp;options?: &#123; axis?: <span className="text-amber-400">&apos;block&apos; | &apos;inline&apos;</span> &#125;
            <br />
            ): &#123;
            <br />
            &nbsp;&nbsp;metrics: <span className="text-emerald-400">RefObject&lt;Scroll3DMetrics&gt;</span>;
            <br />
            &nbsp;&nbsp;tick: () =&gt; <span className="text-emerald-400">Scroll3DMetrics</span>;
            <br />
            &#125;
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
            Scroll3DMetrics Structure
          </h2>
          <div className="p-4 rounded-xl border border-white/10 bg-white/5 font-mono text-xs space-y-2">
            <div className="text-zinc-400">
              <span className="text-zinc-100 font-bold">progress</span>: number (0.0 to 1.0 normalized intersection completion)
            </div>
            <div className="text-zinc-400">
              <span className="text-zinc-100 font-bold">velocity</span>: number (frame-to-frame delta for inertia distortion)
            </div>
            <div className="text-zinc-400">
              <span className="text-zinc-100 font-bold">direction</span>: 1 | -1 | 0 (1 = forward/down, -1 = backward/up)
            </div>
          </div>
        </section>

        <DocsTable title="useScroll3D Parameters" props={USE_SCROLL_3D_PROPS} />

        <DocsCallout type="warning" title="Canvas Guard">
          <code className="font-mono text-xs text-[#FF5A1F]">useScroll3D</code> includes an internal Three context guard. If invoked outside of an R3F <code className="font-mono text-xs text-zinc-100">&lt;Canvas&gt;</code> tree, it immediately surfaces a helpful diagnostic error: <code className="font-mono text-xs text-rose-700 bg-rose-50 px-1 py-0.5 rounded">&quot;[ScrollCraft] useScroll3D must be called inside a &lt;Canvas&gt; component.&quot;</code>
        </DocsCallout>
      </div>
    );
  }

  // r3f-recipes
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <div className="text-xs font-mono font-semibold text-[#FF5A1F] uppercase tracking-wider">
          Production Examples
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-100">
          Three.js Scene Recipe
        </h1>
        <p className="text-lg text-zinc-400 leading-relaxed max-w-3xl">
          Complete, production-ready Next.js 15 App Router recipe integrating React Three Fiber with ScrollCraft.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
          Copy-Paste Implementation
        </h2>
        <CodeViewer code={R3F_BASIC_USAGE_CODE} fileName="components/scroll-scene.tsx" />
      </section>

      <DocsCallout type="tip" title="Next.js SSR Safety">
        Ensure your Three.js canvas component includes <code className="font-mono text-xs text-[#FF5A1F]">&apos;use client&apos;</code> at line 1. <code className="font-mono text-xs text-zinc-100">useScroll3D</code> internally guards its layout hooks against SSR evaluation so Server Components will never crash.
      </DocsCallout>
    </div>
  );
};

