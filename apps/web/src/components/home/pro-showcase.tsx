'use client';

/**
 * ScrollCraft Pro Component Showcase
 * Interactive live demonstration of the 5 Signature Pro components.
 * Strictly under 650 LOC.
 */

import React from 'react';
import { ProTiltCard } from '@/components/pro/pro-tilt-card';
import { ProTextReveal } from '@/components/pro/pro-text-reveal';
import { ProMagneticDock } from '@/components/pro/pro-magnetic-dock';
import { ProHorizontalRail } from '@/components/pro/pro-horizontal-rail';
import { ProCardStack } from '@/components/pro/pro-card-stack';

export const ProShowcase: React.FC = () => {
  const horizontalItems = [
    {
      id: 'h1',
      title: 'Zero Memory Allocations in 120fps Loops',
      category: 'Performance',
      gradient: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
    },
    {
      id: 'h2',
      title: 'Direct-to-GPU Transform Compositor Writes',
      category: 'Architecture',
      gradient: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)',
    },
    {
      id: 'h3',
      title: 'Frame-Rate Invariant Analytical Springs',
      category: 'Physics',
      gradient: 'linear-gradient(135deg, #4c1d95 0%, #1e1b4b 100%)',
    },
    {
      id: 'h4',
      title: 'Zero Hydration Mismatch in Next.js 15',
      category: 'Developer DX',
      gradient: 'linear-gradient(135deg, #7c2d12 0%, #18181b 100%)',
    },
  ];

  const stackCards = [
    {
      id: 'sc-1',
      title: '1. Install via CLI',
      description: 'Run `npx scrollcraft add <component>` to scaffold production-ready code directly into your project.',
      badge: 'CLI SPEED',
      bgGradient: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    },
    {
      id: 'sc-2',
      title: '2. Zero External Kits',
      description: 'No Shadcn or Framer Motion bloat. Pure standalone TypeScript and Tailwind v4 universal design tokens.',
      badge: 'BESPOKE CRAFT',
      bgGradient: 'linear-gradient(135deg, #1e3a8a 0%, #172554 100%)',
    },
    {
      id: 'sc-3',
      title: '3. Commercial Cash Flow',
      description: 'Ship client websites and SaaS landing pages that look like Awwwards Site of the Day, driving high-ticket revenue.',
      badge: 'MONETIZE',
      bgGradient: 'linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)',
    },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. Kinetic Text Reveal */}
      <ProTextReveal text="Engineered for developers who demand Apple-grade tactile feedback, zero jank, and stable 120 FPS performance." />

      {/* 2. macOS Magnetic Fluid Dock */}
      <ProMagneticDock />

      {/* 3. 3D Tilt Cards */}
      <div className="w-full max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <ProTiltCard
          title="Interactive 3D Tilt"
          subtitle="Hover and glide to experience dual-axis rotational spring inertia and specular lighting."
          tag="PHYSICS"
        />
        <ProTiltCard
          title="Subpixel Precision"
          subtitle="Delta-time normalized physics ensure uniform feel across 60Hz and 144Hz monitors."
          tag="GAME-DEV"
        />
        <ProTiltCard
          title="Next.js 15 Ready"
          subtitle="Cleanly isolated client boundaries with zero SSR hydration mismatches."
          tag="NEXT.JS"
        />
      </div>

      {/* 4. Horizontal Pinned Rail */}
      <ProHorizontalRail items={horizontalItems} />

      {/* 5. Layered Stacking Cards */}
      <ProCardStack cards={stackCards} />
    </div>
  );
};
