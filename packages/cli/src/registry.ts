/**
 * Component Registry for ScrollCraft CLI
 * Strictly under 650 LOC.
 */

export interface RegistryItem {
  name: string;
  description: string;
  dependencies: string[];
  files: string[];
}

export const REGISTRY: Record<string, RegistryItem> = {
  'tilt-card': {
    name: 'pro-tilt-card',
    description: '3D interactive mouse & scroll tilt card with specular reflection',
    dependencies: ['@scrollcraft/core', '@scrollcraft/react', 'lucide-react'],
    files: ['src/components/pro/pro-tilt-card.tsx'],
  },
  'horizontal-rail': {
    name: 'pro-horizontal-rail',
    description: 'Pinned horizontal scroll gallery driven by vertical scroll scrub',
    dependencies: ['@scrollcraft/core', '@scrollcraft/react'],
    files: ['src/components/pro/pro-horizontal-rail.tsx'],
  },
  'text-reveal': {
    name: 'pro-text-reveal',
    description: 'Kinetic word-by-word scroll mask reveal',
    dependencies: ['@scrollcraft/core', '@scrollcraft/react'],
    files: ['src/components/pro/pro-text-reveal.tsx'],
  },
  'magnetic-dock': {
    name: 'pro-magnetic-dock',
    description: 'macOS-style fluid magnetic dock with proximity icon scaling',
    dependencies: ['@scrollcraft/core', '@scrollcraft/react', 'lucide-react'],
    files: ['src/components/pro/pro-magnetic-dock.tsx'],
  },
  'card-stack': {
    name: 'pro-card-stack',
    description: 'Layered sticky card deck with scale-down stacking physics',
    dependencies: ['@scrollcraft/core', '@scrollcraft/react'],
    files: ['src/components/pro/pro-card-stack.tsx'],
  },
};
