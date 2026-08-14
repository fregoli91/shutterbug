'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ClearCartOnSuccess } from '@/components/cart/ClearCartOnSuccess';
import type { OrderConfirmation } from '@/lib/order-confirmation';
import { formatCents } from '@/lib/money';

const MAX_POLL_ATTEMPTS = 8;
const POLL_INTERVAL_MS = 1500;

type Props = {
  sessionId: string;
  accessToken: string;
  initialConfirmation: OrderConfirmation | null;
};

export function OrderConfirmationClient({ sessionId, accessToken, initialConfirmation }: Props) {
  const [confirmation, setConfirmation] = useState(initialConfirmation);
  const [finishedPolling, setFinishedPolling] = useState(
    Boolean(initialConfirmation?.confirmed || !sessionId)
  );
  const purchasedItems = useMemo(
    () =>
      confirmation?.items
        .filter((item) => item.productId)
        .map((item) => ({ id: item.productId as string, quantity: item.quantity })) ?? [],
    [confirmation?.items]
  );

  useEffect(() => {
    if (!sessionId || confirmation?.confirmed) {
      return;
    }

    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    async function poll(attempt: number) {
      if (cancelled) return;
      const params = new URLSearchParams({ session_id: sessionId });
      if (accessToken) params.set('access', accessToken);

      try {
        const response = await fetch(`/api/orders/confirmation?${params.toString()}`, {
          cache: 'no-store',
          credentials: 'same-origin'
        });
        if (response.ok) {
          const next = (await response.json()) as OrderConfirmation;
          if (cancelled) return;
          setConfirmation(next);
          if (next.confirmed) {
            setFinishedPolling(true);
            return;
          }
        }
      } catch {
        // A transient network error should not turn a successful payment into a failure screen.
      }

      if (attempt >= MAX_POLL_ATTEMPTS) {
        if (!cancelled) setFinishedPolling(true);
        return;
      }
      timeout = setTimeout(() => void poll(attempt + 1), POLL_INTERVAL_MS);
    }

    timeout = setTimeout(() => void poll(1), POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      if (timeout) clearTimeout(timeout);
    };
  }, [accessToken, confirmation?.confirmed, sessionId]);

  const confirmed = Boolean(confirmation?.confirmed);

  return (
    <div className="p-6 sm:p-8">
      {confirmed && purchasedItems.length ? <ClearCartOnSuccess purchasedItems={purchasedItems} /> : null}
      <p className="text-sm font-bold uppercase tracking-[0.22em] text-moss">
        {confirmed ? 'Order confirmed' : 'Confirming your order'}
      </p>
      <h1 className="mt-3 font-serif text-3xl font-bold text-ink sm:text-4xl">
        {confirmed ? 'Thank you for your purchase' : 'Your payment is being confirmed'}
      </h1>
      <p className="mt-4 leading-7 text-ink/70">
        {confirmed
          ? `A receipt and order details are being sent to ${confirmation?.customerEmail}.`
          : finishedPolling
            ? 'Stripe is still confirming this payment. You do not need to pay again; we will email you as soon as it is confirmed.'
            : 'This usually takes only a few seconds. Please keep this page open while Stripe confirms the payment.'}
      </p>

      {confirmation ? (
        <div className="mt-6 rounded-lg border border-ink/10 bg-cream p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-ink">Order {confirmation.orderNumber}</p>
              <p className="mt-1 text-sm text-ink/65">Shipping to {confirmation.destination}</p>
            </div>
            <div className="text-right text-sm">
              <p className="font-semibold text-forest">{confirmation.paymentLabel}</p>
              <p className="mt-1 text-ink/65">{confirmation.fulfillmentLabel}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {confirmation.items.map((item) => (
              <div key={item.id} className="grid grid-cols-[4rem_1fr_auto] items-center gap-3 border-t border-ink/10 pt-3">
                <div className="relative aspect-square overflow-hidden rounded-md bg-sand">
                  <Image src={item.imageUrl || '/shutterbug-product-placeholder.png'} alt="" fill sizes="64px" className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-ink">{item.title}</p>
                  <p className="text-sm text-ink/60">Quantity {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-ink">
                  {formatCents(item.totalPriceCents, confirmation.currency)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-ink/15 pt-4 font-semibold text-ink">
            <span>Total</span>
            <span>{formatCents(confirmation.totalCents, confirmation.currency)}</span>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-ink/10 bg-cream p-5 text-sm text-ink/70">
          We are locating your order details. Your payment status is confirmed by Stripe before an order is shown as paid.
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        {confirmation?.orderPath ? (
          <Link href={confirmation.orderPath} className="rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white">
            View order
          </Link>
        ) : null}
        <Link href="/shop" className="rounded-full border border-moss/30 bg-mint px-5 py-3 text-sm font-semibold text-ink">
          Continue shopping
        </Link>
        <Link href="/contact" className="rounded-full border border-ink/15 bg-white px-5 py-3 text-sm font-semibold text-ink">
          Contact support
        </Link>
      </div>
    </div>
  );
}
