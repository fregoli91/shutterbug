'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getCustomerSession } from '@/lib/customer-auth';
import { requirePrisma } from '@/lib/prisma';

function cleanRedirect(value: FormDataEntryValue | null) {
  const target = typeof value === 'string' ? value : '';
  return target.startsWith('/') && !target.startsWith('//') ? target : '/account/likes';
}

function revalidateLikeSurfaces(productSlug: string, redirectTo: string) {
  revalidatePath('/account');
  revalidatePath('/account/likes');
  revalidatePath('/shop');
  if (productSlug) revalidatePath(`/shop/${productSlug}`);
  if (redirectTo) revalidatePath(redirectTo);
}

export async function toggleProductLikeAction(formData: FormData) {
  const productId = String(formData.get('productId') ?? '');
  const productSlug = String(formData.get('productSlug') ?? '');
  const redirectTo = cleanRedirect(formData.get('redirectTo'));

  if (!productId) redirect(redirectTo);

  const customer = await getCustomerSession();
  if (!customer) redirect(`/login?redirect=${encodeURIComponent(redirectTo)}`);

  const prisma = requirePrisma();
  const product = await prisma.product.findUnique({ where: { id: productId }, select: { id: true } });
  if (!product) redirect(redirectTo);

  const existing = await prisma.customerProductLike.findUnique({
    where: {
      customerId_productId: {
        customerId: customer.id,
        productId
      }
    }
  });

  if (existing) {
    await prisma.customerProductLike.delete({ where: { id: existing.id } });
  } else {
    await prisma.customerProductLike.create({
      data: {
        customerId: customer.id,
        productId
      }
    });
  }

  revalidateLikeSurfaces(productSlug, redirectTo);
  redirect(redirectTo);
}

export async function removeProductLikeAction(formData: FormData) {
  const productId = String(formData.get('productId') ?? '');
  const productSlug = String(formData.get('productSlug') ?? '');
  const redirectTo = cleanRedirect(formData.get('redirectTo'));

  const customer = await getCustomerSession();
  if (!customer) redirect(`/login?redirect=${encodeURIComponent(redirectTo)}`);
  if (!productId) redirect(redirectTo);

  const prisma = requirePrisma();
  await prisma.customerProductLike.deleteMany({
    where: {
      customerId: customer.id,
      productId
    }
  });

  revalidateLikeSurfaces(productSlug, redirectTo);
  redirect(redirectTo);
}
