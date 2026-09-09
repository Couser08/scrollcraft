'use client';

/**
 * ScrollCraft Living Design System Showcase
 * Living interactive specification mirroring Image 1.
 * Strictly under 650 LOC.
 */

import React, { useState } from 'react';
import { ScrollCraftLogo } from '@/components/ui/scrollcraft-logo';
import {
  Sparkles,
  Sun,
  Layers,
  Code,
  Home,
  FileText,
  Terminal,
  Play,
  GitBranch,
  ExternalLink,
  Moon,
  Settings,
  Box,
  Plus,
  Search,
  Heart,
  Bookmark,
  User,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
  Copy,
  ChevronDown,
  Mail,
  Zap,
} from 'lucide-react';
import {
  GithubIcon,
  TwitterIcon,
  DiscordIcon,
} from '@/components/ui/social-icons';

const COLORS = [
  { name: 'Primary', hex: '#FF5A1F', text: 'text-white' },
  { name: 'Primary Hover', hex: '#E54800', text: 'text-white' },
  { name: 'Background', hex: '#FAFAF9', text: 'text-[#0A0A0A]', border: true },
  { name: 'Surface', hex: '#FFFFFF', text: 'text-[#0A0A0A]', border: true },
  { name: 'Text Primary', hex: '#0A0A0A', text: 'text-white' },
  { name: 'Text Secondary', hex: '#6B7280', text: 'text-white' },
  { name: 'Border', hex: '#E5E7EB', text: 'text-[#0A0A0A]', border: true },
  { name: 'Success', hex: '#16A34A', text: 'text-white' },
  { name: 'Warning', hex: '#F59E0B', text: 'text-white' },
  { name: 'Error', hex: '#EF4444', text: 'text-white' },
  { name: 'Info', hex: '#3B82F6', text: 'text-white' },
];

export default function DesignSystemPage() {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const copyValue = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedHex(val);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  return (
    <div className="w-full min-h-screen bg-white text-[#0A0A0A] py-12 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto space-y-16">
      {/* ================= POSTER HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3">
          <ScrollCraftLogo variant="badge" badgeText="v0.1.0" size="lg" />
        </div>
        <div className="text-xs font-mono font-semibold tracking-widest text-[#9CA3AF] uppercase">
          Build Smoother Experiences
        </div>
      </div>

      {/* ================= TITLE & DESIGN PRINCIPLES ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0A0A0A]">
            Design System
          </h1>
          <p className="text-base text-[#6B7280] mt-2 max-w-md">
            A cohesive design language for a better scroll experience on the web.
          </p>
        </div>

        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#0A0A0A]">
              <Sparkles className="w-3.5 h-3.5 text-[#FF5A1F]" />
              <span>Minimal</span>
            </div>
            <p className="text-xs text-[#6B7280]">Focused, clean, no unnecessary noise.</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#0A0A0A]">
              <Sun className="w-3.5 h-3.5 text-[#FF5A1F]" />
              <span>Expressive</span>
            </div>
            <p className="text-xs text-[#6B7280]">Subtle motion, meaningful feedback.</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#0A0A0A]">
              <Layers className="w-3.5 h-3.5 text-[#FF5A1F]" />
              <span>Consistent</span>
            </div>
            <p className="text-xs text-[#6B7280]">Unified components and tokens.</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#0A0A0A]">
              <Code className="w-3.5 h-3.5 text-[#FF5A1F]" />
              <span>Developer First</span>
            </div>
            <p className="text-xs text-[#6B7280]">Built for real projects. Clean, accessible, reliable.</p>
          </div>
        </div>
      </div>

      {/* ================= 3-COLUMN SECTIONS ROW: 01, 02, 03 ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
        {/* 01. Brand */}
        <div className="space-y-4">
          <div>
            <span className="font-mono text-xs text-[#FF5A1F] font-bold">01. </span>
            <span className="font-bold text-base text-[#0A0A0A]">Brand</span>
            <p className="text-xs text-[#6B7280]">Logo, wordmark and usage guidelines.</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAFAF9] border border-[#E5E7EB] flex flex-col gap-5">
            <ScrollCraftLogo variant="full" size="xl" />

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <ScrollCraftLogo variant="lockup-dark" />
              <ScrollCraftLogo variant="lockup-light" />
            </div>

            <div className="flex items-center gap-3">
              <ScrollCraftLogo variant="app-orange" />
              <ScrollCraftLogo variant="app-dark" />
            </div>
          </div>
        </div>

        {/* 02. Color system */}
        <div className="space-y-4">
          <div>
            <span className="font-mono text-xs text-[#FF5A1F] font-bold">02. </span>
            <span className="font-bold text-base text-[#0A0A0A]">Color system</span>
            <p className="text-xs text-[#6B7280]">A clean, warm, minimal palette.</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-[#E5E7EB] grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {COLORS.map((c) => (
              <button
                key={c.name}
                onClick={() => copyValue(c.hex)}
                className="group p-2 rounded-xl bg-white border border-[#E5E7EB] text-left hover:shadow-xs transition-all cursor-pointer"
                title={`Click to copy ${c.hex}`}
              >
                <div
                  className={`w-full h-9 rounded-lg mb-1.5 flex items-center justify-center text-[10px] font-mono ${c.text} ${
                    c.border ? 'border border-[#E5E7EB]' : ''
                  }`}
                  style={{ backgroundColor: c.hex }}
                >
                  {copiedHex === c.hex ? 'Copied' : ''}
                </div>
                <div className="text-[11px] font-bold text-[#0A0A0A] truncate">{c.name}</div>
                <div className="text-[10px] font-mono text-[#6B7280]">{c.hex}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 03. Typography */}
        <div className="space-y-4">
          <div>
            <span className="font-mono text-xs text-[#FF5A1F] font-bold">03. </span>
            <span className="font-bold text-base text-[#0A0A0A]">Typography</span>
            <p className="text-xs text-[#6B7280]">Clean, modern and highly readable.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAFAF9] border border-[#E5E7EB] space-y-4 font-sans">
            <div className="flex items-baseline gap-3 pb-3 border-b border-[#E5E7EB]">
              <span className="text-4xl font-extrabold text-[#0A0A0A]">Aa</span>
              <div>
                <span className="px-2 py-0.5 rounded-full bg-[#E5E7EB] text-xs font-semibold text-[#0A0A0A]">
                  Geist
                </span>
                <span className="text-xs text-[#6B7280] block mt-0.5">Used for headings, UI and code.</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-baseline justify-between">
                <span className="font-extrabold text-2xl tracking-tight text-[#0A0A0A]">H1 Title</span>
                <span className="font-mono text-[#6B7280]">Bold / 72px / -2%</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-bold text-lg text-[#0A0A0A]">H2 Heading</span>
                <span className="font-mono text-[#6B7280]">Bold / 48px / -2%</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-semibold text-base text-[#0A0A0A]">H3 Section</span>
                <span className="font-mono text-[#6B7280]">Semibold / 32px / -1%</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-medium text-sm text-[#0A0A0A]">H4 Subtitle</span>
                <span className="font-mono text-[#6B7280]">Semibold / 20px / 0%</span>
              </div>
              <div className="pt-2 border-t border-[#E5E7EB] space-y-1">
                <div className="text-xs text-[#0A0A0A]">Body: The quick brown fox jumps over the lazy dog.</div>
                <div className="text-[11px] text-[#6B7280]">Small: 14px / Regular</div>
                <div className="text-[10px] text-[#9CA3AF]">Caption: 12px / Regular</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 3-COLUMN SECTIONS ROW: 04, 05, 06 ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 04. Spacing & Radius */}
        <div className="space-y-4">
          <div>
            <span className="font-mono text-xs text-[#FF5A1F] font-bold">04. </span>
            <span className="font-bold text-base text-[#0A0A0A]">Spacing &amp; Radius</span>
            <p className="text-xs text-[#6B7280]">Consistent spacing and corner radius.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAFAF9] border border-[#E5E7EB] space-y-5">
            {/* Spacing */}
            <div>
              <div className="text-[11px] font-mono text-[#6B7280] mb-2">Spacing Scale:</div>
              <div className="flex items-end gap-2 text-center text-[10px] font-mono text-[#6B7280]">
                {[4, 8, 12, 16, 24, 32, 48].map((s) => (
                  <div key={s} className="flex flex-col items-center gap-1">
                    <div
                      className="bg-[#E5E7EB] rounded-xs"
                      style={{ width: `${s}px`, height: `${s}px` }}
                    />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Radius */}
            <div>
              <div className="text-[11px] font-mono text-[#6B7280] mb-2">Corner Radii:</div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-3 bg-white border border-[#E5E7EB] rounded-[6px]">
                  <div className="font-bold text-[#0A0A0A]">sm</div>
                  <div className="text-[10px] text-[#6B7280]">6px</div>
                </div>
                <div className="p-3 bg-white border border-[#E5E7EB] rounded-[12px]">
                  <div className="font-bold text-[#0A0A0A]">md</div>
                  <div className="text-[10px] text-[#6B7280]">12px</div>
                </div>
                <div className="p-3 bg-white border border-[#E5E7EB] rounded-[16px]">
                  <div className="font-bold text-[#0A0A0A]">lg</div>
                  <div className="text-[10px] text-[#6B7280]">16px</div>
                </div>
                <div className="p-3 bg-white border border-[#E5E7EB] rounded-[24px]">
                  <div className="font-bold text-[#0A0A0A]">xl</div>
                  <div className="text-[10px] text-[#6B7280]">24px</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 05. Shadows */}
        <div className="space-y-4">
          <div>
            <span className="font-mono text-xs text-[#FF5A1F] font-bold">05. </span>
            <span className="font-bold text-base text-[#0A0A0A]">Shadows</span>
            <p className="text-xs text-[#6B7280]">Subtle, clean shadows for depth.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAFAF9] border border-[#E5E7EB] grid grid-cols-2 gap-3 text-xs">
            <div className="p-4 bg-white rounded-xl shadow-xs border border-[#E5E7EB]/50">
              <div className="font-bold text-[#0A0A0A]">sm</div>
              <div className="text-[10px] font-mono text-[#6B7280]">0 1px 2px rgba(0,0,0,0.05)</div>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-md border border-[#E5E7EB]/50">
              <div className="font-bold text-[#0A0A0A]">md</div>
              <div className="text-[10px] font-mono text-[#6B7280]">0 4px 12px rgba(0,0,0,0.06)</div>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-lg border border-[#E5E7EB]/50">
              <div className="font-bold text-[#0A0A0A]">lg</div>
              <div className="text-[10px] font-mono text-[#6B7280]">0 10px 24px rgba(0,0,0,0.08)</div>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-xl border border-[#E5E7EB]/50">
              <div className="font-bold text-[#0A0A0A]">xl</div>
              <div className="text-[10px] font-mono text-[#6B7280]">0 20px 40px rgba(0,0,0,0.10)</div>
            </div>
          </div>
        </div>

        {/* 06. Icons */}
        <div className="space-y-4">
          <div>
            <span className="font-mono text-xs text-[#FF5A1F] font-bold">06. </span>
            <span className="font-bold text-base text-[#0A0A0A]">Icons</span>
            <p className="text-xs text-[#6B7280]">Simple, consistent, 2px stroke icons (Lucide).</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAFAF9] border border-[#E5E7EB]">
            <div className="grid grid-cols-7 gap-3 text-[#0A0A0A]">
              <Home className="w-5 h-5" />
              <FileText className="w-5 h-5" />
              <Terminal className="w-5 h-5" />
              <Play className="w-5 h-5" />
              <GitBranch className="w-5 h-5" />
              <ExternalLink className="w-5 h-5" />
              <Moon className="w-5 h-5" />
              <Sun className="w-5 h-5" />
              <Settings className="w-5 h-5" />
              <Layers className="w-5 h-5" />
              <Box className="w-5 h-5" />
              <Plus className="w-5 h-5" />
              <Search className="w-5 h-5" />
              <Heart className="w-5 h-5" />
              <Bookmark className="w-5 h-5" />
              <User className="w-5 h-5" />
              <GithubIcon className="w-5 h-5" />
              <MessageSquare className="w-5 h-5" />
              <TwitterIcon className="w-5 h-5" />
              <ArrowRight className="w-5 h-5" />
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-[#6B7280] font-mono block mt-4 text-right">
              Using Lucide Icons
            </span>
          </div>
        </div>
      </div>

      {/* ================= 3-COLUMN SECTIONS ROW: 07, 08, 09 ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 07. Buttons */}
        <div className="space-y-4">
          <div>
            <span className="font-mono text-xs text-[#FF5A1F] font-bold">07. </span>
            <span className="font-bold text-base text-[#0A0A0A]">Buttons</span>
            <p className="text-xs text-[#6B7280]">Primary, secondary and utility buttons.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAFAF9] border border-[#E5E7EB] space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <button className="px-5 py-2.5 rounded-[12px] bg-[#FF5A1F] hover:bg-[#E54800] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer">
                Get Started
              </button>
              <button className="px-5 py-2.5 rounded-[12px] bg-white hover:bg-[#FAFAF9] border border-[#E5E7EB] text-[#0A0A0A] font-semibold text-xs transition-colors cursor-pointer">
                View Docs
              </button>
              <button className="px-5 py-2.5 rounded-[12px] bg-[#0A0A0A] hover:bg-zinc-800 text-white font-semibold text-xs transition-colors cursor-pointer">
                GitHub
              </button>
            </div>

            <div className="pt-2 border-t border-[#E5E7EB] grid grid-cols-4 gap-2 text-[10px] text-center font-mono text-[#6B7280]">
              <div>
                <div className="h-6 rounded-md bg-[#F3F4F6] mb-1" />
                Default
              </div>
              <div>
                <div className="h-6 rounded-md bg-[#FF5A1F] mb-1" />
                Hover
              </div>
              <div>
                <div className="h-6 rounded-md bg-[#E54800] mb-1" />
                Active
              </div>
              <div>
                <div className="h-6 rounded-md bg-[#E5E7EB] opacity-60 mb-1" />
                Disabled
              </div>
            </div>
          </div>
        </div>

        {/* 08. Inputs */}
        <div className="space-y-4">
          <div>
            <span className="font-mono text-xs text-[#FF5A1F] font-bold">08. </span>
            <span className="font-bold text-base text-[#0A0A0A]">Inputs</span>
            <p className="text-xs text-[#6B7280]">Text inputs, search and select.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAFAF9] border border-[#E5E7EB] space-y-3 text-xs">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Search documentation..."
                readOnly
                className="w-full pl-9 pr-12 py-2.5 rounded-[12px] bg-white border border-[#E5E7EB] text-xs text-[#0A0A0A] focus:outline-hidden"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-[#F3F4F6] text-[10px] font-mono text-[#6B7280] border border-[#E5E7EB]">
                ⌘ K
              </span>
            </div>

            {/* Email Input */}
            <div className="relative">
              <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Enter your email"
                readOnly
                className="w-full pl-9 pr-3 py-2.5 rounded-[12px] bg-white border border-[#E5E7EB] text-xs text-[#0A0A0A] focus:outline-hidden"
              />
            </div>

            {/* Select Input */}
            <div className="relative">
              <div className="w-full px-3 py-2.5 rounded-[12px] bg-white border border-[#E5E7EB] text-xs text-[#0A0A0A] flex items-center justify-between cursor-pointer">
                <span>Select a framework</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#6B7280]" />
              </div>
            </div>
          </div>
        </div>

        {/* 09. Badges & Tags */}
        <div className="space-y-4">
          <div>
            <span className="font-mono text-xs text-[#FF5A1F] font-bold">09. </span>
            <span className="font-bold text-base text-[#0A0A0A]">Badges &amp; Tags</span>
            <p className="text-xs text-[#6B7280]">Status, version and category badges.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAFAF9] border border-[#E5E7EB] space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-[#F3F4F6] border border-[#E5E7EB] text-xs font-mono font-medium text-[#4B5563]">
                v0.1.0
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#FFF7ED] border border-[#FFEDD5] text-xs font-semibold text-[#EA580C]">
                Beta
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] text-xs font-semibold text-[#2563EB]">
                New
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#F0FDF4] border border-[#DCFCE7] text-xs font-semibold text-[#16A34A]">
                Stable
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E5E7EB]">
              {['React', 'Next.js', 'TypeScript', 'Motion', 'Performance', 'Animation', 'Scroll', 'Core'].map(
                (tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md bg-white border border-[#E5E7EB] text-[11px] font-medium text-[#4B5563]"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= 3-COLUMN SECTIONS ROW: 10, 11, 12 ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 10. Code block */}
        <div className="space-y-4">
          <div>
            <span className="font-mono text-xs text-[#FF5A1F] font-bold">10. </span>
            <span className="font-bold text-base text-[#0A0A0A]">Code block</span>
            <p className="text-xs text-[#6B7280]">Syntax highlighted code with copy action.</p>
          </div>

          <div className="rounded-2xl bg-[#FAFAF9] border border-[#E5E7EB] overflow-hidden text-xs font-mono">
            <div className="flex items-center justify-between px-3 py-2 bg-white border-b border-[#E5E7EB]">
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#FAFAF9] text-[#0A0A0A]">
                tsx
              </span>
              <button
                onClick={() => copyValue("import { Parallax } from '@scrollcraft/react';")}
                className="flex items-center gap-1 text-[11px] text-[#6B7280] hover:text-[#0A0A0A]"
              >
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </button>
            </div>
            <div className="p-4 leading-relaxed bg-[#FAFAF9] text-[11px]">
              <div><span className="text-[#EA580C] font-semibold">import</span> &#123; <span className="text-[#0A0A0A]">Parallax</span> &#125; <span className="text-[#EA580C] font-semibold">from</span> <span className="text-[#16A34A]">&apos;@scrollcraft/react&apos;</span>;</div>
              <div>&nbsp;</div>
              <div><span className="text-[#7C3AED] font-semibold">export function</span> <span className="text-[#0284C7] font-semibold">Hero</span>() &#123;</div>
              <div>&nbsp;&nbsp;<span className="text-[#EA580C] font-semibold">return</span> (</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-[#2563EB] font-semibold">Parallax</span> <span className="text-[#EA580C]">asChild</span> <span className="text-[#D97706]">speed</span>=&#123;0.15&#125;&gt;</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-[#2563EB] font-semibold">h1</span>&gt;ScrollCraft&lt;/<span className="text-[#2563EB] font-semibold">h1</span>&gt;</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className="text-[#2563EB] font-semibold">Parallax</span>&gt;</div>
              <div>&nbsp;&nbsp;);</div>
              <div>&#125;</div>
            </div>
          </div>
        </div>

        {/* 11. Alerts */}
        <div className="space-y-4">
          <div>
            <span className="font-mono text-xs text-[#FF5A1F] font-bold">11. </span>
            <span className="font-bold text-base text-[#0A0A0A]">Alerts</span>
            <p className="text-xs text-[#6B7280]">Informative system messages.</p>
          </div>

          <div className="space-y-2.5">
            {/* Success */}
            <div className="p-3 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                <div>
                  <span className="font-bold text-[#16A34A] mr-1.5">Success</span>
                  <span className="text-[#15803D]">Your changes have been saved.</span>
                </div>
              </div>
              <X className="w-3.5 h-3.5 text-[#16A34A]/70 cursor-pointer" />
            </div>

            {/* Info */}
            <div className="p-3 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-[#3B82F6] shrink-0" />
                <div>
                  <span className="font-bold text-[#3B82F6] mr-1.5">Info</span>
                  <span className="text-[#1D4ED8]">Check out the latest updates.</span>
                </div>
              </div>
              <X className="w-3.5 h-3.5 text-[#3B82F6]/70 cursor-pointer" />
            </div>

            {/* Warning */}
            <div className="p-3 rounded-xl bg-[#FFFBEB] border border-[#FEF3C7] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0" />
                <div>
                  <span className="font-bold text-[#F59E0B] mr-1.5">Warning</span>
                  <span className="text-[#B45309]">Your configuration is incomplete.</span>
                </div>
              </div>
              <X className="w-3.5 h-3.5 text-[#F59E0B]/70 cursor-pointer" />
            </div>

            {/* Error */}
            <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FEE2E2] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0" />
                <div>
                  <span className="font-bold text-[#EF4444] mr-1.5">Error</span>
                  <span className="text-[#B91C1C]">Something went wrong. Try again.</span>
                </div>
              </div>
              <X className="w-3.5 h-3.5 text-[#EF4444]/70 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* 12. Card */}
        <div className="space-y-4">
          <div>
            <span className="font-mono text-xs text-[#FF5A1F] font-bold">12. </span>
            <span className="font-bold text-base text-[#0A0A0A]">Card</span>
            <p className="text-xs text-[#6B7280]">Base card component.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm flex flex-col justify-between h-[230px]">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] border border-[#FFEDD5] flex items-center justify-center text-[#FF5A1F]">
                <Layers className="w-5 h-5" />
              </div>
              <div className="w-8 h-8 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#6B7280]">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            <div>
              <h4 className="font-bold text-[#0A0A0A] text-base mb-1">Parallax asChild</h4>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                GPU-accelerated transforms directly on your elements.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-[#F3F4F6]">
              <span className="px-2.5 py-1 rounded-md bg-[#F3F4F6] text-[11px] font-medium text-[#4B5563]">
                Zero re-renders
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#F3F4F6] text-[11px] font-medium text-[#4B5563]">
                Smooth motion
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 13. NAVIGATION PREVIEW ================= */}
      <div className="space-y-3 pt-4">
        <div>
          <span className="font-mono text-xs text-[#FF5A1F] font-bold">13. </span>
          <span className="font-bold text-base text-[#0A0A0A]">Navigation</span>
          <p className="text-xs text-[#6B7280]">Main navigation bar.</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs flex items-center justify-between gap-4 overflow-x-auto">
          <ScrollCraftLogo variant="full" size="md" />

          <div className="hidden sm:flex items-center gap-6 text-xs font-medium text-[#6B7280]">
            <span className="text-[#0A0A0A] font-bold border-b-2 border-[#FF5A1F] pb-0.5">Overview</span>
            <span>Documentation</span>
            <span>Playground</span>
            <span>Changelog</span>
            <span>GitHub</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-[#FAFAF9] text-xs text-[#6B7280]">
              <Search className="w-3 h-3" />
              <span>Search...</span>
              <span className="text-[10px] font-mono px-1 rounded bg-white border border-[#E5E7EB]">⌘ K</span>
            </div>
            <button className="px-4 py-2 rounded-[12px] bg-[#0A0A0A] text-white text-xs font-semibold">
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* ================= 14. FOOTER PREVIEW ================= */}
      <div className="space-y-3 pb-8">
        <div>
          <span className="font-mono text-xs text-[#FF5A1F] font-bold">14. </span>
          <span className="font-bold text-base text-[#0A0A0A]">Footer</span>
          <p className="text-xs text-[#6B7280]">Clean and minimal footer.</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <ScrollCraftLogo variant="full" size="sm" />
            <span className="text-[#6B7280] hidden sm:inline">Build smoother experiences.</span>
          </div>

          <div className="flex items-center gap-4 text-[#6B7280]">
            <span>Documentation</span>
            <span>Playground</span>
            <span>Changelog</span>
            <span>GitHub</span>
          </div>

          <div className="flex items-center gap-3 text-[#6B7280]">
            <GithubIcon className="w-4 h-4" />
            <DiscordIcon className="w-4 h-4" />
            <TwitterIcon className="w-4 h-4" />
            <span className="text-[11px]">© 2025 ScrollCraft</span>
          </div>
        </div>
      </div>
    </div>
  );
}
