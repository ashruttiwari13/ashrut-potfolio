import React from 'react';
import { DesktopExperience } from '@/components/desktop/DesktopExperience';
import { getProfile, getSkills, getProjects, getAchievements } from '@/lib/data';

// Dynamic server-rendered with revalidation for high performance & fresh updates
export const revalidate = 60;

export default async function HomePage() {
  const [profile, skills, projects, achievements] = await Promise.all([
    getProfile(),
    getSkills(),
    getProjects(),
    getAchievements(),
  ]);

  return (
    <DesktopExperience
      initialProfile={profile}
      initialSkills={skills}
      initialProjects={projects}
      initialAchievements={achievements}
    />
  );
}
