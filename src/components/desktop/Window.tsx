'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { X, Minus, Square } from 'lucide-react';

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

  // Responsive center position calculation
  const calculateCenter = useCallback(() => {
    if (typeof window === 'undefined') {
      return { x: 300, y: 30 };
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const isMobile = vw < 768;

    if (isMobile) {
      const winW = Math.min(numericWidth, vw - 16);
      const x = Math.max(8, Math.floor((vw - winW) / 2));
      const y = 12;
      return { x, y };
    }

    // Desktop: Window is centered horizontally across the viewport
    const rawX = Math.floor((vw - numericWidth) / 2);
    const x = Math.max(16, Math.min(vw - numericWidth - 16, rawX));

    // Vertical positioning: centered in upper-middle of screen clear of bottom dock
    const availableHeight = vh - 90;
    const estimatedHeight = 560;
    const rawY = Math.floor((availableHeight - estimatedHeight) / 2);
    const y = Math.max(16, Math.min(48, rawY));

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

  const toggleMaximize = useCallback(() => {
    if (onToggleMaximize) {
      onToggleMaximize();
    } else {
      setInternalMaximized((prev) => !prev);
    }
  }, [onToggleMaximize]);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // When window opens or initialPosition changes, position it
  const prevIsOpen = useRef(isOpen);
  useEffect(() => {
    if (isOpen && !prevIsOpen.current) {
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

  // Mouse drag handling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    onFocus();
    hasUserDragged.current = true;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  // Touch drag handling for tablets & mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isMaximized) return;
    onFocus();
    if (e.touches.length === 1) {
      hasUserDragged.current = true;
      setIsDragging(true);
      setDragOffset({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || isMaximized) return;
      const minX = isMobile ? 8 : 12;
      const newX = Math.max(minX, Math.min(window.innerWidth - 100, e.clientX - dragOffset.x));
      const newY = Math.max(10, Math.min(window.innerHeight - 80, e.clientY - dragOffset.y));
      setPosition({ x: newX, y: newY });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || isMaximized || e.touches.length !== 1) return;
      const touch = e.touches[0];
      const minX = isMobile ? 8 : 12;
      const newX = Math.max(minX, Math.min(window.innerWidth - 100, touch.clientX - dragOffset.x));
      const newY = Math.max(10, Math.min(window.innerHeight - 80, touch.clientY - dragOffset.y));
      setPosition({ x: newX, y: newY });
    };

    const handleDragEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleDragEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, dragOffset, isMaximized]);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !isOpen) return null;

  return (
    <div
      ref={windowRef}
      id={id}
      tabIndex={0}
      onMouseDown={onFocus}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && isMaximized) {
          toggleMaximize();
        }
      }}
      suppressHydrationWarning
      style={{
        zIndex: isMaximized ? Math.max(zIndex, 320) : zIndex,
        display: isMinimized ? 'none' : 'flex',
        ...(isMaximized
          ? {
              top: isMobile ? '8px' : '12px',
              left: isMobile ? '8px' : '16px',
              right: isMobile ? '8px' : '16px',
              bottom: isMobile ? '74px' : '86px', // Leaves clear gap above bottom dock
              width: 'auto',
              maxWidth: 'none',
              height: isMobile ? 'calc(100vh - 82px)' : 'calc(100vh - 98px)',
            }
          : {
              top: `${position.y}px`,
              left: `${position.x}px`,
              width: typeof width === 'number' ? `${width}px` : width,
              maxWidth: '92vw',
            }),
      }}
      className={`fixed transition-all duration-150 select-none retro-window overflow-hidden flex flex-col focus:outline-none ${
        isDragging ? 'opacity-95 shadow-2xl' : ''
      }`}
    >
      {/* Window Header */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onDoubleClick={toggleMaximize}
        className={`${headerColor} px-4 py-2.5 border-b-[3px] border-pastel-dark flex items-center justify-between cursor-grab active:cursor-grabbing select-none`}
        title="Double click to maximize or restore"
      >
        <div className="flex items-center gap-2 font-bold text-sm text-pastel-dark tracking-wide truncate">
          <span className="w-2.5 h-2.5 rounded-full bg-pastel-dark/30 animate-pulse shrink-0" />
          <span className="truncate">{title}</span>
          {isMaximized && (
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/90 border border-pastel-dark text-pastel-dark shrink-0 hidden sm:inline-flex shadow-2xs">
              Maximized
            </span>
          )}
        </div>

        {/* Window Chrome Buttons */}
        <div className="flex items-center gap-1.5 ml-2 shrink-0">
          {onMinimize && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMinimize();
              }}
              title="Minimize to Dock"
              aria-label="Minimize"
              className="w-7 h-7 rounded-full bg-white border-2 border-pastel-dark flex items-center justify-center hover:bg-pastel-peach active:scale-90 transition-all text-pastel-dark shadow-xs cursor-pointer"
            >
              <Minus size={13} strokeWidth={3} />
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleMaximize();
            }}
            title={isMaximized ? 'Restore down' : 'Maximize window'}
            aria-label={isMaximized ? 'Restore down' : 'Maximize window'}
            className="w-7 h-7 rounded-full bg-white border-2 border-pastel-dark flex items-center justify-center hover:bg-pastel-mint active:scale-90 transition-all text-pastel-dark hidden sm:flex shadow-xs cursor-pointer"
          >
            <Square size={11} strokeWidth={3} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            title="Close Tab (X)"
            aria-label="Close"
            className="w-7 h-7 rounded-full bg-white border-2 border-pastel-dark flex items-center justify-center hover:bg-rose-500 hover:text-white active:scale-90 transition-all text-pastel-dark font-bold shadow-xs cursor-pointer"
          >
            <X size={14} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Window Body */}
      <div
        className={`p-4 sm:p-5 overflow-y-auto bg-[#fffcf3] text-pastel-dark flex-1 ${
          isMaximized
            ? 'h-full max-h-none'
            : 'max-h-[calc(100vh-140px)] md:max-h-[calc(100vh-160px)]'
        }`}
      >
        {children}
      </div>
    </div>
  );
};
