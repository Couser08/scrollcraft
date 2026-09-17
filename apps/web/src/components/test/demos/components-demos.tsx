'use client';

import React, { useRef, useEffect, useState } from 'react';
import {
  StackedCards,
  VelocityMarquee,
  HorizontalScroll,
  TextReveal,
  Magnetic,
  SkewGallery,
  useScrollCraft,
} from '@scrollcraft/react';
import {
  Sparkles,
  Layers,
  Compass,
  Activity,
  Zap,
  Smartphone,
  Sliders,
  CheckCircle2,
  ArrowDown,
} from 'lucide-react';

// ==========================================
// 7. STACKED CARDS DEMO (True Cascade & Boundary Unpinning)
// ==========================================
export function StackedCardsDemoStage({ knobs }: { knobs: Record<string, any> }) {
  const offset = knobs.offset ?? 40;
  const top = knobs.top ?? 110;
  const scaleStep = knobs.scaleStep ?? 0.05;

  const cards = [
    <div key={1} className="w-full max-w-xl mx-auto h-72 rounded-3xl border border-violet-500/40 bg-gradient-to-br from-violet-950/95 via-zinc-900 to-black p-8 shadow-2xl backdrop-blur-2xl flex flex-col justify-between">
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
        <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
          Direct GPU matrix writes avoid React Virtual DOM reconciliation. As Card 02 stacks above, this card smoothly scales down with spring depth.
        </p>
      </div>
      <div className="flex items-center justify-between font-mono text-xs text-violet-300 pt-2 border-t border-zinc-800/80">
        <span>Z-Index: 01</span>
        <span className="text-emerald-400 font-bold">● Base Pinned Anchor</span>
      </div>
    </div>,

    <div key={2} className="w-full max-w-xl mx-auto h-72 rounded-3xl border border-sky-500/40 bg-gradient-to-br from-sky-950/95 via-zinc-900 to-black p-8 shadow-2xl backdrop-blur-2xl flex flex-col justify-between">
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
        <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
          Arrives from below at 1.0 scale (larger than Card 01), stacks cleanly on top, and begins scaling down as Card 03 enters the viewport.
        </p>
      </div>
      <div className="flex items-center justify-between font-mono text-xs text-sky-300 pt-2 border-t border-zinc-800/80">
        <span>Z-Index: 02</span>
        <span className="text-sky-400 font-bold">● Mid-Tier Stacking</span>
      </div>
    </div>,

    <div key={3} className="w-full max-w-xl mx-auto h-72 rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/95 via-zinc-900 to-black p-8 shadow-2xl backdrop-blur-2xl flex flex-col justify-between">
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
        <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
          Survives React 19 RSC streaming and route hydration without layout jumps. Ghost clicks on buried cards are gated via pointer-events: none.
        </p>
      </div>
      <div className="flex items-center justify-between font-mono text-xs text-emerald-300 pt-2 border-t border-zinc-800/80">
        <span>Z-Index: 03</span>
        <span className="text-emerald-400 font-bold">● Upper Tier Stacking</span>
      </div>
    </div>,

    <div key={4} className="w-full max-w-xl mx-auto h-72 rounded-3xl border border-amber-500/40 bg-gradient-to-br from-amber-950/95 via-zinc-900 to-black p-8 shadow-2xl backdrop-blur-2xl flex flex-col justify-between">
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
        <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
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

      <HorizontalScroll key={speed} speed={speed} className="w-full">
        <div className="flex gap-8 px-12 items-center">
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={`w-[460px] h-[380px] flex-shrink-0 rounded-3xl border ${slide.color} p-8 flex flex-col justify-between shadow-2xl backdrop-blur-xl relative overflow-hidden`}
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
// 10. SCROLL SEQUENCE DEMO (Interactive 3-Column Storytelling Pipeline)
// ==========================================
export function ScrollSequenceDemoStage({ knobs }: { knobs: Record<string, any> }) {
  void knobs;
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const { scrollTo, subscribe } = useScrollCraft();

  useEffect(() => {
    const unsub = subscribe(() => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const scrolledInto = -rect.top;
      const progress = Math.min(Math.max(scrolledInto / totalScrollable, 0), 1);

      let step = 0;
      if (progress >= 0.72) step = 3;
      else if (progress >= 0.45) step = 2;
      else if (progress >= 0.18) step = 1;
      else step = 0;

      setActiveStep(step);
    });

    return unsub;
  }, [subscribe]);

  const glideToStep = (targetStep: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const currentScroll = window.scrollY || window.pageYOffset || 0;
    const containerTop = rect.top + currentScroll;
    const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
    const stepFractions = [0, 0.28, 0.58, 0.88];
    const targetY = containerTop + (stepFractions[targetStep] ?? 0) * totalScrollable;
    scrollTo(targetY, { duration: 0.8 });
  };

  const stepsData = [
    {
      num: '01 / 04',
      title: 'Pure Sound',
      subtitle: 'Engineered for clarity.',
      desc: 'Precision balanced acoustic profile.',
    },
    {
      num: '02 / 04',
      title: 'Crafted in Detail',
      subtitle: 'Every curve has a purpose.',
      desc: 'Anodized aluminum with memory foam isolation.',
    },
    {
      num: '03 / 04',
      title: 'More Than Sound',
      subtitle: 'Precision driver. Deeper experience.',
      desc: '40mm custom beryllium dynamic drivers.',
    },
    {
      num: '04 / 04',
      title: 'Feel the Difference',
      subtitle: 'Immersive spatial soundscape.',
      desc: 'Obsidian flagship edition.',
    },
  ];

  return (
    <div ref={containerRef} className="w-full relative min-h-[260vh] pb-32">
      {/* Sticky 3-Column Presentation Viewport */}
      <div className="sticky top-20 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* ==================================================== */}
          {/* LEFT COLUMN: Concept, Code Sample & Core Features */}
          {/* ==================================================== */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <span className="text-xs font-mono font-bold tracking-widest text-zinc-400 uppercase">
                SCROLLCRAFT
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
                ScrollSequence
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2.5 font-sans leading-relaxed">
                Turn scroll into a story. Play a sequence of animations as the user scrolls.
              </p>
            </div>

            {/* Code Box */}
            <div className="p-4 rounded-2xl bg-zinc-950/90 border border-zinc-800/80 shadow-xl space-y-3">
              <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                ScrollSequence lets you define multiple steps that animate one after another as the user scrolls through a section.
              </p>

              <div className="p-3 rounded-xl bg-black/80 border border-zinc-900 font-mono text-[11px] text-zinc-300 leading-relaxed overflow-x-auto">
                <span className="text-violet-400">&lt;ScrollSequence&gt;</span>
                <br />
                <span className="text-zinc-500 pl-3">&lt;</span>
                <span className="text-emerald-400">SequenceItem</span>
                <span className="text-zinc-500">&gt;...&lt;/</span>
                <span className="text-emerald-400">SequenceItem</span>
                <span className="text-zinc-500">&gt;</span>
                <br />
                <span className="text-zinc-500 pl-3">&lt;</span>
                <span className="text-emerald-400">SequenceItem</span>
                <span className="text-zinc-500">&gt;...&lt;/</span>
                <span className="text-emerald-400">SequenceItem</span>
                <span className="text-zinc-500">&gt;</span>
                <br />
                <span className="text-zinc-500 pl-3">&lt;</span>
                <span className="text-emerald-400">SequenceItem</span>
                <span className="text-zinc-500">&gt;...&lt;/</span>
                <span className="text-emerald-400">SequenceItem</span>
                <span className="text-zinc-500">&gt;</span>
                <br />
                <span className="text-violet-400">&lt;/ScrollSequence&gt;</span>
              </div>
            </div>

            {/* 4 Bullet Features with Icons */}
            <div className="space-y-3 pt-1 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-violet-400 shrink-0">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-white">Smooth &amp; Performant</div>
                  <div className="text-[11px] text-zinc-400">Built on native scroll timelines.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-violet-400 shrink-0">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-white">Sequential Control</div>
                  <div className="text-[11px] text-zinc-400">Animate multiple steps with ease.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-violet-400 shrink-0">
                  <Smartphone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-white">Viewport Aware</div>
                  <div className="text-[11px] text-zinc-400">Works across devices and screen sizes.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-violet-400 shrink-0">
                  <Sliders className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-white">Highly Customizable</div>
                  <div className="text-[11px] text-zinc-400">Control timing, easing, and more.</div>
                </div>
              </div>
            </div>

            <div className="pt-2 text-[10px] font-mono tracking-widest text-zinc-600 uppercase">
              — YOU SCROLL. IT PLAYS.
            </div>
          </div>

          {/* ==================================================== */}
          {/* CENTER COLUMN: The Interactive Device Story Viewer   */}
          {/* ==================================================== */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="w-full max-w-[340px] h-[520px] rounded-3xl border border-zinc-800 bg-[#09090d] shadow-2xl p-6 relative overflow-hidden flex flex-col justify-between backdrop-blur-xl group">
              {/* Top Step Header */}
              <div className="flex items-center justify-between z-10">
                <span className="text-xs font-mono font-bold text-zinc-400">
                  {stepsData[activeStep].num}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/30">
                  ACTIVE
                </span>
              </div>

              {/* Dynamic Center Stage Graphics & Text */}
              <div className="my-auto text-center space-y-4 relative z-10 transition-all duration-500">
                {/* Visual Graphics Rendered per Step */}
                <div className="h-44 flex items-center justify-center">
                  {activeStep === 0 && (
                    <div className="relative w-36 h-36 flex items-center justify-center animate-in fade-in zoom-in-95 duration-500">
                      {/* Headphones SVG */}
                      <svg viewBox="0 0 100 100" className="w-32 h-32 text-zinc-200">
                        {/* Headband */}
                        <path d="M 22 55 A 30 30 0 0 1 78 55" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
                        {/* Left Ear Cup */}
                        <rect x="14" y="46" width="16" height="28" rx="8" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
                        {/* Right Ear Cup */}
                        <rect x="70" y="46" width="16" height="28" rx="8" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
                        {/* Sound Wave Accents */}
                        <circle cx="50" cy="60" r="12" fill="none" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                        <circle cx="50" cy="60" r="20" fill="none" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
                      </svg>
                    </div>
                  )}

                  {activeStep === 1 && (
                    <div className="relative w-36 h-36 flex items-center justify-center animate-in fade-in zoom-in-95 duration-500">
                      {/* Detailed Macro Ear Cup SVG */}
                      <svg viewBox="0 0 100 100" className="w-32 h-32">
                        <circle cx="50" cy="50" r="42" fill="#121216" stroke="#52525b" strokeWidth="2" />
                        <circle cx="50" cy="50" r="32" fill="#18181b" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 2" />
                        <circle cx="50" cy="50" r="22" fill="#09090b" stroke="#27272a" strokeWidth="1" />
                        <circle cx="50" cy="50" r="8" fill="#38bdf8" fillOpacity="0.3" stroke="#38bdf8" strokeWidth="1.5" />
                        {/* Precision Etched Markers */}
                        <line x1="50" y1="12" x2="50" y2="16" stroke="#71717a" strokeWidth="1.5" />
                        <line x1="50" y1="84" x2="50" y2="88" stroke="#71717a" strokeWidth="1.5" />
                        <line x1="12" y1="50" x2="16" y2="50" stroke="#71717a" strokeWidth="1.5" />
                        <line x1="84" y1="50" x2="88" y2="50" stroke="#71717a" strokeWidth="1.5" />
                      </svg>
                    </div>
                  )}

                  {activeStep === 2 && (
                    <div className="relative w-44 h-36 flex items-center justify-center animate-in fade-in zoom-in-95 duration-500">
                      {/* Exploded Acoustic Driver Components */}
                      <svg viewBox="0 0 120 100" className="w-40 h-32">
                        {/* Magnet layer */}
                        <ellipse cx="28" cy="50" rx="9" ry="24" fill="#18181b" stroke="#71717a" strokeWidth="1.5" />
                        {/* Voice coil */}
                        <ellipse cx="48" cy="50" rx="9" ry="24" fill="#451a03" stroke="#f59e0b" strokeWidth="1.5" />
                        {/* Diaphragm */}
                        <ellipse cx="68" cy="50" rx="9" ry="24" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
                        {/* Damping frame */}
                        <ellipse cx="88" cy="50" rx="9" ry="24" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="1.5" />
                        {/* Connector axis */}
                        <line x1="20" y1="50" x2="98" y2="50" stroke="#52525b" strokeWidth="1" strokeDasharray="2 2" />
                      </svg>
                    </div>
                  )}

                  {activeStep === 3 && (
                    <div className="relative w-36 h-36 flex items-center justify-center animate-in fade-in zoom-in-95 duration-500">
                      {/* Flagship Hero Sound Stage */}
                      <svg viewBox="0 0 100 100" className="w-32 h-32">
                        {/* Radiant Radial Gradient */}
                        <defs>
                          <radialGradient id="stageGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#09090b" stopOpacity="0" />
                          </radialGradient>
                        </defs>
                        <circle cx="50" cy="50" r="44" fill="url(#stageGlow)" />
                        <path d="M 22 52 A 30 30 0 0 1 78 52" fill="none" stroke="#e4e4e7" strokeWidth="4.5" strokeLinecap="round" />
                        <rect x="14" y="44" width="16" height="28" rx="8" fill="#27272a" stroke="#8b5cf6" strokeWidth="2" />
                        <rect x="70" y="44" width="16" height="28" rx="8" fill="#27272a" stroke="#8b5cf6" strokeWidth="2" />
                        <ellipse cx="50" cy="86" rx="30" ry="6" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
                      </svg>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    {stepsData[activeStep].title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 font-sans">
                    {stepsData[activeStep].subtitle}
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    {stepsData[activeStep].desc}
                  </p>
                </div>
              </div>

              {/* Bottom CTA / Status */}
              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-center z-10">
                {activeStep === 3 ? (
                  <button
                    onClick={() => glideToStep(0)}
                    className="px-5 py-2 rounded-full bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-colors shadow-lg cursor-pointer"
                  >
                    Explore Now &rarr;
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping" />
                    <span>Scroll to advance sequence</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ==================================================== */}
          {/* RIGHT COLUMN: Interactive Step Progression Timeline   */}
          {/* ==================================================== */}
          <div className="lg:col-span-4 space-y-4">
            {/* Step 0: Initial State */}
            <div className={`p-4 rounded-2xl border transition-all duration-300 ${activeStep === 0 ? 'bg-zinc-900/90 border-violet-500/50 shadow-lg' : 'bg-zinc-950/50 border-zinc-800/60 opacity-60'}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-xs text-white flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${activeStep === 0 ? 'bg-violet-400 animate-pulse' : 'bg-zinc-600'}`} />
                  Initial State
                </span>
                <button
                  onClick={() => glideToStep(1)}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[10px] font-mono text-zinc-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>SCROLL</span>
                  <ArrowDown className="w-3 h-3" />
                </button>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                When the section enters the viewport, the first item is in view.
              </p>
            </div>

            {/* Step 1: Step 1 -> 2 */}
            <div className={`p-4 rounded-2xl border transition-all duration-300 ${activeStep === 1 ? 'bg-zinc-900/90 border-sky-500/50 shadow-lg' : 'bg-zinc-950/50 border-zinc-800/60 opacity-60'}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-xs text-white flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${activeStep === 1 ? 'bg-sky-400 animate-pulse' : 'bg-zinc-600'}`} />
                  Step 1 &rarr; 2
                </span>
                <button
                  onClick={() => glideToStep(2)}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[10px] font-mono text-zinc-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>SCROLL</span>
                  <ArrowDown className="w-3 h-3" />
                </button>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                On scroll, the first item moves up and the second item animates in (e.g. slide + fade).
              </p>
            </div>

            {/* Step 2: Step 2 -> 3 */}
            <div className={`p-4 rounded-2xl border transition-all duration-300 ${activeStep === 2 ? 'bg-zinc-900/90 border-emerald-500/50 shadow-lg' : 'bg-zinc-950/50 border-zinc-800/60 opacity-60'}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-xs text-white flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${activeStep === 2 ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`} />
                  Step 2 &rarr; 3
                </span>
                <button
                  onClick={() => glideToStep(3)}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[10px] font-mono text-zinc-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>SCROLL</span>
                  <ArrowDown className="w-3 h-3" />
                </button>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                Continue scrolling, the second item moves up and the third item plays (e.g. scale + reveal).
              </p>
            </div>

            {/* Step 3: Step 3 -> 4 */}
            <div className={`p-4 rounded-2xl border transition-all duration-300 ${activeStep === 3 ? 'bg-zinc-900/90 border-amber-500/50 shadow-lg' : 'bg-zinc-950/50 border-zinc-800/60 opacity-60'}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-xs text-white flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${activeStep === 3 ? 'bg-amber-400 animate-pulse' : 'bg-zinc-600'}`} />
                  Step 3 &rarr; 4
                </span>
                <span className="text-[10px] font-mono text-amber-400 font-semibold">FINAL STAGE</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                Final scroll, the third item moves up and the last item animates in (e.g. fade + lift).
              </p>
            </div>

            {/* Result Box */}
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs font-sans space-y-1 shadow-lg">
              <div className="flex items-center gap-2 font-bold text-emerald-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Result</span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                A smooth, scroll-driven story that feels natural, interactive, and premium.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ==========================================
// 11. TEXT REVEAL DEMO (BaseOpacity 0 & 3D Perspective Rotation)
// ==========================================
export function TextRevealDemoStage({ knobs }: { knobs: Record<string, any> }) {
  const by = knobs.by ?? 'chars';
  const blur = knobs.blur ?? 8;
  const rotateX = knobs.rotateX ?? 35;

  return (
    <div className="w-full min-h-[220vh] flex flex-col items-center justify-start pt-16 px-6">
      {/* Top Entrance Teaser Card */}
      <div className="max-w-md mx-auto text-center mb-44 space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-violet-400">
          Scroll Down to Trigger Typographic Reveal
        </span>
        <h3 className="text-2xl font-bold text-white">3D Perspective Kinetic Split</h3>
        <p className="text-xs text-zinc-400">
          At scrollY = 0, text is completely pristine and hidden (baseOpacity: 0). As you scroll into view, each character flips up in 3D perspective space!
        </p>
        <div className="inline-flex items-center gap-1 font-mono text-xs text-emerald-400">
          <span>↓ Scroll Down Into Section</span>
        </div>
      </div>

      {/* Reveal Target Section with 3D Perspective */}
      <div className="max-w-4xl mx-auto text-center space-y-8 sticky top-48 p-8 rounded-3xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-2xl shadow-2xl">
        <span className="text-xs font-mono uppercase tracking-widest text-violet-400">
          Kinetic Typographic Split (by="{by}" | rotateX: {rotateX}° | 3D Flip)
        </span>
        <TextReveal
          key={`${by}-${blur}-${rotateX}`}
          by={by}
          blur={blur}
          scale={0.88}
          rotateX={rotateX}
          baseOpacity={0.18}
          range={[0.1, 0.9]}
          className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight"
        >
          Declarative scroll physics with zero React re-renders. Every single character illuminates and flips in 3D perspective space in lockstep with your gesture.
        </TextReveal>
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
    const unsub = subscribe((metrics) => {
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
