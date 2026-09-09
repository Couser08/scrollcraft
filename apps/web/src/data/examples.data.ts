/**
 * Examples Page Data Specifications
 * Strictly decoupled from UI. Strictly under 650 LOC.
 */

export interface ExampleItem {
  id: string;
  number: string;
  title: string;
  description: string;
  category: string;
  subtag: string;
  image: string;
  codeSnippet: string;
  playgroundPreset: string;
}

export interface ExampleCategory {
  id: string;
  label: string;
  count: number;
}

export const EXAMPLE_CATEGORIES: ExampleCategory[] = [
  { id: 'all', label: 'All Examples', count: 24 },
  { id: 'scroll', label: 'Scroll Animations', count: 8 },
  { id: 'text', label: 'Text & Typography', count: 5 },
  { id: 'media', label: 'Image & Media', count: 5 },
  { id: 'layout', label: 'Layout & UI', count: 4 },
  { id: 'creative', label: 'Creative', count: 4 },
  { id: 'interactions', label: 'Interactions', count: 3 },
];

export const EXAMPLES_LIST: ExampleItem[] = [
  {
    id: 'hero-reveal',
    number: '01',
    title: 'Hero Reveal',
    description: 'Smooth hero section animation on scroll with subtle scale and y-displacement.',
    category: 'scroll',
    subtag: 'Hero',
    image: '/images/example-hero.jpg',
    playgroundPreset: 'hero-reveal',
    codeSnippet: `import { scrollCraft } from 'scroll-craft';

// 01 Hero Reveal Animation
scrollCraft({
  target: '.hero-container',
  animate: {
    y: [60, 0],
    opacity: [0, 1],
    scale: [0.96, 1],
  },
  trigger: {
    start: 'top 80%',
    end: 'top 20%',
    scrub: true,
  }
});`,
  },
  {
    id: 'staggered-text',
    number: '02',
    title: 'Staggered Text',
    description: 'Beautiful staggered text animations with sequential word reveals.',
    category: 'text',
    subtag: 'Stagger',
    image: '/images/example-stagger.jpg',
    playgroundPreset: 'staggered-text',
    codeSnippet: `import { scrollCraft } from 'scroll-craft';

// 02 Staggered Text Reveal
scrollCraft({
  target: '.split-word',
  animate: {
    y: [40, 0],
    opacity: [0, 1],
  },
  stagger: 0.08,
  duration: 0.8,
  easing: 'easeOut',
});`,
  },
  {
    id: 'parallax-gallery',
    number: '03',
    title: 'Parallax Gallery',
    description: 'Smooth multi-layer parallax effect with images moving at variable speeds.',
    category: 'media',
    subtag: 'Parallax',
    image: '/images/example-gallery.jpg',
    playgroundPreset: 'parallax-section',
    codeSnippet: `import { scrollCraft } from 'scroll-craft';

// 03 Multi-Layer Parallax
scrollCraft({
  target: '.parallax-layer-back',
  animate: { y: [-80, 80] },
  scrub: true,
});

scrollCraft({
  target: '.parallax-layer-front',
  animate: { y: [-160, 160] },
  scrub: true,
});`,
  },
  {
    id: 'scroll-fade',
    number: '04',
    title: 'Scroll Fade',
    description: 'Elements fade in gracefully as they enter the visible viewport.',
    category: 'layout',
    subtag: 'Fade',
    image: '/images/example-fade.jpg',
    playgroundPreset: 'hero-reveal',
    codeSnippet: `import { scrollCraft } from 'scroll-craft';

// 04 Clean Scroll Fade
scrollCraft({
  target: '.fade-card',
  animate: {
    opacity: [0, 1],
    y: [30, 0],
  },
  duration: 0.7,
  once: true,
});`,
  },
  {
    id: 'scale-on-scroll',
    number: '05',
    title: 'Scale on Scroll',
    description: 'Scale elements dynamically based on real-time scroll progress.',
    category: 'scroll',
    subtag: 'Scale',
    image: '/images/example-scale.jpg',
    playgroundPreset: 'scale-scroll',
    codeSnippet: `import { scrollCraft } from 'scroll-craft';

// 05 Continuous Scroll Scaling
scrollCraft({
  target: '.scale-target',
  animate: {
    scale: [0.85, 1.15],
    borderRadius: ['32px', '0px'],
  },
  scrub: true,
  start: 'top bottom',
  end: 'bottom top',
});`,
  },
  {
    id: 'horizontal-scroll',
    number: '06',
    title: 'Horizontal Scroll',
    description: 'Create horizontal scroll sections pinned smoothly to vertical scroll.',
    category: 'layout',
    subtag: 'Horizontal',
    image: '/images/example-horizontal.jpg',
    playgroundPreset: 'parallax-section',
    codeSnippet: `import { scrollCraft } from 'scroll-craft';

// 06 Pin & Horizontal Translation
scrollCraft({
  target: '.horizontal-track',
  pin: true,
  animate: {
    x: [0, -1800],
  },
  scrub: 1,
});`,
  },
  {
    id: '3d-transform',
    number: '07',
    title: '3D Transform',
    description: 'Add spatial depth with hardware-accelerated 3D scroll effects.',
    category: 'creative',
    subtag: '3D',
    image: '/images/example-3d.jpg',
    playgroundPreset: 'scale-scroll',
    codeSnippet: `import { scrollCraft } from 'scroll-craft';

// 07 3D Perspective Rotation
scrollCraft({
  target: '.card-3d',
  animate: {
    rotateX: [25, 0],
    rotateY: [-15, 0],
    perspective: 1000,
  },
  scrub: true,
});`,
  },
  {
    id: 'scroll-stats',
    number: '08',
    title: 'Scroll Triggered Stats',
    description: 'Animate metrics, numbers, and stats smoothly on trigger reach.',
    category: 'interactions',
    subtag: 'Numbers',
    image: '/images/example-stats.jpg',
    playgroundPreset: 'staggered-text',
    codeSnippet: `import { scrollCraft } from 'scroll-craft';

// 08 Number & Stats Counter
scrollCraft({
  target: '.stat-counter',
  animate: {
    count: [0, 98.4],
    opacity: [0, 1],
  },
  duration: 1.2,
  once: true,
});`,
  },
];
