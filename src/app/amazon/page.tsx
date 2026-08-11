import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { site } from '@/lib/seo';
import { buildBreadcrumbJsonLd, jsonLdGraph } from '@/lib/seo-utils';

export const metadata: Metadata = {
  title: 'Shutterbug Camera Shop on Amazon',
  description:
    'Find Shutterbug Camera Shop on Amazon or browse tested used cameras and gear directly at ShutterbugCameraShop.com.',
  alternates: { canonical: '/amazon' },
  openGraph: {
    title: 'Shutterbug Camera Shop on Amazon',
    description: 'Visit the established Shutterbug Amazon storefront or browse current inventory on our own shop.',
    url: `${site.domain}/amazon`,
    type: 'website',
    images: [{ url: '/shutterbug-amazon-store-banner.png', width: 2048, height: 682, alt: 'Visit Shutterbug Camera Shop on Amazon' }]
  }
};

export default function AmazonPage() {
  const structuredData = jsonLdGraph([
    {
      '@type': 'WebPage',
      name: 'Shutterbug Camera Shop on Amazon',
      description: metadata.description,
      url: `${site.domain}/amazon`,
      isPartOf: { '@id': `${site.domain}/#website` },
      about: { '@id': `${site.domain}/#organization` }
    },
    buildBreadcrumbJsonLd([
      { name: 'Home', url: '/' },
      { name: 'Shutterbug on Amazon', url: '/amazon' }
    ])
  ]);

  return (
    <main className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-moss">Another way to shop Shutterbug</p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-ink sm:text-6xl">Shop Shutterbug on Amazon.</h1>
          <p className="mt-5 text-lg leading-8 text-ink/70">
            Shutterbug Camera Shop also maintains an Amazon storefront. Inventory can differ between channels, so
            check both places when you are hunting for a particular used camera or piece of gear.
          </p>
        </header>

        <Image
          src="/shutterbug-amazon-store-banner.png"
          alt="Shutterbug Camera Shop banner inviting shoppers to visit its Amazon storefront"
          width={2048}
          height={682}
          priority
          sizes="(min-width: 1280px) 72rem, 100vw"
          className="mt-8 w-full rounded-lg border border-ink/10 bg-sand object-contain shadow-sm"
        />

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <section className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
            <h2 className="font-serif text-2xl font-bold text-ink">Visit our Amazon storefront</h2>
            <p className="mt-3 text-sm leading-7 text-ink/68">
              Use the verified storefront link below to view Shutterbug listings available through Amazon.
              Shutterbug Camera Shop is an independent business and is not owned or operated by Amazon.
            </p>
            {site.amazonStoreUrl ? (
              <a href={site.amazonStoreUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-12 items-center rounded-full bg-forest px-6 py-3 font-semibold text-white hover:bg-moss">
                Visit Shutterbug on Amazon
              </a>
            ) : null}
          </section>
          <section className="rounded-lg border border-ink/10 bg-mint p-6">
            <h2 className="font-serif text-2xl font-bold text-ink">Shop directly with Shutterbug</h2>
            <p className="mt-3 text-sm leading-7 text-ink/68">
              Browse current used cameras, printers, lenses, and accessories with exact-item availability and clear
              condition details on ShutterbugCameraShop.com.
            </p>
            <Link href="/shop" className="mt-5 inline-flex min-h-12 items-center rounded-full border border-forest px-6 py-3 font-semibold text-forest hover:bg-white">
              Browse Shutterbug inventory
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
