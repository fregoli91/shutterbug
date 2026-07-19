import { ProductImageRole, ProductStatus, type Prisma } from '@/generated/prisma/client';
import { getPrisma } from '@/lib/prisma';

export type LikedProductRecord = Prisma.CustomerProductLikeGetPayload<{
  include: { product: { include: { images: true } } };
}>;

export async function getLikedProductIds(customerId: string | undefined, productIds: string[]) {
  const prisma = getPrisma();
  const uniqueProductIds = Array.from(new Set(productIds.filter(Boolean)));
  if (!prisma || !customerId || uniqueProductIds.length === 0) return new Set<string>();

  const likes = await prisma.customerProductLike.findMany({
    where: {
      customerId,
      productId: { in: uniqueProductIds }
    },
    select: { productId: true }
  });

  return new Set(likes.map((like) => like.productId));
}

export async function getCustomerLikedProducts(customerId: string) {
  const prisma = getPrisma();
  if (!prisma) return [];

  return prisma.customerProductLike.findMany({
    where: {
      customerId,
      product: { status: { in: [ProductStatus.ACTIVE, ProductStatus.SOLD_OUT] } }
    },
    include: {
      product: {
        include: { images: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export function getLikedProductHeroImage(like: LikedProductRecord) {
  const sorted = [...like.product.images].sort((a, b) => a.sortOrder - b.sortOrder);
  return sorted.find((image) => image.role === ProductImageRole.HERO)?.url ?? sorted[0]?.url ?? '/placeholder-camera.svg';
}
