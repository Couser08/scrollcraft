'use client';

import { useState, useEffect, useRef } from 'react';

export interface SpringConfig {
  stiffness?: number;
  damping?: number;
}

export function useSpring(targetValue: number, config: SpringConfig = {}): number {
  const [value, setValue] = useState(targetValue);
  const stiffness = config.stiffness ?? 200;
  const damping = config.damping ?? 15;

  const currentRef = useRef(targetValue);
  const velocityRef = useRef(0);
  const targetRef = useRef(targetValue);
  const rafRef = useRef<number | null>(null);

  targetRef.current = targetValue;

  useEffect(() => {
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.064);
      lastTime = now;

      // Spring formula: F = -k*(x - target) - c*v
      const displacement = currentRef.current - targetRef.current;
      const springForce = -stiffness * displacement;
      const dampingForce = -damping * velocityRef.current;
      const acceleration = springForce + dampingForce;

      velocityRef.current += acceleration * dt;
      currentRef.current += velocityRef.current * dt;

      setValue(currentRef.current);

      if (
        Math.abs(displacement) > 0.001 ||
        Math.abs(velocityRef.current) > 0.001
      ) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        currentRef.current = targetRef.current;
        setValue(targetRef.current);
        velocityRef.current = 0;
      }
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [targetValue, stiffness, damping]);

  return value;
}
