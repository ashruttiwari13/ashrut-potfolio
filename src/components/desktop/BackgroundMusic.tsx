'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface BackgroundMusicProps {
  isGameActive?: boolean;
  isAnyWindowOpen?: boolean;
  isAnyWindowMaximized?: boolean;
}

const DEFAULT_VOLUME = 0.35; // 35% comfortable, cozy volume
const AUDIO_SRC = '/assets/audio/website-music.mp3';

export const BackgroundMusic: React.FC<BackgroundMusicProps> = ({
  isGameActive = false,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isStartingRef = useRef<boolean>(false);
  const lastToggleRef = useRef<number>(0);

  // Component state: Cat sings automatically on site open across phone & desktop!
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isAudioActive, setIsAudioActive] = useState<boolean>(true);
  const isPlayingRef = useRef<boolean>(true);
  isPlayingRef.current = isPlaying;

  const [singFrame, setSingFrame] = useState<1 | 2>(1);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Smooth volume ramping helper
  const rampVolume = useCallback((targetVol: number, durationMs: number, onComplete?: () => void) => {
    if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);

    const audio = audioRef.current;
    if (!audio) return;

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

  // Main playback trigger: strict single-instance playback (never plays twice)
  const startPlayback = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setIsPlaying(true);
    isPlayingRef.current = true;
    setIsAudioActive(true);

    // If audio is already actively playing and unmuted, do not restart or double-play
    if (!audio.paused && audio.currentTime > 0 && !audio.muted) {
      return;
    }

    // Guard against concurrent overlapping play requests
    if (isStartingRef.current) return;
    isStartingRef.current = true;

    audio.muted = false;
    audio.volume = DEFAULT_VOLUME;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isStartingRef.current = false;
        })
        .catch(() => {
          isStartingRef.current = false;
          // If unmuted autoplay blocked by phone policy, keep playing muted until first touch
          audio.muted = true;
          audio.play().catch(() => {});
        });
    } else {
      isStartingRef.current = false;
    }
  }, []);

  // Pause playback cleanly
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

  // Toggle play/pause on cat click
  const togglePlay = useCallback(() => {
    setShowHint(false);
    const audio = audioRef.current;
    if (!audio) return;

    const isCurrentlySinging = isPlaying && isAudioActive;
    if (isCurrentlySinging) {
      pausePlayback();
    } else {
      startPlayback();
    }
  }, [pausePlayback, startPlayback, isPlaying, isAudioActive]);

  // Debounced tap handler for the singing cat widget button
  const handleToggle = useCallback((e?: React.SyntheticEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const now = Date.now();
    if (now - lastToggleRef.current < 250) return;
    lastToggleRef.current = now;
    togglePlay();
  }, [togglePlay]);

  // Automatic singing & audio playback on phone and desktop
  useEffect(() => {
    setIsPlaying(true);
    isPlayingRef.current = true;
    setIsAudioActive(true);

    const audio = audioRef.current;
    if (audio) {
      audio.muted = false;
      audio.volume = DEFAULT_VOLUME;
      const p = audio.play();
      if (p !== undefined) {
        p.then(() => {
          // Autoplay with sound succeeded immediately
        }).catch(() => {
          // If phone browser blocks unmuted sound on cold load:
          // Keep audio stream active in muted mode so cat sings immediately without interruption
          if (audio) {
            audio.muted = true;
            audio.play().catch(() => {});
          }
        });
      }
    }

    // Seamless instant unmute on very first touch/scroll anywhere on the phone
    const unmuteOnFirstTouch = () => {
      const aud = audioRef.current;
      if (aud && isPlayingRef.current) {
        aud.muted = false;
        aud.volume = DEFAULT_VOLUME;
        if (aud.paused) {
          aud.play().catch(() => {});
        }
      }
    };

    window.addEventListener('touchstart', unmuteOnFirstTouch, { once: true, passive: true });
    window.addEventListener('touchend', unmuteOnFirstTouch, { once: true, passive: true });
    window.addEventListener('pointerdown', unmuteOnFirstTouch, { once: true, passive: true });
    window.addEventListener('click', unmuteOnFirstTouch, { once: true, passive: true });

    return () => {
      window.removeEventListener('touchstart', unmuteOnFirstTouch);
      window.removeEventListener('touchend', unmuteOnFirstTouch);
      window.removeEventListener('pointerdown', unmuteOnFirstTouch);
      window.removeEventListener('click', unmuteOnFirstTouch);
    };
  }, []);

  // Singing animation loop (alternates frame 1 and 2 automatically when cat is singing)
  useEffect(() => {
    if (!isPlaying || !isAudioActive) {
      setSingFrame(1);
      return;
    }
    const interval = setInterval(() => {
      setSingFrame((prev) => (prev === 1 ? 2 : 1));
    }, 420);
    return () => clearInterval(interval);
  }, [isPlaying, isAudioActive]);

  // Duck volume during 3D gameplay
  useEffect(() => {
    if (!isPlaying || !isAudioActive) return;
    if (isGameActive) {
      rampVolume(DEFAULT_VOLUME * 0.25, 400);
    } else {
      rampVolume(DEFAULT_VOLUME, 400);
    }
  }, [isGameActive, isPlaying, isAudioActive, rampVolume]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
    };
  }, []);

  const isSinging = isPlaying && isAudioActive;

  return (
    <>
      {/* Hidden Native Audio Element (Single Source of Truth) */}
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        loop
        preload="auto"
        playsInline
        onPlay={() => {
          setIsAudioActive(true);
          setIsPlaying(true);
          isPlayingRef.current = true;
        }}
        onError={() => {
          if (audioRef.current && !audioRef.current.src.endsWith('/audio/website-music.mp3')) {
            audioRef.current.src = '/audio/website-music.mp3';
            if (isPlayingRef.current) {
              audioRef.current.play().catch(() => {});
            }
          }
        }}
        onEnded={() => {
          if (audioRef.current && isPlayingRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
          }
        }}
      />

      {/* Floating Singing Cat Music Widget Container: Safe-Area Anchored in Top Right */}
      <div
        className="fixed z-[9990] pointer-events-auto select-none w-auto sm:w-[92px] flex flex-col items-center transition-all duration-200 right-2 sm:right-4"
        style={{ 
          top: 'max(0.375rem, env(safe-area-inset-top, 0.375rem))',
          pointerEvents: 'auto' 
        }}
      >
        <div
          className="relative flex flex-col items-center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Cute Speech Bubble / Tooltip */}
          {(showHint || isHovered) && (
            <div
              role="status"
              className="absolute top-[calc(100%+6px)] right-0 whitespace-nowrap px-2.5 py-1 sm:px-3 sm:py-1.5 bg-[rgba(255,250,240,0.98)] backdrop-blur-md rounded-2xl border-2 border-pastel-dark shadow-retro text-[9px] sm:text-xs text-pastel-dark flex items-center gap-1.5 sm:gap-2 pointer-events-none z-50 transition-opacity duration-150 max-w-[210px] sm:max-w-[280px]"
            >
              <span className="text-sm shrink-0">{isSinging ? '🎶' : '🌸'}</span>
              <div className="flex flex-col">
                <span className="font-bold text-[9.5px] sm:text-[11px] leading-tight truncate">
                  {isSinging
                    ? 'Singing cheerfully! Tap to mute'
                    : 'Cat is resting. Tap to sing! 🎵'}
                </span>
                <span className="text-[7.5px] sm:text-[9px] text-pastel-soft leading-none mt-0.5">
                  {isSinging ? 'Tap cat to stop ⏹️' : 'Tap cat to play ▶️'}
                </span>
              </div>
              {/* Cute speech bubble caret pointer pointing UP to the cat */}
              <div className="absolute -top-1.5 right-4 sm:right-7 w-2.5 h-2.5 bg-[#fffaf0] border-l-2 border-t-2 border-pastel-dark rotate-45 pointer-events-none" />
            </div>
          )}

          {/* Floating Magical Musical Notes (strictly when cat is singing) */}
          {isSinging && (
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

          {/* Interactive Character Button (Instant zero-delay touch & click response) */}
          <button
            type="button"
            id="bgm-toggle-button"
            onClick={handleToggle}
            onTouchEnd={(e) => {
              e.preventDefault();
              handleToggle(e);
            }}
            className="relative flex flex-col items-center justify-center p-0.5 sm:p-1.5 rounded-2xl cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-pastel-dark select-none touch-manipulation min-w-[54px] min-h-[54px] active:scale-95 transition-transform"
            aria-label={isSinging ? 'Stop music (cat singing)' : 'Start music (cat singing)'}
            title={isSinging ? 'Click or tap to stop music' : 'Click or tap to play music'}
          >
            {/* Cat Sprite on Pastel Cloud - Direct <img> for instant zero-latency render on all mobile browsers */}
            <div
              className={`relative w-[54px] h-[54px] sm:w-[84px] sm:h-[84px] drop-shadow-[2px_3px_0_rgba(61,61,61,0.22)] flex items-center justify-center overflow-visible ${
                isSinging
                  ? 'animate-[catSingBounce_0.84s_ease-in-out_infinite]'
                  : 'animate-[catIdleFloat_3s_ease-in-out_infinite]'
              }`}
            >
              {/* Idle Frame */}
              <img
                src="/assets/cat_idle.png"
                alt="Cute cat resting on fluffy cloud"
                width={84}
                height={84}
                loading="eager"
                decoding="sync"
                className={`w-full h-full object-contain select-none pointer-events-none ${
                  !isSinging ? 'block' : 'hidden'
                }`}
              />
              {/* Singing Frame 1 (paw up singing) */}
              <img
                src="/assets/cat_sing_1.png"
                alt="Cute cat singing cheerfully frame 1"
                width={84}
                height={84}
                loading="eager"
                decoding="sync"
                className={`w-full h-full object-contain select-none pointer-events-none ${
                  isSinging && singFrame === 1 ? 'block' : 'hidden'
                }`}
              />
              {/* Singing Frame 2 (dancing & wagging tail) */}
              <img
                src="/assets/cat_sing_2.png"
                alt="Cute cat dancing and singing frame 2"
                width={84}
                height={84}
                loading="eager"
                decoding="sync"
                className={`w-full h-full object-contain select-none pointer-events-none ${
                  isSinging && singFrame === 2 ? 'block' : 'hidden'
                }`}
              />
            </div>

            {/* Status Indicator Badge Under Cat */}
            <span
              className={`text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded-full border border-pastel-dark shadow-retro-sm -mt-0.5 transition-colors duration-150 flex items-center gap-1 ${
                isSinging
                  ? 'bg-pastel-mint text-pastel-dark'
                  : isHovered
                  ? 'bg-pastel-peach text-pastel-dark'
                  : 'bg-white/95 text-pastel-dark'
              }`}
            >
              {isSinging ? (
                <>
                  <Volume2 size={9} className="text-emerald-700 shrink-0" />
                  <span>Singing 🎵</span>
                </>
              ) : (
                <>
                  <VolumeX size={9} className="text-rose-600 shrink-0" />
                  <span>Muted</span>
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    </>
  );
};
