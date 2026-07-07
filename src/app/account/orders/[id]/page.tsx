import { notFound } from 'next/navigation';
import Link from 'next/link';
import { AccountFeaturePage } from '@/components/account/AccountFeaturePage';
import { formatCents } from '@/lib/money';
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
        { id, customerEmail: customer.email },
        { orderNumber: id, customerId: customer.id },
        { orderNumber: id, customerEmail: customer.email }
      ]
    },
    include: { items: true, history: { orderBy: { createdAt: 'desc' } } }
  });

  if (!order) notFound();

  return (
    <AccountFeaturePage
      eyebrow="Customer account"
      title={`Order ${order.orderNumber}`}
      intro="Review purchased items, payment status, fulfillment status, and tracking details for this Shutterbug order."
    >
      <div className="grid gap-5">
        <div className="grid gap-4 rounded-lg border border-ink/10 bg-white p-6 shadow-sm md:grid-cols-4">
          <StatusTile label="Order date" value={order.createdAt.toLocaleDateString('en-US')} />
          <StatusTile label="Payment" value={order.paymentStatus} />
          <StatusTile label="Fulfillment" value={order.fulfillmentStatus} />
          <StatusTile label="Total" value={formatCents(order.totalCents, order.currency)} />
        </div>

        <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
          <p className="font-serif text-2xl font-bold text-ink">Items purchased</p>
          <div className="mt-5 grid gap-3">
            {order.items.map((item) => (
              <div key={item.id} className="grid gap-3 rounded-lg bg-cream p-3 sm:grid-cols-[4rem_1fr_auto] sm:items-center">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt="" className="h-16 w-16 rounded-md bg-white object-cover object-center" />
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
            <p className="mt-3 text-sm leading-6 text-ink/68">
              {order.trackingNumber || 'Tracking has not been added yet. This page will update when fulfillment details are available.'}
            </p>
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

        {order.history.length ? (
          <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
            <p className="font-serif text-2xl font-bold text-ink">Order updates</p>
            <div className="mt-5 grid gap-3">
              {order.history.map((event) => (
                <div key={event.id} className="rounded-lg bg-cream p-4">
                  <p className="font-semibold text-ink">{event.message}</p>
                  <p className="mt-1 text-sm text-ink/55">{event.createdAt.toLocaleString('en-US')}</p>
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
