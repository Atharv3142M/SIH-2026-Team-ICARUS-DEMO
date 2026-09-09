"use client";
import React from 'react';
import { useSystemStore } from '@/store/useSystemStore';
import { Activity, ShieldCheck, Cpu, Signal } from 'lucide-react';
import { Sparkline } from './TacticalUI';

export default function TopBar() {
  const { missionStatus } = useSystemStore();
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock system health data
  const [health, setHealth] = React.useState({
    cpu: [20, 30, 25, 40, 35, 50, 45],
    gpu: [60, 65, 70, 62, 68, 75, 70],
    vram: [40, 41, 40, 42, 41, 43, 42],
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      setHealth(prev => ({
        cpu: [...prev.cpu.slice(1), Math.floor(Math.random() * 40) + 20],
        gpu: [...prev.gpu.slice(1), Math.floor(Math.random() * 30) + 50],
        vram: [...prev.vram.slice(1), Math.floor(Math.random() * 5) + 40],
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toISOString().replace('T', ' ').replace('Z', '').substring(0, 23);
  };

  return (
    <header className="min-h-10 border-b border-[#2d3436] bg-[#0a0c0d] flex flex-wrap items-center justify-between gap-3 px-4 py-2 font-mono text-[10px] text-[#dcdde1] select-none lg:h-full lg:flex-nowrap lg:py-0">
      <div className="flex items-center gap-3 sm:gap-6">
        <div className="flex items-center gap-3 border-r border-[#2d3436] pr-6">
          <div className={`w-2 h-2 rounded-full ${missionStatus === 'READY' ? 'bg-[#4cd137]' : 'bg-[#fbc531] animate-pulse'}`} />
          <div className="flex flex-col leading-none">
            <span className="text-[8px] opacity-40 uppercase tracking-tighter">System_Status</span>
            <span className="text-[#dcdde1] font-bold">{missionStatus}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[#00a8ff]">
            <Signal size={12} />
            <div className="flex flex-col leading-none">
              <span className="text-[8px] opacity-40 uppercase tracking-tighter">Link_Quality</span>
              <span className="text-[10px] opacity-80 font-bold">STABLE [98%]</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[#4cd137]">
            <Activity size={12} />
            <div className="flex flex-col leading-none">
              <span className="text-[8px] opacity-40 uppercase tracking-tighter">Latency</span>
              <span className="text-[10px] opacity-80 font-bold">12ms</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden items-center gap-8 xl:flex">
        <div className="flex items-center gap-4 border-l border-[#2d3436] pl-6">
          <div className="flex items-center gap-3">
            <Cpu size={12} className="opacity-40" />
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center">
                <Sparkline data={health.cpu} color="#00a8ff" />
                <span className="text-[8px] opacity-40 uppercase">CPU</span>
              </div>
              <div className="flex flex-col items-center">
                <Sparkline data={health.gpu} color="#fbc531" />
                <span className="text-[8px] opacity-40 uppercase">GPU</span>
              </div>
              <div className="flex flex-col items-center">
                <Sparkline data={health.vram} color="#4cd137" />
                <span className="text-[8px] opacity-40 uppercase">VRAM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end leading-none">
            <span className="text-[8px] opacity-40 uppercase tracking-tighter">Universal_Time</span>
            <span className="text-[#fbc531] font-bold tracking-widest">{formatTime(time)}</span>
          </div>
          <div className="flex items-center gap-2 text-[#4cd137] border-l border-[#2d3436] pl-6">
            <ShieldCheck size={12} />
            <span className="text-[10px] opacity-80 font-bold">SECURE_SESSION</span>
          </div>
        </div>
      </div>
    </header>
  );
}
