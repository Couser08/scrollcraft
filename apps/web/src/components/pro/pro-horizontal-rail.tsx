'use client';

/**
 * ScrollCraft Pro: Horizontal Pinned Rail
 * Translates vertical scroll progress into buttery horizontal rail motion.
 * Strictly under 650 LOC.
 */

import React from 'react';
import { usePin } from '@scrollcraft/react';

export interface HorizontalRailItem {
  id: string;
  title: string;
  category: string;
  gradient: string;
}

export const ProHorizontalRail: React.FC<{ items: HorizontalRailItem[] }> = ({ items }) => {
  const [progress, setProgress] = React.useState(0);
  const pin = usePin<HTMLDivElement>({
    duration: 1200,
    onProgress: (p) => setProgress(p),
  });

  // Map progress (0 to 1) to horizontal translation percentage (-60%)
  const translateX = -(progress * 60);

  return (
    <div className="relative w-full min-h-[1400px] flex flex-col justify-start py-16 px-6 sm:px-12 overflow-hidden">
      <div ref={pin.ref} className="w-full flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 max-w-7xl mx-auto w-full">
          <div>
            <span className="text-blue-400 font-mono text-xs font-semibold uppercase tracking-wider">
              ScrollCraft Pro Gallery
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-1">
              Pinned Horizontal Flow
            </h2>
          </div>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-xs">
            Scroll down to watch vertical scroll scrub dynamically translate to smooth horizontal motion.
          </p>
        </div>

        {/* The Sliding Horizontal Rail */}
        <div className="w-full overflow-visible py-4">
          <div
            className="flex gap-6 transition-transform duration-75 ease-out"
            style={{
              transform: `translate3d(${translateX}%, 0px, 0px)`,
            }}
          >
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="w-72 sm:w-88 h-96 rounded-3xl p-8 flex flex-col justify-between shrink-0 border border-white/10 shadow-2xl relative overflow-hidden"
                style={{
                  background: item.gradient,
                }}
              >
                <span className="font-mono text-xs text-white/70 uppercase">
                  0{idx + 1} // {item.category}
                </span>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white leading-tight">
                    {item.title}
                  </h3>
                  <div className="w-8 h-1 rounded-full bg-white/40" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
