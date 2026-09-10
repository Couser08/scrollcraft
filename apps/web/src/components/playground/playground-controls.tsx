'use client';

import React, { useState, useCallback, useRef } from 'react';
import {
  Sliders,
  Sparkles,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  RotateCcw,
  Zap,
  Gauge,
  SlidersHorizontal,
} from 'lucide-react';
import {
  PlaygroundConfig,
  PlaygroundVibe,
  VIBE_PRESETS,
} from './playground-types';

interface PlaygroundControlsProps {
  config: PlaygroundConfig;
  onChange: (updated: Partial<PlaygroundConfig>) => void;
  onReset: () => void;
  onSelectVibe: (vibe: PlaygroundVibe) => void;
}

export const PlaygroundControls: React.FC<PlaygroundControlsProps> = ({
  config,
  onChange,
  onReset,
  onSelectVibe,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // 16ms RAF Throttler for slider inputs to ensure zero jank during continuous drag
  const rafThrottleRef = useRef<number | null>(null);
  const handleThrottledChange = useCallback(
    (key: keyof PlaygroundConfig, value: unknown) => {
      if (rafThrottleRef.current !== null) {
        cancelAnimationFrame(rafThrottleRef.current);
      }
      rafThrottleRef.current = requestAnimationFrame(() => {
        onChange({ [key]: value });
        rafThrottleRef.current = null;
      });
    },
    [onChange]
  );

  const toggleTooltip = (key: string) => {
    setActiveTooltip(activeTooltip === key ? null : key);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* 1. Quick-Select Preset Vibes Strip */}
      <div className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF5A1F]" />
            <h3 className="text-sm font-bold text-zinc-900">
              Preset Vibes
            </h3>
            <span className="text-[11px] text-zinc-400 font-medium hidden sm:inline">
              Instant physics calibration
            </span>
          </div>

          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-xs font-semibold text-zinc-700 transition-colors cursor-pointer"
            title="Reset parameters to defaults"
          >
            <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
            <span>Reset to Default</span>
          </button>
        </div>

        {/* 4 Preset Vibe Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {VIBE_PRESETS.map((vibe) => {
            const isSelected = config.vibe === vibe.id;
            return (
              <button
                key={vibe.id}
                onClick={() => onSelectVibe(vibe.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#FF5A1F] bg-[#FFF7ED] ring-2 ring-[#FF5A1F]/20'
                    : 'border-zinc-200 bg-zinc-50/50 hover:bg-white hover:border-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <span
                    className={`text-xs font-bold ${
                      isSelected ? 'text-[#FF5A1F]' : 'text-zinc-900'
                    }`}
                  >
                    {vibe.label}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#FF5A1F]" />
                  )}
                </div>
                <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed mb-2">
                  {vibe.description}
                </p>
                <span className="text-[10px] font-mono font-semibold text-zinc-400 uppercase tracking-wider">
                  {vibe.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Core Motion Controls (Progressive Disclosure - Primary 4 Controls) */}
      <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs flex flex-col gap-6">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-zinc-800" />
            <h3 className="text-sm font-bold text-zinc-900">
              Core Animation Parameters
            </h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            {config.showcaseId}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Param 1: Speed / Distance */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-zinc-700 flex items-center gap-1.5">
                <span>Speed Factor</span>
                <button
                  type="button"
                  onClick={() => toggleTooltip('speed')}
                  className="text-zinc-400 hover:text-zinc-700"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </label>
              <span className="font-mono text-xs font-bold text-[#FF5A1F]">
                {config.speed.toFixed(2)}x
              </span>
            </div>
            {activeTooltip === 'speed' && (
              <p className="text-[11px] text-zinc-500 bg-zinc-50 p-2 rounded-md border border-zinc-200">
                Determines the displacement multiplier relative to scroll distance.
              </p>
            )}
            <input
              type="range"
              min={0.05}
              max={1.0}
              step={0.01}
              value={config.speed}
              onChange={(e) =>
                handleThrottledChange('speed', parseFloat(e.target.value))
              }
              aria-label="Speed Factor"
              className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#FF5A1F]"
            />
          </div>

          {/* Param 2: Duration */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-zinc-700 flex items-center gap-1.5">
                <span>Duration</span>
                <button
                  type="button"
                  onClick={() => toggleTooltip('duration')}
                  className="text-zinc-400 hover:text-zinc-700"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </label>
              <span className="font-mono text-xs font-bold text-[#FF5A1F]">
                {config.duration.toFixed(2)}s
              </span>
            </div>
            {activeTooltip === 'duration' && (
              <p className="text-[11px] text-zinc-500 bg-zinc-50 p-2 rounded-md border border-zinc-200">
                Timeline transition length in seconds.
              </p>
            )}
            <input
              type="range"
              min={0.2}
              max={2.0}
              step={0.05}
              value={config.duration}
              onChange={(e) =>
                handleThrottledChange('duration', parseFloat(e.target.value))
              }
              aria-label="Duration in seconds"
              className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#FF5A1F]"
            />
          </div>

          {/* Param 3: Direction */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
              <span>Direction Axis</span>
            </label>
            <select
              value={config.direction}
              onChange={(e) =>
                onChange({
                  direction: e.target.value as PlaygroundConfig['direction'],
                })
              }
              className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs font-medium text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-[#FF5A1F]/30"
            >
              <option value="vertical">Vertical (Y-Axis)</option>
              <option value="horizontal">Horizontal (X-Axis)</option>
              <option value="up">Up (Reveal)</option>
              <option value="down">Down (Reveal)</option>
              <option value="left">Left (Marquee)</option>
              <option value="right">Right (Marquee)</option>
            </select>
          </div>

          {/* Param 4: Easing Curve */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
              <span>Easing Curve</span>
            </label>
            <select
              value={config.easing}
              onChange={(e) =>
                onChange({
                  easing: e.target.value as PlaygroundConfig['easing'],
                })
              }
              className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs font-medium text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-[#FF5A1F]/30"
            >
              <option value="easeOut">easeOut (Natural stop)</option>
              <option value="easeInOut">easeInOut (Smooth ramp)</option>
              <option value="spring">spring (Physics driven)</option>
              <option value="linear">linear (Continuous)</option>
            </select>
          </div>
        </div>

        {/* 3. Collapsible Advanced Physics & Compositor Section */}
        <div className="pt-2 border-t border-zinc-100">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-between w-full py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF5A1F]" />
              <span>Advanced Spring Physics & Compositor Optimizations</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
                {showAdvanced ? 'Expanded' : 'Hidden'}
              </span>
            </div>
            {showAdvanced ? (
              <ChevronUp className="w-4 h-4 text-zinc-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-zinc-400" />
            )}
          </button>

          {showAdvanced && (
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
              {/* Stiffness Slider */}
              <div className="flex flex-col gap-2 bg-zinc-50 p-4 rounded-xl border border-zinc-200/80">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-zinc-700 flex items-center gap-1.5">
                    <span>Spring Stiffness</span>
                    <button
                      type="button"
                      onClick={() => toggleTooltip('stiffness')}
                      className="text-zinc-400 hover:text-zinc-700"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </label>
                  <span className="font-mono text-xs font-bold text-zinc-900">
                    {config.stiffness}
                  </span>
                </div>
                {activeTooltip === 'stiffness' && (
                  <p className="text-[11px] text-zinc-500 bg-white p-2 rounded-md border border-zinc-200">
                    Spring resistance tension. Higher numbers snap to rest quicker.
                  </p>
                )}
                <input
                  type="range"
                  min={50}
                  max={400}
                  step={10}
                  value={config.stiffness}
                  onChange={(e) =>
                    handleThrottledChange('stiffness', parseInt(e.target.value))
                  }
                  aria-label="Spring Stiffness"
                  className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#FF5A1F]"
                />
              </div>

              {/* Damping Slider */}
              <div className="flex flex-col gap-2 bg-zinc-50 p-4 rounded-xl border border-zinc-200/80">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-zinc-700 flex items-center gap-1.5">
                    <span>Damping Friction</span>
                    <button
                      type="button"
                      onClick={() => toggleTooltip('damping')}
                      className="text-zinc-400 hover:text-zinc-700"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </label>
                  <span className="font-mono text-xs font-bold text-zinc-900">
                    {config.damping}
                  </span>
                </div>
                {activeTooltip === 'damping' && (
                  <p className="text-[11px] text-zinc-500 bg-white p-2 rounded-md border border-zinc-200">
                    Frictional resistance that prevents overshoot. Low values cause playful bounce.
                  </p>
                )}
                <input
                  type="range"
                  min={8}
                  max={40}
                  step={1}
                  value={config.damping}
                  onChange={(e) =>
                    handleThrottledChange('damping', parseInt(e.target.value))
                  }
                  aria-label="Damping Friction"
                  className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#FF5A1F]"
                />
              </div>

              {/* Mass Slider */}
              <div className="flex flex-col gap-2 bg-zinc-50 p-4 rounded-xl border border-zinc-200/80">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-zinc-700 flex items-center gap-1.5">
                    <span>Inertia Mass</span>
                    <button
                      type="button"
                      onClick={() => toggleTooltip('mass')}
                      className="text-zinc-400 hover:text-zinc-700"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </label>
                  <span className="font-mono text-xs font-bold text-zinc-900">
                    {config.mass.toFixed(1)}
                  </span>
                </div>
                {activeTooltip === 'mass' && (
                  <p className="text-[11px] text-zinc-500 bg-white p-2 rounded-md border border-zinc-200">
                    Heavier mass creates more simulated momentum delay when starting or stopping.
                  </p>
                )}
                <input
                  type="range"
                  min={0.5}
                  max={2.5}
                  step={0.1}
                  value={config.mass}
                  onChange={(e) =>
                    handleThrottledChange('mass', parseFloat(e.target.value))
                  }
                  aria-label="Inertia Mass"
                  className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#FF5A1F]"
                />
              </div>

              {/* Toggle 1: 1:1 Scrub Mode */}
              <label className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-zinc-900 block">
                    1:1 Scroll Scrub
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    Tie motion directly to scroll delta
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={config.scrub}
                  onChange={(e) => onChange({ scrub: e.target.checked })}
                  className="w-4 h-4 rounded text-[#FF5A1F] focus:ring-[#FF5A1F] cursor-pointer"
                />
              </label>

              {/* Toggle 2: will-change: transform */}
              <label className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-zinc-900 block">
                    GPU Compositor Layer
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    Promote element to GPU layer (willChange)
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={config.willChange}
                  onChange={(e) => onChange({ willChange: e.target.checked })}
                  className="w-4 h-4 rounded text-[#FF5A1F] focus:ring-[#FF5A1F] cursor-pointer"
                />
              </label>

              {/* Toggle 3: Reduced Motion */}
              <label className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-zinc-900 block">
                    Respect Reduced Motion
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    Honors prefers-reduced-motion OS flag
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={config.respectReducedMotion}
                  onChange={(e) =>
                    onChange({ respectReducedMotion: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-[#FF5A1F] focus:ring-[#FF5A1F] cursor-pointer"
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
