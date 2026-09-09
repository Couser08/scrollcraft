'use client';

/**
 * Main Home Section Container
 * Composes HeroContent, HeroMockup, Divider and FeaturesStrip.
 * Strictly under 650 LOC.
 */

import React from 'react';
import { HeroContent } from './hero-content';
import { HeroMockup } from './hero-mockup';
import { FeaturesStrip } from './features-strip';
import { Divider } from '@/components/ui/divider';
import { scroll } from '@scrollcraft/react';

export const HeroSection: React.FC = () => {
  return (
    <scroll.section className="relative min-h-screen w-full flex flex-col justify-between px-6 sm:px-10 lg:px-16 pt-16 lg:pt-24 pb-8 overflow-hidden">
      {/* Background Dot Grid */}
      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none -z-20"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Ambient Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-blue-600/15 via-blue-500/5 to-transparent rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Upper 2-Column Hero Area */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center flex-1">
        <div className="lg:col-span-5 flex justify-center lg:justify-start">
          <HeroContent />
        </div>
        <div className="lg:col-span-7 flex justify-center">
          <HeroMockup />
        </div>
      </div>

      {/* Bottom Section: Divider and 5 Features */}
      <div className="w-full max-w-7xl mx-auto mt-12 lg:mt-16">
        <Divider />
        <FeaturesStrip />
      </div>
    </scroll.section>
  );
};
