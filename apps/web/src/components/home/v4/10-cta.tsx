'use client';

import React, { useState } from 'react';
import { Parallax, Reveal } from '@scrollcraft/react';

export function CTASection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('npm i @scrollcraft/core');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative w-full min-h-[80vh] flex items-center justify-center bg-[#050505] overflow-hidden">
      
      {/* Background Terrain */}
      <div className="absolute inset-0 z-0">
        <Reveal distance={80} duration={1.2}>
          <div className="w-full h-full opacity-30">
            <Parallax speed={-0.1} className="w-full h-[120%] -top-[10%] relative">
              <div className="absolute inset-0 bg-[url('/images/cta-mountains.jpg')] bg-cover bg-center mix-blend-screen" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]" />
            </Parallax>
          </div>
        </Reveal>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
        <Reveal>
          <span className="text-xs font-mono text-zinc-500 mb-8 block absolute -top-32 left-0 md:static md:mb-8 text-left md:text-center w-full">10</span>
        </Reveal>
        
        <Reveal delay={0.1} distance={40}>
          <h2 className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-6">
            Start Crafting.
          </h2>
        </Reveal>

        <Reveal delay={0.2} distance={40}>
          <p className="text-xl text-zinc-400 mb-12 font-light">
            Install ScrollCraft and turn scroll into an experience.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="flex items-center gap-4 p-2 pl-6 bg-white/5 border border-white/10 rounded-full backdrop-blur-md transition-colors hover:border-white/20">
            <span className="text-zinc-500 font-mono text-sm select-none">$</span>
            <code className="text-white font-mono text-sm tracking-wide mr-8">npm i @scrollcraft/core</code>
            <button 
              onClick={handleCopy}
              className="w-10 h-10 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition-transform"
              title="Copy to clipboard"
            >
              {copied ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              )}
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
