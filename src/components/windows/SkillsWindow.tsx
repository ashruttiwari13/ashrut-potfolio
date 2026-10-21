'use client';

import React, { useState } from 'react';
import { Skill, SkillCategory } from '@/types';
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
  Flame: <Flame className="w-5 h-5 text-amber-600" />,
  Box: <Box className="w-5 h-5 text-blue-600" />,
  BoxSelect: <BoxSelect className="w-5 h-5 text-orange-600" />,
  Sparkles: <Sparkles className="w-5 h-5 text-purple-600" />,
  Palette: <Palette className="w-5 h-5 text-pink-600" />,
  Code: <Code className="w-5 h-5 text-emerald-600" />,
  Terminal: <Terminal className="w-5 h-5 text-teal-600" />,
  Video: <Video className="w-5 h-5 text-rose-600" />,
  Zap: <Zap className="w-5 h-5 text-yellow-600" />,
  Layers: <Layers className="w-5 h-5 text-indigo-600" />,
  Wrench: <Wrench className="w-5 h-5 text-gray-600" />,
};

export const SkillsWindow: React.FC<SkillsWindowProps> = ({ skills }) => {
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
      <div className="flex flex-wrap items-center justify-between gap-1.5 p-1.5 sm:p-2 bg-pastel-mint/30 border border-pastel-dark rounded-retro-sm text-[10.5px] text-pastel-dark shadow-xs">
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-[11px]">💼 Career Focus:</span>
          <span>Unreal Engine 5 Game Developer & 3D Character/Asset Artist</span>
        </div>
        <span className="text-[9.5px] font-bold px-2 py-0.2 rounded-full bg-pastel-lavender border border-pastel-dark shrink-0">
          🎬 Filmmaking = Personal Creative Hobby
        </span>
      </div>

      {/* Category Filter Pills / Tabs */}
      <div className="flex flex-wrap gap-1 pb-1 border-b border-pastel-dark/10">
        {categories.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => setSelectedCategory(cat.value)}
            className={`retro-btn text-[10.5px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1 ${
              selectedCategory === cat.value
                ? 'bg-pastel-pink shadow-[2px_2px_0_#3d3d3d] -translate-y-0.5'
                : 'bg-white hover:bg-pastel-peach/50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {filteredSkills.map((skill) => {
          const icon = iconMap[skill.icon_name] || <Wrench className="w-4 h-4 text-gray-600" />;
          const isHobby = skill.category === 'cinematography';
          return (
            <div
              key={skill.id}
              className="retro-card flex items-start gap-2.5 p-2 sm:p-2.5 bg-white min-w-0"
            >
              <div className="p-1.5 rounded-lg bg-pastel-warm border border-pastel-dark/30 shrink-0 shadow-xs">
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 flex-wrap">
                  <h4 className="font-extrabold text-xs sm:text-[13px] text-pastel-dark break-words">
                    {skill.name}
                  </h4>
                  {isHobby ? (
                    <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-pastel-lavender border border-pastel-dark text-pastel-dark shrink-0">
                      🎬 Hobby
                    </span>
                  ) : skill.is_highlight ? (
                    <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-pastel-mint border border-pastel-dark text-pastel-dark shrink-0">
                      💼 Core
                    </span>
                  ) : null}
                </div>
                <p className="text-[10px] sm:text-[11px] font-semibold text-pastel-soft mt-0.5 break-words">
                  {skill.proficiency_level}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Production Pipeline Note */}
      <div className="p-2 sm:p-2.5 bg-pastel-lavender/40 border border-pastel-dark rounded-retro-sm text-[10.5px] text-pastel-dark flex items-center gap-2 break-words">
        <CheckCircle2 size={14} className="text-pastel-dark shrink-0" />
        <span className="break-words">
          End-to-end pipeline: Concept ➔ 3D Sculpt & Modeling ➔ Blender Retopology & Rigging ➔ Substance PBR Texturing ➔ Unreal/Godot Integration & Shaders.
        </span>
      </div>
    </div>
  );
};
