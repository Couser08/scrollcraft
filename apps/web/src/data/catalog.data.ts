/**
 * Component Catalog Data Layer for ScrollCraft Pro
 * Strictly under 650 LOC.
 */

export interface CatalogItem {
  id: string;
  name: string;
  category: '3d-physics' | 'pinning' | 'typography' | 'micro' | 'layouts';
  description: string;
  command: string;
  badge?: string;
  previewGradient: string;
}

export const CATALOG_CATEGORIES = [
  { id: 'all', label: 'All Components' },
  { id: '3d-physics', label: '3D & Physics' },
  { id: 'pinning', label: 'Pinning & Scrub' },
  { id: 'typography', label: 'Typography' },
  { id: 'micro', label: 'Micro-Interactions' },
  { id: 'layouts', label: 'Full Layouts' },
] as const;

export const CATALOG_ITEMS: CatalogItem[] = [
  {
    id: 'tilt-card',
    name: '3D Specular Tilt Card',
    category: '3d-physics',
    description: 'Rotational spring inertia with dynamic cursor-following specular glare.',
    command: 'npx scrollcraft add tilt-card',
    badge: 'AWWWARDS',
    previewGradient: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
  },
  {
    id: 'horizontal-rail',
    name: 'Pinned Horizontal Rail',
    category: 'pinning',
    description: 'Translates vertical scroll progress into smooth horizontal sliding motion.',
    command: 'npx scrollcraft add horizontal-rail',
    badge: 'POPULAR',
    previewGradient: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)',
  },
  {
    id: 'text-reveal',
    name: 'Kinetic Word Reveal',
    category: 'typography',
    description: 'Apple-style word-by-word mask reveal driven by scroll progress.',
    command: 'npx scrollcraft add text-reveal',
    badge: 'SIGNATURE',
    previewGradient: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
  },
  {
    id: 'magnetic-dock',
    name: 'macOS Magnetic Fluid Dock',
    category: 'micro',
    description: 'Fluid pointer proximity dock with harmonic spring scaling.',
    command: 'npx scrollcraft add magnetic-dock',
    badge: 'NEW',
    previewGradient: 'linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)',
  },
  {
    id: 'card-stack',
    name: 'Layered Sticky Card Stack',
    category: 'layouts',
    description: 'Layered sticky cards that scale down smoothly as new cards roll over.',
    command: 'npx scrollcraft add card-stack',
    badge: 'HOT',
    previewGradient: 'linear-gradient(135deg, #7c2d12 0%, #18181b 100%)',
  },
  {
    id: 'elastic-cursor',
    name: 'Elastic Magnetic Cursor',
    category: 'micro',
    description: 'Subpixel trailing cursor with dynamic shape morphing on link hover.',
    command: 'npx scrollcraft add elastic-cursor',
    badge: 'PRO',
    previewGradient: 'linear-gradient(135deg, #3b0764 0%, #111827 100%)',
  },
];
