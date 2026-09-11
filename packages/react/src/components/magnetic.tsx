'use client';

import React from 'react';
import { Slot } from '../slot';
import { useMagnetic, MagneticOptions } from '../hooks/useMagnetic';

export interface MagneticProps extends React.HTMLAttributes<HTMLElement>, MagneticOptions {
  children: React.ReactNode;
  asChild?: boolean;
}

export const Magnetic = React.forwardRef<HTMLElement, MagneticProps>(
  ({ children, asChild, strength, radius, stiffness, damping, ...props }, forwardedRef) => {
    const { ref: magneticRef } = useMagnetic({ strength, radius, stiffness, damping });
    
    const Comp = asChild ? Slot : 'div';

    return (
      <Comp
        ref={(node: HTMLElement | null) => {
          magneticRef.current = node;
          if (typeof forwardedRef === 'function') {
            forwardedRef(node);
          } else if (forwardedRef) {
            forwardedRef.current = node;
          }
        }}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Magnetic.displayName = 'Magnetic';
