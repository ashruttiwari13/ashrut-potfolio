import { cookies } from 'next/headers';

const ADMIN_SESSION_COOKIE = 'ashrut_admin_session';

export async function verifyAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!sessionToken) return false;

  // The session token is compared against the server-side secret
  const expectedSecret = process.env.ADMIN_SECRET_KEY || 'ashrut-admin-local-2026';
  return sessionToken === expectedSecret;
}

export async function setAdminSession(passcode: string): Promise<boolean> {
  const expectedSecret = process.env.ADMIN_SECRET_KEY || 'ashrut-admin-local-2026';

  if (passcode.trim() !== expectedSecret.trim()) {
    return false;
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, expectedSecret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  return true;
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}
