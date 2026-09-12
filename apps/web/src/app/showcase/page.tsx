import type { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
  title: 'Showcase — ScrollCraft',
  description: 'Explore community and flagship scroll experiences built with ScrollCraft.',
};

export default function ShowcasePage() {
  const showcaseItems = [
    {
      title: 'Infinite Velocity Marquee',
      category: 'Typography & Physics',
      description: 'Scroll-reactive infinite ticker with frame-rate independent physics and zero React re-renders.',
      tag: 'Interactive',
    },
    {
      title: 'Apple-Style Canvas Scrubber',
      category: 'Sequence & Hardware Acceleration',
      description: 'High-DPI canvas frame sequencing with preloader, memory pool, and responsive resizing.',
      tag: 'Hardware',
    },
    {
      title: 'Multi-Axis Parallax Depth',
      category: 'Visual Composition',
      description: 'Layered horizontal & vertical parallax driven directly by GPU compositor transforms.',
      tag: '3D Depth',
    },
    {
      title: 'Cascading Sticky Cards',
      category: 'Narrative Storytelling',
      description: 'Zero-spacer sticky stacking with smooth scale damping and perspective layering.',
      tag: 'Storytelling',
    },
  ];

  return (
    <div className="relative w-full min-h-screen bg-[#050505] text-zinc-100 selection:bg-zinc-800 selection:text-white font-sans antialiased overflow-hidden flex flex-col">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/10 blur-[130px] pointer-events-none -z-10" />

      {/* Header / Nav */}
      <header className="w-full border-b border-white/5 bg-[#050505]/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-5 h-5 rounded-full bg-blue-500 group-hover:scale-110 transition-transform shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
              <span className="text-lg font-bold text-white tracking-tight">ScrollCraft</span>
            </Link>
            <span className="text-zinc-600 text-xs font-mono">/</span>
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Showcase</span>
          </div>

          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/docs" className="text-zinc-400 hover:text-white transition-colors">
              Docs
            </Link>
            <Link
              href="/"
              className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs transition-colors flex items-center gap-1.5"
            >
              <span>&larr;</span> Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-16 flex flex-col items-center">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono tracking-widest uppercase mb-8 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span>Curated Gallery &bull; In Active Development</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-white mb-6 text-center leading-tight">
          The Gallery of Motion.
        </h1>

        <p className="text-base sm:text-lg text-zinc-400 max-w-xl text-center mb-16 font-light leading-relaxed">
          Explore flagship patterns built with ScrollCraft's 3-phase ticker engine and native React primitives.
        </p>

        {/* Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {showcaseItems.map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-3xl bg-[#09090b] border border-white/10 p-8 flex flex-col justify-between hover:border-white/20 transition-all duration-300 overflow-hidden shadow-xl"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl group-hover:bg-blue-500/10 transition-colors pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-zinc-500">{item.category}</span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-white/5 border border-white/10 text-zinc-300">
                    {item.tag}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h2>
                <p className="text-sm text-zinc-400 leading-relaxed font-light mb-8">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <span className="text-xs font-mono text-zinc-500">Live Demo Sandbox</span>
                <Link
                  href="/docs"
                  className="text-xs font-semibold text-white group-hover:translate-x-1 transition-transform flex items-center gap-1.5"
                >
                  View in Docs <span>&rarr;</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-16 flex flex-col sm:flex-row gap-4">
          <Link
            href="/docs"
            className="px-8 py-3.5 rounded-full bg-white text-black font-semibold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            Read API Reference
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14m-7-7 7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/"
            className="px-8 py-3.5 rounded-full border border-white/15 text-white font-medium hover:bg-white/5 transition-colors text-sm"
          >
            Back to Home
          </Link>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full border-t border-white/5 py-8 text-center text-xs text-zinc-600">
        <span>&copy; {new Date().getFullYear()} ScrollCraft. The declarative React scroll engine.</span>
      </footer>
    </div>
  );
}
