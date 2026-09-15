'use client';

/**
 * ScrollCraft Showcase: "You Build. We Showcase."
 * Pure visual exhibition of real-world scroll architectures.
 * 100% Code-Free: No code viewers, no syntax snippets, zero clutter.
 * Rich bespoke SVG architectural illustrations with interactive category filtering.
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { Reveal } from '@scrollcraft/react';
import { 
  Sparkles, 
  Cpu, 
  ArrowUpRight,
  Send,
} from 'lucide-react';

type Category = 'all' | 'spatial' | 'editorial' | 'kinetic' | 'narrative';

interface ShowcaseItem {
  id: string;
  title: string;
  creator: string;
  category: Category;
  categoryLabel: string;
  badge: string;
  description: string;
  metrics: string[];
  illustrationType: 'spatial' | 'editorial' | 'kinetic' | 'pin' | 'orbital' | 'stack';
  accentColor: string;
}

const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: 'spatial-horizon',
    title: 'Aether Spatial 3D',
    creator: 'Studio Veloce',
    category: 'spatial',
    categoryLabel: 'Spatial 3D',
    badge: 'Three.js & R3F',
    description: 'A continuous WebGL camera flythrough anchored to document scroll depth without multi-RAF jitter or dropped frames.',
    metrics: ['Pull-based RAF', '60 FPS Fixed', 'Zero Garbage Collection'],
    illustrationType: 'spatial',
    accentColor: '#ff4d6d',
  },
  {
    id: 'chronos-editorial',
    title: 'Chronos Editorial Flow',
    creator: 'Atelier Monochrome',
    category: 'editorial',
    categoryLabel: 'Editorial',
    badge: 'Typographic Parallax',
    description: 'High-fashion editorial layout featuring sub-pixel typography tracking, multi-layer masks, and staggered paragraph reveals.',
    metrics: ['<Parallax speed={0.06}>', '<Reveal direction="up">', 'Sub-pixel Alignment'],
    illustrationType: 'editorial',
    accentColor: '#3b82f6',
  },
  {
    id: 'veloce-springs',
    title: 'Veloce Kinetic Springs',
    creator: 'Pulse Dynamics',
    category: 'kinetic',
    categoryLabel: 'Kinetic Physics',
    badge: 'Inertia & Friction',
    description: 'Organic scroll velocity translation driving real-time spring dampening, elastic tilt angles, and reactive gesture impulse curves.',
    metrics: ['useVelocity() Hook', 'Spring Physics', 'Direct Ref Writes'],
    illustrationType: 'kinetic',
    accentColor: '#10b981',
  },
  {
    id: 'nexus-narrative',
    title: 'Nexus Narrative Pinning',
    creator: 'Hyperion Labs',
    category: 'narrative',
    categoryLabel: 'Interactive Narrative',
    badge: 'Sticky Pin Scrubber',
    description: 'A multi-step product unveiling where the core engine viewport locks firmly in place while sequential technical annotations scrub past.',
    metrics: ['<Pin start="top top">', '+=150% Scroll Budget', 'Zero Layout Shift'],
    illustrationType: 'pin',
    accentColor: '#8b5cf6',
  },
  {
    id: 'helix-orbital',
    title: 'Helix Orbital Telemetry',
    creator: 'Aero Labs',
    category: 'kinetic',
    categoryLabel: 'Kinetic Physics',
    badge: 'SVG Path Morphing',
    description: 'Circular radar telemetry and concentric progress rings driven synchronously from normalized scroll coordinates.',
    metrics: ['<ScrollProgress>', 'SVG Offset Scrubbing', 'Zero Re-renders'],
    illustrationType: 'orbital',
    accentColor: '#06b6d4',
  },
  {
    id: 'stratum-depth',
    title: 'Stratum Exploded Stack',
    creator: 'Kinetics Studio',
    category: 'spatial',
    categoryLabel: 'Spatial 3D',
    badge: 'Compositor Engine',
    description: 'An architectural 4-layer planar breakdown showing true parallax depth separation, rendered entirely on isolated hardware compositor layers.',
    metrics: ['4 Elevation Planes', 'Matrix Compositing', 'GPU Isolated'],
    illustrationType: 'stack',
    accentColor: '#f59e0b',
  },
];

export function ShowcaseHub() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  const filteredItems = activeCategory === 'all'
    ? SHOWCASE_ITEMS
    : SHOWCASE_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <div className="w-full flex flex-col items-center justify-start">
      {/* Hero Header */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-12 text-center relative">
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        
        <Reveal direction="down" distance={20}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span className="uppercase tracking-widest text-[11px] font-semibold text-blue-400">CURATED EXHIBITION</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400 text-[11px]">BUILT WITH SCROLLCRAFT</span>
          </div>
        </Reveal>

        <Reveal direction="up" distance={25} delay={0.1}>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.08]">
            You Build. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">We Showcase.</span>
          </h1>
        </Reveal>

        <Reveal direction="up" distance={20} delay={0.2}>
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10">
            An inspiring exhibition of high-framerate, physics-driven web experiences built by creative developers and digital studios with ScrollCraft.
          </p>
        </Reveal>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {[
            { id: 'all', label: 'All Works' },
            { id: 'spatial', label: '3D & Spatial' },
            { id: 'editorial', label: 'Editorial' },
            { id: 'kinetic', label: 'Kinetic Physics' },
            { id: 'narrative', label: 'Interactive Narratives' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as Category)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-white text-black font-semibold shadow-lg scale-105'
                  : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Main Exhibition Grid */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <Reveal key={item.id} direction="up" distance={30} delay={idx * 0.08}>
              <div className="group rounded-2xl border border-zinc-800/80 bg-[#09090b] overflow-hidden flex flex-col hover:border-zinc-600 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 h-full">
                {/* Illustrative Art Canvas */}
                <div className="w-full h-56 bg-zinc-950 relative overflow-hidden border-b border-zinc-800/70 flex items-center justify-center p-6 select-none group-hover:bg-[#0c0c10] transition-colors">
                  {/* Subtle grid background */}
                  <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
                  
                  {/* Category Chip in top-left */}
                  <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900/90 border border-zinc-800 text-[10px] font-mono text-zinc-300 backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.accentColor }} />
                    <span>{item.categoryLabel}</span>
                  </div>

                  {/* Top-right Tech Badge */}
                  <div className="absolute top-3.5 right-3.5 z-10 text-[10px] font-mono text-zinc-500">
                    {item.badge}
                  </div>

                  {/* Bespoke SVG Architectural Illustration */}
                  <div className="relative w-full h-full flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                    {renderIllustration(item.illustrationType, item.accentColor)}
                  </div>
                </div>

                {/* Card Meta Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </h3>
                      <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                    </div>

                    <p className="text-xs font-mono text-zinc-500 mb-3">
                      By {item.creator}
                    </p>

                    <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                      {item.description}
                    </p>
                  </div>

                  {/* Architecture Badges */}
                  <div className="pt-4 border-t border-zinc-800/80 flex flex-wrap items-center gap-2">
                    {item.metrics.map((m, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Illustrative Architecture Blueprint Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="rounded-3xl border border-zinc-800/80 bg-gradient-to-b from-[#0a0a0e] to-[#050507] p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 mb-4">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              <span>THE ARCHITECTURAL BLUEPRINT</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
              How Projects Achieve Zero Re-Render Velocity
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              ScrollCraft decouples scroll input processing from the React reconciliation tree. Instead of pumping states through components on scroll, gestures flow through a deterministic microtask pipeline directly into hardware layers.
            </p>
          </div>

          {/* Flow Pipeline Graphic */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 relative flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider block mb-2">Stage 01</span>
                <h4 className="text-sm font-bold text-white mb-2">Gesture Ingestion</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">Normalized wheel, pointer, and touch delta captures with Lenis inertia dampening.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-800 text-[10px] font-mono text-zinc-500">Virtual Coordinate Pool</div>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 relative flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider block mb-2">Stage 02</span>
                <h4 className="text-sm font-bold text-white mb-2">4-Phase Scheduler</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">Deterministic batching: Measure, Driver, Update, and Render prevent layout thrashing.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-800 text-[10px] font-mono text-zinc-500">Single Unified RAF Loop</div>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 relative flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-wider block mb-2">Stage 03</span>
                <h4 className="text-sm font-bold text-white mb-2">Direct Ref Mutation</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">Transforms write straight to DOM elements and Three.js matrices without React renders.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-800 text-[10px] font-mono text-zinc-500">0 React Tree Passes</div>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 relative flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-2">Stage 04</span>
                <h4 className="text-sm font-bold text-white mb-2">GPU Compositing</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">Hardware composited transforms, opacity, and WebGL buffers sustain 120 FPS rendering.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-800 text-[10px] font-mono text-zinc-500">Sub-millisecond Frame Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Submission Banner */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="rounded-3xl border border-zinc-800 bg-[#070709] p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-hidden">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/40 border border-blue-500/20 text-xs font-mono text-blue-400 mb-4">
              <Send className="w-3.5 h-3.5" />
              <span>SUBMIT YOUR WORK</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
              Built Something Remarkable with ScrollCraft?
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Whether it&apos;s an immersive 3D spatial experience, an editorial narrative, or a high-velocity product launch, we&apos;d love to showcase your work in this curated gallery.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href="https://github.com/ScrollCraft/scrollcraft/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-colors text-center shadow-lg flex items-center justify-center gap-2"
            >
              <span>Submit Project</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <Link
              href="/docs"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 font-medium text-xs transition-colors text-center"
            >
              Explore Docs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * Renders bespoke SVG architectural illustrations for each showcase archetype
 */
function renderIllustration(type: ShowcaseItem['illustrationType'], accent: string) {
  switch (type) {
    case 'spatial':
      return (
        <svg viewBox="0 0 240 140" className="w-full h-full max-w-[240px] max-h-[140px]">
          <defs>
            <linearGradient id="grad-spatial" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={accent} stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <line x1="40" y1="120" x2="120" y2="70" stroke="#27272a" strokeWidth="1" />
          <line x1="200" y1="120" x2="120" y2="70" stroke="#27272a" strokeWidth="1" />
          <line x1="120" y1="20" x2="120" y2="70" stroke="#27272a" strokeWidth="1" strokeDasharray="3 3" />
          <polygon points="120,40 160,60 120,80 80,60" fill="url(#grad-spatial)" stroke={accent} strokeWidth="1.5" />
          <polygon points="80,60 120,80 120,115 80,95" fill="#18181b" fillOpacity="0.6" stroke={accent} strokeWidth="1.5" />
          <polygon points="160,60 120,80 120,115 160,95" fill="#27272a" fillOpacity="0.4" stroke={accent} strokeWidth="1.5" />
          <ellipse cx="120" cy="78" rx="65" ry="22" fill="none" stroke="#3f3f46" strokeWidth="1" strokeDasharray="4 4" />
          <ellipse cx="120" cy="78" rx="80" ry="28" fill="none" stroke={accent} strokeWidth="1" strokeOpacity="0.4" />
          <circle cx="175" cy="72" r="3.5" fill={accent} className="animate-pulse" />
        </svg>
      );

    case 'editorial':
      return (
        <svg viewBox="0 0 240 140" className="w-full h-full max-w-[240px] max-h-[140px]">
          <rect x="45" y="25" width="95" height="90" rx="6" fill="#18181b" stroke="#27272a" strokeWidth="1" />
          <rect x="55" y="35" width="40" height="4" rx="2" fill={accent} />
          <rect x="55" y="45" width="75" height="2.5" rx="1" fill="#3f3f46" />
          <rect x="55" y="52" width="65" height="2.5" rx="1" fill="#27272a" />
          <rect x="55" y="59" width="70" height="2.5" rx="1" fill="#27272a" />
          <rect x="105" y="45" width="90" height="75" rx="6" fill="#09090b" stroke={accent} strokeWidth="1.2" />
          <rect x="115" y="57" width="30" height="3" rx="1.5" fill={accent} />
          <rect x="115" y="66" width="70" height="2" rx="1" fill="#52525b" />
          <rect x="115" y="72" width="55" height="2" rx="1" fill="#3f3f46" />
          <text x="160" y="105" fill="#27272a" fontSize="26" fontFamily="serif" fontWeight="bold">Aa</text>
        </svg>
      );

    case 'kinetic':
      return (
        <svg viewBox="0 0 240 140" className="w-full h-full max-w-[240px] max-h-[140px]">
          <defs>
            <linearGradient id="grad-kinetic" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="50%" stopColor={accent} stopOpacity="0.9" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <line x1="30" y1="70" x2="210" y2="70" stroke="#27272a" strokeWidth="1" strokeDasharray="2 2" />
          <path
            d="M 30 70 Q 60 20, 90 70 T 150 70 T 180 65 T 210 70"
            fill="none"
            stroke="url(#grad-kinetic)"
            strokeWidth="2.5"
          />
          <circle cx="60" cy="20" r="3.5" fill={accent} />
          <line x1="60" y1="20" x2="60" y2="70" stroke={accent} strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.6" />
          <circle cx="120" cy="70" r="2.5" fill="#71717a" />
          <circle cx="150" cy="70" r="2.5" fill="#71717a" />
          <path d="M 60 14 L 60 6 M 57 9 L 60 6 L 63 9" stroke={accent} strokeWidth="1.5" fill="none" />
        </svg>
      );

    case 'pin':
      return (
        <svg viewBox="0 0 240 140" className="w-full h-full max-w-[240px] max-h-[140px]">
          <rect x="35" y="25" width="170" height="90" rx="8" fill="#09090b" stroke="#27272a" strokeWidth="1" />
          <rect x="45" y="35" width="55" height="70" rx="6" fill="#18181b" stroke={accent} strokeWidth="1.5" />
          <circle cx="72" cy="52" r="5" fill="none" stroke={accent} strokeWidth="1.5" />
          <rect x="68" y="52" width="8" height="7" rx="1" fill={accent} />
          <rect x="53" y="72" width="39" height="3" rx="1" fill="#71717a" />
          <rect x="53" y="80" width="28" height="2.5" rx="1" fill="#3f3f46" />
          <rect x="115" y="35" width="80" height="20" rx="4" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
          <rect x="115" y="60" width="80" height="20" rx="4" fill="#18181b" stroke="#27272a" strokeWidth="1" strokeOpacity="0.5" />
          <rect x="115" y="85" width="80" height="20" rx="4" fill="#18181b" stroke="#27272a" strokeWidth="1" strokeOpacity="0.3" />
        </svg>
      );

    case 'orbital':
      return (
        <svg viewBox="0 0 240 140" className="w-full h-full max-w-[240px] max-h-[140px]">
          <circle cx="120" cy="70" r="48" fill="none" stroke="#27272a" strokeWidth="1.5" />
          <circle cx="120" cy="70" r="34" fill="none" stroke="#27272a" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="120" cy="70" r="18" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
          <path
            d="M 120 22 A 48 48 0 1 1 78 94"
            fill="none"
            stroke={accent}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="78" cy="94" r="4" fill={accent} />
          <circle cx="120" cy="70" r="3" fill="#ffffff" />
        </svg>
      );

    case 'stack':
      return (
        <svg viewBox="0 0 240 140" className="w-full h-full max-w-[240px] max-h-[140px]">
          <polygon points="120,30 180,50 120,70 60,50" fill="#18181b" stroke="#27272a" strokeWidth="1" />
          <polygon points="120,48 180,68 120,88 60,68" fill="#27272a" fillOpacity="0.7" stroke="#3f3f46" strokeWidth="1" />
          <polygon points="120,66 180,86 120,106 60,86" fill="#18181b" fillOpacity="0.8" stroke={accent} strokeWidth="1.2" />
          <polygon points="120,84 180,104 120,124 60,104" fill="#09090b" stroke={accent} strokeWidth="1.8" />
          <line x1="120" y1="30" x2="120" y2="84" stroke={accent} strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.7" />
        </svg>
      );

    default:
      return null;
  }
}
