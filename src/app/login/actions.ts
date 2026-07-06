'use server';

import { redirect } from 'next/navigation';
import { createAdminSession, validateAdminCredentials } from '@/lib/admin-auth';
import { createCustomerSession, normalizeEmail, verifyPassword } from '@/lib/customer-auth';
import { getPrisma } from '@/lib/prisma';

function cleanRedirect(value: FormDataEntryValue | null) {
  const target = typeof value === 'string' ? value : '';
  return target.startsWith('/') && !target.startsWith('//') ? target : '/account';
}

export async function loginAction(formData: FormData) {
  const email = normalizeEmail(String(formData.get('email') || ''));
  const password = String(formData.get('password') || '');
  const redirectTo = cleanRedirect(formData.get('redirect'));

  if (!email || !password) redirect(`/login?error=missing&redirect=${encodeURIComponent(redirectTo)}`);

  if (validateAdminCredentials(email, password)) {
    await createAdminSession(email);
    redirect('/admin');
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
