"use client";
import React, { useMemo } from 'react';
import { Box, Points, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { useSystemStore } from '@/store/useSystemStore';

interface BuildingProps {
  x: number; z: number; w: number; d: number; h: number; conf: number;
  mode: string; confFilter: string; semantic?: string;
}

export default function Building({ x, z, w, d, h, conf, mode, confFilter, semantic = 'BUILDING' }: BuildingProps) {
  const { activeTool, addMeasurePoint, layers } = useSystemStore();


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
    if (confidenceStatus === 'OBSERVED') return '#4cd137';
    if (confidenceStatus === 'INFERRED') return '#fbc531';
    return '#ff4444';
  }, [confidenceStatus]);

  const semanticColors: Record<string, string> = {
    BUILDING: '#00a8ff',
    INDUSTRIAL: '#ff4444',
    COMMERCIAL: '#fbc531',
    RESIDENTIAL: '#4cd137',
  };

  const semanticColor = semanticColors[semantic] || '#ffffff';

  if (!isVisible) return null;


  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    if (activeTool === 'DISTANCE' || activeTool === 'AREA') {
      addMeasurePoint(e.point);
    }
  };

  return (
    <group position={[x, h / 2, z]}>
      {layers.semantic && (
        <Box args={[w + 0.1, h + 0.1, d + 0.1]} position={[0, 0, 0]}>
          <meshBasicMaterial color={semanticColor} transparent opacity={0.3} wireframe />
        </Box>
      )}
      {mode === 'mesh' && (

        <Box args={[w, h, d]} onPointerDown={handlePointerDown}>
          <meshPhongMaterial
            color={color}
            transparent
            opacity={0.6}
            shininess={100}
          />
        </Box>
      )}

      {mode === 'wireframe' && (
        <Box args={[w, h, d]} onPointerDown={handlePointerDown}>
          <meshBasicMaterial color={color} wireframe transparent opacity={0.5} />
        </Box>
      )}

      {mode === 'points' && (
        <Points>
          <boxGeometry args={[w, h, d]} />
          <pointsMaterial size={0.1} color={color} />
        </Points>
      )}

      <group>
        {[-0.5, 0.5].map(sx =>
          [-0.5, 0.5].map(sy =>
            [-0.5, 0.5].map(sz => (
              <Sphere key={`${sx}${sy}${sz}`} args={[0.05]} position={[sx*w, sy*h, sz*d]}>
                <meshBasicMaterial color="#ffffff" />
              </Sphere>
            ))
          )
        )}
      </group>
    </group>
  );
}
