"use client";

import React from 'react';
import { useGLTF } from '@react-three/drei';
import { Box3, Group, Vector3 } from 'three';
import type { ThreeEvent } from '@react-three/fiber';
import { useSystemStore } from '@/store/useSystemStore';

const MODEL_URL = '/models/rat-creek.glb';

export default function RatCreekModel() {
  const { scene } = useGLTF(MODEL_URL);
  const { activeTool, addMeasurePoint, setCursorCoord } = useSystemStore();
  const model = React.useMemo(() => {
    const instance = scene.clone(true) as Group;
    const bounds = new Box3().setFromObject(instance);
    instance.position.sub(bounds.getCenter(new Vector3()));
    instance.traverse((node) => {
      node.castShadow = true;
      node.receiveShadow = true;
    });
    return instance;
  }, [scene]);

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setCursorCoord(event.point);
  };

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    if (activeTool !== 'NONE') addMeasurePoint(event.point);
  };

  return <primitive object={model} onPointerMove={handlePointerMove} onPointerDown={handlePointerDown} />;
}

useGLTF.preload(MODEL_URL);
