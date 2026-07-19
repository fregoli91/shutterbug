'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { CartValidationResponse } from '@/lib/cart-validation';
import { useCart } from './CartProvider';

function isCartValidationResponse(payload: CartValidationResponse | { error?: string }): payload is CartValidationResponse {
  return 'items' in payload && Array.isArray(payload.items);
}

export function AddToCartButton({
  productId,
  disabled,
  className
}: {
  productId: string;
  disabled?: boolean;
  className?: string;
}) {
  const { addItem, hydrated, items } = useCart();
  const [status, setStatus] = useState<'idle' | 'validating' | 'added' | 'error'>('idle');
  const [message, setMessage] = useState('');

  if (disabled) {
    return (
      <Link
        href="/contact"
        className={
          className ?? 'flex min-h-12 items-center justify-center rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white'
        }
      >
        Contact us
      </Link>
    );
  }

  const label = status === 'validating' ? 'Checking...' : status === 'added' ? 'Added to cart' : 'Add to cart';

  return (
    <div className="grid gap-2">
      <button
        type="button"
        disabled={!hydrated || status === 'validating'}
        className={
          className ??
          'min-h-12 rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white disabled:opacity-60'
        }
        onClick={async () => {
          setStatus('validating');
          setMessage('');

          const currentQuantity = items.find((item) => item.id === productId)?.quantity ?? 0;
          const nextQuantity = currentQuantity + 1;

          try {
            const response = await fetch('/api/cart/validate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ items: [{ id: productId, quantity: nextQuantity }] })
            });
            const payload = (await response.json()) as CartValidationResponse | { error?: string };

            if (!response.ok) {
              setStatus('error');
              setMessage('This item could not be added right now.');
              return;
            }

            if (!isCartValidationResponse(payload)) {
              setStatus('error');
              setMessage('This item could not be added right now.');
              return;
            }

            const validated = payload.items[0];
            if (!validated || validated.issue || !validated.purchasable || validated.validatedQuantity < nextQuantity) {
              setStatus('error');
              setMessage(validated?.issue ?? 'This item is not available in that quantity.');
              return;
            }

            addItem(productId, 1);
            setStatus('added');
          } catch {
            setStatus('error');
            setMessage('This item could not be added right now.');
          }
        }}
      >
        {label}
      </button>
      {message ? <p className="text-xs font-semibold text-ink/70">{message}</p> : null}
    </div>
  );
}
