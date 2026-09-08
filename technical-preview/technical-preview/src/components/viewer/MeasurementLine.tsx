"use client";
import React from 'react';
import { Line, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useSystemStore } from '@/store/useSystemStore';

export default function MeasurementLine() {
  const { measurePoints } = useSystemStore();

  if (measurePoints.length < 2) return null;

  const p1 = measurePoints[0];
  const p2 = measurePoints[1];
  const distance = p1.distanceTo(p2);

  return (
    <group>
      <Line
        points={[p1, p2]}
        color="#ffb400"
        lineWidth={2}
      />
      <Text
        position={p1.clone().lerp(p2, 0.5)}
        fontSize={0.5}
        color="#ffb400"
        anchorX="center"
        anchorY="middle"
      >
        {distance.toFixed(2)}m
      </Text>
    </group>
  );
}
