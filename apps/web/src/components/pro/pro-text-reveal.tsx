'use client';

/**
 * ScrollCraft Pro: Kinetic Word-by-Word Text Reveal
 * Words interpolate from dim opacity to crisp white as scroll progresses.
 * Strictly under 650 LOC.
 */

import React, { useRef } from 'react';
import { useScrollCraft } from '@scrollcraft/react';
import { clamp } from '@scrollcraft/core';

export const ProTextReveal: React.FC<{ text: string; className?: string }> = ({
  text,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { metrics } = useScrollCraft();
  const words = text.split(' ');

  // Calculate element progress relative to viewport
  const getWordOpacity = (index: number) => {
    if (typeof window === 'undefined' || !containerRef.current) return 0.2;
    const rect = containerRef.current.getBoundingClientRect();
    const windowH = window.innerHeight;

    // Relative scroll progress through container (0.0 when entering bottom, 1.0 when reaching middle)
    const elementProgress = clamp((windowH - rect.top) / (windowH * 0.7), 0, 1);

    const wordThreshold = index / words.length;
    return elementProgress >= wordThreshold ? 1 : 0.2;
  };

  return (
    <div
      ref={containerRef}
      className={`max-w-4xl mx-auto py-24 px-6 text-center select-none ${className}`}
    >
      <p className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-relaxed flex flex-wrap justify-center gap-x-3 gap-y-2">
        {words.map((word, idx) => {
          const opacity = getWordOpacity(idx);
          return (
            <span
              key={`${word}-${idx}`}
              className="transition-opacity duration-300"
              style={{
                opacity,
                color: opacity === 1 ? '#ffffff' : '#475569',
              }}
            >
              {word}
            </span>
          );
        })}
      </p>
    </div>
  );
};
