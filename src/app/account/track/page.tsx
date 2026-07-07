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
              <div className="mt-4 grid gap-3 rounded-lg bg-cream p-4 text-sm leading-6 text-ink/68">
                <TrackingSteps paymentStatus={order.paymentStatus} fulfillmentStatus={order.fulfillmentStatus} trackingNumber={order.trackingNumber} />
                <div>
                  <p className="font-semibold text-ink">Items</p>
                  <p>{order.items.map((item) => item.productTitle).join(', ')}</p>
                </div>
              </div>
              <Link href={`/account/orders/${order.id}`} className="mt-4 inline-flex min-h-11 items-center rounded-full bg-forest px-5 text-sm font-semibold text-white transition hover:bg-moss">
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

function TrackingSteps({
  paymentStatus,
  fulfillmentStatus,
  trackingNumber
}: {
  paymentStatus: string;
  fulfillmentStatus: string;
  trackingNumber: string | null;
}) {
  const paid = paymentStatus === 'PAID';
  const shipped = fulfillmentStatus === 'SHIPPED';
  const fulfilled = fulfillmentStatus === 'FULFILLED';
  const canceled = fulfillmentStatus === 'CANCELED';
  const steps = [
    { label: 'Payment confirmed', complete: paid },
    { label: 'Preparing camera', complete: paid && !canceled },
    { label: 'Tracking added', complete: Boolean(trackingNumber) || shipped || fulfilled },
    { label: 'Shipped', complete: shipped || fulfilled }
  ];

  return (
    <div>
      <div className="grid gap-2 sm:grid-cols-4">
        {steps.map((step) => (
          <div
            key={step.label}
            className={step.complete ? 'rounded-lg bg-mint p-3 font-semibold text-forest' : 'rounded-lg bg-white p-3 text-ink/58'}
          >
            {step.label}
          </div>
        ))}
      </div>
      <p className="mt-3">
        <span className="font-semibold text-ink">Tracking:</span> {trackingNumber || 'Not added yet'}
      </p>
    </div>
  );
}
