'use client';

import React from 'react';
import { Achievement } from '@/types';
import { Trophy, Award, Film, Star, Rocket, Sparkles, Atom, Medal } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface AchievementsWindowProps {
  achievements: Achievement[];
}

const iconMap: Record<string, React.ReactNode> = {
  Rocket: <Rocket className="w-6 h-6 text-orange-500 animate-pulse" />,
  Trophy: <Trophy className="w-6 h-6 text-amber-500" />,
  Atom: <Atom className="w-6 h-6 text-cyan-500 animate-[spin_8s_linear_infinite]" />,
  Medal: <Medal className="w-6 h-6 text-amber-500" />,
  Award: <Award className="w-6 h-6 text-indigo-400" />,
  Film: <Film className="w-6 h-6 text-rose-500" />,
};

export const AchievementsWindow: React.FC<AchievementsWindowProps> = ({ achievements }) => {
  const { isPanda } = useTheme();

  return (
    <div className="space-y-4">
      {/* Header intro */}
      <div
        className={`p-3 rounded-retro-sm text-xs sm:text-sm flex items-center justify-between gap-2 shadow-xs ${
          isPanda
            ? 'bg-[#121633]/90 border border-purple-500/30 text-purple-200'
            : 'bg-pastel-mint/30 border border-pastel-dark text-pastel-dark'
        }`}
      >
        <div className="flex items-center gap-2 font-black">
          <Sparkles size={16} className="text-amber-500 shrink-0" />
          <span>Recognitions & Competitive Accomplishments</span>
        </div>
        <span
          className={`text-xs font-black px-2.5 py-0.5 rounded-full shrink-0 ${
            isPanda
              ? 'bg-purple-900/60 border border-purple-500/40 text-purple-200'
              : 'bg-pastel-lavender border border-pastel-dark text-pastel-dark'
          }`}
        >
          Verified Honors
        </span>
      </div>

      {/* Achievements Cards */}
      <div className="grid grid-cols-1 gap-3.5">
        {achievements.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-5 min-w-0 rounded-2xl transition-all ${
              isPanda
                ? 'bg-[#0c0f24]/90 border border-purple-500/30 shadow-[0_0_20px_rgba(139,92,246,0.15)] hover:border-purple-400 text-slate-100'
                : 'retro-card bg-white shadow-[3px_3px_0_#3d3d3d] border-2 border-pastel-dark'
            }`}
          >
            {/* Visual Icon Badge */}
            <div
              className={`p-3.5 rounded-2xl shrink-0 shadow-sm flex items-center justify-center ${
                isPanda
                  ? 'bg-[#141738] border border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                  : 'bg-gradient-to-br from-pastel-peach to-pastel-warm border-2 border-pastel-dark'
              }`}
            >
              {iconMap[item.icon_name] || <Star className="w-6 h-6 text-amber-500" />}
            </div>

            {/* Content Details */}
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h3
                  className={`font-black text-base sm:text-lg md:text-xl break-words tracking-tight ${
                    isPanda ? 'text-white' : 'text-pastel-dark'
                  }`}
                >
                  {item.title}
                </h3>
                {item.date_label && (
                  <span
                    className={`text-xs sm:text-sm font-black px-3 py-1 rounded-full shrink-0 shadow-xs ${
                      isPanda
                        ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]'
                        : 'bg-pastel-peach border border-pastel-dark text-pastel-dark'
                    }`}
                  >
                    {item.date_label}
                  </span>
                )}
              </div>

              <p
                className={`text-xs sm:text-sm font-black break-words flex items-center gap-1.5 ${
                  isPanda ? 'text-purple-300' : 'text-amber-800'
                }`}
              >
                <span>📍</span>
                <span>{item.event_or_source}</span>
              </p>

              <p
                className={`text-xs sm:text-sm leading-relaxed break-words font-medium ${
                  isPanda ? 'text-slate-300' : 'text-pastel-soft'
                }`}
              >
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div
        className={`p-3.5 rounded-retro-sm text-xs sm:text-sm text-center font-bold ${
          isPanda
            ? 'bg-[#0f122c]/80 border border-purple-500/30 text-purple-200'
            : 'bg-pastel-lavender/30 border border-pastel-dark text-pastel-dark'
        }`}
      >
        🏆 Commended for excellence in competitive sports, aerospace rocketry, and scientific innovation.
      </div>
    </div>
  );
};
