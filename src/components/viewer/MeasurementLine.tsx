"use client";
import React, { useMemo } from 'react';
import { Line, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useSystemStore } from '@/store/useSystemStore';

export default function MeasurementLine() {
  const { measurePoints, activeTool } = useSystemStore();

  const isArea = activeTool === 'AREA';

  const { points, label, center } = useMemo(() => {
    if (!isArea) {
      const p1 = measurePoints[0];
      const p2 = measurePoints[1];
      return {
        points: [p1, p2],
        label: `${p1.distanceTo(p2).toFixed(2)}m`,
        center: p1.clone().lerp(p2, 0.5)
      };
    } else {
      // Area calculation (Shoelace formula on XZ plane)
      let area = 0;
      for (let i = 0; i < measurePoints.length; i++) {
        const p1 = measurePoints[i];
        const p2 = measurePoints[(i + 1) % measurePoints.length];
        area += (p1.x * p2.z) - (p2.x * p1.z);
      }
      area = Math.abs(area) / 2;

      // Calculate centroid for label
      const center = new THREE.Vector3();
      measurePoints.forEach(p => center.add(p));
      center.divideScalar(measurePoints.length);

      return {
        points: isArea && measurePoints.length > 2
          ? [...measurePoints, measurePoints[0]]
          : measurePoints,
        label: `${area.toFixed(2)}m²`,
        center
      };
    }
  }, [measurePoints, isArea]);

  if (measurePoints.length < 2) return null;

  return (
    <group>
      <Line
        points={points}
        color={isArea ? "#fbc531" : "#ffb400"}
        lineWidth={2}
      />
      <Text
        position={center}
        fontSize={0.6}
        color={isArea ? "#fbc531" : "#ffb400"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000"
      >
        {label}
      </Text>
    </group>
  );
}
