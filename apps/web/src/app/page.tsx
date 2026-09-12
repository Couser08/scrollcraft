import type { Metadata } from 'next';
import React from 'react';

import { 
  Navbar,
  HeroSection,
  MotionSection,
  PlaygroundSection,
  ImmersiveSection,
  FeaturesSection,
  MarqueeSection,
  CodeSection,
  PerformanceSection,
  CTASection,
  Footer,
  FPSMeter
} from '@/components/home/v4';

export const metadata: Metadata = {
  title: 'ScrollCraft — The Ultimate React Scroll Engine',
  description: 'High-performance scroll toolkit for React and Next.js. Direct DOM writes, zero React re-renders.',
};

export default function HomePage() {
  return (
    <div className="relative w-full min-h-screen bg-[#050505] text-zinc-100 overflow-x-clip selection:bg-zinc-800 selection:text-white font-sans antialiased">
      <Navbar />
      <FPSMeter />
      
      <main className="flex flex-col w-full items-center justify-start">
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
