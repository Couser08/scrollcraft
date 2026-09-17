/**
 * ScrollCraft History & Route Scroll Restoration Registry
 * Strictly under 650 LOC.
 *
 * Provides headless, SSR-safe scroll position storage with sessionStorage backing
 * and an LRU eviction policy capped at 50 route records.
 */

const STORAGE_KEY_PREFIX = 'sc_pos:';
const LRU_INDEX_KEY = 'sc_pos_lru';
const MAX_STORED_ROUTES = 50;

export class HistoryRestoreStore {
  private static instance: HistoryRestoreStore | null = null;
  private memoryFallback: Map<string, number> = new Map();
  private isStorageAvailable: boolean = false;

  private constructor() {
    this.isStorageAvailable = this.checkStorageAvailability();
  }

  public static get(): HistoryRestoreStore {
    if (!HistoryRestoreStore.instance) {
      HistoryRestoreStore.instance = new HistoryRestoreStore();
    }
    return HistoryRestoreStore.instance;
  }

  private checkStorageAvailability(): boolean {
    if (typeof window === 'undefined' || !window.sessionStorage) {
      return false;
    }
    try {
      const testKey = '__sc_test__';
      window.sessionStorage.setItem(testKey, '1');
      window.sessionStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Normalizes a route key by trimming whitespace and trailing slashes (except root '/').
   */
  public normalizeKey(rawKey: string): string {
    if (!rawKey) return '/';
    let key = rawKey.trim();
    // Remove origin if absolute URL was passed
    if (key.startsWith('http://') || key.startsWith('https://')) {
      try {
        const url = new URL(key);
        key = `${url.pathname}${url.search}`;
      } catch {
        // Fallback to raw string
      }
    }
    // Collapse trailing slashes before search params
    const qIndex = key.indexOf('?');
    const path = qIndex !== -1 ? key.slice(0, qIndex) : key;
    const search = qIndex !== -1 ? key.slice(qIndex) : '';
    const cleanPath = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
    return `${cleanPath}${search}`;
  }

  /**
   * Saves scroll position for a route key.
   */
  public save(rawKey: string, scrollY: number): void {
    const key = this.normalizeKey(rawKey);
    const roundedY = Math.max(0, Math.round(scrollY));

    if (!this.isStorageAvailable) {
      this.memoryFallback.delete(key);
      this.memoryFallback.set(key, roundedY);
      if (this.memoryFallback.size > MAX_STORED_ROUTES) {
        const oldestKey = this.memoryFallback.keys().next().value;
        if (oldestKey !== undefined) {
          this.memoryFallback.delete(oldestKey);
        }
      }
      return;
    }

    try {
      window.sessionStorage.setItem(`${STORAGE_KEY_PREFIX}${key}`, String(roundedY));
      this.updateLru(key);
    } catch {
      this.memoryFallback.set(key, roundedY);
    }
  }

  /**
   * Retrieves saved scroll position for a route key, or null if none saved.
   */
  public get(rawKey: string): number | null {
    const key = this.normalizeKey(rawKey);

    if (!this.isStorageAvailable) {
      return this.memoryFallback.get(key) ?? null;
    }

    try {
      const val = window.sessionStorage.getItem(`${STORAGE_KEY_PREFIX}${key}`);
      if (val !== null) {
        const parsed = parseFloat(val);
        return isNaN(parsed) ? null : parsed;
      }
      return this.memoryFallback.get(key) ?? null;
    } catch {
      return this.memoryFallback.get(key) ?? null;
    }
  }

  /**
   * Removes saved scroll position for a specific key.
   */
  public remove(rawKey: string): void {
    const key = this.normalizeKey(rawKey);
    this.memoryFallback.delete(key);

    if (this.isStorageAvailable) {
      try {
        window.sessionStorage.removeItem(`${STORAGE_KEY_PREFIX}${key}`);
      } catch {
        // Safe no-op
      }
    }
  }

  /**
   * Clears all saved route scroll positions.
   */
  public clear(): void {
    this.memoryFallback.clear();

    if (this.isStorageAvailable) {
      try {
        const lru = this.getLruKeys();
        for (const k of lru) {
          window.sessionStorage.removeItem(`${STORAGE_KEY_PREFIX}${k}`);
        }
        window.sessionStorage.removeItem(LRU_INDEX_KEY);
      } catch {
        // Safe no-op
      }
    }
  }

  private getLruKeys(): string[] {
    try {
      const raw = window.sessionStorage.getItem(LRU_INDEX_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private updateLru(latestKey: string): void {
    try {
      let lru = this.getLruKeys().filter((k) => k !== latestKey);
      lru.push(latestKey);

      // Evict oldest entries if over limit
      while (lru.length > MAX_STORED_ROUTES) {
        const evicted = lru.shift();
        if (evicted) {
          window.sessionStorage.removeItem(`${STORAGE_KEY_PREFIX}${evicted}`);
        }
      }

      window.sessionStorage.setItem(LRU_INDEX_KEY, JSON.stringify(lru));
    } catch {
      // Safe no-op
    }
  }
}

export const historyStore = /* @__PURE__ */ HistoryRestoreStore.get();
