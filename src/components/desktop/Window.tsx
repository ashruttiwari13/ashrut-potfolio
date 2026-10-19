'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { X, Minus, Square } from 'lucide-react';

interface WindowProps {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized?: boolean;
  zIndex: number;
  initialPosition?: { x: number; y: number };
  width?: number;
  height?: number;
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
  zIndex,
  initialPosition,
  width = 520,
  height,
  headerColor = 'bg-pastel-pink',
  onClose,
  onFocus,
  onMinimize,
  children,
}) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Responsive state & sizing
  const [size, setSize] = useState<{ width: number; height?: number }>({
    width,
    height,
  });

  const hasUserDragged = useRef(false);
  const hasUserResized = useRef(false);

  // Calculate sensible center position on screen
  const calculateCenter = useCallback((winWidth: number) => {
    if (typeof window === 'undefined') {
      return { x: 280, y: 50 };
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (vw < 768) {
      return { x: 8, y: 16 };
    }

    // Dock sits on left (~88px)
    const dockWidth = 88;
    const actualWidth = Math.min(winWidth, vw - dockWidth - 40);
    const availableWidth = vw - dockWidth;
    const rawX = dockWidth + Math.floor((availableWidth - actualWidth) / 2);
    const x = Math.max(dockWidth + 12, Math.min(vw - actualWidth - 20, rawX));

    // Vertical positioning in upper-center, accounting for top nav tabs & bottom taskbar
    const availableHeight = vh - 90;
    const estimatedHeight = size.height || 540;
    const rawY = Math.floor((availableHeight - estimatedHeight) / 2);
    const y = Math.max(38, Math.min(75, rawY));

    return { x, y };
  }, [size.height]);

  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    if (initialPosition) return initialPosition;
    return calculateCenter(width);
  });

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeType, setResizeType] = useState<'both' | 'horizontal' | 'vertical' | null>(null);
  const resizeStart = useRef<{ startX: number; startY: number; startW: number; startH: number }>({
    startX: 0,
    startY: 0,
    startW: 0,
    startH: 0,
  });

  // Track viewport mode
  useEffect(() => {
    setIsMounted(true);
    const checkViewport = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && isResizing) {
        setIsResizing(false);
      }
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, [isResizing]);

  // Center window when opened or reset
  const prevIsOpen = useRef(isOpen);
  useEffect(() => {
    if (isOpen && !prevIsOpen.current) {
      if (initialPosition) {
        setPosition(initialPosition);
      } else if (!hasUserDragged.current) {
        setPosition(calculateCenter(size.width));
      }
    }
    prevIsOpen.current = isOpen;
  }, [isOpen, initialPosition, calculateCenter, size.width]);

  // Handle window resizing events
  useEffect(() => {
    const handleWindowResize = () => {
      if (isMobile) return;
      if (!hasUserDragged.current && !isMaximized) {
        setPosition(calculateCenter(size.width));
      }
    };
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [calculateCenter, isMaximized, isMobile, size.width]);

  // Desktop Mouse Drag Handling
  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    if (isMaximized || isMobile) return;
    onFocus();
    hasUserDragged.current = true;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  // Header double-click toggles maximize
  const handleHeaderDoubleClick = () => {
    if (isMobile) return;
    setIsMaximized((prev) => !prev);
  };

  // Window Drag Listener
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || isMaximized || isMobile) return;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const minX = 10;
      const maxX = Math.max(minX, vw - 140);
      const minY = 10;
      const maxY = Math.max(minY, vh - 90);

      const newX = Math.max(minX, Math.min(maxX, e.clientX - dragOffset.x));
      const newY = Math.max(minY, Math.min(maxY, e.clientY - dragOffset.y));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, isMaximized, isMobile]);

  // Resizing start
  const handleResizeStart = (e: React.MouseEvent, type: 'both' | 'horizontal' | 'vertical') => {
    e.stopPropagation();
    e.preventDefault();
    if (isMaximized || isMobile) return;

    onFocus();
    hasUserResized.current = true;
    setIsResizing(true);
    setResizeType(type);

    const currentEl = windowRef.current;
    const currentW = currentEl ? currentEl.offsetWidth : size.width;
    const currentH = currentEl ? currentEl.offsetHeight : (size.height || 500);

    resizeStart.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: currentW,
      startH: currentH,
    };
  };

  // Resize Mouse Listener
  useEffect(() => {
    const handleResizeMove = (e: MouseEvent) => {
      if (!isResizing || !resizeType || isMaximized || isMobile) return;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const minW = Math.min(340, vw - 30);
      const maxW = Math.min(1240, vw - 40);
      const minH = 260;
      const maxH = Math.max(minH, vh - 90);

      const deltaX = e.clientX - resizeStart.current.startX;
      const deltaY = e.clientY - resizeStart.current.startY;

      setSize((prev) => {
        let newW = prev.width;
        let newH = prev.height || resizeStart.current.startH;

        if (resizeType === 'both' || resizeType === 'horizontal') {
          newW = Math.max(minW, Math.min(maxW, resizeStart.current.startW + deltaX));
        }

        if (resizeType === 'both' || resizeType === 'vertical') {
          newH = Math.max(minH, Math.min(maxH, resizeStart.current.startH + deltaY));
        }

        return { width: newW, height: newH };
      });
    };

    const handleResizeEnd = () => {
      setIsResizing(false);
      setResizeType(null);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleResizeMove);
      window.addEventListener('mouseup', handleResizeEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleResizeMove);
      window.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [isResizing, resizeType, isMaximized, isMobile]);

  if (!isMounted || !isOpen) return null;

  // Compute inline layout styles
  const windowStyles: React.CSSProperties = {
    zIndex,
    display: isMinimized ? 'none' : 'flex',
  };

  if (isMobile) {
    // Mobile responsive layout: clean centered card within safe bounds
    windowStyles.top = isMaximized ? '8px' : '48px';
    windowStyles.left = '8px';
    windowStyles.right = '8px';
    windowStyles.width = 'calc(100vw - 16px)';
    windowStyles.maxHeight = isMaximized ? 'calc(100dvh - 16px)' : 'calc(100dvh - 84px)';
    windowStyles.bottom = isMaximized ? '8px' : 'auto';
  } else if (isMaximized) {
    windowStyles.top = '12px';
    windowStyles.left = '16px';
    windowStyles.right = '16px';
    windowStyles.bottom = '56px';
    windowStyles.width = 'auto';
  } else {
    windowStyles.top = `${position.y}px`;
    windowStyles.left = `${position.x}px`;
    windowStyles.width = `${size.width}px`;
    windowStyles.maxWidth = 'calc(94vw - 20px)';
    if (size.height) {
      windowStyles.height = `${size.height}px`;
    }
  }

  return (
    <div
      ref={windowRef}
      id={id}
      role="dialog"
      aria-label={title}
      tabIndex={0}
      onMouseDown={onFocus}
      suppressHydrationWarning
      style={windowStyles}
      className={`fixed select-none retro-window overflow-hidden flex flex-col focus:outline-none transition-shadow ${
        isDragging ? 'opacity-95 shadow-2xl scale-[1.002]' : ''
      } ${isResizing ? 'select-none pointer-events-auto' : ''}`}
    >
      {/* Window Header / Title Bar */}
      <div
        onMouseDown={handleHeaderMouseDown}
        onDoubleClick={handleHeaderDoubleClick}
        className={`${headerColor} px-3 sm:px-4 py-2 border-b-[3px] border-pastel-dark flex items-center justify-between select-none ${
          isMobile ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
        }`}
      >
        <div className="flex items-center gap-2 font-extrabold text-xs sm:text-sm text-pastel-dark tracking-wide truncate pr-2">
          <span className="w-2.5 h-2.5 rounded-full bg-pastel-dark/30 animate-pulse shrink-0" />
          <span className="truncate">{title}</span>
        </div>

        {/* Window Chrome Buttons */}
        <div className="flex items-center gap-1.5 shrink-0 ml-1">
          {onMinimize && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMinimize();
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              title="Minimize"
              aria-label="Minimize window"
              className="w-7 h-7 sm:w-6 sm:h-6 rounded-full bg-white border-2 border-pastel-dark flex items-center justify-center hover:bg-pastel-peach active:scale-90 transition-transform text-pastel-dark shadow-sm"
            >
              <Minus size={13} strokeWidth={3} />
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMaximized(!isMaximized);
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            title={isMaximized ? 'Restore' : 'Maximize'}
            aria-label={isMaximized ? 'Restore window size' : 'Maximize window'}
            className="w-7 h-7 sm:w-6 sm:h-6 rounded-full bg-white border-2 border-pastel-dark flex items-center justify-center hover:bg-pastel-mint active:scale-90 transition-transform text-pastel-dark shadow-sm"
          >
            <Square size={11} strokeWidth={3} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            title="Close"
            aria-label="Close window"
            className="w-7 h-7 sm:w-6 sm:h-6 rounded-full bg-white border-2 border-pastel-dark flex items-center justify-center hover:bg-rose-400 hover:text-white active:scale-90 transition-transform text-pastel-dark font-bold shadow-sm"
          >
            <X size={13} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Window Body with Internal Scrolling */}
      <div 
        className="p-3.5 sm:p-5 overflow-y-auto overflow-x-hidden bg-[var(--bg-window-body)] text-pastel-dark flex-1 max-h-[calc(100vh-140px)] md:max-h-[calc(100vh-150px)]"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {children}
      </div>

      {/* Desktop Resize Handles */}
      {!isMobile && !isMaximized && (
        <>
          {/* Right edge resize */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'horizontal')}
            className="absolute top-8 right-0 w-2.5 h-[calc(100%-18px)] cursor-ew-resize z-30 hover:bg-pastel-mint/30 transition-colors"
            title="Drag to resize width"
          />

          {/* Bottom edge resize */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'vertical')}
            className="absolute bottom-0 left-0 h-2.5 w-[calc(100%-18px)] cursor-ns-resize z-30 hover:bg-pastel-mint/30 transition-colors"
            title="Drag to resize height"
          />

          {/* Bottom-right diagonal corner grip */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'both')}
            className="retro-resize-grip"
            title="Drag to resize window"
            aria-hidden="true"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" className="text-pastel-dark">
              <path d="M10 2 L2 10 M10 6 L6 10 M10 10 L10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </>
      )}
    </div>
  );
};
