/**
 * High-Performance Direct DOM Transform Writer for ScrollCraft
 * Directly writes transform and opacity styles to elements.
 * Strictly under 650 LOC.
 */

import { ElementTransform } from './types';

const transformCache = new WeakMap<HTMLElement, ElementTransform>();

export class TransformWriter {
  /**
   * Applies 3D hardware-accelerated transform to an HTMLElement
   */
  public static applyTransform(element: HTMLElement, transform: ElementTransform): void {
    const x = transform.x ?? 0;
    const y = transform.y ?? 0;
    const z = transform.z ?? 0;
    const scaleX = transform.scaleX ?? transform.scale ?? 1;
    const scaleY = transform.scaleY ?? transform.scale ?? 1;
    const rotateX = transform.rotateX ?? 0;
    const rotateY = transform.rotateY ?? 0;
    const rotateZ = transform.rotateZ ?? 0;

    const cached = transformCache.get(element);
    if (
      !cached ||
      cached.x !== x ||
      cached.y !== y ||
      cached.z !== z ||
      cached.scaleX !== scaleX ||
      cached.scaleY !== scaleY ||
      cached.rotateX !== rotateX ||
      cached.rotateY !== rotateY ||
      cached.rotateZ !== rotateZ
    ) {
      const transformString = `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scaleX}, ${scaleY})`;
      element.style.transform = transformString;
      transformCache.set(element, { x, y, z, scaleX, scaleY, rotateX, rotateY, rotateZ });
    }

    if (transform.opacity !== undefined && element.style.opacity !== String(transform.opacity)) {
      element.style.opacity = String(transform.opacity);
    }
  }

  /**
   * Sets a custom CSS property on an element
   */
  public static setCssVariable(element: HTMLElement, property: string, value: string | number): void {
    element.style.setProperty(property, String(value));
  }

  /**
   * Prepares element for GPU compositing
   */
  public static promoteToCompositor(element: HTMLElement): void {
    element.style.willChange = 'transform, opacity';
    element.style.backfaceVisibility = 'hidden';
  }

  /**
   * Cleans up GPU promotion when idle
   */
  public static demoteFromCompositor(element: HTMLElement): void {
    element.style.willChange = 'auto';
  }
}

/** Backwards-compatibility alias */
export const DomCompositor = TransformWriter;
export type DomCompositor = TransformWriter;

