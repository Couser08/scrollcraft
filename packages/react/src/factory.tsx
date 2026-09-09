'use client';

/**
 * Declarative scroll.* Primitives for React & Next.js
 * Strictly under 650 LOC.
 */

import React, { forwardRef, useEffect, useRef } from 'react';
import { DomCompositor } from '@scrollcraft/core';
import { useScrollCraft } from './context';
import { ScrollElementProps } from './types';

type SupportedTag = 'div' | 'section' | 'button' | 'span' | 'h1' | 'h2' | 'p' | 'article' | 'nav' | 'header';

function createScrollComponent<T extends HTMLElement>(tag: SupportedTag) {
  const Component = forwardRef<T, ScrollElementProps>(({
    children,
    parallax,
    pin,
    style,
    transform,
    className,
    ...props
  }, forwardedRef) => {
    const internalRef = useRef<T | null>(null);
    const { metrics } = useScrollCraft();

    useEffect(() => {
      const element = internalRef.current;
      if (!element) return;

      DomCompositor.promoteToCompositor(element);

      // Handle parallax calculation directly on GPU compositor layer
      if (parallax !== undefined) {
        const factor = typeof parallax === 'number' ? parallax : (parallax.y ?? 0.2);
        const yOffset = -metrics.current * factor;
        DomCompositor.applyTransform(element, {
          y: yOffset,
          ...transform,
        });
      } else if (transform) {
        DomCompositor.applyTransform(element, transform);
      }

      return () => {
        DomCompositor.demoteFromCompositor(element);
      };
    }, [metrics.current, parallax, transform]);

    const handleRef = (node: T | null) => {
      internalRef.current = node;
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<T | null>).current = node;
      }
    };

    return React.createElement(
      tag,
      {
        ref: handleRef,
        className,
        style,
        ...props,
      },
      children
    );
  });

  Component.displayName = `scroll.${tag}`;
  return Component;
}

const componentCache = new Map<SupportedTag, React.ForwardRefExoticComponent<any>>();

export const scroll = new Proxy({} as Record<SupportedTag, React.ForwardRefExoticComponent<ScrollElementProps & React.RefAttributes<HTMLElement>>>, {
  get: (_, prop: string) => {
    const tag = prop as SupportedTag;
    if (!componentCache.has(tag)) {
      componentCache.set(tag, createScrollComponent(tag));
    }
    return componentCache.get(tag)!;
  },
});
