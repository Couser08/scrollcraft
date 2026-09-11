'use client';

import React from 'react';
import { Reveal } from '@scrollcraft/react';

export function CodeSection() {
  const codeLines = [
    <span key="1"><span className="text-pink-500">import</span> {'{'} <span className="text-blue-400">ScrollCraft</span> {'}'} <span className="text-pink-500">from</span> <span className="text-green-400">'@scrollcraft/core'</span></span>,
    <span key="2" />,
    <span key="3"><span className="text-pink-500">const</span> reveal = <span className="text-pink-500">new</span> <span className="text-blue-400">ScrollCraft</span>({'{'}</span>,
    <span key="4">&nbsp;&nbsp;trigger: <span className="text-green-400">'.hero'</span>,</span>,
    <span key="5">&nbsp;&nbsp;animation: {'{'}</span>,
    <span key="6">&nbsp;&nbsp;&nbsp;&nbsp;y: <span className="text-orange-400">80</span>,</span>,
    <span key="7">&nbsp;&nbsp;&nbsp;&nbsp;opacity: <span className="text-orange-400">0</span>,</span>,
    <span key="8">&nbsp;&nbsp;&nbsp;&nbsp;scale: <span className="text-orange-400">0.96</span></span>,
    <span key="9">&nbsp;&nbsp;{'}'}</span>,
    <span key="10">{'}'})</span>,
  ];

  return (
    <section className="relative w-full bg-[#050505] py-32 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left */}
        <div className="w-full lg:w-1/3 flex flex-col">
          <Reveal>
            <span className="text-xs font-mono text-zinc-500 mb-4 block">08</span>
            <h2 className="text-5xl font-bold tracking-tighter text-white mb-6">
              Simple API.<br/>Infinite possibilities.
            </h2>
            <p className="text-lg text-zinc-400 leading-relaxed mb-10">
              One unified API for Vanilla JS, React, and Next.js. Declarative bindings make scroll-driven animations a breeze.
            </p>
            <button className="px-6 py-3 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 transition-colors self-start">
              Read Documentation
            </button>
          </Reveal>
        </div>

        {/* Right Code */}
        <div className="w-full lg:w-2/3">
          <Reveal direction="up" delay={0.2} distance={40}>
            <div className="rounded-2xl bg-[#0A0A0A] border border-white/10 overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <div className="ml-4 flex gap-4 text-xs font-mono text-zinc-500">
                  <span className="text-white">animation.ts</span>
                </div>
              </div>
              <div className="p-8 font-mono text-sm leading-relaxed overflow-x-auto">
                {codeLines.map((line, i) => (
                  <Reveal key={i} delay={0.3 + i * 0.05} distance={10}>
                    <div className="flex">
                      <span className="w-8 text-zinc-600 select-none mr-4">{i + 1}</span>
                      <span className="text-zinc-300">{line}</span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

      </div>
    </section>
  );
}
