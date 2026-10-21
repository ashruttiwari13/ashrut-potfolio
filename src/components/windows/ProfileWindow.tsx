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
  X
} from 'lucide-react';

interface ProfileWindowProps {
  profile: ProfileSettings;
  onNavigate: (winId: WindowId) => void;
}

export const ProfileWindow: React.FC<ProfileWindowProps> = ({ profile, onNavigate }) => {
  const [avatarMode, setAvatarMode] = useState<'3d' | 'real'>('3d');
  const [showEnlargedPhoto, setShowEnlargedPhoto] = useState(false);

  const activeAvatarSrc = avatarMode === '3d'
    ? (profile.avatar_url || '/assets/ashrut-avatar.jpg')
    : (profile.avatar_real_url || '/assets/ashrut-real.jpg');

  return (
    <div className="space-y-3">
      {/* Header Profile Card */}
      <div className="flex items-center gap-3 p-2.5 sm:p-3 bg-white border-2 border-pastel-dark rounded-retro shadow-[2.5px_2.5px_0_#ffdab9]">
        {/* Profile Picture with Interactive 3D / Real Photo Toggle */}
        <div className="relative shrink-0 select-none">
          <div
            onClick={() => setAvatarMode((prev) => (prev === '3d' ? 'real' : '3d'))}
            title="Click to toggle between 3D Game-Dev Avatar & Real Photo"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-pastel-peach border-2 border-pastel-dark overflow-hidden flex items-center justify-center shadow-[2px_2px_0_#3d3d3d] cursor-pointer relative group active:scale-95 transition-all"
          >
            <img
              src={activeAvatarSrc}
              alt="Ashrut Tiwari - Unreal 5 Game Dev & 3D Artist"
              className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                avatarMode === '3d' ? 'object-top' : 'object-[center_15%]'
              }`}
            />
            {/* Tag indicator overlay */}
            <span className="absolute bottom-0 inset-x-0 bg-pastel-dark/85 text-white text-[7.5px] sm:text-[8px] font-extrabold text-center py-0.5 tracking-wide backdrop-blur-xs">
              {avatarMode === '3d' ? '✨ 3D Render' : '📷 Real Photo'}
            </span>
          </div>

          {/* Quick Switch Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setAvatarMode((prev) => (prev === '3d' ? 'real' : '3d'));
            }}
            className="absolute -bottom-1 -right-1 bg-white hover:bg-pastel-mint border border-pastel-dark rounded-full px-1.5 py-0.2 text-[8px] font-extrabold text-pastel-dark shadow-xs transition-all cursor-pointer flex items-center gap-0.5"
            title="Toggle between 3D Render and Real Photo"
          >
            <Sparkles size={8} className="text-amber-500 shrink-0" />
            <span>{avatarMode === '3d' ? 'Real' : '3D'}</span>
          </button>

          {/* Enlarge inspect button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
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
              💼 Primary Profession
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-pastel-lavender border border-pastel-dark text-[9px] font-bold text-pastel-dark shadow-xs">
              🎬 Filmmaking (Creative Hobby)
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
          onClick={() => onNavigate('contactWin')}
          className="retro-btn retro-btn-primary py-1.5 px-1 text-[11px] min-w-0 justify-center"
        >
          <Mail size={12} strokeWidth={2.5} className="shrink-0" />
          <span className="truncate">Hire Me</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('projectsWin')}
          className="retro-btn retro-btn-mint py-1.5 px-1 text-[11px] min-w-0 justify-center"
        >
          <Gamepad2 size={12} strokeWidth={2.5} className="shrink-0" />
          <span className="truncate">Projects</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('resumeWin')}
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
                  src={activeAvatarSrc}
                  alt="Ashrut Tiwari - Unreal 5 Game Dev & 3D Artist"
                  className={`w-full h-full object-cover ${
                    avatarMode === '3d' ? 'object-top' : 'object-[center_15%]'
                  }`}
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
                      avatarMode === '3d'
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
                      avatarMode === 'real'
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
