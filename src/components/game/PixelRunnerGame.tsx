'use client';

import React, { useState, useRef } from 'react';
import { Maximize2, Skull, Sword, Gamepad2, Smartphone } from 'lucide-react';
import { soundFX } from '@/lib/soundEffects';

export const PixelRunnerGame: React.FC = () => {
  const [activeGame, setActiveGame] = useState<'3d' | '2d'>('3d');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const focusGame = () => {
    iframeRef.current?.focus();
  };

  const handleSwitchGame = (game: '3d' | '2d') => {
    soundFX.playClick(640);
    setActiveGame(game);
  };

  return (
    <div className="space-y-3 select-none">
      {/* Top Bar with Mode Info & Fullscreen Action */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 sm:p-2.5 bg-white border-2 border-pastel-dark rounded-retro-sm text-xs font-bold shadow-sm">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className={`p-1.5 rounded-lg border border-pastel-dark shrink-0 ${activeGame === '3d' ? 'bg-[#ff7b90] text-white' : 'bg-pastel-pink text-pastel-dark'}`}>
            {activeGame === '3d' ? <Skull size={15} /> : <Sword size={15} />}
          </span>
          <div className="min-w-0">
            <h4 className="font-extrabold text-xs text-pastel-dark break-words">
              {activeGame === '3d' ? 'HAUNTED HOUSE: THE ESCAPE' : 'PIXEL QUEST: The Lost Crystal'}
            </h4>
            <p className="text-[10px] text-pastel-soft break-words">
              {activeGame === '3d'
                ? '3D First-Person Survival Horror · The Keeper AI · Puzzles & Hiding'
                : '16-Bit Platformer · 3 Connected Stages · Crystal Guardian Boss'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => handleSwitchGame(activeGame === '3d' ? '2d' : '3d')}
            className="retro-btn text-xs px-2.5 py-1 bg-[#f0e6d2] text-pastel-dark hover:bg-white"
            title="Switch between 3D Horror and 2D Platformer"
          >
            <Gamepad2 size={12} />
            <span>{activeGame === '3d' ? 'Play 2D Pixel Quest' : 'Play 3D Haunted House'}</span>
          </button>

          <a
            href={activeGame === '3d' ? '/haunted-house.html' : '/pixel-quest.html'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundFX.playClick(720)}
            className="retro-btn retro-btn-primary text-xs px-3 py-1"
            title="Open dedicated standalone game tab"
          >
            <Maximize2 size={12} strokeWidth={2.5} />
            <span>Open Fullscreen</span>
          </a>
        </div>
      </div>

      {/* Mobile Tip Card */}
      <div className="sm:hidden flex items-center gap-2 p-2 bg-pastel-sky/30 border border-pastel-dark/30 rounded-xl text-[11px] font-bold text-pastel-dark">
        <Smartphone size={14} className="text-pastel-dark shrink-0 animate-pulse" />
        <span>📱 <strong>Mobile Tip:</strong> Tap <strong>&quot;Open Fullscreen&quot;</strong> above for immersive landscape gameplay!</span>
      </div>

      {/* Embedded 3D / 2D Viewport */}
      <div
        onClick={focusGame}
        className="relative border-4 border-pastel-dark rounded-2xl overflow-hidden shadow-retro bg-[#050406] aspect-[16/9] w-full min-h-[240px] sm:min-h-[440px] cursor-pointer"
      >
        <iframe
          ref={iframeRef}
          key={activeGame}
          src={activeGame === '3d' ? '/haunted-house.html' : '/pixel-quest.html'}
          title={activeGame === '3d' ? 'Haunted House: The Escape' : 'Pixel Quest: The Lost Crystal'}
          className="w-full h-full border-0 block"
          allow="autoplay; fullscreen"
        />
      </div>

      {/* Controls Guide */}
      <div className="p-2 sm:p-2.5 bg-pastel-warm/70 border border-pastel-dark/30 rounded-xl text-[10.5px] sm:text-[11px] text-center text-pastel-dark font-medium flex flex-wrap items-center justify-around gap-2">
        {activeGame === '3d' ? (
          <>
            <span>🎮 <strong>W/A/S/D</strong> Walk</span>
            <span>🖱️ <strong>Mouse</strong> Look</span>
            <span>⚡ <strong>Shift</strong> Sprint</span>
            <span>🧎 <strong>C</strong> Crouch</span>
            <span>🔦 <strong>F</strong> Flashlight</span>
            <span>✋ <strong>E</strong> Interact &amp; Hide</span>
            <span>📦 <strong>G</strong> Noise Lure</span>
          </>
        ) : (
          <>
            <span>🎮 <strong>A / D or ← →</strong> Move</span>
            <span>⬆️ <strong>W / Space</strong> Jump &amp; Double Jump</span>
            <span>⚔️ <strong>Click</strong> Slash</span>
            <span>✨ <strong>Right Click</strong> Crystal Blast</span>
            <span>🗝️ <strong>E</strong> Interact</span>
          </>
        )}
      </div>
    </div>
  );
};
