'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  ArrowRight,
  SlidersHorizontal,
  RotateCcw,
  Box,
  Layers,
  Monitor,
} from 'lucide-react';
import { Cinematic3DScene } from './cinematic-3d-scene';
import { ExampleEditorialPage } from './example-editorial-page';
import { ExampleHorizontalPage } from './example-horizontal-page';
import { Example3DPage } from './example-3d-page';
import { ScrollCraftTierStore } from '@scrollcraft/core';

export const ShowcaseHub: React.FC = () => {
  const [activeView, setActiveView] = useState<'hub' | '01' | '02' | '03'>('hub');
  const [deviceTier, setDeviceTier] = useState<'Auto' | 'High' | 'Mid' | 'Low'>('Auto');
  const [throttle, setThrottle] = useState<'None' | '2x' | '4x' | '6x'>('None');
  const [showTelemetry, setShowTelemetry] = useState(true);
  const [showBorders, setShowBorders] = useState(false);
  const [simBackgroundTab, setSimBackgroundTab] = useState(false);

  // If user opens a dedicated view
  if (activeView === '01') {
    return <ExampleEditorialPage onBack={() => setActiveView('hub')} />;
  }
  if (activeView === '02') {
    return <ExampleHorizontalPage onBack={() => setActiveView('hub')} />;
  }
  if (activeView === '03') {
    return <Example3DPage onBack={() => setActiveView('hub')} />;
  }

  const handleTierChange = (t: 'Auto' | 'High' | 'Mid' | 'Low') => {
    setDeviceTier(t);
    const store = ScrollCraftTierStore.get();
    if (t === 'High' || t === 'Auto') store.setTier('high');
    else if (t === 'Mid') store.setTier('balanced');
    else if (t === 'Low') store.setTier('low');
  };

  const handleReset = () => {
    setDeviceTier('Auto');
    setThrottle('None');
    setShowTelemetry(true);
    setShowBorders(false);
    setSimBackgroundTab(false);
    ScrollCraftTierStore.get().setTier('high');
  };

  return (
    <div className={`w-full min-h-screen bg-[#050505] text-zinc-200 selection:bg-blue-600/20 font-sans antialiased pb-20 ${showBorders ? '[&_*]:outline [&_*]:outline-1 [&_*]:outline-blue-400/30' : ''}`}>
      
      {/* Top Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Hero Titles */}
          <div className="lg:col-span-8 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0a0a0a] border border-zinc-800 shadow-2xs text-zinc-300 text-xs font-medium mb-4">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>Scroll-Driven. By Design.</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-zinc-100 leading-tight mb-3">
              See <span className="text-blue-600">ScrollCraft</span> in Action
            </h1>

            <p className="text-lg sm:text-xl font-medium text-zinc-300 mb-3">
              Three interactive examples. Real performance. Zero compromises.
            </p>

            <p className="text-sm sm:text-base text-zinc-500 max-w-2xl leading-relaxed font-light">
              Explore carefully crafted demos that showcase the core power of ScrollCraft &mdash; from native scroll timelines to physics-based interactions and scroll-linked 3D &mdash; with real-time telemetry, controls, and code.
            </p>
          </div>

          {/* Right Live Telemetry Header Widget with Handwritten Doodles */}
          <div className="lg:col-span-4 relative flex flex-col items-end">
            {/* Top Handwritten Note */}
            <div className="hidden sm:flex items-center gap-2 mb-2 text-right">
              <span className="font-[family-name:var(--font-caveat)] text-zinc-500 text-2xl -rotate-3 leading-tight">
                Real-time telemetry <br />for every example
              </span>
              <svg width="28" height="24" viewBox="0 0 28 24" fill="none" className="text-zinc-400 mt-4">
                <path d="M4 2C8 8 14 16 24 18M24 18L18 12M24 18L20 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>

            {/* Live Card */}
            <div className="w-full p-4 rounded-2xl bg-[#0a0a0a] border border-zinc-800 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <div className="grid grid-cols-3 gap-3 text-center pb-3 border-b border-zinc-800/60">
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-400 block">FPS</span>
                  <span className="text-2xl font-black font-mono text-emerald-600">60</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-400 block">Driver</span>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-zinc-200">Native</span>
                  </div>
                  <span className="text-[9px] font-mono text-zinc-400">ViewTimeline</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-400 block">Renders</span>
                  <div className="flex items-baseline justify-center gap-1 mt-1">
                    <span className="text-lg font-black font-mono text-emerald-600">0</span>
                    <span className="text-xs font-mono text-zinc-400">/ 1</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 pt-2.5">
                <span>Paint: 0</span>
                <span>|</span>
                <span>Layout: 0</span>
                <span>|</span>
                <span>Memory: 42 MB</span>
              </div>
            </div>

            {/* Bottom Handwritten Note */}
            <div className="hidden sm:flex items-center gap-2 mt-4">
              <svg width="24" height="20" viewBox="0 0 24 20" fill="none" className="text-zinc-400 -mt-2">
                <path d="M20 2C16 6 10 12 2 14M2 14L8 10M2 14L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="font-[family-name:var(--font-caveat)] text-zinc-500 text-xl rotate-2">
                Know what's happening under the hood.
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Grid: 3 Cards on Left (Col 9) + Controls Sidebar on Right (Col 3) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 3 Showcase Example Cards */}
          <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 01: Editorial Long-Form */}
            <div className="rounded-3xl border border-zinc-800/90 bg-[#0a0a0a] p-5 shadow-xs flex flex-col justify-between hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-shadow group">
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-mono text-zinc-500 text-[11px] font-semibold">01 Editorial Long-Form</span>
                  <button
                    type="button"
                    onClick={() => setActiveView('01')}
                    className="text-xs font-semibold text-zinc-200 group-hover:text-blue-600 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Open Example</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Card Visual Mockup */}
                <div
                  onClick={() => setActiveView('01')}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-zinc-900 cursor-pointer shadow-inner"
                >
                  <Image
                    src="/images/examples-hero-mountain.jpg"
                    alt="Mountain Earth in Motion"
                    fill
                    sizes="300px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-0 p-4 flex flex-col justify-between text-zinc-950">
                    <div className="text-[10px] font-mono text-zinc-300">01 A Fragile Balance</div>
                    <div>
                      <h3 className="text-lg font-black tracking-tight leading-snug">The Earth In Motion</h3>
                      <p className="text-[10px] text-zinc-300 font-light mt-0.5">A scroll-driven story about our changing planet.</p>
                      <span className="inline-block mt-2 px-2.5 py-1 rounded-full bg-black/60 text-[9px] font-mono text-zinc-200 border border-white/10">
                        &darr; Scroll to explore
                      </span>
                    </div>
                  </div>
                </div>

                <h2 className="text-base font-bold text-zinc-100 tracking-tight mb-1">
                  Editorial Long-Form (Reveal + Pin + Sequence)
                </h2>
                <p className="text-xs text-zinc-500 font-light leading-relaxed mb-4">
                  A cinematic, scroll-linked story that demonstrates native ViewTimeline, pinning, and frame-by-frame sequences.
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-zinc-800/60">
                {['ViewTimeline', 'Pin / Unpin', 'ScrollSequence', 'Native / Fallback'].map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-400 text-[10px] font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Card 02: Horizontal Gallery + Marquee */}
            <div className="rounded-3xl border border-zinc-800/90 bg-[#0a0a0a] p-5 shadow-xs flex flex-col justify-between hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-shadow group">
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-mono text-zinc-500 text-[11px] font-semibold">02 Horizontal Gallery</span>
                  <button
                    type="button"
                    onClick={() => setActiveView('02')}
                    className="text-xs font-semibold text-zinc-200 group-hover:text-blue-600 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Open Example</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Card Visual Mockup */}
                <div
                  onClick={() => setActiveView('02')}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-zinc-900 cursor-pointer shadow-inner"
                >
                  <Image
                    src="/images/example-gallery.jpg"
                    alt="Horizontal Explore More"
                    fill
                    sizes="300px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  <div className="absolute inset-0 p-4 flex flex-col justify-between text-zinc-950">
                    <div className="text-[10px] font-mono text-zinc-300">01 / 08</div>
                    <div>
                      <h3 className="text-lg font-black tracking-tight leading-snug">Explore More</h3>
                      <p className="text-[10px] text-zinc-300 font-light mt-0.5">Scroll sideways. Feel the flow.</p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <div className="w-5 h-5 rounded-full bg-[#0a0a0a]/20 flex items-center justify-center text-[10px]">&larr;</div>
                        <div className="w-5 h-5 rounded-full bg-[#0a0a0a]/20 flex items-center justify-center text-[10px]">&rarr;</div>
                      </div>
                    </div>
                  </div>
                </div>

                <h2 className="text-base font-bold text-zinc-100 tracking-tight mb-1">
                  Horizontal Gallery + Marquee
                </h2>
                <p className="text-xs text-zinc-500 font-light leading-relaxed mb-4">
                  A smooth, physics-powered gallery with velocity-based marquee, adaptive performance, and intelligent off-screen optimization.
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-zinc-800/60">
                {['Velocity Physics', 'Device Tiers', 'Passive Listeners', 'Auto Pause'].map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-400 text-[10px] font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Card 03: Scroll-Linked 3D (R3F) */}
            <div className="rounded-3xl border border-zinc-800/90 bg-[#0a0a0a] p-5 shadow-xs flex flex-col justify-between hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-shadow group">
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-mono text-zinc-500 text-[11px] font-semibold">03 3D Experience</span>
                  <button
                    type="button"
                    onClick={() => setActiveView('03')}
                    className="text-xs font-semibold text-zinc-200 group-hover:text-blue-600 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Open Example</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Card Visual with Genuine Three.js Island Mini Preview */}
                <div
                  onClick={() => setActiveView('03')}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-gradient-to-b from-[#0a0f1d] to-[#04060b] cursor-pointer shadow-inner"
                >
                  <div className="absolute inset-0 z-0">
                    <Cinematic3DScene scrollProgress={0.35} />
                  </div>
                  <div className="absolute inset-0 p-4 flex flex-col justify-between text-zinc-950 pointer-events-none z-10">
                    <div className="text-[10px] font-mono text-cyan-300">Three.js WebGL Core</div>
                    <div>
                      <h3 className="text-lg font-black tracking-tight leading-snug">Nature In 3D</h3>
                      <p className="text-[10px] text-zinc-300 font-light mt-0.5">Scroll to explore a three-dimensional world.</p>
                      <span className="inline-block mt-2 px-2.5 py-1 rounded-full bg-black/60 text-[9px] font-mono text-cyan-300 border border-cyan-500/30">
                        &darr; 3D Interactive
                      </span>
                    </div>
                  </div>
                </div>

                <h2 className="text-base font-bold text-zinc-100 tracking-tight mb-1">
                  Scroll-Linked 3D (R3F)
                </h2>
                <p className="text-xs text-zinc-500 font-light leading-relaxed mb-4">
                  A WebGL experience using a pull-based scroll hook, zero React re-renders, and a smart driver strategy.
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-zinc-800/60">
                {['useScroll3D', 'Zero Re-renders', 'R3F Safe', 'Multi-Driver'].map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-400 text-[10px] font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Right Control Panel */}
          <div className="lg:col-span-3 w-full space-y-6">
            
            {/* Demo Controls Card */}
            <div className="p-5 rounded-3xl border border-zinc-800/90 bg-[#0a0a0a] shadow-xs space-y-5">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-100">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Demo Controls</span>
                </div>
                <p className="text-[11px] text-zinc-400 font-light">Test different conditions</p>
              </div>

              {/* Device Tier Selector */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-zinc-400">Device Tier</span>
                <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-zinc-900 text-[11px] font-mono">
                  {(['Auto', 'High', 'Mid', 'Low'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleTierChange(t)}
                      className={`py-1 rounded-lg transition-all cursor-pointer font-bold ${
                        deviceTier === t ? 'bg-zinc-900 text-zinc-200 shadow-xs' : 'text-zinc-500 hover:text-zinc-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Network / CPU Throttle */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-zinc-400">Network / CPU Throttle</span>
                <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-zinc-900 text-[11px] font-mono">
                  {(['None', '2x', '4x', '6x'] as const).map((th) => (
                    <button
                      key={th}
                      type="button"
                      onClick={() => setThrottle(th)}
                      className={`py-1 rounded-lg transition-all cursor-pointer font-bold ${
                        throttle === th ? 'bg-zinc-900 text-zinc-200 shadow-xs' : 'text-zinc-500 hover:text-zinc-200'
                      }`}
                    >
                      {th}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2.5 pt-2 border-t border-zinc-800/60 text-xs">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-[11px]">Show Telemetry HUD</span>
                  <input
                    type="checkbox"
                    checked={showTelemetry}
                    onChange={(e) => setShowTelemetry(e.target.checked)}
                    className="accent-blue-600 cursor-pointer"
                  />
                </div>
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
                  <span className="text-[11px]">Simulate Background Tab</span>
                  <input
                    type="checkbox"
                    checked={simBackgroundTab}
                    onChange={(e) => setSimBackgroundTab(e.target.checked)}
                    className="accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Reset Demo */}
              <button
                type="button"
                onClick={handleReset}
                className="w-full py-2 rounded-xl bg-zinc-900 hover:bg-zinc-200 text-zinc-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo</span>
              </button>
            </div>

            {/* Active Example Selector */}
            <div className="p-4 rounded-3xl border border-zinc-800/90 bg-[#0a0a0a] shadow-xs space-y-2">
              <span className="text-xs font-bold text-zinc-100 block">Active Example</span>
              <div className="space-y-1 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveView('01')}
                  className="w-full text-left px-3 py-2 rounded-xl bg-blue-50 text-blue-700 font-semibold flex items-center justify-between cursor-pointer hover:bg-blue-100 transition-colors"
                >
                  <span>01 Editorial Long-Form</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('02')}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-zinc-900 text-zinc-400 font-medium flex items-center justify-between cursor-pointer transition-colors"
                >
                  <span>02 Horizontal Gallery</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('03')}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-zinc-900 text-zinc-400 font-medium flex items-center justify-between cursor-pointer transition-colors"
                >
                  <span>03 Scroll-Linked 3D</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Bottom Section: Shared Components */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
        <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-zinc-800 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Box className="w-4 h-4 text-blue-600" />
                <h3 className="text-base font-bold text-zinc-100">Shared Components</h3>
              </div>
              <p className="text-xs text-zinc-500 font-light">Reusable UI components used across all examples.</p>
            </div>
            <a
              href="/docs"
              className="text-xs font-semibold text-zinc-200 hover:text-blue-600 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>View Component Library</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mini Components Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* 1. Telemetry Overlay */}
            <div className="p-3.5 rounded-2xl bg-zinc-800 border border-zinc-800/80 space-y-2">
              <span className="text-xs font-bold text-zinc-100 block">Telemetry Overlay</span>
              <div className="p-2 rounded-lg bg-[#0a0a0a] border border-zinc-800 text-[10px] font-mono flex justify-between">
                <span>FPS: <strong className="text-emerald-600">60</strong></span>
                <span>Renders: 0</span>
              </div>
              <span className="text-[10px] text-zinc-500 block leading-tight">Real-time performance metrics</span>
            </div>

            {/* 2. Driver Badge */}
            <div className="p-3.5 rounded-2xl bg-zinc-800 border border-zinc-800/80 space-y-2">
              <span className="text-xs font-bold text-zinc-100 block">Driver Badge</span>
              <div className="flex gap-1">
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">&bull; Native</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[9px]">&bull; Fallback</span>
              </div>
              <span className="text-[10px] text-zinc-500 block leading-tight">Shows active scroll driver</span>
            </div>

            {/* 3. Control Strip */}
            <div className="p-3.5 rounded-2xl bg-zinc-800 border border-zinc-800/80 space-y-2">
              <span className="text-xs font-bold text-zinc-100 block">Control Strip</span>
              <div className="flex gap-1.5 text-zinc-500">
                <Monitor className="w-3.5 h-3.5" />
                <Layers className="w-3.5 h-3.5" />
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] text-zinc-500 block leading-tight">Device, throttle and debug controls</span>
            </div>

            {/* 4. Code Reveal */}
            <div className="p-3.5 rounded-2xl bg-zinc-800 border border-zinc-800/80 space-y-2">
              <span className="text-xs font-bold text-zinc-100 block">Code Reveal</span>
              <div className="p-1.5 rounded-lg bg-zinc-900 text-zinc-300 font-mono text-[9px] truncate">
                import &#123; scroll &#125;
              </div>
              <span className="text-[10px] text-zinc-500 block leading-tight">Live, editable code examples</span>
            </div>

            {/* 5. Feature Tags */}
            <div className="p-3.5 rounded-2xl bg-zinc-800 border border-zinc-800/80 space-y-2">
              <span className="text-xs font-bold text-zinc-100 block">Feature Tags</span>
              <div className="flex gap-1 flex-wrap">
                <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[9px]">Pin</span>
                <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[9px]">Physics</span>
              </div>
              <span className="text-[10px] text-zinc-500 block leading-tight">Used across demos and docs</span>
            </div>

            {/* 6. Example Card */}
            <div className="p-3.5 rounded-2xl bg-zinc-800 border border-zinc-800/80 space-y-2">
              <span className="text-xs font-bold text-zinc-100 block">Example Card</span>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-zinc-300 shrink-0" />
                <div className="h-2 bg-zinc-200 rounded w-full" />
              </div>
              <span className="text-[10px] text-zinc-500 block leading-tight">Consistent card component</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
