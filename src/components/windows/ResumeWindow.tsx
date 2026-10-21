'use client';

import React, { useState } from 'react';
import { FileText, Download, Printer, CheckCircle2, Briefcase, GraduationCap, Sparkles } from 'lucide-react';
import { ProfileSettings } from '@/types';

interface ResumeWindowProps {
  profile: ProfileSettings;
}

export const ResumeWindow: React.FC<ResumeWindowProps> = ({ profile }) => {
  const [downloadNote, setDownloadNote] = useState<string | null>(null);

  const handlePrint = () => {
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
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-white border-2 border-pastel-dark rounded-retro-sm">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-pastel-dark" />
          <span className="font-extrabold text-sm text-pastel-dark">Curriculum Vitae</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="retro-btn text-xs bg-white hover:bg-pastel-lavender"
            title="Print or Save as PDF via browser"
          >
            <Printer size={13} strokeWidth={2.5} />
            <span>Print CV</span>
          </button>

          <a
            href={profile.resume_url || '/resume-ashrut-tiwari.pdf'}
            download="Ashrut_Tiwari_Resume.pdf"
            onClick={() => {
              setDownloadNote('📄 Resume download initiated. If the file is not yet cached, you can also use "Print CV" to save as PDF!');
              setTimeout(() => setDownloadNote(null), 6000);
            }}
            className="retro-btn retro-btn-primary text-xs"
          >
            <Download size={13} strokeWidth={2.5} />
            <span>Download PDF</span>
          </a>
        </div>
      </div>

      {downloadNote && (
        <div className="p-2.5 bg-pastel-mint/80 border border-pastel-dark rounded-xl text-xs font-semibold text-pastel-dark">
          {downloadNote}
        </div>
      )}

      {/* Styled Printable Resume Sheet */}
      <div className="p-4 sm:p-5 bg-white border-2 border-pastel-dark rounded-retro shadow-sm space-y-4 printable-resume">
        {/* Header */}
        <div className="border-b-2 border-pastel-dark/20 pb-3">
          <h2 className="text-xl font-extrabold text-pastel-dark">{profile.full_name}</h2>
          <p className="text-xs font-bold text-amber-800 mt-0.5">{profile.headline}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-[11px] text-pastel-soft font-medium">
            <span>📍 {profile.location}</span>
            <span>✉️ {profile.email}</span>
            <span>💼 {profile.freelance_status}</span>
          </div>
        </div>

        {/* Professional Summary */}
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-pastel-dark mb-1 flex items-center gap-1.5">
            <Sparkles size={13} className="text-amber-500" />
            <span>Professional Summary</span>
          </h3>
          <p className="text-xs text-pastel-dark leading-relaxed">
            {profile.bio}
          </p>
        </div>

        {/* Experience Timeline */}
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-pastel-dark mb-2.5 flex items-center gap-1.5">
            <Briefcase size={13} className="text-rose-500" />
            <span>Experience & Production Timeline</span>
          </h3>

          <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-pastel-dark/20 pl-6">
            {timelineItems.map((item, idx) => (
              <div key={idx} className="relative space-y-1">
                {/* Dot */}
                <div className="absolute -left-[27px] top-1 w-2.5 h-2.5 rounded-full bg-pastel-pink border-2 border-pastel-dark" />
                <div className="flex flex-wrap items-baseline justify-between gap-1">
                  <h4 className="font-bold text-xs text-pastel-dark">{item.role}</h4>
                  <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-pastel-warm border border-pastel-dark/30 text-pastel-soft">
                    {item.period}
                  </span>
                </div>
                <p className="text-[11px] font-bold text-pastel-soft">{item.organization}</p>
                <ul className="list-disc list-inside text-[11px] text-pastel-dark/90 space-y-0.5 pl-1">
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
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-pastel-dark mb-2 flex items-center gap-1.5">
            <GraduationCap size={13} className="text-indigo-500" />
            <span>Core Technical Competencies</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
            <div className="p-2.5 bg-pastel-mint/30 rounded-lg border border-pastel-dark/30">
              <div className="flex items-center justify-between mb-0.5">
                <strong className="block text-pastel-dark font-extrabold">Engines & Code</strong>
                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-pastel-mint border border-pastel-dark text-pastel-dark">
                  Primary Job
                </span>
              </div>
              <span className="text-pastel-dark/80 font-medium">Unreal Engine 5, Godot 4, C++, Python, HLSL</span>
            </div>
            <div className="p-2.5 bg-pastel-mint/30 rounded-lg border border-pastel-dark/30">
              <div className="flex items-center justify-between mb-0.5">
                <strong className="block text-pastel-dark font-extrabold">3D & Sculpting</strong>
                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-pastel-mint border border-pastel-dark text-pastel-dark">
                  Primary Job
                </span>
              </div>
              <span className="text-pastel-dark/80 font-medium">Blender 4, Substance 3D, Rigging, Retopology</span>
            </div>
            <div className="p-2.5 bg-pastel-lavender/40 rounded-lg border border-pastel-dark/30">
              <div className="flex items-center justify-between mb-0.5">
                <strong className="block text-pastel-dark font-extrabold">Filmmaking & Cine</strong>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-pastel-lavender border border-pastel-dark text-pastel-dark">
                  Creative Hobby
                </span>
              </div>
              <span className="text-pastel-dark/80 font-medium">DaVinci Resolve, ACES, Lighting & Framing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
