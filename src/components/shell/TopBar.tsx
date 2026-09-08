"use client";
import React from 'react';
import { useSystemStore } from '@/store/useSystemStore';
import { Activity, ShieldCheck, Cpu, Database } from 'lucide-react';

export default function TopBar() {
  const { missionStatus } = useSystemStore();
  const [time, setTime] = React.useState(new Date().toISOString());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toISOString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-10 border-b border-[#2d3436] bg-[#0a0c0d] flex items-center justify-between px-4 font-mono text-[10px] text-[#dcdde1] select-none">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${missionStatus === 'READY' ? 'bg-[#4cd137]' : 'bg-[#fbc531] animate-pulse'}`} />
          <span className="opacity-60 uppercase tracking-tighter">Sys_Status: {missionStatus}</span>
        </div>
        <div className="flex items-center gap-1 text-[#00a8ff]">
          <Activity size={10} />
          <span className="opacity-80">UAV_LINK: ACTIVE</span>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 opacity-60">
          <Cpu size={10} />
          <span>VRAM: 6.2GB / 8.0GB</span>
        </div>
        <div className="flex items-center gap-2 opacity-60">
          <Database size={10} />
          <span>SAMPLES: 1,142 / 18,000</span>
        </div>
        <span className="text-[#fbc531] font-bold">MISSION_ID: SIH26158</span>
        <span className="opacity-80">{time.split('T')[1].split('.')[0]} UTC</span>
        <div className="flex items-center gap-1 text-[#4cd137]">
          <ShieldCheck size={10} />
          <span className="opacity-80">SECURE_SESSION</span>
        </div>
      </div>
    </div>
  );
}
