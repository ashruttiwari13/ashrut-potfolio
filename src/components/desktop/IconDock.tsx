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
  const dockRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<Record<string, HTMLElement | null>>({});

  const items: DockItem[] = [
    { id: 'profileWin', label: 'Profile', icon: <User className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" /> },
    { id: 'skillsWin', label: 'Toolbox', icon: <Wrench className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" /> },
    { id: 'projectsWin', label: 'Projects', icon: <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />, badge: 'New' },
    { id: 'achievementsWin', label: 'Awards', icon: <Trophy className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" /> },
    { id: 'hobbiesWin', label: 'Creative', icon: <Camera className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" /> },
    { id: 'gameWin', label: '3D Horror', icon: <Skull className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />, badge: '3D' },
    { id: 'resumeWin', label: 'Resume', icon: <FileText className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" /> },
    { id: 'contactWin', label: 'Hire Me', icon: <Mail className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" /> },
    { id: 'admin', label: 'Admin', icon: <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />, isLink: true, href: '/admin' },
  ];

  // Auto-scroll active tab into view when device is mobile or scrolled
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

  return (
    <nav 
      ref={dockRef}
      role="tablist"
      aria-label="Desktop application tabs"
      className="fixed z-[300] pointer-events-auto select-none
        /* Desktop: Vertical left dock */
        top-4 left-4 flex flex-col gap-3 p-3 rounded-[32px] 
        bg-[rgba(255,250,240,0.95)] backdrop-blur-md border-[3px] border-pastel-peach shadow-retro 
        max-h-[92vh] overflow-y-auto no-scrollbar 
        /* Mobile: Horizontal scrollable tab strip docked comfortably at bottom */
        max-md:top-auto max-md:bottom-3 max-md:left-2.5 max-md:right-2.5
        max-md:flex-row max-md:justify-start sm:max-md:justify-around
        max-md:p-1.5 sm:max-md:p-2 max-md:rounded-full max-md:max-h-none 
        max-md:overflow-x-auto max-md:overflow-y-hidden max-md:gap-1.5 sm:max-md:gap-2
        max-md:scroll-smooth touch-pan-x"
      style={{
        paddingBottom: 'max(0.375rem, env(safe-area-inset-bottom, 0.375rem))',
      }}
    >
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
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className="group relative shrink-0 snap-center flex flex-col items-center justify-center p-1 sm:p-1.5 cursor-pointer transition-transform active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-pastel-dark rounded-2xl min-w-[46px] min-h-[46px]"
            >
              <div className="relative p-2 sm:p-2.5 md:p-3 bg-white rounded-2xl border-[3px] border-pastel-dark shadow-[3px_3px_0_#ffb6c1] group-hover:scale-105 group-hover:shadow-[4px_4px_0_#c0f0dd] transition-all">
                {item.icon}
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold mt-1 text-pastel-dark px-2 py-0.5 rounded-full bg-white/90 border border-pastel-dark/20 max-md:hidden">
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
            onClick={() => onOpenWindow(item.id as WindowId)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            title={item.label}
            aria-label={item.label}
            className="group relative shrink-0 snap-center flex flex-col items-center justify-center p-1 sm:p-1.5 cursor-pointer transition-transform active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-pastel-dark rounded-2xl min-w-[46px] min-h-[46px]"
          >
            {item.badge && (
              <span className="absolute -top-1 -right-1 z-10 px-1.5 py-0.2 text-[9px] font-extrabold uppercase bg-pastel-pink text-pastel-dark border border-pastel-dark rounded-full shadow-sm animate-bounce">
                {item.badge}
              </span>
            )}
            <div
              className={`relative p-2 sm:p-2.5 md:p-3 rounded-2xl border-[3px] border-pastel-dark transition-all ${
                isTopmost
                  ? 'bg-pastel-mint shadow-[3px_3px_0_#3d3d3d] scale-105 ring-2 ring-pastel-dark'
                  : isOpen
                  ? 'bg-pastel-peach/60 shadow-[3px_3px_0_#c0f0dd]'
                  : 'bg-white shadow-[3px_3px_0_#c0f0dd] group-hover:scale-105 group-hover:shadow-[4px_4px_0_#ffb6c1]'
              }`}
            >
              {item.icon}
            </div>
            <span
              className={`text-[10px] sm:text-[11px] font-bold mt-1 text-pastel-dark px-2 py-0.5 rounded-full transition-colors max-md:hidden ${
                isTopmost
                  ? 'bg-pastel-peach border border-pastel-dark'
                  : isOpen
                  ? 'bg-pastel-mint/80 border border-pastel-dark/30'
                  : 'bg-white/90 border border-pastel-dark/20'
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
