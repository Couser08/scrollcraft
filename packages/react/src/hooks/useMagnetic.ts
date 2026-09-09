'use client';

/**
 * Magnetic Micro-Interaction Hook
 * Pulls elements toward cursor proximity and springs back softly on release.
 * Strictly under 650 LOC.
 */

import { useRef, useState, useCallback } from 'react';
import { useSpring } from './useSpring';

export interface MagneticOptions {
  strength?: number;
  radius?: number;
}

export function useMagnetic(options: MagneticOptions = {}) {
  const { strength = 0.35, radius = 120 } = options;
  const elementRef = useRef<HTMLElement | null>(null);

  const [targetX, setTargetX] = useState(0);
  const [targetY, setTargetY] = useState(0);

  const springX = useSpring(targetX, { stiffness: 220, damping: 16 });
  const springY = useSpring(targetY, { stiffness: 220, damping: 16 });

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!elementRef.current) return;
      const rect = elementRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance < radius) {
        setTargetX(deltaX * strength);
        setTargetY(deltaY * strength);
      } else {
        setTargetX(0);
        setTargetY(0);
      }
    },
    [strength, radius]
  );

  const onMouseLeave = useCallback(() => {
    setTargetX(0);
    setTargetY(0);
  }, []);

  return {
    ref: elementRef,
    style: {
      transform: `translate3d(${springX}px, ${springY}px, 0)`,
      transition: 'none',
    },
    bind: {
      onMouseMove,
      onMouseLeave,
    },
  };
}
