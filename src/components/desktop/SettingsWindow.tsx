'use client';

import React from 'react';
import { 
  Sparkles, 
  Sun, 
  Moon, 
  Sunset, 
  RotateCcw, 
  Check, 
  Sliders, 
  Zap, 
  Layers 
} from 'lucide-react';
import { UISettings, ThemeMode, DensityMode, SpacingMode } from '@/types';
import { DEFAULT_UI_SETTINGS } from '@/lib/settings';

interface SettingsWindowProps {
  settings: UISettings;
  onUpdateSettings: (newSettings: Partial<UISettings>) => void;
  onResetLayout: () => void;
}

export const SettingsWindow: React.FC<SettingsWindowProps> = ({
  settings,
  onUpdateSettings,
  onResetLayout,
}) => {
  const themes: { id: ThemeMode; label: string; icon: React.ReactNode; previewBg: string; previewBorder: string }[] = [
    {
      id: 'pastel',
      label: 'Pastel Light',
      icon: <Sun size={14} className="text-amber-500" />,
      previewBg: 'bg-[#fef9e7]',
      previewBorder: 'border-[#ffb6c1]',
    },
    {
      id: 'dark',
      label: 'Cyber Dark',
      icon: <Moon size={14} className="text-purple-400" />,
      previewBg: 'bg-[#16151f]',
      previewBorder: 'border-[#b185ff]',
    },
    {
      id: 'sunset',
      label: 'Sunset Glow',
      icon: <Sunset size={14} className="text-orange-500" />,
      previewBg: 'bg-[#fff3e8]',
      previewBorder: 'border-[#ff9aa2]',
    },
  ];

  const densities: { id: DensityMode; label: string; desc: string }[] = [
    { id: 'small', label: 'Small', desc: 'Compact typography & fits more items' },
    { id: 'medium', label: 'Medium', desc: 'Default balanced presentation' },
    { id: 'large', label: 'Large', desc: 'Enlarged text & generous readability' },
  ];

  const spacings: { id: SpacingMode; label: string; desc: string }[] = [
    { id: 'compact', label: 'Compact', desc: 'Slim margins & tight cards' },
    { id: 'comfortable', label: 'Comfortable', desc: 'Spacious padding & room to breathe' },
  ];

  return (
    <div className="space-y-4 text-xs select-none">
      {/* Intro Header */}
      <div className="p-3 bg-gradient-to-r from-pastel-pink/20 via-white to-pastel-mint/20 border-2 border-pastel-dark rounded-retro-sm">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-pastel-mint border border-pastel-dark text-pastel-dark">
            <Sliders size={16} />
          </span>
          <div>
            <h4 className="font-extrabold text-sm text-pastel-dark">Appearance &amp; Layout Settings</h4>
            <p className="text-[11px] text-pastel-soft">Customize interface theme, density, spacing, and animations.</p>
          </div>
        </div>
      </div>

      {/* 1. Theme Color Palette */}
      <div className="p-3 bg-white border-2 border-pastel-dark rounded-retro-sm space-y-2">
        <label className="font-extrabold text-xs text-pastel-dark flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Sun size={13} />
            <span>1. Visual Theme</span>
          </span>
          <span className="text-[10px] font-bold text-pastel-soft uppercase">Palette</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {themes.map((t) => {
            const isSelected = settings.theme === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onUpdateSettings({ theme: t.id })}
                className={`p-2.5 rounded-xl border-2 text-left transition-all flex flex-col gap-1.5 ${
                  isSelected
                    ? 'border-pastel-dark shadow-[3px_3px_0_#3d3d3d] bg-pastel-mint/30'
                    : 'border-pastel-dark/30 hover:border-pastel-dark bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-pastel-dark">
                    {t.icon}
                    <span>{t.label}</span>
                  </div>
                  {isSelected && <Check size={14} className="text-emerald-700 stroke-[3]" />}
                </div>

                <div className="flex items-center gap-1 pt-1">
                  <span className={`w-4 h-4 rounded-full border border-pastel-dark ${t.previewBg}`} />
                  <span className={`w-4 h-4 rounded-full border border-pastel-dark ${t.previewBorder}`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Interface Density */}
      <div className="p-3 bg-white border-2 border-pastel-dark rounded-retro-sm space-y-2">
        <label className="font-extrabold text-xs text-pastel-dark flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Layers size={13} />
            <span>2. Interface Density</span>
          </span>
          <span className="text-[10px] font-bold text-pastel-soft uppercase">Font &amp; Scale</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {densities.map((d) => {
            const isSelected = settings.density === d.id;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => onUpdateSettings({ density: d.id })}
                className={`p-2 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? 'border-pastel-dark shadow-[2px_2px_0_#3d3d3d] bg-pastel-peach/40 font-bold'
                    : 'border-pastel-dark/30 hover:border-pastel-dark bg-white'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-pastel-dark">
                  <span>{d.label}</span>
                  {isSelected && <Check size={12} className="text-emerald-700" />}
                </div>
                <p className="text-[10px] text-pastel-soft mt-0.5 leading-tight">{d.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Spacing */}
      <div className="p-3 bg-white border-2 border-pastel-dark rounded-retro-sm space-y-2">
        <label className="font-extrabold text-xs text-pastel-dark flex items-center justify-between">
          <span>3. Layout Spacing</span>
          <span className="text-[10px] font-bold text-pastel-soft uppercase">Margins</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {spacings.map((s) => {
            const isSelected = settings.spacing === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onUpdateSettings({ spacing: s.id })}
                className={`p-2 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? 'border-pastel-dark shadow-[2px_2px_0_#3d3d3d] bg-pastel-lavender/40 font-bold'
                    : 'border-pastel-dark/30 hover:border-pastel-dark bg-white'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-pastel-dark">
                  <span>{s.label}</span>
                  {isSelected && <Check size={12} className="text-emerald-700" />}
                </div>
                <p className="text-[10px] text-pastel-soft mt-0.5 leading-tight">{s.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Reduced Motion & Performance */}
      <div className="p-3 bg-white border-2 border-pastel-dark rounded-retro-sm flex items-center justify-between gap-3">
        <div className="space-y-0.5">
          <label htmlFor="reduced-motion-toggle" className="font-extrabold text-xs text-pastel-dark flex items-center gap-1.5 cursor-pointer">
            <Zap size={14} className="text-amber-500" />
            <span>Reduced Motion / Minimal Animation</span>
          </label>
          <p className="text-[10px] text-pastel-soft">
            Disables ambient floating orbs &amp; background transitions for high performance or motion sensitivity.
          </p>
        </div>

        <button
          id="reduced-motion-toggle"
          type="button"
          role="switch"
          aria-checked={settings.reducedMotion}
          onClick={() => onUpdateSettings({ reducedMotion: !settings.reducedMotion })}
          className={`w-12 h-6 rounded-full border-2 border-pastel-dark p-0.5 transition-colors relative shrink-0 ${
            settings.reducedMotion ? 'bg-pastel-pink' : 'bg-gray-200'
          }`}
        >
          <span
            className={`block w-4 h-4 rounded-full bg-white border border-pastel-dark transition-transform ${
              settings.reducedMotion ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* 5. Reset to Factory Defaults */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-pastel-dark/20">
        <button
          type="button"
          onClick={() => {
            onUpdateSettings(DEFAULT_UI_SETTINGS);
            onResetLayout();
          }}
          className="retro-btn text-xs px-3 py-1.5 bg-white hover:bg-pastel-peach w-full sm:w-auto"
          title="Restore default theme, spacing, and positions"
        >
          <RotateCcw size={12} strokeWidth={2.5} />
          <span>Restore Default Layout &amp; Theme</span>
        </button>

        <span className="text-[10px] text-pastel-soft font-semibold">
          Preferences saved automatically.
        </span>
      </div>
    </div>
  );
};
