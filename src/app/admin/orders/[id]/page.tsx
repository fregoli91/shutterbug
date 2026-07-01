import { notFound } from 'next/navigation';
import { markOrderShippedAction } from '@/app/admin/actions';
import { AdminShell } from '@/components/admin/AdminShell';
import { requireAdmin } from '@/lib/admin-auth';
import { formatCents } from '@/lib/money';
import { getPrisma } from '@/lib/prisma';

type Props = { params: Promise<{ id: string }> };

export const metadata = {
  title: 'Order Details'
};

export default async function AdminOrderDetailPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  const prisma = getPrisma();
  if (!prisma) notFound();
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, history: { orderBy: { createdAt: 'desc' } } }
  });
  if (!order) notFound();

  return (
    <AdminShell>
      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-moss">Order</p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-ink">{order.orderNumber}</h2>
          <p className="mt-2 text-sm text-ink/65">
            {order.paymentStatus} · {order.fulfillmentStatus}
          </p>

          <div className="mt-6 grid gap-3">
            {order.items.map((item) => (
              <div key={item.id} className="grid gap-3 rounded-lg bg-cream p-3 sm:grid-cols-[4rem_1fr_auto]">
                <img src={item.imageUrl ?? '/placeholder-camera.svg'} alt="" className="aspect-square rounded-lg bg-white object-contain" />
                <div>
                  <p className="font-semibold text-ink">{item.productTitle}</p>
                  <p className="text-sm text-ink/60">
                    Qty {item.quantity} · {item.conditionLabel}
                  </p>
                </div>
                <p className="font-bold text-ink">{formatCents(item.totalPriceCents, order.currency)}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="grid content-start gap-4">
          <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
            <p className="font-serif text-xl font-bold text-ink">Customer</p>
            <p className="mt-3 text-sm text-ink/70">{order.customerName || 'Name pending'}</p>
            <p className="text-sm text-ink/70">{order.customerEmail}</p>
            <pre className="mt-4 whitespace-pre-wrap rounded-lg bg-cream p-3 text-xs text-ink/70">
              {order.shippingAddress ? JSON.stringify(order.shippingAddress, null, 2) : 'Shipping address pending'}
            </pre>
          </div>

          <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
            <p className="font-serif text-xl font-bold text-ink">Fulfillment</p>
            <form action={markOrderShippedAction} className="mt-4 grid gap-3">
              <input type="hidden" name="id" value={order.id} />
              <input
                name="trackingNumber"
                defaultValue={order.trackingNumber ?? ''}
                placeholder="Tracking number"
                className="min-h-11 rounded-lg border border-ink/15 bg-cream px-3 text-sm outline-none focus:border-moss"
              />
              <button className="min-h-11 rounded-full bg-forest px-4 text-sm font-semibold text-white">
                Mark shipped
              </button>
            </form>
          </div>

          <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
            <p className="font-serif text-xl font-bold text-ink">Totals</p>
            <div className="mt-4 grid gap-2 text-sm text-ink/70">
              <p>Subtotal: {formatCents(order.subtotalCents, order.currency)}</p>
              <p>Shipping: {formatCents(order.shippingCents, order.currency)}</p>
              <p>Tax: {formatCents(order.taxCents, order.currency)}</p>
              <p className="font-bold text-ink">Total: {formatCents(order.totalCents, order.currency)}</p>
            </div>
          </div>
        </aside>
      </div>
    </AdminShell>
  );
}
