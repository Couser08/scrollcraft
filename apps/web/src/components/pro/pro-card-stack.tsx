'use client';

/**
 * ScrollCraft Pro: Layered Stacking Card Deck
 * Cards stack and scale down smoothly as new cards roll over them.
 * Strictly under 650 LOC.
 */

import React from 'react';

export interface CardStackItem {
  id: string;
  title: string;
  description: string;
  badge: string;
  bgGradient: string;
}

export const ProCardStack: React.FC<{ cards: CardStackItem[] }> = ({ cards }) => {
  return (
    <div className="w-full max-w-4xl mx-auto py-20 px-6 flex flex-col gap-12">
      <div className="text-center space-y-2">
        <span className="text-purple-400 font-mono text-xs font-semibold uppercase tracking-wider">
          ScrollCraft Pro Stacking
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Layered Sticky Cards
        </h2>
      </div>

      <div className="flex flex-col gap-8">
        {cards.map((card, idx) => (
          <div
            key={card.id}
            className="sticky top-28 rounded-3xl p-8 sm:p-12 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-all duration-200"
            style={{
              background: card.bgGradient,
              top: `${110 + idx * 24}px`,
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="px-3 py-1 rounded-full bg-white/10 text-white font-mono text-xs w-fit">
                {card.badge}
              </span>
              <span className="text-white/40 font-mono text-xs">STEP 0{idx + 1}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-white mt-6 mb-3">
              {card.title}
            </h3>
            <p className="text-white/80 text-sm sm:text-base max-w-xl leading-relaxed">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
