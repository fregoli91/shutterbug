import Image from 'next/image';
import Link from 'next/link';
import { CheckoutFormClient } from '@/components/checkout/CheckoutFormClient';
import { isCheckoutAvailable } from '@/lib/checkout-availability';
import { getCustomerSession } from '@/lib/customer-auth';

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata = {
  title: 'Checkout'
};

function asString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

export default async function CheckoutPage({ searchParams }: Props) {
  if (!isCheckoutAvailable()) {
    return (
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-lg border border-ink/10 bg-white p-8 text-center shadow-sm sm:p-12">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-moss">Checkout</p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-ink">Online purchases are coming soon</h1>
          <p className="mx-auto mt-4 max-w-xl leading-7 text-ink/65">
            Shutterbug is still preparing secure online checkout. You can browse the store and save items to your bag in the meantime.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/shop" className="inline-flex min-h-12 items-center rounded-full bg-forest px-7 font-bold text-white hover:bg-moss">Browse the store</Link>
            <Link href="/bag" className="inline-flex min-h-12 items-center rounded-full border border-ink/15 px-7 font-bold text-moss hover:bg-cream">Return to bag</Link>
          </div>
        </div>
      </section>
    );
  }

  const customer = await getCustomerSession();
  const params = searchParams ? await searchParams : {};

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link href="/bag" className="mb-5 inline-flex text-sm font-bold text-moss hover:underline">← Back to Bag</Link>
        <div className="mb-8 grid gap-5 lg:grid-cols-[1fr_24rem] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-moss">Checkout</p>
            <h1 className="mt-3 font-serif text-4xl font-bold text-ink">Create a pending Shutterbug order</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/65">
              Confirm your contact and shipping details, then continue to secure payment.
            </p>
          </div>
          <Image
            src="/shutterbug-checkout.png"
            alt="Shutterbug character heading to checkout with a camera"
            width={900}
            height={675}
            sizes="(min-width: 1024px) 24rem, 100vw"
            className="aspect-[4/3] w-full rounded-lg border border-ink/10 bg-sand object-cover object-center shadow-sm"
          />
        </div>
        <CheckoutFormClient
          defaultName={customer?.name ?? ''}
          defaultEmail={customer?.email ?? ''}
          error={asString(params.error)}
        />
      </div>
    </section>
  );
}
