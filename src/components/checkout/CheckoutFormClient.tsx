'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createPendingOrderAction } from '@/app/checkout/actions';
import type { CartValidationResponse } from '@/lib/cart-validation';
import { formatCents } from '@/lib/money';
import { useCart } from '@/components/cart/CartProvider';

type Props = {
  defaultName?: string;
  defaultEmail?: string;
  error?: string;
};

const errorMessages: Record<string, string> = {
  empty: 'Your cart is empty. Add a camera before checkout.',
  missing: 'Enter your contact and shipping details.',
  inventory: 'One or more cart items is no longer available in that quantity.',
  config: 'Checkout needs a configured database before orders can be created.'
};

function isCartValidationResponse(payload: CartValidationResponse | { error?: string }): payload is CartValidationResponse {
  return 'items' in payload && Array.isArray(payload.items);
}

export function CheckoutFormClient({ defaultName = '', defaultEmail = '', error }: Props) {
  const { items, hydrated } = useCart();
  const [validation, setValidation] = useState<CartValidationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (!hydrated) return;
    if (!items.length) return;

    let canceled = false;

    async function validateCart() {
      setLoading(true);
      setValidationError('');

      try {
        const response = await fetch('/api/cart/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items })
        });
        const payload = (await response.json()) as CartValidationResponse | { error?: string };

        if (!response.ok || !isCartValidationResponse(payload)) {
          throw new Error('Cart validation failed.');
        }

        if (!canceled) setValidation(payload);
      } catch {
        if (!canceled) {
          setValidation(null);
          setValidationError('Cart could not be validated. Please return to the cart and try again.');
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

  const hasBlockingIssue = Boolean(!hydrated || loading || validationError || !validation || validation.hasBlockingIssue);
  const cartJson = JSON.stringify(items);

  if (!hydrated) {
    return (
      <div className="rounded-lg border border-ink/10 bg-white p-8 text-center shadow-sm">
        <p className="font-serif text-3xl font-bold text-ink">Loading checkout</p>
        <p className="mt-3 text-sm leading-6 text-ink/65">Checking the cart saved on this device.</p>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-lg border border-ink/10 bg-white p-8 text-center shadow-sm">
        <p className="font-serif text-3xl font-bold text-ink">Your cart is empty</p>
        <p className="mt-3 text-sm leading-6 text-ink/65">Add a tested camera before starting checkout.</p>
        <Link href="/shop" className="mt-6 inline-flex min-h-12 items-center rounded-full bg-forest px-6 text-sm font-semibold text-white">
          Shop cameras
        </Link>
      </div>
    );
  }

  return (
    <form
      action={createPendingOrderAction}
      className="grid gap-6 lg:grid-cols-[1fr_24rem]"
    >
      <input type="hidden" name="cartJson" value={cartJson} />
      <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-moss">Shipping contact</p>
        <h2 className="mt-3 font-serif text-3xl font-bold text-ink">Where should this order go?</h2>
        <p className="mt-3 text-sm leading-6 text-ink/65">
          This creates a pending order record only. Payment processing will be added in a later step.
        </p>

        {error && errorMessages[error] ? (
          <p className="mt-5 rounded-lg bg-sand p-3 text-sm font-semibold text-ink">{errorMessages[error]}</p>
        ) : null}
        {validationError ? (
          <p className="mt-5 rounded-lg bg-sand p-3 text-sm font-semibold text-ink">{validationError}</p>
        ) : null}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Name" name="name" autoComplete="name" defaultValue={defaultName} required />
          <Field label="Email" name="email" type="email" autoComplete="email" defaultValue={defaultEmail} required />
          <Field label="Phone optional" name="phone" type="tel" autoComplete="tel" />
          <Field label="Address" name="address" autoComplete="address-line1" required />
          <Field label="Apartment, suite, etc. optional" name="address2" autoComplete="address-line2" />
          <Field label="City" name="city" autoComplete="address-level2" required />
          <Field label="State" name="state" autoComplete="address-level1" required />
          <Field label="Postal code" name="postalCode" autoComplete="postal-code" required />
          <Field label="Country" name="country" autoComplete="country" defaultValue="US" required />
        </div>
      </div>

      <aside className="grid content-start gap-4 rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-moss">Order review</p>
          <p className="mt-3 text-sm leading-6 text-ink/65">
            Every line is checked against current Shutterbug inventory before the order is created.
          </p>
        </div>

        <div className="grid gap-3">
          {(validation?.items ?? []).map((item) => (
            <div key={item.id} className="grid grid-cols-[4rem_1fr] gap-3 rounded-lg bg-cream p-3">
              <Image
                src={item.image}
                alt={item.title}
                width={64}
                height={64}
                sizes="4rem"
                unoptimized={item.image.endsWith('.svg') || item.image.startsWith('http')}
                className="aspect-square rounded-lg bg-sand object-contain"
              />
              <div>
                <p className="line-clamp-2 text-sm font-semibold text-ink">{item.title}</p>
                <p className="mt-1 text-xs text-ink/60">
                  Qty {item.requestedQuantity} | {item.condition}
                </p>
                <p className="mt-1 text-sm font-bold text-ink">{formatCents(item.lineTotalCents)}</p>
                {item.issue ? <p className="mt-2 text-xs font-semibold text-ink/70">{item.issue}</p> : null}
              </div>
            </div>
          ))}
          {!validation && loading ? <p className="rounded-lg bg-cream p-3 text-sm text-ink/65">Validating cart...</p> : null}
        </div>

        <div className="border-t border-ink/10 pt-4">
          <p className="flex justify-between gap-4 text-sm text-ink/70">
            Subtotal <span className="font-bold text-ink">{formatCents(validation?.subtotalCents ?? 0)}</span>
          </p>
          <p className="mt-2 text-xs leading-5 text-ink/55">Shipping and tax are placeholders until payment is wired.</p>
        </div>

        <button
          disabled={hasBlockingIssue}
          className="min-h-12 rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          Create pending order
        </button>
        <p className="text-xs leading-5 text-ink/58">
          No payment will be collected on this step. Inventory is not deducted until a later payment-confirmation flow.
        </p>
      </aside>
    </form>
  );
}

function Field({
  label,
  name,
  type = 'text',
  autoComplete,
  defaultValue,
  required
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-ink">
      {label}
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        required={required}
        className="min-h-12 rounded-lg border border-ink/15 bg-cream px-3 text-base font-normal outline-none focus:border-moss"
      />
    </label>
  );
}
