"use client";
import React from 'react';
import { Canvas, useFrame, type RootState } from '@react-three/fiber';
import { Line, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useSystemStore } from '@/store/useSystemStore';
import { SimulationEngine } from '@/lib/simulation';
import Building from './Building';
import Terrain from './Terrain';
import MeasurementLine from './MeasurementLine';

const simEngine = new SimulationEngine();

function SceneController() {
  const { setDronePosition, setTelemetry } = useSystemStore();
  const lastSimUpdate = React.useRef(0);

  useFrame((state: RootState) => {
    // Update Simulation
    const delta = state.clock.getDelta();
    const { position, telemetry } = simEngine.update(delta);

    // Throttle store updates to 10Hz to prevent React re-render lag
    const now = state.clock.elapsedTime;
    if (now - lastSimUpdate.current > 0.1) {
      setDronePosition(position);
      setTelemetry(telemetry);
      lastSimUpdate.current = now;
    }

  });
  return null;
}

export default function Scene() {
  const { layers, measurePoints, confidenceFilter } = useSystemStore();

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
      {layers.trajectory && <FlightPath />}
      {layers.trajectory && <Drone />}

      <group>
        <City
          mode={layers.mesh ? 'mesh' : layers.points ? 'points' : 'wireframe'}
          confFilter={confidenceFilter}
        />
      </group>

      {measurePoints.length > 0 && (
        <MeasurementLine />
      )}

    </Canvas>
  );
}

function Drone() {
  const dronePosition = useSystemStore((state) => state.dronePosition);

  return (
    <group position={dronePosition.toArray()}>
      <mesh rotation={[0, Math.PI / 4, 0]}>
        <octahedronGeometry args={[1.1, 0]} />
        <meshStandardMaterial color="#00a8ff" emissive="#003d5c" metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.56, 24]} />
        <meshBasicMaterial color="#00a8ff" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

function FlightPath() {
  const points = [
    [-50, 20, -50], [50, 25, -50], [50, 20, 50], [-50, 30, 50], [-50, 20, -50],
  ] as [number, number, number][];

  return <Line points={points} color="#00a8ff" transparent opacity={0.55} lineWidth={1} dashed dashSize={2} gapSize={1} />;
}

function City({ mode, confFilter }: { mode: string, confFilter: string }) {
  const cityData = [
    { x: -10, z: -10, w: 5, d: 5, h: 15, conf: 0.9, semantic: 'BUILDING' },
    { x: 10, z: -15, w: 8, d: 6, h: 25, conf: 0.8, semantic: 'BUILDING' },
    { x: -15, z: 10, w: 6, d: 8, h: 10, conf: 0.5, semantic: 'INDUSTRIAL' },
    { x: 15, z: 10, w: 5, d: 12, h: 18, conf: 0.95, semantic: 'BUILDING' },
    { x: 0, z: -25, w: 10, d: 10, h: 30, conf: 0.7, semantic: 'COMMERCIAL' },
    { x: 20, z: -5, w: 4, d: 4, h: 8, conf: 0.4, semantic: 'RESIDENTIAL' },
    { x: -20, z: -20, w: 7, d: 7, h: 12, conf: 0.85, semantic: 'BUILDING' },
    { x: 5, z: 15, w: 6, d: 6, h: 20, conf: 0.6, semantic: 'INDUSTRIAL' },
  ];


  return (
    <>
      {cityData.map((d, i) => (
        <Building key={i} {...d} mode={mode} confFilter={confFilter} />
      ))}
    </>
  );
}
