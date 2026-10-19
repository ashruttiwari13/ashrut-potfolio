'use client';

import React, { useRef, useEffect, useState } from 'react';
import { 
  User, 
  Wrench, 
  Gamepad2, 
  Skull, 
  Trophy, 
  Camera, 
  FileText, 
  Mail, 
  Sliders, 
  ChevronLeft, 
  ChevronRight,
  Grid,
  X
} from 'lucide-react';
import { WindowId } from '@/types';

interface NavTabItem {
  id: WindowId;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}

interface ResponsiveNavTabsProps {
  activeWindowId: WindowId | null;
  windowsState: Record<WindowId, { isOpen: boolean; isMinimized: boolean; zIndex: number }>;
  onSelectTab: (id: WindowId) => void;
}

export const ResponsiveNavTabs: React.FC<ResponsiveNavTabsProps> = ({
  activeWindowId,
  windowsState,
  onSelectTab,
}) => {
  const tabsListRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isGridOpen, setIsGridOpen] = useState(false);

  const tabs: NavTabItem[] = [
    { id: 'profileWin', label: 'Profile', shortLabel: 'Bio', icon: <User size={15} /> },
    { id: 'skillsWin', label: 'Toolbox', shortLabel: 'Tools', icon: <Wrench size={15} /> },
    { id: 'projectsWin', label: 'Projects', shortLabel: 'Works', icon: <Gamepad2 size={15} />, badge: 'New', badgeColor: 'bg-pastel-pink' },
    { id: 'gameWin', label: '3D Horror', shortLabel: 'Game', icon: <Skull size={15} />, badge: '3D', badgeColor: 'bg-rose-400 text-white' },
    { id: 'achievementsWin', label: 'Awards', shortLabel: 'Awards', icon: <Trophy size={15} /> },
    { id: 'hobbiesWin', label: 'Creative', shortLabel: 'Cine', icon: <Camera size={15} /> },
    { id: 'resumeWin', label: 'Resume', shortLabel: 'CV', icon: <FileText size={15} /> },
    { id: 'contactWin', label: 'Hire Me', shortLabel: 'Contact', icon: <Mail size={15} /> },
    { id: 'settingsWin', label: 'Settings', shortLabel: 'Prefs', icon: <Sliders size={15} /> },
  ];

  // Check scroll overflows
  const updateScrollIndicators = () => {
    if (!tabsListRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = tabsListRef.current;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6);
  };

  useEffect(() => {
    updateScrollIndicators();
    window.addEventListener('resize', updateScrollIndicators);
    return () => window.removeEventListener('resize', updateScrollIndicators);
  }, []);

  // Auto-scroll active tab into view
  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
      setTimeout(updateScrollIndicators, 200);
    }
  }, [activeWindowId]);

  const scrollTabs = (direction: 'left' | 'right') => {
    if (!tabsListRef.current) return;
    const offset = direction === 'left' ? -180 : 180;
    tabsListRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  // Keyboard navigation across tabs
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIdx = (index + 1) % tabs.length;
      onSelectTab(tabs[nextIdx].id);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIdx = (index - 1 + tabs.length) % tabs.length;
      onSelectTab(tabs[prevIdx].id);
    } else if (e.key === 'Home') {
      e.preventDefault();
      onSelectTab(tabs[0].id);
    } else if (e.key === 'End') {
      e.preventDefault();
      onSelectTab(tabs[tabs.length - 1].id);
    }
  };

  return (
    <>
      <nav
        aria-label="Portfolio sections"
        className="fixed top-3 left-1/2 -translate-x-1/2 z-[290] w-full max-w-[94vw] sm:max-w-2xl lg:max-w-4xl px-2 select-none pointer-events-auto"
      >
        <div className="relative flex items-center bg-[rgba(255,250,240,0.94)] dark:bg-[rgba(28,26,40,0.92)] backdrop-blur-md border-[2.5px] border-pastel-dark rounded-full shadow-retro p-1 sm:p-1.5 transition-all">
          {/* Scroll Left Button */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scrollTabs('left')}
              aria-label="Scroll navigation tabs left"
              className="absolute left-1 z-20 w-7 h-7 rounded-full bg-white dark:bg-[#252233] border border-pastel-dark flex items-center justify-center text-pastel-dark shadow-sm hover:bg-pastel-peach"
            >
              <ChevronLeft size={16} />
            </button>
          )}

          {/* Horizontally Scrollable Tabs Strip */}
          <div
            ref={tabsListRef}
            onScroll={updateScrollIndicators}
            role="tablist"
            aria-orientation="horizontal"
            className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar scroll-smooth px-1 py-0.5 w-full"
          >
            {tabs.map((tab, idx) => {
              const state = windowsState[tab.id];
              const isOpen = state?.isOpen && !state?.isMinimized;
              const isActive = activeWindowId === tab.id && isOpen;

              return (
                <button
                  key={tab.id}
                  ref={isActive ? activeTabRef : null}
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-controls={tab.id}
                  aria-selected={isActive}
                  tabIndex={isActive ? 0 : -1}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  onClick={() => {
                    onSelectTab(tab.id);
                    setIsGridOpen(false);
                  }}
                  className={`group relative shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-[2px] transition-all touch-manipulation focus-visible:ring-2 focus-visible:ring-pastel-dark min-h-[38px] ${
                    isActive
                      ? 'bg-pastel-mint text-pastel-dark border-pastel-dark shadow-[2px_2px_0_#3d3d3d] scale-100 z-10'
                      : isOpen
                      ? 'bg-pastel-peach/50 text-pastel-dark border-pastel-dark/50 hover:bg-pastel-peach'
                      : 'bg-white dark:bg-[#232030] text-pastel-dark border-transparent hover:border-pastel-dark/30'
                  }`}
                >
                  <span className="shrink-0">{tab.icon}</span>
                  <span className="whitespace-nowrap tracking-wide">{tab.label}</span>

                  {/* Badge */}
                  {tab.badge && (
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full border border-pastel-dark uppercase ${
                        tab.badgeColor || 'bg-pastel-pink text-pastel-dark'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}

                  {/* Active dot indicator */}
                  {isOpen && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => scrollTabs('right')}
              aria-label="Scroll navigation tabs right"
              className="absolute right-1 z-20 w-7 h-7 rounded-full bg-white dark:bg-[#252233] border border-pastel-dark flex items-center justify-center text-pastel-dark shadow-sm hover:bg-pastel-peach"
            >
              <ChevronRight size={16} />
            </button>
          )}

          {/* Mobile All-Sections Grid Launcher */}
          <button
            type="button"
            onClick={() => setIsGridOpen(!isGridOpen)}
            title="View All Sections Grid"
            aria-label="Open full sections overview"
            className="sm:hidden shrink-0 ml-1 p-2 rounded-full bg-pastel-peach border border-pastel-dark text-pastel-dark hover:bg-pastel-pink transition-colors"
          >
            {isGridOpen ? <X size={15} /> : <Grid size={15} />}
          </button>
        </div>
      </nav>

      {/* Mobile Full Sections Drawer Modal */}
      {isGridOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="All portfolio sections menu"
          className="fixed inset-0 z-[350] bg-black/40 backdrop-blur-sm sm:hidden flex items-end justify-center p-3"
          onClick={() => setIsGridOpen(false)}
        >
          <div
            className="w-full bg-[#fef9e7] dark:bg-[#1a1926] border-[3px] border-pastel-dark rounded-2xl p-4 shadow-retro max-h-[80vh] overflow-y-auto space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b-2 border-pastel-dark">
              <h3 className="font-extrabold text-sm text-pastel-dark flex items-center gap-1.5">
                <Grid size={16} />
                <span>Jump to Any Section</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsGridOpen(false)}
                className="w-7 h-7 rounded-full bg-white border border-pastel-dark flex items-center justify-center font-bold text-pastel-dark"
              >
                <X size={14} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {tabs.map((tab) => {
                const state = windowsState[tab.id];
                const isOpen = state?.isOpen && !state?.isMinimized;
                const isActive = activeWindowId === tab.id && isOpen;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      onSelectTab(tab.id);
                      setIsGridOpen(false);
                    }}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border-2 text-left font-bold text-xs transition-all ${
                      isActive
                        ? 'bg-pastel-mint border-pastel-dark shadow-[2px_2px_0_#3d3d3d]'
                        : 'bg-white dark:bg-[#232030] border-pastel-dark/30 hover:border-pastel-dark'
                    }`}
                  >
                    <div className="p-1.5 rounded-lg bg-pastel-warm border border-pastel-dark/40 shrink-0">
                      {tab.icon}
                    </div>
                    <div className="truncate flex-1">
                      <div className="text-pastel-dark truncate">{tab.label}</div>
                      {isOpen && <span className="text-[10px] text-emerald-600 font-semibold">Active</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
