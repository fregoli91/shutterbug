'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { CartValidationResponse, CartValidationItem } from '@/lib/cart-validation';
import { formatCents } from '@/lib/money';
import { useCart } from './CartProvider';

function isCartValidationResponse(payload: CartValidationResponse | { error?: string }): payload is CartValidationResponse {
  return 'items' in payload && Array.isArray(payload.items);
}

function placeholderItem(id: string, quantity: number): CartValidationItem {
  return {
    id,
    sku: '',
    slug: '',
    title: 'Checking item...',
    image: '/placeholder-camera.svg',
    condition: 'Checking current inventory',
    statusLabel: 'Checking',
    requestedQuantity: quantity,
    validatedQuantity: 0,
    availableQuantity: 0,
    unitPriceCents: 0,
    lineTotalCents: 0,
    purchasable: false
  };
}

export function CartPageClient() {
  const { items, hydrated, updateQuantity, removeItem, clearCart } = useCart();
  const [validation, setValidation] = useState<CartValidationResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (!items.length) return;

    let canceled = false;

    async function validateCart() {
      setLoading(true);
      setError('');

      try {
        const response = await fetch('/api/cart/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items })
        });
        const payload = (await response.json()) as CartValidationResponse | { error?: string };

        if (!response.ok) {
          throw new Error('Cart could not be validated.');
        }

        if (!isCartValidationResponse(payload)) {
          throw new Error('Cart could not be validated.');
        }

        if (!canceled) setValidation(payload);
      } catch {
        if (!canceled) {
          setValidation(null);
          setError('Cart could not be validated against current inventory. Please refresh and try again.');
        }
      } finally {
        if (!canceled) setLoading(false);
      }
    }

    void validateCart();

    return () => {
      canceled = true;
    };
  }, [hydrated, items]);

  if (!hydrated) {
    return (
      <div className="rounded-lg border border-ink/10 bg-cream p-8 text-center shadow-sm">
        <h1 className="font-serif text-3xl font-bold text-ink">Loading your cart</h1>
        <p className="mt-3 text-sm leading-6 text-ink/65">Checking the camera gear saved on this device.</p>
      </div>
    );
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

  const displayItems = validation?.items.length
    ? validation.items
    : items.map((item) => placeholderItem(item.id, item.quantity));
  const subtotalCents = validation?.subtotalCents ?? 0;
  const hasBlockingIssue = Boolean(error || loading || !validation || validation.hasBlockingIssue);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <div className="grid gap-3">
        {displayItems.map((item) => (
          <div
            key={item.id}
            className="grid gap-3 rounded-lg border border-ink/10 bg-cream p-4 shadow-sm sm:grid-cols-[6rem_1fr_auto]"
          >
            <Image
              src={item.image}
              alt={item.title}
              width={96}
              height={96}
              sizes="6rem"
              unoptimized={item.image.endsWith('.svg') || item.image.startsWith('http')}
              className="aspect-square w-24 rounded-lg bg-sand object-contain"
            />
            <div>
              {item.slug ? (
                <Link href={`/shop/${item.slug}`} className="font-semibold text-ink hover:text-moss">
                  {item.title}
                </Link>
              ) : (
                <p className="font-semibold text-ink">{item.title}</p>
              )}
              <p className="mt-1 text-sm text-ink/60">
                {item.condition} | {item.statusLabel}
              </p>
              {item.issue ? (
                <p className="mt-3 rounded-lg bg-sand px-3 py-2 text-sm font-semibold text-ink">{item.issue}</p>
              ) : (
                <p className="mt-3 text-sm text-ink/60">Validated against current Shutterbug inventory.</p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <label className="sr-only" htmlFor={`cart-quantity-${item.id}`}>
                  Quantity for {item.title}
                </label>
                <input
                  id={`cart-quantity-${item.id}`}
                  type="number"
                  min="1"
                  max={Math.max(1, item.availableQuantity || item.requestedQuantity)}
                  value={item.requestedQuantity}
                  onChange={(event) => updateQuantity(item.id, Number(event.target.value))}
                  className="h-10 w-20 rounded-lg border border-ink/15 bg-cream px-3 text-sm"
                />
                {item.validatedQuantity > 0 && item.validatedQuantity !== item.requestedQuantity ? (
                  <button
                    type="button"
                    className="text-sm font-semibold text-moss"
                    onClick={() => updateQuantity(item.id, item.validatedQuantity)}
                  >
                    Use {item.validatedQuantity}
                  </button>
                ) : null}
                <button type="button" className="text-sm font-semibold text-moss" onClick={() => removeItem(item.id)}>
                  Remove
                </button>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="font-bold text-ink">{formatCents(item.lineTotalCents)}</p>
              <p className="mt-1 text-xs text-ink/55">{formatCents(item.unitPriceCents)} each</p>
            </div>
          </div>
        ))}
      </div>

      <aside className="grid content-start gap-4 rounded-lg border border-ink/10 bg-cream p-5 shadow-sm">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-moss">Cart summary</p>
          <p className="mt-3 flex items-center justify-between text-sm text-ink/70">
            Validated subtotal{' '}
            <span className="font-bold text-ink">{loading ? 'Checking...' : formatCents(subtotalCents)}</span>
          </p>
          <p className="mt-2 text-sm text-ink/60">
            Prices, availability, and quantity limits are checked from current Shutterbug inventory.
          </p>
        </div>

        {error ? <p className="rounded-lg bg-sand p-3 text-sm font-semibold text-ink">{error}</p> : null}
        {validation?.warnings.length ? (
          <div className="grid gap-2 rounded-lg bg-sand p-3 text-sm font-semibold text-ink">
            {validation.warnings.map((warning) => (
              <p key={warning}>{warning}</p>
            ))}
          </div>
        ) : null}

        {hasBlockingIssue ? (
          <button
            type="button"
            disabled
            className="min-h-12 rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white opacity-60"
          >
            Checkout unavailable
          </button>
        ) : (
          <Link
            href="/checkout"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white transition hover:bg-moss"
          >
            Continue to checkout
          </Link>
        )}
        {hasBlockingIssue ? (
          <p className="text-sm leading-6 text-ink/65">
            Checkout will stay disabled until unavailable or over-quantity items are removed or updated.
          </p>
        ) : (
          <p className="text-sm leading-6 text-ink/65">
            Continue to create a pending order. Payment will be added in a later step.
          </p>
        )}
        <button type="button" onClick={clearCart} className="text-sm font-semibold text-moss">
          Clear cart
        </button>
        <div className="grid gap-2 border-t border-ink/10 pt-4 text-sm text-ink/65">
          <p>
            <span className="font-semibold text-ink">Real inventory:</span> draft, archived, sold-out, and over-quantity
            items are blocked.
          </p>
          <p>
            <span className="font-semibold text-ink">Current pricing:</span> totals are calculated from the server,
            not from browser-submitted prices.
          </p>
          <p>
            <span className="font-semibold text-ink">Used-camera details:</span> condition and availability stay visible
            before purchase.
          </p>
          <p>
            <Link href="/login?redirect=/cart" className="font-semibold text-moss">
              Log in
            </Link>{' '}
            to keep your Shutterbug account ready for future order history.
          </p>
        </div>
      </aside>
    </div>
  );
}
