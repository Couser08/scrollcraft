'use client';

import React, { useState } from 'react';
import { Pin, PinContainer, Reveal, Parallax } from '@scrollcraft/react';

export function PlaygroundSection() {
  const [tab, setTab] = useState<'react' | 'next'>('react');

  return (
    <section className="relative w-full bg-[#050505] border-t border-white/5">
      <PinContainer height="200vh">
        <Pin top={0} className="w-full min-h-screen flex items-center py-20 px-6">
          <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-16">
            
            {/* Left Content */}
            <div className="w-full lg:w-1/3 flex flex-col">
              <Reveal>
                <div className="flex flex-col gap-2 mb-12">
                  <span className="text-xs font-mono text-zinc-500">03</span>
                  <div className="text-xs font-semibold tracking-widest text-zinc-400 uppercase leading-loose">
                    SEE IT<br/>IN ACTION
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-white mb-6">
                  Scroll.<br/>Play.<br/>Experiment.
                </h2>
              </Reveal>

              <Reveal delay={0.2}>
                <p className="text-lg text-zinc-400 leading-relaxed mb-10">
                  Tweak values, see real-time results and understand how scroll animations work using our native declarative primitives.
                </p>
              </Reveal>

              <Reveal delay={0.3}>
                <button className="px-6 py-3 rounded-full bg-white text-black font-medium hover:scale-105 transition-transform self-start flex items-center gap-2">
                  Open Playground
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                </button>
              </Reveal>
            </div>

            {/* Right Interactive Demo */}
            <div className="w-full lg:w-2/3 h-[600px] rounded-3xl bg-[#0A0A0A] border border-white/10 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <div className="flex gap-6 text-sm font-medium">
                  <span 
                    onClick={() => setTab('react')}
                    className={`pb-4 -mb-4 cursor-pointer transition-colors ${tab === 'react' ? 'text-white border-b-2 border-white' : 'text-zinc-500 hover:text-white'}`}
                  >
                    React
                  </span>
                  <span 
                    onClick={() => setTab('next')}
                    className={`pb-4 -mb-4 cursor-pointer transition-colors ${tab === 'next' ? 'text-white border-b-2 border-white' : 'text-zinc-500 hover:text-white'}`}
                  >
                    Next.js (App Router)
                  </span>
                </div>
                <button className="text-xs font-mono flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  Copy
                </button>
              </div>
              <div className="flex-1 flex flex-col lg:flex-row">
                <div className="w-full lg:w-1/2 p-6 font-mono text-sm text-zinc-300 bg-[#050505]/50 overflow-x-auto">
                  {tab === 'next' && (
                    <><span className="text-green-400">'use client'</span>;<br/><br/></>
                  )}
                  <span className="text-pink-500">import</span> {'{'} <span className="text-blue-400">Parallax</span>, <span className="text-blue-400">Reveal</span> {'}'} <span className="text-pink-500">from</span> <span className="text-green-400">'@scrollcraft/react'</span>
                  <br/><br/>
                  <span className="text-pink-500">export function</span> <span className="text-blue-400">HeroDemo</span>() {'{'}<br/>
                  &nbsp;&nbsp;<span className="text-pink-500">return</span> (<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;{'<'}<span className="text-blue-400">div</span> className=<span className="text-green-400">"relative"</span>{'>'}<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'<'}<span className="text-blue-400">Parallax</span> speed={'{'}<span className="text-orange-400">-0.2</span>{'}'}{'>'}<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'<'}<span className="text-blue-400">img</span> src=<span className="text-green-400">"/bg.jpg"</span> /{'>'}<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'</'}<span className="text-blue-400">Parallax</span>{'>'}<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'<'}<span className="text-blue-400">Reveal</span> direction=<span className="text-green-400">"up"</span>{'>'}<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'<'}<span className="text-blue-400">h1</span>{'>'}SCROLL TO ANIMATE{'</'}<span className="text-blue-400">h1</span>{'>'}<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'</'}<span className="text-blue-400">Reveal</span>{'>'}<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;{'</'}<span className="text-blue-400">div</span>{'>'}<br/>
                  &nbsp;&nbsp;)<br/>
                  {'}'}
                </div>
                <div className="w-full lg:w-1/2 relative bg-zinc-900 overflow-hidden border-l border-white/5">
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <Parallax speed={-0.2} className="w-full h-full relative">
                      <div className="w-full h-[150%] -top-[25%] absolute bg-[url('/images/hero_mountain_dark.jpg')] bg-cover bg-center rounded-xl" />
                    </Parallax>
                    <Reveal direction="up" delay={0.2} className="absolute bottom-12 right-12 text-white font-mono text-xs flex flex-col items-end">
                      <div className="w-[1px] h-12 bg-white/50 mb-2" />
                      SCROLL<br/>TO ANIMATE
                    </Reveal>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </Pin>
      </PinContainer>
    </section>
  );
}
