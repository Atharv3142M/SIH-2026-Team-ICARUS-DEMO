"use client";
import React from 'react';
import { Grid, Text } from '@react-three/drei';
import * as THREE from 'three';

export default function Terrain() {
  return (
    <group>
      <Grid
        infiniteGrid
        fadeDistance={100}
        sectionSize={10}
        sectionColor="#3a4449"
        cellColor="#161b1d"
      />

      <mesh position={[0, -0.1, 0]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="#4da6ff" transparent opacity={0.5} />
      </mesh>

      <group position={[-90, 0.1, -90]}>
        <mesh>
          <boxGeometry args={[10, 0.1, 0.2]} />
          <meshBasicMaterial color="#ffb400" />
        </mesh>
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.5}
          color="#ffb400"
          anchorX="center"
        >
          10m
        </Text>
      </group>
    </group>
  );
}
