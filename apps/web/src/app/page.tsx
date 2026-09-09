import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import { HeroSectionRedesign } from '@/components/home/hero-section-redesign';
import { PrimitivesSectionRedesign } from '@/components/home/primitives-section-redesign';
import { ShowcaseBentoRedesign } from '@/components/home/showcase-bento-redesign';
import { ArchitectureComparisonRedesign } from '@/components/home/architecture-comparison-redesign';
import { QuickstartStepsRedesign } from '@/components/home/quickstart-steps-redesign';
import { CtaBannerRedesign } from '@/components/home/cta-banner-redesign';
import { ClientFpsHud } from '@/components/ui/client-fps-hud';

export const metadata: Metadata = {
  title: 'ScrollCraft — Scroll experiences for modern web.',
  description:
    'High-performance scroll primitives for React and Next.js. Direct GPU compositor writes, zero React re-renders, and no wrapper pollution.',
  openGraph: {
    title: 'ScrollCraft — Scroll experiences for modern web.',
    description:
      'High-performance scroll primitives for React and Next.js. Direct GPU compositor writes, zero React re-renders, and no wrapper pollution.',
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <div className="relative w-full min-h-screen bg-[#FAFAF9] text-[#0A0A0A] overflow-x-hidden selection:bg-[#FF5A1F]/20 selection:text-[#FF5A1F]">
      {/* 1. Grand Hero Section (Image 2) */}
      <HeroSectionRedesign />

      {/* 2. Four Composable Primitives Grid (Image 2) */}
      <PrimitivesSectionRedesign />

      {/* 3. See What You Can Build (Bento Showcase with 3D Kinetic Cards) */}
      <ShowcaseBentoRedesign />

      {/* 4. Engine Architecture Compared & Modern React Stack (Image 2) */}
      <ArchitectureComparisonRedesign />

      {/* 5. Get Started In Minutes (3 Step Cards, Image 2) */}
      <QuickstartStepsRedesign />

      {/* 6. Ready to build something amazing? CTA Banner (Image 2) */}
      <CtaBannerRedesign />

      {/* 7. Zero Re-render Performance Telemetry Island */}
      <Suspense fallback={null}>
        <ClientFpsHud />
      </Suspense>
    </div>
  );
}
