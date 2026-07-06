'use server';

import { redirect } from 'next/navigation';
import { createAdminSession, validateAdminCredentials } from '@/lib/admin-auth';

export async function loginAction(formData: FormData) {
  const username = String(formData.get('username') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');

  if (!validateAdminCredentials(username, password)) {
    redirect('/admin/login?error=invalid');
  }

  await createAdminSession(username);
  redirect('/admin');
}
