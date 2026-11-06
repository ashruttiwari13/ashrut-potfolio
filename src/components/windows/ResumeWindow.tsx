'use client';

import React, { useState } from 'react';
import { FileText, Download, Printer, CheckCircle2, Briefcase, GraduationCap, Sparkles } from 'lucide-react';
import { ProfileSettings } from '@/types';
import { soundFX } from '@/lib/soundEffects';

interface ResumeWindowProps {
  profile: ProfileSettings;
}

export const ResumeWindow: React.FC<ResumeWindowProps> = ({ profile }) => {
  const [downloadNote, setDownloadNote] = useState<string | null>(null);

  const handlePrint = () => {
    soundFX.playClick(600);
    window.print();
  };

  const timelineItems = [
    {
      period: '2023 – Present',
      role: 'Lead Game Developer & 3D Character Artist',
      organization: 'Independent / ZodiacX Production',
      highlights: [
        'Architecting core C++ gameplay mechanics and state machines in Unreal Engine 5.',
        'Sculpting stylized high-poly and low-poly characters in Blender.',
        'Developing custom PBR textures in Substance 3D Painter with real-time Lumen lighting.',
      ],
    },
    {
      period: '2022 – 2024',
      role: 'Freelance Unreal Game Developer & 3D Artist',
      organization: 'Commercial & Indie Studio Collaborations',
      highlights: [
        'Built environment assets, modular architecture, and stylized props for indie Godot/UE5 titles.',
        'Constructed custom procedural shaders and particle systems in Godot 4 and Unreal Engine 5.',
        'Directed personal creative hobby CGI short "Echoes" testing cinematic lighting and ACES color workflows.',
      ],
    },
    {
      period: '2021 – 2022',
      role: 'Technical Art & 3D Generalist Intern',
      organization: 'Indie Game Jam & Creative Projects',
      highlights: [
        'Produced real-time character rigs with custom IK/FK controls and facial blendshapes.',
        'Created Python automation scripts for batch export pipelines in Blender.',
      ],
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 sm:p-3.5 bg-white border-2 border-pastel-dark rounded-retro-sm">
        <div className="flex items-center gap-2">
          <FileText size={20} className="text-pastel-dark" />
          <span className="font-black text-sm sm:text-base text-pastel-dark">Curriculum Vitae</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="retro-btn text-xs sm:text-sm font-black bg-white hover:bg-pastel-lavender"
            title="Print or Save as PDF via browser"
          >
            <Printer size={14} strokeWidth={2.5} />
            <span>Print CV</span>
          </button>

          <a
            href={profile.resume_url || '/resume-ashrut-tiwari.pdf'}
            download="Ashrut_Tiwari_Resume.pdf"
            onClick={() => {
              soundFX.playClick(720);
              setDownloadNote('📄 Resume download initiated. If the file is not yet cached, you can also use "Print CV" to save as PDF!');
              setTimeout(() => setDownloadNote(null), 6000);
            }}
            className="retro-btn retro-btn-primary text-xs sm:text-sm font-black"
          >
            <Download size={14} strokeWidth={2.5} />
            <span>Download PDF</span>
          </a>
        </div>
      </div>

      {downloadNote && (
        <div className="p-3 bg-pastel-mint/80 border border-pastel-dark rounded-xl text-xs sm:text-sm font-bold text-pastel-dark">
          {downloadNote}
        </div>
      )}

      {/* Styled Printable Resume Sheet */}
      <div className="p-4 sm:p-5 md:p-6 bg-white border-2 border-pastel-dark rounded-retro shadow-sm space-y-4 printable-resume">
        {/* Header */}
        <div className="border-b-2 border-pastel-dark/20 pb-3.5 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-pastel-dark break-words">{profile.full_name}</h2>
            <p className="text-xs sm:text-sm font-black text-amber-800 mt-1 break-words">{profile.headline}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-pastel-soft font-bold break-all">
              <span>📍 {profile.location}</span>
              <span>✉️ {profile.email}</span>
              <span>💼 {profile.freelance_status}</span>
            </div>
          </div>

          <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 border-pastel-dark overflow-hidden shadow-[2px_2px_0_#3d3d3d] bg-pastel-peach">
            <img
              src="/assets/ashrut-photo-crop.jpg"
              alt={profile.full_name}
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>

        {/* Professional Summary */}
        <div>
          <h3 className="text-xs sm:text-sm md:text-base font-black uppercase tracking-wider text-pastel-dark mb-1.5 flex items-center gap-2">
            <Sparkles size={15} className="text-amber-500" />
            <span>Professional Summary</span>
          </h3>
          <p className="text-xs sm:text-sm leading-relaxed text-pastel-dark font-medium break-words">
            {profile.bio}
          </p>
        </div>

        {/* Experience Timeline */}
        <div>
          <h3 className="text-xs sm:text-sm md:text-base font-black uppercase tracking-wider text-pastel-dark mb-3 flex items-center gap-2">
            <Briefcase size={15} className="text-rose-500" />
            <span>Experience & Production Timeline</span>
          </h3>

          <div className="space-y-3.5 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-pastel-dark/20 pl-6">
            {timelineItems.map((item, idx) => (
              <div key={idx} className="relative space-y-1.5 min-w-0">
                {/* Dot */}
                <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-pastel-pink border-2 border-pastel-dark" />
                <div className="flex flex-wrap items-baseline justify-between gap-1.5">
                  <h4 className="font-black text-sm sm:text-base text-pastel-dark break-words">{item.role}</h4>
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-pastel-warm border border-pastel-dark/30 text-pastel-soft">
                    {item.period}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-black text-pastel-soft break-words">{item.organization}</p>
                <ul className="list-disc list-inside text-xs sm:text-sm text-pastel-dark/90 space-y-1 pl-1 break-words font-medium">
                  {item.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Core Technical Competencies */}
        <div>
          <h3 className="text-xs sm:text-sm md:text-base font-black uppercase tracking-wider text-pastel-dark mb-2.5 flex items-center gap-2">
            <GraduationCap size={15} className="text-indigo-500" />
            <span>Core Technical Competencies</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs sm:text-sm">
            <div className="p-3 bg-pastel-mint/30 rounded-xl border border-pastel-dark/30 min-w-0">
              <div className="flex items-center justify-between gap-1 flex-wrap mb-1">
                <strong className="block text-pastel-dark font-black break-words">Engines & Code</strong>
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-pastel-mint border border-pastel-dark text-pastel-dark shrink-0">
                  Primary Job
                </span>
              </div>
              <span className="text-pastel-dark/80 font-bold break-words">Unreal Engine 5, Godot 4, C++, Python, HLSL</span>
            </div>
            <div className="p-3 bg-pastel-mint/30 rounded-xl border border-pastel-dark/30 min-w-0">
              <div className="flex items-center justify-between gap-1 flex-wrap mb-1">
                <strong className="block text-pastel-dark font-black break-words">3D & Sculpting</strong>
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-pastel-mint border border-pastel-dark text-pastel-dark shrink-0">
                  Primary Job
                </span>
              </div>
              <span className="text-pastel-dark/80 font-bold break-words">Blender 4, Substance 3D, Rigging, Retopology</span>
            </div>
            <div className="p-3 bg-pastel-lavender/40 rounded-xl border border-pastel-dark/30 min-w-0">
              <div className="flex items-center justify-between gap-1 flex-wrap mb-1">
                <strong className="block text-pastel-dark font-black break-words">Filmmaking & Cine</strong>
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-pastel-lavender border border-pastel-dark text-pastel-dark shrink-0">
                  Creative Hobby
                </span>
              </div>
              <span className="text-pastel-dark/80 font-bold break-words">DaVinci Resolve, ACES, Lighting & Framing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
