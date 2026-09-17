'use client';

/**
 * ScrollCraft DevTools Performance Inspector & Studio HUD
 * High-precision developer console and diagnostic studio featuring:
 * - Direct 120 FPS / frame latency readout synchronized with central Ticker
 * - Frame drop timeline and dropped frame telemetry (recent + lifetime)
 * - Live scroll velocity, scroll offset, and normalized progress
 * - Autonomous performance tier badge ('high' | 'balanced' | 'low')
 * - Interactive trigger registry inspection tray with spatial bounds
 * - Global GSAP-style visual marker switch
 * - Live Tweak & Copy React Props export tool
 *
 * Invariant:
 * - Strict 0 React Virtual DOM re-renders during active scrolling.
 * - All telemetry displays update via direct DOM ref mutation in Ticker Phase 4 ('render').
 * - When collapsed, pauses its Ticker task to permit 0-power Idle Sleep.
 *
 * Strictly under 650 LOC.
 */

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
import { ScrollInspectorProps } from '../types';

export type { ScrollInspectorProps };

export function ScrollInspector({
  position = 'bottom-right',
  defaultCollapsed = false,
  markers = false,
  studio: initialStudio = false,
}: ScrollInspectorProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [showTriggers, setShowTriggers] = useState(false);
  const [studioActive, setStudioActive] = useState(initialStudio);
  const [markersActive, setMarkersActive] = useState(markers);
  const [triggers, setTriggers] = useState<ScrollTriggerRecord[]>([]);
  const [copied, setCopied] = useState(false);

  const tier: PerformanceTier = useScrollCraftTier();
  const { getMetrics, subscribe } = useScrollCraft();

  // Direct DOM Refs for 0-rerender updates
  const fpsRef = useRef<HTMLSpanElement>(null);
  const msRef = useRef<HTMLSpanElement>(null);
  const velocityRef = useRef<HTMLSpanElement>(null);
  const scrollRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const droppedFramesRef = useRef<HTMLSpanElement>(null);
  const studioFpsRef = useRef<HTMLSpanElement>(null);

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

  const copyReactProps = () => {
    const snippet = `<ScrollTransform
  preset="fade-up"
  scrub={1}
  start="top 80%"
  end="bottom 20%"
  markers={${markersActive}}
/>`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Telemetry smoothing and mutation deduplication refs
  const lastUpdateTime = useRef(0);
  const frameCount = useRef(0);
  const lastFpsVal = useRef(-1);
  const lastMsVal = useRef(-1);
  const lastDotColor = useRef('');
  const lastScrollVal = useRef(-1);
  const lastVelocityVal = useRef(-1);
  const lastProgressVal = useRef(-1);

  const updateFrameHealthText = (el: HTMLSpanElement, recentDrops: number, health: number) => {
    if (recentDrops === 0) {
      el.textContent = '100% Smooth (0 drops)';
      el.style.color = '#22c55e';
    } else if (recentDrops <= 3) {
      el.textContent = `${health}% Smooth (${recentDrops} drop${recentDrops > 1 ? 's' : ''})`;
      el.style.color = '#22c55e';
    } else if (recentDrops <= 8) {
      el.textContent = `${health}% (${recentDrops} drops / 60f)`;
      el.style.color = '#eab308';
    } else {
      el.textContent = `${health}% (${recentDrops} drops / 60f)`;
      el.style.color = '#ef4444';
    }
  };

  // Sync HUD & Collapsed Badge readouts immediately whenever collapsed state toggles
  useEffect(() => {
    const { fps, frameMs } = ticker.getFrameRate();
    lastFpsVal.current = fps;
    lastMsVal.current = frameMs;
    const color = fps >= 50 ? '#22c55e' : fps >= 30 ? '#eab308' : '#ef4444';
    lastDotColor.current = color;

    if (fpsRef.current) {
      fpsRef.current.textContent = `${fps}`;
    }
    if (msRef.current) {
      msRef.current.textContent = `${frameMs.toFixed(1)}ms`;
    }
    if (dotRef.current) {
      dotRef.current.style.backgroundColor = color;
    }
    if (droppedFramesRef.current) {
      const { recent: recentDrops, health } = ticker.getDroppedFrames();
      updateFrameHealthText(droppedFramesRef.current, recentDrops, health);
    }
  }, [collapsed]);

  // When collapsed, dynamically update the collapsed pill readout during active scrolling
  // without keeping the full 4-phase ticker active during idle (preserves 0-power idle sleep).
  const lastCollapsedUpdateTime = useRef(0);
  useEffect(() => {
    if (!collapsed) return;
    const unsub = subscribe(() => {
      const now = performance.now();
      if (now - lastCollapsedUpdateTime.current < 150) return;
      lastCollapsedUpdateTime.current = now;

      const { fps } = ticker.getFrameRate();
      if (fpsRef.current && lastFpsVal.current !== fps) {
        lastFpsVal.current = fps;
        fpsRef.current.textContent = `${fps}`;
      }
      const color = fps >= 50 ? '#22c55e' : fps >= 30 ? '#eab308' : '#ef4444';
      if (dotRef.current && lastDotColor.current !== color) {
        lastDotColor.current = color;
        dotRef.current.style.backgroundColor = color;
      }
    });
    return unsub;
  }, [collapsed, subscribe]);

  // Phase 4 direct DOM composite hook: 0 React re-renders on scroll!
  useTicker(
    (_dt, _elapsed, currentTime) => {
      frameCount.current++;

      // Update FPS readout every ~200ms to eliminate visual jitter & redundant mutations
      if (currentTime - lastUpdateTime.current >= 200) {
        const { fps, frameMs } = ticker.getFrameRate();
        const { recent: recentDrops, health } = ticker.getDroppedFrames();

        if (fpsRef.current && lastFpsVal.current !== fps) {
          lastFpsVal.current = fps;
          fpsRef.current.textContent = `${fps}`;
        }
        if (studioFpsRef.current) {
          studioFpsRef.current.textContent = `${fps} FPS`;
        }
        if (msRef.current && lastMsVal.current !== frameMs) {
          lastMsVal.current = frameMs;
          msRef.current.textContent = `${frameMs.toFixed(1)}ms`;
        }
        if (droppedFramesRef.current) {
          updateFrameHealthText(droppedFramesRef.current, recentDrops, health);
        }
        const color = fps >= 50 ? '#22c55e' : fps >= 30 ? '#eab308' : '#ef4444';
        if (dotRef.current && lastDotColor.current !== color) {
          lastDotColor.current = color;
          dotRef.current.style.backgroundColor = color;
        }

        lastUpdateTime.current = currentTime;
        frameCount.current = 0;
      }

      // Live scroll metrics: only computed and written when expanded
      if (!collapsed) {
        const metrics = getMetrics ? getMetrics() : null;
        if (metrics) {
          const roundedScroll = Math.round(metrics.scroll);
          if (scrollRef.current && lastScrollVal.current !== roundedScroll) {
            lastScrollVal.current = roundedScroll;
            scrollRef.current.textContent = `${roundedScroll}px`;
          }

          const roundedVel = Math.round(metrics.velocity);
          if (velocityRef.current && lastVelocityVal.current !== roundedVel) {
            lastVelocityVal.current = roundedVel;
            velocityRef.current.textContent = `${roundedVel} px/s`;
          }

          const roundedProg = Math.round(metrics.progress * 100);
          if (progressRef.current && lastProgressVal.current !== roundedProg) {
            lastProgressVal.current = roundedProg;
            progressRef.current.textContent = `${roundedProg}%`;
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
      }
    },
    { phase: 'render', enabled: !collapsed }
  );

  const positionMap: Record<NonNullable<ScrollInspectorProps['position']>, string> = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  };
  const positionClasses = positionMap[position] ?? positionMap['bottom-right'];

  return (
    <aside
      aria-label="ScrollCraft Performance Inspector"
      className={`fixed ${positionClasses} z-[999999] select-none font-mono text-[11px] leading-tight`}
      style={{ contain: 'layout paint' }}
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
            className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(34,197,94,0.6)] group-hover:scale-110 transition-transform"
          />
          <div className="flex items-baseline gap-1">
            <span ref={fpsRef} className="font-bold text-white text-xs">
              60
            </span>
            <span className="text-[10px] text-zinc-500 uppercase">FPS</span>
          </div>
          <span className="text-zinc-700 select-none">•</span>
          <span className="text-[9px] uppercase tracking-wider text-violet-400/90 font-medium">
            {tier}
          </span>
        </button>
      ) : (
        <div className="w-[310px] rounded-2xl bg-[#08080b]/95 text-zinc-300 border border-zinc-800/90 shadow-2xl backdrop-blur-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-zinc-800/80 bg-zinc-900/30">
            <div className="flex items-center gap-2">
              <span
                ref={dotRef}
                className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
              />
              <span className="font-sans font-bold text-xs text-white tracking-wider">
                SCROLLCRAFT
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded uppercase font-semibold bg-zinc-900 text-zinc-400 border border-zinc-800">
                {studioActive ? 'STUDIO' : 'HUD'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setStudioActive(!studioActive)}
                className={`text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold border transition-colors cursor-pointer ${
                  studioActive
                    ? 'bg-violet-950/60 text-violet-300 border-violet-700'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                }`}
                title="Toggle Studio Mode"
              >
                Studio
              </button>

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
                  60
                </span>
                <span ref={msRef} className="text-[10px] text-zinc-400">
                  16.7ms
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

          {/* Studio Frame Drop Ribbon */}
          <div className="flex items-center justify-between px-3.5 py-1.5 border-b border-zinc-800/80 bg-zinc-900/40 text-[10px]">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <span className="text-zinc-500">Frame Health:</span>
              <span ref={droppedFramesRef} className="font-bold font-mono text-emerald-400">
                100% Smooth (0 drops)
              </span>
            </div>
            <div className="flex items-center gap-1 text-emerald-400 font-bold font-mono bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>0 Re-renders</span>
            </div>
          </div>

          {/* Scroll Progress Bar */}
          <div className="px-3.5 py-2.5 border-b border-zinc-800/80 flex items-center gap-2.5">
            <span className="text-[9px] text-zinc-500 uppercase tracking-wider w-12">Progress</span>
            <div className="flex-1 h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/60">
              <div
                ref={progressFillRef}
                className="h-full bg-gradient-to-r from-violet-600 to-indigo-500"
                style={{ width: '0%' }}
              />
            </div>
            <span
              ref={progressRef}
              className="text-[10px] font-semibold text-zinc-300 w-8 text-right font-mono"
            >
              0%
            </span>
          </div>

          {/* Studio Mode Panel */}
          {studioActive && (
            <div className="p-3 border-b border-zinc-800/80 bg-violet-950/10 space-y-2">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-zinc-400 uppercase font-semibold text-[9px] tracking-wider">
                  Live Studio Tools
                </span>
                <button
                  type="button"
                  onClick={copyReactProps}
                  className="px-2 py-0.5 rounded bg-violet-900/60 text-violet-200 hover:bg-violet-800 transition-colors border border-violet-700/60 cursor-pointer text-[9px]"
                >
                  {copied ? '✓ Copied Props!' : 'Copy React Props'}
                </button>
              </div>
              <div className="text-[9px] text-zinc-500 leading-normal">
                Direct DOM compositing active. Triggers monitor viewport entry without React VDOM churn.
              </div>
            </div>
          )}

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
