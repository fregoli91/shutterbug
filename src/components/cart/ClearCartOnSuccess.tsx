'use client';

import { useEffect, useRef } from 'react';
import { type CartLine, useCart } from './CartProvider';

export function ClearCartOnSuccess({ purchasedItems }: { purchasedItems: CartLine[] }) {
  const { removePurchasedItems } = useCart();
  const cleared = useRef(false);

  useEffect(() => {
    if (cleared.current) return;
    cleared.current = true;
    removePurchasedItems(purchasedItems);
  }, [purchasedItems, removePurchasedItems]);

  return null;
}