"use client";
import React, { useState, useEffect } from 'react';
import { useSystemStore } from '@/store/useSystemStore';

export default function RightPanel() {
  const { cursorCoord } = useSystemStore();
  const [telemetry, setTelemetry] = useState({
    hdg: 0, pit: 0, rol: 0, alt: 0, spd: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetry({
        hdg: (Math.random() * 360).toFixed(1),
        pit: (Math.random() * 10 - 5).toFixed(2),
        rol: (Math.random() * 10 - 5).toFixed(2),
        alt: (120 + Math.random() * 2).toFixed(1),
        spd: (12 + Math.random() * 1).toFixed(1),
      });
    }, 200);
    return () => clearInterval(timer);
  }, []);

  // Simulate UTM Conversion from local coord
  const toUTM = (val: number) => (500000 + val * 10).toFixed(2);
  const toNorth = (val: number) => (4500000 + val * 10).toFixed(2);

  return (
    <div className="w-64 border-l border-[#2d3436] bg-[#0a0c0d] flex flex-col font-mono text-[#dcdde1]">
      <div className="p-2 bg-[#1a1d1f] border-b border-[#2d3436] text-[10px] flex justify-between opacity-60">
        <span className="tracking-tighter">TELEMETRY_STREAM</span>
        <span className="text-[#4cd137] animate-pulse">LIVE</span>
      </div>

      <div className="flex flex-col">
        <div className="p-4 border-b border-[#2d3436] bg-[#0f1214]">
          <h3 className="text-[9px] opacity-30 mb-3 tracking-widest uppercase font-bold">Spatial Coordinates (UTM)</h3>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] opacity-50">EASTING (X)</span>
              <span className="text-sm text-[#00a8ff]">{toUTM(cursorCoord.x)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] opacity-50">NORTHING (Y)</span>
              <span className="text-sm text-[#00a8ff]">{toNorth(cursorCoord.z)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] opacity-50">ALTITUDE (Z)</span>
              <span className="text-sm text-[#00a8ff]">{cursorCoord.y.toFixed(3)}</span>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-[#2d3436]">
          <h3 className="text-[9px] opacity-30 mb-3 tracking-widest uppercase font-bold">Recon Metrics</h3>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] opacity-60">RMSE_3D</span>
              <span className="text-[11px] text-[#4cd137]">0.43m</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] opacity-60">COMPLETENESS</span>
              <span className="text-[11px]">92.1%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] opacity-60">CONFIDENCE</span>
              <span className="text-[11px] text-[#fbc531]">HIGH</span>
            </div>
          </div>
        </div>

        <div className="p-4 flex-1 overflow-hidden relative">
          <h3 className="text-[9px] opacity-30 mb-3 tracking-widest uppercase font-bold">UAV Flight Data</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] font-mono">
            <div className="flex justify-between border-b border-[#2d3436] pb-1">
              <span className="opacity-40">HDG:</span>
              <span>{telemetry.hdg}°</span>
            </div>
            <div className="flex justify-between border-b border-[#2d3436] pb-1">
              <span className="opacity-40">PIT:</span>
              <span>{telemetry.pit}°</span>
            </div>
            <div className="flex justify-between border-b border-[#2d3436] pb-1">
              <span className="opacity-40">ROL:</span>
              <span>{telemetry.rol}°</span>
            </div>
            <div className="flex justify-between border-b border-[#2d3436] pb-1">
              <span className="opacity-40">ALT:</span>
              <span>{telemetry.alt}m</span>
            </div>
            <div className="flex justify-between border-b border-[#2d3436] pb-1">
              <span className="opacity-40">SPD:</span>
              <span>{telemetry.spd}m/s</span>
            </div>
            <div className="flex justify-between border-b border-[#2d3436] pb-1">
              <span className="opacity-40">SAT:</span>
              <span className="text-[#4cd137]">14</span>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 h-12 border border-[#2d3436] bg-[#0a0c0d] p-2 overflow-hidden flex items-center justify-center">
             <div className="text-[8px] animate-pulse text-[#00a8ff] font-bold uppercase tracking-widest">Updating IMU Stream...</div>
          </div>
        </div>
      </div>
    </div>
  );
}
