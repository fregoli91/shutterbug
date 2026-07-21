import { randomBytes, scrypt as scryptCallback, timingSafeEqual, createHmac, createHash } from 'node:crypto';
import { promisify } from 'node:util';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getPrisma, requirePrisma } from '@/lib/prisma';

const scrypt = promisify(scryptCallback);
const COOKIE_NAME = 'shutterbug_customer';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;
const EMAIL_VERIFICATION_TTL_HOURS = 24;

type SessionPayload = {
  id: string;
  email: string;
};

function getSecret() {
  const secret = process.env.CUSTOMER_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('CUSTOMER_SESSION_SECRET, ADMIN_SESSION_SECRET, or NEXTAUTH_SECRET is required in production.');
  }
  return secret || 'development-only-customer-secret';
}

function sign(value: string) {
  return createHmac('sha256', getSecret()).update(value).digest('hex');
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function hashVerificationToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

function encodePayload(payload: SessionPayload) {
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

function decodePayload(value: string): SessionPayload | null {
  try {
    const parsed = JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as SessionPayload;
    if (!parsed.id || !parsed.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt$${salt}$${derived.toString('hex')}`;
}

export async function verifyPassword(password: string, passwordHash: string) {
  const [scheme, salt, hash] = passwordHash.split('$');
  if (scheme !== 'scrypt' || !salt || !hash) return false;
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return safeEqual(hash, derived.toString('hex'));
}

export async function createCustomerSession(customer: SessionPayload) {
  const expires = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = encodePayload(customer);
  const unsigned = `${payload}.${expires}`;
  const token = `${unsigned}.${sign(unsigned)}`;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_SECONDS
  });
}

export async function clearCustomerSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function readCustomerSessionToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [payload, expires, signature] = parts;
  const unsigned = `${payload}.${expires}`;
  if (!safeEqual(signature, sign(unsigned))) return null;
  if (Number(expires) < Math.floor(Date.now() / 1000)) return null;

  return decodePayload(payload);
}

export async function getCustomerSession() {
  const token = await readCustomerSessionToken();
  if (!token) return null;
  const prisma = getPrisma();
  if (!prisma) return null;
  return prisma.customer.findUnique({
    where: { id: token.id },
    select: { id: true, email: true, name: true, emailVerifiedAt: true, createdAt: true }
  });
}

export async function requireCustomer(redirectTo = '/account') {
  const customer = await getCustomerSession();
  if (!customer) redirect(`/login?redirect=${encodeURIComponent(redirectTo)}`);
  return customer;
}

export async function createCustomerAccount({
  email,
  name,
  password
}: {
  email: string;
  name?: string;
  password: string;
}) {
  const prisma = requirePrisma();
  const normalizedEmail = normalizeEmail(email);
  const passwordHash = await hashPassword(password);
  return prisma.customer.create({
    data: {
      email: normalizedEmail,
      name: name?.trim() || null,
      passwordHash
    }
  });
}

export async function createCustomerEmailVerificationToken(customerId: string) {
  const prisma = requirePrisma();
  const token = randomBytes(32).toString('base64url');
  const tokenHash = hashVerificationToken(token);
  const expiresAt = new Date(Date.now() + EMAIL_VERIFICATION_TTL_HOURS * 60 * 60 * 1000);

  await prisma.customerEmailVerificationToken.create({
    data: {
      customerId,
      tokenHash,
      expiresAt
    }
  });

  return token;
}

export async function verifyCustomerEmailToken(token: string) {
  const prisma = requirePrisma();
  const tokenHash = hashVerificationToken(token);
  const record = await prisma.customerEmailVerificationToken.findUnique({
    where: { tokenHash },
    include: { customer: true }
  });

  if (!record || record.usedAt) return { status: 'invalid' as const };
  if (record.expiresAt.getTime() < Date.now()) return { status: 'expired' as const, email: record.customer.email };

  const verifiedAt = new Date();
  const [, customer] = await prisma.$transaction([
    prisma.customerEmailVerificationToken.updateMany({
      where: { customerId: record.customerId, usedAt: null },
      data: { usedAt: verifiedAt }
    }),
    prisma.customer.update({
      where: { id: record.customerId },
      data: { emailVerifiedAt: verifiedAt }
    })
  ]);

  return { status: 'verified' as const, customer };
}
