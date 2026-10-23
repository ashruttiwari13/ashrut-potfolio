'use client';

import React from 'react';
import { Achievement } from '@/types';
import { Trophy, Award, Film, Star, Rocket, Sparkles, Atom, Medal } from 'lucide-react';

interface AchievementsWindowProps {
  achievements: Achievement[];
}

const iconMap: Record<string, React.ReactNode> = {
  Rocket: <Rocket className="w-6 h-6 text-orange-500 animate-pulse" />,
  Trophy: <Trophy className="w-6 h-6 text-amber-500" />,
  Atom: <Atom className="w-6 h-6 text-cyan-600 animate-[spin_8s_linear_infinite]" />,
  Medal: <Medal className="w-6 h-6 text-amber-600" />,
  Award: <Award className="w-6 h-6 text-indigo-500" />,
  Film: <Film className="w-6 h-6 text-rose-500" />,
};

export const AchievementsWindow: React.FC<AchievementsWindowProps> = ({ achievements }) => {
  return (
    <div className="space-y-3.5">
      {/* Header intro */}
      <div className="p-2.5 bg-pastel-mint/30 border border-pastel-dark rounded-retro-sm text-[11px] text-pastel-dark flex items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-1.5 font-bold">
          <Sparkles size={14} className="text-amber-500 shrink-0" />
          <span>Recognitions & Competitive Accomplishments</span>
        </div>
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-pastel-lavender border border-pastel-dark shrink-0">
          Verified Honors
        </span>
      </div>

      {/* Achievements Cards */}
      <div className="grid grid-cols-1 gap-3">
        {achievements.map((item) => (
          <div
            key={item.id}
            className="retro-card flex flex-col sm:flex-row items-start sm:items-center gap-3.5 bg-white p-3.5 sm:p-4 min-w-0 shadow-[3px_3px_0_#3d3d3d] border-2 border-pastel-dark rounded-2xl"
          >
            {/* Visual Icon Badge */}
            <div className="p-3 rounded-2xl bg-gradient-to-br from-pastel-peach to-pastel-warm border-2 border-pastel-dark shrink-0 shadow-sm flex items-center justify-center">
              {iconMap[item.icon_name] || <Star className="w-6 h-6 text-amber-500" />}
            </div>

            {/* Content Details */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h4 className="font-extrabold text-sm sm:text-base text-pastel-dark break-words">
                  {item.title}
                </h4>
                {item.date_label && (
                  <span className="text-[10px] sm:text-[11px] font-black px-2.5 py-0.5 rounded-full bg-pastel-peach border border-pastel-dark text-pastel-dark shrink-0 shadow-xs">
                    {item.date_label}
                  </span>
                )}
              </div>

              <p className="text-xs font-bold text-amber-800 break-words flex items-center gap-1">
                <span>📍</span>
                <span>{item.event_or_source}</span>
              </p>

              <p className="text-xs text-pastel-soft leading-relaxed break-words pt-0.5">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="p-3 bg-pastel-lavender/30 border border-pastel-dark rounded-retro-sm text-xs text-pastel-dark text-center font-medium">
        🏆 Commended for excellence in competitive sports, aerospace rocketry, and scientific innovation.
      </div>
    </div>
  );
};
