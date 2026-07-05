'use server';

import { redirect } from 'next/navigation';
import { Prisma } from '@/generated/prisma/client';
import { createCustomerAccount, createCustomerSession, normalizeEmail } from '@/lib/customer-auth';

function cleanRedirect(value: FormDataEntryValue | null) {
  const target = typeof value === 'string' ? value : '';
  return target.startsWith('/') && !target.startsWith('//') ? target : '/account';
}

export async function signupAction(formData: FormData) {
  const email = normalizeEmail(String(formData.get('email') || ''));
  const name = String(formData.get('name') || '');
  const password = String(formData.get('password') || '');
  const redirectTo = cleanRedirect(formData.get('redirect'));

  if (!email || !password) redirect(`/signup?error=missing&redirect=${encodeURIComponent(redirectTo)}`);
  if (password.length < 8) redirect(`/signup?error=password&redirect=${encodeURIComponent(redirectTo)}`);

  try {
    const customer = await createCustomerAccount({ email, name, password });
    await createCustomerSession({ id: customer.id, email: customer.email });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      redirect(`/signup?error=exists&redirect=${encodeURIComponent(redirectTo)}`);
    }
    throw error;
  }

  redirect(redirectTo);
}
