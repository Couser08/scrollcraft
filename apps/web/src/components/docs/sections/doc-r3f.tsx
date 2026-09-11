'use client';

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

const R3F_BASIC_USAGE_REACT = `import React, { useRef } from 'react';
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
      <meshStandardMaterial color="#3b82f6" roughness={0.2} metalness={0.8} />
    </mesh>
  );
}

// 2. Parent Layout Canvas
export function ScrollScene() {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative min-h-[300vh]">
      <div ref={trackRef} className="absolute inset-x-0 top-0 h-[200vh] pointer-events-none" />
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

const R3F_BASIC_USAGE_NEXT = `'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useScroll3D } from '@scrollcraft/r3f';
import * as THREE from 'three';

function RotatingCube({ trackElement }: { trackElement: HTMLElement | null }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { tick } = useScroll3D(trackElement, { axis: 'block' });

  useFrame(() => {
    if (!meshRef.current) return;
    const { progress, velocity } = tick();
    meshRef.current.rotation.x = progress * Math.PI * 2;
    meshRef.current.rotation.y = progress * Math.PI * 4;
    meshRef.current.position.y = (progress - 0.5) * 3;
    meshRef.current.scale.setScalar(1 + Math.abs(velocity) * 2);
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial color="#3b82f6" roughness={0.2} metalness={0.8} />
    </mesh>
  );
}

export function ScrollScene() {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative min-h-[300vh]">
      <div ref={trackRef} className="absolute inset-x-0 top-0 h-[200vh] pointer-events-none" />
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
    destroy: () => probe.cancel(),
  };
}`;

export const DocR3F: React.FC<DocR3FProps> = ({ sectionId }) => {
  if (sectionId === 'r3f-overview') {
    return (
      <div className="flex flex-col gap-12">
        <header className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-[11px] font-mono font-semibold text-amber-400 uppercase tracking-widest w-fit">
            3D & CANVAS INTEGRATION
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tighter text-white leading-[1.08] font-mono">
            3D Scroll Architecture
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-3xl">
            Why synchronizing 3D WebGL scenes with browser scroll has historically been broken — and how ScrollCraft solved it.
          </p>
        </header>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            The Double-RAF Dilemma
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            In standard React Three Fiber setups, developers typically listen to scroll via <code className="font-mono text-xs text-zinc-300 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">window.addEventListener(&apos;scroll&apos;)</code> and write the offset to React state (<code className="font-mono text-xs text-zinc-300 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">useState</code>).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
            <div className="p-5 rounded-xl border border-rose-950/60 bg-rose-950/15 shadow-xl">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span>The Naive Push Anti-Pattern</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Scroll events push state updates into React. React initiates a full reconciliation re-render cycle 60 times a second. Meanwhile, R3F&apos;s internal WebGL loop is also requesting frames. Both loops fight for CPU budget, resulting in severe micro-stuttering and dropped frames.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-emerald-950/60 bg-emerald-950/15 shadow-xl">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>ScrollCraft Pull Architecture</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                <code className="font-mono font-semibold text-emerald-400">useScroll3D</code> eliminates React state entirely. Instead of pushing scroll into React, the Three.js loop <strong>pulls</strong> compositor metrics on-demand via <code className="font-mono text-emerald-400">tick()</code> strictly inside <code className="font-mono text-emerald-400">useFrame</code>.
              </p>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-white">
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
      <div className="flex flex-col gap-12">
        <header className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-[11px] font-mono font-semibold text-amber-400 uppercase tracking-widest w-fit">
            3D & CANVAS INTEGRATION
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tighter text-white leading-[1.08] font-mono">
            WAAPI Bridge Architecture
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-3xl">
            Synchronous compositor timeline interrogation with zero layout reflows and cross-browser fallback.
          </p>
        </header>

        {/* Embedded Interactive Playground */}
        <Scroll3DPlayground />

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            How the WAAPI Probe Operates
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Chromium (Chrome, Edge 115+) supports native CSS <code className="font-mono text-xs text-white bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">ViewTimeline</code>. Rather than waiting for JavaScript intersection observer callbacks, ScrollCraft binds a dummy Web Animations API (WAAPI) probe directly to the native timeline.
          </p>
          <CodeViewer code={WAAPI_EXPLAINER_CODE} fileName="packages/r3f/src/createTimelineReader.ts" />
        </section>

        <DocsCallout type="note" title="Zero Overhead Probe">
          The dummy animation is paused immediately on creation. It generates zero rendering artifacts and consumes zero GPU memory while enabling synchronous nanosecond <code className="font-mono text-xs text-white">currentTime</code> polling during RAF loops.
        </DocsCallout>
      </div>
    );
  }

  // use-scroll-3d & recipes
  return (
    <div className="flex flex-col gap-12">
      <header className="flex flex-col gap-4">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-[11px] font-mono font-semibold text-amber-400 uppercase tracking-widest w-fit">
          3D & CANVAS INTEGRATION
        </div>
        <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tighter text-white leading-[1.08] font-mono">
          useScroll3D Hook
        </h1>
        <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-3xl">
          Direct pull-based bridge connecting standard React Three Fiber <code className="font-mono text-xs text-white">useFrame</code> rendering loops to native browser scroll progress.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Usage & Syntax
        </h2>
        <CodeViewer
          tabs={[
            { label: 'React', code: R3F_BASIC_USAGE_REACT, fileName: 'src/ScrollScene.tsx' },
            { label: 'Next.js', code: R3F_BASIC_USAGE_NEXT, fileName: 'app/components/ScrollScene.tsx' },
          ]}
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Configuration Options
        </h2>
        <DocsTable title="useScroll3D Options" props={USE_SCROLL_3D_PROPS} />
      </section>
    </div>
  );
};
