/**
 * Documentation Navigation & Content Architecture
 * Strictly under 650 LOC.
 */

import { PropRow } from './docs-table';

export interface DocSection {
  id: string;
  title: string;
  category: string;
  description: string;
  snippet?: string;
  props?: PropRow[];
  details?: string[];
  subsections?: { id: string; title: string }[];
}

export interface DocCategory {
  id: string;
  title: string;
  items: { id: string; title: string; badge?: string }[];
}

export const DOCS_CATEGORIES: DocCategory[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    items: [
      { id: 'introduction', title: 'Introduction' },
      { id: 'installation', title: 'Installation' },
      { id: 'setup', title: 'Next.js App Router Setup' },
    ],
  },
  {
    id: 'primitives',
    title: 'Core Primitives',
    items: [
      { id: 'parallax', title: '<Parallax />', badge: 'Slot' },
      { id: 'reveal', title: '<Reveal />', badge: 'Slot' },
      { id: 'pin', title: '<Pin />', badge: 'Sticky' },
      { id: 'scroll-progress', title: '<ScrollProgress />', badge: 'Slot' },
    ],
  },
  {
    id: 'hooks',
    title: 'Reactive Hooks',
    items: [
      { id: 'use-scroll-state', title: 'useScrollState', badge: '0-rerender' },
      { id: 'use-scrollcraft', title: 'useScrollCraft', badge: 'Core' },
      { id: 'use-parallax', title: 'useParallax', badge: 'Headless' },
      { id: 'use-reveal', title: 'useReveal', badge: 'Headless' },
    ],
  },
  {
    id: 'architecture',
    title: 'Architecture & Perf',
    items: [
      { id: 'three-phase-ticker', title: '3-Phase Ticker' },
      { id: 'reduced-motion', title: 'Reduced Motion (A11y)' },
      { id: 'benchmark', title: 'Engine Comparison' },
    ],
  },
];

export const PARALLAX_PROPS: PropRow[] = [
  {
    name: 'asChild',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'When true, renders children directly using Radix-style Slot composition. No extraneous wrapper <div> is injected into the DOM.',
  },
  {
    name: 'speed',
    type: 'number',
    defaultValue: '0.2',
    description:
      'Parallax intensity multiplier. Positive values lag behind natural scroll; negative values scroll faster.',
  },
  {
    name: 'direction',
    type: "'vertical' | 'horizontal'",
    defaultValue: "'vertical'",
    description:
      'Axis of displacement. Vertical modifies translateY; horizontal modifies translateX.',
  },
  {
    name: 'clamp',
    type: '[number, number]',
    defaultValue: 'undefined',
    description:
      'Optional min/max displacement boundaries in pixels [min, max] to prevent excessive drift.',
  },
  {
    name: 'className',
    type: 'string',
    defaultValue: "''",
    description: 'CSS class names merged cleanly onto the element or child component.',
  },
];

export const REVEAL_PROPS: PropRow[] = [
  {
    name: 'asChild',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'When true, delegates ref and transition inline styles to the immediate child element.',
  },
  {
    name: 'variant',
    type: "'fade' | 'slide-up' | 'slide-down' | 'scale' | 'blur'",
    defaultValue: "'slide-up'",
    description: 'Transition animation variant applied upon intersecting viewport trigger.',
  },
  {
    name: 'threshold',
    type: 'number',
    defaultValue: '0.15',
    description:
      'Intersection ratio threshold (0.0 to 1.0) before triggering entry animation.',
  },
  {
    name: 'duration',
    type: 'number',
    defaultValue: '0.6',
    description: 'Animation duration in seconds.',
  },
  {
    name: 'delay',
    type: 'number',
    defaultValue: '0',
    description: 'Stagger or sequence delay in seconds before triggering transition.',
  },
  {
    name: 'once',
    type: 'boolean',
    defaultValue: 'true',
    description: 'Whether to fire transition only once upon entering view.',
  },
];

export const PIN_PROPS: PropRow[] = [
  {
    name: 'asChild',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Renders child directly into the pinning container.',
  },
  {
    name: 'pinSpacing',
    type: 'boolean',
    defaultValue: 'true',
    description:
      'When true, injects spacer height so content following the pinned card does not overlap prematurely.',
  },
  {
    name: 'start',
    type: 'string | number',
    defaultValue: "'top top'",
    description:
      'Viewport intersection trigger point where sticky pin locks in place.',
  },
  {
    name: 'end',
    type: 'string | number',
    defaultValue: "'+=100%'",
    description:
      'Scroll distance duration through which the element remains pinned.',
  },
];

export const SCROLL_PROGRESS_PROPS: PropRow[] = [
  {
    name: 'asChild',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Passes normalized progress scaleX / width directly to child.',
  },
  {
    name: 'targetRef',
    type: 'RefObject<HTMLElement>',
    defaultValue: 'undefined',
    description:
      'Optional specific container element. If omitted, tracks entire document scroll progress (0.0 to 1.0).',
  },
  {
    name: 'axis',
    type: "'y' | 'x'",
    defaultValue: "'y'",
    description: 'Scroll orientation axis to calculate completion percentage for.',
  },
];

export const PROVIDER_PROPS: PropRow[] = [
  {
    name: 'smooth',
    type: 'boolean | InertiaConfig',
    defaultValue: 'true',
    description:
      'Enables Lenis inertia scroll wrap. Can pass custom lerp, duration, and orientation configuration.',
  },
  {
    name: 'respectReducedMotion',
    type: 'boolean',
    defaultValue: 'true',
    description:
      'Automatically disables inertia and collapses transitions if user OS prefers-reduced-motion is active.',
  },
  {
    name: 'autoResetOnRouteChange',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Opt-in parameter to reset scroll offset to 0 upon Next.js App Router route transitions.',
  },
  {
    name: 'autoRecalc',
    type: 'boolean',
    defaultValue: 'true',
    description:
      'Watches document body with ResizeObserver and document.fonts.ready to recalculate scroll bounds dynamically.',
  },
];
