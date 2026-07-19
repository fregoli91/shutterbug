import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const COOKIE_NAME = 'shutterbug_admin';
const SESSION_TTL_SECONDS = 60 * 60 * 12;

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.NEXTAUTH_SECRET || 'development-only-admin-secret';
}

function sign(value: string) {
  return createHmac('sha256', getSecret()).update(value).digest('hex');
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function validateAdminCredentials(username: string, password: string) {
  const submittedUsername = username.trim().toLowerCase();
  const expectedUsername = (process.env.ADMIN_EMAIL || process.env.ADMIN_USERNAME || 'admin').trim().toLowerCase();
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedPassword) return false;
  return safeEqual(submittedUsername, expectedUsername) && safeEqual(password, expectedPassword);
}

export async function createAdminSession(username: string) {
  const expires = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `${username}.${expires}`;
  const token = `${payload}.${sign(payload)}`;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_SECONDS
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [username, expires, signature] = parts;
  const payload = `${username}.${expires}`;
  if (!safeEqual(signature, sign(payload))) return null;
  if (Number(expires) < Math.floor(Date.now() / 1000)) return null;

  return { username };
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');
  return session;
}
