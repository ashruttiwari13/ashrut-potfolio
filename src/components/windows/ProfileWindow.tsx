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
  // PANDA MODE: Moonlit Cyber-Bamboo Sanctuary (Bold & Scalable)
  // =========================================================================
  if (isPanda) {
    return (
      <div className="space-y-4 text-slate-100">
        {/* Main Hero Showcase Card */}
        <div className="p-4 sm:p-5 md:p-6 rounded-2xl bg-[#0c0f24]/90 border border-purple-500/40 shadow-[0_0_30px_rgba(139,92,246,0.18)] backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
            {/* Avatar with Neon Halo Ring */}
            <div className="relative shrink-0 select-none">
              <div
                onClick={() => setShowEnlargedPhoto(true)}
                title="Click to view full portrait"
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full p-1 bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-indigo-500 shadow-[0_0_24px_rgba(168,85,247,0.7)] cursor-pointer group active:scale-95 transition-transform"
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
                className="absolute -bottom-1 -right-1 bg-[#1a1d3b] hover:bg-purple-600 text-[9px] sm:text-[10px] font-black text-purple-200 hover:text-white border border-purple-400/50 rounded-full px-2.5 py-0.5 shadow-md transition-all cursor-pointer flex items-center gap-1"
                title="Cycle: Panda ➔ 3D ➔ Real"
              >
                <Sparkles size={9} className="text-yellow-400 shrink-0" />
                <span>{effectiveAvatarMode === 'gamer' ? 'Panda' : effectiveAvatarMode === '3d' ? '3D' : 'Real'}</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  soundFX.playWindowOpen();
                  setShowEnlargedPhoto(true);
                }}
                className="absolute -top-1 -right-1 bg-[#1a1d3b] hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-400/50 rounded-full p-1.5 shadow-md transition-all cursor-pointer"
                title="View full portrait"
              >
                <Maximize2 size={10} strokeWidth={2.5} />
              </button>
            </div>

            {/* Hero Text */}
            <div className="flex-1 text-center sm:text-left min-w-0">
              <div className="text-purple-400 font-serif italic text-sm sm:text-base font-bold tracking-wide">
                Hey There! 👋
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight mt-0.5">
                I'm <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-300 bg-clip-text text-transparent">Ashrut Tiwari</span>
              </h1>
              <div className="text-xs sm:text-sm md:text-base font-extrabold text-purple-200 mt-1">
                Game Developer • 3D Artist • Storyteller
              </div>
              <p className="text-xs sm:text-sm md:text-[14.5px] leading-relaxed text-slate-200 font-medium mt-2.5">
                I create games, worlds and stories... Turning imagination into reality with Unreal Engine, Blender and more.
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-2.5 text-xs sm:text-sm text-purple-300 font-semibold">
                <MapPin size={13} className="text-purple-400 shrink-0" />
                <span>{profile.location}</span>
              </div>
            </div>
          </div>

          {/* Prominent Call to Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4 pt-3.5 border-t border-purple-500/20">
            <button
              type="button"
              onClick={() => {
                soundFX.playClick(720);
                onNavigate('projectsWin');
              }}
              className="py-3 px-5 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm md:text-base flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.5)] active:scale-95 transition-all cursor-pointer border border-purple-400/40"
            >
              <Gamepad2 size={16} className="shrink-0" />
              <span>Explore My Projects</span>
              <ArrowRight size={15} className="shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => {
                soundFX.playClick(680);
                onNavigate('resumeWin');
              }}
              className="py-3 px-5 rounded-xl bg-[#141738]/90 hover:bg-[#1f2352] text-white border border-purple-500/40 font-black text-xs sm:text-sm md:text-base flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <Download size={15} className="shrink-0 text-purple-300" />
              <span>Download CV</span>
            </button>
          </div>
        </div>

        {/* 4 Stat Badges Grid (Bold & Scalable) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Badge 1 */}
          <div className="p-3 rounded-xl bg-[#0f122c]/90 border border-purple-500/30 flex items-center gap-3 shadow-sm hover:border-purple-400/60 transition-all">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0">
              <Gamepad2 size={18} className="text-purple-400" />
            </div>
            <div className="min-w-0">
              <div className="text-sm sm:text-base md:text-lg font-black text-white">10+</div>
              <div className="text-[10px] sm:text-xs text-slate-300 font-bold truncate">Projects</div>
            </div>
          </div>

          {/* Badge 2 */}
          <div className="p-3 rounded-xl bg-[#0f122c]/90 border border-purple-500/30 flex items-center gap-3 shadow-sm hover:border-purple-400/60 transition-all">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
              <Trophy size={18} className="text-amber-400" />
            </div>
            <div className="min-w-0">
              <div className="text-sm sm:text-base md:text-lg font-black text-white">SIH 2025</div>
              <div className="text-[10px] sm:text-xs text-slate-300 font-bold truncate">Participant</div>
            </div>
          </div>

          {/* Badge 3 */}
          <div className="p-3 rounded-xl bg-[#0f122c]/90 border border-purple-500/30 flex items-center gap-3 shadow-sm hover:border-purple-400/60 transition-all">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center shrink-0">
              <Star size={18} className="text-yellow-400" />
            </div>
            <div className="min-w-0">
              <div className="text-sm sm:text-base md:text-lg font-black text-white">3D Artist</div>
              <div className="text-[10px] sm:text-xs text-slate-300 font-bold truncate">& Designer</div>
            </div>
          </div>

          {/* Badge 4 */}
          <div className="p-3 rounded-xl bg-[#0f122c]/90 border border-purple-500/30 flex items-center gap-3 shadow-sm hover:border-purple-400/60 transition-all">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center shrink-0">
              <Zap size={18} className="text-indigo-400" />
            </div>
            <div className="min-w-0">
              <div className="text-sm sm:text-base md:text-lg font-black text-white">Always</div>
              <div className="text-[10px] sm:text-xs text-slate-300 font-bold truncate">Learning</div>
            </div>
          </div>
        </div>

        {/* Disciplines & Specialties */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-[#0c0f24]/80 border border-purple-500/30">
          <div className="text-xs sm:text-sm font-black text-purple-300 uppercase tracking-wider mb-2.5 flex items-center gap-2">
            <Sparkles size={13} className="text-purple-400" />
            <span>Core Engines & Disciplines</span>
          </div>
          <div className="flex flex-wrap gap-2">
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141738] border border-purple-500/30 text-xs sm:text-sm font-bold text-slate-200 shadow-xs hover:border-purple-400/60 transition-all"
              >
                <span>{tool.icon}</span>
                <span>{tool.label}</span>
                {tool.note && (
                  <span className="text-[10px] text-purple-300/80 font-normal">({tool.note})</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Quote Pill (Matching Mockup) */}
        <div className="py-2.5 px-5 rounded-full bg-[#111430]/90 border border-purple-500/40 text-center shadow-[0_0_15px_rgba(168,85,247,0.15)]">
          <span className="text-sm sm:text-base font-serif italic text-purple-200 font-black tracking-wider">
            “Dream • Create • Explore” ✨
          </span>
        </div>

        {/* Social Icons Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-purple-500/20 text-xs sm:text-sm">
          <span className="font-black text-purple-300">Connect with Ashrut:</span>
          <div className="flex items-center gap-2">
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="p-2 rounded-xl bg-[#141738] border border-purple-500/30 text-rose-400 hover:text-white hover:bg-rose-600 transition-all shadow-xs"
            >
              <Youtube size={16} />
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
              className="p-2 rounded-xl bg-[#141738] border border-purple-500/30 text-indigo-400 hover:text-white hover:bg-indigo-600 transition-all shadow-xs"
            >
              <MessageSquare size={16} />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="p-2 rounded-xl bg-[#141738] border border-purple-500/30 text-slate-300 hover:text-white hover:bg-purple-600 transition-all shadow-xs"
            >
              <Github size={16} />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="p-2 rounded-xl bg-[#141738] border border-purple-500/30 text-slate-300 hover:text-white hover:bg-purple-600 transition-all shadow-xs"
            >
              <Twitter size={16} />
            </a>
            <button
              type="button"
              onClick={() => onNavigate('contactWin')}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600 border border-purple-400/50 text-white text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ml-1"
            >
              <Mail size={13} />
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
              <div className="bg-gradient-to-r from-[#17193c] via-[#241c48] to-[#17193c] px-4 py-3 border-b border-purple-500/40 flex items-center justify-between text-white">
                <span className="font-black text-sm flex items-center gap-2">
                  <span>🐼</span>
                  <span>Ashrut Tiwari · Portrait Studio</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowEnlargedPhoto(false)}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-rose-500 flex items-center justify-center transition-colors cursor-pointer text-white"
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              </div>

              <div className="p-4 space-y-3.5">
                <div className="aspect-square w-full rounded-xl border border-purple-500/40 overflow-hidden bg-[#060815] relative shadow-inner">
                  <img
                    src={enlargedAvatarSrc}
                    alt="Ashrut Tiwari - Gamer Panda & 3D Artist"
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <div className="flex items-center justify-between gap-2 p-2.5 bg-[#121633] rounded-xl border border-purple-500/30 text-xs font-bold text-slate-200">
                  <span className="font-black">Portrait Version:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setAvatarMode('gamer')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
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
                      className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        avatarMode === '3d'
                          ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.6)]'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      ✨ 3D
                    </button>
                    <button
                      type="button"
                      onClick={() => setAvatarMode('real')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
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
  // CAT MODE: Classic Pastel Cozy Retro OS (Bold & Scalable)
  // =========================================================================
  return (
    <div className="space-y-3.5">
      {/* Header Profile Card */}
      <div className="flex items-center gap-3.5 p-3 sm:p-4 bg-white border-2 border-pastel-dark rounded-retro shadow-[3px_3px_0_#ffdab9]">
        {/* Profile Picture with Interactive 3D / Real Photo Toggle */}
        <div className="relative shrink-0 select-none">
          <div
            onClick={() => setShowEnlargedPhoto(true)}
            title="Click to view full photo"
            className="w-18 h-18 sm:w-22 sm:h-22 md:w-26 md:h-26 rounded-2xl bg-pastel-peach border-2 border-pastel-dark overflow-hidden flex items-center justify-center shadow-[3px_3px_0_#3d3d3d] cursor-pointer relative group active:scale-95 transition-all"
          >
            <img
              src={activeAvatarSrc}
              alt="Ashrut Tiwari - Unreal 5 Game Dev & 3D Artist"
              className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
            />
            {/* Tag indicator overlay */}
            <span className="absolute bottom-0 inset-x-0 bg-pastel-dark/85 text-white text-[8px] sm:text-[9px] font-black text-center py-0.5 tracking-wide backdrop-blur-xs">
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
            className="absolute -bottom-1 -right-1 bg-white hover:bg-pastel-mint border border-pastel-dark rounded-full px-2 py-0.5 text-[9px] sm:text-[10px] font-black text-pastel-dark shadow-xs transition-all cursor-pointer flex items-center gap-0.5"
            title="Toggle between Real Photo and 3D Render"
          >
            <Sparkles size={9} className="text-amber-500 shrink-0" />
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
            className="absolute -top-1.5 -right-1.5 bg-white hover:bg-pastel-peach border border-pastel-dark rounded-full p-1.5 shadow-xs transition-all cursor-pointer text-pastel-dark"
            title="View full portrait"
          >
            <Maximize2 size={10} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-pastel-dark break-words">
              {profile.full_name}
            </h1>
            <span className="text-lg shrink-0">👾</span>
          </div>
          <p className="text-xs sm:text-sm font-extrabold text-pastel-dark leading-snug break-words mt-1">
            {profile.headline}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pastel-mint border border-pastel-dark text-[10px] sm:text-xs font-black text-pastel-dark shadow-xs">
              💼 Game Developer
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pastel-lavender border border-pastel-dark text-[10px] sm:text-xs font-bold text-pastel-dark shadow-xs">
              🎬 Filmmaking (Hobby)
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pastel-pink border border-pastel-dark text-[10px] sm:text-xs font-black text-pastel-dark shadow-xs">
              🌸 Cozy Retro
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-pastel-soft min-w-0 font-bold">
            <MapPin size={13} className="shrink-0 text-pastel-dark" />
            <span className="break-words">{profile.location}</span>
          </div>
        </div>
      </div>

      {/* Biography */}
      <div className="text-xs sm:text-sm md:text-[14.5px] leading-relaxed text-pastel-dark space-y-2 bg-pastel-warm/60 p-3 sm:p-4 rounded-retro-sm border border-pastel-dark/20 break-words font-medium">
        <p>{profile.bio}</p>
        <p className="flex items-center gap-1.5 font-black text-emerald-800 text-xs sm:text-sm break-words pt-1">
          <Briefcase size={14} className="shrink-0" />
          <span>{profile.freelance_status}</span>
        </p>
      </div>

      {/* Creative Hobby Demarcation Banner */}
      <div className="p-2.5 sm:p-3 bg-pastel-lavender/40 border border-pastel-dark rounded-retro-sm text-xs sm:text-sm text-pastel-dark flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-base shrink-0">🎬</span>
          <span className="break-words">
            <strong>Filmmaking:</strong> Creative personal hobby to enrich game camera directing.
          </span>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('hobbiesWin')}
          className="text-xs font-black px-2.5 py-1 bg-white border border-pastel-dark rounded-lg hover:bg-pastel-peach shrink-0 shadow-xs cursor-pointer ml-auto"
        >
          View Hobby ➔
        </button>
      </div>

      {/* Specialties Badges */}
      <div>
        <h3 className="text-xs sm:text-sm font-black text-pastel-soft uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles size={13} />
          <span>Disciplines & Focus</span>
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {profile.specialties.map((spec, i) => {
            const isHobby = spec.toLowerCase().includes('hobby');
            return (
              <span
                key={i}
                className={`text-xs sm:text-sm font-bold px-2.5 py-1 rounded-full border border-pastel-dark shadow-xs flex items-center gap-1.5 ${
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
      <div className="grid grid-cols-3 gap-2 pt-1 pb-1">
        <button
          type="button"
          onClick={() => {
            soundFX.playClick(640);
            onNavigate('contactWin');
          }}
          className="retro-btn retro-btn-primary py-2.5 px-2 text-xs sm:text-sm font-black min-w-0 justify-center"
        >
          <Mail size={14} strokeWidth={2.5} className="shrink-0" />
          <span className="truncate">Hire Me</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundFX.playClick(640);
            onNavigate('projectsWin');
          }}
          className="retro-btn retro-btn-mint py-2.5 px-2 text-xs sm:text-sm font-black min-w-0 justify-center"
        >
          <Gamepad2 size={14} strokeWidth={2.5} className="shrink-0" />
          <span className="truncate">Projects</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundFX.playClick(640);
            onNavigate('resumeWin');
          }}
          className="retro-btn retro-btn-lavender py-2.5 px-2 text-xs sm:text-sm font-black min-w-0 justify-center"
        >
          <FileText size={14} strokeWidth={2.5} className="shrink-0" />
          <span className="truncate">Resume</span>
        </button>
      </div>

      {/* Social Links */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 pb-3 border-t border-pastel-dark/15 text-xs sm:text-sm">
        <span className="font-black text-pastel-dark">Social Profiles:</span>
        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(profile.social_links).map(([key, url]) => {
            if (!url) return null;
            return (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="retro-btn text-xs font-bold px-2.5 py-1 bg-white capitalize hover:bg-pastel-peach"
              >
                <span>{key}</span>
                <ExternalLink size={11} />
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
            <div className="bg-pastel-peach px-4 py-2.5 border-b-2 border-pastel-dark flex items-center justify-between">
              <span className="font-black text-sm text-pastel-dark flex items-center gap-2">
                <span>👾</span>
                <span>Ashrut Tiwari · Profile Portrait</span>
              </span>
              <button
                type="button"
                onClick={() => setShowEnlargedPhoto(false)}
                className="w-6 h-6 rounded-full bg-white border border-pastel-dark flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors cursor-pointer text-pastel-dark"
              >
                <X size={13} strokeWidth={3} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-3.5">
              <div className="aspect-square w-full rounded-2xl border-2 border-pastel-dark overflow-hidden bg-pastel-warm relative shadow-md">
                <img
                  src={enlargedAvatarSrc}
                  alt="Ashrut Tiwari - Unreal 5 Game Dev & 3D Artist"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Mode switch pills */}
              <div className="flex items-center justify-between gap-2 p-2 bg-pastel-mint/30 rounded-xl border border-pastel-dark/30 text-xs font-black text-pastel-dark">
                <span>Display Version:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setAvatarMode('3d')}
                    className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
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
                    className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
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
