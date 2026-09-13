'use client';

import React, { useState, useEffect } from 'react';
import { HorizontalScroll, VelocityMarquee } from '@scrollcraft/react';
import { ScrollCraftTierStore, PerformanceTier } from '@scrollcraft/core';
import { Cpu, Gauge, Sparkles, Layers, SlidersHorizontal, Check } from 'lucide-react';
import { ExampleSourceViewer } from './example-source-viewer';

const GALLERY_SOURCE_CODE = `import { HorizontalScroll, VelocityMarquee } from '@scrollcraft/react';

export function LuxuryEcommerceGallery() {
  return (
    <div className="relative bg-zinc-950 py-16">
      {/* Velocity-Reactive Horizontal Ticker */}
      <VelocityMarquee baseSpeed={1.2} velocityMultiplier={0.8} className="py-4 border-y border-white/10">
        <span className="text-4xl font-extrabold uppercase tracking-tighter text-zinc-600 mr-8">
          AUTONOMOUS TIER ADAPTATION &bull; LOW-END HARDWARE SAFE &bull; VELOCITY INERTIA
        </span>
      </VelocityMarquee>

      {/* Pinned Horizontal Product Track */}
      <HorizontalScroll speed={2.5} className="mt-12">
        {products.map((item) => (
          <div key={item.id} className="w-[320px] shrink-0 p-6 rounded-3xl bg-zinc-900 border border-white/10 mr-6">
            <img src={item.image} alt={item.name} className="w-full h-56 object-cover rounded-2xl mb-4" />
            <span className="text-xs font-mono text-blue-400">{item.tag}</span>
            <h3 className="text-lg font-bold text-white mt-1">{item.name}</h3>
            <p className="text-zinc-400 text-sm mt-1">{item.price}</p>
          </div>
        ))}
      </HorizontalScroll>
    </div>
  );
}`;

interface ProductCard {
  id: string;
  name: string;
  category: string;
  price: string;
  badge: string;
  accent: string;
  specs: string;
}

const PRODUCTS: ProductCard[] = [
  {
    id: '01',
    name: 'AERO-X RUNNER',
    category: 'Kinetic Footwear',
    price: '$340',
    badge: 'Limited 100',
    accent: 'from-blue-600/20 to-indigo-600/10',
    specs: 'Carbon plate &bull; 180g',
  },
  {
    id: '02',
    name: 'CHRONO MONOLITH',
    category: 'Spatial Timepiece',
    price: '$890',
    badge: 'Titanium Grade 5',
    accent: 'from-purple-600/20 to-pink-600/10',
    specs: 'Sapphire glass &bull; 100m',
  },
  {
    id: '03',
    name: 'NEO OBERON COAT',
    category: 'Thermal Shield',
    price: '$620',
    badge: 'Graphene Woven',
    accent: 'from-emerald-600/20 to-teal-600/10',
    specs: 'Waterproof &bull; Zero drag',
  },
  {
    id: '04',
    name: 'SPATIAL POD-04',
    category: 'Acoustic Chamber',
    price: '$450',
    badge: 'Beryllium Driver',
    accent: 'from-amber-600/20 to-orange-600/10',
    specs: 'Planar magnetic &bull; 40kHz',
  },
  {
    id: '05',
    name: 'CYBER TACTICAL RIG',
    category: 'Modular Carry',
    price: '$280',
    badge: 'Dyneema Cord',
    accent: 'from-cyan-600/20 to-blue-600/10',
    specs: 'Fidlock magnetic buckles',
  },
];

type ThrottleLevel = '1x' | '4x' | '6x' | 'reduced';

export const ProofDeviceTierGallery: React.FC = () => {
  const [throttle, setThrottle] = useState<ThrottleLevel>('1x');
  const [currentTier, setCurrentTier] = useState<PerformanceTier>('high');

  // Sync with core ScrollCraftTierStore
  useEffect(() => {
    const store = ScrollCraftTierStore.get();
    const unsub = store.subscribe((t) => {
      setCurrentTier(t);
    });
    return unsub;
  }, []);

  const handleThrottleChange = (level: ThrottleLevel) => {
    setThrottle(level);
    const store = ScrollCraftTierStore.get();
    if (level === '1x') {
      store.setTier('high');
    } else if (level === '4x') {
      store.setTier('balanced');
    } else if (level === '6x') {
      store.setTier('low');
    } else if (level === 'reduced') {
      store.setTier('low');
    }
  };

  // Tier configuration mappings
  const tierConfig = {
    '1x': {
      tierName: 'Tier 1: High Performance',
      badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      motionBlur: 'Full Multi-Layer Blur (16px)',
      physics: 'Uncapped 120Hz Spring Inertia',
      compositor: 'Full WAAPI GPU Layers Enabled',
      explanation: 'Flagship desktop & modern mobile. All GPU compositor layers, spring physics, and backdrop blurs running at maximum fidelity.',
    },
    '4x': {
      tierName: 'Tier 2: Balanced Damping',
      badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      motionBlur: 'Reduced Blur Radius (4px)',
      physics: 'Clamped 60Hz Damped Lerp',
      compositor: 'Selective Composite Layer Promotion',
      explanation: 'Simulating mid-tier mobile (Snapdragon 7 / Core i3). Heavy backdrop filters pruned, velocity multiplier clamped to preserve 60 FPS without heating device.',
    },
    '6x': {
      tierName: 'Tier 3: Low-Power Graceful Fallback',
      badgeColor: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
      motionBlur: 'Disabled (0px Repaint Cost)',
      physics: 'Linear Quantized Transform',
      compositor: 'Zero-Overhead Static Transform',
      explanation: 'Simulating budget Android / battery saver mode. Eliminates all expensive filter repaints and switches physics to zero-overhead lightweight transforms.',
    },
    'reduced': {
      tierName: 'Reduced Motion / Eco Mode',
      badgeColor: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
      motionBlur: 'Zero Blur (Strict)',
      physics: 'Instant Positioning (0 Inertia)',
      compositor: 'Accessible Static Layout',
      explanation: 'Accessibility preference respected. Eliminates vestibular motion triggers while preserving full content visibility.',
    },
  }[throttle];

  return (
    <div id="example-device-tier" className="w-full rounded-3xl border border-white/10 bg-[#08080a] p-5 sm:p-8 relative overflow-hidden shadow-2xl">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[450px] h-[300px] bg-purple-600/10 blur-[130px] pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest bg-purple-500/10 border border-purple-500/20 text-purple-400 font-semibold">
              Axis 02 &bull; Device-Tier Adaptation
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400">
              <Layers className="w-3.5 h-3.5 text-purple-400" /> Dynamic Fallback Pipeline
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            E-Commerce Velocity &amp; Horizontal Gallery
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mt-1">
            Proves autonomous low-end device optimization: use the interactive CPU throttle simulator below to verify
            how ScrollCraft automatically degrades expensive blur &amp; physics layers before a single frame drops.
          </p>
        </div>

        {/* Current Active Engine Tier Badge */}
        <div className="shrink-0 flex items-center gap-2">
          <div className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 ${tierConfig.badgeColor}`}>
            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
            <span>{currentTier.toUpperCase()} TIER</span>
          </div>
        </div>
      </div>

      {/* KILLER FEATURE: In-Demo CPU Throttle Simulator Panel */}
      <div className="my-6 p-4 sm:p-5 rounded-2xl border border-white/10 bg-[#0c0d14] shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-purple-500/20 text-purple-400">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
              Interactive DevTools CPU Throttle Simulator
            </span>
          </div>
          <span className="text-[11px] font-mono text-zinc-400">
            Click to simulate device degradation live
          </span>
        </div>

        {/* Throttle Option Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3.5">
          <button
            type="button"
            onClick={() => handleThrottleChange('1x')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              throttle === '1x'
                ? 'bg-emerald-500/15 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06]'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
              <span>1x Unthrottled</span>
              {throttle === '1x' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
            </div>
            <span className="text-[10px] font-mono text-zinc-400 block">Tier 1 &bull; 120Hz Pro</span>
          </button>

          <button
            type="button"
            onClick={() => handleThrottleChange('4x')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              throttle === '4x'
                ? 'bg-amber-500/15 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06]'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
              <span>4x Mid-Tier CPU</span>
              {throttle === '4x' && <Check className="w-3.5 h-3.5 text-amber-400" />}
            </div>
            <span className="text-[10px] font-mono text-zinc-400 block">Tier 2 &bull; Damped Lerp</span>
          </button>

          <button
            type="button"
            onClick={() => handleThrottleChange('6x')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              throttle === '6x'
                ? 'bg-rose-500/15 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
                : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06]'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
              <span>6x Budget CPU</span>
              {throttle === '6x' && <Check className="w-3.5 h-3.5 text-rose-400" />}
            </div>
            <span className="text-[10px] font-mono text-zinc-400 block">Tier 3 &bull; Clamped Eco</span>
          </button>

          <button
            type="button"
            onClick={() => handleThrottleChange('reduced')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              throttle === 'reduced'
                ? 'bg-sky-500/15 border-sky-500/50 shadow-[0_0_15px_rgba(14,165,233,0.15)]'
                : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06]'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
              <span>Reduced Motion</span>
              {throttle === 'reduced' && <Check className="w-3.5 h-3.5 text-sky-400" />}
            </div>
            <span className="text-[10px] font-mono text-zinc-400 block">Accessibility Strict</span>
          </button>
        </div>

        {/* Real-Time Adaptation Telemetry Row */}
        <div className="mt-3.5 pt-3 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-purple-400" />
              Motion Filter:
            </span>
            <span className="font-semibold text-white truncate">{tierConfig.motionBlur}</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <Gauge className="w-3 h-3 text-blue-400" />
              Physics Pipeline:
            </span>
            <span className="font-semibold text-white truncate">{tierConfig.physics}</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-emerald-400" />
              Compositor Plan:
            </span>
            <span className="font-semibold text-white truncate">{tierConfig.compositor}</span>
          </div>
        </div>

        {/* Live Explanation Callout */}
        <p className="mt-3 text-xs text-zinc-400 leading-relaxed font-light">
          <strong className="text-zinc-200">Engine Reaction: </strong>
          {tierConfig.explanation}
        </p>
      </div>

      {/* Live Interactive Gallery Playground */}
      <div className="relative rounded-2xl border border-white/10 bg-[#050505] p-5 sm:p-6 overflow-hidden">
        
        {/* Continuous Velocity Marquee Banner */}
        <div className="mb-6 py-2.5 px-4 rounded-xl bg-white/[0.02] border border-white/5 overflow-hidden">
          <VelocityMarquee
            baseSpeed={throttle === '6x' ? 0.6 : 1.4}
            velocityMultiplier={throttle === '6x' ? 0.2 : throttle === '4x' ? 0.5 : 1.0}
            className="text-xs sm:text-sm font-mono tracking-widest uppercase font-bold text-zinc-500"
          >
            <span>SPRING PHYSICS &bull; ZERO MAIN-THREAD LATENCY &bull; DEVICE ADAPTIVE LERP &bull; </span>
          </VelocityMarquee>
        </div>

        {/* Horizontal Product Scroller Stage */}
        <div className="relative">
          <div className="flex items-center justify-between mb-3 text-xs text-zinc-400">
            <span className="font-semibold text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              Scroll-Linked Horizontal Product Carousel
            </span>
            <span className="font-mono text-[11px] text-purple-400">
              Scroll page to scrub track horizontally &bull; Switch throttles above
            </span>
          </div>

          {/* Pinned Horizontal Product Track using HorizontalScroll */}
          <HorizontalScroll
            speed={1.2}
            className="w-full"
            stickyClassName="sticky top-20 h-[380px] w-full overflow-hidden flex items-center"
            innerClassName="flex gap-5 px-4 select-none"
          >
            {PRODUCTS.map((item) => (
              <div
                key={item.id}
                className={`w-[260px] sm:w-[280px] shrink-0 rounded-2xl border p-5 transition-all flex flex-col justify-between ${
                  throttle === '6x' || throttle === 'reduced'
                    ? 'bg-zinc-900 border-zinc-800'
                    : 'bg-gradient-to-b from-white/[0.04] to-white/[0.01] border-white/10 backdrop-blur-md shadow-xl'
                }`}
              >
                {/* Visual Thumbnail */}
                <div className={`w-full h-36 rounded-xl bg-gradient-to-br ${item.accent} border border-white/10 flex flex-col items-center justify-center p-4 relative overflow-hidden mb-4`}>
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-mono bg-black/60 border border-white/10 text-zinc-300">
                    {item.badge}
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-inner text-white font-mono font-bold text-sm">
                    {item.id}
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 mt-2">
                    {item.specs}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-semibold">
                    {item.category}
                  </span>
                  <h4 className="text-base font-bold text-white tracking-tight mt-0.5">
                    {item.name}
                  </h4>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                    <span className="text-sm font-bold font-mono text-zinc-200">
                      {item.price}
                    </span>
                    <button
                      type="button"
                      className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-[11px] font-semibold text-white transition-colors cursor-pointer"
                    >
                      Preorder
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </HorizontalScroll>
        </div>

      </div>

      {/* Code Reveal Panel */}
      <ExampleSourceViewer
        fileName="LuxuryEcommerceGallery.tsx"
        code={GALLERY_SOURCE_CODE}
      />
    </div>
  );
};
