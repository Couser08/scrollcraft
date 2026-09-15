'use client';

import React, { useRef, useEffect } from 'react';
import { HorizontalScrollSolver, HorizontalScrollOptions, ticker, GlobalResizeManager } from '@scrollcraft/core';
import { useScrollCraft } from '../context';

export interface HorizontalScrollProps extends React.HTMLAttributes<HTMLDivElement>, HorizontalScrollOptions {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  stickyClassName?: string;
}

export const HorizontalScroll: React.FC<HorizontalScrollProps> = ({
  children,
  className = '',
  innerClassName = '',
  stickyClassName = 'sticky top-0 h-screen w-full overflow-hidden flex items-center',
  speed,
  driver,
  style,
  ...domProps
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { engine } = useScrollCraft();

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const solver = new HorizontalScrollSolver(container, track, { speed, driver });
    const taskId = `horizontal-${Math.random().toString(36).slice(2, 8)}`;

    let isMounted = true;
    const measure = () => {
      if (isMounted) solver.measure();
    };
    const unobserveResize = GlobalResizeManager.observe(container, measure);
    requestAnimationFrame(() => measure());

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
  }, [speed, driver, engine]);

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full ${className}`}
      // Multiply height by speed to create scrollable space. Assuming speed is multiplier of 100vh.
      style={{
        ...style,
        height: `${(speed ?? 2) * 100}vh`,
      }}
      {...domProps}
    >
      <div className={stickyClassName}>
        <div ref={trackRef} className={`flex flex-nowrap w-max ${innerClassName}`}>
          {children}
        </div>
      </div>
    </div>
  );
};
