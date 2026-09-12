'use client';

import React from 'react';
import Link from 'next/link';
import { Reveal } from '@scrollcraft/react';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

const RAW_CODE = `import { ScrollProvider, Parallax, Reveal } from '@scrollcraft/react';

export function CinematicStory() {
  return (
    <ScrollProvider smooth={true}>
      <div className="relative min-h-screen overflow-hidden">
        <Parallax speed={-0.2}>
          <img src="/landscape.webp" alt="Background" />
        </Parallax>

        <Reveal direction="up" delay={0.2} distance={60}>
          <h1>Animate on scroll, beautifully.</h1>
        </Reveal>
      </div>
    </ScrollProvider>
  );
}`;

export function CodeSection() {
  const { copied, copy } = useCopyToClipboard();

  const handleCopy = () => {
    copy(RAW_CODE);
  };

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
            <p className="text-lg text-zinc-400 leading-relaxed mb-10 font-light">
              One unified, declarative API for React and Next.js. Direct GPU compositor writes with zero React re-renders.
            </p>
            <Link
              href="/docs"
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full border border-white/20 text-white font-medium hover:bg-white/10 hover:border-white/40 transition-all self-start text-sm shadow-[0_0_15px_rgba(255,255,255,0.05)]"
            >
              <span>Read Documentation</span>
              <svg
                width="14"
                height="14"
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

        {/* Right Code */}
        <div className="w-full lg:w-2/3">
          <Reveal direction="up" delay={0.2} distance={30}>
            <div className="rounded-2xl bg-[#0A0A0A] border border-white/10 overflow-hidden shadow-2xl">
              {/* Window Bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-3 text-xs font-mono text-zinc-400">story.tsx</span>
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-xs font-mono flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-colors"
                  aria-label="Copy code to clipboard"
                >
                  {copied ? (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-400">
                        <path d="M20 6 9 17l-5-5"/>
                      </svg>
                      <span className="text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                      </svg>
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code Content */}
              <div className="p-7 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto text-zinc-300">
                <div><span className="text-zinc-600 select-none mr-4">01</span><span className="text-pink-400">import</span> {'{'} <span className="text-blue-300">ScrollProvider</span>, <span className="text-blue-300">Parallax</span>, <span className="text-blue-300">Reveal</span> {'}'} <span className="text-pink-400">from</span> <span className="text-green-300">&apos;@scrollcraft/react&apos;</span>;</div>
                <div><span className="text-zinc-600 select-none mr-4">02</span></div>
                <div><span className="text-zinc-600 select-none mr-4">03</span><span className="text-pink-400">export function</span> <span className="text-blue-400">CinematicStory</span>() {'{'}</div>
                <div><span className="text-zinc-600 select-none mr-4">04</span>&nbsp;&nbsp;<span className="text-pink-400">return</span> (</div>
                <div><span className="text-zinc-600 select-none mr-4">05</span>&nbsp;&nbsp;&nbsp;&nbsp;{'<'}<span className="text-blue-300">ScrollProvider</span> smooth={'{'}<span className="text-orange-400">true</span>{'}'}{'>'}</div>
                <div><span className="text-zinc-600 select-none mr-4">06</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'<'}<span className="text-blue-300">div</span> className=<span className="text-green-300">&quot;relative min-h-screen overflow-hidden&quot;</span>{'>'}</div>
                <div><span className="text-zinc-600 select-none mr-4">07</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'<'}<span className="text-blue-300">Parallax</span> speed={'{'}<span className="text-orange-400">-0.2</span>{'}'}{'>'}</div>
                <div><span className="text-zinc-600 select-none mr-4">08</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'<'}<span className="text-blue-300">img</span> src=<span className="text-green-300">&quot;/landscape.webp&quot;</span> alt=<span className="text-green-300">&quot;Background&quot;</span> /{'>'}</div>
                <div><span className="text-zinc-600 select-none mr-4">09</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'</'}<span className="text-blue-300">Parallax</span>{'>'}</div>
                <div><span className="text-zinc-600 select-none mr-4">10</span></div>
                <div><span className="text-zinc-600 select-none mr-4">11</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'<'}<span className="text-blue-300">Reveal</span> direction=<span className="text-green-300">&quot;up&quot;</span> delay={'{'}<span className="text-orange-400">0.2</span>{'}'} distance={'{'}<span className="text-orange-400">60</span>{'}'}{'>'}</div>
                <div><span className="text-zinc-600 select-none mr-4">12</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'<'}<span className="text-blue-300">h1</span>{'>'}Animate on scroll, beautifully.{'</'}<span className="text-blue-300">h1</span>{'>'}</div>
                <div><span className="text-zinc-600 select-none mr-4">13</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'</'}<span className="text-blue-300">Reveal</span>{'>'}</div>
                <div><span className="text-zinc-600 select-none mr-4">14</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'</'}<span className="text-blue-300">div</span>{'>'}</div>
                <div><span className="text-zinc-600 select-none mr-4">15</span>&nbsp;&nbsp;&nbsp;&nbsp;{'</'}<span className="text-blue-300">ScrollProvider</span>{'>'}</div>
                <div><span className="text-zinc-600 select-none mr-4">16</span>&nbsp;&nbsp;);</div>
                <div><span className="text-zinc-600 select-none mr-4">17</span>{'}'}</div>
              </div>
            </div>
          </Reveal>
        </div>

      </div>
    </section>
  );
}

