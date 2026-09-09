'use client';

/**
 * Interactive Reveal Playground Component
 * Live interactive testing sandbox for viewport intersection animations.
 * Strictly under 650 LOC.
 */

import React, { useState } from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';

type RevealVariant = 'slide-up' | 'slide-down' | 'fade' | 'scale' | 'blur';

export const RevealPlayground: React.FC = () => {
  const [variant, setVariant] = useState<RevealVariant>('slide-up');
  const [duration, setDuration] = useState<number>(0.6);
  const [delay, setDelay] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const replay = () => {
    setIsVisible(false);
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, (duration + delay) * 1000);
    }, 150);
  };

  const getVariantStyles = (): React.CSSProperties => {
    const baseTransition = `all ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`;

    if (!isVisible) {
      switch (variant) {
        case 'slide-up':
          return {
            opacity: 0,
            transform: 'translate3d(0, 36px, 0)',
            transition: baseTransition,
          };
        case 'slide-down':
          return {
            opacity: 0,
            transform: 'translate3d(0, -36px, 0)',
            transition: baseTransition,
          };
        case 'fade':
          return {
            opacity: 0,
            transition: baseTransition,
          };
        case 'scale':
          return {
            opacity: 0,
            transform: 'scale(0.88)',
            transition: baseTransition,
          };
        case 'blur':
          return {
            opacity: 0,
            filter: 'blur(12px)',
            transform: 'translate3d(0, 16px, 0)',
            transition: baseTransition,
          };
      }
    }

    return {
      opacity: 1,
      transform: 'translate3d(0, 0, 0) scale(1)',
      filter: 'blur(0px)',
      transition: baseTransition,
    };
  };

  return (
    <div className="my-6 rounded-2xl border border-[#E5E7EB] bg-[#FAFAF9] overflow-hidden shadow-xs">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-[#E5E7EB]">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-[#FF5A1F]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A]">
            Interactive Reveal Sandbox
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FFF7ED] text-[#FF5A1F] border border-[#FFEDD5] font-semibold">
            Zero DOM Reflow
          </span>
        </div>
        <button
          onClick={replay}
          disabled={isAnimating}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FF5A1F] hover:bg-[#E54800] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Replay Reveal</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Controls */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <div>
            <span className="text-xs font-medium text-[#0A0A0A] block mb-2">Transition Variant</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {(['slide-up', 'slide-down', 'fade', 'scale', 'blur'] as RevealVariant[]).map((v) => (
                <button
                  key={v}
                  onClick={() => {
                    setVariant(v);
                    replay();
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium capitalize border transition-all cursor-pointer ${
                    variant === v
                      ? 'bg-[#FF5A1F] text-white border-[#FF5A1F] shadow-xs'
                      : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:text-[#0A0A0A]'
                  }`}
                >
                  {v.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-[#0A0A0A]">Duration</span>
              <span className="font-mono text-[#FF5A1F] font-semibold">{duration}s</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="1.5"
              step="0.1"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full accent-[#FF5A1F] h-1.5 bg-[#E5E7EB] rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-[#0A0A0A]">Stagger Delay</span>
              <span className="font-mono text-[#FF5A1F] font-semibold">{delay}s</span>
            </div>
            <input
              type="range"
              min="0"
              max="0.8"
              step="0.05"
              value={delay}
              onChange={(e) => setDelay(Number(e.target.value))}
              className="w-full accent-[#FF5A1F] h-1.5 bg-[#E5E7EB] rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Preview Canvas */}
        <div className="md:col-span-7 flex flex-col gap-2">
          <div className="relative h-56 sm:h-64 rounded-xl border border-[#E5E7EB] bg-white overflow-hidden flex items-center justify-center p-6 shadow-inner">
            {/* Ambient Background Grid */}
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, #D1D5DB 1px, transparent 0)',
                backgroundSize: '16px 16px',
              }}
            />

            {/* Target Animated Card */}
            <div
              style={getVariantStyles()}
              className="relative z-10 w-full max-w-xs p-5 rounded-xl bg-white border border-[#E5E7EB] shadow-lg select-none"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FFF7ED] text-[#FF5A1F] text-[10px] font-mono font-semibold border border-[#FFEDD5]">
                  <Sparkles className="w-3 h-3" />
                  &lt;Reveal /&gt;
                </span>
                <span className="text-[10px] font-mono text-[#9CA3AF]">threshold: 0.15</span>
              </div>
              <h4 className="text-sm font-bold text-[#0A0A0A]">Intersection Triggered</h4>
              <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                Hardware-accelerated CSS transition executed directly on DOM ref.
              </p>
            </div>

            {/* Bottom Status bar */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#0A0A0A]/90 backdrop-blur-sm text-white text-[11px] font-mono">
              <span className="text-[#9CA3AF]">Variant:</span>
              <span className="text-[#FF5A1F] font-semibold">{variant}</span>
              <span className="text-[#9CA3AF] ml-2">Timing:</span>
              <span className="text-emerald-400 font-semibold">{duration}s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
