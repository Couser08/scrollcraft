/**
 * React & Next.js Type Definitions for ScrollCraft
 * Strictly under 650 LOC.
 */

import React from 'react';
import type {
  InertiaConfig,
  ScrollMetrics,
  SpringConfig,
  ElementTransform,
  InertiaEngine,
} from '@scrollcraft/core';

export type {
  InertiaConfig,
  ScrollMetrics,
  SpringConfig,
  ElementTransform,
  InertiaEngine,
};

export interface ScrollProviderProps {
  children: React.ReactNode;
  /** Whether to enable inertia smooth scrolling. Default: true */
  smooth?: boolean | Partial<InertiaConfig>;
  /**
   * @deprecated Framework-agnostic packages cannot reliably observe Next.js App Router
   * transitions. Call scrollTo(0) from your router transition instead.
   */
  autoResetOnRouteChange?: boolean;
  /**
   * Automatically recalculate scroll limits on body ResizeObserver & document.fonts.ready.
   * Default: true
   */
  autoRecalc?: boolean;
  /**
   * Disable smoothing and element transforms if user has prefers-reduced-motion: reduce.
   * Default: true
   */
  respectReducedMotion?: boolean;
}

export interface ScrollContextValue {
  engine: InertiaEngine | null;
  scrollTo: (
    target: number | string | HTMLElement,
    options?: {
      offset?: number;
      immediate?: boolean;
      duration?: number;
      easing?: (t: number) => number;
    }
  ) => void;
  resize: () => void;
  isReady: boolean;
  reducedMotion: boolean;
  getMetrics: () => ScrollMetrics;
  subscribe: (callback: (metrics: ScrollMetrics) => void) => () => void;
  /** Legacy metrics getter */
  metrics?: ScrollMetrics;
}

export interface ParallaxOptions {
  /** Speed multiplier: > 0 scrolls slower (deeper), < 0 scrolls faster. Default: 0.2 */
  speed?: number;
  /** Axis of parallax displacement: 'vertical' or 'horizontal'. Default: 'vertical' */
  direction?: 'vertical' | 'horizontal';
  /** Clamp lower bound displacement in pixels */
  min?: number;
  /** Clamp upper bound displacement in pixels */
  max?: number;
  /** Disable transform if prefers-reduced-motion is active. Default: true */
  respectReducedMotion?: boolean;
  /** Driver selection: 'js' (120 FPS direct composite writes), 'native' (CSS view-timeline), or 'auto' (default: 'js') */
  driver?: 'auto' | 'js' | 'native';
}

export interface ParallaxProps extends React.HTMLAttributes<HTMLElement>, ParallaxOptions {
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface RevealOptions {
  /** Entry slide direction. Default: 'up' */
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  /** Slide travel distance in pixels. Default: 32 */
  distance?: number;
  /** Duration in seconds. Default: 0.6 */
  duration?: number;
  /** Delay in seconds. Default: 0 */
  delay?: number;
  /** Viewport intersection ratio to trigger reveal. Default: 0.15 */
  threshold?: number;
  /** Whether to trigger reveal only once. Default: true */
  once?: boolean;
  /** Bypass slide/opacity if prefers-reduced-motion is active. Default: true */
  respectReducedMotion?: boolean;
}

export interface RevealProps extends React.HTMLAttributes<HTMLElement>, RevealOptions {
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface PinOptions {
  /** Top sticky offset in pixels. Default: 0 */
  top?: number;
  /** Bottom boundary offset */
  bottom?: number;
  /** Scroll duration / distance in pixels for pin travel track */
  duration?: number;
  /** Callback receiving normalized progress (0 to 1) while pinned */
  onProgress?: (progress: number) => void;
  /** Whether to trigger React state updates for progress and pinOffsetY. Default: false */
  trackState?: boolean;
  /** Disable writing translate3d transform (e.g. when using native CSS position: sticky). Default: false */
  disableTransform?: boolean;
}

export interface PinProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onProgress'>, PinOptions {
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface PinContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Height of scroll space to provide pin travel track. Default: '200vh' */
  height?: string | number;
  children?: React.ReactNode;
}

export interface ScrollProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface ScrollElementProps extends React.HTMLAttributes<HTMLElement> {
  parallax?: number | { y?: number; x?: number; rotate?: number; scale?: number };
  pin?: boolean;
  spring?: Partial<SpringConfig>;
  magnetic?: boolean | { strength?: number; radius?: number };
  transform?: ElementTransform;
  children?: React.ReactNode;
}
