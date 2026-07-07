import Link from 'next/link';
import { AccountFeaturePage } from '@/components/account/AccountFeaturePage';
import { formatCents } from '@/lib/money';
import { requireCustomer } from '@/lib/customer-auth';
import { requirePrisma } from '@/lib/prisma';

export const metadata = {
  title: 'Account Orders'
};

export default async function AccountOrdersPage() {
  const customer = await requireCustomer();
  const prisma = requirePrisma();
  const orders = await prisma.order.findMany({
    where: {
      OR: [{ customerId: customer.id }, { customerEmail: customer.email }]
    },
    include: { items: true },
    orderBy: { createdAt: 'desc' }
  });
  const paidCount = orders.filter((order) => order.paymentStatus === 'PAID').length;
  const shippedCount = orders.filter((order) => order.fulfillmentStatus === 'SHIPPED').length;

  return (
    <AccountFeaturePage
      eyebrow="Customer account"
      title="Order history"
      intro="Review purchase history, item details, payment status, fulfillment updates, and tracking numbers."
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <OrderSummary label="Total orders" value={String(orders.length)} />
        <OrderSummary label="Paid orders" value={String(paidCount)} />
        <OrderSummary label="Shipped" value={String(shippedCount)} />
      </div>

      {orders.length ? (
        <div className="mt-6 grid gap-5">
          {orders.map((order) => (
            <article key={order.id} className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-3 sm:flex-row">
                <div>
                  <p className="font-serif text-2xl font-bold text-ink">Order {order.orderNumber}</p>
                  <p className="mt-1 text-sm text-ink/60">{order.createdAt.toLocaleDateString('en-US')}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <StatusPill label={formatStatus(order.paymentStatus)} />
                    <StatusPill label={formatStatus(order.fulfillmentStatus)} />
                  </div>
                </div>
                <p className="text-lg font-bold text-forest">{formatCents(order.totalCents, order.currency)}</p>
              </div>

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
                        {item.quantity} x {formatCents(item.unitPriceCents, order.currency)} - {item.conditionLabel}
                      </p>
                    </div>
                    <p className="font-semibold text-ink">{formatCents(item.totalPriceCents, order.currency)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid gap-1 text-sm text-ink/65">
                <p>Tracking: {order.trackingNumber || 'Not added yet'}</p>
                <p>Shipping status: {formatStatus(order.fulfillmentStatus)}</p>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/account/orders/${order.id}`}
                  className="inline-flex min-h-11 items-center rounded-full bg-forest px-5 text-sm font-semibold text-white transition hover:bg-moss"
                >
                  View order details
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex min-h-11 items-center rounded-full border border-ink/15 bg-cream px-5 text-sm font-semibold text-ink transition hover:border-moss hover:text-moss"
                >
                  Ask about this order
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-ink/10 bg-white p-8 text-center shadow-sm">
          <img
            src="/shutterbug-checkout-success.png"
            alt=""
            className="mx-auto aspect-[4/3] w-full max-w-sm rounded-lg bg-cream object-cover object-center"
          />
          <p className="mt-5 font-serif text-3xl font-bold text-ink">No orders yet</p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-ink/65">
            Orders tied to your email will appear here after checkout, including payment status, item details, and
            fulfillment updates.
          </p>
          <Link href="/shop" className="mt-6 inline-flex min-h-12 items-center rounded-full bg-forest px-6 text-sm font-semibold text-white">
            Shop cameras
          </Link>
        </div>
      )}
    </AccountFeaturePage>
  );
}

function OrderSummary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-white p-4 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-moss">{label}</p>
      <p className="mt-2 font-serif text-2xl font-bold text-ink">{value}</p>
    </div>
  );
}

function StatusPill({ label }: { label: string }) {
  return <span className="rounded-full bg-mint px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-forest">{label}</span>;
}

function formatStatus(status: string) {
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}
