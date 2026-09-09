'use client';

/**
 * <ScrollProgress> Declarative Progress Bar Primitive
 * Subscribes directly to ScrollValue to update scaleX without React re-renders.
 * Strictly under 650 LOC.
 */

import React, { forwardRef, useEffect, useRef } from 'react';
import { Slot, composeRefs } from '../slot';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { ScrollProgressProps } from '../types';

export const ScrollProgress = React.memo(
  forwardRef<HTMLDivElement, ScrollProgressProps>((props, forwardedRef) => {
    const { asChild = false, style, children, ...domProps } = props;
    const internalRef = useRef<HTMLDivElement | null>(null);
    const { progressValue } = useScrollProgress();

    useEffect(() => {
      const node = internalRef.current;
      if (!node) return;

      node.style.transformOrigin = '0% 50%';
      node.style.willChange = 'transform';

      const unsubscribe = progressValue.subscribe((progress) => {
        if (internalRef.current) {
          internalRef.current.style.transform = `scaleX(${progress})`;
        }
      });

      return () => {
        unsubscribe();
        if (node) {
          node.style.willChange = '';
        }
      };
    }, [progressValue]);

    const mergedRef = composeRefs(forwardedRef, internalRef);

    if (asChild) {
      return (
        <Slot ref={mergedRef} style={style} {...domProps}>
          {children}
        </Slot>
      );
    }

    return (
      <div
        ref={mergedRef}
        style={{
          transform: `scaleX(${progressValue.get()})`,
          transformOrigin: '0% 50%',
          ...style,
        }}
        {...domProps}
      >
        {children}
      </div>
    );
  })
);

ScrollProgress.displayName = 'ScrollProgress';
