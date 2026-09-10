'use client';

import React from 'react';
import { Reveal } from '@scrollcraft/react';

export function Act3Engine() {
  const features = [
    {
      title: '3-Phase Ticker',
      description: 'Measure, Update, Render. A pure game-dev physics loop mapped to the DOM to guarantee zero layout thrashing.',
    },
    {
      title: 'Zero Re-Renders',
      description: 'We write directly to node.style.transform via refs. React never even knows the scroll changed.',
    },
    {
      title: 'Lenis Integration',
      description: 'The industry standard for smooth scroll momentum, baked directly into the core engine for cross-browser parity.',
    }
  ];

  return (
    <section className="relative min-h-[80vh] w-full py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 text-center">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
              The Engine Exposed
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              We stripped away the physics bloat and focused purely on native scroll bindings.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <Reveal key={i} delay={0.1 * i + 0.2}>
              <div className="group relative p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-500 overflow-hidden h-full">
                {/* Subtle hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <h3 className="text-xl font-semibold text-white mb-4 relative z-10">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed relative z-10">{feature.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
