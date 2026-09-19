'use client';

/**
 * Bespoke Zero-Dependency Slot Primitive for asChild Composition
 * Implements Radix-grade composeRefs and non-destructive style & className merging.
 * Strictly under 650 LOC.
 */

import React, { forwardRef, cloneElement, isValidElement, ReactNode, CSSProperties } from 'react';

export type PossibleRef<T> = React.Ref<T> | undefined;

/**
 * Composes multiple React refs into a single callback ref.
 * Fully supports React 19 ref cleanup return functions.
 */
export function composeRefs<T>(...refs: PossibleRef<T>[]): (node: T | null) => (() => void) | void {
  return (node: T | null) => {
    let cleanups: (() => void)[] | null = null;

    for (let i = 0; i < refs.length; i++) {
      const ref = refs[i];
      if (!ref) continue;
      if (typeof ref === 'function') {
        const cleanup = ref(node);
        if (typeof cleanup === 'function') {
          if (!cleanups) cleanups = [];
          cleanups.push(cleanup);
        }
      } else {
        (ref as React.MutableRefObject<T | null>).current = node;
      }
    }

    if (cleanups && cleanups.length > 0) {
      return () => {
        for (let i = 0; i < cleanups!.length; i++) {
          cleanups![i]();
        }
      };
    }
  };
}

/**
 * Composes two event handlers so both execute cleanly without overwriting.
 */
export function composeEventHandlers<E>(
  originalHandler?: (event: E) => void,
  ourHandler?: (event: E) => void,
  { checkForDefaultPrevented = true } = {}
) {
  return (event: E) => {
    originalHandler?.(event);

    if (
      checkForDefaultPrevented === false ||
      !(event as unknown as React.SyntheticEvent)?.defaultPrevented
    ) {
      ourHandler?.(event);
    }
  };
}

export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export const Slot = forwardRef<HTMLElement, SlotProps>((props, forwardedRef) => {
  const { children, ...slotProps } = props;

  if (!isValidElement(children)) {
    return null;
  }

  const child = children as React.ReactElement<Record<string, any>>;
  // React 19 exposes refs through props. React 18 still needs element.ref, but
  // only access that legacy field on React 18 to avoid React 19 deprecation noise.
  const propsRef = (child.props as Record<string, any>)?.ref;
  const majorVersion = parseInt(React.version, 10);
  const childRef = propsRef ?? (majorVersion >= 19 ? undefined : (child as any).ref);

  // Merge style non-destructively
  const mergedStyle: CSSProperties = {
    ...(child.props.style || {}),
    ...(slotProps.style || {}),
  };

  // Merge className non-destructively
  const mergedClassName = [child.props.className, slotProps.className]
    .filter(Boolean)
    .join(' ');

  // Base merged props
  const mergedProps: Record<string, any> = {
    ...child.props,
    ...slotProps,
  };

  // Compose all event handlers non-destructively
  for (const propName in slotProps) {
    if (propName.startsWith('on') && typeof (slotProps as Record<string, any>)[propName] === 'function') {
      const slotHandler = (slotProps as Record<string, any>)[propName];
      const childHandler = child.props[propName];
      if (typeof childHandler === 'function') {
        mergedProps[propName] = composeEventHandlers(childHandler, slotHandler);
      }
    }
  }

  mergedProps.style = Object.keys(mergedStyle).length > 0 ? mergedStyle : undefined;
  mergedProps.className = mergedClassName || undefined;
  
  const mergedRef = React.useMemo(() => {
    if (!forwardedRef && !childRef) return undefined;
    return composeRefs(childRef, forwardedRef);
  }, [childRef, forwardedRef]);

  mergedProps.ref = mergedRef;

  return cloneElement(child, mergedProps);
});

Slot.displayName = 'Slot';
