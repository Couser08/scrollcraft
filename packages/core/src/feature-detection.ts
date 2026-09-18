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
    const cores = typeof navigator !== 'undefined' ? (navigator.hardwareConcurrency || 4) : 4;
    const memory = typeof navigator !== 'undefined' && 'deviceMemory' in navigator ? (navigator as any).deviceMemory : 8;
    const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent || '');
    const isSafari = typeof navigator !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent || '');

    // Low Tier:
    // 1. 2 or fewer cores (budget / legacy devices)
    // 2. 4GB or less system memory (legacy or entry devices)
    // 3. 4 or fewer threads on desktop (e.g. 2015-era dual-core 4-thread laptops)
    if (cores <= 2 || memory <= 4 || (cores <= 4 && !isMobile)) {
      cachedTier = 'low';
      return cachedTier;
    }

    // High Tier: 8 or more cores on desktop non-Safari
    // Safari and mobile devices default conservatively to 'balanced' to prevent GPU layer memory exhaustion
    if (cores >= 8 && !isMobile && !isSafari) {
      cachedTier = 'high';
      return cachedTier;
    }

    // Default to 'balanced'. The Ticker's rolling 60-frame sampler will autonomously
    // self-heal and step down to 'low' if sustained frame drops (<45 FPS) occur.
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

export const tierStore = /* @__PURE__ */ ScrollCraftTierStore.get();
