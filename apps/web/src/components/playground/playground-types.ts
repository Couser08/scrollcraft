/**
 * Playground Studio Types and Configurations
 * Designed for high-performance tuning of @scrollcraft/react.
 */

export type ShowcaseId =
  | 'hero-parallax'
  | 'reveal-stagger'
  | 'velocity-marquee'
  | 'magnetic-card';

export type PlaygroundVibe =
  | 'apple-smooth'
  | 'snappy'
  | 'elastic'
  | 'velvet';

export type PlaygroundMode = 'solo' | 'showdown';

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export interface PlaygroundConfig {
  showcaseId: ShowcaseId;
  vibe: PlaygroundVibe;
  speed: number;
  distance: number;
  duration: number;
  direction: 'vertical' | 'horizontal' | 'up' | 'down' | 'left' | 'right';
  easing: 'easeOut' | 'easeInOut' | 'spring' | 'linear';
  stiffness: number;
  damping: number;
  mass: number;
  scrub: boolean;
  respectReducedMotion: boolean;
  willChange: boolean;
}

export interface VibePreset {
  id: PlaygroundVibe;
  label: string;
  description: string;
  badge: string;
  config: Partial<PlaygroundConfig>;
}

export const VIBE_PRESETS: VibePreset[] = [
  {
    id: 'apple-smooth',
    label: 'Apple-Smooth',
    description: 'Refined, deceleration-heavy fluid momentum favored by Cupertino landing pages.',
    badge: '60 FPS Pure Silk',
    config: {
      speed: 0.25,
      duration: 0.8,
      stiffness: 140,
      damping: 24,
      mass: 1.0,
      easing: 'easeOut',
      scrub: true,
    },
  },
  {
    id: 'snappy',
    label: 'Snappy',
    description: 'Ultra-responsive, instant tactile feedback with minimal overshoot.',
    badge: 'Immediate Response',
    config: {
      speed: 0.45,
      duration: 0.4,
      stiffness: 300,
      damping: 28,
      mass: 0.8,
      easing: 'spring',
      scrub: false,
    },
  },
  {
    id: 'elastic',
    label: 'Elastic Bounce',
    description: 'Playful kinetic spring with deliberate, pleasant settling oscillations.',
    badge: 'Kinetic Physics',
    config: {
      speed: 0.35,
      duration: 1.0,
      stiffness: 220,
      damping: 12,
      mass: 1.2,
      easing: 'spring',
      scrub: false,
    },
  },
  {
    id: 'velvet',
    label: 'Velvet Scrub',
    description: 'Cinematic inertia with deep damping for buttery scrub-driven timelines.',
    badge: 'Subpixel Inertia',
    config: {
      speed: 0.15,
      duration: 1.2,
      stiffness: 90,
      damping: 20,
      mass: 1.5,
      easing: 'easeInOut',
      scrub: true,
    },
  },
];

export interface ShowcaseMetadata {
  id: ShowcaseId;
  title: string;
  category: string;
  description: string;
  cliCommand: string;
  defaultConfig: PlaygroundConfig;
}

export const SHOWCASES: ShowcaseMetadata[] = [
  {
    id: 'hero-parallax',
    title: 'Hero Parallax',
    category: 'Depth & Layers',
    description: 'Direct GPU translate3d layer separation with zero DOM layout thrashing.',
    cliCommand: 'npx scrollcraft add parallax',
    defaultConfig: {
      showcaseId: 'hero-parallax',
      vibe: 'apple-smooth',
      speed: 0.25,
      distance: 60,
      duration: 0.8,
      direction: 'vertical',
      easing: 'easeOut',
      stiffness: 140,
      damping: 24,
      mass: 1.0,
      scrub: true,
      respectReducedMotion: true,
      willChange: true,
    },
  },
  {
    id: 'reveal-stagger',
    title: 'Reveal & Stagger',
    category: 'Entrance Physics',
    description: 'Intersection-driven smooth reveal with composited opacity and transform steps.',
    cliCommand: 'npx scrollcraft add reveal',
    defaultConfig: {
      showcaseId: 'reveal-stagger',
      vibe: 'snappy',
      speed: 0.3,
      distance: 40,
      duration: 0.55,
      direction: 'up',
      easing: 'easeOut',
      stiffness: 240,
      damping: 26,
      mass: 0.9,
      scrub: false,
      respectReducedMotion: true,
      willChange: true,
    },
  },
  {
    id: 'velocity-marquee',
    title: 'Velocity Marquee',
    category: 'Kinetic Momentum',
    description: 'Infinite continuous marquee accelerated dynamically by user scroll velocity.',
    cliCommand: 'npx scrollcraft add marquee',
    defaultConfig: {
      showcaseId: 'velocity-marquee',
      vibe: 'velvet',
      speed: 0.5,
      distance: 50,
      duration: 1.0,
      direction: 'left',
      easing: 'linear',
      stiffness: 100,
      damping: 20,
      mass: 1.0,
      scrub: true,
      respectReducedMotion: true,
      willChange: true,
    },
  },
  {
    id: 'magnetic-card',
    title: 'Magnetic Card',
    category: 'Micro-Interactions',
    description: 'Zero-rerender pointer magnetic attraction powered by subpixel springStep physics.',
    cliCommand: 'npx scrollcraft add magnetic',
    defaultConfig: {
      showcaseId: 'magnetic-card',
      vibe: 'elastic',
      speed: 0.35,
      distance: 30,
      duration: 0.6,
      direction: 'vertical',
      easing: 'spring',
      stiffness: 220,
      damping: 14,
      mass: 1.0,
      scrub: false,
      respectReducedMotion: true,
      willChange: true,
    },
  },
];
