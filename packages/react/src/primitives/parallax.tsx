'use client';

/**
 * <Parallax> Declarative Primitive
 * Supports asChild composition with bespoke Slot and direct GPU translate3d.
 * Strictly under 650 LOC.
 */

import React, { forwardRef, useRef } from 'react';
import { Slot, composeRefs } from '../slot';
import { useParallax } from '../hooks/useParallax';
import { ParallaxProps } from '../types';

export const Parallax = React.memo(
  forwardRef<HTMLElement, ParallaxProps>((props, forwardedRef) => {
    const {
      asChild = false,
      speed = 0.2,
      direction = 'vertical',
      min,
      max,
      respectReducedMotion = true,
      children,
      ...domProps
    } = props;

    const internalRef = useRef<HTMLElement | null>(null);

    useParallax(internalRef, {
      speed,
      direction,
      min,
      max,
      respectReducedMotion,
    });

    const mergedRef = composeRefs(forwardedRef, internalRef);

    if (asChild) {
      return (
        <Slot ref={mergedRef} {...domProps}>
          {children}
        </Slot>
      );
    }

    return (
      <div ref={mergedRef as React.Ref<HTMLDivElement>} {...domProps}>
        {children}
      </div>
    );
  })
);

Parallax.displayName = 'Parallax';
