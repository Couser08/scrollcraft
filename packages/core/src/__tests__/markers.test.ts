import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TriggerRegistry, MarkerManager, ScrollTriggerRecord } from '../index';

describe('TriggerRegistry & MarkerManager', () => {
  let registry: TriggerRegistry;
  let markerMgr: MarkerManager;

  beforeEach(() => {
    registry = TriggerRegistry.get();
    markerMgr = MarkerManager.get();
  });

  afterEach(() => {
    markerMgr.destroy();
  });

  it('maintains singleton instances for both TriggerRegistry and MarkerManager', () => {
    expect(TriggerRegistry.get()).toBe(registry);
    expect(MarkerManager.get()).toBe(markerMgr);
  });

  it('registers, updates, and unregisters scroll triggers', () => {
    const mockElement = {} as Element;
    const record: ScrollTriggerRecord = {
      id: 'test-trigger-1',
      type: 'transform',
      element: mockElement,
      startTrigger: 'top bottom',
      endTrigger: 'bottom top',
      startY: 100,
      endY: 500,
      progress: 0,
      markers: false,
    };

    const listener = vi.fn();
    const unsub = registry.subscribe(listener);

    // Initial subscribe fires immediately with current list
    expect(listener).toHaveBeenCalledTimes(1);

    registry.register(record);
    expect(listener).toHaveBeenCalledTimes(2);
    expect(registry.getAll()).toHaveLength(1);
    expect(registry.getAll()[0].id).toBe('test-trigger-1');

    // Update bounds
    registry.updateBounds('test-trigger-1', 150, 550);
    expect(registry.getAll()[0].startY).toBe(150);
    expect(registry.getAll()[0].endY).toBe(550);

    // Update progress
    registry.updateProgress('test-trigger-1', 0.5);
    expect(registry.getAll()[0].progress).toBe(0.5);

    // Unregister
    registry.unregister('test-trigger-1');
    expect(registry.getAll()).toHaveLength(0);

    unsub();
  });

  it('handles marker lifecycle safely when DOM is present', () => {
    // Mock minimal browser environment
    const createdElements: Array<{ style: Record<string, string>; appendChild: any; remove: any; innerText?: string }> = [];
    const mockBody = {
      appendChild: vi.fn((child) => createdElements.push(child)),
      removeChild: vi.fn(),
    };

    const origDoc = (globalThis as any).document;
    const origWin = (globalThis as any).window;

    (globalThis as any).document = {
      createElement: (tag: string) => {
        const el = {
          tagName: tag.toUpperCase(),
          style: {} as Record<string, string>,
          appendChild: vi.fn(),
          remove: vi.fn(),
          setAttribute: vi.fn(),
          className: '',
          innerText: '',
        };
        createdElements.push(el);
        return el;
      },
      body: mockBody,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    (globalThis as any).window = {
      scrollY: 0,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    try {
      const record: ScrollTriggerRecord = {
        id: 'test-marker-trigger',
        type: 'transform',
        element: {} as Element,
        startTrigger: 'top bottom',
        endTrigger: 'bottom top',
        startY: 200,
        endY: 800,
        progress: 0,
        markers: true,
      };

      markerMgr.addTrigger(record);
      expect(mockBody.appendChild).toHaveBeenCalled();

      // Test updating trigger bounds
      markerMgr.updateTriggerBounds('test-marker-trigger', 250, 850);
      markerMgr.updateTriggerProgress('test-marker-trigger', 0.75);

      // Test removing trigger
      markerMgr.removeTrigger('test-marker-trigger');

      // Test destroy
      markerMgr.destroy();
    } finally {
      (globalThis as any).document = origDoc;
      (globalThis as any).window = origWin;
    }
  });
});
