import Image from 'next/image';
import { CartPageClient } from '@/components/cart/CartPageClient';

export const metadata = {
  title: 'Cart'
};

export default function CartPage() {
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 grid gap-5 lg:grid-cols-[1fr_24rem] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-moss">Cart</p>
            <h1 className="mt-3 font-serif text-4xl font-bold text-ink">Review your camera gear</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/65">
              Real tested inventory, current pricing, and quantity checks before the payment step is enabled.
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
        <CartPageClient />
      </div>
    </section>
  );
}
