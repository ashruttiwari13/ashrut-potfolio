'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

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
  const { isPanda } = useTheme();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isStartingRef = useRef<boolean>(false);
  const lastToggleRef = useRef<number>(0);

  // Component state: Panda sings automatically on site open across phone & desktop!
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isAudioActive, setIsAudioActive] = useState<boolean>(true);
  const isPlayingRef = useRef<boolean>(true);
  isPlayingRef.current = isPlaying;

  const [singFrame, setSingFrame] = useState<1 | 2>(1);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isHappyHop, setIsHappyHop] = useState<boolean>(false);
  const [dialogueIdx, setDialogueIdx] = useState<number>(0);
  const [particles, setParticles] = useState<{ id: number; icon: string; x: number }[]>([]);

  const PANDA_DIALOGUES = [
    "Om nom nom... fresh bamboo is yummy! 🎋🐼",
    "Panda DJ spinning cozy lo-fi vibes! 🎧✨",
    "Big warm panda hugs for visiting! 💕",
    "Unreal Engine 5 games crafted with love & bamboo 🐾",
    "Resting peacefully in the bamboo grove... 🎋💤",
  ];

  const CAT_DIALOGUES = [
    "Purr... cozy retro lo-fi beats! 🐱🎵",
    "Meow! Welcome to Ashrut's Game Dev Portfolio! 🌸✨",
    "Warm sunny naps on a fluffy cloud... 💤",
    "Cat DJ spinning peaceful rhythms! 🎧💕",
    "Purring softly... tap me to sing or rest! 🐾",
  ];

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

  // Debounced tap handler for the singing mascot widget button
  const handleToggle = useCallback((e?: React.SyntheticEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const now = Date.now();
    if (now - lastToggleRef.current < 250) return;
    lastToggleRef.current = now;

    if (isPanda) {
      // Trigger cute happy hop for panda
      setIsHappyHop(true);
      setTimeout(() => setIsHappyHop(false), 550);

      // Cycle panda dialogues
      setDialogueIdx((prev) => (prev + 1) % PANDA_DIALOGUES.length);

      // Spawn cute heart & sparkle particles
      const icons = ['💖', '🎋', '✨', '🐾', '🌸'];
      const newParticles = [
        { id: now + 1, icon: icons[Math.floor(Math.random() * icons.length)], x: -16 + Math.random() * 8 },
        { id: now + 2, icon: icons[Math.floor(Math.random() * icons.length)], x: -4 + Math.random() * 8 },
        { id: now + 3, icon: icons[Math.floor(Math.random() * icons.length)], x: 8 + Math.random() * 8 },
      ];
      setParticles((prev) => [...prev, ...newParticles]);
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)));
      }, 1100);
    } else {
      // For Cat mode: keep classic interaction
      setDialogueIdx((prev) => (prev + 1) % CAT_DIALOGUES.length);
    }

    togglePlay();
  }, [togglePlay, isPanda, PANDA_DIALOGUES.length, CAT_DIALOGUES.length]);

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

      {/* Floating Singing Mascot Music Widget Container: Safe-Area Anchored in Top Right */}
      <div
        className="fixed z-[9990] pointer-events-auto select-none w-auto sm:w-[92px] flex flex-col items-center transition-all duration-200 right-2 sm:right-4"
        style={{ 
          top: 'max(0.25rem, env(safe-area-inset-top, 0.25rem))',
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
              className="absolute top-[calc(100%+6px)] right-0 whitespace-nowrap px-2.5 py-1 sm:px-3 sm:py-1.5 bg-[rgba(255,255,255,0.98)] backdrop-blur-md rounded-2xl border-2 border-pastel-dark shadow-retro text-[9px] sm:text-xs text-pastel-dark flex items-center gap-1.5 sm:gap-2 pointer-events-none z-50 transition-opacity duration-150 max-w-[240px] sm:max-w-[310px]"
            >
              <span className="text-sm shrink-0">
                {isPanda ? (isSinging ? '🎋' : '🐼') : (isSinging ? '🎶' : '🌸')}
              </span>
              <div className="flex flex-col">
                <span className="font-bold text-[9.5px] sm:text-[11px] leading-tight truncate">
                  {isPanda
                    ? (isSinging ? PANDA_DIALOGUES[dialogueIdx] : 'Panda is resting among bamboo. Tap to sing! 🎋')
                    : (isSinging ? CAT_DIALOGUES[dialogueIdx] : 'Cat is resting on a fluffy cloud. Tap to sing! 🎵')}
                </span>
                <span className="text-[7.5px] sm:text-[9px] text-pastel-soft leading-none mt-0.5">
                  {isPanda
                    ? (isSinging ? 'Tap panda to pause ⏹️' : 'Tap panda to play ▶️')
                    : (isSinging ? 'Tap cat to pause ⏹️' : 'Tap cat to play ▶️')}
                </span>
              </div>
              <div className="absolute -top-1.5 right-4 sm:right-7 w-2.5 h-2.5 bg-white border-l-2 border-t-2 border-pastel-dark rotate-45 pointer-events-none" />
            </div>
          )}

          {/* Floating Heart & Sparkle Particles on Tap */}
          {particles.map((p) => (
            <span
              key={p.id}
              className="absolute pointer-events-none text-base z-50 animate-[heartBurst_1s_ease-out_forwards]"
              style={{
                top: '-10px',
                left: `calc(50% + ${p.x}px)`,
              }}
            >
              {p.icon}
            </span>
          ))}

          {/* Floating Magical Musical Notes */}
          {isSinging && (
            <div className="absolute -top-2 sm:-top-3 left-0 right-0 h-5 sm:h-6 pointer-events-none overflow-visible">
              <span className={`absolute -left-1 font-bold text-[10px] sm:text-xs animate-[floatNote1_1.4s_ease-in-out_infinite] ${
                isPanda ? 'text-purple-400 drop-shadow-[0_0_6px_#c084fc]' : 'text-amber-500'
              }`}>
                ♪
              </span>
              <span className={`absolute left-1/2 -translate-x-1/2 font-bold text-xs sm:text-sm animate-[floatNote2_1.6s_ease-in-out_infinite_0.4s] ${
                isPanda ? 'text-fuchsia-400 drop-shadow-[0_0_6px_#e879f9]' : 'text-orange-400'
              }`}>
                ♫
              </span>
              <span className={`absolute -right-1 font-bold text-[10px] sm:text-xs animate-[floatNote3_1.5s_ease-in-out_infinite_0.8s] ${
                isPanda ? 'text-amber-300 drop-shadow-[0_0_6px_#fde047]' : 'text-pink-500'
              }`}>
                {isPanda ? '🏮' : '♩'}
              </span>
              {isPanda && (
                <span className="absolute right-3 -top-2 text-purple-300 font-bold text-[11px] animate-[floatNote1_1.7s_ease-in-out_infinite_0.6s]">
                  ✨
                </span>
              )}
            </div>
          )}

          {/* Interactive Character Button */}
          <button
            type="button"
            id="bgm-toggle-button"
            onClick={handleToggle}
            onTouchEnd={(e) => {
              e.preventDefault();
              handleToggle(e);
            }}
            className="relative flex flex-col items-center justify-center p-0.5 sm:p-1 rounded-2xl cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-pastel-dark select-none touch-manipulation min-w-[46px] min-h-[46px] sm:min-w-[54px] sm:min-h-[54px] active:scale-95 transition-transform"
            aria-label={
              isSinging
                ? (isPanda ? 'Mute background music (panda singing)' : 'Stop music (cat singing)')
                : (isPanda ? 'Play background music (panda singing)' : 'Start music (cat singing)')
            }
            title={
              isSinging
                ? (isPanda ? 'Click or tap to mute panda music' : 'Click or tap to stop cat music')
                : (isPanda ? 'Click or tap to play panda music' : 'Click or tap to play cat music')
            }
          >
            {/* Mascot Sprite on Cloud with Strict Key for Instant Theme Swapping */}
            <div
              key={isPanda ? 'mascot-panda' : 'mascot-cat'}
              className={`relative w-[54px] h-[54px] sm:w-[84px] sm:h-[84px] drop-shadow-[2px_3px_0_rgba(61,61,61,0.22)] flex items-center justify-center overflow-visible transition-transform ${
                isPanda
                  ? (isHappyHop
                      ? 'animate-[pandaHappyHop_0.55s_ease-in-out]'
                      : isSinging
                      ? 'animate-[pandaSingBounce_0.84s_ease-in-out_infinite]'
                      : 'animate-[pandaIdleFloat_3s_ease-in-out_infinite]')
                  : (isSinging
                      ? 'animate-[catSingBounce_0.84s_ease-in-out_infinite]'
                      : 'animate-[catIdleFloat_3s_ease-in-out_infinite]')
              }`}
            >
              {isPanda ? (
                <>
                  <img
                    key="panda-idle"
                    src="/assets/panda_idle.svg"
                    alt="Cute panda resting among bamboo"
                    width={84}
                    height={84}
                    loading="eager"
                    decoding="sync"
                    className={`w-full h-full object-contain select-none pointer-events-none ${
                      !isSinging ? 'block' : 'hidden'
                    }`}
                  />
                  <img
                    key="panda-sing-1"
                    src="/assets/panda_sing_1.svg"
                    alt="Cute panda singing cheerfully frame 1"
                    width={84}
                    height={84}
                    loading="eager"
                    decoding="sync"
                    className={`w-full h-full object-contain select-none pointer-events-none ${
                      isSinging && singFrame === 1 ? 'block' : 'hidden'
                    }`}
                  />
                  <img
                    key="panda-sing-2"
                    src="/assets/panda_sing_2.svg"
                    alt="Cute panda dancing and singing frame 2"
                    width={84}
                    height={84}
                    loading="eager"
                    decoding="sync"
                    className={`w-full h-full object-contain select-none pointer-events-none ${
                      isSinging && singFrame === 2 ? 'block' : 'hidden'
                    }`}
                  />
                </>
              ) : (
                <>
                  <img
                    key="cat-png-idle"
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
                  <img
                    key="cat-png-sing-1"
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
                  <img
                    key="cat-png-sing-2"
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
                </>
              )}
            </div>

            {/* Status Indicator Badge Under Mascot - Lo-Fi Vintage Capsule */}
            <div
              className={`flex flex-col items-center justify-center px-4 py-1 sm:px-5 sm:py-1 rounded-full border-2 -mt-0.5 transition-all duration-150 select-none ${
                isSinging
                  ? isPanda 
                    ? 'bg-[#0c0f22]/90 border-purple-500/50 text-white shadow-[0_0_15px_rgba(139,92,246,0.35)]' 
                    : 'bg-[#ffe8d4] border-pastel-dark text-pastel-dark shadow-[2px_2.5px_0_#3d3d3d]'
                  : isHovered
                  ? isPanda
                    ? 'bg-purple-950/80 border-purple-400 text-white shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                    : 'bg-pastel-peach border-pastel-dark text-pastel-dark shadow-[2px_2.5px_0_#3d3d3d]'
                  : isPanda
                  ? 'bg-[#10142c]/90 border-purple-500/30 text-purple-200'
                  : 'bg-white/95 border-pastel-dark text-pastel-dark shadow-[2px_2.5px_0_#3d3d3d]'
              }`}
            >
              <span className={`text-[9.5px] sm:text-[11px] font-extrabold tracking-tight leading-tight ${
                isPanda ? 'text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,0.4)]' : 'text-pastel-dark'
              }`}>
                Lo-Fi
              </span>
              <div className="flex items-center gap-1.5 leading-none mt-0.5">
                {isSinging ? (
                  <>
                    <Volume2 size={10} className={`shrink-0 ${isPanda ? 'text-purple-400' : 'text-emerald-800'}`} />
                    <span className={`text-[9.5px] sm:text-[11px] font-extrabold ${
                      isPanda ? 'text-white' : 'text-pastel-dark'
                    }`}>
                      {isPanda ? 'Panda 🎧' : 'Cat 🎵'}
                    </span>
                    <span className="flex items-end gap-0.5 h-2.5 shrink-0">
                      <span className={`w-0.5 h-1 rounded-full animate-pulse ${isPanda ? 'bg-purple-400' : 'bg-emerald-700'}`} />
                      <span className={`w-0.5 h-2.5 rounded-full animate-[pulse_0.5s_infinite] ${isPanda ? 'bg-cyan-400 shadow-[0_0_6px_#22d3ee]' : 'bg-emerald-800'}`} />
                      <span className={`w-0.5 h-1.5 rounded-full animate-pulse ${isPanda ? 'bg-fuchsia-400' : 'bg-emerald-700'}`} />
                    </span>
                  </>
                ) : (
                  <>
                    <VolumeX size={10} className="text-rose-500 shrink-0" />
                    <span className={`text-[9.5px] sm:text-[11px] font-extrabold ${
                      isPanda ? 'text-slate-300' : 'text-pastel-dark'
                    }`}>
                      {isPanda ? 'Panda 💤' : 'Cat 💤'}
                    </span>
                  </>
                )}
              </div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};
