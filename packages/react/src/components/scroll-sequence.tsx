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
      fit = 'contain',
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
          const canvasWidth = canvas.clientWidth || 300;
          const canvasHeight = canvas.clientHeight || 150;
          const dpr = Math.min(window.devicePixelRatio || 1, maxDpr ?? 2);
          canvas.width = canvasWidth * dpr;
          canvas.height = canvasHeight * dpr;
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'medium';

          const imgRatio = w / h;
          const canvasRatio = canvasWidth / canvasHeight;
          let drawWidth: number;
          let drawHeight: number;
          let offsetX: number;
          let offsetY: number;

          if (fit === 'cover') {
            if (imgRatio > canvasRatio) {
              drawHeight = canvasHeight;
              drawWidth = w * (canvasHeight / h);
              offsetX = (canvasWidth - drawWidth) / 2;
              offsetY = 0;
            } else {
              drawWidth = canvasWidth;
              drawHeight = h * (canvasWidth / w);
              offsetX = 0;
              offsetY = (canvasHeight - drawHeight) / 2;
            }
          } else {
            // contain: preserve aspect ratio, fully centered, zero clipping
            if (imgRatio > canvasRatio) {
              drawWidth = canvasWidth;
              drawHeight = h * (canvasWidth / w);
              offsetX = 0;
              offsetY = (canvasHeight - drawHeight) / 2;
            } else {
              drawHeight = canvasHeight;
              drawWidth = w * (canvasHeight / h);
              offsetX = (canvasWidth - drawWidth) / 2;
              offsetY = 0;
            }
          }

          ctx.clearRect(0, 0, canvasWidth, canvasHeight);
          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        }
      };
      img.src = poster;

      return () => {
        active = false;
      };
    }, [poster, fit, maxDpr]);

    useEffect(() => {
      const container = internalRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas || frames.length === 0) return;

      const solver = new SequenceSolver(canvas, container, {
        frames,
        speed,
        maxDpr,
        windowSize,
        fit,
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
    }, [framesKey, speed, maxDpr, windowSize, fit, engine]);

    const mergedRef = composeRefs(forwardedRef, internalRef);

    return (
      <div
        ref={mergedRef}
        className={`relative w-full ${className}`}
        style={{ height: resolvedHeight, ...style }}
        {...domProps}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-black">
          <canvas
            ref={canvasRef}
            className={fit === 'cover' ? 'w-full h-full object-cover' : 'w-full h-full object-contain'}
          />
          {children}
        </div>
      </div>
    );
  })
);

ScrollSequence.displayName = 'ScrollSequence';
