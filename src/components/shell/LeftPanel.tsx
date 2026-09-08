"use client";
import React from 'react';
import { useSystemStore } from '@/store/useSystemStore';
import { Layers, Ruler, Maximize, Trash2, Eye, EyeOff, AlertTriangle } from 'lucide-react';

export default function LeftPanel() {
  const { activeTool, setActiveTool, layers, setLayer, confidenceFilter, setConfidenceFilter } = useSystemStore();

  return (
    <div className="w-64 border-r border-[#2d3436] bg-[#0a0c0d] flex flex-col font-mono text-[#dcdde1]">
      <div className="p-2 bg-[#1a1d1f] border-b border-[#2d3436] text-[10px] flex justify-between opacity-60">
        <span className="tracking-tighter">SYSTEM_MODULES</span>
        <span className="text-[#00a8ff]">v4.2.0</span>
      </div>

      <div className="p-4 flex flex-col gap-6 overflow-y-auto">
        {/* Visualization Layers */}
        <section>
          <h3 className="text-[9px] opacity-30 mb-3 tracking-widest uppercase font-bold">Layer Control</h3>
          <div className="flex flex-col gap-1">
            {[
              { id: 'mesh', label: 'SOLID_GEOMETRY', icon: <Layers size={12} /> },
              { id: 'points', label: 'RAW_POINT_CLOUD', icon: <div className="w-1 h-1 bg-white rounded-full" /> },
              { id: 'semantic', label: 'SEMANTIC_LABELS', icon: <AlertTriangle size={12} /> },
              { id: 'trajectory', label: 'UAV_TRAJECTORY', icon: <div className="w-2 h-[1px] bg-white" /> },
              { id: 'grid', label: 'COORD_GRID', icon: <div className="w-2 h-2 border border-white" /> },
            ].map((layer) => {
              const key = layer.id as keyof typeof layers;
              return (
                <button
                  key={layer.id}
                  onClick={() => setLayer(key, !layers[key])}
                  className={`flex items-center gap-3 text-left px-3 py-2 text-[10px] border transition-all ${
                    layers[key]
                      ? 'bg-[#00a8ff]/10 text-[#00a8ff] border-[#00a8ff]/40'
                      : 'bg-transparent text-[#dcdde1] border-[#2d3436] opacity-50 hover:opacity-100'
                  }`}
                >
                  {layer.icon}
                  {layer.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Confidence Filter */}
        <section>
          <h3 className="text-[9px] opacity-30 mb-3 tracking-widest uppercase font-bold">Confidence Filter</h3>
          <div className="grid grid-cols-2 gap-1">
            {['ALL', 'OBSERVED', 'INFERRED', 'UNKNOWN'].map((filter) => (
              <button
                key={filter}
                onClick={() => setConfidenceFilter(filter as any)}
                className={`px-2 py-1 text-[9px] border transition-all ${
                  confidenceFilter === filter
                    ? 'bg-[#dcdde1] text-[#0a0c0d] border-[#dcdde1]'
                    : 'bg-transparent text-[#dcdde1] border-[#2d3436] opacity-50 hover:opacity-100'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        {/* Analysis Tools */}
        <section>
          <h3 className="text-[9px] opacity-30 mb-3 tracking-widest uppercase font-bold">Metric Analysis</h3>
          <div className="flex flex-col gap-1">
            {[
              { id: 'DISTANCE', label: 'LINEAR_DIST', icon: <Ruler size={12} /> },
              { id: 'HEIGHT', label: 'VERTICAL_PROBE', icon: <Maximize size={12} /> },
              { id: 'AREA', label: 'SURFACE_AREA', icon: <Layers size={12} /> },
            ].map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id as any)}
                className={`flex items-center gap-3 text-left px-3 py-2 text-[10px] border transition-all ${
                  activeTool === tool.id
                    ? 'bg-[#fbc531] text-[#0a0c0d] border-[#fbc531]'
                    : 'bg-transparent text-[#dcdde1] border-[#2d3436] opacity-50 hover:opacity-100'
                }`}
              >
                {tool.icon}
                {tool.label}
              </button>
            ))}
          </div>
        </section>

        <button
          onClick={clearMeasurements}
          className="mt-4 flex items-center justify-center gap-2 px-3 py-2 text-[10px] border border-[#ff4444] text-[#ff4444] hover:bg-[#ff4444] hover:text-white transition-all"
        >
          <Trash2 size={12} />
          PURGE_MARKERS
        </button>
      </div>
    </div>
  );
}
