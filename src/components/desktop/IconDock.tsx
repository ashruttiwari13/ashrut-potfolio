'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  User, 
  Wrench, 
  Gamepad2, 
  Trophy, 
  Camera, 
  FileText, 
  Mail, 
  ShieldCheck,
  Skull 
} from 'lucide-react';
import { WindowId } from '@/types';
import { soundFX } from '@/lib/soundEffects';
import { useTheme } from '@/context/ThemeContext';

interface IconDockProps {
  onOpenWindow: (id: WindowId) => void;
  activeWindows: Record<WindowId, boolean>;
  activeWindowId?: WindowId | null;
}

interface DockItem {
  id: WindowId | 'admin';
  label: string;
  icon: React.ReactNode;
  badge?: string;
  isLink?: boolean;
  href?: string;
}

export const IconDock: React.FC<IconDockProps> = ({ 
  onOpenWindow, 
  activeWindows,
  activeWindowId,
}) => {
  const { isPanda, toggleTheme } = useTheme();
  const dockRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<Record<string, HTMLElement | null>>({});

  const items: DockItem[] = [
    { id: 'profileWin', label: 'Profile', icon: <User className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> },
    { id: 'skillsWin', label: 'Toolbox', icon: <Wrench className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> },
    { id: 'projectsWin', label: 'Projects', icon: <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />, badge: 'New' },
    { id: 'achievementsWin', label: 'Awards', icon: <Trophy className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> },
    { id: 'hobbiesWin', label: 'Hobbies', icon: <Camera className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />, badge: 'Film' },
    { id: 'gameWin', label: '3D Horror', icon: <Skull className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />, badge: '3D' },
    { id: 'resumeWin', label: 'Resume', icon: <FileText className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> },
    { id: 'contactWin', label: 'Hire Me', icon: <Mail className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> },
    { id: 'admin', label: 'Admin', icon: <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />, isLink: true, href: '/admin' },
  ];

  // Auto-scroll active tab into view when device is mobile
  useEffect(() => {
    if (activeWindowId && itemRefs.current[activeWindowId]) {
      const el = itemRefs.current[activeWindowId];
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        el?.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        });
      }
    }
  }, [activeWindowId]);

  // Arrow key navigation between dock tabs
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let targetIndex = -1;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      targetIndex = (index + 1) % items.length;
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      targetIndex = (index - 1 + items.length) % items.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      targetIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      targetIndex = items.length - 1;
    }

    if (targetIndex >= 0) {
      const nextItem = items[targetIndex];
      const el = itemRefs.current[nextItem.id];
      el?.focus();
    }
  };

  const handleItemClick = (id: WindowId) => {
    soundFX.playClick(580);
    onOpenWindow(id);
  };

  return (
    <nav 
      ref={dockRef}
      role="tablist"
      aria-label="Desktop application tabs"
      className={`fixed z-[300] pointer-events-auto select-none
        /* Left vertical dock on desktop */
        top-4 left-3.5 sm:left-4 flex flex-col items-center gap-2 p-2.5 sm:p-3 rounded-[30px]
        ${isPanda 
          ? 'bg-[#0c0f22]/90 backdrop-blur-2xl border-[2.5px] border-purple-500/40 shadow-[0_8px_32px_rgba(0,0,0,0.7),0_0_25px_rgba(139,92,246,0.25)]' 
          : 'bg-[rgba(255,255,255,0.97)] backdrop-blur-md border-[3px] sm:border-[3.5px] border-pastel-mint shadow-retro'}
        max-h-[calc(100vh-32px)] overflow-y-auto dock-scrollbar scroll-smooth overscroll-contain
        /* Mobile: Sleek horizontal bottom toolbar with tactile touch targets */
        max-md:top-auto max-md:bottom-2 max-md:left-2 max-md:right-2
        max-md:flex-row max-md:justify-start
        max-md:p-1.5 max-md:rounded-2xl max-md:max-h-none 
        max-md:overflow-x-auto max-md:overflow-y-hidden max-md:gap-2
        max-md:no-scrollbar touch-pan-x transition-colors duration-300`}
      style={{
        paddingBottom: 'max(0.375rem, env(safe-area-inset-bottom, 0.375rem))',
      }}
    >
      {/* Mascot Top Badge / Theme Switcher (Desktop only) */}
      <div className="relative hidden md:flex flex-col items-center mb-1">
        {/* Cute Ears on Dock Top */}
        {isPanda ? (
          <div className="absolute -top-4 flex justify-between w-9 pointer-events-none">
            <div className="w-3.5 h-3.5 rounded-full bg-[#12152b] border border-purple-500/60 shadow-[0_0_8px_rgba(168,85,247,0.5)] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_#c084fc]" />
            </div>
            <div className="w-3.5 h-3.5 rounded-full bg-[#12152b] border border-purple-500/60 shadow-[0_0_8px_rgba(168,85,247,0.5)] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_#c084fc]" />
            </div>
          </div>
        ) : (
          <div className="absolute -top-3.5 flex justify-between w-9 pointer-events-none">
            <div 
              className="w-3.5 h-3.5 bg-pastel-dark flex items-center justify-center"
              style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
            >
              <div 
                className="w-1.5 h-1.5 bg-pastel-pink mt-0.5"
                style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
              />
            </div>
            <div 
              className="w-3.5 h-3.5 bg-pastel-dark flex items-center justify-center"
              style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
            >
              <div 
                className="w-1.5 h-1.5 bg-pastel-pink mt-0.5"
                style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
              />
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={toggleTheme}
          className={`flex flex-col items-center p-1 rounded-2xl active:scale-90 transition-all cursor-pointer group ${
            isPanda ? 'hover:bg-purple-900/40' : 'hover:bg-pastel-peach/50'
          }`}
          title={isPanda ? "Theme: Moonlit Cyber Panda (Click to switch to Cat Mode 🐱)" : "Theme: Cat Mode (Click to switch to Panda Mode 🐼)"}
          aria-label="Shift website theme"
        >
          {isPanda ? (
            <div className="w-7 h-7 rounded-full border-2 border-purple-400 shadow-[0_0_10px_#a855f7] overflow-hidden group-hover:scale-110 transition-transform">
              <img
                src="/assets/gamer_panda_avatar.png"
                alt="Gamer Panda"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <span className="text-xl group-hover:scale-115 transition-transform">
              🐱
            </span>
          )}
          <span className={`text-[8px] font-black px-1.5 py-0.2 rounded-full border mt-0.5 shadow-2xs ${
            isPanda 
              ? 'bg-purple-900/80 border-purple-400 text-purple-200' 
              : 'bg-pastel-mint border-pastel-dark/40 text-pastel-dark'
          }`}>
            {isPanda ? 'Panda' : 'Cat'}
          </span>
        </button>
      </div>
      {items.map((item, idx) => {
        const isOpen = item.id !== 'admin' && activeWindows[item.id as WindowId];
        const isTopmost = activeWindowId ? item.id === activeWindowId : isOpen;

        if (item.isLink && item.href) {
          return (
            <Link
              key={item.id}
              ref={(el) => { itemRefs.current[item.id] = el; }}
              href={item.href}
              title={item.label}
              aria-label={item.label}
              onClick={() => soundFX.playClick(640)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className="group relative shrink-0 snap-center flex flex-col items-center justify-center p-0.5 sm:p-1 cursor-pointer transition-transform active:scale-95 focus:outline-none rounded-xl sm:rounded-2xl min-w-[46px] sm:min-w-[48px] md:min-w-[52px]"
            >
              <div className={`relative p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 ${
                isPanda 
                  ? 'bg-[#141833] border-purple-500/40 text-purple-200 shadow-[0_0_10px_rgba(0,0,0,0.5)] group-hover:scale-105 md:group-hover:translate-x-1.5 group-hover:border-purple-400 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                  : 'bg-white border-pastel-dark shadow-[1.5px_1.5px_0_#ffaec0] sm:shadow-[2px_2px_0_#ffaec0] group-hover:scale-105 md:group-hover:translate-x-1.5 group-hover:shadow-[3px_3px_0_#7ecb9a]'
              }`}>
                {item.icon}
              </div>
              <span className={`text-[9.5px] sm:text-[10.5px] md:text-xs font-black mt-1 px-2 py-0.5 rounded-full whitespace-nowrap shadow-xs ${
                isPanda 
                  ? 'bg-[#121630]/95 text-purple-200 border border-purple-500/30'
                  : 'bg-white/95 text-pastel-dark border border-pastel-dark/20'
              }`}>
                {item.label}
              </span>
            </Link>
          );
        }

        return (
          <button
            key={item.id}
            ref={(el) => { itemRefs.current[item.id] = el; }}
            role="tab"
            aria-selected={isTopmost}
            aria-controls={item.id}
            type="button"
            onClick={() => handleItemClick(item.id as WindowId)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            title={item.label}
            aria-label={item.label}
            className="group relative shrink-0 snap-center flex flex-col items-center justify-center p-0.5 sm:p-1 cursor-pointer transition-transform active:scale-95 focus:outline-none rounded-xl sm:rounded-2xl min-w-[46px] sm:min-w-[48px] md:min-w-[52px]"
          >
            {item.badge && (
              <span className={`absolute -top-1 -right-0.5 z-10 px-1 py-0.2 text-[7.5px] sm:text-[8.5px] font-extrabold uppercase rounded-full shadow-xs animate-bounce pointer-events-none ${
                isPanda
                  ? 'bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white border border-purple-300 shadow-[0_0_8px_#c084fc]'
                  : 'bg-pastel-pink text-pastel-dark border border-pastel-dark'
              }`}>
                {item.badge}
              </span>
            )}
            <div
              className={`relative p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 ${
                isPanda
                  ? isTopmost
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-[0_0_18px_rgba(168,85,247,0.6)] md:translate-x-1.5 scale-105'
                    : isOpen
                    ? 'bg-[#1a1e3e] text-purple-200 border-purple-400/60 shadow-[0_0_12px_rgba(139,92,246,0.3)] md:translate-x-0.5'
                    : 'bg-[#121630] text-slate-300 border-purple-500/30 group-hover:scale-105 md:group-hover:translate-x-1.5 group-hover:border-purple-400 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                  : isTopmost
                  ? 'bg-pastel-mint border-pastel-dark shadow-[2px_2px_0_#3d3d3d] md:translate-x-1.5 scale-105 ring-2 ring-pastel-dark'
                  : isOpen
                  ? 'bg-pastel-peach/90 border-pastel-dark shadow-[1.5px_1.5px_0_#3d3d3d] md:translate-x-0.5'
                  : 'bg-white border-pastel-dark shadow-[1.5px_1.5px_0_#7ecb9a] group-hover:scale-105 md:group-hover:translate-x-1.5 group-hover:shadow-[3px_3px_0_#ffaec0]'
              }`}
            >
              {item.icon}
              {/* Active window indicator dot */}
              {isOpen && (
                <span className={`absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full max-md:hidden ${
                  isPanda ? 'bg-purple-400 shadow-[0_0_6px_#c084fc]' : 'bg-pastel-dark'
                }`} />
              )}
              {isOpen && (
                <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full md:hidden ${
                  isPanda ? 'bg-purple-400 shadow-[0_0_6px_#c084fc]' : 'bg-pastel-dark'
                }`} />
              )}
            </div>
            <span
              className={`text-[9.5px] sm:text-[10.5px] md:text-xs font-black mt-1 px-2 py-0.5 rounded-full transition-colors whitespace-nowrap shadow-xs ${
                isPanda
                  ? isTopmost
                    ? 'bg-purple-600 text-white border border-purple-400'
                    : isOpen
                    ? 'bg-purple-950/80 text-purple-200 border border-purple-500/40'
                    : 'bg-[#10142c]/90 text-slate-300 border border-purple-500/25'
                  : isTopmost
                  ? 'bg-pastel-peach border border-pastel-dark text-pastel-dark'
                  : isOpen
                  ? 'bg-pastel-mint/90 border border-pastel-dark/40 text-pastel-dark'
                  : 'bg-white/95 border border-pastel-dark/20 text-pastel-dark'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
