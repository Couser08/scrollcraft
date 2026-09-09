import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import { PlaygroundStudio } from '@/components/playground/playground-studio';

export const metadata: Metadata = {
  title: 'Playground — ScrollCraft Studio',
  description:
    'Interactive real-time sandbox for tuning ScrollCraft physics, keyframes, and compositor transforms.',
};

export default function PlaygroundPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen bg-white text-zinc-950 flex flex-col justify-center items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#FF5A1F]/20 border-t-[#FF5A1F] rounded-full animate-spin" />
          <p className="text-xs font-mono text-zinc-400 tracking-wider uppercase animate-pulse">
            Loading Studio...
          </p>
        </div>
      }
    >
      <PlaygroundStudio />
    </Suspense>
  );
}
