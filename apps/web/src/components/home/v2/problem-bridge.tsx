'use client';

/**
 * Problem bridge — one beat, no cards.
 */

import React from 'react';
import { Reveal } from '@scrollcraft/react';
import { SectionShell } from './section-shell';

export function ProblemBridgeV2() {
  return (
    <SectionShell id="why" index="01" label="The gap" className="!pt-0 border-t-0">
      <Reveal asChild direction="up" distance={18} duration={0.55}>
        <div className="max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0A0A0A] leading-snug">
            GSAP is powerful but heavy in React.
            <span className="text-[#78716C]"> Framer scroll needs too much glue.</span>
          </h2>
          <p className="mt-5 text-lg text-[#0A0A0A] leading-relaxed">
            ScrollCraft is the middle path —{' '}
            <span className="text-[#FF5A1F] font-semibold">declarative primitives</span>, SSR-safe
            by default, and engineered for App Router.
          </p>
        </div>
      </Reveal>
    </SectionShell>
  );
}
