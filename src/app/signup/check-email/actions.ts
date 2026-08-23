'use server';

import { redirect } from 'next/navigation';
import { createCustomerEmailVerificationToken, isValidEmailAddress, normalizeEmail } from '@/lib/customer-auth';
import { getPublicSiteUrl, sendCustomerVerificationEmail } from '@/lib/email';
import { getPrisma } from '@/lib/prisma';
import { consumeRateLimit } from '@/lib/rate-limit';
import { requestClientIdentifier } from '@/lib/request-context';
import { cleanInternalRedirect } from '@/lib/security';

export async function resendVerificationAction(formData: FormData) {
  const email = normalizeEmail(String(formData.get('email') || ''));
  const redirectTo = cleanInternalRedirect(formData.get('redirect'), '/account');
  const rateLimit = consumeRateLimit({
    scope: 'customer-verification-resend',
    identifier: `${await requestClientIdentifier()}:${email || 'unknown'}`,
    limit: 3,
    windowMs: 60 * 60 * 1000
  });

  if (!rateLimit.allowed) {
    redirect(
      `/signup/check-email?email=${encodeURIComponent(email)}&status=rate-limited&redirect=${encodeURIComponent(redirectTo)}`
    );
  }
  if (!email || !isValidEmailAddress(email)) {
    redirect(`/signup?error=email&redirect=${encodeURIComponent(redirectTo)}`);
  }

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
        baseUrl: getPublicSiteUrl()
      });
      status = result.sent ? 'resent' : 'dev-email';
    } catch {
      status = 'email-error';
    }
  }

  redirect(
    `/signup/check-email?email=${encodeURIComponent(email)}&status=${status}&redirect=${encodeURIComponent(redirectTo)}`
  );
}
