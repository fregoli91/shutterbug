import Link from 'next/link';
import type { Metadata } from 'next';
import { site } from '@/lib/seo';
import { buildBreadcrumbJsonLd, jsonLdGraph } from '@/lib/seo-utils';

export const metadata: Metadata = {
  title: 'Used Cameras in Michigan',
  description:
    'Shop used digital and film cameras from Shutterbug Camera Shop with tested listings, honest condition notes, trade-in help, and friendly support for Michigan buyers.',
  alternates: { canonical: '/used-cameras-michigan' },
  openGraph: {
    title: 'Used Cameras in Michigan | Shutterbug Camera Shop',
    description:
      'Find tested vintage digital cameras, film cameras, accessories, and trade-in help from Shutterbug Camera Shop.',
    url: `${site.domain}/used-cameras-michigan`,
    type: 'website'
  }
};

const highlights = [
  'Tested vintage digital and film cameras',
  'Clear included-accessory and flaw notes',
  'Trade-in and buyout review for used gear',
  'Friendly customer service before and after checkout'
];

export default function UsedCamerasMichiganPage() {
  const structuredData = jsonLdGraph([
    {
      '@type': 'WebPage',
      name: 'Used Cameras in Michigan',
      description: metadata.description,
      url: `${site.domain}/used-cameras-michigan`,
      isPartOf: { '@id': `${site.domain}/#website` },
      about: { '@id': `${site.domain}/#organization` }
    },
    buildBreadcrumbJsonLd([
      { name: 'Home', url: '/' },
      { name: 'Used Cameras in Michigan', url: '/used-cameras-michigan' }
    ])
  ]);

  return (
    <section className="bg-cream px-4 py-14 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_34rem] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-moss">Michigan camera buyers</p>
            <h1 className="mt-3 font-serif text-5xl font-bold tracking-tight text-ink sm:text-6xl">
              Used cameras, checked before they ship.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-ink/72">
              Shutterbug Camera Shop helps Michigan shoppers and online buyers find vintage digital cameras, film
              cameras, lenses, accessories, and parts/repair gear with honest notes and clear availability.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-forest px-6 text-sm font-semibold text-white transition hover:bg-moss"
              >
                Shop used cameras
              </Link>
              <Link
                href="/sell-your-camera"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-ink/15 bg-white px-6 text-sm font-semibold text-ink transition hover:border-moss hover:text-moss"
              >
                Sell or trade in gear
              </Link>
            </div>
          </div>
          <img
            src="/shutterbug-storefront.png"
            alt="Shutterbug Camera Shop storefront with camera gear"
            className="aspect-[4/3] w-full rounded-lg border border-ink/10 bg-sand object-cover object-center shadow-sm"
          />
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((highlight) => (
            <div key={highlight} className="rounded-lg border border-ink/10 bg-white p-5 text-sm font-semibold text-ink/72 shadow-sm">
              {highlight}
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-lg border border-ink/10 bg-white p-6 shadow-sm lg:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-moss">Local trust, online checkout</p>
          <h2 className="mt-3 font-serif text-3xl font-bold text-ink">A better way to buy used camera gear.</h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-ink/70">
            Used camera listings should not feel mysterious. Shutterbug pages are built to show what the item is, what
            was tested, what is included, what flaws are visible, and whether a camera is ready to shoot or better
            suited for repair. For local questions, call {site.supportPhone} or contact support online.
          </p>
        </div>
      </div>
    </section>
  );
}
