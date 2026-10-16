'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Project, 
  Skill, 
  ProfileSettings, 
  ContactInquiry,
  SkillCategory
} from '@/types';
import { 
  Gamepad2, 
  Wrench, 
  User, 
  Mail, 
  LogOut, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  Database,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye
} from 'lucide-react';
import { 
  logoutAdminAction, 
  deleteProjectAction, 
  deleteSkillAction, 
  saveSkillAction,
  saveProfileAction,
  markInquiryReadAction,
  deleteInquiryAction
} from '@/app/admin/actions';
import { ProjectFormModal } from './ProjectFormModal';

interface AdminDashboardClientProps {
  initialProjects: Project[];
  initialSkills: Skill[];
  initialProfile: ProfileSettings;
  initialInquiries: ContactInquiry[];
  isSupabaseConfigured: boolean;
  isResendConfigured: boolean;
}

export const AdminDashboardClient: React.FC<AdminDashboardClientProps> = ({
  initialProjects,
  initialSkills,
  initialProfile,
  initialInquiries,
  isSupabaseConfigured,
  isResendConfigured,
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'projects' | 'skills' | 'profile' | 'inquiries' | 'config'>('projects');

  // Projects state
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Skills state
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: 'engine' as SkillCategory,
    icon_name: 'Wrench',
    proficiency_level: 'Advanced',
    is_highlight: true,
  });

  // Profile state
  const [profile, setProfile] = useState<ProfileSettings>(initialProfile);
  const [profileStatus, setProfileStatus] = useState<string | null>(null);

  // Inquiries state
  const [inquiries, setInquiries] = useState<ContactInquiry[]>(initialInquiries);
  const [inspectInquiry, setInspectInquiry] = useState<ContactInquiry | null>(null);

  const handleLogout = async () => {
    await logoutAdminAction();
    router.push('/admin/login');
    router.refresh();
  };

  const handleDeleteProject = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    await deleteProjectAction(id);
    setProjects(projects.filter((p) => p.id !== id && p.slug !== id));
    router.refresh();
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.name.trim()) return;

    await saveSkillAction({
      ...newSkill,
      order_index: skills.length + 1,
    });

    setSkills([
      ...skills,
      {
        id: `skill-${Date.now()}`,
        ...newSkill,
        order_index: skills.length + 1,
      },
    ]);
    setNewSkill({
      name: '',
      category: 'engine',
      icon_name: 'Wrench',
      proficiency_level: 'Advanced',
      is_highlight: true,
    });
    router.refresh();
  };

  const handleDeleteSkill = async (id: string) => {
    await deleteSkillAction(id);
    setSkills(skills.filter((s) => s.id !== id));
    router.refresh();
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileStatus('Saving...');
    const res = await saveProfileAction(profile);
    if (res.success) {
      setProfileStatus('Profile updated successfully!');
      setTimeout(() => setProfileStatus(null), 3000);
      router.refresh();
    } else {
      setProfileStatus(res.error || 'Failed to update profile');
    }
  };

  const handleToggleInquiryRead = async (id: string, current: boolean) => {
    await markInquiryReadAction(id, !current);
    setInquiries(
      inquiries.map((inq) => (inq.id === id ? { ...inq, is_read: !current } : inq))
    );
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Delete this inquiry?')) return;
    await deleteInquiryAction(id);
    setInquiries(inquiries.filter((inq) => inq.id !== id));
    if (inspectInquiry?.id === id) setInspectInquiry(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <header className="retro-window p-4 bg-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pastel-pink border-2 border-pastel-dark flex items-center justify-center font-bold text-lg">
            ⚡
          </div>
          <div>
            <h1 className="font-extrabold text-base sm:text-lg text-pastel-dark">
              Ashrut Tiwari · Admin Control Center
            </h1>
            <p className="text-xs text-pastel-soft">
              Manage portfolio projects, skills, contact inbox, and site settings
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="retro-btn text-xs bg-white hover:bg-pastel-peach"
          >
            <ExternalLink size={12} />
            <span>View Desktop</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="retro-btn text-xs bg-rose-100 hover:bg-rose-200 text-rose-800"
          >
            <LogOut size={12} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Tabs Row */}
      <div className="flex flex-wrap gap-2 border-b-2 border-pastel-dark/20 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('projects')}
          className={`retro-btn text-xs px-3.5 py-1.5 ${
            activeTab === 'projects' ? 'bg-pastel-peach shadow-[2px_2px_0_#3d3d3d]' : 'bg-white'
          }`}
        >
          <Gamepad2 size={14} />
          <span>Projects ({projects.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('skills')}
          className={`retro-btn text-xs px-3.5 py-1.5 ${
            activeTab === 'skills' ? 'bg-pastel-mint shadow-[2px_2px_0_#3d3d3d]' : 'bg-white'
          }`}
        >
          <Wrench size={14} />
          <span>Skills ({skills.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`retro-btn text-xs px-3.5 py-1.5 ${
            activeTab === 'profile' ? 'bg-pastel-pink shadow-[2px_2px_0_#3d3d3d]' : 'bg-white'
          }`}
        >
          <User size={14} />
          <span>Profile & Bio</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('inquiries')}
          className={`retro-btn text-xs px-3.5 py-1.5 relative ${
            activeTab === 'inquiries' ? 'bg-pastel-lavender shadow-[2px_2px_0_#3d3d3d]' : 'bg-white'
          }`}
        >
          <Mail size={14} />
          <span>Inquiries ({inquiries.length})</span>
          {inquiries.some((i) => !i.is_read) && (
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute -top-1 -right-1 animate-ping" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('config')}
          className={`retro-btn text-xs px-3.5 py-1.5 ml-auto ${
            activeTab === 'config' ? 'bg-pastel-yellow shadow-[2px_2px_0_#3d3d3d]' : 'bg-white'
          }`}
        >
          <ShieldCheck size={14} />
          <span>System Status</span>
        </button>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* 1. PROJECTS TAB */}
      {/* ---------------------------------------------------------------------- */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-pastel-dark uppercase tracking-wider">
              Project Portfolio Catalog
            </h2>
            <button
              type="button"
              onClick={() => {
                setSelectedProject(null);
                setIsModalOpen(true);
              }}
              className="retro-btn retro-btn-mint text-xs"
            >
              <Plus size={13} strokeWidth={2.5} />
              <span>Add New Project</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {projects.map((p) => (
              <div
                key={p.id}
                className="retro-card bg-white p-3.5 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-pastel-warm border border-pastel-dark/30 text-pastel-soft">
                      {p.category}
                    </span>
                    {p.is_featured && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pastel-yellow border border-pastel-dark">
                        ⭐ Featured
                      </span>
                    )}
                  </div>
                  <h3 className="font-extrabold text-sm text-pastel-dark mt-1.5">
                    {p.title}
                  </h3>
                  <p className="text-xs text-pastel-soft line-clamp-2 mt-0.5">
                    {p.tagline}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-pastel-dark/15 text-xs">
                  <span className="text-[11px] font-semibold text-pastel-dark">
                    Status: <strong>{p.status}</strong>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProject(p);
                        setIsModalOpen(true);
                      }}
                      className="p-1 rounded-md border border-pastel-dark bg-white hover:bg-pastel-peach"
                      title="Edit Project"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProject(p.id, p.title)}
                      className="p-1 rounded-md border border-pastel-dark bg-white hover:bg-rose-100 text-rose-700"
                      title="Delete Project"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <ProjectFormModal
            project={selectedProject}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => {
              router.refresh();
            }}
          />
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* 2. SKILLS TAB */}
      {/* ---------------------------------------------------------------------- */}
      {activeTab === 'skills' && (
        <div className="space-y-4">
          {/* Add Skill Form */}
          <form
            onSubmit={handleAddSkill}
            className="retro-window p-4 bg-white flex flex-wrap items-end gap-3"
          >
            <div className="flex-1 min-w-[160px]">
              <label htmlFor="skill-name-input" className="block text-xs font-bold text-pastel-dark mb-1">
                Skill / Tool Name
              </label>
              <input
                id="skill-name-input"
                type="text"
                required
                placeholder="e.g. Maya, Houdini, FMOD"
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-white border-2 border-pastel-dark rounded-full"
              />
            </div>

            <div className="min-w-[140px]">
              <label htmlFor="skill-category-select" className="block text-xs font-bold text-pastel-dark mb-1">Category</label>
              <select
                id="skill-category-select"
                value={newSkill.category}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, category: e.target.value as SkillCategory })
                }
                className="w-full px-3 py-1.5 text-xs bg-white border-2 border-pastel-dark rounded-full"
              >
                <option value="engine">Engine</option>
                <option value="3d">3D & Sculpting</option>
                <option value="programming">Programming</option>
                <option value="cinematography">Cinematography</option>
                <option value="tools">Tools & VFX</option>
              </select>
            </div>

            <div className="flex-1 min-w-[160px]">
              <label htmlFor="skill-proficiency-input" className="block text-xs font-bold text-pastel-dark mb-1">Proficiency</label>
              <input
                id="skill-proficiency-input"
                type="text"
                placeholder="e.g. Advanced (Rigging, Simulation)"
                value={newSkill.proficiency_level}
                onChange={(e) => setNewSkill({ ...newSkill, proficiency_level: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-white border-2 border-pastel-dark rounded-full"
              />
            </div>

            <button
              type="submit"
              className="retro-btn retro-btn-mint text-xs px-4 py-2"
            >
              <Plus size={13} />
              <span>Add Skill</span>
            </button>
          </form>

          {/* Existing Skills Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {skills.map((s) => (
              <div
                key={s.id}
                className="retro-card flex items-center justify-between p-3 bg-white"
              >
                <div>
                  <h4 className="font-extrabold text-sm text-pastel-dark">{s.name}</h4>
                  <span className="text-[11px] font-semibold text-pastel-soft">
                    {s.proficiency_level}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteSkill(s.id)}
                  className="p-1 rounded-md border border-pastel-dark bg-white hover:bg-rose-100 text-rose-700"
                  title="Remove Skill"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* 3. PROFILE & BIO TAB */}
      {/* ---------------------------------------------------------------------- */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="retro-window p-5 bg-[#fffcf3] space-y-4 max-w-2xl">
          {profileStatus && (
            <div className="p-2.5 bg-pastel-mint border border-pastel-dark rounded-xl text-xs font-bold text-pastel-dark">
              {profileStatus}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="profile-fullname-input" className="block text-xs font-bold text-pastel-dark mb-1">Full Name</label>
              <input
                id="profile-fullname-input"
                type="text"
                required
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-white border-2 border-pastel-dark rounded-full"
              />
            </div>

            <div>
              <label htmlFor="profile-email-input" className="block text-xs font-bold text-pastel-dark mb-1">Public Email</label>
              <input
                id="profile-email-input"
                type="email"
                required
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-white border-2 border-pastel-dark rounded-full"
              />
            </div>
          </div>

          <div>
            <label htmlFor="profile-headline-input" className="block text-xs font-bold text-pastel-dark mb-1">Professional Headline</label>
            <input
              id="profile-headline-input"
              type="text"
              required
              value={profile.headline}
              onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
              className="w-full px-3 py-1.5 text-xs bg-white border-2 border-pastel-dark rounded-full"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="profile-location-input" className="block text-xs font-bold text-pastel-dark mb-1">Location</label>
              <input
                id="profile-location-input"
                type="text"
                required
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-white border-2 border-pastel-dark rounded-full"
              />
            </div>

            <div>
              <label htmlFor="profile-status-input" className="block text-xs font-bold text-pastel-dark mb-1">Freelance Availability</label>
              <input
                id="profile-status-input"
                type="text"
                required
                value={profile.freelance_status}
                onChange={(e) => setProfile({ ...profile, freelance_status: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-white border-2 border-pastel-dark rounded-full"
              />
            </div>
          </div>

          <div>
            <label htmlFor="profile-bio-input" className="block text-xs font-bold text-pastel-dark mb-1">Biography / About</label>
            <textarea
              id="profile-bio-input"
              rows={4}
              required
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full p-2.5 text-xs bg-white border-2 border-pastel-dark rounded-xl resize-none"
            />
          </div>

          <div>
            <label htmlFor="profile-resume-url-input" className="block text-xs font-bold text-pastel-dark mb-1">Resume File Path / Download URL</label>
            <input
              id="profile-resume-url-input"
              type="text"
              required
              value={profile.resume_url}
              onChange={(e) => setProfile({ ...profile, resume_url: e.target.value })}
              className="w-full px-3 py-1.5 text-xs bg-white border-2 border-pastel-dark rounded-full"
            />
          </div>

          <button
            type="submit"
            className="retro-btn retro-btn-primary text-xs px-5 py-2"
          >
            <Check size={13} strokeWidth={2.5} />
            <span>Save Profile Updates</span>
          </button>
        </form>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* 4. INQUIRIES INBOX TAB */}
      {/* ---------------------------------------------------------------------- */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-pastel-dark uppercase tracking-wider">
              Client & Freelance Inquiries Inbox
            </h2>
            <span className="text-xs font-bold text-pastel-soft">
              Protected by Server Row Level Security
            </span>
          </div>

          {inquiries.length === 0 ? (
            <div className="p-8 text-center bg-white border-2 border-dashed border-pastel-dark rounded-retro">
              <Mail className="w-10 h-10 mx-auto text-pastel-dark/30 mb-2" />
              <h4 className="font-bold text-sm text-pastel-dark">No inquiries yet</h4>
              <p className="text-xs text-pastel-soft mt-1">
                When visitors submit through your desktop &apos;Hire Me&apos; contact form, messages will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className={`retro-card p-3.5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    !inq.is_read ? 'border-l-8 border-l-pastel-pink' : ''
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-extrabold text-sm text-pastel-dark">
                        {inq.name}
                      </h4>
                      <span className="text-xs text-pastel-soft font-semibold">
                        ({inq.email})
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pastel-mint border border-pastel-dark">
                        {inq.project_type}
                      </span>
                    </div>
                    <p className="text-xs text-pastel-dark line-clamp-1">
                      {inq.message}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-pastel-soft">
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        <span>{new Date(inq.created_at).toLocaleDateString()}</span>
                      </span>
                      {inq.budget_range && <span>Budget: {inq.budget_range}</span>}
                      {inq.timeline && <span>Timeline: {inq.timeline}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setInspectInquiry(inq)}
                      className="retro-btn text-xs bg-pastel-lavender px-2.5 py-1"
                    >
                      <Eye size={12} />
                      <span>Read</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleInquiryRead(inq.id, inq.is_read)}
                      className="retro-btn text-xs bg-white px-2 py-1"
                      title={inq.is_read ? 'Mark Unread' : 'Mark Read'}
                    >
                      {inq.is_read ? 'Unread' : 'Read'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteInquiry(inq.id)}
                      className="p-1.5 rounded-md border border-pastel-dark hover:bg-rose-100 text-rose-700"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Inspect Inquiry Modal */}
          {inspectInquiry && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="retro-window max-w-md w-full bg-[#fffcf3] p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-pastel-dark/20 pb-2">
                  <h3 className="font-extrabold text-sm text-pastel-dark">
                    Inquiry from {inspectInquiry.name}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setInspectInquiry(null)}
                    className="w-6 h-6 rounded-full bg-white border border-pastel-dark flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
                <div className="text-xs space-y-1.5">
                  <p><strong>Email:</strong> <a href={`mailto:${inspectInquiry.email}`} className="text-blue-700 underline">{inspectInquiry.email}</a></p>
                  <p><strong>Category:</strong> {inspectInquiry.project_type}</p>
                  <p><strong>Budget:</strong> {inspectInquiry.budget_range || 'Not specified'}</p>
                  <p><strong>Timeline:</strong> {inspectInquiry.timeline || 'Flexible'}</p>
                  <div className="p-3 bg-white border border-pastel-dark rounded-xl mt-2 whitespace-pre-wrap leading-relaxed">
                    {inspectInquiry.message}
                  </div>
                </div>
                <div className="pt-2 flex justify-end">
                  <a
                    href={`mailto:${inspectInquiry.email}?subject=Re: Freelance Inquiry - ${inspectInquiry.project_type}`}
                    className="retro-btn retro-btn-primary text-xs"
                  >
                    Reply via Email
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* 5. SYSTEM STATUS TAB */}
      {/* ---------------------------------------------------------------------- */}
      {activeTab === 'config' && (
        <div className="space-y-4 max-w-2xl">
          <h2 className="text-sm font-extrabold text-pastel-dark uppercase tracking-wider">
            Infrastructure & Integration Status
          </h2>

          <div className="space-y-3">
            {/* Supabase Status */}
            <div className="retro-card bg-white p-4 flex items-start gap-3">
              <div className={`p-2 rounded-xl border border-pastel-dark shrink-0 ${
                isSupabaseConfigured ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                <Database size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-pastel-dark">
                    Supabase PostgreSQL & Auth
                  </h4>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border border-pastel-dark ${
                    isSupabaseConfigured ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
                  }`}>
                    {isSupabaseConfigured ? 'Connected & Active' : 'Offline / Standalone Fallback'}
                  </span>
                </div>
                <p className="text-xs text-pastel-soft mt-1 leading-relaxed">
                  {isSupabaseConfigured
                    ? 'Your database connection is active with Row Level Security enforced.'
                    : 'Currently operating in standalone demo mode with high-performance local fallbacks. Copy your credentials into .env.local to link your remote Supabase instance.'}
                </p>
              </div>
            </div>

            {/* Resend Email Status */}
            <div className="retro-card bg-white p-4 flex items-start gap-3">
              <div className={`p-2 rounded-xl border border-pastel-dark shrink-0 ${
                isResendConfigured ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                <Mail size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-pastel-dark">
                    Resend Email Delivery
                  </h4>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border border-pastel-dark ${
                    isResendConfigured ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
                  }`}>
                    {isResendConfigured ? 'Configured' : 'Logging Mode Only'}
                  </span>
                </div>
                <p className="text-xs text-pastel-soft mt-1 leading-relaxed">
                  {isResendConfigured
                    ? 'Incoming client inquiries automatically trigger email dispatch to your address.'
                    : 'Set RESEND_API_KEY in .env.local to enable direct mailbox notifications for incoming inquiries.'}
                </p>
              </div>
            </div>

            {/* Security Notice */}
            <div className="p-4 bg-pastel-mint/40 border border-pastel-dark rounded-retro-sm text-xs text-pastel-dark leading-relaxed">
              <strong className="block mb-1 font-bold">🔒 Security Standards Enforced:</strong>
              Public clients are restricted by PostgreSQL Row Level Security (RLS) policies. Only authenticated administrators can inspect inquiries or mutate projects and skills.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
