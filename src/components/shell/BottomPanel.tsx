"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useSystemStore } from '@/store/useSystemStore';
import { Terminal, ChevronRight } from 'lucide-react';
import { HairlineBorder } from './TacticalUI';

export default function BottomPanel() {
  const [input, setInput] = useState('');
  const { logs, addLog } = useSystemStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim();
    addLog(cmd, 'user');
    setInput('');

    const lowerCmd = cmd.toLowerCase();
    if (lowerCmd.includes('highlight buildings above 10')) {
      addLog('QUERY_MATCH: Identifying structures > 10m...', 'sys');
      setTimeout(() => addLog('SENSING_COMPLETE: Entities highlighted in amber.', 'sys'), 1000);
    } else if (lowerCmd.includes('accuracy') || lowerCmd.includes('rmse')) {
      addLog('DATA_DUMP: RMSE=0.43m | COVERAGE=92.1% | CONF=HIGH', 'sys');
    } else if (lowerCmd.includes('tallest')) {
      addLog('QUERY_MATCH: Tallest entity detected at 30.0m', 'sys');
    } else {
      addLog('UNKNOWN_COMMAND: Try "accuracy" or "highlight buildings above 10m"', 'warn');
    }
  };

  return (
    <div className="h-full border-t border-[#2d3436] bg-[#0a0c0d] flex flex-col font-mono text-[#e0e6e9]">
      <div className="flex items-center gap-2 px-4 py-1 bg-[#1a1d1f] border-b border-[#2d3436] text-[9px] opacity-50 uppercase tracking-widest">
        <Terminal size={10} />
        <span>System_Console_v4.2.0</span>
        <span className="ml-auto">Session: Active</span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 text-[11px] space-y-1" ref={scrollRef}>
        {logs.map((log: any, i: number) => (
          <div key={i} className="flex gap-3 opacity-80 group">
            <span className="opacity-30 shrink-0 text-[9px]">{log.timestamp}</span>
            <div className="flex gap-2">
              {log.type === 'user' ? (
                <>
                  <ChevronRight size={12} className="text-[#fbc531] shrink-0" />
                  <span className="text-[#e0e6e9]">{log.text}</span>
                </>
              ) : (
                <>
                  <span className={
                    log.type === 'sys' ? 'text-[#00a8ff]' :
                    log.type === 'warn' ? 'text-[#fbc531]' : 'text-[#4cd137]'
                  }>
                    [{log.type.toUpperCase()}]
                  </span>
                  <span>{log.text}</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleCommand} className="flex items-center gap-3 px-4 py-2 border-t border-[#2d3436] bg-[#0f1214]">
        <div className="flex items-center gap-2 text-[#fbc531] shrink-0">
          <span className="text-[10px] font-bold">ROOT@UAV_SHELL:~$</span>
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="AWAITING_INPUT..."
          className="flex-1 bg-transparent border-none outline-none text-[12px] font-mono text-[#e0e6e9] placeholder:opacity-20"
          autoFocus
        />
      </form>
    </div>
  );
}
