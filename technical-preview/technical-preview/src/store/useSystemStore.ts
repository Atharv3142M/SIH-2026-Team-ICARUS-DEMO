import { create } from 'zustand';
import * as THREE from 'three';

export type MissionStatus = 'BOOTING' | 'PROCESSING' | 'READY';
export type ActiveTool = 'NONE' | 'DISTANCE' | 'HEIGHT' | 'AREA';

interface SystemState {
  // System Status
  missionStatus: MissionStatus;
  setMissionStatus: (status: MissionStatus) => void;

  // UI State
  activeTool: ActiveTool;
  setActiveTool: (tool: ActiveTool) => void;
  layers: {
    mesh: boolean;
    points: boolean;
    semantic: boolean;
    grid: boolean;
  };
  setLayer: (layer: keyof SystemState['layers'], visible: boolean) => void;

  // Telemetry / Coordinates
  cursorCoord: THREE.Vector3;
  setCursorCoord: (coord: THREE.Vector3) => void;

  // Measurements
  measurePoints: THREE.Vector3[];
  addMeasurePoint: (point: THREE.Vector3) => void;
  clearMeasurements: () => void;

  // Console
  logs: { text: string; type: 'info' | 'warn' | 'sys' | 'user'; timestamp: string }[];
  addLog: (text: string, type: 'info' | 'warn' | 'sys' | 'user') => void;
}

export const useSystemStore = create<SystemState>((set) => ({
  missionStatus: 'BOOTING',
  setMissionStatus: (status) => set({ missionStatus: status }),

  activeTool: 'NONE',
  setActiveTool: (tool) => set({ activeTool: tool }),

  layers: {
    mesh: true,
    points: false,
    semantic: false,
    grid: true,
  },
  setLayer: (layer, visible) =>
    set((state) => ({ layers: { ...state.layers, [layer]: visible } })),

  cursorCoord: new THREE.Vector3(0, 0, 0),
  setCursorCoord: (coord) => set({ cursorCoord: coord }),

  measurePoints: [],
  addMeasurePoint: (point) => set((state) => ({
    measurePoints: state.measurePoints.length < 2 ? [...state.measurePoints, point] : [point]
  })),
  clearMeasurements: () => set({ measurePoints: [] }),

  logs: [],
  addLog: (text, type) => set((state) => ({
    logs: [...state.logs, {
      text,
      type,
      timestamp: new Date().toISOString().split('T')[1].split('.')[0]
    }]
  })),
}));
