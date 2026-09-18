'use client';

/**
 * High-Performance Canvas Scroll Sequence Component
 *
 * Architectural Driver Classification:
 * STRICTLY JS/TICKER-DRIVEN COMPONENT.
 * HTML5 Canvas 2D frame drawing (ctx.drawImage) with LRU frame caching
 * cannot be bound to CSS animation-timeline.
 *
 * Strictly under 650 LOC.
 */

import React, { forwardRef, useRef, useEffect } from 'react';
import { SequenceSolver, ticker, GlobalResizeManager } from '@scrollcraft/core';
import { useScrollCraft } from '../context';
import { composeRefs } from '../slot';
import { ScrollSequenceProps } from '../types';

export type { ScrollSequenceProps };

export const ScrollSequence = React.memo(
  forwardRef<HTMLDivElement, ScrollSequenceProps>((props, forwardedRef) => {
    const {
      frames,
      speed,
      maxDpr,
      windowSize,
      className = '',
      height = '300vh',
      poster,
      children,
      style,
      ...domProps
    } = props;

    const internalRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { engine } = useScrollCraft();

    const framesKey = `${frames.length}:${frames[0] || ''}:${frames[frames.length - 1] || ''}`;
    const resolvedHeight = typeof height === 'number' ? `${height}px` : height;

    // Poster immediate preview
    useEffect(() => {
      if (!poster || !canvasRef.current) return;
      const canvas = canvasRef.current;
      const img = new Image();
      let active = true;

      img.onload = () => {
        if (!active) return;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const w = img.naturalWidth || canvas.clientWidth || 300;
          const h = img.naturalHeight || canvas.clientHeight || 150;
          canvas.width = w;
          canvas.height = h;
          ctx.drawImage(img, 0, 0, w, h);
        }
      };
      img.src = poster;

      return () => {
        active = false;
      };
    }, [poster]);

    useEffect(() => {
      const container = internalRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas || frames.length === 0) return;

      const solver = new SequenceSolver(canvas, container, {
        frames,
        speed,
        maxDpr,
        windowSize,
      });

      const taskId = `sequence-${Math.random().toString(36).slice(2, 8)}`;

      let isMounted = true;
      const measure = () => {
        if (isMounted) solver.measure();
      };
      const unobserveResize = GlobalResizeManager.observe(container, measure);

      ticker.add(taskId, 'update', () => {
        const scrollY = engine?.getMetrics().scroll ?? (window.scrollY || window.pageYOffset);
        solver.update(scrollY);
      });

      ticker.add(taskId, 'render', () => {
        solver.render();
      });

      return () => {
        isMounted = false;
        unobserveResize();
        ticker.remove(taskId);
        solver.destroy();
      };
    }, [framesKey, speed, maxDpr, windowSize, engine]);

    const mergedRef = composeRefs(forwardedRef, internalRef);

    return (
      <div
        ref={mergedRef}
        className={`relative w-full ${className}`}
        style={{ height: resolvedHeight, ...style }}
        {...domProps}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-black">
          <canvas ref={canvasRef} className="w-full h-full object-cover" />
          {children}
        </div>
      </div>
    );
  })
);

ScrollSequence.displayName = 'ScrollSequence';
