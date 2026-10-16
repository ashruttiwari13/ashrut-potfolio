import React from 'react';
import { redirect } from 'next/navigation';
import { verifyAdminSession } from '@/lib/auth';
import { getProjects, getSkills, getProfile } from '@/lib/data';
import { createAdminClient, isSupabaseAdminConfigured } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { isResendConfigured } from '@/lib/email';
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient';
import { ContactInquiry } from '@/types';

export default async function AdminPage() {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    redirect('/admin/login');
  }

  const [projects, skills, profile] = await Promise.all([
    getProjects(),
    getSkills(),
    getProfile(),
  ]);

  let inquiries: ContactInquiry[] = [];
  const adminSupabase = createAdminClient();

  if (adminSupabase) {
    try {
      const { data } = await adminSupabase
        .from('contact_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        inquiries = data as ContactInquiry[];
      }
    } catch {
      // ignore
    }
  }

  return (
    <div className="min-h-screen bg-pastel-bg text-pastel-dark p-4 sm:p-8 select-text">
      <div className="max-w-6xl mx-auto">
        <AdminDashboardClient
          initialProjects={projects}
          initialSkills={skills}
          initialProfile={profile}
          initialInquiries={inquiries}
          isSupabaseConfigured={isSupabaseConfigured}
          isResendConfigured={isResendConfigured}
        />
      </div>
    </div>
  );
}
