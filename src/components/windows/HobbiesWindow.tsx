'use client';

import React from 'react';
import { initialHobbies } from '@/lib/mock-data';
import { Video, Feather, Headphones, Sparkles } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const iconMap: Record<string, React.ReactNode> = {
  Video: <Video className="w-5 h-5 text-rose-500" />,
  Feather: <Feather className="w-5 h-5 text-teal-500" />,
  Headphones: <Headphones className="w-5 h-5 text-purple-400" />,
};

export const HobbiesWindow: React.FC = () => {
  const { isPanda } = useTheme();

  return (
    <div className="space-y-4">
      {/* Distinction Header */}
      <div
        className={`p-3.5 sm:p-4 rounded-retro-sm text-xs sm:text-sm space-y-1.5 shadow-xs ${
          isPanda
            ? 'bg-[#121633]/90 border border-purple-500/30 text-purple-200'
            : 'bg-pastel-lavender/40 border border-pastel-dark text-pastel-dark'
        }`}
      >
        <div className="flex items-center gap-2 font-black text-sm sm:text-base">
          <span>🎬</span>
          <span>Creative Hobbies & Personal Pursuits</span>
        </div>
        <p className="text-xs sm:text-sm leading-relaxed opacity-90 font-medium">
          While my primary full-time job is <strong>Unreal Engine 5 Game Development & 3D Character/Asset Art</strong>, filmmaking and audio soundscapes are my beloved weekend hobbies that feed my visual eye for real-time game cinematics.
        </p>
      </div>

      {/* Hobby Cards */}
      <div className="space-y-3">
        {initialHobbies.map((hobby) => (
          <div
            key={hobby.id}
            className={`flex items-start gap-3.5 p-3.5 sm:p-4 min-w-0 rounded-2xl shadow-sm transition-all ${
              isPanda
                ? 'bg-[#0c0f24]/90 border border-purple-500/30 shadow-[0_0_15px_rgba(139,92,246,0.12)] hover:border-purple-400 text-slate-100'
                : 'retro-card bg-white'
            }`}
          >
            <div
              className={`p-3 rounded-2xl shrink-0 mt-0.5 shadow-sm ${
                isPanda
                  ? 'bg-[#141738] border border-purple-500/40'
                  : 'bg-pastel-warm border-2 border-pastel-dark'
              }`}
            >
              {iconMap[hobby.icon] || <Sparkles className="w-5 h-5 text-purple-400" />}
            </div>
            <div className="min-w-0 flex-1">
              <h3
                className={`font-black text-base sm:text-lg md:text-xl break-words tracking-tight ${
                  isPanda ? 'text-white' : 'text-pastel-dark'
                }`}
              >
                {hobby.title}
              </h3>
              <p
                className={`text-xs sm:text-sm mt-1.5 leading-relaxed break-words font-medium ${
                  isPanda ? 'text-slate-300' : 'text-pastel-soft'
                }`}
              >
                {hobby.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div
        className={`p-3.5 rounded-retro-sm text-xs sm:text-sm text-center font-bold break-words ${
          isPanda
            ? 'bg-[#0f122c]/80 border border-purple-500/30 text-purple-200'
            : 'bg-pastel-mint/30 border-2 border-pastel-dark text-pastel-dark'
        }`}
      >
        {isPanda
          ? '🎋 Panda Zen: Like a panda peacefully resting between bamboo shoots, balance, curiosity, and play fuel memorable game design and art.'
          : '✨ Creative philosophy: Strong storytelling, intentional audio, and cinematographic framing make games unforgettable.'}
      </div>
    </div>
  );
};
