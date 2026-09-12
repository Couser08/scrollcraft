/**
 * ScrollCraft Feature & Performance Tier Detection
 * Strictly under 650 LOC.
 * 
 * Determines CSS Scroll-driven animation support and autonomous hardware performance tier.
 * Caches results to avoid repeated CSS.supports and WebGL context overhead.
 */

import { PerformanceTier, TierChangeListener } from './types';

export interface CapabilityMatrix {
  viewTimeline: boolean;
  animationRange: boolean;
  scrollTimeline: boolean;
  isNativeReady: boolean;
}

let cachedCapabilities: CapabilityMatrix | null = null;
let cachedTier: PerformanceTier | null = null;

export class ScrollCraftTierStore {
  private static instance: ScrollCraftTierStore | null = null;
  private currentTier: PerformanceTier = 'balanced';
  private listeners: Set<TierChangeListener> = new Set();

  private constructor() {
    this.currentTier = detectPerformanceTier();
    this.syncDomAttribute();
  }

  public static get(): ScrollCraftTierStore {
    if (!ScrollCraftTierStore.instance) {
      ScrollCraftTierStore.instance = new ScrollCraftTierStore();
    }
    return ScrollCraftTierStore.instance;
  }

  public getTier(): PerformanceTier {
    return this.currentTier;
  }

  public setTier(newTier: PerformanceTier): void {
    if (this.currentTier === newTier) return;
    this.currentTier = newTier;
    this.syncDomAttribute();

    for (const listener of this.listeners) {
      try {
        listener(newTier);
      } catch (err) {
        console.error('[ScrollCraft] Tier change listener error:', err);
      }
    }
  }

  private syncDomAttribute(): void {
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.setAttribute('data-scrollcraft-tier', this.currentTier);
    }
  }

  public subscribe(listener: TierChangeListener): () => void {
    this.listeners.add(listener);
    listener(this.currentTier);
    return () => this.listeners.delete(listener);
  }

  public reset(tier?: PerformanceTier): void {
    this.currentTier = tier ?? detectPerformanceTier();
    this.syncDomAttribute();
    this.listeners.clear();
  }
}

export function detectPerformanceTier(): PerformanceTier {
  if (typeof window === 'undefined') {
    return 'balanced';
  }

  if (cachedTier !== null) {
    return cachedTier;
  }

  try {
    // 1. Inspect WebGL Hardware Acceleration status
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      cachedTier = 'low';
      return cachedTier;
    }

    const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)?.toLowerCase() || '';
      // Identify Software Rasterizers
      if (
        renderer.includes('swiftshader') ||
        renderer.includes('llvmpipe') ||
        renderer.includes('software') ||
        renderer.includes('basic render') ||
        renderer.includes('microsoft basic')
      ) {
        cachedTier = 'low';
        return cachedTier;
      }
    }

    // 2. Inspect Hardware Concurrency & Memory
    const cores = navigator.hardwareConcurrency || 4;
    const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory;

    if (cores <= 2 || (memory !== undefined && memory <= 2)) {
      cachedTier = 'low';
      return cachedTier;
    }

    // 3. High Tier: >= 6 cores and hardware-accelerated WebGL
    if (cores >= 6 && (memory === undefined || memory >= 6)) {
      cachedTier = 'high';
      return cachedTier;
    }

    cachedTier = 'balanced';
    return cachedTier;
  } catch {
    cachedTier = 'balanced';
    return cachedTier;
  }
}

export const Capabilities = {
  /**
   * Lazily evaluates and caches browser capabilities.
   */
  get(): CapabilityMatrix {
    if (typeof window === 'undefined' || typeof CSS === 'undefined' || !CSS.supports) {
      return {
        viewTimeline: false,
        animationRange: false,
        scrollTimeline: false,
        isNativeReady: false,
      };
    }

    if (cachedCapabilities !== null) {
      return cachedCapabilities;
    }

    const viewTimeline = CSS.supports('view-timeline-name', '--x');
    const animationRange = CSS.supports('animation-range', 'entry 0% exit 100%');
    const scrollTimeline = CSS.supports('scroll-timeline-name', '--x');

    cachedCapabilities = {
      viewTimeline,
      animationRange,
      scrollTimeline,
      isNativeReady: viewTimeline && animationRange,
    };

    return cachedCapabilities;
  },

  /**
   * Hard resets the cache. Primarily for testing environments.
   */
  reset(): void {
    cachedCapabilities = null;
    cachedTier = null;
    ScrollCraftTierStore.get().reset();
  }
};

export const tierStore = ScrollCraftTierStore.get();
