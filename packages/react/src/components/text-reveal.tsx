'use client';

import React, { forwardRef, useRef, useEffect, useMemo } from 'react';
import { GlobalResizeManager, TextRevealSolver, ticker } from '@scrollcraft/core';
import { useScrollCraft } from '../context';
import { composeRefs } from '../slot';
import { TextRevealProps } from '../types';

export type { TextRevealProps };

export const TextReveal = React.memo(
  forwardRef<HTMLParagraphElement, TextRevealProps>((props, forwardedRef) => {
    const {
      children,
      className = '',
      by = 'chars',
      range,
      blur,
      scale,
      rotateX,
      rotateY,
      slide,
      ...domProps
    } = props;

    const [rangeStart = 0, rangeEnd = 1] = range ?? [];
    const internalRef = useRef<HTMLParagraphElement>(null);
    const targetsRef = useRef<(HTMLSpanElement | null)[]>([]);
    const { engine } = useScrollCraft();

    // Split words and characters with memoization
    const { wordGroups, totalTargets } = useMemo(() => {
      const words = children.split(' ');
      if (by === 'words') {
        return {
          wordGroups: words.map((word, index) => ({
            word,
            chars: [] as Array<{ char: string; index: number }>,
            wordIndex: index,
          })),
          totalTargets: words.length,
        };
      }

      let charCounter = 0;
      const groups = words.map((word, wIdx) => {
        const chars = word.split('').map((char) => ({
          char,
          index: charCounter++,
        }));
        return {
          word,
          chars,
          wordIndex: wIdx,
        };
      });

      return {
        wordGroups: groups,
        totalTargets: charCounter,
      };
    }, [children, by]);

    useEffect(() => {
      const container = internalRef.current;
      const targets = targetsRef.current.filter(Boolean) as HTMLElement[];

      if (!container || targets.length === 0) return;

      // Hydration takeover: Cancel CSS keyframe fallback race condition immediately
      container.classList.remove('sc-reveal-css-fallback');

      const solver = new TextRevealSolver(container, targets, {
        range: [rangeStart, rangeEnd],
        blur,
        scale,
        rotateX,
        rotateY,
        slide,
      });

      const taskId = `text-reveal-${Math.random().toString(36).slice(2, 8)}`;

      const measure = () => solver.measure();
      const unobserve = GlobalResizeManager.observe(container, measure);

      ticker.add(`${taskId}-update`, 'update', () => {
        const scrollY = engine?.getMetrics().scroll ?? (window.scrollY || window.pageYOffset);
        const wh = window.innerHeight;
        solver.update(scrollY, wh);
      });

      ticker.add(`${taskId}-render`, 'render', () => {
        solver.render();
      });

      return () => {
        unobserve();
        ticker.remove(`${taskId}-update`);
        ticker.remove(`${taskId}-render`);
        solver.destroy();
        targetsRef.current = [];
      };
    }, [engine, rangeStart, rangeEnd, blur, scale, rotateX, rotateY, slide, totalTargets]);

    const mergedRef = composeRefs(forwardedRef, internalRef);

    return (
      <p
        ref={mergedRef}
        data-sc-reveal="pending"
        aria-label={children}
        className={`m-0 p-0 flex flex-wrap ${className}`}
        {...domProps}
      >
        <span aria-hidden="true" style={{ display: 'contents' }}>
          {by === 'words'
            ? wordGroups.map(({ word, wordIndex }, i) => (
                <React.Fragment key={wordIndex}>
                  <span
                    ref={(el) => {
                      targetsRef.current[wordIndex] = el;
                    }}
                    className="sc-word inline-block"
                    style={{ opacity: 0.1, display: 'inline-block' }}
                  >
                    {word}
                  </span>
                  {i < wordGroups.length - 1 && ' '}
                </React.Fragment>
              ))
            : wordGroups.map(({ chars, wordIndex }, i) => (
                <React.Fragment key={wordIndex}>
                  <span
                    className="sc-word-group inline-block"
                    style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
                  >
                    {chars.map(({ char, index }) => (
                      <span
                        key={index}
                        ref={(el) => {
                          targetsRef.current[index] = el;
                        }}
                        className="sc-char inline-block"
                        style={{
                          opacity: 0.1,
                          display: 'inline-block',
                          whiteSpace: char === ' ' ? 'pre' : 'normal',
                        }}
                      >
                        {char}
                      </span>
                    ))}
                  </span>
                  {i < wordGroups.length - 1 && ' '}
                </React.Fragment>
              ))}
        </span>
      </p>
    );
  })
);

TextReveal.displayName = 'TextReveal';
