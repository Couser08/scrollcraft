'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  useParallax,
  useReveal,
  usePin,
  useScrollProgress,
  useScrollTransform,
  useScrollDraw,
  useMagnetic,
  useScrollTimeline,
  useScrollDirection,
  useTicker,
  useRenderTracker,
  useScrollRestoration,
  useScrollCraft,
  useScrollCraftTier,
} from '@scrollcraft/react';
import { ticker } from '@scrollcraft/core';
import { ShieldCheck, Bookmark, ArrowUp, MapPin, Sparkles } from 'lucide-react';

// ==========================================
// 14. USE PARALLAX DEMO
// ==========================================
export function HeadlessParallaxDemoStage({ knobs }: { knobs: Record<string, any> }) {
  const speed = knobs.speed ?? 0.35;
  const ref = useParallax<HTMLDivElement>({ speed, min: -100, max: 100 });

  return (
    <div className="w-full min-h-[180vh] flex flex-col items-center justify-start pt-32">
      <div className="text-center max-w-md mx-auto mb-16 space-y-2">
        <span className="text-xs font-mono text-violet-400 uppercase tracking-widest">
          Headless Direct Ref Binding
        </span>
        <h3 className="text-3xl font-extrabold text-white">useParallax Hook</h3>
        <p className="text-xs text-zinc-400">Zero wrapper elements. Attached directly to ref.</p>
      </div>

      <div
        ref={ref as any}
        className="w-80 h-80 rounded-3xl border border-violet-500/40 bg-gradient-to-br from-violet-950/80 via-zinc-900 to-black p-8 shadow-2xl backdrop-blur-2xl flex flex-col justify-between"
      >
        <span className="text-xs font-mono text-violet-400 font-bold uppercase">speed: {speed}x</span>
        <h4 className="text-2xl font-black text-white">Headless Depth</h4>
        <span className="text-xs font-mono text-emerald-400">0 Virtual DOM Re-renders</span>
      </div>
    </div>
  );
}

// ==========================================
// 15. USE REVEAL DEMO
// ==========================================
export function HeadlessRevealDemoStage({ knobs }: { knobs: Record<string, any> }) {
  const distance = knobs.distance ?? 50;
  const blur = knobs.blur ?? 8;
  const ref = useReveal<HTMLDivElement>({ direction: 'up', distance, blur, rotateX: 12 });

  return (
    <div className="w-full min-h-[180vh] flex flex-col items-center justify-start pt-32">
      <div className="text-center max-w-md mx-auto mb-16 space-y-2">
        <span className="text-xs font-mono text-violet-400 uppercase tracking-widest">
          Scroll Down to Trigger Ref Reveal
        </span>
        <h3 className="text-3xl font-extrabold text-white">useReveal Hook</h3>
      </div>

      <div
        ref={ref as any}
        className="w-88 rounded-3xl border border-zinc-800 bg-zinc-900/90 p-8 shadow-2xl backdrop-blur-xl text-center space-y-4"
      >
        <span className="text-xs font-mono text-emerald-400 font-bold uppercase">Ref Bound Reveal</span>
        <h4 className="text-2xl font-bold text-white">Batch-Optimized Observer</h4>
        <p className="text-xs text-zinc-400">
          Enters with 3D tilt and optical blur clearance when intersecting viewport.
        </p>
      </div>
    </div>
  );
}

// ==========================================
// 16. USE PIN DEMO (Zero Re-renders)
// ==========================================
export function HeadlessPinDemoStage({ knobs }: { knobs: Record<string, any> }) {
  const top = knobs.top ?? 100;
  const badgeRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  const { ref } = usePin<HTMLDivElement>({
    top,
    trackState: false, // Strict 0 re-render mode
    onProgress: (p) => {
      if (progressRef.current) {
        progressRef.current.textContent = `${(p * 100).toFixed(1)}%`;
      }
    },
    onEnter: () => {
      if (badgeRef.current) {
        badgeRef.current.textContent = 'PIN ACTIVE';
        badgeRef.current.className =
          'text-xs font-mono font-bold px-2.5 py-1 rounded-full border bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      }
    },
    onLeave: () => {
      if (badgeRef.current) {
        badgeRef.current.textContent = 'UNPINNED (PAST)';
        badgeRef.current.className =
          'text-xs font-mono font-bold px-2.5 py-1 rounded-full border bg-zinc-800 text-zinc-400 border-zinc-700';
      }
    },
    onEnterBack: () => {
      if (badgeRef.current) {
        badgeRef.current.textContent = 'PIN ACTIVE';
        badgeRef.current.className =
          'text-xs font-mono font-bold px-2.5 py-1 rounded-full border bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      }
    },
    onLeaveBack: () => {
      if (badgeRef.current) {
        badgeRef.current.textContent = 'UNPINNED';
        badgeRef.current.className =
          'text-xs font-mono font-bold px-2.5 py-1 rounded-full border bg-zinc-800 text-zinc-400 border-zinc-700';
      }
    },
  });

  return (
    <div className="w-full min-h-[220vh] pt-24 pb-32">
      <div className="text-center max-w-md mx-auto mb-16 space-y-2">
        <span className="text-xs font-mono text-violet-400 uppercase tracking-widest">
          Headless Pinning (Direct DOM Observables)
        </span>
        <h3 className="text-3xl font-extrabold text-white">usePin Hook</h3>
      </div>

      <div
        ref={ref as any}
        className="max-w-md mx-auto rounded-3xl border border-violet-500/40 bg-zinc-900/95 p-8 shadow-2xl backdrop-blur-2xl space-y-4"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-violet-400 font-bold">top: {top}px</span>
          <span
            ref={badgeRef}
            className="text-xs font-mono font-bold px-2.5 py-1 rounded-full border bg-zinc-800 text-zinc-400 border-zinc-700"
          >
            UNPINNED
          </span>
        </div>

        <h4 className="text-2xl font-black text-white">Headless Sticky Pin</h4>
        <p className="text-xs text-zinc-400">
          Dual API supports pure headless ref or ref-forwarding with observable progress values and 0 re-renders.
        </p>

        <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs text-zinc-300">
          Normalized Pin Progress:{' '}
          <span ref={progressRef} className="text-violet-400 font-bold">
            0.0%
          </span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 17. USE SCROLL PROGRESS DEMO (Zero Re-renders)
// ==========================================
export function HeadlessProgressDemoStage({ knobs }: { knobs: Record<string, any> }) {
  void knobs;
  const percentRef = useRef<HTMLDivElement>(null);

  const { targetRef } = useScrollProgress<HTMLDivElement>({
    offset: ['top bottom', 'bottom top'],
    onProgress: (p) => {
      if (percentRef.current) {
        percentRef.current.textContent = `${Math.round(p * 100)}%`;
      }
    },
  });

  return (
    <div className="w-full min-h-[180vh] flex flex-col items-center justify-start pt-32">
      <div className="text-center max-w-md mx-auto mb-16 space-y-2">
        <span className="text-xs font-mono text-violet-400 uppercase tracking-widest">
          Target Scoped Math (0 Re-renders)
        </span>
        <h3 className="text-3xl font-extrabold text-white">useScrollProgress Hook</h3>
      </div>

      <div
        ref={targetRef as any}
        className="w-88 rounded-3xl border border-zinc-800 bg-zinc-900/90 p-8 shadow-2xl text-center space-y-4"
      >
        <span className="text-xs font-mono text-violet-400 uppercase">Target Progression</span>
        <div ref={percentRef} className="text-6xl font-black text-white font-mono">
          0%
        </div>
        <p className="text-xs text-zinc-400">Calculated across offset: ['top bottom', 'bottom top']</p>
      </div>
    </div>
  );
}

// ==========================================
// 18. USE SCROLL TRANSFORM DEMO
// ==========================================
export function HeadlessTransformDemoStage({ knobs }: { knobs: Record<string, any> }) {
  const preset = knobs.preset ?? 'zoom-in';
  const ref = useScrollTransform<HTMLDivElement>({
    preset,
    scrub: true,
  });

  return (
    <div className="w-full min-h-[180vh] flex flex-col items-center justify-start pt-32">
      <div className="text-center max-w-md mx-auto mb-16 space-y-2">
        <span className="text-xs font-mono text-violet-400 uppercase tracking-widest">
          Compositor Ref Driver
        </span>
        <h3 className="text-3xl font-extrabold text-white">useScrollTransform Hook</h3>
      </div>

      <div
        ref={ref as any}
        className="sticky top-40 w-80 h-80 rounded-3xl border border-violet-500/40 bg-zinc-900/90 p-8 shadow-2xl flex flex-col justify-between"
      >
        <span className="text-xs font-mono text-violet-400 font-bold">Preset: {preset}</span>
        <h4 className="text-2xl font-black text-white">Direct GPU Writes</h4>
        <span className="text-xs font-mono text-emerald-400">0 Re-renders on Scroll</span>
      </div>
    </div>
  );
}

// ==========================================
// 19. USE SCROLL DRAW DEMO
// ==========================================
export function HeadlessDrawDemoStage({ knobs }: { knobs: Record<string, any> }) {
  const direction = knobs.direction ?? 'forward';
  const pathRef = useScrollDraw<SVGPathElement>({ direction, scrub: true });

  return (
    <div className="w-full min-h-[180vh] flex flex-col items-center justify-start pt-32">
      <div className="text-center max-w-md mx-auto mb-16 space-y-2">
        <span className="text-xs font-mono text-violet-400 uppercase tracking-widest">
          Headless SVG Drawing
        </span>
        <h3 className="text-3xl font-extrabold text-white">useScrollDraw Hook</h3>
      </div>

      <div className="w-88 h-88 rounded-3xl border border-zinc-800 bg-zinc-900/90 p-8 shadow-2xl flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-56 h-56 overflow-visible" fill="none">
          <circle cx="50" cy="50" r="40" stroke="#27272a" strokeWidth="6" />
          <path
            ref={pathRef as any}
            d="M 10 50 A 40 40 0 0 0 90 50 A 40 40 0 0 0 10 50"
            stroke="#8b5cf6"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}

// ==========================================
// 20. USE MAGNETIC DEMO
// ==========================================
export function HeadlessMagneticDemoStage({ knobs }: { knobs: Record<string, any> }) {
  const strength = knobs.strength ?? 0.4;
  const radius = knobs.radius ?? 180;
  const btnRef = useRef<HTMLButtonElement>(null);
  useMagnetic(btnRef, { strength, radius });

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono text-violet-400 uppercase tracking-widest">
          Headless Spring Magnetism
        </span>
        <h3 className="text-3xl font-extrabold text-white">useMagnetic Hook</h3>
      </div>

      <button
        ref={btnRef}
        className="px-10 py-5 rounded-full border border-violet-500/40 bg-zinc-900 text-white font-bold text-lg shadow-2xl cursor-pointer hover:border-violet-400 transition-colors"
      >
        Headless Magnetic Button
      </button>
    </div>
  );
}

// ==========================================
// 21. USE SCROLL TIMELINE DEMO
// ==========================================
export function TimelineChoreographyDemoStage({ knobs }: { knobs: Record<string, any> }) {
  void knobs;
  const cardRef = useRef<HTMLDivElement | null>(null);

  useScrollTimeline(cardRef as any, {
    keyframes: {
      opacity: [0.2, 1, 0.3],
      scale: [0.8, 1.1, 0.9],
      rotate: [-15, 0, 15],
    },
  });

  return (
    <div className="w-full min-h-[220vh] flex flex-col items-center justify-start pt-32">
      <div className="text-center max-w-md mx-auto mb-16 space-y-2">
        <span className="text-xs font-mono text-violet-400 uppercase tracking-widest">
          Choreographed Multi-Keyframe
        </span>
        <h3 className="text-3xl font-extrabold text-white">useScrollTimeline Hook</h3>
        <p className="text-xs text-zinc-400">0% (Scale 0.8) → 50% (Scale 1.1) → 100% (Scale 0.9)</p>
      </div>

      <div
        ref={cardRef as any}
        className="sticky top-40 w-88 h-88 rounded-3xl border border-violet-500/40 bg-zinc-900/90 p-8 shadow-2xl flex flex-col justify-between"
      >
        <span className="text-xs font-mono text-violet-400 font-bold uppercase">Keyframe Sequencer</span>
        <h4 className="text-2xl font-black text-white">Multi-Stage Choreography</h4>
        <span className="text-xs font-mono text-emerald-400">0 Virtual DOM Re-renders</span>
      </div>
    </div>
  );
}

// ==========================================
// 22. USE SCROLL DIRECTION DEMO
// ==========================================
export function AutoHideHeaderDemoStage({ knobs }: { knobs: Record<string, any> }) {
  const thresholdDown = knobs.thresholdDown ?? 15;
  const thresholdUp = knobs.thresholdUp ?? 25;
  const navRef = useRef<HTMLDivElement>(null);
  const { direction, isAtTop } = useScrollDirection(navRef, {
    thresholdDown,
    thresholdUp,
  });

  return (
    <div className="w-full min-h-[200vh] relative pt-24 px-4">
      {/* Auto Hiding Bar */}
      <div
        ref={navRef}
        className="fixed top-16 left-1/2 -translate-x-1/2 w-11/12 max-w-xl rounded-2xl border border-zinc-800 bg-zinc-900/95 backdrop-blur-xl px-6 py-4 flex items-center justify-between shadow-2xl z-40 transition-transform duration-300"
      >
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
          <span className="font-bold text-white text-sm">Auto-Hiding Floating Bar</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-zinc-400">DIR:</span>
          <span className="text-violet-400 font-bold uppercase">{direction}</span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              isAtTop ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            {isAtTop ? 'AT TOP (GUARD)' : 'SCROLLED'}
          </span>
        </div>
      </div>

      <div className="max-w-md mx-auto text-center mt-32 space-y-4">
        <h4 className="text-2xl font-bold text-white">iOS Rubber-Band Guard & Hysteresis</h4>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Scroll down past {thresholdDown}px to hide the floating bar. Scroll up past {thresholdUp}px to reveal it. When at the top of the page, the iOS rubber-band guard locks direction to 'up' to prevent false hide glitches.
        </p>
      </div>
    </div>
  );
}

// ==========================================
// 23. USE TICKER DEMO (Zero Re-renders)
// ==========================================
export function HighPrecisionTickerDemoStage({ knobs }: { knobs: Record<string, any> }) {
  void knobs;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fpsRef = useRef<HTMLSpanElement>(null);
  const lastTimeRef = useRef(typeof performance !== 'undefined' ? performance.now() : 0);

  useTicker((_dt, _elapsed, current) => {
    const now = current;
    if (now - lastTimeRef.current >= 250) {
      if (fpsRef.current) {
        const { fps, isIdle, targetFps } = ticker.getFrameRate();
        const displayFps = isIdle ? targetFps : fps;
        fpsRef.current.textContent = isIdle ? `${displayFps} FPS (idle)` : `${displayFps} FPS`;
      }
      lastTimeRef.current = now;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const time = now * 0.003;
    for (let x = 0; x < canvas.width; x++) {
      const y = canvas.height / 2 + Math.sin(x * 0.05 + time) * 25;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }, 'render');

  return (
    <div className="w-full min-h-[120vh] flex flex-col items-center justify-center gap-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono text-violet-400 uppercase tracking-widest">
          ScrollCraft 4-Stage Game Loop (0 Re-renders)
        </span>
        <h3 className="text-3xl font-extrabold text-white">useTicker (Phase: render)</h3>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/90 p-8 shadow-2xl text-center space-y-4">
        <canvas ref={canvasRef} width={340} height={120} className="rounded-2xl bg-black/60 border border-zinc-800" />
        <div className="font-mono text-xs text-zinc-300">
          Ticker Loop Framerate:{' '}
          <span ref={fpsRef} className="text-emerald-400 font-bold text-sm">
            60 FPS
          </span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 24. USE RENDER TRACKER DEMO
// ==========================================
export function ZeroRerenderAuditDemoStage({ knobs }: { knobs: Record<string, any> }) {
  void knobs;
  const audit = useRenderTracker('ZeroRerenderAuditDemo');

  return (
    <div className="w-full min-h-[160vh] flex flex-col items-center justify-start pt-32">
      <div className="text-center max-w-md mx-auto mb-16 space-y-2">
        <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">
          Zero-Rerender Architecture Audit
        </span>
        <h3 className="text-3xl font-extrabold text-white">useRenderTracker Hook</h3>
      </div>

      <div className="w-96 rounded-3xl border border-emerald-500/40 bg-zinc-900/95 p-8 shadow-2xl text-center space-y-6">
        <div className="flex items-center justify-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-mono text-emerald-400 font-bold uppercase">
            Virtual DOM Integrity
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 font-mono">
          <div className="p-4 rounded-2xl bg-black/60 border border-zinc-800">
            <span className="text-[10px] text-zinc-500 block">INITIAL MOUNT</span>
            <span className="text-2xl font-black text-white">{audit.renderCount}</span>
          </div>
          <div className="p-4 rounded-2xl bg-black/60 border border-zinc-800">
            <span className="text-[10px] text-zinc-500 block">DURING SCROLL</span>
            <span className="text-2xl font-black text-emerald-400">{audit.rendersWhileScrolling}</span>
          </div>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          ScrollCraft components mutate transforms directly on GPU layers. React never diffs or re-renders the component during scroll gestures.
        </p>
      </div>
    </div>
  );
}

// ==========================================
// 25. USE SCROLL RESTORATION DEMO (Interactive Checkpoints & Smooth Glide)
// ==========================================
export function RouteRestorationDemoStage({ knobs }: { knobs: Record<string, any> }) {
  void knobs;
  const { scrollTo, subscribe } = useScrollCraft();
  const { savePosition, restorePosition, savedPosition } = useScrollRestoration({
    routeKey: '/test/use-scroll-restoration',
  });

  const [localSavedPos, setLocalSavedPos] = useState<number | null>(savedPosition ?? null);
  const activeSaved = localSavedPos ?? savedPosition;

  useEffect(() => {
    if (savedPosition !== null) {
      setLocalSavedPos(savedPosition);
    }
  }, [savedPosition]);

  const scrollYDisplayRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const unsub = subscribe((metrics) => {
      if (scrollYDisplayRef.current) {
        scrollYDisplayRef.current.textContent = `${Math.round(metrics.scroll)}px`;
      }
    });
    return unsub;
  }, [subscribe]);

  const handleSave = () => {
    savePosition();
    const cur = typeof window !== 'undefined' ? (window.scrollY || window.pageYOffset || 0) : 0;
    const rounded = Math.round(cur);
    setLocalSavedPos(rounded);
    if (statusRef.current) {
      statusRef.current.textContent = `Bookmark recorded at ${rounded}px`;
    }
  };

  const handleSmoothGlideToSaved = () => {
    if (activeSaved !== null && activeSaved !== undefined) {
      if (statusRef.current) {
        statusRef.current.textContent = `Gliding smoothly to saved bookmark (${activeSaved}px)...`;
      }
      scrollTo(activeSaved, { duration: 1.2 });
    }
  };

  const handleSmoothResetTop = () => {
    if (statusRef.current) {
      statusRef.current.textContent = 'Gliding smoothly to top (0px)...';
    }
    scrollTo(0, { duration: 1.0 });
  };

  const handleInstantRestore = () => {
    if (statusRef.current) {
      statusRef.current.textContent = `Instant browser restore to ${activeSaved ?? 0}px`;
    }
    restorePosition();
  };

  const checkpoints = [
    {
      id: 'alpha',
      name: 'Checkpoint Alpha — Hero & Introduction',
      y: 450,
      desc: 'Top section of document. Tests short-range scroll restoration.',
      accent: 'border-violet-500/40 text-violet-400 bg-violet-950/40',
    },
    {
      id: 'beta',
      name: 'Checkpoint Beta — Interactive Canvas Lab',
      y: 1100,
      desc: 'Mid-document rich canvas state. Common reading depth for articles.',
      accent: 'border-sky-500/40 text-sky-400 bg-sky-950/40',
    },
    {
      id: 'gamma',
      name: 'Checkpoint Gamma — Architecture & Spec Registry',
      y: 1750,
      desc: 'Deep document milestone. Demonstrates restoration survival across deep layout shifts.',
      accent: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/40',
    },
  ];

  return (
    <div className="w-full min-h-[260vh] pt-16 pb-32">
      {/* Sticky Interactive Command Center */}
      <div className="sticky top-20 z-30 max-w-2xl mx-auto px-4 mb-16">
        <div className="rounded-3xl border border-zinc-700/80 bg-zinc-950/95 p-6 shadow-2xl backdrop-blur-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Route Restoration Controller
              </span>
            </div>
            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="text-zinc-500">LIVE Y:</span>
              <span ref={scrollYDisplayRef} className="text-violet-400 font-bold">
                0px
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-xs font-mono">
              <span className="text-zinc-500 block mb-1">SAVED IN SESSION STORAGE:</span>
              <span className="text-emerald-400 font-black text-lg">
                {activeSaved !== null ? `${activeSaved}px` : 'No Bookmark Saved'}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-xs font-mono">
              <span className="text-zinc-500 block mb-1">STATUS:</span>
              <span ref={statusRef} className="text-zinc-300 font-bold text-xs">
                {activeSaved !== null ? 'Bookmark ready in sessionStorage' : 'Click "Save Bookmark" below'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2.5 pt-1">
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-violet-600/20"
            >
              <Bookmark className="w-3.5 h-3.5" />
              Save Current Y Bookmark
            </button>
            <button
              onClick={handleSmoothGlideToSaved}
              disabled={activeSaved === null}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:hover:bg-sky-600 text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-sky-600/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Smooth Glide to Bookmark
            </button>
            <button
              onClick={handleInstantRestore}
              disabled={activeSaved === null}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-xs font-bold text-zinc-200 transition-all cursor-pointer"
            >
              Instant Restore (PopState)
            </button>
            <button
              onClick={handleSmoothResetTop}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-300 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              Smooth Top
            </button>
          </div>
        </div>
      </div>

      {/* Visual Checkpoints Runway */}
      <div className="max-w-2xl mx-auto px-4 space-y-48 pt-12">
        {checkpoints.map((cp, idx) => (
          <div
            key={cp.id}
            className={`rounded-3xl border ${cp.accent} p-8 shadow-2xl backdrop-blur-xl relative space-y-4`}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider">
                  Checkpoint 0{idx + 1}
                </span>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-black/60 border border-white/10 font-bold">
                Target Y: {cp.y}px
              </span>
            </div>

            <div>
              <h4 className="text-2xl font-black text-white">{cp.name}</h4>
              <p className="text-xs text-zinc-300 mt-2 leading-relaxed">{cp.desc}</p>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => {
                  scrollTo(cp.y, { duration: 1.0 });
                }}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono font-bold text-white transition-colors cursor-pointer"
              >
                Scroll to {cp.y}px →
              </button>
              <button
                onClick={() => {
                  scrollTo(cp.y, { duration: 0.8 });
                  setTimeout(() => savePosition(), 900);
                }}
                className="px-4 py-2 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/40 text-xs font-mono font-bold text-violet-300 transition-colors cursor-pointer"
              >
                Jump & Save Bookmark
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 26. USE SCROLL CRAFT DEMO (Direct DOM Writes)
// ==========================================
export function EngineMetricsDemoStage({ knobs }: { knobs: Record<string, any> }) {
  void knobs;
  const { subscribe } = useScrollCraft();
  const tier = useScrollCraftTier();
  const scrollRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const velocityRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let last = 0;
    const unsub = subscribe((m) => {
      const now = performance.now();
      if (now - last < 25) return;
      last = now;

      if (scrollRef.current) scrollRef.current.textContent = `${Math.round(m.scroll)}px`;
      if (progressRef.current) progressRef.current.textContent = `${(m.progress * 100).toFixed(1)}%`;
      if (velocityRef.current) velocityRef.current.textContent = m.velocity.toFixed(2);
    });
    return unsub;
  }, [subscribe]);

  return (
    <div className="w-full min-h-[180vh] flex flex-col items-center justify-start pt-32">
      <div className="text-center max-w-md mx-auto mb-16 space-y-2">
        <span className="text-xs font-mono text-violet-400 uppercase tracking-widest">
          Direct DOM Engine Telemetry (0 Re-renders)
        </span>
        <h3 className="text-3xl font-extrabold text-white">Engine Telemetry & Tiers</h3>
      </div>

      <div className="max-w-md w-full rounded-3xl border border-zinc-800 bg-zinc-900/90 p-8 shadow-2xl space-y-6">
        <div className="grid grid-cols-2 gap-3 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-black/60 border border-zinc-800">
            <span className="text-zinc-500 block text-[10px]">SCROLL Y</span>
            <span ref={scrollRef} className="text-white font-bold text-lg">
              0px
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-black/60 border border-zinc-800">
            <span className="text-zinc-500 block text-[10px]">PROGRESS</span>
            <span ref={progressRef} className="text-violet-400 font-bold text-lg">
              0.0%
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-black/60 border border-zinc-800">
            <span className="text-zinc-500 block text-[10px]">VELOCITY</span>
            <span ref={velocityRef} className="text-emerald-400 font-bold text-lg">
              0.00
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-black/60 border border-zinc-800">
            <span className="text-zinc-500 block text-[10px]">HARDWARE TIER</span>
            <span className="text-amber-400 font-bold uppercase text-lg">{tier}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
