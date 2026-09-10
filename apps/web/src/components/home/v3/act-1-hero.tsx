'use client';

import React from 'react';
import { Parallax } from '@scrollcraft/react';

export function Act1Hero() {
  return (
    <section className="relative min-h-[120vh] w-full flex items-center justify-center overflow-hidden pt-20" style={{ transform: 'translateZ(0)' }}>
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <Parallax speed={0.1}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-xs font-medium tracking-wide text-zinc-300 uppercase">ScrollCraft Engine v1.0</span>
          </div>
        </Parallax>

        <Parallax speed={-0.15}>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-6 leading-[1.1]">
            Stop Scrolling. <br />
            <span className="text-zinc-500">Start Crafting.</span>
          </h1>
        </Parallax>

        <Parallax speed={-0.25}>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-light">
            The ultimate React-native scroll toolkit. Direct GPU compositor writes. 
            Zero wrapper pollution. <span className="text-white font-medium">Zero React re-renders.</span>
          </p>
        </Parallax>
      </div>

    </section>
  );
}
