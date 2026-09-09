'use client';

/**
 * 3-Card Interactive Control Panels for Playground
 * Strictly under 650 LOC.
 */

import React from 'react';
import { Sliders, Target, Settings2 } from 'lucide-react';
import { PlaygroundPreset } from '@/data/playground.data';

interface PlaygroundControlsProps {
  controls: PlaygroundPreset['controls'];
  onChange: <K extends keyof PlaygroundPreset['controls']>(
    key: K,
    value: PlaygroundPreset['controls'][K]
  ) => void;
}

export const PlaygroundControls: React.FC<PlaygroundControlsProps> = ({
  controls,
  onChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 select-none">
      {/* 1. Animation Settings Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center gap-2 mb-5">
            <Sliders className="w-4 h-4 text-zinc-700" />
            <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
              Animation Settings
            </h3>
          </div>

          <div className="flex flex-col gap-4">
            {/* Preset Dropdown */}
            <div className="flex items-center justify-between gap-4">
              <label htmlFor="preset-select" className="text-xs text-zinc-500 font-medium">Preset</label>
              <select
                id="preset-select"
                value={controls.preset}
                onChange={(e) => onChange('preset', e.target.value)}
                className="bg-zinc-50 border border-zinc-200 hover:border-zinc-300 text-xs font-semibold text-zinc-800 rounded-lg px-3 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-blue-600 cursor-pointer"
              >
                <option value="Fade Up">Fade Up</option>
                <option value="Scale In">Scale In</option>
                <option value="Parallax">Parallax</option>
                <option value="Stagger">Stagger</option>
              </select>
            </div>

            {/* Start / End / Easing Row */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label htmlFor="start-input" className="text-[10px] text-zinc-400 font-medium mb-1 block">Start</label>
                <input
                  id="start-input"
                  type="text"
                  value={controls.start}
                  onChange={(e) => onChange('start', e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-800 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label htmlFor="end-input" className="text-[10px] text-zinc-400 font-medium mb-1 block">End</label>
                <input
                  id="end-input"
                  type="text"
                  value={controls.end}
                  onChange={(e) => onChange('end', e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-800 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label htmlFor="easing-select" className="text-[10px] text-zinc-400 font-medium mb-1 block">Easing</label>
                <select
                  id="easing-select"
                  value={controls.easing}
                  onChange={(e) => onChange('easing', e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1.5 text-xs font-medium text-zinc-800 focus:outline-hidden focus:ring-1 focus:ring-blue-600 cursor-pointer"
                >
                  <option value="easeOut">easeOut</option>
                  <option value="easeInOut">easeInOut</option>
                  <option value="linear">linear</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Duration Slider */}
        <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-between gap-3">
          <label htmlFor="duration-slider" className="text-xs text-zinc-500 font-medium shrink-0">Duration (s)</label>
          <div className="flex-1 flex items-center gap-2">
            <input
              id="duration-slider"
              type="range"
              min={0.2}
              max={3.0}
              step={0.1}
              value={controls.duration}
              onChange={(e) => onChange('duration', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span className="text-xs font-mono font-bold text-zinc-800 w-7 text-right">
              {controls.duration.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Scroll Triggers Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center gap-2 mb-5">
            <Target className="w-4 h-4 text-zinc-700" />
            <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
              Scroll Triggers
            </h3>
          </div>

          <div className="flex flex-col gap-4">
            {/* Trigger Element */}
            <div className="flex items-center justify-between gap-4">
              <label htmlFor="trigger-element-select" className="text-xs text-zinc-500 font-medium">Trigger Element</label>
              <select
                id="trigger-element-select"
                value={controls.triggerElement}
                onChange={(e) => onChange('triggerElement', e.target.value)}
                className="bg-zinc-50 border border-zinc-200 hover:border-zinc-300 text-xs font-semibold text-zinc-800 rounded-lg px-3 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-blue-600 cursor-pointer"
              >
                <option value=".hero">.hero</option>
                <option value=".content">.content</option>
                <option value=".card">.card</option>
              </select>
            </div>

            {/* Trigger Once Toggle */}
            <div className="flex items-center justify-between py-1">
              <span className="text-xs text-zinc-600 font-medium">Trigger Once</span>
              <button
                type="button"
                onClick={() => onChange('triggerOnce', !controls.triggerOnce)}
                className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                  controls.triggerOnce ? 'bg-blue-600' : 'bg-zinc-200'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    controls.triggerOnce ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Scrub Toggle */}
            <div className="flex items-center justify-between py-1">
              <span className="text-xs text-zinc-600 font-medium">Scrub</span>
              <button
                type="button"
                onClick={() => onChange('scrub', !controls.scrub)}
                className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                  controls.scrub ? 'bg-blue-600' : 'bg-zinc-200'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    controls.scrub ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Markers Toggle */}
            <div className="flex items-center justify-between py-1">
              <span className="text-xs text-zinc-600 font-medium">Markers</span>
              <button
                type="button"
                onClick={() => onChange('markers', !controls.markers)}
                className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                  controls.markers ? 'bg-blue-600' : 'bg-zinc-200'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    controls.markers ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Additional Options Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center gap-2 mb-5">
            <Settings2 className="w-4 h-4 text-zinc-700" />
            <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
              Additional Options
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Left: Transform Checkboxes */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-1">
                Transform
              </span>
              <label className="flex items-center gap-2 text-xs text-zinc-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={controls.translateY}
                  onChange={(e) => onChange('translateY', e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 accent-blue-600"
                />
                <span>Translate Y</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-zinc-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={controls.scale}
                  onChange={(e) => onChange('scale', e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 accent-blue-600"
                />
                <span>Scale</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-zinc-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={controls.rotate}
                  onChange={(e) => onChange('rotate', e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 accent-blue-600"
                />
                <span>Rotate</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-zinc-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={controls.opacity}
                  onChange={(e) => onChange('opacity', e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 accent-blue-600"
                />
                <span>Opacity</span>
              </label>
            </div>

            {/* Right: Stagger & Delay Inputs */}
            <div className="flex flex-col gap-3">
              <div>
                <label htmlFor="stagger-input" className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-1 block">
                  Stagger
                </label>
                <input
                  id="stagger-input"
                  type="number"
                  step={0.05}
                  value={controls.stagger}
                  onChange={(e) => onChange('stagger', parseFloat(e.target.value) || 0)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-zinc-800 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label htmlFor="delay-input" className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-1 block">
                  Delay (s)
                </label>
                <input
                  id="delay-input"
                  type="number"
                  step={0.1}
                  value={controls.delay}
                  onChange={(e) => onChange('delay', parseFloat(e.target.value) || 0)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-zinc-800 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
