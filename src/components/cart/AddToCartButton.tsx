'use client';

import Link from 'next/link';
import { useState } from 'react';
import { type CartItem, useCart } from './CartProvider';

export function AddToCartButton({
  item,
  disabled,
  className
}: {
  item: CartItem;
  disabled?: boolean;
  className?: string;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  if (disabled) {
    return (
      <Link
        href="/contact"
        className={className ?? 'flex min-h-12 items-center justify-center rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white'}
      >
        Contact us
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={className ?? 'min-h-12 rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white'}
      onClick={() => {
        addItem(item);
        setAdded(true);
      }}
    >
      {added ? 'Added to cart' : 'Add to cart'}
    </button>
  );
}
