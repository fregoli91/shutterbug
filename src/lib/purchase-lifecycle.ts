export type CartQuantityLine = {
  id: string;
  quantity: number;
};

export function removePurchasedCartLines<T extends CartQuantityLine>(current: T[], purchased: CartQuantityLine[]) {
  const purchasedById = new Map<string, number>();
  for (const item of purchased) {
    purchasedById.set(item.id, (purchasedById.get(item.id) ?? 0) + Math.max(0, item.quantity));
  }

  return current.flatMap((item) => {
    const remaining = item.quantity - (purchasedById.get(item.id) ?? 0);
    return remaining > 0 ? [{ ...item, quantity: remaining }] : [];
  });
}

export function shouldProcessStripePayment(paymentStatus: string, stripePaymentStatus: string) {
  return paymentStatus === 'PENDING' && stripePaymentStatus === 'paid';
}

export function isCustomerPurchase(paymentStatus: string) {
  return paymentStatus === 'PAID' || paymentStatus === 'REFUNDED';
}
