'use server';

import { redirect } from 'next/navigation';
import { Prisma } from '@/generated/prisma/client';
import {
  createCustomerAccount,
  createCustomerEmailVerificationToken,
  isValidEmailAddress,
  normalizeEmail
} from '@/lib/customer-auth';
import { getPublicSiteUrl, sendCustomerVerificationEmail } from '@/lib/email';
import { getPrisma } from '@/lib/prisma';
import { validateCustomerPassword } from '@/lib/password-policy';
import { consumeRateLimit } from '@/lib/rate-limit';
import { requestClientIdentifier } from '@/lib/request-context';
import { cleanInternalRedirect } from '@/lib/security';

function redirectToCheckEmail(email: string, status: string, redirectTo: string): never {
  redirect(
    `/signup/check-email?email=${encodeURIComponent(email)}&status=${status}&redirect=${encodeURIComponent(redirectTo)}`
  );
}

export async function signupAction(formData: FormData) {
  const email = normalizeEmail(String(formData.get('email') || ''));
  const name = String(formData.get('name') || '').trim().slice(0, 120);
  const password = String(formData.get('password') || '');
  const confirmPassword = String(formData.get('confirmPassword') || '');
  const redirectTo = cleanInternalRedirect(formData.get('redirect'), '/account');
  const rateLimit = consumeRateLimit({
    scope: 'customer-signup',
    identifier: `${await requestClientIdentifier()}:${email || 'unknown'}`,
    limit: 5,
    windowMs: 60 * 60 * 1000
  });

  if (!rateLimit.allowed) redirect(`/signup?error=rate-limited&redirect=${encodeURIComponent(redirectTo)}`);
  if (!email || !password) redirect(`/signup?error=missing&redirect=${encodeURIComponent(redirectTo)}`);
  if (!isValidEmailAddress(email)) redirect(`/signup?error=email&redirect=${encodeURIComponent(redirectTo)}`);
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
      const prisma = getPrisma();
      const existingCustomer = prisma
        ? await prisma.customer.findUnique({ where: { email }, select: { email: true, emailVerifiedAt: true } })
        : null;
      if (existingCustomer && !existingCustomer.emailVerifiedAt) {
        redirectToCheckEmail(existingCustomer.email, 'unverified', redirectTo);
      }
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
      baseUrl: getPublicSiteUrl()
    });
    status = emailResult.sent ? 'sent' : 'dev-email';
  } catch {
    status = 'email-error';
  }

  redirectToCheckEmail(customer.email, status, redirectTo);
}
