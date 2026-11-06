'use client';

import React, { useState } from 'react';
import { Skill, SkillCategory } from '@/types';
import { soundFX } from '@/lib/soundEffects';
import { useTheme } from '@/context/ThemeContext';
import { 
  Flame, 
  Box, 
  BoxSelect, 
  Sparkles, 
  Palette, 
  Code, 
  Terminal, 
  Video, 
  Zap, 
  Layers, 
  Wrench,
  CheckCircle2
} from 'lucide-react';

interface SkillsWindowProps {
  skills: Skill[];
}

const iconMap: Record<string, React.ReactNode> = {
  Flame: <Flame className="w-5 h-5 text-amber-500" />,
  Box: <Box className="w-5 h-5 text-cyan-400" />,
  BoxSelect: <BoxSelect className="w-5 h-5 text-orange-400" />,
  Sparkles: <Sparkles className="w-5 h-5 text-purple-400" />,
  Palette: <Palette className="w-5 h-5 text-pink-400" />,
  Code: <Code className="w-5 h-5 text-emerald-400" />,
  Terminal: <Terminal className="w-5 h-5 text-teal-400" />,
  Video: <Video className="w-5 h-5 text-rose-400" />,
  Zap: <Zap className="w-5 h-5 text-yellow-400" />,
  Layers: <Layers className="w-5 h-5 text-indigo-400" />,
  Wrench: <Wrench className="w-5 h-5 text-slate-400" />,
};

export const SkillsWindow: React.FC<SkillsWindowProps> = ({ skills }) => {
  const { isPanda } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories: { label: string; value: string }[] = [
    { label: 'All Tools', value: 'all' },
    { label: '🎮 Engines (Core Job)', value: 'engine' },
    { label: '🎨 3D & Sculpting (Core Job)', value: '3d' },
    { label: '💻 Code (Core Job)', value: 'programming' },
    { label: '🎬 Filmmaking (Creative Hobby)', value: 'cinematography' },
  ];

  const filteredSkills = selectedCategory === 'all'
    ? skills
    : skills.filter((s) => s.category === selectedCategory);

  return (
    <div className="space-y-3">
      {/* Scope banner */}
      <div
        className={`flex flex-wrap items-center justify-between gap-1.5 p-2 rounded-retro-sm text-[10.5px] shadow-xs ${
          isPanda
            ? 'bg-[#121633]/90 border border-purple-500/30 text-purple-200'
            : 'bg-pastel-mint/30 border border-pastel-dark text-pastel-dark'
        }`}
      >
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-[11px]">
            {isPanda ? '🐾 Panda Dev Career Focus:' : '💼 Career Focus:'}
          </span>
          <span>Unreal Engine 5 Game Developer & 3D Character/Asset Artist</span>
        </div>
        <span
          className={`text-[9.5px] font-bold px-2 py-0.2 rounded-full shrink-0 ${
            isPanda
              ? 'bg-purple-900/60 border border-purple-500/40 text-purple-200'
              : 'bg-pastel-lavender border border-pastel-dark text-pastel-dark'
          }`}
        >
          {isPanda ? '🎬 Filmmaking = Creative Hobby 🎋' : '🎬 Filmmaking = Personal Creative Hobby'}
        </span>
      </div>

      {/* Category Filter Pills / Tabs */}
      <div
        className={`flex overflow-x-auto no-scrollbar gap-1 pb-1 border-b touch-pan-x sm:flex-wrap ${
          isPanda ? 'border-purple-500/20' : 'border-pastel-dark/10'
        }`}
      >
        {categories.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => {
              soundFX.playClick(620);
              setSelectedCategory(cat.value);
            }}
            className={`retro-btn text-[10.5px] sm:text-xs px-2.5 py-1 whitespace-nowrap shrink-0 transition-all ${
              selectedCategory === cat.value
                ? isPanda
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400/50 shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                  : 'bg-pastel-pink shadow-[2px_2px_0_#3d3d3d] -translate-y-0.5'
                : isPanda
                  ? 'bg-[#121633] border border-purple-500/30 text-slate-300 hover:bg-[#1a1f46]'
                  : 'bg-white hover:bg-pastel-peach/50 text-pastel-dark'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {filteredSkills.map((skill) => {
          const icon = iconMap[skill.icon_name] || <Wrench className="w-4 h-4 text-slate-400" />;
          const isHobby = skill.category === 'cinematography';
          return (
            <div
              key={skill.id}
              className={`flex items-start gap-2.5 p-2 sm:p-2.5 min-w-0 rounded-xl transition-all ${
                isPanda
                  ? 'bg-[#0c0f24]/90 border border-purple-500/30 shadow-[0_0_15px_rgba(139,92,246,0.12)] hover:border-purple-400/70 text-slate-100'
                  : 'retro-card bg-white'
              }`}
            >
              <div
                className={`p-2 rounded-lg shrink-0 shadow-xs flex items-center justify-center ${
                  isPanda
                    ? 'bg-[#141738] border border-purple-500/30 shadow-[0_0_8px_rgba(139,92,246,0.2)]'
                    : 'bg-pastel-warm border border-pastel-dark/30'
                }`}
              >
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 flex-wrap">
                  <h4
                    className={`font-extrabold text-xs sm:text-[13px] break-words ${
                      isPanda ? 'text-white' : 'text-pastel-dark'
                    }`}
                  >
                    {skill.name}
                  </h4>
                  {isHobby ? (
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full shrink-0 ${
                        isPanda
                          ? 'bg-indigo-900/60 border border-indigo-400/40 text-indigo-200'
                          : 'bg-pastel-lavender border border-pastel-dark text-pastel-dark'
                      }`}
                    >
                      🎬 Hobby
                    </span>
                  ) : skill.is_highlight ? (
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full shrink-0 ${
                        isPanda
                          ? 'bg-purple-900/60 border border-purple-400/40 text-purple-200 shadow-xs'
                          : 'bg-pastel-mint border border-pastel-dark text-pastel-dark'
                      }`}
                    >
                      💼 Core
                    </span>
                  ) : null}
                </div>
                <p
                  className={`text-[10px] sm:text-[11px] font-semibold mt-0.5 break-words ${
                    isPanda ? 'text-slate-300' : 'text-pastel-soft'
                  }`}
                >
                  {skill.proficiency_level}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Production Pipeline Note */}
      <div
        className={`p-2 sm:p-2.5 rounded-retro-sm text-[10.5px] flex items-center gap-2 break-words ${
          isPanda
            ? 'bg-[#0f122c]/80 border border-purple-500/30 text-purple-200'
            : 'bg-pastel-lavender/40 border border-pastel-dark text-pastel-dark'
        }`}
      >
        <CheckCircle2
          size={14}
          className={`shrink-0 ${isPanda ? 'text-purple-400' : 'text-pastel-dark'}`}
        />
        <span className="break-words">
          End-to-end pipeline: Concept ➔ 3D Sculpt & Modeling ➔ Blender Retopology & Rigging ➔ Substance PBR Texturing ➔ Unreal/Godot Integration & Shaders.
        </span>
      </div>
    </div>
  );
};
