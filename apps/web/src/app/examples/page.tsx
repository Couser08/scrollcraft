import type { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
  title: 'Examples & Recipes — ScrollCraft',
  description: 'Interactive scroll animation examples, recipes, and production-grade sandboxes for React and Next.js.',
};

export default function ExamplesPage() {
  return (
    <div className="relative w-full min-h-screen bg-[#050505] text-zinc-100 selection:bg-zinc-800 selection:text-white font-sans antialiased overflow-hidden flex flex-col">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-10 w-[500px] h-[300px] bg-indigo-600/10 blur-[120px] pointer-events-none -z-10" />

      {/* Header / Nav */}
      <header className="w-full border-b border-white/5 bg-[#050505]/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-5 h-5 rounded-full bg-blue-500 group-hover:scale-110 transition-transform shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
              <span className="text-lg font-bold text-white tracking-tight">ScrollCraft</span>
            </Link>
            <span className="text-zinc-600 text-xs font-mono">/</span>
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Examples</span>
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
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-16 flex flex-col items-center justify-center text-center">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono tracking-widest uppercase mb-8 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span>Interactive Showcase &bull; Coming Soon</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-white mb-6 leading-tight">
          Crafting the Blueprint <br />
          <span className="text-zinc-400">for Modern Motion.</span>
        </h1>

        <p className="text-base sm:text-lg text-zinc-400 max-w-xl mb-12 font-light leading-relaxed">
          We are polishing a full gallery of interactive production examples, from Apple-style device scrubbers to Awwwards-tier pinning choreography.
        </p>

        {/* Handcrafted Architectural Motion Blueprint SVG Illustration */}
        <div className="relative w-full max-w-3xl aspect-[16/9] rounded-3xl bg-[#09090b] border border-white/10 p-4 sm:p-8 overflow-hidden shadow-2xl group">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />
          
          <svg
            viewBox="0 0 800 450"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full relative z-10 select-none"
          >
            <defs>
              {/* Linear Gradients */}
              <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#6366f1" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Coordinate Axes & Ruler marks */}
            <line x1="80" y1="380" x2="720" y2="380" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
            <line x1="80" y1="60" x2="80" y2="380" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />

            {/* Horizontal Grid guidelines */}
            <line x1="80" y1="140" x2="720" y2="140" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 6" />
            <line x1="80" y1="220" x2="720" y2="220" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 6" />
            <line x1="80" y1="300" x2="720" y2="300" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 6" />

            {/* Vertical Phase Guides */}
            <line x1="240" y1="60" x2="240" y2="380" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 6" />
            <line x1="400" y1="60" x2="400" y2="380" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 6" />
            <line x1="560" y1="60" x2="560" y2="380" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 6" />

            {/* Phase Markers */}
            <text x="140" y="80" fill="rgba(255,255,255,0.4)" fontSize="11" fontFamily="monospace">PHASE 1: MEASURE</text>
            <text x="300" y="80" fill="rgba(255,255,255,0.4)" fontSize="11" fontFamily="monospace">PHASE 2: UPDATE</text>
            <text x="460" y="80" fill="rgba(255,255,255,0.4)" fontSize="11" fontFamily="monospace">PHASE 3: RENDER</text>
            <text x="620" y="80" fill="#60a5fa" fontSize="11" fontFamily="monospace">120 FPS GPU</text>

            {/* Bezier Velocity Curve Underlay Area */}
            <path
              d="M 80 380 Q 200 360 280 260 T 480 160 T 640 100 L 640 380 Z"
              fill="url(#areaGradient)"
            />

            {/* Main Interpolation Bezier Path */}
            <path
              d="M 80 380 Q 200 360 280 260 T 480 160 T 640 100"
              stroke="url(#curveGradient)"
              strokeWidth="3.5"
              fill="none"
              filter="url(#glow)"
            />

            {/* Secondary Damped Harmonic Spring Path */}
            <path
              d="M 80 380 C 180 340, 240 180, 360 190 S 480 240, 580 210 S 680 195, 720 195"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="1.5"
              strokeDasharray="6 4"
              fill="none"
            />

            {/* Interactive Kinetic Nodes */}
            <circle cx="280" cy="260" r="6" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
            <circle cx="480" cy="160" r="6" fill="#6366f1" stroke="#ffffff" strokeWidth="2" />
            <circle cx="640" cy="100" r="7" fill="#a855f7" stroke="#ffffff" strokeWidth="2" filter="url(#glow)" />

            {/* Coordinate Tooltips / Callouts */}
            <rect x="230" y="215" width="100" height="24" rx="4" fill="#18181b" stroke="rgba(255,255,255,0.2)" />
            <text x="240" y="231" fill="#e4e4e7" fontSize="10" fontFamily="monospace">t=0.33 [lerp]</text>

            <rect x="430" y="115" width="100" height="24" rx="4" fill="#18181b" stroke="rgba(255,255,255,0.2)" />
            <text x="440" y="131" fill="#e4e4e7" fontSize="10" fontFamily="monospace">t=0.66 [damp]</text>

            <rect x="590" y="55" width="100" height="24" rx="4" fill="#18181b" stroke="#a855f7" />
            <text x="600" y="71" fill="#ffffff" fontSize="10" fontFamily="monospace">t=1.00 [peak]</text>

            {/* Blueprint Dimensions & Crosshairs */}
            <circle cx="80" cy="380" r="3" fill="#ffffff" />
            <circle cx="720" cy="380" r="3" fill="#ffffff" />
            <circle cx="80" cy="60" r="3" fill="#ffffff" />
            <text x="88" y="395" fill="rgba(255,255,255,0.3)" fontSize="10" fontFamily="monospace">origin (0, 0)</text>
          </svg>

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <Link
            href="/docs"
            className="px-8 py-3.5 rounded-full bg-white text-black font-semibold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            Explore Documentation
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14m-7-7 7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/"
            className="px-8 py-3.5 rounded-full border border-white/15 text-white font-medium hover:bg-white/5 transition-colors text-sm"
          >
            Return to Homepage
          </Link>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full border-t border-white/5 py-8 text-center text-xs text-zinc-600">
        <span>&copy; {new Date().getFullYear()} ScrollCraft. Designed for the high-performance web.</span>
      </footer>
    </div>
  );
}
