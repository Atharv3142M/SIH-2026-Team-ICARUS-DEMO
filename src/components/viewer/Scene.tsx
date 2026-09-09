"use client";
import React from 'react';
import { Canvas, useFrame, useThree, type RootState } from '@react-three/fiber';
import { Line, OrbitControls, PerspectiveCamera, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { useSystemStore } from '@/store/useSystemStore';
import { SimulationEngine } from '@/lib/simulation';
import Terrain from './Terrain';
import MeasurementLine from './MeasurementLine';
import RatCreekModel from './RatCreekModel';

const simEngine = new SimulationEngine();

function SceneController() {
  const { setDronePosition, setTelemetry, cameraMode, dronePosition } = useSystemStore();
  const { camera } = useThree();
  const lastSimUpdate = React.useRef(0);
  const cameraPosition = React.useMemo(() => new THREE.Vector3(), []);

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

    if (cameraMode !== 'FREE') {
      const target = cameraMode === 'FOLLOW' ? dronePosition : new THREE.Vector3(0, 0, 0);
      const position = cameraMode === 'OVERHEAD'
        ? cameraPosition.set(0, 90, 0)
        : cameraMode === 'FOLLOW'
          ? cameraPosition.copy(dronePosition).add(new THREE.Vector3(8, 4.5, 8))
          : cameraPosition.set(12, 8, 16);
      camera.position.lerp(position, 0.035);
      camera.lookAt(target);
    }

  });
  return null;
}

export default function Scene() {
  const { layers, measurePoints, cameraMode } = useSystemStore();

  return (
    <Canvas shadows dpr={[1, 2]}>
      <PerspectiveCamera makeDefault position={[50, 40, 50]} fov={60} />
      <OrbitControls makeDefault enableDamping enabled={cameraMode === 'FREE'} />

      <color attach="background" args={['#0a0c0d']} />
      <fog attach="fog" args={['#0a0c0d', 0.008]} />

      <ambientLight intensity={0.8} />
      <hemisphereLight args={['#b9dcff', '#17140f', 1.2]} />
      <directionalLight position={[20, 30, 10]} intensity={2.2} color="#fff2d1" castShadow />

      <SceneController />

      {layers.grid && <Terrain />}
      {layers.trajectory && <FlightPath />}
      {layers.trajectory && <Drone />}
      <React.Suspense fallback={null}>
        <RatCreekModel />
      </React.Suspense>

      {measurePoints.length > 0 && (
        <MeasurementLine />
      )}

    </Canvas>
  );
}

function Drone() {
  const dronePosition = useSystemStore((state) => state.dronePosition);

  return (
    <group position={dronePosition.toArray()} rotation={[0, Math.PI / 4, 0]} scale={1.05}>
      <RoundedBox args={[3.2, 0.75, 2.4]} radius={0.28} smoothness={4}>
        <meshStandardMaterial color="#4a5157" metalness={0.75} roughness={0.32} />
      </RoundedBox>
      <mesh position={[0, 0.42, 0.15]} scale={[1.05, 0.34, 0.7]}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshStandardMaterial color="#646c73" metalness={0.55} roughness={0.28} />
      </mesh>
      {[
        [-2.05, 0.12, -1.65], [2.05, 0.12, -1.65], [-2.05, 0.12, 1.65], [2.05, 0.12, 1.65],
      ].map(([x, y, z], index) => (
        <DroneArm key={`${x}-${z}`} x={x} y={y} z={z} clockwise={index % 2 === 0} />
      ))}
      <group position={[0, -0.72, -1.18]} rotation={[0.35, 0, 0]}>
        <mesh>
          <sphereGeometry args={[0.52, 20, 16]} />
          <meshStandardMaterial color="#171b1f" metalness={0.8} roughness={0.16} />
        </mesh>
        <mesh position={[0, 0, -0.42]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.27, 0.27, 0.12, 24]} />
          <meshStandardMaterial color="#0b1820" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
      <pointLight position={[0, 0.4, 1.35]} color="#ff3b30" intensity={4} distance={8} />
      <pointLight position={[0, 0.4, -1.35]} color="#00a8ff" intensity={3} distance={7} />
      <pointLight position={[0, 2.5, 0]} color="#bfe8ff" intensity={3} distance={10} />
    </group>
  );
}

function DroneArm({ x, y, z, clockwise }: { x: number; y: number; z: number; clockwise: boolean }) {
  const rotor = React.useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (rotor.current) rotor.current.rotation.y += (clockwise ? 1 : -1) * delta * 32;
  });

  return (
    <group position={[x, y, z]}>
      <mesh position={[-x / 2, 0, -z / 2]} rotation={[0, Math.atan2(x, z), 0]}>
        <boxGeometry args={[0.38, 0.18, Math.hypot(x, z)]} />
        <meshStandardMaterial color="#42494f" metalness={0.7} roughness={0.38} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.29, 0.34, 0.25, 20]} />
        <meshStandardMaterial color="#242a2e" metalness={0.9} roughness={0.25} />
      </mesh>
      <group ref={rotor} position={[0, 0.17, 0]}>
        <mesh scale={[1.45, 0.025, 0.11]}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="#171b1f" transparent opacity={0.75} /></mesh>
        <mesh scale={[0.11, 0.025, 1.45]}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="#171b1f" transparent opacity={0.75} /></mesh>
      </group>
    </group>
  );
}

function FlightPath() {
  const points = [
    [-50, 20, -50], [50, 25, -50], [50, 20, 50], [-50, 30, 50], [-50, 20, -50],
  ] as [number, number, number][];

  return <Line points={points} color="#00a8ff" transparent opacity={0.55} lineWidth={1} dashed dashSize={2} gapSize={1} />;
}
