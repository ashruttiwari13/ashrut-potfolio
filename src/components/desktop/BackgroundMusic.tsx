'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Volume2, VolumeX, Play } from 'lucide-react';

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
  const lastToggleRef = useRef<number>(0);

  // Web Audio fallback references
  const audioContextRef = useRef<AudioContext | null>(null);
  const webAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const webAudioGainRef = useRef<GainNode | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const isWebAudioPlayingRef = useRef<boolean>(false);

  // Component state
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isAudioActive, setIsAudioActive] = useState<boolean>(false);
  const [needsGesture, setNeedsGesture] = useState<boolean>(false);
  const isPlayingRef = useRef<boolean>(true);
  isPlayingRef.current = isPlaying;

  const [singFrame, setSingFrame] = useState<1 | 2>(1);
  const [hasError, setHasError] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Unlock / Resume Web Audio API context
  const getOrCreateAudioContext = useCallback(() => {
    if (typeof window === 'undefined') return null;
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          audioContextRef.current = new AudioCtx();
        }
      }
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume().catch(() => {});
      }
      return audioContextRef.current;
    } catch {
      return null;
    }
  }, []);

  // Web Audio API buffer playback fallback (rock-solid on mobile Safari & Chrome)
  const playWebAudioFallback = useCallback(async () => {
    try {
      const ctx = getOrCreateAudioContext();
      if (!ctx) return false;

      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      if (!audioBufferRef.current) {
        const res = await fetch(AUDIO_SRC);
        const arrayBuf = await res.arrayBuffer();
        audioBufferRef.current = await ctx.decodeAudioData(arrayBuf);
      }

      if (webAudioSourceRef.current) {
        try { webAudioSourceRef.current.stop(); } catch {}
      }

      const source = ctx.createBufferSource();
      const gain = ctx.createGain();
      source.buffer = audioBufferRef.current;
      source.loop = true;
      gain.gain.value = DEFAULT_VOLUME;

      source.connect(gain);
      gain.connect(ctx.destination);

      source.start(0);
      webAudioSourceRef.current = source;
      webAudioGainRef.current = gain;
      isWebAudioPlayingRef.current = true;

      setIsAudioActive(true);
      setIsPlaying(true);
      setNeedsGesture(false);
      return true;
    } catch (err) {
      console.warn('Web Audio fallback could not play:', err);
      return false;
    }
  }, [getOrCreateAudioContext]);

  const stopWebAudio = useCallback(() => {
    if (webAudioSourceRef.current) {
      try {
        webAudioSourceRef.current.stop();
      } catch {}
      webAudioSourceRef.current = null;
    }
    isWebAudioPlayingRef.current = false;
  }, []);

  // Smooth volume ramping helper
  const rampVolume = useCallback((targetVol: number, durationMs: number, onComplete?: () => void) => {
    if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);

    const audio = audioRef.current;
    if (isWebAudioPlayingRef.current && webAudioGainRef.current && audioContextRef.current) {
      try {
        const gain = webAudioGainRef.current;
        gain.gain.setValueAtTime(gain.gain.value, audioContextRef.current.currentTime);
        gain.gain.linearRampToValueAtTime(targetVol, audioContextRef.current.currentTime + durationMs / 1000);
        if (onComplete) setTimeout(onComplete, durationMs);
        return;
      } catch {}
    }

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

  // Main playback trigger: starts HTML5 audio or Web Audio fallback
  const startPlayback = useCallback(() => {
    setIsPlaying(true);
    isPlayingRef.current = true;
    setHasError(false);
    setNeedsGesture(false);

    getOrCreateAudioContext();

    const audio = audioRef.current;
    if (audio) {
      audio.muted = false;
      audio.volume = DEFAULT_VOLUME;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsAudioActive(true);
            setIsPlaying(true);
            setNeedsGesture(false);
            setShowHint(false);
          })
          .catch(async (err) => {
            console.log('HTML5 play rejected, attempting Web Audio API fallback:', err?.name);
            const playedWebAudio = await playWebAudioFallback();
            if (!playedWebAudio) {
              setNeedsGesture(true);
              setIsAudioActive(false);
            }
          });
        return;
      }
    }

    // Direct Web Audio fallback if no HTML audio tag
    playWebAudioFallback();
  }, [getOrCreateAudioContext, playWebAudioFallback]);

  // Pause playback
  const pausePlayback = useCallback(() => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    setIsAudioActive(false);
    setNeedsGesture(false);

    stopWebAudio();

    const audio = audioRef.current;
    if (!audio) return;

    rampVolume(0, 150, () => {
      audio.pause();
    });
  }, [rampVolume, stopWebAudio]);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    setShowHint(false);
    const audio = audioRef.current;

    const isCurrentlyPlaying = (audio && !audio.paused && isAudioActive) || isWebAudioPlayingRef.current;

    if (isCurrentlyPlaying) {
      pausePlayback();
    } else {
      startPlayback();
    }
  }, [pausePlayback, startPlayback, isAudioActive]);

  // Debounced tap handler
  const handleToggle = useCallback((e?: React.SyntheticEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const now = Date.now();
    if (now - lastToggleRef.current < 250) return;
    lastToggleRef.current = now;
    togglePlay();
  }, [togglePlay]);

  // Autoplay attempt on mount & global gesture unlock
  useEffect(() => {
    setIsPlaying(true);
    isPlayingRef.current = true;

    // Check if audio already entered during this session
    const audio = audioRef.current;
    if (audio) {
      audio.muted = false;
      audio.volume = DEFAULT_VOLUME;
      const p = audio.play();
      if (p !== undefined) {
        p.then(() => {
          setIsAudioActive(true);
          setIsPlaying(true);
          setNeedsGesture(false);
        }).catch((err) => {
          // Autoplay blocked by mobile phone browser policy: wait for first tap anywhere
          console.log('Browser blocked autoplay on mobile, awaiting first tap:', err?.name);
          setNeedsGesture(true);
          setIsAudioActive(false);
          setShowHint(true);
          setTimeout(() => setShowHint(false), 4500);
        });
      }
    }

    // Global Capture-Phase gesture listener so ANY touch on phone unlocks playback immediately
    const unlockOnGesture = () => {
      if (!isPlayingRef.current) return;
      getOrCreateAudioContext();

      const aud = audioRef.current;
      if (aud) {
        aud.muted = false;
        aud.volume = DEFAULT_VOLUME;
        const p = aud.play();
        if (p !== undefined) {
          p.then(() => {
            setIsAudioActive(true);
            setIsPlaying(true);
            setNeedsGesture(false);
            cleanupGestureListeners();
          }).catch(() => {
            // If HTML5 audio still fails on mobile, trigger Web Audio
            playWebAudioFallback().then((success) => {
              if (success) cleanupGestureListeners();
            });
          });
        }
      }
    };

    const cleanupGestureListeners = () => {
      window.removeEventListener('touchend', unlockOnGesture, true);
      window.removeEventListener('touchstart', unlockOnGesture, true);
      window.removeEventListener('pointerdown', unlockOnGesture, true);
      window.removeEventListener('mousedown', unlockOnGesture, true);
      window.removeEventListener('click', unlockOnGesture, true);
      window.removeEventListener('keydown', unlockOnGesture, true);
    };

    window.addEventListener('touchend', unlockOnGesture, { capture: true, passive: true });
    window.addEventListener('touchstart', unlockOnGesture, { capture: true, passive: true });
    window.addEventListener('pointerdown', unlockOnGesture, { capture: true, passive: true });
    window.addEventListener('mousedown', unlockOnGesture, { capture: true, passive: true });
    window.addEventListener('click', unlockOnGesture, { capture: true, passive: true });
    window.addEventListener('keydown', unlockOnGesture, { capture: true, passive: true });

    return () => {
      cleanupGestureListeners();
    };
  }, [getOrCreateAudioContext, playWebAudioFallback]);

  // Singing animation loop (alternates frame 1 and 2 ONLY when actually singing)
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
      stopWebAudio();
    };
  }, [stopWebAudio]);

  const isSinging = isPlaying && isAudioActive;

  return (
    <>
      {/* Hidden Native Audio Element */}
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
          setNeedsGesture(false);
        }}
        onError={() => {
          if (audioRef.current && !audioRef.current.src.endsWith('/audio/website-music.mp3')) {
            audioRef.current.src = '/audio/website-music.mp3';
            if (isPlayingRef.current) audioRef.current.play().catch(() => {});
          } else {
            console.warn('Audio element error, falling back to Web Audio');
            playWebAudioFallback();
          }
        }}
        onEnded={() => {
          if (audioRef.current && isPlaying) {
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
                  {hasError
                    ? 'Singing Cat: Resting'
                    : isSinging
                    ? 'Singing cheerfully! Tap to mute'
                    : needsGesture
                    ? 'Tap cat or screen to hear me sing! 🎵'
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

          {/* Floating Magical Musical Notes (strictly when music is actively playing) */}
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
            className="relative flex flex-col items-center justify-center p-0.5 sm:p-1.5 rounded-2xl cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-pastel-dark select-none touch-manipulation min-w-[50px] min-h-[50px] active:scale-95 transition-transform"
            aria-label={isSinging ? 'Stop music (cat singing)' : 'Start music (cat singing)'}
            title={isSinging ? 'Click or tap to stop music' : 'Click or tap to play music'}
          >
            {/* Cat Sprite on Pastel Cloud */}
            <div
              className={`relative w-[48px] h-[48px] sm:w-[84px] sm:h-[84px] drop-shadow-[2px_3px_0_rgba(61,61,61,0.22)] ${
                isSinging
                  ? 'animate-[catSingBounce_0.84s_ease-in-out_infinite]'
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
                  !isSinging ? 'opacity-100' : 'opacity-0 pointer-events-none'
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
                  isSinging && singFrame === 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'
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
                  isSinging && singFrame === 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              />
            </div>

            {/* Status Indicator Badge Under Cat */}
            <span
              className={`text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded-full border border-pastel-dark shadow-retro-sm -mt-0.5 transition-colors duration-150 flex items-center gap-1 ${
                isSinging
                  ? 'bg-pastel-mint text-pastel-dark'
                  : needsGesture
                  ? 'bg-pastel-peach text-pastel-dark animate-pulse'
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
              ) : needsGesture ? (
                <>
                  <Play size={8} className="text-amber-700 shrink-0 fill-amber-700" />
                  <span>Tap to Play</span>
                </>
              ) : hasError ? (
                <span>Resting</span>
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
