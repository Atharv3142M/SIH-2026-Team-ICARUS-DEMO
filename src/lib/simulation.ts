import * as THREE from 'three';

export interface UavTelemetry {
  hdg: number;
  pit: number;
  rol: number;
  alt: number;
  spd: number;
  sat: number;
  sig: number;
  utmE: string;
  utmN: string;
}

const WAYPOINTS = [
  new THREE.Vector3(-50, 20, -50),
  new THREE.Vector3(50, 25, -50),
  new THREE.Vector3(50, 20, 50),
  new THREE.Vector3(-50, 30, 50),
  new THREE.Vector3(-50, 20, -50),
];

const BASE_UTM_E = 500000;
const BASE_UTM_N = 4500000;

export class SimulationEngine {
  private time = 0;
  private speed = 0.05; // Progress through waypoints per frame

  update(delta: number): { position: THREE.Vector3; telemetry: UavTelemetry } {
    this.time += delta * this.speed;

    const totalPoints = WAYPOINTS.length;
    const progress = (this.time % (totalPoints - 1)) / (totalPoints - 1);
    const segment = Math.floor(progress * (totalPoints - 1));
    const segmentProgress = (progress * (totalPoints - 1)) - segment;

    const start = WAYPOINTS[segment];
    const end = WAYPOINTS[segment + 1] || WAYPOINTS[0];

    const position = new THREE.Vector3().lerpVectors(start, end, segmentProgress);
    const velocity = new THREE.Vector3().subVectors(end, start).normalize();

    // Heading: 0 is North (+Z), clockwise.
    let hdg = (Math.atan2(velocity.x, velocity.z) * 180) / Math.PI;
    if (hdg < 0) hdg += 360;

    // Pitch: Angle relative to horizon.
    const pit = (Math.asin(velocity.y) * 180) / Math.PI;

    // Roll: Believable tilt based on sine of time.
    const rol = Math.sin(this.time) * 2;

    // Speed: base speed + slight variation
    const spd = 12 + Math.sin(this.time * 0.5) * 1;

    // Satellite count and signal strength
    const sat = 12 + Math.floor(Math.random() * 4);
    const sig = 70 + Math.sin(this.time * 0.2) * 10;

    return {
      position,
      telemetry: {
        hdg: hdg + (Math.random() - 0.5) * 0.5,
        pit: pit + (Math.random() - 0.5) * 0.2,
        rol: rol + (Math.random() - 0.5) * 0.2,
        alt: position.y + (Math.random() - 0.5) * 0.1,
        spd: spd + (Math.random() - 0.5) * 0.1,
        sat,
        sig: Math.round(sig),
        utmE: (BASE_UTM_E + position.x * 10).toFixed(2),
        utmN: (BASE_UTM_N + position.z * 10).toFixed(2),
      }
    };
  }
}
