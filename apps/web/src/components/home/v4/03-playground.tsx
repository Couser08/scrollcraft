'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Parallax, Reveal } from '@scrollcraft/react';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

const REACT_SNIPPET = `import { Parallax, Reveal } from '@scrollcraft/react';

export function HeroDemo() {
  return (
    <div className="relative overflow-hidden">
      <Parallax speed={-0.2}>
        <img src="/bg.jpg" alt="Background" />
      </Parallax>
      <Reveal direction="up">
        <h1>SCROLL TO ANIMATE</h1>
      </Reveal>
    </div>
  );
}`;

const NEXT_SNIPPET = `'use client';

import { Parallax, Reveal } from '@scrollcraft/react';

export function HeroDemo() {
  return (
    <div className="relative overflow-hidden">
      <Parallax speed={-0.2}>
        <img src="/bg.jpg" alt="Background" />
      </Parallax>
      <Reveal direction="up">
        <h1>SCROLL TO ANIMATE</h1>
      </Reveal>
    </div>
  );
}`;

export function PlaygroundSection() {
  const [tab, setTab] = useState<'react' | 'next'>('react');
  const { copied, copy } = useCopyToClipboard();

  const handleCopy = () => {
    copy(tab === 'react' ? REACT_SNIPPET : NEXT_SNIPPET);
  };

  return (
    <section className="relative w-full bg-[#050505] py-28 px-6 border-t border-white/5">
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
            <p className="text-lg text-zinc-400 leading-relaxed mb-10 font-light">
              Tweak values, see real-time results and understand how scroll animations work using our native declarative primitives.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <Link
              href="/showcase"
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white text-black font-semibold text-sm transition-all duration-300 hover:bg-zinc-200 self-start shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              <span>Open Showcase</span>
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="group-hover:translate-x-1 transition-transform"
              >
                <path d="M5 12h14m-7-7 7 7-7 7" />
              </svg>
            </Link>
          </Reveal>
        </div>

        {/* Right Interactive Demo */}
        <div className="w-full lg:w-2/3 h-[580px] rounded-3xl bg-[#0A0A0A] border border-white/10 flex flex-col overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
            <div role="tablist" aria-label="Framework code choice" className="flex gap-6 text-sm font-medium">
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'react'}
                onClick={() => setTab('react')}
                className={`pb-1 transition-colors border-b-2 ${
                  tab === 'react' ? 'text-white border-white' : 'text-zinc-500 border-transparent hover:text-zinc-300'
                }`}
              >
                React
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'next'}
                onClick={() => setTab('next')}
                className={`pb-1 transition-colors border-b-2 ${
                  tab === 'next' ? 'text-white border-white' : 'text-zinc-500 border-transparent hover:text-zinc-300'
                }`}
              >
                Next.js (App Router)
              </button>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="text-xs font-mono flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-colors"
              aria-label="Copy code to clipboard"
            >
              {copied ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-400">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                  <span className="text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <div className="flex-1 flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/2 p-6 font-mono text-xs sm:text-sm text-zinc-300 bg-[#050505]/70 overflow-x-auto leading-relaxed">
              {tab === 'next' && (
                <><span className="text-green-400">&apos;use client&apos;</span>;<br/><br/></>
              )}
              <span className="text-pink-500">import</span> {'{'} <span className="text-blue-400">Parallax</span>, <span className="text-blue-400">Reveal</span> {'}'} <span className="text-pink-500">from</span> <span className="text-green-400">&apos;@scrollcraft/react&apos;</span>
              <br/><br/>
              <span className="text-pink-500">export function</span> <span className="text-blue-400">HeroDemo</span>() {'{'}<br/>
              &nbsp;&nbsp;<span className="text-pink-500">return</span> (<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;{'<'}<span className="text-blue-400">div</span> className=<span className="text-green-400">&quot;relative&quot;</span>{'>'}<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'<'}<span className="text-blue-400">Parallax</span> speed={'{'}<span className="text-orange-400">-0.2</span>{'}'}{'>'}<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'<'}<span className="text-blue-400">img</span> src=<span className="text-green-400">&quot;/bg.jpg&quot;</span> alt=<span className="text-green-400">&quot;BG&quot;</span> /{'>'}<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'</'}<span className="text-blue-400">Parallax</span>{'>'}<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'<'}<span className="text-blue-400">Reveal</span> direction=<span className="text-green-400">&quot;up&quot;</span>{'>'}<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'<'}<span className="text-blue-400">h1</span>{'>'}SCROLL TO ANIMATE{'</'}<span className="text-blue-400">h1</span>{'>'}<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'</'}<span className="text-blue-400">Reveal</span>{'>'}<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;{'</'}<span className="text-blue-400">div</span>{'>'}<br/>
              &nbsp;&nbsp;)<br/>
              {'}'}
            </div>
            <div className="w-full lg:w-1/2 h-[280px] lg:h-full min-h-[260px] relative bg-zinc-950 overflow-hidden border-t lg:border-t-0 lg:border-l border-white/5">
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <Parallax speed={-0.15} className="w-full h-full relative">
                  <div className="w-full h-[140%] -top-[20%] relative overflow-hidden rounded-xl">
                    <Image
                      src="/images/hero_mountain_dark.webp"
                      alt="Hero mountain dark demo"
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px"
                      className="object-cover"
                    />
                  </div>
                </Parallax>
                <Reveal direction="up" delay={0.2} className="absolute bottom-10 right-10 text-white font-mono text-xs flex flex-col items-end pointer-events-none">
                  <div className="w-[1px] h-12 bg-white/50 mb-2" />
                  SCROLL<br/>TO ANIMATE
                </Reveal>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

