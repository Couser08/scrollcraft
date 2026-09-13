'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  ArrowLeft,
  ArrowRight,
  Code,
  CheckCircle2,
  Play,
  Sparkles,
  Leaf,
  Users,
  Sun,
} from 'lucide-react';
import { useScrollState, Pin, Reveal, Parallax, ScrollSequence } from '@scrollcraft/react';
import { ExampleSourceViewer } from '../examples/example-source-viewer';

const EDITORIAL_CODE = `import { Pin, Reveal, Parallax, ScrollSequence, useScrollState } from '@scrollcraft/react';

export default function EditorialLongForm() {
  const progress = useScrollState(m => m.progress) || 0;

  return (
    <div className="editorial-layout">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 w-full z-50">
        <div style={{ width: \`\${progress * 100}%\` }} className="h-1 bg-blue-600 transition-all" />
      </div>

      <Reveal direction="up">
        <h2>A Fragile Balance</h2>
      </Reveal>

      <Pin top={64}>
        <Parallax speed={-0.15}>
          <div className="hero-banner" />
        </Parallax>
      </Pin>

      <ScrollSequence 
        frames={[
          '/images/hero-mountain.jpg', 
          '/images/parallax_fabric.jpg', 
          '/images/cinematic_landscape.jpg',
          '/images/example-scale.jpg'
        ]}
        height="180vh" 
        speed={1.5} 
      />
    </div>
  );
}`;

interface Milestone {
  id: string;
  name: string;
}

const MILESTONES: Milestone[] = [
  { id: 'intro', name: 'Intro' },
  { id: 'fragile-balance', name: 'A Fragile Balance' },
  { id: 'the-scale', name: 'The Scale' },
  { id: 'changing-patterns', name: 'Changing Patterns' },
  { id: 'what-we-can-do', name: 'What We Can Do' },
  { id: 'brighter-tomorrow', name: 'A Brighter Tomorrow' },
];

interface ExampleEditorialPageProps {
  onBack?: () => void;
}

export const ExampleEditorialPage: React.FC<ExampleEditorialPageProps> = ({ onBack }) => {
  const [showCode, setShowCode] = useState(false);
  const [showBorders, setShowBorders] = useState(false);
  const [showMs, setShowMs] = useState(false);
  const [activeMilestone, setActiveMilestone] = useState(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);
  const isDragging = useRef(false);

  // Core library state hook
  const progress = useScrollState((m) => m.progress, undefined, { enabled: true }) || 0;
  const velocity = useScrollState((m) => m.velocity, undefined, { enabled: true }) || 0;

  // Track active section via IntersectionObserver or scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = MILESTONES.map((m) => document.getElementById(m.id));
      const scrollPosition = window.scrollY + 250;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i];
        if (el && el.offsetTop <= scrollPosition) {
          setActiveMilestone(i);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const targetTop = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
  };

  const handleSliderMove = (clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pct);
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

      {/* Hero Section Container */}
      <div id="intro" className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Title & Intro */}
          <div className="lg:col-span-8 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-900 text-zinc-400 text-xs font-mono font-semibold mb-3 border border-zinc-800">
              <span className="text-zinc-400">01</span>
              <span>EXAMPLE</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-zinc-100 leading-tight mb-4">
              Editorial Long-Form
            </h1>

            <p className="text-xl sm:text-2xl text-zinc-400 font-light max-w-2xl mb-4">
              A scroll-driven story about our changing planet.
            </p>

            <p className="text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed mb-6 font-light">
              This demo showcases native <strong className="font-semibold text-zinc-200 underline decoration-zinc-500">ViewTimeline</strong>, pinning, scroll-sequenced animations, and zero-compromise performance &mdash; all in a cinematic editorial experience.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <button
                type="button"
                onClick={() => scrollToSection('fragile-balance')}
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

            {/* Feature Tags */}
            <div className="flex flex-wrap items-center gap-2">
              {['ViewTimeline', 'Pin / Unpin', 'ScrollSequence', 'Native / Fallback', 'Compositor Only'].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-[#0a0a0a] border border-zinc-800 text-zinc-400 text-xs font-medium shadow-2xs"
                >
                  {tag}
                </span>
              ))}
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

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Driver</span>
                  <span className="font-semibold text-emerald-500 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Native <span className="text-zinc-500">(ViewTimeline)</span>
                  </span>
                </div>
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Scroll Velocity</span>
                  <span className="font-mono text-zinc-200 font-bold">{Math.round(Math.abs(velocity))} px/s</span>
                </div>
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Renders</span>
                  <span className="font-semibold font-mono text-zinc-200">
                    <strong className="text-emerald-500">0</strong> / 1
                  </span>
                </div>
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Paint</span>
                  <span className="font-semibold font-mono text-zinc-200">0</span>
                </div>
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Layout</span>
                  <span className="font-semibold font-mono text-zinc-200">0</span>
                </div>
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Memory</span>
                  <span className="font-semibold font-mono text-zinc-200">{showMs ? '42.14 MB' : '42 MB'}</span>
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
              </div>

              <div className="pt-2">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-900/50 text-emerald-100 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold block">Compositor Only</span>
                    <span className="text-[10px] text-emerald-400/80">Transform / Opacity</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Code Drawer */}
        {showCode && (
          <div className="mt-6">
            <ExampleSourceViewer fileName="EditorialLongForm.tsx" code={EDITORIAL_CODE} defaultOpen />
          </div>
        )}
      </div>

      {/* Cinematic Hero Mountain Visual - Using Parallax Primitive */}
      <div className="relative w-full h-[65vh] min-h-[480px] overflow-hidden bg-zinc-950 flex items-end">
        <Parallax speed={-0.25} className="absolute inset-0">
          <Image
            src="/images/hero-mountain.jpg"
            alt="Himalayan Mountain Range"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-80 brightness-90"
          />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/30 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-12 w-full flex flex-col md:flex-row md:items-end justify-between gap-6 text-zinc-100">
          <div>
            <span className="text-xs font-mono tracking-widest text-zinc-400 uppercase">
              SCROLL FOR A CLEANER TOMORROW
            </span>
            <Reveal duration={0.8}>
              <h2 className="text-4xl sm:text-6xl font-black tracking-tight mt-1 text-white">
                The Earth In Motion
              </h2>
            </Reveal>
          </div>
          <div className="text-right text-xs font-mono text-zinc-400">
            <span>Altitude 4,167 m</span>
            <span className="block text-zinc-500">Himalayas, India</span>
          </div>
        </div>
      </div>

      {/* Scroll Progress Indicator Bar */}
      <div className="sticky top-0 z-40 w-full bg-[#0a0a0a]/95 backdrop-blur-md border-y border-zinc-800/80 px-6 py-2.5 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="text-zinc-400 font-medium">Scroll Progress</span>
            <div className="w-36 sm:w-64 h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-75"
                style={{ width: `${(progress * 100).toFixed(1)}%` }}
              />
            </div>
            <span className="font-bold text-zinc-200">{(progress * 100).toFixed(0)}%</span>
          </div>
          <span className="text-zinc-500 tracking-wider flex items-center gap-1 font-mono text-[11px]">
            SCROLL &darr;
          </span>
        </div>
      </div>

      {/* Main Editorial Content Body with Left Rail Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Rail Milestones with Dynamic Active Line */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-20">
          <div className="relative pl-6 py-2">
            {/* Background line */}
            <div className="absolute left-2.5 top-3 bottom-3 w-0.5 bg-zinc-800" />
            
            {/* Dynamic Active Progress Line */}
            <div
              className="absolute left-2.5 top-3 w-0.5 bg-blue-500 transition-all duration-300"
              style={{
                height: `${(activeMilestone / (MILESTONES.length - 1)) * 100}%`,
              }}
            />

            <div className="space-y-6 text-xs">
              {MILESTONES.map((m, idx) => {
                const isActive = activeMilestone === idx;
                const isPassed = activeMilestone >= idx;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => scrollToSection(m.id)}
                    className="group flex items-center gap-3 w-full text-left transition-colors cursor-pointer"
                  >
                    <span
                      className={`relative z-10 w-3 h-3 rounded-full border-2 transition-all ${
                        isActive
                          ? 'bg-blue-500 border-blue-400 scale-125 shadow-[0_0_10px_rgba(59,130,246,0.6)]'
                          : isPassed
                          ? 'bg-blue-600 border-blue-500'
                          : 'bg-zinc-950 border-zinc-700 group-hover:border-zinc-500'
                      }`}
                    />
                    <span
                      className={`transition-colors ${
                        isActive
                          ? 'text-zinc-100 font-bold'
                          : isPassed
                          ? 'text-zinc-300'
                          : 'text-zinc-500 group-hover:text-zinc-400'
                      }`}
                    >
                      {m.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right Story Sections - Smooth Flow Without Dead Gaps */}
        <div className="lg:col-span-9 space-y-16">
          {/* Section 1: A Fragile Balance */}
          <section id="fragile-balance" className="space-y-8 scroll-mt-24">
            <Reveal>
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 font-bold">
                  OUR PLANET
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-zinc-100 tracking-tight mt-1 mb-4">
                  A Fragile Balance
                </h2>
                <p className="text-base sm:text-lg text-zinc-400 font-light leading-relaxed max-w-2xl">
                  From the tallest mountains to the deepest oceans, Earth&apos;s systems are more connected than we imagine. Scroll to explore how every change affects everything.
                </p>
              </div>
            </Reveal>

            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-6 py-6 border-y border-zinc-800/80">
              <Reveal delay={0.1}>
                <div>
                  <span className="text-2xl sm:text-4xl font-black text-zinc-100 font-mono">8.7M</span>
                  <span className="text-xs text-zinc-500 block mt-1">Species on Earth</span>
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <div>
                  <span className="text-2xl sm:text-4xl font-black text-zinc-100 font-mono">71%</span>
                  <span className="text-xs text-zinc-500 block mt-1">Ocean Coverage</span>
                </div>
              </Reveal>
              <Reveal delay={0.3}>
                <div>
                  <span className="text-2xl sm:text-4xl font-black text-zinc-100 font-mono">1.1&deg;C</span>
                  <span className="text-xs text-zinc-500 block mt-1">Global Temp Rise</span>
                </div>
              </Reveal>
            </div>

            {/* Video / Scrub Frame Preview Card */}
            <div className="relative rounded-3xl overflow-hidden bg-zinc-900 text-zinc-200 shadow-2xl aspect-[16/9] max-h-[440px] flex items-center justify-center group border border-zinc-800">
              <Image
                src="/images/cinematic_landscape.jpg"
                alt="Earth overview"
                fill
                className={`object-cover transition-transform duration-700 ${
                  isPlayingVideo ? 'scale-105 filter brightness-105' : 'group-hover:scale-102 filter brightness-90'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />

              <div className="absolute top-4 left-6 flex items-center justify-between w-[calc(100%-48px)] text-xs font-mono text-zinc-400 z-10">
                <span>A CLOSER LOOK</span>
                <span>01 / 06</span>
              </div>

              <div className="relative z-10 flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                  className="w-16 h-16 rounded-full bg-black/40 group-hover:scale-110 border border-white/20 backdrop-blur-md flex items-center justify-center transition-transform cursor-pointer shadow-xl"
                >
                  <Play className={`w-6 h-6 text-white ml-0.5 ${isPlayingVideo ? 'text-blue-400 fill-blue-400' : 'fill-white'}`} />
                </button>
                <span className="text-xs font-mono tracking-widest text-zinc-300 uppercase">
                  {isPlayingVideo ? 'PLAYING PREVIEW' : 'SCROLL OR CLICK TO PLAY'}
                </span>
              </div>

              {/* Bottom Scrub Progress Line */}
              <div className="absolute bottom-4 left-6 right-6 h-1 bg-white/20 rounded-full overflow-hidden z-10">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-150"
                  style={{ width: `${Math.min(100, Math.max(15, progress * 100))}%` }}
                />
              </div>
            </div>
          </section>

          {/* Section 2: Pinned Section - Bigger Than Us (Using <Pin> and <Parallax>) */}
          <section id="the-scale" className="scroll-mt-24">
            <Pin top={64} className="relative rounded-3xl overflow-hidden bg-zinc-900 text-zinc-200 shadow-2xl p-8 sm:p-12 min-h-[420px] flex flex-col justify-between border border-zinc-800">
              <Parallax speed={-0.15} className="absolute inset-0">
                <Image
                  src="/images/parallax_fabric.jpg"
                  alt="Panoramic Forests"
                  fill
                  sizes="(max-width: 1200px) 100vw, 900px"
                  className="object-cover opacity-45"
                />
              </Parallax>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30 pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest text-blue-400 font-semibold">
                  THE SCALE
                </span>
                <span className="px-3 py-1 rounded-full bg-black/60 border border-white/20 text-xs font-mono text-zinc-300 backdrop-blur-sm">
                  📌 PINNED SECTION
                </span>
              </div>

              <Reveal className="relative z-10 max-w-xl my-6">
                <h3 className="text-4xl sm:text-6xl font-black tracking-tight mb-3 text-white">
                  Bigger Than Us
                </h3>
                <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
                  Vast forests. Deeper oceans. Higher mountains. A planet of incredible scale and interconnected systems.
                </p>
              </Reveal>

              <div className="relative z-10 grid grid-cols-3 gap-6 pt-6 border-t border-white/15">
                <div>
                  <span className="text-xl sm:text-3xl font-bold font-mono text-white">4.5B</span>
                  <span className="text-xs text-zinc-400 block mt-0.5">Years of history</span>
                </div>
                <div>
                  <span className="text-xl sm:text-3xl font-bold font-mono text-white">1</span>
                  <span className="text-xs text-zinc-400 block mt-0.5">Interconnected system</span>
                </div>
                <div>
                  <span className="text-xl sm:text-3xl font-bold font-mono text-white">100%</span>
                  <span className="text-xs text-zinc-400 block mt-0.5">Worth protecting</span>
                </div>
              </div>
            </Pin>
          </section>

          {/* Section 3: Changing Patterns - Interactive Glacier Sequence */}
          <section id="changing-patterns" className="space-y-6 scroll-mt-24">
            <Reveal>
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 font-bold">
                  CHANGING PATTERNS
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-zinc-100 tracking-tight mt-1 mb-3">
                  A Warming World
                </h2>
                <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed max-w-2xl mb-4">
                  Scroll through this sequence to see how landscapes are changing over time. This is powered by{' '}
                  <code className="px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-200 font-mono text-xs border border-zinc-800">
                    scrollsequence
                  </code>{' '}
                  &mdash; a frame-by-frame animation linked to your scroll position.
                </p>
                <button
                  type="button"
                  onClick={() => setSliderPos((p) => (p > 50 ? 20 : 80))}
                  className="px-4 py-2 rounded-full border border-zinc-800 bg-[#0a0a0a] hover:bg-zinc-800 text-xs font-semibold text-zinc-200 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Experience the Change</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </Reveal>

            {/* Interactive Glacier Drag Comparison */}
            <div
              className="relative w-full aspect-[16/9] max-h-[460px] rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 select-none bg-zinc-900 cursor-ew-resize"
              onMouseDown={() => (isDragging.current = true)}
              onMouseUp={() => (isDragging.current = false)}
              onMouseLeave={() => (isDragging.current = false)}
              onMouseMove={(e) => {
                if (isDragging.current) {
                  handleSliderMove(e.clientX, e.currentTarget.getBoundingClientRect());
                }
              }}
              onTouchMove={(e) => {
                const touch = e.touches[0];
                if (touch) {
                  handleSliderMove(touch.clientX, e.currentTarget.getBoundingClientRect());
                }
              }}
            >
              {/* After Image (2024 Lake) */}
              <div className="absolute inset-0">
                <Image
                  src="/images/cinematic_landscape.jpg"
                  alt="Glacier 2024"
                  fill
                  sizes="(max-width: 1200px) 100vw, 900px"
                  className="object-cover"
                />
                <div className="absolute top-4 right-4 px-3 py-1 rounded-md bg-black/80 text-zinc-100 text-xs font-mono font-bold border border-white/10">
                  2024
                </div>
              </div>

              {/* Before Image (2000 Ice) Clipped by sliderPos */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPos}%` }}
              >
                <div className="relative w-full h-full min-w-[600px]">
                  <Image
                    src="/images/hero-mountain.jpg"
                    alt="Glacier 2000"
                    fill
                    sizes="(max-width: 1200px) 100vw, 900px"
                    className="object-cover"
                  />
                </div>
                <div className="absolute top-4 left-4 px-3 py-1 rounded-md bg-black/80 text-zinc-100 text-xs font-mono font-bold border border-white/10">
                  2000
                </div>
              </div>

              {/* Center Divider Slider Handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.7)] pointer-events-none flex items-center justify-center -translate-x-1/2"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="w-8 h-8 rounded-full bg-white text-zinc-950 flex items-center justify-center text-xs font-bold shadow-lg">
                  &harr;
                </div>
              </div>
            </div>

            {/* Scroll-Driven Sequence Canvas */}
            <div className="pt-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                <span>SCROLL-LINKED FRAME SEQUENCE</span>
                <span>SCRUBBING VIA VIEWTIMELINE</span>
              </div>
              <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-black">
                <ScrollSequence
                  frames={[
                    '/images/hero-mountain.jpg',
                    '/images/parallax_fabric.jpg',
                    '/images/cinematic_landscape.jpg',
                    '/images/example-scale.jpg',
                  ]}
                  speed={1.5}
                  height="120vh"
                  className="rounded-2xl"
                />
              </div>
            </div>
          </section>

          {/* Section 4: What We Can Do - Small Actions. Big Impact. */}
          <section id="what-we-can-do" className="scroll-mt-24">
            <div className="relative rounded-3xl overflow-hidden bg-[#0a0a0a] border border-zinc-800 p-8 sm:p-12 shadow-2xl">
              <div className="absolute inset-0 opacity-20">
                <Image
                  src="/images/parallax_fabric.jpg"
                  alt="Forest canopy"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent pointer-events-none" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                    WHAT WE CAN DO
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-black text-zinc-100 tracking-tight leading-tight">
                    Small Actions. <br />Big Impact.
                  </h2>
                  <p className="text-sm text-zinc-400 font-light leading-relaxed">
                    A cleaner, healthier planet is possible &mdash; through better decisions, innovative solutions, and a more conscious tomorrow.
                  </p>
                  <button
                    type="button"
                    onClick={() => scrollToSection('brighter-tomorrow')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-100 text-zinc-950 text-xs font-semibold hover:bg-zinc-300 transition-colors shadow-sm"
                  >
                    <span>Explore Solutions</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 3 Glass Cards */}
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-md space-y-2">
                    <Leaf className="w-5 h-5 text-emerald-400" />
                    <h4 className="text-sm font-bold text-zinc-100">Cleaner Energy</h4>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed">
                      Power a sustainable and renewable future.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-md space-y-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    <h4 className="text-sm font-bold text-zinc-100">Stronger Communities</h4>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed">
                      People drive lasting, grassroots change.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-md space-y-2">
                    <Sun className="w-5 h-5 text-amber-400" />
                    <h4 className="text-sm font-bold text-zinc-100">Healthier Ecosystems</h4>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed">
                      A balanced and thriving tomorrow.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: A Brighter Tomorrow - The Next Chapter Is Ours */}
          <section id="brighter-tomorrow" className="pt-8 pb-16 border-t border-zinc-800/80 scroll-mt-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5">
                <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 font-bold">
                  A BRIGHTER TOMORROW
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-zinc-100 tracking-tight mt-1">
                  The Next Chapter <br />Is Ours
                </h2>
              </div>

              <div className="lg:col-span-7 space-y-5">
                <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
                  The story isn&apos;t over. With awareness, innovation, and action, we can create a healthier, more resilient planet for generations to come.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="/docs"
                    className="px-6 py-2.5 rounded-full bg-zinc-100 text-zinc-950 text-xs font-semibold hover:bg-zinc-300 transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="/docs"
                    className="px-5 py-2.5 rounded-full border border-zinc-800 bg-[#0a0a0a] hover:bg-zinc-800 text-zinc-300 text-xs font-semibold transition-colors"
                  >
                    Read the Docs
                  </a>
                </div>

                {/* Handwritten signature */}
                <div className="pt-4 flex items-center gap-3">
                  <span className="font-[family-name:var(--font-caveat)] text-2xl text-zinc-500">
                    Built for a better web.
                  </span>
                  <div className="w-12 h-0.5 bg-zinc-800" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
