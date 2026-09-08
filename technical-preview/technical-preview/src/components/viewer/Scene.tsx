"use client";
import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, PerspectiveCamera, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useSystemStore } from '@/store/useSystemStore';
import Building from './Building';
import Terrain from './Terrain';
import MeasurementLine from './MeasurementLine';

function SceneController() {
  const { setCursorCoord } = useSystemStore();
  const { raycaster, camera, scene } = useThree();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // Track mouse for coordinate readout
  const handleMouseMove = (e: any) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    setMouse({ x, y });
  };

  useFrame(() => {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
      setCursorCoord(intersects[0].point);
    }
  });

  return (
    <mesh onPointerMove={handleMouseMove} visible={false}>
      <planeGeometry args={[1000, 1000]} />
    </mesh>
  );
}

export default function Scene() {
  const { layers, activeTool, measurePoints, addMeasurePoint, clearMeasurements } = useSystemStore();

  return (
    <Canvas shadows dpr={[1, 2]}>
      <PerspectiveCamera makeDefault position={[50, 40, 50]} fov={60} />
      <OrbitControls makeDefault enableDamping />

      <color attach="background" args={['#0a0c0d']} />
      <fog attach="fog" args={['#0a0c0d', 0.015]} />

      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 10]} intensity={1} color="#4da6ff" />

      <SceneController />

      {layers.grid && <Terrain />}

      <group>
        <City
          mode={layers.mesh ? 'mesh' : layers.points ? 'points' : 'wireframe'}
          confMap={layers.semantic}
        />
      </group>

      {measurePoints.length > 0 && (
        <MeasurementLine points={measurePoints} />
      )}

      <Environment preset="city" />
    </Canvas>
  );
}

function City({ mode, confMap }: { mode: string, confMap: boolean }) {
  const cityData = [
    { x: -10, z: -10, w: 5, d: 5, h: 15, conf: 0.9 },
    { x: 10, z: -15, w: 8, d: 6, h: 25, conf: 0.8 },
    { x: -15, z: 10, w: 6, d: 8, h: 10, conf: 0.5 },
    { x: 15, z: 10, w: 5, d: 12, h: 18, conf: 0.95 },
    { x: 0, z: -25, w: 10, d: 10, h: 30, conf: 0.7 },
    { x: 20, z: -5, w: 4, d: 4, h: 8, conf: 0.4 },
    { x: -20, z: -20, w: 7, d: 7, h: 12, conf: 0.85 },
    { x: 5, z: 15, w: 6, d: 6, h: 20, conf: 0.6 },
  ];

  return (
    <>
      {cityData.map((d, i) => (
        <Building key={i} {...d} mode={mode} confMap={confMap} />
      ))}
    </>
  );
}
