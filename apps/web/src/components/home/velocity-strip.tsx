'use client';

/**
 * Velocity-linked marquee strip — proves InertiaEngine velocity → motion.
 * Strictly under 650 LOC.
 */

import React from 'react';
import { VelocityMarquee, Reveal } from '@scrollcraft/react';

const TOKENS = [
  'zero re-renders',
  'asChild Slot',
  'native view-timeline',
  'Lenis inertia',
  '3-phase ticker',
  'SSR-safe store',
  'GPU translate3d',
  'reduced motion',
];

export const VelocityStrip: React.FC = () => {
  return (
    <section className="w-full border-y border-[#E7E5E4] bg-[#0A0A0A] py-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-5">
        <Reveal asChild direction="up" distance={12}>
          <p className="text-[11px] font-mono uppercase tracking-wider text-[#FF5A1F]">
            VelocityMarquee · scroll faster to accelerate
          </p>
        </Reveal>
      </div>

      <VelocityMarquee baseSpeed={0.45} velocityMultiplier={0.1} maxSpeed={4}>
        <div className="flex items-center gap-10 pr-10">
          {TOKENS.map((token) => (
            <span
              key={token}
              className="text-2xl sm:text-3xl font-bold tracking-tight text-white/90 whitespace-nowrap"
            >
              {token}
              <span className="text-[#FF5A1F] ml-10">/</span>
            </span>
          ))}
        </div>
      </VelocityMarquee>
    </section>
  );
};
