'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { formatCents } from '@/lib/money';
import { useCart } from './CartProvider';

export function CartPageClient() {
  const { items, subtotalCents, updateQuantity, removeItem, clearCart } = useCart();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function checkout() {
    setLoading(true);
    setError('');
    const response = await fetch('/api/checkout/stripe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items.map((item) => ({ id: item.id, slug: item.slug, quantity: item.quantity }))
      })
    });
    const payload = (await response.json()) as { url?: string; error?: string };
    setLoading(false);

    if (!response.ok || !payload.url) {
      setError(payload.error || 'Checkout could not be started.');
      return;
    }
    window.location.href = payload.url;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-ink/10 bg-cream p-8 text-center shadow-sm">
        <h1 className="font-serif text-3xl font-bold text-ink">Your cart is empty</h1>
        <p className="mt-3 text-sm leading-6 text-ink/65">Browse tested used cameras and add one when it feels right.</p>
        <Link href="/shop" className="mt-6 inline-flex min-h-12 items-center rounded-full bg-forest px-6 text-sm font-semibold text-white">
          Shop cameras
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <div className="grid gap-3">
        {items.map((item) => (
          <div key={item.id} className="grid gap-3 rounded-lg border border-ink/10 bg-cream p-4 shadow-sm sm:grid-cols-[6rem_1fr_auto]">
            <Image
              src={item.image}
              alt=""
              width={96}
              height={96}
              sizes="6rem"
              unoptimized={item.image.endsWith('.svg')}
              className="aspect-square w-24 rounded-lg bg-sand object-contain"
            />
            <div>
              <Link href={`/shop/${item.slug}`} className="font-semibold text-ink hover:text-moss">
                {item.title}
              </Link>
              <p className="mt-1 text-sm text-ink/60">{item.condition}</p>
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max={item.maxQuantity}
                  value={item.quantity}
                  onChange={(event) => updateQuantity(item.id, Number(event.target.value))}
                  className="h-10 w-20 rounded-lg border border-ink/15 bg-cream px-3 text-sm"
                />
                <button type="button" className="text-sm font-semibold text-moss" onClick={() => removeItem(item.id)}>
                  Remove
                </button>
              </div>
            </div>
            <p className="font-bold text-ink">{formatCents(item.priceCents * item.quantity)}</p>
          </div>
        ))}
      </div>

      <aside className="grid content-start gap-4 rounded-lg border border-ink/10 bg-cream p-5 shadow-sm">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-moss">Checkout</p>
          <p className="mt-3 flex items-center justify-between text-sm text-ink/70">
            Subtotal <span className="font-bold text-ink">{formatCents(subtotalCents)}</span>
          </p>
          <p className="mt-2 text-sm text-ink/60">Shipping and tax are finalized in secure checkout.</p>
        </div>
        {error ? <p className="rounded-lg bg-sand p-3 text-sm font-semibold text-ink">{error}</p> : null}
        <button
          type="button"
          disabled={loading}
          onClick={checkout}
          className="min-h-12 rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? 'Starting checkout...' : 'Checkout with Stripe'}
        </button>
        <button type="button" onClick={clearCart} className="text-sm font-semibold text-moss">
          Clear cart
        </button>
        <div className="grid gap-2 border-t border-ink/10 pt-4 text-sm text-ink/65">
          <p>
            <span className="font-semibold text-ink">Secure checkout:</span> payment is processed by Stripe.
          </p>
          <p>
            <span className="font-semibold text-ink">Real inventory:</span> stock is validated before payment.
          </p>
          <p>
            <span className="font-semibold text-ink">Used-camera details:</span> condition and included accessories stay
            visible before you buy.
          </p>
          <p>
            <Link href="/login?redirect=/cart" className="font-semibold text-moss">
              Log in
            </Link>{' '}
            before checkout to save this order to your account.
          </p>
          <p>
            <Link href="/returns" className="font-semibold text-moss">
              Returns
            </Link>{' '}
            and{' '}
            <Link href="/contact" className="font-semibold text-moss">
              customer support
            </Link>{' '}
            stay available before and after purchase.
          </p>
        </div>
      </aside>
    </div>
  );
}
