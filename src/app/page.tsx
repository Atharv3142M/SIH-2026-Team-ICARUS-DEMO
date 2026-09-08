"use client";
import React, { useState, useEffect } from 'react';
import TopBar from '@/components/shell/TopBar';
import LeftPanel from '@/components/shell/LeftPanel';
import RightPanel from '@/components/shell/RightPanel';
import BottomPanel from '@/components/shell/BottomPanel';
import Scene from '@/components/viewer/Scene';
import { useSystemStore } from '@/store/useSystemStore';

export default function Page() {
  const { missionStatus, setMissionStatus, addLog } = useSystemStore();
  const [step, setStep] = useState<'BOOT' | 'PROCESS' | 'READY'>('BOOT');

  useEffect(() => {
    const runBoot = async () => {
      setMissionStatus('BOOTING');

      // Boot Sequence
      await new Promise(r => setTimeout(r, 1500));
      setStep('PROCESS');
      setMissionStatus('PROCESSING');

      const stages = [
        "SYNCING_TELEMETRY_GPS_IMU",
        "KEYFRAME_EXTRACTION_18K_FRAMES",
        "STRUCTURE_FROM_MOTION_SPARSE",
        "MULTI_VIEW_STEREO_DENSE",
        "GEOREFERENCING_WGS84_UTM",
        "SEMANTIC_AI_CLASSIFICATION",
        "DIGITAL_TWIN_ASSEMBLY"
      ];

      for (const stage of stages) {
        addLog(`EXECUTING: ${stage}...`, 'info');
        await new Promise(r => setTimeout(r, 800 + Math.random() * 1000));
        addLog(`COMPLETE: ${stage}`, 'sys');
      }

      await new Promise(r => setTimeout(r, 1000));
      setStep('READY');
      setMissionStatus('READY');
      addLog('SYSTEM_READY: Spatial Digital Twin Operational.', 'sys');
    };

    runBoot();
  }, [setMissionStatus, addLog]);

  if (step === 'BOOT') {
    return (
      <div className="h-screen w-screen bg-[#0a0c0d] flex flex-col items-center justify-center font-mono text-[#e0e6e9] text-center">
        <div className="text-6xl font-black tracking-tighter mb-2">SPATIAL_TWIN</div>
        <div className="text-xs text-[#4da6ff] opacity-60 mb-12 tracking-widest">UAV RECONSTRUCTION ENGINE // VER 4.2.0</div>
        <div className="flex flex-col gap-4">
          <div className="text-[10px] opacity-30">INITIALIZING KERNEL...</div>
          <div className="w-48 h-1 bg-[#161b1d] overflow-hidden relative">
            <div className="absolute inset-0 bg-[#4da6ff] animate-[loading_2s_ease-in-out_infinite]" style={{ width: '30%' }} />
          </div>
        </div>
        <style jsx>{`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(300%); }
          }
        `}</style>
      </div>
    );
  }

  if (step === 'PROCESS') {
    return (
      <div className="h-screen w-screen bg-[#0a0c0d] flex items-center justify-center font-mono">
        <div className="w-full max-w-xl bg-[#161b1d] border border-[#3a4449] shadow-2xl">
          <div className="p-2 bg-[#3a4449] text-[10px] flex justify-between">
            <span>BOOT_SEQUENCE.EXE</span>
            <span>STATUS: PROCESSING</span>
          </div>
          <div className="p-6 h-80 overflow-y-auto text-[11px] space-y-2" id="proc-logs">
            {/* Logs will be rendered from Zustand store in a real app, but for the boot screen we can just use the logs store */}
            <LogView />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen grid grid-cols-[260px_1fr_260px] grid-rows-[40px_1fr_120px] bg-black overflow-hidden">
      <TopBar />
      <LeftPanel />
      <div className="relative bg-black overflow-hidden">
        <Scene />
      </div>
      <RightPanel />
      <BottomPanel />
    </div>
  );
}

function LogView() {
  const { logs } = useSystemStore();
  return (
    <div className="space-y-1">
      {logs.map((log: any, i: number) => (
        <div key={i} className={`flex gap-3 ${log.type === 'sys' ? 'text-[#4da6ff]' : 'text-[#e0e6e9] opacity-70'}`}>
          <span className="opacity-30">[{log.timestamp}]</span>
          <span>{log.text}</span>
        </div>
      ))}
    </div>
  );
}
