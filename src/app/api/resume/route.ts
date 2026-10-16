import { NextResponse } from 'next/server';
import { getProfile } from '@/lib/data';

export async function GET() {
  const profile = await getProfile();

  // If a custom resume URL is set in profile settings, redirect to it
  if (profile.resume_url && profile.resume_url.startsWith('http')) {
    return NextResponse.redirect(profile.resume_url);
  }

  // Return download of the local PDF
  return NextResponse.redirect(new URL('/resume-ashrut-tiwari.pdf', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
}
