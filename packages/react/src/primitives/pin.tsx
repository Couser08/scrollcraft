'use client';

/**
 * <Pin> and <PinContainer> Declarative Sticky Primitives
 * Provides robust native sticky positioning with progress tracking and scroll track helper.
 * Strictly under 650 LOC.
 */

import React, { forwardRef, useRef } from 'react';
import { Slot, composeRefs } from '../slot';
import { usePin } from '../hooks/usePin';
import { PinProps, PinContainerProps } from '../types';

export const Pin = React.memo(
  forwardRef<HTMLElement, PinProps>((props, forwardedRef) => {
    const {
      asChild = false,
      top = 0,
      bottom,
      onProgress,
      children,
      ...domProps
    } = props;

    const internalRef = useRef<HTMLElement | null>(null);

    usePin(internalRef, {
      top,
      bottom,
      onProgress,
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

Pin.displayName = 'Pin';

/**
 * Helper container to establish an explicit scroll track height for sticky Pin elements
 */
export const PinContainer = React.memo(
  forwardRef<HTMLDivElement, PinContainerProps>((props, ref) => {
    const { height = '200vh', style, className, children, ...domProps } = props;

    const resolvedHeight = typeof height === 'number' ? `${height}px` : height;

    return (
      <div
        ref={ref}
        className={className}
        style={{
          position: 'relative',
          minHeight: resolvedHeight,
          ...style,
        }}
        {...domProps}
      >
        {children}
      </div>
    );
  })
);

PinContainer.displayName = 'PinContainer';
