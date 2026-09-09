'use client';

/**
 * ClientFpsHud: Lazy client boundary for FpsHud
 * Strictly under 650 LOC.
 */

import dynamic from 'next/dynamic';

export const ClientFpsHud = dynamic(
  () => import('./fps-hud').then((m) => m.FpsHud),
  { ssr: false }
);
