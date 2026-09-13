'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  ArrowLeft,
  ArrowRight,
  Code,
  HelpCircle,
  Camera,
  Layers,
  Sparkles,
  Box,
  CheckCircle2,
  Copy,
  Check,
  MoveHorizontal,
} from 'lucide-react';
import { Cinematic3DScene } from './cinematic-3d-scene';
import { ExampleSourceViewer } from '../examples/example-source-viewer';

const THREE_SNIPPETS = {
  react: `import { useScroll3D } from '@scrollcraft/r3f';

function Scene() {
  const scroll = useScroll3D({
    el: '.scene',
    damping: 0.1,
    driver: 'auto',
  });

  useFrame((state) => {
    const p = scroll.progress; // 0 - 1
    groupRef.current.rotation.y = p * Math.PI * 2;
    camera.position.lerp(cameraTargets[p], 0.1);
  });

  return <group ref={groupRef}>...</group>;
}`,
  hook: `// Pull-based synchronous reader (Zero React Re-render)
const { tick } = useScroll3D(canvasRef.current);

useFrame(() => {
  const { progress, velocity, direction } = tick();
  meshRef.current.rotation.y = progress * Math.PI * 2;
});`,
  scene: `<Canvas>
  <ambientLight intensity={0.8} />
  <directionalLight position={[10, 15, 10]} intensity={2} />
  <FloatingIsland />
  <OrbitingSporeParticles count={180} />
</Canvas>`,
  camera: `// Dynamic scroll-driven camera track
camera.position.x = Math.sin(progress * Math.PI) * 4;
camera.position.y = 4 + (progress - 0.5) * 2;
camera.lookAt(0, 0.5, 0);`,
};

interface Example3DPageProps {
  onBack?: () => void;
}

export const Example3DPage: React.FC<Example3DPageProps> = ({ onBack }) => {
  const [scrollProgress, setScrollProgress] = useState(42);
  const [activeTab, setActiveTab] = useState<'react' | 'hook' | 'scene' | 'camera'>('react');
  const [copied, setCopied] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);
  const [showCode, setShowCode] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [showBorders, setShowBorders] = useState(false);
  const [showMs, setShowMs] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalH = document.documentElement.scrollHeight - window.innerHeight;
      if (totalH > 0) {
        const p = Math.round((window.scrollY / totalH) * 100);
        setScrollProgress(Math.min(100, Math.max(0, p)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(THREE_SNIPPETS[activeTab]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const milestones = [
    { num: '01', label: 'The Island' },
    { num: '02', label: 'The Forest' },
    { num: '03', label: 'The Water' },
    { num: '04', label: 'The Peaks' },
    { num: '05', label: 'The Sky' },
    { num: '06', label: 'A Better Tomorrow' },
  ];

  return (
    <div className={`w-full min-h-screen bg-[#fafafa] text-zinc-900 selection:bg-blue-600/20 font-sans antialiased ${showBorders ? '[&_*]:outline [&_*]:outline-1 [&_*]:outline-blue-400/30' : ''}`}>
      
      {/* Top Back Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Examples</span>
        </button>
      </div>

      {/* Main Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Title Area */}
          <div className="lg:col-span-8 flex flex-col items-start text-left relative">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-700 text-xs font-mono font-semibold mb-3">
              <span className="text-zinc-400">EXAMPLE 03</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-zinc-950 leading-tight mb-4">
              Scroll-Linked <br />3D Experience
            </h1>

            <p className="text-sm sm:text-base text-zinc-600 max-w-2xl leading-relaxed mb-6 font-light">
              An immersive, scroll-driven 3D experience built with React Three Fiber. Powered by a pull-based scroll hook, zero React re-renders, and adaptive performance for every device.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
                className="px-5 py-2.5 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span>Play Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setShowCode(!showCode)}
                className="px-4 py-2.5 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              >
                <Code className="w-3.5 h-3.5 text-zinc-500" />
                <span>View Code</span>
              </button>

              <a
                href="/docs"
                className="px-4 py-2.5 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all"
              >
                <HelpCircle className="w-3.5 h-3.5 text-zinc-500" />
                <span>How It Works</span>
              </a>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2">
              {['useScroll3D', 'Zero Re-renders', 'R3F Safe', 'Multi-Driver', 'Adaptive Quality'].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-white border border-zinc-200 text-zinc-600 text-xs font-medium shadow-2xs"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Handwritten Doodle */}
            <div className="hidden sm:block absolute top-0 right-10 text-right pointer-events-none">
              <span className="font-[family-name:var(--font-caveat)] text-zinc-500 text-2xl block -rotate-3 leading-tight">
                Scroll to explore <br />a new dimension.
              </span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60 absolute -bottom-6 right-0"><path d="M18 8L22 12L18 16"/><path d="M2 12H22"/></svg>
            </div>
          </div>

          {/* Right Floating Telemetry HUD */}
          <div className="lg:col-span-4 w-full">
            <div className="p-5 rounded-2xl border border-zinc-200 bg-white shadow-lg space-y-3 font-sans">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <span className="text-xs font-bold text-zinc-900 tracking-tight">Live Telemetry</span>
                <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  60 FPS
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center text-zinc-500 font-sans">
                  <span>Driver</span>
                  <span className="font-semibold text-emerald-700 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Native <span className="text-zinc-400">(ViewTimeline)</span>
                  </span>
                </div>
                <div className="flex justify-between items-center text-zinc-500 font-sans">
                  <span>Renders</span>
                  <span className="font-semibold text-zinc-900">
                    <strong className="text-emerald-600">0</strong> / 1
                  </span>
                </div>
                <div className="flex justify-between items-center text-zinc-500 font-sans">
                  <span>Frame Time</span>
                  <span className="font-semibold text-zinc-900">{showMs ? '16.62 ms' : '16.6 ms'}</span>
                </div>
                <div className="flex justify-between items-center text-zinc-500 font-sans">
                  <span>GPU Memory</span>
                  <span className="font-semibold text-zinc-900">128 MB</span>
                </div>
                <div className="flex justify-between items-center text-zinc-500 font-sans">
                  <span>Three.js</span>
                  <span className="font-semibold text-zinc-900">r160 (external)</span>
                </div>
                <div className="flex justify-between items-center text-zinc-500 font-sans">
                  <span>Canvas</span>
                  <span className="font-semibold text-emerald-600">Single Context &check;</span>
                </div>
                <div className="flex justify-between items-center text-zinc-500 font-sans">
                  <span>Device Tier</span>
                  <span className="font-bold text-blue-600">High</span>
                </div>
                <div className="flex justify-between items-center text-zinc-500 font-sans">
                  <span>Scroll Progress</span>
                  <span className="font-bold text-zinc-900">{scrollProgress} %</span>
                </div>
              </div>

              {/* Progress mini bar */}
              <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${scrollProgress}%` }} />
              </div>

              <div className="pt-3 border-t border-zinc-100 space-y-2 text-xs">
                <div className="flex items-center justify-between text-zinc-600">
                  <span className="text-[11px]">Show Milliseconds</span>
                  <input
                    type="checkbox"
                    checked={showMs}
                    onChange={(e) => setShowMs(e.target.checked)}
                    className="accent-blue-600 cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between text-zinc-600">
                  <span className="text-[11px]">Show Layer Borders</span>
                  <input
                    type="checkbox"
                    checked={showBorders}
                    onChange={(e) => setShowBorders(e.target.checked)}
                    className="accent-blue-600 cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between text-zinc-600">
                  <span className="text-[11px]">Show 3D Debug (Wireframe)</span>
                  <input
                    type="checkbox"
                    checked={showDebug}
                    onChange={(e) => setShowDebug(e.target.checked)}
                    className="accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Code Drawer */}
        {showCode && (
          <div className="mt-6">
            <ExampleSourceViewer fileName="ThreeIslandScene.tsx" code={THREE_SNIPPETS.react} defaultOpen />
          </div>
        )}
      </div>

      {/* GENUINE THREE.JS 3D FLOATING ISLAND CANVAS STAGE */}
      <div className="relative w-full h-[75vh] min-h-[540px] bg-gradient-to-b from-[#090b12] via-[#05070c] to-[#090b12] overflow-hidden select-none border-y border-zinc-800 flex items-center justify-center">
        
        {/* Real Three.js Canvas Component */}
        <div className="absolute inset-0 z-0">
          <Cinematic3DScene
            scrollProgress={scrollProgress / 100}
            showWireframe={showDebug}
          />
        </div>

        {/* Floating UI Overlays inside 3D Canvas */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full h-full flex flex-col justify-between py-10 pointer-events-none text-white">
          {/* Top Info */}
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>01 / 06</span>
            <span className="tracking-widest uppercase text-zinc-300">
              BUILT FOR A BRIGHTER TOMORROW
            </span>
          </div>

          {/* Left Narrative Title */}
          <div className="max-w-md pointer-events-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold block mb-1">
              A HIGHER PERSPECTIVE
            </span>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.05] mb-3">
              Nature <br />Reimagined <br />In 3D
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed mb-6">
              Scroll through a cinematic 3D journey &mdash; from mountains to oceans, powered by real scroll, real performance, and real web technologies.
            </p>

            <button
              type="button"
              onClick={() => window.scrollTo({ top: 900, behavior: 'smooth' })}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-xs font-mono text-white flex items-center gap-2 transition-all cursor-pointer shadow-lg"
            >
              <span>&darr; Scroll to explore</span>
            </button>
          </div>

          {/* Right Rail Scene Milestones */}
          <div className="absolute top-1/2 right-6 -translate-y-1/2 hidden md:flex flex-col gap-3 font-mono text-xs pointer-events-auto">
            {milestones.map((m, idx) => (
              <div
                key={m.num}
                className={`flex items-center gap-3 px-3 py-1.5 rounded-lg transition-all ${
                  idx === 0 ? 'bg-white/15 border border-white/25 text-white font-bold backdrop-blur-md shadow-md' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span className="text-[11px] font-bold">{m.num}</span>
                <span className="text-xs font-sans font-medium">{m.label}</span>
              </div>
            ))}
          </div>

          {/* Bottom Telemetry Pill */}
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span>WebGL Three.js Core</span>
            <span className="text-cyan-400">Zero RAF Double-Pumping</span>
          </div>
        </div>
      </div>

      {/* Section: Scroll Transforms */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 font-bold">
                SCROLL TRANSFORMS
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight mt-1 mb-3">
                Every Scroll Tells a Deeper Story
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 font-light leading-relaxed">
                Watch how scroll position drives camera movement, object animations, and environment transitions &mdash; all without React re-renders.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-zinc-100 text-zinc-900 mt-1">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-950">Camera Motion</h4>
                  <p className="text-xs text-zinc-500 font-light">Smooth, scroll-linked camera paths</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-zinc-100 text-zinc-900 mt-1">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-950">Scene Transitions</h4>
                  <p className="text-xs text-zinc-500 font-light">Cinematic, frame-perfect sequences</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-zinc-100 text-zinc-900 mt-1">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-950">Interactive Elements</h4>
                  <p className="text-xs text-zinc-500 font-light">Parallax, rotations, and subtle physics</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Interactive Scene Compare Slider */}
          <div className="lg:col-span-7">
            <div className="relative w-full aspect-[16/10] rounded-3xl overflow-hidden shadow-xl border border-zinc-200 select-none bg-zinc-900">
              {/* After Scroll (Scene 02) */}
              <div className="absolute inset-0">
                <Image
                  src="/images/example-hero.jpg"
                  alt="After Scroll"
                  fill
                  sizes="(max-width: 1200px) 100vw, 700px"
                  className="object-cover"
                />
                <div className="absolute top-4 right-4 px-3 py-1 rounded-md bg-black/70 text-white text-xs font-mono font-bold">
                  Scene 02 / 06 &bull; After Scroll
                </div>
              </div>

              {/* Before Scroll Clipped */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
              >
                <Image
                  src="/images/examples-hero-mountain.jpg"
                  alt="Before Scroll"
                  fill
                  sizes="(max-width: 1200px) 100vw, 700px"
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-md bg-black/70 text-white text-xs font-mono font-bold">
                  Before Scroll
                </div>
              </div>

              {/* Divider Handle */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.6)] cursor-ew-resize flex items-center justify-center"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="w-8 h-8 rounded-full bg-white text-zinc-900 shadow-xl flex items-center justify-center border border-zinc-200">
                  <MoveHorizontal className="w-4 h-4" />
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-20"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Section: Performance That Scales */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 border-t border-zinc-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight mb-2">
                Performance That Scales
              </h2>
              <p className="text-sm text-zinc-600 font-light leading-relaxed">
                Automatically adapts to your device for the best possible experience. Same story, different detail level.
              </p>
            </div>

            {/* 3 Tier Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-2xs space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-950">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>High Tier</span>
                </div>
                <div className="text-[11px] text-zinc-500 leading-snug">
                  Full 3D effects, HDR lighting, Particles &amp; shadows
                </div>
                <span className="inline-block px-2 py-0.5 rounded bg-zinc-100 font-mono text-[10px] text-zinc-700 font-semibold">
                  8+ cores
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-2xs space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-950">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Mid Tier</span>
                </div>
                <div className="text-[11px] text-zinc-500 leading-snug">
                  Optimized scene, Reduced effects, Balanced quality
                </div>
                <span className="inline-block px-2 py-0.5 rounded bg-zinc-100 font-mono text-[10px] text-zinc-700 font-semibold">
                  4 - 8 cores
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-2xs space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-950">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span>Low Tier</span>
                </div>
                <div className="text-[11px] text-zinc-500 leading-snug">
                  Static / Simplified, Minimal effects, Smooth performance
                </div>
                <span className="inline-block px-2 py-0.5 rounded bg-zinc-100 font-mono text-[10px] text-zinc-700 font-semibold">
                  &le; 4 cores
                </span>
              </div>
            </div>
          </div>

          {/* Right Code Block */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-zinc-800 bg-[#0c0e14] text-zinc-200 overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#090b10] border-b border-zinc-800 text-xs">
                <div className="flex items-center gap-1">
                  {(['react', 'hook', 'scene', 'camera'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1 rounded-md transition-colors cursor-pointer capitalize font-mono text-[11px] ${
                        activeTab === tab
                          ? 'bg-zinc-800 text-white font-bold'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              <pre className="p-5 font-mono text-xs leading-relaxed overflow-x-auto text-zinc-300">
                <code>{THREE_SNIPPETS[activeTab]}</code>
              </pre>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Integration Box */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="p-8 rounded-3xl bg-white border border-zinc-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
              <Box className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-zinc-950">
                Works With Your Existing R3F Setup
              </h3>
              <p className="text-sm text-zinc-600 font-light max-w-xl mt-1">
                ScrollCraft uses your existing React Three Fiber canvas. No duplicate WebGL context, no conflicts &mdash; just plug in and create.
              </p>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-zinc-600 font-medium shrink-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Uses existing R3F canvas</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>No duplicate WebGL context</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>SSR-safe &amp; Next.js friendly</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Fully tree-shakeable</span>
            </div>
          </div>

          <a
            href="/docs"
            className="px-5 py-2.5 rounded-full border border-zinc-300 hover:bg-zinc-50 text-zinc-900 text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 self-start md:self-auto"
          >
            <span>View Integration Guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

    </div>
  );
};
