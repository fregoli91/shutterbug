import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { site } from '@/lib/seo';
import { buildBreadcrumbJsonLd, jsonLdGraph } from '@/lib/seo-utils';

export const metadata: Metadata = {
  title: 'Buyer Guarantee',
  description:
    'How Shutterbug Camera Shop builds buyer confidence with tested cameras, actual product photos, honest condition notes, secure checkout, and careful packing.',
  alternates: { canonical: '/buyer-guarantee' },
  openGraph: {
    title: 'Buyer Guarantee | Shutterbug Camera Shop',
    description:
      'Shop used cameras with real testing details, disclosed flaws, secure checkout, careful packing, and friendly support.',
    url: `${site.domain}/buyer-guarantee`,
    type: 'website'
  }
};

const promises = [
  {
    title: 'Tested when listed as tested',
    copy: 'Ready-to-shoot listings include practical checks such as power, buttons, screen, flash, zoom, storage, and photo playback when applicable.'
  },
  {
    title: 'Actual photos and honest notes',
    copy: 'Product pages are built around the exact item whenever possible, with cosmetic wear, included accessories, missing pieces, and known flaws called out clearly.'
  },
  {
    title: 'Parts/repair stays separate',
    copy: 'As-is repair items are marked before checkout and are not presented like ready-to-shoot cameras.'
  },
  {
    title: 'Secure checkout and support',
    copy: 'Payments are handled through trusted processors. Questions before or after purchase can go directly to Shutterbug support.'
  }
];

export default function BuyerGuaranteePage() {
  const structuredData = jsonLdGraph([
    {
      '@type': 'WebPage',
      name: 'Buyer Guarantee',
      description: metadata.description,
      url: `${site.domain}/buyer-guarantee`,
      isPartOf: { '@id': `${site.domain}/#website` },
      about: { '@id': `${site.domain}/#organization` }
    },
    buildBreadcrumbJsonLd([
      { name: 'Home', url: '/' },
      { name: 'Buyer Guarantee', url: '/buyer-guarantee' }
    ])
  ]);

  return (
    <section className="bg-cream px-4 py-14 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_34rem] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-moss">Buyer confidence</p>
            <h1 className="mt-3 font-serif text-5xl font-bold tracking-tight text-ink sm:text-6xl">
              Trusted cameras, honest service.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-ink/72">
              Used cameras can be wonderful, but the listing has to tell the truth. Shutterbug focuses on practical
              testing, clear condition notes, real availability, and friendly help before and after checkout.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-forest px-6 text-sm font-semibold text-white transition hover:bg-moss"
              >
                Shop tested cameras
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-ink/15 bg-white px-6 text-sm font-semibold text-ink transition hover:border-moss hover:text-moss"
              >
                Ask before you buy
              </Link>
            </div>
          </div>
          <Image
            src="/shutterbug-trust-banner.png"
            alt="Shutterbug trust promise with secure shopping, tested cameras, honest service, and careful handling"
            width={1600}
            height={1000}
            sizes="(min-width: 1024px) 34rem, 100vw"
            className="aspect-[4/3] w-full rounded-lg border border-ink/10 bg-cream object-contain object-center shadow-sm sm:aspect-[16/9]"
          />
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {promises.map((promise) => (
            <article key={promise.title} className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
              <p className="font-serif text-2xl font-bold text-ink">{promise.title}</p>
              <p className="mt-3 text-sm leading-6 text-ink/68">{promise.copy}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-6 rounded-lg border border-ink/10 bg-white p-6 shadow-sm lg:grid-cols-3 lg:p-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-moss">Before checkout</p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-ink">Every listing should answer the basics.</h2>
          </div>
          <ul className="grid gap-3 text-sm leading-6 text-ink/70 lg:col-span-2 sm:grid-cols-2">
            <li>What exact item is pictured.</li>
            <li>What was tested and what was not.</li>
            <li>What accessories are included.</li>
            <li>What flaws or limitations are known.</li>
            <li>Whether the item is ready to use or sold as-is.</li>
            <li>How to contact support before buying.</li>
          </ul>
        </div>

        <div className="mt-8 flex flex-col gap-3 rounded-lg border border-ink/10 bg-mint p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-serif text-2xl font-bold text-ink">Need help choosing?</p>
            <p className="mt-2 text-sm leading-6 text-ink/68">
              Send a question about a camera, battery, memory card, included accessories, or condition note.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-forest px-6 text-sm font-semibold text-white transition hover:bg-moss"
          >
            Contact Shutterbug
          </Link>
        </div>
      </div>
    </section>
  );
}
