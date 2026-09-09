'use client';

/**
 * ScrollCraft Pro: 3D Tilt Card
 * Features spring-damped multi-axis rotational inertia and specular sheen.
 * Strictly under 650 LOC.
 */

import React, { useRef, useState } from 'react';
import { useSpring } from '@scrollcraft/react';

export interface ProTiltCardProps {
  title: string;
  subtitle: string;
  tag?: string;
  className?: string;
  children?: React.ReactNode;
}

export const ProTiltCard: React.FC<ProTiltCardProps> = ({
  title,
  subtitle,
  tag = 'PRO COMPONENT',
  className = '',
  children,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [targetRotX, setTargetRotX] = useState(0);
  const [targetRotY, setTargetRotY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const rotX = useSpring(targetRotX, { stiffness: 200, damping: 15 });
  const rotY = useSpring(targetRotY, { stiffness: 200, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    // Tilt limits ±12 degrees
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 12;
    const rotateX = -((y - rect.height / 2) / (rect.height / 2)) * 12;

    setTargetRotX(rotateX);
    setTargetRotY(rotateY);
    setGlarePos({ x: xPercent, y: yPercent, opacity: 0.18 });
  };

  const handleMouseLeave = () => {
    setTargetRotX(0);
    setTargetRotY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-3xl bg-[#13141b] border border-white/10 p-8 shadow-2xl overflow-hidden cursor-pointer select-none transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(37,99,235,0.25)] ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Dynamic Specular Glare Layer */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,${glarePos.opacity}) 0%, transparent 60%)`,
        }}
      />

      <div className="relative z-10 space-y-4">
        {tag && (
          <span className="inline-block px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 font-mono text-[10px] font-semibold tracking-wider uppercase">
            {tag}
          </span>
        )}
        <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
        <p className="text-zinc-400 text-xs leading-relaxed">{subtitle}</p>
        {children}
      </div>
    </div>
  );
};
