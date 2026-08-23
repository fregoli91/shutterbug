'use server';

import { redirect } from 'next/navigation';
import { createCustomerSession, normalizeEmail, verifyPassword } from '@/lib/customer-auth';
import { consumeRateLimit } from '@/lib/rate-limit';
import { requestClientIdentifier } from '@/lib/request-context';
import { cleanInternalRedirect } from '@/lib/security';
import { getPrisma } from '@/lib/prisma';


export async function loginAction(formData: FormData) {
  const email = normalizeEmail(String(formData.get('email') || ''));
  const password = String(formData.get('password') || '');
  const redirectTo = cleanInternalRedirect(formData.get('redirect'), '/account');

  const rateLimit = consumeRateLimit({
    scope: 'customer-login',
    identifier: `${await requestClientIdentifier()}:${email}`,
    limit: 10,
    windowMs: 15 * 60 * 1000
  });
  if (!rateLimit.allowed) redirect(`/login?error=rate-limit&redirect=${encodeURIComponent(redirectTo)}`);

  if (!email || !password) redirect(`/login?error=missing&redirect=${encodeURIComponent(redirectTo)}`);
  if (email.length > 254 || password.length > 128) {
    redirect(`/login?error=invalid&redirect=${encodeURIComponent(redirectTo)}`);
  }


  const prisma = getPrisma();
  if (!prisma) redirect(`/login?error=config&redirect=${encodeURIComponent(redirectTo)}`);

  const customer = await prisma.customer.findUnique({ where: { email } });
  if (!customer || !(await verifyPassword(password, customer.passwordHash))) {
    redirect(`/login?error=invalid&redirect=${encodeURIComponent(redirectTo)}`);
  }

  if (!customer.emailVerifiedAt) {
    redirect(
      `/signup/check-email?email=${encodeURIComponent(customer.email)}&status=unverified&redirect=${encodeURIComponent(redirectTo)}`
    );
  }

  await createCustomerSession({ id: customer.id, email: customer.email });
  redirect(redirectTo);
}
