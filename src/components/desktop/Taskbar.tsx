'use client';

import React, { useState, useEffect } from 'react';
import { RotateCcw, Layers, Sparkles, Clock, ShieldCheck, Gamepad2 } from 'lucide-react';
import Link from 'next/link';
import { soundFX } from '@/lib/soundEffects';

interface TaskbarProps {
  onResetWindows: () => void;
  onBringAllFront: () => void;
  onMinimizeAll: () => void;
  onOpenContact?: () => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({
  onResetWindows,
  onBringAllFront,
  onMinimizeAll,
  onOpenContact,
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

  const handleMinimizeAll = () => {
    soundFX.playWindowClose();
    onMinimizeAll();
  };

  const handleResetWindows = () => {
    soundFX.playClick(680);
    onResetWindows();
  };

  const handleBringAllFront = () => {
    soundFX.playClick(580);
    onBringAllFront();
  };

  return (
    <>
      {/* MOBILE RETRO SYSTEM TOP BAR (Visible on mobile/tablets < 768px) */}
      <header
        role="region"
        aria-label="Mobile system status bar"
        style={{
          top: 'max(0.375rem, env(safe-area-inset-top, 0.375rem))',
        }}
        className="fixed left-2 right-[74px] sm:right-[100px] z-[300] flex md:hidden items-center justify-between gap-1.5 px-2.5 py-1 bg-[rgba(255,250,240,0.96)] backdrop-blur-md rounded-2xl border-2 border-pastel-dark shadow-retro-sm text-xs font-bold pointer-events-auto select-none"
      >
        {/* Left: System Status Pill */}
        <button
          type="button"
          onClick={() => {
            soundFX.playClick(620);
            if (onOpenContact) onOpenContact();
          }}
          className="flex items-center gap-1 px-2 py-0.5 bg-pastel-mint/90 rounded-full border border-pastel-dark text-pastel-dark text-[9.5px] font-extrabold hover:bg-pastel-peach active:scale-95 transition-all truncate"
          title="Open for Freelance Opportunities - Click to Hire Me"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
          <span className="truncate">👾 Ashrut · Hire</span>
        </button>

        {/* Center / Right controls */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Quick Desk Button (Minimize all to reveal desktop) */}
          <button
            type="button"
            onClick={handleMinimizeAll}
            className="retro-btn text-[9.5px] px-2 py-0.5 bg-white hover:bg-pastel-sky active:scale-90"
            title="Minimize all windows to see desktop"
          >
            <Sparkles size={10} strokeWidth={2.5} className="text-amber-500" />
            <span>Desk</span>
          </button>

          {/* Clock */}
          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white rounded-full border border-pastel-dark text-pastel-dark text-[9.5px] font-bold">
            <Clock size={9} strokeWidth={2.5} />
            <span>{time || '--:--'}</span>
          </div>
        </div>
      </header>

      {/* DESKTOP TASKBAR (Visible on screens >= 768px) */}
      <footer 
        role="region"
        aria-label="Desktop taskbar"
        className="fixed bottom-3 right-4 z-[300] hidden md:flex items-center gap-2 p-1.5 sm:p-2 bg-[rgba(255,250,240,0.95)] backdrop-blur-md rounded-full border-[2.5px] border-pastel-dark shadow-retro text-xs font-bold pointer-events-auto select-none"
      >
        {/* Live Status Pill */}
        <button
          type="button"
          onClick={() => {
            soundFX.playClick(620);
            if (onOpenContact) onOpenContact();
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-pastel-mint/80 hover:bg-pastel-mint rounded-full border border-pastel-dark text-pastel-dark cursor-pointer transition-colors"
          title="Open for Freelance Opportunities - Click to message"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
          <span className="text-[11px] whitespace-nowrap">Open for Freelance</span>
        </button>

        {/* Taskbar Action Controls */}
        <button
          type="button"
          onClick={handleResetWindows}
          className="retro-btn text-[11px] px-2.5 py-1 bg-white hover:bg-pastel-peach"
          title="Arrange windows to original positions"
        >
          <RotateCcw size={12} strokeWidth={2.5} />
          <span>Reset</span>
        </button>

        <button
          type="button"
          onClick={handleBringAllFront}
          className="retro-btn text-[11px] px-2.5 py-1 bg-white hover:bg-pastel-lavender"
          title="Bring all open windows forward"
        >
          <Layers size={12} strokeWidth={2.5} />
          <span className="hidden xl:inline">Bring Front</span>
        </button>

        <button
          type="button"
          onClick={handleMinimizeAll}
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
          onClick={() => soundFX.playClick(700)}
          className="p-1.5 rounded-full bg-pastel-peach border border-pastel-dark hover:bg-pastel-pink transition-colors"
          title="Admin Dashboard"
        >
          <ShieldCheck size={14} className="text-pastel-dark" />
        </Link>
      </footer>
    </>
  );
};
