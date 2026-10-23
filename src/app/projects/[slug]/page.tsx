import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProjectBySlug, getProjects } from '@/lib/data';
import { 
  ArrowLeft, 
  ExternalLink, 
  Github, 
  Play, 
  Sparkles, 
  Layers, 
  CheckCircle2,
  Calendar,
  UserCheck,
  Box
} from 'lucide-react';
import { FloatingOrbs } from '@/components/desktop/FloatingOrbs';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const hasRealPhoto = project.cover_image && !project.cover_image.endsWith('.svg');

  return (
    <div className="min-h-screen bg-pastel-bg text-pastel-dark py-10 px-4 sm:px-6 relative select-text">
      <FloatingOrbs />

      <div className="max-w-3xl mx-auto space-y-6 relative z-10">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="retro-btn bg-white hover:bg-pastel-peach text-xs"
          >
            <ArrowLeft size={14} />
            <span>Return to Desktop</span>
          </Link>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-pastel-mint border border-pastel-dark shadow-xs">
            {project.status}
          </span>
        </div>

        {/* Project Card */}
        <article className="retro-window p-6 sm:p-8 bg-[#fffcf3] space-y-6">
          {/* Header */}
          <div className="border-b-2 border-pastel-dark/20 pb-5 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs font-extrabold tracking-wider px-2.5 py-0.5 rounded-full border border-pastel-dark ${
                project.category === 'cinematography' ? 'bg-pastel-lavender text-pastel-dark' : 'bg-pastel-mint text-pastel-dark'
              }`}>
                {project.category === 'cinematography' ? '🎬 Personal Creative Hobby' : '💼 Professional Work'}
              </span>
              {project.is_featured && (
                <span className="text-xs font-bold flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pastel-yellow border border-pastel-dark text-pastel-dark shadow-xs">
                  <Sparkles size={11} />
                  <span>Featured Project</span>
                </span>
              )}
              {project.model_embed_url && (
                <span className="text-xs font-bold flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pastel-sky border border-pastel-dark text-pastel-dark shadow-xs">
                  <Box size={11} />
                  <span>3D Interactive Model</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-pastel-dark">
              {project.title}
            </h1>
            <p className="text-sm sm:text-base font-semibold text-pastel-soft">
              {project.tagline}
            </p>
          </div>

          {/* Role & Specs Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-white border-2 border-pastel-dark rounded-retro-sm text-xs">
            <div className="flex items-start gap-2.5">
              <UserCheck size={16} className="text-pastel-dark shrink-0 mt-0.5" />
              <div>
                <strong className="block text-pastel-soft uppercase text-[10px]">Role / Discipline:</strong>
                <span className="font-bold text-pastel-dark">{project.role}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Layers size={16} className="text-pastel-dark shrink-0 mt-0.5" />
              <div>
                <strong className="block text-pastel-soft uppercase text-[10px]">Production Status:</strong>
                <span className="font-bold text-pastel-dark">{project.status}</span>
              </div>
            </div>

            {(project.triangles_count || project.vertices_count) && (
              <div className="sm:col-span-2 pt-2 border-t border-pastel-dark/15 flex flex-wrap gap-2 text-xs">
                {project.triangles_count && (
                  <span className="px-2.5 py-1 rounded-md bg-pastel-warm border border-pastel-dark/30 font-bold">
                    🔺 Triangles: <strong>{project.triangles_count}</strong>
                  </span>
                )}
                {project.vertices_count && (
                  <span className="px-2.5 py-1 rounded-md bg-pastel-warm border border-pastel-dark/30 font-bold">
                    🔹 Vertices: <strong>{project.vertices_count}</strong>
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-md bg-pastel-mint border border-pastel-dark/30 font-bold">
                  ✨ Real-Time Game Ready PBR
                </span>
              </div>
            )}
          </div>

          {/* Visual Showcase Graphic / Photo */}
          <div className="space-y-4">
            <div className="relative aspect-[16/9] w-full rounded-retro bg-[#dedede] border-[3px] border-pastel-dark overflow-hidden flex items-center justify-center shadow-retro">
              {hasRealPhoto ? (
                <img
                  src={project.cover_image}
                  alt={project.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-pastel-peach via-pastel-lavender to-pastel-mint flex flex-col items-center justify-center p-6 text-center">
                  <span className="text-5xl filter drop-shadow">
                    {project.category === 'game-dev' ? '⚔️' : project.category === 'cinematography' ? '🎬' : '💀'}
                  </span>
                  <h3 className="font-extrabold text-lg sm:text-xl text-pastel-dark mt-2">
                    {project.title}
                  </h3>
                  <p className="text-xs font-bold text-pastel-soft mt-1">
                    Engineered with {project.technologies.slice(0, 3).join(', ')}
                  </p>
                </div>
              )}
            </div>

            {/* Gallery Images if available */}
            {project.gallery_images && project.gallery_images.length > 1 && (
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-pastel-soft uppercase">Detail Gallery:</span>
                <div className="flex flex-wrap gap-2">
                  {project.gallery_images.map((img, i) => (
                    <div
                      key={i}
                      className="w-20 h-16 rounded-retro-sm border-2 border-pastel-dark bg-[#dedede] overflow-hidden shadow-xs"
                    >
                      <img
                        src={img}
                        alt={`${project.title} view ${i + 1}`}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interactive 3D Model Embed (if available) */}
          {project.model_embed_url && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-pastel-soft flex items-center gap-1.5">
                  <Box size={14} />
                  <span>Interactive 3D Model Viewer (Rotate & Zoom)</span>
                </h2>
                {project.sketchfab_url && (
                  <a
                    href={project.sketchfab_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#1caad9] hover:underline flex items-center gap-1"
                  >
                    <span>Open on Sketchfab</span>
                    <ExternalLink size={11} />
                  </a>
                )}
              </div>
              <div className="aspect-[16/10] w-full rounded-retro border-[3px] border-pastel-dark overflow-hidden bg-black/5 shadow-retro">
                <iframe
                  title={`${project.title} 3D Model`}
                  src={project.model_embed_url}
                  className="w-full h-full border-0"
                  allow="autoplay; fullscreen; xr-spatial-tracking"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Deep Dive Description */}
          <div className="space-y-2">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-pastel-soft">
              Detailed Breakdown & Implementation
            </h2>
            <div className="text-xs sm:text-sm text-pastel-dark leading-relaxed whitespace-pre-line bg-pastel-warm/50 p-4 rounded-retro-sm border border-pastel-dark/20">
              {project.description}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="space-y-2">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-pastel-soft">
              Technologies & Pipeline
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.map((t, idx) => (
                <span
                  key={idx}
                  className="text-xs font-bold px-3 py-1 rounded-full bg-white border border-pastel-dark shadow-xs"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Links & CTA */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t-2 border-pastel-dark/20">
            <div className="flex flex-wrap gap-2">
              {project.sketchfab_url && (
                <a
                  href={project.sketchfab_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ backgroundColor: '#1caad9', color: '#ffffff' }}
                  className="retro-btn retro-btn-sketchfab text-xs !bg-[#1caad9] !text-white hover:!bg-[#1594be] shadow-sm"
                >
                  <Box size={13} className="text-white shrink-0" />
                  <span className="text-white font-extrabold">Sketchfab 3D</span>
                </a>
              )}
              {project.demo_url && project.demo_url !== project.sketchfab_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="retro-btn retro-btn-mint text-xs"
                >
                  <ExternalLink size={13} />
                  <span>Interactive Demo</span>
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="retro-btn text-xs bg-white"
                >
                  <Github size={13} />
                  <span>GitHub Repository</span>
                </a>
              )}
              {project.video_url && (
                <a
                  href={project.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="retro-btn retro-btn-primary text-xs"
                >
                  <Play size={13} />
                  <span>Watch Video</span>
                </a>
              )}
            </div>

            <Link
              href="/"
              className="retro-btn bg-pastel-peach text-xs"
            >
              <span>Back to Desktop</span>
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
