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
    { id: 'hobbiesWin', label: 'Hobbies', icon: <Camera className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />, badge: 'Film' },
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
        /* Left vertical dock on desktop */
        top-4 left-3.5 sm:left-4 flex flex-col items-center gap-1.5 p-2 rounded-[28px]
        bg-[rgba(255,250,240,0.96)] backdrop-blur-md border-[3px] border-pastel-peach shadow-retro
        max-h-[calc(100vh-32px)] overflow-y-auto dock-scrollbar scroll-smooth overscroll-contain
        /* Mobile: Horizontal scrollable bottom bar */
        max-md:top-auto max-md:bottom-2.5 max-md:left-2 max-md:right-2
        max-md:flex-row max-md:justify-start sm:max-md:justify-around
        max-md:p-1.5 max-md:rounded-full max-md:max-h-none 
        max-md:overflow-x-auto max-md:overflow-y-hidden max-md:gap-1.5
        touch-pan-x"
      style={{
        paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0.5rem))',
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
              className="group relative shrink-0 snap-center flex flex-col items-center justify-center p-1 cursor-pointer transition-transform active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-pastel-dark rounded-2xl min-w-[46px] sm:min-w-[54px]"
            >
              <div className="relative p-1.5 sm:p-2 bg-white rounded-2xl border-[2.5px] border-pastel-dark shadow-[2px_2px_0_#ffb6c1] group-hover:scale-105 md:group-hover:translate-x-1.5 group-hover:shadow-[3px_3px_0_#c0f0dd] transition-all duration-200">
                {item.icon}
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold mt-0.5 text-pastel-dark px-1.5 py-0.2 rounded-full bg-white/90 border border-pastel-dark/20 whitespace-nowrap">
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
            className="group relative shrink-0 snap-center flex flex-col items-center justify-center p-1 cursor-pointer transition-transform active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-pastel-dark rounded-2xl min-w-[46px] sm:min-w-[54px]"
          >
            {item.badge && (
              <span className="absolute -top-1 -right-0.5 z-10 px-1.5 py-0.2 text-[8px] sm:text-[9px] font-extrabold uppercase bg-pastel-pink text-pastel-dark border border-pastel-dark rounded-full shadow-xs animate-bounce pointer-events-none">
                {item.badge}
              </span>
            )}
            <div
              className={`relative p-1.5 sm:p-2 rounded-2xl border-[2.5px] border-pastel-dark transition-all duration-200 ${
                isTopmost
                  ? 'bg-pastel-mint shadow-[2.5px_2.5px_0_#3d3d3d] md:translate-x-1.5 scale-105 ring-2 ring-pastel-dark'
                  : isOpen
                  ? 'bg-pastel-peach/85 shadow-[2px_2px_0_#3d3d3d] md:translate-x-0.5'
                  : 'bg-white shadow-[2px_2px_0_#c0f0dd] group-hover:scale-105 md:group-hover:translate-x-1.5 group-hover:shadow-[3px_3px_0_#ffb6c1]'
              }`}
            >
              {item.icon}
              {/* Active window indicator dot */}
              {isOpen && (
                <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-pastel-dark max-md:hidden" />
              )}
              {isOpen && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-pastel-dark md:hidden" />
              )}
            </div>
            <span
              className={`text-[9px] sm:text-[10px] font-bold mt-0.5 text-pastel-dark px-1.5 py-0.2 rounded-full transition-colors whitespace-nowrap ${
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
