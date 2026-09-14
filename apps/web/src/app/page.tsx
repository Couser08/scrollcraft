import type { Metadata } from 'next';
import React from 'react';
import dynamic from 'next/dynamic';

import { 
  Navbar,
  HeroSection,
  PrimitivesShowcase,
  Footer,
  FPSMeter
} from '@/components/home/v4';

// Code-split below-the-fold sections for instant initial render
const HooksRawSection = dynamic(
  () => import('@/components/home/v4/03-hooks-raw').then((m) => m.HooksRawSection)
);
const EngineArchitectureSection = dynamic(
  () => import('@/components/home/v4/04-engine-arch').then((m) => m.EngineArchitectureSection)
);
const R3FPreviewSection = dynamic(
  () => import('@/components/home/v4/05-r3f-preview').then((m) => m.R3FPreviewSection)
);
const ComparisonSection = dynamic(
  () => import('@/components/home/v4/06-comparison').then((m) => m.ComparisonSection)
);
const FinalCTASection = dynamic(
  () => import('@/components/home/v4/07-final-cta').then((m) => m.FinalCTASection)
);

export const metadata: Metadata = {
  title: 'ScrollCraft — The Scroll Engine React Never Had',
  description: 'Composable primitives and hooks for parallax, reveals, pins, and scroll-progress — powered by Lenis, safe in RSC, zero React re-renders.',
};

export default function HomePage() {
  return (
    <div className="relative w-full min-h-screen bg-[#050505] text-zinc-100 overflow-x-clip selection:bg-zinc-800 selection:text-white font-sans antialiased">
      {/* Keyboard Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-white font-medium text-xs shadow-lg transition-all"
      >
        Skip to main content
      </a>

      <Navbar />
      {process.env.NODE_ENV === 'development' && <FPSMeter />}
      
      <main id="main-content" className="flex flex-col w-full items-center justify-start">
        {/* Section 1: Hero */}
        <HeroSection />

        {/* Section 2: Primitives Showcase */}
        <PrimitivesShowcase />

        {/* Section 3: Hooks — Raw Access */}
        <HooksRawSection />

        {/* Section 4: R3F Preview (Alpha) */}
        <R3FPreviewSection />

        {/* Section 5: Engine & Architecture */}
        <EngineArchitectureSection />

        {/* Section 6: Ready When You Are (CTA) */}
        <FinalCTASection />

        {/* Section 7: Comparison (Where ScrollCraft Fits) */}
        <ComparisonSection />
      </main>

      <Footer />
    </div>
  );
}
