/**
 * ScrollCraft Trigger Registry & Visual Markers Manager
 * Coordinates debug trigger telemetry and GSAP-style visual marker lines.
 * Strictly under 650 LOC.
 */

import { ScrollTriggerRecord, TriggerRegistryListener } from './types';
import { ticker } from './ticker';

export class TriggerRegistry {
  private static instance: TriggerRegistry | null = null;
  private triggers = new Map<string, ScrollTriggerRecord>();
  private listeners = new Set<TriggerRegistryListener>();

  private constructor() {}

  public static get(): TriggerRegistry {
    if (!TriggerRegistry.instance) {
      TriggerRegistry.instance = new TriggerRegistry();
    }
    return TriggerRegistry.instance;
  }

  public register(record: ScrollTriggerRecord): void {
    this.triggers.set(record.id, record);
    if (record.markers) {
      markerManager.addTrigger(record);
    }
    this.notify();
  }

  public updateBounds(id: string, startY: number, endY: number): void {
    const record = this.triggers.get(id);
    if (!record) return;
    record.startY = startY;
    record.endY = endY;
    if (record.markers) {
      markerManager.updateTriggerBounds(id, startY, endY);
    }
    this.notify();
  }

  public updateProgress(id: string, progress: number): void {
    const record = this.triggers.get(id);
    if (!record) return;
    record.progress = progress;
    if (record.markers) {
      markerManager.updateTriggerProgress(id, progress);
    }
  }

  public unregister(id: string): void {
    const record = this.triggers.get(id);
    if (record?.markers) {
      markerManager.removeTrigger(id);
    }
    this.triggers.delete(id);
    this.notify();
  }

  public getAll(): ScrollTriggerRecord[] {
    return Array.from(this.triggers.values());
  }

  public subscribe(listener: TriggerRegistryListener): () => void {
    this.listeners.add(listener);
    listener(this.getAll());
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    if (this.listeners.size === 0) return;
    const all = this.getAll();
    for (const listener of this.listeners) {
      try {
        listener(all);
      } catch (err) {
        console.error('[ScrollCraft] TriggerRegistry listener error:', err);
      }
    }
  }
}

export const triggerRegistry = TriggerRegistry.get();

interface MarkerElements {
  startLine: HTMLElement;
  startTag: HTMLElement;
  endLine: HTMLElement;
  endTag: HTMLElement;
  record: ScrollTriggerRecord;
}

export class MarkerManager {
  private static instance: MarkerManager | null = null;
  private root: HTMLElement | null = null;
  private markers = new Map<string, MarkerElements>();
  private isRendering = false;
  private isGlobalMarkersEnabled = false;

  private constructor() {}

  public static get(): MarkerManager {
    if (!MarkerManager.instance) {
      MarkerManager.instance = new MarkerManager();
    }
    return MarkerManager.instance;
  }

  public setGlobalMarkers(enabled: boolean): void {
    this.isGlobalMarkersEnabled = enabled;
    const triggers = triggerRegistry.getAll();
    for (const trigger of triggers) {
      if (enabled) {
        this.addTrigger(trigger);
      } else if (!trigger.markers) {
        this.removeTrigger(trigger.id);
      }
    }
  }

  public isGlobalEnabled(): boolean {
    return this.isGlobalMarkersEnabled;
  }

  private ensureRoot(): HTMLElement | null {
    if (typeof document === 'undefined') return null;
    if (!this.root) {
      this.root = document.createElement('div');
      this.root.id = 'scrollcraft-markers-root';
      this.root.setAttribute('aria-hidden', 'true');
      this.root.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 999999;
        overflow: hidden;
      `;
      document.body.appendChild(this.root);
    }
    return this.root;
  }

  public addTrigger(record: ScrollTriggerRecord): void {
    if (typeof window === 'undefined') return;
    if (!record.markers && !this.isGlobalMarkersEnabled) return;
    if (this.markers.has(record.id)) return;

    const root = this.ensureRoot();
    if (!root) return;

    // Start Marker (Green)
    const startLine = document.createElement('div');
    startLine.className = 'sc-marker sc-marker-start';
    startLine.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 0;
      border-top: 1.5px dashed #22c55e;
      will-change: transform;
    `;

    const startTag = document.createElement('div');
    startTag.style.cssText = `
      position: absolute;
      left: 16px;
      top: -11px;
      background: #22c55e;
      color: #000;
      font-family: monospace;
      font-size: 10px;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 4px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
      white-space: nowrap;
    `;
    startTag.innerText = `start ${record.id} (${Math.round(record.startY)}px)`;
    startLine.appendChild(startTag);
    root.appendChild(startLine);

    // End Marker (Red)
    const endLine = document.createElement('div');
    endLine.className = 'sc-marker sc-marker-end';
    endLine.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 0;
      border-top: 1.5px dashed #ef4444;
      will-change: transform;
    `;

    const endTag = document.createElement('div');
    endTag.style.cssText = `
      position: absolute;
      left: 16px;
      top: -11px;
      background: #ef4444;
      color: #fff;
      font-family: monospace;
      font-size: 10px;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 4px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
      white-space: nowrap;
    `;
    endTag.innerText = `end ${record.id} (${Math.round(record.endY)}px)`;
    endLine.appendChild(endTag);
    root.appendChild(endLine);

    this.markers.set(record.id, { startLine, startTag, endLine, endTag, record });
    this.ensureTicker();
    this.render();
  }

  public updateTriggerBounds(id: string, startY: number, endY: number): void {
    const item = this.markers.get(id);
    if (!item) return;
    item.record.startY = startY;
    item.record.endY = endY;
    item.startTag.innerText = `start ${id} (${Math.round(startY)}px)`;
    item.endTag.innerText = `end ${id} (${Math.round(endY)}px)`;
  }

  public updateTriggerProgress(id: string, progress: number): void {
    const item = this.markers.get(id);
    if (!item) return;
    item.record.progress = progress;
  }

  public removeTrigger(id: string): void {
    const item = this.markers.get(id);
    if (!item) return;

    item.startLine.remove();
    item.endLine.remove();
    this.markers.delete(id);

    if (this.markers.size === 0) {
      this.stopTicker();
      if (this.root) {
        this.root.remove();
        this.root = null;
      }
    }
  }

  private ensureTicker(): void {
    if (this.isRendering) return;
    this.isRendering = true;
    ticker.add('sc-marker-manager', 'render', () => this.render());
  }

  private stopTicker(): void {
    if (!this.isRendering) return;
    this.isRendering = false;
    ticker.remove('sc-marker-manager');
  }

  private render(): void {
    if (typeof window === 'undefined' || this.markers.size === 0) return;
    const scrollY = window.scrollY || window.pageYOffset;

    for (const item of this.markers.values()) {
      const startRel = item.record.startY - scrollY;
      const endRel = item.record.endY - scrollY;

      item.startLine.style.transform = `translate3d(0, ${startRel.toFixed(1)}px, 0)`;
      item.endLine.style.transform = `translate3d(0, ${endRel.toFixed(1)}px, 0)`;
    }
  }

  public destroy(): void {
    this.stopTicker();
    for (const item of this.markers.values()) {
      item.startLine.remove();
      item.endLine.remove();
    }
    this.markers.clear();
    if (this.root) {
      this.root.remove();
      this.root = null;
    }
    MarkerManager.instance = null;
  }
}

export const markerManager = MarkerManager.get();
