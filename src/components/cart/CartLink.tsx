'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from './CartProvider';

export function CartLink({ compact = false }: { compact?: boolean }) {
  const { count } = useCart();
  const displayCount = count > 99 ? '99+' : String(count);
  const ariaLabel = count ? `Bag, ${count} item${count === 1 ? '' : 's'}` : 'Bag';

  if (compact) {
    return (
      <Link
        href="/cart"
        aria-label={ariaLabel}
        className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-forest/15 bg-sand/70 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_2px_5px_rgba(35,43,32,0.12)] transition hover:border-moss/40 hover:bg-sand"
      >
        <Image
          src="/shutterbug-bag-icon.png"
          alt=""
          width={48}
          height={48}
          sizes="3rem"
          className="h-full w-full scale-[1.35] rounded-md object-cover"
        />
        {count ? (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#b8523b] px-1 text-[0.65rem] font-bold leading-none text-white shadow-sm">
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
      <span className="block h-8 w-8 overflow-hidden rounded-lg bg-cream">
        <Image
          src="/shutterbug-bag-icon.png"
          alt=""
          width={32}
          height={32}
          sizes="2rem"
          className="h-full w-full scale-[1.35] object-cover"
        />
      </span>
      <span>Bag</span>
      {count ? (
        <span className="rounded-full bg-forest px-2 py-0.5 text-xs font-bold text-white">
          {displayCount}
        </span>
      ) : null}
    </Link>
  );
}
