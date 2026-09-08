"use client";
import React from 'react';
import { useSystemStore } from '@/store/useSystemStore';
import { Activity, ShieldCheck } from 'lucide-react';

export default function TopBar() {
  const { missionStatus } = useSystemStore();
  const [time, setTime] = React.useState(new Date().toISOString());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toISOString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-10 border-b border-[#3a4449] bg-[#161b1d] flex items-center justify-between px-4 font-mono text-[10px] text-[#e0e6e9]">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${missionStatus === 'READY' ? 'bg-[#00ff88]' : 'bg-[#ffb400] animate-pulse'}`} />
          <span className="opacity-80">SYS_STATUS: {missionStatus}</span>
        </div>
        <div className="flex items-center gap-1 text-[#4da6ff]">
          <Activity size={12} />
          <span>LINK: STABLE</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <span className="opacity-60">MISSION_ID: SIH26158</span>
        <span className="opacity-80">{time.split('T')[1].split('.')[0]} UTC</span>
        <div className="flex items-center gap-1 text-[#ffb400]">
          <ShieldCheck size={12} />
          <span>ENCRYPTED_TUNNEL: ACTIVE</span>
        </div>
      </div>
    </div>
  );
}
