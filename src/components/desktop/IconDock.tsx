'use client';

import React from 'react';
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
  Skull,
  Sliders
} from 'lucide-react';
import { WindowId } from '@/types';

interface IconDockProps {
  onOpenWindow: (id: WindowId) => void;
  activeWindows: Record<WindowId, boolean>;
}

interface DockItem {
  id: WindowId | 'admin';
  label: string;
  icon: React.ReactNode;
  badge?: string;
  isLink?: boolean;
  href?: string;
}

export const IconDock: React.FC<IconDockProps> = ({ onOpenWindow, activeWindows }) => {
  const items: DockItem[] = [
    { id: 'profileWin', label: 'Profile', icon: <User className="w-6 h-6 sm:w-7 sm:h-7" /> },
    { id: 'skillsWin', label: 'Toolbox', icon: <Wrench className="w-6 h-6 sm:w-7 sm:h-7" /> },
    { id: 'projectsWin', label: 'Projects', icon: <Gamepad2 className="w-6 h-6 sm:w-7 sm:h-7" />, badge: 'New' },
    { id: 'achievementsWin', label: 'Awards', icon: <Trophy className="w-6 h-6 sm:w-7 sm:h-7" /> },
    { id: 'hobbiesWin', label: 'Creative', icon: <Camera className="w-6 h-6 sm:w-7 sm:h-7" /> },
    { id: 'gameWin', label: '3D Horror', icon: <Skull className="w-6 h-6 sm:w-7 sm:h-7" />, badge: '3D' },
    { id: 'resumeWin', label: 'Resume', icon: <FileText className="w-6 h-6 sm:w-7 sm:h-7" /> },
    { id: 'contactWin', label: 'Hire Me', icon: <Mail className="w-6 h-6 sm:w-7 sm:h-7" /> },
    { id: 'settingsWin', label: 'Settings', icon: <Sliders className="w-6 h-6 sm:w-7 sm:h-7" /> },
    { id: 'admin', label: 'Admin', icon: <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />, isLink: true, href: '/admin' },
  ];

  return (
    <nav 
      aria-label="Desktop application dock"
      className="fixed z-[280] top-16 left-3.5 flex flex-col gap-2.5 p-2.5 rounded-[30px] bg-[rgba(255,250,240,0.92)] dark:bg-[rgba(24,22,34,0.92)] backdrop-blur-md border-[3px] border-pastel-dark shadow-retro max-h-[82vh] overflow-y-auto no-scrollbar pointer-events-auto max-md:hidden select-none"
    >
      {items.map((item) => {
        const isActive = item.id !== 'admin' && activeWindows[item.id as WindowId];

        if (item.isLink && item.href) {
          return (
            <Link
              key={item.id}
              href={item.href}
              title={item.label}
              className="group relative flex flex-col items-center justify-center p-1 cursor-pointer transition-transform active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-pastel-dark rounded-2xl"
            >
              <div className="relative p-2.5 bg-white dark:bg-[#252233] rounded-2xl border-[2.5px] border-pastel-dark shadow-[2px_2px_0_#ffb6c1] group-hover:scale-105 group-hover:shadow-[3px_3px_0_#c0f0dd] transition-all">
                {item.icon}
              </div>
              <span className="text-[10px] font-bold mt-1 text-pastel-dark px-2 py-0.5 rounded-full bg-white/90 dark:bg-[#252233]/90 border border-pastel-dark/20">
                {item.label}
              </span>
            </Link>
          );
        }

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onOpenWindow(item.id as WindowId)}
            title={item.label}
            className="group relative flex flex-col items-center justify-center p-1 cursor-pointer transition-transform active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-pastel-dark rounded-2xl"
          >
            {item.badge && (
              <span className="absolute -top-1 -right-1 z-10 px-1.5 py-0.2 text-[9px] font-extrabold uppercase bg-pastel-pink text-pastel-dark border border-pastel-dark rounded-full shadow-sm animate-bounce">
                {item.badge}
              </span>
            )}
            <div
              className={`relative p-2.5 rounded-2xl border-[2.5px] border-pastel-dark transition-all ${
                isActive
                  ? 'bg-pastel-mint shadow-[2px_2px_0_#3d3d3d] scale-105 ring-2 ring-pastel-dark'
                  : 'bg-white dark:bg-[#252233] shadow-[2px_2px_0_#c0f0dd] group-hover:scale-105 group-hover:shadow-[3px_3px_0_#ffb6c1]'
              }`}
            >
              {item.icon}
            </div>
            <span
              className={`text-[10px] font-bold mt-1 text-pastel-dark px-2 py-0.5 rounded-full transition-colors ${
                isActive ? 'bg-pastel-peach border border-pastel-dark' : 'bg-white/90 dark:bg-[#252233]/90 border border-pastel-dark/20'
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
