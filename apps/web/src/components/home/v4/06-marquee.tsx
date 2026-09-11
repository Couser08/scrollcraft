'use client';

import React from 'react';
import { VelocityMarquee } from '@scrollcraft/react';

export function MarqueeSection() {
  return (
    <section className="relative w-full bg-[#050505] py-20 overflow-hidden">
      
      {/* Velocity Marquee */}
      <div className="w-[calc(100%+4rem)] -mx-8 group cursor-default">
        <VelocityMarquee 
          baseSpeed={-1.5} 
          className="text-7xl md:text-[140px] font-bold tracking-tighter text-zinc-800 uppercase whitespace-nowrap group-hover:opacity-80 transition-opacity"
        >
          PARALLAX &bull; PINNING &bull; REVEALS &bull; SCRUB &bull;&nbsp;
        </VelocityMarquee>
        <VelocityMarquee 
          baseSpeed={1.5}
          className="text-7xl md:text-[140px] font-bold tracking-tighter text-zinc-900 whitespace-nowrap group-hover:opacity-80 transition-opacity mt-4 border-text"
        >
          VELOCITY &bull; MARQUEE &bull; STICKY &bull; TRANSITIONS &bull;&nbsp;
        </VelocityMarquee>
      </div>
    </section>
  );
}
