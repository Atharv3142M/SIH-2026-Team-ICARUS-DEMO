"use client";
import React, { useState, useEffect } from 'react';
import TopBar from '@/components/shell/TopBar';
import LeftPanel from '@/components/shell/LeftPanel';
import RightPanel from '@/components/shell/RightPanel';
import BottomPanel from '@/components/shell/BottomPanel';
import Scene from '@/components/viewer/Scene';
import { useSystemStore } from '@/store/useSystemStore';

export default function Page() {
  const { setMissionStatus, addLog } = useSystemStore();
  const [step, setStep] = useState<'UPLOAD' | 'BOOT' | 'PROCESS' | 'READY'>('UPLOAD');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file.name.toUpperCase());
    }
  };

  const startInitialization = () => {
    if (!selectedFile) return;
    setStep('BOOT');
  };

  const openDemoMission = () => {
    setSelectedFile('PRELOADED_CORRIDOR_SURVEY.MP4');
    setStep('BOOT');
  };

  useEffect(() => {
    if (step === 'BOOT') {
      const timer = setTimeout(() => setStep('PROCESS'), 2000);
      return () => clearTimeout(timer);
    }

    if (step !== 'PROCESS') return;

    const runBoot = async () => {
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
  }, [step, setMissionStatus, addLog]);

  if (step === 'UPLOAD') {
    return (
      <div className="h-screen w-screen bg-[#0a0c0d] flex flex-col items-center justify-center font-mono text-[#e0e6e9] text-center p-4">
        <div className="max-w-md w-full p-8 border border-[#2d3436] bg-[#161b1d] shadow-2xl">
          <div className="text-3xl font-black tracking-tighter mb-1">SPATIAL_TWIN</div>
          <p className="text-[10px] text-[#4da6ff] opacity-60 mb-3 tracking-widest uppercase">Data Acquisition Module</p>
          <p className="text-xs text-[#dcdde1] opacity-60 mb-8">Use any local video to run the simulated reconstruction workflow.</p>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-4">
              <label className="w-full cursor-pointer group" aria-label="Choose a drone video">
                <div className="border-2 border-dashed border-[#2d3436] group-hover:border-[#00a8ff] p-12 transition-all flex flex-col items-center gap-4 bg-[#0a0c0d]">
                  <div className="text-4xl opacity-20 group-hover:opacity-100 transition-opacity">📁</div>
                  <span className="text-xs opacity-50 group-hover:opacity-100">CHOOSE_DRONE_VIDEO</span>
                  <input type="file" className="hidden" onChange={handleFileUpload} accept="video/*" />
                </div>
              </label>
              {selectedFile && (
                <div className="text-[10px] text-[#4cd137] font-bold animate-pulse">
                  SOURCE_LOADED: {selectedFile}
                </div>
              )}
            </div>

            <button
              onClick={startInitialization}
              disabled={!selectedFile}
              className={`py-3 px-6 text-xs font-bold tracking-widest uppercase transition-all border ${
                selectedFile
                ? 'bg-[#00a8ff] text-[#0a0c0d] border-[#00a8ff] cursor-pointer hover:bg-[#00d1ff]'
                : 'bg-transparent text-[#2d3436] border-[#2d3436] cursor-not-allowed'
              }`}
            >
              Initialize Reconstruction
            </button>
            <button
              type="button"
              onClick={openDemoMission}
              className="min-h-11 border border-[#4da6ff]/60 px-6 text-xs font-bold tracking-widest uppercase text-[#4da6ff] transition hover:bg-[#4da6ff]/10"
            >
              Open Preloaded Demo
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'BOOT') {
    return (
      <div className="h-screen w-screen bg-[#0a0c0d] flex flex-col items-center justify-center font-mono text-[#e0e6e9] text-center">
        <div className="text-6xl font-black tracking-tighter mb-2">SPATIAL_TWIN</div>
        <div className="text-xs text-[#4da6ff] opacity-60 mb-12 tracking-widest">UAV RECONSTRUCTION ENGINE // VER 4.2.0</div>
        <div className="flex flex-col gap-4">
          <div className="text-[10px] opacity-30">INITIALIZING KERNEL...</div>
          <div className="w-48 h-1 bg-[#161b1d] overflow-hidden relative">
            <div className="absolute inset-0 bg-[#4da6ff] animate-loading" style={{ width: '30%' }} />
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
            <LogView />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black lg:h-screen lg:overflow-hidden grid grid-cols-1 grid-rows-[auto_auto_minmax(26rem,1fr)_auto_auto] lg:grid-cols-[260px_minmax(0,1fr)_260px] lg:grid-rows-[40px_minmax(0,1fr)_120px]">
      <div className="col-span-3 row-start-1">
        <TopBar />
      </div>
      <div className="col-start-1 row-start-2 lg:row-start-2">
        <LeftPanel />
      </div>
      <div className="relative bg-black overflow-hidden col-start-1 row-start-3 lg:col-start-2 lg:row-start-2">
        <Scene />
      </div>
      <div className="col-start-1 row-start-4 lg:col-start-3 lg:row-start-2">
        <RightPanel />
      </div>
      <div className="col-start-1 row-start-5 lg:col-span-3 lg:row-start-3">
        <BottomPanel />
      </div>
    </div>
  );
}

function LogView() {
  const { logs } = useSystemStore();
  return (
    <div className="space-y-1">
      {logs.map((log, i) => (
        <div key={i} className={`flex gap-3 ${log.type === 'sys' ? 'text-[#4da6ff]' : 'text-[#e0e6e9] opacity-70'}`}>
          <span className="opacity-30">[{log.timestamp}]</span>
          <span>{log.text}</span>
        </div>
      ))}
    </div>
  );
}
