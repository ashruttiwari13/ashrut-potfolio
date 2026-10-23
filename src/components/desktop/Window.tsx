'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { X, Minus, Square } from 'lucide-react';
import { soundFX } from '@/lib/soundEffects';

interface WindowProps {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized?: boolean;
  isMaximized?: boolean;
  onToggleMaximize?: () => void;
  zIndex: number;
  initialPosition?: { x: number; y: number };
  width?: number | string;
  headerColor?: string;
  onClose: () => void;
  onFocus: () => void;
  onMinimize?: () => void;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({
  id,
  title,
  isOpen,
  isMinimized = false,
  isMaximized: propIsMaximized,
  onToggleMaximize,
  zIndex,
  initialPosition,
  width = 480,
  headerColor = 'bg-pastel-pink',
  onClose,
  onFocus,
  onMinimize,
  children,
}) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const numericWidth = typeof width === 'number' ? width : 480;
  const hasUserDragged = useRef(false);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Responsive center position calculation
  const calculateCenter = useCallback(() => {
    if (typeof window === 'undefined') {
      return { x: 300, y: 30 };
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Desktop dock sits on left side (~84px wide)
    const dockWidth = 84;
    const availableWidth = Math.max(numericWidth, vw - dockWidth - 20);
    const rawX = dockWidth + Math.floor((availableWidth - numericWidth) / 2);
    const x = Math.max(dockWidth + 14, Math.min(vw - numericWidth - 20, rawX));

    // Vertical positioning: centered in upper-middle of screen clear of taskbar
    const availableHeight = vh - 75;
    const estimatedHeight = 520;
    const rawY = Math.floor((availableHeight - estimatedHeight) / 2);
    const y = Math.max(16, Math.min(50, rawY));

    return { x, y };
  }, [numericWidth]);

  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    if (initialPosition) return initialPosition;
    return calculateCenter();
  });

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [internalMaximized, setInternalMaximized] = useState(false);
  const isMaximized = propIsMaximized !== undefined ? propIsMaximized : internalMaximized;

  // Mobile swipe-down pull distance
  const [mobilePullY, setMobilePullY] = useState(0);
  const touchStartYRef = useRef(0);
  const touchStartTimeRef = useRef(0);
  const isPullingRef = useRef(false);

  const toggleMaximize = useCallback(() => {
    soundFX.playClick(600);
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

  // Touch handlers for mobile (Swipe down to minimize gesture)
  const handleTouchStart = (e: React.TouchEvent) => {
    onFocus();
    if (e.touches.length === 1) {
      touchStartYRef.current = e.touches[0].clientY;
      touchStartTimeRef.current = Date.now();
      isPullingRef.current = true;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPullingRef.current || e.touches.length !== 1) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - touchStartYRef.current;

    // Only pull downward
    if (deltaY > 0) {
      if (e.cancelable) e.preventDefault();
      // Apply slight rubber-band friction
      setMobilePullY(Math.min(120, deltaY * 0.7));
    }
  };

  const handleTouchEnd = () => {
    if (!isPullingRef.current) return;
    isPullingRef.current = false;

    // If pulled down more than 65px on mobile, minimize window!
    if (mobilePullY > 65 && onMinimize) {
      soundFX.playWindowClose();
      onMinimize();
    }
    setMobilePullY(0);
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

  // Window styling logic: On mobile, expansive, beautiful full-height card
  const windowStyle: React.CSSProperties = {
    zIndex: isMaximized ? Math.max(zIndex, 320) : zIndex,
    display: isMinimized ? 'none' : 'flex',
    transform: mobilePullY > 0 ? `translateY(${mobilePullY}px)` : 'none',
    transition: mobilePullY > 0 ? 'none' : 'transform 0.2s ease, opacity 0.2s ease',
    ...(isMobile
      ? isMaximized
        ? {
            top: '8px',
            left: '8px',
            right: '8px',
            bottom: '8px',
            width: 'auto',
            height: 'calc(100dvh - 16px)',
            maxHeight: 'none',
            maxWidth: 'none',
          }
        : {
            top: 'max(48px, calc(env(safe-area-inset-top, 0px) + 44px))',
            bottom: 'max(72px, calc(env(safe-area-inset-bottom, 0px) + 68px))',
            left: '8px',
            right: '8px',
            width: 'auto',
            maxWidth: '640px',
            margin: '0 auto',
            height: 'calc(100dvh - max(120px, calc(env(safe-area-inset-top, 0px) + env(safe-area-inset-bottom, 0px) + 112px)))',
            maxHeight: 'calc(100dvh - max(120px, calc(env(safe-area-inset-top, 0px) + env(safe-area-inset-bottom, 0px) + 112px)))',
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
        onDoubleClick={toggleMaximize}
        className={`${headerColor} px-3 sm:px-4 py-2 border-b-2 sm:border-b-[2.5px] border-pastel-dark flex flex-col justify-center cursor-grab active:cursor-grabbing select-none touch-none min-h-[46px] sm:min-h-[50px] shrink-0`}
        title="Drag on desktop · Swipe down on mobile to minimize · Double click to maximize"
      >
        {/* Mobile Swipe-Down Pill Indicator */}
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
                title="Minimize to Dock (or swipe down)"
                aria-label="Minimize"
                className="w-7.5 h-7.5 sm:w-8.5 sm:h-8.5 rounded-full bg-white border-2 border-pastel-dark flex items-center justify-center hover:bg-pastel-peach active:scale-90 transition-all text-pastel-dark shadow-xs cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={3.5} />
              </button>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleMaximize();
              }}
              title={isMaximized ? 'Restore window size' : 'Expand window'}
              aria-label={isMaximized ? 'Restore window size' : 'Expand window'}
              className="w-7.5 h-7.5 sm:w-8.5 sm:h-8.5 rounded-full bg-white border-2 border-pastel-dark flex items-center justify-center hover:bg-pastel-mint active:scale-90 transition-all text-pastel-dark shadow-xs cursor-pointer"
            >
              <Square className="w-3 h-3 sm:w-3.5 sm:h-3.5" strokeWidth={3.5} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                soundFX.playWindowClose();
                onClose();
              }}
              title="Close Tab"
              aria-label="Close"
              className="w-7.5 h-7.5 sm:w-8.5 sm:h-8.5 rounded-full bg-white border-2 border-pastel-dark flex items-center justify-center hover:bg-rose-500 hover:text-white active:scale-90 transition-all text-pastel-dark font-bold shadow-xs cursor-pointer"
            >
              <X className="w-4 h-4 sm:w-4.5 sm:h-4.5" strokeWidth={3.5} />
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
