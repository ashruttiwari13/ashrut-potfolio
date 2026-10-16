'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Square, Volume2, VolumeX, Trophy, Sparkles, Shield, RotateCcw } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
}

interface Star {
  x: number;
  y: number;
  type: 'normal' | 'gold' | 'shield';
}

interface BadBlock {
  x: number;
  y: number;
}

export const PixelRunnerGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [difficultyLevel, setDifficultyLevel] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [speedMode, setSpeedMode] = useState<'slow' | 'medium' | 'fast'>('medium');
  const [gameMessage, setGameMessage] = useState<string>('Press START to begin your run!');
  const [hasShield, setHasShield] = useState(false);

  // Game internal mutable state held in refs to avoid closure stalls in animation frame
  const gameStateRef = useRef({
    isRunning: false,
    animFrame: null as number | null,
    score: 0,
    highScore: 0,
    shieldActive: false,
    streak: 0,
    multiplier: 1,
    baseFallSpeed: 6.0,
    basePlayerSpeed: 8.5,
    currentFallSpeed: 6.0,
    currentPlayerSpeed: 8.5,
    currentDifficulty: 1,
    startTime: 0,
    frameCounter: 0,
    spawnRate: 35,
    player: {
      x: 340,
      y: 360,
      width: 20,
      height: 20,
      velX: 0,
      velY: 0,
      jumpPower: -8.8,
      gravity: 0.46,
      grounded: false,
    },
    stars: [] as Star[],
    badBlocks: [] as BadBlock[],
    particles: [] as Particle[],
    keys: { left: false, right: false },
    audioCtx: null as AudioContext | null,
    shake: 0,
  });

  const modeSpeeds = {
    slow: { fall: 3.5, player: 6.5 },
    medium: { fall: 6.0, player: 8.5 },
    fast: { fall: 8.5, player: 11.0 },
  };

  // Load high score from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pixelHigh');
      if (saved) {
        const val = parseInt(saved, 10);
        if (!isNaN(val)) {
          setHighScore(val);
          gameStateRef.current.highScore = val;
        }
      }
    } catch {
      // Ignore localStorage issues in private mode
    }
  }, []);

  const playSound = useCallback((type: 'jump' | 'collect' | 'gold' | 'shield' | 'gameover') => {
    if (isMuted) return;
    try {
      const state = gameStateRef.current;
      if (!state.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        state.audioCtx = new AudioContextClass();
      }
      if (state.audioCtx.state === 'suspended') {
        state.audioCtx.resume();
      }
      const ctx = state.audioCtx;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      let freq = 440;
      if (type === 'jump') freq = 520;
      else if (type === 'collect') freq = 680;
      else if (type === 'gold') freq = 920;
      else if (type === 'shield') freq = 380;
      else if (type === 'gameover') freq = 160;

      osc.frequency.setValueAtTime(freq, now);
      if (type === 'jump') {
        osc.frequency.exponentialRampToValueAtTime(780, now + 0.1);
      } else if (type === 'gameover') {
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);
      }

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Audio might not be permitted before user gesture
    }
  }, [isMuted]);

  const addParticles = (x: number, y: number, color: string, count = 5) => {
    const pList = gameStateRef.current.particles;
    for (let i = 0; i < count; i++) {
      pList.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4 - 1.5,
        size: Math.random() * 3 + 2,
        color,
        life: 1,
      });
    }
  };

  const drawScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = gameStateRef.current;
    const GROUND_Y = canvas.height - state.player.height - 8;

    ctx.save();
    if (state.shake > 0) {
      ctx.translate((Math.random() - 0.5) * state.shake, (Math.random() - 0.5) * state.shake);
    }

    // Sky Background
    ctx.fillStyle = '#a0d4ff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Retro Sun
    ctx.fillStyle = '#ffecb3';
    ctx.beginPath();
    ctx.arc(canvas.width - 60, 50, 28, 0, Math.PI * 2);
    ctx.fill();

    // Ground
    ctx.fillStyle = '#8b6946';
    ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);
    ctx.fillStyle = '#543a20';
    ctx.fillRect(0, GROUND_Y, canvas.width, 4);

    // Falling Stars
    state.stars.forEach((s) => {
      ctx.fillStyle = s.type === 'gold' ? '#ffaa33' : s.type === 'shield' ? '#7eff7e' : '#ffd966';
      ctx.fillRect(s.x, s.y, 10, 10);
      ctx.fillStyle = '#3d3d3d';
      ctx.strokeRect(s.x, s.y, 10, 10);
    });

    // Falling Bad Blocks
    state.badBlocks.forEach((b) => {
      ctx.fillStyle = '#ff6b6b';
      ctx.fillRect(b.x, b.y, 12, 12);
      ctx.fillStyle = '#3d3d3d';
      ctx.strokeRect(b.x, b.y, 12, 12);
      // X mark
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(b.x + 3, b.y + 3, 6, 6);
    });

    // Particles
    state.particles.forEach((p) => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    ctx.globalAlpha = 1.0;

    // Player Box
    const p = state.player;
    ctx.fillStyle = state.shieldActive ? '#6d8eff' : '#ff7b72';
    ctx.fillRect(p.x, p.y, p.width, p.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#3d3d3d';
    ctx.strokeRect(p.x, p.y, p.width, p.height);

    // Player Eyes (Retro Stylized)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(p.x + 3, p.y + 4, 5, 5);
    ctx.fillRect(p.x + p.width - 8, p.y + 4, 5, 5);
    ctx.fillStyle = '#3d3d3d';
    ctx.fillRect(p.x + 5, p.y + 6, 2, 2);
    ctx.fillRect(p.x + p.width - 6, p.y + 6, 2, 2);

    // Shield Aura
    if (state.shieldActive) {
      ctx.strokeStyle = '#aaffaa';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(p.x + p.width / 2, p.y + p.height / 2, 16, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Top HUD
    ctx.fillStyle = '#3d3d3d';
    ctx.font = 'bold 13px Quicksand, sans-serif';
    ctx.fillText(`⚡ Streak: ${state.streak} (x${state.multiplier})`, 12, 22);
    if (state.shieldActive) {
      ctx.fillStyle = '#107020';
      ctx.fillText('🛡️ SHIELD READY', canvas.width - 130, 22);
    }

    ctx.restore();
  }, []);

  const updateGame = useCallback(() => {
    const state = gameStateRef.current;
    if (!state.isRunning) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const GROUND_Y = canvas.height - state.player.height - 8;

    // Difficulty scaling over time
    const elapsed = (Date.now() - state.startTime) / 1000;
    const newLvl = Math.min(10, Math.floor(elapsed / 90) + 1);
    if (newLvl !== state.currentDifficulty) {
      state.currentDifficulty = newLvl;
      setDifficultyLevel(newLvl);
      state.currentFallSpeed = Math.min(state.baseFallSpeed + (newLvl - 1) * 0.8, 13);
      state.spawnRate = Math.max(35 - (newLvl - 1) * 2, 18);
    }

    // Player movement
    if (state.keys.left) {
      state.player.velX = -state.currentPlayerSpeed;
    } else if (state.keys.right) {
      state.player.velX = state.currentPlayerSpeed;
    } else {
      state.player.velX = 0;
    }

    state.player.x += state.player.velX;
    state.player.x = Math.max(0, Math.min(canvas.width - state.player.width, state.player.x));

    // Gravity & Grounding
    state.player.velY += state.player.gravity;
    state.player.y += state.player.velY;

    if (state.player.y >= GROUND_Y) {
      state.player.y = GROUND_Y;
      state.player.velY = 0;
      state.player.grounded = true;
    } else {
      state.player.grounded = false;
    }

    // Stars Collision & update
    for (let i = state.stars.length - 1; i >= 0; i--) {
      const s = state.stars[i];
      s.y += state.currentFallSpeed;

      if (
        s.x < state.player.x + state.player.width &&
        s.x + 10 > state.player.x &&
        s.y < state.player.y + state.player.height &&
        s.y + 10 > state.player.y
      ) {
        if (s.type === 'normal') {
          state.score += 1 * state.multiplier;
          playSound('collect');
          addParticles(s.x + 5, s.y + 5, '#ffd966', 6);
        } else if (s.type === 'gold') {
          state.score += 3 * state.multiplier;
          playSound('gold');
          addParticles(s.x + 5, s.y + 5, '#ffaa33', 10);
        } else if (s.type === 'shield') {
          state.shieldActive = true;
          setHasShield(true);
          playSound('shield');
          addParticles(s.x + 5, s.y + 5, '#7eff7e', 8);
        }

        state.stars.splice(i, 1);
        state.streak += 1;
        state.multiplier = Math.min(4, 1 + Math.floor(state.streak / 5));
        setScore(Math.floor(state.score));

        if (state.score > state.highScore) {
          state.highScore = Math.floor(state.score);
          setHighScore(state.highScore);
          try {
            localStorage.setItem('pixelHigh', String(state.highScore));
          } catch {
            // ignore
          }
        }
      } else if (s.y > canvas.height) {
        state.stars.splice(i, 1);
        state.streak = 0;
        state.multiplier = 1;
      }
    }

    // Bad blocks collision & update
    for (let i = state.badBlocks.length - 1; i >= 0; i--) {
      const b = state.badBlocks[i];
      b.y += state.currentFallSpeed;

      if (
        b.x < state.player.x + state.player.width &&
        b.x + 12 > state.player.x &&
        b.y < state.player.y + state.player.height &&
        b.y + 12 > state.player.y
      ) {
        if (state.shieldActive) {
          state.shieldActive = false;
          setHasShield(false);
          playSound('shield');
          addParticles(b.x + 6, b.y + 6, '#cfefff', 12);
          state.badBlocks.splice(i, 1);
        } else {
          // Game Over!
          state.isRunning = false;
          setIsRunning(false);
          playSound('gameover');
          setGameMessage(`💀 GAME OVER! Final Score: ${Math.floor(state.score)}. Press START to run again!`);
          if (state.animFrame) {
            cancelAnimationFrame(state.animFrame);
            state.animFrame = null;
          }
          drawScene();
          return;
        }
      } else if (b.y > canvas.height) {
        state.badBlocks.splice(i, 1);
      }
    }

    // Spawn items
    state.frameCounter++;
    if (state.frameCounter % Math.floor(state.spawnRate) === 0) {
      const x = Math.random() * (canvas.width - 25) + 10;
      const r = Math.random();
      if (r < 0.55) state.stars.push({ x, y: 0, type: 'normal' });
      else if (r < 0.72) state.stars.push({ x, y: 0, type: 'gold' });
      else if (r < 0.84) state.stars.push({ x, y: 0, type: 'shield' });
      else state.badBlocks.push({ x, y: 0 });
    }

    // Update particles
    for (let i = state.particles.length - 1; i >= 0; i--) {
      const p = state.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.12;
      p.life -= 0.025;
      if (p.life <= 0 || p.y > canvas.height) {
        state.particles.splice(i, 1);
      }
    }

    if (state.shake > 0) state.shake *= 0.88;
  }, [drawScene, playSound]);

  const loop = useCallback(() => {
    const state = gameStateRef.current;
    if (!state.isRunning) return;
    updateGame();
    drawScene();
    state.animFrame = requestAnimationFrame(loop);
  }, [updateGame, drawScene]);

  const startGame = useCallback(() => {
    const state = gameStateRef.current;
    // Clean cancel any prior loop
    if (state.animFrame) {
      cancelAnimationFrame(state.animFrame);
      state.animFrame = null;
    }

    const speeds = modeSpeeds[speedMode];
    state.baseFallSpeed = speeds.fall;
    state.basePlayerSpeed = speeds.player;
    state.currentFallSpeed = speeds.fall;
    state.currentPlayerSpeed = speeds.player;

    const canvas = canvasRef.current;
    const GROUND_Y = canvas ? canvas.height - 28 : 360;

    state.player.x = 340;
    state.player.y = GROUND_Y;
    state.player.velX = 0;
    state.player.velY = 0;
    state.player.grounded = true;
    state.stars = [];
    state.badBlocks = [];
    state.particles = [];
    state.score = 0;
    state.streak = 0;
    state.multiplier = 1;
    state.shieldActive = false;
    state.frameCounter = 0;
    state.currentDifficulty = 1;
    state.startTime = Date.now();
    state.isRunning = true;

    setScore(0);
    setDifficultyLevel(1);
    setHasShield(false);
    setIsRunning(true);
    setGameMessage('✨ Running! Catch stars & avoid red hazards!');

    state.animFrame = requestAnimationFrame(loop);
  }, [speedMode, loop]);

  const stopGame = useCallback(() => {
    const state = gameStateRef.current;
    state.isRunning = false;
    if (state.animFrame) {
      cancelAnimationFrame(state.animFrame);
      state.animFrame = null;
    }
    state.keys.left = false;
    state.keys.right = false;
    setIsRunning(false);
    setGameMessage('Game paused. Press START to resume or restart.');
    drawScene();
  }, [drawScene]);

  const handleJump = useCallback(() => {
    const state = gameStateRef.current;
    if (state.isRunning && state.player.grounded) {
      state.player.velY = state.player.jumpPower;
      playSound('jump');
    }
  }, [playSound]);

  // Keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const state = gameStateRef.current;
      if (!state.isRunning) return;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        state.keys.left = true;
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        state.keys.right = true;
      } else if (e.key === ' ' || e.key === 'Space') {
        e.preventDefault();
        handleJump();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const state = gameStateRef.current;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        state.keys.left = false;
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        state.keys.right = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      const state = gameStateRef.current;
      if (state.animFrame) {
        cancelAnimationFrame(state.animFrame);
      }
    };
  }, [handleJump]);

  // Initial draw on mount
  useEffect(() => {
    drawScene();
  }, [drawScene]);

  return (
    <div className="space-y-3">
      {/* HUD Info Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-white border-2 border-pastel-dark rounded-retro-sm text-xs font-bold">
        <div className="flex items-center gap-1.5">
          <Trophy size={14} className="text-amber-500" />
          <span>SCORE: <strong className="text-amber-800 text-sm">{score}</strong></span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pastel-warm border border-pastel-dark">
          <Sparkles size={12} className="text-pastel-dark" />
          <span>LVL {difficultyLevel}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span>BEST: <strong className="text-emerald-700">{highScore}</strong></span>
        </div>

        {hasShield && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-600 text-emerald-800 text-[11px] animate-pulse">
            <Shield size={11} />
            <span>Shield Active</span>
          </div>
        )}
      </div>

      {/* Canvas */}
      <div className="relative border-4 border-pastel-dark rounded-2xl overflow-hidden shadow-retro bg-[#a0d4ff]">
        <canvas
          ref={canvasRef}
          width={700}
          height={400}
          className="w-full h-auto block"
          style={{ aspectRatio: '700 / 400' }}
        />
      </div>

      {/* Status Bar */}
      <div className="p-2 bg-pastel-warm border border-pastel-dark rounded-xl text-center text-xs font-bold text-pastel-dark min-h-[32px] flex items-center justify-center">
        {gameMessage}
      </div>

      {/* Control Actions & Speed Selectors */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {!isRunning ? (
            <button
              type="button"
              onClick={startGame}
              className="retro-btn retro-btn-primary px-3 py-1.5 text-xs"
            >
              <Play size={13} fill="currentColor" />
              <span>START RUN</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={stopGame}
              className="retro-btn px-3 py-1.5 text-xs bg-white hover:bg-pastel-peach"
            >
              <Square size={13} fill="currentColor" />
              <span>PAUSE</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="retro-btn px-2.5 py-1.5 text-xs bg-white hover:bg-pastel-lavender"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        </div>

        {/* Speed Mode Selectors */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-pastel-dark text-[11px]">
          {(['slow', 'medium', 'fast'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => {
                setSpeedMode(mode);
                const s = modeSpeeds[mode];
                gameStateRef.current.baseFallSpeed = s.fall;
                gameStateRef.current.basePlayerSpeed = s.player;
                if (!gameStateRef.current.isRunning) {
                  gameStateRef.current.currentPlayerSpeed = s.player;
                }
              }}
              className={`px-2.5 py-0.5 rounded-full font-bold capitalize transition-colors ${
                speedMode === mode
                  ? 'bg-pastel-mint border border-pastel-dark text-pastel-dark'
                  : 'text-pastel-soft hover:text-pastel-dark'
              }`}
            >
              {mode === 'slow' ? '🐢 Slow' : mode === 'medium' ? '⚡ Med' : '🔥 Fast'}
            </button>
          ))}
        </div>
      </div>

      {/* Touch / Mobile Controls */}
      <div className="grid grid-cols-3 gap-2 pt-1 sm:hidden">
        <button
          type="button"
          onMouseDown={() => { gameStateRef.current.keys.left = true; }}
          onMouseUp={() => { gameStateRef.current.keys.left = false; }}
          onTouchStart={() => { gameStateRef.current.keys.left = true; }}
          onTouchEnd={() => { gameStateRef.current.keys.left = false; }}
          className="retro-btn py-2 text-xs bg-white active:bg-pastel-peach"
        >
          ◀ LEFT
        </button>

        <button
          type="button"
          onClick={handleJump}
          className="retro-btn retro-btn-primary py-2 text-xs font-extrabold"
        >
          ⭐ JUMP
        </button>

        <button
          type="button"
          onMouseDown={() => { gameStateRef.current.keys.right = true; }}
          onMouseUp={() => { gameStateRef.current.keys.right = false; }}
          onTouchStart={() => { gameStateRef.current.keys.right = true; }}
          onTouchEnd={() => { gameStateRef.current.keys.right = false; }}
          className="retro-btn py-2 text-xs bg-white active:bg-pastel-peach"
        >
          RIGHT ▶
        </button>
      </div>

      {/* Legend */}
      <div className="text-[11px] text-center text-pastel-soft">
        Controls: <strong>← → / A D</strong> move, <strong>SPACE / ⭐ JUMP</strong> jump | ⭐ +1 | ✨ Gold +3 | 🛡️ Shield (absorbs 1 hit)
      </div>
    </div>
  );
};
