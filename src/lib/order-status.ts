import { OrderStatus } from '@/generated/prisma/client';

export const orderStatusLabels: Record<OrderStatus, string> = {
  [OrderStatus.PENDING_PAYMENT]: 'Pending payment',
  [OrderStatus.PAID]: 'Paid',
  [OrderStatus.PROCESSING]: 'Processing',
  [OrderStatus.SHIPPED]: 'Shipped',
  [OrderStatus.DELIVERED]: 'Delivered',
  [OrderStatus.CANCELLED]: 'Cancelled',
  [OrderStatus.REFUNDED]: 'Refunded'
};

export const orderStatusStyles: Record<OrderStatus, string> = {
  [OrderStatus.PENDING_PAYMENT]: 'bg-sand text-ink',
  [OrderStatus.PAID]: 'bg-mint text-forest',
  [OrderStatus.PROCESSING]: 'bg-sage text-ink',
  [OrderStatus.SHIPPED]: 'bg-mint text-forest',
  [OrderStatus.DELIVERED]: 'bg-forest text-white',
  [OrderStatus.CANCELLED]: 'bg-ink/10 text-ink/65',
  [OrderStatus.REFUNDED]: 'bg-cream text-ink/70'
};

export function orderStatusLabel(status: OrderStatus) {
  return orderStatusLabels[status];
}

export function orderStatusClassName(status: OrderStatus) {
  return `rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${orderStatusStyles[status]}`;
}
