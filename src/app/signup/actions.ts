'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { Prisma } from '@/generated/prisma/client';
import { createCustomerAccount, createCustomerEmailVerificationToken, normalizeEmail } from '@/lib/customer-auth';
import { getPublicSiteUrl, sendCustomerVerificationEmail } from '@/lib/email';
import { validateCustomerPassword } from '@/lib/password-policy';

function cleanRedirect(value: FormDataEntryValue | null) {
  const target = typeof value === 'string' ? value : '';
  return target.startsWith('/') && !target.startsWith('//') ? target : '/account';
}

async function getRequestBaseUrl() {
  const headerStore = await headers();
  const host = headerStore.get('x-forwarded-host') || headerStore.get('host');
  if (!host) return getPublicSiteUrl();
  const protocol =
    headerStore.get('x-forwarded-proto') || (host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https');
  return `${protocol}://${host}`;
}

export async function signupAction(formData: FormData) {
  const email = normalizeEmail(String(formData.get('email') || ''));
  const name = String(formData.get('name') || '');
  const password = String(formData.get('password') || '');
  const confirmPassword = String(formData.get('confirmPassword') || '');
  const redirectTo = cleanRedirect(formData.get('redirect'));

  if (!email || !password) redirect(`/signup?error=missing&redirect=${encodeURIComponent(redirectTo)}`);
  if (password !== confirmPassword) redirect(`/signup?error=mismatch&redirect=${encodeURIComponent(redirectTo)}`);

  const passwordCheck = validateCustomerPassword({ password, email, name });
  if (!passwordCheck.valid) {
    redirect(
      `/signup?error=password&reason=${encodeURIComponent(passwordCheck.code ?? 'invalid')}&redirect=${encodeURIComponent(redirectTo)}`
    );
  }

  let customer;
  try {
    customer = await createCustomerAccount({ email, name, password });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      redirect(`/signup?error=exists&redirect=${encodeURIComponent(redirectTo)}`);
    }
    if (error instanceof Error && error.message.includes('DATABASE_URL')) {
      redirect(`/signup?error=config&redirect=${encodeURIComponent(redirectTo)}`);
    }
    throw error;
  }

  const token = await createCustomerEmailVerificationToken(customer.id);
  let status = 'sent';
  try {
    const emailResult = await sendCustomerVerificationEmail({
      email: customer.email,
      name: customer.name,
      token,
      baseUrl: await getRequestBaseUrl()
    });
    status = emailResult.sent ? 'sent' : 'dev-email';
  } catch {
    status = 'email-error';
  }

  redirect(
    `/signup/check-email?email=${encodeURIComponent(customer.email)}&status=${status}&redirect=${encodeURIComponent(redirectTo)}`
  );
}
