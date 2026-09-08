"use client";
import React from 'react';

export const HairlineBorder = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`relative border border-[#2d3436] ${className}`}>
    {/* Corner Brackets */}
    <div className="absolute -top-[1px] -left-[1px] w-1 h-1 border-t border-l border-[#00a8ff]" />
    <div className="absolute -top-[1px] -right-[1px] w-1 h-1 border-t border-r border-[#00a8ff]" />
    <div className="absolute -bottom-[1px] -left-[1px] w-1 h-1 border-b border-l border-[#00a8ff]" />
    <div className="absolute -bottom-[1px] -right-[1px] w-1 h-1 border-b border-r border-[#00a8ff]" />
    {children}
  </div>
);

export const Sparkline = ({ data, color = "#00a8ff" }: { data: number[], color?: string }) => {
  if (!data || data.length < 2) return <div className="w-full h-full bg-transparent" />;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 40;
  const height = 12;
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="opacity-80">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1"
        points={points}
      />
    </svg>
  );
};

export const TechnicalLabel = ({ label, value, highlight = false }: { label: string, value: React.ReactNode, highlight?: boolean }) => (
  <div className="flex justify-between items-center gap-2 py-0.5 border-b border-[#2d3436]/50">
    <span className="text-[9px] opacity-40 uppercase tracking-tighter">{label}</span>
    <span className={`text-[10px] font-mono ${highlight ? 'text-[#00a8ff]' : 'text-[#dcdde1]'}`}>{value}</span>
  </div>
);

export const StatusIndicator = ({ status, label }: { status: 'ACTIVE' | 'IDLE' | 'WARN' | 'CRITICAL', label: string }) => {
  const colors = {
    ACTIVE: 'bg-[#4cd137]',
    IDLE: 'bg-[#00a8ff]',
    WARN: 'bg-[#fbc531]',
    CRITICAL: 'bg-[#ff4444]',
  };
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-1 h-1 rounded-full ${colors[status]} ${status === 'CRITICAL' ? 'animate-pulse' : ''}`} />
      <span className="text-[8px] opacity-60 uppercase">{label}</span>
    </div>
  );
};

export const DataGrid = ({ children, cols = 2 }: { children: React.ReactNode, cols?: number }) => (
  <div className={`grid grid-cols-${cols} gap-x-4 gap-y-2`}>
    {children}
  </div>
);
