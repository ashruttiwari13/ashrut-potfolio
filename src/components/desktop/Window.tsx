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

    // Desktop dock sits on left side (~92px wide)
    const dockWidth = 92;
    const availableWidth = Math.max(numericWidth, vw - dockWidth);
    const rawX = dockWidth + Math.floor((availableWidth - numericWidth) / 2);
    const x = Math.max(dockWidth + 16, Math.min(vw - numericWidth - 20, rawX));

    // Vertical positioning: centered in upper-middle of screen clear of taskbar
    const availableHeight = vh - 75;
    const estimatedHeight = 580;
    const rawY = Math.floor((availableHeight - estimatedHeight) / 2);
    const y = Math.max(24, Math.min(60, rawY));

    return { x, y };
  }, [numericWidth]);

  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    if (initialPosition) return initialPosition;
    return calculateCenter();
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isMaximized, setIsMaximized] = useState(false);

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
      const minX = window.innerWidth < 768 ? 5 : 85;
      const newX = Math.max(minX, Math.min(window.innerWidth - 100, e.clientX - dragOffset.x));
      const newY = Math.max(10, Math.min(window.innerHeight - 80, e.clientY - dragOffset.y));
      setPosition({ x: newX, y: newY });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || isMaximized || e.touches.length !== 1) return;
      const touch = e.touches[0];
      const minX = window.innerWidth < 768 ? 5 : 85;
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

  if (!isOpen) return null;

  return (
    <div
      ref={windowRef}
      id={id}
      tabIndex={0}
      onMouseDown={onFocus}
      style={{
        zIndex,
        display: isMinimized ? 'none' : 'flex',
        ...(isMaximized
          ? { top: '15px', left: '15px', right: '15px', bottom: '70px', width: 'auto' }
          : {
              top: `${position.y}px`,
              left: `${position.x}px`,
              width: typeof width === 'number' ? `${width}px` : width,
              maxWidth: '92vw',
            }),
      }}
      className={`fixed transition-shadow select-none retro-window overflow-hidden flex flex-col focus:outline-none ${
        isDragging ? 'opacity-95 shadow-2xl' : ''
      }`}
    >
      {/* Window Header */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className={`${headerColor} px-4 py-2.5 border-b-[3px] border-pastel-dark flex items-center justify-between cursor-grab active:cursor-grabbing select-none`}
      >
        <div className="flex items-center gap-2 font-bold text-sm text-pastel-dark tracking-wide truncate">
          <span className="w-2.5 h-2.5 rounded-full bg-pastel-dark/30 animate-pulse" />
          <span className="truncate">{title}</span>
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
              title="Minimize"
              className="w-6 h-6 rounded-full bg-white border-2 border-pastel-dark flex items-center justify-center hover:bg-pastel-peach active:scale-90 transition-transform text-pastel-dark"
            >
              <Minus size={12} strokeWidth={3} />
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMaximized(!isMaximized);
            }}
            title={isMaximized ? 'Restore' : 'Maximize'}
            className="w-6 h-6 rounded-full bg-white border-2 border-pastel-dark flex items-center justify-center hover:bg-pastel-mint active:scale-90 transition-transform text-pastel-dark hidden sm:flex"
          >
            <Square size={10} strokeWidth={3} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            title="Close"
            className="w-6 h-6 rounded-full bg-white border-2 border-pastel-dark flex items-center justify-center hover:bg-pastel-coral hover:text-white active:scale-90 transition-transform text-pastel-dark font-bold"
          >
            <X size={12} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Window Body */}
      <div className="p-4 sm:p-5 overflow-y-auto bg-[#fffcf3] text-pastel-dark max-h-[calc(100vh-140px)] md:max-h-[calc(100vh-160px)] flex-1">
        {children}
      </div>
    </div>
  );
};
