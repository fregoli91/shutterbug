import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Shipping Policy',
  description: 'Shipping, packing, and delivery information for Shutterbug Camera Shop orders.'
};

const packingPromises = [
  'Cameras are packed with protective materials for transit.',
  'Loose batteries, chargers, straps, and accessories are secured when included.',
  'Higher-value or fragile items may receive extra packing attention before shipment.'
];

const shippingNotes = [
  {
    title: 'Where we ship',
    copy: 'Shutterbug checkout is currently built for United States shipping. If a delivery address needs special review, contact customer service before checkout.'
  },
  {
    title: 'Processing time',
    copy: 'Orders are reviewed before shipment so the purchased item, included accessories, and condition notes match the listing.'
  },
  {
    title: 'Tracking',
    copy: 'When tracking is added by the Shutterbug team, it will appear in your account order history and tracking page.'
  },
  {
    title: 'Address accuracy',
    copy: 'Use a delivery address where camera gear can be received safely. Contact support quickly if an address needs attention after checkout.'
  }
];

export default function ShippingPage() {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_30rem] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-moss">Shipping</p>
            <h1 className="mt-3 font-serif text-5xl font-bold text-ink">Packed with care, shipped with tracking.</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-ink/72">
              Used and vintage cameras deserve careful handling. Shutterbug reviews each paid order before fulfillment
              and keeps tracking connected to your account when available.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/account/track" className="inline-flex min-h-11 items-center justify-center rounded-full bg-forest px-6 text-sm font-semibold text-white transition hover:bg-moss">
                Track an order
              </Link>
              <Link href="/contact" className="inline-flex min-h-11 items-center justify-center rounded-full border border-ink/15 bg-white px-6 text-sm font-semibold text-ink transition hover:border-moss hover:text-moss">
                Ask about shipping
              </Link>
            </div>
          </div>
          <Image
            src="/shutterbug-checkout.png"
            alt="Shutterbug mascot driving a camera order for checkout and shipping"
            width={900}
            height={675}
            sizes="(min-width: 1024px) 30rem, 100vw"
            className="aspect-[4/3] w-full rounded-lg border border-ink/10 bg-sand object-cover object-center shadow-sm"
          />
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {shippingNotes.map((note) => (
            <article key={note.title} className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
              <p className="font-serif text-2xl font-bold text-ink">{note.title}</p>
              <p className="mt-3 text-sm leading-6 text-ink/68">{note.copy}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-6 rounded-lg border border-ink/10 bg-cream p-6 shadow-soft lg:grid-cols-[1fr_24rem] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-moss">Packing standards</p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-ink">Real gear, handled like real gear.</h2>
            <ul className="mt-5 grid list-disc gap-3 pl-5 text-sm leading-6 text-ink/70">
              {packingPromises.map((promise) => (
                <li key={promise}>{promise}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-ink/10 bg-white p-5 text-sm leading-6 text-ink/68">
            <p className="font-semibold text-ink">Before checkout</p>
            <p className="mt-2">
              Review the product page for included accessories, flaws, parts/repair notes, and item-specific shipping
              notes. Product-specific notes should control when they differ from general policy language.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
