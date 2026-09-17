'use client';

import React, { useRef } from 'react';
import {
  Parallax,
  Reveal,
  Pin,
  PinContainer,
  ScrollProgress,
  ScrollTransform,
  ScrollDraw,
} from '@scrollcraft/react';
import { ArrowDown, Lock } from 'lucide-react';

// ==========================================
// 1. PARALLAX DEMO
// ==========================================
export function ParallaxDemoStage({ knobs }: { knobs: Record<string, any> }) {
  const speed = knobs.speed ?? 0.35;
  const bleed = knobs.bleed ?? true;

  return (
    <div className="relative w-full min-h-[200vh] flex flex-col items-center justify-start pt-32 select-none">
      {/* Visual Scroll Guide Markers */}
      <div className="absolute top-12 left-6 font-mono text-xs text-zinc-500 flex items-center gap-2">
        <ArrowDown className="w-3.5 h-3.5 text-violet-400 animate-bounce" />
        <span>Scroll down to test multi-speed depth parallax</span>
      </div>

      {/* Background Plane (Reverse Parallax) */}
      <Parallax speed={-0.3} bleed={bleed} className="w-full max-w-4xl px-4 pointer-events-none">
        <div className="w-full h-80 rounded-3xl bg-gradient-to-b from-violet-900/20 via-purple-950/10 to-transparent border border-violet-500/10 blur-xl p-8 flex items-end">
          <span className="font-mono text-xs text-violet-400/60 uppercase tracking-widest">
            Background Depth Plane (Speed: -0.30x)
          </span>
        </div>
      </Parallax>

      {/* Midground Plane */}
      <Parallax speed={0.15} bleed={bleed} className="w-full max-w-2xl px-4 mt-8 z-10">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-sky-400">Mid-Layer 0.15x</span>
            <span className="text-[10px] font-mono text-zinc-500">origin="auto"</span>
          </div>
          <h4 className="text-xl font-bold text-white mt-3">Linear Depth Translation</h4>
          <p className="text-xs text-zinc-400 mt-2">
            This card moves steadily at 0.15x scroll velocity without layout jumping.
          </p>
        </div>
      </Parallax>

      {/* Foreground Hero Card (Controlled by Live Knob Speed) */}
      <Parallax speed={speed} bleed={bleed} className="w-full max-w-xl px-4 mt-12 z-20">
        <div className="rounded-3xl border border-violet-500/40 bg-gradient-to-br from-violet-950/90 via-zinc-900 to-black p-8 shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-emerald-400">
              Interactive Foreground
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
              Speed: {speed}x
            </span>
          </div>
          <h3 className="text-2xl font-black text-white mt-4">120 FPS Depth Parallax</h3>
          <p className="text-sm text-zinc-300 mt-2 leading-relaxed">
            Adjust the speed knob in the control bar above to see instant translation changes applied directly via GPU transforms.
          </p>
          <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-500">
            <span>Bleed Protection: {bleed ? 'Enabled' : 'Disabled'}</span>
            <span className="text-emerald-400 font-bold">0 Re-renders</span>
          </div>
        </div>
      </Parallax>
    </div>
  );
}

// ==========================================
// 2. REVEAL DEMO
// ==========================================
export function RevealDemoStage({ knobs }: { knobs: Record<string, any> }) {
  const direction = knobs.direction ?? 'up';
  const distance = knobs.distance ?? 48;
  const blur = knobs.blur ?? 8;
  const scale = knobs.scale ?? 0.92;
  const rotateX = knobs.rotateX ?? 15;

  return (
    <div className="w-full min-h-[180vh] flex flex-col items-center justify-start pt-24 pb-32">
      <div className="text-center max-w-md mx-auto mb-16 space-y-2">
        <span className="text-xs font-mono text-violet-400 uppercase tracking-widest">
          Scroll Down to Trigger Viewport Reveal
        </span>
        <h3 className="text-2xl font-bold text-white">Staggered Entrance Matrix</h3>
        <p className="text-xs text-zinc-400">
          Cards enter with 3D tilt, optical blur, and directional translation when intersecting viewport.
        </p>
      </div>

      <div className="w-full max-w-4xl px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: 'Zero Re-renders', desc: 'Compositor writes bypass React Virtual DOM.' },
          { title: '3D Rotate Perspective', desc: `Optical tilt set to ${rotateX}deg during entrance.` },
          { title: 'Optical Blur Decay', desc: `Transitions from ${blur}px blur to razor-sharp crispness.` },
          { title: 'Directional Slide', desc: `Enters from ${direction} axis across ${distance}px.` },
        ].map((item, idx) => (
          <Reveal
            key={`${idx}-${direction}-${distance}-${blur}-${rotateX}`}
            direction={direction}
            distance={distance}
            blur={blur}
            scale={scale}
            rotateX={rotateX}
            delay={idx * 0.1}
            duration={0.7}
            threshold={0.15}
            className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 backdrop-blur-xl shadow-2xl"
          >
            <span className="text-xs font-mono text-violet-400 font-bold">STAGE 0{idx + 1}</span>
            <h4 className="text-xl font-bold text-white mt-2">{item.title}</h4>
            <p className="text-sm text-zinc-400 mt-2">{item.desc}</p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 3. PIN DEMO
// ==========================================
export function PinDemoStage({ knobs }: { knobs: Record<string, any> }) {
  const top = knobs.top ?? 90;
  const pinSpacing = knobs.pinSpacing ?? false;
  const lifecycleRef = useRef<HTMLSpanElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const pushLog = (msg: string) => {
    if (lifecycleRef.current) lifecycleRef.current.textContent = msg;
    if (logRef.current) {
      const item = document.createElement('div');
      item.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
      logRef.current.prepend(item);
      while (logRef.current.children.length > 5) {
        logRef.current.lastChild?.remove();
      }
    }
  };

  return (
    <PinContainer height="240vh" className="relative w-full border-y border-zinc-800/80 bg-zinc-950/40">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 py-16">
        {/* Left: Sticky Pin Controller */}
        <div className="relative">
          <Pin
            top={top}
            pinSpacing={pinSpacing}
            onEnter={() => pushLog('onEnter: Pin Locked')}
            onLeave={() => pushLog('onLeave: Pin Released')}
            onEnterBack={() => pushLog('onEnterBack: Pin Re-engaged')}
            onLeaveBack={() => pushLog('onLeaveBack: Idle above trigger')}
            className="w-full rounded-3xl border border-violet-500/40 bg-zinc-900/95 p-8 shadow-2xl backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold uppercase text-emerald-400">
                  GSAP 4-State Sticky Pin
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                top: {top}px
              </span>
            </div>

            <h3 className="text-2xl font-black text-white mt-4">Sticky Pin Telemetry</h3>
            <p className="text-sm text-zinc-400 mt-2">
              This panel locks at top: {top}px as you scroll through the 240vh runway. The right column cards scroll smoothly past.
            </p>

            <div className="mt-6 p-4 rounded-2xl bg-black/70 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-zinc-500">CURRENT STATUS:</span>
                <span ref={lifecycleRef} className="text-violet-300 font-bold">
                  Idle (Before Trigger)
                </span>
              </div>
              <div className="border-t border-zinc-800/80 pt-2 font-mono text-[11px] text-zinc-400 space-y-1">
                <span className="text-zinc-500 text-[10px] block">EVENT STREAM:</span>
                <div ref={logRef} className="space-y-1">
                  <span className="text-zinc-600 italic">Scroll down to trigger callbacks...</span>
                </div>
              </div>
            </div>
          </Pin>
        </div>

        {/* Right: Scrolling Milestones */}
        <div className="space-y-36 py-12">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 backdrop-blur-xl">
              <span className="text-xs font-mono text-violet-400 font-semibold">CHECKPOINT 0{step}</span>
              <h4 className="text-xl font-bold text-white mt-2">Milestone Card #{step}</h4>
              <p className="text-sm text-zinc-400 mt-2">
                Unconstrained scroll runway ensures the sticky positioning algorithm executes cleanly without overflow clipping.
              </p>
            </div>
          ))}
        </div>
      </div>
    </PinContainer>
  );
}

// ==========================================
// 4. SCROLL PROGRESS DEMO
// ==========================================
export function ScrollProgressDemoStage({ knobs }: { knobs: Record<string, any> }) {
  const orientation = knobs.orientation ?? 'horizontal';
  const targetCardRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full min-h-[200vh] pt-20 pb-32 space-y-16">
      {/* Top Fixed Progress Bar */}
      <ScrollProgress className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-emerald-400 z-50 origin-left" />

      <div className="max-w-3xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono text-violet-400 uppercase tracking-widest">
            Dual Scope Demonstration
          </span>
          <h3 className="text-3xl font-extrabold text-white">Global & Target-Scoped Progress</h3>
          <p className="text-sm text-zinc-400">
            The top bar tracks the global page. The card below tracks its own target-scoped progression.
          </p>
        </div>

        {/* Target Card with Embedded Progress Bar */}
        <div
          ref={targetCardRef}
          className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-2xl backdrop-blur-xl space-y-6"
        >
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <h4 className="text-lg font-bold text-white">Target Element Progress Track</h4>
            <span className="text-xs font-mono text-emerald-400 font-semibold">
              Offset: ['top bottom', 'bottom top']
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-zinc-800/80 overflow-hidden">
            <ScrollProgress
              target={targetCardRef}
              orientation={orientation}
              className="h-full bg-gradient-to-r from-violet-500 to-emerald-400 origin-left"
            />
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            As you scroll this card in and out of the viewport, the inner gradient bar interpolates from 0% to 100% with direct GPU scaleX writes.
          </p>

          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-xs font-mono space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              RENDER AUDIT ARCHITECTURE NOTE:
            </div>
            <p className="text-[11px] text-zinc-400 leading-normal">
              • Initial Render Count = 1 is expected on page load: this is React's initial mount / DOM hydration.
              <br />
              • During continuous active scrolling, re-render count remains strictly <span className="text-emerald-400 font-bold">0</span> because <code className="text-violet-300">useScrollProgress</code> uses observable <code className="text-violet-300">ScrollValue</code> scaleX updates.
            </p>
          </div>
        </div>

        {/* Extra runway content */}
        <div className="space-y-16 pt-16">
          <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/40">
            <h5 className="font-bold text-white">Scroll Runway Buffer 1</h5>
            <p className="text-xs text-zinc-400 mt-1">Scroll further down to test full completion.</p>
          </div>
          <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/40">
            <h5 className="font-bold text-white">Scroll Runway Buffer 2</h5>
            <p className="text-xs text-zinc-400 mt-1">Scroll up to observe clean reverse progression.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. SCROLL TRANSFORM DEMO
// ==========================================
export function ScrollTransformDemoStage({ knobs }: { knobs: Record<string, any> }) {
  const preset = knobs.preset ?? '3d-flip';
  const scrub = knobs.scrub ?? true;
  const snapRef = useRef<HTMLSpanElement>(null);

  return (
    <div className="w-full min-h-[220vh] flex flex-col items-center justify-start pt-24 pb-32">
      <div className="text-center max-w-md mx-auto mb-16 space-y-2">
        <span className="text-xs font-mono text-violet-400 uppercase tracking-widest">
          Hardware Transform Scrubbing
        </span>
        <h3 className="text-3xl font-extrabold text-white">GPU Matrix Morphing</h3>
        <p className="text-xs text-zinc-400">
          Preset: <span className="font-mono text-violet-300 font-bold">{preset}</span> | Scrub: {scrub ? 'True' : 'False'}
        </p>
      </div>

      <div className="sticky top-40 z-20">
        <ScrollTransform
          key={`${preset}-${scrub}`}
          preset={preset}
          scrub={scrub}
          snap={knobs.snap ? true : undefined}
          onSnap={(point) => {
            if (snapRef.current) snapRef.current.textContent = `Snapped at scroll: ${point}px`;
          }}
          className="w-88 h-96 rounded-3xl border border-violet-500/40 bg-gradient-to-br from-violet-950/90 via-zinc-900 to-black p-8 shadow-2xl backdrop-blur-2xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-violet-400 uppercase font-bold">Preset: {preset}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                120 FPS
              </span>
            </div>
            <h4 className="text-2xl font-black text-white mt-4">Direct GPU Writes</h4>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Matrices are updated directly in Ticker Phase 3 without Virtual DOM diffing.
            </p>
          </div>

          <div className="border-t border-zinc-800/80 pt-4 font-mono text-xs text-zinc-400 flex items-center justify-between">
            <span>Snap Status:</span>
            <span ref={snapRef} className="text-emerald-400 font-bold">
              Free Scrubbing
            </span>
          </div>
        </ScrollTransform>
      </div>

      <div className="mt-[60vh] text-center font-mono text-xs text-zinc-600">
        Scroll zone continues below to complete full transform cycle...
      </div>
    </div>
  );
}

// ==========================================
// 6. SCROLL DRAW DEMO
// ==========================================
export function ScrollDrawDemoStage({ knobs }: { knobs: Record<string, any> }) {
  const direction = knobs.direction ?? 'forward';
  const scrub = knobs.scrub ?? true;
  const percentRef = useRef<HTMLSpanElement>(null);

  return (
    <div className="w-full min-h-[200vh] flex flex-col items-center justify-start pt-24 pb-32">
      <div className="text-center max-w-md mx-auto mb-16 space-y-2">
        <span className="text-xs font-mono text-violet-400 uppercase tracking-widest">
          Vector Path Synchronization
        </span>
        <h3 className="text-3xl font-extrabold text-white">SVG Geometry Drawing</h3>
        <p className="text-xs text-zinc-400">
          Scroll progress maps synchronously to strokeDashoffset.
        </p>
      </div>

      <div className="sticky top-36 z-20 w-88 h-88 rounded-3xl border border-zinc-800 bg-zinc-900/90 p-8 shadow-2xl flex flex-col items-center justify-center">
        <svg viewBox="0 0 200 200" className="w-64 h-64 overflow-visible" fill="none">
          {/* Subtle background track */}
          <path
            d="M 30,100 C 30,50 70,30 100,30 C 130,30 170,50 170,100 C 170,150 130,170 100,170 C 70,170 30,150 30,100 Z"
            stroke="#27272a"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Dynamic ScrollDraw SVG Path */}
          <ScrollDraw
            key={`${direction}-${scrub}`}
            d="M 30,100 C 30,50 70,30 100,30 C 130,30 170,50 170,100 C 170,150 130,170 100,170 C 70,170 30,150 30,100 Z"
            stroke="url(#draw-grad)"
            strokeWidth="8"
            strokeLinecap="round"
            direction={direction}
            scrub={scrub}
            onDrawProgress={(p) => {
              if (percentRef.current) percentRef.current.textContent = `${Math.round(p * 100)}%`;
            }}
          />
          <defs>
            <linearGradient id="draw-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="50%" stopColor="#d946ef" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>

        <div className="mt-6 font-mono text-xs flex items-center gap-4 text-zinc-400">
          <span>Path Drawn:</span>
          <span ref={percentRef} className="text-emerald-400 font-bold text-sm">
            0%
          </span>
        </div>
      </div>
    </div>
  );
}
