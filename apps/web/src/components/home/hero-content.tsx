'use client';

/**
 * Left Column: Hero Content & Value Proposition
 * Uses declarative <Parallax asChild> and <Reveal asChild> primitives.
 * Strictly under 650 LOC.
 */

import React from 'react';
import { HERO_DATA } from '@/data/hero.data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AvatarGroup } from '@/components/ui/avatar-group';
import { Parallax, Reveal } from '@scrollcraft/react';

export const HeroContent: React.FC = () => {
  return (
    <Reveal asChild direction="up" distance={24} duration={0.7}>
      <Parallax asChild speed={0.05}>
        <div className="flex flex-col items-start gap-6 lg:gap-8 max-w-xl z-10">
          {/* Top Frosted Pill Badge */}
          <Badge>{HERO_DATA.badge.text}</Badge>

          {/* Main Punchy Typography */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08]">
            {HERO_DATA.headline.lead}{' '}
            <span className="block text-[#2b7fff] drop-shadow-[0_0_25px_rgba(43,127,255,0.35)]">
              {HERO_DATA.headline.highlight}
            </span>
          </h1>

          {/* Value Subtitle */}
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed font-normal">
            {HERO_DATA.description}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <Button variant="primary" withArrow>
              {HERO_DATA.cta.primaryText}
            </Button>
            <Button variant="secondary">
              {HERO_DATA.cta.secondaryText}
            </Button>
          </div>

          {/* Social Proof Avatars */}
          <AvatarGroup
            users={HERO_DATA.socialProof.users}
            count={HERO_DATA.socialProof.count}
            label={HERO_DATA.socialProof.text}
          />
        </div>
      </Parallax>
    </Reveal>
  );
};
