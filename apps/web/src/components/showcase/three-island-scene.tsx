'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeIslandSceneProps {
  scrollProgress?: number;
  className?: string;
  showWireframe?: boolean;
}

export const ThreeIslandScene: React.FC<ThreeIslandSceneProps> = ({
  scrollProgress = 0,
  className = '',
  showWireframe = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const islandGroupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const progressRef = useRef(scrollProgress);
  progressRef.current = scrollProgress;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 4, 14);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff5e6, 2.5);
    sunLight.position.set(10, 20, 15);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    rimLight.position.set(-10, -10, -10);
    scene.add(rimLight);

    const coreLight = new THREE.PointLight(0x38bdf8, 2, 20);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // 4. Build Island Group
    const islandGroup = new THREE.Group();
    islandGroupRef.current = islandGroup;
    scene.add(islandGroup);

    // Island Base (Inverted Mountain Rock)
    const baseGeo = new THREE.ConeGeometry(4.5, 6, 9);
    baseGeo.rotateX(Math.PI);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.85,
      metalness: 0.15,
      flatShading: true,
      wireframe: showWireframe,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -1.2;
    islandGroup.add(baseMesh);

    // Island Top Plateau (Lush Green Grass)
    const topGeo = new THREE.CylinderGeometry(4.6, 4.3, 0.8, 9);
    const topMat = new THREE.MeshStandardMaterial({
      color: 0x15803d,
      roughness: 0.6,
      metalness: 0.1,
      flatShading: true,
      wireframe: showWireframe,
    });
    const topMesh = new THREE.Mesh(topGeo, topMat);
    topMesh.position.y = 1.8;
    islandGroup.add(topMesh);

    // Secondary Upper Meadow Hill
    const meadowGeo = new THREE.CylinderGeometry(2.8, 3.4, 0.6, 7);
    const meadowMat = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      roughness: 0.5,
      flatShading: true,
      wireframe: showWireframe,
    });
    const meadowMesh = new THREE.Mesh(meadowGeo, meadowMat);
    meadowMesh.position.set(-0.3, 2.3, -0.4);
    islandGroup.add(meadowMesh);

    // Procedural Low-Poly Pine Trees
    const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9, flatShading: true });
    const treeFoliageMat1 = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.6, flatShading: true });
    const treeFoliageMat2 = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.6, flatShading: true });

    const createTree = (x: number, z: number, scale: number = 1) => {
      const tree = new THREE.Group();
      tree.position.set(x, 2.1, z);
      tree.scale.set(scale, scale, scale);

      // Trunk
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 0.8, 5), treeTrunkMat);
      trunk.position.y = 0.4;
      tree.add(trunk);

      // Tier 1 Cone
      const cone1 = new THREE.Mesh(new THREE.ConeGeometry(0.8, 1.1, 5), treeFoliageMat1);
      cone1.position.y = 1.1;
      tree.add(cone1);

      // Tier 2 Cone
      const cone2 = new THREE.Mesh(new THREE.ConeGeometry(0.6, 0.9, 5), treeFoliageMat2);
      cone2.position.y = 1.7;
      tree.add(cone2);

      // Tier 3 Cone
      const cone3 = new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.7, 5), treeFoliageMat1);
      cone3.position.y = 2.2;
      tree.add(cone3);

      islandGroup.add(tree);
    };

    // Plant trees across island surface
    createTree(-1.2, -0.5, 1.1);
    createTree(1.4, 0.8, 0.95);
    createTree(0.2, -1.5, 1.25);
    createTree(-1.8, 1.0, 0.85);
    createTree(1.8, -0.8, 0.9);
    createTree(-0.5, 1.4, 0.75);

    // Cascading Water Ribbon
    const waterGeo = new THREE.BoxGeometry(0.7, 4.5, 0.15);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.85,
    });
    const waterfall = new THREE.Mesh(waterGeo, waterMat);
    waterfall.position.set(2.2, 0.2, 2.4);
    waterfall.rotation.x = 0.15;
    waterfall.rotation.z = -0.1;
    islandGroup.add(waterfall);

    // Orbiting Floating Crystals & Rocks
    const crystalGeo = new THREE.OctahedronGeometry(0.4, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0x60a5fa,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0x2563eb,
      emissiveIntensity: 0.4,
      flatShading: true,
    });

    const rocks: THREE.Mesh[] = [];
    for (let i = 0; i < 6; i++) {
      const crystal = new THREE.Mesh(crystalGeo, crystalMat);
      const angle = (i / 6) * Math.PI * 2;
      const radius = 5.2 + Math.random() * 1.5;
      crystal.position.set(Math.cos(angle) * radius, (Math.random() - 0.5) * 3, Math.sin(angle) * radius);
      crystal.scale.setScalar(0.5 + Math.random() * 0.6);
      islandGroup.add(crystal);
      rocks.push(crystal);
    }

    // 5. Spore Particles / Atmospheric Glow
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 18;
      positions[i + 1] = (Math.random() - 0.5) * 12;
      positions[i + 2] = (Math.random() - 0.5) * 18;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.12,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    particlesRef.current = particles;
    scene.add(particles);

    // 6. Animation Loop (Pull-based, synchronized with scroll)
    let reqId: number;
    let clock = new THREE.Clock();

    const renderLoop = () => {
      const elapsed = clock.getElapsedTime();
      const p = progressRef.current;

      if (islandGroup) {
        // Continuous subtle float + scrub-linked rotation
        const targetRotY = p * Math.PI * 2 + elapsed * 0.15;
        islandGroup.rotation.y = THREE.MathUtils.lerp(islandGroup.rotation.y, targetRotY, 0.08);
        islandGroup.rotation.x = Math.sin(elapsed * 0.8) * 0.08 + (p - 0.5) * 0.3;
        islandGroup.position.y = Math.sin(elapsed * 1.2) * 0.25 - (p - 0.5) * 1.2;

        // Animate floating crystals
        rocks.forEach((r, idx) => {
          r.rotation.x += 0.01;
          r.rotation.y += 0.015;
          r.position.y += Math.sin(elapsed * 1.5 + idx) * 0.003;
        });
      }

      // Camera spatial movement based on scroll progress
      camera.position.x = Math.sin(p * Math.PI) * 4;
      camera.position.y = 4 + (p - 0.5) * 2;
      camera.lookAt(0, 0.5, 0);

      if (particles) {
        particles.rotation.y = elapsed * 0.03;
      }

      renderer.render(scene, camera);
      reqId = requestAnimationFrame(renderLoop);
    };

    reqId = requestAnimationFrame(renderLoop);

    // Resize Observer
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount (zero memory leaks, zero duplicate WebGL contexts!)
    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);

      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }

      baseGeo.dispose();
      baseMat.dispose();
      topGeo.dispose();
      topMat.dispose();
      meadowGeo.dispose();
      meadowMat.dispose();
      treeTrunkMat.dispose();
      treeFoliageMat1.dispose();
      treeFoliageMat2.dispose();
      waterGeo.dispose();
      waterMat.dispose();
      crystalGeo.dispose();
      crystalMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, [showWireframe]);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full overflow-hidden select-none ${className}`}
    />
  );
};
