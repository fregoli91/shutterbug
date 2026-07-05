'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';

export function CartLink({ compact = false }: { compact?: boolean }) {
  const { count } = useCart();
  const displayCount = count > 99 ? '99+' : String(count);
  const ariaLabel = count ? `Cart, ${count} item${count === 1 ? '' : 's'}` : 'Cart';

  if (compact) {
    return (
      <Link
        href="/cart"
        aria-label={ariaLabel}
        className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/15 bg-cream p-0.5 shadow-sm transition hover:border-moss/40 sm:h-12 sm:w-12"
      >
        <img
          src="/shutterbug-cart-icon.png"
          alt=""
          className="h-full w-full rounded-full object-cover"
        />
        {count ? (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-forest px-1 text-[0.65rem] font-bold leading-none text-white shadow-sm">
            {displayCount}
          </span>
        ) : null}
      </Link>
    );
  }

  return (
    <Link
      href="/cart"
      aria-label={ariaLabel}
      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ink/15 bg-cream px-3 pr-4 text-sm font-semibold text-ink shadow-sm transition hover:border-moss/40"
    >
      <span className="block h-8 w-8 overflow-hidden rounded-full bg-sand">
        <img
          src="/shutterbug-cart-icon.png"
          alt=""
          className="h-full w-full object-cover"
        />
      </span>
      <span>Cart</span>
      {count ? (
        <span className="rounded-full bg-forest px-2 py-0.5 text-xs font-bold text-white">
          {displayCount}
        </span>
      ) : null}
    </Link>
  );
}
