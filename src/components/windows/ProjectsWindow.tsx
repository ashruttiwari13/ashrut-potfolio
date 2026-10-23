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

interface ProjectsWindowProps {
  projects: Project[];
}

export const ProjectsWindow: React.FC<ProjectsWindowProps> = ({ projects }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [viewMode, setViewMode] = useState<'photo' | '3d'>('photo');

  const categories = [
    { label: 'All Projects', value: 'all' },
    { label: '🎮 Games (Core Work)', value: 'game-dev' },
    { label: '🗿 3D Art (Core Work)', value: '3d-art' },
    { label: '🦊 Characters (Core Work)', value: 'character-design' },
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
    setActiveProject(project);
    setSelectedImage(project.cover_image || '');
    setViewMode('photo');
  };

  return (
    <div className="space-y-4">
      {/* Professional Scope Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-pastel-mint/30 border border-pastel-dark rounded-retro-sm text-[11px] text-pastel-dark shadow-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-base shrink-0">💼</span>
          <span>
            <strong>Primary Career Focus:</strong> Unreal Engine 5 Game Development & 3D Character/Asset Art.
          </span>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pastel-lavender border border-pastel-dark shrink-0">
          🎬 Filmmaking = Personal Hobby
        </span>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-2.5 text-pastel-dark/60" />
          <input
            type="text"
            placeholder="Search projects, tools (e.g. Unreal, C++, Blender)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border-2 border-pastel-dark rounded-full focus:outline-none focus:ring-2 focus:ring-pastel-pink shadow-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-pastel-dark/60 hover:text-pastel-dark"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-1">
          {categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setSelectedCategory(cat.value)}
              className={`retro-btn text-[10px] sm:text-[11px] px-2 py-0.5 sm:px-2.5 sm:py-1 ${
                selectedCategory === cat.value
                  ? 'bg-pastel-pink shadow-[2px_2px_0_#3d3d3d]'
                  : 'bg-white hover:bg-pastel-peach/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-8 text-center bg-white border-2 border-dashed border-pastel-dark rounded-retro">
          <Gamepad2 className="w-10 h-10 mx-auto text-pastel-dark/40 mb-2 animate-bounce" />
          <h4 className="font-bold text-sm text-pastel-dark">No projects match your filter</h4>
          <p className="text-xs text-pastel-soft mt-1">Try clearing your search term or select another category.</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="retro-btn text-xs mt-3 bg-pastel-mint"
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
                className="retro-card flex flex-col justify-between bg-white overflow-hidden p-3 group min-w-0"
              >
                <div className="min-w-0">
                  {/* Visual Header / Cover Art */}
                  <div className="relative aspect-[16/9] w-full rounded-retro-sm bg-[#dedede] border-2 border-pastel-dark overflow-hidden flex items-center justify-center mb-2.5 shadow-sm group-hover:border-pastel-coral transition-colors">
                    {hasRealPhoto ? (
                      <img
                        src={project.cover_image}
                        alt={project.title}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-pastel-peach via-pastel-lavender to-pastel-mint flex items-center justify-center text-center p-3">
                        <div>
                          <span className="text-3xl filter drop-shadow">
                            {project.category === 'game-dev' ? '⚔️' : project.category === 'cinematography' ? '🎬' : '🦊'}
                          </span>
                          <h5 className="font-extrabold text-sm text-pastel-dark mt-1 tracking-wide break-words">
                            {project.title}
                          </h5>
                        </div>
                      </div>
                    )}

                    {/* Featured Badge */}
                    {project.is_featured && (
                      <span className="absolute top-2 left-2 flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-pastel-yellow border border-pastel-dark text-pastel-dark shadow-xs">
                        <Sparkles size={10} />
                        <span>Featured</span>
                      </span>
                    )}

                    {/* Distinct Category Nature Badge */}
                    <span
                      className={`absolute top-2 right-2 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-pastel-dark shadow-xs ${
                        project.category === 'cinematography'
                          ? 'bg-pastel-lavender text-pastel-dark'
                          : 'bg-pastel-mint text-pastel-dark'
                      }`}
                    >
                      {project.category === 'cinematography' ? '🎬 Creative Hobby' : '💼 Core Work'}
                    </span>

                    {/* 3D Model Badge & Status */}
                    <div className="absolute bottom-2 left-2 flex items-center gap-1">
                      {project.model_embed_url && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-pastel-sky/95 border border-pastel-dark text-pastel-dark shadow-xs flex items-center gap-1">
                          <Box size={10} />
                          <span>3D Model</span>
                        </span>
                      )}
                    </div>

                    <span className="absolute bottom-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/95 border border-pastel-dark text-pastel-dark shadow-xs">
                      {project.status}
                    </span>
                  </div>

                  {/* Details */}
                  <h4 className="font-extrabold text-base text-pastel-dark group-hover:text-amber-800 transition-colors break-words">
                    {project.title}
                  </h4>
                  <p className="text-xs font-semibold text-pastel-soft mt-0.5 break-words line-clamp-2">
                    {project.tagline}
                  </p>

                  {/* Tech Pills */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.technologies.slice(0, 4).map((tech, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-pastel-warm border border-pastel-dark/30 text-pastel-dark"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-pastel-warm/60 text-pastel-dark/70">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 mt-3 border-t border-pastel-dark/10">
                  <button
                    type="button"
                    onClick={() => handleOpenInspect(project)}
                    className="retro-btn text-xs px-2.5 py-1 bg-pastel-mint shrink-0"
                  >
                    <Eye size={12} strokeWidth={2.5} />
                    <span>Inspect</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {project.sketchfab_url && (
                      <a
                        href={project.sketchfab_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-full bg-pastel-sky/40 border border-pastel-dark hover:bg-pastel-sky transition-colors"
                        title="View 3D Model on Sketchfab"
                      >
                        <Box size={13} className="text-pastel-dark" />
                      </a>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-full bg-white border border-pastel-dark hover:bg-pastel-peach transition-colors"
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
                        className="p-1.5 rounded-full bg-white border border-pastel-dark hover:bg-pastel-pink transition-colors"
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
                        className="p-1.5 rounded-full bg-white border border-pastel-dark hover:bg-pastel-lavender transition-colors"
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="retro-window max-w-xl w-full bg-[#fffcf3] overflow-hidden animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="bg-pastel-peach px-4 py-2.5 border-b-[3px] border-pastel-dark flex items-center justify-between shrink-0">
              <h3 className="font-extrabold text-sm text-pastel-dark flex items-center gap-2">
                <span>{activeProject.model_embed_url ? '🗿' : '👾'}</span>
                <span>{activeProject.title}</span>
              </h3>
              <button
                type="button"
                onClick={() => setActiveProject(null)}
                className="w-6 h-6 rounded-full bg-white border-2 border-pastel-dark flex items-center justify-center hover:bg-pastel-coral hover:text-white transition-colors"
              >
                <X size={12} strokeWidth={3} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto flex-1">
              {/* Media Visual Area: Photo or Interactive 3D */}
              <div className="space-y-2">
                {/* Switcher if 3D model is available */}
                {activeProject.model_embed_url && (
                  <div className="flex items-center justify-between gap-2 pb-1">
                    <span className="text-[11px] font-extrabold text-pastel-dark flex items-center gap-1">
                      <span>Visual Showcase</span>
                    </span>
                    <div className="flex items-center gap-1 bg-white p-0.5 rounded-full border border-pastel-dark shadow-xs">
                      <button
                        type="button"
                        onClick={() => setViewMode('photo')}
                        className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full transition-colors flex items-center gap-1 ${
                          viewMode === 'photo'
                            ? 'bg-pastel-peach text-pastel-dark border border-pastel-dark shadow-xs'
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
                            ? 'bg-pastel-sky text-pastel-dark border border-pastel-dark shadow-xs'
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
                <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-retro-sm bg-[#dedede] border-2 border-pastel-dark overflow-hidden flex items-center justify-center shadow-sm">
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
                    <div className="w-full h-full bg-gradient-to-br from-pastel-peach via-pastel-lavender to-pastel-mint flex flex-col items-center justify-center text-center p-4">
                      <span className="text-4xl filter drop-shadow">
                        {activeProject.category === 'game-dev' ? '⚔️' : activeProject.category === 'cinematography' ? '🎬' : '🦊'}
                      </span>
                      <h4 className="font-extrabold text-base text-pastel-dark mt-2">
                        {activeProject.title}
                      </h4>
                    </div>
                  )}

                  {/* Overlay button to switch to 3D if in photo mode */}
                  {viewMode === 'photo' && activeProject.model_embed_url && (
                    <button
                      type="button"
                      onClick={() => setViewMode('3d')}
                      className="absolute bottom-2.5 right-2.5 retro-btn text-[11px] px-2.5 py-1 bg-pastel-sky text-pastel-dark shadow-md flex items-center gap-1.5"
                    >
                      <Box size={13} />
                      <span>Rotate in 3D</span>
                    </button>
                  )}
                </div>

                {/* Gallery Thumbnails if available */}
                {activeProject.gallery_images && activeProject.gallery_images.length > 1 && (
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] font-bold text-pastel-soft uppercase">Views:</span>
                    <div className="flex items-center gap-1.5">
                      {activeProject.gallery_images.map((imgUrl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setSelectedImage(imgUrl);
                            setViewMode('photo');
                          }}
                          className={`w-12 h-9 rounded-md border-2 overflow-hidden transition-all bg-[#dedede] ${
                            selectedImage === imgUrl && viewMode === 'photo'
                              ? 'border-pastel-dark scale-105 shadow-xs'
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
              <div className="p-3 bg-white border-2 border-pastel-dark rounded-retro-sm">
                <span className="text-[11px] font-bold text-pastel-soft uppercase">Role & Focus:</span>
                <p className="font-bold text-sm text-pastel-dark mt-0.5">{activeProject.role}</p>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-semibold text-pastel-soft">Discipline:</span>
                  <span
                    className={`px-2 py-0.5 rounded-full border border-pastel-dark font-extrabold text-[10px] ${
                      activeProject.category === 'cinematography'
                        ? 'bg-pastel-lavender text-pastel-dark'
                        : 'bg-pastel-mint text-pastel-dark'
                    }`}
                  >
                    {activeProject.category === 'cinematography'
                      ? '🎬 Personal Creative Hobby'
                      : '💼 Professional Game Dev / 3D Art'}
                  </span>
                  <span className="font-semibold text-pastel-soft ml-1">Status:</span>
                  <span className="px-2 py-0.5 rounded-full bg-pastel-warm border border-pastel-dark font-bold text-[10px]">
                    {activeProject.status}
                  </span>
                </div>

                {/* 3D Model Specs if available */}
                {(activeProject.triangles_count || activeProject.vertices_count) && (
                  <div className="mt-2.5 pt-2 border-t border-pastel-dark/15 flex flex-wrap gap-2 text-[11px]">
                    {activeProject.triangles_count && (
                      <span className="px-2 py-0.5 rounded-md bg-pastel-warm/60 border border-pastel-dark/30 font-bold text-pastel-dark">
                        🔺 Triangles: <strong>{activeProject.triangles_count}</strong>
                      </span>
                    )}
                    {activeProject.vertices_count && (
                      <span className="px-2 py-0.5 rounded-md bg-pastel-warm/60 border border-pastel-dark/30 font-bold text-pastel-dark">
                        🔹 Vertices: <strong>{activeProject.vertices_count}</strong>
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-md bg-pastel-mint/50 border border-pastel-dark/30 font-bold text-pastel-dark">
                      ✨ Real-Time PBR Workflow
                    </span>
                  </div>
                )}
              </div>

              {/* Project Overview */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-pastel-soft mb-1">
                  Project Overview
                </h4>
                <p className="text-xs sm:text-sm text-pastel-dark leading-relaxed whitespace-pre-line bg-pastel-warm/50 p-3 rounded-retro-sm border border-pastel-dark/20">
                  {activeProject.description}
                </p>
              </div>

              {/* Tech Stack */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-pastel-soft mb-1.5">
                  Tech Stack & Pipeline
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeProject.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-bold px-2.5 py-1 rounded-full bg-white border border-pastel-dark shadow-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* External Links */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-pastel-dark/15">
                {activeProject.sketchfab_url && (
                  <a
                    href={activeProject.sketchfab_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ backgroundColor: '#1caad9', color: '#ffffff' }}
                    className="retro-btn retro-btn-sketchfab text-xs !bg-[#1caad9] !text-white hover:!bg-[#1594be] shadow-sm"
                  >
                    <Box size={13} className="text-white shrink-0" />
                    <span className="text-white font-extrabold">View on Sketchfab 3D</span>
                  </a>
                )}
                {activeProject.demo_url && activeProject.demo_url !== activeProject.sketchfab_url && (
                  <a
                    href={activeProject.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="retro-btn retro-btn-mint text-xs"
                  >
                    <ExternalLink size={12} />
                    <span>Live Demo</span>
                  </a>
                )}
                {activeProject.github_url && (
                  <a
                    href={activeProject.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="retro-btn text-xs bg-white"
                  >
                    <Github size={12} />
                    <span>View Repository</span>
                  </a>
                )}
                {activeProject.video_url && (
                  <a
                    href={activeProject.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="retro-btn retro-btn-primary text-xs"
                  >
                    <Play size={12} />
                    <span>Watch Showcase</span>
                  </a>
                )}
                <Link
                  href={`/projects/${activeProject.slug}`}
                  className="retro-btn text-xs bg-pastel-lavender ml-auto"
                >
                  <span>Standalone Page</span>
                  <ExternalLink size={11} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
