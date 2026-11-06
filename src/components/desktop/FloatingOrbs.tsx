'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';

export const FloatingOrbs: React.FC = () => {
  const { isPanda } = useTheme();

  return (
    <>
      {/* Background Layer: Moonlit Sanctuary in Panda Mode vs Warm Peach Gradient in Cat Mode */}
      {isPanda ? (
        <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden select-none bg-[#080a14]">
          {/* High-res Moonlit Pagoda & Gamer Panda Backdrop */}
          <img
            src="/assets/panda_theme_bg.jpg"
            alt="Moonlit Cyber-Bamboo Sanctuary"
            className="w-full h-full object-cover object-center opacity-85 sm:opacity-90 scale-100 transition-all duration-700 select-none pointer-events-none"
          />
          {/* Subtle cinematic vignette for maximum text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080a14] via-[#080a14]/30 to-[#080a14]/60 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080a14]/70 via-transparent to-[#080a14]/50 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_25%,rgba(168,85,247,0.22),transparent_45%)] pointer-events-none" />
        </div>
      ) : (
        <div 
          className="fixed inset-0 pointer-events-none -z-20 transition-colors duration-500 bg-gradient-to-br from-[#fff5e6] via-[#ffe8d4] to-[#ffdec4]"
          aria-hidden="true"
        />
      )}

      {/* Floating Animated Orbs & Night Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
        {/* Ambient Purple / Cyan Glow Orbs for Panda Mode */}
        {isPanda ? (
          <>
            <div 
              className="absolute rounded-full opacity-35 animate-float-slow transition-all duration-500 pointer-events-none"
              style={{
                width: '320px',
                height: '320px',
                top: '10%',
                left: '60%',
                background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4), rgba(139, 92, 246, 0.05))',
                filter: 'blur(30px)',
              }}
            />
            <div 
              className="absolute rounded-full opacity-25 animate-float-medium transition-all duration-500 pointer-events-none"
              style={{
                width: '380px',
                height: '380px',
                bottom: '5%',
                left: '15%',
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.35), rgba(56, 189, 248, 0.05))',
                filter: 'blur(40px)',
              }}
            />
          </>
        ) : (
          <>
            {/* Cat Mode Orbs */}
            <div 
              className="absolute rounded-full opacity-65 animate-float-slow transition-all duration-500"
              style={{
                width: '260px',
                height: '260px',
                top: '6%',
                left: '-40px',
                background: 'radial-gradient(circle at 30% 30%, rgba(255, 182, 193, 0.45), rgba(192, 240, 221, 0.2))',
              }}
            />
            <div 
              className="absolute rounded-full opacity-60 animate-float-medium transition-all duration-500"
              style={{
                width: '360px',
                height: '360px',
                bottom: '-90px',
                right: '-70px',
                background: 'radial-gradient(circle at 35% 35%, rgba(226, 209, 255, 0.5), rgba(255, 218, 185, 0.3))',
                animationDuration: '18s',
              }}
            />
          </>
        )}

        {/* Moonlit Sanctuary Elements (Panda Theme) */}
        {isPanda && (
          <>
            {/* 1. Floating Warm Sky Lanterns drifting up */}
            <div 
              className="absolute pointer-events-none opacity-85 animate-[bambooLeafFloat1_16s_ease-in-out_infinite]"
              style={{ top: '15%', left: '46%' }}
            >
              <span className="text-xl sm:text-2xl select-none drop-shadow-[0_0_15px_rgba(251,191,36,0.9)]">🏮</span>
            </div>
            <div 
              className="absolute pointer-events-none opacity-75 animate-[bambooLeafFloat2_18s_ease-in-out_infinite_2s]"
              style={{ top: '24%', right: '28%' }}
            >
              <span className="text-base sm:text-lg select-none drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]">🏮</span>
            </div>
            <div 
              className="absolute pointer-events-none opacity-60 animate-[bambooLeafFloat1_22s_ease-in-out_infinite_4s]"
              style={{ top: '8%', right: '40%' }}
            >
              <span className="text-sm select-none drop-shadow-[0_0_10px_rgba(251,191,36,0.7)]">🏮</span>
            </div>

            {/* 2. Floating Fireflies & Magic Sparkles */}
            <div 
              className="absolute pointer-events-none opacity-90 animate-[bambooLeafFloat2_12s_ease-in-out_infinite]"
              style={{ top: '38%', left: '26%' }}
            >
              <div className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_12px_#c084fc] animate-ping" />
            </div>
            <div 
              className="absolute pointer-events-none opacity-85 animate-[bambooLeafFloat1_14s_ease-in-out_infinite_1s]"
              style={{ top: '62%', right: '35%' }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 shadow-[0_0_10px_#e879f9] animate-pulse" />
            </div>
            <div 
              className="absolute pointer-events-none opacity-80 animate-[bambooLeafFloat2_15s_ease-in-out_infinite_3s]"
              style={{ top: '48%', left: '60%' }}
            >
              <div className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_12px_#818cf8] animate-pulse" />
            </div>

            {/* 3. Cute Sleeping Baby Panda curled up with Zzz (Bottom-Left from user's image) */}
            <div 
              className="absolute bottom-16 sm:bottom-14 left-3 sm:left-8 pointer-events-none z-10 flex flex-col items-center animate-[chibiPandaFloat_6s_ease-in-out_infinite]"
            >
              <div className="relative">
                {/* Floating Animated Zzz */}
                <div className="absolute -top-6 sm:-top-7 right-2 sm:right-3 flex flex-col items-center pointer-events-none">
                  <span className="text-[9px] sm:text-[10px] font-black text-purple-300 animate-[floatNote1_2s_infinite]">z</span>
                  <span className="text-[11px] sm:text-[12px] font-black text-purple-400 animate-[floatNote2_2.2s_infinite_0.4s] -mt-1">Z</span>
                  <span className="text-[13px] sm:text-[14px] font-black text-fuchsia-300 animate-[floatNote3_2.4s_infinite_0.8s] -mt-1">Z</span>
                </div>
                <img
                  src="/assets/sleeping_panda_chibi.png"
                  alt="Cute sleeping baby panda"
                  width={156}
                  height={120}
                  className="w-20 sm:w-36 drop-shadow-[0_10px_25px_rgba(139,92,246,0.45)] select-none pointer-events-none"
                />
              </div>
            </div>
          </>
        )}

        {/* Floating Sakura Petals, Chibi Cats & Cozy Elements (strictly in Cat theme) */}
        {!isPanda && (
          <>
            {/* 1. Cute Chibi Cat floating on cloud (top left-center) */}
            <div 
              className="absolute pointer-events-none opacity-80 animate-[chibiPandaFloat_6s_ease-in-out_infinite]"
              style={{ top: '9%', left: '22%' }}
            >
              <div className="relative">
                {/* Puffy zen cloud */}
                <div className="px-3 py-1 bg-white/95 rounded-full border-[1.5px] border-pastel-dark shadow-retro-sm flex items-center gap-1">
                  <span className="text-[10px]">🌸</span>
                  <span className="text-[9px] font-extrabold text-pastel-dark tracking-tight">cat nap</span>
                </div>
                {/* Baby cat peeking over cloud */}
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  {/* Pointy ears */}
                  <div className="flex justify-between w-9 -mb-1.5 z-0">
                    <div 
                      className="w-3.5 h-3.5 bg-[#3d3d3d] flex items-center justify-center"
                      style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
                    >
                      <div 
                        className="w-1.5 h-1.5 bg-pink-300 mt-0.5"
                        style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
                      />
                    </div>
                    <div 
                      className="w-3.5 h-3.5 bg-[#3d3d3d] flex items-center justify-center"
                      style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
                    >
                      <div 
                        className="w-1.5 h-1.5 bg-pink-300 mt-0.5"
                        style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
                      />
                    </div>
                  </div>
                  {/* Face */}
                  <div className="w-8 h-6.5 rounded-full bg-[#fedbb4] border-[1.5px] border-[#3d3d3d] shadow-xs flex flex-col items-center justify-center relative z-10">
                    <div className="flex justify-between w-5 mt-0.5 text-[6px] text-[#3d3d3d] font-black leading-none">
                      <span>^</span>
                      <span>^</span>
                    </div>
                    <div className="flex items-center gap-0.5 -mt-0.5">
                      <div className="w-1.5 h-0.5 rounded-full bg-pink-400" />
                      <span className="text-[4px] text-[#3d3d3d] font-bold">w</span>
                      <div className="w-1.5 h-0.5 rounded-full bg-pink-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Cute Chibi Sleeping Cat napping on cloud (bottom right-center) */}
            <div 
              className="absolute pointer-events-none opacity-80 animate-[chibiPandaFloat_7s_ease-in-out_infinite_2s]"
              style={{ bottom: '14%', right: '20%' }}
            >
              <div className="relative">
                {/* Puffy zen cloud */}
                <div className="px-3 py-1 bg-white/95 rounded-full border-[1.5px] border-pastel-dark shadow-retro-sm flex items-center gap-1">
                  <span className="text-[10px]">💤</span>
                  <span className="text-[9px] font-extrabold text-pastel-dark tracking-tight">purr vibes</span>
                </div>
                {/* Baby sleeping cat */}
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <div className="flex justify-between w-9 -mb-1.5 z-0">
                    <div 
                      className="w-3.5 h-3.5 bg-[#3d3d3d] flex items-center justify-center"
                      style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
                    >
                      <div 
                        className="w-1.5 h-1.5 bg-pink-300 mt-0.5"
                        style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
                      />
                    </div>
                    <div 
                      className="w-3.5 h-3.5 bg-[#3d3d3d] flex items-center justify-center"
                      style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
                    >
                      <div 
                        className="w-1.5 h-1.5 bg-pink-300 mt-0.5"
                        style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
                      />
                    </div>
                  </div>
                  <div className="w-8 h-6.5 rounded-full bg-[#fedbb4] border-[1.5px] border-[#3d3d3d] shadow-xs flex flex-col items-center justify-center relative z-10">
                    <div className="flex justify-between w-5 mt-1 text-[7px] text-[#3d3d3d] font-black leading-none">
                      <span>˘</span>
                      <span>˘</span>
                    </div>
                    <div className="flex items-center gap-0.5 -mt-0.5">
                      <div className="w-1.5 h-0.5 rounded-full bg-pink-400" />
                      <span className="text-[4px] text-[#3d3d3d]">v</span>
                      <div className="w-1.5 h-0.5 rounded-full bg-pink-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Floating Yarn Balls & Sakura Petals */}
            <div 
              className="absolute pointer-events-none opacity-45 animate-[bambooLeafFloat1_14s_ease-in-out_infinite]"
              style={{ top: '15%', right: '18%' }}
            >
              <span className="text-xl select-none">🧶</span>
            </div>

            <div 
              className="absolute pointer-events-none opacity-50 animate-[bambooLeafFloat2_16s_ease-in-out_infinite]"
              style={{ bottom: '26%', left: '22%' }}
            >
              <span className="text-lg select-none">🌸</span>
            </div>

            <div 
              className="absolute pointer-events-none opacity-40 animate-[bambooLeafFloat1_18s_ease-in-out_infinite_2s]"
              style={{ top: '38%', left: '8%' }}
            >
              <span className="text-base select-none">✨</span>
            </div>

            <div 
              className="absolute pointer-events-none opacity-50 animate-[bambooLeafFloat2_12s_ease-in-out_infinite_1s]"
              style={{ top: '52%', right: '10%' }}
            >
              <span className="text-base select-none">🌸</span>
            </div>

            <div 
              className="absolute pointer-events-none opacity-40 animate-[bambooLeafFloat1_15s_ease-in-out_infinite_3s]"
              style={{ bottom: '38%', left: '15%' }}
            >
              <span className="text-sm select-none">🐾</span>
            </div>

            {/* Cute Translucent Cat Paw Prints */}
            <div 
              className="absolute pointer-events-none opacity-20"
              style={{ bottom: '15%', right: '7%' }}
            >
              <svg width="56" height="56" viewBox="0 0 56 56" fill="#3d3d3d">
                <ellipse cx="28" cy="34" rx="14" ry="11" />
                <circle cx="16" cy="18" r="4.5" />
                <circle cx="24" cy="14" r="4.8" />
                <circle cx="32" cy="14" r="4.8" />
                <circle cx="40" cy="18" r="4.5" />
              </svg>
            </div>

            <div 
              className="absolute pointer-events-none opacity-15"
              style={{ top: '8%', left: '16%' }}
            >
              <svg width="48" height="48" viewBox="0 0 56 56" fill="#3d3d3d">
                <ellipse cx="28" cy="34" rx="14" ry="11" />
                <circle cx="16" cy="18" r="4.5" />
                <circle cx="24" cy="14" r="4.8" />
                <circle cx="32" cy="14" r="4.8" />
                <circle cx="40" cy="18" r="4.5" />
              </svg>
            </div>
          </>
        )}
      </div>

      {/* Subtle Retro Pixel Grid */}
      <div 
        className="fixed inset-0 pointer-events-none -z-10 pixel-pattern opacity-15"
        aria-hidden="true"
      />
    </>
  );
};
