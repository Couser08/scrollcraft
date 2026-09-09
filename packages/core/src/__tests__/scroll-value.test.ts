import { describe, it, expect, vi } from 'vitest';
import { ScrollValue, createScrollValue } from '../scroll-value';

describe('ScrollValue Observable', () => {
  it('initializes with the given value', () => {
    const sv = createScrollValue(42);
    expect(sv.get()).toBe(42);
  });

  it('updates value and notifies subscribers', () => {
    const sv = new ScrollValue(0);
    const callback = vi.fn();

    const unsubscribe = sv.subscribe(callback);
    // Initial call on subscription
    expect(callback).toHaveBeenCalledWith(0);

    sv.set(100);
    expect(sv.get()).toBe(100);
    expect(callback).toHaveBeenCalledWith(100);

    unsubscribe();
    sv.set(200);
    // Should not call after unsubscribe
    expect(callback).not.toHaveBeenCalledWith(200);
  });

  it('skips notifying when setting identical values (zero-allocation)', () => {
    const sv = new ScrollValue(50);
    const callback = vi.fn();

    sv.subscribe(callback);
    expect(callback).toHaveBeenCalledTimes(1);

    sv.set(50); // identical value
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('cleans up on destroy', () => {
    const sv = new ScrollValue(10);
    const callback = vi.fn();

    sv.subscribe(callback);
    sv.destroy();

    sv.set(20);
    expect(callback).toHaveBeenCalledTimes(1); // only initial call
  });
});
