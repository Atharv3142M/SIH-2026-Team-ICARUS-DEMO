"use client";
import React, { useMemo } from 'react';
import { Box, Points } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { useSystemStore } from '@/store/useSystemStore';

interface BuildingProps {
  x: number; z: number; w: number; d: number; h: number; conf: number;
  mode: string; confFilter: string; semantic?: string;
}

export default function Building({ x, z, w, d, h, conf, mode, confFilter, semantic = 'BUILDING' }: BuildingProps) {
  const { activeTool, addMeasurePoint, layers, setCursorCoord } = useSystemStore();


  // The Differentiator: Observed / Inferred / Unknown
  const confidenceStatus = useMemo(() => {
    if (conf > 0.8) return 'OBSERVED';
    if (conf > 0.4) return 'INFERRED';
    return 'UNKNOWN';
  }, [conf]);

  // Filter visibility based on confidence
  const isVisible = useMemo(() => {
    if (confFilter === 'ALL') return true;
    return confFilter === confidenceStatus;
  }, [confFilter, confidenceStatus]);

  const color = useMemo(() => {
    if (confidenceStatus === 'OBSERVED') return '#7aa36e'; // Muted Green
    if (confidenceStatus === 'INFERRED') return '#c7a35d'; // Amber
    return '#a36e6e'; // Muted Red
  }, [confidenceStatus]);

  // Technical Geometry: Jittered Box for photogrammetry look
  const { jitteredGeometry, pointCloudGeometry } = useMemo(() => {
    const geo = new THREE.BoxGeometry(w, h, d);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const jitter = (seed: number) => (Math.sin(seed * 12.9898) * 43758.5453 % 1 - 0.5) * 0.05;
      pos.setXYZ(
        i,
        pos.getX(i) + jitter(i),
        pos.getY(i) + jitter(i + 100),
        pos.getZ(i) + jitter(i + 200)
      );
    }
    pos.needsUpdate = true;

    // Point Cloud: Realistic distribution on surfaces
    const points = [];
    const numPointsPerFace = 150;
    for (let i = 0; i < numPointsPerFace * 6; i++) {
      const face = i % 6;
      let px = 0, py = 0, pz = 0;
      const rand = (offset: number) => (Math.sin((i + 1) * (offset + 1) * 12.9898) * 43758.5453) % 1;
      if (face === 0) { px = w/2; py = (rand(1)-0.5)*h; pz = (rand(2)-0.5)*d; }
      else if (face === 1) { px = -w/2; py = (rand(3)-0.5)*h; pz = (rand(4)-0.5)*d; }
      else if (face === 2) { py = h/2; px = (rand(5)-0.5)*w; pz = (rand(6)-0.5)*d; }
      else if (face === 3) { py = -h/2; px = (rand(7)-0.5)*w; pz = (rand(8)-0.5)*d; }
      else if (face === 4) { pz = d/2; px = (rand(9)-0.5)*w; py = (rand(10)-0.5)*h; }
      else { pz = -d/2; px = (rand(11)-0.5)*w; py = (rand(12)-0.5)*h; }
      points.push(px, py, pz);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));

    return { jitteredGeometry: geo, pointCloudGeometry: pGeo };
  }, [w, h, d]);

  const semanticColors: Record<string, string> = {
    BUILDING: '#00a8ff',
    INDUSTRIAL: '#ff4444',
    COMMERCIAL: '#fbc531',
    RESIDENTIAL: '#4cd137',
  };

  const semanticColor = semanticColors[semantic] || '#ffffff';

  if (!isVisible) return null;


  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (activeTool === 'DISTANCE' || activeTool === 'AREA' || activeTool === 'HEIGHT') {
      addMeasurePoint(e.point);
    }
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setCursorCoord(e.point);
  };

  return (
    <group position={[x, h / 2, z]}>
      {layers.semantic && (
        <Box args={[w + 0.1, h + 0.1, d + 0.1]} position={[0, 0, 0]}>
          <meshBasicMaterial color={semanticColor} transparent opacity={0.3} wireframe />
        </Box>
      )}
      {mode === 'mesh' && (

        <group onPointerDown={handlePointerDown} onPointerMove={handlePointerMove}>
          <mesh geometry={jitteredGeometry}>
            <meshStandardMaterial
              color={color}
              transparent
              opacity={0.6}
              metalness={0.1}
              roughness={0.8}
            />
          </mesh>
          <mesh geometry={jitteredGeometry}>
            <meshBasicMaterial color={color} wireframe transparent opacity={0.2} />
          </mesh>
        </group>
      )}

      {mode === 'wireframe' && (
        <mesh geometry={jitteredGeometry} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove}>
          <meshBasicMaterial color={color} wireframe transparent opacity={0.5} />
        </mesh>
      )}

      {mode === 'points' && (
        <Points geometry={pointCloudGeometry} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove}>
          <pointsMaterial size={0.08} color={color} transparent opacity={0.8} />
        </Points>
      )}

      <group>
        {[-0.5, 0.5].map(sx =>
          [-0.5, 0.5].map(sy =>
            [-0.5, 0.5].map(sz => (
              <Box key={`${sx}${sy}${sz}`} args={[0.1, 0.1, 0.1]} position={[sx*w, sy*h, sz*d]}>
                <meshBasicMaterial color="#ffffff" />
              </Box>
            ))
          )
        )}
      </group>
    </group>
  );
}
