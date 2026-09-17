'use client';

/**
 * <ScrollDraw> Declarative SVG Animation Primitive
 * Drives strokeDashoffset in sync with scroll progress.
 * Supports universal SVG geometry (<path>, <circle>, <rect>, <line>, <polygon>).
 * Strictly under 650 LOC.
 */

import React from 'react';
import { Slot, composeRefs } from '../slot';
import { useScrollDraw } from '../hooks/useScrollDraw';
import { ScrollDrawOptions } from '../types';

export interface ScrollDrawProps
  extends Omit<React.SVGAttributes<SVGGeometryElement>, 'direction' | 'end'>,
    ScrollDrawOptions {
  asChild?: boolean;
}

export const ScrollDraw = React.forwardRef<SVGGeometryElement, ScrollDrawProps>(
  (
    {
      asChild,
      id,
      markers,
      start,
      end,
      scrub,
      direction,
      dashArray,
      onDrawProgress,
      respectReducedMotion,
      children,
      ...props
    },
    forwardedRef
  ) => {
    const internalRef = useScrollDraw<SVGGeometryElement>({
      id,
      markers,
      start,
      end: typeof end === 'number' ? `${end}px` : end,
      scrub,
      direction,
      dashArray,
      onDrawProgress,
      respectReducedMotion,
    });
    const mergedRef = composeRefs(forwardedRef, internalRef);

    if (asChild) {
      return (
        <Slot ref={mergedRef as any} {...(props as any)}>
          {children}
        </Slot>
      );
    }

    return (
      <path ref={mergedRef as React.Ref<SVGPathElement>} {...(props as React.SVGAttributes<SVGPathElement>)}>
        {children}
      </path>
    );
  }
);

ScrollDraw.displayName = 'ScrollDraw';
