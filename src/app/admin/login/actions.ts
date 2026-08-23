'use server';

import { redirect } from 'next/navigation';
import { createAdminSession, validateAdminCredentials } from '@/lib/admin-auth';
import { consumeRateLimit } from '@/lib/rate-limit';
import { requestClientIdentifier } from '@/lib/request-context';

export async function loginAction(formData: FormData) {
  const username = String(formData.get('username') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');

  const rateLimit = consumeRateLimit({
    scope: 'admin-login',
    identifier: `${await requestClientIdentifier()}:${username}`,
    limit: 6,
    windowMs: 15 * 60 * 1000
  });
  if (!rateLimit.allowed) redirect('/admin/login?error=rate-limit');

  if (!validateAdminCredentials(username, password)) {
    redirect('/admin/login?error=invalid');
  }

  await createAdminSession(username);
  redirect('/admin');
}
