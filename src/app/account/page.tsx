import Link from 'next/link';
import { logoutAction } from './actions';
import { requireCustomer } from '@/lib/customer-auth';

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
  const params = searchParams ? await searchParams : {};
  const status = asString(params.status);

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
