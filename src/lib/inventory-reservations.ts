import { OrderStatus, PaymentStatus, Prisma } from '@/generated/prisma/client';
import type { CartValidationItem } from '@/lib/cart-validation';

type Tx = Prisma.TransactionClient;
type UpdatedProduct = { id: string; slug: string };

export class InventoryReservationError extends Error {}

export async function reserveValidatedItems(tx: Tx, items: CartValidationItem[]): Promise<void> {
  for (const item of [...items].sort((a, b) => a.id.localeCompare(b.id))) {
    const updated = await tx.$queryRaw<UpdatedProduct[]>(Prisma.sql`
      UPDATE "Product"
      SET "reservedQuantity" = "reservedQuantity" + ${item.validatedQuantity},
          "updatedAt" = CURRENT_TIMESTAMP
      WHERE "id" = ${item.id}
        AND "status" = CAST('ACTIVE' AS "ProductStatus")
        AND "priceCents" = ${item.unitPriceCents}
        AND ("quantity" - "reservedQuantity") >= ${item.validatedQuantity}
      RETURNING "id", "slug"
    `);

    if (updated.length !== 1) {
      throw new InventoryReservationError('Inventory changed before checkout could reserve the item.');
    }
  }
}

export async function releaseOrderReservation(tx: Tx, orderId: string, reason: string): Promise<boolean> {
  const claimed = await tx.order.updateMany({
    where: {
      id: orderId,
      status: OrderStatus.PENDING_PAYMENT,
      paymentStatus: PaymentStatus.PENDING,
      inventoryReleasedAt: null
    },
    data: { inventoryReleasedAt: new Date() }
  });
  if (claimed.count !== 1) return false;

  const items = await tx.orderItem.findMany({ where: { orderId } });
  for (const item of items) {
    if (!item.productId) continue;
    await tx.$executeRaw(Prisma.sql`
      UPDATE "Product"
      SET "reservedQuantity" = GREATEST("reservedQuantity" - ${item.quantity}, 0),
          "updatedAt" = CURRENT_TIMESTAMP
      WHERE "id" = ${item.productId}
    `);
  }

  await tx.orderStatusEvent.create({ data: { orderId, message: reason } });
  return true;
}

export async function releaseExpiredReservations(tx: Tx, limit = 25): Promise<number> {
  const orders = await tx.order.findMany({
    where: {
      status: OrderStatus.PENDING_PAYMENT,
      paymentStatus: PaymentStatus.PENDING,
      inventoryReleasedAt: null,
      reservationExpiresAt: { lt: new Date() }
    },
    select: { id: true },
    orderBy: { reservationExpiresAt: 'asc' },
    take: limit
  });

  let released = 0;
  for (const order of orders) {
    if (await releaseOrderReservation(tx, order.id, 'Expired checkout inventory reservation released.')) released += 1;
  }
  return released;
}

export async function consumeOrderReservation(tx: Tx, orderId: string): Promise<string[]> {
  const order = await tx.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (!order) throw new InventoryReservationError('Order not found.');
  if (order.inventoryReleasedAt) throw new InventoryReservationError('The inventory reservation has already been released.');

  const paths: string[] = [];
  for (const item of [...order.items].sort((a, b) => (a.productId ?? '').localeCompare(b.productId ?? ''))) {
    if (!item.productId) throw new InventoryReservationError('Order item is missing its product.');

    const updated = await tx.$queryRaw<UpdatedProduct[]>(Prisma.sql`
      UPDATE "Product"
      SET "quantity" = "quantity" - ${item.quantity},
          "reservedQuantity" = "reservedQuantity" - ${item.quantity},
          "status" = CASE
            WHEN ("quantity" - ${item.quantity}) <= 0 THEN CAST('SOLD_OUT' AS "ProductStatus")
            ELSE "status"
          END,
          "updatedAt" = CURRENT_TIMESTAMP
      WHERE "id" = ${item.productId}
        AND "quantity" >= ${item.quantity}
        AND "reservedQuantity" >= ${item.quantity}
      RETURNING "id", "slug"
    `);

    if (updated.length !== 1) {
      throw new InventoryReservationError(`Reserved inventory is unavailable for ${item.productTitle}.`);
    }
    paths.push(updated[0].slug);
  }

  return paths;
}
