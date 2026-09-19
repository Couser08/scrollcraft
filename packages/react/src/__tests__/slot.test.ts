import { describe, it, expect, vi } from 'vitest';
import { composeRefs, composeEventHandlers } from '../slot';

describe('composeRefs Utility', () => {
  it('calls both callback refs with node', () => {
    const ref1 = vi.fn();
    const ref2 = vi.fn();
    const composed = composeRefs(ref1, ref2);

    const mockNode = {} as HTMLElement;
    composed(mockNode);

    expect(ref1).toHaveBeenCalledWith(mockNode);
    expect(ref2).toHaveBeenCalledWith(mockNode);
  });

  it('updates mutable object refs', () => {
    const objectRef = { current: null as HTMLElement | null };
    const callbackRef = vi.fn();
    const composed = composeRefs(objectRef, callbackRef);

    const mockNode = { tagName: 'DIV' } as HTMLElement;
    composed(mockNode);

    expect(objectRef.current).toBe(mockNode);
    expect(callbackRef).toHaveBeenCalledWith(mockNode);
  });

  it('safely handles undefined and null refs', () => {
    const callbackRef = vi.fn();
    const composed = composeRefs(undefined, null, callbackRef);

    const mockNode = {} as HTMLElement;
    expect(() => composed(mockNode)).not.toThrow();
    expect(callbackRef).toHaveBeenCalledWith(mockNode);
  });

  it('aggregates and calls React 19 ref cleanup functions', () => {
    const cleanup1 = vi.fn();
    const cleanup2 = vi.fn();
    const ref1 = vi.fn().mockReturnValue(cleanup1);
    const ref2 = vi.fn().mockReturnValue(cleanup2);
    const ref3 = vi.fn(); // returns undefined

    const composed = composeRefs(ref1, ref2, ref3);
    const mockNode = {} as HTMLElement;
    const compositeCleanup = composed(mockNode);

    expect(ref1).toHaveBeenCalledWith(mockNode);
    expect(ref2).toHaveBeenCalledWith(mockNode);
    expect(ref3).toHaveBeenCalledWith(mockNode);
    expect(typeof compositeCleanup).toBe('function');

    compositeCleanup?.();
    expect(cleanup1).toHaveBeenCalledTimes(1);
    expect(cleanup2).toHaveBeenCalledTimes(1);
  });
});

describe('composeEventHandlers Utility', () => {
  it('calls both child and slot handlers', () => {
    const childHandler = vi.fn();
    const slotHandler = vi.fn();
    const composed = composeEventHandlers(childHandler, slotHandler);

    const event = { defaultPrevented: false };
    composed(event);

    expect(childHandler).toHaveBeenCalledWith(event);
    expect(slotHandler).toHaveBeenCalledWith(event);
  });

  it('respects defaultPrevented from child handler', () => {
    const childHandler = vi.fn((e: any) => {
      e.defaultPrevented = true;
    });
    const slotHandler = vi.fn();
    const composed = composeEventHandlers(childHandler, slotHandler);

    const event = { defaultPrevented: false };
    composed(event);

    expect(childHandler).toHaveBeenCalledWith(event);
    expect(slotHandler).not.toHaveBeenCalled();
  });
});
