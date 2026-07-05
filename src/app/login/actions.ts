'use server';

import { redirect } from 'next/navigation';
import { createCustomerSession, normalizeEmail, verifyPassword } from '@/lib/customer-auth';
import { requirePrisma } from '@/lib/prisma';

function cleanRedirect(value: FormDataEntryValue | null) {
  const target = typeof value === 'string' ? value : '';
  return target.startsWith('/') && !target.startsWith('//') ? target : '/account';
}

export async function loginAction(formData: FormData) {
  const email = normalizeEmail(String(formData.get('email') || ''));
  const password = String(formData.get('password') || '');
  const redirectTo = cleanRedirect(formData.get('redirect'));

  if (!email || !password) redirect(`/login?error=missing&redirect=${encodeURIComponent(redirectTo)}`);

  const prisma = requirePrisma();
  const customer = await prisma.customer.findUnique({ where: { email } });
  if (!customer || !(await verifyPassword(password, customer.passwordHash))) {
    redirect(`/login?error=invalid&redirect=${encodeURIComponent(redirectTo)}`);
  }

  await createCustomerSession({ id: customer.id, email: customer.email });
  redirect(redirectTo);
}
