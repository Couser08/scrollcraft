/**
 * Lightweight Zero-Allocation Observable ScrollValue
 * Serves as the primitive motion value stream for 120 FPS updates without React re-renders.
 * Strictly under 650 LOC.
 */

import { IScrollValue } from './types';

export class ScrollValue<T = number> implements IScrollValue<T> {
  private value: T;
  private subscribers: Set<(value: T) => void> = new Set();
  private isDestroyed: boolean = false;

  constructor(initialValue: T) {
    this.value = initialValue;
  }

  public get(): T {
    return this.value;
  }

  public set(nextValue: T): void {
    if (this.isDestroyed || this.value === nextValue) return;
    this.value = nextValue;
    this.notify();
  }

  public subscribe(callback: (value: T) => void): () => void {
    if (this.isDestroyed) return () => {};
    this.subscribers.add(callback);
    // Immediately emit current value on subscription
    callback(this.value);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  public destroy(): void {
    this.isDestroyed = true;
    this.subscribers.clear();
  }

  private notify(): void {
    for (const callback of this.subscribers) {
      callback(this.value);
    }
  }
}

export function createScrollValue<T = number>(initialValue: T): ScrollValue<T> {
  return new ScrollValue<T>(initialValue);
}
