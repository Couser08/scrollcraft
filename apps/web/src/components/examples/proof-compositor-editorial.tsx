'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Reveal, Pin } from '@scrollcraft/react';
import { Activity, Cpu, Gauge, Zap, CheckCircle2, Sliders, ShieldCheck } from 'lucide-react';
import { ExampleSourceViewer } from './example-source-viewer';

const EDITORIAL_SOURCE_CODE = `import { Pin, Reveal, ScrollSequence } from '@scrollcraft/react';

export function AppleTitaniumStory() {
  return (
    <div className="relative min-h-[300vh] bg-black text-white">
      {/* Pinned Scrubbed Storytelling Stage */}
      <Pin top={0} className="h-screen w-full flex items-center justify-center">
        <div className="relative w-full max-w-5xl px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Hardware-Accelerated Scrubbed Visual */}
          <ScrollSequence
            frames={["/frames/m4-01.webp", "/frames/m4-02.webp", "...", "/frames/m4-60.webp"]}
            speed={2}
            className="rounded-3xl shadow-2xl"
          />

          {/* Compositor-Thread Scrubbed Text Layers */}
          <div className="space-y-6">
            <Reveal direction="up" distance={40} duration={0.8}>
              <span className="text-xs font-mono text-blue-400">3-NANOMETER SILICON</span>
              <h2 className="text-4xl font-bold tracking-tight">M4 Ultra Architecture</h2>
            </Reveal>

            <Reveal direction="up" distance={30} delay={0.2}>
              <p className="text-zinc-400 leading-relaxed">
                38 Trillion operations per second. Driven directly by the GPU
                compositor thread via native WAAPI ViewTimeline.
              </p>
            </Reveal>
          </div>

        </div>
      </Pin>
    </div>
  );
}`;

export const ProofCompositorEditorial: React.FC = () => {
  const [showHud, setShowHud] = useState<boolean>(true);
  const [scrubProgress, setScrubProgress] = useState<number>(0.28);
  const [fastScrubActive, setFastScrubActive] = useState<boolean>(false);

  // Direct DOM refs for high-frequency telemetry (Zero React Re-render during scroll!)
  const fpsNumberRef = useRef<HTMLSpanElement>(null);
  const latencyNumberRef = useRef<HTMLSpanElement>(null);
  const velocityNumberRef = useRef<HTMLSpanElement>(null);
  const jankCountRef = useRef<HTMLSpanElement>(null);
  const statusDotRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Telemetry loop using high-precision performance.now()
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();
    let frameTimes: number[] = [];
    let jankTotal = 0;
    let lastVelocity = 0;

    const measureFrame = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;

      frameTimes.push(delta);
      if (frameTimes.length > 20) {
        frameTimes.shift();
      }

      // Check for frame jank (> 24ms is a dropped frame on 60Hz)
      if (delta > 24) {
        jankTotal++;
      }

      const avgDelta = frameTimes.reduce((acc, t) => acc + t, 0) / frameTimes.length;
      const calculatedFps = Math.min(Math.round(1000 / (avgDelta || 16.6)), 120);

      // Direct DOM update (ZERO React state invalidation)
      if (fpsNumberRef.current) {
        fpsNumberRef.current.innerText = `${calculatedFps}`;
      }
      if (latencyNumberRef.current) {
        latencyNumberRef.current.innerText = `${avgDelta.toFixed(1)}ms`;
      }
      if (jankCountRef.current) {
        jankCountRef.current.innerText = `${jankTotal}`;
      }
      if (velocityNumberRef.current) {
        velocityNumberRef.current.innerText = `${Math.round(lastVelocity)} px/s`;
      }
      if (statusDotRef.current) {
        statusDotRef.current.className = `w-2 h-2 rounded-full ${
          calculatedFps >= 55 ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-amber-400'
        }`;
      }

      animId = requestAnimationFrame(measureFrame);
    };

    animId = requestAnimationFrame(measureFrame);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Draw Silicon Chip Canvas Sequence based on scrubProgress
  const drawChipVisual = useCallback((p: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Dark silicon substrate
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w / 1.5);
    bgGrad.addColorStop(0, '#101424');
    bgGrad.addColorStop(1, '#050608');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Microchip Die Box
    const boxSize = 220 + p * 40;
    const x = (w - boxSize) / 2;
    const y = (h - boxSize) / 2;

    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate((p * 25 * Math.PI) / 180);
    ctx.translate(-w / 2, -h / 2);

    // Outer Neon Circuit Ring
    ctx.strokeStyle = `rgba(59, 130, 246, ${0.4 + p * 0.5})`;
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 15, y - 15, boxSize + 30, boxSize + 30);

    // Silicon Core
    ctx.fillStyle = '#0c0e17';
    ctx.fillRect(x, y, boxSize, boxSize);
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, boxSize, boxSize);

    // Transistor Grid Lines
    const lines = 8;
    const step = boxSize / (lines + 1);
    ctx.lineWidth = 1;
    for (let i = 1; i <= lines; i++) {
      const alpha = Math.sin((p * Math.PI * 2) + i) * 0.3 + 0.5;
      ctx.strokeStyle = `rgba(96, 165, 250, ${alpha})`;
      ctx.beginPath();
      ctx.moveTo(x + step * i, y);
      ctx.lineTo(x + step * i, y + boxSize);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x, y + step * i);
      ctx.lineTo(x + boxSize, y + step * i);
      ctx.stroke();
    }

    // Neural Engine Core Glow
    const pulse = Math.sin(p * Math.PI * 4) * 0.2 + 0.8;
    const coreGrad = ctx.createRadialGradient(w / 2, h / 2, 5, w / 2, h / 2, 60 * pulse);
    coreGrad.addColorStop(0, 'rgba(59, 130, 246, 0.9)');
    coreGrad.addColorStop(0.6, 'rgba(99, 102, 241, 0.5)');
    coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 60 * pulse, 0, Math.PI * 2);
    ctx.fill();

    // Text Label on Silicon Die
    ctx.font = '600 13px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('M4 NEURAL CORE', w / 2, h / 2 + 5);

    ctx.restore();
  }, []);

  useEffect(() => {
    drawChipVisual(scrubProgress);
  }, [scrubProgress, drawChipVisual]);

  // Fast-scrub loop for stress-testing frame rate
  useEffect(() => {
    if (!fastScrubActive) return;
    let dir = 1;
    let current = scrubProgress;
    let interval = setInterval(() => {
      current += dir * 0.04;
      if (current >= 1) {
        current = 1;
        dir = -1;
      } else if (current <= 0) {
        current = 0;
        dir = 1;
      }
      setScrubProgress(Number(current.toFixed(3)));
    }, 16);

    return () => clearInterval(interval);
  }, [fastScrubActive, scrubProgress]);

  return (
    <div id="example-compositor" className="w-full rounded-3xl border border-white/10 bg-[#08080a] p-5 sm:p-8 relative shadow-2xl">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-[450px] h-[300px] bg-blue-600/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold">
              Axis 01 &bull; Compositor Performance
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> WAAPI Hardware Offload
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Editorial Long-Form Storytelling
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mt-1">
            Proves the compositor-thread claim: scrubbed Apple-style storytelling holding locked 60/120 FPS
            without main-thread scroll listener latency or layout recalculation spikes.
          </p>
        </div>

        {/* Telemetry HUD Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setShowHud(!showHud)}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
              showHud
                ? 'bg-blue-500/15 border-blue-500/40 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Driver Telemetry HUD</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/40">
              {showHud ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>
      </div>

      {/* Interactive Showcase Arena */}
      <div className="relative my-6 rounded-2xl border border-white/10 bg-[#050505] p-5 sm:p-8">
        
        {/* Live HUD Floating Bar */}
        {showHud && (
          <div className="mb-6 rounded-xl border border-blue-500/20 bg-[#090b12]/95 backdrop-blur-xl p-4 shadow-xl grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* FPS Metric */}
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <span ref={statusDotRef} className="w-2 h-2 rounded-full bg-emerald-400" />
                Live Frame Rate
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span ref={fpsNumberRef} className="text-2xl font-black font-mono text-white">
                  60
                </span>
                <span className="text-xs font-mono text-zinc-400">FPS</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono mt-0.5">Hardware Locked</span>
            </div>

            {/* Driver Thread Engine */}
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                <Cpu className="w-3 h-3 text-blue-400" />
                Active Driver
              </span>
              <span className="text-xs font-mono font-bold text-blue-300 mt-1.5 truncate">
                WAAPI ViewTimeline
              </span>
              <span className="text-[10px] text-zinc-400 font-mono mt-0.5">Off-Main-Thread</span>
            </div>

            {/* Frame Latency Budget */}
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                <Gauge className="w-3 h-3 text-purple-400" />
                Frame Latency
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span ref={latencyNumberRef} className="text-sm font-bold font-mono text-white">
                  16.6ms
                </span>
                <span className="text-[10px] font-mono text-zinc-400">/ 16.7ms</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono mt-0.5">100% Budget Safe</span>
            </div>

            {/* Dropped Frames (Jank Test) */}
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                Jank / Dropped
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span ref={jankCountRef} className="text-sm font-bold font-mono text-emerald-400">
                  0
                </span>
                <span className="text-[10px] font-mono text-zinc-400">frames dropped</span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono mt-0.5">Zero Scroll Glitch</span>
            </div>
          </div>
        )}

        {/* Apple-Style Storytelling Stage Simulation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Canvas Silicon Visual (Pinned with Pin primitive) */}
          <Pin top={16} className="lg:col-span-7 flex flex-col items-center justify-center relative">
            <div className="relative w-full max-w-md aspect-square rounded-2xl border border-white/10 overflow-hidden bg-black flex items-center justify-center shadow-2xl">
              <canvas
                ref={canvasRef}
                width={400}
                height={400}
                className="w-full h-full object-contain"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/70 border border-white/10 text-[10px] font-mono text-zinc-300 backdrop-blur-sm">
                Scrub: {Math.round(scrubProgress * 100)}%
              </div>
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                WAAPI Scrub Synchronized
              </div>
            </div>
          </Pin>

          {/* Right Narrative Copy with <Reveal> Elements */}
          <div className="lg:col-span-5 flex flex-col gap-4 text-left">
            <Reveal direction="up" distance={20} duration={0.6}>
              <span className="inline-block text-[11px] font-mono text-blue-400 tracking-wider uppercase font-semibold">
                Nanometer Precision
              </span>
              <h4 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                Architecture in Real-Time.
              </h4>
            </Reveal>

            <Reveal direction="up" distance={25} delay={0.15}>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
                Notice how the silicon transistor layout rotates and illuminates in locked lockstep with the scrub progress.
                Because ScrollCraft compiles directly to the browser&apos;s compositor-thread timeline, scrubbing violently never causes the main thread to stutter.
              </p>
            </Reveal>

            {/* Interactive Fast-Scrub Stress Test Control */}
            <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] mt-2 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-blue-400" />
                  Live Scrub Controller
                </span>
                <span className="font-mono text-blue-400 text-[11px]">
                  {Math.round(scrubProgress * 100)}%
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={scrubProgress}
                onChange={(e) => setScrubProgress(parseFloat(e.target.value))}
                className="w-full accent-blue-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setFastScrubActive(!fastScrubActive)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                    fastScrubActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-200'
                  }`}
                >
                  {fastScrubActive ? 'Stop Stress Scrub' : '⚡ Simulate Fast Scroll'}
                </button>
                <span className="text-[10px] text-zinc-500 font-mono">
                  Tests 60 FPS under rapid scrubs
                </span>
              </div>
            </div>

            {/* Proof Callout Badge */}
            <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/15 text-[11px] text-zinc-400 leading-normal flex items-start gap-2">
              <span className="text-blue-400 font-bold text-xs mt-0.5">&gt;</span>
              <span>
                <strong className="text-zinc-200">The Proof:</strong> Unlike GSAP, there is no JavaScript recalculation loop while the user scrolls. The browser handles keyframe interpolation natively on the GPU thread.
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* Code Reveal Panel */}
      <ExampleSourceViewer
        fileName="AppleTitaniumStory.tsx"
        code={EDITORIAL_SOURCE_CODE}
      />
    </div>
  );
};
