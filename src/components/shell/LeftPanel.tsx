"use client";
import React from 'react';
import { useSystemStore } from '@/store/useSystemStore';
import { Layers, Ruler, Maximize, Trash2 } from 'lucide-react';

export default function LeftPanel() {
  const { activeTool, setActiveTool, layers, setLayer } = useSystemStore();

  return (
    <div className="w-64 border-r border-[#3a4449] bg-[#161b1d] flex flex-col font-mono text-[#e0e6e9]">
      <div className="p-2 bg-[#3a4449] text-[10px] flex justify-between opacity-80">
        <span>MODULE_CONTROLS</span>
        <span>V1.0</span>
      </div>

      <div className="p-4 flex flex-col gap-6">
        {/* View Mode */}
        <section>
          <h3 className="text-[10px] opacity-40 mb-3 tracking-widest uppercase">Visualization</h3>
          <div className="flex flex-col gap-1">
            {[
              { id: 'mesh', label: 'SOLID_MESH' },
              { id: 'points', label: 'POINT_CLOUD' },
              { id: 'semantic', label: 'SEMANTIC_LAYER' },
            ].map((mode) => {
              const modeId = mode.id as keyof typeof layers;
              return (
                <button
                  key={mode.id}
                  onClick={() => setLayer(modeId, !layers[modeId])}
                  className={`text-left px-3 py-2 text-[11px] border transition-all ${
                    layers[modeId]
                      ? 'bg-[#4da6ff] text-[#0a0c0d] border-[#4da6ff]'
                      : 'bg-transparent text-[#e0e6e9] border-[#3a4449] hover:bg-[#252d30]'
                  }`}
                >
                  {mode.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Tools */}
        <section>
          <h3 className="text-[10px] opacity-40 mb-3 tracking-widest uppercase">Analysis Tools</h3>
          <div className="flex flex-col gap-1">
            {[
              { id: 'DIST', label: 'DIST_MEASURE', icon: <Ruler size={12} /> },
              { id: 'HEIGHT', label: 'HEIGHT_PROBE', icon: <Maximize size={12} /> },
              { id: 'AREA', label: 'AREA_CALC', icon: <Layers size={12} /> },
            ].map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id as any)}
                className={`flex items-center gap-2 text-left px-3 py-2 text-[11px] border transition-all ${
                  activeTool === tool.id
                    ? 'bg-[#ffb400] text-[#0a0c0d] border-[#ffb400]'
                    : 'bg-transparent text-[#e0e6e9] border-[#3a4449] hover:bg-[#252d30]'
                }`}
              >
                {tool.icon}
                {tool.label}
              </button>
            ))}
          </div>
        </section>

        <button
          onClick={() => {}} // Logic moved to store in plan
          className="mt-4 flex items-center justify-center gap-2 px-3 py-2 text-[11px] border border-[#ff4444] text-[#ff4444] hover:bg-[#ff4444] hover:text-white transition-all"
        >
          <Trash2 size={12} />
          CLEAR_ALL_MARKERS
        </button>
      </div>
    </div>
  );
}
