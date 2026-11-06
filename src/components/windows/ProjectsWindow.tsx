'use client';

import React, { useState } from 'react';
import { Project, ProjectCategory } from '@/types';
import { 
  Search, 
  ExternalLink, 
  Github, 
  Play, 
  Gamepad2, 
  Sparkles, 
  Eye, 
  X,
  Layers,
  Box,
  Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';
import { soundFX } from '@/lib/soundEffects';
import { useTheme } from '@/context/ThemeContext';

interface ProjectsWindowProps {
  projects: Project[];
}

export const ProjectsWindow: React.FC<ProjectsWindowProps> = ({ projects }) => {
  const { isPanda } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [viewMode, setViewMode] = useState<'photo' | '3d'>('photo');

  const categories = [
    { label: 'All Projects', value: 'all' },
    { label: '🎮 Games (Core Work)', value: 'game-dev' },
    { label: '🗿 3D Art (Core Work)', value: '3d-art' },
    { label: '💀 Characters (Core Work)', value: 'character-design' },
    { label: '🎬 Filmmaking (Creative Hobby)', value: 'cinematography' },
  ];

  const filteredProjects = projects.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      p.category === selectedCategory ||
      (p.secondary_categories && p.secondary_categories.includes(selectedCategory as ProjectCategory)) ||
      (selectedCategory === '3d-art' && (p.category === 'character-design' || p.category === '3d-art')) ||
      (selectedCategory === 'character-design' && (p.category === 'character-design' || p.category === '3d-art'));

    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const handleOpenInspect = (project: Project) => {
    soundFX.playWindowOpen();
    setActiveProject(project);
    setSelectedImage(project.cover_image || '');
    setViewMode('photo');
  };

  return (
    <div className="space-y-4">
      {/* Professional Scope Banner */}
      <div
        className={`flex flex-wrap items-center justify-between gap-2 p-3 rounded-retro-sm text-xs sm:text-sm shadow-xs ${
          isPanda
            ? 'bg-[#121633]/90 border border-purple-500/30 text-purple-200'
            : 'bg-pastel-mint/30 border border-pastel-dark text-pastel-dark'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg shrink-0">{isPanda ? '🎋' : '💼'}</span>
          <span className="font-bold">
            <strong>Primary Career Focus:</strong> Unreal Engine 5 Game Development & 3D Character/Asset Art.
          </span>
        </div>
        <span
          className={`text-xs font-black px-2.5 py-0.5 rounded-full shrink-0 ${
            isPanda
              ? 'bg-purple-900/60 border border-purple-500/40 text-purple-200'
              : 'bg-pastel-lavender border border-pastel-dark text-pastel-dark'
          }`}
        >
          🎬 Filmmaking = Personal Hobby
        </span>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search
            size={17}
            className={`absolute left-3.5 top-3 ${
              isPanda ? 'text-purple-300/60' : 'text-pastel-dark/60'
            }`}
          />
          <input
            type="text"
            placeholder="Search projects, tools (e.g. Unreal, C++, Blender)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-3.5 py-2 text-xs sm:text-sm font-bold rounded-full focus:outline-none shadow-sm transition-all ${
              isPanda
                ? 'bg-[#0c0f24] border border-purple-500/40 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500/50'
                : 'bg-white border-2 border-pastel-dark text-pastel-dark focus:ring-2 focus:ring-pastel-pink'
            }`}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className={`absolute right-3 top-2.5 ${
                isPanda ? 'text-purple-300/70 hover:text-white' : 'text-pastel-dark/60 hover:text-pastel-dark'
              }`}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto no-scrollbar gap-1.5 pb-1 touch-pan-x sm:flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => {
                soundFX.playClick(620);
                setSelectedCategory(cat.value);
              }}
              className={`retro-btn text-xs sm:text-sm font-black px-3 py-1.5 whitespace-nowrap shrink-0 transition-all ${
                selectedCategory === cat.value
                  ? isPanda
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400/50 shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                    : 'bg-pastel-pink shadow-[2px_2px_0_#3d3d3d]'
                  : isPanda
                    ? 'bg-[#121633] border border-purple-500/30 text-slate-300 hover:bg-[#1a1f46]'
                    : 'bg-white hover:bg-pastel-peach/50 text-pastel-dark'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div
          className={`p-8 text-center rounded-retro border-2 border-dashed ${
            isPanda
              ? 'bg-[#0c0f24]/80 border-purple-500/40 text-slate-300'
              : 'bg-white border-pastel-dark text-pastel-dark'
          }`}
        >
          <Gamepad2 className="w-10 h-10 mx-auto text-purple-400/60 mb-2 animate-bounce" />
          <h4 className="font-bold text-sm">No projects match your filter</h4>
          <p className="text-xs text-slate-400 mt-1">Try clearing your search term or select another category.</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className={`retro-btn text-xs mt-3 ${
              isPanda ? 'bg-purple-600 text-white' : 'bg-pastel-mint'
            }`}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredProjects.map((project) => {
            const hasRealPhoto = project.cover_image && !project.cover_image.endsWith('.svg');

            return (
              <div
                key={project.id}
                className={`flex flex-col justify-between overflow-hidden p-3 group min-w-0 rounded-2xl transition-all ${
                  isPanda
                    ? 'bg-[#0c0f24]/90 border border-purple-500/40 shadow-[0_0_20px_rgba(139,92,246,0.15)] hover:border-purple-400 hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] text-slate-100'
                    : 'retro-card bg-white'
                }`}
              >
                <div className="min-w-0">
                  {/* Visual Header / Cover Art */}
                  <div
                    className={`relative aspect-[16/9] w-full rounded-xl overflow-hidden flex items-center justify-center mb-2.5 shadow-sm transition-colors ${
                      isPanda
                        ? 'bg-[#080a18] border border-purple-500/30 group-hover:border-purple-400/70'
                        : 'bg-[#dedede] border-2 border-pastel-dark group-hover:border-pastel-coral'
                    }`}
                  >
                    {hasRealPhoto ? (
                      <img
                        src={project.cover_image}
                        alt={project.title}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div
                        className={`w-full h-full flex items-center justify-center text-center p-3 ${
                          isPanda
                            ? 'bg-gradient-to-br from-[#121633] via-[#1f1638] to-[#121633]'
                            : 'bg-gradient-to-br from-pastel-peach via-pastel-lavender to-pastel-mint'
                        }`}
                      >
                        <div>
                          <span className="text-3xl filter drop-shadow">
                            {project.category === 'game-dev' ? '⚔️' : project.category === 'cinematography' ? '🎬' : '💀'}
                          </span>
                          <h5
                            className={`font-extrabold text-sm mt-1 tracking-wide break-words ${
                              isPanda ? 'text-white' : 'text-pastel-dark'
                            }`}
                          >
                            {project.title}
                          </h5>
                        </div>
                      </div>
                    )}

                    {/* Featured Badge */}
                    {project.is_featured && (
                      <span
                        className={`absolute top-2 left-2 flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs ${
                          isPanda
                            ? 'bg-purple-600/90 border border-purple-400/50 text-white shadow-[0_0_8px_rgba(168,85,247,0.6)]'
                            : 'bg-pastel-yellow border border-pastel-dark text-pastel-dark'
                        }`}
                      >
                        <Sparkles size={10} />
                        <span>Featured</span>
                      </span>
                    )}

                    {/* Distinct Category Nature Badge */}
                    <span
                      className={`absolute top-2 right-2 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs ${
                        project.category === 'cinematography'
                          ? isPanda
                            ? 'bg-indigo-900/80 border border-indigo-400/40 text-indigo-200'
                            : 'bg-pastel-lavender border border-pastel-dark text-pastel-dark'
                          : isPanda
                            ? 'bg-[#141738]/90 border border-purple-500/40 text-purple-200'
                            : 'bg-pastel-mint border border-pastel-dark text-pastel-dark'
                      }`}
                    >
                      {project.category === 'cinematography' ? '🎬 Creative Hobby' : '💼 Core Work'}
                    </span>

                    {/* 3D Model Badge & Status */}
                    <div className="absolute bottom-2 left-2 flex items-center gap-1">
                      {project.model_embed_url && (
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1 ${
                            isPanda
                              ? 'bg-purple-900/90 border border-purple-400/50 text-purple-200'
                              : 'bg-pastel-sky/95 border border-pastel-dark text-pastel-dark'
                          }`}
                        >
                          <Box size={10} />
                          <span>3D Model</span>
                        </span>
                      )}
                    </div>

                    <span
                      className={`absolute bottom-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs ${
                        isPanda
                          ? 'bg-[#0c0f24]/90 border border-purple-500/40 text-purple-200'
                          : 'bg-white/95 border border-pastel-dark text-pastel-dark'
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>

                  {/* Details */}
                  <h3
                    className={`font-black text-lg sm:text-xl md:text-2xl transition-colors break-words tracking-tight ${
                      isPanda
                        ? 'text-white group-hover:text-purple-300'
                        : 'text-pastel-dark group-hover:text-amber-800'
                    }`}
                  >
                    {project.title}
                  </h3>
                  <p
                    className={`text-xs sm:text-sm font-bold mt-1 break-words line-clamp-2 leading-snug ${
                      isPanda ? 'text-slate-300' : 'text-pastel-soft'
                    }`}
                  >
                    {project.tagline}
                  </p>

                  {/* Tech Pills */}
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {project.technologies.slice(0, 4).map((tech, i) => (
                      <span
                        key={i}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                          isPanda
                            ? 'bg-[#141738] border border-purple-500/30 text-purple-200'
                            : 'bg-pastel-warm border border-pastel-dark/30 text-pastel-dark'
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-lg ${
                          isPanda
                            ? 'bg-[#141738]/60 text-purple-300/70'
                            : 'bg-pastel-warm/60 text-pastel-dark/70'
                        }`}
                      >
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div
                  className={`flex flex-wrap items-center justify-between gap-2 pt-3.5 mt-3.5 border-t ${
                    isPanda ? 'border-purple-500/20' : 'border-pastel-dark/10'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleOpenInspect(project)}
                    className={`retro-btn text-xs sm:text-sm font-black px-3.5 py-1.5 shrink-0 ${
                      isPanda
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border-purple-400/40 shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                        : 'bg-pastel-mint'
                    }`}
                  >
                    <Eye size={14} strokeWidth={2.5} />
                    <span>Inspect</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {project.sketchfab_url && (
                      <a
                        href={project.sketchfab_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-1.5 rounded-full border transition-colors ${
                          isPanda
                            ? 'bg-[#141738] border-purple-500/40 text-purple-300 hover:bg-purple-600 hover:text-white'
                            : 'bg-pastel-sky/40 border-pastel-dark hover:bg-pastel-sky text-pastel-dark'
                        }`}
                        title="View 3D Model on Sketchfab"
                      >
                        <Box size={13} />
                      </a>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-1.5 rounded-full border transition-colors ${
                          isPanda
                            ? 'bg-[#141738] border-purple-500/40 text-slate-300 hover:bg-purple-600 hover:text-white'
                            : 'bg-white border-pastel-dark hover:bg-pastel-peach text-pastel-dark'
                        }`}
                        title="GitHub Repository"
                      >
                        <Github size={13} />
                      </a>
                    )}
                    {project.video_url && (
                      <a
                        href={project.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-1.5 rounded-full border transition-colors ${
                          isPanda
                            ? 'bg-[#141738] border-purple-500/40 text-rose-400 hover:bg-rose-600 hover:text-white'
                            : 'bg-white border-pastel-dark hover:bg-pastel-pink text-pastel-dark'
                        }`}
                        title="Watch Video"
                      >
                        <Play size={13} />
                      </a>
                    )}
                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-1.5 rounded-full border transition-colors ${
                          isPanda
                            ? 'bg-[#141738] border-purple-500/40 text-purple-300 hover:bg-purple-600 hover:text-white'
                            : 'bg-white border-pastel-dark hover:bg-pastel-lavender text-pastel-dark'
                        }`}
                        title="Interactive Project / Demo"
                      >
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Project Detail Modal */}
      {activeProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div
            className={`max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col rounded-2xl ${
              isPanda
                ? 'bg-[#0c0f24] border-2 border-purple-500/50 shadow-[0_0_40px_rgba(168,85,247,0.4)] text-slate-100'
                : 'retro-window bg-[#fffcf3]'
            }`}
          >
            {/* Header */}
            <div
              className={`px-4 py-3 flex items-center justify-between shrink-0 ${
                isPanda
                  ? 'bg-gradient-to-r from-[#17193c] via-[#241c48] to-[#17193c] border-b border-purple-500/40 text-white'
                  : 'bg-pastel-peach border-b-[3px] border-pastel-dark text-pastel-dark'
              }`}
            >
              <h3 className="font-black text-base sm:text-lg md:text-xl flex items-center gap-2">
                <span>{activeProject.model_embed_url ? '🗿' : '👾'}</span>
                <span>{activeProject.title}</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  soundFX.playWindowClose();
                  setActiveProject(null);
                }}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  isPanda
                    ? 'bg-white/10 hover:bg-rose-500 text-white'
                    : 'bg-white border-2 border-pastel-dark hover:bg-pastel-coral hover:text-white text-pastel-dark'
                }`}
              >
                <X size={14} strokeWidth={3} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto flex-1">
              {/* Media Visual Area */}
              <div className="space-y-2">
                {activeProject.model_embed_url && (
                  <div className="flex items-center justify-between gap-2 pb-1">
                    <span
                      className={`text-[11px] font-extrabold flex items-center gap-1 ${
                        isPanda ? 'text-purple-300' : 'text-pastel-dark'
                      }`}
                    >
                      <span>Visual Showcase</span>
                    </span>
                    <div
                      className={`flex items-center gap-1 p-0.5 rounded-full border shadow-xs ${
                        isPanda
                          ? 'bg-[#121633] border-purple-500/30'
                          : 'bg-white border-pastel-dark'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setViewMode('photo')}
                        className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full transition-colors flex items-center gap-1 ${
                          viewMode === 'photo'
                            ? isPanda
                              ? 'bg-purple-600 text-white shadow-xs'
                              : 'bg-pastel-peach text-pastel-dark border border-pastel-dark shadow-xs'
                            : isPanda
                              ? 'text-slate-400 hover:text-white'
                              : 'text-pastel-dark/70 hover:text-pastel-dark'
                        }`}
                      >
                        <ImageIcon size={12} />
                        <span>Render Photo</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode('3d')}
                        className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full transition-colors flex items-center gap-1 ${
                          viewMode === '3d'
                            ? isPanda
                              ? 'bg-purple-600 text-white shadow-xs'
                              : 'bg-pastel-sky text-pastel-dark border border-pastel-dark shadow-xs'
                            : isPanda
                              ? 'text-slate-400 hover:text-white'
                              : 'text-pastel-dark/70 hover:text-pastel-dark'
                        }`}
                      >
                        <Box size={12} />
                        <span>Interactive 3D</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Display Frame */}
                <div
                  className={`relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-xl overflow-hidden flex items-center justify-center shadow-sm ${
                    isPanda
                      ? 'bg-[#080a18] border border-purple-500/40'
                      : 'bg-[#dedede] border-2 border-pastel-dark'
                  }`}
                >
                  {viewMode === '3d' && activeProject.model_embed_url ? (
                    <iframe
                      title={`${activeProject.title} Interactive 3D Model`}
                      src={activeProject.model_embed_url}
                      className="w-full h-full border-0"
                      allow="autoplay; fullscreen; xr-spatial-tracking"
                      allowFullScreen
                    />
                  ) : activeProject.cover_image && !activeProject.cover_image.endsWith('.svg') ? (
                    <img
                      src={selectedImage || activeProject.cover_image}
                      alt={activeProject.title}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div
                      className={`w-full h-full flex flex-col items-center justify-center text-center p-4 ${
                        isPanda
                          ? 'bg-gradient-to-br from-[#121633] via-[#1f1638] to-[#121633]'
                          : 'bg-gradient-to-br from-pastel-peach via-pastel-lavender to-pastel-mint'
                      }`}
                    >
                      <span className="text-4xl filter drop-shadow">
                        {activeProject.category === 'game-dev' ? '⚔️' : activeProject.category === 'cinematography' ? '🎬' : '💀'}
                      </span>
                      <h4
                        className={`font-extrabold text-base mt-2 ${
                          isPanda ? 'text-white' : 'text-pastel-dark'
                        }`}
                      >
                        {activeProject.title}
                      </h4>
                    </div>
                  )}

                  {viewMode === 'photo' && activeProject.model_embed_url && (
                    <button
                      type="button"
                      onClick={() => setViewMode('3d')}
                      className={`absolute bottom-2.5 right-2.5 retro-btn text-[11px] px-2.5 py-1 shadow-md flex items-center gap-1.5 ${
                        isPanda
                          ? 'bg-purple-600 text-white border-purple-400/50'
                          : 'bg-pastel-sky text-pastel-dark'
                      }`}
                    >
                      <Box size={13} />
                      <span>Rotate in 3D</span>
                    </button>
                  )}
                </div>

                {/* Gallery Thumbnails */}
                {activeProject.gallery_images && activeProject.gallery_images.length > 1 && (
                  <div className="flex items-center gap-2 pt-1">
                    <span
                      className={`text-[10px] font-bold uppercase ${
                        isPanda ? 'text-purple-300/70' : 'text-pastel-soft'
                      }`}
                    >
                      Views:
                    </span>
                    <div className="flex items-center gap-1.5">
                      {activeProject.gallery_images.map((imgUrl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setSelectedImage(imgUrl);
                            setViewMode('photo');
                          }}
                          className={`w-12 h-9 rounded-md border-2 overflow-hidden transition-all ${
                            selectedImage === imgUrl && viewMode === 'photo'
                              ? isPanda
                                ? 'border-purple-400 scale-105 shadow-md'
                                : 'border-pastel-dark scale-105 shadow-xs'
                              : isPanda
                                ? 'border-purple-500/30 hover:border-purple-400'
                                : 'border-pastel-dark/30 hover:border-pastel-dark'
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-full object-cover object-top"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Role & Specs Box */}
              <div
                className={`p-3.5 sm:p-4 rounded-xl ${
                  isPanda
                    ? 'bg-[#121633]/90 border border-purple-500/30'
                    : 'bg-white border-2 border-pastel-dark rounded-retro-sm'
                }`}
              >
                <span
                  className={`text-xs font-black uppercase tracking-wider ${
                    isPanda ? 'text-purple-300' : 'text-pastel-soft'
                  }`}
                >
                  Role & Focus:
                </span>
                <p className={`font-black text-sm sm:text-base md:text-lg mt-1 ${isPanda ? 'text-white' : 'text-pastel-dark'}`}>
                  {activeProject.role}
                </p>

                <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                  <span className={isPanda ? 'text-slate-300 font-bold' : 'text-pastel-soft font-bold'}>
                    Discipline:
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-black text-xs ${
                      activeProject.category === 'cinematography'
                        ? isPanda
                          ? 'bg-indigo-900/60 border border-indigo-400/40 text-indigo-200'
                          : 'bg-pastel-lavender border border-pastel-dark text-pastel-dark'
                        : isPanda
                          ? 'bg-purple-900/60 border border-purple-400/40 text-purple-200'
                          : 'bg-pastel-mint border border-pastel-dark text-pastel-dark'
                    }`}
                  >
                    {activeProject.category === 'cinematography'
                      ? '🎬 Personal Creative Hobby'
                      : '💼 Professional Game Dev / 3D Art'}
                  </span>
                  <span className={`font-bold ml-1.5 ${isPanda ? 'text-slate-300' : 'text-pastel-soft'}`}>
                    Status:
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-black text-xs ${
                      isPanda
                        ? 'bg-[#141738] border border-purple-500/30 text-purple-200'
                        : 'bg-pastel-warm border border-pastel-dark text-pastel-dark'
                    }`}
                  >
                    {activeProject.status}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div
                className={`p-3.5 sm:p-4 rounded-xl text-xs sm:text-sm md:text-[14.5px] leading-relaxed font-medium ${
                  isPanda
                    ? 'bg-[#0f122c]/80 border border-purple-500/20 text-slate-200'
                    : 'bg-pastel-warm/50 border border-pastel-dark/20 text-pastel-dark'
                }`}
              >
                <p>{activeProject.description}</p>
              </div>

              {/* Tech Stack */}
              <div>
                <span
                  className={`text-xs font-black uppercase tracking-wider block mb-2 ${
                    isPanda ? 'text-purple-300' : 'text-pastel-soft'
                  }`}
                >
                  Technologies & Shaders:
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeProject.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className={`text-xs sm:text-sm font-black px-3 py-1 rounded-lg ${
                        isPanda
                          ? 'bg-[#141738] border border-purple-500/30 text-purple-200'
                          : 'bg-white border border-pastel-dark text-pastel-dark shadow-xs'
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links Action */}
              <div
                className={`flex flex-wrap items-center gap-2 pt-3 border-t ${
                  isPanda ? 'border-purple-500/20' : 'border-pastel-dark/15'
                }`}
              >
                {activeProject.demo_url && (
                  <a
                    href={activeProject.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`retro-btn text-xs px-3 py-1.5 ${
                      isPanda
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                        : 'bg-pastel-mint'
                    }`}
                  >
                    <ExternalLink size={13} />
                    <span>Live Interactive Demo</span>
                  </a>
                )}
                {activeProject.github_url && (
                  <a
                    href={activeProject.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`retro-btn text-xs px-3 py-1.5 ${
                      isPanda
                        ? 'bg-[#141738] border-purple-500/40 text-white hover:bg-purple-600'
                        : 'bg-white'
                    }`}
                  >
                    <Github size={13} />
                    <span>View Repository</span>
                  </a>
                )}
                {activeProject.sketchfab_url && (
                  <a
                    href={activeProject.sketchfab_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`retro-btn text-xs px-3 py-1.5 ${
                      isPanda
                        ? 'bg-[#141738] border-purple-500/40 text-purple-300 hover:bg-purple-600 hover:text-white'
                        : 'bg-pastel-sky'
                    }`}
                  >
                    <Box size={13} />
                    <span>Sketchfab 3D Scene</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
