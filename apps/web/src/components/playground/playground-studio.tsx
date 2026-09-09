'use client';

/**
 * PlaygroundStudio: Interactive live studio client island with dynamic imports
 * Strictly under 650 LOC.
 */

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { PlaygroundSidebar } from '@/components/playground/playground-sidebar';
import { PlaygroundHeader } from '@/components/playground/playground-header';
import { PlaygroundControls } from '@/components/playground/playground-controls';
import { PLAYGROUND_PRESETS, PlaygroundPreset } from '@/data/playground.data';

const PlaygroundEditor = dynamic(
  () => import('@/components/playground/playground-editor').then((m) => m.PlaygroundEditor),
  {
    ssr: false,
    loading: () => (
      <div className="h-[460px] rounded-2xl bg-zinc-900 border border-zinc-800 animate-pulse flex items-center justify-center text-zinc-600 text-xs font-mono">
        Loading Code Studio...
      </div>
    ),
  }
);

const PlaygroundPreview = dynamic(
  () => import('@/components/playground/playground-preview').then((m) => m.PlaygroundPreview),
  {
    ssr: false,
    loading: () => (
      <div className="h-[460px] rounded-2xl bg-zinc-50 border border-zinc-200 animate-pulse flex items-center justify-center text-zinc-400 text-xs font-mono">
        Rendering Engine Preview...
      </div>
    ),
  }
);

export function PlaygroundStudio() {
  const searchParams = useSearchParams();
  const presetQuery = searchParams.get('preset');

  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    presetQuery || 'hero-reveal'
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Find active preset
  const activePreset =
    PLAYGROUND_PRESETS.find((p) => p.id === selectedPresetId) ||
    PLAYGROUND_PRESETS[0];

  // Editable Code state
  const [htmlCode, setHtmlCode] = useState(activePreset.html);
  const [cssCode, setCssCode] = useState(activePreset.css);
  const [jsCode, setJsCode] = useState(activePreset.js);

  // Active Controls state
  const [controls, setControls] = useState<PlaygroundPreset['controls']>(
    activePreset.controls
  );

  // Sync when preset changes
  useEffect(() => {
    if (presetQuery) {
      const found = PLAYGROUND_PRESETS.find((p) => p.id === presetQuery);
      if (found) {
        setSelectedPresetId(found.id);
        setHtmlCode(found.html);
        setCssCode(found.css);
        setJsCode(found.js);
        setControls(found.controls);
      }
    }
  }, [presetQuery]);

  const handleSelectPreset = useCallback((id: string) => {
    const found = PLAYGROUND_PRESETS.find((p) => p.id === id);
    if (found) {
      setSelectedPresetId(found.id);
      setHtmlCode(found.html);
      setCssCode(found.css);
      setJsCode(found.js);
      setControls(found.controls);
    }
  }, []);

  const handleCodeChange = useCallback((tab: 'html' | 'css' | 'js', value: string) => {
    if (tab === 'html') setHtmlCode(value);
    else if (tab === 'css') setCssCode(value);
    else setJsCode(value);
  }, []);

  const handleReset = useCallback(() => {
    setHtmlCode(activePreset.html);
    setCssCode(activePreset.css);
    setJsCode(activePreset.js);
    setControls(activePreset.controls);
  }, [activePreset]);

  const handleControlChange = useCallback(
    <K extends keyof PlaygroundPreset['controls']>(
      key: K,
      value: PlaygroundPreset['controls'][K]
    ) => {
      setControls((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  return (
    <div className="w-full min-h-screen bg-white text-zinc-950 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 flex flex-col lg:flex-row gap-10">
        {/* Left Sidebar */}
        <div className="lg:w-56 shrink-0">
          <PlaygroundSidebar
            selectedPresetId={selectedPresetId}
            onSelectPreset={handleSelectPreset}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* Main Workspace */}
        <div className="flex-1 min-w-0 flex flex-col gap-8">
          {/* Header */}
          <PlaygroundHeader />

          {/* Middle 2-Column Area: Editor & Live Preview */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 min-h-[460px]">
            {/* Left: Multi-Tab Code Editor */}
            <PlaygroundEditor
              html={htmlCode}
              css={cssCode}
              js={jsCode}
              onCodeChange={handleCodeChange}
              onReset={handleReset}
            />

            {/* Right: Interactive Live Preview */}
            <PlaygroundPreview preset={activePreset} controls={controls} />
          </div>

          {/* Bottom 3-Card Interactive Control Panels */}
          <PlaygroundControls
            controls={controls}
            onChange={handleControlChange}
          />
        </div>
      </div>
    </div>
  );
}
