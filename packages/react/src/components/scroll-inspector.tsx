'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ticker,
  triggerRegistry,
  markerManager,
  ScrollTriggerRecord,
  PerformanceTier,
} from '@scrollcraft/core';
import { useScrollCraft, useScrollCraftTier } from '../context';
import { useTicker } from '../hooks/useTicker';

export interface ScrollInspectorProps {
  /** Initial placement on screen. Default: 'bottom-right' */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  /** Start initially collapsed. Default: false */
  defaultCollapsed?: boolean;
  /** Whether to automatically enable visual markers globally on mount. Default: false */
  markers?: boolean;
}

/**
 * ScrollCraft DevTools Performance Inspector HUD
 * High-precision developer console featuring:
 * - Direct 120 FPS / frame latency readout synchronized with central Ticker
 * - Live scroll velocity, scroll offset, and normalized progress
 * - Autonomous performance tier badge ('high' | 'balanced' | 'low')
 * - Interactive trigger registry inspection tray
 * - Global GSAP-style visual marker switch
 * 
 * Invariant:
 * - Executes 0 React Virtual DOM re-renders during active scrolling.
 * - All telemetry displays update via direct DOM ref mutation in Ticker Phase 3 ('render').
 * - When collapsed, pauses its Ticker task to permit 0-power Idle Sleep.
 */
export function ScrollInspector({
  position = 'bottom-right',
  defaultCollapsed = false,
  markers = false,
}: ScrollInspectorProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [showTriggers, setShowTriggers] = useState(false);
  const [markersActive, setMarkersActive] = useState(markers);
  const [triggers, setTriggers] = useState<ScrollTriggerRecord[]>([]);

  const tier: PerformanceTier = useScrollCraftTier();
  const { getMetrics } = useScrollCraft();

  // Direct DOM Refs for 0-rerender updates
  const fpsRef = useRef<HTMLSpanElement>(null);
  const msRef = useRef<HTMLSpanElement>(null);
  const velocityRef = useRef<HTMLSpanElement>(null);
  const scrollRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);

  // Trigger progress bar refs
  const triggerBarsRef = useRef<Map<string, HTMLDivElement>>(new Map());

  // Initialize and sync global markers state
  useEffect(() => {
    if (markers) {
      markerManager.setGlobalMarkers(true);
      setMarkersActive(true);
    }
    return () => {
      if (markers) {
        markerManager.setGlobalMarkers(false);
      }
    };
  }, [markers]);

  // Subscribe to trigger registry changes (infrequent: only on mount/unmount of components)
  useEffect(() => {
    const unsub = triggerRegistry.subscribe((allTriggers) => {
      setTriggers(allTriggers);
    });
    return unsub;
  }, []);

  const toggleMarkers = () => {
    const next = !markersActive;
    setMarkersActive(next);
    markerManager.setGlobalMarkers(next);
  };

  // Telemetry smoothing state
  const lastUpdateTime = useRef(0);
  const frameCount = useRef(0);

  // Phase 3 direct DOM composite hook: 0 React re-renders on scroll!
  useTicker(
    (_dt, _elapsed, currentTime) => {
      frameCount.current++;

      // Update FPS readout every ~200ms to eliminate visual jitter
      if (currentTime - lastUpdateTime.current >= 200) {
        const { fps, frameMs } = ticker.getFrameRate();

        if (fpsRef.current) {
          fpsRef.current.innerText = `${fps}`;
        }
        if (msRef.current) {
          msRef.current.innerText = `${frameMs.toFixed(1)}ms`;
        }
        if (dotRef.current) {
          dotRef.current.style.backgroundColor =
            fps >= 50 ? '#22c55e' : fps >= 30 ? '#eab308' : '#ef4444';
        }

        lastUpdateTime.current = currentTime;
        frameCount.current = 0;
      }

      // Live scroll metrics
      const metrics = getMetrics ? getMetrics() : null;
      if (metrics) {
        if (scrollRef.current) {
          scrollRef.current.innerText = `${Math.round(metrics.scroll)}px`;
        }
        if (velocityRef.current) {
          velocityRef.current.innerText = `${Math.round(metrics.velocity)} px/s`;
        }
        if (progressRef.current) {
          progressRef.current.innerText = `${Math.round(metrics.progress * 100)}%`;
        }
        if (progressFillRef.current) {
          progressFillRef.current.style.width = `${(metrics.progress * 100).toFixed(1)}%`;
        }
      }

      // Update trigger progress bars in inspector tray
      if (showTriggers && triggers.length > 0) {
        for (const t of triggers) {
          const bar = triggerBarsRef.current.get(t.id);
          if (bar) {
            bar.style.width = `${(t.progress * 100).toFixed(0)}%`;
          }
        }
      }
    },
    { phase: 'render', enabled: !collapsed }
  );

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  }[position];

  return (
    <aside
      aria-label="ScrollCraft Performance Inspector"
      className={`fixed ${positionClasses} z-[999999] select-none font-mono text-[11px] leading-tight`}
    >
      {collapsed ? (
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-zinc-950/90 text-zinc-300 border border-white/15 shadow-2xl backdrop-blur-md hover:border-white/30 transition-all"
          title="Expand ScrollCraft Inspector"
        >
          <span
            ref={dotRef}
            className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
          />
          <span ref={fpsRef} className="font-bold text-white">
            60
          </span>{' '}
          FPS
          <span className="text-[9px] uppercase tracking-wider text-zinc-400">({tier})</span>
        </button>
      ) : (
        <div className="w-[300px] rounded-xl bg-zinc-950/95 text-zinc-300 border border-white/15 shadow-2xl backdrop-blur-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <span
                ref={dotRef}
                className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
              />
              <span className="font-sans font-bold text-[12px] text-white tracking-wide">
                SCROLLCRAFT
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded uppercase font-semibold bg-white/10 text-zinc-400">
                HUD
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-bold border ${
                  tier === 'high'
                    ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                    : tier === 'low'
                    ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                    : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                }`}
              >
                {tier}
              </span>

              <button
                type="button"
                onClick={() => setCollapsed(true)}
                className="w-5 h-5 rounded flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 transition-colors ml-1"
                title="Minimize Inspector"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 p-3 border-b border-white/10 bg-white/[0.01]">
            <div className="flex flex-col">
              <span className="text-[9px] text-zinc-500 uppercase">FPS / Latency</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span ref={fpsRef} className="font-bold text-white text-[15px]">
                  60
                </span>
                <span ref={msRef} className="text-[10px] text-zinc-400">
                  16.7ms
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-[9px] text-zinc-500 uppercase">Velocity</span>
              <span ref={velocityRef} className="font-semibold text-zinc-200 mt-0.5">
                0 px/s
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[9px] text-zinc-500 uppercase">Scroll Y</span>
              <span ref={scrollRef} className="font-semibold text-zinc-200 mt-0.5">
                0px
              </span>
            </div>
          </div>

          {/* Scroll Progress Bar */}
          <div className="px-3 py-2 border-b border-white/10 flex items-center gap-2">
            <span className="text-[9px] text-zinc-500 uppercase w-12">Progress</span>
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                ref={progressFillRef}
                className="h-full bg-blue-500 transition-all duration-75 ease-out"
                style={{ width: '0%' }}
              />
            </div>
            <span ref={progressRef} className="text-[10px] font-semibold text-zinc-300 w-8 text-right">
              0%
            </span>
          </div>

          {/* Control Bar: Markers Toggle & Triggers Drawer */}
          <div className="px-3 py-2 flex items-center justify-between bg-white/[0.02]">
            <button
              type="button"
              onClick={toggleMarkers}
              className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-medium border transition-colors ${
                markersActive
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  markersActive ? 'bg-emerald-400' : 'bg-zinc-600'
                }`}
              />
              Markers: {markersActive ? 'ON' : 'OFF'}
            </button>

            <button
              type="button"
              onClick={() => setShowTriggers(!showTriggers)}
              className="text-[10px] text-zinc-400 hover:text-white transition-colors"
            >
              Triggers ({triggers.length}) {showTriggers ? '▲' : '▼'}
            </button>
          </div>

          {/* Triggers Drawer */}
          {showTriggers && (
            <div className="max-h-48 overflow-y-auto p-2 border-t border-white/10 bg-black/40 space-y-1.5">
              {triggers.length === 0 ? (
                <div className="text-zinc-500 text-center py-2 text-[10px]">
                  No active triggers registered.
                </div>
              ) : (
                triggers.map((t) => (
                  <div
                    key={t.id}
                    className="p-1.5 rounded bg-white/[0.03] border border-white/5 flex flex-col gap-1 text-[10px]"
                  >
                    <div className="flex items-center justify-between text-zinc-300">
                      <span className="font-semibold text-zinc-200 truncate max-w-[140px]">
                        {t.id}
                      </span>
                      <span className="text-[9px] uppercase px-1 rounded bg-white/10 text-zinc-400">
                        {t.type}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-zinc-500 text-[9px]">
                      <span>start: {Math.round(t.startY)}px</span>
                      <span>end: {Math.round(t.endY)}px</span>
                    </div>

                    {/* Progress track */}
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-0.5">
                      <div
                        ref={(el) => {
                          if (el) triggerBarsRef.current.set(t.id, el);
                          else triggerBarsRef.current.delete(t.id);
                        }}
                        className="h-full bg-emerald-500"
                        style={{ width: `${(t.progress * 100).toFixed(0)}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
