import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ScrollCraftLogo } from '@/components/ui/scrollcraft-logo';
import { GithubIcon } from '@/components/ui/social-icons';
import {
  CheckCircle2,
  Clock,
  Shield,
  Zap,
  Heart,
  MessageSquare,
  Bug,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Roadmap & Architecture Plan | ScrollCraft',
  description:
    'The certified engineering roadmap for ScrollCraft. Explore current v0.1.1 Beta verification and upcoming v0.2.0 zero-jank architectural milestones.',
};

export default function RoadmapPage() {
  return (
    <div className="w-full min-h-screen bg-[#050505] text-zinc-100 flex flex-col font-sans selection:bg-violet-600/30 selection:text-white">
      {/* Sticky Header */}
      <header className="w-full border-b border-zinc-800/80 bg-[#050505]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6 sm:gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <ScrollCraftLogo variant="badge" badgeText="Beta" size="sm" />
            </Link>

            <nav className="flex items-center gap-2 text-xs font-medium">
              <Link
                href="/"
                className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/docs"
                className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
              >
                Docs
              </Link>
              <Link
                href="/showcase"
                className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
              >
                Showcase
              </Link>
              <Link
                href="/roadmap"
                className="px-3 py-1.5 rounded-lg bg-zinc-900 text-white font-semibold border border-zinc-800 shadow-xs"
              >
                Roadmap
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://discord.gg/scrollcraft"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
              aria-label="Discord Community"
              title="Join Discord Community"
            >
              <MessageSquare className="w-4 h-4" />
            </a>
            <a
              href="https://github.com/ScrollCraft/scrollcraft"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
              aria-label="GitHub Repository"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <Link
              href="/docs"
              className="px-4 py-2 rounded-full bg-white hover:bg-zinc-200 text-black text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>Read Docs</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-mono font-medium mb-6">
            <Shield className="w-3.5 h-3.5" />
            <span>Architecture &amp; Release Strategy</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
            ScrollCraft Roadmap
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed font-sans max-w-2xl mx-auto">
            Certified against the 8-Layer Engine Hardening Protocol and the Named Scroll-Timeline Architecture. Explore our current production release verification and upcoming zero-jank engineering milestones.
          </p>
        </div>

        {/* Milestone Cards Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {/* Current Milestone: v0.1.1 Beta */}
          <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-[#0c1410] to-[#070908] p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                  CURRENT MILESTONE
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/50 font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    LIVE
                  </span>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                    v0.1.1 Beta
                  </span>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 font-sans">
                Hardened Engine Baseline
              </h2>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans mb-6">
                Production-certified baseline featuring 101/101 automated test suites, Named Scroll-Timeline on <code className="text-emerald-400">:root</code>, 5-sample sorted median FPS benchmarks, and zero React Virtual DOM re-renders.
              </p>

              <div className="space-y-2.5 mb-6 text-xs font-mono text-zinc-300">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>8-Layer Hardening Protocol: 101/101 Tests Green</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Named Timeline on :root: 100% Container Clipping Immunity</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Core Throughput: 0.926ms / frame (1,080 FPS capacity)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Next.js 15.5.25 &amp; React 19 Full RSC Compatibility</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="font-mono text-xs text-zinc-300 flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                <span className="text-emerald-500 select-none">$</span>
                <code className="text-emerald-300 select-all font-semibold">npm install @scrollcraft/core@0.1.1</code>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded border border-emerald-500/30 font-semibold">
                Live on npm • Soak Period Active
              </span>
            </div>
          </div>

          {/* Upcoming Milestone: v0.2.0 Master Architecture */}
          <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-b from-[#110d1c] to-[#08070d] p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="text-xs font-mono uppercase tracking-widest text-violet-400 font-bold flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-violet-400" />
                  NEXT HORIZON (PLANNED)
                </span>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-semibold">
                  In Active Development
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 font-sans">
                v0.2.0 Zero-Jank Suite
              </h2>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans mb-6">
                Comprehensive motion expansion solving the 7 real-world browser footguns: mobile VRAM management, rubber-band guards, SSR race cancellations, and granular subpath packaging.
              </p>

              <div className="space-y-2.5 mb-6 text-xs font-mono text-zinc-300">
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                  <span>The 7 Production Footguns Solved (VRAM, iOS, Hydration)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                  <span>Superpowers across 9 Core Hooks (Dual API &amp; Bleed Math)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                  <span>ScrollCraft Inspector Studio &amp; DevTools Flamecharts</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                  <span>Granular Day-1 Subpath Bundles (&lt; 5 KB standalone)</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-violet-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <span className="text-xs text-zinc-400 font-sans">
                Architecture spec verified against engine invariants
              </span>
              <span className="text-[11px] font-mono text-violet-400 bg-violet-950/40 px-3 py-1 rounded border border-violet-500/30 font-semibold">
                Scope-Governed Progress
              </span>
            </div>
          </div>
        </div>

        {/* Section 1: v0.1.1 Beta Promotion & Community Funnel */}
        <section className="mb-20 rounded-2xl border border-zinc-800 bg-[#09090b] p-6 sm:p-10 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-emerald-400" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans">
              v0.1.1 Beta Release &amp; Promotion Criteria
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 text-sm text-zinc-300 font-sans leading-relaxed">
            <div>
              <h3 className="text-base font-semibold text-white mb-2 font-mono">
                Criteria-Based Stable Promotion
              </h3>
              <p className="text-zinc-400">
                Rather than relying on an arbitrary calendar date, <strong>v0.1.1 Beta</strong> enters a 1-week real-world soak period. If no critical regression or architectural defect is identified during community dogfooding, the release will be formally promoted to stable on npm.
              </p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white mb-2 font-mono">
                Structured Bug-Reporting Pipeline
              </h3>
              <p className="text-zinc-400">
                Community discussions and preliminary questions take place on our Discord server. To ensure no issue is lost in chat history, all reproducible defects and edge cases are triaged and tracked directly via <strong>GitHub Issues</strong>.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-zinc-800">
            <a
              href="https://discord.gg/scrollcraft"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Join Discord Community</span>
            </a>
            <a
              href="https://github.com/ScrollCraft/scrollcraft/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 hover:text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-2"
            >
              <Bug className="w-4 h-4 text-emerald-400" />
              <span>Report Issue on GitHub</span>
            </a>
            <span className="text-xs font-mono text-zinc-500 ml-auto">
              Package bug tracking: <code className="text-zinc-400">npm bugs @scrollcraft/core</code>
            </span>
          </div>
        </section>

        {/* Section 2: v0.2.0 Master Architecture Plan (In Active Development) */}
        <section className="mb-20">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase tracking-widest text-violet-400 font-bold block mb-2">
              Future Architecture (Planned)
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-sans tracking-tight mb-4">
              The 7 Production Footguns Solved in v0.2.0
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 font-sans max-w-2xl mx-auto">
              Engineered around natural module boundaries and strict runtime invariants. Here are the core failure classes scheduled for resolution in the upcoming major release:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
            {/* Footgun 1 */}
            <div className="p-6 rounded-2xl bg-[#09090b] border border-zinc-800/90 flex flex-col justify-between shadow-lg">
              <div>
                <div className="w-8 h-8 rounded-lg bg-violet-950/50 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-4 font-mono text-xs font-bold">
                  01
                </div>
                <h3 className="text-base font-semibold text-white mb-2 font-sans">
                  iOS Safari Rubber-Band Guard
                </h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Prevents navbar flicker during elastic bounce-back. If <code className="text-zinc-300">scrollY &lt;= 0</code>, direction is locked to <code className="text-zinc-300">&apos;up&apos;</code> with dual-threshold hysteresis.
                </p>
              </div>
              <span className="text-[10px] font-mono text-violet-400 mt-4 block">
                useScrollDirection hook
              </span>
            </div>

            {/* Footgun 2 */}
            <div className="p-6 rounded-2xl bg-[#09090b] border border-zinc-800/90 flex flex-col justify-between shadow-lg">
              <div>
                <div className="w-8 h-8 rounded-lg bg-violet-950/50 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-4 font-mono text-xs font-bold">
                  02
                </div>
                <h3 className="text-base font-semibold text-white mb-2 font-sans">
                  Mobile Safari 1GB VRAM Jetsam Guard
                </h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Eliminates mobile memory termination crashes. Implements an LRU cache maintaining only 15–20 decoded frames in memory, with DPR capped to 2.0.
                </p>
              </div>
              <span className="text-[10px] font-mono text-violet-400 mt-4 block">
                &lt;ScrollSequence /&gt; primitive
              </span>
            </div>

            {/* Footgun 3 */}
            <div className="p-6 rounded-2xl bg-[#09090b] border border-zinc-800/90 flex flex-col justify-between shadow-lg">
              <div>
                <div className="w-8 h-8 rounded-lg bg-violet-950/50 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-4 font-mono text-xs font-bold">
                  03
                </div>
                <h3 className="text-base font-semibold text-white mb-2 font-sans">
                  SSR Hydration &amp; Race Cancellation
                </h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Eliminates React Hydration #418/#425 and ghost text. State transitions from <code className="text-zinc-300">data-sc-reveal=&quot;pending&quot;</code> to <code className="text-zinc-300">&quot;active&quot;</code> upon hydration, instantly cancelling CSS fallback races.
                </p>
              </div>
              <span className="text-[10px] font-mono text-violet-400 mt-4 block">
                &lt;TextReveal /&gt; component
              </span>
            </div>

            {/* Footgun 4 */}
            <div className="p-6 rounded-2xl bg-[#09090b] border border-zinc-800/90 flex flex-col justify-between shadow-lg">
              <div>
                <div className="w-8 h-8 rounded-lg bg-violet-950/50 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-4 font-mono text-xs font-bold">
                  04
                </div>
                <h3 className="text-base font-semibold text-white mb-2 font-sans">
                  Dynamic Callback Ref Swapping
                </h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Prevents memory leaks during conditional renders. Captured node closures ensure the previously mounted element is safely unobserved even if ref.current mutates.
                </p>
              </div>
              <span className="text-[10px] font-mono text-violet-400 mt-4 block">
                Universal Dual API Guard
              </span>
            </div>

            {/* Footgun 5 */}
            <div className="p-6 rounded-2xl bg-[#09090b] border border-zinc-800/90 flex flex-col justify-between shadow-lg">
              <div>
                <div className="w-8 h-8 rounded-lg bg-violet-950/50 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-4 font-mono text-xs font-bold">
                  05
                </div>
                <h3 className="text-base font-semibold text-white mb-2 font-sans">
                  Variable Heights &amp; Pointer-Events Gating
                </h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Independently measures each card&apos;s unique offsetHeight to calculate custom pin durations. Inactive buried cards receive <code className="text-zinc-300">pointer-events: none</code> to prevent ghost clicks.
                </p>
              </div>
              <span className="text-[10px] font-mono text-violet-400 mt-4 block">
                &lt;StackedCards /&gt; primitive
              </span>
            </div>

            {/* Footgun 6 */}
            <div className="p-6 rounded-2xl bg-[#09090b] border border-zinc-800/90 flex flex-col justify-between shadow-lg">
              <div>
                <div className="w-8 h-8 rounded-lg bg-violet-950/50 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-4 font-mono text-xs font-bold">
                  06
                </div>
                <h3 className="text-base font-semibold text-white mb-2 font-sans">
                  Zero-GC Pre-Parsed Color Tuples
                </h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Eliminates regex garbage collection pauses during scroll. Pre-parses hex and rgba strings into numeric float tuples <code className="text-zinc-300">[r, g, b, a]</code> during Phase 1 (measure).
                </p>
              </div>
              <span className="text-[10px] font-mono text-violet-400 mt-4 block">
                &lt;ScrollTransform /&gt; color math
              </span>
            </div>
          </div>

          {/* Planned Hook Superpowers Grid */}
          <div className="rounded-2xl border border-zinc-800 bg-[#09090b] p-6 sm:p-8 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6 font-sans flex items-center gap-2">
              <Zap className="w-5 h-5 text-violet-400" />
              <span>Planned Superpowers across Existing Hooks</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-sans">
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60 space-y-1.5">
                <span className="font-mono font-bold text-violet-400">useParallax</span>
                <p className="text-zinc-400 leading-relaxed">
                  Universal Dual API, <code className="text-zinc-300">origin=&quot;auto&quot;</code> hero anti-jump, bleed container clipping, and multi-axis 3D scale/rotation.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60 space-y-1.5">
                <span className="font-mono font-bold text-violet-400">useReveal</span>
                <p className="text-zinc-400 leading-relaxed">
                  Atmospheric blur reveal (<code className="text-zinc-300">blur(8px) -&gt; 0</code>), 3D perspective tilt, auto-stagger indexing, and zero-rerender callbacks.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60 space-y-1.5">
                <span className="font-mono font-bold text-violet-400">usePin</span>
                <p className="text-zinc-400 leading-relaxed">
                  Auto pin-spacing without wrapper containers, 4-state lifecycle (onEnter, onLeave, onEnterBack, onLeaveBack), and zero-rerender progress value.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60 space-y-1.5">
                <span className="font-mono font-bold text-violet-400">useScrollTransform</span>
                <p className="text-zinc-400 leading-relaxed">
                  Built-in presets (&apos;zoom-in&apos;, &apos;3d-flip&apos;), unit freedom (&apos;vh&apos;, &apos;%&apos;, &apos;deg&apos;), and pre-parsed RGBA numeric tuples.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60 space-y-1.5">
                <span className="font-mono font-bold text-violet-400">useScrollDraw</span>
                <p className="text-zinc-400 leading-relaxed">
                  Universal SVG geometry support (&lt;path&gt;, &lt;rect&gt;, &lt;circle&gt;, &lt;polyline&gt;), dash array patterns, and direct DOM rendering.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60 space-y-1.5">
                <span className="font-mono font-bold text-violet-400">useMagnetic</span>
                <p className="text-zinc-400 leading-relaxed">
                  Dual API, subtle hover scale inflation, and multi-layer inner parallax (button icon moves faster than background).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Architecture & Attributions */}
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-950 via-zinc-950 to-[#07070a] p-6 sm:p-10 shadow-2xl relative overflow-hidden mb-16">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-8 border-b border-zinc-800/80 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-mono font-semibold uppercase tracking-widest text-violet-400">
                  ENGINEERING ARCHITECTURE &amp; PRIOR ART
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono font-medium">
                  Open Source Attributions
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Custom React Motion Core &bull; Inertia Normalization Prior Art
              </h3>
            </div>

            <a
              href="https://github.com/darkroomengineering/lenis"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-200 hover:text-white transition-all shrink-0 cursor-pointer"
            >
              <span>View Lenis Repository</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
            </a>
          </div>

          {/* Dual Architectural Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pillar 1: ScrollCraft In-House Core */}
            <div className="p-6 rounded-2xl bg-black/50 border border-zinc-800/80 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-950/60 border border-violet-500/30 flex items-center justify-center text-violet-300">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">
                    ScrollCraft Motion Core
                  </h4>
                  <span className="text-[11px] font-mono text-violet-400">
                    In-House React 19 Architecture
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                The centralized 3-Phase Ticker, direct DOM Transform Composer, and all declarative primitives (<code className="text-violet-300">&lt;Parallax&gt;</code>, <code className="text-violet-300">&lt;Pin&gt;</code>, <code className="text-violet-300">&lt;Reveal&gt;</code>, <code className="text-violet-300">&lt;StackedCards&gt;</code>, <code className="text-violet-300">&lt;ScrollSequence&gt;</code>) are custom systems built specifically for React 19 concurrency and Next.js 15 App Router streaming.
              </p>

              <div className="flex flex-wrap gap-2 pt-1 text-[10px] font-mono text-zinc-400">
                <span className="px-2 py-1 rounded-md bg-zinc-900 border border-zinc-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 3-Phase Ticker
                </span>
                <span className="px-2 py-1 rounded-md bg-zinc-900 border border-zinc-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> GPU Compositor
                </span>
                <span className="px-2 py-1 rounded-md bg-zinc-900 border border-zinc-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 0 Re-Render Invariant
                </span>
              </div>
            </div>

            {/* Pillar 2: Open Source Pedigree & Lenis Attributions */}
            <div className="p-6 rounded-2xl bg-black/50 border border-zinc-800/80 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                  <Heart className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">
                    Inertia Physics Prior Art
                  </h4>
                  <span className="text-[11px] font-mono text-zinc-400">
                    Studio Freight &amp; Clément Roche Lineage
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                Our virtual momentum calculations take mathematical inspiration from the pioneering work of Studio Freight&apos;s Lenis. We utilize these normalization principles to deliver smooth trackpad and wheel interpolation across platforms, wired directly into ScrollCraft&apos;s zero-rerender compositor pipeline.
              </p>

              <div className="flex flex-wrap gap-2 pt-1 text-[10px] font-mono text-zinc-400">
                <span className="px-2 py-1 rounded-md bg-zinc-900 border border-zinc-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Kinetic Physics
                </span>
                <span className="px-2 py-1 rounded-md bg-zinc-900 border border-zinc-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Cross-Browser Deltas
                </span>
                <span className="px-2 py-1 rounded-md bg-zinc-900 border border-zinc-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> MIT Collaboration
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-800/80 py-8 text-center text-xs text-zinc-500 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} ScrollCraft (v0.1.1 Beta). MIT Licensed.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-zinc-300 transition-colors">Home</Link>
            <Link href="/docs" className="hover:text-zinc-300 transition-colors">Docs</Link>
            <Link href="/showcase" className="hover:text-zinc-300 transition-colors">Showcase</Link>
            <Link href="/roadmap" className="hover:text-zinc-300 transition-colors">Roadmap</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
