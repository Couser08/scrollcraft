'use client';

/**
 * Docs Section: Production Recipes & Patterns
 * Sticky narrative cards, horizontal gallery scrub, and 3D kinetic product canvas.
 * Strictly under 650 LOC.
 */

import React from 'react';
import { CodeViewer } from '@/components/ui/code-viewer';
import { DocsCallout } from '../docs-callout';

interface DocRecipesProps {
  recipeId: string;
}

const STICKY_NARRATIVE_CODE = `// components/sticky-narrative.tsx
'use client';

import React from 'react';
import { Pin, PinContainer, Reveal, Parallax } from '@scrollcraft/react';

const CHAPTERS = [
  { step: '01', title: 'Compositor Acceleration', desc: 'Direct GPU transforms bypass React virtual DOM diffing.' },
  { step: '02', title: 'Subpixel Lerping', desc: 'Normalized inertia algorithm delivers locked 120 FPS frame consistency.' },
  { step: '03', title: 'Native Sticky Pinning', desc: 'Zero DOM spacers or layout disruptions inside complex CSS grid containers.' },
];

export function StickyNarrative() {
  return (
    <PinContainer className="h-[300vh]">
      <Pin asChild start="top top" end="+=100%">
        <section className="h-screen w-full flex items-center justify-center bg-[#FAFAF9] p-6">
          <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left: Sticky Headline */}
            <div>
              <span className="text-xs font-mono font-bold text-[#FF5A1F] uppercase">Architecture</span>
              <h2 className="text-4xl font-extrabold text-[#0A0A0A] mt-2">Built for Performance</h2>
            </div>

            {/* Right: Sequenced Kinetic Cards */}
            <div className="space-y-4">
              {CHAPTERS.map((chap) => (
                <Reveal key={chap.step} variant="slide-up" duration={0.5}>
                  <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
                    <span className="text-xs font-mono font-bold text-[#9CA3AF]">{chap.step}</span>
                    <h3 className="text-lg font-bold text-[#0A0A0A] mt-1">{chap.title}</h3>
                    <p className="text-xs text-[#6B7280] mt-1">{chap.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </Pin>
    </PinContainer>
  );
}`;

const HORIZONTAL_SCROLL_CODE = `// components/horizontal-gallery.tsx
'use client';

import React, { useRef } from 'react';
import { useScrollProgress, Parallax } from '@scrollcraft/react';

const SLIDES = ['Alpha Architecture', 'Beta Engine', 'Gamma Ticker', 'Delta Compositor'];

export function HorizontalGallery() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative h-[300vh] bg-[#0A0A0A]">
      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
        {/* Horizontal track displaced via Parallax */}
        <Parallax asChild speed={-0.8} direction="horizontal">
          <div className="flex gap-8 pl-12 pr-48 select-none">
            {SLIDES.map((slide, idx) => (
              <div
                key={idx}
                className="w-96 h-64 shrink-0 rounded-2xl bg-zinc-900 border border-zinc-800 p-8 flex flex-col justify-between"
              >
                <span className="text-xs font-mono text-[#FF5A1F]">0{idx + 1}</span>
                <h3 className="text-2xl font-bold text-white">{slide}</h3>
                <span className="text-xs text-zinc-500 font-mono">120 FPS Scrub</span>
              </div>
            ))}
          </div>
        </Parallax>
      </div>
    </div>
  );
}`;

const THREE_D_HERO_CODE = `// components/kinetic-3d-hero.tsx
'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useScroll3D } from '@scrollcraft/r3f';
import { Parallax, Reveal } from '@scrollcraft/react';
import * as THREE from 'three';

function KineticOrb({ target }: { target: HTMLElement | null }) {
  const mesh = useRef<THREE.Mesh>(null);
  const { tick } = useScroll3D(target);

  useFrame(() => {
    if (!mesh.current) return;
    const { progress } = tick();
    mesh.current.rotation.y = progress * Math.PI * 3;
    mesh.current.position.z = (progress - 0.5) * 4;
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[1.2, 32, 32]} />
      <meshStandardMaterial color="#FF5A1F" roughness={0.1} metalness={0.9} />
    </mesh>
  );
}

export function Kinetic3DHero() {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={trackRef} className="relative min-h-[250vh]">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center">
        {/* Foreground Title with Parallax */}
        <Parallax asChild speed={0.3}>
          <div className="absolute z-10 text-center pointer-events-none">
            <Reveal variant="slide-up">
              <h1 className="text-6xl font-extrabold text-[#0A0A0A] tracking-tight">
                Kinetic Dimension
              </h1>
            </Reveal>
          </div>
        </Parallax>

        {/* 3D WebGL Canvas Layer */}
        <Canvas className="w-full h-full">
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <KineticOrb target={trackRef.current} />
        </Canvas>
      </div>
    </div>
  );
}`;

export const DocRecipes: React.FC<DocRecipesProps> = ({ recipeId }) => {
  if (recipeId === 'recipe-sticky-narrative') {
    return (
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <div className="text-xs font-mono font-semibold text-[#FF5A1F] uppercase tracking-wider">
            Cookbook Recipe
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#0A0A0A]">
            Sticky Narrative Cards
          </h1>
          <p className="text-lg text-[#6B7280] leading-relaxed max-w-3xl">
            Build Apple-style product storytelling where the viewport locks in place while cards transition seamlessly.
          </p>
        </header>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-[#0A0A0A]">
            Component Implementation
          </h2>
          <CodeViewer code={STICKY_NARRATIVE_CODE} fileName="components/sticky-narrative.tsx" />
        </section>

        <DocsCallout type="tip" title="CSS Sticky Optimization">
          Because ScrollCraft uses native CSS <code className="font-mono text-xs text-[#0A0A0A]">position: sticky</code> rather than DOM spacers, surrounding grid columns and flex child elements will never suffer jitter or unexpected layout collapses.
        </DocsCallout>
      </div>
    );
  }

  if (recipeId === 'recipe-horizontal-scroll') {
    return (
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <div className="text-xs font-mono font-semibold text-[#FF5A1F] uppercase tracking-wider">
            Cookbook Recipe
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#0A0A0A]">
            Horizontal Gallery Scrub
          </h1>
          <p className="text-lg text-[#6B7280] leading-relaxed max-w-3xl">
            Translate vertical wheel & touch scroll into a buttery-smooth horizontal showroom gallery without hijacking native browser scroll physics.
          </p>
        </header>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-[#0A0A0A]">
            Component Implementation
          </h2>
          <CodeViewer code={HORIZONTAL_SCROLL_CODE} fileName="components/horizontal-gallery.tsx" />
        </section>

        <DocsCallout type="note" title="Trackpad & Touch Friendly">
          Lenis peer normalization ensures that horizontal inertia feels identical across Magic Trackpads, high-precision mousewheels, and mobile touchscreen gestures.
        </DocsCallout>
      </div>
    );
  }

  // recipe-3d-scroll
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <div className="text-xs font-mono font-semibold text-[#FF5A1F] uppercase tracking-wider">
          Cookbook Recipe
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#0A0A0A]">
          3D Kinetic Product Canvas
        </h1>
        <p className="text-lg text-[#6B7280] leading-relaxed max-w-3xl">
          Integrate React Three Fiber WebGL with ScrollCraft Parallax for an Awwwards-winning kinetic hero presentation.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-[#0A0A0A]">
          Component Implementation
        </h2>
        <CodeViewer code={THREE_D_HERO_CODE} fileName="components/kinetic-3d-hero.tsx" />
      </section>

      <DocsCallout type="tip" title="Dual Compositor Sync">
        Both DOM elements (via <code className="font-mono text-xs text-[#FF5A1F]">&lt;Parallax&gt;</code>) and WebGL geometries (via <code className="font-mono text-xs text-[#FF5A1F]">useScroll3D</code>) synchronize against the same browser compositor timeline with zero phase lag.
      </DocsCallout>
    </div>
  );
};
