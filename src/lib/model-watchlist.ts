import { getPrisma } from '@/lib/prisma';

export { buildModelWatchTarget, type ModelWatchTarget } from '@/lib/model-watch-key';

export async function getCustomerModelWatchKeys(customerId: string | undefined, keys: string[]) {
  const prisma = getPrisma();
  const uniqueKeys = Array.from(new Set(keys.filter(Boolean)));
  if (!prisma || !customerId || uniqueKeys.length === 0) return new Set<string>();
  const watches = await prisma.customerModelWatch.findMany({
    where: { customerId, key: { in: uniqueKeys } },
    select: { key: true }
  });
  return new Set(watches.map((watch) => watch.key));
}

export async function getCustomerModelWatches(customerId: string) {
  const prisma = getPrisma();
  if (!prisma) return [];
  return prisma.customerModelWatch.findMany({
    where: { customerId },
    orderBy: { createdAt: 'desc' }
  });
}