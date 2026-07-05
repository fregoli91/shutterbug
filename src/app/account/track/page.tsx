import Link from 'next/link';
import { AccountFeaturePage } from '@/components/account/AccountFeaturePage';
import { formatCents } from '@/lib/money';
import { requireCustomer } from '@/lib/customer-auth';
import { requirePrisma } from '@/lib/prisma';

export const metadata = {
  title: 'Track Orders'
};

export default async function AccountTrackPage() {
  const customer = await requireCustomer();
  const prisma = requirePrisma();
  const orders = await prisma.order.findMany({
    where: {
      OR: [{ customerId: customer.id }, { customerEmail: customer.email }]
    },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
    take: 6
  });

  return (
    <AccountFeaturePage
      eyebrow="Customer account"
      title="Track orders"
      intro="Follow payment, fulfillment, and tracking details for recent Shutterbug purchases."
    >
      {orders.length ? (
        <div className="grid gap-4">
          {orders.map((order) => (
            <article key={order.id} className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
              <div className="flex flex-col justify-between gap-3 sm:flex-row">
                <div>
                  <p className="font-serif text-2xl font-bold text-ink">Order {order.orderNumber}</p>
                  <p className="mt-1 text-sm text-ink/60">
                    {order.createdAt.toLocaleDateString('en-US')} | {order.paymentStatus} | {order.fulfillmentStatus}
                  </p>
                </div>
                <p className="font-bold text-forest">{formatCents(order.totalCents, order.currency)}</p>
              </div>
              <div className="mt-4 rounded-lg bg-cream p-4 text-sm leading-6 text-ink/68">
                <p>
                  <span className="font-semibold text-ink">Tracking:</span> {order.trackingNumber || 'Not added yet'}
                </p>
                <p>
                  <span className="font-semibold text-ink">Items:</span>{' '}
                  {order.items.map((item) => item.productTitle).join(', ')}
                </p>
              </div>
              <Link href={`/account/orders/${order.id}`} className="mt-4 inline-flex text-sm font-semibold text-moss hover:text-ink">
                View order details
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-ink/10 bg-white p-8 text-center shadow-sm">
          <p className="font-serif text-3xl font-bold text-ink">No orders to track yet</p>
          <p className="mt-3 text-sm leading-6 text-ink/65">
            When you buy a camera from Shutterbug, tracking and fulfillment updates will appear here.
          </p>
          <Link href="/shop" className="mt-6 inline-flex min-h-12 items-center rounded-full bg-forest px-6 text-sm font-semibold text-white">
            Shop cameras
          </Link>
        </div>
      )}
    </AccountFeaturePage>
  );
}
