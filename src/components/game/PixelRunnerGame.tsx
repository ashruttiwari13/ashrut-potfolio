'use client';

import React, { useState, useRef } from 'react';
import { Maximize2, Skull, Sword, Gamepad2 } from 'lucide-react';

export const PixelRunnerGame: React.FC = () => {
  const [activeGame, setActiveGame] = useState<'3d' | '2d'>('3d');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const focusGame = () => {
    iframeRef.current?.focus();
  };

  return (
    <div className="space-y-3 select-none">
      {/* Top Bar with Mode Info & Fullscreen Action */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-white border-2 border-pastel-dark rounded-retro-sm text-xs font-bold shadow-sm">
        <div className="flex items-center gap-2">
          <span className={`p-1.5 rounded-lg border border-pastel-dark ${activeGame === '3d' ? 'bg-[#ff7b90] text-white' : 'bg-pastel-pink text-pastel-dark'}`}>
            {activeGame === '3d' ? <Skull size={15} /> : <Sword size={15} />}
          </span>
          <div>
            <h4 className="font-extrabold text-xs text-pastel-dark">
              {activeGame === '3d' ? 'HAUNTED HOUSE: THE ESCAPE' : 'PIXEL QUEST: The Lost Crystal'}
            </h4>
            <p className="text-[10px] text-pastel-soft">
              {activeGame === '3d'
                ? '3D First-Person Survival Horror · The Keeper AI · Puzzles & Hiding'
                : '16-Bit Platformer · 3 Connected Stages · Crystal Guardian Boss'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveGame(activeGame === '3d' ? '2d' : '3d')}
            className="retro-btn text-xs px-2.5 py-1.5 bg-[#f0e6d2] text-pastel-dark hover:bg-white"
            title="Switch between 3D Horror and 2D Platformer"
          >
            <Gamepad2 size={12} />
            <span>{activeGame === '3d' ? 'Play 2D Pixel Quest' : 'Play 3D Haunted House'}</span>
          </button>

          <a
            href={activeGame === '3d' ? '/haunted-house.html' : '/pixel-quest.html'}
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

      {/* Embedded 3D / 2D Viewport */}
      <div
        onClick={focusGame}
        className="relative border-4 border-pastel-dark rounded-2xl overflow-hidden shadow-retro bg-[#050406] aspect-[16/9] w-full min-h-[380px] sm:min-h-[460px] cursor-pointer"
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
      <div className="p-2.5 bg-pastel-warm/70 border border-pastel-dark/30 rounded-xl text-[11px] text-center text-pastel-dark font-medium flex flex-wrap items-center justify-around gap-2">
        {activeGame === '3d' ? (
          <>
            <span>🎮 <strong>W/A/S/D</strong> Walk</span>
            <span>🖱️ <strong>Mouse</strong> Look (Click to lock)</span>
            <span>⚡ <strong>Shift</strong> Sprint</span>
            <span>🧎 <strong>C</strong> Crouch</span>
            <span>🔦 <strong>F</strong> Flashlight</span>
            <span>✋ <strong>E</strong> Interact &amp; Hide</span>
            <span>📦 <strong>G</strong> Drop (Noise Lure)</span>
            <span>⏸️ <strong>Esc</strong> Pause</span>
          </>
        ) : (
          <>
            <span>🎮 <strong>A / D or ← →</strong> Move</span>
            <span>⬆️ <strong>W / Space</strong> Jump &amp; Double Jump</span>
            <span>⚔️ <strong>Left Click</strong> Aim &amp; Slash</span>
            <span>✨ <strong>Right Click</strong> Crystal Blast</span>
            <span>🗝️ <strong>E</strong> Interact</span>
            <span>⏸️ <strong>Esc</strong> Pause</span>
          </>
        )}
      </div>
    </div>
  );
};
