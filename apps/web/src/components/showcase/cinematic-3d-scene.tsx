'use client';
import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Preload, useGLTF } from '@react-three/drei';
import { Bloom, DepthOfField, EffectComposer, Vignette, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';

function useDeviceTier() {
  return useMemo(() => {
    if (typeof navigator === 'undefined') return 'high';
    const cores = navigator.hardwareConcurrency ?? 4;
    const memory = (navigator as any).deviceMemory ?? 4;
    if (cores >= 8 && memory >= 8) return 'high';
    if (cores >= 4 && memory >= 4) return 'mid';
    return 'low';
  }, []);
}

const MODELS = [
  '/models/scene1.glb',
  '/models/scene2.glb',
  '/models/scene3.glb',
  '/models/scene4.glb',
  '/models/scene5.glb',
  '/models/scene6.glb',
];

MODELS.forEach((path) => {
  try {
    useGLTF.preload(path);
  } catch (e) {
    console.warn(`Could not preload ${path}`);
  }
});

function CrossfadingScenes({ progress }: { progress: number }) {
  const activeIndexFloat = progress * 5;
  return (
    <group>
      {MODELS.map((path, idx) => (
        <SceneModel 
          key={path} 
          path={path} 
          index={idx} 
          activeIndexFloat={activeIndexFloat} 
        />
      ))}
    </group>
  );
}

function SceneModel({ path, index, activeIndexFloat }: { path: string, index: number, activeIndexFloat: number }) {
  let gltf;
  try {
    gltf = useGLTF(path);
  } catch (e) {
    return null; // Graceful fallback
  }

  const groupRef = useRef<THREE.Group>(null);
  const clonedScene = useMemo(() => gltf.scene.clone(), [gltf.scene]);

  useFrame(() => {
    if (!groupRef.current) return;
    const distance = Math.abs(activeIndexFloat - index);
    const targetOpacity = Math.max(0, 1 - distance);
    
    groupRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const material = (child as THREE.Mesh).material;
        if (Array.isArray(material)) {
          material.forEach(m => {
            m.transparent = true;
            m.opacity = THREE.MathUtils.lerp(m.opacity || 0, targetOpacity, 0.1);
          });
        } else {
          material.transparent = true;
          material.opacity = THREE.MathUtils.lerp(material.opacity || 0, targetOpacity, 0.1);
        }
      }
    });

    const yOffset = (distance * -2);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, yOffset, 0.1);
    groupRef.current.visible = targetOpacity > 0.01;
  });

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} />
    </group>
  );
}

function CameraRig({ progress }: { progress: number }) {
  const { camera } = useThree();
  useFrame(() => {
    const targetX = Math.sin(progress * Math.PI) * 5;
    const targetY = 2 + (progress * 4);
    const targetZ = 12 - (progress * 4);
    
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
    camera.lookAt(new THREE.Vector3(0, 2 + (progress * 2), 0));
  });
  return null;
}

function SceneContents({ tier, progress }: { tier: string, progress: number }) {
  const { scene } = useThree();
  useEffect(() => {
    scene.fog = new THREE.FogExp2('#a9c4d1', 0.02);
    return () => { scene.fog = null; };
  }, [scene]);

  return (
    <>
      <Environment preset="sunset" background={false} environmentIntensity={1.2} />
      <directionalLight position={[10, 20, 8]} intensity={2.2} castShadow={tier !== 'low'} shadow-mapSize={tier === 'high' ? [2048, 2048] : [1024, 1024]} />
      <directionalLight position={[-8, 4, -10]} intensity={0.5} color="#8fb8ff" />
      <CrossfadingScenes progress={progress} />
      <CameraRig progress={progress} />
      <EffectComposer>
        {tier !== 'low' && <Bloom intensity={0.5} luminanceThreshold={0.8} luminanceSmoothing={0.3} mipmapBlur />}
        {tier === 'high' && <DepthOfField focusDistance={0.02} focalLength={0.05} bokehScale={1.5} />}
        {tier !== 'low' && <Vignette eskil={false} offset={0.1} darkness={0.4} />}
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </>
  );
}

interface Cinematic3DSceneProps {
  scrollProgress?: number;
  className?: string;
  showWireframe?: boolean;
}

export const Cinematic3DScene: React.FC<Cinematic3DSceneProps> = ({ scrollProgress = 0, className = '' }) => {
  const tier = useDeviceTier();
  const dpr = tier === 'high' ? [1, 2] : tier === 'mid' ? [1, 1.5] : [1, 1];

  return (
    <div className={`relative w-full h-full overflow-hidden select-none bg-gradient-to-b from-[#090b12] via-[#05070c] to-[#090b12] ${className}`}>
      <Canvas shadows={tier !== 'low'} dpr={dpr as [number, number]} camera={{ position: [0, 2, 12], fov: 45 }} gl={{ toneMapping: THREE.NoToneMapping }}>
        <SceneContents tier={tier} progress={scrollProgress} />
        <Preload all />
      </Canvas>
    </div>
  );
};
