'use client';

/**
 * Right Column: Interactive macOS Editor Window Mockup & Orbit Pointer Cards
 * Strictly under 650 LOC.
 */

import React, { useState } from 'react';
import { TrafficLights } from '@/components/ui/traffic-lights';
import { PointerCard } from '@/components/ui/pointer-card';
import { POINTER_CARDS, MOCKUP_DOCUMENT } from '@/data/mockup.data';
import {
  FileText,
  Star,
  Folder,
  Clock,
  Plus,
  Eye,
  ChevronDown,
  Bold,
  Italic,
  Heading,
  Link,
  List,
  CheckSquare,
  Square,
} from 'lucide-react';
import { Parallax } from '@scrollcraft/react';

export const HeroMockup: React.FC = () => {
  const [tasks, setTasks] = useState(MOCKUP_DOCUMENT.tasks);
  const [activeTab, setActiveTab] = useState('Document');

  const toggleTask = (index: number) => {
    setTasks((prev) =>
      prev.map((t, i) => (i === index ? { ...t, checked: !t.checked } : t))
    );
  };

  return (
    <div className="relative w-full max-w-2xl lg:max-w-none flex justify-center items-center py-6">
      {/* Ambient Radial Backlight Glow */}
      <div className="absolute w-[500px] h-[350px] bg-blue-600/10 rounded-full blur-[110px] pointer-events-none -z-10" />

      {/* Floating Pointer Card: Top Left (Fast & Distraction Free) */}
      <div className="absolute -top-4 -left-6 sm:left-4 z-20 hidden sm:block">
        <PointerCard data={POINTER_CARDS[0]} />
        {/* Curved Pointer Arrow to Editor */}
        <svg
          className="absolute -right-8 top-10 w-10 h-10 text-zinc-500/60 pointer-events-none hidden md:block"
          viewBox="0 0 40 40"
          fill="none"
        >
          <path
            d="M 5 5 Q 30 10 32 30"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          <path d="M 28 25 L 32 30 L 37 26" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Hand-drawn Annotation: Top Right */}
      <div className="absolute -top-8 right-2 sm:right-10 z-20 hidden md:flex flex-col items-end text-zinc-400 font-serif italic text-xs select-none">
        <div className="text-right leading-tight text-zinc-400/80">
          <span>Write</span>
          <br />
          <span>Preview</span>
          <br />
          <span>Export</span>
          <br />
          <strong className="not-italic text-[11px] font-sans text-zinc-300">
            All in one place.
          </strong>
        </div>
        <svg className="w-12 h-8 text-zinc-500/60" viewBox="0 0 50 30" fill="none">
          <path
            d="M 40 2 Q 25 15 10 25"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />
          <path d="M 12 18 L 10 25 L 17 25" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Main macOS Editor Window */}
      <Parallax
        asChild
        speed={-0.06}
      >
        <div className="w-full rounded-2xl bg-[#0f1015] border border-white/10 shadow-[0_25px_65px_-12px_rgba(0,0,0,0.85)] overflow-hidden backdrop-blur-xl">
        {/* Window Titlebar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#13141b] border-b border-white/5">
          <TrafficLights />
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-colors cursor-pointer">
              <Eye className="w-3.5 h-3.5 text-zinc-300" />
              <span>Preview</span>
            </button>
            <button className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-colors cursor-pointer">
              <span>Export</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>
          </div>
        </div>

        {/* Window Body */}
        <div className="grid grid-cols-12 min-h-[360px] text-xs">
          {/* Left Sidebar */}
          <div className="col-span-3 bg-[#0d0e13] border-r border-white/5 p-3 flex flex-col justify-between">
            <div className="space-y-1">
              {[
                { id: 'Document', icon: FileText },
                { id: 'Starred', icon: Star },
                { id: 'Templates', icon: Folder },
                { id: 'Recents', icon: Clock },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-all ${
                      isActive
                        ? 'bg-blue-600/20 text-blue-400 font-medium'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.id}</span>
                  </button>
                );
              })}
            </div>

            <button className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-white/10 text-zinc-300 hover:bg-white/5 transition-colors">
              <Plus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
          </div>

          {/* Main Content Area */}
          <div className="col-span-9 bg-[#111218] flex flex-col">
            {/* Editor Toolbar */}
            <div className="flex items-center gap-3 px-4 py-2 border-b border-white/5 text-zinc-400">
              <Heading className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
              <Bold className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
              <Italic className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
              <div className="w-px h-3.5 bg-white/10" />
              <Link className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
              <List className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
              <span className="ml-auto text-zinc-600 hover:text-zinc-400 cursor-pointer">•••</span>
            </div>

            {/* Split Editor / Preview Panes */}
            <div className="grid grid-cols-2 p-4 gap-4 flex-1">
              {/* Markdown Editor Input Side */}
              <div className="space-y-3 font-mono text-[11px] text-zinc-300">
                <div className="text-blue-400 font-bold"># Ideas that matter</div>
                <div className="text-zinc-400 border-l-2 border-zinc-700 pl-2 italic">
                  {MOCKUP_DOCUMENT.quote}
                </div>
                <div className="space-y-1.5 pt-1">
                  {tasks.map((task, idx) => (
                    <div
                      key={task.label}
                      onClick={() => toggleTask(idx)}
                      className="flex items-center gap-2 cursor-pointer text-zinc-300 hover:text-white"
                    >
                      {task.checked ? (
                        <CheckSquare className="w-3.5 h-3.5 text-blue-500 fill-blue-500/20" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-zinc-600" />
                      )}
                      <span className={task.checked ? 'text-zinc-200' : 'text-zinc-500'}>
                        {task.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rendered Preview Output Side */}
              <div className="border-l border-white/5 pl-4 space-y-2 text-zinc-200">
                <h3 className="font-semibold text-white text-xs">{MOCKUP_DOCUMENT.title}</h3>
                <p className="text-[10px] text-zinc-400">{MOCKUP_DOCUMENT.quote}</p>
                <ul className="space-y-1 pt-1 text-[11px] text-zinc-300">
                  {tasks.map((task) => (
                    <li
                      key={task.label}
                      className={`flex items-center gap-1.5 ${
                        task.checked ? 'text-zinc-100 font-medium' : 'text-zinc-600'
                      }`}
                    >
                      <span className="text-blue-400">•</span>
                      <span>{task.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Parallax>

      {/* Floating Pointer Card: Bottom Left (Beautiful Templates) */}
      <div className="absolute -bottom-6 -left-4 sm:left-2 z-20 hidden sm:block">
        <PointerCard data={POINTER_CARDS[1]} />
        <svg
          className="absolute -right-6 -top-6 w-8 h-8 text-zinc-500/60 pointer-events-none hidden md:block"
          viewBox="0 0 30 30"
          fill="none"
        >
          <path
            d="M 5 25 Q 15 10 25 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
        </svg>
      </div>

      {/* Floating Pointer Card: Bottom Right (Export Anywhere) */}
      <div className="absolute -bottom-6 -right-4 sm:right-2 z-20 hidden sm:block">
        <PointerCard data={POINTER_CARDS[2]} />
        <svg
          className="absolute -left-6 -top-6 w-8 h-8 text-zinc-500/60 pointer-events-none hidden md:block"
          viewBox="0 0 30 30"
          fill="none"
        >
          <path
            d="M 25 25 Q 15 10 5 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
        </svg>
      </div>
    </div>
  );
};
