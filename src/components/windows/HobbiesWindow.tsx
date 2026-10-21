'use client';

import React from 'react';
import { initialHobbies } from '@/lib/mock-data';
import { Video, Feather, Headphones, Sparkles } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Video: <Video className="w-5 h-5 text-rose-500" />,
  Feather: <Feather className="w-5 h-5 text-teal-600" />,
  Headphones: <Headphones className="w-5 h-5 text-purple-600" />,
};

export const HobbiesWindow: React.FC = () => {
  return (
    <div className="space-y-3">
      {/* Distinction Header */}
      <div className="p-3 bg-pastel-lavender/40 border border-pastel-dark rounded-retro-sm text-xs text-pastel-dark space-y-1 shadow-xs">
        <div className="flex items-center gap-1.5 font-extrabold text-[12px]">
          <span>🎬</span>
          <span>Creative Hobbies & Personal Pursuits</span>
        </div>
        <p className="text-[11px] leading-relaxed text-pastel-dark/90">
          While my primary full-time job is <strong>Unreal Engine 5 Game Development & 3D Character/Asset Art</strong>, filmmaking and audio soundscapes are my beloved weekend hobbies that feed my visual eye for real-time game cinematics.
        </p>
      </div>

      {/* Hobby Cards: Generous horizontal layout so NO text or letters can ever spill out */}
      <div className="space-y-2.5">
        {initialHobbies.map((hobby) => (
          <div
            key={hobby.id}
            className="retro-card flex items-start gap-3 p-3 bg-white min-w-0 shadow-sm"
          >
            <div className="p-2.5 rounded-2xl bg-pastel-warm border-2 border-pastel-dark shadow-sm shrink-0 mt-0.5">
              {iconMap[hobby.icon] || <Sparkles className="w-5 h-5 text-pastel-dark" />}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-extrabold text-sm text-pastel-dark break-words">
                {hobby.title}
              </h4>
              <p className="text-xs text-pastel-soft mt-1 leading-relaxed break-words">
                {hobby.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-pastel-peach/40 border-2 border-pastel-dark rounded-retro-sm text-xs text-center text-pastel-dark font-medium break-words">
        ✨ Creative philosophy: Strong storytelling, intentional audio, and cinematographic framing make games unforgettable.
      </div>
    </div>
  );
};
