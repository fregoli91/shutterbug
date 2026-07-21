import Link from 'next/link';
import { AdminShell } from '@/components/admin/AdminShell';
import { requireAdmin } from '@/lib/admin-auth';
import { formatCents } from '@/lib/money';
import { orderStatusClassName, orderStatusLabel } from '@/lib/order-status';
import { getPrisma } from '@/lib/prisma';

export const metadata = {
  title: 'Admin Orders'
};

export default async function AdminOrdersPage() {
  await requireAdmin();
  const prisma = getPrisma();
  const orders = prisma
    ? await prisma.order.findMany({
        include: { items: true },
        orderBy: { createdAt: 'desc' },
        take: 50
      })
    : [];

  return (
    <AdminShell>
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-moss">Orders</p>
      <h2 className="mt-2 font-serif text-3xl font-bold text-ink">Manage orders</h2>

      <div className="mt-6 grid gap-3">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/admin/orders/${order.id}`}
            className="grid gap-2 rounded-lg border border-ink/10 bg-white p-4 shadow-sm transition hover:border-moss/40 md:grid-cols-[1fr_auto_auto]"
          >
            <div>
              <p className="font-semibold text-ink">{order.orderNumber}</p>
              <p className="mt-1 text-sm text-ink/60">
                {order.customerEmail} | {order.items.length} item{order.items.length === 1 ? '' : 's'}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-moss">
                {order.fulfillmentStatus.replace(/_/g, ' ')}
                {order.trackingNumber ? ` | ${order.carrier ? `${order.carrier} ` : ''}${order.trackingNumber}` : ''}
              </p>
              {order.shippingEmailSentAt ? (
                <p className="mt-1 text-xs text-ink/55">
                  Shipping email sent {order.shippingEmailSentAt.toLocaleDateString('en-US')}
                </p>
              ) : null}
            </div>
            <span className={orderStatusClassName(order.status)}>{orderStatusLabel(order.status)}</span>
            <p className="font-bold text-ink">{formatCents(order.totalCents, order.currency)}</p>
          </Link>
        ))}
        {orders.length === 0 ? (
          <div className="rounded-lg border border-ink/10 bg-white p-6 text-sm leading-6 text-ink/70 shadow-sm">
            No orders yet. Pending checkout orders will appear here after customers complete the review step.
          </div>
        ) : null}
      </div>
    </AdminShell>
  );
}
