'use client';

/**
 * PlaygroundStudio: Master Interactive Motion Island
 * Truly sandboxed via iframe execution, syntax highlighted, with 3-way engine comparisons.
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { PlaygroundHeader } from './playground-header';
import { PlaygroundSidebar } from './playground-sidebar';
import { PlaygroundSandbox } from './playground-sandbox';
import { PlaygroundControls } from './playground-controls';
import { PlaygroundEditor } from './playground-editor';
import { PlaygroundShowdown } from './playground-showdown';
import { PlaygroundProCta } from './playground-pro-cta';
import {
  ShowcaseId,
  PlaygroundConfig,
  PlaygroundVibe,
  SHOWCASES,
  VIBE_PRESETS,
} from './playground-types';

export function PlaygroundStudio() {
  const searchParams = useSearchParams();

  // Read initial showcase from URL query if present
  const initialShowcaseId = useMemo<ShowcaseId>(() => {
    const p = searchParams.get('showcase') || searchParams.get('preset');
    if (p && SHOWCASES.some((s) => s.id === p)) {
      return p as ShowcaseId;
    }
    return 'hero-parallax';
  }, [searchParams]);

  const showcaseMeta = useMemo(
    () => SHOWCASES.find((s) => s.id === initialShowcaseId) || SHOWCASES[0],
    [initialShowcaseId]
  );

  const [selectedShowcaseId, setSelectedShowcaseId] = useState<ShowcaseId>(initialShowcaseId);
  const [shareCopied, setShareCopied] = useState(false);

  // Initialize config state
  const [config, setConfig] = useState<PlaygroundConfig>(() => {
    const base = showcaseMeta.defaultConfig;
    const urlVibe = searchParams.get('vibe') as PlaygroundVibe | null;
    const urlSpeed = searchParams.get('speed');
    const urlStiffness = searchParams.get('stiffness');
    const urlDamping = searchParams.get('damping');
    const urlDuration = searchParams.get('duration');

    return {
      ...base,
      vibe: urlVibe && VIBE_PRESETS.some((v) => v.id === urlVibe) ? urlVibe : base.vibe,
      speed: urlSpeed ? parseFloat(urlSpeed) : base.speed,
      stiffness: urlStiffness ? parseInt(urlStiffness) : base.stiffness,
      damping: urlDamping ? parseInt(urlDamping) : base.damping,
      duration: urlDuration ? parseFloat(urlDuration) : base.duration,
    };
  });

  // Handle showcase change from sidebar
  const handleSelectShowcase = useCallback((id: ShowcaseId) => {
    setSelectedShowcaseId(id);
    const target = SHOWCASES.find((s) => s.id === id);
    if (target) {
      setConfig(target.defaultConfig);
    }
  }, []);

  // Handle vibe preset click
  const handleSelectVibe = useCallback((vibeId: PlaygroundVibe) => {
    const foundVibe = VIBE_PRESETS.find((v) => v.id === vibeId);
    if (!foundVibe) return;

    setConfig((prev) => ({
      ...prev,
      vibe: vibeId,
      ...foundVibe.config,
    }));
  }, []);

  // Update specific parameters
  const handleConfigChange = useCallback((updated: Partial<PlaygroundConfig>) => {
    setConfig((prev) => ({ ...prev, ...updated }));
  }, []);

  // Reset to default settings
  const handleReset = useCallback(() => {
    const current = SHOWCASES.find((s) => s.id === selectedShowcaseId) || SHOWCASES[0];
    setConfig(current.defaultConfig);
  }, [selectedShowcaseId]);

  // Share URL: encodes all current params cleanly and copies
  const handleShare = useCallback(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams();
    params.set('showcase', config.showcaseId);
    params.set('vibe', config.vibe);
    params.set('speed', config.speed.toFixed(2));
    params.set('duration', config.duration.toFixed(2));
    params.set('stiffness', config.stiffness.toString());
    params.set('damping', config.damping.toString());

    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(shareUrl);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2500);

    // Update browser address bar without reload
    window.history.replaceState(null, '', shareUrl);
  }, [config]);

  return (
    <div className="w-full min-h-screen bg-[#FAFAF9] text-zinc-950 pb-32">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 pt-10 sm:pt-14 flex flex-col gap-12">
        {/* Header with Title & Share/Reset */}
        <PlaygroundHeader
          onShare={handleShare}
          onReset={handleReset}
          shareCopied={shareCopied}
        />

        {/* Studio Workspace */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Sidebar: Showcase Primitives */}
          <PlaygroundSidebar
            selectedShowcaseId={selectedShowcaseId}
            onSelectShowcase={handleSelectShowcase}
          />

          {/* Main Studio Canvas & Controls */}
          <div className="flex-1 min-w-0 flex flex-col gap-12">
            {/* Top 2-Column: Tokenized Code Editor & Isolated Sandboxed Canvas */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 min-h-[500px]">
              {/* Left: Real-time Syntax Highlighted Code Studio */}
              <div className="flex flex-col">
                <PlaygroundEditor config={config} />
              </div>

              {/* Right: Isolated Sandbox with 3-Way Engine Switcher & 3-Way Viewport */}
              <div className="flex flex-col">
                <PlaygroundSandbox config={config} onReset={handleReset} />
              </div>
            </div>

            {/* Bottom: Motion Controls (Vibes, Core params, Advanced physics) */}
            <PlaygroundControls
              config={config}
              onChange={handleConfigChange}
              onReset={handleReset}
              onSelectVibe={handleSelectVibe}
            />

            {/* 3-Way Architecture Showdown Benchmark */}
            <PlaygroundShowdown />

            {/* Pro Kit Conversion Banner */}
            <PlaygroundProCta />
          </div>
        </div>
      </div>
    </div>
  );
}
