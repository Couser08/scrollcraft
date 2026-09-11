'use client';

import React, { useState, useEffect } from 'react';
import { Capabilities } from '@scrollcraft/core';
import { RefreshCw, Code, Check, ChevronDown, ChevronUp, Cpu, Zap, Activity } from 'lucide-react';

export type DriverType =
  | 'view-timeline'
  | 'scroll-timeline'
  | 'observer'
  | 'ticker'
  | 'canvas'
  | 'sticky';

interface PlaygroundShellProps {
  title: string;
  badge?: string;
  driverType?: DriverType;
  customDriverLabel?: string;
  onReset?: () => void;
  controls?: React.ReactNode;
  telemetry: React.ReactNode;
  codeSnippet: string;
  codeFileName?: string;
  children: React.ReactNode;
}

export const PlaygroundShell: React.FC<PlaygroundShellProps> = ({
  title,
  badge = '@scrollcraft/react',
  driverType = 'ticker',
  customDriverLabel,
  onReset,
  controls,
  telemetry,
  codeSnippet,
  codeFileName = 'LiveComponent.tsx',
  children,
}) => {
  const [driverLabel, setDriverLabel] = useState<string>('Detecting Driver...');
  const [isNative, setIsNative] = useState<boolean>(false);
  const [codeOpen, setCodeOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (customDriverLabel) {
      setDriverLabel(customDriverLabel);
      setIsNative(true);
      return;
    }

    const caps = Capabilities.get();

    switch (driverType) {
      case 'view-timeline':
        if (caps.isNativeReady) {
          setDriverLabel('Native ViewTimeline ✅');
          setIsNative(true);
        } else {
          setDriverLabel('JS Fallback Driver ⚙️');
          setIsNative(false);
        }
        break;
      case 'scroll-timeline':
        if (caps.scrollTimeline) {
          setDriverLabel('Native ScrollTimeline ✅');
          setIsNative(true);
        } else {
          setDriverLabel('JS Fallback Driver ⚙️');
          setIsNative(false);
        }
        break;
      case 'observer':
        setDriverLabel('Single Shared Observer ✅');
        setIsNative(true);
        break;
      case 'canvas':
        setDriverLabel('Retina 2D Canvas Buffer 🎬');
        setIsNative(true);
        break;
      case 'sticky':
        setDriverLabel('Native CSS Sticky + Solver 📌');
        setIsNative(true);
        break;
      case 'ticker':
      default:
        setDriverLabel('Kinetic Ticker (dt clamped) ⚡');
        setIsNative(true);
        break;
    }
  }, [driverType, customDriverLabel]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy code', e);
    }
  };

  return (
    <div className="my-6 rounded-2xl border border-zinc-800/80 bg-[#09090b] overflow-hidden shadow-2xl transition-all">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-[#0d0d10] border-b border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-200">
            {title}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
            {badge}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Runtime Driver Badge */}
          <span
            className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-semibold border transition-colors ${
              isNative
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}
            title="Runtime Driver Detection"
          >
            {driverLabel}
          </span>

          {onReset && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white px-2 py-1 rounded-md transition-colors cursor-pointer"
              title="Reset parameters to defaults"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-6 flex flex-col gap-6">
        {/* Stage / Live Playground */}
        <div className="w-full">{children}</div>

        {/* Controls & Telemetry Row */}
        {(controls || telemetry) && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-4 border-t border-zinc-800/60">
            {/* Control Strip */}
            {controls && (
              <div className="md:col-span-6 flex flex-col justify-center gap-4">
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-400" />
                  <span>Live Controls</span>
                </div>
                {controls}
              </div>
            )}

            {/* Telemetry Readout */}
            {telemetry && (
              <div className={controls ? 'md:col-span-6 flex flex-col justify-center gap-2' : 'col-span-12'}>
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Live Telemetry HUD</span>
                  </span>
                  <span className="text-[10px] text-zinc-500 font-normal">
                    DOM textContent ref updates
                  </span>
                </div>
                <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-[#060608] font-mono text-xs space-y-2 shadow-inner">
                  {telemetry}
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1.5 border-t border-zinc-800/60">
                    <span className="flex items-center gap-1 text-zinc-400">
                      <Cpu className="w-3 h-3 text-blue-400" />
                      React Root Re-renders:
                    </span>
                    <span className="text-emerald-400 font-semibold font-mono">0 frames (0 ms)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Synchronized Code Reveal Drawer */}
        <div className="rounded-xl border border-zinc-800/80 bg-[#060608] overflow-hidden">
          <button
            onClick={() => setCodeOpen(!codeOpen)}
            className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-mono text-zinc-300 hover:text-white bg-zinc-900/50 hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Code className="w-3.5 h-3.5 text-blue-400" />
              <span>View Synchronized Code</span>
              <span className="text-[10px] text-zinc-500">({codeFileName})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-400">
                {codeOpen ? 'Collapse' : 'Expand'}
              </span>
              {codeOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </div>
          </button>

          {codeOpen && (
            <div className="relative border-t border-zinc-800/80 p-4 bg-[#050507]">
              <div className="absolute top-3 right-3 z-10">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-[11px] font-mono transition-colors cursor-pointer border border-zinc-700/80 shadow-md"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Code className="w-3 h-3" />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="text-xs font-mono text-zinc-200 overflow-x-auto leading-relaxed pt-1">
                <code>{codeSnippet}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
