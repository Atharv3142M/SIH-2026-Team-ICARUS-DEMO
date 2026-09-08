"use client";
import React, { useMemo } from 'react';
import { Grid, Text } from '@react-three/drei';
import * as THREE from 'three';

export default function Terrain() {
  const labels = useMemo(() => {
    const items = [];
    for (let i = -100; i <= 100; i += 10) {
      if (i === 0) continue;
      items.push({ x: i, z: 0, text: `${i}m`, axis: 'X' });
      items.push({ x: 0, z: i, text: `${i}m`, axis: 'Z' });
    }
    return items;
  }, []);

  return (
    <group>
      <Grid
        infiniteGrid
        fadeDistance={100}
        sectionSize={10}
        sectionColor="#3a4449"
        cellColor="#161b1d"
      />

      {labels.map((l, i) => (
        <Text
          key={i}
          position={[l.x, 0.1, l.z]}
          fontSize={0.4}
          color="#5c6366"
          rotation={[-Math.PI / 2, 0, 0]}
        >
          {l.text}
        </Text>
      ))}

      <group position={[-90, 0.1, -90]}>
        <mesh>
          <boxGeometry args={[10, 0.05, 0.1]} />
          <meshBasicMaterial color="#ffb400" />
        </mesh>
        <Text
          position={[0, 0.3, 0]}
          fontSize={0.4}
          color="#ffb400"
          anchorX="center"
          rotation={[-Math.PI / 2, 0, 0]}
        >
          SCALE: 10m
        </Text>
      </group>
    </group>
  );
}
