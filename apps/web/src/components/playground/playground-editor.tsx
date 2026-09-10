'use client';

import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';
import { PlaygroundConfig } from './playground-types';
import { SyntaxHighlighter } from './syntax-highlighter';

interface PlaygroundEditorProps {
  config: PlaygroundConfig;
}

export const PlaygroundEditor: React.FC<PlaygroundEditorProps> = ({ config }) => {
  const [activeTab, setActiveTab] = useState<'nextjs' | 'react' | 'hook'>('nextjs');
  const [copied, setCopied] = useState(false);

  // Generate dynamic JSX based on the active showcase and current parameters
  const generateSnippet = () => {
    const { showcaseId, speed, duration, direction, stiffness, damping, distance } =
      config;

    switch (showcaseId) {
      case 'hero-parallax':
        if (activeTab === 'hook') {
          return `import { useRef } from 'react';
import { useParallax } from '@scrollcraft/react';

export function HeroParallax() {
  const layerRef = useRef<HTMLDivElement>(null);

  useParallax(layerRef, {
    speed: ${speed.toFixed(2)},
    direction: '${direction}',
    respectReducedMotion: true,
  });

  return (
    <div className="relative h-[80vh] overflow-hidden">
      <div ref={layerRef} className="absolute inset-0">
        <h1 className="text-6xl font-black">Subpixel Parallax</h1>
      </div>
    </div>
  );
}`;
        }
        if (activeTab === 'react') {
          return `import { Parallax } from '@scrollcraft/react';

export function ParallaxBanner() {
  return (
    <div className="relative h-96 overflow-hidden rounded-2xl">
      <Parallax speed={${speed.toFixed(2)}} direction="${direction}">
        <img src="/hero.jpg" alt="Parallax Layer" className="w-full h-full object-cover" />
      </Parallax>
      <Parallax speed={${(speed * 1.6).toFixed(2)}} direction="${direction}" className="absolute inset-0 flex items-center justify-center">
        <h2 className="text-3xl font-extrabold text-white">Zero-Jank Motion</h2>
      </Parallax>
    </div>
  );
}`;
        }
        return `import { Parallax } from '@scrollcraft/react';

export default function ParallaxSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Layer with ${speed.toFixed(2)}x parallax speed */}
      <Parallax
        speed={${speed.toFixed(2)}}
        direction="${direction}"
        className="absolute inset-0 -z-10"
      >
        <div className="w-full h-full bg-gradient-to-b from-blue-900/30 to-black" />
      </Parallax>

      {/* Floating Foreground Card */}
      <Parallax speed={${(speed * 1.6).toFixed(2)}} direction="${direction}">
        <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white">
          <h1 className="text-4xl font-black">
            Animate on Scroll, Beautifully.
          </h1>
          <p className="text-sm text-zinc-300 mt-2">
            60 FPS GPU-accelerated motion with zero layout thrash.
          </p>
        </div>
      </Parallax>
    </section>
  );
}`;

      case 'reveal-stagger':
        if (activeTab === 'hook') {
          return `import { useRef } from 'react';
import { useReveal } from '@scrollcraft/react';

export function StaggerCard() {
  const cardRef = useRef<HTMLDivElement>(null);

  useReveal(cardRef, {
    direction: '${direction}',
    distance: ${distance},
    duration: ${duration.toFixed(2)},
    threshold: 0.15,
    once: true,
  });

  return (
    <div ref={cardRef} className="p-6 rounded-2xl bg-zinc-900 text-white shadow-xl">
      <h3 className="text-lg font-bold">Zero-Jank Reveal</h3>
    </div>
  );
}`;
        }
        if (activeTab === 'react') {
          return `import { Reveal } from '@scrollcraft/react';

export function FeatureList() {
  return (
    <div className="space-y-4">
      <Reveal direction="${direction}" distance={${distance}} duration={${duration.toFixed(2)}}>
        <div className="p-4 rounded-xl bg-zinc-900 text-white">Next-Gen React 19 Support</div>
      </Reveal>
    </div>
  );
}`;
        }
        return `import { Reveal } from '@scrollcraft/react';

export default function StaggerShowcase() {
  const features = ['Subpixel Inertia', 'Zero-Layout Thrash', 'React 19 Native'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto py-16">
      {features.map((title, i) => (
        <Reveal
          key={title}
          direction="${direction}"
          distance={${distance}}
          duration={${duration.toFixed(2)}}
          delay={i * 0.12}
          once={true}
        >
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-white shadow-xl">
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="text-sm text-zinc-400 mt-2">
              Compositor-accelerated transforms with zero React re-renders.
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}`;

      case 'velocity-marquee':
        if (activeTab === 'hook') {
          return `import { useEffect, useRef } from 'react';
import { VelocityMarqueeSolver } from '@scrollcraft/core';

export function CustomMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackRef.current) return;
    const solver = new VelocityMarqueeSolver(trackRef.current, {
      baseSpeed: ${(speed * 60).toFixed(0)},
      velocityMultiplier: 2.5,
      direction: '${direction === 'right' ? 'right' : 'left'}',
    });
    return () => solver.destroy();
  }, []);

  return <div ref={trackRef}>INFINITE KINETIC MARQUEE</div>;
}`;
        }
        if (activeTab === 'react') {
          return `import { VelocityMarquee } from '@scrollcraft/react';

export function MarqueeBanner() {
  return (
    <div className="py-12 overflow-hidden bg-black text-white">
      <VelocityMarquee
        baseSpeed={${(speed * 60).toFixed(0)}}
        velocityMultiplier={2.5}
        direction="${direction === 'right' ? 'right' : 'left'}"
        className="text-4xl font-extrabold uppercase tracking-widest gap-8"
      >
        <span>SCROLLCRAFT</span>
        <span className="text-[#FF5A1F]">•</span>
        <span>ZERO JANK</span>
        <span className="text-[#FF5A1F]">•</span>
      </VelocityMarquee>
    </div>
  );
}`;
        }
        return `import { VelocityMarquee } from '@scrollcraft/react';

export default function MarqueeBanner() {
  return (
    <div className="py-12 overflow-hidden bg-black text-white">
      <VelocityMarquee
        baseSpeed={${(speed * 60).toFixed(0)}}
        velocityMultiplier={2.5}
        direction="${direction === 'right' ? 'right' : 'left'}"
        className="text-4xl font-extrabold uppercase tracking-widest gap-8"
      >
        <span>SCROLLCRAFT</span>
        <span className="text-[#FF5A1F]">•</span>
        <span>ZERO JANK</span>
        <span className="text-[#FF5A1F]">•</span>
        <span>120 FPS NATIVE</span>
        <span className="text-[#FF5A1F]">•</span>
      </VelocityMarquee>
    </div>
  );
}`;

      case 'magnetic-card':
        if (activeTab === 'hook') {
          return `import { useMagnetic } from '@scrollcraft/react';

export function MagneticCard() {
  const { ref } = useMagnetic({
    strength: 0.45,
    stiffness: ${stiffness},
    damping: ${damping},
  });

  return (
    <div ref={ref as React.Ref<HTMLDivElement>} className="p-8 border shadow-xl">
      <h3>Hover Over Me</h3>
    </div>
  );
}`;
        }
        if (activeTab === 'react') {
          return `import { useMagnetic } from '@scrollcraft/react';

export function MagneticCard() {
  const { ref } = useMagnetic({
    strength: 0.45,
    stiffness: ${stiffness},
    damping: ${damping},
  });

  return (
    <div ref={ref as React.Ref<HTMLDivElement>} className="p-8 rounded-2xl bg-white border">
      <h3 className="text-xl font-black">Hover Over Me</h3>
    </div>
  );
}`;
        }
        return `import { useMagnetic } from '@scrollcraft/react';

export default function MagneticCard() {
  const { ref } = useMagnetic({
    strength: 0.45,
    stiffness: ${stiffness},
    damping: ${damping},
  });

  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      className="p-8 rounded-2xl bg-white border border-zinc-200 shadow-xl cursor-pointer select-none transition-shadow hover:shadow-2xl"
    >
      <span className="text-xs font-mono font-bold text-[#FF5A1F] uppercase tracking-wider">
        Spring Physics
      </span>
      <h3 className="text-xl font-black text-zinc-950 mt-1">
        Hover Over Me
      </h3>
      <p className="text-xs text-zinc-500 mt-2">
        Subpixel springStep solver without React rerender loops.
      </p>
    </div>
  );
}`;
    }
  };

  const codeSnippet = generateSnippet();

  const copyCode = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full rounded-2xl bg-[#0e0f14] text-white border border-zinc-800 shadow-xl overflow-hidden">
      {/* Top Header Bar with Tabs and Copy Button */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-[#16181f]">
        {/* Framework Tabs */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('nextjs')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'nextjs'
                ? 'bg-[#FF5A1F] text-white shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Next.js App Router
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('react')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'react'
                ? 'bg-[#FF5A1F] text-white shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            React (Vite)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('hook')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'hook'
                ? 'bg-[#FF5A1F] text-white shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Direct Hook API
          </button>
        </div>

        {/* 1-Click Copy Snippet */}
        <button
          type="button"
          onClick={copyCode}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold text-white transition-all cursor-pointer active:scale-95"
          title="Copy exact code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-bold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-zinc-300" />
              <span>Copy Snippet</span>
            </>
          )}
        </button>
      </div>

      {/* Code Display Area with Tokenized Syntax Highlighter */}
      <div className="flex-1 p-6 overflow-x-auto overflow-y-auto max-h-[500px] bg-[#090b10] border-b border-zinc-900 leading-relaxed text-sm">
        <SyntaxHighlighter code={codeSnippet} showLineNumbers={true} />
      </div>

      {/* Bottom CLI Quick Install Snippet */}
      <div className="px-4 py-2.5 bg-[#12141c] flex items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <Terminal className="w-3.5 h-3.5 text-[#FF5A1F]" />
          <span>npm i @scrollcraft/react @scrollcraft/core</span>
        </div>
        <span className="text-[10px] text-zinc-500 hidden sm:inline font-mono">
          Ready to paste • Zero config
        </span>
      </div>
    </div>
  );
};
