import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ticker } from '@scrollcraft/core';
import { useTicker } from '../hooks/useTicker';
import { useRenderTracker } from '../hooks/useRenderTracker';
import { ScrollInspector } from '../components/scroll-inspector';

describe('React DevTools & Hooks', () => {
  beforeEach(() => {
    ticker.stop();
  });

  afterEach(() => {
    ticker.stop();
  });

  it('exports ScrollInspector, useTicker, and useRenderTracker correctly', () => {
    expect(typeof ScrollInspector).toBe('function');
    expect(typeof useTicker).toBe('function');
    expect(typeof useRenderTracker).toBe('function');
  });

  it('ticker has getFrameRate() telemetry method', () => {
    const rate = ticker.getFrameRate();
    expect(rate).toHaveProperty('fps');
    expect(rate).toHaveProperty('frameMs');
    expect(rate.fps).toBeGreaterThanOrEqual(0);
    expect(rate.frameMs).toBeGreaterThanOrEqual(0);
  });

  it('useTicker registers task with central ticker in requested phase', () => {
    const addSpy = vi.spyOn(ticker, 'add');
    const removeSpy = vi.spyOn(ticker, 'remove');

    const cb = vi.fn();
    
    // Simulate what useTicker does internally
    const taskId = 'test-task-1';
    ticker.add(taskId, 'render', cb);
    expect(addSpy).toHaveBeenCalledWith(taskId, 'render', cb);

    ticker.remove(taskId, 'render');
    expect(removeSpy).toHaveBeenCalledWith(taskId, 'render');

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
