"use client";

import React from 'react';
import { useLoader } from '@react-three/fiber';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';
import type { BufferGeometry } from 'three';

interface DroneSplatCloudProps {
  scene: 'simingshan' | 'sculpture';
}

export default function DroneSplatCloud({ scene }: DroneSplatCloudProps) {
  const geometry = useLoader(PLYLoader, `/api/dronesplat-cloud?scene=${scene}`) as BufferGeometry;
  const normalizedGeometry = React.useMemo(() => {
    const cloud = geometry.clone();
    cloud.center();
    cloud.computeBoundingSphere();
    return cloud;
  }, [geometry]);
  const radius = normalizedGeometry.boundingSphere?.radius ?? 1;
  const scale = 70 / radius;

  React.useEffect(() => () => normalizedGeometry.dispose(), [normalizedGeometry]);

  return (
    <points geometry={normalizedGeometry} scale={scale} rotation={[-Math.PI / 2, 0, 0]}>
      <pointsMaterial vertexColors size={0.28} sizeAttenuation transparent opacity={0.96} />
    </points>
  );
}
