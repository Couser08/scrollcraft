'use client';

/**
 * ScrollCraft Pro: macOS-Style Magnetic Fluid Dock
 * Icons smoothly scale and translate based on pointer proximity.
 * Strictly under 650 LOC.
 */

import React, { useRef, useState } from 'react';
import { useSpring } from '@/hooks/use-spring';
import {
  Code,
  Flame,
  Globe,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';

interface DockItemProps {
  mouseX: number | null;
  icon: React.ReactNode;
  label: string;
}

const DockItem: React.FC<DockItemProps> = ({ mouseX, icon, label }) => {
  const itemRef = useRef<HTMLDivElement | null>(null);

  // Calculate target scale based on mouse distance
  let targetScale = 1;
  if (mouseX !== null && itemRef.current) {
    const rect = itemRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const distance = Math.abs(mouseX - centerX);
    const radius = 100;

    if (distance < radius) {
      targetScale = 1 + (1 - distance / radius) * 0.45;
    }
  }

  const scale = useSpring(targetScale, { stiffness: 260, damping: 18 });

  return (
    <div
      ref={itemRef}
      className="relative group flex flex-col items-center cursor-pointer"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'bottom',
      }}
    >
      {/* Tooltip */}
      <span className="absolute -top-8 px-2 py-0.5 rounded bg-zinc-800 border border-white/10 text-white text-[10px] font-sans opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        {label}
      </span>

      <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-white shadow-lg backdrop-blur-md transition-colors hover:bg-white/20">
        {icon}
      </div>
    </div>
  );
};

export const ProMagneticDock: React.FC = () => {
  const [mouseX, setMouseX] = useState<number | null>(null);

  const items = [
    { icon: <Zap className="w-5 h-5 text-blue-400" />, label: 'Blazing Fast' },
    { icon: <Sparkles className="w-5 h-5 text-amber-400" />, label: 'Zero Jank' },
    { icon: <Layers className="w-5 h-5 text-emerald-400" />, label: 'Pinning' },
    { icon: <Flame className="w-5 h-5 text-rose-400" />, label: 'Springs' },
    { icon: <Code className="w-5 h-5 text-cyan-400" />, label: 'Next.js 15' },
    { icon: <Globe className="w-5 h-5 text-purple-400" />, label: 'Universal' },
  ];

  return (
    <div className="w-full flex justify-center py-12">
      <div
        onMouseMove={(e) => setMouseX(e.clientX)}
        onMouseLeave={() => setMouseX(null)}
        className="flex items-end gap-3 px-4 py-3 rounded-3xl bg-[#121319]/80 border border-white/10 shadow-2xl backdrop-blur-2xl"
      >
        {items.map((item) => (
          <DockItem key={item.label} mouseX={mouseX} icon={item.icon} label={item.label} />
        ))}
      </div>
    </div>
  );
};
