"use client";
import React, { useMemo } from 'react';
import { Box, Points, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { useSystemStore } from '@/store/useSystemStore';

interface BuildingProps {
  x: number; z: number; w: number; d: number; h: number; conf: number;
  mode: string; confMap: boolean;
}

export default function Building({ x, z, w, d, h, conf, mode, confMap }: BuildingProps) {
  const { activeTool, addMeasurePoint, logs } = useSystemStore();

  // Use the last system log to check for highlight commands (simplification for demo)
  const isHighlighted = useMemo(() => {
    const lastLog = logs[logs.length - 1];
    return lastLog?.text.includes('highlighting') && h > 10;
  }, [logs, h]);

  const color = useMemo(() => {
    if (confMap) {
      if (conf > 0.8) return '#00ff88';
      if (conf > 0.6) return '#ffff00';
      return '#ff0000';
    }
    return '#4da6ff';
  }, [confMap, conf]);

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    if (activeTool === 'DISTANCE') {
      addMeasurePoint(e.point);
    } else if (activeTool === 'HEIGHT') {
      // Logic handled in store/logs
    }
  };

  return (
    <group position={[x, h / 2, z]}>
      {mode === 'mesh' && (
        <Box args={[w, h, d]} onPointerDown={handlePointerDown}>
          <meshPhongMaterial
            color={isHighlighted ? '#ffb400' : color}
            emissive={isHighlighted ? '#ffb400' : '#000000'}
            emissiveIntensity={isHighlighted ? 0.5 : 0}
            transparent
            opacity={0.7}
          />
        </Box>
      )}

      {mode === 'wireframe' && (
        <Box args={[w, h, d]} onPointerDown={handlePointerDown}>
          <meshBasicMaterial color={isHighlighted ? '#ffb400' : color} wireframe transparent opacity={0.5} />
        </Box>
      )}

      {mode === 'points' && (
        <Points>
          <boxGeometry args={[w, h, d]} />
          <pointsMaterial size={0.1} color={isHighlighted ? '#ffb400' : color} />
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
