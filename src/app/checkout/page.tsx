import Image from 'next/image';
import { CheckoutFormClient } from '@/components/checkout/CheckoutFormClient';
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
  const customer = await getCustomerSession();
  const params = searchParams ? await searchParams : {};

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 grid gap-5 lg:grid-cols-[1fr_24rem] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-moss">Checkout</p>
            <h1 className="mt-3 font-serif text-4xl font-bold text-ink">Create a pending Shutterbug order</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/65">
              Confirm contact and shipping details, then create an order record for the next payment step.
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
