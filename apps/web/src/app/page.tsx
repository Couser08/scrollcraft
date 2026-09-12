import type { Metadata } from 'next';
import React from 'react';
import dynamic from 'next/dynamic';

import { 
  Navbar,
  HeroSection,
  MotionSection,
  Footer,
  FPSMeter
} from '@/components/home/v4';

// Code-split below-the-fold sections to minimize initial client bundle size & improve TTI
const PlaygroundSection = dynamic(
  () => import('@/components/home/v4/03-playground').then((m) => m.PlaygroundSection)
);
const ImmersiveSection = dynamic(
  () => import('@/components/home/v4/04-immersive').then((m) => m.ImmersiveSection)
);
const FeaturesSection = dynamic(
  () => import('@/components/home/v4/05-features').then((m) => m.FeaturesSection)
);
const MarqueeSection = dynamic(
  () => import('@/components/home/v4/06-marquee').then((m) => m.MarqueeSection)
);
const CodeSection = dynamic(
  () => import('@/components/home/v4/08-code').then((m) => m.CodeSection)
);
const PerformanceSection = dynamic(
  () => import('@/components/home/v4/09-performance').then((m) => m.PerformanceSection)
);
const CTASection = dynamic(
  () => import('@/components/home/v4/10-cta').then((m) => m.CTASection)
);

export const metadata: Metadata = {
  title: 'ScrollCraft — The Ultimate React Scroll Engine',
  description: 'High-performance scroll toolkit for React and Next.js. Direct DOM writes, zero React re-renders.',
};

export default function HomePage() {
  return (
    <div className="relative w-full min-h-screen bg-[#050505] text-zinc-100 overflow-x-clip selection:bg-zinc-800 selection:text-white font-sans antialiased">
      {/* Keyboard Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-white font-medium text-xs shadow-lg transition-all"
      >
        Skip to main content
      </a>

      <Navbar />
      {process.env.NODE_ENV === 'development' && <FPSMeter />}
      
      <main id="main-content" className="flex flex-col w-full items-center justify-start">
        <HeroSection />
        <MotionSection />
        <PlaygroundSection />
        <ImmersiveSection />
        <FeaturesSection />
        <MarqueeSection />
        <CodeSection />
        <PerformanceSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
