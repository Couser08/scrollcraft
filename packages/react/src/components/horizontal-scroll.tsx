'use client';

import React, { useRef, useEffect } from 'react';
import { HorizontalScrollSolver, HorizontalScrollOptions, ticker } from '@scrollcraft/core';
import { useScrollCraft } from '../context';

interface HorizontalScrollProps extends HorizontalScrollOptions {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
}

export const HorizontalScroll: React.FC<HorizontalScrollProps> = ({
  children,
  className = '',
  innerClassName = '',
  speed
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { engine } = useScrollCraft();

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const solver = new HorizontalScrollSolver(container, track, { speed });
    const taskId = `horizontal-${Math.random().toString(36).slice(2, 8)}`;

    const measure = () => solver.measure();
    window.addEventListener('resize', measure, { passive: true });
    requestAnimationFrame(() => measure());

    ticker.add(taskId, 'update', () => {
      const scrollY = engine?.getMetrics().scroll ?? (window.scrollY || window.pageYOffset);
      solver.update(scrollY);
    });

    ticker.add(taskId, 'render', () => {
      solver.render();
    });

    return () => {
      window.removeEventListener('resize', measure);
      ticker.remove(taskId);
      solver.destroy();
    };
  }, [speed, engine]);

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full ${className}`}
      // Multiply height by speed to create scrollable space. Assuming speed is multiplier of 100vh.
      style={{ height: `${(speed ?? 2) * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
        <div ref={trackRef} className={`flex flex-nowrap w-max ${innerClassName}`}>
          {children}
        </div>
      </div>
    </div>
  );
};
