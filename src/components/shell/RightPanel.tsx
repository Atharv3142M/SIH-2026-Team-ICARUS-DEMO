"use client";
import React from 'react';
import { useSystemStore } from '@/store/useSystemStore';

export default function RightPanel() {
  const { cursorCoord } = useSystemStore();

  return (
    <div className="w-64 border-l border-[#3a4449] bg-[#161b1d] flex flex-col font-mono text-[#e0e6e9]">
      <div className="p-2 bg-[#3a4449] text-[10px] flex justify-between opacity-80">
        <span>TELEMETRY_DATA</span>
        <span className="animate-pulse">LIVE</span>
      </div>

      <div className="flex flex-col">
        <div className="p-4 border-b border-[#3a4449] flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] opacity-50">COORD_X</span>
            <span className="text-sm text-[#4da6ff]">{cursorCoord.x.toFixed(3)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] opacity-50">COORD_Y</span>
            <span className="text-sm text-[#4da6ff]">{cursorCoord.y.toFixed(3)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] opacity-50">COORD_Z</span>
            <span className="text-sm text-[#4da6ff]">{cursorCoord.z.toFixed(3)}</span>
          </div>
        </div>

        <div className="p-4 border-b border-[#3a4449]">
          <h3 className="text-[10px] opacity-40 mb-3 tracking-widest uppercase">Recon Stats</h3>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] opacity-60">RMSE</span>
              <span className="text-[11px] text-[#00ff88]">0.43m</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] opacity-60">COVERAGE</span>
              <span className="text-[11px]">92.1%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] opacity-60">POINTS</span>
              <span className="text-[11px]">2.14M</span>
            </div>
          </div>
        </div>

        <div className="p-4 flex-1 overflow-hidden relative">
          <h3 className="text-[10px] opacity-40 mb-3 tracking-widest uppercase">UAV Stream</h3>
          <div className="text-[10px] font-mono space-y-1 opacity-70">
            <div className="flex justify-between"><span>HDG:</span> <span>124.5°</span></div>
            <div className="flex justify-between"><span>PIT:</span> <span>-2.1°</span></div>
            <div className="flex justify-between"><span>ROL:</span> <span>1.4°</span></div>
            <div className="flex justify-between"><span>ALT:</span> <span>120.0m</span></div>
            <div className="flex justify-between"><span>SPD:</span> <span>12.4m/s</span></div>
          </div>
          <div className="absolute bottom-4 left-4 right-4 h-12 border border-[#3a4449] bg-[#0a0c0d] p-1 overflow-hidden">
             <div className="text-[8px] animate-pulse text-[#4da6ff]">SAMPING_SENSORS...</div>
          </div>
        </div>
      </div>
    </div>
  );
}
