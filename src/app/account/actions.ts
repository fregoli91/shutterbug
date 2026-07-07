'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  clearCustomerSession,
  hashPassword,
  normalizeEmail,
  requireCustomer,
  verifyPassword
} from '@/lib/customer-auth';
import { validateCustomerPassword } from '@/lib/password-policy';
import { requirePrisma } from '@/lib/prisma';

function cleanString(value: FormDataEntryValue | null) {
  return String(value ?? '').trim();
}

export async function logoutAction() {
  await clearCustomerSession();
  redirect('/login?status=logged-out');
}

export async function updateProfileAction(formData: FormData) {
  const customer = await requireCustomer('/account/settings');
  const name = cleanString(formData.get('name'));

  if (name.length > 80) {
    redirect('/account/settings?error=name-too-long');
  }

  const prisma = requirePrisma();
  await prisma.customer.update({
    where: { id: customer.id },
    data: { name: name || null }
  });

  revalidatePath('/account');
  revalidatePath('/account/settings');
  redirect('/account/settings?status=profile-updated');
}

export async function changePasswordAction(formData: FormData) {
  const customer = await requireCustomer('/account/settings');
  const currentPassword = String(formData.get('currentPassword') ?? '');
  const newPassword = String(formData.get('newPassword') ?? '');
  const confirmPassword = String(formData.get('confirmPassword') ?? '');

  if (!currentPassword || !newPassword || !confirmPassword) {
    redirect('/account/settings?error=password-missing');
  }

  if (newPassword !== confirmPassword) {
    redirect('/account/settings?error=password-mismatch');
  }

  const passwordCheck = validateCustomerPassword({
    password: newPassword,
    email: normalizeEmail(customer.email),
    name: customer.name ?? undefined
  });

  if (!passwordCheck.valid) {
    redirect(`/account/settings?error=password-${passwordCheck.code ?? 'invalid'}`);
  }

  const prisma = requirePrisma();
  const record = await prisma.customer.findUnique({
    where: { id: customer.id },
    select: { passwordHash: true }
  });

  if (!record || !(await verifyPassword(currentPassword, record.passwordHash))) {
    redirect('/account/settings?error=current-password');
  }

  await prisma.customer.update({
    where: { id: customer.id },
    data: { passwordHash: await hashPassword(newPassword) }
  });

  redirect('/account/settings?status=password-updated');
}
