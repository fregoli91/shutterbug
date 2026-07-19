import Link from 'next/link';
import Image from 'next/image';
import { ClearCartOnSuccess } from '@/components/cart/ClearCartOnSuccess';
import { getCustomerSession } from '@/lib/customer-auth';
import { formatCents } from '@/lib/money';
import { getPrisma } from '@/lib/prisma';

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata = {
  title: 'Checkout Success'
};

function asString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const params = searchParams ? await searchParams : {};
  const sessionId = asString(params.session_id);
  const prisma = getPrisma();
  const customer = await getCustomerSession();
  const order =
    prisma && sessionId
      ? await prisma.order.findUnique({ where: { providerReference: sessionId }, include: { items: true } })
      : null;

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <ClearCartOnSuccess />
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm lg:grid-cols-[20rem_1fr]">
        <Image
          src="/shutterbug-checkout-success.png"
          alt="Shutterbug order complete celebration"
          width={640}
          height={768}
          sizes="(min-width: 1024px) 20rem, 100vw"
          className="h-full min-h-72 w-full bg-sand object-cover object-center"
        />
        <div className="p-8">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-moss">Checkout</p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-ink">Thank you for your order</h1>
          <p className="mt-4 leading-7 text-ink/70">
            Stripe has returned you to Shutterbug Camera Shop. Payment confirmation is finalized by webhook, and your
            order status will update automatically.
          </p>

          {order ? (
            <div className="mt-6 rounded-lg bg-cream p-5">
              <p className="font-semibold text-ink">Order {order.orderNumber}</p>
              <p className="mt-2 text-sm text-ink/70">
                {order.paymentStatus} - Total {formatCents(order.totalCents, order.currency)}
              </p>
              <div className="mt-4 grid gap-2 text-sm text-ink/70">
                {order.items.map((item) => (
                  <p key={item.id}>
                    {item.quantity} x {item.productTitle}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-6 rounded-lg bg-cream p-4 text-sm text-ink/70">
              Order details will appear here after database and webhook configuration are connected.
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/shop" className="rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white">
              Continue shopping
            </Link>
            <Link
              href={customer ? '/account/orders' : '/signup?redirect=/account/orders'}
              className="rounded-full border border-moss/30 bg-mint px-5 py-3 text-sm font-semibold text-ink"
            >
              {customer ? 'View order history' : 'Create account'}
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-ink/15 bg-white px-5 py-3 text-sm font-semibold text-ink"
            >
              Contact support
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
