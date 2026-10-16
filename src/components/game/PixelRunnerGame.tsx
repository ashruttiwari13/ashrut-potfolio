'use client';

import React, { useState } from 'react';
import { Maximize2, Sparkles, Trophy, Gamepad2, Sword } from 'lucide-react';

export const PixelRunnerGame: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  const focusGame = () => {
    iframeRef.current?.focus();
  };

  return (
    <div className="space-y-3 select-none">
      {/* Top Bar with Mode Info & Fullscreen Action */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-white border-2 border-pastel-dark rounded-retro-sm text-xs font-bold shadow-sm">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-pastel-pink border border-pastel-dark text-pastel-dark">
            <Sword size={14} />
          </span>
          <div>
            <h4 className="font-extrabold text-xs text-pastel-dark">
              PIXEL QUEST: The Lost Crystal
            </h4>
            <p className="text-[10px] text-pastel-soft">
              3 Worlds · Mouse Combat (LMB Slash, RMB Special) · Crystal Guardian Boss
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/pixel-quest.html"
            target="_blank"
            rel="noopener noreferrer"
            className="retro-btn retro-btn-primary text-xs px-3 py-1.5"
            title="Open dedicated standalone game tab"
          >
            <Maximize2 size={12} strokeWidth={2.5} />
            <span>Open Fullscreen</span>
          </a>
        </div>
      </div>

      {/* Embedded 2D Adventure Viewport */}
      <div
        onClick={focusGame}
        className="relative border-4 border-pastel-dark rounded-2xl overflow-hidden shadow-retro bg-[#110d1f] aspect-[16/9] w-full min-h-[380px] sm:min-h-[440px] cursor-pointer"
      >
        <iframe
          ref={iframeRef}
          src="/pixel-quest.html"
          title="Pixel Quest: The Lost Crystal"
          className="w-full h-full border-0 block"
          allow="autoplay; fullscreen"
        />
      </div>

      {/* Quick Controls Cheat Sheet */}
      <div className="p-2.5 bg-pastel-warm/70 border border-pastel-dark/30 rounded-xl text-[11px] text-center text-pastel-dark font-medium flex flex-wrap items-center justify-around gap-2">
        <span>🎮 <strong>A / D or ← →</strong> Move</span>
        <span>⬆️ <strong>W / Space</strong> Jump &amp; Double Jump</span>
        <span>⚔️ <strong>Left Click</strong> Aim &amp; Slash</span>
        <span>✨ <strong>Right Click</strong> Crystal Blast</span>
        <span>🗝️ <strong>E</strong> Interact</span>
        <span>⏸️ <strong>Esc</strong> Pause</span>
      </div>
    </div>
  );
};
