'use client';

/**
 * @scrollcraft/react - Public API Exports
 * React & Next.js-Native Scroll Toolkit
 * Strictly under 650 LOC.
 */

export * from './types';
export * from './context';
export * from './slot';
export * from './factory';

// Primitives
export * from './primitives/parallax';
export * from './primitives/reveal';
export * from './primitives/pin';
export * from './primitives/scroll-progress';

// High Performance Components
export * from './components/velocity-marquee';
export * from './components/horizontal-scroll';
export * from './components/scroll-sequence';

// Hooks
export * from './hooks/useParallax';
export * from './hooks/useReveal';
export * from './hooks/usePin';
export * from './hooks/useScrollProgress';
export * from './hooks/useScrollTransform';
export * from './hooks/useMagnetic';
export * from './hooks/useScrollTimeline';
