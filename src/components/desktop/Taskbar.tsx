'use client';

import React, { useState, useEffect } from 'react';
import { RotateCcw, Layers, Sparkles, Clock, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface TaskbarProps {
  onResetWindows: () => void;
  onBringAllFront: () => void;
  onMinimizeAll: () => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({
  onResetWindows,
  onBringAllFront,
  onMinimizeAll,
}) => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer 
      role="region"
      aria-label="Desktop taskbar"
      className="fixed bottom-3 right-4 z-[300] flex items-center gap-2 p-1.5 sm:p-2 bg-[rgba(255,250,240,0.95)] backdrop-blur-md rounded-full border-[2.5px] border-pastel-dark shadow-retro text-xs font-bold max-md:hidden pointer-events-auto"
    >
      {/* Live Status Pill */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-pastel-mint/80 rounded-full border border-pastel-dark text-pastel-dark" title="Open for Freelance Opportunities">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
        <span className="text-[11px] whitespace-nowrap hidden xl:inline">Open for Freelance</span>
      </div>

      {/* Taskbar Action Controls */}
      <button
        type="button"
        onClick={onResetWindows}
        className="retro-btn text-[11px] px-2.5 py-1 bg-white hover:bg-pastel-peach"
        title="Arrange windows to original positions"
      >
        <RotateCcw size={12} strokeWidth={2.5} />
        <span>Reset</span>
      </button>

      <button
        type="button"
        onClick={onBringAllFront}
        className="retro-btn text-[11px] px-2.5 py-1 bg-white hover:bg-pastel-lavender"
        title="Bring all open windows forward"
      >
        <Layers size={12} strokeWidth={2.5} />
        <span className="hidden xl:inline">Bring Front</span>
      </button>

      <button
        type="button"
        onClick={onMinimizeAll}
        className="retro-btn text-[11px] px-2.5 py-1 bg-white hover:bg-pastel-sky"
        title="Minimize / hide all windows to reveal desktop"
      >
        <Sparkles size={12} strokeWidth={2.5} />
        <span>Desk</span>
      </button>

      {/* Clock */}
      <div className="flex items-center gap-1 px-3 py-1 bg-white rounded-full border border-pastel-dark text-pastel-dark text-[11px]">
        <Clock size={11} strokeWidth={2.5} />
        <span>{time || '--:--'}</span>
      </div>

      {/* Admin shortcut */}
      <Link
        href="/admin"
        className="p-1.5 rounded-full bg-pastel-peach border border-pastel-dark hover:bg-pastel-pink transition-colors"
        title="Admin Dashboard"
      >
        <ShieldCheck size={14} className="text-pastel-dark" />
      </Link>
    </footer>
  );
};
