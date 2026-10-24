'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Minus, Square, X } from 'lucide-react';
import { WindowId } from '@/types';
import { soundFX } from '@/lib/soundEffects';

interface WindowProps {
  id: WindowId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized?: boolean;
  onToggleMaximize?: () => void;
  zIndex: number;
  width?: number | string;
  headerColor: string;
  initialPosition?: { x: number; y: number };
  children: React.ReactNode;
  onClose: () => void;
  onFocus: () => void;
  onMinimize?: () => void;
}

export const Window: React.FC<WindowProps> = ({
  id,
  title,
  isOpen,
  isMinimized,
  isMaximized: propIsMaximized,
  onToggleMaximize,
  zIndex,
  width = 620,
  headerColor,
  initialPosition,
  children,
  onClose,
  onFocus,
  onMinimize,
}) => {
  const windowRef = useRef<HTMLDivElement>(null);

  // Detect mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Window coordinate calculation (desktop)
  const calculateCenter = useCallback(() => {
    if (typeof window === 'undefined') return { x: 120, y: 80 };
    const winWidth = typeof width === 'number' ? width : 520;
    const isSmall = window.innerWidth < 768;
    const x = isSmall
      ? Math.max(10, Math.floor((window.innerWidth - Math.min(winWidth, window.innerWidth - 20)) / 2))
      : Math.max(100, Math.floor((window.innerWidth - winWidth) / 2));
    const y = isSmall ? 84 : Math.max(20, Math.floor((window.innerHeight - 560) / 2));
    return { x, y };
  }, [width]);

  const [position, setPosition] = useState<{ x: number; y: number }>(initialPosition || calculateCenter());
  const hasUserDragged = useRef(false);

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [internalMaximized, setInternalMaximized] = useState(false);
  const isMaximized = propIsMaximized !== undefined ? propIsMaximized : internalMaximized;

  // Mobile drag and pull-down handling
  const [mobileOffset, setMobileOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const touchStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const initialOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingMobileRef = useRef<boolean>(false);
  const touchStartTimeRef = useRef<number>(0);

  const toggleMaximize = useCallback(() => {
    soundFX.playClick(600);
    setMobileOffset({ x: 0, y: 0 });
    if (onToggleMaximize) {
      onToggleMaximize();
    } else {
      setInternalMaximized((prev) => !prev);
    }
  }, [onToggleMaximize]);

  // When window opens or initialPosition changes, position it
  const prevIsOpen = useRef(isOpen);
  useEffect(() => {
    if (isOpen && !prevIsOpen.current) {
      soundFX.playWindowOpen();
      setMobileOffset({ x: 0, y: 0 });
      if (initialPosition) {
        setPosition(initialPosition);
      } else {
        hasUserDragged.current = false;
        setPosition(calculateCenter());
      }
    }
    prevIsOpen.current = isOpen;
  }, [isOpen, initialPosition, calculateCenter]);

  // Keep centered on window resize unless user has manually dragged it
  useEffect(() => {
    const handleResize = () => {
      if (!hasUserDragged.current && !isMaximized) {
        setPosition(calculateCenter());
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateCenter, isMaximized]);

  // Mouse drag handling (desktop only)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized || isMobile) return;
    if (e.button !== 0) return; // Only drag with left mouse button
    e.preventDefault();
    onFocus();
    hasUserDragged.current = true;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  // Touch drag handlers for mobile (free movement + swipe down to minimize)
  const handleTouchStart = (e: React.TouchEvent) => {
    onFocus();
    if (isMaximized) return;
    if (e.touches.length === 1) {
      const t = e.touches[0];
      touchStartPosRef.current = { x: t.clientX, y: t.clientY };
      initialOffsetRef.current = { ...mobileOffset };
      touchStartTimeRef.current = Date.now();
      isDraggingMobileRef.current = true;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingMobileRef.current || isMaximized || e.touches.length !== 1) return;
    const t = e.touches[0];
    const deltaX = t.clientX - touchStartPosRef.current.x;
    const deltaY = t.clientY - touchStartPosRef.current.y;

    if (e.cancelable) e.preventDefault();

    setMobileOffset({
      x: initialOffsetRef.current.x + deltaX * 0.9,
      y: Math.max(-25, initialOffsetRef.current.y + deltaY),
    });
  };

  const handleTouchEnd = () => {
    if (!isDraggingMobileRef.current) return;
    isDraggingMobileRef.current = false;

    const timeDiff = Date.now() - touchStartTimeRef.current;
    // Fast swipe down (> 85px in < 400ms) or deep pull down (> 130px) triggers minimize
    if (mobileOffset.y > 85 && timeDiff < 400 && onMinimize) {
      soundFX.playWindowClose();
      onMinimize();
      setMobileOffset({ x: 0, y: 0 });
      return;
    }
    if (mobileOffset.y > 130 && onMinimize) {
      soundFX.playWindowClose();
      onMinimize();
      setMobileOffset({ x: 0, y: 0 });
      return;
    }

    // Keep position within viewport bounds
    const maxY = typeof window !== 'undefined' ? window.innerHeight - 180 : 300;
    const maxX = typeof window !== 'undefined' ? window.innerWidth * 0.4 : 120;
    setMobileOffset((prev) => ({
      x: Math.max(-maxX, Math.min(maxX, prev.x)),
      y: Math.max(-15, Math.min(maxY, prev.y)),
    }));
  };

  // Desktop Mouse drag tracking
  useEffect(() => {
    if (!isDragging || isMobile) return;

    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (isMaximized) return;
      const minX = 96;
      const maxX = window.innerWidth - 100;
      const minY = 10;
      const maxY = window.innerHeight - 80;
      const newX = Math.max(minX, Math.min(maxX, e.clientX - dragOffset.x));
      const newY = Math.max(minY, Math.min(maxY, e.clientY - dragOffset.y));

      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setPosition({ x: newX, y: newY });
      });
    };

    const handleDragEnd = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseup', handleDragEnd);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging, dragOffset, isMaximized, isMobile]);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !isOpen) return null;

  // Window styling logic:
  // On mobile: top is anchored at 84px to completely clear the top bar & cat widget!
  const windowStyle: React.CSSProperties = {
    zIndex: isMaximized ? Math.max(zIndex, 320) : zIndex,
    display: isMinimized ? 'none' : 'flex',
    ...(isMobile
      ? isMaximized
        ? {
            top: 'max(80px, calc(env(safe-area-inset-top, 0px) + 76px))',
            bottom: 'max(68px, calc(env(safe-area-inset-bottom, 0px) + 64px))',
            left: '8px',
            right: '8px',
            width: 'auto',
            height: 'calc(100dvh - max(152px, calc(env(safe-area-inset-top, 0px) + env(safe-area-inset-bottom, 0px) + 144px)))',
            maxHeight: 'none',
            maxWidth: 'none',
          }
        : {
            top: 'max(84px, calc(env(safe-area-inset-top, 0px) + 80px))',
            bottom: 'max(72px, calc(env(safe-area-inset-bottom, 0px) + 68px))',
            left: '8px',
            right: '8px',
            width: 'auto',
            maxWidth: '640px',
            margin: '0 auto',
            transform: `translate3d(${mobileOffset.x}px, ${mobileOffset.y}px, 0)`,
            transition: isDraggingMobileRef.current ? 'none' : 'transform 0.25s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
            height: 'calc(100dvh - max(162px, calc(env(safe-area-inset-top, 0px) + env(safe-area-inset-bottom, 0px) + 152px)))',
            maxHeight: 'calc(100dvh - max(162px, calc(env(safe-area-inset-top, 0px) + env(safe-area-inset-bottom, 0px) + 152px)))',
          }
      : isMaximized
      ? {
          top: '12px',
          left: '98px',
          right: '102px',
          bottom: '64px',
          width: 'auto',
          maxWidth: 'none',
          height: 'calc(100vh - 76px)',
        }
      : {
          top: `${position.y}px`,
          left: `${position.x}px`,
          width: typeof width === 'number' ? `${width}px` : width,
          maxWidth: '94vw',
          maxHeight: 'calc(100vh - 80px)',
        }),
  };

  return (
    <div
      ref={windowRef}
      id={id}
      tabIndex={0}
      onMouseDown={onFocus}
      onTouchStart={onFocus}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          if (isMaximized) toggleMaximize();
          else onClose();
        }
      }}
      suppressHydrationWarning
      style={windowStyle}
      className={`fixed select-none retro-window overflow-hidden flex flex-col focus:outline-none ${
        isDragging
          ? 'opacity-95 shadow-2xl transition-none cursor-grabbing'
          : 'shadow-retro transition-all duration-200'
      }`}
    >
      {/* Window Header */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={() => {
          if (isMobile) {
            setMobileOffset({ x: 0, y: 0 });
          } else {
            toggleMaximize();
          }
        }}
        className={`${headerColor} px-3 sm:px-4 py-2 border-b-2 sm:border-b-[2.5px] border-pastel-dark flex flex-col justify-center cursor-grab active:cursor-grabbing select-none touch-none min-h-[46px] sm:min-h-[50px] shrink-0`}
        title="Drag on desktop · Drag to move on mobile (swipe down to minimize) · Double click to maximize"
      >
        {/* Mobile Swipe / Drag Pill Indicator */}
        <div className="w-10 h-1 rounded-full bg-pastel-dark/30 mx-auto -mt-0.5 mb-1 sm:hidden pointer-events-none" />

        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1.5 sm:gap-2 font-bold text-xs sm:text-sm text-pastel-dark tracking-wide truncate flex-1 min-w-0">
            <span className="w-2 h-2 rounded-full bg-pastel-dark/30 animate-pulse shrink-0" />
            <span className="truncate">{title}</span>
            {isMaximized && (
              <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-white/90 border border-pastel-dark text-pastel-dark shrink-0 hidden sm:inline-flex shadow-2xs">
                Maximized
              </span>
            )}
          </div>

          {/* Window Chrome Buttons: Minimize, Maximize/Mode, Close */}
          <div className="flex items-center gap-1.5 sm:gap-2 ml-2 shrink-0">
            {onMinimize && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  soundFX.playWindowClose();
                  onMinimize();
                }}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  soundFX.playWindowClose();
                  onMinimize();
                }}
                title="Minimize to Dock"
                aria-label="Minimize"
                className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-white border-2 border-pastel-dark flex items-center justify-center hover:bg-pastel-peach active:scale-90 transition-all text-pastel-dark shadow-xs cursor-pointer touch-manipulation"
              >
                <Minus className="w-4 h-4 sm:w-4 sm:h-4" strokeWidth={3.5} />
              </button>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleMaximize();
              }}
              onTouchEnd={(e) => {
                e.stopPropagation();
                e.preventDefault();
                toggleMaximize();
              }}
              title={isMaximized ? 'Restore window size' : 'Expand window'}
              aria-label={isMaximized ? 'Restore window size' : 'Expand window'}
              className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-white border-2 border-pastel-dark flex items-center justify-center hover:bg-pastel-mint active:scale-90 transition-all text-pastel-dark shadow-xs cursor-pointer touch-manipulation"
            >
              <Square className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5" strokeWidth={3.5} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                soundFX.playWindowClose();
                onClose();
              }}
              onTouchEnd={(e) => {
                e.stopPropagation();
                e.preventDefault();
                soundFX.playWindowClose();
                onClose();
              }}
              title="Close Tab"
              aria-label="Close"
              className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-white border-2 border-pastel-dark flex items-center justify-center hover:bg-rose-500 hover:text-white active:scale-90 transition-all text-pastel-dark font-bold shadow-xs cursor-pointer touch-manipulation"
            >
              <X className="w-4.5 h-4.5 sm:w-4.5 sm:h-4.5" strokeWidth={3.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Window Body */}
      <div
        className={`p-3 sm:p-4 overflow-y-auto overflow-x-hidden w-full max-w-full bg-[#fffcf3] text-pastel-dark flex-1 overscroll-contain pb-10 sm:pb-8 ${
          isDragging ? 'pointer-events-none select-none' : ''
        }`}
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {children}
      </div>
    </div>
  );
};
