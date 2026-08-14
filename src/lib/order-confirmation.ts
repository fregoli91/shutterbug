import { PaymentStatus, type Prisma } from '@/generated/prisma/client';
import { customerOrderPath } from '@/lib/order-access';
import { customerFulfillmentStatusLabel, customerPaymentStatusLabel } from '@/lib/order-status';

type ConfirmationOrder = Prisma.OrderGetPayload<{ include: { items: true } }>;

export type OrderConfirmation = {
  orderNumber: string;
  customerName: string | null;
  customerEmail: string;
  paymentLabel: string;
  fulfillmentLabel: string;
  confirmed: boolean;
  totalCents: number;
  currency: string;
  destination: string;
  orderPath: string;
  items: Array<{
    id: string;
    productId: string | null;
    title: string;
    imageUrl: string | null;
    quantity: number;
    totalPriceCents: number;
  }>;
};

function destination(address: unknown) {
  if (!address || typeof address !== 'object' || Array.isArray(address)) return 'Shipping address received';
  const value = address as Record<string, unknown>;
  return [value.city, value.state, value.country]
    .map((part) => String(part ?? '').trim())
    .filter(Boolean)
    .join(', ') || 'Shipping address received';
}

export function toOrderConfirmation(order: ConfirmationOrder): OrderConfirmation {
  return {
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    paymentLabel: customerPaymentStatusLabel(order.paymentStatus),
    fulfillmentLabel: customerFulfillmentStatusLabel(order.fulfillmentStatus),
    confirmed: order.paymentStatus === PaymentStatus.PAID,
    totalCents: order.totalCents,
    currency: order.currency,
    destination: destination(order.shippingAddress),
    orderPath: customerOrderPath(order),
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      title: item.productTitle,
      imageUrl: item.imageUrl,
      quantity: item.quantity,
      totalPriceCents: item.totalPriceCents
    }))
  };
}