"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useSystemStore } from '@/store/useSystemStore';
import { Terminal } from 'lucide-react';

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
    <div className="h-28 border-t border-[#3a4449] bg-[#161b1d] flex flex-col font-mono text-[#e0e6e9]">
      <div className="flex-1 overflow-y-auto p-3 text-[11px] space-y-1" ref={scrollRef}>
        {logs.map((log, i) => (
          <div key={i} className="flex gap-3 opacity-80">
            <span className="opacity-30">[{log.timestamp}]</span>
            <span className={
              log.type === 'sys' ? 'text-[#4da6ff]' :
              log.type === 'warn' ? 'text-[#ffb400]' :
              log.type === 'user' ? 'text-[#e0e6e9]' : 'text-[#00ff88]'
            }>
              {log.type === 'user' ? '> ' : `[${log.type.toUpperCase()}]: `}
              {log.text}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleCommand} className="flex items-center gap-3 px-4 py-2 border-t border-[#3a4449] bg-[#0a0c0d]">
        <Terminal size={14} className="text-[#ffb400]" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ENTER SYSTEM COMMAND..."
          className="flex-1 bg-transparent border-none outline-none text-[12px] font-mono text-[#e0e6e9] placeholder:opacity-30"
          autoFocus
        />
      </form>
    </div>
  );
}
