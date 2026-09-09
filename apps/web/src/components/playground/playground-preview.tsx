'use client';

/**
 * Interactive Live Preview Canvas for Playground
 * Supports Desktop, Tablet, Mobile responsive modes with GPU-accelerated rendering.
 * Strictly under 650 LOC.
 */

import React, { useState } from 'react';
import Image from 'next/image';
import { Monitor, Tablet, Smartphone, Maximize2, RotateCcw } from 'lucide-react';
import { PlaygroundPreset } from '@/data/playground.data';

interface PlaygroundPreviewProps {
  preset: PlaygroundPreset;
  controls: PlaygroundPreset['controls'];
}

export const PlaygroundPreview: React.FC<PlaygroundPreviewProps> = ({
  preset,
  controls,
}) => {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [scrollProgress, setScrollProgress] = useState(0.8);
  const [isPlaying, setIsPlaying] = useState(false);

  // Compute CSS transforms based on control settings & scrollProgress
  const translateYVal = controls.translateY ? (1 - scrollProgress) * 50 : 0;
  const opacityVal = controls.opacity ? Math.max(0.1, scrollProgress) : 1;
  const scaleVal = controls.scale ? 0.88 + scrollProgress * 0.16 : 1;
  const rotateVal = controls.rotate ? (1 - scrollProgress) * 15 : 0;

  const getContainerWidth = () => {
    switch (viewport) {
      case 'mobile':
        return 'max-w-[340px]';
      case 'tablet':
        return 'max-w-[540px]';
      default:
        return 'w-full';
    }
  };

  const handleSimulate = () => {
    setIsPlaying(true);
    setScrollProgress(0);
    let start: number | null = null;
    const duration = controls.duration * 1000;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(1, elapsed / duration);
      setScrollProgress(progress);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setIsPlaying(false);
      }
    };
    requestAnimationFrame(step);
  };

  return (
    <div className="flex flex-col h-full rounded-2xl bg-white border border-zinc-200 shadow-xl overflow-hidden select-none">
      {/* Top Header Bar with Viewport Switcher & Status */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200/80 bg-zinc-50/70">
        {/* Viewport Switcher */}
        <div className="flex items-center gap-1 bg-white border border-zinc-200/80 rounded-lg p-0.5 shadow-2xs">
          <button
            type="button"
            aria-label="Desktop viewport"
            onClick={() => setViewport('desktop')}
            className={`p-1.5 rounded-md transition-all cursor-pointer ${
              viewport === 'desktop'
                ? 'bg-zinc-100 text-zinc-950 font-bold'
                : 'text-zinc-400 hover:text-zinc-700'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            aria-label="Tablet viewport"
            onClick={() => setViewport('tablet')}
            className={`p-1.5 rounded-md transition-all cursor-pointer ${
              viewport === 'tablet'
                ? 'bg-zinc-100 text-zinc-950 font-bold'
                : 'text-zinc-400 hover:text-zinc-700'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            aria-label="Mobile viewport"
            onClick={() => setViewport('mobile')}
            className={`p-1.5 rounded-md transition-all cursor-pointer ${
              viewport === 'mobile'
                ? 'bg-zinc-100 text-zinc-950 font-bold'
                : 'text-zinc-400 hover:text-zinc-700'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center/Right: Live Indicator & Replay */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
            {preset.name}
          </span>
          <button
            type="button"
            onClick={handleSimulate}
            disabled={isPlaying}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 hover:bg-zinc-200 text-[11px] font-semibold text-zinc-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Replay</span>
          </button>

          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Preview</span>
          </div>

          <button
            type="button"
            aria-label="Fullscreen view"
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Preview Container with Responsive Constraints */}
      <div className="flex-1 bg-zinc-100/50 p-4 sm:p-6 flex flex-col items-center justify-center overflow-hidden">
        <div
          className={`relative w-full ${getContainerWidth()} h-[380px] rounded-2xl overflow-hidden shadow-md border border-zinc-200/80 bg-[#090b10] transition-all duration-300`}
        >
          {/* Background Mountain Photo */}
          <div className="absolute inset-0 -z-10">
            <Image
              src="/images/example-hero.jpg"
              alt="Mountain preview backdrop"
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover object-center opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090b10] via-transparent to-black/50" />
          </div>

          {/* Mini Nav Bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 text-white select-none">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center text-white text-[10px] font-black">
                S
              </div>
              <span className="font-bold text-xs tracking-tight">ScrollCraft</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-zinc-400 font-medium">
              <span>Docs</span>
              <span>Examples</span>
              <span className="text-white font-semibold">Playground</span>
            </div>
          </div>

          {/* Active Animated Scene Target */}
          <div className="relative h-[290px] flex flex-col items-center justify-center text-center px-6">
            <div
              style={{
                transform: `translate3d(0, ${translateYVal}px, 0) scale(${scaleVal}) rotate(${rotateVal}deg)`,
                opacity: opacityVal,
                willChange: 'transform, opacity',
                transition: controls.scrub ? 'none' : `all ${controls.duration}s ease-out`,
              }}
              className="flex flex-col items-center"
            >
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mb-2">
                Animate on Scroll,
                <br />
                <span className="text-blue-500 font-extrabold">Beautifully.</span>
              </h2>

              <p className="text-xs text-zinc-400 max-w-xs leading-relaxed mb-5">
                Smooth, performant and modern scroll animations with ScrollCraft.
              </p>

              <button
                type="button"
                className="px-4 py-2 rounded-full bg-white text-zinc-950 font-bold text-xs shadow-md"
              >
                Get Started →
              </button>
            </div>

            {/* Side Marker if toggled */}
            {controls.markers && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-mono text-emerald-400 border border-emerald-500/50 px-1.5 py-0.5 rounded bg-black/60">
                Trigger: {controls.start}
              </div>
            )}
          </div>
        </div>

        {/* Scrub Slider on Canvas Bottom */}
        <div className="w-full max-w-md mt-4 flex items-center gap-3 px-3 py-1.5 rounded-full bg-white border border-zinc-200 shadow-2xs">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider shrink-0">
            Scroll Pos:
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            aria-label="Scroll simulation position"
            value={scrollProgress}
            onChange={(e) => setScrollProgress(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <span className="text-xs font-mono font-bold text-zinc-700 w-10 text-right">
            {Math.round(scrollProgress * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};
