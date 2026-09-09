'use client';

/**
 * ScrollCraft Complete Showcase Application
 * Composes:
 * - Sprint 1: Full-Fidelity In-House Home Section
 * - Sprint 2: Zero-Spacer Pinning Engine, Timeline DSL, and DevTools HUD
 * - Sprint 3: 5 Awwwards-Tier Signature Pro Components
 * - Sprint 4: Pro Component Catalog & Commercial Tiered Pricing Section
 * Strictly under 650 LOC.
 */

import React from 'react';
import { HeroSection } from '@/components/home/hero-section';
import { PinnedShowcase } from '@/components/home/pinned-showcase';
import { ProShowcase } from '@/components/home/pro-showcase';
import { ProCatalog } from '@/components/pro/pro-catalog';
import { ProPricing } from '@/components/pro/pro-pricing';
import { FpsHud } from '@/components/ui/fps-hud';

export default function HomePage() {
  return (
    <div className="relative w-full min-h-screen bg-[#0a0a0c] text-white overflow-x-hidden">
      {/* Sprint 1: Full-Fidelity In-House Home Section */}
      <HeroSection />

      {/* Sprint 2: Zero-Spacer Pinning Engine & Timeline DSL */}
      <PinnedShowcase />

      {/* Sprint 3: ScrollCraft Pro 5 Signature Components */}
      <ProShowcase />

      {/* Sprint 4: ScrollCraft Pro Component Catalog & CLI Exporter */}
      <ProCatalog />

      {/* Sprint 4: Commercial Pricing & Licensing Engine */}
      <ProPricing />

      {/* Sprint 2: Real-time 120 FPS Game-Dev HUD Overlay */}
      <FpsHud />
    </div>
  );
}
