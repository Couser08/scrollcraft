'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw, Film, Zap } from 'lucide-react';

export const ScrollSequencePlayground: React.FC = () => {
  const [frame, setFrame] = useState<number>(36);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const totalFrames = 120;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);

  // Render 3D geometric product frame onto HTML5 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const progress = frame / totalFrames;
    const angle = progress * Math.PI * 2;
    const explosion = Math.sin(progress * Math.PI) * 40;

    // Draw ambient background grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    const gridSize = 24;
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

    // Draw 3D Isometric Wireframe Object (Exploded view)
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1.8;

    const numRings = 7;
    for (let i = 0; i < numRings; i++) {
      const ringProgress = i / (numRings - 1);
      const ringOffset = (ringProgress - 0.5) * (70 + explosion);
      const ringRadius = Math.cos((ringProgress - 0.5) * Math.PI) * 55;

      ctx.beginPath();
      ctx.ellipse(
        centerX,
        centerY + ringOffset,
        ringRadius,
        ringRadius * 0.45,
        angle * 0.4,
        0,
        Math.PI * 2
      );
      ctx.strokeStyle = i === 3 ? '#60a5fa' : 'rgba(59, 130, 246, 0.5)';
      ctx.stroke();
    }

    // Connect vertical struts
    const struts = 8;
    for (let j = 0; j < struts; j++) {
      const theta = (j / struts) * Math.PI * 2 + angle;
      const topX = centerX + Math.cos(theta) * 35;
      const topY = centerY - (35 + explosion * 0.5);
      const botX = centerX + Math.cos(theta) * 35;
      const botY = centerY + (35 + explosion * 0.5);

      ctx.beginPath();
      ctx.moveTo(topX, topY);
      ctx.lineTo(botX, botY);
      ctx.strokeStyle = 'rgba(147, 197, 253, 0.35)';
      ctx.stroke();
    }

    // Core holographic center point
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#93c5fd';
    ctx.shadowColor = '#3b82f6';
    ctx.shadowBlur = 12;
    ctx.fill();

    ctx.restore();
  }, [frame]);

  // Auto scrub animation loop
  useEffect(() => {
    if (!isPlaying) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    const loop = () => {
      setFrame((prev) => (prev >= totalFrames ? 0 : prev + 1));
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying]);

  return (
    <div className="my-6 rounded-xl border border-zinc-800/80 bg-[#09090b] overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0d0d10] border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-200">
            Apple-Style &lt;ScrollSequence&gt; Canvas Stage
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
            Retina Canvas2D
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md border font-mono transition-all cursor-pointer ${
              isPlaying
                ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>Auto Orbit</span>
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              setFrame(0);
            }}
            className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white px-2 py-1 rounded-md transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Controls */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-zinc-200">Scrub Frame Timeline</span>
              <span className="font-mono text-blue-400 font-semibold">
                Frame {frame} / {totalFrames}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max={totalFrames}
              value={frame}
              onChange={(e) => {
                setIsPlaying(false);
                setFrame(Number(e.target.value));
              }}
              className="w-full accent-blue-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 mt-1 font-mono">
              <span>Frame 0 (Entry)</span>
              <span>Frame 60 (Exploded)</span>
              <span>Frame 120 (Assembled)</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-[#0c0c0e] font-mono text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2">
              <span className="text-zinc-400">Hardware Pipeline</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                <Zap className="w-3 h-3" /> 120 FPS Retina
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-400">Canvas Buffer</span>
              <span className="text-white font-mono">DPR Scaled (2x/3x)</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-400">Frame Paint Budget</span>
              <span className="text-blue-400 font-semibold font-mono">&lt; 0.6ms</span>
            </div>
          </div>
        </div>

        {/* Right Canvas Stage */}
        <div className="md:col-span-7 flex flex-col items-center">
          <div className="w-full text-left text-[11px] text-zinc-400 mb-2 font-mono flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-blue-400" />
              <span>Canvas 2D Frame Sequence Buffer</span>
            </span>
            <span className="text-zinc-500">Apple Product Page Architecture</span>
          </div>

          <div className="w-full h-[280px] rounded-2xl border border-zinc-800/80 bg-[#060608] overflow-hidden relative shadow-2xl flex items-center justify-center">
            <canvas ref={canvasRef} className="w-full h-full block" />
            <div className="absolute bottom-3 left-4 text-[10px] font-mono text-zinc-500 bg-zinc-950/80 px-2 py-1 rounded border border-zinc-800">
              FRAME_{String(frame).padStart(3, '0')}.WEBP
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
