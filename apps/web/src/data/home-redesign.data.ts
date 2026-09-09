/**
 * ScrollCraft Home Page Redesign Data Specifications
 * Strictly decoupled from presentation. Strictly under 650 LOC.
 */

export interface HeroData {
  badge: string;
  headingPart1: string;
  headingPart2: string;
  headingHighlight: string;
  description: string;
  tags: { icon: string; label: string }[];
  code: string;
}

export interface FeatureCard {
  id: string;
  icon: 'leaf' | 'zap' | 'box' | 'sliders';
  title: string;
  description: string;
}

export interface ExampleCard {
  number: string;
  title: string;
  description: string;
  image: string;
}

export interface StepItem {
  number: number;
  title: string;
  description: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatar: string;
}

export const HERO_DATA: HeroData = {
  badge: 'A modern scroll animation library for the web',
  headingPart1: 'Animate',
  headingPart2: 'on Scroll,',
  headingHighlight: 'Beautifully.',
  description:
    'ScrollCraft makes it easy to create smooth, performant and stunning scroll-based animations — without the complexity. Built for modern web, designed for creators.',
  tags: [
    { icon: 'arrow', label: 'Lightweight' },
    { icon: 'zap', label: 'High Performance' },
    { icon: 'code', label: 'Framework Agnostic' },
  ],
  code: `import { scrollCraft } from 'scroll-craft'

scrollCraft({
  target: '.hero',
  animate: {
    y: [50, 0],
    opacity: [0, 1],
    scale: [0.95, 1],
  },
  scrub: true,
  once: false,
})`,
};

export const TRUSTED_BRANDS = [
  { name: 'Vercel', id: 'vercel' },
  { name: 'Tailwindcss', id: 'tailwind' },
  { name: 'Framer', id: 'framer' },
  { name: 'Notion', id: 'notion' },
  { name: 'Spotify', id: 'spotify' },
  { name: 'Linear', id: 'linear' },
];

export const WHY_SCROLLCRAFT_DATA = {
  badge: 'WHY SCROLLCRAFT',
  headline: 'Powerful. Simple. Flexible.',
  subtitle: 'Everything you need to create stunning scroll experiences, without the hassle.',
  features: [
    {
      id: 'easy-to-use',
      icon: 'leaf',
      title: 'Easy to Use',
      description: 'Beautiful animations with just a few lines of code.',
    },
    {
      id: 'high-performance',
      icon: 'zap',
      title: 'High Performance',
      description: 'Built with modern standards for smooth 60fps experiences.',
    },
    {
      id: 'framework-agnostic',
      icon: 'box',
      title: 'Framework Agnostic',
      description: 'Works with React, Vue, Next.js, or plain JavaScript — your choice.',
    },
    {
      id: 'highly-customizable',
      icon: 'sliders',
      title: 'Highly Customizable',
      description: 'Fine-tune every detail and create unique experiences.',
    },
  ] as FeatureCard[],
};

export const EXAMPLES_DATA = {
  badge: 'SEE IT IN ACTION',
  headlinePart1: 'Stunning ',
  headlineHighlight: 'Examples.',
  subtitle: 'Explore a collection of interactive examples and see what you can build with ScrollCraft.',
  items: [
    {
      number: '01',
      title: 'Hero Reveal',
      description: 'Smooth hero section animation on scroll.',
      image: '/images/example-hero.jpg',
    },
    {
      number: '02',
      title: 'Staggered Text',
      description: 'Beautiful staggered text animations.',
      image: '/images/example-stagger.jpg',
    },
    {
      number: '03',
      title: 'Parallax Gallery',
      description: 'Smooth parallax effects with images.',
      image: '/images/example-gallery.jpg',
    },
    {
      number: '04',
      title: 'Scroll Fade',
      description: 'Elements fade in as you scroll.',
      image: '/images/example-fade.jpg',
    },
  ] as ExampleCard[],
};

export const HOW_IT_WORKS_DATA = {
  badge: 'HOW IT WORKS',
  headlinePart1: 'From Scroll',
  headlinePart2: 'to ',
  headlineHighlight: 'Stunning.',
  subtitle: 'Attach animations to scroll triggers, define your effects, and let ScrollCraft do the rest.',
  steps: [
    {
      number: 1,
      title: 'Select your element',
      description: 'Target any element on the page.',
    },
    {
      number: 2,
      title: 'Define your animation',
      description: 'Set transforms, opacity, or custom styles.',
    },
    {
      number: 3,
      title: 'Add scroll triggers',
      description: 'Control when and how the animation plays.',
    },
    {
      number: 4,
      title: 'See the magic',
      description: 'Enjoy smooth, performant animations.',
    },
  ] as StepItem[],
  timelineNodes: ['Hero', 'Features', 'Showcase', 'Gallery', 'CTA'],
};

export const TESTIMONIALS_DATA = {
  badge: 'LOVED BY CREATORS',
  headlinePart1: 'What Developers ',
  headlineHighlight: 'Say.',
  subtitle: 'Join thousands of developers who are building amazing experiences with ScrollCraft.',
  items: [
    {
      id: 'arjun',
      quote:
        'ScrollCraft made it so easy to add scroll animations to my portfolio. Clean, lightweight and powerful!',
      name: 'Arjun Mehta',
      role: 'Frontend Developer',
      avatar: '/images/avatar-arjun.jpg',
    },
    {
      id: 'priya',
      quote:
        'Beautiful API, great performance, and the docs are super easy to follow. Highly recommended!',
      name: 'Priya Sharma',
      role: 'UI/UX Designer',
      avatar: '/images/avatar-priya.jpg',
    },
    {
      id: 'rohit',
      quote:
        "I've tried many scroll libraries, but ScrollCraft feels different. Simple yet so flexible.",
      name: 'Rohit Verma',
      role: 'Indie Maker',
      avatar: '/images/avatar-rohit.jpg',
    },
  ] as TestimonialItem[],
};

export const CTA_BANNER_DATA = {
  badge: 'READY TO BUILD',
  headlinePart1: "Let's Create",
  headlinePart2: 'Scroll Experiences.',
  subtitle: 'Get started today and bring your ideas to life with ScrollCraft.',
  note: 'Small interactions.\nBig experiences.',
};
