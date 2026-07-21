import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  markOrderCancelledAction,
  markOrderDeliveredAction,
  markOrderProcessingAction,
  markOrderRefundedAction,
  markOrderShippedAction,
  updateOrderFulfillmentDetailsAction
} from '@/app/admin/actions';
import { AdminShell } from '@/components/admin/AdminShell';
import { OrderStatus, PaymentStatus } from '@/generated/prisma/client';
import { requireAdmin } from '@/lib/admin-auth';
import { formatCents } from '@/lib/money';
import { orderStatusClassName, orderStatusLabel } from '@/lib/order-status';
import { getPrisma } from '@/lib/prisma';

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata = {
  title: 'Order Details'
};

const notices: Record<string, string> = {
  saved: 'Fulfillment details saved.',
  processing: 'Order marked processing.',
  shipped: 'Order marked shipped. A customer shipping email will send once if email is configured.',
  delivered: 'Order marked delivered.',
  cancelled: 'Order marked cancelled.',
  refunded: 'Order marked refunded in Shutterbug admin.'
};

const errors: Record<string, string> = {
  'tracking-required': 'Add a tracking number before marking the order shipped.',
  'invalid-transition': 'That status change is not allowed for the current order state.',
  'cancel-paid-order': 'Paid orders should be marked refunded instead of cancelled.'
};

function asString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

function formatDate(value: Date | null) {
  return value ? value.toLocaleString('en-US') : 'Not set';
}

export default async function AdminOrderDetailPage({ params, searchParams }: Props) {
  await requireAdmin();
  const { id } = await params;
  const query = searchParams ? await searchParams : {};
  const prisma = getPrisma();
  if (!prisma) notFound();
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, history: { orderBy: { createdAt: 'desc' } } }
  });
  if (!order) notFound();

  const notice = notices[asString(query.saved)] ?? notices[asString(query.processing)] ?? notices[asString(query.shipped)] ??
    notices[asString(query.delivered)] ?? notices[asString(query.cancelled)] ?? notices[asString(query.refunded)];
  const error = errors[asString(query.error)];
  const unfulfillableStatuses: OrderStatus[] = [OrderStatus.PENDING_PAYMENT, OrderStatus.CANCELLED, OrderStatus.REFUNDED];
  const fulfilledStatuses: OrderStatus[] = [OrderStatus.SHIPPED, OrderStatus.DELIVERED];
  const terminalStatuses: OrderStatus[] = [OrderStatus.SHIPPED, OrderStatus.DELIVERED, OrderStatus.REFUNDED, OrderStatus.CANCELLED];
  const canFulfill = order.paymentStatus === PaymentStatus.PAID && !unfulfillableStatuses.includes(order.status);
  const canProcess = canFulfill && !fulfilledStatuses.includes(order.status);
  const canShip = canFulfill && order.status !== OrderStatus.DELIVERED;
  const canDeliver = order.paymentStatus === PaymentStatus.PAID && fulfilledStatuses.includes(order.status);
  const canCancel =
    order.paymentStatus !== PaymentStatus.PAID &&
    !terminalStatuses.includes(order.status);
  const canRefund = order.paymentStatus === PaymentStatus.PAID && order.status !== OrderStatus.PENDING_PAYMENT;

  return (
    <AdminShell>
      <div className="grid gap-6 lg:grid-cols-[1fr_24rem]">
        <div className="grid gap-5">
          <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-moss">Order</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-ink">{order.orderNumber}</h2>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className={orderStatusClassName(order.status)}>{orderStatusLabel(order.status)}</span>
              <p className="text-sm text-ink/65">
                {order.paymentStatus} | {order.fulfillmentStatus}
              </p>
            </div>
            {notice ? <p className="mt-4 rounded-lg bg-mint p-3 text-sm font-semibold text-forest">{notice}</p> : null}
            {error ? <p className="mt-4 rounded-lg bg-sand p-3 text-sm font-semibold text-ink">{error}</p> : null}

            <div className="mt-6 grid gap-3">
              {order.items.map((item) => (
                <div key={item.id} className="grid gap-3 rounded-lg bg-cream p-3 sm:grid-cols-[4rem_1fr_auto]">
                  <Image
                    src={item.imageUrl ?? '/placeholder-camera.svg'}
                    alt={item.productTitle}
                    width={64}
                    height={64}
                    sizes="4rem"
                    unoptimized={
                      (item.imageUrl ?? '/placeholder-camera.svg').endsWith('.svg') ||
                      (item.imageUrl ?? '').startsWith('http')
                    }
                    className="aspect-square rounded-lg bg-white object-contain"
                  />
                  <div>
                    <p className="font-semibold text-ink">{item.productTitle}</p>
                    <p className="text-sm text-ink/60">
                      {item.productSku ? `${item.productSku} | ` : ''}
                      Qty {item.quantity} | {item.conditionLabel}
                    </p>
                  </div>
                  <p className="font-bold text-ink">{formatCents(item.totalPriceCents, order.currency)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
            <p className="font-serif text-2xl font-bold text-ink">Fulfillment workflow</p>
            <p className="mt-2 text-sm leading-6 text-ink/65">
              Save tracking details first or use the shipped button to save them and email the customer in one step.
              Refund actions only update Shutterbug status for now; process Stripe refunds separately.
            </p>

            <form action={updateOrderFulfillmentDetailsAction} className="mt-5 grid gap-4">
              <input type="hidden" name="id" value={order.id} />
              <Field label="Carrier" name="carrier" defaultValue={order.carrier ?? ''} placeholder="USPS, UPS, FedEx" />
              <Field label="Tracking number" name="trackingNumber" defaultValue={order.trackingNumber ?? ''} />
              <Field label="Tracking URL" name="trackingUrl" defaultValue={order.trackingUrl ?? ''} type="url" />
              <label className="grid gap-2 text-sm font-semibold text-ink">
                Admin notes
                <textarea
                  name="adminNotes"
                  defaultValue={order.adminNotes ?? ''}
                  rows={4}
                  className="rounded-lg border border-ink/15 bg-cream px-3 py-3 text-sm font-normal outline-none focus:border-moss"
                />
              </label>

              <div className="grid gap-2 sm:grid-cols-2">
                <button className="min-h-11 rounded-full bg-forest px-4 text-sm font-semibold text-white">
                  Save fulfillment details
                </button>
                <button
                  formAction={markOrderProcessingAction}
                  disabled={!canProcess}
                  className="min-h-11 rounded-full border border-moss/30 bg-mint px-4 text-sm font-semibold text-ink disabled:opacity-45"
                >
                  Mark processing
                </button>
                <button
                  formAction={markOrderShippedAction}
                  disabled={!canShip}
                  className="min-h-11 rounded-full border border-moss/30 bg-mint px-4 text-sm font-semibold text-ink disabled:opacity-45"
                >
                  Mark shipped + email customer
                </button>
                <button
                  formAction={markOrderDeliveredAction}
                  disabled={!canDeliver}
                  className="min-h-11 rounded-full border border-moss/30 bg-mint px-4 text-sm font-semibold text-ink disabled:opacity-45"
                >
                  Mark delivered
                </button>
                <button
                  formAction={markOrderCancelledAction}
                  disabled={!canCancel}
                  className="min-h-11 rounded-full border border-ink/15 bg-white px-4 text-sm font-semibold text-ink disabled:opacity-45"
                >
                  Mark cancelled
                </button>
                <button
                  formAction={markOrderRefundedAction}
                  disabled={!canRefund}
                  className="min-h-11 rounded-full border border-ink/15 bg-white px-4 text-sm font-semibold text-ink disabled:opacity-45"
                >
                  Mark refunded
                </button>
              </div>
            </form>
          </div>

          {order.history.length ? (
            <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
              <p className="font-serif text-2xl font-bold text-ink">Order history</p>
              <div className="mt-4 grid gap-3">
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

        <aside className="grid content-start gap-4">
          <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
            <p className="font-serif text-xl font-bold text-ink">Customer</p>
            <p className="mt-3 text-sm text-ink/70">{order.customerName || 'Name pending'}</p>
            <p className="text-sm text-ink/70">{order.customerEmail}</p>
            {order.customerPhone ? <p className="text-sm text-ink/70">{order.customerPhone}</p> : null}
            <pre className="mt-4 whitespace-pre-wrap rounded-lg bg-cream p-3 text-xs text-ink/70">
              {order.shippingAddress ? JSON.stringify(order.shippingAddress, null, 2) : 'Shipping address pending'}
            </pre>
          </div>

          <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
            <p className="font-serif text-xl font-bold text-ink">Tracking</p>
            <div className="mt-3 grid gap-2 text-sm text-ink/70">
              <p><span className="font-semibold text-ink">Carrier:</span> {order.carrier || 'Not set'}</p>
              <p><span className="font-semibold text-ink">Tracking:</span> {order.trackingNumber || 'Not set'}</p>
              {order.trackingUrl ? (
                <a href={order.trackingUrl} target="_blank" rel="noreferrer" className="font-semibold text-moss hover:text-ink">
                  Open tracking link
                </a>
              ) : null}
            </div>
            <div className="mt-4 grid gap-1 text-xs text-ink/60">
              <p>Shipping email: {order.shippingEmailSentAt ? order.shippingEmailSentAt.toLocaleString('en-US') : 'Not sent'}</p>
              <p>Customer paid email: {order.customerEmailSentAt ? order.customerEmailSentAt.toLocaleString('en-US') : 'Not sent'}</p>
              <p>Admin paid email: {order.adminEmailSentAt ? order.adminEmailSentAt.toLocaleString('en-US') : 'Not sent'}</p>
            </div>
          </div>

          <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
            <p className="font-serif text-xl font-bold text-ink">Timestamps</p>
            <div className="mt-3 grid gap-1 text-sm text-ink/70">
              <p>Processing: {formatDate(order.processingAt)}</p>
              <p>Shipped: {formatDate(order.shippedAt)}</p>
              <p>Delivered: {formatDate(order.deliveredAt)}</p>
              <p>Cancelled: {formatDate(order.cancelledAt)}</p>
              <p>Refunded: {formatDate(order.refundedAt)}</p>
            </div>
          </div>

          {order.stripeCheckoutSessionId || order.stripePaymentIntentId ? (
            <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
              <p className="font-serif text-xl font-bold text-ink">Stripe</p>
              {order.stripeCheckoutSessionId ? (
                <p className="mt-3 break-all text-xs text-ink/60">Session: {order.stripeCheckoutSessionId}</p>
              ) : null}
              {order.stripePaymentIntentId ? (
                <p className="mt-2 break-all text-xs text-ink/60">Payment intent: {order.stripePaymentIntentId}</p>
              ) : null}
            </div>
          ) : null}

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

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  type = 'text'
}: {
  label: string;
  name: string;
  defaultValue: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-ink">
      {label}
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="min-h-11 rounded-lg border border-ink/15 bg-cream px-3 text-sm font-normal outline-none focus:border-moss"
      />
    </label>
  );
}
