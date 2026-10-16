'use client';

import React from 'react';
import { ProfileSettings, WindowId } from '@/types';
import { 
  MapPin, 
  Sparkles, 
  Briefcase, 
  ExternalLink, 
  Gamepad2, 
  Mail, 
  FileText 
} from 'lucide-react';

interface ProfileWindowProps {
  profile: ProfileSettings;
  onNavigate: (winId: WindowId) => void;
}

export const ProfileWindow: React.FC<ProfileWindowProps> = ({ profile, onNavigate }) => {
  return (
    <div className="space-y-4">
      {/* Header Profile Card */}
      <div className="flex items-center gap-4 p-3 bg-white border-2 border-pastel-dark rounded-retro shadow-[3px_3px_0_#ffdab9]">
        {/* Retro Styled Character Avatar */}
        <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-pastel-peach border-[2.5px] border-pastel-dark overflow-hidden flex items-center justify-center shadow-inner">
          <svg viewBox="0 0 120 120" className="w-full h-full p-1" aria-label="Ashrut Tiwari Stylized Avatar">
            <rect width="120" height="120" fill="#ffe4cb" rx="24" />
            {/* Astronaut helmet / character head */}
            <circle cx="60" cy="50" r="28" fill="#ffb6c1" stroke="#3d3d3d" strokeWidth="3" />
            <ellipse cx="60" cy="50" rx="20" ry="14" fill="#a0d4ff" stroke="#3d3d3d" strokeWidth="2.5" />
            {/* Eyes */}
            <circle cx="53" cy="48" r="3" fill="#3d3d3d" />
            <circle cx="67" cy="48" r="3" fill="#3d3d3d" />
            <circle cx="55" cy="46" r="1" fill="#ffffff" />
            <circle cx="69" cy="46" r="1" fill="#ffffff" />
            {/* Smile / Visor shine */}
            <path d="M54 55 Q60 60 66 55" stroke="#3d3d3d" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Body */}
            <rect x="36" y="80" width="48" height="35" rx="10" fill="#e2d1ff" stroke="#3d3d3d" strokeWidth="3" />
            {/* Badge */}
            <circle cx="60" cy="94" r="5" fill="#ffd966" stroke="#3d3d3d" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-pastel-dark truncate">
              {profile.full_name}
            </h2>
            <span className="text-lg">👾</span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-pastel-soft line-clamp-1">
            {profile.headline}
          </p>
          <div className="flex items-center gap-2 mt-1 text-[11px] text-pastel-soft">
            <MapPin size={12} className="shrink-0 text-pastel-dark" />
            <span className="truncate">{profile.location}</span>
          </div>
        </div>
      </div>

      {/* Biography */}
      <div className="text-xs sm:text-sm leading-relaxed text-pastel-dark space-y-2 bg-pastel-warm/60 p-3.5 rounded-retro-sm border border-pastel-dark/20">
        <p>{profile.bio}</p>
        <p className="flex items-center gap-1.5 font-semibold text-emerald-800">
          <Briefcase size={14} className="shrink-0" />
          <span>{profile.freelance_status}</span>
        </p>
      </div>

      {/* Specialties Badges */}
      <div>
        <h3 className="text-xs font-bold text-pastel-soft uppercase tracking-wider mb-2 flex items-center gap-1">
          <Sparkles size={12} />
          <span>Core Disciplines</span>
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {profile.specialties.map((spec, i) => (
            <span
              key={i}
              className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-pastel-mint/70 border border-pastel-dark text-pastel-dark shadow-sm"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>

      {/* Fast Action Buttons */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        <button
          type="button"
          onClick={() => onNavigate('contactWin')}
          className="retro-btn retro-btn-primary py-2 text-xs"
        >
          <Mail size={13} strokeWidth={2.5} />
          <span>Hire Me</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('projectsWin')}
          className="retro-btn retro-btn-mint py-2 text-xs"
        >
          <Gamepad2 size={13} strokeWidth={2.5} />
          <span>Projects</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('resumeWin')}
          className="retro-btn retro-btn-lavender py-2 text-xs"
        >
          <FileText size={13} strokeWidth={2.5} />
          <span>Resume</span>
        </button>
      </div>

      {/* Social Links */}
      <div className="flex items-center justify-between pt-2 border-t border-pastel-dark/15 text-xs">
        <span className="font-bold text-pastel-soft">Social Profiles:</span>
        <div className="flex items-center gap-2">
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
    </div>
  );
};
