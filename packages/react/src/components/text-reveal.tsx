'use client';

import React, { useRef, useEffect } from 'react';
import { GlobalResizeManager, TextRevealSolver, ticker } from '@scrollcraft/core';
import { useScrollCraft } from '../context';

export interface TextRevealProps {
  /** The text content to be split into letters */
  children: string;
  className?: string;
  /** Optional range to map the start/end progress of the reveal */
  range?: [number, number];
}

export const TextReveal: React.FC<TextRevealProps> = ({ 
  children, 
  className = '',
  range
}) => {
  const [rangeStart = 0, rangeEnd = 1] = range ?? [];
  const containerRef = useRef<HTMLParagraphElement>(null);
  const charsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const { engine } = useScrollCraft();

  useEffect(() => {
    const container = containerRef.current;
    // Filter out null refs
    const chars = charsRef.current.filter(Boolean) as HTMLElement[];
    
    if (!container || chars.length === 0) return;

    const solver = new TextRevealSolver(container, chars, { range: [rangeStart, rangeEnd] });
    const taskId = `text-reveal-${Math.random().toString(36).slice(2, 8)}`;

    const measure = () => solver.measure();
    const unobserve = GlobalResizeManager.observe(container, measure);
    ticker.add(`${taskId}-update`, 'update', () => {
      // Fallback to window native scroll if engine is still hydrating
      const scrollY = engine?.getMetrics().scroll ?? (window.scrollY || window.pageYOffset);
      const wh = window.innerHeight;
      solver.update(scrollY, wh);
    });
    ticker.add(`${taskId}-render`, 'render', () => solver.render());

    return () => {
      unobserve();
      ticker.remove(`${taskId}-update`);
      ticker.remove(`${taskId}-render`);
      solver.destroy();
    };
  }, [engine, rangeStart, rangeEnd]);

  // Splitting purely by letters as per current requirement
  const letters = children.split('');

  return (
    <p ref={containerRef} className={`m-0 p-0 flex flex-wrap ${className}`}>
      {letters.map((char, index) => (
        <span 
          key={index}
          ref={(el) => { charsRef.current[index] = el; }}
          className="char"
          style={{ opacity: 0.1, whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char}
        </span>
      ))}
    </p>
  );
};
