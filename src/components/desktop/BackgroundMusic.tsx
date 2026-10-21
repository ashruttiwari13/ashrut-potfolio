'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

interface BackgroundMusicProps {
  isGameActive?: boolean;
  isAnyWindowOpen?: boolean;
  isAnyWindowMaximized?: boolean;
}

const STORAGE_KEY_ENABLED = 'ashrut_bgm_enabled';
const DEFAULT_VOLUME = 0.25; // 25% comfortable, cozy volume

export const BackgroundMusic: React.FC<BackgroundMusicProps> = ({
  isGameActive = false,
  isAnyWindowOpen = false,
  isAnyWindowMaximized = false,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastToggleRef = useRef<number>(0);

  // Component state - Starts singing immediately when website starts on all platforms!
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isAudioActive, setIsAudioActive] = useState<boolean>(false);
  const isPlayingRef = useRef<boolean>(true);
  isPlayingRef.current = isPlaying;

  const [singFrame, setSingFrame] = useState<1 | 2>(1);
  const [hasError, setHasError] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(true);
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

  // Start playback & cat singing
  const startPlayback = useCallback(() => {
    setIsPlaying(true);
    isPlayingRef.current = true;
    setHasError(false);

    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = false;
    audio.volume = DEFAULT_VOLUME;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsAudioActive(true);
          setIsPlaying(true);
          setShowHint(false);
        })
        .catch((err) => {
          console.log('Audio playback waiting for interaction:', err?.name);
        });
    }
  }, []);

  // Pause playback & stop cat singing when user clicks/taps to stop
  const pausePlayback = useCallback(() => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    setIsAudioActive(false);

    const audio = audioRef.current;
    if (!audio) return;

    rampVolume(0, 150, () => {
      audio.pause();
    });
  }, [rampVolume]);

  // Main toggle handler: Click/Tap on Cat to stop / start singing anytime
  const togglePlay = useCallback(() => {
    setShowHint(false);
    const audio = audioRef.current;

    // If audio is currently actively playing with sound -> User wants to STOP it!
    if (audio && !audio.paused && isPlayingRef.current) {
      pausePlayback();
    } else {
      // Audio is paused or waiting -> User wants to START it!
      startPlayback();
    }
  }, [pausePlayback, startPlayback]);

  // Debounced tap handler for mobile & desktop to prevent double-toggle
  const handleToggle = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    const now = Date.now();
    if (now - lastToggleRef.current < 350) return;
    lastToggleRef.current = now;
    togglePlay();
  };

  // Automatic singing & multi-platform audio unlock on website start
  useEffect(() => {
    // 1. Cat is singing immediately on website load on all platforms!
    setIsPlaying(true);
    isPlayingRef.current = true;

    // 2. Direct autoplay attempt on page load
    const audio = audioRef.current;
    if (audio) {
      audio.muted = false;
      audio.volume = DEFAULT_VOLUME;
      const p = audio.play();
      if (p !== undefined) {
        p.then(() => {
          setIsAudioActive(true);
        }).catch((err) => {
          console.log('Browser policy waiting for first user gesture before unmuting:', err?.name);
        });
      }
    }

    // 3. Robust touch/click unlock for all browsers across all platforms
    const tryUnlockAudio = () => {
      if (!isPlayingRef.current) return;
      const aud = audioRef.current;
      if (!aud) return;

      // Unlock Web Audio API context if present
      if (typeof window !== 'undefined') {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          if (!audioContextRef.current) {
            audioContextRef.current = new AudioCtx();
          }
          if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume().catch(() => {});
          }
        }
      }

      aud.muted = false;
      aud.volume = DEFAULT_VOLUME;
      const p = aud.play();
      if (p !== undefined) {
        p.then(() => {
          setIsAudioActive(true);
          cleanupGestureListeners();
        }).catch(() => {
          // Keep listening until genuine user gesture unlocks audio
        });
      }
    };

    const cleanupGestureListeners = () => {
      window.removeEventListener('pointerdown', tryUnlockAudio);
      window.removeEventListener('click', tryUnlockAudio);
      window.removeEventListener('touchstart', tryUnlockAudio);
      window.removeEventListener('touchend', tryUnlockAudio);
      window.removeEventListener('keydown', tryUnlockAudio);
    };

    window.addEventListener('pointerdown', tryUnlockAudio, { passive: true });
    window.addEventListener('click', tryUnlockAudio, { passive: true });
    window.addEventListener('touchstart', tryUnlockAudio, { passive: true });
    window.addEventListener('touchend', tryUnlockAudio, { passive: true });
    window.addEventListener('keydown', tryUnlockAudio, { passive: true });

    // Show initial speech bubble for 4.5 seconds on website start
    setShowHint(true);
    const hintTimer = setTimeout(() => setShowHint(false), 4500);

    return () => {
      clearTimeout(hintTimer);
      cleanupGestureListeners();
    };
  }, []);

  // Singing animation loop (alternates frame 1 and 2 while cat is singing)
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
        src="/assets/audio/website-music.mp3"
        loop
        preload="auto"
        playsInline
        onPlay={() => {
          setIsAudioActive(true);
          setIsPlaying(true);
          isPlayingRef.current = true;
        }}
        onPause={() => {
          setIsAudioActive(false);
        }}
        onError={() => {
          if (audioRef.current && !audioRef.current.src.endsWith('/audio/website-music.mp3')) {
            audioRef.current.src = '/audio/website-music.mp3';
            if (isPlayingRef.current) audioRef.current.play().catch(() => {});
          } else {
            console.warn('Audio playback/load error.');
            setHasError(true);
          }
        }}
        onEnded={() => {
          if (audioRef.current && isPlaying) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
          }
        }}
      >
        <source src="/assets/audio/website-music.mp3" type="audio/mpeg" />
        <source src="/audio/website-music.mp3" type="audio/mpeg" />
        <source src="/assets/audio/calm-ambient.mp3" type="audio/mpeg" />
      </audio>

      {/* Floating Singing Cat Music Widget Container: Positioned in Up-Right */}
      <div
        className="fixed z-[9999] pointer-events-auto select-none w-auto sm:w-[92px] flex flex-col items-center transition-all duration-200 top-1.5 right-2.5 sm:top-3 sm:right-4"
        style={{ pointerEvents: 'auto' }}
      >
        <div
          className="relative flex flex-col items-center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Cute Speech Bubble / Tooltip (Positioned ABSOLUTE below the cat, extending inwards to left) */}
          {(showHint || isHovered) && (
            <div
              role="status"
              className="absolute top-[calc(100%+6px)] right-0 whitespace-nowrap px-2.5 py-1 sm:px-3 sm:py-1.5 bg-[rgba(255,250,240,0.98)] backdrop-blur-md rounded-2xl border-2 border-pastel-dark shadow-retro text-[10px] sm:text-xs text-pastel-dark flex items-center gap-1.5 sm:gap-2 pointer-events-none z-50 transition-opacity duration-150"
            >
              <span className="text-sm shrink-0">{isAudioActive ? '🎶' : isPlaying ? '🎵' : '🌸'}</span>
              <div className="flex flex-col">
                <span className="font-bold text-[10px] sm:text-[11px] leading-tight">
                  {hasError
                    ? 'Singing Cat: Resting'
                    : isAudioActive
                    ? 'Singing cheerfully! Click cat to stop ⏹️'
                    : isPlaying
                    ? 'Singing Cat! Click anywhere to hear me sing 🎵'
                    : 'Cat is resting. Click to sing! 🎵'}
                </span>
                <span className="text-[8px] sm:text-[9px] text-pastel-soft leading-none mt-0.5">
                  {isAudioActive
                    ? 'Click to stop the cat'
                    : isPlaying
                    ? 'Click cat to start music'
                    : 'Click cat to sing again'}
                </span>
              </div>
              {/* Cute speech bubble caret pointer pointing UP to the cat */}
              <div className="absolute -top-1.5 right-5 sm:right-7 w-2.5 h-2.5 bg-[#fffaf0] border-l-2 border-t-2 border-pastel-dark rotate-45 pointer-events-none" />
            </div>
          )}

          {/* Floating Magical Musical Notes (when singing) */}
          {(isAudioActive || isPlaying) && (
            <div className="absolute -top-2 sm:-top-3 left-0 right-0 h-5 sm:h-6 pointer-events-none overflow-visible">
              <span className="absolute -left-1 text-amber-500 font-bold text-[10px] sm:text-xs animate-[floatNote1_1.4s_ease-in-out_infinite]">
                ♪
              </span>
              <span className="absolute left-1/2 -translate-x-1/2 text-orange-400 font-bold text-xs sm:text-sm animate-[floatNote2_1.6s_ease-in-out_infinite_0.4s]">
                ♫
              </span>
              <span className="absolute -right-1 text-pink-500 font-bold text-[10px] sm:text-xs animate-[floatNote3_1.5s_ease-in-out_infinite_0.8s]">
                ♩
              </span>
            </div>
          )}

          {/* Interactive Character Button (Stationary bounding box, no shifting or jitter on hover) */}
          <button
            type="button"
            id="bgm-toggle-button"
            onClick={handleToggle}
            onTouchEnd={handleToggle}
            className="relative flex flex-col items-center justify-center p-1 sm:p-1.5 rounded-2xl cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-pastel-dark select-none touch-manipulation min-w-[54px] min-h-[54px]"
            aria-label={isAudioActive ? 'Stop music (cat singing)' : 'Start music (cat singing)'}
            title={isAudioActive ? 'Click to stop the cat from singing' : 'Click to make the cat sing'}
          >
            {/* Cat Sprite on Pastel Cloud */}
            <div
              className={`relative w-[48px] h-[48px] sm:w-[84px] sm:h-[84px] drop-shadow-[2px_3px_0_rgba(61,61,61,0.22)] ${
                isPlaying
                  ? 'animate-[catSingBounce_0.84s_ease-in-out_infinite]'
                  : isHovered
                  ? ''
                  : 'animate-[catIdleFloat_3s_ease-in-out_infinite]'
              }`}
            >
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
              className={`text-[7.5px] sm:text-[9px] font-bold px-1.5 py-0.2 sm:px-2.5 sm:py-0.5 rounded-full border border-pastel-dark shadow-retro-sm -mt-0.5 transition-colors duration-150 ${
                isAudioActive || isPlaying
                  ? 'bg-pastel-mint text-pastel-dark'
                  : isHovered
                  ? 'bg-pastel-peach text-pastel-dark'
                  : 'bg-white/95 text-pastel-dark'
              }`}
            >
              {hasError
                ? 'Resting'
                : isAudioActive
                ? 'Singing 🎵'
                : isPlaying
                ? 'Singing 🎵'
                : 'Stopped 🔇'}
            </span>
          </button>
        </div>
      </div>
    </>
  );
};
