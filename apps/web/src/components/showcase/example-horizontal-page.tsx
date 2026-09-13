'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  ArrowLeft,
  ArrowRight,
  Code,
  Zap,
  Activity,
  EyeOff,
  Copy,
  Check,
  Sparkles,
  Monitor,
  Laptop,
  Smartphone,
} from 'lucide-react';
import { VelocityMarquee, HorizontalScroll, useScrollState } from '@scrollcraft/react';
import { ExampleSourceViewer } from '../examples/example-source-viewer';

const CODE_SNIPPETS = {
  react: `import { HorizontalScroll } from '@scrollcraft/react';

export default function HorizontalGallery() {
  return (
    <HorizontalScroll speed={2.5} innerClassName="flex gap-6 items-center">
      <div className="gallery-item">01 Iceland</div>
      <div className="gallery-item">02 Swiss Alps</div>
      <div className="gallery-item">03 Santorini</div>
      <div className="gallery-item">04 Kyoto</div>
      <div className="gallery-item">05 Banff</div>
    </HorizontalScroll>
  );
}`,
  vanilla: `import { scrollCraft } from 'scrollcraft';

scrollCraft.horizontal('.gallery', {
  speed: 2.5,
  velocity: true,
  spring: { damping: 0.85, stiffness: 0.1 },
  autoPause: true,
});`,
  html: `<div class="gallery" data-scroll="horizontal" data-velocity="true">
  <div class="gallery-item">01 Iceland</div>
  <div class="gallery-item">02 Swiss Alps</div>
  <div class="gallery-item">03 Santorini</div>
  <div class="gallery-item">04 Kyoto</div>
  <div class="gallery-item">05 Banff</div>
</div>`,
};

interface DestinationCard {
  id: string;
  name: string;
  subtitle: string;
  image: string;
}

const DESTINATIONS: DestinationCard[] = [
  { id: '01', name: 'Iceland', subtitle: 'Land of Fire & Ice', image: '/images/hero_mountain_dark.jpg' },
  { id: '02', name: 'Swiss Alps', subtitle: "Nature's Masterpiece", image: '/images/hero-mountain.jpg' },
  { id: '03', name: 'Santorini', subtitle: 'A Grecian Dream', image: '/images/parallax_fabric.jpg' },
  { id: '04', name: 'Kyoto', subtitle: 'Where Tradition Lives', image: '/images/cinematic_landscape.jpg' },
  { id: '05', name: 'Banff', subtitle: 'Pure Wilderness', image: '/images/example-scale.jpg' },
];

interface ExampleHorizontalPageProps {
  onBack?: () => void;
}

export const ExampleHorizontalPage: React.FC<ExampleHorizontalPageProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'react' | 'vanilla' | 'html'>('react');
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [lowEndSim, setLowEndSim] = useState(false);
  const [showBorders, setShowBorders] = useState(false);
  const [showMs, setShowMs] = useState(false);
  const [manualOffset, setManualOffset] = useState(0);

  // Velocity telemetry metrics from core library
  const velocity = useScrollState((m) => m.velocity, undefined, { enabled: true }) || 0;
  const progress = useScrollState((m) => m.progress, undefined, { enabled: true }) || 0;
  const direction = useScrollState((m) => m.direction, undefined, { enabled: true }) || 1;

  // Active gallery position percentage (mix of progress and manual offset)
  const galleryPosition = Math.min(100, Math.max(0, progress * 100 + (manualOffset / 1200) * 100));

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CODE_SNIPPETS[activeTab]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`w-full min-h-screen bg-[#050505] text-zinc-200 selection:bg-blue-600/20 font-sans antialiased ${
        showBorders ? '[&_*]:outline [&_*]:outline-1 [&_*]:outline-blue-400/30' : ''
      }`}
    >
      {/* Top Back Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Examples</span>
        </button>
      </div>

      {/* Main Header Section */}
      <div id="hero" className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Title Area */}
          <div className="lg:col-span-8 flex flex-col items-start text-left relative">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-900 text-zinc-400 text-xs font-mono font-semibold mb-3 border border-zinc-800">
              <span className="text-zinc-400">EXAMPLE 02</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-zinc-100 leading-tight mb-4">
              Horizontal Gallery <br />+ Marquee
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed mb-6 font-light">
              A smooth, physics-powered gallery that reacts to your scroll velocity. Featuring an infinite marquee, adaptive performance, and intelligent off-screen optimization.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <button
                type="button"
                onClick={() => scrollToSection('gallery-stage')}
                className="px-5 py-2.5 rounded-full bg-zinc-100 hover:bg-zinc-300 text-zinc-950 text-xs font-semibold flex items-center gap-2 shadow-[0_2px_10px_rgba(0,0,0,0.4)] transition-all cursor-pointer"
              >
                <span>Play Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setShowCode(!showCode)}
                className="px-4 py-2.5 rounded-full border border-zinc-800 bg-[#0a0a0a] hover:bg-zinc-800 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              >
                <Code className="w-3.5 h-3.5 text-zinc-400" />
                <span>View Code</span>
              </button>

              <a
                href="/docs"
                className="px-4 py-2.5 rounded-full border border-zinc-800 bg-[#0a0a0a] hover:bg-zinc-800 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                <span>How It Works</span>
              </a>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2">
              {['Velocity Physics', 'Spring Animation', 'Responsive', 'Passive Listeners', 'Auto Pause'].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-[#0a0a0a] border border-zinc-800 text-zinc-400 text-xs font-medium shadow-2xs"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Handwritten Doodle */}
            <div className="hidden sm:block absolute top-0 right-10 text-right pointer-events-none">
              <span className="font-[family-name:var(--font-caveat)] text-zinc-500 text-2xl block -rotate-3 mb-1">
                Feel the momentum.
              </span>
              <span className="font-[family-name:var(--font-caveat)] text-zinc-500 text-2xl block -rotate-3 flex items-center gap-2">
                Scroll faster, go further.
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60"><path d="M18 8L22 12L18 16"/><path d="M2 12H22"/></svg>
              </span>
            </div>
          </div>

          {/* Right Floating Telemetry HUD */}
          <div className="lg:col-span-4 w-full">
            <div className="p-5 rounded-2xl border border-zinc-800 bg-[#0a0a0a] shadow-[0_10px_30px_rgba(0,0,0,0.6)] space-y-3 font-sans">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60">
                <span className="text-xs font-bold text-zinc-200 tracking-tight">Live Telemetry</span>
                <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  60 FPS
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center text-zinc-400 font-sans">
                  <span>Driver</span>
                  <span className="font-semibold text-emerald-500 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Native <span className="text-zinc-500">(ViewTimeline)</span>
                  </span>
                </div>
                <div className="flex justify-between items-center text-zinc-400 font-sans">
                  <span>Scroll Velocity</span>
                  <span className="font-bold text-zinc-200">{Math.round(Math.abs(velocity)).toLocaleString()} px/s</span>
                </div>
                <div className="flex justify-between items-center text-zinc-400 font-sans">
                  <span>Direction</span>
                  <span className="font-semibold text-zinc-200">
                    {direction >= 0 ? 'Right \u2192' : '\u2190 Left'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-zinc-400 font-sans">
                  <span>Gallery Position</span>
                  <span className="font-semibold text-zinc-200">
                    {galleryPosition.toFixed(1)} %
                  </span>
                </div>
                <div className="flex justify-between items-center text-zinc-400 font-sans">
                  <span>Renders</span>
                  <span className="font-semibold text-zinc-200">
                    <strong className="text-emerald-500">0</strong> / 1
                  </span>
                </div>
                <div className="flex justify-between items-center text-zinc-400 font-sans">
                  <span>Spring (dt)</span>
                  <span className="font-semibold text-zinc-200">{showMs ? '16.67 ms' : '16.7 ms'}</span>
                </div>
                <div className="flex justify-between items-center text-zinc-400 font-sans">
                  <span>Device Tier</span>
                  <span className={`font-bold ${lowEndSim ? 'text-amber-500' : 'text-blue-500'}`}>
                    {lowEndSim ? 'Low (Simulated)' : 'High'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-zinc-400 font-sans">
                  <span>Loop State</span>
                  <span className="text-emerald-500 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Running
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800/60 space-y-2 text-xs">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-[11px]">Show Layer Borders</span>
                  <input
                    type="checkbox"
                    checked={showBorders}
                    onChange={(e) => setShowBorders(e.target.checked)}
                    className="accent-blue-600 cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-[11px]">Show Milliseconds</span>
                  <input
                    type="checkbox"
                    checked={showMs}
                    onChange={(e) => setShowMs(e.target.checked)}
                    className="accent-blue-600 cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-[11px]">Simulate Low-End Device</span>
                  <input
                    type="checkbox"
                    checked={lowEndSim}
                    onChange={(e) => setLowEndSim(e.target.checked)}
                    className="accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Code Drawer */}
        {showCode && (
          <div className="mt-6">
            <ExampleSourceViewer fileName="HorizontalGallery.tsx" code={CODE_SNIPPETS.react} defaultOpen />
          </div>
        )}
      </div>

      {/* Infinite Velocity Marquee Banner */}
      <div id="marquee" className="w-full border-y border-zinc-800/80 bg-[#0a0a0a] py-3.5 overflow-hidden">
        <VelocityMarquee baseSpeed={1.4} velocityMultiplier={lowEndSim ? 0.3 : 1.0}>
          <div className="flex items-center gap-10 text-xs font-mono font-bold tracking-widest text-zinc-400 uppercase">
            <span>&bull; TRAVEL THE WORLD</span>
            <span className="text-blue-500">✦ GOOD PLACES. BETTER PEOPLE.</span>
            <span>&bull; TRAVEL THE WORLD</span>
            <span className="text-blue-500">✦ GOOD PLACES. BETTER PEOPLE.</span>
            <span>&bull; INFINITE MARQUEE</span>
          </div>
        </VelocityMarquee>
      </div>

      {/* Horizontal Gallery Stage USING LIBRARY PRIMITIVE */}
      <div id="gallery-stage" className="relative w-full bg-[#050505] py-6">
        {/* Giant Subtle Background Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-black text-white/[0.03] tracking-tighter select-none pointer-events-none z-0">
          EXPLORE
        </div>

        <div className="max-w-7xl mx-auto px-6 mb-4 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <span className="font-[family-name:var(--font-caveat)] text-zinc-400 text-xl">
              Scroll horizontally or use your mouse wheel!
            </span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setManualOffset((prev) => Math.max(0, prev - 340))}
              className="p-2 rounded-full border border-zinc-800 bg-[#0a0a0a] hover:bg-zinc-800 text-zinc-300 transition-colors cursor-pointer"
            >
              &larr;
            </button>
            <button
              type="button"
              onClick={() => setManualOffset((prev) => Math.min(1200, prev + 340))}
              className="p-2 rounded-full border border-zinc-800 bg-[#0a0a0a] hover:bg-zinc-800 text-zinc-300 transition-colors cursor-pointer"
            >
              &rarr;
            </button>
          </div>
        </div>

        {/* The Native HorizontalScroll container */}
        <HorizontalScroll speed={2.5} innerClassName="flex gap-6 items-center px-6 sm:px-12" className="z-10 relative">
          <div
            className="flex gap-6 select-none transition-transform duration-150 ease-out"
            style={{
              transform: `translateX(-${manualOffset}px)`,
              filter: lowEndSim ? 'none' : Math.abs(velocity) > 1500 ? 'blur(1.5px)' : 'none',
              transition: 'filter 0.2s ease-out',
            }}
          >
            {DESTINATIONS.map((dest) => (
              <div
                key={dest.id}
                className="w-[280px] sm:w-[360px] shrink-0 h-[480px] rounded-3xl overflow-hidden relative shadow-[0_10px_30px_rgba(0,0,0,0.8)] group border border-zinc-800 bg-zinc-900"
              >
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  sizes="360px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

                <div className="absolute top-4 left-4 text-xs font-mono text-white/90 font-bold px-2 py-0.5 rounded bg-black/50 border border-white/10">
                  {dest.id}
                </div>

                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
                  <div>
                    <h3 className="text-2xl font-extrabold tracking-tight">{dest.name}</h3>
                    <p className="text-xs text-zinc-300 font-light mt-0.5">{dest.subtitle}</p>
                  </div>
                  <button
                    type="button"
                    className="w-10 h-10 rounded-full bg-white text-zinc-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </HorizontalScroll>
      </div>

      {/* Section: VELOCITY REACTIVITY -> Scroll Speed Brings It To Life */}
      <div id="velocity-gallery" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 border-t border-zinc-800/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left features */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 font-bold">
                VELOCITY REACTIVITY
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-zinc-100 tracking-tight mt-1 mb-3">
                Scroll Speed Brings It To Life
              </h2>
              <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
                The gallery adapts to your scroll velocity in real-time. Faster scroll = farther movement, with smooth spring-based damping for a natural feel.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-blue-400 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-100">Velocity Based</h4>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed">Real-time speed and direction tracking</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-emerald-400 mt-0.5">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-100">Smooth Spring Physics</h4>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed">Natural movement with deltaTime clamping</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-purple-400 mt-0.5">
                  <EyeOff className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-100">Off-Screen Optimization</h4>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed">Pauses animations when not in view</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Speed Comparison 3 Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Card 1: Slow Scroll */}
            <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-zinc-800 shadow-sm space-y-3">
              <div className="text-xs font-bold text-zinc-300 text-center">Slow Scroll</div>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-zinc-900">
                <Image
                  src="/images/hero-mountain.jpg"
                  alt="Slow scroll preview"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-1">
                <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="w-1/4 h-full bg-emerald-500 rounded-full" />
                </div>
                <div className="text-[11px] text-zinc-400 text-center font-light">Gentle movement</div>
              </div>
            </div>

            {/* Card 2: Normal Scroll */}
            <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-zinc-800 shadow-sm space-y-3">
              <div className="text-xs font-bold text-zinc-300 text-center">Normal Scroll</div>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-zinc-900">
                <Image
                  src="/images/hero-mountain.jpg"
                  alt="Normal scroll preview"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-1">
                <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="w-3/5 h-full bg-blue-500 rounded-full" />
                </div>
                <div className="text-[11px] text-zinc-400 text-center font-light">Smooth and responsive</div>
              </div>
            </div>

            {/* Card 3: Fast Scroll */}
            <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-zinc-800 shadow-sm space-y-3">
              <div className="text-xs font-bold text-zinc-300 text-center">Fast Scroll</div>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-zinc-900">
                <Image
                  src="/images/hero-mountain.jpg"
                  alt="Fast scroll preview"
                  fill
                  className="object-cover blur-[2px] scale-105"
                />
              </div>
              <div className="space-y-1">
                <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-purple-500 rounded-full animate-pulse" />
                </div>
                <div className="text-[11px] text-zinc-400 text-center font-light">Faster, dynamic movement</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section: ADAPTIVE PERFORMANCE -> Looks Great Everywhere */}
      <div id="device-tiers" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 border-t border-zinc-800/80">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 font-bold">
              ADAPTIVE PERFORMANCE
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-zinc-100 tracking-tight mt-1 mb-2">
              Looks Great Everywhere
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 font-light max-w-2xl leading-relaxed">
              Automatically detects device capabilities and adjusts effects for the best experience on every device &mdash; from high-end desktops to low-end mobiles.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">
            <span className="font-[family-name:var(--font-caveat)] text-zinc-400 text-xl -rotate-2">
              Same experience. Smarter performance.
            </span>
            <button
              type="button"
              onClick={() => setLowEndSim(!lowEndSim)}
              className="px-4 py-2 rounded-full border border-zinc-800 bg-[#0a0a0a] hover:bg-zinc-800 text-xs font-semibold text-zinc-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{lowEndSim ? 'Reset to High Tier' : 'Simulate Different Devices'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3 Hardware Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* High Tier (Desktop) */}
          <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h4 className="text-sm font-bold text-zinc-100">High Tier (Desktop)</h4>
              </div>
              <Monitor className="w-5 h-5 text-zinc-500" />
            </div>

            <div className="flex flex-wrap gap-1.5">
              <span className="px-2.5 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-emerald-400 text-[10px] font-medium">
                Full Physics
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-blue-400 text-[10px] font-medium">
                Particles
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-purple-400 text-[10px] font-medium">
                Advanced Effects
              </span>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-zinc-800/60 text-xs font-mono text-zinc-400">
              <div className="flex justify-between">
                <span>hardwareConcurrency</span>
                <span className="text-zinc-200">8+</span>
              </div>
              <div className="flex justify-between">
                <span>deviceMemory</span>
                <span className="text-zinc-200">8 GB+</span>
              </div>
              <div className="flex justify-between pt-1 text-[11px] font-sans">
                <span className="text-zinc-500">Experience</span>
                <span className="text-zinc-300 font-medium">Full experience with all effects</span>
              </div>
            </div>
          </div>

          {/* Mid Tier (Laptop / Tablet) */}
          <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <h4 className="text-sm font-bold text-zinc-100">Mid Tier (Laptop / Tablet)</h4>
              </div>
              <Laptop className="w-5 h-5 text-zinc-500" />
            </div>

            <div className="flex flex-wrap gap-1.5">
              <span className="px-2.5 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-blue-400 text-[10px] font-medium">
                Reduced Effects
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] font-medium">
                Optimized
              </span>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-zinc-800/60 text-xs font-mono text-zinc-400">
              <div className="flex justify-between">
                <span>hardwareConcurrency</span>
                <span className="text-zinc-200">4 - 8</span>
              </div>
              <div className="flex justify-between">
                <span>deviceMemory</span>
                <span className="text-zinc-200">4 - 8 GB</span>
              </div>
              <div className="flex justify-between pt-1 text-[11px] font-sans">
                <span className="text-zinc-500">Experience</span>
                <span className="text-zinc-300 font-medium">Balanced performance</span>
              </div>
            </div>
          </div>

          {/* Low Tier (Mobile) */}
          <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <h4 className="text-sm font-bold text-zinc-100">Low Tier (Mobile)</h4>
              </div>
              <Smartphone className="w-5 h-5 text-zinc-500" />
            </div>

            <div className="flex flex-wrap gap-1.5">
              <span className="px-2.5 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-amber-400 text-[10px] font-medium">
                Static Fallback
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] font-medium">
                Minimal Effects
              </span>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-zinc-800/60 text-xs font-mono text-zinc-400">
              <div className="flex justify-between">
                <span>hardwareConcurrency</span>
                <span className="text-zinc-200">1 - 4</span>
              </div>
              <div className="flex justify-between">
                <span>deviceMemory</span>
                <span className="text-zinc-200">&le; 4 GB</span>
              </div>
              <div className="flex justify-between pt-1 text-[11px] font-sans">
                <span className="text-zinc-500">Experience</span>
                <span className="text-zinc-300 font-medium">Clean and functional</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section: IMPLEMENTATION -> Simple to Implement */}
      <div id="implementation" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 border-t border-zinc-800/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left info */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 font-bold">
                IMPLEMENTATION
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-zinc-100 tracking-tight mt-1 mb-3">
                Simple to Implement
              </h2>
              <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
                Just a few lines of code to create a performant, physics-powered horizontal gallery. Built with modern web APIs and smart fallbacks.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/docs"
                className="px-5 py-2.5 rounded-full bg-zinc-100 text-zinc-950 text-xs font-semibold hover:bg-zinc-300 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span>View Full Code</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={handleCopy}
                className="px-4 py-2.5 rounded-full border border-zinc-800 bg-[#0a0a0a] hover:bg-zinc-800 text-xs font-semibold text-zinc-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                <span>{copied ? 'Copied!' : 'Copy Example'}</span>
              </button>
            </div>

            <div className="pt-2">
              <span className="font-[family-name:var(--font-caveat)] text-2xl text-zinc-500 block">
                Performant by default.
              </span>
            </div>
          </div>

          {/* Right Code Box */}
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-zinc-800 bg-[#0a0a0a] shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
              <div className="flex items-center gap-2">
                {(['react', 'vanilla', 'html'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                      activeTab === tab
                        ? 'bg-zinc-800 text-zinc-100'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {tab === 'react' ? 'React' : tab === 'vanilla' ? 'Vanilla JS' : 'HTML'}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-100 transition-colors font-mono cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <pre className="p-5 font-mono text-xs text-zinc-300 overflow-x-auto leading-relaxed">
              <code>{CODE_SNIPPETS[activeTab]}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
