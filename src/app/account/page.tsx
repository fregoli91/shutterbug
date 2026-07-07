import Link from 'next/link';
import { logoutAction } from './actions';
import { requireCustomer } from '@/lib/customer-auth';
import { formatCents } from '@/lib/money';
import { requirePrisma } from '@/lib/prisma';

export const metadata = {
  title: 'Customer Account'
};

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function asString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

const accountCards = [
  {
    href: '/account/likes',
    title: 'Liked products',
    copy: 'Review saved cameras, open product details, or remove items from your liked list.'
  },
  {
    href: '/account/orders',
    title: 'Orders',
    copy: 'View purchase history, order details, payment status, and fulfillment notes.'
  },
  {
    href: '/account/track',
    title: 'Track orders',
    copy: 'Check shipment status and tracking numbers when they are available.'
  },
  {
    href: '/account/payment-methods',
    title: 'Payment methods',
    copy: 'Review how secure checkout and saved payment options will work.'
  },
  {
    href: '/account/addresses',
    title: 'Saved addresses',
    copy: 'Keep future checkout details organized when address saving is enabled.'
  },
  {
    href: '/account/settings',
    title: 'Account settings',
    copy: 'Review your customer profile and sign out securely.'
  },
  {
    href: '/contact',
    title: 'Support',
    copy: 'Contact Shutterbug about an order, camera, return, or trade-in.'
  }
];

export default async function AccountPage({ searchParams }: Props) {
  const customer = await requireCustomer();
  const prisma = requirePrisma();
  const params = searchParams ? await searchParams : {};
  const status = asString(params.status);
  const [orderCount, likedCount, recentOrder] = await Promise.all([
    prisma.order.count({
      where: { OR: [{ customerId: customer.id }, { customerEmail: customer.email }] }
    }),
    prisma.customerProductLike.count({ where: { customerId: customer.id } }),
    prisma.order.findFirst({
      where: { OR: [{ customerId: customer.id }, { customerEmail: customer.email }] },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderNumber: true,
        createdAt: true,
        fulfillmentStatus: true,
        paymentStatus: true,
        totalCents: true,
        currency: true,
        trackingNumber: true
      }
    })
  ]);

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {status === 'verified' ? (
          <p className="mb-6 rounded-lg bg-mint p-4 text-sm font-semibold text-ink">
            Your email is verified. Welcome to your Shutterbug customer account.
          </p>
        ) : null}
        <div className="grid gap-8 lg:grid-cols-[1fr_18rem] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-moss">Customer account</p>
            <h1 className="mt-3 font-serif text-5xl font-bold text-ink">
              {customer.name ? `Welcome back, ${customer.name}` : 'Welcome back'}
            </h1>
            <p className="mt-4 max-w-3xl leading-7 text-ink/70">
              Track orders, review purchase history, manage account details, and contact Shutterbug support from one
              customer dashboard.
            </p>
          </div>
          <img
            src="/shutterbug-basic-character.png"
            alt=""
            className="aspect-square w-full rounded-lg border border-ink/10 bg-sand object-cover object-center shadow-sm"
          />
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <AccountStat label="Orders" value={String(orderCount)} />
          <AccountStat label="Liked products" value={String(likedCount)} />
          <AccountStat label="Email status" value={customer.emailVerifiedAt ? 'Verified' : 'Needs verification'} />
        </div>

        {recentOrder ? (
          <div className="mt-6 rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-moss">Latest order</p>
                <p className="mt-1 font-serif text-2xl font-bold text-ink">Order {recentOrder.orderNumber}</p>
                <p className="mt-1 text-sm text-ink/60">
                  {recentOrder.createdAt.toLocaleDateString('en-US')} | {recentOrder.paymentStatus} |{' '}
                  {recentOrder.fulfillmentStatus}
                </p>
              </div>
              <div className="grid gap-2 sm:justify-items-end">
                <p className="text-lg font-bold text-forest">
                  {formatCents(recentOrder.totalCents, recentOrder.currency)}
                </p>
                <p className="text-sm text-ink/60">
                  Tracking: {recentOrder.trackingNumber || 'Not added yet'}
                </p>
              </div>
            </div>
            <Link
              href={`/account/orders/${recentOrder.id}`}
              className="mt-4 inline-flex min-h-11 items-center rounded-full bg-forest px-5 text-sm font-semibold text-white transition hover:bg-moss"
            >
              View latest order
            </Link>
          </div>
        ) : null}

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {accountCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-moss/35 hover:shadow-soft"
            >
              <p className="font-serif text-3xl font-bold text-ink">{card.title}</p>
              <p className="mt-3 text-sm leading-6 text-ink/65">{card.copy}</p>
            </Link>
          ))}
          <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
            <p className="font-serif text-3xl font-bold text-ink">Profile</p>
            <div className="mt-3 grid gap-1 text-sm leading-6 text-ink/65">
              <p>{customer.email}</p>
              <p>Account created {customer.createdAt.toLocaleDateString('en-US')}</p>
            </div>
            <form action={logoutAction} className="mt-5">
              <button className="rounded-full border border-ink/15 bg-cream px-5 py-3 text-sm font-semibold text-ink transition hover:border-moss hover:text-moss">
                Log out
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function AccountStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-moss">{label}</p>
      <p className="mt-2 font-serif text-3xl font-bold text-ink">{value}</p>
    </div>
  );
}
