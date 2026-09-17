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
      duration,
      trackState,
      disableTransform,
      onProgress,
      pinSpacing,
      onEnter,
      onLeave,
      onEnterBack,
      onLeaveBack,
      progressValue,
      height,
      children,
      style,
      className,
      ...domProps
    } = props;

    const internalRef = useRef<HTMLElement | null>(null);

    usePin(internalRef, {
      top,
      bottom,
      duration,
      trackState,
      disableTransform,
      onProgress,
      pinSpacing,
      onEnter,
      onLeave,
      onEnterBack,
      onLeaveBack,
      progressValue,
    });

    const mergedRef = composeRefs(forwardedRef, internalRef);

    const combinedStyle: React.CSSProperties = {
      position: 'sticky',
      top: typeof top === 'number' ? `${top}px` : top,
      ...style,
    };

    const pinnedNode = asChild ? (
      <Slot ref={mergedRef} style={combinedStyle} className={className} {...domProps}>
        {children}
      </Slot>
    ) : (
      <div ref={mergedRef as React.Ref<HTMLDivElement>} style={combinedStyle} className={className} {...domProps}>
        {children}
      </div>
    );

    if (height !== undefined) {
      const resolvedHeight = typeof height === 'number' ? `${height}px` : height;
      return (
        <div style={{ position: 'relative', minHeight: resolvedHeight }}>
          {pinnedNode}
        </div>
      );
    }

    return pinnedNode;
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
