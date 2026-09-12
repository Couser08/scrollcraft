import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { GlobalVisibilityManager } from '../visibility';

describe('GlobalVisibilityManager', () => {
  let manager: GlobalVisibilityManager;

  beforeEach(() => {
    manager = GlobalVisibilityManager.get();
  });

  afterEach(() => {
    manager.destroy();
  });

  it('maintains a single shared singleton instance', () => {
    const instanceA = GlobalVisibilityManager.get();
    const instanceB = GlobalVisibilityManager.get();
    expect(instanceA).toBe(instanceB);
  });

  it('synchronously reports visibility state and registers callbacks in non-DOM environment', () => {
    const element = {} as Element;

    let called = false;
    const unsub = manager.observe(element, (isVisible) => {
      called = true;
      expect(isVisible).toBe(true);
    });

    expect(called).toBe(true);
    unsub();
  });

  it('unobserve cleanly removes listeners', () => {
    const element = {} as Element;

    const cb = vi.fn();
    manager.observe(element, cb);
    expect(cb).toHaveBeenCalledTimes(1);

    manager.unobserve(element, cb);
    manager.flush();
    expect(cb).toHaveBeenCalledTimes(1);
  });
});
