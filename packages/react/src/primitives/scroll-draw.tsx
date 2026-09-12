'use client';

import React from 'react';
import { Slot, composeRefs } from '../slot';
import { useScrollDraw } from '../hooks/useScrollDraw';
import { DrawSolverOptions } from '@scrollcraft/core';

export interface ScrollDrawProps extends Omit<React.SVGAttributes<SVGPathElement>, 'direction' | 'end'>, DrawSolverOptions {
  asChild?: boolean;
}

export const ScrollDraw = React.forwardRef<SVGPathElement, ScrollDrawProps>(
  ({ asChild, id, markers, start, end, scrub, direction, children, ...props }, forwardedRef) => {
    const internalRef = useScrollDraw<SVGPathElement>({ id, markers, start, end: typeof end === 'number' ? `${end}px` : end, scrub, direction });
    const mergedRef = composeRefs(forwardedRef, internalRef);

    if (asChild) {
      return (
        <Slot ref={mergedRef as any} {...(props as any)}>
          {children}
        </Slot>
      );
    }

    return (
      <path ref={mergedRef} {...props}>
        {children}
      </path>
    );
  }
);

ScrollDraw.displayName = 'ScrollDraw';
