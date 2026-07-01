import { CartPageClient } from '@/components/cart/CartPageClient';

export const metadata = {
  title: 'Cart'
};

export default function CartPage() {
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-moss">Cart</p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-ink">Review your camera gear</h1>
        </div>
        <CartPageClient />
      </div>
    </section>
  );
}
