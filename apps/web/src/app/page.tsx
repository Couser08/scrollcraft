import type { Metadata } from 'next';
import React from 'react';

// New V3 "Premium Storyline" Components
import { V3Header } from '@/components/home/v3/v3-header';
import { Act1Hero } from '@/components/home/v3/act-1-hero';
import { Act2Problem } from '@/components/home/v3/act-2-problem';
import { Act3Engine } from '@/components/home/v3/act-3-engine';
import { ActShowcase } from '@/components/home/v3/act-showcase';
import { Act4CTA } from '@/components/home/v3/act-4-cta';
import { PerformanceHUD } from '@/components/home/v3/performance-hud';
import { V3Footer } from '@/components/home/v3/v3-footer';

export const metadata: Metadata = {
  title: 'ScrollCraft — The Ultimate React Scroll Engine',
  description:
    'High-performance scroll toolkit for React and Next.js. Direct DOM writes, zero React re-renders.',
  openGraph: {
    title: 'ScrollCraft — The Ultimate React Scroll Engine',
    description:
      'High-performance scroll toolkit for React and Next.js. Direct DOM writes, zero React re-renders.',
    type: 'website',
  },
};

export default function HomePage() {
  return (
    // Scoped strictly to this page to prevent bleeding into other pages if they rely on layout.tsx's light mode base
    <div className="relative w-full min-h-screen bg-[#050505] text-zinc-100 overflow-x-hidden selection:bg-zinc-800 selection:text-white font-sans antialiased">
      <V3Header />
      
      <main className="flex flex-col w-full items-center justify-start">
        <Act1Hero />
        <Act2Problem />
        <Act3Engine />
        <ActShowcase />
        <Act4CTA />
      </main>

      <V3Footer />
      <PerformanceHUD />
    </div>
  );
}
