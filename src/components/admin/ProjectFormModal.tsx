'use client';

import React, { useState } from 'react';
import { Project, ProjectCategory } from '@/types';
import { X, Save, Loader2, Sparkles } from 'lucide-react';
import { saveProjectAction } from '@/app/admin/actions';

interface ProjectFormModalProps {
  project?: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  project,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    slug: project?.slug || '',
    tagline: project?.tagline || '',
    description: project?.description || '',
    category: (project?.category || 'game-dev') as ProjectCategory,
    cover_image: project?.cover_image || '/projects/zodiacx.svg',
    technologies: project?.technologies?.join(', ') || 'Unreal Engine 5, C++, Blender',
    role: project?.role || 'Lead Developer & 3D Artist',
    status: project?.status || 'Active Production',
    demo_url: project?.demo_url || '',
    github_url: project?.github_url || '',
    video_url: project?.video_url || '',
    is_featured: project?.is_featured ?? false,
    is_published: project?.is_published ?? true,
    order_index: project?.order_index ?? 1,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const payload = {
      ...formData,
      technologies: formData.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      demo_url: formData.demo_url || null,
      github_url: formData.github_url || null,
      video_url: formData.video_url || null,
      gallery_images: project?.gallery_images || [formData.cover_image],
    };

    try {
      const res = await saveProjectAction(payload);
      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.error || 'Failed to save project');
      }
    } catch {
      setError('Unexpected error saving project');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="retro-window max-w-xl w-full bg-[#fffcf3] overflow-hidden animate-in zoom-in-95 my-8">
        <div className="bg-pastel-pink px-4 py-3 border-b-[3px] border-pastel-dark flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-pastel-dark flex items-center gap-2">
            <Sparkles size={16} />
            <span>{project ? 'Edit Project' : 'Create New Project'}</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-6 h-6 rounded-full bg-white border-2 border-pastel-dark flex items-center justify-center hover:bg-pastel-coral hover:text-white"
          >
            <X size={12} strokeWidth={3} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-2.5 bg-rose-100 border border-rose-400 rounded-xl text-xs font-semibold text-rose-800">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="modal-project-title" className="block text-xs font-bold text-pastel-dark mb-1">Project Title</label>
              <input
                id="modal-project-title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => {
                  const title = e.target.value;
                  const autoSlug = title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '');
                  setFormData({
                    ...formData,
                    title,
                    slug: project ? formData.slug : autoSlug,
                  });
                }}
                className="w-full px-3 py-1.5 text-xs bg-white border-2 border-pastel-dark rounded-full focus:outline-none focus:ring-2 focus:ring-pastel-pink"
              />
            </div>

            <div>
              <label htmlFor="modal-project-slug" className="block text-xs font-bold text-pastel-dark mb-1">Slug (URL)</label>
              <input
                id="modal-project-slug"
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-white border-2 border-pastel-dark rounded-full focus:outline-none focus:ring-2 focus:ring-pastel-pink"
              />
            </div>
          </div>

          <div>
            <label htmlFor="modal-project-tagline" className="block text-xs font-bold text-pastel-dark mb-1">Tagline</label>
            <input
              id="modal-project-tagline"
              type="text"
              required
              placeholder="Short punchy summary"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3 py-1.5 text-xs bg-white border-2 border-pastel-dark rounded-full focus:outline-none focus:ring-2 focus:ring-pastel-pink"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="modal-project-category" className="block text-xs font-bold text-pastel-dark mb-1">Category</label>
              <select
                id="modal-project-category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ProjectCategory })}
                className="w-full px-3 py-1.5 text-xs bg-white border-2 border-pastel-dark rounded-full focus:outline-none focus:ring-2 focus:ring-pastel-pink"
              >
                <option value="game-dev">Game Development</option>
                <option value="3d-art">3D Art & Modeling</option>
                <option value="character-design">Character Design</option>
                <option value="cinematography">Cinematography & VFX</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="modal-project-status" className="block text-xs font-bold text-pastel-dark mb-1">Status</label>
              <input
                id="modal-project-status"
                type="text"
                required
                placeholder="e.g. Completed, Playable Demo"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-white border-2 border-pastel-dark rounded-full focus:outline-none focus:ring-2 focus:ring-pastel-pink"
              />
            </div>
          </div>

          <div>
            <label htmlFor="modal-project-role" className="block text-xs font-bold text-pastel-dark mb-1">Role & Contributions</label>
            <input
              id="modal-project-role"
              type="text"
              required
              placeholder="e.g. Lead Developer & 3D Character Artist"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-1.5 text-xs bg-white border-2 border-pastel-dark rounded-full focus:outline-none focus:ring-2 focus:ring-pastel-pink"
            />
          </div>

          <div>
            <label htmlFor="modal-project-tech" className="block text-xs font-bold text-pastel-dark mb-1">Technologies (comma-separated)</label>
            <input
              id="modal-project-tech"
              type="text"
              required
              placeholder="Unreal Engine 5, C++, Blender, Substance Painter"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              className="w-full px-3 py-1.5 text-xs bg-white border-2 border-pastel-dark rounded-full focus:outline-none focus:ring-2 focus:ring-pastel-pink"
            />
          </div>

          <div>
            <label htmlFor="modal-project-desc" className="block text-xs font-bold text-pastel-dark mb-1">Full Description</label>
            <textarea
              id="modal-project-desc"
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 text-xs bg-white border-2 border-pastel-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-pink resize-none"
            />
          </div>

          {/* Links Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label htmlFor="modal-project-demo" className="block text-[11px] font-bold text-pastel-dark mb-0.5">Demo URL</label>
              <input
                id="modal-project-demo"
                type="url"
                placeholder="https://..."
                value={formData.demo_url}
                onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                className="w-full px-2.5 py-1 text-xs bg-white border border-pastel-dark rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="modal-project-github" className="block text-[11px] font-bold text-pastel-dark mb-0.5">GitHub URL</label>
              <input
                id="modal-project-github"
                type="url"
                placeholder="https://github.com/..."
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                className="w-full px-2.5 py-1 text-xs bg-white border border-pastel-dark rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="modal-project-video" className="block text-[11px] font-bold text-pastel-dark mb-0.5">Video URL</label>
              <input
                id="modal-project-video"
                type="url"
                placeholder="https://youtube.com/..."
                value={formData.video_url}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                className="w-full px-2.5 py-1 text-xs bg-white border border-pastel-dark rounded-lg"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex items-center gap-6 pt-1 text-xs font-bold text-pastel-dark">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-4 h-4 rounded border-2 border-pastel-dark text-pastel-pink"
              />
              <span>Feature on Top</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="w-4 h-4 rounded border-2 border-pastel-dark text-pastel-mint"
              />
              <span>Published (Public)</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-pastel-dark/15">
            <button
              type="button"
              onClick={onClose}
              className="retro-btn text-xs bg-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="retro-btn retro-btn-primary text-xs"
            >
              {isSaving ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={13} />
                  <span>Save Project</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
