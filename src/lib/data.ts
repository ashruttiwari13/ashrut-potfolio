import { Project, Skill, ProfileSettings, Achievement } from '@/types';
import { initialProfile, initialProjects, initialSkills, initialAchievements } from './mock-data';
import { createClient } from './supabase/client';

export async function getProfile(): Promise<ProfileSettings> {
  const supabase = createClient();
  if (!supabase) return initialProfile;

  try {
    const { data, error } = await supabase
      .from('profile_settings')
      .select('*')
      .limit(1)
      .single();

    if (error || !data) {
      return initialProfile;
    }
    return data as ProfileSettings;
  } catch {
    return initialProfile;
  }
}

export async function getSkills(): Promise<Skill[]> {
  const supabase = createClient();
  if (!supabase) return initialSkills;

  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('order_index', { ascending: true });

    if (error || !data || data.length === 0) {
      return initialSkills;
    }
    return data as Skill[];
  } catch {
    return initialSkills;
  }
}

export async function getProjects(): Promise<Project[]> {
  const supabase = createClient();
  if (!supabase) return initialProjects;

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_published', true)
      .order('order_index', { ascending: true });

    if (error || !data || data.length === 0) {
      return initialProjects;
    }
    return data as Project[];
  } catch {
    return initialProjects;
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = createClient();
  if (!supabase) {
    return initialProjects.find((p) => p.slug === slug) || null;
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return initialProjects.find((p) => p.slug === slug) || null;
    }
    return data as Project;
  } catch {
    return initialProjects.find((p) => p.slug === slug) || null;
  }
}

export async function getAchievements(): Promise<Achievement[]> {
  const supabase = createClient();
  if (!supabase) return initialAchievements;

  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('order_index', { ascending: true });

    if (error || !data || data.length === 0) {
      return initialAchievements;
    }
    return data as Achievement[];
  } catch {
    return initialAchievements;
  }
}
