'use client';

import React from 'react';
import { Pin, PinContainer } from '../primitives/pin';

export interface StackedCardsProps {
  cards: React.ReactNode[];
  className?: string;
}

export const StackedCards: React.FC<StackedCardsProps> = ({ cards, className = '' }) => {
  return (
    <div className={`relative w-full ${className}`}>
      <PinContainer height={`${cards.length * 100}vh`}>
        {cards.map((card, index) => {
          // Adjust top to cascade stack
          return (
            <Pin key={index} top={index * 40 + 100}>
              <div 
                className="w-full origin-top transition-transform duration-300"
                style={{ 
                  zIndex: index, 
                  // Add subtle scaling based on depth
                  transform: `scale(${Math.max(0.6, 1 - (cards.length - 1 - index) * 0.05)})`
                }}
              >
                {card}
              </div>
            </Pin>
          );
        })}
      </PinContainer>
    </div>
  );
};
