'use client';

import React, { useRef } from 'react';
import { Slot, composeRefs } from '../slot';
import { useMagnetic } from '../hooks/useMagnetic';
import type { MagneticOptions } from '../types';

export interface MagneticProps extends React.HTMLAttributes<HTMLElement>, MagneticOptions {
  children: React.ReactNode;
  asChild?: boolean;
}

export const Magnetic = React.forwardRef<HTMLElement, MagneticProps>(
  ({ children, asChild, strength, radius, stiffness, damping, scale, innerTargetRef, innerStrength, respectReducedMotion, ...props }, forwardedRef) => {
    const internalRef = useRef<HTMLElement | null>(null);
    useMagnetic(internalRef, { strength, radius, stiffness, damping, scale, innerTargetRef, innerStrength, respectReducedMotion });
    
    const Comp = asChild ? Slot : 'div';
    const mergedRef = composeRefs(forwardedRef, internalRef);

    return (
      <Comp
        ref={mergedRef}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Magnetic.displayName = 'Magnetic';
