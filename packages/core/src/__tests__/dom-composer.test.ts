import { describe, expect, it } from 'vitest';
import { TransformComposer } from '../dom';

describe('TransformComposer', () => {
  it('keeps independently-owned transforms composed and restores the base transform', () => {
    const element = { style: { transform: 'rotate(5deg)' } } as unknown as HTMLElement;

    TransformComposer.set(element, 'parallax', 'translate3d(0, 40px, 0)');
    TransformComposer.set(element, 'magnetic', 'translate3d(4px, 2px, 0)');

    expect(element.style.transform).toContain('rotate(5deg)');
    expect(element.style.transform).toContain('translate3d(0, 40px, 0)');
    expect(element.style.transform).toContain('translate3d(4px, 2px, 0)');

    TransformComposer.clear(element, 'parallax');
    expect(element.style.transform).not.toContain('40px');
    expect(element.style.transform).toContain('4px');

    TransformComposer.clear(element, 'magnetic');
    expect(element.style.transform).toBe('rotate(5deg)');
  });
});
