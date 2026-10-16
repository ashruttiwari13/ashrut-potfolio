'use server';

import { revalidatePath } from 'next/cache';
import { verifyAdminSession, setAdminSession, clearAdminSession } from '@/lib/auth';
import { projectSchema, skillSchema, profileSchema } from '@/lib/validation';
import { createAdminClient } from '@/lib/supabase/admin';
import { Project, Skill, ProfileSettings } from '@/types';

export async function loginAdminAction(passcode: string) {
  const success = await setAdminSession(passcode);
  if (!success) {
    return { success: false, error: 'Invalid administrator passcode' };
  }
  return { success: true };
}

export async function logoutAdminAction() {
  await clearAdminSession();
  revalidatePath('/admin');
  return { success: true };
}

export async function saveProjectAction(data: unknown) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return { success: false, error: 'Unauthorized: Admin session required' };
  }

  const parseResult = projectSchema.safeParse(data);
  if (!parseResult.success) {
    return {
      success: false,
      error: 'Validation failed',
      issues: parseResult.error.flatten().fieldErrors,
    };
  }

  const valid = parseResult.data;
  const adminSupabase = createAdminClient();

  if (adminSupabase) {
    try {
      const { error } = await adminSupabase.from('projects').upsert({
        title: valid.title,
        slug: valid.slug,
        tagline: valid.tagline,
        description: valid.description,
        category: valid.category,
        cover_image: valid.cover_image,
        gallery_images: valid.gallery_images,
        technologies: valid.technologies,
        role: valid.role,
        status: valid.status,
        demo_url: valid.demo_url || null,
        github_url: valid.github_url || null,
        video_url: valid.video_url || null,
        is_featured: valid.is_featured,
        is_published: valid.is_published,
        order_index: valid.order_index,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'slug' });

      if (error) {
        return { success: false, error: error.message };
      }
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Database error' };
    }
  }

  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath(`/projects/${valid.slug}`);
  return { success: true, message: 'Project saved successfully' };
}

export async function deleteProjectAction(slugOrId: string) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return { success: false, error: 'Unauthorized' };
  }

  const adminSupabase = createAdminClient();
  if (adminSupabase) {
    try {
      const { error } = await adminSupabase
        .from('projects')
        .delete()
        .or(`id.eq.${slugOrId},slug.eq.${slugOrId}`);

      if (error) {
        return { success: false, error: error.message };
      }
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Database error' };
    }
  }

  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

export async function saveSkillAction(data: unknown) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return { success: false, error: 'Unauthorized' };
  }

  const parseResult = skillSchema.safeParse(data);
  if (!parseResult.success) {
    return { success: false, error: 'Validation failed' };
  }

  const valid = parseResult.data;
  const adminSupabase = createAdminClient();

  if (adminSupabase) {
    try {
      const { error } = await adminSupabase.from('skills').insert({
        name: valid.name,
        category: valid.category,
        icon_name: valid.icon_name,
        proficiency_level: valid.proficiency_level,
        is_highlight: valid.is_highlight,
        order_index: valid.order_index,
      });

      if (error) return { success: false, error: error.message };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Database error' };
    }
  }

  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true, message: 'Skill added' };
}

export async function deleteSkillAction(id: string) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return { success: false, error: 'Unauthorized' };
  }

  const adminSupabase = createAdminClient();
  if (adminSupabase) {
    try {
      await adminSupabase.from('skills').delete().eq('id', id);
    } catch {
      // ignore
    }
  }

  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

export async function saveProfileAction(data: unknown) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return { success: false, error: 'Unauthorized' };
  }

  const parseResult = profileSchema.safeParse(data);
  if (!parseResult.success) {
    return { success: false, error: 'Validation failed' };
  }

  const valid = parseResult.data;
  const adminSupabase = createAdminClient();

  if (adminSupabase) {
    try {
      const { error } = await adminSupabase.from('profile_settings').upsert({
        full_name: valid.full_name,
        headline: valid.headline,
        bio: valid.bio,
        specialties: valid.specialties,
        location: valid.location,
        freelance_status: valid.freelance_status,
        email: valid.email,
        social_links: valid.social_links,
        resume_url: valid.resume_url,
        updated_at: new Date().toISOString(),
      });

      if (error) return { success: false, error: error.message };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Database error' };
    }
  }

  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true, message: 'Profile updated' };
}

export async function markInquiryReadAction(id: string, isRead: boolean) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) return { success: false, error: 'Unauthorized' };

  const adminSupabase = createAdminClient();
  if (adminSupabase) {
    await adminSupabase.from('contact_inquiries').update({ is_read: isRead }).eq('id', id);
  }

  revalidatePath('/admin');
  return { success: true };
}

export async function deleteInquiryAction(id: string) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) return { success: false, error: 'Unauthorized' };

  const adminSupabase = createAdminClient();
  if (adminSupabase) {
    await adminSupabase.from('contact_inquiries').delete().eq('id', id);
  }

  revalidatePath('/admin');
  return { success: true };
}
