'use client';

import React, { useRef, useEffect } from 'react';
import { SequenceSolver, SequenceOptions, ticker } from '@scrollcraft/core';
import { useScrollCraft } from '../context';

interface ScrollSequenceProps extends SequenceOptions {
  className?: string;
  height?: string; // e.g. '300vh' for scroll distance
}

export const ScrollSequence: React.FC<ScrollSequenceProps> = ({
  frames,
  speed,
  className = '',
  height = '300vh'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { engine } = useScrollCraft();

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || frames.length === 0) return;

    const solver = new SequenceSolver(canvas, container, { frames, speed });
    const taskId = `sequence-${Math.random().toString(36).slice(2, 8)}`;

    const measure = () => solver.measure();
    window.addEventListener('resize', measure, { passive: true });
    
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
  }, [frames, speed, engine]);

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full ${className}`}
      style={{ height }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-black">
        <canvas ref={canvasRef} className="w-full h-full object-cover" />
      </div>
    </div>
  );
};
