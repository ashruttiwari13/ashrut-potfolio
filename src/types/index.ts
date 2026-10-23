export type ProjectCategory = 'game-dev' | '3d-art' | 'character-design' | 'cinematography' | 'other';

export interface Project {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  category: ProjectCategory;
  secondary_categories?: ProjectCategory[];
  cover_image: string;
  gallery_images: string[];
  technologies: string[];
  role: string;
  status: string;
  demo_url?: string | null;
  github_url?: string | null;
  video_url?: string | null;
  sketchfab_url?: string | null;
  model_embed_url?: string | null;
  triangles_count?: string;
  vertices_count?: string;
  is_featured: boolean;
  is_published: boolean;
  order_index: number;
  created_at: string;
  updated_at?: string;
}

export type SkillCategory = 'engine' | '3d' | 'programming' | 'cinematography' | 'tools';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  icon_name: string;
  proficiency_level: string;
  is_highlight: boolean;
  order_index: number;
  created_at?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  event_or_source: string;
  icon_name: string;
  date_label?: string;
  order_index: number;
}

export interface ProfileSettings {
  id: string;
  full_name: string;
  headline: string;
  bio: string;
  avatar_url?: string;
  avatar_real_url?: string;
  specialties: string[];
  location: string;
  freelance_status: string;
  email: string;
  social_links: {
    github?: string;
    linkedin?: string;
    artstation?: string;
    youtube?: string;
    twitter?: string;
    [key: string]: string | undefined;
  };
  resume_url: string;
  updated_at?: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  project_type: string;
  budget_range?: string;
  timeline?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export type WindowId = 
  | 'profileWin'
  | 'skillsWin'
  | 'projectsWin'
  | 'achievementsWin'
  | 'hobbiesWin'
  | 'gameWin'
  | 'resumeWin'
  | 'contactWin';

export interface WindowState {
  id: WindowId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size?: { width: number; height?: number };
}
