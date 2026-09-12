'use client';

import React from 'react';
import Image from 'next/image';
import { Parallax, Reveal } from '@scrollcraft/react';

export function ImmersiveSection() {
  return (
    <section className="relative h-screen w-full bg-[#050505] overflow-hidden flex items-center justify-center border-t border-white/5">
      
      {/* Cinematic Background via native Parallax primitive */}
      <div className="absolute inset-0 z-0">
        <Parallax speed={-0.2} className="w-full h-[140%] -top-[20%] relative">
          <Image
            src="/images/cinematic_landscape.webp"
            alt="Cinematic landscape background"
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1440px) 100vw, 1920px"
            className="object-cover object-center"
          />
        </Parallax>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Reveal Text via native Reveal primitive */}
      <Reveal direction="up" delay={0.2} distance={80} className="relative z-20 text-center">
        <h2 className="text-6xl md:text-8xl lg:text-[120px] font-bold tracking-tighter text-white mb-6">
          Designed<br/>to move.
        </h2>
        <p className="text-xl md:text-2xl text-zinc-300 max-w-2xl mx-auto font-light">
          Create immersive, memorable experiences<br/>that engage your users.
        </p>
      </Reveal>

      {/* Side Labels */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
        <span className="text-xs font-mono text-white/50">04</span>
        <div className="w-[1px] h-12 bg-white/30" />
        <span className="text-xs font-mono text-white/80 tracking-widest uppercase writing-vertical-lr rotate-180 mt-4">
          REAL<br/>EXPERIENCES
        </span>
      </div>

      <div className="absolute right-8 bottom-16 z-20 flex flex-col items-center gap-4">
        <div className="w-[1px] h-12 bg-white/30" />
        <span className="text-xs font-mono text-white/80 tracking-widest uppercase">
          SCROLL<br/>FURTHER
        </span>
      </div>

    </section>
  );
}
