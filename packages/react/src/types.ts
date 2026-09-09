/**
 * React & Next.js Type Definitions for ScrollCraft
 * Strictly under 650 LOC.
 */

import React from 'react';
import { InertiaConfig, ScrollMetrics, SpringConfig, ElementTransform } from '@scrollcraft/core';

export interface ScrollProviderProps {
  children: React.ReactNode;
  /** Whether to enable game-dev inertia smooth scrolling. Default: true */
  smooth?: boolean | Partial<InertiaConfig>;
}

export interface ScrollContextValue {
  metrics: ScrollMetrics;
  scrollTo: (y: number, immediate?: boolean) => void;
  isReady: boolean;
}

export interface ScrollElementProps extends React.HTMLAttributes<HTMLElement> {
  /** Enables scrubbed parallax movement on scroll */
  parallax?: number | { y?: number; x?: number; rotate?: number; scale?: number };
  /** Enables automatic pinning while in viewport */
  pin?: boolean;
  /** Spring physics config for micro-interactions */
  spring?: Partial<SpringConfig>;
  /** Enables magnetic pointer attraction on hover */
  magnetic?: boolean | { strength?: number; radius?: number };
  /** Direct transform config applied by compositor */
  transform?: ElementTransform;
  children?: React.ReactNode;
}
