'use client';

/**
 * Backwards-Compatibility Bridge for Legacy <scroll.*> Proxies
 * Deprecated in favor of semantic primitives (<Parallax>, <Reveal>, <Pin>).
 * Strictly under 650 LOC.
 */

import React, { forwardRef } from 'react';
import { Parallax } from './primitives/parallax';
import { ScrollElementProps } from './types';

type SupportedTag = 'div' | 'section' | 'button' | 'span' | 'h1' | 'h2' | 'p' | 'article' | 'nav' | 'header';

let hasWarnedDeprecation = false;

function createDeprecatedScrollComponent<T extends HTMLElement>(tag: SupportedTag) {
  const Component = forwardRef<T, ScrollElementProps>((props, ref) => {
    if (process.env.NODE_ENV !== 'production' && !hasWarnedDeprecation) {
      hasWarnedDeprecation = true;
      console.warn(
        '[ScrollCraft Deprecation] <scroll.div> and <scroll.*> proxy factories are deprecated. Migrate to <Parallax asChild>, <Reveal asChild>, <Pin asChild>, or pure hooks for optimal performance and composability.'
      );
    }

    const { parallax, pin, spring, magnetic, transform, children, ...domProps } = props;

    if (parallax !== undefined) {
      const speed = typeof parallax === 'number' ? parallax : (parallax.y ?? 0.2);
      return (
        <Parallax speed={speed} {...(domProps as any)} ref={ref}>
          {children}
        </Parallax>
      );
    }

    return React.createElement(tag, { ref, ...domProps }, children);
  });

  Component.displayName = `scroll.${tag}`;
  return Component;
}

const componentCache = new Map<SupportedTag, React.ForwardRefExoticComponent<any>>();

export const scroll = new Proxy({} as Record<SupportedTag, React.ForwardRefExoticComponent<ScrollElementProps & React.RefAttributes<HTMLElement>>>, {
  get: (_, prop: string) => {
    const tag = prop as SupportedTag;
    if (!componentCache.has(tag)) {
      componentCache.set(tag, createDeprecatedScrollComponent(tag));
    }
    return componentCache.get(tag)!;
  },
});
