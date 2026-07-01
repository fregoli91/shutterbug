import Link from 'next/link';

export const metadata = {
  title: 'Checkout Canceled'
};

export default function CheckoutCancelPage() {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl rounded-lg border border-ink/10 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-moss">Checkout</p>
        <h1 className="mt-3 font-serif text-4xl font-bold text-ink">Checkout canceled</h1>
        <p className="mt-4 leading-7 text-ink/70">
          No payment was completed. Your cart is still saved on this device, and the item remains available unless
          another customer purchases it first.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/cart" className="rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white">
            Return to cart
          </Link>
          <Link href="/shop" className="rounded-full border border-ink/15 bg-white px-5 py-3 text-sm font-semibold text-ink">
            Keep shopping
          </Link>
        </div>
      </div>
    </section>
  );
}
