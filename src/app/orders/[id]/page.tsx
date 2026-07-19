import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ClearCartOnSuccess } from '@/components/cart/ClearCartOnSuccess';
import { formatCents } from '@/lib/money';
import { orderStatusClassName, orderStatusLabel } from '@/lib/order-status';
import { getPrisma } from '@/lib/prisma';

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata = {
  title: 'Order Summary'
};

function asString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

export default async function OrderSummaryPage({ params, searchParams }: Props) {
  const { id } = await params;
  const query = searchParams ? await searchParams : {};
  const prisma = getPrisma();
  if (!prisma) notFound();

  const order = await prisma.order.findFirst({
    where: { OR: [{ id }, { orderNumber: id }] },
    include: { items: true, history: { orderBy: { createdAt: 'desc' } } }
  });

  if (!order) notFound();

  const created = asString(query.created) === '1';

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      {created ? <ClearCartOnSuccess /> : null}
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
          <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-moss">Order summary</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <h1 className="font-serif text-4xl font-bold text-ink">Order {order.orderNumber}</h1>
              <span className={orderStatusClassName(order.status)}>{orderStatusLabel(order.status)}</span>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-ink/65">
              This order has been created for review. Payment has not been collected yet, and inventory will not be
              deducted until a later payment-confirmation step is completed.
            </p>

            <div className="mt-6 grid gap-3">
              {order.items.map((item) => (
                <div key={item.id} className="grid gap-3 rounded-lg bg-cream p-3 sm:grid-cols-[5rem_1fr_auto] sm:items-center">
                  <Image
                    src={item.imageUrl ?? '/placeholder-camera.svg'}
                    alt={item.productTitle}
                    width={80}
                    height={80}
                    sizes="5rem"
                    unoptimized={
                      (item.imageUrl ?? '/placeholder-camera.svg').endsWith('.svg') ||
                      (item.imageUrl ?? '').startsWith('http')
                    }
                    className="aspect-square rounded-lg bg-sand object-contain"
                  />
                  <div>
                    <p className="font-semibold text-ink">{item.productTitle}</p>
                    <p className="mt-1 text-sm text-ink/60">
                      {item.productSku ? `${item.productSku} | ` : ''}
                      Qty {item.quantity} | {item.conditionLabel}
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
              {order.customerPhone ? <p className="text-sm text-ink/70">{order.customerPhone}</p> : null}
            </div>

            <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
              <p className="font-serif text-xl font-bold text-ink">Totals</p>
              <div className="mt-4 grid gap-2 text-sm text-ink/70">
                <PriceRow label="Subtotal" value={formatCents(order.subtotalCents, order.currency)} />
                <PriceRow label="Shipping" value={formatCents(order.shippingCents, order.currency)} />
                <PriceRow label="Tax" value={formatCents(order.taxCents, order.currency)} />
                <div className="mt-2 border-t border-ink/10 pt-3">
                  <PriceRow label="Total" value={formatCents(order.totalCents, order.currency)} strong />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
              <p className="font-serif text-xl font-bold text-ink">Next step</p>
              <p className="mt-3 text-sm leading-6 text-ink/65">
                Payment processing will be connected next. For now, this page confirms the pending order record and
                item snapshots.
              </p>
              <Link href="/contact" className="mt-4 inline-flex text-sm font-semibold text-moss hover:text-ink">
                Contact support
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
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
