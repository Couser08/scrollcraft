'use client';

import React, { useRef, useEffect } from 'react';
import {
  StackedCards,
  VelocityMarquee,
  HorizontalScroll,
  TextReveal,
  Magnetic,
  SkewGallery,
  ScrollSequence,
  useScrollCraft,
} from '@scrollcraft/react';
import { Sparkles, Layers, Compass, Activity } from 'lucide-react';

// ==========================================
// 7. STACKED CARDS DEMO (True Cascade & Boundary Unpinning)
// ==========================================
export function StackedCardsDemoStage({ knobs }: { knobs: Record<string, any> }) {
  const offset = knobs.offset ?? 40;
  const top = knobs.top ?? 110;
  const scaleStep = knobs.scaleStep ?? 0.05;

  const cards = [
    <div key={1} className="w-full max-w-xl mx-auto h-72 rounded-3xl border border-violet-500/30 bg-[#0d0e15] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-violet-500/20 pb-4">
        <span className="text-xs font-mono text-violet-400 font-bold uppercase tracking-wider">
          Card 01 / Physics Solver
        </span>
        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
          Scale: 1.0 → 0.85
        </span>
      </div>
      <div>
        <h4 className="text-2xl font-black text-white">Hardware Compositor Deck</h4>
        <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
          Direct GPU matrix writes avoid React Virtual DOM reconciliation. As Card 02 stacks above, this card smoothly scales down with spring depth.
        </p>
      </div>
      <div className="flex items-center justify-between font-mono text-xs text-violet-300 pt-2 border-t border-zinc-800/80">
        <span>Z-Index: 01</span>
        <span className="text-emerald-400 font-bold">● Base Pinned Anchor</span>
      </div>
    </div>,

    <div key={2} className="w-full max-w-xl mx-auto h-72 rounded-3xl border border-sky-500/30 bg-[#0d0e15] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-sky-500/20 pb-4">
        <span className="text-xs font-mono text-sky-400 font-bold uppercase tracking-wider">
          Card 02 / Lifecycle Solvers
        </span>
        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
          Scale: 1.0 → 0.90
        </span>
      </div>
      <div>
        <h4 className="text-2xl font-black text-white">GSAP 4-State Lifecycle</h4>
        <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
          Arrives from below at 1.0 scale (larger than Card 01), stacks cleanly on top, and begins scaling down as Card 03 enters the viewport.
        </p>
      </div>
      <div className="flex items-center justify-between font-mono text-xs text-sky-300 pt-2 border-t border-zinc-800/80">
        <span>Z-Index: 02</span>
        <span className="text-sky-400 font-bold">● Mid-Tier Stacking</span>
      </div>
    </div>,

    <div key={3} className="w-full max-w-xl mx-auto h-72 rounded-3xl border border-emerald-500/30 bg-[#0d0e15] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
        <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
          Card 03 / Next.js Streaming
        </span>
        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          Scale: 1.0 → 0.95
        </span>
      </div>
      <div>
        <h4 className="text-2xl font-black text-white">Next.js App Router Native</h4>
        <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
          Survives React 19 RSC streaming and route hydration without layout jumps. Ghost clicks on buried cards are gated via pointer-events: none.
        </p>
      </div>
      <div className="flex items-center justify-between font-mono text-xs text-emerald-300 pt-2 border-t border-zinc-800/80">
        <span>Z-Index: 03</span>
        <span className="text-emerald-400 font-bold">● Upper Tier Stacking</span>
      </div>
    </div>,

    <div key={4} className="w-full max-w-xl mx-auto h-72 rounded-3xl border border-amber-500/30 bg-[#0d0e15] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
        <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
          Card 04 / Boundary Unpinning
        </span>
        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
          Scale: 1.0 (Full Size)
        </span>
      </div>
      <div>
        <h4 className="text-2xl font-black text-white">Deck Termination & Unpin</h4>
        <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
          When the runway finishes, the entire stack naturally unpins and scrolls away with the page. Never blocks subsequent content or documentation below.
        </p>
      </div>
      <div className="flex items-center justify-between font-mono text-xs text-amber-300 pt-2 border-t border-zinc-800/80">
        <span>Z-Index: 04</span>
        <span className="text-amber-400 font-bold">● Final Top Layer</span>
      </div>
    </div>,
  ];

  return (
    <div className="w-full pt-16 pb-24">
      <div className="text-center max-w-md mx-auto mb-16 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-xs font-mono">
          <Layers className="w-3.5 h-3.5" />
          <span>True Stacking Cascade (Sabse upar bada, scroll par chota)</span>
        </div>
        <h3 className="text-3xl font-extrabold text-white">Stacking Deck Solver</h3>
        <p className="text-xs text-zinc-400">
          Offset: {offset}px | Top: {top}px | ScaleStep: {scaleStep}
        </p>
      </div>

      <StackedCards
        key={`${offset}-${top}-${scaleStep}`}
        cards={cards}
        offset={offset}
        top={top}
        scaleStep={scaleStep}
        minScale={0.85}
        cardDistance={380}
      />
    </div>
  );
}

// ==========================================
// 8. VELOCITY MARQUEE DEMO
// ==========================================
export function VelocityMarqueeDemoStage({ knobs }: { knobs: Record<string, any> }) {
  const baseSpeed = knobs.baseSpeed ?? 1.5;
  const velocityMultiplier = knobs.velocityMultiplier ?? 0.3;

  return (
    <div className="w-full min-h-[160vh] pt-24 pb-32 flex flex-col justify-start">
      <div className="text-center max-w-md mx-auto mb-16 space-y-2">
        <span className="text-xs font-mono text-violet-400 uppercase tracking-widest">
          Flick Scroll to Accelerate
        </span>
        <h3 className="text-3xl font-extrabold text-white">Velocity Acceleration Ticker</h3>
        <p className="text-xs text-zinc-400">
          Base: {baseSpeed}px/frame | Multiplier: {velocityMultiplier}
        </p>
      </div>

      <div className="space-y-6 w-full overflow-hidden">
        {/* Strip 1 (Left Direction) */}
        <VelocityMarquee
          key={`strip1-${baseSpeed}-${velocityMultiplier}`}
          baseSpeed={baseSpeed}
          velocityMultiplier={velocityMultiplier}
          direction="left"
          className="py-4 border-y border-zinc-800 bg-zinc-950/80 backdrop-blur-md"
        >
          <div className="flex items-center gap-12 font-mono text-2xl font-bold uppercase tracking-wider text-zinc-300">
            <span>⚡ SCROLLCRAFT ENGINE</span>
            <span className="text-violet-400">120 FPS MOTION</span>
            <span>ZERO REACT RE-RENDERS</span>
            <span className="text-emerald-400">HARDWARE COMPOSITOR</span>
          </div>
        </VelocityMarquee>

        {/* Strip 2 (Right Direction) */}
        <VelocityMarquee
          key={`strip2-${baseSpeed}-${velocityMultiplier}`}
          baseSpeed={baseSpeed}
          velocityMultiplier={velocityMultiplier}
          direction="right"
          className="py-4 border-y border-zinc-800 bg-zinc-950/80 backdrop-blur-md"
        >
          <div className="flex items-center gap-12 font-mono text-2xl font-bold uppercase tracking-wider text-zinc-400">
            <span className="text-fuchsia-400">VELOCITY ACCELERATION</span>
            <span>GSAP 4-STATE PARITY</span>
            <span className="text-sky-400">REACT 19 COMPATIBLE</span>
            <span>STRICT ENGINE ARCHITECTURE</span>
          </div>
        </VelocityMarquee>
      </div>

      <div className="max-w-md mx-auto mt-24 p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 text-center font-mono text-xs text-zinc-400">
        Scroll rapidly up and down to observe the spring momentum decay back to cruise speed.
      </div>
    </div>
  );
}

// ==========================================
// 9. HORIZONTAL SCROLL DEMO (7 Rich Cards & Smooth Continuous Pan)
// ==========================================
export function HorizontalScrollDemoStage({ knobs }: { knobs: Record<string, any> }) {
  const speed = knobs.speed ?? 1.5;

  const slides = [
    {
      badge: '01 / HARDWARE ENGINE',
      title: 'Compositor Matrix Pipeline',
      desc: 'Direct GPU translate3d writes bypass Virtual DOM reconciliation for guaranteed 120 FPS motion fidelity.',
      color: 'from-violet-950/90 via-zinc-900 to-black border-violet-500/40',
      accent: 'text-violet-400',
    },
    {
      badge: '02 / RE-RENDER AUDIT',
      title: 'Zero Virtual DOM Thrash',
      desc: 'Synchronous render audit tracker verifies strict 0 re-renders during high-frequency scrolling gestures.',
      color: 'from-sky-950/90 via-zinc-900 to-black border-sky-500/40',
      accent: 'text-sky-400',
    },
    {
      badge: '03 / LIFECYCLE PARITY',
      title: 'GSAP 4-State Solvers',
      desc: 'onEnter, onLeave, onEnterBack, and onLeaveBack execution in centralized Ticker Phase 3.',
      color: 'from-emerald-950/90 via-zinc-900 to-black border-emerald-500/40',
      accent: 'text-emerald-400',
    },
    {
      badge: '04 / MODERN STACK',
      title: 'Next.js 15 RSC Streaming',
      desc: 'Survives React 19 server component streaming, concurrent hydration, and dynamic DOM expansion without jumps.',
      color: 'from-fuchsia-950/90 via-zinc-900 to-black border-fuchsia-500/40',
      accent: 'text-fuchsia-400',
    },
    {
      badge: '05 / PHYSICAL DYNAMICS',
      title: 'Spring Momentum Damping',
      desc: 'Physics-based inertia with zero layout shift. Velocity decay smoothly restores baseline speed.',
      color: 'from-amber-950/90 via-zinc-900 to-black border-amber-500/40',
      accent: 'text-amber-400',
    },
    {
      badge: '06 / HIGH DPI RETINA',
      title: 'Dynamic Device Pixel Ratio',
      desc: 'Sub-pixel crispness with dynamic maxDpr clamping and LRU canvas frame caching.',
      color: 'from-rose-950/90 via-zinc-900 to-black border-rose-500/40',
      accent: 'text-rose-400',
    },
    {
      badge: '07 / BUNDLE INTEGRITY',
      title: 'Sub-650 LOC Architecture',
      desc: 'Strictly audited file size guarantee ensures zero bundle bloat and clean modular treeshaking.',
      color: 'from-cyan-950/90 via-zinc-900 to-black border-cyan-500/40',
      accent: 'text-cyan-400',
    },
  ];

  return (
    <div className="w-full">
      <div className="max-w-md mx-auto text-center py-12 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-xs font-mono">
          <Compass className="w-3.5 h-3.5" />
          <span>Smooth Continuous Panoramic Pan (7 Slides)</span>
        </div>
        <h3 className="text-3xl font-extrabold text-white">Panoramic Deck Slider</h3>
        <p className="text-xs text-zinc-400">
          Scroll down continuously to slide through all 7 slides with zero jitter or abrupt stops.
        </p>
      </div>

      <HorizontalScroll key={speed} speed={speed} height="350vh" className="w-full">
        <div className="flex gap-8 px-12 items-center">
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={`w-[460px] h-[380px] flex-shrink-0 rounded-3xl border ${slide.color} glass-card p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden`}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className={`text-xs font-mono font-bold tracking-wider ${slide.accent}`}>
                  {slide.badge}
                </span>
                <span className="text-xs font-mono text-zinc-500">
                  SLIDE 0{idx + 1} / 07
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl font-black text-white">{slide.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{slide.desc}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5 font-mono text-xs">
                <span className="text-zinc-500">Speed: {speed}x</span>
                <span className={slide.accent}>Pan Active →</span>
              </div>
            </div>
          ))}
        </div>
      </HorizontalScroll>
    </div>
  );
}

// ==========================================
// 10. SCROLL SEQUENCE DEMO (Luxury Chrono Watch Product Reveal)
// ==========================================
export function ScrollSequenceDemoStage({ knobs }: { knobs: Record<string, any> }) {
  const speed = knobs.speed ?? 1;
  const maxDpr = knobs.maxDpr ?? 2;
  const fit = (knobs.fit as 'contain' | 'cover') ?? 'contain';
  const FRAME_COUNT = 90;

  const frames = React.useMemo(
    () =>
      Array.from({ length: FRAME_COUNT }, (_, i) =>
        `/sequence/chrono-watch/frame-${String(i + 1).padStart(3, '0')}.webp`
      ),
    []
  );

  return (
    <div className="relative w-full bg-black">
      <ScrollSequence
        key={`${fit}-${speed}-${maxDpr}`}
        frames={frames}
        speed={speed}
        maxDpr={maxDpr}
        fit={fit}
        poster="/sequence/chrono-watch/poster.webp"
        height="400vh"
        className="w-full"
      >
        {/* Top Hero Overlay */}
        <div className="pointer-events-none absolute inset-x-0 top-10 sm:top-14 z-20 flex flex-col items-center justify-center text-center px-4">
          <span className="text-xs uppercase tracking-widest text-zinc-400 font-mono">
            Chrono · Automatic
          </span>
          <h1 className="mt-2 text-4xl sm:text-6xl font-light tracking-tight text-white">
            Engineered Precision.
          </h1>
          <p className="mt-2 max-w-md text-xs sm:text-sm text-zinc-400">
            Scroll to explore the 360° internal mechanics, ceramic tachymeter bezel, and high-frequency escapement.
          </p>
        </div>

        {/* Floating Spec Badges Left & Right (Mid-Scroll visual interest) */}
        <div className="pointer-events-none absolute inset-y-0 left-6 sm:left-12 z-20 hidden md:flex flex-col justify-center gap-4">
          <div className="p-3.5 rounded-2xl glass-card max-w-[220px]">
            <div className="text-[10px] font-mono text-violet-400 uppercase tracking-wider font-bold">
              Sapphire Crystal
            </div>
            <div className="text-xs text-zinc-300 mt-1">
              Double AR anti-reflective coating with diamond specular sweep
            </div>
          </div>
          <div className="p-3.5 rounded-2xl glass-card max-w-[220px]">
            <div className="text-[10px] font-mono text-sky-400 uppercase tracking-wider font-bold">
              Titanium Grade 5
            </div>
            <div className="text-xs text-zinc-300 mt-1">
              Lightweight aerospace case with satin-brushed bevels
            </div>
          </div>
        </div>

        {/* Bottom Specs Overlay */}
        <div className="pointer-events-none absolute inset-x-0 bottom-10 sm:bottom-14 z-20 flex justify-around text-center max-w-4xl mx-auto px-6">
          <div className="p-3.5 rounded-2xl glass-card min-w-[110px]">
            <div className="text-xl sm:text-2xl font-bold text-white font-mono">36,000</div>
            <div className="text-[10px] sm:text-xs text-zinc-400 font-mono mt-0.5">VPH BEAT RATE</div>
          </div>
          <div className="p-3.5 rounded-2xl glass-card min-w-[110px]">
            <div className="text-xl sm:text-2xl font-bold text-white font-mono">68 HRS</div>
            <div className="text-[10px] sm:text-xs text-zinc-400 font-mono mt-0.5">POWER RESERVE</div>
          </div>
          <div className="p-3.5 rounded-2xl glass-card min-w-[110px]">
            <div className="text-xl sm:text-2xl font-bold text-white font-mono">300 M</div>
            <div className="text-[10px] sm:text-xs text-zinc-400 font-mono mt-0.5">WATER RESISTANCE</div>
          </div>
        </div>
      </ScrollSequence>
    </div>
  );
}

// ==========================================
// 11. TEXT REVEAL DEMO (BaseOpacity 0 & 3D Perspective Rotation)
// ==========================================
export function TextRevealDemoStage({ knobs }: { knobs: Record<string, any> }) {
  const by = knobs.by ?? 'chars';
  const blur = knobs.blur ?? 0;
  const rotateX = knobs.rotateX ?? 35;

  return (
    <div className="w-full flex flex-col items-center justify-start pt-16 pb-32 px-6">
      {/* Top Entrance Intro */}
      <div className="max-w-md mx-auto text-center mb-28 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-xs font-mono">
          <span>Natural Document Flow • No Sticky Locking</span>
        </div>
        <h3 className="text-2xl font-bold text-white">Editorial Typography Reveal</h3>
        <p className="text-xs text-zinc-400 leading-relaxed">
          In mature production sites, text reveals naturally as the user scrolls down through the viewport reading zone — with zero artificial section pinning.
        </p>
        <div className="inline-flex items-center gap-1 font-mono text-xs text-emerald-400 pt-2">
          <span>↓ Scroll down to read editorial copy</span>
        </div>
      </div>

      {/* Reveal Target in Normal Document Flow */}
      <div className="max-w-4xl mx-auto text-center space-y-8 my-20 p-8 sm:p-14 rounded-3xl bg-[#0c0d12] border border-zinc-800/80 shadow-2xl">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-violet-400">
          <span>Kinetic Typographic Split</span>
          <span className="text-zinc-600">•</span>
          <span>by="{by}"</span>
          <span className="text-zinc-600">•</span>
          <span>rotateX: {rotateX}°</span>
        </div>

        <TextReveal
          key={`${by}-${blur}-${rotateX}`}
          by={by}
          blur={blur}
          scale={0.92}
          rotateX={rotateX}
          baseOpacity={0.15}
          className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight"
        >
          Declarative scroll physics with zero React re-renders. Every single character illuminates and flips in 3D perspective space in lockstep with your gesture.
        </TextReveal>
      </div>

      {/* Trailing Section demonstrating unblocked scroll */}
      <div className="max-w-md mx-auto text-center mt-24 space-y-2 text-zinc-500 font-mono text-xs">
        <span className="text-emerald-400 font-bold">✓ Natural Flow Verified</span>
        <p className="text-zinc-400 font-sans text-xs">
          The page continues scrolling freely past the typography with zero scroll hijacking or sticky trapping.
        </p>
      </div>
    </div>
  );
}

// ==========================================
// 12. MAGNETIC DEMO
// ==========================================
export function MagneticDemoStage({ knobs }: { knobs: Record<string, any> }) {
  const strength = knobs.strength ?? 0.35;
  const radius = knobs.radius ?? 160;
  const stiffness = knobs.stiffness ?? 180;
  const innerIconRef = useRef<HTMLSpanElement>(null);

  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center gap-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono text-violet-400 uppercase tracking-widest">
          Hover Cursor Near Button
        </span>
        <h3 className="text-3xl font-extrabold text-white">Spring Magnetic Attraction</h3>
      </div>

      <Magnetic
        key={`${strength}-${radius}-${stiffness}`}
        strength={strength}
        radius={radius}
        stiffness={stiffness}
        damping={15}
        scale={1.08}
        innerTargetRef={innerIconRef}
        innerStrength={0.65}
      >
        <button className="relative group px-10 py-5 rounded-full border border-violet-500/40 bg-zinc-900/95 text-white font-bold text-lg shadow-2xl backdrop-blur-xl flex items-center gap-4 hover:border-violet-400 transition-colors cursor-pointer">
          <span>Magnetic Target</span>
          <span ref={innerIconRef} className="p-2 rounded-full bg-violet-600/30 text-violet-300">
            <Sparkles className="w-5 h-5" />
          </span>
        </button>
      </Magnetic>
    </div>
  );
}

// ==========================================
// 13. SKEW GALLERY DEMO (Default 1.8 Intensity & Live Telemetry Gauge)
// ==========================================
export function SkewGalleryDemoStage({ knobs }: { knobs: Record<string, any> }) {
  const intensity = knobs.intensity ?? 1.8;
  const { subscribe } = useScrollCraft();

  const skewDegRef = useRef<HTMLSpanElement>(null);
  const velocityRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const unsub = subscribe((metrics: any) => {
      const v = metrics.velocity;
      const angle = Math.max(-12, Math.min(12, v * intensity));
      if (skewDegRef.current) {
        skewDegRef.current.textContent = `${angle >= 0 ? '+' : ''}${angle.toFixed(2)}°`;
        skewDegRef.current.className = `font-bold ${
          Math.abs(angle) > 1 ? 'text-violet-400' : 'text-zinc-400'
        }`;
      }
      if (velocityRef.current) {
        velocityRef.current.textContent = `${Math.abs(v).toFixed(2)} px/ms`;
      }
    });

    return unsub;
  }, [subscribe, intensity]);

  const images = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
  ];

  return (
    <div className="w-full max-w-5xl mx-auto min-h-[220vh] py-16 px-4">
      <div className="text-center max-w-md mx-auto mb-10 space-y-2">
        <span className="text-xs font-mono text-violet-400 uppercase tracking-widest">
          Flick Scroll to Skew Matrix
        </span>
        <h3 className="text-3xl font-extrabold text-white">Dynamic Velocity Skew</h3>
        <p className="text-xs text-zinc-400">
          Scroll velocity dynamically skews the gallery cards. When scrolling ceases, spring damping restores 0°.
        </p>

        {/* Live Physics HUD Gauge */}
        <div className="inline-flex items-center gap-4 px-4 py-2 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-xs font-mono mt-4">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-zinc-500">SKEW:</span>
            <span ref={skewDegRef} className="text-violet-400 font-bold">+0.00°</span>
          </div>
          <span className="text-zinc-700">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500">VELOCITY:</span>
            <span ref={velocityRef} className="text-emerald-400 font-bold">0.00 px/ms</span>
          </div>
        </div>
      </div>

      <SkewGallery key={intensity} images={images} intensity={intensity} />
    </div>
  );
}
