'use server';

import { redirect } from 'next/navigation';
import { clearCustomerSession } from '@/lib/customer-auth';

export async function logoutAction() {
  await clearCustomerSession();
  redirect('/login?status=logged-out');
}
