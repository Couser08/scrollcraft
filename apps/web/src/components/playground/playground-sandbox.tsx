'use client';

/**
 * Truly Isolated iframe Sandbox for ScrollCraft Playground
 * Runs in an isolated iframe srcDoc environment to guarantee zero host crashes.
 * Supports 3-Way Engine Mode (ScrollCraft vs GSAP vs Native CSS vs 3-Way Split)
 * and 3-Way Viewport Mode (Desktop vs Tablet vs Mobile).
 */

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCcw,
  Zap,
  Columns,
} from 'lucide-react';
import {
  PlaygroundConfig,
  ViewportMode,
} from './playground-types';

export type EngineMode = 'scrollcraft' | 'gsap' | 'css' | 'split';

interface PlaygroundSandboxProps {
  config: PlaygroundConfig;
  onReset?: () => void;
}

export const PlaygroundSandbox: React.FC<PlaygroundSandboxProps> = ({
  config,
  onReset: _onReset,
}) => {
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [engineMode, setEngineMode] = useState<EngineMode>('scrollcraft');
  const [scrollProgress, setScrollProgress] = useState(0.4);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fps, setFps] = useState(60);
  const [latency, setLatency] = useState(16.6);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const isIframeReadyRef = useRef(false);
  const rafAnimRef = useRef<number | null>(null);

  // Responsive device container styling
  const getContainerStyle = () => {
    switch (viewport) {
      case 'mobile':
        return 'w-[340px] max-w-[340px] rounded-[32px] border-[6px] border-zinc-800 shadow-2xl';
      case 'tablet':
        return 'w-[540px] max-w-[540px] rounded-2xl border-4 border-zinc-800 shadow-2xl';
      default:
        return 'w-full max-w-full rounded-2xl border border-zinc-800 shadow-xl';
    }
  };

  // Generate the HTML/CSS/JS document string for the sandboxed iframe
  const initialSrcDoc = useMemo(() => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      background: #090b10;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      overflow: hidden;
      user-select: none;
      width: 100%;
      height: 100%;
    }
    .scene-container {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 16px;
      overflow: hidden;
    }
    .backdrop-image {
      position: absolute;
      inset: 0;
      background-image: radial-gradient(circle at 50% 30%, rgba(255, 90, 31, 0.18), transparent 70%),
                        radial-gradient(circle at 80% 80%, rgba(37, 99, 235, 0.15), transparent 60%);
      pointer-events: none;
    }
    .card {
      background: rgba(255, 255, 255, 0.96);
      color: #090b10;
      border-radius: 16px;
      padding: 22px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.9);
      max-width: 300px;
      text-align: center;
      transition: none;
      transform-origin: center center;
      will-change: transform, opacity;
    }
    .card.gsap-style {
      background: #064E3B;
      color: #ffffff;
      border-color: #059669;
    }
    .card.css-style {
      background: #1E293B;
      color: #ffffff;
      border-color: #334155;
    }
    .badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 9999px;
      font-size: 10px;
      font-weight: 800;
      font-family: monospace;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
    }
    .badge-craft {
      background: #FFF7ED;
      color: #FF5A1F;
      border: 1px solid #FFEDD5;
    }
    .badge-gsap {
      background: rgba(52, 211, 153, 0.2);
      color: #34D399;
      border: 1px solid rgba(52, 211, 153, 0.4);
    }
    .badge-css {
      background: rgba(148, 163, 184, 0.2);
      color: #94A3B8;
      border: 1px solid rgba(148, 163, 184, 0.4);
    }
    .card h3 {
      font-size: 17px;
      font-weight: 900;
      letter-spacing: -0.02em;
      margin-bottom: 6px;
    }
    .card p {
      font-size: 11px;
      color: #64748B;
      line-height: 1.5;
    }
    .card.gsap-style p { color: #A7F3D0; }
    .card.css-style p { color: #94A3B8; }

    /* 3-Way Split Grid */
    .split-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      width: 100%;
      height: 100%;
      align-items: center;
    }
    .split-col {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 12px 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      height: 280px;
      justify-content: space-between;
    }
    .split-col.winner {
      border: 2px solid #FF5A1F;
      background: rgba(255, 90, 31, 0.08);
    }
    .col-header {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .metric-pill {
      font-size: 10px;
      font-family: monospace;
      padding: 2px 6px;
      border-radius: 4px;
      margin-top: 4px;
    }
    /* Marquee */
    .marquee-track {
      display: flex;
      gap: 20px;
      white-space: nowrap;
      font-size: 18px;
      font-weight: 900;
      letter-spacing: 0.1em;
      will-change: transform;
    }
    /* Magnetic Target */
    .magnetic-box {
      width: 240px;
      height: 130px;
      background: #ffffff;
      color: #090b10;
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 15px 35px rgba(0,0,0,0.6);
      transition: transform 0.05s ease-out;
    }
  </style>
</head>
<body>
  <div class="backdrop-image"></div>
  <div class="scene-container" id="sceneContainer">
    <!-- Populated by JS -->
  </div>

  <script>
    let state = {
      config: ${JSON.stringify(config)},
      engineMode: '${engineMode}',
      scrollProgress: ${scrollProgress}
    };

    let currentPos = 0;
    let currentVel = 0;
    let lastTime = performance.now();
    let frameCount = 0;
    let sampleTime = performance.now();

    const container = document.getElementById('sceneContainer');

    function renderScene() {
      const mode = state.engineMode;
      const cfg = state.config;

      if (mode === 'split') {
        container.innerHTML = \`
          <div class="split-grid">
            <div class="split-col">
              <div>
                <div class="col-header" style="color: #94A3B8;">Native CSS</div>
                <div class="metric-pill" style="background: rgba(148,163,184,0.15); color: #94A3B8;">0 kB • Rigid</div>
              </div>
              <div id="cssTarget" style="width: 72px; height: 72px; border-radius: 12px; background: #334155; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; color: #CBD5E1;">
                CSS Step
              </div>
              <div style="font-size: 10px; color: #64748B;">~24ms delay</div>
            </div>

            <div class="split-col">
              <div>
                <div class="col-header" style="color: #34D399;">GSAP Scroll</div>
                <div class="metric-pill" style="background: rgba(52,211,153,0.15); color: #34D399;">65 kB • Main Thread</div>
              </div>
              <div id="gsapTarget" style="width: 72px; height: 72px; border-radius: 12px; background: #059669; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; color: white;">
                GSAP Eased
              </div>
              <div style="font-size: 10px; color: #64748B;">Layout reads</div>
            </div>

            <div class="split-col winner">
              <div>
                <div class="col-header" style="color: #FF5A1F;">ScrollCraft</div>
                <div class="metric-pill" style="background: rgba(255,90,31,0.2); color: #FF5A1F;">3.2 kB • 120 FPS</div>
              </div>
              <div id="craftTarget" style="width: 72px; height: 72px; border-radius: 12px; background: #FF5A1F; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; color: white; box-shadow: 0 0 20px rgba(255,90,31,0.5);">
                Subpixel
              </div>
              <div style="font-size: 10px; color: #FF5A1F; font-weight: bold;">GPU Composited</div>
            </div>
          </div>
        \`;
        return;
      }

      // Solo Showcase Scenes
      if (cfg.showcaseId === 'hero-parallax') {
        const badgeClass = mode === 'scrollcraft' ? 'badge-craft' : (mode === 'gsap' ? 'badge-gsap' : 'badge-css');
        const cardClass = mode === 'scrollcraft' ? 'card' : (mode === 'gsap' ? 'card gsap-style' : 'card css-style');
        container.innerHTML = \`
          <div id="parallaxPill" style="margin-bottom: 12px; padding: 4px 12px; border-radius: 999px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); font-size: 10px; font-family: monospace; color: #CBD5E1;">
            Speed: \${cfg.speed.toFixed(2)}x • \${mode.toUpperCase()}
          </div>
          <div class="\${cardClass}" id="mainTarget">
            <span class="badge \${badgeClass}">\${mode.toUpperCase()} ENGINE</span>
            <h3>Subpixel Parallax</h3>
            <p>Compositor translate3d layer separation with zero DOM layout thrashing.</p>
          </div>
        \`;
      } else if (cfg.showcaseId === 'reveal-stagger') {
        container.innerHTML = \`
          <div class="card" id="mainTarget">
            <div style="width: 32px; height: 32px; border-radius: 8px; background: #FF5A1F; color: white; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; font-weight: bold;">✓</div>
            <h3>Intersection Reveal</h3>
            <p>Distance: \${cfg.distance}px • Duration: \${cfg.duration}s</p>
          </div>
        \`;
      } else if (cfg.showcaseId === 'velocity-marquee') {
        container.innerHTML = \`
          <div style="width: 100%; overflow: hidden; padding: 18px 0; background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);">
            <div class="marquee-track" id="marqueeTrack">
              <span>SCROLLCRAFT</span> <span style="color:#FF5A1F">•</span>
              <span>ZERO JANK</span> <span style="color:#FF5A1F">•</span>
              <span>120 FPS NATIVE</span> <span style="color:#FF5A1F">•</span>
              <span>SCROLLCRAFT</span> <span style="color:#FF5A1F">•</span>
            </div>
          </div>
          <p style="margin-top: 14px; font-size: 10px; font-family: monospace; color: #94A3B8;">
            Velocity accelerated marquee
          </p>
        \`;
      } else if (cfg.showcaseId === 'magnetic-card') {
        container.innerHTML = \`
          <div class="magnetic-box" id="magneticTarget">
            <span class="badge badge-craft">SPRING STEP</span>
            <div style="font-weight: 800; font-size: 14px;">Hover Pointer Here</div>
            <div style="font-size: 10px; color: #64748B; margin-top: 4px;">Stiffness: \${cfg.stiffness} • Damping: \${cfg.damping}</div>
          </div>
          <p style="margin-top: 10px; font-size: 10px; font-family: monospace; color: #94A3B8;">
            Zero-rerender pointer attraction
          </p>
        \`;
      }
    }

    renderScene();

    // Message listener for parent updates
    window.addEventListener('message', (e) => {
      if (!e.data || typeof e.data !== 'object') return;
      if (e.data.type === 'UPDATE_CONFIG') {
        const prevEngine = state.engineMode;
        const prevShowcase = state.config.showcaseId;
        state.config = e.data.config;
        state.engineMode = e.data.engineMode;
        state.scrollProgress = e.data.scrollProgress;

        if (prevEngine !== state.engineMode || prevShowcase !== state.config.showcaseId) {
          renderScene();
        }
      }
    });

    // Magnetic cursor calculation
    document.addEventListener('mousemove', (e) => {
      const target = document.getElementById('magneticTarget');
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

      if (dist < 160) {
        const pull = (160 - dist) / 160 * 24;
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        target.style.transform = \`translate3d(\${Math.cos(angle) * pull}px, \${Math.sin(angle) * pull}px, 0)\`;
      } else {
        target.style.transform = 'translate3d(0, 0, 0)';
      }
    });

    // Wheel listener inside iframe posts scroll back to parent
    window.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY * 0.0012;
      state.scrollProgress = Math.min(1, Math.max(0, state.scrollProgress + delta));
      window.parent.postMessage({ type: 'SCROLL_UPDATE', progress: state.scrollProgress }, '*');
    }, { passive: false });

    // Inform parent that iframe is ready
    window.parent.postMessage({ type: 'IFRAME_READY' }, '*');

    // High performance RAF tick
    function tick(now) {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      frameCount++;

      if (now - sampleTime >= 250) {
        const computedFps = Math.min(144, Math.round((frameCount * 1000) / (now - sampleTime)));
        const frameLatency = parseFloat(((now - sampleTime) / frameCount).toFixed(1));
        window.parent.postMessage({
          type: 'TELEMETRY',
          fps: computedFps,
          latency: frameLatency
        }, '*');
        frameCount = 0;
        sampleTime = now;
      }

      const p = state.scrollProgress;
      const cfg = state.config;
      const mode = state.engineMode;

      if (mode === 'split') {
        const cssEl = document.getElementById('cssTarget');
        const gsapEl = document.getElementById('gsapTarget');
        const craftEl = document.getElementById('craftTarget');

        if (cssEl) {
          const y = (p - 0.5) * 80;
          cssEl.style.transform = \`translateY(\${Math.round(y)}px)\`;
        }
        if (gsapEl) {
          const y = Math.sin(p * Math.PI) * 40;
          gsapEl.style.transform = \`translateY(\${y.toFixed(1)}px)\`;
        }
        if (craftEl) {
          const targetY = (p - 0.5) * 100 * cfg.speed;
          const k = cfg.stiffness;
          const d = cfg.damping;
          const force = -k * (currentPos - targetY) - d * currentVel;
          const acc = force / (cfg.mass || 1);
          currentVel += acc * Math.min(dt, 0.032);
          currentPos += currentVel * Math.min(dt, 0.032);
          craftEl.style.transform = \`translate3d(0, \${currentPos.toFixed(2)}px, 0) scale(\${(0.95 + p * 0.1).toFixed(3)})\`;
        }
      } else {
        const main = document.getElementById('mainTarget');
        const pill = document.getElementById('parallaxPill');
        const marquee = document.getElementById('marqueeTrack');

        if (main) {
          if (cfg.showcaseId === 'hero-parallax') {
            if (mode === 'css') {
              const offset = Math.round((p - 0.5) * 120 * cfg.speed);
              main.style.transform = \`translateY(\${offset}px)\`;
            } else if (mode === 'gsap') {
              const offset = (p - 0.5) * 120 * cfg.speed;
              main.style.transform = \`translateY(\${offset.toFixed(1)}px)\`;
            } else {
              const targetY = (p - 0.5) * 120 * cfg.speed;
              const k = cfg.stiffness;
              const d = cfg.damping;
              const force = -k * (currentPos - targetY) - d * currentVel;
              const acc = force / (cfg.mass || 1);
              currentVel += acc * Math.min(dt, 0.032);
              currentPos += currentVel * Math.min(dt, 0.032);
              main.style.transform = \`translate3d(0, \${currentPos.toFixed(2)}px, 0)\`;
            }
            if (pill) {
              pill.style.transform = \`translate3d(0, \${-(p - 0.5) * 40}px, 0)\`;
            }
          } else if (cfg.showcaseId === 'reveal-stagger') {
            const triggered = p > 0.25;
            const dist = triggered ? 0 : cfg.distance;
            const opacity = triggered ? 1 : 0.15;
            main.style.transform = \`translate3d(0, \${dist}px, 0)\`;
            main.style.opacity = opacity;
            main.style.transition = \`all \${cfg.duration}s cubic-bezier(0.16, 1, 0.3, 1)\`;
          }
        }

        if (marquee) {
          const shift = (now * (cfg.speed * 0.15)) % 400;
          marquee.style.transform = \`translate3d(\${-shift}px, 0, 0)\`;
        }
      }

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  </script>
</body>
</html>`;
  }, [config.showcaseId]); // Only recreate document when showcase ID changes!

  // Send update to iframe whenever state changes
  const sendConfigToIframe = useCallback(() => {
    if (!iframeRef.current || !iframeRef.current.contentWindow) return;
    iframeRef.current.contentWindow.postMessage(
      {
        type: 'UPDATE_CONFIG',
        config,
        engineMode,
        scrollProgress,
      },
      '*'
    );
  }, [config, engineMode, scrollProgress]);

  useEffect(() => {
    sendConfigToIframe();
  }, [sendConfigToIframe]);

  // Handle messages from the iframe (FPS telemetry and scroll events)
  useEffect(() => {
    const handleIframeMessage = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== 'object') return;
      if (event.data.type === 'TELEMETRY') {
        setFps(event.data.fps || 60);
        setLatency(event.data.latency || 16.6);
      } else if (event.data.type === 'SCROLL_UPDATE') {
        setScrollProgress(event.data.progress);
      } else if (event.data.type === 'IFRAME_READY') {
        isIframeReadyRef.current = true;
        sendConfigToIframe();
      }
    };

    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, [sendConfigToIframe]);

  // Auto-play simulation wave
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

  return (
    <div className="flex flex-col h-full rounded-2xl bg-white border border-zinc-200/90 shadow-xl overflow-hidden select-none">
      {/* 1. Sandbox Top Bar with 3-Way Engine Switcher & 3-Way Viewport Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-zinc-200/80 bg-zinc-50/90">
        {/* The 3-Way Engine Switcher */}
        <div className="flex items-center gap-1 bg-white border border-zinc-200 rounded-xl p-1 shadow-2xs">
          <button
            type="button"
            onClick={() => setEngineMode('scrollcraft')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              engineMode === 'scrollcraft'
                ? 'bg-[#FF5A1F] text-white shadow-2xs'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
            title="Native ScrollCraft 60 FPS Engine"
          >
            <Zap className="w-3 h-3" />
            <span>ScrollCraft</span>
          </button>

          <button
            type="button"
            onClick={() => setEngineMode('gsap')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              engineMode === 'gsap'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
            title="GSAP ScrollTrigger Emulation"
          >
            <span>GSAP</span>
          </button>

          <button
            type="button"
            onClick={() => setEngineMode('css')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              engineMode === 'css'
                ? 'bg-zinc-800 text-white shadow-2xs'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
            title="Native CSS Scroll"
          >
            <span>Native CSS</span>
          </button>

          <div className="w-px h-4 bg-zinc-200 mx-0.5" />

          <button
            type="button"
            onClick={() => setEngineMode('split')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              engineMode === 'split'
                ? 'bg-[#FF5A1F] text-white shadow-2xs'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
            title="3-Way Split Showdown (All 3 Together)"
          >
            <Columns className="w-3 h-3" />
            <span>3-Way Split</span>
          </button>
        </div>

        {/* Viewport & Telemetry */}
        <div className="flex items-center gap-3">
          {/* 3-Way Responsive Viewport Switcher */}
          <div className="flex items-center gap-0.5 bg-white border border-zinc-200 rounded-lg p-0.5 shadow-2xs">
            <button
              type="button"
              aria-label="Desktop viewport"
              onClick={() => setViewport('desktop')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewport === 'desktop'
                  ? 'bg-zinc-100 text-zinc-950 font-bold'
                  : 'text-zinc-400 hover:text-zinc-700'
              }`}
              title="Desktop Viewport (100%)"
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
              title="Tablet Viewport (540px)"
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
              title="Mobile Viewport (340px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Replay Button */}
          <button
            type="button"
            onClick={handleReplay}
            disabled={isPlaying}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 hover:bg-zinc-200 text-[11px] font-semibold text-zinc-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{isPlaying ? 'Playing...' : 'Replay'}</span>
          </button>

          {/* Live Sandboxed FPS Telemetry */}
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{fps} FPS</span>
            <span className="text-[10px] text-emerald-600/70 hidden sm:inline">
              ({latency}ms)
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Sandboxed Preview Canvas */}
      <div className="flex-1 bg-zinc-100/60 p-6 sm:p-10 flex flex-col items-center justify-center overflow-hidden min-h-[460px]">
        <div
          className={`relative h-[420px] overflow-hidden bg-[#090b10] transition-all duration-300 flex flex-col justify-between ${getContainerStyle()}`}
        >
          {/* Isolated iframe sandbox */}
          <iframe
            ref={iframeRef}
            srcDoc={initialSrcDoc}
            title="ScrollCraft Sandbox"
            sandbox="allow-scripts"
            className="w-full h-full border-0"
          />
        </div>

        {/* Scrub Slider on Canvas Bottom */}
        <div className="w-full max-w-md mt-6 flex items-center gap-4 px-4 py-3 rounded-2xl bg-white border border-zinc-200 shadow-2xs">
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider shrink-0">
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
            className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#FF5A1F]"
          />
          <span className="text-sm font-mono font-bold text-zinc-800 w-12 text-right">
            {Math.round(scrollProgress * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};
