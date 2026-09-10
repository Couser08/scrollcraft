'use client';

import React from 'react';
import { TextReveal } from '@scrollcraft/react';

export function Act2Problem() {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <TextReveal 
          range={[0.1, 0.6]} 
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-tight text-white"
        >
          React wasn't built for scroll physics. Calling setState on every scroll event murders performance. We fixed that.
        </TextReveal>
      </div>
    </section>
  );
}
