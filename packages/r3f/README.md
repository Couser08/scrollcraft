# @scrollcraft/r3f

[![Status](https://img.shields.io/badge/status-alpha-red.svg)](https://www.npmjs.com/package/@scrollcraft/r3f)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

React Three Fiber (R3F) Canvas scroll bridge for ScrollCraft.

> **Status: Alpha**  
> `@scrollcraft/r3f` is currently in Alpha. The bridge API provides pull-based scroll metrics synchronization for Three.js without double-pumping RequestAnimationFrame loops or inducing React re-renders.

---

## Installation

```bash
npm install @scrollcraft/r3f
# or
pnpm add @scrollcraft/r3f
```

---

## Usage

Use `useScroll3D` inside a React Three Fiber `<Canvas>` context:

```tsx
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useScroll3D } from '@scrollcraft/r3f';
import type { Mesh } from 'three';

function KineticMesh({ triggerRef }: { triggerRef: React.RefObject<HTMLElement | null> }) {
  const meshRef = useRef<Mesh>(null);
  const { tick } = useScroll3D(triggerRef.current);

  useFrame(() => {
    const { progress, velocity } = tick();
    if (meshRef.current) {
      meshRef.current.rotation.y = progress * Math.PI * 2;
      meshRef.current.rotation.x = velocity * 0.05;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.5, 1]} />
      <meshStandardMaterial wireframe color="#3b82f6" />
    </mesh>
  );
}
```

---

## License

MIT &copy; ScrollCraft Team
