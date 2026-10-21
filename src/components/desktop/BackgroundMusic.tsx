'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

interface BackgroundMusicProps {
  isGameActive?: boolean;
  isAnyWindowMaximized?: boolean;
}

const STORAGE_KEY_ENABLED = 'ashrut_bgm_enabled';
const DEFAULT_VOLUME = 0.25; // 25% comfortable, cozy volume

export const BackgroundMusic: React.FC<BackgroundMusicProps> = ({
  isGameActive = false,
  isAnyWindowMaximized = false,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Component state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [singFrame, setSingFrame] = useState<1 | 2>(1);
  const [hasError, setHasError] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Smooth volume ramping helper
  const rampVolume = useCallback((targetVol: number, durationMs: number, onComplete?: () => void) => {
    if (!audioRef.current) return;
    if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);

    const audio = audioRef.current;
    const startVol = audio.volume;
    const diff = targetVol - startVol;
    const steps = 16;
    const stepInterval = Math.max(10, Math.floor(durationMs / steps));
    let currentStep = 0;

    fadeTimerRef.current = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const nextVol = Math.max(0, Math.min(1, startVol + diff * progress));
      audio.volume = nextVol;

      if (currentStep >= steps) {
        if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
        audio.volume = targetVol;
        if (onComplete) onComplete();
      }
    }, stepInterval);
  }, []);

  // Start playback with smooth fade in
  const startPlayback = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setHasError(false);
    audio.volume = 0;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setShowHint(false);
          rampVolume(DEFAULT_VOLUME, 450);
          try {
            localStorage.setItem(STORAGE_KEY_ENABLED, 'true');
          } catch {}
        })
        .catch((err) => {
          // Browser autoplay policy prevented instant audio: wait for user interaction
          console.log('Autoplay waiting for user gesture:', err?.name);
          setIsPlaying(false);
        });
    }
  }, [rampVolume]);

  // Pause / turn off playback with smooth fade out
  const pausePlayback = useCallback((userInitiated = true) => {
    const audio = audioRef.current;
    if (!audio) return;

    rampVolume(0, 300, () => {
      audio.pause();
      setIsPlaying(false);
      if (userInitiated) {
        try {
          localStorage.setItem(STORAGE_KEY_ENABLED, 'false');
        } catch {}
      }
    });
  }, [rampVolume]);

  // Main toggle handler (Click on Cat to toggle Singing & Music off / on)
  const togglePlay = () => {
    setShowHint(false);
    try {
      sessionStorage.setItem('ashrut_bgm_hint_seen', 'true');
    } catch {}

    if (isPlaying) {
      pausePlayback(true);
    } else {
      startPlayback();
    }
  };

  // Automatic playback on website start
  useEffect(() => {
    let shouldAutoPlay = true;
    try {
      const storedEnabled = localStorage.getItem(STORAGE_KEY_ENABLED);
      // Only skip autoplay if the user explicitly clicked OFF before
      if (storedEnabled === 'false') {
        shouldAutoPlay = false;
      }
    } catch {}

    if (!shouldAutoPlay) return;

    // 1. Attempt instant direct autoplay on website load
    startPlayback();

    // 2. In case browser blocks unmuted audio before user gesture,
    // attach a one-time gesture listener anywhere on the page to start automatically
    const handleFirstGesture = () => {
      if (!audioRef.current || audioRef.current.paused) {
        startPlayback();
      }
      cleanupGestureListeners();
    };

    const cleanupGestureListeners = () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('scroll', handleFirstGesture, { capture: true });
      window.removeEventListener('touchstart', handleFirstGesture);
    };

    window.addEventListener('pointerdown', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });
    window.addEventListener('scroll', handleFirstGesture, { once: true, capture: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });

    return () => {
      cleanupGestureListeners();
    };
  }, [startPlayback]);

  // Singing animation loop (alternates frame 1 and 2 while music is playing)
  useEffect(() => {
    if (!isPlaying) {
      setSingFrame(1);
      return;
    }
    const interval = setInterval(() => {
      setSingFrame((prev) => (prev === 1 ? 2 : 1));
    }, 420);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Coexistence with 3D Horror Game: Gently duck volume during gameplay
  useEffect(() => {
    if (!audioRef.current || !isPlaying) return;
    if (isGameActive) {
      rampVolume(DEFAULT_VOLUME * 0.25, 400);
    } else {
      rampVolume(DEFAULT_VOLUME, 400);
    }
  }, [isGameActive, isPlaying, rampVolume]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
    };
  }, []);

  return (
    <>
      {/* Hidden Native Audio Element */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        onError={() => {
          console.warn('Audio playback/load error.');
          setHasError(true);
          setIsPlaying(false);
        }}
        onEnded={() => {
          if (audioRef.current && isPlaying) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
          }
        }}
      >
        <source src="/assets/audio/website-music.mp3" type="audio/mpeg" />
        <source src="/assets/audio/calm-ambient.mp3" type="audio/mpeg" />
        <source src="/audio/website-music.mp3" type="audio/mpeg" />
        <source src="/audio/calm-ambient.mp3" type="audio/mpeg" />
      </audio>

      {/* Floating Singing Cat Music Widget Container */}
      <div
        className={`fixed z-[290] pointer-events-auto select-none flex flex-col transition-all duration-300 ${
          /* Desktop: safely anchored at bottom-left in the dock column, completely clear of windows and close buttons */
          'md:bottom-3 md:left-4 md:top-auto md:right-auto md:items-center'
        } ${
          /* Mobile: hide when window is maximized to keep 100% of mobile screen clear; otherwise bottom-left */
          isAnyWindowMaximized
            ? 'max-md:opacity-0 max-md:pointer-events-none'
            : 'max-md:bottom-[72px] max-md:left-3 max-md:items-start'
        }`}
      >
        {/* Cute Speech Bubble / Tooltip (on hover or onboarding hint) */}
        {(showHint || isHovered) && (
          <div
            role="status"
            className="mb-1.5 px-3 py-1.5 bg-[rgba(255,250,240,0.98)] backdrop-blur-md rounded-2xl border-2 border-pastel-dark shadow-retro text-xs text-pastel-dark flex items-center gap-1.5 animate-bounce transition-all duration-300"
          >
            <span className="text-sm">{isPlaying ? '🎶' : '🌸'}</span>
            <div className="flex flex-col">
              <span className="font-bold text-[11px] leading-tight">
                {hasError
                  ? 'Singing Cat: Resting'
                  : isPlaying
                  ? 'Singing cheerfully! Click to turn off'
                  : 'Music off. Click to play! 🎵'}
              </span>
              <span className="text-[9px] text-pastel-soft leading-none mt-0.5">
                {isPlaying ? 'Click cat to pause music' : 'Tap to start music'}
              </span>
            </div>
            {showHint && !isHovered && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowHint(false);
                }}
                className="ml-1 p-0.5 hover:bg-pastel-peach/60 rounded-full text-pastel-dark"
                title="Dismiss"
                aria-label="Dismiss speech bubble"
              >
                <X size={11} />
              </button>
            )}
          </div>
        )}

        {/* THE SINGING CAT BUTTON: Clicking toggles music OFF / ON */}
        <div className="relative group">
          {/* Floating Magical Musical Notes (when singing) */}
          {isPlaying && (
            <div className="absolute -top-3 left-0 right-0 h-6 pointer-events-none overflow-visible">
              <span className="absolute -left-1 text-amber-500 font-bold text-xs animate-[floatNote1_1.4s_ease-in-out_infinite]">
                ♪
              </span>
              <span className="absolute left-1/2 -translate-x-1/2 text-orange-400 font-bold text-sm animate-[floatNote2_1.6s_ease-in-out_infinite_0.4s]">
                ♫
              </span>
              <span className="absolute -right-1 text-pink-500 font-bold text-xs animate-[floatNote3_1.5s_ease-in-out_infinite_0.8s]">
                ♩
              </span>
            </div>
          )}

          {/* Interactive Character Button */}
          <button
            type="button"
            id="bgm-toggle-button"
            onClick={togglePlay}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative flex flex-col items-center justify-center p-1 rounded-2xl cursor-pointer transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-pastel-dark ${
              isPlaying
                ? 'animate-[catSingBounce_0.84s_ease-in-out_infinite] scale-105'
                : 'hover:scale-105 active:scale-95 animate-[catIdleFloat_3s_ease-in-out_infinite]'
            }`}
            aria-label={isPlaying ? 'Turn off music (cat singing)' : 'Turn on music'}
            title={isPlaying ? 'Click to turn off music' : 'Click to turn on music'}
          >
            {/* Cat Sprite on Pastel Cloud (Idle & Dancing Frames) */}
            <div className="relative w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] drop-shadow-[2px_3px_0_rgba(61,61,61,0.22)]">
              {/* Idle Frame */}
              <Image
                src="/assets/cat_idle.png"
                alt="Cute cat resting on fluffy cloud"
                fill
                sizes="84px"
                priority
                className={`object-contain select-none transition-opacity duration-150 ${
                  !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              />
              {/* Singing Frame 1 (paw up singing) */}
              <Image
                src="/assets/cat_sing_1.png"
                alt="Cute cat singing cheerfully frame 1"
                fill
                sizes="84px"
                priority
                className={`object-contain select-none transition-opacity duration-75 ${
                  isPlaying && singFrame === 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              />
              {/* Singing Frame 2 (dancing & wagging tail) */}
              <Image
                src="/assets/cat_sing_2.png"
                alt="Cute cat dancing and singing frame 2"
                fill
                sizes="84px"
                priority
                className={`object-contain select-none transition-opacity duration-75 ${
                  isPlaying && singFrame === 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              />
            </div>

            {/* Status Indicator Badge Under Cat */}
            <span
              className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full border border-pastel-dark shadow-retro-sm -mt-0.5 transition-all ${
                isPlaying
                  ? 'bg-pastel-mint text-pastel-dark'
                  : 'bg-white/90 text-pastel-dark hover:bg-pastel-peach'
              }`}
            >
              {hasError ? 'Resting' : isPlaying ? 'Music ON 🎵' : 'Music OFF 🔇'}
            </span>
          </button>
        </div>
      </div>
    </>
  );
};
