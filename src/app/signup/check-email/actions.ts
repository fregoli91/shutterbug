'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createCustomerEmailVerificationToken, normalizeEmail } from '@/lib/customer-auth';
import { getPublicSiteUrl, sendCustomerVerificationEmail } from '@/lib/email';
import { getPrisma } from '@/lib/prisma';

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

export async function resendVerificationAction(formData: FormData) {
  const email = normalizeEmail(String(formData.get('email') || ''));
  const redirectTo = cleanRedirect(formData.get('redirect'));

  if (!email) redirect(`/signup?error=missing&redirect=${encodeURIComponent(redirectTo)}`);

  const prisma = getPrisma();
  if (!prisma) redirect(`/signup?error=config&redirect=${encodeURIComponent(redirectTo)}`);

  const customer = await prisma.customer.findUnique({ where: { email } });
  let status = 'resent';

  if (customer && !customer.emailVerifiedAt) {
    const token = await createCustomerEmailVerificationToken(customer.id);
    try {
      const result = await sendCustomerVerificationEmail({
        email: customer.email,
        name: customer.name,
        token,
        baseUrl: await getRequestBaseUrl()
      });
      status = result.sent ? 'resent' : 'dev-email';
    } catch {
      status = 'email-error';
    }
  }

  redirect(`/signup/check-email?email=${encodeURIComponent(email)}&status=${status}&redirect=${encodeURIComponent(redirectTo)}`);
}
