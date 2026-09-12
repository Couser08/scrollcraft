import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Ticker, MIN_DELTA_TIME, MAX_DELTA_TIME } from '../ticker';

describe('Ticker Engine Core & Lifecycle', () => {
  let ticker: Ticker;
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;
  const originalRaf = globalThis.requestAnimationFrame;
  const originalCancelRaf = globalThis.cancelAnimationFrame;
  const originalPerformance = globalThis.performance;

  let rafQueue: FrameRequestCallback[] = [];
  let currentTime = 1000;

  beforeEach(() => {
    rafQueue = [];
    currentTime = 1000;

    Object.assign(globalThis, {
      window: {
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      },
      document: {
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        hidden: false,
      },
      performance: {
        now: () => currentTime,
      },
      requestAnimationFrame: (cb: FrameRequestCallback) => {
        rafQueue.push(cb);
        return rafQueue.length;
      },
      cancelAnimationFrame: vi.fn(),
    });

    ticker = Ticker.get();
  });

  afterEach(() => {
    ticker.stop();
    ticker.setErrorHandler(null);
    ticker.remove('test-measure');
    ticker.remove('test-update');
    ticker.remove('test-render');
    ticker.remove('multi-phase');

    Object.assign(globalThis, {
      window: originalWindow,
      document: originalDocument,
      performance: originalPerformance,
      requestAnimationFrame: originalRaf,
      cancelAnimationFrame: originalCancelRaf,
    });
  });

  const stepFrame = (dtMs: number = 16) => {
    currentTime += dtMs;
    const cb = rafQueue.shift();
    if (cb) cb(currentTime);
  };

  it('allows registering both update and render tasks under the SAME id without collision', () => {
    const updateSpy = vi.fn();
    const renderSpy = vi.fn();

    ticker.add('multi-phase', 'update', updateSpy);
    ticker.add('multi-phase', 'render', renderSpy);

    stepFrame(16);

    expect(updateSpy).toHaveBeenCalledOnce();
    expect(renderSpy).toHaveBeenCalledOnce();

    // Removing without phase removes from all phases
    ticker.remove('multi-phase');
    stepFrame(16);

    expect(updateSpy).toHaveBeenCalledOnce(); // No further calls
    expect(renderSpy).toHaveBeenCalledOnce();
  });

  it('allows selective phase removal when phase argument is provided', () => {
    const updateSpy = vi.fn();
    const renderSpy = vi.fn();

    ticker.add('selective', 'update', updateSpy);
    ticker.add('selective', 'render', renderSpy);

    ticker.remove('selective', 'update');
    stepFrame(16);

    expect(updateSpy).not.toHaveBeenCalled();
    expect(renderSpy).toHaveBeenCalledOnce();

    ticker.remove('selective');
  });

  it('strictly executes phases in order: Measure -> Update -> Render', () => {
    const executionOrder: string[] = [];

    ticker.add('phase-render', 'render', () => executionOrder.push('render'));
    ticker.add('phase-measure', 'measure', () => executionOrder.push('measure'));
    ticker.add('phase-update', 'update', () => executionOrder.push('update'));

    stepFrame(16);

    expect(executionOrder).toEqual(['measure', 'update', 'render']);

    ticker.remove('phase-render');
    ticker.remove('phase-measure');
    ticker.remove('phase-update');
  });

  it('executes tasks added in Phase 1 (measure) during Phase 2/3 of the SAME frame', () => {
    let updateExecuted = false;

    ticker.add('dynamic-parent', 'measure', () => {
      ticker.add('dynamic-child', 'update', () => {
        updateExecuted = true;
      });
    });

    stepFrame(16);

    expect(updateExecuted).toBe(true);

    ticker.remove('dynamic-parent');
    ticker.remove('dynamic-child');
  });

  it('safely skips a task removed by an earlier sibling during the same phase', () => {
    const siblingSpy = vi.fn();

    ticker.add('remover', 'update', () => {
      ticker.remove('victim', 'update');
    });
    ticker.add('victim', 'update', siblingSpy);

    stepFrame(16);

    expect(siblingSpy).not.toHaveBeenCalled();

    ticker.remove('remover');
    ticker.remove('victim');
  });

  it('clamps deltaTime to between 1ms and 33ms', () => {
    let capturedDt = 0;
    ticker.add('dt-probe', 'update', (dt) => {
      capturedDt = dt;
    });

    // Sub-millisecond tick (e.g. 0.1ms)
    stepFrame(0.1);
    expect(capturedDt).toBeCloseTo(MIN_DELTA_TIME, 4);

    // Huge 5-second tick (tab resume / lag spike)
    stepFrame(5000);
    expect(capturedDt).toBeCloseTo(MAX_DELTA_TIME, 4);

    ticker.remove('dt-probe');
  });

  it('reports errors through error handler without stopping subsequent tasks or loop', () => {
    const errorHandler = vi.fn();
    const survivor = vi.fn();

    ticker.setErrorHandler(errorHandler);
    ticker.add('faulty', 'update', () => {
      throw new Error('boom');
    });
    ticker.add('survivor', 'update', survivor);

    stepFrame(16);

    expect(errorHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'faulty',
        phase: 'update',
      })
    );
    expect(survivor).toHaveBeenCalledOnce();

    ticker.remove('faulty');
    ticker.remove('survivor');
  });

  it('stops RAF loop when all tasks are removed', () => {
    ticker.add('t1', 'update', () => {});
    ticker.add('t2', 'render', () => {});

    expect(rafQueue.length).toBeGreaterThan(0);

    ticker.remove('t1');
    ticker.remove('t2');

    // After removing all tasks, ticker stops
    stepFrame(16);
    expect(rafQueue.length).toBe(0);
  });
});
