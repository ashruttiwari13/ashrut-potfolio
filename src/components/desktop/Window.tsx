'use client';

import React, { useRef, useState, useEffect } from 'react';
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
  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    if (initialPosition) return initialPosition;
    return { x: 120, y: 24 };
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isMaximized, setIsMaximized] = useState(false);

  // Position setup on initial open
  useEffect(() => {
    if (initialPosition) {
      setPosition(initialPosition);
    } else if (typeof window !== 'undefined') {
      const numericWidth = typeof width === 'number' ? width : 480;
      const isMobile = window.innerWidth < 768;
      const x = isMobile ? 10 : Math.max(115, Math.floor((window.innerWidth + 90 - numericWidth) / 2));
      const y = isMobile ? 12 : Math.max(18, Math.floor((window.innerHeight - 560) / 2));
      setPosition({ x, y });
    }
  }, [initialPosition, width]);

  // Mouse drag handling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    onFocus();
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

  if (!isOpen || isMinimized) return null;

  return (
    <div
      ref={windowRef}
      id={id}
      tabIndex={0}
      onMouseDown={onFocus}
      style={{
        zIndex,
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
