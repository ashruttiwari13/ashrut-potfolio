'use client';

import React, { useState } from 'react';
import { ProfileSettings, WindowId } from '@/types';
import { 
  MapPin, 
  Sparkles, 
  Briefcase, 
  ExternalLink, 
  Gamepad2, 
  Mail, 
  FileText,
  Maximize2,
  X,
  Trophy,
  Star,
  Zap,
  Download,
  ArrowRight,
  Youtube,
  Github,
  Twitter,
  MessageSquare
} from 'lucide-react';
import { soundFX } from '@/lib/soundEffects';
import { useTheme } from '@/context/ThemeContext';

interface ProfileWindowProps {
  profile: ProfileSettings;
  onNavigate: (winId: WindowId) => void;
}

export const ProfileWindow: React.FC<ProfileWindowProps> = ({ profile, onNavigate }) => {
  const { isPanda } = useTheme();
  const [avatarMode, setAvatarMode] = useState<'gamer' | 'real' | '3d'>('gamer');
  const [showEnlargedPhoto, setShowEnlargedPhoto] = useState(false);

  // In Cat mode, default to real photo if gamer is selected
  const effectiveAvatarMode = !isPanda && avatarMode === 'gamer' ? 'real' : avatarMode;

  const getAvatarSrc = (mode: 'gamer' | 'real' | '3d') => {
    switch (mode) {
      case 'gamer':
        return '/assets/gamer_panda_avatar.png';
      case '3d':
        return '/assets/ashrut-avatar.jpg';
      case 'real':
      default:
        return '/assets/ashrut-photo-crop.jpg';
    }
  };

  const activeAvatarSrc = getAvatarSrc(effectiveAvatarMode);
  const enlargedAvatarSrc = effectiveAvatarMode === 'real' ? '/assets/ashrut-photo.jpg' : getAvatarSrc(effectiveAvatarMode);

  // =========================================================================
  // PANDA MODE: Moonlit Cyber-Bamboo Sanctuary (Reference Mockup)
  // =========================================================================
  if (isPanda) {
    return (
      <div className="space-y-3.5 text-slate-100">
        {/* Main Hero Showcase Card */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0c0f24]/90 border border-purple-500/40 shadow-[0_0_30px_rgba(139,92,246,0.18)] backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            {/* Avatar with Neon Halo Ring */}
            <div className="relative shrink-0 select-none">
              <div
                onClick={() => setShowEnlargedPhoto(true)}
                title="Click to enlarge"
                className="w-20 h-20 sm:w-22 sm:h-22 rounded-full p-1 bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-indigo-500 shadow-[0_0_22px_rgba(168,85,247,0.7)] cursor-pointer group active:scale-95 transition-transform"
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-[#0a0d1d] relative">
                  <img
                    src={activeAvatarSrc}
                    alt="Ashrut Tiwari - Gamer Panda & 3D Creator"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* Mode switch pill */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  soundFX.playClick(680);
                  setAvatarMode((prev) => (prev === 'gamer' ? '3d' : prev === '3d' ? 'real' : 'gamer'));
                }}
                className="absolute -bottom-1 -right-1 bg-[#1a1d3b] hover:bg-purple-600 text-[8.5px] font-extrabold text-purple-200 hover:text-white border border-purple-400/50 rounded-full px-2 py-0.5 shadow-md transition-all cursor-pointer flex items-center gap-1"
                title="Cycle: Panda ➔ 3D ➔ Real"
              >
                <Sparkles size={8} className="text-yellow-400 shrink-0" />
                <span>{effectiveAvatarMode === 'gamer' ? 'Panda' : effectiveAvatarMode === '3d' ? '3D' : 'Real'}</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  soundFX.playWindowOpen();
                  setShowEnlargedPhoto(true);
                }}
                className="absolute -top-1 -right-1 bg-[#1a1d3b] hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-400/50 rounded-full p-1 shadow-md transition-all cursor-pointer"
                title="View full portrait"
              >
                <Maximize2 size={9} strokeWidth={2.5} />
              </button>
            </div>

            {/* Hero Text */}
            <div className="flex-1 text-center sm:text-left min-w-0">
              <div className="text-purple-400 font-serif italic text-xs sm:text-sm tracking-wide">
                Hey There! 👋
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight mt-0.5">
                I'm <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-300 bg-clip-text text-transparent">Ashrut Tiwari</span>
              </h2>
              <div className="text-[11px] sm:text-xs font-semibold text-purple-200/90 mt-1">
                Game Developer • 3D Artist • Storyteller
              </div>
              <p className="text-[11px] sm:text-xs leading-relaxed text-slate-300 mt-2">
                I create games, worlds and stories... Turning imagination into reality with Unreal Engine, Blender and more.
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-2 text-[10px] text-purple-300/80">
                <MapPin size={11} className="text-purple-400 shrink-0" />
                <span>{profile.location}</span>
              </div>
            </div>
          </div>

          {/* Prominent Call to Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 pt-3 border-t border-purple-500/20">
            <button
              type="button"
              onClick={() => {
                soundFX.playClick(720);
                onNavigate('projectsWin');
              }}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.5)] active:scale-95 transition-all cursor-pointer border border-purple-400/40"
            >
              <Gamepad2 size={15} className="shrink-0" />
              <span>Explore My Projects</span>
              <ArrowRight size={13} className="shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => {
                soundFX.playClick(680);
                onNavigate('resumeWin');
              }}
              className="py-2.5 px-4 rounded-xl bg-[#141738]/90 hover:bg-[#1f2352] text-white border border-purple-500/40 font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <Download size={14} className="shrink-0 text-purple-300" />
              <span>Download CV</span>
            </button>
          </div>
        </div>

        {/* 4 Stat Badges Grid (Matching Reference Design) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Badge 1 */}
          <div className="p-2.5 rounded-xl bg-[#0f122c]/90 border border-purple-500/30 flex items-center gap-2.5 shadow-sm hover:border-purple-400/60 transition-all">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0">
              <Gamepad2 size={16} className="text-purple-400" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black text-white">10+</div>
              <div className="text-[9.5px] text-slate-400 font-medium truncate">Projects</div>
            </div>
          </div>

          {/* Badge 2 */}
          <div className="p-2.5 rounded-xl bg-[#0f122c]/90 border border-purple-500/30 flex items-center gap-2.5 shadow-sm hover:border-purple-400/60 transition-all">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
              <Trophy size={16} className="text-amber-400" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black text-white">SIH 2025</div>
              <div className="text-[9.5px] text-slate-400 font-medium truncate">Participant</div>
            </div>
          </div>

          {/* Badge 3 */}
          <div className="p-2.5 rounded-xl bg-[#0f122c]/90 border border-purple-500/30 flex items-center gap-2.5 shadow-sm hover:border-purple-400/60 transition-all">
            <div className="w-8 h-8 rounded-lg bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center shrink-0">
              <Star size={16} className="text-yellow-400" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black text-white">3D Artist</div>
              <div className="text-[9.5px] text-slate-400 font-medium truncate">& Designer</div>
            </div>
          </div>

          {/* Badge 4 */}
          <div className="p-2.5 rounded-xl bg-[#0f122c]/90 border border-purple-500/30 flex items-center gap-2.5 shadow-sm hover:border-purple-400/60 transition-all">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center shrink-0">
              <Zap size={16} className="text-indigo-400" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black text-white">Always</div>
              <div className="text-[9.5px] text-slate-400 font-medium truncate">Learning</div>
            </div>
          </div>
        </div>

        {/* Disciplines & Specialties */}
        <div className="p-3 rounded-xl bg-[#0c0f24]/80 border border-purple-500/30">
          <div className="text-[10.5px] font-bold text-purple-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles size={11} className="text-purple-400" />
            <span>Core Engines & Disciplines</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: 'Unreal Engine', icon: '🔥', highlight: true },
              { label: 'Godot', icon: '👾', highlight: true },
              { label: 'Blender', icon: '🎨', highlight: true },
              { label: 'C++ & Python', icon: '💻', highlight: true },
              { label: '3D Artist', icon: '🗿', highlight: true },
              { label: 'Cinematographer', icon: '🎬', highlight: false, note: 'Creative Hobby' },
            ].map((tool, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141738] border border-purple-500/30 text-[10.5px] font-bold text-slate-200 shadow-xs hover:border-purple-400/60 transition-all"
              >
                <span>{tool.icon}</span>
                <span>{tool.label}</span>
                {tool.note && (
                  <span className="text-[8.5px] text-purple-300/80 font-normal">({tool.note})</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Quote Pill (Matching Mockup) */}
        <div className="py-2 px-4 rounded-full bg-[#111430]/90 border border-purple-500/40 text-center shadow-[0_0_15px_rgba(168,85,247,0.15)]">
          <span className="text-xs font-serif italic text-purple-300 font-semibold tracking-wider">
            “Dream • Create • Explore” ✨
          </span>
        </div>

        {/* Social Icons Row */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-purple-500/20 text-xs">
          <span className="text-[11px] font-semibold text-purple-300/80">Connect with Ashrut:</span>
          <div className="flex items-center gap-2">
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="p-1.5 rounded-lg bg-[#141738] border border-purple-500/30 text-rose-400 hover:text-white hover:bg-rose-600 transition-all shadow-xs"
            >
              <Youtube size={14} />
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
              className="p-1.5 rounded-lg bg-[#141738] border border-purple-500/30 text-indigo-400 hover:text-white hover:bg-indigo-600 transition-all shadow-xs"
            >
              <MessageSquare size={14} />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="p-1.5 rounded-lg bg-[#141738] border border-purple-500/30 text-slate-300 hover:text-white hover:bg-purple-600 transition-all shadow-xs"
            >
              <Github size={14} />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="p-1.5 rounded-lg bg-[#141738] border border-purple-500/30 text-slate-300 hover:text-white hover:bg-purple-600 transition-all shadow-xs"
            >
              <Twitter size={14} />
            </a>
            <button
              type="button"
              onClick={() => onNavigate('contactWin')}
              className="px-2.5 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600 border border-purple-400/50 text-white text-[10.5px] font-extrabold transition-all cursor-pointer flex items-center gap-1 shadow-xs ml-1"
            >
              <Mail size={11} />
              <span>Hire Me</span>
            </button>
          </div>
        </div>

        {/* High-Resolution Portrait Modal */}
        {showEnlargedPhoto && (
          <div
            onClick={() => setShowEnlargedPhoto(false)}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-sm w-full bg-[#0c0f24] rounded-2xl border-2 border-purple-500/50 overflow-hidden shadow-[0_0_40px_rgba(168,85,247,0.4)] animate-in zoom-in-95"
            >
              <div className="bg-gradient-to-r from-[#17193c] via-[#241c48] to-[#17193c] px-3.5 py-2.5 border-b border-purple-500/40 flex items-center justify-between text-white">
                <span className="font-extrabold text-xs flex items-center gap-1.5">
                  <span>🐼</span>
                  <span>Ashrut Tiwari · Portrait Studio</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowEnlargedPhoto(false)}
                  className="w-6 h-6 rounded-full bg-white/10 hover:bg-rose-500 flex items-center justify-center transition-colors cursor-pointer text-white"
                >
                  <X size={13} strokeWidth={2.5} />
                </button>
              </div>

              <div className="p-4 space-y-3">
                <div className="aspect-square w-full rounded-xl border border-purple-500/40 overflow-hidden bg-[#060815] relative shadow-inner">
                  <img
                    src={enlargedAvatarSrc}
                    alt="Ashrut Tiwari - Gamer Panda & 3D Artist"
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <div className="flex items-center justify-between gap-2 p-2 bg-[#121633] rounded-xl border border-purple-500/30 text-xs font-bold text-slate-200">
                  <span>Portrait Version:</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setAvatarMode('gamer')}
                      className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                        avatarMode === 'gamer'
                          ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.6)]'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      🐼 Panda
                    </button>
                    <button
                      type="button"
                      onClick={() => setAvatarMode('3d')}
                      className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                        avatarMode === '3d'
                          ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.6)]'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      ✨ 3D Render
                    </button>
                    <button
                      type="button"
                      onClick={() => setAvatarMode('real')}
                      className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                        avatarMode === 'real'
                          ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.6)]'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      📷 Real
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // CAT MODE: Classic Pastel Cozy Retro OS (Preserved 100%)
  // =========================================================================
  return (
    <div className="space-y-3">
      {/* Header Profile Card */}
      <div className="flex items-center gap-3 p-2.5 sm:p-3 bg-white border-2 border-pastel-dark rounded-retro shadow-[2.5px_2.5px_0_#ffdab9]">
        {/* Profile Picture with Interactive 3D / Real Photo Toggle */}
        <div className="relative shrink-0 select-none">
          <div
            onClick={() => setShowEnlargedPhoto(true)}
            title="Click to view full photo"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-pastel-peach border-2 border-pastel-dark overflow-hidden flex items-center justify-center shadow-[2.5px_2.5px_0_#3d3d3d] cursor-pointer relative group active:scale-95 transition-all"
          >
            <img
              src={activeAvatarSrc}
              alt="Ashrut Tiwari - Unreal 5 Game Dev & 3D Artist"
              className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
            />
            {/* Tag indicator overlay */}
            <span className="absolute bottom-0 inset-x-0 bg-pastel-dark/85 text-white text-[7.5px] sm:text-[8px] font-extrabold text-center py-0.5 tracking-wide backdrop-blur-xs">
              {effectiveAvatarMode === 'real' ? '📷 Real Photo' : '✨ 3D Render'}
            </span>
          </div>

          {/* Quick Switch Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundFX.playClick(680);
              setAvatarMode((prev) => (prev === 'real' ? '3d' : 'real'));
            }}
            className="absolute -bottom-1 -right-1 bg-white hover:bg-pastel-mint border border-pastel-dark rounded-full px-1.5 py-0.2 text-[8px] font-extrabold text-pastel-dark shadow-xs transition-all cursor-pointer flex items-center gap-0.5"
            title="Toggle between Real Photo and 3D Render"
          >
            <Sparkles size={8} className="text-amber-500 shrink-0" />
            <span>{effectiveAvatarMode === 'real' ? '3D' : 'Real'}</span>
          </button>

          {/* Enlarge inspect button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundFX.playWindowOpen();
              setShowEnlargedPhoto(true);
            }}
            className="absolute -top-1.5 -right-1.5 bg-white hover:bg-pastel-peach border border-pastel-dark rounded-full p-1 shadow-xs transition-all cursor-pointer text-pastel-dark"
            title="View full portrait"
          >
            <Maximize2 size={9} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h2 className="text-base sm:text-xl font-extrabold text-pastel-dark break-words">
              {profile.full_name}
            </h2>
            <span className="text-base shrink-0">👾</span>
          </div>
          <p className="text-[11px] sm:text-xs font-bold text-pastel-dark leading-snug break-words mt-0.5">
            {profile.headline}
          </p>
          <div className="flex flex-wrap gap-1 mt-1.5">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-pastel-mint border border-pastel-dark text-[9px] font-extrabold text-pastel-dark shadow-xs">
              💼 Game Developer
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-pastel-lavender border border-pastel-dark text-[9px] font-bold text-pastel-dark shadow-xs">
              🎬 Filmmaking (Hobby)
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-pastel-pink border border-pastel-dark text-[9px] font-extrabold text-pastel-dark shadow-xs">
              🌸 Cozy Retro
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-[10px] sm:text-[11px] text-pastel-soft min-w-0">
            <MapPin size={11} className="shrink-0 text-pastel-dark" />
            <span className="break-words">{profile.location}</span>
          </div>
        </div>
      </div>

      {/* Biography */}
      <div className="text-xs sm:text-[12.5px] leading-relaxed text-pastel-dark space-y-1.5 bg-pastel-warm/60 p-2.5 sm:p-3 rounded-retro-sm border border-pastel-dark/20 break-words">
        <p>{profile.bio}</p>
        <p className="flex items-center gap-1.5 font-semibold text-emerald-800 text-[11px] break-words">
          <Briefcase size={13} className="shrink-0" />
          <span>{profile.freelance_status}</span>
        </p>
      </div>

      {/* Creative Hobby Demarcation Banner */}
      <div className="p-2 bg-pastel-lavender/40 border border-pastel-dark rounded-retro-sm text-[10.5px] text-pastel-dark flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <span className="text-sm shrink-0">🎬</span>
          <span className="break-words">
            <strong>Filmmaking:</strong> Creative personal hobby to enrich game camera directing.
          </span>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('hobbiesWin')}
          className="text-[9.5px] font-extrabold px-2 py-0.5 bg-white border border-pastel-dark rounded hover:bg-pastel-peach shrink-0 shadow-xs cursor-pointer ml-auto"
        >
          View Hobby ➔
        </button>
      </div>

      {/* Specialties Badges */}
      <div>
        <h3 className="text-[11px] font-bold text-pastel-soft uppercase tracking-wider mb-1.5 flex items-center gap-1">
          <Sparkles size={11} />
          <span>Disciplines & Focus</span>
        </h3>
        <div className="flex flex-wrap gap-1">
          {profile.specialties.map((spec, i) => {
            const isHobby = spec.toLowerCase().includes('hobby');
            return (
              <span
                key={i}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border border-pastel-dark shadow-xs flex items-center gap-1 ${
                  isHobby
                    ? 'bg-pastel-lavender text-pastel-dark'
                    : 'bg-pastel-mint/80 text-pastel-dark'
                }`}
              >
                <span>{isHobby ? '🎬' : '💼'}</span>
                <span>{spec}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Fast Action Buttons */}
      <div className="grid grid-cols-3 gap-1.5 pt-0.5 pb-0.5">
        <button
          type="button"
          onClick={() => {
            soundFX.playClick(640);
            onNavigate('contactWin');
          }}
          className="retro-btn retro-btn-primary py-1.5 px-1 text-[11px] min-w-0 justify-center"
        >
          <Mail size={12} strokeWidth={2.5} className="shrink-0" />
          <span className="truncate">Hire Me</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundFX.playClick(640);
            onNavigate('projectsWin');
          }}
          className="retro-btn retro-btn-mint py-1.5 px-1 text-[11px] min-w-0 justify-center"
        >
          <Gamepad2 size={12} strokeWidth={2.5} className="shrink-0" />
          <span className="truncate">Projects</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundFX.playClick(640);
            onNavigate('resumeWin');
          }}
          className="retro-btn retro-btn-lavender py-1.5 px-1 text-[11px] min-w-0 justify-center"
        >
          <FileText size={12} strokeWidth={2.5} className="shrink-0" />
          <span className="truncate">Resume</span>
        </button>
      </div>

      {/* Social Links */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 pb-3 border-t border-pastel-dark/15 text-xs">
        <span className="font-bold text-pastel-soft">Social Profiles:</span>
        <div className="flex flex-wrap items-center gap-1.5">
          {Object.entries(profile.social_links).map(([key, url]) => {
            if (!url) return null;
            return (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="retro-btn text-[11px] px-2 py-0.5 bg-white capitalize hover:bg-pastel-peach"
              >
                <span>{key}</span>
                <ExternalLink size={10} />
              </a>
            );
          })}
        </div>
      </div>

      {/* High-Resolution Portrait Modal Drawer */}
      {showEnlargedPhoto && (
        <div
          onClick={() => setShowEnlargedPhoto(false)}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="retro-window max-w-sm w-full bg-[#fffcf3] overflow-hidden shadow-2xl animate-in zoom-in-95"
          >
            {/* Modal Header */}
            <div className="bg-pastel-peach px-3 py-2 border-b-2 border-pastel-dark flex items-center justify-between">
              <span className="font-extrabold text-xs text-pastel-dark flex items-center gap-1.5">
                <span>👾</span>
                <span>Ashrut Tiwari · Profile Portrait</span>
              </span>
              <button
                type="button"
                onClick={() => setShowEnlargedPhoto(false)}
                className="w-5.5 h-5.5 rounded-full bg-white border border-pastel-dark flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors cursor-pointer text-pastel-dark"
              >
                <X size={12} strokeWidth={3} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-3.5 space-y-3">
              <div className="aspect-square w-full rounded-2xl border-2 border-pastel-dark overflow-hidden bg-pastel-warm relative shadow-md">
                <img
                  src={enlargedAvatarSrc}
                  alt="Ashrut Tiwari - Unreal 5 Game Dev & 3D Artist"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Mode switch pills */}
              <div className="flex items-center justify-between gap-2 p-1.5 bg-pastel-mint/30 rounded-xl border border-pastel-dark/30 text-xs font-bold text-pastel-dark">
                <span>Display Version:</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setAvatarMode('3d')}
                    className={`px-2.5 py-1 rounded-lg text-[10.5px] font-extrabold transition-all cursor-pointer ${
                      effectiveAvatarMode === '3d'
                        ? 'bg-pastel-pink border border-pastel-dark shadow-xs'
                        : 'bg-white border border-pastel-dark/30 hover:bg-white/80'
                    }`}
                  >
                    ✨ 3D Render
                  </button>
                  <button
                    type="button"
                    onClick={() => setAvatarMode('real')}
                    className={`px-2.5 py-1 rounded-lg text-[10.5px] font-extrabold transition-all cursor-pointer ${
                      effectiveAvatarMode === 'real'
                        ? 'bg-pastel-pink border border-pastel-dark shadow-xs'
                        : 'bg-white border border-pastel-dark/30 hover:bg-white/80'
                    }`}
                  >
                    📷 Real Photo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
