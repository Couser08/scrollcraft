import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createGSAPBridge } from '../gsap-bridge';

describe('createGSAPBridge', () => {
  let mockEngine: any;
  let mockGSAP: any;
  let mockScrollTrigger: any;
  let mockScroller: any;

  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;

  beforeEach(() => {
    (globalThis as any).window = {
      innerWidth: 1024,
      innerHeight: 768,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    (globalThis as any).document = {
      body: { style: {} },
    };

    mockEngine = {
      subscribe: vi.fn().mockReturnValue(vi.fn()),
      getMetrics: vi.fn().mockReturnValue({ scroll: 150 }),
      scrollTo: vi.fn(),
      resize: vi.fn(),
      onRemeasure: vi.fn().mockReturnValue(vi.fn()),
    };

    mockGSAP = {};

    mockScrollTrigger = {
      update: vi.fn(),
      refresh: vi.fn(),
      scrollerProxy: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      clearScrollTransforms: vi.fn(),
    };

    mockScroller = {
      style: { transform: '' },
    };
  });

  afterEach(() => {
    (globalThis as any).window = originalWindow;
    (globalThis as any).document = originalDocument;
  });

  it('registers scrollerProxy and hooks scroll and resize events', () => {
    const bridge = createGSAPBridge({
      engine: mockEngine,
      gsap: mockGSAP,
      ScrollTrigger: mockScrollTrigger,
      scroller: mockScroller,
      autoUpdate: true,
    });

    expect(mockScrollTrigger.scrollerProxy).toHaveBeenCalledWith(
      mockScroller,
      expect.objectContaining({
        scrollTop: expect.any(Function),
        getBoundingClientRect: expect.any(Function),
        pinType: 'fixed',
      })
    );

    expect(mockEngine.subscribe).toHaveBeenCalled();
    expect(mockScrollTrigger.addEventListener).toHaveBeenCalledWith('refresh', expect.any(Function));
    expect(mockEngine.onRemeasure).toHaveBeenCalled();

    // Verify scrollerProxy getter and setter
    const proxyConfig = mockScrollTrigger.scrollerProxy.mock.calls[0][1];
    expect(proxyConfig.scrollTop()).toBe(150);

    proxyConfig.scrollTop(300);
    expect(mockEngine.scrollTo).toHaveBeenCalledWith(300, { immediate: true });

    // Test rect
    const rect = proxyConfig.getBoundingClientRect();
    expect(rect).toEqual({ top: 0, left: 0, width: 1024, height: 768 });

    bridge.refresh();
    expect(mockScrollTrigger.refresh).toHaveBeenCalled();

    bridge.destroy();
    expect(mockScrollTrigger.removeEventListener).toHaveBeenCalledWith('refresh', expect.any(Function));
    expect(mockScrollTrigger.clearScrollTransforms).toHaveBeenCalledWith(mockScroller);
  });

  it('safely handles missing window or null parameters', () => {
    const bridge = createGSAPBridge({
      engine: null as any,
      gsap: null,
      ScrollTrigger: null,
    });

    expect(bridge).toBeDefined();
    expect(() => bridge.destroy()).not.toThrow();
    expect(() => bridge.refresh()).not.toThrow();
  });
});
