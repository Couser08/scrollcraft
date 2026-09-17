'use client';

/**
 * 120 FPS High-Performance Stacked Cards Primitive
 *
 * Architectural Driver Classification:
 * STRICTLY JS/TICKER-DRIVEN SOLVER.
 * Dynamic sibling z-index depth scaling, variable individual card offsetHeight
 * measurements, and dynamic runtime pointer-events gating cannot be expressed in
 * static CSS scroll-driven keyframes (animation-timeline).
 *
 * Strictly under 650 LOC.
 */

import React, { forwardRef, useRef, useEffect } from 'react';
import { StackedCardsSolver, ticker, GlobalResizeManager } from '@scrollcraft/core';
import { useScrollCraft } from '../context';
import { composeRefs } from '../slot';
import { StackedCardsProps } from '../types';

export type { StackedCardsProps };

export const StackedCards = React.memo(
  forwardRef<HTMLDivElement, StackedCardsProps>((props, forwardedRef) => {
    const {
      cards,
      className = '',
      offset = 40,
      top = 100,
      scaleStep = 0.05,
      minScale = 0.8,
      cardDistance = 400,
      height,
      style,
      ...domProps
    } = props;

    const internalRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const { engine } = useScrollCraft();

    const resolvedHeight =
      height !== undefined
        ? typeof height === 'number'
          ? `${height}px`
          : height
        : `${Math.max(cards.length * (cardDistance + 350) + 800, 1600)}px`;

    useEffect(() => {
      const container = internalRef.current;
      const cardElements = cardRefs.current.filter(Boolean) as HTMLElement[];

      if (!container || cardElements.length === 0) return;

      const solver = new StackedCardsSolver(container, cardElements, {
        offset,
        top,
        scaleStep,
        minScale,
        cardDistance,
      });

      const taskId = `stacked-cards-${Math.random().toString(36).slice(2, 8)}`;

      const measure = () => solver.measure();
      const unobserve = GlobalResizeManager.observe(container, measure);

      ticker.add(taskId, 'update', () => {
        const scrollY = engine?.getMetrics().scroll ?? (window.scrollY || window.pageYOffset);
        solver.update(scrollY);
      });

      ticker.add(taskId, 'render', () => {
        solver.render();
      });

      return () => {
        unobserve();
        ticker.remove(taskId);
        solver.destroy();
        cardRefs.current = [];
      };
    }, [cards.length, offset, top, scaleStep, minScale, cardDistance, engine]);

    const mergedRef = composeRefs(forwardedRef, internalRef);

    return (
      <div
        ref={mergedRef}
        className={`relative w-full ${className}`}
        style={{ position: 'relative', minHeight: resolvedHeight, ...style }}
        {...domProps}
      >
        {cards.map((card, index) => (
          <div
            key={index}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className="w-full origin-top sticky"
            style={{
              top: `${top + index * offset}px`,
              zIndex: index + 1,
              marginBottom: index < cards.length - 1 ? `${cardDistance}px` : '0px',
            }}
          >
            {card}
          </div>
        ))}
      </div>
    );
  })
);

StackedCards.displayName = 'StackedCards';
