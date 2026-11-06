'use client';

import React, { useState, useEffect } from 'react';
import { RotateCcw, Layers, Sparkles, Clock, ShieldCheck, ChevronLeft, ChevronRight, Palette } from 'lucide-react';
import Link from 'next/link';
import { soundFX } from '@/lib/soundEffects';
import { useTheme } from '@/context/ThemeContext';

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
  const { isPanda, toggleTheme } = useTheme();
  const [time, setTime] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

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

  const handleToggleExpand = () => {
    if (isExpanded) {
      soundFX.playWindowClose();
      setIsExpanded(false);
    } else {
      soundFX.playWindowOpen();
      setIsExpanded(true);
    }
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
        className={`fixed left-2 right-[74px] sm:right-[100px] z-[300] flex md:hidden items-center justify-between gap-1.5 px-2.5 py-1 backdrop-blur-md rounded-2xl border-2 shadow-retro-sm text-xs font-bold pointer-events-auto select-none transition-colors duration-300 ${
          isPanda 
            ? 'bg-[#0c0f22]/92 border-purple-500/40 text-white shadow-[0_4px_20px_rgba(0,0,0,0.6)]' 
            : 'bg-[rgba(255,250,240,0.96)] border-pastel-dark text-pastel-dark'
        }`}
      >
        {/* Left: System Status Pill */}
        <button
          type="button"
          onClick={() => {
            soundFX.playClick(620);
            if (onOpenContact) onOpenContact();
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-black active:scale-95 transition-all truncate ${
            isPanda 
              ? 'bg-purple-950/80 border-purple-500/40 text-purple-200 hover:bg-purple-900' 
              : 'bg-pastel-mint/90 border-pastel-dark text-pastel-dark hover:bg-pastel-peach'
          }`}
          title="Open for Freelance Opportunities - Click to Hire Me"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <span className="truncate">{isPanda ? '🐼 Ashrut · Hire 🎋' : '👾 Ashrut · Hire'}</span>
        </button>

        {/* Center / Right controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Theme Shift Button (Mobile) */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`retro-btn text-xs font-black px-2.5 py-1 active:scale-90 flex items-center gap-1 ${
              isPanda 
                ? 'bg-[#141833] text-white border-purple-500/40 hover:bg-purple-900' 
                : 'bg-white text-pastel-dark hover:bg-pastel-peach'
            }`}
            title={isPanda ? "Switch to Cat theme (click to shift)" : "Switch to Panda theme (click to shift)"}
            aria-label="Shift website theme"
          >
            <span>{isPanda ? '🐼' : '🐱'}</span>
            <span>{isPanda ? 'Panda' : 'Cat'}</span>
          </button>

          {/* Quick Desk Button (Minimize all to reveal desktop) */}
          <button
            type="button"
            onClick={handleMinimizeAll}
            className={`retro-btn text-xs font-black px-2.5 py-1 active:scale-90 ${
              isPanda 
                ? 'bg-[#141833] text-white border-purple-500/40 hover:bg-purple-900' 
                : 'bg-white text-pastel-dark hover:bg-pastel-sky'
            }`}
            title="Minimize all windows to see desktop"
          >
            <Sparkles size={12} strokeWidth={2.5} className={isPanda ? "text-purple-300" : "text-emerald-600"} />
            <span>{isPanda ? 'Desk 🎋' : 'Desk'}</span>
          </button>

          {/* Clock */}
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-black ${
            isPanda 
              ? 'bg-[#10142c] border-purple-500/30 text-purple-200' 
              : 'bg-white border-pastel-dark text-pastel-dark'
          }`}>
            <Clock size={11} strokeWidth={2.5} />
            <span>{time || '--:--'}</span>
          </div>
        </div>
      </header>

      {/* DESKTOP TASKBAR (Compressible / Sideways Collapsible Tab on screens >= 768px) */}
      <footer 
        role="region"
        aria-label="Desktop taskbar"
        className={`fixed bottom-3 right-4 z-[300] hidden md:flex items-center backdrop-blur-md rounded-full border-[2.5px] shadow-retro text-xs font-bold pointer-events-auto select-none transition-all duration-300 ease-out ${
          isPanda 
            ? 'bg-[#0c0f22]/90 border-purple-500/40 text-white shadow-[0_8px_32px_rgba(0,0,0,0.7),0_0_20px_rgba(139,92,246,0.25)]' 
            : 'bg-[rgba(255,255,255,0.96)] border-pastel-dark text-pastel-dark'
        }`}
      >
        {!isExpanded ? (
          /* Compressed / Compact State: Click anywhere to open sideways */
          <button
            type="button"
            onClick={handleToggleExpand}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full active:scale-95 transition-all cursor-pointer group ${
              isPanda ? 'hover:bg-purple-900/30 text-white' : 'hover:bg-pastel-mint/30 text-pastel-dark'
            }`}
            title="Click to expand toolbar sideways"
            aria-expanded={false}
          >
            <div className={`p-1 rounded-full border group-hover:-translate-x-0.5 transition-transform flex items-center justify-center ${
              isPanda ? 'bg-purple-900 border-purple-400 text-purple-200' : 'bg-pastel-mint border-pastel-dark text-pastel-dark'
            }`}>
              <ChevronLeft size={13} strokeWidth={3} />
            </div>
            <span className={`w-2.5 h-2.5 rounded-full animate-ping shrink-0 ${isPanda ? 'bg-purple-400 shadow-[0_0_8px_#c084fc]' : 'bg-emerald-500'}`} />
            <span className="text-xs sm:text-sm font-black tracking-tight">
              {isPanda ? 'Moonlit Panda 🎋' : 'Retro OS 🐱'}
            </span>
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-black ${
              isPanda ? 'bg-[#121630] border-purple-500/30 text-purple-200' : 'bg-white border-pastel-dark text-pastel-dark'
            }`}>
              <Clock size={12} strokeWidth={2.5} />
              <span>{time || '--:--'}</span>
            </div>
          </button>
        ) : (
          /* Full Expanded State: Slides open sideways with all controls */
          <div className="flex items-center gap-2.5 p-2 animate-fadeIn">
            {/* Compress Button */}
            <button
              type="button"
              onClick={handleToggleExpand}
              className={`p-1.5 rounded-full border transition-all cursor-pointer hover:translate-x-0.5 active:scale-90 ${
                isPanda 
                  ? 'bg-purple-950 border-purple-400 text-purple-200 hover:bg-purple-900' 
                  : 'bg-pastel-mint border-pastel-dark text-pastel-dark hover:bg-pastel-peach'
              }`}
              title="Compress toolbar sideways"
              aria-expanded={true}
              aria-label="Compress toolbar"
            >
              <ChevronRight size={15} strokeWidth={3} />
            </button>

            {/* Live Status Pill */}
            <button
              type="button"
              onClick={() => {
                soundFX.playClick(620);
                if (onOpenContact) onOpenContact();
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border cursor-pointer transition-colors ${
                isPanda 
                  ? 'bg-purple-950/80 border-purple-500/40 text-purple-200 hover:bg-purple-900' 
                  : 'bg-pastel-mint/90 border-pastel-dark text-pastel-dark hover:bg-pastel-mint'
              }`}
              title="Open for Freelance Opportunities - Click to message"
            >
              <span className={`w-2 h-2 rounded-full animate-ping shrink-0 ${isPanda ? 'bg-purple-400' : 'bg-emerald-500'}`} />
              <span className="text-xs sm:text-sm font-black whitespace-nowrap">
                {isPanda ? 'Open for Freelance 🎋' : 'Open for Freelance'}
              </span>
            </button>

            {/* Theme Shift Button (Desktop) */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`retro-btn text-xs sm:text-sm font-black px-3 py-1.5 active:scale-95 flex items-center gap-1.5 transition-all shadow-retro-sm ${
                isPanda 
                  ? 'bg-[#141833] text-white border-purple-500/40 hover:bg-purple-900/50' 
                  : 'bg-white text-pastel-dark hover:bg-pastel-peach'
              }`}
              title={isPanda ? "Currently Panda Theme. Click to switch to Cat Theme 🐱" : "Currently Cat Theme. Click to switch to Panda Theme 🐼"}
              aria-label="Shift between Panda and Cat themes"
            >
              <span className="text-base shrink-0">{isPanda ? '🐼' : '🐱'}</span>
              <span>{isPanda ? 'Panda Mode' : 'Cat Mode'}</span>
              <span className={`text-[9.5px] font-black px-2 py-0.5 rounded-full border shrink-0 ${
                isPanda ? 'bg-purple-600 border-purple-400 text-white' : 'bg-pastel-mint border-pastel-dark text-pastel-dark'
              }`}>
                Shift ⇄
              </span>
            </button>

            {/* Taskbar Action Controls */}
            <button
              type="button"
              onClick={handleResetWindows}
              className={`retro-btn text-xs sm:text-sm font-black px-3 py-1.5 ${
                isPanda ? 'bg-[#141833] text-white border-purple-500/40 hover:bg-purple-900/50' : 'bg-white hover:bg-pastel-peach'
              }`}
              title="Arrange windows to original positions"
            >
              <RotateCcw size={12} strokeWidth={2.5} />
              <span>Reset</span>
            </button>

            <button
              type="button"
              onClick={handleBringAllFront}
              className={`retro-btn text-[11px] px-2.5 py-1 ${
                isPanda ? 'bg-[#141833] text-white border-purple-500/40 hover:bg-purple-900/50' : 'bg-white hover:bg-pastel-lavender'
              }`}
              title="Bring all open windows forward"
            >
              <Layers size={12} strokeWidth={2.5} />
              <span className="hidden xl:inline">Bring Front</span>
            </button>

            <button
              type="button"
              onClick={handleMinimizeAll}
              className={`retro-btn text-[11px] px-2.5 py-1 ${
                isPanda ? 'bg-[#141833] text-white border-purple-500/40 hover:bg-purple-900/50' : 'bg-white hover:bg-pastel-sky'
              }`}
              title="Minimize / hide all windows to reveal desktop"
            >
              <Sparkles size={12} strokeWidth={2.5} className={isPanda ? "text-purple-300" : ""} />
              <span>Desk</span>
            </button>

            {/* Clock */}
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full border text-[11px] ${
              isPanda ? 'bg-[#10142c] border-purple-500/30 text-purple-200' : 'bg-white border-pastel-dark text-pastel-dark'
            }`}>
              <Clock size={11} strokeWidth={2.5} />
              <span>{time || '--:--'}</span>
            </div>

            {/* Admin shortcut */}
            <Link
              href="/admin"
              onClick={() => soundFX.playClick(700)}
              className={`p-1.5 rounded-full border transition-colors ${
                isPanda ? 'bg-purple-950 border-purple-400 text-purple-200 hover:bg-purple-800' : 'bg-pastel-peach border-pastel-dark text-pastel-dark hover:bg-pastel-pink'
              }`}
              title="Admin Dashboard"
            >
              <ShieldCheck size={14} />
            </Link>
          </div>
        )}
      </footer>
    </>
  );
};
