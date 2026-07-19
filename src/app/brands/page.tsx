import Link from 'next/link';
import type { Metadata } from 'next';
import { getBrandPages } from '@/lib/brands';
import { site } from '@/lib/seo';
import { buildBreadcrumbJsonLd, buildCollectionPageJsonLd, jsonLdGraph } from '@/lib/seo-utils';

export const metadata: Metadata = {
  title: 'Camera Brands',
  description:
    'Browse used Canon, Nikon, Olympus, Sony, Kodak, Fujifilm, Panasonic, Pentax, Minolta, Leica, Polaroid, and HP camera listings at Shutterbug Camera Shop.',
  alternates: { canonical: '/brands' },
  openGraph: {
    title: 'Camera Brands | Shutterbug Camera Shop',
    description:
      'Find tested used cameras and gear by brand, with real photos, condition notes, and clear availability.',
    url: `${site.domain}/brands`,
    type: 'website'
  }
};

export default async function BrandsPage() {
  const brands = await getBrandPages();
  const structuredData = jsonLdGraph([
    buildCollectionPageJsonLd({
      name: 'Camera Brands',
      description: metadata.description as string,
      url: '/brands'
    }),
    buildBreadcrumbJsonLd([
      { name: 'Home', url: '/' },
      { name: 'Brands', url: '/brands' }
    ])
  ]);

  return (
    <section className="bg-cream px-4 py-14 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-moss">Shop by brand</p>
            <h1 className="mt-3 font-serif text-5xl font-bold tracking-tight text-ink sm:text-6xl">
              Used cameras by brand.
            </h1>
            <p className="mt-5 text-lg leading-8 text-ink/70">
              Browse Shutterbug inventory and restock paths for popular camera brands. Each product listing is built
              around real availability, clear condition notes, included accessories, and testing details.
            </p>
          </div>
          <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
            <img
              src="/shutterbug-accent-camera.png"
              alt=""
              className="mb-5 aspect-square w-full rounded-lg bg-sand object-cover object-center"
            />
            <p className="font-serif text-2xl font-bold text-ink">Camera-first browsing</p>
            <p className="mt-3 text-sm leading-6 text-ink/68">
              Brand pages stay useful even when a one-off item sells out, so shoppers can find similar gear or ask
              Shutterbug to source a specific model.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/brands/${brand.slug}`}
              className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-moss/35 hover:shadow-soft"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-serif text-2xl font-bold text-ink">{brand.name}</p>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-ink/66">{brand.description}</p>
                </div>
                <span className="shrink-0 rounded-full bg-mint px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-forest">
                  {brand.products.length ? `${brand.products.length} item${brand.products.length === 1 ? '' : 's'}` : 'Restock'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
