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
  Layers
} from 'lucide-react';
import Link from 'next/link';

interface ProjectsWindowProps {
  projects: Project[];
}

export const ProjectsWindow: React.FC<ProjectsWindowProps> = ({ projects }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const categories = [
    { label: 'All Projects', value: 'all' },
    { label: '🎮 Games', value: 'game-dev' },
    { label: '🗿 3D Art', value: '3d-art' },
    { label: '🦊 Characters', value: 'character-design' },
    { label: '🎬 Cine & VFX', value: 'cinematography' },
  ];

  const filteredProjects = projects.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4">
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
              className={`retro-btn text-[11px] px-2.5 py-1 ${
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
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="retro-card flex flex-col justify-between bg-white overflow-hidden p-3 group"
            >
              <div>
                {/* Visual Header / Cover Art Mock */}
                <div className="relative aspect-[16/9] w-full rounded-retro-sm bg-gradient-to-br from-pastel-peach via-pastel-lavender to-pastel-mint border-2 border-pastel-dark overflow-hidden flex items-center justify-center mb-2.5 shadow-sm">
                  {/* Decorative Project Graphic Preview */}
                  <div className="text-center p-3">
                    <span className="text-3xl filter drop-shadow">
                      {project.category === 'game-dev' ? '⚔️' : project.category === 'cinematography' ? '🎬' : '🦊'}
                    </span>
                    <h5 className="font-extrabold text-sm text-pastel-dark mt-1 tracking-wide">
                      {project.title}
                    </h5>
                  </div>

                  {/* Featured Badge */}
                  {project.is_featured && (
                    <span className="absolute top-2 left-2 flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-pastel-yellow border border-pastel-dark text-pastel-dark shadow-sm">
                      <Sparkles size={10} />
                      <span>Featured</span>
                    </span>
                  )}

                  <span className="absolute bottom-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 border border-pastel-dark text-pastel-dark">
                    {project.status}
                  </span>
                </div>

                {/* Details */}
                <h4 className="font-extrabold text-base text-pastel-dark group-hover:text-amber-800 transition-colors">
                  {project.title}
                </h4>
                <p className="text-xs font-semibold text-pastel-soft mt-0.5 line-clamp-2">
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
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-pastel-dark/10">
                <button
                  type="button"
                  onClick={() => setActiveProject(project)}
                  className="retro-btn text-xs px-2.5 py-1 bg-pastel-mint"
                >
                  <Eye size={12} strokeWidth={2.5} />
                  <span>Inspect</span>
                </button>

                <div className="flex items-center gap-1.5">
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
                      title="Live Demo"
                    >
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Detail Modal */}
      {activeProject && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="retro-window max-w-lg w-full bg-[#fffcf3] overflow-hidden animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="bg-pastel-peach px-4 py-2.5 border-b-[3px] border-pastel-dark flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-pastel-dark flex items-center gap-2">
                <span>👾</span>
                <span>{activeProject.title}</span>
              </h3>
              <button
                type="button"
                onClick={() => setActiveProject(null)}
                className="w-6 h-6 rounded-full bg-white border-2 border-pastel-dark flex items-center justify-center hover:bg-pastel-coral hover:text-white"
              >
                <X size={12} strokeWidth={3} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-5 space-y-3 max-h-[70vh] overflow-y-auto">
              <div className="p-3 bg-white border-2 border-pastel-dark rounded-retro-sm">
                <span className="text-xs font-bold text-pastel-soft uppercase">Role & Responsibilities:</span>
                <p className="font-bold text-sm text-pastel-dark mt-0.5">{activeProject.role}</p>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span className="font-semibold text-pastel-soft">Status:</span>
                  <span className="px-2 py-0.5 rounded-full bg-pastel-mint border border-pastel-dark font-bold text-[11px]">
                    {activeProject.status}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-pastel-soft mb-1">
                  Project Overview
                </h4>
                <p className="text-xs sm:text-sm text-pastel-dark leading-relaxed whitespace-pre-line bg-pastel-warm/50 p-3 rounded-retro-sm border border-pastel-dark/20">
                  {activeProject.description}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-pastel-soft mb-1.5">
                  Tech Stack & Pipeline
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeProject.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-bold px-2.5 py-1 rounded-full bg-white border border-pastel-dark shadow-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* External Links */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-pastel-dark/15">
                {activeProject.demo_url && (
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
