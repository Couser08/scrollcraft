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
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#08080a]/90 text-zinc-300 border border-zinc-800/90 shadow-2xl backdrop-blur-md hover:border-zinc-700 hover:text-white transition-all cursor-pointer group"
          title="Expand ScrollCraft Telemetry HUD"
        >
          <span
            ref={dotRef}
            className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.6)] group-hover:scale-110 transition-transform"
          />
          <div className="flex items-baseline gap-1">
            <span ref={fpsRef} className="font-bold text-white text-xs">
              120
            </span>
            <span className="text-[10px] text-zinc-500 uppercase">FPS</span>
          </div>
          <span className="text-zinc-700 select-none">•</span>
          <span className="text-[9px] uppercase tracking-wider text-violet-400/90 font-medium">
            {tier}
          </span>
        </button>
      ) : (
        <div className="w-[290px] rounded-2xl bg-[#08080b]/95 text-zinc-300 border border-zinc-800/90 shadow-2xl backdrop-blur-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-zinc-800/80 bg-zinc-900/30">
            <div className="flex items-center gap-2">
              <span
                ref={dotRef}
                className="w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.6)]"
              />
              <span className="font-sans font-bold text-xs text-white tracking-wider">
                SCROLLCRAFT
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded uppercase font-semibold bg-zinc-900 text-zinc-400 border border-zinc-800">
                HUD
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span
                className={`text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold border ${
                  tier === 'high'
                    ? 'bg-violet-950/50 text-violet-300 border-violet-800/40'
                    : tier === 'low'
                    ? 'bg-amber-950/50 text-amber-300 border-amber-800/40'
                    : 'bg-emerald-950/50 text-emerald-300 border-emerald-800/40'
                }`}
              >
                {tier}
              </span>

              <button
                type="button"
                onClick={() => setCollapsed(true)}
                className="w-5 h-5 rounded flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors ml-1 cursor-pointer"
                title="Minimize Inspector"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 p-3 border-b border-zinc-800/80 bg-zinc-950/40">
            <div className="flex flex-col">
              <span className="text-[9px] text-zinc-500 uppercase tracking-wider">FPS / Latency</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span ref={fpsRef} className="font-bold text-white text-[15px]">
                  120
                </span>
                <span ref={msRef} className="text-[10px] text-zinc-400">
                  8.3ms
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-[9px] text-zinc-500 uppercase tracking-wider">Velocity</span>
              <span ref={velocityRef} className="font-semibold text-zinc-200 mt-0.5">
                0 px/s
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[9px] text-zinc-500 uppercase tracking-wider">Scroll Y</span>
              <span ref={scrollRef} className="font-semibold text-zinc-200 mt-0.5">
                0px
              </span>
            </div>
          </div>

          {/* Scroll Progress Bar */}
          <div className="px-3.5 py-2.5 border-b border-zinc-800/80 flex items-center gap-2.5">
            <span className="text-[9px] text-zinc-500 uppercase tracking-wider w-12">Progress</span>
            <div className="flex-1 h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/60">
              <div
                ref={progressFillRef}
                className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 transition-all duration-75 ease-out"
                style={{ width: '0%' }}
              />
            </div>
            <span ref={progressRef} className="text-[10px] font-semibold text-zinc-300 w-8 text-right font-mono">
              0%
            </span>
          </div>

          {/* Control Bar: Markers Toggle & Triggers Drawer */}
          <div className="px-3.5 py-2 flex items-center justify-between bg-zinc-900/20">
            <button
              type="button"
              onClick={toggleMarkers}
              className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-medium border transition-colors cursor-pointer ${
                markersActive
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200'
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
              className="text-[10px] text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Triggers ({triggers.length})</span>
              <span className="text-[8px]">{showTriggers ? '▲' : '▼'}</span>
            </button>
          </div>

          {/* Triggers Drawer */}
          {showTriggers && (
            <div className="max-h-48 overflow-y-auto p-2 border-t border-zinc-800/80 bg-black/60 space-y-1.5">
              {triggers.length === 0 ? (
                <div className="text-zinc-500 text-center py-2 text-[10px]">
                  No active triggers registered.
                </div>
              ) : (
                triggers.map((t) => (
                  <div
                    key={t.id}
                    className="p-2 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col gap-1 text-[10px]"
                  >
                    <div className="flex items-center justify-between text-zinc-300">
                      <span className="font-semibold text-zinc-200 truncate max-w-[140px]">
                        {t.id}
                      </span>
                      <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60">
                        {t.type}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-zinc-500 text-[9px]">
                      <span>start: {Math.round(t.startY)}px</span>
                      <span>end: {Math.round(t.endY)}px</span>
                    </div>

                    {/* Progress track */}
                    <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden mt-0.5">
                      <div
                        ref={(el) => {
                          if (el) triggerBarsRef.current.set(t.id, el);
                          else triggerBarsRef.current.delete(t.id);
                        }}
                        className="h-full bg-violet-500"
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
