'use client';

import React, { useEffect, useRef } from 'react';
import { Reveal } from '@scrollcraft/react';

function Counter({ end, suffix = '', prefix = '' }: { end: number, suffix?: string, prefix?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const duration = 1500;
        const startTime = performance.now();

        const update = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out expo
          const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          
          if (ref.current) {
            ref.current.innerText = `${prefix}${Math.floor(easeProgress * end)}${suffix}`;
          }
          
          if (progress < 1) {
            requestAnimationFrame(update);
          } else if (ref.current) {
            ref.current.innerText = `${prefix}${end}${suffix}`;
          }
        };
        requestAnimationFrame(update);
        observer.disconnect();
      }
    });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, prefix, suffix]);

  return <div ref={ref}>{prefix}0{suffix}</div>;
}

export function PerformanceSection() {
  return (
    <section className="relative w-full bg-[#050505] py-32 px-6 border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <span className="text-xs font-mono text-zinc-500 mb-12 block">09</span>
        </Reveal>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          <Reveal delay={0.1}>
            <div className="flex flex-col">
              <div className="text-5xl md:text-7xl font-bold text-white mb-2 tracking-tighter">
                <Counter end={3} suffix="kb" />
              </div>
              <span className="text-sm text-zinc-500 uppercase tracking-widest font-semibold">Minified Size</span>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex flex-col">
              <div className="text-5xl md:text-7xl font-bold text-white mb-2 tracking-tighter">
                <Counter end={0} />
              </div>
              <span className="text-sm text-zinc-500 uppercase tracking-widest font-semibold">Dependencies</span>
            </div>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-col">
              <div className="text-5xl md:text-7xl font-bold text-white mb-2 tracking-tighter">
                <Counter end={120} />
              </div>
              <span className="text-sm text-zinc-500 uppercase tracking-widest font-semibold">FPS</span>
            </div>
          </Reveal>
          <Reveal delay={0.4}>
            <div className="flex flex-col">
              <div className="text-5xl md:text-7xl font-bold text-white mb-2 tracking-tighter">
                <Counter end={100} suffix="%" />
              </div>
              <span className="text-sm text-zinc-500 uppercase tracking-widest font-semibold">Native Binds</span>
            </div>
          </Reveal>
        </div>

        {/* Waveform SVG */}
        <Reveal delay={0.5} distance={20}>
          <div className="w-full mt-20 opacity-30">
            <svg width="100%" height="80" viewBox="0 0 1000 80" preserveAspectRatio="none" className="text-white fill-none stroke-current stroke-[1px]">
              {/* FPS Lines */}
              <text x="0" y="20" className="text-[10px] font-mono fill-current stroke-none">120</text>
              <line x1="25" y1="16" x2="1000" y2="16" strokeDasharray="4 4" className="opacity-50" />
              
              <text x="0" y="50" className="text-[10px] font-mono fill-current stroke-none">100</text>
              <line x1="25" y1="46" x2="1000" y2="46" strokeDasharray="4 4" className="opacity-20" />

              <text x="0" y="80" className="text-[10px] font-mono fill-current stroke-none"> 80</text>
              <line x1="25" y1="76" x2="1000" y2="76" strokeDasharray="4 4" className="opacity-20" />

              {/* Performance Graph */}
              <path d="M 25 16 L 200 16 L 220 20 L 240 16 L 400 16 L 450 30 L 480 16 L 600 16 L 620 18 L 650 16 L 800 16 L 850 40 L 900 16 L 1000 16" className="stroke-blue-400 stroke-2" />
            </svg>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
