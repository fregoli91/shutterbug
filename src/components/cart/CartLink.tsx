'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';

export function CartLink() {
  const { count } = useCart();

  return (
    <Link
      href="/cart"
      className="inline-flex min-h-11 items-center rounded-full border border-ink/15 bg-white px-4 text-sm font-semibold text-ink shadow-sm transition hover:border-moss/40"
    >
      Cart{count ? ` (${count})` : ''}
    </Link>
  );
}
