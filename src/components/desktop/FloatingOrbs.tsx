'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';

export const FloatingOrbs: React.FC = () => {
  const { isPanda } = useTheme();

  return (
    <>
      {/* Background Gradient */}
      <div 
        className={`fixed inset-0 pointer-events-none -z-20 transition-colors duration-500 ${
          isPanda 
            ? 'bg-gradient-to-br from-[#f3f9f4] via-[#e8f5ec] to-[#dcf0e2]'
            : 'bg-gradient-to-br from-[#fff5e6] via-[#ffe8d4] to-[#ffdec4]'
        }`}
        aria-hidden="true"
      />

      {/* Floating Animated Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
        {/* Orb 1 */}
        <div 
          className="absolute rounded-full opacity-65 animate-float-slow transition-all duration-500"
          style={{
            width: '260px',
            height: '260px',
            top: '6%',
            left: '-40px',
            background: isPanda 
              ? 'radial-gradient(circle at 30% 30%, rgba(126, 203, 154, 0.45), rgba(216, 243, 220, 0.15))'
              : 'radial-gradient(circle at 30% 30%, rgba(255, 182, 193, 0.45), rgba(192, 240, 221, 0.2))',
          }}
        />

        {/* Orb 2 */}
        <div 
          className="absolute rounded-full opacity-60 animate-float-medium transition-all duration-500"
          style={{
            width: '360px',
            height: '360px',
            bottom: '-90px',
            right: '-70px',
            background: isPanda 
              ? 'radial-gradient(circle at 35% 35%, rgba(250, 229, 204, 0.55), rgba(163, 216, 214, 0.25))'
              : 'radial-gradient(circle at 35% 35%, rgba(226, 209, 255, 0.5), rgba(255, 218, 185, 0.3))',
            animationDuration: '18s',
          }}
        />

        {/* Orb 3 */}
        <div 
          className="absolute rounded-full opacity-55 animate-float-fast transition-all duration-500"
          style={{
            width: '190px',
            height: '190px',
            top: '46%',
            left: '68%',
            background: isPanda 
              ? 'radial-gradient(circle at 30% 30%, rgba(255, 174, 192, 0.45), rgba(243, 249, 244, 0.2))'
              : 'radial-gradient(circle at 30% 30%, rgba(192, 240, 221, 0.45), rgba(255, 249, 231, 0.2))',
            animationDuration: '13s',
          }}
        />

        {/* Orb 4 */}
        <div 
          className="absolute rounded-full opacity-55 animate-float-medium transition-all duration-500"
          style={{
            width: '140px',
            height: '140px',
            bottom: '20%',
            left: '10%',
            background: isPanda 
              ? 'radial-gradient(circle at 30% 30%, rgba(116, 198, 157, 0.45), rgba(255, 174, 192, 0.2))'
              : 'radial-gradient(circle at 30% 30%, rgba(255, 218, 185, 0.5), rgba(255, 182, 193, 0.2))',
            animationDuration: '16s',
          }}
        />

        {/* Orb 5 */}
        <div 
          className="absolute rounded-full opacity-45 animate-float-slow transition-all duration-500"
          style={{
            width: '300px',
            height: '300px',
            top: '52%',
            left: '30%',
            background: isPanda 
              ? 'radial-gradient(circle at 40% 40%, rgba(163, 216, 214, 0.45), rgba(126, 203, 154, 0.2))'
              : 'radial-gradient(circle at 40% 40%, rgba(226, 209, 255, 0.4), rgba(160, 212, 255, 0.25))',
            animationDuration: '24s',
          }}
        />

        {/* Floating Bamboo Leaves, Chibi Pandas & Cute Elements (strictly in Panda theme) */}
        {isPanda && (
          <>
            {/* 1. Cute Chibi Baby Panda floating on cloud (top left-center) */}
            <div 
              className="absolute pointer-events-none opacity-80 animate-[chibiPandaFloat_6s_ease-in-out_infinite]"
              style={{ top: '9%', left: '22%' }}
            >
              <div className="relative">
                {/* Puffy zen cloud */}
                <div className="px-3 py-1 bg-white/95 rounded-full border-[1.5px] border-pastel-dark shadow-retro-sm flex items-center gap-1">
                  <span className="text-[10px]">🎋</span>
                  <span className="text-[9px] font-extrabold text-emerald-800 tracking-tight">bamboo zen</span>
                </div>
                {/* Baby panda peeking over cloud */}
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  {/* Ears */}
                  <div className="flex justify-between w-9 -mb-1.5 z-0">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#1e2424] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-300" />
                    </div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#1e2424] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-300" />
                    </div>
                  </div>
                  {/* Face */}
                  <div className="w-8 h-6.5 rounded-full bg-white border-[1.5px] border-[#1e2424] shadow-xs flex flex-col items-center justify-center relative z-10">
                    <div className="flex justify-between w-5 mt-0.5">
                      <div className="w-1.5 h-2 rounded-full bg-[#1e2424] flex items-center justify-center rotate-[-10deg]">
                        <div className="w-0.5 h-0.5 rounded-full bg-white" />
                      </div>
                      <div className="w-1.5 h-2 rounded-full bg-[#1e2424] flex items-center justify-center rotate-[10deg]">
                        <div className="w-0.5 h-0.5 rounded-full bg-white" />
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 -mt-0.5">
                      <div className="w-1.5 h-0.5 rounded-full bg-pink-400" />
                      <span className="text-[5px] text-[#1e2424] font-black">‿</span>
                      <div className="w-1.5 h-0.5 rounded-full bg-pink-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Cute Chibi Baby Panda napping on cloud (bottom right-center) */}
            <div 
              className="absolute pointer-events-none opacity-80 animate-[chibiPandaFloat_7s_ease-in-out_infinite_2s]"
              style={{ bottom: '14%', right: '20%' }}
            >
              <div className="relative">
                {/* Puffy zen cloud */}
                <div className="px-3 py-1 bg-white/95 rounded-full border-[1.5px] border-pastel-dark shadow-retro-sm flex items-center gap-1">
                  <span className="text-[10px]">💤</span>
                  <span className="text-[9px] font-extrabold text-pastel-dark tracking-tight">cozy grove</span>
                </div>
                {/* Baby sleeping panda */}
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <div className="flex justify-between w-9 -mb-1.5 z-0">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#1e2424] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-300" />
                    </div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#1e2424] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-300" />
                    </div>
                  </div>
                  <div className="w-8 h-6.5 rounded-full bg-white border-[1.5px] border-[#1e2424] shadow-xs flex flex-col items-center justify-center relative z-10">
                    <div className="flex justify-between w-5 mt-1 text-[7px] text-[#1e2424] font-black leading-none">
                      <span>˘</span>
                      <span>˘</span>
                    </div>
                    <div className="flex items-center gap-0.5 -mt-0.5">
                      <div className="w-1.5 h-0.5 rounded-full bg-pink-400" />
                      <span className="text-[5px] text-[#1e2424]">v</span>
                      <div className="w-1.5 h-0.5 rounded-full bg-pink-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Floating Bamboo Leaves & Shoots */}
            <div 
              className="absolute pointer-events-none opacity-45 animate-[bambooLeafFloat1_12s_ease-in-out_infinite]"
              style={{ top: '14%', right: '18%' }}
            >
              <svg width="42" height="42" viewBox="0 0 38 38" fill="none">
                <path d="M 6 32 C 14 16, 32 10, 36 6 C 30 18, 22 28, 6 32 Z" fill="#52b788" stroke="#1e2424" strokeWidth="1.5" />
                <path d="M 6 32 Q 22 20 34 8" stroke="#2d6a4f" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </div>

            <div 
              className="absolute pointer-events-none opacity-40 animate-[bambooLeafFloat2_15s_ease-in-out_infinite]"
              style={{ bottom: '28%', left: '24%' }}
            >
              <svg width="48" height="48" viewBox="0 0 44 44" fill="none">
                <path d="M 38 38 C 28 22, 12 14, 6 8 C 16 16, 28 26, 38 38 Z" fill="#74c69d" stroke="#1e2424" strokeWidth="1.5" />
                <path d="M 38 38 Q 20 22 8 10" stroke="#2d6a4f" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </div>

            <div 
              className="absolute pointer-events-none opacity-35 animate-[bambooLeafFloat1_18s_ease-in-out_infinite_2s]"
              style={{ top: '35%', left: '8%' }}
            >
              <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
                <path d="M 4 28 C 12 16, 26 10, 30 6 C 24 16, 18 24, 4 28 Z" fill="#40916c" stroke="#1e2424" strokeWidth="1.5" />
              </svg>
            </div>

            {/* Drifting Sakura Petals */}
            <div 
              className="absolute pointer-events-none opacity-50 animate-[bambooLeafFloat2_14s_ease-in-out_infinite_1s]"
              style={{ top: '50%', right: '10%' }}
            >
              <span className="text-sm select-none">🌸</span>
            </div>
            <div 
              className="absolute pointer-events-none opacity-45 animate-[bambooLeafFloat1_16s_ease-in-out_infinite_3s]"
              style={{ bottom: '40%', left: '14%' }}
            >
              <span className="text-sm select-none">🎋</span>
            </div>

            {/* Cute Translucent Panda Paw Prints */}
            <div 
              className="absolute pointer-events-none opacity-20"
              style={{ bottom: '15%', right: '7%' }}
            >
              <svg width="56" height="56" viewBox="0 0 56 56" fill="#1e2424">
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
              <svg width="48" height="48" viewBox="0 0 56 56" fill="#1e2424">
                <ellipse cx="28" cy="34" rx="14" ry="11" />
                <circle cx="16" cy="18" r="4.5" />
                <circle cx="24" cy="14" r="4.8" />
                <circle cx="32" cy="14" r="4.8" />
                <circle cx="40" cy="18" r="4.5" />
              </svg>
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
