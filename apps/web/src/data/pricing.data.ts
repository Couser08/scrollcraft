/**
 * Pricing Data Layer for ScrollCraft Pro
 * Strictly under 650 LOC.
 */

export interface PricingTier {
  id: string;
  name: string;
  badge?: string;
  price: string;
  period: string;
  description: string;
  highlighted?: boolean;
  features: string[];
  ctaText: string;
  ctaHref: string;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'starter',
    name: 'ScrollCraft Core',
    price: '$0',
    period: 'Free forever (MIT)',
    description: 'Open-source game-dev scroll engine and declarative primitives for developers.',
    features: [
      'Zero-allocation rAF ticker loop',
      'Subpixel inertia smooth scroll engine',
      'Direct GPU compositor transform pipeline',
      'Declarative <scroll.div> and hooks',
      'Next.js 15 & React 19 full SSR support',
      'Community Discord & Docs support',
    ],
    ctaText: 'Use Free Core',
    ctaHref: '/docs',
  },
  {
    id: 'pro-single',
    name: 'ScrollCraft Pro (All-Access)',
    badge: 'MOST POPULAR',
    price: '$129',
    period: 'One-time payment • Lifetime updates',
    description: '60+ Awwwards-tier components, animations, and CLI access for ambitious creators.',
    highlighted: true,
    features: [
      'Everything in Free Core',
      '60+ Production-Ready Pro UI Components',
      'Unlimited CLI scaffolding (`npx scrollcraft add`)',
      'Interactive 3D Apple-style device scrubbers',
      'Pinned horizontal rails & stacked card decks',
      'Kinetic typography & text mask reveals',
      'Commercial license for unlimited client projects',
      'Private Discord channel with core engineers',
    ],
    ctaText: 'Get Lifetime Pro Access',
    ctaHref: '#checkout',
  },
  {
    id: 'agency',
    name: 'Agency & Enterprise',
    badge: 'FOR TEAMS',
    price: '$299',
    period: 'One-time payment • Up to 10 seats',
    description: 'Empower your entire studio to build award-winning websites with zero overhead.',
    features: [
      'Everything in Pro All-Access',
      '10 developer team seats & shared CLI token',
      'Priority code reviews for custom scroll scenes',
      'Dedicated private Slack / Discord bridge',
      'Custom invoice & procurement support',
      'Early access to WebGL / 3D Canvas integration',
    ],
    ctaText: 'Get Team License',
    ctaHref: '#checkout-team',
  },
];
