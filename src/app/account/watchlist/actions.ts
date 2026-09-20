'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Prisma, ProductStatus } from '@/generated/prisma/client';
import { getCustomerSession } from '@/lib/customer-auth';
import { buildModelWatchTarget } from '@/lib/model-watchlist';
import { requirePrisma } from '@/lib/prisma';
import { cleanInternalRedirect } from '@/lib/security';

function revalidateWatchlistSurfaces(productSlug: string, redirectTo: string) {
  revalidatePath('/account');
  revalidatePath('/account/watchlist');
  if (productSlug) revalidatePath(`/shop/${productSlug}`);
  if (redirectTo) revalidatePath(redirectTo);
}

export async function toggleModelWatchAction(formData: FormData) {
  const productId = String(formData.get('productId') ?? '').trim().slice(0, 64);
  const redirectTo = cleanInternalRedirect(formData.get('redirectTo'), '/account/watchlist');
  const customer = await getCustomerSession();
  if (!customer) redirect(`/login?returnTo=${encodeURIComponent(redirectTo)}`);
  if (!productId) redirect(redirectTo);

  const prisma = requirePrisma();
  const product = await prisma.product.findFirst({
    where: { id: productId, status: { in: [ProductStatus.ACTIVE, ProductStatus.SOLD_OUT] } },
    select: { slug: true, brand: true, model: true, title: true, categorySlug: true }
  });
  const target = product
    ? buildModelWatchTarget({ brand: product.brand, model: product.model || product.title, categorySlug: product.categorySlug })
    : null;
  if (!product || !target) redirect(redirectTo);

  const existing = await prisma.customerModelWatch.findUnique({
    where: { customerId_key: { customerId: customer.id, key: target.key } }
  });
  if (existing) {
    await prisma.customerModelWatch.delete({ where: { id: existing.id } });
  } else {
    try {
      await prisma.customerModelWatch.create({ data: { customerId: customer.id, ...target } });
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')) throw error;
    }
  }
  revalidateWatchlistSurfaces(product.slug, redirectTo);
  redirect(redirectTo);
}

export async function removeModelWatchAction(formData: FormData) {
  const watchId = String(formData.get('watchId') ?? '').trim().slice(0, 64);
  const customer = await getCustomerSession();
  if (!customer) redirect('/login?returnTo=%2Faccount%2Fwatchlist');
  if (watchId) {
    await requirePrisma().customerModelWatch.deleteMany({ where: { id: watchId, customerId: customer.id } });
  }
  revalidatePath('/account');
  revalidatePath('/account/watchlist');
  redirect('/account/watchlist');
}
