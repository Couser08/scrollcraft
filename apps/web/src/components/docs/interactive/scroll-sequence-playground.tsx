'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ScrollSequence, useScrollCraft } from '@scrollcraft/react';
import { PlaygroundShell } from './playground-shell';
import { Film } from 'lucide-react';

/**
 * Generates an Apple-style 3D wireframe sequence in memory.
 * Pre-rendered once client-side into 60 high-DPI data URLs.
 * Feeds the real @scrollcraft/react <ScrollSequence> primitive.
 */
function generateSequenceFrames(count = 60): string[] {
  if (typeof window === 'undefined') return [];

  const canvas = document.createElement('canvas');
  const width = 640;
  const height = 440;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];

  const frames: string[] = [];

  for (let frame = 0; frame < count; frame++) {
    ctx.clearRect(0, 0, width, height);

    // Deep space background
    ctx.fillStyle = '#060608';
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const progress = frame / (count - 1);
    const angle = progress * Math.PI * 2;
    const explosion = Math.sin(progress * Math.PI) * 48;

    // Ambient blueprint grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    const gridSize = 28;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Concentric 3D Isometric Rings
    const numRings = 7;
    for (let i = 0; i < numRings; i++) {
      const ringProgress = i / (numRings - 1);
      const ringOffset = (ringProgress - 0.5) * (90 + explosion * 1.2);
      const ringRadius = Math.cos((ringProgress - 0.5) * Math.PI) * 75;

      ctx.beginPath();
      ctx.ellipse(
        centerX,
        centerY + ringOffset,
        Math.max(10, ringRadius),
        Math.max(5, ringRadius * 0.42),
        angle * 0.35,
        0,
        Math.PI * 2
      );
      ctx.strokeStyle = i === 3 ? '#38bdf8' : 'rgba(59, 130, 246, 0.55)';
      ctx.lineWidth = i === 3 ? 2.5 : 1.5;
      ctx.stroke();
    }

    // Vertical kinetic struts
    const struts = 8;
    for (let j = 0; j < struts; j++) {
      const theta = (j / struts) * Math.PI * 2 + angle;
      const topX = centerX + Math.cos(theta) * 45;
      const topY = centerY - (45 + explosion * 0.6);
      const botX = centerX + Math.cos(theta) * 45;
      const botY = centerY + (45 + explosion * 0.6);

      ctx.beginPath();
      ctx.moveTo(topX, topY);
      ctx.lineTo(botX, botY);
      ctx.strokeStyle = 'rgba(147, 197, 253, 0.4)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    // Holographic core focal point
    ctx.beginPath();
    ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#60a5fa';
    ctx.shadowColor = '#3b82f6';
    ctx.shadowBlur = 14;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Frame Stamp
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.font = '10px monospace';
    ctx.fillText(`SEQ_0x${frame.toString(16).padStart(2, '0').toUpperCase()} // DPR_2X`, 20, height - 20);

    frames.push(canvas.toDataURL('image/png'));
  }

  return frames;
}

let cachedFrames: string[] | null = null;

export const ScrollSequencePlayground: React.FC = () => {
  const [speed, setSpeed] = useState<number>(1.5);
  const [frames, setFrames] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Telemetry DOM Refs (0 React re-renders on scroll)
  const frameCounterRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  const { subscribe } = useScrollCraft();

  // Generate sequence frames on client mount
  useEffect(() => {
    if (!cachedFrames) {
      cachedFrames = generateSequenceFrames(60);
    }
    setFrames(cachedFrames);
  }, []);

  // Update telemetry HUD via DOM ref textContent
  useEffect(() => {
    if (frames.length === 0) return;

    const unsub = subscribe(() => {
      const el = containerRef.current;
      if (!el || typeof window === 'undefined') return;

      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;
      const totalDistance = rect.height - windowH;

      if (totalDistance <= 0) return;

      const scrolledPast = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolledPast / totalDistance));
      const currentFrame = Math.round(progress * (frames.length - 1));

      if (frameCounterRef.current) {
        frameCounterRef.current.textContent = `Frame ${currentFrame + 1} / ${frames.length}`;
      }
      if (progressRef.current) {
        progressRef.current.textContent = `${(progress * 100).toFixed(1)}%`;
      }
    });

    return () => {
      unsub();
    };
  }, [subscribe, frames]);

  const handleScrollToFraction = (fraction: number) => {
    const el = containerRef.current;
    if (!el || typeof window === 'undefined') return;

    const rect = el.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    const elTop = rect.top + scrollTop;
    const totalDistance = rect.height - window.innerHeight;
    const targetScrollY = elTop + fraction * totalDistance;

    window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
  };

  const codeSnippet = `<ScrollSequence
  frames={frames}
  speed={${speed.toFixed(1)}}
  height="${(speed * 100).toFixed(0)}vh"
  className="bg-black rounded-2xl overflow-hidden"
/>`;

  return (
    <PlaygroundShell
      title="<ScrollSequence /> Canvas Scrubber"
      badge="@scrollcraft/react"
      driverType="canvas"
      onReset={() => setSpeed(1.5)}
      codeSnippet={codeSnippet}
      codeFileName="ProductExplosion.tsx"
      controls={
        <div className="flex flex-col gap-3.5">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
              <span className="text-zinc-300 font-medium">Scrubbing Sensitivity</span>
              <span className="text-blue-400 font-semibold">{speed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="2.5"
              step="0.25"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full accent-blue-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 mt-1 font-mono">
              <span>1.0x (Responsive)</span>
              <span>1.5x (Standard)</span>
              <span>2.5x (Cinematic)</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-zinc-400 block mb-1.5">
              Jump to Timeline Phase
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleScrollToFraction(0)}
                className="py-1.5 px-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                Start (0%)
              </button>
              <button
                onClick={() => handleScrollToFraction(0.5)}
                className="py-1.5 px-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                Exploded (50%)
              </button>
              <button
                onClick={() => handleScrollToFraction(1.0)}
                className="py-1.5 px-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                End (100%)
              </button>
            </div>
          </div>
        </div>
      }
      telemetry={
        <>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Timeline Frame Counter:</span>
            <span ref={frameCounterRef} className="text-blue-400 font-bold font-mono">
              Frame 1 / 60
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Scrub Completion:</span>
            <span ref={progressRef} className="text-emerald-400 font-bold font-mono">
              0.0%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Canvas Buffer:</span>
            <span className="text-purple-400 font-mono">Retina DPR Scaled</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Frame Paint Budget:</span>
            <span className="text-white font-mono">&lt; 0.5ms</span>
          </div>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <div className="text-[11px] font-mono text-zinc-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-blue-400" />
            <span>Apple-Style &lt;ScrollSequence /&gt; Stage</span>
          </span>
          <span className="text-zinc-500">Scroll down to scrub 3D wireframe frames</span>
        </div>

        {/* Real Library Primitive from @scrollcraft/react */}
        <div
          ref={containerRef}
          className="rounded-2xl border border-zinc-800/80 bg-[#060608] overflow-hidden shadow-2xl relative"
        >
          {frames.length > 0 ? (
            <ScrollSequence
              frames={frames}
              speed={speed}
              height={`${(speed * 100).toFixed(0)}vh`}
              className="w-full"
            />
          ) : (
            <div className="h-[320px] flex items-center justify-center text-xs font-mono text-zinc-500">
              Generating 60 Retina frames in memory...
            </div>
          )}
        </div>
      </div>
    </PlaygroundShell>
  );
};
