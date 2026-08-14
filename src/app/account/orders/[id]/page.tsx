import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { PaymentStatus } from '@/generated/prisma/client';
import { AccountFeaturePage } from '@/components/account/AccountFeaturePage';
import { formatCents } from '@/lib/money';
import { customerFulfillmentStatusLabel, customerPaymentStatusLabel } from '@/lib/order-status';
import { requireCustomer } from '@/lib/customer-auth';
import { requirePrisma } from '@/lib/prisma';

type Props = { params: Promise<{ id: string }> };

export const metadata = {
  title: 'Order Details'
};

export default async function AccountOrderDetailPage({ params }: Props) {
  const customer = await requireCustomer();
  const { id } = await params;
  const prisma = requirePrisma();
  const order = await prisma.order.findFirst({
    where: {
      OR: [
        { id, customerId: customer.id },
        { orderNumber: id, customerId: customer.id }
      ],
      paymentStatus: { in: [PaymentStatus.PAID, PaymentStatus.REFUNDED] }
    },
    include: { items: true }
  });

  if (!order) notFound();
  const trackingLabel = [order.carrier, order.trackingNumber].filter(Boolean).join(' ');
  const updates: Array<{ label: string; date: Date }> = [];
  if (order.paidAt) updates.push({ label: 'Payment confirmed', date: order.paidAt });
  if (order.processingAt) updates.push({ label: 'Preparing your order', date: order.processingAt });
  if (order.shippedAt) updates.push({ label: 'Order shipped', date: order.shippedAt });
  if (order.deliveredAt) updates.push({ label: 'Order delivered', date: order.deliveredAt });
  if (order.cancelledAt) updates.push({ label: 'Order cancelled', date: order.cancelledAt });
  if (order.refundedAt) updates.push({ label: 'Order refunded', date: order.refundedAt });

  return (
    <AccountFeaturePage
      eyebrow="Customer account"
      title={`Order ${order.orderNumber}`}
      intro="Review purchased items, payment status, fulfillment status, and tracking details for this Shutterbug order."
    >
      <div className="grid gap-5">
        <div className="grid gap-4 rounded-lg border border-ink/10 bg-white p-6 shadow-sm md:grid-cols-4">
          <StatusTile label="Order date" value={order.createdAt.toLocaleDateString('en-US')} />
          <StatusTile label="Payment" value={customerPaymentStatusLabel(order.paymentStatus)} />
          <StatusTile label="Fulfillment" value={customerFulfillmentStatusLabel(order.fulfillmentStatus)} />
          <StatusTile label="Total" value={formatCents(order.totalCents, order.currency)} />
        </div>

        <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
          <p className="font-serif text-2xl font-bold text-ink">Items purchased</p>
          <div className="mt-5 grid gap-3">
            {order.items.map((item) => (
              <div key={item.id} className="grid gap-3 rounded-lg bg-cream p-3 sm:grid-cols-[4rem_1fr_auto] sm:items-center">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt=""
                    width={64}
                    height={64}
                    sizes="4rem"
                    unoptimized={item.imageUrl.endsWith('.svg') || item.imageUrl.startsWith('http')}
                    className="h-16 w-16 rounded-md bg-white object-cover object-center"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-md bg-sand" />
                )}
                <div>
                  <p className="font-semibold text-ink">{item.productTitle}</p>
                  <p className="mt-1 text-sm text-ink/60">
                    {item.quantity} x {formatCents(item.unitPriceCents, order.currency)} | {item.conditionLabel}
                  </p>
                </div>
                <p className="font-semibold text-ink">{formatCents(item.totalPriceCents, order.currency)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
            <p className="font-serif text-2xl font-bold text-ink">Order totals</p>
            <div className="mt-4 grid gap-2 text-sm text-ink/68">
              <PriceRow label="Subtotal" value={formatCents(order.subtotalCents, order.currency)} />
              <PriceRow label="Shipping" value={formatCents(order.shippingCents, order.currency)} />
              <PriceRow label="Tax" value={formatCents(order.taxCents, order.currency)} />
              <div className="mt-2 border-t border-ink/10 pt-3">
                <PriceRow label="Total" value={formatCents(order.totalCents, order.currency)} strong />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
            <p className="font-serif text-2xl font-bold text-ink">Shipping address</p>
            <div className="mt-3 grid gap-1 text-sm leading-6 text-ink/68">
              {formatAddress(order.shippingAddress).map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
            <p className="font-serif text-2xl font-bold text-ink">Tracking</p>
            <div className="mt-3 grid gap-2 text-sm leading-6 text-ink/68">
              <p>Carrier: {order.carrier || 'Not added yet'}</p>
              <p>Tracking: {order.trackingNumber || 'Not added yet'}</p>
              <p>Fulfillment: {customerFulfillmentStatusLabel(order.fulfillmentStatus)}</p>
              {order.shippedAt ? <p>Shipped: {order.shippedAt.toLocaleDateString('en-US')}</p> : null}
              {order.deliveredAt ? <p>Delivered: {order.deliveredAt.toLocaleDateString('en-US')}</p> : null}
            </div>
            {order.trackingUrl ? (
              <a
                href={order.trackingUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex text-sm font-semibold text-moss hover:text-ink"
              >
                Track shipment
              </a>
            ) : null}
            {!order.trackingUrl && trackingLabel ? <p className="mt-4 text-sm font-semibold text-moss">{trackingLabel}</p> : null}
          </div>
          <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
            <p className="font-serif text-2xl font-bold text-ink">Need help?</p>
            <p className="mt-3 text-sm leading-6 text-ink/68">
              Contact Shutterbug with your order number if you have questions about this camera, shipping, or returns.
            </p>
            <Link href="/contact" className="mt-4 inline-flex text-sm font-semibold text-moss hover:text-ink">
              Contact support
            </Link>
          </div>
        </div>

        {updates.length ? (
          <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
            <p className="font-serif text-2xl font-bold text-ink">Order updates</p>
            <div className="mt-5 grid gap-3">
              {updates.map((event) => (
                <div key={`${event.label}-${event.date.toISOString()}`} className="rounded-lg bg-cream p-4">
                  <p className="font-semibold text-ink">{event.label}</p>
                  <p className="mt-1 text-sm text-ink/55">{event.date.toLocaleString('en-US')}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </AccountFeaturePage>
  );
}

function StatusTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-cream p-4">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-moss">{label}</p>
      <p className="mt-2 font-semibold text-ink">{value}</p>
    </div>
  );
}

function PriceRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={strong ? 'flex justify-between gap-4 font-bold text-ink' : 'flex justify-between gap-4'}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function formatAddress(address: unknown) {
  if (!address || typeof address !== 'object' || Array.isArray(address)) {
    return ['Shipping address will appear here after checkout confirmation.'];
  }

  const value = address as Record<string, unknown>;
  const lines = [
    value.name,
    value.line1,
    value.line2,
    [value.city, value.state, value.postal_code].filter(Boolean).join(', '),
    value.country
  ]
    .map((line) => String(line ?? '').trim())
    .filter(Boolean);

  return lines.length ? lines : ['Shipping address will appear here after checkout confirmation.'];
}
