'use client';

import React, { useState, useEffect, useRef, Component, ErrorInfo, ReactNode } from 'react';
import Image from 'next/image';
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCcw,
  Zap,
  AlertCircle,
} from 'lucide-react';
import { VelocityMarquee, useMagnetic } from '@scrollcraft/react';
import { PlaygroundConfig, ViewportMode } from './playground-types';
import { useFpsMeter } from './use-fps-meter';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackMessage?: string;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

// Error Boundary to isolate playground runtime crashes from host docs page
class PlaygroundErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('Playground Preview caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-[380px] rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center p-6 text-center text-white">
          <AlertCircle className="w-8 h-8 text-[#FF5A1F] mb-3" />
          <h4 className="text-sm font-bold">Preview Parameter Overload</h4>
          <p className="text-xs text-zinc-400 max-w-sm mt-1 mb-4">
            An extreme physics value caused an animation frame anomaly. Resetting parameters will restore the live canvas.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              this.props.onReset?.();
            }}
            className="px-4 py-2 rounded-lg bg-[#FF5A1F] hover:bg-[#E04F1A] text-xs font-bold text-white transition-all cursor-pointer"
          >
            Reset Preview
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

interface PlaygroundPreviewProps {
  config: PlaygroundConfig;
  onReset: () => void;
}

export const PlaygroundPreview: React.FC<PlaygroundPreviewProps> = ({ config, onReset }) => {
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [scrollProgress, setScrollProgress] = useState(0.4);
  const [isPlaying, setIsPlaying] = useState(false);
  const fpsMetrics = useFpsMeter(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafAnimRef = useRef<number | null>(null);

  // Wheel scrubbing inside the preview container
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * 0.0012;
    setScrollProgress((prev) => Math.min(1, Math.max(0, prev + delta)));
  };

  // Replay / Auto-play simulation
  const handleReplay = () => {
    setIsPlaying(true);
    setScrollProgress(0);
    const start = performance.now();
    const duration = config.duration * 1000;

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      setScrollProgress(progress);

      if (progress < 1) {
        rafAnimRef.current = requestAnimationFrame(step);
      } else {
        setIsPlaying(false);
      }
    };
    rafAnimRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    return () => {
      if (rafAnimRef.current !== null) cancelAnimationFrame(rafAnimRef.current);
    };
  }, []);

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

  return (
    <PlaygroundErrorBoundary onReset={onReset}>
      <div className="flex flex-col h-full rounded-2xl bg-white border border-zinc-200/90 shadow-xl overflow-hidden select-none">
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

          {/* Right Live Indicators & Replay */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReplay}
              disabled={isPlaying}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 hover:bg-zinc-200 text-[11px] font-semibold text-zinc-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{isPlaying ? 'Playing...' : 'Replay'}</span>
            </button>

            {/* Live 60 FPS Telemetry Badge */}
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{fpsMetrics.fps} FPS</span>
              <span className="text-[10px] text-emerald-600/70 hidden sm:inline">
                ({fpsMetrics.frameTimeMs}ms)
              </span>
            </div>
          </div>
        </div>

        {/* Main Preview Container with Responsive Constraints */}
        <div
          ref={containerRef}
          onWheel={handleWheel}
          className="flex-1 bg-zinc-100/60 p-4 sm:p-6 flex flex-col items-center justify-center overflow-hidden min-h-[400px]"
        >
          <div
            className={`relative w-full ${getContainerWidth()} h-[380px] rounded-2xl overflow-hidden shadow-lg border border-zinc-200/80 bg-[#090b10] transition-all duration-300 flex flex-col justify-between`}
          >
            {/* Background Backdrop */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <Image
                src="/images/example-hero.jpg"
                alt="Backdrop"
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover object-center opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090b10] via-transparent to-black/60" />
            </div>

            {/* Mini Nav Bar inside preview */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 text-white select-none shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-[#FF5A1F] flex items-center justify-center text-white text-[10px] font-black">
                  S
                </div>
                <span className="font-bold text-xs tracking-tight">ScrollCraft Live</span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-zinc-400 font-medium">
                <span className="text-[#FF5A1F] font-semibold">{config.vibe}</span>
                <span>•</span>
                <span>GPU Compositor</span>
              </div>
            </div>

            {/* Showcase Scene Rendering */}
            <div className="relative flex-1 flex flex-col items-center justify-center text-center px-6 overflow-hidden">
              {config.showcaseId === 'hero-parallax' && (
                <ParallaxShowcaseScene config={config} scrollProgress={scrollProgress} />
              )}
              {config.showcaseId === 'reveal-stagger' && (
                <RevealShowcaseScene config={config} scrollProgress={scrollProgress} />
              )}
              {config.showcaseId === 'velocity-marquee' && (
                <MarqueeShowcaseScene config={config} scrollProgress={scrollProgress} />
              )}
              {config.showcaseId === 'magnetic-card' && (
                <MagneticShowcaseScene config={config} />
              )}
            </div>

            {/* Bottom Scene Indicator */}
            <div className="px-5 py-2 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
              <span>Scroll with mouse wheel or scrub slider below</span>
              <span className="text-[#FF5A1F]">Delta: {(scrollProgress * 100).toFixed(0)}%</span>
            </div>
          </div>

          {/* Scrub Slider on Canvas Bottom */}
          <div className="w-full max-w-md mt-4 flex items-center gap-3 px-3 py-1.5 rounded-full bg-white border border-zinc-200 shadow-2xs">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider shrink-0">
              Scroll Scrub:
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              aria-label="Scroll simulation position"
              value={scrollProgress}
              onChange={(e) => setScrollProgress(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#FF5A1F]"
            />
            <span className="text-xs font-mono font-bold text-zinc-800 w-10 text-right">
              {Math.round(scrollProgress * 100)}%
            </span>
          </div>
        </div>
      </div>
    </PlaygroundErrorBoundary>
  );
};

/* --- Showcase Sub-Scenes Powered Directly by ScrollCraft Principles --- */

function ParallaxShowcaseScene({
  config,
  scrollProgress,
}: {
  config: PlaygroundConfig;
  scrollProgress: number;
}) {
  const travel = (scrollProgress - 0.5) * 120;
  const layer1Y = travel * config.speed;
  const layer2Y = travel * (config.speed * 1.8);

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Background Floating Pill */}
      <div
        style={{
          transform: `translate3d(0, ${-layer1Y}px, 0)`,
          willChange: config.willChange ? 'transform' : 'auto',
          transition: config.scrub ? 'none' : `transform ${config.duration}s ${config.easing}`,
        }}
        className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] text-white font-mono mb-3"
      >
        Depth Layer (Speed: {config.speed.toFixed(2)}x)
      </div>

      {/* Main Foreground Card */}
      <div
        style={{
          transform: `translate3d(0, ${layer2Y}px, 0)`,
          willChange: config.willChange ? 'transform' : 'auto',
          transition: config.scrub ? 'none' : `transform ${config.duration}s ${config.easing}`,
        }}
        className="p-5 rounded-2xl bg-white/95 text-zinc-950 shadow-2xl border border-white max-w-xs text-center"
      >
        <span className="text-[10px] font-mono font-bold text-[#FF5A1F] uppercase tracking-wider">
          @scrollcraft/react
        </span>
        <h3 className="text-base font-extrabold tracking-tight mt-1 mb-1">
          Zero-Jank Parallax
        </h3>
        <p className="text-[11px] text-zinc-500 leading-relaxed">
          Compositor translate3d transforms offloaded from the JavaScript main thread.
        </p>
      </div>
    </div>
  );
}

function RevealShowcaseScene({
  config,
  scrollProgress,
}: {
  config: PlaygroundConfig;
  scrollProgress: number;
}) {
  const isTriggered = scrollProgress > 0.25;
  const translateY = isTriggered ? 0 : config.distance;
  const opacity = isTriggered ? 1 : 0.15;

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        style={{
          transform: `translate3d(0, ${translateY}px, 0)`,
          opacity,
          willChange: config.willChange ? 'transform, opacity' : 'auto',
          transition: `all ${config.duration}s cubic-bezier(0.16, 1, 0.3, 1)`,
        }}
        className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 text-white shadow-xl max-w-xs text-center"
      >
        <div className="w-7 h-7 rounded-lg bg-[#FF5A1F] flex items-center justify-center mx-auto mb-2 text-white font-bold text-xs">
          ✓
        </div>
        <h3 className="text-sm font-bold">Intersection Reveal</h3>
        <p className="text-[11px] text-zinc-400 mt-1">
          Trigger threshold passed at {(scrollProgress * 100).toFixed(0)}%
        </p>
      </div>

      <span className="text-[10px] font-mono text-zinc-400">
        Status: {isTriggered ? 'Revealed' : 'Pending Scroll Threshold'}
      </span>
    </div>
  );
}

function MarqueeShowcaseScene({
  config,
  scrollProgress,
}: {
  config: PlaygroundConfig;
  scrollProgress: number;
}) {
  const dynamicVelocity = (scrollProgress * 5).toFixed(1);

  return (
    <div className="w-full flex flex-col items-center gap-4 py-4">
      <div className="w-full overflow-hidden py-3 bg-white/5 rounded-xl border border-white/10">
        <VelocityMarquee
          baseSpeed={Math.round(config.speed * 60)}
          velocityMultiplier={2}
          direction={config.direction === 'right' ? 'right' : 'left'}
          className="text-lg font-black tracking-widest text-white gap-6"
        >
          <span>SCROLLCRAFT</span>
          <span className="text-[#FF5A1F]">•</span>
          <span>120 FPS</span>
          <span className="text-[#FF5A1F]">•</span>
          <span>REACT 19 NATIVE</span>
          <span className="text-[#FF5A1F]">•</span>
        </VelocityMarquee>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
        <Zap className="w-3.5 h-3.5 text-[#FF5A1F]" />
        <span>Calculated Scroll Velocity: {dynamicVelocity}x</span>
      </div>
    </div>
  );
}

function MagneticShowcaseScene({ config }: { config: PlaygroundConfig }) {
  const { ref } = useMagnetic({
    strength: 0.45,
    stiffness: config.stiffness,
    damping: config.damping,
  });

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className="p-6 rounded-2xl bg-white text-zinc-950 shadow-2xl border border-zinc-200 cursor-pointer select-none max-w-xs transform-gpu hover:scale-105 transition-all duration-200"
      >
        <span className="text-[10px] font-mono font-bold text-[#FF5A1F] uppercase tracking-wider block mb-1">
          Zero-Rerender Spring
        </span>
        <h3 className="text-base font-extrabold text-zinc-900">
          Hover Cursor Near Me
        </h3>
        <p className="text-[11px] text-zinc-500 mt-1">
          Direct pointer attraction with stiffness {config.stiffness} & damping {config.damping}.
        </p>
      </div>
      <span className="text-[10px] text-zinc-400 font-mono">
        Move your mouse over the card to test kinetic attraction
      </span>
    </div>
  );
}
