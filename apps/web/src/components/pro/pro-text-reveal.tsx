'use client';

/**
 * ScrollCraft Pro: Kinetic Word-by-Word Text Reveal
 * Words interpolate from dim opacity to crisp white as scroll progresses.
 * Zero layout thrashing: uses cached layout geometry and direct DOM updates.
 * Strictly under 650 LOC.
 */

import React, { useEffect, useRef } from 'react';
import { clamp, ticker } from '@scrollcraft/core';

export const ProTextReveal: React.FC<{ text: string; className?: string }> = ({
  text,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const words = text.split(' ');
  const taskIdRef = useRef<string>(`text-reveal-${Math.random().toString(36).slice(2, 8)}`);
  const cachedTopRef = useRef<number>(0);
  const wordSpansRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === 'undefined') return;

    wordSpansRef.current = Array.from(container.querySelectorAll<HTMLSpanElement>('[data-word-idx]'));

    const measure = () => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      cachedTopRef.current = rect.top + (window.scrollY || window.pageYOffset || 0);
    };

    measure();
    window.addEventListener('resize', measure, { passive: true });

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(measure);
      resizeObserver.observe(container);
    }

    const taskId = taskIdRef.current;
    let lastProgress = -1;

    ticker.add(taskId, 'render', () => {
      const windowH = window.innerHeight;
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const relativeTop = cachedTopRef.current - scrollY;
      const progress = clamp((windowH - relativeTop) / (windowH * 0.7), 0, 1);

      // Skip DOM updates if progress hasn't changed noticeably
      if (Math.abs(progress - lastProgress) < 0.005) return;
      lastProgress = progress;

      const spans = wordSpansRef.current;
      const total = spans.length;
      for (let i = 0; i < total; i++) {
        const threshold = i / total;
        const isActive = progress >= threshold;
        const span = spans[i];
        if (span) {
          span.style.opacity = isActive ? '1' : '0.25';
          span.style.color = isActive ? '#ffffff' : '#64748b';
        }
      }
    });

    return () => {
      window.removeEventListener('resize', measure);
      resizeObserver?.disconnect();
      ticker.remove(taskId);
    };
  }, [words.length]);

  return (
    <div
      ref={containerRef}
      className={`max-w-4xl mx-auto py-24 px-6 text-center select-none ${className}`}
    >
      <p className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-relaxed flex flex-wrap justify-center gap-x-3 gap-y-2">
        {words.map((word, idx) => (
          <span
            key={`${word}-${idx}`}
            data-word-idx={idx}
            className="transition-colors duration-200"
            style={{
              opacity: 1,
              color: '#ffffff',
            }}
          >
            {word}
          </span>
        ))}
      </p>
    </div>
  );
};
