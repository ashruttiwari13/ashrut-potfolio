'use client';

import React, { useState, useEffect } from 'react';
import { RotateCcw, Layers, Sparkles, Clock, ShieldCheck, Sliders } from 'lucide-react';
import Link from 'next/link';

interface TaskbarProps {
  onResetWindows: () => void;
  onBringAllFront: () => void;
  onMinimizeAll: () => void;
  onOpenSettings: () => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({
  onResetWindows,
  onBringAllFront,
  onMinimizeAll,
  onOpenSettings,
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
      className="fixed bottom-2 left-2 right-2 sm:left-auto sm:right-4 z-[280] flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-[rgba(255,250,240,0.94)] dark:bg-[rgba(24,22,34,0.92)] backdrop-blur-md rounded-full border-[2.5px] border-pastel-dark shadow-retro text-xs font-bold pointer-events-auto select-none max-w-full overflow-x-auto no-scrollbar"
      style={{ paddingBottom: 'calc(0.375rem + env(safe-area-inset-bottom, 0px))' }}
    >
      {/* Live Status Pill */}
      <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 bg-pastel-mint/80 border border-pastel-dark text-pastel-dark rounded-full shrink-0">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
        <span className="text-[10px] sm:text-[11px] whitespace-nowrap hidden md:inline">Open for Freelance</span>
        <span className="text-[10px] whitespace-nowrap md:hidden">Available</span>
      </div>

      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        {/* Reset Action */}
        <button
          type="button"
          onClick={onResetWindows}
          className="retro-btn text-[11px] px-2 sm:px-2.5 py-1 bg-white dark:bg-[#252233] hover:bg-pastel-peach min-h-[32px]"
          title="Reset window positions & sizes"
          aria-label="Reset window positions"
        >
          <RotateCcw size={12} strokeWidth={2.5} />
          <span className="hidden sm:inline">Reset</span>
        </button>

        {/* Bring All Front (desktop only) */}
        <button
          type="button"
          onClick={onBringAllFront}
          className="retro-btn text-[11px] px-2 sm:px-2.5 py-1 bg-white dark:bg-[#252233] hover:bg-pastel-lavender min-h-[32px] hidden sm:inline-flex"
          title="Bring all open windows forward"
          aria-label="Bring all windows to front"
        >
          <Layers size={12} strokeWidth={2.5} />
          <span>Front</span>
        </button>

        {/* Minimize All */}
        <button
          type="button"
          onClick={onMinimizeAll}
          className="retro-btn text-[11px] px-2 sm:px-2.5 py-1 bg-white dark:bg-[#252233] hover:bg-pastel-sky min-h-[32px]"
          title="Minimize all windows to desktop"
          aria-label="Minimize all windows"
        >
          <Sparkles size={12} strokeWidth={2.5} />
          <span className="hidden sm:inline">Desk</span>
        </button>

        {/* Settings Button */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="retro-btn text-[11px] px-2 sm:px-2.5 py-1 bg-pastel-peach/70 hover:bg-pastel-pink min-h-[32px]"
          title="System Preferences & Layout Settings"
          aria-label="Open appearance and layout settings"
        >
          <Sliders size={12} strokeWidth={2.5} />
          <span className="hidden md:inline">Theme</span>
        </button>

        {/* Clock */}
        <div className="flex items-center gap-1 px-2 sm:px-2.5 py-1 bg-white dark:bg-[#252233] rounded-full border border-pastel-dark text-pastel-dark text-[10px] sm:text-[11px] shrink-0 min-h-[32px]">
          <Clock size={11} strokeWidth={2.5} />
          <span>{time || '--:--'}</span>
        </div>

        {/* Admin shortcut */}
        <Link
          href="/admin"
          className="p-1.5 rounded-full bg-pastel-peach border border-pastel-dark hover:bg-pastel-pink transition-colors shrink-0 flex items-center justify-center min-w-[32px] min-h-[32px]"
          title="Admin Dashboard"
          aria-label="Admin Dashboard"
        >
          <ShieldCheck size={14} className="text-pastel-dark" />
        </Link>
      </div>
    </footer>
  );
};
