'use client';

import React from 'react';
import { Slot, composeRefs } from '../slot';
import { useScrollTransform } from '../hooks/useScrollTransform';
import { TransformSolverOptions } from '@scrollcraft/core';

export interface ScrollTransformProps extends React.HTMLAttributes<HTMLDivElement>, Omit<TransformSolverOptions, 'onSnap'> {
  asChild?: boolean;
}

export const ScrollTransform = React.forwardRef<HTMLDivElement, ScrollTransformProps>(
  ({ asChild, start, end, properties, scrub, snap, children, ...props }, forwardedRef) => {
    const internalRef = useScrollTransform<HTMLDivElement>({ start, end, properties, scrub, snap });
    const mergedRef = composeRefs(forwardedRef, internalRef);

    if (asChild) {
      return (
        <Slot ref={mergedRef} {...props}>
          {children}
        </Slot>
      );
    }

    return (
      <div ref={mergedRef as React.Ref<HTMLDivElement>} {...props}>
        {children}
      </div>
    );
  }
);

ScrollTransform.displayName = 'ScrollTransform';
