'use client';

import React from 'react';
import { Achievement } from '@/types';
import { Trophy, Award, Film, Star } from 'lucide-react';

interface AchievementsWindowProps {
  achievements: Achievement[];
}

const iconMap: Record<string, React.ReactNode> = {
  Trophy: <Trophy className="w-5 h-5 text-amber-500" />,
  Award: <Award className="w-5 h-5 text-indigo-500" />,
  Film: <Film className="w-5 h-5 text-rose-500" />,
};

export const AchievementsWindow: React.FC<AchievementsWindowProps> = ({ achievements }) => {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {achievements.map((item) => (
          <div
            key={item.id}
            className="retro-card flex items-start gap-3 bg-white p-3"
          >
            <div className="p-2 rounded-xl bg-pastel-warm border border-pastel-dark shrink-0">
              {iconMap[item.icon_name] || <Star className="w-5 h-5 text-amber-500" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <h4 className="font-extrabold text-sm text-pastel-dark truncate">
                  {item.title}
                </h4>
                {item.date_label && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pastel-lavender border border-pastel-dark text-pastel-dark shrink-0">
                    {item.date_label}
                  </span>
                )}
              </div>
              <p className="text-xs font-bold text-amber-800 mt-0.5">
                {item.event_or_source}
              </p>
              <p className="text-[11px] text-pastel-soft mt-1 leading-snug">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-pastel-mint/40 border border-pastel-dark rounded-retro-sm text-xs text-pastel-dark text-center">
        🏆 Dedicated to rigorous craft, continuous game jam participation, and community art contributions.
      </div>
    </div>
  );
};
