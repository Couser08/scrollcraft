'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SceneProps {
  scrollRef: React.RefObject<{ progress: number; velocity: number }>;
  autoRotate: boolean;
}

function SceneMeshes({ scrollRef, autoRotate }: SceneProps) {
  const centerMeshRef = useRef<THREE.Mesh>(null!);
  const cube1Ref = useRef<THREE.Mesh>(null!);
  const cube2Ref = useRef<THREE.Mesh>(null!);
  
  // Interpolated smooth values to guarantee zero-jitter physics
  const baseAngle = useRef(0);
  const smoothedProgress = useRef(0);

  useFrame((_, delta) => {
    // 1. Gentle continuous idle spin when autoRotate is on
    if (autoRotate) {
      baseAngle.current += delta * 0.35;
    }

    // 2. Smooth exponential lerp toward target scroll progress (dampens any abrupt scroll step)
    const targetProgress = scrollRef.current?.progress ?? 0;
    smoothedProgress.current += (targetProgress - smoothedProgress.current) * 0.08;

    // 3. Combined angle for the central cube
    const currentAngle = baseAngle.current + smoothedProgress.current * Math.PI * 2;

    // 4. Central Glowing Coral Cube: smooth rotation with gentle breathing float
    if (centerMeshRef.current) {
      centerMeshRef.current.rotation.y = currentAngle;
      centerMeshRef.current.rotation.x = 0.38 + Math.sin(currentAngle * 0.5) * 0.04;
      centerMeshRef.current.rotation.z = Math.cos(currentAngle * 0.5) * 0.03;
      // Ultra-gentle breathing float along Y (0.05 max, perfectly stable)
      centerMeshRef.current.position.y = Math.sin(baseAngle.current * 0.8) * 0.06;
    }

    // 5. Metallic Cube 1 (Upper Left): stable position with graceful slow drift
    if (cube1Ref.current) {
      cube1Ref.current.rotation.x = 0.4 + baseAngle.current * 0.15;
      cube1Ref.current.rotation.y = 0.6 + baseAngle.current * 0.2;
      cube1Ref.current.position.y = 1.3 + Math.sin(baseAngle.current * 0.7) * 0.05;
    }

    // 6. Metallic Cube 2 (Lower Right): stable position with graceful slow drift
    if (cube2Ref.current) {
      cube2Ref.current.rotation.x = 0.2 + baseAngle.current * 0.18;
      cube2Ref.current.rotation.z = -0.3 + baseAngle.current * 0.12;
      cube2Ref.current.position.y = -1.2 + Math.cos(baseAngle.current * 0.6) * 0.05;
    }
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-5, -4, -3]} intensity={0.5} color="#60a5fa" />

      {/* Central coral glowing point light */}
      <pointLight position={[0, 0, 1.5]} intensity={3.5} distance={8} color="#ff4d6d" />

      {/* Central Glowing Pink-Red Cube */}
      <mesh ref={centerMeshRef} position={[0, 0, 0]}>
        <boxGeometry args={[1.55, 1.55, 1.55]} />
        <meshStandardMaterial
          color="#ff4d6d"
          emissive="#ff2a55"
          emissiveIntensity={0.35}
          roughness={0.15}
          metalness={0.1}
        />
      </mesh>

      {/* Vertical Light Beam passing through center */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 10, 8]} />
        <meshBasicMaterial color="#ff4d6d" transparent opacity={0.35} />
      </mesh>

      {/* Fixed Tilted Orbit Ring */}
      <mesh rotation={[Math.PI / 2.7, 0, 0.2]}>
        <torusGeometry args={[3.2, 0.012, 16, 120]} />
        <meshBasicMaterial color="#71717a" transparent opacity={0.25} />
      </mesh>

      {/* Orbiting Metallic Cube 1 (Upper Left) */}
      <mesh ref={cube1Ref} position={[-2.4, 1.3, -0.6]} scale={0.65}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#52525b"
          roughness={0.3}
          metalness={0.85}
        />
      </mesh>

      {/* Orbiting Metallic Cube 2 (Lower Right) */}
      <mesh ref={cube2Ref} position={[2.5, -1.2, 0.5]} scale={0.6}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#52525b"
          roughness={0.3}
          metalness={0.85}
        />
      </mesh>
    </>
  );
}

export default function R3FCanvasStage({ scrollRef, autoRotate }: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.8], fov: 45 }}
      className="w-full h-full"
      gl={{ antialias: true, alpha: true }}
    >
      <SceneMeshes scrollRef={scrollRef} autoRotate={autoRotate} />
    </Canvas>
  );
}
